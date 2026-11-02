// Instrument display processing. Voltages remain in volts at the probe tip.
export function conditionTrace(records,tip,ground,coupling='DC',cutoff=10){
 if(!tip||!ground)return[];let lastX=0,y=0,lastT=0,started=false;
 return records.flatMap(r=>{const x=r.values[tip]-r.values[ground];if(!Number.isFinite(x))return[];
 if(!started){lastX=x;lastT=r.t;started=true;y=0}else{const rc=1/(2*Math.PI*cutoff),dt=r.t-lastT;y=rc/(rc+dt)*(y+x-lastX);lastX=x;lastT=r.t}
 return[{t:r.t,v:coupling==='GND'?0:coupling==='AC'?y:x}];});
}
export function metrics(trace){if(trace.length<2)return{min:NaN,max:NaN,mean:NaN,rms:NaN,vpp:NaN,f:NaN};let min=Infinity,max=-Infinity,area=0,square=0;
 for(let i=0;i<trace.length;i++){const p=trace[i];min=Math.min(min,p.v);max=Math.max(max,p.v);if(i){const q=trace[i-1],dt=p.t-q.t;area+=(p.v+q.v)*dt/2;square+=(p.v*p.v+q.v*q.v)*dt/2}}
 const span=trace.at(-1).t-trace[0].t,level=(max+min)/2,cross=[];
 if(max-min>1e-6)for(let i=1;i<trace.length;i++){const a=trace[i-1],b=trace[i];if(a.v<level&&b.v>=level)cross.push(a.t+(level-a.v)/(b.v-a.v)*(b.t-a.t))}
 const f=cross.length>=2?(cross.length-1)/(cross.at(-1)-cross[0]):NaN;
 return{min,max,mean:area/span,rms:Math.sqrt(square/span),vpp:max-min,f};
}
export function triggerWindow(trace,span,level=0,edge='rise'){
 if(trace.length<2)return null;const end=trace.at(-1).t,first=trace[0].t;
 for(let i=trace.length-1;i>0;i--){const a=trace[i-1],b=trace[i];if(b.t+.8*span>end||a.t-.2*span<first)continue;
 if(edge==='rise'?a.v<level&&b.v>=level:a.v>level&&b.v<=level){const t=a.t+(level-a.v)/(b.v-a.v)*(b.t-a.t);if(t+.8*span<=end&&t-.2*span>=first)return{start:t-.2*span,end:t+.8*span,trigger:t}}}return null;
}
export function atTime(trace,t){if(!trace.length||t<trace[0].t||t>trace.at(-1).t)return NaN;let lo=0,hi=trace.length-1;while(lo+1<hi){const m=(lo+hi)>>1;if(trace[m].t<t)lo=m;else hi=m}const a=trace[lo],b=trace[hi];return b.t===a.t?a.v:a.v+(b.v-a.v)*(t-a.t)/(b.t-a.t)}
export function scale125(required){const p=10**Math.floor(Math.log10(Math.max(required,1e-6)));return[1,2,5,10].map(x=>x*p).find(x=>x>=required)||10*p}

export function createACFilter(cutoff=10){let ready=false,px=0,py=0,pt=0;return(t,x)=>{if(!Number.isFinite(x))return NaN;if(!ready){px=x;pt=t;ready=true;return 0}const rc=1/(2*Math.PI*cutoff),a=rc/(rc+t-pt);py=a*(py+x-px);px=x;pt=t;return py}}
