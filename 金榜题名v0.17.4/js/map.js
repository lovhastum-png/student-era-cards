// map — 地图节点交互：点击节点/休息处/书角阅读/羁绊结算（2026-08-22 由内联脚本拆分）
// 依赖顺序：core → data → battle → map → fx → scenes；共用全局 G，禁止改成模块化 import。

// ==================== MAP LOGIC ====================
G.clickNode = function(nodeId) {
  let s = G.state;
  if(!s.reachableNodes[nodeId] || s.completedNodes[nodeId]) return;
  s.currentNodeId = nodeId;
  let node = G.getNode(nodeId);
  s.completedNodes[nodeId] = true;
  s.reachableNodes[nodeId] = false;

  // Reveal next nodes
  let edges = s.chapterMap.edgeMap[nodeId] || [];
  edges.forEach(nextId => { s.reachableNodes[nextId] = true; });
  // 锁定同一行的其他可达节点：走一条路线后不能回头选兄弟节点
  s.chapterMap.nodes.forEach(m => {
    if(m.id !== nodeId && m.row === node.row && s.reachableNodes[m.id]) s.reachableNodes[m.id] = false;
  });

  // Route to node type
  switch(node.type) {
    case 'battle_tutorial':
    case 'quiz':
    case 'monthly_exam':
    case 'final_exam':
      G.advanceReading(); // 书籍改版：每经历一场战斗节点推进一次阅读进度（2026-08-23）
      G.startBattle(node.monsterId);
      break;
    case 'rest':
      G.doRest();
      break;
    case 'shop':
      G.openShop();
      break;
    case 'partner_select':
      s.partnerNodesVisited = (s.partnerNodesVisited||0) + 1;
      s._partnerNodeResolved = false;
      G.setScreen('partner_select');
      break;
    case 'talent':
      G.setScreen('talent');
      break;
    case 'event':
      G.setScreen('event');
      break;
    case 'deck_view':
      G.setScreen('deck_view');
      break;
    default:
      G.setScreen('map');
  }
};

G.doRest = function() {
  let s = G.state;
  if(G.sfx) G.sfx.play('heal'); // 休息回复音效（2026-08-23）
  let lostHp = s.maxHp - s.hp;
  let heal = Math.floor(s.maxHp * 0.2 + lostHp * 0.2);
  s.hp = Math.min(s.maxHp, s.hp + heal);
  G.showToast(`🏕️ 休息处: 回复 ${heal} 生命`);
  s.screen = 'rest';
  G.render();
};

// ==================== 书籍改版：阅读推进 + 书架（2026-08-23） ====================
// 阅读目标：若已明确选择且未读完则读它；否则默认取最靠前一本已拥有且未读完的书
G.getReadingTarget = function() {
  let s = G.state;
  if(s.readingBook && s.books[s.readingBook] && s.books[s.readingBook].obtained && !s.books[s.readingBook].completed) {
    return s.readingBook;
  }
  for(let bid of G.BOOK_LIST) {
    let b = s.books[bid];
    if(b && b.obtained && !b.completed) return bid;
  }
  return null;
};

// 有效阅读速度 = 初始速度 + 读完每本+2 + 天赋加成 + 交际花每位搭档+5（2026-08-24 肖清雅重做）
G.readSpeedTotal = function() {
  let s = G.state;
  let speed = s.readingSpeed;
  let completedCount = Object.values(s.books).filter(b => b.obtained && b.completed).length;
  speed += completedCount * 2; // 读完成书加成
  if(s._talentReadingBonus) speed += s._talentReadingBonus;
  if(s.star >= 2 && s.character && s.character.stars[2] && s.character.stars[2].passive === 'jiaojihua' && s.partners) {
    speed += 5 * s.partners.length; // 交际花：每位搭档+5
  }
  return speed;
};

// 每经历一场战斗节点推进一次阅读进度（初始阅读速度5，每本读完+2）
G.advanceReading = function() {
  let s = G.state;
  let target = G.getReadingTarget();
  if(!target) return;
  let book = s.books[target];
  if(book.completed) return;
  let speed = G.readSpeedTotal();
  book.progress += speed;
  s.readingBook = target;
  let bDef = G.BOOKS[target];
  if(book.progress >= bDef.need) {
    book.progress = bDef.need;
    book.completed = true;
    s.readingBook = null; // 读完自动切回默认（最靠前未读完）
    G.applyBookReward(bDef);
  } else {
    G.showToast(`📖 阅读《${bDef.name}》+${speed} [${book.progress}/${bDef.need}]`);
  }
  G.render();
};

G.applyBookReward = function(bDef) {
  let s = G.state;
  let rew = bDef.reward || {};
  if(rew.intelligence) s.intelligence += rew.intelligence;
  if(rew.eq) G.gainEq(rew.eq);
  if(rew.physique && !(s.character&&s.character.physiqueLocked)) { s.physique += rew.physique; s.maxHp = s.physique * 5; if(s.hp > s.maxHp) s.hp = s.maxHp; }
  // 书籍卡在书架中解锁并切换携带，不再永久塞入普通卡组。
  if(rew.card && !G.isZhijiaoCard(rew.card)) {
    if(!s.equippedBookCard)s.equippedBookCard=bDef.id;
    G.showToast(`🃏 解锁书籍卡【${(G.getCardData(rew.card)||{}).name || rew.card}】，可在书架携带`);
  }
  G.showToast(`📖 完成阅读《${bDef.name}》！${G.formatReward(rew)}`);
};

// 书架：局外手动选择阅读哪本书（null=不指定，自动默认最靠前）
G.setReadingBook = function(bookId) {
  let s = G.state;
  if(bookId === null) {
    s.readingBook = null;
    G.showToast('📚 已取消指定，自动阅读最靠前书籍');
  } else {
    let b = s.books[bookId];
    if(!b || !b.obtained) { G.showToast('📚 尚未获得这本书'); return; }
    s.readingBook = bookId;
    G.showToast(`📚 正在阅读《${G.BOOKS[bookId].name}》`);
  }
  G.closeModal();
  G.render();
};

G.setEquippedBookCard = function(bookId) {
  let s=G.state;
  if(bookId===null){s.equippedBookCard=null;G.showToast('📕 已卸下书籍卡');G.render();return;}
  let state=s.books&&s.books[bookId],def=G.BOOKS&&G.BOOKS[bookId],ref=def&&def.reward&&def.reward.card;
  if(!state||!state.completed||!ref){G.showToast('📕 这本书尚未解锁可携带的书籍卡');return;}
  s.equippedBookCard=bookId;
  G.showToast(`📕 已携带【${(G.getCardData(ref)||{}).name||ref}】`);
  G.render();
};

// ==================== 小卖部（2026-08-23） ====================
G.openShop = function() {
  let s = G.state;
  s._shopDeleteCount = 0; // 每次进小卖部重置删卡计数（第一张免费）
  s._shopRefreshCount = 0;
  // 新道具系统上线后默认展示商品页，避免玩家误以为小卖部没有更新。
  G._shopTab = 3;
  G._shopStock = G.shopStock();
  G.showToast('🏪 欢迎光临小卖部');
  s.screen = 'shop';
  G.render();
};

// 第一页：回复 20%已损失生命 + 10%最大生命
G.shopHeal = function() {
  let s = G.state;
  let lost = s.maxHp - s.hp;
  let heal = Math.floor(lost * G.SHOP_HEAL_LOST + s.maxHp * G.SHOP_HEAL_MAX);
  s.hp = Math.min(s.maxHp, s.hp + heal);
  G.showToast(`🏪 小卖部: 回复 ${heal} 生命`);
  G.render();
};

// 第二页删卡费用：第n张 = 30×2^(n-2)（n=1免费）
G.shopDeleteCost = function() {
  let n = (G.state._shopDeleteCount || 0) + 1;
  if(n === 1) return 0;
  return G.SHOP_DELETE_BASE * Math.pow(2, n - 2);
};

G.shopDeleteCard = function() {
  let s = G.state;
  if(s.deck.length === 0) { G.showToast('卡组已空'); return; }
  let cost = G.shopDeleteCost();
  if(cost > 0 && s.gold < cost) { G.showToast('💰 零花钱不足'); return; }
  let uniq = [...new Set(s.deck)];
  let html = `<h3 class="paper-title">🗑️ 删除卡牌${cost === 0 ? '（本次免费）' : `（本次花费 ${cost} 零花钱）`}</h3>
    <div class="deck-grid">
      ${uniq.map(cid => {
        let cd = G.getCardData(cid);
        if(!cd) return '';
        let cnt = s.deck.filter(c => c === cid).length;
        return `<div style="cursor:pointer" onclick="G._shopDeleteDo('${cid}')">${G.cardFaceHtml(cd, {count: cnt})}</div>`;
      }).join('')}
    </div>
    <button class="btn" style="width:100%;margin-top:10px" onclick="G.closeModal()">↩ 取消</button>`;
  G.showModal(html, 'paper');
};

G._shopDeleteDo = function(cid) {
  let s = G.state;
  let cost = G.shopDeleteCost();
  if(cost > 0) s.gold -= cost;
  s._shopDeleteCount++;
  let idx = s.deck.indexOf(cid);
  if(idx >= 0) s.deck.splice(idx, 1);
  let base=G.baseId(cid);
  if(!s.deck.some(x=>G.baseId(x)===base) && s.cardItems) delete s.cardItems[base];
  let nm = (G.getCardData(cid) || {}).name || cid;
  G.showToast(cost > 0 ? `🗑️ 删除《${nm}》花费${cost}零花钱` : `🗑️ 免费删除《${nm}》`);
  G.closeModal();
  G.render();
};

// 卡牌与道具品质使用和天赋一致的六学期权重。
G._qualityByChapter = function() {
  return G.pickSemesterQuality(G.QUAL_LADDER);
};

// 生成小卖部四行货架
G.shopStock = function() {
  let s = G.state;
  let stock = { product:[], book:[] };
  // 十二商品版：每格固定由一张卡牌与一个正式道具组成。
  let cardPool = [...new Set([...(s.character.starterDeck||[]), ...(s.character.exclusive || []), 'yuxi','tongxiao','fan_lajitong','chi_binggun'])].map(G.baseId).filter(cid => {
    let d = G.getCardData(cid);
    return d && !G.isZhijiaoCard(cid) && d.type !== 'tool' && !(d.type === 'answer' && s.deck.includes(cid)) && !(s.character&&s.character.physiqueLocked&&G.isPhysiqueRelatedCard(d));
  });
  let offered={};
  for(let i=0;i<12;i++) {
    let candidates=cardPool.filter(cid=>{
      let blocked=new Set([...(s.cardItems?.[cid]||[]), ...(offered[cid]||[])]);
      return Object.keys(G.CARD_ITEMS||{}).some(itemId=>!blocked.has(itemId));
    });
    if(!candidates.length) break;
    let cardId=G.pick(candidates), blocked=new Set([...(s.cardItems?.[cardId]||[]), ...(offered[cardId]||[])]);
    let legalItems=Object.values(G.CARD_ITEMS||{}).filter(x=>!blocked.has(x.id)&&!(s.character&&s.character.physiqueLocked&&G.isPhysiqueRelatedItem(x)));
    let item=G.pickEntryBySemesterQuality(legalItems);
    offered[cardId]=offered[cardId]||[]; offered[cardId].push(item.id);
    let cardDef=G.getCardData(cardId),cardQ=G.rollQuality(cardDef),itemQ=item.q||'green';
    let cardRef=cardDef.qv ? `${cardId}@${cardQ}` : cardId;
    let normal=(G.SHOP_PRICING.card[cardQ]||G.SHOP_PRICING.card.green)+(G.SHOP_PRICING.item[itemQ]||G.SHOP_PRICING.item.green);
    stock.product.push({kind:'product',cardId,cardRef,cardName:cardDef.name,cardQ,itemId:item.id,itemName:item.name,itemQ,itemDesc:item.desc,itemEmoji:item.emoji||'🎒',normalPrice:normal,price:i===0?Math.max(1,Math.floor(normal*.7)):normal,discount:i===0});
  }
  if((s.talents||[]).includes('bundle_sale')&&stock.product.length>=2){
    let pair=stock.product.splice(0,2),normalPrice=pair.reduce((n,p)=>n+p.normalPrice,0);
    stock.product.unshift({kind:'bundle_product',bundleProducts:pair,normalPrice,price:Math.max(1,Math.floor(normalPrice*.7)),discount:true});
  }
  // 书籍仍按原规则独立售卖，不与卡牌道具商品混合。
  let bookPool=G.shuffle(G.BOOK_LIST.filter(bid=>G.BOOKS[bid]&&s.books[bid]&&!s.books[bid].obtained));
  for(let i=0;i<Math.min(3,bookPool.length);i++){
    let id=bookPool[i],b=G.BOOKS[id];
    stock.book.push({kind:'book',id,name:b.name,emoji:b.emoji,q:null,price:150,need:b.need,desc:b.desc});
  }
  return stock;
};

G.shopRefreshCost = function(){ return 10*Math.pow(2,(G.state._shopRefreshCount||0)); };
G.shopRefresh = function(){
  let s=G.state,cost=G.shopRefreshCost();
  if(s.gold<cost){G.showToast('💰 零花钱不足');return;}
  s.gold-=cost; s._shopRefreshCount=(s._shopRefreshCount||0)+1;
  G._shopStock=G.shopStock(); G.showToast(`🔄 刷新商品，花费${cost}零花钱`); G.render();
};

G.shopBuyProduct = function(idx){
  let s=G.state,p=G._shopStock?.product?.[idx]; if(!p)return;
  if(p.bundleProducts){
    if(s.gold<p.price){G.showToast('💰 零花钱不足');return;}
    for(let x of p.bundleProducts)if(G.cardHasItem(x.cardId,x.itemId)){G.showToast(`【${x.cardName}】已拥有【${x.itemName}】，请刷新商品`);return;}
    s.gold-=p.price;s.cardItems=s.cardItems||{};
    for(let x of p.bundleProducts){s.deck.push(x.cardRef);s.cardItems[x.cardId]=s.cardItems[x.cardId]||[];if(s.cardItems[x.cardId].length<3)s.cardItems[x.cardId].push(x.itemId);}
    G._shopStock.product.splice(idx,1);if(G.sfx)G.sfx.play('coin');G.showToast('🎁 【捆绑销售】：两件商品均已获得');G.render();return;
  }
  if((G.getCardData(p.cardId)||{}).type==='tool'){G.showToast('用具卡不能作为小卖部道具商品');return;}
  if(G.isZhijiaoCard(p.cardId)){G.showToast('至交专属卡无法从小卖部获取');return;}
  if(s.gold<p.price){G.showToast('💰 零花钱不足');return;}
  if(G.cardHasItem(p.cardId,p.itemId)){G.showToast('该卡已经拥有这个道具，请刷新商品');return;}
  let ownedItems=(s.cardItems&&s.cardItems[p.cardId])||[];
  if(ownedItems.length>=3){ G.openShopReplaceProduct(idx,p); return; }
  s.gold-=p.price; s.deck.push(p.cardRef);
  s.cardItems=s.cardItems||{}; s.cardItems[p.cardId]=s.cardItems[p.cardId]||[]; s.cardItems[p.cardId].push(p.itemId);
  G._shopStock.product.splice(idx,1);
  if(G.sfx)G.sfx.play('coin');
  G.showToast(`🛒 获得「${p.cardName}」并添加「${p.itemName}」`); G.render();
};

// 道具上限为每种卡牌3个；满格时购买商品进入替换流程。
G.openShopReplaceProduct=function(idx,p){
  let s=G.state,owned=[...(s.cardItems&&s.cardItems[p.cardId]||[])].slice(0,3),cd=G.getCardData(p.cardId);
  if(!cd||owned.length<3){G.showToast('这张牌还没有达到道具上限');return;}
  let itemHtml=owned.map(id=>{let it=G.CARD_ITEMS[id];return `<span class="shop-replace-owned" title="${it?(it.name+'：'+it.desc):id}">${it?(it.emoji||'🎒'):'🎒'}<small>${it?it.name:id}</small></span>`}).join('');
  G._shopReplacePending={idx,cardId:p.cardId,itemId:p.itemId};
  G.showModal(`<h3 style="text-align:center;color:#e0a040">🛒 选择替换目标</h3><div class="shop-replace-card-row"><div class="shop-replace-card">${G.cardFaceHtml(cd,{cls:'shop-mini-card'})}</div><div class="shop-replace-items"><div class="shop-replace-new">新道具：${p.itemEmoji}【${p.itemName}】</div>${itemHtml}</div></div><p style="text-align:center;font-size:11px;color:#765f3d">替换后返还被替换道具价格的50%</p><div style="display:flex;gap:8px;justify-content:center"><button type="button" class="btn" onclick="event.stopPropagation();G.cancelShopReplace()">取消</button><button type="button" class="btn primary" onclick="event.stopPropagation();G.openShopReplaceChoices(${idx})">继续选择</button></div>`,'paper');
};
G.cancelShopReplace=function(){
  G._shopReplacePending=null;
  G.closeModal();
  // 明确回到小卖部，不触发购买、不扣除零花钱、不替换道具。
  G.render();
};
G.openShopReplaceChoices=function(idx){
  let p=G._shopStock&&G._shopStock.product&&G._shopStock.product[idx],s=G.state;if(!p)return;
  let owned=[...(s.cardItems&&s.cardItems[p.cardId]||[])].slice(0,3);
  if(owned.length<3){G.closeModal();G.showToast('该卡的道具数量已变化，请重新查看商品');G.render();return;}
  // 先关闭上一层替换确认框，否则两个相同ID的弹窗叠加，关闭时会残留后一个弹窗。
  G.closeModal();
  G.showModal(`<h3 style="text-align:center;color:#e0a040">选择要替换的道具</h3><div class="shop-replace-choice-list">${owned.map(id=>{let it=G.CARD_ITEMS[id]||{id,name:id,emoji:'🎒',desc:'暂无描述'},refund=Math.floor((G.SHOP_PRICING.item[it.q]||40)*.5);return `<button type="button" class="shop-replace-choice" title="${it.name}：${it.desc}" onclick="event.stopPropagation();G.confirmShopReplace(${idx},'${String(id).replace(/'/g,"\\'")}')"><span>${it.emoji||'🎒'}</span><span><b>${it.name}</b><small>${G.decorateKeywords(it.desc||'无效果')}</small></span><i>返还${refund}零花钱</i></button>`}).join('')}</div><button type="button" class="btn" style="width:100%;margin-top:10px" onclick="event.stopPropagation();G.cancelShopReplace()">取消</button>`,'paper');
};
G.confirmShopReplace=function(idx,replaceId){
  let s=G.state,p=G._shopStock&&G._shopStock.product&&G._shopStock.product[idx];if(!p)return;
  let owned=(s.cardItems&&s.cardItems[p.cardId])||[],at=owned.indexOf(replaceId);if(at<0){G.closeModal();G.showToast('该道具已发生变化，请重新查看商品');G.render();return;}
  if(s.gold<p.price){G.closeModal();G.showToast('💰 零花钱不足');return;}
  let old=G.CARD_ITEMS[replaceId],refund=Math.floor((G.SHOP_PRICING.item[(old&&old.q)||'green']||40)*.5);
  s.gold-=p.price;s.gold+=refund;s.deck.push(p.cardRef);s.cardItems[p.cardId]=owned.filter((_,i)=>i!==at);s.cardItems[p.cardId].push(p.itemId);G._shopStock.product.splice(idx,1);G._shopReplacePending=null;G.closeModal();if(G.sfx)G.sfx.play('coin');G.showToast(`🛒 获得「${p.cardName}」，替换「${old?old.name:replaceId}」，返还${refund}零花钱`);G.render();
};

G.shopBuy = function(cat, idx) {
  let s = G.state;
  let it = (G._shopStock[cat] || [])[idx];
  if(!it) return;
  if(s.gold < it.price) { G.showToast('💰 零花钱不足'); return; }
  if(cat === 'item') { G.shopBuyCardItem(idx, it); return; }
  s.gold -= it.price;
  let grant = function(x) {
    if(cat === 'card' && !G.isZhijiaoCard(x.cardId||x.id)) s.deck.push(x.cardId || x.id);
    else if(cat === 'book') {
      s.books[x.id].obtained = true;
      if(s.readingBook && (!s.books[s.readingBook].obtained || s.books[s.readingBook].completed)) s.readingBook = null;
    } else if(cat === 'talent' && !s.talents.includes(x.id)) s.talents.push(x.id);
  };
  if(it.bundle) it.bundle.forEach(grant); else grant(it);
  G.showToast(`🛒 购入「${it.name}」${it.price}零花钱`);
  if(G.sfx) G.sfx.play('coin'); // 购买音效（2026-08-23）
  G._shopStock[cat].splice(idx, 1);
  G.render();
};

// 购买卡牌道具：先选卡，确认绑定后再扣款。同名卡共享绑定，同一道具不可重复。
G.shopBuyCardItem = function(stockIndex, stockItem) {
  let s=G.state, items=(stockItem.bundle||[stockItem]).map(x=>G.CARD_ITEMS[x.id]).filter(Boolean);
  if(!items.length) { G.showToast('该道具数据不存在'); return; }
  let unique=[...new Set(s.deck.map(G.baseId))].filter(cid=>{
    let cd=G.CARDS[cid];
    if(!cd||cd.type==='tool')return false;
    let owned=(s.cardItems&&s.cardItems[cid])||[];
    return items.every(item=>!owned.includes(item.id));
  });
  if(!unique.length) { G.showToast('卡组中没有可以添加该道具的卡牌'); return; }
  G.showChoiceModal(`🎒 为哪张卡牌添加「${stockItem.name}」？`,unique.map(cid=>{
    let cd=G.getCardData(cid), existing=((s.cardItems||{})[cid]||[]).map(id=>G.CARD_ITEMS[id]?.name||id);
    return {text:cd.name,sub:`${cd.desc}${existing.length?'\n已有道具：'+existing.join('、'):''}`,cb:()=>{
      if(s.gold<stockItem.price){G.showToast('💰 零花钱不足');return;}
      s.gold-=stockItem.price;
      s.cardItems=s.cardItems||{}; s.cardItems[cid]=s.cardItems[cid]||[];
      items.forEach(item=>{if(!s.cardItems[cid].includes(item.id)&&s.cardItems[cid].length<3)s.cardItems[cid].push(item.id);});
      G._shopStock.item.splice(stockIndex,1);
      if(G.sfx)G.sfx.play('coin');
      G.showToast(`🎒 ${stockItem.name}已添加至「${cd.name}」`);
    }};
  }));
};

// ==================== BOOK CORNER ====================
G.getBookCornerOptions = function() {
  let s = G.state;
  let options = [];
  // Slot 1: currently reading book (if any)
  let readingBook = null;
  if(s.readingBook && !s.books[s.readingBook].completed) {
    readingBook = G.BOOKS[s.readingBook];
    options.push({book:readingBook, isReading:true});
  }

  // Other slots: random books not completed
  let available = G.BOOK_LIST.filter(bid =>
    !s.books[bid].completed && bid !== s.readingBook
  );
  G.shuffleInPlace(available);
  let totalSlots = readingBook ? 4 : 3; // First visit: 3 choices; later: 4
  let needed = totalSlots - options.length;
  for(let i=0;i<Math.min(needed, available.length);i++) {
    options.push({book:G.BOOKS[available[i]], isReading:false});
  }
  return options;
};

G.doReading = function(bookId) {
  let s = G.state;
  if(s._bookCornerDone) return; // 每次图书角只能阅读一次
  s._bookCornerDone = true;

  let speed = G.readSpeedTotal();
  // Apply event bonus (one-time)
  if(s._eventReadingBonus) { speed += s._eventReadingBonus; s._eventReadingBonus = 0; }

  let book = s.books[bookId];
  if(!book.completed) {
    book.progress += speed;
    s.readingBook = bookId;
    let bDef = G.BOOKS[bookId];
    if(book.progress >= bDef.need) {
      book.completed = true;
      book.progress = bDef.need;
      s.readingBook = null;
      // Apply rewards
      let rew = bDef.reward;
      if(rew.intelligence) s.intelligence += rew.intelligence;
      if(rew.eq) G.gainEq(rew.eq);
      if(rew.physique && !(s.character&&s.character.physiqueLocked)) { s.physique += rew.physique; s.maxHp = s.physique * 5; }
      if(rew.card&&!G.isZhijiaoCard(rew.card)){if(!s.equippedBookCard)s.equippedBookCard=bookId;G.showToast(`🃏 解锁书籍卡【${(G.getCardData(rew.card)||{}).name||rew.card}】，可在书架携带`);}
      G.showToast(`📖 完成阅读《${bDef.name}》！${G.formatReward(rew)}`);
    } else {
      G.showToast(`📖 阅读《${bDef.name}》+${speed} 进度 [${book.progress}/${bDef.need}]`);
    }
  }
  G.render();
};

G.formatReward = function(rew) {
  let parts = [];
  if(rew.intelligence) parts.push(`智力+${rew.intelligence}`);
  if(rew.eq) parts.push(`情商+${rew.eq}`);
  if(rew.physique) parts.push(`体魄+${rew.physique}`);
  if(rew.card) parts.push(`卡牌【${(G.getCardData(rew.card)||{}).name || rew.card}】`);
  return parts.join('，');
};

G.checkBond = function(category) {
  let s = G.state;
  let bond = Object.values(G.BONDS).find(b => b.id === category);
  if(!bond) return;
  let completed = bond.books.filter(bid => s.books[bid] && s.books[bid].completed).length;
  s.bondProgress[category] = completed;
  if(completed >= bond.books.length && !s.activeBonds[category]) {
    s.activeBonds[category] = true;
    G.showToast(`🎉 羁绊激活: ${bond.name} — ${bond.effect}`);
  }
};

G.applyBondBattleStart = function() {
  let s = G.state;
  if(s.activeBonds.five_classics) {
    let extraDraw = 1;
    G.battleDraw(extraDraw);
  }
};
