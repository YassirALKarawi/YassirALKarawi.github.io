(() => {
  const glossary = {
    carrier: ['الإشارة الحاملة', 'إشارة جيبية ذات تردد عالٍ تحمل المعلومات بعد تغيير إحدى خصائصها.', 'carrier /ˈkær.i.ər/'],
    ook: ['تضمين التشغيل والإيقاف', 'نوع من ASK تُرسل فيه الحاملة لتمثيل 1 وتُوقف لتمثيل 0.', 'on-off keying (OOK)'],
    'carrier-frequency': ['تردد الإشارة الحاملة', 'عدد دورات الإشارة الحاملة في الثانية، ويُقاس بالهرتز.', 'carrier frequency, Hz']
  };
  const pop = document.querySelector('#term-popover');
  document.querySelectorAll('.term').forEach(term => term.addEventListener('click', event => {
    const data = glossary[term.dataset.term]; if (!data || !pop) return;
    pop.querySelector('strong').textContent = data[0]; pop.querySelector('p').textContent = data[1]; pop.querySelector('small').textContent = data[2];
    const rect = event.currentTarget.getBoundingClientRect();
    pop.hidden = false; pop.style.left = `${Math.min(innerWidth - pop.offsetWidth - 12, Math.max(12, rect.left))}px`; pop.style.top = `${Math.min(innerHeight - pop.offsetHeight - 12, rect.bottom + 8)}px`;
  }));
  pop?.querySelector('button')?.addEventListener('click', () => pop.hidden = true);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && pop) pop.hidden = true; });
  document.querySelectorAll('[data-reveal]').forEach(button => button.addEventListener('click', () => { const answer = document.getElementById(button.dataset.reveal); answer.hidden = !answer.hidden; }));
  document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => { const detail = button.nextElementSibling; detail.hidden = !detail.hidden; }));

  const canvas = document.querySelector('#signal-canvas'); const ctx = canvas?.getContext('2d');
  const bitsInput = document.querySelector('#bits'); const frequency = document.querySelector('#frequency'); const amplitude = document.querySelector('#amplitude'); const noise = document.querySelector('#noise');
  let phase = 0; let running = true;
  function cleanBits() { bitsInput.value = bitsInput.value.replace(/[^01]/g, '').slice(0, 12) || '0'; }
  function drawGrid(y, label, color) { const w=canvas.width; ctx.strokeStyle='#28465c'; ctx.lineWidth=1; for(let x=0;x<=w;x+=w/8){ctx.beginPath();ctx.moveTo(x,y-45);ctx.lineTo(x,y+45);ctx.stroke()} ctx.fillStyle=color;ctx.font='bold 15px system-ui';ctx.fillText(label,12,y-50); }
  function draw() {
    if (!ctx) return; cleanBits(); const bits=bitsInput.value; const w=canvas.width, h=canvas.height, cell=w/bits.length, cyc=+frequency.value, amp=+amplitude.value*2.3, nz=+noise.value*2;
    ctx.clearRect(0,0,w,h); drawGrid(75,'MESSAGE','#ffd768'); drawGrid(195,'CARRIER','#6d91ff'); drawGrid(315,'ASK + NOISE','#43e0ce');
    ctx.strokeStyle='#ffd768';ctx.lineWidth=4;ctx.beginPath();bits.split('').forEach((b,i)=>{const x=i*cell,y=b==='1'?45:95;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);ctx.lineTo((i+1)*cell,y);if(i<bits.length-1)ctx.lineTo((i+1)*cell,bits[i+1]==='1'?45:95)});ctx.stroke();
    for (const [row, gate, color] of [[195,false,'#6d91ff'],[315,true,'#43e0ce']]) {ctx.strokeStyle=color;ctx.lineWidth=3;ctx.beginPath();for(let x=0;x<w;x++){const i=Math.min(bits.length-1,Math.floor(x/cell));const carrier=Math.sin((x/cell)*Math.PI*2*cyc+phase);const active=!gate||bits[i]==='1';const jitter=gate?(Math.sin(x*.41+phase*7)+Math.sin(x*.13))*nz:0;const y=row-(active?carrier*amp:0)+jitter;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke()}
    document.querySelector('#freq-out').textContent=frequency.value;document.querySelector('#amp-out').textContent=(+amplitude.value/10).toFixed(1);document.querySelector('#noise-out').textContent=(+noise.value/10).toFixed(2);
    if(running) phase+=.045; requestAnimationFrame(draw);
  }
  [bitsInput,frequency,amplitude,noise].forEach(el=>el?.addEventListener('input',()=>{if(!running) draw()})); if(ctx) draw();
  document.querySelector('#motion-toggle')?.addEventListener('click', e => { running=!running; document.body.classList.toggle('motion-paused',!running);e.currentTarget.textContent=running?'Pause motion':'Resume motion';e.currentTarget.setAttribute('aria-pressed',String(!running));if(running)draw(); });
  document.querySelector('#check-observation')?.addEventListener('click',()=>{const v=document.querySelector('#observation-select').value;const f=document.querySelector('#observation-feedback');f.textContent=v==='a'?'Correct. Noise spreads the observed amplitudes and increases decision uncertainty.':v?'Try again. Noise changes the observed samples; it does not directly set the bit duration or double the carrier.':'Choose an observation first.';});

  const heroBits=['1','0','1','1','0','1']; let heroIndex=0;
  setInterval(()=>{if(!running)return;const bit=document.querySelector('#hero-bit');if(bit){heroIndex=(heroIndex+1)%heroBits.length;bit.textContent=heroBits[heroIndex];const first=document.querySelector('.visual-equation span');if(first)first.textContent=heroBits[heroIndex];}},1400);
  const stageCaptions=['A bit enters the source encoder','The carrier is gated by the binary message','Noise is added during transmission','The detector estimates the transmitted bit']; let stageIndex=0;
  setInterval(()=>{if(!running)return;const stages=[...document.querySelectorAll('.system-stage')];if(!stages.length)return;stages.forEach(s=>s.classList.remove('active'));stageIndex=(stageIndex+1)%stages.length;stages[stageIndex].classList.add('active');document.querySelector('#system-caption').textContent=stageCaptions[stageIndex];},1500);

  const spectrumCanvas=document.querySelector('#spectrum-canvas'),spectrumCtx=spectrumCanvas?.getContext('2d');
  function drawSpectrum(){
    if(!spectrumCtx)return;const w=spectrumCanvas.width,h=spectrumCanvas.height,rb=+document.querySelector('#rb-control').value,fc=+document.querySelector('#fc-control').value;
    spectrumCtx.clearRect(0,0,w,h);spectrumCtx.strokeStyle='#27485f';spectrumCtx.lineWidth=1;for(let x=60;x<w-20;x+=100){spectrumCtx.beginPath();spectrumCtx.moveTo(x,25);spectrumCtx.lineTo(x,h-55);spectrumCtx.stroke()}for(let y=40;y<h-55;y+=70){spectrumCtx.beginPath();spectrumCtx.moveTo(60,y);spectrumCtx.lineTo(w-20,y);spectrumCtx.stroke()}
    spectrumCtx.strokeStyle='#91a9ba';spectrumCtx.lineWidth=2;spectrumCtx.beginPath();spectrumCtx.moveTo(60,20);spectrumCtx.lineTo(60,h-55);spectrumCtx.lineTo(w-20,h-55);spectrumCtx.stroke();
    const span=600,center=(w+40)/2,scale=(w-100)/(span*2);spectrumCtx.fillStyle='rgba(51,214,197,.16)';spectrumCtx.fillRect(center-rb*scale,25,2*rb*scale,h-80);
    spectrumCtx.strokeStyle='#44e1d0';spectrumCtx.lineWidth=4;spectrumCtx.beginPath();for(let x=60;x<w-20;x++){const df=(x-center)/scale;const u=Math.PI*df/rb;const sinc=Math.abs(u)<1e-6?1:Math.sin(u)/u;const power=sinc*sinc;const y=h-55-power*(h-105);if(x===60)spectrumCtx.moveTo(x,y);else spectrumCtx.lineTo(x,y)}spectrumCtx.stroke();
    spectrumCtx.strokeStyle='#ffd768';spectrumCtx.setLineDash([8,7]);spectrumCtx.beginPath();spectrumCtx.moveTo(center,25);spectrumCtx.lineTo(center,h-55);spectrumCtx.stroke();spectrumCtx.setLineDash([]);spectrumCtx.fillStyle='#dce9f1';spectrumCtx.font='bold 15px system-ui';spectrumCtx.fillText('Power spectral density',70,42);spectrumCtx.fillStyle='#ffd768';spectrumCtx.fillText(`fc = ${(fc/1000).toFixed(2)} MHz`,center-70,h-22);spectrumCtx.fillStyle='#91a9ba';spectrumCtx.fillText(`${((fc-rb)/1000).toFixed(2)} MHz`,Math.max(62,center-rb*scale-35),h-22);spectrumCtx.fillText(`${((fc+rb)/1000).toFixed(2)} MHz`,Math.min(w-115,center+rb*scale-35),h-22);
    document.querySelector('#rb-out').textContent=`${rb} kbit/s`;document.querySelector('#fc-out').textContent=`${(fc/1000).toFixed(2)} MHz`;
  }
  ['#rb-control','#fc-control'].forEach(sel=>document.querySelector(sel)?.addEventListener('input',drawSpectrum));drawSpectrum();

  const decisionCanvas=document.querySelector('#decision-canvas'),decisionCtx=decisionCanvas?.getContext('2d');let decisionFrame=0;
  function drawDecision(){
    if(!decisionCtx)return;const w=decisionCanvas.width,h=decisionCanvas.height,spread=+document.querySelector('#spread-control').value/100,threshold=+document.querySelector('#threshold-control').value/100,left=75,right=w-40,axisY=h-65,map=v=>left+v*(right-left)/1.4;
    decisionCtx.clearRect(0,0,w,h);decisionCtx.strokeStyle='#29485f';decisionCtx.lineWidth=1;for(let x=left;x<=right;x+=(right-left)/7){decisionCtx.beginPath();decisionCtx.moveTo(x,25);decisionCtx.lineTo(x,axisY);decisionCtx.stroke()}decisionCtx.strokeStyle='#9ab1c1';decisionCtx.lineWidth=2;decisionCtx.beginPath();decisionCtx.moveTo(left,axisY);decisionCtx.lineTo(right,axisY);decisionCtx.stroke();
    const tx=map(threshold);decisionCtx.strokeStyle='#ffd768';decisionCtx.lineWidth=3;decisionCtx.setLineDash([10,7]);decisionCtx.beginPath();decisionCtx.moveTo(tx,30);decisionCtx.lineTo(tx,axisY);decisionCtx.stroke();decisionCtx.setLineDash([]);decisionCtx.fillStyle='#ffd768';decisionCtx.font='bold 15px system-ui';decisionCtx.fillText(`γ = ${threshold.toFixed(2)}`,tx+8,48);
    let falseOne=0,missed=0;for(let i=0;i<56;i++){const bit=i%2,noiseValue=(Math.sin(i*12.9898+decisionFrame*.12)+Math.sin(i*4.17+2.1))*spread*.22;const value=bit+noiseValue;const error=bit===0?value>threshold:value<=threshold;if(bit===0&&error)falseOne++;if(bit===1&&error)missed++;const x=map(value),y=75+(i%14)*16+(bit?12:0);decisionCtx.beginPath();decisionCtx.arc(x,y,6,0,Math.PI*2);decisionCtx.fillStyle=error?'#ff6b6b':bit?'#43e0ce':'#6d91ff';decisionCtx.fill()}
    decisionCtx.fillStyle='#8da6b8';decisionCtx.font='13px system-ui';decisionCtx.fillText('symbol 0',map(0)-25,axisY+28);decisionCtx.fillText('symbol 1',map(1)-25,axisY+28);decisionCtx.fillStyle='#dbe7ef';decisionCtx.fillText('correlator output z',w-185,axisY+28);document.querySelector('#spread-out').textContent=spread.toFixed(2);document.querySelector('#threshold-out').textContent=threshold.toFixed(2);document.querySelector('#false-one').textContent=String(falseOne);document.querySelector('#missed-one').textContent=String(missed);decisionFrame++;
  }
  ['#spread-control','#threshold-control'].forEach(sel=>document.querySelector(sel)?.addEventListener('input',drawDecision));drawDecision();setInterval(()=>{if(running)drawDecision()},650);

  let selected=null; const slots=[...document.querySelectorAll('.drop-slot')]; const bank=document.querySelector('#block-bank');
  function place(button,slot){if(slot.querySelector('button'))bank.append(slot.querySelector('button'));slot.append(button);button.classList.remove('selected');selected=null}
  document.querySelectorAll('[data-block]').forEach(button=>{button.addEventListener('click',()=>{document.querySelectorAll('[data-block]').forEach(b=>b.classList.remove('selected'));selected=button;button.classList.add('selected')});button.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',button.dataset.block))});
  slots.forEach(slot=>{slot.addEventListener('click',()=>{if(selected)place(selected,slot)});slot.addEventListener('dragover',e=>{e.preventDefault();slot.classList.add('drag-over')});slot.addEventListener('dragleave',()=>slot.classList.remove('drag-over'));slot.addEventListener('drop',e=>{e.preventDefault();slot.classList.remove('drag-over');const button=document.querySelector(`[data-block="${e.dataTransfer.getData('text/plain')}"]`);if(button)place(button,slot)})});
  document.querySelector('#check-order')?.addEventListener('click',()=>{const answer=slots.map(s=>s.querySelector('button')?.dataset.block||'').join(',');const f=document.querySelector('#order-feedback');f.textContent=answer==='received,multiplier,filter,decision'?'Correct: receive, correlate with the coherent carrier, filter, then decide.':'Review the dependency: the received signal enters the product detector before filtering and threshold decision.';});
  document.querySelector('#reset-order')?.addEventListener('click',()=>{slots.forEach(s=>{const b=s.querySelector('button');if(b)bank.append(b)});document.querySelector('#order-feedback').textContent='';});
  function calculate(){const a=+document.querySelector('#calc-a').value,t=+document.querySelector('#calc-t').value;document.querySelector('#energy-result').textContent=`${(a*a*t/2).toFixed(3)} mJ`;}
  document.querySelector('#calculate-energy')?.addEventListener('click',calculate);
  const erfc = x => {
    const z=Math.abs(x),t=1/(1+z/2);
    const value=t*Math.exp(-z*z-1.26551223+t*(1.00002368+t*(.37409196+t*(.09678418+t*(-.18628806+t*(.27886807+t*(-1.13520398+t*(1.48851587+t*(-.82215223+t*.17087277)))))))));
    return x>=0?value:2-value;
  };
  function updateBer(){
    const db=+document.querySelector('#ebn0')?.value;
    if(!Number.isFinite(db)) return;
    const linear=10**(db/10),ber=.5*erfc(Math.sqrt(linear)/Math.SQRT2);
    document.querySelector('#ebn0-out').textContent=`${db} dB`;
    document.querySelector('#ebn0-linear').textContent=linear.toFixed(3);
    const exponent=ber===0?0:Math.floor(Math.log10(ber)),mantissa=ber/(10**exponent);
    document.querySelector('#ber-output').textContent=`${mantissa.toFixed(3)} × 10^${exponent}`;
  }
  document.querySelector('#ebn0')?.addEventListener('input',updateBer); updateBer();
  const saved=JSON.parse(localStorage.getItem('ya-ask-progress')||'{}');
  document.querySelector('#quiz')?.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget);const correct=[data.get('q1')==='b',data.get('q2')==='b',data.get('q3')==='a',data.get('q4')==='c',data.get('q5')==='a'];const score=correct.filter(Boolean).length;document.querySelector('#quiz-result').innerHTML=`<strong>${score}/5 correct</strong><p>${score===5?'Excellent. You can explain the ASK model, energy, bandwidth, receiver and noise sensitivity.':'Review: OOK suppresses the carrier for 0; energy scales with A²; rectangular OOK uses about 2Rb null-to-null bandwidth; the receiver ends with a threshold decision.'}</p>`;saved.quiz=score;localStorage.setItem('ya-ask-progress',JSON.stringify(saved));updateProgress();});
  function updateProgress(){const total=document.documentElement.scrollHeight-innerHeight;const viewed=total?scrollY/total:0;const score=saved.quiz||0;const percent=Math.min(100,Math.round(viewed*70+(score/5)*30));document.querySelector('#lesson-progress').style.width=`${percent}%`;document.querySelector('#progress-label').textContent=`${percent}%`;localStorage.setItem('ya-ask-view',String(Math.max(+(localStorage.getItem('ya-ask-view')||0),percent)));}
  addEventListener('scroll',updateProgress,{passive:true}); updateProgress();
})();
