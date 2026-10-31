import assert from 'node:assert/strict';import fs from 'node:fs';
import {Q,qamGrayBerReference,pskSerReference} from '../learning/digital-communications/interactive-bank/models.mjs';
const cases=JSON.parse(fs.readFileSync(new URL('fixtures/scientific-references.json',import.meta.url)));for(const c of cases){const value=(c.type==='qam'?qamGrayBerReference:pskSerReference)(c.k,c.gamma);assert(Number.isFinite(value)&&value>=0&&value<=1);assert(Math.abs(value-c.value)<=2e-7+Math.abs(c.value)*3e-6,JSON.stringify({c,value}))}
assert.equal(qamGrayBerReference(10,0),.5);assert.equal(pskSerReference(10,0),1023/1024);
console.log(`PASS: ${cases.length} independent SciPy Gaussian-CDF / adaptive-integral references, from −10 to 30 dB and up to 1024 symbols.`);

const tails=JSON.parse(fs.readFileSync(new URL('fixtures/gaussian-tail.json',import.meta.url)));for(const [z,ref] of tails){assert(Math.abs(Q(z)-ref)<=Math.abs(ref)*2e-12);assert(Math.abs(Q(-z)-(1-ref))<2e-14)}console.log('PASS: 14 independent Gaussian-tail references, including tails down to 10^-300.');
