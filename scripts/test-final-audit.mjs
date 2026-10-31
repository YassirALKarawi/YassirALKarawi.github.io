import assert from 'node:assert/strict';import fs from 'node:fs';
import {models,evaluate,parseSamples,parseBits,pskError,squareQamError} from '../learning/digital-communications/interactive-bank/models.mjs';
import {plot} from '../learning/digital-communications/interactive-bank/plots.mjs';
import {topicIds,fields,defaults,buildSignal,flow} from '../learning/digital-communications/academy/signals.mjs';
import {validQuizSession} from '../learning/digital-communications/academy/quiz.mjs';
const fixture=JSON.parse(fs.readFileSync(new URL('fixtures/final-numerical.json',import.meta.url)));
const data=id=>Object.fromEntries(models[id].fields.map(f=>[f.key,f.value]));
const close=(a,b)=>assert(Math.abs(Number(a)-b)<2e-7+Math.abs(b)*3e-6,`${a} != ${b}`);
assert.deepEqual(Object.keys(fixture).sort(),Object.keys(models).sort());let rowCount=0;
for(const [id,expected] of Object.entries(fixture)){const actual=evaluate(id,data(id));assert.equal(actual.length,expected.length,id);expected.forEach((v,i)=>{if(typeof v==='number')close(actual[i].value,v);else assert.equal(actual[i].value,v,id+' row '+i);rowCount++})}
assert.deepEqual(parseSamples(' ٠٫١، 0.4, ۰٫۳، −0.2 '),[.1,.4,.3,-.2]);assert.deepEqual(parseBits(' ١٠ ١١۰ '),[1,0,1,1,0]);
for(const id of ['4.13','4.21']){const p=data(id),clean=p.x;assert.equal(plot(id,{...p,x:'  '+clean.replaceAll(',',',  ')+'  '}),plot(id,p));assert.deepEqual(evaluate(id,{...p,x:'  '+clean.replaceAll(',',',  ')+'  '}),evaluate(id,p))}
for(const id of ['5.23','7.13','7.23']){const p=data(id),spaced=p.bits.split('').join(' ');assert.equal(plot(id,{...p,bits:spaced}),plot(id,p));assert.deepEqual(evaluate(id,{...p,bits:spaced}),evaluate(id,p))}
assert.deepEqual(evaluate('6.23',{...data('6.23'),bits:'٠٠١١١٠٠١'}),evaluate('6.23',data('6.23')));
assert.throws(()=>evaluate('7.24',{...data('7.24'),ph:'0'}));assert.throws(()=>evaluate('5.23',{...data('5.23'),f0:1000,f1:1000}));
close(pskError(1,0).ser,.5);close(pskError(2,0).ser,.75);close(pskError(2,1).ber,.07864960352514258);close(pskError(2,1).ser,.151113446915623);close(squareQamError(2,1).ber,.07864960352514258);
assert.equal(evaluate('8.15',data('8.15'))[0].value,'-1');assert.equal(evaluate('8.15',data('8.15'))[1].value,'0');
assert.equal((plot('8.13',data('8.13')).match(/<figure /g)||[]).length,4);
// Parameter boundaries and every single-field extreme must produce finite, nonempty traces.
let cases=0;
for(const id of topicIds){const p=defaults(id),g=flow(id);assert(g.nodes.length===g.positions.length);assert(g.edges.every(([a,b])=>a>=0&&b>=0&&a<g.nodes.length&&b<g.nodes.length));for(const f of fields(id))for(const v of [f.min,f.max]){const m=buildSignal(id,{...p,[f.k]:v});assert(m.duration>0&&m.range>0);assert(m.warnings.every(w=>typeof w==='string'));for(const u of [0,.13,.5,1])assert(m.fn(m.duration*u).every(Number.isFinite),`${id}:${f.k}=${v}`);cases++}}
assert(buildSignal('sampling',{...defaults('sampling'),f:500,fs:100}).warnings.some(s=>s.includes('Aliasing')));assert(buildSignal('dm',{...defaults('dm'),step:.025}).warnings.some(s=>s.includes('slope overload')));
const bank=[{id:'A'},{id:'B'}],valid={ids:['A','B'],orders:{A:[1,0,3,2],B:[0,1,2,3]},answers:{A:0},drafts:{B:2},index:1};assert(validQuizSession(valid,bank));for(const bad of [null,{}, {...valid,index:4},{...valid,ids:[]},{...valid,orders:{}},{...valid,answers:{A:8}},{...valid,answers:[]},{...valid,drafts:[]},{...valid,ids:['A','A']}])assert(!validQuizSession(bad,bank));
console.log(`PASS: all 86 numerical models (${rowCount} default-data results), whitespace/Arabic-number parsing, matching plots, exact PSK special cases, 4-QAM BER, coordinate/bit distinction, four BER comparison plots, ${cases} lab parameter extremes, warning conditions and saved-quiz recovery.`);
