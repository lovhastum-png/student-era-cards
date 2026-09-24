// 鹅城百科：局外收集记录
(function(){
  const P=[['basic','基础'],['trait','词条'],['status','状态'],['card','卡牌'],['talent','天赋'],['event','事件'],['monster','怪物']];
  const KEY='xueshidai_codex_v1';
  G._codexCat='basic';G._codexSelected=null;
  const today=()=>{let d=new Date();return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;};
  function db(){G.meta=G.meta||{};G.meta.codex=G.meta.codex||{records:{},lottery:{none:0,one:0,two:0,three:0,four:0,five:0,six:0}};G.meta.codex.records=G.meta.codex.records||{};G.meta.codex.lottery=Object.assign({none:0,one:0,two:0,three:0,four:0,five:0,six:0},G.meta.codex.lottery||{});return G.meta.codex;}
  function mark(cat,id,field){if(!id)return;let d=db(),k=cat+':'+id,r=d.records[k];if(!r)r=d.records[k]={firstDate:today(),seen:0,obtained:0,defeated:0};r.seen++;if(field)r[field]++;if(G.saveMeta)G.saveMeta();}
  G.codexMark=mark;
  G.codexRecordLottery=function(hit){let k=['none','one','two','three','four','five','six'][Math.max(0,Math.min(6,Number(hit)||0))];let d=db();d.lottery[k]++;if(G.saveMeta)G.saveMeta();};
  const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const bid=id=>G.baseId?G.baseId(id):String(id||'').split('@')[0].split('#')[0];
  function entries(cat){
    if(cat==='basic')return Object.keys(G.CHARACTERS||{}).map(id=>({id,data:G.CHARACTERS[id]}));
    if(cat==='card')return Object.keys(G.CARDS||{}).map(id=>({id,data:G.CARDS[id]}));
    if(cat==='talent')return Object.keys(G.TALENTS||{}).map(id=>({id,data:G.TALENTS[id]}));
    if(cat==='event')return Object.keys(G.EVENTS||{}).map(id=>({id,data:G.EVENTS[id]}));
    if(cat==='monster')return Object.keys(G.MONSTERS||{}).map(id=>({id,data:G.MONSTERS[id]}));
    if(cat==='status'){let x=G.STATUS_TIPS||{};return Object.keys(x).map(id=>({id,data:{name:id,desc:x[id]}}));}
    let names=Object.assign({},G.WEAK_NAMES||{},{如初:'如初',保留:'保留',脱手:'脱手',临时:'临时',闪:'闪',回响:'回响',沉默:'沉默',移除:'移除',已变更:'已变更',消耗:'消耗',充能:'充能',摸底:'摸底'}),tips=G.STATUS_TIPS||{};return Object.keys(names).map(id=>({id,data:{name:names[id],desc:tips[id]||'该词条的效果会在拥有它的卡牌或系统中生效。'}}));
  }
  function known(cat,id){let r=db().records[cat+':'+id],s=G.state||{};if(r&&(r.seen||r.obtained||r.defeated))return r;if(cat==='basic'&&s.character&&s.character.id===id)return {firstDate:today(),seen:1};if(cat==='card'&&(s.deck||[]).some(x=>bid(x)===id))return {firstDate:today(),seen:1,obtained:1};if(cat==='talent'&&(s.talents||[]).includes(id))return {firstDate:today(),seen:1,obtained:1};return null;}
  function sync(){let s=G.state||{};if(s.character){let k='basic:'+s.character.id;if(!db().records[k])mark('basic',s.character.id,'obtained');} [...new Set((s.deck||[]).map(bid))].forEach(id=>{if(G.CARDS&&G.CARDS[id]&&!db().records['card:'+id])mark('card',id,'obtained');});[...new Set(s.talents||[])].forEach(id=>{if(G.TALENTS&&G.TALENTS[id]&&!db().records['talent:'+id])mark('talent',id,'obtained');});}
  G.openEncyclopedia=function(){G._codexCat='basic';G._codexSelected=entries('basic')[0]?.id||null;G.state.screen='encyclopedia';G.render();};
  G.codexCategory=function(id){G._codexCat=id;G._codexSelected=entries(id)[0]?.id||null;G.render();};G.codexSelect=function(id){G._codexSelected=id;G.render();};
  G.renderEncyclopedia=function(main,bot){sync();let cat=G._codexCat,a=entries(cat),x=a.find(v=>v.id===G._codexSelected)||a[0],r=x&&known(cat,x.id),d=x&&x.data,lock=!r,name=lock?'？':(d&&(d.name||d.title)||x?.id||'？'),desc=lock?'尚未遇见，继续探索即可解锁。':(d&&(d.desc||d.description||d.text)||'暂无详细记录');let extra='';if(cat==='basic'&&!lock)extra=`<p>体魄：${d.physique??'—'}　智力：${d.intelligence??'—'}　情商：${d.eq??'—'}</p><p>${esc(d.style||'')}</p>`;if(cat==='card'&&!lock)extra=`<p>类型：${esc(({logic:'逻辑卡',idea:'思路卡',answer:'解答卡',tool:'用具卡',trap:'陷阱卡'}[d.type]||d.type||'卡牌'))}　消耗：${d.cost??'—'}</p>`;if(cat==='monster'&&!lock)extra=`<p>生命：${d.hp??'—'}　体魄：${d.physique||0}　智力：${d.intelligence||0}　情商：${d.eq||0}</p><p>天赋：${d.talent?`【${esc(d.talent)}】`:'无'}</p>`;if(cat==='event'&&x?.id==='lottery'){let l=db().lottery;extra=`<div class="codex-lottery"><b>大乐透中奖次数</b><p>未中奖 ${l.none}　命中1位 ${l.one}　命中2位 ${l.two}</p><p>命中3位 ${l.three}　命中4位 ${l.four}</p><p>命中5位 ${l.five}　头奖 ${l.six}</p></div>`;}let info=lock?'尚未发现':`第一次记录：${r.firstDate}<br>遇到/记录：${r.seen||0}次${r.obtained?`<br>获得：${r.obtained}次`:''}${cat==='monster'?`<br>击败：${r.defeated||0}次`:''}`;main.className='encyclopedia-mode';main.innerHTML=`<div class="codex-page"><div class="codex-top"><button class="codex-back" onclick="G.setScreen('menu')">返回</button><div class="codex-title">鹅城百科</div><div class="codex-pages">${P.map(v=>`<button class="codex-page-tab ${cat===v[0]?'active':''}" onclick="G.codexCategory('${v[0]}')">${v[1]}</button>`).join('')}</div></div><div class="codex-body"><section class="codex-list">${a.length?a.map(v=>{let q=known(cat,v.id),n=q?(v.data.name||v.data.title||v.id):'？';return `<button class="codex-item ${q?'known':'unknown'} ${v.id===G._codexSelected?'selected':''}" onclick="G.codexSelect('${String(v.id).replace(/'/g,"\\'")}')"><span class="codex-art">${q?(v.data.emoji||''):'?'}</span><b>${esc(n)}</b></button>`}).join(''):'<div class="codex-none">暂无条目</div>'}</section><aside class="codex-detail ${lock?'locked':''}"><h1>${esc(name)}</h1><div class="codex-detail-line">${info}</div><div class="codex-detail-desc">${esc(desc)}</div>${extra}</aside></div></div>`;bot.innerHTML='';};
  function wrap(name,fn){if(!G[name]||G[name]._codexWrapped)return;let old=G[name],w=function(){fn.apply(this,arguments);return old.apply(this,arguments);};w._codexWrapped=true;G[name]=w;}
  wrap('resetRun',id=>mark('basic',id,'obtained'));wrap('startBattle',id=>mark('monster',id));wrap('openCommonEventFrame',ev=>{if(ev&&ev.id)mark('event',ev.id);});wrap('showLotteryResults',()=>{let r=G.state?.lastLotteryResult;(r?.results||[]).forEach(x=>G.codexRecordLottery(x.hit));});wrap('endBattle',()=>{let b=G.state?.battle;if(b?.won)mark('monster',b.monsterId,'defeated');});
})();
// 兼容无 id 字段的事件定义（例如大乐透）
(function(){
  if(!G.openCommonEventFrame||G.openCommonEventFrame._codexIdWrapped)return;
  let old=G.openCommonEventFrame;
  let w=function(ev){if(ev){let hit=Object.entries(G.EVENTS||{}).find(x=>x[1]===ev);if(hit&&G.codexMark)G.codexMark('event',hit[0]);}return old.apply(this,arguments);};
  w._codexIdWrapped=true;G.openCommonEventFrame=w;
})();
// 将已有素材显示到百科条目中；没有对应素材时保留空白占位。
(function(){
  if(!G.renderEncyclopedia||G.renderEncyclopedia._codexArtWrapped)return;
  let old=G.renderEncyclopedia;
  let w=function(main,bot){
    old.apply(this,arguments);
    let cat=G._codexCat||'basic';
    let name=cat==='basic'?'CHARACTERS':cat==='card'?'CARDS':cat==='talent'?'TALENTS':cat==='event'?'EVENTS':cat==='monster'?'MONSTERS':null;
    let ids=name?Object.keys(G[name]||{}):[];
    document.querySelectorAll('.codex-item').forEach((el,i)=>{let id=ids[i],d=id&&(G[name]||{})[id],src=d&&(d.art||d.image||d.illustration||d.portrait),box=el.querySelector('.codex-art');if(src&&box){box.textContent='';let im=document.createElement('img');im.src=src;im.alt='';im.onerror=()=>im.remove();box.appendChild(im);}});
  };
  w._codexArtWrapped=true;G.renderEncyclopedia=w;
})();
