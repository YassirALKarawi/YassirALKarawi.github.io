import {directoryURL,teachingDirectory} from './directory.mjs?v=bench-links1';
import {subjects,stages} from './curriculum.mjs';
import {attachBench} from './bench.mjs?v=scale1';
import {examForms,testDeck,unitFor,theory} from './questions.mjs';
import {stageLabel,degreeMap,subjectPage,subjectLink,bankView,formNames,prompt,responseField,isCorrect,solution} from './study-views.mjs';
import {courseDepartment, courseSubjects, courseLabs as labs} from './communications.mjs';
import {makeCase,correct,parseAnswer} from './assessment.mjs';
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
const department=id=>id===courseDepartment.id?courseDepartment:undefined;
const model=id=>labs.find(d=>d.id===id);
const num=n=>new Intl.NumberFormat('en',{maximumSignificantDigits:4,useGrouping:false}).format(n);
const tr=(ar,en)=>language==='ar'?ar:en;
const link=(url,label,kind='')=>'<a class="btn '+kind+'" href="'+url+'">'+label+'</a>';
const resource=(view='course')=>'digital-communications/academy/?view='+view+'&amp;lang='+language+(view==='course'?'#lecture-roadmap':'');
const linkDept=d=>'#department/'+d.id, linkLab=l=>'#lab/'+l.id;
let clean=[],labCase,renderedHash,workingTheme;
function onExit(fn){clean.push(fn)}
function routeParts(){return location.hash.slice(1).split('/')}
function iconCode(d){return '<span class="dept-code">'+d.code+'</span>'}
function applyShell(){
  const html=document.documentElement;html.lang=language;html.dir=tr('rtl','ltr');html.dataset.theme=theme;
  document.querySelector('.brand .portrait').alt=tr('د. ياسر الأمين','Dr Yassir Al-Ameen');
  $('#brand-title').textContent=tr('بوابة الهندسة','Engineering Studio');$('#skip').textContent=tr('انتقل إلى المحتوى','Skip to content');
  $('#profile').textContent=tr('الموقع الأكاديمي','Academic website');$('#credit').textContent=tr('د. ياسر الأمين · بوابة الهندسة','Dr. Yassir Al-Ameen · Engineering Studio');
  $('#theme').setAttribute('aria-label',tr('تبديل المظهر الفاتح والداكن','Toggle light and dark theme'));$('#theme').setAttribute('aria-pressed',String(theme==='dark'));
  $('#lang').textContent=tr('EN','عربي');$('#lang').lang=tr('en','ar');$('#lang').setAttribute('aria-label',tr('Switch to English','Switch to Arabic'));
  const [view]=routeParts(),active=({catalog:'lectures',department:'lectures',lab:'labs',subject:'lectures',bank:'career',interview:'career',practice:'career'})[view]||view||'home';
  $('#nav').setAttribute('aria-label',tr('التنقل الرئيسي','Main navigation'));
  const items = [
    ['home','#home','الرئيسية|Home'],
    ['lectures',directoryURL('lectures',language),'المحاضرات|Lectures'],
    ['labs',directoryURL('labs',language),'المختبرات|Laboratories'],
    ['career','#career','الاختبارات والمقابلات|Tests and interviews'],
    ['progress','#progress','تقدمي|My progress']
  ];
  $('#nav').innerHTML=items.map(([id,url,label])=>'<a href="'+url+'" '+(active===id?'aria-current="page"':'')+'>'+T(label)+'</a>').join('');
}
function head(title,description,parent='#home',parentText=tr('الرئيسية','Home')){
  const [view,id,sub,topic]=routeParts();
  const crumbs = new Map([['#home',tr('رئيسية البوابة','Studio home')]]);
  let dept,subject;
  if (['subject','bank','practice','interview','department'].includes(view)) {dept=department(id);subject=sub;}
  if (view==='lab' && department(sub)) {dept=department(sub);subject=topic;}
  if (view==='lab') {
    crumbs.set(directoryURL('labs',language),tr('المختبرات','Laboratories'));
    if(dept && subjects[subject]?.models.includes(id)) crumbs.set(subjectLink(dept,subject),T(subjects[subject].title));
  } else if (dept) {
    crumbs.set(directoryURL('lectures',language),tr('المحاضرات','Lectures'));
    if(view!=='department' || sub) crumbs.set(linkDept(dept),T(dept.title));
    const year=stages(dept.id).findIndex(group=>group.includes(subject));
    if(year>=0){
      crumbs.set(linkDept(dept)+'/'+(year+1),stageLabel(year,T));
      if(view!=='subject') crumbs.set(subjectLink(dept,subject),T(subjects[subject].title));
    }
  } else if(parent!=='#home') crumbs.set(parent,parentText);
  const current=view==='department'&&sub?stageLabel(Number(sub)-1,T)||title:title;
  const trail=[...crumbs].map(([href,label])=>'<a href="'+href+'">'+label+'</a>').join('<span aria-hidden="true">/</span>');
  return '<nav class="trail" data-trail aria-label="'+tr('مسار الصفحة','Breadcrumb')+'">'+trail+'<span aria-hidden="true">/</span><span aria-current="page">'+current+'</span></nav><header class="pagehead"><h1>'+title+'</h1><p class="lead">'+description+'</p></header>';

}
function feature(){return '<section class="feature section"><div class="eyebrow">'+tr('مقرر جامعي · الاتصالات','University course · Communications')+'</div><h2>'+tr('الاتصالات الرقمية الأولى','Digital Communication I')+'</h2><p>'+tr('ثماني محاضرات مرتبة حسب مفردات المقرر، مع تجارب الإشارة وبنك المسائل المحلولة.','Eight lecture units following the course sequence, with signal experiments and worked problems.')+'</p><div class="actions">'+link(resource(),tr('خريطة المحاضرات','Lecture roadmap'),'primary')+link('digital-communications/academy/sound-lab/?lang='+language,tr('مختبر الصوت وPCM','Audio & PCM lab'))+link('communications-studio.html',tr('فهرس مقرري الاتصالات I وII','Digital Communications I & II index'))+'</div></section>'}
function sectionTitle(title,url='',label=''){return '<div class="headrow"><h2>'+title+'</h2>'+(url?'<a class="textlink" href="'+url+'">'+label+' '+tr('←','→')+'</a>':'')+'</div>'}
function home(){
 root.innerHTML='<section class="studio-directory"><p class="eyebrow">'+tr('كلية الهندسة · جامعة ديالى','College of Engineering · University of Diyala')+'</p><h1>'+tr('قسم هندسة الاتصالات','Communications Engineering')+'</h1>'+teachingDirectory(language)+'</section>'+
 '<div class="faculty-more">'+link('#catalog',tr('خطة التعلم حسب المرحلة','Study plan by stage'))+link('#career',tr('الاختبارات والمقابلات','Tests and interviews'))+link('#progress',tr('تقدّمي','My progress'))+'</div>'+
 '<details class="faculty-archive"><summary>'+tr('مراقب الإشارة','Signal monitor')+'</summary><div class="scope"><div class="screenhead"><span><i class="scope-ind"></i> SIGNAL MONITOR</span><span>1 V/div</span></div><canvas id="wave" role="img" aria-label="'+tr('إشارة جيبية متحركة متغيرة التردد','Live sine wave with adjustable frequency')+'"></canvas><div class="scopefoot"><label for="freq">'+tr('التردد','Frequency')+' <output id="freq-value">2 Hz</output></label><input id="freq" type="range" min="1" max="6" value="2"><button type="button" id="pause"></button></div></div></details>'+
 '<details class="faculty-archive"><summary>'+tr('أرشيف المقررات','Course archive')+'</summary>'+link('/learning/communications-studio.html',tr('فهرس مقررات الاتصالات الأصلي','Original communications course index'))+'</details>';
 wave();
}
function canvasSetup(canvas){const box=canvas.getBoundingClientRect(),ratio=Math.min(window.devicePixelRatio||1,2),w=Math.max(1,box.width),h=Math.max(1,box.height);
 if(canvas.width!==Math.round(w*ratio)||canvas.height!==Math.round(h*ratio)){canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio)}
 const c=canvas.getContext('2d');c.setTransform(ratio,0,0,ratio,0,0);c.clearRect(0,0,w,h);return {c,w,h}}
function wave(){
 const canvas=$('#wave'),slider=$('#freq'),button=$('#pause'),media=matchMedia('(prefers-reduced-motion: reduce)');
 const panel=canvas.closest('details');
 let running=!media.matches,frame=0,phase=0,previous=0;
 const label=()=>{button.textContent=running?tr('إيقاف','Pause'):tr('تشغيل','Play');button.setAttribute('aria-pressed',String(running))};
 const draw=()=>{const {c,w,h}=canvasSetup(canvas),f=Number(slider.value);
 c.lineWidth=1;c.strokeStyle='#295156';c.beginPath();for(let i=0;i<=10;i++){let x=w*i/10;c.moveTo(x,0);c.lineTo(x,h)}for(let i=0;i<=4;i++){let y=h*i/4;c.moveTo(0,y);c.lineTo(w,y)}c.stroke();c.strokeStyle='#bcdfaf';c.lineWidth=2.5;c.beginPath();
 for(let i=0;i<=w;i++){const y=h/2-h/4*Math.sin(i/w*2*Math.PI*f+phase);if(i)c.lineTo(i,y);else c.moveTo(i,y)}c.stroke();
 c.fillStyle='#a4cbc1';c.font='10px monospace';c.fillText('0',3,h-4);c.fillText('1 s',w-22,h-4)};
 const tick=t=>{if(previous)phase=(phase+(t-previous)*Math.PI*2*Number(slider.value)/1000)%(2*Math.PI);previous=t;draw();if(running&&panel.open&&!document.hidden)frame=requestAnimationFrame(tick)};
 const sync=()=>{cancelAnimationFrame(frame);previous=0;label();draw();if(running&&panel.open&&!document.hidden)frame=requestAnimationFrame(tick)};
 slider.oninput=()=>{$('#freq-value').textContent=slider.value+' Hz';draw()};button.onclick=()=>{running=!running;sync()};const resize=new ResizeObserver(draw);resize.observe(canvas);
 panel.ontoggle=sync;document.addEventListener('visibilitychange',sync);const motion=()=>{running=!media.matches;sync()};media.addEventListener('change',motion);sync();
 onExit(()=>{cancelAnimationFrame(frame);resize.disconnect();document.removeEventListener('visibilitychange',sync);media.removeEventListener('change',motion)});
}
function departmentPage(d,year){
 root.innerHTML=head(T(d.title),tr('اختر مرحلة لعرض موادها أو ابدأ تدريباً يغطي موضوعات القسم.','Select a stage to see its subjects, or practice across the discipline.'),'#catalog',tr('منهج الاتصالات','Communications curriculum'))+'<div class="actions">'+link('#bank/'+d.id,tr('بنك تمارين القسم','Department exercise bank'),'primary')+link('#practice/'+d.id,tr('نماذج اختبارات القسم','Department test forms'))+link('#interview/'+d.id,tr('مقابلة فنية','Technical interview'))+'</div>'+degreeMap(d,year,T)+(d.id==='communications'?feature():'');
}
function givens(l,v){return [l.x,l.y].map((p,i)=>T(p.label)+' '+b(p.symbol+' = '+num(i?v.y:v.x)+' '+p.unit)).join(tr('، ',' · '))}
function inputAnswer(id,title){return '<label class="control">'+title+'<input id="'+id+'" inputmode="decimal" type="text" autocomplete="off" class="numeric"></label>'}
function labPage(l,contextDept,contextSubject){
 const d=courseDepartment;if(labCase?.id!==l.id)labCase=makeCase(l);
 const controls=[l.x,l.y].map((p,i)=>'<label class="slider"><span>'+T(p.label)+'<output id="v'+i+'"></output></span><input aria-label="'+T(p.label)+'" id="p'+i+'" type="range" min="'+p.min+'" max="'+p.max+'" step="'+p.step+'" value="'+p.initial+'"></label>').join('');
 root.innerHTML=head(T(l.title),T(l.concept),contextDept?subjectLink(contextDept,contextSubject):linkDept(d),contextDept?T(subjects[contextSubject].title):T(d.title))+'<div class="two"><section class="panel"><h2>'+tr('المفهوم وطريقة الحساب','Concept and calculation')+'</h2><p>'+T(l.note)+'</p><div class="formula">'+l.equation+'</div><h3>'+tr('مثال محلول من القيم الابتدائية','Worked example at the initial settings')+'</h3><p>'+givens(l,{x:l.x.initial,y:l.y.initial})+'</p><div class="result">'+T(l.output)+b(num(l.calc(l.x.initial,l.y.initial))+' '+l.unit)+'</div></section><section class="panel"><h2>'+tr('المنحنى النظري عند قيم المنزلقات','Theoretical curve at the slider settings')+'</h2>'+controls+'<div class="result">'+T(l.output)+'<strong id="out"></strong></div><canvas class="plot" id="plot" role="img" aria-label="'+T(l.output)+' / '+T(l.x.label)+'"></canvas><p id="plot-caption" class="muted"></p></section></div><section class="panel checkpoint section"><h2>'+tr('تحقّق من مهارتك','Check your skill')+'</h2><p id="challenge"></p><form id="check-form">'+inputAnswer('answer',tr('إجابتك','Your answer')+' ('+b(l.unit)+')')+'<div class="actions"><button class="btn primary">'+tr('تحقّق من إجابتي','Check my answer')+'</button><button type="button" id="new-case">'+tr('حالة جديدة','New case')+'</button></div></form><p class="feedback" role="status" id="feedback"></p></section><div class="actions">'+link('#progress',tr('سجلّ مهاراتي','My skill record'))+link('#interview/'+d.id,tr('طبّق تفكيرك في مقابلة','Use this reasoning in an interview'))+'</div>';
 const host=document.createElement('section');host.className='panel live-bench';root.querySelector('.pagehead').after(host);
 const wiring={rc:'rc',charging:'rc',ohm:'power',copper:'power',pcm:'sample',adc:'sample'};
 const bench=attachBench(host,l,()=>[Number($('#p0').value),Number($('#p1').value)],T);
 const inputs=document.createElement('div');inputs.className='bench-inputs';root.querySelectorAll('label.slider').forEach(label=>inputs.append(label));host.querySelector('.instrument').before(inputs);
 if(wiring[l.id]){const tools=document.createElement('div');tools.className='actions';tools.innerHTML=link('digital-communications/academy/student-path/circuits.html?lang='+language+'&kit='+wiring[l.id],tr('منضدة التوصيل الحر والمجسات','Free wiring & instrument probes'));host.append(tools)}
 onExit(bench.destroy);
 const update=()=>{const x=Number($('#p0').value),y=Number($('#p1').value);$('#v0').textContent=num(x)+' '+l.x.unit;$('#v1').textContent=num(y)+' '+l.y.unit;$('#out').innerHTML=b(num(l.calc(x,y))+' '+l.unit);$('#plot-caption').innerHTML=tr('المحور الأفقي','Horizontal axis')+': '+T(l.x.label)+' '+b('('+l.x.unit+')')+' · '+tr('المحور الرأسي','vertical axis')+': '+T(l.output)+' '+b('('+l.unit+')');plot(l,x,y)};
 const apply=()=>{update();bench.refresh()};$('#p0').oninput=apply;$('#p1').oninput=apply;
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
 ['#interview','مقابلة هندسة الاتصالات|Communications interview','سيناريو من هندسة الاتصالات، مع مسودة خاصة بك ومعايير محددة تراجع بها تفكيرك.|A communications engineering scenario, a private draft and specific criteria for reviewing your reasoning.']
 ].map(([url,t,p])=>'<a class="card goal-card" href="'+url+'"><h2>'+T(t)+'</h2><p>'+T(p)+'</p><span class="textlink">'+tr('ابدأ التدريب','Start practice')+'</span></a>').join('')+'</div>';
}
function date(ts){return new Intl.DateTimeFormat(tr('ar-IQ','en-GB'),{dateStyle:'medium'}).format(ts)}
function examPage(id,sid){
 if(exam?.items?.length && (!exam.dept||department(exam.dept)) && exam.items.every(v=>model(v.id))){if(Date.now()>=exam.deadline){finishExam();return}runExam();return}
 const initial=department(id),initialSubject=initial&&stages(id).flat().includes(sid)?sid:'';
 root.innerHTML=head(tr('نماذج الاختبارات الهندسية','Engineering practice tests'),tr('اختر المادة وصيغة الاختبار. هذه نماذج تدريب أصلية، ويمكن إعادة توليدها بقيم جديدة.','Select the subject and test format. These original practice tests can be regenerated with new values.'),'#career',tr('الاختبارات والمقابلات','Tests and interviews'))+'<section class="panel">'+'<label class="control">'+tr('المادة','Subject')+'<select id="exam-subject"></select></label><label class="control">'+tr('صيغة الاختبار','Test format')+'<select id="exam-form-select">'+Object.entries(formNames).map(([k,v])=>'<option value="'+k+'">'+T(v)+'</option>').join('')+'</select></label><p id="exam-format"></p><button id="start-exam" class="btn primary">'+tr('ابدأ الاختبار المؤقت','Start timed test')+'</button></section>'+(progress.results.length?'<section class="section">'+sectionTitle(tr('نتيجتك السابقة','Your latest result'))+resultHTML(progress.results[0])+'</section>':'');
 root.insertAdjacentHTML('beforeend','<section class="section panel"><h2>'+tr('تدريب إضافي ومواصفات رسمية','Further practice and official specifications')+'</h2><a class="textlink source-link" href="https://ncees.org/exams/fe-exam/">'+tr('مواصفات اختبار FE حسب التخصص · NCEES','Discipline-specific FE exam specifications · NCEES')+'</a><a class="textlink source-link" href="https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/pages/assignments/">'+tr('مسائل الدوائر والإلكترونيات · MIT','Circuits and electronics problem sets · MIT')+'</a><a class="textlink source-link" href="https://ocw.mit.edu/courses/6-003-signals-and-systems-fall-2011/">'+tr('تمارين وامتحانات الإشارات والأنظمة · MIT','Signals and systems problems and exams · MIT')+'</a></section>');
 const sub=$('#exam-subject'),form=$('#exam-form-select');
 const info=()=>{const [count,min]=examForms[form.value];$('#exam-format').textContent=tr('عدد الأسئلة','Questions')+' '+count+' · '+tr('المدة','Duration')+' '+min+' '+tr('دقيقة','minutes')};
 const options=()=>{sub.innerHTML='<option value="">'+tr('كل المواد المتاحة','All available subjects')+'</option>'+courseSubjects.map(k=>'<option value="'+k+'">'+T(subjects[k].title)+'</option>').join('');info()};
 options();sub.value=initialSubject;form.onchange=info;
 $('#start-exam').onclick=()=>{const pool=sub.value?subjects[sub.value].models.map(model):labs;
 const items=testDeck(pool,form.value);exam={dept:courseDepartment.id,subject:sub.value,form:form.value,items,answers:{},deadline:Date.now()+examForms[form.value][1]*60000};write(key+'.exam',exam);render(false)};
}
function runExam(){
 root.innerHTML=head(exam.form?T(formNames[exam.form]):tr('اختبار جارٍ','Test in progress'),tr('أدخل الرقم بالوحدة المحددة أو اختر التفسير الصحيح. تُقبل إجابة عددية ضمن 1%. يستمر المؤقت عند إغلاق الصفحة.','Enter the requested unit or select an explanation. Numerical answers within 1% are accepted. The clock continues when the page is closed.'))+'<div class="exam-info"><strong>'+tr('الوقت المتبقي','Time remaining')+'</strong><bdi id="clock"></bdi></div><form id="exam-form" class="panel section">'+exam.items.map((v,i)=>{const l=model(v.id);return '<section class="exam-item"><span class="dept-code">'+courseDepartment.code+'</span><h3>'+b(i+1)+'. '+T(l.title)+'</h3>'+(v.kind==='diagnosis'?'':'<p>'+T(l.note)+'</p>')+'<p>'+prompt(l,v,T)+'</p>'+responseField(l,v,T,'q'+i)+'</section>'}).join('')+'<div class="actions"><button class="btn primary">'+tr('سلّم الإجابات','Submit answers')+'</button></div></form>';
 exam.items.forEach((v,i)=>{const input=$('#q'+i);input.value=exam.answers[i]??'';const record=()=>{if(!exam)return;if(Date.now()>=exam.deadline){finishExam();return}exam.answers[i]=input.value;write(key+'.exam',exam)};input.oninput=record;input.onchange=record});
 $('#exam-form').onsubmit=e=>{e.preventDefault();finishExam()};const tick=()=>{if(!exam)return;const s=Math.ceil((exam.deadline-Date.now())/1000);if(s<=0){finishExam();return}$('#clock').textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};const timer=setInterval(tick,500);onExit(()=>clearInterval(timer));tick();
}
function finishExam(){
 if(!exam)return;const results=exam.items.map((v,i)=>{const l=model(v.id),raw=exam.answers[i]??'',ans=parseAnswer(raw);return {...v,answer:Number.isFinite(ans)?ans:null,ok:isCorrect(l,v,raw)}});
 progress.results.unshift({dept:exam.dept,subject:exam.subject,form:exam.form,results,date:Date.now()});progress.results=progress.results.slice(0,12);exam=null;write(key+'.exam',null);saved();render(false);
}
function resultHTML(attempt){
 const score=attempt.results.filter(r=>r.ok).length;
 return '<div class="panel"><div class="result"><span>'+date(attempt.date)+(attempt.form?' · '+T(formNames[attempt.form]):'')+'</span><strong>'+b(score+' / '+attempt.results.length)+'</strong></div>'+attempt.results.map(v=>{const l=model(v.id);const chosen=v.answer===null?'—':v.kind==='diagnosis'?T(theory(v.id).options[v.order[v.answer]]):b(num(v.answer)+' '+unitFor(l,v));return '<details class="exam-item"><summary>'+T(l.title)+' · '+(v.ok?tr('صحيح','Correct'):tr('للمراجعة','Review'))+'</summary><p>'+prompt(l,v,T)+'</p><p>'+tr('إجابتك','Your answer')+' '+chosen+'</p><p>'+solution(l,v,T)+'</p><a class="textlink" href="'+linkLab(l)+'">'+tr('افتح المختبر','Review this lab')+'</a></details>'}).join('')+'</div>';
}
function interview(id){
 const d=courseDepartment,draft=progress.drafts[d.id]||{};
 root.innerHTML=head(tr('استوديو المقابلات الفنية','Technical interview studio'),tr('اكتب جوابك كما لو كنت تشرح لمهندس أمامك. بعد المحاولة، راجع شواهد محددة في جوابك وحدد ما تحتاج إلى تقويته.','Write as if explaining to another engineer. Then review specific evidence in your own answer and identify what to strengthen.'),'#career',tr('الاختبارات والمقابلات','Tests and interviews'))+'<div class="two"><section class="panel">'+iconCode(d)+'<h2>'+T(d.casePrompt)+'</h2><label class="control">'+tr('إجابتك','Your response')+'<textarea id="draft"></textarea></label><button class="btn primary" id="rubric">'+tr('راجع إجابتي بالمعايير','Review my answer against the rubric')+'</button><p id="case-status" class="feedback" role="status"></p></section><section class="panel" id="rubric-panel" hidden><h2>'+tr('تقييم ذاتي للحالة','Case self-assessment')+'</h2><p>'+tr('ضع علامة أمام كل خطوة فسّرتها بالفعل في جوابك.','Select each step that your answer actually explained.')+'</p>'+d.criteria.map((c,i)=>'<label class="checkrow"><input type="checkbox" id="criterion'+i+'"><span>'+T(c)+'</span></label>').join('')+'<button id="save-review">'+tr('احفظ المراجعة','Save review')+'</button><p id="reviewed" role="status" class="feedback"></p></section></div>';
 $('#draft').value=draft.text||'';
 $('#draft').oninput=e=>{progress.drafts[d.id]={text:e.target.value};delete progress.interviews[d.id];$('#rubric-panel').hidden=true;$('#case-status').textContent='';saved()};
 $('#rubric').onclick=()=>{if(!$('#draft').value.trim()){$('#case-status').textContent=tr('اكتب إجابتك أولاً، ولو بجملة واحدة.','Write your response first, even if just one sentence.');$('#draft').focus();return}$('#rubric-panel').hidden=false;$('#case-status').textContent='';$('#criterion0').focus()};
 if(progress.interviews[d.id]){$('#rubric-panel').hidden=false;d.criteria.forEach((_,i)=>$('#criterion'+i).checked=!!progress.interviews[d.id].checks[i])}
 $('#save-review').onclick=()=>{const checks=d.criteria.map((_,i)=>$('#criterion'+i).checked);progress.interviews[d.id]={checks,date:Date.now()};saved();$('#reviewed').textContent=tr('سُجل تقييمك الذاتي','Self-assessment saved')+' · '+checks.filter(Boolean).length+' / 3'};
}
function skillRecord(){
 const attempts=progress.results.filter(a=>(!a.dept||department(a.dept))&&a.results.every(v=>model(v.id)));
 const skills=Object.values(progress.skills).filter(v=>model(v.id)),cases=Object.entries(progress.interviews).filter(([id])=>department(id)),latest=attempts[0],gap=latest?.results.find(v=>!v.ok&&!progress.skills[v.id])||latest?.results.find(v=>!v.ok&&progress.skills[v.id]?.date<latest.date);

 root.innerHTML=head(tr('سجلّ مهاراتي','My skill record'),tr('يجمع الحالات التي حللتها ونتائج محاولاتك وتقييمك الذاتي. يُحفظ السجل في هذا المتصفح على هذا الجهاز.','See solved cases, test results and self-assessments. Your record is saved in this browser on this device.'))+'<div class="metrics">'+[[skills.length,'مهارات جرى التحقق منها بمسألة|skills checked with a calculation'],[cases.length,'مقابلات راجعتها ذاتياً|interviews self-reviewed'],[attempts.length,'اختبارات محفوظة|saved test attempts']].map(([n,s])=>'<div class="meter"><strong>'+n+'</strong>'+T(s)+'</div>').join('')+'</div>'+(gap?'<section class="feature section"><p class="eyebrow">'+tr('بناءً على آخر اختبار','Based on your last test')+'</p><h2>'+T(model(gap.id).concept)+'</h2><p>'+tr('هذا أول مفهوم تعثّرت فيه ولم تحلّ حالة تحقق منه بعد الاختبار.','This is the first missed concept without a successful lab check since that test.')+'</p><div class="actions">'+link(linkLab(model(gap.id)),tr('تدرّب على نقطة الضعف','Practice this concept'),'primary')+'</div></section>':'')+'<section class="section">'+sectionTitle(tr('أدلّة التطبيق','Evidence of practice'))+'<div class="panel">'+(skills.length?skills.map(v=>{const l=model(v.id);return '<div class="entry"><a class="textlink" href="'+linkLab(l)+'">'+T(l.title)+'</a><span>'+givens(l,v)+'</span>'+b(num(v.answer)+' '+l.unit)+'</div>'}).join(''):'<p>'+tr('بعد حل أول حالة في مختبر ستظهر هنا مدخلات تجربتك ونتيجتها.','After you solve a lab case, the inputs and result appear here.')+' <a class="textlink" href="#labs">'+tr('اختر مختبراً','Choose a lab')+'</a></p>')+(cases.length?cases.map(([id,v])=>'<div class="entry"><a class="textlink" href="#interview/'+id+'">'+T(department(id).title)+'</a><span>'+tr('تقييم مقابلة ذاتي','Interview self-assessment')+'</span>'+b(v.checks.filter(Boolean).length+' / 3')+'</div>').join(''):'')+'</div></section>'+(latest?'<section class="section">'+sectionTitle(tr('سجل الاختبارات · آخر 12 محاولة','Test history · last 12 attempts'))+attempts.map(a=>'<details class="panel"><summary>'+date(a.date)+' · '+(department(a.dept)?T(department(a.dept).title):tr('اختبار شامل','Mixed disciplines'))+' · '+b(a.results.filter(v=>v.ok).length+' / '+a.results.length)+'</summary>'+resultHTML(a)+'</details>').join('')+'</section>':'');
}
function render(scroll=true){
 clean.splice(0).forEach(f=>f());workingTheme=null;const [v,id,sub,topic]=routeParts();applyShell();
 if(v==='labs'||v==='lectures'){location.replace(directoryURL(v,language));return}
 if(v!=='lab')labCase=null;
 if(v==='catalog')departmentPage(courseDepartment,0);else if(v==='department'&&department(id))departmentPage(department(id),Number(sub)>=1&&Number(sub)<=4?sub:0);
 else if(v==='subject'&&department(id)&&stages(id).flat().includes(sub)){root.innerHTML=subjectPage(department(id),sub,T,head,link,resource);const l=model(subjects[sub].models[0]);const preview=document.createElement('section');preview.className='live-bench panel section';root.querySelector('.source-link').closest('section').before(preview);const values=[l.x.initial,l.y.initial];const bench=attachBench(preview,l,()=>values,T);const controls=document.createElement('div');controls.className='bench-inputs';controls.innerHTML=[l.x,l.y].map(p=>'<label class="slider"><span>'+T(p.label)+'<output>'+num(p.initial)+' '+p.unit+'</output></span><input aria-label="'+T(p.label)+'" type="range" min="'+p.min+'" max="'+p.max+'" step="'+p.step+'" value="'+p.initial+'"></label>').join('');preview.querySelector('.instrument').before(controls);controls.querySelectorAll('input').forEach((el,i)=>el.oninput=()=>{values[i]=Number(el.value);controls.querySelectorAll('output')[i].textContent=num(values[i])+' '+[l.x.unit,l.y.unit][i];bench.refresh()});onExit(bench.destroy)}
 else if(v==='bank'&&department(id))bankView(root,department(id),stages(id).flat().includes(sub)?sub:null,topic,T,head,link);
 else if(v==='lab'&&model(id)){const d=department(sub);labPage(model(id),d&&stages(d.id).flat().includes(topic)&&subjects[topic].models.includes(id)?d:null,topic)}else if(v==='career')career();else if(v==='practice')examPage(id,sub);else if(v==='interview')interview(id);else if(v==='progress')skillRecord();else if(!v||v==='home'){home()}else{root.innerHTML=head(tr('المسار غير موجود','Page not found'),tr('انتقل إلى منهج الاتصالات للمتابعة.','Open the communications curriculum to continue.'))+link('#catalog',tr('منهج الاتصالات','Communications curriculum'))}
 renderedHash=location.hash;document.title=(!v||v==='home'?tr('بوابة الهندسة','Engineering Studio'):(root.querySelector('h1')?.textContent||'Engineering Studio'))+' · Yassir Al-Ameen';
 dispatchEvent(new Event('studio:route'));
 if(scroll){window.scrollTo({top:history.state?.studioScroll||0,behavior:'instant'});root.focus({preventScroll:true})}
}
$('#theme').onclick=()=>{theme=theme==='dark'?'light':'dark';write(key+'.theme',theme);applyShell();workingTheme?.()};
$('#lang').onclick=()=>{language=language==='ar'?'en':'ar';write(key+'.lang',language);const u=new URL(location.href);u.searchParams.set('lang',language);history.replaceState(history.state,'',u);render(false)};
$('#skip').onclick=e=>{e.preventDefault();root.focus();root.scrollIntoView()};
function savePosition(){
 if(renderedHash===location.hash && history.state?.studioScroll!==scrollY)history.replaceState({...history.state,studioScroll:scrollY},'');
}
let scrollTimer;
addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(savePosition,140)},{passive:true});
document.addEventListener('click',savePosition,true);
addEventListener('pagehide',savePosition);
addEventListener('hashchange',()=>render());render(false);
