import {language} from './i18n.mjs?v=scienceRef4';
import {challengeData} from './practice.mjs?v=learn6';
const ar=language==='ar',L=(en,arabic)=>ar?arabic:en;
const button=(text,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.onclick=fn;return b};
// Reveal the authored solution, preserving each equation, table and figure as a unit.
export function progressive(root){
 root.querySelectorAll('.answer:not([data-progressive]),#calculated:not([data-progressive])').forEach(answer=>{
  const units=[...answer.children].flatMap(el=>['UL','OL'].includes(el.tagName)?[...el.children]:[el]);
  if(!units.length||answer.querySelector('[role="alert"]'))return;
  for(let i=0;i<units.length-1;i++){const el=units[i],next=units[i+1],strong=el.querySelector(':scope > strong');if(el.tagName==='P'&&strong&&el.textContent.trim()===strong.textContent.trim()&&el.parentElement===next.parentElement){const group=document.createElement('div');group.className='solution-part';el.before(group);group.append(el,next);units.splice(i,2,group)}}
  answer.dataset.progressive='true';let count=0;
  const controls=document.createElement('div');controls.className='reveal-controls';
  const status=document.createElement('span');status.setAttribute('role','status');
  const hint=document.createElement('p');hint.className='solution-hint';hint.hidden=true;hint.textContent=answer.closest('.topic-section')?.querySelector('.explain-box')?.textContent||answer.closest('[data-practice-hint]')?.dataset.practiceHint||L('Identify the given quantities and the required result. Check units before choosing the relation.','حدّد المعطيات والمطلوب. تحقّق من الوحدات قبل اختيار العلاقة المناسبة.');
  const hintButton=button(L('Hint','تلميح'),()=>{hint.hidden=!hint.hidden;hintButton.setAttribute('aria-expanded',String(!hint.hidden))});hintButton.setAttribute('aria-expanded','false');
  const next=button(L('Reveal next step','أظهر الخطوة التالية'),()=>{count=Math.min(count+1,units.length);paint()});
  const all=button(L('Show complete solution','أظهر الحل كاملاً'),()=>{count=units.length;paint()});
  const reset=button(L('Try again','حاول مجدداً'),()=>{count=0;paint()});
  const paint=()=>{units.forEach((el,i)=>el.hidden=i>=count);next.disabled=count===units.length;all.disabled=count===units.length;reset.disabled=count===0;status.textContent=L(`${count} of ${units.length} parts revealed`,`${count} من ${units.length} أجزاء ظاهرة`)};
  controls.append(hintButton,next,all,reset,status,hint);answer.before(controls);paint();
 });
}
export function resetProgressive(answer){
 const controls=answer.previousElementSibling;if(controls?.classList.contains('reveal-controls'))controls.remove();
 delete answer.dataset.progressive;
}
export function mountChallenge(topic,host){
 const d=challengeData[topic.id];if(!d)return;
 const section=document.createElement('section');section.className='practice-card';
 const title=document.createElement('h3');title.textContent=L('Predict → experiment → explain','توقّع ← جرّب ← فسّر');
 const prompt=document.createElement('p');prompt.textContent=d.question[ar?1:0];
 const choices=document.createElement('div');choices.className='prediction-choices';
 const feedback=document.createElement('p');feedback.className='practice-feedback';feedback.setAttribute('role','status');
 d.choices.forEach((choice,i)=>choices.append(button(choice[ar?1:0],()=>{choices.querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));feedback.textContent=(i===d.correct?L('Correct. ','صحيح. '):L('Reconsider. ','راجع اختيارك. '))+d.explanation[ar?1:0];feedback.dataset.correct=String(i===d.correct)})));
 const task=document.createElement('p');task.textContent=d.task[ar?1:0];
 const result=document.createElement('p');result.setAttribute('role','status');
 const check=button(L('Check my experiment settings','تحقّق من إعدادات تجربتي'),()=>{
  const values=Object.fromEntries([...host.querySelectorAll('[data-key]')].map(e=>[e.dataset.key,e.value.trim()===''?NaN:Number(e.value)]));
  const valid=Object.values(values).every(Number.isFinite)&&!host.querySelector('[data-error]:not([hidden])');
  const ok=valid&&d.test(values);result.textContent=ok?L('Settings reached. Run or step through the signal, then explain the change using the relation below.','وصلت إلى الإعدادات المطلوبة. شغّل الإشارة أو تقدّم خطوة، ثم فسّر التغيّر بالعلاقة أدناه.'):L('Not yet. Check the requested values in the laboratory controls.','لم تصل بعد. راجع القيم المطلوبة في أدوات المختبر.');result.dataset.correct=String(ok);
 });
 section.append(title,prompt,choices,feedback,task,check,result);
 host.querySelector('.lab-instruction').after(section);
 host.addEventListener('input',()=>{result.textContent='';delete result.dataset.correct});
}
let active=false,index=0;
export function classroom(root,view){
 document.querySelector('.classroom-toolbar')?.remove();
 root.querySelectorAll('.present-active').forEach(el=>el.classList.remove('present-active'));
 const supported=['lecture','bank','lab'].includes(view);document.body.classList.toggle('classroom-mode',active&&supported);if(!supported)return()=>{};
 const sections=[...root.querySelectorAll('.topic-section')];index=0;
 const toolbar=document.createElement('div');toolbar.className='classroom-toolbar';
 const toggle=button('',()=>{active=!active;paint()});toggle.className='primary';
 const previous=button(L('Previous topic','الموضوع السابق'),()=>{index=Math.max(0,index-1);paint();scrollTo(0,0)});
 const next=button(L('Next topic','الموضوع التالي'),()=>{index=Math.min(sections.length-1,index+1);paint();scrollTo(0,0)});
 const status=document.createElement('span');status.setAttribute('role','status');
 const help=document.createElement('small');help.textContent=L('Esc to exit · arrow keys change topics','Esc للخروج · الأسهم للتنقل بين المواضيع');
 function paint(){document.body.classList.toggle('classroom-mode',active);toggle.textContent=active?L('Exit classroom view','إنهاء عرض القاعة'):L('Classroom view','عرض القاعة');toggle.setAttribute('aria-pressed',String(active));sections.forEach((el,i)=>el.classList.toggle('present-active',i===index));previous.hidden=next.hidden=status.hidden=!active||!sections.length;help.hidden=!active;previous.disabled=index===0;next.disabled=index===sections.length-1;status.textContent=`${index+1} / ${sections.length}`;}
 toolbar.append(toggle,previous,status,next,help);root.before(toolbar);paint();
 const keys=e=>{if(!active)return;if(e.key==='Escape'){active=false;paint();return}if(e.target.closest('input,select,textarea,button,[contenteditable]'))return;if(sections.length&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const forward=ar?e.key==='ArrowLeft':e.key==='ArrowRight';index=Math.max(0,Math.min(sections.length-1,index+(forward?1:-1)));paint();scrollTo(0,0)}};
 document.addEventListener('keydown',keys);return()=>document.removeEventListener('keydown',keys);
}
