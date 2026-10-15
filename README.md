# Adding stuff
- Only change things inside of the INPUT folder. Github actions will do the rest.

## Adding Events
- Change /INPUT/eventlist/events.txt
- Use the following format.
```
Name=Super Awesome Tournament
Link=https://discord.com/events/12345678901234567890
Info=Put some information about the event here. Do not use quotation marks.
Time=28 July 2003 14:00 UTC
```

## Adding decklists
- Just throw them in /INPUT/decklists
- Use the following format.
```txt
4 Ad Nauseam
4 Angel's Grace
4 City of Brass

SIDEBOARD:
2 Boseiju, Who Shelters All
2 Echoing Truth
```

## Changing the Banlist/Watchlist
- Edit /INPUT/banlists/banlist.js and /INPUT/banlists/watchlist.js

---

## Running Locally

The site is plain HTML + JS with no build step, but you can't open the HTML files directly from the filesystem (`file://`) because browsers block ES module imports and `fetch()` calls cross-origin. You need a local HTTP server.

### Option 1 — VS Code + Live Server (recommended, auto-reload on save)
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code.
2. Right-click `index.html` in the Explorer panel → **Open with Live Server**.
3. The site opens at `http://127.0.0.1:5500` and automatically reloads when you save a file.

### Option 2 — Python (no install needed on macOS/Linux)
```bash
python3 -m http.server 8080
```
Then open http://localhost:8080

### Option 3 — Node.js (no global install needed)
```bash
npx serve .
```
Then open the URL printed in the terminal (usually http://localhost:3000).

---

## Scripts

### Setting up the Python Virtual Environment

Some scripts require Python dependencies. Set up a virtual environment in the SCRIPTS directory:

```bash
cd SCRIPTS
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -e .
```

The `.venv` directory is gitignored and won't be committed.

### Fetching Card Images from Scryfall

Use `fetch_card_image.py` to download card images from Scryfall and save them as WebP files in the correct directories (`RESOURCES/img/card/large` and `RESOURCES/img/card/small`).

**Usage:**
```bash
cd SCRIPTS
source .venv/bin/activate
python3 fetch_card_image.py "Card Name"              # Oldest printing (8ED-RNA, paper, core/expansion)
python3 fetch_card_image.py "Card Name" --set MRD    # Specific set (Mirrodin)
python3 fetch_card_image.py "Card Name" --set "10E"  # 10th Edition
```

**Examples:**
```bash
python3 fetch_card_image.py "Plains" --set "10E"
python3 fetch_card_image.py "Splinter Twin"          # Defaults to oldest printing
python3 fetch_card_image.py "Forest"
```

The script will:
1. Query Scryfall's API for the card (from oldest printing in the range if no set specified)
2. Download the card image
3. Convert to WebP format
4. Save as large (~488x680px) and small (~150x209px) versions

---

## TODO 
- [ ] add set symbols in the Cards page, in additon to the 3-letter expansion name/code      
