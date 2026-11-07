import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import type { MapPlace } from "../src/map/types";
import "../src/styles.css";

// Deliberately fail the actual SDK style request; the component has no test-only API.
const failureMode = new URLSearchParams(location.search).has("fail");
if (failureMode) {
  const realFetch = window.fetch;
  window.fetch = (input, init) => {
    const url = input instanceof Request ? input.url : String(input);
    return url.startsWith("https://tiles.openfreemap.org/")
      ? Promise.reject(new TypeError("Fixture: map network unavailable"))
      : realFetch(input, init);
  };
}
const { OpenFreeMap } = await import("../src/OpenFreeMap");

const points: MapPlace[] = [
  { id: "sapporo", name: "札幌", coord: [141.3545, 43.0618], markerLabel: "1", markerColor: "#36594a", meta: "北海道 · 城市参考位置", note: "示例点位，用于检查标记和弹窗。", url: "https://www.sapporo.travel/", linkLabel: "札幌旅游官网 ↗" },
  { id: "otaru", name: "小樽", coord: [140.9947, 43.1907], markerLabel: "2", markerColor: "#985229", note: "切换到此点后，地图应居中并显示小樽详情。" },
  { id: "hakodate", name: "函馆", coord: [140.7291, 41.7687], markerLabel: "3", markerColor: "#3f6594", note: "用于检查远距离选点和全图取景。" },
];

function Demo() {
  const [places, setPlaces] = useState(points);
  const [focus, setFocus] = useState<string | null>(null);
  const [mounted, setMounted] = useState(true);
  const [controlled, setControlled] = useState(true);
  const [results, setResults] = useState("等待检查");
  const [running, setRunning] = useState(false);
  const [selections, setSelections] = useState(0);
  function select(id: string) { setFocus(id); setSelections(value => value + 1); }

  async function runChecks() {
    setRunning(true);
    const passed: string[] = [];
    const check = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
    const waitFor = async (predicate: () => boolean, timeout = 25000) => {
      const start = performance.now();
      while (!predicate()) {
        if (performance.now() - start > timeout) throw new Error("等待地图超时");
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      // Allow React effects and the SDK's marker render frame to settle.
      await new Promise(resolve => setTimeout(resolve, 150));
    };
    const mark = (name: string) => { passed.push(`PASS ${name}`); setResults(passed.join("\n")); };
    const marker = (name: string) => document.querySelector<HTMLButtonElement>(`.openfreemap-marker[aria-label="选择${name}"]`);
    const popupName = () => document.querySelector(".openfreemap-popup strong")?.textContent;
    const centered = (name: string) => {
      const pin = marker(name)?.getBoundingClientRect();
      const view = document.querySelector(".openfreemap-canvas")?.getBoundingClientRect();
      return !!pin && !!view && Math.abs(pin.x + pin.width / 2 - view.x - view.width / 2) < 3 && Math.abs(pin.y + pin.height / 2 - view.y - view.height / 2) < 3;
    };
    try {
      setMounted(true); setControlled(true); setPlaces(points); setFocus(null);
      if (failureMode) {
        await waitFor(() => !!document.querySelector(".openfreemap-status button"));
        check(document.querySelector("details")?.open, "失败时应展开地点列表");
        check(document.querySelectorAll(".openfreemap-places li").length === 3, "失败时地点仍应可读");
        mark("真实 SDK 网络失败提示与地点降级");
        document.querySelector<HTMLButtonElement>(".openfreemap-status button")?.click();
        await waitFor(() => !!document.querySelector(".openfreemap-status button"));
        check(document.querySelectorAll("canvas").length === 1, "重试留下了重复 canvas");
        mark("失败重试不会重复地图实例");
        return;
      }
      await waitFor(() => !document.querySelector(".openfreemap-status") && !!marker("函馆"));
      check(document.querySelectorAll(".openfreemap-marker").length === 3, "标记数量错误");
      check(marker("札幌")?.textContent === "1" && marker("函馆")?.style.backgroundColor === "rgb(63, 101, 148)", "自定义标记内容/颜色错误");
      check(!!document.querySelector(".maplibregl-ctrl-attrib a[href*='openstreetmap']"), "缺少底图署名");
      mark("真实底图加载、三个标记、颜色及署名");

      setFocus("hakodate");
      await waitFor(() => popupName() === "函馆" && centered("函馆"));
      await new Promise(resolve => setTimeout(resolve, 400));
      check(centered("函馆"), "初始取景覆盖了首次选点");
      mark("首次列表选点最终居中");
      const keyboardTarget = marker("小樽");
      keyboardTarget?.focus();
      keyboardTarget?.click();
      await waitFor(() => popupName() === "小樽" && centered("小樽"));
      check(document.activeElement === keyboardTarget, "选点更新后键盘焦点丢失");
      mark("跨地点标记选择与父组件联动");
      document.querySelector<HTMLButtonElement>(".maplibregl-popup-close-button")?.click();
      marker("小樽")?.click();
      await waitFor(() => popupName() === "小樽");
      mark("重复点击重开详情");
      setFocus(null);
      await waitFor(() => !popupName());
      marker("札幌")?.click();
      await waitFor(() => popupName() === "札幌" && centered("札幌"));
      mark("全图后选点不被旧动画覆盖");

      setPlaces([points[2]]);
      await waitFor(() => document.querySelectorAll(".openfreemap-marker").length === 1 && !popupName());
      check(centered("函馆"), "单点默认视图未居中");
      mark("筛选移除旧标记和旧弹窗、单点取景");
      setPlaces([]);
      await waitFor(() => !document.querySelector(".openfreemap-marker"));
      check(!popupName() && document.querySelector(".openfreemap-places")?.textContent?.includes("暂无地点"), "空数据未清理");
      mark("空数组不残留覆盖物");

      setPlaces([{ ...points[0], name: "<b>文本地点</b>", note: '<img src=x onerror="alert(1)">', url: "javascript:alert(1)" }]);
      setFocus("sapporo");
      await waitFor(() => popupName() === "<b>文本地点</b>");
      check(!document.querySelector(".openfreemap-popup img, .openfreemap-popup b, .openfreemap-popup a, .openfreemap-places a"), "危险 HTML/链接未过滤");
      mark("详情按文本渲染并拒绝非 HTTP(S) 外链");

      setControlled(false); setPlaces(points); setFocus(null);
      await waitFor(() => document.querySelectorAll(".openfreemap-marker").length === 3 && !popupName());
      marker("函馆")?.click();
      await waitFor(() => popupName() === "函馆" && centered("函馆"));
      mark("无回调模式可直接定位和开窗");
      setMounted(false);
      await waitFor(() => !document.querySelector("canvas"));
      check(!document.querySelector(".maplibregl-popup"), "卸载残留弹窗");
      setControlled(true); setPlaces([points[1]]); setFocus("otaru"); setMounted(true);
      await waitFor(() => popupName() === "小樽" && centered("小樽"));
      check(document.querySelectorAll("canvas").length === 1, "重挂留下了重复 canvas");
      mark("StrictMode 卸载重挂与单点预选");
      setPlaces(points); setFocus(null);
    } catch (error) {
      setResults([...passed, `FAIL ${error instanceof Error ? error.message : String(error)}`].join("\n"));
    } finally {
      setRunning(false);
    }
  }

  return <>
    <div className="toolbar">
      {points.map(point => <button key={point.id} disabled={running} onClick={() => setFocus(point.id)}>选择{point.name}</button>)}
      <button disabled={running} onClick={() => { setFocus(null); setPlaces(points); }}>查看全图</button>
      <button disabled={running} onClick={() => { setFocus(null); setPlaces([points[0]]); }}>单点</button>
      <button disabled={running} onClick={() => { setFocus(null); setPlaces([]); }}>空数据</button>
      <button disabled={running} onClick={() => setMounted(value => !value)}>{mounted ? "卸载地图" : "挂载地图"}</button>
      <a href={failureMode ? "?" : "?fail=1"}>{failureMode ? "正常网络演示" : "网络失败演示"}</a>
    </div>
    <p aria-live="polite">当前选择：{focus ?? "全部"} · 标记选择回调：{selections}</p>
    {mounted && <OpenFreeMap places={places} label="北海道示例地点地图" focusPlaceId={focus} onSelectPlace={controlled ? select : undefined} />}
    <div className="toolbar"><button disabled={running} onClick={runChecks}>{running ? "检查中…" : "运行回归检查"}</button></div>
    <pre aria-live="polite">{results}</pre>
  </>;
}

const root = createRoot(document.getElementById("root")!);
root.render(<StrictMode><Demo /></StrictMode>);
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
