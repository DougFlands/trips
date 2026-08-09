"use client";

import { useMemo, useState } from "react";
import { amapUrl, TravelMap, type MapStop } from "./TravelMap";

const stops: MapStop[] = [
  { id: "qingdao-north", day: 0, order: 1, city: "青岛", name: "青岛北站", time: "晚间", note: "首晚住这里，次日换城少折返。", coord: [120.375693, 36.168977] },
  { id: "yantai-station", day: 1, order: 1, city: "烟台", name: "烟台站", time: "09:00", note: "到站先寄存或去车站附近酒店放行李。", coord: [121.383327, 37.548407] },
  { id: "yantai-hill", day: 1, order: 2, city: "烟台", name: "烟台山景区", time: "10:00", note: "灯塔、近代建筑与芝罘湾视野。", coord: [121.402115, 37.548354] },
  { id: "chaoyang", day: 1, order: 3, city: "烟台", name: "朝阳街", time: "11:40", note: "从烟台山顺路步行，午间慢逛。", coord: [121.401503, 37.542525] },
  { id: "suochengli", day: 1, order: 4, city: "烟台", name: "所城里", time: "13:20", note: "老城巷道与午饭放在一起。", coord: [121.398626, 37.536545] },
  { id: "yantai-square", day: 1, order: 5, city: "烟台", name: "烟台滨海广场", time: "15:20", note: "回到海边，留出拍照与休息时间。", coord: [121.410705, 37.540243] },
  { id: "fishermans-wharf", day: 1, order: 6, city: "烟台", name: "海昌渔人码头", time: "16:40", note: "傍晚看海；中秋客流大，打车预留时间。", coord: [121.452367, 37.519283] },
  { id: "weihai-station-in", day: 2, order: 1, city: "威海", name: "威海站", time: "08:50", note: "优先选到威海站的车次，寄存行李后出发。", coord: [122.144181, 37.426026] },
  { id: "torch-street", day: 2, order: 2, city: "威海", name: "火炬八街", time: "09:45", note: "从车站打车到北端，尽量赶在大客流前。", coord: [122.031336, 37.522713] },
  { id: "haiyuan", day: 2, order: 3, city: "威海", name: "海源公园", time: "11:20", note: "沿海礁石与渔船，比网红街更松弛。", coord: [122.150815, 37.518995] },
  { id: "happiness-gate", day: 2, order: 4, city: "威海", name: "幸福门", time: "13:40", note: "午饭后进入市中心滨海带。", coord: [122.127677, 37.501473] },
  { id: "yuehai", day: 2, order: 5, city: "威海", name: "悦海公园", time: "15:40", note: "灯塔与海草房，逛完向威海站收口。", coord: [122.161056, 37.446979] },
  { id: "weihai-station-out", day: 2, order: 6, city: "威海", name: "威海站", time: "17:20", note: "取行李，搭18点后的动车返回青岛。", coord: [122.144181, 37.426026] },
  { id: "zhanqiao", day: 3, order: 1, city: "青岛", name: "栈桥景区", time: "07:30", note: "假期早到，顺着老城与海岸向东走。", coord: [120.3193, 36.061736] },
  { id: "governor-house", day: 3, order: 2, city: "青岛", name: "青岛德国总督楼旧址博物馆", time: "09:20", note: "建筑内观；提前确认预约与当日开放。", coord: [120.332953, 36.064939] },
  { id: "xiaoyushan", day: 3, order: 3, city: "青岛", name: "小鱼山公园", time: "11:10", note: "登高看红瓦、绿树与汇泉湾。", coord: [120.336558, 36.058765] },
  { id: "badaguan", day: 3, order: 4, city: "青岛", name: "八大关风景区", time: "13:40", note: "午饭后散步，保留两小时。", coord: [120.350903, 36.053625] },
  { id: "may-fourth", day: 3, order: 5, city: "青岛", name: "五四广场", time: "16:40", note: "现代海湾段起点，傍晚光线更舒服。", coord: [120.384576, 36.06274] },
  { id: "olympic", day: 3, order: 6, city: "青岛", name: "青岛奥帆中心", time: "18:10", note: "晚饭与夜景；灯光秀以当天公告为准。", coord: [120.395063, 36.054643] },
  { id: "beer-museum", day: 4, order: 1, city: "青岛", name: "青岛啤酒博物馆", time: "09:00", note: "上午进馆，下午保持轻松。", coord: [120.347318, 36.079106] },
];

const days = [
  {
    date: "09.25 · 周五",
    label: "D0",
    city: "抵达青岛",
    title: "晚到就休息：靠近明早的车站",
    summary: "晚间抵达又碰上中秋首日，不再塞夜游。住青岛北站片区，把第二天的换城成本降下来。",
    schedule: ["晚间抵达青岛", "前往青岛北站片区", "入住后早点休息"],
    stay: "住：青岛北站附近",
    tone: "coral",
  },
  {
    date: "09.26 · 周六",
    label: "D1",
    city: "烟台",
    title: "老城向海，傍晚落在渔人码头",
    summary: "烟台山、朝阳街、所城里是一段紧凑步行线；下午再沿海向东，减少来回折返。",
    schedule: ["早班动车 青岛北 → 烟台", "10:00 烟台山 → 朝阳街", "13:20 所城里午饭", "15:20 滨海广场 → 渔人码头"],
    stay: "住：烟台站 / 朝阳街一带",
    tone: "teal",
  },
  {
    date: "09.27 · 周日",
    label: "D2",
    city: "威海",
    title: "从北向南，把海岸线走成单行线",
    summary: "到威海站先处理行李，再打车去火炬八街。一路向南，悦海公园结束后回威海站坐车。",
    schedule: ["早班动车 烟台 → 威海", "09:45 火炬八街错峰", "11:20 海源公园", "13:40 幸福门", "15:40 悦海公园", "18点后 动车返青岛"],
    stay: "住：青岛老城 / 五四广场",
    tone: "violet",
  },
  {
    date: "09.28 · 周一",
    label: "D3",
    city: "青岛",
    title: "红瓦老城，到现代海湾",
    summary: "一早从栈桥进场，经总督楼、小鱼山、八大关，傍晚接上五四广场与奥帆中心。",
    schedule: ["07:30 栈桥", "09:20 总督楼旧址", "11:10 小鱼山", "13:40 八大关", "16:40 五四广场", "18:10 奥帆中心"],
    stay: "住：原酒店，不换房",
    tone: "gold",
  },
  {
    date: "09.29 · 周二",
    label: "D4",
    city: "青岛收尾",
    title: "最后半天，轻松收尾",
    summary: "最后一天不再追远景点。啤酒博物馆、台东午饭，下午留白，自由安排。",
    schedule: ["09:00 青岛啤酒博物馆", "11:30 台东午饭", "14:00 自由活动 / 取行李", "下午 行程结束"],
    stay: "下午：自由安排",
    tone: "rose",
  },
];

const cityFoods = [
  { city: "青岛", headline: "海鲜之外，留一顿给啤酒与家常菜", items: ["鲅鱼水饺", "海菜凉粉", "辣炒蛤蜊", "袋装鲜啤"] },
  { city: "烟台", headline: "一座鲁菜与水果都很强的城市", items: ["蓬莱小面", "海肠捞饭", "焖子", "烟台苹果"] },
  { city: "威海", headline: "轻一点，方便赶傍晚动车", items: ["海鲜疙瘩汤", "鲅鱼水饺", "韩式料理", "无花果甜品"] },
];

const filters: Array<{ value: number | "all"; label: string }> = [
  { value: "all", label: "全程" },
  { value: 0, label: "9/25" },
  { value: 1, label: "9/26" },
  { value: 2, label: "9/27" },
  { value: 3, label: "9/28" },
  { value: 4, label: "9/29" },
];

export function TripPlanner() {
  const [activeDay, setActiveDay] = useState<number | "all">("all");
  const activeStops = useMemo(
    () => (activeDay === "all" ? stops : stops.filter((stop) => stop.day === activeDay)),
    [activeDay],
  );
  const activeInfo = activeDay === "all" ? null : days[activeDay];

  return (
    <main>
      <nav className="topbar" aria-label="页面导航">
        <a className="brand" href="#top"><span>青</span> 山海手帖</a>
        <div className="nav-links">
          <a href="#map">地图</a>
          <a href="#itinerary">行程</a>
          <a href="#book">预订</a>
          <a href="#food">吃什么</a>
        </div>
        <a className="nav-cta" href="#book">现在要订的</a>
      </nav>

      <header className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow">胶东半岛 · 中秋篇 / 2026</div>
          <h1>沿着海岸<br /><em>慢慢换城</em></h1>
          <p className="hero-lead">青岛、烟台、威海，4晚5天。路线按换城动车、18点后返青安排与中秋客流重新排过。</p>
          <div className="hero-actions">
            <a className="primary-button" href="#map">看地图路线</a>
            <a className="text-link" href="#itinerary">直接看每日安排 <span>↓</span></a>
          </div>
        </div>
        <aside className="trip-ticket" aria-label="行程摘要">
          <div className="ticket-head"><span>TRIP 0925</span><span>4N / 5D</span></div>
          <div className="ticket-route"><strong>青岛</strong><div><span /><i>经烟台</i><span /></div><strong>威海</strong></div>
          <div className="ticket-date"><small>开始</small><b>09.25</b><span>—</span><small>结束</small><b>09.29</b></div>
          <div className="ticket-city-grid">
            <div><span>01</span><b>青岛</b><small>老城与海湾</small></div>
            <div><span>02</span><b>烟台</b><small>灯塔与街巷</small></div>
            <div><span>03</span><b>威海</b><small>一路向南</small></div>
          </div>
          <div className="ticket-stamp">MID-AUTUMN<br />FIELD NOTES</div>
        </aside>
      </header>

      <section className="route-ribbon" aria-label="跨城路线">
        <div><span>09.25</span><strong>青岛</strong><small>晚间落脚</small></div>
        <i>→</i><div><span>09.26</span><strong>烟台</strong><small>老城与海</small></div>
        <i>→</i><div><span>09.27</span><strong>威海</strong><small>18点后返青</small></div>
        <i>→</i><div><span>09.28</span><strong>青岛</strong><small>完整一天</small></div>
        <i>→</i><div><span>09.29</span><strong>青岛</strong><small>半日收尾</small></div>
      </section>

      <section className="holiday-alert">
        <div className="alert-icon">月</div>
        <div><span>行程关键</span><strong>9月25—27日正值 2026 中秋假期</strong><p>烟台、威海两天都在假期内。动车票、住宿和热门场馆按“黄金周级别”处理；火炬八街与栈桥尽量早到。</p></div>
        <a href="https://big5.www.gov.cn/gate/big5/www.gov.cn/gongbao/2025/issue_12406/202511/content_7048922.html" target="_blank" rel="noreferrer">官方放假通知 ↗</a>
      </section>

      <section className="map-section section-shell" id="map">
        <div className="section-heading">
          <div><span className="section-number">01</span><div><p>ROUTE MAP</p><h2>地图上的 5 天</h2></div></div>
          <p>切换日期，看当天点位与行进方向。每个点都能跳到高德地图。</p>
        </div>
        <div className="map-controls" role="group" aria-label="按日期筛选地图">
          {filters.map((filter) => (
            <button key={String(filter.value)} type="button" className={activeDay === filter.value ? "active" : ""} onClick={() => setActiveDay(filter.value)}>
              {filter.label}
            </button>
          ))}
        </div>
        <div className="map-layout">
          <aside className="map-sidebar">
            <div className="map-summary">
              <span>{activeDay === "all" ? "全程总览" : activeInfo?.date}</span>
              <h3>{activeDay === "all" ? "三座城，一条海岸线" : activeInfo?.title}</h3>
              <p>{activeDay === "all" ? "点选日期会自动缩放到当天路线；全程视图适合确认换城关系。" : activeInfo?.summary}</p>
            </div>
            <ol className="map-stop-list">
              {activeStops.map((stop) => (
                <li key={stop.id} style={{ "--stop-color": `var(--day-${stop.day})` } as React.CSSProperties}>
                  <span>{stop.order}</span><div><small>{stop.time} · {stop.city}</small><strong>{stop.name}</strong><p>{stop.note}</p></div>
                  <a href={amapUrl(stop)} target="_blank" rel="noreferrer" aria-label={`在高德地图打开${stop.name}`}>↗</a>
                </li>
              ))}
            </ol>
          </aside>
          <TravelMap stops={stops} activeDay={activeDay} />
        </div>
      </section>

      <section className="itinerary-section section-shell" id="itinerary">
        <div className="section-heading">
          <div><span className="section-number">02</span><div><p>DAY BY DAY</p><h2>逐日行程</h2></div></div>
          <p>时间是可执行的节奏，不是打卡清单。遇到排队，优先保住换城动车。</p>
        </div>
        <div className="day-stack">
          {days.map((day, index) => (
            <article className={`day-card ${day.tone}`} key={day.label}>
              <div className="day-index"><span>{day.label}</span><small>{day.date}</small></div>
              <div className="day-main"><div className="city-label">{day.city}</div><h3>{day.title}</h3><p>{day.summary}</p><b>{day.stay}</b></div>
              <ol className="day-schedule">{day.schedule.map((item) => <li key={item}>{item}</li>)}</ol>
              <button type="button" onClick={() => { setActiveDay(index); document.querySelector("#map")?.scrollIntoView({ behavior: "smooth" }); }}>地图看这天 <span>↗</span></button>
            </article>
          ))}
        </div>
      </section>

      <section className="booking-section" id="book">
        <div className="booking-inner section-shell">
          <div className="booking-intro"><span className="section-number light">03</span><p>BOOKING BOARD</p><h2>现在要订的</h2><p>中秋三天是整段行程的硬约束。列车时刻尚可能调整，页面只固定方向与理想时间窗。</p></div>
          <div className="booking-grid">
            <article className="booking-card urgent"><span>01 · 立即</span><h3>三段动车</h3><ul><li>9/26 青岛北 → 烟台，早班</li><li>9/27 烟台 → 威海，早班</li><li>9/27 威海 → 青岛北，18点后</li></ul><a href="https://www.12306.cn/" target="_blank" rel="noreferrer">去 12306 ↗</a></article>
            <article className="booking-card"><span>02 · 立即</span><h3>三处住宿</h3><ul><li>9/25 青岛北站附近</li><li>9/26 烟台站 / 朝阳街</li><li>9/27—28 青岛老城或五四广场</li></ul><p>选可取消房型，防止动车车站变化。</p></article>
            <article className="booking-card"><span>03 · 行前7天</span><h3>青岛场馆</h3><ul><li>德国总督楼旧址博物馆</li><li>青岛啤酒博物馆 9/29 上午</li></ul><a href="https://www.tsingtaomuseum.com/" target="_blank" rel="noreferrer">啤酒博物馆官网 ↗</a></article>
            <article className="booking-card caution"><span>04 · 行前48小时</span><h3>二次复核</h3><ul><li>天气与海边风力</li><li>动车车次与到发站</li><li>景区节假日开放公告</li><li>威海站行李寄存</li></ul><p>寄存无官方点位时，再找车站附近正规门店。</p></article>
          </div>
        </div>
      </section>

      <section className="food-section section-shell" id="food">
        <div className="section-heading">
          <div><span className="section-number">04</span><div><p>LOCAL BITES</p><h2>每城吃什么</h2></div></div>
          <p>海鲜按时价先问清；赶车当天不排长队店。</p>
        </div>
        <div className="food-grid">
          {cityFoods.map((food, index) => <article key={food.city}><div className="food-city"><span>0{index + 1}</span><h3>{food.city}</h3></div><p>{food.headline}</p><div>{food.items.map((item) => <span key={item}>{item}</span>)}</div></article>)}
        </div>
      </section>

      <section className="practical section-shell">
        <div className="practical-title"><span>最后检查</span><h2>海边旅行，别只看晴雨</h2></div>
        <div className="practical-grid">
          <div><b>01</b><h3>穿衣</h3><p>薄外套、防风层、好走的鞋。9月底早晚海风明显。</p></div>
          <div><b>02</b><h3>行李</h3><p>换城两次，尽量控制在登机箱；27日提前处理寄存。</p></div>
          <div><b>03</b><h3>交通</h3><p>城际票只认 12306 最终车次；站名别混淆。</p></div>
          <div><b>04</b><h3>取舍</h3><p>威海不硬塞刘公岛；返青动车优先级最高。</p></div>
        </div>
      </section>

      <section className="sources section-shell">
        <h2>资料来源</h2>
        <div className="source-links">
          <a href="https://app.notion.com/p/dflands/3b7529bc43e380498ce2d170164a27e4" target="_blank" rel="noreferrer"><span>01</span>Notion 原始旅行要求</a>
          <a href="https://www.qingdao.gov.cn/zwgk/xxgk/whly/gkml/gzxx/202510/t20251023_10341033.shtml" target="_blank" rel="noreferrer"><span>02</span>青岛官方推荐路线</a>
          <a href="https://www.yantai.gov.cn/col/col43277/art/2026/art_222aad9963664dbb8be51f0c32c8e2bb.html" target="_blank" rel="noreferrer"><span>03</span>烟台文旅公共服务</a>
          <a href="https://www.weihai.gov.cn/art/2026/5/7/art_58817_6334685.html" target="_blank" rel="noreferrer"><span>04</span>威海市政府文旅信息</a>
          <a href="https://hzfw.12306.cn/zgzfw/resources/h5/ysqcx-h5.html" target="_blank" rel="noreferrer"><span>05</span>12306 预售期查询</a>
        </div>
        <p>攻略整理于 2026.08.09。票价、班次、营业时间与活动安排会变，出发前再看官方公告。</p>
      </section>

      <footer><div><span>青烟威</span><strong>沿海旅行手帖</strong></div><p>给 2026 年 9 月 25—29 日的山海路线</p><a href="#top">回到顶部 ↑</a></footer>
    </main>
  );
}
