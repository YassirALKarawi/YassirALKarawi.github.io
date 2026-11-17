import {rigs} from './apparatus.mjs';

const ink='#cbdfd8',metal='#607e82',mint='#8ae0c3',amber='#f1bf70',blue='#85c9f1';
const line=(d,color=ink,width=2)=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"/>`;
const box=(x,y,w,h,fill='#27464b',r=6)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${metal}"/>`;
const circle=(x,y,r,fill='#19383e',stroke=ink)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const label=(x,y,s,c=ink,size=11)=>`<text x="${x}" y="${y}" fill="${c}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="${size}">${s}</text>`;
const electrode=(x,y)=>circle(x,y,3,mint,mint);
const arrow=(x,y,color=amber)=>line(`M${x} ${y-18}v18m-5 -6 5 6 5 -6`,color,2.5);
const hRes=(x,y)=>line(`M${x} ${y}h5l4 -7 7 14 7 -14 7 14 7 -14 4 7h5`,amber);
const vRes=(x,y)=>`<g transform="translate(${x} ${y}) rotate(90)">${hRes(0,0)}</g>`;
function meter(x,y,letter){return circle(x,y,14,'#24454a',blue)+label(x,y+4,letter,blue,13)}
function block(x,y,w,name){return box(x,y,w,34)+label(x+w/2,y+22,name)}
function teeth(x,y,r,n,angle){
 const pts=Array.from({length:n*4},(_,i)=>{const a=i*2*Math.PI/(n*4),v=i%4===1||i%4===2?r:r-3;return (x+v*Math.cos(a)).toFixed(1)+','+(y+v*Math.sin(a)).toFixed(1)}).join(' ');
 return `<g transform="rotate(${angle} ${x} ${y})"><polygon points="${pts}" fill="#41636a" stroke="${ink}"/>${circle(x,y,5)}${line(`M${x} ${y}h${r-6}`,amber,3)}</g>`;
}
function circuit(type,open,id){
 if(type==='opamp'&&id==='sensor')return block(16,56,66,'mV IN')+line('M82 73h28m68 0h25')+line('M111 44l66 29-66 29z',mint,3)+label(135,77,'G')+meter(219,73,'V')+label(126,132,'Linear sensor conditioning');
 if(type==='opamp')return line('M20 83h78m0 -42 74 31-74 31z M172 72h65 M185 72v-49h-24 M115 23H83v31h15 M83 54v44 M83 88H46v5 M46 140v7',mint)+hRes(115,23)+vRes(46,93)+line('M36 148h20m-16 4h12')+label(107,59,'−')+label(107,88,'+')+label(139,17,'Rᶠ')+label(24,119,'Rɡ')+electrode(185,72)+label(216,66,'OUT')+label(29,79,'IN');
 if(type==='bridge'){return line('M130 14v10 M130 24H68v9 M130 24h62v9 M68 79v8m0 46v10h124v-10m0-46v-8 M130 143v9 M68 82h48 M144 82h48')+vRes(68,33)+vRes(192,33)+vRes(68,87)+vRes(192,87)+meter(130,82,'V')+electrode(68,82)+electrode(192,82)+label(131,12,'+Vₛ')+label(215,113,'R+ΔR')+label(128,165,'0 V')+label(150,76,'+',amber)}
 if(type==='filter')return line('M38 54h56 M140 54h61v32 M201 96v33H38V91m0-30v-7')+circle(38,76,15)+line(id==='rc'?'M27 76q5 -12 11 0t11 0':'M28 80h6V70h12',mint)+hRes(94,54)+line('M187 87h28 M187 95h28',amber,3)+electrode(67,54)+electrode(201,54)+label(65,34,'CH1',mint)+label(203,34,'CH2',amber)+label(118,42,'R')+label(226,96,'C')+line('M122 129v9m-10 0h20m-16 5h12');
 const divider=type==='divider';const switchLine=open?'M58 38l27 -16':'M58 38h27';
 let paths=line('M31 65V38h27 M85 38h23 M154 38h37 M31 99v40h160')+line(switchLine,amber,3)+electrode(58,38)+electrode(85,38)+hRes(108,38)+circle(31,82,16)+label(31,77,'+')+label(31,93,'−')+label(131,22,divider?'R₁':'R')+label(68,60,'S');
 if(divider)return paths+line('M191 38v35m0 46v20 M191 61h44v12m0 29v37h-44')+vRes(191,73)+meter(235,87,'V')+label(169,102,'R₂')+electrode(191,61);
 return paths+line('M191 38v32m0 28v41')+meter(191,84,'A')+label(125,159,id==='copper'?'P = I²R':'DC loop');
}
export function beamShape(f){const v=f<=.5?f:1-f;return v*(3-4*v*v)}
export function rcResponse(frequency,cutoff){const r=frequency/cutoff;return {gain:1/Math.hypot(1,r),phase:-Math.atan(r)}}
export function sweepInput(p,set,frac){const ticks=Math.round((set-p.min)/p.step);return Number((p.min+Math.round(Math.min(1,Math.max(0,frac))*ticks)*p.step).toFixed(6))}
function equipment(type,id,a,phase,val,x,y,l){
 const ratio=Math.min(1,Math.max(0,a)),spin=phase*45;
 if(['resistor','divider','filter','bridge','opamp'].includes(type))return circuit(type,false,id);
 if(type==='beam'){const h=Math.min(26,25*val/l.calc(l.x.max,l.y.max));const d=Array.from({length:41},(_,i)=>(i?'L':'M')+(23+205*i/40)+' '+(96+h*beamShape(i/40)/beamShape(.5))).join(' ');return line('M23 96H228','#52696c',1)+line(d,mint,5)+line('M23 99l-9 15h18z M228 99l-9 15h18z')+circle(223,119,3)+circle(232,119,3)+arrow(126,92+h)+label(126,62,'P')+line('M23 139h205m-205 -4v8m205 -8v8')+label(126,154,'L')+label(128,118+h,'δ',amber)}
 if(type==='spring'){const isV=id==='vibration',py=isV?96+19*Math.cos(phase*2*Math.PI*val):78+ratio*39;let d='M124 25v10';for(let j=0;j<12;j++)d+=' L'+(j%2?112:136)+' '+(36+(py-36)*j/12);return line('M78 24h92',ink,5)+line(d+' L124 '+py,amber,2.5)+box(98,py,52,24,metal)+label(124,py+16,'m')+line('M172 44v94m0-8h9m-9-16h6m-6-16h9m-9-16h6m-6-16h9')+label(188,148,'x')}
 if(type==='gear'){const r2=24+12*(y-20)/80,r1=r2*20/y;return teeth(103-r1,82,r1,20,phase*x*.06)+teeth(103+r2-2,82,r2,y,-phase*x*.06*20/y)+label(75,131,'20 T')+label(167,131,y+' T')}
 if(type==='motor')return box(31,59,92,52,metal)+line('M43 69h62m-62 9h62m-62 9h62m-62 9h62')+line('M123 85h85',amber,7)+teeth(187,85,26,16,id==='shaft'?phase*x*.06:spin)+label(75,136,'MOTOR')+label(181,136,id==='encoder'?'ENCODER':'SHAFT');
 if(id==='expansion')return box(34,51,12,63,metal,1)+line('M46 84h'+(120+ratio*15),amber,8)+line('M173 84h20',ink,2)+meter(210,84,'ΔL')+label(126,133,'FREE END   →');
 if(type==='tensile')return line('M34 124V35h190v89 M22 125h216',metal,7)+box(55,61,38,35)+box(163+ratio*8,61,38,35)+line('M92 71l14 4h42l16-4v16l-16-4h-42l-14 4z',amber,2.5)+line('M105 99h44m-44-5v10m44-10v10',mint)+label(129,117,id==='stress'?'A₀':id==='strain'?'L₀ → L':'ΔL');
 if(type==='slab')return line('M28 79l76-35 115 20-73 40z M28 79v17l118 25 73-39V64 M146 104v17',mint,3)+label(123,81,'A')+label(228,91,'h');
 if(type==='tank')return line('M14 54h43v20 M185 100h53',blue,5)+box(54,58,132,75,'#23474f')+box(57,79,126,50,'#275d69',2)+line('M57 79h125',mint)+line('M119 35v70m-21 5 21-6 19 6',amber,3)+label(28,40,'IN')+label(217,124,'OUT')+electrode(170,95)+label(128,152,id==='washout'?'V = 100 L':'Qᵢₙ → Qₒᵤₜ');
 if(id==='runoff')return line('M19 61l51 33 56-19 52 28 50-8',mint,4)+Array.from({length:12},(_,i)=>{const ry=29+(i*13+phase*13)%34;return line('M'+(24+i*16)+' '+ry+'l-4 7',blue,2)}).join('')+line('M143 98l37 15 42-6',blue,3)+label(127,139,'i · A → Q');
 if(type==='gate'){const h=30+ratio*45;return line('M26 133h194m-33 0V40',ink,4)+box(26,133-h,158,h,'#275869',0)+line(`M26 ${133-h}h156`,blue,2)+line(`M187 ${133-h}l32 ${h}h-32z`,amber,2)+label(112,149,id==='hydro'?'p = ρgz':'Qₚₑₐₖ')}
 if(type==='core')return line('M11 86h45m140 0h44',blue,5)+box(54,49,144,72,'#5d5145',12)+line('M61 59h131m-131 52h131',amber,2)+Array.from({length:18},(_,i)=>circle(67+(i%6)*22,66+Math.floor(i/6)*15,3+(i%3),'#2c494b',metal)).join('')+label(127,143,id==='darcy'?'Δp · Q':'Vᵦ · Vₚ');
 if(type==='room')return line('M32 122V46l93-24 92 24v76z',ink,3)+line('M58 55h36m52 0h36',amber,5)+line('M60 60l-14 43m44-43 15 43m43-43-14 43m44-43 16 43',amber)+line('M40 104h169',mint,2)+meter(119,94,id==='light'?'lx':'dB');
 if(type==='solar')return line('M58 96l35-55h105l-32 55z M77 70h104m-70-28-34 55m69-55-32 55m69-55-33 55',blue,2)+line('M122 98v20m-22 0h45',metal,4)+circle(39,36,10,amber,amber)+line('M54 49l19 16m-27-8 17 14',amber)+meter(205,112,'W')+line('M161 97v15h29');
 if(type==='battery')return box(25,60,65,47)+box(48,53,19,7,metal,0)+label(58,90,'DC',mint)+line('M90 83h26m43 0h25')+block(115,66,43,id==='inverter'?'~':'Wh')+block(183,66,57,'LOAD')+label(128,130,'Pᵢₙ → Pₒᵤₜ');
 if(type==='pump'||type==='thermal')return line('M12 96h73m79 0h59V52',blue,5)+circle(124,96,35,metal)+line(type==='pump'?'M109 80l35 16-35 17z':'M98 96l8-11 10 20 10-20 10 20 11-12',amber,3)+meter(55,57,type==='pump'?'H₁':'T₁')+meter(200,45,type==='pump'?'H₂':'T₂')+line('M55 72v23m145-34v35');
 if(type==='wall')return box(83,36,88,92,'#59615a',0)+Array.from({length:5},(_,i)=>line('M84 '+(48+16*i)+'h86',metal)).join('')+label(48,62,'T₁',amber)+label(211,62,'T₂',blue)+line('M43 84h164m-9-6 9 6-9 6',amber,3)+label(125,146,'U · A · ΔT');
 if(type==='conveyor')return box(23,90,203,22,'#355058',11)+Array.from({length:9},(_,i)=>circle(36+i*22,101,4)).join('')+Array.from({length:3},(_,i)=>box(35+((i*62+phase*12)%165),64,26,25,'#617267',1)).join('')+label(128,141,'IN → PROCESS → OUT');
 if(type==='wave'){let d='';for(let i=0;i<=200;i++){const n=12/val;d+=(i?'L':'M')+(24+i)+' '+(85-22*Math.sin(i/200*2*Math.PI*n-phase*2))}return line('M23 85h204',metal)+line(d,mint,2.5)+label(125,141,'0 m                   12 m')}
 const labels=type==='digital'?({pcm:['fₛ','PCM','bit/s'],symbol:['BITS','MAP','Bd'],step:['STEP','G(s)','y(t)'],adc:['Vᵢₙ','ADC','LSB']}[id]):type==='compute'?(id==='cache'?['CPU','CACHE','RAM']:['TASK','CORES','TIME']):id==='shannon'?['TX','AWGN','C']:['TX','LINK','RX'];
 return block(8,66,59,labels[0])+line('M67 83h20m80 0h18',mint,3)+block(87,66,80,labels[1])+block(185,66,60,labels[2])+electrode(78,83)+electrode(175,83)+label(127,130,'TP1                  TP2');
}
const fmt=n=>Number(n.toPrecision(4)).toString();
export function attachBench(host,l,read,T){
 const rig=rigs[l.id],tr=(ar,en)=>T(ar+'|'+en);
 const rc=l.id==='rc',vib=l.id==='vibration',canOpen=['ohm','divider'].includes(l.id);
 host.innerHTML=`<div class="bench-heading"><div><p class="eyebrow">${tr('منضدة التجربة','Experiment bench')}</p><h2>${T(l.title)}</h2></div><span class="dept-code">LAB / ${l.id.toUpperCase()}</span></div><p>${T(rig.parts)}</p><p>${T(rig.procedure)}</p><div class="instrument"><figure><figcaption>${tr('تركيب التجربة','Equipment layout')}</figcaption><svg viewBox="0 0 258 176" role="img" aria-label="${T(rig.parts)}" data-kit></svg></figure><figure><figcaption>${rc?'CH1 / CH2 · V':vib?'x(t) · mm':tr('سجل قراءة الجهاز','Measurement trace')}</figcaption><svg viewBox="0 0 300 176" role="img" aria-label="${tr('قراءة متغيرة مع التشغيل','Live measurement trace')}" data-scope></svg></figure></div><div class="bench-controls"><button type="button" data-pause></button><button type="button" data-mode></button>${canOpen?'<button type="button" data-switch></button>':''}${rc?`<label>${tr('تردد المولّد نسبةً إلى تردد القطع','Generator / cutoff frequency')} <select data-frequency><option>0.1</option><option>0.5</option><option selected>1</option><option>2</option><option>5</option><option>10</option></select></label>`:''}<button type="button" data-record>${tr('سجّل قراءة','Record reading')}</button></div><p class="bench-read" data-read dir="ltr"></p><p class="muted" data-key></p><div data-log aria-live="polite"></div>`;
 const el=n=>host.querySelector('[data-'+n+']');
 let running=!matchMedia('(prefers-reduced-motion: reduce)').matches,steady=false,open=false,elapsed=0,frame=0,last=0,lastPaint=-100,snapshot,records=[];
 function state(){
   const [set,y]=read(),frac=(1+Math.cos(elapsed*Math.PI/3))/2;
   const x=(steady||rc||vib)?set:sweepInput(l.x,set,frac);
   const z=open?0:l.calc(x,y);
   const f=rc?z*Number(el('frequency').value):0;
   return {x,y,z,f,response:rc?rcResponse(f,z):null};
 }
 function traceSVG(s,set){
   const W=250,left=35,mid=76,base=131;let output='';
   for(let i=0;i<=5;i++)output+=line('M'+(left+i*50)+' 21v110','#305054',1);
   for(let i=0;i<=4;i++)output+=line('M35 '+(21+i*27.5)+'h250','#305054',1);
   let topUnit=l.unit, high=1, low=0, timeUnit='s', span=6,pointsA=[],pointsB=[];
   if(rc||vib){
     span=rc?3/s.f:3/s.z;timeUnit=rc?'ms':'s';topUnit=rc?'V':'mm';high=rc?1:10;low=-high;
     const phase=steady?0:(vib?elapsed*s.z:elapsed*.5);
     for(let i=0;i<=150;i++){let θ=2*Math.PI*(3*i/150+phase);pointsA.push(mid-55*(vib?Math.cos(θ):Math.sin(θ)));if(rc)pointsB.push(mid-55*s.response.gain*Math.sin(θ+s.response.phase))}
   }else{
     high=Math.max(l.calc(l.x.min,s.y),l.calc(set,s.y),s.z)*1.10||1;
     for(let i=0;i<=150;i++){const t=elapsed-6+6*i/150;if(t<0){pointsA.push(null);continue}const u=steady?set:sweepInput(l.x,set,(1+Math.cos(t*Math.PI/3))/2);pointsA.push(base-110*(open?0:l.calc(u,s.y))/high)}
   }
   function curve(points,color){let started=false,d='';points.forEach((py,i)=>{if(py===null)return;d+=(started?'L':'M')+(left+i*W/150).toFixed(1)+' '+py.toFixed(1);started=true});return line(d,color,2.2)}
   return output+curve(pointsA,mint)+curve(pointsB,amber)+label(18,25,fmt(high),ink,8)+label(18,131,fmt(low),ink,8)+label(52,13,topUnit,ink,9)+label(70,154,rc||vib?'0':'t − 6 s',ink,10)+label(252,154,rc||vib?fmt(span)+' '+timeUnit:'t',ink,10);
 }
 function paint(){
   const [set]=read(),s=state();snapshot=s;
   const ratio=(s.x-l.x.min)/(l.x.max-l.x.min);
   el('kit').innerHTML=canOpen?circuit(rig.scene,open,l.id):equipment(rig.scene,l.id,ratio,elapsed,s.z,s.x,s.y,l);
   el('scope').innerHTML=traceSVG(s,set);
   el('read').textContent=l.x.symbol+' = '+fmt(s.x)+' '+l.x.unit+'   ·   '+l.y.symbol+' = '+fmt(s.y)+' '+l.y.unit+'   ·   '+(rc?'f꜀ = ':T(l.output)+' = ')+fmt(s.z)+' '+l.unit+(rc?'   ·   CH2 = '+fmt(s.response.gain)+' Vpk   ·   φ = '+fmt(s.response.phase*180/Math.PI)+'°':'');
   el('pause').textContent=running?tr('أوقف العرض','Pause display'):tr('شغّل العرض','Run display');el('pause').setAttribute('aria-pressed',String(!running));
   el('mode').textContent=(rc||vib)?(steady?tr('حرّك الرسم','Animate phase'):tr('ثبّت الطور','Lock phase')):(steady?tr('ابدأ مسح المدخل','Sweep input'):tr('ثبّت المدخل عند قيمة المنزلق','Hold slider setting'));
   if(canOpen)el('switch').textContent=open?tr('أغلق مفتاح الدائرة','Close circuit switch'):tr('افتح مفتاح الدائرة','Open circuit switch');
   el('key').textContent=rc?tr('الدخل الجيبي 1 V قمة. الأخضر للدخل والكهرماني للخرج. محور الزمن بالميلي ثانية؛ تُبطأ حركة الطور لسهولة القراءة.','Input is 1 V peak. Green is input; amber is output. Time axis in ms; phase animation is slowed for readability.'):vib?tr('سعة الإزاحة 10 mm. يعرض الراسم ثلاث دورات بوحدات الزمن الفيزيائي.','Displacement amplitude is 10 mm. The scope shows three cycles on a physical time axis.'):tr('القيمة الرقمية تخص المدخل المطبّق الآن. يمسح الجهاز المدخل الأول بين أدناه وقيمة المنزلق خلال ست ثوانٍ. ثبّت المدخل للمقارنة بالمثال. الرسم الميكانيكي توضيحي الأبعاد.','The meter reads the applied input. A six-second sweep varies the first input between its minimum and the slider setting. Hold the input to compare with the example. Equipment drawings are schematic.');
 }
 function tick(now){if(!running||document.hidden)return;if(last)elapsed+=(now-last)/1000;last=now;if(now-lastPaint>=65){paint();lastPaint=now}frame=requestAnimationFrame(tick)}
 function schedule(){cancelAnimationFrame(frame);last=0;paint();if(running&&!document.hidden)frame=requestAnimationFrame(tick)}
 el('pause').onclick=()=>{running=!running;schedule()};el('mode').onclick=()=>{steady=!steady;elapsed=0;schedule()};
 if(canOpen)el('switch').onclick=()=>{open=!open;elapsed=0;schedule()};if(rc)el('frequency').onchange=()=>{elapsed=0;schedule()};
 el('record').onclick=()=>{paint();const s=snapshot;records.push(el('read').textContent+(canOpen?' · '+(open?'OPEN':'CLOSED'):''));el('log').innerHTML='<ol class="measurements" dir="ltr">'+records.map(row=>'<li>'+row+'</li>').join('')+'</ol>'};
 document.addEventListener('visibilitychange',schedule);schedule();
 return {refresh(){elapsed=0;schedule()},destroy(){cancelAnimationFrame(frame);document.removeEventListener('visibilitychange',schedule)}};
}
