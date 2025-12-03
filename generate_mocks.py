import pandas as pd
import json
import numpy as np

def clean_float(x):
    if pd.isna(x):
        return 0
    return float(x)

def clean_str(x):
    if pd.isna(x):
        return ""
    return str(x).strip()

def clean_list(x):
    if pd.isna(x):
        return []
    return [s.strip() for s in str(x).split(',') if s.strip()]

try:
    df = pd.read_excel('total_df.xlsx')
    
    # 1. Process Researchers
    researchers = []
    
    # Platform columns
    platforms = ['정밀의료기기', '정밀재생', '면역-마이크로바이옴', '신약', '데이터', '혁신형의사과학자']
    platform_keys = ['device', 'regen', 'immune', 'drug', 'data', 'doctor_scientist'] # Mapping for internal use if needed, but for now we just need stats
    
    for idx, row in df.iterrows():
        # Budget conversion: Won -> 100 Million Won (Eok)
        budget = clean_float(row.get('budget_pi_25', 0)) / 100000000
        
        # Career calculation
        est_start_year = clean_float(row.get('EST_STRT_YR', 0))
        career_years = 2025 - est_start_year if est_start_year > 1900 else 0
        
        # Keywords
        keywords = clean_list(row.get('specialty', ''))
        
        # Platforms
        my_platforms = []
        for p in platforms:
            if clean_float(row.get(p, 0)) == 1:
                my_platforms.append(p)

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
            "name_ko": clean_str(row.get('name', '')),
            "name_en": "", # Not in excel
            "department": clean_str(row.get('department', '')),
            "position": position,
            "email": "", # Not in excel
            "phone": "", # Not in excel
            "image_url": "", # Not in excel
            "keywords": keywords,
            "major_research": keywords[0] if keywords else "",
            "lab_info": "",
            "publications": int(clean_float(row.get('paper_2025', 0))),
            "projects": 0, # Not explicitly in excel, maybe use count_pi_25 if exists, else 0
            "citations": 0, # Not in excel
            "budget": round(budget, 1), # Added for internal calc, will remove or keep if schema allows
            "est_start_year": est_start_year, # For stats
            "platforms": my_platforms # For stats
        }
        researchers.append(researcher)

    # 2. Calculate Demographics
    # Position Counts
    titles = [r['position'] for r in researchers]
    title_counts = pd.Series(titles).value_counts()
    
    # Fixed Order
    final_position_labels = ['교수', '부교수', '조교수', '임상조교수', '기타', '정보없음']
    
    # Ensure all labels exist in counts (default to 0 if not found, though our mapping ensures they are the only ones possible)
    final_position_counts = []
    for label in final_position_labels:
        final_position_counts.append(int(title_counts.get(label, 0)))
    
    # We don't need "Top 5 + Others" logic anymore because we want specific order.
    # But if there are too many "remaining" titles, we might want to group them into '기타'.
    # For now, let's assume the desired_order covers most.
    # If '기타' is in the data (from excel), it falls into '기타'.
    # If '정보없음' is in the data (from our null handling), it falls into '정보없음'.
    
    # Dept Top 10
    depts = [r['department'] for r in researchers if r['department']]
    dept_counts = pd.Series(depts).value_counts().head(10)
    dept_labels = dept_counts.index.tolist()
    dept_values = dept_counts.values.tolist()

    # Dept Top 10 Breakdown by Position
    # Use the same final_position_labels (excluding '기타' for specific matching, or map others)
    dept_breakdown = {pos: [] for pos in final_position_labels}
    
    for dept in dept_labels:
        # Get researchers in this dept
        dept_researchers = [r for r in researchers if r['department'] == dept]
        for pos in final_position_labels:
            count = sum(1 for r in dept_researchers if r['position'] == pos)
            dept_breakdown[pos].append(count)
            
    # Year Distribution
    # Bins: <1980, 80-84, 85-89, 90-94, 95-99, 00-04, 05-09, 10-14, 15+
    year_bins = [0, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 9999]
    year_labels = ['1980이전', '1980-84', '1985-89', '1990-94', '1995-99', '2000-04', '2005-09', '2010-14', '2015이후']
    years = [r['est_start_year'] for r in researchers if r['est_start_year'] > 1900]
    year_hist, _ = np.histogram(years, bins=year_bins)
    year_values = year_hist.tolist()
    
    # 3. Calculate Performance
    # Group by dept, sum budget and papers
    perf_df = pd.DataFrame(researchers)
    perf_agg = perf_df.groupby('department')[['budget', 'publications']].sum().reset_index()
    # Sort by budget desc and take top 7 (as per current mock)
    perf_agg = perf_agg.sort_values('budget', ascending=False).head(7)
    performance_data = perf_agg.to_dict(orient='records')
    # Rename publications to papers
    for p in performance_data:
        p['papers'] = p.pop('publications')
        p['budget'] = round(p['budget'], 1)
        
    # 4. Calculate Platform Data
    # Participation count
    participating_count = sum(1 for r in researchers if r['platforms'])
    non_participating_count = len(researchers) - participating_count
    participation = [non_participating_count, participating_count]
    
    # Platform breakdown
    platform_labels = ['데이터', '혁신형의사과학자', '정밀재생', '정밀의료기기', '면역-마이크로바이옴', '신약']
    
    platform_budget = []
    platform_breakdown = {pos: [] for pos in final_position_labels}
    
    for p in platform_labels:
        # Budget
        p_budget = sum(r['budget'] for r in researchers if p in r['platforms'])
        platform_budget.append(round(p_budget, 1))
        
        # Position Breakdown
        p_researchers = [r for r in researchers if p in r['platforms']]
        for pos in final_position_labels:
            count = sum(1 for r in p_researchers if r['position'] == pos)
            platform_breakdown[pos].append(count)
            
    # Calculate Non-participating Budget
    non_participating_budget = sum(r['budget'] for r in researchers if not r['platforms'])
    platform_budget.append(round(non_participating_budget, 1))
        
    # Rename labels to match UI if needed
    ui_platform_labels = ['데이터', '의사과학자', '정밀재생', '정밀의료기기', '면역/마이크로', '신약']
    
    # 5. Calculate Average Stats by Position (Consistent with Demographics)
    avg_stats_positions = final_position_labels # ['Top1', ..., '기타']
    avg_papers = []
    avg_budget = []
    
    for pos in avg_stats_positions:
        pos_researchers = [r for r in researchers if r['position'] == pos]
            
        count = len(pos_researchers)
        if count > 0:
            total_papers = sum(r['publications'] for r in pos_researchers)
            total_budget = sum(r['budget'] for r in pos_researchers)
            avg_papers.append(round(total_papers / count, 1))
            avg_budget.append(round(total_budget / count, 2))
        else:
            avg_papers.append(0)
            avg_budget.append(0)

    # 7. Calculate Recruitment Data (NTIS)
    try:
        ntis_df = pd.read_excel('ntis_results.xlsx')
        
        # Identify non-platform researchers (names)
        # We need to match by name since IDs might not align perfectly or we just use names for simplicity
        # But wait, we have 'researchers' list with 'platforms' info.
        non_platform_names = set(r['name_ko'] for r in researchers if not r['platforms'])
        
        # Filter NTIS for 2025 and non-platform PIs
        # Ensure 'pi' column exists and clean it
        ntis_df['pi_clean'] = ntis_df['pi'].apply(clean_str)
        target_projects = ntis_df[
            (ntis_df['year'] == 2025) & 
            (ntis_df['pi_clean'].isin(non_platform_names))
        ].copy()
        
        # Platform Keywords for Matching
        platform_keywords = {
            '데이터': ['데이터', 'AI', '인공지능', '빅데이터', '클라우드', '머신러닝', '딥러닝', '스마트'],
            '의사과학자': ['의사과학자', '혁신형', '양성'],
            '정밀재생': ['재생', '줄기세포', '오가노이드', '조직공학', '바이오프린팅'],
            '정밀의료기기': ['의료기기', '디바이스', '로봇', '센서', '영상', '진단기기', '웨어러블'],
            '면역/마이크로': ['면역', '마이크로바이옴', '백신', '감염', '바이러스', '항체'],
            '신약': ['신약', '약물', '치료제', '항암제', '표적', '후보물질']
        }
        
        # Match Projects
        matched_projects = []
        platform_potential = {p: 0 for p in ui_platform_labels}
        
        for _, row in target_projects.iterrows():
            title = clean_str(row['title'])
            budget = clean_float(row['budget']) / 100000000 # Convert to Eok
            pi = clean_str(row['pi'])
            
            best_match = None
            max_matches = 0
            
            for p_name, keywords in platform_keywords.items():
                matches = sum(1 for k in keywords if k in title)
                if matches > max_matches:
                    max_matches = matches
                    best_match = p_name
            
            # If no match found but we need to assign it? 
            # Or just keep it as 'Unmatched'? User said "match relevant platforms".
            # Let's assign to '기타' or skip if no keyword match?
            # For visualization, maybe we force a match or just show matched ones.
            # Let's include only matched ones for the "Increase" effect.
            
            if best_match:
                platform_potential[best_match] += budget
                matched_projects.append({
                    'title': title,
                    'pi': pi,
                    'budget': round(budget, 1),
                    'platform': best_match,
                    'project_name': clean_str(row['project'])
                })
        
        # Sort projects by budget desc
        matched_projects.sort(key=lambda x: x['budget'], reverse=True)
        
        # Prepare Output Data
        recruitment_data = {
            'total_potential_budget': round(sum(p['budget'] for p in matched_projects), 1),
            'platform_potential': {k: round(v, 1) for k, v in platform_potential.items()},
            'top_projects': matched_projects[:20] # Top 20 for display
        }
        
    except Exception as e:
        print("Error processing NTIS data:", e)
        recruitment_data = {
            'total_potential_budget': 0,
            'platform_potential': {},
            'top_projects': []
        }

    # 6. Generate Output String (Updated)
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
        output.append(f"    {{ name: '{p['department']}', budget: {p['budget']}, papers: {p['papers']} }},")
    output.append("];")
    output.append("")
    output.append("export const avgStatsData = {")
    output.append(f"    labels: {json.dumps(avg_stats_positions, ensure_ascii=False)},")
    output.append(f"    avgPapers: {avg_papers},")
    output.append(f"    avgBudget: {avg_budget}")
    output.append("};")
    output.append("")
    output.append("export const platformData = {")
    output.append(f"    participation: {participation},")
    output.append(f"    labels: {json.dumps(ui_platform_labels, ensure_ascii=False)},")
    output.append(f"    budget: {platform_budget},")
    output.append(f"    breakdown: {json.dumps(platform_breakdown, ensure_ascii=False)},")
    output.append("    simulation: { current: [76, 130.5, 595], increase: [45, 45.2, 120] }") # Keep old sim for now or replace? User wants new card.
    output.append("};")
    output.append("")
    output.append("export const recruitmentData = {")
    output.append(f"    totalPotential: {recruitment_data['total_potential_budget']},")
    output.append(f"    platformPotential: {json.dumps(recruitment_data['platform_potential'], ensure_ascii=False)},")
    output.append(f"    topProjects: {json.dumps(recruitment_data['top_projects'], ensure_ascii=False)}")
    output.append("};")
    output.append("")
    # Keep companies data as is (static)
    output.append("export const companiesData = [")
    output.append('    { id: 1, name: "Lunit (루닛)", type: "internal", platform: "data", desc: "딥러닝 암 진단", icon: "fa-cube", color: "indigo" },')
    output.append('    { id: 2, name: "Genexine", type: "internal", platform: "drug", desc: "면역 항암제", icon: "fa-dna", color: "emerald" },')
    output.append('    { id: 3, name: "DeepBio", type: "external", platform: "data", desc: "전립선암 진단 AI", icon: "fa-globe", color: "slate" }')
    output.append("];")
    output.append("")
    output.append("export const researchers = [")
    
    for r in researchers:
        # Clean up fields for TS output
        r_out = {k: v for k, v in r.items() if k not in ['budget', 'est_start_year', 'platforms']}
        # Add random image
        r_out['image_url'] = f"https://api.dicebear.com/7.x/avataaars/svg?seed={r['id']}"
        
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
        output.append(f"        citations: {r_out['citations']}")
        output.append("    },")
        
    output.append("];")
    
    with open('lib/mocks.ts', 'w', encoding='utf-8') as f:
        f.write("\n".join(output))
    print("Successfully generated lib/mocks.ts")

except Exception as e:
    print("Error:", e)
    import traceback
    traceback.print_exc()
