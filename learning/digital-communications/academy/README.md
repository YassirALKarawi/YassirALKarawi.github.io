# Digital Communication I — native interactive course

Eight lecture units, 32 topic experiments, 200 solved questions and 86 adjustable numerical models. Student content is English. The root course URL and the former bank / laboratory URLs forward to this application; no PDF renderer is used.

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
