import {subjects,sources,stages,coveredModels} from './curriculum.mjs';
import {labs,departments} from './catalog.mjs?v=curr2';
import {formats,exercise,theory,answerFor,unitFor} from './questions.mjs';
import {correct,parseAnswer} from './assessment.mjs';
const lab=id=>labs.find(l=>l.id===id);
const isolate=s=>'<bdi>'+s+'</bdi>';
const n=v=>Number(v.toPrecision(8)).toString();
export const formNames={quick:'كوز سريع|Quick quiz',midterm:'اختبار فصلي|Midterm practice',final:'اختبار شامل|Comprehensive mock',diagnostic:'اختبار تشخيصي|Diagnostic test'};
const kindNames={direct:'حساب قراءة الجهاز|Calculate a reading',reverse:'استنتاج المدخل من القياس|Infer the input',delta:'التغيّر المطلق الموقّع|Signed difference',percent:'التغيّر النسبي|Relative change',ratio:'مقارنة حالتي تشغيل|Operating-point ratio',diagnosis:'تفسير هندسي|Engineering interpretation'};
export function stageLabel(i,T){return T(['المرحلة الأولى|Stage one','المرحلة الثانية|Stage two','المرحلة الثالثة|Stage three','المرحلة الرابعة|Stage four'][i])}
export function subjectLink(d,s){return '#subject/'+d.id+'/'+s}
export function stagePicker(root,T){
 const html='<section class="curr-entry section"><div><p class="eyebrow">'+T('دليل الدراسة|Study planner')+'</p><h2>'+T('اختر قسمك ومرحلتك|Find your subjects')+'</h2></div><div class="planner-form"><label>'+T('القسم|Discipline')+'<select data-department>'+departments.map(d=>'<option value="'+d.id+'">'+T(d.title)+'</option>').join('')+'</select></label><label>'+T('المرحلة|Stage')+'<select data-year>'+[0,1,2,3].map(i=>'<option value="'+(i+1)+'">'+stageLabel(i,T)+'</option>').join('')+'</select></label><a class="btn primary" data-open href="#department/communications/1">'+T('اعرض المواد|Show subjects')+'</a></div></section>';
 const where=root.querySelector('.metrics');where.insertAdjacentHTML('afterend',html);
 const update=()=>root.querySelector('[data-open]').href='#department/'+root.querySelector('[data-department]').value+'/'+root.querySelector('[data-year]').value;
 root.querySelector('[data-department]').onchange=root.querySelector('[data-year]').onchange=update;
}
export function degreeMap(d,year,T){
 const plan=stages(d.id),selected=Number(year)||0;
 const stageNav='<nav class="stage-links" aria-label="'+T('المراحل|Stages')+'">'+[0,1,2,3,4].map(z=>'<a class="btn" '+(selected===z?'aria-current="page"':'')+' href="#department/'+d.id+(z?'/'+z:'')+'">'+(z?stageLabel(z-1,T):T('كل المراحل|All stages'))+'</a>').join('')+'</nav>';
 let out='<section class="section">'+stageNav+'<p class="muted">'+T('مسار تعلّم مقترح من أربع مراحل. تظهر مراجع اختيار الموضوعات داخل كل مادة.|A four-stage studio study path. Topic-selection references appear inside each subject.')+'</p>';
 plan.forEach((items,i)=>{if(selected&&selected!==i+1)return;out+='<section class="year-group"><h2>'+stageLabel(i,T)+'</h2><div class="two">'+items.map(key=>{const s=subjects[key];return '<a class="card course-card-new" href="'+subjectLink(d,key)+'"><h3>'+T(s.title)+'</h3><p>'+s.models.map(id=>T(lab(id).concept)).join(' · ')+'</p><span class="textlink">'+T('الدروس والمختبر والتمارين|Lessons, laboratory & practice')+'</span></a>'}).join('')+'</div></section>'});return out+'</section>';
}
const sourceName=(k,T)=>sources[k][0].includes('|')?T(sources[k][0]):sources[k][0];
export function subjectPage(d,id,T,head,link,resource){
 const s=subjects[id],year=stages(d.id).findIndex(row=>row.includes(id)),parent='#department/'+d.id+'/'+(year+1);
 let out=head(T(s.title),T(s.task),parent,T(d.title)+' · '+stageLabel(year,T));
 out+='<div class="actions">'+link('#bank/'+d.id+'/'+id,T('بنك تمارين المادة|Subject exercise bank'),'primary')+link('#practice/'+d.id+'/'+id,T('اختبار في هذه المادة|Test this subject'))+'</div>';
 if(id==='digital')out+='<section class="feature section"><h2>'+T('محاضرات د. ياسر الأمين|Dr. Yassir Al-Ameen’s lectures')+'</h2><div class="actions">'+link(resource(),T('افتح المحاضرات الثماني بالترتيب|Open the eight lectures in order'),'primary')+link(resource('bank'),T('بنك المسائل المحلولة|Worked problem bank'))+link(resource('lab'),T('مختبرات موضوعات المحاضرات|Lecture topic labs'))+'</div></section>';
 out+='<section class="section">'+s.models.map((key,i)=>{const l=lab(key);return '<article class="panel module"><div class="module-head"><span class="dept-code">'+d.code+' / '+String(i+1).padStart(2,'0')+'</span><h2>'+T(l.concept)+'</h2></div><p>'+T(l.note)+'</p><div class="formula">'+l.equation+'</div><div class="actions">'+link('#lab/'+key+'/'+d.id+'/'+id,T('شغّل المنضدة والأجهزة|Run equipment bench'),'primary')+link('#bank/'+d.id+'/'+id+'/'+key,T('تمارين الموضوع|Topic exercises'))+'</div></article>'}).join('')+'</section>';
 if(s.models.some(x=>['ohm','rc','charging','divider','gain'].includes(x)))out+='<div class="actions">'+link('digital-communications/academy/student-path/circuits.html?lang='+T('ar|en'),T('افتح منضدة توصيل الدوائر الحرة|Open the free-wiring circuit bench'))+'</div>';
 if(['buildings','storage','lighting','solar'].includes(id))out+='<div class="actions">'+link('#project',T('طبّق في مشروع القاعة الدراسية|Apply to the classroom design project'))+'</div>';
 return out+'<section class="section panel"><h2>'+T('مراجع اختيار الموضوعات|Curriculum references')+'</h2>'+s.refs.map(k=>'<a class="textlink source-link" href="'+sources[k][1]+'">'+sourceName(k,T)+' ↗</a>').join('')+'</section>';
}
function fixedFor(l,v,T){return T(l.y.label)+' '+isolate(l.y.symbol+' = '+n(v.y)+' '+l.y.unit)}
export function prompt(l,v,T){
 const k=v.kind||'direct',x=isolate(l.x.symbol+' = '+n(v.x)+' '+l.x.unit),fixed=fixedFor(l,v,T);
 if(k==='diagnosis')return T(theory(l.id).prompt);
 if(k==='direct')return T('احسب|Calculate')+' '+T(l.output)+' · '+x+' · '+fixed;
 if(k==='reverse')return T('أعطى الجهاز القراءة الآتية. استنتج|The meter gives the following reading. Determine')+' '+T(l.x.label)+' · '+isolate(n(l.calc(v.x,v.y))+' '+l.unit)+' · '+fixed;
 const action={delta:'احسب القراءة النهائية ناقص الابتدائية|Calculate final reading minus initial reading',percent:'احسب نسبة التغير الموقّعة قياساً إلى الحالة الأولى|Calculate signed percentage change relative to the initial reading',ratio:'احسب نسبة القراءة النهائية إلى الابتدائية|Find the final-to-initial reading ratio'};
 return T(action[k])+'. '+T(l.x.label)+' '+isolate(n(v.x)+' → '+n(v.x2)+' '+l.x.unit)+' · '+fixed;
}
export function responseField(l,v,T,id){
 if(v.kind==='diagnosis')return '<label class="control">'+T('اختر التفسير|Choose the explanation')+'<select id="'+id+'"><option value="">'+T('اختر إجابة|Select an answer')+'</option>'+v.order.map((o,i)=>'<option value="'+i+'">'+T(theory(l.id).options[o])+'</option>').join('')+'</select></label>';
 return '<label class="control">'+T('إجابتك|Your answer')+' '+isolate('('+unitFor(l,v)+')')+'<input id="'+id+'" type="text" inputmode="decimal" autocomplete="off" class="numeric"></label>';
}
export function isCorrect(l,v,raw){return v.kind==='diagnosis'?String(raw??'').trim()!==''&&parseAnswer(raw)===answerFor(l,v):correct(raw,answerFor(l,v))}
export function solution(l,v,T){
 if(v.kind==='diagnosis')return T(theory(l.id).options[0])+' '+T(l.note);
 const a=l.calc(v.x,v.y),z=l.calc(v.x2??v.x,v.y),k=v.kind||'direct';
 const calc={direct:l.x.symbol+' = '+n(v.x)+' '+l.x.unit+', '+l.y.symbol+' = '+n(v.y)+' '+l.y.unit,reverse:l.x.symbol+' = '+n(v.x)+' '+l.x.unit+' ⇒ '+n(a)+' '+l.unit,delta:n(z)+' − ('+n(a)+')',ratio:n(z)+' / '+n(a),percent:'100 × ('+n(z)+' − '+n(a)+') / '+n(a)};
 return '<span class="solution-equation">'+isolate(l.equation)+'</span> · '+isolate(calc[k])+' · '+isolate(n(answerFor(l,v))+' '+unitFor(l,v));
}
export function bankView(root,d,sid,lid,T,head,link){
 const s=subjects[sid],list=(s?s.models:coveredModels(d.id)).map(lab),selected=list.find(l=>l.id===lid)||list[0];let questions;
 root.innerHTML=head(T('بنك التمارين|Exercise bank'),T('كل مجموعة تضم حساباً مباشراً، ومسألة عكسية، وتغيراً مطلقاً ونسبياً، ومقارنة حالتين، وسؤال تفسير. يمكنك التحقق من كل إجابة وفتح خطوات الحل.|Every set includes a reading, an inverse problem, absolute and relative change, a ratio and a conceptual question. Check answers individually and reveal the solutions.'),s?subjectLink(d,sid):'#department/'+d.id,T(s?.title??d.title))+'<div class="toolbar"><label class="control">'+T('الموضوع|Topic')+'<select id="bank-topic">'+list.map(l=>'<option value="'+l.id+'">'+T(l.title)+'</option>').join('')+'</select></label></div><div class="actions"><button class="btn primary" id="bank-new">'+T('ولّد مجموعة جديدة|Generate another set')+'</button>'+link('#practice/'+d.id+(s?'/'+sid:''),T('اختبار مؤقت|Timed test'))+'</div><div id="bank-list" class="section"></div>';
 const select=root.querySelector('#bank-topic');select.value=selected.id;
 const refresh=()=>{const l=lab(select.value);questions=formats.map(k=>exercise(l,k));
 root.querySelector('#bank-list').innerHTML=questions.map((v,i)=>'<article class="panel module"><h3>'+isolate(i+1)+'. '+T(kindNames[v.kind])+'</h3><p>'+prompt(l,v,T)+'</p>'+responseField(l,v,T,'bank-q'+i)+'<div class="actions"><button data-check="'+i+'">'+T('تحقّق|Check')+'</button></div><p class="feedback" role="status"></p><details><summary>'+T('اعرض الحل|Show solution')+'</summary><p>'+solution(l,v,T)+'</p></details></article>').join('');
 root.querySelectorAll('[data-check]').forEach(btn=>btn.onclick=()=>{const i=+btn.dataset.check,ok=isCorrect(l,questions[i],root.querySelector('#bank-q'+i).value),msg=btn.closest('article').querySelector('[role=status]');msg.textContent=ok?T('صحيح.|Correct.'):T('راجع المدخلات والوحدات أو افتح الحل.|Review the inputs and units, or open the solution.');msg.classList.toggle('bad',!ok)})};
 select.onchange=refresh;root.querySelector('#bank-new').onclick=refresh;refresh();
}
