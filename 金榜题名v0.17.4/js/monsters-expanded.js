// 由 _parse_monster_docs.js 根据三份怪物图鉴生成；修改图鉴后重新生成。
G.MONSTERS = {
  "chengyu": {
    "id": "chengyu",
    "name": "成语填空",
    "tier": "quiz",
    "subject": "语文",
    "emoji": "📝",
    "hp": 12,
    "intelligence": 4,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "缺一字",
        "type": "logic",
        "desc": "造成 0.6 倍智力伤害",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.6
      },
      {
        "name": "缺一字",
        "type": "logic",
        "desc": "造成 0.6 倍智力伤害",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.6
      },
      {
        "name": "缺一字",
        "type": "logic",
        "desc": "造成 0.6 倍智力伤害",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.6
      },
      {
        "name": "缺一字",
        "type": "logic",
        "desc": "造成 0.6 倍智力伤害",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.6
      },
      {
        "name": "望文生义",
        "type": "idea",
        "desc": "对方选择：弃置一张手牌，或将一张手牌放回牌库顶",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "望文生义",
        "type": "idea",
        "desc": "对方选择：弃置一张手牌，或将一张手牌放回牌库顶",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "张冠李戴",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。若对方本回合已弃过牌，改为 2.5 倍",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "张冠李戴",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。若对方本回合已弃过牌，改为 2.5 倍",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      }
    ]
  },
  "q02": {
    "id": "q02",
    "name": "阅读理解",
    "tier": "quiz",
    "subject": "语文",
    "emoji": "📝",
    "hp": 14,
    "intelligence": 3,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "通读全文",
        "type": "idea",
        "desc": "下回合开始时，对方若手牌 >= 5 张，受到 4 点伤害",
        "cost": 1,
        "mFixedDamage": 4
      },
      {
        "name": "通读全文",
        "type": "idea",
        "desc": "下回合开始时，对方若手牌 >= 5 张，受到 4 点伤害",
        "cost": 1,
        "mFixedDamage": 4
      },
      {
        "name": "细节考查",
        "type": "logic",
        "desc": "造成 1 倍智力伤害。若对方上回合使用过与上上回合名称相同的卡牌，伤害翻倍",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "细节考查",
        "type": "logic",
        "desc": "造成 1 倍智力伤害。若对方上回合使用过与上上回合名称相同的卡牌，伤害翻倍",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "主旨大意",
        "type": "idea",
        "desc": "对方若在 2 回合内未使用解答卡，受到 6 点伤害",
        "cost": 2,
        "mFixedDamage": 6
      }
    ]
  },
  "jitu": {
    "id": "jitu",
    "name": "鸡兔同笼",
    "tier": "quiz",
    "subject": "数学",
    "emoji": "📐",
    "hp": 10,
    "intelligence": 3,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "数头",
        "type": "logic",
        "desc": "造成 0.7 倍智力伤害",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 0.7
      },
      {
        "name": "数头",
        "type": "logic",
        "desc": "造成 0.7 倍智力伤害",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 0.7
      },
      {
        "name": "数头",
        "type": "logic",
        "desc": "造成 0.7 倍智力伤害",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 0.7
      },
      {
        "name": "数头",
        "type": "logic",
        "desc": "造成 0.7 倍智力伤害",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 0.7
      },
      {
        "name": "数头",
        "type": "logic",
        "desc": "造成 0.7 倍智力伤害",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 0.7
      },
      {
        "name": "数脚",
        "type": "logic",
        "desc": "造成 1 倍智力伤害。若打出后双方手牌数不等，额外造成 2.5 倍智力伤害",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1,
        "unequalHandExtraMult": 2.5
      },
      {
        "name": "数脚",
        "type": "logic",
        "desc": "造成 1 倍智力伤害。若打出后双方手牌数不等，额外造成 2.5 倍智力伤害",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1,
        "unequalHandExtraMult": 2.5
      },
      {
        "name": "数脚",
        "type": "logic",
        "desc": "造成 1 倍智力伤害。若打出后双方手牌数不等，额外造成 2.5 倍智力伤害",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1,
        "unequalHandExtraMult": 2.5
      },
      {
        "name": "数脚",
        "type": "logic",
        "desc": "造成 1 倍智力伤害。若打出后双方手牌数不等，额外造成 2.5 倍智力伤害",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1,
        "unequalHandExtraMult": 2.5
      },
      {
        "name": "抬起一只脚",
        "type": "idea",
        "desc": "弃置对方一张牌。若打出后双方手牌数不等，对方摸一张牌",
        "cost": 1,
        "mDiscardPlayer": 1
      },
      {
        "name": "抬起一只脚",
        "type": "idea",
        "desc": "弃置对方一张牌。若打出后双方手牌数不等，对方摸一张牌",
        "cost": 1,
        "mDiscardPlayer": 1
      }
    ]
  },
  "q04": {
    "id": "q04",
    "name": "几何证明",
    "tier": "quiz",
    "subject": "数学",
    "emoji": "📐",
    "hp": 13,
    "intelligence": 4,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "已知条件",
        "type": "idea",
        "desc": "对方下张逻辑卡需额外支付 1 点体力才能使用（不可叠加）",
        "cost": 0,
        "mPlayerNextLogicCost": 1
      },
      {
        "name": "已知条件",
        "type": "idea",
        "desc": "对方下张逻辑卡需额外支付 1 点体力才能使用（不可叠加）",
        "cost": 0,
        "mPlayerNextLogicCost": 1
      },
      {
        "name": "已知条件",
        "type": "idea",
        "desc": "对方下张逻辑卡需额外支付 1 点体力才能使用（不可叠加）",
        "cost": 0,
        "mPlayerNextLogicCost": 1
      },
      {
        "name": "求证",
        "type": "logic",
        "desc": "造成 1.2 倍智力伤害。若对方当前体力为 0，伤害翻倍",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1.2
      },
      {
        "name": "求证",
        "type": "logic",
        "desc": "造成 1.2 倍智力伤害。若对方当前体力为 0，伤害翻倍",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1.2
      },
      {
        "name": "反证法",
        "type": "idea",
        "desc": "本回合对方每受到 1 次伤害，下回合少摸 1 张牌（最多 3 张）",
        "cost": 2,
        "mDraw": 1,
        "mPlayerDrawPenalty": 1
      }
    ]
  },
  "q05": {
    "id": "q05",
    "name": "时态填空",
    "tier": "quiz",
    "subject": "英语",
    "emoji": "🔤",
    "hp": 11,
    "intelligence": 3,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "过去式",
        "type": "logic",
        "desc": "造成 0.7 倍智力伤害。对方从弃牌堆选一张牌洗回牌库",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.7
      },
      {
        "name": "过去式",
        "type": "logic",
        "desc": "造成 0.7 倍智力伤害。对方从弃牌堆选一张牌洗回牌库",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.7
      },
      {
        "name": "过去式",
        "type": "logic",
        "desc": "造成 0.7 倍智力伤害。对方从弃牌堆选一张牌洗回牌库",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.7
      },
      {
        "name": "将来时",
        "type": "idea",
        "desc": "3 回合后，对对方造成 5 点伤害（倒计时结束时无论怪物是否存活都触发）",
        "cost": 2,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "将来时",
        "type": "idea",
        "desc": "3 回合后，对对方造成 5 点伤害（倒计时结束时无论怪物是否存活都触发）",
        "cost": 2,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "现在完成时",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。若对方弃牌堆 >= 8 张，伤害 +50%",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "现在完成时",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。若对方弃牌堆 >= 8 张，伤害 +50%",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      }
    ]
  },
  "q06": {
    "id": "q06",
    "name": "翻译判断",
    "tier": "quiz",
    "subject": "英语",
    "emoji": "🔤",
    "hp": 13,
    "intelligence": 0,
    "eq": 4,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "英译中",
        "type": "logic",
        "desc": "造成 0.8 倍情商伤害。若对方手牌 >= 5 张，额外造成 0.5 倍",
        "cost": 0,
        "dmgStat": "eq",
        "dmgMult": 0.8
      },
      {
        "name": "英译中",
        "type": "logic",
        "desc": "造成 0.8 倍情商伤害。若对方手牌 >= 5 张，额外造成 0.5 倍",
        "cost": 0,
        "dmgStat": "eq",
        "dmgMult": 0.8
      },
      {
        "name": "英译中",
        "type": "logic",
        "desc": "造成 0.8 倍情商伤害。若对方手牌 >= 5 张，额外造成 0.5 倍",
        "cost": 0,
        "dmgStat": "eq",
        "dmgMult": 0.8
      },
      {
        "name": "中译英",
        "type": "idea",
        "desc": "对方摸 2 张牌，然后其所有手牌本回合消耗 +1",
        "cost": 1,
        "mPlayerDraw": 2
      },
      {
        "name": "中译英",
        "type": "idea",
        "desc": "对方摸 2 张牌，然后其所有手牌本回合消耗 +1",
        "cost": 1,
        "mPlayerDraw": 2
      },
      {
        "name": "误译陷阱",
        "type": "idea",
        "desc": "对方手牌中随机 1 张的效果变为\"对自己造成 2 点伤害\"，直到使用或丢弃",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "误译陷阱",
        "type": "idea",
        "desc": "对方手牌中随机 1 张的效果变为\"对自己造成 2 点伤害\"，直到使用或丢弃",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      }
    ]
  },
  "q07": {
    "id": "q07",
    "name": "牛顿定律",
    "tier": "quiz",
    "subject": "物理",
    "emoji": "⚡",
    "hp": 16,
    "intelligence": 4,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "惯性",
        "type": "idea",
        "desc": "获得 4 点护盾",
        "cost": 1,
        "mShield": 4
      },
      {
        "name": "惯性",
        "type": "idea",
        "desc": "获得 4 点护盾",
        "cost": 1,
        "mShield": 4
      },
      {
        "name": "惯性",
        "type": "idea",
        "desc": "获得 4 点护盾",
        "cost": 1,
        "mShield": 4
      },
      {
        "name": "作用力",
        "type": "logic",
        "desc": "造成 1 倍智力伤害",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "作用力",
        "type": "logic",
        "desc": "造成 1 倍智力伤害",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "作用力",
        "type": "logic",
        "desc": "造成 1 倍智力伤害",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "反作用力",
        "type": "logic",
        "desc": "本回合每受到 1 次来自对方的伤害，此卡伤害 +2（使用后重置计数）",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.75
      },
      {
        "name": "反作用力",
        "type": "logic",
        "desc": "本回合每受到 1 次来自对方的伤害，此卡伤害 +2（使用后重置计数）",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.75
      }
    ]
  },
  "q08": {
    "id": "q08",
    "name": "光学基础",
    "tier": "quiz",
    "subject": "物理",
    "emoji": "⚡",
    "hp": 12,
    "intelligence": 3,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "折射",
        "type": "logic",
        "desc": "造成 0.5 倍智力伤害，无视对方一半护盾值",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.5
      },
      {
        "name": "折射",
        "type": "logic",
        "desc": "造成 0.5 倍智力伤害，无视对方一半护盾值",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.5
      },
      {
        "name": "折射",
        "type": "logic",
        "desc": "造成 0.5 倍智力伤害，无视对方一半护盾值",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.5
      },
      {
        "name": "折射",
        "type": "logic",
        "desc": "造成 0.5 倍智力伤害，无视对方一半护盾值",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.5
      },
      {
        "name": "反射",
        "type": "idea",
        "desc": "本回合若受到伤害，对对方造成等量伤害（仅触发一次）",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "反射",
        "type": "idea",
        "desc": "本回合若受到伤害，对对方造成等量伤害（仅触发一次）",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "聚焦",
        "type": "idea",
        "desc": "下回合造成的所有伤害翻倍。但对方下回合造成的伤害也翻倍",
        "cost": 2,
        "mShield": 2,
        "ruleFallback": true
      }
    ]
  },
  "fangcheng": {
    "id": "fangcheng",
    "name": "化学方程式",
    "tier": "quiz",
    "subject": "化学",
    "emoji": "🧪",
    "hp": 13,
    "intelligence": 3,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "配平",
        "type": "idea",
        "desc": "对方手牌数与怪物手牌数之差每有 1 张，对方受到 1 点伤害",
        "cost": 0,
        "mFixedDamage": 1
      },
      {
        "name": "配平",
        "type": "idea",
        "desc": "对方手牌数与怪物手牌数之差每有 1 张，对方受到 1 点伤害",
        "cost": 0,
        "mFixedDamage": 1
      },
      {
        "name": "配平",
        "type": "idea",
        "desc": "对方手牌数与怪物手牌数之差每有 1 张，对方受到 1 点伤害",
        "cost": 0,
        "mFixedDamage": 1
      },
      {
        "name": "反应物",
        "type": "logic",
        "desc": "造成 1 倍智力伤害",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "反应物",
        "type": "logic",
        "desc": "造成 1 倍智力伤害",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "反应物",
        "type": "logic",
        "desc": "造成 1 倍智力伤害",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "催化剂",
        "type": "idea",
        "desc": "摸 3 张牌。此卡不进入弃牌堆，改为移出战斗（移除）",
        "cost": 2,
        "mDraw": 3
      }
    ]
  },
  "q10": {
    "id": "q10",
    "name": "元素推断",
    "tier": "quiz",
    "subject": "化学",
    "emoji": "🧪",
    "hp": 14,
    "intelligence": 3,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "周期律",
        "type": "idea",
        "desc": "检视对方手牌。每检视到 1 张思路卡，对方受到 1 点伤害",
        "cost": 1,
        "mFixedDamage": 1
      },
      {
        "name": "周期律",
        "type": "idea",
        "desc": "检视对方手牌。每检视到 1 张思路卡，对方受到 1 点伤害",
        "cost": 1,
        "mFixedDamage": 1
      },
      {
        "name": "化合反应",
        "type": "logic",
        "desc": "造成 1.2 倍智力伤害。若对方手牌中有思路卡，弃置其中 1 张",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1.2
      },
      {
        "name": "化合反应",
        "type": "logic",
        "desc": "造成 1.2 倍智力伤害。若对方手牌中有思路卡，弃置其中 1 张",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1.2
      },
      {
        "name": "置换反应",
        "type": "idea",
        "desc": "选择对方一张手牌弃置，然后对方摸一张同类型卡牌（逻辑/思路随机）",
        "cost": 2,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "置换反应",
        "type": "idea",
        "desc": "选择对方一张手牌弃置，然后对方摸一张同类型卡牌（逻辑/思路随机）",
        "cost": 2,
        "mShield": 2,
        "ruleFallback": true
      }
    ]
  },
  "q11": {
    "id": "q11",
    "name": "细胞结构",
    "tier": "quiz",
    "subject": "生物",
    "emoji": "🧬",
    "hp": 15,
    "intelligence": 2,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "细胞壁",
        "type": "idea",
        "desc": "获得 3 点护盾。此护盾存在期间，每回合结束时回复 2 点生命",
        "cost": 1,
        "mShield": 3,
        "mHeal": 2
      },
      {
        "name": "细胞壁",
        "type": "idea",
        "desc": "获得 3 点护盾。此护盾存在期间，每回合结束时回复 2 点生命",
        "cost": 1,
        "mShield": 3,
        "mHeal": 2
      },
      {
        "name": "渗透作用",
        "type": "logic",
        "desc": "造成 0.8 倍智力伤害。对方每有 2 点护盾，额外造成 1 点伤害",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 0.8
      },
      {
        "name": "渗透作用",
        "type": "logic",
        "desc": "造成 0.8 倍智力伤害。对方每有 2 点护盾，额外造成 1 点伤害",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 0.8
      },
      {
        "name": "有丝分裂",
        "type": "idea",
        "desc": "将弃牌堆中所有逻辑卡洗回牌库，然后摸 2 张",
        "cost": 2,
        "mShield": 2,
        "ruleFallback": true
      }
    ]
  },
  "q12": {
    "id": "q12",
    "name": "遗传推断",
    "tier": "quiz",
    "subject": "生物",
    "emoji": "🧬",
    "hp": 11,
    "intelligence": 4,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "杂交实验",
        "type": "idea",
        "desc": "对方摸 1 张，然后弃 1 张（自选）。若弃的是逻辑卡，对方受到 2 点伤害",
        "cost": 0,
        "mFixedDamage": 2,
        "mPlayerDraw": 1,
        "mDiscardPlayer": 1
      },
      {
        "name": "杂交实验",
        "type": "idea",
        "desc": "对方摸 1 张，然后弃 1 张（自选）。若弃的是逻辑卡，对方受到 2 点伤害",
        "cost": 0,
        "mFixedDamage": 2,
        "mPlayerDraw": 1,
        "mDiscardPlayer": 1
      },
      {
        "name": "杂交实验",
        "type": "idea",
        "desc": "对方摸 1 张，然后弃 1 张（自选）。若弃的是逻辑卡，对方受到 2 点伤害",
        "cost": 0,
        "mFixedDamage": 2,
        "mPlayerDraw": 1,
        "mDiscardPlayer": 1
      },
      {
        "name": "性状分离",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。双方各展示牌库顶 1 张牌，若类型不同则伤害翻倍",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "性状分离",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。双方各展示牌库顶 1 张牌，若类型不同则伤害翻倍",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "显隐性判断",
        "type": "idea",
        "desc": "对方选择：展示手牌，或受到 3 点伤害",
        "cost": 1,
        "mFixedDamage": 3
      },
      {
        "name": "显隐性判断",
        "type": "idea",
        "desc": "对方选择：展示手牌，或受到 3 点伤害",
        "cost": 1,
        "mFixedDamage": 3
      }
    ]
  },
  "q13": {
    "id": "q13",
    "name": "时政填空",
    "tier": "quiz",
    "subject": "政治",
    "emoji": "⚖️",
    "hp": 12,
    "intelligence": 0,
    "eq": 3,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "时事热点",
        "type": "idea",
        "desc": "对方牌库顶 2 张牌进入弃牌堆。若其中有解答卡，对方受到 3 点伤害",
        "cost": 0,
        "mFixedDamage": 3,
        "mMillPlayer": 2
      },
      {
        "name": "时事热点",
        "type": "idea",
        "desc": "对方牌库顶 2 张牌进入弃牌堆。若其中有解答卡，对方受到 3 点伤害",
        "cost": 0,
        "mFixedDamage": 3,
        "mMillPlayer": 2
      },
      {
        "name": "时事热点",
        "type": "idea",
        "desc": "对方牌库顶 2 张牌进入弃牌堆。若其中有解答卡，对方受到 3 点伤害",
        "cost": 0,
        "mFixedDamage": 3,
        "mMillPlayer": 2
      },
      {
        "name": "政策解读",
        "type": "logic",
        "desc": "造成 1 倍情商伤害。若对方弃牌堆 >= 10 张，额外造成 1 倍情商伤害",
        "cost": 1,
        "dmgStat": "eq",
        "dmgMult": 1
      },
      {
        "name": "政策解读",
        "type": "logic",
        "desc": "造成 1 倍情商伤害。若对方弃牌堆 >= 10 张，额外造成 1 倍情商伤害",
        "cost": 1,
        "dmgStat": "eq",
        "dmgMult": 1
      },
      {
        "name": "政策解读",
        "type": "logic",
        "desc": "造成 1 倍情商伤害。若对方弃牌堆 >= 10 张，额外造成 1 倍情商伤害",
        "cost": 1,
        "dmgStat": "eq",
        "dmgMult": 1
      },
      {
        "name": "舆论导向",
        "type": "idea",
        "desc": "对方本回合使用的下一张卡牌效果改为\"对自己造成 2 点伤害\"",
        "cost": 2,
        "mShield": 2,
        "ruleFallback": true
      }
    ]
  },
  "q14": {
    "id": "q14",
    "name": "辨析题",
    "tier": "quiz",
    "subject": "政治",
    "emoji": "⚖️",
    "hp": 13,
    "intelligence": 0,
    "eq": 4,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "判断正误",
        "type": "idea",
        "desc": "对方随机展示 1 张手牌。若为逻辑卡，对方失去 2 点生命；若为思路卡，怪物获得 3 点护盾",
        "cost": 0,
        "mShield": 3
      },
      {
        "name": "判断正误",
        "type": "idea",
        "desc": "对方随机展示 1 张手牌。若为逻辑卡，对方失去 2 点生命；若为思路卡，怪物获得 3 点护盾",
        "cost": 0,
        "mShield": 3
      },
      {
        "name": "判断正误",
        "type": "idea",
        "desc": "对方随机展示 1 张手牌。若为逻辑卡，对方失去 2 点生命；若为思路卡，怪物获得 3 点护盾",
        "cost": 0,
        "mShield": 3
      },
      {
        "name": "说明理由",
        "type": "logic",
        "desc": "造成 1 倍情商伤害。若对方本回合还未使用过卡牌，伤害 +50%",
        "cost": 1,
        "dmgStat": "eq",
        "dmgMult": 1
      },
      {
        "name": "说明理由",
        "type": "logic",
        "desc": "造成 1 倍情商伤害。若对方本回合还未使用过卡牌，伤害 +50%",
        "cost": 1,
        "dmgStat": "eq",
        "dmgMult": 1
      },
      {
        "name": "说明理由",
        "type": "logic",
        "desc": "造成 1 倍情商伤害。若对方本回合还未使用过卡牌，伤害 +50%",
        "cost": 1,
        "dmgStat": "eq",
        "dmgMult": 1
      },
      {
        "name": "举例论证",
        "type": "logic",
        "desc": "造成 1.5 倍情商伤害。对方需弃 1 张与展示牌同类型的牌，否则伤害翻倍",
        "cost": 2,
        "dmgStat": "eq",
        "dmgMult": 1.5
      }
    ]
  },
  "q15": {
    "id": "q15",
    "name": "年代排序",
    "tier": "quiz",
    "subject": "历史",
    "emoji": "📜",
    "hp": 14,
    "intelligence": 3,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "打乱顺序",
        "type": "idea",
        "desc": "对方将手牌按消耗从高到低排列在牌库顶（自己不选顺序）",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "打乱顺序",
        "type": "idea",
        "desc": "对方将手牌按消耗从高到低排列在牌库顶（自己不选顺序）",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "断代",
        "type": "logic",
        "desc": "造成 1 倍智力伤害。若对方本回合摸过牌，额外造成 0.5 倍",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "断代",
        "type": "logic",
        "desc": "造成 1 倍智力伤害。若对方本回合摸过牌，额外造成 0.5 倍",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "断代",
        "type": "logic",
        "desc": "造成 1 倍智力伤害。若对方本回合摸过牌，额外造成 0.5 倍",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "编年史",
        "type": "idea",
        "desc": "对方下回合少摸 1 张牌。此效果持续 2 回合",
        "cost": 2,
        "mDraw": 1,
        "mPlayerDrawPenalty": 1
      }
    ]
  },
  "q16": {
    "id": "q16",
    "name": "材料分析",
    "tier": "quiz",
    "subject": "历史",
    "emoji": "📜",
    "hp": 12,
    "intelligence": 0,
    "eq": 3,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "阅读材料",
        "type": "idea",
        "desc": "对方摸 2 张牌。2 回合后，对方弃牌堆每有 1 张在此期间使用的牌，受到 1 点伤害",
        "cost": 0,
        "mPlayerDraw": 2,
        "mFixedDamage": 1
      },
      {
        "name": "阅读材料",
        "type": "idea",
        "desc": "对方摸 2 张牌。2 回合后，对方弃牌堆每有 1 张在此期间使用的牌，受到 1 点伤害",
        "cost": 0,
        "mPlayerDraw": 2,
        "mFixedDamage": 1
      },
      {
        "name": "提取信息",
        "type": "idea",
        "desc": "选择对方弃牌堆中 1 张牌移出战斗（移除该卡本场战斗）",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "提取信息",
        "type": "idea",
        "desc": "选择对方弃牌堆中 1 张牌移出战斗（移除该卡本场战斗）",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "归纳总结",
        "type": "logic",
        "desc": "造成（对方手牌数）点伤害",
        "cost": 2,
        "dmgStat": "eq",
        "dmgMult": 0.75
      }
    ]
  },
  "q17": {
    "id": "q17",
    "name": "气候分布",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 13,
    "intelligence": 3,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "梅雨季",
        "type": "idea",
        "desc": "本回合双方所有卡牌消耗 +1（怪物不受此影响）",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "梅雨季",
        "type": "idea",
        "desc": "本回合双方所有卡牌消耗 +1（怪物不受此影响）",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "旱季",
        "type": "idea",
        "desc": "下回合双方体力回复 -1",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "旱季",
        "type": "idea",
        "desc": "下回合双方体力回复 -1",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "台风登陆",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。若对方当前体力 <= 1，伤害翻倍",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "台风登陆",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。若对方当前体力 <= 1，伤害翻倍",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      }
    ]
  },
  "q18": {
    "id": "q18",
    "name": "地形判断",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 16,
    "intelligence": 0,
    "eq": 0,
    "physique": 4,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "悬崖",
        "type": "idea",
        "desc": "对方下回合使用的第一张卡牌消耗翻倍",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "悬崖",
        "type": "idea",
        "desc": "对方下回合使用的第一张卡牌消耗翻倍",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "沼泽",
        "type": "idea",
        "desc": "对方本回合每使用 1 张卡牌，失去 1 点生命",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "沼泽",
        "type": "idea",
        "desc": "对方本回合每使用 1 张卡牌，失去 1 点生命",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "山崩",
        "type": "logic",
        "desc": "造成 1.5 倍体魄伤害。移除对方所有护盾后再计算伤害",
        "cost": 2,
        "dmgStat": "physique",
        "dmgMult": 1.5
      },
      {
        "name": "山崩",
        "type": "logic",
        "desc": "造成 1.5 倍体魄伤害。移除对方所有护盾后再计算伤害",
        "cost": 2,
        "dmgStat": "physique",
        "dmgMult": 1.5
      },
      {
        "name": "平原",
        "type": "logic",
        "desc": "造成 0.8 倍体魄伤害",
        "cost": 0,
        "dmgStat": "physique",
        "dmgMult": 0.8
      },
      {
        "name": "平原",
        "type": "logic",
        "desc": "造成 0.8 倍体魄伤害",
        "cost": 0,
        "dmgStat": "physique",
        "dmgMult": 0.8
      },
      {
        "name": "平原",
        "type": "logic",
        "desc": "造成 0.8 倍体魄伤害",
        "cost": 0,
        "dmgStat": "physique",
        "dmgMult": 0.8
      }
    ]
  },
  "q19": {
    "id": "q19",
    "name": "跨学科综合",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 18,
    "intelligence": 4,
    "eq": 3,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "学科交叉",
        "type": "idea",
        "desc": "对方选择：本回合所有逻辑卡消耗 +1，或本回合所有思路卡消耗 +1",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "学科交叉",
        "type": "idea",
        "desc": "对方选择：本回合所有逻辑卡消耗 +1，或本回合所有思路卡消耗 +1",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "综合应用",
        "type": "logic",
        "desc": "造成（智力 + 情商）x0.5 的伤害。弃置对方弃牌堆顶 3 张牌",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 0.75
      },
      {
        "name": "综合应用",
        "type": "logic",
        "desc": "造成（智力 + 情商）x0.5 的伤害。弃置对方弃牌堆顶 3 张牌",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 0.75
      },
      {
        "name": "综合应用",
        "type": "logic",
        "desc": "造成（智力 + 情商）x0.5 的伤害。弃置对方弃牌堆顶 3 张牌",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 0.75
      },
      {
        "name": "超纲题",
        "type": "idea",
        "desc": "对方展示手牌中所有解答卡。每展示 1 张，对方受到 4 点伤害。展示后这些卡回到手牌",
        "cost": 2,
        "mFixedDamage": 4
      }
    ]
  },
  "q20": {
    "id": "q20",
    "name": "脑筋急转弯",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 10,
    "intelligence": 0,
    "eq": 5,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "陷阱题",
        "type": "idea",
        "desc": "对方若本回合使用的第一张卡牌为逻辑卡，受到 3 点伤害",
        "cost": 0,
        "mFixedDamage": 3
      },
      {
        "name": "陷阱题",
        "type": "idea",
        "desc": "对方若本回合使用的第一张卡牌为逻辑卡，受到 3 点伤害",
        "cost": 0,
        "mFixedDamage": 3
      },
      {
        "name": "陷阱题",
        "type": "idea",
        "desc": "对方若本回合使用的第一张卡牌为逻辑卡，受到 3 点伤害",
        "cost": 0,
        "mFixedDamage": 3
      },
      {
        "name": "偷换概念",
        "type": "idea",
        "desc": "选择对方 1 张手牌，将其消耗变为 3（本场战斗），该牌效果不变",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "偷换概念",
        "type": "idea",
        "desc": "选择对方 1 张手牌，将其消耗变为 3（本场战斗），该牌效果不变",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "脑筋急转弯",
        "type": "logic",
        "desc": "造成 2 倍情商伤害。若对方手牌数与你相差 >= 3 张，改为 3 倍",
        "cost": 3,
        "dmgStat": "eq",
        "dmgMult": 2
      }
    ]
  },
  "q21": {
    "id": "q21",
    "name": "病句修改",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 12,
    "intelligence": 0,
    "eq": 3,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "挑语病",
        "type": "idea",
        "desc": "选择对方 1 张手牌，使其本场战斗效果中的数值 -1（最低为 1）",
        "cost": 0,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "挑语病",
        "type": "idea",
        "desc": "选择对方 1 张手牌，使其本场战斗效果中的数值 -1（最低为 1）",
        "cost": 0,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "挑语病",
        "type": "idea",
        "desc": "选择对方 1 张手牌，使其本场战斗效果中的数值 -1（最低为 1）",
        "cost": 0,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "改错",
        "type": "logic",
        "desc": "造成 0.8 倍情商伤害。若对方手牌中有被\"挑语病\"修改过的牌，额外造成 1 倍",
        "cost": 1,
        "dmgStat": "eq",
        "dmgMult": 0.8
      },
      {
        "name": "改错",
        "type": "logic",
        "desc": "造成 0.8 倍情商伤害。若对方手牌中有被\"挑语病\"修改过的牌，额外造成 1 倍",
        "cost": 1,
        "dmgStat": "eq",
        "dmgMult": 0.8
      },
      {
        "name": "成分残缺",
        "type": "idea",
        "desc": "对方下回合开始时的摸牌数 -1，且体力回复 -1",
        "cost": 2,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "成分残缺",
        "type": "idea",
        "desc": "对方下回合开始时的摸牌数 -1，且体力回复 -1",
        "cost": 2,
        "mShield": 2,
        "ruleFallback": true
      }
    ]
  },
  "q22": {
    "id": "q22",
    "name": "作文立意",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 15,
    "intelligence": 0,
    "eq": 4,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "审题",
        "type": "idea",
        "desc": "对方本回合使用的第一张非逻辑卡效果无效（消耗照扣）",
        "cost": 0,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "审题",
        "type": "idea",
        "desc": "对方本回合使用的第一张非逻辑卡效果无效（消耗照扣）",
        "cost": 0,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "审题",
        "type": "idea",
        "desc": "对方本回合使用的第一张非逻辑卡效果无效（消耗照扣）",
        "cost": 0,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "偏题警告",
        "type": "logic",
        "desc": "造成 1 倍情商伤害。若对方上回合一张牌都没用，伤害翻倍",
        "cost": 1,
        "dmgStat": "eq",
        "dmgMult": 1
      },
      {
        "name": "偏题警告",
        "type": "logic",
        "desc": "造成 1 倍情商伤害。若对方上回合一张牌都没用，伤害翻倍",
        "cost": 1,
        "dmgStat": "eq",
        "dmgMult": 1
      },
      {
        "name": "跑题",
        "type": "idea",
        "desc": "对方手牌中所有逻辑卡本回合消耗 +2",
        "cost": 2,
        "mShield": 2,
        "ruleFallback": true
      }
    ]
  },
  "q23": {
    "id": "q23",
    "name": "概率计算",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 11,
    "intelligence": 3,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "掷硬币",
        "type": "idea",
        "desc": "随机：1.怪物摸 2 张牌 2.对方弃 1 张牌 3.无事发生",
        "cost": 0,
        "mDraw": 2
      },
      {
        "name": "掷硬币",
        "type": "idea",
        "desc": "随机：1.怪物摸 2 张牌 2.对方弃 1 张牌 3.无事发生",
        "cost": 0,
        "mDraw": 2
      },
      {
        "name": "掷硬币",
        "type": "idea",
        "desc": "随机：1.怪物摸 2 张牌 2.对方弃 1 张牌 3.无事发生",
        "cost": 0,
        "mDraw": 2
      },
      {
        "name": "摸球",
        "type": "logic",
        "desc": "对方从牌库随机展示 3 张，其中每有 1 张逻辑卡受到 1 点伤害。展示后洗回",
        "cost": 2,
        "mFixedDamage": 1
      },
      {
        "name": "摸球",
        "type": "logic",
        "desc": "对方从牌库随机展示 3 张，其中每有 1 张逻辑卡受到 1 点伤害。展示后洗回",
        "cost": 2,
        "mFixedDamage": 1
      },
      {
        "name": "独立事件",
        "type": "idea",
        "desc": "对方下次受到的伤害，有 50% 概率翻倍，50% 概率减半",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "独立事件",
        "type": "idea",
        "desc": "对方下次受到的伤害，有 50% 概率翻倍，50% 概率减半",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      }
    ]
  },
  "q24": {
    "id": "q24",
    "name": "函数图像",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 14,
    "intelligence": 4,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "描点",
        "type": "idea",
        "desc": "检视对方牌库顶 1 张牌。若其消耗 >= 2，对方受到 2 点伤害",
        "cost": 0,
        "mFixedDamage": 2
      },
      {
        "name": "描点",
        "type": "idea",
        "desc": "检视对方牌库顶 1 张牌。若其消耗 >= 2，对方受到 2 点伤害",
        "cost": 0,
        "mFixedDamage": 2
      },
      {
        "name": "描点",
        "type": "idea",
        "desc": "检视对方牌库顶 1 张牌。若其消耗 >= 2，对方受到 2 点伤害",
        "cost": 0,
        "mFixedDamage": 2
      },
      {
        "name": "单调递增",
        "type": "logic",
        "desc": "造成 1 倍智力伤害。对方连续使用卡牌时，每张比前一张消耗大则额外触发 0.5 倍",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "单调递增",
        "type": "logic",
        "desc": "造成 1 倍智力伤害。对方连续使用卡牌时，每张比前一张消耗大则额外触发 0.5 倍",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "单调递增",
        "type": "logic",
        "desc": "造成 1 倍智力伤害。对方连续使用卡牌时，每张比前一张消耗大则额外触发 0.5 倍",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "极值点",
        "type": "idea",
        "desc": "对方手牌中消耗最高的一张牌本回合无法使用",
        "cost": 2,
        "mShield": 2,
        "ruleFallback": true
      }
    ]
  },
  "q25": {
    "id": "q25",
    "name": "听力测试",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 11,
    "intelligence": 3,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "听写",
        "type": "idea",
        "desc": "对方需在 2 回合内使用至少 3 张卡牌，否则受到 5 点伤害",
        "cost": 1,
        "mFixedDamage": 5
      },
      {
        "name": "听写",
        "type": "idea",
        "desc": "对方需在 2 回合内使用至少 3 张卡牌，否则受到 5 点伤害",
        "cost": 1,
        "mFixedDamage": 5
      },
      {
        "name": "速记",
        "type": "logic",
        "desc": "造成 0.5 倍智力伤害。若对方本回合已使用 >= 2 张牌，改为 1.5 倍",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.5
      },
      {
        "name": "速记",
        "type": "logic",
        "desc": "造成 0.5 倍智力伤害。若对方本回合已使用 >= 2 张牌，改为 1.5 倍",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.5
      },
      {
        "name": "速记",
        "type": "logic",
        "desc": "造成 0.5 倍智力伤害。若对方本回合已使用 >= 2 张牌，改为 1.5 倍",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.5
      },
      {
        "name": "漏听",
        "type": "idea",
        "desc": "对方选择：跳过下回合摸牌阶段，或跳过下回合体力回复",
        "cost": 2,
        "mShield": 2,
        "ruleFallback": true
      }
    ]
  },
  "q26": {
    "id": "q26",
    "name": "单项选择",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 13,
    "intelligence": 3,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "四选一",
        "type": "idea",
        "desc": "对方从手牌中选 1 张展示。若为逻辑卡：失去 2 点生命；若为思路卡：弃置该牌；若为解答卡：怪物获得 5 点护盾",
        "cost": 0,
        "mShield": 5
      },
      {
        "name": "四选一",
        "type": "idea",
        "desc": "对方从手牌中选 1 张展示。若为逻辑卡：失去 2 点生命；若为思路卡：弃置该牌；若为解答卡：怪物获得 5 点护盾",
        "cost": 0,
        "mShield": 5
      },
      {
        "name": "四选一",
        "type": "idea",
        "desc": "对方从手牌中选 1 张展示。若为逻辑卡：失去 2 点生命；若为思路卡：弃置该牌；若为解答卡：怪物获得 5 点护盾",
        "cost": 0,
        "mShield": 5
      },
      {
        "name": "排除法",
        "type": "idea",
        "desc": "弃置对方弃牌堆中最近进入的 2 张牌",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "排除法",
        "type": "idea",
        "desc": "弃置对方弃牌堆中最近进入的 2 张牌",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "蒙对",
        "type": "logic",
        "desc": "造成 2 倍智力伤害。对方可以弃 2 张牌使此伤害减半",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 2
      }
    ]
  },
  "q27": {
    "id": "q27",
    "name": "浮力计算",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 15,
    "intelligence": 3,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "排水体积",
        "type": "idea",
        "desc": "对方生命每比你少 5 点，受到 1 点伤害",
        "cost": 1,
        "mFixedDamage": 1
      },
      {
        "name": "排水体积",
        "type": "idea",
        "desc": "对方生命每比你少 5 点，受到 1 点伤害",
        "cost": 1,
        "mFixedDamage": 1
      },
      {
        "name": "沉浮",
        "type": "idea",
        "desc": "若对方生命高于 50%，对方受到 3 点伤害；若低于 50%，怪物回复 4 点生命",
        "cost": 1,
        "mHeal": 4,
        "mFixedDamage": 3
      },
      {
        "name": "沉浮",
        "type": "idea",
        "desc": "若对方生命高于 50%，对方受到 3 点伤害；若低于 50%，怪物回复 4 点生命",
        "cost": 1,
        "mHeal": 4,
        "mFixedDamage": 3
      },
      {
        "name": "浮力定律",
        "type": "logic",
        "desc": "造成（对方最大生命 - 对方当前生命）x0.3 的伤害",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 0.75
      },
      {
        "name": "浮力定律",
        "type": "logic",
        "desc": "造成（对方最大生命 - 对方当前生命）x0.3 的伤害",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 0.75
      }
    ]
  },
  "q28": {
    "id": "q28",
    "name": "电磁感应",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 13,
    "intelligence": 4,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "通电线圈",
        "type": "idea",
        "desc": "本回合对方每使用 1 张卡牌，下回合开始时受到 1 点伤害",
        "cost": 1,
        "mFixedDamage": 1
      },
      {
        "name": "通电线圈",
        "type": "idea",
        "desc": "本回合对方每使用 1 张卡牌，下回合开始时受到 1 点伤害",
        "cost": 1,
        "mFixedDamage": 1
      },
      {
        "name": "切割磁感线",
        "type": "logic",
        "desc": "造成 0.8 倍智力伤害。对方每有 1 点未使用的体力，伤害 +0.3 倍",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 0.8
      },
      {
        "name": "切割磁感线",
        "type": "logic",
        "desc": "造成 0.8 倍智力伤害。对方每有 1 点未使用的体力，伤害 +0.3 倍",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 0.8
      },
      {
        "name": "切割磁感线",
        "type": "logic",
        "desc": "造成 0.8 倍智力伤害。对方每有 1 点未使用的体力，伤害 +0.3 倍",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 0.8
      },
      {
        "name": "电磁铁",
        "type": "idea",
        "desc": "从对方弃牌堆选择 1 张牌。本场战斗该牌的同名卡消耗 +1（对双方都生效）",
        "cost": 2,
        "mShield": 2,
        "ruleFallback": true
      }
    ]
  },
  "q29": {
    "id": "q29",
    "name": "酸碱中和",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 14,
    "intelligence": 3,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "酸性攻击",
        "type": "logic",
        "desc": "造成 0.8 倍智力伤害，无视护盾",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.8,
        "pierce": true
      },
      {
        "name": "酸性攻击",
        "type": "logic",
        "desc": "造成 0.8 倍智力伤害，无视护盾",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.8,
        "pierce": true
      },
      {
        "name": "酸性攻击",
        "type": "logic",
        "desc": "造成 0.8 倍智力伤害，无视护盾",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.8,
        "pierce": true
      },
      {
        "name": "碱性防御",
        "type": "idea",
        "desc": "怪物获得 3 点护盾。对方所有护盾减半（向下取整）",
        "cost": 1,
        "mShield": 3
      },
      {
        "name": "碱性防御",
        "type": "idea",
        "desc": "怪物获得 3 点护盾。对方所有护盾减半（向下取整）",
        "cost": 1,
        "mShield": 3
      },
      {
        "name": "中和反应",
        "type": "logic",
        "desc": "移除双方所有护盾。每移除 1 点护盾，对对方造成 0.5 点伤害",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 0.75
      },
      {
        "name": "中和反应",
        "type": "logic",
        "desc": "移除双方所有护盾。每移除 1 点护盾，对对方造成 0.5 点伤害",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 0.75
      }
    ]
  },
  "q30": {
    "id": "q30",
    "name": "沉淀反应",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 13,
    "intelligence": 3,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "溶液",
        "type": "idea",
        "desc": "对方弃牌堆中每有 3 张牌，对方受到 1 点伤害",
        "cost": 0,
        "mFixedDamage": 1
      },
      {
        "name": "溶液",
        "type": "idea",
        "desc": "对方弃牌堆中每有 3 张牌，对方受到 1 点伤害",
        "cost": 0,
        "mFixedDamage": 1
      },
      {
        "name": "溶液",
        "type": "idea",
        "desc": "对方弃牌堆中每有 3 张牌，对方受到 1 点伤害",
        "cost": 0,
        "mFixedDamage": 1
      },
      {
        "name": "沉淀生成",
        "type": "idea",
        "desc": "将对方弃牌堆中最近 3 张牌移出战斗（移除）",
        "cost": 2,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "沉淀生成",
        "type": "idea",
        "desc": "将对方弃牌堆中最近 3 张牌移出战斗（移除）",
        "cost": 2,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "过滤",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。若对方弃牌堆 <= 3 张，伤害翻倍",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "过滤",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。若对方弃牌堆 <= 3 张，伤害翻倍",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      }
    ]
  },
  "q31": {
    "id": "q31",
    "name": "食物链",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 12,
    "intelligence": 3,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "生产者",
        "type": "idea",
        "desc": "怪物回复 3 点生命。对方若本回合未造成伤害，怪物额外回复 3 点",
        "cost": 1,
        "mHeal": 3
      },
      {
        "name": "生产者",
        "type": "idea",
        "desc": "怪物回复 3 点生命。对方若本回合未造成伤害，怪物额外回复 3 点",
        "cost": 1,
        "mHeal": 3
      },
      {
        "name": "初级消费者",
        "type": "logic",
        "desc": "造成 0.6 倍智力伤害。此伤害使怪物回复等量生命",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.6
      },
      {
        "name": "初级消费者",
        "type": "logic",
        "desc": "造成 0.6 倍智力伤害。此伤害使怪物回复等量生命",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.6
      },
      {
        "name": "初级消费者",
        "type": "logic",
        "desc": "造成 0.6 倍智力伤害。此伤害使怪物回复等量生命",
        "cost": 0,
        "dmgStat": "intelligence",
        "dmgMult": 0.6
      },
      {
        "name": "顶级掠食者",
        "type": "logic",
        "desc": "造成 2 倍智力伤害。若对方生命低于 40%，改为 3 倍",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 2
      }
    ]
  },
  "q32": {
    "id": "q32",
    "name": "光合作用",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 16,
    "intelligence": 2,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "光反应",
        "type": "idea",
        "desc": "本回合结束时，怪物回复 4 点生命。此效果可被对方 >= 3 点伤害打断",
        "cost": 1,
        "mHeal": 4
      },
      {
        "name": "光反应",
        "type": "idea",
        "desc": "本回合结束时，怪物回复 4 点生命。此效果可被对方 >= 3 点伤害打断",
        "cost": 1,
        "mHeal": 4
      },
      {
        "name": "暗反应",
        "type": "idea",
        "desc": "下回合怪物造成的伤害翻倍。若本回合未受伤，改为三倍",
        "cost": 2,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "叶绿体",
        "type": "logic",
        "desc": "造成 0.8 倍智力伤害。若上回合怪物未受伤害，额外造成 1 倍",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 0.8
      },
      {
        "name": "叶绿体",
        "type": "logic",
        "desc": "造成 0.8 倍智力伤害。若上回合怪物未受伤害，额外造成 1 倍",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 0.8
      },
      {
        "name": "叶绿体",
        "type": "logic",
        "desc": "造成 0.8 倍智力伤害。若上回合怪物未受伤害，额外造成 1 倍",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 0.8
      }
    ]
  },
  "q33": {
    "id": "q33",
    "name": "选择题",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 12,
    "intelligence": 0,
    "eq": 3,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "A选项",
        "type": "idea",
        "desc": "对方选择：受到 2 点伤害，或弃 1 张牌",
        "cost": 0,
        "mFixedDamage": 2
      },
      {
        "name": "A选项",
        "type": "idea",
        "desc": "对方选择：受到 2 点伤害，或弃 1 张牌",
        "cost": 0,
        "mFixedDamage": 2
      },
      {
        "name": "A选项",
        "type": "idea",
        "desc": "对方选择：受到 2 点伤害，或弃 1 张牌",
        "cost": 0,
        "mFixedDamage": 2
      },
      {
        "name": "B选项",
        "type": "idea",
        "desc": "对方选择：本回合所有卡牌消耗 +1，或下回合少摸 1 张牌",
        "cost": 0,
        "mDraw": 1,
        "mPlayerDrawPenalty": 1
      },
      {
        "name": "B选项",
        "type": "idea",
        "desc": "对方选择：本回合所有卡牌消耗 +1，或下回合少摸 1 张牌",
        "cost": 0,
        "mDraw": 1,
        "mPlayerDrawPenalty": 1
      },
      {
        "name": "正确答案",
        "type": "logic",
        "desc": "造成 3 倍情商伤害。对方可弃 3 张牌使此伤害变为 0",
        "cost": 3,
        "dmgStat": "eq",
        "dmgMult": 3
      }
    ]
  },
  "q34": {
    "id": "q34",
    "name": "简答题",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 14,
    "intelligence": 0,
    "eq": 4,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "踩分点",
        "type": "idea",
        "desc": "对方展示 1 张手牌。对方本回合下一张同名卡牌消耗翻倍",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "踩分点",
        "type": "idea",
        "desc": "对方展示 1 张手牌。对方本回合下一张同名卡牌消耗翻倍",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "踩分点",
        "type": "idea",
        "desc": "对方展示 1 张手牌。对方本回合下一张同名卡牌消耗翻倍",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "字数要求",
        "type": "idea",
        "desc": "对方下回合使用的卡牌数若 <= 1，受到 4 点伤害",
        "cost": 1,
        "mFixedDamage": 4
      },
      {
        "name": "字数要求",
        "type": "idea",
        "desc": "对方下回合使用的卡牌数若 <= 1，受到 4 点伤害",
        "cost": 1,
        "mFixedDamage": 4
      },
      {
        "name": "偏离题意",
        "type": "logic",
        "desc": "造成 1.5 倍情商伤害。若对方本回合使用过解答卡，改为 3 倍",
        "cost": 2,
        "dmgStat": "eq",
        "dmgMult": 1.5
      }
    ]
  },
  "q35": {
    "id": "q35",
    "name": "朝代更替",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 14,
    "intelligence": 3,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "兴衰周期",
        "type": "idea",
        "desc": "每 3 回合自动循环：第1回合怪物伤害-2、第2回合正常、第3回合怪物伤害+3。使用后开始计时",
        "cost": 0,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "兴衰周期",
        "type": "idea",
        "desc": "每 3 回合自动循环：第1回合怪物伤害-2、第2回合正常、第3回合怪物伤害+3。使用后开始计时",
        "cost": 0,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "改朝换代",
        "type": "idea",
        "desc": "双方各弃置所有手牌，然后各摸 4 张",
        "cost": 2,
        "mShield": 2,
        "mDiscardPlayerAll": true,
        "mPlayerDraw": 4,
        "mDraw": 4,
        "ruleFallback": true
      },
      {
        "name": "农民起义",
        "type": "logic",
        "desc": "造成 1.2 倍智力伤害。对方弃牌堆每有 5 张牌，额外造成 1 倍伤害",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.2
      },
      {
        "name": "农民起义",
        "type": "logic",
        "desc": "造成 1.2 倍智力伤害。对方弃牌堆每有 5 张牌，额外造成 1 倍伤害",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.2
      }
    ]
  },
  "q36": {
    "id": "q36",
    "name": "史料辨伪",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 12,
    "intelligence": 3,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "一手史料",
        "type": "idea",
        "desc": "对方展示牌库顶 2 张牌。每有 1 张思路卡，怪物获得 2 点护盾",
        "cost": 0,
        "mShield": 2
      },
      {
        "name": "一手史料",
        "type": "idea",
        "desc": "对方展示牌库顶 2 张牌。每有 1 张思路卡，怪物获得 2 点护盾",
        "cost": 0,
        "mShield": 2
      },
      {
        "name": "一手史料",
        "type": "idea",
        "desc": "对方展示牌库顶 2 张牌。每有 1 张思路卡，怪物获得 2 点护盾",
        "cost": 0,
        "mShield": 2
      },
      {
        "name": "二手史料",
        "type": "idea",
        "desc": "对方需展示手牌中消耗最高的一张牌。若为逻辑卡，对方受到 3 点伤害",
        "cost": 1,
        "mFixedDamage": 3
      },
      {
        "name": "二手史料",
        "type": "idea",
        "desc": "对方需展示手牌中消耗最高的一张牌。若为逻辑卡，对方受到 3 点伤害",
        "cost": 1,
        "mFixedDamage": 3
      },
      {
        "name": "伪造文书",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。对方手中每有 1 张被展示过的牌，伤害 +0.5 倍",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "伪造文书",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。对方手中每有 1 张被展示过的牌，伤害 +0.5 倍",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      }
    ]
  },
  "q37": {
    "id": "q37",
    "name": "板块运动",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 15,
    "intelligence": 0,
    "eq": 0,
    "physique": 4,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "碰撞",
        "type": "logic",
        "desc": "造成 1 倍体魄伤害。双方各弃 1 张牌",
        "cost": 1,
        "dmgStat": "physique",
        "dmgMult": 1
      },
      {
        "name": "碰撞",
        "type": "logic",
        "desc": "造成 1 倍体魄伤害。双方各弃 1 张牌",
        "cost": 1,
        "dmgStat": "physique",
        "dmgMult": 1
      },
      {
        "name": "碰撞",
        "type": "logic",
        "desc": "造成 1 倍体魄伤害。双方各弃 1 张牌",
        "cost": 1,
        "dmgStat": "physique",
        "dmgMult": 1
      },
      {
        "name": "张裂",
        "type": "idea",
        "desc": "对方将手牌分成两堆。选择其中一堆弃置，另一堆回到手牌",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "地震带",
        "type": "idea",
        "desc": "双方各受到 4 点伤害。此伤害对怪物减半",
        "cost": 2,
        "mFixedDamage": 4
      },
      {
        "name": "地震带",
        "type": "idea",
        "desc": "双方各受到 4 点伤害。此伤害对怪物减半",
        "cost": 2,
        "mFixedDamage": 4
      }
    ]
  },
  "q38": {
    "id": "q38",
    "name": "洋流分布",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 13,
    "intelligence": 3,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "暖流",
        "type": "idea",
        "desc": "本回合对方每使用 1 张卡牌，怪物摸 1 张牌",
        "cost": 0,
        "mDraw": 1
      },
      {
        "name": "暖流",
        "type": "idea",
        "desc": "本回合对方每使用 1 张卡牌，怪物摸 1 张牌",
        "cost": 0,
        "mDraw": 1
      },
      {
        "name": "寒流",
        "type": "idea",
        "desc": "本回合对方每使用 1 张卡牌，其下回合体力回复 -1（可叠加）",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "寒流",
        "type": "idea",
        "desc": "本回合对方每使用 1 张卡牌，其下回合体力回复 -1（可叠加）",
        "cost": 1,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "洋流交汇",
        "type": "logic",
        "desc": "造成对方本回合已使用卡牌数 x0.8 倍智力的伤害",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 0.75
      },
      {
        "name": "洋流交汇",
        "type": "logic",
        "desc": "造成对方本回合已使用卡牌数 x0.8 倍智力的伤害",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 0.75
      }
    ]
  },
  "q39": {
    "id": "q39",
    "name": "脑筋接力",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 14,
    "intelligence": 0,
    "eq": 4,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "第一棒",
        "type": "idea",
        "desc": "随机触发：1.对方受到 2 点伤害 2.怪物获得 2 点护盾 3.对方弃 1 张牌",
        "cost": 0,
        "mShield": 2,
        "mFixedDamage": 2
      },
      {
        "name": "第一棒",
        "type": "idea",
        "desc": "随机触发：1.对方受到 2 点伤害 2.怪物获得 2 点护盾 3.对方弃 1 张牌",
        "cost": 0,
        "mShield": 2,
        "mFixedDamage": 2
      },
      {
        "name": "第一棒",
        "type": "idea",
        "desc": "随机触发：1.对方受到 2 点伤害 2.怪物获得 2 点护盾 3.对方弃 1 张牌",
        "cost": 0,
        "mShield": 2,
        "mFixedDamage": 2
      },
      {
        "name": "第二棒",
        "type": "logic",
        "desc": "造成 0.8 倍情商伤害。若本回合\"第一棒\"已触发过，改为 1.8 倍",
        "cost": 1,
        "dmgStat": "eq",
        "dmgMult": 0.8
      },
      {
        "name": "第二棒",
        "type": "logic",
        "desc": "造成 0.8 倍情商伤害。若本回合\"第一棒\"已触发过，改为 1.8 倍",
        "cost": 1,
        "dmgStat": "eq",
        "dmgMult": 0.8
      },
      {
        "name": "第二棒",
        "type": "logic",
        "desc": "造成 0.8 倍情商伤害。若本回合\"第一棒\"已触发过，改为 1.8 倍",
        "cost": 1,
        "dmgStat": "eq",
        "dmgMult": 0.8
      },
      {
        "name": "冲刺棒",
        "type": "logic",
        "desc": "造成 2 倍情商伤害。若本回合已触发过\"第一棒\"和\"第二棒\"，改为 4 倍",
        "cost": 3,
        "dmgStat": "eq",
        "dmgMult": 2
      }
    ]
  },
  "q40": {
    "id": "q40",
    "name": "限时测验",
    "tier": "quiz",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 17,
    "intelligence": 4,
    "eq": 0,
    "physique": 0,
    "talent": "",
    "noChapterScale": false,
    "deck": [
      {
        "name": "倒计时",
        "type": "idea",
        "desc": "从 5 开始倒计时。每回合 -1。归零时，对方受到（5 + 当前回合数）点伤害",
        "cost": 0,
        "mShield": 2,
        "ruleFallback": true
      },
      {
        "name": "加题",
        "type": "idea",
        "desc": "倒计时 +2。对方选择：受到 2 点伤害，或倒计时额外 +1",
        "cost": 1,
        "mFixedDamage": 2
      },
      {
        "name": "加题",
        "type": "idea",
        "desc": "倒计时 +2。对方选择：受到 2 点伤害，或倒计时额外 +1",
        "cost": 1,
        "mFixedDamage": 2
      },
      {
        "name": "时间到",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。若倒计时 <= 2，改为 2.5 倍",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "时间到",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。若倒计时 <= 2，改为 2.5 倍",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      }
    ]
  },
  "m01": {
    "id": "m01",
    "name": "作文大考",
    "tier": "monthly",
    "subject": "语文",
    "emoji": "📝",
    "hp": 41,
    "intelligence": 0,
    "eq": 7,
    "physique": 0,
    "talent": "提纲挈领",
    "noChapterScale": false,
    "deck": [
      {
        "name": "审题",
        "type": "idea",
        "desc": "对方选择手牌中 1 张牌置于牌库底。若该牌为思路卡，怪物摸 2 张",
        "cost": 0,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "审题",
        "type": "idea",
        "desc": "对方选择手牌中 1 张牌置于牌库底。若该牌为思路卡，怪物摸 2 张",
        "cost": 0,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "列提纲",
        "type": "idea",
        "desc": "本回合对方每使用 1 张卡牌，下回合对方少摸 1 张牌（最多少摸 3 张）",
        "cost": 2,
        "mDraw": 1,
        "mPlayerDrawPenalty": 1
      },
      {
        "name": "列提纲",
        "type": "idea",
        "desc": "本回合对方每使用 1 张卡牌，下回合对方少摸 1 张牌（最多少摸 3 张）",
        "cost": 2,
        "mDraw": 1,
        "mPlayerDrawPenalty": 1
      },
      {
        "name": "正文",
        "type": "logic",
        "desc": "造成 1 倍情商伤害",
        "cost": 1,
        "dmgStat": "eq",
        "dmgMult": 1
      },
      {
        "name": "正文",
        "type": "logic",
        "desc": "造成 1 倍情商伤害",
        "cost": 1,
        "dmgStat": "eq",
        "dmgMult": 1
      },
      {
        "name": "正文",
        "type": "logic",
        "desc": "造成 1 倍情商伤害",
        "cost": 1,
        "dmgStat": "eq",
        "dmgMult": 1
      },
      {
        "name": "点题升华",
        "type": "logic",
        "desc": "造成 2 倍情商伤害。若对方手牌 <= 3 张，改为 3 倍",
        "cost": 3,
        "dmgStat": "eq",
        "dmgMult": 2
      },
      {
        "name": "点题升华",
        "type": "logic",
        "desc": "造成 2 倍情商伤害。若对方手牌 <= 3 张，改为 3 倍",
        "cost": 3,
        "dmgStat": "eq",
        "dmgMult": 2
      },
      {
        "name": "跑题",
        "type": "idea",
        "desc": "对方手牌中所有逻辑卡本回合效果中的数值减半（向下取整）",
        "cost": 2,
        "mShield": 8,
        "ruleFallback": true
      }
    ]
  },
  "m02": {
    "id": "m02",
    "name": "函数综合",
    "tier": "monthly",
    "subject": "数学",
    "emoji": "📐",
    "hp": 31,
    "intelligence": 9,
    "eq": 0,
    "physique": 0,
    "talent": "恒等变换",
    "noChapterScale": false,
    "deck": [
      {
        "name": "定义域",
        "type": "idea",
        "desc": "对方本回合使用的卡牌消耗必须 >= 1（0 费卡无法使用）",
        "cost": 1,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "定义域",
        "type": "idea",
        "desc": "对方本回合使用的卡牌消耗必须 >= 1（0 费卡无法使用）",
        "cost": 1,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "值域",
        "type": "idea",
        "desc": "对方本回合使用的卡牌消耗必须 <= 3（4 费及以上无法使用）",
        "cost": 1,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "值域",
        "type": "idea",
        "desc": "对方本回合使用的卡牌消耗必须 <= 3（4 费及以上无法使用）",
        "cost": 1,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "求导",
        "type": "logic",
        "desc": "造成 1 倍智力伤害。检视对方手牌，其中每有 1 张消耗为偶数的牌，额外 +0.3 倍",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "求导",
        "type": "logic",
        "desc": "造成 1 倍智力伤害。检视对方手牌，其中每有 1 张消耗为偶数的牌，额外 +0.3 倍",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "求导",
        "type": "logic",
        "desc": "造成 1 倍智力伤害。检视对方手牌，其中每有 1 张消耗为偶数的牌，额外 +0.3 倍",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "极值判定",
        "type": "logic",
        "desc": "造成 2 倍智力伤害。若对方手牌中最高消耗与最低消耗之差 >= 3，改为 3.5 倍",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 2
      },
      {
        "name": "极值判定",
        "type": "logic",
        "desc": "造成 2 倍智力伤害。若对方手牌中最高消耗与最低消耗之差 >= 3，改为 3.5 倍",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 2
      }
    ]
  },
  "m03": {
    "id": "m03",
    "name": "完形填空",
    "tier": "monthly",
    "subject": "英语",
    "emoji": "🔤",
    "hp": 37,
    "intelligence": 7,
    "eq": 0,
    "physique": 0,
    "talent": "上下文线索",
    "noChapterScale": false,
    "deck": [
      {
        "name": "挖空",
        "type": "idea",
        "desc": "对方选择 1 张手牌，使其本回合消耗 +2。若对方本回合未使用该牌，回合结束时该牌进入弃牌堆",
        "cost": 0,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "挖空",
        "type": "idea",
        "desc": "对方选择 1 张手牌，使其本回合消耗 +2。若对方本回合未使用该牌，回合结束时该牌进入弃牌堆",
        "cost": 0,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "挖空",
        "type": "idea",
        "desc": "对方选择 1 张手牌，使其本回合消耗 +2。若对方本回合未使用该牌，回合结束时该牌进入弃牌堆",
        "cost": 0,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "词义辨析",
        "type": "idea",
        "desc": "对方展示手牌中所有同类型卡牌（逻辑/思路/解答中最多的一类）。每展示 1 张受到 1 点伤害",
        "cost": 1,
        "mFixedDamage": 1
      },
      {
        "name": "词义辨析",
        "type": "idea",
        "desc": "对方展示手牌中所有同类型卡牌（逻辑/思路/解答中最多的一类）。每展示 1 张受到 1 点伤害",
        "cost": 1,
        "mFixedDamage": 1
      },
      {
        "name": "选词填空",
        "type": "logic",
        "desc": "造成 0.8 倍智力伤害，重复 2 次。若两次伤害之间对方使用了卡牌，第三次也触发",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 0.8,
        "hits": 2
      },
      {
        "name": "选词填空",
        "type": "logic",
        "desc": "造成 0.8 倍智力伤害，重复 2 次。若两次伤害之间对方使用了卡牌，第三次也触发",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 0.8,
        "hits": 2
      },
      {
        "name": "通读检查",
        "type": "logic",
        "desc": "造成 2 倍智力伤害。若对方弃牌堆中卡牌类型 >= 2 种（逻辑/思路/解答），伤害翻倍",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 2
      },
      {
        "name": "通读检查",
        "type": "logic",
        "desc": "造成 2 倍智力伤害。若对方弃牌堆中卡牌类型 >= 2 种（逻辑/思路/解答），伤害翻倍",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 2
      }
    ]
  },
  "m04": {
    "id": "m04",
    "name": "力学综合",
    "tier": "monthly",
    "subject": "物理",
    "emoji": "⚡",
    "hp": 50,
    "intelligence": 6,
    "eq": 0,
    "physique": 0,
    "talent": "能量守恒",
    "noChapterScale": false,
    "deck": [
      {
        "name": "受力分析",
        "type": "idea",
        "desc": "对方选择 1 张手牌展示。若为逻辑卡，对方失去 3 点护盾；若为思路卡，对方受到 3 点伤害",
        "cost": 0,
        "mFixedDamage": 3
      },
      {
        "name": "受力分析",
        "type": "idea",
        "desc": "对方选择 1 张手牌展示。若为逻辑卡，对方失去 3 点护盾；若为思路卡，对方受到 3 点伤害",
        "cost": 0,
        "mFixedDamage": 3
      },
      {
        "name": "受力分析",
        "type": "idea",
        "desc": "对方选择 1 张手牌展示。若为逻辑卡，对方失去 3 点护盾；若为思路卡，对方受到 3 点伤害",
        "cost": 0,
        "mFixedDamage": 3
      },
      {
        "name": "摩擦系数",
        "type": "idea",
        "desc": "对方所有卡牌本回合消耗 +1。对方每支付 1 点额外消耗，受到 0.5 点伤害",
        "cost": 2,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "摩擦系数",
        "type": "idea",
        "desc": "对方所有卡牌本回合消耗 +1。对方每支付 1 点额外消耗，受到 0.5 点伤害",
        "cost": 2,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "动能定理",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。若对方本回合已使用 >= 3 张卡牌，伤害 +50%",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "动能定理",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。若对方本回合已使用 >= 3 张卡牌，伤害 +50%",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "万有引力",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。将对方弃牌堆中最近 2 张牌拉回其手牌，然后这些牌本回合消耗 +2",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "万有引力",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。将对方弃牌堆中最近 2 张牌拉回其手牌，然后这些牌本回合消耗 +2",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      }
    ]
  },
  "m05": {
    "id": "m05",
    "name": "有机推断",
    "tier": "monthly",
    "subject": "化学",
    "emoji": "🧪",
    "hp": 39,
    "intelligence": 7,
    "eq": 0,
    "physique": 0,
    "talent": "连锁反应",
    "noChapterScale": false,
    "deck": [
      {
        "name": "碳链",
        "type": "idea",
        "desc": "对方牌库顶 3 张牌进入弃牌堆。其中每有 1 张逻辑卡，怪物获得 2 点护盾",
        "cost": 2,
        "mShield": 2,
        "mMillPlayer": 3
      },
      {
        "name": "碳链",
        "type": "idea",
        "desc": "对方牌库顶 3 张牌进入弃牌堆。其中每有 1 张逻辑卡，怪物获得 2 点护盾",
        "cost": 2,
        "mShield": 2,
        "mMillPlayer": 3
      },
      {
        "name": "官能团",
        "type": "idea",
        "desc": "检视对方手牌。选择其中 1 张，使其本场战斗属性加成（智力/情商/体魄倍率）减半",
        "cost": 1,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "官能团",
        "type": "idea",
        "desc": "检视对方手牌。选择其中 1 张，使其本场战斗属性加成（智力/情商/体魄倍率）减半",
        "cost": 1,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "加成反应",
        "type": "logic",
        "desc": "造成 1.2 倍智力伤害。若对方本回合已使用思路卡，伤害 +60%；若对方本回合未使用思路卡，对方受到 2 点额外伤害",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.2
      },
      {
        "name": "加成反应",
        "type": "logic",
        "desc": "造成 1.2 倍智力伤害。若对方本回合已使用思路卡，伤害 +60%；若对方本回合未使用思路卡，对方受到 2 点额外伤害",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.2
      },
      {
        "name": "消去反应",
        "type": "logic",
        "desc": "造成 2 倍智力伤害。弃置对方 1 点护盾，并弃置对方 1 张手牌",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 2,
        "mDiscardPlayer": 1
      },
      {
        "name": "消去反应",
        "type": "logic",
        "desc": "造成 2 倍智力伤害。弃置对方 1 点护盾，并弃置对方 1 张手牌",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 2,
        "mDiscardPlayer": 1
      }
    ]
  },
  "m06": {
    "id": "m06",
    "name": "生态系统",
    "tier": "monthly",
    "subject": "生物",
    "emoji": "🧬",
    "hp": 46,
    "intelligence": 5,
    "eq": 0,
    "physique": 0,
    "talent": "物质循环",
    "noChapterScale": false,
    "deck": [
      {
        "name": "种群增长",
        "type": "idea",
        "desc": "双方各摸 2 张牌。怪物额外摸 1 张",
        "cost": 1,
        "mDraw": 3,
        "mPlayerDraw": 2
      },
      {
        "name": "种群增长",
        "type": "idea",
        "desc": "双方各摸 2 张牌。怪物额外摸 1 张",
        "cost": 1,
        "mDraw": 3,
        "mPlayerDraw": 2
      },
      {
        "name": "种间竞争",
        "type": "idea",
        "desc": "双方各弃 2 张牌。对方每弃 1 张逻辑卡，额外受到 2 点伤害",
        "cost": 2,
        "mFixedDamage": 2
      },
      {
        "name": "种间竞争",
        "type": "idea",
        "desc": "双方各弃 2 张牌。对方每弃 1 张逻辑卡，额外受到 2 点伤害",
        "cost": 2,
        "mFixedDamage": 2
      },
      {
        "name": "能量流动",
        "type": "logic",
        "desc": "造成 1 倍智力伤害。怪物回复等同于伤害量 30% 的生命",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "能量流动",
        "type": "logic",
        "desc": "造成 1 倍智力伤害。怪物回复等同于伤害量 30% 的生命",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "能量流动",
        "type": "logic",
        "desc": "造成 1 倍智力伤害。怪物回复等同于伤害量 30% 的生命",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "顶级消费者",
        "type": "logic",
        "desc": "造成 2 倍智力伤害。若对方弃牌堆 >= 15 张，改为 3.5 倍",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 2
      }
    ]
  },
  "m07": {
    "id": "m07",
    "name": "论述题",
    "tier": "monthly",
    "subject": "政治",
    "emoji": "⚖️",
    "hp": 30,
    "intelligence": 0,
    "eq": 9,
    "physique": 0,
    "talent": "辩证思维",
    "noChapterScale": false,
    "deck": [
      {
        "name": "正论",
        "type": "idea",
        "desc": "本回合对方下一张逻辑卡伤害 -2。对方可以弃 1 张牌移除此效果",
        "cost": 0,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "正论",
        "type": "idea",
        "desc": "本回合对方下一张逻辑卡伤害 -2。对方可以弃 1 张牌移除此效果",
        "cost": 0,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "正论",
        "type": "idea",
        "desc": "本回合对方下一张逻辑卡伤害 -2。对方可以弃 1 张牌移除此效果",
        "cost": 0,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "反论",
        "type": "idea",
        "desc": "本回合对方下一张思路卡消耗 +2。对方可以受到 2 点伤害移除此效果",
        "cost": 1,
        "mFixedDamage": 2
      },
      {
        "name": "反论",
        "type": "idea",
        "desc": "本回合对方下一张思路卡消耗 +2。对方可以受到 2 点伤害移除此效果",
        "cost": 1,
        "mFixedDamage": 2
      },
      {
        "name": "合论",
        "type": "logic",
        "desc": "造成 1.5 倍情商伤害。若本回合对方既使用过逻辑卡又使用过思路卡，伤害翻倍",
        "cost": 2,
        "dmgStat": "eq",
        "dmgMult": 1.5
      },
      {
        "name": "合论",
        "type": "logic",
        "desc": "造成 1.5 倍情商伤害。若本回合对方既使用过逻辑卡又使用过思路卡，伤害翻倍",
        "cost": 2,
        "dmgStat": "eq",
        "dmgMult": 1.5
      },
      {
        "name": "结论",
        "type": "logic",
        "desc": "造成 2 倍情商伤害。本回合对方每弃过 1 张牌，额外造成 1 倍情商伤害",
        "cost": 3,
        "dmgStat": "eq",
        "dmgMult": 2
      },
      {
        "name": "结论",
        "type": "logic",
        "desc": "造成 2 倍情商伤害。本回合对方每弃过 1 张牌，额外造成 1 倍情商伤害",
        "cost": 3,
        "dmgStat": "eq",
        "dmgMult": 2
      }
    ]
  },
  "m08": {
    "id": "m08",
    "name": "材料论述",
    "tier": "monthly",
    "subject": "历史",
    "emoji": "📜",
    "hp": 36,
    "intelligence": 7,
    "eq": 0,
    "physique": 0,
    "talent": "以史为鉴",
    "noChapterScale": false,
    "deck": [
      {
        "name": "史料呈现",
        "type": "idea",
        "desc": "对方展示牌库顶 3 张牌，怪物选择其中 1 张置于弃牌堆。若该牌为解答卡，对方受到 4 点伤害",
        "cost": 0,
        "mFixedDamage": 4
      },
      {
        "name": "史料呈现",
        "type": "idea",
        "desc": "对方展示牌库顶 3 张牌，怪物选择其中 1 张置于弃牌堆。若该牌为解答卡，对方受到 4 点伤害",
        "cost": 0,
        "mFixedDamage": 4
      },
      {
        "name": "史料呈现",
        "type": "idea",
        "desc": "对方展示牌库顶 3 张牌，怪物选择其中 1 张置于弃牌堆。若该牌为解答卡，对方受到 4 点伤害",
        "cost": 0,
        "mFixedDamage": 4
      },
      {
        "name": "时序错乱",
        "type": "idea",
        "desc": "对方将手牌中所有卡牌按消耗从低到高置于牌库顶",
        "cost": 2,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "时序错乱",
        "type": "idea",
        "desc": "对方将手牌中所有卡牌按消耗从低到高置于牌库顶",
        "cost": 2,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "史论结合",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。若对方本回合从牌库顶使用过卡牌，伤害 +50%",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "史论结合",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。若对方本回合从牌库顶使用过卡牌，伤害 +50%",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "教训与启示",
        "type": "logic",
        "desc": "造成 2 倍智力伤害。若对方牌库剩余卡牌数 <= 5，改为 4 倍",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 2
      }
    ]
  },
  "m09": {
    "id": "m09",
    "name": "自然地理综合",
    "tier": "monthly",
    "subject": "地理",
    "emoji": "🌍",
    "hp": 41,
    "intelligence": 7,
    "eq": 0,
    "physique": 0,
    "talent": "四季轮转",
    "noChapterScale": false,
    "deck": [
      {
        "name": "气候异常",
        "type": "idea",
        "desc": "强制将季节推进到下一季",
        "cost": 1,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "气候异常",
        "type": "idea",
        "desc": "强制将季节推进到下一季",
        "cost": 1,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "气候异常",
        "type": "idea",
        "desc": "强制将季节推进到下一季",
        "cost": 1,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "地形优势",
        "type": "idea",
        "desc": "当前季节效果对怪物翻倍，对方不受当前季节正面效果影响。持续 1 回合",
        "cost": 2,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "自然灾害",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。若当前为夏或冬，额外造成 1 倍智力伤害",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "自然灾害",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。若当前为夏或冬，额外造成 1 倍智力伤害",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "自然灾害",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。若当前为夏或冬，额外造成 1 倍智力伤害",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "资源分布",
        "type": "logic",
        "desc": "造成 2 倍智力伤害。若当前为春或秋，怪物额外回复等同于伤害量 50% 的生命",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 2
      },
      {
        "name": "资源分布",
        "type": "logic",
        "desc": "造成 2 倍智力伤害。若当前为春或秋，怪物额外回复等同于伤害量 50% 的生命",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 2
      }
    ]
  },
  "m10": {
    "id": "m10",
    "name": "理综/文综",
    "tier": "monthly",
    "subject": "全科",
    "emoji": "🎓",
    "hp": 41,
    "intelligence": 6,
    "eq": 6,
    "physique": 0,
    "talent": "跨学科思维",
    "noChapterScale": false,
    "deck": [
      {
        "name": "综合运用",
        "type": "idea",
        "desc": "选择一项：本回合怪物智力 +4，或本回合怪物情商 +4",
        "cost": 1,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "综合运用",
        "type": "idea",
        "desc": "选择一项：本回合怪物智力 +4，或本回合怪物情商 +4",
        "cost": 1,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "综合运用",
        "type": "idea",
        "desc": "选择一项：本回合怪物智力 +4，或本回合怪物情商 +4",
        "cost": 1,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "学科壁垒",
        "type": "idea",
        "desc": "对方选择：本回合无法使用逻辑卡，或本回合无法使用思路卡",
        "cost": 2,
        "mShield": 8,
        "ruleFallback": true
      },
      {
        "name": "融会贯通",
        "type": "logic",
        "desc": "造成（智力 + 情商）x0.6 的伤害。若对方本回合同时使用过逻辑卡和思路卡，伤害 x1.5",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "融会贯通",
        "type": "logic",
        "desc": "造成（智力 + 情商）x0.6 的伤害。若对方本回合同时使用过逻辑卡和思路卡，伤害 x1.5",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "偏科弱点",
        "type": "logic",
        "desc": "造成（智力 + 情商）x0.8 的伤害。对方手牌中数量最多的卡牌类型每有 1 张，额外 +0.3 倍",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "偏科弱点",
        "type": "logic",
        "desc": "造成（智力 + 情商）x0.8 的伤害。对方手牌中数量最多的卡牌类型每有 1 张，额外 +0.3 倍",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 1
      }
    ]
  },
  "s01": {
    "id": "s01",
    "name": "作文押题",
    "tier": "mock",
    "subject": "语文",
    "emoji": "📝",
    "hp": 950,
    "intelligence": 0,
    "eq": 55,
    "physique": 0,
    "talent": "押题命中 / 时间分配",
    "noChapterScale": true,
    "deck": [
      {
        "name": "审题圈划",
        "type": "idea",
        "desc": "对方牌库顶 3 张牌进入弃牌堆。其中每有 1 张解答卡，怪物回复 15 点生命",
        "cost": 1,
        "mHeal": 15,
        "mMillPlayer": 3
      },
      {
        "name": "审题圈划",
        "type": "idea",
        "desc": "对方牌库顶 3 张牌进入弃牌堆。其中每有 1 张解答卡，怪物回复 15 点生命",
        "cost": 1,
        "mHeal": 15,
        "mMillPlayer": 3
      },
      {
        "name": "选材",
        "type": "idea",
        "desc": "对方从弃牌堆选 3 张牌洗回牌库，然后受到（洗回牌中逻辑卡数量 x3）点伤害",
        "cost": 2,
        "mShield": 20,
        "ruleFallback": true
      },
      {
        "name": "选材",
        "type": "idea",
        "desc": "对方从弃牌堆选 3 张牌洗回牌库，然后受到（洗回牌中逻辑卡数量 x3）点伤害",
        "cost": 2,
        "mShield": 20,
        "ruleFallback": true
      },
      {
        "name": "谋篇布局",
        "type": "idea",
        "desc": "本回合对方所有卡牌需按消耗从低到高的顺序使用，否则每张违规使用的牌对其造成 5 点伤害",
        "cost": 3,
        "mShield": 20,
        "ruleFallback": true
      },
      {
        "name": "行文",
        "type": "logic",
        "desc": "造成 1.5 倍情商伤害。若对方牌库剩余 <= 15 张，改为 2.5 倍",
        "cost": 2,
        "dmgStat": "eq",
        "dmgMult": 1.5
      },
      {
        "name": "行文",
        "type": "logic",
        "desc": "造成 1.5 倍情商伤害。若对方牌库剩余 <= 15 张，改为 2.5 倍",
        "cost": 2,
        "dmgStat": "eq",
        "dmgMult": 1.5
      },
      {
        "name": "行文",
        "type": "logic",
        "desc": "造成 1.5 倍情商伤害。若对方牌库剩余 <= 15 张，改为 2.5 倍",
        "cost": 2,
        "dmgStat": "eq",
        "dmgMult": 1.5
      },
      {
        "name": "锦上添花",
        "type": "logic",
        "desc": "造成 2 倍情商伤害。若对方本回合已使用 >= 3 张牌，额外造成 1.5 倍",
        "cost": 3,
        "dmgStat": "eq",
        "dmgMult": 2
      },
      {
        "name": "锦上添花",
        "type": "logic",
        "desc": "造成 2 倍情商伤害。若对方本回合已使用 >= 3 张牌，额外造成 1.5 倍",
        "cost": 3,
        "dmgStat": "eq",
        "dmgMult": 2
      }
    ]
  },
  "s02": {
    "id": "s02",
    "name": "压轴大题",
    "tier": "mock",
    "subject": "数学",
    "emoji": "📐",
    "hp": 700,
    "intelligence": 70,
    "eq": 0,
    "physique": 0,
    "talent": "步骤分 / 得分点",
    "noChapterScale": true,
    "deck": [
      {
        "name": "设未知数",
        "type": "idea",
        "desc": "怪物获得 8 点护盾。下回合怪物造成的下一次伤害 +50%",
        "cost": 0,
        "mShield": 8,
        "mNextLogicBonus": 50
      },
      {
        "name": "设未知数",
        "type": "idea",
        "desc": "怪物获得 8 点护盾。下回合怪物造成的下一次伤害 +50%",
        "cost": 0,
        "mShield": 8,
        "mNextLogicBonus": 50
      },
      {
        "name": "设未知数",
        "type": "idea",
        "desc": "怪物获得 8 点护盾。下回合怪物造成的下一次伤害 +50%",
        "cost": 0,
        "mShield": 8,
        "mNextLogicBonus": 50
      },
      {
        "name": "列方程",
        "type": "idea",
        "desc": "对方选择：受到 8 点伤害，或弃 2 张牌。若弃牌，怪物摸 2 张",
        "cost": 2,
        "mFixedDamage": 8
      },
      {
        "name": "列方程",
        "type": "idea",
        "desc": "对方选择：受到 8 点伤害，或弃 2 张牌。若弃牌，怪物摸 2 张",
        "cost": 2,
        "mFixedDamage": 8
      },
      {
        "name": "解方程",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。此伤害至少为 20 点（不受任何减伤影响）",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "解方程",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。此伤害至少为 20 点（不受任何减伤影响）",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "解方程",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。此伤害至少为 20 点（不受任何减伤影响）",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "验算",
        "type": "logic",
        "desc": "造成 0.8 倍智力伤害。若对方当前生命为 5 的倍数，再次造成等量伤害",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 0.8
      },
      {
        "name": "验算",
        "type": "logic",
        "desc": "造成 0.8 倍智力伤害。若对方当前生命为 5 的倍数，再次造成等量伤害",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 0.8
      },
      {
        "name": "多解法",
        "type": "answer",
        "desc": "造成 3 倍智力伤害。对方需弃 1 张解答卡，否则此伤害翻倍。移除",
        "cost": 4,
        "dmgStat": "intelligence",
        "dmgMult": 3
      }
    ]
  },
  "s03": {
    "id": "s03",
    "name": "阅读理解综合",
    "tier": "mock",
    "subject": "英语",
    "emoji": "🔤",
    "hp": 1200,
    "intelligence": 42,
    "eq": 0,
    "physique": 0,
    "talent": "生词本 / 快速阅读",
    "noChapterScale": true,
    "deck": [
      {
        "name": "快速浏览",
        "type": "idea",
        "desc": "对方摸 3 张牌，然后对方受到（其手牌数 -5）x2 点伤害（若手牌 <= 5 则不受伤害）",
        "cost": 0,
        "mPlayerDraw": 3
      },
      {
        "name": "快速浏览",
        "type": "idea",
        "desc": "对方摸 3 张牌，然后对方受到（其手牌数 -5）x2 点伤害（若手牌 <= 5 则不受伤害）",
        "cost": 0,
        "mPlayerDraw": 3
      },
      {
        "name": "快速浏览",
        "type": "idea",
        "desc": "对方摸 3 张牌，然后对方受到（其手牌数 -5）x2 点伤害（若手牌 <= 5 则不受伤害）",
        "cost": 0,
        "mPlayerDraw": 3
      },
      {
        "name": "细节定位",
        "type": "logic",
        "desc": "造成 1 倍智力伤害。若对方手牌 >= 6 张，改为 2 倍",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "细节定位",
        "type": "logic",
        "desc": "造成 1 倍智力伤害。若对方手牌 >= 6 张，改为 2 倍",
        "cost": 1,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "推理判断",
        "type": "idea",
        "desc": "选择对方手牌中 1 张牌。若该牌为逻辑卡，对方受到 10 点伤害；若为思路卡，怪物回复 10 点生命；若为解答卡，两者都触发",
        "cost": 2,
        "mHeal": 10,
        "mFixedDamage": 10
      },
      {
        "name": "推理判断",
        "type": "idea",
        "desc": "选择对方手牌中 1 张牌。若该牌为逻辑卡，对方受到 10 点伤害；若为思路卡，怪物回复 10 点生命；若为解答卡，两者都触发",
        "cost": 2,
        "mHeal": 10,
        "mFixedDamage": 10
      },
      {
        "name": "主旨归纳",
        "type": "logic",
        "desc": "造成 2 倍智力伤害。若对方手牌 <= 3 张，改为 3.5 倍",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 2
      },
      {
        "name": "主旨归纳",
        "type": "logic",
        "desc": "造成 2 倍智力伤害。若对方手牌 <= 3 张，改为 3.5 倍",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 2
      },
      {
        "name": "长难句分析",
        "type": "idea",
        "desc": "对方下回合使用的卡牌若消耗 >= 3，效果无效",
        "cost": 2,
        "mShield": 20,
        "ruleFallback": true
      }
    ]
  },
  "s04": {
    "id": "s04",
    "name": "电磁学综合",
    "tier": "mock",
    "subject": "物理",
    "emoji": "⚡",
    "hp": 950,
    "intelligence": 55,
    "eq": 0,
    "physique": 0,
    "talent": "电磁场 / 左手定则",
    "noChapterScale": true,
    "deck": [
      {
        "name": "电场",
        "type": "idea",
        "desc": "对方本回合逻辑卡消耗 +1。对方每使用 1 张逻辑卡，回合结束时受到 3 点伤害",
        "cost": 1,
        "mFixedDamage": 3
      },
      {
        "name": "电场",
        "type": "idea",
        "desc": "对方本回合逻辑卡消耗 +1。对方每使用 1 张逻辑卡，回合结束时受到 3 点伤害",
        "cost": 1,
        "mFixedDamage": 3
      },
      {
        "name": "磁场",
        "type": "idea",
        "desc": "对方本回合思路卡消耗 +1。对方每使用 1 张思路卡，怪物回复 5 点生命",
        "cost": 1,
        "mHeal": 5
      },
      {
        "name": "磁场",
        "type": "idea",
        "desc": "对方本回合思路卡消耗 +1。对方每使用 1 张思路卡，怪物回复 5 点生命",
        "cost": 1,
        "mHeal": 5
      },
      {
        "name": "电磁波",
        "type": "logic",
        "desc": "造成 2 倍智力伤害，无视护盾。若对方本回合同时使用过逻辑卡和思路卡，伤害翻倍",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 2,
        "pierce": true
      },
      {
        "name": "电磁波",
        "type": "logic",
        "desc": "造成 2 倍智力伤害，无视护盾。若对方本回合同时使用过逻辑卡和思路卡，伤害翻倍",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 2,
        "pierce": true
      },
      {
        "name": "楞次定律",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。对方本次战斗已使用的卡牌种类越多，伤害越高（每种类型 +0.3 倍）",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "楞次定律",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。对方本次战斗已使用的卡牌种类越多，伤害越高（每种类型 +0.3 倍）",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "感应电动势",
        "type": "idea",
        "desc": "对方下回合使用的第一张卡牌，其效果对对方自己生效而非怪物",
        "cost": 3,
        "mShield": 20,
        "ruleFallback": true
      }
    ]
  },
  "s05": {
    "id": "s05",
    "name": "工业流程",
    "tier": "mock",
    "subject": "化学",
    "emoji": "🧪",
    "hp": 1350,
    "intelligence": 38,
    "eq": 0,
    "physique": 0,
    "talent": "催化剂 / 可逆反应",
    "noChapterScale": true,
    "deck": [
      {
        "name": "原料投入",
        "type": "idea",
        "desc": "怪物获得 12 点护盾。对方下回合造成的伤害 -30%",
        "cost": 1,
        "mShield": 12
      },
      {
        "name": "原料投入",
        "type": "idea",
        "desc": "怪物获得 12 点护盾。对方下回合造成的伤害 -30%",
        "cost": 1,
        "mShield": 12
      },
      {
        "name": "副产物",
        "type": "idea",
        "desc": "对方选择：受到 8 点伤害并获得 4 点护盾，或失去 6 点护盾并摸 2 张牌",
        "cost": 2,
        "mShield": 4,
        "mDraw": 2,
        "mFixedDamage": 8
      },
      {
        "name": "副产物",
        "type": "idea",
        "desc": "对方选择：受到 8 点伤害并获得 4 点护盾，或失去 6 点护盾并摸 2 张牌",
        "cost": 2,
        "mShield": 4,
        "mDraw": 2,
        "mFixedDamage": 8
      },
      {
        "name": "主反应",
        "type": "logic",
        "desc": "造成 2 倍智力伤害。若怪物当前有护盾，此伤害 +50% 且消耗护盾中的 5 点转为额外伤害",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 2
      },
      {
        "name": "主反应",
        "type": "logic",
        "desc": "造成 2 倍智力伤害。若怪物当前有护盾，此伤害 +50% 且消耗护盾中的 5 点转为额外伤害",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 2
      },
      {
        "name": "尾气处理",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。移除对方 1 个持续效果（天赋效果除外）",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "尾气处理",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。移除对方 1 个持续效果（天赋效果除外）",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "循环利用",
        "type": "idea",
        "desc": "怪物将弃牌堆中所有逻辑卡洗回牌库，然后摸 3 张牌",
        "cost": 2,
        "mDraw": 4,
        "mPlayerDraw": 3,
        "mDiscardPlayer": 2
      }
    ]
  },
  "s06": {
    "id": "s06",
    "name": "遗传与进化",
    "tier": "mock",
    "subject": "生物",
    "emoji": "🧬",
    "hp": 800,
    "intelligence": 65,
    "eq": 0,
    "physique": 0,
    "talent": "自然选择 / 基因突变",
    "noChapterScale": true,
    "deck": [
      {
        "name": "基因重组",
        "type": "idea",
        "desc": "双方各随机弃 2 张手牌，然后各摸 3 张牌。怪物额外摸 1 张",
        "cost": 2,
        "mDraw": 4,
        "mPlayerDraw": 3,
        "mDiscardPlayer": 2
      },
      {
        "name": "基因重组",
        "type": "idea",
        "desc": "双方各随机弃 2 张手牌，然后各摸 3 张牌。怪物额外摸 1 张",
        "cost": 2,
        "mDraw": 4,
        "mPlayerDraw": 3,
        "mDiscardPlayer": 2
      },
      {
        "name": "显性表达",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。若对方手牌中有上一回合基因重组弃入弃牌堆的同名牌，伤害翻倍",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "显性表达",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。若对方手牌中有上一回合基因重组弃入弃牌堆的同名牌，伤害翻倍",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "隐性携带",
        "type": "idea",
        "desc": "选择对方弃牌堆中 1 张牌，洗入对方牌库。3 回合后若该牌仍在牌库中，对方受到 20 点伤害",
        "cost": 3,
        "mFixedDamage": 20
      },
      {
        "name": "适者生存",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。若对方生命高于 60%，额外造成 60% 伤害；若低于 40%，怪物回复等量生命",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "适者生存",
        "type": "logic",
        "desc": "造成 1.5 倍智力伤害。若对方生命高于 60%，额外造成 60% 伤害；若低于 40%，怪物回复等量生命",
        "cost": 2,
        "dmgStat": "intelligence",
        "dmgMult": 1.5
      },
      {
        "name": "进化适应",
        "type": "idea",
        "desc": "怪物本回合免疫下一个负面效果。若本回合未触发免疫，回合结束时获得 15 点护盾",
        "cost": 2,
        "mShield": 15
      },
      {
        "name": "进化适应",
        "type": "idea",
        "desc": "怪物本回合免疫下一个负面效果。若本回合未触发免疫，回合结束时获得 15 点护盾",
        "cost": 2,
        "mShield": 15
      }
    ]
  },
  "s07": {
    "id": "s07",
    "name": "政史地综合",
    "tier": "mock",
    "subject": "文综",
    "emoji": "📚",
    "hp": 1000,
    "intelligence": 0,
    "eq": 52,
    "physique": 0,
    "talent": "知识储备 / 综合素养",
    "noChapterScale": true,
    "deck": [
      {
        "name": "政治辨析",
        "type": "idea",
        "desc": "对方选择：展示手牌中所有思路卡并各受到 3 点伤害，或展示手牌中所有逻辑卡并各弃置",
        "cost": 2,
        "mFixedDamage": 3
      },
      {
        "name": "政治辨析",
        "type": "idea",
        "desc": "对方选择：展示手牌中所有思路卡并各受到 3 点伤害，或展示手牌中所有逻辑卡并各弃置",
        "cost": 2,
        "mFixedDamage": 3
      },
      {
        "name": "历史脉络",
        "type": "idea",
        "desc": "对方牌库顶 5 张牌按消耗从高到低排列。每有 1 张消耗 >= 3 的牌，对方受到 4 点伤害",
        "cost": 3,
        "mFixedDamage": 4
      },
      {
        "name": "历史脉络",
        "type": "idea",
        "desc": "对方牌库顶 5 张牌按消耗从高到低排列。每有 1 张消耗 >= 3 的牌，对方受到 4 点伤害",
        "cost": 3,
        "mFixedDamage": 4
      },
      {
        "name": "地理图表",
        "type": "logic",
        "desc": "造成 1.5 倍情商伤害。若对方手牌 >= 6 张，伤害范围扩散：额外对对方弃牌堆顶的牌造成\"每有 3 张牌受到 2 点伤害\"",
        "cost": 2,
        "dmgStat": "eq",
        "dmgMult": 1.5
      },
      {
        "name": "地理图表",
        "type": "logic",
        "desc": "造成 1.5 倍情商伤害。若对方手牌 >= 6 张，伤害范围扩散：额外对对方弃牌堆顶的牌造成\"每有 3 张牌受到 2 点伤害\"",
        "cost": 2,
        "dmgStat": "eq",
        "dmgMult": 1.5
      },
      {
        "name": "跨科论述",
        "type": "logic",
        "desc": "造成 2.5 倍情商伤害。若本回合对方使用过 >= 2 种类型的卡牌，改为 4 倍",
        "cost": 4,
        "dmgStat": "eq",
        "dmgMult": 2.5
      },
      {
        "name": "跨科论述",
        "type": "logic",
        "desc": "造成 2.5 倍情商伤害。若本回合对方使用过 >= 2 种类型的卡牌，改为 4 倍",
        "cost": 4,
        "dmgStat": "eq",
        "dmgMult": 2.5
      },
      {
        "name": "时事热点",
        "type": "idea",
        "desc": "移除对方所有护盾。对方下回合开始时若没有护盾，受到 15 点伤害",
        "cost": 2,
        "mFixedDamage": 15
      }
    ]
  },
  "s08": {
    "id": "s08",
    "name": "终极模拟",
    "tier": "mock",
    "subject": "全科",
    "emoji": "🎓",
    "hp": 1400,
    "intelligence": 35,
    "eq": 35,
    "physique": 35,
    "talent": "全能型选手 / 极限压力",
    "noChapterScale": true,
    "deck": [
      {
        "name": "全科覆盖",
        "type": "idea",
        "desc": "怪物本回合智力、情商、体魄各 +5。对方选择其中一项属性 -5（本场战斗）",
        "cost": 2,
        "mShield": 20,
        "ruleFallback": true
      },
      {
        "name": "全科覆盖",
        "type": "idea",
        "desc": "怪物本回合智力、情商、体魄各 +5。对方选择其中一项属性 -5（本场战斗）",
        "cost": 2,
        "mShield": 20,
        "ruleFallback": true
      },
      {
        "name": "全科覆盖",
        "type": "idea",
        "desc": "怪物本回合智力、情商、体魄各 +5。对方选择其中一项属性 -5（本场战斗）",
        "cost": 2,
        "mShield": 20,
        "ruleFallback": true
      },
      {
        "name": "题型切换",
        "type": "idea",
        "desc": "怪物切换主攻属性（在智力/情商/体魄间轮换）。切换后下一张逻辑卡伤害 x1.5",
        "cost": 1,
        "mShield": 20,
        "ruleFallback": true
      },
      {
        "name": "题型切换",
        "type": "idea",
        "desc": "怪物切换主攻属性（在智力/情商/体魄间轮换）。切换后下一张逻辑卡伤害 x1.5",
        "cost": 1,
        "mShield": 20,
        "ruleFallback": true
      },
      {
        "name": "重拳出击",
        "type": "logic",
        "desc": "造成（当前主属性 x2）的伤害。此伤害类型随怪物当前主属性变化",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "重拳出击",
        "type": "logic",
        "desc": "造成（当前主属性 x2）的伤害。此伤害类型随怪物当前主属性变化",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "重拳出击",
        "type": "logic",
        "desc": "造成（当前主属性 x2）的伤害。此伤害类型随怪物当前主属性变化",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "考点盲区",
        "type": "idea",
        "desc": "对方展示所有手牌。怪物选择其中 1 张，该牌本场战斗消耗 +2 且效果数值减半",
        "cost": 2,
        "mShield": 20,
        "ruleFallback": true
      },
      {
        "name": "交卷铃响",
        "type": "answer",
        "desc": "造成（智力 + 情商 + 体魄）x1.5 的伤害。若对方生命低于 30%，改为 x3。移除",
        "cost": 5,
        "dmgStat": "intelligence",
        "dmgMult": 1.5,
        "ruleFallback": true
      }
    ]
  },
  "gaokao": {
    "id": "gaokao",
    "name": "高考",
    "tier": "gaokao",
    "subject": "全科",
    "emoji": "🎓",
    "hp": 5000,
    "intelligence": 100,
    "eq": 100,
    "physique": 100,
    "talent": "十年寒窗 / 融会贯通",
    "noChapterScale": true,
    "deck": [
      {
        "name": "语文·作文",
        "type": "idea",
        "desc": "对方牌库顶 5 张牌进入弃牌堆。其中每有 1 张解答卡，高考回复 30 点生命。对方手牌数 - 弃牌堆中逻辑卡数的差值若 >= 3，对方受到 20 点伤害",
        "cost": 2,
        "mHeal": 30,
        "mFixedDamage": 20,
        "mMillPlayer": 5
      },
      {
        "name": "语文·作文",
        "type": "idea",
        "desc": "对方牌库顶 5 张牌进入弃牌堆。其中每有 1 张解答卡，高考回复 30 点生命。对方手牌数 - 弃牌堆中逻辑卡数的差值若 >= 3，对方受到 20 点伤害",
        "cost": 2,
        "mHeal": 30,
        "mFixedDamage": 20,
        "mMillPlayer": 5
      },
      {
        "name": "数学·压轴",
        "type": "logic",
        "desc": "造成（最高属性 x2）的伤害。此伤害至少为 50 点。对方每有 1 点护盾，此伤害 +5",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "数学·压轴",
        "type": "logic",
        "desc": "造成（最高属性 x2）的伤害。此伤害至少为 50 点。对方每有 1 点护盾，此伤害 +5",
        "cost": 3,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "英语·阅读",
        "type": "idea",
        "desc": "对方摸 4 张牌。回合结束时，对方手牌超过 7 张的部分进入弃牌堆，且每弃 1 张受到 8 点伤害",
        "cost": 1,
        "mPlayerDraw": 4,
        "mFixedDamage": 8
      },
      {
        "name": "英语·阅读",
        "type": "idea",
        "desc": "对方摸 4 张牌。回合结束时，对方手牌超过 7 张的部分进入弃牌堆，且每弃 1 张受到 8 点伤害",
        "cost": 1,
        "mPlayerDraw": 4,
        "mFixedDamage": 8
      },
      {
        "name": "理综·实验",
        "type": "logic",
        "desc": "若对方上回合使用过逻辑卡：造成（最高属性 x1.5）伤害并穿透护盾。若对方上回合使用过思路卡：高考获得 25 点护盾。若两者都使用过：两者都触发",
        "cost": 2,
        "mShield": 25,
        "pierce": true,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "理综·实验",
        "type": "logic",
        "desc": "若对方上回合使用过逻辑卡：造成（最高属性 x1.5）伤害并穿透护盾。若对方上回合使用过思路卡：高考获得 25 点护盾。若两者都使用过：两者都触发",
        "cost": 2,
        "mShield": 25,
        "pierce": true,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "文综·论述",
        "type": "idea",
        "desc": "对方选择：展示所有手牌并受到（展示数 x4）伤害，或弃置所有手牌中的逻辑卡",
        "cost": 2,
        "mShield": 20,
        "ruleFallback": true
      },
      {
        "name": "文综·论述",
        "type": "idea",
        "desc": "对方选择：展示所有手牌并受到（展示数 x4）伤害，或弃置所有手牌中的逻辑卡",
        "cost": 2,
        "mShield": 20,
        "ruleFallback": true
      },
      {
        "name": "成长·进化",
        "type": "idea",
        "desc": "高考永久获得一项（随机不重复）：所有伤害 +10 / 回合开始时回复 30 生命 / 获得 30 点护盾 / 对方下回合少摸 2 张牌。最多获得 4 项",
        "cost": 3,
        "mShield": 30,
        "mHeal": 30,
        "mDraw": 2,
        "mPlayerDrawPenalty": 2
      },
      {
        "name": "终极·冲刺",
        "type": "logic",
        "desc": "造成（智力+情商+体魄）x1.5 的伤害。弃置对方所有护盾。本场战斗高考已使用过的卡牌类型每有 1 种，额外 +0.5 倍。移除",
        "cost": 5,
        "dmgStat": "intelligence",
        "dmgMult": 1
      },
      {
        "name": "押题·爆牌",
        "type": "idea",
        "desc": "对方牌库顶 3 张进入弃牌堆。若其中有解答卡，对方受到 20 伤害",
        "cost": 1,
        "mMillPlayer": 3
      },
      {
        "name": "步骤·护盾",
        "type": "idea",
        "desc": "高考获得 15 点护盾",
        "cost": 0,
        "mShield": 15
      },
      {
        "name": "生词·摸牌",
        "type": "idea",
        "desc": "高考摸 3 张牌",
        "cost": 0,
        "mDraw": 3
      },
      {
        "name": "电磁·增伤",
        "type": "idea",
        "desc": "本回合高考下一次伤害 +15",
        "cost": 1,
        "mNextLogicBonus": 15
      },
      {
        "name": "催化·减费",
        "type": "idea",
        "desc": "本回合高考所有卡牌消耗 -2",
        "cost": 1,
        "mShield": 20,
        "ruleFallback": true
      },
      {
        "name": "基因·回复",
        "type": "idea",
        "desc": "高考回复 40 点生命",
        "cost": 1,
        "mHeal": 40
      },
      {
        "name": "知识·体力",
        "type": "idea",
        "desc": "高考获得 2 点体力（可突破上限）",
        "cost": 0,
        "mEnergy": 2
      },
      {
        "name": "全能·免疫",
        "type": "idea",
        "desc": "高考免疫下一次受到的伤害",
        "cost": 2,
        "mShield": 20,
        "ruleFallback": true
      }
    ]
  }
};
G.MONSTER_POOLS = {
  "quiz": [
    "chengyu",
    "q02",
    "jitu",
    "q04",
    "q05",
    "q06",
    "q07",
    "q08",
    "fangcheng",
    "q10",
    "q11",
    "q12",
    "q13",
    "q14",
    "q15",
    "q16",
    "q17",
    "q18",
    "q19",
    "q20",
    "q21",
    "q22",
    "q23",
    "q24",
    "q25",
    "q26",
    "q27",
    "q28",
    "q29",
    "q30",
    "q31",
    "q32",
    "q33",
    "q34",
    "q35",
    "q36",
    "q37",
    "q38",
    "q39",
    "q40"
  ],
  "monthly": [
    "m01",
    "m02",
    "m03",
    "m04",
    "m05",
    "m06",
    "m07",
    "m08",
    "m09",
    "m10"
  ],
  "mock": [
    "s01",
    "s02",
    "s03",
    "s04",
    "s05",
    "s06",
    "s07",
    "s08"
  ],
  "gaokao": [
    "gaokao"
  ]
};
G.MONSTER_LIST = Object.keys(G.MONSTERS);
