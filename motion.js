/* 예시·용어 카드마다 들어가는 미니 애니메이션 (240x110 캔버스)
   motif 종류: flow(두 노드 사이 이동), loop(세 노드 차례로 켜짐), steps(단계 체크),
              tokens(토큰이 하나씩 생김), fill(사용량 채워짐), ghost(그럴듯한 가짜 말풍선),
              rows(표에 행이 쌓임), json(글자가 타이핑됨), lock(키가 맞으면 열림), branch(브랜치 이동) */
const MO={W:240,H:110,bg:'#EEF8FF',ink:'#3B2F4A',white:'#FFFDF8',pink:'#FF8FB1',mint:'#7BE0C3',yel:'#FFD86B',lav:'#C3A6FF',coral:'#E8775A',tint:'#F3EEFF'};
let MINIS=[], MINI_SPECS=[];

function moR(c,x,y,w,h,col){ c.fillStyle=col; c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h)); }
function moBox(c,x,y,w,h,fill){ moR(c,x-2,y-2,w+4,h+4,MO.ink); moR(c,x,y,w,h,fill); }
function moText(c,s,x,y,col,size,align){
  c.fillStyle=col||MO.ink;
  c.font=(size||12)+'px Jua, sans-serif';
  c.textAlign=align||'center';
  c.textBaseline='middle';
  c.fillText(s,x,y);
}

/* 노드: {i: 아이콘id, l: 아래 글자}  또는  {t: 글자 상자} */
function moNode(c,x,y,n,hi){
  if(n.i){
    moBox(c,x-25,y-22,50,44,hi?MO.yel:MO.white);
    drawIcon(c,n.i,x-15,y-15,3);
    if(n.l) moText(c,n.l,x,y+34,MO.ink,12);
  } else {
    const w=Math.min(96,n.t.length*11+14);
    moBox(c,x-w/2,y-13,w,26,hi?MO.yel:MO.white);
    moText(c,n.t,x,y,MO.ink,11);
  }
}

function moFlow(c,t,s){
  const ax=55, bx=185, y=46;
  const ph=t%2.4;
  let px, col, label, hiA=false, hiB=false;
  if(ph<1.2){
    px=ax+30+(ph/1.2)*(bx-ax-60); col=MO.pink; label=s.p[0]; hiB=ph>0.9;
  } else {
    const k=(ph-1.2)/1.2;
    px=bx-30-k*(bx-ax-60); col=MO.mint; label=s.p[1]; hiA=k>0.9;
  }
  moNode(c,ax,y,s.n[0],hiA);
  moNode(c,bx,y,s.n[1],hiB);
  for(let x=ax+34;x<bx-34;x+=8) moR(c,x,y-1,4,2,MO.lav);
  moR(c,px-6,y-6,12,12,col);
  moText(c,label,120,20,MO.ink,12);
}

function moLoop(c,t,s){
  const xs=[45,120,195];
  const act=Math.floor(t*1.2)%3;
  for(let i=0;i<3;i++) moNode(c,xs[i],46,s.n[i],i===act);
  const b=Math.abs(Math.sin(t*8))*3;
  moR(c,xs[act]-4,6+b,8,4,MO.coral);
  moR(c,xs[act]-2,10+b,4,3,MO.coral);
  if(s.c) moText(c,s.c,120,100,MO.ink,11);
}

function moSteps(c,t,s){
  const n=s.s.length;
  const cyc=Math.floor(t*1.2)%(n+2);
  const act=cyc<n?cyc:-1;
  s.s.forEach((label,i)=>{
    const y=8+i*25;
    const done=act===-1||i<act;
    const hi=i===act;
    moBox(c,20,y,200,19,hi?MO.yel:(done?MO.mint:MO.white));
    moText(c,label,120,y+9.5,MO.ink,12);
    if(done){
      moR(c,194,y+9,3,3,MO.ink); moR(c,197,y+12,3,3,MO.ink);
      moR(c,200,y+9,3,3,MO.ink); moR(c,203,y+6,3,3,MO.ink);
    }
  });
}

function moTokens(c,t,s){
  moBox(c,14,12,212,86,MO.white);
  const w=s.w;
  const shown=Math.floor(t*2)%(w.length+3);
  const cols=[MO.mint,MO.yel,MO.lav,MO.pink];
  let x=24, y=24;
  for(let i=0;i<Math.min(shown,w.length);i++){
    c.font='12px Jua, sans-serif';
    const tw=c.measureText(w[i]).width+12;
    if(x+tw>216){ x=24; y+=26; }
    moR(c,x,y,tw,20,cols[i%cols.length]);
    moText(c,w[i],x+tw/2,y+10,MO.ink,12);
    x+=tw+6;
  }
  if(Math.floor(t*4)%2===0) moR(c,x+2,y+3,2,14,MO.ink);
  if(s.cap) moText(c,s.cap,120,104,MO.coral,11);
}

function moFill(c,t,s){
  const f=(t%3)/3;
  moText(c,s.l,120,18,MO.ink,13);
  moBox(c,24,40,192,26,MO.white);
  moR(c,26,42,Math.max(0,188*f),22,f>0.9?MO.coral:MO.mint);
  moText(c,Math.round(f*100)+'%',120,84,MO.ink,13);
  if(f>0.9 && s.o) moText(c,s.o,120,100,MO.coral,11);
}

function moGhost(c,t,s){
  const bob=Math.sin(t*3)*3;
  drawIcon(c,'halluc',22,30+bob,5);
  moBox(c,100,16,130,74,MO.white);
  s.t.split('\n').forEach((ln,i)=>moText(c,ln,165,38+i*18,MO.ink,12));
  if(Math.floor(t*4)%5===0) moText(c,'?',224,16,MO.coral,16);
}

function moRows(c,t,s){
  const rows=s.r;
  const cyc=Math.floor(t*1.1)%(rows.length+2);
  const shown=Math.min(cyc,rows.length);
  const frac=(t*1.1)%1;
  if(s.h){
    moBox(c,14,6,212,18,MO.lav);
    moText(c,s.h,120,15,MO.ink,11);
  }
  for(let i=0;i<shown;i++){
    const y=32+i*22;
    const slide=(i===shown-1)?(1-Math.min(1,frac*3))*30:0;
    moBox(c,14+slide,y,212,18,i%2?MO.tint:MO.white);
    moText(c,rows[i],120+slide,y+9,MO.ink,11);
  }
}

function moJson(c,t,s){
  moBox(c,14,8,212,94,MO.ink);
  const lines=s.j;
  const total=lines.reduce((a,l)=>a+l.length,0);
  let left=Math.floor(t*16)%(total+24);
  c.font='11px monospace';
  c.textAlign='left';
  c.textBaseline='middle';
  c.fillStyle='#7BE0C3';
  lines.forEach((ln,i)=>{
    const n=Math.max(0,Math.min(ln.length,left));
    left-=ln.length;
    c.fillText(ln.slice(0,n),24,22+i*17);
  });
}

function moLock(c,t,s){
  const cyc=t%4.2;
  const e=x=>1-Math.pow(1-x,3);
  const open=cyc>=1.6&&cyc<3.2;
  const k=cyc<1.4?e(cyc/1.4):(cyc<3.2?1:1-e(Math.min(1,(cyc-3.2)/0.9)));
  const kx=30+k*98;
  const lx=160, ly=50, lw=44, lh=36;
  moBox(c,lx,ly,lw,lh,open?MO.mint:MO.lav);
  const sh=open?-8:0;
  moR(c,lx+8,ly-18+sh,4,16,MO.ink);
  moR(c,lx+8,ly-18+sh,lw-16,4,MO.ink);
  moR(c,lx+lw-12,ly-18+sh,4,16,MO.ink);
  moR(c,kx-10,ly+lh/2-8,16,16,MO.yel);
  moR(c,kx-6,ly+lh/2-4,6,6,MO.white);
  moR(c,kx+6,ly+lh/2-3,24,6,MO.yel);
  moR(c,kx+18,ly+lh/2+3,4,5,MO.yel);
  moR(c,kx+24,ly+lh/2+3,4,5,MO.yel);
  moText(c,s.k,kx,ly-30,MO.ink,12);
  moText(c,s.l,lx+lw/2,ly+lh+16,MO.ink,11);
}

function moBranch(c,t,s){
  moR(c,20,84,200,3,MO.ink);
  [40,100,160,200].forEach(x=>moR(c,x-4,80,8,8,MO.pink));
  moR(c,70,40,3,44,MO.mint);
  moR(c,70,40,100,3,MO.mint);
  moR(c,170,40,3,44,MO.mint);
  [90,120,150].forEach(x=>moR(c,x-4,36,8,8,MO.lav));
  const p=(t*0.45)%1;
  moR(c,70+p*100-5,35,10,10,MO.yel);
  moText(c,s.l[0],120,102,MO.ink,11);
  moText(c,s.l[1],120,18,MO.ink,11);
}

function drawMini(c,s,t){
  switch(s.m){
    case 'flow': moFlow(c,t,s); break;
    case 'loop': moLoop(c,t,s); break;
    case 'steps': moSteps(c,t,s); break;
    case 'tokens': moTokens(c,t,s); break;
    case 'fill': moFill(c,t,s); break;
    case 'ghost': moGhost(c,t,s); break;
    case 'rows': moRows(c,t,s); break;
    case 'json': moJson(c,t,s); break;
    case 'lock': moLock(c,t,s); break;
    case 'branch': moBranch(c,t,s); break;
  }
}

function miniFrame(){
  const t=performance.now()/1000;
  MINIS.forEach(m=>{
    const c=m.ctx;
    c.clearRect(0,0,MO.W,MO.H);
    moR(c,0,0,MO.W,MO.H,MO.bg);
    if(m.spec) drawMini(c,m.spec,t);
  });
  requestAnimationFrame(miniFrame);
}
requestAnimationFrame(miniFrame);
