const META={cards:['卡牌','CARDS'],monsters:['怪物','MONSTERS'],talents:['天赋','TALENTS'],events:['普通事件','EVENTS'],cg:['CG / AVG','CG_EVENTS'],startEvents:['角色开局事件','CHARACTER_START_EVENTS'],audio:['对白配音','DIALOGUE_AUDIO'],layout:['界面布局','LAYOUTS']};
const LABELS={id:'ID',name:'名称',title:'标题',type:'类型',cost:'消耗',desc:'效果描述',q:'品质',emoji:'图标',physique:'体魄',intelligence:'智力',eq:'情商',hp:'生命',maxHp:'生命上限',talent:'天赋',talentDesc:'天赋效果',deck:'卡组',dialogue:'对白',options:'选项',image:'图片',music:'音乐',audio:'配音',speaker:'说话人',text:'文本',dmgStat:'伤害属性',dmgMult:'伤害倍率',hits:'伤害段数',shieldStat:'护盾属性',shieldMult:'护盾倍率',draw:'摸牌数',heal:'回复生命',energyGain:'回复体力',fixedShield:'固定护盾',poison:'中毒层数',lifestealPct:'吸血百分比',comboDmg:'连击加伤',status:'添加状态',cards:'卡牌',weight:'权重',reward:'奖励',rewards:'奖励',condition:'条件',effects:'效果'};
const KEYWORDS={ruchu:'如初',baoliu:'保留',tuoshou:'脱手',exhaust:'移除',flash:'闪',echo:'回响',silent:'沉默'};
const EFFECTS={dmgMult:['伤害倍率',1],dmgStat:['伤害属性','intelligence'],hits:['伤害段数',1],shieldMult:['护盾倍率',1],shieldStat:['护盾属性','physique'],draw:['摸牌数',1],heal:['回复生命',1],energyGain:['回复体力',1],fixedShield:['固定护盾',1],poison:['中毒层数',1],lifestealPct:['吸血百分比',20],comboDmg:['连击加伤',1],status:['添加状态',{name:'状态名',layers:1}]};
let kind='cards',selected=null,draft=null,working=G.loadEditorOverrides();

function clone(x){return JSON.parse(JSON.stringify(x??{}))}
function base(k){return G[META[k][1]]||{}}
function merged(k){return Object.assign({},base(k),working[k]||{})}
function nameOf(x,id){return x.name||x.title||x.text||id}
function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
function label(k){return LABELS[k]||k}
function pa(p){return encodeURIComponent(JSON.stringify(p))}
function boot(){tabs.innerHTML=Object.entries(META).map(([k,v])=>`<button class="tab ${k===kind?'on':''}" onclick="chooseKind('${k}')">${v[0]}</button>`).join('');renderList()}
function chooseKind(k){kind=k;selected=null;draft=null;boot();editor.innerHTML='<div class="hint">从左侧选择一项开始编辑。</div>'}
function renderList(){let q=search.value.toLowerCase(),all=merged(kind);items.innerHTML=Object.entries(all).filter(([id,x])=>(id+' '+nameOf(x,id)).toLowerCase().includes(q)).map(([id,x])=>`<div class="item ${id===selected?'on':''}" onclick="selectItem('${esc(id)}')">${esc(nameOf(x,id))}<small> · ${esc(id)}</small></div>`).join('')}
function selectItem(id){selected=id;draft=current();if(kind==='events'&&!('image' in draft))draft.image='UI/通用事件框.png';renderList();renderEditor()}
function current(){return clone((working[kind]&&working[kind][selected])||merged(kind)[selected]||{})}

function renderEditor(){
  if(!selected)return;
  if(kind==='startEvents')return renderStart(draft);
  if(kind==='layout')return renderLayout(draft);
  editor.innerHTML=`<div class="actions"><b>${esc(META[kind][0])}：${esc(selected)}</b>${kind==='events'?'<button class="btn primary" onclick="testCurrentEvent()">▶ 单独测试事件</button>':''}<button class="btn danger" onclick="deleteItem()">删除本地修改</button></div>
  <div class="panel"><div class="fieldRow"><label>ID</label><input id="edId" class="field" value="${esc(selected)}"></div><div class="hint">直接填写文字和数字即可。修改后点“保存当前”，再点“写入游戏”。</div></div>
  ${kind==='cards'?renderCardTools():''}<div class="panel"><h3>基础内容</h3><div id="visualFields">${renderObject(draft,[])}</div></div>
  <details class="panel advanced"><summary>高级 JSON（一般不需要使用）</summary><textarea id="advancedJson" class="json" spellcheck="false">${esc(JSON.stringify(draft,null,2))}</textarea><button class="btn" onclick="applyAdvancedJson()">应用高级 JSON</button></details>`;
  bindFields();
}
function renderCardTools(){
  let choices=Object.entries(EFFECTS).filter(([k])=>!(k in draft));
  return `<div class="panel"><h3>添加词条</h3><div class="keywordGrid">${Object.entries(KEYWORDS).map(([k,n])=>`<label class="keyword check"><input type="checkbox" ${draft[k]?'checked':''} onchange="toggleKeyword('${k}',this.checked)">【${n}】</label>`).join('')}</div></div>
  <div class="panel"><h3>添加效果</h3><div class="effectBar"><select id="effectSelect">${choices.map(([k,v])=>`<option value="${k}">${v[0]}</option>`).join('')||'<option value="">可添加效果已全部加入</option>'}</select><button class="btn primary" onclick="addEffect()">添加效果</button></div></div>`;
}
function renderObject(obj,path){
  let entries=Object.entries(obj).filter(([k])=>!(kind==='cards'&&k in KEYWORDS));
  return (entries.length?entries.map(([k,v])=>renderValue(v,path.concat(k),k)).join(''):'<div class="empty">这里还没有字段。</div>')+`<button class="btn mini" onclick='addObjectField(${JSON.stringify(path)})'>＋ 添加字段</button>`;
}
function renderValue(v,path,key){
  if(Array.isArray(v))return `<div class="nested"><div class="nestedHead"><b>${esc(label(key))}</b><button class="btn mini" onclick='addArrayItem(${JSON.stringify(path)})'>＋ 新增一项</button></div>${v.length?v.map((x,i)=>`<div class="arrayItem"><div class="nestedHead"><b>第 ${i+1} 项</b><button class="btn mini danger" onclick='removeArrayItem(${JSON.stringify(path)},${i})'>删除</button></div>${renderValue(x,path.concat(i),'内容')}</div>`).join(''):'<div class="empty">暂无内容</div>'}</div>`;
  if(v&&typeof v==='object')return `<div class="nested"><div class="nestedHead"><b>${esc(label(key))}</b></div>${renderObject(v,path)}</div>`;
  if(typeof v==='boolean')return `<div class="fieldRow"><label>${esc(label(key))}</label><label class="check"><input class="visualInput" data-path="${pa(path)}" data-type="boolean" type="checkbox" ${v?'checked':''}>启用</label><button class="btn mini danger" onclick='removeField(${JSON.stringify(path)})'>删除</button></div>`;
  return `<div class="fieldRow"><label title="${esc(key)}">${esc(label(key))}</label>${control(key,v,pa(path))}<button class="btn mini danger" onclick='removeField(${JSON.stringify(path)})'>删除</button></div>`;
}
function control(key,v,path){
  if(key==='type'&&kind==='cards')return `<select class="visualInput" data-path="${path}" data-type="string">${[['logic','逻辑卡'],['idea','思路卡'],['answer','解答卡'],['tool','用具卡'],['special','特殊卡']].map(([x,n])=>`<option value="${x}" ${v===x?'selected':''}>${n}</option>`).join('')}</select>`;
  if(key==='dmgStat'||key==='shieldStat')return `<select class="visualInput" data-path="${path}" data-type="string">${[['intelligence','智力'],['eq','情商'],['physique','体魄']].map(([x,n])=>`<option value="${x}" ${v===x?'selected':''}>${n}</option>`).join('')}</select>`;
  if(typeof v==='number')return `<input class="field visualInput" data-path="${path}" data-type="number" type="number" step="any" value="${v}">`;
  let long=/desc|text|dialogue|effect|talentDesc/i.test(key)||String(v).length>60;
  return long?`<textarea class="visualInput" data-path="${path}" data-type="string">${esc(v)}</textarea>`:`<input class="field visualInput" data-path="${path}" data-type="string" value="${esc(v)}">`;
}
function bindFields(){document.querySelectorAll('.visualInput').forEach(el=>{el.oninput=el.onchange=()=>{let path=JSON.parse(decodeURIComponent(el.dataset.path));setPath(path,el.dataset.type==='number'?Number(el.value):el.dataset.type==='boolean'?el.checked:el.value);if(kind==='layout'){document.querySelectorAll(`.visualInput[data-path="${el.dataset.path}"]`).forEach(peer=>{if(peer!==el)peer.value=el.value});updateLayoutPreview()}}})}
function setPath(path,val){let o=draft;for(let i=0;i<path.length-1;i++)o=o[path[i]];o[path[path.length-1]]=val}
function getPath(path){return path.reduce((o,k)=>o[k],draft)}
function toggleKeyword(k,on){if(on)draft[k]=true;else delete draft[k];renderEditor()}
function addEffect(){let k=effectSelect.value;if(!k)return;draft[k]=clone(EFFECTS[k][1]);renderEditor()}
function removeField(path){if(!confirm(`删除“${label(path[path.length-1])}”字段？`))return;let o=draft;for(let i=0;i<path.length-1;i++)o=o[path[i]];Array.isArray(o)?o.splice(path[path.length-1],1):delete o[path[path.length-1]];renderEditor()}
function addObjectField(path){let key=prompt('输入字段名（例如 cooldown）');if(!key)return;let o=getPath(path);if(key in o)return alert('该字段已经存在');let type=prompt('填写类型：文字、数字、开关','文字');o[key]=type==='数字'?0:type==='开关'?false:'';renderEditor()}
function defaultArrayItem(path,a){let key=String(path[path.length-1]);if(a.length)return clone(a[0]);if(key==='dialogue')return{speaker:'',text:'',audio:''};if(key==='options')return'新选项';if(key==='deck'||key==='cards')return{name:'新卡牌',type:'logic',cost:1,desc:''};return''}
function addArrayItem(path){let a=getPath(path);a.push(defaultArrayItem(path,a));renderEditor()}
function removeArrayItem(path,i){getPath(path).splice(i,1);renderEditor()}
function applyAdvancedJson(){try{draft=JSON.parse(advancedJson.value);renderEditor();flash('已应用到表单，记得保存')}catch(e){alert('JSON格式错误：'+e.message)}}

const LAYOUT_GROUPS=[
  ['双方生命球',[['healthBallSize','生命球尺寸',56,180,1,'像素'],['healthStackGap','上下生命球间距',0,80,1,'像素'],['healthAreaTop','生命区域上方留白',0,120,1,'像素'],['healthAreaBottom','生命区域下方留白',0,120,1,'像素'],['healthValueDistance','生命数值离圆环距离',0,120,1,'像素']]],
  ['怪物破绽环',[['flawRingSize','破绽环整体尺寸',80,240,1,'像素'],['flawRingThickness','破绽环粗细',2,30,1,'像素']]],
  ['角色区域与技能',[['playerSideWidth','玩家左侧区域宽度',90,320,1,'像素'],['monsterSideWidth','怪物右侧区域宽度',90,320,1,'像素'],['skillGap','技能按钮间距',0,40,1,'像素'],['playerPortraitScale','玩家立绘缩放',50,250,1,'%'],['monsterPortraitScale','怪物立绘缩放',50,250,1,'%']]],
  ['玩家手牌',[['handCardWidth','卡牌宽度',55,240,1,'像素'],['handCardHeight','卡牌高度',85,360,1,'像素'],['handCardOverlap','相邻卡牌重叠',0,100,1,'像素']]]
];
function layoutField(f){let [k,n,min,max,step,unit]=f,v=Number(draft[k]??0);return `<div class="layoutEditRow"><label>${n}</label><input class="visualInput" data-path="${pa([k])}" data-type="number" type="range" min="${min}" max="${max}" step="${step}" value="${v}"><input class="field visualInput layoutNum" data-path="${pa([k])}" data-type="number" type="number" min="${min}" max="${max}" step="${step}" value="${v}"><span>${unit}</span></div>`}
function renderLayout(){editor.innerHTML=`<div class="actions"><b>界面布局：战斗界面</b><button class="btn" onclick="resetBattleLayout()">恢复默认布局</button></div><div class="hint">拖动滑杆或直接填写数字。保存后游戏会读取该布局；小屏幕仍使用自动适配，避免界面超出屏幕。</div><div class="layoutEditorGrid"><div>${LAYOUT_GROUPS.map(g=>`<div class="panel"><h3>${g[0]}</h3>${g[1].map(layoutField).join('')}</div>`).join('')}</div><div class="panel layoutPreviewPanel"><h3>布局预览</h3><div id="layoutPreview"><div class="lp-ball monster"><b>怪物</b><span>50/100</span><i></i></div><div class="lp-ball player"><b>玩家</b><span>40/50</span></div><div class="lp-skills"><button>角色技能</button><button>搭档技能</button></div><div class="lp-cards"><em></em><em></em><em></em></div></div><div class="hint">预览用于观察相对大小与间距，游戏中的最终位置以实际战斗画面为准。</div></div></div>`;bindFields();updateLayoutPreview()}
function updateLayoutPreview(){let p=document.getElementById('layoutPreview');if(!p)return;let ball=Math.max(40,Math.min(115,Number(draft.healthBallSize||100)*.65)),ring=Math.max(ball+12,Number(draft.flawRingSize||144)*.65);p.style.setProperty('--lp-ball',ball+'px');p.style.setProperty('--lp-ring',ring+'px');p.style.setProperty('--lp-thick',Math.max(2,Number(draft.flawRingThickness||11)*.65)+'px');p.style.setProperty('--lp-gap',Math.max(0,Number(draft.healthStackGap||20)*.55)+'px');p.style.setProperty('--lp-skill-gap',Number(draft.skillGap||4)+'px');p.style.setProperty('--lp-card-w',Math.max(35,Number(draft.handCardWidth||120)*.48)+'px');p.style.setProperty('--lp-card-h',Math.max(55,Number(draft.handCardHeight||185)*.48)+'px');p.style.setProperty('--lp-overlap',-Math.max(0,Number(draft.handCardOverlap||24)*.48)+'px')}
function resetBattleLayout(){draft=clone(G.LAYOUTS.battle);Object.assign(draft,{healthBallSize:100,healthStackGap:20,healthAreaTop:22,healthAreaBottom:10,healthValueDistance:18,flawRingSize:144,flawRingThickness:11,playerSideWidth:140,monsterSideWidth:140,skillGap:4,handCardWidth:120,handCardHeight:185,handCardOverlap:24,playerPortraitScale:100,monsterPortraitScale:100});renderLayout();flash('已恢复默认值，记得保存')}

function renderStart(x){let ds=(x.dialogue||[]).slice(0,3);while(ds.length<3)ds.push({speaker:'',text:'',audio:''});editor.innerHTML=`<div class="actions"><b>角色开局事件：${esc(selected)}</b><button class="btn" onclick="previewStart()">预览小蕾框</button><button class="btn danger" onclick="deleteItem()">删除本地修改</button></div><div class="row"><label>事件标题</label><input id="stTitle" class="field" value="${esc(x.title||'')}"></div><div class="row"><label>背景图片</label><input id="stImage" class="field" value="${esc(x.image||'')}"></div><div class="row"><label>背景音乐</label><input id="stMusic" class="field" value="${esc(x.music||'')}"></div><h3>上半区三段流式文本</h3><div class="start-grid">${ds.map((d,i)=>`<div class="seg"><b>第${i+1}段</b><input id="sp${i}" value="${esc(d.speaker||'')}" placeholder="说话人"><textarea id="tx${i}" placeholder="对白文本">${esc(d.text||'')}</textarea><input id="au${i}" value="${esc(d.audio||'')}" placeholder="配音文件路径"></div>`).join('')}</div><div class="row" style="margin-top:14px"><label>下半区选项</label><textarea id="stOptions" rows="5" placeholder="每行一个选项">${esc((x.options||['继续']).map(o=>typeof o==='object'?o.text:o).join('\n'))}</textarea></div>`}
function readForm(){if(kind==='startEvents')return{title:stTitle.value,image:stImage.value,music:stMusic.value,dialogue:[0,1,2].map(i=>({speaker:document.getElementById('sp'+i).value,text:document.getElementById('tx'+i).value,audio:document.getElementById('au'+i).value})),options:stOptions.value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean)};return clone(draft)}
function saveItem(){if(!selected)return;try{let x=readForm(),newId=(kind==='startEvents'||kind==='layout')?selected:(edId.value.trim()||selected);working[kind]=working[kind]||{};if(newId!==selected)delete working[kind][selected];working[kind][newId]=x;selected=newId;draft=clone(x);G.saveEditorOverrides(working);flash('已保存');boot();renderEditor()}catch(e){alert('保存失败：'+e.message)}}
function testCurrentEvent(){
  if(kind!=='events'||!selected)return;
  try{
    let id=(document.getElementById('edId')&&edId.value.trim())||selected;
    localStorage.setItem('jbtm_event_test_payload',JSON.stringify({id,event:readForm(),createdAt:Date.now()}));
    let url=new URL('学生时代牌-网页版.html',location.href);url.searchParams.set('eventTest',id);
    let win=window.open(url.href,'_blank');
    if(!win)alert('浏览器拦截了测试窗口，请允许此页面打开新窗口后再试。');
    else flash('已打开独立事件测试，不会影响正式存档');
  }catch(e){alert('无法打开事件测试：'+e.message)}
}
function addItem(){if(kind==='layout')return alert('界面布局为唯一配置，不需要新增。');let id=prompt('输入新ID');if(!id)return;working[kind]=working[kind]||{};working[kind][id]=kind==='startEvents'?{title:'新角色事件',dialogue:[{},{},{}],options:['继续']}:{id,name:'新项目'};selected=id;draft=current();G.saveEditorOverrides(working);boot();renderEditor()}
function duplicateItem(){if(kind==='layout')return alert('界面布局为唯一配置，不需要复制。');if(!selected)return;let id=prompt('复制为新ID',selected+'_copy');if(!id)return;working[kind]=working[kind]||{};working[kind][id]=readForm();selected=id;draft=current();G.saveEditorOverrides(working);boot();renderEditor()}
function deleteItem(){if(!selected||!confirm('仅删除该项的本地编辑覆盖，原始数据仍保留。确定吗？'))return;if(working[kind])delete working[kind][selected];G.saveEditorOverrides(working);selected=null;draft=null;boot();editor.innerHTML='<div class="hint">本地修改已删除。</div>'}
function exportData(){let blob=new Blob([JSON.stringify(working,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='金榜题名-编辑器数据.json';a.click();URL.revokeObjectURL(a.href)}
async function writeToGame(){if(!window.showSaveFilePicker){alert('当前浏览器不支持直接写入。请使用“导出全部”，或用最新版 Edge 打开编辑器。');return}try{let h=await showSaveFilePicker({suggestedName:'editor-overrides.js',types:[{description:'游戏编辑覆盖文件',accept:{'text/javascript':['.js']}}]}),w=await h.createWritable();await w.write('// 金榜题名编辑器生成，请勿手改\nG.EDITOR_FILE_OVERRIDES = '+JSON.stringify(working,null,2)+';\n');await w.close();flash('已写入；请确认文件保存在游戏的 js 文件夹')}catch(e){if(e.name!=='AbortError')alert('写入失败：'+e.message)}}
importFile.onchange=async e=>{try{working=JSON.parse(await e.target.files[0].text());G.saveEditorOverrides(working);selected=null;draft=null;boot();flash('导入成功')}catch(x){alert('导入失败：'+x.message)}};search.oninput=renderList;
function previewStart(){let x=readForm(),opts=x.options||['继续'],cols=opts.length===4?2:Math.min(Math.max(opts.length,1),3);let p=document.createElement('div');p.className='preview';p.innerHTML=`<div class="previewBox"><button class="btn close">关闭</button><div class="previewSegs">${x.dialogue.map(d=>`<div class="previewSeg">${esc((d.speaker?d.speaker+'\n':'')+d.text)}</div>`).join('')}</div><div class="previewOpts" style="grid-template-columns:repeat(${cols},1fr)">${opts.map(o=>`<button class="btn">${esc(o)}</button>`).join('')}</div></div>`;p.querySelector('.close').onclick=()=>p.remove();document.body.appendChild(p)}
function flash(t){status.textContent=t;setTimeout(()=>status.textContent='',1800)}
boot();editor.innerHTML='<div class="hint">选择左侧项目开始编辑。现在只需填写文字、数字或勾选词条，不需要写代码。</div>';
