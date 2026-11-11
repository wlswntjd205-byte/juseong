// 도감 데이터(data/atlas.json) 로더와 조회 함수. CLI · API · MCP가 모두 여기를 쓴다.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../skills/motion-atlas/data/atlas.json');
const raw = JSON.parse(readFileSync(DATA, 'utf8'));

export const categories = raw.cats.map(c => ({ id: c.id, ko: c.ko, en: c.en || null }));
const catIds = new Set(categories.map(c => c.id));

// 목록용 요약(코드·프롬프트 본문 제외)
function summary(it) {
  return {
    id: it.id, cat: it.cat, ko: it.ko, en: it.en, target: it.target,
    desc: it.desc, params: it.params.map(p => ({ k: p.k, l: p.l, v: p.v, min: p.min, max: p.max, u: p.u })),
  };
}

export function listCategories() {
  const counts = {};
  for (const it of raw.items) counts[it.cat] = (counts[it.cat] || 0) + 1;
  return categories.map(c => ({ ...c, count: c.id === 'all' ? raw.items.length : counts[c.id] || 0 }));
}

export function listItems({ cat, q } = {}) {
  if (cat && !catIds.has(cat)) throw new Error(`알 수 없는 카테고리: ${cat}`);
  return raw.items
    .filter(it => !cat || it.cat === cat)
    .filter(it => !q || matchScore(it, q) > 0)
    .map(summary);
}

// 점수: id/한글·영문 이름이 정확히 맞으면 높게, 설명·대상·카테고리에 있으면 낮게.
function matchScore(it, q) {
  const s = q.trim().toLowerCase();
  if (!s) return 0;
  let score = 0;
  if (it.id.toLowerCase() === s) score += 100;
  if ((it.ko || '').toLowerCase() === s || (it.en || '').toLowerCase() === s) score += 90;
  for (const field of [it.id, it.ko, it.en]) if ((field || '').toLowerCase().includes(s)) score += 30;
  for (const field of [it.desc, it.target, it.how]) if ((field || '').toLowerCase().includes(s)) score += 10;
  const cat = categories.find(c => c.id === it.cat);
  if (cat && ((cat.ko || '').includes(s) || (cat.en || '').toLowerCase().includes(s))) score += 5;
  return score;
}

export function searchItems(q, limit = 20) {
  return raw.items
    .map(it => ({ it, score: matchScore(it, q) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => summary(x.it));
}

export function getItem(id) {
  const it = raw.items.find(x => x.id === id);
  if (!it) return null;
  return { ...summary(it), how: it.how, note: it.note, src: it.src };
}

export function getCode(id) {
  const it = raw.items.find(x => x.id === id);
  return it ? { id, code: it.code } : null;
}

// 프롬프트는 추출 시점의 기본 조절값으로 만든다. target만 바꿔 쓸 수 있다.
// 대상 이름을 바꾸면서 조사(이/가, 을/를, 은/는, 와/과)도 받침에 맞게 고친다.
function particle(word, pair) {
  const last = word.trim().slice(-1);
  const code = last.charCodeAt(0);
  const hasBatchim = code >= 0xac00 && code <= 0xd7a3 ? (code - 0xac00) % 28 !== 0 : false;
  const [withBatchim, without] = pair;
  return hasBatchim ? withBatchim : without;
}
const PARTICLES = [['이', '가'], ['을', '를'], ['은', '는'], ['과', '와']];
function replaceTarget(text, from, to) {
  let out = text;
  for (const [a, b] of PARTICLES) {
    out = out.split(`${from}${a}(${b})`).join(`${to}${particle(to, [a, b])}`);
  }
  return out.split(from).join(to);
}

export function getPrompt(id, { target } = {}) {
  const it = raw.items.find(x => x.id === id);
  if (!it) return null;
  let text = it.prompt;
  const to = target || it.target;
  if (it.target) text = replaceTarget(text, it.target, to);
  return { id, target: to, prompt: text, note: '조절값은 추출 시점의 기본값 기준입니다.' };
}

export const meta = { source: raw.source, count: raw.count };
