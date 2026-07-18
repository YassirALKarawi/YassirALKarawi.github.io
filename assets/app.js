(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.footer-bottom [data-year]').forEach(node => node.textContent = new Date().getFullYear());
  let toast = document.querySelector('.toast');
  if (!toast) { toast = document.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status'); document.body.append(toast); }
  const notify = message => { toast.textContent = message; toast.classList.add('show'); clearTimeout(window.__toast); window.__toast = setTimeout(() => toast.classList.remove('show'), 1800); };
  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(button.dataset.copy); notify('BibTeX copied'); }
    catch { notify('Select and copy the citation block'); }
  }));
  const search = document.querySelector('#publication-search');
  const year = document.querySelector('#year-filter');
  const type = document.querySelector('#type-filter');
  const theme = document.querySelector('#theme-filter');
  const cards = [...document.querySelectorAll('[data-publication]')];
  const count = document.querySelector('#result-count');
  const empty = document.querySelector('#no-results');
  const apply = () => {
    const query = (search?.value || '').trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const match = (!query || card.dataset.search.includes(query)) && (!year || year.value === 'all' || card.dataset.year === year.value) && (!type || type.value === 'all' || card.dataset.type === type.value) && (!theme || theme.value === 'all' || card.dataset.theme.includes(theme.value));
      card.hidden = !match; if (match) visible++;
    });
    if (count) count.textContent = String(visible);
    if (empty) empty.hidden = visible !== 0;
  };
  [search, year, type, theme].filter(Boolean).forEach(control => control.addEventListener(control === search ? 'input' : 'change', apply));
  document.querySelector('#clear-filters')?.addEventListener('click', () => { if (search) search.value = ''; [year, type, theme].filter(Boolean).forEach(control => control.value = 'all'); apply(); });
})();
