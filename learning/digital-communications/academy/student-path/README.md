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


## Electronic workbench

`circuits.html?lang=ar` / `?lang=en` is an independent circuit-building page.
The experiment card and a new navigation button open it; the original course is unchanged.
Two starting experiments place **unwired** parts: RC low-pass and clock-controlled
sample-and-hold with a leakage resistor. Students add/remove/move parts, wire
terminals, select differential probes, switch sources on/off, pause or step time,
and edit component values. A reference-wiring button is optional and resets parts.

`circuit-engine.mjs` solves the actual connected R/C/source/switch netlist with
modified nodal analysis and backward Euler capacitor companions. No implicit
wire, reference ground, source signal or canned output is substituted. Switch
states are iterated against their actual gate voltage. Floating islands, missing
ground, source shorts and singular equations stop the simulation. Voltage probes
are ideal high impedance. Supply OFF sets both signal and clock sources to zero
while retaining capacitor state; topology/value edits explicitly reset it.
The UI adapts the time step to source period and the smallest R·C, and rejects
settings requiring <0.01 µs. Models and limitations are disclosed in both languages.
This is an educational bounded solver, not a general transistor/SPICE engine.

Validation: `node scripts/test-circuit-workbench.mjs` checks analytical RC charge,
discharge, inverted polarity, sine gain, sample acquisition/hold, leakage droop,
and invalid wiring. UI QA covers manual two-terminal wiring, reference assembly,
probe selection, power toggling, parameter edits and identical-probe zero voltage.
