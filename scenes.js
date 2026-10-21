/* 주제별 대표 장면 (160x110 픽셀 캔버스에 그림) */
const SCENE_INK='#3B2F4A', SCENE_PINK='#FF8FB1', SCENE_MINT='#7BE0C3', SCENE_SKY='#CFEBFF',
      SCENE_LAV='#C3A6FF', SCENE_YEL='#FFD86B', SCENE_WHITE='#FFFDF8', SCENE_GREY='#CBC3DA';

let SC=null; /* 현재 그리는 캔버스 컨텍스트 (app.js가 설정) */
const SR=(x,y,w,h,c)=>{SC.fillStyle=c;SC.fillRect(x|0,y|0,w|0,h|0);};
const SBOX=(x,y,w,h,c)=>{SR(x-2,y-2,w+4,h+4,SCENE_INK);SR(x,y,w,h,c);};
const SBG=t=>{
  SR(0,0,160,110,SCENE_SKY);
  for(let k=0;k<7;k++){ if(Math.floor(t*1.5+k)%3) SR(8+k*22,6+(k*13)%20,2,2,SCENE_WHITE); }
};

/* AI 기초: 로봇이 토큰을 말풍선에 하나씩 쌓음 */
function sceneAI(t){
  SBG(t);
  const bob=Math.floor(t*2)%2;
  SR(21,27+bob,2,6,SCENE_INK); SR(19,24+bob,6,4,SCENE_YEL);
  SBOX(10,34+bob,38,30,SCENE_PINK);
  const blink=(t%3)>2.7;
  if(blink){ SR(20,47+bob,6,2,SCENE_INK); SR(36,47+bob,6,2,SCENE_INK); }
  else { SR(20,43+bob,5,5,SCENE_INK); SR(36,43+bob,5,5,SCENE_INK); }
  SR(24,56+bob,12,2,SCENE_INK);
  SBOX(56,20,96,62,SCENE_WHITE);
  const toks=[SCENE_MINT,SCENE_YEL,SCENE_LAV,SCENE_SKY,SCENE_PINK,SCENE_MINT,SCENE_YEL,SCENE_LAV,SCENE_SKY,SCENE_PINK,SCENE_MINT,SCENE_YEL];
  const n=Math.floor(t*2.2)%(toks.length+5);
  const shown=Math.min(n,toks.length);
  for(let i=0;i<shown;i++) SR(62+(i%5)*18,28+Math.floor(i/5)*16,14,10,toks[i]);
  if(shown<toks.length && Math.floor(t*4)%2===0) SR(62+(shown%5)*18,28+Math.floor(shown/5)*16,2,10,SCENE_INK);
}

/* AI 도구: 생각 → 도구 → 확인을 돌아가며 하이라이트 */
function sceneAgent(t){
  SBG(t);
  const xs=[10,62,114], cols=[SCENE_PINK,SCENE_YEL,SCENE_MINT];
  const act=Math.floor(t*1.6)%3;
  for(let i=0;i<3;i++) SBOX(xs[i],44,36,32, i===act?cols[i]:SCENE_WHITE);
  const x0=xs[0], x1=xs[1], x2=xs[2];
  SR(x0+8,58,4,4,SCENE_INK); SR(x0+16,58,4,4,SCENE_INK); SR(x0+24,58,4,4,SCENE_INK);
  SR(x1+8,58,18,4,SCENE_INK); SR(x1+8,50,4,12,SCENE_INK); SR(x1+22,48,4,8,SCENE_INK);
  SR(x2+8,54,4,4,SCENE_INK); SR(x2+12,58,4,4,SCENE_INK); SR(x2+16,54,4,4,SCENE_INK); SR(x2+20,50,4,4,SCENE_INK);
  for(let i=0;i<2;i++) for(let x=xs[i]+38;x<xs[i+1]-3;x+=5) SR(x,60,2,2,SCENE_INK);
  const b=(Math.floor(t*6)%2)*2;
  SR(xs[act]+12,32-b,12,3,SCENE_INK); SR(xs[act]+15,35-b,6,3,SCENE_INK);
}

/* 웹과 API: 요청(분홍)이 서버로 가고 응답(민트)이 돌아옴 */
function sceneAPI(t){
  SBG(t);
  SBOX(12,28,34,58,SCENE_WHITE); SR(18,36,22,38,SCENE_SKY); SR(24,31,10,2,SCENE_INK);
  SBOX(114,28,34,58,SCENE_LAV);
  const c2=t%2.4, busy=c2>1.2&&c2<1.8;
  SR(120,38,22,4,busy?SCENE_YEL:SCENE_MINT);
  SR(120,48,22,4,busy?SCENE_PINK:SCENE_MINT);
  for(let x=50;x<108;x+=6) SR(x,53,3,2,SCENE_INK);
  if(c2<1.2){
    const x=50+(c2/1.2)*52;
    SR(x,49,9,9,SCENE_PINK); SR(x+3,52,3,3,SCENE_INK);
  } else {
    const x=106-((c2-1.2)/1.2)*52;
    SR(x,49,9,9,SCENE_MINT); SR(x+3,52,3,3,SCENE_INK);
  }
}

/* 데이터: 행이 하나씩 쌓여 표가 채워짐 */
function sceneDB(t){
  SBG(t);
  SBOX(30,14,100,84,SCENE_WHITE);
  SR(34,18,92,10,SCENE_SKY);
  SR(70,18,2,78,SCENE_GREY);
  const n=Math.floor(t*1.2)%6;
  const cols=[SCENE_MINT,SCENE_YEL,SCENE_PINK,SCENE_LAV];
  for(let i=0;i<n;i++){
    const y=30+i*10;
    SR(36,y,8,7,cols[i%4]);
    SR(48,y+2,20+((i*13)%16),3,SCENE_GREY);
    SR(74,y+2,30,3,SCENE_GREY);
  }
}

/* 개발 흐름: 메인 줄에서 브랜치를 뻗어 작업하고 돌아옴 */
function sceneGit(t){
  SBG(t);
  SR(12,72,136,3,SCENE_INK);
  [18,42,66,90,114,138].forEach(x=>SR(x-3,68,7,7,SCENE_PINK));
  SR(42,42,66,3,SCENE_MINT);
  SR(42,42,3,31,SCENE_MINT);
  SR(105,42,3,31,SCENE_MINT);
  [58,78,96].forEach(x=>SR(x-3,39,7,7,SCENE_LAV));
  const p=(t*0.5)%1;
  SR(46+p*56-3,36,9,9,SCENE_YEL);
}

/* 보안: 열쇠(API 키)가 맞으면 자물쇠가 열림 */
function sceneSec(t){
  SBG(t);
  const c=t%4;
  const e=x=>1-Math.pow(1-x,3);
  const open=c>=1.6&&c<3.2;
  const k=c<1.5?e(c/1.5):(c<3.2?1:1-e((c-3.2)/0.8));
  const kx=14+k*60;
  SBOX(90,48,44,36,open?SCENE_MINT:SCENE_LAV);
  const sh=open?-9:0;
  SR(96,30+sh,4,18,SCENE_INK); SR(96,30+sh,32,4,SCENE_INK); SR(124,30+sh,4,18,SCENE_INK);
  SR(110,56,4,4,SCENE_INK); SR(111,60,2,6,SCENE_INK);
  SR(kx-6,52,12,12,SCENE_YEL); SR(kx-2,56,4,4,SCENE_SKY);
  SR(kx+6,56,28,4,SCENE_YEL); SR(kx+26,60,3,4,SCENE_YEL); SR(kx+30,60,3,4,SCENE_YEL);
}

const SCENES={ai:sceneAI, agent:sceneAgent, api:sceneAPI, db:sceneDB, git:sceneGit, sec:sceneSec};
