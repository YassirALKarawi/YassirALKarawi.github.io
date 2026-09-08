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
