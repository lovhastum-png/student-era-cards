// data — 游戏数据定义（由游戏编辑器生成于 2026/8/23 23:21:29）
// 注意：在编辑器里保存会重写此文件（注释会被移除，数据内容保留）；每次保存自动备份到 _editor_backup/
// 依赖顺序：core → data → battle → map → fx → scenes；共用全局 G，禁止改成模块化 import。

// ==================== 角色 ====================
G.CHARACTERS = {
  "xueshilei": {
    "id": "xueshilei",
    "name": "薛诗蕾",
    "emoji": "📐",
    "desc": "刷题就是正义。",
    "style": "智力型·理性爆发",
    "birthday": "1995/12/01",
    "physique": 7,
    "intelligence": 5,
    "eq": 3,
    "gender": "女",
    "portrait": "立绘/薛诗蕾.png",
    "selectPortrait": "立绘/薛诗蕾.png",
    "battlePortrait": "立绘/薛诗蕾Q版_副本.png",
    "avatar": "立绘/蕾头像.png",
    "skill": {
      "id": "zaishuayiti",
      "name": "再刷一题",
      "cd": 4,
      "desc": "立即摸2张逻辑卡，接下来2张逻辑卡消耗-1",
      "type": "active"
    },
    "starterDeck": [
      "shuati",
      "shuati",
      "shuati",
      "shuati",
      "shuati",
      "fuxi",
      "fuxi",
      "fuxi",
      "sisuo",
      "sisuo",
      "beikao",
      "beikao",
      "renzhen_beikao"
    ],
    "exclusive": [
      "henhen_shuati",
      "fanfu_shuati",
      "dali_shuati",
      "tongxiao_fuxi",
      "yaobijian",
      "cuoti_chongzuo",
      "sike_dati",
      "caogao_tuiyan",
      "zaisuan_yizhong",
      "daan_xieman",
      "xinde_changshi",
      "renzhen_duidai",
      "chongxin_sikao",
      "laoyi_jiehe",
      "xiannan_houyi",
      "juyi_fansan",
      "lingguang_yixian",
      "wo_suan_cuo",
      "lengjing_fenxi",
      "yazhou_yibi",
      "zhedao_wuhui",
      "quanbu_yansuan"
    ],
    "stars": {
      "2": {
        "passive": "qinjuan",
        "desc": "勤卷（被动）：每使用3张逻辑卡，下一张逻辑卡消耗-2"
      },
      "3": {
        "stats": {
          "intelligence": 1
        },
        "energyBonus": {
          "max": 2
        },
        "desc": "智力+1 体力上限+2"
      },
      "4": {
        "battleStart": "sheineng",
        "name": "谁能有我卷？",
        "desc": "「谁能有我卷？」（紫）：打出带有【已变更】的卡牌时获得1层理性，每回合最多3次"
      },
      "5": {
        "stats": {
          "physique": 2,
          "intelligence": 1
        },
        "deckAdd": [
          "aoshu_zhiwang"
        ],
        "desc": "体魄+2 智力+1，获得卡牌「奥数之王」"
      }
    }
  },
  "xiaoqingya": {
    "id": "xiaoqingya",
    "name": "肖清雅",
    "emoji": "📝",
    "desc": "文字有力量。",
    "style": "情商型·创作构筑·四向写作",
    "physique": 7,
    "intelligence": 3,
    "eq": 5,
    "gender": "女",
    "portrait": "立绘/肖清雅.png",
    "selectPortrait": "立绘/肖清雅.png",
    "battlePortrait": "立绘/肖清雅Q版.jpg_副本.png",
    "avatar": "立绘/雅头像.png",
    "skill": {
      "id": "creation",
      "name": "创作",
      "cd": 1,
      "desc": "若手中没有创作卡，生成1张创作卡并选择写作方向；若已有创作卡，则切换其写作方向。灵感值与已加入效果不会因切换方向而改变。",
      "type": "active"
    },
    "starterDeck": [
      "tianci",
      "tianci",
      "tianci",
      "tianci",
      "tianci",
      "zaoju",
      "zaoju",
      "zaoju",
      "xiuci",
      "xiuci",
      "shangai",
      "shangai",
      "tingbi",
      "gangbi",
      "manfen_zuowen"
    ],
    "exclusive": [
      "fangxie",
      "kuoxie",
      "xuxie",
      "yinyong",
      "paibi",
      "guancha",
      "zhaichao",
      "sucai_jilei",
      "caogao",
      "jingxiu",
      "wensi_quanyong",
      "fanfu_tuikao",
      "shuqing_sanwen",
      "kaochang_jiazuo",
      "duhougan"
    ],
    "stars": {
      "2": {
        "passive": "jiaojihua",
        "desc": "交际花（被动）：你的搭档上限+1，每位搭档为你提供5点阅读速度"
      },
      "3": {
        "stats": {
          "eq": 1
        },
        "energyBonus": {
          "max": 2
        },
        "desc": "情商+1 体力上限+2"
      },
      "4": {
        "battleStart": "chiqing",
        "name": "痴情",
        "desc": "「痴情」（紫）：使用卡后，我方各处同名卡牌计算伤害时，情商临时+1用在该次伤害（无限叠加，不被消耗）"
      },
      "5": {
        "stats": {
          "eq": 1,
          "physique": 1
        },
        "deckAdd": [
          "qianniuxing"
        ],
        "desc": "情商+1 体魄+1，获得卡牌「迢迢牵牛星」"
      }
    }
  },
  "chengliang": {
    "id": "chengliang",
    "name": "程良",
    "emoji": "🏋️",
    "desc": "以生命换护盾的体魄流。",
    "style": "体魄型·生命护盾",
    "physique": 11,
    "intelligence": 3,
    "eq": 1,
    "gender": "男",
    "portrait": "立绘/程良.png",
    "selectPortrait": "立绘/程良.png",
    "battlePortrait": "立绘/程良Q.png",
    "avatar": "立绘/良头像.png",
    "skill": {
      "id": "jianshen",
      "name": "锻炼",
      "cd": 3,
      "desc": "回复30%最大生命值",
      "type": "active"
    },
    "starterDeck": [
      "yiquan",
      "yiquan",
      "yiquan",
      "yiquan",
      "yiquan",
      "hulian",
      "hulian",
      "hulian",
      "feiti",
      "rennai",
      "yinren",
      "yinren",
      "fuzhong_xunlian",
      "chengliang_wristband",
      "xuyi_hongquan",
      "chi_binggun",
      "gangbi"
    ],
    "exclusive": ["fuzhong_xunlian", "chengliang_wristband"],
    "stars": {
      "2": {
        "passive": "jiejian",
        "desc": "勤俭（被动）：零花钱以及耐力获取量+30%"
      },
      "3": {
        "stats": {
          "physique": 1
        },
        "energyBonus": {
          "max": 2
        },
        "desc": "体魄+1 体力上限+2"
      },
      "4": {
        "battleStart": "liangge",
        "name": "坚韧",
        "desc": "「坚韧」（紫）：护盾获取量提升，提升比例等同于当前已损失生命值百分比"
      },
      "5": {
        "stats": {
          "physique": 3
        },
        "deckAdd": [
          "wanfu_mo_di"
        ],
        "desc": "体魄+3，获得卡牌「万夫莫敌」"
      }
    }
  },
  "menghuaian": {
    "id":"menghuaian","name":"孟怀安","emoji":"🔍","desc":"看穿概率，精准制胜。","style":"智情双属性·概率精准","physique":6,"intelligence":6,"eq":6,"gender":"男",
    "portrait":"立绘/孟怀安.png","selectPortrait":"立绘/孟怀安.png","battlePortrait":"立绘/孟怀安Q版.jpg.png","avatar":"立绘/孟头像.png",
    "skill":{"id":"kantou","name":"看透","cd":1,"desc":"造成（0.3+精准层数×0.2）倍智力伤害，随后50%概率获得1层精准。","type":"active"},
    "starterDeck":["xia_bi","xia_bi","xia_bi","xia_bi","xia_bi","hui_shou","hui_shou","hui_shou","hui_shou","hui_shou","fu_yanjing","fu_yanjing","lixing_sikao","dongxi","bijiben"],
    "exclusive":["xia_bi","hui_shou","fu_yanjing","lixing_sikao","dongxi","jiegou","bijiben","xiaci"],
    "stars":{
      "2":{"passive":"qiangyun","desc":"强运（被动）：概率判定额外进行一次并取最优结果；高阶品质最终权重+5%。"},
      "3":{"stats":{"intelligence":1,"eq":1},"energyBonus":{"max":1},"desc":"智力+1 情商+1 体力上限+1"},
      "4":{"battleStart":"xueshen_zhilu","name":"学神之路","desc":"获得紫色天赋【学神之路】：每经历一次大考，三维各+1；高三获得时改为三维各+3。"},
      "5":{"deckAdd":["xiaci"],"desc":"获得卡牌【下次见】。"}
    }
  },
  "tangsong": {
    "id": "tangsong",
    "name": "唐淞",
    "emoji": "😏",
    "desc": "傲慢与无视的博弈。",
    "style": "智力型·傲慢博弈",
    "physique": 5,
    "intelligence": 9,
    "eq": 1,
    "gender": "男",
    "portrait": "立绘/唐淞.png",
    "skill": {
      "id": "pini",
      "name": "睥睨",
      "cd": 3,
      "desc": "为自身添加2层无视，摸一张牌",
      "type": "active"
    },
    "starterDeck": [
      "mieshi",
      "mieshi",
      "mieshi",
      "mieshi",
      "zifu",
      "zifu",
      "siwei",
      "siwei",
      "aoqi",
      "aoqi",
      "zixin_manman",
      "zixin_manman",
      "zhiyuxue"
    ],
    "exclusive": [
      "bishi",
      "suishi_yizhuang",
      "zixin_yixiao",
      "shushi_wudu",
      "suixing_yanyu",
      "zaishi_yici",
      "shoulian_yixia",
      "guannizhena",
      "muzhong_wuren",
      "jinzai_zhangwo"
    ],
    "stars": {
      "2": {
        "passive": "jiaoao",
        "desc": "骄傲（被动）：每通过一个战斗节点，无视层数上限+4"
      },
      "3": {
        "stats": {
          "intelligence": 1
        },
        "energyBonus": {
          "max": 2
        },
        "desc": "智力+1 体力上限+2"
      },
      "4": {
        "battleStart": "wusuoweiju",
        "name": "无所畏惧",
        "desc": "「无所畏惧」（紫）：战斗开始添加10层无视与2层骄傲"
      },
      "5": {
        "stats": {
          "physique": 2,
          "intelligence": 1
        },
        "deckAdd": [
          "long_aotian"
        ],
        "desc": "体魄+2 智力+1，获得卡牌「龙傲天」"
      }
    }
  },
  "tanzijun": {
    "id": "tanzijun",
    "name": "谭梓君",
    "emoji": "🏃",
    "desc": "运动系少女，用体力碾过考试。",
    "style": "体魄型·体力循环",
    "physique": 10,
    "intelligence": 1,
    "eq": 4,
    "gender": "女",
    "portrait": "立绘/谭梓君.png",
    "selectPortrait": "立绘/谭梓君.png",
    "battlePortrait": "立绘/谭梓君Q版.jpg_副本.png",
    "avatar": "立绘/君头像.png",
    "skill": {
      "id": "huoli",
      "name": "活力",
      "cd": 2,
      "desc": "回复2点体力",
      "type": "active"
    },
    "starterDeck": [
      "benpao",
      "benpao",
      "benpao",
      "benpao",
      "benpao",
      "zhupao",
      "zhupao",
      "zhupao",
      "tiaoyuan",
      "tiaoyuan",
      "reqing",
      "reqing",
      "junjie_moshi"
    ],
    "exclusive": [
      "jielibang",
      "qianqiu",
      "qiangpao",
      "baimi_chongci",
      "tanzijun_tool"
    ],
    "stars": {
      "2": {
        "passive": "haodong",
        "desc": "获得被动【好动】：每累计消耗3点体力，摸1张牌"
      },
      "3": {
        "stats": {
          "physique": 1
        },
        "energyBonus": {
          "max": 2
        },
        "desc": "体魄+1 体力上限+2"
      },
      "4": {
        "battleStart": "kuaisu_xuanzhuan",
        "name": "快速旋转",
        "desc": "获得紫色天赋【快速旋转】：每回复1点体力，对敌方造成2点伤害；体力上限大于10时，改为造成0.5倍体魄伤害"
      },
      "5": {
        "stats": {
          "physique": 1,
          "intelligence": 2
        },
        "deckAdd": [
          "yongwuzhijing"
        ],
        "desc": "体魄+1、智力+2，获得红色解答卡【永无止境】"
      }
    }
  },
  "liangchaojie":{
    "id":"liangchaojie","name":"梁超杰","emoji":"🎮","desc":"靠升级与护盾滚出成长优势的男生。","style":"升级流·护盾流·成长爆发","physique":9,"intelligence":3,"eq":3,"gender":"男",
    "portrait":"立绘/梁超杰.png","selectPortrait":"立绘/梁超杰.png","selectAvatar":"立绘/杰头像.png","battlePortrait":"立绘/梁超杰Q版.jpg.png","avatar":"立绘/杰头像.png",
    "skill":{"id":"daguai_shengji","name":"打怪升级","cd":6,"desc":"选择1张手牌，使其本场战斗品质提升1级，最高金色。符合伤害条件时每回合最多重置1次。","type":"active"},
    "starterDeck":["lcj_bazhang","lcj_bazhang","lcj_bazhang","lcj_bazhang","lcj_bazhang","lianhuan_bazhang","lianhuan_bazhang","lianhuan_bazhang","tiansheng_wocai","tiansheng_wocai","kuangre_yuedu","juyi_fansan_lcj","juyi_fansan_lcj","zhizhuo_lcj"],
    "exclusive":[],
    "stars":{
      "2":{"passive":"shumi","desc":"【书迷】：阅读速度+10%；每读完1本书，战斗开始获得5护盾，最多25。"},
      "3":{"stats":{"physique":1},"energyBonus":{"max":2},"desc":"体魄+1，体力上限+2。"},
      "4":{"battleStart":"yueji_tiaozhan","name":"越级挑战","desc":"获得紫色天赋【越级挑战】。"},
      "5":{"stats":{"physique":1,"intelligence":2},"deckAdd":["manji_gonglue"],"desc":"体魄+1、智力+2，获得【满级攻略】。"}
    }
  },
  "xiaomeng": {
    "id": "xiaomeng",
    "name": "小萌·霜眠",
    "emoji": "😴",
    "desc": "天天碎觉的少女。",
    "style": "智力型·梦境控制",
    "physique": 1,
    "intelligence": 7,
    "eq": 7,
    "gender": "女",
    "portrait": "立绘/小萌.png?v=20260903215236",
    "selectPortrait": "立绘/小萌.png?v=20260903215236",
    "selectAvatar": "立绘/萌头像.png?v=20260903",
    "battlePortrait": "立绘/小萌Q版.png_副本.png",
    "avatar": "立绘/小萌.png?v=20260903215236",
    "physiqueLocked": true,
    "skill": {
      "id": "shangke_xianshui",
      "name": "上课先睡一觉",
      "cd": 2,
      "desc": "回复1点体力并获得2枚【梦屑】",
      "type": "active"
    },
    "starterDeck": [
      "shuimian_bazhang",
      "shuimian_bazhang",
      "shuimian_bazhang",
      "shuixingle",
      "shuixingle",
      "aoye",
      "aoye",
      "dakeshui",
      "yiwang",
      "baojin_zhentou",
      "baojin_zhentou",
      "baojin_zhentou",
      "emeng_jiashuo",
      "jiyi_gui_ling"
      ,"kemu_zhentou"
    ],
    "exclusive":["kemu_zhentou","mengyou","turan_jingxing","fan_geshen","shuo_menghua","qichuangqi","mengzhong_zhuiji","laichuang","shendu_shuimian","mengjing_huishou","qianmian","guojin_beizi","naozhong_xiangle","xingmeng","mengxing_shifen","yanzhao"],
    "stars": {
      "2": {
        "passive": "qianyishi",
        "desc": "潜意识（被动）：对方的回合开始时，获得2层【梦屑】"
      },
      "3": {
        "stats": {
          "eq": 1
        },
        "energyBonus": {
          "max": 2
        },
        "desc": "情商+1 体力上限+2"
      },
      "4": {
        "battleStart": "dameng_shuixianjue",
        "name": "大梦谁先觉",
        "desc": "【大梦谁先觉】：重整旗鼓次数+1；重整旗鼓时，获得卡组中及自身可以获得的所有增益各3层"
      },
      "5": {
        "deckAdd": [
          "yongheng"
        ],
        "desc": "获得卡牌【永恒】"
      }
    }
  },
  "xiaomeng_fiora": {
    "id":"xiaomeng_fiora","name":"胡哓萌","formName":"剑姬哓萌","emoji":"⚔️",
    "desc":"热爱击剑的少女，擅长观察动作并连续击破破绽。","style":"体魄型·破绽击破·连续追击",
    "physique":8,"intelligence":4,"eq":3,"gender":"女",
    "portrait":"立绘/剑姬哓萌.png","selectPortrait":"立绘/普通哓萌.png","selectAvatar":"立绘/Q版胡哓萌.png","battlePortrait":"立绘/Q版剑姬哓萌.png","avatar":"立绘/普通哓萌.png","exPortrait":"立绘/剑姬哓萌.png","exSelectAvatar":"立绘/Q版剑姬哓萌.png","cardFrame":"卡牌样式/剑姬哓萌卡牌外框.png",
    "skill":{"id":"duel","name":"决斗","cd":1,"desc":"随机展示2个不同种类的破绽，优先选择手牌中数量最多的前两个种类；击破时造成2倍智力真实伤害并回复5%最大生命。再次使用会覆盖旧破绽。","type":"active"},
    "starterDeck":["pokongzhan","pokongzhan","pokongzhan","pokongzhan","pokongzhan","xinyandao","xinyandao","xinyandao","lianci","lianci","kanpo","qianxing","wushuangjian","wushuang_tiaozhan"],
    "exclusive":["jingzhun_ciji","zhuiji_fiora","sanduan_tuci","jianfeng_yazhi","juedou_zhuiming","ruili_bufa","juedou_yaoqing","gongshou_zhuanhuan","huali_lianzhao"],
    "stars":{
      "2":{"passive":"duel_dance","desc":"决斗之舞（被动）：回合开始随机展示1个与现有破绽种类不同的临时破绽；已有四种破绽时不生成，未击破则回合结束时移除。"},
      "3":{"stats":{"intelligence":1},"energyBonus":{"max":2},"desc":"智力+1 体力上限+2"},
      "4":{"battleStart":"girl_glory","name":"少女的荣耀","desc":"「少女的荣耀」（紫）：逻辑卡回复5生命、思路卡回复1体力，两种效果按先后轮流等待触发。"},
      "5":{"deckAdd":["blade_waltz"],"desc":"获得卡牌「利刃华尔兹」"}
    }
  }
};

// ==================== 剧情 / CG事件（可在编辑器中修改） ====================
G.CG_EVENTS = {
  "xiaolei_tutorial_reward": {
    "id":"xiaolei_tutorial_reward",
    "name":"小蕾教程奖励CG",
    "character":"xueshilei",
    "dialogue":[{"text":"（奖励内容占位：等待剧情文案补入后替换）"}],
    "image":"其他插画/薛诗蕾cg.png",
    "music":"",
    "loopMusic":false,
    "options":[{"text":"继续"}]
  }
};

// ==================== 卡牌 ====================
// 效果字段说明见编辑器「效果积木」面板（如 comboDmg 连击 / lifestealPct 吸血 / poison 中毒）
G.CARDS = {
  "shuati": {
    "id": "shuati",
    "name": "刷题",
    "type": "logic",
    "cost": 1,
    "q": "red",
    "desc": "造成1.2倍智力伤害；若当前消耗为2，额外造成0.5倍智力伤害",
    "dmgStat": "intelligence",
    "dmgMult": 1.2,
    "extraIfCost2": 0.5,
    "frame": "xiaolei",
    "art": "卡牌插画/刷题.png",
    "qv": {
      "blue": {
        "dmgMult": 1.4
      },
      "purple": {
        "dmgMult": 1.6
      },
      "gold": {
        "dmgMult": 2
      }
    }
  },
  "fuxi": {
    "id": "fuxi",
    "name": "复习",
    "type": "logic",
    "cost": 1,
    "q": "green",
    "desc": "获得1.2倍智力护盾",
    "shieldStat": "intelligence",
    "shieldMult": 1.2,
    "frame": "xiaolei",
    "qv": {
      "blue": {
        "shieldMult": 1.4
      },
      "purple": {
        "shieldMult": 1.6
      },
      "gold": {
        "shieldMult": 1.8
      }
    }
  },
  "sisuo": {
    "id": "sisuo",
    "name": "思索",
    "type": "idea",
    "q": "green",
    "cost": 1,
    "q": "purple",
    "desc": "获得1层理性",
    "status": {
      "rationality": 1
    },
    "frame": "xiaolei",
    "qv": {
      "gold": {
        "cost": 0,
        "desc": "获得1层理性，摸1张牌",
        "drawCards": 1
      }
    }
  },
  "beikao": {
    "id": "beikao",
    "name": "备考",
    "type": "idea",
    "q": "green",
    "cost": 1,
    "q": "blue",
    "desc": "下一张逻辑卡+1费并获得30%倍率提升",
    "beikao": {
      "n": 1,
      "pct": 30
    },
    "frame": "xiaolei",
    "qv": {
      "purple": {
        "desc": "接下来2张逻辑卡+1费并获得40%倍率提升",
        "beikao": {
          "n": 2,
          "pct": 40
        }
      },
      "gold": {
        "cost": 1,
        "desc": "接下来3张逻辑卡+1费并获得50%倍率提升",
        "beikao": {
          "n": 3,
          "pct": 50
        }
      }
    }
  },
  "renzhen_beikao": {
    "id": "renzhen_beikao",
    "name": "认真备考",
    "type": "answer",
    "cost": 3,
    "q": "blue",
    "desc": "获得5层理性；若此牌当前消耗低于3，获得层数减半",
    "status": {
      "rationality": 5
    },
    "halveIfCostBelow3": true,
    "frame": "xiaolei",
    "qv": {
      "purple": {
        "status": {
          "rationality": 6
        },
        "desc": "获得6层理性；若此牌当前消耗低于3，获得层数减半"
      },
      "gold": {
        "status": {
          "rationality": 8
        },
        "desc": "获得8层理性；若此牌当前消耗低于3，获得层数减半"
      },
      "red": {
        "status": {
          "rationality": 10
        },
        "desc": "获得10层理性；若此牌当前消耗低于3，获得层数减半"
      }
    }
  },
  "henhen_shuati": {
    "id": "henhen_shuati",
    "name": "狠狠刷题",
    "type": "logic",
    "cost": 2,
    "q": "blue",
    "desc": "造成2.3倍智力伤害；当前消耗每高于原始消耗1点，倍率+0.5",
    "dmgStat": "intelligence",
    "dmgMult": 2.3,
    "aboveBonus": 0.5,
    "frame": "xiaolei",
    "qv": {
      "purple": {
        "dmgMult": 2.6
      },
      "gold": {
        "dmgMult": 2.9
      }
    }
  },
  "fanfu_shuati": {
    "id": "fanfu_shuati",
    "name": "反复刷题",
    "type": "logic",
    "cost": 2,
    "q": "blue",
    "desc": "造成2次1.4倍智力伤害；若当前消耗大于3，下一张逻辑卡消耗-1",
    "dmgStat": "intelligence",
    "dmgMult": 1.4,
    "hits": 2,
    "ifCostGt3NextDiscount": 1,
    "frame": "xiaolei",
    "qv": {
      "purple": {
        "dmgMult": 1.6
      }
    }
  },
  "dali_shuati": {
    "id": "dali_shuati",
    "name": "大力刷题",
    "type": "logic",
    "cost": 3,
    "q": "purple",
    "desc": "造成3.5倍智力伤害；结算时每层理性使智力提升25%（每降低1费该提升减少5%）",
    "dmgStat": "intelligence",
    "dmgMult": 3.5,
    "ratStatPct": 0.25,
    "ratStatPctBelow": 0.05,
    "frame": "xiaolei",
    "qv": {
      "gold": {
        "desc": "造成3.5倍智力伤害；结算时每层理性使智力提升30%",
        "ratStatPct": 0.3,
        "ratStatPctBelow": 0
      }
    }
  },
  "tongxiao_fuxi": {
    "id": "tongxiao_fuxi",
    "name": "通宵复习",
    "type": "logic",
    "cost": 2,
    "q": "purple",
    "desc": "获得2.3倍智力护盾，体力为0时改为3.2倍；若此牌为0费，获得2层理性",
    "shieldStat": "intelligence",
    "shieldMult": 2.3,
    "shieldMultLowEnergy": 3.2,
    "zeroCostRat": 2,
    "frame": "xiaolei",
    "qv": {
      "gold": {
        "shieldMultLowEnergy": 4
      }
    }
  },
  "yaobijian": {
    "id": "yaobijian",
    "name": "咬笔尖",
    "type": "logic",
    "cost": 2,
    "q": "purple",
    "desc": "造成3次0.6倍智力伤害，每层理性使每段倍率+0.08",
    "dmgStat": "intelligence",
    "dmgMult": 0.6,
    "hits": 3,
    "ratPerHit": 0.08,
    "frame": "xiaolei",
    "qv": {
      "gold": {
        "ratPerHit": 0.12
      }
    }
  },
  "cuoti_chongzuo": {
    "id": "cuoti_chongzuo",
    "name": "错题重做",
    "type": "logic",
    "cost": 2,
    "q": "purple",
    "desc": "造成2.1倍智力伤害；若此牌带有【已变更】，使手牌中1张其他逻辑卡随机+1或-1费",
    "dmgStat": "intelligence",
    "dmgMult": 2.1,
    "changedModOther": 1,
    "frame": "xiaolei",
    "qv": {
      "gold": {
        "dmgMult": 2.4,
        "changedModOther": 2
      }
    }
  },
  "zai_yansuan": {
    "id": "zai_yansuan",
    "name": "再验算一遍",
    "type": "logic",
    "cost": 1,
    "q": "blue",
    "desc": "造成1.3倍智力伤害；本回合每使用过1张同名卡，本牌倍率+0.8（最多2张）",
    "dmgStat": "intelligence",
    "dmgMult": 1.3,
    "sameNameBonus": 0.8,
    "sameNameMax": 2,
    "frame": "xiaolei",
    "qv": {
      "purple": {
        "dmgMult": 1.5
      },
      "gold": {
        "dmgMult": 1.7,
        "sameNameDraw": 1
      }
    }
  },
  "chaogang_ti": {
    "id": "chaogang_ti",
    "name": "超纲题",
    "type": "logic",
    "cost": 4,
    "q": "purple",
    "desc": "造成4.2倍智力伤害；当前消耗每高1费倍率+0.6，每低1费倍率-0.5",
    "dmgStat": "intelligence",
    "dmgMult": 4.2,
    "aboveBonus": 0.6,
    "belowPenalty": 0.5,
    "frame": "xiaolei",
    "qv": {
      "gold": {
        "dmgMult": 4.8,
        "aboveRat": 1
      }
    }
  },
  "caozhi_manle": {
    "id": "caozhi_manle",
    "name": "草稿纸写满了",
    "type": "logic",
    "cost": 2,
    "q": "blue",
    "desc": "获得1.8倍智力护盾；本回合已使用2张逻辑卡+1层理性，4张再摸1张逻辑卡，6张再返还1点体力",
    "shieldStat": "intelligence",
    "shieldMult": 1.8,
    "caozhiSteps": 1,
    "frame": "xiaolei",
    "qv": {
      "purple": {
        "shieldMult": 2.2
      },
      "gold": {
        "shieldMult": 2.6
      }
    }
  },
  "zheiti_jiejing": {
    "id": "zheiti_jiejing",
    "name": "这题有捷径",
    "type": "logic",
    "cost": 3,
    "q": "purple",
    "desc": "造成2.8倍智力伤害；每降低1费倍率+0.6；0费使用时摸1张逻辑卡",
    "dmgStat": "intelligence",
    "dmgMult": 2.8,
    "belowBonus": 0.6,
    "zeroDrawLogic": 1,
    "frame": "xiaolei",
    "qv": {
      "gold": {
        "dmgMult": 3.2,
        "zeroRat": 2
      }
    }
  },
  "yiti_duojie": {
    "id": "yiti_duojie",
    "name": "一题多解",
    "type": "logic",
    "cost": 2,
    "q": "purple",
    "desc": "造成2倍智力伤害；本次进入手牌后每改变过1次费用，追加1次0.6倍伤害（最多3次）",
    "dmgStat": "intelligence",
    "dmgMult": 2,
    "perChangeHit": 0.6,
    "maxChangeHits": 3,
    "frame": "xiaolei",
    "qv": {
      "gold": {
        "perChangeHit": 0.8
      }
    }
  },
  "shuwan_juanzi": {
    "id": "shuwan_juanzi",
    "name": "刷完这套卷子",
    "type": "logic",
    "cost": 3,
    "q": "blue",
    "desc": "造成2.8倍智力伤害；本回合每使用1张其他逻辑卡，本牌消耗-1；0费使用时获得1层理性",
    "dmgStat": "intelligence",
    "dmgMult": 2.8,
    "costDownPerTurnLogic": 1,
    "zeroRat": 1,
    "frame": "xiaolei",
    "qv": {
      "purple": {
        "dmgMult": 3.2,
        "zeroRat": 2
      },
      "gold": {
        "dmgMult": 3.6,
        "zeroRat": 2
      }
    }
  },
  "xuanze_miao": {
    "id": "xuanze_miao",
    "name": "选择题秒了",
    "type": "logic",
    "cost": 1,
    "q": "green",
    "desc": "造成1.0倍智力伤害；0费时改为1.8倍",
    "dmgStat": "intelligence",
    "dmgMult": 1,
    "zeroMult": 1.8,
    "frame": "xiaolei",
    "qv": {
      "blue": {
        "dmgMult": 1.2,
        "zeroMult": 2.1
      },
      "purple": {
        "dmgMult": 1.4,
        "zeroMult": 2.4
      },
      "gold": {
        "dmgMult": 1.6,
        "zeroMult": 2.8,
        "goldZeroNextDiscount": 1
      }
    }
  },
  "sike_dati": {
    "id": "sike_dati",
    "name": "死磕大题",
    "type": "logic",
    "cost": 4,
    "q": "purple",
    "desc": "造成4.2倍智力伤害；自动消耗至多3层理性，每层+1费且倍率+1.0",
    "dmgStat": "intelligence",
    "dmgMult": 4.2,
    "sikeRatMax": 3,
    "sikeCostPer": 1,
    "sikeMultPer": 1,
    "frame": "xiaolei",
    "qv": {
      "gold": {
        "dmgMult": 4.8,
        "sikeMultPer": 1.3
      }
    }
  },
  "caogao_tuiyan": {
    "id": "caogao_tuiyan",
    "name": "草稿推演",
    "type": "logic",
    "cost": 2,
    "q": "blue",
    "desc": "获得1.5倍智力护盾并记录本牌当前消耗；下一张逻辑卡若消耗不同，获得1层理性",
    "shieldStat": "intelligence",
    "shieldMult": 1.5,
    "scratchRecord": 1,
    "frame": "xiaolei",
    "qv": {
      "purple": {
        "shieldMult": 1.8,
        "scratchRat": 2
      },
      "gold": {
        "shieldMult": 2.1,
        "scratchRat": 2,
        "scratchGoldShield": 0.8
      }
    }
  },
  "zaisuan_yizhong": {
    "id": "zaisuan_yizhong",
    "name": "再算一种方法",
    "type": "logic",
    "cost": 2,
    "q": "purple",
    "desc": "造成1.8倍智力伤害；本回合已用逻辑卡时，原始消耗视为最近一张的原始消耗，若因此满足【已变更】获得2层理性",
    "dmgStat": "intelligence",
    "dmgMult": 1.8,
    "zaisuanRat": 2,
    "frame": "xiaolei",
    "qv": {
      "gold": {
        "dmgMult": 2.2,
        "zaisuanBonus": 0.6
      }
    }
  },
  "daan_xieman": {
    "id": "daan_xieman",
    "name": "答案写满",
    "type": "logic",
    "cost": 3,
    "q": "purple",
    "desc": "造成3.2倍智力伤害；自动消耗等同智力的护盾使倍率+1.5；结算后仍有护盾获得1层理性",
    "dmgStat": "intelligence",
    "dmgMult": 3.2,
    "xiemanShieldMult": 1.5,
    "frame": "xiaolei",
    "qv": {
      "gold": {
        "dmgMult": 3.8,
        "xiemanRat": 2
      }
    }
  },
  "xinde_changshi": {
    "id": "xinde_changshi",
    "name": "新的尝试",
    "type": "idea",
    "cost": -1,
    "q": "purple",
    "desc": "消耗X（X=剩余体力，至少1）：摸2张牌，选其中1张消耗-X，另一张消耗-1",
    "dynamicCost": "energy",
    "dynCostMin1": true,
    "newTryPick": 1,
    "frame": "xiaolei"
  },
  "renzhen_duidai": {
    "id": "renzhen_duidai",
    "name": "认真对待",
    "type": "idea",
    "cost": 1,
    "q": "purple",
    "desc": "获得1层认真；若当前理性至少3层，再获得1层",
    "status": {
      "serious": 1
    },
    "rdExtraIfRat3": 1,
    "frame": "xiaolei"
  },
  "chongxin_sikao": {
    "id": "chongxin_sikao",
    "name": "重新思考",
    "type": "idea",
    "cost": 2,
    "q": "purple",
    "desc": "弃置所有手牌，摸3张牌",
    "discardAll": true,
    "drawCards": 3,
    "frame": "xiaolei",
    "qv": {
      "gold": {
        "cost": 1
      }
    }
  },
  "laoyi_jiehe": {
    "id": "laoyi_jiehe",
    "name": "劳逸结合",
    "type": "idea",
    "cost": 1,
    "q": "purple",
    "desc": "移除全部认真与理性，将体力回复至上限",
    "clearRationality": true,
    "restoreEnergy": true,
    "frame": "xiaolei",
    "qv": {
      "gold": {
        "laoyiMaxUp": 7
      }
    }
  },
  "xiannan_houyi": {
    "id": "xiannan_houyi",
    "name": "先难后易",
    "type": "idea",
    "cost": 1,
    "q": "blue",
    "desc": "选择1张逻辑卡使其+2费；下一张其他逻辑卡消耗-1",
    "xnhyPick": 1,
    "xnhyDiscount": 1,
    "frame": "xiaolei",
    "qv": {
      "purple": {
        "xnhyDiscount": 2
      },
      "gold": {
        "xnhyDiscount": 3,
        "xnhyGoldUp": 20
      }
    }
  },
  "juyi_fansan": {
    "id": "juyi_fansan",
    "name": "举一反三",
    "type": "idea",
    "cost": 2,
    "q": "purple",
    "desc": "选择本回合使用过的1张逻辑卡；从卡组随机抽1张不同名称的逻辑卡，使其消耗变为所选卡使用时的消耗",
    "juyiCopy": 1,
    "frame": "xiaolei",
    "qv": {
      "gold": {
        "juyiUp": 30
      }
    }
  },
  "lingguang_yixian": {
    "id": "lingguang_yixian",
    "name": "灵光一现",
    "type": "idea",
    "cost": 0,
    "q": "purple",
    "desc": "查看牌库顶3张，选1张加入手牌，其余置于牌库底；该牌+1费（移除）",
    "lingguang": 1,
    "exhaust": true,
    "frame": "xiaolei",
    "qv": {
      "gold": {
        "lingguangGold": 1
      }
    }
  },
  "tiaozheng_shunxu": {
    "id": "tiaozheng_shunxu",
    "name": "调整做题顺序",
    "type": "idea",
    "cost": 1,
    "q": "blue",
    "desc": "选择2张逻辑卡，交换它们的当前消耗；若两张都实际改变了费用，获得1层理性",
    "swapCost": 1,
    "swapRat": 1,
    "frame": "xiaolei",
    "qv": {
      "purple": {
        "swapRat": 2
      },
      "gold": {
        "swapRat": 3
      }
    }
  },
  "wo_suan_cuo": {
    "id": "wo_suan_cuo",
    "name": "我是不是算错了？",
    "type": "idea",
    "cost": 0,
    "q": "purple",
    "desc": "选择1张逻辑卡，将消耗恢复为原始消耗；若恢复前与原始消耗相差至少2，获得2层理性（移除）",
    "restoreCost": 1,
    "restoreRat": 2,
    "exhaust": true,
    "frame": "xiaolei",
    "qv": {
      "gold": {
        "restoreGold": 1
      }
    }
  },
  "lengjing_fenxi": {
    "id": "lengjing_fenxi",
    "name": "冷静分析",
    "type": "idea",
    "cost": 2,
    "q": "purple",
    "desc": "本回理性因伤害减少时，第一次不减少；每阻止1次，下一张逻辑卡+1费",
    "calmGuard": 1,
    "frame": "xiaolei",
    "qv": {
      "gold": {
        "calmGuard": 2
      }
    }
  },
  "yazhou_yibi": {
    "id": "yazhou_yibi",
    "name": "压轴一笔",
    "type": "answer",
    "cost": 3,
    "q": "purple",
    "desc": "造成8倍智力伤害（压轴：仅当手牌中除该牌外没有其他卡牌时才可以使用）",
    "dmgStat": "intelligence",
    "dmgMult": 8,
    "yazhou": true,
    "frame": "xiaolei",
    "qv": {
      "gold": {
        "dmgMult": 9
      },
      "red": {
        "dmgMult": 11
      }
    }
  },
  "biaozhun_daan": {
    "id": "biaozhun_daan",
    "name": "标准答案",
    "type": "answer",
    "cost": 3,
    "q": "blue",
    "desc": "造成本回合单张逻辑卡最高伤害70%的伤害；本回合使用至少3张逻辑卡后，本牌-1费",
    "biaozhun": 0.7,
    "biaozhunDiscount": 1,
    "frame": "xiaolei",
    "qv": {
      "purple": {
        "biaozhun": 0.85
      },
      "gold": {
        "biaozhun": 1
      },
      "red": {
        "biaozhun": 1.2
      }
    }
  },
  "zhedao_wuhui": {
    "id": "zhedao_wuhui",
    "name": "这道题，我会",
    "type": "answer",
    "cost": 3,
    "q": "purple",
    "desc": "消耗全部理性，造成3倍智力伤害；每消耗1层倍率+0.4（最多计算10层）",
    "dmgStat": "intelligence",
    "dmgMult": 3,
    "wuhuiPerRat": 0.4,
    "wuhuiMaxRat": 10,
    "frame": "xiaolei",
    "qv": {
      "gold": {
        "wuhuiPerRat": 0.5
      },
      "red": {
        "wuhuiPerRat": 0.6
      }
    }
  },
  "quanbu_yansuan": {
    "id": "quanbu_yansuan",
    "name": "全部验算正确",
    "type": "answer",
    "cost": 3,
    "q": "blue",
    "desc": "获得2层理性；本回合每出现1种不同的逻辑卡使用费用，再获得1层（最多2层）",
    "status": {
      "rationality": 2
    },
    "yansuanExtra": 2,
    "frame": "xiaolei",
    "qv": {
      "purple": {
        "status": {
          "rationality": 3
        }
      },
      "gold": {
        "status": {
          "rationality": 4
        },
        "yansuanExtra": 3
      }
    }
  },
  "aoshu_yazhou": {
    "id": "aoshu_yazhou",
    "name": "奥数压轴题",
    "type": "answer",
    "cost": 5,
    "q": "gold",
    "desc": "造成6倍智力伤害；本回合每使用过一种费用档位（0/1/2/3+费）本牌-1费；四档齐全先获得4层理性（移除）",
    "dmgStat": "intelligence",
    "dmgMult": 6,
    "aoshuDiscount": 1,
    "aoshuAllRat": 4,
    "exhaust": true,
    "frame": "xiaolei",
    "qv": {
      "red": {
        "dmgMult": 8,
        "aoshuRedRat": 0.3
      }
    }
  },
  "aoshu_zhiwang": {
    "id": "aoshu_zhiwang",
    "name": "奥数之王",
    "type": "idea",
    "cost": 0,
    "desc": "选择手牌中的1张逻辑卡，将其消耗变为0并提升至红色，持续至本场战斗结束（如初/保留/移除）",
    "handPickZeroRed": 1,
    "ruchu": true,
    "baoliu": true,
    "exhaust": true,
    "frame": "xiaolei"
  },
  "tianci": {
    "id": "tianci",
    "name": "填词",
    "type": "logic",
    "cost": 1,
    "desc": "造成1倍情商伤害。灵感：造成1倍情商伤害；若已有伤害效果，则情商伤害总倍率+1。",
    "dmgStat": "eq",
    "dmgMult": 1,
    "creativeInspiration": {
      "kind": "eqDamage",
      "mult": 1,
      "text": "造成1倍情商伤害"
    }
  },
  "zaoju": {
    "id": "zaoju",
    "name": "造句",
    "type": "logic",
    "cost": 1,
    "desc": "获得1倍情商护盾。灵感：获得1倍体魄护盾，消耗+1。",
    "shieldStat": "eq",
    "shieldMult": 1,
    "creativeInspiration": {
      "kind": "physiqueShield",
      "mult": 1,
      "costDelta": 1,
      "text": "获得1倍体魄护盾，消耗+1"
    }
  },
  "xiuci": {
    "id": "xiuci",
    "name": "修辞",
    "type": "idea",
    "cost": 1,
    "desc": "摸1张牌。灵感：摸1张牌，消耗+1。",
    "drawCards": 1,
    "creativeInspiration": {
      "kind": "draw",
      "amount": 1,
      "costDelta": 1,
      "text": "摸1张牌，消耗+1"
    }
  },
  "shangai": {
    "id": "shangai",
    "name": "删改",
    "type": "idea",
    "cost": 0,
    "desc": "去除创作卡最后加入的灵感。灵感：消耗-1。",
    "creativeRemoveLast": true,
    "creativeInspiration": {
      "kind": "cost",
      "costDelta": -1,
      "text": "消耗-1"
    }
  },
  "tingbi": {
    "id": "tingbi",
    "name": "停笔",
    "type": "idea",
    "cost": 0,
    "desc": "回复1点体力。灵感：回复1点体力。",
    "energyRestore": 1,
    "creativeInspiration": {
      "kind": "energy",
      "amount": 1,
      "text": "回复1点体力"
    }
  },
  "gousi": {
    "id": "gousi",
    "name": "构思",
    "type": "idea",
    "cost": 1,
    "q": "blue",
    "desc": "获得1层感性",
    "status": {
      "sensibility": 1
    },
    "qv": {
      "purple": {
        "cost": 0
      }
    }
  },
  "lunju": {
    "id": "lunju",
    "name": "论据",
    "type": "idea",
    "cost": 2,
    "desc": "本场战斗中每使用2张思路卡，获得1层感性（可叠加）"
  },
  "manfen_zuowen": {
    "id": "manfen_zuowen",
    "name": "满分作文",
    "type": "answer",
    "cost": 3,
    "q": "purple",
    "desc": "从原始卡组选择1张思路卡，获得2张复制且本回合消耗为0。灵感：创作卡打出后从左到右复制所有手牌，回合结束时弃置所有手牌。",
    "copyStarterIdea": 2,
    "creativeInspiration": {
      "kind": "fullEssay",
      "text": "从左到右复制所有手牌，回合结束时弃置所有手牌"
    },
    "exhaust": true,
    "qv": {
      "gold": {
        "exhaust": null
      }
    }
  },
  "fangxie": {
    "id": "fangxie",
    "name": "仿写",
    "type": "logic",
    "cost": 1,
    "desc": "造成0.8倍情商伤害，本回合用过思路卡改为1.4倍。灵感：造成0.7倍情商伤害。",
    "dmgStat": "eq",
    "dmgMult": 0.8,
    "multAfterIdea": 1.4,
    "creativeInspiration": {"kind":"eqDamage","mult":0.7,"text":"造成0.7倍情商伤害"}
  },
  "kuoxie": {
    "id": "kuoxie",
    "name": "扩写",
    "type": "logic",
    "cost": 2,
    "desc": "造成1.5倍情商伤害，每层感性额外+0.4倍。灵感：每层感性造成0.3倍情商伤害。",
    "dmgStat": "eq",
    "dmgMult": 1.5,
    "sensMult": 0.4,
    "creativeInspiration": {"kind":"sensDamage","perSens":0.3,"text":"每层感性造成0.3倍情商伤害"}
  },
  "xuxie": {
    "id": "xuxie",
    "name": "续写",
    "type": "logic",
    "cost": 1,
    "desc": "获得1倍情商护盾，≥2层感性额外+1倍。灵感：获得0.8倍情商护盾。",
    "shieldStat": "eq",
    "shieldMult": 1,
    "shieldExtraIfSens2": 1,
    "creativeInspiration": {"kind":"eqShield","mult":0.8,"text":"获得0.8倍情商护盾"}
  },
  "yinyong": {
    "id": "yinyong",
    "name": "引用",
    "type": "logic",
    "cost": 1,
    "desc": "造成0.5倍情商伤害，获得1层灵感",
    "dmgStat": "eq",
    "dmgMult": 0.5,
    "status": {
      "inspiration": 1
    }
  },
  "paibi": {
    "id": "paibi",
    "name": "排比句",
    "type": "logic",
    "cost": 2,
    "desc": "造成0.8倍情商伤害，重复3次。灵感：造成0.35倍情商伤害，重复3次。",
    "dmgStat": "eq",
    "dmgMult": 0.8,
    "hits": 3,
    "creativeInspiration": {"kind":"eqDamage","mult":0.35,"hits":3,"text":"造成0.35倍情商伤害，重复3次"}
  },
  "guancha": {
    "id": "guancha",
    "name": "观察",
    "type": "idea",
    "cost": 0,
    "desc": "获得1层细心（每层下张逻辑卡伤害+10%）。灵感：获得2层细心。",
    "status": {
      "careful": 1
    },
    "creativeInspiration": {"kind":"status","status":"careful","amount":2,"text":"获得2层细心"}
  },
  "zhaichao": {
    "id": "zhaichao",
    "name": "摘抄",
    "type": "idea",
    "cost": 1,
    "desc": "获得1层感性，弃牌堆有逻辑卡则额外+1。灵感：获得1层感性并摸1张牌。",
    "status": {
      "sensibility": 1
    },
    "sensIfDiscardLogic": 1,
    "creativeInspiration": {"kind":"statusDraw","status":"sensibility","amount":1,"draw":1,"text":"获得1层感性并摸1张牌"}
  },
  "sucai_jilei": {
    "id": "sucai_jilei",
    "name": "素材积累",
    "type": "idea",
    "cost": 2,
    "desc": "本回合下一次伤害不消耗感性，情商>15获得2层感性。灵感：下一次伤害不消耗感性。",
    "noSensConsume": true,
    "sensIfEq15": 2,
    "creativeInspiration": {"kind":"preserveSens","text":"下一次伤害不消耗感性"}
  },
  "caogao": {
    "id": "caogao",
    "name": "草稿",
    "type": "idea",
    "cost": 2,
    "desc": "获得1层感性，弃牌堆选3张逻辑卡洗入牌库并摸1张逻辑卡。灵感：从弃牌堆回收至多2张逻辑卡洗入牌组，再摸1张逻辑卡。",
    "status": {
      "sensibility": 1
    },
    "discardPick3Logic": true,
    "creativeInspiration": {"kind":"recycleLogic","amount":2,"drawLogic":1,"text":"回收至多2张逻辑卡洗入牌组，再摸1张逻辑卡"}
  },
  "jingxiu": {
    "id": "jingxiu",
    "name": "精修",
    "type": "idea",
    "cost": 2,
    "desc": "获得3层感性，本场战斗最大体力-1",
    "status": {
      "sensibility": 3
    },
    "battleMaxEnergyDown": 1
  },
  "wensi_quanyong": {
    "id": "wensi_quanyong",
    "name": "文思泉涌",
    "type": "idea",
    "cost": 1,
    "desc": "本回合每使用一张思路卡，获得1层感性（不可叠加）。灵感：本回合每已使用1张思路卡，获得1层感性（最多3层）。",
    "wensiActive": true,
    "creativeInspiration": {"kind":"ideaCountSens","cap":3,"text":"按本回合已使用思路卡数获得感性（最多3层）"}
  },
  "fanfu_tuikao": {
    "id": "fanfu_tuikao",
    "name": "反复推敲",
    "type": "idea",
    "cost": 2,
    "desc": "弃置所有手牌摸1张，弃牌含逻辑卡再摸2张。灵感：弃置手牌最右侧1张，然后摸2张牌。",
    "discardAllDrawLogicBonus": 1,
    "creativeInspiration": {"kind":"rerollRight","draw":2,"text":"弃置手牌最右侧1张，然后摸2张牌"}
  },
  "shuqing_sanwen": {
    "id": "shuqing_sanwen",
    "name": "抒情散文",
    "type": "answer",
    "cost": 3,
    "desc": "造成2.5倍情商伤害，每层感性额外+0.5倍。灵感：造成1倍情商伤害，且每层感性额外+0.2倍。",
    "dmgStat": "eq",
    "dmgMult": 2.5,
    "sensMult": 0.5,
    "creativeInspiration": {"kind":"sensDamage","base":1,"perSens":0.2,"text":"造成1倍情商伤害，每层感性额外+0.2倍"}
  },
  "kaochang_jiazuo": {
    "id": "kaochang_jiazuo",
    "name": "考场佳作",
    "type": "answer",
    "cost": 2,
    "desc": "本回合情商翻倍，回合结束失去所有感性。灵感：本回合情商+50%。",
    "eqDoubleThisTurn": true,
    "endTurnClearSens": true,
    "creativeInspiration": {"kind":"eqBoost","mult":0.5,"text":"本回合情商+50%"}
  },
  "duhougan": {
    "id": "duhougan",
    "name": "读后感",
    "type": "answer",
    "cost": 1,
    "q": "purple",
    "desc": "复制你最左边的一张卡牌（金：额外复制一张）。灵感：复制手牌最左侧1张牌。",
    "copyLeftmost": 1,
    "creativeInspiration": {"kind":"copyLeft","amount":1,"text":"复制手牌最左侧1张牌"},
    "qv": {
      "gold": {
        "copyLeftmost": 2
      }
    }
  },
  "qianniuxing": {
    "id": "qianniuxing",
    "name": "迢迢牵牛星",
    "type": "answer",
    "cost": 3,
    "desc": "造成1点伤害；你卡组中数量最多的同名牌，每有一张，伤害+1倍情商",
    "deckMostCopiesBonus": 1
  },
  "dizigui": {
    "id": "dizigui",
    "name": "弟子规",
    "type": "idea",
    "cost": 2,
    "desc": "持续到战斗结束：你每回合打出的第一张思路卡拥有回响。回响：非临时卡打出后的下一回合，在手中生成一张0费同名临时卡（手牌满时生成在卡组）",
    "echoAura": true,
    "ruchu": true,
    "baoliu": true,
    "exhaust": true
  },
  "dragon_novel": {
    "id": "dragon_novel",
    "name": "罗生门",
    "type": "novel",
    "novel": "longzu",
    "cost": 2,
    "exhaust": true,
    "desc": "📖 Reading：攻击牌伤害×2~×3随机（持续2回合），开启时最大生命减半；2回合结束后自身回到使用前状态，期间一切影响（含受伤、生命减半）不算数（移除）。配文：人心的修罗场，真相与刀光同在。"
  },
  "ring_novel": {
    "id": "ring_novel",
    "name": "朝花夕拾",
    "type": "novel",
    "novel": "mojie",
    "cost": 2,
    "exhaust": true,
    "desc": "📖 Reading：护盾获得×2~×3随机（持续2回合）；使用消耗10生命（不低于1）；2回合结束后自身回到使用前状态（移除）。配文：旧时的花瓣落回掌心，护住此刻的你。"
  },
  "galaxy_novel": {
    "id": "galaxy_novel",
    "name": "巴黎圣母院",
    "type": "novel",
    "novel": "yinhe",
    "cost": 2,
    "exhaust": true,
    "desc": "📖 Reading：感性获得与摸牌数量×2（持续2回合，不含攻击/护盾）；此2回合攻击伤害减半；2回合结束后自身回到使用前状态（移除）。配文：玫瑰花窗之下，先攒下满襟星光。"
  },
  "yiquan": {
    "id": "yiquan",
    "name": "一拳",
    "type": "logic",
    "cost": 1,
    "q": "green",
    "lifeCostPct": 10,
    "lifeCostOf": "current",
    "desc": "消耗10%当前生命值和1点体力，造成0.5倍全属性伤害，并获得等同于本次伤害50%的耐力",
    "dmgStat": "all",
    "dmgMult": 0.5,
    "enduranceFromDamage": 0.5,
    "qv": {"blue":{"dmgMult":0.6,"desc":"消耗10%当前生命值和1点体力，造成0.6倍全属性伤害，并获得等同于本次伤害50%的耐力"},"purple":{"dmgMult":0.7,"desc":"消耗10%当前生命值和1点体力，造成0.7倍全属性伤害，并获得等同于本次伤害50%的耐力"},"gold":{"dmgMult":0.8,"desc":"消耗10%当前生命值和1点体力，造成0.8倍全属性伤害，并获得等同于本次伤害50%的耐力"},"red":{"dmgMult":1,"desc":"消耗10%当前生命值和1点体力，造成1倍全属性伤害，并获得等同于本次伤害50%的耐力"}}
  },
  "hulian": {
    "id": "hulian",
    "name": "护脸",
    "type": "logic",
    "q": "green",
    "cost": 0,
    "lifeCostPct": 10,
    "desc": "消耗10%当前生命值，获得等同于本次消耗生命值的2倍护盾",
    "shieldFromLifeCost": 2,
    "qv": {"blue":{"shieldFromLifeCost":2.2,"desc":"消耗10%当前生命值，获得2.2倍本次消耗生命值的护盾"},"purple":{"shieldFromLifeCost":2.4,"desc":"消耗10%当前生命值，获得2.4倍本次消耗生命值的护盾"},"gold":{"shieldFromLifeCost":2.6,"desc":"消耗10%当前生命值，获得2.6倍本次消耗生命值的护盾"},"red":{"shieldFromLifeCost":3,"desc":"消耗10%当前生命值，获得3倍本次消耗生命值的护盾"}}
  },
  "feiti": {
    "id": "feiti",
    "name": "飞踢",
    "type": "logic",
    "q": "green",
    "cost": 2,
    "desc": "造成1倍耐力伤害，伤害至少为1",
    "enduranceDmg": {
      "mult": 1,
      "min": 1
    },
    "qv": {"blue":{"enduranceDmg":{"mult":1.3},"desc":"造成1.3倍耐力伤害，伤害至少为1"},"purple":{"enduranceDmg":{"mult":1.6},"desc":"造成1.6倍耐力伤害，伤害至少为1"},"gold":{"enduranceDmg":{"mult":1.9},"desc":"造成1.9倍耐力伤害，伤害至少为1"},"red":{"enduranceDmg":{"mult":2.4},"desc":"造成2.4倍耐力伤害，伤害至少为1"}}
  },
  "rennai": {
    "id": "rennai",
    "name": "忍耐",
    "type": "idea",
    "q": "green",
    "cost": 3,
    "desc": "接下来持续至本场战斗结束，失去的所有生命值中的60%转化为耐力。不可叠加。如初，保留，移除",
    "ruchu": true,
    "baoliu": true,
    "enduranceConvert": 0.6,
    "exhaust": true
  },
  "yinren": {
    "id": "yinren",
    "name": "隐忍",
    "type": "idea",
    "q": "green",
    "cost": 1,
    "desc": "获得等同于当前耐力35%的临时生命上限",
    "tempMaxHpFromEndurance": 0.35,
    "qv": {"blue":{"tempMaxHpFromEndurance":0.38,"desc":"获得等同于当前耐力38%的临时生命上限"},"purple":{"tempMaxHpFromEndurance":0.41,"desc":"获得等同于当前耐力41%的临时生命上限"},"gold":{"tempMaxHpFromEndurance":0.44,"desc":"获得等同于当前耐力44%的临时生命上限"},"red":{"tempMaxHpFromEndurance":0.5,"desc":"获得等同于当前耐力50%的临时生命上限"}}
  },
  "xuyi_hongquan": {
    "id": "xuyi_hongquan",
    "name": "蓄意轰拳",
    "type": "answer",
    "q": "purple",
    "cost": 5,
    "desc": "获得等同于当前耐力的护盾，造成1.5倍耐力真实伤害，清空耐力，回复15%已损失生命",
    "shieldFromEndurance": 1,
    "enduranceTrueDmg": 1.5,
    "clearEndurance": true,
    "healLostPct": 15,
    "qv": {"gold":{"enduranceTrueDmg":2,"healLostPct":20,"desc":"获得等同于当前耐力的护盾，造成2倍耐力真实伤害，清空耐力，回复20%已损失生命"},"red":{"enduranceTrueDmg":2.5,"healLostPct":25,"desc":"获得等同于当前耐力的护盾，造成2.5倍耐力真实伤害，清空耐力，回复25%已损失生命"}}
  },
  "wanfu_mo_di": {
    "id": "wanfu_mo_di",
    "name": "万夫莫敌",
    "type": "answer",
    "q": "purple",
    "cost": 0,
    "lifeCostPct": 40,
    "lifeCostOf": "current",
    "desc": "消耗40%当前生命值，获得等同于已损失生命值的护盾；获得10%减伤，持续2回合；期间所有伤害+80%",
    "shieldFromLostLife": 1,
    "dmgReduce2": {
      "pct": 10,
      "turns": 2
    },
    "trueDmgBonus2": {
      "pct": 80,
      "turns": 2
    }
  },
  "fuzhong_xunlian": {
    "id": "fuzhong_xunlian",
    "name": "咬牙坚持",
    "type": "idea",
    "q": "green",
    "cost": 1,
    "lifeCostPct": 10,
    "lifeCostOf": "current",
    "enduranceFromLifeCost": 1,
    "lowHpEnduranceBonusPct": 50,
    "desc": "消耗10%当前生命值，获得等同于本次消耗生命值的耐力。若结算后生命值低于最大生命值50%，额外获得本次消耗生命值50%的耐力。"
  },
  "chengliang_wristband": {
    "id": "chengliang_wristband",
    "name": "计步器",
    "type": "tool",
    "q": "green",
    "cost": 1,
    "toolEffect": "chengliang_pedometer",
    "desc": "本场战斗中，每次损失至少10%最大生命值时，摸1张牌并回复1点体力。"
  },
  "xia_bi":{"id":"xia_bi","name":"下笔","type":"logic","cost":1,"q":"green","dmgStat":"intelligence","cardStatType":"intelligence","dmgMult":1.2,"randomCardChance":.7,"randomCardType":"eq","desc":"造成1.2倍智力伤害。70%概率获得1张随机情商牌。","qv":{"blue":{"dmgMult":1.3},"purple":{"dmgMult":1.4},"gold":{"dmgMult":1.5},"red":{"dmgMult":1.7}}},
  "hui_shou":{"id":"hui_shou","name":"挥手","type":"logic","cost":1,"q":"green","dmgStat":"eq","cardStatType":"eq","dmgMult":1.2,"randomCardChance":.7,"randomCardType":"intelligence","desc":"造成1.2倍情商伤害。70%概率获得1张随机智力牌。","qv":{"blue":{"dmgMult":1.3},"purple":{"dmgMult":1.4},"gold":{"dmgMult":1.5},"red":{"dmgMult":1.7}}},
  "fu_yanjing":{"id":"fu_yanjing","name":"扶眼镜","type":"idea","cost":1,"q":"green","status":{"accuracy":1},"accuracyRollChance":.5,"accuracyBonus":1,"desc":"获得1层【精准】。随后判定，50%概率额外获得1层【精准】。","qv":{"blue":{"status":{"accuracy":2}},"purple":{"status":{"accuracy":3}},"gold":{"status":{"accuracy":4},"accuracyBonus":3},"red":{"status":{"accuracy":5},"accuracyBonus":5}}},
  "lixing_sikao":{"id":"lixing_sikao","name":"理性思考","type":"idea","cost":1,"q":"green","reasoningChoice":true,"desc":"抉择：获得1张情商牌或1张智力牌，并使其消耗-1。随后50%概率两个效果全部获得。","qv":{"blue":{"cost":1,"reasoningCount":2},"purple":{"cost":1,"reasoningCount":2},"gold":{"cost":0,"reasoningCount":2},"red":{"cost":0,"reasoningCount":3}}},
  "dongxi":{"id":"dongxi","name":"洞悉","type":"answer","cost":3,"q":"purple","generateCard":"jiegou","breakDefense":1,"accuracyRollChance":.5,"accuracyRolls":2,"accuracyBonus":5,"desc":"获得1张【解构】，给予目标1层【破防】。50%概率获得5层【精准】，该判定进行2次取最优结果。","qv":{"gold":{"cost":2,"breakDefense":4,"accuracyBonus":10}}},
  "jiegou":{"id":"jiegou","name":"解构","type":"answer","cost":1,"q":"purple","dmgStat":"intEq","dmgMult":1,"accuracyLayersMult":2,"exhaust":true,"desc":"造成1倍智力+1倍情商伤害。计算伤害时，【精准】层数视为2倍。【移除】"},
  "xiaci":{"id":"xiaci","name":"下次见","type":"answer","cost":3,"q":"purple","extraTurn":1,"extraTurnDraw":2,"extraTurnCostReduction":2,"extraTurnChance":.2,"desc":"本回合结束后额外进行1个回合，额外摸2张牌，所有手牌消耗-2。额外回合结束时20%概率再次获得1个额外回合。"},
  "bijiben":{"id":"bijiben","name":"笔记本","type":"tool","cost":1,"q":"green","toolEffect":"menghuaian_notebook","desc":"打出智力牌时获得3点护盾；打出情商牌时回复3点生命。"},
  "mieshi": {
    "id": "mieshi",
    "name": "蔑视",
    "type": "logic",
    "cost": 1,
    "desc": "造成1倍智力伤害，添加1层无视",
    "dmgStat": "intelligence",
    "dmgMult": 1,
    "status": {
      "wushi": 1
    }
  },
  "zifu": {
    "id": "zifu",
    "name": "自负",
    "type": "logic",
    "cost": 1,
    "desc": "获得1倍智力护盾，添加1层傲慢",
    "shieldStat": "intelligence",
    "shieldMult": 1,
    "status": {
      "arrogance": 1
    }
  },
  "siwei": {
    "id": "siwei",
    "name": "思维",
    "type": "idea",
    "cost": 1,
    "desc": "抉择：+1层无视 或 +2层傲慢（本回合第一张卡则都发动）",
    "choice": [
      {
        "text": "获得1层无视",
        "status": {
          "wushi": 1
        }
      },
      {
        "text": "获得2层傲慢",
        "status": {
          "arrogance": 2
        }
      }
    ],
    "choiceBothIfFirst": true
  },
  "aoqi": {
    "id": "aoqi",
    "name": "傲气",
    "type": "idea",
    "cost": 3,
    "desc": "获得傲慢层数×智力的护盾",
    "shieldFromArrogance": 1
  },
  "zixin_manman": {
    "id": "zixin_manman",
    "name": "自信满满",
    "type": "idea",
    "cost": 2,
    "desc": "牌库选1张置顶，+1层傲慢，傲慢>无视则摸1张",
    "deckTopPick": 1,
    "status": {
      "arrogance": 1
    },
    "drawIfArroganceGtWushi": 1
  },
  "zhiyuxue": {
    "id": "zhiyuxue",
    "name": "致于学",
    "type": "answer",
    "cost": 4,
    "desc": "本回合所有手牌消耗降低至0（移除）",
    "allHandFree": true,
    "exhaust": true
  },
  "long_aotian": {
    "id": "long_aotian",
    "name": "龙傲天",
    "type": "idea",
    "cost": 2,
    "desc": "为自身添加等同于傲慢层数的无视",
    "wushiFromArrogance": 1
  },
  "bishi": {
    "id": "bishi",
    "name": "鄙视",
    "type": "logic",
    "cost": 2,
    "desc": "造成1.8倍智力伤害，添加2层无视",
    "dmgStat": "intelligence",
    "dmgMult": 1.8,
    "status": {
      "wushi": 2
    }
  },
  "suishi_yizhuang": {
    "id": "suishi_yizhuang",
    "name": "随时一装",
    "type": "logic",
    "cost": 2,
    "desc": "造成3次0.4倍智力伤害，每层无视使倍率+0.2",
    "dmgStat": "intelligence",
    "dmgMult": 0.4,
    "hits": 3,
    "wushiMultPerStack": 0.2
  },
  "zixin_yixiao": {
    "id": "zixin_yixiao",
    "name": "自信一笑",
    "type": "logic",
    "cost": 2,
    "desc": "造成2倍智力伤害，目标生命<75%后+2层无视",
    "dmgStat": "intelligence",
    "dmgMult": 2,
    "wushiIfHpBelow75": 2
  },
  "shushi_wudu": {
    "id": "shushi_wudu",
    "name": "熟视无睹",
    "type": "logic",
    "cost": 2,
    "desc": "傲慢层数翻倍，并获得翻倍后傲慢×6的护盾",
    "doubleArrogance": true,
    "shieldArroganceMult": 6
  },
  "suixing_yanyu": {
    "id": "suixing_yanyu",
    "name": "随性言语",
    "type": "logic",
    "cost": 2,
    "desc": "造成1次0.5倍智力伤害，每层傲慢多1次，之后傲慢-4",
    "dmgStat": "intelligence",
    "dmgMult": 0.5,
    "hitsByArrogance": {
      "base": 1,
      "dmgMult": 0.5
    },
    "arroganceDown4": true
  },
  "zaishi_yici": {
    "id": "zaishi_yici",
    "name": "再试一次！",
    "type": "idea",
    "cost": -1,
    "desc": "消耗全部体力+全部傲慢：选≤X张手牌洗回再摸等量（循环≤X次），本回合X张免费，恢复消耗傲慢的一半",
    "dynamicCost": "energy",
    "allArroganceCost": true,
    "redrawLoop": true
  },
  "shoulian_yixia": {
    "id": "shoulian_yixia",
    "name": "收敛一下",
    "type": "idea",
    "cost": 2,
    "desc": "消除全部傲慢，每层智力临时+1持续1回合，1回合后恢复1/4傲慢",
    "arroganceToTempInt": {
      "turns": 1,
      "restore": 0.25
    }
  },
  "guannizhena": {
    "id": "guannizhena",
    "name": "管你这那的！",
    "type": "idea",
    "cost": 0,
    "desc": "消耗全部体力（至少1），无视消耗打出所有逻辑卡并弃所有思路卡，每弃1张+2傲慢",
    "costAllEnergyMin1": true,
    "playAllLogicFree": true
  },
  "muzhong_wuren": {
    "id": "muzhong_wuren",
    "name": "目中无人",
    "type": "idea",
    "cost": 2,
    "desc": "获得6层临时傲慢+3层无视，本回合无法使用卡牌，回合结束清除临时傲慢",
    "tempArrogance6": true,
    "lockPlayTurn": true
  },
  "jinzai_zhangwo": {
    "id": "jinzai_zhangwo",
    "name": "尽在掌握",
    "type": "answer",
    "cost": 3,
    "desc": "造成3次伤害，每段=当前傲慢×0.7×智力，每段后傲慢减半",
    "conceit3Hits": 0.7
  },
  "yuxi": {
    "id": "yuxi",
    "name": "预习",
    "type": "idea",
    "cost": 1,
    "desc": "下一次伤害+10。【移除】",
    "buffDmg": 10,
    "exhaust": true
  },
  "tongxiao": {
    "id": "tongxiao",
    "name": "通宵",
    "type": "idea",
    "cost": 2,
    "desc": "获得2层精神",
    "status": {
      "spirit": 2
    }
  },
  "fan_lajitong": {
    "id": "fan_lajitong",
    "name": "翻垃圾桶",
    "type": "idea",
    "cost": 1,
    "desc": "从弃牌堆选一张逻辑卡回手",
    "pickDiscardLogic": 1
  },
  "chi_binggun": {
    "id": "chi_binggun",
    "name": "吃冰棍",
    "type": "idea",
    "cost": 2,
    "desc": "本场战斗伤害+1，体力上限-1",
    "battleDmgPlus1": true,
    "battleMaxEnergyDown": 1
  },
  "banshou": {
    "id": "banshou",
    "name": "扳手",
    "type": "tool",
    "cost": 2,
    "q": "green",
    "emoji": "🔧",
    "toolEffect": "wrench",
    "desc": "每打出三张逻辑卡，使你的手牌中的逻辑卡复原（复原：移除沉默、费用更改、封印等效果）。配文：所以这玩意为什么会在学习用具里。"
  },
  "shenqi_zhi_xue": {
    "id": "shenqi_zhi_xue",
    "name": "有点神奇之靴",
    "type": "tool",
    "cost": 2,
    "q": "green",
    "emoji": "👟",
    "toolEffect": "boots",
    "desc": "体力回复+1。配文：妈妈再也不用担心我上学迟到了"
  },
  "putong_qianbi": {
    "id": "putong_qianbi",
    "name": "普通的铅笔",
    "type": "tool",
    "cost": 2,
    "q": "green",
    "emoji": "✏️",
    "toolEffect": "pencil",
    "desc": "回合开始得到一张临时逻辑卡。配文：同学借走了，就不一定会还了"
  },
  "gangbi": {
    "id": "gangbi",
    "name": "钢笔",
    "type": "tool",
    "cost": 2,
    "q": "green",
    "emoji": "🖋️",
    "toolEffect": "fountain_pen",
    "desc": "打出思路卡后，获得1层感性。"
  },
  "tuya": {
    "id": "tuya",
    "name": "涂鸦",
    "type": "logic",
    "cost": 1,
    "desc": "造成0.8倍智力伤害（临时）",
    "dmgStat": "intelligence",
    "dmgMult": 0.8,
    "exhaust": true
  },
  "benpao": {
    "id": "benpao",
    "name": "奔跑",
    "type": "logic",
    "cost": 2,
    "q": "green",
    "desc": "造成体魄伤害，并回复1点体力。",
    "qv": {"green":{"dmgMult":0.7},"blue":{"dmgMult":0.8},"purple":{"dmgMult":0.9},"gold":{"dmgMult":1},"red":{"dmgMult":1.2}},
    "dmgStat": "physique",
    "dmgMult": 0.7,
    "energyRestore": 1,
    "tuoshou": true
  },
  "zhupao": {
    "id": "zhupao",
    "name": "助跑",
    "type": "logic",
    "cost": 1,
    "q": "green",
    "desc": "选择弃置1张手牌。回复体力，并获得体魄护盾。",
    "discardHandPick": 1,
    "qv": {"green":{"energyRestore":1,"shieldMult":0.6},"blue":{"energyRestore":1,"shieldMult":0.8},"purple":{"energyRestore":1,"shieldMult":1},"gold":{"energyRestore":1,"shieldMult":2},"red":{"energyRestore":2,"shieldMult":3}},
    "energyRestore": 1,
    "shieldStat": "physique",
    "shieldMult": 0.6
  },
  "tiaoyuan": {
    "id": "tiaoyuan",
    "name": "跳远",
    "type": "logic",
    "cost": 1,
    "q": "green",
    "desc": "造成体魄伤害。若当前体力不足指定数值，消耗改为2。",
    "qv": {"green":{"dmgMult":1,"energyLowCost":{"le":5,"cost":2}},"blue":{"dmgMult":1.2,"energyLowCost":{"le":5,"cost":2}},"purple":{"dmgMult":1.5,"energyLowCost":{"le":4,"cost":2}},"gold":{"dmgMult":1.8,"energyLowCost":{"le":3,"cost":2}},"red":{"dmgMult":2,"energyLowCost":null}},
    "dmgStat": "physique",
    "dmgMult": 1,
    "energyLowCost": {
      "le": 5,
      "cost": 2
    }
  },
  "reqing": {
    "id": "reqing",
    "name": "热情",
    "type": "idea",
    "cost": 3,
    "q": "green",
    "desc": "本场战斗中，每消耗1点体力，回复生命。该效果可以叠加。",
    "qv": {"green":{"cost":3,"energySpendHeal":1},"blue":{"cost":3,"energySpendHeal":1.5},"purple":{"cost":3,"energySpendHeal":2},"gold":{"cost":2,"energySpendHeal":2},"red":{"cost":2,"energySpendHeal":3}},
    "energySpendHeal": 1
  },
  "junjie_moshi": {
    "id": "junjie_moshi",
    "name": "君姐模式",
    "type": "answer",
    "cost": -1,
    "q": "purple",
    "dynamicCost": "energy",
    "desc": "造成X倍体魄伤害。若支付体力不少于5点，则回复体力，并使本场战斗体力上限与回复效果提升。【移除】",
    "energyCostDmgPhysique": 1,
    "energyCostBonus6": true,
    "qv": {"purple":{"dmgMult":1,"energyCostThreshold":5,"energyBonus":3,"maxEnergyBonus":1},"gold":{"dmgMult":1.2,"energyCostThreshold":5,"energyBonus":3,"maxEnergyBonus":1},"red":{"dmgMult":1.5,"energyCostThreshold":5,"energyBonus":4,"maxEnergyBonus":2}},
    "exhaust": true
  },
  "yongwuzhijing": {
    "id": "yongwuzhijing",
    "name": "永无止境",
    "type": "answer",
    "cost": 0,
    "q": "red",
    "desc": "本场战斗中，你的所有卡牌费用+2；打出后回复2点体力。【保留】【移除】",
    "globalCostPlus2": 2,
    "energyRestore": 2,
    "baoliu": true,
    "exhaust": true
  },
  "tanzijun_tool": {
    "id":"tanzijun_tool", "name":"兔子手链", "type":"tool", "cost":0, "q":"purple", "emoji":"🐰",
    "toolEffect":"tanzijun_bracelet", "desc":"每回复1点体力，获得0.3倍体魄的护盾。"
  },
  "jielibang": {
    "id": "jielibang",
    "name": "接力棒",
    "type": "logic",
    "cost": 1,
    "desc": "造成体魄伤害。下回合开始时，重新获得此牌。该牌拥有【脱手】。",
    "qv": {"green":{"dmgMult":0.4},"blue":{"dmgMult":0.5},"purple":{"dmgMult":0.6},"gold":{"dmgMult":0.8},"red":{"dmgMult":1}},
    "dmgStat": "physique",
    "dmgMult": 0.4,
    "tuoshou": true,
    "returnFromDiscardNextTurn": true
  },
  "qianqiu": {
    "id": "qianqiu",
    "name": "铅球",
    "type": "logic",
    "cost": 3,
    "desc": "回复X点体力，并造成体魄伤害。X等于支付费用后的当前体力。",
    "qv": {"green":{"dmgMult":1.5,"energyRestoreCurCap":2},"blue":{"dmgMult":1.8,"energyRestoreCurCap":2},"purple":{"dmgMult":2,"energyRestoreCurCap":3},"gold":{"dmgMult":2.5,"energyRestoreCurCap":3},"red":{"dmgMult":3,"energyRestoreCurCap":4}},
    "energyRestoreCurCap": 2,
    "dmgStat": "physique",
    "dmgMult": 2
  },
  "qiangpao": {
    "id": "qiangpao",
    "name": "抢跑",
    "type": "logic",
    "cost": 0,
    "desc": "选择弃置1张手牌，造成体魄伤害。",
    "dmgStat": "physique",
    "dmgMult": 0.5,
    "discardHandPick": 1,
    "qv": {"green":{"dmgMult":0.5},"blue":{"dmgMult":0.65},"purple":{"dmgMult":0.8},"gold":{"dmgMult":1},"red":{"dmgMult":1.2}}
  },
  "baimi_chongci": {
    "id": "baimi_chongci",
    "name": "百米冲刺",
    "type": "answer",
    "cost": 3,
    "q": "purple",
    "desc": "将体力回复至上限。每实际回复1点体力，对敌方造成体魄伤害。",
    "qv": {"purple":{"energyToMaxDmgPhysique":1},"gold":{"energyToMaxDmgPhysique":1.2},"red":{"cost":2,"energyToMaxDmgPhysique":1.5}},
    "energyToMaxDmgPhysique": 1,
    "exhaust": true,
    "tuoshou": true
  },
  "lcj_bazhang":{"id":"lcj_bazhang","name":"巴掌","type":"logic","cost":1,"q":"green","emoji":"🖐️","dmgStat":"physique","dmgMult":.5,"shieldStat":"physique","shieldMult":.3,"desc":"造成0.5倍体魄伤害，获得0.3倍体魄护盾。"},
  "lianhuan_bazhang":{"id":"lianhuan_bazhang","name":"连环巴掌","type":"logic","cost":2,"q":"green","emoji":"👏","dmgStat":"physique","dmgMult":.8,"generateSameQualitySlap":true,"desc":"造成0.8倍体魄伤害，在手中生成1张与本牌品质相同的临时【巴掌】。"},
  "tiansheng_wocai":{"id":"tiansheng_wocai","name":"天生我才","type":"idea","cost":0,"q":"green","emoji":"🌟","selfMaxHpDamagePct":.1,"status":{"sensibility":1,"rationality":1},"healFixed":2,"temporaryUpgradePick":true,"tuoshou":true,"desc":"对自己造成最大生命值10%的伤害；获得1层【感性】、1层【理性】并回复2生命；选择1张其他手牌，本回合临时提升1级品质。【脱手】"},
  "kuangre_yuedu":{"id":"kuangre_yuedu","name":"狂热阅读","type":"idea","cost":2,"q":"green","emoji":"📚","readingProgress":10,"readingBonusPurple":5,"shieldStat":"physique","shieldMult":.8,"exhaust":true,"desc":"当前阅读书籍追加10进度，获得0.8倍体魄护盾；本牌为紫色或更高时额外追加5进度。【移除】"},
  "juyi_fansan_lcj":{"id":"juyi_fansan_lcj","name":"举一反三","type":"idea","cost":1,"q":"green","emoji":"🔁","shieldStat":"physique","shieldMult":.6,"temporaryUpgradeIfShield10":true,"desc":"获得0.6倍体魄护盾。结算后护盾不少于10时，选择1张其他手牌，本回合临时提升1级品质。"},
  "zhizhuo_lcj":{"id":"zhizhuo_lcj","name":"执着","type":"answer","cost":1,"q":"purple","emoji":"🔥","dmgStat":"intEq","dmgMult":1.2,"hitsByQualityUpgrades":true,"tuoshou":true,"exhaust":true,"desc":"造成1.2倍（智力+情商）伤害。本回合每有1张牌曾提升品质，追加一段0.4倍（智力+情商）伤害，最多4段。【脱手】【移除】"},
  "manji_gonglue":{"id":"manji_gonglue","name":"满级攻略","type":"answer","cost":2,"q":"purple","emoji":"🏆","upgradeToGoldPick":true,"baoliu":true,"exhaust":true,"desc":"选择除本牌外1张手牌，将其品质直接提升至金色，持续本场战斗。每提升1级，获得0.4倍体魄护盾。【保留】【移除】"},
  "shuimian_bazhang": {
    "id": "shuimian_bazhang",
    "name": "睡眠巴掌",
    "type": "logic",
    "cost": 1,
    "desc": "造成1倍智力伤害，弃置对手1张手牌。（额外消耗1枚【梦屑】：额外造成1.5倍智力伤害。）",
    "dmgStat": "intelligence",
    "dmgMult": 1,
    "dreamExtraCost": 1,
    "dreamExtraDamage": 1.5,
    "discardMonsterHand": 1
  },
  "shuixingle": {
    "id": "shuixingle",
    "name": "睡醒了",
    "type": "logic",
    "cost": 1,
    "desc": "造成0.5倍智力伤害，将对手1张手牌移出游戏至下回合结束。（额外消耗2枚【梦屑】：额外发动一次卡牌效果。）",
    "dmgStat":"intelligence","dmgMult":0.5,
    "exileMonsterHand": {
      "count": 1,
      "turns": 2
    },
    "dreamExtraCost":2,"dreamRepeatEffect":true
  },
  "aoye": {
    "id": "aoye",
    "name": "熬夜",
    "type": "logic",
    "cost": 2,
    "desc": "造成1倍智力伤害，对手下回合摸牌数-1，你+1。（额外消耗1枚【梦屑】：你的摸牌效果改为持续本场战斗。）",
    "dmgStat":"intelligence","dmgMult":1,
    "monsterNextDrawPenalty": 1,
    "nextTurnPlayerDraw": 1,
    "dreamExtraCost":1,"mengxieExtra": {
      "playerBonusDraw": 1
    }
  },
  "dakeshui": {
    "id": "dakeshui",
    "name": "打瞌睡",
    "type": "logic",
    "cost": 2,
    "desc": "造成2倍智力伤害；若对手手牌数≤2，获得3枚【梦屑】。",
    "dmgStat": "intelligence",
    "dmgMult": 2,
    "sleepOnPlay":true,
    "dreamIfEnemyHandLe2":3
  },
  "yiwang": {
    "id": "yiwang",
    "name": "遗忘",
    "type": "idea",
    "cost": 2,
    "desc": "抉择：1.选择卡组中的1张牌【沉睡】并获得4层【霜蝶】；2.选择弃牌堆或用具区中的1张沉睡卡牌，使其【苏醒】。（消耗2层【梦屑】：获得全部效果。）",
    "forgetChoice":true,"dreamExtraCost":2,"mengxieExtra":{"shuangdie":4}
  },
  "baojin_zhentou": {
    "id": "baojin_zhentou",
    "name": "抱紧枕头",
    "type": "idea",
    "cost": 2,
    "desc": "获得2层【霜蝶】，然后选择一张手牌【苏醒】。【如初】【保留】",
    "frostBeforeWake": 2,
    "ruchu": true,
    "baoliu": true,
    "wakeHandPick": true
  },
  "emeng_jiashuo": {
    "id": "emeng_jiashuo",
    "name": "噩梦枷锁",
    "type": "idea",
    "cost": 2,
    "desc": "本回合接下来，每消耗1枚【梦屑】，获得1层【霜蝶】，且对手弃置1张牌。",
    "nightmareDreamDiscard":true,"nightmareFrostOnDiscard":true
  },
  "suxing": {
    "id": "suxing",
    "name": "惊醒",
    "type": "answer",
    "cost": 4,
    "desc": "弃置对手所有手牌；每弃置1张，造成0.6倍智力伤害，并回复1点生命。",
    "discardMonsterHandAll": true,
    "dmgPerDiscard": {
      "stat": "intelligence",
      "mult": 0.6
    },
    "healPerDiscard": 1
  },
  "jiyi_gui_ling": {
    "id": "jiyi_gui_ling",
    "name": "记忆归零",
    "type": "answer",
    "cost": 3,
    "desc": "将对手1张手牌移除，将【梦屑】回复至上限，然后【苏醒】你的手牌。【沉睡】",
    "exileMonsterHand": {
      "count": 1,
      "permanent": true
    },
    "gainMengxieToMax":true,"wakeHandSleeping":true,"sleepOnPlay":true
  },
  "yongheng": {
    "id": "yongheng",
    "name": "永恒",
    "type": "answer",
    "cost": 3,
    "desc": "将目标的卡组陷入【沉睡】，直到受到你的伤害5次，并使你各处卡牌【苏醒】。【沉睡】",
    "sleepEnemyDeckHits":5,
    "wakeAllSleeping": true,
    "sleepOnPlay":true
  },
  "kemu_zhentou": {
    "id": "kemu_zhentou",
    "name": "枕头",
    "type": "tool",
    "cost": 2,
    "q": "green",
    "emoji": "🛏️",
    "toolEffect": "pillow",
    "desc": "【苏醒】时获得1次临时【重整旗鼓】；【重整旗鼓】后使该牌【沉睡】并获得8层【霜蝶】，该效果不受【沉睡】影响。"
  },
  "beiyong_lingshi": {
    "id": "beiyong_lingshi",
    "name": "备用零食",
    "type": "special",
    "cost": 0,
    "emoji": "🍫",
    "desc": "抉择：将体力回复至上限，或回复等同于2倍体力上限的生命（临时、移除）",
    "snackChoice": true,
    "exhaust": true
  },
  "advert_leaflet": {
    "id":"advert_leaflet","name":"广告单","type":"trap","cost":1,"emoji":"📢","desc":"无效果。【移除】","exhaust":true
  },
  "pokongzhan":{"id":"pokongzhan","name":"破空斩","type":"logic","cost":1,"q":"green","dmgStat":"physique","dmgMult":0.6,"desc":"造成0.6倍体魄伤害。","qv":{"blue":{"dmgMult":0.7,"desc":"造成0.7倍体魄伤害。"},"purple":{"dmgMult":0.8,"desc":"造成0.8倍体魄伤害。"},"gold":{"dmgMult":0.9,"desc":"造成0.9倍体魄伤害。"},"red":{"dmgMult":1,"desc":"造成1倍体魄伤害。"}}},
  "xinyandao":{"id":"xinyandao","name":"心眼刀","type":"logic","cost":2,"q":"green","parry":true,"desc":"获得【招架】：下个敌方回合下一次受到的伤害降低90%。若成功抵挡伤害，随机弃置对方1张手牌。不可叠加。"},
  "lianci":{"id":"lianci","name":"连刺","type":"idea","cost":2,"q":"green","nextLogicRepeat":true,"desc":"下一张逻辑卡的效果额外发动1次，第二次造成的伤害提升50%。同一张逻辑卡只能触发1张【连刺】。"},
  "kanpo":{"id":"kanpo","name":"看破","type":"idea","cost":1,"q":"green","revealFlaw":true,"desc":"随机展示对方1个破绽，优先选择玩家手牌中数量最多的卡牌种类。"},
  "qianxing":{"id":"qianxing","name":"前行","type":"idea","cost":0,"q":"green","energyRestore":1,"weakHeal":5,"exhaust":true,"desc":"回复1点体力。若击破破绽，额外回复5点生命。移除。","qv":{"blue":{"weakHeal":8,"desc":"回复1点体力。若击破破绽，额外回复8点生命。移除。"},"purple":{"weakHeal":11,"desc":"回复1点体力。若击破破绽，额外回复11点生命。移除。"},"gold":{"weakHeal":14,"desc":"回复1点体力。若击破破绽，额外回复14点生命。移除。"},"red":{"weakHeal":20,"desc":"回复1点体力。若击破破绽，额外回复20点生命。移除。"}}},
  "wushuangjian":{"id":"wushuangjian","name":"无双剑","type":"tool","cost":1,"q":"green","toolEffect":"wushuang_sword","desc":"本场战斗中，逻辑卡单次伤害大于目标生命上限10%时，回复1点体力。"},
  "wushuang_tiaozhan":{"id":"wushuang_tiaozhan","name":"无双挑战","type":"answer","cost":3,"q":"purple","duelChallenge":true,"desc":"展示逻辑、思路、解答、用具四种破绽至本回合结束。本回合每击破一个破绽，生成1张【闪·破空斩】；若本回合击破四种破绽，回复25%生命上限。此牌可以击破自身产生的解答破绽。","qv":{"gold":{"challengeTemp":true,"desc":"展示四种破绽。本回合每击破一个破绽，生成1张临时【破空斩】；击破四种破绽时回复25%生命上限。"},"red":{"challengeTemp":true,"challengeSlashAllTypes":true,"desc":"展示四种破绽。本回合每击破一个破绽，生成1张视为所有卡牌种类的临时【破空斩】；击破四种破绽时回复25%生命上限。"}}},
  "blade_waltz":{"id":"blade_waltz","name":"利刃华尔兹","type":"answer","cost":3,"q":"purple","dmgStat":"physique","dmgMult":0.5,"hits":5,"allCardTypes":true,"exhaust":true,"desc":"对目标造成0.5倍体魄伤害，重复发动此效果4次。此牌视为所有卡牌种类，每次发动效果最多击破1个破绽。移除。"},
  "jingzhun_ciji":{"id":"jingzhun_ciji","name":"精准刺击","type":"logic","cost":1,"q":"green","dmgStat":"physique","dmgMult":.6,"flawDamageBonus":.5,"desc":"造成0.6倍体魄伤害。该卡触发的破绽伤害额外提升0.5倍智力。"},
  "zhuiji_fiora":{"id":"zhuiji_fiora","name":"追击","type":"logic","cost":1,"q":"green","dmgStat":"physique","dmgMult":.5,"multPerEnemyFlaw":.2,"desc":"造成0.5倍体魄伤害。敌方每拥有1个破绽，此牌伤害倍率+0.2。"},
  "sanduan_tuci":{"id":"sanduan_tuci","name":"三段突刺","type":"logic","cost":2,"q":"green","dmgStat":"physique","dmgMult":.4,"hits":3,"revealFlawAfter":true,"desc":"造成0.4倍体魄伤害，重复发动2次。结算后展示敌方1个破绽。"},
  "jianfeng_yazhi":{"id":"jianfeng_yazhi","name":"剑锋压制","type":"logic","cost":2,"q":"green","dmgStat":"physique","dmgMult":1.2,"revealLogicIfNone":true,"desc":"造成1.2倍体魄伤害。若敌方没有破绽，先展示1个逻辑破绽；该破绽按正常规则触发。"},
  "juedou_zhuiming":{"id":"juedou_zhuiming","name":"决斗追命","type":"logic","cost":3,"q":"blue","dmgStat":"physique","dmgMult":1.5,"multIfFlawBroken":1,"repeatIfThreeFlawKinds":true,"desc":"造成1.5倍体魄伤害。本回合击破过破绽则倍率+1；击破过三种不同破绽则额外发动1次。"},
  "ruili_bufa":{"id":"ruili_bufa","name":"锐利步法","type":"idea","cost":0,"q":"blue","changeFlawType":true,"exhaust":true,"desc":"选择敌方1个破绽，将其改为另一种卡牌种类，并摸1张改变后对应种类的卡牌。【移除】"},
  "juedou_yaoqing":{"id":"juedou_yaoqing","name":"决斗邀请","type":"idea","cost":1,"q":"blue","inviteFlaw":true,"desc":"选择一种卡牌种类展示对应破绽；若已有该种类破绽，改为摸1张对应种类的卡牌。"},
  "gongshou_zhuanhuan":{"id":"gongshou_zhuanhuan","name":"攻守转换","type":"idea","cost":1,"q":"green","shieldStat":"physique","shieldMult":1,"onFlawEnergy":1,"onFlawNextLogicCost":-1,"desc":"获得1倍体魄护盾。若击破破绽，回复1点体力，并使下一张逻辑卡消耗-1。"},
  "huali_lianzhao":{"id":"huali_lianzhao","name":"华丽连招","type":"idea","cost":2,"q":"purple","flawComboRewards":true,"desc":"本回合每击破一种不同破绽：1种摸1张；2种回复2体力；3种使下一张逻辑卡额外发动1次；4种重置【决斗】CD。"},
  "mengyou":{"id":"mengyou","name":"梦游","type":"logic","cost":1,"q":"green","dmgStat":"intelligence","dmgMult":.8,"drawIfDream3":1,"dreamExtraCost":1,"dreamCostDiscount":1,"desc":"造成0.8倍智力伤害。若拥有至少3枚【梦屑】，摸1张牌。额外消耗1枚【梦屑】：该牌消耗-1。"},
  "turan_jingxing":{"id":"turan_jingxing","name":"突然惊醒","type":"logic","cost":1,"q":"green","dmgStat":"intelligence","dmgMult":.5,"wakeHandPick":true,"tuoshou":true,"desc":"造成0.5倍智力伤害。选择1张手牌【苏醒】。【脱手】"},
  "fan_geshen":{"id":"fan_geshen","name":"翻个身","type":"logic","cost":1,"q":"green","dmgStat":"intelligence","dmgMult":1,"status":{"shuangdie":1},"dreamExtraCost":1,"dreamExtraFrost":2,"desc":"造成1倍智力伤害并获得1层【霜蝶】。额外消耗1枚【梦屑】：额外获得2层【霜蝶】。"},
  "shuo_menghua":{"id":"shuo_menghua","name":"说梦话","type":"logic","cost":1,"q":"green","dmgStat":"intelligence","dmgMult":.6,"discardMonsterHand":1,"desc":"造成0.6倍智力伤害，随机弃置对手1张手牌。"},
  "qichuangqi":{"id":"qichuangqi","name":"起床气","type":"logic","cost":2,"q":"blue","dmgStat":"intelligence","dmgMult":1.5,"multIfWokeThisTurn":2.5,"desc":"造成1.5倍智力伤害。若本回合有卡牌成功【苏醒】过，改为2.5倍。"},
  "mengzhong_zhuiji":{"id":"mengzhong_zhuiji","name":"梦中追击","type":"logic","cost":2,"q":"blue","dmgStat":"intelligence","dmgMult":.6,"hits":3,"dreamPerHitBonus":.6,"desc":"造成0.6倍智力伤害3次。每段伤害前若拥有【梦屑】，消耗1枚使该段额外造成0.6倍智力伤害。"},
  "laichuang":{"id":"laichuang","name":"赖床","type":"idea","cost":0,"q":"green","gainMengxie":2,"exhaust":true,"baoliu":true,"desc":"获得2枚【梦屑】。【移除】【保留】"},
  "shendu_shuimian":{"id":"shendu_shuimian","name":"深度睡眠","type":"idea","cost":2,"q":"blue","gainMengxie":4,"sleepHandPick":true,"desc":"获得4枚【梦屑】。选择1张手牌，使其陷入【沉睡】。"},
  "mengjing_huishou":{"id":"mengjing_huishou","name":"梦境回收","type":"idea","cost":1,"q":"green","dreamPerSleepingCard":4,"countSleepingCards":true,"desc":"每有1张处于【沉睡】的卡牌，获得1枚【梦屑】，最多4枚。"},
  "qianmian":{"id":"qianmian","name":"浅眠","type":"idea","cost":1,"q":"green","status":{"shuangdie":2},"dreamOnNextFrost":true,"desc":"获得2层【霜蝶】。下一次消耗【霜蝶】时，获得1枚【梦屑】。"},
  "guojin_beizi":{"id":"guojin_beizi","name":"裹紧被子","type":"idea","cost":1,"q":"blue","status":{"shuangdie":3},"sleepOnPlay":true,"baoliu":true,"desc":"获得3层【霜蝶】。使这张牌陷入【沉睡】。【保留】"},
  "naozhong_xiangle":{"id":"naozhong_xiangle","name":"闹钟响了","type":"idea","cost":2,"q":"blue","wakeHandPick":true,"drawOnWake":1,"desc":"使1张手牌【苏醒】。若成功苏醒，摸1张牌。"},
  "xingmeng":{"id":"xingmeng","name":"醒梦","type":"answer","cost":3,"q":"purple","wakeRandom":3,"dreamPerWake":2,"desc":"使你各处至多3张随机卡牌【苏醒】。每成功苏醒1张，获得2枚【梦屑】。"},
  "mengxing_shifen":{"id":"mengxing_shifen","name":"梦醒时分","type":"answer","cost":2,"q":"purple","sleepAllHand":true,"frostBeforeWake":5,"dreamWakeRemoveSleepingNextTurn":true,"wakeOnLeave":true,"desc":"将所有手牌陷入【沉睡】，接着获得5层【霜蝶】。下个回合开始时，移除手中所有【沉睡】牌。本场战斗内，被此牌陷入【沉睡】的卡牌离开手牌后【苏醒】。"},
  "yanzhao":{"id":"yanzhao","name":"眼罩","type":"tool","cost":2,"q":"green","toolEffect":"eye_mask","desc":"每回合第一次获得【梦屑】时，额外获得1枚。"}
};

// 用具卡列表（奖励池/保底用）
G.TOOL_CARDS = [
  "banshou",
  "shenqi_zhi_xue",
  "putong_qianbi",
  "gangbi",
  "wushuangjian"
];

// ==================== 天赋 ====================
G.TALENTS = {
  "xueshen_zhilu":{"id":"xueshen_zhilu","name":"学神之路","quality":"紫色","emoji":"🎓","desc":"每经历一次大考，体魄、智力、情商各+1；若在高三获得，改为各+3。","tier":"rare"},
  "girl_glory":{"id":"girl_glory","name":"少女的荣耀","quality":"紫色","emoji":"🌹","desc":"初始为“先”：逻辑卡回复5生命后切换为“后”；思路卡回复1体力后切换为“先”。不符合当前顺序的卡不触发。","tier":"epic"},
  "chariot":{"id":"chariot","name":"战车","quality":"红色","emoji":"🏇","desc":"敌方始终展示四种破绽；破绽不会消失，同种破绽每张卡最多击破1次。每回合每种破绽第一次被击破时，额外触发1次击破效果。每当四种破绽各击破1个，本场智力+2。","tier":"red","exclusive":true},
  "running": {
    "id": "running",
    "name": "跑步",
    "quality": "普通",
    "emoji": "🏃",
    "desc": "体魄+1",
    "tier": "common"
  },
  "take_notes": {
    "id": "take_notes",
    "name": "做笔记",
    "quality": "普通",
    "emoji": "📝",
    "desc": "开局分别摸1张思路卡和1张逻辑卡",
    "tier": "common"
  },
  "warmup": {
    "id": "warmup",
    "name": "热身",
    "quality": "普通",
    "emoji": "🔥",
    "desc": "开局额外获得3点体力",
    "tier": "common"
  },
  "sit_straight": {
    "id": "sit_straight",
    "name": "坐正",
    "quality": "普通",
    "emoji": "🪑",
    "desc": "开局获得2层【理性】",
    "tier": "common"
  },
  "nap": {
    "id": "nap",
    "name": "午休",
    "quality": "普通",
    "emoji": "😴",
    "desc": "第一回合前2张牌消耗-1",
    "tier": "common"
  },
  "little_trick": {
    "id": "little_trick",
    "name": "一点小巧思",
    "quality": "普通",
    "emoji": "💡",
    "desc": "第一回合前2次造成伤害时，各摸1张牌",
    "tier": "common"
  },
  "borrow_pen": {
    "id": "borrow_pen",
    "name": "借笔",
    "quality": "普通",
    "emoji": "🖊️",
    "desc": "开局获得一张随机逻辑卡",
    "tier": "common"
  },
  "sleep": {
    "id": "sleep",
    "name": "睡觉",
    "quality": "普通",
    "emoji": "🛏️",
    "desc": "首次体力为0时回复至4",
    "tier": "common"
  },
  "quick_learner": {
    "id": "quick_learner",
    "name": "举一反三",
    "quality": "稀有",
    "emoji": "🧠",
    "desc": "每回合第一次打出卡牌时，摸3张牌",
    "tier": "uncommon"
  },
  "endurance": {
    "id": "endurance",
    "name": "耐力训练",
    "quality": "稀有",
    "emoji": "💪",
    "desc": "体力上限+2",
    "tier": "uncommon"
  },
  "focused_mind": {
    "id": "focused_mind",
    "name": "专注力",
    "quality": "稀有",
    "emoji": "🎯",
    "desc": "每场战斗首次逻辑卡伤害×1.5",
    "tier": "uncommon"
  },
  "emotional_intelligence": {
    "id": "emotional_intelligence",
    "name": "高情商",
    "quality": "稀有",
    "emoji": "💬",
    "desc": "情商+2",
    "tier": "uncommon"
  },
  "healthy_body": {
    "id": "healthy_body",
    "name": "强健体魄",
    "quality": "稀有",
    "emoji": "🏋️",
    "desc": "体魄+2",
    "tier": "uncommon"
  },
  "preparation": {
    "id": "preparation",
    "name": "有备无患",
    "quality": "稀有",
    "emoji": "🛡️",
    "desc": "回合结束时获得1倍体魄的护盾",
    "tier": "uncommon"
  },
  "second_wind": {
    "id": "second_wind",
    "name": "二次呼吸",
    "quality": "稀有",
    "emoji": "🫁",
    "desc": "每消耗4点体力，回复1点体力",
    "tier": "uncommon"
  },
  "rationality_mastery": {
    "id": "rationality_mastery",
    "name": "理性精通",
    "quality": "史诗",
    "emoji": "🔮",
    "desc": "理性不再因造成伤害减少",
    "tier": "rare"
  },
  "double_draw": {
    "id": "double_draw",
    "name": "双倍收获",
    "quality": "史诗",
    "emoji": "📋",
    "desc": "前4回合摸牌数翻倍",
    "tier": "rare"
  },
  "energy_surge": {
    "id": "energy_surge",
    "name": "体力充沛",
    "quality": "史诗",
    "emoji": "⚡",
    "desc": "体力上限+4",
    "tier": "rare"
  },
  "sheineng": {
    "id": "sheineng",
    "name": "谁能有我卷？",
    "quality": "史诗",
    "emoji": "📚",
    "desc": "打出带有【已变更】的卡牌时获得1层理性，每回合最多3次",
    "tier": "rare",
    "charExclusive": true
  },
  "chiqing": {
    "id": "chiqing",
    "name": "痴情",
    "quality": "史诗",
    "emoji": "💘",
    "desc": "使用卡后，各处同名卡计算伤害时情商临时+1（无限叠加，不消耗）",
    "tier": "rare",
    "charExclusive": true
  },
  "liangge": {
    "id": "liangge",
    "name": "坚韧",
    "quality": "史诗",
    "emoji": "💪",
    "desc": "护盾获取量提升，提升比例等同于当前已损失生命值百分比",
    "tier": "rare",
    "charExclusive": true
  },
  "wusuoweiju": {
    "id": "wusuoweiju",
    "name": "无所畏惧",
    "quality": "史诗",
    "emoji": "😤",
    "desc": "战斗开始添加10层无视与2层骄傲",
    "tier": "rare",
    "charExclusive": true
  },
  "kuaisu_xuanzhuan": {
    "id": "kuaisu_xuanzhuan",
    "name": "快速旋转",
    "quality": "史诗",
    "emoji": "🌀",
    "desc": "每回复1点体力，对敌方造成2点伤害；体力上限大于10时双倍",
    "tier": "rare",
    "charExclusive": true
  },
  "dameng_shuixianjue": {
    "id": "dameng_shuixianjue",
    "name": "大梦谁先觉",
    "quality": "史诗",
    "emoji": "🌙",
    "desc": "重整旗鼓次数+1；重整旗鼓时，获得卡组中及自身可以获得的所有增益各3层。",
    "tier": "rare",
    "charExclusive": true
  },
  "yangwo_qizuo":{"id":"yangwo_qizuo","name":"仰卧起坐","quality":"红色","emoji":"🏋️","desc":"战斗开始时获得1次临时【重整旗鼓】。重整旗鼓时，所有伤害额外造成30%真实伤害，该加成可叠加并持续整局游戏。","tier":"red"},
  "power":{"id":"power","name":"力量","quality":"红色","emoji":"💥","desc":"体力上限+6；打出卡牌回复2点体力。体力溢出时，消耗多余体力，每点体力造成10倍体魄伤害。特殊解锁：一回合回复30点体力。","tier":"red"},
  "yueji_tiaozhan":{"id":"yueji_tiaozhan","name":"越级挑战","quality":"紫色","emoji":"⬆️","desc":"卡牌每比基础品质高1级，其伤害与护盾+15%。卡牌品质提升时获得3点护盾，同一张牌每回合最多触发1次。","tier":"epic","charExclusive":true},
  "run_fast": {"id":"run_fast","name":"跑快快","quality":"普通","emoji":"💨","desc":"前三个回合，摸牌数+2","tier":"common"},
  "single_dog": {"id":"single_dog","name":"单身狗","quality":"普通","emoji":"🐕","desc":"卡组中没有重复的卡，其属性倍率+0.6","tier":"common"},
  "bad_heart": {"id":"bad_heart","name":"坏心眼","quality":"普通","emoji":"😈","desc":"开局在敌方卡组塞入4张【恶作剧】陷阱卡","tier":"common"},
  "sing_loud": {"id":"sing_loud","name":"大声歌唱","quality":"普通","emoji":"🎤","desc":"每场战斗使用的第一张卡拥有回响","tier":"common"},
  "sweep_kick": {"id":"sweep_kick","name":"扫堂腿","quality":"普通","emoji":"🦵","desc":"每场战斗第一次造成伤害时，弃置对方一张手牌","tier":"common"},
  "hard_tank": {"id":"hard_tank","name":"硬抗","quality":"普通","emoji":"🪨","desc":"受到的所有伤害-4","tier":"common"},
  "participation_award": {"id":"participation_award","name":"参与奖","quality":"普通","emoji":"🏅","desc":"战斗获胜获得3零花钱，每提升一个章节阶段再增加3零花钱","tier":"common"},
  "compound_interest": {"id":"compound_interest","name":"利滚利","quality":"普通","emoji":"💰","desc":"连续战斗胜利的基础奖励从1块开始每次+1，实际获得量提升50%；可无限累积，放弃考试时清空","tier":"common"},
  "logical_thinking": {"id":"logical_thinking","name":"逻辑思维","quality":"普通","emoji":"🧩","desc":"每次使用逻辑牌获得4点护盾，每回合最多触发3次","tier":"common"},
  "kidney_overdraft": {"id":"kidney_overdraft","name":"肾透支","quality":"稀有","emoji":"🫠","desc":"每回合第一张牌费用-3，体力上限-1","tier":"uncommon"},
  "perseverance_wala": {"id":"perseverance_wala","name":"毅力哇啦！","quality":"稀有","emoji":"🛡️","desc":"每回合获得护盾：首回合22点，之后每回合减少4点，最低0","tier":"uncommon"},
  "hide_snacks": {"id":"hide_snacks","name":"藏零食","quality":"稀有","emoji":"🍫","desc":"战斗开始时，在手中生成一张备用零食","tier":"uncommon"},
  "good_cards_pair": {"id":"good_cards_pair","name":"好牌成双","quality":"金色","emoji":"🃏","desc":"每场战斗使用的第一张牌会在手中生成两张【临时】复制品","tier":"rare"},
  "double_shooter":{"id":"double_shooter","name":"双发射手","quality":"蓝色","emoji":"🎯","desc":"伤害型【逻辑卡】有25%概率以50%效果再触发一次","tier":"uncommon"},
  "mom_keeps_money":{"id":"mom_keeps_money","name":"妈妈帮你保管","quality":"蓝色","emoji":"👩","desc":"零用钱获取量提升35%","tier":"uncommon"},
  "windfall":{"id":"windfall","name":"意外之财","quality":"蓝色","emoji":"🧧","desc":"立即获得500零用钱","tier":"uncommon"},
  "keep_fit":{"id":"keep_fit","name":"坚持健身","quality":"蓝色","emoji":"🏋️","desc":"每通过一次大考，体魄+1","tier":"uncommon"},
  "bundle_sale":{"id":"bundle_sale","name":"捆绑销售","quality":"紫色","emoji":"🎁","desc":"小卖部商品俩俩绑定，总价7折","tier":"epic"},
  "protein_overdose":{"id":"protein_overdose","name":"过量蛋白粉","quality":"紫色","emoji":"🥤","desc":"体魄提升40%，最少提升4","tier":"epic"},
  "loud_voice":{"id":"loud_voice","name":"大嗓门","quality":"紫色","emoji":"📣","desc":"造成的所有伤害提升40%","tier":"epic"},
  "sharp_tongue":{"id":"sharp_tongue","name":"牙尖嘴利","quality":"紫色","emoji":"🦷","desc":"额外造成25%真实伤害","tier":"epic"},
  "easy_favor":{"id":"easy_favor","name":"顺手的事","quality":"紫色","emoji":"🤏","desc":"每回合开始复制一张敌方手牌，复制品具有【闪】","tier":"epic"},
  "unlimited_fire":{"id":"unlimited_fire","name":"无限火力","quality":"金色","emoji":"🔥","desc":"每打出一张牌回复2点体力","tier":"rare"},
  "super_brain":{"id":"super_brain","name":"超强大脑","quality":"金色","emoji":"🧠","desc":"每打出非【解答卡】，本场智力与情商各+1","tier":"rare"},
  "rapper":{"id":"rapper","name":"说唱家","quality":"金色","emoji":"🎙️","desc":"每打出一张【逻辑卡】，随机生成并使用一张【闪·思路卡】（任意角色或共通）","tier":"rare"},
  "pianist":{"id":"pianist","name":"歌星","quality":"金色","emoji":"🎤","desc":"你的各处卡牌额外添加一次【回响】，可与原有【回响】叠加；【回响】不会复制【闪】牌","tier":"rare"},
  "gold_sales":{"id":"gold_sales","name":"金牌销售","quality":"金色","emoji":"🏆","desc":"每打出一张牌，向敌方卡组塞入一张【广告单】。","tier":"rare"},
  "fate":{"id":"fate","name":"命运","quality":"红色","emoji":"🎰","desc":"天赋池只刷新紫色及以上天赋；抉择卡获得全部选项效果；每拥有100零花钱，造成的伤害提升50%","tier":"red","exclusive":true}
};

// ==================== 事件 ====================
G.EVENTS = {
  "notebook": {
    "id": "notebook",
    "name": "捡到笔记本",
    "emoji": "📓",
    "desc": "走廊上捡到一本笔记本，封面上写着主人的名字。",
    "dialogue": [
      "你在走廊拐角捡到一本笔记本。它摊得四平八稳，像是故意躺在那里碰瓷。封面写着名字，字迹端正得让你怀疑失主写作业时旁边站着教导主任。你翻开第一页，本想确认班级，却发现里面从公式到课堂暗号一应俱全，甚至记录了数学老师每次说“这题很简单”之后，究竟会有多少人露出复杂的表情。",
      "继续往后看，内容逐渐从课堂笔记变成生存指南：哪台饮水机出水最快、食堂哪扇窗口的阿姨手最稳、周一升旗时站在哪里不容易被太阳精准照射。最后一页还郑重写着：若本人遗失，请好心人归还；若好心人想抄，请至少把错别字一起改掉。你突然感到这不是一本普通笔记，而是一位学生对校园生活的长期田野调查。",
      "上课铃已经响过一次，走廊里只剩你、笔记本和远处逐渐靠近的脚步声。现在归还它，你大概能收获一句真诚感谢；偷偷抄一份，你也许能得到一点实用知识，只是以后见到失主时可能会下意识把眼神移向天花板。你把本子合上，认真思考了三秒，然后决定让自己的道德水平接受一次不太严格的随堂测验。"
    ],
    "opts": [
      {
        "text": "归还失主",
        "eff": "gold10",
        "effDesc": "获得15零花钱"
        ,"afterText":"你循着封面的名字找到失主。对方先摸遍书包，再摸遍口袋，最后差点开始检查自己的记忆是否还在。看到笔记本时，他的表情像刚从补考名单里被捞出来，郑重塞给你一笔谢礼。你客气了两句，手却很诚实地把钱收好，并答应绝不公开那页关于食堂红烧肉出现概率的研究。"
      },
      {
        "text": "偷偷抄一份",
        "eff": "randomLogic",
        "effDesc": "获得一张随机逻辑卡"
        ,"afterText":"你找到复印机，像执行秘密任务一样按下开始键。机器偏偏在最关键的时候发出巨大声响，隔壁老师探头看了一眼，你只好镇定地说自己正在研究纸张的受热规律。最终副本顺利到手，你还顺手改了两个错别字。至于原主人会不会发现笔记突然变得更规范，那就是另一场推理题了。"
      }
    ]
  },
  "teacher": {
    "id": "teacher",
    "name": "老师办公室",
    "emoji": "🏫",
    "desc": "老师叫你去办公室……原来是表扬你最近进步很大！",
    "dialogue":[
      "课间，班长站在门口喊你的名字，说老师让你去办公室一趟。全班瞬间安静了半秒，随后投来一种混合着同情、好奇和“还好不是我”的目光。你一路复盘最近的行为：作业交了，值日做了，上课走神也控制在老师转身写板书的时候，理论上没有足以惊动办公室的大事。",
      "你敲门进去，老师没有拿出试卷，也没有让你解释昨天那道离谱的选择题。她只是推了推眼镜，说你最近进步明显，尤其是答题时终于不再把“略”写得像一种完整解法。旁边几位老师纷纷抬头，仿佛见证了某项长期科研项目终于取得阶段性成果。你努力维持镇定，心里已经悄悄给自己播放颁奖音乐。",
      "老师问你是想听几句表扬，还是趁机请教学习方法。前者能让今天的心情保持晴朗，后者可能让未来的成绩更稳定，不过也可能换来一份精确到分钟的学习计划。办公室的钟滴答作响，你意识到这是一道没有标准答案、但老师显然很期待你认真作答的开放题。"
    ],
    "opts": [
      {
        "text": "谦虚接受",
        "eff": "eq1",
        "effDesc": "情商+1"
        ,"afterText":"你低调地说这都是老师教得好，并把声音控制在隔壁老师刚好能听见的程度。老师满意地点头，顺便又夸你会说话。你发现谦虚是一项神奇技能：既能把表扬退回去，又能让它绕一圈再次落到自己头上。离开办公室时，你走路没有飘，只是鞋底看起来比平时轻了一点。"
      },
      {
        "text": "请教学习方法",
        "eff": "randomIdea",
        "effDesc": "获得一张随机思路卡"
        ,"afterText":"你掏出本子准备记录秘诀。老师沉思片刻，给出了一套听起来朴素却很有效的方法，还特别强调不要把“制定计划”本身当成学习。你郑重点头，默默划掉昨晚花四十分钟画的彩色时间表。谈话结束时，你得到了一条新思路，也失去了继续用文具整理来假装努力的合理借口。"
      }
    ]
  },
  "playground": {
    "id": "playground",
    "name": "操场偶遇",
    "emoji": "🏃",
    "desc": "体育委员邀请你一起锻炼。",
    "dialogue":[
      "午后的操场热得很有原则，跑道像一条刚出锅的红色煎饼。体育委员抱着计时表朝你挥手，邀请你加入训练。他的笑容阳光、真诚，而且完全没有意识到你只是想从这里抄近路去小卖部。你看了一眼跑道，又看了一眼树荫，身体里的每个细胞都开始举行意见不统一的班会。",
      "体育委员说锻炼能增强体魄、改善精神，还能让晚饭多吃一碗。他没有提第二天腿酸得像被重新安装过。树荫下恰好有张长椅，坐在那里看书也很合理，只是风会不时替你翻页，而且通常翻到你还没看懂的位置。远处有同学跑得气喘吁吁，却仍坚持向你比出一个充满鼓励的手势。",
      "你站在跑道边进行成本核算：一起跑步，可能收获健康和短暂的后悔；坐下看书，可能收获知识和体育委员意味深长的眼神。铃声还有一会儿才响，你有充足时间做出选择，也有充足时间假装鞋带松了。不过体育委员已经拿起计时表，显然不准备让鞋带替你回答。"
    ],
    "opts": [
      {
        "text": "一起跑步",
        "eff": "physique1",
        "effDesc": "体魄+1"
        ,"afterText":"你迈上跑道，前半圈觉得自己状态不错，后半圈开始重新理解“坚持”这个词。体育委员一路控制速度，没有嘲笑你，只在你想停下时提醒终点就在前面——虽然这句话他说了三次。跑完后你扶着膝盖喘气，感觉肺部提交了一份措辞激烈的意见书，但身体确实比刚才更有力量。"
      },
      {
        "text": "在旁看书",
        "eff": "int1",
        "effDesc": "智力+1"
        ,"afterText":"你在树荫下坐好，翻开书本，摆出一种即使校长路过也会欣慰的姿势。体育委员跑完两圈看了你一眼，你立刻把书举高一点，证明自己不是偷懒，只是在进行脑力耐力训练。风替你翻过几页，你又认真翻回来。最终你确实读懂了一个知识点，也成功避开了操场最晒的区域。"
      }
    ]
  },
  "library": {
    "id": "library",
    "name": "图书馆志愿者",
    "emoji": "📚",
    "desc": "图书馆正在招募志愿者，帮忙整理书架也许有报酬。",
    "dialogue":[
      "图书馆门口贴着一张志愿者招募启事，纸张端正，胶带却贴得像经历过一次小型地震。管理员正对着归还车上的书叹气：文学混进了物理，历史挤进了烹饪，还有一本《高效时间管理》逾期了整整两个月。你刚停下脚步，管理员便用发现可靠劳动力的眼神看向你。",
      "工作内容听起来简单：把书送回正确的位置。真正开始后，你才发现书架编号像某种只有图书管理员掌握的密码。有些书很配合，有些书则厚得像在测试你的臂力。整理途中，你不断看到想读的标题，每一本都仿佛在说“只看五分钟”，而你很清楚，五分钟是图书馆里最不可信的时间单位。",
      "管理员表示认真帮忙会有一点报酬，也允许你完成后留下阅读。你可以专心整理，靠劳动换取零花钱；也可以抓紧机会读书，把报酬换成脑子里的东西。归还车仍然满着，窗边的座位也恰好空着。你必须在责任感和那本已经向你招手三次的书之间作出决定。"
    ],
    "opts": [
      {
        "text": "帮忙整理",
        "eff": "gold10",
        "effDesc": "获得15零花钱"
        ,"afterText":"你卷起袖子开始整理，并逐渐掌握了书架的脾气。一个小时后，文学回到文学，物理回到物理，那本逾期的时间管理也被单独放到显眼位置接受反思。管理员检查成果后满意地付了报酬。你接过钱，感觉自己不仅整理了书，还暂时整理好了这个世界的一小块。"
      },
      {
        "text": "趁机读书",
        "eff": "int1",
        "effDesc": "智力+1"
        ,"afterText":"你向管理员保证只读一会儿，然后迅速坐到窗边。等再次抬头时，阳光已经从桌子左边挪到了右边，归还车似乎也对你产生了失望。好在那本书确实有用，你记下了不少内容。管理员经过时轻轻咳了一声，却没有赶你，只把一小摞待整理的书放在了你旁边。"
      }
    ]
  },
  "vendor": {
    "id": "vendor",
    "name": "路边小摊",
    "emoji": "🍢",
    "desc": "放学路上飘来烤串的香味……",
    "dialogue":[
      "放学路上，你闻到一股极有行动力的香味。它穿过人群、绕过书包，准确抵达你的鼻子，随后开始对意志力展开持续攻击。路边小摊的烤架滋滋作响，老板翻动竹签的手法熟练得像在批改选择题，而且每一题都选“再来一串”。你本来走得很坚定，脚步却自然地慢了下来。",
      "老板看见你，热情介绍今天的烤串外焦里嫩、价格公道，还附赠一句“学生长身体，偶尔吃点没关系”。你的钱包在口袋里保持沉默，肚子却非常积极地发表意见。你计算了一下，五块零花钱可以买到十点生命恢复，也可以买到明天的一瓶饮料，或者继续留着，在某个更关键的时候证明自己曾经很会理财。",
      "烤串只剩最后几串，旁边已经有人开始排队。现在买下它，你会获得即时而可靠的快乐；忍住不吃，你会保住零花钱，并在接下来的三分钟里不断回头。老板没有催你，只把调料又刷了一遍。这个动作十分平静，却比任何推销话术都更有说服力。"
    ],
    "opts": [
      {
        "text": "买一串(5零花钱)",
        "eff": "heal10",
        "effDesc": "回复10点生命，花费5零花钱"
        ,"afterText":"你交出五块钱，接过烤串，第一口就觉得这笔交易经过了严格论证。老板还贴心地提醒小心烫，你点头太快，差点被辣椒粉呛到。吃完后精神明显恢复，钱包则安静地轻了一点。你决定把竹签扔进垃圾桶，至少让这次消费在文明方面也产生一点附加价值。"
      },
      {
        "text": "忍住不吃",
        "eff": "nothing",
        "effDesc": "什么都没发生"
        ,"afterText":"你深吸一口气，告诉自己真正成熟的人不会被一串烤肉左右。走出十米后，你又告诉自己成熟的人偶尔回头看看也没关系。最终你成功离开，零花钱一分没少，只是一路上都觉得空气里还残留着孜然味。什么实际奖励都没有，但你的意志力至少完成了一次不记分测试。"
      }
    ]
  },
  "jiezhi_yaoqing": {
    "id": "jiezhi_yaoqing",
    "name": "杰之邀请",
    "emoji": "🎮",
    "desc": "杰哥想要去你家玩游戏机。梁超杰：\"让我康康\"",
    "dialogue":[
      "放学铃刚响，梁超杰就以一种目标明确的速度出现在你旁边。他先关心你的作业，再关心你的晚饭，最后终于说出真正目的：听说你家有游戏机，想去“简单参观一下”。他说参观时眼神非常诚恳，仿佛手柄只是博物馆展品，绝不会被接上电视，更不会一玩玩到家长回来。",
      "你提醒他明天还有课，他表示游戏也能锻炼反应速度，双人合作还能培养团队意识，失败后重开则体现了面对挫折的坚韧品质。短短一分钟，一次普通串门已经被包装成综合素质教育项目。更可疑的是，他甚至带了两包零食，并声称这只是为了避免你家茶几显得太空。",
      "如果让他进门，今晚大概会很热闹，你也能顺便恢复一点精神；如果拒绝，你可以趁机整理卡组，把一张不顺眼的牌彻底送走。梁超杰站在门口等待答案，表情礼貌，脚尖却已经朝向你家的方向。你意识到真正的选择不是他想不想去，而是你准备以什么方式处理这份过于充分的热情。"
    ],
    "hidden": true,
    "opts": [
      {
        "text": "杰哥不要啦",
        "eff": "remove_card",
        "effDesc": "选择并移除一张卡牌"
        ,"afterText":"你态度坚定地表示今天不方便。梁超杰沉默两秒，郑重地点头，说自己完全理解，然后把零食收回书包的速度快得令人敬佩。临走前他帮你检查卡组，指出其中一张牌看起来特别不合群。你顺势把它清理出去，虽然没玩到游戏，但至少完成了一次有效的牌组整理。"
      },
      {
        "text": "杰哥请进",
        "eff": "heal15pct",
        "effDesc": "回复15%最大生命"
        ,"afterText":"你打开门，梁超杰熟练地把零食放上茶几，动作自然得像来过很多次。所谓“简单参观”持续了整个下午，中途还包含激烈讨论、临时战术会议以及对手柄是否失灵的学术争论。结束时你虽然有点累，心情却放松不少。梁超杰离开前还认真说，下次一定只玩一小会儿。"
      }
    ]
  },
  "xuyuanchi": {
    "id": "xuyuanchi",
    "name": "许愿池",
    "emoji": "⛲",
    "desc": "这里怎么会有个许愿池，要不投个币试试？",
    "dialogue":[
      "校园角落里不知何时多出一座许愿池。它规模不大，水倒是清得很认真，池底散落着几枚硬币，旁边还立着一块手写牌：心诚则灵，概不退款。你绕着池子走了一圈，没有找到负责人，只看到一只麻雀站在牌子上，神情像这里的临时财务主管。",
      "传闻说投入硬币后闭眼许愿，愿望会以某种形式实现。有人想要考试顺利，第二天老师正好请假；有人希望变得强壮，结果被体育委员拉去搬器材。许愿池似乎确实会回应，只是理解能力可能与语文成绩有关。你摸了摸口袋，三块零花钱正发出不太情愿的碰撞声。",
      "你可以进行一次诚意十足的一键三连，让命运随机改善三项属性；也可以保持理性，认定这只是一个拥有良好文案的水池。麻雀歪头看着你，仿佛也在等抽成。风吹过水面，硬币闪了一下。你知道它大概只是反光，但这种时候，反光通常很会营造气氛。"
    ],
    "hidden": true,
    "opts": [
      {
        "text": "一键三连",
        "eff": "wish_pay",
        "effDesc": "失去3零花钱，获得3次随机属性+1"
        ,"afterText":"你把三枚硬币依次投入池中，每投一枚都认真许了愿。第三枚落水后，池面泛起一圈非常标准的波纹，麻雀也配合地叫了一声。你站着等了片刻，没有神光，也没有广播宣布奇迹，但身体和思路似乎真的发生了一点变化。至于具体变强在哪里，只能说许愿池坚持随机分配，拒绝定向培养。"
      },
      {
        "text": "算了吧，骗钱的",
        "eff": "nothing",
        "effDesc": "无效果"
        ,"afterText":"你盯着“概不退款”四个字，成功找回了理智。转身离开时，麻雀在背后叫了两声，听起来像对流失客户表示遗憾。你保住了三块零花钱，也没有得到任何神秘力量。走远以后，你还是忍不住回头看了一眼，确认许愿池没有因为错过你而突然喷出金光。它没有，十分尊重现实。"
      }
    ]
  },
  "xiaojun_duzhu": {
    "id": "xiaojun_duzhu",
    "name": "小君的赌注",
    "emoji": "🏁",
    "desc": "\"我敢肯定你绝对跑不过我，要不我们比比？\"小君与你打赌：下一场战斗累计消耗指定体力。",
    "dialogue":[
      "小君在跑道边拦住你，开场没有寒暄，直接宣布你绝对跑不过她。你指出自己本来只是去交作业，她却认为这正说明你缺乏竞技精神。为了证明观点，她提出一个赌注：下一场考试里累计消耗足够多的体力，就算你赢。至于跑步为什么突然变成考试，她表示真正的高手不拘泥于比赛形式。",
      "普通赌局要求累计消耗十五点体力，风险不高，收益也还算稳妥。她随后压低声音提出更大的方案：三十点体力，奖励更多，失败也会多损失一点。你怀疑她不是想比赛，而是在进行某种零花钱再分配实验。小君拍着胸口保证规则公平，并拒绝解释为什么随身携带已经写好的赌约。",
      "你可以接受普通赌注，下一场考试认真规划体力；也可以加大筹码，体验一把把体力条当流水账的紧张感；当然，还可以引用校规和家庭教育，礼貌表示好孩子不参与赌博。小君抱着手臂等你回答，风把赌约吹得哗哗响，气氛很正式，只是旁边体育老师完全不知道这场赛事已经成立。"
    ],
    "hidden": true,
    "opts": [
      {
        "text": "可以，赌！",
        "eff": "bet15",
        "effDesc": "下一场战斗消耗15体力：成功获得30零花钱，失败失去5零花钱"
        ,"afterText":"你接受了普通赌注。小君立刻拿出笔，在赌约上补上日期，熟练程度让你更加怀疑她经常开展类似业务。她提醒你下一场考试别太节省体力，消耗不到十五点可不算努力。你收好约定，开始盘算怎样既完成目标，又不至于在关键时刻对着一手牌干瞪眼。"
      },
      {
        "text": "好孩子不赌博",
        "eff": "nothing",
        "effDesc": "无效果"
        ,"afterText":"你郑重表示好孩子不赌博。小君先是愣了一下，随后评价你这句话很像班会课标准答案。她没有继续劝，只把赌约折好塞回口袋，并邀请你真的跑一圈。你迅速表示作业还没交，成功用学习理由退出体育活动。没有奖励，也没有损失，只有小君在背后笑得十分明显。"
      },
      {
        "text": "赌大点怎么样？",
        "eff": "bet30",
        "effDesc": "下一场战斗消耗30体力：成功获得45零花钱，失败失去10零花钱"
        ,"afterText":"你提出赌大一点，小君的眼睛立刻亮了，像等到了正确选项。三十点体力的目标被写进赌约，旁边还加了两个感叹号，显得非常具有法律气势。你签完后才意识到，下一场考试可能需要疯狂出牌才能达标。小君满意离开，而你已经开始思考有没有哪张牌能合理地多花一点体力。"
      }
    ]
  },
  "early_submission": {
    "id":"early_submission",
    "name":"提前交卷",
    "emoji":"🏃",
    "desc":"你有第一个跑出考场的勇气吗？\n\n试试看吧，然后去镜头前喊加强薛诗蕾。",
    "dialogue":[
      "走廊公告栏上贴着一张《提前交卷》的海报。纸张右下角画着一个冲出考场的小人，动作很有气势，鞋带却明显没系好。你盯着它看了几秒，开始怀疑画手是在鼓励勇气，还是在提醒大家跑出考场前先检查脚下。",
      "海报末尾突然写着一句“去镜头前喊加强薛诗蕾”。你反复确认了三遍，发现这不是谁用铅笔补上去的，旁边甚至还盖着一个看不清属于哪个部门的章。公告栏后面传来很轻的咳嗽声，像是有人正等着看你的反应。",
      "走廊里没有其他人，风却很配合地把海报吹得啪啪作响。你总觉得附近藏着负责记录表情的工作人员，也可能只是值日生忘了关窗。现在，你可以把报名条揭下来，也可以保持低调，假装自己只是路过这里看天气预报。"
    ],
    "opts":[
      {"text":"接下","eff":"early_exam_accept","effDesc":"","afterText":"你揭下海报旁边的报名条，写上名字。笔尖落下的瞬间，你仿佛已经感受到未来监考老师惊讶的视线。公告栏后面传来一声很轻的“好耶”，但等你绕过去时，那里只有一把扫帚。你决定暂时不追究声音来源。至于对镜头喊话，可以等真的站到镜头前再考虑音量。"},
      {"text":"不了不了，我社恐","eff":"nothing","effDesc":"","afterText":"你后退半步，礼貌地对公告栏摇了摇头。提前交卷已经够显眼，还要面对镜头，这套流程显然超出了今日社交预算。你转身离开，身后的海报被风吹得啪啪作响，像在做最后挽留。没有人追上来，你也没有损失什么，只是以后路过这里时可能仍会下意识加快脚步。"}
    ]
  },
  "lottery": {
    "id":"lottery",
    "name":"大乐透",
    "emoji":"🎟️",
    "desc":"要来试试吗？万一中了呢？每张彩票需要经过3场考试后开奖。",
    "dialogue":[
      "校园角落支起了一张写着“大乐透”的桌子，工作人员面带微笑，桌上整齐摆着号码纸和一只透明抽奖箱。宣传语只有一句：万一中了呢？这句话没有提供任何概率信息，却非常有效。每张彩票售价三十零花钱，需要选择六个互不重复的数字，而且不是当场开奖，要等你再经历三场考试。",
      "开奖时会随机生成一组同样不重复的六位号码，并从最左边开始连续比较。一旦某一位不同，后面的数字就算猜中也不作数。工作人员举例说明时语气轻松，你却听出了数学题的味道。命中越多奖励越高，六位全中甚至能获得巨额零花钱和红色天赋【命运】，听上去像足以让班主任主动询问你的理财规划。",
      "你可以花三十零花钱挑选号码，最多购买十张；每张彩票分别等待三场考试并单独开奖。也可以现在离开，把钱留给更稳定的消费。透明箱安静地放在桌上，看起来既公正又完全不透露任何信息。工作人员把笔递给你，没有催促，只补充了一句：认真选号不一定有用，但仪式感通常不会缺席。"
    ],
    "opts":[
      {"text":"选号码","eff":"lottery_buy","effDesc":"花费30零花钱购买1张彩票，最多购买10张","afterText":"你接过号码纸，突然理解了为什么人们选号时会研究生日、座位号和今天食堂排队人数。工作人员提醒六个数字不能重复，你只好放弃把幸运数字写满整张纸的计划。接下来每一个数字看起来都很有潜力，也都像在故意装得可靠。最终结果要等三场考试之后，现在能做的只有认真选择，并假装自己掌握了某种规律。","afterTexts":["你接过号码纸，突然理解了为什么人们选号时会研究生日、座位号和今天食堂排队人数。工作人员提醒六个数字不能重复，你只好放弃把幸运数字写满整张纸的计划。接下来每一个数字看起来都很有潜力，也都像在故意装得可靠。最终结果要等三场考试之后，现在能做的只有认真选择，并假装自己掌握了某种规律。","第一张号码纸刚写完，工作人员就默默递来下一张，动作熟练得像早就料到你会想再给命运一次机会。你盯着数字看了半天，发现它们在纸上越排越像一道选择题：每个答案都似乎有道理，也都缺少足够证据。既然如此，至少让排列看起来足够有气势。","你本来准备离开，手却在桌边停了一下。透明抽奖箱安静得近乎挑衅，仿佛在说再买一张也不会怎样。工作人员没有说话，只把号码纸转了个方向，给你留出更顺手的书写角度。你决定相信这不是心理战。","连续选号后，你已经开始给数字安排性格：有的看起来稳重，有的明显爱冒险，还有的只是因为写起来顺手。工作人员认真记录，没有评价你的逻辑。毕竟在这里，任何理由都能被称作直觉，只要最后记得付钱。"]},
      {"text":"随机购买十组号码","eff":"lottery_buy_ten","effDesc":"花费300零花钱，随机购买10张彩票","afterText":"你把选号权郑重交给了随机。工作人员确认过数量后，像发试卷一样迅速写满十张号码纸。每一组数字都看起来颇有来历，实际上它们的共同点只有一个：都不是你选的。你收好彩票，忽然获得了一种非常轻松的责任感。"},
      {"text":"离开","eff":"lottery_leave","effDesc":"离开事件","afterText":"你把递到面前的笔轻轻推回去，决定不让概率学提前支配今天的心情。工作人员没有挽留，只熟练地说了一句欢迎下次再来。走出几步后，你听见身后有人兴奋地讨论幸运号码，脚步不由得慢了一瞬。最终你还是继续向前，零花钱原封不动，脑子里却莫名留下了六个随机数字。"}
    ]
  }
};
// 事件文本只负责讲故事；条件、数值、消耗与奖励均不写进正文或选项后续对白。
G.EVENT_STORY_REWRITE={
  notebook:{desc:'走廊拐角躺着一本无人认领的笔记本。',dialogue:[
    '走廊拐角躺着一本笔记本，姿势端正得像故意在那里等人。封面写着姓名，旁边画了一只神情严肃的鸭子，鸭子头顶还有两个字：别翻。你本来只想确认班级，看到这句话以后，好奇心反而准时上班了。',
    '第一页是课堂笔记，往后却渐渐变成校园观察报告：数学老师说“很简单”以后全班沉默多久，哪台饮水机出水最快，以及食堂糖醋排骨究竟更接近糖还是排骨。记录认真得让人肃然起敬，研究方向却让人不敢细想。',
    '远处传来急促脚步声，有人一边翻书包一边小声念叨。你合上本子，封面那只鸭子仍旧盯着你。失主似乎马上就到，而楼下的复印机也仿佛在发出若有若无的召唤。'],optionText:['归还失主','偷偷抄一份'],after:[
    '你循着名字找到了失主。对方先看本子，又看你，最后长长松了一口气，仿佛被找回来的不是笔记，而是整个学期的记忆。临走前，他认真提醒你不要相信食堂研究那一页，因为样本数量还不够严谨。',
    '你抱着学术交流的态度留下了一份副本。复印机偏偏在最安静的时候发出巨大声响，隔壁老师探头询问，你只好说自己正在研究纸张与噪声的关系。老师沉默片刻，建议你先研究一下上课时间。']},
  teacher:{desc:'课间，老师突然叫你去办公室。',dialogue:[
    '班长站在门口喊你的名字，说老师请你去办公室。全班瞬间安静半秒，随后送来整齐而复杂的目光。你一路复盘最近的表现：作业交了，值日做了，上课走神时也始终保持面向黑板，理论上没有值得惊动办公室的大事。',
    '你敲门进去，老师没有拿试卷，也没有让你写说明。她只是推了推眼镜，说最近看得出你很认真。旁边批作业的老师闻言抬头，那神情像某项长期观察终于得出了令人欣慰的实验结果。',
    '老师问你有没有什么想说的。办公室的钟滴答作响，饮水机突然咕噜一声，替谈话增加了不必要的庄重。你可以谦虚两句，也可以顺势问问学习方法，只是最好别回答“主要靠运气”。'],optionText:['谦虚接受','请教学习方法'],after:[
    '你认真表示自己还有很多不足，并把语气控制在既谦虚又不至于否定老师眼光的程度。老师笑着点头，顺手又夸了你一句。你这才发现，谦虚有时像回旋镖，扔出去以后还会带着表扬飞回来。',
    '你掏出本子请教方法。老师讲得很细，还提醒不要把制作漂亮计划表当成已经学习。你默默想起昨晚画了很久的彩色时间轴，决定回去以后至少先在第一格真正写点东西。']},
  playground:{desc:'体育委员在操场边朝你挥手。',dialogue:[
    '午后的跑道被太阳晒得很有脾气。你本想从操场抄近路，体育委员却远远看见了你，挥手的动作热情得像已经替你报了名。你停在原地，身体与意志同时展开了一场没有主持人的紧急会议。',
    '体育委员说一起活动活动，人会精神很多。树荫下正好有张空长椅，风吹过去，书页自动翻了两张，看起来也很欢迎你。跑道与长椅分处两边，像两个性格完全不同的同学，都在催你表态。',
    '你低头系了两遍鞋带，希望能拖到上课铃响。体育委员耐心等着，甚至夸你安全意识不错。看来这招没解决问题。远处有人跑完一圈，气喘吁吁地向你比出大拇指，那份鼓励真诚得让装作没看见都有点困难。'],optionText:['一起跑步','在旁看书'],after:[
    '你踏上跑道，前半圈尚能维持从容，后半圈开始认真思考终点是不是被人悄悄搬远了。体育委员一路陪着，只在你想停下时说“快到了”。他说了三遍以后，你终于明白“快”是一个弹性很大的词。',
    '你在树荫下坐好，把书翻到夹着书签的地方。体育委员经过时看了你一眼，你立刻挺直腰背，摆出正在进行脑力训练的姿势。风又来替你翻页，你与它争夺了几次进度，最后勉强算是各退一步。']},
  library:{desc:'图书馆的归还车今天格外拥挤。',dialogue:[
    '图书馆门口的招募纸被胶带贴得歪歪扭扭，管理员站在塞满书的归还车旁叹气。文学挤进物理，历史夹在烹饪中间，还有一本《高效时间管理》躺在最底下，显然对自己的处境没有解释。',
    '你刚靠近，管理员便露出看见可靠人手的表情。把书放回原位听起来不难，真正动手后却像破解一套只有书架明白的暗号。每走几步，你都会遇见一本标题很吸引人的书，并产生“只看一页”的危险想法。',
    '窗边座位恰好空着，阳光落在桌面上，气氛适合读书；归还车也恰好还满着，轮子微微朝你偏了一点，气氛适合干活。管理员没催促，只把分类标签递来。那张纸很轻，期待却有点沉。'],optionText:['帮忙整理','趁机读书'],after:[
    '你推着归还车在书架间来回穿梭，渐渐摸清编号的脾气。最后一本书归位时，管理员满意地点点头。那本《高效时间管理》被放在最显眼的位置，像是在接受一场安静但严厉的公开教育。',
    '你在窗边翻开惦记已久的书，只准备看一小会儿。再次抬头时，阳光已经换了位置，管理员也把一摞待整理的书轻轻放在你旁边。双方谁都没说话，但你感觉自己收到了非常含蓄的提醒。']},
  vendor:{desc:'放学路上，烤架的香味绕过人群找到了你。',dialogue:[
    '放学路上的烤架滋滋作响，香味穿过人群，准确追上原本走得很坚定的你。老板翻动竹签的动作娴熟得像在批改选择题，而且每一次都毫不犹豫地选择“再刷一层酱”。',
    '你本想目不斜视地经过，肚子却在关键时刻发表了不同意见。老板听见动静，十分体贴地假装什么也没听见，只把烤串翻了个面。孜然在空气中散开，这个动作比任何招呼都更有说服力。',
    '队伍后面又来了两个人，烤架上的竹签已经所剩不多。你可以停下来，也可以继续保持刚才意志坚定的模样。问题在于，你已经连续回头两次，坚定这个形象多少出现了一点裂缝。'],optionText:['来一串','今天算了'],after:[
    '你接过烤串，第一口就觉得刚才那番犹豫很没必要。老板提醒小心烫，你点头太快，差点被辣椒粉呛到。吃完后你把竹签认真扔进垃圾桶，努力让这次临时起意显得既满足又文明。',
    '你深吸一口气继续向前，告诉自己成熟的人不会被一串烤肉左右。走出十米后，你又告诉自己成熟的人偶尔回头看看也没关系。最终你成功离开，只是一路都觉得校服上仿佛沾着孜然味。']},
  jiezhi_yaoqing:{desc:'放学铃刚响，梁超杰便目标明确地凑来。',dialogue:[
    '放学铃刚响，梁超杰就出现在你桌边。他先问作业写得怎样，又问晚上有没有安排，绕了两圈终于切入正题：听说你家有游戏机，他想去“简单参观一下”。他说参观时表情诚恳，仿佛手柄只是绝不会碰的展品。',
    '你提醒他明天还要上课。他立刻解释游戏可以锻炼反应，合作模式能够培养默契，失败以后重开则体现面对挫折的坚韧。短短一分钟，普通串门已经被他说成一项全面发展的课外实践。',
    '更可疑的是，他从书包里拿出两包零食，并声称只是担心你家茶几显得太空。梁超杰站在门口等你回答，神态礼貌，脚尖却已经朝向你家的方向。现在看来，只差你决定今晚的客厅会不会变热闹。'],optionText:['今天不方便','那就来吧'],after:[
    '你表示今天不方便。梁超杰沉默两秒，十分理解地点头，然后迅速把零食收回书包，动作干净得像提前练过。临走前他仍提醒你有空记得叫他，并强调下次真的只参观，最多顺便摸一下手柄。',
    '你打开门，梁超杰熟练地把零食摆上茶几。所谓简单参观很快发展成战术讨论、操作教学和关于手柄是否失灵的严肃争论。天色暗下来时，他终于告辞，并郑重承诺下次一定控制时间。']},
  xuyuanchi:{desc:'校园角落里不知何时多出一座小许愿池。',dialogue:[
    '校园角落里多出一座小小的许愿池。水面清得很认真，旁边立着一块手写牌，字迹一半飘逸、一半像下课铃响后匆忙完成。你绕着池子走了一圈，没有负责人，只有一只麻雀站在牌子顶端。',
    '据说有人在这里希望第二天轻松一点，结果老师真的请假了，代课老师却抱来两套卷子。还有人希望变得更有力量，随后被体育委员叫去搬器材。传闻不能说完全不灵，只能说它理解愿望的方式很有个性。',
    '麻雀歪头看你，神情像这里的临时管理员。风吹过水面，池底亮了一下。你知道那大概只是反光，但这种地方最擅长把普通反光弄得意味深长。要不要认真配合一下，全看你愿不愿意相信气氛。'],optionText:['认真许愿','保持清醒'],after:[
    '你闭上眼睛，把愿望在心里认真说了一遍。水面传来几声轻响，麻雀也很配合地叫了一声。你睁眼等待片刻，没有神光，也没有广播宣布奇迹，只有一圈圈波纹慢慢散开，显得相当专业。',
    '你盯着手写牌看了一会儿，决定暂时不参加这场气氛感很强的活动。转身离开时，麻雀在身后叫了两声，听起来像在对流失的访客表示遗憾。你回头确认，池子依然平静，十分尊重现实。']},
  xiaojun_duzhu:{desc:'小君在跑道边拦住你，笑得很有挑战意味。',dialogue:[
    '小君在跑道边拦住你，开口就宣布你肯定跑不过她。你指出自己只是来交作业，她却说这正好证明你缺乏随时接受挑战的准备。她抱着手臂站在那里，自信得仿佛比赛已经结束，获胜感言都提前想好了。',
    '你问她为什么如此认真。小君说生活偶尔需要一点较量，否则连下楼梯都会失去节奏感。她还从口袋里掏出一张折得整整齐齐的纸，坚称那不是提前准备，只是恰巧携带了适合记录约定的文具。',
    '风把纸角吹得哗哗响，小君用手按住，催你给个痛快回答。你可以陪她玩一次，也可以搬出校规与安全教育，还可以表现得比她更加认真。旁边体育老师完全不知道一场气势很足的私人较量即将成立。'],optionText:['接受挑战','我还是算了','那就认真一点'],after:[
    '你点头接受。小君立刻在纸上写下你的名字，熟练得让人怀疑这不是她今天第一次临时起意。她把纸折好，提醒你别到时候装作忘记。你嘴上答应得轻松，心里已经怀疑自己是不是点头太快。',
    '你郑重表示自己今天只想做个安静守规矩的学生。小君愣了一下，说这句话很像班会课标准答案。她没再劝，只邀请你普通地跑一圈。你立刻想起作业还没交，成功用学习理由避开体育活动。',
    '你反过来表示既然要比，就别弄得像课间小游戏。小君眼睛一亮，迅速在纸上加了两个感叹号。你看着那两个笔画有力的符号，忽然意识到自己可能亲手把一件小事推向了不必要的认真。']},
  early_submission:{desc:'公告栏上贴着一张画风奇怪的考场海报。',dialogue:[
    '走廊公告栏上多了一张海报，右下角画着一个冲出考场的小人。动作很有气势，鞋带却明显没系好。你盯着看了几秒，分不清画手是在赞美勇气，还是委婉提醒大家离开座位前先检查脚下。',
    '海报中间的字写得很有煽动力，旁边还盖着一个看不清属于哪个部门的印章。公告栏后方偶尔传来轻微响动，像有人躲在那里观察路人的表情，也可能只是值日生把扫帚靠得不太稳。',
    '走廊里一时没有别人，风却很配合地把纸张吹得啪啪作响。你总觉得这件事背后有人等着看热闹。现在可以揭下旁边的回执，也可以保持低调，假装自己停在这里只是为了研究公告栏的木纹。'],optionText:['接下','不了不了，我社恐'],after:[
    '你揭下回执，写上名字。笔尖落下的一瞬间，公告栏后面传来一声很轻的“好耶”。等你绕过去查看，那里只有一把扫帚安静靠墙。你决定不追究声音来源，毕竟扫帚看起来也没有解释的意思。',
    '你后退半步，礼貌地对海报摇了摇头。转身离开时，纸张被风吹得啪啪作响，像在进行最后挽留。没有人追上来，只有那张海报越来越远，而你走路的速度比平时稍微快了一点。']},
  lottery:{desc:'校园角落支起了一张挂着彩旗的小桌。',dialogue:[
    '校园角落支起一张挂着彩旗的小桌，桌上摆着号码纸、彩笔和一只透明盒子。看摊的人面带微笑，身后的横幅只有一句话，字写得很大，内容却像随口的鼓励，让经过的人总忍不住多看两眼。',
    '几名同学围在旁边认真研究数字。有人参考生日，有人参考座位，还有人观察今天先迈进教室的是左脚还是右脚。每个人都像掌握了独门规律，彼此询问时却立刻把纸捂住，保密工作做得比考试答案还严。',
    '工作人员把一支笔推到你面前，没有催促。透明盒子安静地反着光，看起来既神秘又完全不打算提供线索。你可以坐下来挑一串顺眼的号码，也可以继续往前走，把热闹留给更相信直觉的人。'],optionText:['挑一组号码','离开'],after:[
    '你接过笔，忽然发现每一个数字都长得很有潜力。旁边的人热心分享选号心得，说到最后却承认自己上次也是随手写的。你低头看着号码纸，决定至少让这一串数字排列得像经过认真思考。',
    '你把递来的笔轻轻推回去。工作人员没有挽留，只熟练地说欢迎下次再来。走出几步后，你听见身后有人为一串号码争论得十分投入，脚步不由得慢了一下，最终还是继续向前。']}
};
Object.entries(G.EVENT_STORY_REWRITE).forEach(([id,t])=>{let e=G.EVENTS[id];if(!e)return;e.desc=t.desc;e.dialogue=t.dialogue;(e.opts||[]).forEach((o,i)=>{if(id==='lottery')return;if(t.optionText&&t.optionText[i])o.text=t.optionText[i];o.afterText=(t.after||[])[i]||'';o.effDesc='';});});
G.EVENT_LIST = Object.keys(G.EVENTS);

// ==================== 书籍 ====================
// 编辑器中的统一对白配音表；按完整对白匹配教程与普通气泡。
G.DIALOGUE_AUDIO = {};

G.BOOKS = {
  "daxue": {
    "id": "daxue",
    "name": "大学",
    "emoji": "📕",
    "q": "green",
    "category": "four_books",
    "catName": "四书",
    "need": 20,
    "reward": {
      "eq": 5
    },
    "desc": "四书之一，修身齐家治国平天下"
  },
  "zhongyong": {
    "id": "zhongyong",
    "name": "中庸",
    "emoji": "📗",
    "q": "green",
    "category": "four_books",
    "catName": "四书",
    "need": 20,
    "reward": {
      "eq": 5
    },
    "desc": "不偏不倚，无过不及"
  },
  "lunyu": {
    "id": "lunyu",
    "name": "论语",
    "emoji": "📘",
    "q": "green",
    "category": "four_books",
    "catName": "四书",
    "need": 20,
    "reward": {
      "eq": 5
    },
    "desc": "学而时习之，不亦说乎"
  },
  "mengzi": {
    "id": "mengzi",
    "name": "孟子",
    "emoji": "📙",
    "q": "green",
    "category": "four_books",
    "catName": "四书",
    "need": 20,
    "reward": {
      "eq": 5
    },
    "desc": "民为贵，社稷次之，君为轻"
  },
  "shijing": {
    "id": "shijing",
    "name": "诗经",
    "emoji": "📓",
    "q": "blue",
    "category": "five_classics",
    "catName": "五经",
    "need": 40,
    "reward": {
      "intelligence": 3
    },
    "desc": "关关雎鸠，在河之洲"
  },
  "shangshu": {
    "id": "shangshu",
    "name": "尚书",
    "emoji": "📔",
    "q": "blue",
    "category": "five_classics",
    "catName": "五经",
    "need": 40,
    "reward": {
      "physique": 2
    },
    "desc": "上古历史文献汇编"
  },
  "liji": {
    "id": "liji",
    "name": "礼记",
    "emoji": "📒",
    "q": "blue",
    "category": "five_classics",
    "catName": "五经",
    "need": 40,
    "reward": {
      "eq": 3
    },
    "desc": "礼尚往来，往而不来非礼也"
  },
  "zhouyi": {
    "id": "zhouyi",
    "name": "周易",
    "emoji": "📑",
    "q": "blue",
    "category": "five_classics",
    "catName": "五经",
    "need": 40,
    "reward": {
      "intelligence": 3
    },
    "desc": "天行健，君子以自强不息"
  },
  "chunqiu": {
    "id": "chunqiu",
    "name": "春秋",
    "emoji": "📜",
    "q": "gold",
    "category": "five_classics",
    "catName": "五经",
    "need": 160,
    "reward": {
      "intelligence": 3,
      "physique": 1
    },
    "desc": "一字褒贬，微言大义"
  },
  "tangshi": {
    "id": "tangshi",
    "name": "唐诗三百首",
    "emoji": "📖",
    "q": "green",
    "category": "poetry",
    "catName": "诗词集",
    "need": 10,
    "reward": {
      "eq": 4
    },
    "desc": "熟读唐诗三百首"
  },
  "songci": {
    "id": "songci",
    "name": "宋词选",
    "emoji": "📚",
    "q": "green",
    "category": "poetry",
    "catName": "诗词集",
    "need": 20,
    "reward": {
      "eq": 4
    },
    "desc": "大江东去，浪淘尽"
  },
  "yuanqu": {
    "id": "yuanqu",
    "name": "元曲精选",
    "emoji": "🎭",
    "q": "gold",
    "category": "poetry",
    "catName": "诗词集",
    "need": 160,
    "reward": {
      "intelligence": 2,
      "eq": 2
    },
    "desc": "枯藤老树昏鸦"
  },
  "shuxue": {
    "id": "shuxue",
    "name": "数学原理",
    "emoji": "🔢",
    "q": "purple",
    "category": "science",
    "catName": "理科丛书",
    "need": 80,
    "reward": {
      "intelligence": 4
    },
    "desc": "逻辑之美"
  },
  "wuli": {
    "id": "wuli",
    "name": "物理世界",
    "emoji": "⚛️",
    "q": "purple",
    "category": "science",
    "catName": "理科丛书",
    "need": 80,
    "reward": {
      "intelligence": 4
    },
    "desc": "给我一个支点"
  },
  "huaxue": {
    "id": "huaxue",
    "name": "化学元素",
    "emoji": "🧪",
    "q": "gold",
    "category": "science",
    "catName": "理科丛书",
    "need": 160,
    "reward": {
      "intelligence": 2,
      "physique": 2
    },
    "desc": "万物皆由元素构成"
  },
  "xiezuo": {
    "id": "xiezuo",
    "name": "写作指南",
    "emoji": "✍️",
    "q": "green",
    "category": "literature",
    "catName": "文学写作",
    "need": 10,
    "reward": {
      "eq": 3
    },
    "desc": "好文章是改出来的"
  },
  "xiuci": {
    "id": "xiuci",
    "name": "修辞学",
    "emoji": "💬",
    "q": "green",
    "category": "literature",
    "catName": "文学写作",
    "need": 10,
    "reward": {
      "intelligence": 2,
      "eq": 2
    },
    "desc": "让文字更有力量"
  },
  "wenxue": {
    "id": "wenxue",
    "name": "文学名著导读",
    "emoji": "📚",
    "q": "blue",
    "category": "literature",
    "catName": "文学写作",
    "need": 40,
    "reward": {
      "eq": 3
    },
    "desc": "读万卷书，行万里路"
  },
  "dizigui": {
    "id": "dizigui",
    "name": "弟子规",
    "emoji": "📕",
    "q": "green",
    "category": "mengxue",
    "catName": "启蒙读物",
    "need": 20,
    "reward": {
      "eq": 1,
      "card": "dizigui"
    },
    "desc": "首孝悌，次谨信；泛爱众，而亲仁"
  },
  "luoshengmen": {
    "id": "luoshengmen",
    "name": "罗生门",
    "emoji": "🗡️",
    "q": "purple",
    "category": "mingzhu",
    "catName": "世界名著",
    "need": 20,
    "reward": {
      "card": "dragon_novel"
    },
    "desc": "人心的修罗场，真相与刀光同在"
  },
  "zhaohuaxishi": {
    "id": "zhaohuaxishi",
    "name": "朝花夕拾",
    "emoji": "🌺",
    "q": "purple",
    "category": "mingzhu",
    "catName": "世界名著",
    "need": 20,
    "reward": {
      "card": "ring_novel"
    },
    "desc": "旧时的花瓣落回掌心，护住此刻的你"
  },
  "balishengmuyuan": {
    "id": "balishengmuyuan",
    "name": "巴黎圣母院",
    "emoji": "⛪",
    "q": "gold",
    "category": "mingzhu",
    "catName": "世界名著",
    "need": 40,
    "reward": {
      "card": "galaxy_novel"
    },
    "desc": "玫瑰花窗之下，先攒下满襟星光"
  }
};
// 扩展书籍池：新增20本可随机获得、可在书架携带书籍卡的书籍。
Object.assign(G.BOOKS,{
  sanzi:{id:'sanzi',name:'三字经',emoji:'📕',q:'green',category:'mengxue',catName:'启蒙读物',need:20,reward:{intelligence:1},desc:'三字成句，启蒙入门，先把知识读得朗朗上口。'},
  qianzi:{id:'qianzi',name:'千字文',emoji:'📗',q:'green',category:'mengxue',catName:'启蒙读物',need:20,reward:{eq:1},desc:'一千个字排队报到，考验记忆，也考验耐心。'},
  shangxia:{id:'shangxia',name:'上下五千年',emoji:'📘',q:'green',category:'history',catName:'历史读物',need:30,reward:{intelligence:1},desc:'历史很长，考试很短，先记住几个关键转折。'},
  guoyu:{id:'guoyu',name:'国语入门',emoji:'🗣️',q:'green',category:'language',catName:'语言读物',need:30,reward:{eq:1},desc:'把想说的话说清楚，已经赢过一半的作文开头。'},
  chengyu:{id:'chengyu',name:'成语词典',emoji:'📚',q:'green',category:'language',catName:'语言读物',need:30,reward:{intelligence:1},desc:'四个字里藏着一段故事，也藏着一个容易写错的字。'},
  shiji:{id:'shiji',name:'史记选读',emoji:'🏺',q:'blue',category:'history',catName:'历史读物',need:50,reward:{intelligence:1},desc:'人物会犯错，记录会留下，考试也会突然考到。'},
  zizhitongjian:{id:'zizhitongjian',name:'资治通鉴',emoji:'🪞',q:'blue',category:'history',catName:'历史读物',need:60,reward:{intelligence:1},desc:'以史为镜，照见昨天，也照见自己没背熟的那一页。'},
  taipingguangji:{id:'taipingguangji',name:'太平广记',emoji:'🕯️',q:'blue',category:'story',catName:'故事集',need:50,reward:{eq:1},desc:'奇闻很多，睡意也很多，适合在深夜进行精神冒险。'},
  guwen:{id:'guwen',name:'古文观止',emoji:'🖋️',q:'blue',category:'literature',catName:'文学写作',need:50,reward:{intelligence:1},desc:'古人的文章很稳，你的标点符号还在努力。'},
  tangsong:{id:'tangsong',name:'唐宋八大家',emoji:'🪶',q:'blue',category:'literature',catName:'文学写作',need:50,reward:{eq:1},desc:'八位大家轮流登场，负责把你的作文气势抬高。'},
  shanhai:{id:'shanhai',name:'山海经',emoji:'🐉',q:'blue',category:'story',catName:'奇闻异志',need:60,reward:{intelligence:1},desc:'每一页都有新怪物，像一场没有提前发卷的考试。'},
  liaozhai:{id:'liaozhai',name:'聊斋志异',emoji:'🦊',q:'purple',category:'story',catName:'奇闻异志',need:80,reward:{eq:1},desc:'夜里读得认真，白天走路会忍不住观察墙角。'},
  xiyouji:{id:'xiyouji',name:'西游记',emoji:'🍑',q:'purple',category:'novel',catName:'名著小说',need:80,reward:{physique:1},desc:'一路打怪，一路成长，偶尔还要处理队友分歧。'},
  sanguo:{id:'sanguo',name:'三国演义',emoji:'⚔️',q:'purple',category:'novel',catName:'名著小说',need:80,reward:{intelligence:1},desc:'谋略、胆量与临场发挥，三种考试常见能力齐聚。'},
  honglou:{id:'honglou',name:'红楼梦',emoji:'🌸',q:'purple',category:'novel',catName:'名著小说',need:100,reward:{eq:1},desc:'人情世故写得细，连沉默都有自己的分量。'},
  shuihu:{id:'shuihu',name:'水浒传',emoji:'🏮',q:'purple',category:'novel',catName:'名著小说',need:90,reward:{physique:1},desc:'路见不平先别急着出手，看看手里有没有护盾。'},
  haizi:{id:'haizi',name:'海子的诗',emoji:'🌾',q:'purple',category:'poetry',catName:'诗歌集',need:70,reward:{eq:1},desc:'面朝大海之前，先把今天的作业写完。'},
  riyong:{id:'riyong',name:'生活中的数学',emoji:'📐',q:'purple',category:'science',catName:'理科丛书',need:70,reward:{intelligence:1},desc:'买零食、算折扣、分蛋糕，全都需要一点数学。'},
  shijie:{id:'shijie',name:'科学小史',emoji:'🔭',q:'purple',category:'science',catName:'理科丛书',need:80,reward:{intelligence:1},desc:'每个结论背后都有试错，像极了你第一次做综合题。'},
  wenda:{id:'wenda',name:'人类简史',emoji:'🌍',q:'gold',category:'history',catName:'历史读物',need:120,reward:{eq:1},desc:'人类一路走来，最终还是要面对明天的考试。'}
});
G.BOOK_LIST = Object.keys(G.BOOKS);
// 所有书籍读完统一只给予1点对应属性；已设计书籍卡的书继续解锁对应卡牌。
for(let book of Object.values(G.BOOKS)) {
  book.need=40;
  let old=book.reward||{},stat=old.intelligence?'intelligence':(old.physique?'physique':'eq');
  book.reward={[stat]:1};
  if(old.card)book.reward.card=old.card;
}
// 扩展书籍卡：每本正式书籍都有一张可在书架携带的专属卡。
Object.assign(G.CARDS,{
  book_daxue:{id:'book_daxue',name:'格物致知',type:'idea',cost:1,q:'green',desc:'摸2张牌，然后获得1层【理性】。',drawCards:2,status:{rationality:1}},
  book_zhongyong:{id:'book_zhongyong',name:'不偏不倚',type:'idea',cost:1,q:'green',desc:'获得1层【理性】与1层【感性】。',status:{rationality:1,sensibility:1}},
  book_lunyu:{id:'book_lunyu',name:'温故知新',type:'idea',cost:1,q:'green',desc:'摸1张牌，回复1点体力。',drawCards:1,energyRestore:1},
  book_mengzi:{id:'book_mengzi',name:'浩然之气',type:'logic',cost:2,q:'green',desc:'造成1倍情商伤害，并获得1倍情商护盾。',dmgStat:'eq',dmgMult:1,shieldStat:'eq',shieldMult:1},
  book_shijing:{id:'book_shijing',name:'关雎',type:'idea',cost:1,q:'blue',desc:'获得2层【感性】，并摸1张牌。',status:{sensibility:2},drawCards:1},
  book_shangshu:{id:'book_shangshu',name:'以史为鉴',type:'idea',cost:1,q:'blue',desc:'获得2层【无视】与8点护盾。',status:{wushi:2},fixedShield:8},
  book_liji:{id:'book_liji',name:'礼尚往来',type:'logic',cost:1,q:'blue',desc:'造成0.8倍情商伤害，并回复5点生命。',dmgStat:'eq',dmgMult:.8,healFixed:5},
  book_zhouyi:{id:'book_zhouyi',name:'否极泰来',type:'idea',cost:0,q:'blue',desc:'回复1点体力，获得1层【精准】。【移除】',energyRestore:1,status:{accuracy:1},exhaust:true},
  book_chunqiu:{id:'book_chunqiu',name:'一字褒贬',type:'answer',cost:3,q:'purple',desc:'造成2倍智力伤害；若本回合使用过思路卡，改为3倍。',dmgStat:'intelligence',dmgMult:2,multAfterIdea:3},
  book_tangshi:{id:'book_tangshi',name:'诗兴大发',type:'idea',cost:1,q:'green',desc:'获得2层【感性】。',status:{sensibility:2}},
  book_songci:{id:'book_songci',name:'大江东去',type:'logic',cost:2,q:'green',desc:'造成1.5倍情商伤害。',dmgStat:'eq',dmgMult:1.5},
  book_yuanqu:{id:'book_yuanqu',name:'人间一折',type:'answer',cost:3,q:'purple',desc:'造成1倍全属性伤害，重复2次。',dmgStat:'all',dmgMult:1,hits:2},
  book_shuxue:{id:'book_shuxue',name:'公理',type:'logic',cost:2,q:'purple',desc:'造成2倍智力伤害，获得2层【理性】。',dmgStat:'intelligence',dmgMult:2,status:{rationality:2}},
  book_wuli:{id:'book_wuli',name:'支点',type:'logic',cost:2,q:'purple',desc:'造成1.5倍智力伤害，并获得1.5倍智力护盾。',dmgStat:'intelligence',dmgMult:1.5,shieldStat:'intelligence',shieldMult:1.5},
  book_huaxue:{id:'book_huaxue',name:'剧烈反应',type:'answer',cost:3,q:'purple',desc:'造成0.8倍智力伤害，重复4次。',dmgStat:'intelligence',dmgMult:.8,hits:4},
  book_xiezuo:{id:'book_xiezuo',name:'删繁就简',type:'idea',cost:0,q:'green',desc:'摸1张牌，下一张逻辑卡消耗-1。',drawCards:1,buffNextLogicCost:-1},
  book_xiuci:{id:'book_xiuci',name:'妙笔生花',type:'logic',cost:1,q:'green',desc:'造成1倍情商伤害，获得1层【灵感】。',dmgStat:'eq',dmgMult:1,status:{inspiration:1}},
  book_wenxue:{id:'book_wenxue',name:'入戏',type:'idea',cost:2,q:'blue',desc:'获得3层【感性】并摸2张牌。',status:{sensibility:3},drawCards:2},
  book_sanzi:{id:'book_sanzi',name:'启蒙三句',type:'idea',cost:0,q:'green',desc:'获得1层【理性】，摸1张牌。',status:{rationality:1},drawCards:1},
  book_qianzi:{id:'book_qianzi',name:'千字成章',type:'logic',cost:1,q:'green',desc:'造成0.8倍智力伤害。',dmgStat:'intelligence',dmgMult:.8},
  book_shangxia:{id:'book_shangxia',name:'时光回看',type:'idea',cost:1,q:'green',desc:'摸1张牌，获得4点护盾。',drawCards:1,fixedShield:4},
  book_guoyu:{id:'book_guoyu',name:'出口成章',type:'logic',cost:1,q:'green',desc:'造成0.7倍情商伤害，并获得0.4倍情商护盾。',dmgStat:'eq',dmgMult:.7,shieldStat:'eq',shieldMult:.4},
  book_chengyu:{id:'book_chengyu',name:'妙语连珠',type:'idea',cost:1,q:'green',desc:'获得1层【感性】，回复1点体力。',status:{sensibility:1},energyRestore:1},
  book_shiji:{id:'book_shiji',name:'史笔如刀',type:'logic',cost:2,q:'blue',desc:'造成1.2倍智力伤害。',dmgStat:'intelligence',dmgMult:1.2},
  book_zizhitongjian:{id:'book_zizhitongjian',name:'前车之鉴',type:'idea',cost:2,q:'blue',desc:'获得2层【理性】与6点护盾。',status:{rationality:2},fixedShield:6},
  book_taipingguangji:{id:'book_taipingguangji',name:'奇闻轶事',type:'idea',cost:1,q:'blue',desc:'摸2张牌，然后获得1层【感性】。',drawCards:2,status:{sensibility:1}},
  book_guwen:{id:'book_guwen',name:'古意成文',type:'logic',cost:2,q:'blue',desc:'造成1倍情商伤害，获得1层【认真】。',dmgStat:'eq',dmgMult:1,status:{serious:1}},
  book_tangsong:{id:'book_tangsong',name:'八面文章',type:'answer',cost:3,q:'blue',desc:'造成1.4倍全属性伤害。',dmgStat:'all',dmgMult:1.4},
  book_shanhai:{id:'book_shanhai',name:'异兽图鉴',type:'logic',cost:2,q:'blue',desc:'造成1倍智力伤害，并弃置对手1张手牌。',dmgStat:'intelligence',dmgMult:1,discardMonsterHand:1},
  book_liaozhai:{id:'book_liaozhai',name:'狐灯夜话',type:'idea',cost:1,q:'purple',desc:'获得2层【感性】与2层【霜蝶】。',status:{sensibility:2,shuangdie:2}},
  book_xiyouji:{id:'book_xiyouji',name:'七十二变',type:'answer',cost:3,q:'purple',desc:'造成1倍全属性伤害，重复2次。',dmgStat:'all',dmgMult:1,hits:2},
  book_sanguo:{id:'book_sanguo',name:'三分天下',type:'answer',cost:3,q:'purple',desc:'造成1.5倍智力伤害。',dmgStat:'intelligence',dmgMult:1.5},
  book_honglou:{id:'book_honglou',name:'花影入梦',type:'idea',cost:2,q:'purple',desc:'回复3点生命，获得2层【感性】。',healFixed:3,status:{sensibility:2}},
  book_shuihu:{id:'book_shuihu',name:'义气护身',type:'idea',cost:1,q:'purple',desc:'获得1倍体魄护盾，并获得1层【认真】。',shieldStat:'physique',shieldMult:1,status:{serious:1}},
  book_haizi:{id:'book_haizi',name:'面朝大海',type:'idea',cost:0,q:'purple',desc:'获得2层【感性】，本回合下一张逻辑卡消耗-1。',status:{sensibility:2},buffNextLogicCost:-1},
  book_riyong:{id:'book_riyong',name:'算清生活',type:'logic',cost:1,q:'purple',desc:'造成1倍智力伤害，并获得8点护盾。',dmgStat:'intelligence',dmgMult:1,fixedShield:8},
  book_shijie:{id:'book_shijie',name:'发现新知',type:'idea',cost:1,q:'purple',desc:'摸1张牌，获得1层【理性】与1层【精准】。',drawCards:1,status:{rationality:1,accuracy:1}},
  book_wenda:{id:'book_wenda',name:'漫长旅程',type:'answer',cost:4,q:'gold',desc:'造成2倍全属性伤害，并回复2点生命。',dmgStat:'all',dmgMult:2,healFixed:2}
});
let expandedBookCards={daxue:'book_daxue',zhongyong:'book_zhongyong',lunyu:'book_lunyu',mengzi:'book_mengzi',shijing:'book_shijing',shangshu:'book_shangshu',liji:'book_liji',zhouyi:'book_zhouyi',chunqiu:'book_chunqiu',tangshi:'book_tangshi',songci:'book_songci',yuanqu:'book_yuanqu',shuxue:'book_shuxue',wuli:'book_wuli',huaxue:'book_huaxue',xiezuo:'book_xiezuo',xiuci:'book_xiuci',wenxue:'book_wenxue',sanzi:'book_sanzi',qianzi:'book_qianzi',shangxia:'book_shangxia',guoyu:'book_guoyu',chengyu:'book_chengyu',shiji:'book_shiji',zizhitongjian:'book_zizhitongjian',taipingguangji:'book_taipingguangji',guwen:'book_guwen',tangsong:'book_tangsong',shanhai:'book_shanhai',liaozhai:'book_liaozhai',xiyouji:'book_xiyouji',sanguo:'book_sanguo',honglou:'book_honglou',shuihu:'book_shuihu',haizi:'book_haizi',riyong:'book_riyong',shijie:'book_shijie',wenda:'book_wenda'};
for(let [bid,cid] of Object.entries(expandedBookCards))if(G.BOOKS[bid])G.BOOKS[bid].reward.card=cid;
G.bookCardEffectText=function(book){let ref=book&&book.reward&&book.reward.card,cd=ref&&G.getCardData(ref);return cd?`【${cd.name}】：${cd.desc}`:'暂无书籍卡效果';};

// ==================== 卡牌道具 ====================
// 道具购买后绑定到一种卡牌；每种卡牌可携带任意数量的不同道具，同一道具不可重复。
G.CARD_ITEMS = {
  "初心奖章": {id:"初心奖章",name:"不忘初心奖章",q:"blue",emoji:"🏅",desc:"为卡牌添加【如初】。",ruchu:true},
  "减法套装": {id:"减法套装",name:"减法套装",q:"blue",emoji:"➖",desc:"卡牌消耗-1。",costDelta:-1},
  "点读笔": {id:"点读笔",name:"点读笔",q:"green",emoji:"🖊️",desc:"打出该卡牌时，额外造成0.8倍智力伤害。",bonusDamage:{stat:"intelligence",mult:0.8}},
  "听力学习": {id:"听力学习",name:"听力学习",q:"green",emoji:"🎧",desc:"打出该卡牌时，额外造成0.8倍情商伤害。",bonusDamage:{stat:"eq",mult:0.8}},
  "哑铃": {id:"哑铃",name:"哑铃",q:"green",emoji:"🏋️",desc:"打出该卡牌时，额外造成0.8倍体魄伤害。",bonusDamage:{stat:"physique",mult:0.8}},
  "茶杯": {id:"茶杯",name:"茶杯",q:"green",emoji:"🍵",desc:"打出该牌，获得0.8倍体魄护盾。",playShield:{stat:"physique",mult:0.8}},
  "倒刺": {id:"倒刺",name:"倒刺",q:"blue",emoji:"🪝",desc:"打出该牌，弃置对方一张手牌。",discardEnemy:1},
  "毛笔": {id:"毛笔",name:"毛笔",q:"blue",emoji:"🖌️",desc:"打出该牌，额外造成0.4倍智力伤害。",bonusDamage:{stat:"intelligence",mult:0.4}},
  "自动笔": {id:"自动笔",name:"自动笔",q:"blue",emoji:"✒️",desc:"摸到这张牌时，无消耗打出。",autoPlayOnDraw:true},
  "回形针": {id:"回形针",name:"回形针",q:"blue",emoji:"📎",desc:"为该牌添加【脱手】。",tuoshou:true},
  "扑克牌": {id:"扑克牌",name:"扑克牌",q:"purple",emoji:"🃏",desc:"打出该牌时，随机获得1—12零花钱。",randomGold:[1,12]},
  "存钱罐": {id:"存钱罐",name:"存钱罐",q:"purple",emoji:"🐷",desc:"该牌在手中时，回合结束储存5零花钱；离开手牌后获得储存的所有零花钱。",piggyBank:true},
  "沙漏": {id:"沙漏",name:"沙漏",q:"purple",emoji:"⌛",desc:"该牌打出后，获得一张复制原牌效果的【闪】复制。",halfFlashCopy:true},
  "蕾丝边手套": {id:"蕾丝边手套",name:"蕾丝边手套",q:"purple",emoji:"🧤",desc:"该牌在最右侧打出时，将最左侧卡牌无消耗打出。",playLeftmostIfRightmost:true},
  "竹笛": {id:"竹笛",name:"竹笛",q:"purple",emoji:"🎋",desc:"为该牌添加【回响】。",echo:true},
  "删除键": {id:"删除键",name:"删除键",q:"purple",emoji:"⌫",desc:"为该牌添加【移除】；打出该牌时造成1倍全属性伤害。",exhaust:true,bonusDamage:{stat:"all",mult:1}},
  "费列罗": {id:"费列罗",name:"费列罗",q:"gold",emoji:"🍫",desc:"每回合限一次：打出该牌后，体力回复至上限，然后本回合所有手牌消耗-1。",ferrero:true},
  "围巾": {id:"围巾",name:"围巾",q:"gold",emoji:"🧣",desc:"打出该牌时，获得等同于生命值的护盾；然后本场战斗所有护盾量提升20%，本次也会提升。",scarf:true},
  "铅笔帽":{id:"铅笔帽",name:"铅笔帽",q:"green",emoji:"🟢",desc:"打出该牌时，回复4点生命。",healFixed:4},
  "便利贴":{id:"便利贴",name:"便利贴",q:"green",emoji:"🗒️",desc:"打出该牌后，若手牌不超过2张，摸1张牌。",drawIfLow:{hand:2,count:1}},
  "橡皮筋":{id:"橡皮筋",name:"橡皮筋",q:"green",emoji:"⭕",desc:"打出该牌时，若其消耗至少为2，回复1点体力。",energyIfCost:{cost:2,gain:1}},
  "订书机":{id:"订书机",name:"订书机",q:"blue",emoji:"📎",desc:"每场战斗第一次打出该牌时，在手中生成1张【闪】复制。",firstFlashCopy:true},
  "放大镜":{id:"放大镜",name:"放大镜",q:"blue",emoji:"🔍",desc:"打出该牌时，若敌方拥有护盾，额外造成0.8倍智力真实伤害。",trueIfShield:.8},
  "指南针":{id:"指南针",name:"指南针",q:"blue",emoji:"🧭",desc:"打出该牌时，获得等同于自身最高属性的护盾。",shieldHighest:1},
  "时光胶囊":{id:"时光胶囊",name:"时光胶囊",q:"purple",emoji:"⏳",desc:"打出该牌后，下回合生成1张消耗为0的【临时】复制。",timeCapsule:true},
  "纠错带":{id:"纠错带",name:"纠错带",q:"purple",emoji:"🧻",desc:"打出该牌时，从弃牌堆取回最近打出的另一种卡牌。",retrievePrevious:true},
  "万花筒":{id:"万花筒",name:"万花筒",q:"purple",emoji:"🔮",desc:"打出该牌时，获得1倍最高属性护盾。",kaleidoscope:1}
};

// ==================== 小卖部 ====================
G.SHOP_PRICING = {
  "item": {
    "green": 40,
    "white": 40,
    "blue": 80,
    "purple": 160,
    "gold": 320
  },
  "card": {
    "green": 10,
    "white": 10,
    "blue": 20,
    "purple": 40,
    "gold": 100
  },
  "book": {
    "green": 10,
    "white": 20,
    "blue": 40,
    "purple": 80,
    "gold": 160
  },
  "talent": {
    "green": 40,
    "white": 80,
    "blue": 160,
    "purple": 320,
    "gold": 640
  }
};
G.QUAL_LADDER = [
  "green",
  "blue",
  "purple",
  "gold"
]; // 绿→金 由低到高
// 天赋、卡牌、道具共用的六学期品质基础权重。
G.SEMESTER_QUALITY_WEIGHTS = [
  {green:60,blue:35,purple:5,gold:0},
  {green:40,blue:50,purple:10,gold:0},
  {green:20,blue:60,purple:20,gold:0},
  {green:5,blue:70,purple:25,gold:0},
  {green:0,blue:65,purple:30,gold:5},
  {green:0,blue:40,purple:50,gold:10}
];
G.qualityWeightFor = function(q) {
  let ch=Math.max(1,Math.min(6,(G.state&&G.state.chapter)||1));
  let w=(G.SEMESTER_QUALITY_WEIGHTS[ch-1]||{})[q]||0;
  if(q==='purple'||q==='gold')w*=1+Math.floor(((G.state&&G.state.intelligence)||0)/10)*.05;
  if((G.state&&G.state.character&&G.state.character.id==='menghuaian')&&G.state.star>=2&&(q==='purple'||q==='gold'))w+=5;
  return w;
};
G.pickSemesterQuality = function(available) {
  let pool=[...new Set((available||G.QUAL_LADDER).filter(q=>G.QUAL_LADDER.includes(q)))];
  let legal=pool.filter(q=>G.qualityWeightFor(q)>0);
  if(!legal.length)legal=pool;
  return legal.length?G.pickWeighted(legal,legal.map(q=>Math.max(1,G.qualityWeightFor(q)))):null;
};
G.pickEntryBySemesterQuality = function(entries, qualityOf) {
  let list=(entries||[]).filter(Boolean);if(!list.length)return null;
  let getQ=qualityOf||((x)=>x.q||'green'),q=G.pickSemesterQuality(list.map(getQ));
  let same=list.filter(x=>getQ(x)===q);
  return G.pick(same.length?same:list);
};
G.TALENT_Q = {
  "common": "green",
  "uncommon": "blue",
  "epic": "purple",
  "rare": "gold"
};
G.SHOP_DELETE_BASE = 30;
G.SHOP_HEAL_LOST = 0.2;
G.SHOP_HEAL_MAX = 0.1;

// ==================== 套书羁绊 ====================
G.BONDS = {
  "four_books": {
    "id": "four_books",
    "name": "四书",
    "emoji": "📚",
    "books": [
      "daxue",
      "zhongyong",
      "lunyu",
      "mengzi"
    ],
    "effect": "使用思路卡时获得2层感性",
    "effectType": "idea_sensibility",
    "effectVal": 2
  },
  "five_classics": {
    "id": "five_classics",
    "name": "五经",
    "emoji": "📖",
    "books": [
      "shijing",
      "shangshu",
      "liji",
      "zhouyi",
      "chunqiu"
    ],
    "effect": "每场战斗开局多摸1张牌",
    "effectType": "bonus_draw",
    "effectVal": 1
  },
  "poetry": {
    "id": "poetry",
    "name": "诗词集",
    "emoji": "🎵",
    "books": [
      "tangshi",
      "songci",
      "yuanqu"
    ],
    "effect": "思路卡体力消耗-1",
    "effectType": "idea_cost_reduce",
    "effectVal": 1
  },
  "science": {
    "id": "science",
    "name": "理科丛书",
    "emoji": "🔬",
    "books": [
      "shuxue",
      "wuli",
      "huaxue"
    ],
    "effect": "逻辑卡伤害+1",
    "effectType": "logic_dmg_bonus",
    "effectVal": 1
  },
  "literature": {
    "id": "literature",
    "name": "文学写作",
    "emoji": "✒️",
    "books": [
      "xiezuo",
      "xiuci",
      "wenxue"
    ],
    "effect": "使用解答卡后摸1张牌",
    "effectType": "answer_draw",
    "effectVal": 1
  }
};

// ==================== 小雅特供小说 ====================
G.NOVELS = [
  {
    "id": "longzu",
    "card": "dragon_novel",
    "name": "罗生门"
  },
  {
    "id": "mojie",
    "card": "ring_novel",
    "name": "朝花夕拾"
  },
  {
    "id": "yinhe",
    "card": "galaxy_novel",
    "name": "巴黎圣母院"
  }
];
G.NOVEL_CARD = {};
G.NOVELS.forEach(n => { G.NOVEL_CARD[n.card] = n.id; });

// ==================== 怪物 ====================
G.MONSTERS = {
  "chengyu": {
    "id": "chengyu",
    "name": "成语填空",
    "subject": "语文",
    "emoji": "📝",
    "hp": 12,
    "intelligence": 4,
    "eq": 0,
    "deck": [
      {
        "name": "缺一字",
        "type": "logic",
        "desc": "0.6倍智力伤害",
        "dmgStat": "intelligence",
        "dmgMult": 0.6,
        "cost": 0
      },
      {
        "name": "望文生义",
        "type": "idea",
        "desc": "弃置对方1张手牌（随机）",
        "mDiscardPlayer": 1,
        "cost": 1
      },
      {
        "name": "张冠李戴",
        "type": "logic",
        "desc": "1.5倍智力伤害，若对方本回合弃过牌则2.5倍",
        "dmgStat": "intelligence",
        "dmgMult": 1.5,
        "dmgMultIfPlayerDiscarded": 2.5,
        "cost": 2
      },
      {
        "name": "一字千金",
        "type": "logic",
        "desc": "1.8倍智力伤害",
        "dmgStat": "intelligence",
        "dmgMult": 1.8,
        "cost": 2
      },
      {
        "name": "凿壁偷光",
        "type": "logic",
        "desc": "0.5倍智力×2次",
        "dmgStat": "intelligence",
        "dmgMult": 0.5,
        "hits": 2,
        "cost": 0
      }
    ]
  },
  "jitu": {
    "id": "jitu",
    "name": "鸡兔同笼",
    "subject": "数学",
    "emoji": "🐔",
    "hp": 10,
    "intelligence": 3,
    "eq": 0,
    "deck": [
      {
        "name": "爪击",
        "type": "logic",
        "desc": "一半智力伤害",
        "dmgStat": "intelligence",
        "dmgMult": 0.5,
        "cost": 0
      },
      {
        "name": "数数",
        "type": "logic",
        "desc": "1倍智力伤害",
        "dmgStat": "intelligence",
        "dmgMult": 1,
        "cost": 2
      },
      {
        "name": "大喊",
        "type": "idea",
        "desc": "弃置对方1张牌",
        "mDiscardPlayer": 1,
        "cost": 1
      },
      {
        "name": "金鸡独立",
        "type": "logic",
        "desc": "0.8倍智力伤害",
        "dmgStat": "intelligence",
        "dmgMult": 0.8,
        "cost": 1
      },
      {
        "name": "三足鼎立",
        "type": "logic",
        "desc": "1.2倍智力×2次",
        "dmgStat": "intelligence",
        "dmgMult": 1.2,
        "hits": 2,
        "cost": 2
      }
    ]
  },
  "danci": {
    "id": "danci",
    "name": "单词拼写",
    "subject": "英语",
    "emoji": "🔤",
    "hp": 11,
    "intelligence": 3,
    "eq": 0,
    "deck": [
      {
        "name": "字母填空",
        "type": "logic",
        "desc": "0.5智力×2次",
        "dmgStat": "intelligence",
        "dmgMult": 0.5,
        "hits": 2,
        "cost": 0
      },
      {
        "name": "词缀变化",
        "type": "idea",
        "desc": "下张逻辑卡+2伤害",
        "mNextLogicBonus": 2,
        "cost": 1
      },
      {
        "name": "拼写规则",
        "type": "idea",
        "desc": "对方弃1张手牌，无手牌则受3伤害",
        "mDiscardPlayerOrDmg": 3,
        "cost": 1
      },
      {
        "name": "高分作文",
        "type": "logic",
        "desc": "2倍智力伤害",
        "dmgStat": "intelligence",
        "dmgMult": 2,
        "cost": 2
      },
      {
        "name": "词根拆解",
        "type": "logic",
        "desc": "0.4倍智力×3次",
        "dmgStat": "intelligence",
        "dmgMult": 0.4,
        "hits": 3,
        "cost": 2
      }
    ]
  },
  "lixue": {
    "id": "lixue",
    "name": "力学计算",
    "subject": "物理",
    "emoji": "⚡",
    "hp": 16,
    "intelligence": 4,
    "eq": 0,
    "deck": [
      {
        "name": "牛顿定律",
        "type": "logic",
        "desc": "1.5倍智力伤害",
        "dmgStat": "intelligence",
        "dmgMult": 1.5,
        "cost": 1
      },
      {
        "name": "摩擦力",
        "type": "idea",
        "desc": "获得4护盾",
        "mShield": 4,
        "cost": 1
      },
      {
        "name": "重力势能",
        "type": "logic",
        "desc": "1倍智力+自身护盾值伤害",
        "dmgStat": "intelligence",
        "dmgMult": 1,
        "dmgPlusOwnShield": true,
        "cost": 1
      },
      {
        "name": "杠杆原理",
        "type": "logic",
        "desc": "0.6倍智力×3次",
        "dmgStat": "intelligence",
        "dmgMult": 0.6,
        "hits": 3,
        "cost": 2
      },
      {
        "name": "万有引力",
        "type": "logic",
        "desc": "2倍智力伤害",
        "dmgStat": "intelligence",
        "dmgMult": 2,
        "cost": 2
      }
    ]
  },
  "fangcheng": {
    "id": "fangcheng",
    "name": "化学方程式",
    "subject": "化学",
    "emoji": "🧪",
    "hp": 13,
    "intelligence": 3,
    "eq": 0,
    "deck": [
      {
        "name": "配平",
        "type": "idea",
        "desc": "摸2弃2",
        "mDraw": 2,
        "mSelfDiscard": 2,
        "cost": 0
      },
      {
        "name": "反应物",
        "type": "logic",
        "desc": "1倍智力伤害",
        "dmgStat": "intelligence",
        "dmgMult": 1,
        "cost": 1
      },
      {
        "name": "生成物",
        "type": "logic",
        "desc": "1.3倍智力伤害",
        "dmgStat": "intelligence",
        "dmgMult": 1.3,
        "cost": 1
      },
      {
        "name": "配平进阶",
        "type": "logic",
        "desc": "1.8倍智力伤害",
        "dmgStat": "intelligence",
        "dmgMult": 1.8,
        "cost": 2
      },
      {
        "name": "反应速率",
        "type": "logic",
        "desc": "0.7倍智力×2次",
        "dmgStat": "intelligence",
        "dmgMult": 0.7,
        "hits": 2,
        "cost": 2
      }
    ]
  }
};
G.MONSTER_LIST = Object.keys(G.MONSTERS);

// ==================== 章节地图 ====================
G.CHAPTER_MAP = {
  "name": "高一上",
  "nodes": [
    {
      "id": "start",
      "type": "battle_tutorial",
      "emoji": "⚔️",
      "label": "初始战斗",
      "row": 0,
      "col": 0
    },
    {
      "id": "partner",
      "type": "partner_select",
      "emoji": "👥",
      "label": "选择搭档",
      "row": 1,
      "col": 0
    },
    {
      "id": "talent0",
      "type": "talent",
      "emoji": "✨",
      "label": "开局天赋",
      "row": 2,
      "col": 0
    },
    {
      "id": "quiz_a1",
      "type": "quiz",
      "emoji": "📝",
      "label": "测验A",
      "row": 3,
      "col": -1
    },
    {
      "id": "quiz_b1",
      "type": "quiz",
      "emoji": "📝",
      "label": "测验B",
      "row": 3,
      "col": 1
    },
    {
      "id": "event_a1",
      "type": "event",
      "emoji": "❓",
      "label": "事件A1",
      "row": 4,
      "col": -1
    },
    {
      "id": "event_b1",
      "type": "event",
      "emoji": "❓",
      "label": "事件B1",
      "row": 4,
      "col": 1
    },
    {
      "id": "quiz_a2",
      "type": "quiz",
      "emoji": "📝",
      "label": "测验C",
      "row": 6,
      "col": -1
    },
    {
      "id": "quiz_b2",
      "type": "quiz",
      "emoji": "📝",
      "label": "测验D",
      "row": 6,
      "col": 1
    },
    {
      "id": "event_a2",
      "type": "event",
      "emoji": "❓",
      "label": "事件A2",
      "row": 7,
      "col": -1
    },
    {
      "id": "event_b2",
      "type": "event",
      "emoji": "❓",
      "label": "事件B2",
      "row": 7,
      "col": 1
    },
    {
      "id": "rest1",
      "type": "shop",
      "emoji": "🏪",
      "label": "小卖部",
      "row": 9,
      "col": 0
    },
    {
      "id": "monthly",
      "type": "monthly_exam",
      "emoji": "📋",
      "label": "月考",
      "row": 10,
      "col": 0
    },
    {
      "id": "talent1",
      "type": "talent",
      "emoji": "✨",
      "label": "天赋",
      "row": 11,
      "col": 0
    },
    {
      "id": "quiz_a3",
      "type": "quiz",
      "emoji": "📝",
      "label": "测验E",
      "row": 12,
      "col": -1
    },
    {
      "id": "quiz_b3",
      "type": "quiz",
      "emoji": "📝",
      "label": "测验F",
      "row": 12,
      "col": 1
    },
    {
      "id": "event_a3",
      "type": "event",
      "emoji": "❓",
      "label": "事件A3",
      "row": 13,
      "col": -1
    },
    {
      "id": "event_b3",
      "type": "event",
      "emoji": "❓",
      "label": "事件B3",
      "row": 13,
      "col": 1
    },
    {
      "id": "quiz_a4",
      "type": "quiz",
      "emoji": "📝",
      "label": "测验G",
      "row": 15,
      "col": -1
    },
    {
      "id": "quiz_b4",
      "type": "quiz",
      "emoji": "📝",
      "label": "测验H",
      "row": 15,
      "col": 1
    },
    {
      "id": "event_a4",
      "type": "event",
      "emoji": "❓",
      "label": "事件A4",
      "row": 16,
      "col": -1
    },
    {
      "id": "event_b4",
      "type": "event",
      "emoji": "❓",
      "label": "事件B4",
      "row": 16,
      "col": 1
    },
    {
      "id": "rest2",
      "type": "shop",
      "emoji": "🏪",
      "label": "小卖部",
      "row": 18,
      "col": 0
    },
    {
      "id": "final",
      "type": "final_exam",
      "emoji": "📄",
      "label": "期末考",
      "row": 19,
      "col": 0
    }
  ],
  "edges": [
    [
      "start",
      "partner"
    ],
    [
      "partner",
      "talent0"
    ],
    [
      "talent0",
      "quiz_a1"
    ],
    [
      "talent0",
      "quiz_b1"
    ],
    [
      "quiz_a1",
      "event_a1"
    ],
    [
      "quiz_b1",
      "event_b1"
    ],
    [
      "event_a1",
      "quiz_a2"
    ],
    [
      "event_a1",
      "quiz_b2"
    ],
    [
      "event_b1",
      "quiz_a2"
    ],
    [
      "event_b1",
      "quiz_b2"
    ],
    [
      "quiz_a2",
      "event_a2"
    ],
    [
      "quiz_b2",
      "event_b2"
    ],
    [
      "event_a2",
      "rest1"
    ],
    [
      "event_b2",
      "rest1"
    ],
    [
      "rest1",
      "monthly"
    ],
    [
      "monthly",
      "talent1"
    ],
    [
      "talent1",
      "quiz_a3"
    ],
    [
      "talent1",
      "quiz_b3"
    ],
    [
      "quiz_a3",
      "event_a3"
    ],
    [
      "quiz_b3",
      "event_b3"
    ],
    [
      "event_a3",
      "quiz_a4"
    ],
    [
      "event_a3",
      "quiz_b4"
    ],
    [
      "event_b3",
      "quiz_a4"
    ],
    [
      "event_b3",
      "quiz_b4"
    ],
    [
      "quiz_a4",
      "event_a4"
    ],
    [
      "quiz_b4",
      "event_b4"
    ],
    [
      "event_a4",
      "rest2"
    ],
    [
      "event_b4",
      "rest2"
    ],
    [
      "rest2",
      "final"
    ]
  ]
};
