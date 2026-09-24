// scenes — 全部渲染场景：菜单/选角/地图/战斗(含拖拽发牌)/奖励/休息/天赋/事件/卡组浏览 + 启动初始化（2026-08-22 由内联脚本拆分）
// 依赖顺序：core → data → battle → map → fx → scenes；共用全局 G，禁止改成模块化 import。

// ==================== RENDER ====================
G.render = function() {
  let s = G.state;
  if(s.runStats) s.runStats.maxDeck=Math.max(s.runStats.maxDeck||0,(s.deck||[]).length);
  G.autoEquipTools();
  let top = document.getElementById('topBar');
  let main = document.getElementById('main');
  let bot = document.getElementById('bottomBar');

  // Common top bar
  let hpPct = s.maxHp > 0 ? Math.round(s.hp/s.maxHp*100) : 0;
  main.className = s.screen === 'battle' ? 'battle-mode' : (s.screen === 'menu' ? 'menu-mode' : (s.screen === 'charSelect' ? 'char-select-mode' : (s.screen === 'map' ? 'map-mode' : '')));
  // 局内不显示顶栏数值/深色条（用户定 2026-08-16）
  top.style.display = (s.screen === 'menu' || s.screen === 'charSelect' || s.screen === 'battle') ? 'none' : '';
  bot.style.display = s.screen === 'menu' ? 'none' : '';
  // 热路径优化（2026-08-23）：app 引用只查一次，替代原来连续 5 次 getElementById
  let appEl = document.getElementById('app');
  appEl.classList.toggle('menu-full', s.screen === 'menu');
  appEl.classList.toggle('battle-full', s.screen === 'battle');
  appEl.classList.toggle('charselect-full', s.screen === 'charSelect');
  // 局外背景：主菜单（视频）/选角色页（原版社交背景）/战斗（深色）之外，用其他插画/局外背景.png
  appEl.classList.toggle('outside-full', s.screen !== 'menu' && s.screen !== 'charSelect' && s.screen !== 'battle');
  // 选角色页壁纸（2026-08-23 临时测试）：随选中角色切换，交叉渐变
  G.charWallSync();
  // 战斗氛围微尘（2026-08-23）：battle 屏常驻，离开自动清除
  if(G.fx && G.fx.ambientBattleSync) G.fx.ambientBattleSync();
  // 音效静音按钮（2026-08-23）：fixed 右上角持久 DOM
  if(G.sfx && G.sfx.btnSync) G.sfx.btnSync();
  // 设置齿轮按钮（2026-08-23）：fixed 右上角持久 DOM，任意界面可打开设置
  G.settingsBtnSync();
  // 全屏按钮（2026-08-29）：fixed 右上角持久 DOM，浏览器全屏/退出全屏
  G.fullscreenBtnSync();
  top.innerHTML = `
    <span class="title">📚 学生时代牌</span>
    <span class="stat">❤️ ${s.hp}/${s.maxHp}</span>
    <span class="stat" title="智力">🧠 ${s.intelligence}</span>
    <span class="stat" title="情商">😊 ${s.eq}</span>
    <span class="stat" title="体魄">💪 ${s.physique}</span>
    <span class="stat">💰 ${s.gold}</span>
    ${(s.partners && s.partners.length) ? `<span class="stat">👥 ${s.partners.map(p=>p.name).join('、')}</span>` : ''}
    ${s.screen==='map'||s.screen==='rest' ? `<span class="stat" style="cursor:pointer" onclick="G.setScreen('deck_view')">🃏 卡组${s.deck.length}张</span>` : ''}
    ${s.screen==='map'||s.screen==='rest'||s.screen==='shop' ? `<span class="stat" style="cursor:pointer" onclick="G.openBookshelfFrom('${s.screen}')">📚 书架</span>` : ''}
    ${s.screen==='map'||s.screen==='rest'||s.screen==='battle' ? `<span class="stat" style="cursor:pointer" onclick="G.showTalentView()">✨ 天赋</span>` : ''}
  `;

  switch(s.screen) {
    case 'menu': G.renderMenu(main,bot); break;
    case 'charSelect': G.renderCharSelect(main,bot); break;
    case 'map': G.renderMap(main,bot); break;
    case 'battle': G.renderBattle(main,bot); break;
    case 'reward': G.renderReward(main,bot); break;
    case 'book_reward': G.renderBookReward(main,bot); break;
    case 'rest': G.renderRest(main,bot); break;
    case 'shop': G.renderShop(main,bot); break;
    case 'bookshelf': G.renderBookshelf(main,bot); break;
    case 'gameover': G.renderGameOver(main,bot); break;
    case 'victory': G.renderVictory(main,bot); break;
    case 'partner_select': G.renderPartnerSelect(main,bot); break;
    case 'talent': G.renderTalent(main,bot); break;
    case 'event': G.renderEvent(main,bot); break;
    case 'achievements': G.renderAchievements(main,bot); break;
    case 'encyclopedia': G.renderEncyclopedia(main,bot); break;
    case 'deck_view': G.renderDeckView(main,bot); break;
  }
  if(G.updateTaskHud) G.updateTaskHud();
  if(G.triggerProducerDialogue) G.triggerProducerDialogue(s.screen, 'enter', {state:s});
};

// ==================== 里程碑 / 成就 ====================
G._achievementCategory='character'; G._achievementSelected=null; G._achievementPage=1;
G.openAchievements=function(){G._achievementCategory='character';G._achievementPage=1;G._achievementSelected=Object.keys(G.XSL_ACHV||{})[0]||null;G.state.screen='achievements';G.render();};
G.achievementList=function(category){return category==='character'?Object.keys(G.XSL_ACHV||{}):[];};
G.achievementCategory=function(category){G._achievementCategory=category;G._achievementPage=1;G._achievementSelected=G.achievementList(category)[0]||null;G.render();};
G.achievementSelect=function(id){G._achievementSelected=id;G.render();};
G.achievementPage=function(delta){let ids=G.achievementList(G._achievementCategory),max=Math.max(1,Math.ceil(ids.length/16));G._achievementPage=Math.max(1,Math.min(max,G._achievementPage+delta));G.render();};
G.renderAchievements=function(main,bot){
  let cats=[['character','角色类'],['event','事件类'],['monster','怪物类'],['special','特殊类']],ids=G.achievementList(G._achievementCategory),max=Math.max(1,Math.ceil(ids.length/16)),pageIds=ids.slice((G._achievementPage-1)*16,G._achievementPage*16),a=(G.XSL_ACHV||{})[G._achievementSelected],unlocked=!!(a&&G.meta&&G.meta.xslAchv&&G.meta.xslAchv[G._achievementSelected]),colors={1:'#d9d9d9',2:'#70c878',3:'#5e9ee8',4:'#a978e8',5:'#e7b83f',6:'#ef6870',7:'#f09cff'},color=a?(colors[a.star]||colors[1]):colors[1],reward=a&&a.unlock&&G.CARDS&&G.CARDS[a.unlock]?G.CARDS[a.unlock].name:(a&&a.unlock)||'暂无';
  main.className='achievements-mode';
  main.innerHTML=`<div class="achievement-page"><div class="achievement-top"><button class="achievement-back" onclick="G.setScreen('menu')">返回</button><div class="achievement-title">里程碑</div><div class="achievement-pages">${G._achievementPage} / ${max}</div></div><div class="achievement-tabs">${cats.map(c=>`<button class="achievement-tab ${G._achievementCategory===c[0]?'active':''}" onclick="G.achievementCategory('${c[0]}')">${c[1]}</button>`).join('')}</div><div class="achievement-body"><section class="achievement-grid-wrap"><div class="achievement-grid">${pageIds.length?pageIds.map(id=>{let x=G.XSL_ACHV[id],ok=!!(G.meta&&G.meta.xslAchv&&G.meta.xslAchv[id]);return `<button class="achievement-tile ${G._achievementSelected===id?'selected':''}" style="--ach-color:${colors[x.star]||colors[1]}" onclick="G.achievementSelect('${id}')"><span class="achievement-icon">${ok?'🏆':'?'}</span><span class="achievement-tile-name">${x.name}</span></button>`}).join(''):'<div class="achievement-empty">暂无成就</div>'}</div></section><aside class="achievement-info" style="--ach-color:${color}">${a?`<div class="achievement-info-name">${a.name}</div><div class="achievement-stars">${'★'.repeat(a.star)}<span> ${a.star}星</span></div><div class="achievement-info-row"><b>解锁条件</b><p>${a.cond}</p></div><div class="achievement-info-row"><b>奖励</b><p>${reward}</p></div><div class="achievement-info-row"><b>解锁角色</b><p>薛诗蕾</p></div><div class="achievement-status">${unlocked?'已解锁':'未解锁'}</div>`:'<div class="achievement-empty">选择一个成就查看详情</div>'}</aside></div><div class="achievement-footer"><button class="achievement-page-btn" onclick="G.achievementPage(-1)" ${G._achievementPage<=1?'disabled':''}>上一页</button><span>拖动成就区查看</span><button class="achievement-page-btn" onclick="G.achievementPage(1)" ${G._achievementPage>=max?'disabled':''}>下一页</button></div></div>`; bot.innerHTML='';
};

// --- MENU ---
G.renderMenu = function(main,bot) {
  main.innerHTML = `
    <div class="menu-wrap">
      <video class="menu-video" src="动态/video_menu.m4v" autoplay loop muted playsinline></video>
      <div class="menu-shade"></div>
      <div class="menu-content">
        <div class="menu-logo-wrap">
          <img class="menu-logo" src="UI/logo.png" alt="学生时代">
          <span class="menu-logo-badge">肉鸽版</span>
        </div>
        <div class="menu-sub">卡牌Roguelike · 选择搭档 · 渡过考试</div>
        <div class="menu-main-btns">
          <button class="menu-txt-btn" ${G.hasRunSave()?'onclick="G.continueSavedGame()"':'disabled'}>继续学业</button>
          <button class="menu-txt-btn" onclick="G.startNewGameFlow()">新生入学</button>
          <button class="menu-txt-btn" onclick="G.openSettings()">设置</button>
          <button class="menu-txt-btn" onclick="G.showToast('🚧 离开学园功能开发中')">离开学园</button>
        </div>
        <div class="menu-corner">
          <div class="corner-box" onclick="G.openEncyclopedia()"><img src="UI/img_echengbaike.png" alt="鹅城百科"><span class="cb-label">鹅城百科</span></div>
          <div class="corner-box" onclick="G.openAchievements()"><img src="UI/img_milestone.png" alt="里程碑"><span class="cb-label">里程碑</span></div>
          <div class="corner-box" onclick="G.showToast('🚧 更新日志开发中')"><img src="按钮素材/更新日志.png" alt="更新日志"><span class="cb-label">更新日志</span></div>
          <div class="corner-box" onclick="G.showToast('🚧 同学录开发中')"><img src="按钮素材/同学录.png" alt="同学录"><span class="cb-label">同学录</span></div>
        </div>
      </div>
    <div class="menu-ver">网页预览版 · ${Object.keys(G.CHARACTERS||{}).length}角色(1~5星) / 卡牌战斗 / 事件 / 用具卡系统</div>
      <audio class="menu-bgm" src="音乐/bgm_wukelili.wav" autoplay loop></audio>
    </div>`;
  bot.innerHTML = '';
  // BGM 自动播放（浏览器策略不允许时静默失败，等首次点击兜底重试）
  // 设置页（2026-08-23）：音量/开关改为读设置
  let bgm = main.querySelector('.menu-bgm');
  if(bgm) {
    if(!G.settings || G.settings.bgmOn !== false) {
      bgm.volume = G.settings ? G.settings.bgmVol / 100 : 0.5;
      bgm.play().catch(()=>{});
    }
  }
};

// ==================== 设置页（2026-08-23）====================
// 全屏覆盖式设置面板（常规游戏设置界面布局：左侧分类页签 + 右侧内容区）。
// 音频/画面/战斗偏好实时生效并持久化；数据页提供两步确认的存档重置。
G._settingsTab = 'audio';
G._settingsArm = null;    // 危险按钮两步确认：当前已"上膛"的键名（3秒内再点才执行）
G._settingsEsc = null;    // ESC 关闭监听（打开时挂、关闭时摘）
G._SETTINGS_TABS = [
  {id:'audio',   icon:'🎵', name:'音频'},
  {id:'display', icon:'🖥',  name:'画面'},
  {id:'battle',  icon:'⚔',  name:'战斗'},
  {id:'data',    icon:'💾', name:'数据'},
  {id:'about',   icon:'📜', name:'关于'}
];
// 设置齿轮按钮（fixed 右上角，紧挨 🔊，由 G.render 每帧同步，任意界面可点开设置）
G.settingsBtnSync = function() {
  if(typeof document === 'undefined' || !document.getElementById || !document.createElement) return;
  let b = document.getElementById('settingsToggle');
  if(!b) {
    b = document.createElement('div');
    b.id = 'settingsToggle';
    b.textContent = '⚙';
    b.title = '设置';
    b.onclick = function() { G.openSettings(); };
    if(document.body && document.body.appendChild) document.body.appendChild(b);
  }
};
// 全屏按钮（2026-08-29）：fixed 右上角，点按切换浏览器全屏/退出全屏
G.fullscreenBtnSync = function() {
  if(typeof document === 'undefined' || !document.getElementById || !document.createElement) return;
  let b = document.getElementById('fullscreenToggle');
  if(!b) {
    b = document.createElement('div');
    b.id = 'fullscreenToggle';
    b.textContent = '⛶';
    b.title = '全屏';
    b.onclick = function() { G.toggleFullscreen(); };
    if(document.body && document.body.appendChild) document.body.appendChild(b);
  }
  // 同步图标：已全屏时显示"退出全屏"样式
  let fs = G._isFullscreen();
  b.textContent = fs ? '🗗' : '⛶';
  b.title = fs ? '退出全屏' : '全屏';
};
G._isFullscreen = function() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
};
G.toggleFullscreen = function() {
  if(typeof document === 'undefined') return;
  let el = document.documentElement;
  let fs = G._isFullscreen();
  if(fs) {
    let fn = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
    if(fn) { try { fn.call(document); } catch(e){} }
  } else {
    // iOS Safari 不支持 Fullscreen API，给出提示
    let iOS = /iphone|ipad|ipod/i.test((navigator.userAgent||''));
    if(iOS && !(el.requestFullscreen || el.webkitRequestFullscreen)) {
      G.showToast('📱 请在 Safari 中点击分享 → 添加到主屏幕，从主屏幕图标全屏游玩');
      return;
    }
    let fn = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if(fn) {
      try { fn.call(el); } catch(e){}
    } else {
      G.showToast('⚠ 当前浏览器不支持全屏');
    }
  }
  // 图标状态更新（延迟等全屏切换完成）
  setTimeout(function(){ if(G.fullscreenBtnSync) G.fullscreenBtnSync(); }, 300);
};
G.openSettings = function() {
  if(typeof document === 'undefined' || !document.getElementById || !document.createElement) return;
  if(document.getElementById('settingsOverlay')) return; // 已开着
  G._settingsArm = null;
  let ov = document.createElement('div');
  ov.id = 'settingsOverlay';
  ov.className = 'st-overlay';
  ov.innerHTML = `
    <div class="st-panel">
      <div class="st-head">
        <span class="st-title">⚙ 设 置</span>
        <div class="st-close" title="关闭 (Esc)" onclick="G.closeSettings()">✕</div>
      </div>
      <div class="st-body">
        <div class="st-tabs" id="stTabs"></div>
        <div class="st-content" id="stContent"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 18px 10px">
        <button class="btn primary" onclick="G.closeSettings()">返回游戏</button>
        <button class="btn" onclick="G.settingsSaveAndExit()">保存并退出</button>
        <button class="btn" onclick="G.settingsReturnMenu()">返回主菜单</button>
        <button class="btn danger" id="stAbandonBtn" onclick="G.settingsAbandonGame()">放弃游戏</button>
      </div>
    </div>`;
  // 点遮罩空白处关闭（点面板内部不关）
  ov.addEventListener('click', function(ev) { if(ev.target === ov) G.closeSettings(); });
  document.body.appendChild(ov);
  G._renderSettingsTabs();
  G._renderSettingsContent();
  G._settingsEsc = function(ev) { if(ev.key === 'Escape') G.closeSettings(); };
  document.addEventListener('keydown', G._settingsEsc);
  if(G.sfx && G.sfx.play) G.sfx.play('click');
};
G.closeSettings = function() {
  let ov = (typeof document !== 'undefined' && document.getElementById) ? document.getElementById('settingsOverlay') : null;
  if(ov && ov.remove) ov.remove();
  if(G._settingsEsc) {
    if(typeof document !== 'undefined' && document.removeEventListener) document.removeEventListener('keydown', G._settingsEsc);
    G._settingsEsc = null;
  }
  G._settingsArm = null;
};
G._saveCurrentRunBeforeMenu = function() {
  if(!G.state || !G.state.character) return false;
  // 2026-09-08：选牌中的保存是安全的——saveRun 会把待结算卡写入存档，
  // 读档时通过 showCardChoice 重建选择弹窗继续选择，不再丢失未完成的结算。
  return G.saveRun();
};
G.settingsSaveAndExit = function() {
  if(G.tutorial && G.tutorial.active) { G.tutorialExitToMenu(); return; }
  let ok=G._saveCurrentRunBeforeMenu();
  // 选牌弹窗可能正打开：保存已记录待结算卡，本地界面关闭弹窗并清空选择状态，
  // 下次继续游戏时会重建选择弹窗（showCardChoice）。
  G._choiceOptions=null; G._choiceCancelCb=null;
  if(typeof G.closeModal==='function') G.closeModal();
  G.closeSettings();
  G.state.screen='menu'; G.render();
  G.showToast(ok?'💾 游戏已保存，可安全关闭页面':'当前没有可保存的游戏');
};
G.settingsReturnMenu = function() {
  if(G.tutorial && G.tutorial.active) { G.tutorialExitToMenu(); return; }
  G._saveCurrentRunBeforeMenu();
  G._choiceOptions=null; G._choiceCancelCb=null;
  if(typeof G.closeModal==='function') G.closeModal();
  G.closeSettings();
  G.state.screen='menu'; G.render();
};
G.continueSavedGame = function() {
  // 修复（2026-09-08）：读档前先备份原始存档。只有「数据无法解析/角色无效」
  // 才算无效存档；渲染类异常已在 loadRun 内部隔离，不会走到清理分支。
  let raw = null;
  try { raw = localStorage.getItem(G.RUN_SAVE_KEY); } catch(e) {}
  if(!raw) {
    G.state.screen='menu'; G.render();
    G.showToast('没有可继续的存档');
    return;
  }
  if(!G.loadRun()) {
    try { localStorage.setItem(G.RUN_SAVE_KEY + '_recovery', raw); } catch(e) {}
    G.clearRunSave();
    G.state.screen='menu';
    G.render();
    G.showToast('存档无效，已清理（原始数据已备份，可联系作者恢复），请重新开始游戏');
  }
};
G.settingsAbandonGame = function() {
  if(G._settingsArm!=='abandon_game') {
    G._settingsArm='abandon_game';
    let b=document.getElementById('stAbandonBtn');
    if(b){b.textContent='再次点击确认放弃';b.classList.add('armed');}
    setTimeout(()=>{if(G._settingsArm==='abandon_game'){G._settingsArm=null;let x=document.getElementById('stAbandonBtn');if(x){x.textContent='放弃游戏';x.classList.remove('armed');}}},3000);
    return;
  }
  G._settingsArm=null;
  let s=G.state;
  s.runStats=s.runStats||{}; s.runStats.abandons=(s.runStats.abandons||0)+1;
  s.battle=null; s.settlementReason='abandoned';
  G.closeSettings(); s.screen='victory'; G.render();
};
G._settingsGo = function(id) {
  G._settingsTab = id;
  G._settingsArm = null;
  G._renderSettingsTabs();
  G._renderSettingsContent();
  if(G.sfx && G.sfx.play) G.sfx.play('click');
};
G._renderSettingsTabs = function() {
  let box = (typeof document !== 'undefined' && document.getElementById) ? document.getElementById('stTabs') : null;
  if(!box) return;
  box.innerHTML = G._SETTINGS_TABS.map(t => `
    <div class="st-tab${G._settingsTab === t.id ? ' active' : ''}" onclick="G._settingsGo('${t.id}')">
      <span class="st-tab-icon">${t.icon}</span><span>${t.name}</span>
    </div>`).join('');
};
G._renderSettingsContent = function() {
  let box = (typeof document !== 'undefined' && document.getElementById) ? document.getElementById('stContent') : null;
  if(!box) return;
  let html;
  switch(G._settingsTab) {
    case 'display': html = G._stTabDisplay(); break;
    case 'battle':  html = G._stTabBattle();  break;
    case 'data':    html = G._stTabData();    break;
    case 'about':   html = G._stTabAbout();   break;
    default:        html = G._stTabAudio();
  }
  box.innerHTML = html;
};
// --- 设置行控件（HTML 片段）---
G._stRow = function(label, sub, ctrlHtml) {
  return `<div class="st-row">
    <div class="st-label"><div class="st-name">${label}</div>${sub ? `<div class="st-sub">${sub}</div>` : ''}</div>
    <div class="st-ctrl">${ctrlHtml}</div>
  </div>`;
};
G._stToggle = function(key) {
  return `<div class="st-toggle${G.settings[key] ? ' on' : ''}" onclick="G._setToggle('${key}')"><i class="st-knob"></i></div>`;
};
G._stSlider = function(key, disabled) {
  let v = G.settings[key];
  return `<div class="st-slider-wrap${disabled ? ' off' : ''}">
    <input type="range" min="0" max="100" value="${v}" class="st-slider" style="--fill:${v}%" ${disabled ? 'disabled' : ''}
      oninput="G._volInput(this,'${key}')" onchange="G._volChange('${key}')">
    <span class="st-val" id="stv-${key}">${v}%</span>
  </div>`;
};
// --- 设置变更 ---
G._setToggle = function(key) {
  G.settings[key] = !G.settings[key];
  G.saveSettings();
  G.applySettings();
  if(G.sfx && G.sfx.play) G.sfx.play('click');
  G._renderSettingsContent();
};
G._volInput = function(el, key) {
  G.settings[key] = +el.value;
  el.style.setProperty('--fill', el.value + '%');
  let lab = document.getElementById('stv-' + key);
  if(lab) lab.textContent = el.value + '%';
  G.applySettings(); // 拖动实时生效（音量即时变化）
};
G._volChange = function(key) {
  G.saveSettings();
  if(key === 'sfxVol' && G.sfx && G.sfx.play) G.sfx.play('click'); // 松手试听一声音效
};
G._setSpeed = function(v) {
  G.settings.battleSpeed = v;
  G.saveSettings();
  if(G.sfx && G.sfx.play) G.sfx.play('click');
  G._renderSettingsContent();
};
// --- 各页签内容 ---
G._stTabAudio = function() {
  let s = G.settings;
  return `
    <div class="st-group-title">🎵 音频</div>
    ${G._stRow('背景音乐', '主菜单循环播放的主题曲', G._stToggle('bgmOn'))}
    ${G._stRow('音乐音量', '', G._stSlider('bgmVol', !s.bgmOn))}
    ${G._stRow('战斗音效', '出牌 / 攻击 / 暴击 / 胜利等全套合成音效', G._stToggle('sfxOn'))}
    ${G._stRow('音效音量', '', G._stSlider('sfxVol', !s.sfxOn))}
    <div class="st-note">💡 提示：战斗中也可随时点右上角 🔊 快速静音</div>`;
};
G._stTabDisplay = function() {
  return `
    <div class="st-group-title">🖥 画面</div>
    ${G._stRow('屏幕震动', '攻击命中与受击时的镜头晃动（含龙族强震）', G._stToggle('shakeOn'))}
    ${G._stRow('氛围粒子特效', '战斗微尘、龙族樱花雨、银河星尘、魔戒圣光', G._stToggle('ambientOn'))}
    <div class="st-note">💡 关闭氛围粒子可提升低配设备的流畅度；龙族花瓣转场属于剧情演出，不受此开关影响</div>`;
};
G._stTabBattle = function() {
  let cur = G.settings.battleSpeed;
  let seg = [ {v:1, t:'正常'}, {v:1.5, t:'1.5倍'}, {v:2, t:'2倍'} ].map(o =>
    `<div class="st-seg-btn${cur === o.v ? ' active' : ''}" onclick="G._setSpeed(${o.v})">${o.t}</div>`).join('');
  return `
    <div class="st-group-title">⚔ 战斗</div>
    ${G._stRow('战斗节奏', '加速怪物出牌间隔与飞牌动画，结算逻辑不变', `<div class="st-seg">${seg}</div>`)}
    ${G._stRow('跳过新手教程', '新生入学时直接开放教学战斗后的路线', G._stToggle('skipTutorial'))}
    ${G._stRow('快读事件', '剧情逐字播放时，点击对话区即可立即显示全部对话与选项', G._stToggle('fastEventRead'))}
    <div class="st-note">💡 高倍速适合刷图与验证；首次体验推荐正常速度</div>`;
};
G._stTabData = function() {
  let total = Object.keys(G.CHARACTERS || {}).length;
  let unlocked = Object.keys(G.meta.unlocked || {}).length;
  let bonded = Object.keys(G.meta.bondPoints || {}).length;
  let fate = G.meta.fatePoints || 0;
  let armMeta = G._settingsArm === 'meta', armAll = G._settingsArm === 'all';
  return `
    <div class="st-group-title">💾 数据管理</div>
    <div class="st-stats">
      <div class="st-stat"><b>${unlocked}/${total}</b><span>已解锁角色</span></div>
      <div class="st-stat"><b>${bonded}</b><span>结缘角色</span></div>
      <div class="st-stat"><b>${fate}</b><span>命运点</span></div>
    </div>
    <div class="st-danger">
      <div class="st-danger-title">⚠ 危险操作（两步确认）</div>
      <button class="btn danger st-danger-btn${armMeta ? ' armed' : ''}" onclick="G._dangerClick('meta')">${armMeta ? '⚠ 再点一次，确认重置！' : '重置局外进度'}</button>
      <div class="st-danger-sub">清空羁绊点 / 关系等级 / 角色解锁（保留本页设置）</div>
      <button class="btn danger st-danger-btn${armAll ? ' armed' : ''}" onclick="G._dangerClick('all')">${armAll ? '⚠ 再点一次，确认清除！' : '清除全部本地存档'}</button>
      <div class="st-danger-sub">羁绊点 + 解锁进度 + 全部设置一并清除，并刷新页面</div>
    </div>`;
};
G._stTabAbout = function() {
  return `
    <div class="st-about">
      <img class="st-about-logo" src="UI/logo.png" alt="学生时代">
      <div class="st-about-name">学生时代牌 · 肉鸽版</div>
      <div class="st-about-ver">v${G.GAME_VERSION} 网页版${G.GAME_DATE ? ' · ' + G.GAME_DATE : ''}</div>
      ${G.GAME_NOTES ? `<div class="st-about-line">📦 ${G.GAME_NOTES}</div>` : ''}
      <div class="st-about-line">卡牌Roguelike · 选择搭档 · 渡过考试</div>
      <div class="st-about-line" style="color:#8ab4f8;font-size:10px">有新内容时：把更新包解压进游戏目录，双击「一键更新.cmd」即可</div>
      <div class="st-about-grid">
        <div>🎮 ${Object.keys(G.CHARACTERS||{}).length} 名可选角色（1~5星）</div>
        <div>🃏 90+ 卡牌 · 特供小说卡</div>
        <div>👹 25 种考试怪物</div>
        <div>✨ 39 种天赋 · 17 种事件</div>
        <div>📖 3 本名著沉浸演出</div>
        <div>🎵 Web Audio 全合成音效</div>
      </div>
      <div class="st-about-tip">界面异常时请按 Ctrl+F5 强制刷新缓存 · 测试指令：node _test.js</div>
    </div>`;
};
// --- 危险操作两步确认：第一次点击"上膛"变红，3秒内再点才执行 ---
G._dangerClick = function(key) {
  if(G._settingsArm === key) {
    G._settingsArm = null;
    if(key === 'meta') G._resetMeta();
    else G._wipeAll();
    return;
  }
  G._settingsArm = key;
  G._renderSettingsContent();
  setTimeout(function() {
    if(G._settingsArm === key) { G._settingsArm = null; G._renderSettingsContent(); }
  }, 3000);
};
G._resetMeta = function() {
  G.meta = {
    unlocked: Object.assign({}, G.DEFAULT_UNLOCKED),
    bondPoints: {}, bondLevels: {}, fatePoints: 0
  };
  G.saveMeta();
  G.showToast('🗑 局外进度已重置');
  G._renderSettingsContent();
};
G._wipeAll = function() {
  try {
    if(typeof localStorage !== 'undefined') {
      localStorage.removeItem(G.META_KEY);
      localStorage.removeItem(G.SETTINGS_KEY);
      localStorage.removeItem(G.RUN_SAVE_KEY);
      localStorage.removeItem('sfx_on');
    }
  } catch(e) {}
  G.closeSettings();
  G.showToast('🗑 已清除全部本地数据，即将刷新…');
  setTimeout(function() {
    if(typeof location !== 'undefined' && location.reload) location.reload();
  }, 800);
};

// --- CHARACTER SELECT（v2：左侧小头像 + 右侧立绘框/信息框）---
G._selectedStar = 1;
G._selCharId = 'xueshilei';
G._setStar = function(lv) { G._selectedStar = lv; G.render(); };
G._selChar = function(id) { G._selCharId = id; G.render(); };
G._huxiaomengPage='ex';
G._characterFormPages={};
G.selectCharacterFormPage=function(id,page){G._characterFormPages[id]=page==='ex'?'ex':'normal';G.render();};
G.selectHuxiaomengPage=function(page){G._huxiaomengPage=page==='normal'?'normal':'ex';G.render();};
// ===== 选角色页壁纸（2026-08-23）：专属背景图优先，其余角色暂借三本小说壁纸轮换 =====
// 有专属壁纸的角色写进 CHAR_WALL（图片放 其他插画/ 下）；正式壁纸陆续到位后往这里加即可
G.CHAR_WALL = {
  xueshilei: '其他插画/小蕾背景.png',
  xiaoqingya: '其他插画/肖清雅背景.png',
};
G.CHAR_WALL_ORDER = ['longzu', 'yinhe', 'mojie']; // 无专属壁纸角色的轮换兜底
G.charWallFor = function(charId) {
  if(G.CHAR_WALL[charId]) return G.CHAR_WALL[charId]; // 专属壁纸优先
  let ids = Object.keys(G.CHARACTERS);
  let i = ids.indexOf(charId);
  if(i < 0) i = 0;
  let key = G.CHAR_WALL_ORDER[i % G.CHAR_WALL_ORDER.length];
  return (G.NOVEL_SCENE[key] && G.NOVEL_SCENE[key].img) || null;
};
// 每次渲染同步：进选角色页挂层渐显；切角色交叉渐变（两层轮换）；离开页面立即撤层
G.charWallSync = function() {
  let layer = (typeof document !== 'undefined' && document.getElementById) ? document.getElementById('charwall') : null;
  if(!G.state || G.state.screen !== 'charSelect') {
    if(layer && layer.remove) layer.remove();
    return;
  }
  let img = G.charWallFor(G._selCharId);
  if(!img) { if(layer && layer.remove) layer.remove(); return; }
  if(!layer) {
    layer = document.createElement('div');
    layer.id = 'charwall';
    layer.innerHTML = '<div class="cw-shade"></div><div class="cw-layer" id="cwA"></div><div class="cw-layer" id="cwB"></div>';
    document.body.appendChild(layer);
    void layer.offsetWidth; // reflow 后再加 .show，确保入场 opacity 渐显动画生效
    layer.classList.add('show');
  }
  let a = document.getElementById('cwA'), b = document.getElementById('cwB');
  if(!a || !b) return;
  let url = "url('" + img + "')";
  // 目标图已在某层（两个角色共用同一张壁纸时）：保证那层在前台即可，无需重刷
  if((a.style.backgroundImage || '') === url || (b.style.backgroundImage || '') === url) {
    let target = (a.style.backgroundImage || '') === url ? a : b;
    if(!target.classList.contains('on')) {
      target.classList.add('on');
      (target === a ? b : a).classList.remove('on');
      layer.dataset.cur = target === a ? 'A' : 'B';
    }
    return;
  }
  // 新图放入后台层 → 淡入盖过前台层（0.7s 交叉渐变，CSS 过渡驱动）
  let cur = layer.dataset.cur || 'A';
  let front = cur === 'A' ? a : b, back = cur === 'A' ? b : a;
  back.style.backgroundImage = url;
  front.classList.remove('on');
  back.classList.add('on');
  layer.dataset.cur = cur === 'A' ? 'B' : 'A';
};
// 左侧角色列表：平滑滚动+吸附+无限循环（含占位卡一起转）
G._socScroll = 0;
G._socMocks = 5; // 临时：模拟未来角色的占位卡数量（之后删除）
G._socTotal = function() { return Object.keys(G.CHARACTERS).length + (G._socMocks || 0); };
G._socCardPx = function() {
  let list = document.getElementById('socList');
  let h = (list && list.clientHeight) || (typeof window !== 'undefined' && window.innerHeight ? window.innerHeight * 0.8 : 800);
  return Math.max(72, Math.round(h * 0.135));
};
G._socStep = function() { return G._socCardPx() + 10; };
// 渲染后恢复滚动位置（无动画）
G._socApply = function(animate) {
  let track = document.getElementById('socTrack');
  if(!track || !track.style) return;
  let setLen = G._socTotal() * G._socStep();
  G._socScroll = ((G._socScroll % setLen) + setLen) % setLen;
  if(!animate) track.style.transition = 'none';
  track.style.transform = 'translateY(' + (-G._socScroll) + 'px)';
  if(!animate) { void track.offsetHeight; track.style.transition = ''; }
};
// 滚轮：平滑滚动 + 吸附最近卡片 + 无限循环（滑进克隆区后静默归位，无跳变无卡顿）
G._socSpin = function(ev) {
  if(ev) ev.preventDefault();
  let step = G._socStep();
  let setLen = G._socTotal() * step;
  let delta = (ev && ev.deltaY) ? ev.deltaY * 0.8 : step;
  let next = G._socScroll + delta;
  let target = Math.round(next / step) * step;
  // 极端连滚保护：超出一组克隆区时立即静默归一
  let track = document.getElementById('socTrack');
  let instant = false;
  while(target >= setLen * 2) { target -= setLen; instant = true; }
  while(target < -setLen) { target += setLen; instant = true; }
  G._socScroll = target;
  if(track && track.style) {
    track.style.transition = instant ? 'none' : '';
    track.style.transform = 'translateY(' + (-target) + 'px)';
    if(instant) { void track.offsetHeight; track.style.transition = ''; }
  }
  // 动画结束后若在克隆区，静默归位（内容相同→无感）
  clearTimeout(G._socT);
  G._socT = setTimeout(() => {
    let s = G._socScroll;
    let setLen2 = G._socTotal() * G._socStep();
    if(s >= setLen2) { G._socScroll = s - setLen2; }
    else if(s < 0) { G._socScroll = s + setLen2; }
    else return;
    let tr = document.getElementById('socTrack');
    if(tr && tr.style) {
      tr.style.transition = 'none';
      tr.style.transform = 'translateY(' + (-G._socScroll) + 'px)';
      void tr.offsetHeight;
      tr.style.transition = '';
    }
  }, 500);
};
// 关系等级（星级 → 关系等级，2026-08-15 关注同学页；1~5星=朋友/好友/密友/挚友/至交，用户定）
G.REL_NAMES = {1:'朋友',2:'好友',3:'密友',4:'挚友',5:'至交'};
G.REL_COLORS = {1:'#3898e8',2:'#9868d8',3:'#f8a838',4:'#e84858',5:'#f82828'};
// 难度（上下键切换）
G.DIFF_LIST = ['普通','困难','地狱'];
G.DIFF_MULT = {普通:{hp:1,stat:1},困难:{hp:1.3,stat:1.15},地狱:{hp:1.6,stat:1.3}};
G._difficulty = '普通';
G._diffNext = function(dir) {
  let i = G.DIFF_LIST.indexOf(G._difficulty);
  i = Math.min(G.DIFF_LIST.length-1, Math.max(0, i + dir));
  G._difficulty = G.DIFF_LIST[i];
  G.render();
};
// 选中星级下的有效三属性（含升星属性加成）
G.charEffectiveStats = function(ch, star) {
  let p = ch.physique, i = ch.intelligence, e = ch.eq;
  for(let lv=2; lv<=star; lv++) {
    let st = ch.stars[lv];
    if(!st || !st.stats) continue;
    if(st.stats.physique) p += st.stats.physique;
    if(st.stats.intelligence) i += st.stats.intelligence;
    if(st.stats.eq) e += st.stats.eq;
  }
  return {physique:p, intelligence:i, eq:e};
};
// 升星效果列表：只列升星给予的技能和卡牌，纯数值加成不列入
G.charStarSkills = function(ch, star) {
  let lines = [];
  for(let lv=2; lv<=star; lv++) {
    let st = ch.stars[lv];
    if(!st) continue;
    if(st.passive || st.battleStart) lines.push({lv:lv, text:st.desc});
    if(st.deckAdd) {
      let names = st.deckAdd.map(id => { let cd = G.getCardData(id); return cd ? cd.name : id; });
      lines.push({lv:lv, text:`获得卡牌「${names.join('」「')}」`});
    }
  }
  return lines;
};
// 角色立绘框（未配置 portrait 时显示动画占位）
G.charPortraitHtml = function(ch) {
  let art = ch.portrait;
  if(art) {
    if(typeof art === 'object' && art.video)
      return `<video class="portrait-art" src="${art.video}" autoplay loop muted playsinline></video>`;
    let src = typeof art === 'string' ? art : art.img;
    if(src) return `<img class="portrait-art" src="${src}" alt="${ch.name}">`;
  }
  return `<div class="portrait-ph">
    <span class="portrait-emoji">${ch.emoji}</span>
    <span class="portrait-name">${ch.name}</span>
    <span class="portrait-hint">立绘待添加</span>
  </div>`;
};
// 卡组预览弹窗（初始卡组 + 5星入卡，不含局内增减）
G.showCharDeckModal = function(charId, star) {
  let ch = G.CHARACTERS[charId];
  let deck = [...ch.starterDeck, ...G.DEFAULT_DECK_CARDS];
  if(star >= 5 && ch.stars[5] && ch.stars[5].deckAdd) deck.push(...ch.stars[5].deckAdd);
  let counts = {};
  deck.forEach(cid => counts[cid] = (counts[cid]||0) + 1);
  let typeNames = {logic:'🔴逻辑',idea:'🔵思路',answer:'🟡解答',tool:'🟢用具'};
  let entries = Object.entries(counts).sort((a,b) => {
    let ca = G.getCardData(a[0]), cb = G.getCardData(b[0]);
    if(!ca || !cb) return 0;
    let order = {logic:0,idea:1,answer:2,tool:3};
    return (order[ca.type]||0) - (order[cb.type]||0);
  });
  let html = `<h3 class="paper-title">🃏 ${ch.name}的卡组（${star}星·${G.REL_NAMES[star]||''}）</h3>
    <p class="paper-sub">共 ${deck.length} 张卡</p>
    <div class="deck-grid">
      ${entries.map(([cid,count]) => {
        let cd = G.getCardData(cid);
        if(!cd) return '';
        return G.cardFaceHtml(cd, {count: count});
      }).join('')}
    </div>
    <button class="btn" style="width:100%;margin-top:10px" onclick="G.closeModal()">关闭</button>`;
  G.showModal(html, 'paper');
};
G.renderCharSelect = function(main,bot) {
  let chars = Object.values(G.CHARACTERS);
  let star = G._selectedStar || 1;
  let sel = G.CHARACTERS[G._selCharId] || chars[0];
  G._selCharId = sel.id;
  // 信息框数值（与开局逻辑一致）
  let eff = G.charEffectiveStats(sel, star);
  let maxE = 5 + Math.floor(eff.physique / 15);
  let regen = 2;
  if(star >= 3 && sel.stars[3] && sel.stars[3].energyBonus) {
    maxE += sel.stars[3].energyBonus.max || 0;
    regen += sel.stars[3].energyBonus.regen || 0;
  }
  let starLines = G.charStarSkills(sel, star);
  let deckCount = sel.starterDeck.length + G.DEFAULT_DECK_CARDS.length + ((star>=5 && sel.stars[5] && sel.stars[5].deckAdd) ? sel.stars[5].deckAdd.length : 0);
  // 局外数据：解锁 / 羁绊点 / 关系等级 / 命运点（2026-08-21）
  // 测试版：全部角色可直接选择，并可用任意关系阶段开局。
  let unlocked = true;
  let bondLv = G.bondLevelOf(sel.id);
  let bondPts = G.bondPointsOf(sel.id);
  let nextNeed = G.nextBondNeed(sel.id);
  let fatePts = G.meta.fatePoints || 0;
  let startStar = star;
  // 左侧同学卡（循环列表：滚轮旋转，无限循环，占位卡一起转）
  let charItem = (ch) => {
    // 选角列表使用专门的头像文件，不与右侧大立绘/Q版战斗立绘混用。
    let avatarArt = ch.selectAvatar || ch.avatar || ch.portrait;
    if(ch.id==='xiaomeng_fiora') avatarArt=G._huxiaomengPage==='ex'?(ch.exSelectAvatar||ch.selectAvatar):(ch.selectAvatar||ch.portrait);
    let ava = avatarArt
      ? `<img class="av-img-art${ch.id==='xiaomeng_fiora'?' av-upper':''}" src="${avatarArt}" alt="${ch.name}">`
      : `<span class="av-emoji">${ch.emoji}</span>`;
    let locked = false;
    return `<div class="soc-card ${ch.id===sel.id?'sel':''} ${locked?'locked':''}" onclick="G._selChar('${ch.id}')">
      <div class="sc-ava">${ava}</div>
      <span class="sc-name">${ch.name}</span>
      ${locked?'<span class="sc-badge sc-badge-lock">🔒</span>':''}
    </div>`;
  };
  let mockItem = () => `<div class="soc-card mock">
    <div class="sc-ava"><span class="av-emoji">📘</span></div>
    <span class="sc-name">待加入</span>
  </div>`;
  let items = chars.map(ch => ({t:'c', ch}));
  for(let i = 0; i < (G._socMocks || 0); i++) items.push({t:'m'});
  let setHtml = items.map(it => it.t === 'c' ? charItem(it.ch) : mockItem()).join('');
  let cardPx = G._socCardPx();
  // 大立绘（未配置 portrait 时显示占位）
  let selectHeroArt = sel.selectPortrait || sel.portrait;
  if(sel.id==='xiaomeng_fiora'&&G._huxiaomengPage==='ex')selectHeroArt=sel.exPortrait||selectHeroArt;
  let heroClass = sel.id==='xiaomeng_fiora'
    ? (G._huxiaomengPage==='ex' ? ' hero-huxiaomeng-ex' : ' hero-huxiaomeng-normal')
    : '';
  let heroHtml = selectHeroArt
    ? `<img class="hero-art${heroClass}" src="${selectHeroArt}" alt="${sel.name}">`
    : `<div class="hero-ph"><span class="portrait-emoji">${sel.emoji}</span><span class="portrait-hint">立绘待添加</span></div>`;
  let diff = G._difficulty || '普通';
  // 关系效果五格（原版等级与羁绊点门槛；达到=所选星级≥对应星级，羁绊点系统落地后改读实际值）
  // 星级对应关系（用户定）：1星=朋友 2星=好友 3星=密友 4星=挚友 5星=至交
  let statNames = {physique:'体魄',intelligence:'智力',eq:'情商'};
  let star5 = sel.stars[5] || {};
  let star5stats = star5.stats ? Object.entries(star5.stats).map(([k,v]) => statNames[k]+'+'+v).join('、') : '';
  let star5deck = star5.deckAdd ? star5.deckAdd.map(id => { let cd = G.getCardData(id); return cd ? cd : null; }).filter(Boolean) : [];
  let charTip = text => String(text||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  // kind 配色（用户定）：只有技能名/天赋名/卡牌名变色（蓝/紫/金），效果里的其他字一律默认色
  // 好友格(2星被动)只给天赋名上色：desc 形如「勤卷（被动）：每使用三张逻辑卡，摸一张逻辑卡」
  let star2Line = null;
  if(sel.stars[2]) {
    let d = sel.stars[2].desc;
    let i1 = d.indexOf('（'), i2 = d.indexOf('：');
    star2Line = i1 >= 0 ? {hl: d.slice(0,i1), post: d.slice(i1), kind:'talent', tip:d}
      : {hl: i2>=0 ? d.slice(0,i2) : d, post: i2>=0 ? d.slice(i2) : '', kind:'talent', tip:d};
  }
  // 关系名配色保留原版提取色（朋友#3898e8/好友#9868d8/密友#f8a838/挚友#e84858/至交#f82828）
  let effLevels = [
    {name:'朋友', pts:30,  need:1, flex:1.3, color:'#3898e8', lines:[]},
    {name:'好友', pts:80,  need:2, flex:1.5, color:'#9868d8', lines: star2Line ? [star2Line] : []},
    {name:'密友', pts:150, need:3, flex:1,   color:'#f8a838', lines: sel.stars[3] ? [{text: sel.stars[3].desc}] : []},
    {name:'挚友', pts:250, need:4, flex:1.6, color:'#e84858', lines: sel.stars[4] ? [{pre:'解锁并在开局拥有紫色天赋', hl:'【' + (sel.stars[4].name||'') + '】', kind:'talent', tip: sel.stars[4].desc + '\n（解锁后进入天赋池，可被其他角色刷到）'}] : []},
    {name:'至交', pts:400, need:5, flex:1.8, color:'#f82828', lines: [].concat(
      star5stats ? [{text: '属性提升：' + star5stats}] : [],
      star5deck.length ? [{pre:'获得卡牌', hl:'【' + star5deck.map(c=>c.name).join('】【') + '】', kind:'card', tip: star5deck.map(c => c.name + '：' + c.desc).join('\n')}] : []
    )}
  ].map(el => { el.reached = star >= el.need; return el; });
  // 朋友格内容（1星=基础）：初始技能（悬浮看详情，技能名蓝色）+ 初始卡组（点击弹窗看卡组，无卡牌名不上色）
  let friendLines = `<div class="eff-lines">
    <div class="eff-line" data-tip="${charTip(`【${sel.skill.name}】\nCD${sel.skill.cd}　${sel.skill.desc}`)}">获得初始技能<span class="eff-k-skill">【${sel.skill.name}】</span></div>
    <div class="eff-line eff-click" onclick="G.showCharDeckModal('${sel.id}',${star})">获得初始卡组 ▸点击查看</div>
  </div>`;
  main.innerHTML = `
    <div class="soc-wrap">
      <div class="soc-bigframe"></div>
      <div class="soc-list" id="socList" onwheel="G._socSpin(event)" style="--cardH:${cardPx}px"><div class="soc-track" id="socTrack">${setHtml}${setHtml}${setHtml}</div></div>
      <div class="soc-hero">
        ${heroHtml}
      </div>
      <!-- 三个功能框（用户命名，仅沟通用）：属性框 / 信息框 / 物品框 -->
      <div class="soc-slot soc-slot-attr" style="top:11.5%;height:23%"><span class="ss-label">能力</span>
        <div class="attr-icons">
          <div class="attr-row"><img src="社交/智力.png" alt="智力"><span class="attr-val attr-val-i">${eff.intelligence}</span></div>
          <div class="attr-row"><img src="社交/情商.png" alt="情商"><span class="attr-val attr-val-e">${eff.eq}</span></div>
          <div class="attr-row"><img src="社交/体魄.png" alt="体魄"><span class="attr-val attr-val-p">${eff.physique}</span></div>
        </div>
      </div>
      <div class="soc-slot soc-slot-info" style="top:35%;height:23%"><span class="ss-label">资料</span>
        <div class="info-rows">
          <div class="info-row"><span class="ir-lbl">姓名</span><span class="ir-val">${sel.name}</span></div>
          <div class="info-row"><span class="ir-lbl">生日</span><span class="ir-val">${sel.birthday || ''}</span></div>
          <div class="info-row"><span class="ir-lbl">学校</span><span class="ir-val">${sel.school || '鹅城一中'}</span></div>
          <div class="info-row"><span class="ir-lbl">班级</span><span class="ir-val">${sel.className || '高一(1)班'}</span></div>
        </div>
      </div>
      <div class="soc-slot soc-slot-item" style="top:70%;height:25%"><span class="ss-label">珍视之物</span>
        <div class="item-rows">
          <div class="item-row">
            <span class="item-lbl" title="测试版可直接选择任意关系阶段开始游戏">测试关系</span>
            <div class="star-btns">
              ${[1,2,3,4,5].map(lv => `<button class="star-btn ${lv===star?'on':''}" onclick="G._setStar(${lv})" title="以${G.REL_NAMES[lv]||''}关系开始游戏">${G.REL_NAMES[lv]||lv}</button>`).join('')}
            </div>
          </div>
          <div class="item-row">
            <span class="item-lbl">羁绊点</span>
            <span class="item-val" style="color:#e04858">${bondPts}</span>
            <button class="upgrade-btn" onclick="G.upgradeBondLevel('${sel.id}')" title="${nextNeed==null?'已满级':('还需 '+(nextNeed-bondPts)+' 点升至下一级')}" ${nextNeed==null||bondPts<nextNeed?'disabled':''}>${nextNeed==null?'已满':'提升'}</button>
          </div>
          <div class="item-row">
            <span class="item-lbl">命运点</span>
            <span class="item-val" style="color:#8058e8">${fatePts}</span>
          </div>
        </div>
      </div>
      <div class="soc-effects"><span class="ss-label">关系效果</span>
        <div class="eff-grid">
          ${effLevels.map((el,i) => `
          <div class="eff-cell" style="flex:${el.flex}"><span class="eff-tag ${el.reached?'reached':''}">成为<span ${el.reached?'':`style="color:${el.color}"`}>${el.name}</span>时（羁绊点≥${el.pts}）${el.reached?'<span class="eff-check">✓</span>':''}</span>${el.name==='朋友' ? friendLines : (el.lines.length ? `<div class="eff-lines">${el.lines.map(ln => {let body=`${ln.text||''}${ln.pre||''}${ln.hl||''}${ln.post||''}`,tip=ln.tip||(/[\u3010】]/.test(body)?body:'');return `<div class="eff-line eff-line-w" ${tip?`data-tip="${charTip(tip)}"`:''}>${ln.text||''}${ln.pre||''}${ln.kind&&ln.hl?`<span class="eff-k-${ln.kind}">${ln.hl}</span>`:''}${ln.post||''}</div>`;}).join('')}</div>` : '')}</div>`).join('')}
        </div>
      </div>
      <div class="soc-startbar">
        <div class="diff-arrows">
          <button class="diff-arrow" title="提高难度" onclick="G._diffNext(1)"></button>
          <button class="diff-arrow down" title="降低难度" onclick="G._diffNext(-1)"></button>
        </div>
        <div class="diff-box"><div class="db-title">难度</div><div class="db-val">${diff}</div></div>
        ${unlocked
          ? `<button class="start-follow-btn" onclick="G.resetRun('${sel.id}',${startStar})">开始游戏</button>`
          : `<button class="start-follow-btn" onclick="G.followChar('${sel.id}')">关注同学</button>`}
      </div>
      <button class="soc-back" title="返回" onclick="G.setScreen('menu')">✕</button>
    </div>`;
  bot.innerHTML = '';
  G._socApply(false);
  // 关系面板本身是可滚动容器，CSS 伪元素提示会被裁掉；改为复用顶层提示框。
  main.querySelectorAll('.soc-effects .eff-line[data-tip]').forEach(el => {
    el.addEventListener('mouseenter', ev => G.showBuffTooltip(ev, el.dataset.tip));
    el.addEventListener('mousemove', G.moveBuffTooltip);
    el.addEventListener('mouseleave', G.hideBuffTooltip);
  });
  // 胡哓萌与小萌·霜眠为两位独立角色。正常版仅预留页面，EX沿用剑姬数据和旧存档ID。
  if(sel.id==='xiaomeng_fiora'){
    let normal=G._huxiaomengPage==='normal',panel=main.querySelector('.soc-effects');
    let pages=document.createElement('div');pages.className='character-form-pages';
    panel.classList.add('has-form-pages');
    pages.innerHTML=`<button class="form-page ${normal?'selected':''}" aria-pressed="${normal}" onclick="G.selectHuxiaomengPage('normal')">1 · 正常</button><span class="form-page-divider" aria-hidden="true">/</span><button class="form-page ${normal?'':'selected'}" aria-pressed="${!normal}" onclick="G.selectHuxiaomengPage('ex')">2 · EX</button>`;
    panel.prepend(pages);
    if(normal){
      panel.querySelector('.eff-grid').innerHTML='<div style="margin:auto;text-align:center;color:#765f3d;line-height:2">胡哓萌 · 正常版<br>卡组与关系效果待开发<br>请切换到第2页使用EX剑姬版</div>';
      main.querySelector('.soc-hero').innerHTML=`<img class="hero-art hero-huxiaomeng-normal" src="${sel.selectPortrait||sel.portrait}" alt="${sel.name}">`;
      main.querySelectorAll('.attr-val').forEach(e=>e.textContent='—');
      let start=main.querySelector('.start-follow-btn');start.disabled=true;start.removeAttribute('onclick');start.textContent='正常版待开发';
    }
  }else{
    let panel=main.querySelector('.soc-effects');
    panel.classList.add('has-form-pages');
    let ex=G._characterFormPages[sel.id]==='ex';
    let pages=document.createElement('div');
    pages.className='character-form-pages';
    pages.innerHTML=`<button class="form-page ${ex?'':'selected'}" aria-pressed="${!ex}" onclick="G.selectCharacterFormPage('${sel.id}','normal')">1 · 正常</button><span class="form-page-divider" aria-hidden="true">/</span><button class="form-page ${ex?'selected':''}" aria-pressed="${ex}" onclick="G.selectCharacterFormPage('${sel.id}','ex')">2 · EX</button>`;
    panel.prepend(pages);
    if(ex){
      panel.querySelector('.eff-grid').innerHTML='<div style="margin:auto;text-align:center;color:#765f3d;line-height:2">EX版待开发<br>卡组与关系效果待开发<br>请切换到第1页使用正常版</div>';
      main.querySelectorAll('.attr-val').forEach(e=>e.textContent='—');
      let start=main.querySelector('.start-follow-btn');start.disabled=true;start.removeAttribute('onclick');start.textContent='EX版待开发';
    }
  }
};

// --- MAP ---
// 特殊节点介绍（前瞻面板用）
G.NODE_INTROS = {
  rest:'回复生命（20%最大+20%已损失生命），可移除一张卡牌',
  talent:'从三个随机天赋中选择一个',
  partner_select:'从搭档中选择一位同行',
  battle_tutorial:'教学战斗：熟悉出牌',
  monthly_exam:'月考精英：胜利后必得天赋三选',
  final_exam:'期末考：本学年最强怪物',
};
// 前瞻：接下来2个节点及各自后续1个节点（分支并列也算；去重，按推进排序）
G.mapPreview = function() {
  let s = G.state;
  let cm = s.chapterMap;
  if(!cm) return [];
  let done = s.completedNodes || {};
  // 修复（2026-08-19）：起点改为「当前可达节点」。原实现取未完成节点的最小row，
  // 但走分支后同行兄弟节点被锁定且永远未完成，前瞻集合被锁死的旧分支占据，
  // 2步展开够不到真正可达的节点 → 深处节点点不了（打到第5关后按不了下面的关卡）
  let startNodes = cm.nodes.filter(n => s.reachableNodes[n.id] && !done[n.id]);
  if(!startNodes.length) return [];
  let step1 = startNodes.sort((a,b)=>a.row-b.row || a.col-b.col);
  let seen = new Set(step1.map(n=>n.id));
  let out = [...step1];
  for(let step = 0; step < 2; step++) {
    let next = [];
    out.forEach(n => {
      (cm.edgeMap[n.id]||[]).forEach(id => {
        let x = G.getNode(id);
        if(x && !done[x.id] && !seen.has(x.id)) { seen.add(x.id); next.push(x); }
      });
    });
    next.sort((a,b)=>a.row-b.row || a.col-b.col);
    out = next;
    step1 = step1.concat(next);
  }
  return step1;
};
// 前瞻单个节点信息：怪物(名字+天赋若有)/事件(名+配文,不含内容)/特殊节点介绍
G.nodeInfoHtml = function(n) {
  let s = G.state;
  if(n.type === 'quiz' || n.type === 'monthly_exam' || n.type === 'final_exam' || n.type === 'battle_tutorial') {
    let m = G.MONSTERS[n.monsterId];
    if(m) {
      let t = m.talent ? `<div class="pv-line" title="${G.monsterTalentTip(m)}">天赋：【${m.talent}】${m.talentDesc?`　${m.talentDesc}`:''}</div>` : '';
      let intro = G.NODE_INTROS[n.type] ? `<div class="pv-line">${G.NODE_INTROS[n.type]}</div>` : '';
      return `<div class="pv-chip ${n.type}"><span class="pv-emoji">${n.emoji}</span><div class="pv-body"><div class="pv-name">⚔️ ${m.name}</div>${t}${m.subject?`<div class="pv-line">学科：${m.subject}</div>`:''}${intro}</div></div>`;
    }
  }
  if(n.type === 'event') {
    let ev = G.EVENTS[s.nodeEvents[n.id]];
    if(ev) return `<div class="pv-chip event"><span class="pv-emoji">${ev.emoji}</span><div class="pv-body"><div class="pv-name">${ev.name}</div><div class="pv-line pv-flavor">${ev.desc}</div></div></div>`;
  }
  let intro = G.NODE_INTROS[n.type] || '';
  return `<div class="pv-chip ${n.type||''}"><span class="pv-emoji">${n.emoji}</span><div class="pv-body"><div class="pv-name">${n.label}</div>${intro?`<div class="pv-line">${intro}</div>`:''}</div></div>`;
};

// 节点弹窗右侧大屏（2026-08-21 用户需求）：点击节点显示/点击其他节点切换/点击空白处关闭
// 怪物节点弹窗显示其所有卡牌
G.showMapPanel = function(nodeId) {
  let s = G.state;
  let n = G.getNode(nodeId);
  if(!n) return;
  let panel = document.getElementById('mapPanel');
  if(!panel) return;
  let html = '';
  let typeEm = {logic:'💥',idea:'💡',answer:'⭐',tool:'🔧'};
  if(n.type === 'quiz' || n.type === 'monthly_exam' || n.type === 'final_exam' || n.type === 'battle_tutorial') {
    let m = G.MONSTERS[n.monsterId];
    if(m) {
      html += `<div class="mp-title">⚔️ ${m.name}</div>`;
      if(m.subject) html += `<div class="mp-row">学科：${m.subject}</div>`;
      if(m.talent) html += `<div class="mp-row" style="color:#e0a040" title="${G.monsterTalentTip(m)}">天赋：【${m.talent}】${m.talentDesc?`　${m.talentDesc}`:''}</div>`;
      if(G.NODE_INTROS[n.type]) html += `<div class="mp-row" style="color:#8ab4f8">${G.NODE_INTROS[n.type]}</div>`;
      html += `<div class="mp-row" style="margin-top:6px;color:#765f3d;border-bottom:1px solid #c9ad75;padding-bottom:4px">卡牌（${(m.deck||[]).length}）</div>`;
      html += `<div class="mp-cards">${(m.deck||[]).map((c,i) => G.cardFaceHtml({...c,id:c.id||`map_monster_${i}`,q:c.q||'green',emoji:c.emoji||typeEm[c.type]||'🃏'},{cls:'map-preview-card',preview:true})).join('')}</div>`;
    }
  } else if(n.type === 'event') {
    let ev = G.EVENTS[s.nodeEvents[n.id]];
    if(ev) {
      html += `<div class="mp-title">${ev.emoji} ${ev.name}</div>`;
      html += `<div class="mp-row" style="line-height:1.6">${ev.desc}</div>`;
    }
  }
  if(!html) {
    html += `<div class="mp-title">${n.label}</div>`;
    if(G.NODE_INTROS[n.type]) html += `<div class="mp-row" style="line-height:1.6">${G.NODE_INTROS[n.type]}</div>`;
  }
  let reachable = !!s.reachableNodes[n.id];
  let done = !!s.completedNodes[n.id];
  let status = done ? '✅ 已完成' : (reachable ? '🟢 可前往' : '🔒 尚未解锁');
  html += `<div class="mp-status" style="color:${done?'#80e0b0':(reachable?'#40e060':'#6a8aaa')}">${status}</div>`;
  if(reachable) html += `<div class="mp-go-wrap"><button class="btn primary mp-go" onclick="G.clickNode('${n.id}')">出发</button></div>`;
  panel.innerHTML = html;
  let panelRect=panel.getBoundingClientRect();
  panel.style.setProperty('--map-go-left',(panelRect.left+22)+'px');
  panel.style.setProperty('--map-go-top',(panelRect.top+panelRect.height/2)+'px');
  panel.classList.add('open');
};
G.closeMapPanel = function() {
  let panel = document.getElementById('mapPanel');
  if(panel) panel.classList.remove('open');
};

G.renderMap = function(main,bot) {
  let s = G.state;
  if(!s.chapterMap) { main.innerHTML='<p>地图未生成</p>'; return; }

  // Group nodes by 推进步（从左往右：row=推进步，col=上下分支）
  let rows = {};
  s.chapterMap.nodes.forEach(n => {
    if(!rows[n.row]) rows[n.row] = [];
    rows[n.row].push(n);
  });

  let maxRow = Math.max(...Object.keys(rows).map(Number));
  // 前瞻节点集合：接下来2个节点及各自后续1个节点——只有这些节点点击弹窗（用户定 2026-08-16）
  G._pvSet = new Set(G.mapPreview().map(n=>n.id));
  let html = `<h3 style="text-align:center;color:#ffd700;margin-bottom:4px">📖 ${s.chapterMap.name}</h3>
    <p style="text-align:center;color:#8ab4f8;font-size:10px;margin-bottom:8px">点击接下来的节点查看信息，弹窗中可前往</p>
    <div class="map-scroll">
    <div class="map-hwrap">`;

  for(let r=0;r<=maxRow;r++) {
    if(!rows[r]) continue;
    let rowNodes = rows[r].sort((a,b) => a.col - b.col);
    // Check if this row has branches (nodes with col != 0)
    let hasBranches = rowNodes.some(n => n.col !== 0);
    if(hasBranches) {
      // 分支列内上下堆叠：左分支在上、中间、右分支在下
      let leftNodes = rowNodes.filter(n => n.col < 0);
      let centerNodes = rowNodes.filter(n => n.col === 0);
      let rightNodes = rowNodes.filter(n => n.col > 0);
      html += `<div class="map-branch">`;
      html += `<div class="map-branch-col">${leftNodes.map(n => G.renderMapNode(n)).join('')}</div>`;
      if(centerNodes.length>0) html += `<div class="map-branch-col">${centerNodes.map(n=>G.renderMapNode(n)).join('')}</div>`;
      html += `<div class="map-branch-col">${rightNodes.map(n => G.renderMapNode(n)).join('')}</div>`;
      html += `</div>`;
    } else {
      html += `<div class="map-row">${rowNodes.map(n => G.renderMapNode(n)).join('')}</div>`;
    }
    // 横向连接线（最后一列不加）
    if(r < maxRow) html += `<div class="map-connector"></div>`;
  }
  // 节点详情固定在地图节点区下方，不与节点重叠。
  html += `</div></div>
    <div id="mapPanel"><div class="mp-hint">点击节点查看信息<br><br>点击空白处关闭</div></div>`;
  main.innerHTML = html;

  // 点击空白处关闭节点面板
  let mapScroll = main.querySelector('.map-scroll');
  if(mapScroll) mapScroll.onclick = () => G.closeMapPanel();
  // Attach click handlers：只有前瞻集合内的节点（接下来2个+各自后续）点击弹窗
  // 天赋节点直接进入天赋事件（2026-08-21），其余节点显示右侧大屏面板
  s.chapterMap.nodes.forEach(n => {
    let el = document.getElementById('node-'+n.id);
    // 前瞻节点可查看详情；当前可达节点无论是否在前瞻集合内都必须能进入，尤其是高考节点。
    if(el && (G._pvSet.has(n.id) || s.reachableNodes[n.id])) {
      if(n.type === 'talent' && s.reachableNodes[n.id]) {
        el.onclick = (ev) => { if(ev) ev.stopPropagation(); G.clickNode(n.id); };
      } else {
        el.onclick = (ev) => { if(ev) ev.stopPropagation(); G.showMapPanel(n.id); };
      }
    }
  });

  bot.innerHTML = '';
};

G.renderMapNode = function(n) {
  let s = G.state;
  let cls = 'map-node';
  if(n.type==='monthly_exam'||n.type==='final_exam') cls += ' boss';
  if(s.completedNodes[n.id]) cls += ' done';
  else if(s.reachableNodes[n.id]) cls += ' reachable';
  else cls += ' locked';
  if(s.currentNodeId === n.id && !s.completedNodes[n.id]) cls += ' current';
  // 前瞻节点：可点击弹窗查看信息（locked 恢复点击，cursor=help）
  if(G._pvSet && G._pvSet.has(n.id)) cls += ' pv-avail';
  // 事件节点: 悬浮预览已分配的事件（决定路线用）
  let title = n.label;
  if(n.type === 'event' && s.nodeEvents[n.id]) {
    let ev = G.EVENTS[s.nodeEvents[n.id]];
    if(ev) title = `${ev.emoji} ${ev.name}: ${ev.desc}`;
  }
  // 天赋节点: 悬浮提示「XX角色有话要说」（2026-08-21）
  if(n.type === 'talent' && s.character) title = `${s.character.name}有话要说`;
  if(n.type === 'quiz' || n.type === 'monthly_exam' || n.type === 'final_exam' || n.type === 'battle_tutorial') {
    let m = G.MONSTERS[n.monsterId];
    if(m) title = `${m.name}${m.talent?'｜'+G.monsterTalentTip(m):''}`;
  }
  if(G._pvSet && G._pvSet.has(n.id)) title += (n.type === 'talent' ? '（点击听听）' : '（点击查看信息）');
  // 节点插画（用户定 2026-08-17）：每种节点类型一张插画（含休息处/天赋/初始战斗），状态只用光晕/透明度表达
  let nodeIcons = {battle_tutorial:'其他插画/战斗节点.png', quiz:'其他插画/战斗节点.png', monthly_exam:'其他插画/战斗节点.png', final_exam:'其他插画/战斗节点.png', event:'其他插画/事件节点.png', partner_select:'其他插画/搭档节点.png', rest:'其他插画/休息处节点.png', talent:'其他插画/天赋节点.png'};
  let art = nodeIcons[n.type]
    ? `<img class="map-node-art" src="${nodeIcons[n.type]}" alt="${n.label}">`
    : n.emoji;
  return `<div class="${cls}" id="node-${n.id}" title="${title}">
    ${art}<span class="map-label">${n.label}</span>
  </div>`;
};

// --- BATTLE ---
G.renderBattle = function(main,bot) {
  let s = G.state;
  let b = s.battle;
  if(!b) return;
  let md = b.monsterData;

  // Monster info（手牌机制，无意图，用户定 2026-08-18）
  let mHpPct = Math.max(0, Math.min(100, Math.round(b.monsterHp / b.monsterMaxHp * 100)));
  // 流动血条快照（2026-08-19 用户需求）：先按上一帧宽度渲染，渲染后再动画到新宽度
  let prevMPct = (G._prevMonsterHpPct != null) ? G._prevMonsterHpPct : mHpPct;

  // 战斗状态特殊信息（耐力/临时上限/减伤等）
  let specials = [];
  if(b.endurance>0) specials.push(`<span class="util-badge" data-tip="消耗型能量，无上限无限期">💪耐力:${b.endurance}</span>`);
  if(b.tempMaxHp>0) specials.push(`<span class="util-badge" data-tip="本场战斗临时生命上限">📈临时上限:+${b.tempMaxHp}</span>`);
  if(b.dmgReduceTurns>0) specials.push(`<span class="util-badge" data-tip="受到的伤害减少">🛡️减伤${b.dmgReduceTurns}回合</span>`);
  if(b.damageBonusTurns>0) specials.push(`<span class="util-badge" data-tip="所有伤害提升80%">⚡全伤+80% ${b.damageBonusTurns}回合</span>`);
  // ===== 薛诗蕾线状态徽标（2026-08-24）=====
  if(b.beikao && b.beikao.n > 0) specials.push(`<span class="util-badge" data-tip="备考：接下来${b.beikao.n}张逻辑卡+1费并获得${b.beikao.pct}%倍率提升">📝备考充能×${b.beikao.n}</span>`);
  if(b.logicDiscLeft > 0) specials.push(`<span class="util-badge" data-tip="再刷一题：接下来${b.logicDiscLeft}张逻辑卡消耗-1">🎯刷题-1费×${b.logicDiscLeft}</span>`);
  if(b.qinjuanDisc > 0) specials.push(`<span class="util-badge" data-tip="勤卷：下一张逻辑卡消耗-2">⭐勤卷-2费</span>`);
  if(b.xnhyDisc && b.xnhyDisc.amt > 0) specials.push(`<span class="util-badge" data-tip="先难后易：下一张其他逻辑卡消耗-${b.xnhyDisc.amt}">📚下张逻辑-${b.xnhyDisc.amt}费</span>`);
  if(b.nextLogicDisc > 0) specials.push(`<span class="util-badge" data-tip="反复刷题：下一张逻辑卡消耗-1">🔁下张逻辑-1费</span>`);
  if(b.zeroNextGe2 > 0) specials.push(`<span class="util-badge" data-tip="选择题秒了(金)：下一张原始消耗≥2的逻辑卡-1费">⚡高费卡-1费</span>`);
  if(b.calmSurch > 0) specials.push(`<span class="util-badge" data-tip="冷静分析：下一张逻辑卡+${b.calmSurch}费">🧊下张逻辑+${b.calmSurch}费</span>`);
  if(b.rationalityGuard > 0) specials.push(`<span class="util-badge" data-tip="冷静分析：本回理性因伤害减少时前${b.rationalityGuard}次不减少">🧊理性守护×${b.rationalityGuard}</span>`);
  if(b.scratchRec) specials.push(`<span class="util-badge" data-tip="草稿推演：下一张逻辑卡若消耗≠${b.scratchRec.cost}则获得理性">📐推演记录⚡${b.scratchRec.cost}</span>`);
  if(b.arroganceTemp>0) specials.push(`<span class="util-badge" data-tip="临时傲慢">😤临时傲慢:${b.arroganceTemp}</span>`);
  if(b.freePlaysLeft>0) specials.push(`<span class="util-badge" data-tip="本回合可免费打出的卡牌">🎁免费卡×${b.freePlaysLeft}</span>`);
  if(s.combatEq>0) specials.push(`<span class="util-badge" data-tip="本场战斗感性转化获得">💡战斗情商+${s.combatEq}</span>`);
  // 搭档热情（2026-08-21）：技能消耗，每回合回复
  if(s.partners && s.partners.length && b.passionMax > 0) specials.push(`<span class="util-badge" data-tip="搭档热情：使用搭档技能消耗，每回合回复${b.passionRegen}">🔥热情:${b.passion}/${b.passionMax}</span>`);
  // 小萌: 梦屑/梦痕资源
  if(s.character.id==='xiaomeng') specials.push(`<span class="util-badge" data-tip="【梦屑】\n小萌·霜眠的核心消耗资源；卡牌强化条件满足时自动消耗，上限等于情商。">💤梦屑:${b.mengxie}/${s.eq}</span>`);
  if((s.rallyCount||0)>0) specials.push(`<span class="util-badge" data-tip="生命归零时消耗1次，回复至50%生命并获得8层霜蝶">🌅重整旗鼓:${s.rallyCount}</span>`);
  if(b.menghen>0) specials.push(`<span class="util-badge" data-tip="用于部分卡牌消耗（如苏醒）">🌙梦痕:${b.menghen}</span>`);
  if(b.monsterDrawPenalty>0) specials.push(`<span class="util-badge" data-tip="对手每回合摸牌数减少">😴对手摸牌-${b.monsterDrawPenalty}</span>`);
  if(b.playerBonusDraw>0) specials.push(`<span class="util-badge" data-tip="你每回合多摸的牌数">😴摸牌+${b.playerBonusDraw}</span>`);
  if(b.parry) specials.push(`<span class="util-badge" data-tip="下个敌方回合下一次受到的伤害降低90%，随后随机弃置对方1张手牌">🛡️招架</span>`);
  if(b.nextLogicRepeat) specials.push(`<span class="util-badge" data-tip="下一张逻辑卡效果额外发动1次；第二次伤害提升50%">⚔️连刺</span>`);

  // 用具区：已激活的丛书羁绊 + 已装备的用具
  let utils = [];
  for(let [bid,on] of Object.entries(s.activeBonds)) {
    if(on && G.BONDS[bid]) {
      let bn = G.BONDS[bid];
      utils.push(`<span class="util-badge" data-tip="${bn.effect}">${bn.emoji}${bn.name}</span>`);
    }
  }
  for(let ref of (b.equippedTools||[])){let td=G.getCardData(ref);if(td)utils.push(`<span class="util-badge tool-badge" data-tip="${td.desc.replace(/"/g,'&quot;')}">🔧${td.emoji}${td.name}</span>`);}
  if(b.exhaust.length > 0) utils.push(`<span class="util-badge" data-tip="已从本场战斗中移除的卡牌">❌移除:${b.exhaust.length}</span>`);

  let statuses = G.renderStatuses(b.playerStatuses);
  let monsterStatuses = G.renderStatuses(b.monsterStatuses, ['shield']);
  let effMaxHp = b.playerMaxHp + b.tempMaxHp;
  let hpPct = Math.max(0, Math.min(100, Math.round(b.playerHp / effMaxHp * 100)));
  let prevHPct = (G._prevPlayerHpPct != null) ? G._prevPlayerHpPct : hpPct;

  // 完整牌局记录：实时显示出牌、伤害、回复、状态等；卡牌名悬停查看完整效果。
  let recordsHtml = (b.log||[]).map(line => {
    let enemy = /^--- 怪物回合|^👹|^😈|^🔇|^🃏 .*怪物|^💚 .*怪物/.test(line);
    return `<div class="log-record ${enemy?'m':'p'}">${G.battleLogLineHtml(line,b)}</div>`;
  }).join('');
  if(!recordsHtml) recordsHtml = '<div class="log-record-empty">暂无记录</div>';

  // 体力宝石行（结束回合区双体力面板，2026-08-21 用户需求）：超过10颗只画10颗，数字显示精确值
  let eGems = function(cur, max) {
    let h = '';
    for(let i=0;i<Math.min(max,10);i++) h += `<span class="energy-dot ${i<cur?'filled':'empty'}"></span>`;
    return h;
  };
  let weakList=(s.character.id==='xiaomeng_fiora'&&(s.talents||[]).includes('chariot'))
    ? G.WEAK_TYPES.map(type=>({type,source:'chariot'})) : (b.weaknesses||[]);

  main.innerHTML = `
    <div id="battleStage">
      <div id="logRail">
        <button id="logToggle" class="${G._playLogOpen?'on':''}" onclick="G.togglePlayLog()">📜<br>记录</button>
        <button id="battleTalentToggle" onclick="G.showBattleTalentView()" title="查看双方天赋">✨<br>天赋</button>
      </div>
      <div id="playLogPanel" class="${G._playLogOpen?'open':''}">
        <div id="playLogHeader"><span>📜 牌局记录</span><span class="pl-close" onclick="G.togglePlayLog()">✕</span></div>
        <div id="playLogList">${recordsHtml}</div>
      </div>
      <div class="stage-main">
        <!-- 上半：怪物（左右对调+主列[属性→手牌]与玩家一致，用户定 2026-08-18：手牌区在生命下方） -->
        <div class="half monster-half">
          <div class="monster-main">
            <div id="monsterHandRow">
              ${b.monsterHand && b.monsterHand.length
                ? b.monsterHand.map(c => G.cardBackHtml({cls:'mhand-big' + ((G._prevMonsterHandNames||[]).includes(c.name) ? '' : ' card-new'), title:(c.name+'｜'+c.desc)})).join(' ')
                : '<span style="font-size:10px;color:#6a8aaa">（空）</span>'}
            </div>
          </div>
          <div class="monster-side">
            <div id="monsterInfo">
              <div style="font-weight:bold;font-size:14px">${md.emoji||'👾'} ${md.name} <span style="font-size:10px;color:#a0b8d0">${md.subject}</span></div>
              <div class="mhand-count" title="怪物属性：智力决定伤害 / 情商影响特殊行为">${md.intelligence?`<span>🧠${b.monsterIntelligence}</span>`:''}${md.eq?` <span>💬${b.monsterEq}</span>`:''}</div>
              <div class="mhand-count">🃏 手牌 ${b.monsterHand.length}/2</div>
              ${monsterStatuses?`<div class="monster-statuses">${monsterStatuses}</div>`:''}
              <div class="monster-piles">
                <div id="monsterDeckZone" class="pile-zone monster-pile" data-tip="怪物卡组: ${b.monsterDrawPile?b.monsterDrawPile.length:0}张">
                  <img class="pile-art" src="卡牌插画/卡组.png" alt="卡组"><span class="pile-label">卡组</span>
                </div>
                <div id="monsterDiscardZone" class="pile-zone monster-pile" data-tip="怪物弃牌堆: ${b.monsterDiscard?b.monsterDiscard.length:0}张" style="cursor:pointer" onclick="G.showPilePreview('monsterDiscard')">
                  <img class="pile-art" src="卡牌插画/弃牌堆.png" alt="弃牌堆"><span class="pile-label">弃牌堆</span>
                </div>
              </div>
            </div>
            <!-- 怪物立绘：双方生命球已统一移至玩家技能上方 -->
            <div class="monster-mid">
              <div class="nexus-portrait monster" id="monsterPortrait">${md.portrait
                ? `<img class="portrait-art" src="${md.portrait}" alt="">`
                : `<span class="portrait-emoji">${md.emoji||'👾'}</span>`}</div>
            </div>
          </div>
        </div>
        <!-- 下半：玩家（生命下方直接手牌区；左列立绘=技能在上、立绘底与卡牌底持平；日志在手牌下方） -->
        <div class="half player-half">
          <div class="player-side">
            <div id="dualNexusStack">
              <div id="monsterPortraitBox">${G.nexusHtml('monster', b.monsterHp, b.monsterMaxHp, b.monsterStatuses.shield||0, prevMPct, mHpPct, weakList)}</div>
              <div id="portraitBox">${G.nexusHtml('player', b.playerHp, effMaxHp, b.playerShield, prevHPct, hpPct)}</div>
            </div>
            ${G.renderSkills(b)}
            <!-- 玩家立绘：生命球位于上方双生命区 -->
            <div class="player-mid">
              <div class="nexus-portrait" id="playerPortrait">${G.portraitHtml()}</div>
            </div>
          </div>
          <div class="player-main">
            <div id="statusRow">
              ${statuses||specials.length?`<span class="zone-label">BUFF</span>`:''}
              ${statuses}
              ${specials.join('')}
              ${utils.length?`<span class="zone-label" style="margin-left:6px">用具</span>${utils.join('')}`:''}
            </div>
            <div id="vitalRow">
              <div class="vital-item" style="flex:0 0 auto" data-tip="【基础属性】\n体魄影响生命与体力；智力、情商和体魄分别决定对应卡牌效果。情商还决定搭档上限与热情回复。">
                <span>💪${s.physique}</span><span>🧠${s.intelligence}</span><span>💬${s.eq}</span>
              </div>
            </div>
            <div id="handRow">
              <div id="handArea">
                ${b.hand.map((cid,i) => {
                  // 手牌扇形（2026-08-23 LoR 风格）：第 i 张卡按位置取 -0.5~0.5，角度=位置×总弧度，下沉=位置²抛物线
                  let n = b.hand.length;
                  let t = n <= 1 ? 0 : (i/(n-1) - 0.5);
                  let rot = (t * Math.min(24, n*5)).toFixed(1);
                  let ty = Math.round(t*t*52);
                  return G.renderBattleCard(cid, i, (G._prevHandIds||[]).includes(cid) ? '' : 'card-new', rot, ty);
                }).join('')}
              </div>
              <div id="deckZone" class="pile-zone" data-tip="卡组: ${b.drawPile.length}张">
                <img class="pile-art" src="卡牌插画/卡组.png" alt="卡组">
                <span class="pile-label">卡组</span>
              </div>
              <div id="discardZone" class="pile-zone" data-tip="弃牌堆: ${b.discard.length}张" style="cursor:pointer" onclick="G.showPilePreview('discard')">
                <img class="pile-art" src="卡牌插画/弃牌堆.png" alt="弃牌堆">
                <span class="pile-label">弃牌堆</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="stage-right">
        <div class="et-energy" data-tip="【怪物体力】\n怪物打出卡牌时消耗；每个怪物回合开始时回复至上限。">
          <span class="et-e-label">怪物体力</span>
          <span class="et-e-gems">${eGems(b.monsterEnergy, b.monsterMaxEnergy)}</span>
          <span class="et-e-num">${b.monsterEnergy}/${b.monsterMaxEnergy}</span>
        </div>
        <button id="endTurnBtn" ${b.phase!=='player'||b.over?'disabled':''} onclick="G.playerEndTurn()">
          <span class="eb-icon">⏭</span><span>结束回合</span>
        </button>
        <div class="et-energy" data-tip="【体力】\n打出卡牌时消耗；每个你的回合开始时回复至上限。">
          <span class="et-e-label">你的体力</span>
          <span class="et-e-gems">${eGems(b.energy, b.maxEnergy)}</span>
          <span class="et-e-num">${b.energy}/${b.maxEnergy}</span>
        </div>
      </div>
      <!-- 中间出牌区（用户定 2026-08-18）：拖拽卡牌到这里松手打出；底部常驻法阵贴图（seedream 生成，2026-08-23），随出牌区渐显 -->
      <div id="playZone"><div class="pz-circle"></div><span id="playZoneLabel">🀄 出牌区</span></div>
      <div id="fxLayer"></div>
    </div>`;

  G.bindBattleResourceTips();

  // 抽牌入场动画快照（2026-08-19）：记录渲染时的手牌，下次 render 对比出"新牌"才挂 card-new
  G._prevHandIds = b.hand.slice();
  G._prevMonsterHandNames = (b.monsterHand || []).map(c => c.name);

  // 传统页游生命球：中心颜色先保持旧高度，再从上向下流失到当前生命比例。
  G.fx._afterRender(function(){
    let fills=document.querySelectorAll('.nexus-fill');
    for(let i=0;i<fills.length;i++){
      let el=fills[i];if(el.dataset.height===undefined)continue;
      void el.offsetHeight;el.style.height=el.dataset.height;
    }
  });
  G._prevPlayerHpPct = hpPct;
  G._prevMonsterHpPct = mHpPct;

  // Bottom bar: 战斗中整条隐藏（难度/回合显示已移除，用户定 2026-08-16）；结算按钮仍在下栏
  if(!b.over) {
    bot.innerHTML = '';
    bot.style.display = 'none';
  } else {
    bot.style.display = '';
    if(b.won) {
      bot.innerHTML = '';
      main.insertAdjacentHTML('beforeend',`<div class="battle-victory-pop"><div class="paper-box"><h2>🎉 胜利</h2><p>考试顺利通过！</p><button class="btn success" onclick="G.endBattle()">继续</button></div></div>`);
    } else {
      // 战斗失败：底栏不放按钮，延迟弹窗选择 重考/放弃（2026-08-19 用户需求）
      bot.innerHTML = '';
      setTimeout(function(){
        let bt = G.state.battle;
        if(bt && bt.over && !bt.won && !document.getElementById('modalOverlay')) G._showFailModal();
      }, 700);
    }
  }

  // Attach card click handlers + 拖拽发牌
  b.hand.forEach((cid,i) => {
    let el = document.getElementById('bcard-'+i);
    if(el) {
      let cd = G.getCardData(cid);
      let canPlay = G.canPlay(cd);
      el.onclick = () => {
        if(Date.now() < (G._dragSuppressUntil||0)) return; // 拖拽结束后的残余 click 忽略
        // 点击不出牌（用户定 2026-08-18）：必须拖到中间出牌区松手，点击仅提示
        if(canPlay) G._cardHint('🀄 请拖动卡牌到这里打出');
      };
      el.addEventListener('pointerdown', (e) => G._cardPointerDown(e, i, el));
    }
  });

  // 出牌记录自动滚到最新
  let pl = document.getElementById('playLogList');
  if(pl) pl.scrollTop = pl.scrollHeight;
};

// 出牌记录面板开关（左侧弹出，不覆盖中心画面）
G._playLogOpen = false;
G.togglePlayLog = function() {
  G._playLogOpen = !G._playLogOpen;
  G.render();
};

G.monsterTalentTip = function(monster) {
  if(!monster || !monster.talent) return '';
  return `天赋【${monster.talent}】：${monster.talentDesc || '效果体现在该怪物的专属卡组与行动规则中。'}`.replace(/"/g,'&quot;');
};

G.battleLogLineHtml = function(line, b) {
  let esc = v => String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  let cards = {};
  Object.values(G.CARDS||{}).forEach(c => { if(c&&c.name) cards[c.name]=c; });
  ((b&&b.monsterData&&b.monsterData.deck)||[]).forEach(c => { if(c&&c.name) cards[c.name]=c; });
  let names = Object.keys(cards).sort((a,z)=>z.length-a.length);
  let src = String(line==null?'':line), out='', pos=0;
  while(pos<src.length) {
    let hit=null, at=src.length;
    names.forEach(name => { let i=src.indexOf(name,pos); if(i>=0&&i<at){at=i;hit=name;} });
    if(!hit) { out += esc(src.slice(pos)); break; }
    out += esc(src.slice(pos,at));
    let cd=cards[hit], tip=(cd.desc||cd.effect||'暂无效果说明');
    out += `<span class="log-card-name" data-tip="${esc(tip)}">${esc(hit)}</span>`;
    pos=at+hit.length;
  }
  return out;
};

G.showBattleTalentView = function() {
  let s=G.state, b=s.battle, html='<h3 style="text-align:center;color:#ffd700;margin-bottom:10px">✨ 双方天赋</h3>';
  html += '<div class="battle-talent-title">我方天赋</div>';
  let mine=(s.talents||[]).map(id=>G.TALENTS[id]).filter(Boolean);
  html += mine.length ? mine.map(t=>`<div class="battle-talent-row"><b>${t.emoji||'✨'} ${t.name}</b><span>${t.desc||''}</span></div>`).join('') : '<div class="battle-talent-empty">暂无天赋</div>';
  html += '<div class="battle-talent-title enemy">敌方天赋</div>';
  let m=b&&b.monsterData;
  html += (m&&m.talent) ? `<div class="battle-talent-row enemy"><b>👹 ${m.talent}</b><span>${m.talentDesc||'效果体现在该怪物的专属卡组与行动规则中。'}</span></div>` : '<div class="battle-talent-empty">暂无天赋</div>';
  html += '<button class="btn" style="width:100%;margin-top:10px" onclick="G.closeModal()">关闭</button>';
  G.showModal(html);
};

// --- 拖拽发牌系统 ---
// 按住手牌拖动（>6px 判定拖拽）→ 悬浮牌跟随鼠标 → 松开在中间出牌区=打出，别处=取消
// 点击不出牌（用户定 2026-08-18）：必须拖到出牌区；点击仅弹出提示；拖拽结束后的残余 click 会被时间窗忽略
G._drag = null;            // {el,index,cardId,startX,startY,active,ghost}
G._dragSuppressUntil = 0;

// 出牌区提示（点击手牌时）：闪烁显示 + 文案提示
G._cardHintTimer = null;
G._cardHint = function(msg) {
  let zone = document.getElementById('playZone');
  let lb = document.getElementById('playZoneLabel');
  if(!zone || !lb) return;
  lb.textContent = msg || '🀄 出牌区';
  zone.classList.add('hint');
  if(G._cardHintTimer) clearTimeout(G._cardHintTimer);
  G._cardHintTimer = setTimeout(function() {
    zone.classList.remove('hint');
    lb.textContent = '🀄 出牌区';
  }, 1500);
};

G._cardPointerDown = function(e, index, el) {
  let b = G.state.battle;
  if(!b || b.phase !== 'player' || b.over) return;
  if(e.button !== 0) return; // 只响应左键
  let cd = G.getCardData(b.hand[index]);
  if(!cd) return;
  if(!G.canPlay(cd)) {
    // 跟手反馈（2026-08-19）：打不出的牌按下立即提示原因，不再无响应
    if(!b.lockPlay) G._cardHint('⛔ ' + cd.name + '：体力不足或条件未满足');
    return;
  }
  let currentId = G.state && G.state.battle && G.state.battle.hand[index];
  G._drag = {el:el, index:index, cardId:currentId, startX:e.clientX, startY:e.clientY, active:false, ghost:null};
};

// 落点判定（2026-08-19 修复）：用坐标矩形代替 e.target。
// 触屏有隐式指针捕获——pointerup 的 target 永远是按下时的卡牌而非出牌区，
// zone.contains(e.target) 在触屏上恒为 false，拖拽出牌必然失败；坐标法鼠标/触屏/合成事件通吃。
G._pointInZone = function(e, zone) {
  if(!zone || !zone.getBoundingClientRect) return false;
  if(typeof e.clientX !== 'number' || typeof e.clientY !== 'number') return false;
  let r = zone.getBoundingClientRect();
  return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
};

G._cardPointerMove = function(e) {
  let d = G._drag;
  if(!d) return;
  if(!d.active) {
    // 超过 6px 才进入拖拽，避免点击误触
    if(Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 6) return;
    d.active = true;
    let ghost = d.el.cloneNode(true);
    ghost.id = '';
    ghost.classList.add('drag-ghost');
    // 脱离扇形姿态（2026-08-23）：拖拽残影保持正立（CSS 侧亦有 .drag-ghost 兜底覆盖）
    if(ghost.style && ghost.style.setProperty) { ghost.style.setProperty('--fan-rot','0deg'); ghost.style.setProperty('--fan-y','0px'); }
    ghost.style.width = d.el.offsetWidth + 'px';
    document.body.appendChild(ghost);
    d.ghost = ghost;
    d.el.classList.add('dragging-src');
    let stage = document.getElementById('battleStage');
    if(stage) stage.classList.add('drag-active'); // 拖拽中：显示出牌区
  }
  d.ghost.style.left = e.clientX + 'px';
  d.ghost.style.top = e.clientY + 'px';
  let zone = document.getElementById('playZone');
  let hot = zone ? G._pointInZone(e, zone) : false;
  if(zone) zone.classList.toggle('drop-active', hot);
  if(d.ghost && d.ghost.classList) d.ghost.classList.toggle('ghost-hot', hot);
};

G._cardPointerUp = function(e, dropped) {
  let d = G._drag;
  if(!d) return;
  G._drag = null;
  let stage = document.getElementById('battleStage');
  if(stage) stage.classList.remove('drag-active');
  let zone = document.getElementById('playZone');
  if(zone) zone.classList.remove('drop-active');
  if(d.ghost) {
    d.el.classList.remove('dragging-src');
    if(d.active && !dropped) {
      // 拖拽取消：残影回缩淡出（手感反馈，2026-08-19）
      d.ghost.classList.add('gone');
      let g = d.ghost;
      setTimeout(() => g.remove(), 220);
    } else {
      d.ghost.remove();
    }
  }
  if(!d.active) return; // 未进入拖拽 = 普通点击，交给 onclick 处理
  // 进入过拖拽：吞掉这次 click，只有松开在中间出牌区才出牌
  G._dragSuppressUntil = Date.now() + 200;
  if(dropped) {
    let b = G.state.battle;
    if(b && b.phase === 'player') {
      // 渲染或自动效果可能在拖拽期间改变手牌顺序；必须确认释放时仍是按下的那张牌。
      if(b.hand[d.index] !== d.cardId) {
        let sameIndex = b.hand.indexOf(d.cardId);
        if(sameIndex < 0) return;
        d.index = sameIndex;
      }
      let cd = G.getCardData(b.hand[d.index]);
      if(cd && G.canPlay(cd)) {
        G.fx.cardFlyout(d.el); // 出牌飞行：克隆牌飞向出牌区（须在 playCard 触发 render 前取位置）
        // 出牌区命中闪光（确认反馈）：drag-active 已移除，靠 keyframes 内的 opacity 自行显现
        let zn = document.getElementById('playZone');
        if(zn) { zn.classList.add('zone-flash'); setTimeout(() => zn.classList.remove('zone-flash'), 450); }
        G.playCard(d.index);
      } else if(cd && cd.novel && b.novelBuff) {
        // 特供小说互斥：本场已激活一本小说（含生效期间），放不下去并提示（2026-08-22）
        G.showToast(G.novelBlockedMsg());
        G.fx.cardReturn(d.el);
      }
    }
  }
};

// 初始化（document 级监听，只挂一次）
G.initCardDragSystem = function() {
  document.addEventListener('pointermove', G._cardPointerMove);
  document.addEventListener('pointerup', (e) => {
    let zone = document.getElementById('playZone');
    // 2026-08-19 修复：e.target 在触屏（隐式捕获）/合成事件下不可靠，坐标矩形判定为准
    let over = !!(zone && (G._pointInZone(e, zone) || zone.contains(e.target)));
    G._cardPointerUp(e, over);
  });
  document.addEventListener('pointercancel', () => G._cardPointerUp(null, false));
};

// 角色立绘框 — 预留接入点：后续只需给角色数据加 portrait 字段即可显示立绘
//   portrait: '立绘/薛诗蕾.png'           → 静态图片
//   portrait: {img:'立绘/肖清雅.png'}     → 同上（对象写法）
//   portrait: {video:'立绘/程良.mp4'}     → 循环播放动画（MP4/WebM，GIF 也可用 img 写法）
// 未配置时显示动画占位（扫光+浮动+角色名）
G.portraitHtml = function() {
  let ch = G.state.character;
  // 战斗统一使用角色普通立绘；Q版字段仅供气泡、头像等其他界面使用。
  let art = ch.portrait;
  if(art) {
    if(typeof art === 'object' && art.video)
      return `<video class="portrait-art" src="${art.video}" autoplay loop muted playsinline></video>`;
    let src = typeof art === 'string' ? art : art.img;
    if(src) return `<img class="portrait-art${ch.id==='xiaomeng_fiora'?' portrait-huxiaomeng-ex':''}" src="${src}" alt="${ch.name}">`;
  }
  return `<div class="portrait-ph">
    <span class="portrait-emoji">${ch.emoji}</span>
    <span class="portrait-name">${ch.name}</span>
    <span class="portrait-hint">立绘待添加</span>
  </div>`;
};

// 生命水晶 HTML（LoR 风格，2026-08-21 用户需求）：圆形水晶=左右列中线对称（84px），中央生命数字，
// 右侧小标签显示 当前/上限；SVG 环形血条：主环快速落下，残影环延迟慢速流动追上
// side:'player'|'monster'；shield>0 时右上角护盾徽章；立绘不在球内（改放球下 .nexus-portrait 半身立绘）；prevPct→curPct 流动动画
G.flawRingHtml = function(flaws) {
  if(!flaws||!flaws.length)return '';
  let byType={};flaws.forEach(w=>{if(!byType[w.type])byType[w.type]=w;});
  let order=['logic','idea','answer','tool'], rotations={logic:-135,idea:-45,answer:45,tool:135};
  let tip=w=>w.source==='duel_dance'?'临时破绽：本回合未击破则移除':w.source==='challenge'?'无双挑战破绽：持续至本回合结束':w.source==='chariot'?'战车破绽：击破后不会消失':'击破后造成等同于智力的真实伤害，并回复5%最大生命';
  return `<div class="flaw-ring" aria-label="怪物破绽">
    <svg class="flaw-ring-svg" viewBox="0 0 112 112" aria-hidden="true">${order.filter(t=>byType[t]).map(t=>`<circle class="flaw-arc flaw-arc-${t}" cx="56" cy="56" r="50" transform="rotate(${rotations[t]} 56 56)"></circle>`).join('')}</svg>
    ${order.filter(t=>byType[t]).map(t=>`<span class="flaw-ring-label flaw-label-${t}" data-tip="${tip(byType[t])}">${G.WEAK_NAMES[t]}</span>`).join('')}
  </div>`;
};
G.nexusHtml = function(side, hp, maxHp, shield, prevPct, curPct, flaws) {
  let num = hp;
  return `
  <div class="nexus nexus-${side}">
    ${side==='monster'?G.flawRingHtml(flaws):''}
    <div class="nexus-art"><div class="nexus-fill" style="height:${Math.max(0,Math.min(100,prevPct))}%" data-height="${Math.max(0,Math.min(100,curPct))}%"></div></div>
    <span class="nexus-tab">生命<br>${num}/${maxHp}</span>
    ${shield>0?`<span class="nexus-shield" data-tip="【护盾】\n受到伤害时优先抵消伤害。">🛡️${shield}</span>`:''}
  </div>`;
};

// 状态中文名（buff 徽章与卡面共用）
G.STATUS_NAMES = {rationality:'理性',sensibility:'感性',serious:'认真',spirit:'精神',vulnerable:'脆弱',smart:'聪明',accuracy:'精准',inspiration:'灵感',careful:'细心',wushi:'无视',arrogance:'骄傲',shuangdie:'霜蝶',poison:'中毒'};

// 卡牌品质球：cd.q 可覆盖（'green'|'white'|'blue'|'purple'|'gold'|'red'，2026-08-24 增红档）
// 未标品质的卡默认为绿色；解答卡最低为紫色。
G.cardQuality = function(cd) {
  let names = {green:'绿',white:'白',blue:'蓝',purple:'紫',gold:'金',red:'红'};
  let key = cd.q;
  if(!key) {
    if(cd.type === 'answer') key = 'purple';
    else key = 'green';
  }
  if(cd.type==='answer'&&['green','white','blue'].includes(key))key='purple';
  return {key:key, name:names[key]||'白'};
};

// 卡面效果：战斗内显示具体数值（悬停数值弹窗显示倍数公式），无法计算的卡回退原描述
G.cardEffectHtml = function(cd) {
  let b = G.state.battle;
  let s = G.state;
  if(!b) return cd.desc;
  let parts = [];   // 主效果（数值）
  let notes = [];   // 附加词条
  const statName = {intelligence:'智力',eq:'情商',intEq:'智力+情商',all:'全属性',physique:'体魄'};
  const fx = (formula, text) => `<b class="fx-val" data-tip="${formula}">${text}</b>`;

  // —— 伤害 ——
  let hits = 1;
  if(cd.energyCostDmgPhysique) {
    // 君姐模式: x×体魄（x=消耗体力）
    let v = (G.getCardCost(cd)||0) * s.physique;
    parts.push(`造成 ${fx(`x×体魄(x=消耗体力)`, v)} ⚔️`);
    notes.push('消耗体力≥6: 回复2体力+本场体力上限与回复+1');
  } else if(cd.dmgStat) {
    let st = cd.dmgStat==='intelligence' ? G.effectiveInt() :
             cd.dmgStat==='eq' ? G.effectiveEq() :
             cd.dmgStat==='intEq' ? G.effectiveInt()+G.effectiveEq() :
             cd.dmgStat==='physique' ? s.physique :
             s.physique + s.intelligence + s.eq;
    let ratLayers = (b.playerStatuses.rationality||0);
    let effStat = st;
    let v = Math.floor(effStat * cd.dmgMult);
    if(cd.type==='logic' && s.activeBonds.science) v += 1;
    if(b.battleDmgPlus) v += 1;
    let formula = `${cd.dmgMult}×${statName[cd.dmgStat]}`;
    if(cd.rationalityPerStack) formula += `+每层理性×${cd.rationalityPerStack}`;
    if(cd.ratStatPct) formula += `+每层理性提升智力${Math.round(cd.ratStatPct*100)}%`;
    if(cd.ratPerHit) formula += `+每层理性每段×${cd.ratPerHit}`;
    if(cd.extraIfCost2) formula += `，当前消耗为2→+${cd.extraIfCost2}×`;
    if(cd.aboveBonus) formula += `，每高于原始消耗1费+${cd.aboveBonus}×`;
    if(cd.belowBonus) formula += `，每降1费+${cd.belowBonus}×`;
    if(cd.zeroMult) formula += `，0费时→${cd.zeroMult}×`;
    if(cd.multAfterIdea) formula += `，本回合用过思路卡→${cd.multAfterIdea}×`;
    if(cd.lastCardMult) formula += `，最后手牌→${cd.lastCardMult}×`;
    if(cd.perChangeHit) { let n = Math.min(cd.maxChangeHits||3, (b.cardCostChanges && b.cardCostChanges[cd.ref||cd.id])||0); formula += `，每改变1次费用追加1段×${cd.perChangeHit}(当前${n}段)`; hits = 1 + n; }
    if(cd.hitsByArrogance) { formula = `${cd.hitsByArrogance.dmgMult}×${statName[cd.dmgStat]}×(${1+G.arroganceTotal()}段)`; hits = 1 + G.arroganceTotal(); }
    if(cd.conceit3Hits) { formula = `${cd.conceit3Hits}×傲慢×智力，共3段`; hits = 3; }
    parts.push(`造成 ${fx(formula, v)}${hits>1?`×${hits}`:''} ⚔️`);
    if(cd.sensMult) notes.push(`每层感性+${cd.sensMult}×情商`);
    if(cd.conceit3Hits) notes.push('每段后傲慢减半');
    if(cd.arroganceDown4) notes.push('之后傲慢-4');
    if(cd.consumeRationality) notes.push(`消耗${cd.consumeRationality}层理性`);
  } else if(cd.enduranceDmg) {
    let v = Math.max(cd.enduranceDmg.min||1, Math.floor((b.endurance||0)*cd.enduranceDmg.mult));
    parts.push(`造成 ${fx(`${cd.enduranceDmg.mult}×耐力`, v)} ⚔️`);
  } else if(cd.enduranceTrueDmg) {
    let v = Math.floor((b.endurance||0)*cd.enduranceTrueDmg);
    parts.push(`造成 ${fx(`${cd.enduranceTrueDmg}×耐力`, v)} ⚔️真伤`);
  } else if(cd.allZonesNameBonus) {
    let zones = [...b.hand, ...b.drawPile, ...b.discard, ...b.exhaust];
    let counts = {};
    zones.forEach(cid => { let k = G.baseId(cid); counts[k] = (counts[k]||0) + 1; });
    let kinds = Object.values(counts).filter(c => c >= 2).length;
    let v = 1 + kinds * Math.floor(G.effectiveEq());
    parts.push(`造成 ${fx(`1+同名≥2张的种数×情商`, v)} ⚔️`);
  } else if(cd.deckMostCopiesBonus) {
    // 迢迢牵牛星: 1点 + 我方各处数量最多的同名牌张数×1×情商
    let zones = [...b.hand, ...b.drawPile, ...b.discard, ...b.exhaust];
    let counts = {};
    zones.forEach(cid => { let k = G.baseId(cid); counts[k] = (counts[k]||0) + 1; });
    let maxN = 0;
    for(let k in counts) if(counts[k] > maxN) maxN = counts[k];
    let v = 1 + maxN * Math.floor(G.effectiveEq());
    parts.push(`造成 ${fx(`1+最多同名牌张数×情商(当前${maxN}张)`, v)} ⚔️`);
  }
  // —— 护盾 ——
  if(cd.shieldStat) {
    let st = cd.shieldStat==='intelligence' ? G.effectiveInt() : G.effectiveEq();
    let mult = (cd.shieldMultLowEnergy && b.energy <= 0) ? cd.shieldMultLowEnergy : cd.shieldMult;
    let v = Math.floor(st * mult);
    if(cd.shieldExtraIfSens2 && (b.playerStatuses.sensibility||0) >= 2) v += Math.floor(G.effectiveEq() * cd.shieldExtraIfSens2);
    let formula = `${mult}×${statName[cd.shieldStat]}`;
    if(cd.shieldMultLowEnergy) formula += `，体力0时→${cd.shieldMultLowEnergy}×`;
    parts.push(`获得 ${fx(formula, v)} 🛡️`);
  }
  if(cd.shieldFromLifeCost) {
    let lc = G.getCardLifeCost(cd);
    parts.push(`获得 ${fx(`${cd.shieldFromLifeCost}×消耗生命`, lc*cd.shieldFromLifeCost)} 🛡️`);
  }
  if(cd.shieldFromEndurance) parts.push(`获得 ${fx(`1×当前耐力`, Math.floor(b.endurance||0))} 🛡️`);
  if(cd.shieldFromLostLife) {
    let v = Math.floor((b.playerMaxHp+b.tempMaxHp) - b.playerHp);
    parts.push(`获得 ${fx(`1×已损失生命`, v)} 🛡️`);
  }
  if(cd.doubleArrogance && cd.shieldArroganceMult) {
    let v = Math.floor(G.arroganceTotal() * cd.shieldArroganceMult);
    parts.push(`获得 ${fx(`${cd.shieldArroganceMult}×傲慢`, v)} 🛡️`);
  } else if(cd.shieldFromArrogance) {
    let v = Math.floor(G.arroganceTotal() * G.effectiveInt());
    parts.push(`获得 ${fx(`1×傲慢×智力`, v)} 🛡️`);
  }
  // —— 回复 ——
  if(cd.healLostPct) {
    let lost = (b.playerMaxHp+b.tempMaxHp) - b.playerHp;
    let v = Math.floor(lost * cd.healLostPct / 100);
    parts.push(`回复 ${fx(`${cd.healLostPct}%×已损失生命`, v)} ❤️`);
  }
  if(cd.tempMaxHpFromEndurance) {
    let v = Math.floor((b.endurance||0) * cd.tempMaxHpFromEndurance);
    parts.push(`临时上限 ${fx(`${cd.tempMaxHpFromEndurance}×耐力`, v)} ❤️`);
  }
  if(cd.restoreEnergy) parts.push('回复体力至上限 ⚡');
  // —— 附加词条 ——
  if(cd.status) for(let [st,l] of Object.entries(cd.status)) notes.push(`+${l}层${G.STATUS_NAMES[st]||st}`);
  if(cd.wushiFromArrogance) notes.push(`无视+${G.arroganceTotal()}`);
  if(cd.clearRationality) notes.push('移除所有认真与理性');
  if(cd.clearEndurance) notes.push('清空耐力');
  if(cd.doubleArrogance) notes.push('傲慢翻倍');
  if(cd.drawCards) notes.push(`摸${cd.drawCards}张`);
  if(cd.freeDraws) notes.push(`抽到的${cd.freeDraws}张本回合0费`);
  if(cd.discardAll) notes.push('弃置全部手牌');
  if(cd.choice) notes.push('抉择');
  if(cd.exhaust) notes.push('移除');
  if(cd.baoliu) notes.push('保留');
  if(cd.ruchu) notes.push('如初');
  if(cd.allHandFree) notes.push('本回合手牌全0费');
  if(cd.eqDoubleThisTurn) notes.push('本回合情商翻倍');
  if(cd.endTurnClearSens) notes.push('回合结束失去所有感性');
  if(cd.buffDmg) notes.push(`本回合下一次伤害+${cd.buffDmg}`);
  if(cd.noSensConsume) notes.push('本回合下一次伤害不消耗感性');
  if(cd.sensIfDiscardLogic) notes.push('弃牌堆有逻辑卡额外+1');
  if(cd.sensIfEq15) notes.push('情商>15再+2感性');
  if(cd.battleMaxEnergyDown) notes.push(`本场最大体力-${cd.battleMaxEnergyDown}`);
  if(cd.lockPlayTurn) notes.push('本回合无法使用卡牌');
  if(cd.dmgReduce2) notes.push(`减伤${cd.dmgReduce2.pct}%·${cd.dmgReduce2.turns}回合`);
  if(cd.trueDmgBonus2) notes.push(`所有伤害+${cd.trueDmgBonus2.pct}%·${cd.trueDmgBonus2.turns}回合`);
  // 谭梓君体系
  if(cd.energyRestore) notes.push(`回复${cd.energyRestore}体力`);
  if(cd.energyRestoreCurCap) notes.push(`回复x体力(x=当前体力,≤${cd.energyRestoreCurCap})`);
  if(cd.energyToMaxDmgPhysique) parts.push(`每回复1体力造成 ${fx(`${cd.energyToMaxDmgPhysique}×体魄`, Math.floor(s.physique*cd.energyToMaxDmgPhysique))} ⚔️`);
  if(cd.globalCostPlus2) notes.push('所有卡牌费用+2');
  if(cd.energySpendHeal) notes.push(`每消耗1体力回复${cd.energySpendHeal}生命`);
  if(cd.drawCheckLogic) notes.push('摸1张，逻辑卡则+1体力+体魄护盾');
  if(cd.nextTurnDrawPenalty) notes.push('下回合少摸1张');
  if(cd.returnFromDiscardNextTurn) notes.push('下回合开始从弃牌堆回手');
  if(cd.tuoshou) notes.push('脱手');
  if(cd.energyLowCost) notes.push(`体力≤${cd.energyLowCost.le}时消耗为${cd.energyLowCost.cost}`);
  // 小萌体系
  if(cd.mengxieExtra) notes.push('梦屑:额外强化');
  if(cd.discardMonsterHand) notes.push(`弃置对手${cd.discardMonsterHand}张手牌`);
  if(cd.discardMonsterHandAll) notes.push('弃置对手所有手牌');
  if(cd.exileMonsterHand) notes.push(`移出对手${cd.exileMonsterHand.count}张手牌`);
  if(cd.monsterNextDrawPenalty) notes.push('对手下回合摸牌-1');
  if(cd.nextTurnPlayerDraw) notes.push(`你下回合多摸${cd.nextTurnPlayerDraw}张`);
  if(cd.monsterDrawPenaltyIfHandLe2) notes.push('对手手牌≤2则其摸牌-1');
  if(cd.monsterDrawPenaltyStack) notes.push('对手每回合摸牌-1(叠2)');
  if(cd.playerBonusDrawStack) notes.push('你每回合多摸1(叠2)');
  if(cd.nightmareShackles) notes.push('对手每用1张卡你回1体力');
  if(cd.menghenCost) notes.push(`消耗${cd.menghenCost}梦痕`);
  if(cd.healFixed) notes.push(`回复${cd.healFixed}生命`);
  if(cd.monsterSleepTurns) notes.push('怪物手牌沉睡1回合');
  if(cd.wakeAllSleeping) notes.push('复原你沉睡的卡牌');
  // 肖清雅重做（2026-08-24）：弟子规/回响
  if(cd.echoAura) notes.push('本场每回合第一张思路卡获得回响');
  if(cd.echo) notes.push('回响：下回合生成0费临时卡');

  // 用具卡：效果正文 + 配文（斜体小字）
  if(cd.type === 'tool' && cd.desc.includes('配文：')) {
    let [main, flavor] = cd.desc.split('配文：');
    return `${main}<div class="card-notes" style="font-style:italic;color:#6a8aaa">${flavor}</div>`;
  }
  if(!parts.length) return cd.desc; // 无数值可算 → 原描述
  let html = parts.join('，');
  if(notes.length) html += `<div class="card-notes">${notes.join(' · ')}</div>`;
  return html;
};

// 统一卡面（用户定 2026-08-16）：全游戏卡牌统一竖版长方体+统一尺寸，查看时显示完整样式
// opts: {id, cls, title, count, badge}；非战斗环境显示基础费用
// 怪物卡背（任务1）：仅显示背面，不暴露卡名/效果；title 保留信息供调试悬停
G.cardBackHtml = function(opts) {
  opts = opts || {};
  let title = opts.title ? ` title="${opts.title.replace(/"/g,'&quot;')}"` : '';
  return `<div class="card card-back ${opts.cls||''}"${title}></div>`;
};

// 统一特效基建（任务0）：所有打击/套盾/技能/解答卡特效走这里；node 冒烟桩下安全无操作

G.renderBattleCard = function(cardId, index, extraCls, fanRot, fanY) {
  let cd = G.getCardData(cardId);
  if(!cd) return '';
  let b = G.state.battle;
  let canPlay = G.canPlay(cd);
  // Status tooltip
  let statusTip = '';
  if(cd.status) {
    let tips = {
      rationality:'每层使智力提升20%；造成伤害后-1层，多段视为一次伤害',
      sensibility:'造成一段伤害时获得等同当前层数的本场情商，随后-1层；上限3层',
      serious:'每层使下一张逻辑卡每段伤害+3；回合结束移除全部层数',
      spirit:'每层体力回复+1，每回合层数-1',
      wushi:'每层减少1点伤害，上限10层',
      arrogance:'每层提供6%智力，然后降低10%；每层无视抵消一层降低效果',
      shuangdie:'每层抵挡一段伤害，每次抵挡消耗1层',
      smart:'每层使智力降低5%，每回合减少2层',
      accuracy:'每层使伤害有3%概率变为180%，概率加算',
      inspiration:'每层使下张思路卡消耗-1',
      careful:'每层使下张逻辑卡伤害+10%，最多3层',
    };
    for(let [st,layers] of Object.entries(cd.status)) {
      statusTip += `获得${layers}层: ${tips[st]||st}`;
    }
  }
  // 薛诗蕾线：已变更/压轴徽标（2026-08-24）
  let ref = cd.ref || cd.id;
  let changedBadge = (G.isCardCostChanged ? G.isCardCostChanged(cd) : (b.cardChanged && b.cardChanged[ref])) ? '<span class="changed-badge">【已变更】</span>' : '';
  // 条件达成亮红光（2026-09-09）：压轴、刷题2费、苏醒加成、破绽击破等全部走统一红光
  let condGlow = G.cardConditionMet ? G.cardConditionMet(cd, cardId) : (cd.yazhou && b.hand.filter(r => r !== cardId).length === 0);
  return G.cardFaceHtml(cd, {
    id: 'bcard-'+index,
    cls: (!canPlay ? 'unplayable ' : '') + (changedBadge ? 'cost-changed ' : '') + (condGlow ? 'cond-red ' : '') + (extraCls || ''),
    title: statusTip || '',
    badge: changedBadge,
    // 手牌扇形（2026-08-23 LoR 风格）：CSS 变量驱动弧形排列，CSS 侧 transform 读变量
    style: (fanRot !== undefined && fanRot !== null) ? `--fan-rot:${fanRot}deg;--fan-y:${fanY}px` : ''
  });
};

// 状态小图标占位图案与底色调（2026-08-30 改版：buff 改为正方形小图标）
// 真实图案由后续替换 buff/{key}.png 实现；图标缺失时显示 占位emoji+底色
G.STATUS_ICON_META = {
  rationality:['🧠','#2040a0'], sensibility:['💡','#802060'], serious:['🎯','#804020'],
  spirit:['⚡','#206040'], vulnerable:['💔','#8a5a20'], smart:['🔔','#208080'],
  accuracy:['🎯','#a05a20'], inspiration:['✨','#6040a0'], careful:['🔍','#206a80'],
  wushi:['🛡️','#5a6a80'], arrogance:['😤','#a03030'], shuangdie:['🦋','#7030a0'],
  poison:['☠️','#47702a'],
};
G.STATUS_TIPS = {
  rationality:'每层使智力提升20%；造成伤害后-1层，多段视为一次伤害', sensibility:'造成一段伤害时获得等同当前层数的本场情商，随后-1层；上限3层', serious:'每层使下一张逻辑卡每段伤害+3；回合结束移除全部层数', spirit:'每层使体力回复量+1；每回合减少1层', vulnerable:'受到伤害时，伤害额外增加1点', smart:'每层使智力降低5%；每回合减少2层', accuracy:'每层使伤害有3%概率变为180%；概率加算', inspiration:'每层使下一张思路卡消耗-1，最低为0；使用思路卡后移除所有灵感', careful:'每层使下一张逻辑卡伤害+10%，最多3层；使用逻辑卡后移除所有细心', wushi:'每层减少1点受到的伤害，上限10层', arrogance:'每层提供6%智力，然后降低10%；每层无视可使一层的降低效果无效', shuangdie:'每层抵挡一段伤害；每次抵挡消耗1层', poison:'回合结算时受到等同层数的伤害，随后按当前战斗规则减少层数'
};
G.renderStatuses = function(statuses, excluded) {
  if(!statuses) return '';
  let tips = {
    rationality:'每层使智力提升20%；造成伤害后-1层，多段视为一次伤害',
    sensibility:'造成一段伤害时获得等同当前层数的本场情商，随后-1层；上限3层',
    serious:'每层使下一张逻辑卡每段伤害+3；回合结束移除全部层数',
    spirit:'每层体力回复+1，每回合层数-1',
    vulnerable:'受到的伤害+1',
    smart:'每层使智力降低5%，每回合减少2层',
    accuracy:'每层使伤害有3%概率变为180%，概率加算',
    inspiration:'每层使下张思路卡消耗-1',
    careful:'每层使下张逻辑卡伤害+10%，最多3层',
    wushi:'每层减少1点伤害，上限10层',
    arrogance:'每层提供6%智力，然后降低10%；每层无视抵消一层降低效果',
    shuangdie:'每层抵挡一段伤害，每次抵挡消耗1层',
  };
  let hidden = new Set(excluded || []);
  return Object.entries(statuses).filter(([k,v])=>v>0 && !hidden.has(k)).map(([k,v]) => {
    let meta = G.STATUS_ICON_META[k] || [k.charAt(0), '#333'];
    let nm = G.STATUS_NAMES[k] || k;
    let effect = G.STATUS_TIPS[k] || tips[k] || '该状态已有数值，但尚未配置效果说明';
    let tip = `【${nm}】\n当前层数：${v}\n效果：${effect}`;
    let safeTip = tip.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return `<span class="buff-icon" data-tip="${safeTip}" onmouseenter="G.showBuffTooltip(event,this.dataset.tip)" onmousemove="G.moveBuffTooltip(event)" onmouseleave="G.hideBuffTooltip()" style="--bc:${meta[1]}">
      <img class="buff-ico" src="buff/${k}.png" onerror="this.remove()" alt="">
      <span class="buff-sym">${meta[0]}</span>
      <span class="buff-num">${v}</span>
    </span>`;
  }).join('');
};

// BUFF 提示挂到 body 顶层，避免被战斗区、卡牌插画或 overflow 容器裁切。
G.showBuffTooltip = function(ev, text) {
  let tip = document.getElementById('globalBuffTooltip');
  if(!tip) {
    tip = document.createElement('div');
    tip.id = 'globalBuffTooltip';
    document.body.appendChild(tip);
  }
  tip.textContent = text || '暂无效果说明';
  tip.classList.add('show');
  G.moveBuffTooltip(ev);
};
G.moveBuffTooltip = function(ev) {
  let tip = document.getElementById('globalBuffTooltip');
  if(!tip || !ev) return;
  let x = ev.clientX + 14, y = ev.clientY + 14;
  let w = tip.offsetWidth || 250, h = tip.offsetHeight || 80;
  if(x + w > window.innerWidth - 8) x = ev.clientX - w - 14;
  if(y + h > window.innerHeight - 8) y = ev.clientY - h - 14;
  tip.style.left = Math.max(8,x) + 'px';
  tip.style.top = Math.max(8,y) + 'px';
};
G.hideBuffTooltip = function() {
  let tip = document.getElementById('globalBuffTooltip');
  if(tip) tip.classList.remove('show');
};

G.bindBattleResourceTips = function() {
  document.querySelectorAll('#battleStage .util-badge, #battleStage .et-energy, #battleStage .nexus-shield, #battleStage .vital-item, #battleStage .partner-resource-tip, #battleStage .skill-tooltip').forEach(el => {
    if(el.dataset.globalTipBound === '1' || !el.dataset.tip) return;
    el.dataset.globalTipBound = '1';
    el.addEventListener('mouseenter', ev => G.showBuffTooltip(ev, el.dataset.tip));
    el.addEventListener('mousemove', G.moveBuffTooltip);
    el.addEventListener('mouseleave', G.hideBuffTooltip);
  });
};

G.renderSkills = function(b) {
  let s = G.state;
  let ch = s.character;
  let html = '<div id="skillRow">';
  // 技能说明统一使用顶层悬浮框：不会被战斗区域裁切，冷却中的技能也能查看。
  let safeTip = text => String(text || '')
    .replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  let charReady = b.charSkillCd <= 0 && b.phase === 'player';
  let charTip = `【${ch.skill.name}】\n${ch.skill.desc}\n冷却：${ch.skill.cd}回合`;
  html += `<span class="skill-tooltip" data-tip="${safeTip(charTip)}">
    <button class="btn small ${charReady?'primary':''}"
      ${charReady?'':'disabled'}
      onclick="G.useSkill('char')">
      🎯 ${ch.skill.name} ${b.charSkillCd>0?'⏳'+b.charSkillCd:'✅'}
    </button>
  </span>`;
  // Partner skill（2026-08-21 热情系统：消耗热情释放，无CD）
  // 多搭档制（2026-08-24）：每位搭档一个技能按钮
  if(s.partners && s.partners.length) {
    s.partners.forEach((p, idx) => {
      let ps = G.partnerSkillInfo(p);
      let pReady = (b.passion >= ps.cost) && b.phase === 'player';
      let partnerTip = `【${ps.name}】\n消耗${ps.cost}热情。${ps.desc}`;
      html += `<span class="skill-tooltip partner-resource-tip" data-tip="${safeTip(partnerTip)}">
        <button class="btn small ${pReady?'primary':''}"
          ${pReady?'':'disabled'}
          onclick="G.useSkill('partner',${idx})">
          👥 ${ps.name} Lv.${ps.level} 🔥${ps.cost}
        </button>
      </span>`;
    });
    html += `<span class="btn small disabled" data-tip="【热情】\n所有搭档共享的消耗资源；使用搭档技能时消耗，每回合按情商回复。" onmouseenter="G.showBuffTooltip(event,this.dataset.tip)" onmousemove="G.moveBuffTooltip(event)" onmouseleave="G.hideBuffTooltip()">🔥(${b.passion}/${b.passionMax})</span>`;
  }
  html += '</div>';
  return html;
};

// 搭档技能定义（2026-08-21 热情系统：技能消耗热情释放，无CD）
G.PSKILLS = {
  jiangjiaqi:{name:'打报告',cost:2,desc:'选择弃置3张手牌，然后从卡组选择1张牌获取'},
  xiaomeng_teacher:{name:'多睡觉',cost:3,desc:'回复1点体力'},
  xuerengui:{name:'任性',cost:2,desc:'摸1张牌'},
  linxiaoman:{name:'再借一次',cost:2,desc:'从弃牌堆选择1张牌加入手牌'},
  zhaotianle:{name:'借力打力',cost:2,desc:'失去当前40%护盾，造成等量真实伤害'},
  sukexin:{name:'划重点',cost:3,desc:'选择1张手牌放到卡组底部，然后摸2张牌'},
};
G.partnerSkillInfo = function(partner) {
  let lv=Math.min(3,Math.max(1,partner.level||1)), base=G.PSKILLS[partner.id]||{name:'?',cost:2,desc:''}, cost=base.cost, desc=base.desc;
  if(partner.id==='jiangjiaqi') {
    let discard=lv===1?3:(lv===2?2:1);cost=lv>=3?3:2;
    desc=`选择弃置${discard}张手牌，然后从卡组选择1张牌获取`;
  } else if(partner.id==='xiaomeng_teacher') {
    cost=lv>=3?4:3;desc=`回复${lv>=3?2:1}点体力${lv>=2?'，摸1张牌':''}`;
  } else if(partner.id==='xuerengui') {
    cost=lv===1?2:(lv===2?3:4);desc=`摸${lv>=2?2:1}张牌${lv>=3?'，回复1点体力':''}`;
  } else if(partner.id==='linxiaoman') {
    cost=lv>=3?3:2;desc=`从弃牌堆选择1张牌加入手牌${lv>=2?'，该牌本回合消耗-1':''}${lv>=3?'并获得【保留】':''}`;
  } else if(partner.id==='zhaotianle') {
    cost=lv>=3?3:2;desc=lv===1?'失去当前40%护盾，造成等量真实伤害':lv===2?'失去当前20%护盾，造成当前护盾40%的真实伤害':'失去当前20%护盾，造成当前护盾70%的真实伤害';
  } else if(partner.id==='sukexin') {
    cost=lv>=3?4:3;desc=`选择1张手牌放到卡组底部，然后摸${lv>=3?3:2}张牌${lv>=2?'；摸到的牌消耗-1':''}`;
  }
  return {name:base.name,cost:cost,desc:desc,level:lv};
};

G.chooseCreationDirection = function(ref, created) {
  let b = G.state.battle, st = b && b.creationCards ? b.creationCards[ref] : null;
  if(!st) return;
  let opts = Object.entries(G.CREATION_DIRECTIONS).map(([id,d]) => ({
    text:`${d.emoji} ${d.name}`,
    sub:id==='horror'?'脱手/回体/高费增幅/弃置敌方手牌':id==='romance'?'回响/治疗/低费增幅/本回合复制':id==='fantasy'?'移除/摸牌/2费增幅/沉默敌方手牌':'保留/洗牌/恒定1费/获取敌方卡牌',
    cb:() => {
      st.direction = id;
      b.log.push(`✍️ ${created?'开始创作':'切换方向'}: ${d.name}（灵感${st.inspiration}）`);
    }
  }));
  G.showChoiceModal(`✍️ ${created?'选择写作方向':'切换写作方向'}`, opts,{cancelable:true,onCancel:()=>{if(created){let i=b.hand.indexOf(ref);if(i>=0)b.hand.splice(i,1);delete b.creationCards[ref];}b.charSkillCd=0;G.render();}});
};

G.useSkill = function(type, partnerIdx) {
  let b = G.state.battle;
  if(b.phase !== 'player') return;
  let s = G.state;

  if(type === 'char') {
    if(b.charSkillCd > 0) return;
    let skill = s.character.skill;
    b.charSkillCd = skill.cd;
    // Execute skill effect
    if(skill.id === 'zaishuayiti') {
      // 再刷一题（2026-08-24 规范版）: 摸2张逻辑卡，接下来2张逻辑卡消耗-1
      G.battleDrawLogic(2);
      b.logicDiscLeft = (b.logicDiscLeft || 0) + 2;
      b.log.push('🎯 再刷一题: 摸2张逻辑卡，接下来2张逻辑卡消耗-1');
    } else if(skill.id === 'creation') {
      // 创作：手中没有创作卡则生成；已有则切换方向。灵感和已加入效果均保留。
      let ref = G.creationRefInHand();
      let created = false;
      if(!ref) { ref = G.newCreationCard(); created = true; }
      G.chooseCreationDirection(ref, created);
    } else if(skill.id === 'jianshen') {
      // 健身: 回复最大生命值30%
      let heal = Math.floor((b.playerMaxHp + b.tempMaxHp) * 0.3);
      b.playerHp = Math.min(b.playerMaxHp + b.tempMaxHp, b.playerHp + heal);
      b.log.push('🏋️ 锻炼: 回复' + heal + '生命');
    } else if(skill.id === 'pini') {
      // 睥睨: +2无视，摸1张
      G.addPlayerStatus('wushi', 2);
      G.battleDraw(1);
      b.log.push('😏 睥睨: +2无视，摸1张牌');
    } else if(skill.id === 'huoli') {
      // 活力: 回复2点体力
      let g = G.gainEnergy(2);
      b.log.push(`⚡ 活力: 回复${g}体力`);
    } else if(skill.id === 'kantou') {
      let layers=b.playerStatuses.accuracy||0;
      let dmg=Math.floor((.3+layers*.2)*G.effectiveInt());
      G.dealMonsterDamage(dmg,'看透');
      if(G.rollChance(.5)){G.addPlayerStatus('accuracy',1);b.log.push('🔍 看透: 判定成功，精准+1');}
    } else if(skill.id === 'shangke_xianshui') {
      let got=G.gainEnergy(1);G.gainMengxie(2);b.log.push(`😴 上课先睡一觉: 回复${got}体力，获得2枚【梦屑】`);
    } else if(skill.id === 'duel') {
      // 决斗只覆盖由主动技能生成的旧破绽，不影响决斗之舞、无双挑战等来源。
      b.weaknesses=(b.weaknesses||[]).filter(w=>w.source!=='duel');
      let types=G.handFlawPriority(2);
      while(types.length<2){let t=G.pick(G.WEAK_TYPES.filter(x=>!types.includes(x)));if(!t)break;types.push(t);}
      types.forEach(type=>G.addWeakness(type,'duel',false));
      b.log.push(`⚔️ 决斗: 展示【${types.map(t=>G.WEAK_NAMES[t]+'破绽').join('、')}】`);
    } else if(skill.id === 'daguai_shengji') {
      let opts=b.hand.map((ref,i)=>({ref,i})).filter(x=>G.cardQualityLevel(G.cardQualityKey(x.ref))<3).map(x=>({text:`${G.getCardData(x.ref).name}（${G.cardQualityKey(x.ref)}）`,sub:G.getCardData(x.ref).desc,cb:()=>G.upgradeHandCard(x.i,false,false)}));
      if(!opts.length){b.charSkillCd=0;G.showToast('手牌中没有可升级的卡牌');G.render();return;}
      G.showChoiceModal('🎮 打怪升级 — 选择1张手牌',opts,{cancelable:true,onCancel:()=>{b.charSkillCd=0;G.render();}});
    }
  } else if(type === 'partner') {
    // 多搭档制（2026-08-24）：按序号取搭档
    let partner = (s.partners && s.partners[partnerIdx||0]) || null;
    if(!partner) return;
    let ps = G.partnerSkillInfo(partner), lv=ps.level;
    if(!ps) return;
    if(b.passion < ps.cost) { G.showToast(`🔥 热情不足（需要${ps.cost}，当前${b.passion}）`); return; }
    b.passion -= ps.cost;
    b.log.push(`🔥 ${partner.name} 消耗${ps.cost}热情，剩余${b.passion}`);
    // Execute partner skill
    if(partner.id === 'jiangjiaqi') {
      let need=lv===1?3:(lv===2?2:1);
      if(b.hand.length<need){b.passion+=ps.cost;G.showToast(`至少需要${need}张手牌才能使用【打报告】`);G.render();return;}
      function chooseDiscard(left){
        if(left<=0){
          let choices=[...new Set(b.drawPile)];
          if(!choices.length){b.log.push('👥 打报告: 卡组中没有可获取的牌');G.render();return;}
          G.showChoiceModal('📋 打报告 — 从卡组选择1张牌获取',choices.map(cid=>({text:G.getCardData(cid).name,sub:G.getCardData(cid).desc,cb:()=>{let at=b.drawPile.indexOf(cid);if(at>=0)b.drawPile.splice(at,1);b.hand.push(cid);b.log.push(`👥 打报告: 获得【${G.getCardData(cid).name}】`);G.render();}})));return;
        }
        G.showChoiceModal(`📋 打报告 — 选择弃置手牌（还需${left}张）`,b.hand.map((cid,index)=>({text:G.getCardData(cid).name,sub:G.getCardData(cid).desc,cb:()=>{let discarded=b.hand.splice(index,1)[0];if(discarded)G.discardFromHand(discarded);chooseDiscard(left-1);}})),left===need?{cancelable:true,onCancel:()=>{b.passion+=ps.cost;G.render();}}:{});
      }
      chooseDiscard(need);
    } else if(partner.id === 'xiaomeng_teacher') {
      let gain=G.gainEnergy(lv>=3?2:1),drawn=lv>=2?G.battleDraw(1):0;
      let drawNote=lv>=2?(drawn?'，摸1张牌':`，摸牌未成功（牌库${b.drawPile.length}张，弃牌堆${b.discard.length}张，非保留手牌${G.handCount(b)}/${G.HAND_CAP}）`):'';
      b.log.push(`👥 多睡觉: 回复${gain}点体力${drawNote}`);
    } else if(partner.id === 'xuerengui') {
      G.battleDraw(lv>=2?2:1);let gain=lv>=3?G.gainEnergy(1):0;
      b.log.push(`👥 任性: 摸${lv>=2?2:1}张牌${lv>=3?`，回复${gain}点体力`:''}`);
    } else if(partner.id === 'linxiaoman') {
      if(!b.discard.length){b.passion+=ps.cost;G.showToast('弃牌堆中没有可以借回的牌');G.render();return;}
      G.showChoiceModal('📚 再借一次 — 选择1张牌',b.discard.map((ref,index)=>{let d=G.getCardData(ref);return {text:d.name,sub:d.desc,cb:()=>{let picked=b.discard.splice(index,1)[0];if(lv>=3){let at=picked.indexOf('@');picked=at>=0?picked.slice(0,at)+'#borrow'+picked.slice(at):picked+'#borrow';}b.hand.push(picked);if(lv>=2)G.changeCardCost(picked,-1);b.log.push(`👥 再借一次: 将【${d.name}】加入手牌${lv>=3?'并赋予【保留】':''}`);G.render();}}}),{cancelable:true,onCancel:()=>{b.passion+=ps.cost;G.render();}});return;
    } else if(partner.id === 'zhaotianle') {
      let current=Math.max(0,b.playerShield||0),loss=Math.floor(current*(lv>=2?.2:.4)),dmg=Math.floor(current*(lv>=3?.7:.4));
      b.playerShield=Math.max(0,current-loss);b.log.push(`👥 借力打力: 失去${loss}护盾，造成${dmg}点真实伤害`);
      if(dmg>0){let before=b.monsterHp;b.monsterHp-=dmg;G.fx.attackMonster(dmg);b.log.push(`💥 借力打力: 敌方生命${before}→${b.monsterHp}`);if(b.monsterHp<=0&&!b.over){b.over=true;b.won=true;b.log.push('🎉 击败了 '+b.monsterData.name+'！');if(G.fx&&G.fx.killFx)G.fx.killFx('monster');}}
    } else if(partner.id === 'sukexin') {
      if(!b.hand.length){b.passion+=ps.cost;G.showToast('手牌中没有可以放回的牌');G.render();return;}
      G.showChoiceModal('📝 划重点 — 选择1张手牌放到卡组底部',b.hand.map((ref,index)=>{let d=G.getCardData(ref);return {text:d.name,sub:d.desc,cb:()=>{let picked=b.hand.splice(index,1)[0];G.clearCardHandRecords(picked,false);b.drawPile.unshift(picked);let start=b.hand.length,n=lv>=3?3:2;G.battleDraw(n);let drawn=b.hand.slice(start);if(lv>=2)[...new Set(drawn)].forEach(cid=>G.changeCardCost(cid,-1));b.log.push(`👥 划重点: 将【${d.name}】放到卡组底部，摸${drawn.length}张牌${lv>=2?'，摸到的牌消耗-1':''}`);G.render();}}}),{cancelable:true,onCancel:()=>{b.passion+=ps.cost;G.render();}});return;
    }
  }
  G.render();
};

G.battleDrawLogic = function(count) {
  let b = G.state.battle;
  let drawn = 0;
  if(G.sfx && count > 0) G.sfx.play('draw');
  // 银河英雄传说buff：摸牌数量×2（修复：此前该入口漏掉加成，2026-08-22）
  if(b.novelBuff === 'yinhe') count *= 2;
  // 与普通摸牌一致：只在整次定向摸牌开始前、抽牌堆为空时洗牌。
  if(b.drawPile.length === 0 && b.discard.length > 0) {
    b.drawPile = b.discard.splice(0, b.discard.length);
    G.shuffleInPlace(b.drawPile);
    b.log.push('🔄 弃牌堆洗入卡组');
  }
  // Try to draw logic cards from draw pile
  for(let i=0;i<count;i++) {
    // 满手抽牌（2026-08-24）：手牌上限10（保留不占上限），直接放弃本次逻辑卡检索
    if(G.handCount && G.handCount(b) >= G.HAND_CAP) {
      b.log.push('🖐️ 手牌已满，无法再摸逻辑卡');
      break;
    }
    // Search for logic card
    let found = false;
    for(let j=b.drawPile.length-1;j>=0;j--) {
      let cd = G.getCardData(b.drawPile[j]);
      if(cd && cd.type === 'logic') {
        b.hand.push(b.drawPile.splice(j,1)[0]);
        drawn++;
        found = true;
        break;
      }
    }
    if(!found && b.drawPile.length > 0) {
      b.hand.push(b.drawPile.pop());
      drawn++;
    }
  }
  if(drawn && G.fx && G.fx.drawReveal) G.fx.drawReveal(drawn);
};

G.renderEnergy = function(cur, max) {
  // 体力配色改为黄色（2026-08-19 用户需求），与卡牌费用角标 #ffd700 统一
  let html = '<span style="font-size:10px;color:#f5d76e;margin-right:4px">⚡体力:</span>';
  for(let i=0;i<max;i++) {
    html += `<span class="energy-dot ${i<cur?'filled':'empty'}"></span>`;
  }
  html += ` <span style="font-size:10px;color:#f5d76e">${cur}/${max}</span>`;
  return html;
};

// --- BOOK CORNER ---
G.renderBookCorner = function(main,bot) {
  let s = G.state;
  if(!s._bookCornerDone) s._bookCornerDone = false; // 进入时重置
  let options = G.getBookCornerOptions();
  let done = s._bookCornerDone;
  let readingInfo = '';
  if(s.readingBook && !s.books[s.readingBook].completed) {
    let rb = s.books[s.readingBook];
    let rbd = G.BOOKS[s.readingBook];
    readingInfo = `<div style="background:#1a2a3a;padding:8px;border-radius:6px;margin-bottom:12px">
      📖 当前阅读: 《${rbd.name}》[${rb.progress}/${rbd.need}]
      <div class="progress-bar"><div class="progress-fill" style="width:${rb.progress/rbd.need*100}%"></div></div>
    </div>`;
  }

  main.innerHTML = `
    <h3 style="text-align:center;color:#e0a040;margin-bottom:8px">📚 图书角</h3>
    ${readingInfo}
    <p style="font-size:11px;color:#8ab4f8;margin-bottom:8px">选择一本书阅读（阅读速度: ${s.readingSpeed}/次）</p>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${options.map((opt,i) => {
        let bd = opt.book;
        let bk = s.books[bd.id];
        let isReading = opt.isReading;
        let progressText = isReading ? `📖 继续阅读 [${bk.progress}/${bd.need}]` : `阅读后: ${G.formatReward(bd.reward)}`;
        return `
        <div class="card book-option ${done?'disabled':''}" style="max-width:100%;cursor:${done?'default':'pointer'};border-color:${isReading?'#e0a040':'#2a4a6a'}" data-book-id="${bd.id}">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:24px">${bd.emoji}</span>
            <div style="flex:1">
              <div style="font-weight:bold;font-size:13px">${isReading?'📖 ':''}《${bd.name}》${i===0&&isReading?' ← 阅读中':''}</div>
              <div style="font-size:10px;color:#a0b8d0">${bd.desc}</div>
              <div style="font-size:10px;color:#40e060;margin-top:2px">${progressText}</div>
              ${bd.reward&&bd.reward.card?`<div style="font-size:10px;color:#765f3d;margin-top:3px">书籍卡效果：${G.bookCardEffectText(bd)}</div>`:''}
            </div>
            ${isReading?`<div style="font-size:10px;color:#e0a040">${bk.progress}/${bd.need}</div>`:''}
          </div>
        </div>`;
      }).join('')}
    </div>
    <h3 style="text-align:center;color:#d8a8ff;margin:16px 0 8px">✍️ 已阅读 · 自创书籍</h3>
    <div style="display:flex;flex-direction:column;gap:6px;max-height:26vh;overflow:auto">
      ${(s.createdBooks||[]).length===0?`<div style="font-size:11px;color:#6a8aaa;text-align:center;padding:12px">尚未完成创作。打出创作卡并赢得战斗后，可命名成书。</div>`:(s.createdBooks||[]).map(w=>`
        <div style="background:rgba(70,35,90,.45);border:1px solid #a878c8;border-radius:6px;padding:8px 10px">
          <div style="color:#fff;font-size:13px">📕 《${w.name}》 <span style="color:#d8a8ff;font-size:10px">${w.directionName||'创作'} · 灵感${w.inspiration||0}</span></div>
          <div style="font-size:10px;color:#aeb8d8;margin-top:3px">${(w.effects||[]).length?(w.effects||[]).join('；'):'无附加灵感效果'}</div>
        </div>`).join('')}
    </div>`;

  // "继续" button in main area if done
  if(done) {
    main.innerHTML += `<div style="text-align:center;margin-top:16px">
      <button class="btn primary" style="width:100%;height:48px;font-size:16px" onclick="G.setScreen('map')">继续前进 →</button>
    </div>`;
  }
  bot.innerHTML = done ? '' : `<span style="font-size:11px;color:#8ab4f8">📖 选择一本书阅读（每处图书角限读一次）</span>`;

  // Attach book click handlers (avoids quote escaping issues)
  if(!done) {
    document.querySelectorAll('.book-option').forEach(el => {
      el.onclick = function() {
        let bookId = this.getAttribute('data-book-id');
        if(bookId) G.doReading(bookId);
      };
    });
  }
};

// --- REWARD ---
G.renderReward = function(main,bot) {
  let s = G.state;
  let cards = s.pendingReward || [];
  main.innerHTML = `
    <h3 style="text-align:center;color:#ffd700;margin-bottom:8px">🎁 战斗奖励 — 选择一张卡牌</h3>
    <p style="text-align:center;color:#765f3d">本场战斗获得：${s.lastBattleGold||0}零花钱</p>
    <p style="text-align:center;font-size:11px;color:#765f3d;margin-bottom:12px">选择一张，或跳过获得20零花钱；本次可花10零花钱刷新一次。</p>
    <div class="deck-grid" style="display:flex;justify-content:center;flex-wrap:wrap;gap:28px;padding-top:40px">
      ${cards.map(cid => {
        let cd = G.getCardData(cid);
        if(!cd) return '';
        let itemId=s.pendingRewardItems&&s.pendingRewardItems[cid],item=itemId&&G.CARD_ITEMS[itemId];
        return `<div style="cursor:pointer" onclick="G.pickReward('${cid}')">${G.cardFaceHtml(cd)}${item?`<div class="reward-item"><div class="reward-item-name">携带道具：${item.emoji||'🎒'}【${item.name}】</div><div class="reward-item-desc">${G.decorateKeywords(item.desc||'无效果')}</div></div>`:''}</div>`;
      }).join('')}
    </div><div style="display:flex;justify-content:center;gap:10px;margin-top:14px"><button class="btn" onclick="G.skipReward()">跳过（+20）</button><button class="btn" ${s.rewardRefreshUsed||s.gold<10?'disabled':''} onclick="G.refreshReward()">刷新全部（10）</button></div>`;
  bot.innerHTML = '';
};
G.finishRewardRoute=function(){let s=G.state;if(s.battle)s.hp=s.battle.playerHp;if(s._chapterClear){s._chapterClear=false;if(s.chapter>=6){setTimeout(()=>G.setScreen('victory'),250);return;}s.chapter++;G.generateMap();s.completedNodes={};s.reachableNodes={};s.reachableNodes[s.chapterMap.nodes[0].id]=true;s.currentNodeId=null;}G.setScreen('map');};
G.skipReward=function(){let s=G.state;s.pendingReward=null;let gain=G.gainGold(20);G.showToast(`跳过奖励，获得${gain}零花钱`);G.finishRewardRoute();};
G.refreshReward=function(){let s=G.state;if(s.rewardRefreshUsed||s.gold<10)return;s.gold-=10;s.rewardRefreshUsed=true;s.pendingReward=G.generateRewardCards();G.render();};
G.renderBookReward=function(main,bot){
  let s=G.state,ids=(s.pendingBookReward||[]).filter(id=>G.BOOKS&&G.BOOKS[id]&&s.books&&s.books[id]&&!s.books[id].obtained);
  if(!ids.length){
    s.pendingBookReward=null;
    main.innerHTML=`<div style="text-align:center;padding:42px 16px"><h3 style="color:#765f3d">📚 月考奖励</h3><p style="color:#765f3d;line-height:1.8">目前没有可获取的新书了。先继续前进，之后还会遇到其他奖励。</p><button class="btn primary" style="min-width:180px;margin-top:16px" onclick="G.finishRewardRoute()">继续前进 →</button></div>`;
    bot.innerHTML='';
    return;
  }
  main.innerHTML=`<h3 style="text-align:center;color:#765f3d">📚 月考奖励 · 选择一本书</h3><div class="book-reward-grid">${ids.map(id=>{let b=G.BOOKS[id];return `<div class="book-reward-card" onclick="G.pickBookReward('${id}')"><div class="book-reward-icon">${b.emoji||'📖'}</div><b>《${b.name}》</b><p>${G.decorateKeywords(b.desc||'')}</p><small>阅读进度 ${b.need}｜完成效果：${G.formatReward(b.reward)}</small>${b.reward&&b.reward.card?`<small style="display:block;margin-top:6px">书籍卡效果：${G.bookCardEffectText(b)}</small>`:''}</div>`}).join('')}</div>`;
  bot.innerHTML='';
};
G.pickBookReward=function(id){
  let s=G.state,b=G.BOOKS&&G.BOOKS[id];
  if(!b||!s.books||!s.books[id]||s.books[id].obtained)return;
  s.books[id].obtained=true;
  s.pendingBookReward=null;
  G.showToast(`获得书籍《${b.name}》`);
  G.finishRewardRoute();
};
G.openBookshelfFrom=function(screen){G.state.bookshelfReturnScreen=screen||'map';G.setScreen('bookshelf');};

G.pickReward = function(cardId) {
  let s = G.state;
  s.deck.push(cardId);
  let rewardItem=s.pendingRewardItems&&s.pendingRewardItems[cardId];if(rewardItem){let base=G.baseId(cardId);s.cardItems=s.cardItems||{};s.cardItems[base]=s.cardItems[base]||[];if(!s.cardItems[base].includes(rewardItem))s.cardItems[base].push(rewardItem);}
  s.pendingReward = null;
  s.pendingRewardItems = null;
  if(G.sfx) G.sfx.play('talent'); // 获得奖励音效（2026-08-23）
  // Restore HP from battle
  if(s.battle) s.hp = s.battle.playerHp;
  G.showToast('✅ 获得: ' + G.getCardData(cardId).name);
  // 期末考通关 → 下一章 / 通关
  if(s._chapterClear) {
    s._chapterClear = false;
    if(s.chapter >= 6) {
      setTimeout(() => G.setScreen('victory'), 600);
    } else {
      s.chapter++;
      G.generateMap();
      s.completedNodes = {}; s.reachableNodes = {};
      let firstId = s.chapterMap.nodes[0].id;
      s.reachableNodes[firstId] = true;
      s.currentNodeId = null;
      G.showToast('📖 进入' + s.chapterMap.name);
      setTimeout(() => G.setScreen('map'), 900);
    }
    return;
  }
  setTimeout(() => G.setScreen('map'), 600);
};

// --- REST ---
G.renderRest = function(main,bot) {
  let s = G.state;
  main.innerHTML = `
    <h3 style="text-align:center;color:#40e060;margin-bottom:16px">🏕️ 休息处</h3>
    <div style="text-align:center;margin-bottom:12px">
      <p style="color:#a0b8d0">❤️ 生命: ${s.hp}/${s.maxHp}</p>
      <p style="color:#8ab4f8;font-size:11px">已自动回复 (20%最大+20%已损失)</p>
    </div>
    <div style="text-align:center;margin-bottom:12px">
      <button class="btn" onclick="G.restRemoveCard()">🗑️ 移除一张卡牌</button>
    </div>
    <div style="font-size:10px;color:#6a8aaa;text-align:center">
      📋 卡组: ${s.deck.length}张
    </div>`;
  bot.innerHTML = `<button class="btn primary" style="flex:1" onclick="G.setScreen('map')">继续前进 →</button>`;
};

G.restRemoveCard = function() {
  let s = G.state;
  let uniq = [...new Set(s.deck)];
  if(uniq.length === 0) return;
  let html = `<h3 class="paper-title">🗑️ 选择要移除的卡牌</h3>
    <div class="deck-grid">
      ${uniq.map(cid => {
        let cd = G.getCardData(cid);
        if(!cd) return '';
        let cnt = s.deck.filter(c => c === cid).length;
        return `<div style="cursor:pointer" onclick="G._restRemoveDo('${cid}')">${G.cardFaceHtml(cd, {count: cnt})}</div>`;
      }).join('')}
    </div>
    <button class="btn" style="width:100%;margin-top:10px" onclick="G.closeModal()">↩ 跳过（不移除）</button>`;
  G.showModal(html, 'paper');
};
G._restRemoveDo = function(cid) {
  let s = G.state;
  let idx = s.deck.indexOf(cid);
  if(idx >= 0) s.deck.splice(idx, 1);
  G.showToast('🗑️ 移除了' + G.getCardData(cid).name);
  G.closeModal();
  G.render();
};

// ==================== 小卖部 + 书架（2026-08-23） ====================
G._QUAL_COLOR = {green:'#3cb371', white:'#d0d0d0', blue:'#4f9cf0', purple:'#b26bd6', gold:'#ffd700'};
G._QUAL_NAME  = {green:'绿', white:'白', blue:'蓝', purple:'紫', gold:'金'};

G.renderShop = function(main,bot) {
  let s = G.state;
  if(!G._shopStock) G._shopStock = G.shopStock();
  if(!G._shopTab) G._shopTab = 1;
  let tab = G._shopTab;
  let page = tab===1 ? G._shopPageHeal() : (tab===2 ? G._shopPageDelete() : G._shopPageGoods());
  main.innerHTML = `
    <h3 style="text-align:center;color:#e0a040;margin-bottom:10px">🏪 小卖部</h3>
    <div style="display:flex;gap:10px;align-items:flex-start">
      <div style="display:flex;flex-direction:column;gap:6px;flex:0 0 46px">
        ${[{id:1,label:'补给'},{id:2,label:'删卡'},{id:3,label:'商品'}].map(x=>`<button class="btn" style="${tab===x.id?'background:#ffd700;color:#202;padding:8px 2px':'padding:8px 2px'};font-size:10px" onclick="G._setShopTab(${x.id})">${x.label}</button>`).join('')}
      </div>
      <div style="flex:1;min-width:0">${page}</div>
    </div>`;
  bot.innerHTML = `<button class="btn primary" style="flex:1" onclick="G.setScreen('map')">出发 →</button>`;
};
G._setShopTab = function(i) { G._shopTab = i; G.render(); };

G._shopPageHeal = function() {
  let s = G.state;
  let lost = s.maxHp - s.hp;
  let heal = Math.floor(lost * G.SHOP_HEAL_LOST + s.maxHp * G.SHOP_HEAL_MAX);
  return `<div style="text-align:center">
    <div style="font-size:13px;color:#a0b8d0;margin-bottom:12px">🍔 吃点零食补充体力</div>
    <p style="color:#40e060;font-size:24px;margin:6px 0">❤️ ${s.hp}/${s.maxHp}</p>
    <p style="font-size:11px;color:#8ab4f8;margin-bottom:4px">回复 ${heal} 生命</p>
    <p style="font-size:10px;color:#6a8aaa;margin-bottom:14px">20%已损失生命 + 10%最大生命</p>
    <button class="btn primary" style="width:80%;margin:0 auto;display:block" onclick="G.shopHeal()">🍙 大快朵颐</button>
  </div>`;
};

G._shopPageDelete = function() {
  let s = G.state;
  let cost = G.shopDeleteCost();
  return `<div style="text-align:center">
    <div style="font-size:13px;color:#a0b8d0;margin-bottom:12px">🗑️ 清理卡组</div>
    <p style="font-size:12px;color:#8ab4f8">第 ${(s._shopDeleteCount||0)+1} 次删卡${cost>0?`，花费 <b style="color:#ffd700">${cost}</b> 零花钱`: '，本次免费'}</p>
    <div style="font-size:10px;color:#6a8aaa;margin:8px 0 12px">当前卡组 ${s.deck.length} 张</div>
    <button class="btn ${cost===0?'primary':''}" style="width:80%;margin:0 auto;display:block" onclick="G.shopDeleteCard()">🗑️ 选择要删除的卡</button>
  </div>`;
};

G._shopRow = function(title, items, cat) {
  let s = G.state;
  let html = `<div style="margin-bottom:10px"><div style="font-size:12px;color:#e0a040;margin-bottom:5px">${title}</div>`;
  if(!items.length) { html += `<div style="font-size:10px;color:#6a8aaa">已售罄</div>`; }
  else {
    html += `<div style="display:flex;flex-direction:column;gap:5px">` + items.map((it,i) => `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;background:rgba(0,0,0,.35);border:1px solid ${G._QUAL_COLOR[it.q]};border-radius:6px;padding:6px 10px">
        <span style="color:#fff;font-size:12px;min-width:0"><span>${it.emoji||''} ${it.name} <span style="color:${G._QUAL_COLOR[it.q]};font-size:10px">●${G._QUAL_NAME[it.q]}</span></span>${it.desc?`<small style="display:block;color:#9eb4ca;font-size:9px;line-height:1.35;margin-top:2px">${G.decorateKeywords(it.desc)}</small>`:''}</span>
        <button class="btn" style="padding:3px 9px;font-size:11px;flex:0 0 auto" onclick="G.shopBuy('${cat}',${i})">💰 ${it.price}${s.gold<it.price?'<span style="color:#f88;font-size:9px">(不足)</span>':''}</button>
      </div>`).join('') + `</div>`;
  }
  return html + `</div>`;
};

G._shopPageGoods = function() {
  let s=G.state,items=G._shopStock.product||[],refresh=G.shopRefreshCost();
  return `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><div style="font-size:12px;color:#e0a040">🛒 卡牌＋道具（${items.length}/12）</div><button class="btn" style="padding:4px 10px;font-size:10px" onclick="G.shopRefresh()">🔄 刷新 ${refresh}</button></div>
    <div class="shop-product-grid">${items.length?items.map((p,i)=>{
      if(p.bundleProducts){let inner=p.bundleProducts.map(x=>{let d=G.getCardData(x.cardRef);return `<div class="bundle-half">${G.cardFaceHtml(d,{cls:'shop-mini-card'})}<div class="shop-product-item"><span>${x.itemEmoji}</span><div><b>${x.itemName}</b><small>${G.decorateKeywords(x.itemDesc)}</small></div></div></div>`;}).join('<div class="bundle-plus">＋</div>');return `<div class="shop-product bundle-product"><span class="shop-discount">捆绑 7折</span><div class="bundle-row">${inner}</div><button class="btn" onclick="G.shopBuyProduct(${i})">💰 ${p.price} <del>${p.normalPrice}</del></button></div>`;}
      let cd=G.getCardData(p.cardRef),cq=G._QUAL_COLOR[p.cardQ]||'#fff',iq=G._QUAL_COLOR[p.itemQ]||'#fff';
      let ownedItemCount=((s.cardItems||{})[p.cardId]||[]).length;
      return `<div class="shop-product" style="border-color:${p.discount?'#ffd85a':cq}">
        ${p.discount?'<span class="shop-discount">首格 7折</span>':''}
        <div class="shop-product-card">${G.cardFaceHtml(cd,{cls:'shop-mini-card'})}</div>
        <div class="shop-product-item" style="border-color:${iq};position:relative"><span>${p.itemEmoji}</span><div><b>${p.itemName}</b><small>${G.decorateKeywords(p.itemDesc)}</small></div>${ownedItemCount>=3?'<em class="shop-replace-badge">可更换</em>':''}</div>
        <div class="shop-product-quality"><span style="color:${cq}">卡牌·${G._QUAL_NAME[p.cardQ]||p.cardQ}</span><span style="color:${iq}">道具·${G._QUAL_NAME[p.itemQ]||p.itemQ}</span></div>
        <button class="btn" onclick="G.shopBuyProduct(${i})">💰 ${p.price}${p.discount?` <del>${p.normalPrice}</del>`:''}${s.gold<p.price?'<i>不足</i>':''}</button>
      </div>`;
    }).join(''):'<div style="color:#789;text-align:center;padding:30px">商品已售罄</div>'}</div>
    <div style="margin-top:10px"><div class="section-title">📚 书籍</div><div style="display:flex;flex-direction:column;gap:6px">${(G._shopStock.book||[]).map((b,i)=>`<div class="paper-box" style="display:flex;align-items:center;gap:9px"><span style="font-size:24px">${b.emoji}</span><div style="flex:1"><b>《${b.name}》</b><small style="display:block">${b.desc||''}</small><small style="display:block">完成效果：${G.formatReward(G.BOOKS[b.id].reward)}</small><small style="display:block">书籍卡：${G.bookCardEffectText(G.BOOKS[b.id])}</small><small>阅读进度：${b.need}</small></div><button class="btn" onclick="G.shopBuy('book',${i})">💰 ${b.price}</button></div>`).join('')||'<div class="paper-box">本局已无可购买的新书籍</div>'}</div></div>`;
};

G.renderBookshelf = function(main,bot) {
  let s = G.state;
  let created = s.createdBooks || [];
  let owned = G.BOOK_LIST.filter(bid => s.books[bid].obtained);
  let tgt = G.getReadingTarget();
  main.innerHTML = `<h3 style="text-align:center;color:#e0a040;margin-bottom:6px">📚 书架</h3>
    <div style="font-size:11px;color:#8ab4f8;text-align:center;margin-bottom:10px">每经历一场战斗节点推进${s.readingSpeed}进度${tgt?`｜当前阅读：<b style="color:#ffe08a">《${G.BOOKS[tgt].name}》</b>`:''}</div>
    <div style="display:flex;flex-direction:column;gap:6px;max-height:62vh;overflow:auto">
      ${owned.length===0?`<div style="font-size:11px;color:#6a8aaa;text-align:center;padding:20px">暂无可阅读的书籍，去小卖部购买吧！</div>`:owned.map(bid=>{
        let b = s.books[bid], d = G.BOOKS[bid];
        let cur = s.readingBook === bid;
        let cardRef=d.reward&&d.reward.card,equipped=s.equippedBookCard===bid;
        let borderW = cur||equipped ? '3px' : '1px';
        return `<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;background:#fbf1d8;border:${borderW} solid #c9ad75;border-radius:6px;padding:8px 10px">
          <div>
            <div style="color:#4a3822;font-size:13px">${d.emoji} ${d.name}</div>
            <div style="font-size:10px;color:#765f3d">${d.desc||''}</div>
            <div style="font-size:10px;color:#765f3d">完成效果：${G.formatReward(d.reward)}</div>
            ${cardRef?`<div style="font-size:10px;color:#765f3d">书籍卡：${G.bookCardEffectText(d)}</div>`:''}
          </div>
          <div style="display:flex;flex-direction:column;gap:5px;min-width:92px">${b.completed?(cardRef?`<button class="btn" onclick="G.setEquippedBookCard('${bid}')">${equipped?'已携带':'携带此卡'}</button>`:'<span style="font-size:10px;color:#8a7653">书籍卡待配置</span>'):`<button class="btn" onclick="G.setReadingBook('${bid}')">${cur?'正在阅读':`阅读 ${b.progress}/${d.need}`}</button>`}</div>
        </div>`;
      }).join('')}
    </div>
    <h3 style="text-align:center;color:#d8a8ff;margin:16px 0 8px">✍️ 已阅读 · 小雅创作</h3>
    <div style="display:flex;flex-direction:column;gap:6px;max-height:26vh;overflow:auto">
      ${created.length===0?`<div style="font-size:11px;color:#6a8aaa;text-align:center;padding:12px">尚未完成创作。小雅打出创作卡并赢得战斗后，可命名成书。</div>`:created.map(w=>`
        <div style="background:rgba(70,35,90,.45);border:1px solid #a878c8;border-radius:6px;padding:8px 10px">
          <div style="color:#fff;font-size:13px">📕 《${w.name}》 <span style="color:#d8a8ff;font-size:10px">${w.directionName||'创作'} · 灵感${w.inspiration||0}</span></div>
          <div style="font-size:10px;color:#aeb8d8;margin-top:3px">${(w.effects||[]).length?(w.effects||[]).join('；'):'无附加灵感效果'}</div>
        </div>`).join('')}
    </div>`;
  bot.innerHTML = `<button class="btn" style="flex:1" onclick="G.setReadingBook(null)">取消指定阅读</button><button class="btn" style="flex:1" onclick="G.setEquippedBookCard(null)">卸下书籍卡</button><button class="btn primary" style="flex:1" onclick="G.setScreen(G.state.bookshelfReturnScreen||'map')">返回</button>`;
};

// --- GAME OVER ---
// 局末结算羁绊点/命运点（一局游戏后结算；若关系已至最高则1:1转命运点）
G.settleRun = function() {
  let s = G.state;
  if(s._bondSettled) return;
  s._bondSettled = true;
  let charId = s.character ? s.character.id : null;
  let gained = s.runBondPoints || 0;
  if(!charId || gained <= 0) return;
  if(G.bondLevelOf(charId) >= 5) {
    G.meta.fatePoints = (G.meta.fatePoints || 0) + gained;
    s.runFatePoints = (s.runFatePoints || 0) + gained;
    G.showToast(`🔮 关系已至最高，${gained} 羁绊点转化为命运点`);
  } else {
    G.meta.bondPoints[charId] = (G.meta.bondPoints[charId] || 0) + gained;
    G.showToast(`❤️ 羁绊点 +${gained}（累计 ${G.bondPointsOf(charId)}）`);
  }
  G.saveMeta();
};
G.renderGameOver = function(main,bot) { G.renderSettlement(main,bot); };

// --- VICTORY ---
G.renderVictory = function(main,bot) { G.renderSettlement(main,bot); };

G.finishSettlement=function(){
  G.clearRunSave(); G.state.createdBooks=[]; G.state.battle=null; G.state.character=null;
  G.state.screen='menu'; G.render();
};
G.renderSettlement=function(main,bot){
  G.settleRun();
  let s=G.state, st=s.runStats||{}, deck=s.deck||[], completed=Object.keys(s.books||{}).filter(id=>s.books[id]&&s.books[id].completed);
  let books=completed.map(id=>{let b=(G.BOOKS&&G.BOOKS[id])||{};return b.name||id;}).concat((s.createdBooks||[]).filter(b=>b.completed).map(b=>'《'+b.name+'》'));
  let talents=(s.talents||[]).map(id=>{let t=(G.TALENTS&&G.TALENTS[id])||{};return t.name||id;});
  let ach=(s.runAchievements||[]).map(id=>(G.XSL_ACHV||{})[id]).filter(Boolean).map(a=>a.name);
  let title=s.settlementReason==='abandoned'?'本局已放弃':(s.settlementReason==='gaokao'?'通过高考':'考试结算');
  main.className='settlement-mode';
  main.innerHTML=`<div class="settlement-page">
    <div class="settlement-deck"><h3>本局卡组</h3><div class="settlement-deck-list">${deck.length?deck.map((id,i)=>{let d=G.getCardData(id)||{name:id};let face=G.cardFaceHtml(Object.assign({},d,{ref:id}),{cls:'settlement-card-face'});return `<div class="settlement-deck-card"><span>${i+1}</span>${face}</div>`}).join(''):'暂无卡牌'}</div></div>
    <section class="settlement-center"><div class="settlement-summary"><div class="settlement-icon">${s.settlementReason==='abandoned'?'🏳️':'🎓'}</div><h1>${title}</h1><div class="settlement-metrics"><div><small>本次分数</small><strong>${s.settlementScore||0}</strong></div><div><small>本局命运点数</small><strong>${s.runFatePoints||0}</strong></div><div><small>本局羁绊点数</small><strong>${s.runBondPoints||0}</strong></div></div></div><div class="settlement-earned"><div><h2>获得的天赋</h2><p>${talents.length?talents.join('、'):'无'}</p></div><div><h2>阅读完毕的书籍</h2><p>${books.length?books.join('、'):'无'}</p></div></div></section>
    <aside class="settlement-side"><div><h2>达成成就</h2><p>${ach.length?ach.join('、'):'暂无'}</p></div><div><h2>本局记录</h2><p>一共造成伤害：${Math.floor(st.damageDealt||0)}<br>一共受到伤害：${Math.floor(st.damageTaken||0)}<br>重考次数：${st.retakes||0}<br>放弃次数：${st.abandons||0}<br>卡组最多数量：${Math.max(st.maxDeck||0,deck.length)}<br>高考进行回合数：${st.gaokaoTurns||0}</p></div></aside>
    <button class="btn primary settlement-back" onclick="G.finishSettlement()">返回主菜单</button></div>`;
  bot.innerHTML='';
};

// --- PARTNER SELECT ---
// 多搭档制（2026-08-24 肖清雅重做）：基础上限1，交际花上限+1；已选的搭档不再出现在候选里
G._PARTNER_POOL = [
  {id:'jiangjiaqi',name:'江佳琪',emoji:'📋',style:'检索支援型',desc:'有困难？找我准没错。',skill:'打报告：热情2，选择弃置3张手牌，然后从卡组选择1张牌获取',upgrade1:'弃置改为2张',upgrade2:'消耗+1，弃置改为1张'},
  {id:'xiaomeng_teacher',name:'小萌老师',emoji:'💤',style:'体力恢复型',desc:'困了就多睡一会儿吧。',skill:'多睡觉：热情3，回复1点体力',upgrade1:'额外摸1张牌',upgrade2:'消耗+1，回复量+1'},
  {id:'xuerengui',name:'薛任贵',emoji:'🎲',style:'摸牌支援型',desc:'这次就任性一下。',skill:'任性：热情2，摸1张牌',upgrade1:'消耗+1，额外摸1张',upgrade2:'消耗+1，回复1体力'},
  {id:'linxiaoman',name:'林小满',emoji:'📚',style:'弃牌回收型',desc:'图书管理员，借出去的好牌总能再找回来。',skill:'再借一次：热情2，从弃牌堆选择1张牌加入手牌',upgrade1:'该牌本回合消耗-1',upgrade2:'消耗+1，并使该牌获得【保留】'},
  {id:'zhaotianle',name:'赵天乐',emoji:'🏀',style:'护盾爆发型',desc:'体育委员，最擅长把防守直接撞成进攻。',skill:'借力打力：热情2，失去当前40%护盾并造成等量真实伤害',upgrade1:'仅失去20%护盾，伤害仍为40%',upgrade2:'消耗+1，伤害提升至护盾的70%'},
  {id:'sukexin',name:'苏可欣',emoji:'📝',style:'手牌规划型',desc:'学习委员，重点可以晚点看，但绝不会弄丢。',skill:'划重点：热情3，将1张手牌放到卡组底部，然后摸2张牌',upgrade1:'摸到的牌消耗-1',upgrade2:'消耗+1，改为摸3张牌'},
];
G.renderPartnerSelect = function(main,bot) {
  let s = G.state;
  let cap = G.partnerCap();
  let taken = new Set((s.partners||[]).map(p => p.id));
  let candidates = G._PARTNER_POOL.filter(p => !taken.has(p.id));
  let remain = cap - (s.partners||[]).length;
  let pick = remain>0 ? G.shuffle(candidates).slice(0,3) : [];
  let canUpgrade=(s.partnerNodesVisited||0)>1 && (s.partners||[]).length>0;
  main.innerHTML = `
    <h3 style="text-align:center;color:#ffd700;margin-bottom:8px">👥 选择搭档${cap>1?`（${(s.partners||[]).length+1}/${cap}）`:''}</h3>
    ${cap>1?`<p style="text-align:center;color:#8ab4f8;font-size:12px;margin-bottom:12px">交际花：你还可以选择${remain}位搭档</p>`:''}
    ${canUpgrade?`<button class="btn primary" style="width:100%;margin-bottom:12px" onclick="G.showPartnerUpgrade()">⬆️ 升级已有搭档</button>`:''}
    ${remain<=0?`<p style="text-align:center;color:#a0b8d0;font-size:11px">搭档已达上限，本节点请选择升级已有搭档。</p>`:''}
    <div class="partner-pick-grid">
      ${pick.map(p => `
        <div class="partner-big-card" onclick="G.pickPartner('${p.id}')">
          <div class="partner-portrait">${p.emoji}</div>
            <div class="partner-detail">
              <div style="font-weight:bold;font-size:14px;color:#ffd700">${p.name}</div>
              <div style="font-size:11px;color:#8ab4f8">${p.style}</div>
              <div style="font-size:10px;color:#a0b8d0">${p.desc}</div>
              <div class="partner-skill">🎯 ${p.skill}</div>
              <div class="partner-upgrades">升级1：${p.upgrade1}<br>升级2：${p.upgrade2}</div>
            </div>
        </div>
      `).join('')}
    </div>`;
  bot.innerHTML = '';
};

G.pickPartner = function(pid, speedBonus) {
  let s = G.state;
  if(s._partnerNodeResolved) return;
  let names = Object.fromEntries(G._PARTNER_POOL.map(p=>[p.id,p.name]));
  let cap = G.partnerCap();
  if(s.partners.length >= cap) { G.showToast(`👥 搭档已达上限（${cap}人）`); return; }
  if(s.partners.some(p => p.id === pid)) { G.showToast('👥 已经是你的搭档了'); return; }
  s._partnerNodeResolved = true;
  s.partners.push({id:pid, name:names[pid]||pid, level:1});
  G.showToast(`👥 搭档: ${names[pid]||pid}！`);
  // 每个搭档节点最多执行一次操作，即使仍有空位也必须等下一个搭档节点。
  G.setScreen('map');
};
G.showPartnerUpgrade = function() {
  let ps=(G.state.partners||[]).filter(p=>(p.level||1)<3);
  if(!ps.length) { G.showToast('暂无可以升级的搭档'); return; }
  G.showChoiceModal('⬆️ 选择要升级的搭档', ps.map((p,i)=>{
    let info=G.partnerSkillInfo(p);
    return {text:`${p.name} Lv.${info.level} → Lv.${info.level+1}`,sub:`当前：${info.desc}`,cb:()=>{
      if(G.state._partnerNodeResolved) return;
      G.state._partnerNodeResolved=true;
      p.level=Math.min(3,info.level+1);
      G.showToast(`⬆️ ${p.name}提升至Lv.${p.level}`);
      G.setScreen('map');
    }};
  }),{cancelable:true});
};

// --- TALENT ---
// G.TALENTS 数据已迁至 js/data.js（2026-08-23，配合游戏编辑器统一管理数据）
// 天赋查看器（局外/局内通用）
G.showTalentView = function() {
  let s = G.state;
  let html = `<h3 style="text-align:center;color:#ffd700;margin-bottom:10px">✨ 天赋一览</h3>`;
  // 已获得天赋
  let got = (s.talents||[]).map(id => G.TALENTS[id]).filter(Boolean);
  html += `<div style="font-size:12px;color:#8ab4f8;margin-bottom:6px">🎁 已获得天赋 (${got.length})</div>`;
  if(got.length === 0) html += `<div style="font-size:10px;color:#6a8aaa;margin-bottom:10px">暂无</div>`;
  got.forEach(t => {
    html += `<div style="background:#1a2a3a;padding:6px 8px;border-radius:6px;margin-bottom:4px;font-size:11px">
      <span style="color:#ffd700">${t.emoji} ${t.name}</span> <span class="tier tier-${t.tier}">${t.quality}</span>
      <div style="color:#a0b8d0">${t.desc}</div></div>`;
  });
  // 星级效果（高星含低星）
  if(s.character && s.star) {
    let ch = s.character;
    html += `<div style="font-size:12px;color:#8ab4f8;margin:10px 0 6px">⭐ 星级效果 (${s.star}★)</div>`;
    for(let lv=2; lv<=s.star; lv++) {
      if(ch.stars[lv] && ch.stars[lv].desc) {
        html += `<div style="background:#1a2a3a;padding:6px 8px;border-radius:6px;margin-bottom:4px;font-size:11px">
          <span style="color:#e0a040">${lv}★</span> <span style="color:#a0b8d0">${ch.stars[lv].desc}</span></div>`;
      }
    }
  }
  html += `<button class="btn" style="width:100%;margin-top:10px" onclick="G.closeModal()">关闭</button>`;
  G.showModal(html);
};

G.renderTalent = function(main,bot) {
  // 2026-08-21：不再直接渲染选天赋小页，改为先全屏剧情对话，对话后再弹全屏选天赋页
  main.innerHTML = '';
  bot.innerHTML = '';
  setTimeout(() => G.openTalentEventBox(), 60);
};

// 天赋基础品质权重由当前学期决定；每10点智力使紫色、金色权重提高5%。
G.weightedTalentPick = function(talents, count) {
  let chapter=Math.max(1,Math.min(6,G.state.chapter||1));
  let qw=G.SEMESTER_QUALITY_WEIGHTS[chapter-1];
  let semesterWeights={common:qw.green,uncommon:qw.blue,epic:qw.purple,rare:qw.gold};
  let fate=(G.state.talents||[]).includes('fate');
  let iqBoost=1+Math.floor((G.state.intelligence||0)/10)*.05;
  let pool = talents.map(t => {let base=Object.prototype.hasOwnProperty.call(semesterWeights,t.tier)?semesterWeights[t.tier]:0;let w=fate&&t.tier==='epic'?(semesterWeights.epic+semesterWeights.common+semesterWeights.uncommon):base;if(t.tier==='epic'||t.tier==='rare')w*=iqBoost;return {t,w};}).filter(x=>x.w>0);
  let picks = [];
  for(let k=0;k<count && pool.length;k++) {
    let total = pool.reduce((a,x)=>a+x.w,0);
    let r = Math.random() * total, acc = 0, chosen = pool[0];
    for(let i=0;i<pool.length;i++) { acc += pool[i].w; if(r < acc) { chosen = pool[i]; break; } }
    picks.push(chosen.t);
    pool = pool.filter(x => x !== chosen);
  }
  return picks;
};

// 天赋大屏事件框（2026-08-21）：专属角色事件框，流式输出文字 + 剧情选项
G.openTalentEventBox = function() {
  let s = G.state;
  if(!s.character) return;
  let id = s.character.id;
  let avMap = {xueshilei:'薛诗蕾Q版.jpg',xiaoqingya:'肖清雅Q版.jpg',chengliang:'程良Q版.jpg',tanzijun:'谭梓君Q版.jpg',xiaomeng:'小萌Q版.png_副本.png',xiaomeng_fiora:'Q版剑姬哓萌.png',menghuaian:'孟头像.png'};
  let avSrc = '立绘/' + (avMap[id] || (s.character.name + '.png'));
  // 全屏剧情对话（2026-08-21）
  G._openFullscreen(`
    <div class="te-holes"><i></i><i></i><i></i></div>
    <div class="te-top">🎬 天赋事件</div>
    <div class="te-name">${s.character.name} · 有话要说</div>
    <div class="te-narr" id="te-narr"></div>
    <div id="te-opts"></div>
    <img class="te-ava" src="${avSrc}" alt="">
  `);
  // 2026-09-09：天赋剧情UI格式统一为小蕾事件格式，背景框使用当前角色的事件框
  let frame=document.querySelector('.te-fullscreen:last-of-type');
  if(frame) { frame.classList.add('xiaolei-special-frame'); frame.style.setProperty('--event-frame-bg','url("'+G.eventFrameFor()+'")'); }
  G.runTalentStory();
};

// 全屏选天赋页（2026-08-21）：剧情对话结束后弹出，天赋三选一
G.openTalentPickPage = function() {
  let s = G.state;
  s.talents=[...new Set(s.talents||[])];
  let owned=new Set(s.talents);
  let talents = Object.values(G.TALENTS);
  // 挚友天赋池化：本角色开局拥有的挚友天赋不再出现在三选里；其他角色的挚友天赋可刷到
  // 红色天赋是特殊解锁奖励，永远不进入任何普通天赋池。
  talents = talents.filter(t => t.tier!=='red' && !t.exclusive && !t.eventOnly && !owned.has(t.id) && !(s.character&&s.character.id==='xiaomeng'&&t.id==='girl_glory'));
  if(s.character&&s.character.physiqueLocked) talents=talents.filter(t=>!['running','healthy_body','keep_fit','protein_overdose'].includes(t.id));
  if((s.talents||[]).includes('fate')) talents=talents.filter(t=>t.tier==='epic'||t.tier==='rare');
  // 智力影响品质权重：加权三选一
  let pick = G.weightedTalentPick(talents, 3);
  if(!pick.length) {
    G._openFullscreen(`<div class="te-holes"><i></i><i></i><i></i></div><div class="te-top">✨ 选择天赋</div><div class="te-name">天赋已经全部获得</div><div class="te-narr">当前普通天赋池中已经没有尚未获得的天赋，本次不会重复授予。</div><div id="te-opts"><button class="te-opt" onclick="G._closeFullscreen();G.setScreen('map')">继续</button></div>`);
    let f0=document.querySelector('.te-fullscreen:last-of-type');if(f0){f0.classList.add('xiaolei-special-frame');f0.style.setProperty('--event-frame-bg','url("'+G.eventFrameFor()+'")');}
    return;
  }
  G._openFullscreen(`
    <div class="te-holes"><i></i><i></i><i></i></div>
    <div class="te-top">✨ 选择天赋</div>
    <div class="te-name">${s.character ? s.character.name + ' · 想选一个方向' : '想选一个方向'}</div>
    <div class="te-pick" style="--option-count:${pick.length}">
      ${pick.map(t => `
        <div class="card" onclick="G.pickTalent('${t.id}')">
          <div style="display:flex;align-items:center;gap:14px">
            <span style="font-size:30px">${t.emoji}</span>
            <div style="flex:1">
              <div style="font-weight:bold;font-size:16px;color:#ffd700">${t.name}</div>
              <span class="tier tier-${t.tier}">${t.quality}</span>
              <div style="font-size:13px;color:#765f3d;margin-top:5px">${G.decorateKeywords(t.desc)}</div>
            </div>
          </div>
        </div>`).join('')}
    </div>`);
  // 2026-09-09：天赋三选一UI格式统一为小蕾事件格式，背景框使用当前角色的事件框
  let frame=document.querySelector('.te-fullscreen:last-of-type');
  if(frame) { frame.classList.add('xiaolei-special-frame','xiaolei-talent-pick'); frame.style.setProperty('--event-frame-bg','url("'+G.eventFrameFor()+'")'); }
};

// ==== 天赋节点剧情（三段流式输出 + 结尾选项；选项不影响天赋选择，只影响后续剧情）====
G._tsTimer = null;
G.TALENT_STORY = {
  talent0:{
    segs:[
      '新学期的铃声响起，我抱着一摞习题册走进教室。\n"同学们好，从今天起，我就是你们的老师了。"',
      '讲台下，一双双眼睛好奇地打量这位新来的年轻老师。我清了清嗓子："先聊聊我的教学理念——学习要讲策略，也要讲究乐趣。"',
      '"除了刷题，我也得摸清每个同学的性格。毕竟，一张好牌想打好，总要先知道它有什么本事。"'
    ],
    opts:[
      {value:'rigorous', label:'先立规矩，把班风带正', reply:'班会的气氛立刻变得严肃而有章法。'},
      {value:'hearty', label:'先活跃气氛，和同学们打成一片', reply:'教室里响起一阵轻松的笑声。'}
    ]
  },
  talent1:function(){
    var c = G.state.talentStoryChoice;
    var segs = (c === 'hearty')
      ? ['轻松的相处让班级变得亲近又鲜活。','同学们敢说、敢问，也敢一次次从头再来。','你看着他们，心想：兴趣，或许就是最好的天赋。']
      : ['经过这段时间，你对每个同学的脾性都了然于心。','你把这份了解，化作了课堂上恰到好处的那临门一脚。','"每个人都有自己的路子，"你合上教案，"而这，也正是天赋的起点。"'];
    return {segs:segs, opts:[
      {value:c||'rigorous', label:'继续保持现在这份默契', reply:'这份默契，会成为一路上的助力。'},
      {value:c||'rigorous', label:'再观察观察大家的成长', reply:'成长的路还很长，你愿意一直陪着他们走。'}
    ]};
  },
  // 月考胜利后的天赋事件（2026-08-21）：通关后必得天赋三选
  monthly:{
    segs:[
      '"月考结束了！"铃声响起的瞬间，班里响起一片欢呼。',
      '我站在讲台上，看着大家疲惫又兴奋的脸，心里也跟着松了一口气："这一仗，打得很漂亮。"',
      '趁着这股劲头，我想再给班级注入一点新的力量——是时候选个新方向了。'
    ],
    opts:[
      {value:'victory', label:'表扬大家，顺便带点新方法', reply:'笑声里，班级的士气更高了。'},
      {value:'calm', label:'让大家先放松，慢慢再商量', reply:'教室里安静下来，却涌动着期待。'}
    ]
  }
};
G.runTalentStory = function() {
  let s = G.state;
  if(G._tsTimer){ clearTimeout(G._tsTimer); G._tsTimer = null; }
  let nodeId = s.currentNodeId || 'talent0';
  let story = G.TALENT_STORY[nodeId];
  let data = typeof story === 'function' ? story() : story;
  let narr = document.getElementById('te-narr');
  let optsEl = document.getElementById('te-opts');
  if(!data || !narr) return;
  optsEl.innerHTML = '';
  narr.textContent = '';
  let segs = data.segs, vi = 0, ci = 0, show = '';
  let done = false;
  let xiaoleiFrame = !!narr.closest('.xiaolei-special-frame');
  let xiaoleiBoxes = null;
  if(xiaoleiFrame) {
    narr.innerHTML = '<div class="xiaolei-segment-grid"><div class="xiaolei-segment"></div><div class="xiaolei-segment"></div><div class="xiaolei-segment"></div></div>';
    xiaoleiBoxes = [...narr.querySelectorAll('.xiaolei-segment')];
  }
  function step(){
    if(vi >= segs.length){ finish(); return; }
    let full = segs[vi];
    if(xiaoleiFrame) {
      let box=xiaoleiBoxes[Math.min(vi,2)];box.classList.add('visible');box.textContent=full.slice(0,ci+1);
    } else {
      show += full.charAt(ci);
      narr.textContent = show;
    }
    ci++;
    if(ci >= full.length){ vi++; ci = 0; show += '\n\n'; G._tsTimer = setTimeout(step, 520); }
    else { G._tsTimer = setTimeout(step, 26); }
  }
  function finish(){
    if(done) return;
    done = true;
    if(G._tsTimer){ clearTimeout(G._tsTimer); G._tsTimer = null; }
    if(xiaoleiFrame) segs.slice(0,3).forEach((text,i)=>{xiaoleiBoxes[i].textContent=text;xiaoleiBoxes[i].classList.add('visible');});
    else narr.textContent = segs.join('\n\n');
    optsEl.innerHTML = data.opts.map((o,i) => '<button class="te-opt" onclick="G.pickTalentStory('+i+')">'+o.label+'</button>').join('');
    let optionCols=data.opts.length===4?2:Math.min(Math.max(data.opts.length,1),3);
    optsEl.style.gridTemplateColumns='repeat('+optionCols+',minmax(0,1fr))';
  }
  G.completeTalentStoryImmediately = finish;
  narr.onclick = function() {
    if(G.settings && G.settings.fastEventRead) finish();
  };
  narr.title = (G.settings && G.settings.fastEventRead) ? '点击显示全部对话' : '';
  step();
};
G.pickTalentStory = function(i) {
  let s = G.state;
  let nodeId = s.currentNodeId || 'talent0';
  let story = G.TALENT_STORY[nodeId];
  let data = typeof story === 'function' ? story() : story;
  let o = data.opts[i];
  s.talentStoryChoice = o.value;
  G.showToast('🎬 ' + o.reply);
  let bts = document.querySelectorAll('#te-opts .te-opt');
  for(let k=0;k<bts.length;k++) bts[k].disabled = true;
  // 关掉全屏剧情对话，进入全屏选天赋页（2026-08-21）
  G._closeFullscreen();
  G.openTalentPickPage();
};

G.pickTalent = function(tid) {
  let s = G.state;
  s.talents=s.talents||[];
  if(s.talents.includes(tid)) {
    G.showToast('该天赋已经拥有，无法重复获得');
    G._closeFullscreen();
    setTimeout(() => G.setScreen('map'), 400);
    return;
  }
  s.talents.push(tid);
  if(G.sfx) G.sfx.play('talent'); // 获得天赋音效（2026-08-23）
  let name = (G.TALENTS[tid]&&G.TALENTS[tid].name)||tid;
  switch(tid) {
    case 'running': if(!(s.character && s.character.physiqueLocked)) { s.physique += 1; s.maxHp = s.physique * 5; s.hp = Math.min(s.hp+5, s.maxHp); } name='跑步'; break;
    case 'healthy_body': if(!(s.character && s.character.physiqueLocked)) { s.physique += 2; s.maxHp = s.physique * 5; s.hp = Math.min(s.hp+10, s.maxHp); } name='强健体魄'; break;
    case 'emotional_intelligence': G.gainEq(2); name='高情商'; break;
    case 'endurance': s.maxEnergy += 1; name='耐力训练'; break;
    case 'energy_surge': s.maxEnergy += 4; name='体力充沛'; break;
    case 'windfall': G.gainGold(500); break;
    case 'keep_fit': name='坚持健身'; break;
    case 'protein_overdose': if(!(s.character&&s.character.physiqueLocked)){let n=Math.max(4,Math.ceil(s.physique*.4));s.physique+=n;s.maxHp=s.physique*5;s.hp=Math.min(s.maxHp,s.hp+n*5);} break;
    case 'kidney_overdraft': break;
    case 'take_notes': name='做笔记'; break;
    case 'warmup': name='热身'; break;
    case 'sit_straight': name='坐正'; break;
    case 'nap': name='午休'; break;
    case 'little_trick': name='一点小巧思'; break;
    case 'borrow_pen': name='借笔'; break;
    case 'sleep': name='睡觉'; break;
    case 'quick_learner': name='举一反三'; break;
    case 'focused_mind': name='专注力'; break;
    case 'preparation': name='有备无患'; break;
    case 'second_wind': name='二次呼吸'; break;
    case 'rationality_mastery': name='理性精通'; break;
    case 'double_draw': name='双倍收获'; break;
    case 'sheineng': name='谁能有我卷？'; break;
    case 'chiqing': name='痴情'; break;
    case 'liangge': name='坚韧'; break;
    case 'wusuoweiju': name='无所畏惧'; break;
    case 'kuaisu_xuanzhuan': name='快速旋转'; break;
    case 'dameng_shuixianjue': name='大梦谁先觉'; break;
  }
  G.showToast(`✨ 获得天赋: ${name}`);
  G._closeFullscreen(); // 关掉全屏选天赋页（2026-08-21）
  setTimeout(() => G.setScreen('map'), 800);
};

// --- EVENT ---
// 情商获取（肖清雅重做 2026-08-24：交际花改为搭档相关被动，不再加成情商获取）
G.gainEq = function(n) {
  let s = G.state;
  s.eq += n;
};

G.grantTalentReward = function(tier) {
  // 通用随机奖励不得授予红色天赋；红色只能由专属条件直接写入。
  if(tier==='red') return null;
  let s=G.state,pool=Object.values(G.TALENTS).filter(t=>t.tier===tier&&!t.exclusive&&!t.eventOnly&&!(s.talents||[]).includes(t.id)&&!(s.character&&s.character.id==='xiaomeng'&&t.id==='girl_glory'));
  if(!pool.length) return null;
  let t=G.pick(pool);if(!t)return null;
  s.talents=s.talents||[];if(!s.talents.includes(t.id))s.talents.push(t.id);
  if(t.id==='running'&&!(s.character&&s.character.physiqueLocked)){s.physique++;s.maxHp=s.physique*5;s.hp=Math.min(s.maxHp,s.hp+5);}
  else if(t.id==='healthy_body'&&!(s.character&&s.character.physiqueLocked)){s.physique+=2;s.maxHp=s.physique*5;s.hp=Math.min(s.maxHp,s.hp+10);}
  else if(t.id==='emotional_intelligence')G.gainEq(2);
  else if(t.id==='endurance')s.maxEnergy++;
  else if(t.id==='energy_surge')s.maxEnergy+=4;
  else if(t.id==='windfall')G.gainGold(500);
  else if(t.id==='keep_fit'){}
  else if(t.id==='protein_overdose'&&!(s.character&&s.character.physiqueLocked)){let n=Math.max(4,Math.ceil(s.physique*.4));s.physique+=n;s.maxHp=s.physique*5;s.hp=Math.min(s.maxHp,s.hp+n*5);}
  return t;
};
G.upgradeDeckToPurple = function() {
  let order=['white','green','blue','purple'];
  G.state.deck=G.state.deck.map(ref=>{
    let base=G.baseId(ref),d=G.CARDS[base];if(!d)return ref;
    let at=String(ref).indexOf('@'),q=at>=0?String(ref).slice(at+1):(d.q||G.cardQuality(d).key||'white');
    if(q==='gold'||q==='red'||q==='purple')return ref;
    let next=(q==='blue')?'purple':'blue';return base+'@'+next;
  });
};
G.resolvePostExamSystems = function(b,node) {
  let s=G.state;
  if(s.earlyExamTask&&s.earlyExamTask.active&&!s.earlyExamTask.completed&&node&&(node.type==='monthly_exam'||node.type==='final_exam')&&(b.turn||1)<=1){
    s.earlyExamTask.active=false;s.earlyExamTask.completed=true;
    let talent=G.grantTalentReward('rare');G.upgradeDeckToPurple();
    G.showToast(`🏃 提前交卷完成！获得金色天赋【${talent?talent.name:'无'}】，卡组品质全部提升`);
  }
  if(s.lotteryTickets&&s.lotteryTickets.length){
    let pending=[],results=[],draw=G.shuffle([1,2,3,4,5,6,7,8,9]).slice(0,6);
    for(let ticket of s.lotteryTickets){ticket.examsLeft=Math.max(0,(ticket.examsLeft||3)-1);if(ticket.examsLeft>0){pending.push(ticket);continue;}
      let hit=0;while(hit<6&&ticket.number[hit]===draw[hit])hit++;
      // 2026-09-09 奖励调整：命中1位50；2位100+绿；3位500+蓝；4位10000+紫；5位100000+金；6位头奖999999+红色【命运】
      let money=[0,50,100,500,10000,100000,999999][hit],tier=[null,null,'common','uncommon','epic','rare',null][hit],parts=[`🎟️ ${ticket.number.join('')} 开奖 ${draw.join('')}，命中${hit}位`];
      if(money){let got=G.gainGold(money);parts.push(`+${got}零花钱`);}if(tier){let t=G.grantTalentReward(tier);if(t)parts.push(`获得【${t.name}】`);else parts.push('该品质天赋已全部拥有');}if(hit===6){if(!s.talents.includes('fate')){s.talents.push('fate');parts.push('获得红色天赋【命运】');}else parts.push('红色天赋【命运】已经拥有');}
      results.push({number:ticket.number,hit,rewards:parts.slice(1).join('，')||'未中奖，无奖励'});
    }
    s.lotteryTickets=pending;
    if(results.length){s.lastLotteryResult={draw,results:results.sort((a,b)=>b.hit-a.hit)};setTimeout(()=>G.showLotteryResults(),300);}
  }
};
G.eventVisibleCost = function(option) {
  let text=String((option&&option.text)||''),desc=String((option&&option.effDesc)||''),all=text+' '+desc;
  let found=all.match(/(?:花费|失去|支付|消耗|需要(?:消耗)?)\s*(\d+)\s*(零花钱|金币|体力|生命|热情|梦屑|法力)?/);
  if(!found)return '选择后揭晓效果';
  let resource=found[2]||((/零花钱|金币/.test(all))?'零花钱':(/体力/.test(all)?'体力':(/生命/.test(all)?'生命':'')));
  if(resource==='金币')resource='零花钱';
  return `消耗${found[1]}${resource}`;
};

G.renderEvent = function(main,bot) {
  let s = G.state;
  // 开局已固定分配，直接取本节点事件
  let ev = G.EVENTS[s.nodeEvents[s.currentNodeId]];
  if(!ev) { G._currentEvent=null; G.setScreen('map'); return; }
  G._currentEvent = ev;
  main.innerHTML='';bot.innerHTML='';
  if(!document.getElementById('commonEventFrame')) setTimeout(()=>{G.openCommonEventFrame(ev);if(s._eventResumeResult)G.showCommonEventResult(s._eventResumeResult.text,s._eventResumeResult.buttons,s._eventResumeResult.reward);},30);
};

// 2026-09-09：天赋/事件UI格式统一为小蕾事件格式，但背景框使用当前角色各自的事件框
G.EVENT_FRAME_MAP = {
  xueshilei:'UI/小蕾事件框.png',
  xiaomeng:'UI/小萌事件框-透明版.png',
  xiaomeng_fiora:'UI/剑姬哓萌事件框.png'
};
G.eventFrameFor = function() {
  let id = G.state.character && G.state.character.id;
  return (id && G.EVENT_FRAME_MAP[id]) || 'UI/通用事件框.png';
};

G.openCommonEventFrame = function(ev) {
  if(!ev||document.getElementById('commonEventFrame'))return;
  let bg=ev.image||G.eventFrameFor(),raw=Array.isArray(ev.dialogue)&&ev.dialogue.length?ev.dialogue:String(ev.desc||'').split(/\n\s*\n/);
  let segs=raw.map(x=>typeof x==='object'?((x.speaker?x.speaker+'\n':'')+(x.text||'')):String(x||'')).filter(Boolean).slice(0,3);
  let layer=document.createElement('div');layer.id='commonEventFrame';layer.className='te-fullscreen common-event-frame';layer.style.setProperty('--event-frame-bg',`url("${String(bg).replace(/"/g,'\\"')}")`);
  layer.innerHTML=`<div class="te-name">${ev.name||'事件'}</div><div class="te-narr"><div class="xiaolei-segment-grid"><div class="xiaolei-segment"></div><div class="xiaolei-segment"></div><div class="xiaolei-segment"></div></div></div><div id="te-opts"></div>`;
  document.body.appendChild(layer);
  if(ev.id==='lottery')G.updateLotteryHud();
  let boxes=[...layer.querySelectorAll('.xiaolei-segment')],opts=layer.querySelector('#te-opts'),si=0,ci=0,timer=null,done=false;
  function finish(){if(timer)clearTimeout(timer);segs.forEach((text,i)=>{boxes[i].textContent=text;boxes[i].classList.toggle('visible',!!text);});done=true;let visible=(ev.opts||[]).map((o,i)=>({o,i})).filter(x=>!(G.state.character&&G.state.character.physiqueLocked&&x.o.eff==='physique1'));opts.innerHTML=visible.map(x=>`<button class="te-opt" title="${String(x.o.effDesc||'').replace(/"/g,'&quot;')}" onclick="G.doEvent(${x.i})"><b>${x.o.text}</b>${x.o.effDesc?`<small class="event-effect-preview">${G.decorateKeywords?G.decorateKeywords(x.o.effDesc):x.o.effDesc}</small>`:''}</button>`).join('');}
  function type(){if(si>=segs.length){finish();return;}let full=segs[si];if(ci===0)boxes[si].classList.add('visible');boxes[si].textContent=full.slice(0,ci++);if(ci<=full.length)timer=setTimeout(type,24);else{si++;ci=0;timer=setTimeout(type,420);}}
  layer.querySelector('.te-narr').onclick=()=>{if(!done)finish();};
  if(segs.length)type();else finish();
};
G.showCommonEventResult = function(text, finalButtons, rewardText) {
  // 2026-09-09：奖励说明独立展示为 🎁 奖励条（剧情文本不混入数值，但玩家必须看到获得了什么）
  G.state._eventResumeResult={text,buttons:finalButtons||'',reward:rewardText||''};
  let layer=document.getElementById('commonEventFrame');if(!layer){G.showToast((Array.isArray(text)?text.join(' '):text)+(rewardText?'｜🎁 '+rewardText:''));setTimeout(()=>G.setScreen('map'),800);return;}
  let narr=layer.querySelector('.te-narr'),boxes=[...layer.querySelectorAll('.xiaolei-segment')],opts=layer.querySelector('#te-opts');
  let rewardEl=narr.querySelector('.te-reward');
  if(rewardEl){rewardEl.remove();rewardEl=null;}
  if(rewardText){rewardEl=document.createElement('div');rewardEl.className='te-reward';rewardEl.textContent='🎁 '+rewardText;narr.appendChild(rewardEl);}
  let segs=(Array.isArray(text)?text:String(text||'事件结束').split(/\n\s*\n/)).filter(Boolean).slice(0,3),si=0,ci=0,timer=null,done=false;
  boxes.forEach(b=>{b.textContent='';b.classList.remove('visible');});opts.innerHTML='';
  function finish(){if(timer)clearTimeout(timer);segs.forEach((t,n)=>{boxes[n].textContent=t;boxes[n].classList.toggle('visible',!!t);});done=true;opts.innerHTML=finalButtons||'<button class="te-opt" onclick="G.closeCommonEventFrame()"><b>继续</b></button>';}
  function type(){if(si>=segs.length){finish();return;}let full=segs[si];if(ci===0)boxes[si].classList.add('visible');boxes[si].textContent=full.slice(0,ci++);if(ci<=full.length)timer=setTimeout(type,24);else{si++;ci=0;timer=setTimeout(type,420);}}
  layer.querySelector('.te-narr').onclick=()=>{if(!done)finish();};type();
};
G.closeCommonEventFrame = function(){
  delete G.state._eventResumeResult;
  let e=document.getElementById('commonEventFrame');if(e)e.remove();G._currentEvent=null;
  if(G._eventTestMode){
    G.state.screen='menu';G.render();
    G.showModal(`<h3 style="text-align:center;color:#765f3d">事件测试完成</h3><p style="text-align:center;line-height:1.8">本次选择产生的数值变化只存在于测试窗口，不会写入正式存档。</p><div style="display:flex;gap:10px"><button class="btn primary" style="flex:1" onclick="location.reload()">重新测试</button><button class="btn" style="flex:1" onclick="window.close()">返回编辑器</button></div>`,'paper');
    return;
  }
  G.setScreen('map');
};

G.LOTTERY_TICKET_PRICE=30;
G.updateLotteryHud=function(){
  let layer=document.getElementById('commonEventFrame');if(!layer)return;
  let hud=document.getElementById('lotteryHud');if(!hud){hud=document.createElement('div');hud.id='lotteryHud';hud.style.cssText='position:absolute;right:20px;top:16px;z-index:10;display:flex;gap:8px;align-items:center;background:#fff5dc;padding:8px;border-radius:8px;color:#604822';layer.appendChild(hud);}
  let nums=(G.state.lotteryTickets||[]).map(t=>t.number.join('')).join('、');
  hud.innerHTML=`<b>零花钱：${G.state.gold}</b>${nums?`<div style="margin-top:4px;max-width:260px;line-height:1.5">已购：${nums}</div>`:''}${nums?'<button class="btn" onclick="G.showLotteryTickets()">查看开奖进度</button>':''}`;
};
G.showLotteryTickets=function(){G.showModal(`<h3>已购号码</h3>${(G.state.lotteryTickets||[]).map(t=>`<p style="color:#604822">${t.number.join('')}　剩余${t.examsLeft}场考试</p>`).join('')||'<p>暂无待开奖彩票</p>'}<button class="btn" onclick="G.closeModal()">关闭</button>`,'paper');};
G.showLotteryResults=function(){let r=G.state.lastLotteryResult;if(!r)return;G.showModal(`<h3 style="text-align:center">大乐透开奖</h3><p style="text-align:center;color:#946400;font-size:24px">本次大奖号码：${r.draw.join('')}</p><div style="max-height:55vh;overflow:auto">${r.results.map(t=>`<div style="padding:10px;border-bottom:1px solid #c9ad75;color:#604822"><b style="font-size:22px;letter-spacing:4px">${t.number.map((n,i)=>i<t.hit?`<mark style="background:#ffe080;color:#a33b00">${n}</mark>`:n).join('')}</b>　命中${t.hit}位<p>${t.rewards}</p></div>`).join('')}</div><button class="btn" onclick="G.closeModal()">继续</button>`,'paper');};
G.LOTTERY_TICKET_LIMIT=10;
G.randomLotteryDigits=function(){return G.shuffle([1,2,3,4,5,6,7,8,9]).slice(0,6);};
G.lotteryAfterText=function(){let o=(G.EVENTS.lottery.opts||[])[0],all=Array.isArray(o.afterTexts)&&o.afterTexts.length?o.afterTexts:[o.afterText];return G.pick(all.filter(Boolean));};
G.renderLotteryEvent = function(main,bot) {
  let tickets=G.state.lotteryTickets||[];
  main.innerHTML=`<h3 style="text-align:center;color:#ffd45c;margin-bottom:8px">🎟️ 大乐透</h3>
    <p style="text-align:center;color:#a0b8d0;font-size:13px;line-height:1.7">要来试试吗？万一中了呢？<br>每张30零花钱，六位号码互不重复，最多购买10张。</p>
    <div class="paper-box" style="margin:14px 0"><b>持有彩票：${tickets.length}/${G.LOTTERY_TICKET_LIMIT}张</b>${tickets.length?tickets.map(t=>`<div style="margin-top:6px">🎫 ${t.number.join('')}　剩余${t.examsLeft}场考试开奖</div>`).join(''):'<div style="margin-top:6px;color:#6a8aaa">暂无彩票</div>'}</div>
    <div style="display:flex;flex-direction:column;gap:10px"><div class="card" style="max-width:100%;cursor:pointer" onclick="G.openLotteryNumberPicker()"><b>选号码</b><div style="font-size:10px;color:#6a8aaa">花费30零花钱，可重复购买</div></div><div class="card" style="max-width:100%;cursor:pointer" onclick="G.buyTenRandomLotteryTickets()"><b>随机购买十组号码</b><div style="font-size:10px;color:#6a8aaa">花费300零花钱，需剩余10个购买名额</div></div><div class="card" style="max-width:100%;cursor:pointer" onclick="G.leaveLotteryEvent()"><b>离开</b></div></div>`;
  bot.innerHTML='';
};
G.openLotteryNumberPicker = function() {
  let tickets=G.state.lotteryTickets||[];
  if(tickets.length>=G.LOTTERY_TICKET_LIMIT){G.showToast('彩票最多只能购买10张');return;}
  if(G.state.gold<G.LOTTERY_TICKET_PRICE){G.showToast(`零花钱不足${G.LOTTERY_TICKET_PRICE}`);return;}
  let picked=[];
  function paint(){
    let nums=[1,2,3,4,5,6,7,8,9];
    G.closeModal();G.showModal(`<h3 style="text-align:center;color:#765f3d">🎟️ 选择六位号码</h3><button class="choice-close" onclick="G.cancelLotteryPicker()" aria-label="取消">×</button><aside class="lottery-tip">提醒：一串号码中的六个数字必须各不相同；已选数字本次不能重复选择。</aside><div style="text-align:center;font-size:26px;letter-spacing:8px;margin:12px">${picked.length?picked.join(''):'------'}</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">${nums.map(n=>`<button class="btn" ${picked.includes(n)?'disabled style="opacity:.32;filter:grayscale(1);cursor:not-allowed"':''} onclick="G.pickLotteryDigit(${n})">${n}</button>`).join('')}</div><div style="display:flex;gap:8px;margin-top:12px"><button class="btn" style="flex:1" onclick="G.randomLotteryDigitsIntoPicker()">随机号码</button><button class="btn" style="flex:1" onclick="G.undoLotteryDigit()">退一位</button></div><button class="btn primary" style="width:100%;margin-top:8px" ${picked.length===6?'':'disabled'} onclick="G.confirmLotteryTicket()">购买（${G.LOTTERY_TICKET_PRICE}）</button>`,'paper');
  }
  G._lotteryPicker={picked,paint};paint();
};
G.pickLotteryDigit=function(n){let p=G._lotteryPicker;if(!p||p.picked.length>=6||p.picked.includes(n))return;p.picked.push(n);p.paint();};
G.randomLotteryDigitsIntoPicker=function(){let p=G._lotteryPicker;if(!p)return;p.picked.splice(0,p.picked.length,...G.randomLotteryDigits());p.paint();};
G.undoLotteryDigit=function(){let p=G._lotteryPicker;if(!p)return;p.picked.pop();p.paint();};
G.cancelLotteryPicker=function(){G._lotteryPicker=null;G.closeModal();};
G.confirmLotteryTicket=function(){let p=G._lotteryPicker,s=G.state;if(!p||p.picked.length!==6)return;s.lotteryTickets=s.lotteryTickets||[];if(s.lotteryTickets.length>=G.LOTTERY_TICKET_LIMIT){G.showToast('彩票最多只能购买10张');return;}if(s.gold<G.LOTTERY_TICKET_PRICE){G.showToast(`零花钱不足${G.LOTTERY_TICKET_PRICE}`);return;}if(new Set(p.picked).size!==6){G.showModal(`<div class="lottery-error" tabindex="0" onclick="G._lotteryPicker.paint()"><b>号码必须为不同数字</b><small>点击任意位置或按任意键返回选数字界面</small></div>`,'paper');setTimeout(()=>{let fn=()=>{document.removeEventListener('keydown',fn);if(G._lotteryPicker)G._lotteryPicker.paint();};document.addEventListener('keydown',fn);},0);return;}s.gold-=G.LOTTERY_TICKET_PRICE;s.lotteryTickets.push({number:[...p.picked],examsLeft:3});G._lotteryPicker=null;G.closeModal();G.showCommonEventResult([G.lotteryAfterText()],'<button class="te-opt" onclick="G.openLotteryNumberPicker()"><b>继续选号</b></button><button class="te-opt" onclick="G.closeCommonEventFrame()"><b>离开</b></button>');};
G.buyTenRandomLotteryTickets=function(){let s=G.state;s.lotteryTickets=s.lotteryTickets||[];if(s.lotteryTickets.length+10>G.LOTTERY_TICKET_LIMIT){G.showToast(`随机十连需要剩余10个名额；当前还可购买${G.LOTTERY_TICKET_LIMIT-s.lotteryTickets.length}张`);return;}let cost=G.LOTTERY_TICKET_PRICE*10;if(s.gold<cost){G.showToast(`零花钱不足${cost}`);return;}s.gold-=cost;for(let i=0;i<10;i++)s.lotteryTickets.push({number:G.randomLotteryDigits(),examsLeft:3});let o=(G.EVENTS.lottery.opts||[]).find(x=>x.eff==='lottery_buy_ten');G.showCommonEventResult([(o&&o.afterText)||'十张号码纸很快堆成了一小叠。'], '<button class="te-opt" onclick="G.closeCommonEventFrame()"><b>离开</b></button>');};
// 购买、退回选号及十连购买后同步显示实际余额。
for(let name of ['confirmLotteryTicket','buyTenRandomLotteryTickets','openLotteryNumberPicker']){
  let run=G[name];G[name]=function(...args){let result=run.apply(this,args);G.updateLotteryHud();return result;};
}
G.leaveLotteryEvent=function(){G.closeCommonEventFrame();};

G.doEvent = function(optIndex) {
  let s = G.state;
  let ev = G._currentEvent;
  if(!ev) { G.setScreen('map'); return; }
  let choice = ev.opts[optIndex];
  let effDesc = choice.effDesc || '';

  // Apply effect
  switch(choice.eff) {
    case 'gold10': {
      let gained=G.gainGold(10);
      effDesc=`获得${gained}零花钱`;
      break;
    }
    case 'randomLogic': {
      let logicCards = Object.values(G.CARDS).filter(c=>c.type==='logic'&&!G.isZhijiaoCard(c)&&!(s.character&&s.character.physiqueLocked&&G.isPhysiqueRelatedCard(c)));
      let c=G.pick(logicCards); s.deck.push(c.id); effDesc='获得卡牌「'+c.name+'」'; break;
    }
    case 'randomIdea': {
      let ideaCards = Object.values(G.CARDS).filter(c=>c.type==='idea'&&!G.isZhijiaoCard(c)&&!(s.character&&s.character.physiqueLocked&&G.isPhysiqueRelatedCard(c)));
      let c=G.pick(ideaCards); s.deck.push(c.id); effDesc='获得卡牌「'+c.name+'」'; break;
    }
    case 'meal_invite': { s.hp=s.maxHp; G.gainEq(1); effDesc='回复至生命上限，情商+1'; break; }
    case 'next_battle_shield30': s.nextBattleStartShield=(s.nextBattleStartShield||0)+30;effDesc='下场考试开场获得30点护盾';break;
    case 'unlock_paper_study': s.paperStudyUnlocked=true;s.paperStudyCount=s.paperStudyCount||0;effDesc='已解锁【纸条研究】，后续纸条事件会进入事件池';break;
    case 'remove_two_types': {
      let uniq=[...new Set(s.deck||[])];
      if(!uniq.length){effDesc='卡组没有可移除的卡牌';break;}
      G.showMultiSelect('选择最多两种要移除的卡牌',uniq,2,picked=>{let bases=new Set(picked.map(x=>G.baseId(x))),count=s.deck.filter(x=>bases.has(G.baseId(x))).length;s.deck=s.deck.filter(x=>!bases.has(G.baseId(x)));if(s.cardItems)bases.forEach(x=>delete s.cardItems[x]);G._currentEvent=null;G.showCommonEventResult(['你把两类卡牌从卡组里请了出去。'],'',`移除${count}张卡牌`);});return;
    }
    case 'rename_test_paper': {
      let uniq=[...new Set(s.deck||[])];
      G.showChoiceModal('选择要改名的卡牌',uniq.map(cid=>({text:G.getCardData(cid)?.name||cid,sub:'会转化为随机同类型角色卡牌',deferRender:true,cb:()=>{let old=G.getCardData(cid),pool=G.roleEventCardPool(old.type).filter(x=>G.baseId(x.id)!==G.baseId(cid));let next=G.pick(pool);if(next){let idx=s.deck.indexOf(cid);if(idx>=0)s.deck[idx]=next.id;G._currentEvent=null;G.showCommonEventResult([`你把试卷上的名字改成了「${next.name}」。`],'',`「${old.name}」→「${next.name}」`);}else{G._currentEvent=null;G.showCommonEventResult(['这类试卷暂时没有合适的新名字。']);}}})),{cancelable:true,onCancel:()=>{G._currentEvent=null;G.closeCommonEventFrame();}});return;
    }
    case 'talent_random_plus3': s.talentRandomCount=(s.talentRandomCount||0)+3;effDesc='天赋随机次数+3';break;
    case 'teacher_cotton_jacket': s.talents=s.talents||[];if(!s.talents.includes('teacher_cotton_jacket'))s.talents.push('teacher_cotton_jacket');effDesc='获得蓝色天赋「老师小棉袄」';break;
    case 'get_whistle': if(G.addRoleCard)G.addRoleCard('koushao');effDesc='获得用具卡「口哨」';break;
    case 'get_card_miaohui': if(G.addRoleCard)G.addRoleCard('miaohui');effDesc='获得逻辑卡「描绘」';break;
    case 'blank_talent': s.talents=s.talents||[];if(!s.talents.includes('blank'))s.talents.push('blank');effDesc='获得紫色天赋「空白」';break;
    case 'upgrade_partner_event': {
      let ps=(s.partners||[]).filter(p=>(p.level||1)<3);
      if(!ps.length){effDesc='没有可升级的搭档';break;}
      G.showChoiceModal('选择要升级的搭档',ps.map(p=>{let info=G.partnerSkillInfo(p);return{text:`${p.name} Lv.${info.level}→Lv.${info.level+1}`,sub:info.desc,deferRender:true,cb:()=>{p.level=Math.min(3,info.level+1);G._currentEvent=null;G.showCommonEventResult([`你帮${p.name}把技能又打磨了一遍。`],'',`${p.name}提升至Lv.${p.level}`);}}}),{cancelable:true,onCancel:()=>{G._currentEvent=null;G.closeCommonEventFrame();}});return;
    }
    case 'get_umbrella': if(G.addRoleCard)G.addRoleCard('yusan');effDesc='获得用具卡「雨伞」';break;
    case 'paper_study_reward': {
      s.paperStudyCount=(s.paperStudyCount||0)+1;s.talents=s.talents||[];
      let tid=`paper_blue_${Math.min(3,s.paperStudyCount)}`;if(G.TALENTS[tid]&&!s.talents.includes(tid))s.talents.push(tid);
      let msg=`获得蓝色天赋「${G.TALENTS[tid]?.name||tid}」`;
      if(s.paperStudyCount>=3&&!s.paperStudyPurple){s.paperStudyPurple=true;let t=G.grantTalentReward('epic');if(t)msg+=`，并额外获得紫色天赋「${t.name}」`;}
      effDesc=msg;break;
    }
    case 'randomRoleLogicWithItem': {
      let r=G.addRandomRoleCardWithItem('logic');
      effDesc=r?`获得角色逻辑卡「${r.card.name}」并附加道具「${r.item.name}」`:'当前没有符合条件的角色逻辑卡';
      break;
    }
    case 'randomRoleIdeaWithItem': {
      let r=G.addRandomRoleCardWithItem('idea');
      effDesc=r?`获得角色思路卡「${r.card.name}」并附加道具「${r.item.name}」`:'当前没有符合条件的角色思路卡';
      break;
    }
    case 'two_person_three_legs': {
      if(G.addRoleCard)G.addRoleCard('liangrensanzu');
      effDesc='获得思路卡「俩人三足」';
      break;
    }
    case 'reading10': {
      if(s.readingBook&&s.books&&s.books[s.readingBook]&&G.BOOKS[s.readingBook]){
        let book=G.BOOKS[s.readingBook],before=s.books[s.readingBook].progress||0;
        s.books[s.readingBook].progress=Math.min(book.need,before+10);
        effDesc=`《${book.name}》阅读进度+${s.books[s.readingBook].progress-before}`;
      }else effDesc='当前没有正在阅读的书籍';
      break;
    }
    case 'qinlao_reward':
      s.talents=s.talents||[]; if(!s.talents.includes('qinlao'))s.talents.push('qinlao');
      effDesc='获得绿色天赋「勤劳」'; break;
    case 'toutu_dushu_reward':
      if(G.addRoleCard)G.addRoleCard('toutu_dushu');
      effDesc='获得卡牌「偷偷读书」'; break;
    case 'gold30_heal50': {
      let gained=G.gainGold(20);let before=s.hp;s.hp=Math.min(s.maxHp,s.hp+50);
      effDesc=`获得${gained}零花钱，回复${s.hp-before}点生命`;break;
    }
    case 'eq1': G.gainEq(1); effDesc='情商+1'; break;
    case 'physique1': if(!(s.character && s.character.physiqueLocked)) { s.physique += 1; s.maxHp = s.physique * 5; s.hp = Math.min(s.hp+5, s.maxHp); effDesc='体魄+1'; } break;
    case 'int1': s.intelligence += 1; effDesc='智力+1'; break;
    case 'speed5': s._eventReadingBonus = (s._eventReadingBonus||0) + 5; effDesc='阅读速度+5'; break;
    case 'book3': {
      let avail = G.BOOK_LIST.filter(bid=>!s.books[bid].completed);
      if(avail.length>0) { let b=G.pick(avail); s.books[b].progress=Math.min(G.BOOKS[b].need,s.books[b].progress+3); effDesc='《'+G.BOOKS[b].name+'》阅读进度+3'; }
      break;
    }
    case 'heal10': if(s.gold>=5){s.gold-=5;s.hp=Math.min(s.maxHp,s.hp+10);effDesc='回复10点生命，花费5零花钱';}else{effDesc='零花钱不足！';} break;
    case 'remove_card': {
      // 杰之邀请: 选择并移除一张卡
      let uniq = [...new Set(s.deck)];
      if(!uniq.length){
        G._currentEvent=null;
        G.showCommonEventResult([choice.afterText||`你选择了“${choice.text}”。事情顺利结束。`]);
        return;
      }
      G.showChoiceModal('🎮 杰哥不要啦 — 选择移除一张卡', uniq.map(cid => ({
        text: G.getCardData(cid).name,
        deferRender: true,
        cb: () => {
          let idx = s.deck.indexOf(cid);
          if(idx >= 0) s.deck.splice(idx, 1);
          effDesc = '移除了「' + G.getCardData(cid).name + '」';
          G._currentEvent=null;
          G.showCommonEventResult([choice.afterText||`你选择了“${choice.text}”。事情顺利结束。`], '', effDesc);
        }
      })),{cancelable:true,onCancel:()=>{}});
      return;
    }
    case 'remove_same_name_card': {
      let uniq=[...new Set(s.deck)];
      if(!uniq.length){G._currentEvent=null;G.showCommonEventResult([choice.afterText||'你翻了翻卡组，发现里面暂时没有可处理的牌。']);return;}
      G.showChoiceModal('🎮 杰哥不要啦 — 选择移除同名卡',uniq.map(cid=>({
        text:G.getCardData(cid)?.name||cid,sub:`将移除卡组中全部${s.deck.filter(x=>G.baseId(x)===G.baseId(cid)).length}张同名卡`,deferRender:true,
        cb:()=>{let base=G.baseId(cid),count=s.deck.filter(x=>G.baseId(x)===base).length;s.deck=s.deck.filter(x=>G.baseId(x)!==base);if(s.cardItems)delete s.cardItems[base];G._currentEvent=null;G.showCommonEventResult([choice.afterText||'你完成了这次卡组整理。'],'',`移除了${count}张「${G.getCardData(cid)?.name||cid}」`);}
      })),{cancelable:true,onCancel:()=>{G._currentEvent=null;G.closeCommonEventFrame();}});return;
    }
    case 'heal15pct': {
      let heal = Math.floor(s.maxHp * 0.15);
      s.hp = Math.min(s.maxHp, s.hp + heal);
      effDesc = '回复' + heal + '生命';
      break;
    }
    case 'wish_pay': {
      if(s.gold >= 3) {
        s.gold -= 3;
        let stats = (s.character&&s.character.physiqueLocked)?['intelligence','eq']:['physique','intelligence','eq'];
        let gains = [];
        for(let i=0;i<3;i++) {
          let st = G.pick(stats);
          if(st === 'physique') {
            if(s.character && s.character.physiqueLocked) { s.intelligence += 1; gains.push('体魄锁定，改为智力+1'); }
            else { s.physique += 1; s.maxHp = s.physique * 5; s.hp = Math.min(s.hp+5, s.maxHp); gains.push('体魄+1'); }
          }
          else if(st === 'intelligence') { s.intelligence += 1; gains.push('智力+1'); }
          else { G.gainEq(1); gains.push('情商+1'); }
        }
        effDesc = '失去3零花钱，' + gains.join('，');
      } else {
        effDesc = '零花钱不足3，什么都没发生';
      }
      break;
    }
    case 'materialist_warrior_reward':
      s.talents=s.talents||[];if(!s.talents.includes('materialist_warrior'))s.talents.push('materialist_warrior');
      effDesc='获得蓝色天赋「唯物战士」';break;
    case 'bet10': s.bet={need:10,successGold:100,failGold:50,paid:false};effDesc='下一场战斗消耗10体力，成功获得100，失败失去50';break;
    case 'bet25': if(s.gold>=0){s.bet={need:25,successGold:300,failGold:100};effDesc='下一场战斗消耗25体力，成功获得300零花钱，失败失去100';}break;
    case 'xiaojun_milk_tea': {
      s.cardItems=s.cardItems||{};
      let ids=[...new Set(s.deck||[])].filter(id=>{let d=G.getCardData(id);return d&&d.type!=='tool'&&!(s.cardItems[G.baseId(id)]||[]).includes('小君的奶茶')&&(s.cardItems[G.baseId(id)]||[]).length<3;});
      if(!ids.length){effDesc='没有可附加道具的卡牌';break;}
      G.showChoiceModal('🧋 选择附加「小君的奶茶」的卡牌',ids.map(cid=>({text:G.getCardData(cid)?.name||cid,sub:'蓝色道具：打出后回复1体力并摸1张牌',deferRender:true,cb:()=>{let base=G.baseId(cid);s.cardItems=s.cardItems||{};s.cardItems[base]=s.cardItems[base]||[];if(!s.cardItems[base].includes('小君的奶茶'))s.cardItems[base].push('小君的奶茶');G._currentEvent=null;G.showCommonEventResult([choice.afterText||'奶茶已经稳稳地挂在卡牌旁边。'],'','已为「'+(G.getCardData(cid)?.name||cid)+'」添加【小君的奶茶】');}})),{cancelable:true,onCancel:()=>{G._currentEvent=null;G.closeCommonEventFrame();}});return;
    }
    case 'bet15': s.bet = {need:15}; effDesc = '下一场战斗消耗15体力：成功获得30零花钱，失败失去5零花钱'; break;
    case 'bet30': s.bet = {need:30}; effDesc = '下一场战斗消耗30体力：成功获得45零花钱，失败失去10零花钱'; break;
    case 'get_card_youjieyouhuan': if(G.addRoleCard)G.addRoleCard('youjieyouhuan');effDesc='获得思路卡「有借有还」';break;
    case 'plant_card': if(G.addRoleCard)G.addRoleCard('gen_zhaogen');effDesc='获得思路卡「扎根」';break;
    case 'plant_talent': s.talents=s.talents||[];if(!s.talents.includes('plant_friend'))s.talents.push('plant_friend');effDesc='获得绿色天赋「绿叶朋友」';break;
    case 'printer_upgrade': case 'homework_upgrade': {
      let ids=[...new Set(s.deck||[])];
      if(!ids.length){effDesc='卡组没有可提升的卡牌';break;}
      G.showChoiceModal('选择本场战斗提升品质的卡牌',ids.map(ref=>({text:G.getCardData(ref)?.name||ref,sub:'当前：'+G.cardQualityKey(ref),cb:()=>{let q=G.cardQualityKey(ref),lv=G.cardQualityLevel(q),next=G.CARD_QUALITY_CHAIN[Math.min(3,lv+1)];let idx=s.deck.indexOf(ref);if(idx>=0)s.deck[idx]=G.qualityRef(ref,next);G._currentEvent=null;G.showCommonEventResult(['那张卡牌像是临时打通了任督二脉。'],'',`【${G.getCardData(ref)?.name||ref}】本场战斗提升至${G.cardQualityName(next)}`);}})),{cancelable:true,onCancel:()=>{G._currentEvent=null;G.closeCommonEventFrame();}});return;
    }
    case 'printer_next_battle': s.nextBattleDraw=(s.nextBattleDraw||0)+2;effDesc='下场考试开局额外摸2张牌';break;
    case 'seat_draw': if(G.addRoleCard)G.addRoleCard('liu_zuo');effDesc='获得思路卡「留座」';break;
    case 'broadcast_talent': s.talents=s.talents||[];if(!s.talents.includes('broadcast_power'))s.talents.push('broadcast_power');effDesc='获得蓝色天赋「声势浩大」';break;
    case 'broadcast_card': if(G.addRoleCard)G.addRoleCard('da_sheng_langdu');effDesc='获得逻辑卡「大声朗读」';break;
    case 'homework_item_card': case 'redpen_card': case 'vending_random': {let r=G.addRandomRoleCardWithItem(choice.eff==='redpen_card'?'logic':'idea');effDesc=r?`获得「${r.card.name}」并附加「${r.item.name}」`:'没有符合条件的卡牌';break;}
    case 'seat_book_item': if(G.eventAttachItemChoice){G.eventAttachItemChoice('不忘初心奖章');return;}break;
    case 'zipper_item': if(G.eventAttachItemChoice){G.eventAttachItemChoice('回形针');return;}break;
    case 'redpen_item': if(G.eventAttachItemChoice){G.eventAttachItemChoice('毛笔');return;}break;
    case 'box_item': if(G.eventAttachItemChoice){G.eventAttachItemChoice('便利贴');return;}break;
    case 'vending_item': if(G.eventAttachItemChoice){G.eventAttachItemChoice('自动笔');return;}break;
    case 'zipper_shield': s.nextBattleStartShield=(s.nextBattleStartShield||0)+(s.physique||0);effDesc='下场考试开场获得'+(s.physique||0)+'点护盾';break;
    case 'duty_talent': s.talents=s.talents||[];if(!s.talents.includes('your_turn'))s.talents.push('your_turn');effDesc='获得绿色天赋「轮到我了」';break;
    case 'duty_recover': s.hp=s.maxHp;s.nextBattleDraw=(s.nextBattleDraw||0)+1;effDesc='生命回复至上限，下场考试额外摸1张牌';break;
    case 'echo_card': if(G.addRoleCard)G.addRoleCard('hui_sheng');effDesc='获得思路卡「回声」';break;
    case 'echo_enemy': s.nextBattleMonsterDrawPenalty=(s.nextBattleMonsterDrawPenalty||0)+1;effDesc='下场考试对手开局少摸1张牌';break;
    case 'box_talent': s.talents=s.talents||[];if(!s.talents.includes('mover'))s.talents.push('mover');effDesc='获得绿色天赋「搬运工」';break;
    case 'oldphoto_talent': s.talents=s.talents||[];if(!s.talents.includes('young_teacher'))s.talents.push('young_teacher');effDesc='获得紫色天赋「老师也年轻」';break;
    case 'oldphoto_card': if(G.addRoleCard)G.addRoleCard('huiyi_sha');effDesc='获得逻辑卡「回忆杀」';break;
    case 'exam_ready': s.nextBattleStartShield=(s.nextBattleStartShield||0)+20;s.nextBattleDraw=(s.nextBattleDraw||0)+1;effDesc='下场考试开场获得20点护盾并额外摸1张牌';break;
    case 'exam_cheer': s.talents=s.talents||[];if(!s.talents.includes('cheer_each_other'))s.talents.push('cheer_each_other');effDesc='获得绿色天赋「互相打气」';break;
    case 'early_exam_accept': s.earlyExamTask={active:true,completed:false,name:'提前交卷',goal:'仅使用一回合通过一场大考',reward:'随机金色天赋；卡组所有卡牌品质提升1级（最高紫色）'};effDesc='已接受「提前交卷」任务';break;
    case 'lottery_buy': G.openLotteryNumberPicker();return;
    case 'lottery_buy_ten': G.buyTenRandomLotteryTickets();return;
    case 'lottery_leave': G._lotteryPicker=null;G.closeModal();effDesc='离开事件';break;
    case 'nothing': break;
  }

  G._currentEvent = null;
  // 后续框只继续讲剧情；数值结算依然生效，奖励以 🎁 奖励条独立展示（2026-09-09）。
  G.showCommonEventResult([choice.afterText||`你选择了“${choice.text}”。事情顺利结束。`], '', effDesc);
};

// --- DECK VIEW ---
G.equipTool = function(cid) {
  let s=G.state;s.equippedTools=Array.isArray(s.equippedTools)?s.equippedTools:[];
  if(s.equippedTools.includes(cid)){G.showToast('该用具已经装备');return;}
  if(s.equippedTools.length<(s.toolSlots||1))s.equippedTools.push(cid);else s.equippedTools[0]=cid;
  s.toolEquipped=s.equippedTools[0]||null;
  G.render();
  G.showToast('🔧 已装备: ' + (G.getCardData(cid)||{}).name);
};
G.unequipTool = function(cid) {
  let s=G.state;s.equippedTools=(s.equippedTools||[]).filter(ref=>ref!==cid);
  s.toolEquipped=s.equippedTools[0]||null;
  G.render();
  G.showToast('🔧 已卸下用具');
};

G.renderDeckView = function(main,bot) {
  let s = G.state;
  // Group cards by type and count
  let counts = {};
  s.deck.forEach(cid => {
    if(!counts[cid]) counts[cid] = 0;
    counts[cid]++;
  });
  let typeNames = {logic:'🔴逻辑',idea:'🔵思路',answer:'🟡解答',tool:'🟢用具'};
  let entries = Object.entries(counts).sort((a,b) => {
    let ca=G.getCardData(a[0]), cb=G.getCardData(b[0]);
    if(!ca||!cb) return 0;
    let order={logic:0,idea:1,answer:2,tool:3};
    return (order[ca.type]||0) - (order[cb.type]||0);
  });

  // 用具槽（局外装备，进入战斗已装备无消耗）——黄色纸面用深色文字
  let equipped=G.autoEquipTools(),toolSlotHtml=Array.from({length:s.toolSlots||1},(_,slot)=>{
    let ref=equipped[slot],td=ref&&G.getCardData(ref);
    return td ? `
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-weight:bold;color:#1d6b34">槽${slot+1}　🔧 ${td.emoji}${td.name}</span>
        <span style="flex:1;font-size:10px;color:#4a3822">${td.desc}</span>
        <button class="btn small danger" style="flex-shrink:0" onclick="G.unequipTool('${ref}')">卸下</button>
      </div>` : `<div style="font-size:11px;color:#5a4630">槽${slot+1}（空）— 获得用具卡后会自动装备</div>`;
  }).join('');

  main.innerHTML = `
    <h3 style="text-align:center;color:#ffd700;margin-bottom:4px">🃏 你的卡组</h3>
    <p style="text-align:center;color:#8ab4f8;font-size:11px;margin-bottom:12px">
      共 ${s.deck.length} 张卡 | ${typeNames.logic}: ${entries.filter(([id])=>(G.getCardData(id)||{}).type==='logic').reduce((s,[,c])=>s+c,0)}张
      | ${typeNames.idea}: ${entries.filter(([id])=>(G.getCardData(id)||{}).type==='idea').reduce((s,[,c])=>s+c,0)}张
      | ${typeNames.answer}: ${entries.filter(([id])=>(G.getCardData(id)||{}).type==='answer').reduce((s,[,c])=>s+c,0)}张
      | ${typeNames.tool}: ${entries.filter(([id])=>(G.getCardData(id)||{}).type==='tool').reduce((s,[,c])=>s+c,0)}张
    </p>
    <div class="paper-box" style="margin-bottom:12px">
      <div style="font-size:11px;color:#2e6b3e;font-weight:bold;margin-bottom:6px">🔧 用具槽（战斗外装备/切换/卸下，进战自动生效）</div>
      ${toolSlotHtml}
    </div>
    <div class="paper-box">
      <div class="deck-grid">
        ${entries.map(([cid,count]) => {
          let cd = G.getCardData(cid);
          if(!cd) return '';
          // 用具卡附加装备/切换按钮
          let toolBtn = '';
          if(cd.type === 'tool') {
            if((s.equippedTools||[]).includes(cid)) {
              toolBtn = `<button class="btn small success" style="font-size:10px" disabled>✓已装备</button>`;
            } else {
              toolBtn = `<button class="btn small" style="font-size:10px" onclick="G.equipTool('${cid}')">装备</button>`;
            }
          }
          return `<div class="deck-cell">${G.cardFaceHtml(cd, {count: count})}${toolBtn?`<div class="deck-cell-actions">${toolBtn}</div>`:''}</div>`;
        }).join('')}
      </div>
    </div>`;
  bot.innerHTML = `<button class="btn primary" style="flex:1" onclick="G.setScreen('map')">← 返回地图</button>`;
};


// Init
G.loadMeta();
G.loadSettings();   // 设置页（2026-08-23）：先读设置再首渲，保证音量/开关即刻生效
G.applySettings();
G.initCardDragSystem();
G.initAutoFitText();
// 编辑器事件沙盒：用临时角色、卡组与资源直接运行单个事件，不读写正式游戏存档。
G.initEventTestMode=function(){
  let id='';try{id=new URLSearchParams(location.search).get('eventTest')||'';}catch(e){}
  if(!id)return false;
  let payload=null;try{payload=JSON.parse(localStorage.getItem('jbtm_event_test_payload')||'null');}catch(e){}
  let ev=payload&&payload.id===id&&payload.event?payload.event:G.EVENTS[id];
  if(!ev){G.showToast('找不到要测试的事件：'+id);return false;}
  G._eventTestMode=true;G._eventTestId=id;
  G.saveRun=function(){return true;};G.clearRunSave=function(){};G.saveMeta=function(){};
  G.EVENTS[id]=ev;
  let ch=G.CHARACTERS.xueshilei||Object.values(G.CHARACTERS)[0],s=G.state;
  s.character=ch;s.star=5;s.physique=ch.physique||5;s.intelligence=ch.intelligence||5;s.eq=ch.eq||5;s.combatEq=0;
  s.maxHp=Math.max(50,s.physique*5);s.hp=s.maxHp;s.maxEnergy=10;s.energy=10;s.energyRegen=3;s.gold=999;
  s.deck=[...(ch.starterDeck||[]),...(G.DEFAULT_DECK_CARDS||[])];s.hand=[];s.discard=[];s.exhaust=[];s.drawPile=[];
  s.cardItems={};s.sleepingCards={};s.partners=[];s.talents=[];s.lotteryTickets=[];s.earlyExamTask=null;
  s.books={};for(let bid of (G.BOOK_LIST||[]))s.books[bid]={progress:0,completed:false,obtained:false};
  s.chapter=1;s.currentNodeId='__event_test__';s.nodeEvents={__event_test__:id};s.completedNodes={};s.reachableNodes={};s.battle=null;s.screen='event';
  return true;
};
G.initEventTestMode();
// 主菜单BGM兜底：浏览器自动播放策略拦截时，用户首次点击后重试播放（设置里关了音乐则不重试）
document.addEventListener('click', () => {
  let bgm = document.querySelector('.menu-bgm');
  if(bgm && bgm.paused && (!G.settings || G.settings.bgmOn !== false)) bgm.play().catch(()=>{});
});
G.render();
console.log('📚 学生时代牌 — 网页预览版已就绪');
console.log('含: 地图导航 | 卡牌战斗 | 用具卡 | 搭档/天赋/事件');
console.log('点击"开始新游戏"即可体验');
