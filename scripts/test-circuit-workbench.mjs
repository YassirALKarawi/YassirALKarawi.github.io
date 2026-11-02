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
// Realistic instrument extensions: finite output resistance and disabled high impedance.
const output=[{id:'V',type:'source',amp:0,offset:4,f:500,rout:50},{id:'R',type:'resistor',value:50},{id:'G',type:'ground'}],ow=[['V.a','R.a'],['R.b','G.0'],['V.b','G.0']];
s=createSolver(output,ow);r=s.step(1e-7);assert.ok(Math.abs(r.at('R.a')-2)<1e-10);assert.ok(Math.abs(r.current('V')+.04)<1e-10);output[0].enabled=false;r=s.step(1e-7);assert.ok(Math.abs(r.at('R.a'))<1e-10);
const supply=[{id:'P',type:'supply',value:5,limit:.02},{id:'R',type:'resistor',value:1000},{id:'G',type:'ground'}],pw=[['P.a','R.a'],['R.b','G.0'],['P.b','G.0']];
s=createSolver(supply,pw);r=s.step(1e-7);assert.equal(r.mode('P'),'CV');assert.equal(r.at('P.a'),5);assert.ok(Math.abs(r.current('P')+.005)<1e-12);
supply[0].limit=.002;r=s.step(1e-7);assert.equal(r.mode('P'),'CC');assert.ok(Math.abs(r.at('P.a')-2)<1e-12);assert.ok(Math.abs(r.current('P')+.002)<1e-12);supply[0].limit=.02;r=s.step(1e-7);assert.equal(r.mode('P'),'CV');assert.equal(r.at('P.a'),5);
// A shorted supply must limit current rather than pretend the load is still 5 V.
s=createSolver(supply,[...pw,['P.a','P.b']]);r=s.step(1e-7);assert.equal(r.mode('P'),'CC');assert.equal(r.at('P.a'),0);assert.ok(Math.abs(r.current('P')+.02)<1e-12);
// Probe loading is measurable: 1 MΩ on a 1 MΩ divider halves the unprobed output.
const pparts=[{id:'V',type:'source',amp:0,offset:5,f:1},{id:'R',type:'resistor',value:1e6},{id:'Probe',type:'resistor',value:1e6},{id:'G',type:'ground'}];
s=createSolver(pparts,[['V.a','R.a'],['R.b','Probe.a'],['Probe.b','G.0'],['V.b','G.0']]);r=s.step(1e-7);assert.ok(Math.abs(r.at('Probe.a')-2.5)<1e-12);
console.log('PASS: 50 Ω source loading, output OFF, CV→CC→CV, supply short limiting and probe input resistance.');
// Output OFF preserves capacitor voltage; it discharges through the actual load.
const charged=[{id:'V',type:'source',amp:0,offset:5,f:1,rout:50},{id:'C',type:'capacitor',value:100e-9},{id:'R',type:'resistor',value:10000},{id:'G',type:'ground'}],cw=[['V.a','C.a'],['C.a','R.a'],['C.b','G.0'],['R.b','G.0'],['V.b','G.0']];s=createSolver(charged,cw);for(let i=0;i<2000;i++)r=s.step(1e-7);const v0=r.at('C.a');charged[0].enabled=false;for(let i=0;i<100;i++)r=s.step(1e-7);assert.ok(v0>4.97);assert.ok(Math.abs(r.at('C.a')/v0-Math.exp(-10e-6/(10000*100e-9)))<1e-5);
// Current-limited capacitive startup crosses to CV without discarding charge.
const charging=[{id:'P',type:'supply',value:5,limit:.001},{id:'C',type:'capacitor',value:1e-6},{id:'R',type:'resistor',value:100000},{id:'G',type:'ground'}],pc=[['P.a','C.a'],['C.a','R.a'],['C.b','G.0'],['R.b','G.0'],['P.b','G.0']];s=createSolver(charging,pc);for(let i=0;i<1000;i++)r=s.step(1e-6);assert.equal(r.mode('P'),'CC');assert.ok(Math.abs(r.at('C.a')-100*(1-Math.exp(-.001/.1)))<1e-5);for(let i=0;i<7000;i++)r=s.step(1e-6);assert.equal(r.mode('P'),'CV');assert.equal(r.at('C.a'),5);
console.log('PASS: output-OFF capacitor retention/discharge and current-limited capacitive startup.');
