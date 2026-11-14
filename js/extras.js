"use strict";
// Shared: live date chip in the header. Planner only: Today card, task search, backup, and the course transcript.
// User text only reaches the page through textContent.
(()=>{
const $=id=>document.getElementById(id);
const mk=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n};
const pad=n=>String(n).padStart(2,"0"),iso=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const fmt=(o,d)=>new Intl.DateTimeFormat(undefined,o).format(d||new Date());
const uid=()=>crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);
const save=(a,name,type)=>{const l=mk("a");l.href=URL.createObjectURL(new Blob([a],{type}));l.download=name;l.click();setTimeout(()=>URL.revokeObjectURL(l.href),1000)};
const TK="planner.tasks",CK="planner.courses",GP={A:5,B:4,C:3,D:2,E:1,F:0};
// Home: role words roll up and the next one slides in; the box resizes to each word so "I am a ..." never has a gap.
const rl=document.querySelector(".hero .roll-in");
if(rl){const box=rl.parentElement,w=[...rl.children],n=w.length;
  const fit=k=>{box.style.width=w[k%n].offsetWidth+"px"};
  fit(0);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>fit(0));
  if(!matchMedia("(prefers-reduced-motion:reduce)").matches){rl.append(w[0].cloneNode(true));let i=0;
    const go=()=>{i++;rl.style.transition="transform .6s cubic-bezier(.7,0,.2,1)";rl.style.transform="translateY(-"+i*100/(n+1)+"%)";fit(i);
      if(i===n)setTimeout(()=>{rl.style.transition="none";rl.style.transform="translateY(0)";i=0},650)};
    setInterval(go,2400)}}
const hi=h=>h<12?"Good morning":h<17?"Good afternoon":"Good evening";
function tick(){const d=new Date();
  if($("td-dow")){$("td-dow").textContent=fmt({weekday:"long"},d);$("td-date").textContent=fmt({day:"numeric",month:"long",year:"numeric"},d);$("td-week").textContent=hi(d.getHours());$("td-time").textContent=fmt({hour:"2-digit",minute:"2-digit",second:"2-digit"},d)}}
tick();setInterval(tick,1000);
const read=k=>{try{const a=JSON.parse(localStorage.getItem(k)||"[]");return Array.isArray(a)?a:[]}catch{return[]}};
function strip(){const w=$("td-wk");if(!w)return;const n=new Date(),m=new Date(n.getFullYear(),n.getMonth(),n.getDate()-((n.getDay()+6)%7)),o=read(TK).filter(t=>t&&!t.done&&t.due);
  w.replaceChildren();
  for(let i=0;i<7;i++){const d=new Date(m.getFullYear(),m.getMonth(),m.getDate()+i),k=iso(d),c=o.filter(t=>t.due===k).length,li=mk("li",k===iso(n)?"now":"");
    li.setAttribute("aria-label",fmt({weekday:"long",day:"numeric",month:"long"},d)+(c?", "+c+(c===1?" task":" tasks")+" due":""));
    li.append(mk("span","",fmt({weekday:"short"},d)),mk("b","",d.getDate()),mk("i","",c?String(c):""));w.append(li)}}
function due(){strip();const el=$("td-due");if(!el)return;const td=iso(new Date()),o=read(TK).filter(t=>t&&!t.done),a=o.filter(t=>t.due===td).length,b=o.filter(t=>t.due&&t.due<td).length;
  el.textContent=o.length?a+(a===1?" task is":" tasks are")+" due today"+(b?", and "+b+(b===1?" is":" are")+" overdue.":"."):"No open tasks. Add one below to start planning your week."}
const list=$("t-list");
if(list){
  const q=$("t-q"),run=()=>{const v=q.value.trim().toLowerCase();list.querySelectorAll(".task").forEach(li=>{li.hidden=!!v&&!li.textContent.toLowerCase().includes(v)})};
  q.addEventListener("input",run);
  addEventListener("keydown",e=>{if(e.key==="/"&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();q.focus()}});
  new MutationObserver(()=>{run();due()}).observe(list,{childList:true});due();setInterval(due,60000);
  $("t-export").addEventListener("click",()=>save(JSON.stringify({tasks:read(TK),courses:read(CK)},null,2),"planner-backup-"+iso(new Date())+".json","application/json"));
  $("t-importb").addEventListener("click",()=>$("t-import").click());
  $("t-import").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;
    f.text().then(s=>{const j=JSON.parse(s);if(!Array.isArray(j.tasks)||!Array.isArray(j.courses))throw 0;localStorage.setItem(TK,JSON.stringify(j.tasks));localStorage.setItem(CK,JSON.stringify(j.courses));location.reload()})
     .catch(()=>{$("t-note").textContent="That file is not a planner backup. Choose a file exported from this page."})});
}
// ---- Transcript: courses, credit units, grade points on the 5.0 scale (A=5 ... F=0) ----
const cf=$("c-form");if(!cf)return;
const ok=c=>c&&typeof c.id==="string"&&typeof c.code==="string"&&c.code.length<=12&&typeof c.title==="string"&&c.title.length<=80&&Number.isInteger(c.units)&&c.units>=1&&c.units<=12&&Object.hasOwn(GP,c.grade)&&typeof c.term==="string"&&c.term.length<=30;
let cs=read(CK).filter(ok);
const sv=()=>{try{localStorage.setItem(CK,JSON.stringify(cs))}catch{$("c-err").textContent="Browser storage is blocked, so the transcript will not survive a refresh."}};
const cls=g=>g>=4.5?"First Class":g>=3.5?"Second Class Upper":g>=2.4?"Second Class Lower":g>=1.5?"Third Class":g>=1?"Pass":"Fail";
function drawC(){
  const body=$("c-body");body.replaceChildren();
  cs.forEach(c=>{const tr=mk("tr");[c.term,c.code,c.title,c.units,c.grade,GP[c.grade]*c.units].forEach(v=>tr.append(mk("td","",v)));
    const td=mk("td","noprint"),b=mk("button","btn sm","Remove");b.type="button";b.setAttribute("aria-label","Remove "+c.code);
    b.addEventListener("click",()=>{cs=cs.filter(x=>x.id!==c.id);sv();drawC()});td.append(b);tr.append(td);body.append(tr)});
  if(!cs.length){const tr=mk("tr"),td=mk("td","empty","No courses yet. Add a result to start your transcript.");td.colSpan=7;tr.append(td);body.append(tr)}
  const u=cs.reduce((s,c)=>s+c.units,0),p=cs.reduce((s,c)=>s+GP[c.grade]*c.units,0),g=u?p/u:0;
  $("c-units").textContent=u;$("c-qp").textContent=p;$("c-gpa").textContent=u?g.toFixed(2):"–";$("c-class").textContent=u?cls(g):"–";
  $("c-print").disabled=$("c-csv").disabled=!cs.length;
}
cf.addEventListener("submit",e=>{e.preventDefault();
  const code=$("c-code").value.trim().toUpperCase(),title=$("c-name").value.trim(),units=parseInt($("c-uin").value,10),grade=$("c-grade").value,term=$("c-term").value.trim()||"Unassigned",er=$("c-err");
  if(!code||!title||!(units>=1&&units<=12)){er.textContent="Enter a course code, a title and credit units from 1 to 12.";return}
  if(cs.some(c=>c.code===code&&c.term===term)){er.textContent=code+" is already in "+term+". Remove it first to change the result.";return}
  er.textContent="";cs.push({id:uid(),code,title,units,grade,term});cs.sort((a,b)=>a.term<b.term?-1:a.term>b.term?1:a.code<b.code?-1:1);
  sv();cf.reset();drawC();$("c-code").focus()});
$("c-print").addEventListener("click",()=>{$("c-gen").textContent="Generated on "+fmt({dateStyle:"long"});document.body.classList.add("pt");print()});
addEventListener("afterprint",()=>document.body.classList.remove("pt"));
$("c-csv").addEventListener("click",()=>{const q=s=>{s=String(s);return '"'+(/^[=+\-@]/.test(s)?"'"+s:s).replace(/"/g,'""')+'"'};
  save([["Term","Code","Title","Units","Grade","Points"],...cs.map(c=>[c.term,c.code,c.title,c.units,c.grade,GP[c.grade]*c.units])].map(r=>r.map(q).join(",")).join("\r\n"),"transcript-"+iso(new Date())+".csv","text/csv")});
drawC();
})();

// Home: highlight numbers count up once, the first time they scroll into view.
(()=>{const els=[...document.querySelectorAll("[data-count]")];if(!els.length)return;
  const show=(e,v)=>{e.textContent=v+(e.dataset.suffix||"")};
  if(matchMedia("(prefers-reduced-motion:reduce)").matches||!("IntersectionObserver"in window)){els.forEach(e=>show(e,e.dataset.count));return}
  els.forEach(e=>show(e,0));
  const io=new IntersectionObserver(list=>list.forEach(en=>{if(!en.isIntersecting)return;io.unobserve(en.target);
    const e=en.target,end=+e.dataset.count,t0=performance.now(),dur=1100;
    const step=t=>{const p=Math.min((t-t0)/dur,1);show(e,Math.round(end*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(step)};
    requestAnimationFrame(step)}),{threshold:.4});
  els.forEach(e=>io.observe(e))})();
