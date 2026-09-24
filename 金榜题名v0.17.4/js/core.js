// core — 引擎基座：G 定义/局外 meta 持久化/游戏状态(选角开局/地图生成/场景切换)/工具函数/通用弹窗/Toast（2026-08-22 由内联脚本拆分）
// 依赖顺序：core → data → battle → map → fx → scenes；共用全局 G，禁止改成模块化 import。

// ==================== GAME ENGINE ====================
const G = {};

// 版本信息（version.js 由构建更新包脚本生成，缺失时回退默认；2026-08-25 增量更新包系统）
G.GAME_VERSION = (typeof window !== 'undefined' && window.GAME_VERSION) || '0.8';
G.GAME_DATE = (typeof window !== 'undefined' && window.GAME_DATE) || '';
G.GAME_NOTES = (typeof window !== 'undefined' && window.GAME_NOTES) || '';

// ==================== 局外持久化 meta（解锁/羁绊点/命运点/关系等级） ====================
// 2026-08-21 新增：羁绊点/命运点系统。绑定 localStorage，首次运行写入默认值。
G.META_KEY = 'xueshidai_meta_v1';
G.DEFAULT_UNLOCKED = {xueshilei:true, xiaoqingya:true}; // 默认解锁：小蕾/小雅
// 关系等级门槛（累计羁绊点，跨局不清零）：2星好友=30 3星密友=80 4星挚友=150 5星至交=250
G.REL_THRESHOLDS = {2:30, 3:80, 4:150, 5:250};
// 基础羁绊点获取（按节点类型）：测验10 月考20 期末30 模拟30
G.BOND_REWARD = {quiz:10, monthly_exam:20, final_exam:30, mock:30};
G.meta = {
  unlocked:{xueshilei:true, xiaoqingya:true}, // {charId:true}
  bondPoints:{},   // {charId: 累计羁绊点（跨局不清零）}
  bondLevels:{},   // {charId: 当前关系等级 1~5（手动提升）}
  fatePoints:0,    // 局外命运点（抽卡/更换装饰用）
  xslAchv:{},      // 薛诗蕾成就 {achvId:true}（2026-08-24，跨局保留）
};
G.loadMeta = function() {
  try {
    if(typeof localStorage === 'undefined') return;
    let raw = localStorage.getItem(G.META_KEY);
    if(!raw) { G.saveMeta(); return; }
    let d = JSON.parse(raw);
    G.meta = Object.assign({}, G.meta, d);
    G.meta.unlocked = Object.assign({}, G.DEFAULT_UNLOCKED, d.unlocked || {});
    G.meta.bondPoints = d.bondPoints || {};
    G.meta.bondLevels = d.bondLevels || {};
    G.meta.fatePoints = d.fatePoints || 0;
    G.meta.xslAchv = d.xslAchv || {};
    delete G.meta.createdBooks; // 旧版本曾永久保存创作书；现改为仅当前游戏保留
  } catch(e) { console.error('loadMeta:', e); }
};
G.saveMeta = function() {
  try {
    if(typeof localStorage === 'undefined') return;
    localStorage.setItem(G.META_KEY, JSON.stringify(G.meta));
  } catch(e) { console.error('saveMeta:', e); }
};
// 角色累计羁绊点
G.bondPointsOf = function(charId) { return G.meta.bondPoints[charId] || 0; };
// 当前关系等级：手动提升值（不低于1，不超过5）
G.bondLevelOf = function(charId) { return Math.max(1, Math.min(5, G.meta.bondLevels[charId] || 1)); };
// 下一级需要的累计羁绊点（返回 null 表示已满级）
G.nextBondNeed = function(charId) {
  let lv = G.bondLevelOf(charId);
  if(lv >= 5) return null;
  return G.REL_THRESHOLDS[lv + 1];
};
// 手动提升关系等级：累计羁绊点足够则 +1，并保存
G.upgradeBondLevel = function(charId) {
  let need = G.nextBondNeed(charId);
  if(need == null) { G.showToast('👑 关系已至最高（至交）'); return; }
  if(G.bondPointsOf(charId) < need) {
    G.showToast(`羁绊点不足（还需 ${need - G.bondPointsOf(charId)}）`);
    return;
  }
  G.meta.bondLevels[charId] = (G.meta.bondLevels[charId] || 1) + 1;
  G.saveMeta();
  G.showToast(`❤️ 关系提升至：${G.REL_NAMES[G.bondLevelOf(charId)]}`);
  G.render();
};
// 是否已解锁该角色
G.isCharUnlocked = function(charId) { return !!G.meta.unlocked[charId]; };

// ==================== 薛诗蕾成就（2026-08-24 规范版）====================
// 定义放 core.js（data.js 由游戏编辑器生成，自定义块会被编辑器保存时丢弃）
// 完成条件后对应卡牌永久进入薛诗蕾可抽取卡池（存 meta.xslAchv 跨局保留）
// star:星级 q:品质(3★蓝 4★紫 5★金 6★红 7★彩) cond:条件描述 unlock:解锁卡牌id
G.XSL_ACHV = {
  zailai_yitao:   {star:3, q:'蓝', name:'再来一套',   cond:'单场累计使用10张逻辑卡', unlock:'shuwan_juanzi'},
  zhege_wuhui:    {star:3, q:'蓝', name:'这个我会',   cond:'单场累计使用5张0费逻辑卡', unlock:'xuanze_miao'},
  jiancha_yixia:  {star:3, q:'蓝', name:'检查一下',   cond:'单回合连续使用3张逻辑卡', unlock:'zai_yansuan'},
  caozhi_bugou:   {star:3, q:'蓝', name:'草稿纸不够用了', cond:'单回合使用5张逻辑卡', unlock:'caozhi_manle'},
  huange_shunxu:  {star:3, q:'蓝', name:'换个顺序',   cond:'单场累计发生10次费用改变', unlock:'tiaozheng_shunxu'},
  zheti_buduijin: {star:4, q:'紫', name:'这题不对劲', cond:'将原始消耗≤2的逻辑卡提升至4费及以上并打出', unlock:'chaogang_ti'},
  jiandan_yidian: {star:4, q:'紫', name:'能不能再简单一点？', cond:'单回合将3张原始消耗≥2的逻辑卡降至0费并使用', unlock:'zheiti_jiejing'},
  silu_dakai:     {star:4, q:'紫', name:'思路打开了', cond:'同一张卡单次进入手牌后改变3次费用并打出', unlock:'yiti_duojie'},
  sheineng_achv:  {star:5, q:'金', name:'谁能有我卷？', cond:'单回合使用至少6张逻辑卡，并使天赋「谁能有我卷？」触发3次', unlock:'biaozhun_daan'},
  manfen:         {star:5, q:'金', name:'满分', cond:'同回合使用0费、1费、2费、3费及以上的逻辑卡，并在该回合击败目标', unlock:'aoshu_yazhou'},
};
// 成就锁定的卡（未完成成就前不在薛诗蕾卡池出现）
G.XSL_ACHV_LOCKED = Object.keys(G.XSL_ACHV).map(k => G.XSL_ACHV[k].unlock);

// 所有当前及未来角色都会自动携带的基础卡，不写进单个角色 starterDeck，避免新增角色漏配。
G.DEFAULT_DECK_CARDS = ['beiyong_lingshi'];
G.RUN_SAVE_KEY = 'xueshidai_run_v1';
G.hasRunSave = function() {
  try {
    if(typeof localStorage === 'undefined') return false;
    let raw=localStorage.getItem(G.RUN_SAVE_KEY);
    if(!raw) return false;
    let d=JSON.parse(raw),cid=d&&d.character&&d.character.id;
    return !!(d&&cid&&G.CHARACTERS&&G.CHARACTERS[cid]&&(d.chapterMap||d.battle||d.screen==='map'||d.screen==='reward'||d.screen==='book_reward'||d.screen==='battle'));
  } catch(e) { return false; }
};
G.saveRun = function() {
  try {
    if(typeof localStorage === 'undefined' || !G.state.character) return false;
    // 选牌中保存（2026-09-08）：把待结算卡id写入存档，读档时完成收尾，避免卡牌凭空消失。
    let pend = G._pendingCardId || null, prev = G.state._resumePendingCardId;
    if(pend) G.state._resumePendingCardId = pend;
    try { localStorage.setItem(G.RUN_SAVE_KEY, JSON.stringify(G.state)); }
    finally { if(pend) G.state._resumePendingCardId = prev; }
    return true;
  } catch(e) { console.error('saveRun:',e); return false; }
};
G.loadRun = function() {
  // 2026-09-08 冒烟修复：解析/校验、迁移、渲染三个阶段分开处理。
  // 只有「数据本身无法解析/角色无效」才算读取失败；迁移或渲染异常不得触发删档。
  let d;
  try {
    if(typeof localStorage === 'undefined') return false;
    let raw=localStorage.getItem(G.RUN_SAVE_KEY); if(!raw) return false;
    d=JSON.parse(raw);
  } catch(e) { console.error('loadRun parse:',e); return false; }
  let cid=d.character&&d.character.id;
  if(!cid || !G.CHARACTERS[cid]) return false;
  try {
    d.character=G.CHARACTERS[cid];
    if(d.battle && d.battle.monsterId) {
      d.battle.monsterData=G.MONSTERS[d.battle.monsterId];
      // 迁移旧存档：旧版把所有章节期末考都标成 isFinal；现仅第6章为高考。
      // 修复（2026-09-08）：isChapterFinal 是普通期末的标志，已有值必须保留，
      // 不能被只代表高考的 isFinal=false 覆盖，否则期末战斗读档后失去期末标志。
      if(d.battle.isChapterFinal === undefined) d.battle.isChapterFinal=!!d.battle.isFinal;
      d.battle.isGaokao=!!d.battle.isFinal && (d.chapter||1)>=6;
      d.battle.isFinal=d.battle.isGaokao;
    }
    d.createdBooks=Array.isArray(d.createdBooks)?d.createdBooks:[];
    // 沉睡实例迁移：旧版按基础ID记录，无法区分同名卡，清除旧标记避免整组误睡。
    d.sleepingCards=(d.sleepingCards&&typeof d.sleepingCards==='object')?d.sleepingCards:{};
    Object.keys(d.sleepingCards).forEach(ref=>{if(!String(ref).includes('#sleep'))delete d.sleepingCards[ref];});
    // 书籍扩展迁移：旧存档没有新书条目时自动补齐，避免进入书架或月考奖励后卡死。
    d.books=(d.books&&typeof d.books==='object')?d.books:{};
    for(let bid of (G.BOOK_LIST||[])) if(!d.books[bid]) d.books[bid]={progress:0,completed:false,obtained:false};
    d.lotteryTickets=Array.isArray(d.lotteryTickets)?d.lotteryTickets:[];
    // 道具上限迁移：每种真正同名卡最多保留3种不同道具。
    d.cardItems=(d.cardItems&&typeof d.cardItems==='object')?d.cardItems:{};
    Object.keys(d.cardItems).forEach(id=>{d.cardItems[id]=[...new Set(Array.isArray(d.cardItems[id])?d.cardItems[id]:[])].slice(0,3);});
    d.earlyExamTask=d.earlyExamTask||null;
    // 修复旧存档中已重复写入的天赋；后续所有获取入口也会阻止重复授予。
    d.talents=[...new Set(Array.isArray(d.talents)?d.talents:[])];
    // 搭档系统重做：旧搭档退出正式池，旧存档仅保留仍在新版名单中的搭档。
    const currentPartnerIds=new Set(['jiangjiaqi','xiaomeng_teacher','xuerengui','linxiaoman','zhaotianle','sukexin']);
    d.partners=(Array.isArray(d.partners)?d.partners:[]).filter(p=>p&&currentPartnerIds.has(p.id)).map(p=>({...p,level:Math.min(3,Math.max(1,p.level||1))}));
    d.completedNodes=(d.completedNodes&&typeof d.completedNodes==='object')?d.completedNodes:{};
    d.reachableNodes=(d.reachableNodes&&typeof d.reachableNodes==='object')?d.reachableNodes:{};
    d.nodeEvents=(d.nodeEvents&&typeof d.nodeEvents==='object')?d.nodeEvents:{};
    // 事件去重迁移：旧存档按当前地图已分配的事件建立已用记录，后续章节不再复用。
    d.usedEvents=(d.usedEvents&&typeof d.usedEvents==='object')?d.usedEvents:{};
    Object.values(d.nodeEvents).forEach(id=>{if(id)d.usedEvents[id]=true;});
    // 旧存档可能缺少扩展后的地图字段；保留章节与角色，重新生成当前章节地图，避免继续游戏无响应。
    if(!d.chapterMap||!Array.isArray(d.chapterMap.nodes)||!Array.isArray(d.chapterMap.edges)) {
      G.state=d;
      G.generateMap();
      d.currentNodeId=null;
      d.completedNodes={};
      d.reachableNodes={};
      if(d.chapterMap.nodes&&d.chapterMap.nodes[0]) d.reachableNodes[d.chapterMap.nodes[0].id]=true;
    }
    G.state=d;
    if(d._resumeShopStock)G._shopStock=d._resumeShopStock;
    G._choiceOptions=null; G._choiceCancelCb=null;
  } catch(e) { console.error('loadRun migrate:',e); return false; }
  // 渲染与恢复流程异常不再算读取失败：界面问题不销毁玩家存档。
  try {
    G.render();
    // 选牌中保存的旧存档：重建选择弹窗继续未完成的选择（showCardChoice 只弹窗不重复结算）；
    // 若当前状态已无法重建选项（如条件不再满足），则完成结算收尾，避免卡牌凭空消失。
    let resumePending = d._resumePendingCardId || G._pendingCardId;
    delete d._resumePendingCardId;
    G._pendingCardId = null;
    if(resumePending && d.screen==='battle' && d.battle && !d.battle.over) {
      try {
        let pd=G.getCardData(resumePending);
        if(pd && (!G.showCardChoice || !G.showCardChoice(pd))) G.finishCard(pd);
      } catch(e) { console.error('loadRun resume pending:',e); }
    }
    // 修复（2026-09-08）：敌方回合中保存退出，继续后永久停在 phase=monster。
    // 行动流程不随存档恢复，读档后重新启动怪物回合；若保存时怪物回合已开始
    // （中毒已结算过），跳过开头的每回合结算，避免重复扣血。
    let rb=d.battle;
    if(d.screen==='battle' && rb && !rb.over && rb.phase==='monster') {
      let started=!!rb._monsterTurnStarted;
      setTimeout(() => { if(G.state.battle===rb) G.monsterTurn(started); }, G.animMs(450));
    }
  } catch(e) { console.error('loadRun render:',e); }
  return true;
};
G.clearRunSave = function() {
  try { if(typeof localStorage !== 'undefined') localStorage.removeItem(G.RUN_SAVE_KEY); } catch(e) {}
};

// ==================== 玩家设置（2026-08-23 设置页）====================
// 设置页数据源：全部实时生效并持久化到 localStorage
G.SETTINGS_KEY = 'xueshidai_settings_v1';
G.settings = {
  bgmOn: true, bgmVol: 50,   // 背景音乐：开关 + 音量(0~100)
  sfxOn: true, sfxVol: 70,   // 战斗音效：开关 + 音量(0~100)
  shakeOn: true,             // 屏幕震动（攻击/受击镜头晃动）
  ambientOn: true,           // 氛围粒子（战斗微尘/樱花雨/星尘/圣光）
  battleSpeed: 1,            // 战斗节奏倍速 1 / 1.5 / 2
  skipTutorial: false,       // 新生入学时跳过第一章教学战斗
  fastEventRead: false,      // 剧情事件点击一次直接展开全部对话
};
G.loadSettings = function() {
  try {
    if(typeof localStorage === 'undefined') return;
    let raw = localStorage.getItem(G.SETTINGS_KEY);
    if(raw) {
      let d = JSON.parse(raw);
      // 只接受已知键，防止旧存档脏数据混入
      for(let k in G.settings) if(d[k] !== undefined) G.settings[k] = d[k];
    } else if(localStorage.getItem('sfx_on') === '0') {
      G.settings.sfxOn = false; // 兼容旧版右上角静音按钮的存档
    }
  } catch(e) { console.error('loadSettings:', e); }
};
G.saveSettings = function() {
  try {
    if(typeof localStorage === 'undefined') return;
    localStorage.setItem(G.SETTINGS_KEY, JSON.stringify(G.settings));
  } catch(e) { console.error('saveSettings:', e); }
};
// 战斗节奏换算：按倍速缩短基准时长（battle.js 怪物出牌链/飞牌动画计时统一走这里）
G.animMs = function(ms) {
  let sp = (G.settings && G.settings.battleSpeed) || 1;
  return Math.round(ms / sp);
};
// 设置生效：同步音效引擎 / 菜单BGM / 战斗氛围层（读档后与每次改动时调用）
G.applySettings = function() {
  let st = G.settings;
  // 音效引擎
  if(G.sfx) {
    G.sfx.enabled = st.sfxOn;
    if(G.sfx.master) G.sfx.master.gain.value = 0.45 * (st.sfxVol / 100);
    if(G.sfx.btnSync) G.sfx.btnSync();
  }
  // 菜单BGM
  if(typeof document !== 'undefined' && document.querySelector) {
    let bgm = document.querySelector('.menu-bgm');
    if(bgm) {
      bgm.volume = st.bgmVol / 100;
      if(st.bgmOn) { if(bgm.paused) bgm.play().catch(function(){}); }
      else bgm.pause();
    }
  }
  // 战斗氛围微尘（含开关关闭时立即摘层）
  if(G.fx && G.fx.ambientBattleSync) G.fx.ambientBattleSync();
};
// 关注同学：当前直接解锁（后续会添加条件）
G.followChar = function(charId) {
  let ch = G.CHARACTERS[charId];
  if(!ch) return;
  G.meta.unlocked[charId] = true;
  G.saveMeta();
  G.showToast(`❤️ 已关注 ${ch.name}！`);
  G.render();
};


// ==================== GAME STATE ====================
G.state = {
  screen:'menu',
  character:null,
  star:1,
  hp:0,maxHp:0,
  energy:0,maxEnergy:5,energyRegen:2,
  deck:[],hand:[],discard:[],exhaust:[],
  drawPile:[],
  physique:0,intelligence:0,eq:0,combatEq:0,
  gold:0,
  cardItems:{}, // 卡牌道具：{基础卡牌ID:[道具ID,...]}，同一道具在同名卡上不可重复
  sleepingCards:{}, // 小萌沉睡：按卡牌本身记录，跨战斗保留至苏醒
  rallyCount:0, // 重整旗鼓次数：本局全局资源，跨战斗保留
  tempRallyCount:0,
  partners:[], // 搭档列表（2026-08-24 多搭档制：基础上限1，交际花上限+1）
  partnerNodesVisited:0,
  talents:[],
  // Books
  books:{}, // {bookId:{progress,completed,obtained}}
  createdBooks:[], // 本局自创书籍：重新开始或放弃游戏时清空
  bondProgress:{}, // {bondId:count}
  activeBonds:{}, // {bondId:true}
  readingSpeed:10,
  readingBook:null, // currently reading book id（每场战斗节点自动推进）
  equippedBookCard:null, // 已读完书籍中选择携带的书籍卡；全局最多1张
  _shopDeleteCount:0, // 每次进小卖部已删卡次数（第1张免费，其后费用翻倍，2026-08-23）
  // Map
  chapter:1,
  chapterMap:null,
  currentNodeId:null,
  completedNodes:{},
  reachableNodes:{},
  nodeEvents:{}, // {nodeId:eventId} 开局随机分配、本局固定
  // Battle
  battle:null,
  bet:null, // {need:15|30} 小君的赌注
  earlyExamTask:null, // 提前交卷一次性任务：{active,completed}
  qinlaoEnergySpent:0, // 勤劳：本局累计消耗体力
  lotteryTickets:[], // 大乐透彩票：每张独立记录号码与剩余考试场数
  wushiCapBonus:0, // 唐淞骄傲：无视层数上限加成
  // Pools
  usedMonsters:{},
  usedEvents:{},
  // Turn modifiers
  turnLogicCostReduction:0,
  turnLogicDmgMult:1,
  turnNextDmgBonus:0,
  turnIdeaCardsPlayed:0,
  turnLogicCardsPlayed:0,
  monsterNodesPassed:0,
  bossNodesPassed:0,
  runBondPoints:0,   // 本局累计羁绊点（战斗胜利结算，局末统一入账）
  runFatePoints:0,
  runAchievements:[],
  runStats:{damageDealt:0,damageTaken:0,retakes:0,abandons:0,maxDeck:0,gaokaoTurns:0},
  settlementScore:0,
  settlementReason:'',
  gaokaoDifficultyBonus:0, // 放弃高考战斗累积的难度加成（每次+5%）
  toolSlots:1, // 局外用具槽数量
  equippedTools:[], // 局外已装备用具；按卡组顺序自动填充空槽
  toolEquipped:null, // 旧存档兼容：始终同步为第一个已装备用具
  readingSpeedFinalBonus:0,
  rewardRefreshUsed:false,
  yearFirstBattleRewarded:{},
  bookshelfReturnScreen:'map',
  // 2026-08-23 改版：特供小说改为普通卡牌（随肖清雅初始卡组），不再有 _novelChosen/_novelCardId
};

// 全局经济规则：所有正向零花钱获取量提升50%；消费与损失不受影响。
G.GOLD_GAIN_MULTIPLIER = 1.5;
G.gainGold = function(baseAmount) {
  let base = Math.max(0, Number(baseAmount) || 0);
  let gained = Math.floor(base * G.GOLD_GAIN_MULTIPLIER);
  G.state.gold += gained;
  return gained;
};
G.recordRunDamage = function(kind, amount) {
  let s=G.state, n=Math.max(0,Number(amount)||0);
  if(!s.runStats)s.runStats={damageDealt:0,damageTaken:0,retakes:0,abandons:0,maxDeck:0,gaokaoTurns:0};
  if(kind==='taken') s.runStats.damageTaken=(s.runStats.damageTaken||0)+n;
  else s.runStats.damageDealt=(s.runStats.damageDealt||0)+n;
};
G.isPhysiqueRelatedCard=function(card){
  let c=typeof card==='string'?(G.getCardData&&G.getCardData(card)):card; if(!c)return false;
  if(c.dmgStat==='physique'||c.shieldStat==='physique')return true;
  let raw='';try{raw=JSON.stringify(c)}catch(e){}
  return /体魄/.test((c.desc||'')+' '+raw);
};
G.isPhysiqueRelatedItem=function(item){
  if(!item)return false; let raw='';try{raw=JSON.stringify(item)}catch(e){}
  return /体魄/.test((item.desc||'')+' '+raw)||item.bonusDamage?.stat==='physique'||item.playShield?.stat==='physique';
};

// 统一用具槽检查：获得用具卡、增加槽位或载入旧存档后，自动把卡组中的用具装入空槽。
G.autoEquipTools = function() {
  let s=G.state;if(!s)return [];
  s.toolSlots=Math.max(0,Math.floor(Number(s.toolSlots)||1));
  let equipped=Array.isArray(s.equippedTools)?s.equippedTools.slice():[];
  if(s.toolEquipped&&!equipped.includes(s.toolEquipped))equipped.unshift(s.toolEquipped);
  let deckTools=[...new Set((s.deck||[]).filter(ref=>{let d=G.getCardData&&G.getCardData(ref);return d&&d.type==='tool';}))];
  equipped=equipped.filter(ref=>deckTools.includes(ref)).slice(0,s.toolSlots);
  for(let ref of deckTools){if(equipped.length>=s.toolSlots)break;if(!equipped.includes(ref))equipped.push(ref);}
  s.equippedTools=equipped;s.toolEquipped=equipped[0]||null;
  return equipped;
};

G.resetRun = function(charId, star) {
  if(G.removeLongzuBg) G.removeLongzuBg(); // 兜底：新开局清除可能残留的龙族壁纸层（定义在 battle.js，防御性调用）
  let ch = G.CHARACTERS[charId];
  let s = G.state;
  s.character = ch;
  s.star = star || 1;
  s.physique = ch.physique;
  s.intelligence = ch.intelligence;
  s.eq = ch.eq;
  s.combatEq = 0;
  s.gold = 0;
  s.cardItems = {};
  s.sleepingCards = {};
  s.rallyCount = 0;
  s.tempRallyCount = 0;
  s.difficulty = G._difficulty || '普通';
  s.partners = [];
  s.partnerNodesVisited = 0;
  s.talents = [];
  s.bet = null;
  s.earlyExamTask = null;
  s.qinlaoEnergySpent = 0;
  s.lotteryTickets = [];
  s.wushiCapBonus = 0;
  // Apply star stats (3星/5星)
  for(let lv=2; lv<=s.star; lv++) {
    let st = ch.stars[lv];
    if(!st) continue;
    if(st.stats) {
      if(st.stats.physique) s.physique += st.stats.physique;
      if(st.stats.intelligence) s.intelligence += st.stats.intelligence;
      if(st.stats.eq) s.eq += st.stats.eq;
    }
  }
  s.maxHp = s.physique * 5;
  // 小萌3星: 生命+1（体魄锁定角色用生命直接加成）
  for(let lv=2; lv<=s.star; lv++) {
    let st = ch.stars[lv];
    if(st && st.hpPlus) s.maxHp += st.hpPlus;
  }
  s.hp = s.maxHp;
  s.maxEnergy = 5 + Math.floor(s.physique / 15);
  s.energyRegen = 2;
  if(s.star >= 3 && ch.stars[3] && ch.stars[3].energyBonus) {
    s.maxEnergy += ch.stars[3].energyBonus.max || 0;
    s.energyRegen += ch.stars[3].energyBonus.regen || 0;
  }
  s.energy = s.maxEnergy;
  // 挚友（4星）天赋开局拥有：解锁并进入天赋池（其他角色可刷到），本角色开局直接获得
  if(s.star >= 4 && ch.stars[4] && ch.stars[4].battleStart && !s.talents.includes(ch.stars[4].battleStart)) s.talents.push(ch.stars[4].battleStart);
  if(s.talents.includes('dameng_shuixianjue')) s.rallyCount += 1;
  s.deck = [...ch.starterDeck, ...G.DEFAULT_DECK_CARDS];
  // 5星专属卡入卡组（仅5星）
  if(s.star >= 5 && ch.stars[5] && ch.stars[5].deckAdd) s.deck.push(...ch.stars[5].deckAdd);
  s.hand = []; s.discard = []; s.exhaust = [];
  s.books = {}; s.bondProgress = {}; s.activeBonds = {};
  s.readingSpeed = 10;
  if(ch.id==='liangchaojie'&&s.star>=2)s.readingSpeed=Math.ceil(s.readingSpeed*1.1);
  s.readingSpeedFinalBonus = 0;
  s.rewardRefreshUsed = false;
  s.yearFirstBattleRewarded = {};
  s.bookshelfReturnScreen = 'map';
  s.readingBook = null;
  s.equippedBookCard = null;
  s.createdBooks = [];
  G.clearRunSave();
  s._shopDeleteCount = 0;
  s.chapter = 1;
  s.completedNodes = {}; s.reachableNodes = {};
  s.usedMonsters = {}; s.usedEvents = {};
  s.nodeEvents = {};
  s.battle = null;
  s.monsterNodesPassed = 0; s.bossNodesPassed = 0;
  s.runBondPoints = 0;
  s.runFatePoints = 0;
  s.runAchievements = [];
  s.runStats = {damageDealt:0,damageTaken:0,retakes:0,abandons:0,maxDeck:0,gaokaoTurns:0};
  s.settlementScore = 0;
  s.settlementReason = '';
  s.gaokaoDifficultyBonus = 0; // 放弃高考战斗累积的难度加成（每次+5%）
  s.toolSlots = 1;
  s.equippedTools = [];
  s.toolEquipped = null;
  G.autoEquipTools();
  // Init book state
  for(let bid of G.BOOK_LIST) s.books[bid] = {progress:0,completed:false,obtained:false};
  for(let bid of Object.keys(G.BONDS)) s.bondProgress[bid] = 0;
  // Generate map
  G.generateMap();
  // Set first node reachable
  let firstId = s.chapterMap.nodes[0].id;
  if(G.settings && G.settings.skipTutorial) {
    // 只跳过新开局的第一章教学节点；后续章节的开场节点仍按正常流程进行。
    s.completedNodes[firstId] = true;
    s.reachableNodes[firstId] = false;
    (s.chapterMap.edgeMap[firstId] || []).forEach(function(nextId) { s.reachableNodes[nextId] = true; });
  } else {
    s.reachableNodes[firstId] = true;
  }
  s.currentNodeId = null;
  // 2026-08-23 改版：三本特供小说随肖清雅初始卡组出场（普通卡牌），不再开局选书
  G.setScreen('map');
};

G.generateMap = function() {
  let s = G.state;
  s.chapterMap = JSON.parse(JSON.stringify(G.CHAPTER_MAP));
  // 章节名称
  let chapterNames = ['高一上','高一下','高二上','高二下','高三上','高三下'];
  s.chapterMap.name = chapterNames[(s.chapter - 1) % 6] || '高一上';
  // 搭档节点只在上册章节出现（高一上/高二上/高三上），下册章节移除
  if(s.chapter % 2 === 0) {
    s.chapterMap.nodes = s.chapterMap.nodes.filter(n => n.id !== 'partner');
    s.chapterMap.edges = s.chapterMap.edges.filter(e => e[0] !== 'partner' && e[1] !== 'partner');
    s.chapterMap.edges.push(['start','talent0']);
  }
  // 新章节重置怪物使用记录
  s.usedMonsters = {};
  // 按考试级别分池：高一至高三上使用测验/月考池；高三下由模拟考替代普通战斗，最终节点固定高考。
  let pools = G.MONSTER_POOLS || {quiz:G.MONSTER_LIST, monthly:G.MONSTER_LIST, mock:G.MONSTER_LIST, gaokao:G.MONSTER_LIST};
  let shuffledPools = {
    quiz:G.shuffle([...(pools.quiz||[])]), monthly:G.shuffle([...(pools.monthly||[])]), mock:G.shuffle([...(pools.mock||[])]), gaokao:[...(pools.gaokao||[])]
  };
  let poolIndexes = {quiz:0,monthly:0,mock:0,gaokao:0};
  const takeMonster = function(poolName) {
    let pool = shuffledPools[poolName] || shuffledPools.quiz;
    if(!pool.length) pool = G.MONSTER_LIST;
    let idx = poolIndexes[poolName] || 0;
    let id = pool[idx % pool.length];
    poolIndexes[poolName] = idx + 1;
    return id;
  };
  s.chapterMap.nodes.forEach(n => {
    if(n.type === 'quiz' || n.type === 'monthly_exam' || n.type === 'final_exam' || n.type === 'battle_tutorial') {
      let poolName = 'quiz';
      if((s.chapter||1) >= 6) poolName = n.type === 'final_exam' ? 'gaokao' : 'mock';
      else if(n.type === 'monthly_exam' || n.type === 'final_exam') poolName = 'monthly';
      // 首次新手战固定成语填空，避免随机复杂机制破坏教学脚本。
      n.monsterId = (n.type === 'battle_tutorial' && (s.chapter||1) === 1 && G.MONSTERS.chengyu) ? 'chengyu' : takeMonster(poolName);
      if(!s.usedMonsters[n.monsterId]) s.usedMonsters[n.monsterId] = true;
    }
  });
  // Assign events to event nodes (开局随机、本局固定、不重复)
  let eventNodes = s.chapterMap.nodes.filter(n => n.type === 'event');
  // 本局事件不重复：已分配过的事件从后续章节排除。
  s.usedEvents = s.usedEvents || {};
  let eventPool = G.EVENT_LIST.filter(id=>(id!=='early_submission'||!s.earlyExamTask) && !s.usedEvents[id] && (!id.startsWith('paper_note_') || s.paperStudyUnlocked));
  let paperPool=G.shuffle(eventPool.filter(id=>id.startsWith('paper_note_'))),normalPool=G.shuffle(eventPool.filter(id=>!id.startsWith('paper_note_')));
  const takeEvent=()=>{
    if(!paperPool.length)return normalPool.shift();
    if(!normalPool.length)return paperPool.shift();
    return Math.random()<0.12?paperPool.shift():normalPool.shift();
  };
  eventNodes.forEach((n,i) => {
    let eventId = takeEvent();
    if(eventId) {
      s.nodeEvents[n.id] = eventId;
      s.usedEvents[eventId] = true;
    }
  });
  // Build edge lookup
  s.chapterMap.edgeMap = {};
  s.chapterMap.edges.forEach(([from,to]) => {
    if(!s.chapterMap.edgeMap[from]) s.chapterMap.edgeMap[from] = [];
    s.chapterMap.edgeMap[from].push(to);
  });
};

G.getNode = function(id) {
  return G.state.chapterMap.nodes.find(n => n.id === id);
};

G.setScreen = function(screen) {
  G.state.screen = screen;
  G.render();
};


// ==================== UTILS ====================
G.shuffle = function(arr) { let a=[...arr]; G.shuffleInPlace(a); return a; };
G.shuffleInPlace = function(arr) { for(let i=arr.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];} };
G.pick = function(arr) { return arr[Math.floor(Math.random()*arr.length)]; };
// 按权重随机选取一个元素（keys 与 weights 等长），2026-08-23 小卖部品质权重用
G.pickWeighted = function(keys, weights) {
  let total = weights.reduce((a,b)=>a+b,0);
  if(total <= 0) return keys[keys.length-1];
  let r = Math.random() * total;
  for(let i=0;i<keys.length;i++){ r -= weights[i]; if(r < 0) return keys[i]; }
  return keys[keys.length-1];
};
G.randInt = function(min,max) { return Math.floor(Math.random()*(max-min+1))+min; };
// HTML 转义（CG 对话日志等动态文本渲染用）
G.esc = function(s) { return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };

// 搭档上限：每5点情商+1（最低1）；肖清雅「交际花」额外+1。
G.partnerCap = function() {
  let s = G.state;
  let cap=Math.max(1,Math.floor((s.eq||0)/5));
  if(s.star >= 2 && s.character && s.character.stars[2] && s.character.stars[2].passive === 'jiaojihua') cap++;
  return cap;
};


// ===== 通用弹窗 =====
// variant: 'paper' = 与选角色页面同款米黄纸面（卡组类弹窗用）
G.showModal = function(html, variant) {
  let ov = document.createElement('div');
  ov.id = 'modalOverlay';
  // 事件框本身是高层全屏容器；事件中的选牌/选号弹窗必须再高一层。
  if(document.getElementById('commonEventFrame')) ov.classList.add('over-event');
  ov.innerHTML = `<div class="modal-box${variant==='paper'?' modal-paper':''}">${html}</div>`;
  document.body.appendChild(ov);
};
G.closeModal = function() {
  let m = document.getElementById('modalOverlay');
  if(m) m.remove();
};
// 全屏覆盖层（2026-08-21）：全屏剧情对话 / 全屏选天赋页
G._openFullscreen = function(inner) {
  let ov = document.createElement('div');
  ov.className = 'te-fullscreen';
  ov.innerHTML = inner;
  document.body.appendChild(ov);
};
G._closeFullscreen = function() {
  let el = document.querySelector('.te-fullscreen');
  if(el) el.remove();
};
// 战斗内查看弃牌堆：点击弃牌堆/怪物弃牌堆弹窗列出其中的卡（which='discard'|'monsterDiscard'）
G.showPilePreview = function(which) {
  let b = G.state.battle;
  if(!b) return;
  let isM = which === 'monsterDiscard';
  let arr = isM ? (b.monsterDiscard || []) : (b.discard || []);
  let typeEm = {logic:'💥',idea:'💡',answer:'⭐',tool:'🔧'};
  let rows = arr.map(e => {
    let id = typeof e === 'string' ? e : (e && e.id);
    // 修复（2026-09-08）：改用 getCardData 解析品质引用（如 shuati@blue）、复制牌等引用格式，
    // 避免弃牌堆把品质卡显示成「未知卡」。
    let cd = id ? (G.getCardData ? G.getCardData(id) : (G.CARDS && G.CARDS[id])) : null;
    if(!cd && e && e.name) cd = {name:e.name,type:e.type,cost:e.cost,desc:e.desc};
    let tn = typeEm[(cd && cd.type) || 'logic'] || '🃏';
    let desc = cd && cd.desc ? `<div style="font-size:11px;color:#8a6a3a;line-height:1.4">${G.decorateKeywords ? G.decorateKeywords(cd.desc) : cd.desc}</div>` : '';
    return `<div style="padding:6px 8px;border-bottom:1px dashed #cbb78a;font-size:12px">
      <div style="display:flex;align-items:center;gap:8px">
        <span>${tn}</span><b style="flex:1;color:#3a2a14">${cd ? cd.name : '未知卡'}</b>
        <span style="color:#9a5c2a">⚡${cd && (cd.cost!==undefined) ? cd.cost : ''}</span>
      </div>${desc}
    </div>`;
  }).join('');
  let empty = arr.length === 0 ? '<div style="text-align:center;color:#9a8c6a;padding:16px;font-size:12px">空空如也，暂无卡牌</div>' : '';
  G.showModal(`<h3 style="text-align:center;color:#ffd700;margin-bottom:4px">${isM ? '怪物弃牌堆' : '弃牌堆'}·共${arr.length}张</h3>
    <div style="max-height:60vh;overflow-y:auto;background:#fbf4e3;border:1px solid #e6d3a6;border-radius:8px;padding:4px">${rows || empty}</div>
    <div style="text-align:center;margin-top:10px"><button class="btn" onclick="G.closeModal()">关闭</button></div>`,
    'paper');
};
// 抉择/选牌弹窗：options = [{text, sub?, cb}]
G.showChoiceModal = function(title, options, config) {
  config=config||{};
  config.cancelable = config.cancelable !== false;
  let html = `<h3 style="text-align:center;color:#ffd700;margin-bottom:12px">${title}</h3>
    ${config.cancelable?`<button class="choice-close" onclick="G._choiceCancel()" aria-label="取消">×</button>`:''}
    <div style="display:flex;flex-direction:column;gap:8px">
      ${options.map((o,i) => `
        <div class="card" style="max-width:100%;cursor:pointer" onclick="G._choicePick(${i})">
          <div style="font-weight:bold;font-size:13px">${o.text}</div>
          ${o.sub?`<div style="font-size:10px;color:#8ab4f8;margin-top:2px">${o.sub}</div>`:''}
        </div>`).join('')}
    </div>`;
  G.showModal(html);
  G._choiceOptions = options;
  G._choiceCancelCb = config.onCancel || null;
};
G._choiceCancel = function(){let cb=G._choiceCancelCb,pending=G._pendingCardId;G._choiceOptions=null;G._choiceCancelCb=null;G._pendingCardId=null;G.closeModal();if(cb)cb();else if(pending){let cd=G.getCardData(pending);if(cd)G.finishCard(cd);else G.render();}else G.render();};
G._choicePick = function(i) {
  let o = G._choiceOptions[i];
  if(!o) return;
  G.closeModal();
  // 修复（2026-09-08）：选择完成后必须清除选择状态，否则 autosave 一直误判
  // 「选择进行中」而拒绝保存（备用零食/决斗邀请弹窗关闭后存档始终为旧数据）。
  G._choiceOptions=null; G._choiceCancelCb=null;
  if(o.cb) o.cb();
  else if(o.status) for(let [st,l] of Object.entries(o.status)) G.addPlayerStatus(st, l);
  // 完成被挂起的卡牌结算
  if(o.deferRender) return;
  if(G._pendingCardId) {
    let cd = G.getCardData(G._pendingCardId);
    G._pendingCardId = null;
    if(cd) G.finishCard(cd);
    else G.render();
  } else {
    G.render();
  }
};


// ===== 多选弹窗 =====
G.showMultiSelect = function(title, items, maxCount, onConfirm) {
  G._multiSelected = [];
  let html = `<h3 style="text-align:center;color:#ffd700;margin-bottom:8px">${title}</h3>
    <p style="text-align:center;font-size:11px;color:#8ab4f8;margin-bottom:8px">已选: <span id="msCount">0</span>/${maxCount}</p>
    <div style="display:flex;flex-direction:column;gap:6px;max-height:50vh;overflow-y:auto">`;
  items.forEach((cid,i) => {
    let d = G.getCardData(cid);
    if(!d) return;
    html += `<div class="card ${d.type}" id="ms-${i}" style="max-width:100%;cursor:pointer" onclick="G._multiToggle(${i},${maxCount})">
      <div style="font-weight:bold;font-size:13px">${d.name}</div>
      <div style="font-size:10px;color:#a0b8d0">${d.desc}</div>
    </div>`;
  });
  html += `</div><button class="btn primary" style="width:100%;margin-top:10px" onclick="G._multiConfirm()">✅ 确定</button>`;
  G.showModal(html);
  G._multiItems = items;
  G._multiMax = maxCount;
  G._multiOnConfirm = onConfirm;
};
G._multiToggle = function(i, max) {
  let idx = G._multiSelected.indexOf(i);
  if(idx >= 0) { G._multiSelected.splice(idx,1); let el = document.getElementById('ms-'+i); if(el) el.classList.remove('selected'); }
  else if(G._multiSelected.length < max) { G._multiSelected.push(i); let el = document.getElementById('ms-'+i); if(el) el.classList.add('selected'); }
  let c = document.getElementById('msCount');
  if(c) c.textContent = G._multiSelected.length;
};
G._multiConfirm = function() {
  let picked = G._multiSelected.map(i => G._multiItems[i]).filter(Boolean);
  let cb = G._multiOnConfirm;
  G.closeModal();
  if(cb) cb(picked);
  if(G._pendingCardId) {
    let cd = G.getCardData(G._pendingCardId);
    G._pendingCardId = null;
    if(cd) G.finishCard(cd);
  }
};


// --- TOAST ---
G.showToast = function(msg) {
  let container = document.getElementById('toastContainer');
  let el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => { el.style.opacity='0'; el.style.transition='opacity 0.3s'; }, 1200);
  setTimeout(() => el.remove(), 1500);
};
