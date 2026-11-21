export type Source = { sourceId: string; group: string; title: string; url: string; collectedAt: string };

export const sources: Source[] = [
  {"sourceId": "N34", "group": "official", "title": "札幌交通局：市电、地铁票价与换乘", "url": "https://www.city.sapporo.jp/st/josyaken/ryokin/ryoukin.html", "collectedAt": "2026-11-21"},
  {"sourceId": "N35", "group": "transport", "title": "札幌MK：计程车运价、迎车费与冬季差异（预算参考，非各路线报价）", "url": "https://www.mk-group.co.jp/sapporo/taxi/", "collectedAt": "2026-11-21"},
  {"sourceId": "M01", "group": "map-check", "title": "北海道神宫神门：位置核对", "url": "https://www.openstreetmap.org/node/6215959869", "collectedAt": "2026-11-21"},
  {"sourceId": "M02", "group": "map-check", "title": "北海道大学正门：位置核对", "url": "https://www.openstreetmap.org/way/777460221", "collectedAt": "2026-11-21"},
  {"sourceId": "M03", "group": "map-check", "title": "大通公园东段：位置核对", "url": "https://www.openstreetmap.org/node/2287712217", "collectedAt": "2026-11-21"},
  {"sourceId": "M04", "group": "map-check", "title": "白色恋人公园：位置核对", "url": "https://www.openstreetmap.org/node/2422507432", "collectedAt": "2026-11-21"},
  {"sourceId": "M05", "group": "map-check", "title": "札幌电视塔：位置核对", "url": "https://www.openstreetmap.org/way/199758828", "collectedAt": "2026-11-21"},
  {"sourceId": "M06", "group": "map-check", "title": "北海道厅旧本厅舍：位置核对", "url": "https://ja.wikipedia.org/wiki/北海道庁旧本庁舎", "collectedAt": "2026-11-21"},
  {"sourceId": "M07", "group": "map-check", "title": "小樽运河南端浅草桥：位置核对", "url": "https://www.openstreetmap.org/way/38939135", "collectedAt": "2026-11-21"},
  {"sourceId": "M08", "group": "map-check", "title": "小樽音乐盒堂本馆：位置核对", "url": "https://www.openstreetmap.org/node/1256671137", "collectedAt": "2026-11-21"},
  {"sourceId": "M09", "group": "map-check", "title": "北一硝子三号馆：位置核对", "url": "https://www.openstreetmap.org/node/5603040059", "collectedAt": "2026-11-21"},
  {"sourceId": "M10", "group": "map-check", "title": "船见坂路段：位置核对", "url": "https://www.openstreetmap.org/way/151601603", "collectedAt": "2026-11-21"},
  {"sourceId": "M11", "group": "map-check", "title": "小樽水族馆主馆附近：位置核对", "url": "https://ja.wikipedia.org/wiki/おたる水族館", "collectedAt": "2026-11-21"},
  {"sourceId": "M12", "group": "map-check", "title": "祝津全景展望台：位置核对", "url": "https://www.openstreetmap.org/node/5715953221", "collectedAt": "2026-11-21"},
  {"sourceId": "M13", "group": "map-check", "title": "天狗山索道山麓站：位置核对", "url": "https://www.openstreetmap.org/node/6057324224", "collectedAt": "2026-11-21"},
  {"sourceId": "M14", "group": "map-check", "title": "函馆山索道山麓站：位置核对", "url": "https://www.openstreetmap.org/node/326603233", "collectedAt": "2026-11-21"},
  {"sourceId": "M15", "group": "map-check", "title": "八幡坂上段：位置核对", "url": "https://www.openstreetmap.org/node/5329294424", "collectedAt": "2026-11-21"},
  {"sourceId": "M16", "group": "map-check", "title": "金森红砖仓库：位置核对", "url": "https://www.openstreetmap.org/node/2476094422", "collectedAt": "2026-11-21"},
  {"sourceId": "M17", "group": "map-check", "title": "旧函馆区公会堂：位置核对", "url": "https://ja.wikipedia.org/wiki/旧函館区公会堂", "collectedAt": "2026-11-21"},
  {"sourceId": "M18", "group": "map-check", "title": "五棱郭塔：位置核对", "url": "https://ja.wikipedia.org/wiki/五稜郭タワー", "collectedAt": "2026-11-21"},
  {"sourceId": "M19", "group": "map-check", "title": "函馆市热带植物园：位置核对", "url": "https://www.openstreetmap.org/way/241423246", "collectedAt": "2026-11-21"},
  {"sourceId": "M20", "group": "map-check", "title": "藻岩山索道山麓站：位置核对", "url": "https://www.openstreetmap.org/way/166668678", "collectedAt": "2026-11-21"},
  {"sourceId": "M21", "group": "map-check", "title": "札幌伏见稻荷神社：位置核对", "url": "https://www.openstreetmap.org/node/3887704767", "collectedAt": "2026-11-21"},
  {"sourceId": "M22", "group": "map-check", "title": "有珠山索道昭和新山站：位置核对", "url": "https://www.openstreetmap.org/node/3080011771", "collectedAt": "2026-11-21"},
  {"sourceId": "M23", "group": "map-check", "title": "JR塔位置", "url": "https://ja.wikipedia.org/wiki/JRタワー", "collectedAt": "2026-11-21"},
  {"sourceId": "M24", "group": "map-check", "title": "头大佛位置", "url": "https://en.wikipedia.org/wiki/Hill_of_the_Buddha", "collectedAt": "2026-11-21"},
  {"sourceId": "M25", "group": "map-check", "title": "昭和新山山麓位置", "url": "https://www.openstreetmap.org/node/11342840810", "collectedAt": "2026-11-21"},
  {"sourceId": "M26", "group": "map-check", "title": "堺町南段参考：音乐盒堂2号馆附近", "url": "https://www.openstreetmap.org/way/525960324", "collectedAt": "2026-11-21"},
  {"sourceId": "M27", "group": "map-check", "title": "旧手宫线市区段", "url": "https://www.openstreetmap.org/way/257877185", "collectedAt": "2026-11-21"},

  {"sourceId": "N30", "group": "official", "title": "白色恋人公园：交通与接驳", "url": "https://www.shiroikoibitopark.jp/park-guide/access.html", "collectedAt": "2026-11-21"},
  {"sourceId": "N31", "group": "official", "title": "白色恋人公园：营业时间", "url": "https://www.shiroikoibitopark.jp/daily-report/", "collectedAt": "2026-11-21"},
  {"sourceId": "N32", "group": "official", "title": "白色恋人公园：免费寄存柜与常见问题", "url": "https://www.shiroikoibitopark.jp/park-guide/faq.html", "collectedAt": "2026-11-21"},
  {"sourceId": "N33", "group": "transport", "title": "OpenStreetMap：朝里站位置", "url": "https://www.openstreetmap.org/node/8082693157", "collectedAt": "2026-11-21"},
  {"sourceId": "N29", "group": "transport", "title": "VELTRA：2027冬季洞爷湖、登别、冰涛节一日游（含停运提示，余位待确认）", "url": "https://www.veltra.com/jp/japan/hokkaido/sapporo/a/166508", "collectedAt": "2026-11-21"},
  {"sourceId": "N22", "group": "official", "title": "JR北海道：预订、开售时间与取票", "url": "https://www.jrhokkaido.co.jp/global/english/ticket/reservation/index.html", "collectedAt": "2026-11-20"},
  {"sourceId": "N23", "group": "official", "title": "白色恋人：入馆价格与体验预约", "url": "https://www.shiroikoibitopark.jp/facility/counter.html", "collectedAt": "2026-11-20"},
  {"sourceId": "N24", "group": "official", "title": "札幌交通局：平日与周末地铁券", "url": "https://www.city.sapporo.jp/st/josyaken/card.html", "collectedAt": "2026-11-20"},
  {"sourceId": "N25", "group": "official", "title": "函馆市电：一日券与联合票", "url": "https://www.city.hakodate.hokkaido.jp/docs/2014012100977/", "collectedAt": "2026-11-20"},
  {"sourceId": "N26", "group": "official", "title": "JR北海道：主要区间票价", "url": "https://www.jrhokkaido.co.jp/global/english/ticket/regular/index.html", "collectedAt": "2026-11-20"},
  {"sourceId": "N27", "group": "official", "title": "函馆山索道：预售票无折扣、不优先搭乘", "url": "https://334.co.jp/ropeway/advance-ticket/", "collectedAt": "2026-11-20"},
  {"sourceId": "N28", "group": "official", "title": "中央巴士：小樽天狗山套票内容（冬季价格另见天狗山官网）", "url": "https://www.chuo-bus.co.jp/main/setticket/index.cgi?ope=list&r=5", "collectedAt": "2026-11-20"},
  {"sourceId": "N20", "group": "official", "title": "登别温泉观光协会：地狱谷", "url": "https://noboribetsu-spa.jp/spot/spot0034/", "collectedAt": "2026-11-20"},
  {"sourceId": "N21", "group": "official", "title": "有珠山缆车：交通与运行信息", "url": "https://usuzan.hokkaido.jp/", "collectedAt": "2026-11-20"},
  {"sourceId": "N01", "group": "transport", "title": "千岁站酒店：退房后免费寄存", "url": "https://www.chitose-sh.com/faq/", "collectedAt": "2026-11-20"},
  {"sourceId": "N02", "group": "transport", "title": "2027冰涛节 BLUE LINER：班次、票价与行李规则", "url": "https://www.sakkan.com/lp/hyoutou-bus/", "collectedAt": "2026-11-20"},
  {"sourceId": "N03", "group": "transport", "title": "第一泷本馆：入住与寄存", "url": "https://takimotokan.co.jp/ja/faq/", "collectedAt": "2026-11-20"},
  {"sourceId": "N04", "group": "transport", "title": "道南巴士：登别站至登别温泉", "url": "https://www.donanbus.co.jp/map/noboribetsu_ashiyu/", "collectedAt": "2026-11-20"},
  {"sourceId": "N05", "group": "transport", "title": "JR：千岁、南千岁、登别列车时刻", "url": "https://jrhokkaidonorikae.com/vtime/vtime.php?p=y&s=9851", "collectedAt": "2026-11-20"},
  {"sourceId": "N06", "group": "transport", "title": "道南巴士：登别温泉至登别站", "url": "https://www.donanbus.co.jp/map/noboribetsu_ashiyu2/", "collectedAt": "2026-11-20"},
  {"sourceId": "N07", "group": "transport", "title": "道南巴士：洞爷站至洞爷湖温泉", "url": "https://www.donanbus.co.jp/map/toyako_toyakoonsen/", "collectedAt": "2026-11-20"},
  {"sourceId": "N08", "group": "transport", "title": "道南巴士：洞爷湖温泉至洞爷站", "url": "https://www.donanbus.co.jp/map/toyako_toyakoonsen2/", "collectedAt": "2026-11-20"},
  {"sourceId": "N09", "group": "transport", "title": "Silo展望台：冬季营业、出租车与无寄存柜说明", "url": "https://toyako.biz/faq/", "collectedAt": "2026-11-20"},
  {"sourceId": "N10", "group": "transport", "title": "JR北海道：车站寄存柜、数量与价格", "url": "https://www.jrhokkaido.co.jp/network/locker/locker.pdf", "collectedAt": "2026-11-20"},
  {"sourceId": "N11", "group": "transport", "title": "洞爷湖温泉巴士总站寄存柜（第三方，2026年7月资料）", "url": "https://ekinavi-net.jp/ja/kotsu/toyako-onsen/", "collectedAt": "2026-11-20"},
  {"sourceId": "N12", "group": "transport", "title": "道南巴士：洞爷湖温泉经Silo往札幌", "url": "https://www.donanbus.co.jp/map/toyako_sapporo/", "collectedAt": "2026-11-20"},
  {"sourceId": "N13", "group": "transport", "title": "道南巴士：札幌经Silo往洞爷湖温泉", "url": "https://www.donanbus.co.jp/map/sap_toyako/", "collectedAt": "2026-11-20"},
  {"sourceId": "N14", "group": "transport", "title": "JR：北斗、铃兰南行时刻表", "url": "https://jrhokkaidonorikae.com/vtime/vtime.php?p=y&s=151", "collectedAt": "2026-11-20"},
  {"sourceId": "N15", "group": "transport", "title": "JR：东室兰至洞爷、函馆列车时刻", "url": "https://jrhokkaidonorikae.com/vtime/vtime.php?p=y&s=2811", "collectedAt": "2026-11-20"},
  {"sourceId": "N16", "group": "transport", "title": "JR：函馆至札幌北斗时刻表", "url": "https://jrhokkaidonorikae.com/vtime/vtime.php?p=y&s=150", "collectedAt": "2026-11-20"},
  {"sourceId": "N17", "group": "transport", "title": "JR：札幌至小樽列车时刻", "url": "https://jrhokkaidonorikae.com/vtime/vtime.php?p=y&s=2821", "collectedAt": "2026-11-20"},
  {"sourceId": "N18", "group": "transport", "title": "COTARU寄存：费用与17:00取件截止", "url": "https://www.cotaru.co/baggage", "collectedAt": "2026-11-20"},
  {"sourceId": "N19", "group": "transport", "title": "JR：小樽至札幌列车时刻", "url": "https://jrhokkaidonorikae.com/vtime/vtime.php?p=y&s=2820", "collectedAt": "2026-11-20"},
  {
    "sourceId": "H01",
    "group": "hokkaido",
    "title": "北海道自由行攻略（一个人solotrip版）",
    "url": "https://www.xiaohongshu.com/explore/6a902f6f00000000260061b7",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "H02",
    "group": "hokkaido",
    "title": "北海道7天6夜（函进札出版）",
    "url": "https://www.xiaohongshu.com/explore/69ba6ac6000000002003b5ba",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "H03",
    "group": "hokkaido",
    "title": "北海道9天8晚J人的自由行攻略",
    "url": "https://www.xiaohongshu.com/explore/6a5370fb0000000008001b09",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "H04",
    "group": "hokkaido",
    "title": "北海道景点/体验从夯到拉纯主观锐评（非滑雪）",
    "url": "https://www.xiaohongshu.com/explore/6a9eb89a0000000027017cad",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "H05",
    "group": "hokkaido",
    "title": "北海道8天7夜悠闲自由行 含避坑点",
    "url": "https://www.xiaohongshu.com/explore/69a969ef000000001a035647",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "H06",
    "group": "hokkaido",
    "title": "北海道城市旅游体验点评（纯主观）",
    "url": "https://www.xiaohongshu.com/explore/699e8843000000001a01f506",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "H07",
    "group": "hokkaido",
    "title": "一些北海道实用主义攻略",
    "url": "https://www.xiaohongshu.com/explore/6a6b45f60000000005031fb0",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "H08",
    "group": "hokkaido",
    "title": "北海道去了三次 我的避雷清单",
    "url": "https://www.xiaohongshu.com/explore/6ab128a5000000003b010781",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "H09",
    "group": "hokkaido",
    "title": "北海道10天9晚自由行保姆级攻略(总结版)",
    "url": "https://www.xiaohongshu.com/explore/69cfa88b000000001a025424",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "H10",
    "group": "hokkaido",
    "title": "北海道自由行攻略 行前准备篇",
    "url": "https://www.xiaohongshu.com/explore/6aeef7d1000000000500886b",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "H11",
    "group": "hokkaido",
    "title": "北海道6天5晚自由行攻略",
    "url": "https://www.xiaohongshu.com/explore/6a798cad00000000260361b5",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "H12",
    "group": "hokkaido",
    "title": "北海道6日5晚特种兵玩法",
    "url": "https://www.xiaohongshu.com/explore/6abbd70e000000001301afcd",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "H13",
    "group": "hokkaido",
    "title": "北海道记录",
    "url": "https://www.xiaohongshu.com/explore/6a5dffa8000000000f011ecd",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "H14",
    "group": "hokkaido",
    "title": "日本自由行之北海道七天行程分享",
    "url": "https://www.xiaohongshu.com/explore/68a5d5db000000001d02b51e",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "H15",
    "group": "hokkaido",
    "title": "北海道4-6天冬游 札幌进出干货攻略",
    "url": "https://www.xiaohongshu.com/explore/6acde4b400000000120394c4",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "S01",
    "group": "sapporo",
    "title": "最近千万不要来札幌，能劝一个是一个",
    "url": "https://www.xiaohongshu.com/explore/69a95519000000001a023ca0",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "S02",
    "group": "sapporo",
    "title": "没有大心脏千万不要冬天来札幌",
    "url": "https://www.xiaohongshu.com/explore/69968905000000001a02ea16",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "S03",
    "group": "sapporo",
    "title": "到底谁在说札幌好玩",
    "url": "https://www.xiaohongshu.com/explore/69778421000000001a032b32",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "S04",
    "group": "sapporo",
    "title": "札幌4天3晚 十年一遇暴雪版",
    "url": "https://www.xiaohongshu.com/explore/6aab6911000000000c03c1a6",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "S05",
    "group": "sapporo",
    "title": "札幌冰雪节保姆攻略",
    "url": "https://www.xiaohongshu.com/explore/6aebdd510000000015014344",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "S06",
    "group": "sapporo",
    "title": "札幌本地人攻略（上）",
    "url": "https://www.xiaohongshu.com/explore/6a827b220000000010007658",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "S07",
    "group": "sapporo",
    "title": "札幌本地人攻略（中）",
    "url": "https://www.xiaohongshu.com/explore/6a84b38000000000120116e2",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "S08",
    "group": "sapporo",
    "title": "第一次去札幌怎么玩",
    "url": "https://www.xiaohongshu.com/explore/6aea68f80000000019000769",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "S09",
    "group": "sapporo",
    "title": "札幌 雪中的伏见稻荷神社",
    "url": "https://www.xiaohongshu.com/explore/696731b800000000210335cd",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "S10",
    "group": "sapporo",
    "title": "札幌 值得花一个上午来的地方",
    "url": "https://www.xiaohongshu.com/explore/69539bb400000000220382c5",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "S11",
    "group": "sapporo",
    "title": "札幌2日Citywalk路线（懒人版）",
    "url": "https://www.xiaohongshu.com/explore/698ac2fb000000001a027a06",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "S12",
    "group": "sapporo",
    "title": "大雪中的札幌citywalk流水账",
    "url": "https://www.xiaohongshu.com/explore/6aeee348000000001500941d",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "S13",
    "group": "sapporo",
    "title": "北海道札幌一日citywalk超全攻略",
    "url": "https://www.xiaohongshu.com/explore/68fafff70000000004006d72",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "S14",
    "group": "sapporo",
    "title": "札幌比较理想的citywalk路线推荐",
    "url": "https://www.xiaohongshu.com/explore/695a8db2000000002103e4e6",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "S15",
    "group": "sapporo",
    "title": "札幌散步 是我低估了中岛公园",
    "url": "https://www.xiaohongshu.com/explore/699eaf8d000000001503012d",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "T01",
    "group": "otaru",
    "title": "被骗来了小樽 并不是标题党",
    "url": "https://www.xiaohongshu.com/explore/6934002f000000001e000e8a",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "T02",
    "group": "otaru",
    "title": "我想我不会再来小樽",
    "url": "https://www.xiaohongshu.com/explore/695e0008000000000e03e2a2",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "T03",
    "group": "otaru",
    "title": "要来小樽，请记得下面几件事",
    "url": "https://www.xiaohongshu.com/explore/6890d8560000000023024de7",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "T04",
    "group": "otaru",
    "title": "小樽一日游 J人卡点不排队路线安排",
    "url": "https://www.xiaohongshu.com/explore/69538b45000000001e00e51d",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "T05",
    "group": "otaru",
    "title": "情书取景地北海道小樽天狗山",
    "url": "https://www.xiaohongshu.com/explore/6ada38f9000000002a01dab4",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "T06",
    "group": "otaru",
    "title": "不需要滤镜，小樽才是北海道的白月光",
    "url": "https://www.xiaohongshu.com/explore/6acde17900000000140011a4",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "T07",
    "group": "otaru",
    "title": "日本朋友带我逛的小樽一日游，比攻略强多了",
    "url": "https://www.xiaohongshu.com/explore/6a903eea0000000024004eff",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "T08",
    "group": "otaru",
    "title": "日本小樽旅游打卡景点攻略",
    "url": "https://www.xiaohongshu.com/explore/6a8e5a33000000001f004ce3",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "T09",
    "group": "otaru",
    "title": "小樽一日游 搭乘雪国列车看海岸雪景",
    "url": "https://www.xiaohongshu.com/explore/6acf4ca90000000015008e4c",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "T10",
    "group": "otaru",
    "title": "小樽一日游 水族馆+天狗山+运河",
    "url": "https://www.xiaohongshu.com/explore/6aa66740000000002502d3f4",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "T11",
    "group": "otaru",
    "title": "北海道 札幌出发小樽一日游",
    "url": "https://www.xiaohongshu.com/explore/695f344c000000000a02d72a",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "T12",
    "group": "otaru",
    "title": "北海道九天八晚攻略 小樽篇",
    "url": "https://www.xiaohongshu.com/explore/6ad9f946000000002c0271dd",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "T13",
    "group": "otaru",
    "title": "北海道 小樽一日游攻略",
    "url": "https://www.xiaohongshu.com/explore/6aad37b500000000260322ce",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "T14",
    "group": "otaru",
    "title": "不用早起一日玩遍小樽所有景点超详细攻略",
    "url": "https://www.xiaohongshu.com/explore/69496034000000001d03f4d5",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "T15",
    "group": "otaru",
    "title": "北海道小樽一日游 让时间慢下来",
    "url": "https://www.xiaohongshu.com/explore/69748182000000002202018d",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "K01",
    "group": "hakodate",
    "title": "我会劝每一个北海道之旅放弃函馆",
    "url": "https://www.xiaohongshu.com/explore/6946b8d9000000001e00d83f",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "K02",
    "group": "hakodate",
    "title": "开了十级滤镜的函馆又骗来了一个聪明蛋",
    "url": "https://www.xiaohongshu.com/explore/69945f98000000001a035866",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "K03",
    "group": "hakodate",
    "title": "以防你还在纠结要不要去函馆",
    "url": "https://www.xiaohongshu.com/explore/6aaf61070000000027015e2a",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "K04",
    "group": "hakodate",
    "title": "超牛的函馆2日攻略（自存版）",
    "url": "https://www.xiaohongshu.com/explore/696067ec000000001a0235c6",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "K05",
    "group": "hakodate",
    "title": "北海道函馆3天2晚攻略",
    "url": "https://www.xiaohongshu.com/explore/6a87a2d50000000012028bda",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "K06",
    "group": "hakodate",
    "title": "北海道函馆2天随走随拍攻略",
    "url": "https://www.xiaohongshu.com/explore/69861676000000000c0371da",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "K07",
    "group": "hakodate",
    "title": "北海道听劝 带娃真没必要硬冲函馆",
    "url": "https://www.xiaohongshu.com/explore/69648aac000000000b01101a",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "K08",
    "group": "hakodate",
    "title": "函馆两天一晚行程攻略分享 流水账版",
    "url": "https://www.xiaohongshu.com/explore/6aee014b0000000013002256",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "K09",
    "group": "hakodate",
    "title": "北海道函馆2日攻略 北海道最爱",
    "url": "https://www.xiaohongshu.com/explore/6aaa7d41000000000b000022",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "K10",
    "group": "hakodate",
    "title": "函馆3天2晚行程分享",
    "url": "https://www.xiaohongshu.com/explore/6aeb756a0000000016033397",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "K11",
    "group": "hakodate",
    "title": "分享我的北海道路线 函馆篇",
    "url": "https://www.xiaohongshu.com/explore/6a05c0ff00000000380231a8",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "K12",
    "group": "hakodate",
    "title": "第一次去函馆住两晚这样玩",
    "url": "https://www.xiaohongshu.com/explore/6ae21add000000003601382a",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "K13",
    "group": "hakodate",
    "title": "函馆的日与夜 适合J人的city walk路线（1）",
    "url": "https://www.xiaohongshu.com/explore/68f7491e000000000301fc72",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "K14",
    "group": "hakodate",
    "title": "北海道九日游自由行（上）函馆大沼",
    "url": "https://www.xiaohongshu.com/explore/69663751000000000a031465",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "K15",
    "group": "hakodate",
    "title": "日本旅游函馆篇",
    "url": "https://www.xiaohongshu.com/explore/6acdd8a0000000001a0228fe",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "O1",
    "group": "official",
    "title": "札幌雪祭",
    "url": "https://www.snowfes.com/",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "O2",
    "group": "official",
    "title": "小樽观光协会",
    "url": "https://otaru.gr.jp/event/yukiakari2027",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "O3",
    "group": "official",
    "title": "天狗山营业及费用",
    "url": "https://tenguyama.ckk.chuo-bus.co.jp/zh/hours-and-fees",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "O4",
    "group": "official",
    "title": "函馆山索道",
    "url": "https://334.co.jp/ropeway/price/",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "O5",
    "group": "official",
    "title": "函馆市官方观光：登山道路冬季封闭",
    "url": "https://www.hakobura.jp/news/868",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "O6",
    "group": "official",
    "title": "五棱郭塔",
    "url": "https://www.goryokaku-tower.co.jp/en/price/",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "O7",
    "group": "official",
    "title": "JR北海道普通票与主要区间",
    "url": "https://www.jrhokkaido.co.jp/global/english/ticket/regular/index.html",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "O8",
    "group": "official",
    "title": "JR北海道周游券",
    "url": "https://www.jrhokkaido.co.jp/global/english/ticket/railpass/index.html",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "O9",
    "group": "official",
    "title": "JR北海道官方手册",
    "url": "https://www.jrhokkaido.co.jp/global/pdf/e-railpass_pamphlet.pdf",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "O10",
    "group": "official",
    "title": "JR北海道列车运行信息",
    "url": "https://www3.jrhokkaido.co.jp/trainlocation/index.html",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "O11",
    "group": "official",
    "title": "函馆冬花火主办官网",
    "url": "https://www.hakodate-illumination.com/hakodate-fuyuhanabi",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "O12",
    "group": "official",
    "title": "北海道大学博物馆开馆说明",
    "url": "https://www.museum.hokudai.ac.jp/outline/open/",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "O13",
    "group": "official",
    "title": "白色恋人公园营业信息",
    "url": "https://www.shiroikoibitopark.jp/daily-report/",
    "collectedAt": "2026-11-07"
  },
  {
    "sourceId": "O14",
    "group": "official",
    "title": "日本国立天文台：2027年2月札幌日落",
    "url": "https://eco.mtk.nao.ac.jp/koyomi/dni/2027/s0002.html.en",
    "collectedAt": "2026-11-07"
  },
  {"sourceId": "R01", "group": "candidate-research", "title": "函馆旧公会堂", "url": "https://www.xiaohongshu.com/explore/69c76325000000002103a401", "collectedAt": "2026-11-20"},
  {"sourceId": "R02", "group": "candidate-research", "title": "🇯🇵函馆景点测评、干货、避雷（吃的在最后）", "url": "https://www.xiaohongshu.com/explore/6844597e0000000022034ab0", "collectedAt": "2026-11-20"},
  {"sourceId": "O15", "group": "official", "title": "旧函馆区公会堂官网", "url": "https://hakodate-kokaido.jp/", "collectedAt": "2026-11-20"},
  {"sourceId": "R03", "group": "candidate-research", "title": "二刷小樽就是为了这家硝子店！！！", "url": "https://www.xiaohongshu.com/explore/6a8e70e80000000021027b1d", "collectedAt": "2026-11-20"},
  {"sourceId": "R04", "group": "candidate-research", "title": "小樽| 超推荐的diy吹玻璃体验攻略", "url": "https://www.xiaohongshu.com/explore/697da70e000000001a01dac0", "collectedAt": "2026-11-20"},
  {"sourceId": "O16", "group": "official", "title": "大正硝子：制作体验FAQ", "url": "https://www.otaruglass.com/faq", "collectedAt": "2026-11-20"},
  {"sourceId": "R05", "group": "candidate-research", "title": "🌅函馆丨大森海岸-函馆山·不排队的时间安排", "url": "https://www.xiaohongshu.com/explore/697cdf77000000000c035e7e", "collectedAt": "2026-11-20"},
  {"sourceId": "R06", "group": "candidate-research", "title": "北海道函馆两日游，无滤镜下的海边小城", "url": "https://www.xiaohongshu.com/explore/6afad6340000000018039a56", "collectedAt": "2026-11-20"},
  {"sourceId": "R07", "group": "candidate-research", "title": "Solo Trip｜不会日语独自去北海道Day3｜2/21", "url": "https://www.xiaohongshu.com/explore/69a59f9f000000002202dea3", "collectedAt": "2026-11-20"},
  {"sourceId": "R08", "group": "candidate-research", "title": "小樽旅行流水账", "url": "https://www.xiaohongshu.com/explore/6afad629000000002b013f3b", "collectedAt": "2026-11-20"},
  {"sourceId": "O17", "group": "official", "title": "小樽观光协会：2027雪灯之路日期", "url": "https://otaru.gr.jp/event/yukiakari2027", "collectedAt": "2026-11-20"},
  {"sourceId": "O18", "group": "official", "title": "札幌官方观光：雪灯之路", "url": "https://www.sapporo.travel/event/event-list/otaru-snow-light-path/", "collectedAt": "2026-11-20"},
  {"sourceId": "R09", "group": "candidate-research", "title": "函馆汤之川温泉（日归）", "url": "https://www.xiaohongshu.com/explore/679f4e9b000000001701efb6", "collectedAt": "2026-11-20"},
  {"sourceId": "R10", "group": "candidate-research", "title": "汤之川是个很需要现金的地方", "url": "https://www.xiaohongshu.com/explore/67a0bc9f00000000290260e5", "collectedAt": "2026-11-20"},
  {"sourceId": "O19", "group": "official", "title": "湯の浜酒店：温泉与日归", "url": "https://www.yunohama-hotel.com/onsen/", "collectedAt": "2026-11-20"},
  {"sourceId": "R11", "group": "candidate-research", "title": "北海道小樽水族馆 避雷小企鹅🐧", "url": "https://www.xiaohongshu.com/explore/67970bba000000002902bf93", "collectedAt": "2026-11-20"},
  {"sourceId": "R12", "group": "candidate-research", "title": "攻略请收📝小樽一定要看超可爱的企鹅散步🐧", "url": "https://www.xiaohongshu.com/explore/696ca788000000000b00b64a", "collectedAt": "2026-11-20"},
  {"sourceId": "O20", "group": "official", "title": "水族馆：2026–27冬季营业公告", "url": "https://otaru-aq.jp/choineta/news/news-36909", "collectedAt": "2026-11-20"},
  {"sourceId": "R13", "group": "candidate-research", "title": "小樽船见坂，一个迟早废掉的“景点”", "url": "https://www.xiaohongshu.com/explore/678c7239000000001901058c", "collectedAt": "2026-11-20"},
  {"sourceId": "R14", "group": "candidate-research", "title": "小樽 Otaru 《情书》电影拍照机位 - 船見坂", "url": "https://www.xiaohongshu.com/explore/6a4cf09d000000000d00bc00", "collectedAt": "2026-11-20"},
  {"sourceId": "R15", "group": "candidate-research", "title": "白色恋人工厂- 值不值得来？", "url": "https://www.xiaohongshu.com/explore/697ad6ed000000000b00be56", "collectedAt": "2026-11-20"},
  {"sourceId": "R16", "group": "candidate-research", "title": "入园第一位拿下白色恋人冰箱贴（赶时间版）", "url": "https://www.xiaohongshu.com/explore/6958b51a00000000220085bd", "collectedAt": "2026-11-20"},
  {"sourceId": "R17", "group": "candidate-research", "title": "“號稱”札幌冬季第一名的彩燈", "url": "https://www.xiaohongshu.com/explore/63e584c00000000008021313", "collectedAt": "2026-11-20"},
  {"sourceId": "R18", "group": "candidate-research", "title": "札幌宫之森教会｜冬季限定灯海", "url": "https://www.xiaohongshu.com/explore/6ae567d7000000000300a3d8", "collectedAt": "2026-11-20"},
  {"sourceId": "O21", "group": "official", "title": "北海道官方观光：灯饰季", "url": "https://www.visit-hokkaido.jp/event/detail_11138.html", "collectedAt": "2026-11-20"},
  {"sourceId": "O22", "group": "official", "title": "教会：2026年11月见学公告", "url": "https://www.j-mfc.com/news/2580/", "collectedAt": "2026-11-20"},
  {"sourceId": "R19", "group": "candidate-research", "title": "晚上一定要远离狸小路堂吉柯德", "url": "https://www.xiaohongshu.com/explore/67bfe7da0000000006039ee8", "collectedAt": "2026-11-20"},
  {"sourceId": "R20", "group": "candidate-research", "title": "札幌狸小路小逛心得~", "url": "https://www.xiaohongshu.com/explore/6acb0be70000000018011014", "collectedAt": "2026-11-20"},
  {"sourceId": "R21", "group": "candidate-research", "title": "🍣函馆朝市｜2天6家店的真实评价", "url": "https://www.xiaohongshu.com/explore/6764d09a000000000902ed97", "collectedAt": "2026-11-20"},
  {"sourceId": "R22", "group": "candidate-research", "title": "函馆-朝市篇", "url": "https://www.xiaohongshu.com/explore/6a26cedd00000000160255c3", "collectedAt": "2026-11-20"},
  {"sourceId": "R23", "group": "candidate-research", "title": "札幌｜二条市场", "url": "https://www.xiaohongshu.com/explore/6a75bf3e000000002c0065e9", "collectedAt": "2026-11-20"},
  {"sourceId": "R24", "group": "candidate-research", "title": "札幌二条市场海鲜饭避雷🥲 排队≠好吃", "url": "https://www.xiaohongshu.com/explore/6a978ddf00000000110341b4", "collectedAt": "2026-11-20"},
  {"sourceId": "R25", "group": "candidate-research", "title": "北海道札幌时计台", "url": "https://www.xiaohongshu.com/explore/6ada2266000000003103b304", "collectedAt": "2026-11-20"},
  {"sourceId": "R26", "group": "candidate-research", "title": "札幌：時計台", "url": "https://www.xiaohongshu.com/explore/6aaa65c8000000002b01f9e8", "collectedAt": "2026-11-20"},
  {"sourceId": "R27", "group": "candidate-research", "title": "函馆热带植物园避雷⚠️", "url": "https://www.xiaohongshu.com/explore/694a66ff000000001e02ddd4", "collectedAt": "2026-11-20"},
  {"sourceId": "R28", "group": "candidate-research", "title": "函馆热带植物园里看猕猴泡温泉，看什么？", "url": "https://www.xiaohongshu.com/explore/697ad416000000002202117d", "collectedAt": "2026-11-20"},
  {"sourceId": "O23", "group": "official", "title": "植物园FAQ", "url": "https://hako-eco.com/qa", "collectedAt": "2026-11-20"},
  {"sourceId": "R29", "group": "candidate-research", "title": "北海道小樽水族馆+祝津展望台", "url": "https://www.xiaohongshu.com/explore/6ada356f0000000025021da4", "collectedAt": "2026-11-20"},
  {"sourceId": "R30", "group": "candidate-research", "title": "攻略｜祝津展望台交通攻略（含时刻表）", "url": "https://www.xiaohongshu.com/explore/6915b9400000000005031148", "collectedAt": "2026-11-20"},
  {"sourceId": "R31", "group": "candidate-research", "title": "钱函小樽一天怎么玩 (带娃干货避雷贴)", "url": "https://www.xiaohongshu.com/explore/69661a35000000000e00e851", "collectedAt": "2026-11-20"},
  {"sourceId": "R32", "group": "candidate-research", "title": "朝里很美但非必要", "url": "https://www.xiaohongshu.com/explore/694439fa000000001f00ccf4", "collectedAt": "2026-11-20"},
  {"sourceId": "R33", "group": "candidate-research", "title": "北海道之旅最后1️⃣站-札幌伏见稻荷神社", "url": "https://www.xiaohongshu.com/explore/68e75aa70000000007036205", "collectedAt": "2026-11-20"},
  {"sourceId": "O24", "group": "official", "title": "札幌伏见稻荷：摄影规定", "url": "https://fushimiinari.or.jp/photoshoot/", "collectedAt": "2026-11-20"},
  {"sourceId": "R34", "group": "candidate-research", "title": "札幌到头大佛公共交通｜真106/真108对比", "url": "https://www.xiaohongshu.com/explore/6aed5e44000000002a029f88", "collectedAt": "2026-11-20"},
  {"sourceId": "O25", "group": "official", "title": "滝野陵园：头大佛", "url": "https://www.takinoreien.com/pages/107/", "collectedAt": "2026-11-20"},
  {"sourceId": "R35", "group": "candidate-research", "title": "北海道札幌藻岩山夜景避雷", "url": "https://www.xiaohongshu.com/explore/66cd276d000000001f01c6f7", "collectedAt": "2026-11-20"},
  {"sourceId": "R36", "group": "candidate-research", "title": "札幌·藻岩山｜保姆级攻略🌃", "url": "https://www.xiaohongshu.com/explore/6a6b184a0000000022015818", "collectedAt": "2026-11-20"},
  {"sourceId": "R37", "group": "candidate-research", "title": "札幌新千岁机场✈️温泉♨️", "url": "https://www.xiaohongshu.com/explore/6a37378a0000000020039275", "collectedAt": "2026-11-20"},
  {"sourceId": "R38", "group": "candidate-research", "title": "新千岁空港温泉过夜要三思", "url": "https://www.xiaohongshu.com/explore/693c1359000000001e000deb", "collectedAt": "2026-11-20"},
  {"sourceId": "O26", "group": "official", "title": "机场温泉FAQ", "url": "https://www.new-chitose-airport-onsen.com/faq/", "collectedAt": "2026-11-20"},
  {"sourceId": "O27", "group": "official", "title": "机场温泉官网", "url": "https://www.new-chitose-airport-onsen.com/", "collectedAt": "2026-11-20"},
  {"sourceId": "R39", "group": "candidate-research", "title": "札幌T38观景台", "url": "https://www.xiaohongshu.com/explore/694aa4c0000000001d03a2c2", "collectedAt": "2026-11-20"},
  {"sourceId": "R40", "group": "candidate-research", "title": "札幌大通公园电视塔🗼一定要登顶！", "url": "https://www.xiaohongshu.com/explore/679f1a5f000000001801acf3", "collectedAt": "2026-11-20"}
];

export const sourceGroups = [
  { id: "map-check", label: "地图点位核对" },
  { id: "transport", label: "交通、温泉与行李寄存" },
  { id: "candidate-research", label: "景点补充调研" },
  { id: "hokkaido", label: "北海道总体" },
  { id: "sapporo", label: "札幌" },
  { id: "otaru", label: "小樽" },
  { id: "hakodate", label: "函馆" },
  { id: "official", label: "官方核验" },
];
