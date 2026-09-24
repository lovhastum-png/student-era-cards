// 只保存可恢复的结算点。动画、选牌回调进行中保留此前的完整检查点。
(function(){
  let previous='';
  G.autoSaveProgress=function(){
    let s=G.state,b=s&&s.battle;
    if(!s||!s.character||G._eventTestMode||(G.tutorial&&G.tutorial.active))return false;
    if(['menu','charSelect','gameover','victory'].includes(s.screen))return false;
    if(G._choiceOptions||G._pendingCardId||(G._drag&&G._drag.active))return false;
    if(s.screen==='battle'&&b&&(b.phase!=='player'||b.over))return false;
    if(document.querySelector('.start-character-event,.tutorial-cg'))return false;
    try{
      if(s.screen==='shop')s._resumeShopStock=G._shopStock;
      else delete s._resumeShopStock;
      let data=JSON.stringify(s);
      if(data===previous)return true;
      localStorage.setItem(G.RUN_SAVE_KEY,data);previous=data;return true;
    }catch(e){console.error('自动存档失败',e);return false;}
  };
  // 同步交互结束后保存，定时补充捕获异步效果；关闭或切到后台时再保存一次。
  document.addEventListener('click',()=>setTimeout(G.autoSaveProgress,0),true);
  document.addEventListener('pointerup',()=>setTimeout(G.autoSaveProgress,0),true);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)G.autoSaveProgress();});
  window.addEventListener('pagehide',G.autoSaveProgress);
  window.addEventListener('beforeunload',G.autoSaveProgress);
  setInterval(G.autoSaveProgress,1000);
})();
