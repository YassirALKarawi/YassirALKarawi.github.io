import assert from 'node:assert/strict';
import {departments,labs} from '../learning/engineering/catalog.mjs';
import {correct,parseAnswer,makeExam,makeCase} from '../learning/engineering/assessment.mjs';
const expected={pcm:64,shannon:17.297158093,ohm:2,copper:30,rc:1.59154943,gain:5,transfer:40,cache:8,beam:1.125,slab:12,shaft:Math.PI,spring:8,encoder:.09,step:63.21205588,flow:3,yield:85.5,mix:6,heat:41.8,light:300,wall:200,pv:320,battery:4,basin:8,removal:10,stress:200,strain:1,adc:3.90625,sensor:.1,pore:40,saturation:20};
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
for(const d of departments){assert.equal(d.criteria.length,3);assert.equal(makeExam(d.labs).length,2)}
const mixed=makeExam(labs);assert.equal(mixed.length,8);assert.equal(new Set(mixed.map(q=>q.id)).size,8);
assert.equal(parseAnswer(' ١٢٫٥ '),12.5);assert.equal(parseAnswer('۰٫۵'),.5);assert.ok(Number.isNaN(parseAnswer('')));assert.ok(Number.isNaN(parseAnswer('17 m')));
assert.ok(correct('0.0099',.01));assert.ok(!correct('0.0098',.01));assert.ok(!correct('',1));
console.log('PASS: 30 independent unit/physics fixtures; all model boundaries, bilingual fields, discipline rubrics, assessment sizing, Arabic decimals and grading tolerance.');
