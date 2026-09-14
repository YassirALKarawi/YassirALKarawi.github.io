import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import * as models from '../learning/motion-models.mjs';
import {course} from './learning-curriculum.mjs';

assert.ok(Math.abs(models.qFunction(0)-.5)<1e-7);
assert.ok(Math.abs(models.qFunction(3)-.001349898)<1e-6);
assert.equal(models.aliasFrequency(7,10),3);
assert.equal(models.aliasFrequency(9,12),3);
for(let b=1;b<=5;b++)for(let x=-1;x<=1;x+=.003){const q=models.quantize(x,b);assert.ok(Math.abs(x-q.value)<=q.delta/2+1e-9);assert.equal(q.word.length,b);}
for(const a of [0,.2,.35,.5,1]){assert.ok(Number.isFinite(models.raisedCosine(a?1/(2*a):1,a)));assert.equal(models.raisedCosine(0,a),1);for(let i=1;i<5;i++)assert.ok(Math.abs(models.raisedCosine(i,a))<1e-8);}
for(const M of [4,16,64]){const pts=models.constellation('qam',M);assert.equal(pts.length,M);assert.ok(Math.abs(pts.reduce((s,[x,y])=>s+x*x+y*y,0)/M-1)<1e-10);}
for(let d=0;d<16;d++){const bits=d.toString(2).padStart(4,'0').split('').map(Number),word=models.hammingEncode(bits);assert.equal(models.hammingDecode(word).syndrome,0);for(let i=0;i<7;i++){const bad=[...word];bad[i]^=1;const out=models.hammingDecode(bad);assert.equal(out.syndrome,i+1);assert.deepEqual(out.data,bits);}}
assert.deepEqual([0,1,2,3].map(t=>models.lineLevel('1101',t,3)),[1,-1,0,1]);
assert.ok(models.carrierValue('ask','01',.2,3)===0);

const source=(await readFile(new URL('../learning/motion-studio.js',import.meta.url),'utf8')).replace(/^import .*?;\n/,'');
function fakeElement(value='') {const handlers={};const classes=new Set();return {value,handlers,style:{setProperty(){}},dataset:{},hidden:false,firstChild:{textContent:''},classList:{add:(...xs)=>xs.forEach(x=>classes.add(x)),toggle:(x,v)=>v?classes.add(x):classes.delete(x),contains:x=>classes.has(x)},setAttribute(){},addEventListener(k,f){handlers[k]=f;},closest(){return this.parent||(this.parent=fakeElement());}};}
function runScene(lesson,reduced=false){
  let recording=[],pending=null,id=0;
  const ctx=new Proxy({}, {get(target,key){if(key==='createLinearGradient')return()=>({addColorStop(){}});if(key==='clearRect')return()=>{recording=[];};if(!(key in target))target[key]=(...args)=>{for(const a of args)if(typeof a==='number')assert.ok(Number.isFinite(a),`${lesson.visual}: ${String(key)} received ${a}`);recording.push([key,...args]);};return target[key];},set(target,key,value){target[key]=value;return true;}});
  const canvas=fakeElement();canvas.id='hero-canvas';canvas.getContext=()=>ctx;
  const primary=fakeElement('4'),noise=fakeElement('15'),bits=fakeElement('10110100'),toggle=fakeElement(),step=fakeElement(),restart=fakeElement(),speed=fakeElement('1');
  const one={'#primary':primary,'#noise':noise,'#lab-bits':bits,'#motion-toggle':toggle,'#visual-readout':fakeElement(),'#primary-out':fakeElement(),'#noise-out':fakeElement(),'#observation-text':fakeElement()};
  const many={'#hero-canvas,#lab-canvas,#hub-canvas':[canvas],'[data-motion="toggle"],#motion-toggle':[toggle],'[data-motion="step"]':[step],'[data-motion="restart"]':[restart],'[data-motion="speed"]':[speed],'.motion-status':[fakeElement()]};
  const body=fakeElement();body.dataset.visual=lesson.visual;
  const document={body,hidden:false,querySelector:s=>one[s]||null,querySelectorAll:s=>many[s]||[],addEventListener(){}};
  const sandbox={...models,document,matchMedia:()=>({matches:reduced,addEventListener(){}}),requestAnimationFrame:cb=>{pending=cb;return ++id;},cancelAnimationFrame:()=>{pending=null;},IntersectionObserver:class{observe(){}},console};
  vm.runInNewContext(source,sandbox,{filename:'motion-studio.js'});
  const hash=()=>createHash('sha256').update(JSON.stringify(recording)).digest('hex');
  const first=hash();
  if(reduced){assert.equal(pending,null);assert.ok(body.classList.contains('motion-paused'));toggle.handlers.click();}
  for(let i=0;i<100;i++){assert.ok(pending,`${lesson.visual} animation stopped`);const cb=pending;pending=null;cb(10+i*30);}
  assert.notEqual(hash(),first,`${lesson.visual}: no changing geometry or labels`);
  assert.ok(+canvas.dataset.frameTime>2);
  toggle.handlers.click();assert.equal(pending,null);const paused=hash();assert.ok(body.classList.contains('motion-paused'));
  step.handlers.click();assert.notEqual(hash(),paused);assert.equal(pending,null);
  restart.handlers.click();assert.ok(pending);assert.equal(canvas.dataset.frameTime,'0.000');
  // Exercise the actual control extrema; every drawing coordinate must stay finite.
  for(const p of [primary.min,primary.max])for(const n of [noise.min,noise.max]){primary.value=p;noise.value=n;primary.handlers.input();}
  return lesson.visual;
}
for(const lesson of course.lessons)console.log(`PASS ${runScene(lesson)}: moving geometry, pause, step, replay, slider bounds`);
runScene(course.lessons[0],true);
for(const lesson of course.lessons){const html=await readFile(new URL(`../learning/digital-communications/${lesson.slug}.html`,import.meta.url),'utf8');assert.ok(html.includes('motion-studio.js'));assert.ok(html.includes('motion-studio.css'));assert.equal((html.match(/data-transport=/g)||[]).length,2);assert.equal((html.match(/class="flow-node"/g)||[]).length,lesson.blocks.length);}
console.log('PASS numerical models, all 112 Hamming single-error cases, reduced-motion startup and 16 generated lesson pages.');
