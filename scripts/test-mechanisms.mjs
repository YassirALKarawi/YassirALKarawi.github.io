import assert from 'node:assert/strict';
import {aliasFrequency,replicas,kernelData,symbolPoint,symbolWaves,overlap} from '../learning/digital-communications/academy/mechanism-models.mjs';
import {buildSignal,bit,TAU,sinc} from '../learning/digital-communications/academy/signals.mjs';
const near=(a,b,tol=1e-10)=>assert.ok(Math.abs(a-b)<tol,`${a} ≠ ${b}`);
// The original sine and its signed alias agree at all clock instants.
for(const [f,fs] of [[100,800],[100,150],[300,400],[100,200],[400,100]])for(let n=0;n<80;n++)near(Math.sin(TAU*f*n/fs),Math.sin(TAU*aliasFrequency(f,fs)*n/fs));
// Analytic spectrum: each isolated sine line weighs A/2. Opposing coincident
// complex coefficients cancel at the zero-phase sine's Nyquist boundary.
assert.deepEqual(replicas(100,800,200),[{frequency:-100,magnitude:.4},{frequency:100,magnitude:.4}]);
assert.deepEqual(replicas(100,200,600),[]);
assert.deepEqual(replicas(100,100,600),[]);
assert.deepEqual(replicas(100,150,70),[{frequency:-50,magnitude:.4},{frequency:50,magnitude:.4}]);
// Every included sinc sample is reproduced; between samples, independently sum
// all 17 weighted kernels and compare with the incrementally assembled model.
for(let n=0;n<=6;n++)near(kernelData(100,800,17,n).sum,.8*Math.sin(TAU*100*n/800));
for(const u of [.1,1.35,2.7,4.2]){let sum=0;for(let n=-8;n<=8;n++)sum+=.8*Math.sin(TAU*100*n/800)*sinc(u-n);near(kernelData(100,800,17,u).sum,sum)}
for(const id of ['qpsk','qam']){const k=id==='qpsk'?2:4,M=2**k,points=Array.from({length:M},(_,n)=>symbolPoint(id,n));assert.equal(new Set(points.map(x=>x.map(v=>v.toFixed(8)).join(','))).size,M);const avg=points.reduce((a,[I,Q])=>a+I*I+Q*Q,0)/M;near(avg,id==='qpsk'?1:10);
// Check every nearest-neighbour label differs by one bit.
let min=Infinity;for(let i=0;i<M;i++)for(let j=i+1;j<M;j++)min=Math.min(min,Math.hypot(points[i][0]-points[j][0],points[i][1]-points[j][1]));for(let i=0;i<M;i++)for(let j=i+1;j<M;j++)if(Math.abs(Math.hypot(points[i][0]-points[j][0],points[i][1]-points[j][1])-min)<1e-9)assert.equal((i^j).toString(2).replace(/0/g,'').length,1);
// Mapping and sign convention agree with the existing laboratory's bit words.
const model=buildSignal(id,{Rb:1000}),Rs=1000/k;for(let n=0;n<8;n++){let word=0;for(let b=0;b<k;b++)word=2*word+bit(n*k+b);const [I,Q]=symbolPoint(id,word),lab=model.fn((n+.17)/Rs);near(I,lab[0]);near(Q,lab[1]);near(lab[2],I*Math.cos(TAU*4*(n+.17))-Q*Math.sin(TAU*4*(n+.17)))}
for(const u of [0,.13,.99,1,2.75,9.13]){const w=symbolWaves(id,u);near(w.sum,w.a+w.b)}
}
// Numerical overlap integration independently verifies the normalized triangle.
for(const u of [0,.25,.5,1,1.25,1.75,2,2.2]){const N=20000,dx=4/N;let integral=0;for(let i=0;i<N;i++){const tau=-1+(i+.5)*dx;integral+=(tau>=0&&tau<=1&&u-tau>=0&&u-tau<=1?1:0)*dx}near(overlap(u).area,integral,3e-4)}
console.log('PASS: sample/alias equality, complex spectrum cancellation, weighted sinc sums, Gray constellations, laboratory mapping, branch sums and independently integrated matched-filter overlap.');
