(()=>{
'use strict';
const $=id=>document.getElementById(id),round=Math.round,clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const official=location.hostname.endsWith('github.io');
let english=new URLSearchParams(location.search).get('lang')==='en'||(official&&!new URLSearchParams(location.search).has('lang'));
const t=(ar,en)=>english?en:ar;
const colors=['#78e4bf','#f8be72','#8bbcff','#e3a8ec'];
const letter=i=>'ABCD'[i];
const site=(x,y)=>({x,y,h:25,p:10,az:90,directional:0});
const initial=()=>({towers:[site(190,220),site(810,220)],path:[{x:0,y:300},{x:1000,y:300}],n:2.7,ghz:3.5,speed:45,margin:3,ttt:320,threshold:-105});
let c=initial(),selected=0,mode='move',res=null,baseline=null,drag=null,frame=0;
const key='yassir.tower-planner.v1';
function valid(o){return o&&Array.isArray(o.towers)&&o.towers.length<=4&&Array.isArray(o.path)&&o.path.length<=16&&[...o.towers,...o.path].every(q=>q&&Number.isFinite(q.x)&&q.x>=0&&q.x<=1000&&Number.isFinite(q.y)&&q.y>=0&&q.y<=600)&&o.towers.every(q=>Number.isFinite(q.h)&&q.h>=2&&q.h<=100&&Number.isFinite(q.p)&&q.p>=-10&&q.p<=40&&Number.isFinite(q.az)&&q.az>=0&&q.az<=359&&[0,1].includes(q.directional))&&[.7,1.8,3.5].includes(o.ghz)&&[2.7,3.3].includes(o.n)&&o.speed>=5&&o.speed<=120&&[0,160,320,640,1280].includes(o.ttt)&&o.margin>=0&&o.margin<=10&&o.threshold>=-140&&o.threshold<=-60}
try{const v=JSON.parse(localStorage.getItem(key));if(valid(v?.c))c=v.c;if(valid(v?.base)){const r=TowerLab.run(v.base);if(r)baseline={c:v.base,r}}}catch{}
function save(){try{localStorage.setItem(key,JSON.stringify({c,base:baseline?.c}))}catch{}}
const cross={x:500,y:300};
let heat='';
function heatmap(){
 const canvas=document.createElement('canvas');canvas.width=100;canvas.height=60;const ctx=canvas.getContext('2d'),img=ctx.createImageData(100,60);
 for(let y=0;y<60;y++)for(let x=0;x<100;x++){
   const p=Math.max(-156,...c.towers.map(q=>TowerLab.power(q,{x:x*10+5,y:y*10+5},c)));
   const v=clamp((p-c.threshold+12)/24,0,1),i=(y*100+x)*4;
   img.data.set([17+13*v,40+76*v,47+55*v,255],i);
 }
 ctx.putImageData(img,0,0);heat=canvas.toDataURL();
}
function sample(){return res?.samples[round(Number($('pos').value)/1000*(res.samples.length-1))]}
function marker(){const q=sample();$('cursor').textContent=q?round(q.m)+' m · '+q.rx.toFixed(1)+' dBm · '+letter(q.serv):'—';const dot=$('phoneDot');if(dot&&q)dot.setAttribute('transform','translate('+q.x+' '+q.y+')');const v=$('cursorLine');if(v&&q)v.setAttribute('transform','translate('+(48+760*q.m/res.total)+' 0)')}
function map(){
 const line=c.path.map(q=>q.x+','+q.y).join(' ');
 $('map').innerHTML='<defs><pattern id="mesh" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M100 0H0V100" fill="none" stroke="#b1dad4" stroke-opacity=".2" stroke-width="2"/></pattern></defs><image width="1000" height="600" href="'+heat+'"/><rect width="1000" height="600" fill="url(#mesh)"/><path d="M24 566v8h100v-8" fill="none" stroke="#e3efe6" stroke-width="2"/><text x="55" y="556">100 m</text><text x="974" y="26" text-anchor="end">N ↑</text><polyline points="'+line+'" stroke="#10292e" stroke-width="9" fill="none"/><polyline points="'+line+'" stroke="#f3edd4" stroke-width="4" stroke-dasharray="9 5" fill="none"/>'+
 c.path.map((p,i)=>'<g transform="translate('+p.x+' '+p.y+')" data-drag="path" data-index="'+i+'"><circle r="13" fill="transparent"/><circle r="6" fill="#fff2ca" stroke="#1a3135" stroke-width="2"/></g>').join('')+
 c.towers.map((q,i)=>'<g transform="translate('+q.x+' '+q.y+')" data-drag="tower" data-index="'+i+'"><circle r="21" fill="#13282e" stroke="'+colors[i]+'" stroke-width="'+(i===selected?4:2)+'"/><path d="M-6 10L0 -10 6 10 M-4 4h8" fill="none" stroke="'+colors[i]+'" stroke-width="2.5"/>'+ (q.directional?'<path transform="rotate('+q.az+')" d="M0 -23v-20m-4 6 4-6 4 6" stroke="'+colors[i]+'" fill="none" stroke-width="3"/>':'')+'<text x="24" y="-8">'+letter(i)+'</text></g>').join('')+
 (res?'<g id="phoneDot" pointer-events="none"><circle r="12" fill="#ffcb70" stroke="#15262d" stroke-width="4"/><circle r="4" fill="#19272d"/></g>':'')+'<path id="crosshair" visibility="'+(document.activeElement===$('map')?'visible':'hidden')+'" transform="translate('+cross.x+' '+cross.y+')" d="M-10 0h20M0 -10v20" stroke="white" stroke-width="2" pointer-events="none"/>';
 marker();
}
function chart(){
 const same=baseline&&JSON.stringify(c.path)===JSON.stringify(baseline.c.path);
 $('stats').innerHTML=res?[[t('تغطية المسار','Route coverage'),res.coverage.toFixed(1)+'%'],[t('أضعف إشارة','Weakest signal'),res.worst.toFixed(1)+' dBm'],[t('انتقالات الاتصال','Handovers'),res.events.length]].map(([s,v])=>'<div><span>'+s+'</span><b dir="ltr">'+v+'</b></div>').join(''):'';
 const svg=$('curve');svg.hidden=!res;$('legend').innerHTML='';$('events').textContent='';$('comparison').hidden=!baseline;
 if(baseline)$('comparison').textContent=t('خط الأساس محفوظ.','Baseline saved.')+(res?' '+t('فرق التغطية','Coverage change')+' '+(res.coverage-baseline.r.coverage).toFixed(1)+' '+t('نقطة مئوية','percentage points')+' · '+t('فرق أضعف إشارة','Weakest-signal change')+' '+(res.worst-baseline.r.worst).toFixed(1)+' dB'+(!same?' · '+t('اختلف المسار بين التجربتين.','The routes differ.'):''):'');
 if(!res)return;
 const all=res.samples.flatMap(q=>q.powers);if(same)all.push(...baseline.r.samples.map(q=>q.rx));const low=Math.floor(Math.min(c.threshold,...all)/10)*10,high=Math.ceil(Math.max(c.threshold,...all)/10)*10+1;
 const X=m=>48+760*m/res.total,Y=v=>145-126*(v-low)/(high-low);
 const path=(rows,fn)=>rows.map((q,i)=>(i?'L':'M')+X(q.m).toFixed(1)+' '+Y(fn(q)).toFixed(1)).join('');
 let html='';for(let v=low;v<=high;v+=high-low>100?20:10){html+='<path class="axis" d="M48 '+Y(v)+'H810"/><text x="43" y="'+(Y(v)+4)+'" text-anchor="end">'+v+'</text>'}
 html+='<text x="8" y="15">dBm</text><text x="48" y="177">0 m</text><text x="808" y="177" text-anchor="end">'+round(res.total)+' m</text><path d="M48 '+Y(c.threshold)+'H808" stroke="#ff9b90" stroke-dasharray="4 4"/>';
 c.towers.forEach((q,i)=>html+='<path fill="none" stroke="'+colors[i]+'" stroke-width="2" d="'+path(res.samples,s=>s.powers[i])+'"/>');
 if(same)html+='<path fill="none" stroke="#fff" stroke-dasharray="6 5" d="'+path(baseline.r.samples,q=>q.rx)+'"/>';
 svg.innerHTML=html+'<path id="cursorLine" d="M0 15V147" stroke="#fff" stroke-width="2"/>';
 $('legend').innerHTML=c.towers.map((q,i)=>'<span><i class="swatch" style="background:'+colors[i]+'"></i>'+t('برج ','Site ')+letter(i)+'</span>').join('')+'<span>'+t('عتبة','Threshold')+' '+c.threshold+' dBm</span>'+(same?'<span>'+t('متقطع أبيض: خط الأساس','White dashed: baseline')+'</span>':'');
 $('events').textContent=t('سجل التسليم','Handover log')+' · '+(res.events.length?res.events.map(e=>letter(e.from)+' → '+letter(e.to)+' ('+round(e.m)+' m)').join(' · '):t('بقي الهاتف على البرج نفسه.','The same site served the entire route.'));marker();
}
function inputs(){
 if(selected>=c.towers.length)selected=Math.max(0,c.towers.length-1);
 $('which').innerHTML=c.towers.map((q,i)=>'<option value="'+i+'">'+t('برج ','Site ')+letter(i)+'</option>').join('');$('which').value=selected;$('which').disabled=$('station').disabled=!c.towers.length;
 const q=c.towers[selected];if(q)for(const k of ['x','y','h','p','az','directional'])$(k).value=q[k];
 $('az').disabled=!q?.directional;
 for(const k of ['ghz','n','speed','margin','ttt','threshold'])$(k).value=c[k];
 for(const k of ['move','tower','route'])$(k).setAttribute('aria-pressed',mode===k);
 $('mapNote').textContent=mode==='tower'?t('اضغط الخريطة لوضع برج (حتى ٤ أبراج).','Tap the map to place a site (up to four).'):mode==='route'?t('اضغط نقاط الطريق بالترتيب. اسحب أي نقطة في وضع التحريك.','Tap route waypoints in order. Drag any point in Move mode.'):t('اسحب برجًا أو نقطة مسار. يبيّن اللون الأخضر المناطق الأقوى مقارنة بالعتبة.','Drag a site or waypoint. Greener areas have stronger predicted power relative to the threshold.');
 for(const k of ['base','csv','play','pos'])$(k).disabled=!res;
 $('run').disabled=!c.towers.length||c.path.length<2;$('undo').disabled=!c.path.length;
}
function stop(){cancelAnimationFrame(frame);frame=0;$('play').textContent=t('تشغيل الحركة','Play route')}
function dirty(){stop();res=null;$('pos').value=0;heatmap();inputs();chart();map();$('status').textContent=t('أعد التشغيل بعد ضبط التجربة.','Run the experiment after configuring it.')}
function execute(){stop();res=TowerLab.run(c);$('pos').value=0;inputs();chart();map();save();$('status').textContent=res?t('اكتملت المحاكاة. حرّك المؤشر لفحص أي موضع.','Simulation complete. Scrub the route to inspect any position.'):t('ضع برجًا وحدّد نقطتين مختلفتين على الأقل للمسار.','Place a site and at least two distinct route points.')}
function insert(p){
 if(mode==='tower'&&c.towers.length<4){selected=c.towers.push(site(p.x,p.y))-1}
 else if(mode==='route'&&c.path.length<16){c.path.push({...p})}
 else{$('status').textContent=t('الحد الأقصى أربعة أبراج و١٦ نقطة مسار.','Maximum four sites and sixteen waypoints.');return}
 dirty();save();
}
function position(e){const r=$('map').getBoundingClientRect();return {x:clamp(round((e.clientX-r.left)*1000/r.width),0,1000),y:clamp(round((e.clientY-r.top)*600/r.height),0,600)}}
const m=$('map');
m.onpointerdown=e=>{if(e.button!==0)return;const p=position(e),g=e.target.closest('[data-drag]');if(mode!=='move'){insert(p);return}if(!g)return;const i=Number(g.dataset.index),isTower=g.dataset.drag==='tower';if(isTower)selected=i;drag={obj:isTower?c.towers[i]:c.path[i],id:e.pointerId};m.setPointerCapture(e.pointerId);inputs();map()};
m.onpointermove=e=>{if(drag&&drag.id===e.pointerId){Object.assign(drag.obj,position(e));dirty()}};
m.onpointerup=m.onpointercancel=()=>{if(drag){drag=null;save()}};
m.onkeydown=e=>{if(e.key==='Enter'&&mode!=='move'){insert(cross);return}const d={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]}[e.key];if(!d)return;e.preventDefault();cross.x=clamp(cross.x+d[0],0,1000);cross.y=clamp(cross.y+d[1],0,600);map()};m.onfocus=m.onblur=()=>map();
for(const k of ['move','tower','route'])$(k).onclick=()=>{mode=k;inputs()};
$('which').onchange=()=>{selected=+$('which').value;inputs();map()};
for(const k of ['x','y','h','p','az','directional','ghz','n','speed','margin','ttt','threshold'])$(k).onchange=()=>{
 const input=$(k);if(!input.checkValidity()){input.reportValidity();inputs();return}
 (k in c?c:c.towers[selected])[k]=Number(input.value);dirty();save()
};
$('del').onclick=()=>{c.towers.splice(selected,1);dirty();save()};$('undo').onclick=()=>{c.path.pop();dirty();save()};
$('empty').onclick=()=>{c={...initial(),towers:[],path:[]};mode='tower';dirty();save()};
$('example').onclick=()=>{c=initial();selected=0;mode='move';heatmap();execute()};
$('run').onclick=execute;$('base').onclick=()=>{if(!res)return;baseline={c:JSON.parse(JSON.stringify(c)),r:res};save();chart()};
$('csv').onclick=()=>{if(!res)return;const cols=['distance_m','time_s','east_m','south_m','serving_site','serving_rsrp_dBm',...c.towers.map((_,i)=>letter(i)+'_rsrp_dBm')];
 const rows=res.samples.map(s=>[s.m.toFixed(2),s.time.toFixed(2),s.x.toFixed(1),s.y.toFixed(1),letter(s.serv),s.rx.toFixed(2),...s.powers.map(v=>v.toFixed(2))]);const a=document.createElement('a');const u=URL.createObjectURL(new Blob([[cols,...rows].map(r=>r.join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}));a.href=u;a.download='5G-route-measurements.csv';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};
$('pos').oninput=()=>{stop();marker()};$('curve').onclick=e=>{if(!res)return;const r=$('curve').getBoundingClientRect();stop();$('pos').value=round(1000*clamp(((e.clientX-r.left)*850/r.width-48)/760,0,1));marker()};
$('play').onclick=()=>{if(frame){stop();return}if(!res)return;let v=+$('pos').value;if(v===1000)v=0;const start=performance.now();$('play').textContent=t('إيقاف الحركة','Pause');function step(now){const value=Math.min(1000,v+(now-start)/15);$('pos').value=round(value);marker();if(value>=1000)stop();else frame=requestAnimationFrame(step)}frame=requestAnimationFrame(step)};
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
function language(){document.title=t('مختبر تخطيط شبكة الجيل الخامس | د. ياسر الأمين','5G Radio Planning Laboratory | Dr Yassir Al-Ameen');document.documentElement.lang=english?'en':'ar';document.documentElement.dir=english?'ltr':'rtl';document.querySelectorAll('[data-en]').forEach(e=>{e.dataset.ar??=e.textContent;e.textContent=english?e.dataset.en:e.dataset.ar});$('lang').textContent=english?'العربية':'English';stop();inputs();chart();map();$('status').textContent=res?t('اكتملت المحاكاة.','Simulation complete.'):t('اضبط التجربة ثم شغّلها.','Configure the experiment and run it.')}
$('lang').onclick=()=>{english=!english;language();try{const u=new URL(location.href);u.searchParams.set('lang',english?'en':'ar');history.replaceState(null,'',u)}catch{}};
heatmap();language();execute();
})();
