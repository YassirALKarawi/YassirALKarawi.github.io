// Editorial reading guides to this author's publications, not systematic reviews.
export const topics = [
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
