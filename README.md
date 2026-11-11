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

### 2. Claude Code에 스킬 설치
아래 방법 중 하나를 고르세요. 모두 `~/.claude/skills/motion-atlas`에 설치되며, Claude Code가 바로 인식합니다.

**A. npx (Node.js 필요, 한 줄)**
```bash
npx motion-atlas-skill
```

**B. curl (npm 없이, macOS·Linux)**
```bash
mkdir -p ~/.claude/skills/motion-atlas && curl -sSL https://github.com/wlswntjd205-byte/juseong/archive/refs/heads/motion-atlas.tar.gz | tar -xz --wildcards --strip-components=3 -C ~/.claude/skills/motion-atlas 'juseong-motion-atlas/skills/motion-atlas/*'
```

**C. git (저장소 일부만 받기)**
```bash
git clone -q --depth 1 --filter=blob:none --sparse -b motion-atlas https://github.com/wlswntjd205-byte/juseong.git atlas-tmp && git -C atlas-tmp sparse-checkout set skills/motion-atlas && mkdir -p ~/.claude/skills && cp -r atlas-tmp/skills/motion-atlas ~/.claude/skills/ && rm -rf atlas-tmp
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

### 4. 저장소를 로컬에서 쓰기 (CLI · API · MCP)
```bash
git clone -b motion-atlas https://github.com/wlswntjd205-byte/juseong
cd juseong/tools/motion-atlas-tools
npm install
node src/cli.js search 픽셀 폭발
node src/cli.js prompt fade --target 카드
```
자세한 사용법은 [`tools/motion-atlas-tools/README.md`](tools/motion-atlas-tools/README.md)를 보세요.

## 스킬 사용법

`motion-atlas` 스킬은 도감의 384개 애니메이션을 검색해서 코드와 AI 프롬프트를 바로 가져다 쓰게 해 줍니다. 인터넷 없이 로컬 데이터로 동작합니다.

### 명령어
스킬 폴더의 `scripts/cli.js`를 실행합니다. Node.js만 있으면 됩니다.
```bash
S=~/.claude/skills/motion-atlas/scripts/cli.js
node $S cats                          # 카테고리와 항목 수
node $S search 버튼 호버              # 이름·설명으로 검색
node $S list --cat ld                 # 카테고리별 목록
node $S show <id>                     # 항목 설명·원리·조절값
node $S code <id>                     # 핵심 코드
node $S prompt <id> --target 버튼     # 적용 대상을 바꾼 AI 프롬프트
```

### 사용 예시
**예시 1 · Claude Code에서 찾아 쓰기**
```text
motion-atlas 스킬로 버튼 클릭 물결 애니메이션을 찾아서 코드를 가져와줘.
내 프로젝트는 순수 CSS야.
```

**예시 2 · Claude.ai에서 추천받기**
```text
motion-atlas 스킬로 로딩 스피너 애니메이션 추천 3개와 각각의 설명을 알려줘.
```

**예시 3 · ChatGPT에서 zip으로 찾기**
```text
첨부한 motion-atlas 스킬로 로딩 스피너 애니메이션 3개를 찾아서,
각각 설명과 핵심 코드를 보여줘.
```

**예시 4 · 도감의 AI 프롬프트 바로 쓰기 (스킬 없이)**
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
| `skills/motion-atlas/` | 도감 스킬 (SKILL.md, 검색 CLI, 데이터, npx 설치기) |
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

### 2. Install the skill in Claude Code
Pick one of the methods below. Each installs to `~/.claude/skills/motion-atlas`, where Claude Code picks it up.

**A. npx (needs Node.js, one line)**
```bash
npx motion-atlas-skill
```

**B. curl (no npm needed, macOS · Linux)**
```bash
mkdir -p ~/.claude/skills/motion-atlas && curl -sSL https://github.com/wlswntjd205-byte/juseong/archive/refs/heads/motion-atlas.tar.gz | tar -xz --wildcards --strip-components=3 -C ~/.claude/skills/motion-atlas 'juseong-motion-atlas/skills/motion-atlas/*'
```

**C. git (only the skill folder)**
```bash
git clone -q --depth 1 --filter=blob:none --sparse -b motion-atlas https://github.com/wlswntjd205-byte/juseong.git atlas-tmp && git -C atlas-tmp sparse-checkout set skills/motion-atlas && mkdir -p ~/.claude/skills && cp -r atlas-tmp/skills/motion-atlas ~/.claude/skills/ && rm -rf atlas-tmp
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

### 4. Use the repository locally (CLI · API · MCP)
```bash
git clone -b motion-atlas https://github.com/wlswntjd205-byte/juseong
cd juseong/tools/motion-atlas-tools
npm install
node src/cli.js search 픽셀 폭발
node src/cli.js prompt fade --target card
```
See [`tools/motion-atlas-tools/README.md`](tools/motion-atlas-tools/README.md) for details.

## Skill usage

The `motion-atlas` skill searches the atlas's 384 animations and gives you the code and AI prompts directly. It runs on local data, without the internet.

### Commands
Run `scripts/cli.js` in the skill folder. Only Node.js is needed.
```bash
S=~/.claude/skills/motion-atlas/scripts/cli.js
node $S cats                          # categories and item counts
node $S search 버튼 호버              # search by name or description
node $S list --cat ld                 # list one category
node $S show <id>                     # description, how it works, parameters
node $S code <id>                     # core code
node $S prompt <id> --target 버튼     # AI prompt with a different target
```

### Usage examples
**Example 1 · Find and use an item in Claude Code**
```text
Use the motion-atlas skill to find a button click ripple animation and get its code.
My project uses plain CSS.
```

**Example 2 · Ask for recommendations in Claude.ai**
```text
Use the motion-atlas skill to recommend 3 loading-spinner animations and explain each one.
```

**Example 3 · Find items in ChatGPT with the zip**
```text
Using the attached motion-atlas skill, find 3 loading-spinner animations
and show the description and core code for each.
```

**Example 4 · Use an atlas prompt directly (no skill needed)**
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
| `skills/motion-atlas/` | The atlas skill (SKILL.md, search CLI, data, npx installer) |
| `skills/motion-atlas.zip` | Atlas skill zip for uploading to Claude.ai or ChatGPT |
| `tools/motion-atlas-tools/` | CLI, HTTP API and MCP server for reading the items |

## Credits & License
- Includes the `@lucasmarkes/hairline` 0.5.1 engine (MIT). The full license text is inside `index.html`.
- The 16 pixel-art effects are re-implemented by hand from [pixelfx](https://patch-gg.github.io/pixelfx/) (MIT).
- The other items were rebuilt by hand after studying the behavior on reference sites. No original code was copied.
- Brand logos (Instagram, KakaoTalk, X, etc.) are not drawn because of trademark issues. Generic icons are used instead.
