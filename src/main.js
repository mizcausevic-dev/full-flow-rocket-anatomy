const TOTAL=1020, FPS=30;
const ACTS=[
 {start:0,end:149,title:"Reveal feed lines and pumps",pill:"ACT 1 · FRAMES 0–149 · 0–5s",desc:"Cold propellants leave the vehicle feed system. Separate pumps, separate shafts. The engine starts as plumbing.",body:"Methane and oxygen enter from the vehicle. Gold valves meter the start. Impellers (cyan cross, spinning with frame number) raise the propellants' ability to flow against chamber pressure. Scrub backward and the impeller reverses. Determinism is the point.",cam:"Wide → pumps",scale:"FULL SYSTEM · MACRO VIEW",scaleShort:"Full system",time:"REAL-TIME FLOW (SCHEMATIC)",timeShort:"Real-time schematic",causal:"← Causal chain: vehicle feed → valves (gold) → pumps. Nothing burns yet. The next act only makes sense because pressure is being built here."},
 {start:150,end:299,title:"Both propellants enter each preburner, in different ratios",pill:"ACT 2 · FRAMES 150–299 · 5–10s",desc:"Each stream splits. Most fuel goes to the fuel-rich preburner, most oxidizer to the oxidizer-rich preburner, and a small stream of the other propellant crosses over so each preburner can burn.",body:"This is the act most diagrams rush. A preburner needs both propellants to burn at all. 'Fuel-rich' means the mixture leans toward fuel. 'Oxidizer-rich' leans the other way. The bars are qualitative only: bar length shows emphasis, not a ratio you can quote. Violet marks the state change, the moment cold liquid becomes hot gas.",cam:"Push in → preburners",scale:"SUBSYSTEM · PREBURNERS ENLARGED",scaleShort:"Preburners enlarged",time:"REAL-TIME FLOW (SCHEMATIC)",timeShort:"Real-time schematic",causal:"← Because Act 1 built pump pressure, Act 2 can split the flow. Without pressure, this split is just a drawing of pipes."},
 {start:300,end:509,title:"Trace turbine gases onward to the chamber",pill:"ACT 3 · FRAMES 300–509 · 10–17s",desc:"Hot gas from each preburner spins its turbine, the turbine shaft (gold dashed) drives its pump, and then the same gas keeps going to the main chamber. Follow the gold line. It does not exit the engine.",body:"Trace one gold path with your eye. Preburner gas expands through the turbine, gives up work to the shaft, and continues to the chamber injector. That 'keeps going' is the full-flow idea. In cycles that dump turbine gas, this path would end at an exhaust. Here it ends at the main burn, which is why the causal line from Act 1 still matters.",cam:"Follow gold → chamber",scale:"SUBSYSTEM · HOT-GAS PATH",scaleShort:"Hot-gas path",time:"SLOW MOTION · GAS TRACE",timeShort:"Slow motion trace",causal:"← Act 2's hot gas now does work (turbine, gold) and becomes Act 4's chamber charge. Energy and mass are the same stream."},
 {start:510,end:749,title:"Chamber burn and regenerative cooling",pill:"ACT 4 · FRAMES 510–749 · 17–25s",desc:"Both hot-gas streams inject, mix, and sustain the main burn. At the same time cold fuel runs through wall channels, absorbs heat, and carries that heat back into the combustion it just cooled.",body:"Two stories share one wall. Inside: a sustained burn (not detonation, a continuous flame anchored at the injector). In the wall: coolant channels, enlarged and labeled as a schematic, pick up heat that would otherwise damage the wall and return it as preheated propellant. The inset cross-section is the micro reveal. Scale has changed and the label says so.",cam:"Sectional → wall inset",scale:"MICRO · WALL SECTION ENLARGED",scaleShort:"Wall enlarged (schematic)",time:"SLOW MOTION · BURN + COOLING",timeShort:"Slow motion",causal:"← The gas traced in Act 3 is now the flame. The cooling fuel is Act 1's fuel, taking a detour through the wall before it burns."},
 {start:750,end:1019,title:"Nozzle expansion and the complete system",pill:"ACT 5 · FRAMES 750–1019 · 25–34s",desc:"Hot chamber gas squeezes through the throat, expands down the bell, and leaves faster than it entered. The camera pulls back and holds. The last frames are not a climax effect. They are the whole loop, stable, at once.",body:"Expansion is a trade: pressure for velocity. The plume and its diamond pattern are schematic, not CFD, and labeled as such. From frame ~950 the camera settles to the full-system view and the flows continue at steady state. End on the system, not on the exhaust, because the system is the subject.",cam:"Pull back → full system hold",scale:"FULL SYSTEM · MACRO VIEW (HELD)",scaleShort:"Full system hold",time:"TIME COMPRESSION → STEADY STATE",timeShort:"Steady state hold",causal:"← Act 4's burn supplies the pressure Act 5 spends as velocity. Pull back far enough and all five acts are visible in one frame. That is the final shot."},
];
let frame=0, playing=false, speed=1, lastTs=null, accum=0;
const $=id=>document.getElementById(id);
const els={svg:$("engineSvg"),cam:$("cameraGroup"),scrub:$("scrub"),readout:$("frameReadout"),clock:$("clock"),tc:$("timecode"),pill:$("actPill"),title:$("actTitle"),desc:$("actDesc"),sideT:$("sideActTitle"),sideB:$("sideActBody"),causal:$("causalLine"),scale:$("scaleBadge"),motion:$("motionBadge"),camR:$("camReadout"),scaleR:$("scaleReadout"),timeR:$("timeReadout"),playhead:$("playhead"),track:$("timelineTrack")};
function actFor(f){return ACTS.findIndex(a=>f>=a.start&&f<=a.end)}
function smooth(t){return t*t*(3-2*t)}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function lerp(a,b,t){return a+(b-a)*t}
// Camera keyframes: [frame, x, y, w, h] viewBox targets; interpolate with smoothing between acts
const CAMKEYS=[[0,0,0,900,700],[149,40,120,760,560],[150,180,240,560,420],[299,180,240,560,420],[300,140,260,640,470],[509,220,340,480,360],[510,220,340,480,360],[749,180,300,560,420],[750,120,260,680,500],[900,0,0,900,700],[1019,0,0,900,700]];
function cameraAt(f){
  for(let i=0;i<CAMKEYS.length-1;i++){const [f0,x0,y0,w0,h0]=CAMKEYS[i],[f1,x1,y1,w1,h1]=CAMKEYS[i+1];if(f>=f0&&f<=f1){const t=smooth(clamp((f-f0)/Math.max(1,f1-f0),0,1));return[lerp(x0,x1,t),lerp(y0,y1,t),lerp(w0,w1,t),lerp(h0,h1,t)]}}
  return[0,0,900,700];
}
function setOpacity(id,v){const e=$(id);if(e)e.setAttribute("opacity",v.toFixed(2))}
function render(f){
  frame=clamp(Math.round(f),0,1019);
  const ai=actFor(frame), act=ACTS[ai];
  // camera
  const [vx,vy,vw,vh]=cameraAt(frame); els.svg.setAttribute("viewBox",`${vx} ${vy} ${vw} ${vh}`);
  // flow dash offset deterministic
  document.querySelectorAll(".flow-line").forEach((p,i)=>{p.style.strokeDashoffset=(-frame*(1.2+ (i%3)*0.3)).toFixed(1)});
  // impellers / turbines rotate with frame
  const ang=frame*4%360, ang2=frame*3%360;
  $("fuelImpeller").setAttribute("transform",`rotate(${ang} 145 254)`); $("oxImpeller").setAttribute("transform",`rotate(${-ang} 705 254)`);
  $("fuelTurbine").setAttribute("transform",`rotate(${ang2} 125 488)`); $("oxTurbine").setAttribute("transform",`rotate(${-ang2} 685 488)`);
  // act opacities
  const inAct=(a)=>clamp((frame-a.start)/20,0,1), outAct=(a)=>clamp((a.end-frame)/20,0,1);
  const vis=(a)=>Math.min(inAct(a),outAct(a)>=0?1:1, frame<a.start?0: frame>a.end? clamp((a.end+40-frame)/40,0,1):1);
  // simpler staged visibility
  setOpacity("calloutAct1", frame<170?1:clamp((190-frame)/20,0,1));
  setOpacity("calloutAct2", ai===1?clamp((frame-150)/15,0,1):0);
  setOpacity("ratioInset", ai===1?clamp((frame-165)/20,0,1):0);
  setOpacity("calloutAct4", ai===3?clamp((frame-510)/15,0,1):0);
  setOpacity("regenInset", ai===3?clamp((frame-540)/20,0,1):0);
  // flames
  const pbFlame = ai>=1? .55+.25*Math.sin(frame/5): .15;
  $("fuelPBFlame").setAttribute("opacity",pbFlame); $("fuelPBFlame").setAttribute("r",14+3*Math.sin(frame/4));
  $("oxPBFlame").setAttribute("opacity",pbFlame); $("oxPBFlame").setAttribute("r",14+3*Math.cos(frame/4));
  const burn = ai===3? .75+.2*Math.sin(frame/3) : ai===4? .9 : ai===2? clamp((frame-420)/80,0,.6):0;
  $("chamberFlame").setAttribute("opacity",burn); $("chamberFlame").setAttribute("rx",42+4*Math.sin(frame/3)); 
  setOpacity("plumeGroup", ai===4? clamp((frame-750)/40,0,1):0);
  if($("plume")) $("plume").setAttribute("opacity", .55+.2*Math.sin(frame/4));
  // sensors pulse violet
  document.querySelectorAll(".sensor").forEach((s,i)=>{s.setAttribute("r",5+1.5*Math.sin(frame/6+i))});
  // valves glow in act1
  document.querySelectorAll(".valve").forEach(v=>{v.style.filter= ai===0? "drop-shadow(0 0 6px #FFD166)":"none"});
  // UI
  els.scrub.value=frame; els.readout.textContent=frame;
  els.clock.textContent=`FRAME ${String(frame).padStart(4,"0")} / 1019`; els.tc.textContent=`${(frame/FPS).toFixed(2)}s / 34.00s`;
  els.pill.textContent=act.pill; els.title.textContent=act.title; els.desc.textContent=act.desc;
  els.sideT.textContent=`Act ${ai+1} · ${act.title}`; els.sideB.textContent=act.body; els.causal.textContent=act.causal;
  els.scale.textContent=act.scale; els.motion.textContent=act.time; els.camR.textContent=act.cam; els.scaleR.textContent=act.scaleShort; els.timeR.textContent=act.timeShort;
  const showLabels=$("chkLabels").checked; els.svg.style.setProperty("--labels",showLabels?1:0);
  els.svg.querySelectorAll("text").forEach(t=>t.style.opacity=showLabels?1:.08);
  // timeline
  document.querySelectorAll(".seg").forEach((s,i)=>s.classList.toggle("active",i===ai));
  const pct=frame/1019*100; els.playhead.style.left=`calc(${pct}% - 1px)`;
  $("btnPlay").textContent=playing?"⏸ Pause":"▶ Play"; $("btnPlayTop").textContent=playing?"⏸ Pause":"▶ Play 34s explainer";
}
function loop(ts){
  if(!playing) return;
  if(lastTs==null) lastTs=ts; const dt=(ts-lastTs)/1000; lastTs=ts; accum+=dt*FPS*speed;
  const adv=Math.floor(accum); if(adv>0){accum-=adv; let nf=frame+adv; if(nf>1019){nf=1019; playing=false;} render(nf);}
  if(playing) requestAnimationFrame(loop);
}
function togglePlay(){ if(frame>=1019) render(0); playing=!playing; lastTs=null; accum=0; if(playing) requestAnimationFrame(loop); else render(frame); }
$("btnPlay").onclick=togglePlay; $("btnPlayTop").onclick=()=>{togglePlay(); document.querySelector(".stage-wrap").scrollIntoView({behavior:"smooth"})};
$("btnRestart").onclick=()=>{playing=false; render(0)};
els.scrub.addEventListener("input",e=>{playing=false; render(+e.target.value)});
$("speedSel").onchange=e=>speed=+e.target.value;
document.querySelectorAll(".seg").forEach(s=>s.onclick=()=>{playing=false; render(ACTS[+s.dataset.act].start)});
document.addEventListener("keydown",e=>{if(e.code==="Space"&&e.target===document.body){e.preventDefault();togglePlay()} if(e.key==="ArrowRight")render(frame+1); if(e.key==="ArrowLeft")render(frame-1)});

// Article injection (kept in sync with MEDIUM-ARTICLE-Cursor.md summary)
const ARTICLE = `
<h1>Full-Flow Rocket Engine, Explained in 34 Seconds</h1>
<p><strong>Subtitle:</strong> How a full-flow staged combustion engine feeds every drop of propellant through a preburner and a turbine before it burns, traced in 1,020 code-driven frames with no invented numbers.</p>
<p><em>By Kinetic Gain LLC. Raptor-inspired conceptual model. Not a certified engineering reference. Verify subject-specific details before publication or engineering use.</em></p>
<hr/>
<h2>The one sentence version</h2>
<p>In a full-flow staged combustion engine, <strong>all</strong> of the fuel and <strong>all</strong> of the oxidizer pass through a preburner and a turbine before they reach the main combustion chamber, so the work of driving the pumps is done by propellant that still gets burned for thrust afterward.</p>
<blockquote>Follow the cyan line and you follow mass. Follow the gold line and you follow energy. When they are the same line, you have understood the cycle.</blockquote>
<h2>Why this needed an anatomy explainer, not another cutaway poster</h2>
<p>A cutaway shows you where parts sit. It cannot show you why a small stream of oxygen crosses into a fuel preburner, or why a turbine exhaust in this cycle has somewhere important to go. Those are causal claims, and causal claims need time. Hence 34 seconds, five acts, and a timeline you can scrub backward. If scrubbing backward does not reverse the impeller, the animation is decoration. Here it does, because every visual state is a pure function of one integer: the frame, 0 to 1019 at 30 frames per second.</p>
<h2>Act 1 (0 to 5s): The engine starts as plumbing</h2>
<p>Methane and liquid oxygen arrive from the vehicle. Gold valves open. Two pumps, on <strong>separate shafts, explicitly not coaxial</strong>, begin to turn. Nothing has burned. This act matters because everything later spends the pressure built here. Skip it and the preburners look self-powered. They are not.</p>
<h2>Act 2 (5 to 10s): Two preburners, two opposite leans</h2>
<p>Each propellant stream splits. Most methane heads to a preburner where a little oxygen lets it partially burn into a fuel-rich hot gas. Most oxygen heads to a second preburner where a little methane lets it partially burn into an oxidizer-rich hot gas. The ratio bars in the explainer are qualitative by design. They show emphasis, never a quotable mixture ratio. That restraint is a feature. A conceptual model that invents a number teaches a false memory.</p>
<h2>Act 3 (10 to 17s): The turbine is a toll booth, not an exit</h2>
<p>Each hot-gas stream expands through its turbine. The turbine shaft, drawn as a gold dashed line, drives its pump. Then, and this is the move to trace with your eye, <strong>the same gas continues to the main chamber</strong>. In cycles that dump turbine drive gas overboard, some propellant pays for pumping and never makes thrust. Full-flow refuses that trade. The cost is complexity, two preburners and hot oxidizer-rich gas handling. The benefit claimed here is only the definitional one: the turbine stream remains part of the main burn.</p>
<h2>Act 4 (17 to 25s): A burn, protected by its own fuel</h2>
<p>Both hot-gas streams inject into the main chamber and sustain a continuous burn. Combustion here is not detonation. Detonation is a supersonic shock-coupled event. A rocket chamber is a steady, anchored flame fed continuously, closer to a very violent burner than to an explosion that repeats.</p>
<p>Around that burn, cold fuel travels through channels in the chamber and nozzle wall. It absorbs heat, keeps the wall alive, and arrives at injection preheated. That is regenerative cooling: the coolant is not thrown away, it is the propellant on its way to burn. The wall cross-section inset is enlarged and labeled as a schematic, because honest scale changes must announce themselves.</p>
<h2>Act 5 (25 to 34s): Spend pressure, buy velocity</h2>
<p>Chamber gas chokes at the throat and expands down the bell nozzle. Pressure falls, velocity rises, and the plume, drawn as a labeled schematic rather than a simulation, carries momentum away. The camera then does the most important thing in the piece: it pulls back and holds the complete system steady. Five acts, one loop, visible at once.</p>
<h2>What this explainer deliberately refuses to tell you</h2>
<p>It gives no chamber pressure, no turbopump RPM, no gimbal angle, no thrust figure, and no efficiency claim. Those numbers exist for real engines, but attaching a real engine's number to a conceptual drawing is how plausible misinformation is made. If you need those values, go to primary manufacturer or agency documentation for a specific engine variant and date.</p>
<h2>How it was built</h2>
<p>One deterministic render function. Frame in, picture out. Camera position is an eased interpolation between labeled keyframes (wide, pumps, preburners, hot-gas path, wall section, full-system hold). Flow is a stroke offset driven by frame number. Impeller and turbine angles are arithmetic on frame number. There are no decorative particles and no physics solver pretending to be CFD. Where faithful representation was not possible at this scale, the drawing labels itself a schematic.</p>
<h2>How to reuse this pattern</h2>
<p>Pick any system where a resource does two jobs in sequence: a heat pump, a turbocharger, a regenerative brake, a hospital oxygen concentrator. Keep one accent for mass flow, one for energy or actuation, one for sensing and state change. Give the viewer five acts, a scrub bar, and the discipline to label every scale change. The pattern transfers because the honesty rules transfer.</p>
<hr/>
<p><strong>Tags:</strong> Rocket Science, Aerospace Engineering, SpaceX Raptor, Propulsion, Engineering Visualization, Science Communication</p>
<p><em>Hero image and interactive explainer: see the GitHub Pages deployment linked from the repository. Article and animation are explanatory only and are not flight, test, or handling instructions for any real engine or propellant.</em></p>`;
$("articleBody").innerHTML=ARTICLE;
render(0);
