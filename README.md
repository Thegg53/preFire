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

## TODO

- [ ] **Banlist page — original printings**: fetch card images using the Scryfall set parameter (`?set=<code>`) to show the historically correct printing for each banned/watched card, rather than the default (usually most recent) Scryfall result. The set code for each card would need to be stored alongside the card name in `INPUT/banlists/banlist.js` and `watchlist.js`.
