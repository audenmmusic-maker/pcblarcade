(()=>{'use strict';
if(typeof THREE==='undefined'){window.PCBL3D={create:()=>null};return}
const D=window.PCBL_SHOW_DATA;
const HEIGHTS={Auden:6.167,Jason:5.333,Jarvis:6.417,Najee:5.5,Coel:5.833,Josef:6.167};
const WIDTH={Auden:1.00,Jason:.92,Jarvis:1.02,Najee:1.28,Coel:.86,Josef:1.62};
const SWING={
  Auden:{stance:.14,crouch:.10,load:.24,stride:.48,kick:.18,hip:1.02,torso:1.20,finish:1.42,oneHand:true},
  Jason:{stance:.06,crouch:.22,load:.28,stride:.34,kick:.42,hip:1.12,torso:1.30,finish:1.30,oneHand:false},
  Jarvis:{stance:.18,crouch:.06,load:.22,stride:.58,kick:.15,hip:.96,torso:1.15,finish:1.55,oneHand:true},
  Najee:{stance:.08,crouch:.20,load:.20,stride:.26,kick:.10,hip:1.18,torso:1.38,finish:1.38,oneHand:false},
  Coel:{stance:.08,crouch:.12,load:.18,stride:.20,kick:.06,hip:.92,torso:1.06,finish:1.22,oneHand:false},
  Josef:{stance:.08,crouch:.12,load:.18,stride:.20,kick:.06,hip:.92,torso:1.06,finish:1.22,oneHand:false}
};
const PITCH={
  Auden:{knee:.82,rock:.10,stride:1.25,torso:.82,arm:1.0,follow:1.0},
  Jason:{knee:.58,rock:.07,stride:1.28,torso:1.02,arm:1.08,follow:1.20},
  Jarvis:{knee:1.12,rock:.08,stride:1.35,torso:.92,arm:1.0,follow:1.13},
  Najee:{knee:.72,rock:.05,stride:1.00,torso:.78,arm:.92,follow:.82},
  Coel:{knee:.88,rock:.07,stride:1.08,torso:.82,arm:1.0,follow:1.0},
  Josef:{knee:.88,rock:.07,stride:1.08,torso:.82,arm:1.0,follow:1.0}
};
const COLORS={
  Auden:{skin:0xe0b28f,hair:0x5a3828,top:0x111318,bottom:0x17191d,shoe:0xe7e4dc,accent:0xd7dbe1},
  Jason:{skin:0xb8795f,hair:0x33251f,top:0xe2e4e7,bottom:0xd2d4d8,shoe:0xefefef,accent:0x202329},
  Jarvis:{skin:0xdfb89f,hair:0x3a2a22,top:0xc51e35,bottom:0x17191d,shoe:0xffffff,accent:0xffffff},
  Najee:{skin:0x5a3729,hair:0x171311,top:0x245c9b,bottom:0x1f3147,shoe:0x111318,accent:0xf36f21},
  Coel:{skin:0xe7bea3,hair:0x29221e,top:0x121418,bottom:0x806d53,shoe:0xecece8,accent:0xb6c0c7},
  Josef:{skin:0xe4b58e,hair:0xd6af55,top:0x070707,bottom:0x080808,shoe:0x050505,accent:0x181818}
};
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function lerp(a,b,t){return a+(b-a)*t}
function sm(t){t=clamp(t,0,1);return t*t*t*(t*(t*6-15)+10)}
function ease(t){t=clamp(t,0,1);return 1-Math.pow(1-t,3)}
function pitchMoveEnvelope(code,q){
 const pow={FB:1.18,CH:2.45,SL:3.10,SLRV:2.70,CRV:1.82,CURV:1.82,SCREW:2.55,KN:1.15}[String(code||'FB').toUpperCase()]||2.0;
 q=clamp(q,0,1);return Math.pow(q,pow);
}
function pitchSpin(code,q){const c=String(code||'FB').toUpperCase();if(c==='KN')return [q*3,q*4,q*2];if(c==='SL'||c==='SLRV')return [q*13,q*30,q*22];if(c==='CRV'||c==='CURV')return [q*30,q*10,q*7];if(c==='CH'||c==='SCREW')return [q*16,q*18,q*10];return [q*28,q*16,q*8]}
function mat(color,rough=.72,metal=.03){return new THREE.MeshPhongMaterial({color,shininess:Math.max(8,(1-rough)*100),specular:new THREE.Color(metal>.2?0x8a8a8a:0x252525)})}
function mesh(geo,material,parent,pos=[0,0,0],rot=[0,0,0]){const m=new THREE.Mesh(geo,material);m.position.set(...pos);m.rotation.set(...rot);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function line(points,color=0xffffff,opacity=1){const g=new THREE.BufferGeometry().setFromPoints(points);return new THREE.Line(g,new THREE.LineBasicMaterial({color,transparent:opacity<1,opacity}))}
function makeTextPlane(text,color='#fff',bg='transparent',w=2,h=.55,font=54){const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);if(bg!=='transparent'){x.fillStyle=bg;x.fillRect(0,0,c.width,c.height)}x.fillStyle=color;x.font=`900 ${font}px Arial`;x.textAlign='center';x.textBaseline='middle';x.fillText(text,c.width/2,c.height/2);const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;const m=new THREE.MeshBasicMaterial({map:tx,transparent:true,depthWrite:false});return new THREE.Mesh(new THREE.PlaneGeometry(w,h),m)}
function addBox(parent,w,h,d,color,x,y,z){return mesh(new THREE.BoxGeometry(w,h,d),mat(color),parent,[x,y,z])}
function addCylinder(parent,r,h,color,x,y,z,seg=10){return mesh(new THREE.CylinderGeometry(r,r,h,seg),mat(color),parent,[x,y,z])}
function addTree(parent,x,z,s=1,seed=1){
 const H=5;
 const trunk=addCylinder(parent,.17*s,3.00*s*H,0x4d3828,x,1.50*s*H,z,8);trunk.castShadow=false;trunk.receiveShadow=true;
 const limbColor=0x5a4432,leafPalette=[0x2f5d34,0x3a6a3d,0x457449,0x578656];
 for(let i=0;i<4;i++){
  const ang=((seed*41+i*89)%360)*Math.PI/180,len=(.64+.09*i)*s,y=(2.05*s+.31*i*s)*H;
  const branch=addCylinder(parent,.045*s,.82*s,limbColor,x+Math.cos(ang)*len*.26,y,z+Math.sin(ang)*len*.26,6);
  branch.rotation.z=Math.cos(ang)*.92;branch.rotation.x=Math.sin(ang)*-.92;
 }
 const canopy=new THREE.Group();canopy.position.set(x,0,z);canopy.userData.treeWind={phase:(seed%997)*.071,sway:.0048+((seed*13)%7)*.00052};parent.add(canopy);
 const crowns=[
  [0,4.62*s*H,0,1.46*s],[.70*s,4.00*s*H,.20*s,1.05*s],[-.66*s,4.08*s*H,-.14*s,1.10*s],[.23*s,5.18*s*H,-.36*s,.94*s],[-.20*s,5.42*s*H,.40*s,.88*s]
 ];
 crowns.forEach((c,i)=>{const geo=i===0?new THREE.SphereGeometry(c[3],10,8):new THREE.IcosahedronGeometry(c[3],1);const leaf=mesh(geo,mat(leafPalette[i%leafPalette.length],.92),canopy,[c[0],c[1],c[2]]);leaf.castShadow=false;leaf.receiveShadow=true;});
}
function animateParkTrees(root,now,enabled=true){
 if(!enabled)return;const t=now*.001;
 root.traverse(o=>{const w=o.userData?.treeWind;if(!w)return;const gust=.58+.42*Math.sin(t*.73+w.phase*.31),wave=Math.sin(t*1.15+w.phase)+.36*Math.sin(t*2.05+w.phase*1.7);o.rotation.z=wave*w.sway*gust;o.rotation.x=Math.sin(t*.91+w.phase*.77)*w.sway*.48*gust;});
}
const FACADE_TEX={};
function facadeTexture(color){
 const key=String(color);if(FACADE_TEX[key])return FACADE_TEX[key];
 const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');
 const base='#'+color.toString(16).padStart(6,'0');g.fillStyle=base;g.fillRect(0,0,512,512);
 const brickH=14,brickW=32;
 for(let row=0;row<Math.ceil(512/brickH);row++){
  const y=row*brickH,offset=(row%2)*Math.floor(brickW/2);
  g.fillStyle='rgba(215,195,182,.18)';g.fillRect(0,y,512,1.6);
  for(let x=-offset;x<512+brickW;x+=brickW){
   const shade=((row*17+x*3+color)%19)-9,rr=Math.max(0,Math.min(255,145+shade)),gg=Math.max(0,Math.min(255,72+shade)),bb=Math.max(0,Math.min(255,62+shade));
   g.fillStyle=`rgba(${rr},${gg},${bb},.22)`;g.fillRect(x+1.2,y+1.2,brickW-2.5,brickH-2.6);
   g.fillStyle='rgba(255,255,255,.05)';g.fillRect(x+2.2,y+2.1,brickW-6,1.3);
   g.fillStyle='rgba(0,0,0,.05)';g.fillRect(x+1.3,y+brickH-3.1,brickW-3.0,1.3);
  }
 }
 for(let row=0;row<10;row++)for(let col=0;col<9;col++){
  const x=20+col*55,y=16+row*49,lit=((row*11+col*7+color)%17===0);
  g.fillStyle=lit?'#b8a37a':'#233038';g.fillRect(x,y,24,31);
  g.fillStyle='rgba(200,194,178,.60)';g.fillRect(x-3,y-3,30,3);g.fillRect(x-3,y+31,30,3);
  g.fillStyle='rgba(255,255,255,.10)';g.fillRect(x+2,y+2,2,25);
 }
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;FACADE_TEX[key]=t;return t
}
function addBuilding(parent,x,z,w,d,h,color=0x98493f){
 const tx=facadeTexture(color).clone();tx.needsUpdate=true;tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.repeat.set(Math.max(1,w/36),Math.max(1,h/34));const material=new THREE.MeshPhongMaterial({map:tx,shininess:5,specular:0x111111});const b=mesh(new THREE.BoxGeometry(w,h,d,3,6,3),material,parent,[x,h/2,z]);b.castShadow=false;b.receiveShadow=true;
 addBox(parent,w+.5,.35,d+.5,0x6f342e,x,h+.16,z);addBox(parent,w+.3,.55,d+.3,0x6a625c,x,.27,z);return b
}
function addFence(parent,a,b,height=6,color=0x20282d,meshLines=true){const dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz),ang=Math.atan2(dx,dz),mid={x:(a.x+b.x)/2,z:(a.z+b.z)/2};const posts=new THREE.Group();parent.add(posts);for(let t=0;t<=1;t+=Math.min(.12,4/len)){const x=lerp(a.x,b.x,t),z=lerp(a.z,b.z,t);addCylinder(posts,.07,height,color,x,height/2,z,6)}if(meshLines){const pts=[];for(let y=.7;y<height;y+=.65){pts.push(new THREE.Vector3(a.x,y,a.z),new THREE.Vector3(b.x,y,b.z))}for(let t=0;t<=1;t+=Math.min(.08,3/len)){const x=lerp(a.x,b.x,t),z=lerp(a.z,b.z,t);pts.push(new THREE.Vector3(x,.4,z),new THREE.Vector3(x,height,z))}const g=new THREE.BufferGeometry().setFromPoints(pts);const ls=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color,transparent:true,opacity:.65}));parent.add(ls)}return {len,ang,mid}}
function wallSeg(parent,a,b,h,color=0x8d3e32,y=0){const dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz),ang=Math.atan2(dx,dz),mid={x:(a.x+b.x)/2,z:(a.z+b.z)/2};const m=addBox(parent,.6,h,len,color,mid.x,y+h/2,mid.z);m.rotation.y=ang;return m}
function foulLine(parent,x,z,color=0xf1efe7){const len=Math.hypot(x,z),ang=Math.atan2(x,z),mid={x:x/2,z:z/2};const m=addBox(parent,.12,.025,len,color,mid.x,.02,mid.z);m.rotation.y=ang;return m}
const SURFACE_TEX={};
function surfaceTex(kind,base,alt){
 const key=kind+base+alt;if(SURFACE_TEX[key])return SURFACE_TEX[key];
 const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');
 g.fillStyle='#'+base.toString(16).padStart(6,'0');g.fillRect(0,0,512,512);
 if(kind==='turf'){
  // Uniform short-pile astroturf. No mowing stripes or decorative grass bands:
  // detail comes only from dense, low-contrast synthetic fibers and infill.
  g.lineCap='round';
  for(let i=0;i<14500;i++){
   const x=(i*83+i*i*11)%512,y=(i*149+i*i*5)%512,len=1.1+(i%6)*.34,lean=((i%9)-4)*.035;
   g.strokeStyle=i%4===0?'rgba(205,232,190,.038)':i%4===1?'rgba(22,54,20,.043)':i%4===2?'rgba(82,130,67,.035)':'rgba(44,91,37,.032)';
   g.lineWidth=.42+(i%3)*.10;g.beginPath();g.moveTo(x,y);g.lineTo(x+lean,y+len);g.stroke();
  }
  for(let i=0;i<5200;i++){
   const x=(i*59+i*i*7)%512,y=(i*181+i*i*3)%512,r=.22+(i%4)*.08;
   g.fillStyle=i%3===0?'rgba(18,37,15,.030)':i%3===1?'rgba(180,207,164,.022)':'rgba(77,112,63,.025)';g.fillRect(x,y,r,r);
  }
 }else{
  // Smooth poured concrete: broad tonal mottling, sparse aggregate, subtle seams.
  for(let i=0;i<9500;i++){const x=(i*83+i*i)%512,y=(i*157)%512,q=124+(i*31)%44;g.fillStyle=`rgba(${q},${q},${q},.038)`;g.fillRect(x,y,1+(i%2),1+(i%2))}
  g.strokeStyle='rgba(75,78,80,.15)';g.lineWidth=1;for(let x=0;x<512;x+=196){g.beginPath();g.moveTo(x,0);g.lineTo(x,512);g.stroke()}for(let y=0;y<512;y+=196){g.beginPath();g.moveTo(0,y);g.lineTo(512,y);g.stroke()}
  g.fillStyle='rgba(255,255,255,.025)';for(let y=28;y<512;y+=73)g.fillRect(0,y,512,1);
 }
 const tx=new THREE.CanvasTexture(c);tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.repeat.set(8,8);tx.colorSpace=THREE.SRGBColorSpace;tx.anisotropy=8;SURFACE_TEX[key]=tx;return tx
}
function groundSurface(parent,w,d,kind,base,alt){
 const tx=surfaceTex(kind,base,alt).clone();tx.needsUpdate=true;tx.repeat.set(Math.max(2,w/42),Math.max(2,d/42));
 const m=new THREE.MeshPhongMaterial({map:tx,bumpMap:tx,bumpScale:kind==='turf'?.010:.006,shininess:kind==='turf'?1.5:7,specular:kind==='turf'?0x0b1209:0x343434});
 const p=mesh(new THREE.PlaneGeometry(w,d+65,24,24),m,parent,[0,-.025,(d-65)/2],[-Math.PI/2,0,0]);p.castShadow=false;p.receiveShadow=true;return p
}
function stripeGround(parent,w,d,base,alt){groundSurface(parent,w,d,'turf',base,alt)}
function buildDiamond(parent,concrete=false,includeMound=true){const lineMat=mat(0xf1efe7,.8);const plateShape=new THREE.Shape();const ph=17/24,ps=8.5/12;plateShape.moveTo(-ph,-ph);plateShape.lineTo(ph,-ph);plateShape.lineTo(ph,0);plateShape.lineTo(0,ph);plateShape.lineTo(-ph,0);plateShape.closePath();const plateGeo=new THREE.ExtrudeGeometry(plateShape,{depth:.055,bevelEnabled:false,steps:1});const plate=mesh(plateGeo,mat(0xff6a00,.96),parent,[0,.065,0],[-Math.PI/2,0,0]);plate.castShadow=false;plate.receiveShadow=true;const baseGeo=new THREE.BoxGeometry(.8,.05,.8);for(const [x,z] of [[42,42],[-42,42],[0,84]]){const b=mesh(baseGeo,lineMat,parent,[x,.04,z],[0,Math.PI/4,0]);b.castShadow=false}foulLine(parent,-75,75);foulLine(parent,75,75);if(includeMound){const mound=mesh(new THREE.CylinderGeometry(3.2,3.6,.18,32),mat(concrete?0x999a95:0x8b684e),parent,[0,.08,48]);mound.receiveShadow=true;}addBox(parent,2.0,.08,.35,0xece8dc,0,.21,48)}
function addApartmentRing(parent,deep=false){
 const brick=[0x95493e,0x8c433a,0x9d5146,0x874039];
 const north=deep?252:146,south=-74,east=111,west=-111;
 // North / center-field side: overlapping Stuy Town slabs rather than an isolated skyline.
 const nx=deep?[-92,-50,-5,41,87]:[-91,-48,-4,43,88];nx.forEach((x,i)=>addBuilding(parent,x,north+(i%2)*8,38+(i%2)*7,20,48+(i%3)*7,brick[i%4]));
 // East and west sides continue from behind home plate through the outfield, enclosing the courtyard on both sides.
 const sideCount=deep?7:6,step=deep?44:34;for(const x of [west,east])for(let i=0;i<sideCount;i++){const z=-34+i*step;addBuilding(parent,x+(i%2?2:-2),z,24,39+(i%2)*5,45+(i%3)*7,brick[(i+(x>0?1:2))%4])}
 // South / camera side is still physically populated so orbiting intro shots never reveal an empty edge.
 for(let i=0;i<5;i++)addBuilding(parent,-86+i*43,south-(i%2)*6,39,22,45+(i%3)*7,brick[(i+2)%4]);
 // Corner slabs visible in the supplied aerial references.
 addBuilding(parent,-94,deep?219:118,27,35,53,brick[1]);addBuilding(parent,94,deep?219:118,27,35,50,brick[2]);addBuilding(parent,-96,-46,26,34,48,brick[0]);addBuilding(parent,96,-46,26,34,51,brick[3]);
 // Courtyard paths and dense tree belt keep the field visually embedded inside Stuy Town.
 const walk=mat(0xaaa9a1,.95);mesh(new THREE.BoxGeometry(190,.04,9),walk,parent,[0,.01,deep?222:121]);mesh(new THREE.BoxGeometry(190,.04,8),walk,parent,[0,.01,-48]);mesh(new THREE.BoxGeometry(9,.04,deep?300:205),walk,parent,[-87,.01,deep?105:56]);mesh(new THREE.BoxGeometry(9,.04,deep?300:205),walk,parent,[87,.01,deep?105:56]);
 const treeScale=deep?1.62:1.48;
 for(let i=0;i<14;i++){addTree(parent,-82+i*12.6,deep?217:113,1.03*treeScale,500+i);addTree(parent,-84,-30+i*(deep?19:13),.98*treeScale,540+i);addTree(parent,84,-30+i*(deep?19:13),.98*treeScale,580+i)}for(let i=0;i<10;i++)addTree(parent,-74+i*16.5,-42,.88*treeScale,620+i)
}
function buildStuy(parent,type){
 const concrete=type==='polo';if(concrete){groundSurface(parent,180,245,'concrete',0x999b96,0x999b96);buildDiamond(parent,true,false)}else{stripeGround(parent,185,180,0x4f873f,0x5a9748);buildDiamond(parent,false,false)}
 addApartmentRing(parent,type==='polo');
 if(type==='main'){
  const pts=[{x:-51,z:51},{x:-36,z:81},{x:37,z:81},{x:51,z:51}];for(let i=0;i<pts.length-1;i++){wallSeg(parent,pts[i],pts[i+1],4.7,0x7d382f);addFence(parent,pts[i],pts[i+1],5.2,0x1f292c,true)}
 }else{
  const side=62/Math.SQRT2;wallSeg(parent,{x:-side,z:8},{x:-side,z:209},4.5,0x8a3e34);wallSeg(parent,{x:side,z:8},{x:side,z:209},4.5,0x8a3e34);wallSeg(parent,{x:-side,z:209},{x:side,z:209},5.0,0xe6e3dc);addFence(parent,{x:-side,z:8},{x:-side,z:209},9.5,0x1b2427,true);addFence(parent,{x:side,z:8},{x:side,z:209},9.5,0x1b2427,true);addFence(parent,{x:-side,z:209},{x:side,z:209},10,0x1b2427,true)
 }
}
function buildMurphy(parent){stripeGround(parent,220,220,0x4d873f,0x59984a);buildDiamond(parent,false);foulLine(parent,-100/Math.SQRT2,100/Math.SQRT2);foulLine(parent,100/Math.SQRT2,100/Math.SQRT2);
 // Con Ed complex and stacks beyond center field. The factory footprint/roof
 // now extends under every stack so no chimney is floating without a building.
 addBuilding(parent,-10,180,138,30,42,0x963f34);addBox(parent,142,10,24,0x7e352d,-10,48,180);for(const x of [-48,-16,17,50]){addCylinder(parent,3.0,72,0x707778,x,85,182,16);addCylinder(parent,3.6,2.2,0x50575a,x,121,182,16)}
 // Alpha 42: consistent Murphy outfield fence, roughly half the old tall-RF height.
 const mh=13.5;addFence(parent,{x:88,z:92},{x:25,z:130},mh,0x20282d,true);addFence(parent,{x:25,z:130},{x:0,z:130},mh,0x20282d,true);addFence(parent,{x:0,z:130},{x:-72,z:72},mh,0x1c2427,true);
 for(let i=0;i<8;i++)addTree(parent,-100+i*22,142+(i%2)*8,1.0,300+i);
 // FDR + river on the real eastern side.
 addBox(parent,35,.5,270,0x5d6264,132,.5,120);for(let z=15;z<245;z+=28){addBox(parent,2.2,9,2.2,0x777c7e,118,4.5,z);addBox(parent,2.2,9,2.2,0x777c7e,146,4.5,z)}addBox(parent,70,.05,290,0x355d6d,185,-.02,125);for(let z=0;z<250;z+=24){addBox(parent,22,.06,.25,0xe8e8e5,132,.78,z)}
 // lower Manhattan-ish industrial skyline cue beyond the open left side.
 addBuilding(parent,-125,170,28,22,38,0x7f8587);addBuilding(parent,-155,195,35,22,55,0x676f72);
}
function buildParkScene(root,name){while(root.children.length)root.remove(root.children[0]);if(name==='MURPHY PARK')buildMurphy(root);else if(name==='POLO RINK')buildStuy(root,'polo');else buildStuy(root,'main')}

// ---------------------------------------------------------------------------
// SPORTS EDITION — anatomically proportioned, textured raster character system.
// Player identity, outfit palette and articulated gameplay rig are retained.
// ---------------------------------------------------------------------------
const BODY={
 Auden:{width:.96,belly:.94,shoulders:1.03,hips:.95,head:1.06,leg:1.00,arm:.99},
 Jason:{width:.96,belly:.99,shoulders:.98,hips:.97,head:1.10,leg:.95,arm:.96},
 Jarvis:{width:.96,belly:.92,shoulders:1.04,hips:.93,head:1.03,leg:1.08,arm:1.06},
 Najee:{width:1.18,belly:1.16,shoulders:1.17,hips:1.13,head:1.09,leg:1.02,arm:1.06},
 Coel:{width:.91,belly:.90,shoulders:.94,hips:.90,head:1.05,leg:1.02,arm:.98},
 Josef:{width:1.55,belly:1.32,shoulders:1.72,hips:1.30,head:1.05,leg:1.18,arm:1.58}
};
const SWING2={
 Auden:{crouch:.08,kick:.14,stride:.38,load:.22,turn:1.0,finish:1.18},
 Jason:{crouch:.18,kick:.34,stride:.28,load:.26,turn:1.08,finish:1.02},
 Jarvis:{crouch:.05,kick:.10,stride:.48,load:.20,turn:.95,finish:1.28},
 Najee:{crouch:.17,kick:.08,stride:.22,load:.18,turn:1.14,finish:1.10},
 Coel:{crouch:.10,kick:.04,stride:.18,load:.16,turn:.90,finish:.96},
 Josef:{crouch:.10,kick:.04,stride:.18,load:.16,turn:.90,finish:.96}
};
// Pitch deliveries are authored as player-specific biomechanics rather than a
// single generic throw.  t===1.0 is ball release; 1.0–1.42 is deceleration.
// The four referenced deliveries were matched from the supplied rear-view clips.
// Coel keeps the neutral reference delivery until a dedicated clip exists.
const PITCH2={
 // Lower-half inspiration is deliberately blended into each PCBL player's own
 // supplied motion instead of cloning an MLB delivery wholesale.
 Auden:{
  lift:1.24,stride:1.30,closed:.42,hip:1.18,chest:1.30,tilt:.44,drive:1.28,finish:1.30,
  stepBack:.035,sit:.082,cross:.018,lateral:.028,armSlot:.045,leadBlock:.95,
  liftCurve:[0,.18,.78,1,.90,.46,.10,0,0,0],strideCurve:[0,0,0,.015,.12,.47,.86,1,1,1],
  backCurve:[0,.35,1,.72,.22,0,0,0,0,0],sitCurve:[0,.20,.58,.92,1,.82,.36,.08,0,0],
  throwX:[.018,.020,.030,.075,.150,.185,.158,.050,-.080,-.105],
  throwY:[.225,.228,.210,.115,.050,.185,.350,.405,.145,.085],
  throwZ:[.112,.110,.090,-.075,-.235,-.260,-.135,.355,.285,.120],
  gloveX:[.018,.020,.028,.055,.092,.130,.110,.022,-.012,-.006],
  gloveY:[.225,.228,.214,.190,.205,.228,.214,.145,.120,.118],
  gloveZ:[.110,.108,.095,.180,.285,.345,.300,.090,.055,.050]
 },
 Jason:{
  lift:1.28,stride:1.08,closed:.36,hip:1.08,chest:1.18,tilt:.41,drive:1.04,finish:1.15,
  stepBack:.145,sit:.060,cross:.012,lateral:.018,armSlot:.045,leadBlock:.88,
  liftCurve:[0,.08,.38,.82,1,.78,.26,.03,0,0],strideCurve:[0,0,0,0,.12,.50,.84,1,1,1],
  backCurve:[0,.42,1,1,.70,.24,0,0,0,0],sitCurve:[0,.10,.34,.68,.94,1,.60,.20,0,0],
  throwX:[.018,.020,.026,.065,.130,.165,.150,.050,-.070,-.095],
  throwY:[.145,.148,.138,.090,.045,.175,.325,.385,.140,.080],
  throwZ:[.112,.108,.088,-.055,-.205,-.225,-.120,.330,.270,.115],
  gloveX:[.018,.022,.032,.070,.110,.145,.120,.025,-.014,-.008],
  gloveY:[.145,.148,.142,.126,.176,.224,.216,.148,.120,.116],
  gloveZ:[.110,.106,.090,.170,.270,.330,.285,.090,.055,.050]
 },
 Jarvis:{
  lift:1.02,stride:1.42,closed:.35,hip:1.13,chest:1.32,tilt:.56,drive:1.24,finish:1.38,
  stepBack:.028,sit:.052,cross:.078,lateral:.070,armSlot:.082,leadBlock:.84,
  liftCurve:[0,.15,.72,1,.88,.42,.08,0,0,0],strideCurve:[0,0,0,.03,.20,.58,.90,1,1,1],
  backCurve:[0,.25,.72,.55,.15,0,0,0,0,0],sitCurve:[0,.12,.40,.68,.85,.72,.38,.16,.04,0],
  throwX:[.026,.030,.055,.125,.205,.240,.215,.075,-.120,-.155],
  throwY:[.185,.185,.165,.080,.030,.150,.305,.365,.125,.060],
  throwZ:[.120,.115,.080,-.110,-.285,-.305,-.170,.385,.325,.150],
  gloveX:[.026,.030,.050,.100,.155,.188,.145,.030,-.025,-.012],
  gloveY:[.185,.185,.168,.132,.170,.216,.206,.142,.112,.105],
  gloveZ:[.118,.115,.095,.195,.300,.370,.315,.090,.050,.045]
 },
 Najee:{
  lift:.70,stride:.96,closed:.22,hip:.94,chest:1.03,tilt:.28,drive:.86,finish:.88,
  stepBack:.075,sit:.038,cross:.018,lateral:.020,armSlot:.052,leadBlock:.80,
  liftCurve:[0,.05,.30,.68,1,.56,.10,0,0,0],strideCurve:[0,0,.015,.08,.35,.72,.94,1,1,1],
  backCurve:[0,.55,1,.66,.10,0,0,0,0,0],sitCurve:[0,.08,.25,.55,.78,.68,.32,.10,0,0],
  throwX:[.018,.020,.030,.060,.110,.135,.125,.040,-.055,-.075],
  throwY:[.168,.168,.155,.105,.060,.190,.300,.365,.145,.085],
  throwZ:[.108,.105,.088,-.045,-.175,-.190,-.105,.310,.255,.110],
  gloveX:[.018,.020,.030,.060,.096,.125,.105,.022,-.012,-.006],
  gloveY:[.168,.168,.158,.138,.172,.208,.202,.145,.120,.116],
  gloveZ:[.106,.104,.090,.165,.250,.310,.270,.085,.052,.046]
 },
 Coel:{
  // Compact, almost quarterback-like step-and-throw: limited windup, quick
  // shoulder load, direct stride, then a shorter athletic follow-through.
  lift:.48,stride:.84,closed:.16,hip:.90,chest:1.00,tilt:.24,drive:.82,finish:.82,
  stepBack:.045,sit:.030,cross:.002,lateral:.012,armSlot:.040,leadBlock:.76,
  liftCurve:[0,.02,.12,.38,.72,.48,.08,0,0,0],strideCurve:[0,.01,.06,.18,.48,.78,.95,1,1,1],
  backCurve:[0,.65,1,.45,.05,0,0,0,0,0],sitCurve:[0,.04,.16,.32,.52,.48,.25,.08,0,0],
  throwX:[.020,.025,.040,.080,.125,.150,.145,.050,-.050,-.070],
  throwY:[.178,.180,.170,.155,.185,.255,.320,.365,.155,.095],
  throwZ:[.100,.095,.075,.010,-.085,-.120,-.075,.285,.235,.105],
  gloveX:[.020,.024,.038,.068,.100,.122,.100,.022,-.010,-.006],
  gloveY:[.178,.180,.174,.160,.178,.202,.198,.142,.118,.114],
  gloveZ:[.100,.096,.082,.140,.220,.270,.235,.080,.048,.042]
 },
 Josef:{
  lift:.48,stride:.84,closed:.16,hip:.90,chest:1.00,tilt:.24,drive:.82,finish:.82,
  stepBack:.045,sit:.030,cross:.002,lateral:.012,armSlot:.040,leadBlock:.76,
  liftCurve:[0,.02,.12,.38,.72,.48,.08,0,0,0],strideCurve:[0,.01,.06,.18,.48,.78,.95,1,1,1],
  backCurve:[0,.65,1,.45,.05,0,0,0,0,0],sitCurve:[0,.04,.16,.32,.52,.48,.25,.08,0,0],
  throwX:[.020,.025,.040,.080,.125,.150,.145,.050,-.050,-.070],
  throwY:[.178,.180,.170,.155,.185,.255,.320,.365,.155,.095],
  throwZ:[.100,.095,.075,.010,-.085,-.120,-.075,.285,.235,.105],
  gloveX:[.020,.024,.038,.068,.100,.122,.100,.022,-.010,-.006],
  gloveY:[.178,.180,.174,.160,.178,.202,.198,.142,.118,.114],
  gloveZ:[.100,.096,.082,.140,.220,.270,.235,.080,.048,.042]
 }
};
// Raster sports rendering: shared diffuse/normal/specular textures, no outline shells.
const MATERIALS=new Map(),DETAILS={};
function detailMaps(kind){
 if(DETAILS[kind])return DETAILS[kind];
 const size=256,can=()=>{const c=document.createElement('canvas');c.width=c.height=size;return c};
 const diffuse=can(),normal=can(),spec=can(),dc=diffuse.getContext('2d'),nc=normal.getContext('2d'),sc=spec.getContext('2d');
 const di=dc.createImageData(size,size),ni=nc.createImageData(size,size),si=sc.createImageData(size,size);
 const h=(x,y)=>{const noise=Math.sin(x*127.1+y*311.7)*43758.5453;const n=noise-Math.floor(noise);return kind==='fabric'?Math.sin(x*Math.PI)*.05+Math.sin(x*1.57)*Math.cos(y*1.57)*.28+n*.1:kind==='hair'?Math.sin(x*.62+Math.sin(y*.06))*.3+n*.08:kind==='skin'?n*.1: n*.18};
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const i=(y*size+x)*4,v=h(x,y),tone=kind==='hair'?224+v*30:244+v*16;
  di.data.set([tone,tone,tone,255],i);
  ni.data.set([128-(h(x+1,y)-h(x-1,y))*48,128-(h(x,y+1)-h(x,y-1))*48,250,255],i);
  const sp=kind==='fabric'?32:kind==='skin'?90+v*50:kind==='hair'?100+v*55:145+v*30;si.data.set([sp,sp,sp,255],i);
 }
 dc.putImageData(di,0,0);nc.putImageData(ni,0,0);sc.putImageData(si,0,0);
 const tex=c=>{const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;return t};
 const map=tex(diffuse);map.colorSpace=THREE.SRGBColorSpace;return DETAILS[kind]={map,normalMap:tex(normal),specularMap:tex(spec)};
}
function sportsMat(color,kind='fabric'){
 const key=color+':'+kind;if(MATERIALS.has(key))return MATERIALS.get(key);
 const baseColor=new THREE.Color(color);if(kind==='fabric'&&Math.max(baseColor.r,baseColor.g,baseColor.b)<.025)baseColor.multiplyScalar(1.5).addScalar(.017);
 const m=new THREE.MeshPhongMaterial({color:baseColor,...detailMaps(kind),normalScale:new THREE.Vector2(kind==='skin'?.085:kind==='fabric'?.18:.22,kind==='skin'?.085:kind==='fabric'?.18:.22),shininess:kind==='skin'?20:kind==='hair'?15:kind==='metal'?68:kind==='rubber'?10:5,specular:kind==='skin'?0x302823:kind==='metal'?0xbdbdbd:kind==='hair'?0x171513:kind==='rubber'?0x202020:0x111111});MATERIALS.set(key,m);return m;
}
function kindFor(color){for(const c of Object.values(COLORS)){if(color===c.skin)return 'skin';if(color===c.hair)return 'hair';if(color===c.shoe)return 'rubber'}return 'fabric'}
function cmesh(geo,color,parent,pos=[0,0,0],scale=[1,1,1],outline=false,rot=[0,0,0],kind){
 const m=new THREE.Mesh(geo,sportsMat(color,kind||kindFor(color)));m.position.set(...pos);m.scale.set(...scale);m.rotation.set(...rot);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
}
function oval(parent,rx,ry,rz,color,pos=[0,0,0],seg=32,outline=false){return cmesh(new THREE.SphereGeometry(1,seg,24),color,parent,pos,[rx,ry,rz])}
// Elliptical cross-sections keep a continuous silhouette instead of stacked balls.
function sectionGeometry(rings,segments=40){
 const pos=[],uv=[],idx=[];
 if(rings.length>3){const a=new THREE.CatmullRomCurve3(rings.map(r=>new THREE.Vector3(r[0],r[1],r[2])),false,'catmullrom',.25),b=new THREE.CatmullRomCurve3(rings.map(r=>new THREE.Vector3(r[3]||0,r[4]||0,0)),false,'catmullrom',.25);rings=Array.from({length:(rings.length-1)*4+1},(_,i)=>{const t=i/((rings.length-1)*4),v=a.getPoint(t),c=b.getPoint(t);return[v.x,Math.max(.001,v.y),Math.max(.001,v.z),c.x,c.y]})}
 rings.forEach(([y,rx,rz,cx=0,cz=0],j)=>{for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2;pos.push(cx+Math.sin(a)*rx,y,cz+Math.cos(a)*rz);uv.push(i/segments,j/(rings.length-1))}});
 for(let j=0;j<rings.length-1;j++)for(let i=0;i<segments;i++){const a=j*(segments+1)+i,b=a+segments+1;idx.push(a,a+1,b,a+1,b+1,b)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
}
function roundedLimb(parent,len,r,color,name){
 const pivot=new THREE.Group();pivot.name=name;parent.add(pivot);
 const fore=name.includes('Fore'),shin=name.includes('Shin'),thigh=name.includes('Thigh');
 const factors=fore?[.74,1.02,1,.82,.63,.59]:shin?[.91,1.13,1.12,.84,.60,.56]:thigh?[1.13,1.18,1.08,.94,.85,.78]:[.88,1.06,1,.88,.77,.70];
 const rings=factors.map((v,i)=>[-len*i/5,r*v,r*v*.86,0,(shin?.025:fore?-.018:0)*Math.sin(i/5*Math.PI)]).reverse();
 const body=cmesh(sectionGeometry(rings,40),color,pivot);body.userData.part=name;return pivot;
}
function curveMesh(parent,points,r,color,kind='skin'){
 const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
 return cmesh(new THREE.TubeGeometry(curve,32,r,10,false),color,parent,[0,0,0],[1,1,1],false,[0,0,0],kind);
}
function makeEye(parent,x,y,z,r){
 const e=oval(parent,.139*r,.052*r,.024*r,0xd2c6b4,[x,y,z]);e.material=new THREE.MeshPhongMaterial({color:0xddd7c9,shininess:36,specular:0x666666});
 const iris=oval(parent,.045*r,.044*r,.016*r,0x544438,[x,y,z+.022*r]);iris.material=mat(0x544438,.4);
 const pupil=oval(iris,.48,.65,.35,0x17191a,[0,0,.70]);pupil.material=mat(0x17191a,.35);
 for(const sign of [-1,1])curveMesh(parent,[[x-.139*r,y,z],[x,y+sign*.049*r,z+.020*r],[x+.139*r,y,z]],.013*r,CURRENT_SKIN);
 e.userData.baseY=e.scale.y;iris.userData.baseY=iris.scale.y;return[e,iris];
}
let CURRENT_SKIN=0xe0b28f;
function makeGlasses(parent,r,color){
 const g=new THREE.Group();g.name='Fitted optical frames';parent.add(g);const heavy=color===0x111111;
 for(const sx of [-1,1]){
  // Rounded rectangular rims, clear lenses and a wrapped temple ending over the ear.
  const outline=[[-.17,.12],[.15,.12],[.209,.078],[.195,-.092],[.13,-.126],[-.15,-.126],[-.211,-.081],[-.214,.067]],points=outline.map(([x,y])=>new THREE.Vector3((sx*.265+x)*r,(.147+y)*r,(1.035-.055*Math.abs(sx*.265+x))*r));
  const rim=new THREE.CatmullRomCurve3(points,true,'centripetal');cmesh(new THREE.TubeGeometry(rim,64,r*(heavy?.020:.0125),8,true),color,g,[0,0,0],[1,1,1],false,[0,0,0],heavy?'rubber':'metal');
  const shape=new THREE.Shape();const contour=rim.getPoints(64);shape.moveTo(contour[0].x,contour[0].y);for(const p of contour.slice(1))shape.lineTo(p.x,p.y);
  const lensGeo=new THREE.ShapeGeometry(shape,32);const lp=lensGeo.attributes.position;for(let i=0;i<lp.count;i++)lp.setZ(i,r*(1.030-.055*Math.abs(lp.getX(i)/r)));
  const lens=new THREE.Mesh(lensGeo,new THREE.MeshPhongMaterial({color:0xd5e7ed,transparent:true,opacity:.085,shininess:95,specular:0xbacbd3,depthWrite:false,side:THREE.DoubleSide}));lens.name='Clear optical lens';g.add(lens);
  curveMesh(g,[[sx*.475*r,.19*r,1.007*r],[sx*.66*r,.20*r,.69*r],[sx*.744*r,.18*r,.18*r],[sx*.726*r,.05*r,-.07*r]],r*(heavy?.021:.012),color,heavy?'rubber':'metal');
  cmesh(new THREE.BoxGeometry(r*.05,r*.037,r*.07),heavy?0x777779:0xa5a9aa,g,[sx*.484*r,.195*r,.975*r],[1,1,1],false,[0,0,0],'metal');
  const pad=oval(g,r*.026,r*.050,r*.014,0xb7a999,[sx*.082*r,.105*r,1.045*r],16);pad.material=new THREE.MeshPhongMaterial({color:0xc5bbb0,transparent:true,opacity:.40,shininess:18});
 }
 curveMesh(g,[[-r*.060,r*.195,r*1.035],[0,r*.218,r*1.12],[r*.060,r*.195,r*1.035]],r*(heavy?.017:.011),color,heavy?'rubber':'metal');
 return g;
}
function baseballCap(head,r,base=0xe4e5e7,accent=0xc7c9cd,logoText=null,logoColor=0xffffff){
 const hat=new THREE.Group();hat.name='Six panel cap';head.add(hat);const pos=[],uv=[],idx=[],rows=20,cols=72;
 function point(t,a){const radius=Math.cos(t*Math.PI/2),x=.815*radius*Math.sin(a),z=.89*radius*Math.cos(a);return new THREE.Vector3(r*x,r*(.49+.83*Math.sin(t*Math.PI/2)),r*(z+.22));}
 for(let j=0;j<=rows;j++)for(let k=0;k<=cols;k++){const t=j/rows,a=k/cols*Math.PI*2,p=point(t,a);pos.push(...p.toArray());uv.push(k/cols,t);if(j<rows&&k<cols){const q=j*(cols+1)+k;idx.push(q,q+1,q+cols+1,q+1,q+cols+2,q+cols+1)}}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();cmesh(geo,base,hat,[0,0,0],[1,1,1],false,[0,0,0],'fabric');
 for(let k=0;k<6;k++){const a=k/6*Math.PI*2,pts=[];for(let j=0;j<=12;j++)pts.push(point(j/12,a).multiplyScalar(1.003).toArray());curveMesh(hat,pts,r*.006,accent,'fabric');const eye=point(.27,a+.20);oval(hat,r*.014,r*.014,r*.010,accent,eye.toArray(),12);}
 const band=[];for(let k=0;k<=72;k++)band.push(point(0,k/72*Math.PI*2).toArray());curveMesh(hat,band,r*.022,accent,'fabric');oval(hat,r*.070,r*.029,r*.070,accent,[0,r*1.323,r*.22],20);
 // A thin curved visor shell with a real perimeter and darker underside.
 const vp=[],vi=[],vt=[],nx=36,nz=8;
 for(let layer=0;layer<2;layer++)for(let j=0;j<=nz;j++)for(let k=0;k<=nx;k++){const x=(k/nx*2-1)*.72,s=j/nz,z0=.45+.65*Math.sqrt(Math.max(0,1-(x/.82)**2)),z1=.74+.96*Math.sqrt(Math.max(0,1-(x/.76)**2));vp.push(x*r,r*(.505-.085*(x/.72)**2-.065*s+(layer?-.025:0)),r*lerp(z0,z1,s));vt.push(k/nx,s);if(j<nz&&k<nx){const q=layer*(nz+1)*(nx+1)+j*(nx+1)+k;vi.push(q,q+1,q+nx+1,q+1,q+nx+2,q+nx+1)}}
 const vg=new THREE.BufferGeometry();vg.setAttribute('position',new THREE.Float32BufferAttribute(vp,3));vg.setAttribute('uv',new THREE.Float32BufferAttribute(vt,2));vg.setIndex(vi);vg.computeVertexNormals();const visor=cmesh(vg,base,hat,[0,0,0],[1,1,1],false,[0,0,0],'fabric');visor.material=visor.material.clone();visor.material.side=THREE.DoubleSide;
 for(const s of [1,.90]){const edge=[];for(let k=0;k<=36;k++){const x=(k/36*2-1)*.72,z0=.45+.65*Math.sqrt(Math.max(0,1-(x/.82)**2)),z1=.74+.96*Math.sqrt(Math.max(0,1-(x/.76)**2));edge.push([x*r,r*(.505-.085*(x/.72)**2-.065*s),r*lerp(z0,z1,s)]);}curveMesh(hat,edge,r*(s===1?.012:.003),s===1?accent:new THREE.Color(accent).multiplyScalar(.88).getHex(),'fabric');}
 if(logoText){const logo=makeTextPlane(logoText,'#'+logoColor.toString(16).padStart(6,'0'),'transparent',r*.72,r*.34,72);logo.position.set(0,r*.73,r*.82);logo.scale.set(.75,.75,.75);hat.add(logo);} 
 return hat;
}
function joinedGroomNormals(geo,r){
 geo.computeVertexNormals();const p=geo.attributes.position,n=geo.attributes.normal,groups=new Map(),keys=[];
 for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v/(r*.002))).join(',');keys.push(key);if(!groups.has(key))groups.set(key,new THREE.Vector3());groups.get(key).add(new THREE.Vector3().fromBufferAttribute(n,i));}
 for(let i=0;i<p.count;i++){const v=groups.get(keys[i]).clone().normalize();n.setXYZ(i,v.x,v.y,v.z);}
}
const GROOM_DIFFUSE={};
function groomDiffuse(name){
 if(GROOM_DIFFUSE[name])return GROOM_DIFFUSE[name];
 const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');g.fillStyle='#d7d7d7';g.fillRect(0,0,512,512);
 for(let i=0;i<9000;i++){const x=(i*193)%512,y=(i*97+i*i*7)%512,v=162+(i*47)%83;g.strokeStyle=`rgba(${v},${v},${v},.55)`;g.lineWidth=.6+(i%3)*.25;g.beginPath();if(name==='Najee'){const rad=1.05+(i%4)*.42;g.arc(x,y,rad,i*.17,i*.17+Math.PI*1.55)}else if(name==='Jason'||name==='Josef'){const rad=1.30+(i%5)*.36;g.arc(x,y,rad,i*.23,i*.23+Math.PI*1.72)}else if(name==='Auden'){g.moveTo(x,y);g.bezierCurveTo(x+2.8,y+3.4,x-2.7,y+7.2,x+.8,y+11+(i%4)*1.4)}else if(name==='Jarvis'){g.moveTo(x,y);g.bezierCurveTo(x+1.4,y+4,x-1.2,y+10,x+.3,y+16+(i%3)*2)}else{g.moveTo(x,y);g.quadraticCurveTo(x+.8,y+2,x-.4,y+5+(i%4))}g.stroke()}
 if(name==='Auden'||name==='Coel')for(let i=0;i<370;i++){const x=i*512/370,v=115+(i*43)%116;g.strokeStyle=`rgba(${v},${v},${v},.34)`;g.lineWidth=.55+(i%5)*.18;g.beginPath();g.moveTo(x,0);g.bezierCurveTo(x+4.5,170,x-4.2,340,x+2.5,512);g.stroke();}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;GROOM_DIFFUSE[name]=t;return t;
}
let HAIR_CARD_MAP;
function hairCardMap(){
 if(HAIR_CARD_MAP)return HAIR_CARD_MAP;
 const c=document.createElement('canvas');c.width=128;c.height=512;const g=c.getContext('2d');
 for(let i=0;i<98;i++){
  const x=2+i*1.26,shade=165+(i*37)%49;g.strokeStyle=`rgba(${shade},${shade},${shade},${.52+(i%4)*.11})`;g.lineWidth=1.0+(i%3)*.32;g.beginPath();
  for(let j=0;j<=30;j++){const t=j/30,px=x+Math.sin(t*9+i*.31)*(1+t*3),py=t*(440+(i*19)%72);if(j)g.lineTo(px,py);else g.moveTo(px,py)}g.stroke();
 }
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;HAIR_CARD_MAP=t;return t;
}
function hairRibbon(parent,points,width,r,color,endFloor=.055){
 const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p).multiplyScalar(r))),pos=[],uv=[],idx=[];
 for(let j=0;j<=40;j++){
  const t=j/40,p=curve.getPoint(t),tan=curve.getTangent(t),out=new THREE.Vector3(p.x,0,p.z);if(out.lengthSq()<1e-6)out.set(0,0,1);out.normalize();let across=tan.clone().cross(out);if(across.lengthSq()<1e-6)across.set(1,0,0);across.normalize();
  const w=width*r*Math.max(endFloor,.94*(1-Math.pow(t,4)));
  for(const sg of [-1,1]){const v=p.clone().addScaledVector(across,sg*w);pos.push(...v.toArray());uv.push((sg+1)/2,t)}
  if(j<40){const q=j*2;idx.push(q,q+2,q+1,q+1,q+2,q+3)}
 }
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();
 const normals=geo.attributes.normal;for(let i=0;i<normals.count;i++){const v=new THREE.Vector3(pos[i*3],Math.max(0,pos[i*3+1])*.45,pos[i*3+2]+r*.10).normalize();const n=new THREE.Vector3().fromBufferAttribute(normals,i);if(n.dot(v)<0)n.negate();n.lerp(v,.65).normalize();normals.setXYZ(i,n.x,n.y,n.z);}
 const material=new THREE.MeshPhongMaterial({color,map:hairCardMap(),alphaTest:.32,side:THREE.DoubleSide,shininess:19,specular:0x30271f});
 (parent.userData.hairCards||(parent.userData.hairCards=[])).push({geometry:geo,color:new THREE.Color(color)});material.dispose();
}
function batchHairCards(head){
 const cards=head.userData.hairCards;if(!cards?.length)return;const pos=[],normal=[],uv=[],colors=[],idx=[];let offset=0;
 for(const c of cards){const g=c.geometry,p=g.attributes.position;pos.push(...p.array);normal.push(...g.attributes.normal.array);uv.push(...g.attributes.uv.array);for(let i=0;i<p.count;i++)colors.push(c.color.r,c.color.g,c.color.b);for(const i of g.index.array)idx.push(i+offset);offset+=p.count;g.dispose();}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(normal,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.setIndex(idx);
 const m=new THREE.Mesh(g,new THREE.MeshPhongMaterial({vertexColors:true,map:hairCardMap(),alphaTest:.24,side:THREE.DoubleSide,shininess:24,specular:0x24211f}));m.name='Layered groom strands';m.castShadow=true;head.add(m);delete head.userData.hairCards;
}
function addHair(head,name,C,r,dynamic=head){
 const data=window.PCBL_ANATOMY.scalp,geo=new THREE.BufferGeometry(),pos=data.positions.slice();
 const morph={Auden:[.97,1.03,1],Jarvis:[.97,1.01,.99],Najee:[1.08,.98,1.03],Jason:[1.02,.97,1],Coel:[.94,1.02,.98],Josef:[1.05,1.02,1.03]}[name];
 for(let i=0;i<pos.length;i+=3){pos[i]*=.82*r*morph[0];pos[i+1]=(pos[i+1]-7.12)*.82*r*morph[1];pos[i+2]=(pos[i+2]-.29)*.82*r*morph[2]}
 geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setIndex(data.indices);joinedGroomNormals(geo,r);
 const p=geo.attributes.position,n=geo.attributes.normal,uv=[];
 for(let i=0;i<p.count;i++){
  const y=p.getY(i)/r,a=Math.atan2(p.getX(i),p.getZ(i)),top=sm(clamp((y-.30)/.75,0,1));
  let volume=name==='Auden'?.052+top*.064:name==='Jarvis'?.018+top*.138:name==='Najee'?.062+top*.082:(name==='Jason'||name==='Josef')?(.090+top*.155):(.008+top*.015);
  const breakup=name==='Najee'? .0055 : name==='Jarvis'? .0018 : (name==='Jason'||name==='Josef')? .012 : name==='Auden'? .0042 : .003;
  if(name==='Jarvis'){const frontness=sm(clamp((p.getZ(i)/r+.08)/.68,0,1)),backness=1-frontness,nape=sm(clamp((y+.28)/.70,0,1));volume*=1-backness*(.95*(1-nape));}
  const groom=volume+breakup*(Math.sin(a*16+y*11)+.35*Math.sin(a*29-y*15));
  let nx=p.getX(i)+n.getX(i)*r*groom,ny=p.getY(i)+n.getY(i)*r*groom,nz=p.getZ(i)+n.getZ(i)*r*groom;
  if(name==='Jarvis'){const crown=sm(clamp((y-.18)/.78,0,1)),front=sm(clamp((p.getZ(i)/r+.06)/.65,0,1)),back=1-front,nape=sm(clamp((y+.28)/.70,0,1));nz-=r*(.050*crown+.028*crown*front);ny+=r*.016*crown*(1-front*.45);if(back>.22&&nape<1){const taper=back*(1-nape);nx=lerp(nx,p.getX(i),.58*taper);nz=lerp(nz,p.getZ(i),.78*taper);ny=lerp(ny,p.getY(i),.20*taper);}}
  if(name==='Auden'){const front=sm(clamp((p.getZ(i)/r+.02)/.72,0,1)),crown=sm(clamp((y-.28)/.56,0,1)),center=Math.exp(-Math.pow(p.getX(i)/(r*.155),2)),part=front*crown*center,flow=Math.tanh(p.getX(i)/(r*.070));nx=lerp(nx,p.getX(i),.34*part)+flow*r*.022*part;ny=lerp(ny,p.getY(i),.20*part)-r*.006*part;nz=lerp(nz,p.getZ(i),.28*part)-r*.006*part;}
  if(name==='Najee'){const side=sm(clamp((Math.abs(p.getX(i)/r)-.18)/.64,0,1)),back=sm(clamp((-p.getZ(i)/r+.02)/.78,0,1)),nape=1-sm(clamp((y+.18)/.74,0,1)),temple=side*(1-sm(clamp((y-.10)/.56,0,1)));const taper=clamp(.64*nape+.28*temple+.18*back*nape,0,.78);nx=lerp(nx,p.getX(i),taper);ny=lerp(ny,p.getY(i),.35*taper);nz=lerp(nz,p.getZ(i),.62*taper);}
  if(name==='Jason'||name==='Josef'){
   const back=sm(clamp((-p.getZ(i)/r+.02)/.86,0,1)),side=sm(clamp((Math.abs(p.getX(i)/r)-.22)/.70,0,1)),crown=sm(clamp((y-.02)/.90,0,1)),nape=1-sm(clamp((y+.34)/.70,0,1)),earZone=side*(1-sm(clamp((y+.06)/.46,0,1)));
   nz-=r*(.025*back+.013*back*side+.010*crown*back);
   ny+=r*(.010*back*crown-.012*back*nape);
   nx=lerp(nx,p.getX(i),.20*back*nape+.18*earZone);
   nz=lerp(nz,p.getZ(i),.12*earZone);
   if(name==='Josef'){
    const curlSide=side*(1-sm(clamp((y+.18)/.90,0,1))),curlBack=back*(.65+.35*crown),curlDrop=sm(clamp((.46-y)/1.18,0,1));
    nx+=Math.sign(p.getX(i)||1)*r*.012*curlSide;
    ny-=r*(.020*curlDrop+.014*nape*back);
    nz-=r*(.028*curlBack+.010*nape);
   }
  }
  p.setXYZ(i,nx,ny,nz);uv.push(a/(Math.PI*2)+.5,(y+.2)/1.6);
 }
 geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));joinedGroomNormals(geo,r);
 const scalp=cmesh(geo,C.hair,head,[0,0,0],[1,1,1],false,[0,0,0],'hair');scalp.material=scalp.material.clone();scalp.material.shininess=17;scalp.material.specular.setHex(0x181715);scalp.material.map=groomDiffuse(name);scalp.material.bumpMap=groomDiffuse(name);scalp.material.bumpScale=r*({Auden:.007,Jarvis:.012,Najee:.015,Jason:.011,Coel:.003,Josef:.014}[name]||.006);head.userData.scalpGeometry=geo;
 if(name==='Auden'){
  // Thor-like long pushed-back middle-part: fuller shell, cleaner back mass,
  // and fewer thicker cards so it reads as hair, not random squirrel strands.
  const back=sectionGeometry([[-r*1.22,r*.62,r*.28,0,-r*.35],[-r*.78,r*.86,r*.38,0,-r*.26],[-r*.16,r*.95,r*.52,0,-r*.14],[r*.20,r*.95,r*.52,0,-r*.14],[r*.78,r*.86,r*.38,0,-r*.26],[r*1.22,r*.62,r*.28,0,-r*.35]],96);
  const pb=back.attributes.position;
  for(let i=0;i<pb.count;i++){
   const x=pb.getX(i),y=pb.getY(i),z=pb.getZ(i),side=Math.sign(x)||1,mid=1-Math.min(1,Math.abs(x)/(r*1.15)),low=sm(clamp((-y/r+.25)/1.55,0,1));
   pb.setXYZ(i,
    x + side*r*(0.018+0.010*low)*(1-mid*.55),
    y + r*(0.020*mid + 0.050*low),
    z - r*(0.065*mid) + r*(0.012*Math.sin((x/r)*4.2 + (y/r)*3.2))
   );
  }
  back.computeVertexNormals();
  const under=cmesh(back,C.hair,dynamic,[0,0,0],[1,1,1],false,[0,0,0],'hair');
  under.material=under.material.clone();under.material.map=groomDiffuse(name);under.material.specular.setHex(0x181512);
  // front curtain / middle part, swept back off the forehead
  for(const sg of [-1,1])for(let k=0;k<9;k++){
   const q=k/8,spread=.08+q*.10,wave=Math.sin(k*1.2)*.010;
   hairRibbon(dynamic,[[sg*(.05+q*.03),1.08,.34],[sg*(.22+spread*.36),.98,.26],[sg*(.48+spread*.55+wave),.72,.10],[sg*(.66+spread*.45),.34,-.08],[sg*(.70+spread*.20),-.18,-.21],[sg*(.61+q*.08),-.74,-.30],[sg*(.48+q*.06),-1.24,-.35]],.145,r,new THREE.Color(C.hair).multiplyScalar(.97+(k%3)*.015).getHex(),.16);
  }
  // thicker side lengths behind the ears
  for(const sg of [-1,1])for(let k=0;k<6;k++){
   const q=k/5,off=.06*Math.sin(k*.8);
   hairRibbon(dynamic,[[sg*.68,.82,.08],[sg*(.86+off),.44,-.02],[sg*(.92+off),-.08,-.12],[sg*(.88+off),-.66,-.19],[sg*(.72+off*.4),-1.22,-.24]],.132,r,new THREE.Color(C.hair).multiplyScalar(.94).getHex(),.14);
  }
  // rear lengths: broad, coherent masses rather than tiny loose strands.
  for(let k=0;k<8;k++){
   const x=(k/7*2-1)*.58;
   hairRibbon(dynamic,[[x*.18,1.02,-.20],[x*.56,.54,-.42],[x*.78,.04,-.56],[x*.74,-.54,-.60],[x*.56,-1.16,-.52]],.138,r,C.hair,.17);
  }
 }else{
  // Jarvis gets a brushback: thick pushed-back volume off the forehead,
  // relaxed and natural rather than curly puffs. Jason keeps the dense curls.
  if(name==='Jarvis'){
   // Brushback is carried by the sculpted groom shell itself. No detached hair
   // cards on Jarvis: this keeps the rear silhouette solid and strand-free.
  }else if(name==='Jason'||name==='Josef'){
   const isJosef=name==='Josef',count=isJosef?760:350,clumps=new THREE.InstancedMesh(new THREE.SphereGeometry(1,10,7),scalp.material,count),dummy=new THREE.Object3D(),size=isJosef?.056:.043,tri=geo.index.array,cumulative=[];let area=0;
   const at=i=>new THREE.Vector3().fromBufferAttribute(p,i),normal=i=>new THREE.Vector3().fromBufferAttribute(geo.attributes.normal,i),fract=v=>v-Math.floor(v);
   for(let j=0;j<tri.length;j+=3){area+=at(tri[j+1]).sub(at(tri[j])).cross(at(tri[j+2]).sub(at(tri[j]))).length();cumulative.push(area);}
   for(let k=0;k<count;k++){
    const location=fract(k*.61803398875+.37)*area;let lo=0,hi=cumulative.length-1;while(lo<hi){const mid=(lo+hi)>>1;if(cumulative[mid]<location)lo=mid+1;else hi=mid;}
    const a=tri[lo*3],b=tri[lo*3+1],c=tri[lo*3+2],q=Math.sqrt(fract(k*.754877666+.13)),s0=1-q,s1=q*(1-fract(k*.569840291+.29)),s2=1-s0-s1,v=at(a).multiplyScalar(s0).addScaledVector(at(b),s1).addScaledVector(at(c),s2),n=normal(a).multiplyScalar(s0).addScaledVector(normal(b),s1).addScaledVector(normal(c),s2).normalize(),x=v.x/r,y=v.y/r,z=v.z/r;
    const back=sm(clamp((-z-.02)/.86,0,1)),side=sm(clamp((Math.abs(x)-.22)/.72,0,1)),nape=1-sm(clamp((y+.18)/.96,0,1)),crown=sm(clamp((y-.54)/.40,0,1));
    let s=size*r*(.90+(k%7)*.035);
    if(v.y>r*.68)s*=isJosef?.72:.54;
    dummy.position.copy(v).addScaledVector(n,-s*(isJosef?(.44+back*.10+nape*.06):(.52+back*.12+nape*.08)));
    dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),n);
    dummy.rotateY(k*2.39996+(isJosef?Math.sin(k*.23)*.12:0));
    dummy.rotateZ((side-.5)*(isJosef?.20:.13)*(k%2?1:-1));
    if(isJosef){
     dummy.scale.set(s*(1.18+side*.18),s*(1.02-back*.04),s*(1.10+side*.08));
     dummy.position.z-=s*(.12+.24*back+.14*nape);
     dummy.position.y-=s*(.05+.14*nape);
     if(side>.38)dummy.position.x+=Math.sign(x||1)*s*.08;
     if(back>.22)dummy.position.y-=s*(.03+.05*crown);
    }else{
     dummy.scale.set(s*(1.10+side*.12-back*.10),s*(.84-back*.08-nape*.15),s*(1.00+side*.04-back*.15));
     if(back>.30){dummy.position.z-=s*(.20+.12*nape);dummy.position.y+=s*(.035*crown-.065*nape);}if(nape>.45)dummy.scale.multiplyScalar(.86);
    }
    dummy.updateMatrix();clumps.setMatrixAt(k,dummy.matrix);clumps.setColorAt(k,new THREE.Color().setScalar(isJosef?.95+(k%5)*.014:.92+(k%4)*.018));
   }
   clumps.name=isJosef?'Heavy long curl mass':'Dense embedded curl mass';clumps.castShadow=true;clumps.receiveShadow=true;head.add(clumps);
  }
 }

 batchHairCards(dynamic);
}
function addFace(neck,name,C,r){
 const head=new THREE.Group();head.position.set(0,r*.94,0);head.scale.x={Auden:1.165,Jarvis:1.142,Najee:1.125,Jason:1.152,Coel:1.172,Josef:1.18}[name];head.scale.z={Auden:1.018,Jarvis:1.012,Najee:1.024,Jason:1.022,Coel:1.012,Josef:1.03}[name];neck.add(head);
 const data=window.PCBL_ANATOMY,geo=new THREE.BufferGeometry();
 const positions=data.positions.slice(),morph={Auden:[.97,1.03,1],Jarvis:[.97,1.01,.99],Najee:[1.08,.98,1.03],Jason:[1.02,.97,1],Coel:[.94,1.02,.98],Josef:[1.05,1.02,1.03]}[name];
 // Broad anatomical planes, not surface noise: mandibular angle, zygoma,
 // cheek hollow, chin pad and supraorbital ridge. Existing topology/UVs stay intact.
 const definition={Auden:1.0,Jarvis:.93,Najee:.64,Jason:.69,Coel:.91,Josef:.96}[name];
 const gauss=(v,c,w)=>Math.exp(-Math.pow((v-c)/w,2));
 for(let i=0;i<positions.length;i+=3){
  let x=positions[i],y=positions[i+1],z=positions[i+2];const ax=Math.abs(x),front=sm(clamp((z-.45)/.7,0,1));
  const jaw=gauss(y,6.43,.24),cheek=gauss(y,7.04,.15),hollow=gauss(y,6.77,.19)*gauss(ax,.50,.20),chin=gauss(y,6.23,.17)*gauss(x,0,.25),brow=gauss(y,7.49,.11)*gauss(ax,.30,.24);
  const shape={Auden:[-.01,-.010,.026],Jarvis:[.03,-.013,.020],Najee:[.055,.030,-.007],Jason:[.045,.018,.006],Coel:[-.015,-.020,.020],Josef:[.018,-.006,.024]}[name];
  x*=morph[0]*(1+jaw*shape[0]+cheek*shape[1]);
  x+=Math.sign(x)*definition*(jaw*gauss(ax,.53,.18)*.066+cheek*gauss(ax,.52,.16)*.044-hollow*.040)*front;
  z+=definition*front*(cheek*gauss(ax,.47,.22)*.040-hollow*.025+chin*.047+brow*.025)+gauss(x,0,.20)*gauss(y,6.99,.26)*shape[2];
  y-=definition*gauss(y,6.35,.15)*gauss(ax,.43,.22)*front*.025;
  const neckBlend=sm(clamp((6.04-y)/.49,0,1));
  positions[i]=x*.82*r*(1-neckBlend*.49);positions[i+1]=(y-7.12)*.82*r*morph[1];positions[i+2]=(z-.29)*.82*r*morph[2]*(1-neckBlend*.45);
 }
 geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(data.uv,2));geo.setAttribute('color',new THREE.Float32BufferAttribute(data.colors,3));geo.setIndex(data.indices);geo.computeVertexNormals();
 // Player identity/skin tone must never depend on an asynchronously loaded
 // photographic albedo. Use the same neutral procedural skin detail as the body
 // and keep the authored player color from first frame to final frame.
 const skin=sportsMat(C.skin,'skin').clone();skin.color.set(C.skin);skin.shininess=33;skin.specular.setHex(0x38302b);skin.normalScale.set(.20,.20);const face=new THREE.Mesh(geo,skin);face.castShadow=true;head.add(face);
 const eyes=[],pupils=[],brows=[];
 for(const [sx,sy,sz] of data.eyeCenters){
  const x=sx*.82*r*morph[0],y=(sy-7.12)*.82*r*morph[1],z=(sz-.29)*.82*r*morph[2];
  const eye=oval(head,r*.137,r*.134,r*.128,0xdedbd1,[x,y,z],32);eye.material=new THREE.MeshPhongMaterial({color:0xddd8ca,shininess:65,specular:0x555555});
  const irisColor=name==='Coel'?0x5f86a0:(name==='Auden'||name==='Josef')?0x66734d:0x503e2d;const iris=oval(head,r*.060,r*.060,r*.014,irisColor,[x,y,z+r*.121],32);iris.material=new THREE.MeshPhongMaterial({color:irisColor,shininess:30,specular:0x6b6b68});
  const pupil=oval(iris,.48,.48,.3,0x101214,[0,0,.78],24);pupil.material=mat(0x101214,.2);
  eye.userData.baseY=eye.scale.y;iris.userData.baseY=iris.scale.y;eyes.push(eye);pupils.push(iris);
  const brow=new THREE.Group();brow.position.set(x,y+r*.235,z+r*.075);head.add(brow);const sign=Math.sign(x);
  curveMesh(brow,[[-r*.14,-r*.01,0],[0,r*.025,r*.012],[r*.14,-r*.012,0]],r*.0125,C.hair,'hair');for(let k=0;k<14;k++){const a=(k/13-.5);curveMesh(brow,[[a*r*.33,-r*.035*a*sign,0],[a*r*.33+r*.014*sign,r*.034-r*.04*a*sign,-r*.008]],r*.0054,C.hair,'hair')}brows.push(brow);
 }
 const mouth=new THREE.Group();head.add(mouth);const mouthShape=oval(mouth,r*.115,r*.035,r*.012,0x5a2424,[0,-r*.205,r*.80],18);mouthShape.material=new THREE.MeshPhongMaterial({color:0x5a2424,shininess:8,specular:0x180808});mouth.userData.shape=mouthShape;mouth.userData.baseScale=mouthShape.scale.clone();
 // Secondary-motion roots keep the face rigid while hair and worn accessories
 // can lag a few millimeters behind abrupt head/torso acceleration.
 const hairStaticRoot=new THREE.Group();hairStaticRoot.name='Fitted hair scalp';head.add(hairStaticRoot);const hairRoot=new THREE.Group();hairRoot.name='Dynamic hair lengths';head.add(hairRoot);addHair(hairStaticRoot,name,C,r,hairRoot);
 const capRoot=name==='Jason'?baseballCap(head,r,0xe4e5e7,0xbfc2c6,null):name==='Najee'?baseballCap(head,r,0x1f4f87,0xf36f21,'NY',0xf36f21):null;
 if(capRoot&&name==='Jason'){capRoot.scale.set(1.075,1.045,1.08);capRoot.position.y=r*.006;capRoot.position.z=-r*.004;}
 if(capRoot&&name==='Najee'){capRoot.scale.set(1.125,1.075,1.115);capRoot.position.y=r*.012;capRoot.position.z=-r*.003;}
 const glassesRoot=(name==='Coel'||name==='Jason')?makeGlasses(head,r,name==='Jason'?0x111111:0x9ba5ac):null;
 brows.forEach(b=>b.userData.baseY=b.position.y);
 head.userData.face={eyes,pupils,brows,mouth,headR:r,name,headMesh:face,hairRoot,capRoot,glassesRoot,head};return head;
}
function setExpression(r,kind='neutral',now=performance.now()){
 const f=r?.userData?.face;if(!f)return;
 const focused=kind==='focused',pain=kind==='pain',wtf=kind==='wtf',angry=kind==='angry'||kind==='annoyed'||wtf,surprised=kind==='surprised',happy=kind==='happy';
 f.brows.forEach((b,i)=>{b.rotation.z=(i?1:-1)*(pain?.25:angry?.16:focused?.025:surprised?-.055:happy?-.018:0);b.position.y=b.userData.baseY-(focused?.009:0)-(angry?.010:0)-(pain?.016:0)+(surprised?.026:0)+(happy?.006:0)});
 const mouth=f.mouth?.userData?.shape,base=f.mouth?.userData?.baseScale;if(mouth&&base){mouth.scale.set(base.x*(pain?.88:wtf?1.08:angry?1.16:surprised?.72:happy?1.24:1),base.y*(pain?2.10:wtf?2.28:angry?1.65:surprised?2.35:happy?.60:.72),base.z);mouth.position.y=-f.headR*(pain?.200:angry?.205:surprised?.195:happy?.190:.205);mouth.rotation.z=pain?-.10+Math.sin(now*.014)*.025:angry?Math.sin(now*.010)*.035:0;}
}
function makeShoe(parent,w,l,color){
 const g=new THREE.Group();g.name='Footwear';parent.add(g);
 // Single clean upper shell. The old stacked forefoot/toe-cap layers created
 // the visible rectangular/pixel-like extension around every foot.
 const upper=cmesh(sectionGeometry([
  [-.095,w*.40,l*.34,0,l*.08],[-.035,w*.47,l*.42,0,l*.08],[.035,w*.46,l*.41,0,l*.075],
  [.135,w*.40,l*.34,0,l*.025],[.255,w*.30,l*.20,0,-l*.10]
 ],42),color,g,[0,0,0],[1,1,1],false,[0,0,0],'rubber');
 // Low fitted sole follows the upper footprint instead of extending beyond it.
 const soleColor=new THREE.Color(color).lerp(new THREE.Color(0xb8b7b2),.42).getHex();
 const sole=cmesh(sectionGeometry([
  [-.115,w*.405,l*.345,0,l*.085],[-.095,w*.43,l*.375,0,l*.075],[-.075,w*.43,l*.37,0,l*.065]
 ],42),soleColor,g,[0,0,0],[1,1,1],false,[0,0,0],'rubber');
 const tongue=new THREE.Group();tongue.name='Shoe tongue';g.add(tongue);
 cmesh(new THREE.BoxGeometry(w*.37,.014,l*.40),new THREE.Color(color).lerp(new THREE.Color(0xbebebe),.12).getHex(),tongue,[0,.205,-l*.005],[1,1,1],false,[-.12,0,0],'fabric');
 const laces=new THREE.Group();laces.name='Dynamic laces';g.add(laces);
 for(let i=0;i<5;i++)curveMesh(laces,[[-w*.18,.216-i*.006,-l*.075+i*l*.060],[0,.224-i*.006,-l*.058+i*l*.060],[w*.18,.216-i*.006,-l*.075+i*l*.060]],.0055,0xc8c6bf,'fabric');
 g.userData.tongue=tongue;g.userData.laces=laces;g.userData.upper=upper;g.userData.sole=sole;return g;
}
function makePlayer(name){
 const C=COLORS[name],b=BODY[name],height=HEIGHTS[name],root=new THREE.Group(),motion=new THREE.Group();root.add(motion);
 root.userData.name=name;
 const legTotal=height*.49*b.leg,upperLeg=legTotal*.51,lowerLeg=legTotal*.49,torsoLen=height*.31,upperArm=height*.145*b.arm,foreArm=height*.13*b.arm;
 const hipHalf=height*.085*b.hips,shoulderHalf=height*.115*b.shoulders,headR=height*.073*b.head;
 const pelvis=new THREE.Group();pelvis.position.y=legTotal;motion.add(pelvis);
 cmesh(sectionGeometry([[-height*.065,hipHalf*.88,hipHalf*.66],[-height*.025,hipHalf*1.28,hipHalf*.72],[0,hipHalf*1.40,hipHalf*.73],[height*.045,hipHalf*1.02,hipHalf*.69]]),C.bottom,pelvis);
 const spine=new THREE.Group();spine.position.y=.08;pelvis.add(spine);
 const torso=cmesh(sectionGeometry([[0,hipHalf*1.08,hipHalf*.78],[torsoLen*.16,hipHalf*1.06,hipHalf*.80],[torsoLen*.38,shoulderHalf*.88,shoulderHalf*.66*b.belly],[torsoLen*.62,shoulderHalf,shoulderHalf*.65*b.belly],[torsoLen*.79,shoulderHalf*.99,shoulderHalf*.52],[torsoLen*.87,shoulderHalf*.79,shoulderHalf*.42],[torsoLen*.94,headR*.42,headR*.38]]),C.top,spine);
 const tp=torso.geometry.attributes.position;
 for(let i=0;i<tp.count;i++){const x=tp.getX(i),y=tp.getY(i),z=tp.getZ(i),ang=Math.atan2(x,z),low=Math.exp(-Math.pow((y-torsoLen*.18)/(torsoLen*.22),2)),sideFold=Math.exp(-Math.pow((Math.abs(x)-shoulderHalf*.8)/(shoulderHalf*.25),2))*Math.exp(-Math.pow((y-torsoLen*.60)/(torsoLen*.26),2));const crease=(Math.sin(y*13+ang*3)*low*.0035+Math.sin(y*16-ang*4)*sideFold*.0020)*height;tp.setXYZ(i,x+Math.sin(ang)*crease,y,z+Math.cos(ang)*crease*.75)}torso.geometry.computeVertexNormals();
 const hem=new THREE.Group();spine.add(hem);
 const neck=new THREE.Group();neck.position.y=torsoLen*.93;spine.add(neck);cmesh(new THREE.CylinderGeometry(headR*.33,headR*.40,headR*.65,28),C.skin,neck,[0,headR*.19,0]);const faceHead=addFace(neck,name,C,headR);
 // Collar, seams and a few broad folds provide cloth construction at gameplay distance.
 const collar=cmesh(new THREE.TorusGeometry(headR*.40,.025,8,36),C.top,spine,[0,torsoLen*.94,0],[1,.86,1],false,[Math.PI/2,0,0]);
 const seamColor=new THREE.Color(C.top).lerp(new THREE.Color(0x7c7c7c),.15).getHex();
 let hood=null;if(name==='Jason'||name==='Coel'){hood=new THREE.Group();hood.name='Dynamic hoodie hood';hood.position.set(0,torsoLen*.83,-headR*.12);spine.add(hood);curveMesh(hood,[[-headR*.54,headR*.05,headR*.12],[-headR*.40,-headR*.08,-headR*.24],[0,-headR*.15,-headR*.46],[headR*.40,-headR*.08,-headR*.24],[headR*.54,headR*.05,headR*.12]],headR*.115,C.top,'fabric');}
 
 if(name==='Auden'){
  const chain=new THREE.Group();chain.name='Auden necklace dynamic';spine.add(chain);
  const chainPts=[[-headR*.34,torsoLen*.905,headR*.34],[-headR*.38,torsoLen*.79,shoulderHalf*.69],[-headR*.23,torsoLen*.675,shoulderHalf*.715],[0,torsoLen*.635,shoulderHalf*.735],[headR*.23,torsoLen*.675,shoulderHalf*.715],[headR*.38,torsoLen*.79,shoulderHalf*.69],[headR*.34,torsoLen*.905,headR*.34]];
  curveMesh(chain,chainPts,.0135,0xd6d9dd,'metal');chain.userData.baseZ=chain.position.z;root.userData.necklace=chain;
 }
 if(name==='Jarvis'||name==='Najee'){const label=makeTextPlane(name==='Jarvis'?'ARSENAL':'NY',name==='Najee'?'#f36f21':'#ffffff','transparent',name==='Jarvis'?1.1:.50,.26,name==='Jarvis'?38:58);label.position.set(0,torsoLen*.60,shoulderHalf*.67*b.belly+.012);spine.add(label)}
 const limbs={};for(const side of ['L','R']){
  const sg=side==='L'?1:-1,sh=new THREE.Group();sh.position.set(sg*shoulderHalf*.96,torsoLen*.80,0);spine.add(sh);
  const covered=name==='Jason'||name==='Coel',upper=roundedLimb(sh,upperArm,height*.038*b.arm,covered?C.top:C.skin,side+'UpperArm');
  oval(upper,height*.041,height*.050,height*.039,(name==='Jarvis'||name==='Josef')?C.skin:C.top,[0,-.045,0]);
  if(!covered&&name!=='Jarvis'&&name!=='Josef')cmesh(sectionGeometry([[-upperArm*.34,height*.038,height*.036],[-upperArm*.25,height*.043,height*.041],[.025,height*.042,height*.040]]),C.top,upper);
  const elbow=new THREE.Group();elbow.position.y=-upperArm;upper.add(elbow);oval(elbow,height*.027,height*.033,height*.027,covered?C.top:C.skin);
  const fore=roundedLimb(elbow,foreArm,height*.029*b.arm,covered?C.top:C.skin,side+'ForeArm'),wrist=new THREE.Group();wrist.position.y=-foreArm;fore.add(wrist);
  const hand=oval(wrist,height*.027,height*.043,height*.017,C.skin,[0,-height*.022,.01]);
  for(let i=0;i<4;i++)oval(wrist,height*.0065,height*.025,height*.008,C.skin,[(i-1.5)*height*.013,-height*.066,.013],18);
  const thumb=oval(wrist,height*.012,height*.026,height*.013,C.skin,[sg*height*.029,-height*.025,.016],18);thumb.rotation.z=sg*.35;
  const hip=new THREE.Group();hip.position.set(sg*hipHalf*.76,0,0);pelvis.add(hip);
  const thigh=roundedLimb(hip,upperLeg,height*.049*b.leg,C.bottom,side+'Thigh'),knee=new THREE.Group();knee.position.y=-upperLeg;thigh.add(knee);
  const shinColor=name==='Jarvis'?C.skin:C.bottom;oval(knee,height*.036*b.leg,height*.044,height*.036*b.leg,shinColor);
  const shin=roundedLimb(knee,lowerLeg,height*.033*b.leg,shinColor,side+'Shin'),ankle=new THREE.Group();ankle.position.y=-lowerLeg;shin.add(ankle);oval(ankle,height*.022,height*.037,height*.024,shinColor);
  const foot=makeShoe(ankle,height*.090,height*.16,C.shoe);
  if(name==='Josef'){foot.scale.set(1.12,1.08,1.10);foot.traverse(o=>{if(o.isMesh&&o.material){o.material=o.material.clone();if(o.material.color)o.material.color.setHex(0x050505);o.material.shininess=Math.max(10,o.material.shininess||10);o.material.specular=new THREE.Color(0x161616);}});}
  if(name==='Auden'){foot.traverse(o=>{if(o.isMesh&&o.material){o.material=o.material.clone();o.material.map=null;o.material.normalMap=null;o.material.bumpMap=null;o.material.roughnessMap=null;o.material.metalnessMap=null;o.material.shininess=Math.max(8,o.material.shininess||8);o.material.specular=new THREE.Color(0x2b2b2b);}});}
  Object.assign(limbs,{[side+'Shoulder']:upper,[side+'Elbow']:elbow,[side+'ForeArm']:fore,[side+'Wrist']:wrist,[side+'Hand']:hand,[side+'Hip']:thigh,[side+'Knee']:knee,[side+'Shin']:shin,[side+'Ankle']:ankle,[side+'Foot']:foot});
 }
 const batPivot=new THREE.Group();spine.add(batPivot);const bat=new THREE.Group();batPivot.add(bat);
 cmesh(new THREE.CylinderGeometry(.104,.045,2.75,40),0x3f484e,bat,[0,0,1.35],[1,1,1],false,[Math.PI/2,0,0],'rubber');
 cmesh(new THREE.CylinderGeometry(.040,.040,.65,24),0x24272a,bat,[0,0,.30],[1,1,1],false,[Math.PI/2,0,0],'rubber');
 const label=makeTextPlane('EASTON','#ffffff','transparent',.72,.16,42);label.position.set(.066,0,1.55);label.rotation.y=Math.PI/2;bat.add(label);
 const throwSide=D.players[name]._meta.throws==='L'?'L':'R',gloveSide=throwSide==='L'?'R':'L';
 const c=document.createElement('canvas');c.width=c.height=64;const ctx=c.getContext('2d'),grad=ctx.createRadialGradient(32,32,2,32,32,32);grad.addColorStop(0,'rgba(0,0,0,.4)');grad.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,64,64);
 const contact=new THREE.Mesh(new THREE.PlaneGeometry(2.1,1.65),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false}));contact.rotation.x=-Math.PI/2;contact.position.y=.014;root.add(contact);
 root.userData={name,C,b,height,motion,pelvis,spine,neck,face:faceHead.userData.face,limbs,batPivot,bat,glove:null,catchHandSide:gloveSide,catchHand:null,torso,hem,hood,legTotal,upperLeg,lowerLeg,upperArm,foreArm,hipHalf,shoulderHalf,torsoLen,headR,necklace:spine.getObjectByName('Auden necklace dynamic')||null};installContinuousLimbs(root);installAnatomicalPants(root);installShirt(root);installHands(root);root.userData.catchHand=root.userData.hands[gloveSide]?.hand||root.userData.limbs[gloveSide+'Wrist'];bakeSwingPoles(root);neutralRig(root,false);return root;
}
// Each full limb is one weighted surface. The authored joints drive deformation.
function installContinuousLimbs(root){
 const u=root.userData,L=u.limbs,h=u.height;root.updateMatrixWorld(true);
 for(const side of ['L','R'])for(const leg of [false,true]){
  const upper=L[side+(leg?'Hip':'Shoulder')],joint=L[side+(leg?'Knee':'Elbow')],lower=L[side+(leg?'Shin':'ForeArm')],end=L[side+(leg?'Ankle':'Wrist')],a=leg?u.upperLeg:u.upperArm,b=leg?u.lowerLeg:u.foreArm;
  for(const node of [upper,joint,lower])for(const child of [...node.children])if(child.isMesh)child.visible=false;
  const rings=[],segments=32,rows=49,capRows=8;
  for(let j=0;j<rows;j++){
   const t=Math.max(0,(j-capRows)/(rows-capRows-1)),y=j<capRows?h*.032*Math.cos((j+.06)/capRows*Math.PI/2):-t*(a+b),f=Math.max(0,-y/a);
   let radius;if(leg){const keys=[[0,.049],[.18,.052],[.58,.043],[.88,.034],[1.02,.037],[1.18,.040],[1.48,.034],[1.72,.028],[2,.022]];radius=profileRadius(keys,f)*h*u.b.leg}else{const keys=[[0,.036],[.18,.035],[.58,.029],[.88,.0235],[1.02,.0255],[1.20,.027],[1.48,.0215],[1.72,.019],[2,.0165]];radius=profileRadius(keys,f)*h*u.b.arm}
   const cloth=leg?(u.name!=='Jarvis'||t<.51):(u.name==='Jason'||u.name==='Coel'||(u.name!=='Jarvis'&&u.name!=='Josef'&&t<.20));
   if(cloth)radius*=1.10;if(j<capRows)radius*=Math.sin((j+.06)/capRows*Math.PI/2);
   const shape=(leg?.018:.007)*h*Math.sin(t*Math.PI*2);
   rings.push([y,radius,radius*(leg?.93:.88),0,shape]);
  }
  // Rows are generated explicitly; no extra smoothing needed for weight/material boundaries.
  const pos=[],uv=[],idx=[],weights=[],indices=[];
  for(let j=0;j<rows;j++)for(let k=0;k<=segments;k++){
   const [y,rx,rz,cx,cz]=rings[j],ang=k/segments*Math.PI*2,cloth=leg?(u.name!=='Jarvis'||j/(rows-1)<.51):(u.name==='Jason'||u.name==='Coel'||(u.name!=='Jarvis'&&u.name!=='Josef'&&Math.max(0,(j-capRows)/(rows-capRows-1))<.18));
   const fold=cloth?(Math.sin(j*.72+k*.3)*.010+Math.sin(j*1.3-k*.4)*.004)*Math.sin(j/(rows-1)*Math.PI):0;
   pos.push(Math.sin(ang)*rx*(1+fold)+(j<capRows?(side==='L'?-1:1)*h*.004*Math.cos((j+.06)/capRows*Math.PI/2):0),y,Math.cos(ang)*rz*(1+fold)+cz);uv.push(k/segments,j/(rows-1));
   const w=sm(clamp((-y-a+a*.14)/(a*.28),0,1));const cap=0;indices.push(0,1,2,0);weights.push((1-w)*(1-cap),w*(1-cap),cap,0);
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(indices,4));g.setAttribute('skinWeight',new THREE.Float32BufferAttribute(weights,4));
  const mats=[sportsMat(leg?u.C.bottom:u.C.top,'fabric'),sportsMat(u.C.skin,'skin')];
  for(let j=0;j<rows-1;j++){
   const start=idx.length;for(let k=0;k<segments;k++){const q=j*(segments+1)+k,n=q+segments+1;idx.push(q,n,q+1,q+1,n,n+1)}
   const t=leg?(j+.5)/(rows-1):Math.max(0,(j+.5-capRows)/(rows-capRows-1)),cloth=leg?(u.name!=='Jarvis'||t<.51):(u.name==='Jason'||u.name==='Coel'||(u.name!=='Jarvis'&&u.name!=='Josef'&&t<.20));g.addGroup(start,idx.length-start,cloth?0:1);
  }
  g.setIndex(idx);g.computeVertexNormals();const mesh=new THREE.SkinnedMesh(g,mats);mesh.castShadow=true;mesh.frustumCulled=false;upper.parent.add(mesh);root.updateMatrixWorld(true);const skeleton=new THREE.Skeleton([upper,joint,upper.parent]);mesh.bind(skeleton);u[(leg?'leg':'arm')+side+'Surface']=mesh;
 }
}
function installAnatomicalPants(root){
 const u=root.userData,h=u.height,data=window.PCBL_ANATOMY.lower,pos=data.positions.slice(),weights=[],indices=[];
 u.legLSurface.visible=false;u.legRSurface.visible=false;
 for(const c of u.pelvis.children)if(c.isMesh)c.visible=false;
 const uv=[];
 for(let i=0;i<pos.length;i+=3){
  const x=pos[i],y=pos[i+1],z=pos[i+2],sg=x<0?-1:1,upper=y>=-3.695;
  const t=upper?clamp((.486-y)/4.181,0,1):clamp((-3.695-y)/3.753,0,1);
  const ax=upper?lerp(1.104,1.581,t):lerp(1.581,2.196,t),az=upper?lerp(.123,.320,t):lerp(.320,-.009,t);
  const py=upper?(y>.486?(y-.486)*h*.06:-t*u.upperLeg):-u.upperLeg-t*u.lowerLeg;
  const centerFade=clamp(Math.abs(x)/1.05,0,1),fit=h/16.65;
  pos[i]=x*fit+sg*(u.hipHalf*.76-ax*fit)*centerFade;
  const waist=sm(clamp((y-.15)/1.2,0,1));pos[i]*=lerp(1,.58,waist);pos[i+1]=Math.min(py,.065);pos[i+2]=(z-az)*fit*(u.name==='Najee'?1.12:1.045)*lerp(1,.63,waist);
  const thighWeight=sm(clamp((.30-y)/1.55,0,1)),kneeWeight=sm(clamp((-y-3.22)/.95,0,1));
  indices.push(0,sg>0?1:3,sg>0?2:4,0);weights.push(1-thighWeight,thighWeight*(1-kneeWeight),thighWeight*kneeWeight,0);
  uv.push(data.uv[i/3*2]*4,data.uv[i/3*2+1]*4);
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(indices,4));g.setAttribute('skinWeight',new THREE.Float32BufferAttribute(weights,4));g.setIndex(data.indices);g.computeVertexNormals();
 const cloth=[],skin=[];for(let i=0;i<data.indices.length;i+=3){const ids=data.indices.slice(i,i+3),ys=ids.map(k=>data.positions[k*3+1]);(u.name==='Jarvis'&&ys.reduce((a,b)=>a+b,0)/3< -3.30?skin:cloth).push(...ids)}g.setIndex(cloth.concat(skin));g.clearGroups();g.addGroup(0,cloth.length,0);if(skin.length)g.addGroup(cloth.length,skin.length,1);
 const mesh=new THREE.SkinnedMesh(g,[sportsMat(u.C.bottom,'fabric'),sportsMat(u.C.skin,'skin')]);mesh.castShadow=true;mesh.frustumCulled=false;u.pelvis.add(mesh);root.updateMatrixWorld(true);mesh.bind(new THREE.Skeleton([u.pelvis,u.limbs.LHip,u.limbs.LKnee,u.limbs.RHip,u.limbs.RKnee]));u.pants=mesh;
}
function installShirt(root){
 const u=root.userData,old=u.torso,g=old.geometry.clone(),p=g.attributes.position,si=[],sw=[];
 for(let i=0;i<p.count;i++){const w=sm(clamp((p.getY(i)/u.torsoLen-.06)/.40,0,1)),scapula=sm(clamp((p.getY(i)/u.torsoLen-.60)/.23,0,1))*sm(clamp((Math.abs(p.getX(i))/u.shoulderHalf-.38)/.50,0,1))*.85;si.push(0,1,p.getX(i)>0?2:3,0);sw.push(1-w,w*(1-scapula),w*scapula,0);}
 g.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(si,4));g.setAttribute('skinWeight',new THREE.Float32BufferAttribute(sw,4));
 const shirt=new THREE.SkinnedMesh(g,old.material);shirt.castShadow=true;shirt.receiveShadow=true;shirt.frustumCulled=false;u.spine.remove(old);old.geometry.dispose();u.spine.add(shirt);root.updateMatrixWorld(true);shirt.bind(new THREE.Skeleton([u.pelvis,u.spine,u.limbs.LShoulder.parent,u.limbs.RShoulder.parent]));u.torso=shirt;
 // Subtle stitched hem; weighted with the same waist/chest transition.
 const hemGeo=sectionGeometry([[.025,u.hipHalf*1.095,u.hipHalf*.796],[.070,u.hipHalf*1.09,u.hipHalf*.794]],40);
 const hsi=[],hsw=[];for(let i=0;i<hemGeo.attributes.position.count;i++){hsi.push(0,0,0,0);hsw.push(1,0,0,0)}hemGeo.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(hsi,4));hemGeo.setAttribute('skinWeight',new THREE.Float32BufferAttribute(hsw,4));
 const hem=new THREE.SkinnedMesh(hemGeo,sportsMat(new THREE.Color(u.C.top).multiplyScalar(.87).getHex(),'fabric'));hem.name='Dynamic shirt hem';hem.castShadow=true;hem.frustumCulled=false;u.spine.add(hem);root.updateMatrixWorld(true);hem.bind(new THREE.Skeleton([u.pelvis]));u.hem=hem;
}
function profileRadius(keys,t){for(let i=1;i<keys.length;i++)if(t<=keys[i][0]){const a=keys[i-1],b=keys[i];return lerp(a[1],b[1],sm((t-a[0])/(b[0]-a[0])))}return keys[keys.length-1][1]}
function installHands(root){
 const u=root.userData,h=u.height;u.hands={};
 for(const side of ['L','R']){
  const wrist=u.limbs[side+'Wrist'];for(const c of [...wrist.children])wrist.remove(c);
  // Palm is centered around the wrist/grip axis instead of dangling below it.
  // This lets the bat handle pass through the actual palm/finger pocket without
  // forcing an extreme wrist bend to fake contact.
  oval(wrist,h*.018,h*.016,h*.017,u.C.skin);
  const hand=new THREE.Group();hand.name=side+' articulated hand';wrist.add(hand);
  const palm=cmesh(sectionGeometry([
    [-h*.026,h*.021,h*.013],[-h*.010,h*.026,h*.015],[h*.008,h*.026,h*.014],[h*.024,h*.021,h*.012]
  ],48),u.C.skin,hand);
  const fingers=[];
  for(let i=0;i<4;i++){
   const bone=new THREE.Group();bone.position.set((i-1.5)*h*.0122,-h*.020,h*.001);hand.add(bone);let parent=bone;const joints=[bone],scale=[.90,1,.95,.75][i];
   for(let j=0;j<3;j++){const len=h*[.021,.014,.012][j]*scale,rr=h*(.0062-j*.0009);cmesh(new THREE.CapsuleGeometry(rr,Math.max(.001,len-2*rr),6,12),u.C.skin,parent,[0,-len*.5,0]);if(j<2){const q=new THREE.Group();q.position.y=-len;parent.add(q);parent=q;joints.push(q)}}fingers.push(joints);
  }
  const thumb=new THREE.Group();thumb.position.set((side==='L'?-1:1)*h*.022,-h*.002,h*.002);thumb.rotation.z=(side==='L'?1:-1)*.48;hand.add(thumb);cmesh(new THREE.CapsuleGeometry(h*.007,h*.026,7,14),u.C.skin,thumb,[0,-h*.015,0]);
  u.hands[side]={hand,fingers,thumb};u.limbs[side+'Hand']=palm;root.updateMatrixWorld(true);fingers.forEach((chain,i)=>skinFinger(chain,h,[.90,1,.95,.75][i],u.C.skin,root));hand.scale.y=1.08;
 }
}
function skinFinger(chain,h,scale,color,root){
 for(const joint of chain)for(const c of joint.children)if(c.isMesh)c.visible=false;
 const lengths=[.021,.014,.012].map(v=>v*h*scale),total=lengths.reduce((a,b)=>a+b,0),pos=[],uv=[],idx=[],si=[],sw=[],rows=22,segs=12;
 for(let j=0;j<rows;j++)for(let k=0;k<=segs;k++){
  const t=j/(rows-1),distance=t*total,a=k/segs*Math.PI*2,tip=sm(clamp((1-t)/.16,0,1)),r=h*(.0062-.0015*t)*Math.sqrt(tip);
  pos.push(Math.sin(a)*r,-distance,Math.cos(a)*r*.9);uv.push(k/segs,t);
  const w1=sm(clamp((distance-lengths[0]+h*.003)/(h*.006),0,1)),w2=sm(clamp((distance-lengths[0]-lengths[1]+h*.0025)/(h*.005),0,1));si.push(0,1,2,0);sw.push(1-w1,w1*(1-w2),w1*w2,0);
 }
 for(let j=0;j<rows-1;j++)for(let k=0;k<segs;k++){const a=j*(segs+1)+k,b=a+segs+1;idx.push(a,b,a+1,a+1,b,b+1)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(si,4));g.setAttribute('skinWeight',new THREE.Float32BufferAttribute(sw,4));g.setIndex(idx);g.computeVertexNormals();const mesh=new THREE.SkinnedMesh(g,sportsMat(color,'skin'));mesh.position.copy(chain[0].position);chain[0].parent.add(mesh);mesh.castShadow=true;mesh.frustumCulled=false;root.updateMatrixWorld(true);mesh.bind(new THREE.Skeleton(chain));
}
function poseHands(r,grip=false){
 for(const [side,hand] of Object.entries(r.userData.hands)){
  hand.fingers.forEach((chain,i)=>chain.forEach((j,k)=>{j.rotation.x=grip?-[.72,1.35,1.00][k]:-[.11,.14,.12][k];j.rotation.z=k===0?(i-1.5)*.025:0}));hand.thumb.rotation.x=grip?-.75:-.1;
 }
}
function resetJoint(j){j.rotation.set(0,0,0)}
function neutralRig(r,batting=false){
 const u=r.userData,L=u.limbs;u.motion.position.set(0,0,0);u.motion.rotation.set(0,0,0);u.pelvis.position.set(0,u.legTotal+.12,0);u.pelvis.rotation.set(0,0,0);u.spine.rotation.set(0,0,0);u.neck.rotation.set(0,0,0);
 for(const side of ['L','R']){
  const sg=side==='L'?1:-1;L[side+'Shoulder'].parent.position.set(sg*u.shoulderHalf*.96,u.torsoLen*.80,0);resetJoint(L[side+'Shoulder']);resetJoint(L[side+'Elbow']);resetJoint(L[side+'Hip']);resetJoint(L[side+'Knee']);resetJoint(L[side+'Ankle']);resetJoint(L[side+'Wrist']);
  L[side+'Shoulder'].rotation.z=sg*.135;L[side+'Shoulder'].rotation.x=-.035;L[side+'Elbow'].rotation.x=-.105;L[side+'Hip'].rotation.z=sg*.055;L[side+'Knee'].rotation.x=.055;
 }
 u.releaseHand=0;u.batPivot.position.set(.30,u.torsoLen*.68,.15);u.batPivot.rotation.set(-.55,.25,.10);u.batPivot.visible=!!batting;poseHands(r,batting);setExpression(r,'neutral');
}
// Reference-authored motion: setup, gather, plant, hip lead, contact, extension, finish.
// Anatomical convention: body faces +Z; L limbs are +X, R limbs are -X.
// A RHH leads toward +X with the left foot/hand and stands at world +X.
// Mirroring a swing changes positions and yaw, never hand names or mesh scale.
const SWING_TRACKS={
 Auden:{width:.178,crouch:.021,lift:.050,stride:.067,coil:.27,hip:1.03,chest:1.32,handHeight:.748,finish:.815,release:1.10,lean:.044,head:.02,contactReach:.014,extensionReach:.020,backHeel:.66,backPivot:.98,setupAway:.024},
 Jarvis:{width:.176,crouch:.022,lift:.024,stride:.083,coil:.20,hip:1.05,chest:1.38,handHeight:.737,finish:.815,release:1.10,lean:.033,head:.00,contactReach:.018,extensionReach:.026,backHeel:.63,backPivot:1.04,setupAway:.058},
 Najee:{width:.192,crouch:.052,lift:.012,stride:.026,coil:.22,hip:1.12,chest:1.43,handHeight:.725,finish:.800,release:.705,lean:.050,head:.03,contactReach:.020,extensionReach:.030,backHeel:.72,backPivot:1.08,setupAway:.026},
 Jason:{width:.158,crouch:.033,lift:.095,stride:.060,coil:.27,hip:1.14,chest:1.36,handHeight:.731,finish:.812,release:1.10,lean:.038,head:.035,contactReach:.014,extensionReach:.023,backHeel:.58,backPivot:.92,setupAway:.054},
 Coel:{width:.145,crouch:.043,lift:.020,stride:.060,coil:.18,hip:1.04,chest:1.31,handHeight:.690,finish:.790,release:.76,lean:.110,head:.02,contactReach:.018,extensionReach:.028,backHeel:.70,backPivot:1.04,setupAway:.010},
 Josef:{width:.145,crouch:.043,lift:.020,stride:.060,coil:.18,hip:1.04,chest:1.31,handHeight:.690,finish:.790,release:.76,lean:.110,head:.02,contactReach:.018,extensionReach:.028,backHeel:.70,backPivot:1.04,setupAway:.010}
};
const SWING_PHASES=[0,.22,.39,.48,.57,.67,.84,1];
function trackSample(values,t){
 // Nonuniform PCHIP: shared time derivatives at phase boundaries and no overshoot.
 let i=0;while(i<SWING_PHASES.length-2&&t>SWING_PHASES[i+1])i++;
 const slope=j=>(values[j+1]-values[j])/(SWING_PHASES[j+1]-SWING_PHASES[j]);
 const tangent=j=>{if(j===0||j===values.length-1)return 0;const a=slope(j-1),b=slope(j);if(a*b<=0)return 0;const h0=SWING_PHASES[j]-SWING_PHASES[j-1],h1=SWING_PHASES[j+1]-SWING_PHASES[j],w1=2*h1+h0,w2=h1+2*h0;return (w1+w2)/(w1/a+w2/b)};
 const dt=SWING_PHASES[i+1]-SWING_PHASES[i],f=clamp((t-SWING_PHASES[i])/dt,0,1),m1=tangent(i)*dt,m2=tangent(i+1)*dt;
 return (2*f*f*f-3*f*f+1)*values[i]+(f*f*f-2*f*f+f)*m1+(-2*f*f*f+3*f*f)*values[i+1]+(f*f*f-f*f)*m2;
}
function batOrientation(sign,yaw,elevation,t){
 // Explicit yaw/elevation/roll prevents the 180-degree twist near a back-facing bat.
 return new THREE.Quaternion().setFromEuler(new THREE.Euler(-elevation,sign*(yaw-Math.PI/2),0,'YXZ')).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),sign*trackSample([1.6,1.5,1.2,.60,0,-.25,-.65,-.80],t)));
}
function solveTwoBone(upper,joint,origin,target,a,b,pole,hinged=false){
 const dir=target.clone().sub(origin),rawDistance=dir.length();
 if(rawDistance<1e-6)dir.set(0,-1,0);else dir.multiplyScalar(1/rawDistance);
 const dist=clamp(Math.max(rawDistance,1e-6),Math.abs(a-b)+.006,a+b-.004),projected=origin.clone().addScaledVector(dir,dist),along=(a*a-b*b+dist*dist)/(2*dist);
 let bend=pole.clone().addScaledVector(dir,-pole.dot(dir));
 if(bend.lengthSq()<1e-7){bend=Math.abs(dir.y)<.90?new THREE.Vector3(0,1,0).cross(dir):new THREE.Vector3(1,0,0).cross(dir)}
 bend.normalize();
 const e=origin.clone().addScaledVector(dir,along).addScaledVector(bend,Math.sqrt(Math.max(0,a*a-along*along))),axis=new THREE.Vector3(0,-1,0);
 if(!hinged){upper.quaternion.setFromUnitVectors(axis,e.clone().sub(origin).normalize());joint.quaternion.copy(upper.quaternion).invert().multiply(new THREE.Quaternion().setFromUnitVectors(axis,projected.clone().sub(e).normalize()));return Math.max(0,rawDistance-dist);}
 const upperDir=e.clone().sub(origin).normalize(),lowerDir=projected.clone().sub(e).normalize();
 let hinge=lowerDir.clone().cross(upperDir);if(hinge.lengthSq()<1e-7)hinge.copy(bend);hinge.normalize();
 const up=upperDir.clone().negate();let forward=hinge.clone().cross(up);if(forward.lengthSq()<1e-7)forward.copy(dir);forward.normalize();
 upper.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(hinge,up,forward));
 joint.rotation.set(-Math.acos(clamp(upperDir.dot(lowerDir),-1,1)),0,0);return Math.max(0,rawDistance-dist);
}
function plantFoot(root,side,position,yaw=0,heel=0,kneeBias=0,hinged=false){
 const u=root.userData,L=u.limbs,upper=L[side+'Hip'],joint=L[side+'Knee'];root.updateMatrixWorld(true);const target=u.pelvis.worldToLocal(root.localToWorld(position.clone()));
 const rootQ=root.getWorldQuaternion(new THREE.Quaternion()),pelvisQ=u.pelvis.getWorldQuaternion(new THREE.Quaternion());
 // A small lateral pole bias lets the back knee rotate around the planted
 // ankle instead of behaving like a door hinge during a swing/delivery.
 const sg=side==='L'?1:-1,pole=new THREE.Vector3(sg*kneeBias,0,1).normalize().applyQuaternion(rootQ).applyQuaternion(pelvisQ.clone().invert());
 solveTwoBone(upper,joint,upper.parent.position,target,u.upperLeg,u.lowerLeg,pole,hinged);
 root.updateMatrixWorld(true);const desired=new THREE.Quaternion().setFromEuler(new THREE.Euler(heel,yaw,0,'YXZ')).premultiply(rootQ),parentQ=L[side+'Ankle'].parent.getWorldQuaternion(new THREE.Quaternion());L[side+'Ankle'].quaternion.copy(parentQ.invert()).multiply(desired);
}
function gripBatStable(r){
 const u=r.userData,L=u.limbs,h=u.height,sign=D.players[u.name]._meta.bats==='L'?-1:1,lower=sign===1?'L':'R',top=lower==='L'?'R':'L';
 const worldUp=new THREE.Vector3(0,1,0),gripPocketLocal=new THREE.Vector3(0,-h*.0125,h*.0085);
 u.gripTargets={};u.gripError=0;
 // A rigid bat cannot live beyond both arms' reachable radius. Before solving
 // the elbows/wrists, pull the whole bat inward only as much as necessary so
 // both actual palm pockets can physically reach their stacked handle sites.
 // This removes the old failure mode where the wrist/hand was distorted to
 // chase an impossible bat location at contact/extension.
 for(let pass=0;pass<5;pass++){
  r.updateMatrixWorld(true);u.spine.updateWorldMatrix(true,true);u.bat.updateWorldMatrix(true,true);
  const batWorldQ=u.bat.getWorldQuaternion(new THREE.Quaternion()),batAxisWorld=new THREE.Vector3(0,0,1).applyQuaternion(batWorldQ).normalize(),corrections=[];
  for(const side of ['L','R']){
   const isTop=side===top,baseZ=.150+(u.name==='Jarvis'?.005:0),stack=h*(u.name==='Auden'?.034:u.name==='Najee'?.033:.035),z=baseZ+(isTop?stack:0),held=u.releaseHand<=0||!isTop;if(!held)continue;
   let palmNormalWorld=new THREE.Vector3().crossVectors(worldUp,batAxisWorld);
   if(palmNormalWorld.lengthSq()<1e-5){const bodyForward=new THREE.Vector3(0,0,1).applyQuaternion(u.spine.getWorldQuaternion(new THREE.Quaternion()));bodyForward.y=0;if(bodyForward.lengthSq()<1e-5)bodyForward.set(sign,0,0);palmNormalWorld.copy(bodyForward).addScaledVector(batAxisWorld,-bodyForward.dot(batAxisWorld));}
   palmNormalWorld.normalize().multiplyScalar(isTop?-1:1);
   const handXWorld=batAxisWorld.clone(),handZWorld=palmNormalWorld.clone(),handYWorld=handZWorld.clone().cross(handXWorld).normalize();handZWorld.copy(handXWorld.clone().cross(handYWorld)).normalize();
   const pocketOffsetWorld=handXWorld.clone().multiplyScalar(gripPocketLocal.x).addScaledVector(handYWorld,gripPocketLocal.y).addScaledVector(handZWorld,gripPocketLocal.z),handleWorld=u.bat.localToWorld(new THREE.Vector3(0,0,z)),wristWorld=handleWorld.clone().sub(pocketOffsetWorld),target=u.spine.worldToLocal(wristWorld.clone()),origin=L[side+'Shoulder'].parent.position,maxReach=u.upperArm+u.foreArm-.008,delta=target.clone().sub(origin),dist=delta.length();
   if(dist>maxReach){const reachable=origin.clone().addScaledVector(delta.normalize(),maxReach),c=reachable.sub(target);corrections.push(c);}
  }
  if(!corrections.length)break;
  const correction=corrections.reduce((a,c)=>a.add(c),new THREE.Vector3()).multiplyScalar(1/corrections.length),maxStep=h*.035;if(correction.length()>maxStep)correction.setLength(maxStep);u.batPivot.position.add(correction);
 }
 r.updateMatrixWorld(true);u.spine.updateWorldMatrix(true,true);u.bat.updateWorldMatrix(true,true);
 const batWorldQ=u.bat.getWorldQuaternion(new THREE.Quaternion()),batAxisWorld=new THREE.Vector3(0,0,1).applyQuaternion(batWorldQ).normalize();
 for(const side of ['L','R']){
  const isTop=side===top,sg=side==='L'?1:-1,baseZ=.150+(u.name==='Jarvis'?.005:0),stack=h*(u.name==='Auden'?.034:u.name==='Najee'?.033:.035),z=baseZ+(isTop?stack:0),held=u.releaseHand<=0||!isTop,handleWorld=u.bat.localToWorld(new THREE.Vector3(0,0,z));
  // Palm normal is the horizontal vector perpendicular to the handle. This is
  // handedness-agnostic and prevents either LHH or RHH palms from rolling up
  // toward the sky while preserving opposing top/bottom-hand grip orientation.
  let palmNormalWorld=new THREE.Vector3().crossVectors(worldUp,batAxisWorld);
  if(palmNormalWorld.lengthSq()<1e-5){const bodyForward=new THREE.Vector3(0,0,1).applyQuaternion(u.spine.getWorldQuaternion(new THREE.Quaternion()));bodyForward.y=0;if(bodyForward.lengthSq()<1e-5)bodyForward.set(sign,0,0);palmNormalWorld.copy(bodyForward).addScaledVector(batAxisWorld,-bodyForward.dot(batAxisWorld));}
  palmNormalWorld.normalize().multiplyScalar(isTop?-1:1);
  const handXWorld=batAxisWorld.clone(),handZWorld=palmNormalWorld.clone(),handYWorld=handZWorld.clone().cross(handXWorld).normalize();handZWorld.copy(handXWorld.clone().cross(handYWorld)).normalize();
  const pocketOffsetWorld=handXWorld.clone().multiplyScalar(gripPocketLocal.x).addScaledVector(handYWorld,gripPocketLocal.y).addScaledVector(handZWorld,gripPocketLocal.z),wristWorld=handleWorld.clone().sub(pocketOffsetWorld);
  let target=u.spine.worldToLocal(wristWorld.clone());
  if(!held){const release=SWING_TRACKS[u.name].release,f=sm(clamp((u.swingPhase-release)/Math.max(.05,1-release),0,1)),free=new THREE.Vector3(sign*h*(.105+.080*f),h*(.57-.28*f),h*(.12+.16*f));target.lerp(free,f);}
  const drive=sm(clamp((u.swingPhase-.28)/.30,0,1));let pole=new THREE.Vector3(sg*(isTop?1.08:.74),-.58-.16*drive,1.10-.08*drive).normalize();
  if(u.name==='Najee')pole.set(sg*(isTop?1.04:.90),-.38-.06*drive,1.26-.05*drive).normalize();if(u.name==='Auden')pole.set(sg*(isTop?1.02:.82),-.46-.09*drive,1.20-.06*drive).normalize();
  solveTwoBone(L[side+'Shoulder'],L[side+'Elbow'],L[side+'Shoulder'].parent.position,target,u.upperArm,u.foreArm,pole,true);r.updateMatrixWorld(true);
  const wrist=L[side+'Wrist'],hand=u.hands[side];hand.hand.position.set(0,0,0);hand.hand.quaternion.identity();
  if(held){
   const desired=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(handXWorld,handYWorld,handZWorld)),parentQ=wrist.parent.getWorldQuaternion(new THREE.Quaternion()),localDesired=parentQ.clone().invert().multiply(desired),neutral=new THREE.Quaternion().setFromEuler(new THREE.Euler(-.08,sign*.006,sg*.008));
   wrist.quaternion.copy(neutral).slerp(localDesired,.32+.10*drive);r.updateMatrixWorld(true);const residual=wrist.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(desired);hand.hand.quaternion.copy(residual);r.updateMatrixWorld(true);
   // Only numerical residual is corrected here. Large offsets are forbidden—the
   // bat reach pass above must solve those, keeping the hand attached to wrist.
   const pocketWorld=hand.hand.localToWorld(gripPocketLocal.clone()),snap=wrist.worldToLocal(handleWorld.clone()).sub(wrist.worldToLocal(pocketWorld.clone())),limit=h*.004;if(snap.length()>limit)snap.setLength(limit);hand.hand.position.add(snap);r.updateMatrixWorld(true);
   const finalPocket=hand.hand.localToWorld(gripPocketLocal.clone());u.gripError=Math.max(u.gripError,finalPocket.distanceTo(handleWorld));
  }else{const relax=new THREE.Quaternion().setFromEuler(new THREE.Euler(-.08,sign*.045,sg*.018));wrist.quaternion.copy(relax);hand.hand.quaternion.identity();}
  const opening=isTop?(u.fingerRelease||0):0,fingerGrip=[.90,1.02,1.06,.96];hand.fingers.forEach((chain,i)=>chain.forEach((j,k)=>{const closed=[.44,.78,.62][k]*fingerGrip[i];j.rotation.x=lerp(-closed,-[.08,.12,.10][k],opening);if(k===0)j.rotation.z=(i-1.5)*lerp(.006,.018,opening);}));hand.thumb.rotation.x=lerp(-.54,-.10,opening);hand.thumb.rotation.z=(side==='L'?-1:1)*lerp(.28,.12,opening);
  const pocketError=held?hand.hand.localToWorld(gripPocketLocal.clone()).distanceTo(handleWorld):null;u.gripTargets[side]={target:target.toArray(),held,handleZ:z,palmSkyDot:Math.abs(palmNormalWorld.dot(worldUp)),pocketError,handedness:sign===1?'R':'L',role:isTop?'top':'bottom'};
 }
 u.swingHandedness={bats:sign===1?'R':'L',lead:lower,topHand:top,pitcherAxis:[sign,0,0]};u.releaseEvent={hand:SWING_TRACKS[u.name].release<1?top:null,phase:SWING_TRACKS[u.name].release,opening:u.fingerRelease||0};
}

function applySwingFrame(r,t,now=0){
 neutralRig(r,true);const u=r.userData,L=u.limbs,h=u.height,p=SWING_TRACKS[u.name],side=D.players[u.name]._meta.bats==='L'?-1:1;
 const front=side===1?'L':'R',back=side===1?'R':'L';
 const reachPhase=trackSample([.30,.25,.35,.70,1,1,.85,.80],t);
 L[front+'Shoulder'].parent.position.z=h*.062*reachPhase;L[front+'Shoulder'].parent.position.x*=1-.11*reachPhase;
 L[back+'Shoulder'].parent.position.z=h*.032*reachPhase;
 L[front+'Shoulder'].parent.position.z+=h*.012*sm(clamp((t-.43)/.055,0,1))*(1-sm(clamp((t-.72)/.08,0,1)));
 // Small authored clavicle correctives preserve clearance at the cross-body poses.
 if(u.name==='Coel')L[front+'Shoulder'].parent.position.z+=h*.026*Math.exp(-Math.pow((t-.425)/.080,4));
 if(u.name==='Najee')L[front+'Shoulder'].parent.position.z+=h*(.014*Math.exp(-Math.pow((t-.50)/.068,4))+.023*sm(clamp((t-.53)/.05,0,1))*(1-sm(clamp((t-.70)/.08,0,1))));
 if(u.name==='Coel')L[front+'Shoulder'].parent.position.z+=h*.016*sm(clamp((t-.57)/.08,0,1));
 if(p.release>1)L[back+'Shoulder'].parent.position.z+=h*.023*sm(clamp((t-.77)/.13,0,1));
 // Scapular protraction/retraction is visible in real swings before the elbows
 // move. It keeps the arms attached to the torso instead of looking socketed on.
 const scap=sm(clamp((t-.29)/.21,0,1))*(1-sm(clamp((t-.88)/.16,0,1)));
 const scapRelease=sm(clamp((t-.68)/.22,0,1));
 L[front+'Shoulder'].parent.position.y+=h*(.009*scap-.002*scapRelease);L[front+'Shoulder'].parent.position.x-=side*h*(.010*scap-.003*scapRelease);
 L[back+'Shoulder'].parent.position.y-=h*(.004*scap-.002*scapRelease);L[back+'Shoulder'].parent.position.x+=side*h*(.008*scap-.004*scapRelease);
 L[front+'Shoulder'].parent.position.z+=h*.010*scapRelease;L[back+'Shoulder'].parent.position.z-=h*.006*scapRelease;
 const load=trackSample([0,1,.75,.4,0,0,0,0],t),plant=clamp(trackSample([0,0,1,1,1,1,1,1],t),0,1),hip=trackSample([0,-p.coil,.08,.48,.82,1.10,1.30,1.34],t),chest=trackSample([0,-p.coil*.9,-.10,.17,.72,1.10,1.58,1.60],t);
 const weight=trackSample(u.name==='Coel'?[-.008,-.026,.034,.065,.092,.108,.111,.110]:[-.012,-.035,-.015,.014,.031,.040,.036,.032],t),lift=Math.max(0,trackSample([0,p.lift,0,0,0,0,0,0],t));
 u.pelvis.position.set(side*h*weight,u.legTotal+h*.020-h*p.crouch+h*.012*plant,0);
 u.pelvis.rotation.y=side*p.hip*hip;u.spine.rotation.y=side*(p.chest*chest-p.hip*hip);u.spine.rotation.z=-side*p.lean*trackSample([0,.2,.1,.3,.7,1,.85,.7],t);
 u.neck.rotation.y=side*1.30-u.pelvis.rotation.y-u.spine.rotation.y;u.neck.rotation.z=-u.spine.rotation.z*.6;u.neck.rotation.x=p.head;
 const heel=sm(clamp((t-.38)/.31,0,1))*p.backHeel;
 const frontYaw=side*.26*sm(clamp((plant-.05)/.95,0,1)),backYaw=side*p.backPivot*sm(clamp((t-.40)/.34,0,1)),shoeLength=h*.16;
 const frontOffset=new THREE.Vector3(0,-.12,-shoeLength*.25).applyEuler(new THREE.Euler(0,frontYaw,0,'YXZ'));
 const frontTarget=new THREE.Vector3(side*h*(p.width+p.stride*plant),h*lift,.015*h-shoeLength*.25).sub(frontOffset);
 const backOffset=new THREE.Vector3(0,-.12,shoeLength*.48).applyEuler(new THREE.Euler(heel,backYaw,0,'YXZ'));
 const backTarget=new THREE.Vector3(-side*h*p.width,0,shoeLength*.48).sub(backOffset);
 // Lower the pelvis as needed so planted feet are genuinely reachable by fixed-length legs.
 for(const [leg,target] of [[front,frontTarget],[back,backTarget]]){const hip=L[leg+'Hip'].parent.position.clone().applyQuaternion(u.pelvis.quaternion).add(u.pelvis.position),dx=hip.x-target.x,dz=hip.z-target.z,maxY=target.y+Math.sqrt(Math.max(.01,(u.legTotal-.012)**2-dx*dx-dz*dz));u.pelvis.position.y=Math.min(u.pelvis.position.y,maxY)}
 plantFoot(r,front,frontTarget,frontYaw,0,-.04);
 plantFoot(r,back,backTarget,backYaw,heel,.22*sm(clamp((t-.38)/.24,0,1)));
 const hand=new THREE.Vector3(side*h*trackSample([-.081,-.093,-.073,-.030,.088,.145,.134,.118],t),h*trackSample([p.handHeight,p.handHeight+.01,p.handHeight-.025,.650,.595,.650,p.finish,p.finish-.030],t),h*trackSample([.100,.091,.095,.160,.205,.210,-.110,-.140],t));
 const setupHold=1-sm(clamp((t-.16)/.24,0,1));hand.x-=side*h*(p.setupAway||0)*setupHold;hand.z+=h*(p.setupAway||0)*.42*setupHold;
 hand.z+=h*(u.name==='Coel'?.028:u.name==='Najee'?.018:0)*trackSample([0,0,.7,1,.5,0,0,0],t);
 hand.z+=h*.052*sm(clamp((t-.25)/.13,0,1))*(1-sm(clamp((t-.54)/.10,0,1)));hand.z+=h*.014;
 // Drive the hands through the baseball before the wrap. This gives the lead
 // arm room to straighten at contact and the top arm room to straighten just
 // after contact instead of preserving an artificial bent-elbow pose.
 const contactExt=sm(clamp((t-.465)/.11,0,1))*(1-sm(clamp((t-.675)/.13,0,1)));
 const throughExt=sm(clamp((t-.54)/.14,0,1))*(1-sm(clamp((t-.835)/.15,0,1)));
 const lateExtension=sm(clamp((t-.66)/.14,0,1))*(1-sm(clamp((t-.89)/.10,0,1)));
 hand.x+=side*h*(p.contactReach*contactExt+p.extensionReach*throughExt+p.extensionReach*.18*lateExtension);
 hand.z+=h*(p.contactReach*.55*contactExt+p.extensionReach*.72*throughExt+p.extensionReach*.20*lateExtension);
 const yaw=trackSample([-.54,-.77,-.98,-.55,Math.PI/2,2.58,4.78,5.30],t),elevation=trackSample([1.12,1.02,.82,.27,.035,.20,.31,.27],t);
 const dir=new THREE.Vector3(-side*Math.cos(yaw)*Math.cos(elevation),Math.sin(elevation),Math.sin(yaw)*Math.cos(elevation)).normalize();
 const orientation=batOrientation(side,yaw,elevation,t);r.updateMatrixWorld(true);
 const wrap=sm(clamp((t-.82)/.18,0,1)),finishHand=r.worldToLocal(u.spine.localToWorld(new THREE.Vector3(side*h*.115,u.torsoLen*.99,h*.188)));hand.lerp(finishHand,wrap);
 u.batPivot.position.copy(u.spine.worldToLocal(r.localToWorld(hand)));const desiredQ=r.getWorldQuaternion(new THREE.Quaternion()).multiply(orientation);u.batPivot.quaternion.copy(u.spine.getWorldQuaternion(new THREE.Quaternion()).invert()).multiply(desiredQ);
 if(u.necklace){u.necklace.rotation.z=-side*.044*Math.sin(t*Math.PI*1.08);u.necklace.rotation.x=.010*Math.sin(t*Math.PI*2.0);u.necklace.position.z=h*.0055*Math.sin(t*Math.PI*2.0);}
 u.swingPhase=t;u.releaseHand=t>p.release?sm(clamp((t-p.release)/.225,0,1)):0;u.fingerRelease=p.release<1?sm(clamp((t-p.release+.008)/.205,0,1)):0;gripBatStable(r);setExpression(r,'focused',now);
}
function stanceRig(r,now=performance.now()){applySwingFrame(r,0,now);const u=r.userData,side=D.players[u.name]._meta.bats==='L'?-1:1;
 // Signature setup language only: PCBL identities remain their own models.
 if(u.name==='Najee'){ // Soto-like: wide, low, rhythmic and loose before launch.
  const rhythm=Math.sin(now*.0042),breath=Math.sin(now*.0021);u.spine.rotation.z+=side*(.020+.016*rhythm);u.spine.rotation.x+=.020+.010*breath;u.pelvis.position.y+=Math.abs(Math.sin(now*.0042))*u.height*.0032;u.batPivot.rotation.z+=side*(.050+.038*Math.sin(now*.0061));u.batPivot.rotation.x+=.026*Math.sin(now*.0052);
 }else if(u.name==='Auden'){ // Suárez-like: upright/open, high active hands.
  u.spine.rotation.z-=side*.014;u.spine.rotation.x-=.010;u.batPivot.position.y+=u.height*.010;u.batPivot.rotation.z+=side*(.038+.022*Math.sin(now*.0048));u.batPivot.rotation.x-=.035+.014*Math.sin(now*.0057);
 }else if(u.name==='Jarvis'||u.name==='Jason'){ // Ohtani-like hand separation from torso.
  const away=u.name==='Jarvis'?.050:.040;u.batPivot.position.x-=side*u.height*away;u.batPivot.position.z+=u.height*.038;u.batPivot.position.y+=u.height*.007;u.batPivot.rotation.z+=side*(.024+.010*Math.sin(now*.0038));
 }else{u.batPivot.position.z+=u.height*.020;u.batPivot.position.x-=side*u.height*.014;u.batPivot.rotation.z+=Math.sin(now*.0031)*.010}gripBatStable(r)}
function celebrationArm(u,side,target,pole){
 const L=u.limbs,upper=L[side+'Shoulder'],elbow=L[side+'Elbow'];
 solveTwoBone(upper,elbow,upper.parent.position,target,u.upperArm,u.foreArm,pole,true);
}
function homeRunCelebrationRig(r,state){
 const u=r.userData,L=u.limbs,h=u.height,t=clamp(state?.t||0,0,1),name=u.name,side=D.players[name]._meta.bats==='L'?-1:1;
 // Alpha 91: all hitters use Auden's no-doubt celebration. The hitter's own
 // batting side still mirrors the same choreography naturally for lefties.
 applySwingFrame(r,1,0);u.releaseHand=1;u.fingerRelease=1;u.batPivot.visible=true;setExpression(r,'happy');
 for(const hand of Object.values(u.hands||{})){hand.fingers?.forEach(chain=>chain.forEach((j,k)=>{j.rotation.x=-[.10,.14,.11][k]}));if(hand.thumb)hand.thumb.rotation.x=-.08;}
 const admire=sm(clamp(t/.22,0,1)),hold=1-sm(clamp((t-.20)/.08,0,1)),toss=sm(clamp((t-.20)/.34,0,1)),float=sm(clamp((t-.54)/.34,0,1));
 u.neck.rotation.x=-.13;u.neck.rotation.y=-side*(.12+.08*admire);u.spine.rotation.x=-.018*admire;u.spine.rotation.z=side*.025*admire;
 u.batPivot.position.y+=h*(.02*hold+.46*toss+.25*float);u.batPivot.position.z+=h*(.02*hold+.12*toss+.18*float);u.batPivot.position.x+=side*h*(.02*hold+.06*toss+.10*float);
 u.batPivot.rotation.x+=toss*Math.PI*1.75+float*Math.PI*1.25;u.batPivot.rotation.z-=side*(toss*Math.PI*1.45+float*Math.PI*.72);
}
function swingRig(r,state){
 const kind=String(state?.kind||'swing'),type=state?.type||'regular',t=clamp(state?.t||0,0,1);
 if(kind==='hr'){homeRunCelebrationRig(r,state);return}
 applySwingFrame(r,kind.startsWith('flip')?1:t);if(kind.startsWith('flip'))setExpression(r,'happy');
}
// Torso clearance uses the same cross-section proportions as the shirt.
// Connected shoulder caps are allowed to overlap at the garment seam.
function torsoClearance(u,v,radius=0){
 const y=v.y/u.torsoLen;if(y<-.035||y>.875)return 1;
 const rx=profileRadius([[0,u.hipHalf*1.08],[.16,u.hipHalf*1.06],[.38,u.shoulderHalf*.88],[.62,u.shoulderHalf],[.79,u.shoulderHalf*.99],[.875,u.shoulderHalf*.78]],Math.max(0,y));
 const rz=profileRadius([[0,u.hipHalf*.78],[.16,u.hipHalf*.80],[.38,u.shoulderHalf*.66*u.b.belly],[.62,u.shoulderHalf*.65*u.b.belly],[.79,u.shoulderHalf*.52],[.875,u.shoulderHalf*.42]],Math.max(0,y));
 return (Math.hypot(v.x/rx,v.z/rz)-1)*Math.min(rx,rz)-radius;
}
function armElbow(origin,target,a,b,pole){
 const dir=target.clone().sub(origin),dist=clamp(dir.length(),Math.abs(a-b)+.002,a+b-.004);dir.normalize();
 const along=(a*a-b*b+dist*dist)/(2*dist),bend=pole.clone().addScaledVector(dir,-pole.dot(dir)).normalize();
 return origin.clone().addScaledVector(dir,along).addScaledVector(bend,Math.sqrt(Math.max(0,a*a-along*along)));
}
function segmentDistance(a,b,c,d){
 const u=b.clone().sub(a),v=d.clone().sub(c),w=a.clone().sub(c),aa=u.dot(u),bb=u.dot(v),cc=v.dot(v),dd=u.dot(w),ee=v.dot(w),den=aa*cc-bb*bb;
 let s=den>1e-10?clamp((bb*ee-cc*dd)/den,0,1):0,t=(bb*s+ee)/cc;
 if(t<0){t=0;s=clamp(-dd/aa,0,1)}else if(t>1){t=1;s=clamp((bb-dd)/aa,0,1)}
 return a.clone().addScaledVector(u,s).distanceTo(c.clone().addScaledVector(v,t));
}
function armGripCandidate(u,desired,side,pole){
 const d=desired[side],origin=u.limbs[side+'Shoulder'].parent.position,h=u.height,release=d.release||0,palmLength=h*Math.hypot(.04838,.014);
 const palm=palmLength*(1-release),flex=trackSample([.35,.45,.70,.65,.45,.65,.78,.70],u.swingPhase),reach=Math.sqrt(u.foreArm*u.foreArm+palm*palm+2*u.foreArm*palm*Math.cos(flex));
 const elbow=armElbow(origin,d.solveGoal,u.upperArm,reach,pole),chain=d.solveGoal.clone().sub(elbow),distance=chain.length(),axis=chain.clone().normalize();
 let target;
 if(palm<.00001)target=elbow.clone().addScaledVector(axis,u.foreArm);
 else{
  const along=(u.foreArm*u.foreArm-palm*palm+distance*distance)/(2*distance),height=Math.sqrt(Math.max(0,u.foreArm*u.foreArm-along*along));
  const bend=pole.clone().addScaledVector(axis,-pole.dot(axis));
  if(bend.lengthSq()<.00001)bend.copy(pole).addScaledVector(axis,-pole.dot(axis));bend.normalize();
  target=elbow.clone().addScaledVector(axis,along).addScaledVector(bend,height);
 }
 const forward=d.solveGoal.clone().sub(target).normalize();
 // The palm is the third link. Its handle contact follows the rigid bat.
 let x=d.along.clone().multiplyScalar(d.isTop?-1:1);x.addScaledVector(forward,-x.dot(forward));
 if(x.lengthSq()<.001)x.copy(pole).cross(forward);x.normalize();
 const tangent=x.clone().cross(forward),c=.04838/Math.hypot(.04838,.014),k=.014/Math.hypot(.04838,.014),y=forward.clone().multiplyScalar(-c).addScaledVector(tangent,-k),z=x.clone().cross(y);
 let basis=new THREE.Matrix4().makeBasis(x,y,z);
 if(release>0){
  // Transport the released palm with the forearm. A fixed world-down target
  // folded the free wrist to 90 degrees while the arm was still extended.
  const rootQ=u.motion.parent.getWorldQuaternion(new THREE.Quaternion()),start=u.spine.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(rootQ).multiply(new THREE.Quaternion().fromArray(u.swingPoles?.releaseQ||[0,0,0,1])),down=new THREE.Vector3(0,-1,0).applyQuaternion(start),fore=target.clone().sub(elbow).normalize();
  const relaxed=new THREE.Quaternion().setFromUnitVectors(down,fore).multiply(start).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),-.12));
  const settling=sm(clamp((u.swingPhase-SWING_TRACKS[u.name].release)/.085,0,1));basis.makeRotationFromQuaternion(start.slerp(relaxed,settling));
 }
 return {elbow,target,basis};
}
function chooseArmPoles(u,desired,top){
 const h=u.height,t=u.swingPhase,out={};
 if(u.swingPoles&&!u.bakingSwing){
  // Monotone cubic interpolation gives a shared velocity at cache boundaries,
  // while keeping every component inside the collision-tested sample range.
  for(const side of ['L','R']){const frames=u.swingPoles[side],f=clamp(t,0,1)*(frames.length-1),i=Math.min(frames.length-2,Math.floor(f)),q=f-i,v=[];
   for(let k=0;k<3;k++){const a=frames[i][k],b=frames[i+1][k],d=b-a,prior=a-frames[Math.max(0,i-1)][k],next=frames[Math.min(frames.length-1,i+2)][k]-b,m0=prior*d>0?2*prior*d/(prior+d):0,m1=next*d>0?2*next*d/(next+d):0;v.push((2*q*q*q-3*q*q+1)*a+(q*q*q-2*q*q+q)*m0+(-2*q*q*q+3*q*q)*b+(q*q*q-q*q)*m1);}
   out[side]=new THREE.Vector3(...v).normalize();}return out;
 }
 const batA=u.spine.worldToLocal(u.bat.localToWorld(new THREE.Vector3(0,0,-.025))),batB=u.spine.worldToLocal(u.bat.localToWorld(new THREE.Vector3(0,0,2.725)));
 const headMatrix=new THREE.Matrix4().copy(u.face.headMesh.parent.matrixWorld).invert().multiply(u.spine.matrixWorld),all={};
 for(const side of ['L','R']){
  const origin=u.limbs[side+'Shoulder'].parent.position,goal=desired[side].solveGoal,axis=goal.clone().sub(origin).normalize(),sg=side==='L'?1:-1,isTop=side===top;
  const drive=sm(clamp((t-.25)/.23,0,1))*(1-sm(clamp((t-.71)/.15,0,1))),release=isTop?u.releaseHand:0;
  const authored=isTop?new THREE.Vector3(sg*lerp(.85,.22,drive),lerp(-.55,-1.6,drive),.82):new THREE.Vector3(sg*.22,-1.25,.90);
  let basis=authored.clone().addScaledVector(axis,-authored.dot(axis)).normalize(),previous=u.previousBend?.[side];

  const aim=armGripCandidate(u,desired,side,authored).elbow,candidates=[];
  const limit=Math.PI,steps=120;
  for(let i=0;i<=steps;i++){
   const a=-limit+2*limit*i/steps,pole=basis.clone().applyAxisAngle(axis,a),candidate=armGripCandidate(u,desired,side,pole),elbow=candidate.elbow,target=candidate.target,palm=new THREE.Vector3(0,-1,0).applyMatrix4(candidate.basis).normalize();
   let score=elbow.distanceToSquared(aim)*2.0;
   const palmAxis=desired[side].solveGoal.clone().sub(target).normalize(),crossing=Math.abs(palmAxis.dot(desired[side].along));
   score+=Math.max(0,crossing-.92)**2*1000000*(1-release);
   const wristAngle=Math.acos(clamp(target.clone().sub(elbow).normalize().dot(palm),-1,1));
   score+=Math.max(0,wristAngle-1.20)**2*(1-release)*6.0;
   if(isTop)score+=Math.max(0,elbow.y-target.y+h*.024)**2*drive*100000;
   score+=Math.max(0,elbow.y-origin.y+h*.010)**2*18;
   const headCost=(point,radius)=>{const p=point.clone().applyMatrix4(headMatrix),margin=(Math.hypot(p.x/(u.headR*.79),(p.y-u.headR*.05)/(u.headR*1.13),p.z/(u.headR*.87))-1)*u.headR*.79-radius;return Math.max(0,.040-margin)**2*10000000;};
   for(let seg=0;seg<2;seg++){
    const a0=seg?elbow:origin,b0=seg?target:elbow;
    for(let j=0;j<=12;j++){
     const f=j/12,point=a0.clone().lerp(b0,f),radius=h*(seg?lerp(.025,.016,f):lerp(.034,.022,f))*u.b.arm*(u.name==='Coel'||u.name==='Jason'?1.10:1);
     const batDelta=batB.clone().sub(batA),batT=clamp(point.clone().sub(batA).dot(batDelta)/batDelta.lengthSq(),0,1),batRadius=Math.max(lerp(.036,.065,batT),batT<.245?.040:0),batMargin=point.distanceTo(batA.clone().addScaledVector(batDelta,batT))-radius-batRadius;
     score+=Math.max(0,.045-batMargin)**2*20000000;
     if(seg||f>=.5)score+=Math.max(0,.065-torsoClearance(u,point,radius))**2*20000000+headCost(point,radius);
    }
   }
   candidates.push({pole,elbow,score,axis,origin:origin.clone(),target,worldElbow:elbow.clone().applyMatrix4(u.spine.matrixWorld),worldHand:u.spine.getWorldQuaternion(new THREE.Quaternion()).multiply(new THREE.Quaternion().setFromRotationMatrix(candidate.basis))});
  }
  u.candidateFrames[side].push(candidates);all[side]=candidates.slice().sort((a,b)=>a.score-b.score).slice(0,6);
 }
 let best=Infinity,pair;
 for(const l of all.L)for(const r of all.R){
  let score=l.score+r.score;
  // Arms may converge at their hands, but their upper arms/elbows/forearms
  // cannot pass through each other on the way to the two grip sites.
  for(const [a,b,ra] of [[l.origin,l.elbow,h*.027],[l.elbow,l.target.clone().lerp(l.elbow,.13),h*.022]])
   for(const [c,d,rb] of [[r.origin,r.elbow,h*.027],[r.elbow,r.target.clone().lerp(r.elbow,.13),h*.022]])score+=Math.max(0,ra+rb+.008-segmentDistance(a,b,c,d))**2*1000;
  if(score<best){best=score;pair={L:l,R:r};}
 }
 for(const side of ['L','R']){const c=pair[side];out[side]=c.pole;u.previousBend[side]={axis:c.axis.clone(),bend:c.pole.clone()};u.swingPoles[side].push(c.pole.toArray());}
 return out;
}
function continuousPolePath(u,side,otherPath){
 const frames=u.candidateFrames[side],other=side==='L'?'R':'L',backs=[],count=frames[0].length;
 let previous=new Float64Array(count);
 for(let f=0;f<frames.length;f++){
  const current=new Float64Array(count),back=new Uint16Array(count),candidates=frames[f];
  for(let i=0;i<count;i++){
   const c=candidates[i];let base=c.score;
   if(otherPath){const o=u.candidateFrames[other][f][otherPath[f]],h=u.height;
    for(const [a,b,ra] of [[c.origin,c.elbow,h*.027],[c.elbow,c.target.clone().lerp(c.elbow,.13),h*.022]])
     for(const [d,e,rb] of [[o.origin,o.elbow,h*.027],[o.elbow,o.target.clone().lerp(o.elbow,.13),h*.022]])base+=Math.max(0,ra+rb+.012-segmentDistance(a,b,d,e))**2*10000000;
   }
   if(!f){current[i]=base;continue;}
   let best=Infinity,bestIndex=0;
   for(let j=0;j<count;j++){
    const p=frames[f-1][j],dist=c.worldElbow.distanceTo(p.worldElbow),angle=c.worldHand.angleTo(p.worldHand);
    const cost=previous[j]+dist*dist*100+angle*angle*14+Math.max(0,dist-.085)**2*2e7+Math.max(0,angle-.12)**2*2e6;
    if(cost<best){best=cost;bestIndex=j;}
   }
   current[i]=base+best;back[i]=bestIndex;
  }
  backs.push(back);previous=current;
 }
 let index=0;for(let i=1;i<count;i++)if(previous[i]<previous[index])index=i;
 const path=new Uint16Array(frames.length);for(let f=frames.length-1;f>=0;f--){path[f]=index;index=backs[f][index];}return path;
}
const SWING_MOTION_REVISION='alpha21-release-groom-4';
function validSwingCache(c){return c&&['L','R'].every(side=>Array.isArray(c[side])&&c[side].length===321&&c[side].every(v=>Array.isArray(v)&&v.length===3&&v.every(Number.isFinite)&&Math.abs(Math.hypot(...v)-1)<.00001))&&(!c.releaseQ||(c.releaseQ.length===4&&c.releaseQ.every(Number.isFinite)&&Math.abs(Math.hypot(...c.releaseQ)-1)<.00001))&&(!c.releasePath||(c.releasePath.length===4&&c.releasePath.every(v=>v.length===3&&v.every(Number.isFinite))));}
const packagedMotion=window.PCBL_SWING_MOTION;
const SWING_POLE_CACHE={};
if(!window.PCBL_REBAKE_SWINGS&&packagedMotion?.revision===SWING_MOTION_REVISION)for(const [name,c]of Object.entries(packagedMotion.players||{}))if(SWING_TRACKS[name]&&validSwingCache(c))SWING_POLE_CACHE[name]=c;

function bakeSwingPoles(r){
 // Alpha 30 runtime swings use deterministic two-bone IK and do not perform
 // the old 321-frame elbow-pole search. Keeping a packaged cache reference is
 // harmless for legacy validation, but gameplay never depends on it.
 const u=r.userData;u.swingPoles=SWING_POLE_CACHE[u.name]||null;u.motionCacheSource='stable-runtime';u.bakingSwing=false;
}
function gripBat(r){return gripBatStable(r)}
function pitchSides(u){const throwSide=D.players[u.name]._meta.throws==='L'?'L':'R';return{throwSide,gloveSide:throwSide==='L'?'R':'L',mirror:throwSide==='L'?-1:1}}
function pitchSetRig(r,now=performance.now()){
 neutralRig(r,false);const u=r.userData,L=u.limbs,h=u.height,b=Math.sin(now*.0022)*.006,name=u.name,{throwSide,gloveSide}=pitchSides(u);
 if(u.necklace){u.necklace.rotation.z=Math.sin(now*.003)*.018;u.necklace.position.z=Math.sin(now*.0024)*u.height*.0015;}
 u.pelvis.position.y=u.legTotal+h*.020+b;u.spine.rotation.x=.010;
 // IK-authored set positions keep the hands physically connected to bent elbows
 // instead of relying on mirrored shoulder Euler poses. The set height is part
 // of each player's identity before the delivery even begins.
 const cfg={
  Auden:{y:.235,z:.115,sep:.020},Jason:{y:.145,z:.105,sep:.026},
  Jarvis:{y:.185,z:.112,sep:.024},Najee:{y:.168,z:.105,sep:.024},Coel:{y:.182,z:.090,sep:.030},Josef:{y:.182,z:.090,sep:.030}
 }[name]||{y:.18,z:.10,sep:.025};
 const tsg=throwSide==='L'?1:-1,gsg=-tsg,throwTarget=new THREE.Vector3(tsg*h*cfg.sep,h*cfg.y,h*cfg.z),gloveTarget=new THREE.Vector3(gsg*h*cfg.sep,h*(cfg.y+.004),h*(cfg.z+.006));
 solveTwoBone(L[throwSide+'Shoulder'],L[throwSide+'Elbow'],L[throwSide+'Shoulder'].parent.position,throwTarget,u.upperArm,u.foreArm,new THREE.Vector3(tsg,-.48,.58).normalize(),true);
 solveTwoBone(L[gloveSide+'Shoulder'],L[gloveSide+'Elbow'],L[gloveSide+'Shoulder'].parent.position,gloveTarget,u.upperArm,u.foreArm,new THREE.Vector3(gsg,-.48,.58).normalize(),true);
 L[throwSide+'Wrist'].rotation.set(-.08,0,tsg*.03);L[gloveSide+'Wrist'].rotation.set(-.05,0,gsg*.02);
 L.LHip.rotation.z=.045;L.RHip.rotation.z=-.045;L.LKnee.rotation.x=.035;L.RKnee.rotation.x=.035;setExpression(r,'focused',now)
}
function pcurve(values,t){
 const phases=[0,.14,.30,.45,.60,.74,.88,1,1.16,1.42];let i=0;while(i<phases.length-2&&t>phases[i+1])i++;
 const f=sm(clamp((t-phases[i])/(phases[i+1]-phases[i]),0,1));return lerp(values[i],values[i+1],f);
}
function pitchRig(r,state){
 pitchSetRig(r);const u=r.userData,L=u.limbs,h=u.height,t=clamp(state?.t||0,0,1.42),delivery=state?.delivery||'overhand',name=u.name;
 const {throwSide,gloveSide,mirror}=pitchSides(u),leadSide=gloveSide,driveSide=throwSide,throwSg=throwSide==='L'?1:-1,gloveSg=-throwSg,leadSg=leadSide==='L'?1:-1,driveSg=-leadSg;
 // Alpha 32: ten-pass authored delivery.  These are not five rescaled versions
 // of one motion: the phase timings, lower half, arm circle, slot and finish all
 // differ by player. Release remains exactly t=1.0 for gameplay synchronization.
 const S={
  Auden:{move:.04,rock:.10,lift0:.12,liftPeak:.36,liftEnd:.58,break0:.36,armDown:.58,stride0:.47,strike:.78,hip0:.64,shoulder0:.81,cock:.81,mer:.915,
    step:.060,lift:.325,land:.705,pelvis:.500,sink:.074,block:.043,cross:.020,closed:.185,hipOpen:.455,shoulderOpen:.405,lean:.52,side:.060,armSlot:.045,
    armOut:.215,armDownY:.045,armBack:.230,cockY:.315,cockBack:.145,releaseY:.292,releaseZ:.525,finishCross:.210,driveKick:.520,gloveReach:.335},
  Jarvis:{move:.035,rock:.09,lift0:.10,liftPeak:.33,liftEnd:.55,break0:.32,armDown:.47,stride0:.42,strike:.75,hip0:.61,shoulder0:.78,cock:.72,mer:.900,
    step:.040,lift:.355,land:.745,pelvis:.525,sink:.082,block:.040,cross:.090,closed:.165,hipOpen:.430,shoulderOpen:.390,lean:.57,side:.205,armSlot:.065,
    armOut:.245,armDownY:.075,armBack:.275,cockY:.340,cockBack:.170,releaseY:.335,releaseZ:.575,finishCross:.340,driveKick:.535,gloveReach:.365},
  Jason:{move:.03,rock:.18,lift0:.21,liftPeak:.43,liftEnd:.60,break0:.45,armDown:.65,stride0:.47,strike:.82,hip0:.70,shoulder0:.85,cock:.84,mer:.925,
    step:.205,lift:.165,land:.735,pelvis:.435,sink:.058,block:.038,cross:.016,closed:.165,hipOpen:.435,shoulderOpen:.385,lean:.47,side:.075,armSlot:.045,
    armOut:.205,armDownY:.047,armBack:.220,cockY:.305,cockBack:.145,releaseY:.286,releaseZ:.505,finishCross:.195,driveKick:.470,gloveReach:.325},
  Najee:{move:.025,rock:.10,lift0:.10,liftPeak:.30,liftEnd:.50,break0:.29,armDown:.49,stride0:.38,strike:.72,hip0:.58,shoulder0:.76,cock:.74,mer:.895,
    step:.095,lift:.300,land:.525,pelvis:.380,sink:.038,block:.028,cross:.018,closed:.158,hipOpen:.390,shoulderOpen:.345,lean:.34,side:.105,armSlot:.052,
    armOut:.175,armDownY:.052,armBack:.185,cockY:.285,cockBack:.122,releaseY:.272,releaseZ:.460,finishCross:.160,driveKick:.350,gloveReach:.300},
  Coel:{move:.02,rock:.06,lift0:.07,liftPeak:.23,liftEnd:.40,break0:.22,armDown:.37,stride0:.29,strike:.66,hip0:.52,shoulder0:.70,cock:.66,mer:.875,
    step:.045,lift:.220,land:.475,pelvis:.350,sink:.028,block:.024,cross:.004,closed:.180,hipOpen:.365,shoulderOpen:.325,lean:.29,side:.050,armSlot:.040,
    armOut:.135,armDownY:.105,armBack:.105,cockY:.285,cockBack:.080,releaseY:.278,releaseZ:.425,finishCross:.125,driveKick:.305,gloveReach:.265},
  Josef:{move:.02,rock:.06,lift0:.07,liftPeak:.23,liftEnd:.40,break0:.22,armDown:.37,stride0:.29,strike:.66,hip0:.52,shoulder0:.70,cock:.66,mer:.875,
    step:.045,lift:.220,land:.475,pelvis:.350,sink:.028,block:.024,cross:.004,closed:.180,hipOpen:.365,shoulderOpen:.325,lean:.29,side:.050,armSlot:.040,
    armOut:.135,armDownY:.105,armBack:.105,cockY:.285,cockBack:.080,releaseY:.278,releaseZ:.425,finishCross:.125,driveKick:.305,gloveReach:.265}
 }[name];
 const smooth=(a,b,x=t)=>sm(clamp((x-a)/Math.max(.0001,b-a),0,1));
 const pulse=(a,b,c,d)=>smooth(a,b)*(1-smooth(c,d));
 const k1=(keys)=>{if(t<=keys[0][0])return keys[0][1];for(let i=0;i<keys.length-1;i++){const A=keys[i],B=keys[i+1];if(t<=B[0])return lerp(A[1],B[1],sm(clamp((t-A[0])/(B[0]-A[0]),0,1)));}return keys[keys.length-1][1]};
 const kv=(keys,sg=1,flow=false)=>{const comp=c=>{if(t<=keys[0][0])return keys[0][c];for(let i=0;i<keys.length-1;i++){const A=keys[i],B=keys[i+1];if(t<=B[0]){const raw=clamp((t-A[0])/(B[0]-A[0]),0,1),f=flow&&A[0]>=S.mer?raw:sm(raw);return lerp(A[c],B[c],f)}}return keys[keys.length-1][c]};return new THREE.Vector3(sg*comp(1)*h,comp(2)*h,comp(3)*h)};
 const gather=smooth(S.move,S.liftPeak),rock=pulse(S.move,S.rock,S.liftPeak,S.stride0+.04),lift=pulse(S.lift0,S.liftPeak,S.liftPeak,S.liftEnd),stride=smooth(S.stride0,S.strike),plant=smooth(S.strike-.025,S.strike+.035),hipFire=smooth(S.hip0,.965),shoulderFire=smooth(S.shoulder0,1.0),finish=smooth(1.0,1.39);
 // PASS 1–3: balance, lift, stride and a genuine front-foot plant.
 const pelvisZ=h*k1([[0,0],[S.rock,-S.step],[S.liftPeak,-S.step*.86],[S.stride0,-S.step*.40],[S.strike,S.pelvis],[1,S.pelvis+.025],[1.42,S.pelvis-.01]]);
 const pelvisX=mirror*h*k1([[0,0],[S.liftPeak,name==='Jarvis'?.030:.008],[S.strike,S.cross*.55],[1,S.cross],[1.42,S.cross*.55]]);
 const pelvisY=u.legTotal+h*k1([[0,.020],[S.liftPeak,.020-S.sink],[S.strike,.020-S.sink*1.42],[.91,.020-S.sink*.40],[.97,.020+S.block*.28],[1,.020+S.block],[1.18,.020+S.block*.65],[1.42,.020+.006]]);
 u.pelvis.position.set(pelvisX,pelvisY,pelvisZ);
 // PASS 4: world-space hip/shoulder timing.  The shoulders stay closed while
 // the pelvis starts to open, then overtake late into release.
 const hipWorld=k1([[0,0],[S.liftPeak,-S.closed],[S.stride0,-S.closed*.70],[S.strike,S.hipOpen*.32],[.90,S.hipOpen*.76],[1,S.hipOpen],[1.18,S.hipOpen*.92],[1.42,S.hipOpen*.72]]);
 const shoulderWorld=k1([[0,0],[S.break0,-S.closed*.76],[S.strike,-S.closed*.48],[S.shoulder0,-S.closed*.34],[.94,S.shoulderOpen*.16],[1,S.shoulderOpen],[1.18,S.shoulderOpen*1.05],[1.42,S.shoulderOpen*.74]]);
 // Alpha 37: MLB-style upper-half sequencing without the old whole-body turn.
 // The ROOT remains square to the plate.  A restrained pelvis turn starts first,
 // then the ribcage overtakes it late.  Keeping the rotation inside the skeleton
 // gives the throwing shoulder room to travel without forcing the arm IK to warp.
 const appliedHipYaw=hipWorld*.46,appliedShoulderYaw=shoulderWorld*.88;
 u.pelvis.rotation.y=mirror*appliedHipYaw;
 u.spine.rotation.y=mirror*(appliedShoulderYaw-appliedHipYaw);
 u.pelvis.position.x+=mirror*h*(.010*hipFire-.004*finish);
 const forwardFlex=k1([[0,0],[S.liftPeak,-.032],[S.break0,-.020],[S.strike,.010],[S.cock,.020],[.92,S.lean*.12],[1,S.lean*.62],[1.18,S.lean],[1.42,S.lean*.72]]);
 const slotExtra=delivery==='submarine'?.180:delivery==='sidearm'?.075:0;
 const sideBend=k1([[0,0],[S.break0,-S.side*.10],[S.strike,-S.side*.28],[.92,-(S.side+slotExtra)*.62],[1,-(S.side+slotExtra)],[1.20,-S.side*.62],[1.42,-S.side*.18]]);
 u.spine.rotation.x=forwardFlex;u.spine.rotation.z=mirror*sideBend;
 u.neck.rotation.y=-mirror*.025*shoulderFire;u.neck.rotation.x=-u.spine.rotation.x*.34+.020*lift;u.neck.rotation.z=-u.spine.rotation.z*.44;
 // Player-specific foot paths. Jason gets the large literal step-back; Najee's
 // rearward move is smaller/faster; Auden's lead knee rides inward before launch.
 const leadLiftX=.100-(name==='Auden'?.044:name==='Jason'?.035:.030)*lift;
 const leadX=leadSg*h*(leadLiftX-S.cross*plant);
 // Player-specific lead-foot trajectories. Jason's reference is a dramatic
 // forward step, NOT a high kick. Auden keeps the lift but the foot descends
 // earlier so his stride travels closer to the ground into foot strike.
 const audenGrounding=name==='Auden'?lerp(1,.62,smooth(S.liftPeak,S.strike)):1;
 const jasonStepLow=name==='Jason'?.74:1;
 const leadY=h*S.lift*lift*audenGrounding*jasonStepLow;
 const leadZ=name==='Jason'
  ? h*k1([[0,0],[S.rock,-S.step*.08],[S.liftPeak,.035],[S.stride0,.155],[(S.stride0+S.strike)*.5,.455],[S.strike,S.land],[1,S.land],[1.42,S.land*.98]])
  : h*k1([[0,0],[S.rock,-S.step*.15],[S.liftPeak,-S.step*.20],[S.stride0,-.018],[S.strike,S.land],[1,S.land],[1.42,S.land*.98]]);
 const driveX=driveSg*h*(.105+(name==='Jarvis'?.030*gather:0)-.018*finish);
 const driveY=h*k1([[0,0],[S.strike,0],[1.025,0],[1.15,S.driveKick*.25],[1.28,S.driveKick*.68],[1.42,S.driveKick*.58]]);
 const driveZ=h*k1([[0,0],[S.rock,-S.step],[S.liftPeak,-S.step],[S.strike,-S.step*.22],[1.01,.012],[1.18,S.driveKick*.45],[1.30,S.driveKick*.72],[1.42,S.driveKick*.82]]);
 const leadTarget=new THREE.Vector3(leadX,leadY,leadZ),driveTarget=new THREE.Vector3(driveX,driveY,driveZ);
 // Keep the fixed-length leg chain reachable once the foot is approaching plant.
 if(stride>.01){const hip=L[leadSide+'Hip'].parent.position.clone().applyQuaternion(u.pelvis.quaternion).add(u.pelvis.position),dx=hip.x-leadTarget.x,dz=hip.z-leadTarget.z,maxY=leadTarget.y+Math.sqrt(Math.max(.01,(u.legTotal-.008)**2-dx*dx-dz*dz)),reachBlend=smooth(S.stride0-.035,S.strike-.02);u.pelvis.position.y=lerp(u.pelvis.position.y,Math.min(u.pelvis.position.y,maxY),reachBlend)}
 const leadKneeBias=name==='Auden'?lerp(.018,-.035,plant):name==='Jason'?lerp(.155,.115,sm(clamp((t-S.stride0)/Math.max(.08,S.strike-S.stride0),0,1))):(-.10+.11*plant);
 const leadFootYaw=mirror*k1([[0,0],[S.strike,name==='Jason'?-.030:-.09],[1,name==='Jason'?.018:.05],[1.42,name==='Jason'?.045:.13]]);
 const leadHeel=k1([[0,0],[S.liftPeak,name==='Jason'?.035:.18],[S.strike,.02],[1,0],[1.42,-.03]]);
 plantFoot(r,leadSide,leadTarget,leadFootYaw,leadHeel,leadKneeBias,true);
 plantFoot(r,driveSide,driveTarget,mirror*k1([[0,0],[S.strike,.04],[1,.15],[1.42,.58]]),k1([[0,0],[S.strike,.04],[1,.17],[1.42,.64]]),.12+.20*stride,true);
 // PASS 5: scapulae and receiving-hand side are authored BEFORE arm IK. This fixes the
 // old ordering bug where a solved arm was moved afterward by its clavicle.
 const cocking=pulse(S.break0+.02,S.cock,S.mer+.02,1.12),protract=smooth(S.mer-.03,1.07)*(1-.42*finish),gloveReachPhase=smooth(S.break0,S.strike-.055)*(1-smooth(S.strike+.015,.95)),gloveFirm=smooth(S.strike-.035,.99);
 const throwClav=L[throwSide+'Shoulder'].parent,gloveClav=L[gloveSide+'Shoulder'].parent;
 // Scapular retraction loads the throwing shoulder; after MER it protracts and
 // carries the arm through release. The receiving-hand side reaches first, then tucks
 // toward the ribcage to give the torso a real front-side block.
 throwClav.position.x=throwSg*(u.shoulderHalf||h*.115)*.96+throwSg*h*(.024*cocking-.012*finish+.012*hipFire);
 throwClav.position.y=u.torsoLen*.80+h*(.022*cocking+.006*protract-.008*finish);
 throwClav.position.z=h*(-.052*cocking+.072*protract);
 gloveClav.position.x=gloveSg*(u.shoulderHalf||h*.115)*.96+gloveSg*h*(.016*gloveReachPhase-.014*gloveFirm);
 gloveClav.position.y=u.torsoLen*.80+h*(.010*gloveReachPhase-.012*gloveFirm);
 gloveClav.position.z=h*(.058*gloveReachPhase-.058*gloveFirm);
 // PASS 6–7: a full arm circle with an elbow-led acceleration and distinct slot.
 const throwKeys=(name==='Coel'||name==='Josef')?
  [[0,.024,.182,.090],[S.break0,.040,.176,.070],[S.armDown,.112,.122,-.055],[S.cock,.145,.274,-.075],[S.mer,.290,.300,.020],[1,.038,S.releaseY+.020,S.releaseZ],[1.12,-S.finishCross,.165,.285],[1.30,-S.finishCross*1.06,.105,.150],[1.42,-S.finishCross*.82,.105,.105]]:
  [[0,.024,name==='Auden'?.228:name==='Jarvis'?.185:name==='Jason'?.148:.168,.110],[S.break0,.050,.170,.030],[S.armDown,S.armOut,S.armDownY,-S.armBack],[S.cock,S.armOut*.98,S.cockY,-S.cockBack],[S.mer,S.armOut*(name==='Najee'?1.72:1.35),S.cockY+.018,.008],[1,.038,S.releaseY+.020,S.releaseZ],[1.12,-S.finishCross,.160,S.releaseZ*.70],[1.30,-S.finishCross*1.08,.095,.155],[1.42,-S.finishCross*.82,.095,.105]];
 const gloveKeys=[[0,.024,name==='Auden'?.228:name==='Jarvis'?.185:name==='Jason'?.148:name==='Najee'?.168:.182,.112],[S.break0,.065,.170,.155],[S.strike-.08,.125,.205,S.gloveReach],[S.strike,.115,.198,S.gloveReach*1.02],[.91,.082,.176,.225],[.97,.052,.145,.125],[1,.034,.132,.080],[1.18,.026,.118,.055],[1.42,.025,.116,.048]];
 let throwTarget=kv(throwKeys,throwSg,true),gloveTarget=kv(gloveKeys,gloveSg,false);
 const extraSlot=delivery==='submarine'?.66:delivery==='sidearm'?.24:0,slot=((S.armSlot??.050)+extraSlot)*smooth(S.break0+.08,1.0);
 throwTarget.y-=h*slot*.30;throwTarget.x+=throwSg*h*slot*.13;
 // Move the hand upward as part of the authored trajectory, before the late IK
 // guard. This gives cocking -> acceleration one continuous climb rather than a
 // last-frame correction at release.
 if(delivery==='overhand'){
  const authoredClimb=smooth(S.cock-.10,.965)*(1-smooth(1.055,1.18)),climbAmt=({Auden:.058,Jarvis:.044,Jason:.050,Najee:.048,Coel:.044,Josef:.044}[name]||.045);
  throwTarget.y+=h*climbAmt*authoredClimb;throwTarget.x-=throwSg*h*climbAmt*.08*authoredClimb;
 }
 // Standard deliveries now finish over the shoulder/head line instead of
 // arriving from a low sideways reach. Jarvis deliberately stays lower/looser.
 const overTopLift=delivery==='overhand'?({Auden:.188,Jason:.170,Coel:.148,Josef:.148,Jarvis:.120,Najee:.158}[name]||.120):delivery==='sidearm'?.020:0;
 const releaseWindow=smooth(S.cock-.085,.985)*(1-smooth(1.055,1.20));
 throwTarget.y+=h*overTopLift*releaseWindow;throwTarget.x-=throwSg*h*overTopLift*.16*releaseWindow;
 function pitchArm(side,target,isThrower){
  const upper=L[side+'Shoulder'],elbow=L[side+'Elbow'],origin=upper.parent.position,sg=side==='L'?1:-1;
  const dir=target.clone().sub(origin),raw=dir.length(),maxReach=u.upperArm+u.foreArm-.018,minReach=Math.abs(u.upperArm-u.foreArm)+.08;
  if(raw>maxReach)target=origin.clone().add(dir.multiplyScalar(maxReach/raw));else if(raw<minReach&&raw>.0001)target=origin.clone().add(dir.multiplyScalar(minReach/raw));
  if(isThrower){
   // Authored elbow plane + true two-bone solve. The elbow trajectory controls
   // bend direction, while IK still reaches the authored throwing-hand target
   // with fixed arm lengths. This removes the old wrist/elbow mismatch and
   // prevents the bend plane from flipping during acceleration.
   const elbowKeys=[[0,.105,-.055,.055],[S.break0,.125,-.065,.025],[S.armDown,.160,name==='Jarvis'?-.045:-.085,-.055],[S.cock,.185,name==='Jarvis'?.035:.005,-.020],[S.mer,.190,name==='Jarvis'?.065:.040,.060],[1,name==='Jarvis'?.065:.105,name==='Jarvis'?-.055:-.020,name==='Jarvis'?.225:.220],[1.12,-.025,-.105,.180],[1.30,-.070,-.120,.110],[1.42,-.080,-.115,.075]];
   const authored=kv(elbowKeys,sg,false),axisToHand=target.clone().sub(origin).normalize();
   let pole=authored.clone().addScaledVector(axisToHand,-authored.dot(axisToHand));
   if(pole.lengthSq()<.002)pole.set(sg,.35,.55);if(pole.x*sg<0)pole.multiplyScalar(-1);pole.normalize();
   // From cocking through release, Jarvis's throwing hand must visibly climb
   // above the elbow rather than lingering underneath it.
   if(name==='Jarvis'&&delivery==='overhand'){
    const climb=smooth(S.armDown,S.cock),releaseGate=smooth(S.cock-.03,.99)*(1-smooth(1.06,1.18));
    target.y+=h*(.032*climb+.020*releaseGate);
    // Keep a real ~90–120 degree cocked elbow before rapidly extending into
    // release. Previously the target sat at maximum reach too early, making
    // Jarvis's whole arm look like a rigid straight lever.
    if(t>=S.armDown&&t<1){const to=target.clone().sub(origin),current=to.length(),wanted=h*k1([[S.armDown,.185],[S.cock,.205],[S.mer,.223],[.965,.246],[1,(u.upperArm+u.foreArm-.020)/h]]);if(current>.0001)target=origin.clone().add(to.multiplyScalar(Math.min(current,wanted)/current));}
   }
   solveTwoBone(upper,elbow,origin,target,u.upperArm,u.foreArm,pole,true);
   // Late-arm guard for every overhand pitcher: once the arm reaches cocking,
   // the throwing hand must climb above the elbow and stay there through release.
   // This is enforced against the rendered world-space joints, not just target math.
   if(delivery==='overhand'){
    const climbStart=lerp(S.armDown,S.cock,.26),late=t>=climbStart&&t<=1.070;
    if(late){const q=smooth(climbStart,S.cock),fullGap=name==='Auden'?.066:name==='Jarvis'?.054:name==='Jason'?.048:name==='Najee'?.050:.046,required=h*lerp(-.010,fullGap,q);
     for(let pass=0;pass<4;pass++){r.updateMatrixWorld(true);const ew=new THREE.Vector3(),ww=new THREE.Vector3();elbow.getWorldPosition(ew);L[side+'Wrist'].getWorldPosition(ww);const miss=ew.y+required-ww.y;if(miss<=.0010)break;target.y+=miss*.84;pole.y-=.035;pole.normalize();solveTwoBone(upper,elbow,origin,target,u.upperArm,u.foreArm,pole,true);}
    }
   }
  }else{
   const cock=smooth(S.armDown,S.mer),acc=smooth(S.mer,1.0),post=smooth(1.0,1.20),armDir=target.clone().sub(origin).normalize();
   let pole=new THREE.Vector3(sg*.98,-.34+.52*smooth(S.break0,S.strike),.76-.48*gloveFirm);pole.addScaledVector(armDir,-pole.dot(armDir));if(pole.lengthSq()<.002)pole.set(sg,.35,.45);if(pole.x*sg<0)pole.multiplyScalar(-1);pole.normalize();solveTwoBone(upper,elbow,origin,target,u.upperArm,u.foreArm,pole,true)
  }
 }
 pitchArm(throwSide,throwTarget,true);pitchArm(gloveSide,gloveTarget,false);
 // Wrist external rotation peaks after foot strike but before release; pronation
 // is delayed until the ball has left the fingertips.
 const layback=pulse(S.strike-.08,S.mer,.998,1.08),pronate=smooth(1.0,1.17),tw=L[throwSide+'Wrist'],gw=L[gloveSide+'Wrist'];
 tw.rotation.set(-.06+.54*layback-.62*pronate,mirror*(.024+.38*layback+.18*pronate),mirror*(.014+.10*layback-.16*pronate));
 gw.rotation.set(-.05+.13*smooth(S.break0,S.strike)-.30*gloveFirm,mirror*(.02+.07*smooth(S.break0,S.strike)-.10*gloveFirm),mirror*.02*(1-gloveFirm));
 // PASS 8: release grip, front-side block, then drive-leg recovery.  The lead
 // leg is already planted; raising the pelvis after strike visibly firms it.
 const releaseOpen=smooth(.975,1.025),throwHand=u.hands?.[throwSide],gloveHand=u.hands?.[gloveSide];
 if(throwHand){throwHand.fingers.forEach((chain,i)=>chain.forEach((j,k)=>{j.rotation.x=-lerp([.60,1.08,.92][k],[.08,.14,.11][k],releaseOpen);if(k===0)j.rotation.z=(i-1.5)*.020;}));throwHand.thumb.rotation.x=lerp(-.60,-.07,releaseOpen)}
 if(gloveHand){gloveHand.fingers.forEach(chain=>chain.forEach((j,k)=>j.rotation.x=-[.46,.84,.74][k]));gloveHand.thumb.rotation.x=-.50}
 if(u.necklace){u.necklace.rotation.z=mirror*.050*Math.sin(t*Math.PI*1.35);u.necklace.rotation.x=.016*Math.sin(t*Math.PI*1.8);u.necklace.position.z=h*.007*Math.sin(t*Math.PI)}
 // PASS 9–10: expose phase data for validation and keep full-speed continuity.
 u.pitchDebug={t,gather,rock,lift,stride,plant,hipFire,shoulderFire,finish,throwSide,gloveSide,hipWorld,shoulderWorld,appliedPelvisYaw:u.pelvis.rotation.y,appliedSpineYaw:u.spine.rotation.y,slot,leadTarget:leadTarget.clone(),driveTarget:driveTarget.clone(),throwTarget:throwTarget.clone(),gloveTarget:gloveTarget.clone()};
 setExpression(r,'focused');
}
function fieldingRig(r,flight,sec){
 if(!flight?.fielded||!Number.isFinite(flight.fieldTime)||sec<0)return;
 const u=r.userData,L=u.limbs,h=u.height,{throwSide,gloveSide}=pitchSides(u),ft=Math.max(.18,flight.fieldTime),tx=Number.isFinite(flight.fieldX)?flight.fieldX:0,tz=Number.isFinite(flight.fieldZ)?flight.fieldZ:48,dist=Math.hypot(tx,tz-48),visualSpeed=clamp(flight.fielderSpeed||11.5,9.5,14.0),travel=Math.max(.22,dist/Math.max(1,visualSpeed)),start=Math.max(.04,ft-travel),elapsed=Math.max(0,sec-start),recover=sm(clamp(elapsed/.18,0,1)),run=sm(clamp((elapsed-.08)/Math.max(.14,ft-start-.12),0,1)),catchF=sm(clamp((sec-(ft-.22))/.22,0,1)),decel=sm(clamp((sec-(ft-.34))/.28,0,1));
 if(sec<start)return;
 // Once the ball is in play, stop dragging the delivery finish around the field.
 // Reset into a compact athletic base, then animate the pursuit from that base.
 neutralRig(r,false);u.batPivot.visible=false;
 const maxRange=clamp(flight.maxFieldRange||20,12,22),rangeScale=dist>maxRange?maxRange/Math.max(dist,.001):1,targetX=tx*rangeScale,targetZ=48+(tz-48)*rangeScale;
 const moveF=sm(clamp((elapsed-.04)/Math.max(.16,ft-start-.10),0,1));
 r.position.x=lerp(0,targetX,moveF);r.position.z=lerp(48,targetZ,moveF);
 const yaw=Math.atan2(tx-r.position.x,tz-r.position.z),delta=Math.atan2(Math.sin(yaw-Math.PI),Math.cos(yaw-Math.PI));r.rotation.y=Math.PI+delta*sm(clamp(elapsed/.24,0,1));
 // Athletic posture and real pursuit gait. The stride shortens as the catch approaches.
 const cadence=clamp(10.5+visualSpeed*.55,14,18),phase=elapsed*cadence,stepAmp=.34*run*(1-catchF)*(1-.42*decel),step=Math.sin(phase)*stepAmp,opp=Math.sin(phase+Math.PI)*stepAmp;
 u.pelvis.position.y-=h*(.018+.016*run+.012*decel);u.spine.rotation.x=.10*run+.075*decel;u.spine.rotation.y+=Math.sin(phase*.5)*.018*run*(1-catchF);
 L.LHip.rotation.x+=step;L.RHip.rotation.x+=opp;
 L.LKnee.rotation.x+=.12*run+Math.max(0,-step)*.72;L.RKnee.rotation.x+=.12*run+Math.max(0,-opp)*.72;
 L.LAnkle.rotation.x-=Math.max(0,step)*.15;L.RAnkle.rotation.x-=Math.max(0,opp)*.15;
 // Arms counter-swing like a runner, then both quiet down into the catch.
 const armSwing=.25*run*(1-catchF)*(1-.45*decel);L.LShoulder.rotation.x+=-step/Math.max(.01,stepAmp||1)*armSwing;L.RShoulder.rotation.x+=-opp/Math.max(.01,stepAmp||1)*armSwing;
 L.LElbow.rotation.x+=.42*run*(1-catchF);L.RElbow.rotation.x+=.42*run*(1-catchF);
 u.motion.position.y=Math.abs(Math.sin(phase))*h*.0065*run*(1-catchF);
 // Recovery beat from the delivery: one short gather before the first full stride.
 const gather=1-recover;u.spine.rotation.z+=((gloveSide==='L'?-1:1)*.055)*gather;u.neck.rotation.y+=(gloveSide==='L'?-1:1)*.035*gather;
 if(catchF>.001){
  const ground=flight.fieldType==='ground',gSg=gloveSide==='L'?1:-1,tSg=-gSg,gloveTarget=new THREE.Vector3(gSg*h*(ground?.040:.060),ground?h*.050:h*.285,h*(ground?.235:.220)),throwTarget=new THREE.Vector3(tSg*h*.045,ground?h*.125:h*.215,h*(ground?.165:.145));
  u.spine.rotation.x=lerp(u.spine.rotation.x,ground?.50:.18,catchF);u.pelvis.position.y-=h*(ground?.060:.020)*catchF;
  // Widen the base into the catch instead of leaving the pitcher in a stride pose.
  L.LHip.rotation.z+=(gloveSide==='L'?-.035:.035)*catchF;L.RHip.rotation.z+=(gloveSide==='L'?.035:-.035)*catchF;L.LKnee.rotation.x+=.16*catchF;L.RKnee.rotation.x+=.16*catchF;
  const gPole=new THREE.Vector3(gSg,-.24,.82).normalize(),tPole=new THREE.Vector3(tSg,-.42,.58).normalize();solveTwoBone(L[gloveSide+'Shoulder'],L[gloveSide+'Elbow'],L[gloveSide+'Shoulder'].parent.position,gloveTarget,u.upperArm,u.foreArm,gPole,true);solveTwoBone(L[throwSide+'Shoulder'],L[throwSide+'Elbow'],L[throwSide+'Shoulder'].parent.position,throwTarget,u.upperArm,u.foreArm,tPole,true);
  L[gloveSide+'Wrist'].rotation.set(ground?-.32:-.04,0,gSg*(ground?.10:-.08));L[throwSide+'Wrist'].rotation.set(-.12,0,0);
  if(u.hands?.[gloveSide])u.hands[gloveSide].fingers.forEach(chain=>chain.forEach((j,k)=>j.rotation.x=-[.36,.70,.60][k]));
 }
}
function batterHbpReactionRig(r,reactionT=0,now=performance.now()){
 stanceRig(r,now);const u=r.userData,L=u.limbs,h=u.height,t=clamp(reactionT||0,0,1),side=D.players[u.name]._meta.bats==='L'?-1:1;
 // HBP reaction is a continuous authored sequence: impact recoil -> step away /
 // protect the hit area -> angry look back toward the pitcher -> recover.  The
 // old implementation accidentally passed a scalar reaction weight as the IK
 // elbow-pole vector, causing the renderer to fall back to a frozen pose.
 const impact=sm(clamp(t/.105,0,1))*(1-sm(clamp((t-.24)/.14,0,1)));
 const protect=sm(clamp((t-.10)/.16,0,1))*(1-sm(clamp((t-.58)/.20,0,1)));
 const step=sm(clamp((t-.04)/.28,0,1));
 const glare=sm(clamp((t-.40)/.18,0,1))*(1-sm(clamp((t-.90)/.10,0,1)));
 const recover=sm(clamp((t-.72)/.25,0,1));
 setExpression(r,t<.46?'pain':'angry',now);
 // Move away from the plate instead of locking both feet to the original stance.
 r.position.x+=side*h*(.075*step-.010*recover);r.position.z-=h*.018*step;
 u.pelvis.position.y-=h*(.020*impact+.010*protect);u.pelvis.rotation.y+=side*(.055*impact-.035*glare);
 u.spine.rotation.z+=-side*(.22*impact+.08*protect);u.spine.rotation.x+=.13*impact+.045*protect-.030*glare;
 u.neck.rotation.x+=.24*impact-.055*glare;u.neck.rotation.y+=side*(.12*impact-.24*glare+Math.sin(t*Math.PI*7)*.025*glare);
 L.LKnee.rotation.x+=.19*impact+.05*step;L.RKnee.rotation.x+=.16*impact+.035*step;
 const hitHand=side===1?'L':'R',freeHand=hitHand==='L'?'R':'L',hitSg=hitHand==='L'?-1:1,freeSg=freeHand==='L'?-1:1;
 const poseArm=(arm,target,amount,pole)=>{if(amount<=.001)return;r.updateMatrixWorld(true);const node=L[arm+'Wrist'],wp=node.getWorldPosition(new THREE.Vector3()),cur=u.spine.worldToLocal(wp.clone());celebrationArm(u,arm,cur.lerp(target,clamp(amount,0,1)),pole)};
 // First hand protects the struck ribs/hip. The other reflexively comes away
 // from the bat, then opens toward the pitcher in an irritated "come on" beat.
 poseArm(hitHand,new THREE.Vector3(hitSg*h*.030,u.torsoLen*.42,h*.125),protect,new THREE.Vector3(-hitSg,-.48,.74).normalize());
 const flinch=impact*(1-.35*protect);
 poseArm(freeHand,new THREE.Vector3(freeSg*h*.185,u.torsoLen*.58,h*.17),flinch,new THREE.Vector3(-freeSg,-.45,.72).normalize());
 poseArm(freeHand,new THREE.Vector3(freeSg*h*.115,u.torsoLen*.62,h*.29),glare,new THREE.Vector3(-freeSg,-.30,.82).normalize());
 L[freeHand+'Wrist'].rotation.z+=freeSg*.28*glare;L[freeHand+'Wrist'].rotation.x-=.10*glare;
 // Hide the bat only during the post-impact reaction; the previous crash happened
 // before this line, which is why screenshots showed a frozen bat through the head.
 u.batPivot.visible=false;
}
function pitcherHbpAftermathRig(r,state,reactionT=0,now=performance.now()){
 const t=clamp(reactionT||0,0,1),finishT=lerp(1.02,1.42,sm(clamp(t/.34,0,1)));
 pitchRig(r,{...(state||{}),kind:'pitch',t:finishT});const u=r.userData,L=u.limbs,h=u.height,{throwSide,gloveSide}=pitchSides(u),mirror=D.players[u.name]._meta.throws==='L'?-1:1;
 const notice=sm(clamp((t-.22)/.20,0,1)),settle=sm(clamp((t-.45)/.42,0,1));
 setExpression(r,t<.42?'focused':'annoyed',now);
 // Keep the pitcher alive after the ball hits the batter: finish the delivery,
 // glance toward the plate, then settle weight instead of holding a mannequin pose.
 u.neck.rotation.y+=mirror*.13*notice;u.neck.rotation.x-=.035*notice;
 u.spine.rotation.y+=mirror*.045*notice*(1-.45*settle);u.spine.rotation.x-=.035*settle;
 u.pelvis.position.y+=h*.007*Math.sin(t*Math.PI*3)*settle;
 const sway=Math.sin((t-.40)*Math.PI*4)*.035*settle;L[throwSide+'Shoulder'].rotation.z+=mirror*sway;L[gloveSide+'Shoulder'].rotation.z-=mirror*sway*.55;
}
function reactionRig(r,kind,now,reactionT=0){
 pitchSetRig(r,now);const u=r.userData,L=u.limbs,h=u.height,{throwSide,gloveSide}=pitchSides(u),name=u.name,t=clamp(reactionT||0,0,1);
 // Targets below are authored in SPINE LOCAL coordinates. Previous builds mixed
 // root-local and spine-local arm targets, which could cause extreme solves.
 const poseArm=(side,target,amount,pole)=>{r.updateMatrixWorld(true);const node=u.limbs[side+'Hand']||u.limbs[side+'Wrist'],wp=node.getWorldPosition(new THREE.Vector3()),cur=u.spine.worldToLocal(wp.clone()),safe=target.clone();
  // Disgust gestures should stay visibly in front of the torso/head instead of
  // clipping through the body. Jarvis's forehead target is intentionally high
  // enough to bypass this torso-only clearance clamp.
  if(safe.y<u.torsoLen*.82)safe.z=Math.max(safe.z,h*.145);
  const sideSign=side==='L'?-1:1;if(safe.y<u.torsoLen*.78&&Math.abs(safe.x)<h*.095)safe.x=sideSign*h*.095;
  celebrationArm(u,side,cur.lerp(safe,clamp(amount,0,1)),pole)};
 if(kind==='hrDisgust'){
  // Alpha 91: all pitchers use Coel's disgust reaction. Both arms drop on
  // their own sides while the head shakes; handedness only sets the first glance.
  setExpression(r,t<.46?'wtf':'angry',now);
  const glance=sm(clamp(t/.10,0,1))*(1-sm(clamp((t-.18)/.08,0,1))),drop=sm(clamp((t-.10)/.16,0,1)),shake=sm(clamp((t-.24)/.10,0,1))*(1-sm(clamp((t-.90)/.08,0,1))),settle=sm(clamp((t-.42)/.18,0,1)),sg=throwSide==='L'?1:-1;
  u.spine.rotation.x=.035*drop+.018*settle;u.spine.rotation.z=.020*Math.sin(t*Math.PI*3.2)*shake;
  u.neck.rotation.x=.10*drop+.04*settle;u.neck.rotation.y=sg*.10*glance+Math.sin(t*Math.PI*8.0)*.22*shake;u.neck.rotation.z=Math.sin(t*Math.PI*8.0+Math.PI*.5)*.055*shake;
  const leftDrop=new THREE.Vector3(h*.205,u.torsoLen*.14,h*.155),rightDrop=new THREE.Vector3(-h*.205,u.torsoLen*.14,h*.155);
  poseArm('L',leftDrop,drop,new THREE.Vector3(.98,-.26,.24).normalize());poseArm('R',rightDrop,drop,new THREE.Vector3(-.98,-.26,.24).normalize());
  L.LWrist.rotation.z=-.10*drop;L.RWrist.rotation.z=.10*drop;L.LWrist.rotation.x=.08*drop;L.RWrist.rotation.x=.08*drop;
  L.LShoulder.parent.position.y-=h*.012*drop;L.RShoulder.parent.position.y-=h*.012*drop;return;
 }
 if(!String(kind||'').startsWith('angry'))return;setExpression(r,'angry',now);const e=Math.sin((now%900)/900*Math.PI);if(kind==='angry1'){u.spine.rotation.z=.12*e;L[throwSide+'Shoulder'].rotation.x=-1.5*e}else if(kind==='angry2'){u.spine.rotation.y=.32*e;L[gloveSide+'Shoulder'].rotation.x=-1.45*e;L[throwSide+'Shoulder'].rotation.x=-1.2*e}else{u.spine.rotation.z=-.10*e;L[throwSide+'Shoulder'].rotation.x=-1.25*e}
}

function secondaryMotion(r,now,kind='idle',phase=0){
 const u=r.userData;if(!u)return;const h=u.height,f=u.face,action=kind==='swing'?sm(clamp((phase-.28)/.22,0,1))*(1-sm(clamp((phase-.94)/.10,0,1))):kind==='pitch'?pcurve([0,.05,.18,.35,.58,.82,1,.88,.46,.16],clamp(phase,0,1.42)):kind==='reaction'?.20:.08;
 const sway=Math.sin(now*.0085+u.name.length)*action,bob=Math.sin(now*.012+u.name.length*.7)*action,follow=Math.sin(now*.0062+u.name.length*.31)*action;
 if(u.hem){u.hem.rotation.z=-u.spine.rotation.y*.038+sway*.018;u.hem.rotation.x=-u.spine.rotation.x*.046+bob*.010;u.hem.rotation.y=follow*.008;u.hem.position.z=h*(.0018+.0036*action);u.hem.scale.z=1+.016*action;}
 if(f?.hairRoot){const long=kind==='reaction'?0:(u.name==='Auden'?.78:u.name==='Jarvis'?.010:u.name==='Jason'?.18:u.name==='Najee'?.025:.010);f.hairRoot.rotation.x=-u.spine.rotation.x*.065*long+bob*.036*long;f.hairRoot.rotation.y=-u.spine.rotation.y*.044*long+sway*.028*long;f.hairRoot.rotation.z=-u.spine.rotation.z*.094*long+sway*.025*long;f.hairRoot.position.z=-h*.0030*action*long;}
 if(f?.capRoot){f.capRoot.rotation.x=bob*.010;f.capRoot.rotation.z=sway*.006;f.capRoot.position.y=Math.abs(bob)*h*.0009;}
 if(f?.glassesRoot){f.glassesRoot.rotation.x=bob*.005;f.glassesRoot.rotation.z=sway*.0035;f.glassesRoot.position.y=-Math.abs(bob)*h*.00042;}
 if(u.necklace){const whip=(kind==='swing'?Math.sin(clamp(phase,0,1)*Math.PI*1.92):kind==='pitch'?Math.sin(clamp(phase,0,1.42)*Math.PI*1.62):Math.sin(now*.0026));u.necklace.rotation.z=-u.spine.rotation.y*.054+whip*.048*action;u.necklace.rotation.x=u.spine.rotation.x*.026+Math.abs(whip)*.017*action;u.necklace.rotation.y=follow*.016;u.necklace.position.z=h*(.0016+.0065*action*Math.max(0,whip));}
 if(u.hood){u.hood.rotation.x=-u.spine.rotation.x*.032+bob*.015;u.hood.rotation.z=-u.spine.rotation.z*.048+sway*.013;u.hood.position.z=-u.headR*.12-h*.0025*action;}
 for(const side of ['L','R']){const foot=u.limbs[side+'Foot'];if(!foot?.userData)continue;const toe=Math.max(0,-u.limbs[side+'Ankle'].rotation.x),kick=Math.min(1,toe/.65)+action*.18;if(foot.userData.tongue)foot.userData.tongue.rotation.x=-.13-.095*kick;if(foot.userData.laces){foot.userData.laces.rotation.z=sway*.012*kick;foot.userData.laces.position.y=Math.abs(bob)*.0048*kick;}}
}
function clothSecondary(r,now,intensity=0,phaseValue=0){secondaryMotion(r,now,intensity>0?'swing':'idle',phaseValue)}
function smoothPose(r,fn,now=performance.now()){const u=r.userData;fn();r.updateMatrixWorld(true);u.lastPoseTime=now}


// ---------------------------------------------------------------------------
// BATTED-BALL RESULT ZONES — field-painted guidance that appears after contact.
// These boundaries mirror game.js scoring rules so the player can see why a
// landing spot was ruled OUT / 1B / 2B / 3B.
// ---------------------------------------------------------------------------
const RESULT_ZONE_RULES={
 'PCBL MAIN FIELD':{outEnd:50.5,doubleStart:58,tripleRFMinX:-40,tripleRFMaxX:-23,tripleRFMinZ:72.5},
 'MURPHY PARK':{outEnd:50.5,doubleStart:76,tripleStart:114,tripleMinAngle:-.32,tripleMaxAngle:-.16,rcfWallStart:120,rcfWallMin:-.30,rcfWallMax:-.16},
 'POLO RINK':{outEnd:50.5,doubleStart:70,deepTripleStart:170,deepCFAngle:.24,tripleRFStart:165,tripleRFMinAngle:-.30,tripleRFMaxAngle:-.18}
};
function resultWallDistance(park,angle){
 const a=Math.abs(angle);if(a>Math.PI/4+.015)return 0;
 if(park==='POLO RINK'){const half=62/Math.SQRT2,dx=Math.abs(Math.sin(angle)),dz=Math.max(.001,Math.cos(angle));return Math.min(dx>.001?half/dx:Infinity,209/dz)}
 if(park==='MURPHY PARK'){const u=clamp(a/(Math.PI/4),0,1);return 130-30*Math.pow(u,1.22)}
 const pts=[{x:-51,z:51},{x:-36,z:81},{x:37,z:81},{x:51,z:51}];let best=Infinity;for(let i=0;i<pts.length-1;i++){const A=pts[i],B=pts[i+1],dx=Math.sin(angle),dz=Math.cos(angle),sx=B.x-A.x,sz=B.z-A.z,den=dx*sz-dz*sx;if(Math.abs(den)<1e-7)continue;const t=(A.x*sz-A.z*sx)/den,u=(A.x*dz-A.z*dx)/den;if(t>0&&u>=0&&u<=1)best=Math.min(best,t)}return Number.isFinite(best)?best:81
}
function disposeGroupChildren(g){while(g.children.length){const o=g.children.pop();o.traverse?.(c=>{c.geometry?.dispose?.();if(c.material){for(const m of (Array.isArray(c.material)?c.material:[c.material])){if(m.map?.isCanvasTexture)m.map.dispose();m.dispose?.()}}})}}
function zoneStripe(group,a,b,seed,color=0xcbff87){
 const dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz);if(len<.05)return;
 const m=new THREE.MeshBasicMaterial({color,transparent:true,opacity:0,depthWrite:false,depthTest:false});
 const q=new THREE.Mesh(new THREE.BoxGeometry(len,.028,.13),m);q.position.set((a.x+b.x)/2,.072,(a.z+b.z)/2);q.quaternion.setFromUnitVectors(new THREE.Vector3(1,0,0),new THREE.Vector3(dx,0,dz).normalize());q.renderOrder=45;q.userData.zoneLine=true;q.userData.seed=seed;group.add(q)
}
function segmentedZoneLine(group,points,color=0xcbff87,seedBase=.1){
 let n=0;for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1],d=Math.hypot(b.x-a.x,b.z-a.z),pieces=Math.max(1,Math.ceil(d/3.25));for(let j=0;j<pieces;j++){const f0=j/pieces,f1=Math.min(1,(j+.72)/pieces),p0={x:lerp(a.x,b.x,f0),z:lerp(a.z,b.z,f0)},p1={x:lerp(a.x,b.x,f1),z:lerp(a.z,b.z,f1)},seed=(Math.sin((n+1)*91.73+seedBase*83.1)*43758.5453)%1;zoneStripe(group,p0,p1,Math.abs(seed),color);n++}}
}
function zoneArc(group,park,r,a0,a1,color=0xcbff87,seed=.3){
 const pts=[];for(let i=0;i<=40;i++){const a=lerp(a0,a1,i/40),wall=resultWallDistance(park,a);if(r<=wall-.45)pts.push({x:Math.sin(a)*r,z:Math.cos(a)*r});else if(pts.length>1){segmentedZoneLine(group,pts,color,seed+i*.01);pts.length=0}}if(pts.length>1)segmentedZoneLine(group,pts,color,seed+.77)
}
function zoneRadial(group,park,a,r0,r1,color=0xcbff87,seed=.5){const end=Math.min(r1,resultWallDistance(park,a)-.5);if(end<=r0)return;segmentedZoneLine(group,[{x:Math.sin(a)*r0,z:Math.cos(a)*r0},{x:Math.sin(a)*end,z:Math.cos(a)*end}],color,seed)}
function zoneLabel(group,text,x,z,w=5){const q=makeTextPlane(text,'#cbff87','rgba(4,8,10,.78)',w,1.12,62);q.rotation.set(-Math.PI/2,0,Math.PI);q.position.set(x,.105,z);q.material.depthTest=false;q.material.opacity=0;q.renderOrder=47;q.userData.zoneLabel=true;group.add(q);return q}
function buildResultZoneOverlay(group,park){
 disposeGroupChildren(group);group.userData.park=park;const r=RESULT_ZONE_RULES[park]||RESULT_ZONE_RULES['PCBL MAIN FIELD'],lime=0xcbff87,white=0xf4f7f0,gold=0xffd95a;
 const z=r.outEnd,x=Math.min(z,resultWallDistance(park,Math.PI/4)*Math.SQRT1_2-.4);segmentedZoneLine(group,[{x:-x,z},{x:x,z}],white,.05);
 zoneLabel(group,'OUT',0,29,4.2);zoneLabel(group,'1B',0,(r.outEnd+r.doubleStart)*.5,4.0);zoneArc(group,park,r.doubleStart,-Math.PI/4,Math.PI/4,lime,.2);
 if(park==='POLO RINK'){
  // 3B only in the back-center pocket and genuinely deep RF—not the whole right side.
  zoneArc(group,park,r.deepTripleStart,-r.deepCFAngle,r.deepCFAngle,gold,.60);
  zoneArc(group,park,r.tripleRFStart,r.tripleRFMinAngle,r.tripleRFMaxAngle,gold,.42);
  zoneRadial(group,park,r.tripleRFMinAngle,r.tripleRFStart,220,gold,.47);zoneRadial(group,park,r.tripleRFMaxAngle,r.tripleRFStart,220,gold,.49);
  zoneLabel(group,'2B · LF',24,88,5.4);zoneLabel(group,'2B · CF',0,112,5.4);zoneLabel(group,'3B · DEEP RF',-31,177,7.0);zoneLabel(group,'3B · DEEP CF',0,181,7.0);
 }else if(park==='MURPHY PARK'){
  // Narrow central RCF pocket; extreme far-right territory stays a double.
  zoneArc(group,park,r.tripleStart,r.tripleMinAngle,r.tripleMaxAngle,gold,.43);
  zoneRadial(group,park,r.tripleMinAngle,r.tripleStart,150,gold,.48);zoneRadial(group,park,r.tripleMaxAngle,r.tripleStart,150,gold,.51);
  zoneLabel(group,'2B · LF',35,94,5.4);zoneLabel(group,'2B · CF',0,106,5.4);zoneLabel(group,'3B · RCF',-22,120,5.8);zoneLabel(group,'3B · RCF WALL',-21,124,7.2);
 }else{
  // Main Field RF triple pocket is a shallow-depth horizontal band tucked into
  // the back-right corner, not a long wedge running vertically toward home.
  const z0=r.tripleRFMinZ,x0=r.tripleRFMinX,x1=r.tripleRFMaxX;
  segmentedZoneLine(group,[{x:x0,z:z0},{x:x1,z:z0}],gold,.43);
  const wallZ=x=>x<=-36?51+2*(x+51):81;
  const wz0=Math.max(z0,wallZ(x0)-.5),wz1=Math.max(z0,wallZ(x1)-.5);
  if(wz0>z0+.2)segmentedZoneLine(group,[{x:x0,z:z0},{x:x0,z:wz0}],gold,.48);
  if(wz1>z0+.2)segmentedZoneLine(group,[{x:x1,z:z0},{x:x1,z:wz1}],gold,.50);
  zoneLabel(group,'2B · LF',24,70,5.4);zoneLabel(group,'2B · CF',0,74,5.4);zoneLabel(group,'3B · RF CORNER',-31.5,76.3,6.8);
 }
 const ring=new THREE.Mesh(new THREE.RingGeometry(1.2,1.55,32),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false,depthTest:false}));ring.rotation.x=-Math.PI/2;ring.position.y=.13;ring.renderOrder=49;ring.userData.landingMarker=true;group.add(ring);
 const tag=zoneLabel(group,'LANDING',0,0,5.2);tag.position.y=.18;tag.userData.zoneLabel=false;tag.userData.landingTag=true;group.visible=false
}
function updateResultZoneOverlay(group,park,flight,sec){
 if(!flight?.path?.length){group.visible=false;return}
 if(group.userData.park!==park)buildResultZoneOverlay(group,park);group.visible=true;
 const fadeIn=sm(clamp((sec-.06)/.48,0,1)),fadeOut=1-sm(clamp((sec-(flight.duration+.06))/.40,0,1)),fade=fadeIn*fadeOut;
 group.traverse(o=>{if(o.userData?.zoneLine){const threshold=o.userData.seed*.52,reveal=clamp((fade-threshold)/(1-threshold+.001),0,1);o.material.opacity=.82*sm(reveal)}else if(o.userData?.zoneLabel){o.material.opacity=.92*sm(clamp((fade-.20)/.80,0,1))}});
 const marker=group.children.find(o=>o.userData?.landingMarker),tag=group.children.find(o=>o.userData?.landingTag);if(!marker||!tag)return;
 let eventTime=null,mx=null,mz=null,code=flight.result||'';
 if(flight.fielded&&flight.fieldType==='air'&&Number.isFinite(flight.fieldTime)){eventTime=flight.fieldTime;mx=flight.fieldX;mz=flight.fieldZ;code='FO'}
 else if(Number.isFinite(flight.wallTime)&&flight.zone==='RCF WALL TRIPLE ZONE'){eventTime=flight.wallTime;mx=flight.wallX;mz=flight.wallZ;code='3B'}
 else if(Number.isFinite(flight.groundTime)){eventTime=flight.groundTime;mx=flight.landingX;mz=flight.landingZ}
 const shown=eventTime!==null&&sec>=eventTime;if(shown&&Number.isFinite(mx)&&Number.isFinite(mz)){const pop=sm(clamp((sec-eventTime)/.18,0,1))*fade;marker.position.x=mx;marker.position.z=mz;marker.material.opacity=.95*pop;marker.scale.setScalar(.75+.25*pop);tag.position.x=mx;tag.position.z=mz+2.3;tag.material.opacity=.95*pop;if(tag.userData.lastText!==code){group.remove(tag);tag.geometry.dispose();tag.material.map?.dispose();tag.material.dispose();const nt=zoneLabel(group,code||'LANDING',mx,mz+2.3,4.0);nt.position.y=.18;nt.userData.zoneLabel=false;nt.userData.landingTag=true;nt.userData.lastText=code}}
 else{marker.material.opacity=0;tag.material.opacity=0}
}

function disposePlayer(root){
 const shared=new Set(MATERIALS.values()),geometries=new Set(),materials=new Set();
 root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)for(const m of (Array.isArray(o.material)?o.material:[o.material]))if(!shared.has(m))materials.add(m);if(o.isSkinnedMesh)o.skeleton.dispose()});
 for(const g of geometries)g.dispose();for(const m of materials)m.dispose();
}
class Engine{
 constructor(canvas,mode='game'){
  this.canvas=canvas;this.mode=mode;this.lastError=null;this.contextLost=false;this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));this.renderer.setSize(1280,720,false);this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ReinhardToneMapping;this.renderer.toneMappingExposure=1.18;this.renderer.setClearColor(0x88c9f2,1);
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x88c9f2);this.camera=new THREE.PerspectiveCamera(39,16/9,.1,700);this.world=new THREE.Group();this.scene.add(this.world);this.parkRoot=new THREE.Group();this.playerRoot=new THREE.Group();this.fxRoot=new THREE.Group();this.resultZones=new THREE.Group();this.resultZones.name='Batted-ball result zones';this.fxRoot.add(this.resultZones);this.world.add(this.parkRoot,this.playerRoot,this.fxRoot);this.addLights();this.addAtmosphere();
  this.park='';this.batter=null;this.pitcher=null;this.ball=this.makeBall();this.ballShadow=new THREE.Mesh(new THREE.CircleGeometry(.34,24),new THREE.MeshBasicMaterial({color:0x101010,transparent:true,opacity:.24,depthWrite:false}));this.ballShadow.rotation.x=-Math.PI/2;this.ballShadow.visible=false;this.fxRoot.add(this.ballShadow);this.zone=this.makeZone();this.pci=this.makePCI();this.contactFeedback=this.makeContactFeedback();this.aim=this.makeAimBall();this.aimUncertainty=this.makeRing(0xffeb32);this.aimUncertainty.material.opacity=.16;this.aimUncertainty.visible=false;this.aimTrail=new THREE.Line(new THREE.BufferGeometry(),new THREE.LineDashedMaterial({color:0xffeb32,transparent:true,opacity:.32,dashSize:.42,gapSize:.30,depthTest:false}));this.aimTrail.renderOrder=48;this.aimTrail.visible=false;this.trail=[];for(let i=0;i<5;i++){const q=new THREE.Mesh(new THREE.SphereGeometry(.09-i*.01,14,10),new THREE.MeshBasicMaterial({color:0xffeb43,transparent:true,opacity:.085*(1-i/6),depthWrite:false}));q.visible=false;this.trail.push(q);this.fxRoot.add(q)}this.fxRoot.add(this.zone,this.pci,this.contactFeedback,this.aim,this.aimUncertainty,this.aimTrail,this.ball);this.ball.visible=this.pci.visible=this.contactFeedback.visible=this.aim.visible=false;this.releaseCache=new Map();this.canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.contextLost=true},{passive:false});this.canvas.addEventListener('webglcontextrestored',()=>{this.contextLost=false;this.park=''},false)
 }
 // Modest screen-space contact occlusion, typical of raster console rendering.
 renderScene(){
  if(!this.renderer.capabilities.isWebGL2){this.renderer.render(this.scene,this.camera);return}
  if(!this.ao){
   const target=new THREE.WebGLRenderTarget(1,1,{type:THREE.HalfFloatType,depthBuffer:true,stencilBuffer:false});target.depthTexture=new THREE.DepthTexture(1,1,THREE.UnsignedIntType);target.samples=this.renderer.capabilities.isWebGL2?4:0;
   const uniforms={colorBuffer:{value:target.texture},depthBuffer:{value:target.depthTexture},resolution:{value:new THREE.Vector2()},inverseProjection:{value:new THREE.Matrix4()},radius:{value:.34}};
   const material=new THREE.ShaderMaterial({uniforms,depthTest:false,depthWrite:false,vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,fragmentShader:`
    uniform sampler2D colorBuffer;uniform sampler2D depthBuffer;uniform vec2 resolution;uniform mat4 inverseProjection;uniform float radius;varying vec2 vUv;
    vec3 viewPosition(vec2 uv){float d=texture2D(depthBuffer,uv).x;vec4 p=inverseProjection*vec4(uv*2.-1.,d*2.-1.,1.);return p.xyz/p.w;}
    void main(){
     vec4 col=texture2D(colorBuffer,vUv);float d=texture2D(depthBuffer,vUv).x;float ao=0.;
     if(d<.99999){vec3 p=viewPosition(vUv);vec3 n=normalize(cross(dFdx(p),dFdy(p)));if(n.z<0.)n=-n;float px=clamp(radius*resolution.y/max(.1,-p.z),2.,26.);
      for(int i=0;i<12;i++){float angle=float(i)*2.399963;float distance=(.30+.70*float(i+1)/12.)*px;vec2 uv=vUv+vec2(cos(angle),sin(angle))*distance/resolution;vec3 delta=viewPosition(uv)-p;float len=length(delta);float range=1.-smoothstep(radius*.25,radius*2.8,len);ao+=max(0.,dot(n,delta/max(.0001,len))-.16)*range;}
     }
     gl_FragColor=vec4(col.rgb*(1.-clamp(ao/12.*.52,0.,.20)),col.a);
     #include <tonemapping_fragment>
     #include <colorspace_fragment>
    }`});material.extensions.derivatives=true;
   const scene=new THREE.Scene();scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),material));this.ao={target,uniforms,scene,camera:new THREE.Camera()};
  }
  const ao=this.ao,size=this.renderer.getDrawingBufferSize(new THREE.Vector2());if(ao.target.width!==size.x||ao.target.height!==size.y)ao.target.setSize(size.x,size.y);ao.uniforms.resolution.value.copy(size);ao.uniforms.inverseProjection.value.copy(this.camera.projectionMatrixInverse);
  this.renderer.setRenderTarget(ao.target);this.renderer.render(this.scene,this.camera);this.renderer.setRenderTarget(null);this.renderer.render(ao.scene,ao.camera);
 }
 addAtmosphere(){
  const material=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,toneMapped:false,
   uniforms:{top:{value:new THREE.Color(0x6ea9e8)},mid:{value:new THREE.Color(0x9ed0ff)},horizon:{value:new THREE.Color(0xf7d5a7)},glow:{value:new THREE.Color(0xfff0c8)}},
   vertexShader:'varying vec3 direction;void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:'uniform vec3 top;uniform vec3 mid;uniform vec3 horizon;uniform vec3 glow;varying vec3 direction;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));vec2 u=f*f*(3.-2.*f);return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;}void main(){vec3 dir=normalize(direction);float y=clamp(dir.y*.5+.5,0.,1.);vec3 col=mix(horizon,mid,smoothstep(.02,.42,y));col=mix(col,top,smoothstep(.42,1.,y));float sun=pow(max(0.,1.-distance(dir,normalize(vec3(-0.42,0.34,-0.86)))*1.28),7.);col+=glow*sun*.55;float band=smoothstep(.18,.72,y)*(1.-smoothstep(.72,.92,y));float n=noise(dir.xz*7.5+vec2(0.,dir.y*2.5))+0.5*noise(dir.xz*13.0+19.0);float clouds=smoothstep(.68,.90,n)*band;col=mix(col,col+vec3(.19,.16,.13),clouds*.38);gl_FragColor=vec4(col,1.);}' });
  this.sky=new THREE.Mesh(new THREE.SphereGeometry(420,48,28),material);this.sky.position.y=25;this.sky.renderOrder=-100;this.scene.add(this.sky);this.defaultFog=new THREE.Fog(0xd8c9b5,145,445);this.scene.fog=this.defaultFog;
 }
 addLights(){
  this.hemi=new THREE.HemisphereLight(0xdce7ef,0x6c665d,.82);this.scene.add(this.hemi);
  const sun=new THREE.DirectionalLight(0xffe8d2,2.08);this.keyLight=sun;sun.position.set(-28,55,-32);sun.target.position.set(0,1.5,22);sun.castShadow=true;sun.shadow.mapSize.set(3072,3072);Object.assign(sun.shadow.camera,{left:-18,right:18,top:38,bottom:-36,near:1,far:150});sun.shadow.bias=-.00015;sun.shadow.normalBias=.025;sun.shadow.radius=2.4;this.scene.add(sun,sun.target);
  const fill=new THREE.DirectionalLight(0xdce4ec,.48);this.fillLight=fill;fill.position.set(28,18,8);this.scene.add(fill);
  const rim=new THREE.DirectionalLight(0xf1e4d8,.50);rim.position.set(6,7,-8);this.rimLight=rim;this.scene.add(rim);
 }
 makeZone(){const g=new THREE.Group(),r=.065,zoneMat=new THREE.MeshBasicMaterial({color:0xf32621,transparent:true,opacity:.74,depthTest:false,depthWrite:false});
  const v=(x,y,h)=>{const q=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,18),zoneMat);q.position.set(x,y,0);q.renderOrder=40;g.add(q);return q};
  const hz=(x,y,w)=>{const q=new THREE.Mesh(new THREE.CylinderGeometry(r,r,w,18),zoneMat);q.position.set(x,y,0);q.rotation.z=Math.PI/2;q.renderOrder=40;g.add(q);return q};
  v(-1.27,2.57,2.58);v(1.27,2.57,2.58);hz(0,3.86,2.54);hz(0,1.28,2.54);g.position.z=-.10;g.renderOrder=40;return g}
 makeBall(){const g=new THREE.Group();g.name='Blitzball';
 const tex=document.createElement('canvas');tex.width=tex.height=512;const cg=tex.getContext('2d');cg.clearRect(0,0,512,512);
 cg.fillStyle='#efff21';cg.fillRect(0,0,512,512);
 // Small printed mark only; there are no decorative circumference stripes.
 cg.save();cg.translate(258,260);cg.rotate(-.13);cg.fillStyle='rgba(65,73,23,.52)';cg.font='900 64px Arial';cg.textAlign='center';cg.fillText('BLITZ',0,-8);cg.font='900 55px Arial';cg.fillText('BALL',0,48);cg.restore();
 const map=new THREE.CanvasTexture(tex);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=8;
 // The real ball reads as a solid neon shell with broad faceted aerodynamic
 // panels rather than a perforated wiffle-ball surface.
 const geo=new THREE.IcosahedronGeometry(.215,2);const b=new THREE.Mesh(geo,new THREE.MeshPhongMaterial({color:0xeaff21,map,flatShading:true,shininess:22,specular:0x667028}));b.castShadow=true;b.receiveShadow=true;g.add(b);
 // A faint smooth inner shell softens the facet silhouette without erasing it.
 const inner=new THREE.Mesh(new THREE.SphereGeometry(.207,28,20),new THREE.MeshPhongMaterial({color:0xe7fa20,transparent:true,opacity:.34,shininess:14,specular:0x424a1c,depthWrite:false}));g.add(inner);
 return g}
 makeRing(color){const m=new THREE.Mesh(new THREE.RingGeometry(.30,.36,28),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide,depthTest:false,transparent:true,opacity:.95}));m.renderOrder=50;return m}
makePCI(){
 const g=new THREE.Group(),color=0xcbff87,m=new THREE.LineBasicMaterial({color,transparent:true,opacity:.97,depthTest:false});
 // MLB The Show-style horizontal oval PCI: open brackets around the barrel
 // zone, with three small center diamonds. Geometry is visual only; gameplay
 // forgiveness remains governed by the existing contact model.
 const rx=.430,ry=.311,arc=.34,pts=[];
 function arcSeg(cx,cy,a0,a1,n=7){let prev=null;for(let i=0;i<=n;i++){const a=a0+(a1-a0)*(i/n),p=new THREE.Vector3(Math.cos(a)*rx,Math.sin(a)*ry,0);if(prev)pts.push(prev,p);prev=p}}
 arcSeg(0,0,Math.PI-arc,Math.PI+arc);arcSeg(0,0,-arc,arc);arcSeg(0,0,Math.PI/2-arc,Math.PI/2+arc);arcSeg(0,0,-Math.PI/2-arc,-Math.PI/2+arc);
 const geo=new THREE.BufferGeometry().setFromPoints(pts),ls=new THREE.LineSegments(geo,m);ls.renderOrder=50;g.add(ls);
 const diamondGeo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,.044,0),new THREE.Vector3(.044,0,0),new THREE.Vector3(0,-.044,0),new THREE.Vector3(-.044,0,0),new THREE.Vector3(0,.044,0)]);
 for(const y of [-.154,0,.154]){const d=new THREE.Line(diamondGeo.clone(),new THREE.LineBasicMaterial({color,transparent:true,opacity:.94,depthTest:false}));d.position.y=y;d.renderOrder=51;g.add(d)}
 return g
}
makeContactFeedback(){
 const g=new THREE.Group();g.name='Hitter-only last contact feedback';
 const ghost=this.makePCI();ghost.name='Previous PCI';ghost.scale.setScalar(1.20);ghost.traverse(o=>{if(o.material){o.material=o.material.clone();o.material.color.setHex(0xff5aa8);o.material.opacity=.42}});g.add(ghost);g.userData.ghost=ghost;
 const ring=new THREE.Mesh(new THREE.RingGeometry(.095,.132,28),new THREE.MeshBasicMaterial({color:0xff2f92,transparent:true,opacity:.96,depthTest:false,depthWrite:false,side:THREE.DoubleSide}));ring.renderOrder=56;g.add(ring);g.userData.ring=ring;
 const dot=new THREE.Mesh(new THREE.CircleGeometry(.040,16),new THREE.MeshBasicMaterial({color:0xffb3d7,transparent:true,opacity:.98,depthTest:false,depthWrite:false,side:THREE.DoubleSide}));dot.renderOrder=57;g.add(dot);g.userData.dot=dot;
 g.visible=false;return g
}
updateContactFeedback(feedback){
 const g=this.contactFeedback;if(!g)return;if(!feedback){g.visible=false;return}
 const fadeStarted=Number.isFinite(feedback.fadeAt),age=fadeStarted?Date.now()-feedback.fadeAt:0;if(age<0||age>2000){g.visible=false;return}
 const alpha=!fadeStarted?1:(age<1250?1:clamp(1-(age-1250)/750,0,1));g.visible=true;
 const pciPos=this.targetWorld(feedback.pciX,feedback.pciY,-.625),ballPos=this.targetWorld(feedback.ballX,feedback.ballY,-.635);
 g.userData.ghost.position.copy(pciPos);g.userData.ring.position.copy(ballPos);g.userData.dot.position.copy(ballPos);
 g.userData.ghost.traverse(o=>{if(o.material)o.material.opacity=.34*alpha});g.userData.ring.material.opacity=.96*alpha;g.userData.dot.material.opacity=.98*alpha;
}
makeAimBall(){const g=new THREE.Group(),body=new THREE.Mesh(new THREE.SphereGeometry(.255,24,18),new THREE.MeshBasicMaterial({color:0xffeb32,transparent:true,opacity:.30,depthTest:false}));body.renderOrder=50;g.add(body);const hm=new THREE.MeshBasicMaterial({color:0x554d0b,transparent:true,opacity:.28,side:THREE.DoubleSide,depthTest:false});for(const [a,y] of [[.3,.08],[1.0,-.03],[1.7,.06],[2.4,-.08],[3.1,.03],[4.0,-.04],[5.0,.08]]){const yy=y,rad=Math.sqrt(Math.max(.001,.255*.255-yy*yy)),x=Math.sin(a)*rad,z=Math.cos(a)*rad,n=new THREE.Vector3(x,yy,z).normalize(),q=new THREE.Mesh(new THREE.CircleGeometry(.032,10),hm);q.position.copy(n).multiplyScalar(.258);q.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),n);q.renderOrder=51;g.add(q)}return g}
updateAimPreview(aim,preview){if(!preview){this.aimTrail.visible=false;this.aimUncertainty.visible=false;this.aimPreviewKey='';return}const end=this.targetWorld(aim.x,aim.y,-.61),lack=clamp((99-(preview.commandRating||0))/50,0,1),spread=Number.isFinite(preview.commandSigma)?clamp(.34+6.0*preview.commandSigma,.38,1.30):.32+1.05*Math.pow(lack,1.25);this.aimUncertainty.position.copy(end);this.aimUncertainty.scale.setScalar(spread);this.aimUncertainty.visible=true;const key=[aim.x.toFixed(3),aim.y.toFixed(3),preview.pitchCode,(preview.breakX||0).toFixed(2),(preview.breakY||0).toFixed(2),(preview.wobble||0).toFixed(2),preview.throws].join('|');if(this.aimPreviewKey!==key){this.aimPreviewKey=key;const handed=preview.throws==='L'?-1:1,start=new THREE.Vector3(handed*.55,5.25,43.5),bx=(preview.breakX||0)/120*.82,by=(preview.breakY||0)/120*.72,pre=end.clone().add(new THREE.Vector3(-bx,-by,0)),pts=[];for(let i=0;i<=34;i++){const q=i/34,cur=start.clone().lerp(pre,q),move=pitchMoveEnvelope(preview.pitchCode,q);cur.x+=bx*move;cur.y+=.16*Math.sin(q*Math.PI)+by*move;if(preview.wobble){const fade=Math.sin(q*Math.PI);cur.x+=Math.sin(q*26)*.10*preview.wobble*fade;cur.y+=Math.sin(q*21)*.06*preview.wobble*fade}pts.push(cur)}this.aimTrail.geometry.dispose();this.aimTrail.geometry=new THREE.BufferGeometry().setFromPoints(pts);this.aimTrail.computeLineDistances()}this.aimTrail.visible=true}
 setPark(name){if(this.park===name){this.scene.fog=name==='POLO RINK'?null:this.defaultFog;return}this.park=name;buildParkScene(this.parkRoot,name);buildResultZoneOverlay(this.resultZones,name);this.scene.fog=name==='POLO RINK'?null:this.defaultFog}
 setCameraGame(height=0,zoom=1){zoom=clamp(zoom||1,.65,1.5);this.camera.fov=38/zoom;this.camera.position.set(0,3.10+(height||0),-16.8);this.camera.lookAt(0,2.85+(height||0)*.42,48.5);this.camera.updateProjectionMatrix()}
 setCameraBatted(pos,q=0,height=0,zoom=1){const follow=clamp(q,0,1),z=clamp(pos.z-30,-13,105);zoom=clamp(zoom||1,.65,1.5);this.camera.fov=lerp(38,43,sm(clamp(follow*1.5,0,1)))/zoom;this.camera.position.set(pos.x*.16,lerp(4.0,11.5,sm(clamp(follow*1.6,0,1)))+pos.y*.10+(height||0),z);this.camera.lookAt(pos.x*.72,Math.max(2.2,pos.y*.60)+(height||0)*.35,pos.z+lerp(18,8,follow));this.camera.updateProjectionMatrix()}
 setCameraHRCelebration(t,batterName,height=0,zoom=1){const p=clamp(t/5.15,0,1),batSide=D.players[batterName]?._meta?.bats==='L'?-1:1;zoom=clamp(zoom||1,.65,1.5);if(p<.57){const q=sm(p/.57);this.camera.fov=lerp(32,35,q)/zoom;this.camera.position.set(batSide*lerp(8.2,10.8,q),lerp(4.15,5.35,q)+(height||0),lerp(-7.8,-4.2,q));this.camera.lookAt(batSide*lerp(.8,1.15,q),lerp(2.9,3.25,q)+(height||0)*.25,lerp(3.4,5.2,q));}else{const q=sm((p-.57)/.43);this.camera.fov=34/zoom;this.camera.position.set(lerp(-7.8,-5.0,q),lerp(5.6,4.7,q)+(height||0),lerp(31.5,35.5,q));this.camera.lookAt(0,lerp(3.3,2.95,q)+(height||0)*.25,48);}this.camera.updateProjectionMatrix()}
 setCameraIntro(t){this.camera.fov=40;const a=t*.00010;this.camera.position.set(Math.sin(a)*12.0,5.6,-15.8+Math.cos(a)*1.7);this.camera.lookAt(0,3.0,26);this.camera.updateProjectionMatrix()}
 ensurePlayers(batter,pitcher){if(this.batter?.userData.name!==batter){if(this.batter){this.playerRoot.remove(this.batter);disposePlayer(this.batter)}this.batter=makePlayer(batter);this.playerRoot.add(this.batter)}if(this.pitcher?.userData.name!==pitcher){if(this.pitcher){this.playerRoot.remove(this.pitcher);disposePlayer(this.pitcher)}this.pitcher=makePlayer(pitcher);this.playerRoot.add(this.pitcher)}const bm=D.players[batter]._meta;this.batter.position.set(bm.bats==='L'?-2.9:2.9,0,.9);this.batter.rotation.y=bm.bats==='L'?Math.PI/2:-Math.PI/2;this.pitcher.position.set(0,0,48);this.pitcher.rotation.y=Math.PI}
 setIntroPlayers(a,b,t=0){this.ensurePlayers(a,b);this.batter.position.set(-4.0,0,5.0);this.batter.rotation.y=Math.PI+.18;this.pitcher.position.set(4.0,0,7.0);this.pitcher.rotation.y=Math.PI-.18;neutralRig(this.batter,false);neutralRig(this.pitcher,false);setExpression(this.batter,'neutral',t);setExpression(this.pitcher,'neutral',t);this.batter.userData.batPivot.visible=false;this.zone.visible=false;this.ball.visible=false;this.pci.visible=false;this.contactFeedback.visible=false;this.aim.visible=false;this.aimTrail.visible=false;this.aimUncertainty.visible=false;this.trail.forEach(q=>q.visible=false)}
 zoneRectVirtual(){const corners=[[-1.27,1.28],[1.27,1.28],[-1.27,3.86],[1.27,3.86]].map(([x,y])=>new THREE.Vector3(x,y,-.10).project(this.camera));const xs=corners.map(v=>(v.x*.5+.5)*1280),ys=corners.map(v=>(-.5*v.y+.5)*720);return{x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)}}
 targetWorld(tx,ty,z=-.10){return new THREE.Vector3((.5-tx)*2.54,lerp(3.86,1.28,ty),z)}
 releasePos(pitcher){const p=new THREE.Vector3(),side=D.players[pitcher.userData.name]._meta.throws==='L'?'L':'R',node=pitcher.userData.limbs[side+'Hand']||pitcher.userData.limbs[side+'Wrist'];node.getWorldPosition(p);return p}
 renderGame(state){this.keyLight.position.set(-28,55,-32);this.keyLight.target.position.set(0,1.5,22);this.fillLight.position.set(28,18,8);this.rimLight.intensity=.30;this.sky.visible=true;if(this.contextLost)return false;try{this.setPark(state.park);animateParkTrees(this.parkRoot,Date.now(),state.park==='PCBL MAIN FIELD'||state.park==='POLO RINK');this.setCameraGame(state.cameraHeight||0,state.cameraZoom||1);this.ensurePlayers(state.batter,state.pitcher);const now=Date.now();if(state.batReaction==='hbp'&&state.pitchPose?.kind==='pitch')pitcherHbpAftermathRig(this.pitcher,state.pitchPose,state.batReactionT||0,now);else if(String(state.pitchReaction||'').startsWith('angry')||state.pitchReaction==='hrDisgust')reactionRig(this.pitcher,state.pitchReaction,now,state.pitchReactionT||0);else if(state.pitchPose?.kind==='pitch')pitchRig(this.pitcher,state.pitchPose);else pitchSetRig(this.pitcher,now);if(state.pitch?.batted?.fielded)fieldingRig(this.pitcher,state.pitch.batted,Math.max(0,(now-state.pitch.batted.start)/1000));if(state.batReaction==='hbp')batterHbpReactionRig(this.batter,state.batReactionT||0,now);else if(state.batPose?.kind==='swing'||state.batPose?.kind==='hr'||String(state.batPose?.kind||'').startsWith('flip'))swingRig(this.batter,state.batPose);else stanceRig(this.batter,now);secondaryMotion(this.pitcher,now,(state.pitchReaction==='hrDisgust'||state.batReaction==='hbp')?'reaction':state.pitchPose?.kind==='pitch'?'pitch':'idle',state.pitchPose?.t||0);if(state.pitchReaction==='hrDisgust'&&this.pitcher.userData.face?.hairRoot){const hr=this.pitcher.userData.face.hairRoot;hr.rotation.set(0,0,0);hr.position.set(0,0,0)}secondaryMotion(this.batter,now,(state.batPose?.kind==='swing'||state.batPose?.kind==='hr')?'swing':'idle',state.batPose?.t||0);if(state.batExpression&&!state.batReaction)setExpression(this.batter,state.batExpression,now);if(state.pitchExpression)setExpression(this.pitcher,state.pitchExpression,now);this.zone.visible=true;this.pci.visible=!!state.showPCI;this.aim.visible=!!state.showAim;if(this.pci.visible)this.pci.position.copy(this.targetWorld(state.pci.x,state.pci.y,-.60));this.updateContactFeedback(state.lastContactFeedback||null);if(this.aim.visible){this.aim.position.copy(this.targetWorld(state.aim.x,state.aim.y,-.61));this.updateAimPreview(state.aim,state.aimPreview)}else{this.aimTrail.visible=false;this.aimUncertainty.visible=false;}this.ball.visible=false;this.ballShadow.visible=false;this.trail.forEach(q=>q.visible=false);if(state.pitch){const p=state.pitch;if(p.batted?.path?.length){const flight=p.batted,realSec=Math.max(0,(now-flight.start)/1000),hrT=Number.isFinite(p.hrCelebrationAt)?Math.max(0,(now-p.hrCelebrationAt)/1000):999,landingReplayStart=Number.isFinite(flight.groundTime)?Math.max(0,flight.groundTime-1.15):Math.max(0,flight.duration-1.15),sec=(flight.result==='HR'&&flight.noDoubt&&hrT>=5.15)?Math.min(flight.duration,landingReplayStart+(hrT-5.15)*.90):realSec,path=flight.path;let i=0;while(i<path.length-2&&sec>path[i+1][0])i++;const a=path[i],b=path[Math.min(i+1,path.length-1)],f=a===b?0:clamp((sec-a[0])/Math.max(.0001,b[0]-a[0]),0,1),pos=new THREE.Vector3(lerp(a[1],b[1],f),lerp(a[2],b[2],f),lerp(a[3],b[3],f));
 // If this is a pitcher fly-ball catch, pull the visible ball into the actual
 // bare receiving hand during the final catch window and keep it there after the catch.
 if(flight.fielded&&flight.fieldType==='air'&&Number.isFinite(flight.fieldTime)){
  const lockStart=Math.max(0,flight.fieldTime-.20);if(sec>=lockStart){this.pitcher.updateMatrixWorld(true);const catchHand=this.pitcher.userData.catchHand||this.pitcher.userData.limbs[this.pitcher.userData.catchHandSide+'Wrist'],hh=this.pitcher.userData.height||6,handPos=catchHand.localToWorld(new THREE.Vector3(0,-hh*.012,hh*.010));const cf=sm(clamp((sec-lockStart)/Math.max(.05,flight.fieldTime-lockStart),0,1));pos.lerp(handPos,cf);if(sec>=flight.fieldTime)pos.copy(handPos);}
 }
 this.ball.position.copy(pos);const bs=flight.visualSpin||{};this.ball.rotation.set(sec*(bs.x??11),sec*(bs.y??17)+(flight.spray||0)*.01,sec*(bs.z??7));this.ball.visible=true;this.ballShadow.position.set(pos.x,.018,pos.z);this.ballShadow.scale.setScalar(clamp(1-pos.y/32,.28,1.0));this.ballShadow.material.opacity=clamp(.28-pos.y*.006,.035,.24);this.ballShadow.visible=true;const fq=clamp(sec/Math.max(.1,flight.duration),0,1);if(flight.result==='HR'&&flight.noDoubt&&hrT<5.15)this.setCameraHRCelebration(hrT,state.batter,state.cameraHeight||0,state.cameraZoom||1);else this.setCameraBatted(pos,fq,state.cameraHeight||0,state.cameraZoom||1);this.trail.forEach(d=>d.visible=false)}else{const elapsed=now-p.release;if(elapsed<0){const pt=state.pitchPose?.t||0;if(pt>=.08){this.scene.updateMatrixWorld(true);const handPos=this.releasePos(this.pitcher);this.ball.position.copy(handPos);this.ball.rotation.set(pt*7,pt*9,pt*5);this.ball.visible=true;this.ballShadow.visible=false;if(pt>=.975)this.releaseCache.set(p.id,handPos.clone());}}else{let start=this.releaseCache.get(p.id);if(!start){this.scene.updateMatrixWorld(true);start=this.releasePos(this.pitcher).clone();this.releaseCache.set(p.id,start)}const q=clamp(elapsed/p.duration,0,1),end=this.targetWorld(p.tx,p.ty,-.13),path=(qq)=>{const bx=(p.breakX||0)/120*.82,by=(p.breakY||0)/120*.72,preBreak=end.clone().add(new THREE.Vector3(-bx,-by,0)),cur=start.clone().lerp(preBreak,qq),move=pitchMoveEnvelope(p.pitchCode,qq),arch=Math.sin(qq*Math.PI);cur.x+=bx*move;cur.y+=.16*arch+by*move;if(p.wobble){const fade=Math.sin(qq*Math.PI);const late=.55+.45*sm(clamp((qq-.18)/.62,0,1));cur.x+=Math.sin(qq*33+p.id*.0017)*.16*p.wobble*fade*late;cur.y+=Math.sin(qq*24+p.id*.0021)*.10*p.wobble*fade*late;}return cur};this.ball.position.copy(path(q));if(p.hbpAt&&now>=p.hbpAt){const hitSec=clamp((now-p.hbpAt)/1000,0,.65),hitSide=D.players[state.batter]?._meta?.bats==='L'?-1:1;this.ball.position.x+=hitSide*.34*hitSec;this.ball.position.y-=.62*hitSec;this.ball.position.z-=.48*hitSec;}const spin=pitchSpin(p.pitchCode,q);this.ball.rotation.set(spin[0],spin[1],spin[2]);this.ball.visible=true;this.ballShadow.position.set(this.ball.position.x,.018,this.ball.position.z);this.ballShadow.scale.setScalar(.45);this.ballShadow.material.opacity=.10;this.ballShadow.visible=true;this.trail.forEach((d,i)=>{const qq=clamp(q-(i+1)*.025,0,1);d.position.copy(path(qq));d.visible=q>.03*(i+1)})}}}if(state.pitch?.batted?.path?.length)updateResultZoneOverlay(this.resultZones,state.park,state.pitch.batted,Math.max(0,(now-state.pitch.batted.start)/1000));else this.resultZones.visible=false;this.renderScene();this.lastError=null;return true}catch(e){console.error('Animated 3D frame error',e);this.lastError=e;try{neutralRig(this.pitcher,false);neutralRig(this.batter,true);this.renderScene();return true}catch(e2){this.lastError=e2;return false}}}
 renderIntro(state,t){this.resultZones.visible=false;this.keyLight.position.set(-28,55,-32);this.keyLight.target.position.set(0,1.5,22);this.fillLight.position.set(28,18,8);this.rimLight.intensity=.30;this.sky.visible=true;try{this.setPark(state.park);animateParkTrees(this.parkRoot,Date.now(),state.park==='PCBL MAIN FIELD'||state.park==='POLO RINK');this.setCameraIntro(t);this.setIntroPlayers(state.a,state.b,t);this.renderScene();this.lastError=null;return true}catch(e){this.lastError=e;console.error('Animated intro frame error',e);return false}}
 renderPreview(name,pose='neutral',t=0,angle=0,zoom=11){
  this.resultZones.visible=false;this.keyLight.position.set(-5,10,7);this.keyLight.target.position.set(0,3,0);this.fillLight.position.set(5,5,2);this.rimLight.intensity=.55;this.sky.visible=false;this.ensurePlayers(name,name);this.parkRoot.visible=false;this.pitcher.visible=false;this.fxRoot.visible=false;
  if(!this.previewFloor){this.previewFloor=new THREE.Mesh(new THREE.PlaneGeometry(120,120),new THREE.MeshPhongMaterial({color:0x626970,shininess:4}));this.previewFloor.rotation.x=-Math.PI/2;this.previewFloor.position.y=-.025;this.previewFloor.receiveShadow=true;this.scene.add(this.previewFloor)}
  if(!this.previewGuides){
   this.previewGuides=new THREE.Group();this.scene.add(this.previewGuides);
   const shape=new THREE.Shape();shape.moveTo(-.71,.71);shape.lineTo(.71,.71);shape.lineTo(.71,0);shape.lineTo(0,-.71);shape.lineTo(-.71,0);shape.closePath();
   this.previewPlate=new THREE.Mesh(new THREE.ShapeGeometry(shape),mat(0xe2ded1,.96));this.previewPlate.rotation.x=-Math.PI/2;this.previewPlate.position.set(0,.008,2.8);this.previewGuides.add(this.previewPlate);
   this.previewArrow=new THREE.Group();this.previewGuides.add(this.previewArrow);const pts=[[1.7,.009,2.8],[4.7,.009,2.8],[4.3,.009,2.5],[4.7,.009,2.8],[4.3,.009,3.1]].map(a=>new THREE.Vector3(...a));this.previewArrow.add(line(pts,0xb7c4cc,.85));
   this.previewLabel=makeTextPlane('PITCHER','#dbe6eb','transparent',1.25,.30,40);this.previewLabel.rotation.x=-Math.PI/2;this.previewLabel.position.y=.012;this.previewGuides.add(this.previewLabel);
  }
  this.previewGuides.visible=pose==='swing';const previewSign=D.players[name]._meta.bats==='L'?-1:1;this.previewArrow.scale.x=previewSign;this.previewLabel.position.set(previewSign*3.8,.012,2.25);this.previewPlate.rotation.z=previewSign*Math.PI/2;
  this.scene.background=new THREE.Color(0xaab5bf);this.batter.position.set(0,0,0);this.batter.rotation.y=0;
  if(pose==='swing'){swingRig(this.batter,{kind:'swing',t});secondaryMotion(this.batter,performance.now(),'swing',t)}else if(pose==='pitch'){pitchRig(this.batter,{kind:'pitch',t});secondaryMotion(this.batter,performance.now(),'pitch',t)}else{neutralRig(this.batter,false);secondaryMotion(this.batter,performance.now(),'idle',0)}
  this.camera.fov=36;this.camera.position.set(Math.sin(angle)*zoom,3.7,Math.cos(angle)*zoom);this.camera.lookAt(0,2.95,0);this.camera.updateProjectionMatrix();this.renderScene();
 }
 sampleSwing(name,t){this.ensurePlayers(name,name);applySwingFrame(this.batter,clamp(t,0,1),0);this.batter.updateMatrixWorld(true);return this.batter;}
 validateMatch(a,b){try{this.ensurePlayers(a,b);return true}catch(e){this.lastError=e;return false}}
 prepareMatch(a,b){try{this.ensurePlayers(a,b);neutralRig(this.pitcher,false);neutralRig(this.batter,true);return true}catch(e){this.lastError=e;return false}}
 disposePitch(id){if(id)this.releaseCache.delete(id)}
 resetMatch(){this.releaseCache.clear();this.lastError=null;this.ball.visible=false;this.ballShadow.visible=false;this.pci.visible=false;this.contactFeedback.visible=false;this.aim.visible=false;this.aimTrail.visible=false;this.aimUncertainty.visible=false;this.aimPreviewKey='';this.trail.forEach(q=>q.visible=false)}
 diagnostic(){return this.lastError?String(this.lastError.message||this.lastError):''}
 dispose(){}
}
window.PCBL3D={motionRevision:SWING_MOTION_REVISION,swingDuration:(name,type='regular')=>({Auden:420,Jason:380,Jarvis:450,Najee:395,Coel:370,Josef:370}[name]||420)*({power:1.08,regular:1,contact:.90}[type]||1),create:(canvas,mode)=>new Engine(canvas,mode)};
})();
