// motion-atlas HTTP API. 읽기 전용 JSON 엔드포인트.
//   GET /api/health
//   GET /api/categories
//   GET /api/items?cat=&q=
//   GET /api/items/:id
//   GET /api/items/:id/code
//   GET /api/items/:id/prompt?target=
//   GET /api/search?q=&limit=
import http from 'node:http';
import { listCategories, listItems, searchItems, getItem, getCode, getPrompt, meta } from './atlas.js';

const PORT = Number(process.env.PORT || 8787);

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=300',
  });
  res.end(JSON.stringify(body, null, 2));
}

export function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const parts = url.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  const q = url.searchParams;
  if (req.method !== 'GET') return send(res, 405, { error: 'GET만 지원합니다.' });
  try {
    if (parts[0] !== 'api') return send(res, 404, { error: '경로는 /api 아래에 있습니다.' });
    const [, a, b, c] = parts;
    if (a === 'health') return send(res, 200, { ok: true, ...meta });
    if (a === 'categories' && !b) return send(res, 200, listCategories());
    if (a === 'search' && !b) {
      const term = q.get('q') || '';
      if (!term) return send(res, 400, { error: 'q 파라미터가 필요합니다.' });
      return send(res, 200, searchItems(term, Math.min(Number(q.get('limit') || 20), 100)));
    }
    if (a === 'items' && !b) return send(res, 200, listItems({ cat: q.get('cat') || undefined, q: q.get('q') || undefined }));
    if (a === 'items' && b) {
      const id = decodeURIComponent(b);
      if (!c) {
        const it = getItem(id);
        return it ? send(res, 200, it) : send(res, 404, { error: `없는 항목: ${id}` });
      }
      if (c === 'code') {
        const x = getCode(id);
        return x ? send(res, 200, x) : send(res, 404, { error: `없는 항목: ${id}` });
      }
      if (c === 'prompt') {
        const x = getPrompt(id, { target: q.get('target') || undefined });
        return x ? send(res, 200, x) : send(res, 404, { error: `없는 항목: ${id}` });
      }
    }
    return send(res, 404, { error: '없는 경로입니다.' });
  } catch (e) {
    return send(res, 400, { error: e.message });
  }
}

// 직접 실행된 경우에만 서버를 띄운다.
if (process.argv[1]?.endsWith('server.js')) {
  http.createServer(handle).listen(PORT, () => {
    console.log(`motion-atlas API: http://localhost:${PORT}/api/health (항목 ${meta.count}개)`);
  });
}
