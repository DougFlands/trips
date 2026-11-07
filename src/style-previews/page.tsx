import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import "./styles.css";

type Preview = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cities: string[];
  accent: string;
  surface: string;
  tone: string;
};

const previews: Preview[] = [
  {
    id: "snowfield",
    eyebrow: "01 / SNOWFIELD EDITORIAL",
    title: "北海道，去看一场慢一点的雪",
    description: "像一本冬季旅行杂志：大留白、雪地照片、清晰的路线层级。",
    cities: ["札幌", "小樽", "函馆"],
    accent: "雪原编辑风",
    surface: "雪白 · 冰蓝 · 深海蓝 · 朱砂红",
    tone: "安静、清爽、适合长文攻略",
  },
  {
    id: "railway",
    eyebrow: "02 / RAILWAY HANDBOOK",
    title: "沿着雪国铁路，慢慢向北",
    description: "像一张 JR 旅行手册：站点、转场和时间线是页面主角。",
    cities: ["札幌", "函馆", "小樽"],
    accent: "铁路手册风",
    surface: "纸张白 · 铁路蓝 · 站点橙",
    tone: "实用、路线感强、适合交通信息",
  },
  {
    id: "lodge",
    eyebrow: "03 / WINTER LODGE",
    title: "雪落下来，回旅馆喝一杯热茶",
    description: "像温泉旅馆的冬季手册：米白、木色和松针绿，节奏更松。",
    cities: ["函馆", "札幌", "小樽"],
    accent: "雪国旅馆风",
    surface: "米白 · 木棕 · 松针绿",
    tone: "温暖、慢旅行、适合轻松行程",
  },
  {
    id: "postcard",
    eyebrow: "04 / WINTER POSTCARD",
    title: "寄一张来自小樽的雪景明信片",
    description: "像日本冬季明信片：纸张、邮戳、靛蓝和一处朱红。",
    cities: ["小樽", "札幌", "函馆"],
    accent: "冬季明信片风",
    surface: "明信片白 · 靛蓝 · 淡樱粉",
    tone: "轻复古、照片感强、适合视觉叙事",
  },
  {
    id: "map",
    eyebrow: "05 / ICE MAP",
    title: "把雪地路线，变成一张好用的地图",
    description: "像冰蓝色旅行工具：地图、状态、进度和天气提醒优先。",
    cities: ["札幌", "小樽", "函馆"],
    accent: "冰蓝地图风",
    surface: "冰川蓝 · 天空蓝 · 深蓝",
    tone: "轻户外、工具感、适合交互信息",
  },
];

function PreviewPanel({ preview }: { preview: Preview }) {
  return (
    <div className={`style-preview style-preview--${preview.id}`}>
      <div className="preview-shell">
        <div className="preview-topbar">
          <span className="preview-mark">✦</span>
          <span>HOKKAIDO / WINTER GUIDE</span>
          <span className="preview-topbar__date">2027.01 — 02</span>
        </div>

        <section className="preview-hero">
          <div>
            <p className="preview-eyebrow">{preview.eyebrow}</p>
            <h2>{preview.title}</h2>
            <p className="preview-lede">{preview.description}</p>
            <div className="preview-badges">
              {preview.cities.map((city) => <Badge key={city} variant="outline">{city}</Badge>)}
              <Badge className="preview-accent-badge">{preview.accent}</Badge>
            </div>
          </div>
          <div className="preview-hero-art" aria-label="雪山与城市的抽象插画">
            <span className="preview-sun" />
            <span className="preview-mountain preview-mountain--back" />
            <span className="preview-mountain preview-mountain--front" />
            <span className="preview-village"><i /><i /><i /><i /></span>
          </div>
        </section>

        <div className="preview-grid">
          <Card className="preview-card preview-card--route">
            <CardHeader>
              <p className="preview-card-kicker">TODAY / 01.31</p>
              <CardTitle>函馆海湾与坡道</CardTitle>
              <CardDescription>10:00 — 21:00 · 不赶景点</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="preview-route-line">
                <span>函馆站</span><b>→</b><span>红砖仓库</span><b>→</b><span>八幡坂</span>
              </div>
              <div className="preview-progress"><span /></div>
              <p className="preview-muted">天气好再上函馆山，晚饭后回酒店休息。</p>
            </CardContent>
          </Card>

          <Card className="preview-card preview-card--spot">
            <CardHeader>
              <p className="preview-card-kicker">RECOMMENDED</p>
              <CardTitle>小樽运河</CardTitle>
              <CardDescription>傍晚灯亮后更值得停留</CardDescription>
            </CardHeader>
            <CardContent className="preview-spot-content">
              <span className="preview-spot-icon">❄</span>
              <div><strong>推荐度 4.8</strong><p className="preview-muted">步行 · 低门槛 · 适合拍照</p></div>
            </CardContent>
          </Card>
        </div>

        <Card className="preview-card preview-card--accordion">
          <CardHeader>
            <CardTitle>冬季提醒</CardTitle>
            <CardDescription>只保留会影响决策的信息</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue="weather">
              <AccordionItem value="weather">
                <AccordionTrigger>大雪时怎么改</AccordionTrigger>
                <AccordionContent>取消远郊点，保留车站附近和室内景点。每天只留一个天气敏感点。</AccordionContent>
              </AccordionItem>
              <AccordionItem value="shoes">
                <AccordionTrigger>穿什么走路</AccordionTrigger>
                <AccordionContent>防水、防滑鞋优先，山顶和海边另加帽子、手套与围巾。</AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="preview-meta-row">
          <span>配色：{preview.surface}</span>
          <span>气质：{preview.tone}</span>
        </div>
      </div>
    </div>
  );
}

export default function StylePreviewsPage() {
  return (
    <main className="style-previews-page">
      <div className="style-previews-intro">
        <p className="preview-eyebrow">HOKKAIDO / STYLE LAB</p>
        <h1>北海道冬季页面预览</h1>
        <p>同一份旅行内容，切换五种视觉语言。选定后再进入正式页面开发。</p>
      </div>
      <Tabs defaultValue={previews[0].id} className="style-previews-tabs">
        <TabsList variant="line" aria-label="北海道页面风格">
          {previews.map((preview) => <TabsTrigger key={preview.id} value={preview.id}>{preview.accent}</TabsTrigger>)}
        </TabsList>
        {previews.map((preview) => (
          <TabsContent key={preview.id} value={preview.id}>
            <PreviewPanel preview={preview} />
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}
