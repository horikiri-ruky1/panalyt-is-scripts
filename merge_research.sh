#!/bin/bash
# Merge batch_5companies.json into research_data.json
# Run this script manually: bash merge_research.sh

DASHBOARD="/Users/yousay/Documents/仕事/DigiMan/パナリット/panalyt-research-dashboard"
BATCH="/Users/yousay/panalyt-is-scripts/batch_5companies.json"
TARGET="$DASHBOARD/public/research_data.json"

python3 << PYEOF
import json

with open('$BATCH', 'r') as f:
    new_data = json.load(f)

with open('$TARGET', 'r') as f:
    existing = json.load(f)

existing_names = {d.get('name_formal') for d in existing}
added = []
for item in new_data:
    if item['name_formal'] not in existing_names:
        existing.append(item)
        added.append(item['name_formal'])
    else:
        print(f"SKIP: {item['name_formal']}")

with open('$TARGET', 'w') as f:
    json.dump(existing, f, ensure_ascii=False, indent=2)

print(f"Added {len(added)} companies")
print(f"Total: {len(existing)}")
PYEOF

cd "$DASHBOARD"
git add public/research_data.json
git commit -m "Add research data for WDBホールディングス, LINEヤフー, アークランズ, アース製薬, アイカ工業"
git push
echo "Dashboard updated and pushed!"
