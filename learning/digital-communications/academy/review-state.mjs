// Browser-local learning evidence. Reading a solution is not a scored answer.
export const REVIEW_KEY = 'dc-review-v1';
export const DAY = 86400000;
export const INTERVALS = [1, 3, 7, 14, 30];
const validId = id => /^MCQ-[1-8]-(?:0[1-9]|10)$/.test(id);
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const time = value => Number.isFinite(value) && value >= 0 && value < 8.64e15;
const count = value => Number.isSafeInteger(value) && value >= 0 && value <= 1000000;
export const emptyProgress = () => ({version: 1, records: {}});
export function normalizeProgress(value) {
  const clean = emptyProgress();
  if (!object(value) || value.version !== 1 || !object(value.records)) return clean;
  for (const [id, r] of Object.entries(value.records)) {
    if (!validId(id) || !object(r) || !count(r.attempts) || !r.attempts ||
        !count(r.correctCount) || r.correctCount > r.attempts ||
        typeof r.lastCorrect !== 'boolean' || !time(r.lastAt) || !time(r.dueAt) ||
        !Number.isInteger(r.step) || r.step < 0 || r.step > INTERVALS.length ||
        typeof r.lastSession !== 'string' || r.lastSession.length > 160) continue;
    clean.records[id] = {attempts: r.attempts, correctCount: r.correctCount,
      lastCorrect: r.lastCorrect, lastAt: r.lastAt, dueAt: r.dueAt,
      step: r.step, lastSession: r.lastSession};
  }
  return clean;
}
export function deviceStorage() { try { return globalThis.localStorage; } catch { return undefined; } }
export function loadProgress(storage = deviceStorage()) {
  try { return normalizeProgress(JSON.parse(storage?.getItem(REVIEW_KEY) || 'null')); }
  catch { return emptyProgress(); }
}
export function applyAnswer(state, {id, correct, session, now = Date.now()}) {
  if (!validId(id) || typeof correct !== 'boolean' || typeof session !== 'string' ||
      !session || session.length > 160 || !time(now)) throw new Error('Invalid learning record');
  const next = normalizeProgress(state), old = next.records[id];
  if (old?.lastSession === session) return next; // Reloads and language changes never score twice.
  const at = Math.max(now, old?.lastAt || 0);
  let step = old?.step || 0, dueAt = old?.dueAt || at;
  if (!correct) { step = 0; dueAt = at; }
  else if (!old || !old.lastCorrect || at >= old.dueAt) {
    step = Math.min(step + 1, INTERVALS.length);
    dueAt = at + INTERVALS[step - 1] * DAY;
  }
  next.records[id] = {attempts: Math.min(1000000, (old?.attempts || 0) + 1),
    correctCount: Math.min(1000000, (old?.correctCount || 0) + Number(correct)),
    lastCorrect: correct, lastAt: at, dueAt, step, lastSession: session};
  return next;
}
export function recordAnswer(answer, storage = deviceStorage()) {
  const next = applyAnswer(loadProgress(storage), answer);
  try { if (!storage) return false; storage.setItem(REVIEW_KEY, JSON.stringify(next)); return true; }
  catch { return false; }
}
export function dueQuestions(state, now = Date.now()) {
  return Object.entries(normalizeProgress(state).records)
    .filter(([, r]) => r.dueAt <= now)
    .sort((a, b) => Number(a[1].lastCorrect) - Number(b[1].lastCorrect) || a[1].dueAt - b[1].dueAt || a[0].localeCompare(b[0]))
    .map(([id]) => id);
}
export function progressSummary(state, now = Date.now(), lecture = 0) {
  const records = Object.entries(normalizeProgress(state).records)
    .filter(([id]) => !lecture || Number(id.split('-')[1]) === lecture);
  const future = records.filter(([, r]) => r.dueAt > now).map(([, r]) => r.dueAt);
  return {attempted: records.length, correct: records.filter(([, r]) => r.lastCorrect).length,
    due: records.filter(([, r]) => r.dueAt <= now).length,
    spaced: records.filter(([, r]) => r.step >= 3 && r.lastCorrect).length,
    nextAt: future.length ? Math.min(...future) : null};
}
