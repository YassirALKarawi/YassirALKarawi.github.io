export const lecturePlans = [
  {
    "n": 1,
    "source": "Lecture_01_Protected.pdf",
    "sourceDate": "2026-10-17",
    "goal": [
      "Explain the link, separate sampling from quantization, and predict aliasing.",
      "اشرح سلسلة الاتصال، وميّز أخذ العينات عن التكميم، وتوقّع التراكب الطيفي."
    ],
    "task": [
      "Use a 100 Hz source. Compare sampling at 800 and 150 sample/s; identify what information is lost.",
      "استعمل إشارة 100 Hz. قارن أخذ العينات عند 800 و150 عينة/ثانية، وحدّد المعلومات المفقودة."
    ],
    "evidence": [
      "Draw the source, sampling instants and alias on one time axis; state the anti-alias filter position.",
      "ارسم المصدر ولحظات العينات والإشارة المتراكبة على محور زمني واحد، وحدّد موضع مرشح منع التراكب."
    ],
    "lab": "alias",
    "sections": {
      "link": "1.1, 1.5–1.6",
      "sampling": "1.2–1.4, 1.7",
      "alias": "1.8–1.10",
      "reconstruct": "1.11"
    },
    "check": {
      "question": [
        "A 100 Hz tone sampled at 150 sample/s has what baseband alias frequency?",
        "ما تردد الإشارة المتراكبة في النطاق الأساسي لإشارة 100 Hz مأخوذة عند 150 عينة/ثانية؟"
      ],
      "answer": 50,
      "unit": "Hz",
      "explanation": [
        "|100 − 150| = 50 Hz. These two tones agree at the sampling instants under the appropriate phase convention.",
        "|100 − 150| = 50 Hz. تتطابق العينات وفق اتفاقية الطور المناسبة."
      ]
    }
  },
  {
    "n": 2,
    "source": "Lecture_02_Protected.pdf",
    "sourceDate": "2026-10-17",
    "goal": [
      "Identify which pulse parameter carries the message and how the receiver measures it.",
      "حدّد خاصية النبضة التي تحمل الرسالة وكيف يقيسها المستقبل."
    ],
    "task": [
      "Compare PAM, PWM and PPM with the same message. Change the message amplitude and identify the property that changes.",
      "قارن PAM وPWM وPPM للرسالة نفسها. غيّر سعة الرسالة وحدّد الخاصية التي تتغيّر."
    ],
    "evidence": [
      "Produce three labelled pulse sketches: height, width and position; explain the role of the clock.",
      "قدّم ثلاثة رسوم مسمّاة للنبضات: الارتفاع والعرض والموضع، واشرح دور الساعة."
    ],
    "lab": "pwm",
    "sections": {
      "pam": "2.1–2.4",
      "pwm": "2.7, 2.10–2.12",
      "ppm": "2.8–2.12",
      "aperture": "2.5–2.6"
    },
    "check": {
      "question": [
        "For w = 0.4 + 0.2x ms and x = 0.5 V, calculate the pulse width in ms (coefficient: 0.2 ms/V).",
        "إذا كان w = 0.4 + 0.2x بالمللي ثانية وx = 0.5 V، احسب عرض النبضة بالمللي ثانية؛ معامل التحويل 0.2 ms/V."
      ],
      "answer": 0.5,
      "unit": "ms",
      "explanation": [
        "w = 0.4 + 0.2 × 0.5 = 0.5 ms. Only width encodes the value in this PWM rule.",
        "w = 0.4 + 0.2 × 0.5 = 0.5 ms. العرض هو الذي يمثّل القيمة في قاعدة PWM هذه."
      ]
    }
  },
  {
    "n": 3,
    "source": "Lecture_03(1).pdf",
    "sourceDate": "2026-10-31",
    "goal": [
      "Follow a sample through quantization, binary encoding and reconstruction; distinguish quantization error from overload.",
      "اتبع العينة خلال التكميم والترميز الثنائي والاستعادة، وميّز خطأ التكميم عن تجاوز المجال."
    ],
    "task": [
      "Start with the quantizer staircase, follow the PCM word, then repair the distorted audio within the link budget.",
      "ابدأ بدرجات المكمّم، ثم اتبع كلمة PCM، وبعدها أصلح الصوت المشوّه ضمن ميزانية الوصلة."
    ],
    "evidence": [
      "Record the input, level, codeword, error and bit rate; explain why increasing bits cannot repair clipping alone.",
      "سجّل الدخل والمستوى والكلمة والخطأ ومعدل البتات، واشرح لماذا لا تكفي زيادة البتات وحدها لإزالة قصّ القمم."
    ],
    "lab": "quantizer",
    "sections": {
      "quantizer": "2–3",
      "pcm": "1, 5",
      "compand": "6",
      "sqnr": "4"
    },
    "check": {
      "question": [
        "Using the lecture quantizer: range [−2, 2) V, 3 bits and x = 0.62 V. What is the reconstructed level in V?",
        "باستخدام مكمّم المحاضرة: المجال [−2, 2) V، وثلاثة بتات، والدخل x = 0.62 V. ما مستوى الاستعادة بالفولت؟"
      ],
      "answer": 0.75,
      "unit": "V",
      "explanation": [
        "Δ = 4/8 = 0.5 V; index = 5, code = 101, level = −2 + 5.5 × 0.5 = 0.75 V. The general live lab uses [−1, 1) V, so do not copy its values into this example.",
        "Δ = 4/8 = 0.5 V؛ الفهرس 5 والكلمة 101، والمستوى −2 + 5.5 × 0.5 = 0.75 V. المختبر العام يستخدم [−1, 1) V؛ لذلك لا تنقل قيمه إلى هذا المثال دون تغيير المقياس."
      ]
    }
  },
  {
    "n": 4,
    "source": "Lecture_04_Improved.pdf",
    "sourceDate": "2026-11-16",
    "goal": [
      "Explain matched prediction memories, DM distortions and the allocation of time or frequency to users.",
      "اشرح تطابق ذاكرة التنبؤ، وتشوهات DM، وتوزيع الزمن أو التردد بين المستخدمين."
    ],
    "task": [
      "Compare DPCM, DM and ADM. Then calculate a PCM-TDM frame and contrast its slots with FDM bands.",
      "قارن DPCM وDM وADM، ثم احسب إطار PCM-TDM وقارن خاناته الزمنية بحزم FDM."
    ],
    "evidence": [
      "Show one prediction/correction table, a slope-overload example, and a frame with its overhead explicitly counted.",
      "قدّم جدول تنبؤ وتصحيح، ومثال تجاوز ميل، وإطارًا تُحتسب بتاته الإضافية بوضوح."
    ],
    "lab": "dpcm",
    "sections": {
      "dpcm": "4.1–4.7",
      "dm": "4.8–4.11",
      "adm": "4.12–4.13",
      "fdm": "4.14–4.15",
      "tdm": "4.16–4.20"
    },
    "check": {
      "question": [
        "A T1 frame has 24 channels × 8 bits plus one framing bit, at 8000 frames/s. Find its rate in kbit/s.",
        "يتكوّن إطار T1 من 24 قناة × 8 بتات وبت تأطير واحد، عند 8000 إطار/ثانية. احسب المعدل بوحدة kbit/s."
      ],
      "answer": 1544,
      "unit": "kbit/s",
      "explanation": [
        "(24 × 8 + 1) × 8000 = 1,544,000 bit/s = 1544 kbit/s. Frame duration is 125 μs.",
        "(24 × 8 + 1) × 8000 = 1,544,000 bit/s = 1544 kbit/s. مدة الإطار 125 μs."
      ]
    }
  },
  {
    "n": 5,
    "source": "Lecture_05_Improved.pdf",
    "sourceDate": "2026-11-16",
    "goal": [
      "Distinguish amplitude, phase and frequency mapping; relate the waveform to a coherent decision.",
      "ميّز تمثيل البت بالسعة والطور والتردد، واربط الموجة بقرار المستقبل المتزامن."
    ],
    "task": [
      "Compare OOK, BPSK and BFSK at the same bit rate. Use the lecture sequence 01101 when drawing the three waveforms by hand.",
      "قارن OOK وBPSK وBFSK عند معدل البتات نفسه. استخدم تسلسل المحاضرة 01101 عند رسم الموجات الثلاث يدويًا."
    ],
    "evidence": [
      "Mark bit boundaries, carrier cycles, decision rule and the bandwidth convention. The general lab repeats its own demonstration bit stream.",
      "علّم حدود البتات ودورات الحامل وقاعدة القرار واتفاقية عرض الحزمة. يكرّر المختبر العام تسلسل بتات توضيحيًا خاصًا به."
    ],
    "lab": "bpsk",
    "sections": {
      "ask": "5.1–5.3, 5.6, 5.9",
      "bpsk": "5.4, 5.6–5.9, 5.12",
      "bfsk": "5.5–5.6, 5.10–5.12",
      "bandwidth": "5.13–5.14"
    },
    "check": {
      "question": [
        "For the lecture example, fc = 2 kHz and Tb = 1 ms. How many carrier cycles occur within one bit?",
        "في مثال المحاضرة fc = 2 kHz وTb = 1 ms. كم دورة للحامل تقع داخل بت واحد؟"
      ],
      "answer": 2,
      "unit": "cycles",
      "explanation": [
        "fcTb = 2000 × 0.001 = 2 cycles. Two carrier cycles still represent one bit.",
        "fcTb = 2000 × 0.001 = دورتين. تمثّل الدورتان بتًا واحدًا."
      ]
    }
  },
  {
    "n": 6,
    "source": "Lecture_06(1).pdf",
    "sourceDate": "2026-10-31",
    "goal": [
      "Group bits into symbols, read I/Q coordinates and compare rate, spacing and bandwidth.",
      "جمّع البتات في رموز، واقرأ إحداثيات I/Q، وقارن المعدل والتباعد وعرض الحزمة."
    ],
    "task": [
      "Inspect QPSK and 16-QAM constellations; change bits per symbol in M-PSK and compare symbol rate and point spacing.",
      "افحص كوكبتي QPSK و16-QAM، وغيّر عدد البتات لكل رمز في M-PSK، ثم قارن معدل الرموز وتباعد النقاط."
    ],
    "evidence": [
      "Write the bit-to-point mapping, label both axes and calculate Rs; distinguish waveform coefficients from energy-normalized coordinates.",
      "اكتب ربط البتات بالنقاط، وسمِّ المحورين واحسب Rs، وميّز معاملات الموجة عن الإحداثيات المطبّعة بالطاقة."
    ],
    "lab": "qpsk",
    "sections": {
      "qpsk": "1–3",
      "mpsk": "3",
      "qam": "4",
      "efficiency": "5"
    },
    "check": {
      "question": [
        "A QPSK link carries 120 kbit/s. Find the symbol rate in kbaud.",
        "وصلة QPSK تحمل 120 kbit/s. احسب معدل الرموز بوحدة kbaud."
      ],
      "answer": 60,
      "unit": "kbaud",
      "explanation": [
        "k = log₂4 = 2; Rs = 120/2 = 60 kbaud.",
        "k = log₂4 = 2؛ Rs = 120/2 = 60 kbaud."
      ]
    }
  },
  {
    "n": 7,
    "source": "Lecture_07(1).pdf",
    "sourceDate": "2026-10-31",
    "goal": [
      "Separate differential encoding from differential detection, and explain continuous-phase MSK and M-FSK tone selection.",
      "ميّز الترميز التفاضلي عن الكشف التفاضلي، واشرح استمرارية طور MSK واختيار النغمات في M-FSK."
    ],
    "task": [
      "Follow the differential state, inspect MSK phase at bit boundaries and compare M-FSK tone indices.",
      "اتبع الحالة التفاضلية، وافحص طور MSK عند حدود البتات، وقارن فهارس نغمات M-FSK."
    ],
    "evidence": [
      "State the initial differential bit, check phase continuity, and state coherent or noncoherent assumptions before choosing tone spacing.",
      "حدّد البت الابتدائي للترميز التفاضلي، وافحص استمرارية الطور، وصرّح بفرض الكشف المتزامن أو غير المتزامن قبل اختيار تباعد النغمات."
    ],
    "lab": "msk",
    "sections": {
      "dpsk": "1–2",
      "msk": "3",
      "mfsk": "4–5"
    },
    "check": {
      "question": [
        "For MSK at Rb = 1000 bit/s, calculate the separation between the two tones in Hz.",
        "في MSK عند Rb = 1000 bit/s، احسب المسافة بين النغمتين بالهرتز."
      ],
      "answer": 500,
      "unit": "Hz",
      "explanation": [
        "Each tone is displaced by ±Rb/4 = ±250 Hz; their separation is Rb/2 = 500 Hz.",
        "تنحرف كل نغمة بمقدار ±Rb/4 = ±250 Hz؛ إذن المسافة بينهما Rb/2 = 500 Hz."
      ]
    }
  },
  {
    "n": 8,
    "source": "Lecture_08(1).pdf",
    "sourceDate": "2026-10-31",
    "goal": [
      "Connect correlation and matched filtering to a decision statistic and compare error probability under declared assumptions.",
      "اربط الارتباط والترشيح المطابق بإحصائية القرار، وقارن احتمال الخطأ ضمن فروض معلنة."
    ],
    "task": [
      "Move through the matched-filter overlap, then change Eb/N0 in the decision and BER laboratories.",
      "تابع تراكب المرشح المطابق، ثم غيّر Eb/N0 في مختبري القرار وBER."
    ],
    "evidence": [
      "Mark the sampling instant and decision threshold; separate analytical error probability from the error count in a finite simulation.",
      "علّم لحظة أخذ العينة وعتبة القرار، وميّز احتمال الخطأ النظري عن عدد الأخطاء في محاكاة محدودة."
    ],
    "lab": "matched",
    "sections": {
      "matched": "1–2",
      "decision": "1, 3",
      "ber": "3–5",
      "tradeoff": "5–6"
    },
    "check": {
      "question": [
        "A unit rectangular pulse lasts T = 2 ms. At what time does its matched-filter output reach the maximum, in ms?",
        "نبضة مستطيلة وحدوية مدتها T = 2 ms. عند أي زمن يبلغ خرج مرشحها المطابق القيمة العظمى، بالمللي ثانية؟"
      ],
      "answer": 2,
      "unit": "ms",
      "explanation": [
        "h(t) = g(T − t); full overlap occurs at t = T = 2 ms.",
        "h(t) = g(T − t)؛ يحدث التراكب الكامل عند t = T = 2 ms."
      ]
    }
  }
];
export function checkLectureAnswer(n,raw){const p=lecturePlans.find(x=>x.n===n);if(!p)return null;const text=String(raw).trim().replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632)).replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace(/٫/g,".").replace(/−/g,"-");if(!text||!Number.isFinite(Number(text)))return null;return Math.abs(Number(text)-p.check.answer)<=Math.max(1e-9,Math.abs(p.check.answer)*1e-6);}
