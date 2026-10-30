---
name: animation-html
description: 반응형 애니메이션·인터랙션·차트·재질 효과를 단일 HTML 파일(도감/쇼케이스 또는 단일 데모)로 만들 때 사용. 살아 움직이는 미리보기 카드, 조절바, 원리·코드, 조절값이 반영되는 AI 프롬프트, 블랙&로즈실버 테마, 아이폰 대응까지 포함.
---

# 애니메이션 HTML 스킬

반응형 애니메이션을 **하나의 HTML 파일**로 만든다. 기본 형태는 "애니메이션 도감":
목록은 저절로 재생되는 미리보기 카드 → 카드를 누르면 큰 미리보기 + 조절바 + 설명·원리·핵심 코드 + AI 프롬프트.
단일 애니메이션 데모를 요청받아도 같은 규약(build/play, ctx 정리, 아이폰 규칙)을 따른다.

## 파일 구성
- `templates/atlas-starter.html` — 바로 쓰는 최소 도감(카드 미리보기·상세 시트·조절바·프롬프트·? 도움말·출처). **새 도감은 여기서 시작.**
- `reference/motion-atlas.html` — 176종이 들어 있는 완성본. 비슷한 효과가 있으면 해당 항목의 build 코드를 찾아 참고(`id:'항목id'`로 검색).
- `scripts/check.js` — Playwright 검증(데스크톱 + iPhone 13, 모든 항목 열기, 오류·가로 넘침 검사, 스크린샷).

## 작업 순서
1. **자료 먼저**: 참고 사이트·GIF·패키지 사양이 있으면 먼저 분석한다(WebFetch / 이미지 보기). 무엇이 어떻게 움직이는지, 조절할 값이 무엇인지 목록으로 정리.
2. **스타터 복사** 후 `ITEMS` 배열에 항목 추가. 분류가 새로 생기면 `CATS`에 `[키,'한글','English']` 추가.
3. **항목 작성**(아래 규약) — 각 항목에 desc / how / params / build / code / prompt 모두 채움. 한국어로.
4. **출처**: `SOURCES`에 `[url, 이름, 여기서 참고한 항목]` 추가 → ? 도움말 창에 링크로 표시. 상세 화면 메타에는 항목의 `src`.
5. **검증**: `NODE_PATH=$(npm root -g) node scripts/check.js 파일.html 출력폴더` → bad 0, overflow 0 확인. 출력 폴더의 grid/d-*.png 스크린샷을 직접 보고 어색한 항목 수정.
6. **배포**: 아티팩트로 게시, 공개 웹이 필요하면 GitHub에 push → jsDelivr(`cdn.jsdelivr.net/gh/user/repo@커밋SHA/index.html`) 또는 Vercel. (githack을 Vercel rewrite 대상으로 쓰면 403)

## 항목 규약
```js
{id:'fx-glow', cat:'fx', isNew:1, touch:1, src:'참고사이트',
 ko:'한글 이름', en:'English Name', target:'기본 적용 대상(프롬프트용)', hint:'상세 무대 아래 조작 안내',
 icon:'<path d="..."/>',          // 24×24 viewBox 안의 SVG 조각, stroke는 url(#rsg)
 desc:'무엇이 보이는지 + 어디에 쓰는지',
 how:'원리 설명 (어떤 속성/수식/API로 만드는지)',
 params:[R('dur','지속시간',700,100,2000,10,'ms'), SEL('mode','방식','a',[['a','A'],['b','B']])],
 build(st,p,c){ /* st: 무대(카드에선 400×300 가상 무대), p: 조절값, c: {alive,on(cleanup)} */
   ...DOM 생성, 이벤트 등록, 필요하면 loop(c, (t,dt)=>{...})
   return cc => promise;   // 자동 시연. Promise/Animation을 돌려주면 끝난 뒤 반복, null이면 자체 루프
 },
 code:p=>`조절값이 들어간 핵심 코드`,
 prompt:(p,t)=>`${t}에 ...를 만들어줘.\n- 조절값 ${p.dur}ms ...\n- 터치/접근성 조건`}
```
- **play는 반드시 자동 시연**한다: 포인터 상호작용 항목도 `vPath(cc, ms, u=>...)`로 가상 포인터 경로를 돌려 카드에서 혼자 움직이게. 카드 미리보기는 `pointer-events:none`이라 시연이 없으면 정지 화면이 된다.
- 모든 rAF 루프는 `loop(c, fn)` 또는 `c.alive` 확인으로 멈출 수 있어야 한다. 전역 `ctx` 참조 금지 — 인자로 받은 `c`/`cc`만.
- SVG `id`(filter, gradient, clipPath)는 `Math.random()`으로 고유하게 — 카드와 상세가 동시에 존재한다.
- 크기는 `st.clientWidth/clientHeight` 기준(카드 400×300, 상세 약 500×300, 아이폰 약 340×260). 넘치지 않게 `min()`으로 맞춘다.
- 포인터 좌표는 `stPos(st,e)`(축소된 카드에서도 무대 좌표로 변환).
- 드래그 항목은 `touch:1`(무대에 `touch-action:none`) + `setPointerCapture`.
- WebGL은 카드 수만큼 컨텍스트가 생기므로 정리 시 `WEBGL_lose_context`(스타터에 구현됨). 무거운 효과는 해상도를 낮춘 canvas.

## 디자인 규칙 (블랙 & 로즈실버)
- 배경 `#0b0a0b`, 표면 `#141214`, 선 `#2a2427/#3d3236`, 글자 `#efe6e7`, 보조 `#9a8c90`, 로즈 `#dcaaac` / 하이 `#f6dad7` / 강조 `#f3b7bd`, 보조색 블루실버 `#c9d6ef`.
- 메탈 그라디언트 `--metal`(버튼·칩·오브젝트), 아이콘 stroke `url(#rsg)`.
- 글꼴: Marcellus(영문 디스플레이) · Gowun Batang(한글 제목) · IBM Plex Sans KR(본문) · JetBrains Mono(숫자·코드).
- 무대는 방사형 어두운 배경 + 24px 로즈 격자.
- 이징 기본 `cubic-bezier(.16,1,.3,1)`, 튀는 스프링 `cubic-bezier(.34,1.56,.64,1)`.

## 아이폰·성능 규칙
- 입력·select 글자 16px(자동 확대 방지), `viewport-fit=cover` + safe-area 여백, `-webkit-backdrop-filter` 병기.
- 560px 이하: 카드 2열, 상세 시트 전체 화면, 무대 높이 260px. 가로 스크롤 0.
- 카드 미리보기는 IntersectionObserver로 **보이는 것만 실행**, 상세·도움말이 열리면 일시정지, 탭이 숨겨지면 정지.
- `prefers-reduced-motion`이면 카드 미리보기 대신 정지 아이콘.
- transform·opacity 위주로 애니메이션(레이아웃 재계산 회피).

## 프롬프트 작성 규칙
- 첫 줄: "`${t}`에 ~를 만들어줘 (참고: 사이트 스타일)".
- 이어서 `- ` 목록으로 구조, 정확한 수치(조절값 그대로), 이징, 상호작용, 터치·접근성·reduced-motion 조건.
- 원본 코드를 복사하지 말고 원리를 다시 구현한다(MIT 패키지를 그대로 넣을 땐 라이선스 전문 포함).

## 마무리 보고
결과물 링크/파일 + 추가된 항목 수와 목록 + 검증 결과(오류 0, 넘침 0) + 출처 목록을 짧게.
