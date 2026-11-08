# motion-atlas-tools

반응형 애니메이션 도감(`index.html`)의 항목을 **CLI · HTTP API · MCP 서버**로 꺼내 쓰는 도구입니다.
데이터는 `data/atlas.json`에 들어 있고, 도감 원본이 바뀌면 `scripts/extract.mjs`로 다시 뽑습니다.

## 설치

```bash
npm install
```

## 데이터 갱신

도감 원본을 헤드리스 Chromium으로 열어 항목·카테고리·코드·프롬프트를 뽑습니다.
Playwright 모듈 경로를 `PLAYWRIGHT_PATH`로 지정할 수 있습니다.

```bash
PLAYWRIGHT_PATH=/path/to/playwright/index.js node scripts/extract.mjs ../../index.html
```

## CLI

```bash
node src/cli.js cats                      # 카테고리와 항목 수
node src/cli.js list --cat px             # 카테고리별 목록
node src/cli.js search 픽셀 폭발         # 이름·설명 검색
node src/cli.js show fade                 # 상세 (JSON)
node src/cli.js code fade                 # 핵심 코드
node src/cli.js prompt fade --target 카드 # AI 프롬프트 (대상 이름 교체)
node src/cli.js --json search 물결        # JSON 출력
```

`npm link`를 하면 `motion-atlas` 명령으로 쓸 수 있습니다.

## HTTP API

```bash
npm run api            # 기본 포트 8787 (PORT 환경변수로 변경)
```

| 경로 | 설명 |
|---|---|
| `GET /api/health` | 상태와 항목 수 |
| `GET /api/categories` | 카테고리 목록 |
| `GET /api/items?cat=&q=` | 항목 목록 (요약) |
| `GET /api/items/:id` | 항목 상세 |
| `GET /api/items/:id/code` | 핵심 코드 |
| `GET /api/items/:id/prompt?target=` | AI 프롬프트 |
| `GET /api/search?q=&limit=` | 관련도순 검색 |

## MCP 서버 (stdio)

```bash
npm run mcp
```

Claude Desktop 설정 예시:

```json
{
  "mcpServers": {
    "motion-atlas": { "command": "node", "args": ["/절대경로/tools/motion-atlas-tools/src/mcp.js"] }
  }
}
```

제공 도구: `list_categories`, `list_items`, `search_items`, `get_item`, `get_code`, `get_prompt`.

## 알려진 제한

- 코드와 프롬프트는 추출 시점의 **기본 조절값** 기준입니다. `target`(적용 대상 이름)만 바꿔 쓸 수 있고, 다른 조절값은 아직 지정할 수 없습니다.
- 도감 원본의 항목 코드는 페이지 안의 함수로 만들어져 있어서, 값을 바꾼 코드가 필요하면 추출 단계에서 조절값 조합을 늘려야 합니다.
