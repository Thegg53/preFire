#!/usr/bin/env python3
"""
Rename all .webp files in git's index (under RESOURCES/img) that have
uppercase letters in their basename to fully lowercase.
Uses OS-level renames (two-step via temp name for macOS case-insensitive FS),
then runs a single `git add -A` to record everything at once.
Run from the repo root: python3 SCRIPTS/lowercase_webp.py
"""
import os
import subprocess
import sys

root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# Get all tracked uppercase webp filenames from git index
result = subprocess.run(
    ["git", "ls-files", "RESOURCES/img/"],
    cwd=root, capture_output=True, text=True, check=True
)
tracked = result.stdout.splitlines()

renames = []
for rel_path in tracked:
    parts = rel_path.split("/")
    fname = parts[-1]
    lower = fname.lower()
    if fname != lower:
        parts[-1] = lower
        src = os.path.join(root, rel_path)
        dst = os.path.join(root, *parts)
        renames.append((src, dst))

if not renames:
    print("Nothing to rename.")
    sys.exit(0)

print(f"Renaming {len(renames)} files on disk...")

errors = []
for i, (src, dst) in enumerate(renames):
    tmp = src + ".__lctmp"
    try:
        os.rename(src, tmp)
        os.rename(tmp, dst)
    except Exception as e:
        errors.append(f"{src}: {e}")
    if (i + 1) % 2000 == 0:
        print(f"  {i + 1}/{len(renames)}...")

print(f"  {len(renames) - len(errors)} renamed, {len(errors)} errors.")
if errors:
    print("Errors:")
    for e in errors[:10]:
        print(" ", e)
    sys.exit(1)

print("Running git add -A RESOURCES/img/ ...")
subprocess.run(["git", "add", "-A", "RESOURCES/img/"], cwd=root, check=True)
print("Done. Commit with: git commit -m 'Lowercase all card image filenames'")
