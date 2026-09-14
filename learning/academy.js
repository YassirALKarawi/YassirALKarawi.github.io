(() => {
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  function renderMath(){
    if (!window.katex) return setTimeout(renderMath, 120);
    $$('.math').forEach(el => { try { katex.render(el.dataset.math, el, {throwOnError:false, displayMode:true}); } catch {} });
  }
  if ($('.math')) renderMath();

  const observed = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting)e.target.classList.add('visible'); }), {threshold:.08});
  $$('.reveal-on-scroll').forEach(el => observed.observe(el));

  const progress = $('#reading-progress');
  function updateProgress(){ if(!progress)return; const max=document.documentElement.scrollHeight-innerHeight; progress.style.width=`${max?Math.min(100,scrollY/max*100):0}%`; }
  addEventListener('scroll',updateProgress,{passive:true}); updateProgress();

  const pop=$('#term-popover');
  const glossary={
    'signal':'إشارة','signals':'إشارات','digital signal':'إشارة رقمية','analogue signal':'إشارة تماثلية','information':'معلومات','source':'مصدر','destination':'وجهة','transmitter':'مرسِل','receiver':'مستقبِل','channel':'قناة اتصال','communication channel':'قناة اتصال','noise':'ضوضاء','thermal noise':'ضوضاء حرارية','interference':'تداخل','distortion':'تشوّه','attenuation':'توهين','gain':'كسب','loss':'فقد','fading':'تلاشي','bandwidth':'عرض النطاق','spectrum':'الطيف الترددي','frequency':'تردد','carrier frequency':'تردد الحامل','carrier':'موجة حاملة','amplitude':'سعة','phase':'طور','period':'دورة','time':'زمن','energy':'طاقة','power':'قدرة','average power':'القدرة المتوسطة','bit':'بت','bits':'بتات','bit rate':'معدل البتات','symbol':'رمز','symbols':'رموز','symbol rate':'معدل الرموز','baud rate':'معدل البود','waveform':'شكل موجي','pulse':'نبضة','sampling':'أخذ العينات','sampling rate':'معدل أخذ العينات','sampling theorem':'مبرهنة أخذ العينات','reconstruction':'إعادة البناء','aliasing':'تراكب طيفي زائف','quantization':'تكميم','quantization error':'خطأ التكميم','companding':'ضغط وتمديد','encoding':'ترميز','decoding':'فك الترميز','line coding':'ترميز الخط','modulation':'تضمين','demodulation':'فك التضمين','detection':'كشف','coherent detection':'كشف متزامن','decision':'قرار','decision boundary':'حد القرار','decision threshold':'عتبة القرار','filter':'مرشح','matched filter':'المرشح المطابق','correlator':'مُرابِط','sample':'عينة','samples':'عينات','sampling instant':'لحظة أخذ العينة','constellation':'مخطط الكوكبة','constellation point':'نقطة الكوكبة','euclidean distance':'المسافة الإقليدية','orthogonal':'متعامد','orthogonality':'تعامد','probability':'احتمال','error probability':'احتمال الخطأ','bit error rate':'معدل خطأ البتات','signal-to-noise ratio':'نسبة الإشارة إلى الضوضاء','channel coding':'ترميز القناة','encoder':'مرمّز','decoder':'مفكك ترميز','redundancy':'زيادة مقصودة','code rate':'معدل الترميز','error correction':'تصحيح الأخطاء','equalizer':'معادل القناة','equalization':'معادلة القناة','synchronization':'تزامن','timing':'توقيت','timing recovery':'استعادة التوقيت','frequency offset':'انحراف التردد','phase offset':'انحراف الطور','multipath':'تعدد المسارات','intersymbol interference':'تداخل الرموز','cyclic prefix':'بادئة دورية','subcarrier':'حامل فرعي','orthogonal frequency division multiplexing':'التضمين بتقسيم الترددات المتعامدة','fast fourier transform':'تحويل فورييه السريع','input':'دخل','output':'خرج','equation':'معادلة','derivation':'اشتقاق','assumption':'افتراض','example':'مثال','exercise':'تمرين','solution':'حل','reliable':'موثوق','reliability':'موثوقية','efficiency':'كفاءة','spectral efficiency':'كفاءة طيفية','minimum':'أدنى','maximum':'أقصى','linear':'خطي','nonlinear':'لاخطي','continuous':'مستمر','discrete':'متقطع','binary':'ثنائي','random variable':'متغير عشوائي','mean':'متوسط','variance':'تباين','threshold':'عتبة','duration':'مدة','interval':'فاصل زمني','data rate':'معدل البيانات','pulse shaping':'تشكيل النبضة','eye diagram':'مخطط العين','nyquist criterion':'معيار نايكويست','additive white gaussian noise':'ضوضاء غاوسية بيضاء مضافة'
  };
  function normalizeTerm(value){return value.toLowerCase().replace(/[“”‘’.,;:!?()[\]{}]/g,' ').replace(/\s+/g,' ').trim()}
  function lookupArabic(value){const key=normalizeTerm(value);if(glossary[key])return glossary[key];if(key.endsWith('s')&&glossary[key.slice(0,-1)])return glossary[key.slice(0,-1)];return ''}
  function showTranslation(english,arabic,description,rect){if(!pop)return;$('strong',pop).textContent=arabic||'ترجمة موسّعة متاحة';$('small',pop).textContent=english;$('p',pop).textContent=description||'مصطلح من سياق هندسة الاتصالات. استخدم الرابط أدناه للترجمة العامة.';const more=$('#translate-more',pop);if(more)more.href=`https://translate.google.com/?sl=en&tl=ar&text=${encodeURIComponent(english)}&op=translate`;pop.hidden=false;pop.style.left=`${Math.max(12,Math.min(innerWidth-pop.offsetWidth-12,rect.left))}px`;pop.style.top=`${Math.max(12,Math.min(innerHeight-pop.offsetHeight-12,rect.bottom+8))}px`}
  $$('.term').forEach(term=>term.addEventListener('click',()=>showTranslation(term.dataset.en,term.dataset.ar,term.dataset.desc,term.getBoundingClientRect())));
  function translateSelection(){const selection=getSelection();if(!selection||selection.isCollapsed||!pop)return;const english=selection.toString().trim().replace(/\s+/g,' ');if(!english||english.length>70||english.split(' ').length>6)return;const range=selection.rangeCount?selection.getRangeAt(0):null;if(!range)return;const parent=range.commonAncestorContainer.parentElement||range.commonAncestorContainer;if(parent?.closest?.('input,textarea,button,.term-popover,.katex'))return;const arabic=lookupArabic(english);showTranslation(english,arabic,arabic?'ترجمة أكاديمية ضمن سياق الاتصالات الرقمية.':'لم يُضف هذا التعبير إلى القاموس الأكاديمي بعد؛ افتح الترجمة الموسّعة.',range.getBoundingClientRect())}
  document.addEventListener('pointerup',()=>setTimeout(translateSelection,20));
  document.addEventListener('keyup',e=>{if(e.key==='Shift'||e.key.startsWith('Arrow'))setTimeout(translateSelection,20)});
  pop?.querySelector('button')?.addEventListener('click',()=>pop.hidden=true);
  addEventListener('keydown',e=>{if(e.key==='Escape'&&pop)pop.hidden=true});

  function grade(form){
    const fields=$$('fieldset[data-answer]',form); let score=0,answered=0;
    fields.forEach(f=>{const chosen=$('input:checked',f); f.classList.remove('is-correct','is-wrong'); if(!chosen)return; answered++; const ok=+chosen.value===+f.dataset.answer; if(ok)score++; f.classList.add(ok?'is-correct':'is-wrong'); const fb=$('.question-feedback',f); fb.textContent=`${ok?'Correct.':'Not yet.'} ${f.dataset.explain}`;});
    const card=$('#score-card',form)||$('#score-card'); if(card){$('strong',card).textContent=`${score} / ${fields.length}`;$('p',card).textContent=answered<fields.length?`${answered} of ${fields.length} answered. Complete the unanswered questions, then grade again.`:score===fields.length?'Excellent: every concept is secure. Explain two answers aloud to confirm mastery.':score>=Math.ceil(fields.length*.8)?'Strong result. Review the explanations for missed questions.':'Return to the equations and worked examples, then try again.';}
    if(form.id==='mastery-quiz'){localStorage.setItem(`ya-score-${document.body.dataset.lesson}`,String(score));document.querySelector(`[data-lesson-card="${document.body.dataset.lesson}"]`);}
  }
  $('#mastery-quiz')?.addEventListener('submit',e=>{e.preventDefault();grade(e.currentTarget)});
  $('#bank-form')?.addEventListener('submit',e=>{e.preventDefault();grade(e.currentTarget)});

  $$('[data-lesson-card]').forEach(card=>{const score=localStorage.getItem(`ya-score-${card.dataset.lessonCard}`);if(score!==null){const out=$('[data-card-progress]',card);out.textContent=`Quiz ${score}/5`;out.style.color=+score>=4?'#08796e':'#a66b00';}});

})();
