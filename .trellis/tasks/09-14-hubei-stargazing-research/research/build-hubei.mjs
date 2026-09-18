// Rebuild the static catalog only from saved, actually observed verification records.
import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';

const root = new URL('../../../../', import.meta.url);
const read = name => JSON.parse(fs.readFileSync(new URL(name, import.meta.url), 'utf8'));
const stringify = value => JSON.stringify(value, null, 2);
const { outputText } = ts.transpileModule(fs.readFileSync(new URL('src/lib/coordinates.ts', root), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { wgs84ToGcj02 } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
function inverse(gcj) {
  let wgs = [...gcj];
  for (let i = 0; i < 8; i++) {
    const mapped = wgs84ToGcj02(wgs);
    wgs = wgs.map((v, j) => v + gcj[j] - mapped[j]);
  }
  assert.ok(wgs84ToGcj02(wgs).every((v, j) => Math.abs(v - gcj[j]) < 1e-8));
  return wgs.map(v => +v.toFixed(6));
}
const checkedAt = '2026-09-18';
const names = ['武当山南岩', '九宫山铜鼓包', '九宫山桃源后土路', '大幕山', '薄刀峰东门停车场', '蕲春雾云山梯田', '道观河龙凤桥', '仙居顶', '云台荒', '火烧坪', '大九湖', '天燕星空营地', '红安天台山', '漳河水库大坝', '汉江绿谷', '葫芦包崖观景台'];
const aliases = {'九宫山桃源后土路': '九宫山桃源星空酒店后土路', '汉江绿谷': '汉江绿谷附近', '漳河水库大坝': '漳河水库 · 大坝区域'};
const original = read('places.json');
const details = fs.readFileSync(new URL('detail-records.jsonl', import.meta.url), 'utf8').trim().split('\n').map(JSON.parse);
const evidence = new Map();
for (const file of ['verified-east.json', 'verified-west.json']) {
  for (const r of read(file).places) {
    if (r.bortle == null) continue;
    const coord = r.displayedCoordinates ?? r.sampledCoordinates;
    const lp = r.lightPollution;
    evidence.set(r.name, {...r, lightPollution: lp ? {...lp, min: lp.min ?? lp.bortle, max: lp.max ?? lp.bortle, year: 2026, checkedAt} : null, wgs84: inverse(coord), tianwentong: {
      min: r.bortle, max: r.bortle, sqm: r.sqm, year: 2025, checkedAt,
      sampledCoordinates: coord, coordinateSystem: '腾讯地图显示坐标',
      matchedLocation: [r.matchedLocation, r.matchedAddress].filter(Boolean).join(' · '), searchQuery: r.searchQuery,
    }});
  }
}
for (const r of read('verified-central.json').places) {
  if (!r.coordinate?.wgs84) continue;
  evidence.set(r.name, {...r, wgs84: r.coordinate.wgs84, precision: r.coordinate.precision,
    tianwentong: {min:r.tianwentong.bortle,max:r.tianwentong.bortle,sqm:r.tianwentong.sqm,year:2025,checkedAt,sampledCoordinates:r.coordinate.rawDisplay,coordinateSystem:'腾讯地图显示坐标',matchedLocation:`${r.matchedPoi} · ${r.matchedAddress}`,searchQuery:r.searchQuery},
    lightPollution: {min:r.lightPollution.bortle,max:r.lightPollution.bortle,sqm:r.lightPollution.sqm,year:2026,checkedAt,sampledCoordinates:r.lightPollution.wgs84,coordinateSystem:'WGS84',matchedLocation:r.lightPollution.locationLabel},
  });
}
for (const r of read('verified-main.json')) evidence.set(r.name, r);
for (const r of read('verified-lp-main.json')) {
  assert.ok(evidence.has(r.name), `Missing location evidence: ${r.name}`);
  Object.assign(evidence.get(r.name), r);
}
const deferredReasons = {
  '九宫山桃源后土路': '原帖后土路未定位；景区历史指引称星空桃园酒店背山露营区在江西武宁境内。民宿搜索读数不作为湖北机位。',
  '火烧坪': '仅匹配乡政府，原帖山顶亭子与云上旺角未定位；行政驻地读数不作为摄影点。',
  '天燕星空营地': '仅匹配天燕景区，尚未确认营地位置；景区中心读数不作为营地读数。',
  '葫芦包崖观景台': '原帖指向郧阳大柳乡230省道弯道，搜索未匹配；需核对原帖地图标记图。',
};
const district = {'武当山南岩':'丹江口 · 武当山','九宫山铜鼓包':'通山 · 九宫山','大幕山':'通山 · 黄沙铺镇','薄刀峰东门停车场':'罗田','蕲春雾云山梯田':'蕲春 · 檀林镇','道观河龙凤桥':'新洲 · 道观河','仙居顶':'大悟 · 吕王镇','云台荒':'长阳 · 榔坪镇','大九湖':'大九湖镇','红安天台山':'红安 · 七里坪镇','漳河水库大坝':'东宝 · 漳河','汉江绿谷':'郧阳 · 安阳镇'};
const displayNames = {'武当山南岩':'武当山南岩 · 南岩宫参考','薄刀峰东门停车场':'薄刀峰东门2号停车场','蕲春雾云山梯田':'雾云山梯田 · 村域参考','红安天台山':'红安天台山 · 天台寺广场','漳河水库大坝':'漳河水库 · 观音寺大坝参考','汉江绿谷':'汉江绿谷附近 · 景区参考'};
const terrains = {'武当山南岩':'山中古建','九宫山铜鼓包':'高山','大幕山':'风车山','薄刀峰东门停车场':'山地停车场','蕲春雾云山梯田':'梯田 · 茶园','道观河龙凤桥':'桥梁 · 湖库','仙居顶':'风车山','云台荒':'高山','大九湖':'湿地湖区','红安天台山':'古寺广场','漳河水库大坝':'水库大坝','汉江绿谷':'景区湖畔'};
const clean = value => value.replace(/。；/g, '；').replace('；行政区应为新洲，原前端黄陂错误。', '。');
function sourceRecords(name) {
  const p = original.find(p => p.name === (aliases[name] ?? name));
  assert.ok(p, `Missing original note source: ${name}`);
  return {p, sources: p.sourceNoteIds.map(id => {
    const d = details.find(d => d.noteId === id);
    assert.ok(d && d.readDepth === 'detail');
    return {title:d.title,url:d.url,date:'采集于2026-09-14'};
  })};
}
const fields = ['min','max','sqm','year','checkedAt','sampledCoordinates','coordinateSystem','matchedLocation','searchQuery'];
function reading(r) {
  if (!r) return null;
  assert.ok(Number.isFinite(r.min) && Number.isFinite(r.max) && Number.isFinite(r.sqm), 'Invalid model value');
  return Object.fromEntries(fields.filter(k => r[k] !== undefined).map(k => [k,r[k]]));
}
const places = [], pending = [];
for (const [i, name] of names.entries()) {
  const {p, sources} = sourceRecords(name);
  if (deferredReasons[name]) { pending.push({id:`hubei-${i}`,name,reason:deferredReasons[name],sources}); continue; }
  const r = evidence.get(name);
  assert.ok(r?.wgs84 && r.wgs84.length === 2, `No verified reference coordinates: ${name}`);
  const precision = clean(r.precision ?? r.tianwentong?.matchedLocation ?? '具名POI参考，具体摄影机位未定位。');
  places.push({id:`hubei-${i}`,name:displayNames[name] ?? name,city:p.city,district:district[name],terrain:terrains[name],wgs84:r.wgs84,
    precision: `${precision}；坐标按地图GCJ-02反算WGS84，小数位不代表现场精度。`,
    coordinateUrl:r.coordinateUrl ?? 'https://www.darkmap.cn/',
    summary:clean(p.summaries.filter(s => !s.startsWith('来源仅提供')).join('；')),
    access:clean(p.access.join('；')), nightAccess:clean(`${p.risks.join('；')}${p.risks.length ? '；' : ''}当前夜间通行仍需确认。`),
    caution: name === '漳河水库大坝' ? '此处为已定位的观音寺大坝参考，原帖未明确坝名，不能确认与原拍摄点相同。天文通暂无可靠匹配。' : `${precision}；暗空为区域模型，现场灯光、云与月光另有影响。`,
    sources,lightPollution:reading(r.lightPollution),tianwentong:reading(r.tianwentong),
    mapUrl:r.mapUrl ?? `https://uri.amap.com/search?${new URLSearchParams({keyword:r.tianwentong?.searchQuery ?? name,city:p.city,view:'map'})}`,
  });
}
assert.equal(places.length + pending.length, 16);
const stats=read('search-summary.json');
const research={associations:stats.associations,uniquePosts:stats.uniqueSearchPosts,supplementalPosts:stats.additionalDetailPosts,detailPosts:stats.detailPosts,keywords:stats.keywords.map(({query,count})=>({query,count}))};
fs.writeFileSync(new URL('src/trips/guangdong-stargazing/hubei.ts',root),`// Generated from audited research/build-hubei.mjs. Preserve stable IDs for weather cache.\nimport type { StargazingPlace } from "./places";\n\nexport const hubeiPlaces: StargazingPlace[] = ${stringify(places)};\n\nexport const hubeiPending = ${stringify(pending)};\n\nexport const hubeiResearch = ${stringify(research)};\n`);
const report={checkedAt,totalReviewed:16,mappedReferences:places.length,deferred:pending.length,modelReadings:places.reduce((n,p)=>n+Number(!!p.lightPollution)+Number(!!p.tianwentong),0),places,pending};
fs.writeFileSync(new URL('verified-catalog.json',import.meta.url),stringify(report)+'\n');
console.log(stringify({mappedReferences:places.length,deferred:pending.length,readings:report.modelReadings}));
