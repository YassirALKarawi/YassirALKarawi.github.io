const academy='/learning/digital-communications/academy/';
const courseApp=slug=>'https://'+slug+'.yassirameen22.chatgpt.site';
const courses=[
 ['اللغة الإنكليزية لهندسة الاتصالات','English for Communications Engineering',courseApp('engineering-english-yassir'),true],
 ['الأسس الكهربائية','Electrical Fundamentals',courseApp('electrical-fundamentals-yassir'),true],
 ['شبكات الحاسوب','Computer Networks',courseApp('computer-networks-yassir'),true],
 ['الاتصالات الرقمية الأولى','Digital Communication I',academy+'?view=course']
];
const labs=[
 ['مختبر تخطيط شبكة الجيل الخامس','5G radio planning lab','/5g-lab/'],
 ['منضدة تجارب الجيل الخامس ومحلّل الإشارة','5G experiments and signal analyser',courseApp('diyala-nr-teaching-lab')],
 ['مختبرات الاتصالات الرقمية','Digital communication laboratories',academy+'?view=lab&amp;topic=sampling'],
 ['مختبر تعدد الإرسال والترميز الخطي','Multiplexing and line coding lab',courseApp('yassir-multiplexing-line-coding-lab'),true],
 ['مختبرات هندسة الاتصالات','Telecommunications engineering labs',courseApp('telecom-labs-yassir'),true],
 ['دليل مختبرات منهج الاتصالات','Communications teaching laboratories','/learning/#labs']
];
export function teachingDirectory(language){
 const ar=language==='ar', label=(a,b)=>ar?a:b;
 function row([a,b,url,restricted],extra=''){
   let href = url;
   if (url.startsWith(academy)) href = url + '&amp;lang=' + language;
   if (url === '/5g-lab/') href = url + '?lang=' + language;
   if (url === '/learning/#labs') href = '/learning/?lang=' + language + '#labs';
   return '<li><a class="faculty-entry" href="'+href+'">'+label(a,b)+'</a>'+ (restricted?'<small>'+label('يتطلب حسابا مصرحا له','Authorised account required')+'</small>':'')+extra+'</li>';
 }
 const voice='<a class="faculty-alt" href="'+courseApp('digital-communication-yassir')+'">'+label('المحاضرات الصوتية · تتطلب حسابا مصرحا له','Narrated edition · authorised account required')+'</a>';
 function group(name,items){return '<section><h3>'+name+'</h3><ul>'+items.join('')+'</ul></section>'}
 return '<div class="faculty-directory">'+group(label('المقررات','Courses'),courses.map((x,i)=>row(x,i===3?voice:'')))+group(label('المختبرات','Laboratories'),labs.map(x=>row(x)))+'</div>';
}
