(function(){
  const KEY='jbtm_full_editor_overrides_v1';
  G.LAYOUTS=G.LAYOUTS||{
    battle:{id:'battle',name:'战斗界面布局',healthBallSize:100,healthStackGap:20,healthAreaTop:22,healthAreaBottom:10,healthValueDistance:18,flawRingSize:144,flawRingThickness:11,playerSideWidth:140,monsterSideWidth:140,skillGap:4,handCardWidth:120,handCardHeight:185,handCardOverlap:24,playerPortraitScale:100,monsterPortraitScale:100}
  };
  G.EDITOR_COLLECTIONS={cards:'CARDS',monsters:'MONSTERS',talents:'TALENTS',events:'EVENTS',cg:'CG_EVENTS',startEvents:'CHARACTER_START_EVENTS',audio:'DIALOGUE_AUDIO',layout:'LAYOUTS'};
  G.loadEditorOverrides=function(){try{return Object.assign({},G.EDITOR_FILE_OVERRIDES||{},JSON.parse(localStorage.getItem(KEY)||'{}')||{});}catch(e){return Object.assign({},G.EDITOR_FILE_OVERRIDES||{});}};
  G.applyLayoutSettings=function(){
    let x=(G.LAYOUTS&&G.LAYOUTS.battle)||{},num=(k,d,min,max)=>Math.max(min,Math.min(max,Number(x[k]??d)||d));
    let ball=num('healthBallSize',100,56,180),ring=num('flawRingSize',144,80,240),ringOffset=(ring-ball)/2,labelOffset=Math.max(18,ringOffset+8);
    let css=`@media(min-width:901px){
      .player-side{width:${num('playerSideWidth',140,90,320)}px!important}.monster-side{width:${num('monsterSideWidth',140,90,320)}px!important}
      #dualNexusStack{gap:${num('healthStackGap',20,0,80)}px!important;padding:${num('healthAreaTop',22,0,120)}px 0 ${num('healthAreaBottom',10,0,120)}px!important}
      #dualNexusStack .nexus{width:${ball}px!important;height:${ball}px!important}#dualNexusStack .nexus-tab{left:calc(100% + ${num('healthValueDistance',18,0,120)}px)!important}
      .flaw-ring-svg{width:${ring}px!important;height:${ring}px!important;left:${-ringOffset}px!important;top:${-ringOffset}px!important}.flaw-arc{stroke-width:${num('flawRingThickness',11,2,30)}!important}
      .flaw-label-logic,.flaw-label-idea{top:${-labelOffset}px!important}.flaw-label-answer,.flaw-label-tool{bottom:${-labelOffset}px!important}.flaw-label-idea,.flaw-label-answer{right:${-labelOffset+5}px!important}
      #skillRow{gap:${num('skillGap',4,0,40)}px!important}
      #handArea .hand-card{width:${num('handCardWidth',120,55,240)}px!important;height:${num('handCardHeight',185,85,360)}px!important}
      #handArea .hand-card + .hand-card{margin-left:${-num('handCardOverlap',24,0,100)}px!important}
      #playerPortrait .portrait-art{transform:scale(${Math.min(100,num('playerPortraitScale',100,50,250))/100})!important}
      #monsterPortrait .portrait-art{transform:scale(${Math.min(100,num('monsterPortraitScale',100,50,250))/100})!important}
    }`;
    let style=document.getElementById('gameLayoutOverrides');if(!style){style=document.createElement('style');style.id='gameLayoutOverrides';document.head.appendChild(style);}style.textContent=css;
  };
  G.applyEditorOverrides=function(){let all=G.loadEditorOverrides();for(let [kind,globalName] of Object.entries(G.EDITOR_COLLECTIONS)){if(all[kind]&&G[globalName])Object.assign(G[globalName],all[kind]);}G.applyLayoutSettings();};
  G.saveEditorOverrides=function(all){localStorage.setItem(KEY,JSON.stringify(all||{}));G.applyEditorOverrides();};
  G.exportEditorOverrides=function(){return G.loadEditorOverrides();};
  G.applyEditorOverrides();
})();
