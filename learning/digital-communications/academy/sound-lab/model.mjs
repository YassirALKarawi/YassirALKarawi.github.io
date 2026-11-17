import {quantize} from '../signals.mjs';

export const FS=8000, DURATION=6, CAPACITY=64000, OVERHEAD=.10, TARGET_DB=35;
export const BASELINE=Object.freeze({gain:1.65,bits:6});
export const CASES=Object.freeze({normal:{amplitude:.9},transfer:{amplitude:1.15}});
export const MODEL_VERSION='sound-lab-1';

// A six-note, deterministic test signal. All harmonics are below 1 kHz.
// The envelope joins notes smoothly; peak normalization uses the actual samples.
const notes=[220,277.18,329.63,293.66,246.94,220];
const unit=new Float64Array(FS*DURATION);
let peak=0;
for(let i=0;i<unit.length;i++){
  const t=i/FS,section=Math.floor(t),u=t-section;
  const env=Math.min(1,u/.025,(1-u)/.06);
  const phase=2*Math.PI*notes[section]*u;
  unit[i]=env*(Math.sin(phase)+.28*Math.sin(2*phase)+.12*Math.sin(3*phase));
  peak=Math.max(peak,Math.abs(unit[i]));
}
for(let i=0;i<unit.length;i++)unit[i]/=peak;

export function parameters(input={}){
  const gain=Number(input.gain??BASELINE.gain),bits=Number(input.bits??BASELINE.bits);
  if(!Number.isFinite(gain)||gain<.3||gain>2||!Number.isInteger(bits)||bits<2||bits>10)throw new RangeError('Invalid experiment parameters');
  return {gain:Math.round(gain*100)/100,bits};
}
export function sourceFor(caseId='normal'){
  if(!Object.hasOwn(CASES,caseId))throw new RangeError('Unknown case');
  return Float64Array.from(unit,x=>x*CASES[caseId].amplitude);
}
export function process(source,settings=BASELINE){
  const {gain,bits}=parameters(settings),input=new Float64Array(source.length),adc=new Float64Array(source.length),output=new Float64Array(source.length),indices=new Uint16Array(source.length);
  let signalPower=0,errorPower=0,overloaded=0,maxInput=0,maxError=0;
  for(let i=0;i<source.length;i++){
    if(!Number.isFinite(source[i]))throw new RangeError('Non-finite sample');
    input[i]=source[i]*gain;
    const sample=quantize(input[i],bits);
    adc[i]=sample.q;indices[i]=sample.index;output[i]=sample.q/gain;
    if(input[i]<-1||input[i]>=1)overloaded++;
    maxInput=Math.max(maxInput,Math.abs(input[i]));
    const error=output[i]-source[i];
    signalPower+=source[i]**2;errorPower+=error**2;maxError=Math.max(maxError,Math.abs(error));
  }
  const snr=errorPower===0?Infinity:signalPower===0?-Infinity:10*Math.log10(signalPower/errorPower);
  const payload=FS*bits,lineRate=payload*(1+OVERHEAD);
  return {input,adc,output,indices,settings:{gain,bits},metrics:{snr,overloaded,overloadPercent:source.length?100*overloaded/source.length:0,maxInput,maxError,payload,lineRate,step:2/2**bits}};
}
export function evaluateRepair(result){
  const m=result.metrics;
  const checks={range:m.overloaded===0,quality:m.snr>=TARGET_DB,capacity:m.lineRate<=CAPACITY};
  return {...checks,passed:Object.values(checks).every(Boolean)};
}
export function sampleAt(source,result,index){
  const i=Math.max(0,Math.min(source.length-1,Math.round(Number(index)||0)));
  return {index:i,time:i/FS,source:source[i],input:result.input[i],level:result.adc[i],code:result.indices[i].toString(2).padStart(result.settings.bits,'0'),output:result.output[i],error:result.output[i]-source[i]};
}
export function parseExperiment(search){
  const q=new URLSearchParams(search),shared=q.get('v')==='1'&&q.has('g')&&q.has('b');
  try{return {shared,caseId:q.get('case')==='transfer'?'transfer':'normal',settings:shared?parameters({gain:q.get('g'),bits:q.get('b')}):{...BASELINE}}}catch{return {shared:false,caseId:'normal',settings:{...BASELINE}}}
}
export function experimentQuery(settings,caseId,language){
  const p=parameters(settings);
  return new URLSearchParams({v:'1',g:p.gain.toFixed(2),b:String(p.bits),case:caseId==='transfer'?'transfer':'normal',lang:language==='en'?'en':'ar'}).toString();
}
// Fixed playback scale, identical across A/B/C. No per-track normalization.
export const PLAYBACK_SCALE=.4;
export function wavBytes(samples){
  const out=new ArrayBuffer(44+samples.length*2),v=new DataView(out);
  const text=(i,s)=>{for(let n=0;n<s.length;n++)v.setUint8(i+n,s.charCodeAt(n))};
  text(0,'RIFF');v.setUint32(4,36+samples.length*2,true);text(8,'WAVE');text(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,FS,true);v.setUint32(28,FS*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);text(36,'data');v.setUint32(40,samples.length*2,true);
  samples.forEach((x,i)=>v.setInt16(44+i*2,Math.round(Math.max(-1,Math.min(1,x*PLAYBACK_SCALE))*32767),true));
  return out;
}
