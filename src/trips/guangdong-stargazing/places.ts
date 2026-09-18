import { distanceKm, wgs84ToGcj02, type Coordinate } from "../../lib/coordinates";
import type { MapPlace } from "../../TravelMap";

export type Source = { title: string; url: string; date: string };
export type PollutionReading = {
  min: number; max: number; sqm: number; year: number; checkedAt: string;
  sampledCoordinates: Coordinate; coordinateSystem: "WGS84" | "腾讯地图显示坐标";
  matchedLocation: string; searchQuery?: string;
};
export type PollutionSource = "lightPollution" | "tianwentong";
export const pollutionCheckedAt = "2026-09-14";
export type StargazingPlace = {
  id: string;
  name: string;
  city: string;
  district: string;
  terrain: string;
  wgs84: Coordinate;
  precision: string;
  coordinateUrl: string;
  summary: string;
  access: string;
  nightAccess: string;
  caution: string;
  sources: Source[];
  lightPollution: PollutionReading | null;
  tianwentong: PollutionReading | null;
  mapUrl: string;
};
export const checkedAt = "2026-09-08";
export const shenzhenOrigin: Coordinate = [114.0545223, 22.5463725];
const note = (id: string, title: string, date: string): Source => ({ title, date, url: `https://www.xiaohongshu.com/explore/${id}` });
const searchMap = (name: string, city: string) => `https://uri.amap.com/search?${new URLSearchParams({ keyword: name, city, view: "map", src: "travel-guides" })}`;

export const places: StargazingPlace[] = [
  {
    id: "xichong", name: "西涌新屋 · P9绿道", city: "深圳", district: "大鹏新区", terrain: "海边绿道",
    wgs84: [114.5419908, 22.4893432], precision: "新屋村落区域参考，非P9停车位或精确绿道机位。",
    coordinateUrl: "https://www.openstreetmap.org/way/406422714",
    summary: "实拍作者在P9附近绿道，用地形遮挡海面渔船灯；适合从深圳出发的短途拍摄。",
    access: "高德已核准西涌旅游度假区P9停车场，位于新屋村68号附近。帖子图示停车场南侧萤火虫绿道、北侧后山绿道。",
    nightAccess: "公共绿道的夜间管理仍需出发前核对。四号沙滩礁石区夜间不让进，不列为机位。",
    caution: "渔船灯随夜晚变化；不能从这里推断天文台本体可自由夜入。",
    sources: [note("6a5b3d160000000022018964", "爱拍照的Flora · 西涌躲渔灯拍摄，含位置攻略", "页面显示07-18")],
    lightPollution: {"min":5.5,"max":5.5,"sqm":19.95,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[114.5419908,22.4893432],"coordinateSystem":"WGS84","matchedLocation":"Dapeng New District, Longgang District, Guangdong"},
    tianwentong: {"min":5.4,"max":5.4,"sqm":20.08,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[114.5402,22.4833],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省深圳市龙岗区南澳街道西涌海滩旅游景区（新屋附近）","searchQuery":"深圳 西涌海滩"}, mapUrl: "https://www.amap.com/ssr/place/B0LBPURDSO",
  },
  {
    id: "baipenzhu", name: "白盆珠水库", city: "惠州", district: "惠东县", terrain: "湖畔",
    wgs84: [115.1402315, 23.1308393], precision: "水库区域中心，仅作距离、天气与暗空参考，不是岸边机位。",
    coordinateUrl: "https://www.openstreetmap.org/relation/546399",
    summary: "三位作者提供银河实拍。开阔水面适合前景构图，低云散开后的拍摄窗口尤其关键。",
    access: "作者报告全程铺装路、轿车可达。Lin图4指向新庵酒厂以西的路口停车，再步行到对侧；精确停车位置仍须对照原帖。",
    nightAccess: "2025年有通宵拍摄经历，当前水源保护、岸线和夜间通行规定待确认。地图链接搜索新庵酒厂集合地名。",
    caution: "水边湿气重、蚊虫多。热门流星雨夜的车灯和照明可能明显干扰拍摄，不下水。",
    sources: [note("688649ee00000000170378b0", "菜心 · 惠州白盆珠观星实拍", "2025-07-27"), note("68840d960000000012023cd0", "Vida · 7.25白盆珠追星攻略", "2025-07-26"), note("6882543a000000001502229d", "Lin · 白盆珠机位与停车示意图", "2025-07-25")],
    lightPollution: {"min":4.5,"max":4.5,"sqm":21.1,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[115.1402315,23.1308393],"coordinateSystem":"WGS84","matchedLocation":"Huizhou, Guangdong"},
    tianwentong: {"min":4.5,"max":4.5,"sqm":21.1,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[115.1932,23.1391],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省惠州市惠东县白盆珠镇白盆珠水库","searchQuery":"白盆珠水库"}, mapUrl: searchMap("惠东县新庵酒厂", "惠州"),
  },
  {
    id: "bajieshan", name: "八界山", city: "清远", district: "阳山县 · 黎埠镇", terrain: "风车山",
    wgs84: [112.51889044, 24.66306677], precision: "百度山峰POI转换为WGS84，约500米区域参考，非具体风车或停车点。",
    coordinateUrl: "https://map.baidu.com/poi/八界山?uid=14076dee41974ff702294f02",
    summary: "作者在月落、厚云散去后拍到银河。山上机位较多，风车与山脊可作前景。",
    access: "2025年作者报告无需爬山、可驾车上山，并称可过夜。出发前另核对道路与车辆通行。",
    nightAccess: "仅有历史露营经验，现行夜间管理待确认。",
    caution: "强风、无厕所；风机附近需避开设施作业范围。不要沿用评论中互相矛盾的光污染等级。",
    sources: [note("686a2b22000000001203cbff", "Sun的光影手记 · 清远八界山银河实拍", "2025-07-06")],
    lightPollution: {"min":3.9,"max":3.9,"sqm":21.71,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[112.51889044,24.66306677],"coordinateSystem":"WGS84","matchedLocation":"Qingyuan City, Guangdong"},
    tianwentong: {"min":4,"max":4,"sqm":21.69,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[112.5261,24.6519],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省清远市阳山县小江镇八界山","searchQuery":"八界山"}, mapUrl: searchMap("八界山 阳山县黎埠镇", "清远"),
  },
  {
    id: "yanluotou", name: "阎罗头", city: "韶关", district: "乳源 · 大布镇", terrain: "高山草甸",
    wgs84: [113.176271, 24.5032891], precision: "OSM山峰节点，非登山入口或营地。",
    coordinateUrl: "https://www.openstreetmap.org/node/12757264549",
    summary: "平缓草甸、开阔天空，适合有经验的徒步摄影者安排山顶观星。",
    access: "作者明确不能开车直达，需走较长徒步环线。应在天亮时完成路线辨认。",
    nightAccess: "夜间进入与露营许可尚未核准，需先确认管理要求。",
    caution: "凌晨易起薄雾，山顶强风、温差大。帖子固定银河时刻表有争议，未采用。",
    sources: [note("6a5d653e000000000c015014", "小企鹅cunning · 韶关两座山顶银河", "页面显示07-20")],
    lightPollution: {"min":4,"max":4,"sqm":21.64,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[113.176271,24.5032891],"coordinateSystem":"WGS84","matchedLocation":"Dabu Town, Guangdong, Ruyuan Yao Autonomous County"},
    tianwentong: {"min":4,"max":4,"sqm":21.65,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[113.1823,24.5001],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省韶关市乳源瑶族自治县大布镇阎罗头","searchQuery":"阎罗头"}, mapUrl: searchMap("阎罗头 乳源大布镇", "韶关"),
  },
  {
    id: "nanshui", name: "南水湖", city: "韶关", district: "乳源", terrain: "湖畔",
    wgs84: [113.1822252, 24.8006821], precision: "水库区域中心，非驿站、道路或岸边机位。",
    coordinateUrl: "https://www.openstreetmap.org/relation/1903196",
    summary: "实拍作者记录在车旁观赏银河。湖面与连山构成前景，适合先确认合法临停位置再出发。",
    access: "作者称从乳源出发约20分钟，评论两次说明不是山路；具体导航只称无名路，未确认驿站位置。",
    nightAccess: "当前湿地保护、岸线与夜间停车规定待确认。地图链接查找湿地公园区域。",
    caution: "不把区域中心当成道路终点。湖边湿气、低云和局部车灯会影响实际成片。",
    sources: [note("6a530dac000000000f01cb24", "韶关追星 · 南水湖银河实拍", "2026年采集，详情日期未完整显示")],
    lightPollution: {"min":4.1,"max":4.1,"sqm":21.6,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[113.1822252,24.8006821],"coordinateSystem":"WGS84","matchedLocation":"Dongping Town, Guangdong, Ruyuan Yao Autonomous County"},
    tianwentong: {"min":4.2,"max":4.2,"sqm":21.42,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[113.211,24.7816],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省韶关市乳源瑶族自治县东坪镇南水湖国家湿地公园","searchQuery":"南水湖"}, mapUrl: searchMap("南水湖国家湿地公园", "韶关"),
  },
  {
    id: "dinahai", name: "海陵岛 · 地拿海", city: "阳江", district: "海陵岛", terrain: "海岸礁石",
    wgs84: [111.9581731, 21.6107548], precision: "地拿海村落参考点，具体海边机位还需向海岸走一段。",
    coordinateUrl: "https://www.openstreetmap.org/node/4550932972",
    summary: "作者拍到从海平面升起的银河，灯塔、海浪与礁石可作前景。",
    access: "2022年作者自驾，到村落定位后再往海边开一小段；当前最后一段道路情况需另核实。",
    nightAccess: "夜间开放和海岸通行未核准；先确认潮汐、海浪与现场管理。",
    caution: "资料较旧，照片采用拼接。灯塔与渔灯有局部影响，蓝眼泪不保证出现。",
    sources: [note("62764a18000000002103bb80", "Nicola在海边 · 地拿海银河与蓝眼泪", "2022-08-05")],
    lightPollution: {"min":4.8,"max":4.8,"sqm":20.72,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[111.9581731,21.6107548],"coordinateSystem":"WGS84","matchedLocation":"Zhapo, Guangdong, Jiangcheng District"},
    tianwentong: {"min":4.6,"max":4.6,"sqm":20.97,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[111.9633,21.6081],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省阳江市江城区闸坡镇地拿海","searchQuery":"地拿海"}, mapUrl: searchMap("地拿海 海陵岛", "阳江"),
  },
  {
    id: "yangmeishan", name: "德庆大顶山 · 杨梅山", city: "肇庆", district: "德庆县 · 官圩镇", terrain: "风车山",
    wgs84: [111.867090001, 23.382709602], precision: "百度杨梅山山峰POI转换为WGS84，约500米区域参考，非18号风车。",
    coordinateUrl: "https://map.baidu.com/poi/杨梅山?uid=925c550fcb9f56b15a3ac878",
    summary: "两份攻略提到18号风车及18–19号路段的开阔视野，2026年仍有银河实拍。",
    access: "作者称山脚至山上约45分钟，左侧主峰为16–22号风车。风电场公司地址在山下，不能当山顶机位。",
    nightAccess: "2026-08作者称当时无夜间管制、轿车可上，仍须核对出发当日管理。",
    caution: "路况评价有分歧：雨季可能泥路和破损；路窄、会车少、弱信号、无厕所，夜间可能有木材货车。",
    sources: [note("69f93db9000000001a037b0c", "德庆大顶山攻略 · 风车编号与道路", "2026年采集"), note("6a7a6bb7000000003301cc0b", "大顶山18号风车实拍与通行回复", "2026-08-10 / 08-11")],
    lightPollution: {"min":4.1,"max":4.1,"sqm":21.54,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[111.867090001,23.382709602],"coordinateSystem":"WGS84","matchedLocation":"Zhaoqing City, Guangdong"},
    tianwentong: {"min":4.1,"max":4.1,"sqm":21.59,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[111.8725,23.3799],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省肇庆市德庆县官圩镇杨梅山","searchQuery":"肇庆 杨梅山"}, mapUrl: searchMap("杨梅山 德庆县官圩镇", "肇庆"),
  },
  {
    id: "shitanghai", name: "石塘海湾休闲园", city: "阳江", district: "海陵湾", terrain: "海滨园区",
    wgs84: [112.07934687, 21.78594474], precision: "百度园区POI转换为WGS84，区域参考，非园内机位。",
    coordinateUrl: "https://map.baidu.com/poi/石塘海湾休闲园?uid=03ffc157746dd2a836b06c18",
    summary: "实拍作者明确园名，并评价为勉强可拍银河。适合结合营业时间安排前半夜拍摄。",
    access: "地图POI已匹配。当前门票、停车与摄影安排需向园方确认。",
    nightAccess: "2026-09-08百度地图显示10:30–22:30，不默认可通宵，实际以园方当日通知为准。",
    caution: "园内照明可能干扰；银河质量仅为作者体验，未宣传为最暗地点。",
    sources: [note("66889062000000000d00fdf3", "按快门的毛毛先森 · 石塘海银河", "2025-10-11，回复2025-05-04")],
    lightPollution: {"min":5,"max":5,"sqm":20.52,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[112.07934687,21.78594474],"coordinateSystem":"WGS84","matchedLocation":"Guangdong, Yangdong District"},
    tianwentong: {"min":5.6,"max":5.6,"sqm":19.89,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[112.0611,21.82],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省阳江市阳东区雅韶镇石塘（园区附近村落）","searchQuery":"阳江 石塘"}, mapUrl: searchMap("石塘海湾休闲园", "阳江"),
  },
  // Expanded catalog from reviewed research.
  {
    "id": "apoliu",
    "name": "阿婆六 · 山顶观星台",
    "city": "广州",
    "district": "从化区 · 良口镇",
    "terrain": "山顶观星台",
    "wgs84": [
      113.8753474804382,
      23.693581997352727
    ],
    "precision": "阿婆六村POI区域参考，非山顶楼宇或预约入口；上山机位需对照原帖确认。",
    "coordinateUrl": "https://map.baidu.com/poi/阿婆六村?uid=b4857445ee2dc374a21de9ad",
    "summary": "作者在楼顶拍摄银河全景，环顾四周无遮挡；山顶三楼为观星台，适合预约后安排拍摄。",
    "access": "水泥陡坡山路可驾车上山，作者称山顶广场可停车。最后一段坡陡，底盘低车辆需谨慎。",
    "nightAccess": "作者2026年8月更新：不预约不给进场。需提前联系场地方确认观星台预约与夜间时段。",
    "caution": "村落坐标不等于山顶入口。现场有门禁报告；楼顶不用强手电，避免干扰其他摄影者。",
    "sources": [
      {
        "title": "银河守望者 · 广州从化亚婆六山银拱，银河全景拍摄分享",
        "url": "https://www.xiaohongshu.com/explore/68af3439000000001c03fed7",
        "date": "2025-08-26实拍；2026-08预约更新"
      }
    ],
    lightPollution: {"min":4.6,"max":4.6,"sqm":20.96,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[113.8753474804382,23.693581997352727],"coordinateSystem":"WGS84","matchedLocation":"Guangzhou City, Guangdong"},
    tianwentong: {"min":4.7,"max":4.7,"sqm":20.82,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[113.8664,23.7146],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省广州市从化区良口镇溪头村（阿婆六附近）","searchQuery":"广州 溪头村"},
    "mapUrl": "https://uri.amap.com/search?keyword=从化阿婆六村&city=广州&view=map"
  },
  {
    "id": "lianma",
    "name": "莲麻 · 黄沙坑附近路段",
    "city": "广州",
    "district": "从化区 · 吕田镇",
    "terrain": "村落道路",
    "wgs84": [
      113.97654155955121,
      23.894596456955046
    ],
    "precision": "黄沙坑革命遗址纪念馆POI参考；作者在到馆前约200米路段拍摄，非馆内或精确停车位。",
    "coordinateUrl": "https://map.baidu.com/poi/黄沙坑革命遗址纪念馆?uid=c9fbd14ca4d3c9bc4bcc4a73",
    "summary": "广州出发较方便的村落观星线索。作者明确黄沙坑纪念馆附近路段，并记录深夜观星经历。",
    "access": "作者称广州奥体出发约1.5小时，全程水泥路。导航纪念馆附近，再按现场规则选择允许停车的开阔位置。",
    "nightAccess": "作者有23点至凌晨观星经历；周边道路管理与停车规定待出发前确认，不表示纪念馆夜间开放。",
    "caution": "原帖光迹可能是飞机或卫星，不将该光迹认定为流星。路灯和来往车灯需现场避开，禁止妨碍道路通行。",
    "sources": [
      {
        "title": "有理想的华仔 · 从化莲麻追英仙座流星雨成功",
        "url": "https://www.xiaohongshu.com/explore/6a7d108b00000000060058a8",
        "date": "页面显示08-13"
      }
    ],
    lightPollution: {"min":4.4,"max":4.4,"sqm":21.23,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[113.97654155955121,23.894596456955046],"coordinateSystem":"WGS84","matchedLocation":"Guangzhou City, Guangdong"},
    tianwentong: {"min":4.3,"max":4.3,"sqm":21.29,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[113.9813,23.8924],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省广州市从化区吕田镇黄沙坑","searchQuery":"广州 黄沙坑"},
    "mapUrl": "https://uri.amap.com/search?keyword=黄沙坑革命遗址纪念馆&city=广州&view=map"
  },
  {
    "id": "wanshandao",
    "name": "万山岛",
    "city": "珠海",
    "district": "香洲区 · 万山镇",
    "terrain": "海岛",
    "wgs84": [
      113.72787317221226,
      21.941715417028004
    ],
    "precision": "大万山岛旅游POI区域参考，靠近万山村；非作者具体岸线或山顶机位。",
    "coordinateUrl": "https://map.baidu.com/poi/大万山岛?uid=0c1d9ec616579277bfa82246",
    "summary": "独立作者两次到访拍摄银河，2026年记录天气窗口与相机器材。岛屿适合结合住宿安排星空拍摄。",
    "access": "乘船上岛。作者报告香洲港至万山航线，票价与时刻以出发日为准；先安排夜拍后的住宿或返程。",
    "nightAccess": "百度岛屿POI显示全天，但不代表岛内每条步道和海岸均可夜入；具体岸线管理待确认。",
    "caution": "原帖未标精确机位。港口、村落和渔船照明局部较强；海岸需留意潮汐与风浪。",
    "sources": [
      {
        "title": "CN_Chenx晨夕 · 珠海星空银河肉眼可见｜万山岛夏夜星空",
        "url": "https://www.xiaohongshu.com/explore/6a775e97000000002403e00f",
        "date": "页面显示08-09"
      }
    ],
    lightPollution: {"min":5,"max":5,"sqm":20.46,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[113.72787317221226,21.941715417028004],"coordinateSystem":"WGS84","matchedLocation":"Zhuhai Wanshan Marine Development Experimental Zone, Xiangzhou, Guangdong"},
    tianwentong: {"min":5.1,"max":5.1,"sqm":20.42,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[113.7329,21.9391],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省珠海市香洲区万山镇大万山岛","searchQuery":"珠海 万山岛"},
    "mapUrl": "https://uri.amap.com/search?keyword=大万山岛&city=珠海&view=map"
  },
  {
    "id": "hengshiji",
    "name": "横石基沙滩",
    "city": "珠海",
    "district": "金湾区 · 三灶镇",
    "terrain": "沙滩",
    "wgs84": [
      113.30749496845486,
      22.00370544074695
    ],
    "precision": "沙滩POI区域参考，非精确相机位置或入口停车点。",
    "coordinateUrl": "https://map.baidu.com/poi/横石基沙滩?uid=09acb9fc9af063739e82ea2c",
    "summary": "作者2026年8月在机场旁沙滩拍到银河，给出曝光与堆栈参数；适合接受较强光污染的本地拍摄。",
    "access": "作者驾车抵达；地图匹配石基北路与587县道交叉口西南约620米的沙滩。停车与入口以现场规定为准。",
    "nightAccess": "地图POI显示全天，作者有晚上7–8点拍摄记录；恶劣天气或临时管制仍须核对。",
    "caution": "作者明确光污染严重、水汽重，肉眼仅淡银河；照片采用堆栈。留意潮汐，远离风浪和机场设施边界。",
    "sources": [
      {
        "title": "汗青 · 珠海橫石基沙滩银河20260809",
        "url": "https://www.xiaohongshu.com/explore/6a789e52000000002403cc0a",
        "date": "2026-08-09实拍；编辑于08-10"
      }
    ],
    lightPollution: {"min":6.3,"max":6.3,"sqm":19.35,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[113.30749496845486,22.00370544074695],"coordinateSystem":"WGS84","matchedLocation":"Zhuhai, Guangdong"},
    tianwentong: {"min":6.1,"max":6.1,"sqm":19.44,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[113.3121,22.0068],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"珠海横石基公交站（沙滩附近）","searchQuery":"珠海 横石基"},
    "mapUrl": "https://uri.amap.com/search?keyword=横石基沙滩&city=珠海&view=map"
  },
  {
    "id": "dongaodao",
    "name": "东澳岛 · 观景台",
    "city": "珠海",
    "district": "香洲区 · 万山镇",
    "terrain": "海岛观景台",
    "wgs84": [
      113.691260044139,
      22.02426030904554
    ],
    "precision": "百度地图岛内观景台POI参考；同岛有多处平台，原帖未给坐标，具体机位须对照原图确认。",
    "coordinateUrl": "https://map.baidu.com/poi/观景台?uid=dff9b08b89b7ce3b3517dca5",
    "summary": "作者在东澳岛观景平台使用智能望远镜拍摄猎户座和马头星云，给出曝光记录；主要作为深空拍摄线索。",
    "access": "香洲港乘船上岛，再步行爬升至平台。作者称离码头约1–2小时，需提前安排船班、住宿和负重路线。",
    "nightAccess": "地图POI显示全天，作者有夜间拍摄记录；平台临时管理与具体步道开放状态出发前确认。",
    "caution": "海岛风大、天气变化快，可能影响长曝光；原帖成果不等同肉眼银河效果。器材与电源携带规定向船公司确认。",
    "sources": [
      {
        "title": "小郑的观星日记 · 东澳岛观星记",
        "url": "https://www.xiaohongshu.com/explore/69996975000000002801daa2",
        "date": "页面显示编辑于02-21"
      }
    ],
    lightPollution: {"min":5.2,"max":5.2,"sqm":20.28,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[113.691260044139,22.02426030904554],"coordinateSystem":"WGS84","matchedLocation":"Zhuhai Wanshan Marine Development Experimental Zone, Xiangzhou, Guangdong"},
    tianwentong: {"min":5.1,"max":5.1,"sqm":20.34,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[113.712,22.0192],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省珠海市香洲区万山镇东澳岛","searchQuery":"珠海 东澳岛"},
    "mapUrl": "https://uri.amap.com/search?keyword=东澳岛观景台&city=珠海&view=map"
  },
  {
    "id": "xikeng",
    "name": "高明西坑水库 · 外围",
    "city": "佛山",
    "district": "高明区 · 杨和镇",
    "terrain": "水库外围",
    "wgs84": [
      112.72283830719715,
      22.71362420216038
    ],
    "precision": "西坑水库整体POI参考，非岸边精确机位；作者明确外围拍摄即可，不将水域坐标作步行终点。",
    "coordinateUrl": "https://map.baidu.com/poi/西坑水库?uid=8cba4bb0e7953a87ad045751",
    "summary": "作者给出佳能R62、16mm、F2.8、15秒实拍参数；水库外围可把湖面作前景，适合佛山本地星空拍摄。",
    "access": "作者导航佛山高明西坑水库，驾车在外围拍摄；现时停车范围与路段管理需现场核对。",
    "nightAccess": "作者有21点至凌晨2点拍摄记录，并在8月答复可车宿；此为历史到访经验，过夜与夜间开放按管理方现行规定。",
    "caution": "评论报告村灯照上堤围；天气与局部灯光影响明显。仅在允许开放的外围活动，远离水边和水利设施。",
    "sources": [
      {
        "title": "柒星系📷 · 谁还说佛山拍不了星空银河？",
        "url": "https://www.xiaohongshu.com/explore/6a533d6a000000001100544a",
        "date": "页面显示编辑于08-12"
      }
    ],
    lightPollution: {"min":5.2,"max":5.2,"sqm":20.28,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[112.72283830719715,22.71362420216038],"coordinateSystem":"WGS84","matchedLocation":"Foshan, Guangdong, Gaoming"},
    tianwentong: {"min":5.1,"max":5.1,"sqm":20.38,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[112.7274,22.7078],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省佛山市高明区杨和镇西坑水库","searchQuery":"佛山 西坑水库"},
    "mapUrl": "https://uri.amap.com/search?keyword=佛山高明西坑水库&city=佛山&view=map"
  },
  {
    "id": "dongchong-dapaitou",
    "name": "东涌大排头",
    "city": "深圳",
    "district": "大鹏新区 · 南澳街道",
    "terrain": "海边山坡",
    "wgs84": [
      114.5692043,
      22.4962212
    ],
    "precision": "东涌社区区域参考，约2公里范围，非山顶营地精确位置",
    "coordinateUrl": "https://www.openstreetmap.org/node/1551826397",
    "summary": "东涌海边高处开阔平地，有通宵星空与流星实拍。",
    "access": "导航东涌码头、天后宫附近停车，作者路线经桥上山约15–20分钟；须现场确认通行。",
    "nightAccess": "2025-08-13有通宵实拍，当前通行与扎营规则未核实。",
    "caution": "南向海面有渔船强光；山路、海风和夜间辨路需留意。",
    "sources": [
      {
        "title": "八月生 · 0813深圳东涌，我拍到了现实版梵高星空✨",
        "url": "https://www.xiaohongshu.com/explore/689d9d24000000001d02ecf9",
        "date": "2025-08-14"
      }
    ],
    lightPollution: {"min":5.4,"max":5.4,"sqm":20.06,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[114.5692043,22.4962212],"coordinateSystem":"WGS84","matchedLocation":"Nan’ao Sub-district, Dapeng New District, Longgang District, Guangdong"},
    tianwentong: {"min":5.2,"max":5.2,"sqm":20.27,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[114.5857,22.4898],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省深圳市龙岗区东涌海滩（大排头附近）","searchQuery":"深圳 东涌"},
    "mapUrl": "https://uri.amap.com/search?keyword=%E6%B7%B1%E5%9C%B3%E4%B8%9C%E6%B6%8C%E7%A0%81%E5%A4%B4&city=%E6%B7%B1%E5%9C%B3&view=map&src=travel-guides"
  },
  {
    "id": "xiaosanmen-island",
    "name": "小三门岛山顶",
    "city": "惠州",
    "district": "大亚湾经济技术开发区",
    "terrain": "海岛山顶",
    "wgs84": [
      114.645858,
      22.4393616
    ],
    "precision": "岛屿区域参考，约2公里范围，非山顶营地精确位置",
    "coordinateUrl": "https://www.openstreetmap.org/relation/11621562",
    "summary": "离岸海岛山顶视野无遮挡，有星空营地拍摄经历。",
    "access": "从深圳东涌码头乘船，下船沿路标上山；岛有饭店、小卖铺，船班与住宿需提前确认。",
    "nightAccess": "作者记录山顶露营；当前上岛、船班及营地规则未核实。",
    "caution": "需提前确认返程船、海况；照片效果强于作者描述的肉眼观感。",
    "sources": [
      {
        "title": "桑之落矣 · 深圳周边夏日小三门岛的星空营地，附攻略",
        "url": "https://www.xiaohongshu.com/explore/68886fbe0000000022021888",
        "date": "2025-07-29"
      }
    ],
    lightPollution: {"min":5,"max":5,"sqm":20.52,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[114.645858,22.4393616],"coordinateSystem":"WGS84","matchedLocation":"Huizhou, Guangdong"},
    tianwentong: {"min":4.9,"max":4.9,"sqm":20.58,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[114.6499,22.4362],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省惠州市惠阳区澳头街道小三门岛","searchQuery":"小三门岛"},
    "mapUrl": "https://uri.amap.com/search?keyword=%E6%83%A0%E5%B7%9E%E5%B0%8F%E4%B8%89%E9%97%A8%E5%B2%9B&city=%E6%83%A0%E5%B7%9E&view=map&src=travel-guides"
  },
  {
    "id": "wanlvhu",
    "name": "万绿湖",
    "city": "河源",
    "district": "东源县",
    "terrain": "湖中岛屿",
    "wgs84": [
      114.5382303,
      23.9158553
    ],
    "precision": "新丰江水库湖区中心，约45公里湖区范围；具体岛屿不详，非登岸点或导航终点。",
    "coordinateUrl": "https://www.openstreetmap.org/relation/397886",
    "summary": "作者记录万绿湖岛上露营与银河实拍，确认拍摄当晚肉眼可见银河。适合把湖区作为进一步选机位的方向。",
    "access": "作者划行至湖中岛，未公开岛名、入水点或陆路通道。出发前须落实具体营地和合规交通。",
    "nightAccess": "有岛上露营记录，当前水域、岛屿与夜间活动管理未核实。",
    "caution": "坐标只作湖区天气和距离参考，湖区各岸光环境差异大；不据此安排夜间涉水。",
    "sources": [
      {
        "title": "不会发笔记的小林 · 银河｜万绿湖",
        "url": "https://www.xiaohongshu.com/explore/69ee21870000000038020cc0",
        "date": "页面显示04-26"
      }
    ],
    lightPollution: {"min":4.2,"max":4.2,"sqm":21.44,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[114.5382303,23.9158553],"coordinateSystem":"WGS84","matchedLocation":"Guangdong, Dongyuan County"},
    tianwentong: {"min":4.2,"max":4.2,"sqm":21.39,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[114.4587,23.9271],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省河源市东源县锡场镇（万绿湖中部湖岸）","searchQuery":"河源 锡场镇"},
    "mapUrl": "https://uri.amap.com/search?keyword=%E4%B8%87%E7%BB%BF%E6%B9%96&city=%E6%B2%B3%E6%BA%90&view=map&src=travel-guides"
  },
  {
    "id": "huidong-dananshan",
    "name": "惠东大南山",
    "city": "惠州",
    "district": "惠东县",
    "terrain": "山峰草甸",
    "wgs84": [
      114.925814,
      22.9236604
    ],
    "precision": "OSM惠东大南山山峰节点，非登山入口、停车位置或作者具体机位。",
    "coordinateUrl": "https://www.openstreetmap.org/node/6237956369",
    "summary": "作者凌晨登山时看到流星和清晰的北斗七星，山顶视野开阔，适合有经验的徒步者踩点。",
    "access": "需要登山，原帖未给具体起点和用时；须在白天确认路线、下撤方向与体力安排。",
    "nightAccess": "有历史凌晨登山观星经历，现行夜间登山及露营管理未核实。",
    "caution": "作者明确山上风很大、徒步累；勿与深圳同名大南山混淆，原帖拍摄日期早于发布日期。",
    "sources": [
      {
        "title": "木子 · 惠东大南山",
        "url": "https://www.xiaohongshu.com/explore/6996624c000000001b01c5df",
        "date": "页面显示02-19，拍摄早于发帖"
      }
    ],
    lightPollution: {"min":5,"max":5,"sqm":20.46,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[114.925814,22.9236604],"coordinateSystem":"WGS84","matchedLocation":"Huizhou, Guangdong"},
    tianwentong: {"min":5,"max":5,"sqm":20.47,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[114.9033,22.9184],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省惠州市惠东县平山街道大南山","searchQuery":"惠州 大南山"},
    "mapUrl": "https://uri.amap.com/search?keyword=%E6%83%A0%E4%B8%9C%E5%A4%A7%E5%8D%97%E5%B1%B1&city=%E6%83%A0%E5%B7%9E&view=map&src=travel-guides"
  },
  {
    "id": "fenghuang-tianchi",
    "name": "凤凰山天池",
    "city": "潮州",
    "district": "潮安区 · 凤凰镇",
    "terrain": "高山湖泊",
    "wgs84": [
      116.6444499,
      23.9569456
    ],
    "precision": "OSM天池湖泊区域中心，约300米范围，非售票处、停车点或湖畔具体机位。",
    "coordinateUrl": "https://www.openstreetmap.org/way/310758870",
    "summary": "作者在夜半雾散后拍到星空、云海与月落，天池景观适合作前景；可拍窗口很依赖云雾变化。",
    "access": "作者称自驾到售票处停车，再爬约半小时至山顶。现行门票、索道与上下山安排需向景区确认。",
    "nightAccess": "作者记录山顶露营和夜半拍摄，当前夜间进入及露营规定未核实。",
    "caution": "容易起雾、局部光污染偏高；作者当晚肉眼看不见银河，照片不代表肉眼观感。",
    "sources": [
      {
        "title": "菜箱子📸 · 凤凰天池星空云海美爆了！",
        "url": "https://www.xiaohongshu.com/explore/6a623b30000000001003c1ff",
        "date": "页面显示07-24"
      }
    ],
    lightPollution: {"min":4.6,"max":4.6,"sqm":20.98,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[116.6444499,23.9569456],"coordinateSystem":"WGS84","matchedLocation":"Chaozhou, Guangdong"},
    tianwentong: {"min":4.5,"max":4.5,"sqm":21.04,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[116.6484,23.9535],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省潮州市潮安区凤凰镇凤凰山天池","searchQuery":"凤凰山天池"},
    "mapUrl": "https://uri.amap.com/search?keyword=%E5%87%A4%E5%87%B0%E5%B1%B1%E5%A4%A9%E6%B1%A0&city=%E6%BD%AE%E5%B7%9E&view=map&src=travel-guides"
  },
  {
    "id": "lanping",
    "name": "蓝坪村",
    "city": "惠州",
    "district": "博罗县 · 公庄镇",
    "terrain": "溪谷营地",
    "wgs84": [
      114.42013288350054,
      23.61106310352625
    ],
    "precision": "蓝坪村区域POI参考，非鸭麻輋营地或具体溪岸机位。",
    "coordinateUrl": "https://map.baidu.com/poi/蓝坪村?uid=4420764686f1ae6bdfee8b8c",
    "summary": "攻略封面明确博罗蓝坪村，含露营夜景；可以结合白天踩点安排星空拍摄。",
    "access": "作者称鸭麻輋露营地再往里有位置；具体路线标在原帖图中，未逐图核准。",
    "nightAccess": "作者07-15回复晚上可去，当前通行和露营规定待确认。",
    "caution": "溪谷遇降雨或上游来水不适合停留，夜间不能照搬溯溪路线；周末可能堵车。",
    "sources": [
      {
        "title": "张汉超📷 · ⛺️惠州蓝坪村星空露营溯溪最新攻略",
        "url": "https://www.xiaohongshu.com/explore/6a4798da00000000070258e5",
        "date": "07-03"
      }
    ],
    lightPollution: {"min":4.9,"max":4.9,"sqm":20.66,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[114.42013288350054,23.61106310352625],"coordinateSystem":"WGS84","matchedLocation":"Huizhou, Guangdong"},
    tianwentong: {"min":4.8,"max":4.8,"sqm":20.72,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[114.422,23.6098],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省惠州市博罗县公庄镇蓝坪村（第二条同名）","searchQuery":"惠州 蓝坪村"},
    "mapUrl": "https://uri.amap.com/search?keyword=%E8%93%9D%E5%9D%AA%E6%9D%91&city=%E6%83%A0%E5%B7%9E&view=map&src=travel-guides"
  },
  {
    "id": "fengchedao",
    "name": "汕尾风车岛",
    "city": "汕尾",
    "district": "城区",
    "terrain": "风车海岸",
    "wgs84": [
      115.57792891426051,
      22.739104134212287
    ],
    "precision": "汕尾风车岛旅游POI区域参考，未核原帖具体风机、岸线或停车点；不改称遮浪半岛。",
    "coordinateUrl": "https://map.baidu.com/poi/汕尾风车岛?uid=6a5b9f3fdb0bc12d7bb55c6a",
    "summary": "作者记录风车岛星空延时，远离市区的海岸环境有拍摄机会。",
    "access": "原帖未公开风车编号、具体岸段或停车点，需白天踩点并确认合法停留区域。",
    "nightAccess": "百度2026-09-08显示00:00–24:00，有历史夜间延时记录；不能推定所有岸段和风电场设施可夜入。",
    "caution": "作者说明月牙升起造成画面增亮；海面渔灯、强风与局部设施照明仍会影响拍摄。",
    "sources": [
      {
        "title": "momo😅 · 汕尾风车岛星空延时",
        "url": "https://www.xiaohongshu.com/explore/69b96b44000000001a030599",
        "date": "03-17"
      }
    ],
    lightPollution: {"min":5,"max":5,"sqm":20.53,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[115.57792891426051,22.739104134212287],"coordinateSystem":"WGS84","matchedLocation":"Chengqu, Guangdong"},
    tianwentong: {"min":4.9,"max":4.9,"sqm":20.63,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[115.5813,22.7393],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省汕尾市遮浪街道城区风车岛","searchQuery":"汕尾 风车岛"},
    "mapUrl": "https://uri.amap.com/search?keyword=%E6%B1%95%E5%B0%BE%E9%A3%8E%E8%BD%A6%E5%B2%9B&city=%E6%B1%95%E5%B0%BE&view=map&src=travel-guides"
  },
  {
    "id": "yezhuzhang",
    "name": "野猪嶂",
    "city": "河源",
    "district": "龙川县",
    "terrain": "风车山",
    "wgs84": [
      115.36755188314031,
      24.712275984989702
    ],
    "precision": "野猪嶂山峰POI参考，非车辆通行终点或具体风机平台。",
    "coordinateUrl": "https://map.baidu.com/poi/野猪嶂?uid=ef773a0f40941637230220a1",
    "summary": "作者于2025-07-26拍到银河，并回复肉眼可辨银河，但亮度弱于照片。",
    "access": "作者2025年称可直接开车到顶；有读者提及距顶约3公里路段可能拦车，需核对出发当日通行。",
    "nightAccess": "作者有夜间实拍经历，当前道路、风电场和露营管理尚未确认。",
    "caution": "不能把一次顺利驾车经历当成常态开放；山路夜间会车、强风及雾气需留意。",
    "sources": [
      {
        "title": "蓝枫 · 野猪嶂银河丨2025.7.26",
        "url": "https://www.xiaohongshu.com/explore/6887806b00000000170341f6",
        "date": "2025-07-28"
      }
    ],
    lightPollution: {"min":3.9,"max":3.9,"sqm":21.71,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[115.36755188314031,24.712275984989702],"coordinateSystem":"WGS84","matchedLocation":"Shangping, Guangdong, Longchuan County"},
    tianwentong: {"min":3.7,"max":3.7,"sqm":21.74,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[115.3734,24.7096],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省河源市龙川县上坪镇野猪嶂","searchQuery":"河源 野猪嶂"},
    "mapUrl": "https://uri.amap.com/search?keyword=%E9%87%8E%E7%8C%AA%E5%B6%82&city=%E6%B2%B3%E6%BA%90&view=map&src=travel-guides"
  },
  {
    "id": "moliugong",
    "name": "莫六公 · 横山水星空营地",
    "city": "清远",
    "district": "阳山县 · 大理村横山水",
    "terrain": "山顶营地",
    "wgs84": [
      112.77010752595838,
      24.37336205914406
    ],
    "precision": "百度营地POI转换为WGS84，区域参考；较高处繁星营地是另一营地，不混同。",
    "coordinateUrl": "https://map.baidu.com/poi/%E8%8E%AB%E5%85%AD%E5%85%AC%20%C2%B7%20%E6%A8%AA%E5%B1%B1%E6%B0%B4%E6%98%9F%E7%A9%BA%E8%90%A5%E5%9C%B0?uid=5bd5036536fa103888db7319",
    "summary": "到访作者确认银河照片在营地拍摄。喀斯特峰丛可作前景，有洗浴、水电等基本设施。",
    "access": "末段约2公里碎路，历史经验建议SUV；可预先联系营地主人安排付费接驳。周边手机信号差，先下载离线地图。",
    "nightAccess": "百度2026-09-08显示00:00–24:00；住宿、露营名额与车辆通行应提前向营地确认。",
    "caution": "营地外有散养牛；历史收费不当现价。更高处繁星营地单独经营，勿按名字相近默认是同一位置。",
    "sources": [
      {
        "title": "丁度的镜头 · 莫六公星空营地实拍与道路",
        "url": "https://www.xiaohongshu.com/explore/66b636d30000000005032b04",
        "date": "2024-08-09"
      }
    ],
    lightPollution: {"min":4,"max":4,"sqm":21.69,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[112.77010752595838,24.37336205914406],"coordinateSystem":"WGS84","matchedLocation":"Qingyuan City, Guangdong"},
    tianwentong: {"min":4,"max":4,"sqm":21.67,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[112.7743,24.3691],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省清远市阳山县阳城镇横山水","searchQuery":"横山水"},
    "mapUrl": "https://uri.amap.com/search?keyword=%E8%8E%AB%E5%85%AD%E5%85%AC+%C2%B7+%E6%A8%AA%E5%B1%B1%E6%B0%B4%E6%98%9F%E7%A9%BA%E8%90%A5%E5%9C%B0&city=%E6%B8%85%E8%BF%9C&view=map&src=travel-guides"
  },
  {
    "id": "taohuahu",
    "name": "清远桃花湖",
    "city": "清远",
    "district": "清新区 · 浸潭镇",
    "terrain": "湖畔",
    "wgs84": [
      112.69564660301981,
      24.09436276034079
    ],
    "precision": "百度桃源生态旅游区-桃花湖POI，湖区参考，非作者岸边机位或可夜入景区入口。",
    "coordinateUrl": "https://map.baidu.com/poi/%E6%B8%85%E8%BF%9C%E6%A1%83%E8%8A%B1%E6%B9%96?uid=755bf78bb451e84fc909f091",
    "summary": "作者用手机拍到银河，并提醒当地灯光明显，肉眼未见银河。适合结合湖畔住宿安排摄影。",
    "access": "作者称地图搜清远桃花湖可到水库；未给精确岸边落脚位置，应白天辨认可合法停留的公共位置。",
    "nightAccess": "旅游区POI显示09:00–18:00，不默认景区可夜入；作者水库旁午夜拍摄与住宿经历不能替代当前岸线管理。",
    "caution": "湖边风大，需要稳固三脚架和保暖；周边灯光会影响银河，勿将手机长曝光效果等同肉眼。",
    "sources": [
      {
        "title": "H.Y.K · 清远桃花湖手机银河实拍",
        "url": "https://www.xiaohongshu.com/explore/688434ed000000002203df0a",
        "date": "2025-07-26"
      }
    ],
    lightPollution: {"min":4.3,"max":4.3,"sqm":21.3,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[112.69564660301981,24.09436276034079],"coordinateSystem":"WGS84","matchedLocation":"Qingyuan City, Guangdong"},
    tianwentong: {"min":4.2,"max":4.2,"sqm":21.39,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[112.7173,24.088],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省清远市清新区浸潭镇桃花湖","searchQuery":"清远 桃花湖"},
    "mapUrl": "https://uri.amap.com/search?keyword=%E6%B8%85%E8%BF%9C%E6%A1%83%E8%8A%B1%E6%B9%96&city=%E6%B8%85%E8%BF%9C&view=map&src=travel-guides"
  },
  {
    "id": "shilipang",
    "name": "石离磅 · 石林周边",
    "city": "清远",
    "district": "阳山县",
    "terrain": "喀斯特石林",
    "wgs84": [
      112.76424440368307,
      24.832328934041023
    ],
    "precision": "百度石离磅村庄POI转换为WGS84，仅作石林区域参考，非具体岩石机位。",
    "coordinateUrl": "https://map.baidu.com/poi/%E7%9F%B3%E7%A6%BB%E7%A3%85%20%C2%B7%20%E7%9F%B3%E6%9E%97%E5%91%A8%E8%BE%B9?uid=dfc496b6aa22f7af8936ee18",
    "summary": "2025年作者在石离磅拍摄银河堆栈，岩石与峰丛适合作前景；2026年另有作者在附近农田拍到银河。",
    "access": "作者2025年回复可驾车和露营；另帖天黑后未找到目标石林，建议提前白天踩点。",
    "nightAccess": "露营回复属于历史个人经历，现行土地与夜间进入规定待确认。",
    "caution": "旧机位可能随种树和土地使用变化；不要依赖固定网红岩石机位。周边农田有灯光，末段道路需现场核对。",
    "sources": [
      {
        "title": "infrared · 石离磅夏季银河实拍",
        "url": "https://www.xiaohongshu.com/explore/67f14f78000000000d016ada",
        "date": "2025-04-05"
      },
      {
        "title": "退堂鼓艺术家 · 石林周边银河及夜间找路经历",
        "url": "https://www.xiaohongshu.com/explore/6a524399000000000f017541",
        "date": "页面显示07-11"
      }
    ],
    lightPollution: {"min":3.4,"max":3.4,"sqm":21.81,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[112.76424440368307,24.832328934041023],"coordinateSystem":"WGS84","matchedLocation":"Chengjia, Yangshan County, Guangdong"},
    tianwentong: {"min":3.4,"max":3.4,"sqm":21.82,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[112.7688,24.83],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省清远市阳山县秤架瑶族乡石离塝","searchQuery":"石离磅"},
    "mapUrl": "https://uri.amap.com/search?keyword=%E7%9F%B3%E7%A6%BB%E7%A3%85+%C2%B7+%E7%9F%B3%E6%9E%97%E5%91%A8%E8%BE%B9&city=%E6%B8%85%E8%BF%9C&view=map&src=travel-guides"
  },
  {
    "id": "tiantangding",
    "name": "天塘顶 · 禾云滑翔基地",
    "city": "清远",
    "district": "清新区 · 禾云镇天塘山",
    "terrain": "山顶营地",
    "wgs84": [
      112.80499187984363,
      23.95484488593004
    ],
    "precision": "百度天塘顶 · 禾云滑翔基地POI转换为WGS84，区域参考，非精确帐篷或摄影机位。",
    "coordinateUrl": "https://map.baidu.com/poi/%E5%A4%A9%E5%A1%98%E9%A1%B6%20%C2%B7%20%E7%A6%BE%E4%BA%91%E6%BB%91%E7%BF%94%E5%9F%BA%E5%9C%B0?uid=a8f876acea1cddef14b54b37",
    "summary": "作者记录整夜无云、银河摄影和一颗未拍到的流星；露营有厕所、热水和洗漱设施。",
    "access": "帖子带禾云国际滑翔基地地名，作者报告夜间有人驾车到营地；车型及末段路况未确认。",
    "nightAccess": "百度滑翔体验POI显示09:00–18:00；营地住宿和夜间安排需另向基地确认，不能将日间体验时间当露营开放时间。",
    "caution": "夜间车辆和人声较多，山谷清晨有雾；照片由同行摄影师拍摄并堆栈，实际星空取决于天气。",
    "sources": [
      {
        "title": "天塘顶露营经历 · 同行Waymon银河摄影",
        "url": "https://www.xiaohongshu.com/explore/68f5ad960000000003036d19",
        "date": "2025-10-20"
      }
    ],
    lightPollution: {"min":4.3,"max":4.3,"sqm":21.28,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[112.80499187984363,23.95484488593004],"coordinateSystem":"WGS84","matchedLocation":"Qingyuan City, Guangdong"},
    tianwentong: {"min":4.3,"max":4.3,"sqm":21.3,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[112.8074,23.9564],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省清远市清新区禾云镇桂湖村天堂山林场（天塘山区域）","searchQuery":"清远 天堂山"},
    "mapUrl": "https://uri.amap.com/search?keyword=%E5%A4%A9%E5%A1%98%E9%A1%B6+%C2%B7+%E7%A6%BE%E4%BA%91%E6%BB%91%E7%BF%94%E5%9F%BA%E5%9C%B0&city=%E6%B8%85%E8%BF%9C&view=map&src=travel-guides"
  },
  {
    "id": "houyan",
    "name": "新丰猴岩风车山",
    "city": "韶关",
    "district": "新丰县",
    "terrain": "风车山",
    "wgs84": [
      114.02367164446291,
      24.071730085584413
    ],
    "precision": "百度新丰猴岩风车山POI转换为WGS84，区域参考，非精确帐篷或摄影机位。",
    "coordinateUrl": "https://map.baidu.com/poi/%E6%96%B0%E4%B8%B0%E7%8C%B4%E5%B2%A9%E9%A3%8E%E8%BD%A6%E5%B1%B1?uid=082c48036792b75343ab9a6b",
    "summary": "攻略作者推荐风机平台拍摄星空，山脊开阔，可用风车和草甸作前景。",
    "access": "导航使用新丰猴岩风车山；作者报告约8公里水泥盘山路，轿车慢行可上。风机编号与机位仍需现场辨认。",
    "nightAccess": "山脚铁门有时关闭，须先核对当日车辆和夜间通行；不保证可通宵露营。",
    "caution": "山顶缺水和补给、信号弱、强风及风机噪音明显；避开风机设施。Nominatim清远同名猴岩是另一点，未采用。",
    "sources": [
      {
        "title": "小番薯 · 猴岩星空攻略与道路回复",
        "url": "https://www.xiaohongshu.com/explore/6a5b7c97000000000f028a77",
        "date": "页面显示07-18"
      }
    ],
    lightPollution: {"min":4.3,"max":4.3,"sqm":21.34,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[114.02367164446291,24.071730085584413],"coordinateSystem":"WGS84","matchedLocation":"Xinfeng County, Guangdong"},
    tianwentong: {"min":4.3,"max":4.3,"sqm":21.38,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[114.0285,24.0692],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省韶关市新丰县沙田镇猴岩","searchQuery":"猴岩"},
    "mapUrl": "https://uri.amap.com/search?keyword=%E6%96%B0%E4%B8%B0%E7%8C%B4%E5%B2%A9%E9%A3%8E%E8%BD%A6%E5%B1%B1&city=%E9%9F%B6%E5%85%B3&view=map&src=travel-guides"
  },
  {
    "id": "queyashan",
    "name": "缺牙山 · 禅子顶区域",
    "city": "河源",
    "district": "东源县",
    "terrain": "风车山",
    "wgs84": [
      114.9239865,
      23.9615057
    ],
    "precision": "OSM缺牙山山峰节点，仅作山域天气、距离及暗空参考，非作者禅子顶导航终点或风机机位。",
    "coordinateUrl": "https://www.openstreetmap.org/node/7308450193",
    "summary": "作者用手机拍摄缺牙山星空，风车与山脊可作前景。图片中的亮线有卫星、飞机争议，不作为流星实拍保证。",
    "access": "作者推荐导航禅子顶；2026年8月称扫码进场、无需预约，山路驾驶需经验。具体末段路况应出发前核对。",
    "nightAccess": "作者8月19日回复当时免费且可过夜；已有历史封路反馈，当日管理可能变化。",
    "caution": "周末人流及照明增多；不要将缺牙山山峰节点当风车停车位，避开设施和作业路段。",
    "sources": [
      {
        "title": "俺是安公子 · 缺牙山手机星空与通行回复",
        "url": "https://www.xiaohongshu.com/explore/6a794b8a00000000210229c9",
        "date": "2026-08-10 / 08-19"
      }
    ],
    lightPollution: {"min":4.2,"max":4.2,"sqm":21.48,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[114.9239865,23.9615057],"coordinateSystem":"WGS84","matchedLocation":"Guangdong, Dongyuan County"},
    tianwentong: {"min":4.2,"max":4.2,"sqm":21.43,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[114.9119,23.9565],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省河源市东源县曾田镇蝉子顶","searchQuery":"河源 禅子顶"},
    "mapUrl": "https://uri.amap.com/search?keyword=%E7%A6%85%E5%AD%90%E9%A1%B6+%E7%BC%BA%E7%89%99%E5%B1%B1&city=%E6%B2%B3%E6%BA%90&view=map&src=travel-guides"
  },
  {
    "id": "qinglianshan",
    "name": "乐昌青莲山",
    "city": "韶关",
    "district": "乐昌市 · 云岩镇",
    "terrain": "山顶",
    "wgs84": [
      113.08852341340176,
      25.104984444550688
    ],
    "precision": "百度乐昌青莲山POI转换为WGS84，山域/景区参考，非精确摄影机位。",
    "coordinateUrl": "https://map.baidu.com/poi/%E4%B9%90%E6%98%8C%E9%9D%92%E8%8E%B2%E5%B1%B1?uid=2fd2beabfda9be517adbd241",
    "summary": "作者骑行上山拍摄银河，并提供70、30及13张堆栈参数；当时肉眼也能看见银河。",
    "access": "作者评论确认可开车到青莲山，未给停车位或最后一段路况。适合白天先熟悉路线。",
    "nightAccess": "作者没有过夜，现行夜间道路及山地管理仍需核对。",
    "caution": "照片经过堆栈和调色，不能等同肉眼效果；山顶风雨与道路情况应出发前确认。",
    "sources": [
      {
        "title": "广东波减猹 · 乐昌青莲山银河实拍",
        "url": "https://www.xiaohongshu.com/explore/6a52041300000000070104de",
        "date": "页面显示07-11"
      }
    ],
    lightPollution: {"min":4.1,"max":4.1,"sqm":21.54,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[113.08852341340176,25.104984444550688],"coordinateSystem":"WGS84","matchedLocation":"Yunyan Town, Guangdong, Lechang City"},
    tianwentong: {"min":4.1,"max":4.1,"sqm":21.52,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[113.0975,25.0941],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省韶关市乐昌市云岩镇青莲山","searchQuery":"乐昌 青莲山"},
    "mapUrl": "https://uri.amap.com/search?keyword=%E4%B9%90%E6%98%8C%E9%9D%92%E8%8E%B2%E5%B1%B1&city=%E9%9F%B6%E5%85%B3&view=map&src=travel-guides"
  },
  {
    "id": "lingnanhongye",
    "name": "岭南红叶世界",
    "city": "韶关",
    "district": "新丰县 · 黄磜镇茶峒村",
    "terrain": "山顶景区住宿",
    "wgs84": [
      114.14713519344211,
      24.234720355368903
    ],
    "precision": "百度岭南红叶世界POI转换为WGS84，山域/景区参考，非精确摄影机位。",
    "coordinateUrl": "https://map.baidu.com/poi/%E5%B2%AD%E5%8D%97%E7%BA%A2%E5%8F%B6%E4%B8%96%E7%95%8C?uid=dbc70a8abad2d42745e27479",
    "summary": "作者入住观星小院，用手机拍到银河及流星；午夜熄灯后肉眼看到淡银河。适合结合住宿安排。",
    "access": "作者由翁源县打车入景区，再搭观光车到住宿；返程不易叫车，提前约好交通。",
    "nightAccess": "日间景区POI显示09:00–17:00，16:00停止售票；需另预订并确认夜间住宿观星安排。午夜熄灯是2025年个人经历。",
    "caution": "园区灯光与住宿位置会影响拍摄；道路弯多。玻璃房照片不代表任何房型都可直接拍星。",
    "sources": [
      {
        "title": "Liu二三 · 岭南红叶世界住宿与星空实拍",
        "url": "https://www.xiaohongshu.com/explore/688918fc000000002302733b",
        "date": "2025-07-30"
      }
    ],
    lightPollution: {"min":4.3,"max":4.3,"sqm":21.36,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[114.14713519344211,24.234720355368903],"coordinateSystem":"WGS84","matchedLocation":"Xinfeng County, Guangdong"},
    tianwentong: {"min":4.2,"max":4.2,"sqm":21.39,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[114.177,24.229],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省韶关市新丰县黄磜镇茶峒村（岭南红叶世界附近）","searchQuery":"新丰 茶峒"},
    "mapUrl": "https://uri.amap.com/search?keyword=%E5%B2%AD%E5%8D%97%E7%BA%A2%E5%8F%B6%E4%B8%96%E7%95%8C&city=%E9%9F%B6%E5%85%B3&view=map&src=travel-guides"
  },
  {
    "id": "yunfengshan",
    "name": "南雄云峰山",
    "city": "韶关",
    "district": "南雄市 · 江头镇",
    "terrain": "山地景区",
    "wgs84": [
      114.47265877196048,
      25.015014977573443
    ],
    "precision": "百度云峰山·狮子寨景区POI转换为WGS84，山域参考，非原帖摄影师精确机位。",
    "coordinateUrl": "https://map.baidu.com/poi/%E4%BA%91%E5%B3%B0%E5%B1%B1%C2%B7%E7%8B%AE%E5%AD%90%E5%AF%A8%E7%94%9F%E6%80%81%E6%97%85%E6%B8%B8%E6%99%AF%E5%8C%BA?uid=f6f809c1f7b1e3449cf77955",
    "summary": "2026英仙座期间的帖子明确在南雄云峰山通宵拍摄。可作为山域候选，具体拍摄位置仍须向现场确认。",
    "access": "地图匹配江头镇488乡道云峰山·狮子寨景区。帖子未回复能否开车直达，不默认车辆可到山顶。",
    "nightAccess": "百度景区显示09:00–18:00，夜间摄影需另向管理方确认，不默认购日票可通宵停留。",
    "caution": "原帖致敬摄影师，未证实发布者为拍摄本人；蚊虫较多。景区范围可能跨省，本文仅用南雄侧POI作区域参考。",
    "sources": [
      {
        "title": "千夜 · 南雄云峰山2026英仙座拍摄记录",
        "url": "https://www.xiaohongshu.com/explore/6a7ca5ef0000000033019edc",
        "date": "2026-08-13"
      }
    ],
    lightPollution: {"min":4,"max":4,"sqm":21.69,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[114.47265877196048,25.015014977573443],"coordinateSystem":"WGS84","matchedLocation":"Jiangtou Town, Guangdong, Nanxiong City"},
    tianwentong: {"min":3.8,"max":3.8,"sqm":21.73,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[114.4765,25.0166],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"南雄云峰山生态旅游区 · 武岭村","searchQuery":"南雄 云峰山"},
    "mapUrl": "https://uri.amap.com/search?keyword=%E5%8D%97%E9%9B%84%E4%BA%91%E5%B3%B0%E5%B1%B1+%E7%8B%AE%E5%AD%90%E5%AF%A8&city=%E9%9F%B6%E5%85%B3&view=map&src=travel-guides"
  },
  {
    "id": "houshanding",
    "name": "后山顶 · 后山村参考",
    "city": "韶关",
    "district": "曲江区 · 樟市镇",
    "terrain": "高山草甸徒步",
    "wgs84": [
      113.45438121452516,
      24.50460398905411
    ],
    "precision": "百度樟市镇后山村POI转换为WGS84，村落区域参考，非后山顶、登山入口或山顶天气测点。",
    "coordinateUrl": "https://map.baidu.com/poi/%E5%90%8E%E5%B1%B1%E6%9D%91?uid=08fc93df2cf20b919a68b4b0",
    "summary": "作者描述后山顶为开阔草甸，360度视野，无树木遮挡。山顶银河拍摄需安排徒步和山地露营经验。",
    "access": "作者定位曲江樟市镇后山村，单程徒步约2.5–3小时且爬升较大，评论确认不可开车直达山顶；具体轨迹未核准。",
    "nightAccess": "当前登山与过夜许可未核准；应在白天辨认路线，并核对管理要求。",
    "caution": "山顶强风、明显温差；地图采用村落参考，天气及暗空估算不能当山顶实况。不要沿导航村落点直接夜爬未知路线。",
    "sources": [
      {
        "title": "小企鹅cunning · 后山顶与阎罗头银河实拍",
        "url": "https://www.xiaohongshu.com/explore/6a5d653e000000000c015014",
        "date": "页面显示07-20"
      }
    ],
    lightPollution: {"min":4.2,"max":4.2,"sqm":21.46,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[113.45438121452516,24.50460398905411],"coordinateSystem":"WGS84","matchedLocation":"Zhangshi Town, Guangdong"},
    tianwentong: {"min":4.2,"max":4.2,"sqm":21.41,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[113.4584,24.5025],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省韶关市曲江区樟市镇后山村","searchQuery":"韶关 后山村"},
    "mapUrl": "https://uri.amap.com/search?keyword=%E5%90%8E%E5%B1%B1%E6%9D%91+%E6%9B%B2%E6%B1%9F+%E6%A8%9F%E5%B8%82%E9%95%87&city=%E9%9F%B6%E5%85%B3&view=map&src=travel-guides"
  },
  {
    "id": "jilongding",
    "name": "阳春鸡笼顶",
    "city": "阳江",
    "district": "阳春市",
    "terrain": "高山草甸",
    "wgs84": [
      111.383548,
      22.250605
    ],
    "precision": "OSM山峰参考节点，非具体营地、登山口或停车点。",
    "coordinateUrl": "https://www.openstreetmap.org/node/12987910710",
    "summary": "独立到访者记录银河、日出与云海，高山草甸可作开阔前景。适合先完成徒步路线与营地确认。",
    "access": "需要徒步；原帖未公开具体上山路线、营地和耗时，不据此判断难度或安排夜间首次探路。",
    "nightAccess": "2025年到访帖有营地与银河经历，现行夜间进入和露营规定待核对。",
    "caution": "山顶风云变化快。补搜有作者承认封面经AI修图，不能把网络照片当作肉眼银河预期。",
    "sources": [
      {
        "title": "Icdat · 阳江鸡笼顶到访观星",
        "url": "https://www.xiaohongshu.com/explore/68c645a4000000001c036100",
        "date": "2025-09-14"
      }
    ],
    lightPollution: {"min":4.1,"max":4.1,"sqm":21.61,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[111.383548,22.250605],"coordinateSystem":"WGS84","matchedLocation":"Guangdong, Yangchun"},
    tianwentong: {"min":4,"max":4,"sqm":21.65,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[111.388,22.2464],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省阳江市阳春市三甲镇鸡笼顶大草原","searchQuery":"阳春 鸡笼顶"},
    "mapUrl": "https://uri.amap.com/search?keyword=阳春鸡笼顶&city=阳江&view=map&src=travel-guides"
  },
  {
    "id": "luokeng",
    "name": "电白罗坑水库",
    "city": "茂名",
    "district": "电白区",
    "terrain": "水库大坝周边",
    "wgs84": [
      111.2709385,
      21.8248062
    ],
    "precision": "OSM水库区域中心，非大坝拍摄点、岸线入口或停车位置。",
    "coordinateUrl": "https://www.openstreetmap.org/relation/2689149",
    "summary": "作者记录冬季银河实拍，明确机位在大坝附近；水面与远山可供踩点时比较前景。",
    "access": "作者建议导航罗坑水库后到大坝附近；不是景区，周边缺少餐饮等配套。需落实允许停留的具体位置。",
    "nightAccess": "有2025年冬季拍摄经历，现行水库、大坝与夜间通行管理待确认；露营许可未核实。",
    "caution": "照片使用全光谱改机和滤镜，肉眼观感不能直接比照。勿与韶关罗坑大草原混淆，不进入管理限制区域。",
    "sources": [
      {
        "title": "追星者 阿响 · 电白罗坑水库冬季银河",
        "url": "https://www.xiaohongshu.com/explore/692320ee000000001d03c50c",
        "date": "2025-11-23，后续04-08回复机位"
      }
    ],
    lightPollution: {"min":4.5,"max":4.5,"sqm":21.05,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[111.2709385,21.8248062],"coordinateSystem":"WGS84","matchedLocation":"Maoming City, Guangdong"},
    tianwentong: {"min":4.4,"max":4.4,"sqm":21.18,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[111.2884,21.8242],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省茂名市电白区罗坑镇罗坑水库","searchQuery":"电白 罗坑水库"},
    "mapUrl": "https://uri.amap.com/search?keyword=电白罗坑水库&city=茂名&view=map&src=travel-guides"
  },
  {
    "id": "qingshanzui",
    "name": "青山咀灯塔",
    "city": "江门",
    "district": "台山市 · 海宴镇",
    "terrain": "海岸灯塔",
    "wgs84": [
      112.55535370862887,
      21.759480298110663
    ],
    "precision": "青山咀灯塔POI参考，非精确相机位置或岸边停车位。",
    "coordinateUrl": "https://map.baidu.com/poi/青山咀灯塔?uid=115a66b62958cc8e3913fd36",
    "summary": "作者记录单张与堆栈银河拍摄，明确灯塔位置。海岸与灯塔适合作前景，但需控制现场人造光。",
    "access": "导航江门台山海宴青山咀灯塔；原帖未给停车点与末段步行路线，提前在白天确认允许停留的位置。",
    "nightAccess": "作者记录20:40拍到凌晨；夜间是否随时可进入的提问未得到可见回复，当前海岸管理待核对。",
    "caution": "灯塔、渔灯与其他摄影者照明会干扰；留意海况和潮汐，照片部分使用天文改机或堆栈。",
    "sources": [
      {
        "title": "NeonDreams📸 · 江门青山咀灯塔星空拍摄",
        "url": "https://www.xiaohongshu.com/explore/68872a080000000017031d70",
        "date": "2025-07-28"
      }
    ],
    lightPollution: {"min":4.4,"max":4.4,"sqm":21.17,"year":2026,"checkedAt":"2026-09-14","sampledCoordinates":[112.55535370862887,21.759480298110663],"coordinateSystem":"WGS84","matchedLocation":"Haiqiaojingji, Jiangmen, Guangdong"},
    tianwentong: {"min":4.3,"max":4.3,"sqm":21.33,"year":2025,"checkedAt":"2026-09-14","sampledCoordinates":[112.5599,21.7572],"coordinateSystem":"腾讯地图显示坐标","matchedLocation":"广东省江门市台山市海宴镇青山咀","searchQuery":"台山 青山咀"},
    "mapUrl": "https://uri.amap.com/search?keyword=台山海宴青山咀灯塔&city=江门&view=map&src=travel-guides"
  },
  // End expanded catalog.
];

export function bortleLabel(value: PollutionReading | null) {
  return value ? (value.min === value.max ? value.min.toFixed(1) : `${value.min}–${value.max}`) : "待核验";
}
export function lightPollutionUrl(place: StargazingPlace) {
  const [lng, lat] = place.lightPollution?.sampledCoordinates ?? place.wgs84;
  return `https://lightpollutionmap.app/?lat=${lat}&lng=${lng}&zoom=11`;
}
// DarkMap ignores the tested coordinate query parameters. Use its verified search UI.
export const tianwentongUrl = "https://www.darkmap.cn/";
export type SortKey = "distance" | PollutionSource;
export function sortPlaces(input: StargazingPlace[], key: SortKey, direction: "asc" | "desc") {
  return [...input].sort((a, b) => {
    const distance = distanceKm(shenzhenOrigin, a.wgs84) - distanceKm(shenzhenOrigin, b.wgs84);
    if (key !== "distance") {
      const left = a[key], right = b[key];
      if (!left || !right) return left ? -1 : right ? 1 : distance || a.id.localeCompare(b.id);
      const grade = left.max - right.max;
      if (grade) return direction === "asc" ? grade : -grade;
    } else if (distance) return direction === "asc" ? distance : -distance;
    return distance || a.id.localeCompare(b.id);
  });
}
export function toMapPlace(place: StargazingPlace, source: PollutionSource = "lightPollution"): MapPlace {
  return { id: place.id, name: place.name, coord: wgs84ToGcj02(place.wgs84), note: place.precision,
    markerLabel: place[source] ? bortleLabel(place[source]) : "?", markerColor: "#36594a",
    meta: `${place.city} · 波尔特（模型）：LightPollution ${bortleLabel(place.lightPollution)} / 天文通 ${bortleLabel(place.tianwentong)}`,
    url: place.mapUrl, linkLabel: "高德查看地点 ↗" };
}
