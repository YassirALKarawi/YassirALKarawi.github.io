import assert from 'node:assert/strict';
import {voltage} from '../learning/digital-communications/academy/student-path/circuit-engine.mjs';
import {conditionTrace,metrics,triggerWindow,atTime} from '../learning/digital-communications/academy/student-path/bench-models.mjs';
const c={type:'source',amp:2.5,offset:2.5,f:1000,wave:'square',duty:.2};assert.equal(voltage(c,.0001),5);assert.equal(voltage(c,.0005),0);assert.equal(voltage({...c,wave:'dc'},.0001),2.5);assert.ok(Math.abs(voltage({...c,wave:'sine',phase:90,offset:0},0)-2.5)<1e-12);
const records=Array.from({length:10001},(_,i)=>({t:i*1e-6,values:{tip:2+3*Math.sin(2*Math.PI*1000*i*1e-6),g:0}}));
const trace=conditionTrace(records,'tip','g'),m=metrics(trace);assert.ok(Math.abs(m.mean-2)<1e-10);assert.ok(Math.abs(m.rms-Math.sqrt(8.5))<1e-10);assert.ok(Math.abs(m.vpp-6)<1e-10);assert.ok(Math.abs(m.f-1000)<.001);
const win=triggerWindow(trace,.002,2,'rise');assert.ok(win);assert.ok(Math.abs(atTime(trace,win.trigger)-2)<1e-10);assert.ok(Math.abs(win.trigger-win.start-.0004)<1e-12);assert.equal(triggerWindow(trace,.002,50),null);assert.equal(triggerWindow(trace.slice(0,20),.002,2),null);
const flat=records.map(r=>({t:r.t,values:{tip:5,g:0}}));assert.ok(conditionTrace(flat,'tip','g','AC').every(p=>p.v===0));assert.ok(conditionTrace(records,'tip','g','GND').every(p=>p.v===0));assert.ok(Number.isNaN(metrics(conditionTrace(flat,'tip','g')).f));assert.deepEqual(conditionTrace(records,'','g'),[]);assert.ok(Number.isNaN(atTime(trace,.02)));
console.log('PASS: waveform phase/duty/DC, measured RMS/mean/Vpp/frequency, edge triggering, no false trigger and AC DC rejection.');
// Streaming AC state must not restart when the visible acquisition buffer rolls.
const {createACFilter}=await import('../learning/digital-communications/academy/student-path/bench-models.mjs');
const hp=createACFilter();let last=[];for(let i=0;i<100000;i++){const t=i*1e-6,y=hp(t,5+2*Math.sin(2*Math.PI*1000*t));if(i>=90000)last.push({t,v:y})}const am=metrics(last);assert.ok(Math.abs(am.mean)<.001);assert.ok(Math.abs(am.rms-Math.SQRT2)<.002);assert.ok(am.f>999&&am.f<1001);
console.log('PASS: streaming AC rejection remains accurate beyond a rolled acquisition buffer.');
