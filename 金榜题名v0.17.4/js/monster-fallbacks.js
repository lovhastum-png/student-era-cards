// 怪物描述型卡牌结算补全：兼容旧怪物数据中的 ruleFallback 标记。
(function(){
  if(!G.monsterPlayCard)return;
  const oldPlay=G.monsterPlayCard;
  const num=(s,re,def=0)=>{let m=String(s||'').match(re);return m?Number(m[1]):def;};
  const has=(s,re)=>re.test(String(s||''));
  function normalize(card){
    if(!card||!card.ruleFallback||card._fallbackNormalized)return;
    let t=card.desc||'',n=card.name||'';
    // 纯基础效果：转换为怪物结算器已经支持的字段。
    if(!card.dmgStat){let m=t.match(/造成\s*([\d.]+)\s*倍(智力|情商|体魄)/);if(m){card.dmgStat={智力:'intelligence',情商:'eq',体魄:'physique'}[m[2]];card.dmgMult=Number(m[1]);}}
    if(!card.mFixedDamage){let m=t.match(/造成\s*[（(]?[^）)]*?[）)]?\s*([\d.]+)\s*点伤害/);if(m&&!/受到/.test(t))card.mFixedDamage=Number(m[1]);}
    if(has(t,/双方各摸\s*([0-9]+)/)){let x=num(t,/双方各摸\s*([0-9]+)/);card.mPlayerDraw=card.mPlayerDraw||x;card.mDraw=(card.mDraw||0)+x;}
    if(!card.mPlayerDraw){let x=num(t,/对方摸\s*([0-9]+)/);if(x)card.mPlayerDraw=x;}
    if(has(t,/怪物额外摸\s*([0-9]+)/))card.mDraw=(card.mDraw||0)+num(t,/怪物额外摸\s*([0-9]+)/);
    if(has(t,/双方各随机弃\s*([0-9]+)/)){let x=num(t,/双方各随机弃\s*([0-9]+)/);card.mDiscardPlayer=card.mDiscardPlayer||x;card.mSelfDiscard=(card.mSelfDiscard||0)+x;}
    if(has(t,/双方各弃置\s*所有手牌/))card.mDiscardPlayerAll=true;
    if(!card.mDiscardPlayer){let x=num(t,/弃置对方\s*([0-9]+)/);if(x)card.mDiscardPlayer=x;else if(/弃置对方一张|弃置对方1张/.test(t))card.mDiscardPlayer=1;}
    if(!card.mPlayerDrawPenalty){let x=num(t,/对方(?:下回合|每回合)?少摸\s*([0-9]+)/);if(x)card.mPlayerDrawPenalty=x;}
    if(!card.mShield){let x=num(t,/怪物获得\s*([0-9]+)\s*点护盾/);if(x)card.mShield=x;}
    if(!card.mHeal){let x=num(t,/回复\s*([0-9]+)\s*生命/);if(x&&/怪物/.test(t))card.mHeal=x;}
    card._fallbackNormalized=true;
  }
  function complex(card,b){
    if(!card||!card.ruleFallback||!b)return;
    let n=card.name||'',t=card.desc||'';
    // 选择型敌人统一采用随机/优先规则，避免怪物回合被选择框卡住。
    if(n==='望文生义'&&b.hand.length){let i=Math.floor(Math.random()*b.hand.length),ref=b.hand.splice(i,1)[0];G.discardFromHand(ref);b.log.push('📖 望文生义：弃置1张手牌');}
    if(n==='将来时'){b.countdownEffect={turns:3,base:5};b.log.push('⏳ 将来时：3回合后受到5点伤害');}
    if(n==='误译陷阱'&&b.hand.length){let ref=b.hand[Math.floor(Math.random()*b.hand.length)];b.fallbackSelfDamageCard=ref;b.log.push(`🪤 误译陷阱：将【${G.getCardData(ref)?.name||ref}】改为自伤效果`);}
    if(n==='反射'){b.fallbackReflect=true;b.log.push('🪞 反射：本回合下一次受伤将等量反弹');}
    if(n==='聚焦'){b.fallbackDamageDouble=true;b.log.push('🔍 聚焦：下回合双方伤害翻倍');}
    if(n==='置换反应'&&b.hand.length){let i=Math.floor(Math.random()*b.hand.length),ref=b.hand.splice(i,1)[0];G.discardFromHand(ref);let d=G.getCardData(ref),type=d&&d.type==='logic'?'logic':'idea';G.drawCardOfType(type);b.log.push(`🔁 置换反应：弃置【${d?.name||ref}】并补摸${type==='logic'?'逻辑':'思路'}卡`);}
    if(n==='有丝分裂'){let picked=[];for(let i=b.discard.length-1;i>=0;i--){let d=G.getCardData(b.discard[i]);if(d&&d.type==='logic'){picked.push(b.discard.splice(i,1)[0]);}}b.drawPile.push(...picked);G.shuffleInPlace(b.drawPile);G.battleDraw(2);b.log.push(`🧬 有丝分裂：逻辑卡洗回牌库${picked.length}张并摸2张`);}
    if(n==='审题'&&b.hand.length){let i=b.hand.length-1,ref=b.hand.splice(i,1)[0];b.drawPile.push(ref);let d=G.getCardData(ref);if(d&&d.type==='idea'){b.monsterDrawPile=b.monsterDrawPile||[];b.monsterHand.push(...b.monsterDrawPile.splice(0,2));}b.log.push(`📝 审题：将【${d?d.name:ref}】放到牌库底`);}
    if(n==='提取信息'&&b.discard.length){let ref=b.discard.pop();b.exhaust.push(ref);b.log.push(`🔎 提取信息：移除【${G.getCardData(ref)?.name||ref}】`);}
    if(n==='打乱顺序'||n==='时序错乱'){let hand=b.hand.splice(0);hand.sort((a,c)=>(G.getCardData(c)?.cost||0)-(G.getCardData(a)?.cost||0));b.drawPile.unshift(...hand);b.log.push(`🔀 ${n}：将${hand.length}张手牌放回牌库顶`);}
    if(n==='沉淀生成'&&b.discard.length){let a=b.discard.splice(Math.max(0,b.discard.length-3),3);b.exhaust.push(...a);b.log.push(`⚗️ 沉淀生成：移除${a.length}张弃牌`);}
    if(n==='排除法'&&b.discard.length){let a=b.discard.splice(Math.max(0,b.discard.length-2),2);b.exhaust.push(...a);b.log.push(`➗ 排除法：移除${a.length}张弃牌`);}
    if(n==='漏听'){b.nextTurnDrawPenalty=(b.nextTurnDrawPenalty||0)+1;b.log.push('👂 漏听：对方下回合少摸1张牌');}
    if(n==='成分残缺'){b.nextTurnDrawPenalty=(b.nextTurnDrawPenalty||0)+1;b.nextTurnEnergyPenalty=(b.nextTurnEnergyPenalty||0)+1;b.log.push('✂️ 成分残缺：对方下回合少摸1张并少回复1体力');}
    if(n==='梅雨季'){b.globalCostPlus=(b.globalCostPlus||0)+1;b.log.push('🌧️ 梅雨季：本回合玩家卡牌费用+1');}
    if(n==='旱季'){b.nextTurnEnergyPenalty=(b.nextTurnEnergyPenalty||0)+1;b.log.push('☀️ 旱季：对方下回合体力回复-1');}
    if(n==='悬崖'){b.nextPlayerCardCostDouble=true;b.log.push('⛰️ 悬崖：对方下回合第一张牌费用翻倍');}
    if(n==='沼泽'){b.playerUseLifeLoss=(b.playerUseLifeLoss||0)+1;b.log.push('🪵 沼泽：对方本回合每打出一张牌失去1生命');}
    if(n==='摩擦系数'){b.globalCostPlus=(b.globalCostPlus||0)+1;b.extraCostDamage=(b.extraCostDamage||0)+0.5;b.log.push('🧱 摩擦系数：对方本回合费用+1，额外费用转为伤害');}
    if(n==='正论'){b.nextLogicDamagePenalty=(b.nextLogicDamagePenalty||0)+2;b.log.push('📣 正论：对方下一张逻辑卡伤害-2');}
    if(n==='独立事件'){b.nextTakenDamageRandom=true;b.log.push('🎲 独立事件：对方下次受到的伤害随机翻倍或减半');}
    if(n==='倒计时'){b.countdownEffect={turns:5,base:5};b.log.push('⏳ 倒计时：开始5回合倒计时');}
    if(n==='交卷铃响'){let ratio=b.playerHp<(b.playerMaxHp+b.tempMaxHp)*.3?3:1.5;card.mFixedDamage=Math.floor((b.monsterIntelligence+b.monsterEq+b.monsterPhysique)*ratio);b.log.push(`🔔 交卷铃响：准备造成${card.mFixedDamage}点伤害`);}
    if(n==='全能·免疫'){b.monsterImmuneNext=true;b.log.push('🛡️ 全能·免疫：免疫下一次受到的伤害');}
    if(n==='催化·减费'){b.monsterCostReduction=(b.monsterCostReduction||0)+2;b.log.push('⚗️ 催化·减费：高考怪物卡本回合费用-2');}
    if(n==='改朝换代'){let hand=b.hand.splice(0);hand.forEach(ref=>G.discardFromHand(ref));if(b.monsterHand.length)b.monsterDiscard.push(...b.monsterHand.splice(0));b.log.push('🔄 改朝换代：双方弃牌，随后各摸4张');}
    if(n==='舆论导向'){b.playerNextCardSelfDamage=2;b.log.push('📣 舆论导向：对方下一张牌会对自己造成2点伤害');}
    if(n==='学科交叉'){b.fallbackTypeCost={logic:1,idea:0};b.log.push('📚 学科交叉：本回合逻辑卡费用+1');}
    if(n==='偷换概念'&&b.hand.length){let ref=b.hand[Math.floor(Math.random()*b.hand.length)];b.fallbackCostByRef=b.fallbackCostByRef||{};let d=G.getCardData(ref);b.fallbackCostByRef[ref]=3-(d?.cost||0);b.log.push(`🔄 偷换概念：将【${d?.name||ref}】费用改为3`);}
    if(n==='挑语病'&&b.hand.length){let ref=b.hand[Math.floor(Math.random()*b.hand.length)];b.fallbackValueHalf=b.fallbackValueHalf||{};b.fallbackValueHalf[ref]=true;b.log.push(`✍️ 挑语病：削弱【${G.getCardData(ref)?.name||ref}】的数值效果`);}
    if(n==='跑题'){b.fallbackTypeValueHalf='logic';b.log.push('🏃 跑题：本回合逻辑卡效果数值减半');}
    if(n==='定义域'){b.minPlayerCardCost=1;b.log.push('📐 定义域：本回合0费牌无法使用');}
    if(n==='值域'){b.maxPlayerCardCost=3;b.log.push('📏 值域：本回合费用超过3的牌无法使用');}
    if(n==='挖空'&&b.hand.length){let ref=b.hand[Math.floor(Math.random()*b.hand.length)];b.fallbackCostByRef=b.fallbackCostByRef||{};b.fallbackCostByRef[ref]=2;b.fallbackBuryRef=ref;b.log.push(`🕳️ 挖空：提高【${G.getCardData(ref)?.name||ref}】费用`);}
    if(n==='官能团'&&b.hand.length){let ref=b.hand[Math.floor(Math.random()*b.hand.length)];b.fallbackValueHalf=b.fallbackValueHalf||{};b.fallbackValueHalf[ref]=true;b.log.push(`🧪 官能团：削弱【${G.getCardData(ref)?.name||ref}】属性倍率`);}
    if(n==='气候异常'){b.fallbackSeasonAdvance=true;b.log.push('🌦️ 气候异常：季节推进');}
    if(n==='地形优势'){b.fallbackMonsterDamageBonus=2;b.log.push('🏔️ 地形优势：怪物本回合伤害提升');}
    if(n==='综合运用'){b.monsterIntelligence+=4;b.monsterEq+=4;b.log.push('📚 综合运用：怪物智力与情商提升4');}
    if(n==='学科壁垒'){b.fallbackBlockedType='logic';b.log.push('🚧 学科壁垒：本回合逻辑卡无法使用');}
    if(n==='选材'){let picked=b.discard.splice(Math.max(0,b.discard.length-3),3),logic=picked.filter(ref=>G.getCardData(ref)?.type==='logic').length;b.drawPile.push(...picked);G.shuffleInPlace(b.drawPile);card.mFixedDamage=logic*3;b.log.push(`📝 选材：洗回${picked.length}张牌并造成${card.mFixedDamage}点伤害`);}
    if(n==='谋篇布局'){b.fallbackAscendingCost=true;b.log.push('🧩 谋篇布局：本回合需按费用递增出牌');}
    if(n==='长难句分析'){b.fallbackHighCostDisabled=true;b.log.push('📜 长难句分析：下回合高费牌效果无效');}
    if(n==='感应电动势'){b.fallbackFirstCardSelf=true;b.log.push('⚡ 感应电动势：下回合第一张牌反作用于自己');}
    if(n==='全科覆盖'){b.monsterIntelligence+=5;b.monsterEq+=5;b.monsterPhysique+=5;b.log.push('📚 全科覆盖：怪物三项属性各+5');}
    if(n==='题型切换'){let order=['intelligence','eq','physique'],cur=b.monsterMainStat||'intelligence';b.monsterMainStat=order[(order.indexOf(cur)+1)%3];b.monsterNextLogicDmgBonus=(b.monsterNextLogicDmgBonus||0)+0.5;b.log.push('🔁 题型切换：怪物切换主攻属性');}
    if(n==='考点盲区'&&b.hand.length){let ref=b.hand.reduce((a,c)=>(G.getCardData(c)?.cost||0)>(G.getCardData(a)?.cost||0)?c:a,b.hand[0]);b.fallbackCostByRef=b.fallbackCostByRef||{};b.fallbackCostByRef[ref]=2;b.fallbackValueHalf=b.fallbackValueHalf||{};b.fallbackValueHalf[ref]=true;b.log.push(`🌫️ 考点盲区：削弱【${G.getCardData(ref)?.name||ref}】`);}
    if(n==='文综·论述'){card.mFixedDamage=b.hand.length*4;b.log.push(`📖 文综·论述：按手牌数量造成${card.mFixedDamage}点伤害`);}
    if(n==='极值点'&&b.hand.length){let ref=b.hand.reduce((a,c)=>(G.getCardData(c)?.cost||0)>(G.getCardData(a)?.cost||0)?c:a,b.hand[0]);b.fallbackCostByRef=b.fallbackCostByRef||{};b.fallbackCostByRef[ref]=99;b.log.push(`📍 极值点：本回合禁用【${G.getCardData(ref)?.name||ref}】`);}
    if(n==='张裂'&&b.hand.length){let nDrop=Math.ceil(b.hand.length/2),dropped=[];for(let i=0;i<nDrop;i++){let ref=b.hand.splice(Math.floor(Math.random()*b.hand.length),1)[0];dropped.push(ref);G.discardFromHand(ref);}b.log.push(`🪓 张裂：弃置${dropped.length}张手牌`);}
    if(n==='寒流'){b.nextTurnEnergyPenalty=(b.nextTurnEnergyPenalty||0)+1;b.log.push('❄️ 寒流：对方下回合体力回复-1');}
    if(n==='气候异常'&&typeof G.advanceSeason==='function')G.advanceSeason();
    // 仍未映射到专属状态的文字卡，至少将描述中的数值效果转换为标准字段。
  }
  G.monsterPlayCard=function(card){normalize(card);let b=G.state&&G.state.battle,hpBefore=b&&b.playerHp;if(card&&card.ruleFallback&&b){complex(card,b);if(b.fallbackDamageDouble){card._fallbackOldMult=card.dmgMult;card.dmgMult=(card.dmgMult||1)*2;card._fallbackDoubleCard=true;b.fallbackDamageDouble=false;}}let out=oldPlay.call(this,card);if(card&&card._fallbackDoubleCard){card.dmgMult=card._fallbackOldMult;delete card._fallbackOldMult;delete card._fallbackDoubleCard;}if(b&&b.fallbackReflect&&hpBefore>b.playerHp&&!b.over){let reflected=hpBefore-b.playerHp;b.fallbackReflect=false;G.dealMonsterDamage(reflected,'反射');b.log.push(`🪞 反射：将${reflected}点伤害反弹给怪物`);}return out;};

  // 文字卡的限制效果接入统一费用/出牌入口，避免只写日志而不生效。
  const oldCost=G.getCardCost;
  G.getCardCost=function(cd,forPlay){let v=oldCost.call(this,cd,forPlay),b=G.state&&G.state.battle;if(!b||!cd)return v;let ref=cd.ref||cd.id;
    if(b.fallbackCostByRef&&b.fallbackCostByRef[ref]!=null)v=Math.max(0,v+b.fallbackCostByRef[ref]);
    if(b.fallbackTypeCost&&b.fallbackTypeCost[cd.type])v+=b.fallbackTypeCost[cd.type];
    if(b.minPlayerCardCost&&v<b.minPlayerCardCost)v=99;
    if(b.maxPlayerCardCost&&v>b.maxPlayerCardCost)v=99;
    return v;
  };
  const oldCanPlay=G.canPlay;
  G.canPlay=function(cd){let b=G.state&&G.state.battle;if(b&&b.fallbackBlockedType&&cd&&cd.type===b.fallbackBlockedType)return false;return oldCanPlay.call(this,cd);};
  const oldApply=G.applyCardEffect;
  G.applyCardEffect=function(cd){let b=G.state&&G.state.battle;if(!b||!cd)return oldApply.call(this,cd);
    let ref=cd.ref||cd.id;
    if(b.playerNextCardSelfDamage){b.playerNextCardSelfDamage=0;let n=2,old=b.playerHp;b.playerHp=Math.max(0,b.playerHp-n);b.log.push(`📣 ${cd.name}：效果反作用，自己受到${old-b.playerHp}点伤害`);return false;}
    let half=(b.fallbackValueHalf&&b.fallbackValueHalf[ref])||b.fallbackTypeValueHalf===cd.type;
    if(!half)return oldApply.call(this,cd);
    let keys=['dmgMult','shieldMult','fixedShield','healFixed','energyRestore','readingProgress'],saved={};keys.forEach(k=>{if(typeof cd[k]==='number'){saved[k]=cd[k];cd[k]=Math.floor(cd[k]/2);}});
    let out=oldApply.call(this,cd);keys.forEach(k=>{if(saved[k]!=null)cd[k]=saved[k];});return out;
  };
  const oldEndTurn=G.playerEndTurn;
  G.playerEndTurn=function(){let b=G.state&&G.state.battle;
    if(b&&b.countdownEffect){b.countdownEffect.turns--;if(b.countdownEffect.turns<=0){let d=b.countdownEffect.base+(b.turn||0),before=b.playerHp;b.playerHp-=d;G.recordRunDamage('taken',Math.max(0,d));b.log.push(`⏳ 倒计时：造成${d}点伤害（生命${before}→${b.playerHp}）`);b.countdownEffect=null;}}
    if(b){b.fallbackCostByRef=null;b.fallbackValueHalf=null;b.fallbackTypeCost=null;b.fallbackTypeValueHalf=null;b.fallbackBlockedType=null;b.fallbackDamageDouble=false;}
    return oldEndTurn.call(this);
  };
})();
