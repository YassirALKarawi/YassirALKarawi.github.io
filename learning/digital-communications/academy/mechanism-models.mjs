import {sinc,TAU} from './signals.mjs?v=scienceRef4';
export const mechanismIds=['sampling','alias','reconstruct','qpsk','qam','matched'];
export function aliasFrequency(f,fs){return f-Math.round(f/fs)*fs}
// Spectrum of a sine sampled by an ideal unit-area impulse train, divided by fs.
// Combine complex (imaginary) weights before taking magnitudes, including at Nyquist.
export function replicas(f,fs,limit,amplitude=.8){const lines=new Map(),N=Math.ceil((limit+f)/fs)+1;for(let m=-N;m<=N;m++)for(const sign of [-1,1]){const x=m*fs+sign*f;if(Math.abs(x)>limit+1e-8)continue;const key=Math.round(x*1e8)/1e8;lines.set(key,(lines.get(key)||0)-sign*amplitude/2)}return [...lines].map(([frequency,imag])=>({frequency,magnitude:Math.abs(imag)})).filter(l=>l.magnitude>1e-9).sort((a,b)=>a.frequency-b.frequency)}
export const kernelOrder=Array.from({length:17},(_,i)=>i-8).sort((a,b)=>Math.abs(a-3)-Math.abs(b-3)||a-b);
export function kernelData(f,fs,count,u){const source=n=>.8*Math.sin(TAU*f*n/fs),indices=kernelOrder.slice(0,count);return{indices,last:indices.at(-1),sample:source,sum:indices.reduce((v,n)=>v+source(n)*sinc(u-n),0),source:source(u)}}
export function symbolPoint(id,word){const k=id==='qpsk'?2:4,v=word%(2**k);if(id==='qpsk'){const a=[45,135,315,225][v]*Math.PI/180;return[Math.cos(a),Math.sin(a)]}const map=[-3,-1,3,1];return[map[(v>>2)&3],map[v&3]]}
export function symbolWaves(id,u){const k=id==='qpsk'?2:4,word=Math.floor(u)%(2**k),[I,Q]=symbolPoint(id,word),a=I*Math.cos(TAU*4*u),b=-Q*Math.sin(TAU*4*u);return{word,I,Q,a,b,sum:a+b}}
export function overlap(u){const left=Math.max(0,u-1),right=Math.min(1,u);return{left,right,area:Math.max(0,right-left)}}
