/* 효과음과 배경음악: 파일 없이 WebAudio로 직접 만들어요 (칩튠 스타일) */
const AUDIO={ctx:null,master:null,muted:false,bgmOn:false,timer:null,step:0,nextT:0};

function audioInit(){
  if(AUDIO.ctx) return true;
  const C=window.AudioContext||window.webkitAudioContext;
  if(!C) return false;
  AUDIO.ctx=new C();
  AUDIO.master=AUDIO.ctx.createGain();
  AUDIO.master.gain.value=AUDIO.muted?0:0.7;
  AUDIO.master.connect(AUDIO.ctx.destination);
  return true;
}

function audioResume(){
  if(!audioInit()) return;
  if(AUDIO.ctx.state==='suspended') AUDIO.ctx.resume();
}

/* 한 음을 재생. slideTo가 있으면 음높이가 그 값으로 미끄러져요 */
function tone(freq,dur,type,vol,when,slideTo){
  if(!AUDIO.ctx) return;
  const C=AUDIO.ctx, t=when||C.currentTime;
  const o=C.createOscillator(), g=C.createGain();
  o.type=type||'square';
  o.frequency.setValueAtTime(freq,t);
  if(slideTo) o.frequency.exponentialRampToValueAtTime(slideTo,t+dur);
  g.gain.setValueAtTime(vol||0.1,t);
  g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g); g.connect(AUDIO.master);
  o.start(t); o.stop(t+dur+0.05);
}

/* 효과음 */
const SFX={
  click(){ tone(660,0.06,'square',0.15); },
  hover(){ tone(900,0.03,'triangle',0.05); },
  tab(){ tone(520,0.07,'square',0.12); tone(780,0.08,'square',0.12,(AUDIO.ctx?AUDIO.ctx.currentTime:0)+0.05); },
  pop(){ tone(800,0.05,'square',0.1,null,1200); },
  jump(){ tone(300,0.16,'square',0.14,null,640); },
  press(){ tone(180,0.08,'square',0.25); },
  whoosh(){ tone(220,0.45,'sawtooth',0.03,null,880); },
  ding(){
    const t=AUDIO.ctx?AUDIO.ctx.currentTime:0;
    tone(1046,0.25,'triangle',0.2,t);
    tone(1568,0.3,'triangle',0.12,t+0.08);
  },
  start(){
    const t=AUDIO.ctx?AUDIO.ctx.currentTime:0;
    [523,659,784,1046].forEach((f,i)=>tone(f,0.16,'square',0.12,t+i*0.09));
  }
};

function sfx(name){
  if(!audioInit() || AUDIO.muted) return;
  if(AUDIO.ctx.state==='suspended') AUDIO.ctx.resume();
  if(SFX[name]) SFX[name]();
}

/* 배경음악: 8마디짜리 루프를 미리 예약해서 재생 */
const BGM_STEP=0.25;
const BGM_MELODY=[523,0,659,0,784,0,659,0, 698,0,880,0,784,0,698,0, 659,0,784,0,523,0,587,0, 659,0,523,0,0,0,0,0];
const BGM_BASS=[131,131,98,98,110,110,87,98];

function bgmTick(){
  const C=AUDIO.ctx;
  if(!C) return;
  while(AUDIO.nextT < C.currentTime+0.3){
    const s=AUDIO.step%32;
    const m=BGM_MELODY[s];
    if(m) tone(m,BGM_STEP*0.8,'square',0.03,AUDIO.nextT);
    if(s%4===0) tone(BGM_BASS[Math.floor(s/4)%8],BGM_STEP*3.6,'triangle',0.08,AUDIO.nextT);
    AUDIO.nextT+=BGM_STEP;
    AUDIO.step++;
  }
}

function bgmStart(){
  if(!audioInit() || AUDIO.bgmOn) return;
  audioResume();
  AUDIO.nextT=AUDIO.ctx.currentTime+0.05;
  AUDIO.timer=setInterval(bgmTick,100);
  AUDIO.bgmOn=true;
}

function setMuted(on){
  AUDIO.muted=on;
  if(AUDIO.master) AUDIO.master.gain.value=on?0:0.7;
  if(!on && AUDIO.ctx && AUDIO.ctx.state==='suspended') AUDIO.ctx.resume();
}
