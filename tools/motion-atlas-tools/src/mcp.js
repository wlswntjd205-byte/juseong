#!/usr/bin/env node
// motion-atlas MCP 서버 (stdio). Claude Desktop·Claude Code 등에서 도감 항목을 도구로 쓸 수 있다.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { listCategories, listItems, searchItems, getItem, getCode, getPrompt, meta } from './atlas.js';

const server = new McpServer({ name: 'motion-atlas', version: '0.1.0' });
const text = value => ({ content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }] });
const fail = msg => ({ content: [{ type: 'text', text: msg }], isError: true });

server.registerTool('list_categories', {
  description: `반응형 애니메이션 도감의 카테고리 목록과 항목 수 (총 ${meta.count}개).`,
}, () => text(listCategories()));

server.registerTool('list_items', {
  description: '카테고리(cat) 또는 검색어(q)로 도감 항목 목록을 가져온다. 코드·프롬프트 본문은 포함하지 않는다.',
  inputSchema: { cat: z.string().optional().describe('카테고리 id, 예: in, em, ia, px, liquid'), q: z.string().optional().describe('이름·설명 검색어') },
}, ({ cat, q }) => {
  try { return text(listItems({ cat, q })); } catch (e) { return fail(e.message); }
});

server.registerTool('search_items', {
  description: '자연어 검색어로 도감 항목을 관련도순으로 찾는다. 예: "화면 흔들림", "픽셀 폭발".',
  inputSchema: { query: z.string().describe('검색어 (한글·영문)'), limit: z.number().int().min(1).max(100).optional() },
}, ({ query, limit }) => text(searchItems(query, limit || 20)));

server.registerTool('get_item', {
  description: '항목 하나의 상세 정보(설명·원리·조절값)를 가져온다.',
  inputSchema: { id: z.string().describe('항목 id, 예: fade') },
}, ({ id }) => { const it = getItem(id); return it ? text(it) : fail(`없는 항목: ${id}`); });

server.registerTool('get_code', {
  description: '항목의 핵심 CSS/JS 코드를 가져온다 (기본 조절값 기준).',
  inputSchema: { id: z.string() },
}, ({ id }) => { const c = getCode(id); return c ? text(c.code) : fail(`없는 항목: ${id}`); });

server.registerTool('get_prompt', {
  description: '항목을 AI에게 요청할 때 쓰는 프롬프트를 가져온다. target으로 적용 대상(예: 카드, 제목)을 바꿀 수 있다.',
  inputSchema: { id: z.string(), target: z.string().optional().describe('적용 대상 이름, 예: 카드') },
}, ({ id, target }) => { const p = getPrompt(id, { target }); return p ? text(p.prompt) : fail(`없는 항목: ${id}`); });

await server.connect(new StdioServerTransport());
