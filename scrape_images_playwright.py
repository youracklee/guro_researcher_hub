
import os
import pandas as pd
import requests
from playwright.sync_api import sync_playwright
import time

# Load data
df = pd.read_excel('total_df.xlsx')

# Create directory
save_dir = 'public/images/researchers'
os.makedirs(save_dir, exist_ok=True)

def scrape_images():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1920, "height": 1080}
        )
        page = context.new_page()

        for index, row in df.iterrows():
            name = row['name']
            url = row['href']
            
            # Check if image already exists (skip if we want to be fast, but here we want to overwrite)
            # filepath = os.path.join(save_dir, f"{name}.png")
            # if os.path.exists(filepath):
            #     print(f"Skipping {name}, already exists.")
            #     continue

            print(f"[{index+1}/{len(df)}] Processing {name}...")
            
            try:
                page.goto(url, wait_until='domcontentloaded', timeout=60000)
                page.wait_for_load_state('networkidle', timeout=10000)
                
                # Try multiple selectors
                img_url = None
                
                # Selector 1: .doctor_img img
                try:
                    element = page.query_selector('.doctor_img img')
                    if element:
                        img_url = element.get_attribute('src')
                except:
                    pass
                
                # Selector 2: .doctor_image span (background-image)
                if not img_url:
                    try:
                        element = page.query_selector('.doctor_image span')
                        if element:
                            style = element.get_attribute('style')
                            if style and 'background-image' in style:
                                # Extract URL from style string
                                import re
                                match = re.search(r'url\((.*?)\)', style)
                                if match:
                                    img_url = match.group(1).strip("'\"")
                    except:
                        pass

                if img_url:
                    if not img_url.startswith('http'):
                        base_url = "https://guro.kumc.or.kr"
                        img_url = base_url + img_url
                        
                    # Download image
                    headers = {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Referer": "https://guro.kumc.or.kr/"
                    }
                    
                    response = requests.get(img_url, headers=headers, verify=False, timeout=10)
                    
                    if response.status_code in [200, 201]:
                        # Determine extension from content-type or url
                        ext = '.png' # Default to png
                        content_type = response.headers.get('Content-Type', '').lower()
                        if 'jpeg' in content_type or 'jpg' in content_type:
                            ext = '.jpg'
                        elif 'png' in content_type:
                            ext = '.png'
                        elif 'gif' in content_type:
                            ext = '.gif'
                            
                        # Force save as is (binary)
                        filepath = os.path.join(save_dir, f"{name}{ext}")
                        
                        with open(filepath, 'wb') as f:
                            f.write(response.content)
                        print(f"  Downloaded: {filepath}")
                    else:
                        print(f"  Failed download: {response.status_code}")
                else:
                    print(f"  No image found for {name}")
                    
            except Exception as e:
                print(f"  Error scraping {name}: {e}")
                
            time.sleep(0.5) # Polite delay

        browser.close()

if __name__ == "__main__":
    scrape_images()
