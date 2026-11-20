import type { Trip } from "../types";

export type City = "札幌" | "小樽" | "函馆";
export type RecommendationCity = City | "支笏湖" | "登别" | "洞爷湖";
type StayCity = City;
export type DayPlan = {
  date: string;
  weekday: string;
  city: string;
  title: string;
  stay: StayCity | null;
  pace: string;
  slots: Array<{ time: string; text: string; optional?: boolean }>;
  luggage: string;
  note: string;
  sources?: string[];
  trains?: Array<{ route: string; earlier: string; recommended: string; later: string; note: string; sources: string[] }>;
};

export const dayPlans: DayPlan[] = [
  { date: "01-29", weekday: "周五", city: "长沙 · 香港", title: "长沙出发，经香港中转", stay: null, pace: "交通日",
    slots: [{ time: "按机票", text: "长沙出发，经香港中转；吃饭、休息" }],
    luggage: "按机票确认是否直挂新千岁；需提取时留足中转时间。", note: "北海道落地为次日16:30，中转住宿按机票安排。" },
  { date: "01-30", weekday: "周六", city: "新千岁 · 函馆", title: "落地后直赴函馆", stay: "函馆", pace: "抵达日 · 晚入住",
    slots: [{ time: "16:30", text: "抵达新千岁，入境、取行李" }, { time: "18:00–18:40", text: "预留取票、买晚饭及机场站步行时间；JR一站到南千岁，争取18:40前后到站候车" }, { time: "19:18–22:31", text: "北斗22号：南千岁直达函馆，晚饭带上车" }, { time: "约23:00", text: "函馆站附近酒店入住、休息" }],
    luggage: "全程随身带到函馆酒店；南千岁换乘时带齐行李。", note: "北斗22号为现行末班直达特急，先订指定席；酒店确认23点左右可入住。航班延误或铁路停运赶不上，就改住千岁。", sources: ["N14", "N22", "O10"],
    trains: [{ route: "南千岁 → 函馆", earlier: "17:26→20:39｜北斗20号，落地后不建议赶", recommended: "19:18→22:31｜北斗22号", later: "当晚无后续直达北斗", note: "17:26距落地仅56分钟，不作为正常接驳。新千岁机场先坐JR一站到南千岁；误末班需调整当晚住宿。", sources: ["N14"] }] },
  { date: "01-31", weekday: "周日", city: "函馆", title: "五棱郭、元町与函馆山", stay: "函馆", pace: "09:00起床",
    slots: [{ time: "10:00–12:00", text: "五棱郭塔＋公园，登塔看雪中星形城郭" }, { time: "12:00–13:30", text: "午饭、接驳到元町" }, { time: "13:30–15:00", text: "八幡坂、元町教堂街，看坡道与港口" }, { time: "15:30–18:30", text: "函馆山日落与夜景，含索道排队、上下山" }, { time: "19:00–20:30", text: "晚饭、回酒店" }],
    luggage: "连住，箱子留函馆酒店。", note: "首晚到得晚，上午不赶早。索道停运就改湾区，2/1再看天气补函馆山；冬季不能打车上山。", sources: ["O4", "O5", "O6"] },
  { date: "02-01", weekday: "周一", city: "函馆", title: "朝市、金森仓库，夜景留备选", stay: "函馆", pace: "09:00起床",
    slots: [{ time: "09:30–11:00", text: "函馆朝市，海鲜早餐、逛市场" }, { time: "11:00–14:00", text: "金森红砖仓库、湾区散步，穿插午餐" }, { time: "14:00–15:00", text: "咖啡、休息或补逛元町", optional: true }, { time: "15:30–18:30", text: "昨天没上函馆山，今天择晴补夜景；已看过可自由活动，或用下午换汤之川日归温泉", optional: true }, { time: "19:00–20:30", text: "晚饭、回酒店，准备次日早班" }],
    luggage: "连住，箱子留函馆酒店。", note: "函馆山两天择晴一次。日归温泉先确认接待时段；这版不再住登别，想泡汤可在函馆补。", sources: ["K06", "K08", "R21", "R22", "O4", "O5", "O19"] },
  { date: "02-02", weekday: "周二", city: "函馆 · 札幌", title: "早班赴札幌，大学与旧道厅", stay: "札幌", pace: "07:00起床",
    slots: [{ time: "07:30", text: "退房、早餐，带齐行李前往函馆站" }, { time: "08:56–12:41", text: "北斗5号直达札幌" }, { time: "13:00–14:30", text: "酒店寄存、午饭" }, { time: "14:30–16:00", text: "北海道大学，雪景与老建筑" }, { time: "16:00–17:00", text: "旧道厅外观、站前散步或咖啡取暖" }, { time: "18:00–20:00", text: "晚饭、狸小路，按体力逛" }],
    luggage: "箱子随车，到札幌先交入住酒店寄存；入住前寄存需确认。", note: "JR约4小时，实际从下午开始玩。大通雪祭2/4才开幕；晚到就缩短大学和旧道厅，不赶满场。", sources: ["N16", "O1", "H01", "S08"],
    trains: [{ route: "函馆 → 札幌", earlier: "07:37→11:29｜北斗3号", recommended: "08:56→12:41｜北斗5号", later: "10:05→14:01｜北斗7号", note: "提前班需站前酒店约07:05离店，早餐带上车。07:30离店就选08:56；延后班压缩下午游览。", sources: ["N16"] }] },
  { date: "02-03", weekday: "周三", city: "洞爷湖 · 登别 · 支笏湖", title: "跟团看洞爷湖、地狱谷与冰涛节", stay: "札幌", pace: "07:00起床",
    slots: [{ time: "08:30／08:40", text: "札幌电视塔1楼旅游咨询处前集合，08:40发车" }, { time: "10:55–11:25", text: "Silo展望台，俯瞰洞爷湖与中岛" }, { time: "11:40起", text: "洞爷湖湖畔温泉街约70分钟，含自理午餐；随后昭和新山约40分钟" }, { time: "14:35–15:10", text: "登别地狱谷，走开放主路看火山蒸汽" }, { time: "16:10–17:10", text: "支笏湖冰涛节约1小时，看蓝冰与傍晚灯光，现场亮灯安排为准" }, { time: "约18:20", text: "回札幌电视塔；晚饭、休息" }],
    luggage: "札幌连住，大箱留酒店；只带保暖用品、随身包。", note: "候选团¥7,600起＋平日冰涛节门票¥1,000，餐费另计，2/3余位待确认。按湖畔A线，不含泡汤；产品注明有珠山索道1/12–3/13停运。雪天可调整停留与回程。", sources: ["N29", "N20"] },
  { date: "02-04", weekday: "周四", city: "札幌", title: "神宫雪林、大通雪祭开幕", stay: "札幌", pace: "08:30起床",
    slots: [{ time: "09:30–11:30", text: "北海道神宫＋圆山公园，雪林慢走" }, { time: "11:30–13:30", text: "午餐、接驳到大通" }, { time: "13:30–16:30", text: "大通雪祭，挑重点雪雕；穿插咖啡取暖" }, { time: "16:30–18:00", text: "雪雕亮灯后再走一段，按现场点灯安排" }, { time: "18:00–20:00", text: "晚饭；有余力顺路看薄野冰雕" }],
    luggage: "札幌连住，箱子留酒店。", note: "雪祭开幕日人多，不必走完整个会场。2/7仍可补看；明早去小樽，提前整理两晚换洗包。", sources: ["O1", "S04", "S05"] },
  { date: "02-05", weekday: "周五", city: "札幌 · 小樽", title: "上午赴小樽，堺町与运河", stay: "小樽", pace: "08:00–08:30起床",
    slots: [{ time: "08:30–09:10", text: "早餐、退房，前往札幌站；酒店远就提前出门" }, { time: "09:33–10:07", text: "快速Airport 31号到小樽" }, { time: "10:15–11:00", text: "入住酒店先寄存行李，步行到堺町" }, { time: "11:00–15:30", text: "堺町、音乐盒堂、北一硝子，穿插午餐与甜品" }, { time: "15:30–17:30", text: "酒店入住、休息；傍晚小樽运河散步" }, { time: "18:00–20:00", text: "晚餐、普通运河夜景；累了回酒店" }],
    luggage: "札幌2/2–4与2/7尽量订同一家，先确认能否跨两晚存大箱；允许就只带换洗小包，否则随身带到小樽酒店寄存。",
    note: "小樽住5、6日两晚。5日没有正式雪灯，商店街和天狗山分两天；5日天气好也可与6日白天对调。", sources: ["N17", "T07", "O2", "O3"],
    trains: [{ route: "札幌 → 小樽", earlier: "09:25→10:15｜普通列车", recommended: "09:33→10:07｜快速Airport 31号", later: "10:00→10:41｜快速Airport 35号", note: "均直达小樽，推荐班比提前普通车更早到。普通自由席无需预约；u-seat指定席另付费。按现行时刻，出发前复核。", sources: ["N17"] }] },
  { date: "02-06", weekday: "周六", city: "小樽", title: "天狗山与雪灯之路开幕", stay: "小樽", pace: "08:30起床",
    slots: [{ time: "09:30–11:30", text: "三角市场早餐、补逛市区；室内咖啡取暖" }, { time: "11:30–15:30", text: "午餐、巴士与索道往返天狗山，预留约3小时含接驳" }, { time: "15:30–17:30", text: "回市区休息、提前吃晚饭" }, { time: "17:30–19:30", text: "运河、雪灯之路；暂留晚间时段，具体点灯时间待官方公告" }, { time: "20:00前后", text: "回小樽酒店，休息" }],
    luggage: "连住小樽，箱子或换洗包留酒店；看完雪灯直接回酒店。", note: "天狗山遇雾、停运或排队久就省，雪灯开幕留足时间。冬季索道现公布上行至19:48、下行至20:00，本计划白天上山。", sources: ["T06", "T15", "O2", "O3"] },
  { date: "02-07", weekday: "周日", city: "小樽 · 札幌", title: "早回札幌，白色恋人或购物", stay: "札幌", pace: "07:00起床",
    slots: [{ time: "07:30", text: "退房、带齐行李前往小樽站" }, { time: "08:05–08:50", text: "快速Niseko Liner直达札幌" }, { time: "09:00–10:00", text: "酒店寄存、早餐；若此前留有大箱，一并确认" }, { time: "10:00–14:00", text: "白色恋人公园＋午餐，或市区购物；二选一", optional: true }, { time: "14:00–17:00", text: "咖啡、伴手礼；也可补看雪祭", optional: true }, { time: "18:00–20:00", text: "晚饭、整理行李，确认返程交通" }],
    luggage: "小樽退房后随身带回札幌，先交入住酒店寄存；入住前寄存需确认。", note: "早上回札幌，后续留作机动。白色恋人付费区16:30停止入场；雪天晚到就改市区购物，不再安排远处景点。", sources: ["O1", "O13", "N19"],
    trains: [{ route: "小樽 → 札幌", earlier: "07:57→08:46｜普通列车", recommended: "08:05→08:50｜快速Niseko Liner", later: "08:18→09:07｜普通列车", note: "三班均直达札幌，无需指定席预约。按07:30离店规划，酒店远就提前；雪天先查运行情况。", sources: ["N19"] }] },
  { date: "02-08", weekday: "周一", city: "札幌 · 新千岁", title: "前往机场，返程", stay: null, pace: "按航班起床",
    slots: [{ time: "按机票", text: "退房，带行李乘JR前往新千岁机场" }, { time: "起飞前3小时", text: "国际航班按提前3小时到机场规划，雪天交通另留余量" }],
    luggage: "直接带去机场；晚班机若留市区，先确认酒店退房后寄存与取件时间。", note: "航班时间未定，机场列车暂不锁班。出门前查运行信息，不排远处景点。", sources: ["O10"] },
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

export const recommendations: Record<RecommendationCity, Recommendation[]> = {
  支笏湖: [
    { id: "ice-festival", name: "支笏湖冰涛节", priority: "优先", duration: "跟团约60分钟", reason: "2/3一日游末站，预计16:10–17:10停留，看蓝冰与傍晚灯光；平日门票¥1,000另付。", schedule: "2/3 跟团候选", day: "02-03", sources: ["N29"] },
  ],
  登别: [
    { id: "hell-valley", name: "登别地狱谷", priority: "优先", duration: "跟团约35分钟", reason: "2/3一日游停留，走开放主路看蒸汽与雪景；不在登别住宿，不含泡汤。", schedule: "2/3 跟团候选", day: "02-03", sources: ["N29", "N20"] },
  ],
  洞爷湖: [
    { id: "lake-toya", name: "洞爷湖畔＋温泉街", priority: "优先", duration: "跟团约70分钟含午餐", reason: "选一日游湖畔A线，散步、自由午餐；行李留札幌酒店，当天返回札幌。", schedule: "2/3 跟团候选", day: "02-03", sources: ["N29"] },
    { id: "silo", name: "Silo展望台", priority: "优先", duration: "跟团约30分钟", reason: "预计10:55到达，俯瞰洞爷湖与中岛；接驳含在一日游中，无需另约出租车。", schedule: "2/3 跟团候选", day: "02-03", sources: ["N29", "N09"] },
    { id: "usu", name: "有珠山缆车", priority: "可省", duration: "本次不安排", reason: "冬季团产品注明2027/1/12–3/13索道停运，覆盖本次出行；改走洞爷湖湖畔与昭和新山，不上山。", condition: "出行期间停运", schedule: "不安排", sources: ["N29", "N21"] },
  ],
  札幌: [
    { id: "odori", name: "大通公园雪祭", priority: "优先", duration: "2小时", reason: "正逢会期，挑重点雪雕，不必走完整条街。", schedule: "2/4 已安排", day: "02-04", sources: ["S05", "O1"] },
    { id: "shrine", name: "北海道神宫＋圆山公园", priority: "优先", duration: "1.5–2小时", reason: "神社与雪林在同一片区，白天慢走。", schedule: "2/4 已安排", day: "02-04", sources: ["S04"] },
    { id: "university", name: "北海道大学", priority: "优先", duration: "1.5–2小时", reason: "雪景与老建筑，靠近札幌站；博物馆另查开放。", schedule: "2/2 已安排", day: "02-02", sources: ["H01", "S11", "S12"] },
    { id: "susukino", name: "薄野冰雕＋街景", priority: "可选", duration: "30–60分钟", reason: "大通之后顺路看，累了直接去吃饭。", schedule: "2/4 可选", day: "02-04", sources: ["S05", "S14"] },
    { id: "nakajima", name: "中岛公园", priority: "可选", duration: "1–1.5小时", reason: "地铁方便，轻松看雪；与大学、圆山体验部分重复。", schedule: "2/7 替换项", day: "02-07", sources: ["S14", "S15"] },
    { id: "red-office", name: "旧道厅红砖厅舍", priority: "可选", duration: "外观30分钟", reason: "站前顺路看建筑；入馆另留1小时以上并查开放。", schedule: "2/2 可选", day: "02-02", sources: ["S08", "S13"] },
    { id: "shiroi", name: "白色恋人公园", priority: "可选", duration: "园内2小时 · 往返3–4小时", reason: "欧式庭园、灯饰、甜品与手作，偏亲子；定制需排号、可能售罄，付费区16:30停入。", schedule: "2/7 可选", day: "02-07", sources: ["S11", "S13", "O13", "R15", "R16"] },
    { id: "tanukikoji", name: "狸小路", priority: "可选", duration: "45–90分钟", reason: "有顶棚的药妆、伴手礼与餐饮街，晚饭前后逛；店铺重复度高，热门店结账排队。", schedule: "顺路选", sources: ["S08", "S14", "R19", "R20"] },
    { id: "frances", name: "宫之森Frances教会", priority: "可选", duration: "庭园20–40分钟 · 往返另计", reason: "看雪夜灯饰、月亮装置；庭园小，内部未必开放，婚礼可能停接待，先查当月日历。", schedule: "2/7 晚间备选", sources: ["R17", "R18", "O21", "O22"] },
    { id: "nijo", name: "二条市场", priority: "可选", duration: "45–90分钟含用餐", reason: "市中心吃海鲜饭、逛小市场；价格未必低，热门店排队或拼桌，按店挑、别只看队伍。", schedule: "午餐顺路选", sources: ["R23", "R24"] },
    { id: "airport-onsen", name: "新千岁机场温泉", priority: "可选", duration: "1.5–2小时 · 值机安检另留", reason: "国内线4楼泡汤、洗澡休息；可能满员，不可中途外出再入，候机充裕再去。", schedule: "2/8 按航班选", sources: ["R37", "R38", "O26", "O27"] },
    { id: "moiwa", name: "藻岩山", priority: "可省", duration: "约3小时含接驳排队", reason: "两段缆车看札幌全景；换乘排队久、风雪易遮景，已有两座山，仅作夜景备选。", schedule: "夜景替换项", sources: ["S07", "R35", "R36"] },
    { id: "tower", name: "札幌电视塔／T38", priority: "可省", duration: "45–60分钟 · 接驳另计", reason: "电视塔俯瞰雪祭，展望层小；T38连通札幌站，室内坐看夜景，玻璃反光、雪雾遮景。登高二选一。", schedule: "登高替换项", sources: ["S08", "S12", "R39", "R40"] },
    { id: "clock", name: "时计台", priority: "可省", duration: "外观15–20分钟", reason: "老木建筑与机械钟，顺路看外观；体量小、四周高楼，非历史爱好者不必专程入馆。", schedule: "顺路选", sources: ["S08", "S13", "R25", "R26"] },
    { id: "remote", name: "伏见稻荷神社／头大佛", priority: "可省", duration: "前者2–3小时 · 后者半天", reason: "伏见看雪中红鸟居，坡滑、拍摄受限；头大佛看安藤建筑与石像，位于陵园、交通远，冬季15点关闭。", schedule: "兴趣替换项", sources: ["S09", "S10", "R33", "O24", "R34", "O25"] },
  ],
  小樽: [
    { id: "canal", name: "小樽运河＋雪灯之路", priority: "优先", duration: "夜间1–1.5小时", reason: "住两晚；2/5晚普通夜景可选，2/6看雪灯，2/7早回札幌。", schedule: "2/6 已安排", day: "02-06", sources: ["T06", "T15", "O2"] },
    { id: "tengu", name: "天狗山", priority: "优先", duration: "3–4小时含接驳排队", reason: "下午看山海全景；雾大或排队久就省，优先保留堺町与晚间雪灯。", condition: "晴天优先", schedule: "2/6 已安排 · 看天气", day: "02-06", sources: ["T04", "T05", "T12", "O3"] },
    { id: "sakaimachi", name: "堺町通", priority: "优先", duration: "整片2–3小时", reason: "逛音乐盒、北一与大正硝子，室内取暖；玻璃易碎、价格不低，大正手作另约，部分成品不能当天取。", schedule: "2/5 已安排", day: "02-05", sources: ["T07", "T15", "R03", "R04", "O16"] },
    { id: "music-box", name: "小樽音乐盒堂本馆", priority: "优先", duration: "45–60分钟 · 堺町内", reason: "老建筑与音乐盒，不购物也能逛。", schedule: "2/5 已安排", day: "02-05", sources: ["T06", "T07"] },
    { id: "glass", name: "北一硝子", priority: "可选", duration: "30–60分钟 · 堺町内", reason: "玻璃工艺与老店，不必把每家店都逛完。", schedule: "2/5 已安排", day: "02-05", sources: ["T06", "T15"] },
    { id: "funami", name: "船见坂", priority: "可选", duration: "20–30分钟", reason: "坡道尽头看海，拍《情书》街景；结冰、车流和拍照人群多，不站车道，路滑就省。", schedule: "顺路选", sources: ["T02", "T13", "R13", "R14"] },
    { id: "temiya", name: "旧手宫线遗址", priority: "可选", duration: "20–30分钟", reason: "市区老铁路散步；大雪会埋住轨道，白天可能只见雪路，雪灯布置看当年会场图。", schedule: "顺路选", sources: ["T06", "T08", "R07", "R08", "O17", "O18"] },
    { id: "aquarium", name: "小樽水族馆", priority: "可省", duration: "含接驳至少半天", reason: "看企鹅雪中散步、海豚表演；馆较老，冬季海兽公园关闭，表演定时、巴士拥挤，替换天狗山。", schedule: "半天替换项", sources: ["T03", "T10", "T11", "R11", "R12", "O20"] },
    { id: "shukutsu", name: "祝津展望台", priority: "可省", duration: "水族馆同线再加约1小时", reason: "俯瞰海崖、灯塔与海湾，可接水族馆；上坡结冰、部分路段人车共用，风大取消。", schedule: "兴趣替换项", sources: ["T03", "T11", "R29", "R30"] },
    { id: "asari", name: "钱函／朝里", priority: "可省", duration: "额外1–2小时含候车", reason: "钱函看雪海、坐咖啡馆，朝里拍海边小站；看点少、风大，候车可能比拍照久，二选一、不拖箱下车。", schedule: "兴趣替换项", sources: ["T03", "T09", "T11", "R31", "R32"] },
  ],
  函馆: [
    { id: "hakodate-mountain", name: "函馆山", priority: "优先", duration: "3–4小时含接驳排队", reason: "1/31优先，2/1可补；两天择晴一次，冬季不能打车上山。", condition: "晴天优先", schedule: "1/31 已安排 · 看天气", day: "01-31", sources: ["K06", "K12", "K13", "O4", "O5"] },
    { id: "goryokaku", name: "五棱郭塔＋公园", priority: "优先", duration: "2–2.5小时", reason: "登塔看星形城郭；9:00–18:00，17:50最后入场。", schedule: "1/31 已安排", day: "01-31", sources: ["K04", "K11", "O6"] },
    { id: "motomachi", name: "八幡坂＋元町教堂街", priority: "优先", duration: "1.5–2小时", reason: "坡道、港口与教堂，路滑时缩短范围。", schedule: "1/31 已安排", day: "01-31", sources: ["K09", "K11"] },
    { id: "kanemori", name: "金森红砖仓库＋湾区", priority: "可选", duration: "1.5–2小时", reason: "2/1海边散步与室内小店，穿插午餐；可与1/31函馆山按天气对调。", schedule: "2/1 已安排", day: "02-01", sources: ["K06", "K08", "K10"] },
    { id: "morning-market", name: "函馆朝市", priority: "可选", duration: "45–90分钟含用餐", reason: "车站旁吃海鲜饭、逛市场、钓鱿鱼；店间价差大，鱿鱼看渔获、晚到可能售罄。", schedule: "2/1 已安排", day: "02-01", sources: ["R21", "R22"] },
    { id: "old-hall", name: "元町公园＋旧公会堂周边", priority: "可选", duration: "元町行程再加30–60分钟", reason: "元町顺路看蓝黄洋楼、港口，馆内看建筑与历史；内容偏少、坡路易滑，入馆另留时间。", schedule: "顺路选", sources: ["H05", "K09", "R01", "R02", "O15"] },
    { id: "omori", name: "大森海岸", priority: "可选", duration: "30–45分钟 · 接驳另计", reason: "市区海边看雪海、散步拍照；雪量与天色决定效果，海风强，晴天短停。", schedule: "晴天顺路选", sources: ["K06", "K14", "R05", "R06"] },
    { id: "yunokawa", name: "汤之川温泉", priority: "可选", duration: "半天", reason: "本次不住登别；想泡汤，可替换2/1半天湾区活动，先确认酒店接待时段。", schedule: "体验替换项", sources: ["K05", "R09", "R10", "O19"] },
    { id: "botanical", name: "函馆热带植物园", priority: "可省", duration: "园内45–60分钟 · 往返2–3小时", reason: "主要看猴子泡汤；园区小、温室内容少，猴子不一定入水，去汤之川时再顺带。", schedule: "兴趣替换项", sources: ["K04", "K05", "K11", "R27", "R28", "O23"] },
  ],
};

export const recommendationCities: RecommendationCity[] = ["支笏湖", "登别", "洞爷湖", "函馆", "札幌", "小樽"];
export const cityNames: City[] = ["札幌", "小樽", "函馆"];
const stayCities: StayCity[] = ["函馆", "札幌", "小樽"];
export const nights = stayCities.map((city) => ({ city, count: dayPlans.filter((day) => day.stay === city).length }));

export const hokkaidoWinterTrip: Trip = {
  slug: "hokkaido-winter", code: "HOKKAIDO", routeBadge: "函馆 · 札幌 · 小樽 · 登别洞爷湖一日游", kicker: "WINTER 2027",
  title: "北海道冬季慢游", subtitle: "", dateRange: "1.29—2.08", fullDateRange: "2027.01.29—02.08",
  intro: "落地直赴函馆，札幌出发一日游看洞爷湖、登别与冰涛节；小樽住两晚看雪灯，11天9晚。",
  days: dayPlans.map((day) => ({ label: day.date.replace("-", "/"), date: `2027-${day.date}`, city: day.city, title: day.title, summary: day.pace, schedule: day.slots.map((slot) => `${slot.time} ${slot.text}`), stay: day.stay ?? "按机票", color: "#b94f4a" })),
  stops: [], alternatives: [], meals: [], bookings: [], links: [],
};
