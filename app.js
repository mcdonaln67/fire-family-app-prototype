const L=Object.fromEntries(LIB.map(e=>[e.id,e]));
const $=s=>document.querySelector(s), M=$('#main');
const S={p:'ryan',tab:'today',ck:{feel:4,sleep:7,calls:2,tough:false,mins:30},mods:{},done:{},sess:null,qw:{m:15,loc:'Station'},selDay:12};
const P={
ryan:{name:'Ryan',role:'Engine FF · 48/96 · low-back history flag',ctx:'On shift · hour 4 of 48 · Station gym',
 plans:{g:{t:'Call-proof chunks · strength + job task',d:'3 chunks of ~10 min. Stop anytime a call drops; finished chunks count.',x:[['JT03','3 × 30 m'],['SQ02','3 × 8'],['PL01','3 × 10/side'],['CA02','2 × 30 m/side'],['CO01','3 × 30 s']]},
  y:{t:'Reduced chunks · no max efforts',d:'Volume down ~25%. Low-back flag: drag swapped for sled push.',x:[['JT05','2 × 15 m light'],['SQ01','2 × 8'],['PL03','2 × 15'],['CO03','2 × 8/side'],['MB02','1 × 5/side']]},
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
function plan(){return P[S.p].plans[setTier()]}
function exName(i,id){const m=S.mods[S.p+i];const e=L[id];if(!m)return e.name;if(m.k=='swap')return L[m.id].name;return first(e[m.k=='easy'?'easy':'hard'])}
function exRow(i,id,dose){const m=S.mods[S.p+i],e=L[m&&m.k=='swap'?m.id:id],dn=S.done[S.p+i];
 const tag=m?`<span class="ex-tag" style="background:${m.k=='hard'?'#5a1f0b':'#163a26'}">${m.k=='swap'?'SWAPPED':m.k.toUpperCase()}</span> `:'';
 return `<div class="ex ${dn?'done':''}" data-i="${i}"><div class="chk" data-act="done">${dn?'✓':''}</div><div class="n" data-act="detail"><b>${exName(i,id)}</b><span class="small mut">${tag}${dose} · ${e.id}${e.intr=='Y'?' · call-safe':''}</span></div>
 <div class="acts"><button data-act="swap">Swap</button><button data-act="easy">−</button><button data-act="hard">+</button></div></div>`}
const tabs=()=>[['today','🔥','Today'],['cal','📅','Calendar'],['crew','👥','Crew'],['fam',S.p=='ryan'?'💛':'🧸',S.p=='ryan'?'Spouse':'Kids'],['coach','🧢','Coach']];
function nav(){$('#nav').innerHTML=tabs().map(([k,i,n])=>`<button data-tab="${k}" class="${S.tab==k?'on':''}"><span>${i}</span>${n}</button>`).join('')}
function go(t){S.tab=t;stopTimer();render()}
function render(){nav();const f={today,cal,crew,fam,coach,session,quick,strain,dispatch}[S.tab];M.innerHTML=`<div class="view">${f()}</div>`;M.scrollTop=0;bind()}
function today(){const p=plan(),t=tierOf(S.ck),c=S.ck,pr=P[S.p];
return `<div class="small mut">${pr.ctx} <span class="example">EXAMPLE DATA</span></div><h2>Morning, ${pr.name}</h2>
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
<div class="row"><button class="btn sec" data-go="quick">⚡ Quick workout</button></div>
<div class="row"><button class="btn sec" data-go="strain">⌚ Wearable strain <span class="planned">PLANNED</span></button><button class="btn sec" data-go="dispatch">📟 Dispatch <span class="planned">PLANNED</span></button></div>
<p class="small mut" style="margin-top:14px">Prototype with example data. General fitness guidance, not medical advice.</p>`}
let T=null;
function stopTimer(){clearInterval(T);T=null}
function fmt(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
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
function swapSheet(i,id){const e=L[id],alts=LIB.filter(x=>x.pat==e.pat&&x.id!=id);
 const s=sheet(`<h2>Swap ${e.name}</h2><div class="small mut" style="margin-bottom:8px">Same movement pattern (${e.pat}) from Nick's library. Injury swap: ${e.inj}</div>
 ${alts.map(a=>`<div class="ex" data-pick="${a.id}"><div class="n"><b>${a.name}</b><span class="small mut">${a.eq} · Level ${a.lvl}${a.intr=='Y'?' · call-safe':''}</span></div><span>›</span></div>`).join('')}
 <button class="btn sec" data-close>Cancel</button>`);
 s.querySelectorAll('[data-pick]').forEach(x=>x.onclick=()=>{S.mods[S.p+i]={k:'swap',id:x.dataset.pick};document.querySelector('.sheet-bg').click();toast('Swapped to '+L[x.dataset.pick].name);render()})}
function quick(){const q=S.qw,n=q.m/5+1;const pool=LIB.filter(e=>e.intr=='Y'&&(q.loc=='Station'||!/Station|Barbell|cable|sled|rower|bike|StepMill|tire|ladder|landmine/i.test(e.eq+e.name)));
 const pats=['Squat','Pull-horizontal','Hinge','Push-horizontal','Carry','Core/anti-rotation','Job-task','Lunge/single-leg'];
 const pick=S.qpick=pats.map(p=>pool.find(e=>e.pat==p&&!(S.p=='ryan'&&/low back/i.test(e.avoid)&&e.lvl>3))).filter(Boolean).slice(0,n);
 return `<button class="chip" data-end>‹ Today</button><h2 style="margin-top:10px">⚡ Quick workout</h2><div class="small mut" style="margin-bottom:10px">Pick your time. Every move is call-safe and respects your injury flags.</div>
<div class="big">${[10,15,20].map(m=>`<button class="${q.m==m?'on':''}" data-qm="${m}">${m}<small>minutes</small></button>`).join('')}</div>
<div class="lbl" style="margin-top:14px">Where</div><div class="chips">${['Station','Home','Travel'].map(l=>`<button class="chip ${q.loc==l?'on':''}" data-ql="${l}">${l}</button>`).join('')}</div>
<div class="card" style="margin-top:12px"><div class="lbl">${q.m}-min circuit · ${q.m==10?'2':q.m==15?'3':'4'} rounds · auto focus</div>${pick.map(e=>`<div class="ex" data-id="${e.id}"><div class="n"><b>${e.name}</b><span class="small mut">${e.tps} · ${e.eq}</span></div><span>›</span></div>`).join('')}
<button class="btn" data-qstart>▶ Start ${q.m}-min workout</button></div>`}
function cal(){const on=d=>{const x=(d-5+60)%6;return x<2};const sel=S.selDay;let g='<div class="h">S</div><div class="h">M</div><div class="h">T</div><div class="h">W</div><div class="h">T</div><div class="h">F</div><div class="h">S</div><div></div><div></div><div></div><div></div>';
 for(let d=1;d<=31;d++)g+=`<div data-day="${d}" class="${on(d)?'on':''} ${d==sel?'sel':''}">${d}</div>`;
 const isOn=on(sel),post=on(sel-1)&&!isOn;const r=S.p=='ryan';
 const txt=r?(isOn?'On shift · call-proof chunks at the station':post?'Off · post-shift recovery check-in first':'Off · home strength or partner workout'):(isOn?'Solo-parenting mode (Ryan on shift) · nap-window session':post?'Ryan home at 0800 · full "me time" session':'Partner home · conditioning or partner workout');
 return `<h2>October 2026</h2><div class="small mut" style="margin-bottom:8px">48/96 rotation · <span style="color:#ffb48a">■</span> ${r?'on shift':"Ryan on shift"} <span class="example">EXAMPLE</span></div>
<div class="card"><div class="cal">${g}</div></div><div class="card"><div class="lbl">Oct ${sel}</div><h3>${txt}</h3><div class="small mut">The plan follows the rotation automatically — no manual on/off-shift toggle.</div></div>
<div class="card"><div class="lbl">Rotation</div><div class="chips"><button class="chip on">48/96</button><button class="chip">24/48</button><button class="chip">Kelly</button><button class="chip">Import calendar <span class="planned">PLANNED</span></button></div></div>`}
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
<div class="card"><div class="lbl">Career</div><div class="small">Grand Valley State Lakers #77 · Former NFL: Green Bay Packers #67, New England Patriots #65, Cleveland Browns · Military veteran [Branch] · Firefighter Paramedic, Southern California</div></div>
<div class="card"><div class="lbl">Credentials</div>${['Firefighter Paramedic','Structure Collapse Specialist','Rope Rescue Technician','Trench Rescue Technician','Confined Space Technician','AHA ACLS &amp; BLS Instructor'].map(c=>`<span class="cred">${c}</span>`).join('')}</div>
<div class="card"><div class="lbl">Why I built this</div><div class="small" style="line-height:1.5">"Husband and dad of three. Between the fire service and a busy home, I know how hard it is to find time to train, especially while working around injuries. I built this for people like you." — Nick <span class="mut">[draft]</span></div></div>
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
 const steps=[['Who are you training?','track',['Firefighter','Fire spouse']],['Your rotation','rot',['24/48','48/96','Kelly','Other']],['Equipment','eq',['Station gym','Home dumbbells','Bands','Bodyweight only']],['Any injury flags?','inj',['Low back','Shoulder','Knee','Hip','No overhead','None']],['Main goal','goal',['Job-ready strength','Academy prep','Longevity','Energy & strength','Lose fat']]];
 const s=sheet('');const draw=()=>{const[q,k,o]=steps[st];const multi=Array.isArray(a[k]);
 s.innerHTML=`<div class="grab"></div><div class="steps">${steps.map((_,i)=>`<i class="${i<=st?'on':''}"></i>`).join('')}</div>${st==0?'<div class="lbl">Welcome to [App Name]</div>':''}<h2>${q}</h2>
 <div class="chips">${o.map(x=>`<button class="chip ${(multi?a[k].includes(x):a[k]==x)?'on':''}" data-o="${x}">${x}</button>`).join('')}</div>
 ${k=='inj'?'<p class="small mut">Flag it once — every workout routes around it using swaps from the library. Not medical advice.</p>':''}
 <button class="btn" data-n>${st==steps.length-1?"Build my plan":'Next'}</button>`;
 s.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const v=b.dataset.o;if(multi){a[k]=a[k].includes(v)?a[k].filter(x=>x!=v):[...a[k],v]}else a[k]=v;draw()});
 s.querySelector('[data-n]').onclick=()=>{if(st<steps.length-1){st++;draw()}else{localStorage.ffOnb=1;S.p=a.track=='Fire spouse'?'jess':'ryan';persona();document.querySelector('.sheet-bg').click();toast('Plan built ✓ (example)');render()}}};draw()}
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
 q('[data-day]',e=>{S.selDay=+e.dataset.day;render()});
 q('[data-join]',()=>toast('Joined (example)'));q('[data-toast]',e=>toast(e.dataset.toast));q('[data-onb]',onboarding)}
$('#nav').onclick=e=>{const b=e.target.closest('[data-tab]');if(b)go(b.dataset.tab)};
document.querySelectorAll('.persona button').forEach(b=>b.onclick=()=>{S.p=b.dataset.p;persona();if(S.tab=='session')S.sess=null,stopTimer(),S.tab='today';render()});
render();if(!localStorage.ffOnb&&!location.hash.includes('skip'))onboarding();
if('serviceWorker'in navigator&&location.protocol=='https:')navigator.serviceWorker.register('sw.js');
