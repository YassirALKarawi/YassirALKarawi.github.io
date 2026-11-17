export function parseAnswer(raw){
  const normalized=String(raw??'').trim().replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632)).replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace('٫','.').replace('−','-');
  if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(normalized))return NaN;
  return Number(normalized);
}
export function correct(raw,expected){
  const answer=parseAnswer(raw);
  return Number.isFinite(answer)&&Math.abs(answer-expected)<=Math.max(Math.abs(expected)*0.01000001,1e-8);
}
export function drawValue(parameter,random=Math.random){
  const ticks=Math.round((parameter.max-parameter.min)/parameter.step);
  return Number((parameter.min+Math.floor(random()*(ticks+1))*parameter.step).toFixed(6));
}
export function makeCase(lab,random=Math.random){return {id:lab.id,x:drawValue(lab.x,random),y:drawValue(lab.y,random)}}
export function makeExam(pool,random=Math.random){
  const deck=[...pool];
  for(let i=deck.length-1;i>0;--i){const j=Math.floor(random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]]}
  return deck.slice(0,Math.min(8,deck.length)).map(l=>makeCase(l,random));
}
