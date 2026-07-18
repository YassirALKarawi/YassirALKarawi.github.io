# Yassir AL-Karawi — Academic Homepage

Static, accessible, and search-friendly academic website for **Dr. Yassir AL-Karawi**.

## What is included

- Responsive academic homepage
- Searchable catalogue of 23 publications
- A dedicated, machine-readable HTML record for every publication
- Highwire citation metadata and Schema.org JSON-LD
- BibTeX copy controls
- Verified scholarly and professional profile links
- Sitemap, robots.txt, RSS, manifest, and social preview assets

## Local preview

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Rebuild generated pages

```bash
node scripts/build.mjs
```

Validate the generated site with:

```bash
node scripts/check.mjs
```

The site is designed for the GitHub Pages user repository `YassirALKarawi/YassirALKarawi.github.io` and requires no build action on GitHub.
