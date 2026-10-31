# Digital Communication I — native interactive course

Eight lecture units, 32 topic experiments, 200 solved questions and 86 adjustable numerical models. Student content is available in English and Arabic. The root course URL and the former bank / laboratory URLs forward to this application; no PDF renderer is used.

## Signal acquisition

`signals.mjs` contains deterministic, testable numerical models. `scope.mjs` acquires data progressively from an empty screen. Before the first screen fills, the right side contains no future waveform. Subsequently the physical-time window scrolls. Playback speed is separate from the physical time axis. Pause, Step and Restart operate on the acquired time. Reduced-motion preference starts acquisition paused.

## Model assumptions

- Quantization uses midpoint bins over [-1,1) V with saturation.
- PCM serializes each index most-significant bit first.
- DPCM uses previous reconstructed samples, including a local encoder loop.
- The ADM rule is illustrative with a 0.025–0.4 V step bound.
- MSK integrates instantaneous frequency and preserves phase through word repetition.
- Sampling/alias comparisons use the same physical sampling instants.
- Reconstruction uses a finite 33-term sinc sum, not ideal infinite reconstruction.
- The raised-cosine display uses 25 neighbouring symbols; spectral efficiency calculations state full passband bandwidth.
- The matched-filter display is the normalized convolution of isolated unit rectangles.
- Noise is deterministic Gaussian pseudo-noise for repeatable examples. Analytical BER is not a finite-run guarantee.
- Block connection exercises check declared signal paths; they are not an arbitrary electrical circuit solver. Feedback/clock and QPSK branches have explicit topology.

## Verification

From repository root:

```
node scripts/test-academy.mjs
node scripts/test-interactive-bank.mjs
```

These check all topics, acquisition bounds, signal invariants, original question coverage, numerical fixtures and invalid-input handling. Browser QA covers all eight lectures and representative pulse, PCM, ADM, QPSK, MSK, FSK and receiver experiments. Mobile CSS provides horizontally inspectable signal axes and vector figures where labels would otherwise become too small.

## Arabic / English edition

The header language control offers English and a complete authored Arabic edition. Arabic curriculum, question/solution HTML, MCQs and labelled vector assets live in `i18n/`; `ar.json` supplies the UI and live-model vocabulary. Numerical algorithms remain shared. Equation source, question identifiers, correct option indices and progress keys are identical across editions. Scientific axes, signal-flow geometry and mathematical notation retain LTR coordinates while Arabic prose uses RTL.

The selected language is stored as `dc-language` and propagated to academy links through `lang=ar` / `lang=en`. Explicit URL language takes precedence. Switching languages retains the route, scroll position, numerical bank inputs, topic-lab input values/acquisition state/wiring and quiz session, including a draft answer. No student progress is uploaded. Language state and lab inputs are browser-local; clearing storage removes them.

Validation: `node scripts/test-bilingual.mjs`, in addition to the three existing academy/bank/MCQ suites. Browser QA covered all 8 Arabic lectures (no KaTeX errors), all 32 Arabic lab screens, Arabic figures, quiz feedback, cross-language progress and mobile form sizing.

## Final audit fixes

Run `node scripts/test-final-audit.mjs` for the full 86-model / 200-result oracle, 180 single-field laboratory extremes, parsed-sequence/plot consistency, Arabic numeric input, receiver coordinate/bit outputs, exact BPSK/QPSK/4-QAM cases and damaged-session recovery. The theory comparison question now plots all four requested receiver models. Topic links retain the correct pulse-shaping convention. DEPSK is explicitly separated from differential detection. `finalAudit2` cache keys prevent reusing old application modules.

Browser audit of this release: 200 Arabic bank screens rendered (86 numerical panels, all 16 drawing answers) with no KaTeX or calculation errors; 16 lecture displays across both languages rendered 64 topic instances; all 32 lab screens loaded; the 80-question quiz returned 1/80 for one correct, one incorrect and 78 unanswered, with 80 answer-review entries. A low-rate sampling warning, paused state, input value and partial wiring survived a language switch. Both 390px mobile test/lab frames had equal content and viewport widths (375px after scrollbar). Browser extension metadata errors were excluded from application findings.

## Scientific reference checks

The Q function now uses converged regularized-gamma series / continued fractions rather than the earlier low-order approximation. It is checked against 14 independent SciPy Gaussian-tail values through z=37. Square Gray QAM BER is additionally computed from all one-axis Gaussian decision-bin transitions and Gray-label Hamming distances. M-PSK SER is additionally evaluated from its full AWGN integral using scaled adaptive quadrature. These reference rows are shown alongside the original requested teaching approximations in 8.24 and 8.25. Sixty independent SciPy CDF/integration cases span −10 to 30 dB and orders through 1024. Run `node scripts/test-scientific-references.mjs`. Model assumptions remain explicit; finite sample and finite pulse-shaping approximations remain educational models.


## Topic-first teaching edition (deep7)

`lessons.mjs` authors all 32 topics in English and Arabic: motivation, four mechanism steps, local symbol definitions, two reasoning relations, graph-reading guidance and specific assumptions. `lesson-view.mjs` places this material before worked examples and lazily mounts the corresponding numerical signal experiment inside each topic. All 191 symbol-table rows are context-specific; symbols with multiple meanings are distinguished locally.

`quantizer-view.mjs` uses the same `quantize` function as the time-domain experiments. Its input–output staircase is a transfer characteristic, not a time-domain signal. A controllable input moves through the thresholds, showing its level, signed error, index and codeword. The fixed mapping is deliberately not animated as a travelling wave.

Offscreen signal experiments stop acquiring and drawing until visible again. Expanded figures can be closed with Escape. Diagram dashes indicate processing direction, not a calibrated physical propagation delay. Reduced-motion preference starts signal acquisition and quantizer input animation paused.


## Causal visual examples (visual8)

Six topic pages and their corresponding laboratories include purpose-built visual explanations: sampling and aliasing link acquired sine samples to an analytical impulse-line spectrum; reconstruction reveals individually weighted sinc contributions; QPSK and 16-QAM synchronize bit labels, valid constellation points and both carrier branches; the matched-filter example shows the shifted reversed pulse, overlap product and accumulated integral. These examples have their own explicitly labeled controls, independent of the circuit workspace.

Sampling spectra combine complex coefficients before magnitude, so the zero-phase sine cancels correctly at coincident Nyquist replicas. Spectral weights are normalized by sample rate and use the same 0.8 V source amplitude as the time plots. Constellation axes are equally scaled waveform coefficients in volts, not energy-normalized coordinates. The rectangular-pulse convolution is normalized by T.

Run `node scripts/test-mechanisms.mjs` for independent fixtures and numerical-integration checks of these relationships. All diagrams are authored in code; reference lecture artwork is not copied.
