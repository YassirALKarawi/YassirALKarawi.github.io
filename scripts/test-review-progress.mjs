import assert from 'node:assert/strict';
import fs from 'node:fs';
import {applyAnswer,emptyProgress,normalizeProgress,loadProgress,recordAnswer,dueQuestions,progressSummary,REVIEW_KEY,DAY} from '../learning/digital-communications/academy/review-state.mjs';
import {selectQuestions,validQuizSession} from '../learning/digital-communications/academy/quiz.mjs';
const bank=JSON.parse(fs.readFileSync(new URL('../learning/digital-communications/academy/mcq.json',import.meta.url)));
const arabic=JSON.parse(fs.readFileSync(new URL('../learning/digital-communications/academy/i18n/mcq.ar.json',import.meta.url)));
assert.deepEqual(bank.map(q=>[q.id,q.correct]),arabic.map(q=>[q.id,q.correct]));
const id=bank[0].id, at=1800000000000;
const answer=(state,correct,session,now=at)=>applyAnswer(state,{id,correct,session,now});
let state=answer(emptyProgress(),false,'first');
assert.deepEqual(dueQuestions(state,at),[id]);
assert.equal(progressSummary(state,at).correct,0);
assert.deepEqual(answer(state,false,'first'),state,'reload does not count the same response twice');
state=answer(state,true,'retry');
assert.equal(state.records[id].step,1);assert.equal(state.records[id].dueAt,at+DAY);
assert.deepEqual(dueQuestions(state,at),[]);
state=answer(state,true,'too-early',at+1000);
assert.equal(state.records[id].step,1);assert.equal(state.records[id].dueAt,at+DAY);
state=answer(state,true,'day-one',at+DAY);
assert.equal(state.records[id].step,2);assert.equal(state.records[id].dueAt,at+4*DAY);
state=answer(state,true,'day-four',at+4*DAY);
assert.equal(state.records[id].dueAt,at+11*DAY);assert.equal(progressSummary(state,at+4*DAY).spaced,1);
state=answer(state,false,'forgotten',at+11*DAY);
assert.equal(state.records[id].step,0);assert.equal(progressSummary(state,at+11*DAY).spaced,0);
state=answer(state,true,'repair',at+11*DAY);
assert.equal(state.records[id].dueAt,at+12*DAY);
assert.equal(progressSummary(state,at+11*DAY,2).attempted,0);
// Correct-but-due questions and mistakes are both included; mistakes lead the queue.
const id2=bank.find(q=>q.lecture===2).id;
state=applyAnswer(state,{id:id2,correct:false,session:'other',now:at+12*DAY});
assert.deepEqual(dueQuestions(state,at+12*DAY),[id2,id]);
assert.equal(progressSummary(state,at+12*DAY).attempted,2);
// Invalid data cannot inflate counts, break dates, or enter arbitrary keys.
for(const x of [null,[],{}, {version:2,records:state.records}, {version:1,records:[]}])assert.deepEqual(normalizeProgress(x),emptyProgress());
for(const change of [{lastAt:NaN},{dueAt:Infinity},{attempts:-1},{correctCount:999},{step:10},{lastCorrect:'true'},{lastSession:'x'.repeat(161)}]){
 const bad={version:1,records:{[id]:{...state.records[id],...change}}};assert.deepEqual(normalizeProgress(bad),emptyProgress());
}
assert.deepEqual(normalizeProgress({version:1,records:{'MCQ-9-01':state.records[id]}}),emptyProgress());
const storage={value:null,getItem(){return this.value},setItem(k,v){assert.equal(k,REVIEW_KEY);this.value=v}};
assert(recordAnswer({id,correct:true,session:'device',now:at},storage));
assert.equal(loadProgress(storage).records[id].attempts,1);
assert(!recordAnswer({id,correct:true,session:'blocked',now:at},{getItem(){throw Error()},setItem(){throw Error()}}));
storage.value='{broken';assert.deepEqual(loadProgress(storage),emptyProgress());
for(let i=0;i<50;i++){const check=selectQuestions(bank,0,8);assert.equal(check.length,8);assert.equal(new Set(check.map(q=>q.lecture)).size,8)}
const session={ids:[id],orders:{[id]:[0,1,2,3]},answers:{},index:0,sessionId:'valid'};
assert(validQuizSession(session,bank));assert(!validQuizSession({...session,sessionId:[]},bank));
assert(!validQuizSession({...session,sessionId:''},bank));
console.log('PASS: delayed-review schedule, error reset, early-repeat protection, duplicate scoring, bilingual IDs, mixed due queue, damaged/blocked storage, and balanced 8-lecture checks.');
