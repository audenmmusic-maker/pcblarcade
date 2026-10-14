(()=>{'use strict';
const $=id=>document.getElementById(id),canvas=$('view'),player=$('player'),pose=$('pose'),video=$('referenceVideo');
const MOTIONS={
 swing:{stages:['Setup','Gather','Plant','Turn','Contact','Extension','Finish','Settle'],times:[0,.22,.39,.48,.57,.67,.84,1]},
 pitch:{stages:['Set','Lift','Balance','Hand Break','Stride','Cocking','Acceleration','Release','Deceleration','Finish'],times:[0,.14,.30,.45,.60,.74,.88,1,1.16,1.42]},
 neutral:{stages:['Standing'],times:[0]}
};
const swingReferenceTimes={Auden:[.05,.16,.28,.34,.39,.48,.70,.95],Jarvis:[.40,.64,.86,.94,1.00,1.08,1.27,1.50],Najee:[.65,1.08,1.18,1.23,1.27,1.32,1.46,1.72],Jason:[.65,.95,1.12,1.19,1.25,1.34,1.55,1.78],Coel:[0,.18,.34,.46,.58,.78,1.10,1.40]};
const pitchReferenceTimes={
 Auden:[.35,.82,1.28,1.72,2.18,2.72,3.10,3.48,4.05,4.72],
 Jarvis:[.08,.30,.54,.76,.98,1.17,1.35,1.52,1.82,2.18],
 Jason:[.20,.58,.96,1.28,1.60,1.88,2.16,2.43,2.72,3.16],
 Najee:[.18,.60,.95,1.20,1.42,1.56,1.67,1.78,2.05,2.52]
};
const pitchFiles={Auden:'AUDEN PITCHING MOTION (FROM BEHIND).mp4',Jarvis:'JARVIS PITCHING MOTION (FROM BEHIND).mp4',Jason:'JASON PITCHING MOTION (FROM BEHIND).mp4',Najee:'NAJEE PITCHING MOTION (FROM BEHIND).mp4'};
const pitchPreviewMs={Auden:1680,Jason:1760,Jarvis:1500,Najee:1180,Coel:1020};
let engine,angle=.18,zoom=15.0,down=false,lastX=0,paused=false,phase=0,last=performance.now(),lastSeek=0;
try{engine=PCBL3D.create(canvas)}catch(e){$('error').textContent='WebGL could not start: '+e.message}
function motion(){return MOTIONS[pose.value]||MOTIONS.neutral}
function maxPhase(){const m=motion();return m.times[m.times.length-1]||0}
function resize(){if(!engine)return;const r=$('stage').getBoundingClientRect();engine.renderer.setSize(r.width,r.height,false);engine.camera.aspect=r.width/r.height}new ResizeObserver(resize).observe($('stage'));resize();
function referenceData(){
 if(pose.value==='pitch')return pitchReferenceTimes[player.value]||null;
 if(pose.value==='swing')return swingReferenceTimes[player.value]||null;
 return null;
}
function referenceTime(){const a=referenceData(),m=motion();if(!a||a.length<2)return 0;let i=0;while(i<m.times.length-2&&phase>m.times[i+1])i++;const den=m.times[i+1]-m.times[i]||1;return a[i]+(a[i+1]-a[i])*Math.max(0,Math.min(1,(phase-m.times[i])/den))}
function seekReference(){if(video.readyState>=1&&$('videoPanel').classList.contains('open')&&referenceData())video.currentTime=referenceTime()}
function refreshReference(){
 let src='',note='';
 if(pose.value==='swing'){src='assets/swing-references/'+player.value.toLowerCase()+'.mp4';note=player.value==='Coel'?'Coel’s swing is generalized as requested: an obvious sweep and more weight over the planted front leg. The cropped clip is retained for appearance reference.':'Reference alignment is approximate. Pause or scrub to compare stance, stride, contact, extension and finish.'}
 else if(pose.value==='pitch'&&pitchFiles[player.value]){src='assets/pitch-references/'+pitchFiles[player.value];note='Rear-view pitching reference. Compare balance, stride direction, hip/shoulder separation, arm slot, release and back-leg follow-through.'}
 else if(pose.value==='pitch'){note='No dedicated Coel clip was supplied. His delivery is intentionally a compact football-like step-and-throw, while still using baseball release/deceleration mechanics.'}
 else note='Standing pose has no motion reference.';
 if(video.getAttribute('src')!==src){video.src=src;video.load()}$('referenceNote').textContent=note;$('reference').disabled=!src;if(!src)$('videoPanel').classList.remove('open');
}
function caption(){
 if(pose.value==='pitch'){const hand=PCBL_SHOW_DATA.players[player.value]._meta.throws==='L'?'LEFT':'RIGHT';return player.value.toUpperCase()+' · '+hand+'-HANDED DELIVERY'+(pitchFiles[player.value]?' · REFERENCE-BUILT':' · FOOTBALL-LIKE CUSTOM');}
 if(pose.value==='swing'){const hand=PCBL_SHOW_DATA.players[player.value]._meta.bats==='L'?'LEFT':'RIGHT';return player.value.toUpperCase()+' · '+hand+'-HANDED · '+(player.value==='Najee'?'LEFT-HAND RELEASE':player.value==='Coel'?'RIGHT-HAND RELEASE':'TWO-HAND FINISH');}
 return player.value.toUpperCase()+' · CHARACTER MODEL';
}
function rebuildPhases(){
 const root=$('phases'),m=motion();root.innerHTML='';m.stages.forEach((name,i)=>{const b=document.createElement('button');b.textContent=name;b.onclick=()=>{paused=true;showPause();phase=m.times[i];$('timeline').value=Math.round(phase/maxPhase()*1000)||0;seekReference()};root.append(b)});
}
function loadMotion(reset=true){if(reset)phase=0;refreshReference();rebuildPhases();$('caption').textContent=caption();$('timeline').value=0}
player.onchange=()=>loadMotion(true);pose.onchange=()=>loadMotion(true);loadMotion(true);
function showPause(){$('play').textContent=paused?'Play':'Pause'}$('play').onclick=()=>{paused=!paused;showPause()};$('reference').onclick=()=>{if($('reference').disabled)return;$('videoPanel').classList.toggle('open');seekReference()};
$('timeline').oninput=e=>{paused=true;showPause();phase=(+e.target.value/1000)*maxPhase();seekReference()};document.querySelectorAll('[data-angle]').forEach(b=>b.onclick=()=>{angle=+b.dataset.angle;zoom=15.0});
canvas.onpointerdown=e=>{down=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId)};canvas.onpointermove=e=>{if(down){angle+=(e.clientX-lastX)*.008;lastX=e.clientX}};canvas.onpointerup=()=>down=false;canvas.onpointercancel=()=>down=false;canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(6,Math.min(19,zoom+e.deltaY*.006))},{passive:false});
function frame(now){
 const dt=Math.min(80,now-last);last=now;const m=motion(),mx=maxPhase();if(!paused&&pose.value!=='neutral'){const duration=pose.value==='swing'?PCBL3D.swingDuration(player.value):((pitchPreviewMs[player.value]||1100)*mx);phase+=dt/duration*mx*(+$('speed').value);if(pose.value==='pitch'&&phase>=mx){phase=mx;paused=true;showPause()}else if(phase>mx+600/PCBL3D.swingDuration(player.value))phase=0}
 const t=Math.min(mx,phase);if(engine)try{engine.renderPreview(player.value,pose.value,t,angle,zoom)}catch(e){$('error').textContent=e.message}
 let i=0;while(i<m.times.length-1&&t>=m.times[i+1]-.018)i++;$('phaseName').textContent=(m.stages[i]||m.stages.at(-1)).toUpperCase();$('timeline').value=mx?Math.round(t/mx*1000):0;[...$('phases').children].forEach((b,j)=>b.classList.toggle('active',j===i));if(!paused&&now-lastSeek>180){seekReference();lastSeek=now}requestAnimationFrame(frame)
}requestAnimationFrame(frame);
})();
