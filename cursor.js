/* 全站自定义光标：只保留光标本体，光环 / 光晕 / 拖尾粒子已关闭
   每个页面在最前面引入本文件即可；脚本出错或触屏设备会自动退回系统光标 */
(function(){
  const layer = document.getElementById('cursor-layer');
  const aura = document.getElementById('aura');
  const ring = document.getElementById('ring');
  const core = document.getElementById('core');

  /* 兜底：任何异常都恢复系统光标，绝不允许页面处于"无光标"状态 */
  function fallbackCursor(){
    const st = document.createElement('style');
    st.textContent = '*,*::before,*::after{cursor:auto !important;}';
    document.head.appendChild(st);
    document.body.style.cursor = 'auto';
    if(layer) layer.style.display = 'none';
  }

  /* ---------- 首屏让路：页面 load 之前不放背景动画（见 style.css 的 html:not(.ready)） ---------- */
  function markReady(){ document.documentElement.classList.add('ready'); }
  if(document.readyState === 'complete') setTimeout(markReady, 60);
  else addEventListener('load', () => setTimeout(markReady, 60), {once:true});
  setTimeout(markReady, 1500);          // 兜底：load 迟迟不来也要放行

  /* 触屏设备不做自定义光标 */
  const coarse = matchMedia('(hover:none), (pointer:coarse)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cursorOK = !!(layer && aura && ring && core) && !coarse;
  if(!cursorOK) fallbackCursor();

  /* ---------- 性能保护：帧率监测，低帧自动降档 ---------- */
  let lite = reduce;
  if(lite) document.documentElement.classList.add('lite');

  let mx = innerWidth/2, my = innerHeight/2;
  let lastCx = -1, lastCy = -1;
  let ticks = 0;

  addEventListener('pointermove', e => {
    if(!cursorOK || e.pointerType === 'touch') return;
    mx = e.clientX; my = e.clientY;
    layer.classList.remove('out');          // 只要还在页面上就一定可见
  }, {passive:true});

  /* 离开 / 回到窗口：光标与光晕整体同进同出 */
  if(cursorOK){
    document.addEventListener('mouseleave', () => layer.classList.add('out'));
    document.addEventListener('mouseenter', () => layer.classList.remove('out'));
    addEventListener('blur',  () => layer.classList.add('out'));
    addEventListener('focus', () => layer.classList.remove('out'));
  }

  /* 帧 / 秒统计：连续两秒低于阈值就切精简模式（只降不升，避免来回抖动） */
  let fpsFrames = 0, fpsStart = performance.now();
  function checkFps(now){
    fpsFrames++;
    const dt = now - fpsStart;
    if(dt < 1600) return;
    const fps = fpsFrames / (dt / 1000);
    fpsFrames = 0; fpsStart = now;
    if(!lite && fps < 42){
      lite = true;
      document.documentElement.classList.add('lite');
    }
  }

  let rafId = 0;
  function frame(now){
    if(!cursorOK) return;
    rafId = requestAnimationFrame(frame);
    ticks++;
    checkFps(now);

    /* 只跟随光标本体，不再绘制光环 / 光晕 / 粒子 */
    if(Math.abs(mx - lastCx) > .5 || Math.abs(my - lastCy) > .5){
      core.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      lastCx = mx; lastCy = my;
    }
  }

  try{
    if(!cursorOK) throw new Error('no custom cursor');
    rafId = requestAnimationFrame(frame);
  }catch(e){
    fallbackCursor();
  }
  /* 后台标签页：停掉循环；回来再起，避免后台空耗 CPU */
  document.addEventListener('visibilitychange', () => {
    if(document.hidden){
      cancelAnimationFrame(rafId);
    }else if(cursorOK){
      cancelAnimationFrame(rafId);
      fpsFrames = 0; fpsStart = performance.now();
      rafId = requestAnimationFrame(frame);
    }
  });

  /* 看门狗：万一动画帧没跑起来（被节流 / 环境异常），立刻交还系统光标
     （页面在后台时 rAF 本就不跑，这种情况不判失败） */
  setTimeout(() => { if(cursorOK && !document.hidden && ticks < 3) fallbackCursor(); }, 1200);

  /* ---------- 按钮内光标高亮跟随 ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--mx', ((e.clientX - r.left)/r.width*100) + '%');
      btn.style.setProperty('--my', ((e.clientY - r.top)/r.height*100) + '%');
    });
  });
})();
