
import os
from dotenv import load_dotenv
from supabase import create_client
import urllib.parse

# Load environment variables
load_dotenv('.env.local')

supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
# Use service role key if available for bypassing RLS, otherwise rely on anon key + policy
service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if service_role_key:
    supabase = create_client(supabase_url, service_role_key)
else:
    supabase = create_client(supabase_url, supabase_key)

image_dir = 'public/images/researchers'
files = os.listdir(image_dir)

print(f"Found {len(files)} images in {image_dir}")

for filename in files:
    if not (filename.lower().endswith('.jpg') or filename.lower().endswith('.png') or filename.lower().endswith('.gif')):
        continue
        
    name = os.path.splitext(filename)[0]
    # URL encode the filename for the path
    # But for local file serving, we usually just use the path string. 
    # Browser handles encoding.
    # However, if filename has spaces or special chars, might need care.
    # Here we assume simple names or just use the filename.
    
    # Path relative to public
    image_path = f"/images/researchers/{filename}"
    
    print(f"Updating {name} -> {image_path}")
    
    try:
        # Update DB
        # We match by name. 
        # Note: Name in DB might match filename exactly.
        
        data_response = supabase.table('researchers').update({'image_url': image_path}).eq('name', name).execute()
        
        if data_response.data and len(data_response.data) > 0:
             print(f"  Success: Updated {name}")
        else:
             print(f"  Failed/Not Found: {name}")
             
    except Exception as e:
        print(f"  Error updating {name}: {e}")
        
print("Update completed.")
