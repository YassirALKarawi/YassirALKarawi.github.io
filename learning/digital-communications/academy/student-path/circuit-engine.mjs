// Educational transient nodal solver. SI units. Backward Euler capacitor companion.
export const pins=c=>c.type==='ground'?['0']:c.type==='switch'?['a','b','g','r']:['a','b'];
export const terminal=(id,p)=>`${id}.${p}`;
export function prepare(parts,wires){
 if(!parts.length||parts.length>40)throw Error('parts');
 for(const c of parts){if(c.type==='resistor'&&!(c.value>0&&Number.isFinite(c.value)))throw Error('value');if(c.type==='capacitor'&&!(c.value>0&&Number.isFinite(c.value)))throw Error('value');if(['source','clock'].includes(c.type)&&!(c.f>0&&Number.isFinite(c.f)))throw Error('value')}
 for(const c of parts)if(c.type==='supply'&&(!(c.value>=0&&Number.isFinite(c.value))||!(c.limit>0&&Number.isFinite(c.limit))))throw Error('value');
 const parent=new Map(parts.flatMap(c=>pins(c).map(p=>[terminal(c.id,p),terminal(c.id,p)])));
 const root=x=>{if(!parent.has(x))throw Error('terminal');let p=parent.get(x);if(p!==x){p=root(p);parent.set(x,p)}return p};
 for(const [a,b]of wires)parent.set(root(a),root(b));
 const grounds=parts.filter(c=>c.type==='ground');if(!grounds.length)throw Error('ground');
 const g=root(terminal(grounds[0].id,'0'));for(const c of grounds)parent.set(root(terminal(c.id,'0')),g);
 const nodes=[...new Set([...parent.keys()].map(root))].filter(x=>x!==root(g)),index=new Map(nodes.map((x,i)=>[x,i]));
 const node=p=>root(p)===root(g)?-1:index.get(root(p));
 const sources=parts.filter(c=>['source','clock','supply'].includes(c.type));
 if(!sources.length)throw Error('source');
 for(const c of sources)if(node(c.id+'.a')===node(c.id+'.b')&&c.type!=='supply'&&!(c.rout>0))throw Error('short');
 // A disconnected island is an error, not an implicit ground connection.
 const adj=new Map([...parent.keys()].map(root).map(x=>[x,new Set()]));
 const edge=(a,b)=>{a=root(a);b=root(b);adj.get(a).add(b);adj.get(b).add(a)};
 for(const c of parts)if(c.type!=='ground')edge(c.id+'.a',c.id+'.b');
 const seen=new Set(),visit=x=>{if(seen.has(x))return;seen.add(x);for(const y of adj.get(x))visit(y)};visit(root(g));
 if([...adj.keys()].some(x=>!seen.has(x)))throw Error('floating');
 // A switch gate is high impedance: its control terminals must reach the reference
 // through an actual source/passive path; the gate itself adds no conductance.
 const n=nodes.length,s=sources.length;
 return {parts,wires,node,n,s,sources,size:n+s};
}
export function voltage(c,t,power=true){
 if(!power||c.enabled===false)return 0;if(c.type==='supply')return c.value;
 if(c.type==='clock')return (t*c.f%1)<c.duty?c.high:0;
 const q=((t*c.f+(c.phase||0)/360)%1+1)%1;
 const y=c.wave==='square'?(q<(c.duty??.5)?1:-1):c.wave==='triangle'?1-4*Math.abs(q-.5):c.wave==='ramp'?2*q-1:c.wave==='dc'?0:Math.sin(2*Math.PI*q);
 return c.offset+c.amp*y;
}
export function gaussian(A,b){const n=b.length;for(let k=0;k<n;k++){let pivot=k;for(let i=k+1;i<n;i++)if(Math.abs(A[i][k])>Math.abs(A[pivot][k]))pivot=i;if(Math.abs(A[pivot][k])<1e-18)throw Error('singular');[A[k],A[pivot]]=[A[pivot],A[k]];[b[k],b[pivot]]=[b[pivot],b[k]];for(let i=k+1;i<n;i++){const q=A[i][k]/A[k][k];if(!q)continue;for(let j=k;j<n;j++)A[i][j]-=q*A[k][j];b[i]-=q*b[k]}}const x=Array(n).fill(0);for(let i=n-1;i>=0;i--){let r=b[i];for(let j=i+1;j<n;j++)r-=A[i][j]*x[j];x[i]=r/A[i][i];if(!Number.isFinite(x[i])||Math.abs(x[i])>1e9)throw Error('singular')}return x}
export function createSolver(parts,wires){const net=prepare(parts,wires);let caps={},prev=Array(net.size).fill(0),t=0;const v=(x,p)=>{const i=net.node(p);return i<0?0:(x[i]||0)};
 function step(dt,power=true){if(!(dt>0&&Number.isFinite(dt)))throw Error('dt');const time=t+dt;let guess=prev.slice(),result;const modes=Object.fromEntries(net.sources.filter(c=>c.type==='supply').map(c=>[c.id,net.node(c.id+'.a')===net.node(c.id+'.b')?'CC':'CV']));for(let iteration=0;iteration<24;iteration++){
  const A=Array.from({length:net.size},()=>Array(net.size).fill(0)),b=Array(net.size).fill(0);
  const conduct=(a,z,g,h=0)=>{a=net.node(a);z=net.node(z);if(a>=0){A[a][a]+=g;b[a]+=h}if(z>=0){A[z][z]+=g;b[z]-=h}if(a>=0&&z>=0){A[a][z]-=g;A[z][a]-=g}};
  for(const c of parts){if(c.type==='resistor')conduct(c.id+'.a',c.id+'.b',1/c.value);if(c.type==='capacitor'){const g=c.value/dt;conduct(c.id+'.a',c.id+'.b',g,g*(caps[c.id]||0))}if(c.type==='switch'){const on=v(guess,c.id+'.g')-v(guess,c.id+'.r')>=c.threshold;conduct(c.id+'.a',c.id+'.b',1/(on?c.ron:c.roff))}}
  net.sources.forEach((c,j)=>{const a=net.node(c.id+'.a'),z=net.node(c.id+'.b'),k=net.n+j;
   if(a>=0)A[a][k]+=1;if(z>=0)A[z][k]-=1;
   if(c.enabled===false){if(a>=0)A[k][a]+=1;if(z>=0)A[k][z]-=1;A[k][k]=-1e9;return}
   if(c.type==='supply'&&power&&modes[c.id]==='CC'){A[k][k]=1;b[k]=-c.limit;return}
   if(a>=0)A[k][a]+=1;if(z>=0)A[k][z]-=1;A[k][k]=-(c.rout||0);b[k]=voltage(c,time,power);
  });
  result=gaussian(A,b);let changed=parts.some(c=>c.type==='switch'&&((v(result,c.id+'.g')-v(result,c.id+'.r')>=c.threshold)!==(v(guess,c.id+'.g')-v(guess,c.id+'.r')>=c.threshold)));
  net.sources.forEach((c,j)=>{if(c.type!=='supply'||!power||c.enabled===false)return;const k=net.n+j,delivered=-result[k],out=v(result,c.id+'.a')-v(result,c.id+'.b');if(modes[c.id]==='CV'&&delivered>c.limit+1e-10){modes[c.id]='CC';changed=true}else if(modes[c.id]==='CC'&&out>c.value+1e-8){modes[c.id]='CV';changed=true}});

  guess=result;if(!changed)break;if(iteration===23)throw Error('convergence');
 }
 prev=result;t=time;for(const c of parts)if(c.type==='capacitor')caps[c.id]=v(result,c.id+'.a')-v(result,c.id+'.b');
 return {t,mode:id=>modes[id]||'CV',at:p=>v(result,p),current:id=>{const j=net.sources.findIndex(c=>c.id===id);return j<0?NaN:result[net.n+j]},switchOn:id=>{const c=parts.find(c=>c.id===id);return v(result,c.id+'.g')-v(result,c.id+'.r')>=c.threshold}};
 }
 return {step,get time(){return t},net};
}
export function template(id='rc'){
 const source={id:'V1',type:'source',x:140,y:220,amp:2,offset:0,f:500},ground={id:'GND',type:'ground',x:140,y:450};
 if(id==='sample')return {parts:[{...source,offset:2.5},{id:'S1',type:'switch',x:390,y:220,ron:100,roff:1e9,threshold:2.5},{id:'C1',type:'capacitor',x:650,y:300,value:10e-9},{id:'R1',type:'resistor',x:840,y:300,vertical:true,value:10e6},{id:'CLK',type:'clock',x:390,y:90,flip:true,f:10000,high:5,duty:.15},ground],wires:[['V1.a','S1.a'],['S1.b','C1.a'],['C1.a','R1.a'],['V1.b','GND.0'],['C1.b','GND.0'],['R1.b','GND.0'],['CLK.a','S1.g'],['CLK.b','GND.0'],['S1.r','GND.0']],out:'C1.a'};
 return {parts:[source,{id:'R1',type:'resistor',x:390,y:220,value:1000},{id:'C1',type:'capacitor',x:650,y:300,value:100e-9},ground],wires:[['V1.a','R1.a'],['R1.b','C1.a'],['V1.b','GND.0'],['C1.b','GND.0']],out:'C1.a'};
}
