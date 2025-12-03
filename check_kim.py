import pandas as pd

try:
    df = pd.read_excel('total_df.xlsx')
    targets = ['김진원', '송재준', '임채승']
    platforms = ['정밀의료기기', '정밀재생', '면역-마이크로바이옴', '신약', '데이터', '혁신형의사과학자']
    
    for t in targets:
        rows = df[df['name'] == t]
        if not rows.empty:
            for _, row in rows.iterrows():
                my_platforms = [p for p in platforms if row.get(p, 0) == 1]
                print(f"{t}: {my_platforms}")
        else:
            print(f"{t} not found")
except Exception as e:
    print(e)
