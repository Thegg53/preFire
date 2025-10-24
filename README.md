# preFire

PreFire Magic - Note.com Article Converter

## Overview

This repository contains tools to convert articles from note.com into standalone HTML files with all images downloaded locally.

## Target Article

URL: https://note.com/handshuffling/n/n83bbad08cbbd

## Files Structure

```
preFire/
├── article.html          # The converted HTML file
├── images/               # Folder for downloaded images
├── fetch_and_convert.py  # Python script to fetch and convert the article
└── README.md            # This file
```

## Prerequisites

- Python 3.6 or higher
- Internet connection to fetch the article

## Installation

Install the required Python packages:

```bash
pip install requests beautifulsoup4
```

## Usage

### Automatic Conversion

Run the conversion script to automatically fetch the article and convert it:

```bash
python3 fetch_and_convert.py
```

The script will:
1. Fetch the article from note.com
2. Extract the title, content, and metadata
3. Download all images to the `images/` folder
4. Create a standalone `article.html` file with embedded styling

### Manual Process

If you prefer to do the conversion manually or the script doesn't work:

1. Visit https://note.com/handshuffling/n/n83bbad08cbbd in your browser
2. Save the page content
3. Download images and place them in the `images/` folder
4. Update `article.html` with the content

## Features

- **Standalone HTML**: No external dependencies, all resources are local
- **Responsive Design**: Mobile-friendly layout that adapts to screen size
- **Clean Styling**: Professional appearance with good typography
- **Image Management**: All images downloaded and referenced locally
- **Preservation**: Maintains article structure, headings, and formatting

## Output

After running the script, you'll have:

- `article.html` - A complete, self-contained HTML file
- `images/` - A folder with all article images (named sequentially)

## Styling Features

The converted HTML includes:
- Responsive container with max-width for readability
- Proper heading hierarchy and spacing
- Image styling with rounded corners and auto-sizing
- Code block formatting
- Mobile-optimized layout
- Professional typography using system fonts

## Notes

⚠️ **Network Restrictions**: If you're running this in a restricted environment where external websites cannot be accessed, you'll need to run the script in a different environment with internet access.

## License

See LICENSE file for details.
