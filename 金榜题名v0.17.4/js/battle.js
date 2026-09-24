// battle — 战斗引擎：开局/摸牌/出牌结算/卡牌效果/状态/回合与怪物AI/胜负结算/奖励生成（2026-08-22 由内联脚本拆分）
// 依赖顺序：core → data → battle → map → fx → scenes；共用全局 G，禁止改成模块化 import。

// ==================== BATTLE ENGINE ====================
G.startBattle = function(monsterId) {
  let s = G.state;
  G.autoEquipTools();
  let mData = G.MONSTERS[monsterId];
  if(!mData) { console.error('Monster not found:',monsterId); return; }
  // 感性提升只对战斗内生效，战斗结束复原
  s.combatEq = 0;
  // 旧版按基础ID保存沉睡，会误伤所有同名卡；旧标记无法判断具体实例，直接迁移清除。
  s.sleepingCards=s.sleepingCards||{};
  Object.keys(s.sleepingCards).forEach(ref=>{if(!String(ref).includes('#sleep'))delete s.sleepingCards[ref];});
  G._playLogOpen = false; // 出牌记录面板默认收起
  G._prevPlayerHpPct = null; G._prevMonsterHpPct = null; // 流动血条快照重置：新战斗不做跨场动画
  // 章节期末考与最终高考分离：只有第6章的 final_exam 才启用高考特殊规则。
  let node = s.currentNodeId ? G.getNode(s.currentNodeId) : null;
  let isChapterFinal = !!(node && node.type === 'final_exam');
  let isGaokao = isChapterFinal && (s.chapter || 1) >= 6;
  // Apply chapter difficulty + 所选难度（关注同学页难度框）
  let diff = G.DIFF_MULT[s.difficulty || '普通'] || G.DIFF_MULT['普通'];
  let isMonthlyTier = mData.tier === 'monthly';
  // 月考强度只按基础区间与已通过大考节点成长，不再额外叠加章节倍率。
  let hpMult = (mData.noChapterScale || isMonthlyTier) ? 1 : 1 + (s.chapter - 1) * 0.5;
  // 仅最终高考应用放弃累积的难度提升。
  let gkBonus = isGaokao ? ((s.gaokaoDifficultyBonus||0) || 0) : 0;
  let hpGrowth = mData.noChapterScale ? 0 : (isMonthlyTier ? (s.bossNodesPassed||0)*40 : s.monsterNodesPassed*5);
  let statGrowth = mData.noChapterScale ? 0 : (isMonthlyTier ? (s.bossNodesPassed||0)*5 : s.monsterNodesPassed);
  let mHp = Math.floor((mData.hp * hpMult * diff.hp + gkBonus) * (1 + gkBonus)) + hpGrowth;
  if(isChapterFinal && !isGaokao) mHp *= 2;
  const scaledMonsterStat = function(value) { return value ? Math.floor(value * diff.stat) + statGrowth : 0; };
  let mInt = scaledMonsterStat(mData.intelligence||0);
  let mEq = scaledMonsterStat(mData.eq||0);
  let mPhy = scaledMonsterStat(mData.physique||0);
  if(isChapterFinal && !isGaokao) {
    mInt=Math.floor(mInt*1.5); mEq=Math.floor(mEq*1.5); mPhy=Math.floor(mPhy*1.5);
  }
  if(!mInt && !mEq && !mPhy) mInt = Math.floor(3 * diff.stat) + nodeGrowth;

  s.battle = {
    monsterId, monsterData:mData,
    monsterHp:mHp, monsterMaxHp:mHp,
    monsterIntelligence:mInt, monsterEq:mEq,
    monsterPhysique:mPhy,
    playerHp:s.hp, playerMaxHp:s.maxHp,
    playerShield:0,
    energy:s.maxEnergy, maxEnergy:s.maxEnergy,
    // 怪物体力制度（2026-08-21 用户需求）：上限5，出牌消耗，回合开始回满
    monsterEnergy:5, monsterMaxEnergy:5,
    // 局外已装备的用具不进入战斗循环（s.deck 仍保留该卡，卸下后回归）
    hand:[], discard:[], exhaust:[], drawPile:(()=>{
      let bookCards=new Set(Object.values(G.BOOKS||{}).map(x=>x.reward&&x.reward.card).filter(Boolean));
      let equipped=new Set(s.equippedTools||[]),cards=[...s.deck].filter(cid=>!equipped.has(cid)&&!bookCards.has(G.baseId(cid)));
      let bid=s.equippedBookCard,bk=bid&&s.books&&s.books[bid],ref=bid&&G.BOOKS[bid]&&G.BOOKS[bid].reward&&G.BOOKS[bid].reward.card;
      if(bk&&bk.completed&&ref&&!G.isZhijiaoCard(ref))cards.push(ref);
      return cards;
    })(),
    equippedTools:[...(s.equippedTools||[])],
    turn:1,
    isFinal:isGaokao, // 兼容旧字段：现仅表示第6章最终高考
    isGaokao:isGaokao,
    isChapterFinal:isChapterFinal,
    playerStatuses:{}, // {rationality, sensibility, serious, spirit, wushi, arrogance, inspiration, careful}
    monsterStatuses:{},
    turnLogicCostReduction:0,
    turnLogicDmgMult:1,
    turnNextDmgBonus:0,
    turnIdeaCardsPlayed:0,
    turnLogicCardsPlayed:0,
    playerUsedCardsThisTurn:[],
    phase:'player', // 'player' | 'monster' | 'animating'
    log:[],
    playRecords:[], // 出牌记录 {side:'p'|'m', name, desc}
    over:false, won:false,
    // Skill cooldowns
    charSkillCd:0,
    qualityUpgradedThisTurn:0,qualityResetUsedTurn:false,qualityShieldedTurn:{},temporaryQuality:[],
    // 情商=热情上限；每10情商使每回合热情回复+1。
    passion:Math.max(0,s.eq||0),
    passionMax:Math.max(0,s.eq||0),
    passionRegen:1 + Math.floor((s.eq||0)/10),
    // ===== 新机制字段 =====
    endurance:0,           // 耐力（程良）
    enduranceConvert:0,    // 忍耐激活后的转化比例（0.6）
    tempMaxHp:0,           // 临时生命上限
    energySpentTotal:0,    // 本场战斗累计消耗体力（小君的赌注）
    battleIdeaCount:0,     // 本场累计使用思路卡数（论据）
    battleLogicCount:0,    // 本场累计使用逻辑卡数（勤卷）
    battleDmgPlus:0,       // 吃冰棍：伤害+1
    wushiCapBonus:s.wushiCapBonus, // 骄傲：无视上限加成
    arroganceTemp:0,       // 临时傲慢层
    dmgReduceTurns:0,      // 减伤剩余回合（万夫莫敌）
    trueDmgBonusTurns:0,   // 真实伤害加成剩余回合
    damageBonusTurns:0,    // 所有伤害加成剩余回合（万夫莫敌）
    noSensConsume:false,   // 素材积累：下一次伤害不消耗感性
    wensiActive:false,     // 文思泉涌
    freePlaysLeft:0,       // 免费使用卡牌次数
    freeDrawCards:{},      // 新的尝试/满分作文：抽到的卡id→本回合0费剩余次数
    nextLogicCostRed:0,    // 备考/冲刺复习：下1张逻辑卡消耗增减
    nextLogicDmgMult:1,    // 备考/冲刺复习：下1张逻辑卡伤害倍率
    lockPlay:false,        // 目中无人：本回合无法使用卡
    eqDoubleTurns:0,       // 考场佳作：情商翻倍剩余回合
    creationEqBoost:0,     // 创作灵感：本回合情商倍率加成
    tempIntTurns:0,        // 收敛一下：临时智力持续回合
    tempIntRestore:0,      // 恢复的傲慢层数
    tempIntArrogance:0,    // 临时智力对应的傲慢层数
    cardNameStacks:{},     // 痴情：卡名→临时情商层数
    combatInt:0,
    cardCostMod:{},        // 奥数之王：卡费用归0标记（存卡ref列表）
    // ===== 谭梓君机制 =====
    globalCostPlus:0,      // 永无止境：所有卡牌费用+2
    regenBonus:0,          // 君姐模式：本场体力回复+1
    nextTurnDrawPenalty:0, // 抢跑：下回合少摸的牌数
    nextTurnDrawBonus:0,   // 熬夜：下回合多摸的牌数
    energySpendHeal:0,     // 热情：每消耗1体力回复的生命（可叠加）
    // ===== 小萌·霜眠机制 =====
    monsterHand:[],        // 怪物手牌（开局2张，出牌无限制打光手牌，回合结束抽2，用户改 2026-08-19）
    monsterDeckBan:{},     // 永久移出游戏的怪物卡名
    monsterExile:[],       // 移出至N回合结束 [{name,untilTurn}]
    monsterDrawPenalty:0,  // 遗忘：怪物每回合少摸（最多2）
    monsterNextDrawPenalty:0, // 熬夜/打瞌睡：下回合少摸
    monsterSleepTurns:0,   // 永恒：怪物手牌沉睡回合数
    enemyDeckSleepingHits:0,
    monsterPlayLimit:null, // 记忆归零：{turns,max}
    monsterNextLogicDmgBonus:0, // 词缀变化：怪物下张伤害卡+2（2026-08-23 补实现）
    playerDiscardedThisTurn:false, // 张冠李戴：玩家本回合是否弃过牌
    playerBonusDraw:0,     // 遗忘：每回合多摸（最多2）
    mengxie:0,             // 梦屑（上限=情商）
    menghen:0,             // 梦痕
    nightmareShackles:0,   // 噩梦枷锁：对手每用1张卡回复体力
    energyBreakTurns:0,    // 噩梦枷锁梦屑版：突破体力上限回合
    pillowUsed:false,      // 课桌用的枕头：已触发
    sleepingCards:(s.sleepingCards=s.sleepingCards||{}), // 沉睡跨战斗，按具体实例引用记录
    // ===== 特供小说buff（2026-08-22）=====
    novelBuff:null,        // 'longzu'|'mojie'|'yinhe'，当前激活的小说（互斥）
    novelTurnsLeft:0,      // buff剩余回合数
    novelMaxSave:null,     // 龙族：开启时保存的原最大生命
    lunjuStack:0,          // 论据（肖清雅重做 2026-08-24）：已打出的论据层数，每2张思路卡+层数×1感性（可叠加）
    lunjuProg:0,           // 论据：距下次触发的思路卡计数
    echoAura:false,        // 弟子规：打出后本场生效——每回合第一张思路卡拥有回响
    echoPending:[],        // 回响：下回合开始要生成的0费临时卡id列表
    creationCards:{},      // 肖清雅创作卡实例：ref→{direction,inspiration,effects,...}
    creationSeq:0,         // 创作卡实例序号
    creationEchoPending:[],// 言情2：下回合生成的创作卡0费临时副本快照
    creationCopySeq:0,     // 创作卡副本序号
    completedWorks:[],     // 本场已打出的创作卡快照，胜利后命名成书
    discardAllAtTurnEnd:false, // 满分作文灵感：回合结束弃置所有手牌
    monsterSilenceUntil:0, // 玄幻8：对方当前手牌沉默至指定回合
    enemyCopies:{},        // 魔幻8：从敌方卡组获得的动态卡
    itemCopies:{},         // 沙漏生成的闪复制
    piggySavings:{},       // 存钱罐按基础卡名记录的储蓄
    shieldItemMult:1,      // 围巾提供的本场护盾倍率
    sleepTalentUsed:false, // 睡觉天赋：本场是否已触发（2026-08-23 补实现）
    secondWindUsed:false,  // 二次呼吸天赋：本场是否已触发（2026-08-23 补实现）
    focusedMindUsed:false, // 专注力天赋：本场首次逻辑卡已用（2026-08-23 补实现）
    cardsPlayedThisBattle:0, // 午休天赋：本场出牌计数（2026-08-23 补实现）
    ferreroUsedTurn:false,
    goodCardsPairUsed:false,
    nightmareFrostOnDiscard:false,
    nightmareDreamDiscard:false,
    wokeThisTurn:0,dreamOnNextFrost:false,preserveNextFrost:false,dreamWakeRemoveSleepingNextTurn:false,flawComboClaimed:{},eyeMaskDreamTurn:false,
    sweepKickUsed:false,
    logicThinkingTurn:0,
    selfCycleSpent:0,
    // ===== 晓萌·无双剑姬 破绽系统 =====
    weaknesses:[], weaknessSeq:0, weakBrokenTurn:0, weakKindsTurn:{},
    duelDanceTemp:null, challengeWeaknesses:[], challengeSlashMeta:{}, nextLogicRepeat:false,
    parry:false, gloryStep:'first', chariotHitThisCard:{}, chariotFirstFlawEffect:{}, flawChoiceQueue:[], flawChoiceOpen:false,
    // ===== 薛诗蕾线（2026-08-24 规范版）=====
    cardCostDelta:{},     // ref→持久费用增减（持续到该牌打出）
    cardCostChanges:{},   // ref→本次进入手牌后费用改变次数
    cardChanged:{},       // ref→【已变更】标记（离开手牌清除）
    cardMultUp:{},        // ref→倍率提升%（先难后易金/举一反三金，持续到打出）
    logicDiscLeft:0,      // 再刷一题：接下来N张逻辑卡-1费
    qinjuanDisc:0,        // 勤卷：下一张逻辑卡消耗-2
    beikao:{n:0,pct:0},   // 备考：接下来N张逻辑卡+1费并获得pct%倍率提升
    xnhyDisc:{amt:0,excl:null}, // 先难后易：下一张其他逻辑卡-N费
    nextLogicDisc:0,      // 反复刷题：下一张逻辑卡-1
    zeroNextGe2:0,        // 选择题秒了(金)：下一张原始消耗≥2的逻辑卡-1
    calmSurch:0,          // 冷静分析：下一张逻辑卡+1费/次
    rationalityGuard:0,   // 冷静分析：本回理性因伤害减少时前N次不减少
    scratchRec:null,      // 草稿推演：{cost,rat,gold}待下一张逻辑卡结算
    lastLogicOrigCost:null, // 再算一种方法：最近使用的逻辑卡原始消耗
    turnLogicCosts:[],    // 本回合逻辑卡使用费用（档位统计）
    turnLogicNames:[],    // 本回合使用过的逻辑卡名（去重）
    turnLogicPlayCosts:{},// 本回合逻辑卡名→使用时消耗（举一反三）
    turnPlayedNames:{},   // 本回合卡名→使用次数（再验算一遍）
    turnMaxLogicDmg:0,    // 本回合单张逻辑卡一次使用最高总伤害（标准答案）
    turnLogicStreak:0,    // 本回合连续使用逻辑卡数（检查一下成就）
    sheinengTurn:0,       // 谁能有我卷？：本回合触发次数（上限3）
    achv:{logic:0, zeroLogic:0, costChanges:0},      // 成就计数（单场累计）
    turnAchv:{logic:0, brackets:[], zeroFromOrigGe2:0, sheineng:0}, // 成就计数（单回合）
  };
  let b = s.battle;
  if((s.nextBattleStartShield||0)>0){b.playerShield+=s.nextBattleStartShield;b.log.push(`🛡️ 纸条研究: 开场获得${s.nextBattleStartShield}护盾`);s.nextBattleStartShield=0;}
  if((s.talents||[]).includes('teacher_cotton_jacket')){let pct=b.isChapterFinal?.15:.25,hit=Math.floor(b.monsterMaxHp*pct);b.monsterHp=Math.max(0,b.monsterHp-hit);b.log.push(`🧥 老师小棉袄: 开场造成${hit}伤害`);}
  if((s.talents||[]).includes('yangwo_qizuo')) { s.tempRallyCount=(s.tempRallyCount||0)+1; b.log.push('🏋️ 仰卧起坐: 获得1次临时【重整旗鼓】'); }
  if((s.talents||[]).includes('kidney_overdraft')) { b.maxEnergy=Math.max(1,b.maxEnergy-1); b.energy=b.maxEnergy; }
  if((s.talents||[]).includes('power')) { b.maxEnergy += 6; b.energy = Math.min(b.maxEnergy, b.energy + 6); b.log.push('💥 力量: 体力上限+6'); }
  // 怪物牌堆：普通战开局2张/每回合2张；期末考开局3张/每回合3张。
  b.monsterDrawPile = [...mData.deck];
  G.shuffleInPlace(b.monsterDrawPile);
  b.monsterBaseDraw = isChapterFinal && !isGaokao ? 3 : 2;
  b.monsterOpeningHand = isChapterFinal && !isGaokao ? 3 : 2;
  let openingPenalty = s.nextBattleMonsterDrawPenalty||0;
  s.nextBattleMonsterDrawPenalty = 0;
  b.monsterOpeningHand = Math.max(0,b.monsterOpeningHand-openingPenalty);
  b.monsterHand = b.monsterDrawPile.splice(0, b.monsterOpeningHand);
  b.monsterDiscard = [];
  if((s.talents||[]).includes('easy_favor') && b.monsterHand.length) { let card=G.pick(b.monsterHand), ref='enemy_copy::'+(++b.creationCopySeq); b.enemyCopies[ref]={card:JSON.parse(JSON.stringify(card)),flash:true}; b.hand.push(ref); }
  if((s.talents||[]).includes('bad_heart')) {
    let prank=()=>({name:'恶作剧',type:'trap',desc:'什么也没有发生。',cost:1,emoji:'🤡'});
    b.monsterDrawPile.push(prank(),prank());
    G.shuffleInPlace(b.monsterDrawPile);
    b.log.push('😈 坏心眼: 向敌方牌组塞入2张恶作剧');
  }
  // Shuffle draw pile
  G.shuffleInPlace(s.battle.drawPile);
  // Apply bond effects
  G.applyBondBattleStart();
  // Draw initial hand (4 cards)
  G.battleDraw(4);
  if((s.talents||[]).includes('run_fast')) G.battleDraw(2);
  if(s.nextBattleDraw){G.battleDraw(s.nextBattleDraw);s.nextBattleDraw=0;}
  // 如初：第一回合摸牌后，手中没有的如初牌才从卡组抽出，不占本次摸牌数。
  let rucuBases=new Set(b.hand.map(G.baseId));
  for(let i=b.drawPile.length-1;i>=0;i--) {
    let cid=b.drawPile[i], cd=G.getCardData(cid), base=G.baseId(cid);
    if(cd&&cd.ruchu&&!rucuBases.has(base)) { b.hand.push(b.drawPile.splice(i,1)[0]); rucuBases.add(base); }
  }
  if((s.talents||[]).includes('deep_breath')) {
    let ei=b.drawPile.findIndex(cid=>{let c=G.getCardData(cid);return c&&(/体力/.test(c.desc||'')||c.energyRestore||c.energyGain);});
    if(ei>=0){b.hand.push(b.drawPile.splice(ei,1)[0]);b.log.push('🌬️ 深呼吸: 抽取1张体力相关卡牌');}
  }
  if((s.talents||[]).includes('hide_snacks')) { b.hand.push('beiyong_lingshi#tmp'); b.log.push('🍫 藏零食: 生成1张备用零食'); }
  if((s.talents||[]).includes('perseverance_wala')) { let sh=Math.floor(22*(b.shieldItemMult||1));b.playerShield+=sh;b.log.push(`🛡️ 毅力哇啦!: 首回合获得${sh}护盾`); }
  if(s.character.id==='liangchaojie'&&s.star>=2){let done=Object.values(s.books||{}).filter(x=>x.completed).length,sh=Math.min(25,done*5);if(sh){b.playerShield+=sh;b.log.push(`📚 【书迷】: 开局获得${sh}护盾`);}}
  // 用具：局外已装备的用具进入战斗已装备状态（无消耗）
  if((s.equippedTools||[]).length) {
    let names=s.equippedTools.map(ref=>G.getCardData(ref)).filter(Boolean).map(td=>`${td.emoji}${td.name}`);
    if(names.length)b.log.push(`🔧 已装备: ${names.join('、')}`);
    G.toolTurnStart(); // 铅笔等回合开始效果（第1回合）
  }
  // 挚友天赋开局效果（天赋池化后按拥有判定：本角色开局拥有，其他角色刷到同样生效）
  let t4 = s.talents || [];
  if(t4.includes('wusuoweiju')) {
    G.addPlayerStatus('wushi', 10);
    b.wushiCapBonus += 8; // +2层骄傲
    b.log.push('⭐ 无所畏惧: +10无视 +2骄傲');
  }
  if(t4.includes('sheineng')) {
    b.sheinengTurn = 0;
    b.log.push('⭐ 谁能有我卷?: 打出带有【已变更】的卡牌时+1层理性（每回合最多3次）');
  }
  if(t4.includes('kuaisu_xuanzhuan')) {
    b.log.push('⭐ 快速旋转: 每回复1体力对敌方造成2点伤害(上限>10双倍)');
  }
  if(t4.includes('dameng_shuixianjue')) {
    b.log.push('⭐ 大梦谁先觉: 战斗中获取的层数+1');
  }
  if(t4.includes('chiqing')) {
    b.cardNameStacks = {};
    b.log.push('⭐ 痴情: 各处同名卡伤害时情商临时+1(无限叠加)');
  }
  if(t4.includes('liangge')) {
    b.log.push('⭐ 坚韧: 护盾获取量提升=已损失生命%');
  }
  if(s.character.id==='xiaomeng_fiora'&&s.star>=2) G.startDuelDanceWeakness();
  // 普通/稀有天赋开局效果（2026-08-23 补实现：原版选了无效果）
  if(t4.includes('sit_straight')) { G.addPlayerStatus('rationality', 2); b.log.push('⭐ 坐正: 开局+2层理性'); }
  if(t4.includes('little_trick')) { b.littleTrickDamageDraws=0; b.log.push('⭐ 一点小巧思: 第一回合前2次造成伤害时摸牌'); }
  if(t4.includes('warmup')) { b.energy += 3; b.log.push('⭐ 热身: 开局+3体力'); }
  if(t4.includes('take_notes')) { // 做笔记: 开局上手一张思路卡与一张逻辑卡
    let li = b.drawPile.findIndex(cid => { let c = G.getCardData(cid); return c && c.type === 'logic'; });
    if(li >= 0) { b.hand.push(b.drawPile.splice(li,1)[0]); b.log.push('⭐ 做笔记: 开局上手一张逻辑卡'); }
    let ii = b.drawPile.findIndex(cid => { let c = G.getCardData(cid); return c && c.type === 'idea'; });
    if(ii >= 0) { b.hand.push(b.drawPile.splice(ii,1)[0]); b.log.push('⭐ 做笔记: 开局上手一张思路卡'); }
  }
  if(t4.includes('borrow_pen')) { // 借笔: 一张随机逻辑卡混入抽牌堆
    let pool = Object.keys(G.CARDS).filter(k => G.CARDS[k].type === 'logic' && !G.CARDS[k].novel && !G.CARDS[k].exhaust && !G.isZhijiaoCard(k));
    if(pool.length) {
      let rid = pool[Math.floor(Math.random()*pool.length)];
      b.drawPile.splice(Math.floor(Math.random()*b.drawPile.length), 0, rid);
      b.log.push(`⭐ 借笔: 随机逻辑卡【${G.CARDS[rid].name}】混入牌组`);
    }
  }
  s.screen = 'battle';
  G._prevHandIds = null; // 新战斗：初始手牌全部播放抽牌入场动画
  G._prevMonsterHandNames = null;
  G.fx.turnBanner('⚔️ 战斗开始', 'start');
  G.render();
};

G.CARD_QUALITY_CHAIN=['green','blue','purple','gold'];
G.cardQualityName=function(q){return ({green:'绿色',blue:'蓝色',purple:'紫色',gold:'金色'})[q]||q;};
G.cardQualityKey=function(ref){let d=G.getCardData(ref),q=(d&&d.q)||((d&&d.type==='answer')?'purple':'green');return q==='white'?'green':q;};
G.cardQualityLevel=function(q){return Math.max(0,G.CARD_QUALITY_CHAIN.indexOf(q));};
G.qualityRef=function(ref,q){return `${G.baseId(ref)}@${q}`;};
G.upgradeHandCard=function(index,toGold,temporary){let s=G.state,b=s.battle,ref=b.hand[index],d=G.getCardData(ref);if(!d)return 0;let baseQ=G.cardQualityKey(G.baseId(ref)),curQ=G.cardQualityKey(ref),from=G.cardQualityLevel(curQ),target=toGold?3:Math.min(3,from+1),levels=Math.max(0,target-from);if(!levels)return 0;let next=G.qualityRef(ref,G.CARD_QUALITY_CHAIN[target]);b.hand[index]=next;b.qualityUpgradedThisTurn++;if(temporary)b.temporaryQuality.push({upgraded:next,original:ref,expires:b.turn});if((s.talents||[]).includes('yueji_tiaozhan')){let key=G.baseId(ref);if(!b.qualityShieldedTurn[key]){b.qualityShieldedTurn[key]=true;b.playerShield+=3;b.log.push('⬆️ 【越级挑战】: 获得3护盾');}}b.log.push(`⬆️ 【${d.name}】品质提升至${G.cardQualityName(G.CARD_QUALITY_CHAIN[target])}`);return levels;};
G.qualityBonusMultiplier=function(cd){if(!(G.state.talents||[]).includes('yueji_tiaozhan'))return 1;let base=G.cardQualityLevel(G.cardQualityKey(G.baseId(cd.ref||cd.id))),cur=G.cardQualityLevel(G.cardQualityKey(cd.ref||cd.id));return 1+Math.max(0,cur-base)*.15;};
G.restoreTemporaryQuality=function(){let b=G.state.battle;if(!b)return;let due=b.temporaryQuality.filter(x=>x.expires<=b.turn),zones=[b.hand,b.drawPile,b.discard,b.exhaust];for(let x of due){for(let zone of zones){let i=zone.indexOf(x.upgraded);if(i>=0){zone[i]=x.original;break;}}}b.temporaryQuality=b.temporaryQuality.filter(x=>x.expires>b.turn);};
G.checkUpgradeCooldownReset=function(cd){let b=G.state.battle;if(!b||G.state.character.id!=='liangchaojie'||b.qualityResetUsedTurn)return;let dmg=b._lastCardTotalDmg||0;if(b.monsterHp<=0||dmg>=b.monsterMaxHp*.2){b.charSkillCd=0;b.qualityResetUsedTurn=true;b.log.push(`🎮 ${cd.name}: 达成升级条件，重置【打怪升级】CD`);}};

// 手牌上限（2026-08-24 薛诗蕾线规则：满手抽牌，多余直接进弃牌堆；【保留】不占上限）
G.HAND_CAP = 10;
G.cardKeptInHand=function(b,ref){let d=G.getCardData(ref);return !!(d&&d.baoliu)||(!!b.turnPreserveHand);};
G.handCount = function(b) {
  return b.hand.filter(cid => !G.cardKeptInHand(b,cid)).length;
};

// 自动笔统一入口：凡是通过“摸到/拿回手牌”进入手牌的卡，都从这里判定，避免不同获取路径漏触发。
G.autoPlayDrawnCard=function(cid){
  let b=G.state.battle;if(!b||b.over||b.phase!=='player'||!G.cardHasItem(cid,'自动笔'))return false;
  let index=b.hand.lastIndexOf(cid);if(index<0)return false;
  b.freeDrawCards=b.freeDrawCards||{};
  let key=(G.getCardData(cid)||{}).id||G.baseId(cid);
  b.freeDrawCards[key]=(b.freeDrawCards[key]||0)+1;
  b.log.push(`✒️ 自动笔: 摸到【${(G.getCardData(cid)||{}).name||cid}】，无消耗打出`);
  G.playCard(index);return true;
};

G.battleDraw = function(count) {
  let b = G.state.battle;
  let drawn=0, drawnRefs=[];
  if(G.sfx && count > 0) G.sfx.play('draw'); // 抽牌音效（2026-08-23）
  // 银河英雄传说(巴黎圣母院)buff：摸牌数量×2（2026-08-22）
  if(b.novelBuff === 'yinhe') count *= 2;
  // 洗牌只在本次摸牌动作开始前检查；摸牌途中耗尽则中断，不在同一次动作中二次洗牌。
  if(b.drawPile.length === 0 && b.discard.length > 0) {
    b.drawPile = b.discard.splice(0, b.discard.length);
    G.shuffleInPlace(b.drawPile);
    b.log.push('🔄 弃牌堆洗入卡组');
  }
  for(let i=0;i<count;i++) {
    if(b.drawPile.length === 0) {
      b.log.push(`🃏 抽牌中断：本次抽牌途中牌库已空（已摸${drawn}/${count}张，下次抽牌前会洗牌）`);
      break;
    }
    let cid = b.drawPile.pop();
    // 满手抽牌（2026-08-24）：手牌达到上限后继续抽牌，多余的卡直接进入弃牌堆
    if(G.handCount(b) >= G.HAND_CAP) {
      b.discard.push(cid);
      let od = G.getCardData(cid);
      b.log.push(`🖐️ 手牌已满，${od ? od.name : cid} 直接进入弃牌堆`);
      continue;
    }
    b.hand.push(cid);
    drawn++;
    drawnRefs.push(cid);
    G.autoPlayDrawnCard(cid);
  }
  if(drawnRefs.length && G.fx && G.fx.drawReveal) G.fx.drawReveal(drawnRefs.length);
  if(drawn>0&&b.nightmareDiscardOnDraw){let n=G.discardMonsterHand(drawn);if(n)b.log.push(`😈 噩梦枷锁: 因摸${drawn}张牌，弃置对手${n}张手牌`);}
  return drawn;
};

// 卡牌数据解析（2026-08-24 薛诗蕾品质变体）：ref 可写作 "id@品质"（如 shuati@gold）；
// 品质链 white→blue→purple→gold→red 逐级向上合并覆盖，基础定义=最低档数值；qv 值为 null 表示删除该字段；
// "id#tmp"（回响临时卡，2026-08-24）：费用归0+打出后移除+不触发回响；无qv/无@/无#tmp则原样返回
// ===== 肖清雅·创作系统（2026-08-26） =====
G.CREATION_DIRECTIONS = {
  horror:{name:'恐怖', emoji:'👁️'}, romance:{name:'言情', emoji:'💞'},
  fantasy:{name:'玄幻', emoji:'⚔️'}, magic:{name:'魔幻', emoji:'🔮'},
};
G.isCreationRef = function(ref) {
  return typeof ref === 'string' && (ref.startsWith('creation::') || ref.startsWith('creation_echo::') || ref.startsWith('creation_turn::'));
};
G.creationState = function(ref) {
  let b = G.state.battle;
  return b && b.creationCards ? b.creationCards[ref] : null;
};
G.creationCardData = function(ref) {
  let st = G.creationState(ref);
  if(!st) return null;
  let dir = G.CREATION_DIRECTIONS[st.direction] || {name:'待定',emoji:'✍️'};
  let cost = Math.max(0, (st.effects || []).reduce((n,e) => n + (e.costDelta || 0), 0));
  if(st.direction === 'magic' && st.inspiration >= 6) cost = 1;
  if(st.temporary && !st.turnCopy) cost = 0; // 回响生成的临时创作卡为0费
  let bonus = [];
  if(st.inspiration >= 2) bonus.push(st.direction==='horror'?'脱手':st.direction==='romance'?'回响':st.direction==='fantasy'?'移除':st.direction==='magic'?'保留':'');
  if(st.inspiration >= 4) bonus.push(st.direction==='horror'?'发动时回复1体力':st.direction==='romance'?'发动时回复5生命':st.direction==='fantasy'?'发动时摸2张':st.direction==='magic'?'发动时洗牌':'');
  if(st.inspiration >= 6) bonus.push(st.direction==='horror'?'消耗>2时属性倍率+0.5':st.direction==='romance'?'消耗<2时属性倍率+0.5':st.direction==='fantasy'?'消耗=2时属性倍率+1':st.direction==='magic'?'消耗恒为1':'');
  if(st.inspiration >= 8) bonus.push(st.direction==='horror'?'弃置对手2张手牌':st.direction==='romance'?'生成本回合复制':st.direction==='fantasy'?'对方手牌沉默1回合':st.direction==='magic'?'获取敌方卡组1张牌':'');
  let effectText = (st.effects || []).map(e => e.text).filter(Boolean);
  return {
    id:ref, ref:ref, name:`创作·${dir.name}`, emoji:dir.emoji, type:'answer', cost:cost,
    q:'purple', creationCard:true, direction:st.direction, inspiration:st.inspiration,
    desc:`灵感 ${st.inspiration}｜${effectText.length ? effectText.join('；') : '尚未加入灵感效果'}${bonus.filter(Boolean).length ? '｜方向强化：'+bonus.filter(Boolean).join('；') : ''}`,
    exhaust:true, tuoshou:st.direction==='horror' && st.inspiration>=2,
    echo:st.direction==='romance' && st.inspiration>=2,
    baoliu:st.direction==='magic' && st.inspiration>=2,
    _tmp:!!st.temporary, _turnCopy:!!st.turnCopy, _attachedItems:[...(st.attachedItems||[])],
  };
};
G.enemyCopyData = function(ref) {
  let b = G.state.battle, st = b && b.enemyCopies ? b.enemyCopies[ref] : null;
  if(!st) return null;
  let d = Object.assign({}, st.card);
  d.id = ref; d.ref = ref; d.name = '借得·' + d.name; d.type = d.type || 'logic'; d.q = 'blue';
  d.desc = '取自敌方卡组：' + (st.card.desc || '');
  if(st.flash) { d.flash=true; d.desc+='【闪：回合结束移除】'; }
  if(d.mShield) { d.fixedShield = d.mShield; delete d.mShield; }
  if(d.mDraw) { d.drawCards = d.mDraw; delete d.mDraw; }
  if(d.mDiscardPlayer) { d.discardMonsterHand = d.mDiscardPlayer; delete d.mDiscardPlayer; }
  delete d.mSelfDiscard; delete d.mDiscardPlayerOrDmg; delete d.mNextLogicBonus;
  return d;
};
G.itemCopyData = function(ref) {
  let b=G.state.battle,st=b&&b.itemCopies&&b.itemCopies[ref];
  if(!st)return null;
  // 修复（2026-09-08）：订书机写入的是卡对象本身，读取却按 {card:卡对象} 访问，
  // 导致 Cannot read properties of undefined (reading 'name')。读取端兼容两种结构，
  // 旧存档中已存入的坏复制牌也能正常解析，不再触发载入崩溃→删档。
  let card=st.card || st;
  return Object.assign({},card,{id:ref,ref:ref,name:'闪·'+card.name,flash:true,desc:'复制原牌效果。回合结束或打出后移除。'});
};
G.makeFlashCopy = function(cd) {
  let out=JSON.parse(JSON.stringify(cd));
  out._attachedItems=G.cardItemsFor(cd).filter(id=>id!=='沙漏');
  return out;
};
// 好牌成双：在第一张真实打出的牌确认进入结算后立即生成，避免选择型/延迟型卡牌结算中断时漏触发。
G.triggerGoodCardsPair = function(cd) {
  let b=G.state.battle;
  if(!b || b.over || !(G.state.talents||[]).includes('good_cards_pair') || cd._tmp || cd.flash || b.goodCardsPairUsed) return false;
  let made=0;
  for(let i=0;i<2;i++) {
    if(cd.creationCard) {
      let st=G.creationState(cd.ref||cd.id);
      if(!st) continue;
      let nr='creation_turn::'+(++b.creationCopySeq);
      b.creationCards[nr]=G.copyCreationState(st,{ref:nr,temporary:true,turnCopy:true,attachedItems:[...(cd._attachedItems||st.attachedItems||[])]});
      if(G.handCount(b)<G.HAND_CAP)b.hand.push(nr);else b.drawPile.push(nr);
      made++;
    } else {
      // 保留当前品质；解析器要求临时标记位于品质标记之前。
      let q=G.cardQualityKey(cd.ref||cd.id), nr=G.baseId(cd.id)+'#tmp@'+q;
      if(G.getCardData(nr)){if(G.handCount(b)<G.HAND_CAP)b.hand.push(nr);else b.drawPile.push(nr);made++;}
    }
  }
  if(!made) return false;
  b.goodCardsPairUsed=true;
  b.log.push(`🃏 好牌成双: 生成${made}张临时复制`);
  return true;
};
G.creationRefInHand = function() {
  let b = G.state.battle;
  if(!b) return null;
  for(let i=b.hand.length-1;i>=0;i--) if(String(b.hand[i]).startsWith('creation::')) return b.hand[i];
  return null;
};
G.addCreativeInspiration = function(sourceCd) {
  let b = G.state.battle, ref = G.creationRefInHand();
  if(!b || !ref || !sourceCd.creativeInspiration) return false;
  let st = b.creationCards[ref];
  st.effects.push(JSON.parse(JSON.stringify(sourceCd.creativeInspiration)));
  st.inspiration++;
  b.log.push(`💡 ${sourceCd.name}: 灵感加入${G.creationCardData(ref).name}（${st.inspiration}）`);
  return true;
};
G.removeLastCreativeInspiration = function() {
  let b = G.state.battle, ref = G.creationRefInHand();
  if(!b || !ref) return false;
  let st = b.creationCards[ref];
  if(!st.effects.length) { b.log.push('✂️ 删改: 创作卡还没有可去除的灵感'); return false; }
  let old = st.effects.pop(); st.inspiration = Math.max(0, st.inspiration - 1);
  b.log.push(`✂️ 删改: 去除「${old.text || '灵感效果'}」（灵感${st.inspiration}）`);
  return true;
};
G.newCreationCard = function() {
  let b = G.state.battle, ref = 'creation::' + (++b.creationSeq);
  b.creationCards[ref] = {ref:ref,direction:null,inspiration:0,effects:[],temporary:false,turnCopy:false,attachedItems:[]};
  if(G.handCount(b) < G.HAND_CAP) b.hand.push(ref); else b.drawPile.push(ref);
  return ref;
};
G.copyCreationState = function(st, patch) {
  return Object.assign(JSON.parse(JSON.stringify(st)), patch || {});
};

G._QV_CHAIN = ['white','blue','purple','gold','red'];
G.cardItemsFor = function(cardOrId) {
  let direct = cardOrId && typeof cardOrId === 'object' ? cardOrId : null;
  let id = typeof cardOrId === 'string' ? cardOrId : (cardOrId && (cardOrId.ref || cardOrId.id));
  let base = G.baseId ? G.baseId(id) : id;
  // 用具卡不能携带道具。旧存档中已经写入的绑定也保持失效且不显示。
  let def = direct || (base && G.CARDS && G.CARDS[base]);
  if(def && def.type === 'tool') return [];
  if(direct && Array.isArray(direct._attachedItems)) return direct._attachedItems;
  return (((G.state && G.state.cardItems) || {})[base] || []).slice(0,3);
};
G.cardHasItem = function(cardOrId, itemId) {
  return G.cardItemsFor(cardOrId).includes(itemId);
};

// 沉睡必须绑定具体卡牌实例，不能再按基础ID让所有同名卡一起沉睡。
G.isSleepingCard = function(ref) {
  let b=G.state&&G.state.battle, s=G.state;
  if(!ref || typeof ref !== 'string') return false;
  return ref.includes('#sleep') || !!((b&&b.sleepingCards&&b.sleepingCards[ref]) || (s&&s.sleepingCards&&s.sleepingCards[ref]));
};
G.wakeCardRef = function(ref) {
  let b=G.state&&G.state.battle, s=G.state;
  if(!ref || typeof ref !== 'string') return false;
  let restored=ref.replace(/#sleep\d+/,''),changed=restored!==ref;
  if(b&&b.sleepingCards) delete b.sleepingCards[ref];
  if(s&&s.sleepingCards) delete s.sleepingCards[ref];
  if(b) {
    for(let zone of ['hand','drawPile','discard','exhaust','equippedTools']) {
      if(!Array.isArray(b[zone])) continue;
      for(let i=0;i<b[zone].length;i++) if(b[zone][i]===ref) { b[zone][i]=restored; changed=true; }
    }
  }
  if(s&&Array.isArray(s.deck)) for(let i=0;i<s.deck.length;i++) if(s.deck[i]===ref) { s.deck[i]=restored; changed=true; }
  return changed;
};
G.makeSleepingRef = function(ref, persist) {
  if(!ref || typeof ref !== 'string') return ref;
  if(ref.includes('#sleep')) return ref;
  let b=G.state.battle, s=G.state, n=(b.sleepSeq||0)+1; b.sleepSeq=n;
  let at=ref.indexOf('@'), base=at>=0?ref.slice(0,at):ref, q=at>=0?ref.slice(at):'';
  let out=base+'#sleep'+n+q;
  b.sleepingCards=b.sleepingCards||{}; b.sleepingCards[out]=true;
  if(persist && !ref.includes('#tmp') && !ref.includes('creation_') && !ref.includes('item_copy::')) {
    s.sleepingCards=s.sleepingCards||{}; s.sleepingCards[out]=true;
    // 将对应的一个实体同步到局外卡组，跨战斗仍只影响这一张。
    let idx=(s.deck||[]).findIndex(x=>G.baseId(x)===G.baseId(ref)&&!G.isSleepingCard(x));
    if(idx>=0) s.deck[idx]=out;
  }
  return out;
};
// 供剧情/任务条件直接查询：不传 itemId 时返回所有携带任意道具的卡牌。
G.deckCardsWithItems = function(itemId) {
  let deck = (G.state && G.state.deck) || [];
  return deck.filter(cardId => itemId ? G.cardHasItem(cardId, itemId) : G.cardItemsFor(cardId).length > 0);
};
// 点读笔/听力学习/哑铃：改为打出绑定卡牌时各触发一次，不再要求该牌本身造成伤害。
G.triggerPlayedCardItems = function(cd) {
  let b=G.state.battle,s=G.state,total=0,itemFactor=1;
  for(let itemId of G.cardItemsFor(cd)) {
    let item=G.CARD_ITEMS[itemId];if(!item)continue;
    let ex=item.bonusDamage;
    if(ex){
      let stat=ex.stat==='intelligence'?G.effectiveInt():(ex.stat==='eq'?G.effectiveEq():(ex.stat==='all'?s.physique+G.effectiveInt()+G.effectiveEq():s.physique));
      let dealt=Math.floor(stat*(ex.mult||0)*itemFactor);
      if((s.talents||[]).includes('fate')) dealt=Math.floor(dealt*(1+Math.floor((s.gold||0)/100)*0.5));
      if(dealt>0&&b.monsterStatuses.shield){let blocked=Math.min(b.monsterStatuses.shield,dealt);b.monsterStatuses.shield-=blocked;dealt-=blocked;}
      if(dealt>0){b.monsterHp-=dealt;G.recordRunDamage('dealt',dealt);total+=dealt;}
      b.log.push(`${item.emoji||'🎒'} ${item.name}: 额外造成${dealt}点伤害`);
    }
    if(item.playShield){let gain=Math.floor(s.physique*item.playShield.mult*(b.shieldItemMult||1)*itemFactor);b.playerShield+=gain;b.log.push(`🍵 茶杯: 获得${gain}护盾`);}
    if(item.discardEnemy){let n=G.discardMonsterHand(Math.floor(item.discardEnemy*itemFactor));b.log.push(`🪝 倒刺: 弃置对方${n}张手牌`);}
    if(item.randomGold){let base=Math.floor(G.randInt(item.randomGold[0],item.randomGold[1])*itemFactor),gain=G.gainGold(base);b.log.push(`🃏 扑克牌: 获得${gain}零花钱`);}
    if(item.healFixed){let before=b.playerHp;b.playerHp=Math.min(b.playerMaxHp+b.tempMaxHp,b.playerHp+Math.floor(item.healFixed*itemFactor));b.log.push(`${item.emoji} ${item.name}: 回复${b.playerHp-before}生命`);}
    if(item.drawIfLow&&b.hand.length<=item.drawIfLow.hand){G.battleDraw(item.drawIfLow.count);b.log.push(`${item.emoji} ${item.name}: 手牌较少，摸${item.drawIfLow.count}张牌`);}
    if(item.energyIfCost&&G.getCardCost(cd,true)>=item.energyIfCost.cost){let n=G.gainEnergy(item.energyIfCost.gain);b.log.push(`${item.emoji} ${item.name}: 回复${n}体力`);}
    if(item.energyDraw){let n=G.gainEnergy(item.energyDraw);G.battleDraw(1);b.log.push(`${item.emoji} ${item.name}: 回复${n}体力并摸1张牌`);}
    if(item.firstFlashCopy&&!cd._tmp&&!cd.flash){let key=G.baseId(cd.ref||cd.id);b.itemFirstFlash=b.itemFirstFlash||{};if(!b.itemFirstFlash[key]){b.itemFirstFlash[key]=true;let ref=`item_copy::${++b.creationCopySeq}`;b.itemCopies[ref]={card:Object.assign({},cd,{ref,flash:true,_attachedItems:[...G.cardItemsFor(cd)]})};b.hand.push(ref);b.log.push(`${item.emoji} ${item.name}: 生成1张【闪】复制`);}}
    if(item.shieldHighest){let gain=Math.floor(Math.max(s.physique,G.effectiveInt(),G.effectiveEq())*item.shieldHighest*itemFactor*(b.shieldItemMult||1));b.playerShield+=gain;b.log.push(`${item.emoji} ${item.name}: 获得${gain}护盾`);}
    if(item.trueIfShield&&b.monsterStatuses.shield>0){let dmg=Math.floor(G.effectiveInt()*item.trueIfShield*itemFactor);b.monsterHp-=dmg;G.recordRunDamage('dealt',dmg);total+=dmg;b.log.push(`${item.emoji} ${item.name}: 穿透护盾造成${dmg}真实伤害`);}
    if(item.timeCapsule&&!cd._tmp&&!cd.flash){b.echoPending.push(cd.ref||cd.id);b.log.push(`${item.emoji} ${item.name}: 下回合生成1张0费【临时】复制`);}
    if(item.retrievePrevious){let idx=b.discard.length-1;while(idx>=0&&G.baseId(b.discard[idx])===G.baseId(cd.ref||cd.id))idx--;if(idx>=0){let got=b.discard.splice(idx,1)[0];b.hand.push(got);b.log.push(`${item.emoji} ${item.name}: 取回【${G.getCardData(got).name}】`);}}
    if(item.kaleidoscope){let high=Math.max(s.physique,G.effectiveInt(),G.effectiveEq()),n=Math.floor(high*item.kaleidoscope*itemFactor*(b.shieldItemMult||1));b.playerShield+=n;b.log.push(`${item.emoji} ${item.name}: 打出卡牌，获得${n}护盾`);if(G.fx&&G.fx.shieldGain)G.fx.shieldGain();}
    if(item.whistle&&cd.type==='logic'){
      let hs=b.hand.map(ref=>G.getCardCost(G.getCardData(ref))).filter(Number.isFinite),max=hs.length?Math.max(...hs):null,count=0;
      if(max!==null)b.hand.forEach(ref=>{let d=G.getCardData(ref);if(d&&G.getCardCost(d)===max&&G.changeCardCost(ref,-1))count++;});
      if(count)b.log.push(`📯 口哨: ${count}张最高费用手牌消耗-1`);
    }
    if(item.ferrero&&!cd._tmp&&!cd.flash&&!b.ferreroUsedTurn){b.ferreroUsedTurn=true;let restored=b.maxEnergy-b.energy;b.energy=b.maxEnergy;b.turnAllCostReduction=(b.turnAllCostReduction||0)+1;b.log.push(`🍫 费列罗: 体力回复至上限（+${restored}），本回合所有手牌消耗-1`);}
    if(item.scarf){b.shieldItemMult=(b.shieldItemMult||1)*1.2;let gain=Math.floor(b.playerHp*b.shieldItemMult);b.playerShield+=gain;b.log.push(`🧣 围巾: 获得${gain}护盾，本场护盾量提升20%`);}
  }
  if(total>0&&G.fx)G.fx.attackMonster(total);
  return total;
};
G.withCardItems = function(cardData, cardId) {
  let ids = G.cardItemsFor(cardId || cardData);
  if(!cardData) return cardData;
  let ref=cardId||(cardData.ref||cardData.id),sleeping=G.isSleepingCard(ref);
  if(!ids.length&&!sleeping)return cardData;
  let out = Object.assign({}, cardData, {ref:ref,_attachedItems:[...ids],sleeping:sleeping});
  if(ids.some(id => G.CARD_ITEMS[id] && G.CARD_ITEMS[id].ruchu)) out.ruchu = true;
  if(ids.some(id => G.CARD_ITEMS[id] && G.CARD_ITEMS[id].tuoshou)) out.tuoshou = true;
  if(ids.some(id => G.CARD_ITEMS[id] && G.CARD_ITEMS[id].echo)) out.echo = true;
  if(ids.some(id => G.CARD_ITEMS[id] && G.CARD_ITEMS[id].exhaust)) out.exhaust = true;
  return out;
};
G.getCardData = function(cardId) {
  if(cardId && typeof cardId === 'object') return cardId; // 已是卡数据对象
  if(typeof cardId !== 'string') return G.CARDS[cardId];
  if(G.isCreationRef(cardId)) return G.creationCardData(cardId);
  if(cardId.startsWith('enemy_copy::')) return G.enemyCopyData(cardId);
  if(cardId.startsWith('item_copy::')) return G.itemCopyData(cardId);
  if(cardId.startsWith('pokongzhan#challenge_')) {
    let d=Object.assign({},G.CARDS.pokongzhan),meta=(G.state.battle&&G.state.battle.challengeSlashMeta[cardId])||{};
    d.id=cardId;d.ref=cardId;d.flash=!meta.temporary;d._tmp=!!meta.temporary;d.allCardTypes=!!meta.allTypes;
    d.name=(d.flash?'闪·':'临时·')+'破空斩';return G.withCardItems(d,'pokongzhan');
  }
  let base = cardId, q = null, tmp = false, borrowed = false;
  let at = cardId.indexOf('@');
  if(at >= 0) { base = cardId.slice(0, at); q = cardId.slice(at + 1); }
  let ht = base.indexOf('#tmp');
  if(ht >= 0) { base = base.slice(0, ht); tmp = true; }
  let hb = base.indexOf('#borrow');
  if(hb >= 0) { base = base.slice(0, hb); borrowed = true; }
  let hs = base.indexOf('#sleep');
  if(hs >= 0) base = base.slice(0, hs);
  let d = G.CARDS[base];
  if(!d) return d;
  if(!q && !tmp && !borrowed) return G.withCardItems(d, cardId);
  if(!G._qvCache) G._qvCache = {};
  if(G._qvCache[cardId]) return G.withCardItems(G._qvCache[cardId], cardId);
  let merged = Object.assign({}, d);
  if(q && d.qv) {
    let idx = G._QV_CHAIN.indexOf(q);
    if(idx < 0) return d;
    for(let i = 1; i <= idx; i++) {
      let tier = G._QV_CHAIN[i];
      if(!d.qv[tier]) continue;
      for(let k in d.qv[tier]) {
        if(d.qv[tier][k] === null) delete merged[k];
        else merged[k] = d.qv[tier][k];
      }
    }
    merged.q = q;
  }
  // 没有品质数值分支的卡仍可记录并显示品质提升。
  if(q && !d.qv) merged.q = q;
  if(tmp) {
    merged.cost = 0;      // 回响临时卡：0费
    merged._tmp = true;   // 临时标记：不触发回响
  }
  if(borrowed) {
    merged.baoliu = true;
    merged.desc = (merged.desc || '') + '【保留】';
  }
  merged.ref = cardId;
  G._qvCache[cardId] = merged;
  return G.withCardItems(merged, cardId);
};
// 同名归一：品质变体(id@品质)与临时卡(id#tmp)按基础id归组（痴情/织女星/牵牛星等同名计数用）
G.baseId = function(ref) {
  if(!ref || typeof ref !== 'string') return ref;
  let s = ref.split('@')[0];
  let h = s.indexOf('#');
  return h >= 0 ? s.slice(0, h) : s;
};

// 至交卡只由对应角色达到5星时随初始卡组获得。
G.zhijiaoCardIds = function() {
  let ids=[];
  for(let ch of Object.values(G.CHARACTERS||{})) {
    let st=ch.stars&&ch.stars[5];
    if(st&&st.deckAdd) ids.push(...st.deckAdd.map(G.baseId));
  }
  return [...new Set(ids)];
};
G.isZhijiaoCard = function(cardOrId) {
  let id=typeof cardOrId==='string'?cardOrId:(cardOrId&&(cardOrId.ref||cardOrId.id));
  return G.zhijiaoCardIds().includes(G.baseId(id));
};

// ===== 薛诗蕾线：费用改变/已变更 体系（2026-08-24 规范版）=====
// 记录1次费用改变（已变更标记 + 成就计数）
G.recordCostChange = function(ref) {
  let b = G.state.battle;
  if(!b) return;
  b.cardCostChanges[ref] = (b.cardCostChanges[ref] || 0) + 1;
  b.cardChanged[ref] = true;
  b.achv.costChanges = (b.achv.costChanges || 0) + 1;
  if(b.achv.costChanges >= 10) G.xslAchvUnlock('huange_shunxu');
};
// 对手牌中一张卡施加持久费用增减（持续到该牌打出；0费再降不算改变）
G.changeCardCost = function(ref, delta) {
  let b = G.state.battle;
  let cd = G.getCardData(ref);
  if(!b || !cd || !delta) return false;
  let cur = G.getCardCost(cd);
  let after = Math.max(0, cur + delta);
  if(after === cur) return false;
  b.cardCostDelta[ref] = (b.cardCostDelta[ref] || 0) + delta;
  G.recordCostChange(ref);
  b.log.push(`✏️ ${cd.name}: 费用${delta > 0 ? '+' : ''}${delta}（当前${after}）`);
  if(G.fx && G.fx.costPulse) G.fx.costPulse();
  return true;
};
// 判断卡牌当前费用是否相对原始费用发生变化；主动增减与临时费用效果均计入【已变更】。
G.isCardCostChanged = function(cardData) {
  if(!cardData || !G.state.battle) return false;
  let ref=cardData.ref||cardData.id, b=G.state.battle;
  return !!b.cardChanged[ref] || (typeof cardData.cost==='number' && G.getCardCost(cardData)!==cardData.cost);
};
// 【已变更】在该牌离开手牌时移除；费用本身是否持续由具体费用效果决定。
G.clearCardHandRecords = function(ref, played) {
  let b = G.state.battle;
  if(!b) return;
  delete b.cardCostChanges[ref];
  delete b.cardMultUp[ref];
  delete b.cardChanged[ref];
  if(played) delete b.cardCostDelta[ref];
};
// 本回合逻辑卡使用过的费用档位数（0/1/2/3+ 四档，奥数压轴题/满分成就用）
G.costBrackets = function(b) {
  let set = {};
  (b.turnLogicCosts || []).forEach(c => { set[c >= 3 ? 3 : c] = true; });
  return Object.keys(set).length;
};
// 薛诗蕾成就解锁（跨局保留）
G.xslAchvUnlock = function(id) {
  let a = G.XSL_ACHV && G.XSL_ACHV[id];
  if(!a) return;
  if(!G.state.character || G.state.character.id !== 'xueshilei') return;
  G.meta.xslAchv = G.meta.xslAchv || {};
  if(G.meta.xslAchv[id]) return;
  G.meta.xslAchv[id] = true;
  G.state.runAchievements = G.state.runAchievements || [];
  if(!G.state.runAchievements.includes(id)) G.state.runAchievements.push(id);
  try { G.saveMeta(); } catch(e) {}
  let card = G.CARDS[a.unlock];
  G.showToast(`🏆 成就达成「${a.name}」（${'★'.repeat(a.star)}${a.q}）：${card ? card.name : ''} 加入卡池！`);
  if(G.sfx) G.sfx.play('talent');
};
G.unlockSpecialTalent=function(id){
  let t=G.TALENTS&&G.TALENTS[id]; if(!t)return;
  G.meta.specialTalents=G.meta.specialTalents||{};
  if(G.meta.specialTalents[id])return;
  G.meta.specialTalents[id]=true; G.saveMeta&&G.saveMeta();
  G.state.runAchievements=G.state.runAchievements||[];
  G.showToast(`🏆 解锁特殊天赋「${t.name}」`);
};

G.getCardCost = function(cardData, forPlay) {
  if(!cardData) return 99;
  let b = G.state.battle;
  let ref = cardData.ref || cardData.id;
  // 魔幻6：创作卡消耗“恒”为1，不受其他费用增减影响。
  if(cardData.creationCard && cardData.direction === 'magic' && cardData.inspiration >= 6) return 1;
  // 奥数之王: 被选中的卡费用归0（直到战斗结束）
  if(b.cardCostMod && b.cardCostMod[ref] > 0) return 0;
  if(cardData.dynamicCost === 'energy') {
    let e = Math.max(0, b.energy);
    return cardData.dynCostMin1 ? Math.max(1, e) : e;
  }
  if(cardData.costAllEnergyMin1) return Math.max(1, b.energy);
  if(b.allHandFreeTurn) return 0;
  if(b.freeDrawCards && (b.freeDrawCards[cardData.id]||0) > 0) return 0; // 新的尝试/满分作文：抽到的卡本回合0费
  if(b.freePlaysLeft > 0) return 0;
  let cost = cardData.cost;
  // 跳远: 体力不大于2时消耗为2
  if(cardData.energyLowCost && b.energy <= cardData.energyLowCost.le) cost = cardData.energyLowCost.cost;
  // Apply bond: poetry reduces idea cost
  if(cardData.type === 'idea' && G.state.activeBonds.poetry) cost = Math.max(0, cost - 1);
  // 灵感: 每层使下一张思路卡消耗-1
  if(cardData.type === 'idea' && b.playerStatuses.inspiration) cost = Math.max(0, cost - b.playerStatuses.inspiration);
  // Apply turn modifiers（逻辑卡专属：再刷一题；备考/冲刺复习的下1张逻辑卡）
  if(cardData.type === 'logic') {
    cost = Math.max(0, cost + b.turnLogicCostReduction);
    if(b.nextLogicCostRed) cost = Math.max(0, cost + b.nextLogicCostRed);
  }
  // ===== 薛诗蕾线（2026-08-24）=====
  // 该牌的持久费用增减（持续到打出：错题重做/先难后易/新的尝试/调整做题顺序等）
  if(b.cardCostDelta && b.cardCostDelta[ref]) cost = Math.max(0, cost + b.cardCostDelta[ref]);
  // 刷完这套卷子：本回合每使用1张其他逻辑卡，本牌消耗-1
  if(cardData.costDownPerTurnLogic && cardData.type === 'logic') cost = Math.max(0, cost - (b.turnLogicCardsPlayed||0) * cardData.costDownPerTurnLogic);
  // 标准答案：本回合使用至少3张逻辑卡后-1费
  if(cardData.biaozhunDiscount && (b.turnLogicCardsPlayed||0) >= 3) cost = Math.max(0, cost - 1);
  // 奥数压轴题：本回合每使用过一种费用档位（0/1/2/3+）-1费
  if(cardData.aoshuDiscount) cost = Math.max(0, cost - G.costBrackets(b));
  // 出牌时的浮动费用（实际结算价：再刷一题/勤卷/备考/冷静分析/先难后易/反复刷题）
  if(forPlay && cardData.type === 'logic') {
    let adj = 0;
    if(b.logicDiscLeft > 0) adj -= 1;
    if(b.qinjuanDisc > 0) adj -= 2;
    if(b.beikao && b.beikao.n > 0) adj += 1;
    if(b.calmSurch > 0) adj += b.calmSurch;
    if(b.xnhyDisc && b.xnhyDisc.amt > 0 && ref !== b.xnhyDisc.excl) adj -= b.xnhyDisc.amt;
    if(b.nextLogicDisc > 0) adj -= 1;
    if(b.zeroNextGe2 > 0 && cardData.cost >= 2) adj -= 1;
    cost = Math.max(0, cost + adj);
  }
  // 永无止境: 本场所有卡牌费用+2
  if(b.globalCostPlus) cost += b.globalCostPlus;
  // 午休天赋: 第一回合前2张牌消耗-1（2026-08-23 补实现）
  if((G.state.talents||[]).includes('nap') && b.turn === 1 && (b.cardsPlayedThisBattle||0) < 2) cost = Math.max(0, cost - 1);
  if((G.state.talents||[]).includes('kidney_overdraft') && (b.playerUsedCardsThisTurn||[]).length === 0) cost = Math.max(0, cost - 2);
  if(b.turnAllCostReduction) cost = Math.max(0, cost - b.turnAllCostReduction);
  if(b.extraTurnCostReduction) cost = Math.max(0, cost - b.extraTurnCostReduction);
  // 卡牌道具「减法套装」：永久使绑定卡牌消耗-1，可与其他费用变化叠加。
  for(let itemId of G.cardItemsFor(cardData)) {
    let item = G.CARD_ITEMS[itemId];
    if(item && item.costDelta) cost = Math.max(0, cost + item.costDelta);
  }
  if(cardData.dreamCostDiscount&&b.mengxie>=(cardData.dreamExtraCost||1))cost=Math.max(0,cost-cardData.dreamCostDiscount);
  return Math.max(0, cost);
};

G.singleDogBonus = function(cd) {
  if(!(G.state.talents||[]).includes('single_dog') || !cd) return 0;
  let key=G.baseId(cd.id), n=0;
  for(let ref of (G.state.deck||[])) if(G.baseId(ref)===key) n++;
  return n===1 ? 0.2 : 0;
};

G.getCardLifeCost = function(cardData) {
  if(!cardData || !cardData.lifeCostPct) return 0;
  let b = G.state.battle;
  let base = cardData.lifeCostOf === 'current' ? b.playerHp : b.playerMaxHp;
  return Math.floor(base * cardData.lifeCostPct / 100);
};

G.canPlay = function(cardData) {
  if(!cardData) return false;
  let b = G.state.battle;
  if(b.over) return false; // 修复（2026-08-19）：战斗结束后（胜负已分）不可再出牌
  if(b.phase !== 'player' || b.lockPlay) return false;
  // 压轴（薛诗蕾线关键词）：仅当手牌中除该牌外没有其他卡牌时才可以使用
  if(cardData.yazhou) {
    let ref = cardData.ref || cardData.id;
    if(b.hand.some(r => r !== ref)) return false;
  }
  let cost = G.getCardCost(cardData, true);
  if(b.energy < cost) return false;
  let lifeCost = G.getCardLifeCost(cardData);
  if(lifeCost > 0 && b.playerHp - lifeCost < 1) return false;
  // 苏醒: 需要3梦痕
  if(cardData.menghenCost && b.menghen < cardData.menghenCost) return false;
  // 特供小说互斥：沉浸期间不能再打出别的小说（2026-08-23 改版：普通卡牌，无每回合上手/单场单次限制，
  // 一本读完（或移除的卡已进移除堆）后仍可沉浸下一本）
  if(cardData.novel && b.novelBuff) return false;
  return true;
};

// 条件达成亮红光（2026-09-09）：按当前战斗状态前瞻判定该卡打出时是否触发条件加成。
// 判定口径与结算代码保持一致（费用条件用当前消耗，破绽/弃牌/苏醒等按本回合计数）。
G.cardConditionMet = function(cd, cardId) {
  let b = G.state.battle;
  if(!b || !cd) return false;
  let ref = cardId || cd.ref || cd.id;
  // 压轴：手牌中除该牌外没有其他卡牌
  if(cd.yazhou) return !b.hand.some(r => r !== ref);
  let curCost = G.getCardCost(cd, true);
  // 刷题：当前消耗为2
  if(cd.extraIfCost2 && curCost === 2) return true;
  // 选择题秒了：0费改倍率
  if(cd.zeroMult && curCost === 0) return true;
  // 狠狠刷题/超纲题：每高1费；这题有捷径：每降1费（仅正向条件亮光）
  if(cd.aboveBonus && curCost > (cd.cost || 0)) return true;
  if(cd.belowBonus && curCost < (cd.cost || 0)) return true;
  // 思路卡之后
  if(cd.multAfterIdea && (b.turnIdeaCardsPlayed || 0) > 0) return true;
  // 起床气：本回合有卡牌苏醒过
  if(cd.multIfWokeThisTurn && (b.wokeThisTurn || 0) > 0) return true;
  // 本回合击破过破绽
  if(cd.multIfFlawBroken && (b.weakBrokenTurn || 0) > 0) return true;
  // 张冠李戴：本回合弃置过卡牌
  if(cd.dmgMultIfPlayerDiscarded && b.playerDiscardedThisTurn) return true;
  // 摘抄：弃牌堆有逻辑卡
  if(cd.sensIfDiscardLogic && (b.discard || []).some(cid => { let d = G.getCardData(cid); return d && d.type === 'logic'; })) return true;
  // 自信满满：傲慢>无视
  if(cd.drawIfArroganceGtWushi && G.arroganceTotal() > G.wushiLayers()) return true;
  // 三种破绽
  if(cd.repeatIfThreeFlawKinds) {
    let kinds = {};
    (b.weaknesses || []).forEach(w => { kinds[w.type] = true; });
    if(Object.keys(kinds).length >= 3) return true;
  }
  return false;
};

// 结算一张已打出卡的收尾（弃牌/移除、计数、死亡判定、渲染）
G.finishCard = function(cd) {
  let b = G.state.battle;
  if(b) b._cardResolutionBusy = false;
  if(b&&b.wokeThisTurn>=13&&G.state.character&&G.state.character.id==='xiaomeng') G.unlockSpecialTalent('yangwo_qizuo');
  if(b&&b.sleepWakeOnLeave&&b.sleepWakeOnLeave[cd.ref||cd.id]){let ref=cd.ref||cd.id;delete b.sleepingCards[ref];delete b.sleepWakeOnLeave[ref];delete G.state.sleepingCards[ref];b.wokeThisTurn=(b.wokeThisTurn||0)+1;}
  // 回响判定（肖清雅重做 2026-08-24）：是否为「本回合第一张思路卡」须在计数增加前记录；
  // 弟子规光环在 applyCardEffect 里激活，此时已经生效，故在此处判定
  let wasFirstIdea = (cd.type === 'idea' && b.turnIdeaCardsPlayed === 0);
  let playedRef = cd.ref || cd.id;
  if(G.toolActive('menghuaian_notebook')) {
    if(cd.cardStatType === 'intelligence') { b.playerShield += 3; b.log.push('📓 笔记本: 打出智力牌，获得3点护盾'); }
    if(cd.cardStatType === 'eq') { let hp=Math.min(b.playerMaxHp+b.tempMaxHp,b.playerHp+3)-b.playerHp; b.playerHp+=hp; b.log.push(`📓 笔记本: 打出情商牌，回复${hp}点生命`); }
  }
  if(cd.revealFlawAfter){let t=G.handFlawPriority(1)[0]||G.pick(G.WEAK_TYPES),w=G.addWeakness(t,'card',false);if(w)b.log.push(`⚔️ ${cd.name}: 展示【${G.WEAK_NAMES[t]}破绽】`);}
  if(cd.sleepOnPlay){playedRef=G.makeSleepingRef(playedRef,true);b.log.push(`😴 【${cd.name}】陷入【沉睡】`);}
  if(cd.exhaust || cd.flash) b.exhaust.push(playedRef);
  else b.discard.push(playedRef);
  let talents=G.state.talents||[];
  if(talents.includes('unlimited_fire')) G.gainEnergy(2);
  if(talents.includes('power')) G.gainEnergy(2);
  if(talents.includes('super_brain') && cd.type!=='answer') { b.combatInt=(b.combatInt||0)+1; G.state.combatEq+=1; b.log.push('🧠 超强大脑: 智力与情商各+1'); }
  if(talents.includes('gold_sales')) { b.monsterDrawPile.push({name:'广告单',type:'trap',cost:1,desc:'无效果。【移除】',exhaust:true}); b.log.push('📢 金牌销售: 敌方卡组加入【广告单】'); }
  if(cd.type === 'idea') {
    b.turnIdeaCardsPlayed++; b.battleIdeaCount++;
    if(cd.id === 'lunju') b.lunjuStack++; // 论据（肖清雅重做）：每张+1层，效果可叠加
  }
  if(cd.type === 'logic') {
    b.turnLogicCardsPlayed++; b.battleLogicCount++;
    if((G.state.talents||[]).includes('logical_thinking') && b.logicThinkingTurn<3) {
      b.logicThinkingTurn++;let sh=Math.floor(4*(b.shieldItemMult||1));b.playerShield+=sh;b.log.push(`🧩 逻辑思维: +${sh}护盾`);
    }
    // 备考/冲刺复习：加成只作用于下1张逻辑卡，出完即消耗
    b.nextLogicCostRed = 0;
    b.nextLogicDmgMult = 1;
  }
  if(cd.type === 'logic' && talents.includes('rapper')) {
    let pool = Object.values(G.CARDS).filter(d=>d&&d.type==='idea'&&!G.isZhijiaoCard(d.id));
    if(pool.length) {
      let generated={...G.pick(pool),flash:true,ref:'rapper_flash::'+(++b.creationCopySeq)};
      b.log.push(`🎙️ 说唱家: 自动使用【闪·${generated.name}】`);
      let deferred = G.applyCardEffect(generated);
      if(!deferred) G.finishCard(generated);
    }
  }
  // ===== 薛诗蕾线：出牌追踪/成就（2026-08-24）=====
  let ref = cd.ref || cd.id;
  if(cd.type !== 'logic') b.turnLogicStreak = 0;
  if(cd.type === 'logic') {
    let lc = b._lastCost || 0;
    b.turnLogicStreak++;
    b.turnPlayedNames[cd.name] = (b.turnPlayedNames[cd.name] || 0) + 1;
    let bracket = Math.min(3, lc);
    if(!b.turnLogicCosts.includes(bracket)) b.turnLogicCosts.push(bracket);
    if(!b.turnLogicNames.includes(cd.name)) b.turnLogicNames.push(cd.name);
    b.turnLogicPlayCosts[cd.name] = lc;
    b.lastLogicOrigCost = cd.cost;
    b.turnMaxLogicDmg = Math.max(b.turnMaxLogicDmg, b._lastCardTotalDmg || 0);
    // 成就计数
    b.achv.logic++;
    b.turnAchv.logic++;
    if(lc === 0) b.achv.zeroLogic++;
    if(lc === 0 && (cd.cost || 0) >= 2) {
      b.turnAchv.zeroFromOrigGe2++;
      if(b.turnAchv.zeroFromOrigGe2 >= 3) G.xslAchvUnlock('jiandan_yidian');
    }
    if((cd.cost || 0) <= 2 && lc >= 4) G.xslAchvUnlock('zheti_buduijin');
    if((b.cardCostChanges[ref] || 0) >= 3) G.xslAchvUnlock('silu_dakai');
    if(b.achv.logic >= 10) G.xslAchvUnlock('zailai_yitao');
    if(b.achv.zeroLogic >= 5) G.xslAchvUnlock('zhege_wuhui');
    if(b.turnLogicStreak >= 3) G.xslAchvUnlock('jiancha_yixia');
    if(b.turnLogicCardsPlayed >= 5) G.xslAchvUnlock('caozhi_bugou');
  }
  // 新的尝试/满分作文：抽到的卡0费次数消耗1层
  if(b.freeDrawCards && (b.freeDrawCards[cd.id]||0) > 0) b.freeDrawCards[cd.id]--;
  // 论据（肖清雅重做 2026-08-24）：本场每使用2张思路卡，获得已打出论据层数×1层感性（可叠加）
  if(cd.type === 'idea' && b.lunjuStack > 0) {
    b.lunjuProg++;
    if(b.lunjuProg >= 2) {
      b.lunjuProg = 0;
      G.addPlayerStatus('sensibility', b.lunjuStack);
      b.log.push(`📖 论据: +${b.lunjuStack}层感性`);
    }
  }
  // 勤卷(薛诗蕾2星): 每使用3张逻辑卡，下一张逻辑卡消耗-2（2026-08-24 规范版）
  let ch = G.state.character;
  if(cd.type === 'logic' && G.state.star >= 2 && ch.stars[2] && ch.stars[2].passive === 'qinjuan' && b.battleLogicCount % 3 === 0) {
    b.qinjuanDisc = 2;
    b.log.push('⭐ 勤卷: 下一张逻辑卡消耗-2');
  }
  // 扳手(用具): 每打出三张逻辑卡，复原手牌中的逻辑卡（移除沉默/费用更改/封印）
  if(cd.type === 'logic' && G.toolActive('wrench') && b.battleLogicCount % 3 === 0) {
    let restored = 0;
    for(let cid of b.hand) {
      let hc = G.getCardData(cid);
      if(hc && hc.type === 'logic') {
        let hr = hc.ref || hc.id;
        if(b.cardCostMod[cid] || b.cardCostDelta[hr]) {
          delete b.cardCostMod[cid];
          delete b.cardCostDelta[hr];
          delete b.cardCostChanges[hr];
          delete b.cardChanged[hr];
          restored++;
        }
      }
    }
    b.log.push(restored > 0 ? `🔧 扳手: 复原了${restored}张逻辑卡` : '🔧 扳手: 手牌逻辑卡无异常状态');
  }
  // 谁能有我卷?(挚友天赋): 打出带有【已变更】的卡牌时+1层理性，每回合最多3次（2026-08-24 规范版）
  if(G.state.talents.includes('sheineng') && b.cardChanged[ref] && b.sheinengTurn < 3) {
    b.sheinengTurn++;
    b.turnAchv.sheineng++;
    G.addPlayerStatus('rationality', 1);
    b.log.push('⭐ 谁能有我卷?: 已变更卡牌打出，+1层理性');
    if(b.turnAchv.sheineng >= 3 && b.turnAchv.logic >= 6) G.xslAchvUnlock('sheineng_achv');
  }
  // 卡牌离开手牌：清除"本次进入手牌"的记录（费用增减已在打出时清除）
  G.clearCardHandRecords(ref, true);
  // 痴情(挚友天赋): 该同名卡后续伤害时情商临时+1（同名按基础id归组，品质变体/临时卡算同一张）
  if(G.state.talents.includes('chiqing')) {
    let nk = G.baseId(cd.id);
    b.cardNameStacks[nk] = (b.cardNameStacks[nk] || 0) + 1;
  }
  // 文思泉涌: 本回合每使用一张思路卡+1感性
  if(cd.type === 'idea' && b.wensiActive) {
    G.addPlayerStatus('sensibility', 1);
    b.log.push('💡 文思泉涌: +1感性');
  }
  // 肖清雅新机制：带“灵感”词条的卡打出后，把其灵感效果加入手中的创作卡。
  if(cd.creativeInspiration) G.addCreativeInspiration(cd);
  // 钢笔：装备后每打出一张思路卡获得1层感性。
  if(cd.type === 'idea' && G.toolActive('fountain_pen')) {
    G.addPlayerStatus('sensibility', 1);
    b.log.push('🖋️ 钢笔: +1层感性');
  }
  // 灵感: 使用思路卡后移除所有灵感
  if(cd.type === 'idea' && b.playerStatuses.inspiration) b.playerStatuses.inspiration = 0;
  // 回响（肖清雅重做 2026-08-24）：非临时卡带【回响】（自身词条或弟子规光环授予）打出后，
  // 下一回合开始在手中生成一张0费同名临时卡（满手时生成在卡组）
  let talentEcho=(G.state.talents||[]).includes('sing_loud') && b.cardsPlayedThisBattle===1;
  if(cd.creationCard && !cd._tmp && !cd.flash && !cd.temporary && (cd.echo||talentEcho)) {
    let st = G.creationState(cd.ref || cd.id);
    if(st) b.creationEchoPending.push(G.copyCreationState(st,{temporary:true,turnCopy:false}));
    b.log.push(`🔁 ${cd.name}: 回响蓄势，下回合生成0费临时创作卡`);
  } else if(!cd._tmp && !cd.flash && (cd.echo || talentEcho || (b.echoAura && wasFirstIdea))) {
    b.echoPending.push(cd.id);
    b.log.push(`🔁 ${cd.name}: 回响蓄势，下回合生成0费临时卡`);
  }
  if(!cd._tmp && !cd.flash && talents.includes('pianist')) b.echoPending.push(cd.id);
  if(G.cardHasItem(cd,'沙漏') && !cd._tmp && !cd.flash && !b.over) {
    let nr='item_copy::'+(++b.creationCopySeq);
    b.itemCopies[nr]={card:G.makeFlashCopy(cd)};
    if(G.handCount(b)<G.HAND_CAP)b.hand.push(nr);else b.drawPile.push(nr);
    b.log.push(`⌛ 沙漏: 获得【闪·${cd.name}】`);
  }
  if(G.cardHasItem(cd,'蕾丝边手套') && cd._itemWasRightmost && cd._itemLeftmostId && !b.over) {
    let li=b.hand.indexOf(cd._itemLeftmostId);
    if(li>=0){let left=b.hand[li],freeKey=(G.getCardData(left)||{}).id||left;b.freeDrawCards[freeKey]=(b.freeDrawCards[freeKey]||0)+1;b.log.push('🧤 蕾丝边手套: 无消耗打出最左侧卡牌');G.playCard(li);}
  }
  // Check monster death
  if(b.monsterHp <= 0 && !b.over) {
    b.over = true; b.won = true;
    b.log.push('🎉 击败了 ' + b.monsterData.name + '！');
  }
  G.render();
};

G.WEAK_TYPES=['logic','idea','answer','tool'];
G.WEAK_NAMES={logic:'逻辑',idea:'思路',answer:'解答',tool:'用具'};
G.handFlawPriority=function(limit){
  let b=G.state.battle,counts={};G.WEAK_TYPES.forEach(t=>counts[t]=0);
  (b.hand||[]).forEach(ref=>{let d=G.getCardData(ref);if(!d)return;let ts=(d.allCardTypes||d._allTypes)?G.WEAK_TYPES:[d.type];ts.forEach(t=>{if(G.WEAK_TYPES.includes(t))counts[t]++;});});
  let shuffled=[...G.WEAK_TYPES].sort(()=>Math.random()-.5);
  return shuffled.sort((a,c)=>counts[c]-counts[a]).slice(0,limit||1);
};
G.startDuelDanceWeakness=function(){
  let b=G.state.battle;if(!b||G.state.character.id!=='xiaomeng_fiora'||G.state.star<2)return;
  let existing=new Set(b.weaknesses.map(w=>w.type)),pool=G.WEAK_TYPES.filter(t=>!existing.has(t));
  if(!pool.length)return;let w=G.addWeakness(G.pick(pool),'duel_dance',true);b.duelDanceTemp=w.id;b.log.push(`💃 决斗之舞: 展示【${G.WEAK_NAMES[w.type]}破绽】`);
};
G.reduceByParry=function(dmg){
  let b=G.state.battle;if(!b.parry||dmg<=0)return dmg;b.parry=false;
  let reduced=Math.ceil(dmg*.9),left=Math.max(0,dmg-reduced);b.log.push(`🛡️ 招架: 本次伤害降低${reduced}`);
  if(b.monsterHand.length){let i=Math.floor(Math.random()*b.monsterHand.length),c=b.monsterHand.splice(i,1)[0];b.monsterDiscard.push(c);b.log.push(`⚔️ 招架成功: 弃置对方【${c.name}】`);}
  return left;
};
G.addWeakness = function(type,source,temp){
  let b=G.state.battle;if(!b||!G.WEAK_TYPES.includes(type))return null;
  // 同一种破绽同时只能存在一个；重复施加只沿用当前破绽，不叠加层数或副本。
  let existing=(b.weaknesses||[]).find(w=>w.type===type);
  if(existing)return existing;
  let w={id:++b.weaknessSeq,type,source:source||'other',temp:!!temp};b.weaknesses.push(w);return w;
};
G.addChallengeWeaknesses = function(cd){
  let b=G.state.battle;b.challengeWeaknesses=[];
  for(let type of G.WEAK_TYPES){let w=G.addWeakness(type,'challenge',true);b.challengeWeaknesses.push(w.id);}
  b.challengeCard={temp:!!cd.challengeTemp,slashAll:!!cd.challengeSlashAllTypes,broken:{},healed:false};
  b.log.push('⚔️ 无双挑战: 展示逻辑、思路、解答、用具四种破绽');
};
G.availableFlawTypes=function(cd){
  let b=G.state.battle,s=G.state;if(!b||s.character.id!=='xiaomeng_fiora')return false;
  let types=cd.allCardTypes||cd._allTypes?G.WEAK_TYPES:[cd.type];
  let chariot=(s.talents||[]).includes('chariot');
  if(chariot)return types.filter((t,i)=>G.WEAK_TYPES.includes(t)&&types.indexOf(t)===i&&!b.chariotHitThisCard[t]);
  return types.filter((t,i)=>types.indexOf(t)===i&&(b.weaknesses||[]).some(w=>w.type===t));
};
G.applyFlawBreakEffect=function(type,cd,extra){
  let b=G.state.battle,td=Math.floor(G.effectiveInt()*(2+(cd.flawDamageBonus||0))),maxHp=b.playerMaxHp+b.tempMaxHp;
  b.monsterHp-=td; G.recordRunDamage('dealt',td);
  let before=b.playerHp,heal=Math.max(1,Math.floor(maxHp*.05));b.playerHp=Math.min(maxHp,b.playerHp+heal);
  b.log.push(`${extra?'🏇 战车追加':'🎯 击破'}【${G.WEAK_NAMES[type]}破绽】，造成${td}点真实伤害，回复${b.playerHp-before}生命`);
};
G.breakFlawType=function(cd,type){
  let b=G.state.battle,s=G.state,chariot=(s.talents||[]).includes('chariot'),chosen=null;
  if(chariot){if(b.chariotHitThisCard[type])return false;b.chariotHitThisCard[type]=true;chosen={type,source:'chariot'};}
  else {for(let i=b.weaknesses.length-1;i>=0;i--){if(b.weaknesses[i].type===type){chosen=b.weaknesses[i];b.weaknesses.splice(i,1);break;}}}
  if(!chosen)return false;
  b.weakBrokenTurn++;b.weakKindsTurn[chosen.type]=(b.weakKindsTurn[chosen.type]||0)+1;
  if(b.flawComboActive)G.resolveFlawComboRewards();
  G.applyFlawBreakEffect(chosen.type,cd,false);
  if(chariot&&!b.chariotFirstFlawEffect[chosen.type]){b.chariotFirstFlawEffect[chosen.type]=true;G.applyFlawBreakEffect(chosen.type,cd,true);}
  if(cd.weakHeal){let before=b.playerHp;b.playerHp=Math.min(b.playerMaxHp+b.tempMaxHp,b.playerHp+cd.weakHeal);b.log.push(`💚 ${cd.name}: 回复${b.playerHp-before}生命`);}
  if(b.challengeCard){
    b.challengeCard.broken[chosen.type]=true;
    let ref='pokongzhan#challenge_'+(++b.weaknessSeq);
    b.challengeSlashMeta[ref]={temporary:b.challengeCard.temp,allTypes:b.challengeCard.slashAll};
    if(G.handCount(b)<G.HAND_CAP)b.hand.push(ref);else b.drawPile.push(ref);
    b.log.push(`⚔️ 无双挑战: 击破${G.WEAK_NAMES[chosen.type]}破绽，生成1张${b.challengeCard.temp?'临时':'闪·'}破空斩`);
    if(!b.challengeCard.healed&&G.WEAK_TYPES.every(t=>b.challengeCard.broken[t])){b.challengeCard.healed=true;let heal=Math.floor((b.playerMaxHp+b.tempMaxHp)*.25),before=b.playerHp;b.playerHp=Math.min(b.playerMaxHp+b.tempMaxHp,b.playerHp+heal);b.log.push(`🏆 无双挑战: 四种破绽全部击破，回复${b.playerHp-before}生命`);}
  }
  if(chariot&&G.WEAK_TYPES.every(t=>(b.weakKindsTurn[t]||0)>0)){for(let t of G.WEAK_TYPES)b.weakKindsTurn[t]--;b.combatInt+=2;b.log.push('🏇 战车: 四种破绽各击破1个，本场智力+2');}
  if(b.weakBrokenTurn>=8&&!(s.talents||[]).includes('chariot')){s.talents.push('chariot');b.log.push('🔴 一回合击破8个破绽，解锁并获得【战车】');}
  return true;
};
G.resolveFlawComboRewards=function(){let b=G.state.battle,n=Object.keys(b.weakKindsTurn).filter(t=>b.weakKindsTurn[t]>0).length,c=b.flawComboClaimed||(b.flawComboClaimed={});if(n>=1&&!c[1]){c[1]=true;G.battleDraw(1);b.log.push('✨ 华丽连招·一式: 摸1张牌');}if(n>=2&&!c[2]){c[2]=true;G.gainEnergy(2);b.log.push('✨ 华丽连招·二式: 回复2体力');}if(n>=3&&!c[3]){c[3]=true;b.nextLogicRepeat=true;b.log.push('✨ 华丽连招·三式: 下一张逻辑卡额外发动1次');}if(n>=4&&!c[4]){c[4]=true;b.charSkillCd=0;b.log.push('✨ 华丽连招·四式: 重置【决斗】CD');}};
G.processFlawChoiceQueue=function(){
  let b=G.state.battle;if(!b||b.flawChoiceOpen)return;
  let entry=b.flawChoiceQueue.shift();if(!entry)return;
  let types=G.availableFlawTypes(entry.cd)||[];
  if(!types.length){G.processFlawChoiceQueue();return;}
  // 同一次效果匹配多个破绽时随机击破一个，不再弹出选择框。
  G.breakFlawType(entry.cd,G.pick(types));
  G.processFlawChoiceQueue();
};
G.triggerWeakpoint = function(cd){
  let types=G.availableFlawTypes(cd)||[];if(!types.length)return false;
  let hit=G.breakFlawType(cd,types.length===1?types[0]:G.pick(types));
  if(hit&&cd.onFlawEnergy)G.gainEnergy(cd.onFlawEnergy);
  if(hit&&cd.onFlawNextLogicCost)G.state.battle.nextLogicCostRed=(G.state.battle.nextLogicCostRed||0)+cd.onFlawNextLogicCost;
  return hit;
};
G.rollChance = function(p) {
  let r = Math.random() < p;
  if(G.state.character && G.state.character.id === 'menghuaian' && G.state.star >= 2) r = r || Math.random() < p;
  return r;
};
G.gainRandomCardOfType = function(type) {
  let b=G.state.battle;
  if(!b)return null;
  let pool=Object.values(G.CARDS).filter(c=>c&&!c.novel&&!G.isZhijiaoCard(c.id)&&((type==='eq'&&c.cardStatType==='eq')||(type==='intelligence'&&c.cardStatType==='intelligence')));
  if(!pool.length)return null;
  let c=G.pick(pool),ref=c.id;
  if(G.handCount(b)<G.HAND_CAP)b.hand.push(ref);else b.drawPile.push(ref);
  return c;
};
G.drawCardOfType=function(type){let b=G.state.battle,idx=b.drawPile.findIndex(ref=>{let d=G.getCardData(ref);return d&&d.type===type;});if(idx<0)return false;let ref=b.drawPile.splice(idx,1)[0];if(G.handCount(b)<G.HAND_CAP){b.hand.push(ref);G.autoPlayDrawnCard(ref);}else b.drawPile.push(ref);return true;};

G.playCard = function(handIndex) {
  let s = G.state, b = s.battle;
  if(b.phase !== 'player') return;
  // 选择类卡牌结算期间禁止点击底层牌区，避免上一张牌尚未完成时再次出牌。
  if(G._choiceOptions || G._pendingCardId || b._cardResolutionBusy) return;
  // 拖牌/触屏在同一释放动作中偶尔会重复派发提交事件。
  // 保护同一张实体牌在极短时间内只进入一次结算，避免看起来像牌没有离开手牌。
  let cardId = b.hand[handIndex];
  let cd = G.getCardData(cardId);
  if(!cd) return;
  if(!G.canPlay(cd)) return;
  let now = Date.now();
  if(b._lastPlaySubmit && b._lastPlaySubmit.cardId === cardId && now - b._lastPlaySubmit.at < 250) return;
  b._lastPlaySubmit = {cardId:cardId, at:now};

  cd._itemWasRightmost = handIndex === b.hand.length - 1;
  cd._itemLeftmostId = b.hand.length > 1 ? b.hand[0] : null;

  // Remove from hand
  b.hand.splice(handIndex, 1);
  b._cardResolutionBusy = true;
  // 先刷新牌区，避免延迟选择期间旧卡面仍显示在手牌中。
  if(G.render) G.render();
  G.claimPiggySavings(cardId);
  // Pay cost（2026-08-24：forPlay=实际结算价，含薛诗蕾线浮动费用）
  let ref = cd.ref || cd.id;
  let cost = G.getCardCost(cd, true);
  // 费用与原始值不同的牌，在效果结算前统一获得【已变更】，供卡牌与天赋判定。
  if(typeof cd.cost==='number' && cost!==cd.cost) b.cardChanged[ref]=true;
  // 出牌时浮动费用消耗：每个生效效果记1次费用改变（已变更）；0费直通路径（免费次数/奥数之王归0）不触发
  b._beikaoPct = 0;
  if(cd.type === 'logic' && !(b.freePlaysLeft > 0) && !b.allHandFreeTurn
     && !(b.freeDrawCards && (b.freeDrawCards[cd.id]||0) > 0) && !(b.cardCostMod && b.cardCostMod[ref] > 0)) {
    let applied = 0;
    if(b.logicDiscLeft > 0) { b.logicDiscLeft--; applied++; }
    if(b.qinjuanDisc > 0) { b.qinjuanDisc = 0; applied++; }
    if(b.nextLogicDisc > 0) { b.nextLogicDisc = 0; applied++; }
    if(b.zeroNextGe2 > 0 && cd.cost >= 2) { b.zeroNextGe2 = 0; applied++; }
    if(b.beikao && b.beikao.n > 0) { b.beikao.n--; b._beikaoPct = b.beikao.pct || 0; applied++; }
    if(b.calmSurch > 0) { b.calmSurch = 0; applied++; }
    if(b.xnhyDisc && b.xnhyDisc.amt > 0 && ref !== b.xnhyDisc.excl) { b.xnhyDisc = {amt:0,excl:null}; applied++; }
    for(let k = 0; k < applied; k++) G.recordCostChange(ref);
  }
  if(b.freePlaysLeft > 0) { b.freePlaysLeft--; cost = 0; }
  b._lastCost = cost;
  b._lastCardTotalDmg = 0;
  let spentBefore = b.energySpentTotal;
  b.energy -= cost;
  b.energySpentTotal += cost;
  if(cost>0 && (s.talents||[]).includes('qinlao')){
    let before=Math.floor((s.qinlaoEnergySpent||0)/40);
    s.qinlaoEnergySpent=(s.qinlaoEnergySpent||0)+cost;
    let gain=Math.floor(s.qinlaoEnergySpent/40)-before;
    if(gain>0&&!(s.character&&s.character.physiqueLocked)){s.physique+=gain;s.maxHp=s.physique*5;s.hp=Math.min(s.hp+gain*5,s.maxHp);b.log.push(`🧹 勤劳: 体魄+${gain}`);}
  }
  if(cost>0 && (G.state.talents||[]).includes('self_cycle')) {
    let before=Math.floor((b.selfCycleSpent||0)/5);
    b.selfCycleSpent=(b.selfCycleSpent||0)+cost;
    let restores=Math.floor(b.selfCycleSpent/5)-before;
    if(restores>0){G.gainEnergy(restores);b.log.push(`♻️ 自循环: 回复${restores}点体力`);}
  }
  b.cardsPlayedThisBattle = (b.cardsPlayedThisBattle||0) + 1; // 午休天赋计数（2026-08-23）
  // 举一反三：每回合第一次打出卡牌时摸3张。
  if((s.talents||[]).includes('quick_learner') && !b.quickLearnerUsedTurn) {
    b.quickLearnerUsedTurn = true;
    G.battleDraw(3);
    b.log.push('🧠 举一反三: 本回合第一次出牌，摸3张牌');
  }
  // 睡觉天赋: 出牌把体力用到0时触发（每场一次，2026-08-23 补实现）
  if(cost > 0 && b.energy <= 0 && !b.over) {
    let st = G.state.talents || [];
    if(st.includes('sleep') && !b.sleepTalentUsed) {
      b.sleepTalentUsed = true; b.energy = 4;
      b.log.push('🛏️ 睡觉: 体力归0，回复至4');
      G.showToast('🛏️ 天赋「睡觉」: 体力归0，回复至4');
    }
  }
  // 二次呼吸天赋：每消耗4点体力回复1点体力（跨档即时结算）
  if(cost > 0 && (G.state.talents||[]).includes('second_wind')) {
    let restored = Math.floor(b.energySpentTotal / 4) - Math.floor(spentBefore / 4);
    if(restored > 0) { G.gainEnergy(restored); b.log.push(`🫁 二次呼吸: 消耗${cost}体力，回复${restored}体力`); }
  }
  // 好动(谭梓君2星): 每消耗3点体力摸一张牌（跨档多摸）
  if(cost > 0 && G.state.star >= 2 && G.state.character.stars[2] && G.state.character.stars[2].passive === 'haodong') {
    let draws = Math.floor(b.energySpentTotal / 3) - Math.floor(spentBefore / 3);
    for(let d=0; d<draws; d++) {
      G.battleDraw(1);
      b.log.push('🏃 好动: 摸1张牌');
    }
  }
  // 热情: 每消耗1点体力回复2生命（可叠加强化）
  if(cost > 0 && b.energySpendHeal > 0) {
    let effMax = b.playerMaxHp + b.tempMaxHp;
    let hpBefore = b.playerHp;
    b.playerHp = Math.min(effMax, b.playerHp + cost * b.energySpendHeal);
    if(b.playerHp > hpBefore) b.log.push(`🔥 热情: 回复${b.playerHp - hpBefore}生命`);
  }
  // Pay life cost
  let lifeCost = G.getCardLifeCost(cd);
  if(lifeCost > 0) {
    let hpBeforeCost = b.playerHp;
    b.playerHp -= lifeCost;
    b._lastLifeCost = lifeCost;
    // 忍耐: 生命损失转化耐力
    if(b.enduranceConvert > 0) {
      b.endurance += Math.floor(lifeCost * b.enduranceConvert * ((G.state.star >= 2 && G.state.character && G.state.character.id === 'chengliang') ? 1.3 : 1));
      G.checkChengliangPedometer();
      b.log.push(`💪 忍耐: +${Math.floor(lifeCost * b.enduranceConvert)}耐力`);
    }
    if(cd.enduranceFromLifeCost) {
      let eg = Math.floor(lifeCost * cd.enduranceFromLifeCost * ((G.state.star >= 2 && G.state.character && G.state.character.id === 'chengliang') ? 1.3 : 1));
      b.endurance = (b.endurance || 0) + eg;
      if(eg) b.log.push(`💪 ${cd.name}: +${eg}耐力`);
      if(cd.lowHpEnduranceBonusPct && b.playerHp < (b.playerMaxHp + b.tempMaxHp) * 0.5) {
        let bonus = Math.floor(lifeCost * cd.lowHpEnduranceBonusPct / 100 * ((G.state.star >= 2 && G.state.character && G.state.character.id === 'chengliang') ? 1.3 : 1));
        b.endurance += bonus;
        b.log.push(`💪 ${cd.name}: 低生命额外+${bonus}耐力`);
        G.checkChengliangPedometer();
      }
    }
    G.checkChengliangPedometerLoss(lifeCost);
    b.log.push(`❤️ ${cd.name}: 消耗${lifeCost}生命（生命${hpBeforeCost}→${b.playerHp}）`);
    if(b.playerHp <= 0 && G.tryRally()) {
      // 重整旗鼓成功，继续战斗。
    } else if(b.playerHp <= 0) { b.over = true; b.won = false; b.log.push('💀 你被自己榨干了...'); G.render(); return; }
  }
  // 小萌：每张逻辑卡先自动消耗1枚梦屑追加0.5倍智力伤害，再判定卡牌自己的额外梦屑效果。
  b._mengxieBefore=b.mengxie||0;
  b._dreamLogicUsed = false;
  // 【深度睡眠】只获得梦屑，不存在额外梦屑消耗；即使旧编辑器数据残留字段也不能扣除。
  let dreamCost=(cd.id==='shendu_shuimian'||cd.name==='深度睡眠')?0:(cd.dreamExtraCost||0);
  b._mengxieUsed = !!(dreamCost && G.spendMengxie(dreamCost));
  // 梦痕消耗（苏醒）
  if(cd.menghenCost) {
    b.menghen -= cd.menghenCost;
    b.log.push(`🌙 消耗${cd.menghenCost}梦痕`);
  }
  // 沉默/沉睡：消耗费用但没有任何效果。
  if(G.isSleepingCard(cardId) || cd.silenced || cd.silent) {
    b.log.push(`🔇 ${cd.name} 处于沉默，没有效果`);
    G.finishCard(cd);
    return;
  }
  // Track
  b.playerUsedCardsThisTurn.push(cardId);
  b.chariotHitThisCard={};
  if((s.talents||[]).includes('girl_glory')) {
    if(b.gloryStep==='first'&&cd.type==='logic'){let before=b.playerHp;b.playerHp=Math.min(b.playerMaxHp+b.tempMaxHp,b.playerHp+5);b.gloryStep='second';b.log.push(`🌹 少女的荣耀·先: 回复${b.playerHp-before}生命`);}
    else if(b.gloryStep==='second'&&cd.type==='idea'){let got=G.gainEnergy(1);b.gloryStep='first';b.log.push(`🌹 少女的荣耀·后: 回复${got}体力`);}
  }
  // 出牌记录（左侧面板）
  b.playRecords.push({side:'p', name:cd.name, desc:cd.desc});
  // 实时牌局记录实际读取 b.log。所有卡牌都在效果结算前记录一次，
  // 避免没有伤害/护盾日志的思路卡看起来像是从未打出。
  let playedTypeName = {logic:'逻辑卡', idea:'思路卡', answer:'解答卡', tool:'用具卡', special:'特殊卡'}[cd.type] || '卡牌';
  b.log.push(`🃏 使用「${cd.name}」（${playedTypeName}，消耗${cost}体力）`);
  G.triggerGoodCardsPair(cd);
  // 草稿推演：下一张打出的逻辑卡结算（消耗不同→理性；金再+护盾）
  if(cd.type === 'logic' && b.scratchRec) {
    let rec = b.scratchRec;
    b.scratchRec = null;
    if((b._lastCost || 0) !== rec.cost) {
      G.addPlayerStatus('rationality', rec.rat);
      b.log.push(`📐 草稿推演: 消耗不同(${rec.cost}→${b._lastCost || 0})，+${rec.rat}层理性`);
      if(rec.gold) {
        let sh = Math.floor(G.effectiveInt() * rec.gold);
        sh=Math.floor(sh*(b.shieldItemMult||1));b.playerShield += sh;
        b.log.push(`📐 草稿推演(金): +${sh}护盾`);
      }
    }
  }

  // Apply bond: four_books - idea card gives 2 sensibility
  if(cd.type === 'idea' && G.state.activeBonds.four_books) {
    G.addPlayerStatus('sensibility', 2);
  }


  // Apply card effects
  b._flawsBeforeCard=(b.weaknesses||[]).length;b._weakBrokenBeforeCard=b.weakBrokenTurn;b._weakKindsBeforeCard=Object.keys(b.weakKindsTurn).filter(t=>b.weakKindsTurn[t]>0).length;
  G.triggerPlayedCardItems(cd);
  let deferred = G.applyCardEffect(cd);
  // 防止某个异常效果返回 deferred 却没有真正创建选择框，导致卡牌永久卡在结算中。
  if(deferred && !G._choiceOptions && !G._pendingCardId) {
    deferred = false;
    b.log.push(`⚠️ ${cd.name}: 未生成选择界面，已按无延迟效果完成结算`);
  }
  G.checkUpgradeCooldownReset(cd);

  // 连刺：仅令下一张逻辑卡的效果额外发动一次，不视为再次打出。
  if(!deferred && cd.type==='logic' && b.nextLogicRepeat && !cd._extraRepeat) {
    b.nextLogicRepeat=false;
    let repeated=Object.assign({},cd,{_extraRepeat:true});
    if(typeof repeated.dmgMult==='number') repeated.dmgMult*=1.5;
    b.log.push(`⚔️ 连刺: ${cd.name}的效果额外发动1次`);
    G.applyCardEffect(repeated);
    // 额外发动仍属于同一张牌的累计伤害，也可以达成【打怪升级】的重置条件。
    G.checkUpgradeCooldownReset(cd);
  }

  // Apply bond: literature - answer card draws
  if(cd.type === 'answer' && G.state.activeBonds.literature) {
    G.battleDraw(G.state.activeBonds.literature_effectVal || 1);
  }

  if(!deferred) G.finishCard(cd);
  else if(G.render) G.render();
};

// ===== 属性修正工具 =====
// 傲慢: 每层先+6%智力，再-10%智力；每层无视抵消一层降低
G.arroganceTotal = function() {
  let b = G.state.battle;
  return (b.playerStatuses.arrogance || 0) + (b.arroganceTemp || 0);
};
G.wushiLayers = function() {
  let b = G.state.battle;
  return b.playerStatuses.wushi || 0;
};
G.effectiveInt = function() {
  let s = G.state, b = G.state.battle;
  let A = G.arroganceTotal(), W = G.wushiLayers();
  let mult = 1 + 0.06 * A - 0.10 * Math.max(0, A - W);
  let smartMult=Math.max(0,1-0.05*(b.playerStatuses.smart||0));
  let rationalityMult=1+0.20*(b.playerStatuses.rationality||0);
  return (s.intelligence + s.combatEq + (b.combatInt||0) + (b.tempIntArrogance || 0)) * mult * smartMult * rationalityMult;
};
G.effectiveEq = function() {
  let s = G.state, b = G.state.battle;
  let eq = s.eq + s.combatEq;
  if(b.eqDoubleTurns > 0) eq *= 2;
  if(b.creationEqBoost > 0) eq *= 1 + b.creationEqBoost;
  return eq;
};
// 消耗傲慢层（优先临时）
G.consumeArrogance = function(n) {
  let b = G.state.battle;
  let fromTemp = Math.min(b.arroganceTemp, n);
  b.arroganceTemp -= fromTemp;
  n -= fromTemp;
  if(n > 0) b.playerStatuses.arrogance = Math.max(0, (b.playerStatuses.arrogance || 0) - n);
};


// ===== 用具系统 =====
// 当前是否装备了某效果用具
G.toolActive = function(effect) {
  let b=G.state.battle;
  let refs=b&&b.equippedTools?b.equippedTools:((G.state.equippedTools&&G.state.equippedTools.length)?G.state.equippedTools:(G.state.toolEquipped?[G.state.toolEquipped]:[]));
  return refs.some(ref=>{let td=G.getCardData(ref);return !!(td&&td.toolEffect===effect);});
};
// 体力回复总量（靴子用具+1、君姐模式本场+1）
G.energyRegenTotal = function() {
  let v = G.state.energyRegen || 0;
  let b = G.state.battle;
  if(b) v += (b.regenBonus || 0);
  if(G.toolActive('boots')) v += 1;
  return v;
};

// 回复体力（统一入口：钳制上限，并触发"快速旋转"等回复相关效果）
G.gainEnergy = function(n) {
  let b = G.state.battle;
  if(!b || n <= 0) return 0;
  // 体力回复加成（修复2026-08-22：此前energyRegenTotal从未被调用，效果完全失效）：
  // 有点神奇之靴(+1) / 君姐模式regenBonus(+1)，每次回复体力时额外+1
  if(G.toolActive('boots')) n += 1;
  n += (b.regenBonus || 0);
  let before = b.energy;
  let powerOverflow=0;
  if((G.state.talents||[]).includes('power') && b.energyBreakTurns <= 0) powerOverflow=Math.max(0,b.energy+n-b.maxEnergy);
  if(b.energyBreakTurns > 0) {
    // 噩梦枷锁(梦屑版): 突破体力上限
    b.energy += n;
  } else {
    b.energy = Math.min(b.maxEnergy, b.energy + n);
  }
  let gained = b.energy - before;
  if(powerOverflow>0){b.energy=b.maxEnergy;G.dealMonsterDamage(powerOverflow*(G.state.physique||0)*10,'力量·体力溢出');b.log.push(`💥 力量: 溢出${powerOverflow}点体力转化为伤害`);}
  if(gained > 0) b.powerRestoreTurn=(b.powerRestoreTurn||0)+gained;
  if(b.powerRestoreTurn>=30 && !(G.state.talents||[]).includes('power')) G.unlockSpecialTalent('power');
  if(gained > 0 && G.toolActive('tanzijun_bracelet')) {
    let sh=Math.floor(gained * (G.state.physique||0) * 0.3);
    if(sh>0){b.playerShield+=sh;b.log.push(`🐰 兔子手链: 获得${sh}护盾`);}
  }
  if(gained>0&&b.nightmareDiscardOnEnergy){let nDrop=G.discardMonsterHand(gained);if(nDrop)b.log.push(`😈 噩梦枷锁: 因回复${gained}体力，弃置对手${nDrop}张手牌`);}
  // 快速旋转(挚友天赋): 每回复1点体力，对敌方造成2点伤害（体力上限>10双倍）
  if(gained > 0 && !b.over && G.state.talents.includes('kuaisu_xuanzhuan')) {
    let dmg = b.maxEnergy > 10 ? Math.floor(gained * G.state.physique * 0.5) : gained * 2;
    G.dealMonsterDamage(dmg, '快速旋转');
  }
  return gained;
};

// 对敌方造成伤害（吃敌方护盾，统一入口）
G.dealMonsterDamage = function(dmg, source, alreadyFateScaled) {
  let b = G.state.battle;
  if(!b || b.over || dmg <= 0) return;
  if(!alreadyFateScaled&&(G.state.talents||[]).includes('fate')) dmg=Math.floor(dmg*(1+Math.floor((G.state.gold||0)/100)*0.5));
  if(b.monsterStatuses.shield) {
    let sd = Math.min(b.monsterStatuses.shield, dmg);
    b.monsterStatuses.shield -= sd;
    dmg -= sd;
  }
  if(dmg > 0) {
    let rallyTrue = ((G.state.talents||[]).includes('yangwo_qizuo') && b.rallyTrueBonus) ? Math.floor(dmg*b.rallyTrueBonus) : 0;
    let hpBefore = b.monsterHp;
    b.monsterHp -= dmg + rallyTrue;
    if(G.toolActive('yusan')){let shield=Math.min(Math.floor(dmg*.5),Math.max(0,(G.state.physique||0)*2));if(shield>0){b.playerShield+=shield;b.log.push(`☂️ 雨伞: 将${Math.floor(dmg*.5)}伤害转为${shield}护盾`);}}
    G.recordRunDamage('dealt',dmg+rallyTrue);
    if((G.state.talents||[]).includes('little_trick') && b.turn===1 && (b.littleTrickDamageDraws||0)<2) {
      b.littleTrickDamageDraws=(b.littleTrickDamageDraws||0)+1;
      G.battleDraw(1);
      b.log.push(`💡 一点小巧思: 第${b.littleTrickDamageDraws}次造成伤害，摸1张牌`);
    }
    if(b.enemyDeckSleepingHits>0){b.enemyDeckSleepingHits--;b.log.push(`⏰ 敌方卡组【沉睡】剩余${b.enemyDeckSleepingHits}次伤害`);}
    b.log.push(`💥 ${source||'伤害'}: 对敌方造成${dmg}${rallyTrue?`（额外真实伤害${rallyTrue}）`:''}点伤害（敌方生命${hpBefore}→${b.monsterHp}）`);
    G.fx.attackMonster(dmg); // 统一入口也接攻击特效（快速旋转/弃牌伤害等，2026-08-19）
    if(b.monsterHp <= 0 && !b.over) {
      b.over = true; b.won = true;
      b.log.push('🎉 击败了 ' + b.monsterData.name + '！');
      if(G.fx && G.fx.killFx) G.fx.killFx('monster'); // 击杀白闪+碎片（2026-08-23）
    }
  }
};

// 程良专属用具【计步器】：耐力首次达到10时触发一次。
G.checkChengliangPedometer = function() {
  let b = G.state.battle;
  if(!b || b.pedometerTriggered || !G.toolActive('chengliang_pedometer') || (b.endurance || 0) < 10) return;
  b.pedometerTriggered = true;
  G.battleDraw(2);
  let got = G.gainEnergy(1);
  b.log.push(`📟 计步器: 耐力达到10，摸2张牌，回复${got}点体力`);
};
G.checkChengliangPedometerLoss = function(amount) {
  let b = G.state.battle;
  if(!b || amount < Math.ceil((b.playerMaxHp + b.tempMaxHp) * 0.1) || !G.toolActive('chengliang_pedometer')) return;
  let drawn = G.battleDraw(1), got = G.gainEnergy(1);
  b.log.push(`📟 计步器: 损失至少10%生命，摸${drawn}张牌，回复${got}点体力`);
};
// 回合开始触发的用具效果（铅笔：获得一张临时逻辑卡）
G.toolTurnStart = function() {
  let s = G.state, b = s.battle;
  if(!b || b.over) return;
  if(G.toolActive('pencil')) {
    b.hand.push('tuya');
    b.log.push('✏️ 普通的铅笔: 获得一张临时逻辑卡(涂鸦)');
  }
};

// 从手牌弃置一张牌（脱手词条：遭到弃置/移除时无消耗发动效果）
G.discardFromHand = function(cid) {
  let b = G.state.battle;
  let base=G.baseId(cid);
  if(b.sleepWakeOnLeave&&b.sleepWakeOnLeave[cid]){G.wakeCardRef(cid);delete b.sleepWakeOnLeave[cid];b.wokeThisTurn=(b.wokeThisTurn||0)+1;b.log.push(`🌤️ 离开手牌时【苏醒】${G.getCardData(cid)?.name||cid}`);}
  G.claimPiggySavings(cid);
  b.discard.push(cid);
  b.playerDiscardedThisTurn = true; // 张冠李戴：玩家本回合是否弃过牌（2026-08-23）
  let dc = G.getCardData(cid);
  // 弃置不清除【已变更】；该标记会随卡保留，直到真正打出。
  if(dc) G.clearCardHandRecords(dc.ref || dc.id, false);
  if(dc && dc.tuoshou && !b.over) {
    b.log.push(`🏃 ${dc.name}（脱手）: 无消耗发动效果`);
    b._tuoshouResolving = true;
    G.applyCardEffect(dc);
    b._tuoshouResolving = false;
  }
};

G.claimPiggySavings = function(cid) {
  let b=G.state.battle;if(!b||!G.cardHasItem(cid,'存钱罐'))return 0;
  let key=G.baseId(cid),saved=(b.piggySavings&&b.piggySavings[key])||0;if(saved<=0)return 0;
  b.piggySavings[key]=0;let gain=G.gainGold(saved);b.log.push(`🐷 存钱罐: 领取${gain}零花钱`);return gain;
};

// ===== 小萌·霜眠 梦境系统 =====
// 旧版“获得层数+1”已移除；保留入口供旧卡兼容。
G.dreamBonus = function() { return 0; };
// 梦屑（上限=情商）
G.gainMengxie = function(n) {
  let s = G.state, b = s.battle;
  if(!b) return;
  let bonus=0;if(G.toolActive&&G.toolActive('eye_mask')&&!b.eyeMaskDreamTurn){b.eyeMaskDreamTurn=true;bonus=1;}
  let before=b.mengxie, requested=n + G.dreamBonus()+bonus;
  b.mengxie = Math.min(s.eq, b.mengxie + requested);
  b.log.push(`💤 梦屑 +${b.mengxie-before} (${b.mengxie}/${s.eq})`);
};
G.spendMengxie = function(n) {
  let b=G.state.battle;if(!b||n<=0||b.mengxie<n)return false;
  b.mengxie-=n;b.log.push(`💤 消耗${n}枚【梦屑】`);
  if(b.nightmareFrostOnDiscard) G.addPlayerStatus('shuangdie',n);
  if(b.nightmareDreamDiscard){let dropped=G.discardMonsterHand(n);if(dropped)b.log.push(`😈 【噩梦枷锁】: 对手弃置${dropped}张牌`);}
  return true;
};
// 梦痕
G.gainMenghen = function(n) {
  let b = G.state.battle;
  if(!b) return;
  b.menghen += n + G.dreamBonus();
  b.log.push(`🌙 梦痕 +${n + G.dreamBonus()} (${b.menghen})`);
};
// 课桌用的枕头: 第一次生命为0时复活回满+所有buff各3层，随后陷入沉睡
G.tryRally = function() {
  let s=G.state,b=s.battle;if(!b||b.over||((s.rallyCount||0)+(s.tempRallyCount||0))<=0)return false;
  if((s.tempRallyCount||0)>0)s.tempRallyCount--;else s.rallyCount--;
  b.playerHp=Math.max(1,Math.ceil((b.playerMaxHp+b.tempMaxHp)*.5));
  if((s.talents||[]).includes('yangwo_qizuo')) b.rallyTrueBonus=(b.rallyTrueBonus||0)+.3;
  if(G.toolActive('pillow')){G.addPlayerStatus('shuangdie',8);b.log.push('🛏️ 【枕头】: 获得8层【霜蝶】');}
  if((s.talents||[]).includes('dameng_shuixianjue')){
    let keys=new Set();for(let ref of (s.deck||[])){let d=G.getCardData(ref);if(d&&d.status)Object.keys(d.status).forEach(k=>keys.add(k));}
    keys.forEach(k=>G.addPlayerStatus(k,3));b.log.push(`🌙 【大梦谁先觉】: 获得${keys.size}种可获得增益各3层`);
  }
  b.log.push(`💤 【重整旗鼓】: 生命回复至50%（剩余${(s.rallyCount||0)+(s.tempRallyCount||0)}次）`);return true;
};
G.triggerPillow = G.tryRally;
// 弃置怪物手牌（随机n张；permanent=永久移出游戏）
G.discardMonsterHand = function(count, permanent) {
  let b = G.state.battle;
  if(!b.monsterHand || b.monsterHand.length === 0) return 0;
  let n = Math.min(count, b.monsterHand.length);
  let removed = b.monsterHand.splice(0, n);
  removed.forEach(c => {
    if(permanent) b.monsterDeckBan[c.name] = true;
    else b.monsterDiscard.push(c);
  });
  if(n>0&&b.nightmareFrostOnDiscard){G.addPlayerStatus('shuangdie',n);b.log.push(`😈 【噩梦枷锁】: 获得${n}层【霜蝶】`);}
  return n;
};
// 移出怪物手牌n张至N回合结束（permanent=永久）
G.exileMonsterHand = function(count, turns, permanent) {
  let b = G.state.battle;
  if(!b.monsterHand || b.monsterHand.length === 0) return 0;
  let n = Math.min(count, b.monsterHand.length);
  let removed = b.monsterHand.splice(0, n);
  removed.forEach(c => {
    if(permanent) b.monsterDeckBan[c.name] = true;
    else { b.monsterExile.push({name:c.name, untilTurn:b.turn + turns}); b.monsterDrawPile.push(c); } // 流放卡回到抽牌堆，回合结束后可再抽（任务1）
  });
  return n;
};

// 龙族小说演出 v5（2026-08-22，特效源：花瓣.html）：连贯流畅版 —— 无静止幕布停顿。
// 花瓣一出现即按随机延迟错峰四散(全程在飞)，壁纸在花瓣飞散中同步转场：
// 进场=花瓣飞开露出龙族壁纸；退场=花瓣飞开后回到牌局原背景。壁纸瞬间就位/撤下(藏在开场花瓣下，无渐显)。
G._lzTimers = [];
// 动态壁纸·无缝循环（2026-08-22）：双视频交叉淡入。主视频快播到结尾时，把备用视频 seek 回 0 并与之交叉淡变，
// 将AI生成片段的"首尾帧不同"跳变溶解掉；因壁纸内容为低对比氛围(云雾/微光)，肉眼零接缝
G._lzLoopTimer = null;
G._buildLzLoop = function(el) {
  var X = 1.0; // 交叉淡变时长(秒)
  var mk = function() {
    var v = document.createElement('video');
    v.muted = true; v.autoplay = true; v.setAttribute('playsinline', ''); v.loop = false;
    v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .8s ease';
    v.addEventListener('error', function() {}); // 加载失败/在线受限→保留下方静态jpg兜底
    return v;
  };
  var vA = mk(), vB = mk();
  el.appendChild(vA); el.appendChild(vB);
  var src = '其他插画/龙族动态.mp4', D = 5, active = 0, fading = false;
  function dur() { if(vA.duration && isFinite(vA.duration) && vA.duration > 0.5) D = vA.duration; }
  vA.addEventListener('loadedmetadata', dur);
  function setSrc(v) { if(!v.src || v.src.indexOf(src) < 0) { v.src = src; if(v.load) v.load(); } }
  setSrc(vA); setSrc(vB);
  vA.addEventListener('canplay', function() { vA.style.opacity = '1'; }); // 主视频就绪后淡入盖住静态图
  function play(v) { if(v.play) { var p = v.play(); if(p && p.catch) p.catch(function(){}); } }
  play(vA);
  // 轮询：主视频接近结尾时触发一次交叉淡入（备用视频从 0 起播）
  G._lzLoopTimer = setInterval(function() {
    if(fading) return;
    var cur = active === 0 ? vA : vB;
    if(cur.currentTime >= D - X - 0.05) {
      var out = active === 0 ? vA : vB, inn = active === 0 ? vB : vA;
      fading = true;
      inn.currentTime = 0;
      inn.style.transition = 'opacity ' + X + 's linear'; inn.style.opacity = '1';
      play(inn);
      out.style.transition = 'opacity ' + X + 's linear'; out.style.opacity = '0';
      var next = active === 0 ? 1 : 0;
      setTimeout(function() {
        fading = false;
        try { if(!out.paused) out.pause(); } catch(e) {}
        active = next;
      }, Math.round(Math.min(X * 1000, 600)));
    }
  }, 120);
};
// 特供小说专属演出场景：novel id → 专属壁纸（petal统一为花瓣/粒子转场；未配置的小说不播壁纸演出）
G.NOVEL_SCENE = {
  longzu: { img: '其他插画/罗生门.jpg', petal: 'sakura' },       // 罗生门（2026-08-23 改版）
  yinhe:  { img: '其他插画/巴黎圣母院.jpg', petal: 'sakura' },    // 巴黎圣母院（2026-08-23 改版）
  mojie:  { img: '其他插画/朝花夕拾.jpg', petal: 'sakura' }       // 朝花夕拾（2026-08-23 改版）
};
G.longzuShow = function(mode, novelId) { // mode: 'enter' | 'exit'；novelId 缺省时沿用战斗中的 novelBuff
  // 清掉未完成的旧演出计时器，防止快速进出时旧回调把新演出关掉
  G._lzTimers.forEach(clearTimeout); G._lzTimers = [];
  let el = document.getElementById('lz-bg');
  if(mode === 'enter') {
    if(!el) { el = document.createElement('div'); el.id = 'lz-bg'; el.className = 'lz-bg'; document.body.appendChild(el); }
    var nid = novelId || (G.state && G.state.battle && G.state.battle.novelBuff) || 'longzu';
    var sc = G.NOVEL_SCENE[nid];
    if(!sc) return; // 没有专属壁纸的小说（如魔戒）不播壁纸演出
    el.style.backgroundImage = "url('" + sc.img + "')"; // 按小说切换专属壁纸（缺省长Set回龙族）
    // 动态壁纸·无缝循环（暂未启用，2026-08-22）：需要动态时取消下两行注释（静态jpg兜底）
    // if(!el.querySelector('video')) G._buildLzLoop(el);
    // 氛围粒子已由 activateNovel 按小说主题启动（G.NOVEL_THEME），此处不再重复启动
    // 水墨渐变入场：清掉残留的内联过渡，让 CSS 的 opacity/墨色blur/晕开(scale) 动画生效
    el.style.transition = '';
    el.classList.remove('show');
    void el.offsetWidth;            // 强制 reflow，确保重新触发
    el.classList.add('show');       // 壁纸以水墨晕染渐显，藏在花瓣下，随花瓣飞散同步成型
    if(G.fx && G.fx.petalOverlay) G.fx.petalOverlay(0); // 花瓣一出现即错峰四散（hold=0 连贯式）
  } else {
    if(G.fx && G.fx.ambientStop) G.fx.ambientStop(); // 小说buff结束：停专属氛围粒子（2026-08-22）
    if(G.fx && G.fx.petalOverlay) G.fx.petalOverlay(0); // 花瓣再次出现即错峰四散
    if(el) {
      // 壁纸随花瓣飞散瞬间撤下（藏在花瓣下），四散后露出的已是牌局原背景
      el.style.transition = 'none';
      el.classList.remove('show');
      el.style.opacity = '0';
      G._lzTimers.push(setTimeout(function() {
        // 只移除壁纸元素：花瓣正四散中(最长飞到~1.9s)，让它自然散完（removeLongzuBg会连花瓣一起清掉）
        if(el && el.remove) el.remove();
      }, 400));
    }
  }
};
// 立即清除龙族壁纸（死亡重考/放弃/败北等异常退出路径必须调用，否则 fixed 全屏层会遮住地图界面）
G.removeLongzuBg = function() {
  G._lzTimers.forEach(clearTimeout); G._lzTimers = [];
  if(G._lzLoopTimer) { clearInterval(G._lzLoopTimer); G._lzLoopTimer = null; }
  if(G.fx && G.fx.ambientStop) G.fx.ambientStop(); // 异常退出：一并停掉专属氛围粒子（2026-08-22）
  let el = document.getElementById('lz-bg');
  if(el && el.remove) el.remove();
  // 一并清掉可能还在飘的花瓣覆盖层（异常退出时避免花瓣飘到地图界面）
  let ov = document.querySelector('.petal-overlay');
  if(ov && ov.remove) ov.remove();
};

// 特供小说 buff 激活/结束（2026-08-22）：互斥，一场仅开启一本；持续2回合
// 结束即"全额快照还原"：把开启时玩家自身的全套状态（血/盾/上限/能量/层数/手牌/弃/抽堆）整体还原，
// 2回合内对自身的一切影响（含受到的伤害）都不算数；怪物方伤害/进展保留
// 小说专属氛围粒子主题（2026-08-23 改版）：罗生门→冷雨飘落、朝花夕拾→花瓣飘落、巴黎圣母院→圣光屑上浮
G.NOVEL_THEME = { longzu: 'rain', yinhe: 'holylight', mojie: 'sakura' };
G.activateNovel = function(book) {
  let b = G.state.battle;
  if(b.novelBuff) return; // 已激活别的小说，互斥
  if(G.sfx) G.sfx.play('novel'); // 小说沉浸音效（2026-08-23）
  if(G.NOVEL_SCENE[book]) G.longzuShow('enter', book); // 有专属壁纸的小说进入演出（目前：龙族/银河英雄传说）
  // 全额快照：深拷贝整套战斗状态（还原时仅回滚玩家自身，怪物/回合等保留当前值）
  b.novelSnap = JSON.parse(JSON.stringify(b));
  b.novelBuff = book;
  b.novelTurnsLeft = 2;
  if(G.NOVEL_THEME[book] && G.fx && G.fx.ambientStart) G.fx.ambientStart(G.NOVEL_THEME[book]); // 小说专属氛围粒子（龙族樱/银河星尘/魔戒圣光屑）
  if(book === 'longzu') {
    // 龙族：开启时最大生命减半（当前生命随之钳制；到期随快照全额还原）
    b.playerMaxHp = Math.max(1, Math.floor(b.playerMaxHp / 2));
    b.playerHp = Math.min(b.playerHp, b.playerMaxHp);
  }
  if(book === 'mojie') {
    // 魔戒：消耗10生命（保底1，防自杀）
    b.playerHp = Math.max(1, (b.playerHp||1) - 10);
  }
  let nv = G.NOVELS.find(n => n.id === book);
  b.log.push('📖 沉浸于比小说——《' + (nv ? nv.name : book) + '》效果开启');
};
// 开启小说时玩家自身的字段需还原；这些字段保持"当前值"（怪物/进度/文字记录/小说本身一律不回滚）
G._NOVEL_HALF_RESTORE_KEYS = [
  'monsterId','monsterData','monsterHp','monsterMaxHp','monsterIntelligence','monsterEq',
  'monsterEnergy','monsterMaxEnergy','monsterHand','monsterDrawPile','monsterDiscard',
  'monsterDeckBan','monsterExile','monsterStatuses','monsterDrawPenalty','monsterNextDrawPenalty',
  'monsterSleepTurns','monsterPlayLimit','monsterNextLogicDmgBonus',
  'turn','phase','log','playRecords','over','won',
  'novelBuff','novelTurnsLeft','novelMaxSave','novelSnap',
];
G.endNovelBuff = function() {
  let b = G.state.battle;
  if(!b || !b.novelBuff) return;
  let wasScene = b.novelBuff && G.NOVEL_SCENE[b.novelBuff];
  if(wasScene) G.longzuShow('exit'); // 退出演出（壁纸层在花瓣转场下撤下）
  if(G.fx && G.fx.ambientStop) G.fx.ambientStop(); // 停小说专属氛围粒子（2026-08-22）
  // 还原前记录移除堆中的小说卡：快照拍在卡进移除堆之前，还原会把它抹掉，结束后按此放回（2026-08-23 改版）
  let usedNovels = (G.NOVELS || []).filter(function(n) { return b.exhaust.includes(n.card); }).map(function(n) { return n.card; });
  if(b.novelSnap) {
    for(let k in b.novelSnap) {
      // 仅回滚玩家自身字段；怪物/回合/记录/小说标记保留当前值
      if(G._NOVEL_HALF_RESTORE_KEYS.includes(k)) continue;
      b[k] = JSON.parse(JSON.stringify(b.novelSnap[k]));
    }
  }
  b.novelSnap = null;
  b.log.push('🌙 读完小说，自身状态回到使用小说牌前（2回合内一切影响不算数）');
  b.novelBuff = null;
  b.novelTurnsLeft = 0;
  // 已打出的小说卡放回移除堆：快照在卡进移除堆之前拍下，还原会把记录抹掉；
  // 按"还原前移除堆清单"恢复，只对移除堆判重（真实卡组每种小说仅一张）
  usedNovels.forEach(function(cid) {
    if(!b.exhaust.includes(cid)) b.exhaust.push(cid);
  });
};
G.novelBlockedMsg = function() { return '📖 你已经沉浸在别的小说世界里，暂时无法翻开另一本'; };

G.shuffleDiscardIntoDraw = function() {
  let b = G.state.battle;
  if(!b || !b.discard.length) return 0;
  let n = b.discard.length;
  b.drawPile.push(...b.discard); b.discard = [];
  G.shuffleInPlace(b.drawPile);
  return n;
};
G.resolveCreationCard = function(cd) {
  let b = G.state.battle, s = G.state, st = G.creationState(cd.ref || cd.id);
  if(!b || !st) return;
  let paid = b._lastCost || 0, insp = st.inspiration || 0;
  let dmgMult=0, damagePackets=[], shieldEq=0, shieldPhys=0, draw=0, energy=0, fullEssay=false;
  let statuses=[], preserveSens=false, recycleLogic=0, drawLogic=0, ideaCountSens=0, rerollRight=0, copyLeft=0, eqBoost=0;
  for(let e of st.effects || []) {
    if(e.kind==='eqDamage') {
      if((e.hits || 1) > 1) damagePackets.push({mult:e.mult||0,hits:e.hits||1});
      else dmgMult += e.mult || 0;
    }
    if(e.kind==='sensDamage') damagePackets.push({mult:(e.base||0)+(b.playerStatuses.sensibility||0)*(e.perSens||0),hits:1});
    if(e.kind==='eqShield') shieldEq += e.mult || 0;
    if(e.kind==='physiqueShield') shieldPhys += e.mult || 0;
    if(e.kind==='draw') draw += e.amount || 0;
    if(e.kind==='energy') energy += e.amount || 0;
    if(e.kind==='fullEssay') fullEssay = true;
    if(e.kind==='status') statuses.push(e);
    if(e.kind==='statusDraw') { statuses.push(e); draw += e.draw || 0; }
    if(e.kind==='preserveSens') preserveSens = true;
    if(e.kind==='recycleLogic') { recycleLogic += e.amount || 0; drawLogic += e.drawLogic || 0; }
    if(e.kind==='ideaCountSens') ideaCountSens += Math.min(e.cap || 99, b.turnIdeaCardsPlayed || 0);
    if(e.kind==='rerollRight') rerollRight += e.draw || 0;
    if(e.kind==='copyLeft') copyLeft += e.amount || 0;
    if(e.kind==='eqBoost') eqBoost += e.mult || 0;
  }
  let attrBonus = 0;
  if(insp >= 6) {
    if(st.direction==='horror' && paid>2) attrBonus = 0.5;
    if(st.direction==='romance' && paid<2) attrBonus = 0.5;
    if(st.direction==='fantasy' && paid===2) attrBonus = 1;
  }
  if(dmgMult>0) G.dealMonsterDamage(Math.floor(G.effectiveEq() * (dmgMult + attrBonus)), cd.name);
  for(let packet of damagePackets) {
    for(let i=0;i<packet.hits;i++) G.dealMonsterDamage(Math.floor(G.effectiveEq() * (packet.mult + attrBonus)), cd.name);
  }
  let shield = 0;
  if(shieldEq>0) shield += Math.floor(G.effectiveEq() * (shieldEq + attrBonus));
  if(shieldPhys>0) shield += Math.floor(s.physique * (shieldPhys + attrBonus));
  if(shield>0) { shield=Math.floor(shield*(b.shieldItemMult||1));b.playerShield += shield; b.log.push(`🛡️ ${cd.name}: 获得${shield}护盾`); if(G.fx&&G.fx.shieldGain) G.fx.shieldGain(); }
  if(draw>0) G.battleDraw(draw);
  if(energy>0) G.gainEnergy(energy);
  statuses.forEach(function(e){ G.addPlayerStatus(e.status, e.amount || 0); });
  if(preserveSens) { b.noSensConsume=true; b.log.push('📦 创作灵感: 下一次伤害不消耗感性'); }
  if(ideaCountSens>0) G.addPlayerStatus('sensibility', ideaCountSens);
  if(eqBoost>0) { b.creationEqBoost=(b.creationEqBoost||0)+eqBoost; b.log.push(`📝 创作灵感: 本回合情商+${Math.round(eqBoost*100)}%`); }
  if(recycleLogic>0) {
    let picked=[];
    for(let i=b.discard.length-1;i>=0 && picked.length<recycleLogic;i--) {
      let ref=b.discard[i], d=G.getCardData(ref);
      if(d && d.type==='logic') { picked.push(ref); b.discard.splice(i,1); }
    }
    b.drawPile.push(...picked); if(picked.length) G.shuffleInPlace(b.drawPile);
    if(drawLogic>0) G.battleDrawLogic(drawLogic);
    b.log.push(`📝 创作灵感: 回收${picked.length}张逻辑卡`);
  }
  if(rerollRight>0) {
    if(b.hand.length) b.discard.push(b.hand.pop());
    G.battleDraw(rerollRight);
  }
  if(copyLeft>0 && b.hand.length) {
    let target=b.hand[0];
    for(let i=0;i<copyLeft;i++) { if(G.handCount(b)<G.HAND_CAP) b.hand.push(target); else b.discard.push(target); }
  }

  if(insp>=4) {
    if(st.direction==='horror') G.gainEnergy(1);
    if(st.direction==='romance') { let old=b.playerHp; b.playerHp=Math.min(b.playerMaxHp+b.tempMaxHp,b.playerHp+5); b.log.push(`💞 言情: 回复${b.playerHp-old}生命`); }
    if(st.direction==='fantasy') G.battleDraw(2);
    if(st.direction==='magic') { let n=G.shuffleDiscardIntoDraw(); b.log.push(`🔮 魔幻: 洗牌${n}张`); }
  }
  if(fullEssay) {
    let originals = [...b.hand];
    for(let ref of originals) {
      if(G.handCount(b) < G.HAND_CAP) b.hand.push(ref); else b.discard.push(ref);
    }
    b.discardAllAtTurnEnd = true;
    b.log.push(`📝 满分作文灵感: 从左到右复制${originals.length}张手牌，本回合结束全部弃置`);
  }
  if(insp>=8) {
    if(st.direction==='horror') { let n=G.discardMonsterHand(2); b.log.push(`👁️ 恐怖: 弃置对手${n}张手牌`); }
    if(st.direction==='romance' && !st.turnCopy && !st.temporary) {
      let ref='creation_turn::'+(++b.creationCopySeq);
      b.creationCards[ref]=G.copyCreationState(st,{ref:ref,temporary:true,turnCopy:true});
      if(G.handCount(b)<G.HAND_CAP) b.hand.push(ref); else b.discard.push(ref);
      b.log.push('💞 言情: 生成1张只能在本回合使用的复制');
    }
    if(st.direction==='fantasy') {
      b.monsterSilenceUntil=b.turn+1;
      (b.monsterHand||[]).forEach(c=>{c._silencedUntil=b.turn+1;});
      b.log.push('⚔️ 玄幻: 对方当前所有手牌沉默1回合');
    }
    if(st.direction==='magic') {
      let pool=b.monsterDrawPile||[];
      if(pool.length) {
        let idx=Math.floor(Math.random()*pool.length), card=pool.splice(idx,1)[0];
        let ref='enemy_copy::'+(++b.creationCopySeq);
        b.enemyCopies[ref]={card:JSON.parse(JSON.stringify(card))};
        if(G.handCount(b)<G.HAND_CAP) b.hand.push(ref); else b.drawPile.push(ref);
        b.log.push(`🔮 魔幻: 获取敌方卡牌【${card.name}】`);
      }
    }
  }
  // 非临时创作卡只要实际发动过效果就算完成；恐怖方向因“脱手”自动发动也能命名成书。
  if(!st.temporary && String(cd.ref||cd.id).startsWith('creation::')) {
    b.completedWorks.push(G.copyCreationState(st,{playedTurn:b.turn,triggeredBy:b._tuoshouResolving?'tuoshou':'played'}));
    b.log.push(`📚 ${cd.name}: ${b._tuoshouResolving?'脱手发动，':''}创作完成，胜利后可命名成书`);
  }
};

G.applyCardEffect = function(cd) {
  let b = G.state.battle;
  let s = G.state;
  if(cd.randomCardChance && G.rollChance(cd.randomCardChance)) {
    let c=G.gainRandomCardOfType(cd.randomCardType);
    if(c)b.log.push(`🍀 ${cd.name}: 概率成功，获得随机牌【${c.name}】`);
  }
  if(cd.accuracyRollChance) {
    let ok=G.rollChance(cd.accuracyRollChance);
    if(cd.accuracyRolls>1) for(let i=1;i<cd.accuracyRolls;i++) ok=ok||G.rollChance(cd.accuracyRollChance);
    if(ok){let n=cd.accuracyBonus||1;G.addPlayerStatus('accuracy',n);b.log.push(`🎯 ${cd.name}: 判定成功，精准+${n}`);}
  }
  if(cd.generateCard) { let c=G.CARDS[cd.generateCard]; if(c){if(G.handCount(b)<G.HAND_CAP)b.hand.push(c.id);else b.drawPile.push(c.id);b.log.push(`🔍 ${cd.name}: 获得【${c.name}】`);} }
  if(cd.breakDefense) { b.monsterStatuses.breakDefense=(b.monsterStatuses.breakDefense||0)+cd.breakDefense; b.log.push(`🔍 ${cd.name}: 目标获得${cd.breakDefense}层【破防】`); }
  if(cd.reasoningChoice) {
    G._pendingCardId=cd.id; let count=cd.reasoningCount||1;
    let take=(type)=>{for(let i=0;i<count;i++){let c=G.gainRandomCardOfType(type);if(c){G.changeCardCost(c.id,-1);b.log.push(`🧠 ${cd.name}: 获得【${c.name}】并使消耗-1`);}}};
    let both=G.rollChance(.5);
    let opts=[{text:'获得情商牌',cb:()=>{take('eq');if(both)take('intelligence');}},{text:'获得智力牌',cb:()=>{take('intelligence');if(both)take('eq');}}];
    if(both)b.log.push(`🧠 ${cd.name}: 判定成功，本次抉择两个方向都生效`);
    G.showChoiceModal(`🧠 ${cd.name} — 选择方向`,opts,{cancelable:true});return true;
  }
  if(cd.extraTurn) {
    b.extraTurnCount=(b.extraTurnCount||0)+cd.extraTurn;
    b.extraTurnDraw=cd.extraTurnDraw||0;
    b.extraTurnCostReduction=cd.extraTurnCostReduction||0;
    b.extraTurnChance=cd.extraTurnChance||0;
    b.log.push(`⏱️ ${cd.name}: 本回合结束后额外进行${cd.extraTurn}个回合`);
  }
  if(cd.discardHandPick && !cd._discardPicked) {
    if(!b.hand.length) { b.log.push(`🏃 ${cd.name}: 没有可弃置的手牌`); }
    else {
      G._pendingCardId=cd.id;
      G.showChoiceModal(`选择弃置1张手牌（${cd.name}）`,b.hand.map(ref=>({text:G.getCardData(ref)?.name||ref,sub:G.getCardData(ref)?.desc||'',cb:()=>{let i=b.hand.indexOf(ref);if(i>=0){let dropped=b.hand.splice(i,1)[0];G.discardFromHand(dropped);b.log.push(`🏃 ${cd.name}: 弃置【${G.getCardData(dropped)?.name||dropped}】`);}cd._discardPicked=true;G.applyCardEffect(cd);delete cd._discardPicked;}})),{cancelable:true});
      return true;
    }
  }
  if(cd.revealLogicIfNone&&!(b.weaknesses||[]).length)G.addWeakness('logic','card',false);
  // 无双挑战先展示四种破绽，然后自身作为解答效果击破解答破绽。
  if(cd.duelChallenge) {
    G.addChallengeWeaknesses(cd);
    G.triggerWeakpoint(cd);
    return false;
  }
  // 无伤害卡通常只发动一次效果；伤害卡在每一段伤害循环中分别判定。
  let hasDamage=!!(cd.dmgStat||cd.enduranceDmg||cd.enduranceTrueDmg||cd.hitsByArrogance||cd.conceit3Hits||cd.allZonesNameBonus||cd.deckMostCopiesBonus||cd.energyCostDmgPhysique||cd.biaozhun);
  if(!hasDamage) G.triggerWeakpoint(cd);
  if(cd.snackChoice) {
    G._pendingCardId=cd.id;
    G.showChoiceModal('🍫 备用零食 — 选择效果',[
      {text:'体力回复至上限',cb:()=>{G.gainEnergy(Math.max(0,b.maxEnergy-b.energy));b.log.push('🍫 备用零食: 体力回复至上限');}},
      {text:`回复${b.maxEnergy*2}点生命`,cb:()=>{let before=b.playerHp;b.playerHp=Math.min(b.playerMaxHp+b.tempMaxHp,b.playerHp+b.maxEnergy*2);b.log.push(`🍫 备用零食: 回复${b.playerHp-before}生命`);}}
    ]);
    return true;
  }

  if(cd.creationCard) { G.resolveCreationCard(cd); return false; }

  if(cd.frostBeforeWake){G.addPlayerStatus('shuangdie',cd.frostBeforeWake);b.log.push(`🦋 【${cd.name}】：获得${cd.frostBeforeWake}层【霜蝶】`);}
  if(cd.sleepAllHand){
    b.sleepWakeOnLeave={};
    if(cd.dreamWakeRemoveSleepingNextTurn) b.dreamWakeRemoveSleepingNextTurn=true;
    let sleepNames=b.hand.map(ref=>G.getCardData(ref)?.name||ref);
    let persistSleep=!cd.dreamWakeFrostDiscard;
    b.hand=b.hand.map(ref=>{let out=G.makeSleepingRef(ref,persistSleep);b.sleepWakeOnLeave[out]=true;return out;});
    b.log.push(`😴 【${cd.name}】: 以下手牌陷入【沉睡】：${sleepNames.length?sleepNames.map(n=>'【'+n+'】').join('、'):'无'}`);
  }
  if(cd.forgetChoice){
    let sleepable=b.drawPile.filter(ref=>!G.isSleepingCard(ref)), wakeable=b.discard.concat(b.equippedTools||[]).filter(ref=>G.isSleepingCard(ref));
    let chooseSleep=next=>{if(!sleepable.length){if(next)next();return;}G.showChoiceModal('选择卡组中的牌【沉睡】',sleepable.map(ref=>({text:G.getCardData(ref)?.name||ref,cb:()=>{let idx=b.drawPile.indexOf(ref);if(idx>=0)b.drawPile[idx]=G.makeSleepingRef(ref,true);G.addPlayerStatus('shuangdie',4);b.log.push(`😴 遗忘: 【${G.getCardData(ref)?.name||ref}】陷入【沉睡】，获得4层【霜蝶】`);if(next)next();}})));};
    let chooseWake=next=>{if(!wakeable.length){if(next)next();return;}G.showChoiceModal('选择要【苏醒】的卡牌',wakeable.map(ref=>({text:G.getCardData(ref)?.name||ref,cb:()=>{G.wakeCardRef(ref);b.wokeThisTurn++;if(next)next();}})));};
    let all=!!b._mengxieUsed,opts=[];
    if(sleepable.length) opts.push({text:'选择卡组中的牌【沉睡】并获得4层【霜蝶】',cb:()=>chooseSleep(all?()=>chooseWake():null)});
    if(wakeable.length) opts.push({text:'选择沉睡卡牌【苏醒】',cb:()=>chooseWake(all?()=>chooseSleep():null)});
    if(opts.length){G._pendingCardId=cd.id;G.showChoiceModal('遗忘 — 选择效果',opts);return true;}
  }
  if(cd.parry) { b.parry=true; b.log.push('🛡️ 心眼刀: 获得【招架】'); }
  if(cd.nextLogicRepeat) { b.nextLogicRepeat=true; b.log.push('⚔️ 连刺: 下一张逻辑卡额外发动1次'); }
  if(cd.revealFlaw) {
    let type=G.handFlawPriority(1)[0]||G.pick(G.WEAK_TYPES),w=G.addWeakness(type,'see_through',false);
    b.log.push(`👁️ 看破: 展示【${G.WEAK_NAMES[w.type]}破绽】`);
  }
  if(cd.generateSameQualitySlap){let q=G.cardQualityKey(cd.ref||cd.id),ref=`lcj_bazhang#tmp@${q}`;if(G.handCount(b)<G.HAND_CAP)b.hand.push(ref);else b.drawPile.push(ref);b.log.push(`👏 连环巴掌: 生成${q}品质临时【巴掌】`);}
  if(cd.selfMaxHpDamagePct){let n=Math.floor((b.playerMaxHp+b.tempMaxHp)*cd.selfMaxHpDamagePct);b.playerHp-=n;b.log.push(`💔 ${cd.name}: 对自己造成${n}点伤害`);if(b.playerHp<=0&&!G.tryRally()){b.over=true;b.won=false;return false;}}
  if(cd.readingProgress&&s.readingBook&&s.books[s.readingBook]){let q=G.cardQualityLevel(G.cardQualityKey(cd.ref||cd.id)),add=cd.readingProgress+(q>=2?(cd.readingBonusPurple||0):0),book=G.BOOKS[s.readingBook];s.books[s.readingBook].progress=Math.min(book.need,s.books[s.readingBook].progress+add);b.log.push(`📚 狂热阅读: 《${book.name}》进度+${add}`);}
  let offerUpgrade=function(title,toGold,temporary,shieldPer){let opts=b.hand.map((ref,i)=>({text:`${G.getCardData(ref).name}（${G.cardQualityKey(ref)}）`,sub:G.getCardData(ref).desc,cb:()=>{let lv=G.upgradeHandCard(i,toGold,temporary);if(shieldPer&&lv){let sh=Math.floor(lv*shieldPer*s.physique*(b.shieldItemMult||1));b.playerShield+=sh;b.log.push(`🛡️ 满级攻略: 获得${sh}护盾`);}}}));if(opts.length){G._pendingCardId=cd.id;G.showChoiceModal(title,opts);return true;}return false;};
  if(cd.temporaryUpgradePick&&offerUpgrade('选择本回合临时升级的卡牌',false,true,0))return true;
  if(cd.temporaryUpgradeIfShield10&&b.playerShield>=10&&offerUpgrade('选择本回合临时升级的卡牌',false,true,0))return true;
  if(cd.upgradeToGoldPick&&offerUpgrade('选择直接提升至金色的卡牌',true,false,.4))return true;
  if(cd.changeFlawType&&b.weaknesses.length){G._pendingCardId=cd.id;let opts=[];for(let w of b.weaknesses)for(let t of G.WEAK_TYPES)if(t!==w.type&&!b.weaknesses.some(x=>x.type===t))opts.push({text:`${G.WEAK_NAMES[w.type]}破绽 → ${G.WEAK_NAMES[t]}破绽`,cb:()=>{w.type=t;G.drawCardOfType(t);b.log.push(`👣 锐利步法: 改为【${G.WEAK_NAMES[t]}破绽】并摸对应卡牌`);}});if(opts.length){G.showChoiceModal('选择要改变的破绽',opts);return true;}}
  if(cd.inviteFlaw){G._pendingCardId=cd.id;G.showChoiceModal('选择要展示的破绽',G.WEAK_TYPES.map(t=>({text:`${G.WEAK_NAMES[t]}破绽`,cb:()=>{if(b.weaknesses.some(w=>w.type===t)){G.drawCardOfType(t);b.log.push('⚔️ 决斗邀请: 已有该破绽，摸1张对应卡牌');}else{G.addWeakness(t,'invite',false);b.log.push(`⚔️ 决斗邀请: 展示【${G.WEAK_NAMES[t]}破绽】`);}}})));return true;}
  if(cd.wakeHandPick){let refs=b.hand.filter(ref=>G.isSleepingCard(ref));if(refs.length){if(b._tuoshouResolving){let ref=G.pick(refs);if(G.fx&&G.fx.sleepWakePop)G.fx.sleepWakePop(G.baseId(ref));G.wakeCardRef(ref);b.wokeThisTurn++;if(cd.drawOnWake)G.battleDraw(cd.drawOnWake);}else{G._pendingCardId=cd.id;G.showChoiceModal('选择要【苏醒】的手牌',refs.map(ref=>({text:G.getCardData(ref).name,cb:()=>{if(G.fx&&G.fx.sleepWakePop)G.fx.sleepWakePop(G.baseId(ref));G.wakeCardRef(ref);b.wokeThisTurn++;if(cd.drawOnWake)G.battleDraw(cd.drawOnWake);}})));return true;}}}
  if(cd.sleepHandPick&&b.hand.length){
    // 该卡有选择弹窗，效果会提前返回；先发放4枚梦屑，避免结算被弹窗中断。
    if(cd.id==='shendu_shuimian'||cd.name==='深度睡眠') G.gainMengxie(cd.gainMengxie||4);
    G._pendingCardId=cd.id;G.showChoiceModal('选择要陷入【沉睡】的手牌',b.hand.map(ref=>({text:G.getCardData(ref).name,cb:()=>{let idx=b.hand.indexOf(ref);if(idx>=0)b.hand[idx]=G.makeSleepingRef(ref,true);b.log.push(`😴 【${G.getCardData(ref).name}】陷入【沉睡】`);}})));return true;
  }
  if(cd.dreamPerSleepingCard){let count=cd.countSleepingCards?['hand','drawPile','discard','exhaust'].reduce((n,z)=>(b[z]||[]).reduce((m,ref)=>m+(G.isSleepingCard(ref)?1:0),n),0):Object.keys(b.sleepingCards).length;G.gainMengxie(Math.min(cd.dreamPerSleepingCard,count));}
  if(cd.dreamOnNextFrost)b.dreamOnNextFrost=true;
  if(cd.preserveNextFrost)b.preserveNextFrost=true;
  if(cd.wakeRandom){let ids=G.shuffle(Object.keys(b.sleepingCards||{})).slice(0,cd.wakeRandom);ids.forEach(ref=>{if(G.fx&&G.fx.sleepWakePop)G.fx.sleepWakePop(ref);G.wakeCardRef(ref);});b.wokeThisTurn+=ids.length;if(cd.dreamPerWake)G.gainMengxie(ids.length*cd.dreamPerWake);}
  if(cd.wakeAllHand){let ids=b.hand.filter(ref=>G.isSleepingCard(ref));ids.forEach(ref=>{if(G.fx&&G.fx.sleepWakePop)G.fx.sleepWakePop(ref);G.wakeCardRef(ref);});b.wokeThisTurn+=ids.length;if(cd.frostPerWake)G.addPlayerStatus('shuangdie',ids.length*cd.frostPerWake);}
  if(cd.drawIfDream3&&b._mengxieBefore>=3)G.battleDraw(cd.drawIfDream3);
  if(cd.dreamExtraFrost&&b._mengxieUsed)G.addPlayerStatus('shuangdie',cd.dreamExtraFrost);
  if(cd.flawComboRewards){b.flawComboActive=true;G.resolveFlawComboRewards();}

  if(cd.creativeRemoveLast) G.removeLastCreativeInspiration();
  if(cd.fixedShield) {
    let fixedGain=Math.floor(cd.fixedShield*(b.shieldItemMult||1));b.playerShield += fixedGain;
    b.log.push(`🛡️ ${cd.name}: 获得${fixedGain}护盾`);
    if(G.fx && G.fx.shieldGain) G.fx.shieldGain();
  }

  // ===== 用具卡：仅装备到本场战斗用具区；数量不限，不改动局外备战 =====
  if(cd.type === 'tool') {
    b.equippedTools=b.equippedTools||[];
    b.equippedTools.push(cd.ref||cd.id);
    b.log.push(`🔧 装备了【${cd.name}】（本场共${b.equippedTools.length}件）`);
    return false; // 无延迟结算，正常进弃牌堆
  }

  // 特供小说：激活对应 buff（互斥，结束恢复）（2026-08-23 改版：普通卡牌，exhaust 收尾进移除堆）
  if(cd.novel) {
    if(b.novelBuff) {
      b.log.push(G.novelBlockedMsg());
    } else {
      G.activateNovel(cd.novel);
    }
    return false;
  }

  // 弟子规（肖清雅重做 2026-08-24）：打出后本场持续生效——每回合打出的第一张思路卡拥有回响
  if(cd.echoAura && !b.echoAura) {
    b.echoAura = true;
    b.log.push(`📖 ${cd.name}: 本场每回合第一张思路卡将获得回响`);
  }

  // 弃置所有手牌（重新思考：先弃后摸，修复此前先摸后弃会把刚摸到的牌也弃掉）
  if(cd.discardAll) {
    let kept = b.hand.filter(cid => G.cardKeptInHand(b,cid));
    let discarded = b.hand.filter(cid => !kept.includes(cid));
    b.hand = kept;
    discarded.forEach(cid => G.discardFromHand(cid)); // 脱手触发
  }
  if(cd.endTurnDiscardCount) b.endTurnDiscardCount=(b.endTurnDiscardCount||0)+cd.endTurnDiscardCount;

  if(cd.selfDiscardCount){
    let candidates=b.hand.slice();
    if(candidates.length<cd.selfDiscardCount)return false;
    G._pendingCardId=cd.id;
    G.showMultiSelect(`选择弃置${cd.selfDiscardCount}张手牌`,candidates,cd.selfDiscardCount,picked=>{
      picked.forEach(ref=>{let idx=b.hand.indexOf(ref);if(idx>=0){b.hand.splice(idx,1);G.discardFromHand(ref);}});
      G.battleDraw(cd.drawCards||0);b.log.push(`🗑️ ${cd.name}: 弃置${picked.length}张手牌`);
    });
    return true;
  }

  // Draw
  if(cd.drawCards) {
    let before = b.hand.length;
    G.battleDraw(cd.drawCards);
    // 新的尝试: 抽到的牌本回合0费（按抽到的卡id记录，出一张消一层）
    if(cd.freeDraws) {
      b.freeDrawCards = b.freeDrawCards || {};
      for(let i = before; i < b.hand.length; i++) {
        let did = b.hand[i];
        b.freeDrawCards[did] = (b.freeDrawCards[did]||0) + 1;
      }
      b.log.push(`✨ ${cd.name}: 抽到的${b.hand.length - before}张牌本回合0费`);
    }
  }

  // Status（认真备考：当前消耗低于3时获得层数减半，2026-08-24）
  if(cd.halveIfCostBelow3 && (b._lastCost || 0) < 3 && cd.status && cd.status.rationality) {
    let halved = Math.floor(cd.status.rationality / 2);
    G.addPlayerStatus('rationality', halved);
    b.log.push(`📝 ${cd.name}: 消耗低于3，获得${halved}层理性（减半）`);
  } else if(cd.status) {
    for(let [st,layers] of Object.entries(cd.status)) G.addPlayerStatus(st, layers);
  }

  // ===== 抉择（思维）=====
  if(cd.choice) {
    let isFirst = b.playerUsedCardsThisTurn.length === 1;
    if((s.talents||[]).includes('fate') || (cd.choiceBothIfFirst && isFirst)) {
      for(let o of cd.choice) for(let [st,l] of Object.entries(o.status)) G.addPlayerStatus(st, l);
      b.log.push(`⚖️ ${cd.name}: 本回合第一张卡，双效果发动`);
    } else {
      G._pendingCardId = cd.id;
      G.showChoiceModal('⚖️ 抉择 — ' + cd.name, cd.choice.map(o => ({text:o.text, status:o.status})),{cancelable:true});
      return true; // deferred
    }
  }

  // ===== 体力回复（谭梓君体系：奔跑/铅球/百米冲刺/永无止境）=====
  if(cd.energyRestore) {
    let g = G.gainEnergy(cd.energyRestore);
    if(g > 0) b.log.push(`⚡ ${cd.name}: 回复${g}体力`);
  }
  if(cd.energyRestoreCurCap) {
    // 铅球: x=打出此卡后的当前体力，最高3
    let x = Math.min(cd.energyRestoreCurCap, b.energy);
    if(x > 0) { G.gainEnergy(x); b.log.push(`⚡ ${cd.name}: 回复${x}体力`); }
  }
  if(cd.energyToMaxDmgPhysique) {
    // 百米冲刺: 回满体力，每回复1点造成0.5×体魄伤害
    let restored = b.maxEnergy - b.energy;
    if(restored > 0) {
      G.gainEnergy(restored);
      let dmg = Math.floor(restored * s.physique * cd.energyToMaxDmgPhysique);
      G.dealMonsterDamage(dmg, cd.name);
      b.log.push(`⚡ ${cd.name}: 回复${restored}体力，冲刺伤害${dmg}`);
    }
  }
  if(cd.globalCostPlus2 && !b.globalCostPlus) {
    b.globalCostPlus = cd.globalCostPlus2;
    b.log.push('🏃 永无止境: 本场所有卡牌费用+2');
  }
  if(cd.energySpendHeal) {
    b.energySpendHeal += cd.energySpendHeal;
    b.log.push(`🔥 热情: 每消耗1体力回复${cd.energySpendHeal}生命`);
  }
  // 助跑: 摸1张，摸到逻辑卡→回复体力+体魄护盾
  if(cd.drawCheckLogic) {
    let lenBefore = b.hand.length;
    G.battleDraw(1);
    if(b.hand.length > lenBefore) {
      let drawnCd = G.getCardData(b.hand[b.hand.length - 1]);
      if(drawnCd && drawnCd.type === 'logic') {
        if(cd.drawCheckLogic.energy) { G.gainEnergy(cd.drawCheckLogic.energy); b.log.push(`⚡ ${cd.name}: 摸到逻辑卡，+${cd.drawCheckLogic.energy}体力`); }
        if(cd.drawCheckLogic.shieldPhysique) {
          b.playerShield += Math.floor(s.physique*(b.shieldItemMult||1));
          b.log.push(`🛡️ ${cd.name}: 摸到逻辑卡，+${s.physique}护盾`);
          G.fx.shieldGain(); // 套盾特效（2026-08-19）
        }
      }
    }
  }
  // 抢跑: 下回合少摸一张牌
  if(cd.nextTurnDrawPenalty) b.nextTurnDrawPenalty += cd.nextTurnDrawPenalty;

  // ===== 小萌·霜眠效果（怪物手牌交互）=====
  if(cd.discardMonsterHand) {
    let n = G.discardMonsterHand(cd.discardMonsterHand);
    if(n > 0) b.log.push(`😴 ${cd.name}: 弃置对手${n}张手牌`);
  }
  if(cd.discardMonsterHandAll) {
    let n = b.monsterHand.length;
    if(n>0)b.monsterDiscard.push(...b.monsterHand);
    b.monsterHand = [];
    if(n > 0) {
      let dmg = Math.floor(n * G.effectiveInt() * (cd.dmgPerDiscard ? cd.dmgPerDiscard.mult : 0));
      G.dealMonsterDamage(dmg, cd.name);
      b.playerHp = Math.min(b.playerMaxHp + b.tempMaxHp, b.playerHp + n * (cd.healPerDiscard||0));
      b.log.push(`😴 ${cd.name}: 弃置对手${n}张手牌，伤害${dmg}，回复${n}生命`);
    }
  }
  if(cd.exileMonsterHand) {
    let perm = !!(b._mengxieUsed && cd.mengxieExtra && cd.mengxieExtra.exilePermanent);
    let count=cd.exileMonsterHand.count+((b._mengxieUsed&&cd.mengxieExtra&&cd.mengxieExtra.exileExtra)||0);
    let n = G.exileMonsterHand(count, cd.exileMonsterHand.turns||2, perm || cd.exileMonsterHand.permanent);
    if(n > 0) b.log.push(`😴 ${cd.name}: 移出对手${n}张手牌${perm?'(永久)':''}`);
    if(cd.dreamRepeatEffect&&b._mengxieUsed){let n2=G.exileMonsterHand(cd.exileMonsterHand.count,cd.exileMonsterHand.turns||2,false);if(n2)b.log.push(`💤 ${cd.name}: 额外发动，移出对手${n2}张手牌`);}
    if(cd.dreamRepeatEffect&&b._mengxieUsed&&cd.dmgStat){let n2=Math.floor(G.effectiveInt()*(cd.dmgMult||0));G.dealMonsterDamage(n2,`${cd.name}·额外发动`);}
  }
  if(cd.monsterNextDrawPenalty) b.monsterNextDrawPenalty += cd.monsterNextDrawPenalty;
  // 熬夜: 你下回合摸牌数+2（梦屑强化版改为本场战斗每回合+2，见下方mengxieExtra）
  if(cd.nextTurnPlayerDraw && !(b._mengxieUsed && cd.mengxieExtra && cd.mengxieExtra.playerBonusDraw2)) {
    b.nextTurnDrawBonus = (b.nextTurnDrawBonus||0) + cd.nextTurnPlayerDraw;
    b.log.push(`😴 ${cd.name}: 你下回合摸牌+${cd.nextTurnPlayerDraw}`);
  }
  if(cd.dreamIfEnemyHandLe2&&b.monsterHand.length<=2)G.gainMengxie(cd.dreamIfEnemyHandLe2);
  if(cd.monsterDrawPenaltyStack) {
    let before = b.monsterDrawPenalty;
    b.monsterDrawPenalty = Math.min(cd.drawStackCap||99,b.monsterDrawPenalty+cd.monsterDrawPenaltyStack);
    if(b.monsterDrawPenalty > before) b.log.push(`😴 遗忘: 对手每回合摸牌-1（共-${b.monsterDrawPenalty}）`);
  }
  if(cd.playerBonusDrawStack) {
    let before = b.playerBonusDraw;
    b.playerBonusDraw = Math.min(cd.drawStackCap||99,b.playerBonusDraw+cd.playerBonusDrawStack);
    if(b.playerBonusDraw > before) b.log.push(`😴 遗忘: 你每回合多摸1张（共+${b.playerBonusDraw}）`);
  }
  if(cd.nightmareFrostOnDiscard) b.nightmareFrostOnDiscard=true;
  if(cd.nightmareDreamDiscard)b.nightmareDreamDiscard=true;
  if(cd.mengxieExtra && b._mengxieUsed) {
    let ex = cd.mengxieExtra;
    if(ex.playerBonusDraw) { b.playerBonusDraw += ex.playerBonusDraw; b.log.push('💤 熬夜(梦屑): 本场每回合多摸1张'); }
    if(ex.shuangdie) { G.addPlayerStatus('shuangdie', ex.shuangdie); b.log.push('💤 抱紧枕头(梦屑): 额外+1层霜蝶'); }
    if(ex.discardMonsterHand) {let n=G.discardMonsterHand(ex.discardMonsterHand);b.log.push(`💤 【噩梦枷锁】: 立即弃置对手${n}张手牌`);}
  }
  if(cd.healFixed) {
    let hpBefore = b.playerHp;
    b.playerHp = Math.min(b.playerMaxHp + b.tempMaxHp, b.playerHp + cd.healFixed);
    let healed = b.playerHp - hpBefore;
    b.log.push(`💚 ${cd.name}: 回复${healed}生命`);
    if(healed > 0) G.fx.statusNumber('❤ +' + healed, 'heal');
  }
  if(cd.gainMengxieToMax)G.gainMengxie(Math.max(0,s.eq-b.mengxie));
  if(cd.gainMengxie)G.gainMengxie(cd.gainMengxie);
  if(cd.wakeHandSleeping){let ids=b.hand.filter(ref=>G.isSleepingCard(ref)),n=0;ids.forEach(ref=>{if(G.fx&&G.fx.sleepWakePop)G.fx.sleepWakePop(G.baseId(ref));if(G.wakeCardRef(ref))n++;});b.wokeThisTurn+=n;b.log.push(`🌤️ ${cd.name}: 【苏醒】手牌中的${n}张卡牌`);}
  if(cd.monsterPlayLimit) b.monsterPlayLimit = {turns:cd.monsterPlayLimit.turns, max:cd.monsterPlayLimit.max};
  if(cd.monsterSleepTurns) b.monsterSleepTurns += cd.monsterSleepTurns;
  if(cd.sleepEnemyDeckHits){b.enemyDeckSleepingHits=cd.sleepEnemyDeckHits;b.log.push(`😴 【永恒】: 敌方卡组陷入【沉睡】，受到${cd.sleepEnemyDeckHits}次伤害后解除`);}
  if(cd.wakeAllSleeping) {
    let sleepingIds = [...new Set([
      ...Object.keys(b.sleepingCards||{}),
      ...(b.equippedTools||[]).filter(ref=>G.isSleepingCard(ref))
    ])].filter(ref=>G.isSleepingCard(ref));
    if(sleepingIds.length > 0) {
      sleepingIds.forEach(cid => { if(G.fx&&G.fx.sleepWakePop)G.fx.sleepWakePop(G.baseId(cid)); G.wakeCardRef(cid); });
      b.log.push(`😴 永恒: 你的${sleepingIds.length}张沉睡卡牌（包括用具区）已苏醒`);
    } else {
      b.log.push('😴 永恒: 你没有沉睡的卡牌可苏醒');
    }
  }

  // ===== 中毒（编辑器效果积木 2026-08-23）=====
  // 给敌方叠加中毒：敌方回合开始受到等同层数的伤害（无视护盾），随后层数-1
  if(cd.poison) {
    b.monsterStatuses.poison = (b.monsterStatuses.poison || 0) + cd.poison;
    b.log.push(`☠️ ${cd.name}: 敌方中毒+${cd.poison}层（当前${b.monsterStatuses.poison}层）`);
  }

  // ===== 伤害 =====
  let didDamage = false;
  let ref = cd.ref || cd.id;
  if(cd.dmgStat || cd.enduranceDmg || cd.enduranceTrueDmg || cd.hitsByArrogance || cd.conceit3Hits || cd.allZonesNameBonus || cd.deckMostCopiesBonus || cd.energyCostDmgPhysique || cd.biaozhun) {
    didDamage = true;
    let stat = cd.dmgStat === 'intelligence' ? G.effectiveInt() :
               cd.dmgStat === 'eq' ? G.effectiveEq() :
               cd.dmgStat === 'intEq' ? G.effectiveInt()+G.effectiveEq() :
               cd.dmgStat === 'all' ? s.physique + s.intelligence + s.eq :
               cd.dmgStat === 'physique' ? s.physique : 0;

    // 理性加成（每层+20%智力，上限10层；多段伤害算一次；体魄伤害不吃理性）
    let ratLayers = (b.playerStatuses.rationality || 0);
    let effStat = stat;

    // ===== 薛诗蕾线：结算前处理（2026-08-24）=====
    let curCost = b._lastCost || 0;
    let dCost = curCost - (cd.cost || 0);
    // 大力刷题：结算时每层理性使智力提升%（紫色每降1费该提升减少5%）
    if(cd.ratStatPct && ratLayers > 0 && cd.dmgStat === 'intelligence') {
      let pct = cd.ratStatPct;
      if(cd.ratStatPctBelow && dCost < 0) pct = Math.max(0, pct - cd.ratStatPctBelow * (-dCost));
      effStat += Math.floor(stat * ratLayers * pct);
    }
    // 奥数压轴题：四档齐全先获得理性；红色此时每层理性再使智力提升30%
    if(cd.aoshuDiscount && G.costBrackets(b) >= 4) {
      G.addPlayerStatus('rationality', cd.aoshuAllRat || 4);
      b.log.push(`🏆 ${cd.name}: 四档齐全，+${cd.aoshuAllRat || 4}层理性`);
      if(cd.aoshuRedRat) effStat += Math.floor(stat * (b.playerStatuses.rationality || 0) * cd.aoshuRedRat);
    }
    // 死磕大题：自动消耗至多3层理性（体力需付得起每层+1费），每层倍率+
    b._xslSike = 0;
    if(cd.sikeRatMax) {
      let canX = Math.min(cd.sikeRatMax, ratLayers, Math.max(0, Math.floor(b.energy / (cd.sikeCostPer || 1))));
      if(canX > 0) {
        b._xslSike = canX;
        b.energy -= canX * (cd.sikeCostPer || 1);
        b.energySpentTotal += canX * (cd.sikeCostPer || 1);
        b.playerStatuses.rationality = Math.max(0, ratLayers - canX);
        b.log.push(`✊ ${cd.name}: 消耗${canX}层理性，倍率+${(canX * cd.sikeMultPer).toFixed(1)}`);
      }
    }
    // 答案写满：自动消耗等同智力的护盾使倍率+1.5
    b._xslXieman = 0;
    if(cd.xiemanShieldMult) {
      let need = Math.floor(G.effectiveInt());
      if(need > 0 && b.playerShield >= need) {
        b.playerShield -= need;
        b._xslXieman = 1;
        b.log.push(`✍️ ${cd.name}: 消耗${need}护盾，倍率+${cd.xiemanShieldMult}`);
      }
    }
    // 这道题，我会：消耗全部理性（最多计算10层）
    b._xslWuhui = 0;
    if(cd.wuhuiPerRat && ratLayers > 0) b._xslWuhui = Math.min(ratLayers, cd.wuhuiMaxRat || 10);
    // 再算一种方法：本回合已用逻辑卡→原始消耗视为最近一张的原始消耗，判定【已变更】
    if(cd.zaisuanRat && (b.turnLogicCardsPlayed||0) > 0 && b.lastLogicOrigCost != null) {
      if(curCost !== b.lastLogicOrigCost || (b.cardCostChanges[ref] || 0) > 0) {
        G.addPlayerStatus('rationality', cd.zaisuanRat);
        b.log.push(`🔁 ${cd.name}: 满足【已变更】判定，+${cd.zaisuanRat}层理性`);
      }
    }

    let baseDmg = cd.dmgStat ? Math.floor(effStat * cd.dmgMult) : 0;
    if(b._dreamLogicUsed&&cd.type==='logic')baseDmg+=Math.floor(G.effectiveInt()*.5);
    if(b._mengxieUsed&&cd.dreamExtraDamage)baseDmg+=Math.floor(G.effectiveInt()*cd.dreamExtraDamage);
    if(cd.type === 'logic' && G.state.activeBonds.science && cd.dmgStat) baseDmg += 1;
    if(b.battleDmgPlus) baseDmg += 1;

    let hits = cd.hits || 1;
    if(cd.hitsByQualityUpgrades)hits=1+Math.min(4,b.qualityUpgradedThisTurn||0);
    if(cd.repeatIfThreeFlawKinds&&b._weakKindsBeforeCard>=3)hits++;
    // 随性言语: 段数 = 1 + 傲慢层数
    if(cd.hitsByArrogance) hits = 1 + G.arroganceTotal();
    // 尽在掌握: 3段
    if(cd.conceit3Hits) hits = 3;
    // 一题多解: 追加段数 = 本次进入手牌后费用改变次数（上限3）
    if(cd.perChangeHit) hits = 1 + Math.min(cd.maxChangeHits || 3, (b.cardCostChanges[ref] || 0));

    let totalDmg = 0;
    let hitFxValues = [];
    let monsterHpBeforeDamage = b.monsterHp;
    for(let h=0;h<hits;h++) {
      G.triggerWeakpoint(cd);
      let dmg;
      if(cd.conceit3Hits) {
        // 每段 = 当前傲慢 ×0.7 ×智力，之后傲慢减半
        let a = G.arroganceTotal();
        dmg = Math.floor(a * cd.conceit3Hits * G.effectiveInt());
        G.consumeArrogance(Math.ceil(a / 2));
      } else if(cd.biaozhun) {
        // 标准答案: 造成本回合单张逻辑卡最高总伤害的X%
        dmg = Math.floor((b.turnMaxLogicDmg || 0) * cd.biaozhun);
      } else if(cd.enduranceDmg) {
        dmg = Math.max(cd.enduranceDmg.min || 1, Math.floor(b.endurance * cd.enduranceDmg.mult));
      } else if(cd.enduranceTrueDmg) {
        dmg = Math.floor(b.endurance * cd.enduranceTrueDmg);
      } else if(cd.allZonesNameBonus) {
        // 遥遥织女星: 1点 + 各处每种同名卡≥2张 ×1×情商（同名按基础id归组）
        let zones = [...b.hand, ...b.drawPile, ...b.discard, ...b.exhaust];
        let counts = {};
        zones.forEach(cid => { let k = G.baseId(cid); counts[k] = (counts[k]||0) + 1; });
        let kinds = Object.values(counts).filter(c => c >= 2).length;
        dmg = 1 + kinds * Math.floor(G.effectiveEq());
      } else if(cd.deckMostCopiesBonus) {
        // 迢迢牵牛星（肖清雅重做 2026-08-24）: 1点 + 我方各处数量最多的同名牌张数 ×1×情商
        let zones = [...b.hand, ...b.drawPile, ...b.discard, ...b.exhaust];
        let counts = {};
        zones.forEach(cid => { let k = G.baseId(cid); counts[k] = (counts[k]||0) + 1; });
        let maxN = 0;
        for(let k in counts) if(counts[k] > maxN) maxN = counts[k];
        dmg = 1 + maxN * Math.floor(G.effectiveEq());
      } else if(cd.energyCostDmgPhysique) {
        // 君姐模式: 造成等同于x倍体魄的伤害（x=消耗的体力）
        dmg = (b._lastCost || 0) * s.physique * (cd.dmgMult || 1);
      } else {
        let mult = cd.dmgMult + G.singleDogBonus(cd);
        if(cd.multPerEnemyFlaw)mult+=(b._flawsBeforeCard||0)*cd.multPerEnemyFlaw;
        if(cd.multIfFlawBroken&&b._weakBrokenBeforeCard>0)mult+=cd.multIfFlawBroken;
        if(cd.multIfWokeThisTurn&&b.wokeThisTurn>0)mult=cd.multIfWokeThisTurn;
        if(cd.dreamPerHitBonus&&G.spendMengxie(1))mult+=cd.dreamPerHitBonus;
        // 一题多解: 首段基础倍率，追加段固定倍率
        if(cd.perChangeHit) mult = (h === 0) ? cd.dmgMult : cd.perChangeHit;
        if(cd.mengxieExtra && cd.mengxieExtra.dmgMult && b._mengxieUsed) mult = cd.mengxieExtra.dmgMult;
        if(cd.rationalityPerStack) mult = cd.dmgMult + ratLayers * cd.rationalityPerStack;
        if(cd.wushiMultPerStack) mult = cd.dmgMult + (b.playerStatuses.wushi||0) * cd.wushiMultPerStack;
        if(cd.hitsByArrogance) mult = cd.hitsByArrogance.dmgMult;
        if(cd.multAfterIdea && b.turnIdeaCardsPlayed > 0) mult = cd.multAfterIdea;
        // ===== 薛诗蕾线：费用相关倍率（2026-08-24）=====
        if(cd.extraIfCost2 && curCost === 2) mult += cd.extraIfCost2;                 // 刷题：当前消耗为2
        if(cd.aboveBonus && dCost > 0) mult += cd.aboveBonus * dCost;                 // 狠狠刷题/超纲题：每高1费
        if(cd.belowPenalty && dCost < 0) mult -= cd.belowPenalty * (-dCost);          // 超纲题：每低1费
        if(cd.belowBonus && dCost < 0) mult += cd.belowBonus * (-dCost);              // 这题有捷径：每降1费
        if(cd.zeroMult && curCost === 0) mult = cd.zeroMult;                          // 选择题秒了：0费改倍率
        if(cd.ratPerHit) mult += ratLayers * cd.ratPerHit;                            // 咬笔尖：每层理性每段
        if(cd.sameNameBonus) {                                                        // 再验算一遍：同名卡加成（计数为打出前快照）
          let sameN = Math.min(cd.sameNameMax || 2, (b.turnPlayedNames[cd.name] || 0));
          mult += cd.sameNameBonus * sameN;
        }
        if(b.cardMultUp && b.cardMultUp[ref]) mult *= 1 + b.cardMultUp[ref] / 100;    // 倍率提升%（先难后易金/举一反三金）
        if(b._beikaoPct && h === 0 && cd.type === 'logic') mult *= 1 + b._beikaoPct / 100; // 备考倍率提升（本次出牌消耗了充能）
        if(b._xslSike > 0) mult += b._xslSike * (cd.sikeMultPer || 0);                // 死磕大题
        if(b._xslWuhui > 0) mult += b._xslWuhui * cd.wuhuiPerRat;                     // 这道题，我会
        if(b._xslXieman > 0) mult += cd.xiemanShieldMult;                             // 答案写满
        if(cd.zaisuanBonus) mult += cd.zaisuanBonus;                                  // 再算一种方法(金)额外倍率
        // 压轴一笔: 最后一张手牌时改为高倍率（修复：字段此前从未生效）
        if(cd.lastCardMult && b.hand.length === 0) {
          mult = cd.lastCardMult;
          b.log.push(`✍️ ${cd.name}: 最后一张手牌，倍率提升至${mult}×`);
        }
        dmg = Math.floor(effStat * mult);
        // 扩写/抒情散文: 每层感性额外伤害
        if(cd.sensMult && (b.playerStatuses.sensibility||0) > 0) {
          dmg += Math.floor(G.effectiveEq() * cd.sensMult * (b.playerStatuses.sensibility||0));
        }
        // 痴情: 同名卡临时情商加成（按基础id归组）
        if(cd.dmgStat === 'eq' && (b.cardNameStacks[G.baseId(cd.id)]||0) > 0) dmg += b.cardNameStacks[G.baseId(cd.id)];
        // 细心: 每层逻辑卡伤害+10%
        if(cd.type === 'logic' && (b.playerStatuses.careful||0) > 0) {
          dmg = Math.floor(dmg * (1 + 0.1 * (b.playerStatuses.careful||0)));
        }
        // 认真：每层使下一张逻辑卡的每段伤害+3，结算后消耗全部认真。
        if(cd.type === 'logic' && (b.playerStatuses.serious||0) > 0) {
          dmg += 3 * b.playerStatuses.serious;
        }
        // 精准：每层提供3%概率使本段伤害变为180%，概率加算。
        let accuracyLayers = (b.playerStatuses.accuracy||0) * (cd.accuracyLayersMult || 1);
        if(accuracyLayers>0 && G.rollChance(Math.min(1,accuracyLayers*0.03))) {
          dmg=Math.floor(dmg*1.8); b.log.push('🎯 精准: 本段伤害提升至180%');
        }
        // 连击（编辑器效果积木 2026-08-23）: 本回合每打出过1张牌，此段伤害+N（不含自身）
        if(cd.comboDmg) {
          let before = Math.max(0, (b.playerUsedCardsThisTurn||[]).length - 1);
          if(before > 0) dmg += cd.comboDmg * before;
        }
      }

      // 回合修正（逻辑卡专属：冲刺复习×1.3；备考/冲刺复习的下1张逻辑卡加成）
      if(cd.type === 'logic') {
        dmg = Math.floor(dmg * b.turnLogicDmgMult);
        if(b.nextLogicDmgMult && b.nextLogicDmgMult !== 1) dmg = Math.floor(dmg * b.nextLogicDmgMult);
      }
      if(cd.hitsByQualityUpgrades&&h>0)dmg=Math.floor((G.effectiveInt()+G.effectiveEq())*.4);
      dmg=Math.floor(dmg*G.qualityBonusMultiplier(cd));
      dmg += b.turnNextDmgBonus;
      b.turnNextDmgBonus = 0;
      // 特供小说攻击修正（互斥，2026-08-22）：龙族攻击×2~×3随机 / 银河攻击×0.5
      if(b.novelBuff === 'longzu') dmg = Math.floor(dmg * (2 + Math.random()));
      else if(b.novelBuff === 'yinhe') dmg = Math.floor(dmg * 0.5);
      if((s.talents||[]).includes('loud_voice')) dmg = Math.floor(dmg * 1.4);
      if((s.talents||[]).includes('materialist_warrior') && !Object.values(b.playerStatuses||{}).some(v=>Number(v)>0)) dmg = Math.floor(dmg * 5);
      if((s.talents||[]).includes('fate')) dmg=Math.floor(dmg*(1+Math.floor((s.gold||0)/100)*0.5));

      // 专注力天赋: 每场战斗首次逻辑卡伤害×1.5（整张卡每段都吃，2026-08-23 补实现）
      if(cd.type === 'logic' && (s.talents||[]).includes('focused_mind') && !b.focusedMindUsed) {
        dmg = Math.floor(dmg * 1.5);
        if(h === 0) { b.focusedMindUsed = true; b.log.push('🎯 专注力: 本场首次逻辑卡伤害×1.5'); }
      }

      // 真实伤害: 无视护盾与减伤，吃真伤加成
      if(b.damageBonusTurns > 0) dmg = Math.floor(dmg * 1.8);
      let isTrue = !!cd.enduranceTrueDmg || cd.dmgType === 'true';
      if(isTrue) {
      } else if(b.monsterStatuses.shield) {
        let sd = Math.min(b.monsterStatuses.shield, dmg);
        b.monsterStatuses.shield -= sd;
        dmg -= sd;
      }
      b.monsterHp -= dmg; G.recordRunDamage('dealt',dmg);
      if(cd.applyColor&&dmg>0){
        b.monsterColors=b.monsterColors||[];let colors=['黄','绿','蓝'],missing=colors.filter(c=>!b.monsterColors.includes(c));if(missing.length){let color=G.pick(missing);b.monsterColors.push(color);b.log.push(`🎨 ${cd.name}: 为目标施加【${color}色】`);if(b.monsterColors.length===3){(b.monsterHand||[]).forEach(card=>card._silencedUntil=b.turn+1);b.log.push('🎨 上色: 目标拥有三色，所有敌方手牌沉默1回合');}}}
      if(G.toolActive('yusan')&&dmg>0){let shield=Math.min(Math.floor(dmg*.5),Math.max(0,(s.physique||0)*2));if(shield>0){b.playerShield+=shield;b.log.push(`☂️ 雨伞: 将${Math.floor(dmg*.5)}伤害转为${shield}护盾`);}}
      if(cd.enduranceFromDamage && dmg > 0) {
        let eg = Math.floor(dmg * cd.enduranceFromDamage * ((s.star >= 2 && s.character && s.character.id === 'chengliang') ? 1.3 : 1));
        b.endurance = (b.endurance || 0) + eg;
        if(eg) b.log.push(`💪 ${cd.name}: +${eg}耐力`);
        G.checkChengliangPedometer();
      }
      if(dmg>0) hitFxValues.push(dmg);
      if(dmg>0&&b.enemyDeckSleepingHits>0)b.enemyDeckSleepingHits--;
      totalDmg += dmg;
      if(cd.type==='logic'&&dmg>b.monsterMaxHp*.10&&G.toolActive('wushuang_sword')){let got=G.gainEnergy(1);if(got)b.log.push('⚔️ 无双剑: 单次伤害超过目标生命上限10%，回复1体力');}

      // 感性消耗: 每次伤害实例-1层，多段多次消耗；每层+1本场战斗情商
      // 修复（2026-08-22）：状态说明为"造成伤害时"——不再限定逻辑卡，解答卡伤害同样消耗/转化
      // 肖清雅重做（2026-08-24）：交际花已改为搭档相关被动，不再额外+1
      let sensNow = b.playerStatuses.sensibility || 0;
      if(sensNow > 0 && !b.noSensConsume) {
        b.playerStatuses.sensibility = sensNow - 1;
        s.combatEq += sensNow;
      }
    }
    // 基础攻击特效：屏幕抖动 + 爆炸 + 伤害飘字（仅实际造成伤害时触发）
    if(totalDmg > 0) {
      if((s.talents||[]).includes('sharp_tongue')) { let td=Math.floor(totalDmg*.25); b.monsterHp-=td; G.recordRunDamage('dealt',td); totalDmg+=td; b.log.push(`🦷 牙尖嘴利: +${td}真实伤害`); }
      if(cd.type==='logic' && (s.talents||[]).includes('double_shooter') && G.rollChance(.25)) { let dd=Math.floor(totalDmg*.5); G.dealMonsterDamage(dd,'双发射手',true); }
      if((s.talents||[]).includes('sweep_kick') && !b.sweepKickUsed) {
        b.sweepKickUsed=true;
        let n=G.discardMonsterHand ? G.discardMonsterHand(1) : 0;
        b.log.push(n?'🦵 扫堂腿: 弃置对方1张手牌':'🦵 扫堂腿: 对方没有手牌可弃');
      }
      // 龙族状态下的攻击牌：全屏黑遮 + 随机红色刀光 + 每刀抖动（替换常规攻击特效）
      let showHit=function(value){
        if(b.novelBuff === 'longzu') G.fx.dragonSlash(document.getElementById('monsterPortraitBox'), value);
        else G.fx.attackMonster(value);
      };
      if(hitFxValues.length>1){
        let step=1000/hitFxValues.length;
        hitFxValues.forEach((value,i)=>setTimeout(()=>showHit(value),Math.floor(i*step)));
      } else showHit(hitFxValues[0]||totalDmg);
    }
    // 素材积累: 保护一次伤害后失效（修复：不限逻辑卡）
    if(b.noSensConsume) b.noSensConsume = false;

    // 本回合单张逻辑卡最高一次总伤害（标准答案记录）
    b._lastCardTotalDmg = totalDmg;
    if(cd.type === 'logic') b.turnMaxLogicDmg = Math.max(b.turnMaxLogicDmg, totalDmg);
    if(cd.type==='logic' && (b.playerStatuses.serious||0)>0) b.playerStatuses.serious=0;

    // 理性消耗（2026-08-24 规范版）：先完成伤害结算，再-1层；同卡多段只减1层
    // 理性精通天赋: 理性不再因造成伤害减少
    if(cd.wuhuiPerRat) {
      // 这道题，我会：消耗全部理性
      b.playerStatuses.rationality = 0;
    } else if(ratLayers > 0 && !(s.talents||[]).includes('rationality_mastery')) {
      let consume = cd.consumeRationality || 1;
      // 冷静分析: 本回理性因伤害减少时前N次不减少；每阻止1次下一张逻辑卡+1费
      if(b.rationalityGuard > 0) {
        b.rationalityGuard--;
        b.calmSurch = (b.calmSurch || 0) + 1;
        consume = 0;
        b.log.push('🧊 冷静分析: 理性未减少，下一张逻辑卡+1费');
      }
      if(consume > 0) b.playerStatuses.rationality = Math.max(0, (b.playerStatuses.rationality||0) - consume);
    }
    // 细心消耗（使用逻辑卡后移除所有）
    if(cd.type === 'logic' && (b.playerStatuses.careful||0) > 0) b.playerStatuses.careful = 0;
    // 随性言语: 之后傲慢-4
    if(cd.arroganceDown4) G.consumeArrogance(4);
    // 自信一笑: 目标生命<75% → +2无视
    if(cd.wushiIfHpBelow75 && b.monsterMaxHp > 0 && b.monsterHp / b.monsterMaxHp < 0.75) {
      G.addPlayerStatus('wushi', 2);
      b.log.push('😏 自信一笑: 目标生命<75%，+2无视');
    }
    // 答案写满: 结算后仍有护盾→获得理性
    if(cd.xiemanShieldMult && b.playerShield > 0) {
      G.addPlayerStatus('rationality', cd.xiemanRat || 1);
      b.log.push(`✍️ ${cd.name}: 仍有护盾，+${cd.xiemanRat || 1}层理性`);
    }
    b.log.push(`💥 ${cd.name}: 造成${totalDmg}点伤害（敌方生命${monsterHpBeforeDamage}→${monsterHpBeforeDamage-totalDmg}）`);
    // 吸血（编辑器效果积木 2026-08-23）: 造成伤害的X%回复生命
    if(cd.lifestealPct && totalDmg > 0) {
      let heal = Math.floor(totalDmg * cd.lifestealPct / 100);
      if(heal > 0) {
        let effMax = b.playerMaxHp + b.tempMaxHp;
        let hpBefore = b.playerHp;
        b.playerHp = Math.min(effMax, b.playerHp + heal);
        if(b.playerHp > hpBefore) b.log.push(`🩸 吸血: 回复${b.playerHp - hpBefore}生命`);
      }
    }
  }
  // 君姐模式: 消耗体力≥6 → 回复2体力 + 本场体力回复和上限+1
  if(cd.energyCostBonus6 && (b._lastCost || 0) >= (cd.energyCostThreshold||6)) {
    let gain=cd.energyBonus||2,cap=cd.maxEnergyBonus||1;
    G.gainEnergy(gain); b.maxEnergy += cap; b.regenBonus = (b.regenBonus || 0) + cap;
    b.log.push(`🏃 君姐模式: 回复${gain}体力，本场体力上限与回复+${cap}`);
  }

  // ===== 护盾 =====
  let shieldGain = 0;
  if(cd.shieldStat) {
    let stat = cd.shieldStat === 'intelligence' ? G.effectiveInt() : (cd.shieldStat === 'physique' ? s.physique : G.effectiveEq());
    let mult = cd.shieldMult + G.singleDogBonus(cd);
    if(cd.shieldMultLowEnergy && b.energy <= 0) mult = cd.shieldMultLowEnergy;
    shieldGain = Math.floor(stat * mult);
    // 续写: ≥2层感性额外+1倍
    if(cd.shieldExtraIfSens2 && (b.playerStatuses.sensibility||0) >= 2) {
      shieldGain += Math.floor(G.effectiveEq() * cd.shieldExtraIfSens2);
    }
  }
  if(cd.shieldFromLifeCost) shieldGain = (b._lastLifeCost || 0) * cd.shieldFromLifeCost;
  if(cd.shieldFromEndurance) shieldGain = Math.floor(b.endurance);
  if(cd.shieldFromLostLife) shieldGain = Math.floor((b.playerMaxHp + b.tempMaxHp) - b.playerHp);
  if(cd.shieldFromArrogance) shieldGain = Math.floor(G.arroganceTotal() * G.effectiveInt());
  if(cd.doubleArrogance) {
    // 熟视无睹: 傲慢层数翻倍（普通/临时各自×2，修复：此前临时层会被多加一遍导致超过翻倍）
    b.playerStatuses.arrogance = (b.playerStatuses.arrogance||0) * 2;
    b.arroganceTemp = (b.arroganceTemp||0) * 2;
    if(cd.shieldArroganceMult) shieldGain = Math.floor(G.arroganceTotal() * cd.shieldArroganceMult);
  }
  // 魔戒buff：护盾获得×2~×3随机（2026-08-22）
  if(b.novelBuff === 'mojie' && shieldGain > 0) shieldGain = Math.floor(shieldGain * (2 + Math.random()));
  if(shieldGain > 0) {
    shieldGain=Math.floor(shieldGain*G.qualityBonusMultiplier(cd));
    // 良哥真男人(挚友天赋): 护盾获取提升=已损失生命%
    if(s.talents.includes('liangge')) {
      let lostPct = ((b.playerMaxHp + b.tempMaxHp) - b.playerHp) / (b.playerMaxHp + b.tempMaxHp);
      shieldGain = Math.floor(shieldGain * (1 + lostPct));
    }
    if(b.shieldItemMult > 1) shieldGain = Math.floor(shieldGain * b.shieldItemMult);
    b.playerShield += shieldGain;
    b.log.push(`🛡️ ${cd.name}: +${shieldGain} 护盾`);
    G.fx.statusNumber('🛡 +' + shieldGain, 'shield');
    G.fx.shieldGain(null, b.novelBuff === 'mojie' ? 'mojie' : null); // 套盾特效：魔戒=绿色全屏环形，否则蓝白光环（2026-08-22）
  }

  // ===== 特定卡牌效果 =====
  // 备考: 本回合下1张逻辑卡消耗-2、智力加成×1.3（修复：此前误做成全回合且对所有卡生效）
  if(cd.buffNextLogicCost || cd.buffNextLogicMult) {
    b.nextLogicCostRed = (b.nextLogicCostRed || 0) + (cd.buffNextLogicCost || 0);
    b.nextLogicDmgMult = (b.nextLogicDmgMult || 1) * (cd.buffNextLogicMult || 1);
    b.log.push(`📝 ${cd.name}: 下1张逻辑卡消耗${cd.buffNextLogicCost || 0}、伤害×${cd.buffNextLogicMult || 1}`);
  }
  // 备考(2026-08-24 规范版): 接下来N张逻辑卡+1费并获得pct%倍率提升
  if(cd.beikao) {
    b.beikao.n = (b.beikao.n || 0) + cd.beikao.n;
    b.beikao.pct = Math.max(b.beikao.pct || 0, cd.beikao.pct);
    b.log.push(`📝 ${cd.name}: 接下来${cd.beikao.n}张逻辑卡+1费并获得${cd.beikao.pct}%倍率提升`);
  }
  if(cd.buffDmg) b.turnNextDmgBonus += cd.buffDmg;
  // 劳逸结合: 移除全部认真与理性，体力回满；金色共移除≥7层本场体力上限+1（2026-08-24）
  if(cd.id === 'laoyi_jiehe') {
    let removed = (b.playerStatuses.rationality || 0) + (b.playerStatuses.serious || 0);
    b.playerStatuses.rationality = 0;
    b.playerStatuses.serious = 0;
    b.energy = b.maxEnergy;
    if(cd.laoyiMaxUp && removed >= cd.laoyiMaxUp) {
      b.maxEnergy += 1;
      b.log.push(`🌿 劳逸结合(金): 共移除${removed}层，本场体力上限+1`);
    }
  }
  // 认真对待: 理性至少3层时再+1层认真（基础1层由status区结算，2026-08-24）
  if(cd.rdExtraIfRat3 && (b.playerStatuses.rationality || 0) >= 3) {
    G.addPlayerStatus('serious', 1);
    b.log.push('🎯 认真对待: 理性≥3层，再+1层认真');
  }
  // 冷静分析: 本回理性因伤害减少时前N次不减少（2026-08-24）
  if(cd.calmGuard) {
    b.rationalityGuard = Math.max(b.rationalityGuard || 0, cd.calmGuard);
    b.log.push(`🧊 冷静分析: 本回理性因伤害减少时前${cd.calmGuard}次不减少`);
  }
  // 全部验算正确: 本回合每出现1种不同的逻辑卡使用费用再+1层（上限，2026-08-24）
  if(cd.yansuanExtra) {
    let arr = (b.turnLogicCosts || []).map(c => c >= 3 ? 3 : c);
    let distinct = arr.filter((v, i, a) => a.indexOf(v) === i).length;
    let extra = Math.min(cd.yansuanExtra, distinct);
    if(extra > 0) {
      G.addPlayerStatus('rationality', extra);
      b.log.push(`✅ 全部验算正确: ${distinct}种费用档位，再+${extra}层理性`);
    }
  }
  // ===== 0费使用奖励（通宵复习/这题有捷径/刷完这套卷子/选择题秒了金）=====
  if((b._lastCost || 0) === 0) {
    if(cd.zeroCostRat) { G.addPlayerStatus('rationality', cd.zeroCostRat); b.log.push(`🌙 ${cd.name}: 0费使用，+${cd.zeroCostRat}层理性`); }
    if(cd.zeroRat) { G.addPlayerStatus('rationality', cd.zeroRat); b.log.push(`🌙 ${cd.name}: 0费使用，+${cd.zeroRat}层理性`); }
    if(cd.zeroDrawLogic) { G.battleDrawLogic(1); b.log.push(`🌙 ${cd.name}: 0费使用，摸1张逻辑卡`); }
    if(cd.goldZeroNextDiscount) { b.zeroNextGe2 = (b.zeroNextGe2 || 0) + 1; b.log.push('🌙 选择题秒了(金): 下一张原始消耗≥2的逻辑卡-1费'); }
  }
  // 反复刷题: 当前消耗大于3 → 下一张逻辑卡-1费（2026-08-24）
  if(cd.ifCostGt3NextDiscount && (b._lastCost || 0) > 3) {
    b.nextLogicDisc = (b.nextLogicDisc || 0) + cd.ifCostGt3NextDiscount;
    b.log.push('🔁 反复刷题: 下一张逻辑卡-1费');
  }
  // 草稿纸写满了: 本回合已使用逻辑卡数阶梯奖励（2026-08-24）
  if(cd.caozhiSteps) {
    let n = b.turnLogicCardsPlayed || 0;
    if(n >= 2) { G.addPlayerStatus('rationality', 1); b.log.push('📄 草稿纸写满了: 已用2张逻辑卡，+1层理性'); }
    if(n >= 4) { G.battleDrawLogic(1); b.log.push('📄 草稿纸写满了: 已用4张逻辑卡，摸1张逻辑卡'); }
    if(n >= 6) { G.gainEnergy(1); b.log.push('📄 草稿纸写满了: 已用6张逻辑卡，+1体力'); }
  }
  // 草稿推演: 记录本牌当前消耗，下一张逻辑卡结算（2026-08-24）
  if(cd.scratchRecord) {
    b.scratchRec = { cost: b._lastCost || 0, rat: cd.scratchRat || 1, gold: cd.scratchGoldShield || 0 };
    b.log.push(`📐 草稿推演: 记录当前消耗${b.scratchRec.cost}`);
  }
  // 错题重做: 带有【已变更】时调整手牌中1张其他逻辑卡费用（紫随机/金自选，2026-08-24）
  if(cd.changedModOther && b.cardChanged[ref]) {
    let others = b.hand.filter(r => { let d = G.getCardData(r); return d && d.type === 'logic'; });
    if(others.length > 0) {
      if(cd.changedModOther === 2) {
        G._pendingCardId = cd.id;
        let opts = [];
        others.forEach(r => {
          let d = G.getCardData(r);
          opts.push({text:`${d.name}（+1费）`, cb:() => G.changeCardCost(r, 1)});
          opts.push({text:`${d.name}（-1费）`, cb:() => G.changeCardCost(r, -1)});
        });
        G.showChoiceModal('❌ 错题重做 — 选择要调整的其他逻辑卡', opts);
        return true;
      } else {
        let r = others[Math.floor(Math.random() * others.length)];
        G.changeCardCost(r, G.rollChance(.5) ? 1 : -1);
      }
    }
  }
  // 新的尝试: 摸2张，选其中1张消耗-X（X=本次消耗），另一张-1（2026-08-24）
  if(cd.newTryPick) {
    let X = b._lastCost || 0;
    let before = b.hand.length;
    G.battleDraw(2);
    let drawn = b.hand.slice(before);
    if(drawn.length > 0) {
      G._pendingCardId = cd.id;
      G.showChoiceModal(`✨ 新的尝试 — 选1张消耗-${X}（另一张-1）`, drawn.map(r => ({
        text: G.getCardData(r).name,
        sub: `当前消耗⚡${G.getCardCost(G.getCardData(r))}`,
        cb: () => { drawn.forEach(o => G.changeCardCost(o, o === r ? -X : -1)); }
      })));
      return true;
    }
  }
  // 先难后易: 选1张逻辑卡+2费；下一张其他逻辑卡-N费（2026-08-24）
  if(cd.xnhyPick) {
    let logics = b.hand.filter(r => { let d = G.getCardData(r); return d && d.type === 'logic'; });
    if(logics.length > 0) {
      G._pendingCardId = cd.id;
      G.showChoiceModal('📚 先难后易 — 选1张逻辑卡使其+2费', [...new Set(logics)].map(r => {
        let d = G.getCardData(r);
        return { text: d.name, sub: `当前消耗⚡${G.getCardCost(d)}`, cb: () => {
          G.changeCardCost(r, 2);
          if(cd.xnhyGoldUp) { b.cardMultUp[r] = (b.cardMultUp[r] || 0) + cd.xnhyGoldUp; }
          b.xnhyDisc = { amt: cd.xnhyDiscount || 1, excl: r };
          b.log.push(`📚 先难后易: 下一张其他逻辑卡消耗-${cd.xnhyDiscount || 1}`);
        }};
      }));
      return true;
    }
  }
  // 举一反三: 选本回合用过的逻辑卡，抽不同名逻辑卡并改变其消耗（2026-08-24）
  if(cd.juyiCopy) {
    let names = [...(b.turnLogicNames || [])];
    if(names.length > 0) {
      G._pendingCardId = cd.id;
      G.showChoiceModal('🔄 举一反三 — 选1张本回合使用过的逻辑卡', names.map(n => ({
        text: n,
        sub: `使用时消耗⚡${b.turnLogicPlayCosts[n] != null ? b.turnLogicPlayCosts[n] : '?'}`,
        cb: () => {
          let target = b.turnLogicPlayCosts[n];
          let idxs = b.drawPile.map((r2, i2) => i2).filter(i2 => { let d2 = G.getCardData(b.drawPile[i2]); return d2 && d2.type === 'logic' && d2.name !== n; });
          if(idxs.length > 0 && target != null) {
            let pi = idxs[Math.floor(Math.random() * idxs.length)];
            let nref = b.drawPile.splice(pi, 1)[0];
            let nd = G.getCardData(nref);
            let rr = nd.ref || nd.id;
            let cur = G.getCardCost(nd);
            if(target !== cur) G.changeCardCost(rr, target - cur);
            if(cd.juyiUp) b.cardMultUp[rr] = (b.cardMultUp[rr] || 0) + cd.juyiUp;
            b.hand.push(nref);
            b.log.push(`🔄 举一反三: 抽到【${nd.name}】，消耗变为${target}`);
          } else {
            b.log.push('🔄 举一反三: 卡组中没有不同名称的逻辑卡');
          }
        }
      })));
      return true;
    } else {
      b.log.push('🔄 举一反三: 本回合还没使用过逻辑卡');
    }
  }
  // 灵光一现: 查看牌库顶3张选1张加入手牌(+1费)，其余置牌库底（2026-08-24）
  if(cd.lingguang) {
    let n2 = Math.min(3, b.drawPile.length);
    if(n2 > 0) {
      let topStart = b.drawPile.length - n2;
      let top = b.drawPile.slice(topStart);
      G._pendingCardId = cd.id;
      G.showChoiceModal('💡 灵光一现 — 选1张加入手牌（其余置于牌库底）', top.map((r2, i2) => {
        let d2 = G.getCardData(r2);
        return { text: d2.name, sub: `原始消耗⚡${d2.cost >= 0 ? d2.cost : 'X'}｜${d2.desc}`, cb: () => {
          let chosen = b.drawPile.splice(topStart + i2, 1)[0];
          let rest = b.drawPile.splice(topStart, n2 - 1);
          b.drawPile.unshift(...rest);
          let rr = d2.ref || d2.id;
          G.changeCardCost(rr, 1);
          b.hand.push(chosen);
          if(d2.type === 'logic') {
            if(cd.lingguangGold) { if((d2.cost || 0) >= 3) { G.addPlayerStatus('rationality', 2); b.log.push('💡 灵光一现(金): +2层理性'); } }
            else { G.addPlayerStatus('rationality', 1); b.log.push('💡 灵光一现: +1层理性'); }
          }
          b.log.push(`💡 灵光一现: ${d2.name}加入手牌(+1费)`);
        }};
      }));
      return true;
    }
  }
  // 调整做题顺序: 选2张逻辑卡交换当前消耗（2026-08-24）
  if(cd.swapCost) {
    let logics = b.hand.filter(r2 => { let d2 = G.getCardData(r2); return d2 && d2.type === 'logic'; });
    if(logics.length >= 2) {
      G._pendingCardId = cd.id;
      G.showMultiSelect('🔀 调整做题顺序 — 选2张逻辑卡交换当前消耗', logics, 2, function(picked) {
        if(picked.length !== 2) { G.showToast('需要选择2张卡（效果未触发）'); return; }
        let A = picked[0], B = picked[1];
        let da = G.getCardData(A), db = G.getCardData(B);
        let ra = da.ref || da.id, rb = db.ref || db.id;
        let ca = G.getCardCost(da), cb2 = G.getCardCost(db);
        b.cardCostDelta[ra] = cb2 - da.cost;
        b.cardCostDelta[rb] = ca - db.cost;
        let chA = cb2 !== ca, chB = ca !== cb2;
        if(chA) G.recordCostChange(ra);
        if(chB) G.recordCostChange(rb);
        b.log.push(`🔀 ${da.name}(${ca}) ⇄ ${db.name}(${cb2})`);
        if(cb2 !== da.cost && ca !== db.cost) {
          G.addPlayerStatus('rationality', cd.swapRat || 1);
          b.log.push(`🔀 两张卡都改变了费用，+${cd.swapRat || 1}层理性`);
        }
      });
      return true;
    }
  }
  // 我是不是算错了？: 选1张逻辑卡恢复原始消耗（2026-08-24）
  if(cd.restoreCost) {
    let logics = b.hand.filter(r2 => { let d2 = G.getCardData(r2); let rr2 = d2.ref || d2.id; return d2 && d2.type === 'logic' && (b.cardCostDelta[rr2] || 0) !== 0; });
    if(logics.length > 0) {
      G._pendingCardId = cd.id;
      G.showChoiceModal('🤔 我是不是算错了？— 选1张逻辑卡恢复原始消耗', [...new Set(logics)].map(r2 => {
        let d2 = G.getCardData(r2);
        let rr2 = d2.ref || d2.id;
        let cur = G.getCardCost(d2);
        return { text: d2.name, sub: `当前⚡${cur} → 恢复为⚡${d2.cost}`, cb: () => {
          G._pendingCardId = null;
          let diff = Math.abs(cur - d2.cost);
          b.cardCostDelta[rr2] = 0;
          if(cur !== d2.cost) G.recordCostChange(rr2);
          if(diff >= 2) { G.addPlayerStatus('rationality', cd.restoreRat || 2); b.log.push(`🤔 相差${diff}点，+${cd.restoreRat || 2}层理性`); }
          b.log.push(`🤔 ${d2.name}: 恢复原始消耗⚡${d2.cost}`);
          if(cd.restoreGold) {
            G.showChoiceModal(`🤔 再调整 — ${d2.name}`, [
              {text:'消耗+1', cb: () => { G.changeCardCost(rr2, 1); G.finishCard(cd); }},
              {text:'消耗-1', cb: () => { G.changeCardCost(rr2, -1); G.finishCard(cd); }},
            ]);
          } else G.finishCard(cd);
        }};
      }));
      return true;
    } else {
      b.log.push('🤔 手牌中没有费用被改变的逻辑卡');
    }
  }
  if(cd.discardAllDrawLogicBonus) {
    let kept = b.hand.filter(cid => G.cardKeptInHand(b,cid));
    let discarded = b.hand.filter(cid => !kept.includes(cid));
    let hadLogic = discarded.some(cid => { let d = G.getCardData(cid); return d && d.type === 'logic'; });
    b.hand = kept;
    discarded.forEach(cid => G.discardFromHand(cid)); // 脱手触发
    G.battleDraw(1);
    if(hadLogic) G.battleDraw(2);
  }
  // 摘抄: 弃牌堆有逻辑卡额外+1感性
  if(cd.sensIfDiscardLogic && b.discard.some(cid => { let d = G.getCardData(cid); return d && d.type === 'logic'; })) {
    G.addPlayerStatus('sensibility', 1);
    b.log.push('📝 摘抄: 弃牌堆有逻辑卡，额外+1感性');
  }
  // 素材积累
  if(cd.noSensConsume) b.noSensConsume = true;
  if(cd.sensIfEq15 && s.eq > 15) { G.addPlayerStatus('sensibility', 2); b.log.push('📦 素材积累: 情商>15，+2感性'); }
  // 吃冰棍: 本场战斗伤害+1（修复：此前battleDmgPlus从未被置1）
  if(cd.battleDmgPlus1) { b.battleDmgPlus = 1; b.log.push('🍦 吃冰棍: 本场战斗伤害+1'); }
  // 精修/吃冰棍: 本场最大体力-1
  if(cd.battleMaxEnergyDown) b.maxEnergy = Math.max(0, b.maxEnergy - 1);
  // 文思泉涌
  if(cd.wensiActive) b.wensiActive = true;
  // 忍耐: 激活生命→耐力转化
  if(cd.enduranceConvert) {
    b.enduranceConvert = cd.enduranceConvert;
    b.log.push('💪 忍耐: 接下来损失生命的60%化为耐力');
  }
  // 隐忍: 临时生命上限
  if(cd.tempMaxHpFromEndurance) {
    b.tempMaxHp += Math.floor(b.endurance * cd.tempMaxHpFromEndurance);
    b.log.push(`💪 隐忍: 临时生命上限+${Math.floor(b.endurance * cd.tempMaxHpFromEndurance)}`);
  }
  // 蓄意轰拳
  if(cd.clearEndurance) b.endurance = 0;
  if(cd.healLostPct) {
    let lost = (b.playerMaxHp + b.tempMaxHp) - b.playerHp;
    let heal = Math.floor(lost * cd.healLostPct / 100);
    b.playerHp = Math.min(b.playerMaxHp + b.tempMaxHp, b.playerHp + heal);
    b.log.push(`💚 ${cd.name}: 回复${heal}生命`);
  }
  // 万夫莫敌
  if(cd.dmgReduce2) b.dmgReduceTurns = cd.dmgReduce2.turns;
  if(cd.trueDmgBonus2) {
    b.damageBonusTurns = cd.trueDmgBonus2.turns;
  }
  // 考场佳作: 本回合情商翻倍
  if(cd.eqDoubleThisTurn) { b.eqDoubleTurns = 1; b.log.push('📝 考场佳作: 本回合情商翻倍'); }
  // 致于学
  if(cd.allHandFree) { b.allHandFreeTurn = true; b.log.push('📖 致于学: 本回合所有手牌消耗为0'); }
  // 龙傲天
  if(cd.wushiFromArrogance) {
    G.addPlayerStatus('wushi', G.arroganceTotal());
    b.log.push(`🐉 龙傲天: +${G.arroganceTotal()}无视`);
  }
  // 收敛一下: 清空傲慢 → 智力临时+层数，持续N回合后恢复比例
  if(cd.arroganceToTempInt) {
    let A = G.arroganceTotal();
    b.playerStatuses.arrogance = 0;
    b.arroganceTemp = 0;
    b.tempIntArrogance = A;
    b.tempIntTurns = cd.arroganceToTempInt.turns;
    b.tempIntRestore = cd.arroganceToTempInt.restore;
    b.log.push(`🎯 收敛一下: 智力临时+${A}，持续${cd.arroganceToTempInt.turns}回合`);
  }
  // 目中无人: +6临时傲慢+3无视，本回合锁牌
  if(cd.tempArrogance6) {
    b.arroganceTemp += 6;
    G.addPlayerStatus('wushi', 3);
    b.lockPlay = true;
    b.log.push('😤 目中无人: +6临时傲慢+3无视，本回合无法使用卡牌');
  }
  // 管你这那的!: 无视消耗打出所有逻辑卡，弃所有思路卡（修复：其他类型卡牌会凭空消失；逻辑卡改走finishCard正常结算）
  if(cd.playAllLogicFree) {
    let logics = b.hand.filter(cid => { let d = G.getCardData(cid); return d && d.type === 'logic'; });
    let ideas = b.hand.filter(cid => { let d = G.getCardData(cid); return d && d.type === 'idea'; });
    // 用具/解答/小说等其他类型卡牌留在手牌
    b.hand = b.hand.filter(cid => { let d = G.getCardData(cid); return d && d.type !== 'logic' && d.type !== 'idea'; });
    ideas.forEach(cid => G.discardFromHand(cid)); // 脱手触发
    let gained = ideas.length * 2;
    b.playerStatuses.arrogance = (b.playerStatuses.arrogance||0) + gained;
    b.log.push(`😤 管你这那的!: 打出${logics.length}张逻辑卡，弃${ideas.length}张思路卡，+${gained}傲慢`);
    for(let cid of logics) {
      let d = G.getCardData(cid);
      b.playerUsedCardsThisTurn.push(cid);
      G.applyCardEffect(d);
      G.finishCard(d); // 弃牌/计数/勤卷/扳手/死亡判定一并结算
    }
  }
  // 满分作文: 从原始卡组选思路卡复制2张（0费）
  if(cd.copyStarterIdea) {
    let starterIdeas = s.character.starterDeck.map(id => G.getCardData(id)).filter(d => d && d.type === 'idea');
    let uniq = [...new Set(starterIdeas.map(d => d.id))];
    G._pendingCardId = cd.id;
    G.showChoiceModal('📝 满分作文 — 选择复制的思路卡', uniq.map(cid => ({
      text: G.getCardData(cid).name,
      sub: G.getCardData(cid).desc,
      cb: () => {
        b.hand.push(cid, cid);
        b.freeDrawCards = b.freeDrawCards || {}; // 2张复制本回合0费（按卡id记录）
        b.freeDrawCards[cid] = (b.freeDrawCards[cid]||0) + 2;
        b.log.push('📝 满分作文: 获得2张复制(本回合0费)');
      }
    })));
    return true; // deferred
  }
  // 读后感: 复制最左边手牌（修复：作为唯一手牌打出时手牌为空，此前什么都不复制；此时复制自己）
  if(cd.copyLeftmost) {
    let target = b.hand.length > 0 ? b.hand[0] : cd.id;
    b.hand.push(target);
    b.log.push('📖 读后感: 复制了' + G.getCardData(target).name);
  }
  // 翻垃圾桶: 弃牌堆选1张逻辑卡回手
  if(cd.pickDiscardLogic) {
    let logics = [...new Set(b.discard.filter(cid => { let d = G.getCardData(cid); return d && d.type === 'logic'; }))];
    if(logics.length > 0) {
      G._pendingCardId = cd.id;
      G.showChoiceModal('🗑 翻垃圾桶 — 选1张逻辑卡回手', logics.map(cid => ({
        text: G.getCardData(cid).name,
        cb: () => {
          let idx = b.discard.lastIndexOf(cid);
          if(idx >= 0) b.discard.splice(idx, 1);
          b.hand.push(cid);
          G.autoPlayDrawnCard(cid);
        }
      })));
      return true;
    }
  }
  // 草稿: 弃牌堆选3张逻辑卡洗入牌库并摸1张逻辑卡（修复：此前为随机选，与"选"不符）
  if(cd.discardPick3Logic) {
    let logics = b.discard.filter(cid => { let d = G.getCardData(cid); return d && d.type === 'logic'; });
    if(logics.length > 0) {
      G._pendingCardId = cd.id;
      G.showMultiSelect('📝 草稿 — 选至多3张逻辑卡洗入牌库', logics, Math.min(3, logics.length), function(picked) {
        let pool = [...b.discard];
        picked.forEach(cid => { let idx = pool.indexOf(cid); if(idx >= 0) pool.splice(idx, 1); });
        b.discard = pool;
        b.drawPile.push(...picked);
        G.shuffleInPlace(b.drawPile);
        G.battleDrawLogic(1);
        b.log.push('📝 草稿: 洗入' + picked.length + '张逻辑卡，摸1张逻辑卡');
      });
      return true; // deferred
    }
  }
  // 自信满满: 牌库选1张置顶（修复：牌库为空时"傲慢>无视摸1张"此前被跳过）
  if(cd.deckTopPick) {
    if(b.drawPile.length > 0) {
      let uniq = [...new Set(b.drawPile)];
      G._pendingCardId = cd.id;
      G.showChoiceModal('📚 自信满满 — 选择置顶的卡', uniq.map(cid => ({
        text: G.getCardData(cid).name,
        cb: () => {
          let idx = b.drawPile.lastIndexOf(cid);
          if(idx >= 0) b.drawPile.splice(idx, 1);
          b.drawPile.push(cid);
          if(cd.drawIfArroganceGtWushi && G.arroganceTotal() > G.wushiLayers()) { G.battleDraw(1); b.log.push('😏 自信满满: 傲慢>无视，摸1张'); }
        }
      })));
      return true;
    } else if(cd.drawIfArroganceGtWushi && G.arroganceTotal() > G.wushiLayers()) {
      G.battleDraw(1);
      b.log.push('😏 自信满满: 傲慢>无视，摸1张');
    }
  }
  // 奥数之王: 手牌选1张逻辑卡费用归0并提升至红色（持续至本场战斗结束，2026-08-24 规范版）
  if(cd.handPickZeroRed) {
    let logics = b.hand.filter(cid => { let d = G.getCardData(cid); return d && d.type === 'logic'; });
    if(logics.length > 0) {
      G._pendingCardId = cd.id;
      G.showChoiceModal('👑 奥数之王 — 选1张逻辑卡：消耗归0并提升至红色', [...new Set(logics)].map(cid => ({
        text: G.getCardData(cid).name,
        sub: '持续至本场战斗结束',
        cb: () => {
          let d = G.getCardData(cid);
          let baseDef = G.CARDS[d.id];
          let target = (baseDef && baseDef.qv) ? d.id + '@red' : cid; // 无品质链的卡保持原ref（归0照常生效）
          let hi = b.hand.indexOf(cid);
          if(hi >= 0) b.hand[hi] = target;
          // 迁移该牌已有记录到新ref
          if(target !== cid) {
            ['cardCostDelta','cardCostChanges','cardChanged','cardMultUp'].forEach(m => {
              if(b[m][cid] !== undefined) { b[m][target] = b[m][cid]; delete b[m][cid]; }
            });
          }
          b.cardCostMod[target] = 1; // 费用归0（直到战斗结束）
          G.recordCostChange(target);
          b.log.push(`👑 奥数之王: ${d.name} → 0费${(baseDef && baseDef.qv) ? '·红色' : ''}（本场战斗）`);
          if(G.fx && G.fx.aoshuKing) G.fx.aoshuKing();
        }
      })));
      return true;
    }
  }
  // 再试一次!: 全部体力+全部傲慢
  if(cd.redrawLoop) {
    let X = b._lastCost || 0; // 打出前体力
    let A = G.arroganceTotal();
    b.playerStatuses.arrogance = 0;
    b.arroganceTemp = 0;
    G._pendingCardId = cd.id;
    G.showMultiSelect('🔁 再试一次! — 选择≤' + X + '张手牌洗回', b.hand, X, function(picked) {
      for(let cycle=0; cycle<X; cycle++) {
        let toShuffle;
        if(cycle === 0) toShuffle = picked.slice();
        else {
          let n = Math.min(X, b.hand.length);
          toShuffle = G.shuffle(b.hand).slice(0, n);
        }
        toShuffle.forEach(cid => {
          let idx = b.hand.indexOf(cid);
          if(idx >= 0) b.hand.splice(idx, 1);
          b.drawPile.push(cid);
        });
        G.shuffleInPlace(b.drawPile);
        G.battleDraw(toShuffle.length);
      }
      b.freePlaysLeft += X;
      let restore = Math.ceil(A / 2);
      b.playerStatuses.arrogance = (b.playerStatuses.arrogance||0) + restore;
      b.log.push('🔁 再试一次!: 恢复' + restore + '傲慢，本回合' + X + '张免费');
    });
    return true;
  }
};

// 选牌中保存→读档恢复（2026-09-08）：只重建选择弹窗，不重复结算任何效果。
// 与 applyCardEffect 中的选择分支一一对应；效果已保存在存档中，重放仅恢复选项与回调。
G.showCardChoice = function(cd) {
  let b = G.state.battle, s = G.state;
  if(!b || !cd) return false;
  let ref = cd.ref || cd.id;
  let offerUpgrade=function(title,toGold,temporary,shieldPer){let opts=b.hand.map((r,i)=>({text:`${G.getCardData(r).name}（${G.cardQualityKey(r)}）`,sub:G.getCardData(r).desc,cb:()=>{let lv=G.upgradeHandCard(i,toGold,temporary);if(shieldPer&&lv){let sh=Math.floor(lv*shieldPer*s.physique*(b.shieldItemMult||1));b.playerShield+=sh;b.log.push(`🛡️ 满级攻略: 获得${sh}护盾`);}}}));if(opts.length){G._pendingCardId=cd.id;G.showChoiceModal(title,opts);return true;}return false;};
  if(cd.snackChoice) {
    G._pendingCardId=cd.id;
    G.showChoiceModal('🍫 备用零食 — 选择效果',[
      {text:'体力回复至上限',cb:()=>{G.gainEnergy(Math.max(0,b.maxEnergy-b.energy));b.log.push('🍫 备用零食: 体力回复至上限');}},
      {text:`回复${b.maxEnergy*2}点生命`,cb:()=>{let before=b.playerHp;b.playerHp=Math.min(b.playerMaxHp+b.tempMaxHp,b.playerHp+b.maxEnergy*2);b.log.push(`🍫 备用零食: 回复${b.playerHp-before}生命`);}}
    ]);
    return true;
  }
  if(cd.temporaryUpgradePick&&offerUpgrade('选择本回合临时升级的卡牌',false,true,0))return true;
  if(cd.temporaryUpgradeIfShield10&&b.playerShield>=10&&offerUpgrade('选择本回合临时升级的卡牌',false,true,0))return true;
  if(cd.upgradeToGoldPick&&offerUpgrade('选择直接提升至金色的卡牌',true,false,.4))return true;
  if(cd.changeFlawType&&b.weaknesses.length){G._pendingCardId=cd.id;let opts=[];for(let w of b.weaknesses)for(let t of G.WEAK_TYPES)if(t!==w.type&&!b.weaknesses.some(x=>x.type===t))opts.push({text:`${G.WEAK_NAMES[w.type]}破绽 → ${G.WEAK_NAMES[t]}破绽`,cb:()=>{w.type=t;G.drawCardOfType(t);b.log.push(`👣 锐利步法: 改为【${G.WEAK_NAMES[t]}破绽】并摸对应卡牌`);}});if(opts.length){G.showChoiceModal('选择要改变的破绽',opts);return true;}}
  if(cd.inviteFlaw){G._pendingCardId=cd.id;G.showChoiceModal('选择要展示的破绽',G.WEAK_TYPES.map(t=>({text:`${G.WEAK_NAMES[t]}破绽`,cb:()=>{if(b.weaknesses.some(w=>w.type===t)){G.drawCardOfType(t);b.log.push('⚔️ 决斗邀请: 已有该破绽，摸1张对应卡牌');}else{G.addWeakness(t,'invite',false);b.log.push(`⚔️ 决斗邀请: 展示【${G.WEAK_NAMES[t]}破绽】`);}}})));return true;}
  if(cd.wakeHandPick){let refs=b.hand.filter(r=>G.isSleepingCard(r));if(refs.length){G._pendingCardId=cd.id;G.showChoiceModal('选择要【苏醒】的手牌',refs.map(r=>({text:G.getCardData(r).name,cb:()=>{if(G.fx&&G.fx.sleepWakePop)G.fx.sleepWakePop(G.baseId(r));G.wakeCardRef(r);b.wokeThisTurn++;if(cd.drawOnWake)G.battleDraw(cd.drawOnWake);}})));return true;}}
  if(cd.sleepHandPick&&b.hand.length){G._pendingCardId=cd.id;G.showChoiceModal('选择要陷入【沉睡】的手牌',b.hand.map(r=>({text:G.getCardData(r).name,cb:()=>{let idx=b.hand.indexOf(r);if(idx>=0)b.hand[idx]=G.makeSleepingRef(r,true);b.log.push(`😴 【${G.getCardData(r).name}】陷入【沉睡】`);}})));return true;}
  // 抉择（思维）：恢复时始终重建选项（打出时已判定为需要选择）
  if(cd.choice) {
    G._pendingCardId = cd.id;
    G.showChoiceModal('⚖️ 抉择 — ' + cd.name, cd.choice.map(o => ({text:o.text, status:o.status})));
    return true;
  }
  if(cd.changedModOther && b.cardChanged[ref]) {
    let others = b.hand.filter(r => { let d = G.getCardData(r); return d && d.type === 'logic'; });
    if(others.length > 0) {
      G._pendingCardId = cd.id;
      let opts = [];
      others.forEach(r => {
        let d = G.getCardData(r);
        opts.push({text:`${d.name}（+1费）`, cb:() => G.changeCardCost(r, 1)});
        opts.push({text:`${d.name}（-1费）`, cb:() => G.changeCardCost(r, -1)});
      });
      G.showChoiceModal('❌ 错题重做 — 选择要调整的其他逻辑卡', opts);
      return true;
    }
  }
  if(cd.newTryPick) {
    // 恢复时不重复摸牌：打出时已摸过，直接取手牌末尾的已摸卡作为选项
    let drawn = b.hand.slice(Math.max(0, b.hand.length - 2));
    if(drawn.length > 0) {
      let X = b._lastCost || 0;
      G._pendingCardId = cd.id;
      G.showChoiceModal(`✨ 新的尝试 — 选1张消耗-${X}（另一张-1）`, drawn.map(r => ({
        text: G.getCardData(r).name,
        sub: `当前消耗⚡${G.getCardCost(G.getCardData(r))}`,
        cb: () => { drawn.forEach(o => G.changeCardCost(o, o === r ? -X : -1)); }
      })));
      return true;
    }
  }
  if(cd.xnhyPick) {
    let logics = b.hand.filter(r => { let d = G.getCardData(r); return d && d.type === 'logic'; });
    if(logics.length > 0) {
      G._pendingCardId = cd.id;
      G.showChoiceModal('📚 先难后易 — 选1张逻辑卡使其+2费', [...new Set(logics)].map(r => {
        let d = G.getCardData(r);
        return { text: d.name, sub: `当前消耗⚡${G.getCardCost(d)}`, cb: () => {
          G.changeCardCost(r, 2);
          if(cd.xnhyGoldUp) { b.cardMultUp[r] = (b.cardMultUp[r] || 0) + cd.xnhyGoldUp; }
          b.xnhyDisc = { amt: cd.xnhyDiscount || 1, excl: r };
          b.log.push(`📚 先难后易: 下一张其他逻辑卡消耗-${cd.xnhyDiscount || 1}`);
        }};
      }));
      return true;
    }
  }
  if(cd.juyiCopy) {
    let names = [...(b.turnLogicNames || [])];
    if(names.length > 0) {
      G._pendingCardId = cd.id;
      G.showChoiceModal('🔄 举一反三 — 选1张本回合使用过的逻辑卡', names.map(n => ({
        text: n,
        sub: `使用时消耗⚡${b.turnLogicPlayCosts[n] != null ? b.turnLogicPlayCosts[n] : '?'}`,
        cb: () => {
          let target = b.turnLogicPlayCosts[n];
          let idxs = b.drawPile.map((r2, i2) => i2).filter(i2 => { let d2 = G.getCardData(b.drawPile[i2]); return d2 && d2.type === 'logic' && d2.name !== n; });
          if(idxs.length > 0 && target != null) {
            let pi = idxs[Math.floor(Math.random() * idxs.length)];
            let nref = b.drawPile.splice(pi, 1)[0];
            let nd = G.getCardData(nref);
            let rr = nd.ref || nd.id;
            let cur = G.getCardCost(nd);
            if(target !== cur) G.changeCardCost(rr, target - cur);
            if(cd.juyiUp) b.cardMultUp[rr] = (b.cardMultUp[rr] || 0) + cd.juyiUp;
            b.hand.push(nref);
            b.log.push(`🔄 举一反三: 抽到【${nd.name}】，消耗变为${target}`);
          } else {
            b.log.push('🔄 举一反三: 卡组中没有不同名称的逻辑卡');
          }
        }
      })));
      return true;
    } else {
      b.log.push('🔄 举一反三: 本回合还没使用过逻辑卡');
    }
  }
  if(cd.lingguang) {
    let n2 = Math.min(3, b.drawPile.length);
    if(n2 > 0) {
      let topStart = b.drawPile.length - n2;
      let top = b.drawPile.slice(topStart);
      G._pendingCardId = cd.id;
      G.showChoiceModal('💡 灵光一现 — 选1张加入手牌（其余置于牌库底）', top.map((r2, i2) => {
        let d2 = G.getCardData(r2);
        return { text: d2.name, sub: `原始消耗⚡${d2.cost >= 0 ? d2.cost : 'X'}｜${d2.desc}`, cb: () => {
          let chosen = b.drawPile.splice(topStart + i2, 1)[0];
          let rest = b.drawPile.splice(topStart, n2 - 1);
          b.drawPile.unshift(...rest);
          let rr = d2.ref || d2.id;
          G.changeCardCost(rr, 1);
          b.hand.push(chosen);
          if(d2.type === 'logic') {
            if(cd.lingguangGold) { if((d2.cost || 0) >= 3) { G.addPlayerStatus('rationality', 2); b.log.push('💡 灵光一现(金): +2层理性'); } }
            else { G.addPlayerStatus('rationality', 1); b.log.push('💡 灵光一现: +1层理性'); }
          }
          b.log.push(`💡 灵光一现: ${d2.name}加入手牌(+1费)`);
        }};
      }));
      return true;
    }
  }
  if(cd.swapCost) {
    let logics = b.hand.filter(r2 => { let d2 = G.getCardData(r2); return d2 && d2.type === 'logic'; });
    if(logics.length >= 2) {
      G._pendingCardId = cd.id;
      G.showMultiSelect('🔀 调整做题顺序 — 选2张逻辑卡交换当前消耗', logics, 2, function(picked) {
        if(picked.length !== 2) { G.showToast('需要选择2张卡（效果未触发）'); return; }
        let A = picked[0], B = picked[1];
        let da = G.getCardData(A), db = G.getCardData(B);
        let ra = da.ref || da.id, rb = db.ref || db.id;
        let ca = G.getCardCost(da), cb2 = G.getCardCost(db);
        b.cardCostDelta[ra] = cb2 - da.cost;
        b.cardCostDelta[rb] = ca - db.cost;
        let chA = cb2 !== ca, chB = ca !== cb2;
        if(chA) G.recordCostChange(ra);
        if(chB) G.recordCostChange(rb);
        b.log.push(`🔀 ${da.name}(${ca}) ⇄ ${db.name}(${cb2})`);
        if(cb2 !== da.cost && ca !== db.cost) {
          G.addPlayerStatus('rationality', cd.swapRat || 1);
          b.log.push(`🔀 两张卡都改变了费用，+${cd.swapRat || 1}层理性`);
        }
      });
      return true;
    }
  }
  if(cd.restoreCost) {
    let logics = b.hand.filter(r2 => { let d2 = G.getCardData(r2); let rr2 = d2.ref || d2.id; return d2 && d2.type === 'logic' && (b.cardCostDelta[rr2] || 0) !== 0; });
    if(logics.length > 0) {
      G._pendingCardId = cd.id;
      G.showChoiceModal('🤔 我是不是算错了？— 选1张逻辑卡恢复原始消耗', [...new Set(logics)].map(r2 => {
        let d2 = G.getCardData(r2);
        let rr2 = d2.ref || d2.id;
        let cur = G.getCardCost(d2);
        return { text: d2.name, sub: `当前⚡${cur} → 恢复为⚡${d2.cost}`, cb: () => {
          G._pendingCardId = null;
          let diff = Math.abs(cur - d2.cost);
          b.cardCostDelta[rr2] = 0;
          if(cur !== d2.cost) G.recordCostChange(rr2);
          if(diff >= 2) { G.addPlayerStatus('rationality', cd.restoreRat || 2); b.log.push(`🤔 相差${diff}点，+${cd.restoreRat || 2}层理性`); }
          b.log.push(`🤔 ${d2.name}: 恢复原始消耗⚡${d2.cost}`);
          if(cd.restoreGold) {
            G.showChoiceModal(`🤔 再调整 — ${d2.name}`, [
              {text:'消耗+1', cb: () => { G.changeCardCost(rr2, 1); G.finishCard(cd); }},
              {text:'消耗-1', cb: () => { G.changeCardCost(rr2, -1); G.finishCard(cd); }},
            ]);
          } else G.finishCard(cd);
        }};
      }));
      return true;
    }
  }
  if(cd.copyStarterIdea) {
    let starterIdeas = s.character.starterDeck.map(id => G.getCardData(id)).filter(d => d && d.type === 'idea');
    let uniq = [...new Set(starterIdeas.map(d => d.id))];
    G._pendingCardId = cd.id;
    G.showChoiceModal('📝 满分作文 — 选择复制的思路卡', uniq.map(cid => ({
      text: G.getCardData(cid).name,
      sub: G.getCardData(cid).desc,
      cb: () => {
        b.hand.push(cid, cid);
        b.freeDrawCards = b.freeDrawCards || {}; // 2张复制本回合0费（按卡id记录）
        b.freeDrawCards[cid] = (b.freeDrawCards[cid]||0) + 2;
        b.log.push('📝 满分作文: 获得2张复制(本回合0费)');
      }
    })));
    return true;
  }
  if(cd.pickDiscardLogic) {
    let logics = [...new Set(b.discard.filter(cid => { let d = G.getCardData(cid); return d && d.type === 'logic'; }))];
    if(logics.length > 0) {
      G._pendingCardId = cd.id;
      G.showChoiceModal('🗑 翻垃圾桶 — 选1张逻辑卡回手', logics.map(cid => ({
        text: G.getCardData(cid).name,
        cb: () => {
          let idx = b.discard.lastIndexOf(cid);
          if(idx >= 0) b.discard.splice(idx, 1);
          b.hand.push(cid);
          G.autoPlayDrawnCard(cid);
        }
      })));
      return true;
    }
  }
  if(cd.discardPick3Logic) {
    let logics = b.discard.filter(cid => { let d = G.getCardData(cid); return d && d.type === 'logic'; });
    if(logics.length > 0) {
      G._pendingCardId = cd.id;
      G.showMultiSelect('📝 草稿 — 选至多3张逻辑卡洗入牌库', logics, Math.min(3, logics.length), function(picked) {
        let pool = [...b.discard];
        picked.forEach(cid => { let idx = pool.indexOf(cid); if(idx >= 0) pool.splice(idx, 1); });
        b.discard = pool;
        b.drawPile.push(...picked);
        G.shuffleInPlace(b.drawPile);
        G.battleDrawLogic(1);
        b.log.push('📝 草稿: 洗入' + picked.length + '张逻辑卡，摸1张逻辑卡');
      });
      return true;
    }
  }
  if(cd.deckTopPick) {
    if(b.drawPile.length > 0) {
      let uniq = [...new Set(b.drawPile)];
      G._pendingCardId = cd.id;
      G.showChoiceModal('📚 自信满满 — 选择置顶的卡', uniq.map(cid => ({
        text: G.getCardData(cid).name,
        cb: () => {
          let idx = b.drawPile.lastIndexOf(cid);
          if(idx >= 0) b.drawPile.splice(idx, 1);
          b.drawPile.push(cid);
          if(cd.drawIfArroganceGtWushi && G.arroganceTotal() > G.wushiLayers()) { G.battleDraw(1); b.log.push('😏 自信满满: 傲慢>无视，摸1张'); }
        }
      })));
      return true;
    }
  }
  if(cd.handPickZeroRed) {
    let logics = b.hand.filter(cid => { let d = G.getCardData(cid); return d && d.type === 'logic'; });
    if(logics.length > 0) {
      G._pendingCardId = cd.id;
      G.showChoiceModal('👑 奥数之王 — 选1张逻辑卡：消耗归0并提升至红色', [...new Set(logics)].map(cid => ({
        text: G.getCardData(cid).name,
        sub: '持续至本场战斗结束',
        cb: () => {
          let d = G.getCardData(cid);
          let baseDef = G.CARDS[d.id];
          let target = (baseDef && baseDef.qv) ? d.id + '@red' : cid;
          let hi = b.hand.indexOf(cid);
          if(hi >= 0) b.hand[hi] = target;
          if(target !== cid) {
            ['cardCostDelta','cardCostChanges','cardChanged','cardMultUp'].forEach(m => {
              if(b[m][cid] !== undefined) { b[m][target] = b[m][cid]; delete b[m][cid]; }
            });
          }
          b.cardCostMod[target] = 1;
          G.recordCostChange(target);
          b.log.push(`👑 奥数之王: ${d.name} → 0费${(baseDef && baseDef.qv) ? '·红色' : ''}（本场战斗）`);
          if(G.fx && G.fx.aoshuKing) G.fx.aoshuKing();
        }
      })));
      return true;
    }
  }
  if(cd.redrawLoop) {
    let X = b._lastCost || 0;
    let A = G.arroganceTotal();
    G._pendingCardId = cd.id;
    G.showMultiSelect('🔁 再试一次! — 选择≤' + X + '张手牌洗回', b.hand, X, function(picked) {
      for(let cycle=0; cycle<X; cycle++) {
        let toShuffle;
        if(cycle === 0) toShuffle = picked.slice();
        else {
          let n = Math.min(X, b.hand.length);
          toShuffle = G.shuffle(b.hand).slice(0, n);
        }
        toShuffle.forEach(cid => {
          let idx = b.hand.indexOf(cid);
          if(idx >= 0) b.hand.splice(idx, 1);
          b.drawPile.push(cid);
        });
        G.shuffleInPlace(b.drawPile);
        G.battleDraw(toShuffle.length);
      }
      b.freePlaysLeft += X;
      let restore = Math.ceil(A / 2);
      b.playerStatuses.arrogance = (b.playerStatuses.arrogance||0) + restore;
      b.log.push('🔁 再试一次!: 恢复' + restore + '傲慢，本回合' + X + '张免费');
    });
    return true;
  }
  return false;
};


G.addPlayerStatus = function(st, layers) {
  let b = G.state.battle;
  if(!b.playerStatuses[st]) b.playerStatuses[st] = 0;
  // 银河英雄传说buff：感性获取×2（2026-08-22）
  if(st === 'sensibility' && b.novelBuff === 'yinhe') layers *= 2;
  // 大梦谁先觉(小萌4星): 战斗中获取的层数+1
  b.playerStatuses[st] += layers + G.dreamBonus();
  // 无视层数上限: 10 + 骄傲加成
  if(st === 'wushi') {
    let cap = 10 + (b.wushiCapBonus || 0);
    b.playerStatuses[st] = Math.min(b.playerStatuses[st], cap);
  }
  // 细心上限3层
  if(st === 'careful') b.playerStatuses[st] = Math.min(b.playerStatuses[st], 3);
  // 理性上限10层（2026-08-24 规范版：达到上限后继续获得无额外效果）
  if(st === 'rationality') {
    let before = b.playerStatuses[st] - layers - G.dreamBonus();
    b.playerStatuses[st] = Math.min(b.playerStatuses[st], 10);
    if(b.playerStatuses[st] > before && b.playerStatuses[st] >= 5 && G.fx && G.fx.rationalityFx) G.fx.rationalityFx(b.playerStatuses[st]);
  }
  // 感性上限3层。
  if(st === 'sensibility') b.playerStatuses[st] = Math.min(b.playerStatuses[st], 3);
};

// 鸡兔同笼：第1回合结束、以及第3/6/9...回合结束时的特殊抉择。
G.jituEndTurnChoice = function() {
  let b = G.state.battle;
  if(!b || b.over || b.monsterId !== 'jitu' || b.jituChoiceOpen) return false;
  let turn = b.turn || 1;
  if(turn !== 1 && (turn < 3 || turn % 3 !== 0)) return false;
  b.jituChoiceOpen = true;
  b.jituChoiceTurns = b.jituChoiceTurns || {};
  if(b.jituChoiceTurns[turn]) { b.jituChoiceOpen = false; return false; }
  b.jituChoiceTurns[turn] = true;

  let finish = function() {
    b.jituChoiceOpen = false;
    if(b.over || G.state.battle !== b) return;
    // 抉择完成后才比较手牌数；不等时摸入一张数头，并只强化这张。
    if(b.hand.length !== b.monsterHand.length) {
      let pool = b.monsterDrawPile || [], taken = null;
      let idx = pool.findIndex(c => c && c.name === '数头');
      if(idx < 0 && b.monsterDiscard) idx = b.monsterDiscard.findIndex(c => c && c.name === '数头');
      if(idx >= 0) {
        if(idx < pool.length) taken = pool.splice(idx, 1)[0];
        else taken = b.monsterDiscard.splice(idx - pool.length, 1)[0];
      }
      if(taken) {
        b.monsterHand.push(taken);
        b.jituHeadBonusCard = taken;
        b.log.push('🐔 鸡兔同笼：双方手牌数不等，摸入【数头】（本次伤害提升30%）');
      } else {
        b.log.push('🐔 鸡兔同笼：双方手牌数不等，但牌堆中没有【数头】');
      }
    }
    b.log.push('--- 怪物回合 ---');
    G.render();
    let bt = b;
    setTimeout(() => { if(G.state.battle === bt) G.monsterTurn(); }, G.animMs(450));
  };
  let discardOptions = b.hand.map((cid, i) => {
    let d = G.getCardData(cid);
    return {text:`弃置【${d ? d.name : cid}】`, sub:'将这张手牌放入弃牌堆', cb:()=>{
      if(b.hand[i] != null) {
        let picked = b.hand.splice(i, 1)[0];
        G.discardFromHand(picked);
        b.log.push(`🐔 鸡兔同笼：你弃置了【${d ? d.name : picked}】`);
      }
      finish();
    }};
  });
  let options = [];
  if(discardOptions.length) options.push({text:'弃置一张牌', sub:'选择一张手牌弃置', cb:()=>{
    G.showChoiceModal('鸡兔同笼：选择要弃置的牌', discardOptions, {cancelable:true, onCancel:finish});
  }});
  options.push({text:'对手摸一张牌', sub:'让鸡兔同笼摸一张牌', cb:()=>{
    let pool=b.monsterDrawPile||[];
    if(!pool.length && b.monsterDiscard && b.monsterDiscard.length){ pool.push(...b.monsterDiscard.splice(0)); G.shuffleInPlace(pool); }
    let taken=pool.shift();
    if(taken) b.monsterHand.push(taken);
    b.log.push(`🐔 鸡兔同笼：对手摸${taken ? 1 : 0}张牌`);
    finish();
  }});
  G.showChoiceModal('🐔 鸡兔同笼：选择', options, {cancelable:true, onCancel:finish});
  return true;
};

G.playerEndTurn = function() {
  let b = G.state.battle;
  if(b.phase !== 'player') return;
  G.restoreTemporaryQuality();
  let piggyCounts={};
  b.hand.forEach(cid=>{if(G.cardHasItem(cid,'存钱罐')){let k=G.baseId(cid);piggyCounts[k]=(piggyCounts[k]||0)+1;}});
  Object.entries(piggyCounts).forEach(([k,n])=>{let add=n*5;b.piggySavings[k]=(b.piggySavings[k]||0)+add;b.log.push(`🐷 存钱罐: 储存${add}零花钱（累计${b.piggySavings[k]}）`);});
  if(G.state.star>=2&&G.state.character.stars[2]&&G.state.character.stars[2].passive==='qianyishi') G.gainMengxie(2);
  // 有备无患（2026-09-09 改版）：回合结束获得1倍体魄护盾
  if((G.state.talents||[]).includes('preparation')) {
    let sh=Math.floor((G.state.physique||0)*(b.shieldItemMult||1));
    b.playerShield+=sh;
    b.log.push(`🛡️ 有备无患: 回合结束获得${sh}护盾`);
  }
  if(G.state.character.id==='xiaomeng_fiora') {
    b.weaknesses=(b.weaknesses||[]).filter(w=>!w.temp);
    b.duelDanceTemp=null;b.challengeWeaknesses=[];b.challengeCard=null;
  }
  // 满分作文灵感：回合结束弃置全部手牌（按从左到右顺序，正常触发脱手）。
  if(b.discardAllAtTurnEnd) {
    let all=[...b.hand]; b.hand=[];
    all.forEach(cid=>G.discardFromHand(cid));
    b.discardAllAtTurnEnd=false;
    b.log.push(`📝 满分作文灵感: 回合结束弃置${all.length}张手牌`);
  }
  if(b.endTurnDiscardCount>0) {
    let n=Math.min(b.endTurnDiscardCount,b.hand.length),all=G.shuffle([...b.hand]).slice(0,n);
    all.forEach(cid=>{let i=b.hand.indexOf(cid);if(i>=0){b.hand.splice(i,1);G.discardFromHand(cid);}});
    b.endTurnDiscardCount=0;b.log.push(`🧾 有借有还: 回合结束弃置${n}张手牌`);
  }
  // 言情8产生的复制只能在本回合使用，未使用则从所有区域消失。
  let isTurnCopy=cid=>typeof cid==='string' && cid.startsWith('creation_turn::');
  b.hand.filter(isTurnCopy).forEach(G.claimPiggySavings);
  b.hand=b.hand.filter(cid=>!isTurnCopy(cid));
  b.discard=b.discard.filter(cid=>!isTurnCopy(cid));
  b.drawPile=b.drawPile.filter(cid=>!isTurnCopy(cid));
  let isFlash=cid=>{let d=G.getCardData(cid);return d&&d.flash;};
  b.hand.filter(isFlash).forEach(G.claimPiggySavings);
  b.hand=b.hand.filter(cid=>!isFlash(cid)); b.discard=b.discard.filter(cid=>!isFlash(cid)); b.drawPile=b.drawPile.filter(cid=>!isFlash(cid));
  // 考场佳作: 回合结束失去所有感性（须在清空用卡记录之前判断）
  let usedJiazuo = b.playerUsedCardsThisTurn.some(cid => { let d = G.getCardData(cid); return d && d.endTurnClearSens; });
  if((b.extraTurnCount||0)>0) {
    b.extraTurnCount--;
    if(b.extraTurnChance && G.rollChance(b.extraTurnChance)) b.extraTurnCount++;
    b.turn++;
    b.phase='player';
    G.gainEnergy(Math.max(0,b.maxEnergy-b.energy));
    G.battleDraw(2+(b.extraTurnDraw||0));
    b.extraTurnDraw=0;
    b.turnIdeaCardsPlayed=0;b.turnLogicCardsPlayed=0;b.playerUsedCardsThisTurn=[];
    b.quickLearnerUsedTurn=false;b.playerDiscardedThisTurn=false;
    b.log.push('⏱️ 下次见: 额外回合开始');
    G.render();
    return;
  }
  b.extraTurnCostReduction=0;
  b.phase = 'monster';
  G.fx.turnBanner('敌方回合', 'enemy');
  // Reset turn modifiers
  b.turnLogicCostReduction = 0;
  b.logicThinkingTurn = 0;
  b.turnLogicDmgMult = 1;
  b.nightmareDiscardOnEnergy=false;
  b.nightmareDiscardOnDraw=false;
  b.nightmareFrostOnDiscard=false;b.nightmareDreamDiscard=false;
  b.ferreroUsedTurn=false;
  b.turnIdeaCardsPlayed = 0;
  b.turnLogicCardsPlayed = 0;
  b.playerUsedCardsThisTurn = [];
  // 回合级临时状态清理
  b.allHandFreeTurn = false;
  b.lockPlay = false;
  b.noSensConsume = false;
  b.wensiActive = false;
  b.freePlaysLeft = 0;
  b.freeDrawCards = {}; // 新的尝试/满分作文：0费只限本回合
  b.turnAllCostReduction = 0;
  b.nextLogicCostRed = 0;   // 备考/冲刺复习：未用则过期
  b.nextLogicDmgMult = 1;
  // 涂鸦(铅笔临时卡): 回合结束未使用则消失，不再累积
  let tIdx;
  while((tIdx = b.hand.indexOf('tuya')) >= 0) b.hand.splice(tIdx, 1);
  // 考场佳作: 本回合情商翻倍结束 + 失去所有感性
  if(b.eqDoubleTurns > 0) b.eqDoubleTurns--;
  b.creationEqBoost = 0;
  if(usedJiazuo) b.playerStatuses.sensibility = 0;
  // 认真只持续当前回合；回合结束移除全部层数。
  b.playerStatuses.serious = 0;
  // 收敛一下: 临时智力持续回合递减，结束后恢复傲慢
  if(b.tempIntTurns > 0) {
    b.tempIntTurns--;
    if(b.tempIntTurns <= 0) {
      let restore = Math.floor(b.tempIntArrogance * (b.tempIntRestore || 0.25));
      b.playerStatuses.arrogance = (b.playerStatuses.arrogance||0) + restore;
      b.log.push('🎯 收敛一下: 恢复' + restore + '傲慢');
      b.tempIntArrogance = 0;
    }
  }
  // 万夫莫敌: 减伤/真伤加成回合递减
  if(b.dmgReduceTurns > 0) b.dmgReduceTurns--;
  if(b.damageBonusTurns > 0) b.damageBonusTurns--;
  // 临时傲慢层数回合结束消除（目中无人）
  if(b.arroganceTemp > 0) { b.log.push('😤 临时傲慢层消除: ' + b.arroganceTemp); b.arroganceTemp = 0; }
  // ===== 薛诗蕾线：回合级重置（2026-08-24）=====
  b.sheinengTurn = 0;          // 谁能有我卷？：每回合最多3次
  b.rationalityGuard = 0;      // 冷静分析：守护次数仅本回合
  b.turnLogicCosts = [];       // 费用档位（标准答案/奥数压轴题/全部验算正确）
  b.turnLogicNames = [];       // 举一反三
  b.turnLogicPlayCosts = {};
  b.turnPlayedNames = {};      // 再验算一遍
  b.turnMaxLogicDmg = 0;       // 标准答案记录
  b.turnLogicStreak = 0;       // 检查一下成就
  b.turnAchv = {logic:0, brackets:[], zeroFromOrigGe2:0, sheineng:0};
  // Spirit decay
  if(b.playerStatuses.spirit) b.playerStatuses.spirit = Math.max(0, b.playerStatuses.spirit - 1);
  if(G.jituEndTurnChoice()) return;
  b.log.push('--- 怪物回合 ---');
  G.render();
  // 怪物回合启动延迟：450ms（原800ms，缩短让回合切换更跟手，2026-08-19）
  // guard（2026-08-23）：延迟期间玩家重考/放弃/开新战斗时，不得让新战斗的怪物凭空出牌
  // 设置页（2026-08-23）：战斗节奏倍速经 G.animMs 缩短
  let bt = b;
  setTimeout(() => { if(G.state.battle === bt) G.monsterTurn(); }, G.animMs(450));
};

// 怪物出牌节奏（用户定 2026-08-18）：上一张飞牌消失(1.35s)后隔 1s 才出下一张
// _monsterNoAnim=true 时同步执行（冒烟测试用，无动画无等待）
G._monsterNoAnim = false;
// skipStartSettle：读档恢复时，若保存前怪物回合已开始（中毒等回合开始结算已执行过），
// 跳过开头的每回合结算，避免重复扣血。由 loadRun 依据 _monsterTurnStarted 传入。
G.monsterTurn = function(skipStartSettle) {
  let b = G.state.battle;
  if(!b || b.over) return; // 修复（2026-08-23）：重考/放弃后 battle 为 null，原代码直接抛 TypeError
  let md = b.monsterData;
  // 读档恢复标记（2026-09-08）：怪物回合开始即置位，回合收尾推进到玩家回合时清除。
  b._monsterTurnStarted = true;
  // 中毒结算（编辑器效果积木 2026-08-23）: 怪物回合开始受等同层数伤害（无视护盾），层数-1
  if(!skipStartSettle && (b.monsterStatuses.poison||0) > 0 && !b.over) {
    let pd = b.monsterStatuses.poison;
    let hpBeforePoison = b.monsterHp;
    b.monsterHp -= pd;
    b.monsterStatuses.poison = pd - 1;
    b.log.push(`☠️ 中毒结算: 敌方受到${pd}点伤害（敌方生命${hpBeforePoison}→${b.monsterHp}）`);
    if(b.monsterHp <= 0) {
      b.over = true; b.won = true;
      b.log.push('🎉 击败了 ' + md.name + '！');
      if(G.fx && G.fx.killFx) G.fx.killFx('monster');
      G.render();
      return;
    }
  }
  // 怪物手牌机制（用户改 2026-08-19）：出牌无限制——每回合打光全部手牌（受 maxPlays 限制时按实际张数移出）
  // 怪物体力制度（2026-08-21 用户需求）：出牌消耗体力（cost 默认1），体力不足的卡留到下回合
  let sleeping = b.monsterSleepTurns > 0 || b.enemyDeckSleepingHits > 0;
  let maxPlays = (b.monsterPlayLimit && b.monsterPlayLimit.turns > 0) ? b.monsterPlayLimit.max : 99;
  // 修复（2026-08-23）：这里只做"出牌计划"，不再立即清空手牌——原版回合一开始就把全部要打的牌
  // 从 monsterHand 移出，导致怪物打第一张牌时手牌区整体消失（飞牌动画还没播完手牌就全没了）。
  // 改为 playStep 里每打一张才移除一张，手牌消失节奏与飞牌动画同步；体力不够留下的牌自然留在手牌。
  let toPlay = [], budget = b.monsterEnergy;
  for(let c of (b.monsterHand || [])) {
    let cost = c.cost == null ? 1 : c.cost;
    if(toPlay.length < maxPlays && cost <= budget) { toPlay.push(c); budget -= cost; }
  }
  let plays = 0;
  // 下一张出牌时机：飞牌消失(1.35s)+间隙1s；无动画模式直接同步下一步
  // 修复（2026-08-23）：挂起期间玩家重考/放弃/开新战斗时，旧链的 setTimeout 不得作用于新战斗
  // （finalize 里的 gainEnergy/battleDraw/turnBanner/render 全都操作 G.state 当前值，会污染新局）
  let battleAlive = function() { return G.state.battle === b && !b.over; };
  let next = function(ms) {
    if(G._monsterNoAnim) { playStep(); }
    else { setTimeout(function() { if(battleAlive()) playStep(); }, G.animMs(ms)); } // 设置页：节奏倍速
  };
  let playStep = function() {
    if(!toPlay.length || b.over) { finalize(); return; }
    let card = toPlay.shift();
    // 守卫：该牌可能已被本场更早的效果弃置（如怪物自己"配平"的摸2弃2会随机弃掉手牌）
    // ——已离手则视为不能打出，直接同步跳到下一张（不打出、不重复进弃牌堆）
    if(b.monsterHand.indexOf(card) < 0) { playStep(); return; }
    plays++;
    // 逐张从手牌移出并进弃牌堆（2026-08-23 修复：配合飞牌动画一张张消失）
    let hi = b.monsterHand.indexOf(card);
    if(hi >= 0) b.monsterHand.splice(hi, 1);
    b.monsterDiscard.push(card);
    if(sleeping) {
      b.log.push(`😴 沉睡: 怪物【${card.name}】无效`);
      b.playRecords.push({side:'m', name:card.name, desc:(card.desc||'')+'（沉睡无效）'});
      if(!G._monsterNoAnim) G.render();
      next(1000);
    } else {
      G.monsterPlayCard(card);
      if(!G._monsterNoAnim) {
        G.monsterPlayFx(card, 0);
        G.render();
      }
      next(1350 + 1000);
    }
  };
  let finalize = function() {
    b._monsterTurnStarted = false; // 读档恢复标记：怪物回合收尾，恢复流程不再跳过结算
    // 永久移出(遗忘/永恒)的卡从手牌与抽牌堆清除（任务1：保持牌堆模型一致）
    b.monsterHand = (b.monsterHand || []).filter(c => !b.monsterDeckBan[c.name]);
    b.monsterDrawPile = (b.monsterDrawPile || []).filter(c => !b.monsterDeckBan[c.name]);
    // 普通战每回合摸2张；期末考每回合摸3张。
    let drawN = Math.max(0, (b.monsterBaseDraw||2) - (b.monsterDrawPenalty||0) - (b.monsterNextDrawPenalty||0));
    b.monsterNextDrawPenalty = 0;
    if(drawN > 0) {
      let elig = c => !b.monsterDeckBan[c.name] && !(b.monsterExile||[]).some(x => x.name === c.name && x.untilTurn > b.turn);
      let pool = (b.monsterDrawPile || []).filter(elig);
      if(pool.length < drawN) {
        // 抽牌堆不足：弃牌堆洗回抽牌堆（任务1）
        let reshuf = (b.monsterDiscard || []).filter(elig);
        G.shuffleInPlace(reshuf);
        b.monsterDrawPile.push(...reshuf);
        b.monsterDiscard = (b.monsterDiscard || []).filter(c => !elig(c));
        pool = (b.monsterDrawPile || []).filter(elig);
      }
      G.shuffleInPlace(pool);
      // 修复（2026-08-19）：抽走的卡必须从抽牌堆移除——原来只复制不移除，
      // 牌堆总数每回合凭空增加（实测5→7），且手牌会出现重复卡
      let taken = pool.slice(0, drawN);
      taken.forEach(c => {
        let di = b.monsterDrawPile.indexOf(c);
        if(di >= 0) b.monsterDrawPile.splice(di, 1);
      });
      b.monsterHand.push(...taken);
    }
    // 噩梦枷锁: 对手每使用一张卡牌回复1体力
    if(b.nightmareShackles > 0 && plays > 0) {
      G.gainEnergy(plays);
      b.log.push(`😈 噩梦枷锁: 回复${plays}体力`);
    }
    // 递减
    if(b.monsterSleepTurns > 0) b.monsterSleepTurns--;
    if(b.monsterPlayLimit) {
      b.monsterPlayLimit.turns--;
      if(b.monsterPlayLimit.turns <= 0) b.monsterPlayLimit = null;
    }
    // 怪物体力回满（2026-08-21 用户需求）：每回合开始回满
    b.monsterEnergy = b.monsterMaxEnergy;

    if(!b.over && !(b.isFinal && b.turn >= 30)) {
      // Start new turn
      b.turn++;
      b.turnPreserveHand=false;
      b.phase = 'player';
      b.weakBrokenTurn=0;b.weakKindsTurn={};b.chariotHitThisCard={};b.chariotFirstFlawEffect={};b.wokeThisTurn=0;b.eyeMaskDreamTurn=false;b.flawComboClaimed={};b.flawComboActive=false;b.qualityUpgradedThisTurn=0;b.qualityResetUsedTurn=false;b.qualityShieldedTurn={};
      b.parry=false; // 招架仅持续至下个敌方回合结束。
      b.playerDiscardedThisTurn = false; // 张冠李戴条件重置（2026-08-23）
      G.fx.turnBanner('你的回合');
      // 特供小说：每过1回合倒计时，倒计时归零即"全额快照还原"
      if(b.novelBuff) {
        b.novelTurnsLeft--;
        if(b.novelTurnsLeft <= 0) G.endNovelBuff();
      }
      G.gainEnergy(Math.max(0, b.maxEnergy - b.energy)); // 所有人每回合开始回满体力
      // 精神: 每层体力回复+1（修复：回满制下原实现永远回复0；改为回合开始可临时超出上限）
      if(b.playerStatuses.spirit) b.energy = Math.max(b.energy, b.maxEnergy + b.playerStatuses.spirit);
      // 聪明：每回合减少2层。
      if(b.playerStatuses.smart) b.playerStatuses.smart=Math.max(0,b.playerStatuses.smart-2);
      // 体力充沛天赋: 每回合多回1体（回满制下适配为临时超上限1点，2026-08-23 补实现）
      if((G.state.talents||[]).includes('energy_surge')) b.energy = Math.max(b.energy, b.maxEnergy + 1);
      // 回合开始：总护盾衰减40%
      if(b.playerShield > 0) {
        let before = b.playerShield;
        b.playerShield = Math.floor(b.playerShield * 0.6);
        b.log.push(`🛡️ 回合开始: 护盾衰减40% (${before}→${b.playerShield})`);
      }
      b.turnLogicCostReduction = 0;
      b.turnLogicDmgMult = 1;
      b.turnNextDmgBonus = 0;
      b.nextLogicCostRed = 0;
      b.nextLogicDmgMult = 1;
      // Tick skill cooldowns
      if(b.charSkillCd > 0) b.charSkillCd--;
      // 搭档热情：每回合回复（无CD，技能消耗热情）（2026-08-21）
      // 修复（2026-08-21）：finalize 作用域无 s，需用 G.state.partners，否则 ReferenceError 中断发牌
      // 多搭档制（2026-08-24 肖清雅重做）：有搭档才回复
      if(G.state.partners && G.state.partners.length && b.passionMax > 0) {
        let before = b.passion;
        b.passion = Math.min(b.passionMax, b.passion + b.passionRegen);
        if(b.passion > before) b.log.push(`🔥 热情回复: ${before}→${b.passion}`);
      }
      // 接力棒: 下回合开始若在弃牌堆则回手
      let returns = [];
      b.discard = b.discard.filter(cid => {
        let dc = G.getCardData(cid);
        if(dc && dc.returnFromDiscardNextTurn) { returns.push(cid); return false; }
        return true;
      });
      returns.forEach(cid => { b.hand.push(cid); b.log.push('🏃 接力棒: 回到手牌'); });
      // 回响（肖清雅重做 2026-08-24）：上回合蓄势的卡在本回合开始生成0费临时卡（手牌满时进卡组）
      if(b.echoPending && b.echoPending.length) {
        let made = [];
        for(let eid of b.echoPending) {
          let tmp = eid + '#tmp';
          if(!G.getCardData(tmp)) continue;
          if(G.handCount(b) < G.HAND_CAP) b.hand.push(tmp);
          else b.drawPile.push(tmp);
          made.push((G.getCardData(tmp)||{}).name || eid);
        }
        b.echoPending = [];
        if(made.length) b.log.push(`🔁 回响: 生成0费临时卡【${made.join('、')}】`);
      }
      if(b.creationEchoPending && b.creationEchoPending.length) {
        let made=[];
        for(let snap of b.creationEchoPending) {
          let ref='creation_echo::'+(++b.creationCopySeq);
          b.creationCards[ref]=G.copyCreationState(snap,{ref:ref,temporary:true,turnCopy:false});
          if(G.handCount(b)<G.HAND_CAP) b.hand.push(ref); else b.drawPile.push(ref);
          made.push(G.creationCardData(ref).name);
        }
        b.creationEchoPending=[];
        if(made.length) b.log.push(`🔁 回响: 生成0费临时创作卡【${made.join('、')}】`);
      }
      // 梦醒时分：下个回合开始移除手中所有沉睡牌，不再因消耗霜蝶弃牌。
      if(b.dreamWakeRemoveSleepingNextTurn) {
        let removed=[];
        b.hand=b.hand.filter(ref=>{
          if(!G.isSleepingCard(ref)) return true;
          removed.push(G.getCardData(ref)?.name||ref);
          b.exhaust.push(ref);
          delete b.sleepingCards[ref];
          delete b.sleepWakeOnLeave[ref];
          delete G.state.sleepingCards[ref];
          return false;
        });
        b.dreamWakeRemoveSleepingNextTurn=false;
        if(removed.length) b.log.push(`🌙 梦醒时分: 下回合开始移除沉睡牌（${removed.map(n=>'【'+n+'】').join('、')}）`);
      }
      if((G.state.talents||[]).includes('easy_favor') && b.monsterHand.length) { let card=G.pick(b.monsterHand), ref='enemy_copy::'+(++b.creationCopySeq); b.enemyCopies[ref]={card:JSON.parse(JSON.stringify(card)),flash:true}; if(G.handCount(b)<G.HAND_CAP)b.hand.push(ref); }
      if(G.state.character.id==='xiaomeng_fiora'&&G.state.star>=2) G.startDuelDanceWeakness();
      // 梦境系回合递减
      if(b.nightmareShackles > 0) b.nightmareShackles = 0;
      if(b.energyBreakTurns > 0) b.energyBreakTurns--;
      // Draw 2（遗忘加摸/熬夜加摸/抢跑惩罚：少摸）
      let drawN = Math.max(0, 2 + (b.playerBonusDraw||0) + (b.nextTurnDrawBonus||0) - b.nextTurnDrawPenalty);
      if((G.state.talents||[]).includes('run_fast') && b.turn<=3) drawN+=2;
      if((G.state.talents||[]).includes('double_draw') && b.turn <= 4) drawN *= 2; // 双倍收获: 前4回合摸牌翻倍
      G.battleDraw(drawN);
      if((G.state.talents||[]).includes('perseverance_wala')) {
        let sh=Math.max(0,22-(b.turn-1)*4);
        if(sh>0){sh=Math.floor(sh*(b.shieldItemMult||1));b.playerShield+=sh;b.log.push(`🛡️ 毅力哇啦!: +${sh}护盾`);}
      }
      b.nextTurnDrawPenalty = 0;
      b.nextTurnDrawBonus = 0;
      b.quickLearnerUsedTurn = false;
      b.powerRestoreTurn = 0;
      // 用具回合开始效果（铅笔等）
      G.toolTurnStart();
      b.log.push(`--- 回合 ${b.turn} ---`);
    } else if(!b.over) {
      // 最终高考：坚持满30回合自动结算，视为通过，不进入普通失败/重考流程。
      b.turn = 30;
      b.over = true;
      b.gaokaoTimedOut = true;
      b.won = true;
      b.log.push('⏱️ 高考通过：坚持满30回合');
    }
    G.render();
  };
  playStep();
};

G.monsterPlayCard = function(card) {
  let b = G.state.battle;
  // 生态系统【种群增长】固定规则：双方各摸2张，怪物额外摸1张。
  // 兼容旧存档/旧编辑器对象，避免运行时字段残留为怪物仅摸2张。
  if(card && card.name === '种群增长') { card.mPlayerDraw = 2; card.mDraw = 3; }
  let dealt = 0;
  let monsterHitFxValues = [];
  let jituHeadBonus = card === b.jituHeadBonusCard;
  if(jituHeadBonus) b.jituHeadBonusCard = null;
  let frostBlocked=(b.playerStatuses.shuangdie||0)>0&&!!(card.mFixedDamage||card.dmgStat||card.mDiscardPlayerOrDmg);
  if(frostBlocked){if(b.preserveNextFrost){b.preserveNextFrost=false;b.log.push('🛏️ 裹紧被子: 本次【霜蝶】不消耗层数');}else {b.playerStatuses.shuangdie--;}if(b.dreamOnNextFrost){b.dreamOnNextFrost=false;G.gainMengxie(1);}b.log.push(`🦋 霜蝶: 抵挡【${card.name}】本次攻击的所有伤害`);}
  // 怪物体力制度（2026-08-21 用户需求）：出牌扣体力（cost 默认1）
  b.monsterEnergy = Math.max(0, b.monsterEnergy - (card.cost == null ? 1 : card.cost));
  // 出牌记录（左侧面板）
  b.playRecords.push({side:'m', name:card.name, desc:card.desc});
  if(card._silencedUntil && card._silencedUntil >= b.turn) {
    b.log.push(`🔇 ${card.name}: 被沉默，本次没有效果`);
    delete card._silencedUntil;
    return;
  }
  // ===== 怪物非伤害效果（2026-08-23 补实现：原版只处理 dmgStat，desc 写了效果但打出无反应）=====
  // 怪物护盾（摩擦力）
  if(card.mShield) {
    if((b.monsterStatuses.breakDefense||0)>0) {
      b.monsterStatuses.breakDefense--;
      b.log.push(`🛡️ ${card.name}: 【破防】使本次护盾失效`);
    } else {
      b.monsterStatuses.shield = (b.monsterStatuses.shield||0) + card.mShield;
      b.log.push(`🛡️ ${card.name}: 怪物获得${card.mShield}护盾`);
    }
  }
  if(card.mHeal) {
    let before = b.monsterHp;
    b.monsterHp = Math.min(b.monsterMaxHp, b.monsterHp + card.mHeal);
    b.log.push(`💚 ${card.name}: 怪物回复${b.monsterHp-before}生命`);
  }
  if(card.mEnergy) {
    b.monsterEnergy += card.mEnergy;
    b.log.push(`⚡ ${card.name}: 怪物获得${card.mEnergy}体力`);
  }
  if(card.mPlayerDraw) {
    let drawn = G.battleDraw(card.mPlayerDraw);
    b.log.push(`🃏 ${card.name}: 对方摸${drawn}张牌`);
  }
  if(card.mPlayerDrawPenalty) {
    b.nextTurnDrawPenalty = (b.nextTurnDrawPenalty||0) + card.mPlayerDrawPenalty;
    b.log.push(`📕 ${card.name}: 对方下回合少摸${card.mPlayerDrawPenalty}张牌`);
  }
  if(card.mPlayerEnergyLoss) {
    b.energy = Math.max(0, b.energy - card.mPlayerEnergyLoss);
    b.log.push(`⚡ ${card.name}: 对方失去${card.mPlayerEnergyLoss}体力`);
  }
  if(card.mPlayerNextLogicCost) {
    b.nextLogicCostRed = (b.nextLogicCostRed||0) + card.mPlayerNextLogicCost;
    b.log.push(`📕 ${card.name}: 对方下张逻辑卡消耗+${card.mPlayerNextLogicCost}`);
  }
  if(card.mMillPlayer) {
    let milled = b.drawPile.splice(0, Math.min(card.mMillPlayer, b.drawPile.length));
    b.discard.push(...milled);
    b.log.push(`📚 ${card.name}: 对方牌库顶${milled.length}张进入弃牌堆`);
  }
  // 双方弃置全部手牌的怪物卡：保留牌仍遵守【保留】规则。
  if(card.mDiscardPlayerAll && b.hand.length > 0) {
    let all = b.hand.filter(ref => { let d=G.getCardData(ref); return !(d&&d.baoliu); });
    all.forEach(ref => { let i=b.hand.indexOf(ref); if(i>=0)b.hand.splice(i,1); G.discardFromHand(ref); });
    b.log.push(`🗑️ ${card.name}: 对方弃置${all.length}张手牌`);
  }
  // 下张伤害卡加成（词缀变化）
  if(card.mNextLogicBonus) {
    b.monsterNextLogicDmgBonus = (b.monsterNextLogicDmgBonus||0) + card.mNextLogicBonus;
    b.log.push(`⚡ ${card.name}: 怪物下张伤害卡+${card.mNextLogicBonus}`);
  }
  // 摸牌弃牌（配平：摸2弃2）
  if(card.mDraw) {
    let pool = b.monsterDrawPile || [];
    if(pool.length < card.mDraw) { // 抽牌堆不足洗回弃牌堆
      let reshuf = (b.monsterDiscard || []).filter(c => !b.monsterDeckBan[c.name]);
      G.shuffleInPlace(reshuf);
      b.monsterDrawPile.push(...reshuf);
      b.monsterDiscard = [];
    }
    let taken = b.monsterDrawPile.splice(0, card.mDraw);
    b.monsterHand.push(...taken);
    b.log.push(`🃏 ${card.name}: 怪物摸${taken.length}张（本效果应摸${card.mDraw}张）`);
  }
  if(card.mSelfDiscard && b.monsterHand.length > 0) {
    G.shuffleInPlace(b.monsterHand);
    let dropped = b.monsterHand.splice(0, Math.min(card.mSelfDiscard, b.monsterHand.length));
    b.monsterDiscard.push(...dropped);
    b.log.push(`🃏 ${card.name}: 怪物弃${dropped.length}张`);
  }
  // 弃玩家手牌（望文生义/大喊/拼写规则）
  let discardPlayerN = (card.mDiscardPlayer||0);
  if(card.mDiscardPlayerOrDmg) {
    if(b.hand.length > 0) discardPlayerN = 1;
    else { // 无手牌则造成固定伤害
      let hpBefore = b.playerHp;
      let actual=frostBlocked?0:G.reduceByParry(card.mDiscardPlayerOrDmg);
      b.playerHp -= actual; G.recordRunDamage('taken',actual);
      b.log.push(`👹 ${card.name}: 造成${actual}点伤害（我方生命${hpBefore}→${b.playerHp}）`);
      G.fx.playerHurt(actual);
    }
  }
  if(discardPlayerN > 0 && b.hand.length > 0) {
    // 保留牌不会被敌方或环境效果弃置；玩家自己的技能与卡牌仍可处理它。
    let idxs = [...b.hand.keys()].filter(i=>{let d=G.getCardData(b.hand[i]);return !(d&&d.baoliu);});
    G.shuffleInPlace(idxs);
    let droppedIds = idxs.slice(0, discardPlayerN).map(i => b.hand[i]);
    droppedIds.forEach(cid => {
      b.hand.splice(b.hand.indexOf(cid), 1);
      G.discardFromHand(cid);
      let dc = G.getCardData(cid);
      b.log.push(`🗑️ ${card.name}: 弃置对方【${dc ? dc.name : cid}】`);
    });
  }
  // 图鉴通用固定伤害。与倍率伤害一样经过玩家护盾、无视和天赋减伤。
  if(card.mFixedDamage) {
    let dmg = card.mFixedDamage;
    if(frostBlocked) dmg=0;
    if((G.state.talents||[]).includes('hard_tank')) dmg = Math.max(0, dmg-4);
    dmg=G.reduceByParry(dmg);
    if(!card.pierce && b.playerShield > 0) {
      let absorbed = Math.min(b.playerShield, dmg);
      b.playerShield -= absorbed; dmg -= absorbed;
    }
    dmg = Math.max(0, dmg - (b.playerStatuses.wushi||0));
    if(dmg > 0) {
      let hpBefore = b.playerHp;
      b.playerHp -= dmg; G.recordRunDamage('taken',dmg); dealt += dmg;
      monsterHitFxValues.push(dmg);
      b.log.push(`👹 ${card.name}: 造成${dmg}点伤害（我方生命${hpBefore}→${b.playerHp}）`);
    }
  }
  if(card.dmgStat) {
    let stat = card.dmgStat === 'intelligence' ? b.monsterIntelligence : (card.dmgStat === 'physique' ? b.monsterPhysique : b.monsterEq);
    let hits = card.hits || 1;
    // 条件倍率（张冠李戴）：对方本回合弃过牌则加强（2026-08-23 补实现）
    let effMult = (card.dmgMultIfPlayerDiscarded && b.playerDiscardedThisTurn) ? card.dmgMultIfPlayerDiscarded : (card.dmgMult || 1);
    // 固定加成（重力势能）：+怪物当前护盾值（2026-08-23 补实现）
    let flatBonus = card.dmgPlusOwnShield ? (b.monsterStatuses.shield||0) : 0;
    // 词缀变化：怪物下张伤害卡+2（一次性，用后清零；每段伤害都吃加成与原版"下张卡"语义一致）
    let nextBonus = b.monsterNextLogicDmgBonus || 0;
    if(nextBonus > 0) b.monsterNextLogicDmgBonus = 0;
    let hitMults = Array(hits).fill(effMult);
    if(card.unequalHandExtraMult && b.monsterHand.length !== b.hand.length) hitMults.push(card.unequalHandExtraMult);
    for(let h=0;h<hitMults.length;h++) {
      let dmg = Math.floor(stat * hitMults[h]) + flatBonus + nextBonus;
      if(jituHeadBonus) dmg = Math.floor(dmg * 1.3);
      if(frostBlocked) continue;
      if((G.state.talents||[]).includes('hard_tank')) dmg=Math.max(0,dmg-4);
      dmg=G.reduceByParry(dmg);
      // 修复（2026-08-19）：删除"怪物攻击消耗怪物自己护盾"的错误逻辑（复制粘贴自玩家攻击路径）；
      // 怪物护盾只应吸收玩家打出的伤害
      // 减伤（万夫莫敌）
      if(b.dmgReduceTurns > 0) dmg = Math.floor(dmg * 0.9);
      // 玩家护盾吸收
      if(!card.pierce && b.playerShield > 0) {
        let absorbed = Math.min(b.playerShield, dmg);
        b.playerShield -= absorbed; dmg -= absorbed;
      }
      // 无视: 每层使受伤降低1（减到0为止）
      let wushi = b.playerStatuses.wushi || 0;
      if(wushi > 0) dmg = Math.max(0, dmg - wushi);
      if(dmg <= 0) { b.log.push(`🛡️ ${card.name} 的伤害被完全挡下`); continue; }
      let hpBefore = b.playerHp;
      b.playerHp -= dmg; G.recordRunDamage('taken',dmg);
      G.checkChengliangPedometerLoss(dmg);
      dealt += dmg;
      monsterHitFxValues.push(dmg);
      // 忍耐: 受伤转化耐力
      if(b.enduranceConvert > 0) {
        b.endurance += Math.floor(dmg * b.enduranceConvert * ((G.state.star >= 2 && G.state.character && G.state.character.id === 'chengliang') ? 1.3 : 1));
        G.checkChengliangPedometer();
      }
      b.log.push(`👹 ${card.name}: 第${h+1}段造成${dmg}点伤害（我方生命${hpBefore}→${b.playerHp}）`);
    }
  }
  // 被攻击特效：屏幕抖动 + 全屏闪红 + 伤害飘字（仅实际扣血时触发）
  if(dealt > 0) {
    if(monsterHitFxValues.length>1){
      let step=1000/monsterHitFxValues.length;
      monsterHitFxValues.forEach((value,i)=>setTimeout(()=>G.fx.playerHurt(value),Math.floor(i*step)));
    } else G.fx.playerHurt(monsterHitFxValues[0]||dealt);
  }
  // 课桌用的枕头: 第一次生命为0时复活回满
  if(b.playerHp <= 0 && G.tryRally()) {
    return;
  }
  if(b.playerHp <= 0) { b.over = true; b.won = false; b.log.push('💀 你被击败了...'); if(G.fx && G.fx.killFx) G.fx.killFx('player'); }
};

// 怪物出牌动作（用户定 2026-08-18）：卡从怪物手牌飞入中间出牌区，短暂展示后淡出；出牌区短暂显现并显示卡名
G._monsterFxLeft = 0;
G.monsterPlayFx = function(card, delay) {
  setTimeout(function() {
    let b = G.state.battle;
    if(b && b.over) return;
    if(G.sfx) G.sfx.play('monsterPlay'); // 怪物出牌音效（2026-08-23）
    let row = document.getElementById('monsterHandRow');
    let zone = document.getElementById('playZone');
    let lb = document.getElementById('playZoneLabel');
    if(!row || !zone || !row.getBoundingClientRect || !zone.getBoundingClientRect) return;
    zone.classList.add('monster-fx');
    if(lb) lb.textContent = '👹 ' + card.name;
    G._monsterFxLeft++;
    let rb = row.getBoundingClientRect();
    let zb = zone.getBoundingClientRect();
    let el = document.createElement('div');
    el.className = 'monster-fly';
    // 翻牌（任务7）：3D 支持时背面飞入→翻转露正面；不支持时直接正面飞入（不报错）
    let flip3d = (typeof document.body !== 'undefined' && document.body.style && ('transformStyle' in document.body.style));
    el.innerHTML = flip3d
      ? `<div class="flip-inner">
           <div class="flip-back card card-back mhand-big"></div>
           <div class="flip-front">${G.cardFaceHtml({...card, cost:0, monsterCard:true}, {cls:'mhand-big'})}</div>
         </div>`
      : G.cardFaceHtml({...card, cost:0, monsterCard:true}, {cls:'mhand-big'});
    let w = 150, h = 240; // 默认大屏卡尺寸，append 后按实际尺寸校正（小屏 100×160）
    el.style.left = (rb.left + rb.width/2 - w/2) + 'px';
    el.style.top = (rb.top + rb.height/2 - h/2) + 'px';
    document.body.appendChild(el);
    // 设置页（2026-08-23）：战斗节奏非1倍速时，同步缩短飞牌 CSS 过渡时长，与 animMs 计时保持同拍
    let spd = (G.settings && G.settings.battleSpeed) || 1;
    if(spd !== 1) {
      el.style.transitionDuration = (0.45 / spd) + 's';
      let fi = el.querySelector('.flip-inner');
      if(fi) fi.style.transitionDuration = (0.25 / spd) + 's';
    }
    if(el.firstElementChild) {
      w = el.firstElementChild.offsetWidth || w;
      h = el.firstElementChild.offsetHeight || h;
    }
    let tx = (zb.left + zb.width/2 - w/2) + 'px';
    let ty = (zb.top + zb.height/2 - h/2) + 'px';
    let fly = function() {
      el.style.left = tx;
      el.style.top = ty;
    };
    if(typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(function(){ requestAnimationFrame(fly); });
    } else { fly(); }
    if(flip3d) setTimeout(function(){ el.classList.add('flipped'); }, G.animMs(460)); // 飞入到位后翻转（任务7）
    setTimeout(function(){ el.classList.add('fade'); }, G.animMs(950));
    setTimeout(function() {
      el.remove();
      G._monsterFxLeft--;
      if(G._monsterFxLeft <= 0) {
        zone.classList.remove('monster-fx');
        if(lb) lb.textContent = '🀄 出牌区';
      }
    }, G.animMs(1350));
  }, delay || 0);
};

// 高考计分（2026-08-22 新增）：按结束时玩家回合数 r 用 V 形曲线算分，分数 1:1 当场换算为命运点
// r1=750，每回合-50 → r16=0；r≥17 每回合+50 → r30=750（满分）
G.gaokaoScore = function(b) {
  let s = G.state;
  let r = Math.min(b.turn || 1, 30);
  let score;
  if(r <= 16) {
    score = Math.max(0, 750 - (r - 1) * 50);
  } else {
    score = Math.min(750, (r - 15) * 50);
  }
  G.meta.fatePoints = (G.meta.fatePoints || 0) + score;
  s.runFatePoints = (s.runFatePoints || 0) + score;
  s.settlementScore = score;
  s.settlementReason = b.won ? 'gaokao' : 'gaokao_failed';
  s.runStats=s.runStats||{}; s.runStats.gaokaoTurns=Math.min(b.turn||1,30);
  G.saveMeta();
  let title = b.won ? '🎓 高考通过' : (b.gaokaoTimedOut ? '⏱️ 高考坚持满30回合' : '📋 高考：虽败犹荣');
  G.showModal(`
    <div style="text-align:center">
      <div style="font-size:40px">${b.won ? '🏆' : '📄'}</div>
      <h3 style="color:#ffd700;margin:6px 0 4px">${title}</h3>
      <div style="font-size:12px;color:#a0b8d0;margin-bottom:6px">第 ${r} 回合结算</div>
      <div style="font-size:26px;color:#40e060;margin:10px 0">${score} 分</div>
      <div style="font-size:12px;color:#8ab4f8">🔮 等量换算为命运点 +${score}</div>
      <button class="btn primary" style="width:100%;margin-top:12px;height:42px" onclick="G.closeModal()">继续</button>
    </div>`);
  return score;
};

G.finalizeCreatedWorks = function(b) {
  let s=G.state, works=(b && b.completedWorks) ? b.completedWorks : [];
  if(!works.length) return;
  s.createdBooks = s.createdBooks || [];
  for(let work of works) {
    let dir=(G.CREATION_DIRECTIONS[work.direction]||{name:'未定'}).name;
    let fallback=`${dir}作品${s.createdBooks.length+1}`;
    let name=fallback;
    try {
      let input=(typeof prompt==='function') ? prompt(`创作完成！请为这本${dir}书籍命名：`,fallback) : null;
      if(input && input.trim()) name=input.trim().slice(0,30);
    } catch(e) {}
    let book={id:'created_'+Date.now()+'_'+Math.floor(Math.random()*100000),name:name,direction:work.direction,directionName:dir,inspiration:work.inspiration||0,effects:(work.effects||[]).map(e=>e.text||'灵感效果'),completed:true,createdAt:new Date().toISOString()};
    s.createdBooks.push(book);
    G.showToast(`📚 《${name}》已加入本局书架`);
  }
  b.completedWorks=[];
};

G.endBattle = function() {
  try {
  let s = G.state;
  let b = s.battle;
  if(!b) { console.error('endBattle: no battle'); G.setScreen('map'); return; }
  // 满分成就（薛诗蕾线）：同回合使用0/1/2/3+费逻辑卡并在该回合击败目标（2026-08-24）
  if(b.won && G.costBrackets(b) >= 4) G.xslAchvUnlock('manfen');
  // 只有第6章最终高考按回合计分并换算命运点。
  let isGaokao = !!b.isGaokao || (!!b.isFinal && (s.chapter||1)>=6);
  if(isGaokao) G.gaokaoScore(b);
  if(isGaokao && b.won) {
    if(b.novelBuff) G.endNovelBuff();
    G.finalizeCreatedWorks(b);
    s.hp = Math.min(s.maxHp, b.playerHp);
    s.settlementReason='gaokao';
    s.battle=null;
    G.settleRun();
    s.screen='victory';
    G.render();
    return;
  }
  if(b.won) {
    if(G.fx && G.fx.victoryFx) G.fx.victoryFx(); // 胜利金光雨（2026-08-23）
    // 特供小说buff未到期即胜利：先全额还原再结算（期间一切影响——含龙族生命减半/魔戒扣血——不算数）
    if(b.novelBuff) G.endNovelBuff();
    G.finalizeCreatedWorks(b);
    s.hp = Math.min(s.maxHp, b.playerHp);
    // 基础奖励
    let rewardNode = G.getNode(s.currentNodeId), rewardTier=b.monsterData&&b.monsterData.tier;
    let goldGain = (rewardTier==='mock'||rewardTier==='gaokao') ? 600 : (rewardNode&&rewardNode.type==='final_exam' ? 300 : rewardTier==='monthly' ? 150 : 60);
    // 节俭(程良2星): 零花钱获取量+20%
    if(s.star >= 2 && s.character.stars[2] && s.character.stars[2].passive === 'jiejian') {
      goldGain = Math.floor(goldGain * 1.3);
    }
    if((s.talents||[]).includes('mom_keeps_money')) goldGain=Math.floor(goldGain*1.35);
    goldGain = G.gainGold(goldGain);
    s.lastBattleGold=goldGain;
    if((s.talents||[]).includes('participation_award')) {
      let gain=G.gainGold(Math.max(2,(s.chapter||1)*2)); s.lastBattleGold+=gain; G.showToast(`🏅 参与奖: +${gain}零花钱`);
    }
    if((s.talents||[]).includes('compound_interest')) {
      s.compoundInterest=(s.compoundInterest||0)+1;
      let gain=G.gainGold(s.compoundInterest);
      s.lastBattleGold+=gain;
      G.showToast(`💰 利滚利: +${gain}零花钱`);
    }
    // 骄傲(唐淞2星): 每通过战斗节点，无视层数上限+4
    if(s.star >= 2 && s.character.stars[2] && s.character.stars[2].passive === 'jiaoao') {
      s.wushiCapBonus += 4;
      G.showToast('😏 骄傲: 无视层数上限+4');
    }
    // 小君的赌注结算
    if(s.bet) {
      let ok = b.energySpentTotal >= s.bet.need;
      let amount = s.bet.successGold ?? (s.bet.need === 15 ? 20 : 30);
      let fail = s.bet.failGold ?? (s.bet.need === 15 ? 5 : 10);
      if(ok) { let gain=G.gainGold(amount); G.showToast('🏁 赌注成功！+' + gain + '零花钱'); }
      else { s.gold = Math.max(0, s.gold - fail); G.showToast('🏁 赌注失败...-' + fail + '零花钱'); }
      s.bet = null;
    }
    s.monsterNodesPassed++;
    if(G.state.currentNodeId) {
      let node = G.getNode(s.currentNodeId);
      if(node && (node.type==='monthly_exam'||node.type==='final_exam')) s.bossNodesPassed++;
    }
    // 羁绊点（本局累积，局末统一入账）：基础按节点类型 + 智力加成（每10点智力+3）
    let node = G.getNode(s.currentNodeId);
    if(node) {
      let base = G.BOND_REWARD[node.type] || 0;
      let iq = s.intelligence || 0;
      let gain = base + Math.floor(iq / 10) * 3;
      if(gain > 0) {
        s.runBondPoints += gain;
        G.showToast(`❤️ 羁绊点 +${gain}`);
      }
    }
    // 期末考通关：奖励后进入下一章
    let clearNode = G.getNode(s.currentNodeId);
    if(clearNode && (clearNode.type==='monthly_exam'||clearNode.type==='final_exam') && (s.talents||[]).includes('keep_fit') && !(s.character&&s.character.physiqueLocked)) {
      s.physique += 1; s.maxHp = s.physique * 5; s.hp = Math.min(s.maxHp, s.hp + 5);
      G.showToast('🏋️ 坚持健身: 通过大考，体魄+1');
    }
    if(clearNode && (clearNode.type==='monthly_exam'||clearNode.type==='final_exam') && (s.talents||[]).includes('xueshen_zhilu')) {
      let inc=(s.chapter||1)>=5?3:1;
      s.physique+=inc;s.intelligence+=inc;s.eq+=inc;s.maxHp=s.physique*5;s.hp=Math.min(s.maxHp,s.hp+inc*5);
      G.showToast(`🎓 学神之路: 三维各+${inc}`);
    }
    if(G.resolvePostExamSystems) G.resolvePostExamSystems(b,clearNode);
    s._chapterClear = !!(clearNode && clearNode.type === 'final_exam');
    if(clearNode&&clearNode.type==='final_exam'){let inc=(s.character.id==='liangchaojie'&&s.star>=2)?11:10;s.readingSpeed=(s.readingSpeed||10)+inc;s.readingSpeedFinalBonus=(s.readingSpeedFinalBonus||0)+inc;}
    s.rewardRefreshUsed=false;
    // 月考胜利改为书籍三选一；书籍不会重复出现或获取。
    let schoolYear=Math.ceil((s.chapter||1)/2),firstYearBattle=!s.yearFirstBattleRewarded?.[schoolYear];
    if(firstYearBattle){s.yearFirstBattleRewarded=s.yearFirstBattleRewarded||{};s.yearFirstBattleRewarded[schoolYear]=true;}
    s.rewardCardsCarryItems=!!(firstYearBattle||(clearNode&&clearNode.type==='final_exam'));
    if(clearNode && clearNode.type === 'monthly_exam') {
      s.pendingBookReward=G.shuffle(G.BOOK_LIST.filter(id=>s.books[id]&&!s.books[id].obtained)).slice(0,3);
      s.screen = 'book_reward';
    } else {
      // Reward: 3 card choices
      s.pendingReward = G.generateRewardCards();
      s.screen = 'reward';
    }
  } else if(isGaokao) {
    // 最终高考失败不算普通败北：按回合计分并完成本局。
    G.removeLongzuBg();
    s.hp = Math.max(1, Math.min(s.maxHp, b.playerHp || 1));
    s.bet = null;
    if(s.chapter >= 6) {
      s.screen = 'victory';
    } else {
      s.chapter++;
      G.generateMap();
      s.completedNodes = {}; s.reachableNodes = {};
      s.reachableNodes[s.chapterMap.nodes[0].id] = true;
      s.currentNodeId = null;
      G.showToast('📖 进入' + s.chapterMap.name);
    }
  } else {
    G.removeLongzuBg(); // 败北：龙族壁纸立即清除，避免遮住结算/地图界面
    s.screen = 'gameover';
    s.hp = 0;
    s.bet = null;
  }
  s.battle = null;
  G.render();
  } catch(e) { console.error('endBattle error:',e); G.removeLongzuBg(); G.setScreen('map'); }
};

// ===== 战斗失败：重考 / 放弃（2026-08-19 用户需求）=====
// 失败弹窗：重考=退到局外可再次挑战；放弃=直接通过但无局外和羁绊点奖励
G._showFailModal = function() {
  if(typeof document === 'undefined') return;
  if(document.getElementById('modalOverlay')) return; // 防重复弹窗
  let html = `
    <div style="text-align:center">
      <div style="font-size:44px">💀</div>
      <h3 style="color:#f04040;margin:6px 0 2px">考试失败</h3>
      <p style="color:#a0b8d0;font-size:11px;margin:0 0 14px">这场没撑住，选择下一步吧</p>
      <div style="display:flex;flex-direction:column;gap:8px">
        <div class="card" style="max-width:100%;cursor:pointer" onclick="G.retakeBattle()">
          <div style="font-weight:bold;font-size:13px">🔄 重考</div>
          <div style="font-size:10px;color:#8ab4f8;margin-top:2px">退到局外，保持当前血量，可再次挑战本场战斗</div>
        </div>
        <div class="card" style="max-width:100%;cursor:pointer" onclick="G.giveUpBattle()">
          <div style="font-weight:bold;font-size:13px">🏳️ 放弃</div>
          <div style="font-size:10px;color:#8ab4f8;margin-top:2px">直接通过本场战斗，没有局外和羁绊点奖励（仅第6章高考放弃会使高考难度+5%）</div>
        </div>
      </div>
    </div>`;
  G.showModal(html);
};
// 重考：退到局外（地图），当前节点恢复可挑战，血量保持进本关时的状态（不恢复）
G.retakeBattle = function() {
  let s = G.state;
  s.runStats=s.runStats||{}; s.runStats.retakes=(s.runStats.retakes||0)+1;
  G.closeModal();
  G.removeLongzuBg(); // 龙族壁纸立即清除，否则 fixed 全屏层遮住地图选关界面（2026-08-22 修复）
  s.battle = null;
  s.bet = null; // 赌注作废
  if(s.currentNodeId) {
    // clickNode 点击时就已标记完成并推进可达性，这里回退，让节点可再次挑战
    s.completedNodes[s.currentNodeId] = false;
    s.reachableNodes[s.currentNodeId] = true;
    // 撤销该节点揭示的后继节点（未走完的才撤），避免绕过本场战斗直走下一段
    let edges = s.chapterMap.edgeMap[s.currentNodeId] || [];
    edges.forEach(function(nid){
      if(!s.completedNodes[nid]) s.reachableNodes[nid] = false;
    });
  }
  G._prevPlayerHpPct = null; G._prevMonsterHpPct = null;
  G.setScreen('map');
  G.showToast('🔄 已退到局外，可再次挑战');
};
// 放弃：直接通过本场战斗，无任何奖励（无卡牌/零花钱/局外与羁绊点奖励），血量保持进本关时的状态（不恢复）
G.giveUpBattle = function() {
  let s = G.state;
  s.runStats=s.runStats||{}; s.runStats.abandons=(s.runStats.abandons||0)+1;
  G.closeModal();
  G.removeLongzuBg(); // 龙族壁纸立即清除（同重考路径）
  let node = s.currentNodeId ? G.getNode(s.currentNodeId) : null;
  s.battle = null;
  s.bet = null; // 赌注作废
  s.compoundInterest = 0;
  // 只有第6章最终高考放弃时累积高考难度；普通期末考不增加。
  if(node && node.type === 'final_exam' && (s.chapter || 1) >= 6) {
    s.gaokaoDifficultyBonus = (s.gaokaoDifficultyBonus || 0) + 0.05;
  }
  s.monsterNodesPassed++; // 节点算通过
  if(node && (node.type === 'monthly_exam' || node.type === 'final_exam')) s.bossNodesPassed++;
  G._prevPlayerHpPct = null; G._prevMonsterHpPct = null;
  if(node && node.type === 'final_exam') {
    // 期末考放弃也算推进章节（否则进度会卡死），但无奖励
    if(s.chapter >= 6) {
      G.showToast('🏳️ 已放弃：通过考试');
      s.settlementReason='abandoned'; s.settlementScore=0;
      setTimeout(function(){ G.setScreen('victory'); }, 500);
      return;
    }
    s.chapter++;
    G.generateMap();
    s.completedNodes = {}; s.reachableNodes = {};
    s.reachableNodes[s.chapterMap.nodes[0].id] = true;
    s.currentNodeId = null;
    G.showToast('📖 进入' + s.chapterMap.name);
    setTimeout(function(){ G.setScreen('map'); }, 800);
    return;
  }
  G.setScreen('map');
  G.showToast('🏳️ 已放弃：直接通过，无奖励');
};

// 卡牌品质与天赋使用同一套学期权重；红色不进入普通随机池。
G.rollQuality = function(d) {
  let tiers = Object.keys(d.qv || {});
  let avail = [d.q || 'green', ...tiers].filter(q=>G.QUAL_LADDER.includes(q));
  avail = [...new Set(avail)];
  return G.pickSemesterQuality(avail) || d.q || 'green';
};

G.generateRewardCards = function() {
  let s = G.state;
  let pool = [...s.character.starterDeck];
  // 角色专属卡池 + 通用卡 + 用具卡
  let extras = [...(s.character.exclusive || []), 'yuxi','tongxiao','fan_lajitong','chi_binggun', ...G.TOOL_CARDS];
  pool.push(...extras);
  // Unique
  pool = [...new Set(pool)];
  pool = pool.filter(cid=>!G.isZhijiaoCard(cid)&&!(s.character&&s.character.physiqueLocked&&G.isPhysiqueRelatedCard(cid)));
  // 薛诗蕾线：成就锁定的专属卡未解锁则不出现在卡池；已解锁的主动加入（2026-08-24）
  if(s.character.id === 'xueshilei' && G.XSL_ACHV_LOCKED) {
    let got = (G.meta && G.meta.xslAchv) || {};
    let unlockedCards = Object.keys(G.XSL_ACHV).filter(k => got[k]).map(k => G.XSL_ACHV[k].unlock);
    pool = pool.filter(cid => !G.XSL_ACHV_LOCKED.includes(cid));
    unlockedCards.forEach(cid => { if(G.CARDS[cid] && !pool.includes(cid)) pool.push(cid); });
  }
  // 同名解答卡卡组已有则不出现（按基础id比较，兼容品质ref）；用具卡已有则不再出现（每种1张即可）
  pool = pool.filter(cid => {
    let d = G.getCardData(cid);
    if(!d) return false;
    if(d.type === 'tool' && s.deck.some(r => (G.getCardData(r)||{}).id === d.id)) return false;
    if(d.type === 'answer' && s.deck.some(r => (G.getCardData(r)||{}).id === d.id)) return false;
    return true;
  });
  // 品质roll：带qv的卡roll出品质ref（如 shuati@gold）
  pool = pool.map(cid => {
    let d = G.CARDS[cid];
    return (d && d.qv) ? (cid + '@' + G.rollQuality(d)) : cid;
  });
  // 用具卡仍可作为普通卡牌奖励出现，但出现权重只有其他卡牌的50%。
  let weightedPool=pool.map(ref=>({ref,w:(G.getCardData(ref)||{}).type==='tool'?.5:1})),picks=[];
  while(picks.length<3&&weightedPool.length){
    let total=weightedPool.reduce((sum,x)=>sum+x.w,0),roll=Math.random()*total,acc=0,index=0;
    for(let i=0;i<weightedPool.length;i++){acc+=weightedPool[i].w;if(roll<acc){index=i;break;}}
    picks.push(weightedPool[index].ref);weightedPool.splice(index,1);
  }
  if(s.rewardCardsCarryItems){s.pendingRewardItems={};for(let ref of picks){if((G.getCardData(ref)||{}).type==='tool')continue;let base=G.baseId(ref),owned=new Set((s.cardItems&&s.cardItems[base])||[]),items=Object.values(G.CARD_ITEMS||{}).filter(x=>!owned.has(x.id)&&!(s.character&&s.character.physiqueLocked&&G.isPhysiqueRelatedItem(x)));if(items.length){let item=G.pickEntryBySemesterQuality(items);s.pendingRewardItems[ref]=item.id;}}}else s.pendingRewardItems=null;
  return picks;
};
