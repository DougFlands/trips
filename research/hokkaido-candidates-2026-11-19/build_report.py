import json
import re
from collections import Counter
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent
notes = json.loads((ROOT / 'notes.json').read_text(encoding='utf-8'))
for n in notes:
    n['id'] = n.get('id') or re.search(r'/([0-9a-f]{24})', n['url']).group(1)
    n['url'] = 'https://www.xiaohongshu.com/explore/' + n['id']

# 排序衡量本次慢游行程的适配程度。时间为规划估计，不是交通实测。
rows = [
    ('元町公园／旧函馆区公会堂', '函馆', '优先顺路', '30–60分钟',
     '洋楼、港口视角、元町散步；推理动漫爱好者有额外兴趣。',
     '不喜欢建筑史的人可能觉得馆内内容少；坡路结冰。个别攻略误写成红砖楼。',
     '2/1 在八幡坂、教堂街同片区挑一段；外观优先。若进馆，缩短其他散步，不压缩上山窗口。',
     '混合实访、巡礼和路线帖；外观价值比“必进馆”更有把握。'),
    ('大正硝子馆本店', '小樽', '优先顺路', '逛店20–40分钟；手作另留时间',
     '小摆件、玻璃花和杯子受欢迎；适合挑伴手礼、室内取暖。',
     '价格不低、易碎；不同分店卖不同品类，不能把所有照片当成本店。吹玻璃成品不能默认当天拿。',
     '2/5 从堺町逛店时间里分配；与北一硝子择重点。想手作可考虑当天制作、翌日取件，但须由店方确认。',
     '10篇覆盖本店及邻近大正硝子分店；并非10篇都只写本店。'),
    ('大森海岸', '函馆', '晴天优先', '海边30–45分钟；接驳另计',
     '雪和海同框，游客较少；比再增加一个JR海边小站更容易融入函馆段。',
     '海风强、手冷；有雪覆盖才接近网图，不能保证每次都白雪蓝海。',
     '1/31 仅在早到、酒店接近海边且仍有天光时短逛；否则在函馆两天中替换一段散步。',
     '实访评价较一致，但有极短摄影帖；“雪海”高度依赖天气。'),
    ('旧手宫线', '小樽', '优先顺路', '15–30分钟',
     '市区短段雪路、老铁路氛围；可和车站、运河散步衔接。',
     '大雪会把铁轨埋住；白天可能只是普通雪地步道。2027会场细节尚待最终公告。',
     '2/5 顺路短停，或2/6依最终雪灯地图挑一段；不必整条走完。',
     '10篇含短文及往年雪灯帖，不能用旧活动照片承诺2027布置。'),
    ('汤之川日归温泉', '函馆', '优先考虑替换', '约半天含交通、泡汤和休息',
     '海景露天泡汤，补上当前路线缺少的温泉体验，不需要换酒店。',
     '每家日归规则不同；男女浴场轮换、毛巾费、现金和接待时段要分别确认。',
     '仅当2/1已看成函馆山，才考虑2/2用温泉替换红砖湾区；若2/2补山就放弃温泉。',
     '10篇涵盖多家酒店。当前官网确认湯の浜可日归；其他酒店不能套用其规则。'),
    ('札幌JR Tower T38', '札幌', '方便的备用项', '馆内45–60分钟',
     '札幌站连通、室内暖和、能坐下看夜景，适合慢游。',
     '玻璃反光、雪雾遮挡；已有两处山景，再登高的新增感有限。',
     '2/3早到且有精神，或2/7返札幌后替换大学散步；与电视塔付费登高二选一。',
     '10篇多数是观景实访；视野好坏不能脱离当日天气。'),
    ('小樽水族馆', '小樽', '喜欢动物可优先替换', '半天含巴士和表演等候',
     '近距离企鹅雪中散步、海豚表演；体验与现有街景、山景不同。',
     '馆较老、冬季部分区域关闭；企鹅数量和互动不固定；巴士拥挤、表演有时间表。',
     '2/6用它替换天狗山，保留晚间雪灯；约11点出门不建议两处都赶。',
     '10篇含冬季实访；早12月、晚2月的休馆帖不能套到你们日期。'),
    ('船见坂', '小樽', '顺路可加', '15–30分钟',
     '坂道尽头看海，适合《情书》氛围和街景照片。',
     '结冰坡、车流、拍照人群；普通天气可能没有网图惊艳。',
     '小樽站附近短停；放好行李再走，路滑就取消。',
     '好评与“普通坡道”并存，属于偏好型短停。'),
    ('白色恋人公园／工厂体验', '札幌', '喜欢童话风再替换', '约3–4小时含往返',
     '欧式庭园、灯饰、甜品、亲子手作和定制纪念品。',
     '部分成人觉得偏亲子、工厂参观普通；定制项目有排号和售罄反馈。旧检修消息不代表2027关闭。',
     '可用2/7下午替换大学与休息，但到达时间偏晚时别安排多项手作。',
     '10篇混合游记与介绍；定制排队时长是个人案例。'),
    ('宫之森Frances教会', '札幌', '看开放日再选', '庭园20–40分钟；往返另计',
     '雪夜庭园、灯饰和月亮装置，拍照集中。',
     '地方不大；教堂内部不能默认参观；婚礼及活动会压缩或取消见学时间。',
     '2/4会挤占雪祭，不建议硬加；更适合2/7按当月开放日历作为晚间替换。',
     '介绍及推广语气帖子较多，体验证据信心中低。'),
    ('狸小路', '札幌', '晚饭前后顺路', '45–90分钟，按购物需求缩短',
     '餐饮、药妆、伴手礼和古着集中；有顶棚，方便补给。',
     '商业街同质化；部分店晚间结账排长队，有个别重复计价投诉；不能推成整街都坑。',
     '放到札幌晚饭前后，不单占白天；选自己想逛的几家即可。',
     '含购物投诉与店铺推广；负面评价只归到对应消费情境。'),
    ('函馆朝市', '函馆', '当一顿饭安排', '45–90分钟含用餐，排队另计',
     '近车站，海鲜饭、市场散步；想体验钓鱿鱼的人有额外兴趣。',
     '价格与服务差异大；鱿鱼受渔获影响，晚到可能售罄。',
     '住站前可替换一顿早餐或午餐；不为了“朝市”强迫早起，也不叠加几个海鲜市场。',
     '10篇含具体店铺体验，不能拿一家店代表全市场。'),
    ('札幌电视塔', '札幌', '外观顺路；登塔可选', '付费展望30–45分钟',
     '俯瞰大通公园、雪祭轴线；外观本就会遇到。',
     '展望层小、停留可很短；免费低层与收费展望台常被混写。纪念照另收费。',
     '2/4若想看雪祭俯视图，在既有大通时段里择取；不与T38同时补齐。',
     '10篇含一篇特定节日促销短帖，其优惠不适用于你们日期。'),
    ('二条市场', '札幌', '市中心顺路吃饭', '45–90分钟',
     '靠近狸小路、大通；适合把海鲜饭当午餐。',
     '市场小、店铺营业各异；有排队、拼桌、价格与口味落差反馈。',
     '札幌午餐备选；和场外市场择一，已有函馆朝市也可都省。',
     '10篇含3篇两市场对照帖；同店正负反馈并存。'),
    ('时计台', '札幌', '路过看外观', '外观10–20分钟；入馆另计',
     '札幌地标、老木建筑；历史或机械钟爱好者更有兴趣。',
     '体量小、被高楼包围；想看大片雪原会失望。',
     '札幌站与大通之间绕行时看一眼，不专程赶车。',
     '泛介绍和路线帖占比较高，不能称为10篇深入参观评价。'),
    ('函馆热带植物园／猴子温泉', '函馆', '去汤之川再考虑', '园内30–60分钟；交通另计',
     '主要看猴子泡汤，喜欢观察动物的人能看很久。',
     '园区小、植物温室内容少；有游客报告目击猴群打斗后不适。11月没泡汤的帖子属于季节问题。',
     '仅与汤之川半天组合考虑，不为它单独跨城折返。',
     '对动物观赏的感受分化；打斗为个别目击帖，未独立核实，不作普遍结论。'),
    ('定山溪温泉', '札幌周边', '想专门泡汤才换一天', '半天至一天',
     '山谷雪景、露天汤；不同酒店的休息区和设施各有特色。',
     '巴士预约及返程、日归截止时间；旧公交攻略可能已改。温泉景观因酒店与浴场而异。',
     '现行路线没有整块闲日；需主动换掉札幌半天以上。想省交通，优先比较汤之川。',
     '10篇涵盖温泉镇及丰平峡方向，不能视为同一家设施；二见公园旧路线已失效。'),
    ('定山溪雪景漂流', '札幌周边', '偏爱拍照再选', '活动约1.5小时；往返合计半天以上',
     '缓流赏雪、溪谷、热饮和棉花糖，安静体验与城市散步不同。',
     '路线短、价格较高；航拍和租靴可能另收费。遇雨、没飘雪会有落差。',
     '只能随定山溪替换方案考虑；不要在返程日或2/7回札幌后临时赶。',
     '10篇有短文、作者评论补充；不同运营商和年份报价不同。'),
    ('祝津展望台', '小樽', '去水族馆且晴天再选', '同线额外约1小时',
     '海崖、灯塔和海湾俯瞰，景色开阔。',
     '风大、上坡结冰、部分路段人与车共用；冬季抵达条件差。',
     '只作水族馆同线加项。大风导致天狗山停运时，这里也不能默认适合去。',
     '10篇含3篇交叉相关帖；冬季通行需看现场。'),
    ('钱函', '小樽周边', '晴天交通稳再选', '额外1–2小时含候车',
     '雪海、小镇和咖啡馆；适合有时间慢坐。',
     '风雪、湿鞋、雨夹雪、列车延误和叫车难；普通天气落差大。',
     '与朝里二选一；2/5携行李转场不建议中途下车。已有大森海岸，可省。',
     '10篇含3篇交叉帖；雪景和交通是主要条件。'),
    ('朝里', '小樽周边', '低优先', '额外1–2小时含候车',
     '海边小站、列车和小街景，适合短拍。',
     '看点少；旧站牌与咖啡馆仿牌容易混淆；候车时间可能比拍照久。',
     '已有函馆、小樽海景，不必再为小站专程停靠；不拖箱下车。',
     '10篇含2篇交叉帖；部分攻略误称JR为地铁，交通细节未照搬。'),
    ('札幌场外市场', '札幌', '海鲜购物兴趣强再去', '约2–3小时含往返和用餐',
     '挑活蟹、海产店、干货；比市中心市场更有专程采购感。',
     '并非必然便宜；交通比二条多一步。免费班车可能属于特定商家，有预约和回程时间要求。',
     '11点出门需直接去吃午餐；与现有函馆、小樽海鲜体验重复，排在二条之后。',
     '10篇以实际消费为主；批发市场与游客场外店不能混为一谈。'),
    ('伏见稻荷神社', '札幌', '参拜兴趣强再选', '约2–3小时含接驳',
     '红色鸟居配雪、环境安静。',
     '雪坡、接驳；拍摄规定有争议。官网有摄影禁止提示并限制非指定专业摄影，不能按网帖推断随意拍。',
     '已有北海道神宫，体验部分重复；愿意参拜、接受现场拍摄限制才去。',
     '10篇里有数篇极短摄影帖；已剔除疑似京都及清田稻荷错位样本。'),
    ('头大佛', '札幌周边', '建筑爱好者专程项', '半天，较早出门更稳',
     '安藤建筑、圆形佛殿与雪原石像，视觉特色强。',
     '位于陵园、远郊接驳、冬季关闭早；交通票价在旧帖中矛盾较多。',
     '与11点出门的慢游节奏不太合；只有特别想看建筑时才换半天。',
     '10篇有泛攻略；一篇地名误写小樽，其交通信息不采用。'),
    ('藻岩山', '札幌', '前两处夜景失败再备选', '约3小时含接驳、排队',
     '札幌全景，两段缆车有体验感。',
     '风雪、雾、两次换乘和排队；山脚雪坡。新增价值与函馆山、天狗山重复。',
     '仅在前两处看景失败且天气转好时，替换札幌一晚；不做必去第三座山。',
     '10篇有明显夸张传闻，未采用“只有本地人才知道”等宣传说法。'),
    ('新千岁机场温泉', '机场', '有充裕候机时间才考虑', '至少另留1.5–2小时，值机安检余量不占用',
     '机场内泡汤、洗澡、休息，适合早晚航班的特定场景。',
     '满员和排队；入馆后不能中途出去购物再回；大厅躺椅与客房预订不同。',
     '2/8航班时间尚未写入行程，目前不安排；只作机场提前抵达且有大段空闲的备选。',
     '10篇多讲过夜，不能把省住宿的价值等同于日间旅游价值；含一篇门口观察。'),
    ('二见吊桥', '札幌周边', '本次不安排', '当前无可用的冬季步行方案',
     '旧游记中的红桥、溪谷和厚雪确实吸引人。',
     '2026/9/24–2027/3月底二见公园工程，公园禁入；通往吊桥的绕行步道冬季关闭。',
     '你们在2027年2月，直接从本次候选中划掉；定山溪泡汤不受这条步道推荐牵连。',
     '已看10篇相关帖，但官方施工信息优先于旧冬季游记。'),
]

official = {
    '二见吊桥': [('定山溪观光协会：二见公园施工', 'https://jozankei.jp/news/futami-park-notice/', '工程至2027年3月底，公园禁入；吊桥绕行步道冬季关闭。')],
    '小樽水族馆': [('水族馆：2026–27冬季营业公告', 'https://otaru-aq.jp/choineta/news/news-36909', '2026/12/12–2027/2/23；10:00–16:00，15:30最后入馆。企鹅散步11:30、12:40、13:30、14:40；海兽公园和游乐园冬季关闭。')],
    '汤之川日归温泉': [('湯の浜酒店：温泉与日归', 'https://www.yunohama-hotel.com/onsen/', '目前日归13:00–20:00；成人1200日元；浴巾、毛巾租赁分别200、100日元。男女换浴场，出发前再确认对应海景浴场。')],
    '定山溪温泉': [('鹿之汤：日归说明', 'https://shikanoyu.co.jp/shikanoyu/spa/day/', '普通日归13:00–21:00，20:00停止接待；周一、周四14:00开始。成人1500日元、含毛巾；清扫及包场可能调整。'), ('定山溪：日归设施列表', 'https://jozankei.jp/oneday/', '不同设施的时段和内容分别核对，不套用旧帖的免费接送时间。')],
    '宫之森Frances教会': [('北海道官方观光：灯饰季', 'https://www.visit-hokkaido.jp/event/detail_11138.html', '2026/11/1–2027/3/28。会期覆盖旅行，但不等于每天可见学。'), ('教会：2026年11月见学公告', 'https://www.j-mfc.com/news/2580/', '教会按月公布见学安排；此次未查到2027年2月具体日历，待更新。')],
    '头大佛': [('滝野陵园：头大佛', 'https://www.takinoreien.com/pages/107/', '11月至3月参观10:00–15:00。冬季公交需按出发日再查，未采用旧帖班次。')],
    '函馆热带植物园／猴子温泉': [('植物园FAQ', 'https://hako-eco.com/qa', '猴汤通常12/1开始至次年春季；会因幼猴出生提前结束。你们2月处于常规展示季，猴子是否入水仍不可保证。')],
    '伏见稻荷神社': [('札幌伏见稻荷：摄影规定', 'https://fushimiinari.or.jp/photoshoot/', '页面英语写摄影禁止，日语重点限制非指定专业摄影及纪念摄影。不能据此承诺游客任意拍摄，现场标识及神社说明优先。')],
    '新千岁机场温泉': [('机场温泉FAQ', 'https://www.new-chitose-airport-onsen.com/faq/', '入馆后不可中途外出；客房以外不能预约。纹身及纹身贴均不接受。'), ('机场温泉官网', 'https://www.new-chitose-airport-onsen.com/', '10:00至翌日9:00，非网帖所写的晚上10点才开。')],
    '大正硝子馆本店': [('大正硝子：制作体验FAQ', 'https://www.otaruglass.com/faq', '吹玻璃可预约；蜻蜓玉仅当天现场受理。制作约15–90分钟，部分项目需冷却并后日领取或配送。')],
    '旧手宫线': [('小樽观光协会：2027雪灯之路日期', 'https://otaru.gr.jp/event/yukiakari2027', '2027/2/6–2/13；主办方表示具体细节将另行发布。'), ('札幌官方观光：雪灯之路', 'https://www.sapporo.travel/event/event-list/otaru-snow-light-path/', '介绍运河与旧手宫线会场，但不将介绍页替代2027最终会场图和点灯时间。')],
    '定山溪雪景漂流': [('北海道体验：运营商刊载的冬季产品', 'https://h-takarajima.com/programs/419265/', '野あそびベース フリルフスリフ产品：2026/12/1–2027/3/31，约90分钟，成人10000日元、租靴500日元；请求预约需运营方确认。不是所有运营商的统一报价。')],
    '元町公园／旧函馆区公会堂': [('旧函馆区公会堂官网', 'https://hakodate-kokaido.jp/', '冬季参观及馆内各项目营业分别查；本次推荐以公园和外观短停为主。')],
}

valid = [n for n in notes if not n.get('excludedReason')]
counts = Counter(n['place'] for n in valid)
assert len(rows) == 27 and all(counts[r[0]] == 10 for r in rows), counts
assert len({(n['place'], n['id']) for n in valid}) == len(valid)
unique = len({n['id'] for n in valid})
removed_candidates = {
    '元町公园／旧函馆区公会堂': '原推荐列表已有，且可归入2/1元町散步。',
    '白色恋人公园／工厂体验': '原推荐列表已有白色恋人公园。',
    '狸小路': '原推荐列表已有。',
    '藻岩山': '原推荐列表已有。',
    '札幌电视塔': '原推荐列表已有札幌电视塔／T38。',
    '札幌JR Tower T38': '原推荐列表已有札幌电视塔／T38。',
    '时计台': '原推荐列表已有。',
    '伏见稻荷神社': '原推荐列表已有伏见稻荷神社／头大佛。',
    '头大佛': '原推荐列表已有伏见稻荷神社／头大佛。',
    '船见坂': '原推荐列表已有。',
    '小樽水族馆': '原推荐列表已有。',
    '祝津展望台': '原推荐列表已有。',
    '钱函': '原推荐列表已有钱函／朝里。',
    '朝里': '原推荐列表已有钱函／朝里。',
    '大森海岸': '原推荐列表已有。',
    '汤之川日归温泉': '原推荐列表已有汤之川温泉，日归体验不再另算新增地点。',
    '函馆热带植物园／猴子温泉': '原推荐列表已有函馆热带植物园。',
    '大正硝子馆本店': '作为2/5已安排的堺町逛店细节，不再单列新增景点。大正与北一是不同店；手作仍需额外预约和时间。',
    '旧手宫线': '原推荐列表已有旧手宫线遗址，也可归入2/6雪灯之路的路线备选。',
    '二见吊桥': '冬季施工及通行限制，移出可加入行程的排序。',
}
reviews = []
candidate_rank = 0
for r in rows:
    place, city, tier, duration, features, pitfalls, fit, caveat = r
    if place not in removed_candidates:
        candidate_rank += 1
    rank = candidate_rank if place not in removed_candidates else None
    reviews.append(dict(rank=rank, place=place, city=city, tier=tier, duration=duration,
                        candidate=place not in removed_candidates,
                        removedReason=removed_candidates.get(place),
                        features=features, pitfalls=pitfalls, fit=fit, caveat=caveat,
                        sampleCount=counts[place],
                        sources=[{k: n[k] for k in ('id', 'title', 'url')} for n in valid if n['place'] == place],
                        official=[dict(title=t, url=u, finding=f) for t,u,f in official.get(place,[])]))

(ROOT/'notes.json').write_text(json.dumps(notes, ensure_ascii=False, indent=2), encoding='utf-8')
(ROOT/'reviews.json').write_text(json.dumps(reviews, ensure_ascii=False, indent=2), encoding='utf-8')
(ROOT/'audit.json').write_text(json.dumps(dict(checkedAt='2026-11-20', places=27,
    activeCandidates=candidate_rank, removedCandidates=removed_candidates,
    placeSamples=len(valid), uniquePosts=unique, excludedRecords=len(notes)-len(valid),
    perPlace=counts, method='通过Edge浏览器扩展读取小红书详情正文和部分可见评论；未逐张解读图中文字。每地点10篇；同一跨地点帖子可在不同地点相关样本内计数，整体去重另列。短文、宣传和泛攻略不等于十篇独立深入实访。'), ensure_ascii=False, indent=2), encoding='utf-8')

def esc(x): return escape(str(x), quote=True)
def source_link(title, url): return f'<a href="{esc(url)}" target="_blank" rel="noopener noreferrer">{esc(title)}</a>'

reviews = [r for r in reviews if r['candidate']]
removed_html = ''.join(f'<li><b>{esc(place)}</b>：{esc(reason)}</li>' for place, reason in removed_candidates.items())
table = ''.join(f'<tr><td>{r["rank"]}</td><td><a href="#p{r["rank"]}">{esc(r["place"])}</a><small>{esc(r["city"])}</small></td><td>{esc(r["tier"])}</td><td>{esc(r["features"])}</td><td>{esc(r["pitfalls"])}</td></tr>' for r in reviews)
sections=[]
for r in reviews:
    items=[]
    for n in [x for x in valid if x['place']==r['place']]:
        # Only expose bibliography, not scraped full post/comment bodies.
        main=re.split(r'- generic: 共 \d+ 条评论|- generic: 猜你想搜', n['body'])[0]
        lines=[re.sub(r'^\s*- (?:text|generic):\s*', '', s) for s in main.splitlines() if re.match(r'^\s*- (?:text|generic):',s)]
        content=' '.join(x for x in lines if x not in ('关注', ''))
        short=' · 短正文／评论补充' if len(content)<160 else ''
        cross=' · 跨地点相关帖' if n.get('crossReferenced') else ''
        items.append(f'<li>{source_link(n["title"],n["url"])}<small>{esc(short+cross)}</small></li>')
    refs=''.join(f'<li>{source_link(o["title"],o["url"])}<p>{esc(o["finding"])}</p></li>' for o in r['official'])
    sections.append(f'''<article id="p{r['rank']}" data-city="{esc(r['city'])}" data-tier="{esc(r['tier'])}">
      <div class="eyebrow">#{r['rank']:02d} · {esc(r['city'])} · {r['sampleCount']}篇</div>
      <h2>{esc(r['place'])}</h2><span class="badge">{esc(r['tier'])}</span>
      <dl><dt>特点</dt><dd>{esc(r['features'])}</dd><dt>踩雷点</dt><dd>{esc(r['pitfalls'])}</dd>
      <dt>怎么放</dt><dd>{esc(r['fit'])}</dd><dt>预留时间</dt><dd>{esc(r['duration'])}</dd>
      <dt>证据限制</dt><dd>{esc(r['caveat'])}</dd></dl>
      {f'<div class="official"><h3>营业与规则核实</h3><ul>{refs}</ul></div>' if refs else ''}
      <details><summary>查看10篇小红书来源</summary><ol>{''.join(items)}</ol></details>
      <a class="back" href="#ranking">回到排序 ↑</a></article>''')

html=f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>北海道候选景点｜小红书调研与行程适配排序</title>
<style>
:root{{color-scheme:light;--ink:#19333b;--muted:#566a70;--line:#d9e2e2;--accent:#126c72;--paper:#f4f7f6}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--paper);color:var(--ink);font:16px/1.75 system-ui,'Microsoft YaHei',sans-serif}}main{{max-width:1240px;margin:auto;padding:40px 24px 80px}}h1{{font-size:clamp(27px,4vw,46px);line-height:1.3;max-width:900px;margin:12px 0}}h2{{font-size:25px;margin:4px 0 12px}}h3{{font-size:17px;margin:0 0 6px}}p{{margin:10px 0}}a{{color:var(--accent);text-underline-offset:3px}}.eyebrow,small{{color:var(--muted);font-size:13px}}small{{display:block}}.intro{{max-width:960px}}.stats{{display:flex;gap:12px;flex-wrap:wrap;margin:24px 0}}.stats span,.badge{{display:inline-block;background:#e0efed;border-radius:9px;padding:7px 13px}}.alert{{border-left:4px solid #b95e36;background:#fff4e9;padding:16px 20px;margin:24px 0}}.scroll{{overflow:auto;background:white;border:1px solid var(--line);border-radius:12px}}table{{border-collapse:collapse;min-width:920px;width:100%;font-size:14px}}th,td{{padding:13px 14px;text-align:left;border-bottom:1px solid var(--line);vertical-align:top}}th{{background:#e5eeed}}td:nth-child(2){{min-width:170px}}td:nth-child(3){{min-width:130px}}article{{background:white;border:1px solid var(--line);border-radius:14px;padding:26px;margin:22px 0;scroll-margin-top:16px}}dl{{display:grid;grid-template-columns:90px 1fr;gap:12px 18px;margin:22px 0}}dt{{color:var(--muted)}}dd{{margin:0}}.official{{background:#f2f7f6;border-radius:8px;padding:16px}}ul,ol{{padding-left:24px}}li{{margin:8px 0}}li p{{margin:4px 0;font-size:14px}}details{{margin:20px 0}}summary{{cursor:pointer;font-weight:600;color:var(--accent)}}.back{{font-size:13px}}.controls{{display:flex;flex-wrap:wrap;gap:12px;margin:26px 0 12px}}input,select{{border:1px solid #aebfbe;border-radius:8px;padding:11px;background:white;font:inherit}}input{{flex:1;min-width:220px}}button{{border:0;background:var(--accent);color:white;padding:11px 18px;border-radius:8px;font:inherit;cursor:pointer}}[hidden]{{display:none!important}}footer{{margin-top:28px;color:var(--muted);font-size:13px}}@media(max-width:640px){{main{{padding:24px 15px}}article{{padding:20px}}dl{{grid-template-columns:1fr;gap:4px}}dd{{margin-bottom:12px}}}}@media print{{body{{background:white}}main{{padding:0}}.controls,.back{{display:none}}article{{break-inside:avoid}}details{{display:block}}.scroll{{overflow:visible}}table{{min-width:0;font-size:10px}}}}
</style></head><body><main>
<header><div class="eyebrow">2027.01.29–02.08 · 札幌 / 小樽 / 函馆 · 核实于2026.11.20</div>
<h1>哪些景点，值得加进这次北海道慢游？</h1>
<p class="intro">按你们约11点出门、晚饭后回酒店的节奏排序。优先看顺路程度、体验是否重复、冬季能否成行。排序是行程适配判断，不是小红书点赞榜，也不是好评率。</p>
<div class="stats"><span><b>{candidate_rank}</b> 个待选项目</span><span>原调研 <b>27</b> 个地点</span><span>每处 <b>10</b> 篇相关帖</span><span>原调研去重 <b>{unique}</b> 篇</span></div>
<p class="intro">本版按每日行程与原推荐列表一起去重，仅保留此前未列出的{candidate_rank}项。移除原列表已有的18项、大正硝子馆这一堺町逛店细节，以及冬季不可行的二见吊桥。汤之川温泉已移除；定山溪温泉与新千岁机场温泉是另外两个地点，原列表未列出，继续保留。原调研通过Edge扩展读取正文与部分可见评论，未逐张解读图中文字。共270条“地点×帖子”记录，跨地点游记可分别计入相关地点；评论不另算帖子。短文、泛攻略、宣传帖不等于深入实访。</p>
</header>
<details><summary>已从新增排序剔除的{len(removed_candidates)}项</summary><ul>{removed_html}</ul></details>
<div class="alert"><b>本次直接划掉：二见吊桥。</b> 二见公园施工至2027年3月底，吊桥绕行步道冬季关闭。{source_link('官方施工通知','https://jozankei.jp/news/futami-park-notice/')}。不要照2024–26年的冬季游记走。</div>
<p><b>优先考虑：</b>喜欢雪中灯饰可留意宫之森教会的开放日；函馆朝市、二条市场适合作为吃饭顺路停留。<br><b>需要换掉原安排：</b>定山溪温泉与雪景漂流，至少预留半天，避免硬塞进现有行程。</p>
<h2 id="ranking">按当前行程适配度排序</h2><div class="scroll"><table><thead><tr><th>序</th><th>地点</th><th>建议</th><th>主要特点</th><th>主要踩雷点</th></tr></thead><tbody>{table}</tbody></table></div>
<div class="controls"><input id="query" placeholder="搜索地点、特点或踩雷点" aria-label="搜索景点"><select id="city" aria-label="筛选城市"><option value="">全部地区</option><option>札幌</option><option>小樽</option><option>函馆</option><option>札幌周边</option><option>小樽周边</option><option>机场</option></select><button id="expand">展开所有来源</button></div>
<p id="shown" class="eyebrow">显示{candidate_rank}个待选项目。上方排序表保留完整候选列表。</p>
<section id="cards">{''.join(sections)}</section>
<footer>阅读日：2026年11月19–20日。营业核实日：2026年11月20日。官方信息只代表当前公告，未承诺未来日期的临时开放、天气和交通。时间为行程规划估计。未修改原行程。小红书链接可能要求登录或在App打开；可用标题回搜。</footer>
</main><script>
const q=document.getElementById('query'),c=document.getElementById('city'),cards=[...document.querySelectorAll('article')];
function filter(){{let count=0;for(const card of cards){{const show=(!c.value||card.dataset.city===c.value)&&card.textContent.toLowerCase().includes(q.value.trim().toLowerCase());card.hidden=!show;if(show)count++}}document.getElementById('shown').textContent='显示'+count+'个地点。上方排序表保留完整列表。'}}
q.addEventListener('input',filter);c.addEventListener('change',filter);document.getElementById('expand').addEventListener('click',function(){{const open=this.textContent.includes('展开');document.querySelectorAll('details').forEach(d=>d.open=open);this.textContent=open?'收起所有来源':'展开所有来源';}});
document.querySelectorAll('a[href^="#p"]').forEach(a=>a.addEventListener('click',()=>{{const target=document.querySelector(a.getAttribute('href'));if(target.hidden){{q.value='';c.value='';filter()}}}}));
</script></body></html>'''
(ROOT/'report.html').write_text(html, encoding='utf-8')
print(json.dumps({'places': len(rows), 'placeSamples': len(valid), 'uniquePosts': unique, 'report': str(ROOT/'report.html')},ensure_ascii=False))
