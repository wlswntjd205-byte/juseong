/* 메인 화면: 주제 전환, 예시, 용어 카드, 반응 효과, 소리 버튼 */
const TOPICS=[].concat(TOPICS_AI, TOPICS_WEB);

/* ---------- 파티클 (클릭·입장 효과) ---------- */
const FX=document.getElementById('fx');
const FXC=FX.getContext('2d');
let particles=[], fxRAF=0;
function fxSize(){ FX.width=innerWidth; FX.height=innerHeight; }
fxSize();
addEventListener('resize',fxSize);

function fxBurst(x,y,color){
  const cols=[color,'#FFD86B','#FF8FB1','#7BE0C3','#C3A6FF'];
  for(let i=0;i<14;i++){
    const a=Math.random()*Math.PI*2, s=2+Math.random()*4;
    particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-2,life:1,c:cols[i%cols.length]});
  }
  if(!fxRAF) fxRAF=requestAnimationFrame(fxFrame);
}
function fxFrame(){
  FXC.clearRect(0,0,FX.width,FX.height);
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy; p.vy+=0.25; p.life-=0.03;
    FXC.globalAlpha=Math.max(p.life,0);
    FXC.fillStyle=p.c;
    FXC.fillRect(Math.round(p.x)-3,Math.round(p.y)-3,6,6);
  });
  FXC.globalAlpha=1;
  particles=particles.filter(p=>p.life>0);
  fxRAF=particles.length?requestAnimationFrame(fxFrame):0;
}

/* ---------- 주제 장면 ---------- */
const STAGE=document.getElementById('stage');
SC=STAGE.getContext('2d');
SC.imageSmoothingEnabled=false;
let sceneKey='ai', sceneT0=performance.now();

function sceneFrame(now){
  const t=reduceMotion()?0:(now-sceneT0)/1000;
  const fn=SCENES[sceneKey];
  if(fn) fn(t);
  requestAnimationFrame(sceneFrame);
}
requestAnimationFrame(sceneFrame);

document.getElementById('stage-frame').addEventListener('click',e=>{
  sfx('pop');
  const r=STAGE.getBoundingClientRect();
  fxBurst(e.clientX,e.clientY,'#FF8FB1');
});

/* ---------- 용어 아이콘 (눌러서 반응) ---------- */
let iconSprites=[];
function buildIcons(){
  iconSprites=[...document.querySelectorAll('.term-icon')].map((cv,i)=>({
    cv, ctx:cv.getContext('2d'), id:cv.dataset.id,
    phase:i%2, jumpUntil:0
  }));
  iconSprites.forEach(s=>s.ctx.imageSmoothingEnabled=false);
}
function drawIconSprite(s,now){
  const c=s.ctx;
  c.clearRect(0,0,14,14);
  const bob=Math.floor(now/450+s.phase)%2;
  let jump=0;
  if(s.jumpUntil>now){ jump=-Math.round(Math.sin(((s.jumpUntil-now)/500)*Math.PI)*3); }
  drawIcon(c,s.id,2,2+bob+jump,1);
}
function iconLoop(now){
  iconSprites.forEach(s=>drawIconSprite(s,now));
  requestAnimationFrame(iconLoop);
}
requestAnimationFrame(iconLoop);

function reactIcon(cv){
  const s=iconSprites.find(x=>x.cv===cv);
  if(!s) return;
  const now=performance.now();
  s.jumpUntil=now+500;
  cv.classList.remove('reacting'); void cv.offsetWidth; cv.classList.add('reacting');
  sfx('ding');
  const r=cv.getBoundingClientRect();
  fxBurst(r.left+r.width/2,r.top+r.height/2,'#7BE0C3');
}

/* ---------- 화면 구성 ---------- */
const TABS=document.getElementById('tabs');
const TERMS=document.getElementById('terms');
const EXAMPLES=document.getElementById('examples');
let current=0;

TOPICS.forEach((T,i)=>{
  const b=document.createElement('button');
  b.className='tab';
  b.setAttribute('role','tab');
  b.type='button';
  b.textContent=T.name;
  b.addEventListener('click',()=>{ sfx('tab'); show(i); });
  TABS.appendChild(b);
});

function termHTML(term){
  const abbr=term.abbr?('<ul class="abbr">'+term.abbr.map(a=>'<li><b>'+a[0]+'</b>'+a[1]+' · '+a[2]+'</li>').join('')+'</ul>'):'';
  return '<article class="term">'+
    '<div class="term-head">'+
      '<canvas class="term-icon" width="14" height="14" data-id="'+term.icon+'" role="img" aria-label="'+term.ko+' 아이콘, 눌러 보세요"></canvas>'+
      '<h3>'+term.ko+'<small>'+term.en+'</small></h3>'+
    '</div>'+
    miniTag(ANIM_TERMS[term.id])+
    '<p class="def">'+term.def+'</p>'+
    '<details><summary>풀어서 설명 보기</summary>'+
      '<p class="full">'+term.full+'</p>'+abbr+
      '<p>'+term.long+'</p>'+
    '</details>'+
    '<p class="ex"><b>비유</b>'+term.ex+'</p>'+
  '</article>';
}

function exampleHTML(ex){
  return '<div class="example">'+
    '<h4>'+ex.title+'</h4>'+
    miniTag(ANIM_EX[ex.title])+
    '<p>'+ex.situation+'</p>'+
    '<p class="say">'+ex.say+'</p>'+
    '<p>'+ex.result+'</p>'+
  '</div>';
}

function show(i){
  current=(i+TOPICS.length)%TOPICS.length;
  const T=TOPICS[current];
  [...TABS.children].forEach((b,k)=>{
    b.setAttribute('aria-selected',String(k===current));
    b.tabIndex=k===current?0:-1;
  });
  document.getElementById('topicNo').textContent=String(current+1).padStart(2,'0')+' / '+String(TOPICS.length).padStart(2,'0');
  document.getElementById('topicName').textContent=T.name;
  document.getElementById('caption').textContent=T.caption;
  STAGE.setAttribute('aria-label',T.name+' 애니메이션. '+T.caption);
  sceneKey=T.scene;
  sceneT0=performance.now();
  MINI_SPECS=[];
  EXAMPLES.innerHTML=T.examples.map(exampleHTML).join('');
  TERMS.innerHTML=T.terms.map(termHTML).join('');
  MINIS=[...document.querySelectorAll('canvas.mini')].map(cv=>({
    cv, ctx:cv.getContext('2d'), spec:MINI_SPECS[+cv.dataset.idx]
  }));
  buildIcons();
}

function miniTag(spec){
  if(!spec) return '';
  MINI_SPECS.push(spec);
  return '<canvas class="mini" width="240" height="110" data-idx="'+(MINI_SPECS.length-1)+'" aria-hidden="true"></canvas>';
}

TERMS.addEventListener('click',e=>{
  const cv=e.target.closest('.term-icon');
  if(cv) reactIcon(cv);
});
let lastHover=0;
TERMS.addEventListener('pointerover',e=>{
  if(!e.target.closest('.term')) return;
  const now=performance.now();
  if(now-lastHover>200){ lastHover=now; sfx('hover'); }
});

document.getElementById('prev').addEventListener('click',()=>{ sfx('pop'); show(current-1); });
document.getElementById('next').addEventListener('click',()=>{ sfx('pop'); show(current+1); });

const MUTE=document.getElementById('mute');
MUTE.addEventListener('click',()=>{
  audioResume();
  setMuted(!AUDIO.muted);
  MUTE.textContent=AUDIO.muted?'소리 켜기':'소리 끄기';
  if(!AUDIO.muted) sfx('pop');
});

show(0);
