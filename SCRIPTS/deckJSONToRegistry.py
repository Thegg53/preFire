#!/usr/bin/env python3
import json
from typing import List, Any, Iterable

def gather(term: str, data: List[dict]) -> List[Any]:
    uniq = set()
    for obj in data:
        items = obj.get(term, [])
        if items is None: continue
        if not isinstance(items, (list, tuple, set)): items = [items]
        uniq.update(items)
    return sorted(uniq)

def main():
    terms = ["cards", "archs"]
    with open("../RESOURCES/data/lists/decks.json", "r", encoding="utf-8") as f: data = json.load(f)
    result = {term: gather(term, data) for term in terms}
    with open("../RESOURCES/data/lists/decs_registry.json", "w", encoding="utf-8") as f: json.dump(result, f, ensure_ascii=False, indent=0)

if __name__ == "__main__":
    main()

