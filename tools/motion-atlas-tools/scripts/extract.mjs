// 도감 원본(index.html)을 headless Chromium에서 열어 ITEMS/CATS를 JSON으로 뽑는다.
// 사용법: PLAYWRIGHT_PATH=<playwright 모듈 경로> node scripts/extract.mjs [path/to/index.html]
import path from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
// Playwright 모듈: PLAYWRIGHT_PATH로 지정하거나 프로젝트에 설치된 것을 쓴다.
const pw = await import(process.env.PLAYWRIGHT_PATH || 'playwright');
const chromium = pw.chromium || pw.default.chromium;
const src = path.resolve(process.argv[2] || path.join(here, '../../../index.html'));
const out = path.join(here, '../../../skills/motion-atlas/data/atlas.json');

const browser = await chromium.launch();
const page = await browser.newPage();
// 외부 CDN(폰트·three.js 등)은 차단: 데이터 추출에는 필요 없다.
await page.route(/^https?:/, r => r.abort());
// 아틀라스 스크립트는 즉시실행 함수 안에 있어 ITEMS/CATS가 바깥에서 안 보인다.
// 선언을 window에도 걸어 둔 복사본을 메모리에서 연다(원본 파일은 건드리지 않음).
const { readFile } = await import('node:fs/promises');
let html = await readFile(src, 'utf8');
const hook = (h, name) => h.replace(new RegExp(`const ${name}=`), `const ${name}=window.__${name}=`);
html = hook(hook(html, 'ITEMS'), 'CATS');
await page.setContent(html, { waitUntil: 'domcontentloaded' });

const data = await page.evaluate(() => {
  const ITEMS = window.__ITEMS, CATS = window.__CATS;
  const defaults = it => Object.fromEntries((it.params || []).map(r => [r.k, r.v]));
  const safe = fn => { try { return fn(); } catch (e) { return null; } };
  const items = ITEMS.map(it => {
    const p = defaults(it);
    return {
      id: it.id, cat: it.cat, ko: it.ko, en: it.en, target: it.target || null,
      desc: it.desc || null, how: it.how || null, note: it.note || null,
      src: it.src || null,
      params: (it.params || []).map(({ k, l, v, min, max, step, u }) => ({ k, l, v, min, max, step, u: u || '' })),
      code: safe(() => it.code(p)),
      prompt: safe(() => it.prompt(p, it.target)),
    };
  });
  const cats = CATS.map(c => ({ id: c[0], ko: c[1], en: c[2] }));
  return { cats, items };
});
await browser.close();

const failed = data.items.filter(i => i.code === null || i.prompt === null).map(i => i.id);
await mkdir(path.dirname(out), { recursive: true });
await writeFile(out, JSON.stringify({ source: 'index.html', count: data.items.length, ...data }, null, 1) + '\n');
console.log(`items ${data.items.length}, cats ${data.cats.length}, code/prompt failed: ${failed.length ? failed.join(',') : 'none'}`);
