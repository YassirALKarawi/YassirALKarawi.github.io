// Coordinates in metres; power is reference-signal EIRP per resource element.
(function(root){
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function power(t,p,c){
 const dx=p.x-t.x,dy=p.y-t.y,d=Math.max(1,Math.hypot(dx,dy,t.h-1.5));
 const phi=Math.atan2(dx,-dy)*180/Math.PI;
 const off=((phi-t.az+540)%360)-180;
 const sector=t.directional?Math.min(25,12*(off/65)**2):0;
 return t.p-20*Math.log10(4*Math.PI*c.ghz*1e9/299792458)-10*c.n*Math.log10(d)-sector;
}
function run(c){
 if(!c.towers.length||c.path.length<2)return null;
 let total=0;const legs=[];
 for(let i=1;i<c.path.length;i++){const a=c.path[i-1],b=c.path[i],len=Math.hypot(b.x-a.x,b.y-a.y);if(len){legs.push({a,b,len,start:total});total+=len}}
 if(!total)return null;
 const velocity=c.speed/3.6,sec=total/velocity,steps=Math.ceil(sec/.08),dt=sec/steps;
 const samples=[],events=[];let leg=0,serv=-1,candidate=-1,elapsed=0,good=0,worst=Infinity,worstAt=0;
 const stride=Math.max(1,Math.ceil(steps/450));
 for(let i=0;i<=steps;i++){
   const m=total*i/steps;while(leg+1<legs.length&&m>legs[leg+1].start)leg++;
   const l=legs[leg],f=clamp((m-l.start)/l.len,0,1),p={x:l.a.x+(l.b.x-l.a.x)*f,y:l.a.y+(l.b.y-l.a.y)*f};
   const powers=c.towers.map(t=>power(t,p,c));let best=0;for(let j=1;j<powers.length;j++)if(powers[j]>powers[best])best=j;
   if(serv<0)serv=best;
   if(best!==serv&&powers[best]-powers[serv]>c.margin){
     if(candidate!==best){candidate=best;elapsed=0}else elapsed+=dt;
     if(elapsed+1e-9>=c.ttt/1000){events.push({m,time:i*dt,from:serv,to:best});serv=best;candidate=-1;elapsed=0}
   }else{candidate=-1;elapsed=0}
   const rx=powers[serv];if(i&&rx>=c.threshold)good++;if(rx<worst){worst=rx;worstAt=m}
   if(i%stride===0||i===steps)samples.push({...p,m,time:i*dt,serv,rx,powers});
 }
 return {total,sec,events,samples,coverage:100*good/steps,worst,worstAt};
}
root.TowerLab={power,run};
})(typeof window==='undefined'?globalThis:window);
