// Prompt-copy counter for the animation atlas.
// GET  /api/copies          -> { [id]: count }
// POST /api/copies?id=<id>  -> { count }
// Storage: one private JSON blob in Vercel Blob (store motion-atlas-counts).
import { put, get, head } from '@vercel/blob';

const PATH = 'copies.json';
const ID_RE = /^[a-z0-9][a-z0-9-]{0,80}$/;

async function readMap() {
  try {
    const meta = await head(PATH, { token: process.env.BLOB_READ_WRITE_TOKEN });
    const res = await get(PATH, { access: 'private', useCache: false, token: process.env.BLOB_READ_WRITE_TOKEN });
    if (!res || res.statusCode !== 200) return { map: {}, etag: meta.etag };
    const text = await new Response(res.stream).text();
    return { map: JSON.parse(text || '{}'), etag: meta.etag };
  } catch (e) {
    console.error('copies readMap:', e && e.name, e && e.message);
    if (e && (e.name === 'BlobNotFoundError' || /not found/i.test(e.message || ''))) return { map: {}, etag: null };
    throw e;
  }
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { map } = await readMap();
      return res.status(200).json(map);
    }

    if (req.method === 'POST') {
      const id = String(req.query.id || '');
      if (!ID_RE.test(id)) return res.status(400).json({ error: 'bad id' });

      let count = 0;
      for (let attempt = 0; attempt < 6; attempt++) {
        const { map, etag } = await readMap();
        map[id] = (map[id] || 0) + 1;
        count = map[id];
        try {
          await put(PATH, JSON.stringify(map), {
            access: 'private',
            contentType: 'application/json',
            allowOverwrite: true,
            addRandomSuffix: false,
            token: process.env.BLOB_READ_WRITE_TOKEN,
            ...(etag ? { ifMatch: etag } : {}),
          });
          return res.status(200).json({ count });
        } catch (e) {
          if (e && e.name === 'BlobPreconditionFailedError') continue; // someone else wrote first; retry
          throw e;
        }
      }
      return res.status(503).json({ error: 'busy' });
    }

    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    console.error('copies:', e && e.name, e && e.message);
    return res.status(500).json({ error: 'server error' });
  }
}
