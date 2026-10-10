// Audit: FF skills / job-task content must appear ONLY in the FF Skills workout (and crew challenge).
// Run: NODE_PATH=/tmp/pt/node_modules node tests/ff-audit.js
const p=require('puppeteer-core'),path=require('path');
const RE=/job[- ]?task|fireground|stair|drag|hose|ladder|dummy|SCBA|turnout|in gear|crawl|search|hook|sledge|patient[- ]lift|\bJT\d+|evolution|scenario|on the job|forcible|pike pole/i;
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const pg=await b.newPage();
await pg.setViewport({width:390,height:844,isMobile:true});const url='file://'+path.resolve(__dirname,'../index.html')+'#skip';
let checks=0,fails=[];const errs=[];pg.on('pageerror',e=>errs.push(e.message));
const scanX=async(label,strict)=>{const r=await pg.evaluate((strict)=>{if(!strict)document.querySelectorAll('.ffentry').forEach(x=>x.remove());
  const t=[...document.querySelectorAll('main,.sheet,.toast,nav')].map(x=>x.innerText).join('\n');return t},!!strict);checks++;const m=t=>t.match(RE);const hit=m(r);if(hit)fails.push(label+' → "'+hit[0]+'" in: '+r.slice(Math.max(0,hit.index-60),hit.index+60).replace(/\n/g,' '))};
const MODES={on:{custom:[1],off:0},post:{custom:[1,0],off:-1},off:{custom:[0],off:0}};
const TIERS={g:{feel:5,sleep:8,calls:0,tough:false},y:{feel:3,sleep:7,calls:2,tough:false},r:{feel:1,sleep:2,calls:9,tough:true}};
for(const [mode,cfg] of Object.entries(MODES)){
 const d=new Date();d.setDate(d.getDate()+cfg.off);const start=d.toISOString().slice(0,10);
 await pg.goto(url);await pg.evaluate((c,s)=>{localStorage.ffOnb=1;localStorage.ffSched=JSON.stringify({rot:'Custom',start:s,plat:'A',custom:c})},cfg.custom,start);
 for(const per of ['ryan','jess'])for(const [tn,ck] of Object.entries(TIERS)){
  await pg.goto(url);await pg.evaluate((per,ck)=>{S.p=per;persona();Object.assign(S.ck,ck);S.tab='today';render()},per,ck);
  const L=`[${per}/${tn}/${mode}]`;const SP=per=='jess';const scan=(l)=>scanX(l,SP);await scan(L+' Today');
  for(const mins of [10,15,30]){await pg.evaluate(m=>{S.ck.mins=m;render()},mins);await scan(L+' Today '+mins+'min')}
  await pg.evaluate(()=>{S.ck.mins=30;render()});
  const n=await pg.$$eval('.ex[data-i]',x=>x.length);
  for(let i=0;i<n;i++){
   await pg.evaluate(i=>{const x=plan().x[i][0];detailSheet(x)},i);await scan(L+' detail#'+i);await pg.evaluate(()=>document.querySelectorAll('.sheet,.sheet-bg').forEach(x=>x.remove()));
   await pg.evaluate(i=>swapSheet(i,plan().x[i][0]),i);await scan(L+' swap#'+i);await pg.evaluate(()=>document.querySelectorAll('.sheet,.sheet-bg').forEach(x=>x.remove()));
   for(const k of ['easy','hard']){await pg.evaluate((i,k)=>{S.mods[S.p+i]={k};render()},i,k);await scan(L+' '+k+'#'+i)}
   await pg.evaluate(i=>{S.mods[S.p+i]=null},i);
  }
  await pg.evaluate(()=>{S.sess=null;S.tab='session';render()});await scan(L+' session');
  await pg.evaluate(()=>{S.sess.paused=true;stopTimer();render()});await scan(L+' paused');
  await pg.evaluate(()=>{S.sess.replan=true;render()});await scan(L+' replan');
  await pg.evaluate(()=>{stopTimer();S.sess=null;S.tab='cal';render()});
  for(let d=1;d<=31;d++){await pg.evaluate(d=>{S.selDay=d;render()},d);await scan(L+' cal day '+d)}
  await pg.evaluate(()=>{S.tab='fam';render()});await scan(L+' spouse/kids tab');
  for(const qm of [10,15,20])for(const ql of (SP?['Home','Gym','Park']:['Station','Home','Travel'])){await pg.evaluate((m,l)=>{S.qw={m,loc:l};S.tab='quick';render()},qm,ql);await scan(L+` quick ${qm}/${ql}`);
   await pg.evaluate(()=>{const q=S.qpick;S.sess={el:0,cur:0,paused:false,x:q.map(e=>[e.id,e.tps])};S.tab='session';render();stopTimer()});await scan(L+` quick ${qm}/${ql} session`)}
  if(SP){for(const tb of ['crew','ffskills','coach']){await pg.evaluate(t=>{S.tab=t;render()},tb);await scan(L+' '+tb+' tab (strict)')}
   const hasFF=await pg.evaluate(()=>{S.tab='today';render();return !!document.querySelector('.ffentry,[data-go=ffskills],[data-go=dispatch]')});checks++;if(hasFF)fails.push(L+' spouse Today has FF Skills/dispatch entry point');
   const tabs=await pg.$$eval('nav button',x=>x.map(y=>y.innerText).join('|'));checks++;if(/Crew/.test(tabs))fails.push(L+' spouse tab bar shows Crew: '+tabs)}
  await pg.evaluate(()=>{S.tab='today';render()});
 }}
// spouse onboarding flow (strict)
await pg.goto(url);await pg.evaluate(()=>localStorage.removeItem('ffOnb'));await pg.goto(url.replace('#skip',''));
await pg.evaluate(()=>[...document.querySelectorAll('.sheet [data-o]')].find(b=>b.dataset.o=='Fire spouse').click());
for(let i=0;i<4;i++){await scanX('spouse onboarding step '+(i+1),true);const b2=await pg.$('.sheet [data-n]');await b2.click()}
await scanX('spouse onboarding schedule',true);
const sp=await pg.evaluate(()=>S.p);checks++;if(sp!=='jess')fails.push('spouse onboarding did not route to spouse program');

await pg.goto(url);await pg.evaluate(()=>{localStorage.removeItem('ffOnb')});await pg.goto(url.replace('#skip',''));
for(let i=0;i<5;i++){await scanX('onboarding step '+(i+1));const b2=await pg.$('.sheet [data-n]');if(!b2)break;if(i<4)await b2.click()}
// positive control: FF Skills workout must contain JT moves
await pg.goto(url);const ff=await pg.evaluate(()=>{S.tab='ffskills';render();return document.querySelector('main').innerText});
const pos=/Hose drag|Stair climb/.test(ff);
console.log(`Checks run: ${checks}  Leaks: ${fails.length}  FF Skills still has job-task moves: ${pos}  JS errors: ${errs.length}`);
fails.slice(0,40).forEach(f=>console.log('LEAK',f));await b.close();process.exit(fails.length||!pos||errs.length?1:0)})();
