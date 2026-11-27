// Shared by the academic site, engineering studio and Digital Communication I.
const studio = '/learning/';
const academy = studio + 'digital-communications/academy/';
const stateKey = 'yassirSiteBack';
const transferKey = 'yassir.navigation.transfer.v1';
const local = value => {
  if (!value) return null;
  try {
    const url = new URL(value, location.href);
    return url.origin === location.origin ? url.pathname + url.search + url.hash : null;
  } catch { return null; }
};
const learning = location.pathname.startsWith(studio);
const portal = url => [studio, studio + 'index.html'].includes(url.pathname);
const lang = () => document.documentElement.lang === 'ar' ? 'ar' : 'en';
const urlHere = () => local(location.href);
const stamp = entry => history.replaceState({...history.state, [stateKey]:entry}, '');
function pageKey(value) {
  const url = new URL(value, location.href);
  url.searchParams.delete('lang');
  url.searchParams.delete('v');
  url.searchParams.sort();
  if(portal(url)) { url.pathname=studio; url.hash ||= '#home'; } else url.hash='';
  return local(url.href);
}
function readTransfer() {
  try {
    const info = JSON.parse(sessionStorage.getItem(transferKey) || 'null');
    sessionStorage.removeItem(transferKey);
    if (info && Date.now()-info.time < 120000 && pageKey(info.to) === pageKey(location.href) && local(info.from)) {
      return {previous:info.from, distance:1};
    }
  } catch {}
  return {previous:null, distance:0};
}
let replacingWithParent = false;
let entry = history.state?.[stateKey] || readTransfer();
stamp(entry);
function nextEntry(from, to, before = entry) {
  if (pageKey(from) !== pageKey(to)) return {previous:local(from), distance:1};
  return {previous:before.previous, distance:before.previous ? before.distance + 1 : 0};
}
export function pushView(target) {
  entry = nextEntry(location.href, target);
  history.pushState({[stateKey]:entry}, '', target);
  updateDock();
}
document.addEventListener('click', e => {
  if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest?.('a[href]');
  if (!a || a.hasAttribute('download') || (a.target && a.target !== '_self') || a.matches('[data-site-back]')) return;
  const dest = local(a.href);
  if (!dest || new URL(a.href).pathname === location.pathname && new URL(a.href).search === location.search) return;
  try { sessionStorage.setItem(transferKey, JSON.stringify({from:urlHere(), to:dest, time:Date.now()})); } catch {}
}, true);
addEventListener('popstate', () => {
  if (history.state?.[stateKey]) entry = history.state[stateKey];
  updateDock();
});
addEventListener('hashchange', event => {
  if (replacingWithParent || !history.state?.[stateKey]) {
    entry = replacingWithParent ? {previous:null,distance:0} : nextEntry(event.oldURL, event.newURL);
    replacingWithParent = false;
    stamp(entry);
  }
  updateDock();
});
addEventListener('studio:route', updateDock);
addEventListener('pageshow', () => { entry = history.state?.[stateKey] || entry; updateDock(); });

function parentPage() {
  const url = new URL(location.href), home = studio + '?lang=' + lang();
  if (portal(url)) return document.querySelector('[data-trail] a:last-of-type')?.href || home+'#home';
  if (url.pathname.includes('/student-path/circuits.html')) return academy+'student-path/?lang='+lang();
  if (url.pathname.includes('/student-path/') && url.searchParams.has('mode')) return academy+'student-path/?lang='+lang();
  if (url.pathname.startsWith(academy)) {
    if (url.pathname.replace(/index\.html$/,'') !== academy || ![null,'course'].includes(url.searchParams.get('view'))) return academy+'?view=course&lang='+lang()+'#lecture-roadmap';
    return home+'#subject/communications/digital';
  }
  if (learning) return home+'#home';
  if (url.pathname.startsWith('/research/')) return '/publications.html';
  if (url.pathname.startsWith('/topics/')) return '/topics.html';
  return '/';
}
function previousVisit() {
  // Navigation entries are scoped to the current tab and origin. Stop at gaps
  // in their indexes so Back cannot silently cross a different website.
  const api = window.navigation, current = api?.currentEntry;
  if (current && current.index >= 0) {
    const entries = api.entries();
    for (let i = current.index - 1; i >= 0; i--) {
      const prior = entries.find(item => item.index === i), href = local(prior?.url);
      if (!href) return null;
      if (pageKey(href) !== pageKey(location.href)) return {previous:href, distance:current.index-i};
    }
    return null;
  }
  return entry.previous && local(entry.previous) ? entry : null;
}
const icons = {
  back:'<path d="m13 5-7 7 7 7M6 12h14"/>',
  home:'<path d="m3 10 9-7 9 7v10h-6v-6H9v6H3z"/>',
  lab:'<path d="M9 3h6m-5 0v6L4 19a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2L14 9V3M8 15h8"/>',
  learn:'<path d="m2.5 8 9.5-5 9.5 5-9.5 5zM6 10v6c3.5 3 8.5 3 12 0v-6"/>',
  book:'<path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1zm0 0v14"/>',
  profile:'<circle cx="12" cy="7.5" r="3.5"/><path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2"/>'
};
let dock;
function updateDock() {
  if (!dock) return;
  const ar = lang()==='ar', t=(a,b)=>ar?a:b;
  const studioBase=portal(new URL(location.href)) ? location.pathname+location.search : studio+'?lang='+lang();
  const studioHome=studioBase+'#home';
  const labels=learning ? [
    ['home',t('رئيسية البوابة','Studio home'),studioHome], ['lab',t('المختبرات','Labs'),studioBase+'#labs'], ['profile',t('الموقع الأكاديمي','Academic site'),'/']
  ] : [
    ['home',t('الرئيسية','Site home'),'/'], ['learn',t('بوابة الهندسة','Engineering studio'),studio+'?lang='+lang()+'#home'], ['book',t('المنشورات','Publications'),'/publications.html']
  ];
  const previous=previousVisit();
  const parent=parentPage();
  const homeAlready = pageKey(location.href)===pageKey(parent);
  const items=[['back',t('رجوع','Back'),previous?.previous || parent], ...labels];
  dock.dir=ar?'rtl':'ltr';
  dock.setAttribute('aria-label',t('التنقّل السريع','Quick navigation'));
  items.forEach(([icon,label,to],i)=>{
    const a=dock.children[i];a.href=to;
    a.querySelector('span').textContent=label;
    a.querySelector('svg').innerHTML=icons[icon];
    const active=i>0 && pageKey(to)===pageKey(location.href);
    if(active) a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    if(i===0){
      const disabled=!previous && homeAlready;
      a.setAttribute('aria-disabled',String(disabled));
      a.title=previous?t('العودة إلى الصفحة السابقة','Return to the previous page'):t('العودة إلى الصفحة الأعلى','Return to the parent page');
      if(disabled) a.removeAttribute('href');
    }
  });
}
const style = document.createElement('link');
style.rel='stylesheet';style.href='/assets/site-navigation.css?v=1';document.head.append(style);
dock = document.createElement('nav');
dock.id='site-quick-nav';
dock.innerHTML=Array.from({length:4},(_,i)=>'<a '+(!i?'data-site-back ':'')+'><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg><span></span></a>').join('');
document.body.append(dock);
document.body.classList.add('with-site-nav');
const back=dock.firstElementChild;
back.addEventListener('click',e=>{
  if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;
  if(back.getAttribute('aria-disabled')==='true'){e.preventDefault();return;}
  const previous=previousVisit();
  e.preventDefault();e.stopPropagation();
  if(previous) history.go(-previous.distance);
  else { replacingWithParent = true; location.replace(back.href); }
});
new MutationObserver(updateDock).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
updateDock();
