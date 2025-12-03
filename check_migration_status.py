import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv('.env.local')

url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not url or not key:
    print("Error: Missing environment variables.")
    exit(1)

supabase: Client = create_client(url, key)

try:
    researchers_count = supabase.table('researchers').select('*', count='exact', head=True).execute()
    projects_count = supabase.table('projects').select('*', count='exact', head=True).execute()

    print(f"Researchers count: {researchers_count.count}")
    print(f"Projects count: {projects_count.count}")

except Exception as e:
    print(f"Error checking status: {e}")
