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

`circuits.html?lang=ar` / `?lang=en` opens the separate circuit-building page.
The original course remains unchanged.

### Virtual instrument bench (bench3)

The circuit page now has front panels inspired by the supplied laboratory
photographs (not manufacturer-certified replicas): a two-channel function
generator, two independent CV/CC DC outputs, a storage oscilloscope and a 10 MΩ
voltmeter. The generator offers sine, pulse/square, triangle, ramp, DC, phase,
duty, offset and Vpp controls. Numeric fields, frequency sliders and accessible
rotary controls all change the same live source parameters. Instrument jacks
connect to board terminals; probe buttons attach to chosen test points.

The generator's 50 Ω output is represented in the source equation. Disabled
outputs are modeled as 1 GΩ. Supply current limits are solved iteratively,
including a supply short. Generator COMs share earth; supply negatives float
until wired. The scope earth clip physically merges its selected node with
ground. A 1×/10× probe adds 1 MΩ/10 MΩ respectively; the meter adds 10 MΩ.
Instrument outputs entirely unused by wires or probes are excluded; unwired
passive components still produce a wiring error. Changing topology or probes
resets time, while source setting/power edits retain capacitor state.

Scope voltage divisions, positions, time divisions, AUTO/NORMAL edge trigger,
level/source/slope, display RUN/STOP, future SINGLE capture, AUTO SET and time
cursors are functional. Scope STOP freezes acquisition independently from circuit
time. AC display is a continuously streamed 10 Hz high-pass model; it does not
model a physical coupling capacitor's loading. GND coupling displays zero and
does not short the probe tip. Probe capacitance and real device bandwidth are
excluded. Mean/RMS/Vpp/frequency are measured, never copied from source settings.
RMS(win) uses the acquired visible window. Meter mean/RMS uses up to the latest
5 ms (including startup). Frequency remains unavailable without two crossings.

Three experiments are offered: RC filter, track-and-hold, and supply CV/CC.
`Run a ready example` assembles, probes, powers and runs a solved live reference
circuit. It does not replay a canned trace. Manual assembly remains the default.
Sources and limits are disclosed in both languages, and the original academy
page remains untouched.

Additional validation: `node scripts/test-bench-instruments.mjs` covers waveform
phase/duty, actual RMS/frequency, valid and absent trigger edges, cursor
interpolation and persistent AC filter state. Extended circuit tests cover output
resistance, OFF impedance, CV→CC→CV, supply short and resistive probe loading.

ROLL mode intentionally bypasses edge locking and scrolls the acquired waveform.
SINGLE switches ROLL to NORMAL and requires a future trigger after arming.
The ready example initializes a short real acquisition and continues time without
blocking the UI for a long precomputed trace; auto fitting follows after enough
recorded cycles. The rolling buffer retains ≤50,000 samples / 30 ms. AC filter
state survives rolling-buffer truncation. Scope input resistance is connected
from every attached tip to instrument earth, even before the clip is attached;
the interface waits for the clip before displaying the educational measurement.
UI validation additionally exercised CV/CC values, manual probe attachment,
rotary keyboard control, false-edge NORMAL waiting, future SINGLE capture,
ROLL, scope STOP independent of circuit time, and time/voltage cursor readings.


### Live-first interface (live4)

The default page opens a powered reference circuit and immediately runs in ROLL,
so students see acquisition without a multi-button setup sequence. Selecting an
experiment does the same. A single prominent Run/Pause control coordinates
circuit time and scope acquisition. The diagram and scope share a desktop row;
mobile puts the scope first. Generator/supply panels, meter and expert scope
controls remain available in disclosures. Essential source settings are moved
(not duplicated) to the live toolbar. Manual unwired assembly is an explicit
option. Component edits/probe changes restart a previously running circuit if
the new netlist solves; invalid wiring stops with an error. Trigger stabilization
remains optional through the stable/moving view selector.

Wire coloring encodes actual node-voltage polarity, not current direction.
Component labels show actual terminal voltage or resistor branch current. No
particles or fake current-flow animations are substituted for electrical values.
The live animation refresh target is 35 ms; integration time remains a bounded
teaching-scale clock and is displayed separately from wall time.
