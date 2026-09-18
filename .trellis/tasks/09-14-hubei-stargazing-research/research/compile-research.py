"""Summarize saved browser observations; no network access."""
from collections import Counter
from datetime import datetime, timezone
import json
from pathlib import Path

ROOT = Path(__file__).parent
QUERIES = [
    "湖北观星", "湖北星空拍摄", "湖北流星雨拍摄", "湖北银河摄影",
    "武汉周边观星", "武汉附近拍流星雨", "黄冈星空露营", "九宫山星空",
    "宜昌星空拍摄", "恩施星空露营", "神农架观星", "十堰星空",
]


def read_rows(filename):
    result = []
    for path in sorted(ROOT.glob(f"group-*/{filename}")):
        for line in path.read_text(encoding="utf-8-sig").splitlines():
            if line.strip():
                result.append({**json.loads(line), "group": path.parent.name})
    return result


records = read_rows("records.jsonl")
details = read_rows("details.jsonl")
unique_records = {}
for row in records:
    assert row["query"] in QUERIES, f"Unexpected query: {row['query']}"
    assert row["noteId"] in row["url"], f"ID / URL mismatch: {row['noteId']}"
    unique_records.setdefault((row["query"], row["noteId"]), row)
records = list(unique_records.values())
counts = Counter(row["query"] for row in records)
search_ids = {row["noteId"] for row in records}
detail_ids = {row["noteId"] for row in details if row.get("readDepth") == "detail"}
summary = {
    "generatedAt": datetime.now(timezone.utc).isoformat(),
    "method": "Edge + browser plugin, visible search cards and opened note details",
    "keywords": [{"query": q, "count": counts[q], "target": 50, "met": counts[q] >= 50} for q in QUERIES],
    "associations": len(records),
    "uniqueSearchPosts": len(search_ids),
    "detailPosts": len(detail_ids),
    "additionalDetailPosts": len(detail_ids - search_ids),
    "totalUniquePosts": len(search_ids | detail_ids),
    "allKeywordTargetsMet": all(counts[q] >= 50 for q in QUERIES),
    "decisions": dict(Counter(row.get("decision", "unclassified") for row in records)),
    "note": "搜索卡片数不等于详情阅读数；未达标关键词保留实际缺口。地点与坐标、暗空等级分别核验。",
}
for filename, rows in [("search-records.jsonl", records), ("detail-records.jsonl", details)]:
    (ROOT / filename).write_text("".join(json.dumps(row, ensure_ascii=False) + "\n" for row in rows), encoding="utf-8")
(ROOT / "search-summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps(summary, ensure_ascii=False, indent=2))
