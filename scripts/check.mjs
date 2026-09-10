import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { researchContext, contextText, relatedPublications } from "./research-context.mjs";
import { originalAbstracts } from "./original-abstracts.mjs";
import { topics, topicPath, topicSlugs } from "./topics.mjs";

const root = resolve(import.meta.dirname, "..");
const required = ["index.html", "publications.html", "404.html", "assets/styles.css", "assets/app.js", "robots.txt", "sitemap.xml", "publications.json", "site.webmanifest", "learning/index.html", "learning/learning.css", "learning/learning-visuals.css", "learning/lesson.js", "learning/digital-communications/ask-modulation.html"];
const failures = [];
const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

for (const file of required) {
  try { await access(resolve(root, file)); }
  catch { failures.push(`Missing required file: ${file}`); }
}

const publications = JSON.parse(await readFile(resolve(root, "publications.json"), "utf8"));
const graph = JSON.parse(await readFile(resolve(root, "scholarly-graph.jsonld"), "utf8"));
const llms = await readFile(resolve(root, "llms.txt"), "utf8");
if (llms.includes("\\n-")) failures.push("llms.txt contains literal escaped newlines");
if (Object.keys(researchContext).length !== publications.length) failures.push("Research context and catalogue counts differ");
const researchFiles = (await readdir(resolve(root, "research"))).filter(file => file.endsWith(".html"));
if (researchFiles.length !== publications.length) failures.push(`Expected ${publications.length} research pages, found ${researchFiles.length}`);

const topicFiles = ["topics.html", ...topics.map(topic => topicPath(topic).slice(1))];
const learningFiles = ["learning/index.html", "learning/digital-communications/ask-modulation.html"];
const htmlFiles = ["index.html", "publications.html", "404.html", ...topicFiles, ...learningFiles, ...researchFiles.map(file => `research/${file}`)];
for (const file of htmlFiles) {
  const html = await readFile(resolve(root, file), "utf8");
  if (!/^<!doctype html>/i.test(html)) failures.push(`${file}: missing doctype`);
  if (!html.includes('<meta name="viewport"')) failures.push(`${file}: missing viewport`);
  if (!html.includes('<link rel="canonical"')) failures.push(`${file}: missing canonical URL`);
  if (!html.includes('id="main"')) failures.push(`${file}: missing main landmark`);
  if (/\bundefined\b/.test(html)) failures.push(`${file}: contains undefined`);
  if (/Hybrid Stable Plasmonic|Fabry.P[eé]rot Interferometer/i.test(html)) failures.push(`${file}: excluded unrelated paper appears`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (new Set(ids).size !== ids.length) failures.push(`${file}: duplicate element ID`);

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(json); }
    catch (error) { failures.push(`${file}: invalid JSON-LD (${error.message})`); }
  }

  for (const [, target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!target.startsWith("/") || target.startsWith("//")) continue;
    const path = target.split(/[?#]/, 1)[0];
    const local = path === "/" ? "index.html" : path.slice(1);
    try { await access(resolve(root, local)); }
    catch { failures.push(`${file}: broken internal reference ${target}`); }
  }
}

for (const pub of publications) {
  const file = `research/${pub.slug}.html`;
  const html = await readFile(resolve(root, file), "utf8");
  for (const marker of ["citation_title", "citation_author", "citation_publication_date", "application/ld+json", "Copy BibTeX"]) {
    if (!html.includes(marker)) failures.push(`${file}: missing ${marker}`);
  }
  if (pub.doi && !html.includes(pub.doi)) failures.push(`${file}: DOI not rendered`);
  const context = pub.researchContext;
  if (!context || !["abstract", "scope"].includes(context.basis)) {
    failures.push(`${file}: missing or invalid research context`);
    continue;
  }
  if (!context.sources.length) failures.push(`${file}: missing summary sources`);
  if (context.basis === "scope" && (context.approach || context.findings)) failures.push(`${file}: scope-only record asserts detailed methods/results`);
  for (const source of context.sources) {
    if (!source.url.startsWith("https://")) failures.push(`${file}: source must use HTTPS`);
    if (!html.includes(`href="${escapeHtml(source.url)}"`)) failures.push(`${file}: source link missing`);
  }
  for (const part of [context.overview, context.approach, context.findings, context.note].filter(Boolean)) {
    if (!html.includes(`<p>${escapeHtml(part)}</p>`)) failures.push(`${file}: editorial context is not visible`);
  }
  if (!llms.includes(contextText(context))) failures.push(`${file}: context missing from llms.txt`);
  const node = graph["@graph"].find(item => item["@id"] === `https://yassiralkarawi.github.io/research/${pub.slug}.html#article`);
  if (node?.description !== `${pub.summary} ${contextText(context)}`) failures.push(`${file}: JSON-LD description differs from visible content`);
  if (JSON.stringify(node?.keywords) !== JSON.stringify(pub.keywords)) failures.push(`${file}: machine-readable keywords differ`);
  if (new Set(pub.keywords).size !== pub.keywords.length) failures.push(`${file}: duplicate keywords`);
  if (pub.keywords.length > 12) failures.push(`${file}: review excessive keyword count`);
  for (const keyword of pub.keywords) {
    if (!html.includes(`<span>${escapeHtml(keyword)}</span>`)) failures.push(`${file}: keyword not visible: ${keyword}`);
  }
  const related = relatedPublications(pub, publications);
  if (related.length < 1 || related.length > 3 || new Set(related.map(item => item.slug)).size !== related.length || related.some(item => item.slug === pub.slug)) failures.push(`${file}: invalid related publications`);
  for (const item of related) if (!html.includes(`href="/research/${item.slug}.html"`)) failures.push(`${file}: related link missing`);
  if (!pub.doi && html.includes('href="https://api.openalex.org/works/"')) failures.push(`${file}: non-specific OpenAlex lookup`);
  if (pub.authors.includes("et al.")) failures.push(`${file}: incomplete author list`);
  const original = originalAbstracts[pub.slug];
  if (original) {
    if (pub.originalAbstract?.text !== original.text || node?.abstract !== original.text) failures.push(`${file}: original abstract differs between data formats`);
    if (!html.includes(`<p class="abstract-text">${escapeHtml(original.text)}</p>`)) failures.push(`${file}: original abstract not fully visible`);
    if (!html.includes(original.sourceUrl) || !html.includes(original.license)) failures.push(`${file}: missing abstract attribution`);
    const ris = await readFile(resolve(root, `research/${pub.slug}.ris`), "utf8");
    if (!ris.includes(`AB  - ${original.text}`) || !llms.includes(original.text)) failures.push(`${file}: original abstract missing from exports`);
  } else if (node?.abstract || html.includes('class="abstract-text"')) failures.push(`${file}: unverified original abstract`);
  for (const topic of topics.filter(topic => topicSlugs(topic).includes(pub.slug))) if (!html.includes(`href="${topicPath(topic)}"`)) failures.push(`${file}: missing topic backlink`);
}

const sitemap = await readFile(resolve(root, "sitemap.xml"), "utf8");
for (const file of topicFiles) if (!sitemap.includes(`/${file}</loc>`)) failures.push(`Sitemap missing ${file}`);
for (const topic of topics) {
  const html = await readFile(resolve(root, topicPath(topic).slice(1)), "utf8");
  for (const slug of topicSlugs(topic)) {
    if (!publications.some(pub => pub.slug === slug)) failures.push(`Topic references unknown paper: ${slug}`);
    if (!html.includes(`href="/research/${slug}.html"`)) failures.push(`Topic missing paper link: ${slug}`);
  }
}
const textSitemap = (await readFile(resolve(root, "sitemap.txt"), "utf8")).trim().split("\n");
const xmlUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
if (JSON.stringify(textSitemap) !== JSON.stringify(xmlUrls)) failures.push("XML and text sitemaps differ");
if (new Set(xmlUrls).size !== xmlUrls.length || xmlUrls.length !== publications.length + topics.length + 5) failures.push("Unexpected sitemap count or duplicates");
for (const pub of publications) if (!sitemap.includes(`/research/${pub.slug}.html`)) failures.push(`Sitemap missing ${pub.slug}`);

if (new Set(publications.map(pub => pub.slug)).size !== publications.length) failures.push("Duplicate publication slug");
const dois = publications.filter(pub => pub.doi).map(pub => pub.doi.toLowerCase());
if (new Set(dois).size !== dois.length) failures.push("Duplicate publication DOI");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML pages and ${publications.length} publication records.`);
console.log(`Verified ${Object.keys(originalAbstracts).length} complete licensed abstracts and ${topics.length} bidirectional topic guides.`);
console.log(`Verified ${publications.filter(pub => pub.researchContext.basis === "abstract").length} abstract-based summaries, source links, visible/structured consistency and related publications.`);
