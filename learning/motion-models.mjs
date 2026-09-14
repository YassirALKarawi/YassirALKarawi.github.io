// Deterministic teaching models. Time is normalized, not real RF propagation time.
export const TAU = 2 * Math.PI;
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const sinc = x => Math.abs(x) < 1e-8 ? 1 : Math.sin(Math.PI*x)/(Math.PI*x);
export function raisedCosine(x, alpha) {
  if (alpha === 0) return sinc(x);
  if (Math.abs(Math.abs(2*alpha*x)-1) < 1e-5) return Math.PI/4*sinc(1/(2*alpha));
  return sinc(x)*Math.cos(Math.PI*alpha*x)/(1-4*alpha*alpha*x*x);
}
export function quantize(x, bits) {
  const levels = 2**bits, delta = 2/levels;
  const index = clamp(Math.floor((x+1)/delta), 0, levels-1);
  return {index, value:-1+(index+.5)*delta, delta, levels, word:index.toString(2).padStart(bits,'0')};
}
export function aliasFrequency(f, fs) { return Math.abs(f-Math.round(f/fs)*fs); }
export function gaussian(i, seed=1) {
  const hash = n => {const x=Math.sin(n*12.9898+seed*78.233)*43758.5453;return x-Math.floor(x);};
  return Math.sqrt(-2*Math.log(Math.max(1e-9,hash(i*2+1))))*Math.cos(TAU*hash(i*2+2));
}
export function qFunction(x) {
  const z=Math.abs(x), t=1/(1+.2316419*z);
  const q=Math.exp(-z*z/2)/Math.sqrt(TAU)*t*(.319381530+t*(-.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429))));
  return x<0?1-q:q;
}
export function constellation(type, order) {
  if(type==='qam') {
    const side=Math.sqrt(order), norm=Math.sqrt(2*(order-1)/3), pts=[];
    for(let j=0;j<side;j++)for(let i=0;i<side;i++)pts.push([(2*i-side+1)/norm,(2*j-side+1)/norm]);
    return pts;
  }
  return Array.from({length:order},(_,i)=>[Math.cos(TAU*i/order+Math.PI/order),Math.sin(TAU*i/order+Math.PI/order)]);
}
export function hammingEncode(bits) {
  const [d1,d2,d3,d4]=bits.map(Number);
  return [d1^d2^d4,d1^d3^d4,d1,d2^d3^d4,d2,d3,d4];
}
export function hammingDecode(word) {
  const w=[...word], s1=w[0]^w[2]^w[4]^w[6],s2=w[1]^w[2]^w[5]^w[6],s4=w[3]^w[4]^w[5]^w[6];
  const syndrome=s1+2*s2+4*s4;if(syndrome)w[syndrome-1]^=1;
  return {syndrome,corrected:w,data:[w[2],w[4],w[5],w[6]]};
}
export function lineLevel(bits, t, mode) {
  const k=Math.min(bits.length-1,Math.floor(t)), b=+bits[k], fraction=t-k;
  if(mode===2)return b?(fraction<.5?1:-1):(fraction<.5?-1:1);
  if(mode===3) return b?(bits.slice(0,k+1).split('').filter(x=>x==='1').length%2?1:-1):0;
  return b?1:-1;
}
export function carrierValue(type,bits,t,cycles=3) {
  const k=clamp(Math.floor(t),0,bits.length-1), bit=+bits[k];
  // Integer-cycle BFSK tones keep phase continuous at all bit boundaries.
  const frequency=type==='fsk'?cycles+2*bit:cycles;
  return (type==='ask'?bit:1)*Math.cos(TAU*frequency*t+(type==='psk'?Math.PI*bit:0));
}
