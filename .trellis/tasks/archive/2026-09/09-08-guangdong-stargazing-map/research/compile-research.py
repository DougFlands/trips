"""Merge locally saved Edge observations; never fetches Xiaohongshu."""
import collections
import json
from pathlib import Path

ROOT = Path(__file__).parent
records = []
for path in sorted(ROOT.glob('group-*/records.jsonl')):
    for line in path.read_text(encoding='utf-8-sig').splitlines():
        if line.strip():
            record = json.loads(line)
            record['group'] = path.parent.name
            records.append(record)

supplemental = []
for path in sorted(ROOT.glob('group-*/supplemental-records.jsonl')):
    for line in path.read_text(encoding='utf-8-sig').splitlines():
        if line.strip():
            record = json.loads(line)
            record['group'] = path.parent.name
            supplemental.append(record)

keys = [(row['query'], row['noteId']) for row in records]
assert len(keys) == len(set(keys)), 'Duplicate ID within a keyword'
counts = collections.Counter(row['query'] for row in records)
assert len(counts) >= 10 and min(counts.values()) >= 50
original_ids = {row['noteId'] for row in records}
supplemental_ids = {row['noteId'] for row in supplemental}
detail_ids = {row['noteId'] for row in records + supplemental if row['readDepth'] == 'detail'}
summary = {
    'checkedAt': '2026-09-08',
    'method': 'Edge + unified-computer-use；可见搜索卡片、滚动与候选详情',
    'keywords': [{'query': query, 'count': count} for query, count in counts.items()],
    'associations': len(records),
    'uniquePosts': len(original_ids),
    'supplementalPosts': len(supplemental_ids - original_ids),
    'totalUniquePosts': len(original_ids | supplemental_ids),
    'detailPosts': len(detail_ids),
    'initialDetailPosts': len(detail_ids & original_ids),
    'decisions': dict(collections.Counter(row['decision'] for row in records)),
    'notes': '原12词计数保持独立；补充定向搜索不用于凑原词数量。详情数覆盖原记录与补充记录，按帖子ID全局去重。搜索卡片不等于已核验的地点。'
}
(ROOT / 'search-records.jsonl').write_text('\n'.join(json.dumps(row, ensure_ascii=False) for row in records) + '\n', encoding='utf-8')
(ROOT / 'search-summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
(ROOT / 'supplemental-records.jsonl').write_text('\n'.join(json.dumps(row, ensure_ascii=False) for row in supplemental) + ('\n' if supplemental else ''), encoding='utf-8')
print(json.dumps(summary, ensure_ascii=False, indent=2))
