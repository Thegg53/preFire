#!/usr/bin/env python3
"""
Fetch a card image from Scryfall, convert to WebP, and save to both large and small directories.

Usage:
  python3 SCRIPTS/fetch_card_image.py "Card Name"                    # Oldest printing
  python3 SCRIPTS/fetch_card_image.py "Card Name" --set MRD          # Specific set (Mirrodin)
  python3 SCRIPTS/fetch_card_image.py "Card Name" --set "10E"        # 10th Edition

Dependencies: Pillow (install via: uv pip install -e SCRIPTS/)
Run from the repo root.
"""
import os
import sys
import json
import urllib.request
import urllib.parse
import urllib.error
import argparse
from PIL import Image
from io import BytesIO

def make_clean_card_name(card_name):
    """Convert card name to filename format: 'Jace, the Mind Sculptor' -> 'jace__the_mind_sculptor'"""
    return card_name.replace(" ", "_").replace("'", "_").replace(",", "_").lower()

def fetch_card_from_scryfall(card_name, set_code=None):
    """
    Fetch card data from Scryfall.
    If set_code is provided, fetch that specific printing.
    Otherwise, fetch the oldest printing from 8ED to RNA (paper, core/expansion sets only).
    """
    if set_code:
        # Fetch specific set
        query = f'!"{card_name}" set:{set_code}'
        url = f"https://api.scryfall.com/cards/search?q={urllib.parse.quote(query)}&unique=prints"
    else:
        # Fetch oldest printing: 8ED through RNA, paper only, core or expansion sets
        query = f'!"{card_name}" date>=8ed date<=rna game:paper (st:core or st:expansion)'
        url = f"https://api.scryfall.com/cards/search?q={urllib.parse.quote(query)}&order=released&dir=asc&unique=prints"
    
    print(f"  Fetching from Scryfall: {url}")
    try:
        request = urllib.request.Request(
            url,
            headers={
                'User-Agent': 'PreFIRE-CardFetcher/1.0',
                'Accept': 'application/json'
            }
        )
        with urllib.request.urlopen(request) as response:
            data = json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"  HTTP {e.code}: {e.reason}")
        print(f"  Response: {e.read().decode()}", file=sys.stderr)
        raise ValueError(f"Scryfall request failed: HTTP {e.code}")
    except Exception as e:
        raise ValueError(f"Scryfall request failed: {e}")
    
    if not data.get("data") or len(data["data"]) == 0:
        raise ValueError(f"No card found for '{card_name}'" + (f" in set {set_code}" if set_code else ""))
    
    card = data["data"][0]
    
    # Extract image URL
    image_url = None
    if card.get("image_uris") and card["image_uris"].get("normal"):
        image_url = card["image_uris"]["normal"]
    elif card.get("card_faces"):
        for face in card["card_faces"]:
            if face.get("image_uris") and face["image_uris"].get("normal"):
                image_url = face["image_uris"]["normal"]
                break
    
    if not image_url:
        raise ValueError(f"No image found for '{card_name}'")
    
    set_name = card.get("set_name", "Unknown Set")
    released_at = card.get("released_at", "Unknown Date")
    actual_name = card.get("name", card_name)
    
    return {
        "image_url": image_url,
        "name": actual_name,
        "set": card.get("set", ""),
        "set_name": set_name,
        "released_at": released_at
    }

def download_image(url):
    """Download image from URL and return as PIL Image"""
    print(f"  Downloading image from: {url}")
    try:
        request = urllib.request.Request(
            url,
            headers={'User-Agent': 'PreFIRE-CardFetcher/1.0'}
        )
        with urllib.request.urlopen(request) as response:
            return Image.open(BytesIO(response.read()))
    except Exception as e:
        raise ValueError(f"Failed to download image: {e}")

def resize_and_convert_to_webp(image, size_name):
    """Resize image to target size and convert to WebP"""
    if size_name == "large":
        # Large: typically ~488px width (for card display)
        new_size = (488, 680)
    elif size_name == "small":
        # Small: typically ~150px width (for thumbnails)
        new_size = (150, 209)
    else:
        raise ValueError(f"Unknown size: {size_name}")
    
    # Resize maintaining aspect ratio
    image.thumbnail(new_size, Image.Resampling.LANCZOS)
    
    # Create new image with target size and paste resized image centered
    new_image = Image.new("RGB", new_size, (0, 0, 0))
    offset = ((new_size[0] - image.size[0]) // 2, (new_size[1] - image.size[1]) // 2)
    new_image.paste(image, offset)
    
    return new_image

def main():
    parser = argparse.ArgumentParser(
        description="Fetch a card image from Scryfall, convert to WebP, and save to card directories."
    )
    parser.add_argument("card_name", help="Name of the card (e.g., 'Splinter Twin')")
    parser.add_argument("--set", dest="set_code", help="Optional set code (e.g., 'MRD', '10E')")
    
    args = parser.parse_args()
    
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    large_dir = os.path.join(repo_root, "RESOURCES", "img", "card", "large")
    small_dir = os.path.join(repo_root, "RESOURCES", "img", "card", "small")
    
    os.makedirs(large_dir, exist_ok=True)
    os.makedirs(small_dir, exist_ok=True)
    
    try:
        print(f"Fetching '{args.card_name}'" + (f" from set {args.set_code}" if args.set_code else " (oldest printing)") + "...")
        card_data = fetch_card_from_scryfall(args.card_name, args.set_code)
        
        print(f"  Found: {card_data['name']} ({card_data['set_name']}, {card_data['released_at']})")
        
        image = download_image(card_data["image_url"])
        original_size = image.size
        print(f"  Original image size: {original_size}")
        
        clean_name = make_clean_card_name(card_data["name"])
        
        # Large
        print(f"  Converting to large WebP...")
        large_image = resize_and_convert_to_webp(image.copy(), "large")
        large_path = os.path.join(large_dir, f"{clean_name}.webp")
        large_image.save(large_path, "WEBP", quality=90)
        print(f"  Saved: {large_path}")
        
        # Small
        print(f"  Converting to small WebP...")
        small_image = resize_and_convert_to_webp(image.copy(), "small")
        small_path = os.path.join(small_dir, f"{clean_name}.webp")
        small_image.save(small_path, "WEBP", quality=90)
        print(f"  Saved: {small_path}")
        
        print(f"\n✓ Successfully saved '{args.card_name}' !")
        
    except ValueError as e:
        print(f"✗ Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"✗ Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
