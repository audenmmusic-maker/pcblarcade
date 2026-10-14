(()=>{'use strict';
const D=window.PCBL_SHOW_DATA, names=['Auden','Jason','Jarvis','Najee','Coel'], seasons=['ALL TIME','S1','S2','S3'];
const $=id=>document.getElementById(id), screens=[...document.querySelectorAll('.screen')];
const PARKS={
 'PCBL MAIN FIELD':{img:'assets/parks/main_preview.jpg',sub:'STUY TOWN · 72 LF / 81 CF / 72 RF · LOW WALL',type:'main'},
 'POLO RINK':{img:'assets/parks/polo_preview.jpg',sub:'STUY TOWN COURT · 62 LINES / 209 CF · WALL + NET',type:'polo'},
 'MURPHY PARK':{img:'assets/parks/murphy_preview.jpg',sub:'E 17TH / FDR · 100 LINES / 130 CF · UNIFORM OUTFIELD FENCE',type:'murphy'}
};

const ZONE={ballNorm:.068,strikeBallNorm:.110,pciRadius:0.144};
// Global gameplay balance. Alpha 84 adds a small second velo bump and a much
// larger horizontal-break multiplier while preserving the Alpha 81 contact nerf.
// Player/pitch-specific vertical tuning lives in pitchMovement() below.
const GAMEPLAY_TUNING={pitchVeloBoost:9,contactPenalty:4,pciScale:1.105,timingScale:0.462,perfectMs:7,goodMs:10,horizontalBreakScale:1.72,verticalBreakScale:1.34};
function tunedPitchVelo(v){return Math.max(1,(+v||0)+GAMEPLAY_TUNING.pitchVeloBoost)}
const FIELD_ZONE_RULES={
 'PCBL MAIN FIELD':{outEnd:50.5,doubleStart:58,tripleRFMinX:-40,tripleRFMaxX:-23,tripleRFMinZ:72.5},
 // Murphy/Polo keep the pitcher-out boundary near the mound, but the back edge
 // of the 1B zone is pushed ~8 ft deeper so shallow outfield balls stay singles.
 'MURPHY PARK':{outEnd:50.5,doubleStart:76,tripleStart:114,tripleMinAngle:-.32,tripleMaxAngle:-.16,rcfWallStart:120,rcfWallMin:-.30,rcfWallMax:-.16},
 'POLO RINK':{outEnd:50.5,doubleStart:70,deepTripleStart:170,deepCFAngle:.24,tripleRFStart:165,tripleRFMinAngle:-.30,tripleRFMaxAngle:-.18}
};
window.PCBL_FIELD_ZONE_RULES=FIELD_ZONE_RULES;

const PITCH_PROFILES={
 // Time from first visible movement to release. Follow-through continues to 1.42.
 Auden:{windup:1760},
 Jason:{windup:1820},
 Jarvis:{windup:1580},
 Najee:{windup:1240},
 Coel:{windup:1080}
};
function pitchMotionState(name,m,now){
 const p=PITCH_PROFILES[name]||PITCH_PROFILES.Coel;
 if(!m||!m.windupStart||String(m.reaction||'').startsWith('angry'))return null;
 let raw=(now-m.windupStart)/p.windup;
 let delivery=m.delivery||'overhand',slot=delivery==='submarine'?.70:delivery==='sidearm'?.02:0;
 // Never snap back to the set pose while this pitch is still active. The
 // delivery is one pass and the pitcher holds the authored finish until the
 // result clears the pitch lifecycle.
 if(raw>1.42)return {kind:'pitch',t:1.42,delivery,slot,profile:p,heldFinish:true};
 return {kind:'pitch',t:clamp(raw,0,1.42),delivery,slot,profile:p,heldFinish:false};
}

function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function lerp(a,b,t){return a+(b-a)*t}
function circleOverlapFraction(d,R,r){
 if(d>=R+r)return 0;if(d<=Math.abs(R-r))return R>=r?1:Math.min(1,(R*R)/(r*r));
 const a1=Math.acos(clamp((d*d+r*r-R*R)/(2*d*r),-1,1)),a2=Math.acos(clamp((d*d+R*R-r*r)/(2*d*R),-1,1));
 const area=r*r*a1+R*R*a2-.5*Math.sqrt(Math.max(0,(-d+r+R)*(d+r-R)*(d-r+R)*(d+r+R)));return clamp(area/(Math.PI*r*r),0,1);
}
function swingAdjustedRatings(r,type){let contact=+r.contact||0,power=+r.power||0;if(type==='contact'){contact+=5;power-=5}else if(type==='power'){contact-=5;power+=5}return{contact:clamp(contact,1,99),power:clamp(power,1,99)}}
function easeOutCubic(t){return 1-Math.pow(1-t,3)}
function easeInOutQuad(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}
function normBatPose(name,pose,now){
 if(pose&&typeof pose==='object')return pose;
 if(String(pose||'idle')==='hr'){const start=pitchAnim?.hrCelebrationAt||now,dur=pitchAnim?.hrCelebrationDuration||4800;return{kind:'hr',t:clamp((now-start)/dur,0,1),type:pitchAnim?.swingType||'regular'}}
 if(String(pose||'idle').startsWith('flip'))return {kind:String(pose),t:1};
 if(String(pose||'idle').startsWith('swing')){
   let start=pitchAnim?.swingAt||now,type=pitchAnim?.swingType||'regular',dur=window.PCBL3D.swingDuration(name,type);
   return {kind:'swing',t:clamp((now-start)/dur,0,1),type};
 }
 return {kind:String(pose||'idle'),t:0,type:'regular'};
}
function swingContactMs(name,type='regular'){return window.PCBL3D.swingDuration(name,type)*.58}

let peerLibraryPromise=null;
function loadPeerScript(src){return new Promise((resolve,reject)=>{const existing=[...document.scripts].find(x=>x.src===src);if(existing){if(typeof Peer==='function'){resolve(true);return}existing.addEventListener('load',()=>typeof Peer==='function'?resolve(true):reject(new Error('PeerJS load failed')),{once:true});existing.addEventListener('error',()=>reject(new Error('PeerJS network load failed')),{once:true});return}const tag=document.createElement('script');tag.src=src;tag.async=true;tag.onload=()=>typeof Peer==='function'?resolve(true):reject(new Error('PeerJS loaded without Peer'));tag.onerror=()=>reject(new Error('PeerJS network load failed'));document.head.appendChild(tag)})}
function ensurePeerLibrary(){
 if(typeof Peer==='function')return Promise.resolve(true);
 if(peerLibraryPromise)return peerLibraryPromise;
 peerLibraryPromise=(async()=>{let last;for(const src of ['https://cdn.jsdelivr.net/npm/peerjs@1.5.5/dist/peerjs.min.js','https://unpkg.com/peerjs@1.5.5/dist/peerjs.min.js']){try{await loadPeerScript(src);if(typeof Peer==='function')return true}catch(e){last=e}}throw last||new Error('PeerJS failed to load')})().catch(err=>{peerLibraryPromise=null;throw err});
 return peerLibraryPromise;
}
function warmPeerLibrary(){ensurePeerLibrary().catch(()=>{})}
const MATCHMAKER='pcbl-the-show-public-v3';
let peer=null,coordPeer=null,coordConn=null,matchConn=null,waiting=[],queueTicket=null,role=null,matchCode=null,matchmakingGeneration=0,matchmakingRetryTimer=null,coordinatorProbeTimer=null,matchLinkTimer=null,mainPeerWatchdogTimer=null,pendingIncomingMatch=null,coordinatorClaimInFlight=false,queueJoinInFlight=false;
let localChoice={season:'ALL TIME',name:'Auden',locked:false,vote:null,skip:false},remoteChoice={season:'ALL TIME',name:null,locked:false,vote:null,skip:false};
let setup=null,game=null,pitchAnim=null,pci={x:.5,y:.5},aim={x:.5,y:.5},selectedPitch=0,introTimer=null,introRAF=null,gameRAF=null,gameLoopRunning=false,renderFailCount=0,pitchResolveTimer=null,pitchClearTimer=null,swingResolveTimer=null,swingWatchdogTimer=null,battedResultTimer=null,hrLandingTimer=null,timingFeedbackTimer=null,calloutTimer=null,lastTimingPitchId=null,lastContactFeedback=null;
let singlePlayer=false,cpuPitchTimer=null,cpuSwingTimer=null;
let gamePaused=false,pauseStarted=0,pauseRequest=null,pauseSequence=0,cameraHeight=0,cameraZoom=1,gameVolume=.70,audioContext=null,ambience=null,hitAudio=null,menuMusic=null;
let lastResolvedPacket=null;
let gameAmbienceActive=false;
let versusIntroAudio=null,versusIntroRAFHandle=0,versusIntroStart=0,menuLoopRAFHandle=0,menuLoopStart=0,versusIntroReady=false;
const VERSUS_BPM=91,VERSUS_BAR_MS=60000/VERSUS_BPM*4;
const queueStatus=$('queueStatus'), readyBtn=$('readyBtn');
const computerContinue=$('computerContinue');
const startGameBtn=$('startGameBtn');
function resizeCanvasToDisplay(canvas){if(!canvas)return;const w=Math.max(1,canvas.clientWidth||canvas.width),h=Math.max(1,canvas.clientHeight||canvas.height);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}}
function fitFixedRatioCanvas(canvas,ratio=16/9){if(!canvas||!canvas.parentElement)return;const host=canvas.parentElement,w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);canvas.style.left='50%';canvas.style.top='50%';canvas.style.right='auto';canvas.style.bottom='auto';canvas.style.transform='translate(-50%,-50%)';if(w/h>ratio){canvas.style.width='100%';canvas.style.height='auto'}else{canvas.style.width='auto';canvas.style.height='100%'}}
function makeStarfield(count,w,h,seed=1337){let a=seed>>>0,out=[];for(let i=0;i<count;i++){a=(1664525*a+1013904223)>>>0;const x=(a%10000)/10000; a=(1664525*a+1013904223)>>>0; const y=(a%10000)/10000; a=(1664525*a+1013904223)>>>0; const s=1+((a%3000)/3000)*2.4; out.push({x:x*w,y:y*h*.72,s})}return out}
function stopVersusIntroAudio(){if(versusIntroAudio){try{versusIntroAudio.pause();versusIntroAudio.currentTime=0}catch{}}}
function drawPixelBatter(ctx,x,y,phase,opts={}){const flip=opts.flip?-1:1,body=opts.body||'#f9f0de',accent=opts.accent||'#ffde59',bat=opts.bat||'#d3a15f';ctx.save();ctx.translate(x,y);ctx.scale(flip,1);const step=Math.sin(phase*Math.PI*2)*2.2;ctx.fillStyle=body;ctx.fillRect(-4,-18,8,12);ctx.fillRect(-3+Math.sin(phase*Math.PI*2)*1.2,-6,3,11);ctx.fillRect(1-step*.08,-6,3,11);ctx.fillStyle=body;ctx.fillRect(-8,-16,4,10);ctx.fillRect(4,-16,4,10);ctx.fillStyle=accent;ctx.fillRect(-5,-24,10,7);ctx.fillStyle=body;ctx.fillRect(-4,-31,8,7);ctx.fillStyle=bat;const batAng=phase<.32?-1.1+phase*1.2:phase<.56?-.72+phase*3.1:phase<.76?.95+(phase-.56)*1.6:1.28+(phase-.76)*3.1;ctx.save();ctx.translate(4,-15);ctx.rotate(batAng);ctx.fillRect(0,-2,20,4);ctx.restore();if(opts.flipBat&&phase>.72){ctx.fillStyle=bat;ctx.save();ctx.translate(11+phase*30,-32-phase*22);ctx.rotate(-1.4+phase*3.2);ctx.fillRect(0,-2,18,4);ctx.restore()}ctx.restore()}
function drawRetroFieldPanel(ctx,x,y,w,h,label,palette,beat,kind){ctx.save();ctx.translate(x,y);ctx.fillStyle=palette.sky1;ctx.fillRect(0,0,w,h);ctx.fillStyle=palette.sky2;ctx.fillRect(0,h*.46,w,h*.2);ctx.fillStyle=palette.hill;ctx.fillRect(0,h*.62,w,h*.09);ctx.fillStyle=palette.field;ctx.beginPath();ctx.moveTo(0,h*.72);ctx.lineTo(w*.2,h*.58);ctx.lineTo(w*.8,h*.58);ctx.lineTo(w,h*.72);ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.fill();ctx.strokeStyle='#f7f2de';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(w*.5,h*.86);ctx.lineTo(w*.24,h*.64);ctx.moveTo(w*.5,h*.86);ctx.lineTo(w*.76,h*.64);ctx.stroke();ctx.fillStyle='#ff8f2b';ctx.beginPath();ctx.moveTo(w*.5,h*.86);ctx.lineTo(w*.53,h*.82);ctx.lineTo(w*.53,h*.79);ctx.lineTo(w*.47,h*.79);ctx.lineTo(w*.47,h*.82);ctx.closePath();ctx.fill();ctx.fillStyle=palette.wall;ctx.fillRect(w*.11,h*.49,w*.78,6);ctx.fillStyle='#f7f2de';ctx.font='900 16px Arial';ctx.textAlign='center';ctx.fillText(label,w*.5,24);const t=beat%1,baseX=w*.5,baseY=h*.86,swing=Math.min(1,beat*1.1%1);drawPixelBatter(ctx,baseX,baseY,swing,{body:palette.body,accent:palette.accent,bat:palette.bat,flipBat:true});let ballX=baseX,ballY=baseY-18;if(swing>.30){let p=(swing-.30)/.70;p=Math.min(1,p);let arcs={main:[w*.20,-h*.36],polo:[0,-h*.44],murphy:[w*.14,-h*.30]}[kind]||[w*.16,-h*.33];ballX=baseX+arcs[0]*p;ballY=baseY-20+arcs[1]*Math.sin(p*Math.PI*.9)-h*.12*p;ctx.fillStyle='#cbff87';ctx.fillRect(ballX,ballY,5,5)}ctx.fillStyle='#111';ctx.fillRect(baseX-18,baseY+3,36,6);ctx.restore()}
function drawPixelCrossBuilding(ctx,x,y,s,rot=0,tone='#8e463d'){
 ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(rot);const long=Math.round(30*s),thick=Math.max(4,Math.round(8*s));
 // dark roof shadow gives the low-res aerial blocks some depth
 ctx.fillStyle='#2d2728';ctx.fillRect(-long/2+2,-thick/2+3,long,thick);ctx.fillRect(-thick/2+2,-long/2+3,thick,long);
 ctx.fillStyle=tone;ctx.fillRect(-long/2,-thick/2,long,thick);ctx.fillRect(-thick/2,-long/2,thick,long);
 ctx.fillStyle='#a85a4f';ctx.fillRect(-long/2+2,-thick/2+1,Math.max(2,long-4),Math.max(2,thick-3));ctx.fillRect(-thick/2+1,-long/2+2,Math.max(2,thick-3),Math.max(2,long-4));
 // tiny roof/mechanical pixels
 ctx.fillStyle='#554245';ctx.fillRect(-2,-2,4,4);ctx.fillRect(Math.round(long*.18),-2,3,3);ctx.restore();
}
function drawStuyTownMap(ctx,w,h,sec){
 // The layout is based on the actual Stuyvesant Town / Peter Cooper Village
 // superblock organization: Stuy Town south of E 20th around the Oval and
 // loop roads; Peter Cooper Village north with looser angled slabs.
 const baseW=520,baseH=340,camT=(sec%18)/18;
 ctx.save();
 // slow diagonal drone flyover across the whole campus rather than a strip.
 const zoom=1.44+.035*Math.sin(camT*Math.PI*2),panX=24+(camT-.5)*18,panY=-42+Math.sin(camT*Math.PI*2)*5;
 ctx.translate(w/2,h/2);ctx.scale(zoom,zoom);ctx.rotate(-.035+.018*Math.sin(sec*.16));ctx.translate(-baseW/2+panX,-baseH/2+panY);
 // surrounding Manhattan blocks / East River
 ctx.fillStyle='#1a2431';ctx.fillRect(-70,-50,baseW+140,baseH+100);
 ctx.fillStyle='#20384e';ctx.fillRect(446,-50,150,baseH+100); // East River
 ctx.fillStyle='#244e68';for(let yy=-30;yy<baseH+40;yy+=12){ctx.fillRect(463,yy,72,2)}
 // avenue / FDR edges
 ctx.fillStyle='#494b50';ctx.fillRect(12,-40,17,baseH+80);ctx.fillRect(424,-40,18,baseH+80);
 ctx.fillStyle='#77766f';ctx.fillRect(18,-40,3,baseH+80);ctx.fillRect(430,-40,3,baseH+80);
 // campus greens
 ctx.fillStyle='#275a3a';ctx.fillRect(31,14,391,306);
 ctx.fillStyle='#316b44';ctx.fillRect(38,24,375,288);
 // E 20th Street dividing Stuyvesant Town and Peter Cooper Village
 ctx.fillStyle='#65645e';ctx.fillRect(30,102,392,10);ctx.fillStyle='#393a3d';ctx.fillRect(30,106,392,3);
 // STUY TOWN loop roads / central oval, represented from the aerial plan
 ctx.strokeStyle='#77766f';ctx.lineWidth=8;ctx.beginPath();ctx.ellipse(236,215,160,85,0,0,Math.PI*2);ctx.stroke();
 ctx.strokeStyle='#44474a';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(236,215,160,85,0,0,Math.PI*2);ctx.stroke();
 ctx.strokeStyle='#77766f';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(74,210);ctx.bezierCurveTo(118,168,172,154,236,154);ctx.bezierCurveTo(304,154,356,171,396,211);ctx.stroke();
 ctx.beginPath();ctx.moveTo(76,235);ctx.bezierCurveTo(121,275,174,289,236,289);ctx.bezierCurveTo(298,289,353,276,397,234);ctx.stroke();
 // Stuyvesant Oval / central green
 ctx.fillStyle='#3f8652';ctx.beginPath();ctx.ellipse(236,214,54,33,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#b4aa7a';ctx.lineWidth=3;ctx.stroke();
 ctx.fillStyle='#2c6e42';ctx.beginPath();ctx.ellipse(236,214,36,20,0,0,Math.PI*2);ctx.fill();
 // paths through the oval and courtyards
 ctx.strokeStyle='#a49a72';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(183,214);ctx.lineTo(289,214);ctx.moveTo(236,181);ctx.lineTo(236,247);ctx.stroke();
 // Stuy Town cross-shaped buildings, arranged around courtyards / loops.
 const stuy=[
  [80,145,.90,-.05],[134,142,.86,.04],[192,137,.92,-.02],[281,137,.90,.02],[341,143,.88,-.05],[392,151,.82,.05],
  [67,191,.92,.05],[119,188,.90,-.03],[169,174,.85,.10],[303,174,.86,-.10],[352,187,.90,.04],[404,194,.88,-.04],
  [64,245,.90,-.04],[118,247,.92,.04],[167,262,.86,-.08],[303,261,.87,.08],[354,248,.92,-.03],[405,241,.88,.03],
  [87,293,.86,.04],[143,297,.88,-.04],[199,301,.82,.02],[274,301,.84,-.02],[332,296,.88,.04],[385,287,.86,-.04]
 ];
 stuy.forEach((b,i)=>drawPixelCrossBuilding(ctx,b[0],b[1],b[2],b[3],i%3===0?'#884039':'#91483e'));
 // Peter Cooper Village: buildings are more loosely spaced and often angled.
 const pcv=[
  [72,49,.84,-.20],[121,42,.88,.14],[169,59,.82,-.12],[224,42,.90,.16],[278,58,.86,-.18],[332,43,.88,.13],[382,62,.84,-.15],
  [93,86,.86,.18],[151,82,.82,-.16],[207,84,.88,.12],[268,82,.82,-.12],[325,85,.88,.15],[381,88,.84,-.18]
 ];
 pcv.forEach((b,i)=>drawPixelCrossBuilding(ctx,b[0],b[1],b[2],b[3],i%2?'#9a5148':'#8f473f'));
 // Peter Cooper curved local roads / cul-de-sac feel
 ctx.strokeStyle='#76756f';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(44,66);ctx.bezierCurveTo(123,15,190,26,233,62);ctx.bezierCurveTo(291,17,361,24,412,70);ctx.stroke();
 // courts / small playfields visible throughout the superblock
 const courts=[[104,219,24,15],[363,219,25,15],[107,276,28,15],[355,278,28,15],[190,83,22,13],[301,84,22,13]];
 courts.forEach((c,i)=>{ctx.fillStyle=i%2?'#3d7864':'#4a866f';ctx.fillRect(c[0]-c[2]/2,c[1]-c[3]/2,c[2],c[3]);ctx.strokeStyle='#b8d8c1';ctx.lineWidth=1;ctx.strokeRect(c[0]-c[2]/2,c[1]-c[3]/2,c[2],c[3])});
 // tree canopy clusters between buildings
 for(let i=0;i<145;i++){const a=(i*97)%419,b=(i*53)%287,tx=39+a,ty=25+b;if(ty>98&&ty<116)continue;if(Math.hypot(tx-236,(ty-214)*1.4)<62)continue;const rr=2+(i%4);ctx.fillStyle=i%3===0?'#183d28':i%3===1?'#1f5131':'#2b6540';ctx.fillRect(tx-rr/2,ty-rr/2,rr,rr)}
 // waterfront / FDR texture
 ctx.fillStyle='#25282d';for(let yy=0;yy<baseH;yy+=15)ctx.fillRect(428,yy,10,2);
 ctx.restore();
}
function drawStuyTownFlyover(ctx,w,h,sec){
 // Render the aerial scene at a deliberately low internal resolution, then
 // scale with smoothing disabled for a true 8-bit/pixel-video look.
 const pw=480,ph=270,owner=ctx.canvas;let pixel=owner._stuyPixelCanvas;if(!pixel){pixel=document.createElement('canvas');pixel.width=pw;pixel.height=ph;owner._stuyPixelCanvas=pixel}
 const pc=pixel.getContext('2d');pc.imageSmoothingEnabled=false;pc.clearRect(0,0,pw,ph);
 const sky=pc.createLinearGradient(0,0,0,ph);sky.addColorStop(0,'#0b1325');sky.addColorStop(1,'#05090e');pc.fillStyle=sky;pc.fillRect(0,0,pw,ph);
 pc.save();pc.scale(pw/520,ph/340);drawStuyTownMap(pc,520,340,sec);pc.restore();
 // subtle night/dusk grade + CRT lines
 pc.fillStyle='rgba(10,16,35,.12)';pc.fillRect(0,0,pw,ph);pc.fillStyle='rgba(0,0,0,.11)';for(let y=0;y<ph;y+=3)pc.fillRect(0,y,pw,1);
 ctx.imageSmoothingEnabled=false;ctx.drawImage(pixel,0,0,pw,ph,0,0,w,h);
}
function renderVersusIntroFrame(ts){
 const canvas=$('versusIntroCanvas');if(!canvas||!$('screen-versus-intro')?.classList.contains('active'))return;
 fitFixedRatioCanvas(canvas,16/9);if(canvas.width!==1280||canvas.height!==720){canvas.width=1280;canvas.height=720}const ctx=canvas.getContext('2d'),w=1280,h=720,sec=Math.max(0,ts-versusIntroStart)/1000,bar=VERSUS_BAR_MS/1000;
 ctx.clearRect(0,0,w,h);ctx.save();ctx.imageSmoothingEnabled=false;drawStuyTownFlyover(ctx,w,h,sec);ctx.restore();
 const title=$('versusIntroTitle');if(title){const onDrop=sec>=bar;const beat=(sec*VERSUS_BPM/60)%1;title.style.transform=`skewX(-9deg) scale(${onDrop?1.03+Math.max(0,.035-beat*.035):.96+sec/bar*.04})`;title.style.opacity=String(clamp(.55+sec*.5,0,1))}
 // one bar intro; START GAME arrives exactly as bar 2/drop begins
 if(sec>=bar&&!versusIntroReady){versusIntroReady=true;startGameBtn?.classList.remove('hidden')}
 versusIntroRAFHandle=requestAnimationFrame(renderVersusIntroFrame)
}

const NAV_ASSETS=[
 'assets/pcbl-logo.png',
 'assets/menu/stuytown-aerial-menu.jpg',
 'assets/parks/main_preview.jpg','assets/parks/polo_preview.jpg','assets/parks/murphy_preview.jpg',
 ...names.map(n=>`assets/players/${n.toLowerCase()}.jpg`)
];
let navAssetsPrimed=false;
function preloadImage(src){return new Promise(resolve=>{const im=new Image();im.decoding='async';im.onload=im.onerror=()=>resolve(src);im.src=src;if(im.complete)resolve(src)})}
function primeNavigationAssets(){if(navAssetsPrimed)return;navAssetsPrimed=true;NAV_ASSETS.forEach(src=>preloadImage(src));try{const a=new Audio('assets/audio/pcbl-versus-written-in-the-stars-8bit.ogg');a.preload='auto';a.load();const m=new Audio('assets/audio/pcbl-menu-beat.ogg');m.preload='auto';m.load()}catch{};setTimeout(warmPeerLibrary,0)}
function prepaintMenu(){const c=$('menuLoopCanvas');if(!c)return;resizeCanvasToDisplay(c);const ctx=c.getContext('2d');const w=c.width,h=c.height;ctx.clearRect(0,0,w,h);const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#0b0f1c');bg.addColorStop(1,'#020305');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);const third=w/3;drawRetroFieldPanel(ctx,0,0,third,h,'PCBL MAIN FIELD',{sky1:'#20366b',sky2:'#2f5bae',hill:'#1b2344',field:'#32945b',wall:'#fff141',body:'#fff3de',accent:'#ff5959',bat:'#c89d5d'},0,'main');drawRetroFieldPanel(ctx,third,0,third,h,'POLO RINK',{sky1:'#38307e',sky2:'#5b5fd3',hill:'#252551',field:'#30895e',wall:'#f4f4f4',body:'#fff3de',accent:'#55f1e8',bat:'#c89d5d'},.25,'polo');drawRetroFieldPanel(ctx,third*2,0,third,h,'MURPHY PARK',{sky1:'#5f2c4f',sky2:'#c74b5a',hill:'#442130',field:'#318f5d',wall:'#99a4b2',body:'#fff3de',accent:'#fff141',bat:'#c89d5d'},.52,'murphy');ctx.fillStyle='rgba(0,0,0,.34)';ctx.fillRect(0,0,w,h)}
function activateScreen(id){const target=$(id);if(!target)return;target.classList.add('active');for(const s of screens)if(s!==target)s.classList.remove('active');document.body.dataset.currentScreen=id}
function openVersusIntro(){
 versusIntroReady=false;startGameBtn?.classList.add('hidden');versusIntroStart=performance.now();const c=$('versusIntroCanvas');if(c){fitFixedRatioCanvas(c,16/9);c.width=1280;c.height=720;const cx=c.getContext('2d');cx.clearRect(0,0,1280,720);cx.save();cx.imageSmoothingEnabled=false;drawStuyTownFlyover(cx,1280,720,0);cx.restore()}show('screen-versus-intro');stopVersusIntroAudio();
 if(!versusIntroAudio){versusIntroAudio=new Audio('assets/audio/pcbl-versus-written-in-the-stars-8bit.ogg');versusIntroAudio.preload='auto';versusIntroAudio.loop=true}
 try{versusIntroAudio.currentTime=0;versusIntroAudio.volume=.48;versusIntroAudio.play().catch(()=>{})}catch{}
 cancelAnimationFrame(versusIntroRAFHandle);versusIntroRAFHandle=requestAnimationFrame(renderVersusIntroFrame)
}
function stopVersusIntro(){cancelAnimationFrame(versusIntroRAFHandle);versusIntroRAFHandle=0;stopVersusIntroAudio()}
function renderMenuLoopFrame(ts){return}
function startMenuLoop(){menuLoopStart=performance.now();cancelAnimationFrame(menuLoopRAFHandle);menuLoopRAFHandle=0}
function stopMenuLoop(){cancelAnimationFrame(menuLoopRAFHandle);menuLoopRAFHandle=0}
if(computerContinue)computerContinue.addEventListener('click',()=>{primeNavigationAssets();openVersusIntro()});if(startGameBtn)startGameBtn.addEventListener('click',()=>{stopVersusIntro();prepaintMenu();show('screen-menu');readyBtn?.focus()});
const MENU_MUSIC_SCREENS=new Set(['screen-menu','screen-select','screen-stadium']);
function ensureMenuMusic(){if(!menuMusic){menuMusic=new Audio('assets/audio/pcbl-menu-beat.ogg');menuMusic.preload='auto';menuMusic.loop=true;menuMusic.volume=.52*gameVolume}}
function startMenuMusic(){ensureMenuMusic();if(!menuMusic||gameVolume<=0)return;menuMusic.volume=.52*gameVolume;if(menuMusic.paused)menuMusic.play().catch(()=>{})}
function stopMenuMusic(reset=false){if(!menuMusic)return;try{menuMusic.pause();if(reset)menuMusic.currentTime=0}catch{}}
function setAmbienceActive(active){gameAmbienceActive=!!active;if(!audioContext||!ambience)return;const t=audioContext.currentTime;ambience.windGain.gain.setTargetAtTime(gameAmbienceActive?.052*gameVolume:0,t,.12);ambience.gustGain.gain.setTargetAtTime(gameAmbienceActive?.011*gameVolume:0,t,.12)}
function syncScreenAudio(id){
 const isGame=id==='screen-game';
 if(MENU_MUSIC_SCREENS.has(id)){setAmbienceActive(false);startMenuMusic();}
 else{stopMenuMusic(false);setAmbienceActive(isGame);}
}
function show(id){if(id==='screen-menu')prepaintMenu();const host=$('renderHost');if(host)host.classList.toggle('active',id==='screen-intro'||id==='screen-game');activateScreen(id);if(id!=='screen-versus-intro')stopVersusIntro();if(id==='screen-menu')startMenuLoop();else stopMenuLoop();syncScreenAudio(id)}
function status(t){queueStatus.textContent=t}
function setGameVolume(v){gameVolume=clamp(+v||0,0,1);if(hitAudio)hitAudio.volume=gameVolume*.88;if(menuMusic)menuMusic.volume=.52*gameVolume;if(audioContext&&ambience){const t=audioContext.currentTime;ambience.windGain.gain.setTargetAtTime(gameAmbienceActive?.052*gameVolume:0,t,.10);ambience.gustGain.gain.setTargetAtTime(gameAmbienceActive?.011*gameVolume:0,t,.10)}const out=$('gameVolumeValue');if(out)out.textContent=Math.round(gameVolume*100)+'%'}
function ensureGameAudio(){try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;if(!audioContext)audioContext=new AC();audioContext.resume?.();if(!hitAudio){hitAudio=new Audio('assets/audio/blitzball-hit.ogg');hitAudio.preload='auto'}if(!ambience){const len=audioContext.sampleRate*4,buffer=audioContext.createBuffer(1,len,audioContext.sampleRate),s=buffer.getChannelData(0);let last=0;for(let i=0;i<len;i++){const white=Math.random()*2-1;last=last*.970+white*.030;s[i]=last*.66+white*.34}const source=audioContext.createBufferSource(),filter=audioContext.createBiquadFilter(),windGain=audioContext.createGain();source.buffer=buffer;source.loop=true;filter.type='lowpass';filter.frequency.value=780;filter.Q.value=.38;windGain.gain.value=0;source.connect(filter).connect(windGain).connect(audioContext.destination);source.start();const gust=audioContext.createOscillator(),gustGain=audioContext.createGain();gust.type='sine';gust.frequency.value=.145;gustGain.gain.value=0;gust.connect(gustGain).connect(windGain.gain);gust.start();ambience={source,windGain,gust,gustGain}}setGameVolume(gameVolume);setAmbienceActive(!!$('screen-game')?.classList.contains('active'))}catch(_){}}
function playHitSound(){ensureGameAudio();if(!hitAudio||gameVolume<=0)return;try{hitAudio.pause();hitAudio.currentTime=0;hitAudio.volume=gameVolume*.92;hitAudio.play().catch(()=>{})}catch(_){}}
function updatePauseButton(){const b=$('pauseBtn');if(!b)return;b.disabled=!!pauseRequest&&!gamePaused;b.textContent=pauseRequest&&!gamePaused?'…':'Ⅱ';b.setAttribute?.('aria-label',pauseRequest&&!gamePaused?'Pause queued until play ends':'Pause game')}
function pauseSafe(){return !!game&&!game.over&&!pitchAnim&&!game.transitioning}
function pauseGame(){if(!game||game.over||gamePaused||!pauseSafe())return false;gamePaused=true;pauseStarted=Date.now();$('pauseMenu')?.classList.add('show');$('pauseMenu')?.setAttribute('aria-hidden','false');$('screen-game')?.classList.add('paused');updatePauseButton();return true}
function resumeGame(){if(!gamePaused)return false;const shift=Math.max(0,Date.now()-pauseStarted);gamePaused=false;if(pitchAnim){for(const k of ['windupStart','release','swingAt','reactionAt','hrCelebrationAt','hrCelebrationEndsAt'])if(Number.isFinite(pitchAnim[k]))pitchAnim[k]+=shift;if(pitchAnim.batted&&Number.isFinite(pitchAnim.batted.start))pitchAnim.batted.start+=shift}$('pauseMenu')?.classList.remove('show');$('pauseMenu')?.setAttribute('aria-hidden','true');$('screen-game')?.classList.remove('paused');ensureGameAudio();setAmbienceActive(true);updatePauseButton();return true}
function pauseStateToken(){if(!game)return `pregame-${matchCode||'none'}`;return `${matchCode||'match'}-${game.inning}-${game.half}-${game.outs}-${game.balls}-${game.strikes}-${pitchAnim?.id||'between'}`}
function maybeCommitPause(){if(singlePlayer||!pauseRequest||gamePaused)return;if(pauseRequest.committed){if(pauseSafe())pauseGame();return}if(!pauseSafe())return;if(!pauseRequest.localReady){pauseRequest.localReady=true;send({t:'pause_ready',token:pauseRequest.token})}if(pauseRequest.localReady&&pauseRequest.remoteReady){pauseRequest.committed=true;send({t:'pause_commit',token:pauseRequest.token});pauseGame()}}
function queueOnlinePause(token){if(singlePlayer||gamePaused)return;const t=String(token||pauseStateToken());if(!pauseRequest||pauseRequest.token!==t)pauseRequest={token:t,localReady:false,remoteReady:false,committed:false};updatePauseButton();maybeCommitPause()}
function requestPause(){if(!game||game.over)return;if(singlePlayer){if(pitchAnim||game.transitioning){showCall('PAUSE AVAILABLE AFTER PLAY',{hold:900});return}pauseGame();return}if(gamePaused){pauseRequest=null;send({t:'resume'});resumeGame();return}if(pauseRequest)return;const token=pauseStateToken();pauseSequence++;pauseRequest={token,localReady:false,remoteReady:false,committed:false};updatePauseButton();send({t:'pause_request',token});showCall(pauseSafe()?'PAUSING…':'PAUSE QUEUED AFTER PLAY',{hold:900});maybeCommitPause()}
function resumeSynchronized(){if(singlePlayer){pauseRequest=null;resumeGame();return}pauseRequest=null;send({t:'resume'});resumeGame();updatePauseButton()}
function togglePause(){requestPause()}
function code(){return Math.random().toString(36).slice(2,8).toUpperCase()}
function uid(){let k=localStorage.getItem('pcbl-show-client');if(!k){k='p-'+crypto.randomUUID();localStorage.setItem('pcbl-show-client',k)}return k}
function send(o){if(matchConn?.open)matchConn.send(o)}
function card(name,season){let p=D.players[name];let c=p?.[season],dnp=false;if(!c){c=p?.['ALL TIME'];dnp=true}return {...c,meta:p._meta,dnp}}
function seasonText(season,c){return c?.dnp?'CAREER BASE':season==='ALL TIME'?'CAREER':season}
function dec3(v){return Number.isFinite(+v)?(+v).toFixed(3).replace(/^0\./,'.'):'—'}
function dec2(v){return Number.isFinite(+v)?(+v).toFixed(2):'—'}
function whole(v){return Number.isFinite(+v)?String(Math.round(+v)):'—'}
function ipFmt(v){if(!Number.isFinite(+v))return '—';return Number.isInteger(+v)?String(+v):(+v).toFixed(1)}
function introPlayerStats(choice,side='left'){
 let c=card(choice.name,choice.season),x=c.raw,label=seasonText(choice.season,c);
 const metric=(k,v)=>`<span class="intro-metric"><small>${k}</small><b>${v}</b></span>`;
 return `<article class="intro-stat-card ${side}"><div class="intro-player-head"><strong>${choice.name.toUpperCase()}</strong><span>${label}</span></div>`+
 `<div class="intro-line"><span class="role">PITCHER (${label})</span>${metric('ERA',dec2(x.ERA))}${metric('WHIP',dec2(x.WHIP))}${metric('K/3',dec2(x.K3))}${metric('IP',ipFmt(x.IP))}</div>`+
 `<div class="intro-line"><span class="role">HITTER (${label})</span>${metric('AVG',dec3(x.AVG))}${metric('HR',whole(x.HR))}${metric('OPS',dec3(x.OPS))}${metric('K',whole(x.HK))}</div>`+
 (c.dnp?`<div class="intro-fallback">SELECTED SEASON HAS NO PLAYER LINE · CAREER BASE USED</div>`:'')+`</article>`;
}

// Card-facing ratings use a more generous sports-game presentation scale.
// Gameplay continues to read c.ratings directly; this transform is display-only.
function displayRating(v){
 const n=Number(v);if(!Number.isFinite(n))return 51;
 return clamp(Math.round(51+(n-30)*(48/69)),51,99);
}
function displayRatings(c){let r=c.ratings;return{contact:displayRating(r.contact),power:displayRating(r.power),vision:displayRating(r.vision),hr3:displayRating(r.hr3),h3:displayRating(r.h3),k3:displayRating(r.k3)}}
function overall(c){let r=displayRatings(c);return Math.round((r.contact+r.power+r.vision+r.hr3+r.h3+r.k3)/6)}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function initSelect(){renderTabs();renderRoster();renderCards()}
function renderTabs(){const root=$('seasonTabs');root.innerHTML='';seasons.forEach(s=>{let b=document.createElement('button');b.textContent=s==='ALL TIME'?'CAREER':s;b.className=s===localChoice.season?'active':'';b.onclick=()=>{if(localChoice.locked)return;localChoice.season=s;renderTabs();renderRoster();renderCards()};root.appendChild(b)})}
function renderRoster(){const r=$('rosterStrip');r.innerHTML='';names.forEach(n=>{let b=document.createElement('button');b.textContent=n.toUpperCase();b.className=n===localChoice.name?'active':'';b.onclick=()=>{if(localChoice.locked)return;localChoice.name=n;renderRoster();renderCards()};r.appendChild(b)})}
function playerCardHTML(name,season,remote=false){if(!name)return `<div class="card-season">OPPONENT</div><div class="card-name">WAITING…</div><div class="card-body"><div></div><div class="status">OTHER PLAYER IS SELECTING</div></div>`;let c=card(name,season),r=displayRatings(c),x=c.raw;return `<div class="card-season">${season==='ALL TIME'?'CAREER':season}${c.dnp?' · DNP / CAREER BASE':''}</div><div class="card-name">${name.toUpperCase()}</div><div class="card-body"><div class="portrait"><img src="assets/players/${name.toLowerCase()}.jpg" alt="${name}" decoding="async"></div><div class="ratings"><div class="card-overall"><span>OVR</span><b>${overall(c)}</b></div><div class="rating"><label>CONTACT</label><b>${r.contact}</b></div><div class="rating"><label>POWER</label><b>${r.power}</b></div><div class="rating"><label>VISION</label><b>${r.vision}</b></div><div class="rating"><label>HR/3</label><b>${r.hr3}</b></div><div class="rating"><label>H/3</label><b>${r.h3}</b></div><div class="rating"><label>K/3</label><b>${r.k3}</b></div><div class="rawline">AVG ${x.AVG.toFixed(3)} · OBP ${x.OBP.toFixed(3)} · SLG ${x.SLG.toFixed(3)}</div></div></div>`}
function renderCards(){$('myCard').innerHTML=playerCardHTML(localChoice.name,localChoice.season);$('oppCard').innerHTML=playerCardHTML(remoteChoice.name,remoteChoice.season,true);$('lockPlayer').textContent=localChoice.locked?'PLAYER LOCKED':'LOCK PLAYER';$('lockPlayer').disabled=localChoice.locked;$('selectState').textContent=remoteChoice.locked?(singlePlayer?'CPU LOCKED':'OPPONENT LOCKED'):'SELECT YOUR PLAYER'}
function openSelect(){localChoice={season:'ALL TIME',name:'Auden',locked:false,vote:null,skip:false};remoteChoice={season:'ALL TIME',name:null,locked:false,vote:null,skip:false};$('matchModeLabel').textContent=singlePlayer?'SINGLEPLAYER':'MATCH FOUND';show('screen-select');initSelect()}
function chooseCpuOpponent(){let season=localChoice.season,candidates=names.filter(n=>n!==localChoice.name&&D.players[n]?.[season]);if(!candidates.length)candidates=names.filter(n=>n!==localChoice.name);let rr=rng(hash(matchCode+localChoice.name+season)),name=candidates[Math.floor(rr()*candidates.length)]||names.find(n=>n!==localChoice.name);remoteChoice={season:D.players[name]?.[season]?season:'ALL TIME',name,locked:true,vote:null,skip:false}}
$('lockPlayer').onclick=()=>{if(localChoice.locked)return;localChoice.locked=true;if(singlePlayer){chooseCpuOpponent();renderCards();checkSelectionReady()}else{send({t:'choice',name:localChoice.name,season:localChoice.season,locked:true});renderCards();checkSelectionReady()}};
function checkSelectionReady(){if(localChoice.locked&&remoteChoice.locked){requestAnimationFrame(openStadium)}}
function openStadium(){show('screen-stadium');const parkTip=document.querySelector('#screen-stadium .topbar span');if(parkTip)parkTip.textContent=singlePlayer?'CHOOSE YOUR BALLPARK':'VOTE — COIN TOSS BREAKS A SPLIT';let root=$('stadiumGrid');root.innerHTML='';Object.entries(PARKS).forEach(([name,p])=>{let d=document.createElement('div');d.className='stadium-card';d.innerHTML=`<img src="${p.img}" decoding="async"><div class="shade"></div><div class="stadium-info"><h3>${name}</h3><p>${p.sub}</p></div>`;d.onclick=()=>votePark(name,d);root.appendChild(d)});$('stadiumStatus').textContent='CHOOSE A BALLPARK'}
function votePark(name,el){if(localChoice.vote)return;localChoice.vote=name;document.querySelectorAll('.stadium-card').forEach(x=>x.classList.remove('selected'));el.classList.add('selected');if(singlePlayer){remoteChoice.vote=name;$('stadiumStatus').textContent='BALLPARK SELECTED';const rr=rng(hash(matchCode+name+'cpu-home')),homeRole=rr()<.5?'single':'cpu';handleSetup({t:'setup',stadium:name,homeRole,matchCode});return}$('stadiumStatus').textContent='VOTE LOCKED · WAITING FOR OPPONENT';send({t:'vote',park:name});checkVotes()}
function checkVotes(){if(singlePlayer||!localChoice.vote||!remoteChoice.vote||role!=='host')return;let r=rng(hash(matchCode+localChoice.vote+remoteChoice.vote)),stadium=localChoice.vote===remoteChoice.vote?localChoice.vote:(r()<.5?localChoice.vote:remoteChoice.vote),homeRole=r()<.5?'host':'guest',pkg={t:'setup',stadium,homeRole,matchCode};handleSetup(pkg);send(pkg)}
function handleSetup(m){setup={stadium:m.stadium,homeRole:m.homeRole,localHome:singlePlayer?m.homeRole==='single':role===m.homeRole};requestAnimationFrame(openIntro)}
function openIntro(){localChoice.skip=false;remoteChoice.skip=false;$('skipCount').textContent=singlePlayer?'0/1':'0/2';$('introTitle').textContent=setup.stadium;$('introSub').textContent=`${localChoice.name.toUpperCase()} vs ${remoteChoice.name.toUpperCase()} · 3 INNINGS · 2 OUTS`;$('introStats').innerHTML=introPlayerStats(localChoice,'left')+introPlayerStats(remoteChoice,'right');try{const eng=ensure3D();eng.renderIntro({park:setup.stadium,a:localChoice.name,b:remoteChoice.name},0)}catch(err){console.warn('intro prepaint deferred',err)}show('screen-intro');drawIntro();clearTimeout(introTimer);introTimer=setTimeout(()=>beginGame(),9500)}
let render3D=null;
function ensure3D(){if(!render3D){if(!window.PCBL3D?.create)throw new Error('THREE.JS / WEBGL ENGINE NOT LOADED');render3D=window.PCBL3D.create($('gameCanvas'),'shared');if(!render3D)throw new Error('WEBGL ENGINE COULD NOT INITIALIZE')}return render3D}
function drawIntro(){let eng;try{eng=ensure3D()}catch(err){console.error('PCBL renderer startup error',err);$('introTitle').textContent='3D ENGINE FAILED TO LOAD';return}cancelAnimationFrame(introRAF);const start=performance.now();const loop=(t)=>{if(!document.getElementById('screen-intro').classList.contains('active'))return;let ok=false;try{ok=eng.renderIntro({park:setup.stadium,a:localChoice.name,b:remoteChoice.name},t-start)}catch(err){console.error('PCBL intro render error',err)}if(ok===false){const d=eng.diagnostic?.()||'FRAME FAILED';console.error('PCBL intro frame rejected:',d)}introRAF=requestAnimationFrame(loop)};introRAF=requestAnimationFrame(loop)}
$('skipIntro').onclick=()=>{if(localChoice.skip)return;localChoice.skip=true;if(singlePlayer){updateSkip();beginGame();return}send({t:'skip'});updateSkip();if(remoteChoice.skip)beginGame()};function updateSkip(){$('skipCount').textContent=singlePlayer?(localChoice.skip?'1/1':'0/1'):`${(localChoice.skip?1:0)+(remoteChoice.skip?1:0)}/2`}
function beginGame(){if(game)return;clearTimeout(introTimer);ensureGameAudio();cancelAnimationFrame(introRAF);let away=setup.localHome?remoteChoice:localChoice,home=setup.localHome?localChoice:remoteChoice,oppOwner=singlePlayer?'cpu':'remote';game={inning:1,half:0,outs:0,balls:0,strikes:0,bases:[0,0,0],score:{away:0,home:0},lines:{away:[],home:[]},hits:{away:0,home:0},hrs:{away:0,home:0},pa:{away:0,home:0},scorebook:[],away:{name:away.name,season:away.season,owner:setup.localHome?oppOwner:'local'},home:{name:home.name,season:home.season,owner:setup.localHome?'local':oppOwner},over:false,last:null,transitioning:false};
 const call=$('callout');call.classList.remove('show');call.textContent='';renderFailCount=0;
 // Hard handoff: clear every intro-only state before the first gameplay frame.
 $('introStats').innerHTML='';$('skipCount').textContent=singlePlayer?'0/1':'0/2';
 show('screen-game');fitHud();renderScore();
 try{const eng=ensure3D();eng.resetMatch?.();eng.prepareMatch?.(game[battingTeam()].name,game[pitchingTeam()].name);drawGameFrame(performance.now())}catch(err){console.warn('non-blocking 3D startup recovery',err)}
 startGameLoop();maybeCpuTurn();}
function battingTeam(){return game.half===0?'away':'home'} function pitchingTeam(){return game.half===0?'home':'away'}
function localBatting(){return game[battingTeam()].owner==='local'} function localPitching(){return game[pitchingTeam()].owner==='local'}
function cpuBatting(){return singlePlayer&&game?.[battingTeam()]?.owner==='cpu'} function cpuPitching(){return singlePlayer&&game?.[pitchingTeam()]?.owner==='cpu'}
function maybeCpuTurn(){if(!singlePlayer||!game||game.over||pitchAnim||gamePaused||pauseRequest)return;clearTimeout(cpuPitchTimer);if(cpuPitching()){cpuPitchTimer=setTimeout(cpuDeliverPitch,700+Math.floor(Math.random()*500))}}
function cpuPitchIndex(name,pitches,rr){if(name==='Jarvis'){let kn=pitches.findIndex(p=>p[0]==='KN');if(kn>=0&&rr()<.06)return kn}return Math.floor(rr()*pitches.length)}
function randNorm(rr){const u=Math.max(1e-7,rr()),v=rr();return Math.sqrt(-2*Math.log(u))*Math.cos(Math.PI*2*v)}
function commandSigma(ctrlRating){const effective=clamp((+ctrlRating||0)-8,0,99),lack=clamp((99-effective)/50,0,1);return .0045+.140*Math.pow(lack,1.34)}
function pitchMovement(code,breakRating,handed,delivery,rr,pitcherName=''){
 const b=clamp((breakRating-20)/79,0,1),mix=(a,z)=>lerp(a,z,b);let viewX=0,y=0,wobble=0;
 // HITTER-VIEW convention: +viewX = break to the hitter's RIGHT, -viewX = LEFT.
 // RHP glove-side breakers (SL/SLRV/CURV) therefore move RIGHT; RHP arm-side
 // pitches (FB tail/CH/SCREW) move LEFT. LHP movement mirrors automatically.
 if(code==='FB'){viewX=-handed*mix(2,10);y=mix(7,18)}
 else if(code==='CH'){viewX=-handed*mix(15,40);y=-mix(15,40)}
 else if(code==='SL'){viewX=handed*mix(22,54);y=-mix(5,19)}
 else if(code==='SLRV'){viewX=handed*mix(25,58);y=-mix(17,38)}
 else if(code==='CRV'||code==='CURV'){viewX=handed*mix(5,19);y=-mix(31,70)}
 else if(code==='SCREW'){viewX=-handed*mix(30,66);y=-mix(18,40)}
 else if(code==='KN'){
  // Jarvis' knuckleball should dance mostly UP/DOWN, not sweep sideways.
  // Keep a small unpredictable lateral flutter, but make the vertical action
  // dramatically larger so it visibly floats/drops on the way to the plate.
  const xAmp=mix(6,17),yAmp=mix(24,48);viewX=(rr()-.5)*2*xAmp;y=(rr()-.5)*2*yAmp;wobble=mix(.72,1.34)
 }
 else{viewX=-handed*mix(3,15);y=-mix(3,16)}
 if(delivery==='sidearm'){viewX*=1.10;y-=mix(2,7)}
 else if(delivery==='submarine'){viewX*=1.20;y-=mix(5,13)}
 // Pitcher/pitch-specific movement shapes. Horizontal shape preserves the
 // existing identity while Alpha 84 increases overall side-to-side break.
 let horizontalShape=1,verticalShape=1;
 if(pitcherName==='Auden'&&code==='FB')horizontalShape=1.48;
 else if(pitcherName==='Auden'&&code==='SLRV')horizontalShape=1.36;
 else if(pitcherName==='Jarvis'&&code==='FB')horizontalShape=1.46;
 else if(pitcherName==='Jarvis'&&code==='SL')horizontalShape=1.38;
 else if(pitcherName==='Jarvis'&&(code==='CRV'||code==='CURV'))horizontalShape=1.72;
 else if(pitcherName==='Najee'&&code==='SL')horizontalShape=1.36;
 // All changeups get more sink. Auden's gets an extra drop boost, and his
 // curveball receives a much steeper vertical shape so it actually falls off.
 if(code==='CH')verticalShape*=1.34;
 if(pitcherName==='Auden'&&code==='CH')verticalShape*=1.15;
 if(pitcherName==='Auden'&&(code==='CRV'||code==='CURV'))verticalShape*=1.58;
 viewX*=horizontalShape;
 viewX*=GAMEPLAY_TUNING.horizontalBreakScale;y*=GAMEPLAY_TUNING.verticalBreakScale*verticalShape;wobble*=1.18;
 // Camera looks toward +Z, so world X is mirrored on screen. Convert the
 // hitter-view direction once here and keep the renderer purely world-space.
 const worldX=-viewX;
 return {breakX:worldX,breakViewX:viewX,breakY:y,wobble,breakNorm:b};
}
function makePitchMessage(pitchIndex,target){
 let pitcherName=game[pitchingTeam()].name,c=card(pitcherName,game[pitchingTeam()].season),p=c.meta.pitches[pitchIndex]||c.meta.pitches[0],seed=hash(matchCode+game.inning+game.half+game.outs+game.balls+game.strikes+Date.now()),rr=rng(seed);
 const ctrlRating=clamp(+p[3]||0,0,99),sigma=commandSigma(ctrlRating),missX=randNorm(rr)*sigma,missY=randNorm(rr)*sigma*.92;
 let tx=target.x+missX,ty=target.y+missY,velo=tunedPitchVelo(p[1]),dur=Math.max(375,(1100-(velo-65)*12)/1.23),code=String(p[0]||'FB').toUpperCase(),handed=c.meta.throws==='L'?-1:1,delivery=p[4]||'overhand';
 const mv=pitchMovement(code,+p[2]||50,handed,delivery,rr,pitcherName),motion=PITCH_PROFILES[pitcherName]||PITCH_PROFILES.Coel,sentAt=Date.now(),windupLead=70,windupStart=sentAt+windupLead,release=windupStart+motion.windup;
 return {t:'pitch',id:seed,pitch:pitchIndex,pitchCode:code,tx,ty,aimX:target.x,aimY:target.y,commandRating:ctrlRating,commandMissX:missX,commandMissY:missY,sentAt,windupLead,windupMs:motion.windup,windupStart,release,duration:dur,velo,breakRating:+p[2]||50,breakX:mv.breakX,breakViewX:mv.breakViewX,breakY:mv.breakY,breakNorm:mv.breakNorm,wobble:mv.wobble,delivery}
}
function currentPitchPreview(){
 if(!game)return null;const c=card(game[pitchingTeam()].name,game[pitchingTeam()].season),p=c.meta.pitches[selectedPitch]||c.meta.pitches[0];if(!p)return null;
 const code=String(p[0]||'FB').toUpperCase(),handed=c.meta.throws==='L'?-1:1,delivery=p[4]||'overhand',mv=pitchMovement(code,+p[2]||50,handed,delivery,()=>.5,game[pitchingTeam()].name);
 const ctrl=clamp(+p[3]||0,0,99);return{pitchCode:code,breakX:mv.breakX,breakY:mv.breakY,wobble:mv.wobble,commandRating:ctrl,commandSigma:commandSigma(ctrl),delivery,throws:c.meta.throws||'R'};
}
function cpuDeliverPitch(){if(gamePaused){cpuPitchTimer=setTimeout(cpuDeliverPitch,120);return}if(!cpuPitching()||pitchAnim||game.over)return;let c=card(game[pitchingTeam()].name,game[pitchingTeam()].season),rr=rng(hash(matchCode+'cpu-pitch'+game.inning+game.half+game.outs+game.balls+game.strikes+Date.now())),idx=cpuPitchIndex(game[pitchingTeam()].name,c.meta.pitches,rr),chase=rr()<.16,brush=rr()<.10,batter=card(game[battingTeam()].name,game[battingTeam()].season),insideX=batter.meta.bats==='L'?.96:.04,target=brush?{x:insideX,y:.12+rr()*.76}:{x:chase?(rr()<.5?-.12:1.12):.12+rr()*.76,y:chase?(rr()<.5?-.10:1.10):.10+rr()*.80};startPitch(makePitchMessage(idx,target))}
function scheduleCpuSwing(m){clearTimeout(cpuSwingTimer);let bat=card(game[battingTeam()].name,game[battingTeam()].season),r=bat.ratings,rr=rng((m.id^0x9e3779b9)>>>0),inside=m.tx>=-ZONE.strikeBallNorm&&m.tx<=1+ZONE.strikeBallNorm&&m.ty>=-ZONE.strikeBallNorm&&m.ty<=1+ZONE.strikeBallNorm,chase=.055+(99-r.vision)/330,swingChance=inside?(game.strikes===2?.90:.75):chase;if(rr()>swingChance)return;let type=game.strikes===2&&rr()<.35?'contact':r.power>=80&&rr()<.15?'power':'regular',pciErr=.105+(99-r.contact)/165+(99-r.vision)/285,px=clamp(m.tx+(rr()-.5)*pciErr*2,0,1),py=clamp(m.ty+(rr()-.5)*pciErr*2,0,1),timingErr=(rr()-.5)*(205+(99-r.vision)*2.85),contactAt=m.release+m.duration+timingErr,when=contactAt-swingContactMs(game[battingTeam()].name,type),delay=Math.max(0,when-Date.now());const fireCpuSwing=()=>{if(gamePaused){cpuSwingTimer=setTimeout(fireCpuSwing,120);return}if(!pitchAnim||pitchAnim.id!==m.id||pitchAnim.resolved||pitchAnim.swingQueued)return;const shift=Math.max(0,Date.now()-(m.release+m.duration)-timingErr);pitchAnim.batPose='swing';pitchAnim.swingAt=when+Math.max(0,shift);pitchAnim.swingType=type;resolveSwing({t:'swing',type,cpu:true,pci:{x:px,y:py},when:pitchAnim.swingAt,contactAt:pitchAnim.swingAt+swingContactMs(game[battingTeam()].name,type)})};cpuSwingTimer=setTimeout(fireCpuSwing,delay)}
function fitHud(){let pit=localPitching(),bat=localBatting();$('pitchHud').classList.toggle('show',pit);$('batHud').classList.toggle('show',bat);if(pit)renderPitchHud()}
function renderPitchHud(){let p=card(game[pitchingTeam()].name,game[pitchingTeam()].season),list=p.meta.pitches;$('pitchHud').innerHTML=`<div class="hud-head"><b>PITCH</b><span>${game.balls}-${game.strikes} · AIM / CLICK</span></div><div class="hud-pitchlist">`+list.map((q,i)=>`<button data-p="${i}" class="${i===selectedPitch?'active':''}"><span class="slot">${i+1}</span><span class="pitch-name">${q[0]}</span><small>V ${tunedPitchVelo(q[1])} · B ${q[2]} · C ${q[3]}</small></button>`).join('')+`</div>`;$('pitchHud').querySelectorAll('button').forEach(b=>b.onclick=()=>{selectedPitch=+b.dataset.p;renderPitchHud()})}
function renderScore(){let a=game.away,h=game.home,arrow=game.half===0?'▲':'▼';$('scorebug').innerHTML=`<div class="score-row"><b class="team-name">${a.name.toUpperCase()}</b><div class="score-num">${game.score.away}</div><div class="score-side"><span class="meta-chip">${arrow} ${game.inning}${game.inning>3?' · EX':''}</span></div></div><div class="score-row"><b class="team-name">${h.name.toUpperCase()}</b><div class="score-num">${game.score.home}</div><div class="score-side">${baseDiamond()}</div></div><div class="inningbar"><span class="count-chip">COUNT ${game.balls}-${game.strikes}</span><span class="outs-chip">${game.outs} OUT${game.outs===1?'':'S'}</span></div>`}
function baseDiamond(){const b=game?.bases||[0,0,0];return `<span class="base-diamond" aria-label="Bases: first ${b[0]?'occupied':'empty'}, second ${b[1]?'occupied':'empty'}, third ${b[2]?'occupied':'empty'}"><i class="base-marker base-second ${b[1]?'occupied':''}"></i><i class="base-marker base-third ${b[2]?'occupied':''}"></i><i class="base-marker base-first ${b[0]?'occupied':''}"></i></span>`}
const canvas=$('gameCanvas');
function drawGameFrame(now=performance.now()){
 if(!game||game.over)return;let eng;try{eng=ensure3D()}catch(err){console.warn('PCBL renderer unavailable; frame skipped',err);renderScore();return}
 const batter=game[battingTeam()].name,pitcher=game[pitchingTeam()].name;
 const pitcherPose=pitchMotionState(pitcher,pitchAnim,Date.now());
 const batPose=(pitchAnim&&['swing','hr'].some(k=>String(pitchAnim.batPose||'').startsWith(k)))?normBatPose(batter,pitchAnim.batPose,Date.now()):
   (pitchAnim&&String(pitchAnim.batPose||'').startsWith('flip')?{kind:pitchAnim.batPose,t:1,type:pitchAnim.swingType||'regular'}:{kind:'idle',t:0,type:'regular'});
 let ok=false;try{ok=eng.renderGame({park:setup.stadium,batter,pitcher,pitchPose:pitcherPose,pitchReaction:pitchAnim?.reaction||null,pitchReactionT:pitchAnim?.reactionAt?Math.max(0,(Date.now()-pitchAnim.reactionAt)/(pitchAnim?.hrReactionDuration||4400)):0,batPose,batReaction:pitchAnim?.batReaction||null,batReactionT:pitchAnim?.batReactionAt?Math.max(0,(Date.now()-pitchAnim.batReactionAt)/(pitchAnim?.batReactionDuration||2800)):0,batExpression:pitchAnim?.batExpression||null,pitchExpression:pitchAnim?.pitchExpression||null,pitch:pitchAnim,pci,aim,aimPreview:localPitching()&&!pitchAnim?currentPitchPreview():null,showPCI:localBatting(),showAim:localPitching()&&!pitchAnim,lastContactFeedback:localBatting()?lastContactFeedback:null,cameraHeight,cameraZoom})}catch(err){console.error('PCBL game render exception',err);ok=false}
 if(ok===false){renderFailCount++;const detail=eng.diagnostic?.()||'FRAME FAILED';if(renderFailCount===1||renderFailCount%120===0)console.warn('PCBL frame recovery '+renderFailCount+':',detail)}else{renderFailCount=0}
 if(pitchAnim&&!pitchAnim.arrived&&Date.now()>=pitchAnim.release+pitchAnim.duration){
  pitchAnim.arrived=true;
  if(localPitching()||(singlePlayer&&cpuPitching())){const id=pitchAnim.id;clearTimeout(pitchResolveTimer);const finishNoSwing=()=>{if(gamePaused){pitchResolveTimer=setTimeout(finishNoSwing,120);return}if(pitchAnim?.id===id&&!pitchAnim.resolved)resolveNoSwing()};pitchResolveTimer=setTimeout(finishNoSwing,singlePlayer?100:900)}
 }
 renderScore();
}
function startGameLoop(){
 if(gameLoopRunning)return;gameLoopRunning=true;
 const loop=(t)=>{if(!game||game.over||!document.getElementById('screen-game').classList.contains('active')){gameLoopRunning=false;gameRAF=null;return}if(!gamePaused)drawGameFrame(t);gameRAF=requestAnimationFrame(loop)};
 gameRAF=requestAnimationFrame(loop);
}
function gameplayPointer(e){
 if(!game||game.over||gamePaused||!render3D||!$('screen-game').classList.contains('active'))return;
 const r=canvas.getBoundingClientRect();
 if(!r.width||!r.height||e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)return;
 const nx=(e.clientX-r.left)/r.width,ny=(e.clientY-r.top)/r.height,px=nx*1280,py=ny*720,z=render3D.zoneRectVirtual();
 if(!z||!Number.isFinite(z.w)||!Number.isFinite(z.h)||Math.abs(z.w)<1||Math.abs(z.h)<1)return;
 const zx=(px-z.x)/z.w,zy=(py-z.y)/z.h;
 if(localBatting())pci={x:clamp(zx,0,1),y:clamp(zy,0,1)};
 if(localPitching()&&!pitchAnim)aim={x:clamp(zx,-.22,1.22),y:clamp(zy,-.22,1.22)};
}
function gameplayPress(e){
 if(!game||game.over||gamePaused||!$('screen-game').classList.contains('active'))return;
 // UI controls handle themselves; only a field click delivers the selected pitch.
 if(e.target?.closest?.('button,.pitch-hud,.bat-hud'))return;
 gameplayPointer(e);
 if(localPitching()&&!pitchAnim)deliverPitch();
}
window.addEventListener('pointermove',gameplayPointer,{passive:true});
window.addEventListener('pointerdown',gameplayPress);
window.addEventListener('keydown',e=>{if(!game||game.over)return;let n=+e.key;if(localPitching()&&n>=1&&n<=5){let p=card(game[pitchingTeam()].name,game[pitchingTeam()].season).meta.pitches;if(n<=p.length){selectedPitch=n-1;renderPitchHud()}}else if(localBatting()&&n>=1&&n<=3&&pitchAnim&&!pitchAnim.resolved)swing(['power','regular','contact'][n-1])});
function deliverPitch(){if(game?.transitioning||pitchAnim||gamePaused||pauseRequest)return;let msg=makePitchMessage(selectedPitch,aim);startPitch(msg);send(msg)}
function clearPitchLifecycleTimers(){clearTimeout(pitchResolveTimer);clearTimeout(pitchClearTimer);clearTimeout(swingResolveTimer);clearTimeout(swingWatchdogTimer);clearTimeout(battedResultTimer);clearTimeout(hrLandingTimer);pitchResolveTimer=pitchClearTimer=swingResolveTimer=swingWatchdogTimer=battedResultTimer=hrLandingTimer=null}
function startPitch(m){
 if(!m||!game||game.over||game.transitioning||gamePaused)return;
 // A pitch already launched by the opponent just before a pause request arrived
 // must finish normally on both clients. It invalidates any prior ready signal
 // and the synchronized pause is retried only after this pitch clears.
 if(pauseRequest){pauseRequest.localReady=false;pauseRequest.committed=false;}
 clearPitchLifecycleTimers();
 if(pitchAnim&&pitchAnim.id!==m.id){try{render3D?.disposePitch?.(pitchAnim.id)}catch{}}
 let localMsg={...m};
 // Online pitches are rebased onto the receiving batter's clock. Gameplay timing
 // is then carried as a relative contact delta, so device clock skew can never
 // make online contact harder/easier than the same swing in singleplayer.
 if(!singlePlayer&&localBatting()){
   const now=Date.now(),pitcherName=game[pitchingTeam()].name,motion=PITCH_PROFILES[pitcherName]||PITCH_PROFILES.Coel,lead=Number.isFinite(+m.windupLead)?Math.max(35,+m.windupLead):70,windup=Number.isFinite(+m.windupMs)?Math.max(300,+m.windupMs):motion.windup;
   localMsg.networkSentAt=m.sentAt;localMsg.networkOriginalRelease=m.release;localMsg.networkReceivedAt=now;localMsg.windupStart=now+lead;localMsg.release=localMsg.windupStart+windup;
 }
 pitchAnim={...localMsg,resolved:false,arrived:false,batPose:'idle',swingAt:0,swingType:'regular',reaction:null,batExpression:null,pitchExpression:'focused'};
 if(cpuBatting())scheduleCpuSwing(pitchAnim)
}
function timingFeedbackData(deltaMs){
 const a=Math.abs(deltaMs);let label;if(a<=GAMEPLAY_TUNING.goodMs)label='GOOD';else if(deltaMs<0)label=a>145?'VERY EARLY':'EARLY';else label=a>145?'VERY LATE':'LATE';
 const pos=clamp(50+(deltaMs/520)*100,2,98);return{label,detail:a<=26?`${Math.round(a)} MS FROM PERFECT`:`${Math.round(a)} MS ${deltaMs<0?'EARLY':'LATE'}`,pos};
}
function showTimingFeedback(deltaMs,pitchId){
 const box=$('timingFeedback');if(!box||!Number.isFinite(deltaMs))return;const d=timingFeedbackData(deltaMs);$('timingLabel').textContent=d.label;$('timingDetail').textContent=d.detail;$('timingTick').style.left=`${d.pos}%`;box.classList.add('show');lastTimingPitchId=pitchId??lastTimingPitchId;clearTimeout(timingFeedbackTimer);timingFeedbackTimer=setTimeout(()=>box.classList.remove('show'),1250);
}
function timingMeta(contactAt,ideal){const timingDelta=contactAt-ideal;return{timingDelta:+timingDelta.toFixed(1),timingLabel:timingFeedbackData(timingDelta).label};}
function swing(type){
 if(!pitchAnim||pitchAnim.resolved||pitchAnim.swingQueued)return;
 if(!['power','regular','contact'].includes(type))type='regular';
 const id=pitchAnim.id,when=Date.now(),contactAt=when+swingContactMs(game[battingTeam()].name,type),ideal=pitchAnim.release+pitchAnim.duration,contactDelta=contactAt-ideal;
 showTimingFeedback(contactDelta,id);
 pitchAnim.swingQueued=true;pitchAnim.batPose='swing';pitchAnim.swingAt=when;pitchAnim.swingType=type;
 // id + contactDelta are the authoritative online swing inputs. Absolute browser
 // timestamps are retained only for local animation/debug and are never required
 // for remote hit difficulty.
 let msg={t:'swing',id,type,pci:{...pci},when,contactAt,contactDelta};send(msg);
 if(localPitching()||(singlePlayer&&cpuPitching()))resolveSwing(msg);
 // Hard safety net: a visual/animation issue can never leave the at-bat locked.
 if(localPitching()||(singlePlayer&&cpuPitching())){clearTimeout(swingWatchdogTimer);const swingWatchdog=()=>{if(gamePaused){swingWatchdogTimer=setTimeout(swingWatchdog,120);return}if(pitchAnim?.id===id&&!pitchAnim.resolved){pitchAnim.swingQueued=false;const adjusted=pitchAnim.swingAt+swingContactMs(game[battingTeam()].name,msg.type);resolveSwing({...msg,when:pitchAnim.swingAt,contactAt:adjusted})}};swingWatchdogTimer=setTimeout(swingWatchdog,850);}
}
function h2hBoost(b,p){let z=D.h2h[`${b}|${p}`];if(!z||z.PA<5)return 0;return Math.max(-.025,Math.min(.025,(z.hitRate-.22)*.06))}
function cross2(ax,az,bx,bz){return ax*bz-az*bx}
function raySegmentDistance(angle,a,b){const dx=Math.sin(angle),dz=Math.cos(angle),sx=b.x-a.x,sz=b.z-a.z,den=cross2(dx,dz,sx,sz);if(Math.abs(den)<1e-7)return Infinity;const t=cross2(a.x,a.z,sx,sz)/den,u=cross2(a.x,a.z,dx,dz)/den;return t>0&&u>=0&&u<=1?t:Infinity}
function parkWall(angle){
 const a=Math.abs(angle),fair=a<=Math.PI/4+.015;if(!fair)return{distance:74,height:4.5,fair:false};
 if(setup?.stadium==='POLO RINK'){
   // 62 ft down each foul line and 209 ft to straightaway center.  Because the
   // rink is rectangular, the side-wall x coordinate is 62/sqrt(2).
   const half=62/Math.SQRT2,dx=Math.abs(Math.sin(angle)),dz=Math.max(.001,Math.cos(angle)),side=dx>.001?half/dx:Infinity,back=209/dz;
   return{distance:Math.min(side,back),height:10,fair:true};
 }
 if(setup?.stadium==='MURPHY PARK'){
   const u=clamp(a/(Math.PI/4),0,1),distance=130-30*Math.pow(u,1.22);
   // Alpha 42: one consistent, lower Murphy outfield fence (~half the old RF height).
   return{distance,height:13.5,fair:true};
 }
 const pts=[{x:-51,z:51},{x:-36,z:81},{x:37,z:81},{x:51,z:51}];let distance=Infinity;for(let i=0;i<pts.length-1;i++)distance=Math.min(distance,raySegmentDistance(angle,pts[i],pts[i+1]));
 return{distance:Number.isFinite(distance)?distance:81,height:5.2,fair:true};
}
function classifyLandingZone({park,cleared,fielded,fieldType,maxDist,landing,landingX,landingZ,wallContact,az}){
 // A caught fly ball is always an FO, even if its projected landing point sits
 // inside 1B/2B/3B territory. The catch event overrides the landing zone.
 if(fielded&&fieldType==='air')return{result:'FO',zone:'PITCHER CATCH'};
 if(cleared)return{result:'HR',zone:'OVER FENCE'};
 const rules=FIELD_ZONE_RULES[park]||FIELD_ZONE_RULES['PCBL MAIN FIELD'];
 const dist=Number.isFinite(landing)?landing:maxDist,forward=Number.isFinite(landingZ)?landingZ:dist,effective=wallContact?Math.max(dist,maxDist):dist;
 if(forward<=rules.outEnd)return{result:'GO',zone:fielded&&fieldType==='ground'?'PITCHER GROUNDOUT':'GROUNDOUT AREA'};
 if(park==='POLO RINK'){
  const deepCF=effective>=rules.deepTripleStart&&Math.abs(az)<=rules.deepCFAngle;
  const deepRF=effective>=rules.tripleRFStart&&az>=rules.tripleRFMinAngle&&az<=rules.tripleRFMaxAngle;
  if(deepCF)return{result:'3B',zone:'DEEP CENTER TRIPLE ZONE'};
  if(deepRF)return{result:'3B',zone:'DEEP RIGHT FIELD TRIPLE ZONE'};
  if(effective>=rules.doubleStart||wallContact)return{result:'2B',zone:'LF/CF DOUBLE ZONE'};
  return{result:'1B',zone:'SHALLOW OUTFIELD SINGLE ZONE'};
 }
 if(park==='MURPHY PARK'){
  const centralTriple=!wallContact&&effective>=rules.tripleStart&&az>=rules.tripleMinAngle&&az<=rules.tripleMaxAngle;
  const rcfWallTriple=wallContact&&effective>=rules.rcfWallStart&&az>=rules.rcfWallMin&&az<=rules.rcfWallMax;
  if(rcfWallTriple)return{result:'3B',zone:'RCF WALL TRIPLE ZONE'};
  if(centralTriple)return{result:'3B',zone:'CENTRAL RCF TRIPLE ZONE'};
  if(effective>=rules.doubleStart||wallContact)return{result:'2B',zone:'LF/CF DOUBLE ZONE'};
  return{result:'1B',zone:'SHALLOW OUTFIELD SINGLE ZONE'};
 }
 const mainRFTriple=Number.isFinite(landingX)&&Number.isFinite(landingZ)&&landingX>=rules.tripleRFMinX&&landingX<=rules.tripleRFMaxX&&landingZ>=rules.tripleRFMinZ;
 if(mainRFTriple)return{result:'3B',zone:'DEEP RIGHT-FIELD CORNER TRIPLE ZONE'};
 if(effective>=rules.doubleStart||wallContact)return{result:'2B',zone:'LF/CF DOUBLE ZONE'};
 return{result:'1B',zone:'SHALLOW OUTFIELD SINGLE ZONE'};
}
function classifyParkHit(args){return classifyLandingZone(args).result}



// PCBL Main Field is boxed in by Stuy Town. Deep home runs can reach the
// apartment facades, so the batted-ball path collides with the same building
// footprints used by the 3D park instead of flying through them.
const MAIN_FIELD_BUILDING_COLLIDERS=[
 {x:-91,z:146,w:38,d:20,h:48},{x:-48,z:154,w:45,d:20,h:55},{x:-4,z:146,w:38,d:20,h:62},{x:43,z:154,w:45,d:20,h:48},{x:88,z:146,w:38,d:20,h:55},
 {x:-113,z:-34,w:24,d:39,h:45},{x:-109,z:0,w:24,d:44,h:52},{x:-113,z:34,w:24,d:39,h:59},{x:-109,z:68,w:24,d:44,h:45},{x:-113,z:102,w:24,d:39,h:52},{x:-109,z:136,w:24,d:44,h:59},
 {x:109,z:-34,w:24,d:39,h:45},{x:113,z:0,w:24,d:44,h:52},{x:109,z:34,w:24,d:39,h:59},{x:113,z:68,w:24,d:44,h:45},{x:109,z:102,w:24,d:39,h:52},{x:113,z:136,w:24,d:44,h:59},
 {x:-94,z:118,w:27,d:35,h:53},{x:94,z:118,w:27,d:35,h:50}
];
function sweepBuildingAABB(px,py,pz,x,y,z,b){
 const minX=b.x-b.w/2,maxX=b.x+b.w/2,minY=.18,maxY=b.h,minZ=b.z-b.d/2,maxZ=b.z+b.d/2,dx=x-px,dy=y-py,dz=z-pz;
 let enter=0,exit=1,axis=null,sign=0;
 for(const q of [['x',px,dx,minX,maxX],['y',py,dy,minY,maxY],['z',pz,dz,minZ,maxZ]]){
  const [a,p,d,lo,hi]=q;if(Math.abs(d)<1e-8){if(p<lo||p>hi)return null;continue}
  let t1=(lo-p)/d,t2=(hi-p)/d,n=d>0?-1:1;if(t1>t2){const tmp=t1;t1=t2;t2=tmp;n=-n}
  if(t1>enter){enter=t1;axis=a;sign=n}exit=Math.min(exit,t2);if(enter>exit)return null;
 }
 if(!axis||enter<0||enter>1)return null;return{t:enter,axis,sign,x:lerp(px,x,enter),y:lerp(py,y,enter),z:lerp(pz,z,enter),building:b};
}
function mainFieldBuildingHit(px,py,pz,x,y,z){
 if(setup?.stadium!=='PCBL MAIN FIELD')return null;let best=null;
 for(const b of MAIN_FIELD_BUILDING_COLLIDERS){const h=sweepBuildingAABB(px,py,pz,x,y,z,b);if(h&&(!best||h.t<best.t))best=h}
 return best;
}

function makeBattedFlight(s,cq,bat,pit){
 const r=bat.ratings,q=pit.ratings,adjusted=swingAdjustedRatings(r,s.type),end={x:pitchAnim.tx,y:pitchAnim.ty},ideal=pitchAnim.release+pitchAnim.duration,vision=r.vision/99;
 if(s.cpu){adjusted.contact=clamp(adjusted.contact-10,1,99);adjusted.power=clamp(adjusted.power-13,1,99);}
 const signedTiming=clamp((ideal-s.when)/(250+vision*155),-1.18,1.18),xMiss=s.pci.x-end.x,yMiss=s.pci.y-end.y,hand=bat.meta.bats==='L'?-1:1,centerDist=Math.hypot(xMiss,yMiss),ballOverlap=circleOverlapFraction(centerDist,ZONE.pciRadius,ZONE.ballNorm);
 // Contact geometry drives spray and launch. Great square contact now produces
 // a hotter low/medium line drive more often instead of requiring a lofted fly.
 let az=hand*(signedTiming*.49+xMiss*.65+(end.x-.5)*-.12),launch=8+yMiss*58+(s.type==='power'?4:s.type==='contact'?-1:0);
 launch=clamp(launch,-9,47);
 const power=adjusted.power/99,pitchAssist=clamp(((pitchAnim.velo||80)-70)*.065,0,2.4);
 // Timing now affects authority after contact too. Perfect timing keeps full EV;
 // as timing drifts toward the edge of the legal contact window, the same PCI
 // placement produces a noticeably softer struck blitzball.
 const timingDeltaMs=Math.abs(ideal-s.when),timingAllowance=(205+vision*120)*GAMEPLAY_TUNING.timingScale,timingMiss=clamp((timingDeltaMs-GAMEPLAY_TUNING.perfectMs)/Math.max(1,timingAllowance-GAMEPLAY_TUNING.perfectMs),0,1),timingStrength=clamp(1-.42*Math.pow(timingMiss,1.12),.58,1);
 // PCI overlap is still the strongest EV term, but timing strength now gates
 // how much of that barrel/square contact actually turns into exit velocity.
 const barrel=Math.pow(clamp(cq,0,1),1.20),square=Math.pow(clamp(ballOverlap,0,1),1.08);let mph=(36+25*barrel+43*square+18*power+pitchAssist*1.05)*timingStrength;if(s.cpu)mph*=.89;mph=clamp(mph,35,119);
 // BLITZBALL-ONLY BATTED-BALL AERODYNAMICS. Exit velocity is still the
 // displayed contact number, but a struck plastic blitzball gets a little more
 // early carry than a baseball-style conversion would imply. Alpha 103 extends
 // that carry further off the bat, but ramps drag up harder once the lightweight
 // ball slows. Extra lift lets it hang while the divoted shell adds late flutter. This lives only in the hit
 // flight model and never touches pitch velocity, break, or pitch movement.
 const carryBoost=1.115+.036*barrel+.026*square,elev=launch*Math.PI/180,speed=mph*1.46667*carryBoost,cos=Math.cos(elev);let vx=speed*cos*Math.sin(az),vy=speed*Math.sin(elev),vz=speed*cos*Math.cos(az),x=(.5-end.x)*2.54,y=3.86+(1.28-3.86)*end.y,z=.02;
 const wall=parkWall(az),foul=!wall.fair,under=clamp(yMiss,-.28,.36),contactSide=clamp(xMiss/.22,-1,1),contactVert=clamp(yMiss/.24,-1,1),backspin=.00072+Math.max(0,under)*.00285+(s.type==='power'?.00022:0)+Math.max(0,contactVert)*.00018,topspin=Math.max(0,-under)*.00118,sideSpin=clamp(hand*(-signedTiming*.00048+contactSide*.00088),-.00108,.00108),visualSpin={x:+(8.5+Math.abs(contactVert)*5.5+barrel*2.5).toFixed(2),y:+(hand*(3.2+Math.abs(contactSide)*8.0)*(contactSide===0?1:Math.sign(contactSide))).toFixed(2),z:+(hand*(4.2+Math.abs(signedTiming)*3.4)).toFixed(2)},flutterPhase=((pitchAnim.id||1)%997)*.017+az*2.3,dt=1/120,path=[[0,x,y,z]];
 let firstGround=null,firstGroundX=null,firstGroundZ=null,groundTime=null,bounces=0,cleared=false,wallContact=false,wallTime=null,wallX=null,wallZ=null,maxDist=0,peak=y,clearTime=null,clearY=null,clearMargin=null,buildingContact=false,buildingHits=0,buildingHitTime=null,buildingHitX=null,buildingHitY=null,buildingHitZ=null;
 // 1v1 PCBL fielding model: the pitcher is the active fielder. Range/reaction
 // derives from H/3 prevention, so outs come from an actually reachable ball.
 const fieldSkill=clamp((q.h3-35)/64,0,1),reaction=lerp(.46,.29,fieldSkill),runSpeed=lerp(10.2,14.0,fieldSkill),maxFieldRange=lerp(14.0,22.0,fieldSkill),mound=new THREEishVector(0,48),fieldSamples=[];
 for(let i=1;i<=660;i++){
   const prevX=x,prevY=y,prevZ=z,prevDist=Math.hypot(x,z),prevAngle=Math.atan2(x,z),prevWall=parkWall(prevAngle),prevGap=prevDist-prevWall.distance;
   const t=i*dt,hs=Math.hypot(vx,vz),v=Math.hypot(vx,vy,vz),slow=clamp((90-v)/60,0,1),drag=.0089+.0072*Math.pow(slow,1.62),lift=(backspin-topspin)*hs*hs,flutter=Math.pow(slow,1.72),ax=-drag*v*vx+sideSpin*hs*hs*(vz/Math.max(.001,hs))+Math.sin(t*8.3+flutterPhase)*.62*flutter,azAcc=-drag*v*vz-sideSpin*hs*hs*(vx/Math.max(.001,hs))+Math.sin(t*6.7+flutterPhase*1.31)*.40*flutter,ay=-32.174-drag*v*vy+lift+Math.sin(t*7.5+flutterPhase*.73)*.32*flutter;
   vx+=ax*dt;vy+=ay*dt;vz+=azAcc*dt;x+=vx*dt;y+=vy*dt;z+=vz*dt;peak=Math.max(peak,y);const dist=Math.hypot(x,z);maxDist=Math.max(maxDist,dist);
   if(t>=reaction){const reach=Math.min(maxFieldRange,3.4+runSpeed*(t-reaction)),fromMound=Math.hypot(x-mound.x,z-mound.z);if(fromMound<=reach&&fromMound<=maxFieldRange&&z>18&&z<78)fieldSamples.push({t,x,y,z,vy,fromMound,reach,speed:Math.hypot(vx,vz),fielderSpeed:runSpeed,maxFieldRange});}
   if(!cleared&&!wallContact){
    const currAngle=Math.atan2(x,z),currWall=parkWall(currAngle),currGap=dist-currWall.distance;
    if(prevGap<0&&currGap>=0){
     const crossF=clamp((-prevGap)/Math.max(.000001,currGap-prevGap),0,1),crossX=lerp(prevX,x,crossF),crossY=lerp(prevY,y,crossF),crossZ=lerp(prevZ,z,crossF),crossAngle=Math.atan2(crossX,crossZ),crossWall=parkWall(crossAngle),crossT=t-dt+dt*crossF;
     // Judge the ball at the actual wall plane. No hidden +0.18 ft ghost line.
     if(crossY>crossWall.height+.015&&crossWall.fair){cleared=true;clearTime=crossT;clearY=crossY;clearMargin=crossY-crossWall.height}
     else{wallContact=true;const firstWall=wallTime===null;if(firstWall)wallTime=crossT;vx=-vx*.24;vz=-vz*.24;vy*=.60;x=crossX;z=crossZ;y=Math.max(crossY,.22);if(firstWall){wallX=x;wallZ=z}}
    }
   }
   // Once the ball has cleared the Main Field fence, let truly deep shots hit
   // the surrounding apartment facades/roofs. Brick kills a lot of speed, but
   // the light plastic ball still rebounds visibly instead of disappearing.
   if(cleared&&setup?.stadium==='PCBL MAIN FIELD'&&buildingHits<3){
    const bh=mainFieldBuildingHit(prevX,prevY,prevZ,x,y,z);if(bh){buildingContact=true;buildingHits++;if(buildingHitTime===null){buildingHitTime=t-dt+dt*bh.t;buildingHitX=bh.x;buildingHitY=bh.y;buildingHitZ=bh.z}x=bh.x;y=bh.y;z=bh.z;const eps=.08;if(bh.axis==='x'){x+=bh.sign*eps;vx=-vx*.46;vz*=.78;vy*=.86}else if(bh.axis==='z'){z+=bh.sign*eps;vz=-vz*.46;vx*=.78;vy*=.86}else{y+=bh.sign*eps;vy=-vy*.34;vx*=.80;vz*=.80}path.push([t,+x.toFixed(3),+y.toFixed(3),+z.toFixed(3)]);}
   }
   if(y<=.22&&vy<0){if(firstGround===null){firstGround=dist;firstGroundX=x;firstGroundZ=z;groundTime=t}y=.22;bounces++;vy=-vy*(bounces===1?.24:.15);vx*=bounces===1?.68:.55;vz*=bounces===1?.68:.55;if(Math.hypot(vx,vz)<4.5&&Math.abs(vy)<2.2){if(i%4)path.push([t,+x.toFixed(3),+y.toFixed(3),+z.toFixed(3)]);break}}
   if(i%4===0)path.push([t,+x.toFixed(3),+y.toFixed(3),+z.toFixed(3)]);
   if(z<-.5&&t>.5)break;
 }
 const duration=path[path.length-1][0],landing=buildingContact?maxDist:(firstGround??maxDist),rr=rng((pitchAnim.id^hash('flight'+s.type))>>>0);
 let result,fielded=false,fieldType='',fieldSpot=null;
 if(foul||Math.abs(Math.atan2(path[Math.min(path.length-1,8)][1],Math.max(.001,path[Math.min(path.length-1,8)][3])))>Math.PI/4+.02)result='FOUL';
 else{
   // A catch requires the pitcher to arrive under a descending ball. Grounders
   // require reach plus enough reaction margin to get the body/glove in front.
   const directCatch=fieldSamples.find(v=>v.vy<0&&v.y>=.75&&v.y<=7.2&&v.t>.36&&v.fromMound<=2.85&&(!groundTime||v.t<groundTime));
   const airCatch=directCatch||fieldSamples.find(v=>v.vy<0&&v.y>=1.45&&v.y<=5.2&&v.t>.50&&v.speed<40&&v.z>=38&&v.z<=58&&v.fromMound<=Math.max(2.1,v.reach-1.8)&&(!groundTime||v.t<groundTime));
   const groundField=fieldSamples.find(v=>v.y<1.35&&v.z<=(FIELD_ZONE_RULES[setup?.stadium]?.outEnd||50.5)&&v.speed<72&&v.t>.34);
   if(airCatch){fielded=true;fieldType='air';fieldSpot=airCatch}
   else if(groundField){const hard=groundField.speed>52&&cq>.68,clean=clamp(.90-(hard?.18:0)+(q.h3-60)/220,.45,.96);fielded=rr()<clean;fieldType='ground';if(fielded)fieldSpot=groundField}
   const landingX=firstGroundX??path[path.length-1][1],landingZ=firstGroundZ??path[path.length-1][3];
   const classified=classifyLandingZone({park:setup?.stadium,cleared,fielded,fieldType,maxDist,landing,landingX,landingZ,wallContact,az,duration});result=classified.result;
   var landingZone=classified.zone;
 }
 const landingX=firstGroundX??path[path.length-1][1],landingZ=firstGroundZ??path[path.length-1][3];
 // Only obvious, crushed home runs earn the early celebration package. A ball
 // that barely clears stays in normal flight presentation so the fence result
 // keeps its tension until the user actually sees it get out.
 const airborneDistance=buildingContact?maxDist:(firstGround??maxDist),carryPastWall=cleared?Math.max(0,airborneDistance-wall.distance):0;
 const noDoubt=!!(result==='HR'&&cleared&&Number.isFinite(clearMargin)&&((mph>=100&&clearMargin>=3.4&&carryPastWall>=14)||(mph>=94&&clearMargin>=5.2&&carryPastWall>=18)));
 return{result,flight:{result,path,duration:+duration.toFixed(3),launch:+launch.toFixed(1),exitVelo:+mph.toFixed(1),spray:+(az*180/Math.PI).toFixed(1),visualSpin,wall:wallContact,wallTime:Number.isFinite(wallTime)?+wallTime.toFixed(3):null,clearTime:Number.isFinite(clearTime)?+clearTime.toFixed(3):null,wallX:Number.isFinite(wallX)?+wallX.toFixed(2):null,wallZ:Number.isFinite(wallZ)?+wallZ.toFixed(2):null,cleared,clearY:Number.isFinite(clearY)?+clearY.toFixed(2):null,clearMargin:Number.isFinite(clearMargin)?+clearMargin.toFixed(2):null,carryPastWall:+carryPastWall.toFixed(2),buildingContact,buildingHits,buildingHitTime:Number.isFinite(buildingHitTime)?+buildingHitTime.toFixed(3):null,buildingHitX:Number.isFinite(buildingHitX)?+buildingHitX.toFixed(2):null,buildingHitY:Number.isFinite(buildingHitY)?+buildingHitY.toFixed(2):null,buildingHitZ:Number.isFinite(buildingHitZ)?+buildingHitZ.toFixed(2):null,noDoubt,fielded,fieldType,fieldTime:fieldSpot?+fieldSpot.t.toFixed(3):null,fieldX:fieldSpot?+fieldSpot.x.toFixed(3):null,fieldY:fieldSpot?+fieldSpot.y.toFixed(3):null,fieldZ:fieldSpot?+fieldSpot.z.toFixed(3):null,fielderSpeed:+runSpeed.toFixed(2),maxFieldRange:+maxFieldRange.toFixed(2),groundTime:Number.isFinite(groundTime)?+groundTime.toFixed(3):null,landing:+landing.toFixed(1),landingX:+landingX.toFixed(2),landingZ:+landingZ.toFixed(2),zone:landingZone||(result==='FOUL'?'FOUL TERRITORY':'UNKNOWN'),peak:+peak.toFixed(1)}};
}
// Tiny allocation-free stand-in for 2D fielder origins; avoids coupling game.js
// to THREE while keeping the fielding equations readable.
function THREEishVector(x,z){this.x=x;this.z=z}

function showRemoteSwingVisual(s){
 if(singlePlayer||!localPitching()||!pitchAnim||!s||s.id!==pitchAnim.id)return false;
 // Online hit authority and animation clocks are intentionally separate. The
 // contactDelta packet decides whether contact happened; the opponent-facing
 // swing starts when the packet reaches this browser so network latency/clock
 // skew can never make the batter's animation already finished on arrival.
 if(pitchAnim.remoteSwingVisualId===s.id)return true;
 pitchAnim.remoteSwingVisualId=s.id;
 pitchAnim.remoteSwingVisualAt=Date.now();
 pitchAnim.batPose='swing';
 pitchAnim.swingAt=pitchAnim.remoteSwingVisualAt;
 pitchAnim.swingType=['power','regular','contact'].includes(s.type)?s.type:'regular';
 return true;
}
function resolveSwing(s){
 if(!pitchAnim||pitchAnim.resolved||!s)return;
 if(s.id!=null&&s.id!==pitchAnim.id)return; // stale/late network swing can never hit the next pitch
 const id=pitchAnim.id,batterName=game[battingTeam()].name,ideal=pitchAnim.release+pitchAnim.duration,lead=swingContactMs(batterName,s.type),contactDelta=Number.isFinite(+s.contactDelta)?clamp(+s.contactDelta,-1200,1200):null,contactAt=contactDelta!==null?ideal+contactDelta:(Number.isFinite(s.contactAt)?s.contactAt:(s.when+lead)),swingAt=contactAt-lead;
 if(!s.cpu&&localPitching()){pitchAnim.swingQueued=true;showRemoteSwingVisual({...s,id});}
 if(contactAt>Date.now()+4){
  pitchAnim.swingQueued=true;clearTimeout(swingResolveTimer);
  const resolveAtContact=()=>{if(gamePaused){swingResolveTimer=setTimeout(resolveAtContact,120);return}if(pitchAnim?.id===id&&!pitchAnim.resolved){pitchAnim.swingQueued=false;resolveSwing({...s,id,when:swingAt,contactAt,contactDelta:contactAt-ideal})}};swingResolveTimer=setTimeout(resolveAtContact,Math.min(900,Math.max(0,contactAt-Date.now())));return;
 }
 clearTimeout(swingResolveTimer);clearTimeout(swingWatchdogTimer);swingResolveTimer=swingWatchdogTimer=null;pitchAnim.swingQueued=false;pitchAnim.resolved=true;
 let bat=card(batterName,game[battingTeam()].season),pit=card(game[pitchingTeam()].name,game[pitchingTeam()].season),r=bat.ratings,adjusted=swingAdjustedRatings(r,s.type);if(s.cpu){adjusted.contact=clamp(adjusted.contact-10,1,99);adjusted.power=clamp(adjusted.power-13,1,99);}adjusted.contact=clamp(adjusted.contact-GAMEPLAY_TUNING.contactPenalty,1,99);
 let end={x:pitchAnim.tx,y:pitchAnim.ty},dx=s.pci.x-end.x,dy=s.pci.y-end.y,dist=Math.hypot(dx,dy),delta=contactAt-ideal,dt=Math.abs(delta),vision=r.vision/99,contactWindow=.065+vision*.085;
 const basePci=(.395+vision*.145)*GAMEPLAY_TUNING.pciScale,baseTime=(205+vision*120)*GAMEPLAY_TUNING.timingScale;
 // Swing-type ratings are literal: CONTACT is +5 contact/-5 power; POWER is
 // +5 power/-5 contact. Regular uses the player's raw values.
 const spatialAssist=1.12,timingAssist=.90,contactPc=Math.max(0,1-dist/(basePci*spatialAssist)),contactTc=Math.max(0,1-dt/(baseTime*timingAssist));
 const qualityTc=Math.max(0,1-dt/(baseTime*.84)),overlap=circleOverlapFraction(dist,ZONE.pciRadius,ZONE.ballNorm),ratingFactor=(.48+.52*adjusted.contact/99);
 let contactQ=contactPc*contactTc*ratingFactor,cq=clamp((.10+.90*overlap)*qualityTc*(.62+.38*adjusted.contact/99),0,1);const rr=rng(pitchAnim.id^hash(s.type)),tm=timingMeta(contactAt,ideal);
 const visualOverlap=overlap>0,nearPerfect=dt<=GAMEPLAY_TUNING.perfectMs;if(visualOverlap&&nearPerfect){contactQ=Math.max(contactQ,contactWindow+.20);cq=Math.max(cq,.22+.78*overlap);}
 if(contactQ<contactWindow){broadcastResult('K',{swing:s.type,quality:cq,contactQuality:contactQ,pciDistance:dist,overlap:0,...tm});return}
 if(!nearPerfect&&contactQ<contactWindow+.075&&rr()<.52){broadcastResult('FOUL',{swing:s.type,quality:cq,contactQuality:contactQ,pciDistance:dist,overlap,...tm});return}
 const timedSwing={...s,when:contactAt};const hit=makeBattedFlight(timedSwing,cq,bat,pit);broadcastResult(hit.result,{swing:s.type,quality:cq,contactQuality:contactQ,pciDistance:dist,overlap,contactAt,contactViz:{pciX:+s.pci.x.toFixed(4),pciY:+s.pci.y.toFixed(4),ballX:+end.x.toFixed(4),ballY:+end.y.toFixed(4)},flight:hit.flight,...tm});
}
function hbpTargetInfo(p){
 if(!p||!game)return null;const batter=card(game[battingTeam()].name,game[battingTeam()].season),left=batter.meta.bats==='L';
 const bodySide=left?p.tx>=1.18:p.tx<=-.18,vertical=p.ty>=-.18&&p.ty<=1.20;if(!bodySide||!vertical)return null;
 const depth=left?clamp((p.tx-1.18)/.42,0,1):clamp((-.18-p.tx)/.42,0,1),torso=1-Math.abs(clamp(p.ty,0,1)-.48);
 return{side:left?'L':'R',depth:+depth.toFixed(3),bodyY:+clamp(p.ty,-.18,1.20).toFixed(3),severity:+clamp(.45+.40*depth+.15*torso,0,1).toFixed(3)};
}
function resolveNoSwing(){if(!pitchAnim||pitchAnim.resolved||pitchAnim.swingQueued)return;pitchAnim.resolved=true;const bean=hbpTargetInfo(pitchAnim);if(bean){broadcastResult('HBP',{hbp:bean});return}let r=ZONE.strikeBallNorm,touches=pitchAnim.tx+r>=0&&pitchAnim.tx-r<=1&&pitchAnim.ty+r>=0&&pitchAnim.ty-r<=1;broadcastResult(touches?'CS':'BALL',{})}
function broadcastResult(result,meta){let m={t:'result',result,meta,id:pitchAnim?.id};lastResolvedPacket=m;applyResult(m);send(m)}
function applyResult(m){
 if(pitchAnim)pitchAnim.resolved=true;if(localBatting()&&Number.isFinite(m.meta?.timingDelta)&&lastTimingPitchId!==m.id)showTimingFeedback(m.meta.timingDelta,m.id);
 if(localBatting()&&m.meta?.contactViz&&m.meta?.flight&&m.result!=='FOUL'){lastContactFeedback={...m.meta.contactViz,fadeAt:null,pending:true,result:m.result};}
 if(m.result==='HBP'&&pitchAnim){pitchAnim.hbpAt=Date.now();pitchAnim.batReactionAt=pitchAnim.hbpAt;pitchAnim.batReactionDuration=2350;pitchAnim.batReaction='hbp';pitchAnim.batExpression='pain';pitchAnim.pitchExpression='annoyed';pitchAnim.hbpMeta=m.meta?.hbp||null;}
 const flight=m.meta?.flight;if(flight&&pitchAnim){playHitSound();pitchAnim.batted={...flight,start:Date.now()};pitchAnim.ballInPlay=true;if(m.result==='HR'){showCall('BALL IN PLAY');const hrPitchId=m.id,landMs=Math.max(0,((Number.isFinite(flight.groundTime)?flight.groundTime:flight.duration)||0)*1000);clearTimeout(hrLandingTimer);const announceHrAtLanding=()=>{if(gamePaused){hrLandingTimer=setTimeout(announceHrAtLanding,120);return}hrLandingTimer=null;if(pitchAnim?.id===hrPitchId&&!pitchAnim.hrAnnounced){pitchAnim.hrAnnounced=true;showCall('HOME RUN',{homeRun:true,hold:1500})}};hrLandingTimer=setTimeout(announceHrAtLanding,landMs);if(flight.noDoubt){pitchAnim.hrCelebrationAt=Date.now()+120;pitchAnim.hrCelebrationDuration=4800;pitchAnim.hrReactionDuration=4400;pitchAnim.hrCelebrationEndsAt=pitchAnim.hrCelebrationAt+4800;pitchAnim.reactionAt=pitchAnim.hrCelebrationAt;pitchAnim.batPose='hr';pitchAnim.swingType=m.meta?.swing||pitchAnim.swingType||'regular';pitchAnim.batExpression=null;pitchAnim.pitchExpression=null;pitchAnim.reaction='hrDisgust';pitchAnim.noDoubt=true}else{pitchAnim.noDoubt=false;pitchAnim.batPose='idle';pitchAnim.reaction=null;pitchAnim.batExpression='focused';pitchAnim.pitchExpression='focused'}}else{showCall(m.result==='FOUL'?'FOUL BALL':'BALL IN PLAY');if(['1B','2B','3B'].includes(m.result))pitchAnim.batExpression='happy';else if(['GO','FO'].includes(m.result))pitchAnim.batExpression='annoyed'}const delay=m.result==='HR'?(flight.noDoubt?Math.max(8200,(flight.groundTime||flight.duration)*1000+5700):Math.max(520,((Number.isFinite(flight.clearTime)?flight.clearTime:flight.duration)*1000)+420)):Math.max(420,Math.min(4200,flight.duration*1000+120));clearTimeout(battedResultTimer);const finishBatted=()=>{if(gamePaused){battedResultTimer=setTimeout(finishBatted,120);return}battedResultTimer=null;if(pitchAnim?.id===m.id)finalizeResult(m)};battedResultTimer=setTimeout(finishBatted,delay);return}
 finalizeResult(m)
}
function scorebookDetail(res,meta){
 if(res==='HBP')return`HBP · ${meta?.hbp?.side==='L'?'LEFT-SIDE':'RIGHT-SIDE'} IMPACT`;
 const f=meta?.flight;if(!f)return res;
 const dist=Number.isFinite(f.landing)?`${Math.round(f.landing)} FT`:'';
 if(res==='FO'){const catchDist=Number.isFinite(f.fieldX)&&Number.isFinite(f.fieldZ)?`${Math.round(Math.hypot(f.fieldX,f.fieldZ))} FT`:dist;return`FO · ${f.zone||'PITCHER CATCH'}${catchDist?' · '+catchDist:''}`}
 if(res==='GO')return`GO · ${f.zone||'GROUNDOUT AREA'}${dist?' · '+dist:''}`;
 if(['1B','2B','3B','HR'].includes(res))return`${res} · ${f.zone||'FAIR TERRITORY'}${dist?' · '+dist:''}`;
 return res;
}
function logScorebook(res,meta,countBefore,display){
 if(!game)return;const bat=game[battingTeam()]?.name||'BATTER',pit=game[pitchingTeam()]?.name||'PITCHER',half=game.half===0?'TOP':'BOT',continuing=['CS','K','FOUL','BALL'].includes(res)&&!['STRIKEOUT','WALK'].includes(display),count=continuing?`${game.balls}-${game.strikes}`:`${countBefore.balls}-${countBefore.strikes}`;
 game.scorebook||(game.scorebook=[]);game.scorebook.push({inning:game.inning,half,batter:bat,pitcher:pit,result:res,detail:scorebookDetail(res,meta),count,display});
}
function commitCurrentHalfLine(){if(!game)return;const team=battingTeam(),idx=Math.max(0,game.inning-1),prior=game.lines[team].reduce((sum,v,i)=>sum+(i===idx?0:(v||0)),0);game.lines[team][idx]=game.score[team]-prior}
function isWalkoffState(){return !!game&&!game.over&&game.half===1&&game.inning>=3&&game.score.home>game.score.away}
function finalizeResult(m){
 clearTimeout(swingResolveTimer);clearTimeout(swingWatchdogTimer);swingResolveTimer=swingWatchdogTimer=null;const countBefore={balls:game.balls,strikes:game.strikes};let res=m.result,display=res,paEnded=false,walkoff=false;
 if(res==='CS'||res==='K'){game.strikes++;display=res==='CS'?'CALLED STRIKE':'SWING & MISS';if(game.strikes>=3){recordOut('K');display='STRIKEOUT';paEnded=true}}
 else if(res==='FOUL'){if(game.strikes<2)game.strikes++;display='FOUL'}
 else if(res==='BALL'){game.balls++;if(game.balls>=4){walk();display='WALK';paEnded=true;walkoff=isWalkoffState()}}
 else if(res==='HBP'){walk();display='HIT BY PITCH';paEnded=true;walkoff=isWalkoffState()}
 else if(['GO','FO'].includes(res)){recordOut(res);display=res==='GO'?'GROUND OUT':'FLY OUT';paEnded=true}
 else if(['1B','2B','3B','HR'].includes(res)){hit(res);display=res==='HR'?'HOME RUN':res==='1B'?'SINGLE':res==='2B'?'DOUBLE':'TRIPLE';paEnded=true;walkoff=isWalkoffState()}
 game.last=res;if(!paEnded&&['CS','K','FOUL','BALL'].includes(res))display+=` · COUNT ${game.balls}-${game.strikes}`;
 logScorebook(res,m.meta,countBefore,display);
 if(pitchAnim&&!pitchAnim.ballInPlay){if(res==='HBP'){pitchAnim.batExpression='pain';pitchAnim.pitchExpression='annoyed'}else if(res==='HR'){pitchAnim.batExpression='happy';pitchAnim.pitchExpression='angry'}else if(res==='K'||res==='CS'){pitchAnim.batExpression='annoyed';pitchAnim.pitchExpression='happy'}else if(res==='GO'||res==='FO'){pitchAnim.batExpression='annoyed';pitchAnim.pitchExpression='neutral'}else if(res==='1B'||res==='2B'||res==='3B'){pitchAnim.batExpression='happy';pitchAnim.pitchExpression='annoyed'}}
 if(walkoff){display+=' · WALK-OFF';game.over=true;game.transitioning=false;commitCurrentHalfLine();if(res==='HR')showCall('WALK-OFF',{hold:1100});else showCall(display);renderScore();clearTimeout(cpuPitchTimer);clearTimeout(cpuSwingTimer);const walkId=m.id;clearTimeout(pitchClearTimer);pitchClearTimer=setTimeout(()=>{if(pitchAnim?.id===walkId){try{render3D?.disposePitch?.(walkId)}catch{}pitchAnim=null}endGame()},520);return}
 if(res!=='HR')showCall(display);renderScore();const linger=res==='HBP'?2400:(pitchAnim?.ballInPlay?420:850),id=m.id;clearTimeout(pitchClearTimer);const clearAfterLinger=()=>{if(gamePaused){pitchClearTimer=setTimeout(clearAfterLinger,120);return}clearResolvedPitch(id)};pitchClearTimer=setTimeout(clearAfterLinger,linger)
}
function beginLastContactFade(){if(lastContactFeedback?.pending){lastContactFeedback.pending=false;lastContactFeedback.fadeAt=Date.now();}}
function clearResolvedPitch(id){
 if(pitchAnim?.id!==id)return false;
 clearTimeout(pitchClearTimer);clearTimeout(swingResolveTimer);clearTimeout(swingWatchdogTimer);clearTimeout(battedResultTimer);pitchClearTimer=swingResolveTimer=swingWatchdogTimer=battedResultTimer=null;
 try{render3D?.disposePitch?.(id)}catch{}
 pitchAnim=null;
 maybeCommitPause();
 if(!game.over&&!game.transitioning){beginLastContactFade();fitHud();if(!pauseRequest&&!gamePaused)maybeCpuTurn()}
 return true
}
function resetCount(){game.balls=0;game.strikes=0;game.pa[battingTeam()]++}
function recordOut(){game.outs++;resetCount();if(game.outs>=2){game.transitioning=true;clearTimeout(cpuPitchTimer);setTimeout(nextHalf,650)}}
function walk(){let b=game.bases;if(b[0]&&b[1]&&b[2])game.score[battingTeam()]++;if(b[0]&&b[1])b[2]=1;if(b[0])b[1]=1;b[0]=1;resetCount()}
function hit(kind){let t=battingTeam(),b=game.bases,runs=0;game.hits[t]++;if(kind==='1B'){if(b[2])runs++;b[2]=b[1];b[1]=b[0];b[0]=1}else if(kind==='2B'){runs+=b[2]+b[1];b[2]=b[0];b[1]=1;b[0]=0}else if(kind==='3B'){runs+=b[0]+b[1]+b[2];b[0]=b[1]=0;b[2]=1}else{runs=1+b[0]+b[1]+b[2];b[0]=b[1]=b[2]=0;game.hrs[t]++}game.score[t]+=runs;resetCount()}
function nextHalf(){if(gamePaused){setTimeout(nextHalf,120);return}if(!game||game.over)return;let t=battingTeam();game.lines[t][game.inning-1]=game.score[t]-game.lines[t].reduce((a,b)=>a+(b||0),0);game.outs=0;game.balls=0;game.strikes=0;game.bases=[0,0,0];if(game.half===0){if(game.inning>=3&&game.score.home>game.score.away){game.transitioning=false;endGame();return}game.half=1}else{if(game.inning>=3&&game.score.home!==game.score.away){game.transitioning=false;endGame();return}game.half=0;game.inning++}game.transitioning=false;beginLastContactFade();fitHud();logoWipe();maybeCommitPause();if(!pauseRequest&&!gamePaused)maybeCpuTurn()}
function logoWipe(){let t=$('transition');t.classList.remove('play');void t.offsetWidth;t.classList.add('play')}
function showCall(t,opts={}){
 let c=$('callout');if(!c)return;clearTimeout(calloutTimer);const isHR=!!opts.homeRun||String(t).startsWith('HOME RUN');c.classList.remove('show','hr-callout');
 if(isHR){const sparks='<span class="hr-firework left">'+Array.from({length:8},(_,i)=>`<i class="spark s${i+1}"></i>`).join('')+'</span><span class="hr-text">'+String(t)+'</span><span class="hr-firework right">'+Array.from({length:8},(_,i)=>`<i class="spark s${i+1}"></i>`).join('')+'</span>';c.innerHTML=sparks;c.classList.add('hr-callout')}else{c.textContent=t}
 void c.offsetWidth;c.classList.add('show');const hold=opts.hold??(isHR?1500:680);calloutTimer=setTimeout(()=>{c.classList.remove('show');calloutTimer=null},hold)
}
function endGame(){game.over=true;show('screen-post');let a=game.away,h=game.home;$('finalScore').textContent=`${a.name.toUpperCase()} ${game.score.away} — ${game.score.home} ${h.name.toUpperCase()}`;let n=Math.max(game.lines.away.length,game.lines.home.length,game.inning);let head='<div class="boxrow head"><div>PLAYER</div>'+Array.from({length:n},(_,i)=>`<div>${i+1}</div>`).join('')+'<div>R</div><div>H</div></div>';function row(k){let p=game[k];return `<div class="boxrow"><b>${p.name.toUpperCase()}</b>${Array.from({length:n},(_,i)=>`<div>${game.lines[k][i]??0}</div>`).join('')}<b>${game.score[k]}</b><b>${game.hits[k]}</b></div>`}$('boxScore').innerHTML=head+row('away')+row('home');$('postSummary').textContent=`${setup.stadium} · ${game.inning} INNINGS · ${game.hrs.away+game.hrs.home} HR · ${game.hits.away+game.hits.home} HITS`;const sb=$('scorebook');if(sb)sb.innerHTML=(game.scorebook||[]).map((e,i)=>`<div class="scorebook-row"><b>${i+1}. ${e.half} ${e.inning}</b><span>${e.batter.toUpperCase()} vs ${e.pitcher.toUpperCase()}</span><strong>${e.detail}</strong><small>COUNT ${e.count}</small></div>`).join('')||'<div class="scorebook-row">NO PLAYS RECORDED</div>'}
$('backMatch').onclick=()=>{cleanupMatch();show('screen-menu');status('PRESS READY UP TO FIND AN OPPONENT');readyBtn.disabled=false;readyBtn.textContent='READY UP';$('singleBtn').disabled=false};
function cleanupMatch(){matchmakingGeneration++;clearTimeout(matchmakingRetryTimer);clearTimeout(coordinatorProbeTimer);clearTimeout(matchLinkTimer);clearTimeout(mainPeerWatchdogTimer);matchmakingRetryTimer=coordinatorProbeTimer=matchLinkTimer=mainPeerWatchdogTimer=null;coordinatorClaimInFlight=false;queueJoinInFlight=false;try{pendingIncomingMatch?.close()}catch{}pendingIncomingMatch=null;setAmbienceActive(false);gamePaused=false;pauseStarted=0;pauseRequest=null;pauseSequence=0;updatePauseButton();$('pauseMenu')?.classList.remove('show');$('pauseMenu')?.setAttribute('aria-hidden','true');$('screen-game')?.classList.remove('paused');clearTimeout(cpuPitchTimer);clearTimeout(cpuSwingTimer);clearTimeout(introTimer);clearTimeout(timingFeedbackTimer);clearTimeout(calloutTimer);calloutTimer=null;clearPitchLifecycleTimers();cancelAnimationFrame(introRAF);cancelAnimationFrame(versusIntroRAFHandle);cancelAnimationFrame(menuLoopRAFHandle);if(gameRAF)cancelAnimationFrame(gameRAF);gameRAF=null;gameLoopRunning=false;try{render3D?.resetMatch?.()}catch{}try{matchConn?.close()}catch{}try{coordConn?.close()}catch{}try{peer?.destroy()}catch{}try{coordPeer?.destroy()}catch{}peer=coordPeer=coordConn=matchConn=null;waiting=[];game=null;setup=null;pitchAnim=null;lastContactFeedback=null;matchCode=null;role=null;queueTicket=null;singlePlayer=false}
function onMatchData(m){if(!m||!m.t)return;if(m.t==='choice'){remoteChoice={...remoteChoice,name:m.name,season:m.season,locked:!!m.locked};renderCards();checkSelectionReady()}else if(m.t==='vote'){remoteChoice.vote=m.park;checkVotes()}else if(m.t==='setup')handleSetup(m);else if(m.t==='skip'){remoteChoice.skip=true;updateSkip();if(localChoice.skip)beginGame()}else if(m.t==='pitch')startPitch(m);else if(m.t==='swing'){if(localPitching()&&pitchAnim&&m.id===pitchAnim.id){showRemoteSwingVisual(m);resolveSwing(m)}}else if(m.t==='result'){if(pitchAnim&&m.id===pitchAnim.id){lastResolvedPacket=m;applyResult(m)}}else if(m.t==='pause_request'){queueOnlinePause(m.token)}else if(m.t==='pause_ready'){if(pauseRequest&&m.token===pauseRequest.token){pauseRequest.remoteReady=true;maybeCommitPause()}}else if(m.t==='pause_commit'){if(!pauseRequest||pauseRequest.token!==m.token)pauseRequest={token:String(m.token||pauseStateToken()),localReady:true,remoteReady:true,committed:true};else pauseRequest.committed=true;updatePauseButton();maybeCommitPause()}else if(m.t==='resume'){pauseRequest=null;resumeGame();updatePauseButton()}}
function attachMatch(c){
 if(!c||matchConn===c)return;if(matchConn){try{c.close()}catch{}return}
 clearTimeout(matchLinkTimer);matchLinkTimer=null;try{coordConn?.close()}catch{}coordConn=null;
 matchConn=c;c.on('data',onMatchData);c.on('close',()=>{if(!game?.over){alert('OPPONENT DISCONNECTED');cleanupMatch();show('screen-menu');readyBtn.disabled=false;readyBtn.textContent='READY UP';$('singleBtn').disabled=false;status('OPPONENT DISCONNECTED · READY UP AGAIN')}});requestAnimationFrame(openSelect)
}
function handleIncomingMatch(c,gen=matchmakingGeneration){
 if(gen!==matchmakingGeneration||!c)return;const md=c.metadata||{};if(md.kind!=='pcbl-show-match'){try{c.close()}catch{}return}
 if(matchConn){try{c.close()}catch{}return}
 if(matchCode&&md.code===matchCode){attachMatch(c);return}
 if(!matchCode){try{pendingIncomingMatch?.close()}catch{}pendingIncomingMatch=c;setTimeout(()=>{if(pendingIncomingMatch===c&&!matchCode){try{c.close()}catch{}pendingIncomingMatch=null}},5000);return}
 try{c.close()}catch{}
}
function onMatched(m){
 if(!m||matchConn||(m.ticket&&m.ticket!==queueTicket))return;role=m.role;matchCode=m.code;status('MATCH FOUND · CONNECTING…');clearTimeout(matchmakingRetryTimer);clearTimeout(coordinatorProbeTimer);matchmakingRetryTimer=coordinatorProbeTimer=null;
 if(pendingIncomingMatch&&pendingIncomingMatch.metadata?.code===matchCode){const c=pendingIncomingMatch;pendingIncomingMatch=null;attachMatch(c);return}
 if(role==='guest')connectOpponent(m,0,matchmakingGeneration);else{const matchedGen=matchmakingGeneration;clearTimeout(matchLinkTimer);matchLinkTimer=setTimeout(()=>{if(matchedGen===matchmakingGeneration&&!matchConn&&matchCode===m.code){matchCode=null;role=null;status('FINDING PLAYER…');joinQueue(matchedGen)}},4500)}
}
function connectOpponent(m,attempt=0,gen=matchmakingGeneration){
 if(gen!==matchmakingGeneration||matchConn||!peer?.open||matchCode!==m.code)return;
 let c;try{c=peer.connect(m.opponent,{reliable:true,metadata:{kind:'pcbl-show-match',code:m.code,ticket:queueTicket}})}catch{return retryOpponent(m,attempt,gen)}
 let done=false;const fail=()=>{if(done||matchConn||gen!==matchmakingGeneration)return;done=true;try{c.close()}catch{};retryOpponent(m,attempt,gen)};
 c.on('open',()=>{if(done||gen!==matchmakingGeneration){try{c.close()}catch{}return}done=true;attachMatch(c)});c.on('error',fail);clearTimeout(matchLinkTimer);matchLinkTimer=setTimeout(fail,1500+Math.min(attempt,3)*350)
}
function retryOpponent(m,attempt,gen){
 if(gen!==matchmakingGeneration||matchConn)return;clearTimeout(matchLinkTimer);
 if(attempt<3){status('MATCH FOUND · CONNECTING…');matchLinkTimer=setTimeout(()=>connectOpponent(m,attempt+1,gen),180+attempt*180);return}
 matchCode=null;role=null;status('FINDING PLAYER…');joinQueue(gen)
}
function coordinatorHandle(c){
 c.on('data',m=>{if(m?.t!=='ready'||!m.id)return;waiting=waiting.filter(w=>w.conn.open&&w.id!==m.id);waiting.push({conn:c,id:m.id,ticket:m.ticket});while(waiting.length>=2){const a=waiting.shift(),b=waiting.shift();if(!a?.conn?.open||!b?.conn?.open)continue;const mc=code();a.conn.send({t:'matched',role:'host',opponent:b.id,code:mc,ticket:a.ticket});b.conn.send({t:'matched',role:'guest',opponent:a.id,code:mc,ticket:b.ticket});break}});c.on('close',()=>waiting=waiting.filter(w=>w.conn!==c))
}
function scheduleQueueJoin(delay=220,gen=matchmakingGeneration){
 clearTimeout(matchmakingRetryTimer);matchmakingRetryTimer=setTimeout(()=>{if(gen===matchmakingGeneration&&!matchConn&&peer?.open&&!matchCode)joinQueue(gen)},delay)
}
function claimCoordinator(gen=matchmakingGeneration){
 if(gen!==matchmakingGeneration||matchConn||matchCode||!peer?.open||coordinatorClaimInFlight)return;coordinatorClaimInFlight=true;try{
  try{coordPeer?.destroy()}catch{}coordPeer=new Peer(MATCHMAKER);
  coordPeer.on('open',()=>{coordinatorClaimInFlight=false;if(gen!==matchmakingGeneration){try{coordPeer.destroy()}catch{}return}coordPeer.on('connection',coordinatorHandle);status('PUBLIC MATCHMAKING · WAITING FOR PLAYER…');scheduleQueueJoin(60,gen)});
  coordPeer.on('error',e=>{coordinatorClaimInFlight=false;try{coordPeer?.destroy()}catch{}coordPeer=null;if(gen!==matchmakingGeneration||matchConn||matchCode)return;if(e?.type==='unavailable-id')scheduleQueueJoin(100+Math.floor(Math.random()*120),gen);else scheduleQueueJoin(420,gen)})
 }catch{coordinatorClaimInFlight=false;coordPeer=null;scheduleQueueJoin(420,gen)}
}
function joinQueue(gen=matchmakingGeneration){
 if(gen!==matchmakingGeneration||matchConn||matchCode||!peer?.open||queueJoinInFlight)return;queueJoinInFlight=true;try{coordConn?.close()}catch{}coordConn=null;status('PUBLIC MATCHMAKING · WAITING FOR PLAYER…');
 let c;try{c=peer.connect(MATCHMAKER,{reliable:true,metadata:{kind:'queue',ticket:queueTicket}})}catch{queueJoinInFlight=false;claimCoordinator(gen);return}
 let opened=false,settled=false;const miss=()=>{if(settled||opened||gen!==matchmakingGeneration||matchConn||matchCode)return;settled=true;queueJoinInFlight=false;try{c.close()}catch{};claimCoordinator(gen)};
 c.on('open',()=>{if(gen!==matchmakingGeneration||matchConn||matchCode){try{c.close()}catch{}return}opened=true;settled=true;queueJoinInFlight=false;clearTimeout(coordinatorProbeTimer);coordConn=c;status('PUBLIC MATCHMAKING · WAITING FOR PLAYER…');c.on('data',m=>{if(m?.t==='matched')onMatched(m)});c.on('close',()=>{if(gen===matchmakingGeneration&&!matchConn&&!matchCode){coordConn=null;scheduleQueueJoin(180,gen)}});c.send({t:'ready',id:peer.id,ticket:queueTicket})});
 c.on('error',miss);clearTimeout(coordinatorProbeTimer);coordinatorProbeTimer=setTimeout(miss,850)
}
function startMatchPeer(gen=matchmakingGeneration){
 if(gen!==matchmakingGeneration||matchConn)return;clearTimeout(mainPeerWatchdogTimer);try{peer?.destroy()}catch{};peer=new Peer();peer.on('connection',c=>handleIncomingMatch(c,gen));
 peer.on('open',()=>{if(gen!==matchmakingGeneration)return;clearTimeout(mainPeerWatchdogTimer);readyBtn.textContent='SEARCHING…';status('PUBLIC MATCHMAKING · WAITING FOR PLAYER…');joinQueue(gen)});
 peer.on('disconnected',()=>{if(gen!==matchmakingGeneration||matchConn)return;status('RECONNECTING ONLINE…');try{peer.reconnect()}catch{};clearTimeout(mainPeerWatchdogTimer);mainPeerWatchdogTimer=setTimeout(()=>{if(gen===matchmakingGeneration&&!matchConn&&!peer?.open)startMatchPeer(gen)},1700)});
 peer.on('error',e=>{if(gen!==matchmakingGeneration||matchConn)return;if(e?.type==='peer-unavailable'){if(!matchCode){queueJoinInFlight=false;clearTimeout(coordinatorProbeTimer);claimCoordinator(gen)}return}if(['network','server-error','socket-error','disconnected'].includes(e?.type)){status('RECONNECTING ONLINE…');clearTimeout(mainPeerWatchdogTimer);mainPeerWatchdogTimer=setTimeout(()=>{if(gen===matchmakingGeneration&&!matchConn)startMatchPeer(gen)},650);return}status('ONLINE ERROR · TAP READY UP AGAIN');readyBtn.disabled=false;$('singleBtn').disabled=false;readyBtn.textContent='READY UP'})
}
async function readyUp(){
 cleanupMatch();singlePlayer=false;const gen=matchmakingGeneration;readyBtn.disabled=true;$('singleBtn').disabled=true;readyBtn.textContent='CONNECTING…';status('CONNECTING TO ONLINE…');
 try{await ensurePeerLibrary()}catch{if(gen!==matchmakingGeneration)return;status('ONLINE LIBRARY FAILED TO LOAD · TRY AGAIN');readyBtn.disabled=false;$('singleBtn').disabled=false;readyBtn.textContent='READY UP';return}
 if(gen!==matchmakingGeneration)return;queueTicket=uid()+'-'+Date.now();startMatchPeer(gen)
}
function startSingleplayer(){cleanupMatch();singlePlayer=true;role='single';matchCode='CPU-'+code();readyBtn.disabled=false;readyBtn.textContent='READY UP';status('SINGLEPLAYER · SELECT YOUR PLAYER');openSelect()}
$('pauseBtn').onclick=()=>{ensureGameAudio();togglePause()};$('resumeGame').onclick=resumeSynchronized;$('exitGame').onclick=()=>{resumeGame();cleanupMatch();show('screen-menu');status('PRESS READY UP TO FIND AN OPPONENT');readyBtn.disabled=false;readyBtn.textContent='READY UP';$('singleBtn').disabled=false};
$('cameraHeight').oninput=e=>{cameraHeight=+e.target.value;$('cameraHeightValue').textContent=cameraHeight.toFixed(1)};$('cameraZoom').oninput=e=>{cameraZoom=+e.target.value;$('cameraZoomValue').textContent=cameraZoom.toFixed(2)+'×'};$('gameVolume').oninput=e=>{ensureGameAudio();setGameVolume(+e.target.value)};
window.addEventListener('keydown',e=>{if((e.key==='Escape'||e.key.toLowerCase()==='p')&&game&&$('screen-game').classList.contains('active')){e.preventDefault();togglePause();return}if(gamePaused)e.stopImmediatePropagation()},{capture:true});window.addEventListener('pointerdown',()=>{if(game&&$('screen-game').classList.contains('active'))ensureGameAudio()},{once:false,passive:true});
readyBtn.onclick=readyUp;$('singleBtn').onclick=startSingleplayer;
// Deterministic browser smoke hook used by validation. It is dormant during
// normal play and lets the packaged build prove that pitch 3+ still advances.
window.PCBL_TEST_HOOKS={
 setSyntheticState(opts={}){clearPitchLifecycleTimers();singlePlayer=!!opts.singlePlayer;pauseRequest=null;gamePaused=false;lastResolvedPacket=null;setup={stadium:'PCBL MAIN FIELD',localHome:true};const awayOwner=opts.awayOwner||'remote',homeOwner=opts.homeOwner||(singlePlayer?'cpu':'local');game={inning:1,half:0,outs:0,balls:0,strikes:0,bases:[0,0,0],score:{away:0,home:0},lines:{away:[],home:[]},hits:{away:0,home:0},hrs:{away:0,home:0},pa:{away:0,home:0},scorebook:[],away:{name:opts.awayName||'Jarvis',season:'ALL TIME',owner:awayOwner},home:{name:opts.homeName||'Auden',season:'ALL TIME',owner:homeOwner},over:false,last:null,transitioning:false};pitchAnim=null;matchCode='TEST';},
 start(m){startPitch(m)},finish(m){finalizeResult(m)},clear(id){return clearResolvedPitch(id)},localSwing(type='regular'){swing(type);return this.state()},swingNow(type='regular'){if(!pitchAnim)return false;const at=pitchAnim.release+pitchAnim.duration;resolveSwing({t:'swing',id:pitchAnim.id,type,pci:{x:pitchAnim.tx,y:pitchAnim.ty},when:at-swingContactMs(game[battingTeam()].name,type),contactAt:at,contactDelta:0});return !!pitchAnim?.resolved},resolveSwingMessage(m){resolveSwing(m);return lastResolvedPacket},receive(m){onMatchData(m)},transmit(m){send(m)},requestPause(){requestPause()},resume(){resumeSynchronized()},mockConnection(fn){matchConn={open:true,send:fn||(()=>{})}},classifyZone(args){return classifyLandingZone(args)},simulateFlight(dx=0,dy=0,timing=0,type='regular'){if(!pitchAnim)return null;const bat=card(game[battingTeam()].name,game[battingTeam()].season),pit=card(game[pitchingTeam()].name,game[pitchingTeam()].season),vision=bat.ratings.vision/99,basePci=(.45+vision*.17)*GAMEPLAY_TUNING.pciScale,baseTime=(205+vision*120)*GAMEPLAY_TUNING.timingScale,effectiveContact=clamp(bat.ratings.contact-GAMEPLAY_TUNING.contactPenalty,1,99),ratingFactor=.48+.52*effectiveContact/99,dist=Math.hypot(dx,dy),cq=Math.max(0,1-dist/basePci)*Math.max(0,1-Math.abs(timing)/baseTime)*ratingFactor;return makeBattedFlight({type,pci:{x:pitchAnim.tx+dx,y:pitchAnim.ty+dy},when:pitchAnim.release+pitchAnim.duration+timing},cq,bat,pit)},baseDiamond(){return baseDiamond()},state(){return{pitchId:pitchAnim?.id??null,resolved:!!pitchAnim?.resolved,swingQueued:!!pitchAnim?.swingQueued,batPose:pitchAnim?.batPose||null,swingType:pitchAnim?.swingType||null,swingAt:pitchAnim?.swingAt??null,remoteSwingVisualId:pitchAnim?.remoteSwingVisualId??null,remoteSwingVisualAt:pitchAnim?.remoteSwingVisualAt??null,release:pitchAnim?.release??null,windupStart:pitchAnim?.windupStart??null,balls:game?.balls,strikes:game?.strikes,pa:game?.pa?.away,transitioning:!!game?.transitioning,paused:gamePaused,pauseRequest:pauseRequest?{...pauseRequest}:null,scorebook:game?.scorebook||[],lastResolvedPacket,lastContactFeedback}}
};
if(new URLSearchParams(location.search).has('alpha28test')){const out=document.createElement('pre');out.id='alpha28-runtime-result';document.body.appendChild(out);try{window.PCBL_TEST_HOOKS.setSyntheticState();for(let i=1;i<=5;i++){const id=9000+i;window.PCBL_TEST_HOOKS.start({id,windupStart:Date.now(),release:Date.now()+5,duration:10,pitch:0,pitchCode:'FB',tx:.5,ty:.5,velo:80,breakX:0,breakY:0,delivery:'overhand'});if(window.PCBL_TEST_HOOKS.state().pitchId!==id)throw new Error('pitch '+i+' did not start');window.PCBL_TEST_HOOKS.finish({id,result:i===3?'CS':'BALL',meta:{}});if(!window.PCBL_TEST_HOOKS.clear(id))throw new Error('pitch '+i+' did not clear');if(window.PCBL_TEST_HOOKS.state().pitchId!==null)throw new Error('pitch '+i+' remained active');}out.textContent='PASS: 5 sequential pitches cleared; pitch 3+ remains playable';document.body.dataset.alpha28Runtime='pass'}catch(e){out.textContent='FAIL: '+e.message;document.body.dataset.alpha28Runtime='fail'}}
// initial
show('screen-computer-required');primeNavigationAssets();const warm=()=>{try{ensure3D()}catch(e){console.warn('WebGL prewarm deferred',e)}};if('requestIdleCallback' in window)requestIdleCallback(warm,{timeout:1500});else setTimeout(warm,250);
})();
