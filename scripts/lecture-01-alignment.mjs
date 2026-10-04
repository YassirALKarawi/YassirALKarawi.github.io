export function alignLectureOne(course) {
  Object.assign(course.lessons[0], {
    title: 'Introduction to Digital Communication',
    visual: 'sampling',
    summary: 'Systems, channels and sampling: follow the same clear explanations, 13 examples and 14 homework questions as the downloadable lecture.',
    outcomes: ['Identify the communication-system blocks', 'Explain sampling, quantization and encoding', 'Compare channels and their impairments', 'Calculate sampling rates and aliases'],
    quiz: [
      ['Which operation selects the measurement instants?', ['Sampling','Quantization','Encoding','Channel coding'], 0, 'Sampling selects times. Quantization selects amplitude levels.'],
      ['At 8000 samples/s, the sample interval is', ['8 ms','125 microseconds','0.8 s','125 ms'], 1, 'Ts = 1/8000 s = 125 microseconds.'],
      ['A 3-bit quantizer provides how many labels?', ['3','6','8','16'], 2, 'L = 2^3 = 8.'],
      ['For x(t) = 8 cos(200πt), the Nyquist rate is', ['100 samples/s','200 samples/s','400 samples/s','800 samples/s'], 1, 'The frequency is 200π/(2π) = 100 Hz, so the Nyquist rate is 200 samples/s. Choose a practical rate above the boundary.'],
      ['A 100 Hz cosine sampled at 150 samples/s has a first-interval alias at', ['25 Hz','50 Hz','100 Hz','150 Hz'], 1, '|100 - 150| = 50 Hz, which lies below fs/2 = 75 Hz.']
    ]
  });
  course.lessons[1].summary = 'Extend Lecture 01 with an interactive sampling laboratory, filter design choices and additional reconstruction problems.';
  course.lessons[1].overview = 'Lecture 01 introduced sample spacing, the Nyquist boundary, aliasing and ideal reconstruction. This follow-up revisits those rules as a brief review, then uses the interactive laboratory and new numerical problems to test their consequences. Change one parameter at a time and explain why the samples or spectral copies change.';
  course.lessons[2].summary = 'Extend Lecture 01 from quantization basics to quantization-noise power, SQNR, companding and PCM bit rate.';
  course.lessons[2].overview = 'Lecture 01 introduced amplitude levels and binary labels. This lecture builds on that foundation: pulse-code modulation (PCM) assigns a binary word to each quantized sample. The new focus is quantization-noise power, signal-to-quantization-noise ratio (SQNR), PCM bit rate and companding. The levels and step-size formulas are a short review before these extensions.';
}
