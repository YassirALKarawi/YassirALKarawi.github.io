# Sound laboratory — Why did the sound distort?

Open `index.html?lang=ar` or `?lang=en` through an HTTP server. The academy home links to this experiment. It uses static modules and Web Audio; there is no backend, account, microphone access or AI service.

## Learning flow

1. Compare the original, faulty receiver and current receiver audio and waveforms.
2. Inspect the original faulty setup: ADC input range, ideal bit transmission and sampling assumptions.
3. Diagnose overload with the ADC range measurement. Incorrect choices receive conceptual feedback; the correct choice without evidence does not unlock repair.
4. Adjust gain and precision, and test all three constraints: zero overloaded samples, measured signal-to-error ratio at least 35 dB, and line rate at most 64 kbit/s including 10% framing overhead.
5. Retain the settings and test a stronger source. Adapt the repair if needed. Both case records store the actual settings and metrics that passed.

The model is deterministic: 48,000 samples at 8 kHz, six one-second notes with smoothed attack/release and three harmonics. The source is peak-normalized to 0.90 V in the first case and 1.15 V in the transfer case. The highest tone harmonic is about 989 Hz; short smooth envelopes are not claimed to be perfectly bandlimited. Sampling insufficiency is not the intended fault.

The quantizer imports the academy's uniform midpoint implementation over `[-1,1)` V. Samples at +1 V are out of range; -1 V is in range. Words are unsigned bin indices, MSB first. The ideal receiver reconstructs the quantized level and divides by the transmitter gain. The displayed metric is the exact sample-domain signal-to-reconstruction-error ratio, including clipping, rather than an analytical full-scale sine SQNR approximation or a speech-quality score. The channel capacity is a constraint, not a packet-loss simulator.

All three audio tracks use exactly the plotted arrays and the same fixed attenuation of 0.4. A shared 10 ms attack / 20 ms release avoids playback clicks. The browser handles resampling to its hardware output rate; analog reconstruction circuitry is not simulated. Audio never autoplays, and stops on parameter/language/case changes, backgrounding and navigation. Waveform tracking is automatic for every playback, with no checkbox or tracking setting. Pressing any audio track starts a rolling view of the samples reached by the audio clock, updated up to 30 times per second. Manually inspecting a sample or changing the visible time window stops playback so the sample remains available for inspection. Pressing play again always restarts synchronized audio and animation. Stop freezes the last visible window. Sample inspection also works without sound or motion.

Reports use `dc-sound-record-v1` in local storage. The download is a readable, printable HTML report in the selected language, with exact per-case metrics and links to reproduce the settings. Reports are local practice evidence, not certified assessment or cross-device progress. Shared URLs contain only validated experiment settings and language; they cannot transfer a pass. The current design can also be downloaded as mono 8 kHz 16-bit WAV.

## Validation

Run `node scripts/test-sound-lab.mjs` from the repository root. The independent numeric fixtures cover midpoint levels, range endpoints, PCM round trips, error bounds, overload remaining after increased precision, rate violations, stronger-source failure and repair, invalid shared URLs and WAV header/sample encoding. Browser checks cover Arabic/English state preservation, diagnostic evidence gates, control changes, feedback, audio state, report/download actions and narrow layouts.

Representative results (exact values are calculated, not embedded in the interface):

| Case | G | Bits | Signal/error | Overload | Line rate | Result |
|---|---:|---:|---:|---:|---:|---|
| Original fault, 0.90 V | 1.65 | 6 | 12.63 dB | 41.1% | 52.8 kbit/s | Fail |
| First repair, 0.90 V | 1.00 | 7 | 42.34 dB | 0 | 61.6 kbit/s | Pass |
| Same repair, 1.15 V | 1.00 | 7 | 22.56 dB | 22.9% | 61.6 kbit/s | Fail |
| Adapted repair, 1.15 V | 0.80 | 7 | 42.42 dB | 0 | 61.6 kbit/s | Pass |

Other valid designs exist. A pass is decided by the three measured conditions, never an exact target slider value.
