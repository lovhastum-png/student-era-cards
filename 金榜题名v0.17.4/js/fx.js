// fx — 战斗手感特效：屏幕抖动(含龙族强震)/攻击爆炸/龙族刀光/伤害飘字/血条动画（2026-08-22 由内联脚本拆分）
// 依赖顺序：core → data → battle → map → fx → scenes；共用全局 G，禁止改成模块化 import。

G.fx = {
  _ok() { return typeof document !== 'undefined' && document.getElementById && document.getElementById('fxLayer'); },
  // 飘字：x/y 为视口坐标，text 为显示文字，cls 控制配色(dmg/shield/true)
  number(x, y, text, cls) {
    if(!this._ok() || typeof x !== 'number' || typeof y !== 'number') return;
    let el = document.createElement('div');
    el.className = 'fx-num ' + (cls || 'dmg');
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.getElementById('fxLayer').appendChild(el);
    setTimeout(() => el.remove(), 1050);
  },
  // 命中闪红 + 抖动
  hit(targetEl) {
    if(!targetEl || !targetEl.classList) return;
    targetEl.classList.add('fx-hit');
    setTimeout(() => targetEl.classList.remove('fx-hit'), 420);
  },
  // 护盾蓝白脉冲
  shield(targetEl, cls) {
    if(!targetEl || !targetEl.classList) return;
    targetEl.classList.add('fx-shield');
    if(cls) targetEl.classList.add(cls);
    setTimeout(() => { targetEl.classList.remove('fx-shield'); if(cls) targetEl.classList.remove(cls); }, 620);
  },
  // 光环爆发：kind = skill | skill-partner | answer
  burst(targetEl, kind) {
    if(!this._ok() || !targetEl || !targetEl.getBoundingClientRect) return;
    let r = targetEl.getBoundingClientRect();
    let el = document.createElement('div');
    el.className = 'fx-burst ' + (kind || 'skill');
    el.style.left = (r.left + r.width/2) + 'px';
    el.style.top = (r.top + r.height/2) + 'px';
    let size = Math.max(r.width, r.height) * 1.4;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    document.getElementById('fxLayer').appendChild(el);
    setTimeout(() => el.remove(), 720);
  },
  // 屏幕抖动：挂到 #app（持久元素）——出牌后 G.render() 会整体重建战斗DOM，
  // 若挂在 #battleStage 上类会被立刻冲掉、动画永远播不出来（2026-08-19 实测修复）
  // 2026-08-22 修复：龙族壁纸 .lz-bg 是 fixed 独立层盖在 #app 背景之上，
  // 只抖 #app 时壁纸不动 → 必须同步给 .lz-bg 加 shake 才能连背景一起震
  _shakeEls(cls, ms) {
    if(typeof document === 'undefined') return;
    if(G.settings && G.settings.shakeOn === false) return; // 设置页：关闭屏幕震动
    ['app', 'lz-bg'].forEach(function(id) {
      let s = document.getElementById(id);
      if(!s || !s.classList) return;
      s.classList.remove(cls);
    });
    void document.getElementById('app').offsetWidth; // 重置动画，确保连续触发
    ['app', 'lz-bg'].forEach(function(id) {
      let s = document.getElementById(id);
      if(!s || !s.classList) return;
      s.classList.add(cls);
      setTimeout(function() { if(s.classList) s.classList.remove(cls); }, ms);
    });
  },
  shake() {
    if(typeof document === 'undefined') return;
    this._shakeEls('shake', 520);
  },
  // 龙族专属强震：比普通攻击多抖一次（dragonShake 幅度更大、0.8s 拖尾更长，2026-08-22）
  shakeBig() {
    if(typeof document === 'undefined') return;
    this._shakeEls('shake-big', 850);
  },
  // 花瓣全屏遮盖特效（源自用户提供的 花瓣.html，2026-08-22 接入龙族进/退场）：
  // 60片樱花大瓣瞬间铺满全屏（初始scale 2.5~4.5倍盖屏）→ 停顿holdMs（期间底层壁纸完成切换）→ 旋转四散淡出
  petalOverlay(holdMs) {
    if(typeof document === 'undefined') return;
    // 移除上次的覆盖层，避免叠加（原版逻辑）
    let old = document.querySelector('.petal-overlay');
    if(old && old.remove) old.remove();
    let overlay = document.createElement('div');
    overlay.className = 'petal-overlay';
    document.body.appendChild(overlay);
    let vw = (typeof window !== 'undefined' && window.innerWidth) || 1280;
    let vh = (typeof window !== 'undefined' && window.innerHeight) || 720;
    // 花瓣颜色（柔和的樱粉色系，原版调色）
    let colors = [
      'rgba(245,190,195,.95)', 'rgba(255,205,215,.95)', 'rgba(250,185,210,.93)',
      'rgba(230,190,220,.92)', 'rgba(255,230,240,.95)', 'rgba(240,200,210,.93)'
    ];
    // 生成60片大花瓣，随机铺满全屏（原版参数）
    for(let i = 0; i < 60; i++) {
      let p = document.createElement('div');
      p.className = 'st-petal';
      let sz = 70 + Math.random() * 60;
      p.style.cssText =
        'left:' + (Math.random() * vw * .8) + 'px' +
        ';top:' + (Math.random() * vh * .8) + 'px' +
        ';width:' + sz + 'px;height:' + (sz * (.75 + Math.random() * .5)) + 'px' +
        ';background:' + colors[Math.floor(Math.random() * colors.length)] +
        ';--rot0:' + (Math.random() * 360) + 'deg;--sc0:' + (2.5 + Math.random() * 2) +
        ';--tx:' + (Math.random() - .5) * vw * 1.5 + 'px;--ty:' + (Math.random() - .5) * vh * 1.5 + 'px' +
        ';--rot1:' + (360 + Math.random() * 720) + 'deg' +
        ';--tdur:' + (.6 + Math.random() * .5) + 's;--tdel:' + (Math.random() * .3) + 's;';
      overlay.appendChild(p);
    }
    // holdMs 决定是否停顿：>0 先盖住全屏再统一四散(幕布式)；0 则花瓣一出现即按随机延迟(0~0.3s)错峰四散(连贯式，2026-08-22)
    let hold = holdMs || 0;
    setTimeout(function() {
      let all = overlay.querySelectorAll('.st-petal');
      for(let j = 0; j < all.length; j++) all[j].classList.add('scatter');
    }, hold);
    // 散出动画结束后移除覆盖层（原版1.5s清理）
    setTimeout(function() { if(overlay.remove) overlay.remove(); }, hold + 1500);
  },
  // 延迟到当前同步流程（含 render 重建DOM）完成后再执行
  _afterRender(fn) {
    if(typeof requestAnimationFrame === 'function') requestAnimationFrame(fn);
    else if(typeof setTimeout === 'function') setTimeout(fn, 20);
  },
  // 基础攻击挥砍：在目标之上叠加一道亮光斜划
  slash(targetEl) {
    if(typeof document === 'undefined' || !targetEl || !targetEl.getBoundingClientRect) return;
    let r = targetEl.getBoundingClientRect();
    let el = document.createElement('div');
    el.className = 'fx-slash';
    el.style.left = (r.left + r.width/2) + 'px';
    el.style.top = (r.top + r.height*0.42) + 'px';
    el.style.width = Math.max(80, r.width*1.25) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 420);
  },
  // 剧烈爆炸特效：光核 + 冲击光环 + 火花四射（0.55s 快速爆开）
  explosion(targetEl) {
    if(typeof document === 'undefined' || !targetEl || !targetEl.getBoundingClientRect) return;
    let r = targetEl.getBoundingClientRect();
    let el = document.createElement('div');
    el.className = 'fx-explosion';
    el.style.left = (r.left + r.width/2) + 'px';
    el.style.top = (r.top + r.height*0.45) + 'px';
    let size = Math.max(160, r.width*1.5);
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    // 冲击光环：一圈朝外扩散的圆环
    let ring = document.createElement('div');
    ring.className = 'ex-ring';
    el.appendChild(ring);
    // 爆炸光核：星芒+亮核
    let core = document.createElement('div');
    core.className = 'ex-core';
    el.appendChild(core);
    // 火花四射：多个小粒子的中心向随机方向飞散
    let colors = ['#ffd24a','#ff9a2e','#fff3c0','#ff6b2c'];
    let parts = 14;
    for(let i=0;i<parts;i++) {
      let ang = Math.random()*Math.PI*2;
      let dist = (0.5 + Math.random()*0.55) * size;
      let s = document.createElement('span');
      s.className = 'ex-spark';
      s.style.setProperty('--ex-x', (Math.cos(ang)*dist).toFixed(1) + 'px');
      s.style.setProperty('--ex-y', (Math.sin(ang)*dist).toFixed(1) + 'px');
      s.style.background = colors[i%colors.length];
      let d = (3 + Math.random()*5).toFixed(1);
      s.style.width = d + 'px';
      s.style.height = d + 'px';
      el.appendChild(s);
    }
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 570);
  },
  // 抽牌演出：从右下牌库飞向中央展示，再落进手牌；路线由两段流光拖尾强调。
  drawReveal(count) {
    if(typeof document === 'undefined' || !count) return;
    let tries = 0, self = this;
    let run = function() {
      let deck = document.getElementById('deckZone');
      let all = Array.from(document.querySelectorAll('#handArea .hand-card'));
      if((!deck || !all.length) && tries++ < 3) { requestAnimationFrame(run); return; }
      if(!deck || !all.length) return;
      let cards = all.slice(-Math.min(2, count, all.length));
      let source = deck.getBoundingClientRect();
      let sx = source.left + source.width / 2, sy = source.top + source.height / 2;
      let total = cards.length;
      let trail = function(x1,y1,x2,y2,delay) {
        let el = document.createElement('div');
        el.className = 'fx-draw-trail';
        let dx=x2-x1, dy=y2-y1, len=Math.hypot(dx,dy);
        el.style.left=x1+'px'; el.style.top=(y1-3)+'px'; el.style.width=len+'px';
        el.style.transform='rotate('+Math.atan2(dy,dx)+'rad)';
        el.style.animationDelay=delay+'ms';
        document.body.appendChild(el);
        setTimeout(function(){ el.remove(); },delay+700);
      };
      cards.forEach(function(target, i) {
        let r = target.getBoundingClientRect();
        let showX = window.innerWidth / 2 - r.width / 2 + (i - (total-1)/2) * r.width * .72;
        let showY = window.innerHeight * .38 - r.height / 2;
        let clone = target.cloneNode(true);
        clone.id = '';
        clone.classList.remove('card-new','draw-arrival-hidden','draw-arrived');
        clone.classList.add('fx-draw-card');
        clone.style.setProperty('--fan-rot','0deg'); clone.style.setProperty('--fan-y','0px');
        clone.style.left=(sx-r.width/2)+'px'; clone.style.top=(sy-r.height/2)+'px';
        clone.style.width=r.width+'px'; clone.style.height=r.height+'px';
        clone.style.setProperty('--draw-rot', (i ? '7deg' : '-7deg'));
        clone.style.setProperty('--show-x', (showX-(sx-r.width/2))+'px');
        clone.style.setProperty('--show-y', (showY-(sy-r.height/2))+'px');
        clone.style.setProperty('--end-x', (r.left-(sx-r.width/2))+'px');
        clone.style.setProperty('--end-y', (r.top-(sy-r.height/2))+'px');
        clone.style.animationDelay=(i*100)+'ms';
        target.classList.add('draw-arrival-hidden');
        document.body.appendChild(clone);
        trail(sx,sy,showX+r.width/2,showY+r.height/2,i*100);
        trail(showX+r.width/2,showY+r.height/2,r.left+r.width/2,r.top+r.height/2,660+i*100);
        setTimeout(function(){
          clone.remove();
          if(target.isConnected) { target.classList.remove('draw-arrival-hidden'); target.classList.add('draw-arrived'); setTimeout(function(){ if(target.classList) target.classList.remove('draw-arrived'); },300); }
        },1420+i*100);
      });
    };
    setTimeout(run, 0);
  },
  impact(targetEl, crit) {
    if(typeof document === 'undefined' || !targetEl || !targetEl.getBoundingClientRect) return;
    let r=targetEl.getBoundingClientRect(), el=document.createElement('div');
    el.className='fx-impact'+(crit?' crit':'');
    el.style.left=(r.left+r.width/2)+'px'; el.style.top=(r.top+r.height*.45)+'px';
    document.body.appendChild(el);
    setTimeout(function(){ el.remove(); },620);
  },
  // 龙族刀光特效（2026-08-22）：全屏黑遮 → 随机若干道红色刀光斜划，每刀屏幕抖动
  // 龙族为震撼系演出：起始额外多一次强抖动（普通攻击 attackMonster 只抖1次）
  dragonSlash(targetEl, dmg) {
    if(typeof document === 'undefined') return;
    // 全屏黑遮
    let black = document.createElement('div');
    black.className = 'fx-dragon-black';
    document.body.appendChild(black);
    setTimeout(() => black.remove(), 520);
    const r = targetEl && targetEl.getBoundingClientRect ? targetEl.getBoundingClientRect() : null;
    if(r && typeof dmg === 'number' && dmg > 0) {
      this.number(r.left + r.width/2, r.top + r.height*0.32, '-' + dmg, 'dmg');
    }
    // 龙族起始强震：比普通攻击多一次，幅度更大、更持久（2026-08-22）
    this.shakeBig();
    // 以目标为中心，随机角度划出4~6道红色刀光，逐道出现并伴随屏幕抖动
    const slashes = 4 + Math.floor(Math.random() * 3);
    for(let i = 0; i < slashes; i++) {
      let delay = 60 + i * 90;
      setTimeout(() => {
        this.shake();
        let el = document.createElement('div');
        el.className = 'fx-dragon-slash';
        // 视口尺寸守卫式获取（2026-08-23 修复：原裸用 innerWidth 全局，非浏览器环境报 ReferenceError）
        let vw = (typeof window !== 'undefined' && window.innerWidth) || (typeof innerWidth !== 'undefined' ? innerWidth : 1280);
        let vh = (typeof window !== 'undefined' && window.innerHeight) || (typeof innerHeight !== 'undefined' ? innerHeight : 720);
        let base = r ? {x: r.left + r.width/2, y: r.top + r.height/2} : {x: vw/2, y: vh/2};
        // 刀光横跨屏幕，根点偏移目标附近
        el.style.left = (base.x - 140 + (Math.random()-0.5)*260) + 'px';
        el.style.top = (base.y - 120 + (Math.random()-0.5)*240) + 'px';
        el.style.width = Math.max(280, vw * (0.55 + Math.random()*0.4)) + 'px';
        el.style.setProperty('--dr-rot', (-50 + Math.random()*100) + 'deg');
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 360);
      }, delay);
    }
  },
  // 玩家攻击怪物：屏幕剧烈抖动 + 挥砍亮光 + 爆炸特效 + 命中闪红 + 伤害飘字 + 立绘突进
  // 抖动挂持久 #app 不受 render 影响；爆炸挂 body 存活；命中闪红挂怪物框会被
  // 出牌后的 render 重建冲掉 → 延迟到渲染完成后再挂（2026-08-19 修复）
  attackMonster(dmg) {
    if(typeof document === 'undefined') return;
    this.shake();
    if(G.sfx) G.sfx.play(typeof dmg === 'number' && dmg >= 15 ? 'crit' : 'attack'); // 音效（2026-08-23）
    let t = document.getElementById('monsterPortraitBox');
    if(t) {
      this.slash(t); // 挥砍亮光斜划（2026-08-19 新增接线）
      this.explosion(t);
      this.impact(t, typeof dmg === 'number' && dmg >= 15);
      if(typeof dmg === 'number' && dmg >= 15) setTimeout(() => this.slash(t), 70);
      if(t.getBoundingClientRect) {
        let r = t.getBoundingClientRect();
        // 命中撞击环（2026-08-23 LoR 风格）：怪物水晶位置金色冲击环扩散
        this.ring(r.left + r.width/2, r.top + r.height/2, '');
        if(typeof dmg === 'number' && dmg > 0) {
          // 大伤害=重击数字（2026-08-23）：≥15 换 crit 样式 + 星芒贴图
          if(dmg >= 15) this.flare(r.left + r.width/2, r.top + r.height/2);
          this.number(r.left + r.width/2, r.top + r.height*0.32, '-' + dmg, dmg >= 15 ? 'dmg crit' : 'dmg');
        }
      }
    }
    // 玩家立绘突进：出手瞬间扑向敌方再回位（2026-08-19 新增；2026-08-21 锚点改为半身立绘容器）
    this._afterRender(function() {
      let p = document.getElementById('playerPortrait');
      if(p && p.classList) {
        p.classList.remove('fx-lunge');
        void p.offsetWidth; // 重置动画，连续攻击也能再次触发
        p.classList.add('fx-lunge');
        setTimeout(function(){ if(p.classList) p.classList.remove('fx-lunge'); }, 460);
      }
    });
    this._afterRender(function() {
      let t2 = document.getElementById('monsterPortrait');
      if(t2) G.fx.hit(t2);
    });
  },
  // 套盾特效（2026-08-19 用户需求）：立绘蓝白脉冲 + 护盾光环扩散 + 盾徽上浮
  // 魔戒状态：mode='mojie' 改为绿色环形扩散全屏（2026-08-22 用户需求）
  // 挂 body 存活于 render 重建之外；脉冲挂立绘须等渲染完成（同 attackMonster 的处理）
  shieldGain(anchorId, mode) {
    if(typeof document === 'undefined') return;
    if(G.sfx) G.sfx.play('shield'); // 音效（2026-08-23）
    this._afterRender(function() {
      // 护盾反馈围绕玩家生命球，不再套在人物立绘上。
      let p = document.getElementById(anchorId || 'portraitBox');
      if(!p || !p.getBoundingClientRect) return;
      if(mode === 'mojie') {
        G.fx.shield(p, 'green'); // 绿色脉冲
        let vp = p.getBoundingClientRect();
        let el = document.createElement('div');
        el.className = 'fx-mojie-ring';
        el.style.left = (vp.left + vp.width/2) + 'px';
        el.style.top = (vp.top + vp.height/2) + 'px';
        let size = Math.max(160, Math.min(innerWidth, innerHeight) * 0.6);
        el.style.width = size + 'px';
        el.style.height = size + 'px';
        document.body.appendChild(el);
        setTimeout(function(){ el.remove(); }, 750);
        return;
      }
      G.fx.shield(p); // 蓝白脉冲
      let r = p.getBoundingClientRect();
      let ring = document.createElement('div');
      ring.className = 'fx-shieldring';
      let size = Math.max(r.width, r.height) * 1.35;
      ring.style.left = (r.left + r.width/2) + 'px';
      ring.style.top = (r.top + r.height/2) + 'px';
      ring.style.width = size + 'px';
      ring.style.height = size + 'px';
      document.body.appendChild(ring);
      setTimeout(function(){ ring.remove(); }, 650);
      let ic = document.createElement('div');
      ic.className = 'fx-shieldrise';
      ic.textContent = '🛡';
      ic.style.left = (r.left + r.width/2) + 'px';
      ic.style.top = (r.top + r.height*0.3) + 'px';
      document.body.appendChild(ic);
      setTimeout(function(){ ic.remove(); }, 850);
    });
  },
  // 出牌飞行：克隆手牌飞向出牌区中心并缩小淡出（在 playCard 触发 render 前调用）
  cardFlyout(el) {
    if(typeof document === 'undefined' || !el || !el.getBoundingClientRect) return;
    if(G.sfx) G.sfx.play('play'); // 音效（2026-08-23）
    let zone = document.getElementById('playZone');
    if(!zone || !zone.getBoundingClientRect) return;
    let r = el.getBoundingClientRect();
    let clone = el.cloneNode(true);
    clone.id = '';
    if(clone.classList.remove) clone.classList.remove('card-new');
    // 清掉手牌扇形姿态（2026-08-23）：克隆体直飞出牌区，不带旋转
    if(clone.style && clone.style.setProperty) { clone.style.setProperty('--fan-rot','0deg'); clone.style.setProperty('--fan-y','0px'); }
    clone.classList.add('fx-flyout');
    clone.style.left = r.left + 'px';
    clone.style.top = r.top + 'px';
    clone.style.width = r.width + 'px';
    clone.style.height = r.height + 'px';
    document.body.appendChild(clone);
    let zb = zone.getBoundingClientRect();
    // 出牌光柱（2026-08-23 LoR 风格）：卡飞入出牌区的瞬间，光柱冲天 + 法阵闪亮（seedream 贴图）
    this.pillar(zb.left + zb.width/2, zb.top + zb.height/2);
    this.circleFlash(zb.left + zb.width/2, zb.top + zb.height/2);
    let go = function() {
      clone.style.left = (zb.left + zb.width/2 - r.width/2) + 'px';
      clone.style.top = (zb.top + zb.height/2 - r.height/2) + 'px';
      clone.style.transform = 'scale(.55) rotate(2deg)';
      clone.style.opacity = '0';
    };
    if(typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(function(){ requestAnimationFrame(go); });
    } else { go(); }
    setTimeout(() => clone.remove(), 420);
  },
  // 出牌被拒（如小说互斥）：源牌原地短促抖动提示，牌收回手中（2026-08-22）
  cardReturn(el) {
    if(typeof document === 'undefined' || !el) return;
    if(G.sfx) G.sfx.play('deny'); // 音效（2026-08-23）
    el.classList.add('card-deny');
    setTimeout(() => el.classList.remove('card-deny'), 260);
  },
  // 苏醒戳破气泡（2026-09-09）：按基础id找到沉睡卡的位置，爆裂气泡。
  // 苏醒会立即触发 G.render() 重建战斗DOM（fxLayer 随之清空），
  // 因此延迟到渲染完成后再生效，并优先按渲染后的新位置弹出。
  sleepWakePop(baseId) {
    if(typeof document === 'undefined' || !document.querySelectorAll || !this._ok()) return;
    let el=null;
    for(let c of document.querySelectorAll('.card.hand-card[data-ref]')) {
      if(G.baseId(c.getAttribute('data-ref'))===G.baseId(baseId)) { el=c; break; }
    }
    if(!el || !el.getBoundingClientRect) return;
    let r=el.getBoundingClientRect();
    let spawn=()=>{
      if(!this._ok()) return;
      let el2=null;
      for(let c of document.querySelectorAll('.card.hand-card[data-ref]')) {
        if(G.baseId(c.getAttribute('data-ref'))===G.baseId(baseId)) { el2=c; break; }
      }
      if(el2 && el2.getBoundingClientRect) r=el2.getBoundingClientRect();
      let layer=document.getElementById('fxLayer');
      for(let i=0;i<6;i++){
        let b=document.createElement('div');
        b.className='fx-bubble-pop';
        let size=8+Math.random()*14;
        b.style.width=size+'px'; b.style.height=size+'px';
        b.style.left=(r.left+r.width*(0.12+Math.random()*0.76))+'px';
        b.style.top=(r.top+r.height*(0.18+Math.random()*0.64))+'px';
        layer.appendChild(b);
        setTimeout(()=>b.remove(), 550);
      }
    };
    if(typeof setTimeout==='function') setTimeout(spawn,0); else spawn();
  },
  // 回合横幅：敌方回合 / 你的回合 / 战斗开始
  turnBanner(text, cls) {
    if(typeof document === 'undefined') return;
    if(G.sfx) G.sfx.play('turn'); // 音效（2026-08-23）
    let el = document.createElement('div');
    el.className = 'fx-turn-banner' + (cls ? ' ' + cls : '');
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1050);
  },
  // 玩家状态变化飘字（护盾/治疗等）：锚定玩家状态行/生命行
  statusNumber(text, cls, anchorId) {
    if(typeof document === 'undefined') return;
    let el = document.getElementById(anchorId || 'statusRow') || document.getElementById('vitalRow');
    if(!el || !el.getBoundingClientRect) return;
    let r = el.getBoundingClientRect();
    this.number(r.left + r.width/2, r.top + r.height/2, text, cls);
  },
  // 被攻击全屏闪红
  redFlash() {
    if(typeof document === 'undefined') return;
    let el = document.createElement('div');
    el.className = 'fx-redflash';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 480);
  },
  // 玩家被攻击：屏幕剧烈抖动 + 全屏闪红 + 伤害飘字 + 立绘受击
  playerHurt(dmg) {
    this.shake();
    this.redFlash();
    if(G.sfx) G.sfx.play('hit'); // 音效（2026-08-23）
    if(typeof dmg === 'number' && dmg > 0 && typeof document !== 'undefined') {
      let el = document.getElementById('portraitBox') || document.getElementById('vitalRow') || document.getElementById('playerPortrait');
      if(el && el.getBoundingClientRect) {
        let r = el.getBoundingClientRect();
        this.ring(r.left + r.width/2, r.top + r.height/2, ' red'); // 受击红环（2026-08-23）
        if(dmg >= 15) this.flare(r.left + r.width/2, r.top + r.height/2); // 暴击星芒（2026-08-23）
        this.number(r.left + r.width/2, r.top + r.height/2, '-' + dmg, dmg >= 15 ? 'dmg crit' : 'dmg');
      }
    }
    this._afterRender(function() {
      let p = document.getElementById('playerPortrait');
      if(p) G.fx.hit(p);
    });
  },
  // 龙族常驻樱花雨（2026-08-22）：龙族 buff 期间持续飘落，非一次性转场花瓣。
  // 层只在存在时持续生成花瓣；stop() 立即停并清除层。进出场/死亡退场都会显式调用。
  // 小说常驻氛围粒子（2026-08-22）：按小说主题持续飘落/浮起，非一次性转场。
  // 龙族→樱花飘落、银河→星尘飘落、魔戒→圣光屑上浮。层只在存在时持续生成；stop() 立即停并清除层。
  // 进出场/死亡退场都会显式调用 ambientStop()。
  _ambient: { layer: null, timer: null, theme: null },
  _ambientCfg: {
    sakura:    { layer:'lz-petal-fall', cls:'pf', origin:'top', areal:'trail', min:2,   max:4.8, dmin:3.5, dmax:6.5, interval:160 },
    stardust:  { layer:'ambient-star',  cls:'ps', origin:'top', areal:'trail', min:.6,  max:1.8, dmin:4,   dmax:7,   interval:140 },
    holylight: { layer:'ambient-holy',  cls:'ph', origin:'bottom', areal:'rise', min:.7, max:1.6, dmin:4.5, dmax:7, interval:150 },
    rain:      { layer:'ambient-rain',  cls:'pr', origin:'top', areal:'trail', min:2,   max:3.5, dmin:.55, dmax:1.1, interval:60 } // 罗生门冷雨（2026-08-23）：密而快
  },
  ambientStart(theme) {
    this.ambientStop();
    if(typeof document === 'undefined') return;
    if(G.settings && G.settings.ambientOn === false) return; // 设置页：关闭氛围粒子（樱花雨/星尘/圣光）
    let cfg = this._ambientCfg[theme] || this._ambientCfg.sakura;
    let layer = document.createElement('div');
    layer.className = cfg.layer;
    document.body.appendChild(layer);
    let self = this;
    this._ambient = { layer: layer, timer: null, theme: theme };
    this._ambient.timer = setInterval(function() { self._ambientSpawn(cfg, layer); }, cfg.interval);
  },
  _ambientSpawn(cfg, layer) {
    if(!layer || !layer.isConnected) return;
    let p = document.createElement('div');
    p.className = cfg.cls;
    let size = (cfg.min + Math.random() * (cfg.max - cfg.min)) + 'vmin';
    let left = (Math.random() * 100) + 'vw';
    let dur = (cfg.dmin + Math.random() * (cfg.dmax - cfg.dmin)) + 's';
    p.style.left = left; p.style.width = size; p.style.height = size;
    p.style.animationDuration = dur;
    p.style.setProperty('--sway', (0.8 + Math.random() * 2.2) + 'vmin'); // 水平摆动幅度
    if(cfg.cls === 'pf') p.style.setProperty('--rot', Math.round(Math.random() * 1440) + 'deg'); // 樱花需落中自转
    p.addEventListener('animationend', function() { if(p.remove) p.remove(); });
    layer.appendChild(p);
  },
  ambientStop() {
    if(this._ambient.timer) { clearInterval(this._ambient.timer); this._ambient.timer = null; }
    if(this._ambient.layer) { let l = this._ambient.layer; if(l.remove) l.remove(); this._ambient.layer = null; }
    this._ambient.theme = null;
  },
  // ===== LoR 风格战斗增强（2026-08-23）=====
  // 命中撞击环：x/y 视口坐标；cls=' red' 为玩家受击红色
  ring(x, y, cls) {
    if(typeof document === 'undefined' || typeof x !== 'number' || typeof y !== 'number') return;
    let el = document.createElement('div');
    el.className = 'fx-ring' + (cls || '');
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 520);
  },
  // 出牌光柱：从 (x,y) 冲天的淡蓝光柱
  pillar(x, y) {
    if(typeof document === 'undefined' || typeof x !== 'number' || typeof y !== 'number') return;
    let el = document.createElement('div');
    el.className = 'fx-pillar';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 640);
  },
  // 暴击星芒（2026-08-23 seedream 贴图）：黑底图 screen 混合叠在受击目标身上
  flare(x, y) {
    if(typeof document === 'undefined' || typeof x !== 'number' || typeof y !== 'number') return;
    let el = document.createElement('div');
    el.className = 'fx-flare';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 660);
  },
  // 出牌法阵闪亮（2026-08-23 seedream 贴图）：出牌区中心法阵旋转亮起
  circleFlash(x, y) {
    if(typeof document === 'undefined' || typeof x !== 'number' || typeof y !== 'number') return;
    let el = document.createElement('div');
    el.className = 'fx-circle-flash';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  },
  // 击杀特效：全屏白闪 + 目标水晶位置碎片飞散（side='monster'|'player'）
  killFx(side) {
    if(typeof document === 'undefined') return;
    if(G.sfx) G.sfx.play(side === 'player' ? 'defeat' : 'kill'); // 音效（2026-08-23）
    let flash = document.createElement('div');
    flash.className = 'fx-kill';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 600);
    let anchor = document.getElementById(side === 'player' ? 'portraitBox' : 'monsterPortraitBox');
    if(!anchor || !anchor.getBoundingClientRect) return;
    let r = anchor.getBoundingClientRect();
    let cx = r.left + r.width/2, cy = r.top + r.height/2;
    for(let i = 0; i < 10; i++) {
      let s = document.createElement('div');
      s.className = 'fx-shard';
      let ang = Math.random() * Math.PI * 2, dist = 70 + Math.random() * 130;
      s.style.left = cx + 'px';
      s.style.top = cy + 'px';
      if(s.style.setProperty) {
        s.style.setProperty('--sx', Math.cos(ang) * dist + 'px');
        s.style.setProperty('--sy', (Math.sin(ang) * dist - 40) + 'px');
        s.style.setProperty('--srot', Math.round(Math.random() * 720 - 360) + 'deg');
      }
      s.style.animationDuration = (0.55 + Math.random() * 0.35) + 's';
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 950);
    }
  },
  // 胜利光雨：金色光点从底部升起（结算弹窗前）
  victoryFx() {
    if(typeof document === 'undefined') return;
    if(G.sfx) G.sfx.play('victory'); // 音效（2026-08-23）
    for(let i = 0; i < 14; i++) {
      let p = document.createElement('div');
      p.className = 'fx-vp';
      p.style.left = (8 + Math.random() * 84) + 'vw';
      p.style.animationDelay = (Math.random() * 0.9) + 's';
      p.style.animationDuration = (1.2 + Math.random() * 0.9) + 's';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 2400);
    }
  },
  // 战斗氛围微尘（2026-08-23）：battle 屏常驻几粒缓慢上浮光尘；离开自动清除。
  // 由 G.render 每帧同步（挂/摘 DOM 一次，光尘动画纯 CSS 驱动，无 JS 轮询不耗性能）
  ambientBattleSync() {
    if(typeof document === 'undefined') return;
    let layer = document.getElementById('fx-bt-ambient');
    // 设置页：关闭氛围粒子时同非战斗态处理（立即摘层）
    let inBattle = !!(G.state && G.state.screen === 'battle') && !(G.settings && G.settings.ambientOn === false);
    if(!inBattle) { if(layer && layer.remove) layer.remove(); return; }
    if(layer) return;
    layer = document.createElement('div');
    layer.id = 'fx-bt-ambient';
    layer.className = 'fx-bt-ambient';
    for(let i = 0; i < 8; i++) {
      let dot = document.createElement('i');
      dot.style.left = (3 + Math.random() * 94) + 'vw';
      let sz = 3 + Math.random() * 4;
      dot.style.width = sz + 'px'; dot.style.height = sz + 'px';
      dot.style.animationDuration = (9 + Math.random() * 8) + 's';
      dot.style.animationDelay = (-Math.random() * 16) + 's';
      layer.appendChild(dot);
    }
    document.body.appendChild(layer);
  },
  // ===== 薛诗蕾线特效（2026-08-24）=====
  // 理性获得特效：理性≥5层时玩家立绘旁光环 + 公式粒子上浮（seedream贴图 其他插画/fx_formula.png）
  rationalityFx(stacks) {
    if(typeof document === 'undefined') return;
    let anchor = document.getElementById('playerPortrait') || document.getElementById('portraitBox');
    if(!anchor || !anchor.getBoundingClientRect) return;
    let r = anchor.getBoundingClientRect();
    let cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    // 光环（seedream贴图 其他插画/fx_geo_ring.png）
    let ring = document.createElement('div');
    ring.className = 'fx-rat-ring';
    ring.style.left = cx + 'px';
    ring.style.top = cy + 'px';
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 900);
    // 公式粒子：数量随层数
    let n = Math.min(8, 3 + Math.floor(stacks / 2));
    for(let i = 0; i < n; i++) {
      let p = document.createElement('div');
      p.className = 'fx-formula';
      p.style.left = (cx + (Math.random() - 0.5) * r.width * 1.4) + 'px';
      p.style.top = (cy + (Math.random() - 0.5) * r.height * 0.8) + 'px';
      p.style.backgroundImage = "url('其他插画/fx_formula.png')";
      p.style.animationDelay = (Math.random() * 0.25) + 's';
      p.style.animationDuration = (0.8 + Math.random() * 0.5) + 's';
      let sz = 26 + Math.random() * 30;
      p.style.width = sz + 'px'; p.style.height = sz + 'px';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1600);
    }
    if(G.sfx) G.sfx.play('buff'); // 理性叠层音效
  },
  // 奥数之王特效：金红皇冠光芒爆发 + 红品质闪（seedream贴图 其他插画/fx_crown.png）
  aoshuKing() {
    if(typeof document === 'undefined') return;
    let flash = document.createElement('div');
    flash.className = 'fx-king-flash';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 700);
    let zone = document.getElementById('handArea') || document.getElementById('playZone');
    let cx = window.innerWidth / 2, cy = window.innerHeight * 0.72;
    if(zone && zone.getBoundingClientRect) {
      let r = zone.getBoundingClientRect();
      cx = r.left + r.width / 2; cy = r.top + r.height / 2;
    }
    let crown = document.createElement('div');
    crown.className = 'fx-crown';
    crown.style.left = cx + 'px';
    crown.style.top = cy + 'px';
    crown.style.backgroundImage = "url('其他插画/fx_crown.png')";
    document.body.appendChild(crown);
    setTimeout(() => crown.remove(), 1100);
    // 碎金光点
    for(let i = 0; i < 14; i++) {
      let s = document.createElement('div');
      s.className = 'fx-king-spark';
      let ang = Math.random() * Math.PI * 2, dist = 60 + Math.random() * 160;
      s.style.left = cx + 'px';
      s.style.top = cy + 'px';
      if(s.style.setProperty) {
        s.style.setProperty('--sx', Math.cos(ang) * dist + 'px');
        s.style.setProperty('--sy', (Math.sin(ang) * dist - 50) + 'px');
      }
      s.style.animationDuration = (0.55 + Math.random() * 0.4) + 's';
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1100);
    }
    if(G.sfx) G.sfx.play('novel'); // 升格音效（神秘滑升）
  },
  // 费用改变脉冲：手牌区轻闪一下（提示"已变更"状态更新）
  costPulse() {
    if(typeof document === 'undefined') return;
    let area = document.getElementById('handArea');
    if(!area) return;
    area.classList.remove('cost-pulse');
    void area.offsetWidth;
    area.classList.add('cost-pulse');
    setTimeout(() => area.classList.remove('cost-pulse'), 600);
  }
};
// 特效版本标记：浏览器控制台可见，用于确认加载的是最新代码（没看到请 Ctrl+F5 强刷）
if(typeof console !== 'undefined') console.log('[学生时代牌] 战斗手感包 v7 已加载（2026-08-23：LoR风格手牌扇形/出牌光柱/撞击环/击杀白闪/重击数字/氛围微尘）——若未见此行说明浏览器缓存了旧版，请 Ctrl+F5 强制刷新');
// 调试辅助：G 挂到 window（const 声明不进 window，控制台/自动化测试直接用 window.G 访问）
if(typeof window !== 'undefined') window.G = G;

// ===== 音效系统（2026-08-23）：Web Audio 全程序化合成，零素材零网络 =====
// 挂 fx.js 尾部（所有调用点均为运行时，加载顺序无关）；node 无头桩下 AudioContext 不存在 → 全部安全无操作
G.sfx = {
  ctx: null, master: null, noiseBuf: null,
  enabled: (function(){ try { return (typeof localStorage !== 'undefined') && localStorage.getItem('sfx_on') !== '0'; } catch(e){ return true; } })(),
  // 惰性初始化：首次出声时建 AudioContext；浏览器自动播放策略下挂全局唤醒监听
  _init() {
    if(this.ctx || typeof window === 'undefined' || typeof document === 'undefined') return;
    try {
      let AC = window.AudioContext || window.webkitAudioContext;
      if(!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      // 音量来自设置页（2026-08-23）：0.45 为基准增益，按 sfxVol(0~100) 缩放
      this.master.gain.value = 0.45 * ((G.settings && G.settings.sfxVol !== undefined) ? G.settings.sfxVol / 100 : 1);
      this.master.connect(this.ctx.destination);
      // 白噪声缓冲（1秒）：所有 whoosh/impact 复用同一段
      let len = this.ctx.sampleRate;
      this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      let d = this.noiseBuf.getChannelData(0);
      for(let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      let self = this;
      let wake = function() { if(self.ctx && self.ctx.state === 'suspended') self.ctx.resume().catch(function(){}); };
      document.addEventListener('pointerdown', wake);
      document.addEventListener('keydown', wake);
      // 全局按钮点击音（事件委托，capture 阶段）
      document.addEventListener('click', function(ev) {
        let el = ev.target && ev.target.closest ? ev.target.closest('.btn,.te-opt,#endTurnBtn') : null;
        if(el && self.ctx && self.ctx.state === 'running') self.play('click');
      }, true);
    } catch(e) { this.ctx = null; }
  },
  toggle() {
    this.enabled = !this.enabled;
    // 设置页（2026-08-23）：静音按钮与设置页的音效开关互相同步
    if(G.settings) { G.settings.sfxOn = this.enabled; G.saveSettings(); }
    try { if(typeof localStorage !== 'undefined') localStorage.setItem('sfx_on', this.enabled ? '1' : '0'); } catch(e){}
    if(this.enabled) { this._init(); this.play('click'); }
    this.btnSync();
    // 设置面板开着时同步刷新面板里的开关显示
    if(typeof document !== 'undefined' && document.getElementById && document.getElementById('stContent') && G._renderSettingsContent) G._renderSettingsContent();
  },
  // 静音按钮（fixed 右上角，持久 DOM，由 G.render 同步）
  btnSync() {
    if(typeof document === 'undefined' || !document.getElementById) return;
    let b = document.getElementById('sfxToggle');
    if(!b) {
      b = document.createElement('div');
      b.id = 'sfxToggle';
      b.onclick = function() { G.sfx.toggle(); };
      if(document.body && document.body.appendChild) document.body.appendChild(b);
    }
    b.textContent = this.enabled ? '🔊' : '🔇';
    b.title = this.enabled ? '音效：开' : '音效：关';
  },
  play(name) {
    if(!this.enabled) return;
    this._init();
    if(!this.ctx) return;
    if(this.ctx.state === 'suspended') { this.ctx.resume().catch(function(){}); return; } // 唤醒前的首声丢弃，避免恢复后burst
    try { let fn = this['_s_' + name]; if(fn) fn.call(this); } catch(e) {}
  },
  // ===== 合成基元 =====
  // 单音：f 起始频率，to 滑向频率，d 时长，type 波形，v 音量，at 延迟秒，a 起音秒
  tone(f, o) {
    o = o || {};
    let c = this.ctx, t0 = c.currentTime + (o.at || 0);
    let osc = c.createOscillator(), g = c.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(Math.max(20, f), t0);
    if(o.to) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.to), t0 + (o.d || 0.2));
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(o.v || 0.3, t0 + (o.a || 0.008));
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + (o.d || 0.2));
    osc.connect(g); g.connect(this.master);
    osc.start(t0); osc.stop(t0 + (o.d || 0.2) + 0.06);
  },
  // 噪声：filter 滤波（from→to 频率扫频），d 时长
  noise(o) {
    o = o || {};
    let c = this.ctx, t0 = c.currentTime + (o.at || 0);
    let src = c.createBufferSource(); src.buffer = this.noiseBuf;
    let fl = c.createBiquadFilter(); fl.type = o.type || 'lowpass'; fl.Q.value = o.q || 1;
    fl.frequency.setValueAtTime(Math.max(40, o.from || 1000), t0);
    if(o.to) fl.frequency.exponentialRampToValueAtTime(Math.max(40, o.to), t0 + (o.d || 0.2));
    let g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(o.v || 0.3, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + (o.d || 0.2));
    src.connect(fl); fl.connect(g); g.connect(this.master);
    src.start(t0); src.stop(t0 + (o.d || 0.2) + 0.06);
  },
  // ===== 音色定义（全部程序合成，2026-08-23）=====
  _s_click()  { this.tone(1700, {d:.05, type:'square', v:.08}); this.tone(2400, {d:.03, type:'sine', v:.06, at:.005}); },
  _s_draw()   { this.noise({from:1200, to:3600, d:.11, v:.2, type:'bandpass', q:2}); },           // 抽牌：嗖
  _s_play()   { this.noise({from:400, to:2600, d:.16, v:.26, type:'bandpass', q:1.6});            // 出牌：上扬whoosh+落点闷响
                this.tone(190, {to:85, d:.14, type:'sine', v:.3, at:.1}); },
  _s_monsterPlay() { this.noise({from:900, to:220, d:.16, v:.24}); this.tone(120, {to:58, d:.18, type:'sawtooth', v:.16, at:.05}); },
  _s_attack() { this.noise({from:900, d:.1, v:.42}); this.tone(165, {to:52, d:.17, type:'sawtooth', v:.3}); },   // 攻击命中
  _s_crit()   { this.tone(95, {to:42, d:.4, type:'sine', v:.5});                                   // 暴击：重低音+金属鸣响+高频火花
                this.tone(620, {d:.4, type:'square', v:.1}); this.tone(927, {d:.34, type:'square', v:.07, at:.015});
                this.noise({from:2400, to:5200, d:.13, v:.22, type:'highpass', at:.02}); },
  _s_hit()    { this.tone(135, {to:44, d:.3, type:'sawtooth', v:.34}); this.noise({from:420, d:.16, v:.4}); },   // 玩家受击
  _s_shield() { [660, 880, 1320].forEach((f, i) => this.tone(f, {d:.2, type:'triangle', v:.16, at:i * .06})); }, // 套盾：玻璃琶音
  _s_heal()   { [523, 659, 784].forEach((f, i) => this.tone(f, {d:.42, type:'sine', v:.14, at:i * .11})); },      // 治疗：暖三连
  _s_kill()   { this.tone(105, {to:30, d:.5, type:'sine', v:.5}); this.noise({from:600, to:120, d:.4, v:.32});   // 击杀：轰+碎星
                [1568, 1318, 1046, 880, 784].forEach((f, i) => this.tone(f, {d:.22, type:'triangle', v:.09, at:.1 + i * .07})); },
  _s_victory(){ [392, 523, 659, 784].forEach((f, i) => { this.tone(f, {d:.26, type:'square', v:.1, at:i * .13});   // 胜利号角
                  this.tone(f / 2, {d:.26, type:'triangle', v:.12, at:i * .13}); });
                [523, 659, 784].forEach(f => this.tone(f, {d:.75, type:'triangle', v:.11, at:.55})); },
  _s_defeat() { [392, 311, 262, 196].forEach((f, i) => this.tone(f, {d:.34, type:'triangle', v:.16, at:i * .19})); }, // 败北下行
  _s_turn()   { this.noise({from:600, to:2800, d:.24, v:.14, type:'bandpass', q:1.4}); this.tone(988, {d:.18, type:'triangle', v:.13, at:.13}); }, // 回合切换
  _s_deny()   { this.tone(130, {d:.09, type:'square', v:.2}); this.tone(98, {d:.13, type:'square', v:.2, at:.11}); },  // 出牌被拒
  _s_coin()   { this.tone(1318, {d:.07, type:'triangle', v:.2}); this.tone(1760, {d:.1, type:'triangle', v:.18, at:.07}); }, // 购买金币声
  _s_talent() { [523, 587, 659, 784, 880].forEach((f, i) => this.tone(f, {d:.3, type:'sine', v:.13, at:i * .06})); },   // 天赋/奖励：竖琴琶音
  _s_novel()  { [440, 554, 659, 880, 1108, 1318].forEach((f, i) => this.tone(f, {d:.5, type:'sine', v:.1, at:i * .09})); // 小说沉浸：神秘滑升
                this.noise({from:3000, to:6500, d:.7, v:.06, type:'highpass', at:.1}); },
};

G.KEYWORD_TIPS = {
  '如初':'在你第一回合摸牌后，若你手牌没有这张牌，将其从卡组抽出。',
  '保留':'不会被你的技能与卡牌以外的效果弃置或移除，且不占据手牌上限。',
  '脱手':'该牌遭到弃置或移除时，会触发效果。',
  '临时':'仅在本场战斗中拥有，战斗结束后移除。',
  '闪':'回合结束或者打出后移除。',
  '回响':'若不是临时卡，打出后的下一回合生成一张0费临时复制；手牌满时生成在卡组。',
  '沉默':'拥有该词条的卡牌没有任何效果。',
  '移除':'打出后，这张卡在本场战斗中离开游戏。',
  '已变更':'该牌过去变化过费用；该牌离开手牌时移除此词条。',
  '消耗X':'消耗所有体力。',
  '充能X':'消耗法力会为该牌充能，达到上限后消耗所有充能并释放效果。',
  '摸底':'当卡组与弃牌堆之和低于15时，该牌消耗为0且效果翻倍。',
  '理性':'每层使智力提升20%；造成伤害后-1层，多段视为一次伤害。',
  '感性':'造成一段伤害时获得等同当前层数的本场情商，随后-1层；上限3层。',
  '认真':'每层使下一张逻辑卡每段伤害+3；回合结束移除全部层数。',
  '无视':'每层减少1点伤害，上限10层。',
  '骄傲':'每层提供6%智力，然后降低10%；每层无视抵消一层降低效果。',
  '傲慢':'每层提供6%智力，然后降低10%；每层无视抵消一层降低效果。',
  '霜蝶':'每层抵挡一段伤害，每次抵挡消耗1层。',
  '聪明':'每层使智力降低5%，每回合减少2层。',
  '精准':'每层使伤害有3%概率变为180%，概率加算。'
  ,'招架':'下个敌方回合下一次受到的伤害降低90%；成功抵挡后随机弃置对方1张手牌，触发后移除。'
  ,'沉睡':'该卡触发自身效果后进入沉默；沉睡跨战斗保留，只能通过苏醒解除，无法被复原。'
};
G.cardKeywordList = function(cd) {
  let out=[];
  if(cd.ruchu)out.push('如初'); if(cd.baoliu)out.push('保留'); if(cd.tuoshou)out.push('脱手');
  if(cd._tmp)out.push('临时'); if(cd.flash)out.push('闪'); if(cd.echo)out.push('回响');
  if(cd.silenced||cd.silent)out.push('沉默'); if(cd.exhaust)out.push('移除');
  if(cd.sleeping)out.push('沉睡');
  if(cd.dynamicCost==='energy'||cd.costAllEnergyMin1)out.push('消耗X');
  if(cd.charge||cd.chargeMax)out.push('充能X'); if(cd.modi)out.push('摸底');
  if(cd.status) Object.keys(cd.status).forEach(k=>{let n=(G.STATUS_NAMES||{})[k];if(n&&G.KEYWORD_TIPS[n])out.push(n);});
  return [...new Set(out)];
};
G.decorateKeywords = function(html) {
  if(html==null)return '';
  let keys=Object.keys(G.KEYWORD_TIPS).sort((a,b)=>b.length-a.length), re=new RegExp('【?('+keys.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')】?','g');
  let out=String(html).split(/(<[^>]+>)/g).map(part=>part[0]==='<'?part:part.replace(re,(m,k)=>`<span class="kw-tip" data-tip="${G.KEYWORD_TIPS[k]}">【${k==='傲慢'?'骄傲':k}】</span>`)).join('');
  let lookup=name=>{if(G.KEYWORD_TIPS[name])return G.KEYWORD_TIPS[name];let groups=[G.CARD_ITEMS,G.CARDS,G.TALENTS,G.EVENTS];for(let group of groups){let x=group&&Object.values(group).find(v=>v&&(v.name===name||v.id===name));if(x)return `${x.name||name}\n${x.desc||x.effect||'暂无额外说明'}`;}return `${name}\n暂无额外说明`;};
  return out.split(/(<[^>]+>)/g).map(part=>part[0]==='<'?part:part.replace(/【([^】]+)】/g,(m,k)=>G.KEYWORD_TIPS[k]?m:`<span class="kw-tip" data-tip="${lookup(k).replace(/"/g,'&quot;')}">【${k}】</span>`)).join('');
};

// 卡牌悬浮框（2026-08-30）：内容来自卡内的 .card-hover-popup（只作数据源，不内联显示）。
// 展示时克隆到 body 顶层 position:fixed 的 .card-global-tip，脱离卡牌/出牌区的层叠上下文，
// 用超高 z-index 保证显示在所有元素之上（侧面摆放，避开叠卡）。
G._cardTipEl = null;
G._ensureCardTip = function(){
  if(G._cardTipEl && G._cardTipEl.parentNode) return G._cardTipEl;
  var tip = document.createElement('div');
  tip.className = 'card-global-tip';
  document.body.appendChild(tip);
  G._cardTipEl = tip;
  return tip;
};
G._showCardTip = function(src, cx, cy){
  var tip = G._ensureCardTip();
  tip.innerHTML = src.innerHTML;
  tip.style.display = 'block';
  var vw = window.innerWidth || document.documentElement.clientWidth;
  var vh = window.innerHeight || document.documentElement.clientHeight;
  tip.style.visibility = 'hidden';
  var tw = tip.offsetWidth, th = tip.offsetHeight;
  // 侧面摆放：优先鼠标右侧，右侧放不下则放左侧
  var left = cx + 16;
  if(left + tw > vw - 8){ left = cx - tw - 16; if(left < 8) left = 8; }
  var top = cy - 20;
  if(top < 8) top = 8;
  if(top + th > vh - 8) top = vh - th - 8;
  tip.style.left = left + 'px';
  tip.style.top = top + 'px';
  tip.style.visibility = 'visible';
};
G._hideCardTip = function(){
  if(G._cardTipEl) G._cardTipEl.style.display = 'none';
};
(function(){
  function nearestCard(el){
    while(el && el.nodeType === 1){ if(el.classList && el.classList.contains('card')) return el; el = el.parentNode; }
    return null;
  }
  var cur = null;
  document.addEventListener('mouseover', function(e){
    if(G._drag && G._drag.active){ G._hideCardTip(); cur = null; return; }
    var card = nearestCard(e.target);
    if(!card) return;
    if(cur === card) return;
    cur = card;
    var src = card.querySelector('.card-hover-popup');
    if(src) G._showCardTip(src, e.clientX, e.clientY);
    else G._hideCardTip();
  }, true);
  document.addEventListener('mouseout', function(e){
    if(cur && !cur.contains(e.relatedTarget)){ G._hideCardTip(); cur = null; }
  }, true);
})();

// 角色专属卡牌外框：卡牌归属从角色的初始卡组、专属卡及星级赠卡自动检索。
// 新角色只要把外框放入“卡牌样式/角色名卡牌外框.png”，并在角色数据中填写 starterDeck / exclusive / deckAdd，即可自动套用；
// 若素材采用不同文件名，可在角色数据中填写 cardFrame 指定路径。
G.CARD_FRAME_PATHS={
  xueshilei:'卡牌样式/小蕾卡牌外框.png',
  xiaoqingya:'卡牌样式/肖清雅卡牌外框.png',
  chengliang:'卡牌样式/程良专属外框.png',
  tanzijun:'卡牌样式/谭梓君卡牌外框.png',
  liangchaojie:'卡牌样式/梁超杰卡牌外框.png',
  xiaomeng:'卡牌样式/小萌卡牌外框.png',
  xiaomeng_fiora:'卡牌样式/剑姬哓萌卡牌外框.png'
};
G.CARD_FRAME_PRESETS={xiaolei:'卡牌样式/小蕾卡牌外框.png'};
G.cardOwnerIndex=function(){
  let owners={};
  for(let [charId,ch] of Object.entries(G.CHARACTERS||{})){
    let ids=[...(ch.starterDeck||[]),...(ch.exclusive||[])];
    for(let star of Object.values(ch.stars||{}))ids.push(...(star.deckAdd||[]));
    for(let id of ids){id=String(id||'').split('@')[0].split('#')[0];if(id&&!owners[id])owners[id]=charId;}
  }
  return owners;
};
G.getCardFramePath=function(cd){
  if(!cd)return '';
  // 小蕾已有独立旧卡面；剑姬哓萌使用自己的EX外框。
  if(cd.frame||cd.owner==='xueshilei'||cd.characterId==='xueshilei')return '';
  let owner=cd.owner||cd.characterId||(G.cardOwnerIndex()[cd.id]);
  if(owner==='xueshilei')return '';
  let ch=owner&&(G.CHARACTERS||{})[owner];
  if(!ch)return '';
  return ch.cardFrame||G.CARD_FRAME_PATHS[owner]||`卡牌样式/${ch.name}卡牌外框.png`;
};

// 沉睡卡牌气泡（2026-09-09）：按卡ref哈希生成稳定的位置/尺寸/节奏，重渲染不跳动
G.sleepBubbleHtml = function(ref) {
  let h=0, str=String(ref||'');
  for(let i=0;i<str.length;i++){h=(h*31+str.charCodeAt(i))>>>0;}
  h=h||2166136261;
  let out='';
  for(let i=0;i<4;i++){
    let left=10+((h>>(i*6))%78), top=8+((h>>(i*6+4))%68);
    let size=9+((h>>(i*4))%9);
    let dur=3+((h>>(i*3))%3)+((h>>(i*2))%7)/7;
    let delay=((h>>(i*5))%10)/10;
    out+='<span class="sleep-bubble" style="left:'+left+'%;top:'+top+'%;width:'+size+'px;height:'+size+'px;--sb-dur:'+dur.toFixed(2)+'s;animation-delay:-'+delay.toFixed(2)+'s"></span>';
  }
  return out;
};
// 临时卡绿色粒子（2026-09-09）：沿卡牌四边散布的绿色光点，按ref哈希稳定分布
G.tmpParticleHtml = function(ref) {
  let h=0, str=String(ref||'');
  for(let i=0;i<str.length;i++){h=(h*31+str.charCodeAt(i))>>>0;}
  h=h||2166136261;
  let out='';
  for(let i=0;i<5;i++){
    let edge=i%2, along=8+((h>>(i*6))%84), delay=((h>>(i*3))%10)/10;
    let style = edge===0
      ? 'left:'+along+'%;top:-4px'
      : 'top:'+along+'%;left:-4px';
    out+='<span class="tmp-particle" style="'+style+';animation-delay:-'+delay.toFixed(2)+'s"></span>';
  }
  return out;
};

G.cardFaceHtml = function(cd, opts) {
  opts = opts || {};
  let b = G.state.battle;
  let cost = opts.preview ? (cd.cost>=0?cd.cost:'X') : (cd.monsterCard ? 0 : (b ? G.getCardCost(cd) : (cd.cost>=0 ? cd.cost : 'X')));
  let typeNames = {logic:'逻辑卡',idea:'思路卡',answer:'解答卡',tool:'用具卡',trap:'陷阱卡'};
  // 费用显示
  let costHtml;
  if(cd.lifeCostPct) {
    costHtml = `${cd.lifeCostPct}%❤${cd.cost>0?'+'+cd.cost+'⚡':''}`;
  } else if(cd.dynamicCost === 'energy') {
    costHtml = '全部⚡';
  } else if(cd.costAllEnergyMin1) {
    costHtml = '全部⚡(≥1)';
  } else {
    costHtml = cost;
  }
  let q = G.cardQuality(cd);
  // 插画区：cd.art 字段预留（图片URL），未配置时显示类型图标占位
  let hasArt=!!cd.art;
  let artHtml = hasArt
    ? `<img class="card-art-img" src="${cd.art}" alt="" draggable="false">`
    : (cd.emoji || {logic:'💥',idea:'💡',answer:'⭐',tool:'🔧',trap:'🕳️'}[cd.type] || '🃏');
  let effectHtml=cd.monsterCard ? cd.desc : G.cardEffectHtml(cd);
  let keywordList=G.cardKeywordList(cd);
  let itemIds=G.cardItemsFor ? G.cardItemsFor(cd) : (cd._attachedItems||[]);
  let items=itemIds.map(id=>G.CARD_ITEMS&&G.CARD_ITEMS[id]).filter(Boolean);
  let escAttr=v=>String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  let itemStack=items.map(item=>`<button type="button" class="card-item-orb q-${item.q||'green'}" data-item-tip="${escAttr((item.name||item.id)+'|'+(item.desc||'无效果'))}" aria-label="${escAttr(item.name||item.id)}" onmousedown="event.stopPropagation()" onclick="event.stopPropagation();G.toggleCardItemTip(event,this)" onmouseenter="G.showCardItemTip(event,this)" onmousemove="G.moveCardItemTip(event)" onmouseleave="G.hideCardItemTip(false)">${item.icon?`<img src="${escAttr(item.icon)}" alt="">`:(item.emoji||'🎒')}</button>`).join('');
  let itemPopup=items.map(item=>`<div class="popup-keyword"><em>🎒 ${item.name}</em>${item.desc||'无效果'}</div>`).join('');
  let displayName=String(cd.name||'').replace(/^[A-Za-z]+(?=[\u3400-\u9fff])/,'').replace(/^[A-Za-z]+\s*[·:：_\-]\s*/,'');
  let popup=`<div class="card-hover-popup"><b>${displayName}</b><div class="popup-card-type">种类：${typeNames[cd.type]||cd.type||'特殊卡'}</div><div>${G.decorateKeywords(cd.desc||effectHtml||'无效果')}</div>${keywordList.map(k=>`<div class="popup-keyword"><em>【${k}】</em>${G.KEYWORD_TIPS[k]}</div>`).join('')}${itemPopup}</div>`;
  let layoutClass=(cd.monsterCard||opts.preview)?' face-standard':'';
  let framePath=layoutClass?'':G.getCardFramePath(cd);
  let frameClass=framePath?' face-character-frame':'';
  let legacyFrameClass=cd.frame?' face-'+cd.frame:'';
  let frameStyle=framePath?`--character-card-frame:url(&quot;${String(framePath).replace(/&/g,'&amp;').replace(/"/g,'&quot;')}&quot;)`:'';
  let cardStyle=[frameStyle,opts.style||''].filter(Boolean).join(';');
  // 沉睡卡牌：整卡梦幻滤镜 + 浮动气泡；闪卡：虚幻滤镜；临时卡：绿色粒子描边（2026-09-09）
  let sleeping=!!cd.sleeping, flashCard=!!cd.flash, tmpCard=!!cd._tmp;
  return `
    <div class="card hand-card ${cd.type}${legacyFrameClass}${frameClass}${layoutClass}${sleeping?' card-sleeping':''}${flashCard?' card-flash':''}${tmpCard?' card-tmp':''} ${opts.cls||''}" ${opts.id?`id="${opts.id}"`:''} data-ref="${escAttr(cd.ref||cd.id)}"
      ${opts.title?`title="${opts.title.replace(/"/g,'&quot;')}"`:''} ${cardStyle?`style="${cardStyle}"`:''}>
      <div class="cost">${costHtml}</div>
      ${sleeping?`<span class="sleep-badge">😴 沉睡</span>`+G.sleepBubbleHtml(cd.ref||cd.id):''}
      ${tmpCard?G.tmpParticleHtml(cd.ref||cd.id):''}
      ${itemStack?`<div class="card-item-stack">${itemStack}</div>`:''}
      <div class="name" data-autofit="single">${displayName}</div>
      <div class="type-badge">${typeNames[cd.type]||cd.type}</div>
      <div class="card-art ${hasArt?'has-art':'no-art'}">${artHtml}</div>
      <div class="q-orb-wrap"><div class="q-orb q-${q.key}" data-tip="品质:${q.name}"></div></div>
      <div class="desc"><div class="desc-content" data-autofit="block">${G.decorateKeywords(effectHtml)}</div></div>
      ${cd._tmp?'<span class="tmp-badge">【临时】</span>':''}
      ${opts.count?`<span class="face-count">×${opts.count}</span>`:''}
      ${opts.badge||''}
      ${popup}
    </div>`;
};

// 全局文字自适应：内容较长时逐级缩小，始终完整留在所属框内。
G.fitTextElement=function(el){
  if(!el||!el.isConnected)return;
  let box=el.dataset.autofit==='block'?el.parentElement:el;if(!box||box.clientWidth<=0||box.clientHeight<=0)return;
  el.style.removeProperty('font-size');el.style.maxWidth='100%';el.style.boxSizing='border-box';
  let start=parseFloat(getComputedStyle(el).fontSize)||14,min=el.dataset.autofit==='block'?5:7,size=start;
  while(size>min&&(el.scrollWidth>box.clientWidth+1||el.scrollHeight>box.clientHeight+1)){size-=.5;el.style.setProperty('font-size',size+'px','important');}
  el.classList.toggle('autofit-min',size<=min&&(el.scrollWidth>box.clientWidth+1||el.scrollHeight>box.clientHeight+1));
};
G.fitAllText=function(root){
  root=root||document;
  let selectors='.card .name,.card .desc-content,button,.btn,#topBar .title,#topBar .stat,.te-name,.te-narr,.te-opt,.mp-title,.mp-row,.mp-status,.map-label,.section-title,.shop-product-item b,.shop-product-item small,.shop-product-quality,.paper-box small,.paper-box b,.modal-box h3,.modal-box p,.modal-box label,.battle-talent-row b,.battle-talent-row span,.avatar-cell .av-name,.soc-card .sc-name,.soc-effects .eff-line,.soc-slot .info-row,.sce-title,.sce-text,.sce-option,.st-name,.st-sub,.st-note';
  root.querySelectorAll(selectors).forEach(el=>{if(!el.dataset.autofit)el.dataset.autofit=el.matches('.card .desc-content,.te-narr,.sce-text,.soc-effects .eff-line,.paper-box small')?'block':'single';G.fitTextElement(el);});
};
G.initAutoFitText=function(){
  if(G._autoFitObserver)return;
  let queued=false,run=()=>{queued=false;G.fitAllText(document);};
  G._autoFitObserver=new MutationObserver(()=>{if(!queued){queued=true;requestAnimationFrame(run);}});
  G._autoFitObserver.observe(document.body,{childList:true,subtree:true,characterData:true});
  window.addEventListener('resize',()=>requestAnimationFrame(run));requestAnimationFrame(run);
};

G._cardItemTipPinned = false;
G._ensureCardItemTip = function(){
  let tip=document.getElementById('globalCardItemTooltip');
  if(!tip){ tip=document.createElement('div'); tip.id='globalCardItemTooltip'; tip.className='card-global-tip card-item-global-tip'; document.body.appendChild(tip); }
  return tip;
};
G._positionCardItemTip = function(ev, tip){
  let x=ev.clientX+14,y=ev.clientY+14,vw=window.innerWidth,vh=window.innerHeight;
  tip.style.visibility='hidden'; tip.style.display='block';
  if(x+tip.offsetWidth>vw-8)x=ev.clientX-tip.offsetWidth-14;
  if(y+tip.offsetHeight>vh-8)y=ev.clientY-tip.offsetHeight-14;
  tip.style.left=Math.max(8,x)+'px'; tip.style.top=Math.max(8,y)+'px'; tip.style.visibility='visible';
};
G.showCardItemTip = function(ev, el){
  if(G._cardItemTipPinned)return;
  let parts=String(el.dataset.itemTip||'').split('|'),tip=G._ensureCardItemTip();
  tip.innerHTML=`<b>${parts.shift()||'道具'}</b><div>${parts.join('|')||'无效果'}</div>`;
  G._positionCardItemTip(ev,tip);
};
G.moveCardItemTip = function(ev){ if(!G._cardItemTipPinned){let tip=document.getElementById('globalCardItemTooltip');if(tip&&tip.style.display!=='none')G._positionCardItemTip(ev,tip);} };
G.hideCardItemTip = function(force){ if(force||!G._cardItemTipPinned){let tip=document.getElementById('globalCardItemTooltip');if(tip)tip.style.display='none';if(force)G._cardItemTipPinned=false;} };
G.toggleCardItemTip = function(ev,el){
  G._cardItemTipPinned=!G._cardItemTipPinned;
  if(G._cardItemTipPinned){let parts=String(el.dataset.itemTip||'').split('|'),tip=G._ensureCardItemTip();tip.innerHTML=`<b>${parts.shift()||'道具'}</b><div>${parts.join('|')||'无效果'}</div>`;G._positionCardItemTip(ev,tip);}else G.hideCardItemTip(true);
};
document.addEventListener('click',function(e){if(!e.target.closest||!e.target.closest('.card-item-orb'))G.hideCardItemTip(true);},true);
