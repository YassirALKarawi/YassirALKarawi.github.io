// Editorial paraphrases, not verbatim publisher abstracts. Reviewed 2026-09-07.
// Quantitative claims are restricted to the conditions stated in the linked source.
// Scope-only records deliberately omit unverified methods and numerical findings.
const bura = (id) => ({ label: "Brunel research archive: abstract and publication record", url: `https://bura.brunel.ac.uk/handle/2438/${id}` });
const crossref = (doi) => ({ label: "Publisher-deposited abstract and metadata (Crossref)", url: `https://api.crossref.org/works/${doi}` });
const ieee = (id) => ({ label: "IEEE publication record", url: `https://ieeexplore.ieee.org/document/${id}/` });
const piers = { label: "PIERS 2012 conference programme", url: "https://piers.org/pierspublications/PIERS2012MoscowFinalProgram.pdf" };

export const researchContext = {
  "quantum-cognitive-radar-thermal-loss": {
    basis: "abstract",
    overview: "The study asks how a radar can adapt its detection strategy when attenuation and thermal background noise change. It combines entangled signal and idler modes with feedback control, connecting quantum illumination to an adaptive sensing problem rather than treating the transmitter settings as fixed.",
    approach: "A two-mode squeezed-vacuum transmitter, joint idler–signal receiver and quantum neural-network controller form the proposed system. A Gaussian correlation detector is compared with the quantum Chernoff bound, while the controller adjusts operating parameters under an energy constraint.",
    findings: "Hardware-aware simulations report approximately 3 dB advantage and up to 40% shorter integration time at a false-alarm probability of 0.05. At a false-alarm probability of 0.001, reported detection probability is 0.47, versus 0.20 for the classical comparator.",
    note: "These are simulation results for the paper's channel and receiver assumptions, not measurements from a deployed radar.",
    additionalKeywords: ["Quantum Illumination", "Quantum Neural Network Controller", "Quantum Chernoff Bound"],
    sources: [bura("32660")]
  },
  "digital-twin-native-ai-6g-networks": {
    basis: "scope",
    overview: "This paper addresses the relationship between digital twins and native artificial intelligence in 6G networks. Its stated scope spans architecture, applications, evaluation and open challenges. It is a starting point for readers investigating how digital representations and AI-enabled network functions fit into future communications systems.",
    sources: [ieee("11493034")]
  },
  "lossless-canonical-coding-fpga": {
    basis: "scope",
    overview: "The paper connects lossless canonical coding with a high-speed FPGA implementation. Its scope concerns both the coding design and its realisation as digital hardware. Readers interested in hardware-oriented data compression can use the publication record to examine the architecture and the implementation evidence reported by the authors.",
    sources: [ieee("11493133")]
  },
  "cybersecure-entangled-qnn-ris-qkd": {
    basis: "abstract",
    overview: "The proposed hybrid quantum–classical framework coordinates distributed quantum neural networks for 6G holographic communications. It combines entanglement-assisted synchronisation, reconfigurable intelligent surfaces and quantum key distribution within a single communication and learning model.",
    approach: "GHZ-state gradient consensus and entropy- and trace-distance regularisation support synchronisation. QNN parameters and RIS phases are jointly adjusted to preserve fidelity under noise, with QKD protecting the modelled midhaul. Qiskit simulations compare the full framework with reduced versions that omit GHZ synchronisation or RIS assistance.",
    findings: "Across 100 simulation trials, the abstract reports mean fidelity of 0.961 and latency of 22.5 ms. Fidelity improvements of 20–28% are reported relative to the reduced baselines.",
    note: "The reported evidence is simulation-based; these figures do not establish an operational 6G holographic network or experimentally demonstrated security.",
    additionalKeywords: ["GHZ-State Synchronisation", "Qiskit Simulation", "Quantum State Fidelity"],
    sources: [bura("33048")]
  },
  "quantum-digital-twin-threat-reversal-open-ran": {
    basis: "abstract",
    overview: "This work models an Open RAN security digital twin using quantum-state representations of network telemetry. Its focus is proactive response to modelled attacks, with state fidelity and divergence used to track disruption and recovery.",
    approach: "Amplitude encoding, GHZ and cluster-state entanglement represent telemetry. Bit-flip, phase-flip and amplitude-damping channels model adversarial effects. A lightweight REINFORCE policy selects responses, evaluated through Qiskit simulations and software-loop timing.",
    findings: "The abstract reports mean fidelity above 0.91, attack classification above 87% and approximately 19.1 ms software-loop latency under the studied conditions. Comparisons include classical intrusion detection and quantum-thresholding baselines.",
    note: "Software-loop timing and simulated quantum states are not evidence of a deployed quantum security system. The paper's noise models and baselines define the scope of the results.",
    additionalKeywords: ["Amplitude Encoding", "REINFORCE Policy", "Quantum State Fidelity"],
    sources: [bura("32659")]
  },
  "high-pass-filter-overshoot-bessel-gaussian": {
    basis: "abstract",
    overview: "The paper examines a filter-design trade-off: a flat time-domain step response does not automatically imply a flat amplitude–frequency response. It compares high-pass designs derived from Bessel and Gaussian low-pass prototypes.",
    approach: "Bilinear transformations generate the IIR high-pass designs. A parallel structure combines a direct path with a low-pass branch. Mathcad numerical evaluations compare filter orders and parallel versus stage-by-stage connections, considering both transient behaviour and frequency-response overshoot.",
    findings: "Gaussian-based designs show smaller negative step overshoot in the evaluated examples, while frequency-response overshoot increases with order. The proposed parallel scheme reports up to 30% lower amplitude–frequency overshoot than the conventional schemes without degrading transient response.",
    note: "The comparisons are numerical filter-design results, not measured performance of every hardware implementation.",
    additionalKeywords: ["IIR High-Pass Filters", "Bilinear Transformation", "Parallel Filter Structure"],
    sources: [crossref("10.37391/IJEER.130318")]
  },
  "energy-efficient-dwdm-backhaul-open-ran": {
    basis: "abstract",
    overview: "This study targets the joint energy and latency demands of optical backhaul for 6G Open RAN. Rather than keeping all wavelength resources active, the proposed controller adapts optical capacity to changing traffic while observing transport-delay constraints.",
    approach: "Three stages combine projected primal–dual wavelength allocation, energy-aware wavelength pruning and latency-responsive reconfiguration. The evaluation considers multiple topologies and bursty or diurnal traffic, with static provisioning, greedy control and a lightweight actor–critic among the comparators.",
    findings: "The reported evaluations show up to 32% lower optical power than static provisioning, with delays around 0.7–0.8 ms. The paper also examines violations of the 1 ms latency threshold.",
    note: "Savings and delay figures depend on the evaluated topology, load and baseline; they are not a guarantee for a deployed backhaul.",
    additionalKeywords: ["Wavelength Allocation", "Primal–Dual Optimisation", "Wavelength Pruning"],
    sources: [{ label: "Publisher abstract and article", url: "https://ijeer.forexjournal.co.in/archive/volume-13/ijeer-130426.html" }]
  },
  "cybersecurity-observer-power-distribution": {
    basis: "scope",
    overview: "This paper studies observer-based control for smart power distribution when measurement data can be corrupted by false-data injection. Its scope links control-system state estimation with cybersecurity. It is relevant to research on maintaining reliable control in power-distribution systems exposed to malicious data.",
    sources: [ieee("11206666")]
  },
  "fir-filter-transient-compensation": {
    basis: "scope",
    overview: "This work focuses on transient effects in finite impulse response digital filters and a compensation technique intended to improve impulse-response behaviour. The topic is distinct from FPGA resource optimisation: the central concern here is the filter's response over time. Consult the original paper for the compensation procedure and its evaluation conditions.",
    sources: [ieee("11028159")]
  },
  "off-grid-oran-ris-edge-energy": {
    basis: "abstract",
    overview: "The paper studies solar-powered Open RAN in isolated environments, combining reconfigurable intelligent surfaces and mobile edge computing. The resource-management problem must accommodate changing harvested energy and traffic while respecting delay, power and temperature limits.",
    approach: "A primal–dual controller updates transmit power, CPU speed and RIS phases from queue and energy conditions. The objective balances energy use, delay, SINR-related reliability and fairness. MATLAB simulations, sensitivity analysis and ablation tests examine the individual design choices.",
    findings: "The abstract reports 25% lower energy consumption and 18% lower average delay than the baseline under the simulated solar and traffic conditions.",
    note: "The source identifies the evidence as MATLAB simulation, not field measurements from an off-grid network. Reported gains apply to the evaluated baseline and constraints.",
    additionalKeywords: ["Solar-Powered Networks", "Primal–Dual Optimisation", "Mobile Edge Computing"],
    sources: [bura("31653")]
  },
  "quantum-load-balancing-open-ran-energy": {
    basis: "abstract",
    overview: "This work studies energy efficiency in virtualised Open RAN, where traffic variation and competition for virtual-machine resources affect power use. A quantum-based load-balancing model is used to formulate the allocation problem.",
    approach: "The paper develops a power-consumption model and a nonlinear optimisation problem using Lagrange multipliers. Numerical solutions obtained with sequential quadratic programming are compared with an active-set method.",
    findings: "The reported numerical comparison gives approximately 45% higher energy efficiency for sequential quadratic programming than for the active-set method.",
    note: "This figure compares the two evaluated optimisation methods; it is not a measured quantum-hardware speedup or a 45% saving against all conventional networks.",
    additionalKeywords: ["Sequential Quadratic Programming", "Active-Set Method", "Virtual Machine Allocation"],
    sources: [bura("28659")]
  },
  "power-consumption-next-generation-open-ran": {
    basis: "scope",
    overview: "The paper evaluates power consumption in next-generation Open Radio Access Networks. It provides an energy-focused perspective on an architecture characterised by network openness and vendor diversity. It complements the author's load-balancing and off-grid optimisation papers by addressing the evaluation of power demand itself.",
    sources: [ieee("10444418")]
  },
  "cloud-data-center-placement-virtualized": {
    basis: "abstract",
    overview: "The study jointly considers where to place a mobile cloud data centre and how many virtual machines it should host. The objective is energy efficiency subject to network quality-of-service requirements, rather than placement based only on geographical proximity.",
    approach: "Monte Carlo-oriented particle swarm optimisation and a genetic algorithm are used to explore virtual-machine counts and data-centre position. The power model includes both the virtualised server and radio units, with resource blocks, transmit and receive power, and overhead consumption among its inputs.",
    findings: "The abstract describes an optimisation framework constrained by latency, resource-block availability and a minimum user data rate. It does not state a single numerical improvement percentage.",
    note: "The appropriate placement and virtual-machine count are model-dependent; the abstract does not support a universal best location.",
    additionalKeywords: ["Particle Swarm Optimisation", "Genetic Algorithm", "Virtual Machine Allocation"],
    sources: [crossref("10.11591/ijece.v12i3.pp3276-3286")]
  },
  "qos-quantum-entanglement-mobile-networks": {
    basis: "abstract",
    overview: "This paper investigates a model for integrating quantum entanglement into mobile-cloud communications. It examines quality of service through signalling overhead, delay and energy use, linking quantum-network concepts with mobile-network operation.",
    approach: "The analysis compares classical and quantum communication paradigms and considers entanglement-assisted reduction of X2-AP signalling overhead. Delay and power models are used to assess the proposed integration and its dependence on photon resources.",
    findings: "The abstract reports lower modelled delay and power consumption for the proposed scenario. The comparisons should be interpreted within the paper's assumptions about quantum resources and mobile-network signalling.",
    note: "This is a modelling study, not evidence that an operational mobile network can exchange classical information instantaneously using entanglement.",
    additionalKeywords: ["X2-AP Signalling", "Handover", "Quantum Teleportation"],
    sources: [bura("23766")]
  },
  "trade-offs-5g-networks-beyond": {
    basis: "abstract",
    overview: "The paper examines green mobile-network design as a set of competing engineering and economic objectives. Energy efficiency is considered alongside deployment cost and service performance, rather than as an isolated target.",
    approach: "Numerical analysis examines relationships involving power, bandwidth, spectral efficiency, delay, carbon emissions, deployment cost and revenue. The scope connects technical network choices with the cost considerations faced by operators and investors.",
    findings: "The work highlights trade-offs between greener operation and cost efficiency. Its abstract does not establish a single configuration that is optimal for every network, or give a universal percentage improvement.",
    additionalKeywords: ["Green Communications", "Deployment Cost", "Carbon Emissions"],
    sources: [crossref("10.1088/1757-899X/1076/1/012066")]
  },
  "efficient-fir-filter-fpga": {
    basis: "abstract",
    overview: "The paper targets the hardware cost of finite impulse response filtering. Its architecture reduces multiplier requirements using shift-and-add operations, addressing the resource and performance demands of digital filtering in communications systems.",
    approach: "A 10-tap FIR design is expressed in Verilog HDL, simulated in Modelsim and implemented using Altera's Quartus II tools. FPGA synthesis provides the basis for comparison with existing reconfigurable architectures.",
    findings: "The design example reports 25% lower resource usage and 37% higher speed than the compared existing methods.",
    note: "These are results for the paper's architecture and synthesis example, not measured advantages for every FPGA device or filter order.",
    additionalKeywords: ["Shift-and-Add Architecture", "Verilog HDL", "FPGA Synthesis"],
    sources: [{ label: "Bentham Science: publisher abstract and article", url: "https://www.benthamscience.com/article/98713" }, crossref("10.2174/2213275912666190603115506")]
  },
  "welch-dct-energy-detection-cognitive-radio": {
    basis: "abstract",
    overview: "This paper addresses spectrum sensing for cognitive radio, where detecting an occupied channel is important before using otherwise idle spectrum. It considers energy detection for low signal-to-noise-ratio signals.",
    approach: "The proposed detector uses the discrete cosine transform with Welch's periodogram to estimate power spectral density. Its evaluation considers digital video broadcasting signals over an additive white Gaussian noise channel, with different signal-to-noise ratios and user-terminal conditions.",
    note: "This overview describes the method stated in the paper's abstract. No numerical detection advantage is asserted here.",
    additionalKeywords: ["Power Spectral Density", "Welch Periodogram", "Additive White Gaussian Noise"],
    sources: [{ label: "Original paper abstract", url: "https://www.academia.edu/130336342/On_the_energy_detection_performance_based_Welchs_DCT_algorithm_in_cognitive_radio_systems" }, ieee("8340542")]
  },
  "ofdm-papr-cyclic-prefix-shifting": {
    basis: "abstract",
    overview: "The paper addresses peak-to-average power ratio in OFDM while also considering computational complexity and bit-error performance. It positions the proposed shifting method against amplitude clipping and selected mapping, which have different implementation trade-offs.",
    approach: "The abstract describes cyclic shifting of frequency-domain OFDM samples to form alternative arrangements with reduced peak-to-average power ratio. Simulation is used to examine PAPR and bit-error behaviour, with selected mapping as a complexity comparator.",
    findings: "The paper reports PAPR reduction without bit-error-rate degradation in its simulations, and approximately 68% lower computational complexity than the compared selected-mapping scheme.",
    note: "The 68% figure concerns the stated computational-complexity comparison, not a measured 68% reduction in device energy or battery use.",
    additionalKeywords: ["Selected Mapping", "Bit Error Rate", "Computational Complexity"],
    sources: [{ label: "Publisher abstract and article", url: "https://indjst.org/articles/reducing-papr-of-ofdm-systems-using-cyclic-prefix-shifting-algorithm" }]
  },
  "dca-haps-terrestrial-5850-7075": {
    basis: "scope",
    overview: "This conference paper concerns the applicability of dynamic channel assignment to high-altitude platform systems in the 5850–7075 MHz band. It belongs to the author's spectrum-sharing work on HAPS and terrestrial communications. Its focus is channel assignment, distinct from the related paper on automatic transmit-power control.",
    sources: [piers]
  },
  "haps-terrestrial-coexistence-5-8ghz": {
    basis: "scope",
    overview: "This conference contribution concerns improving coexistence between high-altitude platforms and terrestrial systems in the 5.8 GHz band. It is part of the author's HAPS spectrum-sharing research. The separate ICCCE optimisation paper has a similar topic but a different title and publication record; the two should not be treated as interchangeable citations.",
    sources: [piers]
  },
  "optimizing-haps-terrestrial-coexistence-5-8ghz": {
    basis: "scope",
    overview: "This ICCCE paper examines coexistence optimisation for a high-altitude platform and terrestrial systems in the 5.8 GHz band. Its subject is shared-spectrum operation across aerial and terrestrial links. Use its DOI for precise citation, since the catalogue also contains a separate PIERS paper on coexistence enhancement in the same band.",
    sources: [ieee("6271337")]
  },
  "propagation-models-lte-advanced": {
    basis: "scope",
    overview: "This paper compares propagation models for LTE-Advanced systems. The topic concerns how radio-channel modelling informs estimates of path loss, coverage and network performance. It provides a propagation-focused counterpart to the author's work on spectrum coexistence and later mobile-network resource optimisation.",
    sources: [ieee("6271336")]
  },
  "atpc-haps-terrestrial-5-7ghz": {
    basis: "scope",
    overview: "This conference paper considers automatic transmit-power control as a means of facilitating spectrum sharing between HAPS and terrestrial systems. The publication title specifies the 5.7 GHz band. Its power-control focus distinguishes it from the related HAPS paper on dynamic channel assignment.",
    sources: [piers]
  }
};

export function contextText(context) {
  return [context.overview, context.approach, context.findings, context.note].filter(Boolean).join(" ");
}

// Editorial links take precedence where vocabulary alone obscures the relationship.
const curatedRelated = {
  "quantum-cognitive-radar-thermal-loss": ["cybersecure-entangled-qnn-ris-qkd", "quantum-digital-twin-threat-reversal-open-ran", "qos-quantum-entanglement-mobile-networks"],
  "digital-twin-native-ai-6g-networks": ["quantum-digital-twin-threat-reversal-open-ran", "off-grid-oran-ris-edge-energy", "quantum-load-balancing-open-ran-energy"],
  "cybersecurity-observer-power-distribution": ["quantum-digital-twin-threat-reversal-open-ran", "cybersecure-entangled-qnn-ris-qkd"],
  "high-pass-filter-overshoot-bessel-gaussian": ["fir-filter-transient-compensation", "efficient-fir-filter-fpga", "ofdm-papr-cyclic-prefix-shifting"],
  "cloud-data-center-placement-virtualized": ["quantum-load-balancing-open-ran-energy", "off-grid-oran-ris-edge-energy", "power-consumption-next-generation-open-ran"],
  "qos-quantum-entanglement-mobile-networks": ["quantum-load-balancing-open-ran-energy", "cybersecure-entangled-qnn-ris-qkd", "quantum-digital-twin-threat-reversal-open-ran"],
  "welch-dct-energy-detection-cognitive-radio": ["ofdm-papr-cyclic-prefix-shifting", "propagation-models-lte-advanced", "efficient-fir-filter-fpga"],
  "ofdm-papr-cyclic-prefix-shifting": ["welch-dct-energy-detection-cognitive-radio", "efficient-fir-filter-fpga", "propagation-models-lte-advanced"],
  "propagation-models-lte-advanced": ["optimizing-haps-terrestrial-coexistence-5-8ghz", "ofdm-papr-cyclic-prefix-shifting", "trade-offs-5g-networks-beyond"]
};

export function relatedPublications(pub, publications) {
  if (curatedRelated[pub.slug]) return curatedRelated[pub.slug].map(slug => {
    const item = publications.find(candidate => candidate.slug === slug);
    if (!item) throw new Error(`Unknown related publication: ${slug}`);
    return item;
  });
  const generic = new Set(["6g", "6g networks", "wireless networks", "wireless communications", "signal processing", "network optimisation"]);
  const terms = (p) => new Set([...p.themes, ...p.keywords].map(term => term.toLowerCase()));
  const own = terms(pub);
  return publications.filter(candidate => candidate.slug !== pub.slug)
    .map(candidate => ({ candidate, score: [...terms(candidate)].reduce((sum, term) => sum + (own.has(term) ? (generic.has(term) ? 1 : 3) : 0), 0) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || b.candidate.year - a.candidate.year || a.candidate.slug.localeCompare(b.candidate.slug, "en"))
    .slice(0, 3).map(item => item.candidate);
}
