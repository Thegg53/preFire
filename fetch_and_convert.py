#!/usr/bin/env python3
"""
Script to fetch a note.com article and convert it to a standalone HTML file.
This script downloads the article content and all images.

Usage: python3 fetch_and_convert.py
"""

import requests
import json
import os
import sys
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import time

# Configuration
URL = "https://note.com/handshuffling/n/n83bbad08cbbd"
OUTPUT_HTML = "article.html"
IMAGES_DIR = "images"

def fetch_page(url):
    """Fetch the webpage content"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        print(f"Fetching page from {url}...")
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        print(f"✓ Successfully fetched page (status: {response.status_code})")
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"✗ Error fetching page: {e}")
        sys.exit(1)

def download_image(img_url, output_path):
    """Download a single image"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': URL
        }
        response = requests.get(img_url, headers=headers, timeout=30)
        response.raise_for_status()
        
        with open(output_path, 'wb') as f:
            f.write(response.content)
        return True
    except Exception as e:
        print(f"  ✗ Failed to download {img_url}: {e}")
        return False

def extract_and_process_content(html_content):
    """Extract article content and process images"""
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Extract metadata
    title_elem = soup.find('meta', property='og:title')
    title = title_elem.get('content') if title_elem else 'Article'
    
    description_elem = soup.find('meta', property='og:description')
    description = description_elem.get('content') if description_elem else ''
    
    # Try to find the main article content
    # note.com uses various container classes
    article_containers = [
        soup.find('article'),
        soup.find('div', class_='note-common-styles__textnote-body'),
        soup.find('div', class_='note'),
        soup.find('main')
    ]
    
    article = None
    for container in article_containers:
        if container:
            article = container
            break
    
    if not article:
        print("⚠ Warning: Could not find article content, using full body")
        article = soup.find('body')
    
    # Create images directory
    os.makedirs(IMAGES_DIR, exist_ok=True)
    
    # Process images
    image_counter = 0
    if article:
        for img in article.find_all('img'):
            img_url = img.get('src') or img.get('data-src')
            if img_url:
                # Make URL absolute
                if img_url.startswith('//'):
                    img_url = 'https:' + img_url
                elif img_url.startswith('/'):
                    img_url = urljoin(URL, img_url)
                
                # Generate filename
                image_counter += 1
                ext = os.path.splitext(urlparse(img_url).path)[1] or '.jpg'
                filename = f"image_{image_counter:03d}{ext}"
                output_path = os.path.join(IMAGES_DIR, filename)
                
                print(f"  Downloading image {image_counter}: {filename}")
                if download_image(img_url, output_path):
                    # Update img tag to point to local file
                    img['src'] = f"{IMAGES_DIR}/{filename}"
                    # Remove lazy loading attributes
                    if img.get('data-src'):
                        del img['data-src']
                    print(f"  ✓ Saved as {filename}")
                
                time.sleep(0.5)  # Be nice to the server
    
    print(f"\n✓ Downloaded {image_counter} images")
    
    return {
        'title': title,
        'description': description,
        'content': str(article) if article else ''
    }

def create_html_file(data):
    """Create the final HTML file"""
    html_template = """<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{description}">
    <title>{title}</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.8;
            color: #333;
            background-color: #f8f9fa;
            padding: 20px;
        }}
        
        .container {{
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
        }}
        
        h1 {{
            font-size: 2em;
            margin-bottom: 0.5em;
            color: #1a1a1a;
            line-height: 1.4;
        }}
        
        h2 {{
            font-size: 1.5em;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            color: #2a2a2a;
        }}
        
        h3 {{
            font-size: 1.25em;
            margin-top: 1.2em;
            margin-bottom: 0.5em;
            color: #3a3a3a;
        }}
        
        p {{
            margin-bottom: 1.2em;
        }}
        
        img {{
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1.5em auto;
            border-radius: 4px;
        }}
        
        a {{
            color: #0066cc;
            text-decoration: none;
        }}
        
        a:hover {{
            text-decoration: underline;
        }}
        
        blockquote {{
            border-left: 4px solid #ddd;
            padding-left: 1em;
            margin: 1.5em 0;
            color: #666;
        }}
        
        code {{
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: Consolas, Monaco, 'Courier New', monospace;
            font-size: 0.9em;
        }}
        
        pre {{
            background: #f4f4f4;
            padding: 1em;
            border-radius: 4px;
            overflow-x: auto;
            margin: 1.5em 0;
        }}
        
        pre code {{
            background: none;
            padding: 0;
        }}
        
        ul, ol {{
            margin-left: 2em;
            margin-bottom: 1.2em;
        }}
        
        li {{
            margin-bottom: 0.5em;
        }}
        
        .source-info {{
            margin-top: 2em;
            padding-top: 1em;
            border-top: 1px solid #ddd;
            font-size: 0.9em;
            color: #666;
        }}
        
        @media (max-width: 768px) {{
            body {{
                padding: 10px;
            }}
            
            .container {{
                padding: 20px;
            }}
            
            h1 {{
                font-size: 1.5em;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>{title}</h1>
        <article>
            {content}
        </article>
        <div class="source-info">
            <p>Original source: <a href="{url}" target="_blank">{url}</a></p>
            <p>Converted on: {date}</p>
        </div>
    </div>
</body>
</html>
"""
    
    from datetime import datetime
    
    html_output = html_template.format(
        title=data['title'],
        description=data['description'],
        content=data['content'],
        url=URL,
        date=datetime.now().strftime('%Y-%m-%d')
    )
    
    with open(OUTPUT_HTML, 'w', encoding='utf-8') as f:
        f.write(html_output)
    
    print(f"\n✓ HTML file created: {OUTPUT_HTML}")

def main():
    """Main function"""
    print("=" * 60)
    print("Note.com Article Converter")
    print("=" * 60)
    print()
    
    # Fetch the page
    html_content = fetch_page(URL)
    
    # Extract and process content
    print("\nExtracting content and downloading images...")
    data = extract_and_process_content(html_content)
    
    # Create HTML file
    print("\nCreating HTML file...")
    create_html_file(data)
    
    print("\n" + "=" * 60)
    print("✓ Conversion complete!")
    print(f"  - HTML file: {OUTPUT_HTML}")
    print(f"  - Images folder: {IMAGES_DIR}/")
    print("=" * 60)

if __name__ == '__main__':
    main()
