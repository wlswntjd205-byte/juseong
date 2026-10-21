/* 시작 화면: 오른쪽 위 문이 열리고 클로드 봇이 나와서, 점점 가까워지며(점점 커지며) 시작 버튼을 눌러요 */
const INTRO={
  el:document.getElementById('intro'),
  btn:document.getElementById('start-btn'),
  cv:document.getElementById('intro-canvas'),
  raf:0, t0:0, running:false, pressed:false, celebrated:false, done:false,
  emerged:false, lastFrame:-1
};
const IC=INTRO.cv.getContext('2d');

function introSize(){
  INTRO.cv.width=innerWidth;
  INTRO.cv.height=innerHeight;
}
introSize();
addEventListener('resize',introSize);

/* 클로드 봇 색 (참고 이미지의 코랄 픽셀 캐릭터를 따름) */
const BOT={body:'#D97757', shade:'#BF6143', eye:'#1E1410', blush:'#F4A08A', glint:'#FFF6EE'};

/* 봇 그림: 본체 12x8 칸, 팔 좌우 2칸, 다리 4개. 칸 단위 좌표 [x, y, 가로, 세로, 색] */
function botRects(pose,frame,blink){
  const r=[];
  r.push([0,0,12,8,BOT.body]);
  r.push([0,7,12,1,BOT.shade]);
  r.push([1,4,1,1,BOT.blush]); r.push([10,4,1,1,BOT.blush]);
  if(blink){
    r.push([2,3,1,1,BOT.eye]); r.push([9,3,1,1,BOT.eye]);
  } else {
    r.push([2,2,1,2,BOT.eye]); r.push([9,2,1,2,BOT.eye]);
    r.push([2,2,1,1,BOT.glint]); r.push([9,2,1,1,BOT.glint]);
  }
  if(pose==='press'){
    r.push([-2,4,2,2,BOT.body]);
    r.push([12,4,2,2,BOT.body]); r.push([13,6,1,6,BOT.body]); /* 버튼 쪽으로 뻗은 팔 */
  } else if(pose==='wave'){
    r.push([-2,1,2,3,BOT.body]); r.push([12,1,2,3,BOT.body]);
  } else {
    r.push([-2,4,2,2,BOT.body]); r.push([12,4,2,2,BOT.body]);
  }
  const legCols=(pose==='walk'&&frame===1)?[0,2,9,11]:[1,3,8,10];
  legCols.forEach(c=>r.push([c,8,1,2,BOT.body]));
  return r;
}

function drawBot(c,ox,oy,u,pose,frame,blink){
  botRects(pose,frame,blink).forEach(([x,y,w,h,col])=>{
    c.fillStyle=col;
    c.fillRect(ox+x*u,oy+y*u,w*u,h*u);
  });
}

/* 문: 오른쪽 위에 있고, 패널이 점점 좁아지며 열려요 */
function doorGeom(){
  const w=64, h=104;
  return {x:innerWidth-w-56, y:Math.max(24,innerHeight*0.1), w, h};
}

function drawDoor(c,D,openK){
  c.fillStyle='#3B2F4A';
  c.fillRect(D.x-8,D.y-8,D.w+16,D.h+8);            /* 문틀 */
  c.fillStyle='#4A3350';
  c.fillRect(D.x,D.y,D.w,D.h);                     /* 문 안쪽 */
  c.fillStyle='#FFE7B0';
  c.fillRect(D.x+4,D.y+D.h-8,D.w-8,4);             /* 바닥에서 새는 빛 */
  const pw=Math.round(D.w*(1-openK));
  if(pw>0){
    c.fillStyle='#3B2F4A';
    c.fillRect(D.x,D.y,pw,D.h);                    /* 문 패널 테두리 */
    c.fillStyle='#7BE0C3';
    if(pw>8) c.fillRect(D.x+3,D.y+3,pw-6,D.h-6);
    if(pw>16){ c.fillStyle='#FFD86B'; c.fillRect(D.x+pw-12,D.y+D.h/2,4,4); }
  }
}

function easeOut(k){ return 1-Math.pow(1-k,3); }
function lerp(a,b,k){ return a+(b-a)*k; }

/* 타임라인 (초) */
const INTRO_DUR={door:0.7, out:0.45, walk:1.5, press:0.35, celeb:0.8};

function introFrame(now){
  const el=(now-INTRO.t0)/1000;
  IC.clearRect(0,0,INTRO.cv.width,INTRO.cv.height);

  const D=doorGeom();
  const b=INTRO.btn.getBoundingClientRect();
  const bcx=b.left+b.width/2, btop=b.top;

  /* 봇이 가장 가까이 왔을 때의 크기(칸 픽셀 크기)와 목표 위치 */
  const uf=Math.min(8,Math.max(4,innerWidth/90));
  const tx=bcx-6*uf, ty=btop-12*uf;

  /* 문 앞에서 나올 때의 크기와 위치 */
  const u0=3;
  const sx=D.x+D.w/2-6*u0, sy=D.y+D.h-10*u0-4;

  const t1=INTRO_DUR.door;
  const t2=t1+INTRO_DUR.out;
  const t3=t2+INTRO_DUR.walk;
  const t4=t3+INTRO_DUR.press;
  const t5=t4+INTRO_DUR.celeb;

  const openK=easeOut(Math.min(1,el/t1));
  drawDoor(IC,D,openK);

  const blink=(el%3.1)>2.9;

  if(el<t1){
    /* 문이 열리는 중: 봇은 아직 안 보여요 */
  } else if(el<t2){
    const k=(el-t1)/INTRO_DUR.out;
    const hop=Math.sin(k*Math.PI)*8;
    const u=u0;
    drawBot(IC,sx,sy-hop,u,'stand',0,blink);
    if(!INTRO.emerged){
      INTRO.emerged=true;
      fxBurst(D.x+D.w/2,D.y+D.h-6,'#FFD86B');
      tone(520,0.12,'square',0.1,null,780);
    }
  } else if(el<t3){
    const k=(el-t2)/INTRO_DUR.walk;
    const e=k*k;                                   /* 점점 빨라지며 다가와요 */
    const u=lerp(u0,uf,e);
    const ox=lerp(sx,tx,e);
    const bob=Math.abs(Math.sin(k*Math.PI*6))*2;
    const oy=lerp(sy,ty,e)-bob;
    const frame=Math.floor(el*10)%2;
    if(frame!==INTRO.lastFrame){ INTRO.lastFrame=frame; tone(180,0.04,'square',0.05); }
    drawBot(IC,ox,oy,u,'walk',frame,blink);
  } else if(el<t4){
    drawBot(IC,tx,ty,uf,'press',0,blink);
    if(!INTRO.pressed){
      INTRO.pressed=true;
      INTRO.btn.classList.add('pressed');
      sfx('press');
      fxBurst(bcx,btop,'#FFD86B');
    }
  } else if(el<t5){
    const k=el-t4;
    const oy=ty-Math.abs(Math.sin(k*10))*6;
    drawBot(IC,tx,oy,uf,'wave',0,false);
    INTRO.btn.classList.remove('pressed');
    if(!INTRO.celebrated){
      INTRO.celebrated=true;
      audioResume();
      sfx('start');
      bgmStart();
    }
  } else {
    introFinish();
    return;
  }

  INTRO.raf=requestAnimationFrame(introFrame);
}

function reduceMotion(){
  return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

function introStart(){
  if(INTRO.running) return;
  INTRO.running=true;
  INTRO.btn.disabled=true;
  audioResume();                     /* 클릭 안에서 바로 오디오를 켜야 소리가 나요 */
  sfx('click');
  if(reduceMotion()){
    INTRO.btn.classList.add('pressed');
    sfx('start'); bgmStart();
    introFinish();
    return;
  }
  tone(300,0.5,'sawtooth',0.05,null,160);   /* 문 삐걱 소리 */
  INTRO.t0=performance.now();
  INTRO.raf=requestAnimationFrame(introFrame);
}

function introFinish(){
  if(INTRO.done) return;
  INTRO.done=true;
  cancelAnimationFrame(INTRO.raf);
  IC.clearRect(0,0,INTRO.cv.width,INTRO.cv.height);
  INTRO.el.classList.add('leaving');
  setTimeout(()=>{
    INTRO.el.hidden=true;
    document.getElementById('app').hidden=false;
    document.getElementById('mute').focus({preventScroll:true});
  },650);
}

INTRO.btn.addEventListener('click',introStart);
