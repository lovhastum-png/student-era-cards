// 由“金榜题名游戏编辑器”的“写入游戏”功能生成。默认没有覆盖数据。
G.EDITOR_FILE_OVERRIDES = G.EDITOR_FILE_OVERRIDES || {};

// 2026-09-15：事件 1—10 的本轮规则覆盖。保留原事件正文，仅替换选项与实际效果。
(function(){
  const E=G.EVENTS;
  if(!E)return;
  const set=(id,i,patch)=>{if(E[id]&&E[id].opts&&E[id].opts[i])Object.assign(E[id].opts[i],patch);};
  set('notebook',0,{text:'归还失主',eff:'int1',effDesc:'智力+1'});
  set('notebook',1,{text:'偷偷抄一份',eff:'randomRoleLogicWithItem',effDesc:'获得一张角色随机逻辑卡，并附带随机道具'});
  set('teacher',1,{text:'请教学习方法',eff:'randomRoleIdeaWithItem',effDesc:'获得一张角色随机思路卡，并附带随机道具'});
  set('playground',0,{text:'一起跑步',eff:'two_person_three_legs',effDesc:'获得思路卡【俩人三足】'});
  set('playground',1,{text:'在旁看书',eff:'reading10',effDesc:'当前阅读进度+10'});
  set('library',0,{text:'帮忙整理',eff:'qinlao_reward',effDesc:'获得绿色天赋【勤劳】'});
  set('library',1,{text:'趁机读书',eff:'toutu_dushu_reward',effDesc:'获得卡牌【偷偷读书】'});
  set('vendor',0,{text:'买一串（30零花钱）',eff:'gold30_heal50',effDesc:'获得30零花钱，回复50点生命'});
  set('vendor',1,{text:'忍住不吃',eff:'physique1',effDesc:'体魄+1'});
  set('jiezhi_yaoqing',0,{text:'杰哥不要啦',eff:'remove_same_name_card',effDesc:'选择一张卡，移除卡组中全部同名卡'});
  set('jiezhi_yaoqing',1,{text:'杰哥请进',eff:'randomChaojieIdea',effDesc:'获得梁超杰的一张随机思路卡'});
  set('xuyuanchi',0,{text:'一键三连',eff:'wish_pay',effDesc:'失去3零花钱，获得3次随机属性+1（小萌不会获得体魄）'});
  set('xuyuanchi',1,{text:'不许愿',eff:'nothing',effDesc:'无额外效果'});
  set('xiaojun_duzhu',0,{text:'可以，赌！',eff:'bet10',effDesc:'下一场战斗消耗10体力，成功获得100，失败失去50'});
  set('xiaojun_duzhu',1,{text:'给卡牌加一杯奶茶',eff:'xiaojun_milk_tea',effDesc:'选择一张卡牌附加蓝色道具【小君的奶茶】'});
  set('xiaojun_duzhu',2,{text:'赌大点怎么样？',eff:'bet25',effDesc:'下一场战斗消耗25体力；成功获得300零花钱，失败失去100'});

  // 事件剧情重写层在 data.js 中先执行，这里再次覆盖可见文本，避免旧选项文本被写回。
  const text={
    notebook:['归还失主','偷偷抄一份'],teacher:[null,'请教学习方法'],playground:['一起跑步','在旁看书'],
    library:['帮忙整理','趁机读书'],vendor:['买一串（30零花钱）','忍住不吃'],
    jiezhi_yaoqing:['杰哥不要啦','杰哥请进'],xuyuanchi:['一键三连','不许愿'],
    xiaojun_duzhu:['可以，赌！','给卡牌加一杯奶茶','赌大点怎么样？']
  };
  Object.entries(text).forEach(([id,arr])=>arr.forEach((v,i)=>{if(v&&E[id]&&E[id].opts[i])E[id].opts[i].text=v;}));

  G.CARDS.liangrensanzu={id:'liangrensanzu',name:'俩人三足',type:'idea',cost:0,q:'green',desc:'选择弃置2张手牌，然后摸3张牌。移除。',selfDiscardCount:2,drawCards:3,exhaust:true};
  G.CARDS.toutu_dushu={id:'toutu_dushu',name:'偷偷读书',type:'logic',cost:0,q:'green',desc:'造成0.5倍智力伤害。回响。',dmgStat:'intelligence',dmgMult:.5,echo:true};
  G.CARD_ITEMS['小君的奶茶']={id:'小君的奶茶',name:'小君的奶茶',q:'blue',emoji:'🧋',desc:'打出该牌时，回复1点体力，然后摸1张牌。',energyDraw:1};
  G.TALENTS.qinlao={id:'qinlao',name:'勤劳',quality:'绿色',emoji:'🧹',desc:'本局游戏中，每累计消耗40点体力，体魄永久+1。该天赋不会出现在天赋池。',tier:'common',eventOnly:true};
  G.TALENTS.materialist_warrior={id:'materialist_warrior',name:'唯物战士',quality:'蓝色',emoji:'🧱',desc:'没有任何增益状态时，所有伤害提升400%。',tier:'uncommon',eventOnly:true};

  G.roleEventCardPool=function(type,characterId){
    const s=G.state||{}, ch=G.CHARACTERS[characterId||s.character?.id]||{};
    const ids=[...(ch.exclusive||[]),...(ch.starterDeck||[])];
    return [...new Set(ids)].map(id=>G.getCardData(id)).filter(c=>c&&c.type===type&&!G.isZhijiaoCard(c)&&!(s.character&&s.character.physiqueLocked&&G.isPhysiqueRelatedCard(c)));
  };
  G.addRandomRoleCardWithItem=function(type){
    const s=G.state; s.cardItems=s.cardItems||{};
    const candidates=G.roleEventCardPool(type).filter(c=>(s.cardItems[G.baseId(c.id)]||[]).length<3);
    if(!candidates.length)return null;
    const card=G.pick(candidates), base=G.baseId(card.id);
    const owned=new Set(s.cardItems[base]||[]);
    const items=Object.values(G.CARD_ITEMS||{}).filter(item=>!owned.has(item.id)&&!(s.character&&s.character.physiqueLocked&&G.isPhysiqueRelatedItem(item)));
    if(!items.length)return null;
    const item=G.pickEntryBySemesterQuality(items);
    s.deck.push(base);s.cardItems[base]=[...(s.cardItems[base]||[]),item.id];
    return {card,item};
  };
  G.addRoleCard=function(id){const s=G.state;s.deck=s.deck||[];s.deck.push(id);return G.getCardData(id);};

  G.updateTaskHud=function(){
    const old=document.getElementById('taskHud');if(old)old.remove();
    const t=G.state&&G.state.earlyExamTask;if(!t||!t.active&&!t.completed)return;
    const hud=document.createElement('div');hud.id='taskHud';hud.style.cssText='position:fixed;right:18px;top:72px;z-index:9998;background:#fff4d8;color:#604822;border:2px solid #b88b4a;border-radius:8px;padding:7px 10px;min-width:132px;max-width:250px;box-shadow:0 3px 12px #0002;font-size:12px;cursor:pointer';
    hud.innerHTML=`<b>📌 ${t.name||'提前交卷'}</b><span style="float:right">${t.completed?'✅':'▸'}</span><div id="taskHudMore" style="display:none;margin-top:6px;line-height:1.6">进度：${t.completed?'已完成':'进行中'}<br>目标：${t.goal||'仅使用一回合通过一场大考'}<br>奖励：${t.reward||'随机金色天赋；卡组品质提升（最高紫色）'}</div>`;
    hud.onclick=()=>{let x=hud.querySelector('#taskHudMore');if(x)x.style.display=x.style.display==='none'?'block':'none';};document.body.appendChild(hud);
  };
})();

// 最终覆盖层：本文件后续旧编辑器片段不得覆盖 11—30 的正式设定。
(function(){
  const E=G.EVENTS;if(!E)return;
  const set=(id,i,p)=>{if(E[id]?.opts?.[i])Object.assign(E[id].opts[i],p);};
  const rows=[
    ['daily_extra_01',['接受对方请吃饭','先把饭卡研究明白'],['meal_invite','nothing'],['回复100%生命，情商+1','无额外效果']],
    ['daily_extra_02',['把纸条交给班长','认真研究纸条'],['next_battle_shield30','unlock_paper_study'],['下场考试开场获得30点护盾','解锁【纸条研究】任务与3个后续纸条事件']],
    ['daily_extra_03',['帮忙整理，但最多删两类','随便拿一张试卷改名字'],['remove_two_types','rename_test_paper'],['最多移除两种同名卡','选择一张牌转化为随机同类型角色卡']],
    ['daily_extra_04',['把机会留给以后','把老师的好意收下'],['talent_random_plus3','teacher_cotton_jacket'],['天赋随机次数+3','获得蓝色天赋【老师小棉袄】']],
    ['daily_extra_05',['拿走那张借条','私吞口哨'],['get_card_youjieyouhuan','get_whistle'],['获得思路卡【有借有还】','获得用具卡【口哨】']],
    ['daily_extra_06',['借出红笔','试试空白答案'],['get_card_miaohui','blank_talent'],['获得逻辑卡【描绘】','获得紫色天赋【空白】']],
    ['daily_extra_07',['请搭档帮忙升级','私吞雨伞'],['upgrade_partner_event','get_umbrella'],['选择一个已有搭档提升1级','获得用具卡【雨伞】']]
  ];
  rows.forEach(([id,ts,es,ds])=>ts.forEach((t,i)=>set(id,i,{text:t,eff:es[i],effDesc:ds[i]})));
  const later=[
    ['daily_extra_08',['给它换个更大的花盆','和它认真聊两句'],['plant_card','plant_talent'],['获得思路卡【扎根】','获得绿色天赋【绿叶朋友】']],
    ['daily_extra_09',['拆开打印机救场','等它自己想通'],['printer_upgrade','printer_next_battle'],['选择一张卡，本场战斗品质提升1级','下场考试开局额外摸2张牌']],
    ['daily_extra_10',['把占座的书送回书架','给真正需要的人留座'],['seat_book_item','seat_draw'],['选择一张卡附加【不忘初心奖章】','获得思路卡【留座】']],
    ['daily_extra_11',['把音量调回来','主动试音'],['broadcast_talent','broadcast_card'],['获得蓝色天赋【声势浩大】','获得逻辑卡【大声朗读】']],
    ['daily_extra_12',['认真分类整理','先收起来再说'],['homework_upgrade','homework_item_card'],['选择一张卡，本场战斗临时提升1级品质','获得随机角色卡并附带随机道具']],
    ['daily_extra_13',['帮忙修好拉链','先用外套遮住'],['zipper_item','zipper_shield'],['选择一张卡附加【回形针】','下场考试开场获得等同体魄的护盾']],
    ['daily_extra_14',['重新排一张公平的值日表','全班一起扫'],['duty_talent','duty_recover'],['获得绿色天赋【轮到我了】','回复生命，并让下场考试额外摸1张牌']],
    ['daily_extra_15',['把球捡回来','把球推回去'],['echo_card','echo_enemy'],['获得思路卡【回声】','下场考试对手开局少摸1张牌']],
    ['daily_extra_16',['借出红笔','试试还能不能写'],['redpen_item','redpen_card'],['选择一张卡附加【毛笔】','获得随机角色逻辑卡并附带随机道具']],
    ['daily_extra_17',['搬到办公室','贴个提醒'],['box_talent','box_item'],['获得绿色天赋【搬运工】','选择一张卡附加【便利贴】']],
    ['daily_extra_18',['认真听老师讲故事','夸老师有气势'],['oldphoto_talent','oldphoto_card'],['获得紫色天赋【老师也年轻】','获得逻辑卡【回忆杀】']],
    ['daily_extra_19',['联系维修','轻拍机器'],['vending_item','vending_random'],['选择一张卡附加【自动笔】','获得随机角色卡并附带随机道具']],
    ['daily_extra_20',['整理好文具再进考场','先给同桌打气'],['exam_ready','exam_cheer'],['下场考试开场获得护盾并摸1张牌','获得绿色天赋【互相打气】']]
  ];
  later.forEach(([id,ts,es,ds])=>ts.forEach((t,i)=>set(id,i,{text:t,eff:es[i],effDesc:ds[i]})));
  const card=(id,name,type,cost,desc,extra)=>G.CARDS[id]=Object.assign({id,name,type,cost,q:'green',desc},extra||{});
  card('youjieyouhuan','有借有还','idea',0,'摸3张牌，回合结束时弃置3张手牌。',{drawCards:3,endTurnDiscardCount:3});
  card('miaohui','描绘','logic',1,'造成1倍情商伤害。上色。',{dmgStat:'eq',dmgMult:1,applyColor:true});
  card('koushao','口哨','tool',1,'打出逻辑卡时，使所有费用最高的手牌消耗-1。',{whistle:true});
  card('yusan','雨伞','tool',1,'造成伤害的50%转化为护盾；每次获得的护盾不超过体魄的2倍。',{umbrella:true});
  card('gen_zhaogen','扎根','idea',1,'获得1层【理性】；若拥有护盾，额外获得1层【感性】。',{status:{rationality:1},rooted:true});
  card('liu_zuo','留座','idea',1,'摸2张牌，然后将1张手牌置于牌组底部。',{drawCards:2,putHandBottom:1});
  card('da_sheng_langdu','大声朗读','logic',1,'造成0.8倍情商伤害；若本回合打出过思路卡，额外造成0.5倍情商伤害。',{dmgStat:'eq',dmgMult:.8,multAfterIdea:1.3});
  card('hui_sheng','回声','idea',0,'摸1张牌，并获得【回响】。',{drawCards:1,echo:true});
  card('huiyi_sha','回忆杀','logic',2,'造成1倍智力伤害，并将弃牌堆最后一张牌复制到手牌。',{dmgStat:'intelligence',dmgMult:1,retrieveLastDiscard:true});
  G.CARD_ITEMS['便利贴']={id:'便利贴',name:'便利贴',q:'green',emoji:'🗒️',desc:'打出该牌时，获得1层【认真】。',status:{serious:1}};
  const talent=(id,name,quality,desc)=>G.TALENTS[id]={id,name,quality,desc,tier:{绿色:'common',蓝色:'uncommon',紫色:'epic'}[quality],eventOnly:true};
  talent('teacher_cotton_jacket','老师小棉袄','蓝色','开始战斗时，先对目标造成15%最大生命值伤害；非大考时为25%。');talent('blank','空白','紫色','没有任何效果。');talent('plant_friend','绿叶朋友','绿色','每场战斗第一次获得护盾时，摸1张牌。');talent('broadcast_power','声势浩大','蓝色','每回合第一张逻辑卡造成伤害后，向敌方卡组塞入1张【广告单】。');talent('your_turn','轮到我了','绿色','每回合第一次弃置手牌后，摸2张牌。');talent('mover','搬运工','绿色','每场战斗第一次获得护盾时，额外获得5点护盾。');talent('young_teacher','老师也年轻','紫色','每场战斗第一次打出思路卡时，摸1张牌并使下一张卡效果提升。');talent('cheer_each_other','互相打气','绿色','每场战斗开局摸1张牌；生命低于50%时，获得5点护盾。');
  ['1','2','3'].forEach((n,i)=>{G.TALENTS['paper_blue_'+n]={id:'paper_blue_'+n,name:['纸上谈兵','重点标记','留痕'][i],quality:'蓝色',desc:['每场战斗第一次打出思路卡时摸1张牌。','每回合第一次打出逻辑卡时获得2点护盾。','每次获得临时卡时获得1点护盾。'][i],tier:'uncommon',eventOnly:true};});
  ['1','2','3'].forEach(n=>{if(!E['paper_note_'+n])E['paper_note_'+n]={id:'paper_note_'+n,name:'纸条研究：第'+n+'张',emoji:'🗒️',desc:'你又发现一张没有署名的纸条。',dialogue:['纸条研究继续进行。','纸张没有署名，但字迹很认真。'],paperStudy:true,opts:[{text:'继续研究',eff:'paper_study_reward',effDesc:'获得蓝色天赋；完成三张后额外获得紫色天赋'}]};});
  G.EVENT_LIST=Object.keys(E);
  G.eventAttachItemChoice=function(itemId){const s=G.state;s.cardItems=s.cardItems||{};const ids=[...new Set(s.deck||[])].filter(r=>{const d=G.getCardData(r),a=s.cardItems[G.baseId(r)]||[];return d&&d.type!=='tool'&&a.length<3&&!a.includes(itemId);});if(!ids.length){G.showToast('没有符合条件的卡牌');return;}G.showChoiceModal('选择要附加道具的卡牌',ids.map(r=>({text:G.getCardData(r).name,sub:G.CARD_ITEMS[itemId]?.desc||'',cb:()=>{const b=G.baseId(r);s.cardItems[b]=[...(s.cardItems[b]||[]),itemId];G._currentEvent=null;G.showCommonEventResult(['道具已经挂在卡牌旁边了。'],'',`已为【${G.getCardData(r).name}】添加【${itemId}】`);}})),{cancelable:true,onCancel:()=>{G._currentEvent=null;G.closeCommonEventFrame();}});};
})();

// 最终正式层：确保 11—17 使用用户确认内容，18—30 使用同风格的构筑事件。
(function(){
  const E=G.EVENTS;if(!E)return;
  const set=(id,i,p)=>{if(E[id]?.opts?.[i])Object.assign(E[id].opts[i],p);};
  // 11—17
  set('daily_extra_01',0,{text:'接受对方请吃饭',eff:'meal_invite',effDesc:'回复100%生命，情商+1'});
  set('daily_extra_01',1,{text:'先把饭卡研究明白',eff:'nothing',effDesc:'无额外效果'});
  set('daily_extra_02',0,{text:'把纸条交给班长',eff:'next_battle_shield30',effDesc:'下场考试开场获得30点护盾'});
  set('daily_extra_02',1,{text:'认真研究纸条',eff:'unlock_paper_study',effDesc:'解锁【纸条研究】任务与3个后续纸条事件'});
  set('daily_extra_03',0,{text:'帮忙整理，但最多删两类',eff:'remove_two_types',effDesc:'最多选择两种卡牌，移除卡组中全部同类卡'});
  set('daily_extra_03',1,{text:'随便拿一张试卷改名字',eff:'rename_test_paper',effDesc:'选择一张牌，转化为随机同类型角色卡牌'});
  set('daily_extra_04',0,{text:'把机会留给以后',eff:'talent_random_plus3',effDesc:'天赋随机次数+3'});
  set('daily_extra_04',1,{text:'把老师的好意收下',eff:'teacher_cotton_jacket',effDesc:'获得蓝色天赋【老师小棉袄】'});
  set('daily_extra_05',0,{text:'拿走那张借条',eff:'get_card_youjieyouhuan',effDesc:'获得思路卡【有借有还】'});
  set('daily_extra_05',1,{text:'私吞口哨',eff:'get_whistle',effDesc:'获得用具卡【口哨】'});
  set('daily_extra_06',0,{text:'借出红笔',eff:'get_card_miaohui',effDesc:'获得逻辑卡【描绘】'});
  set('daily_extra_06',1,{text:'试试空白答案',eff:'blank_talent',effDesc:'获得紫色天赋【空白】'});
  set('daily_extra_07',0,{text:'请搭档帮忙升级',eff:'upgrade_partner_event',effDesc:'选择一个已有搭档提升1级'});
  set('daily_extra_07',1,{text:'私吞雨伞',eff:'get_umbrella',effDesc:'获得用具卡【雨伞】'});
  // 18—30：每个选项都提供可进入构筑的选择。
  set('daily_extra_08',0,{text:'给它换个更大的花盆',eff:'plant_card',effDesc:'获得思路卡【扎根】'});
  set('daily_extra_08',1,{text:'和它认真聊两句',eff:'plant_talent',effDesc:'获得绿色天赋【绿叶朋友】'});
  set('daily_extra_09',0,{text:'拆开打印机救场',eff:'printer_upgrade',effDesc:'选择一张卡，本场战斗品质提升1级'});
  set('daily_extra_09',1,{text:'等它自己想通',eff:'printer_next_battle',effDesc:'下场考试开局额外摸2张牌'});
  set('daily_extra_10',0,{text:'把占座的书送回书架',eff:'seat_book_item',effDesc:'选择一张卡附加蓝色道具【不忘初心奖章】'});
  set('daily_extra_10',1,{text:'给真正需要的人留座',eff:'seat_draw',effDesc:'获得思路卡【留座】'});
  set('daily_extra_11',0,{text:'把音量调回来',eff:'broadcast_talent',effDesc:'获得蓝色天赋【声势浩大】'});
  set('daily_extra_11',1,{text:'主动试音',eff:'broadcast_card',effDesc:'获得逻辑卡【大声朗读】'});
  set('daily_extra_12',0,{text:'认真分类整理',eff:'homework_upgrade',effDesc:'选择一张卡，本场战斗临时提升1级品质'});
  set('daily_extra_12',1,{text:'先收起来再说',eff:'homework_item_card',effDesc:'获得一张随机角色卡并附带随机道具'});
  set('daily_extra_13',0,{text:'帮忙修好拉链',eff:'zipper_item',effDesc:'选择一张卡附加蓝色道具【回形针】'});
  set('daily_extra_13',1,{text:'先用外套遮住',eff:'zipper_shield',effDesc:'下场考试开局获得等同体魄的护盾'});
  set('daily_extra_14',0,{text:'重新排一张公平的值日表',eff:'duty_talent',effDesc:'获得绿色天赋【轮到我了】'});
  set('daily_extra_14',1,{text:'全班一起扫',eff:'duty_recover',effDesc:'回复生命并让下场考试额外摸1张牌'});
  set('daily_extra_15',0,{text:'把球捡回来',eff:'echo_card',effDesc:'获得思路卡【回声】'});
  set('daily_extra_15',1,{text:'把球推回去',eff:'echo_enemy',effDesc:'下场考试对手开局少摸1张牌'});
  set('daily_extra_16',0,{text:'借出红笔',eff:'redpen_item',effDesc:'选择一张卡附加蓝色道具【毛笔】'});
  set('daily_extra_16',1,{text:'试试还能不能写',eff:'redpen_card',effDesc:'获得一张随机角色逻辑卡并附带随机道具'});
  set('daily_extra_17',0,{text:'搬到办公室',eff:'box_talent',effDesc:'获得绿色天赋【搬运工】'});
  set('daily_extra_17',1,{text:'贴个提醒',eff:'box_item',effDesc:'选择一张卡附加绿色道具【便利贴】'});
  set('daily_extra_18',0,{text:'认真听老师讲故事',eff:'oldphoto_talent',effDesc:'获得紫色天赋【老师也年轻】'});
  set('daily_extra_18',1,{text:'夸老师有气势',eff:'oldphoto_card',effDesc:'获得逻辑卡【回忆杀】'});
  set('daily_extra_19',0,{text:'联系维修',eff:'vending_item',effDesc:'选择一张卡附加蓝色道具【自动笔】'});
  set('daily_extra_19',1,{text:'轻拍机器',eff:'vending_random',effDesc:'随机获得一张角色卡并附带随机道具'});
  set('daily_extra_20',0,{text:'整理好文具再进考场',eff:'exam_ready',effDesc:'下场考试开局获得护盾并摸1张牌'});
  set('daily_extra_20',1,{text:'先给同桌打气',eff:'exam_cheer',effDesc:'获得绿色天赋【互相打气】'});
  const card=(id,name,type,cost,desc,extra)=>G.CARDS[id]=Object.assign({id,name,type,cost,q:'green',desc},extra||{});
  card('youjieyouhuan','有借有还','idea',0,'摸3张牌。回合结束时弃置3张手牌。',{drawCards:3,endTurnDiscardCount:3});
  card('miaohui','描绘','logic',1,'造成1倍情商伤害。该牌具有【上色】。',{dmgStat:'eq',dmgMult:1,applyColor:true});
  card('koushao','口哨','tool',1,'打出逻辑卡时，使所有费用最高的手牌消耗-1。',{whistle:true});
  card('yusan','雨伞','tool',1,'造成伤害的50%转化为护盾；每次获得的护盾不超过体魄的2倍。',{umbrella:true});
  card('gen_zhaogen','扎根','idea',1,'获得1层【理性】；若你拥有护盾，额外获得1层【感性】。',{status:{rationality:1},rooted:true});
  card('liu_zuo','留座','idea',1,'摸2张牌，然后将1张手牌置于牌组底部。',{drawCards:2,putHandBottom:1});
  card('da_sheng_langdu','大声朗读','logic',1,'造成0.8倍情商伤害；若本回合打出过思路卡，额外造成0.5倍情商伤害。',{dmgStat:'eq',dmgMult:.8,multAfterIdea:1.3});
  card('hui_sheng','回声','idea',0,'摸1张牌，并获得【回响】。',{drawCards:1,echo:true});
  card('huiyi_sha','回忆杀','logic',2,'造成1倍智力伤害，并将弃牌堆中最后一张牌复制到手牌。',{dmgStat:'intelligence',dmgMult:1,retrieveLastDiscard:true});
  G.CARD_ITEMS['便利贴']={id:'便利贴',name:'便利贴',q:'green',emoji:'🗒️',desc:'打出该牌时，获得1层【认真】。',status:{serious:1}};
  G.TALENTS.teacher_cotton_jacket={id:'teacher_cotton_jacket',name:'老师小棉袄',quality:'蓝色',emoji:'🧥',desc:'开始战斗时，先对目标造成15%最大生命值伤害；非大考时改为25%。',tier:'uncommon',eventOnly:true};
  G.TALENTS.blank={id:'blank',name:'空白',quality:'紫色',emoji:'⬜',desc:'没有任何效果。',tier:'epic',eventOnly:true};
  G.TALENTS.plant_friend={id:'plant_friend',name:'绿叶朋友',quality:'绿色',emoji:'🌱',desc:'每场战斗第一次获得护盾时，摸1张牌。',tier:'common',eventOnly:true};
  G.TALENTS.broadcast_power={id:'broadcast_power',name:'声势浩大',quality:'蓝色',emoji:'📣',desc:'每回合第一张逻辑卡造成伤害后，向敌方卡组塞入1张【广告单】。',tier:'uncommon',eventOnly:true};
  G.TALENTS.your_turn={id:'your_turn',name:'轮到我了',quality:'绿色',emoji:'🧹',desc:'每回合第一次弃置手牌后，摸2张牌。',tier:'common',eventOnly:true};
  G.TALENTS.mover={id:'mover',name:'搬运工',quality:'绿色',emoji:'📦',desc:'每场战斗第一次获得护盾时，额外获得5点护盾。',tier:'common',eventOnly:true};
  G.TALENTS.young_teacher={id:'young_teacher',name:'老师也年轻',quality:'紫色',emoji:'📸',desc:'每场战斗第一次打出思路卡时，摸1张牌并使下一张卡效果提升。',tier:'epic',eventOnly:true};
  G.TALENTS.cheer_each_other={id:'cheer_each_other',name:'互相打气',quality:'绿色',emoji:'🙌',desc:'每场战斗开局摸1张牌；生命低于50%时，获得5点护盾。',tier:'common',eventOnly:true};
  G.TALENTS.paper_blue_1={id:'paper_blue_1',name:'纸上谈兵',quality:'蓝色',emoji:'📄',desc:'每场战斗第一次打出思路卡时，摸1张牌。',tier:'uncommon',eventOnly:true};
  G.TALENTS.paper_blue_2={id:'paper_blue_2',name:'重点标记',quality:'蓝色',emoji:'🔖',desc:'每回合第一次打出逻辑卡时，获得2点护盾。',tier:'uncommon',eventOnly:true};
  G.TALENTS.paper_blue_3={id:'paper_blue_3',name:'留痕',quality:'蓝色',emoji:'✍️',desc:'每次获得临时卡时，获得1点护盾。',tier:'uncommon',eventOnly:true};
  if(!E.paper_note_1) ['1','2','3'].forEach((n,i)=>E['paper_note_'+n]={id:'paper_note_'+n,name:'纸条研究：第'+n+'张',emoji:'🗒️',desc:'你又发现一张没有署名的纸条。上面写着：重点不会自己发光。',dialogue:['纸条研究继续进行。','这张纸条没有署名，但字写得很认真。'],paperStudy:true,opts:[{text:'继续研究',eff:'paper_study_reward',effDesc:'获得一个蓝色天赋；完成三张后额外获得紫色天赋'}]});
  G.EVENT_LIST=Object.keys(E);
  G.addRoleCard=G.addRoleCard||function(id){G.state.deck=G.state.deck||[];G.state.deck.push(id);return G.getCardData(id);};
  G.eventAttachItemChoice=function(itemId){const s=G.state;s.cardItems=s.cardItems||{};const ids=[...new Set(s.deck||[])].filter(ref=>{const d=G.getCardData(ref),items=s.cardItems[G.baseId(ref)]||[];return d&&d.type!=='tool'&&items.length<3&&!items.includes(itemId);});if(!ids.length){G.showToast('没有符合条件的卡牌');return;}G.showChoiceModal('选择要附加道具的卡牌',ids.map(ref=>({text:G.getCardData(ref).name,sub:G.CARD_ITEMS[itemId]?.desc||'',cb:()=>{const b=G.baseId(ref);s.cardItems[b]=[...(s.cardItems[b]||[]),itemId];G._currentEvent=null;G.showCommonEventResult(['道具已经稳稳地挂在卡牌旁边了。'],'',`已为【${G.getCardData(ref).name}】添加【${itemId}】`);}})),{cancelable:true,onCancel:()=>{G._currentEvent=null;G.closeCommonEventFrame();}});};
})();

// 正式事件扩展：11—17 使用用户指定规则；18—30 为同风格的联动事件。
(function(){
  const E=G.EVENTS;if(!E)return;
  const set=(id,i,p)=>{if(E[id]&&E[id].opts&&E[id].opts[i])Object.assign(E[id].opts[i],p);};
  set('daily_extra_01',0,{text:'接受对方请吃饭',eff:'meal_invite',effDesc:'回复100%生命，情商+1'});
  set('daily_extra_01',1,{text:'先把饭卡研究明白',eff:'nothing',effDesc:'无额外效果'});
  set('daily_extra_02',0,{text:'把纸条交给班长',eff:'next_battle_shield30',effDesc:'下场考试开场获得30点护盾'});
  set('daily_extra_02',1,{text:'认真研究纸条',eff:'unlock_paper_study',effDesc:'解锁【纸条研究】任务与3个后续纸条事件'});
  set('daily_extra_03',0,{text:'帮忙整理，但最多删两类',eff:'remove_two_types',effDesc:'最多选择两种卡牌，移除卡组中全部同类卡'});
  set('daily_extra_03',1,{text:'随便拿一张试卷改名字',eff:'rename_test_paper',effDesc:'选择一张牌，转化为随机同类型角色卡牌'});
  set('daily_extra_04',0,{text:'把机会留给以后',eff:'talent_random_plus3',effDesc:'天赋随机次数+3'});
  set('daily_extra_04',1,{text:'把老师的好意收下',eff:'teacher_cotton_jacket',effDesc:'获得蓝色天赋【老师小棉袄】'});
  set('daily_extra_05',0,{text:'吹哨集合',eff:'get_whistle',effDesc:'获得用具卡【口哨】'});
  set('daily_extra_05',1,{text:'先把口哨藏起来',eff:'nothing',effDesc:'无额外效果'});
  set('daily_extra_06',0,{text:'借出红笔',eff:'get_card_miaohui',effDesc:'获得逻辑卡【描绘】'});
  set('daily_extra_06',1,{text:'试试空白答案',eff:'blank_talent',effDesc:'获得紫色天赋【空白】'});
  set('daily_extra_07',0,{text:'请搭档帮忙升级',eff:'upgrade_partner_event',effDesc:'选择一个已有搭档提升1级'});
  set('daily_extra_07',1,{text:'私吞雨伞',eff:'get_umbrella',effDesc:'获得用具卡【雨伞】'});

  // 18—30：保留原剧情，只替换选项为有构筑意义的选择。
  set('daily_extra_08',0,{text:'给它换个更大的花盆',eff:'plant_card',effDesc:'获得思路卡【扎根】'});
  set('daily_extra_08',1,{text:'和它认真聊两句',eff:'plant_talent',effDesc:'获得绿色天赋【绿叶朋友】'});
  set('daily_extra_09',0,{text:'拆开打印机救场',eff:'printer_upgrade',effDesc:'选择一张卡，本场战斗品质提升1级'});
  set('daily_extra_09',1,{text:'等它自己想通',eff:'printer_next_battle',effDesc:'下场考试开局额外摸2张牌'});
  set('daily_extra_10',0,{text:'把占座的书送回书架',eff:'seat_book_item',effDesc:'选择一张卡附加蓝色道具【不忘初心奖章】'});
  set('daily_extra_10',1,{text:'给真正需要的人留座',eff:'seat_draw',effDesc:'获得思路卡【留座】'});
  set('daily_extra_11',0,{text:'把音量调回来',eff:'broadcast_talent',effDesc:'获得蓝色天赋【声势浩大】'});
  set('daily_extra_11',1,{text:'主动试音',eff:'broadcast_card',effDesc:'获得逻辑卡【大声朗读】'});
  set('daily_extra_12',0,{text:'认真分类整理',eff:'homework_upgrade',effDesc:'选择一张牌，本场战斗临时提升1级品质'});
  set('daily_extra_12',1,{text:'先收起来再说',eff:'homework_item_card',effDesc:'获得一张随机角色卡并附带随机道具'});
  set('daily_extra_13',0,{text:'帮忙修好拉链',eff:'zipper_item',effDesc:'选择一张卡附加蓝色道具【回形针】'});
  set('daily_extra_13',1,{text:'先用外套遮住',eff:'zipper_shield',effDesc:'下场考试开局获得等同体魄的护盾'});
  set('daily_extra_14',0,{text:'重新排一张公平的值日表',eff:'duty_talent',effDesc:'获得绿色天赋【轮到我了】'});
  set('daily_extra_14',1,{text:'全班一起扫',eff:'duty_recover',effDesc:'回复生命与体力，并摸1张牌'});
  set('daily_extra_15',0,{text:'把球捡回来',eff:'echo_card',effDesc:'获得思路卡【回声】'});
  set('daily_extra_15',1,{text:'把球推回去',eff:'echo_enemy',effDesc:'下场考试对手开局少摸1张牌'});
  set('daily_extra_16',0,{text:'借出红笔',eff:'redpen_item',effDesc:'选择一张卡附加蓝色道具【毛笔】'});
  set('daily_extra_16',1,{text:'试试还能不能写',eff:'redpen_card',effDesc:'获得一张随机角色逻辑卡并附带随机道具'});
  set('daily_extra_17',0,{text:'搬到办公室',eff:'box_talent',effDesc:'获得绿色天赋【搬运工】'});
  set('daily_extra_17',1,{text:'贴个提醒',eff:'box_item',effDesc:'选择一张卡附加绿色道具【便利贴】'});
  set('daily_extra_18',0,{text:'认真听老师讲故事',eff:'oldphoto_talent',effDesc:'获得紫色天赋【老师也年轻】'});
  set('daily_extra_18',1,{text:'夸老师有气势',eff:'oldphoto_card',effDesc:'获得逻辑卡【回忆杀】'});
  set('daily_extra_19',0,{text:'联系维修',eff:'vending_item',effDesc:'选择一张卡附加蓝色道具【自动笔】'});
  set('daily_extra_19',1,{text:'轻拍机器',eff:'vending_random',effDesc:'随机获得一张角色卡并附带随机道具'});
  set('daily_extra_20',0,{text:'整理好文具再进考场',eff:'exam_ready',effDesc:'下场考试开局获得护盾并摸1张牌'});
  set('daily_extra_20',1,{text:'先给同桌打气',eff:'exam_cheer',effDesc:'获得绿色天赋【互相打气】'});

  const card=(id,name,type,cost,desc,extra)=>G.CARDS[id]=Object.assign({id,name,type,cost,q:'green',desc},extra||{});
  card('gen_zhaogen','扎根','idea',1,'获得1层【理性】；若你拥有护盾，额外获得1层【感性】。',{status:{rationality:1},rooted:true});
  card('liu_zuo','留座','idea',1,'摸2张牌，然后将1张手牌置于牌组底部。',{drawCards:2,putHandBottom:1});
  card('da_sheng_langdu','大声朗读','logic',1,'造成0.8倍情商伤害；若本回合你打出过思路卡，额外造成0.5倍情商伤害。',{dmgStat:'eq',dmgMult:.8,multAfterIdea:1.3});
  card('hui_sheng','回声','idea',0,'摸1张牌，获得【回响】。',{drawCards:1,echo:true});
  card('huiyi_sha','回忆杀','logic',2,'造成1倍智力伤害，并复制你弃牌堆中最晚的一张牌到手牌。',{dmgStat:'intelligence',dmgMult:1,retrieveLastDiscard:true});
  G.TALENTS.plant_friend={id:'plant_friend',name:'绿叶朋友',quality:'绿色',emoji:'🌱',desc:'每场战斗第一次获得护盾时，摸1张牌。',tier:'common',eventOnly:true};
  G.TALENTS.broadcast_power={id:'broadcast_power',name:'声势浩大',quality:'蓝色',emoji:'📣',desc:'每回合第一张逻辑卡造成伤害后，向敌方卡组塞入1张【广告单】。',tier:'uncommon',eventOnly:true};
  G.TALENTS.your_turn={id:'your_turn',name:'轮到我了',quality:'绿色',emoji:'🧹',desc:'每回合第一次弃置手牌后，摸2张牌。',tier:'common',eventOnly:true};
  G.TALENTS.mover={id:'mover',name:'搬运工',quality:'绿色',emoji:'📦',desc:'每场战斗第一次获得护盾时，额外获得5点护盾。',tier:'common',eventOnly:true};
  G.TALENTS.young_teacher={id:'young_teacher',name:'老师也年轻',quality:'紫色',emoji:'📸',desc:'每场战斗第一次打出思路卡时，复制其效果的一半。',tier:'epic',eventOnly:true};
  G.TALENTS.cheer_each_other={id:'cheer_each_other',name:'互相打气',quality:'绿色',emoji:'🙌',desc:'每场战斗开局摸1张牌；生命低于50%时，获得5点护盾。',tier:'common',eventOnly:true};
  G.EVENT_LIST=Object.keys(E);
})();

// 运行时最终覆盖：确保旧版清理片段之后仍恢复 11—30 的正式配置。
(function(){
  const E=G.EVENTS;if(!E)return;const set=(id,i,p)=>{if(E[id]?.opts?.[i])Object.assign(E[id].opts[i],p);};
  const defs={
    daily_extra_01:[['接受对方请吃饭','先把饭卡研究明白'],['meal_invite','nothing'],['回复100%生命，情商+1','无额外效果']],daily_extra_02:[['把纸条交给班长','认真研究纸条'],['next_battle_shield30','unlock_paper_study'],['下场考试开场获得30点护盾','解锁【纸条研究】任务与3个后续纸条事件']],daily_extra_03:[['帮忙整理，但最多删两类','随便拿一张试卷改名字'],['remove_two_types','rename_test_paper'],['最多移除两种同名卡','选择一张牌转化为随机同类型角色卡']],daily_extra_04:[['把机会留给以后','把老师的好意收下'],['talent_random_plus3','teacher_cotton_jacket'],['天赋随机次数+3','获得蓝色天赋【老师小棉袄】']],daily_extra_05:[['拿走那张借条','私吞口哨'],['get_card_youjieyouhuan','get_whistle'],['获得思路卡【有借有还】','获得用具卡【口哨】']],daily_extra_06:[['借出红笔','试试空白答案'],['get_card_miaohui','blank_talent'],['获得逻辑卡【描绘】','获得紫色天赋【空白】']],daily_extra_07:[['请搭档帮忙升级','私吞雨伞'],['upgrade_partner_event','get_umbrella'],['选择一个已有搭档提升1级','获得用具卡【雨伞】']],
    daily_extra_08:[['给它换个更大的花盆','和它认真聊两句'],['plant_card','plant_talent'],['获得思路卡【扎根】','获得绿色天赋【绿叶朋友】']],daily_extra_09:[['拆开打印机救场','等它自己想通'],['printer_upgrade','printer_next_battle'],['选择一张卡，本场战斗品质提升1级','下场考试开局额外摸2张牌']],daily_extra_10:[['把占座的书送回书架','给真正需要的人留座'],['seat_book_item','seat_draw'],['选择一张卡附加【不忘初心奖章】','获得思路卡【留座】']],daily_extra_11:[['把音量调回来','主动试音'],['broadcast_talent','broadcast_card'],['获得蓝色天赋【声势浩大】','获得逻辑卡【大声朗读】']],daily_extra_12:[['认真分类整理','先收起来再说'],['homework_upgrade','homework_item_card'],['选择一张卡，本场战斗临时提升1级品质','获得随机角色卡并附带随机道具']],daily_extra_13:[['帮忙修好拉链','先用外套遮住'],['zipper_item','zipper_shield'],['选择一张卡附加【回形针】','下场考试开场获得等同体魄的护盾']],daily_extra_14:[['重新排一张公平的值日表','全班一起扫'],['duty_talent','duty_recover'],['获得绿色天赋【轮到我了】','回复生命，并让下场考试额外摸1张牌']],daily_extra_15:[['把球捡回来','把球推回去'],['echo_card','echo_enemy'],['获得思路卡【回声】','下场考试对手开局少摸1张牌']],daily_extra_16:[['借出红笔','试试还能不能写'],['redpen_item','redpen_card'],['选择一张卡附加【毛笔】','获得随机角色逻辑卡并附带随机道具']],daily_extra_17:[['搬到办公室','贴个提醒'],['box_talent','box_item'],['获得绿色天赋【搬运工】','选择一张卡附加【便利贴】']],daily_extra_18:[['认真听老师讲故事','夸老师有气势'],['oldphoto_talent','oldphoto_card'],['获得紫色天赋【老师也年轻】','获得逻辑卡【回忆杀】']],daily_extra_19:[['联系维修','轻拍机器'],['vending_item','vending_random'],['选择一张卡附加【自动笔】','获得随机角色卡并附带随机道具']],daily_extra_20:[['整理好文具再进考场','先给同桌打气'],['exam_ready','exam_cheer'],['下场考试开场获得护盾并摸1张牌','获得绿色天赋【互相打气】']]
  };Object.entries(defs).forEach(([id,[ts,es,ds]])=>ts.forEach((t,i)=>set(id,i,{text:t,eff:es[i],effDesc:ds[i]})));
  const card=(id,name,type,cost,desc,x)=>G.CARDS[id]=Object.assign({id,name,type,cost,q:'green',desc},x||{});card('youjieyouhuan','有借有还','idea',0,'摸3张牌，回合结束时弃置3张手牌。',{drawCards:3,endTurnDiscardCount:3});card('miaohui','描绘','logic',1,'造成1倍情商伤害。上色。',{dmgStat:'eq',dmgMult:1,applyColor:true});card('koushao','口哨','tool',1,'打出逻辑卡时，使所有费用最高的手牌消耗-1。',{whistle:true});card('yusan','雨伞','tool',1,'造成伤害的50%转化为护盾；每次获得的护盾不超过体魄的2倍。',{umbrella:true});card('gen_zhaogen','扎根','idea',1,'获得1层【理性】；若拥有护盾，额外获得1层【感性】。',{status:{rationality:1},rooted:true});card('liu_zuo','留座','idea',1,'摸2张牌，然后将1张手牌置于牌组底部。',{drawCards:2,putHandBottom:1});card('da_sheng_langdu','大声朗读','logic',1,'造成0.8倍情商伤害；若本回合打出过思路卡，额外造成0.5倍情商伤害。',{dmgStat:'eq',dmgMult:.8,multAfterIdea:1.3});card('hui_sheng','回声','idea',0,'摸1张牌，并获得【回响】。',{drawCards:1,echo:true});card('huiyi_sha','回忆杀','logic',2,'造成1倍智力伤害，并将弃牌堆最后一张牌复制到手牌。',{dmgStat:'intelligence',dmgMult:1,retrieveLastDiscard:true});G.CARD_ITEMS['便利贴']={id:'便利贴',name:'便利贴',q:'green',emoji:'🗒️',desc:'打出该牌时，获得1层【认真】。',status:{serious:1}};
  const talent=(id,name,quality,desc)=>G.TALENTS[id]={id,name,quality,desc,tier:{绿色:'common',蓝色:'uncommon',紫色:'epic'}[quality],eventOnly:true};talent('teacher_cotton_jacket','老师小棉袄','蓝色','开始战斗时，对目标造成15%最大生命值伤害，非大考为25%。');talent('blank','空白','紫色','没有任何效果。');talent('plant_friend','绿叶朋友','绿色','每场战斗第一次获得护盾时摸1张牌。');talent('broadcast_power','声势浩大','蓝色','每回合第一张逻辑卡造成伤害后向敌方卡组塞入广告单。');talent('your_turn','轮到我了','绿色','每回合第一次弃置手牌后摸2张牌。');talent('mover','搬运工','绿色','每场战斗第一次获得护盾时额外获得5点护盾。');talent('young_teacher','老师也年轻','紫色','每场战斗第一次打出思路卡时摸1张牌。');talent('cheer_each_other','互相打气','绿色','每场战斗开局摸1张牌，生命低于50%时获得5点护盾。');
  ['1','2','3'].forEach((n,i)=>{G.TALENTS['paper_blue_'+n]={id:'paper_blue_'+n,name:['纸上谈兵','重点标记','留痕'][i],quality:'蓝色',desc:'纸条研究奖励天赋。',tier:'uncommon',eventOnly:true};if(!E['paper_note_'+n])E['paper_note_'+n]={id:'paper_note_'+n,name:'纸条研究：第'+n+'张',emoji:'🗒️',desc:'你又发现一张没有署名的纸条。',dialogue:['纸条研究继续进行。'],paperStudy:true,opts:[{text:'继续研究',eff:'paper_study_reward',effDesc:'获得蓝色天赋，完成三张后额外获得紫色天赋'}]};});G.EVENT_LIST=Object.keys(E);
  G.eventAttachItemChoice=function(itemId){const s=G.state;s.cardItems=s.cardItems||{};const ids=[...new Set(s.deck||[])].filter(r=>{const d=G.getCardData(r),a=s.cardItems[G.baseId(r)]||[];return d&&d.type!=='tool'&&a.length<3&&!a.includes(itemId);});if(!ids.length){G.showToast('没有符合条件的卡牌');return;}G.showChoiceModal('选择要附加道具的卡牌',ids.map(r=>({text:G.getCardData(r).name,sub:G.CARD_ITEMS[itemId]?.desc||'',cb:()=>{const b=G.baseId(r);s.cardItems[b]=[...(s.cardItems[b]||[]),itemId];G._currentEvent=null;G.showCommonEventResult(['道具已经挂在卡牌旁边了。'],'',`已为【${G.getCardData(r).name}】添加【${itemId}】`);}})),{cancelable:true,onCancel:()=>{G._currentEvent=null;G.closeCommonEventFrame();}});};
})();

// 回滚误编号的 11—17 覆盖：本轮真正目标是总编号 18—30，保留原事件内容。
(function(){
  const E=G.EVENTS;if(!E)return;
  const restore=(id,a,b)=>{if(!E[id]||!E[id].opts)return;Object.assign(E[id].opts[0],a);if(E[id].opts[1])Object.assign(E[id].opts[1],b);};
  restore('daily_extra_01',{text:'归还饭卡',eff:'eq1',effDesc:''},{text:'先吃饭再说',eff:'heal15pct',effDesc:''});
  restore('daily_extra_02',{text:'交给班长',eff:'randomIdea',effDesc:''},{text:'留下研究',eff:'int1',effDesc:''});
  restore('daily_extra_03',{text:'帮忙整理',eff:'eq1',effDesc:''},{text:'研究风向',eff:'randomLogic',effDesc:''});
  restore('daily_extra_04',{text:'递上备用粉笔',eff:'int1',effDesc:''},{text:'交出三角粉笔',eff:'randomIdea',effDesc:''});
  restore('daily_extra_05',{text:'交给老师',eff:'physique1',effDesc:''},{text:'吹哨集合',eff:'eq1',effDesc:''});
  restore('daily_extra_06',{text:'认真完成',eff:'int1',effDesc:''},{text:'保留空白',eff:'gold10',effDesc:''});
  restore('daily_extra_07',{text:'送同学回家',eff:'eq1',effDesc:''},{text:'耐心等候',eff:'heal15pct',effDesc:''});
  ['paper_note_1','paper_note_2','paper_note_3'].forEach(id=>delete E[id]);
  delete G.CARDS.miaohui;delete G.CARDS.koushao;delete G.CARDS.yusan;
  ['teacher_cotton_jacket','blank','paper_blue_1','paper_blue_2','paper_blue_3'].forEach(id=>delete G.TALENTS[id]);
  G.EVENT_LIST=Object.keys(E);
})();

// 事件 11—17：校园事件改为带选择意义的奖励，不再只是单项属性数值。
(function(){
  const E=G.EVENTS;if(!E)return;
  const set=(id,i,p)=>{if(E[id]&&E[id].opts&&E[id].opts[i])Object.assign(E[id].opts[i],p);};
  set('daily_extra_01',0,{text:'接受对方请吃饭',eff:'meal_invite',effDesc:'回复100%生命，情商+1'});
  set('daily_extra_01',1,{text:'先把饭卡研究明白',eff:'nothing',effDesc:'无额外效果'});
  set('daily_extra_02',0,{text:'把纸条交给班长',eff:'next_battle_shield30',effDesc:'下场考试开场获得30点护盾'});
  set('daily_extra_02',1,{text:'认真研究纸条',eff:'unlock_paper_study',effDesc:'解锁【纸条研究】任务与3个后续纸条事件'});
  set('daily_extra_03',0,{text:'帮忙整理，但最多删两类',eff:'remove_two_types',effDesc:'最多选择两种卡牌，移除卡组中全部同类卡'});
  set('daily_extra_03',1,{text:'随便拿一张试卷改名字',eff:'rename_test_paper',effDesc:'选择一张牌，转化为随机同类型角色卡牌'});
  set('daily_extra_04',0,{text:'把机会留给以后',eff:'talent_random_plus3',effDesc:'天赋随机次数+3'});
  set('daily_extra_04',1,{text:'把老师的好意收下',eff:'teacher_cotton_jacket',effDesc:'获得蓝色天赋【老师小棉袄】'});
  set('daily_extra_05',0,{text:'吹哨集合',eff:'get_whistle',effDesc:'获得用具卡【口哨】'});
  set('daily_extra_05',1,{text:'先把口哨藏起来',eff:'nothing',effDesc:'无额外效果'});
  set('daily_extra_06',0,{text:'借出红笔',eff:'get_card_miaohui',effDesc:'获得逻辑卡【描绘】'});
  set('daily_extra_06',1,{text:'试试空白答案',eff:'blank_talent',effDesc:'获得紫色天赋【空白】'});
  set('daily_extra_07',0,{text:'请搭档帮忙升级',eff:'upgrade_partner_event',effDesc:'选择一个已有搭档提升1级'});
  set('daily_extra_07',1,{text:'私吞雨伞',eff:'get_umbrella',effDesc:'获得用具卡【雨伞】'});

  const paper=[
    ['paper_note_1','纸条研究：第一张','你在下一间教室又发现一张纸条。它没有署名，只有一句“别忘了把重点圈出来”。','研究这张纸条','纸条的内容依旧没有署名，却让你获得了一点蓝色的学习灵感。'],
    ['paper_note_2','纸条研究：第二张','第二张纸条夹在一本练习册里，写着“真正的重点，通常不会自己发光”。','继续研究','你把这句话记了下来，决定以后看到重点先别急着给它加特效。'],
    ['paper_note_3','纸条研究：第三张','第三张纸条藏在讲义背面，内容只有一句：“如果看不懂，先看三遍。”这建议朴素得让人无法反驳。','完成研究','三张纸条终于集齐，纸条研究暂时结题。']
  ];
  paper.forEach(([id,name,desc,choice,after])=>{E[id]={id,name,emoji:'🗒️',desc,dialogue:[desc,'你认真确认了纸条没有夹带作业，也没有要求你立刻参加竞选班干部。','这次研究看起来没有标准答案，但至少纸张表现得十分诚恳。'],paperStudy:true,opts:[{text:choice,eff:'paper_study_reward',effDesc:'获得一个随机蓝色天赋；完成全部纸条研究后额外获得紫色天赋',afterText:after}]};});
  G.EVENT_LIST=Object.keys(E);

  G.CARDS.miaohui={id:'miaohui',name:'描绘',type:'logic',cost:1,q:'green',desc:'造成1倍情商伤害。上色。',dmgStat:'eq',dmgMult:1,applyColor:true};
  G.CARDS.liangrensanzu=G.CARDS.liangrensanzu||{id:'liangrensanzu',name:'俩人三足',type:'idea',cost:0,q:'green',desc:'选择弃置2张手牌，然后摸3张牌。移除。',selfDiscardCount:2,drawCards:3,exhaust:true};
  G.CARDS.koushao={id:'koushao',name:'口哨',type:'tool',cost:1,q:'green',desc:'打出逻辑卡时，使所有费用最高的手牌消耗-1。',whistle:true};
  G.CARDS.yusan={id:'yusan',name:'雨伞',type:'tool',cost:1,q:'green',desc:'造成伤害的50%转化为护盾；每次获得的护盾不超过体魄的2倍。',umbrella:true};
  G.CARD_ITEMS['小君的奶茶']=G.CARD_ITEMS['小君的奶茶']||{id:'小君的奶茶',name:'小君的奶茶',q:'blue',emoji:'🧋',desc:'打出该牌时，回复1点体力，然后摸1张牌。',energyDraw:1};
  G.TALENTS.teacher_cotton_jacket={id:'teacher_cotton_jacket',name:'老师小棉袄',quality:'蓝色',emoji:'🧥',desc:'开始战斗时，先对目标造成15%最大生命值伤害；非大考时改为25%。',tier:'uncommon',eventOnly:true};
  G.TALENTS.blank={id:'blank',name:'空白',quality:'紫色',emoji:'⬜',desc:'没有任何效果。',tier:'epic',eventOnly:true};
  G.TALENTS.paper_blue_1={id:'paper_blue_1',name:'纸上谈兵',quality:'蓝色',emoji:'📄',desc:'纸条研究奖励天赋。',tier:'uncommon',eventOnly:true};
  G.TALENTS.paper_blue_2={id:'paper_blue_2',name:'重点标记',quality:'蓝色',emoji:'🔖',desc:'纸条研究奖励天赋。',tier:'uncommon',eventOnly:true};
  G.TALENTS.paper_blue_3={id:'paper_blue_3',name:'留痕',quality:'蓝色',emoji:'✍️',desc:'纸条研究奖励天赋。',tier:'uncommon',eventOnly:true};
})();

// 最终清理：撤销本轮误编号的 11—17 内容。
(function(){
  const E=G.EVENTS;if(!E)return;
  if(E.daily_extra_05?.opts?.length>=2){
    Object.assign(E.daily_extra_05.opts[0],{text:'拿走那张借条',eff:'get_card_youjieyouhuan',effDesc:'获得思路卡【有借有还】'});
    Object.assign(E.daily_extra_05.opts[1],{text:'私吞口哨',eff:'get_whistle',effDesc:'获得用具卡【口哨】'});
  }
  return; // 正式事件层已在本文件前方写入，不再执行旧回滚。
  const restore=(id,a,b)=>{if(!E[id]||!E[id].opts)return;Object.assign(E[id].opts[0],a);if(E[id].opts[1])Object.assign(E[id].opts[1],b);};
  restore('daily_extra_01',{text:'归还饭卡',eff:'eq1',effDesc:''},{text:'先吃饭再说',eff:'heal15pct',effDesc:''});
  restore('daily_extra_02',{text:'交给班长',eff:'randomIdea',effDesc:''},{text:'留下研究',eff:'int1',effDesc:''});
  restore('daily_extra_03',{text:'帮忙整理',eff:'eq1',effDesc:''},{text:'研究风向',eff:'randomLogic',effDesc:''});
  restore('daily_extra_04',{text:'递上备用粉笔',eff:'int1',effDesc:''},{text:'交出三角粉笔',eff:'randomIdea',effDesc:''});
  restore('daily_extra_05',{text:'交给老师',eff:'physique1',effDesc:''},{text:'吹哨集合',eff:'eq1',effDesc:''});
  restore('daily_extra_06',{text:'认真完成',eff:'int1',effDesc:''},{text:'保留空白',eff:'gold10',effDesc:''});
  restore('daily_extra_07',{text:'送同学回家',eff:'eq1',effDesc:''},{text:'耐心等候',eff:'heal15pct',effDesc:''});
  ['paper_note_1','paper_note_2','paper_note_3'].forEach(id=>delete E[id]);
  delete G.CARDS.miaohui;delete G.CARDS.koushao;delete G.CARDS.yusan;
  ['teacher_cotton_jacket','blank','paper_blue_1','paper_blue_2','paper_blue_3'].forEach(id=>delete G.TALENTS[id]);
  G.EVENT_LIST=Object.keys(E);
})();
