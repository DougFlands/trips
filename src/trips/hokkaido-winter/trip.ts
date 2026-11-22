import type { Trip } from "../types";

export type City = "札幌" | "小樽" | "函馆";
export type RecommendationCity = City | "支笏湖" | "登别" | "洞爷湖";
type StayCity = City | "千岁";
export const stayAreas: Record<StayCity, string> = { 千岁: "千岁站附近", 函馆: "函馆站附近", 札幌: "西线9条旭山公园通附近", 小樽: "小樽站附近" };
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
  { date: "01-30", weekday: "周六", city: "新千岁 · 千岁", title: "抵达新千岁，住千岁站附近", stay: "千岁", pace: "抵达日",
    slots: [{ time: "16:30", text: "抵达新千岁，入境、取行李" }, { time: "18:00–19:00", text: "JR到千岁站，附近酒店入住；晚到就顺延" }, { time: "19:00–20:30", text: "晚餐、买早餐，确认次日北斗车票，早点休息" }],
    luggage: "直接带到千岁酒店，次日退房带去函馆。", note: "选JR千岁站附近，方便次日07:45–08:00出门。若住机场内酒店，次晨需改乘机场→南千岁接驳。", sources: ["N01", "N05", "O10"] },
  { date: "01-31", weekday: "周日", city: "千岁 · 函馆", title: "早班赴函馆，下午游五棱郭", stay: "函馆", pace: "07:00起床",
    slots: [{ time: "07:45–08:00", text: "千岁站附近酒店退房出门，早餐、取票" }, { time: "08:40–08:43", text: "Airport32号（3832M）：千岁→南千岁，两站都停" }, { time: "09:12–12:33", text: "北斗6号：南千岁→函馆；换乘预留29分钟" }, { time: "12:45–13:45", text: "函馆站附近酒店寄存、午餐" }, { time: "13:45–14:30", text: "函馆站前乘市电至五棱郭公园前，再步行到塔楼；不要坐到JR五棱郭站" }, { time: "14:30–17:00", text: "五棱郭塔＋公园，登塔看雪中星形城郭" }, { time: "17:00–19:30", text: "市电回函馆站前，晚饭、酒店入住" }],
    luggage: "箱子随车，到函馆站附近酒店寄存；入住前寄存需确认。", note: "北斗6号停南千岁，不停千岁、机场站。08:19北斗84号为未确认运行的临时车，不作备选。默认今天玩东北侧五棱郭；若今天晴、明天风雪，改元町＋函馆山，五棱郭移至明天下午，缩短或取消金森与公会堂。", sources: ["N05", "N14", "N22", "O6", "N25", "O4", "O5"],
    trains: [{ route: "南千岁 → 函馆", earlier: "07:23→10:38｜北斗4号，需更早离店", recommended: "09:12→12:33｜北斗6号", later: "10:16→13:35｜北斗8号", note: "三班均停南千岁、终到函馆。按07:45–08:00出门选09:12；先接千岁08:40→南千岁08:43的Airport32号。", sources: ["N05", "N14"] }] },
  { date: "02-01", weekday: "周一", city: "函馆", title: "朝市、湾区、元町与函馆山", stay: "函馆", pace: "08:30起床",
    slots: [{ time: "09:00–10:00", text: "站前酒店步行到函馆朝市，海鲜早餐" }, { time: "10:00–12:00", text: "沿湾区往金森红砖仓库，逛店、取暖；雪路难走就市电至十字街再步行" }, { time: "12:00–13:00", text: "湾区午餐，不回站前" }, { time: "13:00–13:45", text: "元町公园、旧公会堂外观；入馆另留时间，累了省略", optional: true }, { time: "13:45–15:30", text: "八幡坂上段 → 元町教堂街 → 函馆山索道山麓站，沿坡上街区走，不反复上下坡" }, { time: "15:30–18:30", text: "函馆山日落与夜景，含索道排队、上下山" }, { time: "18:30–20:00", text: "下山后晚饭，经十字街乘市电回函馆站前酒店" }],
    luggage: "连住函馆站附近，箱子留酒店。", note: "西部湾区与元町集中一天，默认今晚看函馆山；若与1/31按天气对调，今天改五棱郭，删减湾区可选点，不叠加两套行程。冬季不能打车上山；双日停运则取消夜景。", sources: ["K06", "K08", "K09", "R21", "R22", "O15", "O4", "O5", "N25"] },
  { date: "02-02", weekday: "周二", city: "函馆 · 札幌", title: "早班赴札幌，大学与旧道厅", stay: "札幌", pace: "07:00起床",
    slots: [{ time: "07:30", text: "站前酒店退房、早餐，带齐行李前往函馆站" }, { time: "08:56–12:41", text: "北斗5号直达札幌" }, { time: "13:00–14:00", text: "札幌站寄存行李、午餐，记好寄存位置及取件时间" }, { time: "14:00–15:30", text: "北海道大学南部校园，正门进、南门出；不走到校园北端" }, { time: "15:30–16:15", text: "向南到旧道厅看外观，随后回札幌站取行李" }, { time: "16:15–17:30", text: "地下步行街到西4丁目，乘往西15丁目方向市电至西线9条，酒店入住；市电¥230/人" }, { time: "18:00–20:00", text: "酒店附近晚饭、休息；狸小路留2/4" }],
    luggage: "先用札幌站寄存柜或寄存服务，空位不保证；满员就先去西线9条酒店放箱，并缩短下午景点。", note: "站前取件有短距离回走，避免酒店与北大来回。札幌站↔西线9条打车预算每车单程¥2,000–3,200，可能超¥3,000，默认公共交通；叫车全额预估≤¥3,000时再选车。晚到删旧道厅。", sources: ["N16", "N10", "H01", "S08", "N34", "N35"],
    trains: [{ route: "函馆 → 札幌", earlier: "07:37→11:29｜北斗3号", recommended: "08:56→12:41｜北斗5号", later: "10:05→14:01｜北斗7号", note: "提前班需站前酒店约07:05离店，早餐带上车。07:30离店就选08:56；延后班压缩下午游览。", sources: ["N16"] }] },
  { date: "02-03", weekday: "周三", city: "洞爷湖 · 登别 · 支笏湖", title: "跟团看洞爷湖、地狱谷与冰涛节", stay: "札幌", pace: "07:00起床",
    slots: [{ time: "07:20–08:20", text: "西线9条酒店出发，市电经西15丁目至西4丁目，再步行至电视塔；市电¥230/人。打车备选每车单程¥1,800–2,800，超¥3,000选市电，另留雪天余量" }, { time: "08:30／08:40", text: "札幌电视塔1楼旅游咨询处前集合，08:40发车" }, { time: "10:55–11:25", text: "Silo展望台，俯瞰洞爷湖与中岛" }, { time: "11:40起", text: "洞爷湖湖畔温泉街约70分钟，含自理午餐；随后昭和新山约40分钟" }, { time: "14:35–15:10", text: "登别地狱谷，走开放主路看火山蒸汽" }, { time: "16:10–17:10", text: "支笏湖冰涛节约1小时，看蓝冰与傍晚灯光，现场亮灯安排为准" }, { time: "约18:20", text: "回札幌电视塔，晚饭后步行至西4丁目，市电回西线9条酒店；打车预算同早上" }],
    luggage: "札幌连住，大箱留酒店；只带保暖用品、随身包。", note: "候选团¥7,600起＋平日冰涛节门票¥1,000，餐费另计，2/3余位待确认。按湖畔A线，不含泡汤；产品注明有珠山索道1/12–3/13停运。雪天可调整停留与回程。", sources: ["N29", "N20", "N34", "N35"] },
  { date: "02-04", weekday: "周四", city: "札幌", title: "神宫雪林、大通雪祭开幕", stay: "札幌", pace: "08:30起床",
    slots: [{ time: "08:45–09:30", text: "西线9条乘市电到西15丁目，步行换西18丁目地铁至圆山公园；分开付费合计¥440/人，符合换乘条件可优惠。打车备选每车¥1,800–2,800，超¥3,000走公共交通" }, { time: "09:30–11:30", text: "圆山公园 → 北海道神宫，雪林慢走" }, { time: "11:30–13:30", text: "圆山附近午餐，地铁到西11丁目，从雪祭西侧开始" }, { time: "13:30–16:30", text: "大通雪祭由西向东逛，挑重点雪雕，穿插咖啡取暖" }, { time: "16:30–18:00", text: "亮灯后继续向电视塔一侧走，避免横穿会场再折返；按现场安排选停留区" }, { time: "18:00–20:00", text: "狸小路、晚饭；薄野冰雕可选。乘往西4丁目、西15丁目方向市电回西线9条" }],
    luggage: "札幌连住，箱子留酒店。", note: "雪祭开幕日人多，不必走完整个会场。2/7仍可补看；明早去小樽，提前整理两晚换洗包。", sources: ["O1", "S04", "S05", "N34", "N35"] },
  { date: "02-05", weekday: "周五", city: "札幌 · 朝里 · 小樽", title: "经朝里去小樽，堺町从南向北逛", stay: "小樽", pace: "07:00起床",
    slots: [{ time: "07:30–08:00", text: "早餐、退房，办好大箱寄存，只带两晚换洗包" }, { time: "08:00–09:10", text: "西线9条市电至西4丁目，再经地下步行街到札幌站；¥230/人，雪天提前。打车预算每车¥2,000–3,200，默认公共交通" }, { time: "09:25–约10:05", text: "普通156M：札幌→朝里，确认停朝里，途中不用换车" }, { time: "约10:05–10:35", text: "朝里站周边看海、拍照，提前回站；风雪大就不下车", optional: true }, { time: "10:42–10:52", text: "普通162M：朝里→小樽，先去站前酒店，不在南小樽下车" }, { time: "11:00–12:00", text: "小樽站附近酒店寄存、午餐" }, { time: "12:00–12:30", text: "出租车到音乐盒堂本馆，每车单程粗估¥1,200–2,000；报价超¥3,000就从小樽站乘普通JR到南小樽，再步行到本馆" }, { time: "12:30–16:00", text: "音乐盒堂本馆 → 北一硝子三号馆 → 堺町北段、大正硝子，由南向北逛" }, { time: "16:00–17:00", text: "浅草桥 → 运河散步，再往小樽站方向回酒店" }, { time: "17:00–20:00", text: "酒店入住、休息，站前晚饭；今晚普通夜景，不是正式雪灯" }],
    luggage: "札幌2/2–4与2/7尽量订同一家，确认能否跨两晚存大箱，只带换洗小包。不能寄存就带箱直达小樽，朝里短停取消。",
    note: "朝里约停37分钟，只在公共区域短走，不进铁轨或居民院落。09:33 Airport31号不停朝里；天气差留在09:25普通车上，10:15直达小樽。5日没有正式雪灯。", sources: ["N17", "N33", "T07", "O2", "N34", "N35"],
    trains: [
      { route: "札幌 → 朝里", earlier: "09:16→约09:51｜普通154M", recommended: "09:25→约10:05｜普通156M", later: "10:00→约10:30｜Airport35号，停朝里", note: "三班均停朝里；09:33 Airport31号不停。朝里到站为约数，官方总表列发车时刻；选其他班次须重配后段停留。", sources: ["N17"] },
      { route: "朝里 → 小樽", earlier: "10:30→10:41｜Airport35号", recommended: "10:42→10:52｜普通162M", later: "11:03→11:14｜普通164D", note: "三班均在朝里停车。推荐班可留约30分钟拍照；提前班停留短，延后班需多等候。普通自由席不用预约。", sources: ["N17"] },
    ] },
  { date: "02-06", weekday: "周六", city: "小樽", title: "天狗山与雪灯之路开幕", stay: "小樽", pace: "08:30起床",
    slots: [{ time: "09:30–11:30", text: "站前酒店 → 三角市场早餐 → 船见坂短停（路滑就省），回小樽站前" }, { time: "11:30–15:30", text: "午餐后，从小樽站前乘巴士到天狗山索道山麓站，索道往返；含接驳预留3–4小时" }, { time: "15:30–17:30", text: "巴士回小樽站前，酒店休息、提前吃晚饭" }, { time: "17:30–19:30", text: "步行到运河看雪灯，具体点灯时间待官方公告；水族馆、祝津不叠加在今天" }, { time: "20:00前后", text: "回小樽站附近酒店休息" }],
    luggage: "连住小樽，箱子或换洗包留酒店；看完雪灯直接回酒店。", note: "天狗山遇雾、停运或排队久就省，雪灯开幕留足时间。冬季索道现公布上行至19:48、下行至20:00，本计划白天上山。", sources: ["T06", "T15", "O2", "O3"] },
  { date: "02-07", weekday: "周日", city: "小樽 · 发寒 · 札幌", title: "经发寒游白色恋人，再回札幌", stay: "札幌", pace: "07:30起床",
    slots: [{ time: "08:20–08:40", text: "站前酒店早餐、退房，带换洗包到小樽站候车" }, { time: "08:55–约09:32", text: "普通149M：小樽→发寒（発寒），途中不用换车" }, { time: "09:35–10:00", text: "出租车到白色恋人，每车单程预算¥1,000–1,800；车程预计10–15分钟，另留候车时间。报价超¥3,000改JR到札幌、地铁经大通至宫之泽，游园时间顺延" }, { time: "10:00–12:00", text: "白色恋人公园，参观、庭园、甜品；手作需另留时间" }, { time: "12:00–13:00", text: "午餐，取回园内寄存物品" }, { time: "13:00–14:30", text: "步行到宫之泽 → 地铁西11丁目 → 步行至中央区役所前 → 市电西线9条，回酒店放包；分开付费合计¥520/人，符合换乘条件可优惠" }, { time: "14:30–17:00", text: "酒店休息；有体力再轻装购物、喝咖啡或补雪祭", optional: true }, { time: "18:00–20:00", text: "晚饭、整理行李，确认返程交通" }],
    luggage: "优先把大箱留札幌酒店，仅带换洗小包游园。白色恋人有免费柜，尺寸、空位不保证；带大箱且未落实寄存时，先回札幌酒店放箱再改走地铁往返。",
    note: "下车站是发寒，别坐到发寒中央；09:22 Airport52号不停发寒。公园10:00–18:00，付费区16:30停入。发寒约09:32到站，总表列的是发车时刻。园内可留意笔记推荐的巧克力牛奶泡芙、整点木偶表演，售卖点与场次待确认。微缩小镇及足球场只在确认冬季开放、有余力时顺路看；增加停留就缩短下午购物。", sources: ["N19", "N30", "N31", "N32", "O1", "N34", "N35", "R41"],
    trains: [{ route: "小樽 → 发寒", earlier: "08:33→约09:09｜普通147M", recommended: "08:55→约09:32｜普通149M", later: "09:11→约09:51｜普通151M", note: "三班都停发寒。09:22 Airport52号通过不停；不要只看目的地方向上车。到站时间为约数，提前班抵达公园偏早。", sources: ["N19"] }] },
  { date: "02-08", weekday: "周一", city: "札幌 · 新千岁", title: "前往机场，返程", stay: null, pace: "按航班起床",
    slots: [{ time: "按机票", text: "西线9条酒店退房 → 市电西4丁目 → 地下步行街至札幌站 → JR新千岁机场。酒店到札幌站打车预算每车¥2,000–3,200，可能超¥3,000，优先市电接JR；不全程打车去机场" }, { time: "起飞前3小时", text: "国际航班按提前3小时到机场规划；市内接驳约留1小时，JR与雪天余量另计" }],
    luggage: "直接带去机场；晚班机若留市区，先确认酒店退房后寄存与取件时间。", note: "航班时间未定，机场列车暂不锁班。出门前查运行信息，不排远处景点。", sources: ["O10", "N34", "N35"] },
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
    { id: "hell-valley", name: "登别地狱谷", priority: "优先", duration: "跟团约35分钟", reason: "2/3一日游停留，走开放主路看蒸汽与雪景；不在登别住宿，不含泡汤。", schedule: "2/3 跟团候选", day: "02-03", sources: ["N29", "N20", "N34", "N35"] },
  ],
  洞爷湖: [
    { id: "lake-toya", name: "洞爷湖畔＋温泉街", priority: "优先", duration: "跟团约70分钟含午餐", reason: "选一日游湖畔A线，散步、自由午餐；行李留札幌酒店，当天返回札幌。", schedule: "2/3 跟团候选", day: "02-03", sources: ["N29"] },
    { id: "silo", name: "Silo展望台", priority: "优先", duration: "跟团约30分钟", reason: "预计10:55到达，俯瞰洞爷湖与中岛；接驳含在一日游中，无需另约出租车。", schedule: "2/3 跟团候选", day: "02-03", sources: ["N29", "N09"] },
    { id: "showa", name: "昭和新山山麓", priority: "优先", duration: "跟团约40分钟", reason: "2/3湖畔A线在洞爷湖后、地狱谷前停留，山麓看火山；不登山、不乘停运的有珠山索道。", schedule: "2/3 跟团候选", day: "02-03", sources: ["N29", "M25"] },
    { id: "usu", name: "有珠山缆车", priority: "可省", duration: "本次不安排", reason: "冬季团产品注明2027/1/12–3/13索道停运，覆盖本次出行；改走洞爷湖湖畔与昭和新山，不上山。", condition: "出行期间停运", schedule: "不安排", sources: ["N29", "N21", "M22"] },
  ],
  札幌: [
    { id: "odori", name: "大通公园雪祭", priority: "优先", duration: "2小时", reason: "从西11丁目一侧由西向东看雪雕，走向电视塔，再接狸小路、薄野。挑重点，不必走完整条街。", schedule: "2/4 已安排", day: "02-04", sources: ["S05", "O1", "M03"] },
    { id: "shrine", name: "北海道神宫＋圆山公园", priority: "优先", duration: "1.5–2小时", reason: "神社与雪林在同一片区，白天慢走。", schedule: "2/4 已安排", day: "02-04", sources: ["S04", "M01"] },
    { id: "university", name: "北海道大学", priority: "优先", duration: "1.5–2小时", reason: "札幌站寄存后逛南部校园，正门进、南门出，再向南看旧道厅；博物馆另查开放。", schedule: "2/2 已安排", day: "02-02", sources: ["H01", "S11", "S12", "M02"] },
    { id: "susukino", name: "薄野冰雕＋街景", priority: "可选", duration: "30–60分钟", reason: "大通之后顺路看，累了直接去吃饭。", schedule: "2/4 可选", day: "02-04", sources: ["S05", "S14"] },
    { id: "nakajima", name: "中岛公园", priority: "可选", duration: "1–1.5小时", reason: "地铁方便，轻松看雪；与大学、圆山体验部分重复。", schedule: "2/7 替换项", day: "02-07", sources: ["S14", "S15"] },
    { id: "red-office", name: "旧道厅红砖厅舍", priority: "可选", duration: "外观30分钟", reason: "站前顺路看建筑；入馆另留1小时以上并查开放。", schedule: "2/2 可选", day: "02-02", sources: ["S08", "S13", "M06"] },
    { id: "shiroi", name: "白色恋人公园", priority: "优先", duration: "园内2小时 · 周边、接驳、午餐另计", reason: "10:00开园，逛庭园、吃甜品；笔记推荐巧克力牛奶泡芙、整点木偶表演，售卖点、价格与场次待确认。周边微缩小镇疑似 Gulliver Town Pokke，名称及冬季开放待核；宫之泽白色恋人足球场可作看山景候选，看台冬季开放待核。两处仅开放且有余力时顺路看，增加停留就缩短下午购物。发寒站打车预算每车¥1,000–1,800，超¥3,000改公共交通；回程经宫之泽、西11丁目换市电。免费柜空位不保证。", schedule: "2/7 已安排 · 周边可选", day: "02-07", sources: ["N19", "N30", "N31", "N32", "N23", "N34", "N35", "M04", "R41"] },
    { id: "tanukikoji", name: "狸小路", priority: "可选", duration: "45–90分钟", reason: "有顶棚的药妆、伴手礼与餐饮街，晚饭前后逛；店铺重复度高，热门店结账排队。", schedule: "顺路选", sources: ["S08", "S14", "R19", "R20"] },
    { id: "frances", name: "宫之森Frances教会", priority: "可选", duration: "庭园20–40分钟 · 往返另计", reason: "看雪夜灯饰、月亮装置；庭园小，内部未必开放，婚礼可能停接待，先查当月日历。", schedule: "2/7 晚间备选", sources: ["R17", "R18", "O21", "O22"] },
    { id: "nijo", name: "二条市场", priority: "可选", duration: "45–90分钟含用餐", reason: "市中心吃海鲜饭、逛小市场；价格未必低，热门店排队或拼桌，按店挑、别只看队伍。", schedule: "午餐顺路选", sources: ["R23", "R24"] },
    { id: "airport-onsen", name: "新千岁机场温泉", priority: "可选", duration: "1.5–2小时 · 值机安检另留", reason: "国内线4楼泡汤、洗澡休息；可能满员，不可中途外出再入，候机充裕再去。", schedule: "2/8 按航班选", sources: ["R37", "R38", "O26", "O27"] },
    { id: "moiwa", name: "藻岩山", priority: "可省", duration: "约3小时含接驳排队", reason: "地图标索道山麓站；两段缆车看札幌全景，换乘排队久、风雪易遮景。已有两座山，仅作替换项。", schedule: "夜景替换项", sources: ["S07", "R35", "R36", "M20"] },
    { id: "tower", name: "札幌电视塔", priority: "可省", duration: "45–60分钟", reason: "大通东端俯瞰雪祭，展望层小；与札幌站T38分开标点，登高二选一。", schedule: "2/4 登高替换项", sources: ["S08", "R40", "M05"] },
    { id: "t38", name: "JR塔T38观景台", priority: "可省", duration: "45–60分钟", reason: "连通札幌站，适合站前活动后选；与电视塔不在同一处，玻璃反光、雪雾影响观景。", schedule: "站前登高替换项", sources: ["S12", "R39", "M23"] },
    { id: "clock", name: "时计台", priority: "可省", duration: "外观15–20分钟", reason: "老木建筑与机械钟，顺路看外观；体量小、四周高楼，非历史爱好者不必专程入馆。", schedule: "顺路选", sources: ["S08", "S13", "R25", "R26"] },
    { id: "remote", name: "札幌伏见稻荷神社", priority: "可省", duration: "2–3小时含接驳", reason: "市区西南侧看雪中红鸟居，坡滑、拍摄受限；需另留时间，与头大佛分开安排。", schedule: "兴趣替换项", sources: ["S09", "R33", "O24", "M21"] },
    { id: "hill-buddha", name: "头大佛", priority: "可省", duration: "半天", reason: "位于远郊滝野陵园，地铁真驹内换真108巴士；冬季10:00–15:00。不能与伏见稻荷当作同一片区顺路逛。", schedule: "半天替换项", sources: ["S10", "R34", "O25", "M24"] },
  ],
  小樽: [
    { id: "canal", name: "小樽运河＋雪灯之路", priority: "优先", duration: "夜间1–1.5小时", reason: "住两晚；2/5晚普通夜景可选，2/6看雪灯，2/7经白色恋人回札幌。", schedule: "2/6 已安排", day: "02-06", sources: ["T06", "T15", "O2", "M07"] },
    { id: "tengu", name: "天狗山", priority: "优先", duration: "3–4小时含接驳排队", reason: "小樽站前巴士往返山麓站，地图标山麓接驳点。雾大或排队久就省，保留晚间雪灯。", condition: "晴天优先", schedule: "2/6 已安排 · 看天气", day: "02-06", sources: ["T04", "T05", "T12", "O3", "M13"] },
    { id: "sakaimachi", name: "堺町通", priority: "优先", duration: "整片2–3小时", reason: "站前酒店放包后接到南端，音乐盒堂本馆→北一硝子三号馆→大正硝子→浅草桥，由南向北逛；手作另约。", schedule: "2/5 已安排", day: "02-05", sources: ["T07", "T15", "R03", "R04", "O16", "M26"] },
    { id: "music-box", name: "小樽音乐盒堂本馆", priority: "优先", duration: "45–60分钟 · 堺町内", reason: "老建筑与音乐盒，不购物也能逛。", schedule: "2/5 已安排", day: "02-05", sources: ["T06", "T07", "M08"] },
    { id: "glass", name: "北一硝子三号馆", priority: "可选", duration: "30–60分钟 · 堺町内", reason: "玻璃工艺与老店，不必把每家店都逛完。", schedule: "2/5 已安排", day: "02-05", sources: ["T06", "T15", "M09"] },
    { id: "funami", name: "船见坂", priority: "可选", duration: "20–30分钟", reason: "坡道尽头看海，拍《情书》街景；结冰、车流和拍照人群多，不站车道，路滑就省。", schedule: "2/6 站前顺路选", day: "02-06", sources: ["T02", "T13", "R13", "R14", "M10"] },
    { id: "temiya", name: "旧手宫线遗址", priority: "可选", duration: "20–30分钟", reason: "市区老铁路散步；大雪会埋住轨道，白天可能只见雪路，雪灯布置看当年会场图。", schedule: "顺路选", sources: ["T06", "T08", "R07", "R08", "O17", "O18", "M27"] },
    { id: "aquarium", name: "小樽水族馆", priority: "可省", duration: "含接驳至少半天", reason: "看企鹅雪中散步、海豚表演；馆较老，冬季海兽公园关闭，表演定时、巴士拥挤，替换天狗山。", schedule: "半天替换项", sources: ["T03", "T10", "T11", "R11", "R12", "O20", "M11"] },
    { id: "shukutsu", name: "祝津展望台", priority: "可省", duration: "水族馆同线再加约1小时", reason: "俯瞰海崖、灯塔与海湾，可接水族馆；上坡结冰、部分路段人车共用，风大取消。", schedule: "兴趣替换项", sources: ["T03", "T11", "R29", "R30", "M12"] },
    { id: "asari", name: "朝里站与海边", priority: "可选", duration: "约30分钟 · 候车另留", reason: "2/5普通156M约10:05到，10:42普通162M续去小樽；短走看雪海，不进铁轨、居民院落。风雪大或带大箱就直接到小樽。", condition: "天气好再下车", schedule: "2/5 顺路安排", day: "02-05", sources: ["N17", "N33", "T09", "R31", "R32"] },
  ],
  函馆: [
    { id: "hakodate-mountain", name: "函馆山", priority: "优先", duration: "3–4小时含接驳排队", reason: "默认2/1元町之后乘索道；1/31更晴时与五棱郭对调并删减湾区。地图标山麓站，冬季不能打车上山。", condition: "晴天优先", schedule: "2/1 已安排 · 看天气", day: "02-01", sources: ["K06", "K12", "K13", "O4", "O5", "M14"] },
    { id: "goryokaku", name: "五棱郭塔＋公园", priority: "优先", duration: "2–2.5小时", reason: "登塔看星形城郭，地图标塔楼；市电五棱郭公园前下车再步行。9:00–18:00，17:50最后入场。", schedule: "1/31 已安排", day: "01-31", sources: ["K04", "K11", "O6", "M18"] },
    { id: "motomachi", name: "八幡坂＋元町教堂街", priority: "优先", duration: "1.5–2小时", reason: "旧公会堂之后走八幡坂上段、教堂街，再接索道山麓站，少上下坡。", schedule: "2/1 已安排", day: "02-01", sources: ["K09", "K11", "M15"] },
    { id: "kanemori", name: "金森红砖仓库＋湾区", priority: "可选", duration: "1.5–2小时", reason: "2/1朝市后沿湾区前往，午餐后接元町；若夜景提前到1/31，仓库按剩余时间缩短或取消。", schedule: "2/1 已安排", day: "02-01", sources: ["K06", "K08", "K10", "M16"] },
    { id: "morning-market", name: "函馆朝市", priority: "可选", duration: "45–90分钟含用餐", reason: "车站旁吃海鲜饭、逛市场、钓鱿鱼；店间价差大，鱿鱼看渔获、晚到可能售罄。", schedule: "2/1 已安排", day: "02-01", sources: ["R21", "R22"] },
    { id: "old-hall", name: "元町公园＋旧公会堂周边", priority: "可选", duration: "元町行程再加30–60分钟", reason: "元町顺路看蓝黄洋楼、港口，馆内看建筑与历史；内容偏少、坡路易滑，入馆另留时间。", schedule: "2/1 可选", day: "02-01", sources: ["H05", "K09", "R01", "R02", "O15", "M17"] },
    { id: "omori", name: "大森海岸", priority: "可选", duration: "30–45分钟 · 接驳另计", reason: "在站前东南侧，与西部元町不同方向；晴天有余力另留时间，不插进湾区步行线。", schedule: "晴天替换项", sources: ["K06", "K14", "R05", "R06"] },
    { id: "yunokawa", name: "汤之川温泉", priority: "可选", duration: "半天", reason: "位于函馆东侧，需替换1/31五棱郭或2/1湾区活动；先确认日归接待时段，不作为元町顺路点。", schedule: "体验替换项", sources: ["K05", "R09", "R10", "O19"] },
    { id: "botanical", name: "函馆热带植物园", priority: "可省", duration: "园内45–60分钟 · 往返2–3小时", reason: "主要看猴子泡汤；园区小、温室内容少，猴子不一定入水，去汤之川时再顺带。", schedule: "兴趣替换项", sources: ["K04", "K05", "K11", "R27", "R28", "O23", "M19"] },
  ],
};

export const recommendationCities: RecommendationCity[] = ["支笏湖", "登别", "洞爷湖", "函馆", "札幌", "小樽"];
export const cityNames: City[] = ["札幌", "小樽", "函馆"];
const stayCities: StayCity[] = ["千岁", "函馆", "札幌", "小樽"];
export const nights = stayCities.map((city) => ({ city, count: dayPlans.filter((day) => day.stay === city).length }));

export const hokkaidoWinterTrip: Trip = {
  slug: "hokkaido-winter", code: "HOKKAIDO", routeBadge: "函馆 · 札幌 · 小樽 · 登别洞爷湖一日游", kicker: "WINTER 2027",
  title: "北海道冬季慢游", subtitle: "", dateRange: "1.29—2.08", fullDateRange: "2027.01.29—02.08",
  intro: "落地住千岁，次晨赴函馆；札幌出发一日游看洞爷湖、登别与冰涛节，经朝里游小樽、回程逛白色恋人，11天9晚。",
  days: dayPlans.map((day) => ({ label: day.date.replace("-", "/"), date: `2027-${day.date}`, city: day.city, title: day.title, summary: day.pace, schedule: day.slots.map((slot) => `${slot.time} ${slot.text}`), stay: day.stay ?? "按机票", color: "#b94f4a" })),
  stops: [], alternatives: [], meals: [], bookings: [], links: [],
};
