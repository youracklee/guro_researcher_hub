import pandas as pd

try:
    df = pd.read_excel('ntis_results.xlsx')
    print("Columns:", df.columns.tolist())
    print("First 2 rows:", df.head(2).to_dict(orient='records'))
except Exception as e:
    print("Error:", e)
