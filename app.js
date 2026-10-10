const L=Object.fromEntries(LIB.map(e=>[e.id,e]));
const $=s=>document.querySelector(s), M=$('#main');
const S={ff:{mode:'Solo',m:20},p:'ryan',tab:'today',ck:{feel:4,sleep:7,calls:2,tough:false,mins:30},mods:{},done:{},sess:null,qw:{m:15,loc:'Station'},selDay:new Date().getDate()};
const P={
ryan:{name:'Ryan',role:'Engine FF · 48/96 · low-back history flag',ctx:'On shift · hour 4 of 48 · Station gym',
 plans:{g:{t:'Call-proof chunks · functional strength',d:'Functional strength with gym equipment in 3 chunks of ~10 min. Stop anytime a call drops; finished chunks count.',x:[['HG03','3 × 5'],['SQ02','3 × 8'],['PL01','3 × 10/side'],['CA02','2 × 30 m/side'],['CO01','3 × 30 s']]},
  y:{t:'Reduced functional chunks · no max efforts',d:'Volume down ~25%. Low-back flag: trap bar deadlift swapped for glute bridge.',x:[['HG01','2 × 12'],['SQ01','2 × 8'],['PL03','2 × 15'],['CO03','2 × 8/side'],['MB02','1 × 5/side']]},
  r:{t:'Recovery day · move, breathe, sleep',d:'Rough night. No training stress today — mobility and an easy walk.',x:[['MB06','4 min'],['MB01','2 × 6/side'],['MB03','2 × 6/side'],['MB04','2 × 45 s/side'],['CD05','15 min easy']]}}},
jess:{name:'Jess',role:'Fire spouse · 2 kids · postpartum >1 yr, cleared',ctx:'Solo-parenting (Ryan on shift) · Nap window 1:00–3:00 · Home dumbbells',
 plans:{g:{t:'20-min nap-window circuit',d:'Quiet, low-impact moves so the baby stays asleep.',x:[['SQ02','3 × 10'],['PL01','3 × 10/side'],['HG02','3 × 10'],['LG01','2 × 8/side'],['CO01','3 × 30 s']]},
  y:{t:'12-min quiet session',d:'Tired but okay. Shorter, lighter, still counts.',x:[['SQ01','2 × 10'],['PL03','2 × 15'],['HG01','2 × 12'],['CO03','2 × 8/side']]},
  r:{t:'Reset · 10 min mobility + breathing',d:'Low energy and short sleep. Rest is the plan today.',x:[['MB06','4 min'],['MB02','1 × 5/side'],['MB01','2 × 6/side'],['CD05','Stroller walk, easy']]}}}};
const tierOf=c=>{if(c.feel<=2||c.sleep<4||c.calls>=7||(c.tough&&c.feel<=3))return'r';if(c.feel==3||c.sleep<6||c.calls>=4||c.tough)return'y';return'g'};
const TN={g:['Green','Full plan','#2ecc71'],y:['Yellow','Scaled plan','#f5c518'],r:['Red','Recovery','#ff4d4d']};
const first=s=>(s||'').split(/,|;| or /)[0].trim();
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;$('#app').appendChild(d);setTimeout(()=>d.remove(),1800)}
function setTier(){const t=tierOf(S.ck);document.documentElement.style.setProperty('--tier',TN[t][2]);return t}
function plan(){const t=setTier(),b=P[S.p].plans[t];if(typeof dayMode!='function')return b;const m=dayMode(new Date());
 if(S.p=='ryan'&&m!='on')return Object.assign({},b,{t:t=='r'?b.t:(m=='post'?'Post-shift day · ':'Day off · ')+'home strength (no call chunks)',d:t=='r'?b.d:'Balanced against what you did on shift. Home garage equipment.'});
 if(S.p=='jess'&&m!='on')return Object.assign({},b,{t:t=='r'?b.t:'Partner home · full "me time" session',d:t=='r'?b.d:'Ryan is home today, so your plan auto-switched to a longer session.'});return b}
function exName(i,id){const m=S.mods[S.p+i];const e=L[id];if(!m)return e.name;if(m.k=='swap')return L[m.id].name;return first(e[m.k=='easy'?'easy':'hard'])}
function exRow(i,id,dose){const m=S.mods[S.p+i],e=L[m&&m.k=='swap'?m.id:id],dn=S.done[S.p+i];
 const tag=m?`<span class="ex-tag" style="background:${m.k=='hard'?'#5a1f0b':'#163a26'}">${m.k=='swap'?'SWAPPED':m.k.toUpperCase()}</span> `:'';
 return `<div class="ex ${dn?'done':''}" data-i="${i}"><div class="chk" data-act="done">${dn?'✓':''}</div><div class="n" data-act="detail"><b>${exName(i,id)}</b><span class="small mut">${tag}${dose} · ${e.id}${e.intr=='Y'?' · call-safe':''}</span></div>
 <div class="acts"><button data-act="swap">Swap</button><button data-act="easy">−</button><button data-act="hard">+</button></div></div>`}
const tabs=()=>[['today','🔥','Today'],['cal','📅','Calendar'],['crew','👥','Crew'],['fam',S.p=='ryan'?'💛':'🧸',S.p=='ryan'?'Spouse':'Kids'],['coach','🧢','Coach']];
function nav(){$('#nav').innerHTML=tabs().map(([k,i,n])=>`<button data-tab="${k}" class="${S.tab==k?'on':''}"><span>${i}</span>${n}</button>`).join('')}
function go(t){S.tab=t;stopTimer();render()}
function render(){nav();const f={today,cal,crew,fam,coach,session,quick,strain,dispatch,ffskills}[S.tab];M.innerHTML=`<div class="view">${f()}</div>`;M.scrollTop=0;bind()}
function today(){const p=plan(),t=tierOf(S.ck),c=S.ck,pr=P[S.p],dm=dayMode(new Date());const ctx=S.p=='ryan'?(dm=='on'?'On shift today ('+SCH.rot+') · Station gym':dm=='post'?'Off · first day after shift · Home':'Off duty · Home garage'):(dm=='on'?'Solo-parenting (Ryan on shift) · Nap window 1:00–3:00 · Home dumbbells':'Partner home (auto-switched) · Ryan off today');
return `<div class="small mut">${ctx} <span class="example">EXAMPLE DATA</span></div><h2>Morning, ${pr.name}</h2>
<div class="card"><div class="lbl">Daily check-in · 20 sec</div>
<div class="row"><span>How do you feel?</span><b id="fv" style="flex:0">${c.feel}/5</b></div><input type="range" min="1" max="5" value="${c.feel}" data-ck="feel">
<div class="row"><span>Hours slept</span><b style="flex:0">${c.sleep} h</b></div><input type="range" min="0" max="10" value="${c.sleep}" data-ck="sleep">
${S.p=='ryan'?`<div class="row"><span>Calls last shift</span><b style="flex:0">${c.calls}</b></div><input type="range" min="0" max="12" value="${c.calls}" data-ck="calls">
<div class="chips" style="margin:6px 0"><button class="chip ${c.tough?'on':''}" data-tough>Tough call? ${c.tough?'Yes':'No'}</button></div>`:''}
<div class="lbl" style="margin-top:8px">Time available</div><div class="chips">${[10,15,20,30,45].map(m=>`<button class="chip ${c.mins==m?'on':''}" data-mins="${m}">${m} min</button>`).join('')}</div></div>
<div class="tier"><div class="dot"></div><div style="flex:1"><b>${TN[t][0]} · ${TN[t][1]}</b><div class="small mut">${t=='g'?'Good to go — full plan.':t=='y'?'Volume down ~25–30%, no max efforts.':'Recovery only. Sleep and mobility win today.'}</div></div></div>
<div class="card"><div class="lbl">Today's workout${c.mins<=15&&t!='r'?' · trimmed to '+c.mins+' min':''}</div><h3>${p.t}</h3><div class="small mut" style="margin-bottom:6px">${p.d}</div>
${p.x.slice(0,c.mins<=15?3:9).map(([id,d],i)=>exRow(i,id,d)).join('')}
<button class="btn" data-go="session">▶ Start workout</button></div>
<div class="card" style="display:flex;gap:10px;align-items:center;border-left:3px solid var(--org)"><img src="img/nick.jpg" style="width:40px;height:40px;border-radius:50%;object-fit:cover;object-position:50% 20%"><div class="small"><b style="color:var(--org)">Coach note · Nick</b><br>${S.p=='ryan'?"Tones drop, you stop. Every chunk you finish counts. Don't chase the missed sets.":"Fifteen minutes during nap time is a win. Don't wait for the perfect day."}</div></div>
${ffCard()}<div class="row"><button class="btn sec" data-go="quick">⚡ Quick workout</button></div>
<div class="row"><button class="btn sec" data-go="strain">⌚ Wearable strain <span class="planned">PLANNED</span></button><button class="btn sec" data-go="dispatch">📟 Dispatch <span class="planned">PLANNED</span></button></div>
<p class="small mut" style="margin-top:14px">Prototype with example data. General fitness guidance, not medical advice.</p>`}
let T=null;
function stopTimer(){clearInterval(T);T=null}
function fmt(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function ffCard(){return `<div class="card" style="border-left:3px solid var(--r)"><div class="lbl">Optional · separate workout</div><h3>🚒 FF Skills Workout</h3><div class="small mut">Job-task conditioning: stair climb, hose drag, dummy drag, sledge, hook pulls, carries, search crawl, hose hoist, patient lift. Solo or with your crew.</div><button class="btn" data-go="ffskills">Choose Solo or Crew</button></div>`}
function ffBuild(){const t=tierOf(S.ck),n={10:3,20:5,30:7}[S.ff.m];let pool=LIB.filter(e=>e.pat=='Job-task');const swapped=[];
 const lb=e=>S.p=='ryan'&&/low back/i.test(e.avoid);if(t=='r')pool=pool.filter(e=>{if(lb(e))swapped.push(e.name);return !lb(e)});
 if(t=='r')pool=pool.filter(e=>+e.lvl<=2);
 const x=pool.slice(0,n);const rounds=t=='g'?(S.ff.m/10+1):Math.max(1,S.ff.m/10);
 return {t,x,swapped,rounds,dose:e=>(t=='r'?e.low:e.tps+' work · '+rounds+' round'+(rounds>1?'s':''))+(t=='y'&&lb(e)?' · low-back mod: '+e.inj.split('.')[0]:'')}}
function ffskills(){const f=ffBuild(),c=S.ff.mode=='Crew';
 return `<button class="chip" data-end>‹ Today</button><h2 style="margin-top:10px">🚒 FF Skills Workout</h2><div class="small mut" style="margin-bottom:10px">Optional job-task session — separate from your daily functional workout.</div>
<div class="big" style="grid-template-columns:1fr 1fr">${['Solo','Crew'].map(m=>`<button class="${S.ff.mode==m?'on':''}" data-ffm="${m}">${m=='Solo'?'🧍':'👥'} ${m}<small>${m=='Solo'?'Just you':'Scenario evolution'}</small></button>`).join('')}</div>
<div class="lbl" style="margin-top:14px">Length</div><div class="big">${[10,20,30].map(m=>`<button class="${S.ff.m==m?'on':''}" data-ffl="${m}">${m}<small>minutes</small></button>`).join('')}</div>
<div class="tier" style="margin-top:12px"><div class="dot"></div><div class="small"><b>${TN[f.t][0]} readiness applied</b><br>${f.t=='g'?'Full dose.':f.t=='y'?'Fewer rounds, no max efforts.':'Light, low-level drills only (or skip today).'}${f.swapped.length?'<br>Low-back flag: removed '+f.swapped.join(', '):''}</div></div>
<div class="card"><div class="lbl">${c?'Crew scenario · rotate stations in pairs, '+f.rounds+' round(s) for time':'Solo circuit · '+f.rounds+' round(s)'}</div>
${f.x.map((e,i)=>`<div class="ex" data-id="${e.id}"><div class="n"><b>${c?'Station '+(i+1)+': ':''}${e.name}</b><span class="small mut">${f.dose(e)}</span></div><span>›</span></div>`).join('')}
${c?`<div class="banner" style="margin-top:10px">🏆 Crew results post to the <b>Crew leaderboard</b> as effort points (scaled for age, size and readiness). One member rotates to timekeeper/safety each round. <span class="example">EXAMPLE</span></div>`:''}
<button class="btn" data-ffstart>▶ Start ${S.ff.mode.toLowerCase()} FF skills · ${S.ff.m} min</button></div>`}
function session(){const p=plan(),s=S.sess||(S.sess={el:0,paused:false,replan:false,cur:0});
 if(!s.paused&&!T)T=setInterval(()=>{s.el++;const e=$('#tm');if(e)e.textContent=fmt(s.el)},1000);
 const ex=s.x||p.x;const cur=ex[Math.min(s.cur,ex.length-1)];const left=ex.slice(s.cur);
 if(s.cur>=ex.length)return `<h2>Workout complete 🔥</h2><div class="card"><div class="timer">${fmt(s.el)}</div><p class="mut" style="text-align:center">${ex.length} movements · logged to your week (example)</p></div><button class="btn" data-end>Back to Today</button>`;
 return `<button class="chip" data-end>‹ Today</button><h2 style="margin-top:10px">${s.t||p.t}</h2>
${s.paused?`<div class="banner"><b>📟 Call dropped — workout paused.</b><br>Go do your job. Everything you finished is saved.</div>`:''}
<div class="card"><div class="lbl">${s.paused?'Paused':'Elapsed'}</div><div class="timer" id="tm" style="color:${s.paused?'var(--y)':'var(--tx)'}">${fmt(s.el)}</div>
<div class="lbl" style="margin-top:8px">Now · ${s.cur+1} of ${ex.length}</div><h3>${s.x?L[cur[0]].name:exName(s.cur,cur[0])}</h3><div class="mut small">${cur[1]} · ${L[cur[0]].cues}</div>
${s.paused?(s.replan?`<div class="lbl" style="margin-top:12px">Back from the call — how much time now?</div>
<button class="btn sec" data-rp="rest">10 min: finish "${L[cur[0]].name}" + 1 more</button><button class="btn sec" data-rp="core">5 min: core &amp; mobility only</button><button class="btn sec" data-rp="bank">Call it — bank what I did</button>`
:`<button class="btn" data-resume>▶ Resume where I left off</button><button class="btn sec" data-replan>↻ Re-plan the rest</button>`)
:`<button class="btn" data-next>✓ Done — next</button><button class="btn red" data-pause>📟 Call dropped – pause</button>`}</div>
<div class="card"><div class="lbl">Up next</div>${left.slice(1).map(([id,d])=>`<div class="small" style="padding:4px 0">${L[id].name} · <span class="mut">${d}</span></div>`).join('')||'<span class="mut small">Last one!</span>'}</div>`}
function detailSheet(id){const e=L[id];sheet(`<span class="ex-tag">${e.id} · ${e.pat}</span><h2 style="margin-top:6px">${e.name}</h2>
<div class="small mut">${e.mus} · ${e.eq} · Level ${e.lvl}/5 · ${e.tps}/set ${e.intr=='Y'?'· call-safe ✓':''}</div>
${e.job?`<div class="card" style="margin-top:10px"><div class="lbl">Why it matters on the job</div>${e.job}</div>`:''}
<div class="card"><div class="lbl">Coaching cues</div>${e.cues}</div>
<div class="card"><div class="lbl">Easier</div>${e.easy}<div class="lbl" style="margin-top:8px">Harder</div>${e.hard}<div class="lbl" style="margin-top:8px">No-equipment swap</div>${e.noeq}</div>
<div class="card"><div class="lbl">Injury swaps · avoid/modify: ${e.avoid||'—'}</div>${e.inj}<div class="lbl" style="margin-top:8px">Low-readiness option</div>${e.low}</div>
${e.spouse?`<div class="card"><div class="lbl">Spouse-friendly notes</div>${e.spouse}</div>`:''}
<div class="card" style="text-align:center;padding:30px" ><span class="mut">▶ Nick's demo video goes here</span></div><button class="btn sec" data-close>Close</button>`)}
function sheet(h){const b=document.createElement('div');b.className='sheet-bg';const s=document.createElement('div');s.className='sheet';s.innerHTML='<div class="grab" data-close style="cursor:pointer"></div><button data-close style="position:absolute;right:12px;top:10px;background:#2a2a2f;border:0;color:#ccc;border-radius:50%;width:30px;height:30px;font-size:16px">✕</button>'+h;
 b.onclick=()=>{b.remove();s.remove()};$('#app').append(b,s);s.querySelectorAll('[data-close]').forEach(x=>x.onclick=b.onclick);return s}
function swapSheet(i,id){const e=L[id],alts=LIB.filter(x=>x.pat==e.pat&&x.id!=id&&(e.pat=='Job-task'||x.pat!='Job-task'));
 const s=sheet(`<h2>Swap ${e.name}</h2><div class="small mut" style="margin-bottom:8px">Same movement pattern (${e.pat}) from Nick's library. Injury swap: ${e.inj}</div>
 ${alts.map(a=>`<div class="ex" data-pick="${a.id}"><div class="n"><b>${a.name}</b><span class="small mut">${a.eq} · Level ${a.lvl}${a.intr=='Y'?' · call-safe':''}</span></div><span>›</span></div>`).join('')}
 <button class="btn sec" data-close>Cancel</button>`);
 s.querySelectorAll('[data-pick]').forEach(x=>x.onclick=()=>{S.mods[S.p+i]={k:'swap',id:x.dataset.pick};document.querySelector('.sheet-bg').click();toast('Swapped to '+L[x.dataset.pick].name);render()})}
function quick(){const q=S.qw,n=q.m/5+1;const pool=LIB.filter(e=>e.intr=='Y'&&e.pat!='Job-task'&&(q.loc=='Station'||!/Station|Barbell|cable|sled|rower|bike|StepMill|tire|ladder|landmine/i.test(e.eq+e.name)));
 const pats=['Squat','Pull-horizontal','Hinge','Push-horizontal','Carry','Core/anti-rotation','Lunge/single-leg','Push-vertical'];
 const pick=S.qpick=pats.map(p=>pool.find(e=>e.pat==p&&!(S.p=='ryan'&&/low back/i.test(e.avoid)&&e.lvl>3))).filter(Boolean).slice(0,n);
 return `<button class="chip" data-end>‹ Today</button><h2 style="margin-top:10px">⚡ Quick workout</h2><div class="small mut" style="margin-bottom:10px">Pick your time. Every move is call-safe and respects your injury flags.</div>
<div class="big">${[10,15,20].map(m=>`<button class="${q.m==m?'on':''}" data-qm="${m}">${m}<small>minutes</small></button>`).join('')}</div>
<div class="lbl" style="margin-top:14px">Where</div><div class="chips">${['Station','Home','Travel'].map(l=>`<button class="chip ${q.loc==l?'on':''}" data-ql="${l}">${l}</button>`).join('')}</div>
<div class="card" style="margin-top:12px"><div class="lbl">${q.m}-min circuit · ${q.m==10?'2':q.m==15?'3':'4'} rounds · auto focus</div>${pick.map(e=>`<div class="ex" data-id="${e.id}"><div class="n"><b>${e.name}</b><span class="small mut">${e.tps} · ${e.eq}</span></div><span>›</span></div>`).join('')}
<button class="btn" data-qstart>▶ Start ${q.m}-min workout</button></div>${ffCard()}`}
// ===== Shift schedule. EDIT PATTERNS HERE: 1 = on shift (24 h), 0 = off. One entry per day in the cycle. =====
const PATTERNS={
 '48/96':{d:[1,1,0,0,0,0],note:'48 on, 96 off · 6-day cycle'},
 '24/72':{d:[1,0,0,0],note:'24 on, 72 off · 4-day cycle'},
 'Kelly':{d:[1,0,1,0,1,0,0,0,0],note:'on-off-on-off-on-off-off-off-off · 9-day cycle',plat:true},
 'Modified Kelly':{d:[1,0,1,0,1,0,0,0,0],note:'24 on, 24 off, 24 on, 24 off, 24 on, 96 off · 9-day cycle',plat:true},
 '24/48':{d:[1,0,0],note:'24 on, 48 off · 3-day cycle'},
 'Custom':{d:null,note:'Tap days to set your own cycle'}};
const PLAT_OFFSET={A:0,B:3,C:6}; // days each platoon is shifted from A (Kelly-type patterns)
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const SCH=Object.assign({rot:'48/96',start:'2026-10-05',plat:'A',custom:[1,1,0,0,0,0]},JSON.parse(localStorage.ffSched||'{}'));
const saveSch=()=>localStorage.ffSched=JSON.stringify(SCH);
const cyc=()=>SCH.rot=='Custom'?SCH.custom:PATTERNS[SCH.rot].d;
function onShift(date){const c=cyc(),st=new Date(SCH.start+'T00:00');const dd=Math.round((new Date(iso(date)+'T00:00')-st)/864e5)-(PATTERNS[SCH.rot].plat?PLAT_OFFSET[SCH.plat]:0);return !!c[((dd%c.length)+c.length)%c.length]}
function dayMode(date){const on=onShift(date),y=new Date(date);y.setDate(y.getDate()-1);return on?'on':onShift(y)?'post':'off'}
const patStr=c=>c.map(x=>x?'<b style="color:#ffb48a">ON</b>':'<span class="mut">off</span>').join(' · ');
function scheduleSheet(after){const draw=()=>{const P2=PATTERNS[SCH.rot],c=cyc();
 s.innerHTML=`<div class="grab" data-close></div><h2>Your shift schedule</h2><div class="lbl">Rotation</div>
 <div class="chips">${Object.keys(PATTERNS).map(k=>`<button class="chip ${SCH.rot==k?'on':''}" data-rot="${k}">${k}</button>`).join('')}</div>
 <div class="lbl" style="margin-top:12px">First shift day (start of cycle)</div><input type="date" id="sd" value="${SCH.start}" style="width:100%;padding:11px;border-radius:10px;border:1px solid var(--line);background:#26262a;color:var(--tx);font-size:16px">
 ${P2.plat?`<div class="lbl" style="margin-top:12px">Platoon / shift</div><div class="chips">${['A','B','C'].map(k=>`<button class="chip ${SCH.plat==k?'on':''}" data-plat="${k}">${k} shift</button>`).join('')}</div><div class="small mut">B starts 3 days after A, C 6 days after A.</div>`:''}
 <div class="card" style="margin-top:12px"><div class="lbl">Pattern · ${P2.note}</div>${SCH.rot=='Custom'?`<div class="chips">${c.map((x,i)=>`<button class="chip ${x?'on':''}" data-cd="${i}">D${i+1} ${x?'ON':'off'}</button>`).join('')}</div><div class="row" style="margin-top:8px"><button class="btn sec" data-cl="-1">− Day</button><button class="btn sec" data-cl="1">+ Day</button></div>`:`<div class="small">${patStr(c)}</div>`}
 <div class="lbl" style="margin-top:10px">Next 14 days</div><div class="small">${[...Array(14)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()+i);return `<span style="display:inline-block;width:13%;text-align:center;margin:2px 0;padding:3px 0;border-radius:6px;background:${onShift(d)?'#5a1f0b':'#222'}">${d.getMonth()+1}/${d.getDate()}</span>`}).join(' ')}</div></div>
 <button class="btn" data-save>Save schedule</button>`;
 s.querySelectorAll('[data-rot]').forEach(b=>b.onclick=()=>{SCH.rot=b.dataset.rot;draw()});
 s.querySelectorAll('[data-plat]').forEach(b=>b.onclick=()=>{SCH.plat=b.dataset.plat;draw()});
 s.querySelectorAll('[data-cd]').forEach(b=>b.onclick=()=>{SCH.custom[+b.dataset.cd]^=1;draw()});
 s.querySelectorAll('[data-cl]').forEach(b=>b.onclick=()=>{if(+b.dataset.cl>0&&SCH.custom.length<28)SCH.custom.push(0);else if(+b.dataset.cl<0&&SCH.custom.length>2)SCH.custom.pop();draw()});
 s.querySelector('#sd').onchange=e=>{if(e.target.value){SCH.start=e.target.value;draw()}};
 s.querySelector('[data-close]').onclick=()=>{bg.remove();s.remove()};
 s.querySelector('[data-save]').onclick=()=>{saveSch();bg.remove();s.remove();toast(after?'Plan built ✓ (example)':'Schedule saved ✓');render()}};
 const s=sheet('');const all=document.querySelectorAll('.sheet-bg'),bg=all[all.length-1];draw()}
function cal(){const now=new Date(),Y=now.getFullYear(),Mo=now.getMonth();const sel=S.selDay;const r=S.p=='ryan';
 let g=['S','M','T','W','T','F','S'].map(x=>`<div class="h">${x}</div>`).join('')+'<div></div>'.repeat(new Date(Y,Mo,1).getDay());
 const nd=new Date(Y,Mo+1,0).getDate();for(let d=1;d<=nd;d++)g+=`<div data-day="${d}" class="${onShift(new Date(Y,Mo,d))?'on':''} ${d==sel?'sel':''}" ${d==now.getDate()?'style="text-decoration:underline"':''}>${d}</div>`;
 const m=dayMode(new Date(Y,Mo,sel));
 const txt=r?(m=='on'?'On shift · call-proof chunks at the station':m=='post'?'Off · post-shift recovery check-in first':'Off · home strength or partner workout'):(m=='on'?'Solo-parenting mode (Ryan on shift) · nap-window session':m=='post'?'Ryan home at 0800 · full "me time" session':'Partner home · conditioning or partner workout');
 return `<h2>${now.toLocaleString('en-US',{month:'long'})} ${Y}</h2><div class="small mut" style="margin-bottom:8px">${SCH.rot}${PATTERNS[SCH.rot].plat?' · '+SCH.plat+' shift':''} · <span style="color:#ffb48a">■</span> ${r?'on shift':'Ryan on shift'}</div>
<div class="card"><div class="cal">${g}</div></div><div class="card"><div class="lbl">${now.toLocaleString('en-US',{month:'short'})} ${sel}</div><h3>${txt}</h3><div class="small mut">The plan follows the rotation automatically — no manual on/off-shift toggle.</div></div>
<div class="card"><div class="lbl">Pattern · ${PATTERNS[SCH.rot].note}</div><div class="small">${patStr(cyc())}</div><div class="small mut" style="margin-top:6px">First shift day: ${SCH.start}</div>
<button class="btn" data-sched>✎ Edit schedule</button><div class="small mut" style="margin-top:6px">Calendar import <span class="planned">PLANNED</span></div></div>`}
function crew(){const r=S.p=='ryan';const rows=r?[['Ryan (you)',412],['Capt. M.',388],['Engineer D.',351],['FF Torres',322],['FF Lee',290]]:[['Jess (you)',268],['Amanda',251],['Kristen',240],['Maria',212]];
 const mx=rows[0][1];return `<h2>${r?'Engine crew · B shift':'Fire spouse crew'}</h2><div class="small mut" style="margin-bottom:8px">Ranked by effort points (scaled to age, size &amp; readiness) so everyone can compete. <span class="example">EXAMPLE DATA</span></div>
<div class="card"><div class="lbl">This week</div>${rows.sort((a,b)=>b[1]-a[1]).map((x,i)=>`<div class="lb"><span class="rk">${i+1}</span><span class="av">${x[0][0]}</span><div style="flex:1"><b>${x[0]}</b><div class="bar"><i style="width:${x[1]/mx*100}%"></i></div></div><b>${x[1]}</b></div>`).join('')}</div>
<div class="card"><div class="lbl">Challenge · ends Sunday</div><h3>${r?'Hose-drag ladder · 10 rounds for time':'30 days of 15 minutes'}</h3><div class="small mut">${r?'Crew scenario evolution: drag, carry, dummy drag. Low-back flags get the sled-push swap automatically.':'Log any 15-min session. Nap windows count.'}</div><button class="btn" data-join>Join challenge</button></div>
<div class="card"><div class="lbl">Calories from wearables <span class="planned">PLANNED</span></div><div class="small mut">Apple Watch, Garmin, WHOOP, Fitbit and HR straps will feed calories and strain into the board.</div></div>`}
function fam(){if(S.p=='ryan')return `<h2>Jess's week</h2><div class="small mut" style="margin-bottom:8px">Her plan switches automatically with your shifts. <span class="example">EXAMPLE DATA</span></div>
<div class="card"><div class="lbl">Today · you're on shift</div><h3>Solo-parenting mode</h3><div class="small mut">20-min nap-window circuit at 1:00 PM</div></div>
<div class="card"><div class="lbl">Fri · shared day off</div><h3>Partner workout 💪</h3><div class="small mut">Med ball passes, partner carries, you-go-I-go intervals. Kids in the garage with chalk.</div><button class="btn sec" data-toast="Added to both calendars (example)">Add to both calendars</button></div>
<div class="card"><div class="lbl">Days-off balance</div><div class="small">Your shift was heavy on legs &amp; carries (hose drags, stairs) → your days off lean upper body &amp; mobility.</div></div>`;
return `<h2>Kids-friendly sessions</h2><div class="small mut" style="margin-bottom:8px">Built for solo-parenting days. <span class="example">EXAMPLE DATA</span></div>
${[['Nap window · 20 min','Quiet, no jumping: goblet squat, rows, RDL, plank.'],['Living room with the kids · 15 min','Kids join in: bear crawls, "lift the kid" squats, animal walks.'],['Stroller &amp; playground · 25 min','Brisk stroller walk, bench step-ups, push-ups at the slide.'],['After bedtime · 12 min','Low-light, low-noise: dead bugs, bridges, band rows.']].map(([a,b])=>`<div class="card"><h3>${a}</h3><div class="small mut">${b}</div><button class="btn sec" data-go="quick">Start</button></div>`).join('')}
<div class="card"><div class="lbl">Fri · shared day off</div><h3>Partner workout with Ryan 💪</h3></div>`}
function coach(){return `<div class="hero"><img src="img/nick.jpg" alt="Nick McDonald in turnouts"><div class="ov"><span class="badge">★ Super Bowl XLV Champion</span><h2 style="margin:6px 0 0">Nick McDonald</h2><div class="small">Firefighter Paramedic, Southern California</div></div></div>
<div class="card"><div class="lbl">About Coach Nick</div><div class="bio">
<p>Coach Nick McDonald played college football at Grand Valley State, wearing #77, then went on to an NFL career with the Green Bay Packers, New England Patriots, and Cleveland Browns. With the Packers, he won Super Bowl XLV.</p>
<p>Nick is also a military veteran of the [Branch]. Today he serves as a Firefighter Paramedic in Southern California. He's a Structure Collapse Specialist, Rope Rescue Technician, Trench Rescue Technician, and Confined Space Technician, and an AHA ACLS &amp; BLS Instructor.</p>
<p>Nick is a husband and dad of three with a busy schedule, and he has trained through multiple injuries, including [Injuries]. He built this app for people like that: firefighters and fire families with busy schedules.</p></div></div>
<div class="card"><div class="lbl">Career timeline</div><div class="tl">
<div><b>College football</b><span>Grand Valley State · #77</span></div>
<div><b>NFL · Green Bay Packers</b><span>#67 · Super Bowl XLV Champion</span></div>
<div><b>NFL · New England Patriots</b><span>#65</span></div>
<div><b>NFL · Cleveland Browns</b><span>[#]</span></div>
<div><b>Military</b><span>Veteran · [Branch]</span></div>
<div><b>Fire service</b><span>Firefighter Paramedic · Southern California</span></div>
</div></div>
<div class="card"><div class="lbl">Credentials</div>${['Firefighter Paramedic','Structure Collapse Specialist','Rope Rescue Technician','Trench Rescue Technician','Confined Space Technician','AHA ACLS &amp; BLS Instructor'].map(c=>`<span class="cred">${c}</span>`).join('')}</div>
<div class="card"><div class="lbl">Photo strip</div><div class="small mut">GVSU → Packers → Patriots → Browns → Military → Fire service. NFL photos held back until usage rights are confirmed.</div></div>
<button class="btn sec" data-onb>Replay onboarding</button>`}
function strain(){return `<button class="chip" data-end>‹ Today</button><h2 style="margin-top:10px">Wearable strain <span class="planned">PLANNED</span></h2><div class="small mut">Mockup of a future WHOOP / smartwatch / Fitbit integration. <span class="example">EXAMPLE DATA</span></div>
<div class="card" style="text-align:center"><div class="lbl">Shift strain so far</div><div class="timer" style="color:var(--r)">16.8</div><div class="small mut">Structure fire 0214 · 47 min at 160+ bpm</div></div>
<div class="banner"><b>Recommendation: swap to recovery.</b><br>That call was your workout. Tonight: mobility + breathing, 10 min.</div>
<button class="btn" data-toast="Swapped to recovery (example)">Accept swap</button><button class="btn sec" data-end>Keep my plan</button>`}
function dispatch(){return `<button class="chip" data-end>‹ Today</button><h2 style="margin-top:10px">Dispatch link <span class="planned">PLANNED</span></h2><div class="small mut">Future link to a station alerting / dispatch app. When tones drop, the workout pauses itself. <span class="example">EXAMPLE</span></div>
<div class="banner" style="font-size:15px"><b>📟 E-12 dispatched · Medical aid</b><br>Workout auto-paused at 08:42. Finished chunks saved.</div>
<button class="btn" data-go="session" data-simpause>Simulate: tones drop during a workout</button>`}
function onboarding(){let st=0;const a={track:'Firefighter',rot:'48/96',eq:['Station gym'],inj:[],goal:'Job-ready strength'};
 const steps=[['Who are you training?','track',['Firefighter','Fire spouse']],['Equipment','eq',['Station gym','Home dumbbells','Bands','Bodyweight only']],['Any injury flags?','inj',['Low back','Shoulder','Knee','Hip','No overhead','None']],['Main goal','goal',['Job-ready strength','Academy prep','Longevity','Energy & strength','Lose fat']]];
 const s=sheet('');const draw=()=>{const[q,k,o]=steps[st];const multi=Array.isArray(a[k]);
 s.innerHTML=`<div class="grab"></div><div class="steps">${steps.map((_,i)=>`<i class="${i<=st?'on':''}"></i>`).join('')}</div>${st==0?'<div class="lbl">Welcome to [App Name]</div>':''}<h2>${q}</h2>
 <div class="chips">${o.map(x=>`<button class="chip ${(multi?a[k].includes(x):a[k]==x)?'on':''}" data-o="${x}">${x}</button>`).join('')}</div>
 ${k=='inj'?'<p class="small mut">Flag it once — every workout routes around it using swaps from the library. Not medical advice.</p>':''}
 <button class="btn" data-n>${st==steps.length-1?"Build my plan":'Next'}</button>`;
 s.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const v=b.dataset.o;if(multi){a[k]=a[k].includes(v)?a[k].filter(x=>x!=v):[...a[k],v]}else a[k]=v;draw()});
 s.querySelector('[data-n]').onclick=()=>{if(st<steps.length-1){st++;draw()}else{localStorage.ffOnb=1;S.p=a.track=='Fire spouse'?'jess':'ryan';persona();document.querySelector('.sheet-bg').click();render();scheduleSheet(true)}}};draw()}
function persona(){document.querySelectorAll('.persona button').forEach(b=>b.classList.toggle('on',b.dataset.p==S.p))}
function bind(){const q=(s,f)=>M.querySelectorAll(s).forEach(e=>e.onclick=()=>f(e));
 M.querySelectorAll('[data-ck]').forEach(r=>{r.oninput=()=>{S.ck[r.dataset.ck]=+r.value;r.previousElementSibling.lastElementChild.textContent=r.value+(r.dataset.ck=='feel'?'/5':r.dataset.ck=='sleep'?' h':'');setTier()};r.onchange=()=>{const y=M.scrollTop;render();M.scrollTop=y}});
 q('[data-tough]',()=>{S.ck.tough=!S.ck.tough;const y=M.scrollTop;render();M.scrollTop=y});
 q('[data-mins]',e=>{S.ck.mins=+e.dataset.mins;const y=M.scrollTop;render();M.scrollTop=y});
 q('[data-go]',e=>{if(e.dataset.go=='session'){S.sess=null;if(e.hasAttribute('data-simpause')){S.tab='session';render();S.sess.paused=true;stopTimer();render();return}}S.tab=e.dataset.go;render()});
 q('[data-end]',()=>{S.sess=null;go('today')});
 M.querySelectorAll('.ex[data-i]').forEach(r=>r.onclick=ev=>{const i=+r.dataset.i,[id]=plan().x[i];const act=ev.target.closest('[data-act]')?.dataset.act||'detail';const m=S.mods[S.p+i];
  if(act=='done'){S.done[S.p+i]=!S.done[S.p+i]}else if(act=='detail'){return detailSheet(m&&m.k=='swap'?m.id:id)}else if(act=='swap'){return swapSheet(i,id)}
  else{S.mods[S.p+i]=m&&m.k==act?null:{k:act};toast((act=='easy'?'Easier: ':'Harder: ')+first(L[id][act]))}const y=M.scrollTop;render();M.scrollTop=y});
 q('.ex[data-id]',e=>detailSheet(e.dataset.id));
 q('[data-pause]',()=>{S.sess.paused=true;stopTimer();render()});
 q('[data-resume]',()=>{S.sess.paused=false;S.sess.replan=false;render()});
 q('[data-replan]',()=>{S.sess.replan=true;render()});
 q('[data-rp]',e=>{const s=S.sess,v=e.dataset.rp,n=(s.x||plan().x).length;s.paused=false;s.replan=false;if(v=='bank')s.cur=n;else if(v=='core')s.cur=n-1;toast(v=='bank'?'Banked — partial credit saved':'Re-planned ✓');render()});
 q('[data-next]',()=>{S.sess.cur++;if(S.sess.cur>=(S.sess.x||plan().x).length)stopTimer();render()});
 q('[data-qm]',e=>{S.qw.m=+e.dataset.qm;render()});q('[data-ql]',e=>{S.qw.loc=e.dataset.ql;render()});
 q('[data-qstart]',()=>{S.sess={el:0,cur:0,paused:false,x:S.qpick.map(e=>[e.id,e.tps+' · '+(S.qw.m/5-1)+' rounds']),t:'⚡ '+S.qw.m+'-min quick workout'};S.tab='session';render()});
 q('[data-day]',e=>{S.selDay=+e.dataset.day;render()});q('[data-sched]',()=>scheduleSheet());
 q('[data-ffm]',e=>{S.ff.mode=e.dataset.ffm;render()});q('[data-ffl]',e=>{S.ff.m=+e.dataset.ffl;render()});
 q('[data-ffstart]',()=>{const f=ffBuild();S.sess={el:0,cur:0,paused:false,x:f.x.map(e=>[e.id,f.dose(e)]),t:'🚒 FF Skills · '+S.ff.mode+' · '+S.ff.m+' min'};S.tab='session';render()});
 q('[data-join]',()=>toast('Joined (example)'));q('[data-toast]',e=>toast(e.dataset.toast));q('[data-onb]',onboarding)}
$('#nav').onclick=e=>{const b=e.target.closest('[data-tab]');if(b)go(b.dataset.tab)};
document.querySelectorAll('.persona button').forEach(b=>b.onclick=()=>{S.p=b.dataset.p;persona();if(S.tab=='session')S.sess=null,stopTimer(),S.tab='today';render()});
render();if(!localStorage.ffOnb&&!location.hash.includes('skip'))onboarding();
if('serviceWorker'in navigator&&location.protocol=='https:')navigator.serviceWorker.register('sw.js');
