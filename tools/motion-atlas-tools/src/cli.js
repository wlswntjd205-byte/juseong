#!/usr/bin/env node
// motion-atlas CLI: 도감 항목을 터미널에서 찾고, 코드·프롬프트를 꺼낸다.
import { listCategories, listItems, searchItems, getItem, getCode, getPrompt, meta } from './atlas.js';

const HELP = `motion-atlas — 반응형 애니메이션 도감 CLI (${meta.count}개 항목)

사용법
  motion-atlas cats                         카테고리 목록
  motion-atlas list [--cat <id>] [--q <검색어>]   항목 목록
  motion-atlas search <검색어>              이름·설명 검색 (관련도순)
  motion-atlas show <id>                    항목 상세 (JSON)
  motion-atlas code <id>                    핵심 코드 출력
  motion-atlas prompt <id> [--target <대상>]  AI 명령 프롬프트 출력
  motion-atlas --json ...                   모든 출력을 JSON으로
`;

function parse(argv) {
  const flags = {}; const pos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') flags.json = true;
    else if (a === '-h' || a === '--help') flags.help = true;
    else if (a.startsWith('--')) { flags[a.slice(2)] = argv[++i]; }
    else pos.push(a);
  }
  return { flags, pos };
}

function print(value, asJson, text) {
  if (asJson) console.log(JSON.stringify(value, null, 2));
  else console.log(text ?? value);
}

function fmtList(items) {
  return items.map(it => `${it.id.padEnd(22)} ${String(it.cat).padEnd(8)} ${it.ko}${it.en ? ` · ${it.en}` : ''}`).join('\n');
}

function fail(msg) { console.error(`오류: ${msg}`); process.exit(1); }

export function run(argv) {
  const { flags, pos } = parse(argv);
  const [cmd, arg] = pos;
  const asJson = !!flags.json;
  if (flags.help || !cmd || cmd === 'help') return console.log(HELP);

  switch (cmd) {
    case 'cats': {
      const cats = listCategories();
      return print(cats, asJson, cats.map(c => `${c.id.padEnd(10)} ${String(c.count).padStart(4)}  ${c.ko}${c.en ? ` · ${c.en}` : ''}`).join('\n'));
    }
    case 'list': {
      const items = listItems({ cat: flags.cat, q: flags.q });
      return print(items, asJson, fmtList(items) || '(결과 없음)');
    }
    case 'search': {
      if (!arg) fail('검색어를 입력하세요.');
      const items = searchItems(pos.slice(1).join(' '));
      return print(items, asJson, fmtList(items) || '(결과 없음)');
    }
    case 'show': {
      if (!arg) fail('항목 id를 입력하세요.');
      const it = getItem(arg);
      if (!it) fail(`없는 항목: ${arg}`);
      return print(it, true, JSON.stringify(it, null, 2));
    }
    case 'code': {
      if (!arg) fail('항목 id를 입력하세요.');
      const c = getCode(arg);
      if (!c) fail(`없는 항목: ${arg}`);
      return asJson ? print(c, true) : console.log(c.code);
    }
    case 'prompt': {
      if (!arg) fail('항목 id를 입력하세요.');
      const p = getPrompt(arg, { target: flags.target });
      if (!p) fail(`없는 항목: ${arg}`);
      return asJson ? print(p, true) : console.log(p.prompt);
    }
    default:
      fail(`알 수 없는 명령: ${cmd}\n\n${HELP}`);
  }
}

// 직접 실행된 경우에만 동작 (테스트에서 import 가능하도록)
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('cli.js')) {
  run(process.argv.slice(2));
}
