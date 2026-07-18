import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const siteUrl = "https://yassiralkarawi.github.io";
const author = "Yassir AL-Karawi";
const profileImage = "https://avatars.githubusercontent.com/u/214294900?v=4";

const publications = [
  {
    slug: "quantum-cognitive-radar-thermal-loss",
    title: "Quantum Cognitive Radar: Adaptive Detection With Entanglement Under Thermal-Loss Channels",
    authors: ["Yassir AL-Karawi", "Raad S. Alhumaima", "Hamed Al-Raweshidy"],
    year: 2026,
    date: "2026",
    venue: "IEEE Transactions on Aerospace and Electronic Systems",
    publisher: "IEEE",
    type: "Journal article",
    doi: "10.1109/TAES.2025.3650733",
    themes: ["Quantum & Security", "Radar & Sensing", "6G"],
    featured: true,
    summary: "An adaptive quantum-cognitive detection framework that studies entanglement-assisted radar operation under realistic thermal-loss channels."
  },
  {
    slug: "digital-twin-native-ai-6g-networks",
    title: "Digital Twin and Native-AI Empowered 6G Networks: Architectures, Applications, Evaluation, and Open Challenges",
    authors: ["Yassir AL-Karawi", "Hussein Shakor Mogheer", "Khamees Khalaf Hasan", "Ahmed Hussein Dawwd"],
    year: 2026,
    date: "2026-03-23",
    venue: "2026 International Russian Smart Industry Conference (SmartIndustryCon)",
    publisher: "IEEE",
    type: "Conference paper",
    doi: "10.1109/SmartIndustryCon68821.2026.11493034",
    themes: ["AI-Native Networks", "Digital Twins", "6G"],
    summary: "A structured view of digital-twin and native-AI architectures, applications, evaluation approaches, and open challenges for 6G networks."
  },
  {
    slug: "lossless-canonical-coding-fpga",
    title: "Lossless Canonical Coding Design with FPGA Implementation Using High-Speed Architecture",
    authors: ["Maan Hameed", "Hussein Shakor Mogheer", "Haveen Yaseen Hussein Al-Zahawi", "Yassir AL-Karawi"],
    year: 2026,
    date: "2026-03-23",
    venue: "2026 International Russian Smart Industry Conference (SmartIndustryCon)",
    publisher: "IEEE",
    type: "Conference paper",
    doi: "10.1109/SmartIndustryCon68821.2026.11493133",
    themes: ["Signal Processing", "FPGA"],
    summary: "A high-speed FPGA architecture for lossless canonical coding, with emphasis on efficient digital implementation."
  },
  {
    slug: "cybersecure-entangled-qnn-ris-qkd",
    title: "Cybersecure Synchronisation of Entangled Quantum Neural Networks With Reconfigurable Intelligent Surface and Quantum Key Distribution for 6G Holographic Communications",
    authors: ["Raad S. Alhumaima", "Yassir AL-Karawi", "Hamed Al-Raweshidy"],
    year: 2026,
    date: "2026-01",
    venue: "IET Quantum Communication",
    publisher: "Wiley / IET",
    type: "Journal article",
    doi: "10.1049/qtc2.70032",
    themes: ["Quantum & Security", "RIS & QKD", "6G"],
    featured: true,
    summary: "A secure synchronisation framework combining entangled quantum neural networks, reconfigurable intelligent surfaces, and quantum key distribution for 6G holographic communications."
  },
  {
    slug: "quantum-digital-twin-threat-reversal-open-ran",
    title: "Cybersecurity Driven Quantum Digital Twin for Proactive Threat Reversal in Open RAN",
    authors: ["Yassir AL-Karawi", "Raad S. Alhumaima", "Hamed Al-Raweshidy"],
    year: 2026,
    date: "2026-02-18",
    venue: "IET Quantum Communication",
    publisher: "Wiley / IET",
    type: "Journal article",
    doi: "10.1049/qtc2.70027",
    themes: ["Quantum & Security", "Open RAN", "Digital Twins"],
    featured: true,
    summary: "A quantum digital-twin framework designed to support proactive cybersecurity analysis and threat reversal in Open RAN."
  },
  {
    slug: "high-pass-filter-overshoot-bessel-gaussian",
    title: "Mitigating in Band Overshoot in Digital High-Pass Filters: Design and Analysis of Bessel and Gaussian Filters for Maximally Flat Step Response",
    authors: ["Hussein Shakor Mogheer", "A. T. Alrubei Mohammed", "Yassir AL-Karawi"],
    year: 2025,
    date: "2025-09-30",
    venue: "International Journal of Electrical and Electronics Research",
    publisher: "FOREX Press",
    type: "Journal article",
    doi: "10.37391/IJEER.130318",
    themes: ["Signal Processing", "Digital Filters"],
    summary: "Design and analysis of Bessel and Gaussian high-pass filters to reduce in-band overshoot while preserving a maximally flat step response."
  },
  {
    slug: "energy-efficient-dwdm-backhaul-open-ran",
    title: "Energy-Efficient Sub-Millisecond DWDM Backhaul for 6G Open RAN",
    authors: ["Ali Abduljabbar Abdulsattar", "Hussein Shakor Mogheer", "Mohammad S. Al-Abadi", "Yassir AL-Karawi"],
    year: 2025,
    date: "2025-12-20",
    venue: "International Journal of Electrical and Electronics Research",
    publisher: "FOREX Press",
    type: "Journal article",
    doi: "10.37391/IJEER.130426",
    themes: ["Open RAN", "Optical Networks", "6G"],
    summary: "An energy-efficient dense wavelength-division multiplexing backhaul design targeting sub-millisecond transport requirements in 6G Open RAN."
  },
  {
    slug: "cybersecurity-observer-power-distribution",
    title: "Cybersecurity-Aware Observer-Based Control for Smart Power Distribution Under False Data Injection Attacks",
    authors: ["Yassir AL-Karawi", "Hussein Shakor Mogheer"],
    year: 2025,
    date: "2025-09-25",
    venue: "2025 International Ural Conference on Electrical Power Engineering (UralCon)",
    publisher: "IEEE",
    type: "Conference paper",
    doi: "10.1109/UralCon67204.2025.11206666",
    themes: ["Quantum & Security", "Smart Power", "Control"],
    summary: "An observer-based control approach for improving the cybersecurity resilience of smart power-distribution systems under false-data injection attacks."
  },
  {
    slug: "fir-filter-transient-compensation",
    title: "Reducing Transient Effects in FIR Digital Filters: An Efficient Compensation Technique for Enhanced Impulse Response Stability",
    authors: ["Hussein Shakor Mogheer", "Yassir AL-Karawi"],
    year: 2025,
    date: "2025-05-12",
    venue: "2025 International Conference on Industrial Engineering, Applications and Manufacturing (ICIEAM)",
    publisher: "IEEE",
    type: "Conference paper",
    doi: "10.1109/ICIEAM65163.2025.11028159",
    themes: ["Signal Processing", "Digital Filters"],
    summary: "A compensation technique for reducing transient effects and improving impulse-response stability in finite impulse response digital filters."
  },
  {
    slug: "off-grid-oran-ris-edge-energy",
    title: "Energy-Aware Optimisation for Off-Grid ORAN With RIS and Edge Computing",
    authors: ["Yassir AL-Karawi", "Raad S. Alhumaima", "Hamed Al-Raweshidy"],
    year: 2025,
    date: "2025-01",
    venue: "IET Networks",
    publisher: "Wiley / IET",
    type: "Journal article",
    doi: "10.1049/ntw2.70012",
    themes: ["Open RAN", "RIS & QKD", "Energy Efficiency"],
    featured: true,
    summary: "An energy-aware optimisation framework for off-grid Open RAN that integrates reconfigurable intelligent surfaces and edge computing."
  },
  {
    slug: "quantum-load-balancing-open-ran-energy",
    title: "Optimizing the Energy Efficiency Using Quantum Based Load Balancing in Open Radio Access Networks",
    authors: ["Yassir AL-Karawi", "Hamed Al-Raweshidy", "Rajagopal Nilavalan"],
    year: 2024,
    date: "2024",
    venue: "IEEE Access",
    publisher: "IEEE",
    type: "Journal article",
    doi: "10.1109/ACCESS.2024.3375530",
    themes: ["Open RAN", "Quantum & Security", "Energy Efficiency"],
    featured: true,
    summary: "A quantum-based load-balancing approach developed to improve energy efficiency in Open Radio Access Networks."
  },
  {
    slug: "power-consumption-next-generation-open-ran",
    title: "Power Consumption Evaluation of Next Generation Open Radio Access Network",
    authors: ["Yassir AL-Karawi", "Hamed Al-Raweshidy", "Rajagopal Nilavalan"],
    year: 2024,
    date: "2024-02-28",
    venue: "2024 IEEE International Conference on Consumer Electronics (ICCE)",
    publisher: "IEEE",
    type: "Conference paper",
    doi: "10.1109/ICCE59016.2024.10444418",
    themes: ["Open RAN", "Energy Efficiency", "6G"],
    featured: true,
    summary: "An evaluation of power-consumption components and energy implications in next-generation Open Radio Access Network architectures."
  },
  {
    slug: "cloud-data-center-placement-virtualized",
    title: "Optimizing the Placement of Cloud Data Center in Virtualized Environment",
    authors: ["Yassir AL-Karawi", "et al."],
    year: 2022,
    date: "2022-06-01",
    venue: "International Journal of Electrical and Computer Engineering",
    publisher: "IAES",
    type: "Journal article",
    doi: "10.11591/ijece.v12i3.pp3276-3286",
    themes: ["Cloud & Edge", "Network Optimisation"],
    summary: "A study of cloud data-center placement strategies in virtualized environments, addressing network and resource-allocation considerations."
  },
  {
    slug: "qos-quantum-entanglement-mobile-networks",
    title: "Quality of Service of Quantum Entanglement in Mobile Networks",
    authors: ["Yassir AL-Karawi", "Raad S. Alhumaima", "Hamed Al-Raweshidy"],
    year: 2021,
    date: "2021",
    venue: "IEEE Access",
    publisher: "IEEE",
    type: "Journal article",
    doi: "10.1109/ACCESS.2021.3136782",
    themes: ["Quantum & Security", "Mobile Networks", "QoS"],
    featured: true,
    summary: "A quality-of-service study of quantum entanglement distribution and performance in mobile-network environments."
  },
  {
    slug: "trade-offs-5g-networks-beyond",
    title: "On the Trade-offs of 5G Networks and Beyond",
    authors: ["Yassir Ameen Ahmed Al-Karawi", "Montadar Abas Taher", "Riyadh Khlf Ahmed"],
    year: 2021,
    date: "2021-03-16",
    venue: "IOP Conference Series: Materials Science and Engineering",
    publisher: "IOP Publishing",
    type: "Conference paper",
    doi: "10.1088/1757-899X/1076/1/012066",
    themes: ["Mobile Networks", "5G & 6G"],
    summary: "An examination of engineering trade-offs that shape fifth-generation mobile networks and their evolution beyond 5G."
  },
  {
    slug: "efficient-fir-filter-fpga",
    title: "Efficient FIR Filter Architecture Using FPGA",
    authors: ["Yassir AL-Karawi", "et al."],
    year: 2019,
    date: "2019-06-03",
    venue: "Recent Patents on Computer Science",
    publisher: "Bentham Science",
    type: "Journal article",
    doi: "10.2174/2213275912666190603115506",
    themes: ["Signal Processing", "FPGA"],
    summary: "An efficient field-programmable gate array architecture for implementing finite impulse response digital filters."
  },
  {
    slug: "welch-dct-energy-detection-cognitive-radio",
    title: "On the Energy Detection Performance Based Welch's DCT Algorithm in Cognitive Radio Systems",
    authors: ["E. H. Salman", "Yassir AL-Karawi", "A. Ahmed", "M. A. Taher", "N. K. Nordin", "S. Hashim", "F. Hashim"],
    year: 2018,
    date: "2018",
    venue: "International Scientific Conference of Engineering Sciences (ISCES)",
    publisher: "IEEE",
    type: "Conference paper",
    doi: "10.1109/ISCES.2018.8340542",
    themes: ["Cognitive Radio", "Signal Processing", "Spectrum"],
    summary: "An energy-detection performance study using a Welch discrete cosine transform algorithm for cognitive-radio systems."
  },
  {
    slug: "ofdm-papr-cyclic-prefix-shifting",
    title: "Reducing PAPR of OFDM Systems Using Cyclic Prefix Shifting Algorithm",
    authors: ["Yassir A. Ahmad"],
    year: 2017,
    date: "2017",
    venue: "Indian Journal of Science and Technology",
    publisher: "Indian Society for Education and Environment",
    type: "Journal article",
    doi: "10.17485/IJST/2017/V10I33/108085",
    themes: ["OFDM", "Signal Processing"],
    summary: "A cyclic-prefix shifting algorithm for reducing the peak-to-average power ratio in orthogonal frequency-division multiplexing systems."
  },
  {
    slug: "dca-haps-terrestrial-5850-7075",
    title: "Applicability of DCA in HAPS-Based Systems in the 5850–7075 MHz Band",
    authors: ["M. Mokayef", "W. A. Hassan", "Y. A. Ahmad", "T. A. Rahman"],
    year: 2012,
    date: "2012",
    venue: "Progress in Electromagnetics Research Symposium",
    publisher: "PIERS",
    type: "Conference paper",
    themes: ["HAPS", "Spectrum Coexistence"],
    summary: "An assessment of dynamic channel assignment for high-altitude platform systems sharing spectrum in the 5850–7075 MHz band."
  },
  {
    slug: "haps-terrestrial-coexistence-5-8ghz",
    title: "Enhancement of Coexistence Between HAPS and Terrestrial System in 5.8 GHz Band",
    authors: ["M. Mokayef", "W. A. Hassan", "Y. A. Ahmad", "T. A. Rahman"],
    year: 2012,
    date: "2012",
    venue: "Progress in Electromagnetics Research Symposium",
    publisher: "PIERS",
    type: "Conference paper",
    themes: ["HAPS", "Spectrum Coexistence"],
    summary: "Techniques for enhancing coexistence between high-altitude platform stations and terrestrial systems operating in the 5.8 GHz band."
  },
  {
    slug: "optimizing-haps-terrestrial-coexistence-5-8ghz",
    title: "Optimizing the Coexistence Between HAPS Platform and Terrestrial System in 5.8 GHz Band",
    authors: ["M. Mokayef", "W. A. Hassan", "T. A. Rahman", "Y. A. Ahmad"],
    year: 2012,
    date: "2012",
    venue: "2012 International Conference on Computer and Communication Engineering (ICCCE)",
    publisher: "IEEE",
    type: "Conference paper",
    doi: "10.1109/ICCCE.2012.6271337",
    themes: ["HAPS", "Spectrum Coexistence", "Network Optimisation"],
    summary: "An optimisation study for spectrum coexistence between a high-altitude platform and terrestrial systems in the 5.8 GHz band."
  },
  {
    slug: "propagation-models-lte-advanced",
    title: "Studying Different Propagation Models for LTE-A System",
    authors: ["Yassir Ameen Ahmed AL-Karawi", "Walid A. Hassan", "Tharek Abdul Rahman"],
    year: 2012,
    date: "2012",
    venue: "2012 International Conference on Computer and Communication Engineering (ICCCE)",
    publisher: "IEEE",
    type: "Conference paper",
    doi: "10.1109/ICCCE.2012.6271336",
    themes: ["Mobile Networks", "Propagation", "LTE-A"],
    summary: "A comparative study of radio-propagation models used to characterize coverage and performance in LTE-Advanced systems."
  },
  {
    slug: "atpc-haps-terrestrial-5-7ghz",
    title: "Utilizing ATPC Scheme to Facilitate Sharing Between HAPS and Terrestrial in 5.7 GHz Band",
    authors: ["M. Mokayef", "W. A. Hassan", "Y. A. Ahmad", "T. A. Rahman"],
    year: 2012,
    date: "2012",
    venue: "Progress in Electromagnetics Research Symposium",
    publisher: "PIERS",
    type: "Conference paper",
    themes: ["HAPS", "Spectrum Coexistence", "Power Control"],
    summary: "Application of automatic transmit power control to facilitate spectrum sharing between high-altitude platform and terrestrial systems in the 5.7 GHz band."
  }
];

const projects = [
  {
    title: "Q-ROC",
    kicker: "Certificate-bound Open 6G RAN auditing",
    url: "https://github.com/YassirALKarawi/q-roc-open6g-ran",
    description: "A reproducible architecture and evidence package for coherent-order auditing of xApp actions in Open 6G RAN.",
    facts: ["9,216 finite states", "120 action pairs", "Reproducible evidence"]
  },
  {
    title: "KPM-Bridge",
    kicker: "Portable AI xApp telemetry",
    url: "https://github.com/YassirALKarawi/kpm-bridge-open6g-ran",
    description: "An uncertainty-aware telemetry fabric that maps heterogeneous E2SM-KPM reports to certified canonical contracts.",
    facts: ["201,912 samples", "8 canonical features", "48-byte certificate"]
  },
  {
    title: "Trust-Aware ISAC Simulator",
    kicker: "Digital-twin control for 6G Open RAN",
    url: "https://github.com/YassirALKarawi/trust-aware-isac-sim",
    description: "A seeded reference simulator for trust-aware, quantum-assisted digital-twin control in secure and adaptive ISAC.",
    facts: ["Python 3.10+", "Audited claims", "Publication figures"]
  }
];

const profiles = [
  ["Google Scholar", "Citation profile", "https://scholar.google.com/citations?user=Dg_tAlkAAAAJ&hl=en"],
  ["ORCID", "0000-0003-2959-3893", "https://orcid.org/0000-0003-2959-3893"],
  ["Scopus", "Author ID 58954746100", "https://www.scopus.com/authid/detail.uri?authorId=58954746100"],
  ["Web of Science", "ResearcherID O-2498-2016", "https://www.webofscience.com/wos/author/record/O-2498-2016"],
  ["Semantic Scholar", "AI-powered research profile", "https://www.semanticscholar.org/author/Yassir-Al%E2%80%90Karawi/1414260996"],
  ["GitHub", "@YassirALKarawi", "https://github.com/YassirALKarawi"],
  ["LinkedIn", "Professional profile", "https://www.linkedin.com/in/yassir-ameen-al-karawi-67501243/"],
  ["University of Diyala", "Institutional profile", "https://engineering.uodiyala.edu.iq/?page_id=34421&lang=en"]
];

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeJsonLd(value, space) {
  return JSON.stringify(value, null, space)
    .replaceAll("&", "\\u0026")
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e");
}

function cleanDoi(doi = "") {
  return doi.toLowerCase().replaceAll("/", "_").replaceAll(".", "-");
}

function doiUrl(pub) {
  return pub.doi ? `https://doi.org/${pub.doi}` : "";
}

function bibtex(pub) {
  const firstAuthor = pub.authors[0].replace(/[^A-Za-z0-9]/g, "").slice(-18) || "AlKarawi";
  const key = `${firstAuthor}${pub.year}${pub.slug.split("-").slice(0, 2).join("")}`;
  const type = pub.type === "Journal article" ? "article" : "inproceedings";
  const venueField = pub.type === "Journal article" ? "journal" : "booktitle";
  const lines = [
    `@${type}{${key},`,
    `  title     = {${pub.title}},`,
    `  author    = {${pub.authors.join(" and ")}},`,
    `  ${venueField.padEnd(9)} = {${pub.venue}},`,
    `  year      = {${pub.year}},`
  ];
  if (pub.doi) lines.push(`  doi       = {${pub.doi}},`);
  lines.push(`  url       = {${doiUrl(pub) || `${siteUrl}/research/${pub.slug}.html`}}`);
  lines.push("}");
  return lines.join("\n");
}

function icon(name) {
  const paths = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Z"/><path d="M8 7h8M8 11h6"/>',
    code: '<path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/>',
    id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.7-1.5 1.7-2 3-2s2.3.5 3 2M14 10h4M14 14h4"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    network: '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="m11 7-5 9M13 7l5 9M7 18h10"/>'
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.arrow}</svg>`;
}

function head({ title, description, canonical = "/", extra = "", image = "/assets/og-card.svg" }) {
  const url = `${siteUrl}${canonical}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="author" content="${author}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <link rel="canonical" href="${url}">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="stylesheet" href="/assets/styles.css">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${siteUrl}${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${siteUrl}${image}">
  ${extra}
</head>`;
}

function nav(active = "") {
  const links = [
    ["Home", "/"],
    ["Research", "/#research"],
    ["Publications", "/publications.html"],
    ["Open science", "/#open-science"],
    ["Profiles", "/#profiles"]
  ];
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container nav-shell">
    <a class="wordmark" href="/" aria-label="Yassir AL-Karawi home">
      <span class="wordmark-mark">YA</span>
      <span><strong>Yassir AL-Karawi</strong><small>Communications Engineering</small></span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span></span><span></span><span></span><b>Menu</b></button>
    <nav id="site-nav" class="site-nav" aria-label="Primary navigation">
      ${links.map(([label, href]) => `<a ${active === label ? 'aria-current="page"' : ""} href="${href}">${label}</a>`).join("")}
      <a class="nav-cta" href="mailto:yassir_al-karawi_eng@uodiyala.edu.iq">Contact ${icon("arrow")}</a>
    </nav>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <a class="wordmark footer-mark" href="/"><span class="wordmark-mark">YA</span><span><strong>Yassir AL-Karawi</strong><small>Assistant Professor · University of Diyala</small></span></a>
      <p class="footer-note">Research in Open RAN, 5G/6G, quantum communications, AI-native networks, wireless systems, and optical communications.</p>
    </div>
    <div><h2>Academic identity</h2><a href="https://orcid.org/0000-0003-2959-3893">ORCID</a><a href="https://scholar.google.com/citations?user=Dg_tAlkAAAAJ&amp;hl=en">Google Scholar</a><a href="https://www.scopus.com/authid/detail.uri?authorId=58954746100">Scopus</a></div>
    <div><h2>Connect</h2><a href="https://github.com/YassirALKarawi">GitHub</a><a href="https://www.linkedin.com/in/yassir-ameen-al-karawi-67501243/">LinkedIn</a><a href="mailto:yassir_al-karawi_eng@uodiyala.edu.iq">Email</a></div>
  </div>
  <div class="container footer-bottom"><span>© <span data-year></span> Yassir AL-Karawi</span><span>Recommended citation name: <strong>Yassir AL-Karawi</strong></span></div>
</footer>
<script src="/assets/app.js?v=2" defer></script>`;
}

function pageEnd() {
  return `${footer()}</body>\n</html>`;
}

function tags(items) {
  return `<div class="tags">${items.map(item => `<span>${escapeHtml(item)}</span>`).join("")}</div>`;
}

function publicationCard(pub, compact = false) {
  return `<article class="publication-card${compact ? " compact" : ""}" data-publication data-year="${pub.year}" data-type="${escapeHtml(pub.type)}" data-theme="${escapeHtml(pub.themes.join(" "))}" data-search="${escapeHtml(`${pub.title} ${pub.authors.join(" ")} ${pub.venue} ${pub.themes.join(" ")} ${pub.doi || ""}`.toLowerCase())}">
    <div class="pub-top"><span class="pub-year">${pub.year}</span><span class="pub-type">${escapeHtml(pub.type)}</span></div>
    <h3><a href="/research/${pub.slug}.html">${escapeHtml(pub.title)}</a></h3>
    <p class="pub-authors">${escapeHtml(pub.authors.join(" · "))}</p>
    <p class="pub-venue">${escapeHtml(pub.venue)}</p>
    ${compact ? "" : `<p class="pub-summary">${escapeHtml(pub.summary)}</p>${tags(pub.themes)}`}
    <div class="pub-actions">
      <a href="/research/${pub.slug}.html">Record ${icon("arrow")}</a>
      ${pub.doi ? `<a href="${doiUrl(pub)}">DOI ${icon("external")}</a>` : ""}
      <button class="copy-citation" type="button" data-copy="${escapeHtml(bibtex(pub))}">BibTeX</button>
    </div>
  </article>`;
}

function homePage() {
  const featured = publications.filter(p => p.featured).slice(0, 6);
  const personJson = safeJsonLd({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: author,
    alternateName: ["Yassir Al-Karawi", "Yassir Ameen Ahmed Al-Karawi", "Y. AL-Karawi", "Yassir A. Ahmad", "YA Ahmad", "Karawi-AL Yassir"],
    honorificPrefix: "Dr.",
    jobTitle: "Assistant Professor of Communications Engineering",
    image: profileImage,
    url: siteUrl,
    email: "mailto:yassir_al-karawi_eng@uodiyala.edu.iq",
    affiliation: { "@type": "CollegeOrUniversity", name: "University of Diyala", url: "https://uodiyala.edu.iq/" },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Brunel University London" },
      { "@type": "CollegeOrUniversity", name: "Universiti Teknologi Malaysia" },
      { "@type": "CollegeOrUniversity", name: "University of Technology, Iraq" }
    ],
    sameAs: profiles.map(profile => profile[2]),
    identifier: [
      { "@type": "PropertyValue", propertyID: "ORCID", value: "0000-0003-2959-3893" },
      { "@type": "PropertyValue", propertyID: "Scopus Author ID", value: "58954746100" },
      { "@type": "PropertyValue", propertyID: "ResearcherID", value: "O-2498-2016" },
      { "@type": "PropertyValue", propertyID: "OpenAlex", value: "A5012826964" }
    ],
    knowsAbout: ["Open RAN", "5G", "6G", "Quantum Communications", "Quantum Key Distribution", "Integrated Sensing and Communication", "Digital Twins", "Optical Networks", "Wireless Communications"]
  }, 2);
  const description = "Academic homepage of Dr. Yassir AL-Karawi, Assistant Professor of Communications Engineering at the University of Diyala, researching Open RAN, 5G/6G, quantum communications, AI-native networks, and optical systems.";
  return `${head({ title: "Dr. Yassir AL-Karawi | Communications Engineering Researcher", description, extra: `<link rel="me" href="https://orcid.org/0000-0003-2959-3893"><script type="application/ld+json">${personJson}</script>` })}
<body>${nav("Home")}
<main id="main">
  <section class="hero">
    <div class="hero-mesh" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
    <div class="container hero-grid">
      <div class="hero-copy">
        <p class="eyebrow"><span></span> Communications Engineering · Open 6G RAN</p>
        <h1>Engineering trustworthy communication systems for the <em>6G era.</em></h1>
        <p class="hero-lead">I am <strong>Dr. Yassir AL-Karawi</strong>, Assistant Professor at the University of Diyala. My work connects Open RAN, quantum communications, AI-native networks, digital twins, wireless systems, and optical transport.</p>
        <div class="hero-actions"><a class="button primary" href="/publications.html">Explore publications ${icon("arrow")}</a><a class="button secondary" href="https://scholar.google.com/citations?user=Dg_tAlkAAAAJ&amp;hl=en">Google Scholar ${icon("external")}</a></div>
        <div class="identity-line"><span>ORCID</span><a href="https://orcid.org/0000-0003-2959-3893">0000-0003-2959-3893</a><i></i><span>IEEE member</span></div>
      </div>
      <aside class="hero-profile" aria-label="Academic profile">
        <div class="profile-orbit"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><img src="${profileImage}" alt="Dr. Yassir AL-Karawi" width="320" height="320"></div>
        <div class="profile-caption"><p>Assistant Professor</p><strong>Department of Communications Engineering</strong><span>College of Engineering · University of Diyala · Iraq</span></div>
      </aside>
    </div>
    <div class="container stat-rail"><div><strong>${publications.length}</strong><span>Works catalogued</span></div><div><strong>2012–2026</strong><span>Publication record</span></div><div><strong>${projects.length}</strong><span>Open research artifacts</span></div><div><strong>4</strong><span>Persistent author IDs</span></div></div>
  </section>

  <section class="section intro-section">
    <div class="container split-intro">
      <div><p class="section-label">Research perspective</p><h2>From physical links to certified network intelligence.</h2></div>
      <div><p>My research examines how future communication systems can become more energy-aware, secure, interoperable, and trustworthy. The work spans physical-layer and optical transport problems through to Open RAN control, quantum-enabled networking, and reproducible AI-native architectures.</p><a class="text-link" href="#research">View research themes ${icon("arrow")}</a></div>
    </div>
  </section>

  <section class="section research-section" id="research">
    <div class="container"><div class="section-heading"><div><p class="section-label">Research themes</p><h2>A connected research programme</h2></div><p>Five technical directions linked by a common focus on measurable performance, security, interoperability, and reproducibility.</p></div>
      <div class="research-grid">
        <article class="research-card featured-theme"><span class="theme-index">01</span>${icon("network")}<h3>Open RAN &amp; 6G control</h3><p>Energy-aware optimisation, xApp coordination, E2 telemetry portability, Near-RT RIC control, and certified network decision processes.</p><div class="signal-line"><i></i><i></i><i></i><i></i><i></i></div></article>
        <article class="research-card"><span class="theme-index">02</span><h3>Quantum communications</h3><p>Entanglement quality, QKD-assisted security, quantum-aware networking, and thermal-loss channel modelling.</p></article>
        <article class="research-card"><span class="theme-index">03</span><h3>AI-native digital twins</h3><p>Trust-aware digital twins, native-AI architectures, uncertainty certificates, and reproducible learning workflows.</p></article>
        <article class="research-card"><span class="theme-index">04</span><h3>Wireless &amp; spectrum systems</h3><p>5G/6G mobile networks, cognitive radio, propagation, OFDM, HAPS coexistence, and spectrum-sharing optimisation.</p></article>
        <article class="research-card"><span class="theme-index">05</span><h3>Optical networks &amp; signal processing</h3><p>DWDM transport, optical-network monitoring, digital-filter design, FPGA architectures, and communication backhaul.</p></article>
      </div>
    </div>
  </section>

  <section class="section publication-section">
    <div class="container"><div class="section-heading"><div><p class="section-label">Selected publications</p><h2>Recent work</h2></div><a class="button secondary dark" href="/publications.html">All ${publications.length} works ${icon("arrow")}</a></div>
      <div class="featured-publications">${featured.map(pub => publicationCard(pub, true)).join("")}</div>
    </div>
  </section>

  <section class="section open-science" id="open-science">
    <div class="container"><div class="section-heading light"><div><p class="section-label">Open science</p><h2>Research artifacts built to be inspected and reused.</h2></div><p>Versioned code, pinned evidence, machine-readable results, automated checks, and publication-grade figures.</p></div>
      <div class="project-grid">${projects.map((project, index) => `<article class="project-card"><span class="project-number">0${index + 1}</span><p>${escapeHtml(project.kicker)}</p><h3>${escapeHtml(project.title)}</h3><div>${escapeHtml(project.description)}</div>${tags(project.facts)}<a href="${project.url}">Open repository ${icon("external")}</a></article>`).join("")}</div>
    </div>
  </section>

  <section class="section journey-section">
    <div class="container"><div class="section-heading"><div><p class="section-label">Academic path</p><h2>Education &amp; affiliation</h2></div><p>A communications-engineering pathway spanning Iraq, Malaysia, and the United Kingdom.</p></div>
      <div class="timeline">
        <article><span>2024</span><div><h3>Ph.D., Electronic &amp; Electrical Engineering</h3><p>Brunel University London · Thesis on quality of service in quantum-oriented Open RAN for 5G and 6G.</p></div></article>
        <article><span>2012</span><div><h3>M.Sc., Communications Engineering</h3><p>Universiti Teknologi Malaysia.</p></div></article>
        <article><span>2006–present</span><div><h3>University of Diyala</h3><p>Department of Communications Engineering, College of Engineering.</p></div></article>
        <article><span>2002</span><div><h3>B.Sc., Electronics &amp; Communications Engineering</h3><p>University of Technology, Iraq.</p></div></article>
      </div>
    </div>
  </section>

  <section class="section profiles-section" id="profiles">
    <div class="container"><div class="section-heading"><div><p class="section-label">Verified identity</p><h2>Research profiles</h2></div><p>Persistent identifiers and official profiles connecting publications across scholarly databases.</p></div>
      <div class="profile-grid">${profiles.map(([name, id, url]) => `<a class="profile-link" href="${escapeHtml(url)}"><span>${icon("id")}</span><div><strong>${escapeHtml(name)}</strong><small>${escapeHtml(id)}</small></div>${icon("external")}</a>`).join("")}</div>
    </div>
  </section>

  <section class="contact-band"><div class="container"><div><p class="section-label">Research &amp; collaboration</p><h2>Interested in Open RAN, quantum communications, or trustworthy 6G systems?</h2></div><a class="button primary warm" href="mailto:yassir_al-karawi_eng@uodiyala.edu.iq">Start a conversation ${icon("mail")}</a></div></section>
</main>${pageEnd()}`;
}

function publicationsPage() {
  const years = [...new Set(publications.map(p => p.year))].sort((a, b) => b - a);
  const types = [...new Set(publications.map(p => p.type))];
  const themes = [...new Set(publications.flatMap(p => p.themes))].sort();
  const description = `Complete publication record for ${author}: ${publications.length} journal articles and conference papers in Open RAN, 5G/6G, quantum communications, wireless systems, optical networks, and signal processing.`;
  const graph = safeJsonLd({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${author} — Publications`,
    url: `${siteUrl}/publications.html`,
    mainEntity: publications.map(pub => ({ "@type": "ScholarlyArticle", headline: pub.title, datePublished: pub.date, author: pub.authors.map(name => ({ "@type": "Person", name })), isPartOf: { "@type": "Periodical", name: pub.venue }, sameAs: doiUrl(pub) || `${siteUrl}/research/${pub.slug}.html` }))
  });
  return `${head({ title: `Publications | ${author}`, description, canonical: "/publications.html", extra: `<script type="application/ld+json">${graph}</script>` })}
<body>${nav("Publications")}
<main id="main">
  <section class="page-hero"><div class="container"><p class="eyebrow"><span></span> Scholarly record · Updated July 2026</p><h1>Publications</h1><p>A machine-readable catalogue of ${publications.length} works across communications engineering, Open RAN, quantum networks, wireless systems, optical transport, and signal processing.</p></div></section>
  <section class="publication-browser"><div class="container">
    <div class="filter-panel">
      <label class="search-box"><span>Search title, author, venue, DOI, or topic</span><input type="search" id="publication-search" placeholder="e.g. Open RAN, quantum, IEEE Access"><b>${icon("book")}</b></label>
      <div class="filter-groups"><label>Year<select id="year-filter"><option value="all">All years</option>${years.map(year => `<option value="${year}">${year}</option>`).join("")}</select></label><label>Type<select id="type-filter"><option value="all">All types</option>${types.map(type => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join("")}</select></label><label>Theme<select id="theme-filter"><option value="all">All themes</option>${themes.map(theme => `<option value="${escapeHtml(theme)}">${escapeHtml(theme)}</option>`).join("")}</select></label></div>
      <div class="result-row"><p><strong id="result-count">${publications.length}</strong> works shown</p><button type="button" id="clear-filters">Clear filters</button></div>
    </div>
    <div class="publication-list" id="publication-list">${publications.map(pub => publicationCard(pub)).join("")}</div>
    <div class="no-results" id="no-results" hidden><h2>No matching publication</h2><p>Try a broader keyword or clear the filters.</p></div>
    <aside class="data-note" aria-label="Citation metrics"><div>${icon("id")}</div><div><h2>Live citation metrics</h2><p>Citation counts change continuously. For current totals, use the linked Google Scholar, Scopus, Web of Science, and Semantic Scholar profiles.</p></div><a href="https://scholar.google.com/citations?user=Dg_tAlkAAAAJ&amp;hl=en">Open Google Scholar ${icon("external")}</a></aside>
  </div></section>
</main>${pageEnd()}`;
}

function publicationPage(pub) {
  const related = publications.filter(candidate => candidate.slug !== pub.slug && candidate.themes.some(theme => pub.themes.includes(theme))).slice(0, 3);
  const canonical = `/research/${pub.slug}.html`;
  const citationMeta = [
    `<meta name="citation_title" content="${escapeHtml(pub.title)}">`,
    ...pub.authors.filter(name => name !== "et al.").map(name => `<meta name="citation_author" content="${escapeHtml(name)}">`),
    `<meta name="citation_publication_date" content="${escapeHtml(pub.date)}">`,
    `<meta name="${pub.type === "Journal article" ? "citation_journal_title" : "citation_conference_title"}" content="${escapeHtml(pub.venue)}">`,
    pub.doi ? `<meta name="citation_doi" content="${escapeHtml(pub.doi)}">` : "",
    `<meta name="citation_language" content="en">`
  ].join("\n  ");
  const scholarlyJson = safeJsonLd({
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "@id": `${siteUrl}${canonical}#article`,
    headline: pub.title,
    name: pub.title,
    description: pub.summary,
    datePublished: pub.date,
    author: pub.authors.filter(name => name !== "et al.").map(name => ({ "@type": "Person", name, ...(name.includes("Karawi") || name.includes("Ahmad") ? { sameAs: "https://orcid.org/0000-0003-2959-3893" } : {}) })),
    publisher: { "@type": "Organization", name: pub.publisher },
    isPartOf: { "@type": pub.type === "Journal article" ? "Periodical" : "PublicationVolume", name: pub.venue },
    identifier: pub.doi ? `https://doi.org/${pub.doi}` : undefined,
    sameAs: doiUrl(pub) || undefined,
    keywords: pub.themes.join(", "),
    url: `${siteUrl}${canonical}`
  });
  const description = `${pub.title}. ${pub.type} by ${pub.authors.join(", ")}, published in ${pub.venue} (${pub.year})${pub.doi ? `, DOI ${pub.doi}` : ""}.`;
  return `${head({ title: `${pub.title} | ${author}`, description, canonical, extra: `${citationMeta}<script type="application/ld+json">${scholarlyJson}</script>` })}
<body>${nav("Publications")}
<main id="main">
  <section class="record-hero"><div class="container record-grid"><div><a class="back-link" href="/publications.html">${icon("arrow")} All publications</a><div class="record-meta"><span>${pub.year}</span><span>${escapeHtml(pub.type)}</span><span>${escapeHtml(pub.publisher)}</span></div><h1>${escapeHtml(pub.title)}</h1><p class="record-authors">${escapeHtml(pub.authors.join(" · "))}</p><p class="record-venue">${escapeHtml(pub.venue)}</p>${tags(pub.themes)}<div class="record-actions">${pub.doi ? `<a class="button primary" href="${doiUrl(pub)}">Open publisher record ${icon("external")}</a>` : ""}<button class="button secondary copy-citation" type="button" data-copy="${escapeHtml(bibtex(pub))}">Copy BibTeX</button></div></div><aside class="record-id" aria-label="Publication identifiers"><span>Persistent record</span>${pub.doi ? `<strong>DOI</strong><a href="${doiUrl(pub)}">${escapeHtml(pub.doi)}</a>` : `<strong>Indexed record</strong><p>No DOI is recorded for this conference item.</p>`}<i></i><strong>Author identity</strong><a href="https://orcid.org/0000-0003-2959-3893">ORCID 0000-0003-2959-3893</a></aside></div></section>
  <section class="section record-body"><div class="container record-content"><article><p class="section-label">Research context</p><h2>About this work</h2><p class="record-summary">${escapeHtml(pub.summary)}</p><div class="citation-block"><div><h2>Citation</h2><p>Use the DOI whenever available to ensure that citations are attributed to the canonical publication record.</p></div><pre><code>${escapeHtml(bibtex(pub))}</code></pre><button class="copy-citation" type="button" data-copy="${escapeHtml(bibtex(pub))}">Copy BibTeX</button></div></article><aside class="record-aside" aria-label="Publication discovery links"><h2>Discoverability</h2><a href="https://scholar.google.com/scholar?q=${encodeURIComponent(pub.title)}">Search in Google Scholar ${icon("external")}</a><a href="https://api.openalex.org/works/${pub.doi ? `https://doi.org/${pub.doi}` : ""}">OpenAlex lookup ${icon("external")}</a><a href="https://www.semanticscholar.org/search?q=${encodeURIComponent(pub.title)}">Semantic Scholar search ${icon("external")}</a><a href="https://orcid.org/0000-0003-2959-3893">Author ORCID ${icon("external")}</a></aside></div></section>
  ${related.length ? `<section class="section related-section"><div class="container"><div class="section-heading"><div><p class="section-label">Related work</p><h2>Explore connected publications</h2></div></div><div class="featured-publications">${related.map(item => publicationCard(item, true)).join("")}</div></div></section>` : ""}
</main>${pageEnd()}`;
}

const styles = `:root{--ink:#10253d;--ink-2:#24415e;--muted:#66788c;--paper:#f7f5ef;--white:#fff;--line:#dce2e6;--blue:#00629b;--teal:#078b8a;--mint:#d9efeb;--orange:#e67832;--night:#0b1f33;--max:1180px;--shadow:0 20px 55px rgba(17,44,68,.11)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--ink);background:var(--paper);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.62;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}button,input,select{font:inherit}.container{width:min(calc(100% - 40px),var(--max));margin-inline:auto}.skip-link{position:absolute;left:-999px;top:12px;padding:10px 14px;background:var(--night);color:#fff;z-index:999}.skip-link:focus{left:12px}.site-header{position:sticky;top:0;z-index:100;background:rgba(247,245,239,.92);backdrop-filter:blur(18px);border-bottom:1px solid rgba(16,37,61,.1)}.nav-shell{min-height:76px;display:flex;align-items:center;justify-content:space-between;gap:24px}.wordmark{display:flex;align-items:center;gap:12px}.wordmark-mark{width:40px;height:40px;border:1px solid var(--ink);display:grid;place-items:center;font-size:.78rem;font-weight:850;letter-spacing:.04em}.wordmark strong,.wordmark small{display:block}.wordmark strong{font-size:.95rem;line-height:1.2}.wordmark small{font-size:.67rem;color:var(--muted);margin-top:3px;letter-spacing:.03em}.site-nav{display:flex;align-items:center;gap:26px;font-size:.85rem;font-weight:650}.site-nav>a:not(.nav-cta){position:relative}.site-nav>a[aria-current=page]:not(.nav-cta)::after{content:"";position:absolute;height:2px;background:var(--orange);left:0;right:0;bottom:-10px}.nav-cta{display:inline-flex;align-items:center;gap:8px;background:var(--ink);color:#fff;padding:10px 15px}.nav-cta svg,.button svg,.text-link svg,.pub-actions svg,.profile-link>svg,.project-card>a svg,.record-aside a svg,.back-link svg{width:17px;height:17px}.nav-toggle{display:none;border:0;background:transparent;padding:8px}.nav-toggle span{width:23px;height:2px;background:var(--ink);display:block;margin:5px}.nav-toggle b{position:absolute;clip:rect(0 0 0 0)}.hero{position:relative;overflow:hidden;background:var(--paper);padding:90px 0 0}.hero::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent 49.8%,rgba(16,37,61,.045) 50%,transparent 50.2%),linear-gradient(rgba(16,37,61,.035) 1px,transparent 1px);background-size:100% 100%,100% 32px;pointer-events:none}.hero-grid{position:relative;z-index:2;display:grid;grid-template-columns:1.28fr .72fr;gap:82px;align-items:center}.eyebrow,.section-label{margin:0 0 20px;text-transform:uppercase;font-size:.72rem;font-weight:850;letter-spacing:.17em}.eyebrow{display:flex;align-items:center;gap:10px;color:var(--ink-2)}.eyebrow span{width:30px;height:2px;background:var(--orange)}h1,h2,h3,p{margin-top:0}.hero h1,.page-hero h1,.record-hero h1{font-family:Georgia,"Times New Roman",serif;font-weight:500;letter-spacing:-.045em}.hero h1{font-size:clamp(3.3rem,6.7vw,6.75rem);line-height:.92;margin-bottom:32px;max-width:900px}.hero h1 em{font-weight:400;color:var(--teal)}.hero-lead{font-size:1.14rem;color:var(--ink-2);max-width:700px}.hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:34px}.button{min-height:48px;display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:12px 18px;border:1px solid transparent;font-weight:750;font-size:.88rem;cursor:pointer}.button.primary{background:var(--blue);color:#fff}.button.secondary{border-color:var(--ink);color:var(--ink);background:transparent}.button.secondary.dark{border-color:var(--ink)}.button.warm{background:var(--orange)}.identity-line{display:flex;align-items:center;gap:12px;margin-top:25px;font-size:.76rem;color:var(--muted);flex-wrap:wrap}.identity-line a{font-weight:750;color:var(--ink)}.identity-line i{width:1px;height:16px;background:var(--line)}.hero-profile{align-self:end}.profile-orbit{position:relative;width:min(100%,390px);aspect-ratio:1;margin-inline:auto}.profile-orbit img{position:absolute;width:70%;height:70%;object-fit:cover;object-position:center;border-radius:50%;left:15%;top:15%;filter:saturate(.72) contrast(1.03);box-shadow:var(--shadow)}.orbit{position:absolute;border:1px solid rgba(0,98,155,.25);border-radius:50%}.orbit-one{inset:5%}.orbit-two{inset:0 14%;transform:rotate(48deg);border-color:rgba(230,120,50,.38)}.profile-orbit::after{content:"";position:absolute;width:12px;height:12px;border-radius:50%;background:var(--orange);right:11%;top:17%;box-shadow:0 0 0 9px rgba(230,120,50,.13)}.profile-caption{background:var(--night);color:#fff;padding:24px;position:relative;margin-top:-14px}.profile-caption p{color:#7fcac3;text-transform:uppercase;letter-spacing:.15em;font-size:.68rem;font-weight:800;margin-bottom:8px}.profile-caption strong,.profile-caption span{display:block}.profile-caption strong{font-family:Georgia,serif;font-size:1.2rem}.profile-caption span{color:#adc0cf;font-size:.8rem;margin-top:4px}.hero-mesh span{position:absolute;border:1px solid rgba(0,98,155,.12);border-radius:50%;width:660px;height:660px;right:-320px;top:-260px}.hero-mesh span:nth-child(2){transform:scale(.78)}.hero-mesh span:nth-child(3){transform:scale(.56)}.hero-mesh span:nth-child(4){transform:scale(.34)}.stat-rail{position:relative;z-index:3;display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line);margin-top:72px}.stat-rail>div{padding:28px 22px 30px;border-right:1px solid var(--line)}.stat-rail>div:first-child{border-left:1px solid var(--line)}.stat-rail strong,.stat-rail span{display:block}.stat-rail strong{font-family:Georgia,serif;font-size:1.6rem;font-weight:500}.stat-rail span{font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-top:5px}.section{padding:94px 0}.split-intro{display:grid;grid-template-columns:1fr 1fr;gap:100px}.section-label{color:var(--blue)}.split-intro h2,.section-heading h2{font-family:Georgia,serif;font-size:clamp(2.15rem,4vw,4rem);font-weight:500;letter-spacing:-.04em;line-height:1.05;margin-bottom:0}.split-intro>div:last-child{padding-top:44px;color:var(--ink-2);font-size:1.05rem}.text-link{display:inline-flex;align-items:center;gap:9px;border-bottom:1px solid var(--ink);font-weight:750;color:var(--ink);font-size:.86rem;padding-bottom:5px;margin-top:12px}.research-section{background:var(--white)}.section-heading{display:flex;align-items:end;justify-content:space-between;gap:50px;margin-bottom:48px}.section-heading>p{max-width:470px;color:var(--muted);margin-bottom:4px}.research-grid{display:grid;grid-template-columns:1.25fr .75fr .75fr;grid-auto-rows:minmax(260px,auto);gap:1px;background:var(--line);border:1px solid var(--line)}.research-card{background:var(--white);padding:36px;position:relative;overflow:hidden}.research-card h3{font-family:Georgia,serif;font-size:1.5rem;font-weight:500;line-height:1.1;margin-top:52px}.research-card p{color:var(--muted);font-size:.9rem}.theme-index{position:absolute;top:27px;right:30px;font-size:.72rem;color:var(--muted)}.featured-theme{grid-row:span 2;background:var(--night);color:#fff}.featured-theme>svg{width:70px;height:70px;color:#75cac2;margin-top:20px}.featured-theme h3{font-size:2.45rem;margin-top:60px}.featured-theme p{color:#adc0cf;font-size:1rem}.signal-line{display:flex;align-items:end;gap:9px;height:68px;margin-top:42px}.signal-line i{width:4px;background:var(--orange);height:25%}.signal-line i:nth-child(2){height:60%}.signal-line i:nth-child(3){height:95%}.signal-line i:nth-child(4){height:50%}.signal-line i:nth-child(5){height:75%}.publication-section{background:var(--paper)}.featured-publications{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.publication-card{background:#fff;border:1px solid var(--line);padding:26px;display:flex;flex-direction:column;min-height:100%}.publication-card.compact{min-height:360px}.pub-top{display:flex;justify-content:space-between;gap:10px;align-items:center;font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:28px}.pub-year{color:var(--blue);font-weight:850}.publication-card h3{font-family:Georgia,serif;font-size:1.35rem;font-weight:500;line-height:1.18;margin-bottom:14px}.publication-card h3 a:hover{color:var(--blue)}.pub-authors,.pub-venue,.pub-summary{font-size:.8rem;color:var(--muted)}.pub-venue{font-weight:750;color:var(--ink-2)}.pub-summary{font-size:.88rem}.tags{display:flex;flex-wrap:wrap;gap:7px;margin:16px 0}.tags span{border:1px solid var(--line);padding:5px 8px;font-size:.66rem;color:var(--ink-2);background:rgba(255,255,255,.04)}.pub-actions{display:flex;gap:16px;align-items:center;margin-top:auto;padding-top:24px;border-top:1px solid var(--line);flex-wrap:wrap}.pub-actions a,.pub-actions button{display:inline-flex;align-items:center;gap:5px;border:0;background:transparent;padding:0;font-size:.75rem;font-weight:800;color:var(--blue);cursor:pointer}.open-science{background:var(--night);color:#fff}.section-heading.light p{color:#adc0cf}.open-science .section-label{color:#7fcac3}.project-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.15)}.project-card{padding:34px;background:var(--night);min-height:420px;display:flex;flex-direction:column}.project-number{font-family:Georgia,serif;font-size:2rem;color:var(--orange)}.project-card>p{text-transform:uppercase;letter-spacing:.14em;font-size:.66rem;color:#7fcac3;margin-top:58px}.project-card h3{font-family:Georgia,serif;font-weight:500;font-size:2rem;margin-bottom:12px}.project-card>div:not(.tags){color:#adc0cf;font-size:.88rem}.project-card .tags span{border-color:rgba(255,255,255,.15);color:#cad7e0}.project-card>a{display:inline-flex;align-items:center;gap:8px;margin-top:auto;font-size:.8rem;font-weight:800;color:#fff}.timeline{border-top:1px solid var(--line)}.timeline article{display:grid;grid-template-columns:180px 1fr;border-bottom:1px solid var(--line);padding:28px 0}.timeline article>span{color:var(--blue);font-weight:850;font-size:.8rem}.timeline h3{font-family:Georgia,serif;font-weight:500;font-size:1.5rem;margin-bottom:5px}.timeline p{color:var(--muted);margin:0}.profiles-section{background:#fff}.profile-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.profile-link{display:grid;grid-template-columns:44px 1fr 22px;gap:14px;align-items:center;border:1px solid var(--line);padding:18px}.profile-link>span{width:44px;height:44px;background:var(--mint);display:grid;place-items:center;color:var(--teal)}.profile-link>span svg{width:22px}.profile-link>svg{color:var(--muted)}.profile-link strong,.profile-link small{display:block}.profile-link small{color:var(--muted);font-size:.75rem;margin-top:2px}.contact-band{background:var(--teal);color:#fff;padding:70px 0}.contact-band>.container{display:flex;align-items:center;justify-content:space-between;gap:60px}.contact-band h2{font-family:Georgia,serif;font-size:clamp(2rem,4vw,3.6rem);font-weight:500;line-height:1.05;max-width:800px;margin:0}.contact-band .section-label{color:#d8f5ef}.site-footer{background:#081a2b;color:#fff;padding:68px 0 26px}.footer-grid{display:grid;grid-template-columns:1.5fr .6fr .6fr;gap:70px}.footer-mark .wordmark-mark{border-color:#7b95a8}.footer-note{color:#94aabd;font-size:.82rem;max-width:430px;margin-top:22px}.footer-grid h2{font-size:.68rem;text-transform:uppercase;letter-spacing:.15em;color:#7fcac3;margin-bottom:15px}.footer-grid>div>a:not(.wordmark){display:block;color:#b7c8d5;font-size:.82rem;margin:8px 0}.footer-bottom{display:flex;justify-content:space-between;gap:30px;border-top:1px solid rgba(255,255,255,.12);padding-top:24px;margin-top:55px;color:#7891a5;font-size:.7rem}.page-hero{background:var(--night);color:#fff;padding:90px 0 78px}.page-hero .eyebrow{color:#9fb5c6}.page-hero h1{font-size:clamp(4rem,9vw,8rem);line-height:.9;margin-bottom:28px}.page-hero>div>p:last-child{color:#adc0cf;max-width:760px;font-size:1.05rem}.publication-browser{padding:55px 0 90px;background:var(--paper)}.filter-panel{background:#fff;border:1px solid var(--line);padding:24px;margin-bottom:28px;position:sticky;top:92px;z-index:10;box-shadow:0 12px 30px rgba(16,37,61,.06)}.search-box{position:relative;display:block}.search-box span{display:block;font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px}.search-box input{width:100%;height:52px;border:0;border-bottom:1px solid var(--ink);padding:0 46px 0 0;font-size:1rem;outline:none}.search-box b{position:absolute;right:10px;bottom:14px}.search-box b svg{width:22px}.filter-groups{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:18px}.filter-groups label{font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}.filter-groups select{display:block;width:100%;margin-top:6px;border:1px solid var(--line);background:#fff;padding:10px}.result-row{display:flex;justify-content:space-between;align-items:center;margin-top:18px;padding-top:15px;border-top:1px solid var(--line);font-size:.78rem}.result-row p{margin:0}.result-row button{border:0;background:transparent;color:var(--blue);cursor:pointer;font-weight:800}.publication-list{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}.publication-list .publication-card{min-height:455px}.publication-card[hidden]{display:none}.no-results{text-align:center;padding:70px;border:1px solid var(--line);background:#fff}.data-note{display:grid;grid-template-columns:50px 1fr auto;align-items:center;gap:22px;background:var(--night);color:#fff;padding:28px;margin-top:28px}.data-note>div:first-child{width:50px;height:50px;background:var(--teal);display:grid;place-items:center}.data-note svg{width:25px}.data-note h2{font-family:Georgia,serif;font-weight:500;margin:0}.data-note p{color:#adc0cf;font-size:.8rem;margin:4px 0 0}.data-note>a{display:flex;align-items:center;gap:8px;font-size:.78rem;font-weight:800}.record-hero{background:var(--night);color:#fff;padding:68px 0}.record-grid{display:grid;grid-template-columns:1fr 300px;gap:85px}.back-link{display:inline-flex;align-items:center;gap:7px;color:#9fb5c6;font-size:.78rem;margin-bottom:42px}.back-link svg{transform:rotate(180deg)}.record-meta{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:22px}.record-meta span{border:1px solid rgba(255,255,255,.18);padding:5px 8px;font-size:.66rem;text-transform:uppercase;letter-spacing:.08em;color:#b9c9d5}.record-hero h1{font-size:clamp(2.5rem,5.8vw,5.4rem);line-height:.98;margin-bottom:28px}.record-authors{color:#dbe6ed}.record-venue{color:#7fcac3;font-weight:800}.record-hero .tags span{border-color:rgba(255,255,255,.16);color:#c8d6df}.record-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:32px}.record-hero .button.secondary{border-color:rgba(255,255,255,.48);color:#fff}.record-id{border:1px solid rgba(255,255,255,.18);padding:26px;align-self:start;margin-top:80px}.record-id span,.record-id strong,.record-id a{display:block}.record-id span{color:#7fcac3;text-transform:uppercase;letter-spacing:.12em;font-size:.65rem;margin-bottom:28px}.record-id strong{font-family:Georgia,serif;font-weight:500;font-size:1.25rem}.record-id a,.record-id p{color:#adc0cf;font-size:.75rem;overflow-wrap:anywhere;margin-top:5px}.record-id i{display:block;height:1px;background:rgba(255,255,255,.16);margin:25px 0}.record-content{display:grid;grid-template-columns:1fr 300px;gap:85px}.record-content h2{font-family:Georgia,serif;font-weight:500;font-size:2rem}.record-summary{font-size:1.25rem;color:var(--ink-2);max-width:760px}.citation-block{margin-top:55px;border-top:1px solid var(--line);padding-top:35px}.citation-block pre{white-space:pre-wrap;overflow:auto;background:#e8eceb;padding:22px;font-size:.76rem}.citation-block>button{border:0;background:var(--blue);color:#fff;padding:10px 13px;font-weight:800;cursor:pointer}.record-aside{border-left:1px solid var(--line);padding-left:26px}.record-aside h2{font-size:1.3rem}.record-aside a{display:flex;justify-content:space-between;align-items:center;gap:10px;border-top:1px solid var(--line);padding:14px 0;font-size:.78rem;font-weight:800}.related-section{background:#fff}.toast{position:fixed;bottom:22px;left:50%;transform:translate(-50%,25px);background:var(--night);color:#fff;padding:11px 16px;font-size:.78rem;opacity:0;pointer-events:none;transition:.2s;z-index:999}.toast.show{opacity:1;transform:translate(-50%,0)}@media(max-width:980px){.site-nav{gap:15px}.hero-grid{grid-template-columns:1fr .55fr;gap:30px}.hero h1{font-size:clamp(3.2rem,8vw,5.5rem)}.featured-publications,.project-grid{grid-template-columns:1fr 1fr}.research-grid{grid-template-columns:1fr 1fr}.featured-theme{grid-row:auto}.record-grid,.record-content{grid-template-columns:1fr;gap:36px}.record-id{margin-top:0}.record-aside{border-left:0;border-top:1px solid var(--line);padding:28px 0 0}.publication-list{grid-template-columns:1fr}}@media(max-width:760px){.nav-shell{min-height:67px}.nav-toggle{display:block}.site-nav{position:absolute;left:0;right:0;top:67px;background:var(--paper);border-bottom:1px solid var(--line);padding:22px;display:none;flex-direction:column;align-items:stretch}.site-nav.open{display:flex}.site-nav>a[aria-current=page]::after{display:none}.hero{padding-top:55px}.hero-grid{grid-template-columns:1fr}.hero-profile{width:min(100%,430px);margin-inline:auto}.stat-rail{grid-template-columns:1fr 1fr}.stat-rail>div:nth-child(3){border-left:1px solid var(--line)}.split-intro,.footer-grid{grid-template-columns:1fr;gap:34px}.split-intro>div:last-child{padding-top:0}.section{padding:70px 0}.section-heading{display:block}.section-heading>p{margin-top:20px}.research-grid,.featured-publications,.project-grid,.profile-grid{grid-template-columns:1fr}.contact-band>.container{display:block}.contact-band .button{margin-top:30px}.footer-bottom{display:block}.footer-bottom span{display:block;margin-top:8px}.filter-panel{position:static}.filter-groups{grid-template-columns:1fr}.data-note{grid-template-columns:50px 1fr}.data-note>a{grid-column:1/-1}.timeline article{grid-template-columns:1fr;gap:8px}.page-hero{padding:65px 0}.record-hero{padding:48px 0}.record-hero h1{font-size:2.45rem}}@media(max-width:460px){.container{width:min(calc(100% - 26px),var(--max))}.hero h1{font-size:3.35rem}.stat-rail{grid-template-columns:1fr}.stat-rail>div,.stat-rail>div:nth-child(3){border-left:1px solid var(--line)}.profile-caption{margin-top:0}.publication-card{padding:21px}.record-actions .button{width:100%}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{transition:none!important;animation:none!important}}`;

const appJs = `(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.footer-bottom [data-year]').forEach(node => node.textContent = new Date().getFullYear());
  let toast = document.querySelector('.toast');
  if (!toast) { toast = document.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status'); document.body.append(toast); }
  const notify = message => { toast.textContent = message; toast.classList.add('show'); clearTimeout(window.__toast); window.__toast = setTimeout(() => toast.classList.remove('show'), 1800); };
  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(button.dataset.copy); notify('BibTeX copied'); }
    catch { notify('Select and copy the citation block'); }
  }));
  const search = document.querySelector('#publication-search');
  const year = document.querySelector('#year-filter');
  const type = document.querySelector('#type-filter');
  const theme = document.querySelector('#theme-filter');
  const cards = [...document.querySelectorAll('[data-publication]')];
  const count = document.querySelector('#result-count');
  const empty = document.querySelector('#no-results');
  const apply = () => {
    const query = (search?.value || '').trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const match = (!query || card.dataset.search.includes(query)) && (!year || year.value === 'all' || card.dataset.year === year.value) && (!type || type.value === 'all' || card.dataset.type === type.value) && (!theme || theme.value === 'all' || card.dataset.theme.includes(theme.value));
      card.hidden = !match; if (match) visible++;
    });
    if (count) count.textContent = String(visible);
    if (empty) empty.hidden = visible !== 0;
  };
  [search, year, type, theme].filter(Boolean).forEach(control => control.addEventListener(control === search ? 'input' : 'change', apply));
  document.querySelector('#clear-filters')?.addEventListener('click', () => { if (search) search.value = ''; [year, type, theme].filter(Boolean).forEach(control => control.value = 'all'); apply(); });
})();`;

const ogCard = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#0b1f33"/><g fill="none" stroke="#1d5470" opacity=".6"><circle cx="1010" cy="60" r="310"/><circle cx="1010" cy="60" r="230"/><circle cx="1010" cy="60" r="150"/><path d="M0 510h1200M0 550h1200M0 590h1200"/></g><rect x="70" y="72" width="66" height="66" fill="none" stroke="#7fcac3"/><text x="103" y="114" text-anchor="middle" fill="#fff" font-family="Arial" font-size="22" font-weight="700">YA</text><text x="70" y="275" fill="#fff" font-family="Georgia" font-size="72">Yassir AL-Karawi</text><text x="70" y="335" fill="#7fcac3" font-family="Arial" font-size="25" letter-spacing="4">COMMUNICATIONS ENGINEERING</text><text x="70" y="405" fill="#b7c8d5" font-family="Arial" font-size="27">Open RAN · 5G/6G · Quantum Communications · AI-Native Networks</text><rect x="70" y="474" width="150" height="5" fill="#e67832"/></svg>`;
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="8" fill="#0b1f33"/><text x="32" y="40" text-anchor="middle" fill="#fff" font-family="Arial" font-size="23" font-weight="800">YA</text><path d="M12 50h40" stroke="#e67832" stroke-width="4"/></svg>`;
const manifest = JSON.stringify({ name: "Yassir AL-Karawi — Academic Homepage", short_name: "Yassir AL-Karawi", start_url: "/", display: "standalone", background_color: "#f7f5ef", theme_color: "#0b1f33", icons: [{ src: "/assets/favicon.svg", sizes: "any", type: "image/svg+xml" }] }, null, 2);
const readme = `# Yassir AL-Karawi — Academic Homepage

Static, accessible, and search-friendly academic website for **Dr. Yassir AL-Karawi**.

## What is included

- Responsive academic homepage
- Searchable catalogue of ${publications.length} publications
- A dedicated, machine-readable HTML record for every publication
- Highwire citation metadata and Schema.org JSON-LD
- BibTeX copy controls
- Open-science project cards
- Sitemap, robots.txt, RSS, manifest, and social preview assets

## Local preview

\`\`\`bash
python3 -m http.server 8080
\`\`\`

Open \`http://localhost:8080\`.

## Rebuild generated pages

\`\`\`bash
node scripts/build.mjs
\`\`\`

Validate the generated site with:

\`\`\`bash
node scripts/check.mjs
\`\`\`

The site is designed for the GitHub Pages user repository \`YassirALKarawi/YassirALKarawi.github.io\` and requires no build action on GitHub.
`;
const citation = `cff-version: 1.2.0
message: "If this academic website or publication catalogue is useful, cite the relevant paper using its DOI."
title: "Yassir AL-Karawi Academic Homepage and Publication Catalogue"
type: dataset
authors:
  - family-names: "AL-Karawi"
    given-names: "Yassir"
    orcid: "https://orcid.org/0000-0003-2959-3893"
repository-code: "https://github.com/YassirALKarawi/YassirALKarawi.github.io"
url: "${siteUrl}/"
license: MIT
`;

async function output(path, content) {
  const target = resolve(root, path);
  await mkdir(dirname(target), { recursive: true });
  const normalized = typeof content === "string"
    ? `${content.replace(/[ \t]+$/gm, "").trimEnd()}\n`
    : content;
  await writeFile(target, normalized, "utf8");
}

await output("index.html", homePage());
await output("publications.html", publicationsPage());
for (const pub of publications) await output(`research/${pub.slug}.html`, publicationPage(pub));
await output("assets/styles.css", styles);
await output("assets/app.js", appJs);
await output("assets/og-card.svg", ogCard);
await output("assets/favicon.svg", favicon);
await output("site.webmanifest", manifest);
await output("publications.json", JSON.stringify(publications, null, 2));
await output("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
await output("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc><priority>1.0</priority></url>\n  <url><loc>${siteUrl}/publications.html</loc><priority>0.9</priority></url>\n${publications.map(pub => `  <url><loc>${siteUrl}/research/${pub.slug}.html</loc><lastmod>${pub.date.length >= 10 ? pub.date : `${pub.year}-01-01`}</lastmod><priority>0.7</priority></url>`).join("\n")}\n</urlset>\n`);
await output("feed.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom"><title>Yassir AL-Karawi — Publications</title><id>${siteUrl}/</id><updated>2026-07-18T00:00:00Z</updated><link href="${siteUrl}/feed.xml" rel="self"/>${publications.slice(0, 10).map(pub => `<entry><title>${escapeHtml(pub.title)}</title><id>${doiUrl(pub) || `${siteUrl}/research/${pub.slug}.html`}</id><link href="${siteUrl}/research/${pub.slug}.html"/><updated>${pub.date.length >= 10 ? pub.date : `${pub.year}-01-01`}T00:00:00Z</updated><summary>${escapeHtml(pub.summary)}</summary></entry>`).join("")}</feed>`);
await output("404.html", `${head({ title: `Page not found | ${author}`, description: "The requested page could not be found.", canonical: "/404.html" })}<body>${nav()}<main id="main"><section class="page-hero"><div class="container"><p class="eyebrow"><span></span> 404</p><h1>Page not found</h1><p>The requested page does not exist or may have moved.</p><a class="button primary" href="/">Return home ${icon("arrow")}</a></div></section></main>${pageEnd()}`);
await output("README.md", readme);
await output("CITATION.cff", citation);
await output(".nojekyll", "");

console.log(`Built ${publications.length + 2} HTML pages in ${root}`);
