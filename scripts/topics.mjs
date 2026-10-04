// Editorial reading guides to this author's publications, not systematic reviews.
export const topics = [
  {
    slug: "artificial-intelligence-deep-learning-networks",
    title: "Artificial Intelligence and Deep Learning for Networks",
    description: "Deep learning, attention-based optical monitoring, reinforcement learning for cybersecurity and AI-native 6G: explore DOI-linked research by Yassir AL-Karawi.",
    intro: "Artificial intelligence (AI) connects optical performance monitoring, cybersecurity and network management. This guide follows three concrete uses of learning: joint estimation and classification in optical networks, response policies in Open RAN security, and distributed quantum neural-network synchronisation.",
    sections: [
      { heading: "Deep learning and attention for optical performance monitoring", text: "MT-OPMNet uses multi-task deep learning to estimate optical signal-to-noise ratio (OSNR) and recognise modulation formats from asynchronous amplitude histograms. A shared one-dimensional convolutional neural network (CNN), channel-aware attention and two task heads combine regression and classification. The published evaluation uses simulated wavelength-division-multiplexed links and a split-step Fourier cross-check; its outcomes concern optical monitoring under those conditions.", papers: ["mt-opmnet-deep-learning-optical-monitoring"] },
      { heading: "Reinforcement learning for Open RAN cybersecurity", text: "The cybersecurity-driven quantum digital twin uses a REINFORCE policy to select responses from fidelity, entropy and trace-distance observations. This connects reinforcement learning, threat detection and digital-twin control. Read the paper for its modelled attacks and simulation conditions when citing a security or response-time result.", papers: ["quantum-digital-twin-threat-reversal-open-ran"] },
      { heading: "Quantum neural networks and AI-native 6G architectures", text: "The secure synchronisation study examines distributed quantum neural networks (QNNs), entanglement, reconfigurable intelligent surfaces and quantum key distribution. QNN synchronisation and the classical CNN in MT-OPMNet address different learning problems. The native-AI and digital-twin architecture paper provides a broader entry point to AI-enabled 6G network design.", papers: ["cybersecure-entangled-qnn-ris-qkd", "digital-twin-native-ai-6g-networks"] },
      { heading: "Choose a paper for the claim being cited", text: "For deep learning and optical monitoring, start with MT-OPMNet. For learning-based security and threat response, start with the Open RAN quantum digital twin. For secure distributed QNN synchronisation, use the RIS–QKD paper. Each record includes the published title, authors, DOI and downloadable BibTeX and RIS citations.", papers: [] }
    ]
  },
  {
    slug: "quantum-radar-and-sensing",
    title: "Quantum Radar and Adaptive Sensing",
    description: "Adaptive target detection under thermal loss, quantum illumination and entanglement: a research guide with original abstracts and DOI-linked papers.",
    intro: "How can target detection adapt when attenuation and thermal noise change? This guide starts with the author's quantum-cognitive radar paper, then separates its sensing problem from related work on quantum-state control and communications. These papers share quantum resources, but they do not evaluate the same task.",
    sections: [
      { heading: "Start with detection under thermal loss", text: "The radar study combines a two-mode squeezed-vacuum transmitter, an idler–signal receiver and a quantum neural-network controller. It evaluates detection probability at specified false-alarm probabilities and compares adaptive operation with classical and nonadaptive quantum baselines. Its evidence comes from hardware-aware simulations, not a field radar deployment.", papers: ["quantum-cognitive-radar-thermal-loss"] },
      { heading: "Distinguish sensing from quantum-state protection", text: "The quantum digital-twin paper uses fidelity, entropy and trace distance to monitor simulated adversarial perturbations. It is a related example of feedback over quantum-state observables, not an independent validation of radar detection performance. The QNN synchronisation paper instead examines distributed learning and communications with RIS and QKD.", papers: ["quantum-digital-twin-threat-reversal-open-ran", "cybersecure-entangled-qnn-ris-qkd"] },
      { heading: "Read the comparison conditions before citing a gain", text: "A detection probability is meaningful alongside its false-alarm probability, channel assumptions and resource budget. Integration-time reduction, state fidelity and communication latency are different outcomes. Follow each paper's original abstract and DOI to identify the baseline and conditions supporting a specific claim.", papers: [] }
    ]
  },
  {
    slug: "open-ran-cybersecurity",
    title: "Cybersecurity and Digital Twins in Open RAN",
    description: "Research on Open RAN quantum digital twins, learning-based security and secure QNN synchronisation, with methods, evidence limits and original sources.",
    intro: "How can a network controller detect corrupted state and respond to adversarial behaviour? This guide connects the author's Open RAN digital-twin work with secure quantum-network synchronisation. A separate power-distribution paper provides a related control-security problem, but is not an Open RAN experiment.",
    sections: [
      { heading: "Model attacks and evaluate a response policy", text: "The cybersecurity-driven quantum digital twin maps O-RAN telemetry into quantum-state representations and models attacks through bit-flip, phase-flip and amplitude-damping channels. A REINFORCE policy responds to quantum-state observables. The reported evaluation uses Qiskit simulations and software-loop timing. Its attack-classification results should not be read as field-tested protection against all network threats.", papers: ["quantum-digital-twin-threat-reversal-open-ran"] },
      { heading: "Secure synchronisation is a different objective", text: "The entangled-QNN paper combines GHZ-assisted synchronisation, RIS control and QKD-protected links in a hybrid quantum–classical model. Its evaluation concerns fidelity, synchronisation divergence and latency. These measurements complement, but cannot replace, a threat model or an assessment of attack detection.", papers: ["cybersecure-entangled-qnn-ris-qkd"] },
      { heading: "Connect architecture to control-system security", text: "The digital-twin and native-AI paper addresses 6G architecture and evaluation questions. The observer-based control paper addresses false-data injection in smart power distribution. Read their individual records for their stated scope; this guide does not attribute the Open RAN digital-twin results to either of those papers.", papers: ["digital-twin-native-ai-6g-networks", "cybersecurity-observer-power-distribution"] }
    ]
  },
  {
    slug: "energy-efficient-open-ran",
    title: "Energy-Efficient Open RAN and Edge Computing",
    description: "Solar-powered off-grid Open RAN, RIS and edge computing, virtual-machine allocation and DWDM transport: a source-linked guide to energy research.",
    intro: "Energy optimisation depends on what is being controlled: radio transmission, edge processing, virtual machines or optical wavelengths. This guide groups the author's studies by that decision and shows why their reported gains should not be added together or treated as interchangeable.",
    sections: [
      { heading: "Coordinate harvested energy, radio and edge processing", text: "The off-grid study adjusts transmit power, CPU speed and RIS phases under energy, latency and thermal constraints. Its primal–dual method responds to changing solar supply and traffic. MATLAB simulations report lower energy use and average delay than the evaluated baseline; those percentages describe that scenario, not every solar-powered deployment.", papers: ["off-grid-oran-ris-edge-energy"] },
      { heading: "Place computation and balance virtualised workloads", text: "The cloud-placement study uses particle swarm optimisation and a genetic algorithm to examine data-centre position and virtual-machine count under quality-of-service constraints. The quantum-based load-balancing study compares sequential quadratic programming with an active-set method. Its energy-efficiency result is a comparison of numerical methods, not a measured quantum-computer advantage.", papers: ["cloud-data-center-placement-virtualized", "quantum-load-balancing-open-ran-energy"] },
      { heading: "Include transport and the power-accounting boundary", text: "The DWDM backhaul paper studies wavelength allocation, pruning and latency-responsive reconfiguration. Its optical-power comparison uses static provisioning as a baseline. The power-consumption evaluation paper addresses next-generation Open RAN more broadly. Before comparing savings, check which radio, computing and transport components each study includes.", papers: ["energy-efficient-dwdm-backhaul-open-ran", "power-consumption-next-generation-open-ran"] }
    ]
  }
];

export const topicPath = (topic) => `/topics/${topic.slug}.html`;
export const topicSlugs = (topic) => [...new Set(topic.sections.flatMap(section => section.papers))];
