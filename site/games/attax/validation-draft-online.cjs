const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/app.js','utf8');
const a0=src.indexOf('const cards = [');
const a1=src.indexOf('\n];',a0)+3;
assert(a0>=0&&a1>a0,'cards literal missing');
const cardDecl=src.slice(a0,a1);
const cards=vm.runInNewContext(cardDecl+'\ncards;');
function extractFunction(name){
  const start=src.indexOf('function '+name+'(');assert(start>=0,name+' missing');
  let open=src.indexOf('{',start),depth=0,end=-1;
  for(let i=open;i<src.length;i++){
    if(src[i]==='{')depth++; else if(src[i]==='}'&&--depth===0){end=i+1;break;}
  }
  assert(end>open,name+' parse failed');return src.slice(start,end);
}
const names=['validateDraftRosterIds','shuffle','makeTeam','rosterCardsFromIds','randomRosterExcluding','rosterTeam','makeFreshGame'];
const hitters=cards.filter(c=>c.type==='H'),pitchers=cards.filter(c=>c.type==='P');
const hostIds=[...hitters.slice(0,7),...pitchers.slice(0,5)].map(c=>c.id);
const guestIds=[...hitters.slice(-7),...pitchers.slice(-5)].map(c=>c.id);
const context={cards,console,Math,localDraftRosterIds:()=>hostIds};vm.createContext(context);
vm.runInContext(names.map(extractFunction).join('\n'),context);
assert.deepStrictEqual([...context.validateDraftRosterIds(hostIds)].sort((a,b)=>a-b),[...hostIds].sort((a,b)=>a-b));
assert.deepStrictEqual([...context.validateDraftRosterIds(guestIds)].sort((a,b)=>a-b),[...guestIds].sort((a,b)=>a-b));
const g=context.makeFreshGame(true,'online',{player:'HOST',cpu:'GUEST'},{player:hostIds,cpu:guestIds});
const ids=t=>[...t.hitters,...t.pitchers].map(c=>c.id).sort((a,b)=>a-b);
assert.deepStrictEqual(ids(g.player),[...hostIds].sort((a,b)=>a-b),'host draft not preserved');
assert.deepStrictEqual(ids(g.cpu),[...guestIds].sort((a,b)=>a-b),'guest draft not preserved');
assert.strictEqual(g.rosterSource.player,'draft');assert.strictEqual(g.rosterSource.cpu,'draft');
const one=context.makeFreshGame(false,'online',{player:'HOST',cpu:'GUEST'},{player:hostIds,cpu:[]});
assert.deepStrictEqual(ids(one.player),[...hostIds].sort((a,b)=>a-b),'one-sided host draft not preserved');
assert.strictEqual(one.rosterSource.player,'draft');assert.strictEqual(one.rosterSource.cpu,'random');
assert.strictEqual(ids(one.cpu).filter(id=>hostIds.includes(id)).length,0,'random opponent overlaps drafted host cards');
assert(src.includes('type:"hello", name:onlineName(), sidePref:sideChoice, draftIds:localDraftRosterIds()'),'direct hello does not carry draft roster');
assert(src.includes('type:"queue_probe",name:onlineName(),sidePref:sideChoice,ticket:publicQueueTicket,draftIds:localDraftRosterIds()'),'legacy queue probe does not carry draft roster');
assert(src.includes('type:"ready", peerId:directPeer.id, name:onlineName(), sidePref:sideChoice, ticket:publicQueueTicket, draftIds:localDraftRosterIds()'),'public coordinator does not carry draft roster');
assert(src.includes('cpu:validateDraftRosterIds(message.draftIds)'),'direct host does not consume guest draft roster');
assert(src.includes('cpu:validateDraftRosterIds(request?.draftIds)'),'queue host does not consume guest draft roster');
console.log(JSON.stringify({pass:true,cards:cards.length,host:hostIds,guest:guestIds,rosterSource:g.rosterSource},null,2));
