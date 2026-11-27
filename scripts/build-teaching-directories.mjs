import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { courseDepartment, courseLabs } from '../learning/engineering/communications.mjs';
import { subjects, stages } from '../learning/engineering/curriculum.mjs';
import { stageLabel } from '../learning/engineering/study-views.mjs';
import { academy, appURL, directoryURL, instrumentBench } from '../learning/engineering/directory.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const site = 'https://yassiralkarawi.github.io';
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const anchor = (url, label) => `<a href="${esc(url)}">${esc(label)}</a>`;
const groups = [
  ['workbench', 'منضدة الإلكترونيات وراسم الإشارة|Electronics and oscilloscope bench', []],
  ['wireless', 'الاتصالات اللاسلكية والجيل الخامس|Wireless and 5G', []],
  ['digital', 'الاتصالات الرقمية ومعالجة الإشارات|Digital communications and signals', ['pcm','symbol','shannon','adc','rc']],
  ['circuits', 'الدوائر والإلكترونيات والقياسات|Circuits, electronics and measurements', ['ohm','divider','gain','bridge','sensor']],
  ['control', 'السيطرة واستجابة الأنظمة|Control and system response', ['step','encoder','charging']],
  ['networks', 'الشبكات وخطوط النقل|Networks and transmission lines', ['transfer','propagation','waveguide']],
  ['shared', 'مختبرات مشتركة|Shared laboratories', []]
];
const subjectGroup = {dc:'circuits',measurements:'circuits',analog:'circuits',signals:'digital',digital:'digital',feedback:'control',lines:'networks',network:'networks'};
const programme = stages(courseDepartment.id);
const modelById = new Map(courseLabs.map(lab => [lab.id,lab]));
const listed = groups.flatMap(group => group[2]);
if (new Set(listed).size !== listed.length || listed.length !== courseLabs.length || listed.some(id => !modelById.has(id))) throw Error('Check the communications laboratory classifications.');

async function build(language) {
  const ar = language === 'ar';
  const t = bilingual => bilingual.split('|')[ar ? 0 : 1];
  const l = (a,b) => ar ? a : b;
  const portal = '/learning/?lang=' + language;
  const lectures = directoryURL('lectures',language), labs = directoryURL('labs',language);
  const course = view => academy + '?lang=' + language + '&view=' + view;
  const units = JSON.parse(await readFile(resolve(root,'learning/digital-communications/academy', ar ? 'i18n/curriculum.ar.json' : 'curriculum.json'),'utf8'));
  const number = n => new Intl.NumberFormat(ar ? 'ar-IQ' : 'en').format(n);
  const department = l('قسم هندسة الاتصالات','Communications Engineering');
  const titles = {lectures:l('المحاضرات','Lectures'),labs:l('المختبرات','Laboratories')};
  const restricted = l('يتطلب حسابا مصرحا له','Authorised account required');
  const telecom = page => appURL('telecom-labs-yassir') + '/' + page + '?lang=' + language;
  const subjectURL = id => portal + '#subject/communications/' + id;
  const section = (id,title,items) => ({id,title,items});
  const row = (name,url,description='',related=[],details='', keywords='') => `<li class="directory-row"${keywords?' data-keywords="'+esc(keywords)+'"':''}>
    <div class="row-top">${anchor(url,name)}</div>${description ? `<p>${esc(description)}</p>` : ''}
    ${related.length ? `<div class="related-links">${related.join('')}</div>` : ''}${details}</li>`;
  const restrictedLink = (url,name) => `<span class="restricted-link">${anchor(url,name)} <small>${restricted}</small></span>`;
  function unitContents(kind) {
    const lecture = kind === 'lectures';
    return `<details class="resource-contents"><summary>${lecture ? l('قائمة المحاضرات','Lecture list') : l('تجارب كل محاضرة','Experiments by lecture')} (${number(lecture ? units.length : units.flatMap(u=>u.topics).length)})</summary>
      <ol>${units.map(unit => `<li>${lecture ? anchor(course('lecture')+'&lecture='+unit.n,unit.title) :
        `<strong>${esc(unit.title)}</strong><div class="topic-links">${unit.topics.map(topic => anchor(course('lab')+'&lecture='+unit.n+'&topic='+topic.id,topic.title)).join('')}</div>`}</li>`).join('')}</ol></details>`;
  }
  function subjectRow(id) {
    const s=subjects[id], related=[];
    if (id==='digital') return row(t(s.title),course('course')+'#lecture-roadmap',l('محاضرات المقرر، من أخذ العينات إلى المستقبلات الرقمية.','The course sequence from sampling to digital receivers.'),[
      anchor(labs+'#digital',l('مختبرات المادة','Course labs')),
      anchor(course('bank'),l('بنك المسائل المحلولة','Solved problems')),
      restrictedLink(appURL('digital-communication-yassir'),l('النسخة الصوتية','Narrated edition'))
    ],unitContents('lectures'));
    if (id==='dc') related.push(restrictedLink(appURL('electrical-fundamentals-yassir'),l('محاضرات الأسس الكهربائية','Electrical Fundamentals lectures')));
    if (id==='network') related.push(restrictedLink(appURL('computer-networks-yassir'),l('محاضرات شبكات الحاسوب','Computer Networks lectures')));
    related.push(anchor(labs+'#'+subjectGroup[id],l('مختبرات مرتبطة','Related labs')));
    return row(t(s.title),subjectURL(id),s.models.map(id=>t(modelById.get(id).concept)).join(l('، ',' · ')),related);
  }
  const lectureSections = programme.map((ids,i) => {
    const items=ids.map(subjectRow);
    if(i===0) items.push(row(l('اللغة الإنكليزية لهندسة الاتصالات','English for Communications Engineering'),appURL('engineering-english-yassir'),restricted));
    return section('stage-'+(i+1),stageLabel(i,t),items);
  });
  lectureSections.push(section('archive',l('أرشيف المحاضرات','Lecture archive'),[
    row(l('فهرس الاتصالات الرقمية الأولى والثانية','Digital Communications I and II'),'/learning/communications-studio.html',
      l('الفهرس السابق للمحاضرات والمحاكاة، باللغة الإنكليزية.','Earlier lecture and simulation index, in English.'))
  ]));
  const coreLabs = {
    workbench:[
      row(l('مرشح RC على راسم الإشارة','RC filter on the oscilloscope'),instrumentBench(language)+'&kit=rc',
        l('غيّر تردد مولد الإشارات وقارن موجتي الدخل والخرج على قناتي راسم الإشارة.','Adjust the function generator and compare the input and output waveforms on the two scope channels.')),
      row(l('دائرة أخذ العينات والاحتفاظ بها','Sample-and-hold circuit'),instrumentBench(language)+'&kit=sample',
        l('اضبط تردد ساعة أخذ العينات وراقب جهد المكثف بين نبضتين.','Change the sampling clock and watch the capacitor hold its voltage between pulses.')),
      row(l('مجهز القدرة في نمطي الجهد الثابت والتيار الثابت','DC power supply in CV and CC modes'),instrumentBench(language)+'&kit=power',
        l('غيّر مقاومة الحمل أو حد التيار، واقرأ جهد الخرج والتيار عند الانتقال بين النمطين.','Change the load resistance or current limit and read the voltage and current as the supply changes mode.'))
    ],
    wireless:[
      row(l('محطة الهوائيات وخطوط النقل','Antenna and transmission-line trainer'),telecom('antenna-trainer.html'),
        l('صل أجهزة القياس وجرّب الاستقطاب والنمط الإشعاعي ونسبة الموجة الواقفة.','Connect the test equipment to measure polarisation, radiation patterns and standing-wave ratio.')+' '+restricted),
      row(l('تخطيط شبكات الجيل الخامس','5G radio planning lab'),'/5g-lab/?lang='+language,l('ضع الأبراج وارسم مسار الهاتف وقارن نقاط تسليم الاتصال.','Place base stations, draw a route and compare handover locations.')),
      row(l('منضدة الجيل الخامس ومحلل الإشارة','5G workbench and signal analyser'),appURL('diyala-nr-teaching-lab'),l('قياس الإشارة وفحص الاتصال وتجارب توجيه الحزمة.','Inspect signal measurements, mobile connectivity and beam steering.'))
    ],
    digital:[
      row(l('مختبرات محاضرات الاتصالات الرقمية الأولى','Digital Communication I topic labs'),course('lab')+'&topic=sampling',l('افتح التجربة من موضوعها في المحاضرة.','Open a signal experiment directly from its lecture topic.'),[anchor(lectures+'#stage-3',l('محاضرات المرحلة الثالثة','Stage three lectures'))],unitContents('labs')),
      row(l('مختبر الصوت والتضمين النبضي المشفر','Audio and pulse-code modulation'),academy+'sound-lab/?lang='+language,l('استمع إلى الإشارة وقس أثر التكميم والتشويه.','Listen to the signal and measure quantisation and distortion.')),
      row(l('تعدد الإرسال والترميز الخطي','Multiplexing and line coding'),appURL('yassir-multiplexing-line-coding-lab'),restricted)
    ],
    circuits:[
      row(l('منضدة توصيل الدوائر وأجهزة القياس','Circuit wiring and instruments'),instrumentBench(language),l('صل المكونات وافحص الإشارات بالمجسات.','Wire components and inspect signals with instrument probes.')),
      row(l('لوحة التجارب الحرة والملتيميتر','Breadboard and multimeter'),telecom('index.html'),
        l('ضع العناصر في ثقوب اللوحة، أوصل الأسلاك وقس جهد العقد وتيار الفروع.','Place components in the breadboard, connect jumper wires and measure node voltage and branch current.')+' '+restricted)
    ],
    networks:[
      row(l('منضدة الألياف الضوئية ومقياس القدرة','Optical fibre and power-meter bench'),telecom('applied.html')+'&station=optical',
        l('صل الليزر بالليف ومقياس القدرة، ثم قارن القراءة المرجعية بالقدرة المستلمة.','Connect the laser, fibre and optical power meter, then compare the reference and received power.')+' '+restricted),
      row(l('مختبر توصيل الشبكات واختبار الاتصال','Network cabling and connectivity lab'),telecom('networks.html'),
        l('صل المنافذ واضبط العناوين واختبر انتقال الحزم بين الأجهزة.','Cable the ports, configure addresses and test packet delivery between devices.')+' '+restricted)
    ],
    shared:[row(l('منصة مختبرات هندسة الاتصالات','Telecommunications engineering lab platform'),telecom('catalogue.html'),restricted)]
  };
  const labSections=groups.map(([group,name,ids])=>{
    const items=[...(coreLabs[group]||[])];
    for(const id of ids){
      const m=modelById.get(id);
      const related=programme.flat().filter(s=>subjects[s].models.includes(id));
      const context=related.find(s=>subjectGroup[s]===group)||related[0];
      items.push(row(t(m.title),portal+'#lab/'+id+'/communications/'+context,t(m.concept),related.map(s=>anchor(subjectURL(s),t(subjects[s].title))),'',m.title+' '+m.concept+' '+m.equation));
    }
    return section(group,t(name),items);
  });
  for (const kind of ['lectures','labs']) {
    const isLecture=kind==='lectures',sections=isLecture?lectureSections:labSections;
    const alternate=directoryURL(kind,ar?'en':'ar'),path=directoryURL(kind,language);
    const description=isLecture?l('اختر المرحلة، ثم افتح المادة ومحاضراتها أو انتقل إلى مختبراتها.','Choose a stage, then open a subject, its lectures or its related laboratories.'):l('اختر مجال التجربة أو ابحث عن مختبر بالاسم أو الموضوع.','Browse by field or find an experiment by name or topic.');
    const navLinks=(pairs)=>pairs.map(([href,name])=>`<a href="${esc(href)}"${href===path?' aria-current="page"':''}>${esc(name)}</a>`).join('');
    const asideTitle=isLecture?l('المراحل الدراسية','Study stages'):l('مجالات المختبر','Lab fields');
    const count=sections.reduce((n,s)=>n+s.items.length,0);
    const html=`<!doctype html>
<html lang="${language}" dir="${ar?'rtl':'ltr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#0c303b">
<title>${titles[kind]} · ${department} | ${l('د. ياسر الأمين','Dr Yassir Al-Ameen')}</title><meta name="description" content="${esc(description)}">
<link rel="canonical" href="${site+path}"><link rel="alternate" hreflang="ar" href="${site+directoryURL(kind,'ar')}"><link rel="alternate" hreflang="en" href="${site+directoryURL(kind,'en')}"><link rel="icon" href="/assets/favicon.svg"><link rel="stylesheet" href="/assets/teaching-directory.css?v=directory2">
<script type="module" src="/learning/engineering/directory-search.mjs"></script><script type="module" src="/assets/site-navigation.mjs"></script></head>
<body class="directory-page directory-${kind}"><a class="directory-skip" href="#content">${l('انتقل إلى المحتوى','Skip to content')}</a>
<header class="directory-mast"><div class="directory-wrap"><a class="directory-brand" href="${portal}#home"><img src="/assets/yassir-personal.jpg" width="42" height="42" alt=""><span>${l('د. ياسر الأمين','Dr Yassir Al-Ameen')}<small>${department}</small></span></a>
<nav aria-label="${l('التنقل الرئيسي','Main navigation')}">${navLinks([[portal+'#home',l('بوابة التعليم','Teaching home')],[lectures,titles.lectures],[labs,titles.labs]])}</nav><a class="directory-lang" href="${alternate}" hreflang="${ar?'en':'ar'}" lang="en">${ar?'English':'Arabic'}</a></div></header>
<main id="content"><div class="directory-intro"><div class="directory-wrap">
<nav class="directory-crumbs" aria-label="${l('مسار الصفحة','Breadcrumb')}">${anchor('/',l('الصفحة الشخصية','Academic home'))}<span>/</span>${anchor(portal+'#home',department)}</nav>
<h1>${titles[kind]}</h1><p>${description}</p></div></div>
<div class="directory-wrap directory-layout"><aside class="directory-aside"><nav aria-label="${asideTitle}"><h2>${asideTitle}</h2><div class="directory-jumps">${sections.map(s=>anchor('#'+s.id,s.title)).join('')}</div>
<select class="directory-picker" aria-label="${asideTitle}" hidden><option value="">${isLecture?l('اختر المرحلة','Choose a stage'):l('اختر المجال','Choose a field')}</option>${sections.map(s=>`<option value="${s.id}">${esc(s.title)}</option>`).join('')}</select></nav></aside>
<div class="directory-list"><div class="directory-search" hidden><label for="find">${l('بحث في','Search')} ${ar?titles[kind]:titles[kind].toLowerCase()}</label><input id="find" type="search" placeholder="${isLecture?l('اسم المادة أو المحاضرة','Subject or lecture title'):l('اسم المختبر أو التجربة','Lab or experiment name')}" autocomplete="off"><p id="search-count" role="status" aria-live="polite"></p></div>
${sections.map(s=>`<section class="directory-group" id="${s.id}" aria-labelledby="title-${s.id}"><h2 id="title-${s.id}">${s.title}</h2><ul>${s.items.join('')}</ul></section>`).join('\n')}
<div class="directory-empty" hidden><p>${l('لم نعثر على نتيجة مطابقة.','No matching resources.')}</p><button type="button">${l('مسح البحث','Clear search')}</button></div></div></div></main>
<footer class="directory-footer"><div class="directory-wrap">${anchor('/',l('الصفحة الشخصية للدكتور ياسر الأمين','Dr Yassir Al-Ameen · Academic home'))}${anchor(portal+'#career',l('الاختبارات والمقابلات','Tests and interviews'))}</div></footer></body></html>\n`;
    const folder=resolve(root,'learning',kind);
    await mkdir(folder,{recursive:true});
    await writeFile(resolve(folder,ar?'index.html':'en.html'),html);
    console.log(`${kind} (${language}) · ${count} entries`);
  }
}
await build('ar');
await build('en');
