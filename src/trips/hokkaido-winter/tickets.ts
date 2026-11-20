type TicketItem = {
  name: string;
  date: string;
  price: string;
  status: "提前订" | "当天买" | "按需预约";
  timing: string;
  note: string;
  sources: string[];
};

type TicketGroup = {
  id: string;
  label: string;
  note: string;
  items: TicketItem[];
};

export const ticketGroups: TicketGroup[] = [
  {
    id: "rail",
    label: "JR列车",
    note: "本次单独买票，不买JR Pass。以下特急价格含基础乘车票与普通车指定席；若将千岁→函馆基础乘车票连开，须说明在登别、洞爷中途下车，三段特急指定席分别订，基础票别重复买。",
    items: [
      { name: "千岁 → 登别 · 铃兰6号", date: "1/31 · 14:14–15:03", price: "¥3,480", status: "提前订", timing: "2026/12/31 北京时间09:00开售", note: "全车指定席。与冰涛节返程接驳衔接，取行李后进站。", sources: ["N22", "N05"] },
      { name: "登别 → 洞爷 · 北斗4号", date: "2/1 · 08:03–08:43", price: "¥3,060", status: "提前订", timing: "2027/1/1 北京时间09:00开售", note: "全车指定席。另落实07:25温泉巴士或出租车接站。", sources: ["N22", "N14"] },
      { name: "洞爷 → 函馆 · 北斗16号", date: "2/1 · 16:38–18:30", price: "¥6,250", status: "提前订", timing: "2027/1/1 北京时间09:00开售", note: "全车指定席。湖畔返站后留时间取寄存行李。", sources: ["N22", "N14"] },
      { name: "函馆 → 札幌 · 北斗5号", date: "2/4 · 08:56–12:41", price: "¥9,770", status: "提前订", timing: "2027/1/4 北京时间09:00开售", note: "雪祭开幕日，建议开售就锁座；网上购票后留足取票时间。", sources: ["N22", "N16"] },
      { name: "小樽往返、机场JR自由席", date: "1/30、2/5、2/7、2/8", price: "札幌↔小樽每程¥800；机场段另计", status: "当天买", timing: "乘车当天买票，或在适用区间刷交通卡", note: "自由席不用预约；2/5快速Airport若选u-seat指定席，另购座席券。", sources: ["N26", "N22"] },
    ],
  },
  {
    id: "transfers",
    label: "巴士接驳",
    note: "普通市内巴士按次付费；登别温泉、洞爷湖及Silo的接驳费用另计。出租车先确认总价、等候费和回程安排。",
    items: [
      { name: "冰涛节 BLUE LINER 往返", date: "1/31 · 09:20出发／12:30返回", price: "¥4,000", status: "提前订", timing: "最晚1/30日本时间20:30前预约", note: "千岁站往返支笏湖；不含门票。不可改班，个人原因取消不退款，提前10分钟到站。", sources: ["N02"] },
      { name: "洞爷湖 ↔ Silo 出租车", date: "2/1 · 中午", price: "往返约¥8,000起，等候费另询", status: "按需预约", timing: "巴士短途订位未落实时，提前预约往返车", note: "巴士短途能否订位仍待确认；展望台不保证有候客出租车，别只约去程。", sources: ["N09", "N12", "N13"] },
      { name: "登别温泉街 → JR登别站出租车", date: "2/1 · 早晨", price: "按上车地点询价", status: "按需预约", timing: "采用出租车时，至少前一晚落实", note: "告知要赶08:03北斗，按雪天车程确认出发时间；坐07:25温泉总站巴士则不用约车。", sources: ["N06"] },
    ],
  },
  {
    id: "attractions",
    label: "景点门票",
    note: "无需门票：地狱谷主要观景区、洞爷湖畔、Silo、大通雪祭、小樽雪灯、北海道大学校园、神宫与圆山公园。运河、堺町、音乐盒堂本馆、北一硝子商店、金森仓库商店区可免费逛，购物、餐饮、手作另付。",
    items: [
      { name: "支笏湖冰涛节", date: "1/31 · 周日", price: "¥3,000", status: "当天买", timing: "会场入口购买", note: "按周日票价；BLUE LINER车票不含入场券。", sources: ["N02"] },
      { name: "五棱郭塔", date: "2/2", price: "¥1,200", status: "当天买", timing: "现场买票，17:50最后入场", note: "登塔需票，只逛五棱郭公园无需买登塔票。", sources: ["O6"] },
      { name: "函馆山索道往返", date: "2/2或2/3 · 两天择晴一次", price: "¥1,800", status: "当天买", timing: "确认能见度、索道运行后购买", note: "预售票无优惠，也不能优先上车；冬季停运不能改打车上山。", sources: ["O4", "N27"] },
      { name: "天狗山冬季巴士套票", date: "2/6", price: "¥2,450", status: "当天买", timing: "确认索道运行后，到小樽站前巴士总站买", note: "选小樽出发版：含市内指定范围巴士一日券＋索道往返；不再重复买索道票。", sources: ["O3", "N28"] },
      { name: "白色恋人付费区 · 可选", date: "2/7", price: "¥1,200", status: "当天买", timing: "现场或网上购买，16:30停止入场", note: "普通参观不强制预约；仅逛免费庭园、购物区，无需门票。", sources: ["N23"] },
      { name: "白色恋人手作体验 · 可选", date: "2/7", price: "按课程定价", status: "按需预约", timing: "确定参加后，提前查看当天场次并预约", note: "体验有名额限制；可选入馆＋体验组合票，避免重复购买入馆券。", sources: ["N23"] },
    ],
  },
  {
    id: "city",
    label: "市内交通",
    note: "已有Suica、ICOCA等交通卡可继续用，不用另买Kitaca。日票按当天实际乘车次数选，普通市内公交无需预订。",
    items: [
      { name: "札幌周末地铁券", date: "2/7 · 周日", price: "¥520", status: "当天买", timing: "当天在地铁站买，现金支付", note: "去白色恋人时推荐。单程≥¥290的路线往返即划算；仅地铁，不含小樽→札幌JR。", sources: ["N24"] },
      { name: "函馆市电一日券 · 按需", date: "2/2", price: "¥800", status: "当天买", timing: "预计当天市电票价合计达到¥800再买", note: "五棱郭、元町之间可能用上；2/3主要在朝市、湾区步行，默认按次付费。", sources: ["N25"] },
      { name: "札幌平日地铁一日券 · 按需", date: "2/4、2/5", price: "¥830／天", status: "当天买", timing: "按当天路线计算，达到¥830再买", note: "4日主要在大通附近步行，5日按实际接驳次数判断；暂不预买。", sources: ["N24"] },
    ],
  },
];
