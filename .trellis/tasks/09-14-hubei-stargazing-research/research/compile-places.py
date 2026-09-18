"""Merge audited place leads without inventing coordinates or Bortle grades."""
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).parent
ALIASES = {
    "大悟山仙居顶": "仙居顶",
    "大悟三爪山": "三爪山 · 祖师殿",
    "神农架机场": "神农架红坪机场周边",
    "神农架红坪机场外围": "神农架红坪机场周边",
    "神农架大九湖": "大九湖",
    "南顶草原": "南顶大草原",
    "清凉寨刘家山观景台": "刘家山观景台",
    "雾云山": "蕲春雾云山梯田",
    "九宫山桃源星空酒店后方土路": "九宫山桃源星空酒店后土路",
}


def unique(values):
    return list(dict.fromkeys(v for v in values if v))


def as_list(value):
    return value if isinstance(value, list) else [value] if value else []


details = {}
for path in ROOT.glob("group-*/details.jsonl"):
    for line in path.read_text(encoding="utf-8-sig").splitlines():
        if line.strip():
            row = json.loads(line)
            if row.get("readDepth") == "detail":
                details.setdefault(row["noteId"], row)

places = {}
for path in sorted(ROOT.glob("group-*/places.json")):
    for row in json.loads(path.read_text(encoding="utf-8-sig")):
        name = ALIASES.get(row["name"], row["name"])
        item = places.setdefault(name, {"name": name, "city": None, "aliases": [], "statuses": [], "sourceNoteIds": [], "summaries": [], "access": [], "risks": [], "groups": [], "coordinates": None, "bortle": None})
        if row.get("city") and not str(row["city"]).startswith("待核"):
            item["city"] = row["city"]
        item["aliases"] += as_list(row.get("aliases")) + ([row["name"]] if name != row["name"] else [])
        item["statuses"].append(row.get("status", "lead-only"))
        item["sourceNoteIds"] += row.get("sourceNoteIds", []) + [s["noteId"] for s in row.get("sources", [])]
        item["summaries"] += as_list(row.get("summary")) + as_list(row.get("notes"))
        item["access"] += as_list(row.get("access"))
        item["risks"] += as_list(row.get("risks"))
        item["groups"].append(path.parent.name)

for row in places.values():
    for key in ["aliases", "statuses", "sourceNoteIds", "summaries", "access", "risks", "groups"]:
        row[key] = unique(row[key])
    missing = set(row["sourceNoteIds"]) - details.keys()
    assert not missing, f"Place source not actually opened: {row['name']} {missing}"
    statuses = row["statuses"]
    if any(s.startswith(("hold", "caution", "access-unverified", "excluded")) for s in statuses):
        row["status"] = "hold"
    elif any(s.startswith("candidate") for s in statuses):
        row["status"] = "candidate"
    elif any("commercial" in s or "promotion" in s for s in statuses):
        row["status"] = "promotion-unverified"
    else:
        row["status"] = "lead-only"
    row["sources"] = [{"noteId": i, "title": details[i]["title"], "url": details[i]["url"]} for i in row["sourceNoteIds"]]

# The supplemental visit resolves the roundup's ambiguous grassland name.
places["南顶大草原"]["status"] = "candidate"
places["南顶大草原"]["risks"].append("后续实地帖已确认南顶大草原；旧汇总地名模糊，具体坐标仍待核。")
for name in ["九宫山铜鼓包", "大幕山"]:
    places[name]["status"] = "hold"
places["九宫山铜鼓包"]["aliases"] = [a for a in places["九宫山铜鼓包"]["aliases"] if a != "铜鼓包停车场亭子"]
places["云上旺角"]["parentArea"] = "火烧坪"
places["火烧坪"]["risks"].append("区域线索包含下列云上旺角，不能将两条记录算作两个独立机位。")

rows = sorted(places.values(), key=lambda r: (r["status"], r["city"] or "待核", r["name"]))
(ROOT / "places.json").write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
summary = json.loads((ROOT / "search-summary.json").read_text(encoding="utf-8"))
assert summary["allKeywordTargetsMet"], "Keyword targets incomplete"
summary["placeRecords"] = len(rows)
summary["placeStatuses"] = dict(Counter(r["status"] for r in rows))
(ROOT / "search-summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

def cell(text):
    return str(text or "待核").replace("|", "／").replace("\n", " ")


lines = [
    "# 湖北观星地点研究 · 2026-09-14", "",
    f"Edge小红书采集：12个关键词，每词至少50篇，共{summary['associations']}条关键词关联、{summary['uniqueSearchPosts']}篇独立搜索帖子。另含定向补读，实际打开{summary['detailPosts']}篇不同详情；全部来源合计{summary['totalUniquePosts']}篇独立帖子。", "",
    "搜索卡片不等于详情阅读；帖子列出的地点也不等于已确认可夜间进入。坐标、当前管理规则和统一波尔特模型仍待核验，本轮没有修改页面。", "",
    "## 关键词完成情况", "", "|关键词|同词去重帖子数|", "|---|---:|",
]
lines += [f"|{q['query']}|{q['count']}|" for q in summary["keywords"]]
lines += ["", f"合并别名后保存{len(rows)}条地点/区域线索。‘恩施’等大区域及未定位名称仅作线索，不算具体地图点位；火烧坪区域包含云上旺角，条目数不等于独立机位数。", ""]
sections = [("candidate", "优先继续核验", "有拍摄或实地经历证据，仍需定位机位与核对夜间通行。"), ("promotion-unverified", "推广线索", "商业或景区推广，缺少足够独立拍摄证据。"), ("lead-only", "仅线索", "汇编列名、评论提及或地点不明，不能直接作为地图点位。"), ("hold", "暂缓或需额外确认", "存在准入、灯光或来源争议，保留记录但不作为优先点。")]
for status, title, intro in sections:
    group = [r for r in rows if r["status"] == status]
    lines += [f"## {title} · {len(group)}条", "", intro, "", "|地点|城市/区域|已知依据|限制与待核|帖子来源|", "|---|---|---|---|---|"]
    for row in group:
        evidence = "；".join(row["summaries"]) or "实际读取来源中的地点线索，详见原始详情记录。"
        caveat = "；".join(row["access"] + row["risks"]) or "坐标、模型和当前夜间通行待核验。"
        links = "、".join(f"[{i+1}]({s['url']})" for i,s in enumerate(row["sources"]))
        lines.append(f"|{cell(row['name'])}|{cell(row['city'])}|{cell(evidence)}|{cell(caveat)}|{links}|")
    lines.append("")
lines += ["## 文件说明", "", "- search-records.jsonl：原12词关键词关联记录。", "- detail-records.jsonl：实际打开的详情证据；跨组重复记录保留，统计按ID去重。", "- places.json：合并别名后的地点线索，保留来源、状态与限制。", "- group-*/：各组原始记录、截图与总结。", "", "未向小红书发布内容或联系作者；未将AI搜索摘要当作原帖证据，未按主观等级生成坐标或波尔特数值。"]
(ROOT / "places.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
print(json.dumps({"places": len(rows), "statuses": summary["placeStatuses"]}, ensure_ascii=False))
