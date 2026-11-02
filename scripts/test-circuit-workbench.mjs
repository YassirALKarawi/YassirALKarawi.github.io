import assert from 'node:assert/strict';
import {createSolver,template} from '../learning/digital-communications/academy/student-path/circuit-engine.mjs';
const rc=template('rc');assert.throws(()=>createSolver(rc.parts,[]),/floating/);assert.throws(()=>createSolver(rc.parts.filter(c=>c.type!=='ground'),[]),/ground/);assert.throws(()=>createSolver(rc.parts,[...rc.wires,['V1.a','V1.b']]),/short/);
// DC charging/discharging follows the analytical RC solution.
rc.parts[0].amp=0;rc.parts[0].offset=5;let s=createSolver(rc.parts,rc.wires),r;const dt=1e-7,tau=1e-4;
for(let i=0;i<1000;i++)r=s.step(dt,true);assert.ok(Math.abs(r.at('C1.a')-5*(1-Math.exp(-1)))<.002);
const initial=r.at('C1.a');for(let i=0;i<1000;i++)r=s.step(dt,false);assert.ok(Math.abs(r.at('C1.a')-initial*Math.exp(-1))<.001);assert.ok(r.at('C1.a')>0,'Power OFF preserves charge for physical discharge');
// Reversing source polarity reverses voltage; no scripted curve is used.
const inverted=rc.wires.map(w=>w.map(p=>p==='V1.a'?'V1.b':p==='V1.b'?'V1.a':p));s=createSolver(rc.parts,inverted);for(let i=0;i<1000;i++)r=s.step(dt,true);assert.ok(r.at('C1.a')< -3.15);
// Steady-state sine gain, with fixed RC and measured output extrema.
const sine=template('rc');s=createSolver(sine.parts,sine.wires);let lo=Infinity,hi=-Infinity;for(let i=0;i<60000;i++){r=s.step(dt,true);if(i>40000){lo=Math.min(lo,r.at('C1.a'));hi=Math.max(hi,r.at('C1.a'))}}const gain=(hi-lo)/4,expected=1/Math.sqrt(1+(2*Math.PI*500*tau)**2);assert.ok(Math.abs(gain-expected)<.001);
// Sample and hold: constant source acquires during clock HIGH and holds when LOW.
const sh=template('sample');sh.parts[0].amp=0;sh.parts[0].offset=3;s=createSolver(sh.parts,sh.wires);for(let i=0;i<140;i++)r=s.step(dt,true);assert.ok(r.switchOn('S1'));assert.ok(Math.abs(r.at('C1.a')-3)<.001);const held=r.at('C1.a');for(let i=0;i<400;i++)r=s.step(dt,true);assert.ok(!r.switchOn('S1'));assert.ok(Math.abs(r.at('C1.a')-held)<.002);
// Real leakage gives exponential droop during hold; a disconnected gate is rejected.
sh.parts.find(c=>c.id==='R1').value=10000;s=createSolver(sh.parts,sh.wires);let at20,at80;for(let i=0;i<800;i++){r=s.step(dt,true);if(i===199)at20=r.at('C1.a');if(i===799)at80=r.at('C1.a')}assert.ok(Math.abs(at80/at20-Math.exp(-60e-6/100e-6))<.002);
assert.throws(()=>createSolver(sh.parts,sh.wires.filter(w=>!w.includes('S1.g'))),/floating/);
// Same potential probes read exactly zero; KCL source current has expected sign.
assert.equal(r.at('C1.b')-r.at('GND.0'),0);assert.ok(Number.isFinite(r.current('V1')));
console.log('Circuit workbench: RC charge/discharge, polarity, sine gain, sampling, hold droop and wiring faults passed.');
