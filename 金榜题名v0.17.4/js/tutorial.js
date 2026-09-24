// 小蕾首次入学教程：严格的状态机控制选角、地图与前两回合操作。
(function(){
  // v2：废弃此前测试阶段的完成标记，让制作人可重新从首次询问开始验收。
  const SEEN='xueshidai_xiaolei_tutorial_seen_v3';
  try{localStorage.removeItem('xueshidai_xiaolei_tutorial_seen_v1');localStorage.removeItem('xueshidai_xiaolei_tutorial_seen_v2');}catch(e){}
  G.resetXiaoleiTutorialProgress=function(){
    try{localStorage.removeItem(SEEN);}catch(e){}
    G.tutorial={active:false,phase:'',blankPage:0};
    return true;
  };
  G.tutorial={active:false,phase:'',blankPage:0};
  const q=s=>typeof document!=='undefined'?document.querySelector(s):null;
  // 遮罩只负责视觉变暗；捕获阶段仅放行当前高亮目标、教程框和设置界面。
  document.addEventListener('click',function(e){
    if(!G.tutorial.active) return;
    let allowed=e.target&&e.target.closest&&e.target.closest('.tutorial-target,.tutorial-card-target,.tutorial-talk,.tutorial-event,.tutorial-cg,.start-character-event,.te-fullscreen,#settingsToggle,#settingsOverlay');
    if(!allowed){e.preventDefault();e.stopPropagation();}
  },true);
  function clearGuide(){ ['tutorialDim','tutorialTalk','tutorialEvent','tutorialCg'].forEach(id=>{let e=document.getElementById(id);if(e)e.remove();}); document.body.classList.remove('tutorial-active'); document.querySelectorAll('.tutorial-hand').forEach(e=>e.remove()); document.querySelectorAll('.tutorial-target').forEach(e=>e.classList.remove('tutorial-target')); document.querySelectorAll('.tutorial-card-target').forEach(e=>e.classList.remove('tutorial-card-target')); }
  function target(sel){
    document.querySelectorAll('.tutorial-hand').forEach(e=>e.remove());document.querySelectorAll('.tutorial-target').forEach(e=>e.classList.remove('tutorial-target'));document.querySelectorAll('.tutorial-card-target').forEach(e=>e.classList.remove('tutorial-card-target'));
    let e=sel&&q(sel);if(!e)return null;e.classList.add(sel.indexOf('#bcard-')===0?'tutorial-card-target':'tutorial-target');
    if(sel==='.start-follow-btn'||sel==='#node-start'){let hand=document.createElement('span');hand.className='tutorial-hand';hand.textContent='👇';e.appendChild(hand);}
    if(sel.indexOf('#bcard-')===0){let index=parseInt(sel.slice(7),10);e.onclick=function(){if(G.fx&&G.fx.cardFlyout)G.fx.cardFlyout(e);let zone=document.getElementById('playZone');if(zone){zone.classList.add('zone-flash');setTimeout(()=>zone.classList.remove('zone-flash'),450);}G.playCard(index);};}
    return e;
  }
  G.tutorialTalk=function(text,side,next,sel,audio){
    clearGuide(); document.body.classList.add('tutorial-active');
    let dim=document.createElement('div');dim.id='tutorialDim';dim.className='tutorial-dim';document.body.appendChild(dim);
    let talk=document.createElement('div');talk.id='tutorialTalk';talk.className='tutorial-talk '+(side||'bottom');
    talk.innerHTML='<img src="立绘/薛诗蕾.png" alt="小蕾"><div class="tutorial-talk-box"><div class="tutorial-talk-name">小蕾</div><div class="tutorial-talk-text"></div></div>';
    talk.querySelector('.tutorial-talk-text').textContent=text||''; if(G.playDialogueVoice)G.playDialogueVoice(audio||(G.dialogueVoiceFor?G.dialogueVoiceFor(text||''):'')); talk.onclick=()=>{if(next)next();}; document.body.appendChild(talk); target(sel);
  };
  G.tutorialEvent=function(text,button,onPick){ clearGuide(); document.body.classList.add('tutorial-active'); let e=document.createElement('div');e.id='tutorialEvent';e.className='tutorial-event';e.innerHTML='<div class="tutorial-event-card"><div class="tutorial-event-text"></div><button class="btn primary tutorial-event-option"></button></div>';e.querySelector('.tutorial-event-text').textContent=text||'';e.querySelector('button').textContent=button;e.querySelector('button').onclick=onPick;document.body.appendChild(e); };
  G.tutorialXiaoleiEvent=function(text,button,onPick){
    clearGuide();document.body.classList.add('tutorial-active');
    G._openFullscreen('<div class="te-holes"><i></i><i></i><i></i></div><div class="te-top">🎬 小蕾事件</div><div class="te-name">薛诗蕾 · 有话要说</div><div class="te-narr" id="te-narr"></div><div id="te-opts"><button class="te-opt" id="tutorialXiaoleiOpt"></button></div><img class="te-ava" src="立绘/薛诗蕾Q版.jpg" alt="小蕾">');
    let frame=document.querySelector('.te-fullscreen:last-of-type');if(frame)frame.classList.add('xiaolei-special-frame');
    let narr=document.getElementById('te-narr'),b=document.getElementById('tutorialXiaoleiOpt'),opts=document.getElementById('te-opts');b.textContent=button;b.onclick=()=>{G._closeFullscreen();onPick();};
    let segs=(Array.isArray(text)?text:String(text||'').split(/\n\s*\n/)).slice(0,3);narr.innerHTML='<div class="xiaolei-segment-grid"><div class="xiaolei-segment"></div><div class="xiaolei-segment"></div><div class="xiaolei-segment"></div></div>';let boxes=[...narr.querySelectorAll('.xiaolei-segment')],si=0,ci=0,timer=null,done=false;opts.style.display='none';
    function finish(){if(timer)clearTimeout(timer);segs.forEach((x,i)=>{boxes[i].textContent=typeof x==='object'?(x.text||''):x;boxes[i].classList.toggle('visible',!!boxes[i].textContent);});done=true;opts.style.display='grid';}
    function type(){if(si>=segs.length){finish();return;}let row=segs[si],full=typeof row==='object'?(row.text||''):String(row||'');if(ci===0)boxes[si].classList.add('visible');boxes[si].textContent=full.slice(0,ci++);if(ci<=full.length)timer=setTimeout(type,24);else{si++;ci=0;timer=setTimeout(type,420);}}
    narr.onclick=()=>{if(!done)finish();};if(segs.some(x=>typeof x==='object'?x.text:x))type();else finish();
  };
  G.showCgEvent=function(id){
    clearGuide();let d=(G.CG_EVENTS||{})[id];if(!d)return;let lines=(d.dialogue||[]).map(x=>typeof x==='object'?x:{text:String(x)}),i=0,log=[];
    // 修复（2026-09-08）：对话为空的CG（如教程奖励占位CG）不再立即关闭，
    // 保留画面与「点击继续」提示，等待正式文案补入。
    if(!lines.length) lines=[{text:''}];
    let e=document.createElement('div');e.id='tutorialCg';e.className='tutorial-cg avg-cg';e.innerHTML='<img class="avg-bg"><div class="avg-ui"><div class="avg-name"></div><div class="tutorial-cg-caption avg-text"></div><div class="avg-hint">点击/任意键继续 · H隐藏UI · L日志</div></div><div class="avg-log" style="display:none"><h3>对话日志</h3><div></div></div>';
    e.querySelector('.avg-bg').src=d.image||'';let ui=e.querySelector('.avg-ui'),lp=e.querySelector('.avg-log'),closed=false;
    function close(){if(closed)return;closed=true;document.removeEventListener('keydown',key);e.remove();document.body.classList.remove('tutorial-active');if(G.playDialogueVoice)G.playDialogueVoice('');}
    function paint(){if(i>=lines.length){close();return;}let x=lines[i]||{};e.querySelector('.avg-name').textContent=x.speaker||d.speaker||((G.CHARACTERS[d.character]||{}).name||'');e.querySelector('.avg-text').textContent=x.text||'';log.push(x);lp.querySelector('div').innerHTML=log.map(v=>'<p><b>'+G.esc(v.speaker||d.speaker||'')+'</b> '+G.esc(v.text||'')+'</p>').join('');if(G.playDialogueVoice)G.playDialogueVoice(x.audio||(G.dialogueVoiceFor?G.dialogueVoiceFor(x.text||''):''));}
    function next(){if(lp.style.display!=='none')return;i++;paint();} function key(ev){if(ev.key.toLowerCase()==='h'){ui.style.display=ui.style.display==='none'?'':'none';ev.preventDefault();return;}if(ev.key.toLowerCase()==='l'){lp.style.display=lp.style.display==='none'?'':'none';ev.preventDefault();return;}next();}
    e.onclick=function(ev){if(ev.target.closest('.avg-log'))return;next();};document.addEventListener('keydown',key);if(d.music){let a=document.createElement('audio');a.src=d.music;a.autoplay=true;a.loop=!!d.loopMusic;e.appendChild(a);}document.body.appendChild(e);document.body.classList.add('tutorial-active');paint();
  };
  G.startNewGameFlow=function(){
    let seen=false;try{seen=localStorage.getItem(SEEN)==='1';}catch(e){}
    if(seen){G.setScreen('charSelect');return;}
    let e=document.createElement('div');e.id='tutorialEvent';e.className='tutorial-event';e.innerHTML='<div class="tutorial-event-card"><div><h2>是否跳过小蕾的新手教程？</h2><p>以后也可以在设置中调整“跳过新手教程”。</p></div><div style="display:flex;gap:12px"><button class="btn">跳过教程</button><button class="btn primary">不跳过</button></div></div>';
    let bs=e.querySelectorAll('button');bs[0].onclick=()=>{try{localStorage.setItem(SEEN,'1')}catch(x){}e.remove();G.setScreen('charSelect');};bs[1].onclick=()=>{e.remove();G.beginXiaoleiTutorial();};document.body.appendChild(e);
  };
  G.beginXiaoleiTutorial=function(){ G.tutorial={active:true,phase:'char_blank',blankPage:1};G._selCharId='xueshilei';G._selectedStar=1;G.setScreen('charSelect');G.showTutorialBlank(); };
  G.showTutorialBlank=function(){ G.tutorialTalk('','bottom',()=>{G.tutorial.blankPage++;if(G.tutorial.blankPage<3)G.showTutorialBlank();else{G.tutorial.phase='char_start';G.showTutorialStart();}}); };
  G.showTutorialStart=function(){
    G.tutorialTalk('点这里开始学习。','right',null,'.start-follow-btn');
    let btn=q('.start-follow-btn'), talk=document.getElementById('tutorialTalk');
    if(btn&&talk){
      let r=btn.getBoundingClientRect(), vw=window.innerWidth||document.documentElement.clientWidth||1280;
      talk.classList.add('start-tip');
      talk.style.left=Math.max(8,Math.min(r.right+12,vw-380))+'px';
      talk.style.top=Math.max(8,r.top-108)+'px';
      talk.style.right='auto';talk.style.bottom='auto';talk.style.transform='none';
    }
  };
  G.tutorialExitToMenu=function(){ clearGuide();G.tutorial={active:false,phase:'',blankPage:0};G.clearRunSave();G.state.battle=null;G.state.character=null;G.closeSettings();G.state.screen='menu';G.render(); };

  const reset=G.resetRun;
  G.resetRun=function(id,star){
    if(G.tutorial.active){if(G.tutorial.phase!=='char_start'||id!=='xueshilei')return;let old=G.settings.skipTutorial;G.settings.skipTutorial=false;reset(id,star);G.settings.skipTutorial=old;G.showCharacterStartEvent(id,()=>{G.tutorial.phase='map_node';clearGuide();G.render();let n=q('#node-start');if(n)n.onclick=e=>{if(e)e.stopPropagation();G.clickNode('start');};G.tutorialTalk('点这里开始哦。','right',null,'#node-start');});return;}
    let result=reset(id,star);G.showCharacterStartEvent(id);return result;
  };
  const clickNode=G.clickNode;
  G.clickNode=function(id){ if(G.tutorial.active&&G.tutorial.phase!=='map_node')return;if(G.tutorial.active&&id!=='start')return;let r=clickNode(id);if(G.tutorial.active){G.prepareTutorialBattle();}return r; };
  G.prepareTutorialBattle=function(){let b=G.state.battle;if(!b)return;b.hand=['sisuo','shuati'];b.drawPile=[];b.discard=[];b.energy=b.maxEnergy;G.tutorial.phase='battle_intro';G.render();G.tutorialTalk('让我们先从简单的开始吧。','left',()=>{G.tutorial.phase='play_sisuo';G.tutorialTalk('思路卡可以让你在考试拥有不同的发挥，试试看打出思索，为自己添加“理性”。','left',null,'#bcard-'+b.hand.indexOf('sisuo'));});};
  const play=G.playCard;
  G.playCard=function(i){let b=G.state.battle;if(G.tutorial.active){let id=b&&b.hand[i],need=G.tutorial.phase==='play_sisuo'?'sisuo':(G.tutorial.phase==='play_shuati1'||G.tutorial.phase==='play_shuati2'?'shuati':null);if(!need||id!==need)return;}let id=b&&b.hand[i],r=play(i);if(G.tutorial.active){if(id==='sisuo'){G.tutorial.phase='praise1';G.tutorialTalk('干得漂亮。','left',()=>{G.tutorial.phase='play_shuati1';G.tutorialTalk('接下来打出刷题，让试卷看看你的威力。','left',null,'#bcard-'+b.hand.indexOf('shuati'));});}else if(id==='shuati'&&G.tutorial.phase==='play_shuati1'){G.tutorial.phase='after_shuati1';G.tutorialTalk('小徒弟做的不错~。','left',()=>{G.tutorial.phase='end_turn';G.tutorialTalk('暂时没有什么可以能做的，我们点击结束回合把。','left',null,'#endTurnBtn');});}else if(id==='shuati'&&G.tutorial.phase==='play_shuati2'){b.monsterHp=0;b.over=true;b.won=true;G.tutorial.phase='battle_done';G.render();G.tutorialTalk('非常棒哦，待会给你奖励。','left',()=>{clearGuide();endBattle();G.tutorialEvent('', '好的',()=>{try{localStorage.setItem(SEEN,'1')}catch(x){}G.tutorial.active=false;G.showCgEvent('xiaolei_tutorial_reward');});});}}return r;};
  const endTurn=G.playerEndTurn;
  G.playerEndTurn=function(){if(G.tutorial.active&&G.tutorial.phase!=='end_turn')return;if(G.tutorial.active)G.tutorial.phase='wait_monster';return endTurn();};
  const endBattle=G.endBattle;
  const render=G.render;
  G.render=function(){let r=render();if(G.tutorial.active&&G.tutorial.phase==='wait_monster'&&G.state.battle&&G.state.battle.phase==='player'&&G.state.battle.turn>=2){let b=G.state.battle;b.hand=['renzhen_beikao','shuati'];b.drawPile=[];G.tutorial.phase='play_beikao';render();setTimeout(()=>G.tutorialTalk('接下来我们要认真对待了，解答卡可是我们的底牌，每一种解答卡可是都拥有十分强大的效果，但是一种解答卡卡组只能拥有一张，现在让我们打出“认真备考”。','left',null,'#bcard-'+b.hand.indexOf('renzhen_beikao')),0);}return r;};
  // 认真备考是第二回合唯一例外，单独扩展 playCard 包装。
  const controlledPlay=G.playCard;
  G.playCard=function(i){let b=G.state.battle,id=b&&b.hand[i];if(G.tutorial.active&&G.tutorial.phase==='play_beikao'){if(id!=='renzhen_beikao')return;let r=play(i);G.tutorial.phase='play_shuati2';G.tutorialTalk('做的好小徒弟，接下来该是让它看看我们的进步了，打出刷题，结束考试。','left',null,'#bcard-'+b.hand.indexOf('shuati'));return r;}return controlledPlay(i);};
})();
