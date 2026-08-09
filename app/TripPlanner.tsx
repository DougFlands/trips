"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { amapUrl, TravelMap, type MapStop } from "./TravelMap";

const stops: MapStop[] = [
  { id: "yantai-station", day: 0, order: 1, city: "烟台", name: "烟台站", time: "09:00", note: "到站寄存或先去附近酒店放行李。", coord: [121.383327, 37.548407] },
  { id: "yantai-hill", day: 0, order: 2, city: "烟台", name: "烟台山景区", time: "10:00", note: "灯塔、近代建筑与芝罘湾。", coord: [121.402115, 37.548354] },
  { id: "chaoyang", day: 0, order: 3, city: "烟台", name: "朝阳街", time: "11:40", note: "从烟台山步行过来，顺路吃午饭。", coord: [121.401503, 37.542525] },
  { id: "suochengli", day: 0, order: 4, city: "烟台", name: "所城里", time: "13:20", note: "老城巷道，慢逛一小时。", coord: [121.398626, 37.536545] },
  { id: "yantai-square", day: 0, order: 5, city: "烟台", name: "烟台滨海广场", time: "15:20", note: "回到海边，留出拍照和休息时间。", coord: [121.410705, 37.540243] },
  { id: "fishermans-wharf", day: 0, order: 6, city: "烟台", name: "海昌渔人码头", time: "16:40", note: "傍晚看海，中秋客流下预留打车时间。", coord: [121.452367, 37.519283] },
  { id: "weihai-station", day: 1, order: 1, city: "威海", name: "威海站", time: "08:50", note: "寄存行李，17:20回站取行李。", coord: [122.144181, 37.426026] },
  { id: "torch-street", day: 1, order: 2, city: "威海", name: "火炬八街", time: "09:45", note: "从车站打车直达，尽量赶在大客流前。", coord: [122.031336, 37.522713] },
  { id: "haiyuan", day: 1, order: 3, city: "威海", name: "海源公园", time: "11:20", note: "礁石、渔船，比网红街更松弛。", coord: [122.150815, 37.518995] },
  { id: "happiness-gate", day: 1, order: 4, city: "威海", name: "幸福门", time: "13:40", note: "午饭后进入市中心滨海带。", coord: [122.127677, 37.501473] },
  { id: "yuehai", day: 1, order: 5, city: "威海", name: "悦海公园", time: "15:40", note: "灯塔与海草房，逛完回威海站。", coord: [122.161056, 37.446979] },
  { id: "zhanqiao", day: 2, order: 1, city: "青岛", name: "栈桥景区", time: "07:30", note: "假期后第一天仍建议早到。", coord: [120.3193, 36.061736] },
  { id: "governor-house", day: 2, order: 2, city: "青岛", name: "德国总督楼旧址博物馆", time: "09:20", note: "提前确认预约与当日开放。", coord: [120.332953, 36.064939] },
  { id: "xiaoyushan", day: 2, order: 3, city: "青岛", name: "小鱼山公园", time: "11:10", note: "登高看红瓦、绿树与汇泉湾。", coord: [120.336558, 36.058765] },
  { id: "badaguan", day: 2, order: 4, city: "青岛", name: "八大关风景区", time: "13:40", note: "午饭后散步，保留两小时。", coord: [120.350903, 36.053625] },
  { id: "may-fourth", day: 2, order: 5, city: "青岛", name: "五四广场", time: "16:40", note: "傍晚进入现代海湾段。", coord: [120.384576, 36.06274] },
  { id: "olympic", day: 2, order: 6, city: "青岛", name: "青岛奥帆中心", time: "18:10", note: "夜景与晚饭，灯光秀看当天公告。", coord: [120.395063, 36.054643] },
  { id: "beer-museum", day: 3, order: 1, city: "青岛", name: "青岛啤酒博物馆", time: "09:00", note: "上午进馆，午饭后自由安排。", coord: [120.347318, 36.079106] },
];

const days = [
  { label: "D1", date: "09.26", city: "烟台", title: "老城向海", summary: "烟台山、朝阳街、所城里连成步行线，下午沿海向东。", schedule: ["早班动车 青岛北 → 烟台", "10:00 烟台山 → 朝阳街", "13:20 所城里", "15:20 滨海广场 → 渔人码头"], stay: "住烟台站 / 朝阳街" },
  { label: "D2", date: "09.27", city: "威海", title: "海岸单行线", summary: "到站先寄存，再打车到火炬八街，从北向南一路收口。", schedule: ["早班动车 烟台 → 威海", "09:45 火炬八街", "11:20 海源公园", "13:40 幸福门", "15:40 悦海公园", "18点后动车返青"], stay: "住青岛老城 / 五四广场" },
  { label: "D3", date: "09.28", city: "青岛", title: "红瓦老城 → 现代海湾", summary: "从栈桥向东，经小鱼山、八大关，傍晚到五四广场。", schedule: ["07:30 栈桥", "09:20 总督楼旧址", "11:10 小鱼山", "13:40 八大关", "16:40 五四广场", "18:10 奥帆中心"], stay: "原酒店续住" },
  { label: "D4", date: "09.29", city: "青岛", title: "轻松收尾", summary: "上午啤酒博物馆，台东午饭，下午留白。", schedule: ["09:00 青岛啤酒博物馆", "11:30 台东午饭", "14:00 自由活动 / 取行李"], stay: "下午自由安排" },
];

const filters: Array<{ value: number | "all"; label: string }> = [
  { value: "all", label: "ALL" },
  { value: 0, label: "09.26" },
  { value: 1, label: "09.27" },
  { value: 2, label: "09.28" },
  { value: 3, label: "09.29" },
];

export function TripPlanner() {
  const [activeDay, setActiveDay] = useState<number | "all">("all");
  const visibleStops = useMemo(() => activeDay === "all" ? stops : stops.filter((stop) => stop.day === activeDay), [activeDay]);
  const activeInfo = activeDay === "all" ? null : days[activeDay];

  function showDay(day: number) {
    setActiveDay(day);
    document.querySelector("#map")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <nav className="topbar">
        <a className="brand" href="#top"><i /> JIAODONG//26</a>
        <div><a href="#map">MAP</a><a href="#plan">PLAN</a><a href="#book">BOOK</a></div>
        <span className="status"><i /> ROUTE ONLINE</span>
      </nav>

      <header className="hero section-shell" id="top">
        <div className="hero-kicker">[ QINGDAO / YANTAI / WEIHAI ]</div>
        <h1>青烟威<span>//</span><br />海岸线</h1>
        <p>09.26—09.29 · 四天三城。按中秋客流、城际动车和18点后返青要求排好。</p>
        <div className="hero-meta"><span>04 DAYS</span><span>03 CITIES</span><span>18 MAP NODES</span></div>
        <a className="neon-button" href="#map">ENTER MAP <b>↘</b></a>
      </header>

      <section className="route-strip">
        {days.map((day, index) => <button type="button" onClick={() => showDay(index)} key={day.date}><small>{day.date}</small><strong>{day.city}</strong><span>{day.title}</span></button>)}
      </section>

      <aside className="alert section-shell">
        <span>SYS.WARNING</span>
        <strong>09.26—09.27 仍在中秋假期内</strong>
        <p>动车票、住宿与热门点位按高峰处理；火炬八街早到，返青动车优先。</p>
        <a href="https://big5.www.gov.cn/gate/big5/www.gov.cn/gongbao/2025/issue_12406/202511/content_7048922.html" target="_blank" rel="noreferrer">官方通知 ↗</a>
      </aside>

      <section className="section-shell map-section" id="map">
        <div className="section-head"><div><span>01</span><small>AMAP ROUTE</small><h2>点位地图</h2></div><p>地图内支持鼠标滚轮、双击和移动端双指缩放。</p></div>
        <div className="tabs" role="group" aria-label="按日期筛选地图">
          {filters.map((filter) => <button type="button" key={String(filter.value)} className={activeDay === filter.value ? "active" : ""} onClick={() => setActiveDay(filter.value)}>{filter.label}</button>)}
        </div>
        <div className="map-grid cyber-panel">
          <aside className="stop-panel">
            <header><small>{activeInfo?.date ?? "FULL ROUTE"}</small><h3>{activeInfo?.title ?? "三城总览"}</h3><p>{activeInfo?.summary ?? "切换日期，地图会聚焦当天动线。点击箭头可在高德地图继续导航。"}</p></header>
            <ol>{visibleStops.map((stop) => <li key={stop.id} style={{ "--accent": `var(--day-${stop.day})` } as CSSProperties}><b>{stop.order}</b><div><small>{stop.time} // {stop.city}</small><strong>{stop.name}</strong><p>{stop.note}</p></div><a href={amapUrl(stop)} target="_blank" rel="noreferrer">↗</a></li>)}</ol>
          </aside>
          <TravelMap stops={stops} activeDay={activeDay} />
        </div>
      </section>

      <section className="section-shell plan-section" id="plan">
        <div className="section-head"><div><span>02</span><small>DAY BY DAY</small><h2>四日计划</h2></div><p>时间是节奏参考。排队过长时，保住动车和换城。</p></div>
        <div className="day-grid">{days.map((day, index) => <article className="cyber-panel" key={day.date}><header><b>{day.label}</b><small>{day.date} // {day.city}</small></header><h3>{day.title}</h3><p>{day.summary}</p><ol>{day.schedule.map((item) => <li key={item}>{item}</li>)}</ol><footer><span>{day.stay}</span><button type="button" onClick={() => showDay(index)}>MAP ↗</button></footer></article>)}</div>
      </section>

      <section className="book-section" id="book">
        <div className="section-shell">
          <div className="section-head light"><div><span>03</span><small>MISSION QUEUE</small><h2>预订清单</h2></div><p>只留影响成行的项目。</p></div>
          <div className="book-grid">
            <article><small>PRIORITY 01</small><h3>三段动车</h3><p>9/26 青岛北→烟台<br />9/27 烟台→威海<br />9/27 威海→青岛北，18点后</p><a href="https://www.12306.cn/" target="_blank" rel="noreferrer">12306 ↗</a></article>
            <article><small>PRIORITY 02</small><h3>两处住宿</h3><p>9/26 烟台站 / 朝阳街<br />9/27—28 青岛老城 / 五四广场</p><span>选可取消房型</span></article>
            <article><small>CHECK 48H</small><h3>临行复核</h3><p>天气与海风<br />动车到发站<br />场馆开放公告<br />威海站行李寄存</p><a href="https://www.tsingtaomuseum.com/" target="_blank" rel="noreferrer">场馆官网 ↗</a></article>
          </div>
        </div>
      </section>

      <section className="section-shell city-notes">
        <div><small>QINGDAO</small><strong>鲅鱼水饺 · 辣炒蛤蜊 · 袋装鲜啤</strong></div>
        <div><small>YANTAI</small><strong>蓬莱小面 · 海肠捞饭 · 焖子</strong></div>
        <div><small>WEIHAI</small><strong>海鲜疙瘩汤 · 韩式料理 · 无花果</strong></div>
      </section>

      <footer className="footer">
        <div><strong>青烟威//海岸线</strong><span>2026.09.26—09.29</span></div>
        <p>点位：高德 MCP + 高德地图底图</p>
        <div className="footer-links"><a href="https://app.notion.com/p/dflands/3b7529bc43e380498ce2d170164a27e4" target="_blank" rel="noreferrer">NOTION ↗</a><a href="https://hzfw.12306.cn/zgzfw/resources/h5/ysqcx-h5.html" target="_blank" rel="noreferrer">12306 ↗</a><a href="#top">TOP ↑</a></div>
      </footer>
    </main>
  );
}
