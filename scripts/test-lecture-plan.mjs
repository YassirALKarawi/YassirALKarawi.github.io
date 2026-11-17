import assert from 'node:assert/strict';
import fs from 'node:fs';
import {lecturePlans,checkLectureAnswer} from '../learning/digital-communications/academy/lecture-plan.mjs';
import {courseMapHTML,lecturePlanHTML} from '../learning/digital-communications/academy/lecture-plan-view.mjs';
const base=new URL('../learning/digital-communications/academy/',import.meta.url);
const en=JSON.parse(fs.readFileSync(new URL('curriculum.json',base))),ar=JSON.parse(fs.readFileSync(new URL('i18n/curriculum.ar.json',base)));
const bank=JSON.parse(fs.readFileSync(new URL('../interactive-bank/questions.json',base)));
assert.equal(lecturePlans.length,8);
for(const curriculum of [en,ar])for(const c of curriculum){const p=lecturePlans.find(x=>x.n===c.n);assert.deepEqual(Object.keys(p.sections).sort(),c.topics.map(t=>t.id).sort());assert(c.topics.some(t=>t.id===p.lab));for(const topic of c.topics)assert(bank.some(q=>q.lecture===c.n&&q.id===topic.example));for(const lang of ['en','ar']){const html=lecturePlanHTML(c,lang);assert(!html.includes('undefined'));assert(html.includes(`data-plan-check="${c.n}"`));assert(html.includes(`view=quiz&lecture=${c.n}`));}}
for(const lang of ['ar','en'])assert.equal((courseMapHTML(lang==='ar'?ar:en,lang).match(/class="lecture-card aligned-card"/g)||[]).length,8);
// Independently calculated fixtures; units are part of the displayed question.
const answers=[Math.abs(100-150),.4+.2*.5,-2+(Math.floor((.62+2)/.5)+.5)*.5,(24*8+1)*8000/1000,2000*.001,120/Math.log2(4),1000/2,2];
for(let i=0;i<8;i++){assert.equal(checkLectureAnswer(i+1,answers[i]),true);assert.equal(checkLectureAnswer(i+1,answers[i]+1),false)}
assert.equal(checkLectureAnswer(3,'٠٫٧٥'),true);assert.equal(checkLectureAnswer(4,'١٥٤٤'),true);
for(const raw of ['', '   ', 'NaN','Infinity','2ms'])assert.equal(checkLectureAnswer(1,raw),null);
assert.equal(checkLectureAnswer(99,'50'),null);
console.log('PASS: all 8 lecture plans map every one of the 32 topics to valid same-lecture examples; bilingual links, checkpoints, units, Arabic input and invalid answers verified.');
