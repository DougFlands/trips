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
  mapUrl: string;
  tabelogScore: number;
  tabelogUrl: string;
  source: keyof typeof foodSources;
}

// Tabelog scores and branch URLs verified on 2026-11-20.
// Locations come from the notes and the user's verified Google Maps additions.
// The first post's image/OCR attachments are unavailable locally: do not invent tasting notes.
export const foodPlaces: FoodPlace[] = [
  { id: "samurai-sakura", tabelogScore: 3.31, tabelogUrl: "https://tabelog.com/en/hokkaido/A0101/A010103/1031790/", mapUrl: "https://www.google.com/maps/search/?api=1&query=Rojiura%20Curry%20SAMURAI%20%E3%81%95%E3%81%8F%E3%82%89%E5%BA%97%20%E6%9C%AD%E5%B9%8C%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E5%8D%973%E6%9D%A1%E8%A5%BF6%E4%B8%81%E7%9B%AE1-3", city: "札幌", name: "Rojiura Curry SAMURAI · さくら店", description: "椰浆鸡腿汤咖喱，搭配油炸蔬菜。作者喜欢它的辣度和蔬菜口感，比起 SAMA 更偏爱这家。", source: "casual" },
  { id: "picante", tabelogScore: 3.65, tabelogUrl: "https://tabelog.com/en/hokkaido/A0101/A010201/1000060/", mapUrl: "https://www.google.com/maps/search/?api=1&query=Picante%20Soup%20curry%20%E6%9C%AD%E5%B9%8C%E5%B8%82%E5%8C%97%E5%8C%BA%E5%8C%9713%E6%9D%A1%E8%A5%BF3%E4%B8%81%E7%9B%AE2-23", city: "札幌", name: "PICANTE · 北13条店", description: "原帖收录的汤咖喱店。位于北13条西3丁目，靠近北海道大学，可和校园散步一起安排。", source: "solo" },
  { id: "espresso-dworks", tabelogScore: 3.51, tabelogUrl: "https://tabelog.com/en/hokkaido/A0101/A010103/1076745/", mapUrl: "https://www.google.com/maps/search/?api=1&query=Espresso%20D%20Works%20COCONO%20SUSUKINO%20%E6%9C%AD%E5%B9%8C%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E5%8D%974%E6%9D%A1%E8%A5%BF4%E4%B8%81%E7%9B%AE1", city: "札幌", name: "Espresso D’Works · COCONO SUSUKINO", description: "薄野的咖啡馆，位于南4条西4丁目 COCONO SUSUKINO。逛商场时的咖啡休息点。", source: "solo" },
  { id: "lecker", tabelogScore: 3.47, tabelogUrl: "https://tabelog.com/en/hokkaido/A0101/A010101/1072021/", mapUrl: "https://www.google.com/maps/search/?api=1&query=LECKER%20%E3%83%AC%E3%83%83%E3%82%AB%E3%83%BC%20%E6%9C%AD%E5%B9%8C%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E5%8C%972%E6%9D%A1%E8%A5%BF3%E4%B8%81%E7%9B%AE%20%E6%9C%AD%E5%B9%8C%E3%83%95%E3%82%B3%E3%82%AF%E7%94%9F%E5%91%BD%E8%B6%8A%E5%B1%B1%E3%83%93%E3%83%AB", city: "札幌", name: "LECKER レッカー", description: "炙烤、西餐选择。位于北2条西3丁目、札幌フコク生命越山大楼，可与札幌站周边行程搭配。", source: "solo" },
  { id: "utari", tabelogScore: 3.44, tabelogUrl: "https://tabelog.com/en/hokkaido/A0101/A010103/1001912/", mapUrl: "https://www.google.com/maps/search/?api=1&query=Robatayaki%20Utari%20%E6%9C%AD%E5%B9%8C%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E5%8D%975%E6%9D%A1%E8%A5%BF5%E4%B8%81%E7%9B%AE1-7", city: "札幌", name: "炉端烧 Utari", description: "薄野的炉端烧居酒屋，位于南5条西5丁目。适合想吃日式炭火烤物的一餐。", source: "solo" },
  { id: "sankosha", tabelogScore: 3.59, tabelogUrl: "https://tabelog.com/en/hokkaido/A0101/A010103/1000247/", mapUrl: "https://www.google.com/maps/search/?api=1&query=%E3%81%99%E3%81%8D%E7%84%BC%E4%B8%89%E5%85%89%E8%88%8D&query_place_id=ChIJqQPDBYQpC18RAkrf-PoJQvE", city: "札幌", name: "三光舎寿喜烧", description: "寿喜烧正餐。位于薄野南4条西2丁目、レコルトサッポロ二楼，原帖收录的一人用餐选择。", source: "solo" },
  { id: "sasaki", tabelogScore: 3.56, tabelogUrl: "https://tabelog.com/en/hokkaido/A0101/A010102/1057627/", mapUrl: "https://www.google.com/maps/search/?api=1&query=%E3%83%91%E3%83%95%E3%82%A7%E3%80%81%E7%8F%88%E7%90%B2%E3%80%81%E9%85%92%E3%80%81%E4%BD%90%E3%80%85%E6%9C%A8&query_place_id=ChIJq6o2AIMpC18RWWxDKMY9IUc", city: "札幌", name: "Parfait 佐佐木", description: "夜巴菲、咖啡与酒。位于南2条西1丁目，可作为市中心逛街后的甜品一站。", source: "solo" },
  { id: "hamakko", tabelogScore: 3.47, tabelogUrl: "https://tabelog.com/en/hokkaido/A0101/A010101/1061233/", mapUrl: "https://www.google.com/maps/search/?api=1&query=%E6%B5%9C%E3%81%A3%E5%AD%90+%E8%AA%AD%E5%A3%B2%E5%8C%97%E6%B5%B7%E9%81%93%E3%83%93%E3%83%AB%E5%BA%97&query_place_id=ChIJWTXLmC0pC18RuKWvCtDs0Yk", city: "札幌", name: "浜っ子 · 读卖北海道大楼店", description: "札幌站附近的居酒屋，位于北4条西4丁目地下1层。原帖明确标注这家分店。", source: "solo" },
  { id: "softcream", tabelogScore: 3.09, tabelogUrl: "https://tabelog.com/en/hokkaido/A0101/A010103/1054277/", mapUrl: "https://www.google.com/maps/search/?api=1&query=The+soft+cream+house&query_place_id=ChIJJ7N36oQpC18RDqKL-jnVxoE", city: "札幌", name: "THE SOFTCREAM HOUSE", description: "狸小路的冰淇淋店，位于南2条西5丁目。逛街时顺路买份甜品。", source: "solo" },
  { id: "nagi", tabelogScore: 3.18, tabelogUrl: "https://tabelog.com/en/hokkaido/A0101/A010102/1080978/", mapUrl: "https://www.google.com/maps/search/?api=1&query=%E3%81%86%E3%81%AB%E4%B8%BC%E5%B0%82%E9%96%80%E5%BA%97+%E5%87%AA%E3%80%9Cnagi%E3%80%9C&query_place_id=ChIJ29kkrz0pC18RI9cIOPvZesE", city: "札幌", name: "凪 ～nagi～ 海胆饭", description: "海胆丼专门店，原帖收录的海鲜饭选择。位于南2条西1丁目第二広和大楼三楼。", source: "solo" },
  { id: "shimaenaga", tabelogScore: 3.33, tabelogUrl: "https://tabelog.com/en/hokkaido/A0101/A010101/1071409/", mapUrl: "https://www.google.com/maps/search/?api=1&query=%E3%82%B7%E3%83%9E%E3%82%A8%E3%83%8A%E3%82%AC+Creperie&query_place_id=ChIJE8ef31ApC18RJpP5UaZLgpE", city: "札幌", name: "シマエナガ Creperie", description: "札幌站附近的可丽饼店，位于北4条西2丁目。适合放进车站周边的甜品备选。", source: "solo" },
  { id: "rakkyo", tabelogScore: 3.32, tabelogUrl: "https://tabelog.com/en/hokkaido/A0101/A010102/1076862/", mapUrl: "https://www.google.com/maps/search/?api=1&query=%E3%82%89%E3%81%A3%E3%81%8D%E3%82%87+%E4%B8%B8%E4%BA%95%E4%BB%8A%E4%BA%95%E5%BA%97&query_place_id=ChIJKcZg_HQpC18RRfOTZjdc_y8", city: "札幌", name: "らっきょ · 丸井今井店", description: "汤咖喱。位于丸井今井札幌本店大通馆10楼，逛大通商圈时可顺路吃饭。", source: "solo" },
  { id: "be-sandwich", tabelogScore: 3.06, tabelogUrl: "https://tabelog.com/en/hokkaido/A0101/A010101/1083180/", mapUrl: "https://www.google.com/maps/search/?api=1&query=Be%21+SANDWICH+%28%E3%83%93%E3%83%BC%E3%83%BB%E3%82%B5%E3%83%B3%E3%83%89%E3%82%A4%E3%83%83%E3%83%81%29+%E5%A4%A7%E4%B8%B8%E6%9C%AD%E5%B9%8C%E5%BA%97&query_place_id=ChIJI0pldgApC18RxhU0bAZlyTU", city: "札幌", name: "Be! SANDWICH · 大丸札幌店", description: "三明治，位于大丸札幌店地下1层。原帖分店明确，可作为札幌站附近的轻食选择。", source: "solo" },
  { id: "hokudai-marche", tabelogScore: 3.49, tabelogUrl: "https://tabelog.com/en/hokkaido/A0101/A010101/1056554/", mapUrl: "https://www.google.com/maps/search/?api=1&query=%E5%8C%97%E5%A4%A7%E3%83%9E%E3%83%AB%E3%82%B7%E3%82%A7Caf%C3%A9%26Labo&query_place_id=ChIJB0BD1AspC18RFtt-x4Ig3O8", city: "札幌", name: "HOKUDAI MARCHE Café & Labo", description: "北海道大学内的咖啡馆，位于北9条西5丁目。逛校园时可安排一段室内休息。", source: "solo" },
  { id: "uokichi", tabelogScore: 3.43, tabelogUrl: "https://tabelog.com/en/hokkaido/A0101/A010103/1060037/", mapUrl: "https://www.google.com/maps/search/?api=1&query=%E7%85%AE%E7%84%9A%E3%81%8D%E5%B1%8B+%E9%AD%9A%E5%90%89&query_place_id=ChIJlyGttc0pC18RKCuGeqThKhc", city: "札幌", name: "煮焚き屋 魚吉", description: "原帖收录的居酒屋。位于南3条西4丁目シルバービル地下1层，入口在摩斯汉堡下方。", source: "solo" },
  { id: "sama", tabelogScore: 3.10, tabelogUrl: "https://tabelog.com/en/hokkaido/A0101/A010103/1077107/", mapUrl: "https://www.google.com/maps/search/?api=1&query=SAMA+%E6%9C%AD%E5%B9%8C%E5%A4%A7%E9%80%9A%E5%BA%97&query_place_id=ChIJ-SGNMgApC18RzsvWNAwKVEQ", city: "札幌", name: "SAMA · 大通店", description: "汤咖喱，位于狸小路エリオ二楼。原帖明确为大通店，适合与狸小路逛街一起安排。", source: "solo" },
  { id: "coffee-square-do", tabelogScore: 3.19, tabelogUrl: "https://tabelog.com/en/hokkaido/A0101/A010104/1005120/", mapUrl: "https://www.google.com/maps/search/?api=1&query=%E3%82%B3%E3%83%BC%E3%83%92%E3%83%BC%E3%82%B9%E3%82%AF%E3%82%A8%E3%82%A2%E3%83%BB%E3%83%89%E3%82%A5&query_place_id=ChIJs8UAy6YrC18RvUllq5-sWQQ", city: "札幌", name: "coffee square do", description: "咖啡馆，位于南8条西1丁目ハビターエイト大楼。原帖收录的中岛公园周边休息点。", source: "solo" },
  { id: "miyakoshi", tabelogScore: 3.08, tabelogUrl: "https://tabelog.com/en/hokkaido/A0101/A010104/1005151/", mapUrl: "https://www.google.com/maps/search/?api=1&query=%E5%AE%AE%E8%B6%8A%E5%B1%8B%E7%8F%88%E7%90%B2%20THE%20CAFE%20%E6%9C%AD%E5%B9%8C%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E5%8D%9719%E6%9D%A1%E8%A5%BF16%E4%B8%81%E7%9B%AE6-8", city: "札幌", name: "宮越屋珈琲 THE CAFE", description: "雪景窗边咖啡馆。作者称奶油咖啡欧蕾和吐司很好吃，适合坐着看雪。地址在南19条西16丁目。", source: "casual" },
  { id: "hakodate-sushi", tabelogScore: 3.27, tabelogUrl: "https://tabelog.com/en/hokkaido/A0105/A010501/1056124/", mapUrl: "https://www.google.com/maps/search/?api=1&query=%E3%81%AF%E3%81%93%E3%81%A0%E3%81%A6%E5%AF%BF%E5%8F%B8&query_place_id=ChIJrR-rQm7znl8R_sX60q4z54Y", city: "函馆", name: "はこだて寿司", description: "函馆站附近的寿司店，位于若松町19-11、TETRA函馆站前酒店二楼。原帖的一人用餐选择。", source: "solo" },
  { id: "yowaken", tabelogScore: 3.15, tabelogUrl: "https://tabelog.com/en/hokkaido/A0105/A010501/1082716/", mapUrl: "https://www.google.com/maps/search/?api=1&query=%E9%A4%8A%E5%92%8C%E8%BB%92%E3%81%B7%E3%82%89%E3%81%99-%E5%87%BD%E9%A4%A8%E5%A1%A9%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3-&query_place_id=ChIJXef5iIrznl8RCobgX6QENi8", city: "函馆", name: "養和軒ぷらす", description: "函馆盐拉面，位于松风町10-15。想吃一顿热汤面时，可放进车站周边备选。", source: "solo" },
  { id: "rokkatei", tabelogScore: 3.23, tabelogUrl: "https://tabelog.com/en/hokkaido/A0105/A010501/1069941/", mapUrl: "https://www.google.com/maps/search/?api=1&query=%E5%85%AD%E8%8A%B1%E4%BA%AD+%E6%BC%81%E7%81%AB%E9%80%9A%E5%BA%97&query_place_id=ChIJcezGBUv1nl8Rmuq5UIj0d3g", city: "函馆", name: "六花亭 · 渔火通店", description: "甜品与伴手礼，位于金堀町9-18。原帖明确为渔火通店，可单独安排采购。", source: "solo" },
  { id: "otaru-kitty", tabelogScore: 3.15, tabelogUrl: "https://tabelog.com/en/hokkaido/A0106/A010601/1073116/", mapUrl: "https://www.google.com/maps/search/?api=1&query=%E3%83%8F%E3%83%AD%E3%83%BC%E3%82%AD%E3%83%86%E3%82%A3%E3%82%AB%E3%83%95%E3%82%A7+OTARU+CAFE%C3%97HELLO+KITTY&query_place_id=ChIJ1fHdjwThCl8RLSVur-r5qoM", city: "小樽", name: "OTARU CAFE × HELLO KITTY", description: "Hello Kitty 主题咖啡馆，位于住吉町1-6。出现在视频开头，逛堺町一带可顺路看看。", source: "casual" },
];
