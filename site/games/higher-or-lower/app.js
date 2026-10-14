(() => {
  "use strict";

  const SHEET_ID="1-wyh_XRSgYGF8GIynNH1ZYvm__1bf0m7bs0WNNWRmuk";
  const SHEET_GID="0";
  const PLAYERS=[
    {key:"AUDEN",name:"Auden",fullName:"Auden Mitchell",column:1,playoffColumn:2,color:"#f2f2ec",face:"assets/faces/AUDEN.jpg"},
    {key:"JASON",name:"Jason",fullName:"Jason Diaz",column:3,playoffColumn:4,color:"#ff943d",face:"assets/faces/JASON.jpg"},
    {key:"JARVIS",name:"Jarvis",fullName:"Jarvis McGrath",column:5,playoffColumn:6,color:"#398cff",face:"assets/faces/JARVIS.jpg"},
    {key:"NAJEE",name:"Najee",fullName:"Najee Blackman",column:11,playoffColumn:12,color:"#ff414d",face:"assets/faces/NAJEE.jpg"},
    {key:"COEL",name:"Coel",fullName:"Coel Rioux-Jones",column:13,playoffColumn:14,color:"#41d279",face:"assets/faces/COEL.jpg"}
  ];
  const STATS=[
    {key:"BA",label:"BA",group:"hitting",format:decimal3,maxGap:.28},
    {key:"OBP",label:"OBP",group:"hitting",format:decimal3,maxGap:.25},
    {key:"SLG",label:"SLG",group:"hitting",format:decimal3,maxGap:.25},
    {key:"OPS",label:"OPS",group:"hitting",format:decimal3,maxGap:.25},
    {key:"K_RATE",label:"K%",group:"hitting",format:percent1,maxGap:.35},
    {key:"ERA",label:"ERA",group:"pitching",format:number2,maxGap:.38},
    {key:"WHIP",label:"WHIP",group:"pitching",format:number2,maxGap:.30},
    {key:"K3",label:"K/3",group:"pitching",format:number2,maxGap:.30},
    {key:"BB3",label:"BB/3",group:"pitching",format:number2,maxGap:.38}
  ];
  const SEED_SPECS=[
    ["OPS","AUDEN","CAREER","JARVIS","CAREER"],
    ["BA","AUDEN","SEASON 1","JARVIS","SEASON 3"],
    ["OBP","NAJEE","SEASON 2","NAJEE","SEASON 3"]
  ];
  const MODES={
    classic:{description:"Career and individual-season matchups can appear in the same 10-round game."},
    career:{description:"Every matchup uses complete career numbers: career against career."},
    seasons:{description:"Every card uses one specific season. Career totals are removed."},
    timeline:{description:"Follow one player through time by comparing career totals and individual seasons."},
    nailbiters:{description:"Only the closest eligible numbers make the cut. Expect brutal decisions."}
  };

  const dom={
    status:document.getElementById("sheetStatus"),pool:document.getElementById("statPool"),seasonType:document.getElementById("seasonType"),mode:document.getElementById("gameMode"),modeHelp:document.getElementById("modeHelp"),start:document.getElementById("startButton"),game:document.getElementById("gameSection"),
    roundTitle:document.getElementById("roundTitle"),score:document.getElementById("scoreValue"),streak:document.getElementById("streakValue"),best:document.getElementById("bestValue"),restart:document.getElementById("restartButton"),progress:document.getElementById("roundProgress"),
    referenceCard:document.getElementById("referenceCard"),referenceSample:document.getElementById("referenceSample"),referenceSegment:document.getElementById("referenceSegment"),referenceFace:document.getElementById("referenceFace"),referenceStat:document.getElementById("referenceStat"),referenceName:document.getElementById("referenceName"),referenceValue:document.getElementById("referenceValue"),
    targetCard:document.getElementById("targetCard"),targetSample:document.getElementById("targetSample"),targetSegment:document.getElementById("targetSegment"),targetFace:document.getElementById("targetFace"),targetStat:document.getElementById("targetStat"),targetName:document.getElementById("targetName"),targetValue:document.getElementById("targetValue"),statName:document.getElementById("statName"),question:document.getElementById("questionText"),
    answerButtons:document.getElementById("answerButtons"),answerResult:document.getElementById("answerResult"),resultKicker:document.getElementById("resultKicker"),resultStatement:document.getElementById("resultStatement"),resultDetail:document.getElementById("resultDetail"),next:document.getElementById("nextButton"),
    modal:document.getElementById("finishModal"),finalScore:document.getElementById("finalScore"),finishGrade:document.getElementById("finishGrade"),finishMessage:document.getElementById("finishMessage"),playAgain:document.getElementById("playAgainButton"),share:document.getElementById("shareButton")
  };
  const state={blocks:null,pairs:[],deck:[],round:0,score:0,streak:0,bestStreak:0,answered:false,filter:"all",seasonType:"regular",mode:"classic",lastDeckKeys:[],lastAnswerPattern:""};

  function cleanNumber(value) {
    if (typeof value==="number") return Number.isFinite(value)?value:null;
    const text=String(value??"").trim().replace(/\.$/,"");
    if (!text || /^(X+|-|N\/A)$/i.test(text)) return null;
    if (/^-?\d+(\.\d+)?%$/.test(text)) return Number.parseFloat(text)/100;
    const number=Number.parseFloat(text);
    return Number.isFinite(number)?number:null;
  }
  function ratio(a,b) { return Number.isFinite(a)&&Number.isFinite(b)&&b!==0?a/b:null; }
  function decimal3(value) { return value.toFixed(3).replace(/^0/,""); }
  function number2(value) { return value.toFixed(2); }
  function percent1(value) { return `${(value*100).toFixed(1)}%`; }
  function canonicalLabel(label) {
    const text=String(label||"").trim().toUpperCase();
    if (!text || text.includes("TWR") || text.includes("TWO-WAY") || text==="K/BB") return null;
    if (text==="K RATE") return "K_RATE";
    if (text==="K/3") return "K3";
    return text.replace(/[^A-Z0-9]+/g,"_").replace(/^_|_$/g,"");
  }
  function findLabel(rows,start,end,wanted) { for(let i=start;i<end;i+=1) if(String(rows[i]?.[0]||"").trim().toUpperCase()===wanted) return i; return -1; }
  function readSection(rows,start,end,column) {
    const output={};
    for(let i=start;i<end;i+=1) { const key=canonicalLabel(rows[i]?.[0]); if(!key||key==="HITTING"||key==="PITCHING"||key.startsWith("SEASON")) continue; const value=cleanNumber(rows[i]?.[column]); if(value!=null) output[key]=value; }
    return output;
  }
  function derive(hitting,pitching) {
    const h={...hitting},p={...pitching};
    if(!Number.isFinite(h.BA)) h.BA=ratio(h.H,h.AB);
    if(!Number.isFinite(h.OBP)&&h.PA) h.OBP=((h.H||0)+(h.BB||0)+(h.HBP||0))/h.PA;
    if(!Number.isFinite(h.SLG)&&h.AB) h.SLG=((h.H||0)+(h["2B"]||0)+2*(h["3B"]||0)+3*(h.HR||0))/h.AB;
    if(!Number.isFinite(h.OPS)&&Number.isFinite(h.OBP)&&Number.isFinite(h.SLG)) h.OPS=h.OBP+h.SLG;
    if(!Number.isFinite(h.K_RATE)) h.K_RATE=ratio(h.K,h.PA);
    if(!Number.isFinite(p.K3)&&p.IP) p.K3=(p.K||0)*3/p.IP;
    if(!Number.isFinite(p.BB3)&&p.IP) p.BB3=(p.BB||0)*3/p.IP;
    return {hitting:h,pitching:p};
  }
  function parseSheet(inputRows) {
    const rows=inputRows.map((row)=>Array.from({length:16},(_,index)=>row?.[index]??""));
    const markers=[];
    rows.forEach((row,index)=>{const label=String(row[0]||"").trim().toUpperCase();if(label==="CAREER"||/^SEASON \d+$/.test(label))markers.push({label,index});});
    const blocks={};
    markers.forEach((marker,index)=>{
      const end=markers[index+1]?.index??rows.length,hittingIndex=findLabel(rows,marker.index,end,"HITTING"),pitchingIndex=findLabel(rows,marker.index,end,"PITCHING");
      if(hittingIndex<0||pitchingIndex<0)return;
      blocks[marker.label]=PLAYERS.flatMap((player)=>[
        {...player,segment:"REGULAR SEASON",...derive(readSection(rows,hittingIndex+1,pitchingIndex,player.column),readSection(rows,pitchingIndex+1,end,player.column))},
        {...player,segment:"PLAYOFFS",...derive(readSection(rows,hittingIndex+1,pitchingIndex,player.playoffColumn),readSection(rows,pitchingIndex+1,end,player.playoffColumn))}
      ]);
    });
    if(!blocks.CAREER) throw new Error("PCBL career data could not be read.");
    return blocks;
  }
  function loadLiveSheet() {
    return new Promise((resolve,reject)=>{
      const callback=`pcblHigherLower_${Date.now()}_${Math.floor(Math.random()*10000)}`,script=document.createElement("script");
      const timeout=window.setTimeout(()=>cleanup(new Error("PCBL sheet timed out.")),10000);
      function cleanup(error,rows){window.clearTimeout(timeout);script.remove();try{delete window[callback];}catch(_){}error?reject(error):resolve(rows);}
      window[callback]=(response)=>{try{if(!response?.table?.rows)throw new Error("PCBL sheet returned no rows.");const width=Math.max(16,response.table.cols?.length||0);const rows=response.table.rows.map((row)=>Array.from({length:width},(_,index)=>{const cell=row.c?.[index];return cell?(cell.f??cell.v??""):"";}));cleanup(null,rows);}catch(error){cleanup(error);}};
      script.onerror=()=>cleanup(new Error("PCBL sheet could not be reached."));
      script.src=`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?${new URLSearchParams({gid:SHEET_GID,tqx:`out:json;responseHandler:${callback}`})}`;
      document.head.appendChild(script);
    });
  }
  function randomUnit(){
    try{if(window.crypto?.getRandomValues){const value=new Uint32Array(1);window.crypto.getRandomValues(value);return value[0]/4294967296;}}catch(_){}
    return Math.random();
  }
  function shuffle(items){const output=[...items];for(let i=output.length-1;i>0;i-=1){const j=Math.floor(randomUnit()*(i+1));[output[i],output[j]]=[output[j],output[i]];}return output;}
  function entryFor(stat,player,block){
    if(!player)return null;
    const value=player[stat.group]?.[stat.key],sample=stat.group==="hitting"?player.hitting.PA:player.pitching.IP;
    if(!Number.isFinite(value)||value<0||!Number.isFinite(sample)||sample<=0)return null;
    return {stat,player,block,segment:player.segment,value};
  }
  function profileKey(entry){return `${entry.player.key}:${entry.block}:${entry.segment}`;}
  function pairKey(a,b){return `${a.stat.key}|${[profileKey(a),profileKey(b)].sort().join("|")}`;}
  function segmentAllowed(player,seasonType){return seasonType==="both"||(seasonType==="regular"&&player.segment==="REGULAR SEASON")||(seasonType==="playoffs"&&player.segment==="PLAYOFFS");}
  function applyMode(pool,mode){
    if(mode==="career")return pool.filter((pair)=>pair.a.block==="CAREER"&&pair.b.block==="CAREER");
    if(mode==="seasons")return pool.filter((pair)=>pair.a.block!=="CAREER"&&pair.b.block!=="CAREER");
    if(mode==="timeline")return pool.filter((pair)=>pair.a.player.key===pair.b.player.key&&pair.a.block!==pair.b.block);
    if(mode==="nailbiters")return pool.slice(0,Math.max(10,Math.ceil(pool.length*.2)));
    return pool;
  }
  function buildPairPool(filter="all",seasonType="regular",mode="classic") {
    const stats=STATS.filter((stat)=>filter==="all"||stat.group===filter),entries=[];
    Object.entries(state.blocks).forEach(([block,players])=>stats.forEach((stat)=>players.forEach((player)=>{if(!segmentAllowed(player,seasonType))return;const entry=entryFor(stat,player,block);if(entry)entries.push(entry);}))); 
    const pairs=[],seen=new Set();
    stats.forEach((stat)=>{
      const group=entries.filter((entry)=>entry.stat.key===stat.key);
      for(let i=0;i<group.length;i+=1)for(let j=i+1;j<group.length;j+=1){
        const a=group[i],b=group[j];
        if(profileKey(a)===profileKey(b))continue;
        if(a.value===b.value)continue;
        const midpoint=(a.value+b.value)/2,gap=Math.abs(a.value-b.value)/midpoint;
        const gapLimit=stat.maxGap*((seasonType==="playoffs"&&mode==="career")?1.6:1);
        if(gap<.002||gap>gapLimit)continue;
        const key=pairKey(a,b);if(seen.has(key))continue;seen.add(key);
        pairs.push({a,b,gap,key,seed:false});
      }
    });
    SEED_SPECS.forEach(([statKey,aPlayer,aBlock,bPlayer,bBlock])=>{
      if(seasonType==="playoffs")return;
      const stat=STATS.find((item)=>item.key===statKey);if(!stat||!(filter==="all"||stat.group===filter))return;
      const seedSegment=seasonType==="playoffs"?"PLAYOFFS":"REGULAR SEASON";
      const findEntry=(playerKey,block)=>entryFor(stat,state.blocks[block]?.find((player)=>player.key===playerKey&&player.segment===seedSegment),block);
      const a=findEntry(aPlayer,aBlock),b=findEntry(bPlayer,bBlock);if(!a||!b||a.value===b.value)return;
      const key=pairKey(a,b),existing=pairs.find((pair)=>pair.key===key);
      if(existing)existing.seed=true;else pairs.push({a,b,gap:Math.abs(a.value-b.value)/((a.value+b.value)/2),key,seed:true});
    });
    return applyMode(pairs.sort((a,b)=>a.gap-b.gap),mode);
  }
  function makeDeck(pool) {
    const chosen=[],chosenKeys=new Set(),recentKeys=new Set(state.lastDeckKeys),statCounts={},playerCounts={};
    const add=(pair)=>{chosen.push(pair);chosenKeys.add(pair.key);statCounts[pair.a.stat.key]=(statCounts[pair.a.stat.key]||0)+1;new Set([pair.a.player.key,pair.b.player.key]).forEach((key)=>{playerCounts[key]=(playerCounts[key]||0)+1;});};
    const passes=[
      {avoidRecent:true,maxStat:2,maxPlayer:4},
      {avoidRecent:true,maxStat:3,maxPlayer:6},
      {avoidRecent:false,maxStat:3,maxPlayer:7},
      {avoidRecent:false,maxStat:10,maxPlayer:10}
    ];
    for(const pass of passes){
      for(const pair of shuffle(pool)){
        if(chosen.length>=10)break;
        if(chosenKeys.has(pair.key)||(pass.avoidRecent&&recentKeys.has(pair.key)))continue;
        if((statCounts[pair.a.stat.key]||0)>=pass.maxStat)continue;
        const players=new Set([pair.a.player.key,pair.b.player.key]);
        if([...players].some((key)=>(playerCounts[key]||0)>=pass.maxPlayer))continue;
        add(pair);
      }
      if(chosen.length>=10)break;
    }
    const higherCount=4+Math.floor(randomUnit()*3),answers=shuffle([...Array(higherCount).fill("H"),...Array(10-higherCount).fill("L")]);
    let guard=0;
    while((answers.join("")===state.lastAnswerPattern||/(H{4}|L{4})/.test(answers.join("")))&&guard<40){answers.splice(0,answers.length,...shuffle(answers));guard+=1;}
    const deck=shuffle(chosen.slice(0,10)).map((pair,index)=>{
      const targetHigher=answers[index]==="H",currentlyHigher=pair.b.value>pair.a.value;
      return targetHigher===currentlyHigher?pair:{...pair,a:pair.b,b:pair.a};
    });
    state.lastDeckKeys=deck.map((pair)=>pair.key);state.lastAnswerPattern=answers.join("");
    return deck;
  }
  function segmentLabel(segment){return segment==="PLAYOFFS"?"POSTSEASON":segment;}
  function escapeHTML(value){return String(value).replace(/[&<>"']/g,(character)=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[character]);}
  function questionProfile(entry){return `<span class="question-profile" style="--profile-color:${escapeHTML(entry.player.color)}">${escapeHTML(entry.player.name.toUpperCase())} ${escapeHTML(entry.block)}</span> <em>${escapeHTML(segmentLabel(entry.segment))}</em>`;}
  function bestKey(){return `pcbl-higher-lower-best-${state.mode}-${state.filter}-${state.seasonType}`;}
  function showBest(){try{const best=Number(localStorage.getItem(bestKey()));dom.best.textContent=best?`${best}/10`:"—";}catch(_){dom.best.textContent="—";}}
  function saveBest(){try{const key=bestKey(),best=Number(localStorage.getItem(key))||0;if(state.score>best)localStorage.setItem(key,String(state.score));}catch(_){}}
  function renderRound(){
    const pair=state.deck[state.round],a=pair.a,b=pair.b,stat=a.stat;
    state.answered=false;dom.roundTitle.textContent=`ROUND ${state.round+1} OF 10`;dom.score.textContent=state.score;dom.streak.textContent=state.streak;dom.progress.style.width=`${(state.round+1)*10}%`;
    dom.referenceCard.style.setProperty("--player",a.player.color);dom.referenceSample.textContent=a.block;dom.referenceSegment.textContent=segmentLabel(a.segment);dom.referenceFace.src=a.player.face;dom.referenceFace.alt=a.player.fullName;dom.referenceStat.textContent=stat.label;dom.referenceName.textContent=a.player.name.toUpperCase();dom.referenceValue.textContent=stat.format(a.value);
    dom.targetCard.style.setProperty("--player",b.player.color);dom.targetCard.className="player-card target-card";dom.targetSample.textContent=b.block;dom.targetSegment.textContent=segmentLabel(b.segment);dom.targetFace.src=b.player.face;dom.targetFace.alt=b.player.fullName;dom.targetStat.textContent=stat.label;dom.targetName.textContent=b.player.name.toUpperCase();dom.targetValue.textContent="?";
    dom.statName.textContent=stat.label;dom.question.innerHTML=`IS ${questionProfile(b)} <b>${escapeHTML(stat.label)}</b> HIGHER OR LOWER THAN ${questionProfile(a)}?`;
    dom.answerButtons.hidden=false;dom.answerButtons.querySelectorAll("button").forEach((button)=>{button.disabled=false;button.className="";});dom.answerResult.hidden=true;dom.answerResult.className="answer-result";
  }
  function answer(choice){
    if(state.answered)return;state.answered=true;
    const pair=state.deck[state.round],correctAnswer=pair.b.value>pair.a.value?"higher":"lower",correct=choice===correctAnswer,stat=pair.a.stat;
    if(correct){state.score+=1;state.streak+=1;state.bestStreak=Math.max(state.bestStreak,state.streak);}else state.streak=0;
    dom.score.textContent=state.score;dom.streak.textContent=state.streak;dom.targetValue.textContent=stat.format(pair.b.value);dom.targetCard.classList.add("revealed",correct?"correct":"wrong");
    dom.answerButtons.querySelectorAll("button").forEach((button)=>{button.disabled=true;button.classList.toggle("selected",button.dataset.answer===choice);});dom.answerButtons.hidden=true;
    dom.answerResult.hidden=false;dom.answerResult.classList.toggle("wrong",!correct);dom.resultKicker.textContent=correct?"CORRECT":"INCORRECT";
    dom.resultStatement.textContent=`${pair.b.player.name.toUpperCase()} WAS ${correctAnswer.toUpperCase()}.`;
    const difference=Math.abs(pair.b.value-pair.a.value);dom.resultDetail.textContent=`${stat.format(pair.a.value)} vs. ${stat.format(pair.b.value)} — a difference of ${stat.format(difference)}.`;
    dom.next.textContent=state.round===9?"SEE FINAL SCORE →":"NEXT MATCHUP →";dom.next.focus();
  }
  function finish(){saveBest();showBest();dom.finalScore.textContent=state.score;const grade=state.score===10?"PERFECT GAME":state.score>=8?"STAT SAVANT":state.score>=6?"SOLID KNOWLEDGE":state.score>=4?"ON THE BOARD":"BACK TO THE SHEET";dom.finishGrade.textContent=grade;dom.finishMessage.textContent=`Best streak: ${state.bestStreak}. You answered ${state.score} of 10 close PCBL stat matchups correctly.`;dom.modal.hidden=false;dom.playAgain.focus();}
  function next(){if(state.round>=9){finish();return;}state.round+=1;renderRound();dom.game.scrollIntoView({behavior:"smooth",block:"start"});}
  function startGame(){state.filter=dom.pool.value;state.seasonType=dom.seasonType.value;state.mode=dom.mode.value;state.pairs=buildPairPool(state.filter,state.seasonType,state.mode);if(state.pairs.length<10){dom.status.className="live-chip fallback";dom.status.innerHTML="<i></i> NOT ENOUGH MATCHUPS FOR THESE FILTERS";return;}state.deck=makeDeck(state.pairs);Object.assign(state,{round:0,score:0,streak:0,bestStreak:0,answered:false});showBest();renderRound();dom.modal.hidden=true;dom.game.hidden=false;dom.game.scrollIntoView({behavior:"smooth",block:"start"});}
  async function shareScore(){const text=`I scored ${state.score}/10 on PCBL Higher or Lower. Best streak: ${state.bestStreak}.`;try{await navigator.clipboard.writeText(text);dom.share.textContent="COPIED";setTimeout(()=>{dom.share.textContent="COPY SCORE";},1500);}catch(_){window.prompt("Copy score:",text);}}
  async function init(){
    state.blocks=parseSheet(window.PCBL_SNAPSHOT_ROWS||[]);state.pairs=buildPairPool("all","regular","classic");dom.status.className="live-chip fallback";dom.status.innerHTML=`<i></i> ${state.pairs.length} SAVED MATCHUPS READY`;
    try{const live=parseSheet(await loadLiveSheet());if(Object.keys(live).length>=Object.keys(state.blocks).length){state.blocks=live;state.pairs=buildPairPool("all","regular","classic");dom.status.className="live-chip live";dom.status.innerHTML=`<i></i> ${state.pairs.length} LIVE MATCHUPS READY`;}}catch(_){}
  }

  function updateModeHelp(){dom.modeHelp.textContent=MODES[dom.mode.value]?.description||MODES.classic.description;}
  dom.start.addEventListener("click",startGame);dom.restart.addEventListener("click",startGame);dom.mode.addEventListener("change",updateModeHelp);dom.answerButtons.querySelectorAll("button").forEach((button)=>button.addEventListener("click",()=>answer(button.dataset.answer)));dom.next.addEventListener("click",next);dom.playAgain.addEventListener("click",startGame);dom.share.addEventListener("click",shareScore);
  window.PCBL_HIGHER_LOWER={parseSheet,buildPairPool,makeDeck,state,STATS,SEED_SPECS,MODES};
  updateModeHelp();
  init().catch((error)=>{dom.status.className="live-chip fallback";dom.status.innerHTML=`<i></i> ${error?.message||"PCBL DATA ERROR"}`;});
})();
