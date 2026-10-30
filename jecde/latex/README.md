# JECDE LaTeX author template v1.0

Journal of Electrical, Computer and Digital Engineering.

## Files

- `jecde.cls`: journal class, colors, title block, running headers, algorithm environment.
- `main.tex`: editable manuscript starter. Replace all instructional fields.
- `sample.tex`: instructional demonstration of equations, vector artwork, tables and algorithms.
- `sample.pdf`: compiled two-page layout preview, not a published article.
- `LICENSE.txt`: template code license.

## Compile

Use pdfLaTeX (TeX Live 2023 or newer, or Overleaf with pdfLaTeX):

```sh
pdflatex -interaction=nonstopmode -halt-on-error main.tex
pdflatex -interaction=nonstopmode -halt-on-error main.tex
```

Compile `sample.tex` twice to regenerate the illustrated preview.
Upload the ZIP contents into an Overleaf project and select `main.tex` or `sample.tex` as the main document.

## Design

A4; 18 mm side margins; 10 pt Palatino body; Helvetica headings; two columns with 7 mm separation. Forest green #176952, ink navy #122C36, pale sage #E9EFE7. Full-width title and abstract, formal unshaded tables, numbered equations and editable vector artwork. `jecalgorithm` provides a green algorithm header bar.

Use `\documentclass[review]{jecde}` to hide the title-block author metadata. This option alone does not anonymize document content, file names, PDF attachments or acknowledgments; inspect them manually. The journal's final review policy is pending.

## Journal metadata

This is a founding-stage author template. No assigned DOI, ISSN, volume, publication dates, indexing status or editorial appointments are implied. Do not invent these fields. The proposed author copyright and licensing policy is not a substitute for an executed publication agreement.

## Website and repository

The `jecde` directory in the account's website repository is an additive journal project. Static website files and downloadable author resources are included. The Sites deployment remains a separate publication workflow; a GitHub push does not automatically update Sites.
