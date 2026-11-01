import assert from 'node:assert/strict';
import {cases,defaults,assess,validate,source,aliasSignal,quantized,rotated,parseNumber,closeNumber,normalizeDigits} from '../learning/digital-communications/academy/student-path/cases.mjs';
const fixes={alias:{fs:400},overload:{range:1.5,bits:3},slope:{fs:1600,step:.4},timing:{u:1},rate:{rate:64000},phase:{phase:0}};
for(const c of cases){assert.equal(assess(c,defaults(c)).pass,false,c.id+' baseline');assert.equal(assess(c,fixes[c.id]).pass,true,c.id+' fix');for(const f of c.fields)assert.throws(()=>validate(c,{...defaults(c),[f.key]:NaN}));}
assert.equal(assess(cases[0],{fs:200}).pass,false);assert.equal(assess(cases[0],{fs:201}).pass,true);
assert.equal(assess(cases[1],{range:1,bits:6}).pass,false);assert.equal(assess(cases[1],{range:1.2,bits:3}).pass,false);
assert.equal(assess(cases[2],{fs:1600,step:.3}).pass,false);assert.equal(assess(cases[2],{fs:1600,step:.325}).pass,true);
assert.equal(assess(cases[3],{u:.9}).pass,false);assert.equal(assess(cases[4],{rate:63999}).pass,false);
assert.equal(assess(cases[5],{phase:45}).pass,false);
for(let n=0;n<50;n++)assert.ok(Math.abs(source(n/150)-aliasSignal(n/150,150))<1e-10);
for(let i=0;i<4;i++){assert.equal(rotated(i,0).decoded,i);assert.notEqual(rotated(i,180).decoded,i);}
assert.ok(quantized(.0025,{range:1,bits:3})<1);assert.ok(quantized(.0025,{range:1.5,bits:3})>1);
for(const [s,x]of [['٠٫٠٠٠٧٥',.00075],['۱٫۲۵',1.25],['1,000',1000],['0,125',.125],['1,25',1.25],['1e-12',1e-12],['−١٫٢',-1.2]])assert.equal(parseNumber(s),x);
assert.ok(Number.isNaN(parseNumber('')));assert.equal(normalizeDigits('٠١۱۰'),'0110');assert.ok(closeNumber(1.009,1));assert.equal(closeNumber(1.02,1),false);assert.equal(closeNumber(0,1e-12),false);assert.equal(closeNumber(Infinity,1),false);
console.log('PASS: all six faults fail initially, valid repairs pass, boundary and malformed inputs are rejected, sampled aliases match, phase labels are checked, saturation is reproduced, and Arabic/scientific numeric answers parse correctly.');
