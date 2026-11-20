import type { City } from "./trip";

export const foodSources = {
  solo: {
    title: "一个人去北海道都吃了什么（合集）",
    author: "一颗桦梅糖",
    url: "https://www.douyin.com/note/7704602016932367579",
  },
  casual: {
    title: "北海道p人无需预约版逛吃合集",
    author: "可乐盖盖er",
    url: "https://www.douyin.com/video/7705027652294280571",
  },
} as const;

export interface FoodPlace {
  id: string;
  city: City;
  name: string;
  description: string;
  source: keyof typeof foodSources;
}

// Locations come from the notes and the user's verified Google Maps additions.
// The first post's image/OCR attachments are unavailable locally: do not invent tasting notes.
export const foodPlaces: FoodPlace[] = [
  { id: "samurai-sakura", city: "札幌", name: "Rojiura Curry SAMURAI · さくら店", description: "椰浆鸡腿汤咖喱，搭配油炸蔬菜。作者喜欢它的辣度和蔬菜口感，比起 SAMA 更偏爱这家。", source: "casual" },
  { id: "picante", city: "札幌", name: "PICANTE · 北13条店", description: "原帖收录的汤咖喱店。位于北13条西3丁目，靠近北海道大学，可和校园散步一起安排。", source: "solo" },
  { id: "espresso-dworks", city: "札幌", name: "Espresso D’Works · COCONO SUSUKINO", description: "薄野的咖啡馆，位于南4条西4丁目 COCONO SUSUKINO。逛商场时的咖啡休息点。", source: "solo" },
  { id: "lecker", city: "札幌", name: "LECKER レッカー", description: "炙烤、西餐选择。位于北2条西3丁目、札幌フコク生命越山大楼，可与札幌站周边行程搭配。", source: "solo" },
  { id: "utari", city: "札幌", name: "炉端烧 Utari", description: "薄野的炉端烧居酒屋，位于南5条西5丁目。适合想吃日式炭火烤物的一餐。", source: "solo" },
  { id: "sankosha", city: "札幌", name: "三光舎寿喜烧", description: "寿喜烧正餐。位于薄野南4条西2丁目、レコルトサッポロ二楼，原帖收录的一人用餐选择。", source: "solo" },
  { id: "sasaki", city: "札幌", name: "Parfait 佐佐木", description: "夜巴菲、咖啡与酒。位于南2条西1丁目，可作为市中心逛街后的甜品一站。", source: "solo" },
  { id: "hamakko", city: "札幌", name: "浜っ子 · 读卖北海道大楼店", description: "札幌站附近的居酒屋，位于北4条西4丁目地下1层。原帖明确标注这家分店。", source: "solo" },
  { id: "softcream", city: "札幌", name: "THE SOFTCREAM HOUSE", description: "狸小路的冰淇淋店，位于南2条西5丁目。逛街时顺路买份甜品。", source: "solo" },
  { id: "nagi", city: "札幌", name: "凪 ～nagi～ 海胆饭", description: "海胆丼专门店，原帖收录的海鲜饭选择。位于南2条西1丁目第二広和大楼三楼。", source: "solo" },
  { id: "shimaenaga", city: "札幌", name: "シマエナガ Creperie", description: "札幌站附近的可丽饼店，位于北4条西2丁目。适合放进车站周边的甜品备选。", source: "solo" },
  { id: "rakkyo", city: "札幌", name: "らっきょ · 丸井今井店", description: "汤咖喱。位于丸井今井札幌本店大通馆10楼，逛大通商圈时可顺路吃饭。", source: "solo" },
  { id: "be-sandwich", city: "札幌", name: "Be! SANDWICH · 大丸札幌店", description: "三明治，位于大丸札幌店地下1层。原帖分店明确，可作为札幌站附近的轻食选择。", source: "solo" },
  { id: "hokudai-marche", city: "札幌", name: "HOKUDAI MARCHE Café & Labo", description: "北海道大学内的咖啡馆，位于北9条西5丁目。逛校园时可安排一段室内休息。", source: "solo" },
  { id: "uokichi", city: "札幌", name: "煮焚き屋 魚吉", description: "原帖收录的居酒屋。位于南3条西4丁目シルバービル地下1层，入口在摩斯汉堡下方。", source: "solo" },
  { id: "sama", city: "札幌", name: "SAMA · 大通店", description: "汤咖喱，位于狸小路エリオ二楼。原帖明确为大通店，适合与狸小路逛街一起安排。", source: "solo" },
  { id: "coffee-square-do", city: "札幌", name: "coffee square do", description: "咖啡馆，位于南8条西1丁目ハビターエイト大楼。原帖收录的中岛公园周边休息点。", source: "solo" },
  { id: "miyakoshi", city: "札幌", name: "宮越屋珈琲 THE CAFE", description: "雪景窗边咖啡馆。作者称奶油咖啡欧蕾和吐司很好吃，适合坐着看雪。地址在南19条西16丁目。", source: "casual" },
  { id: "hakodate-sushi", city: "函馆", name: "はこだて寿司", description: "函馆站附近的寿司店，位于若松町19-11、TETRA函馆站前酒店二楼。原帖的一人用餐选择。", source: "solo" },
  { id: "yowaken", city: "函馆", name: "養和軒ぷらす", description: "函馆盐拉面，位于松风町10-15。想吃一顿热汤面时，可放进车站周边备选。", source: "solo" },
  { id: "rokkatei", city: "函馆", name: "六花亭 · 渔火通店", description: "甜品与伴手礼，位于金堀町9-18。原帖明确为渔火通店，可单独安排采购。", source: "solo" },
  { id: "otaru-kitty", city: "小樽", name: "OTARU CAFE × HELLO KITTY", description: "Hello Kitty 主题咖啡馆，位于住吉町1-6。出现在视频开头，逛堺町一带可顺路看看。", source: "casual" },
];
