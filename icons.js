/* 용어별 10x10 픽셀 아이콘
   . 빈칸  k 잉크  p 핑크  m 민트  y 노랑  l 라벤더  w 흰색  b 하늘  c 코랄  g 회색 */
const ICON_PALETTE={k:'#3B2F4A',p:'#FF8FB1',m:'#7BE0C3',y:'#FFD86B',l:'#C3A6FF',w:'#FFFDF8',b:'#8EC5FF',c:'#E8775A',g:'#CBC3DA'};

const ICONS={
  llm:[
    "....y.....","....k.....","..kkkkkk..",".kppppppk.",
    ".kwkppkwk.",".kwkppkwk.",".kppppppk.",".kkkkkkkk.",
    "..kmmmmk..","..kkkkkk.."],
  token:[
    "..kkkkkk..",".kmmmmmmk.",".kmmkkmmk.",".kmmkkmmk.",
    ".kmmmmmmk.",".kmmkkmmk.",".kmmmmmmk.",".kkkkkkkk.",
    "..........",".........."],
  ctx:[
    "kkkkkkkkkk","kwwwwwwwwk","kbbbbwwwwk","kbbbbbbwwk",
    "kbbbbbbbbk","kkkkkkkkkk","..........","..........",
    "..........",".........."],
  halluc:[
    "...kkkk...","..kwwwwk..",".kwwwwwwk.",".kwkwwkwk.",
    ".kwwwwwwk.",".kwwwwwwk.",".kwwwwwwk.",".kwkwwkwk.",
    ".kkkkkkkk.",".........."],
  prompt:[
    ".kkkkkkkk.",".kwwwwwwk.",".kwkwwwwk.",".kwwkwwwk.",
    ".kwkwwwwk.",".kwwwwwwk.",".kkkkkkkk.","..kk......",
    "..........",".........."],
  agent:[
    "....y.....","...yyy....",".yyyyyyy..","..yyyyy...",
    ".yyy.yyy..","yyy...yyy.","..yyyyy...",".yyy.yyy..",
    "..........",".........."],
  mcp:[
    "....k.....","..kkkkk...","..kgkgk...","..kkkkk...",
    "...kkk....","...kmk....","...kmk....","..kkkkk...",
    ".kkkkkkk..",".........."],
  vibe:[
    "..........",".kk..kk...","kpkkkpkk..","kpppppppk.",
    "kpppppppk.",".kpppppk..","..kpppk...","...kpk....",
    "....k.....",".........."],
  rag:[
    "kkkkkkkkkk","kwwwwkwwwk","kwlllkwlwk","kwlllkwlwk",
    "kwlllkwlwk","kkkkkkkkkk","..........","..........",
    "..........",".........."],
  client:[
    ".kkkkkkkk.",".kswwwwsk.",".kswwwwsk.",".kswwwwsk.",
    ".kswwwwsk.",".kswwwwsk.",".kswwwwsk.",".kkkkkkkk.",
    "..........",".........."],
  api:[
    "kkkkkkkkkk","kyyyyyyyyk","kyykkkkyyk","kyyyyyyyyk",
    "kyykkyyyyk","kyyyyyyyyk","kkkkkkkkkk","..........",
    "..........",".........."],
  http:[
    "...kkkk...","..kmmmmk..","..kmmmmk..","...kkkk...",
    "...kyyk...","..kyyyyk..","...kkkk...","...kppk...",
    "..kkkkkk..",".........."],
  dns:[
    "kkkkkkkkkk","kllllllllk","klkkkkkllk","kllllllllk",
    "klkkkkkllk","kllllllllk","kkkkkkkkkk","..........",
    "..........",".........."],
  db:[
    "..kkkkkk..",".kmmmmmmk.","kkkkkkkkkk","kmmmmmmmmk",
    "kkkkkkkkkk","kmmmmmmmmk","kkkkkkkkkk",".kkkkkkkk.",
    "..........",".........."],
  table:[
    "kkkkkkkkkk","kyyykyyyyk","kkkkkkkkkk","kmmmkmmmmk",
    "kkkkkkkkkk","kpppkppppk","kkkkkkkkkk","..........",
    "..........",".........."],
  json:[
    "..kkk.kkk.",".k.....k..",".k.....k..","..kk.kk...",
    "...k...k..","..kk.kk...",".k.....k..",".k.....k..",
    "..kkk.kkk.",".........."],
  git:[
    "..........","....k.....","....m.....","..kmmmk...",
    "....m.....","....p.....","...pkp....","...pkp....",
    "..........",".........."],
  commit:[
    "..........","..........","kkkkkkkkkk","..mmmm....",
    "kkkkkkkkkk","..........","..pppp....","kkkkkkkkkk",
    "..........",".........."],
  pr:[
    "..kkkkkk..",".kwwwwwwk.",".kwkwwwwk.",".kwwwwwwk.",
    ".kwwkwwwk.",".kwwwwwwk.",".kkkkkkkk.","..........",
    "..........",".........."],
  cicd:[
    "..........","kkkkkkkkkk","kmmmmmmmmk","kkkkkkkkkk",
    "..kyyyk...","..kyyyk...","..kkkkk...","..........",
    "..........",".........."],
  apikey:[
    "..kkkk....",".kyyyyk...",".kykkyk...",".kyyyykkkkk",
    "..kkkkyyyk",".......k..",".......kk.","..........",
    "..........",".........."],
  env:[
    "kkkkkkkkkk","kgggggggk","kkkkkkkkkk","kgkgkgkgk",
    "kkkkkkkkkk","kkkkkkkkkk","kgkkgkkgk","..........",
    "..........",".........."],
  auth:[
    "...kkkk...","..kmmmmk..","..k....k..","..kkkkkk..",
    "..kyyyyk..","..kykyk...","..kyyyyk..","..kkkkkk..",
    "..........",".........."]
};

/* 아이콘을 캔버스에 그리기 (ox, oy: 좌상단 픽셀 좌표, s: 한 칸 크기) */
function drawIcon(c,id,ox,oy,s){
  const rows=ICONS[id]||[];
  rows.forEach((row,y)=>{
    for(let x=0;x<row.length;x++){
      const ch=row[x];
      if(ch==='.'||!ICON_PALETTE[ch]) continue;
      c.fillStyle=ICON_PALETTE[ch];
      c.fillRect(ox+x*s,oy+y*s,s,s);
    }
  });
}
