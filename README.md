# 반응형 애니메이션 도감 · Responsive Animation Atlas

**🇰🇷 한국어** | [🇺🇸 English](#english)

반응형 애니메이션·재질·물리 시뮬레이션·헤어라인 도형·3D 게임 이펙트 등 **384개 항목**을 한 페이지에 모은 도감입니다.
각 항목은 살아 움직이는 미리보기, 조절바, 원리 설명, 핵심 코드, 그리고 AI에게 그대로 요청할 수 있는 프롬프트를 함께 제공합니다.

- 🔗 **바로 보기:** https://motion-atlas-one.vercel.app
- 📱 아이폰: 사파리에서 열고 공유 → 홈 화면에 추가하면 앱처럼 실행됩니다.
- 🎨 테마: 블랙 & 로즈실버

## Quick Start

### 1. 페이지 보기
브라우저에서 https://motion-atlas-one.vercel.app 을 열면 됩니다. 설치할 것은 없습니다.

### 2. Claude Code에 스킬 설치 (npx, 한 줄)
Node.js가 있으면 아래 명령 한 줄로 설치됩니다. `~/.claude/skills/motion-atlas`에 들어가서 Claude Code가 바로 인식합니다.
```bash
npx motion-atlas-skill
```
설치 후 Claude Code에서 이렇게 요청하면 됩니다.
```text
motion-atlas 스킬로 버튼 클릭 물결 애니메이션 가져와줘
```

### 3. Claude.ai · ChatGPT에 스킬 설치 (zip 업로드)
1. 스킬 zip을 받습니다.
   https://github.com/wlswntjd205-byte/juseong/raw/motion-atlas/skills/motion-atlas.zip
2. Claude.ai는 **설정 → 기능 → Skills**에서 zip을 업로드합니다.
3. ChatGPT는 zip을 채팅에 첨부하고 아래 프롬프트를 붙여넣습니다. ChatGPT는 명령어로 스킬을 설치하지 않습니다.
```text
첨부한 motion-atlas.zip의 SKILL.md와 scripts, data 파일을 읽고,
이 내용을 기준으로 "motion-atlas" 스킬을 만들어줘.
만든 뒤에는 Install을 눌러 워크스페이스에 설치할 수 있게 해줘.
```

### 4. 도감 스킬 자체를 새로 만들기 (animation-html, 선택)
도감 같은 HTML 페이지를 새로 만들고 싶다면 `animation-html` 스킬을 씁니다. 설치는 `skills/animation-html/` 폴더를 `~/.claude/skills/animation-html/`에 복사하면 됩니다.

### 5. 저장소를 로컬에서 쓰기 (CLI · API · MCP)
```bash
git clone -b motion-atlas https://github.com/wlswntjd205-byte/juseong
cd juseong/tools/motion-atlas-tools
npm install
node src/cli.js search 픽셀 폭발
node src/cli.js prompt fade --target 카드
```
자세한 사용법은 [`tools/motion-atlas-tools/README.md`](tools/motion-atlas-tools/README.md)를 보세요.

## 스킬 사용법

`animation-html` 스킬은 이 도감처럼 **단일 HTML 파일로 된 반응형 애니메이션 도감**을 만드는 규칙과 시작 파일을 Claude에게 알려줍니다. 요청할 때 스킬 이름(`animation-html`)을 언급하면 됩니다.

> **도감에서 애니메이션 가져오기:** `motion-atlas` 스킬을 쓰면 384개 항목을 검색하고 코드·프롬프트를 바로 받을 수 있습니다. 설치는 `npx motion-atlas-skill`입니다.

### 스킬이 따르는 작업 순서
1. **참고 자료 분석** — 참고 사이트나 GIF에서 움직임과 조절할 값을 정리합니다.
2. **시작 파일** — `templates/atlas-starter.html`을 복사해 새 도감을 시작합니다.
3. **항목 작성** — 항목마다 한글·영문 이름, 설명, 원리, 조절값, 재생 코드, AI 프롬프트를 채웁니다.
4. **출처 추가** — 참고한 사이트를 `SOURCES`에 넣으면 ? 도움말에 링크로 표시됩니다.
5. **검증** — 아래 `check.js`로 오류와 가로 넘침이 0인지 확인하고 스크린샷을 봅니다.
6. **배포** — 아티팩트로 게시하거나 GitHub에 올린 뒤 jsDelivr 또는 Vercel로 공개합니다.

### 항목 하나의 구조
```js
{ id:'fx-glow', cat:'fx', ko:'한글 이름', en:'English Name',
  target:'기본 적용 대상', desc:'무엇이 보이는지', how:'원리 설명',
  params:[R('dur','지속시간',700,100,2000,10,'ms')],
  build(st,p,c){ /* 무대 st, 조절값 p, 수명 c 로 DOM과 루프를 만든다 */ },
  code:p=>`조절값이 들어간 핵심 코드`,
  prompt:(p,t)=>`${t}에 ...를 만들어줘.\n- 지속시간: ${p.dur}ms` }
```

### 검증 (선택)
스킬 폴더에서 Playwright가 설치된 상태로 실행합니다.
```bash
cd skills/animation-html
NODE_PATH=$(npm root -g) node scripts/check.js 파일.html 출력폴더
```
출력 폴더의 스크린샷에서 어색한 항목을 확인하세요.

### 사용 예시
**예시 1 · 새 도감 만들기 (Claude Code)**
```text
animation-html 스킬로 반응형 애니메이션 도감을 새로 만들어줘.
주제는 "버튼 마이크로 인터랙션"이고 항목은 8개 정도.
각 항목에 한글·영문 이름, 설명, 원리, 조절값 2~3개, AI 프롬프트를 채워줘.
```

**예시 2 · 참고 사이트의 효과 하나 추가 (Claude Code · Claude.ai)**
```text
animation-html 스킬 규칙대로 https://example.com 의 카드 호버 효과를 분석해서
도감에 항목 1개(id: card-glow)로 추가해줘.
원본 코드는 복사하지 말고 원리를 다시 구현해줘.
```

**예시 3 · 기존 항목을 본떠서 만들기**
```text
reference/motion-atlas.html 에서 id:'fade' 항목을 찾아,
같은 구조로 '슬라이드 인' 항목을 하나 더 만들어줘.
```

**예시 4 · 조절값 바꾸고 검증하기**
```text
도감 파일의 'fx-glow' 항목에서 지속시간 범위를 100~3000ms로 바꾸고,
check.js로 검증한 뒤 어색한 항목이 있으면 알려줘.
```

**예시 5 · ChatGPT에서 motion-atlas 스킬로 찾기 (zip 첨부)**
```text
첨부한 motion-atlas 스킬로 로딩 스피너 애니메이션 3개를 찾아서,
각각 설명과 핵심 코드를 보여줘.
```

**예시 6 · 도감의 AI 프롬프트 바로 쓰기 (스킬 없이)**
도감에서 항목을 열고 **AI 명령 프롬프트**를 복사해 Claude·ChatGPT에 붙여넣으면, 조절값이 반영된 구현 요청이 됩니다. CLI로도 가능합니다.
```bash
node tools/motion-atlas-tools/src/cli.js prompt fade --target 카드
```

## 카테고리 · Categories

| 카테고리 | 항목 수 | 카테고리 | 항목 수 |
|---|---:|---|---:|
| 등장 Entrance | 8 | 영상 편집 Video Editing | 67 |
| 강조 Attention | 6 | 프롬프트 Prompts | 17 |
| 인터랙션 Interaction | 26 | AI·이펙트 AI & Effects | 7 |
| 컴포넌트 Components | 10 | 이펙트 Effects | 13 |
| 로딩 Loading | 5 | 차트 Charts | 12 |
| 텍스트·스크롤 Text & Scroll | 22 | 3D 게임 이펙트 3D Game Effects | 38 |
| 아이콘 Animated Icons | 49 | 3D 캐릭터 동작 3D Character Motion | 17 |
| 커서·배경 Cursor & Background | 5 | 3D 동물 동작 3D Animal Motion | 18 |
| 재질 Materials | 12 | 헤어라인 Hairline Figures | 33 |
| 물리 시뮬레이션 Physics | 3 | 픽셀 아트 이펙트 Pixel Art Effects | 16 |

## 저장소 구성 · Repository layout

| 경로 | 내용 |
|---|---|
| `index.html` | 도감 전체 (단일 파일) |
| `skills/animation-html/` | 도감 같은 페이지를 만드는 Claude 스킬 (SKILL.md, 템플릿, 검증 스크립트) |
| `skills/motion-atlas/` | 도감 스킬 (SKILL.md, 검색 CLI, 데이터). `npx motion-atlas-skill`로 설치 |
| `skills/motion-atlas.zip` | 도감 스킬 zip (Claude.ai·ChatGPT 업로드용) |
| `tools/motion-atlas-tools/` | 항목을 꺼내 쓰는 CLI · HTTP API · MCP 서버 |

## 출처 · License
- `@lucasmarkes/hairline` 0.5.1 (MIT) 엔진을 포함합니다. 라이선스 전문은 `index.html` 안에 있습니다.
- 픽셀 아트 이펙트 16종은 [pixelfx](https://patch-gg.github.io/pixelfx/) (MIT)를 참고해 직접 구현했습니다.
- 나머지 항목은 참고 사이트의 동작을 보고 직접 재현한 것입니다. 원본 코드를 복사하지 않았습니다.
- 브랜드 로고(인스타그램·카카오·X 등)는 상표 문제로 그리지 않았고, 범용 아이콘으로 대체했습니다.

---

## English

**🇺🇸 English** | [🇰🇷 한국어](#반응형-애니메이션-도감--responsive-animation-atlas)

An atlas that collects **384 items** on one page: responsive animations, materials, physics simulations, hairline figures, 3D game effects, and more.
Every item comes with a live preview, a control bar, an explanation of how it works, the core code, and a prompt you can give an AI as is.

- 🔗 **Live:** https://motion-atlas-one.vercel.app
- 📱 iPhone: open in Safari, then Share → Add to Home Screen to use it like an app.
- 🎨 Theme: black & rose silver

## Quick Start

### 1. View the page
Open https://motion-atlas-one.vercel.app in a browser. There is nothing to install.

### 2. Install the skill in Claude Code (npx, one line)
With Node.js installed, run this one line. It installs to `~/.claude/skills/motion-atlas`, where Claude Code picks it up.
```bash
npx motion-atlas-skill
```
Then ask Claude Code something like:
```text
Use the motion-atlas skill to get a button click ripple animation
```

### 3. Install the skill in Claude.ai or ChatGPT (zip upload)
1. Download the skill zip:
   https://github.com/wlswntjd205-byte/juseong/raw/motion-atlas/skills/motion-atlas.zip
2. Claude.ai: open **Settings → Capabilities → Skills** and upload the zip.
3. ChatGPT: attach the zip to a chat and paste this prompt. ChatGPT does not install skills from terminal commands.
```text
Read SKILL.md and the scripts and data files in the attached motion-atlas.zip,
and build a "motion-atlas" skill based on them.
When it is ready, let me press Install so it is added to my workspace.
```

### 4. Build your own atlas-style page with the animation-html skill (optional)
To build a new atlas-style HTML page, use the `animation-html` skill. Copy `skills/animation-html/` to `~/.claude/skills/animation-html/`.

### 5. Use the repository locally (CLI · API · MCP)
```bash
git clone -b motion-atlas https://github.com/wlswntjd205-byte/juseong
cd juseong/tools/motion-atlas-tools
npm install
node src/cli.js search 픽셀 폭발
node src/cli.js prompt fade --target card
```
See [`tools/motion-atlas-tools/README.md`](tools/motion-atlas-tools/README.md) for details.

## Skill usage

The `animation-html` skill tells Claude the rules and the starter file for building a **single-file responsive animation atlas** like this one. Mention the skill name (`animation-html`) in your request.

> **Fetch animations from the atlas:** the `motion-atlas` skill searches all 384 items and returns the code and prompts directly. Install with `npx motion-atlas-skill`.

### Steps the skill follows
1. **Study the reference** — note the motion and the values to control, from a reference site or GIF.
2. **Start from the template** — copy `templates/atlas-starter.html` for a new atlas.
3. **Write each item** — English and Korean names, description, how it works, parameters, play code, and an AI prompt.
4. **Add sources** — list the referenced sites in `SOURCES`; they appear as links in the ? help panel.
5. **Verify** — run `check.js` below and confirm zero errors and zero horizontal overflow, then look at the screenshots.
6. **Publish** — publish as an artifact, or push to GitHub and serve via jsDelivr or Vercel.

### Structure of one item
```js
{ id:'fx-glow', cat:'fx', ko:'한글 이름', en:'English Name',
  target:'default target', desc:'what you see', how:'how it works',
  params:[R('dur','Duration',700,100,2000,10,'ms')],
  build(st,p,c){ /* builds DOM and loops on stage st, params p, lifetime c */ },
  code:p=>`core code with parameter values`,
  prompt:(p,t)=>`Make ${t} ...\n- Duration: ${p.dur}ms` }
```

### Verify (optional)
Run from the skill folder with Playwright installed.
```bash
cd skills/animation-html
NODE_PATH=$(npm root -g) node scripts/check.js file.html output-folder
```
Check the screenshots in the output folder for anything that looks wrong.

### Usage examples
**Example 1 · New atlas (Claude Code)**
```text
Using the animation-html skill, build a new responsive animation atlas.
Topic: "button micro-interactions", about 8 items.
Each item needs English and Korean names, a description, how it works, 2–3 parameters, and an AI prompt.
```

**Example 2 · Add one effect from a reference site (Claude Code · Claude.ai)**
```text
Following the animation-html skill rules, analyze the card hover effect at https://example.com
and add it to the atlas as one item (id: card-glow).
Do not copy the original code; re-implement the principle.
```

**Example 3 · Model a new item on an existing one**
```text
In reference/motion-atlas.html, find the item with id:'fade',
and make one more item with the same structure called "slide in".
```

**Example 4 · Change parameters and verify**
```text
In the atlas file, change the duration range of the 'fx-glow' item to 100–3000ms,
verify with check.js, and tell me about any item that looks wrong.
```

**Example 5 · Find items with the motion-atlas skill in ChatGPT (zip attached)**
```text
Using the attached motion-atlas skill, find 3 loading-spinner animations
and show the description and core code for each.
```

**Example 6 · Use an atlas prompt directly (no skill needed)**
Open an item in the atlas and copy its **AI prompt**, then paste it into Claude or ChatGPT. The prompt already includes your parameter values. From the CLI:
```bash
node tools/motion-atlas-tools/src/cli.js prompt fade --target card
```

## Categories

| Category | Items | Category | Items |
|---|---:|---|---:|
| 등장 Entrance | 8 | 영상 편집 Video Editing | 67 |
| 강조 Attention | 6 | 프롬프트 Prompts | 17 |
| 인터랙션 Interaction | 26 | AI·이펙트 AI & Effects | 7 |
| 컴포넌트 Components | 10 | 이펙트 Effects | 13 |
| 로딩 Loading | 5 | 차트 Charts | 12 |
| 텍스트·스크롤 Text & Scroll | 22 | 3D 게임 이펙트 3D Game Effects | 38 |
| 아이콘 Animated Icons | 49 | 3D 캐릭터 동작 3D Character Motion | 17 |
| 커서·배경 Cursor & Background | 5 | 3D 동물 동작 3D Animal Motion | 18 |
| 재질 Materials | 12 | 헤어라인 Hairline Figures | 33 |
| 물리 시뮬레이션 Physics | 3 | 픽셀 아트 이펙트 Pixel Art Effects | 16 |

## Repository layout

| Path | Contents |
|---|---|
| `index.html` | The whole atlas (single file) |
| `skills/animation-html/` | The Claude skill that builds atlas-style pages (SKILL.md, templates, checker) |
| `skills/motion-atlas/` | The atlas skill (SKILL.md, search CLI, data). Install with `npx motion-atlas-skill` |
| `skills/motion-atlas.zip` | Atlas skill zip for uploading to Claude.ai or ChatGPT |
| `tools/motion-atlas-tools/` | CLI, HTTP API and MCP server for reading the items |

## Credits & License
- Includes the `@lucasmarkes/hairline` 0.5.1 engine (MIT). The full license text is inside `index.html`.
- The 16 pixel-art effects are re-implemented by hand from [pixelfx](https://patch-gg.github.io/pixelfx/) (MIT).
- The other items were rebuilt by hand after studying the behavior on reference sites. No original code was copied.
- Brand logos (Instagram, KakaoTalk, X, etc.) are not drawn because of trademark issues. Generic icons are used instead.
