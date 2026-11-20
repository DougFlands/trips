import type { Trip } from "../types";

export type City = "札幌" | "小樽" | "函馆";
export type RecommendationCity = City | "支笏湖" | "登别" | "洞爷湖";
type StayCity = City | "千岁" | "登别温泉";
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
  { date: "01-30", weekday: "周六", city: "千岁", title: "抵达新千岁，住千岁站旁", stay: "千岁", pace: "抵达日",
    slots: [{ time: "16:30", text: "抵达新千岁，入境、取行李" }, { time: "18:00–19:00", text: "预计搭JR到千岁站，酒店入住" }, { time: "19:00–20:30", text: "晚饭、买早餐，早点休息" }],
    luggage: "直接带到酒店。千岁站酒店提供退房后免费寄存，可供次日使用。", note: "选JR千岁站附近，方便次日接驳车；入境晚就顺延入住。", sources: ["N01"] },
  { date: "01-31", weekday: "周日", city: "支笏湖 · 登别", title: "冰涛节、地狱谷与温泉", stay: "登别温泉", pace: "08:00起床",
    slots: [{ time: "08:00–09:00", text: "早餐、退房寄存；09:10到千岁站东口7号站台" }, { time: "09:20–10:05", text: "BLUE LINER接驳车到支笏湖" }, { time: "10:10–12:10", text: "冰涛节蓝冰、湖边拍照、简餐；12:20回乘车点" }, { time: "12:30–13:15", text: "接驳车返回千岁，取行李后进站" }, { time: "14:14–15:03", text: "铃兰6号直达登别；15:30巴士到温泉街，酒店放箱子" }, { time: "16:00–16:45", text: "地狱谷主要观景区，看火山蒸汽与雪景" }, { time: "17:00–20:30", text: "温泉、酒店晚餐、休息" }],
    luggage: "大箱留千岁酒店，午后取回带到登别。第一泷本馆有免费寄存柜；接驳车不代存游览期间的行李。",
    note: "接驳车须前日20:30前预约，不可改班、取消不退款。周日门票¥3,000，往返车¥4,000/人；只看白天，保留温泉晚餐。地狱谷走开放主路。", sources: ["N01", "N02", "N03", "N04"],
    trains: [{ route: "千岁 → 登别", earlier: "13:40→14:41｜南千岁换乘北斗14号", recommended: "14:14→15:03｜铃兰6号，直达", later: "14:45→15:50｜普通列车，直达", note: "提前班：13:43到南千岁，13:58换北斗；取箱子偏赶。延后班需顺延温泉巴士、缩短地狱谷。", sources: ["N05"] }] },
  { date: "02-01", weekday: "周一", city: "登别 · 洞爷湖 · 函馆", title: "洞爷湖、Silo展望台，赴函馆", stay: "函馆", pace: "07:00起床",
    slots: [{ time: "07:00–07:30", text: "简餐、退房；早班需07:10离店赶07:25温泉总站巴士，或预约出租车接站" }, { time: "08:03–08:43", text: "北斗4号：登别到洞爷站" }, { time: "08:55／09:55", text: "巴士到洞爷湖温泉，分别09:11／10:13到；早班衔接紧，寄存耽搁就改后班" }, { time: "10:15–12:30", text: "湖畔散步、温泉街、午餐" }, { time: "12:50–14:10", text: "Silo展望台往返预留时段；俯瞰湖面与中岛，观景30–40分钟" }, { time: "14:10–15:20", text: "湖边咖啡、休息；行李若在湖畔，先取回" }, { time: "15:45–16:03", text: "巴士返回洞爷站，取行李、候车" }, { time: "16:38–18:30", text: "北斗16号到函馆；入住、晚饭" }],
    luggage: "优先洞爷站柜：中¥500、大¥700–800。满柜或赶08:55巴士，可带到湖畔总站柜；空位不保证。Silo无柜，回程留时间取件。",
    note: "Silo冬季08:30–17:00，免费。巴士候选12:50→13:01、13:56→14:10，预约制短途订位仍待确认；未落实就预约出租车往返，约¥8,000起另询等候费。当天不加有珠山缆车。", sources: ["N06", "N07", "N08", "N09", "N10", "N11", "N12", "N13"],
    trains: [
      { route: "登别 → 洞爷", earlier: "06:48→08:11｜普通列车，东室兰换乘", recommended: "08:03→08:43｜北斗4号", later: "09:54→10:39｜北斗6号", note: "06:48仅供参考，不适合07:00起床。08:03须接07:25温泉巴士或预订出租车；改09:54则接11:00湖畔巴士。", sources: ["N05", "N06", "N14", "N15"] },
      { route: "洞爷 → 函馆", earlier: "15:21→17:13｜北斗14号", recommended: "16:38→18:30｜北斗16号", later: "17:38→19:29｜北斗18号", note: "想提前走，预约出租车14:45前到洞爷站。14:55湖畔巴士15:09到站，取箱子后赶15:21偏紧。", sources: ["N08", "N14"] },
    ] },
  { date: "02-02", weekday: "周二", city: "函馆", title: "五棱郭、元町与函馆山", stay: "函馆", pace: "09:00起床",
    slots: [{ time: "10:00–12:00", text: "五棱郭塔＋公园，登塔看雪中星形城郭" }, { time: "12:00–13:30", text: "午饭、接驳到元町" }, { time: "13:30–15:00", text: "八幡坂、元町教堂街，看坡道与港口" }, { time: "15:30–18:30", text: "函馆山日落与夜景，含索道排队、上下山" }, { time: "19:00–20:30", text: "晚饭、回酒店" }],
    luggage: "连住，箱子留酒店。", note: "函馆唯一完整游玩日，仓库不列必去。索道停运就取消上山，改湾区；冬季不能打车上山，次日早班不补夜景。", sources: ["O4", "O5", "O6"] },
  { date: "02-03", weekday: "周三", city: "函馆 · 札幌", title: "早班赴札幌，大学看雪", stay: "札幌", pace: "07:00起床",
    slots: [{ time: "07:30", text: "退房、早餐；朝市只选出餐快的店，取齐行李进站" }, { time: "08:56–12:41", text: "北斗5号直达札幌" }, { time: "13:00–14:30", text: "酒店寄存、午饭" }, { time: "14:30–16:00", text: "北海道大学雪景与老建筑" }, { time: "16:00后", text: "旧道厅外观、站前散步，随后晚饭", optional: true }],
    luggage: "箱子随车，到札幌先放入住酒店；入住前寄存需确认。", note: "07:30是离店时间，预留进站余量。晚到就缩短散步；大通雪祭明天开幕。", sources: ["O1", "H01"],
    trains: [{ route: "函馆 → 札幌", earlier: "07:37→11:29｜北斗3号", recommended: "08:56→12:41｜北斗5号", later: "10:05→14:01｜北斗7号", note: "提前班需站前酒店约07:05–07:10离店，早餐带上车。07:30离店就选08:56。", sources: ["N16"] }] },
  { date: "02-04", weekday: "周四", city: "札幌", title: "神宫雪林，大通雪祭开幕", stay: "札幌", pace: "09:00起床",
    slots: [{ time: "10:00–12:00", text: "北海道神宫＋圆山公园，雪林慢走" }, { time: "12:00–14:00", text: "午饭、接驳" }, { time: "14:00–16:00", text: "大通雪祭，挑重点雪雕" }, { time: "16:00–18:00", text: "咖啡取暖，再看傍晚亮灯" }, { time: "18:00–20:00", text: "晚饭；有余力再看薄野冰雕" }],
    luggage: "连住，箱子留酒店。", note: "开幕日人多，室外与室内交替；不必走完整个会场。薄野可省，晚饭照常。", sources: ["O1"] },
  { date: "02-05", weekday: "周五", city: "札幌 · 小樽", title: "早到小樽，堺町与运河", stay: "小樽", pace: "07:00起床",
    slots: [{ time: "07:30", text: "退房，前往札幌站" }, { time: "08:06–08:53", text: "普通列车直达小樽" }, { time: "09:00–11:00", text: "酒店寄存、早餐、运河白天散步" }, { time: "11:00–15:30", text: "堺町、音乐盒堂、北一硝子；穿插午餐、咖啡" }, { time: "15:30–17:30", text: "入住休息，再看运河暮色" }, { time: "18:00–20:00", text: "晚饭、回酒店" }],
    luggage: "札幌前后订同一家，先确认能否跨一晚存大箱；允许就只带换洗小包。否则带去小樽酒店寄存。", note: "雪灯明天才开幕。早到先逛室外，店铺按开门时间进入；今天更晴可与明天天狗山互换。", sources: ["O2"],
    trains: [{ route: "札幌 → 小樽", earlier: "07:59→08:47｜普通列车", recommended: "08:06→08:53｜普通列车", later: "08:17→09:08｜普通列车", note: "三班均直达小樽，无需指定席预约；留时间退房、寄存和走到站台。", sources: ["N17"] }] },
  { date: "02-06", weekday: "周六", city: "小樽 · 札幌", title: "天狗山、雪灯，晚回札幌", stay: "札幌", pace: "09:00起床",
    slots: [{ time: "09:00–10:30", text: "早餐、退房寄存" }, { time: "10:30–14:30", text: "天狗山山海雪景，含巴士、索道、午餐" }, { time: "14:30–17:00", text: "回市区咖啡休息，提前吃晚饭" }, { time: "17:30–19:00", text: "预留雪灯之路游览，点灯时段待官方公告" }, { time: "19:00–19:40", text: "取行李、步行进站" }, { time: "19:56–20:41", text: "普通列车回札幌，目标22:00前入住" }],
    luggage: "退房寄存需确认能在19点后取件；不支持就用小樽站柜¥400–800，空位以现场为准。COTARU须17点前取，不适合存到雪灯结束。",
    note: "天狗山雾大就取消，冬季索道末班上山19:48、下山20:00。雪灯开幕夜人多，别压缩取箱子和进站时间。", sources: ["O2", "O3", "N10", "N18"],
    trains: [{ route: "小樽 → 札幌", earlier: "19:34→20:19｜普通列车", recommended: "19:56→20:41｜普通列车", later: "20:22→21:11｜普通列车", note: "看灯时间按当年公告调整；延后班正常运行时仍可争取22点前入住。", sources: ["N19"] }] },
  { date: "02-07", weekday: "周日", city: "札幌", title: "白色恋人或购物，留点余量", stay: "札幌", pace: "09:00起床",
    slots: [{ time: "10:00–14:00", text: "白色恋人公园＋午餐，或市区购物；二选一", optional: true }, { time: "14:00–17:00", text: "咖啡、伴手礼；也可补看雪祭", optional: true }, { time: "18:00–20:00", text: "晚饭、整理行李，确认返程交通" }],
    luggage: "连住札幌，箱子留酒店。", note: "返程前一天留在札幌。白色恋人付费区16:30停止入场，手作另留时间；累了直接休息。", sources: ["O1", "O13"] },
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
    { id: "ice-festival", name: "支笏湖冰涛节", priority: "优先", duration: "约2小时含简餐", reason: "湖水冻成蓝冰，1/31只看白天；12:30返程，下午接登别。门票与接驳车另购，提前预约。", schedule: "1/31 已安排", day: "01-31", sources: ["N02"] },
  ],
  登别: [
    { id: "hell-valley", name: "登别地狱谷＋温泉过夜", priority: "优先", duration: "地狱谷45分钟 · 温泉留整晚", reason: "酒店放箱子再看火山蒸汽，走开放主路；傍晚回酒店泡汤、吃晚餐，别赶末段入住。", schedule: "1/31 已安排", day: "01-31", sources: ["N03", "N04", "N20"] },
  ],
  洞爷湖: [
    { id: "lake-toya", name: "洞爷湖畔＋温泉街", priority: "优先", duration: "约2小时含午餐", reason: "湖畔看雪山、中岛，温泉街吃午饭；大箱优先寄洞爷站，满柜再用湖畔总站。当天不住洞爷湖。", schedule: "2/1 已安排", day: "02-01", sources: ["N07", "N08", "N10", "N11"] },
    { id: "silo", name: "Silo展望台", priority: "优先", duration: "观景30–40分钟 · 往返另计", reason: "从高处俯瞰洞爷湖，冬季08:30–17:00，免费、无行李柜。巴士短途订位待确认，未落实就预约出租车往返。", condition: "交通待落实", schedule: "2/1 已安排 · 交通待定", day: "02-01", sources: ["N09", "N12", "N13"] },
    { id: "usu", name: "有珠山缆车", priority: "可省", duration: "至少半天含往返", reason: "需另接驳到昭和新山，天气影响观景与运行；本次不叠加。想去就替换Silo、重排接驳，并保留取行李和赴函馆的时间。", schedule: "2/1 替换项", day: "02-01", sources: ["N21"] },
  ],
  札幌: [
    { id: "odori", name: "大通公园雪祭", priority: "优先", duration: "2小时", reason: "正逢会期，挑重点雪雕，不必走完整条街。", schedule: "2/4 已安排", day: "02-04", sources: ["S05", "O1"] },
    { id: "shrine", name: "北海道神宫＋圆山公园", priority: "优先", duration: "1.5–2小时", reason: "神社与雪林在同一片区，白天慢走。", schedule: "2/4 已安排", day: "02-04", sources: ["S04"] },
    { id: "university", name: "北海道大学", priority: "优先", duration: "1.5–2小时", reason: "雪景与老建筑，靠近札幌站；博物馆另查开放。", schedule: "2/3 已安排", day: "02-03", sources: ["H01", "S11", "S12"] },
    { id: "susukino", name: "薄野冰雕＋街景", priority: "可选", duration: "30–60分钟", reason: "大通之后顺路看，累了直接去吃饭。", schedule: "2/4 可选", day: "02-04", sources: ["S05", "S14"] },
    { id: "nakajima", name: "中岛公园", priority: "可选", duration: "1–1.5小时", reason: "地铁方便，轻松看雪；与大学、圆山体验部分重复。", schedule: "2/7 替换项", day: "02-07", sources: ["S14", "S15"] },
    { id: "red-office", name: "旧道厅红砖厅舍", priority: "可选", duration: "外观30分钟", reason: "站前顺路看建筑；入馆另留1小时以上并查开放。", schedule: "2/3 可选", day: "02-03", sources: ["S08", "S13"] },
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
    { id: "canal", name: "小樽运河＋雪灯之路", priority: "优先", duration: "夜间1–1.5小时", reason: "住一晚；2/5普通夜景，2/6看雪灯后回札幌。", schedule: "2/5–6 已安排", day: "02-06", sources: ["T06", "T15", "O2"] },
    { id: "tengu", name: "天狗山", priority: "优先", duration: "3–4小时含接驳排队", reason: "山海全景，白天去即可；雾大降为可省。", condition: "晴天优先", schedule: "2/6 已安排 · 看天气", day: "02-06", sources: ["T04", "T05", "T12", "O3"] },
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
    { id: "hakodate-mountain", name: "函馆山", priority: "优先", duration: "3–4小时含接驳排队", reason: "夜景优先；仅2/2有完整窗口，冬季不能打车上山。", condition: "晴天优先", schedule: "2/2 已安排 · 看天气", day: "02-02", sources: ["K06", "K12", "K13", "O4", "O5"] },
    { id: "goryokaku", name: "五棱郭塔＋公园", priority: "优先", duration: "2–2.5小时", reason: "登塔看星形城郭；9:00–18:00，17:50最后入场。", schedule: "2/2 已安排", day: "02-02", sources: ["K04", "K11", "O6"] },
    { id: "motomachi", name: "八幡坂＋元町教堂街", priority: "优先", duration: "1.5–2小时", reason: "坡道、港口与教堂，路滑时缩短范围。", schedule: "2/2 已安排", day: "02-02", sources: ["K09", "K11"] },
    { id: "kanemori", name: "金森红砖仓库＋湾区", priority: "可选", duration: "1.5–2小时", reason: "海边散步与室内小店；函馆时间紧，仅作索道停运时替换。", schedule: "2/2 替换项", day: "02-02", sources: ["K06", "K08", "K10"] },
    { id: "morning-market", name: "函馆朝市", priority: "可选", duration: "45–90分钟含用餐", reason: "车站旁吃海鲜饭、逛市场、钓鱿鱼；店间价差大，鱿鱼看渔获、晚到可能售罄。", schedule: "2/3 早餐可选", day: "02-03", sources: ["R21", "R22"] },
    { id: "old-hall", name: "元町公园＋旧公会堂周边", priority: "可选", duration: "元町行程再加30–60分钟", reason: "元町顺路看蓝黄洋楼、港口，馆内看建筑与历史；内容偏少、坡路易滑，入馆另留时间。", schedule: "顺路选", sources: ["H05", "K09", "R01", "R02", "O15"] },
    { id: "omori", name: "大森海岸", priority: "可选", duration: "30–45分钟 · 接驳另计", reason: "市区海边看雪海、散步拍照；雪量与天色决定效果，海风强，晴天短停。", schedule: "晴天顺路选", sources: ["K06", "K14", "R05", "R06"] },
    { id: "yunokawa", name: "汤之川温泉", priority: "可选", duration: "半天", reason: "已有登别温泉过夜，函馆仅一个完整游玩日；日归泡汤需换出半天，先确认酒店接待时段。", schedule: "体验替换项", sources: ["K05", "R09", "R10", "O19"] },
    { id: "botanical", name: "函馆热带植物园", priority: "可省", duration: "园内45–60分钟 · 往返2–3小时", reason: "主要看猴子泡汤；园区小、温室内容少，猴子不一定入水，去汤之川时再顺带。", schedule: "兴趣替换项", sources: ["K04", "K05", "K11", "R27", "R28", "O23"] },
  ],
};

export const recommendationCities: RecommendationCity[] = ["支笏湖", "登别", "洞爷湖", "函馆", "札幌", "小樽"];
export const cityNames: City[] = ["札幌", "小樽", "函馆"];
const stayCities: StayCity[] = ["千岁", "登别温泉", "函馆", "札幌", "小樽"];
export const nights = stayCities.map((city) => ({ city, count: dayPlans.filter((day) => day.stay === city).length }));

export const hokkaidoWinterTrip: Trip = {
  slug: "hokkaido-winter", code: "HOKKAIDO", routeBadge: "登别 · 洞爷湖 · 函馆 · 札幌 · 小樽", kicker: "WINTER 2027",
  title: "北海道冬季慢游", subtitle: "", dateRange: "1.29—2.08", fullDateRange: "2027.01.29—02.08",
  intro: "冰涛节、登别温泉、洞爷湖与两场雪节。转场日7点起，游玩日8:30–9点起；11天9晚。",
  days: dayPlans.map((day) => ({ label: day.date.replace("-", "/"), date: `2027-${day.date}`, city: day.city, title: day.title, summary: day.pace, schedule: day.slots.map((slot) => `${slot.time} ${slot.text}`), stay: day.stay ?? "按机票", color: "#b94f4a" })),
  stops: [], alternatives: [], meals: [], bookings: [], links: [],
};
