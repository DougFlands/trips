import type { Trip } from "../types";

export type City = "札幌" | "小樽" | "函馆";
export type DayPlan = {
  date: string;
  weekday: string;
  city: City;
  title: string;
  stay: City | null;
  pace: string;
  slots: Array<{ time: string; text: string; optional?: boolean }>;
  note?: string;
};

export const dayPlans: DayPlan[] = [
  { date: "01-29", weekday: "周五", city: "札幌", title: "长沙出发，经香港中转", stay: null, pace: "交通日",
    slots: [{ time: "按机票", text: "长沙出发，经香港中转" }, { time: "抵达后", text: "入住、吃饭、休息，不约景点" }], note: "若当晚已到札幌，另加一晚住宿。" },
  { date: "01-30", weekday: "周六", city: "札幌", title: "抵达札幌，休息", stay: "札幌", pace: "休息日",
    slots: [{ time: "抵达后", text: "寄存或入住，留时间休息" }, { time: "11:00起", text: "若前一天已到：中岛公园／北海道大学二选一", optional: true }, { time: "18:00", text: "酒店附近晚饭，约19:30回房" }], note: "当天才抵达就休息，不追行程。" },
  { date: "01-31", weekday: "周日", city: "函馆", title: "坐火车去函馆", stay: "函馆", pace: "建议9点起",
    slots: [{ time: "10–11点", text: "目标出发时段：北斗号约4小时，午饭在车上" }, { time: "14–16点", text: "抵达、接驳、入住休息" }, { time: "16:00", text: "酒店周边散步，最多1小时", optional: true }, { time: "18:00", text: "晚饭，约19:30回酒店" }], note: "列车时间按实际班次；晚到就删散步，当天不上山。" },
  { date: "02-01", weekday: "周一", city: "函馆", title: "元町坡道，函馆山夜景", stay: "函馆", pace: "11点出门",
    slots: [{ time: "11:30–13:00", text: "八幡坂、元町教堂街" }, { time: "13:00–15:00", text: "午饭、休息，前往索道山麓" }, { time: "15:00–18:30", text: "函馆山：含排队、上下山、夜景" }, { time: "18:30", text: "晚饭，约20:00回酒店" }], note: "天气差就改2/2下午上山，并删掉仓库；不追加景点。" },
  { date: "02-02", weekday: "周二", city: "函馆", title: "五棱郭与红砖湾区", stay: "函馆", pace: "11点出门",
    slots: [{ time: "11:30–13:30", text: "五棱郭塔＋公园" }, { time: "13:30–15:30", text: "午饭、休息与接驳" }, { time: "15:30–17:00", text: "金森红砖仓库、湾区慢逛" }, { time: "18:00", text: "晚饭，19:30–20:00回酒店" }], note: "若补函馆山，用山顶替换湾区；不去汤之川加塞。" },
  { date: "02-03", weekday: "周三", city: "札幌", title: "回札幌，下午休息", stay: "札幌", pace: "建议9点起",
    slots: [{ time: "10–11点", text: "目标出发时段：北斗号约4小时，午饭在车上" }, { time: "14–16点", text: "抵达札幌，入住休息" }, { time: "16:00后", text: "站前轻逛，顺路看旧道厅外观", optional: true }, { time: "18:00", text: "晚饭，约19:30回酒店" }], note: "交通占半天，晚到就直接休息。" },
  { date: "02-04", weekday: "周四", city: "札幌", title: "神宫雪林，大通雪祭", stay: "札幌", pace: "11点出门",
    slots: [{ time: "11:30–13:00", text: "北海道神宫＋圆山公园一小段" }, { time: "13:00–15:30", text: "午饭、休息与接驳" }, { time: "15:30–17:30", text: "大通雪祭，挑重点雪雕" }, { time: "18:00–19:00", text: "晚饭后回酒店" }], note: "薄野冰雕仅在顺路、不累时加30分钟；晚饭相应后移。" },
  { date: "02-05", weekday: "周五", city: "小樽", title: "堺町小店，运河暮色", stay: "小樽", pace: "11点出门",
    slots: [{ time: "11:00–14:00", text: "退房赴小樽，寄存、午饭" }, { time: "14:00–16:30", text: "堺町、音乐盒堂、北一硝子，中途休息" }, { time: "16:30–17:15", text: "运河普通夜景" }, { time: "18:00", text: "晚饭，约19:30回酒店" }], note: "雪灯之路明天才开幕。若今天更晴，可与明天天狗山互换。" },
  { date: "02-06", weekday: "周六", city: "小樽", title: "天狗山，雪灯之路", stay: "小樽", pace: "11点出门",
    slots: [{ time: "11:00", text: "早点吃午饭，再去天狗山" }, { time: "12:00–15:30", text: "天狗山，含巴士、索道与排队" }, { time: "15:30后", text: "回酒店休息，等点灯" }, { time: "17:30–19:00", text: "雪灯之路，正式点灯时段待公告" }, { time: "19:00", text: "晚饭，约20:30回酒店" }], note: "雾大取消登山；开幕日人多，排队超时先减项目。" },
  { date: "02-07", weekday: "周日", city: "札幌", title: "回札幌，留出缓冲", stay: "札幌", pace: "11点出门",
    slots: [{ time: "11:00–14:00", text: "回札幌，寄存、午饭或入住" }, { time: "14:00–15:30", text: "北海道大学看雪，或直接休息", optional: true }, { time: "18:00", text: "晚饭，约19:30回酒店" }], note: "不补天狗山或水族馆。留在札幌，准备返程。" },
  { date: "02-08", weekday: "周一", city: "札幌", title: "返程，不排景点", stay: null, pace: "交通日",
    slots: [{ time: "按机票", text: "预留机场交通、值机与雪天余量" }, { time: "出发前", text: "查列车运行信息，按实际航班离店" }], note: "起床与出门时间以航班为准。" },
];

export type Recommendation = {
  id: string;
  name: string;
  priority: "优先" | "可选" | "可省";
  duration: string;
  reason: string;
  condition?: string;
  schedule: string;
  day?: string;
  sources: string[];
};

export const recommendations: Record<City, Recommendation[]> = {
  札幌: [
    { id: "odori", name: "大通公园雪祭", priority: "优先", duration: "2小时", reason: "正逢会期，挑重点雪雕，不必走完整条街。", schedule: "2/4 已安排", day: "02-04", sources: ["S05", "O1"] },
    { id: "shrine", name: "北海道神宫＋圆山公园", priority: "优先", duration: "1.5–2小时", reason: "神社与雪林在同一片区，白天慢走。", schedule: "2/4 已安排", day: "02-04", sources: ["S04"] },
    { id: "university", name: "北海道大学", priority: "优先", duration: "1.5–2小时", reason: "雪景与老建筑，靠近札幌站；博物馆另查开放。", schedule: "2/7 可选", day: "02-07", sources: ["H01", "S11", "S12"] },
    { id: "susukino", name: "薄野冰雕＋街景", priority: "可选", duration: "30–60分钟", reason: "大通之后顺路看，累了直接去吃饭。", schedule: "2/4 可选", day: "02-04", sources: ["S05", "S14"] },
    { id: "nakajima", name: "中岛公园", priority: "可选", duration: "1–1.5小时", reason: "地铁方便，轻松看雪；与大学、圆山体验部分重复。", schedule: "1/30 可选", day: "01-30", sources: ["S14", "S15"] },
    { id: "red-office", name: "旧道厅红砖厅舍", priority: "可选", duration: "外观30分钟", reason: "站前顺路看建筑；入馆另留1小时以上并查开放。", schedule: "2/3 可选", day: "02-03", sources: ["S08", "S13"] },
    { id: "shiroi", name: "白色恋人公园", priority: "可选", duration: "园内2小时 · 往返3–4小时", reason: "喜欢童话建筑再换出半天；付费区16:30停止入场。", schedule: "半天替换项", sources: ["S11", "S13", "O13"] },
    { id: "tanukikoji", name: "狸小路", priority: "可选", duration: "45–90分钟", reason: "购物补给、晚饭前顺路，不单占白天。", schedule: "顺路选", sources: ["S08", "S14"] },
    { id: "moiwa", name: "藻岩山", priority: "可省", duration: "约3小时含接驳排队", reason: "已有函馆山与天狗山；想再看夜景才替换。", schedule: "夜景替换项", sources: ["S07"] },
    { id: "tower", name: "札幌电视塔／T38", priority: "可省", duration: "45–60分钟 · 接驳另计", reason: "付费登高二选一；电视塔外观顺路看。", schedule: "登高替换项", sources: ["S08", "S12"] },
    { id: "clock", name: "时计台", priority: "可省", duration: "外观15–20分钟", reason: "体量小，路过看一眼，不专程赶车。", schedule: "顺路选", sources: ["S08", "S13"] },
    { id: "remote", name: "伏见稻荷神社／头大佛", priority: "可省", duration: "前者2–3小时 · 后者半天", reason: "均含交通；接驳与雪地步行成本高，按兴趣替换。", schedule: "兴趣替换项", sources: ["S09", "S10"] },
  ],
  小樽: [
    { id: "canal", name: "小樽运河＋雪灯之路", priority: "优先", duration: "夜间1–1.5小时", reason: "住两晚，不赶夜车；2/5普通夜景，2/6看雪灯。", schedule: "2/5–6 已安排", day: "02-06", sources: ["T06", "T15", "O2"] },
    { id: "tengu", name: "天狗山", priority: "优先", duration: "3–4小时含接驳排队", reason: "山海全景，白天去即可；雾大降为可省。", condition: "晴天优先", schedule: "2/6 看天气", day: "02-06", sources: ["T04", "T05", "T12", "O3"] },
    { id: "sakaimachi", name: "堺町通", priority: "优先", duration: "整片2–3小时", reason: "慢逛、室内取暖；已含音乐盒堂和北一硝子时间。", schedule: "2/5 已安排", day: "02-05", sources: ["T07", "T15"] },
    { id: "music-box", name: "小樽音乐盒堂本馆", priority: "优先", duration: "45–60分钟 · 堺町内", reason: "老建筑与音乐盒，不购物也能逛。", schedule: "2/5 已安排", day: "02-05", sources: ["T06", "T07"] },
    { id: "glass", name: "北一硝子", priority: "可选", duration: "30–60分钟 · 堺町内", reason: "玻璃工艺与老店，不必把每家店都逛完。", schedule: "2/5 已安排", day: "02-05", sources: ["T06", "T15"] },
    { id: "funami", name: "船见坂", priority: "可选", duration: "20–30分钟", reason: "坡道尽头看海；路滑就省，不站车道拍照。", schedule: "顺路选", sources: ["T02", "T13"] },
    { id: "temiya", name: "旧手宫线遗址", priority: "可选", duration: "20–30分钟", reason: "路过散步；积雪会盖住轨道，活动会场另看公告。", schedule: "顺路选", sources: ["T06", "T08"] },
    { id: "aquarium", name: "小樽水族馆", priority: "可省", duration: "含接驳至少半天", reason: "喜欢企鹅可升为可选；先核表演和巴士，不叠加天狗山。", schedule: "半天替换项", sources: ["T03", "T10", "T11"] },
    { id: "shukutsu", name: "祝津展望台", priority: "可省", duration: "水族馆同线再加约1小时", reason: "海风、坡道和候车费时，恶劣天气取消。", schedule: "兴趣替换项", sources: ["T03", "T11"] },
    { id: "asari", name: "钱函／朝里", priority: "可省", duration: "额外1–2小时含候车", reason: "二选一；本次已有海港，不拖行李中途下车。", schedule: "兴趣替换项", sources: ["T03", "T09", "T11"] },
  ],
  函馆: [
    { id: "hakodate-mountain", name: "函馆山", priority: "优先", duration: "3–4小时含接驳排队", reason: "三城夜景首选；留两晚天气窗口，冬季不能打车上山。", condition: "晴天优先", schedule: "2/1 看天气", day: "02-01", sources: ["K06", "K12", "K13", "O4", "O5"] },
    { id: "goryokaku", name: "五棱郭塔＋公园", priority: "优先", duration: "2–2.5小时", reason: "登塔看星形城郭；9:00–18:00，17:50最后入场。", schedule: "2/2 已安排", day: "02-02", sources: ["K04", "K11", "O6"] },
    { id: "motomachi", name: "八幡坂＋元町教堂街", priority: "优先", duration: "1.5–2小时", reason: "坡道、港口与教堂，路滑时缩短范围。", schedule: "2/1 已安排", day: "02-01", sources: ["K09", "K11"] },
    { id: "kanemori", name: "金森红砖仓库＋湾区", priority: "可选", duration: "1.5–2小时", reason: "海边散步与室内小店；若补函馆山，就删这里。", schedule: "2/2 已安排", day: "02-02", sources: ["K06", "K08", "K10"] },
    { id: "old-hall", name: "元町公园＋旧公会堂周边", priority: "可选", duration: "元町行程再加30–60分钟", reason: "同片区延伸，体力够再走；入馆另查开放。", schedule: "顺路选", sources: ["H05", "K09"] },
    { id: "omori", name: "大森海岸", priority: "可选", duration: "30–45分钟 · 接驳另计", reason: "晴天看雪与海，风大就跳过。", schedule: "晴天顺路选", sources: ["K06", "K14"] },
    { id: "yunokawa", name: "汤之川温泉", priority: "可选", duration: "半天", reason: "想泡温泉就换出半天，先核日归接待；不塞进转场日。", schedule: "体验替换项", sources: ["K05"] },
    { id: "botanical", name: "函馆热带植物园", priority: "可省", duration: "园内45–60分钟 · 往返2–3小时", reason: "主要看猴子泡温泉；感兴趣可升为可选，先核展示时间。", schedule: "兴趣替换项", sources: ["K04", "K05", "K11"] },
  ],
};

export const cityNames: City[] = ["札幌", "小樽", "函馆"];
export const nights = cityNames.map((city) => ({ city, count: dayPlans.filter((day) => day.stay === city).length }));

export const hokkaidoWinterTrip: Trip = {
  slug: "hokkaido-winter", code: "HOKKAIDO", routeBadge: "札幌 · 小樽 · 函馆", kicker: "WINTER 2027",
  title: "北海道冬季慢游", subtitle: "", dateRange: "1.29—2.08", fullDateRange: "2027.01.29—02.08",
  intro: "札幌雪祭、小樽雪灯、函馆夜景。10点起，晚饭后回酒店；11天行程与三城景点排序。",
  days: dayPlans.map((day) => ({ label: day.date.replace("-", "/"), date: `2027-${day.date}`, city: day.city, title: day.title, summary: day.pace, schedule: day.slots.map((slot) => `${slot.time} ${slot.text}`), stay: day.stay ?? "按机票", color: "#b94f4a" })),
  stops: [], alternatives: [], meals: [], bookings: [], links: [],
};
