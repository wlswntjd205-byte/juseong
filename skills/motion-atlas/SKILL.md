---
name: motion-atlas
description: 반응형 애니메이션 도감(384개)에서 원하는 애니메이션을 찾아 코드와 AI 프롬프트를 바로 가져와 쓸 때 사용. 버튼 호버, 로딩, 텍스트 애니메이션, 3D 캐릭터 동작, 픽셀 이펙트, 차트, 영상 자막 등 "~ 애니메이션 가져와", "~ 효과 찾아줘"라는 요청에 쓴다.
---

# 반응형 애니메이션 도감 스킬 (motion-atlas)

도감의 384개 항목(CSS·JS 핵심 코드, 원리 설명, 조절값, AI 프롬프트)을 로컬 데이터로 갖고 있어서,
인터넷 없이 검색하고 바로 가져다 쓸 수 있다. 원본 페이지: https://motion-atlas-one.vercel.app

## 도구 (Node.js만 있으면 됨, 설치 불필요)
이 스킬 폴더의 `scripts/cli.js`를 실행한다. 스킬 폴더 경로는 보통 `~/.claude/skills/motion-atlas`.

```bash
S=~/.claude/skills/motion-atlas/scripts/cli.js
node $S cats                          # 카테고리와 항목 수
node $S search 버튼 호버              # 이름·설명으로 관련도순 검색
node $S list --cat ld                 # 카테고리별 목록 (ld = 로딩)
node $S show <id>                     # 항목 상세: 설명·원리·조절값
node $S code <id>                     # 핵심 CSS/JS 코드
node $S prompt <id> --target 버튼     # 적용 대상을 바꾼 AI 프롬프트
node $S --json search 픽셀            # JSON 출력 (다른 도구에서 읽기 좋음)
```

카테고리 id: `in` 등장 · `em` 강조 · `ia` 인터랙션 · `cp` 컴포넌트 · `ld` 로딩 · `ts` 텍스트·스크롤 · `icon` 아이콘 · `edit` 영상 편집 · `prompt` 프롬프트 · `ai` AI·이펙트 · `fx` 이펙트 · `ch` 차트 · `game` 3D 게임 이펙트 · `motion` 3D 캐릭터 동작 · `beast` 3D 동물 동작 · `bg` 커서·배경 · `mat` 재질 · `sim` 물리 시뮬레이션 · `hl` 헤어라인 · `pixel` 픽셀 아트

## 사용 절차
1. **찾기**: 요청을 한국어·영어 키워드로 `search`한다. 결과가 여러 개면 `show`로 설명을 보고 2~3개로 좁힌다.
2. **고르기**: 사용자 프로젝트의 기술 스택(순수 CSS, React, Vue, 캔버스 등)에 맞는 항목을 고른다. 도감 코드는 바닐라 JS·CSS 기준이다.
3. **가져오기**: `code <id>`로 핵심 코드를 받고, `prompt <id> --target <대상>`으로 적용 대상을 바꾼다.
4. **적용**: 사용자 코드에 맞게 이름·색·크기를 고친다. 프로젝트 테마가 있으면 그에 맞춘다.
5. **출처 명시**: 마지막 답변에 항목 id와 도감 링크를 함께 적는다.

## 규칙
- 도감 코드를 그대로 복사해 "원본"이라고 주장하지 않는다. 원리를 이해한 뒤 사용자 맥락에 맞게 적용한다.
- 조절값은 기본값 기준이다. 다른 값이 필요하면 `show <id>`의 `params`를 보고 직접 바꾼다.
- 접근성: `prefers-reduced-motion`을 고려하라고 덧붙인다. 도감의 많은 항목이 이미 이를 따른다.
- 도감에 없는 효과를 요청받으면 "도감에 없음"이라고 말하고, `search` 결과에서 가까운 항목을 제안한다.

## 예시
- "버튼에 클릭하면 물결이 퍼지는 효과 가져와" → `search 버튼 물결` → `code <id>` → 버튼 클래스에 적용
- "로딩 스피너 하나 추천해줘" → `list --cat ld` → `show <id>`로 설명 확인 후 추천
- "픽셀 폭발 효과 프롬프트 줘" → `search 픽셀 폭발` → `prompt <id> --target 캐릭터`
