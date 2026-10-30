// 애니메이션 HTML 검증: 데스크톱 + iPhone 13 에서 모든 카드/항목을 열어 오류·가로 넘침을 확인하고 스크린샷을 남긴다.
// 사용: NODE_PATH=$(npm root -g) node check.js <html 경로> [출력 폴더] [항목 id 정규식]
// 카드: .card 또는 .card2 [data-id], 상세 무대: #stage, 상세 시트: .sheet
const { chromium, devices } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const file = path.resolve(process.argv[2] || 'index.html');
  const out = path.resolve(process.argv[3] || 'shots'); fs.mkdirSync(out, { recursive: true });
  const only = process.argv[4] ? new RegExp(process.argv[4]) : null;
  let html = fs.readFileSync(file, 'utf8');
  if (!/^\s*<!doctype/i.test(html)) {           // 아티팩트용 조각 파일이면 문서 껍데기를 씌운다
    html = '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>' + html + '</body></html>';
  }
  const tmp = path.join(out, '_wrapped.html'); fs.writeFileSync(tmp, html);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  let fail = 0;
  for (const mode of ['desk', 'phone']) {
    const ctx = mode === 'desk' ? await b.newContext({ viewport: { width: 1360, height: 900 } }) : await b.newContext({ ...devices['iPhone 13'] });
    const pg = await ctx.newPage(); let errs = [];
    pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
    await pg.goto('file://' + tmp); await pg.waitForTimeout(1500);
    await pg.screenshot({ path: path.join(out, `grid-${mode}.png`) });
    const ids = (await pg.evaluate(() => [...document.querySelectorAll('[data-id]')].map(c => c.dataset.id))).filter(i => !only || only.test(i));
    const bad = [];
    for (const id of ids) {
      errs = [];
      await pg.evaluate(id => document.querySelector(`[data-id="${id}"]`).click(), id);
      await pg.waitForTimeout(mode === 'desk' ? 1500 : 700);
      const ov = await pg.evaluate(() => { const s = document.querySelector('.sheet'); return s ? s.scrollWidth - s.clientWidth : 0; });
      if (mode === 'desk') { const st = await pg.$('#stage'); if (st) await st.screenshot({ path: path.join(out, `d-${id}.png`) }); }
      if (errs.length || ov > 0) bad.push({ id, overflow: ov, errors: errs.slice(0, 2) });
      await pg.keyboard.press('Escape'); await pg.waitForTimeout(150);
    }
    const pageOv = await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    console.log(mode, 'items', ids.length, 'pageOverflowX', pageOv, 'bad', JSON.stringify(bad));
    fail += bad.length + (pageOv > 0 ? 1 : 0);
    await ctx.close();
  }
  await b.close();
  process.exit(fail ? 1 : 0);
})();
