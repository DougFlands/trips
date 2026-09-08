"""Integrate reviewed local research; no network or browser access."""
import json
from pathlib import Path

research = Path(__file__).parent
repo = research.parents[3]
fields = 'id name city district terrain wgs84 precision coordinateUrl summary access nightAccess caution sources bortle mapUrl'.split()
models = {}
for path in [research / 'expansion-dark-sky.jsonl', *research.glob('group-*/extra-dark-sky.jsonl')]:
    if path.exists():
        for line in path.read_text(encoding='utf-8-sig').splitlines():
            if line.strip():
                row = json.loads(line)
                models[row['id']] = row

expanded = []
for path in sorted(research.glob('group-*/expansion-places.json')):
    data = json.loads(path.read_text(encoding='utf-8-sig'))
    for row in data if isinstance(data, list) else data['places']:
        place = {field: row[field] for field in fields}
        if place['id'] in models:
            model = models[place['id']]
            requested = model.get('wgs84', model.get('requestedWgs84'))
            assert all(abs(a-b) < 0.00001 for a,b in zip(place['wgs84'], requested)), place['id']
            place['bortle'] = model['bortle'] if isinstance(model['bortle'], dict) else dict(min=model['bortle'], max=model['bortle'], sqm=model['sqm'], year=model['year'], sampledWgs84=model['sampledWgs84'])
        expanded.append(place)
assert len({p['id'] for p in expanded}) == len(expanded)

target = repo / 'src/trips/guangdong-stargazing/places.ts'
source = target.read_text(encoding='utf-8')
start = '  // Expanded catalog from reviewed research.\n'
end = '  // End expanded catalog.\n'
if start in source:
    source = source.split(start)[0] + source.split(end)[1]
block = ''.join('  ' + json.dumps(place, ensure_ascii=False, indent=2).replace('\n', '\n  ') + ',\n' for place in expanded)
source = source.replace('];\n\nexport function bortleLabel', start + block + end + '];\n\nexport function bortleLabel')
target.write_text(source, encoding='utf-8')
print(f'Integrated {len(expanded)} additional places; {sum(bool(p["bortle"]) for p in expanded)} model values.')
