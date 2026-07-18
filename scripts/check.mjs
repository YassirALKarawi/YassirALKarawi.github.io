import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const required = ["index.html", "publications.html", "404.html", "assets/styles.css", "assets/app.js", "robots.txt", "sitemap.xml", "publications.json", "site.webmanifest"];
const failures = [];

for (const file of required) {
  try { await access(resolve(root, file)); }
  catch { failures.push(`Missing required file: ${file}`); }
}

const publications = JSON.parse(await readFile(resolve(root, "publications.json"), "utf8"));
const researchFiles = (await readdir(resolve(root, "research"))).filter(file => file.endsWith(".html"));
if (researchFiles.length !== publications.length) failures.push(`Expected ${publications.length} research pages, found ${researchFiles.length}`);

const htmlFiles = ["index.html", "publications.html", "404.html", ...researchFiles.map(file => `research/${file}`)];
for (const file of htmlFiles) {
  const html = await readFile(resolve(root, file), "utf8");
  if (!/^<!doctype html>/i.test(html)) failures.push(`${file}: missing doctype`);
  if (!html.includes('<meta name="viewport"')) failures.push(`${file}: missing viewport`);
  if (!html.includes('<link rel="canonical"')) failures.push(`${file}: missing canonical URL`);
  if (!html.includes('id="main"')) failures.push(`${file}: missing main landmark`);
  if (/\bundefined\b/.test(html)) failures.push(`${file}: contains undefined`);

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
}

const sitemap = await readFile(resolve(root, "sitemap.xml"), "utf8");
for (const pub of publications) if (!sitemap.includes(`/research/${pub.slug}.html`)) failures.push(`Sitemap missing ${pub.slug}`);

if (new Set(publications.map(pub => pub.slug)).size !== publications.length) failures.push("Duplicate publication slug");
const dois = publications.filter(pub => pub.doi).map(pub => pub.doi.toLowerCase());
if (new Set(dois).size !== dois.length) failures.push("Duplicate publication DOI");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML pages and ${publications.length} publication records.`);
