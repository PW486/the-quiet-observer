import os
import re
import json
from datetime import datetime

# Paths are now relative to the script location (inside philosophy-blog folder)
POSTS_DIR = 'posts'
OUTPUT_FILE = 'posts.json'

def parse_md_file(filepath):
    """Read markdown file and extract title and date."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Extract Title (First H1)
    title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else "Untitled"
    
    # Extract Date (First H6)
    date_match = re.search(r'^######\s+(.+)$', content, re.MULTILINE)
    date_str = date_match.group(1).strip() if date_match else ""
    
    return title, date_str

def get_sortable_date(date_str):
    """Convert date string to datetime object for sorting."""
    try:
        return datetime.strptime(date_str, "%B %d, %Y")
    except ValueError:
        pass
        
    try:
        clean_date = re.sub(r'[년월일]', '', date_str).replace(' ', '-')
        match = re.search(r'(\d{4})\s*(\d{1,2})\s*(\d{1,2})', date_str)
        if match:
            return datetime(int(match.group(1)), int(match.group(2)), int(match.group(3)))
    except ValueError:
        pass
        
    return datetime.min

def main():
    # Change working directory to the script's directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    posts_map = {}
    
    if not os.path.exists(POSTS_DIR):
        print(f"Error: Directory '{POSTS_DIR}' not found.")
        return

    files = os.listdir(POSTS_DIR)
    
    for filename in files:
        if not filename.endswith('.md'):
            continue
            
        parts = filename.split('.')
        if len(parts) < 3:
            continue
            
        post_id = parts[0]
        lang = parts[1]
        
        filepath = os.path.join(POSTS_DIR, filename)
        title, date_str = parse_md_file(filepath)
        
        if post_id not in posts_map:
            posts_map[post_id] = {'id': post_id, 'title': {}, 'date': '', '_sort_date': datetime.min}
            
        posts_map[post_id]['title'][lang] = title
        
        if lang == 'en':
            posts_map[post_id]['date'] = date_str
            posts_map[post_id]['_sort_date'] = get_sortable_date(date_str)
        elif not posts_map[post_id]['date']:
            posts_map[post_id]['date'] = date_str 

    posts_list = list(posts_map.values())
    posts_list.sort(key=lambda x: x['_sort_date'], reverse=True)
    
    for p in posts_list:
        del p['_sort_date']
        
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(posts_list, f, indent=4, ensure_ascii=False)
        
    print(f"✅ Successfully generated {OUTPUT_FILE} with {len(posts_list)} posts.")

if __name__ == "__main__":
    main()
