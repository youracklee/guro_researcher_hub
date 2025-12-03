import pandas as pd

try:
    df = pd.read_excel('ntis_results.xlsx')
    print("Columns List:", df.columns.tolist())
except Exception as e:
    print("Error:", e)
