import {departments,labs} from './catalog.mjs';
import {makeCase,makeExam,correct,parseAnswer} from './assessment.mjs';
const $=s=>document.querySelector(s);
const root=$('#main');
const params=new URL(location.href).searchParams;
const key='yassir.engineering.studio.v1';
let storageOK=true;
const read=(k,fallback)=>{try{return JSON.parse(localStorage.getItem(k))??fallback}catch{return fallback}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{storageOK=false}};
let language=(params.get('lang')||read(key+'.lang','ar'))==='en'?'en':'ar';
let theme=read(key+'.theme','light');
let progress=read(key+'.progress',{});
for(const prop of ['skills','interviews','drafts'])progress[prop]??={};
progress.results??=[];
let exam=read(key+'.exam',null);
const saved=()=>write(key+'.progress',progress);
const T=s=>s?.split('|')[language==='ar'?0:1]??'';
const b=s=>'<bdi>'+s+'</bdi>';
const department=id=>departments.find(d=>d.id===id);
const model=id=>labs.find(d=>d.id===id);
const num=n=>new Intl.NumberFormat('en',{maximumSignificantDigits:4,useGrouping:false}).format(n);
const tr=(ar,en)=>language==='ar'?ar:en;
const link=(url,label,kind='')=>'<a class="btn '+kind+'" href="'+url+'">'+label+'</a>';
const resource=(view='course')=>'digital-communications/academy/?view='+view+'&amp;lang='+language+(view==='course'?'#lecture-roadmap':'');
const linkDept=d=>'#department/'+d.id, linkLab=l=>'#lab/'+l.id;
let clean=[],labCase,liveFilters={text:'',dept:''},lastRoute='',workingTheme;
function onExit(fn){clean.push(fn)}
function routeParts(){return location.hash.slice(1).split('/')}
function iconCode(d){return '<span class="dept-code">'+d.code+'</span>'}
function applyShell(){
  const html=document.documentElement;html.lang=language;html.dir=tr('rtl','ltr');html.dataset.theme=theme;
  $('#brand-title').textContent=tr('بوابة الهندسة','Engineering Studio');$('#skip').textContent=tr('انتقل إلى المحتوى','Skip to content');
  $('#profile').textContent=tr('الموقع الأكاديمي','Academic website');$('#credit').textContent=tr('د. ياسر الأمين · بوابة الهندسة','Dr. Yassir Al-Ameen · Engineering Studio');
  $('#theme').setAttribute('aria-label',tr('تبديل المظهر الفاتح والداكن','Toggle light and dark theme'));$('#theme').setAttribute('aria-pressed',String(theme==='dark'));
  $('#lang').textContent=tr('EN','عربي');$('#lang').lang=tr('en','ar');$('#lang').setAttribute('aria-label',tr('Switch to English','التبديل إلى العربية'));
  const [view]=routeParts(),active=({department:'catalog',lab:'catalog',interview:'career',practice:'career'})[view]||view||'home';
  $('#nav').setAttribute('aria-label',tr('التنقل الرئيسي','Main navigation'));
  $('#nav').innerHTML=[['home','الرئيسية|Home'],['catalog','دليل التخصصات|Explore'],['labs','المختبرات|Labs'],['career','الاختبارات والمقابلات|Career'],['progress','تقدّمي|Progress']].map(([v,name])=>'<a href="#'+v+'" '+(active===v?'aria-current="page"':'')+'>'+T(name)+'</a>').join('');
}
function head(title,description,parent='#home',parentText=tr('الرئيسية','Home')){
  return '<div class="trail"><a href="'+parent+'">'+parentText+'</a><span aria-hidden="true">/</span><span>'+title+'</span></div><header class="pagehead"><h1>'+title+'</h1><p class="lead">'+description+'</p></header>';
}
const options=()=>departments.map(d=>'<option value="'+d.id+'">'+T(d.title)+'</option>').join('');
function deptCard(d){return '<a class="card" href="'+linkDept(d)+'">'+iconCode(d)+'<h3>'+T(d.title)+'</h3><p>'+d.labs.map(l=>T(l.concept)).join(tr('، ',' · '))+'</p><span class="textlink">'+tr('استكشف التخصص','Explore discipline')+' '+tr('←','→')+'</span></a>'}
function labCard(l){return '<a class="card" href="'+linkLab(l)+'">'+iconCode(department(l.dept))+'<h3>'+T(l.title)+'</h3><p>'+T(l.concept)+'</p><span class="textlink">'+tr('افتح المختبر','Open lab')+' '+tr('←','→')+'</span></a>'}
function feature(){return '<section class="feature section"><div class="eyebrow">'+tr('مقرر جامعي · الاتصالات','University course · Communications')+'</div><h2>'+tr('الاتصالات الرقمية الأولى','Digital Communication I')+'</h2><p>'+tr('ثماني محاضرات مرتبة حسب مفردات المقرر، مع تجارب الإشارة وبنك المسائل المحلولة.','Eight lecture units following the course sequence, with signal experiments and worked problems.')+'</p><div class="actions">'+link(resource(),tr('خريطة المحاضرات','Lecture roadmap'),'primary')+link('digital-communications/academy/sound-lab/?lang='+language,tr('مختبر الصوت وPCM','Audio & PCM lab'))+link('communications-studio.html',tr('فهرس مقرري الاتصالات I وII','Digital Communications I & II index'))+'</div></section>'}
function goalCards(){return '<div class="grid">'+[
  ['#catalog','دراسة مادة|Study a subject','اختر تخصصك، راجع المفهوم وطبّق معادلته على حالة عددية.|Choose a discipline, learn the concept and use its equation in a numerical case.'],
  ['#practice','الاستعداد لاختبار|Prepare for a test','حل مسائل بوقت محدد ثم راجع أخطاءك في المختبر المرتبط بكل سؤال.|Solve timed questions and revisit the lab behind each missed concept.'],
  ['#interview','التدرّب على مقابلة|Rehearse an interview','واجه حالة هندسية، سجّل تفسيرك ثم قارنه بمعايير خاصة بالحالة.|Explain an engineering case in your own words and compare it with a case-specific rubric.']
].map(([url,title,body])=>'<a class="card goal-card" href="'+url+'"><h3>'+T(title)+'</h3><p>'+T(body)+'</p><span class="textlink">'+tr('ابدأ','Start')+' '+tr('←','→')+'</span></a>').join('')+'</div>'}
function sectionTitle(title,url='',label=''){return '<div class="headrow"><h2>'+title+'</h2>'+(url?'<a class="textlink" href="'+url+'">'+label+' '+tr('←','→')+'</a>':'')+'</div>'}
function home(){
 root.innerHTML='<section class="hero"><div><div class="eyebrow">'+tr('استوديو التعلّم الهندسي','Engineering learning studio')+'</div><h1>'+tr('افهم الفكرة.<br><em>اختبرها بنفسك.</em>','Understand the idea.<br><em>Put it to the test.</em>')+'</h1><p>'+tr('من المحاضرة إلى المختبر ثم إلى المقابلة. اختر تخصصك، غيّر قيم النموذج، واستخدم النتيجة لتفسّر قرارك الهندسي.','From the lecture to the lab and the interview. Choose your discipline, adjust a model, and use the results to explain an engineering decision.')+'</p><div class="actions">'+link('#catalog',tr('تصفّح التخصصات','Explore disciplines'),'primary')+link('#labs',tr('ادخل المختبرات','Open the labs'),'secondary')+'</div></div><div class="scope"><div class="screenhead"><span><i class="scope-ind"></i> SIGNAL MONITOR</span><span>1 V/div</span></div><canvas id="wave" role="img" aria-label="'+tr('إشارة جيبية متحركة متغيرة التردد','Live sine wave with adjustable frequency')+'"></canvas><div class="scopefoot"><label for="freq">'+tr('التردد','Frequency')+' <output id="freq-value">2 Hz</output></label><input id="freq" type="range" min="1" max="6" value="2"><button type="button" id="pause"></button></div></div></section><div class="metrics">'+[[departments.length,'تخصصاً هندسياً|engineering disciplines'],[labs.length,'مختبراً تأسيسياً|foundation labs'],[departments.length,'حالة مقابلة|interview cases']].map(([n,s])=>'<div class="meter"><strong>'+n+'</strong>'+T(s)+'</div>').join('')+'</div><section class="section">'+sectionTitle(tr('ما هدفك اليوم؟','What are you here to do?'))+goalCards()+'</section>'+feature()+'<section class="section">'+sectionTitle(tr('استكشف التخصصات','Explore disciplines'),'#catalog',tr('الدليل الكامل','Full directory'))+'<div class="grid">'+[0,4,5,3,9,14].map(i=>deptCard(departments[i])).join('')+'</div></section>';
 wave();
}
function canvasSetup(canvas){const box=canvas.getBoundingClientRect(),ratio=Math.min(window.devicePixelRatio||1,2),w=Math.max(1,box.width),h=Math.max(1,box.height);
 if(canvas.width!==Math.round(w*ratio)||canvas.height!==Math.round(h*ratio)){canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio)}
 const c=canvas.getContext('2d');c.setTransform(ratio,0,0,ratio,0,0);c.clearRect(0,0,w,h);return {c,w,h}}
function wave(){
 const canvas=$('#wave'),slider=$('#freq'),button=$('#pause'),media=matchMedia('(prefers-reduced-motion: reduce)');
 let running=!media.matches,frame=0,phase=0,previous=0;
 const label=()=>{button.textContent=running?tr('إيقاف','Pause'):tr('تشغيل','Play');button.setAttribute('aria-pressed',String(running))};
 const draw=()=>{const {c,w,h}=canvasSetup(canvas),f=Number(slider.value);
 c.lineWidth=1;c.strokeStyle='#295156';c.beginPath();for(let i=0;i<=10;i++){let x=w*i/10;c.moveTo(x,0);c.lineTo(x,h)}for(let i=0;i<=4;i++){let y=h*i/4;c.moveTo(0,y);c.lineTo(w,y)}c.stroke();c.strokeStyle='#bcdfaf';c.lineWidth=2.5;c.beginPath();
 for(let i=0;i<=w;i++){const y=h/2-h/4*Math.sin(i/w*2*Math.PI*f+phase);if(i)c.lineTo(i,y);else c.moveTo(i,y)}c.stroke();
 c.fillStyle='#a4cbc1';c.font='10px monospace';c.fillText('0',3,h-4);c.fillText('1 s',w-22,h-4)};
 const tick=t=>{if(previous)phase=(phase+(t-previous)*Math.PI*2*Number(slider.value)/1000)%(2*Math.PI);previous=t;draw();if(running&&!document.hidden)frame=requestAnimationFrame(tick)};
 const sync=()=>{cancelAnimationFrame(frame);previous=0;label();draw();if(running&&!document.hidden)frame=requestAnimationFrame(tick)};
 slider.oninput=()=>{$('#freq-value').textContent=slider.value+' Hz';draw()};button.onclick=()=>{running=!running;sync()};const resize=new ResizeObserver(draw);resize.observe(canvas);
 document.addEventListener('visibilitychange',sync);const motion=()=>{running=!media.matches;sync()};media.addEventListener('change',motion);sync();
 onExit(()=>{cancelAnimationFrame(frame);resize.disconnect();document.removeEventListener('visibilitychange',sync);media.removeEventListener('change',motion)});
}
const norm=s=>s.toLowerCase().normalize('NFKD').replace(/[\u064b-\u065f\u0670]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').trim();
function catalog(isLabs){
 root.innerHTML=head(isLabs?tr('دليل المختبرات','Laboratory directory'):tr('دليل التخصصات','Discipline directory'),isLabs?tr('ابحث بالموضوع أو المعادلة أو اسم التخصص بالعربية أو الإنجليزية.','Search for a topic, equation or discipline in Arabic or English.'):tr('داخل كل تخصص درسان تأسيسيان بمختبرين عدديين وتدريب للمقابلة. تجد مسار المحاضرات الموسّع داخل هندسة الاتصالات.','Each discipline includes two foundation lessons with numerical labs and an interview case. Communications also has a full lecture pathway.'))+'<div class="toolbar"><label class="control">'+tr('بحث','Search')+'<input id="query" type="search" placeholder="'+tr('مثلاً: الطاقة، مرشح، PCM','e.g. energy, filter, PCM')+'"></label>'+(isLabs?'<label class="control">'+tr('التخصص','Discipline')+'<select id="dept-filter"><option value="">'+tr('جميع التخصصات','All disciplines')+'</option>'+options()+'</select></label>':'')+'</div><p id="matches" role="status" class="muted"></p><section class="grid" id="cards"></section>';
 const filter=()=>{const q=norm(liveFilters.text),id=isLabs?liveFilters.dept:'',pool=isLabs?labs:departments;
 const cards=pool.filter(o=>{const d=isLabs?department(o.dept):o,items=isLabs?[o]:d.labs;
 const hay=[d.title,d.code,...items.flatMap(l=>[l.title,l.concept,l.equation])].join(' ');
 return (!id||d.id===id)&&norm(hay).includes(q)});$('#matches').textContent=cards.length+' '+tr('نتيجة',cards.length===1?'result':'results');$('#cards').innerHTML=cards.length?cards.map(isLabs?labCard:deptCard).join(''):'<p class="empty">'+tr('جرّب كلمة أخرى أو أزل مرشح التخصص.','Try another search or clear the discipline filter.')+'</p>'};
 $('#query').value=liveFilters.text;$('#query').oninput=e=>{liveFilters.text=e.target.value;filter()};if(isLabs){$('#dept-filter').value=liveFilters.dept;$('#dept-filter').onchange=e=>{liveFilters.dept=e.target.value;filter()}}filter();
}
function departmentPage(d){
 root.innerHTML=head(T(d.title),d.labs.map(l=>T(l.concept)).join(tr('، ',' · ')),'#catalog',tr('دليل التخصصات','Discipline directory'))+'<div class="actions">'+link('#practice/'+d.id,tr('اختبار في التخصص','Discipline test'),'primary')+link('#interview/'+d.id,tr('مقابلة في التخصص','Interview case'))+'</div><section class="section">'+sectionTitle(tr('الدروس والمختبرات','Lessons & laboratories'))+'<div class="two">'+d.labs.map(labCard).join('')+'</div></section>'+(d.id==='communications'?feature():'');
}
function givens(l,v){return [l.x,l.y].map((p,i)=>T(p.label)+' '+b(p.symbol+' = '+num(i?v.y:v.x)+' '+p.unit)).join(tr('، ',' · '))}
function inputAnswer(id,title){return '<label class="control">'+title+'<input id="'+id+'" inputmode="decimal" type="text" autocomplete="off" class="numeric"></label>'}
function labPage(l){
 const d=department(l.dept);if(labCase?.id!==l.id)labCase=makeCase(l);
 const controls=[l.x,l.y].map((p,i)=>'<label class="slider"><span>'+T(p.label)+'<output id="v'+i+'"></output></span><input aria-label="'+T(p.label)+'" id="p'+i+'" type="range" min="'+p.min+'" max="'+p.max+'" step="'+p.step+'" value="'+p.initial+'"></label>').join('');
 root.innerHTML=head(T(l.title),T(l.concept),linkDept(d),T(d.title))+'<div class="two"><section class="panel"><h2>'+tr('المفهوم وطريقة الحساب','Concept and calculation')+'</h2><p>'+T(l.note)+'</p><div class="formula">'+l.equation+'</div><h3>'+tr('مثال محلول','Worked example')+'</h3><p>'+givens(l,{x:l.x.initial,y:l.y.initial})+'</p><div class="result">'+T(l.output)+b(num(l.calc(l.x.initial,l.y.initial))+' '+l.unit)+'</div></section><section class="panel"><h2>'+tr('جرّب النموذج','Experiment with the model')+'</h2>'+controls+'<div class="result">'+T(l.output)+'<strong id="out"></strong></div><canvas class="plot" id="plot" role="img" aria-label="'+T(l.output)+' / '+T(l.x.label)+'"></canvas><p id="plot-caption" class="muted"></p></section></div><section class="panel checkpoint section"><h2>'+tr('تحقّق من مهارتك','Check your skill')+'</h2><p id="challenge"></p><form id="check-form">'+inputAnswer('answer',tr('إجابتك','Your answer')+' ('+b(l.unit)+')')+'<div class="actions"><button class="btn primary">'+tr('تحقّق من إجابتي','Check my answer')+'</button><button type="button" id="new-case">'+tr('حالة جديدة','New case')+'</button></div></form><p class="feedback" role="status" id="feedback"></p></section><div class="actions">'+link('#progress',tr('سجلّ مهاراتي','My skill record'))+link('#interview/'+d.id,tr('طبّق تفكيرك في مقابلة','Use this reasoning in an interview'))+'</div>';
 const update=()=>{const x=Number($('#p0').value),y=Number($('#p1').value);$('#v0').textContent=num(x)+' '+l.x.unit;$('#v1').textContent=num(y)+' '+l.y.unit;$('#out').innerHTML=b(num(l.calc(x,y))+' '+l.unit);$('#plot-caption').innerHTML=tr('المحور الأفقي','Horizontal axis')+': '+T(l.x.label)+' '+b('('+l.x.unit+')')+' · '+tr('المحور الرأسي','vertical axis')+': '+T(l.output)+' '+b('('+l.unit+')');plot(l,x,y)};
 $('#p0').oninput=update;$('#p1').oninput=update;
 const observer=new ResizeObserver(update);observer.observe($('#plot'));onExit(()=>observer.disconnect());workingTheme=update;update();
 const show=()=>{$('#challenge').innerHTML=tr('احسب','Calculate')+' '+T(l.output)+' ('+b(l.unit)+'). '+givens(l,labCase)+'. '+tr('تُقبل إجابة ضمن 1% من القيمة المحسوبة.','Answers within 1% are accepted.');$('#answer').value='';$('#feedback').textContent=''};
 $('#new-case').onclick=()=>{labCase=makeCase(l);show()};$('#check-form').onsubmit=e=>{e.preventDefault();const val=$('#answer').value,expected=l.calc(labCase.x,labCase.y),ok=correct(val,expected);$('#feedback').classList.toggle('bad',!ok);
 $('#feedback').textContent=!Number.isFinite(parseAnswer(val))?tr('اكتب قيمة عددية بالوحدة المطلوبة.','Enter a numerical value in the requested unit.'):ok?tr('إجابة صحيحة. سُجّلت هذه الحالة في سجل مهاراتك.','Correct. This case has been recorded in your skill record.'):tr('راجع قيم الحالة ووحدة الناتج، ثم جرّب التعويض في المعادلة أعلاه.','Check the case values and result unit, then substitute into the equation above.');if(ok){progress.skills[l.id]={...labCase,answer:parseAnswer(val),date:Date.now()};saved();if(!storageOK)$('#feedback').textContent+=tr(' التخزين الدائم غير متاح في هذا المتصفح.',' Persistent storage is unavailable in this browser.')}};show();
}
function plot(l,x,y){const {c,w,h}=canvasSetup($('#plot')),styles=getComputedStyle(document.documentElement),color=k=>styles.getPropertyValue(k).trim();const left=59,right=w-14,top=18,bottom=h-31;if(right<=left)return;
 const samples=Array.from({length:101},(_,i)=>{const a=l.x.min+(l.x.max-l.x.min)*i/100;return [a,l.calc(a,y)]});const lo=0,hi=Math.max(...samples.map(z=>z[1]))*1.05||1;
 const px=v=>left+(v-l.x.min)/(l.x.max-l.x.min)*(right-left),py=v=>bottom-(v-lo)/(hi-lo)*(bottom-top);
 c.font='11px Consolas,monospace';c.textBaseline='middle';for(let i=0;i<5;i++){const v=hi*i/4;c.fillStyle=color('--muted');c.textAlign='right';c.fillText(num(v),left-5,py(v));c.strokeStyle=color('--line');c.beginPath();c.moveTo(left,py(v));c.lineTo(right,py(v));c.stroke()}
 c.textBaseline='bottom';c.textAlign='left';c.fillStyle=color('--muted');c.fillText(l.unit,left,top-2);
 for(let i=0;i<=4;i++){const v=l.x.min+(l.x.max-l.x.min)*i/4;c.textAlign=i===4?'right':i===0?'left':'center';c.fillText(num(v),px(v),bottom+16)}
 c.textAlign='center';c.fillText(l.x.symbol+' ('+l.x.unit+')',(right+left)/2,h);
 c.strokeStyle=color('--accent');c.lineWidth=2.5;c.beginPath();samples.forEach(([a,z],i)=>i?c.lineTo(px(a),py(z)):c.moveTo(px(a),py(z)));c.stroke();
 const markerY=py(l.calc(x,y));c.fillStyle=color('--curve');c.beginPath();c.arc(px(x),markerY,5,0,Math.PI*2);c.fill();c.lineWidth=1;
}
function career(){
 root.innerHTML=head(tr('الاختبارات والمقابلات','Tests and interviews'),tr('اختر مهارة تريد إثباتها: حساب صحيح تحت ضغط الوقت، أو تفسير قرار هندسي أمام لجنة.','Choose a skill to demonstrate: numerical reasoning under time pressure, or explaining engineering decisions to an interviewer.'))+'<div class="two">'+[
 ['#practice','اختبار تدريبي مؤقت|Timed practice test','تتغير القيم في كل محاولة. بعد التسليم تحصل على نتيجتك والحل والمختبر الذي يعالج كل خطأ.|Values change on each attempt. After submitting, see your result, the solution and the lab behind each missed question.'],
 ['#interview','مقابلة فنية حسب التخصص|Discipline interview','سيناريو مكتوب لكل تخصص، مع مسودة خاصة بك ومعايير محددة تراجع بها تفكيرك.|A written scenario per discipline, a private draft and specific criteria for reviewing your reasoning.']
 ].map(([url,t,p])=>'<a class="card goal-card" href="'+url+'"><h2>'+T(t)+'</h2><p>'+T(p)+'</p><span class="textlink">'+tr('ابدأ التدريب','Start practice')+'</span></a>').join('')+'</div>'+projectFeature();
}
function projectFeature(){return '<section class="feature section"><p class="eyebrow">'+tr('مشروع مشترك · عمارة وكهرباء وطاقة','Design project · Architecture, electrical & energy')+'</p><h2>'+tr('قاعة دراسية أثناء انقطاع الكهرباء','Keep a classroom running during an outage')+'</h2><p>'+tr('وازن بين استضاءة القاعة، وسعة البطارية، وحدّ الكلفة. اختبر أثر كل مصباح إضافي في مدة التغذية.','Balance classroom illuminance, battery capacity and a budget. Measure the effect of each additional light on backup time.')+'</p><div class="actions">'+link('#project',tr('افتح طاولة التصميم','Open design bench'),'primary')+'</div></section>'}
function project(){
 const t=tr;root.innerHTML=head(t('تصميم قاعة دراسية مستقلة الطاقة','Design an outage-ready classroom'),t('قاعة مساحتها 60 m² وحمل أجهزتها 600 W. حقّق استضاءة 300 lx وتغذية أربع ساعات ضمن ميزانية افتراضية قدرها 850 وحدة.','A 60 m² classroom has a 600 W equipment load. Deliver 300 lx and four hours of backup within an illustrative budget of 850 units.'))+'<div class="two"><section class="panel"><h2>'+t('قرارات التصميم','Design choices')+'</h2><p>'+t('كل مصباح يسحب 30 W ويصدر 3000 lm يصل منها 60% إلى مستوى العمل. سعر المصباح 20 وحدة وسعر كل kWh من البطارية 120 وحدة. المتاح للحمل 80% من سعة البطارية.','Each 30 W light emits 3000 lm, of which 60% reaches the work plane. Each light costs 20 units. Battery capacity costs 120 units per kWh and 80% reaches the load.')+'</p>'+[['lamps','عدد المصابيح|Light count',4,20,1,8],['capacity','سعة البطارية|Battery capacity',2,9,0.5,4]].map(([id,n,min,max,step,v])=>'<label class="slider"><span>'+T(n)+'<output id="'+id+'-value"></output></span><input id="'+id+'" aria-label="'+T(n)+'" type="range" min="'+min+'" max="'+max+'" step="'+step+'" value="'+v+'"></label>').join('')+'</section><section class="panel"><h2>'+t('اختبار القيود','Design constraints')+'</h2><div id="project-outputs"></div><label class="control">'+t('فسّر أثر إضافة مصباح واحد على زمن التغذية','Explain how adding one light affects backup time')+'<textarea id="rationale"></textarea></label><button id="save-design" class="btn primary">'+t('احفظ التصميم وتفسيرك','Save design and reasoning')+'</button><p id="project-status" role="status" class="feedback"></p></section></div><div class="actions">'+link('#lab/light',t('مختبر الاستضاءة','Illuminance lab'))+link('#lab/battery',t('مختبر البطارية','Battery lab'))+'</div>';
 const lamps=$('#lamps'),cap=$('#capacity'),draft=$('#rationale');const last=progress.design;if(last){lamps.value=last.n;cap.value=last.e;draft.value=last.reason||''}
 function results(){const n=+lamps.value,e=+cap.value,p=600+30*n,lux=n*30,hours=800*e/p,cost=20*n+120*e;return {n,e,p,lux,hours,cost,ok:lux>=300&&hours>=4&&cost<=850}}
 const update=()=>{const z=results();$('#lamps-value').textContent=z.n;$('#capacity-value').textContent=z.e+' kWh';$('#project-outputs').innerHTML=[[t('متوسط الاستضاءة','Mean illuminance'),z.lux+' lx',z.lux>=300],[t('إجمالي الحمل','Total load'),z.p+' W',null],[t('زمن التغذية','Backup duration'),num(z.hours)+' h',z.hours>=4],[t('الكلفة الافتراضية','Illustrative cost'),z.cost,z.cost<=850]].map(([s,n,ok])=>'<div class="entry"><span>'+s+'</span><strong>'+b(n)+'</strong>'+(ok===null?'':'<span class="tag">'+(ok?t('متحقق','Met'):t('خارج الحد','Outside limit'))+'</span>')+'</div>').join('');$('#project-status').textContent=''};
 lamps.oninput=cap.oninput=update;update();$('#save-design').onclick=()=>{const z=results();if(!z.ok){$('#project-status').textContent=t('عدّل المصابيح أو سعة البطارية حتى تتحقق القيود الثلاثة.','Adjust the lights or battery size until all three constraints are met.');return}if(!draft.value.trim()){$('#project-status').textContent=t('اكتب تفسير قرارك قبل حفظه.','Explain your decision before saving.');draft.focus();return}progress.design={...z,reason:draft.value.trim(),date:Date.now()};saved();$('#project-status').textContent=t('تحققت القيود وحُفظ تفسيرك مع التصميم.','The constraints are met and your reasoning was saved with the design.')};
}
function date(ts){return new Intl.DateTimeFormat(tr('ar-IQ','en-GB'),{dateStyle:'medium'}).format(ts)}
function selectDept(id,all=false){return '<label class="control">'+tr('التخصص','Discipline')+'<select id="'+id+'">'+(all?'<option value="">'+tr('اختبار شامل للتخصصات','Mixed disciplines test')+'</option>':'')+options()+'</select></label>'}
function examPage(id){
 if(exam?.items?.length){if(Date.now()>=exam.deadline){finishExam();return}runExam();return}
 const d=department(id);
 root.innerHTML=head(tr('اختبار هندسي تدريبي','Engineering practice test'),tr('اختبر الحساب واختيار الوحدة. هذه مسائل تأسيسية أصلية للتدريب، ولا تمثّل نموذج امتحان ترخيص أو جهة توظيف بعينها.','Practice numerical reasoning and unit selection. These original foundation questions are independent of licensing exams and employer assessments.'),'#career',tr('الاختبارات والمقابلات','Tests and interviews'))+'<section class="panel">'+selectDept('exam-dept',true)+'<p id="exam-format"></p><button id="start-exam" class="btn primary">'+tr('ابدأ الاختبار المؤقت','Start timed test')+'</button></section>'+(progress.results.length?'<section class="section">'+sectionTitle(tr('نتيجتك السابقة','Your latest result'))+resultHTML(progress.results[0])+'</section>':'');
 const select=$('#exam-dept');select.value=d?.id||'';const info=()=>{$('#exam-format').textContent=select.value?tr('مسألتان من التخصص، والوقت أربع دقائق.','Two discipline questions in four minutes.'):tr('ثماني مسائل من مجموعة المختبرات، والوقت 16 دقيقة.','Eight questions drawn from the lab collection in 16 minutes.')};info();select.onchange=info;
 $('#start-exam').onclick=()=>{const dept=department(select.value),items=makeExam(dept?.labs??labs);exam={dept:dept?.id||'',items,answers:{},deadline:Date.now()+items.length*120000};write(key+'.exam',exam);render(false)};
}
function runExam(){
 root.innerHTML=head(tr('اختبار جارٍ','Test in progress'),tr('أدخل الرقم بالوحدة المبينة لكل مسألة. تُقبل إجابة ضمن 1%، ويحسب المؤقت الوقت حتى لو أغلقت الصفحة.','Enter each result in the requested unit. Answers within 1% are accepted. The clock continues when the page is closed.'))+'<div class="exam-info"><strong>'+tr('الوقت المتبقي','Time remaining')+'</strong><bdi id="clock"></bdi></div><form id="exam-form" class="panel section">'+exam.items.map((v,i)=>{const l=model(v.id);return '<section class="exam-item"><span class="dept-code">'+department(l.dept).code+'</span><h3>'+b(i+1)+'. '+T(l.title)+'</h3><p>'+T(l.note)+'</p><p>'+givens(l,v)+'</p>'+inputAnswer('q'+i,T(l.output)+' ('+b(l.unit)+')')+'</section>'}).join('')+'<div class="actions"><button class="btn primary">'+tr('سلّم الإجابات','Submit answers')+'</button></div></form>';
 exam.items.forEach((_,i)=>{const input=$('#q'+i);input.value=exam.answers[i]||'';input.oninput=()=>{if(Date.now()>=exam.deadline){finishExam();return}exam.answers[i]=input.value;write(key+'.exam',exam)}});
 $('#exam-form').onsubmit=e=>{e.preventDefault();finishExam()};const tick=()=>{if(!exam)return;const s=Math.ceil((exam.deadline-Date.now())/1000);if(s<=0){finishExam();return}$('#clock').textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};tick();const timer=setInterval(tick,500);onExit(()=>clearInterval(timer));
}
function finishExam(){
 if(!exam)return;const results=exam.items.map((v,i)=>{const l=model(v.id),ans=exam.answers[i]??'',expected=l.calc(v.x,v.y);return {...v,answer:Number.isFinite(parseAnswer(ans))?parseAnswer(ans):null,ok:correct(ans,expected)}});
 progress.results.unshift({dept:exam.dept,results,date:Date.now()});progress.results=progress.results.slice(0,12);exam=null;write(key+'.exam',null);saved();render(false);
}
function resultHTML(attempt){
 const score=attempt.results.filter(r=>r.ok).length;
 return '<div class="panel"><div class="result"><span>'+date(attempt.date)+'</span><strong>'+b(score+' / '+attempt.results.length)+'</strong></div>'+attempt.results.map(v=>{const l=model(v.id);return '<details class="exam-item"><summary>'+T(l.title)+' · '+(v.ok?tr('صحيح','Correct'):tr('للمراجعة','Review'))+'</summary><p>'+givens(l,v)+'</p><div class="formula">'+l.equation+'</div><p>'+tr('إجابتك','Your answer')+' '+b(v.answer===null?'—':num(v.answer)+' '+l.unit)+' · '+tr('الناتج','Result')+' '+b(num(l.calc(v.x,v.y))+' '+l.unit)+'</p><a class="textlink" href="'+linkLab(l)+'">'+tr('راجع المفهوم في المختبر','Review this lab')+'</a></details>'}).join('')+'</div>';
}
function interview(id){
 const d=department(id)||departments[0],draft=progress.drafts[d.id]||{};
 root.innerHTML=head(tr('استوديو المقابلات الفنية','Technical interview studio'),tr('اكتب جوابك كما لو كنت تشرح لمهندس أمامك. بعد المحاولة، راجع شواهد محددة في جوابك وحدد ما تحتاج إلى تقويته.','Write as if explaining to another engineer. Then review specific evidence in your own answer and identify what to strengthen.'),'#career',tr('الاختبارات والمقابلات','Tests and interviews'))+'<div class="two"><section class="panel">'+selectDept('case-dept')+iconCode(d)+'<h2>'+T(d.casePrompt)+'</h2><label class="control">'+tr('إجابتك','Your response')+'<textarea id="draft"></textarea></label><button class="btn primary" id="rubric">'+tr('راجع إجابتي بالمعايير','Review my answer against the rubric')+'</button><p id="case-status" class="feedback" role="status"></p></section><section class="panel" id="rubric-panel" hidden><h2>'+tr('تقييم ذاتي للحالة','Case self-assessment')+'</h2><p>'+tr('ضع علامة أمام كل خطوة فسّرتها بالفعل في جوابك.','Select each step that your answer actually explained.')+'</p>'+d.criteria.map((c,i)=>'<label class="checkrow"><input type="checkbox" id="criterion'+i+'"><span>'+T(c)+'</span></label>').join('')+'<button id="save-review">'+tr('احفظ المراجعة','Save review')+'</button><p id="reviewed" role="status" class="feedback"></p></section></div>';
 $('#case-dept').value=d.id;$('#case-dept').onchange=e=>location.hash='interview/'+e.target.value;$('#draft').value=draft.text||'';
 $('#draft').oninput=e=>{progress.drafts[d.id]={text:e.target.value};delete progress.interviews[d.id];$('#rubric-panel').hidden=true;$('#case-status').textContent='';saved()};
 $('#rubric').onclick=()=>{if(!$('#draft').value.trim()){$('#case-status').textContent=tr('اكتب إجابتك أولاً، ولو بجملة واحدة.','Write your response first, even if just one sentence.');$('#draft').focus();return}$('#rubric-panel').hidden=false;$('#case-status').textContent='';$('#criterion0').focus()};
 if(progress.interviews[d.id]){$('#rubric-panel').hidden=false;d.criteria.forEach((_,i)=>$('#criterion'+i).checked=!!progress.interviews[d.id].checks[i])}
 $('#save-review').onclick=()=>{const checks=d.criteria.map((_,i)=>$('#criterion'+i).checked);progress.interviews[d.id]={checks,date:Date.now()};saved();$('#reviewed').textContent=tr('سُجل تقييمك الذاتي','Self-assessment saved')+' · '+checks.filter(Boolean).length+' / 3'};
}
function skillRecord(){
 const skills=Object.values(progress.skills),cases=Object.entries(progress.interviews),latest=progress.results[0],gap=latest?.results.find(v=>!v.ok&&!progress.skills[v.id])||latest?.results.find(v=>!v.ok&&progress.skills[v.id]?.date<latest.date);
 const design=progress.design;
 root.innerHTML=head(tr('سجلّ مهاراتي','My skill record'),tr('يجمع الحالات التي حللتها ونتائج محاولاتك وتقييمك الذاتي. يُحفظ السجل في هذا المتصفح على هذا الجهاز.','See solved cases, test results and self-assessments. Your record is saved in this browser on this device.'))+'<div class="metrics">'+[[skills.length,'مهارات جرى التحقق منها بمسألة|skills checked with a calculation'],[cases.length,'مقابلات راجعتها ذاتياً|interviews self-reviewed'],[progress.results.length,'اختبارات محفوظة|saved test attempts']].map(([n,s])=>'<div class="meter"><strong>'+n+'</strong>'+T(s)+'</div>').join('')+'</div>'+(gap?'<section class="feature section"><p class="eyebrow">'+tr('بناءً على آخر اختبار','Based on your last test')+'</p><h2>'+T(model(gap.id).concept)+'</h2><p>'+tr('هذا أول مفهوم تعثّرت فيه ولم تحلّ حالة تحقق منه بعد الاختبار.','This is the first missed concept without a successful lab check since that test.')+'</p><div class="actions">'+link(linkLab(model(gap.id)),tr('تدرّب على نقطة الضعف','Practice this concept'),'primary')+'</div></section>':'')+'<section class="section">'+sectionTitle(tr('أدلّة التطبيق','Evidence of practice'))+'<div class="panel">'+(skills.length?skills.map(v=>{const l=model(v.id);return '<div class="entry"><a class="textlink" href="'+linkLab(l)+'">'+T(l.title)+'</a><span>'+givens(l,v)+'</span>'+b(num(v.answer)+' '+l.unit)+'</div>'}).join(''):'<p>'+tr('بعد حل أول حالة في مختبر ستظهر هنا مدخلات تجربتك ونتيجتها.','After you solve a lab case, the inputs and result appear here.')+' <a class="textlink" href="#labs">'+tr('اختر مختبراً','Choose a lab')+'</a></p>')+(design?'<div class="entry"><a href="#project" class="textlink">'+tr('تصميم القاعة','Classroom design')+'</a>'+b(design.lux+' lx · '+num(design.hours)+' h')+'</div>':'')+(cases.length?cases.map(([id,v])=>'<div class="entry"><a class="textlink" href="#interview/'+id+'">'+T(department(id).title)+'</a><span>'+tr('تقييم مقابلة ذاتي','Interview self-assessment')+'</span>'+b(v.checks.filter(Boolean).length+' / 3')+'</div>').join(''):'')+'</div></section>'+(latest?'<section class="section">'+sectionTitle(tr('سجل الاختبارات · آخر 12 محاولة','Test history · last 12 attempts'))+progress.results.map(a=>'<details class="panel"><summary>'+date(a.date)+' · '+(department(a.dept)?T(department(a.dept).title):tr('اختبار شامل','Mixed disciplines'))+' · '+b(a.results.filter(v=>v.ok).length+' / '+a.results.length)+'</summary>'+resultHTML(a)+'</details>').join('')+'</section>':'');
}
function render(scroll=true){
 clean.splice(0).forEach(f=>f());workingTheme=null;const [v,id]=routeParts();applyShell();
 if(lastRoute!==v&&v!=='labs'&&v!=='catalog')liveFilters={text:'',dept:''};
 if(v!=='lab')labCase=null;
 if(v==='catalog'||v==='labs')catalog(v==='labs');else if(v==='department'&&department(id))departmentPage(department(id));else if(v==='lab'&&model(id))labPage(model(id));else if(v==='career')career();else if(v==='project')project();else if(v==='practice')examPage(id);else if(v==='interview')interview(id);else if(v==='progress')skillRecord();else if(!v||v==='home'){home();root.insertAdjacentHTML('beforeend',projectFeature())}else{root.innerHTML=head(tr('المسار غير موجود','Page not found'),tr('اختر تخصصاً من الدليل للمتابعة.','Choose a discipline in the directory to continue.'))+link('#catalog',tr('دليل التخصصات','Explore disciplines'))}
 lastRoute=v;document.title=(!v||v==='home'?tr('بوابة الهندسة','Engineering Studio'):(root.querySelector('h1')?.textContent||'Engineering Studio'))+' · Yassir Al-Ameen';
 if(scroll){window.scrollTo(0,0);root.focus({preventScroll:true})}
}
$('#theme').onclick=()=>{theme=theme==='dark'?'light':'dark';write(key+'.theme',theme);applyShell();workingTheme?.()};
$('#lang').onclick=()=>{language=language==='ar'?'en':'ar';write(key+'.lang',language);const u=new URL(location.href);u.searchParams.set('lang',language);history.replaceState(null,'',u);render(false)};
$('#skip').onclick=e=>{e.preventDefault();root.focus();root.scrollIntoView()};
addEventListener('hashchange',()=>render());render(false);
