// 制作人对话配置与全场景气泡系统。
// 新对话必须精确填写 scene（场景）与 timing（时机）；未匹配时绝不提前或挪用到别处。
// 示例：{id:'xiaoya_map_1', scene:'map', timing:'enter', character:'xiaoqingya', text:['第一句','第二句'], once:true}
G.PRODUCER_DIALOGUES = G.PRODUCER_DIALOGUES || [];

// 每次新开局都会播放的角色专属事件。制作人可在主菜单的“开局剧情编辑”窗口修改。
G.CHARACTER_START_EVENTS = Object.assign({
  xueshilei:{
    revision:1,
    title:'保密的奖励',image:'其他插画/小蕾背景.png',music:'',
    dialogue:[
      {speaker:'薛诗蕾',text:'那个，谢谢你愿意替我保密。我不想因为妈妈是老师，就让别人觉得我的成绩来自特殊照顾。'},
      {speaker:'薛诗蕾',text:'我的成绩都是靠自己努力得来的。作为答谢，我决定给你一个奖励。'},
      {speaker:'薛诗蕾',text:'这个周末和我一起补习。我会亲自辅导你，帮你把成绩提上去。'}
    ],
    options:[
      {text:'好啊，我接受。',dialogue:[
        {speaker:'你',text:'好啊，有你亲自辅导，我当然接受。'},
        {speaker:'薛诗蕾',text:'那就说定了。周末早上六点半，在书店见。'},
        {speaker:'你',text:'六点半？！'},
        {speaker:'薛诗蕾',text:'这家书店六点就开门。别迟到。'},
        {speaker:'旁白',text:'于是，你答应了周末与薛诗蕾一起补习。'}
      ]},
      {text:'这算奖励吗？',dialogue:[
        {speaker:'你',text:'奖励？这听起来明明像惩罚吧。'},
        {speaker:'薛诗蕾',text:'周末一个人学习会很累。我可以陪你一起，还会亲自辅导你。'},
        {speaker:'你',text:'那有没有额外奖励？'},
        {speaker:'薛诗蕾',text:'秘密~'},
        {speaker:'你',text:'……行吧，我接受。'},
        {speaker:'薛诗蕾',text:'那就这么说定了。周末早上六点半，书店见。'},
        {speaker:'旁白',text:'虽然嘴上抱怨，你还是接受了她安排的补习。'}
      ]},
      {text:'周末还要学习？我不乐意。',dialogue:[
        {speaker:'你',text:'周末大好时光还要补习？我不乐意。'},
        {speaker:'薛诗蕾',text:'唔……那就再额外送你一个小奖励。'},
        {speaker:'你',text:'什么奖励？'},
        {speaker:'薛诗蕾',text:'秘密~等你来了就知道。'},
        {speaker:'你',text:'可六点半也太早了，我起不来。'},
        {speaker:'薛诗蕾',text:'这家书店六点就开门。你可以起得来。'},
        {speaker:'你',text:'……好吧好吧，我去。'},
        {speaker:'薛诗蕾',text:'嗯，就这么说定了。'},
        {speaker:'旁白',text:'你推脱了半天，最后还是答应周末来和她一起补习。'}
      ]}
    ]
  },
  xiaoqingya:{title:'肖清雅专属事件',image:'其他插画/肖清雅背景.png',music:'',dialogue:[],options:['继续']},
  chengliang:{title:'程良专属事件',image:'',music:'',dialogue:[],options:['继续']},
  tangsong:{title:'唐淞专属事件',image:'',music:'',dialogue:[],options:['继续']},
  tanzijun:{title:'谭梓君专属事件',image:'',music:'',dialogue:[],options:['继续']},
  xiaomeng:{title:'小萌专属事件',image:'',music:'',dialogue:[],options:['继续']},
  xiaomeng_fiora:{title:'剑姬哓萌专属事件',image:'',music:'',dialogue:[],options:['继续']}
}, G.CHARACTER_START_EVENTS || {});
try {
  let savedStartEvents=JSON.parse(localStorage.getItem('jbtm_character_start_events')||'null');
  if(savedStartEvents) G.CHARACTER_START_EVENTS=Object.assign(G.CHARACTER_START_EVENTS,savedStartEvents);
} catch(e) {}
// 正式剧情升级：只替换旧版空白/测试用小蕾事件，之后仍可由编辑器继续修改。
if(!G.CHARACTER_START_EVENTS.xueshilei || (G.CHARACTER_START_EVENTS.xueshilei.revision||0)<1) {
  G.CHARACTER_START_EVENTS.xueshilei={
    revision:1,title:'保密的奖励',image:'其他插画/小蕾背景.png',music:'',
    dialogue:[
      {speaker:'薛诗蕾',text:'那个，谢谢你愿意替我保密。我不想因为妈妈是老师，就让别人觉得我的成绩来自特殊照顾。'},
      {speaker:'薛诗蕾',text:'我的成绩都是靠自己努力得来的。作为答谢，我决定给你一个奖励。'},
      {speaker:'薛诗蕾',text:'这个周末和我一起补习。我会亲自辅导你，帮你把成绩提上去。'}
    ],options:G.CHARACTER_START_EVENTS.xueshilei&&G.CHARACTER_START_EVENTS.xueshilei.options
  };
  // 使用上方正式选项，避免旧本地配置覆盖后续剧情。
  G.CHARACTER_START_EVENTS.xueshilei.options=[
    {text:'好啊，我接受。',dialogue:[{speaker:'你',text:'好啊，有你亲自辅导，我当然接受。'},{speaker:'薛诗蕾',text:'那就说定了。周末早上六点半，在书店见。'},{speaker:'你',text:'六点半？！'},{speaker:'薛诗蕾',text:'这家书店六点就开门。别迟到。'},{speaker:'旁白',text:'于是，你答应了周末与薛诗蕾一起补习。'}]},
    {text:'这算奖励吗？',dialogue:[{speaker:'你',text:'奖励？这听起来明明像惩罚吧。'},{speaker:'薛诗蕾',text:'周末一个人学习会很累。我可以陪你一起，还会亲自辅导你。'},{speaker:'你',text:'那有没有额外奖励？'},{speaker:'薛诗蕾',text:'秘密~'},{speaker:'你',text:'……行吧，我接受。'},{speaker:'薛诗蕾',text:'那就这么说定了。周末早上六点半，书店见。'},{speaker:'旁白',text:'虽然嘴上抱怨，你还是接受了她安排的补习。'}]},
    {text:'周末还要学习？我不乐意。',dialogue:[{speaker:'你',text:'周末大好时光还要补习？我不乐意。'},{speaker:'薛诗蕾',text:'唔……那就再额外送你一个小奖励。'},{speaker:'你',text:'什么奖励？'},{speaker:'薛诗蕾',text:'秘密~等你来了就知道。'},{speaker:'你',text:'可六点半也太早了，我起不来。'},{speaker:'薛诗蕾',text:'这家书店六点就开门。你可以起得来。'},{speaker:'你',text:'……好吧好吧，我去。'},{speaker:'薛诗蕾',text:'嗯，就这么说定了。'},{speaker:'旁白',text:'你推脱了半天，最后还是答应周末来和她一起补习。'}]}
  ];
  try{localStorage.setItem('jbtm_character_start_events',JSON.stringify(G.CHARACTER_START_EVENTS));}catch(e){}
}

// v2：保留“替小蕾保密后周末一起补习”的正式剧情，但不把条件、消耗或奖励说明写进对白。
if(!G.CHARACTER_START_EVENTS.xueshilei || (G.CHARACTER_START_EVENTS.xueshilei.revision||0)<2) {
  G.CHARACTER_START_EVENTS.xueshilei={
    revision:2,title:'周末的约定',image:'其他插画/小蕾背景.png',music:'',
    dialogue:[
      {speaker:'薛诗蕾',text:'那个，之前的事情谢谢你。妈妈在学校任教这件事，我暂时还不想让班里的人知道。'},
      {speaker:'薛诗蕾',text:'倒不是见不得人，只是大家一旦知道，可能连我上课被点名都会研究半天。想想就有点累。'},
      {speaker:'薛诗蕾',text:'这个周末陪我去书店吧。正好一起看看书，我也可以帮你讲讲最近不会的题。'}
    ],
    options:[
      {text:'好啊，我接受。',dialogue:[
        {speaker:'你',text:'好啊，有你亲自讲题，我当然去。'},
        {speaker:'薛诗蕾',text:'那就说定了。周末早上六点半，书店门口见。'},
        {speaker:'你',text:'六点半？书店那时候真的开门吗？'},
        {speaker:'薛诗蕾',text:'六点就开。放心，我已经确认过三次了。'},
        {speaker:'旁白',text:'她说得太过认真，你只好开始认真考虑该设几个闹钟。'}
      ]},
      {text:'这听起来像补课。',dialogue:[
        {speaker:'你',text:'等一下，这听起来怎么越来越像周末补课？'},
        {speaker:'薛诗蕾',text:'一起看书而已。只是看的过程中，我可能会顺便检查你有没有真的看懂。'},
        {speaker:'你',text:'“顺便检查”这四个字很有压力。'},
        {speaker:'薛诗蕾',text:'那我检查得温柔一点。'},
        {speaker:'你',text:'……行吧，我去。'},
        {speaker:'薛诗蕾',text:'嗯，周末早上六点半。别迟到。'}
      ]},
      {text:'周末还要学习？',dialogue:[
        {speaker:'你',text:'周末的大好时光也要和练习题见面吗？'},
        {speaker:'薛诗蕾',text:'书店里也有漫画区。把该看的看完以后，可以过去逛一会儿。'},
        {speaker:'你',text:'那六点半是不是太早了？'},
        {speaker:'薛诗蕾',text:'早一点比较安静，而且你不会在路上临时改变主意。'},
        {speaker:'你',text:'你连这个都考虑到了？'},
        {speaker:'薛诗蕾',text:'当然。就这么说定了。'},
        {speaker:'旁白',text:'你推脱了半天，最后还是答应了这场过早开始的周末书店之行。'}
      ]}
    ]
  };
  try{localStorage.setItem('jbtm_character_start_events',JSON.stringify(G.CHARACTER_START_EVENTS));}catch(e){}
}

G.CHIBI_AVATARS = Object.assign({
  xueshilei:'立绘/薛诗蕾Q版.jpg',
  xiaoqingya:'立绘/肖清雅Q版.jpg',
  chengliang:'立绘/程良Q版.jpg',
  tanzijun:'立绘/谭梓君Q版.jpg',
  liangchaojie:'立绘/梁超杰Q版.jpg.png'
}, G.CHIBI_AVATARS || {});

G._producerDialogueSeen = G._producerDialogueSeen || {};
G._producerDialogueScene = null;
G._dialogueAudio = null;
G.dialogueVoiceFor = function(text) {
  for(let row of Object.values(G.DIALOGUE_AUDIO||{})) if(row && row.text===text) return row.audio||'';
  return '';
};
G.playDialogueVoice = function(src) { if(G._dialogueAudio){G._dialogueAudio.pause();G._dialogueAudio=null;} if(!src)return; let a=new Audio(src);G._dialogueAudio=a;a.play().catch(()=>{}); };

G.registerProducerDialogue = function(def) {
  if(!def || !def.id || !def.scene || !def.timing || !def.character || !def.text) return false;
  let old = G.PRODUCER_DIALOGUES.findIndex(function(x){ return x.id === def.id; });
  if(old >= 0) G.PRODUCER_DIALOGUES[old] = def;
  else G.PRODUCER_DIALOGUES.push(def);
  return true;
};

G.showSpeechBubble = function(characterId, text, opts) {
  if(typeof document === 'undefined' || !document.createElement || !document.body) return false;
  opts = opts || {};
  G.closeSpeechBubble();
  let lines = Array.isArray(text) ? text.slice() : [text];
  if(!lines.length) return false;
  let ch = (G.CHARACTERS && G.CHARACTERS[characterId]) || {};
  let layer = document.createElement('div'); layer.id = 'producerDialogue'; layer.className = 'producer-dialogue-layer';
  let box = document.createElement('div'); box.className = 'producer-dialogue';
  let avatar = document.createElement('img'); avatar.className = 'producer-dialogue-avatar';
  avatar.src = ch.portrait || ch.selectPortrait || opts.avatar || '';
  avatar.alt = (opts.name || ch.name || characterId) + '头像';
  let bubble = document.createElement('div'); bubble.className = 'producer-dialogue-bubble';
  let name = document.createElement('div'); name.className = 'producer-dialogue-name'; name.textContent = opts.name || ch.name || characterId;
  let words = document.createElement('div'); words.className = 'producer-dialogue-text';
  let hint = document.createElement('div'); hint.className = 'producer-dialogue-hint';
  bubble.appendChild(name); bubble.appendChild(words); bubble.appendChild(hint); box.appendChild(avatar); box.appendChild(bubble); layer.appendChild(box);
  let index = 0;
  function paint(){ let line=typeof lines[index]==='object'?lines[index]:{text:String(lines[index]||'')}; words.textContent=line.text||''; G.playDialogueVoice(line.audio||opts.audio||G.dialogueVoiceFor(line.text||'')); hint.textContent = index < lines.length - 1 ? '点击继续' : '点击关闭'; }
  box.onclick = function(){
    if(index < lines.length - 1){ index++; paint(); }
    else { G.closeSpeechBubble(); if(typeof opts.onComplete === 'function') opts.onComplete(); }
  };
  paint(); document.body.appendChild(layer); return true;
};

G.closeSpeechBubble = function() {
  let el = (typeof document !== 'undefined' && document.getElementById) ? document.getElementById('producerDialogue') : null;
  if(el && el.remove) el.remove();
};

G.triggerProducerDialogue = function(scene, timing, context) {
  // render 会频繁执行；同一场景的 enter 只检查一次，离开再进入后可重新触发非 once 对话。
  let sceneKey = scene + '|' + timing;
  if(timing === 'enter' && G._producerDialogueScene === sceneKey) return false;
  if(timing === 'enter') G._producerDialogueScene = sceneKey;
  let item = G.PRODUCER_DIALOGUES.find(function(d) {
    if(d.scene !== scene || d.timing !== timing) return false;
    if(d.once && G._producerDialogueSeen[d.id]) return false;
    return typeof d.condition !== 'function' || d.condition(context || {});
  });
  if(!item) return false;
  if(item.once) G._producerDialogueSeen[item.id] = true;
  return G.showSpeechBubble(item.character, item.text, item);
};

G.showCharacterStartEvent = function(characterId, onComplete) {
  let def=G.CHARACTER_START_EVENTS[characterId]||{}, ch=(G.CHARACTERS||{})[characterId]||{};
  let lines=(def.dialogue||[]).map(x=>typeof x==='object'?x:{text:String(x||'')});
  let options=(def.options||['继续']).map(x=>typeof x==='object'?x:{text:String(x||'继续')});
  let frameClass=characterId==='xueshilei'?' xiaolei-special-frame':(characterId==='xiaomeng'?' character-frame-xiaomeng':(characterId==='xiaomeng_fiora'?' character-frame-xiaomeng-fiora':''));
  let layer=document.createElement('div'); layer.id='characterStartEvent'; layer.className='start-character-event'+frameClass;
  layer.innerHTML=`<div class="sce-window"><div class="sce-title">${def.title||ch.name+'专属事件'}</div><div class="sce-scene"><img class="sce-bg" alt=""><div class="sce-shade"></div><img class="sce-avatar" alt=""><div class="sce-dialogue"><b class="sce-speaker"></b><div class="sce-text"></div><small>点击继续</small></div></div><div class="sce-options"></div></div>`;
  let bg=layer.querySelector('.sce-bg'), avatar=layer.querySelector('.sce-avatar');
  bg.src=def.image||''; bg.style.display=def.image?'block':'none'; avatar.src=ch.portrait||ch.selectPortrait||'';
  let i=0, finished=false;
  function close(){if(finished)return;finished=true;G.playDialogueVoice('');layer.remove();if(typeof onComplete==='function')onComplete();}
  let playOptionDialogue=null;
  function showOptions(){
    let box=layer.querySelector('.sce-options');box.innerHTML='';
    let cols=characterId==='xueshilei'?1:(options.length===4?2:Math.min(Math.max(options.length,1),3));
    box.style.gridTemplateColumns='repeat('+cols+',minmax(0,1fr))';
    options.forEach(opt=>{let b=document.createElement('button');b.className='btn sce-option';b.textContent=opt.text||'继续';b.onclick=function(ev){ev.stopPropagation();if(opt.dialogue&&opt.dialogue.length&&playOptionDialogue)playOptionDialogue(opt.dialogue);else close();};box.appendChild(b);});
    layer.querySelector('.sce-dialogue small').textContent='请选择';
  }
  function paint(){
    if(i>=lines.length){showOptions();return;}
    let row=lines[i]||{};layer.querySelector('.sce-speaker').textContent=row.speaker||ch.name||'';layer.querySelector('.sce-text').textContent=row.text||'';
    if(row.image){bg.src=row.image;bg.style.display='block';} G.playDialogueVoice(row.audio||G.dialogueVoiceFor(row.text||''));
  }
  layer.querySelector('.sce-scene').onclick=function(){if(i<lines.length){i++;paint();}};
  if(def.music){let a=document.createElement('audio');a.src=def.music;a.autoplay=true;a.loop=def.loopMusic!==false;layer.appendChild(a);}
  document.body.appendChild(layer);
  if(characterId==='xueshilei') {
    let old=layer.querySelector('.sce-dialogue');old.style.display='none';
    let grid=document.createElement('div');grid.className='xiaolei-segment-grid';grid.innerHTML='<div class="xiaolei-segment"></div><div class="xiaolei-segment"></div><div class="xiaolei-segment"></div>';layer.querySelector('.sce-scene').appendChild(grid);
    let boxes=[...grid.children], segs=lines.slice(0,3), si=0, ci=0, timer=null, done=false;
    playOptionDialogue=function(branch){
      if(timer)clearTimeout(timer);layer.querySelector('.sce-options').innerHTML='';
      let rows=(branch||[]).map(x=>typeof x==='object'?x:{text:String(x||'')}),page=0,pageDone=false;
      function drawPage(){
        let chunk=rows.slice(page,page+3);boxes.forEach((box,n)=>{let row=chunk[n];box.textContent=row?((row.speaker?row.speaker+'\n':'')+(row.text||'')):'';box.classList.toggle('visible',!!row);});
        pageDone=true;if(chunk[0])G.playDialogueVoice(chunk[0].audio||G.dialogueVoiceFor(chunk[0].text||''));
      }
      layer.querySelector('.sce-scene').onclick=function(){if(!pageDone)return;page+=3;if(page>=rows.length)close();else drawPage();};
      drawPage();
    };
    function finishAll(){if(timer)clearTimeout(timer);segs.forEach((row,n)=>{boxes[n].textContent=(row.speaker?row.speaker+'\n':'')+(row.text||'');boxes[n].classList.toggle('visible',!!(row.text||row.speaker));});done=true;showOptions();}
    function type(){
      if(si>=segs.length){done=true;showOptions();return;}
      let row=segs[si]||{}, full=(row.speaker?row.speaker+'\n':'')+(row.text||'');
      if(ci===0){boxes[si].classList.add('visible');G.playDialogueVoice(row.audio||G.dialogueVoiceFor(row.text||''));}
      boxes[si].textContent=full.slice(0,ci++);
      if(ci<=full.length) timer=setTimeout(type,24); else {si++;ci=0;timer=setTimeout(type,420);}
    }
    layer.querySelector('.sce-scene').onclick=function(){if(!done)finishAll();};
    if(segs.some(x=>x&&(x.text||x.speaker)))type();else showOptions();
  } else if(lines.length) paint(); else {layer.querySelector('.sce-speaker').textContent=ch.name||'';layer.querySelector('.sce-text').textContent='';showOptions();}
};

// 制作人用开局剧情编辑窗口：内容保存在当前游戏目录对应的浏览器本地数据中。
G.openCharacterStartEventEditor = function(characterId) {
  let ids=Object.keys(G.CHARACTERS||{}), id=characterId||ids[0], def=G.CHARACTER_START_EVENTS[id]||{};
  let dialogue=JSON.stringify(def.dialogue||[],null,2), options=(def.options||['继续']).map(x=>typeof x==='object'?x.text:x).join('\n');
  let html=`<h3 style="color:#ffd700;text-align:center">🎬 开局角色事件编辑</h3>
  <label class="sce-ed-label">角色<select id="sceEdChar">${ids.map(x=>`<option value="${x}" ${x===id?'selected':''}>${G.CHARACTERS[x].name}</option>`).join('')}</select></label>
  <label class="sce-ed-label">事件标题<input id="sceEdTitle" value="${String(def.title||'').replace(/"/g,'&quot;')}"></label>
  <label class="sce-ed-label">背景图片路径<input id="sceEdImage" value="${String(def.image||'').replace(/"/g,'&quot;')}" placeholder="例如：其他插画/角色背景.png"></label>
  <label class="sce-ed-label">音乐路径<input id="sceEdMusic" value="${String(def.music||'').replace(/"/g,'&quot;')}" placeholder="例如：音乐/剧情曲.mp3"></label>
  <label class="sce-ed-label">对白 JSON<textarea id="sceEdDialogue" rows="10" spellcheck="false"></textarea></label>
  <div class="sce-ed-help">小蕾事件请填写3段对白，每段对应上半区一个虚线框。格式示例：[{"speaker":"角色名","text":"第一段","audio":"配音/对白.mp3"},{"speaker":"角色名","text":"第二段"},{"speaker":"角色名","text":"第三段"}]</div>
  <label class="sce-ed-label">结尾选项（每行一个）<textarea id="sceEdOptions" rows="3"></textarea></label>
  <div style="display:flex;gap:8px"><button class="btn primary" id="sceEdSave">保存</button><button class="btn" id="sceEdTest">保存并预览</button><button class="btn" onclick="G.closeModal()">关闭</button></div>`;
  G.showModal(html);
  document.getElementById('sceEdDialogue').value=dialogue;document.getElementById('sceEdOptions').value=options;
  document.getElementById('sceEdChar').onchange=e=>{let next=e.target.value;G.closeModal();G.openCharacterStartEventEditor(next);};
  function save(){
    let rows;try{rows=JSON.parse(document.getElementById('sceEdDialogue').value||'[]');if(!Array.isArray(rows))throw 0;}catch(e){G.showToast('对白 JSON 格式错误');return false;}
    G.CHARACTER_START_EVENTS[id]={revision:def.revision||0,title:document.getElementById('sceEdTitle').value,image:document.getElementById('sceEdImage').value,music:document.getElementById('sceEdMusic').value,dialogue:rows,options:document.getElementById('sceEdOptions').value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean)};
    try{localStorage.setItem('jbtm_character_start_events',JSON.stringify(G.CHARACTER_START_EVENTS));}catch(e){} G.showToast('开局剧情已保存');return true;
  }
  document.getElementById('sceEdSave').onclick=save;
  document.getElementById('sceEdTest').onclick=function(){if(!save())return;G.closeModal();G.showCharacterStartEvent(id);};
};
