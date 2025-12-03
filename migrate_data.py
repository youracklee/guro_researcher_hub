import os
import pandas as pd
from openai import OpenAI
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
openai_api_key: str = os.environ.get("OPENAI_API_KEY")

if not url or not key or not openai_api_key:
    print("Error: Missing environment variables. Please check .env.local")
    exit(1)

supabase: Client = create_client(url, key)
client = OpenAI(api_key=openai_api_key)

def get_embedding(text, model="text-embedding-3-small"):
    text = text.replace("\n", " ")
    return client.embeddings.create(input=[text], model=model).data[0].embedding

def migrate_researchers():
    print("Migrating researchers...")
    try:
        df = pd.read_excel('total_df.xlsx')
        # Ensure required columns exist, fill NaNs
        df = df.fillna('')
        
        researchers_data = []
        for index, row in df.iterrows():
            # Construct text for embedding
            embedding_text = f"{row.get('name', '')} {row.get('department', '')} {row.get('specialty', '')} {row.get('keywords', '')}"
            
            try:
                embedding = get_embedding(embedding_text)
                
                researcher = {
                    "name": row.get('name', ''),
                    "department": row.get('department', ''),
                    "position": row.get('position', ''), # Added position
                    "keywords": eval(str(row.get('keywords', '[]'))) if str(row.get('keywords', '')).startswith('[') else [str(row.get('keywords', ''))] if row.get('keywords') else [],
                    "image_url": row.get('image_url', ''), # Added image_url
                    "major_research": row.get('major_research', ''), # Added major_research
                    "embedding": embedding
                }
                researchers_data.append(researcher)
                print(f"Processed researcher: {row.get('name')}")
            except Exception as e:
                print(f"Error processing researcher {row.get('name')}: {e}")

        if researchers_data:
            response = supabase.table('researchers').insert(researchers_data).execute()
            print(f"Inserted {len(researchers_data)} researchers.")
        else:
            print("No researcher data to insert.")

    except Exception as e:
        print(f"Error migrating researchers: {e}")

def migrate_projects():
    print("Migrating projects...")
    try:
        df = pd.read_excel('ntis_results.xlsx')
        df = df.fillna('')
        
        projects_data = []
        for index, row in df.iterrows():
            embedding_text = f"{row.get('title', '')} {row.get('project', '')}"
            
            try:
                embedding = get_embedding(embedding_text)
                
                project = {
                    "title": row.get('title', ''),
                    "researcher_name": row.get('researcher_name', ''), # Use researcher_name if available
                    "pi": row.get('pi', ''), # Map 'pi' column correctly
                    "year": str(row.get('year', '')),
                    "budget": str(row.get('budget', '')),
                    "embedding": embedding
                }
                projects_data.append(project)
                print(f"Processed project: {row.get('title')}")
            except Exception as e:
                print(f"Error processing project {row.get('title')}: {e}")

        if projects_data:
            response = supabase.table('projects').insert(projects_data).execute()
            print(f"Inserted {len(projects_data)} projects.")
        else:
            print("No project data to insert.")

    except Exception as e:
        print(f"Error migrating projects: {e}")

if __name__ == "__main__":
    migrate_researchers()
    migrate_projects()
