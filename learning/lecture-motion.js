/* Deterministic, time-based teaching scenes. Off-screen scenes do not animate. */
(() => {
 'use strict';
 const scenes=[
 ['what-is-digital-communication','chain','Follow the message','A moving marker follows the information through the transmitter, channel and receiver. This is a conceptual flow, not propagation to scale.'],
 ['sampling-choosing-the-time-instants','sample','Choose the sampling rate','Blue: 2 Hz continuous signal. Teal stems: its exact samples over one second. Increase the sampling rate to obtain more time observations.'],
 ['quantization-and-encoding','quant','Round each sample','Blue: normalized input. Teal: the nearest mid-rise quantizer output. More bits give smaller steps. The error stays within half a step for this in-range input.'],
 ['wireless-channels-and-signal-damage','channel','See channel impairment','Blue: transmitted signal. Orange: attenuated signal plus a deterministic illustrative disturbance, not a stochastic noise simulation.'],
 ['a-sum-of-sinusoids','sum','Build a composite signal','The blue 2 Hz and orange 5 Hz components add point by point to give the teal waveform. Frequency, not amplitude, determines the sampling requirement.'],
 ['a-product-of-sinusoids','product','Multiplication creates new frequencies','cos(2π·5t) × cos(2π·2t) = ½cos(2π·3t) + ½cos(2π·7t). The teal product equals the sum of the two components.'],
 ['aliasing-a-false-frequency','alias','Reveal an alias','Blue: 7 Hz cosine. Orange: its baseband alias. Teal dots are samples shared by both curves. Change the sampling rate and watch the alias frequency.'],
 ['why-does-the-spectrum-repeat','spectrum','Separate the spectral copies','A schematic triangular spectrum has support from −2 to +2 Hz. Sampling repeats it at integer multiples of fs. Overlap occurs when fs < 4 Hz. Heights are normalized.'],
 ['the-reconstruction-formula','sinc','Add interpolation kernels','Teal: a finite sinc-interpolation sum for a 2 Hz signal sampled at 8 Hz. Orange: the kernel being added. Blue: the original. Finite truncation causes edge error; the ideal formula uses all samples.']
 ];
 const tau=2*Math.PI, sinc=x=>Math.abs(x)<1e-10?1:Math.sin(Math.PI*x)/(Math.PI*x);
 scenes.forEach(([id,kind,title,description],index)=>{
 const heading=document.getElementById(id);if(!heading)return;
 const box=document.createElement('section');box.className='teaching-motion';
 box.innerHTML=`<div class="motion-kicker">VISUAL EXPLORER ${String(index+1).padStart(2,'0')}</div><h3>${title}</h3><p>${description}</p><canvas width="900" height="350" role="img" aria-label="${description}"></canvas><div class="teaching-controls"><button type="button" data-action="play">Pause</button><button type="button" data-action="reset">Restart</button><label>Speed <select aria-label="Animation speed"><option value="0.5">0.5×</option><option selected value="1">1×</option><option value="2">2×</option></select></label></div><output aria-live="off"></output>`;
 heading.insertAdjacentElement('afterend',box);
 const c=box.querySelector('canvas'),g=c.getContext('2d'),out=box.querySelector('output');
 let t=0,last=0,visible=false,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,value=kind==='quant'?3:kind==='alias'?10:8;
 const adjustable=['sample','alias','quant','spectrum'].includes(kind);
 if(adjustable){const label=document.createElement('label');label.textContent=kind==='quant'?'Resolution (bits) ':'Sampling rate (Hz) ';const input=document.createElement('input');input.type='range';input.min=kind==='quant'?1:2;input.max=kind==='quant'?6:20;input.step='1';input.value=value;input.setAttribute('aria-label',label.textContent);label.append(input);box.querySelector('.teaching-controls').append(label);input.oninput=()=>{value=+input.value;draw();};}
 const play=box.querySelector('[data-action="play"]');play.textContent=playing?'Pause':'Play';play.onclick=()=>{playing=!playing;play.textContent=playing?'Pause':'Play';};box.querySelector('[data-action="reset"]').onclick=()=>{t=0;draw();};
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{rootMargin:'100px'}).observe(box);
 const colors=['#2469ac','#e47a30','#008b83'];
 function line(fn,color,scale=95){g.strokeStyle=color;g.lineWidth=3;g.beginPath();for(let i=0;i<=800;i++){const x=i/800,y=175-scale*fn(x);i?g.lineTo(55+i,y):g.moveTo(55+i,y);}g.stroke();}
 function label(s,x,y,color='#183348'){g.fillStyle=color;g.font='18px system-ui';g.fillText(s,x,y);}
 function draw(){g.clearRect(0,0,900,350);g.fillStyle='#f7fbfd';g.fillRect(0,0,900,350);g.strokeStyle='#d1dfe8';g.lineWidth=1;for(let x=55;x<=855;x+=80){g.beginPath();g.moveTo(x,50);g.lineTo(x,285);g.stroke();}g.beginPath();g.moveTo(55,175);g.lineTo(855,175);g.stroke();label('0',48,310);label(kind==='spectrum'?'Frequency (Hz)':'Time (s)',680,337);label(kind==='spectrum'?'−12': '0',55,337);label(kind==='spectrum'?'+12':'1',840,337);
 if(kind==='chain'){g.clearRect(0,0,900,350);const names=['Source','Transmitter','Channel','Receiver','Destination'];names.forEach((n,i)=>{const x=10+i*180;g.fillStyle='#eef6fa';g.fillRect(x,125,155,85);label(n,x+8,175);if(i<4){g.strokeStyle='#008b83';g.beginPath();g.moveTo(x+155,167);g.lineTo(x+177,167);g.stroke();}});g.fillStyle='#e47a30';g.beginPath();g.arc(20+(t*95)%855,230,9,0,tau);g.fill();out.textContent='Source → transmitter → physical channel → receiver → destination';return;}
 if(kind==='spectrum'){for(let k=-4;k<=4;k++){line(x=>Math.max(0,1-Math.abs((24*x-12-k*value)/2)),k===0?colors[0]:colors[2]);}out.textContent=`fs = ${value} Hz · ${value<4?'Spectral overlap: aliasing':value===4?'Copies just touch at the ideal boundary':'Separated spectral copies'}`;}
 else if(kind==='quant'){const L=2**value,d=2/L;line(x=>.88*Math.sin(tau*2*x),colors[0]);line(x=>-1+d*(Math.floor((.88*Math.sin(tau*2*x)+1)/d)+.5),colors[2]);out.textContent=`${value} bits · ${L} levels · Δ = ${d.toFixed(5)} · maximum |error| = ${(d/2).toFixed(5)}`;}
 else if(kind==='channel'){line(x=>Math.sin(tau*3*x),colors[0]);line(x=>.55*Math.sin(tau*3*x)+.14*Math.sin(tau*31*x+t)+.08*Math.cos(tau*19*x-t),colors[1]);out.textContent='Received waveform = 0.55 × transmitted waveform + illustrative disturbance';}
 else if(kind==='sum'||kind==='product'){const a=kind==='sum'?x=>.5*Math.sin(tau*2*x):x=>.5*Math.cos(tau*3*x),b=kind==='sum'?x=>.3*Math.sin(tau*5*x):x=>.5*Math.cos(tau*7*x);line(a,colors[0]);line(b,colors[1]);line(x=>a(x)+b(x),colors[2]);out.textContent=kind==='sum'?'Highest component: 5 Hz. Nyquist rate: 10 samples/s.':'Highest component: 7 Hz. Nyquist rate: 14 samples/s.';}
 else if(kind==='sinc'){const count=Math.floor(t*2)%17;line(x=>Math.sin(tau*2*x),colors[0]);line(x=>Math.sin(tau*2*(count-4)/8)*sinc(8*x-(count-4)),colors[1]);line(x=>{let y=0;for(let n=-4;n<=count-4;n++)y+=Math.sin(tau*2*n/8)*sinc(8*x-n);return y;},colors[2]);out.textContent=`Adding kernel ${count+1} of 17 in this finite demonstration`;}
 else {const f=kind==='alias'?7:2,alias=Math.abs(f-Math.round(f/value)*value);line(x=>Math.cos(tau*f*x),colors[0]);if(kind==='alias')line(x=>Math.cos(tau*alias*x),colors[1]);for(let n=0;n<=value;n++){const x=55+800*n/value,y=175-95*Math.cos(tau*f*n/value);g.strokeStyle=colors[2];g.beginPath();g.moveTo(x,175);g.lineTo(x,y);g.stroke();g.fillStyle=colors[2];g.beginPath();g.arc(x,y,4.5,0,tau);g.fill();}out.textContent=`fs = ${value} Hz · Ts = ${(1/value).toFixed(4)} s${kind==='alias'?` · alias = ${alias} Hz`:''}`;}
 if(kind!=='sinc'){const x=55+(t*.14%1)*800;g.strokeStyle='#8395a5';g.setLineDash([5,5]);g.beginPath();g.moveTo(x,45);g.lineTo(x,285);g.stroke();g.setLineDash([]);}
 }
 function frame(now){const dt=Math.min((now-last)/1000,.05);last=now;if(playing&&visible&&!document.hidden){t+=dt*+box.querySelector('select').value;draw();}requestAnimationFrame(frame);}draw();requestAnimationFrame(frame);
 });
})();
