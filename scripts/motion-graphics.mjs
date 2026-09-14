const wave='<path class="osc-wave" d="M-32 24q8-20 16 0t16 0t16 0t16 0t16 0t16 0"/>';
export function motionIcon(label) {
  const name=label.toLowerCase(); let kind='processor', drawing='';
  if(/channel|antenna|carrier|rf link/.test(name)) {
    kind='antenna'; drawing='<path d="m16 43 8-24 8 24M19 34h10M16 43h16M24 19v-4"/><circle cx="24" cy="14" r="3"/><g class="radio-ring ring-one"><path d="M16 7a11 11 0 0 0 0 14M32 7a11 11 0 0 1 0 14"/></g><g class="radio-ring ring-two"><path d="M10 3a18 18 0 0 0 0 23M38 3a18 18 0 0 1 0 23"/></g><g class="radio-ring ring-three"><path d="M5 1a24 24 0 0 0 0 30M43 1a24 24 0 0 1 0 30"/></g>';
  } else if(/clock|sampl|timing|synchron/.test(name)) {
    kind='sampler'; drawing='<circle cx="24" cy="24" r="17"/><path d="M24 9v3M39 24h-3M24 39v-3M9 24h3"/><g class="clock-arm"><path d="M24 24V12"/></g><circle class="device-led" cx="24" cy="24" r="3"/><path d="M17 3h14"/>';
  } else if(/decision|detector|threshold|slicer|compare|decoder|demapper|recovered/.test(name)) {
    kind='detector'; drawing='<rect x="5" y="8" width="38" height="29" rx="7"/><path d="M17 43h14M24 37v6"/><path class="decision-check" d="m14 23 7 7 14-15"/><circle class="device-led" cx="36" cy="33" r="1"/>';
  } else if(/fft|ifft|spectrum|subcarrier/.test(name)) {
    kind='spectrum'; drawing='<path d="M4 40h40"/>'+[0,1,2,3,4,5].map((i)=>`<path class="spectrum-bar" style="--bar:${i}" d="M${8+i*6} 36V${12+i%3*7}"/>`).join('');
  } else if(/filter|correlat|pulse|waveform|oscillator|vco|analogue|noise/.test(name)) {
    kind='scope'; drawing='<rect x="3" y="7" width="42" height="34" rx="6"/><path d="M8 34h25M38 15v18"/><svg x="6" y="9" width="28" height="26" viewBox="0 0 32 48" overflow="hidden">'+wave+'</svg><circle class="device-led" cx="38" cy="12" r="1.8"/>';
  } else if(/bits|source|destination|information|symbols/.test(name)) {
    kind='data'; drawing='<rect x="7" y="5" width="34" height="38" rx="6"/><g class="data-stream"><path d="M14 14v5M21 14h5v5h-5zM33 14v5M14 27h5v5h-5zM26 27v5M33 27v5"/></g><path class="data-scan" d="M10 23h28"/>';
  } else {
    drawing='<rect x="12" y="12" width="24" height="24" rx="5"/><path d="M5 17h7M5 24h7M5 31h7M36 17h7M36 24h7M36 31h7M17 5v7M24 5v7M31 5v7M17 36v7M24 36v7M31 36v7"/><path class="chip-route" d="M5 24h13v-6h12v12H18v-6h25"/><circle class="device-led" cx="24" cy="24" r="2"/>';
  }
  return `<svg class="engineering-icon ${kind}" viewBox="0 0 48 48" aria-hidden="true">${drawing}</svg>`;
}
export function motionControls(location) {
  return `<div class="motion-transport" data-transport="${location}" aria-label="Animation controls"><button type="button" data-motion="toggle" aria-pressed="false">Pause animation</button><button type="button" data-motion="step" title="Pause and advance one teaching step">Next step</button><button type="button" data-motion="restart">Replay</button><button type="button" data-motion="expand" aria-expanded="false">Enlarge figure</button><label>Speed<select data-motion="speed" aria-label="Animation speed"><option value="0.35">0.35× · slow</option><option value="0.65">0.65×</option><option value="1" selected>1×</option><option value="1.5">1.5×</option><option value="2">2×</option></select></label><span class="motion-status" role="status">Playing · time slowed for learning</span></div>`;
}
export function flowPosition(i,length) {
  const position=columns=>{const row=Math.floor(i/columns),col=row%2?columns-i%columns:i%columns+1;return {row:row+1,col,next:i===length-1?'none':i%columns===columns-1?'down':row%2?'left':'right'};};
  const desktop=position(3),mobile=position(2);
  return `style="--flow-column:${desktop.col};--flow-row:${desktop.row};--flow-mobile-column:${mobile.col};--flow-mobile-row:${mobile.row}" data-next="${desktop.next}" data-next-mobile="${mobile.next}"`;
}
