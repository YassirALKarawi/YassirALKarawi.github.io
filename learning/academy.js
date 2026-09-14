(() => {
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  let running = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  let phase = 0, seed = 3;

  function renderMath(){
    if (!window.katex) return setTimeout(renderMath, 120);
    $$('.math').forEach(el => { try { katex.render(el.dataset.math, el, {throwOnError:false, displayMode:true}); } catch {} });
  }
  if ($('.math')) renderMath();

  const motion = $('#motion-toggle');
  motion?.addEventListener('click', () => { running=!running; document.body.classList.toggle('motion-paused',!running); motion.textContent=running?'Pause motion':'Resume motion'; motion.setAttribute('aria-pressed',String(!running)); if(running) requestAnimationFrame(loop); });

  const observed = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting)e.target.classList.add('visible'); }), {threshold:.08});
  $$('.reveal-on-scroll').forEach(el => observed.observe(el));

  const progress = $('#reading-progress');
  function updateProgress(){ if(!progress)return; const max=document.documentElement.scrollHeight-innerHeight; progress.style.width=`${max?Math.min(100,scrollY/max*100):0}%`; }
  addEventListener('scroll',updateProgress,{passive:true}); updateProgress();

  const pop=$('#term-popover');
  $$('.term').forEach(term=>term.addEventListener('click',()=>{if(!pop)return; $('strong',pop).textContent=term.dataset.ar; $('small',pop).textContent=term.dataset.en; $('p',pop).textContent=term.dataset.desc; pop.hidden=false; const r=term.getBoundingClientRect(); pop.style.left=`${Math.max(12,Math.min(innerWidth-pop.offsetWidth-12,r.left))}px`; pop.style.top=`${Math.max(12,Math.min(innerHeight-pop.offsetHeight-12,r.bottom+8))}px`;}));
  pop?.querySelector('button')?.addEventListener('click',()=>pop.hidden=true);
  addEventListener('keydown',e=>{if(e.key==='Escape'&&pop)pop.hidden=true});

  let flowIndex=0;
  function updateFlow(){const nodes=$$('.flow-node');if(!nodes.length)return;nodes.forEach(n=>n.classList.remove('active'));nodes[flowIndex%nodes.length].classList.add('active');const cap=$('#flow-caption');if(cap)cap.textContent=`Stage ${flowIndex+1}: ${nodes[flowIndex%nodes.length].querySelector('strong').textContent} is processing the current signal.`;flowIndex=(flowIndex+1)%nodes.length;}
  updateFlow(); setInterval(()=>{if(running)updateFlow()},1300);

  function grade(form){
    const fields=$$('fieldset[data-answer]',form); let score=0,answered=0;
    fields.forEach(f=>{const chosen=$('input:checked',f); f.classList.remove('is-correct','is-wrong'); if(!chosen)return; answered++; const ok=+chosen.value===+f.dataset.answer; if(ok)score++; f.classList.add(ok?'is-correct':'is-wrong'); const fb=$('.question-feedback',f); fb.textContent=`${ok?'Correct.':'Not yet.'} ${f.dataset.explain}`;});
    const card=$('#score-card',form)||$('#score-card'); if(card){$('strong',card).textContent=`${score} / ${fields.length}`;$('p',card).textContent=answered<fields.length?`${answered} of ${fields.length} answered. Complete the unanswered questions, then grade again.`:score===fields.length?'Excellent: every concept is secure. Explain two answers aloud to confirm mastery.':score>=Math.ceil(fields.length*.8)?'Strong result. Review the explanations for missed questions.':'Return to the equations and worked examples, then try again.';}
    if(form.id==='mastery-quiz'){localStorage.setItem(`ya-score-${document.body.dataset.lesson}`,String(score));document.querySelector(`[data-lesson-card="${document.body.dataset.lesson}"]`);}
  }
  $('#mastery-quiz')?.addEventListener('submit',e=>{e.preventDefault();grade(e.currentTarget)});
  $('#bank-form')?.addEventListener('submit',e=>{e.preventDefault();grade(e.currentTarget)});

  $$('[data-lesson-card]').forEach(card=>{const score=localStorage.getItem(`ya-score-${card.dataset.lessonCard}`);if(score!==null){const out=$('[data-card-progress]',card);out.textContent=`Quiz ${score}/5`;out.style.color=+score>=4?'#08796e':'#a66b00';}});

  const bits=$('#lab-bits'),primary=$('#primary'),noise=$('#noise'),speed=$('#speed');
  function cleanBits(){if(!bits)return '10110100';bits.value=bits.value.replace(/[^01]/g,'').slice(0,12)||'101';return bits.value;}
  [bits,primary,noise,speed].forEach(el=>el?.addEventListener('input',()=>{seed++;updateOutputs();drawLab()}));
  $('#randomize')?.addEventListener('click',()=>{seed=Math.floor(Math.random()*9999);if(bits)bits.value=Array.from({length:8},()=>Math.random()>.5?'1':'0').join('');drawLab()});
  function updateOutputs(){if(primary)$('#primary-out').textContent=primary.value;if(noise)$('#noise-out').textContent=(+noise.value/100).toFixed(2);if(speed)$('#speed-out').textContent=`${(+speed.value/10).toFixed(1)}×`;}
  updateOutputs();

  function rand(i){const x=Math.sin((i+seed)*12.9898)*43758.5453;return (x-Math.floor(x))*2-1}
  function setup(canvas){const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);ctx.fillStyle='#061725';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#17394e';ctx.lineWidth=1;for(let x=55;x<w;x+=90){ctx.beginPath();ctx.moveTo(x,25);ctx.lineTo(x,h-45);ctx.stroke()}for(let y=45;y<h-40;y+=70){ctx.beginPath();ctx.moveTo(45,y);ctx.lineTo(w-25,y);ctx.stroke()}return {ctx,w,h}}
  function line(ctx,fn,x0,x1,color,width=3){ctx.beginPath();for(let x=x0;x<=x1;x++){const y=fn(x);x===x0?ctx.moveTo(x,y):ctx.lineTo(x,y)}ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()}
  function label(ctx,text,x,y,color='#86a4b7',size=14){ctx.fillStyle=color;ctx.font=`600 ${size}px Manrope, system-ui`;ctx.fillText(text,x,y)}
  function axes(ctx,w,h){ctx.strokeStyle='#7590a2';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(48,h/2);ctx.lineTo(w-35,h/2);ctx.stroke();label(ctx,'time →',w-105,h/2+28)}
  function drawDigital(ctx,b,w,y,amp,color='#ffd15c'){const cw=(w-90)/b.length;ctx.beginPath();b.split('').forEach((bit,i)=>{const yy=y-(bit==='1'?amp:0),x=50+i*cw;if(i===0)ctx.moveTo(x,yy);else ctx.lineTo(x,yy);ctx.lineTo(x+cw,yy);if(i<b.length-1)ctx.lineTo(x+cw,y-(b[i+1]==='1'?amp:0))});ctx.strokeStyle=color;ctx.lineWidth=4;ctx.stroke();return cw}
  function drawWaveLab(canvas,type){
    const {ctx,w,h}=setup(canvas),b=cleanBits(),p=+(primary?.value||4),nz=+(noise?.value||15)/100,cw=(w-90)/b.length,mid=h/2; axes(ctx,w,h);
    label(ctx,type.toUpperCase(),55,36,'#39e4cf',16); drawDigital(ctx,b,w,112,55);
    if(type==='sampling'){
      line(ctx,x=>mid+75*Math.sin((x-50)*.018*p/4),50,w-35,'#39e4cf',3);const step=Math.max(14,95-p*5);for(let x=55;x<w-35;x+=step){const y=mid+75*Math.sin((x-50)*.018*p/4);ctx.strokeStyle='#ffd15c';ctx.beginPath();ctx.moveTo(x,mid+115);ctx.lineTo(x,y);ctx.stroke();ctx.fillStyle='#ffd15c';ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill()}label(ctx,p<3?'ALIASING RISK: sample replicas overlap':'sampling points and continuous signal',60,h-40,p<3?'#ff668f':'#90aabb');return}
    if(type==='quantization'){
      line(ctx,x=>mid+95*Math.sin((x-40)*.018),50,w-35,'#39e4cf',3);const levels=Math.max(2,Math.round(p));for(let x=55;x<w-35;x+=23){const ideal=mid+95*Math.sin((x-40)*.018),q=Math.round((ideal-(mid-100))/200*(levels-1))/(levels-1)*200+(mid-100);ctx.fillStyle='#ffd15c';ctx.fillRect(x-3,q-3,6,6);ctx.strokeStyle='#ff668f';ctx.beginPath();ctx.moveTo(x,ideal);ctx.lineTo(x,q);ctx.stroke()}label(ctx,`${levels} reconstruction levels · error shown in pink`,60,h-40);return}
    if(type==='linecode'){
      const codes=['Polar NRZ','Manchester','AMI'];const mode=(p-1)%3;label(ctx,codes[mode],60,155,'#ffd15c');ctx.beginPath();let mark=1;b.split('').forEach((bit,i)=>{const x=50+i*cw;if(mode===0){const y=mid+(bit==='1'?-65:65);i?ctx.lineTo(x,y):ctx.moveTo(x,y);ctx.lineTo(x+cw,y)}else if(mode===1){const y1=mid+(bit==='1'?-65:65),y2=mid-(bit==='1'?-65:65);i?ctx.lineTo(x,y1):ctx.moveTo(x,y1);ctx.lineTo(x+cw/2,y1);ctx.lineTo(x+cw/2,y2);ctx.lineTo(x+cw,y2)}else{const y=bit==='1'?mid-65*mark:mid;if(bit==='1')mark*=-1;i?ctx.lineTo(x,y):ctx.moveTo(x,y);ctx.lineTo(x+cw,y)}});ctx.strokeStyle='#39e4cf';ctx.lineWidth=4;ctx.stroke();return}
    if(type==='eye'){
      const x0=90,x1=w-70;ctx.globalAlpha=.33;for(let k=0;k<34;k++){line(ctx,x=>mid+80*Math.sin((x-x0)/(x1-x0)*Math.PI*2+(k%4)*Math.PI/2)+(rand(k)*nz*60*Math.sin((x-x0)/(x1-x0)*Math.PI)),x0,x1,k%2?'#39e4cf':'#ffd15c',2)}ctx.globalAlpha=1;ctx.strokeStyle='#ff668f';ctx.setLineDash([8,8]);ctx.beginPath();ctx.moveTo(w/2,145);ctx.lineTo(w/2,h-60);ctx.stroke();ctx.setLineDash([]);label(ctx,`eye opening · impairment ${(nz).toFixed(2)}`,60,h-35);return}
    const cyc=Math.max(1,p);line(ctx,x=>{const i=Math.min(b.length-1,Math.floor((x-50)/cw)),bit=b[i]||'0',t=(x-50)/cw;let s=0;if(type==='ask')s=bit==='1'?Math.sin(t*Math.PI*2*cyc+phase):0;else if(type==='fsk')s=Math.sin(t*Math.PI*2*(bit==='1'?cyc+2:Math.max(1,cyc-1))+phase);else s=Math.sin(t*Math.PI*2*cyc+phase+(bit==='1'?Math.PI:0));return mid-s*80+rand(Math.floor(x))*nz*28},50,w-35,'#39e4cf',3);label(ctx,type==='ask'?'amplitude carries the bits':type==='fsk'?'frequency carries the bits':'phase reversal carries the bits',60,h-40);}
  function drawConstellation(canvas,type){const {ctx,w,h}=setup(canvas),cx=w/2,cy=h/2,nz=+(noise?.value||15)/100,p=+(primary?.value||4);ctx.strokeStyle='#6c8799';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(55,cy);ctx.lineTo(w-45,cy);ctx.moveTo(cx,45);ctx.lineTo(cx,h-45);ctx.stroke();label(ctx,'I',w-65,cy-14);label(ctx,'Q',cx+14,65);let pts=[];if(type==='qam'){const order=p<5?4:p<9?16:64,side=Math.sqrt(order);for(let i=0;i<side;i++)for(let q=0;q<side;q++)pts.push([(i-(side-1)/2)*105/(side/2),(q-(side-1)/2)*105/(side/2)]);label(ctx,`${order}-QAM`,60,40,'#39e4cf',16)}else{const M=p<3?4:p<7?8:16;for(let i=0;i<M;i++)pts.push([Math.cos(i*2*Math.PI/M)*150,Math.sin(i*2*Math.PI/M)*150]);label(ctx,`${M}-PSK`,60,40,'#39e4cf',16)}pts.forEach(([x,y],i)=>{ctx.fillStyle='#ffd15c';ctx.beginPath();ctx.arc(cx+x,cy-y,7,0,Math.PI*2);ctx.fill();for(let k=0;k<6;k++){ctx.fillStyle='rgba(255,102,143,.55)';ctx.beginPath();ctx.arc(cx+x+rand(i*19+k)*nz*48,cy-y+rand(i*23+k+7)*nz*48,3,0,Math.PI*2);ctx.fill()}});label(ctx,'pink clouds show noisy observations',60,h-28)}
  function drawSpecial(canvas,type){const {ctx,w,h}=setup(canvas),p=+(primary?.value||4),nz=+(noise?.value||15)/100,mid=h/2;label(ctx,type.toUpperCase().replaceAll('-',' '),55,38,'#39e4cf',16);
    if(type==='receiver'||type==='signal'||type==='system'){const names=type==='system'?['requirements','coding','mapping','channel','receiver','margin']:type==='receiver'?['r(t)','correlate','sample','metric','decide']:['bits','symbols','waveform','channel','decision'];const gap=(w-120)/names.length;names.forEach((n,i)=>{const x=60+i*gap;ctx.fillStyle=i===Math.floor((phase*.8)%names.length)?'#174e5a':'#102d42';ctx.strokeStyle=i===Math.floor((phase*.8)%names.length)?'#39e4cf':'#34546a';ctx.lineWidth=2;ctx.fillRect(x,mid-45,gap-24,90);ctx.strokeRect(x,mid-45,gap-24,90);label(ctx,n,x+10,mid+5,i===Math.floor((phase*.8)%names.length)?'#39e4cf':'#c8d5dd',12);if(i<names.length-1){ctx.strokeStyle='#ffd15c';ctx.beginPath();ctx.moveTo(x+gap-24,mid);ctx.lineTo(x+gap,mid);ctx.stroke()}});return}
    if(type==='ber'){ctx.strokeStyle='#6d899b';ctx.beginPath();ctx.moveTo(75,65);ctx.lineTo(75,h-65);ctx.lineTo(w-40,h-65);ctx.stroke();for(let m=0;m<3;m++){line(ctx,x=>h-80-(h-180)*(1-Math.exp(-(x-75)/(150+80*m))),75,w-45,['#39e4cf','#ffd15c','#ff668f'][m],3)}label(ctx,'BER (log scale)',15,85);label(ctx,'Eᵦ/N₀ →',w-130,h-30);label(ctx,'BPSK',w-130,105,'#39e4cf');label(ctx,'coded',w-130,135,'#ffd15c');label(ctx,'higher-order',w-130,165,'#ff668f');return}
    if(type==='coding'){const rows=8,cols=14;for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const active=((x*3+y*5+seed)%7)<3;ctx.fillStyle=active?'#39e4cf':'#163449';if(nz>.5&&((x+y+seed)%11===0))ctx.fillStyle='#ff668f';ctx.fillRect(70+x*55,90+y*45,38,26)}label(ctx,'structured redundancy · pink cells are channel errors',60,h-40);return}
    if(type==='ofdm'){for(let k=0;k<9;k++){const center=90+k*(w-170)/8;line(ctx,x=>{const u=(x-center)/35;const sinc=Math.abs(u)<.01?1:Math.sin(Math.PI*u)/(Math.PI*u);return h-95-sinc*sinc*230},50,w-35,k===Math.round(p/2)?'#ffd15c':'rgba(57,228,207,.6)',2)}label(ctx,'overlapping orthogonal sinc spectra',60,h-40);return}
    if(type==='sync'){line(ctx,x=>mid+90*Math.sin((x-50)*.035+phase),50,w-35,'#39e4cf',3);line(ctx,x=>mid+90*Math.sin((x-50)*.035+phase+nz*2)+(nz*35),50,w-35,'#ff668f',3);for(let x=100;x<w-40;x+=100){ctx.strokeStyle='#ffd15c';ctx.beginPath();ctx.moveTo(x,mid-130);ctx.lineTo(x,mid+130);ctx.stroke()}label(ctx,'cyan: reference · pink: offset received signal',60,h-40);}
  }
  function drawLab(){const canvas=$('#lab-canvas');if(!canvas)return;const type=document.body.dataset.visual; if(['sampling','quantization','linecode','eye','ask','fsk','psk'].includes(type))drawWaveLab(canvas,type);else if(['constellation','qam'].includes(type))drawConstellation(canvas,type);else drawSpecial(canvas,type);}

  function drawHero(canvas,type){const {ctx,w,h}=setup(canvas),mid=h/2;label(ctx,'REFERENCE',45,38,'#6f8ca0',12);if(['constellation','qam'].includes(type)){drawConstellation(canvas,type);return}if(['sampling','quantization','linecode','eye','ask','fsk','psk'].includes(type)){drawWaveLab(canvas,type);return}drawSpecial(canvas,type)}
  function drawHub(){const c=$('#hub-canvas');if(!c)return;const {ctx,w,h}=setup(c),names=['BITS','MAPPER','WAVEFORM','CHANNEL','DETECTOR'];const gap=(w-110)/names.length,y=300;names.forEach((n,i)=>{const x=55+i*gap,active=i===Math.floor((phase*.7)%names.length);ctx.fillStyle=active?'#164d59':'#0d2a3d';ctx.strokeStyle=active?'#39e4cf':'#315066';ctx.lineWidth=2;ctx.fillRect(x,y-58,gap-30,116);ctx.strokeRect(x,y-58,gap-30,116);label(ctx,n,x+13,y+5,active?'#39e4cf':'#b8c9d3',13);if(i<names.length-1){ctx.strokeStyle='#ffd15c';ctx.beginPath();ctx.moveTo(x+gap-30,y);ctx.lineTo(x+gap,y);ctx.stroke();ctx.fillStyle='#ffd15c';ctx.beginPath();ctx.arc(x+gap-20+((phase*35)%(gap-20)),y,5,0,Math.PI*2);ctx.fill()}});line(ctx,x=>105+32*Math.sin((x-55)*.045+phase),55,w-50,'#39e4cf',3);drawDigital(ctx,'10110100',w,h-70,40,'#ffd15c');}
  function loop(){if(!running)return;phase+=(+(speed?.value||10)/10)*.022;drawLab();const hero=$('#hero-canvas');if(hero)drawHero(hero,document.body.dataset.visual);drawHub();const r=$('#visual-readout');if(r)r.textContent=`t = ${(phase).toFixed(2)}`;requestAnimationFrame(loop)}
  drawLab(); if(!running){const hero=$('#hero-canvas');if(hero)drawHero(hero,document.body.dataset.visual);drawHub()}else requestAnimationFrame(loop);
})();
