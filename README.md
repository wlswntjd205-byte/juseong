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

### 2. Claude Code에 스킬 설치 (터미널에서 한 번 실행)
```bash
mkdir -p ~/.claude/skills/animation-html && curl -sSL https://github.com/wlswntjd205-byte/juseong/archive/refs/heads/motion-atlas.tar.gz | tar -xz --wildcards --strip-components=3 -C ~/.claude/skills/animation-html 'juseong-motion-atlas/skills/animation-html/*'
```
설치 후 Claude Code에서 "animation-html 스킬로 반응형 애니메이션 도감 만들어줘"라고 요청하면 됩니다.

### 3. Claude.ai에 스킬 설치 (zip 업로드)
1. 아래 링크로 스킬 zip을 받습니다.
   https://github.com/wlswntjd205-byte/juseong/raw/motion-atlas/skills/animation-html.zip
2. Claude.ai에서 **설정 → 기능 → Skills**를 열고 zip 파일을 업로드합니다.

### 4. ChatGPT에 스킬 만들기
ChatGPT는 터미널 명령으로 스킬을 설치하지 않습니다. 대신 위 zip을 받은 뒤 채팅에 첨부하고 아래 프롬프트를 복사해 붙여넣으세요.

```text
첨부한 animation-html.zip 안의 SKILL.md와 templates, reference, scripts 파일을 읽고,
이 내용을 기준으로 "반응형 애니메이션 도감" 스킬을 만들어줘.
만든 뒤에는 Install을 눌러 워크스페이스에 설치할 수 있게 해줘.
```

### 5. 저장소를 로컬에서 쓰기 (CLI · API · MCP)
```bash
git clone -b motion-atlas https://github.com/wlswntjd205-byte/juseong
cd juseong/tools/motion-atlas-tools
npm install
node src/cli.js search 픽셀 폭발
node src/cli.js prompt fade --target 카드
```
자세한 사용법은 [`tools/motion-atlas-tools/README.md`](tools/motion-atlas-tools/README.md)를 보세요.

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
| `skills/animation-html/` | 이 도감을 만드는 Claude 스킬 (SKILL.md, 템플릿, 검증 스크립트) |
| `skills/animation-html.zip` | 스킬 zip (Claude.ai·ChatGPT 업로드용) |
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

### 2. Install the skill in Claude Code (run once in a terminal)
```bash
mkdir -p ~/.claude/skills/animation-html && curl -sSL https://github.com/wlswntjd205-byte/juseong/archive/refs/heads/motion-atlas.tar.gz | tar -xz --wildcards --strip-components=3 -C ~/.claude/skills/animation-html 'juseong-motion-atlas/skills/animation-html/*'
```
After installing, ask Claude Code: "Make a responsive animation atlas with the animation-html skill."

### 3. Install the skill in Claude.ai (zip upload)
1. Download the skill zip:
   https://github.com/wlswntjd205-byte/juseong/raw/motion-atlas/skills/animation-html.zip
2. In Claude.ai, open **Settings → Capabilities → Skills** and upload the zip.

### 4. Make the skill in ChatGPT
ChatGPT does not install skills from terminal commands. Download the zip above, attach it to a chat, and paste this prompt:

```text
Read SKILL.md and the templates, reference, and scripts files in the attached animation-html.zip,
and build a "responsive animation atlas" skill based on them.
When it is ready, let me press Install so it is added to my workspace.
```

### 5. Use the repository locally (CLI · API · MCP)
```bash
git clone -b motion-atlas https://github.com/wlswntjd205-byte/juseong
cd juseong/tools/motion-atlas-tools
npm install
node src/cli.js search 픽셀 폭발
node src/cli.js prompt fade --target 카드
```
See [`tools/motion-atlas-tools/README.md`](tools/motion-atlas-tools/README.md) for details.

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
| `skills/animation-html/` | The Claude skill that builds this atlas (SKILL.md, templates, checker) |
| `skills/animation-html.zip` | Skill zip for uploading to Claude.ai or ChatGPT |
| `tools/motion-atlas-tools/` | CLI, HTTP API and MCP server for reading the items |

## Credits & License
- Includes the `@lucasmarkes/hairline` 0.5.1 engine (MIT). The full license text is inside `index.html`.
- The 16 pixel-art effects are re-implemented by hand from [pixelfx](https://patch-gg.github.io/pixelfx/) (MIT).
- The other items were rebuilt by hand after studying the behavior on reference sites. No original code was copied.
- Brand logos (Instagram, KakaoTalk, X, etc.) are not drawn because of trademark issues. Generic icons are used instead.
