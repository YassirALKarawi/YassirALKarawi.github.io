import assert from 'node:assert/strict';
import fs from 'node:fs';
import {topicIds,defaults,buildSignal,acquisition,tracePoints,quantize,TAU} from '../learning/digital-communications/academy/signals.mjs';
const root=new URL('../learning/digital-communications/academy/',import.meta.url),curr=JSON.parse(fs.readFileSync(new URL('curriculum.json',root))),qs=JSON.parse(fs.readFileSync(new URL('../interactive-bank/questions.json',root)));
assert.equal(curr.length,8);const topics=curr.flatMap(c=>c.topics);assert.equal(topics.length,32);assert.equal(topicIds.length,32);
for(const t of topics){assert(topicIds.includes(t.id));assert(qs.some(q=>q.id===t.example));assert(t.definition.length>30&&t.explanation.length>60&&t.equation&&t.activity);const m=buildSignal(t.id,defaults(t.id));assert.equal(m.labels.length,m.fn(.001).length);for(const t1 of [0,.0001,.001,.003,.02,.11,.7]){assert(m.fn(t1).every(Number.isFinite),t.id+' at '+t1)}assert.equal(tracePoints(m,0,acquisition(0,m.duration)).length,0);const short=tracePoints(m,0,acquisition(2,m.duration));assert(short.length>0&&short.length<801);const full=tracePoints(m,0,acquisition(8,m.duration));assert(full.length===801);assert(short.every(([t])=>t<=m.duration/4+1e-10));let w=acquisition(12,m.duration);assert(w.start>0);assert(tracePoints(m,0,w).every(([t])=>t>=w.start&&t<=w.end+1e-10));}
const near=(a,b,e=1e-8)=>assert(Math.abs(a-b)<e,`${a} != ${b}`);
near(quantize(.36,3).q,.375);assert.equal(quantize(2,3).index,7);
for(const fs of [150,800]){let p={...defaults('alias'),fs},m=buildSignal('alias',p);for(let n=0;n<50;n++){let a=m.fn(n/fs);near(a[0],a[1])}}
let pcm=buildSignal('pcm',{...defaults('pcm'),f:100,fs:1600,b:3});const idx=quantize(0,3).index;for(let j=0;j<3;j++)assert.equal(pcm.fn((j+.1)/(1600*3))[2],(idx>>(2-j))&1);
let T=.002,matched=buildSignal('matched',defaults('matched'));near(matched.fn(T)[1],1);near(matched.fn(2*T)[1],0);
let dm=buildSignal('dm',{...defaults('dm'),A:.8,step:.1});near(dm.fn(0)[1],.1);near(dm.fn(1/1600)[1],.2);
let dpcm=buildSignal('dpcm',defaults('dpcm'));near(dpcm.fn(0)[1],0);
let ms=buildSignal('msk',defaults('msk'));for(let n=1;n<20;n++){let eps=1e-10;assert(Math.abs(ms.fn(n/1000-eps)[2]-ms.fn(n/1000+eps)[2])<.001)}
let tdm=buildSignal('tdm',defaults('tdm'));near(tdm.fn(.1/3200)[2],0);near(tdm.fn(1.1/3200)[2],.48);
for(const q of qs.filter(q=>q.kind.includes('Draw')))assert(q.answer.includes('<img')||q.figure,`Missing drawing ${q.id}`);
console.log('PASS: 8 complete lecture units; all 32 topics have explanations, equations, worked examples and finite laboratory signals. Empty-to-progressive acquisition, sample/alias equivalence, quantizer limits, PCM word order, DM/DPCM updates, MSK continuity, matched-filter peak, TDM slots and all drawing answers verified.');
