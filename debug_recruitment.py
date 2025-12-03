import pandas as pd

def clean_name(name):
    if pd.isna(name): return ""
    return str(name).strip().replace(" ", "")

try:
    # Load Data
    total_df = pd.read_excel('total_df.xlsx')
    ntis_df = pd.read_excel('ntis_results.xlsx')
    
    # Identify Platform Researchers in total_df
    platforms = ['정밀의료기기', '정밀재생', '면역-마이크로바이옴', '신약', '데이터', '혁신형의사과학자']
    
    platform_researchers = set()
    for idx, row in total_df.iterrows():
        has_platform = False
        for p in platforms:
            if row.get(p, 0) == 1:
                has_platform = True
                break
        if has_platform:
            platform_researchers.add(clean_name(row.get('name')))
            
    print(f"Total Platform Researchers: {len(platform_researchers)}")
    
    # Check if any of these appear in my 'non-platform' logic
    # My previous logic was: non_platform_names = set(r['name_ko'] for r in researchers if not r['platforms'])
    # This is equivalent to taking all researchers in total_df who DON'T have a platform.
    
    all_researchers = set(clean_name(name) for name in total_df['name'])
    non_platform_researchers = all_researchers - platform_researchers
    print(f"Total Non-Platform Researchers: {len(non_platform_researchers)}")
    
    # Now check NTIS
    # The user says "already platform belonging researchers are appearing in top 20"
    # This means some projects in NTIS with PI name in `platform_researchers` are being selected.
    # My filter was: ntis_df['pi_clean'].isin(non_platform_names)
    
    ntis_df['pi_clean'] = ntis_df['pi'].apply(clean_name)
    
    # Let's see if there are PIs in NTIS who are in platform_researchers but were somehow included?
    # Or maybe the user implies that the 'non_platform_names' list itself is wrong?
    
    # Let's simulate the error.
    # If I use the logic:
    target_projects = ntis_df[
        (ntis_df['year'] == 2025) & 
        (ntis_df['pi_clean'].isin(non_platform_researchers))
    ]
    
    print(f"Target Projects Count: {len(target_projects)}")
    
    # Check Kim Jin-won
    target_name = "김진원"
    print(f"\nChecking {target_name} in total_df:")
    user_rows = total_df[total_df['name'] == target_name]
    if not user_rows.empty:
        for _, row in user_rows.iterrows():
            print(f"Name: {row['name']}")
            print(f"Platforms: {[p for p in platforms if row.get(p, 0) == 1]}")
            print(f"Budget 2025: {row.get('budget_pi_25', 0)}")
    # Check for duplicate names
    name_counts = total_df['name'].value_counts()
    duplicates = name_counts[name_counts > 1]
    if not duplicates.empty:
        print(f"\nDuplicate Names found: {len(duplicates)}")
        print(duplicates)
        
        # Check if any duplicate has mixed platform status
        for name in duplicates.index:
            rows = total_df[total_df['name'] == name]
            platforms_list = []
            for _, row in rows.iterrows():
                p_list = [p for p in platforms if row.get(p, 0) == 1]
                platforms_list.append(p_list)
            print(f"  {name}: {platforms_list}")
    else:
        print("\nNo duplicate names found.")

except Exception as e:
    print("Error:", e)
