#!/usr/bin/env node
// 사용법: npx motion-atlas-skill [--dir <설치 폴더>]
// 기본 설치 위치: ~/.claude/skills/motion-atlas (Claude Code가 자동으로 인식)
import { cp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const dirIdx = args.indexOf('--dir');
const target = dirIdx >= 0 && args[dirIdx + 1]
  ? path.resolve(args[dirIdx + 1])
  : path.join(os.homedir(), '.claude', 'skills', 'motion-atlas');

if (args.includes('-h') || args.includes('--help')) {
  console.log('사용법: npx motion-atlas-skill [--dir <설치 폴더>]\n기본값: ~/.claude/skills/motion-atlas');
  process.exit(0);
}

const parts = ['package.json', 'SKILL.md', 'scripts', 'data'];
await mkdir(path.dirname(target), { recursive: true });
if (existsSync(target)) await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
for (const part of parts) {
  await cp(path.join(root, part), path.join(target, part), { recursive: true });
}
console.log(`설치 완료: ${target}`);
console.log('Claude Code에서 "motion-atlas 스킬로 호버 애니메이션 찾아줘"처럼 요청하세요.');
