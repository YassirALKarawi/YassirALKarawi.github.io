export const academy = '/learning/digital-communications/academy/';
export const appURL = slug => 'https://' + slug + '.yassirameen22.chatgpt.site';

export function directoryURL(section, language) {
  return '/learning/' + section + '/' + (language === 'en' ? 'en.html' : '');
}

export function teachingDirectory(language) {
  const ar = language === 'ar';
  const gateways = [
    ['lectures', ar ? 'المحاضرات' : 'Lectures',
      ar ? 'المقررات والمحاضرات حسب المرحلة الدراسية والمادة.' : 'Courses and lecture sequences, organised by stage and subject.'],
    ['labs', ar ? 'المختبرات' : 'Laboratories',
      ar ? 'التجارب العملية من الدوائر الكهربائية إلى شبكات الجيل الخامس.' : 'Interactive experiments, from electrical circuits to 5G networks.']
  ];
  const panels = gateways.map(([section, title, description]) =>
    `<a class="teaching-gate gate-${section}" href="${directoryURL(section, language)}"><strong>${title}</strong><span>${description}</span></a>`
  ).join('');
  return `<div class="teaching-gates">${panels}</div>
    <nav class="teaching-shortcuts" aria-label="${ar ? 'روابط مباشرة' : 'Direct links'}">
      <span>${ar ? 'دخول مباشر' : 'Direct access'}</span>
      <a href="${academy}?view=course&amp;lang=${language}">${ar ? 'الاتصالات الرقمية الأولى' : 'Digital Communication I'}</a>
      <a href="/5g-lab/?lang=${language}">${ar ? 'مختبر تخطيط شبكات الجيل الخامس' : '5G radio planning lab'}</a>
    </nav>`;
}
