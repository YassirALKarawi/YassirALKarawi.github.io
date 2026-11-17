import assert from 'node:assert/strict';
import fs from 'node:fs';
import {FS,DURATION,CAPACITY,PLAYBACK_SCALE,BASELINE,parameters,sourceFor,process,evaluateRepair,sampleAt,parseExperiment,experimentQuery,wavBytes} from '../learning/digital-communications/academy/sound-lab/model.mjs';
import {words} from '../learning/digital-communications/academy/sound-lab/strings.mjs';
import {reportHTML} from '../learning/digital-communications/academy/sound-lab/report.mjs';
const near=(a,b,tolerance=1e-10)=>assert(Math.abs(a-b)<tolerance,`${a} != ${b}`);

// Hand-computed independent four-level midpoint reference, including overload.
const known=process(Float64Array.from([-1.2,-1,-.51,-.5,0,.49,.5,.999,1,1.2]),{gain:1,bits:2});
assert.deepEqual([...known.output],[-.75,-.75,-.75,-.25,.25,.25,.75,.75,.75,.75]);
assert.deepEqual([...known.indices],[0,0,0,1,2,2,3,3,3,3]);
assert.equal(known.metrics.overloaded,3);
near(known.metrics.step,.5);
assert.equal(sampleAt(Float64Array.from([.49]),process(Float64Array.from([.49]),{gain:1,bits:2}),0).code,'10');

const source=sourceFor('normal'),strong=sourceFor('transfer');
assert.equal(source.length,FS*DURATION);assert.deepEqual(source,sourceFor('normal'));
near(Math.max(...source.map(Math.abs)),.9);
near(Math.max(...strong.map(Math.abs)),1.15);
const broken=process(source,BASELINE),moreBits=process(source,{gain:1.65,bits:10});
assert(broken.metrics.overloadPercent>40&&broken.metrics.snr<15);
assert.equal(moreBits.metrics.overloaded,broken.metrics.overloaded,'Precision cannot cure overload');
assert(moreBits.metrics.snr<15);
const repair=process(source,{gain:1,bits:7});
assert(evaluateRepair(repair).passed);
near(repair.metrics.lineRate,61600,1e-8);
assert(!evaluateRepair(process(strong,{gain:1,bits:7})).passed,'A design working on the first signal can fail the transfer case');
for(const input of [source,strong])assert(evaluateRepair(process(input,{gain:.8,bits:7})).passed);
const excessive=process(source,{gain:.8,bits:8});
assert(evaluateRepair(excessive).quality);assert(!evaluateRepair(excessive).capacity);
near(excessive.metrics.lineRate,70400,1e-8);assert(excessive.metrics.lineRate>CAPACITY);
assert(!evaluateRepair(process(source,{gain:.3,bits:7})).quality,'Excess attenuation harms effective resolution');

// The half-step bound is only asserted when the ADC input is in range.
for(const gain of [.3,.8,1,1.65,2])for(const bits of [2,3,6,7,8,10]){
  const r=process(source,{gain,bits});
  for(let i=0;i<source.length;i+=37){
    assert(Number.isFinite(r.output[i]));
    if(r.input[i]>=-1&&r.input[i]<1)assert(Math.abs(r.output[i]-source[i])<=r.metrics.step/(2*gain)+1e-12);
    const word=r.indices[i].toString(2).padStart(bits,'0');
    assert.equal(word.length,bits);
    near((-1+(parseInt(word,2)+.5)*2/(2**bits))/gain,r.output[i]);
  }
}
let sx=0,se=0;source.forEach((x,i)=>{sx+=x*x;se+=(repair.output[i]-x)**2});
near(repair.metrics.snr,10*Math.log10(sx/se));
for(const bad of [{gain:0,bits:7},{gain:NaN,bits:7},{gain:Infinity,bits:7},{gain:.8,bits:2.1},{gain:.8,bits:11}])assert.throws(()=>parameters(bad));
assert.throws(()=>sourceFor('unknown'));assert.throws(()=>process([NaN]));
assert.deepEqual(parseExperiment('?v=1&g=.8&b=7&case=transfer').settings,{gain:.8,bits:7});
assert.equal(parseExperiment('?v=1&g=NaN&b=7').shared,false);
assert.equal(parseExperiment('?v=1&g=1&b=999').shared,false);
assert.equal(parseExperiment('?g=.8&b=7').shared,false);
assert.deepEqual(parseExperiment(experimentQuery({gain:.8,bits:7},'transfer','ar')),{shared:true,caseId:'transfer',settings:{gain:.8,bits:7}});

// WAV is playable mono PCM with the same fixed attenuation used by live A/B/C.
const wav=new DataView(wavBytes(repair.output));
assert.equal(wav.byteLength,44+source.length*2);assert.equal(wav.getUint32(24,true),8000);
assert.equal(wav.getUint16(22,true),1);assert.equal(wav.getUint16(34,true),16);
for(const i of [0,1288,4000,47999])near(wav.getInt16(44+i*2,true)/32767,repair.output[i]*PLAYBACK_SCALE,1/32767);
for(const [key,v]of Object.entries(words))assert(v.length===2&&v.every(s=>typeof s==='string'&&s.length>0),key);
const app=fs.readFileSync(new URL('../learning/digital-communications/academy/sound-lab/app.mjs',import.meta.url),'utf8');
for(const [,key]of app.matchAll(/\bt\('([^']+)'\)/g))assert(words[key],`Missing translation ${key}`);
const record={cases:{normal:{settings:{gain:.8,bits:7},metrics:repair.metrics,amplitude:.9,testedAt:'<script>alert(1)</script>'}}};
const html=reportHTML(record,'ar','https://example.org/sound-lab/');
assert(html.includes('dir="rtl"'));assert(html.includes('61.6 kbit/s'));assert(html.includes('إعادة فتح هذه الإعدادات'));assert(!html.includes('<script>'));
assert(!reportHTML(record,'en','javascript:alert(1)').includes('href="javascript:'));
console.log('PASS: sound laboratory reference quantization, PCM round trip, half-step bound, measured error, overload diagnosis, link budget, two-case repair, unsafe inputs, shared-link validation, WAV encoding and bilingual labels.');
