# My Study Path — independent Digital Communication I practice page

This folder adds a separate page. No existing academy file, stylesheet, navigation entry, question bank, numerical model or course-storage key is modified. The page reads the shared authored curriculum, topic explanations and numerical models; styles and application state are isolated here.

## Student workflow

- Understand: all 32 course topics, four mechanism steps, labeled block diagrams with selectable roles, local symbol definitions, the topic relation and one authored concept check.
- Solve: one numerical practice per topic, editable inputs, an optional hint, numerical checking with 1% relative tolerance, exact binary-word checks and vertical solution rows. Five introductory practice models (quantizer step, RC bandwidth, DPCM reconstruction, ADM next step and symbol energy) are authored locally; the other 27 reuse verified course models.
- Try and repair: six bounded teaching scenarios (aliasing, quantizer overload, DM slope capacity, matched-filter timing, PCM link rate and known-reference QPSK phase). Both the diagnosis and the numerical repair condition must be correct. Plots distinguish the original faulty settings from current student settings.

## State and performance

`dc-personal-path-v1` stores this page's topic position, current exercise inputs and answer draft, completed practices, review suggestions and repaired-case settings in localStorage. `dc-path-language` stores its own language selection. Neither key modifies academy progress. This is browser-local practice history, not formal grading or an authenticated student record.

The question snapshots contain only the 32 needed prompts, with no bank solutions or figures. The Arabic string subset contains the labels needed here. The page therefore does not load the complete question bank or full translation dictionary. Animations pause when offscreen or the tab is hidden; reduced-motion preference starts them paused. Constellation points remain at valid discrete locations.

Shared reference material and full animated explanations remain linked from the original course in a separate tab. Internal links use relative academy paths and preserve the selected language.

## Verification

`node scripts/test-student-path.mjs` checks initial faults, repairs, boundary rejection, malformed input, sampled alias equivalence, saturation, carrier-reference bit labels, Arabic digits and numeric tolerance. Existing academy, question-bank and mechanism tests remain applicable and unchanged.
