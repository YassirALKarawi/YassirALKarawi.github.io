import {FS,DURATION,CAPACITY,BASELINE,CASES,MODEL_VERSION,PLAYBACK_SCALE,parameters,sourceFor,process,evaluateRepair,sampleAt,parseExperiment,experimentQuery,wavBytes} from './model.mjs';
import {words} from './strings.mjs?v=aligned1';
import {reportHTML} from './report.mjs';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const parsed=parseExperiment(location.search);
let lang=new URL(location.href).searchParams.get('lang');
if(!['ar','en'].includes(lang)){try{lang=localStorage.getItem('dc-language')||'ar'}catch{lang='ar'}if(!['ar','en'].includes(lang))lang='ar'}
const t=key=>words[key][lang==='ar'?0:1], n=(x,d=2)=>Number.isFinite(x)?x.toFixed(d):'∞';
let state={settings:parsed.settings,caseId:parsed.caseId,shared:parsed.shared,measurements:new Set(),choice:'',diagnosed:false,selected:1288,evidence:{},tests:null};
let source,baseline,current,audioContext,audioNode,audioGain,playing=null,playStart=0,frame=0,playToken=0;
let plotStart=null,acquiredEnd=null;
let previousRecord=null;
try{const r=JSON.parse(localStorage.getItem('dc-sound-record-v1')||'null');if(r?.model===MODEL_VERSION&&r?.cases&&typeof r.cases==='object')previousRecord=r}catch{}

function recompute(){source=sourceFor(state.caseId);baseline=process(source,BASELINE);current=process(source,state.settings)}
const metricValues=result=>({snr:result.metrics.snr,overloaded:result.metrics.overloaded,overloadPercent:result.metrics.overloadPercent,lineRate:result.metrics.lineRate,maxInput:result.metrics.maxInput});
function record(){return {model:MODEL_VERSION,createdAt:new Date().toISOString(),sampleRate:FS,sampleCount:source.length,capacity:CAPACITY,overhead:.10,targetDb:35,diagnosis:state.diagnosed?'quantizer-overload':null,measurements:[...state.measurements],cases:state.evidence,current:{caseId:state.caseId,settings:{...state.settings},metrics:metricValues(current)},assumptions:['Synthetic six-note test source','Uniform midpoint quantizer over [-1,1) V','Ideal bit transmission; inverse-gain compensation','Signal-to-error ratio includes clipping and quantization','Capacity constraint does not simulate packet loss','Browser-local practice record, not a certificate']}}
function saveRecord(){const r=record();previousRecord=r;try{localStorage.setItem('dc-sound-record-v1',JSON.stringify(r));return true}catch{return false}}
const icon=(name)=>({play:'<path d="m9 5 11 7-11 7Z"/>',stop:'<rect x="6" y="6" width="12" height="12" rx="2"/>',wave:'<path d="M2 12h3l3-8 4 16 4-12 3 4h3"/>',arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4"/>',link:'<path d="m10 14 4-4m-6 6-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2 1 2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0"/>'}[name]||'');
const svgIcon=name=>`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon(name)}</svg>`;

function render(){
  document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.title=`${t('title')} | Dr. Yassir AL-Ameen`;
  $('#app').innerHTML=`
  <header class="masthead"><a class="brand" href="../?view=course&lang=${lang}"><img class="faculty-photo" src="/assets/yassir-personal.jpg" alt=""><span>${t('studio')}<small dir="ltr">DR. YASSIR AL-AMEEN</small></span></a><div class="head-actions"><a class="back" href="../?view=lecture&lecture=3&lang=${lang}">${t('course')}</a><button data-action="language" class="lang" lang="${lang==='ar'?'en':'ar'}">${t('language')}</button></div></header>
  <main id="main"><section class="intro"><div><p class="eyebrow">${t('eyebrow')}</p><h1>${t('title')}</h1><p class="lede">${t('intro')}</p></div><aside class="mission"><p class="eyebrow">${t('mission')}</p><p>${t('missionText')}</p><div class="targets"><div><b dir="ltr">64 <small>kbit/s</small></b><span>${t('capacity')}</span></div><div><b dir="ltr">≥35 <small>dB</small></b><span>${t('quality')}</span></div><div><b>0</b><span>${t('overload')}</span></div></div></aside></section>
  <div class="lesson-links"><a href="../?view=lecture&lecture=3&lang=${lang}#topic-quantizer">${t('quantizerLesson')}</a><a href="../?view=lecture&lecture=3&lang=${lang}#topic-pcm">${t('pcmLesson')}</a><a href="../?view=quiz&lecture=3&lang=${lang}">${t('lectureTest')}</a></div><p class="caption">${t('lectureContext')}</p>
  ${state.shared?`<p class="notice">${t('shared')}</p>`:''}
  <nav class="steps" aria-label="${t('studio')}">${['listen','measure','repair','prove'].map((k,i)=>`<a href="#${k}" ${i===(state.tests?.passed?3:state.diagnosed?2:state.measurements.size?1:0)?'aria-current="step"':''}><span>${String(i+1).padStart(2,'0')}</span>${t(k)}</a>`).join('')}</nav>
  <section id="listen" class="observation"><div class="section-top"><div><p class="eyebrow">01 / ${t('listen')}</p><h2>${t('scopeTitle')}</h2></div><span class="case-tag">${t(state.caseId==='normal'?'case1':'case2')} · <b dir="ltr">${CASES[state.caseId].amplitude.toFixed(2)} V</b></span></div>
    <div class="audio-bar"><div class="audio-buttons">${['original','before','after'].map((k,i)=>`<button data-audio="${k}" class="audio-choice ${k}" aria-pressed="false">${svgIcon('play')}<span><small>${String.fromCharCode(65+i)}</small> ${t(k)}</span></button>`).join('')}<button data-action="stop" class="stop" aria-label="${t('stop')}" title="${t('stop')}">${svgIcon('stop')}</button></div><p>${t('caseHint')}</p><div class="audio-status"><span id="audio-status" role="status">${t('audioReady')}</span><span dir="ltr" id="audio-time">0.0 / 6.0 s</span></div><div class="timeline" aria-hidden="true"><span id="audio-fill"></span></div></div>
    <div class="scope"><div class="scope-head"><span>${t('synchronized')}</span><span dir="ltr">fₛ = 8 kHz</span></div><div id="waveform"></div><div class="scope-foot"><div class="legend"><span class="original">${t('original')}</span><span class="before">${t('before')}</span><span class="after">${t('after')}</span></div><span id="graph-status">${t('graphReady')}</span></div></div>
    <div class="sample-toolbar"><div class="window-controls"><button data-action="prev" aria-label="${t('prevWindow')}" dir="ltr">−16 ms</button><span id="window-label" dir="ltr"></span><button data-action="next" aria-label="${t('nextWindow')}" dir="ltr">+16 ms</button></div><label class="cursor-label" for="sample-cursor">${t('sample')} <b id="sample-number" dir="ltr"></b></label><input id="sample-cursor" type="range" dir="ltr" min="0" max="127" value="8" aria-label="${t('sample')}"></div>
    <p class="caption">${t('scopeHint')} ${t('traceNote')}</p>
    <div class="sample-chain"><p class="eyebrow">${t('chain')}</p><div class="chain" dir="ltr">${[['signal','source'],['gain','input'],['quantizer','level'],['link','code'],['receiver','output']].map(([label,key],i)=>`<div class="chain-node"><small dir="auto">${t(label)}${i===1?' · G':i===2?' · ADC':i===3?' · PCM':''}</small><b dir="ltr" data-sample="${key}"></b>${i===3?`<span dir="auto">${t('ideal')}</span>`:''}</div>`).join('')}</div><div class="sample-bottom"><span>${t('error')} <b dir="ltr" data-sample="error"></b></span><span dir="ltr" data-sample="time"></span></div></div>
  </section>
  <div class="work-grid"><section id="measure" class="panel"><p class="eyebrow">02 / ${t('measure')}</p><h2>${t('predict')}</h2><p>${t('predictHint')}</p><p class="micro">${t('originalEvidence')}</p><div class="measurements">${[['range','peakMeasure','peakDesc'],['link','linkMeasure','linkDesc'],['sampling','samplingMeasure','samplingDesc']].map(([key,title,desc])=>`<button class="measure-button" data-measure="${key}" aria-expanded="${state.measurements.has(key)}" aria-controls="evidence-${key}"><span>${t(title)}<small>${t(desc)}</small></span><b aria-hidden="true">${state.measurements.has(key)?'✓':'+'}</b></button><div class="measurement-result" id="evidence-${key}" ${state.measurements.has(key)?'':'hidden'}>${evidenceHTML(key)}</div>`).join('')}</div>
    <fieldset class="diagnoses"><legend>${t('predict')}</legend>${['clipping','lowBits','bitErrors'].map(k=>`<label><input type="radio" name="diagnosis" value="${k}" ${state.choice===k?'checked':''}><span>${t(k)}</span></label>`).join('')}</fieldset><button class="primary" data-action="diagnose">${t('checkDiagnosis')}</button><p id="diagnosis-feedback" class="feedback ${state.diagnosed?'success':''}" role="status">${state.diagnosed?t('diagnosisYes'):''}</p>
  </section>
  <section id="repair" class="panel"><p class="eyebrow">03 / ${t('repair')}</p><h2>${t('repairTitle')}</h2><p>${t('repairIntro')}</p>${!state.diagnosed?`<p class="lock-note">${t('locked')}</p>`:''}${state.caseId==='transfer'?`<p class="notice">${t('transferIntro')}</p>`:''}
    <fieldset class="settings" ${state.diagnosed?'':'disabled'}><legend class="sr-only">${t('repair')}</legend><label class="control-label" for="gain">${t('gain')} <span dir="ltr">G</span></label><div class="gain-control"><input id="gain" type="range" min="0.3" max="2" step=".01" dir="ltr" value="${state.settings.gain}"><input id="gain-number" type="number" min=".3" max="2" step=".01" value="${state.settings.gain.toFixed(2)}" aria-label="${t('gain')}" dir="ltr"></div><p class="micro">${t('gainHint')}</p><label class="control-label" for="bits">${t('bits')} <span dir="ltr">b</span></label><select id="bits" dir="ltr">${Array.from({length:9},(_,i)=>i+2).map(b=>`<option value="${b}" ${state.settings.bits===b?'selected':''}>${b} bit · ${2**b} ${lang==='ar'?'مستوى':'levels'}</option>`).join('')}</select><p class="micro">${t('bitsHint')}</p></fieldset>
    <p id="input-error" role="alert"></p><div class="budget"><div><b>${t('budget')}</b><span dir="ltr" id="budget-value"></span></div><meter id="budget-meter" min="0" max="88000" low="0" high="64000" optimum="56000" value="0" aria-label="${t('budget')}"></meter><p dir="auto">${t('budgetFormula')}</p><small>${t('overhead')}</small></div>
    <div id="metrics"></div><div class="repair-actions"><button class="primary" data-action="test" ${state.diagnosed?'':'disabled'}>${t('test')}</button><button data-action="reset" ${state.diagnosed?'':'disabled'}>${t('reset')}</button></div><div id="test-result" role="status"></div><details class="hint"><summary>${t('hint')}</summary><p>${t('hintText')}</p></details>
  </section></div>
  <section id="prove" class="proof panel"><div><p class="eyebrow">04 / ${t('prove')}</p><h2>${t('proofTitle')}</h2><p>${t('proofIntro')}</p></div><div id="proof-content"></div><div class="export-actions"><button data-action="report" ${Object.keys(state.evidence).length?'':'disabled'}>${svgIcon('download')}${t('download')}</button><button data-action="share">${svgIcon('link')}${t('share')}</button><button data-action="wav">${svgIcon('download')}${t('downloadAudio')}</button></div><p class="micro">${t('evidenceLocal')}</p><p id="export-status" class="feedback" role="status"></p><input id="share-url" class="share-url" readonly hidden aria-label="${t('share')}" dir="ltr">${previousRecord?`<details class="previous"><summary>${t('previousRecord')}</summary><button data-action="previous">${t('openRecord')}</button></details>`:''}</section>
  <details class="model panel"><summary>${t('model')}</summary><p>${t('modelText')}</p><div class="formula" dir="ltr">u[n] = G · x[n] &nbsp; → &nbsp; q[n] = Q<sub>b</sub>(u[n]) &nbsp; → &nbsp; y[n] = q[n] / G</div><p>${t('modelAudio')}</p><p>${t('modelSNR')}</p><p>${t('modelLimits')}</p><div class="lesson-links"><a href="../?view=lecture&lecture=3&lang=${lang}#topic-quantizer">${t('lesson')} ↗</a><a href="../?view=lab&lecture=3&topic=quantizer&lang=${lang}">${t('fullLab')} ↗</a><a href="../?view=resources&lang=${lang}">${t('references')} ↗</a></div></details>
  <div class="attempt"><button data-action="restart">${t('startAgain')}</button></div></main><footer>${t('footer')}</footer>`;
  updateReadouts();updateMetrics();renderTests();renderProof();
  $('#sample-cursor').oninput=e=>{const start=windowStart();pauseForInspection();state.selected=start+Number(e.target.value);updateReadouts()};
  $('#gain').oninput=e=>changeSettings('gain',Number(e.target.value));
  $('#gain-number').oninput=e=>changeSettings('gain',Number(e.target.value),true);
  $('#gain-number').onchange=e=>changeSettings('gain',Number(e.target.value));
  $('#bits').onchange=e=>changeSettings('bits',Number(e.target.value));
  $$('input[name="diagnosis"]').forEach(r=>r.onchange=()=>state.choice=r.value);
}

function evidenceHTML(key){
  const m=baseline.metrics;
  if(key==='range')return `<dl><div><dt>${t('measuredPeak')}</dt><dd dir="ltr">${n(m.maxInput,3)} V</dd></div><div><dt>${t('validRange')}</dt><dd dir="ltr">[−1, 1) V</dd></div><div><dt>${t('outside')}</dt><dd dir="ltr">${m.overloaded} / ${source.length} · ${n(m.overloadPercent,1)}%</dd></div></dl>`;
  return `<p>${t(key==='link'?'errorsEvidence':'sampleEvidence')}</p>`;
}
function windowStart(){return plotStart??Math.max(0,Math.min(source.length-128,Math.floor(state.selected/128)*128))}
function updateGraphStatus(){const el=$('#graph-status');if(el)el.textContent=t(playing?'graphLive':'graphReady')}
function pauseForInspection(){if(playing)stopAudio();acquiredEnd=null;$('#graph-status').textContent=t('graphFrozen')}
function followPlayback(elapsed){
  state.selected=Math.max(0,Math.min(source.length-1,Math.floor(elapsed*FS)));
  plotStart=Math.max(0,state.selected-127);acquiredEnd=state.selected;updateReadouts();
}
function drawWave(){
  const start=windowStart(),width=window.innerWidth<=760?450:900,height=260,left=45,right=width-25,top=22,bottom=224;
  const x=i=>left+(i-start)/127*(right-left),y=v=>(top+bottom)/2-v/1.25*(bottom-top)/2;
  const count=acquiredEnd===null?128:Math.max(1,Math.min(128,acquiredEnd-start+1));
  const path=data=>Array.from({length:count},(_,j)=>`${j?'L':'M'}${n(x(start+j),2)},${n(y(data[start+j]),2)}`).join(' ');
  $('#waveform').innerHTML=`<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${t('waveform')}" dir="ltr"><defs><clipPath id="trace-clip"><rect x="${left}" y="${top}" width="${right-left}" height="${bottom-top}"/></clipPath></defs>${[-1,0,1].map(v=>`<line x1="${left}" y1="${y(v)}" x2="${right}" y2="${y(v)}" class="grid"/><text x="${left-10}" y="${y(v)+4}" text-anchor="end">${v.toFixed(1)}</text>`).join('')}${[0,32,64,96,127].map(j=>`<line x1="${x(start+j)}" x2="${x(start+j)}" y1="${top}" y2="${bottom}" class="grid"/><text x="${x(start+j)}" y="246" text-anchor="middle">${n((start+j)/FS*1000,1)}</text>`).join('')}<text x="15" y="14">V</text><text x="${width-8}" y="14" text-anchor="end">ms</text><g clip-path="url(#trace-clip)"><path d="${path(source)}" class="trace original"/><path d="${path(baseline.output)}" class="trace before"/><path d="${path(current.output)}" class="trace after"/><line x1="${x(state.selected)}" x2="${x(state.selected)}" y1="${top}" y2="${bottom}" class="cursor"/>${[source,baseline.output,current.output].map((data,i)=>`<circle cx="${x(state.selected)}" cy="${y(data[state.selected])}" r="4" class="point ${['original','before','after'][i]}"/>`).join('')}</g></svg>`;
  $('#waveform svg').onclick=e=>{const rect=e.currentTarget.getBoundingClientRect(),px=(e.clientX-rect.left)/rect.width*width;pauseForInspection();state.selected=start+Math.round(Math.max(0,Math.min(127,(px-left)/(right-left)*127)));updateReadouts()};
}
function updateReadouts(){
  const s=sampleAt(source,current,state.selected);for(const key of ['source','input','level','output','error'])$(`[data-sample="${key}"]`).textContent=n(s[key],3)+' V';
  $('[data-sample="code"]').textContent=s.code;$('[data-sample="time"]').textContent=`t = ${n(s.time*1000,3)} ms`;
  $('#sample-number').textContent=`n = ${s.index}`;$('#sample-cursor').value=s.index-windowStart();$('#sample-cursor').setAttribute('aria-valuetext',`${t('sample')} ${s.index}, ${n(s.time*1000,3)} ms`);
  $('#window-label').textContent=`${n(windowStart()/FS*1000,1)}–${n((windowStart()+127)/FS*1000,1)} ms`;
  $('[data-action="prev"]').disabled=windowStart()===0;$('[data-action="next"]').disabled=windowStart()+128>=source.length;
  drawWave();
}
function updateMetrics(){
  $('#budget-value').textContent=`${n(current.metrics.lineRate/1000,1)} / 64 kbit/s`;
  $('#budget-meter').value=current.metrics.lineRate;
  $('#metrics').innerHTML=`<table><thead><tr><th>${t('metric')}</th><th>${t('before')}</th><th>${t('after')}</th></tr></thead><tbody>${[['snr',r=>n(r.metrics.snr,1)+' dB'],['rangeMetric',r=>n(r.metrics.overloadPercent,1)+'%'],['rateMetric',r=>n(r.metrics.lineRate/1000,1)+' kbit/s']].map(([key,fn])=>`<tr><th>${t(key)}</th><td dir="ltr">${fn(baseline)}</td><td dir="ltr">${fn(current)}</td></tr>`).join('')}</tbody></table>`;
}
function changeSettings(key,value,editingNumber=false){
  try{const next=parameters({...state.settings,[key]:value});stopAudio();state.settings=next;state.tests=null;delete state.evidence[state.caseId];recompute();$('#gain').value=next.gain;if(!editingNumber)$('#gain-number').value=next.gain.toFixed(2);$('#bits').value=next.bits;$('#input-error').textContent='';$('[data-action="test"]').disabled=!state.diagnosed;updateReadouts();updateMetrics();renderTests();renderProof()}
  catch{$('#input-error').textContent=t('invalid');$('[data-action="test"]').disabled=editingNumber;if(!editingNumber)$('#gain-number').value=state.settings.gain.toFixed(2)}
}
function renderTests(){
  const host=$('#test-result');if(!state.tests){host.innerHTML=`<p class="micro">${t('untested')}</p>`;return}
  host.innerHTML=`<ul class="checks">${[['range','rangeRule'],['quality','qualityRule'],['capacity','capacityRule']].map(([k,label])=>`<li class="${state.tests[k]?'yes':'no'}"><span aria-hidden="true">${state.tests[k]?'✓':'×'}</span><span>${t(label)}</span><b>${t(state.tests[k]?'pass':'fail')}</b></li>`).join('')}</ul>${state.tests.passed?`<p class="feedback success">${t(state.caseId==='normal'?'firstPassed':state.evidence.normal?'complete':'transferPassed')}</p>`:''}`;
}
function renderProof(){
  const keys=Object.keys(state.evidence);
  $('#proof-content').innerHTML=keys.length?`<div class="proof-cards">${['normal','transfer'].filter(k=>state.evidence[k]).map(k=>{const r=state.evidence[k];return `<article><span class="proof-check" aria-hidden="true">✓</span><h3>${t(k==='normal'?'case1':'case2')}</h3><p>${t('passedSettings')}</p><b dir="ltr">G = ${r.settings.gain.toFixed(2)} · b = ${r.settings.bits}</b><small dir="ltr">${n(r.metrics.snr,1)} dB · ${n(r.metrics.lineRate/1000,1)} kbit/s · ${r.metrics.overloaded} / ${source.length}</small></article>`}).join('')}</div>`:`<p class="muted">${t('proofEmpty')}</p>`;
  if(state.evidence.normal&&state.caseId==='normal')$('#proof-content').insertAdjacentHTML('beforeend',`<button class="primary transfer" data-action="transfer">${t('transferButton')} ${svgIcon('arrow')}</button>`);
  if(state.caseId==='transfer')$('#proof-content').insertAdjacentHTML('beforeend',`<button data-action="normal">${t('backCase')}</button>`);
  $('[data-action="report"]').disabled=!keys.length;
}
function diagnose(){
  const feedback=$('#diagnosis-feedback');feedback.classList.remove('success');
  if(!state.choice){feedback.textContent=t('pickDiagnosis');return}
  if(state.choice!=='clipping'){feedback.textContent=t(state.choice==='lowBits'?'wrongBits':'wrongLink');return}
  if(!state.measurements.has('range')){feedback.textContent=t('needEvidence');return}
  stopAudio();state.diagnosed=true;render();$('#diagnosis-feedback').focus();
}
function testRepair(){
  if(!state.diagnosed)return;state.tests=evaluateRepair(current);
  if(state.tests.passed){state.evidence[state.caseId]={amplitude:CASES[state.caseId].amplitude,settings:{...state.settings},metrics:metricValues(current),testedAt:new Date().toISOString()};const saved=saveRecord();$('#export-status').textContent=t(saved?'saved':'notSaved')}
  else delete state.evidence[state.caseId];
  renderTests();renderProof();$$('.steps a').forEach((a,i)=>{if(i===(state.tests.passed?3:2))a.setAttribute('aria-current','step');else a.removeAttribute('aria-current')});
}
function switchCase(caseId){
  stopAudio();plotStart=null;acquiredEnd=null;state.caseId=caseId;state.selected=1288;state.tests=null;recompute();render();$('#listen').scrollIntoView({behavior:'instant',block:'start'});
}

function stopAudio(message=true){
  playToken++;cancelAnimationFrame(frame);if(audioNode){audioNode.onended=null;try{audioNode.stop()}catch{}audioNode.disconnect();audioNode=null}audioGain?.disconnect();audioGain=null;playing=null;updateGraphStatus();
  $$('[data-audio]').forEach(b=>b.setAttribute('aria-pressed','false'));
  if(message&&$('#audio-status'))$('#audio-status').textContent=t('audioReady');
}
async function playAudio(kind){
  stopAudio();const token=playToken;
  try{
    const Context=window.AudioContext||window.webkitAudioContext;if(!Context)throw Error('Audio unavailable');audioContext??=new Context();await audioContext.resume();if(token!==playToken)return;
    const samples=kind==='original'?source:kind==='before'?baseline.output:current.output;
    const buffer=audioContext.createBuffer(1,samples.length,FS);buffer.copyToChannel(Float32Array.from(samples,x=>x*PLAYBACK_SCALE),0);
    audioNode=audioContext.createBufferSource();audioNode.buffer=buffer;audioGain=audioContext.createGain();audioNode.connect(audioGain).connect(audioContext.destination);playing=kind;
    playStart=audioContext.currentTime;audioGain.gain.setValueAtTime(0,playStart);audioGain.gain.linearRampToValueAtTime(1,playStart+.01);audioGain.gain.setValueAtTime(1,playStart+DURATION-.02);audioGain.gain.linearRampToValueAtTime(0,playStart+DURATION);
    audioNode.onended=()=>{followPlayback(DURATION);stopAudio(false);$('#audio-status').textContent=t('audioEnd');$('#audio-time').textContent='6.0 / 6.0 s';$('#audio-fill').style.width='100%';$('#graph-status').textContent=t('audioEnd')};audioNode.start();updateGraphStatus();
    $(`[data-audio="${kind}"]`).setAttribute('aria-pressed','true');$('#audio-status').textContent=`${t('playing')}: ${t(kind)}`;
    let last=-Infinity;const tick=()=>{if(!playing)return;const elapsed=Math.min(DURATION,audioContext.currentTime-playStart);$('#audio-time').textContent=`${n(elapsed,1)} / 6.0 s`;$('#audio-fill').style.width=`${elapsed/DURATION*100}%`;if(elapsed-last>=1/30){last=elapsed;followPlayback(elapsed)}frame=requestAnimationFrame(tick)};tick();
  }catch{stopAudio(false);$('#audio-status').textContent=t('audioError')}
}
function download(data,name,type){const url=URL.createObjectURL(new Blob([data],{type})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000)}
async function share(){
  const url=new URL(location.href);url.search=experimentQuery(state.settings,state.caseId,lang);url.hash='';
  try{await navigator.clipboard.writeText(url.href);$('#export-status').textContent=t('copied')}catch{$('#export-status').textContent=t('shareManual');$('#share-url').hidden=false;$('#share-url').value=url.href;$('#share-url').select()}
}
document.addEventListener('click',e=>{
  const audio=e.target.closest('[data-audio]');if(audio){if(playing===audio.dataset.audio)stopAudio();else playAudio(audio.dataset.audio);return}
  const measurement=e.target.closest('[data-measure]');if(measurement){const k=measurement.dataset.measure;state.measurements.add(k);measurement.setAttribute('aria-expanded','true');measurement.querySelector('b').textContent='✓';$('#evidence-'+k).hidden=false;return}
  const button=e.target.closest('[data-action]');if(!button||button.disabled)return;
  const action=button.dataset.action;
  if(action==='stop')stopAudio();
  if(action==='language'){stopAudio();lang=lang==='ar'?'en':'ar';try{localStorage.setItem('dc-language',lang)}catch{}const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(history.state,'',url);render()}
  if(action==='diagnose')diagnose();
  if(action==='test')testRepair();
  if(action==='reset'){stopAudio();state.settings={...BASELINE};state.tests=null;delete state.evidence[state.caseId];recompute();render()}
  if(action==='prev'||action==='next'){pauseForInspection();plotStart=null;state.selected=Math.max(0,Math.min(source.length-1,state.selected+(action==='prev'?-128:128)));updateReadouts()}
  if(action==='transfer'&&state.evidence.normal)switchCase('transfer');
  if(action==='normal')switchCase('normal');
  if(action==='share')share();
  if(action==='wav')download(wavBytes(current.output),`sound-lab-${state.caseId}-G${state.settings.gain}-b${state.settings.bits}.wav`,'audio/wav');
  if(action==='report'&&Object.keys(state.evidence).length)download(reportHTML(record(),lang,location.href),`sound-lab-experiment-${lang}.html`,'text/html;charset=utf-8');
  if(action==='previous'&&previousRecord)download(reportHTML(previousRecord,lang,location.href),`sound-lab-previous-record-${lang}.html`,'text/html;charset=utf-8');
  if(action==='restart'){stopAudio();plotStart=null;acquiredEnd=null;state={settings:{...BASELINE},caseId:'normal',shared:false,measurements:new Set(),choice:'',diagnosed:false,selected:1288,evidence:{},tests:null};const u=new URL(location.href);u.search=`lang=${lang}`;u.hash='';history.replaceState(history.state,'',u);recompute();render();window.scrollTo(0,0)}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAudio()});
window.addEventListener('pagehide',()=>{stopAudio();audioContext?.close();audioContext=null});
window.addEventListener('resize',()=>{if($('#waveform'))drawWave()});
recompute();render();
