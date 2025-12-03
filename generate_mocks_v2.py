import pandas as pd
import json
import numpy as np
import traceback

def clean_str(x):
    if pd.isna(x): return ""
    return str(x).strip()

def clean_float(x):
    if pd.isna(x): return 0
    return float(x)

def clean_list(x):
    if pd.isna(x): return []
    return [s.strip() for s in str(x).split(',') if s.strip()]

def clean_name(name):
    if pd.isna(name): return ""
    return str(name).strip().replace(" ", "")

def generate_mocks():
    print("Starting mock generation...")
    
    # 1. Load Data
    try:
        total_df = pd.read_excel('total_df.xlsx')
        ntis_df = pd.read_excel('ntis_results.xlsx')
        print("Files loaded successfully.")
    except Exception as e:
        print(f"Error loading files: {e}")
        return

    # 2. Process Researchers (Total DF)
    researchers = []
    platforms = ['정밀의료기기', '정밀재생', '면역-마이크로바이옴', '신약', '데이터', '혁신형의사과학자']
    ui_platform_labels = ['데이터', '의사과학자', '정밀재생', '정밀의료기기', '면역/마이크로', '신약']
    platform_map = {
        '정밀의료기기': '정밀의료기기',
        '정밀재생': '정밀재생',
        '면역-마이크로바이옴': '면역/마이크로',
        '신약': '신약',
        '데이터': '데이터',
        '혁신형의사과학자': '의사과학자'
    }

    # Track platform status for recruitment filtering
    platform_researcher_names = set()
    all_researcher_names = set()

    for idx, row in total_df.iterrows():
        # Basic Info
        name = clean_str(row.get('name', ''))
        clean_name_str = clean_name(name)
        all_researcher_names.add(clean_name_str)
        
        # Platforms
        my_platforms = []
        for p in platforms:
            if clean_float(row.get(p, 0)) == 1:
                my_platforms.append(platform_map[p])
        
        if my_platforms:
            platform_researcher_names.add(clean_name_str)

        # Budget (Won -> Eok)
        budget = clean_float(row.get('budget_pi_25', 0)) / 100000000
        
        # Position Mapping
        raw_position = clean_str(row.get('title', ''))
        if not raw_position:
            position = "정보없음"
        elif raw_position in ['교수', '부교수', '조교수', '임상조교수']:
            position = raw_position
        else:
            position = "기타"

        researcher = {
            "id": str(idx + 1),
            "name_ko": name,
            "name_en": "",
            "department": clean_str(row.get('department', '')),
            "position": position,
            "email": "",
            "phone": "",
            "image_url": f"https://api.dicebear.com/7.x/avataaars/svg?seed={idx+1}",
            "keywords": clean_list(row.get('specialty', '')),
            "major_research": clean_list(row.get('specialty', ''))[0] if clean_list(row.get('specialty', '')) else "",
            "lab_info": "",
            "publications": int(clean_float(row.get('paper_2025', 0))),
            "projects": 0,
            "citations": 0,
            "budget": round(budget, 1),
            "est_start_year": clean_float(row.get('EST_STRT_YR', 0)),
            "platforms": my_platforms
        }
        researchers.append(researcher)

    # 3. Calculate Platform Budget (Current)
    # Note: If a researcher is in multiple platforms, their budget counts for EACH.
    platform_budget_map = {p: 0 for p in ui_platform_labels}
    platform_breakdown = {p: {pos: 0 for pos in ['교수', '부교수', '조교수', '임상조교수', '기타', '정보없음']} for p in ui_platform_labels}
    
    non_participating_budget = 0

    for r in researchers:
        if r['platforms']:
            for p in r['platforms']:
                platform_budget_map[p] += r['budget']
                # Breakdown
                if r['position'] in platform_breakdown[p]:
                    platform_breakdown[p][r['position']] += 1
        else:
            non_participating_budget += r['budget']

    # Prepare lists for export
    platform_budget_list = [round(platform_budget_map[p], 1) for p in ui_platform_labels]
    platform_budget_list.append(round(non_participating_budget, 1)) # Add non-participating at end

    # Prepare breakdown for export (transpose to {pos: [count per platform]})
    final_position_labels = ['교수', '부교수', '조교수', '임상조교수', '기타', '정보없음']
    export_breakdown = {pos: [] for pos in final_position_labels}
    for pos in final_position_labels:
        for p in ui_platform_labels:
            export_breakdown[pos].append(platform_breakdown[p][pos])

    # 4. Calculate Recruitment Data (NTIS)
    # Target: Researchers who are NOT in platform_researcher_names
    target_names = all_researcher_names - platform_researcher_names
    
    ntis_df['pi_clean'] = ntis_df['pi'].apply(clean_name)
    
    # Ensure year is numeric
    ntis_df['year'] = pd.to_numeric(ntis_df['year'], errors='coerce')
    print("Years found in NTIS:", ntis_df['year'].unique())
    
    # Filter NTIS
    target_projects = ntis_df[
        (ntis_df['year'] == 2025) & 
        (ntis_df['pi_clean'].isin(target_names))
    ].copy()
    
    # Remove duplicates (title, project, year, pi)
    initial_count = len(target_projects)
    target_projects.drop_duplicates(subset=['title', 'project', 'year', 'pi'], inplace=True)
    dedup_count = len(target_projects)
    print(f"Found {dedup_count} projects for 2025 matching target researchers (removed {initial_count - dedup_count} duplicates).")
    
    # Platform Keywords
    platform_keywords = {
        '데이터': ['데이터', 'AI', '인공지능', '빅데이터', '클라우드', '머신러닝', '딥러닝', '스마트'],
        '의사과학자': ['의사과학자', '혁신형', '양성'],
        '정밀재생': ['재생', '줄기세포', '오가노이드', '조직공학', '바이오프린팅'],
        '정밀의료기기': ['의료기기', '디바이스', '로봇', '센서', '영상', '진단기기', '웨어러블'],
        '면역/마이크로': ['면역', '마이크로바이옴', '백신', '감염', '바이러스', '항체'],
        '신약': ['신약', '약물', '치료제', '항암제', '표적', '후보물질']
    }
    
    matched_projects = []
    recruitment_potential_map = {p: 0 for p in ui_platform_labels}
    
    for _, row in target_projects.iterrows():
        title = clean_str(row['title'])
        budget = clean_float(row['budget']) / 100000000
        pi = clean_str(row['pi'])
        
        best_match = None
        max_matches = 0
        
        for p_name, keywords in platform_keywords.items():
            matches = sum(1 for k in keywords if k in title)
            if matches > max_matches:
                max_matches = matches
                best_match = p_name
        
        if best_match:
            recruitment_potential_map[best_match] += budget
            matched_projects.append({
                'title': title,
                'pi': pi,
                'budget': round(budget, 1),
                'platform': best_match,
                'project_name': clean_str(row['project'])
            })
            
    matched_projects.sort(key=lambda x: x['budget'], reverse=True)
    
    recruitment_data = {
        'totalPotential': round(sum(p['budget'] for p in matched_projects), 1),
        'platformPotential': {k: round(v, 1) for k, v in recruitment_potential_map.items()},
        'topProjects': matched_projects[:20]
    }

    # 5. Demographics & Other Stats (Simplified for brevity, copying logic)
    # Position Counts
    titles = [r['position'] for r in researchers]
    title_counts = pd.Series(titles).value_counts()
    final_position_counts = [int(title_counts.get(t, 0)) for t in final_position_labels]
    
    # Dept Top 10
    depts = [r['department'] for r in researchers if r['department']]
    dept_counts = pd.Series(depts).value_counts().head(10)
    dept_labels = dept_counts.index.tolist()
    dept_values = dept_counts.values.tolist()
    
    dept_breakdown = {pos: [] for pos in final_position_labels}
    for dept in dept_labels:
        dept_researchers = [r for r in researchers if r['department'] == dept]
        for pos in final_position_labels:
            count = sum(1 for r in dept_researchers if r['position'] == pos)
            dept_breakdown[pos].append(count)
            
    # Year Distribution
    year_bins = [0, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 9999]
    year_labels = ['1980이전', '1980-84', '1985-89', '1990-94', '1995-99', '2000-04', '2005-09', '2010-14', '2015이후']
    years = [r['est_start_year'] for r in researchers if r['est_start_year'] > 1900]
    year_hist, _ = np.histogram(years, bins=year_bins)
    year_values = year_hist.tolist()
    
    # Performance
    perf_df = pd.DataFrame(researchers)
    perf_agg = perf_df.groupby('department')[['budget', 'publications']].sum().reset_index()
    perf_agg = perf_agg.sort_values('budget', ascending=False).head(7)
    performance_data = []
    for _, row in perf_agg.iterrows():
        performance_data.append({
            'name': row['department'],
            'budget': round(row['budget'], 1),
            'papers': int(row['publications'])
        })
        
    # Avg Stats
    avg_papers = []
    avg_budget = []
    for pos in final_position_labels:
        pos_researchers = [r for r in researchers if r['position'] == pos]
        count = len(pos_researchers)
        if count > 0:
            avg_papers.append(round(sum(r['publications'] for r in pos_researchers)/count, 1))
            avg_budget.append(round(sum(r['budget'] for r in pos_researchers)/count, 2))
        else:
            avg_papers.append(0)
            avg_budget.append(0)

    # 6. Generate Output
    output = []
    output.append("export const demographicsData = {")
    output.append(f"    positionLabels: {json.dumps(final_position_labels, ensure_ascii=False)},")
    output.append(f"    positionCounts: {final_position_counts},")
    output.append(f"    deptTop10Labels: {json.dumps(dept_labels, ensure_ascii=False)},")
    output.append(f"    deptTop10Values: {dept_values},")
    output.append(f"    deptTop10Breakdown: {json.dumps(dept_breakdown, ensure_ascii=False)},")
    output.append(f"    yearLabels: {json.dumps(year_labels, ensure_ascii=False)},")
    output.append(f"    yearValues: {year_values}")
    output.append("};")
    output.append("")
    output.append("export const performanceData = [")
    for p in performance_data:
        output.append(f"    {{ name: '{p['name']}', budget: {p['budget']}, papers: {p['papers']} }},")
    output.append("];")
    output.append("")
    output.append("export const avgStatsData = {")
    output.append(f"    labels: {json.dumps(final_position_labels, ensure_ascii=False)},")
    output.append(f"    avgPapers: {avg_papers},")
    output.append(f"    avgBudget: {avg_budget}")
    output.append("};")
    output.append("")
    # Calculate Participation Counts
    participating_count = sum(1 for r in researchers if r['platforms'])
    non_participating_count = len(researchers) - participating_count
    participation = [non_participating_count, participating_count]

    output.append("export const platformData = {")
    output.append(f"    participation: {participation},")
    output.append(f"    labels: {json.dumps(ui_platform_labels, ensure_ascii=False)},")
    output.append(f"    budget: {platform_budget_list},")
    output.append(f"    breakdown: {json.dumps(export_breakdown, ensure_ascii=False)},")
    output.append("    simulation: { current: [], increase: [] }") # Deprecated
    output.append("};")
    output.append("")
    output.append("export const recruitmentData = {")
    output.append(f"    totalPotential: {recruitment_data['totalPotential']},")
    output.append(f"    platformPotential: {json.dumps(recruitment_data['platformPotential'], ensure_ascii=False)},")
    output.append(f"    topProjects: {json.dumps(recruitment_data['topProjects'], ensure_ascii=False)}")
    output.append("};")
    output.append("")
    # Static data
    output.append("export const companiesData = [")
    output.append('    { id: 1, name: "Lunit (루닛)", type: "internal", platform: "data", desc: "딥러닝 암 진단", icon: "fa-cube", color: "indigo" },')
    output.append('    { id: 2, name: "Genexine", type: "internal", platform: "drug", desc: "면역 항암제", icon: "fa-dna", color: "emerald" },')
    output.append('    { id: 3, name: "DeepBio", type: "external", platform: "data", desc: "전립선암 진단 AI", icon: "fa-globe", color: "slate" }')
    output.append("];")
    output.append("")
    output.append("export const researchers = [")
    for r in researchers:
        r_out = {k: v for k, v in r.items() if k not in ['est_start_year']} # Keep budget and platforms
        output.append("    {")
        output.append(f"        id: \"{r_out['id']}\",")
        output.append(f"        name_ko: \"{r_out['name_ko']}\",")
        output.append(f"        name_en: \"{r_out['name_en']}\",")
        output.append(f"        department: \"{r_out['department']}\",")
        output.append(f"        position: \"{r_out['position']}\",")
        output.append(f"        email: \"{r_out['email']}\",")
        output.append(f"        phone: \"{r_out['phone']}\",")
        output.append(f"        image_url: \"{r_out['image_url']}\",")
        output.append(f"        keywords: {json.dumps(r_out['keywords'], ensure_ascii=False)},")
        output.append(f"        major_research: \"{r_out['major_research']}\",")
        output.append(f"        lab_info: \"{r_out['lab_info']}\",")
        output.append(f"        publications: {r_out['publications']},")
        output.append(f"        projects: {r_out['projects']},")
        output.append(f"        citations: {r_out['citations']},")
        output.append(f"        budget: {r_out['budget']},")
        output.append(f"        platforms: {json.dumps(r_out['platforms'], ensure_ascii=False)}")
        output.append("    },")
    output.append("];")
    
    with open('lib/mocks.ts', 'w', encoding='utf-8') as f:
        f.write("\n".join(output))
    print("Successfully generated lib/mocks.ts")

if __name__ == "__main__":
    generate_mocks()
