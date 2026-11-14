"use strict";
// About page: custom audio player.
// Without JavaScript the browser's own audio controls stay visible.
(function(){
  const a=document.getElementById("intro"),pl=document.getElementById("player");
  if(!a||!pl)return;
  const $=id=>document.getElementById(id);
  const play=$("pplay"),seek=$("pseek"),time=$("ptime"),speed=$("pspeed"),mute=$("pmute"),wave=$("wave"),note=$("pnote");
  const N=32,rates=[1,1.25,1.5];let r=0;
  for(let i=0;i<N;i++){
    const b=document.createElement("i"),h=.3+.6*Math.abs(Math.sin(i*.9)*Math.cos(i*.37));
    b.style.setProperty("--h",h.toFixed(2));b.style.setProperty("--p",Math.min(1,h+.35).toFixed(2));
    b.style.setProperty("--d",((i*47%11)/10).toFixed(1)+"s");wave.appendChild(b);
  }
  const bars=[...wave.children];
  const fmt=s=>{s=isFinite(s)?s:0;return Math.floor(s/60)+":"+String(Math.floor(s%60)).padStart(2,"0")};
  function paint(){
    const d=a.duration||0,t=a.currentTime||0,pct=d?Math.min(100,t/d*100):0;
    seek.value=pct;pl.style.setProperty("--pct",pct+"%");
    time.textContent=fmt(t)+" / "+fmt(d);
    seek.setAttribute("aria-valuetext",fmt(t)+" of "+fmt(d));
    bars.forEach((b,i)=>b.classList.toggle("on",(i+.5)/N*100<=pct));
  }
  function fail(){pl.classList.add("bad");play.disabled=true;seek.disabled=true;
    if(note)note.textContent="The audio could not be loaded. Please try again in a moment."}
  const state=on=>{pl.classList.toggle("playing",on);play.setAttribute("aria-label",on?"Pause introduction":"Play introduction")};

  a.controls=false;a.hidden=true;pl.hidden=false;paint();
  play.addEventListener("click",()=>{if(a.paused)a.play().catch(fail);else a.pause()});
  a.addEventListener("play",()=>state(true));
  a.addEventListener("pause",()=>state(false));
  a.addEventListener("ended",()=>{state(false);a.currentTime=0;paint()});
  ["timeupdate","loadedmetadata","durationchange"].forEach(ev=>a.addEventListener(ev,paint));
  a.addEventListener("error",fail);
  seek.addEventListener("input",()=>{if(a.duration){a.currentTime=seek.value/100*a.duration}paint()});
  speed.addEventListener("click",()=>{r=(r+1)%rates.length;a.playbackRate=rates[r];speed.textContent=rates[r]+"×"});
  mute.addEventListener("click",()=>{a.muted=!a.muted;mute.setAttribute("aria-pressed",String(a.muted));mute.textContent=a.muted?"Muted":"Mute"});
})();
