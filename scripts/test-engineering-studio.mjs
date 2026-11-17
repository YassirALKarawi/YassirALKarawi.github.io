import assert from 'node:assert/strict';
import {departments,labs} from '../learning/engineering/catalog.mjs';
import {correct,parseAnswer,makeExam,makeCase} from '../learning/engineering/assessment.mjs';
const expected={pcm:64,shannon:17.297158093,ohm:2,copper:30,rc:1.59154943,gain:5,transfer:40,cache:8,beam:1.125,slab:12,shaft:Math.PI,spring:8,encoder:.09,step:63.21205588,flow:3,yield:85.5,mix:6,heat:41.8,light:300,wall:200,pv:320,battery:4,basin:8,removal:10,stress:200,strain:1,adc:3.90625,sensor:.1,pore:40,saturation:20,symbol:40,waveguide:2.398339664,divider:4,charging:3.160602794,propagation:500.3461428,amdahl:3.33333333,vibration:1.59154943,pump:1.962,hydro:39.24,expansion:.96,gear:200,util:30,washout:6.065306597,acoustics:.805,inverter:95,runoff:2/3,darcy:.09869233,bridge:12.437810945};
assert.equal(new Set(labs.map(l=>l.id)).size,labs.length);
assert.equal(new Set(departments.map(d=>d.id)).size,departments.length);
assert.deepEqual(Object.keys(expected).sort(),labs.map(m=>m.id).sort());
for(const l of labs){
 const actual=l.calc(l.x.initial,l.y.initial);
 assert.ok(Math.abs(actual-expected[l.id])<1e-6,l.id);
 for(const v of [l.title,l.concept,l.output,l.x.label,l.y.label,l.note])assert.equal(v.split('|').filter(Boolean).length,2,l.id);
 for(const x of [l.x.min,l.x.max])for(const y of [l.y.min,l.y.max])assert.ok(Number.isFinite(l.calc(x,y))&&l.calc(x,y)>0,l.id);
 for(const seed of [0,0.5,0.999999]){
  const v=makeCase(l,()=>seed);
  assert.ok(v.x>=l.x.min&&v.x<=l.x.max&&v.y>=l.y.min&&v.y<=l.y.max,l.id);
 }
}
for(const d of departments){assert.equal(d.criteria.length,3);assert.equal(makeExam(d.labs).length,d.labs.length)}
const mixed=makeExam(labs);assert.equal(mixed.length,8);assert.equal(new Set(mixed.map(q=>q.id)).size,8);
assert.equal(parseAnswer(' ١٢٫٥ '),12.5);assert.equal(parseAnswer('۰٫۵'),.5);assert.ok(Number.isNaN(parseAnswer('')));assert.ok(Number.isNaN(parseAnswer('17 m')));
assert.ok(correct('0.0099',.01));assert.ok(!correct('0.0098',.01));assert.ok(!correct('',1));
console.log('PASS: 48 independent unit/physics fixtures; all model boundaries, bilingual fields, discipline rubrics, assessment sizing, Arabic decimals and grading tolerance.');
import {subjects,sources,stages,coveredModels} from '../learning/engineering/curriculum.mjs';
import {theory,formats,exercise,answerFor,examForms,testDeck} from '../learning/engineering/questions.mjs';
import {rigs} from '../learning/engineering/apparatus.mjs';
import {rcResponse,beamShape,sweepInput} from '../learning/engineering/bench.mjs';
import {isCorrect,solution,prompt,subjectPage} from '../learning/engineering/study-views.mjs';
const used=new Set(),usedLabs=new Set();
const translate=(s,language)=>s.split('|')[language];
for(const d of departments){
 const years=stages(d.id);assert.equal(years.length,4);
 for(const year of years){assert.equal(year.length,2);for(const k of year){assert.ok(subjects[k],k);used.add(k);
 for(const ref of subjects[k].refs)assert.ok(sources[ref][1].startsWith('https://'));
 for(const id of subjects[k].models){assert.ok(labs.find(i=>i.id===id));usedLabs.add(id)}
 for(const locale of [0,1]){const html=subjectPage(d,k,s=>translate(s,locale),s=>s,(url,name)=>url+name,()=>'/');
 assert.ok(!html.includes('undefined'));assert.ok(html.includes('#lab/'))}
 }}
 for(const form of Object.keys(examForms)){
 const deck=testDeck(coveredModels(d.id).map(id=>labs.find(l=>l.id===id)),form);assert.equal(deck.length,examForms[form][0]);
 assert.ok(deck.every(q=>coveredModels(d.id).includes(q.id)));assert.ok(new Set(deck.map(q=>q.kind)).size>=3);
 }
}
assert.equal(used.size,Object.keys(subjects).length);assert.equal(usedLabs.size,labs.length);
for(const l of labs){
 assert.ok(rigs[l.id].parts.includes('|')&&rigs[l.id].procedure.includes('|'));
 assert.equal(theory(l.id).options.length,3);
 for(const kind of formats)for(const seed of [0,.25,.8,.99999]){
 const q=exercise(l,kind,()=>seed),answer=answerFor(l,q);assert.ok(Number.isFinite(answer),l.id);
 assert.ok(isCorrect(l,q,String(answer)));assert.ok(!isCorrect(l,q,''));
 for(const i of [0,1]){for(const html of [prompt(l,q,s=>translate(s,i)),solution(l,q,s=>translate(s,i))])assert.ok(html&&!html.includes('undefined')&&!html.includes('NaN'),l.id)}
 if(kind==='reverse'){const printed=+l.calc(q.x,q.y).toPrecision(8);
 for(let neighbor of [q.x-l.x.step,q.x+l.x.step]){if(neighbor>=l.x.min&&neighbor<=l.x.max)assert.notEqual(+l.calc(neighbor,q.y).toPrecision(8),printed,l.id)}}
 }}
assert.ok(Math.abs(rcResponse(1,1).gain-Math.SQRT1_2)<1e-12);assert.equal(rcResponse(1,1).phase,-Math.PI/4);
assert.equal(beamShape(.3),beamShape(.7+1e-16).toFixed(10)*1);
assert.equal(beamShape(0),0);assert.equal(beamShape(1),0);assert.equal(beamShape(.5),1);
for(const l of labs){assert.equal(sweepInput(l.x,l.x.initial,1),l.x.initial);assert.equal(sweepInput(l.x,l.x.initial,0),l.x.min)}
console.log('PASS: 120 stage/subject placements, 45 distinct subjects, 48 linked benches, 288 model/task combinations in both languages and specialty-scoped test forms.');
