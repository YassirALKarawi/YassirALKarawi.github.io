const ar = document.documentElement.lang === 'ar';
const field = document.querySelector('#find');
const status = document.querySelector('#search-count');
const empty = document.querySelector('.directory-empty');
const groups = [...document.querySelectorAll('.directory-group')];
const sectionLinks = [...document.querySelectorAll('.directory-aside a')];
const picker = document.querySelector('.directory-picker');
const switchLanguage = document.querySelector('.directory-lang');
const format = new Intl.NumberFormat(ar ? 'ar-IQ' : 'en');

function normalise(text) {
  return text.normalize('NFKD').toLowerCase().replace(/[\u064b-\u065f\u0670\u0640]/g, '')
    .replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه')
    .replace(/[٠-٩]/g, c => String(c.charCodeAt(0) - 0x660)).trim();
}
const index = groups.map(group => ({
  group,
  rows: [...group.querySelectorAll('.directory-row')].map(row => ({
    row,
    words: normalise(group.querySelector('h2').textContent + ' ' + row.textContent + ' ' + (row.dataset.keywords || '')),
    details: row.querySelector('details')
  }))
}));
function selectSection() {
  const current = location.hash.slice(1);
  switchLanguage.hash = current;
  picker.value = current;
  sectionLinks.forEach(link => {
    if (link.hash === location.hash) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function filter() {
  const words = normalise(field.value).split(/\s+/).filter(Boolean);
  let count = 0;
  for (const { group, rows } of index) {
    let visible = 0;
    for (const { row, words: haystack, details } of rows) {
      row.hidden = !words.every(word => haystack.includes(word));
      if (!row.hidden) visible++;
      if (details) {
        if (words.length && details.dataset.wasOpen === undefined) details.dataset.wasOpen = String(details.open);
        if (words.length && !row.hidden) details.open = true;
        if (!words.length && details.dataset.wasOpen !== undefined) {
          details.open = details.dataset.wasOpen === 'true';
          delete details.dataset.wasOpen;
        }
      }
    }
    count += visible;
    group.hidden = visible === 0;
  }
  empty.hidden = count > 0;
  status.textContent = words.length ? (ar ? 'النتائج المطابقة: ' : 'Matching resources: ') + format.format(count) : '';
}
function clearSearch() { field.value = ''; filter(); }
sectionLinks.forEach(link => link.addEventListener('click', clearSearch));
picker.addEventListener('change', () => {
  if (!picker.value) return;
  clearSearch();
  const target = document.getElementById(picker.value);
  if (location.hash === '#' + picker.value) target.scrollIntoView();
  else location.hash = picker.value;
});
picker.hidden = false;
empty.querySelector('button').addEventListener('click', () => { clearSearch(); field.focus(); });
field.addEventListener('input', filter);
document.querySelector('.directory-search').hidden = false;
try {
  const theme = JSON.parse(localStorage.getItem('yassir.engineering.studio.v1.theme'));
  if (theme === 'dark' || theme === 'light') document.documentElement.dataset.theme = theme;
} catch {}
addEventListener('hashchange',selectSection);
selectSection();
