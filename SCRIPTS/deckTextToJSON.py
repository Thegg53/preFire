#!/usr/bin/env python3
import os
import sys
import json
import re

LINE_RE = re.compile(r'^\s*(\d+)\s+(.+?)\s*$')

def parse_section(lines):
    names, amnts = [], []
    for line in lines:
        if not line.strip(): continue
        m = LINE_RE.match(line)
        if not m: continue
        try: qty = int(m.group(1))
        except ValueError: continue
        text = m.group(2)
        names.append(text)
        amnts.append(qty)
    return names, amnts

def parse_file(path):
    with open(path, 'r', encoding='utf-8') as f: raw = f.read().splitlines()

    sideboard_idx = None
    for i, line in enumerate(raw):
        if line.strip().upper() == 'SIDEBOARD:':
            sideboard_idx = i
            break

    if sideboard_idx is None:
        main_lines, side_lines = raw, []
    else:
        main_lines = raw[:sideboard_idx]
        side_lines = raw[sideboard_idx + 1:]

    main_names, main_amnt = parse_section(main_lines)
    side_names, side_amnt = parse_section(side_lines)

    return {
        "name"     : [os.path.splitext(os.path.basename(path))[0]],
        "main"     : main_names,
        "main_amnt": main_amnt,
        "side"     : side_names,
        "side_amnt": side_amnt
    }

def gather(directory, extensions={'.txt'}):
    out = []
    for entry in sorted(os.listdir(directory)):
        path = os.path.join    (directory, entry)
        if not os.path.isfile  (path): continue
        ext  = os.path.splitext(entry)[1].lower()
        if extensions and ext not in extensions: continue
        out.append(parse_file(path))
    return out

def resolve_source_dir(script_dir):
    if len(sys.argv) > 1:
        candidate = os.path.abspath(os.path.join(os.getcwd(), sys.argv[1]))
        return candidate
    # Fallbacks if no arg
    fallbacks = [
        os.path.join(script_dir, "DECKS"),
        os.path.join(script_dir, "..", "DECKS"),
        os.path.join(os.getcwd(), "DECKS"),
        os.path.join(os.getcwd(), "lists"),
    ]
    for p in fallbacks:
        if os.path.isdir(p):
            return p
    return fallbacks[0]

def main():
    script_dir = os.path.dirname(__file__)
    repo_root  = os.path.abspath(os.path.join(script_dir, "..")) # repo_root is parent of SCRIPTS/
    source_dir = resolve_source_dir(script_dir)

    if not os.path.isdir(source_dir):
        print(f"ERROR: Source directory not found: {source_dir}", file=sys.stderr)
        sys.exit(1)

    output_dir = os.path.join(repo_root, "RESOURCES", "data", "lists")
    os.makedirs(output_dir, exist_ok=True)

    result = gather(source_dir)
    if not result:
        print(f"ERROR: No .txt files found in {source_dir}", file=sys.stderr)
        sys.exit(1)

    out_path = os.path.join(output_dir, "decks.json")
    with open(out_path, 'w', encoding='utf-8') as f: json.dump(result, f, ensure_ascii=False, indent=2)

    print(json.dumps(result, ensure_ascii=False, indent=2))
    print(f"Converted {len(result)} deck(s) -> {out_path}")

    gh_out = os.getenv("GITHUB_OUTPUT")
    if gh_out:
        with open(gh_out, "a", encoding="utf-8") as fh:
            fh.write(f"decks_path={out_path}\n")
            fh.write(f"decks_count={len(result)}\n")

if __name__ == "__main__":
    main()
