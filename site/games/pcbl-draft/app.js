const $=id=>document.getElementById(id);
const state={roster:[],choices:[],required:{H:7,P:5}};
const rarityRank=[...cards].map(c=>({...c,overall:(c.fb+c.brk+c.off)/3})).sort((a,b)=>b.overall-a.overall||a.id-b.id);
const rarityById={};
rarityRank.forEach((c,i)=>{const p=i/rarityRank.length;rarityById[c.id]=p<.10?'LEGENDARY':p<.30?'EPIC':p<.50?'RARE':'COMMON'});
const rarityClass=r=>r.toLowerCase();
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function remaining(type){return state.roster.filter(c=>c.type===type).length}
function needed(type){return state.required[type]-remaining(type)}
function available(){return cards.filter(c=>{if(state.roster.some(x=>x.id===c.id))return false; const h=remaining('H'),p=remaining('P'); if(h>=7&&c.type==='H')return false;if(p>=5&&c.type==='P')return false;return true})}
function makeChoices(){
 const pool=available(); const h=needed('H'),p=needed('P');
 let targetTypes=[];
 if(h===0) targetTypes=['P','P','P']; else if(p===0) targetTypes=['H','H','H']; else {targetTypes=shuffle([h>0?'H':'P',p>0?'P':'H',Math.random()<.5?'H':'P']);}
 const picked=[];
 targetTypes.forEach(t=>{const opts=pool.filter(c=>c.type===t&&!picked.some(x=>x.id===c.id)); if(opts.length)picked.push(weightedPick(opts));});
 while(picked.length<3){const opts=pool.filter(c=>!picked.some(x=>x.id===c.id)); if(!opts.length)break;picked.push(weightedPick(opts));}
 state.choices=shuffle(picked); renderChoices();
}
function weightedPick(pool){
 // Keep elite cards scarce: rarity influences appearance probability without making them impossible.
 const weights={COMMON:1,RARE:.58,EPIC:.27,LEGENDARY:.10};
 let total=pool.reduce((s,c)=>s+weights[rarityById[c.id]],0),r=Math.random()*total;
 for(const c of pool){r-=weights[rarityById[c.id]];if(r<=0)return c}return pool[pool.length-1]
}
function renderChoices(){
 const box=$('choices');box.innerHTML='';
 state.choices.forEach(c=>{const r=rarityById[c.id];const d=document.createElement('article');d.className='choice';d.innerHTML=`<img src="${c.img}" alt="${c.player} — ${c.title}"><div class="card-info"><div class="tagline"><span class="rarity ${rarityClass(r)}">${r}</span><span class="type">${c.type==='H'?'HITTER':'PITCHER'} · S${c.season}</span></div><div class="player">${c.player}</div><div class="title">${c.title} · ${c.series}</div><div class="mini-stats"><div><span>FB</span><b>${c.fb}</b></div><div><span>BRK</span><b>${c.brk}</b></div><div><span>OFF</span><b>${c.off}</b></div></div></div>`;d.onclick=()=>draft(c);box.appendChild(d)});
 $('rarity-note').textContent='LEGENDARY CARDS ARE RARE BY DESIGN';
}
function draft(c){if(state.roster.length>=12)return; if(c.type==='H'&&remaining('H')>=7||c.type==='P'&&remaining('P')>=5)return;state.roster.push(c);update();if(state.roster.length===12)finish();else makeChoices()}
function update(){
 const n=state.roster.length; $('pick-label').textContent=n<12?`PICK ${n+1} OF 12`:'DRAFT COMPLETE';$('progress-text').textContent=`${n} / 12`;$('progress-bar').style.width=`${n/12*100}%`;$('hit-need').textContent=`H ${remaining('H')} / 7`;$('pitch-need').textContent=`P ${remaining('P')} / 5`;$('roster-count').textContent=`${n}/12`;
 const hitterGrid=$('hitter-roster'), pitcherGrid=$('pitcher-roster');hitterGrid.innerHTML='';pitcherGrid.innerHTML='';state.roster.forEach(c=>{const d=document.createElement('div');d.className='roster-card';d.innerHTML=`<img src="${c.img}" alt="${c.player}"><div class="rc-type">${c.type==='H'?'HITTER':'PITCHER'} · ${rarityById[c.id]}</div><div class="rc-info">${c.player}</div>`;(c.type==='H'?hitterGrid:pitcherGrid).appendChild(d)});$('hitter-roster-count').textContent=`${remaining('H')} / 7`;$('pitcher-roster-count').textContent=`${remaining('P')} / 5`;
 const vals=['fb','brk','off'];vals.forEach(v=>$(v==='fb'?'avg-fb':v==='brk'?'avg-brk':'avg-off').textContent=n?(state.roster.reduce((s,c)=>s+c[v],0)/n).toFixed(1):'—');
 const seasons=new Set(state.roster.map(c=>c.season)).size,series=new Set(state.roster.map(c=>c.series)).size,total=state.roster.reduce((s,c)=>s+c.fb+c.brk+c.off,0);
 const seasonBonus=n?Math.max(0,(seasons-1)*2.5):0,seriesBonus=n?Math.max(0,(series-1)*1.25):0,ratingBonus=n?total/300:0;
 $('bonus-season').textContent=`+${seasonBonus.toFixed(1)}`;$('season-detail').textContent=`${seasons} season${seasons===1?'':'s'}`;$('bonus-series').textContent=`+${seriesBonus.toFixed(1)}`;$('series-detail').textContent=`${series} series`;$('bonus-rating').textContent=`+${ratingBonus.toFixed(1)}`;$('rating-detail').textContent=`${total} rating points`;
 $('roster-status').textContent=n===0?'Draft your first card.':`${remaining('H')} hitters · ${remaining('P')} pitchers`;
}
function finish(){
 const avg=(v)=>state.roster.reduce((s,c)=>s+c[v],0)/12;const seasons=new Set(state.roster.map(c=>c.season)).size,series=new Set(state.roster.map(c=>c.series)).size,total=state.roster.reduce((s,c)=>s+c.fb+c.brk+c.off,0);const score=(avg('fb')+avg('brk')+avg('off'))/3+(seasons-1)*2.5+(series-1)*1.25+total/300;$('final-score').textContent=score.toFixed(1);$('final-summary').textContent=`${seasons} seasons · ${series} series · ${total} combined rating points · 7 hitters / 5 pitchers`;$('final-panel').classList.remove('hidden');$('final-panel').scrollIntoView({behavior:'smooth',block:'center'});}
function reset(){state.roster=[];state.choices=[];$('final-panel').classList.add('hidden');update();makeChoices();window.scrollTo({top:0,behavior:'smooth'})}
function saveDraftRoster(){
 const ids=state.roster.map(c=>c.id);
 if(ids.length!==12||state.roster.filter(c=>c.type==='H').length!==7||state.roster.filter(c=>c.type==='P').length!==5)return false;
 try{localStorage.setItem('pcblDraftRoster',JSON.stringify(ids));return true}catch(_){return false}
}
$('singleplayer').onclick=()=>{saveDraftRoster();window.location.href='../attax/?draft=1'};
$('online').onclick=()=>{saveDraftRoster();window.location.href='../attax/?draft=1&online=1'};
$('restart').onclick=reset;$('rules-btn').onclick=()=>$('rules').classList.remove('hidden');$('close-rules').onclick=()=>$('rules').classList.add('hidden');$('rules').onclick=e=>{if(e.target.id==='rules')$('rules').classList.add('hidden')};
update();makeChoices();
