
import os
import pandas as pd
import ast
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv('.env.local')

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Missing environment variables.")
    exit(1)

# Use service key if available to bypass RLS, otherwise anon key
supabase = create_client(url, service_key if service_key else key)

def update_paper_topics():
    print("Updating paper topics...")
    try:
        # Read from temp file to avoid permission issues
        df = pd.read_excel('temp_total_df.xlsx')
        df = df.fillna('')
        
        success_count = 0
        fail_count = 0
        
        for index, row in df.iterrows():
            name = row.get('name', '').strip()
            department = row.get('department', '').strip()
            paper_raw = row.get('paper', '')
            
            if not name:
                continue
                
            # Parse paper column
            paper_topics = []
            if paper_raw:
                try:
                    # It looks like a stringified list: "['Title 1', 'Title 2']"
                    if str(paper_raw).startswith('['):
                        paper_topics = ast.literal_eval(str(paper_raw))
                    else:
                        # Fallback if it's just a single string or other format
                        paper_topics = [str(paper_raw)]
                except Exception as e:
                    print(f"Error parsing paper for {name}: {e}")
                    paper_topics = []
            
            # Clean up topics (remove newlines, extra spaces)
            paper_topics = [str(t).strip() for t in paper_topics if t]
            
            if not paper_topics:
                continue

            try:
                # Update matching Name AND Department
                # Using match on name and department to handle homonyms
                response = supabase.table('researchers').update({
                    'paper_topics': paper_topics
                }).eq('name', name).eq('department', department).execute()
                
                if response.data:
                    success_count += 1
                    if success_count % 50 == 0:
                        print(f"Updated {success_count} researchers...")
                else:
                    print(f"Researcher not found: {name} ({department})")
                    fail_count += 1
                    
            except Exception as e:
                print(f"Error updating {name}: {e}")
                fail_count += 1

        print(f"Update complete. Success: {success_count}, Failed/Not Found: {fail_count}")

    except Exception as e:
        print(f"Error reading Excel or executing update: {e}")

if __name__ == "__main__":
    update_paper_topics()
