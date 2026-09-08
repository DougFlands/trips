$aDir = $PSScriptRoot
$aGroups = @(
  @{Pattern='batch-*.tsv';Query='广东流星雨拍摄';Time='2026-09-08T07:46:00Z'},
  @{Pattern='stars-*.tsv';Query='广东星空拍摄';Time='2026-09-08T07:51:00Z'},
  @{Pattern='milkyway-*.tsv';Query='广东银河拍摄机位';Time='2026-09-08T07:56:00Z'},
  @{Pattern='darksky-*.tsv';Query='广东暗夜观星';Time='2026-09-08T08:00:00Z'}
)
$aRecords = foreach ($aGroup in $aGroups) {
  $aSeen = [System.Collections.Generic.HashSet[string]]::new()
  Get-ChildItem -LiteralPath $aDir -Filter $aGroup.Pattern | Sort-Object Name | Get-Content -Encoding utf8 | ForEach-Object {
    $aParts = $_ -split "`t", 2
    if ($aSeen.Add($aParts[0])) {
      $aTitle = $aParts[1]
      $aMentions = @('深圳市天文台','深圳天文台','西涌','大鹏暗夜社区','广东第一峰','阿婆六','亚婆六','莲麻','白盆珠','目头岗','莫六公','八界','大顶山','大頂山','南水湖','云峰山','凤凰天池','猴岩风车山','缺牙山','茶坪水库','万山岛','庙湾','东澳岛','橫石基','桃花湖','石林','野丹霞','河源茶园') | Where-Object { $aTitle -and $aTitle.Contains($_) }
      $aDepth = 'search-card'
      $aDecision = 'place-unclear'
      $aReason = '已读搜索卡片，未获得可核验的具体机位与通达信息'
      if (@($aMentions).Count -gt 0 -or $aTitle -match '合集|清单|宝藏地|观星地|秘密基地|绝版|机位推荐') { $aDecision='candidate-unverified'; $aReason='搜索卡片有地点或合集线索，未核验详情，不直接进入推荐列表' }
      if ($aTitle -match '海南|冰山梁|梁子湖|果子沟|赛里木') { $aDecision='exclude-outside-guangdong'; $aReason='标题指向广东省外，排除点位推荐' }
      elseif ($aTitle -match '教程|参数|镜头|该做哪些准备|拍星空为什么|银河拍摄＋后期|vivo拍|尼康z30') { $aDecision='exclude-technique'; $aReason='搜索卡片以器材或拍摄技术为主，未提供可核验机位' }
      elseif ($aTitle -match 'IBHRE|师弟让我投nature|星空大会') { $aDecision='exclude-unrelated'; $aReason='职业、科研或活动内容，未提供本任务地点依据' }
      elseif ($aParts[0] -in @('6a9d37a1000000002900cd52','6a754a0d00000000260356fb','6a7edb00000000002402e583','686652d20000000013011454')) { $aDecision='promotion-unverified'; $aReason='商家或景区账户推广卡片，需独立实拍及通达来源佐证' }
      if ($aParts[0] -in @('6a75b0ed000000003300cbc6','67da3f45000000001203d42a','69f93db9000000001a037b0c','6a7a6bb7000000003301cc0b','6a530dac000000000f01cb24')) {
        $aDepth='detail'
        $aDecision='candidate-context'
        $aReason='已读正文和当前可见评论；详情、地点与限制见 details.md；尚需坐标及管理核准'
      }
      if ($aParts[0] -in @('69f93db9000000001a037b0c','6a7a6bb7000000003301cc0b')) { $aMentions=@('德庆大顶山','杨梅山','18号风车','18–19号风车道路','7号风车','14号风车') }
      [ordered]@{query=$aGroup.Query;noteId=$aParts[0];title=$aTitle;url=('https://www.xiaohongshu.com/search_result/' + $aParts[0]);collectedAt=$aGroup.Time;readDepth=$aDepth;placeMentions=@($aMentions);decision=$aDecision;reason=$aReason} | ConvertTo-Json -Compress
    }
  }
}
[System.IO.File]::WriteAllLines((Join-Path $aDir 'records.jsonl'), $aRecords, [System.Text.UTF8Encoding]::new($false))
$aRecords | ConvertFrom-Json | Group-Object query | Select-Object Name,Count
