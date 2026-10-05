
(function(){
  /* ---------- 顶部导航：页面滚动进度条 ---------- */
  const wrap = document.getElementById('navProgress');
  if(!wrap) return;
  const bar = wrap.querySelector('i');
  let ticking = false;

  function update(){
    ticking = false;
    const doc = document.documentElement;
    const y = window.scrollY || doc.scrollTop || 0;
    const max = doc.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0;
    bar.style.width = (p * 100).toFixed(2) + '%';
  }
  /* 滚动事件很密集：用 rAF 合并到每帧一次，避免重复读写布局 */
  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }
  addEventListener('scroll', onScroll, {passive:true});
  addEventListener('resize', onScroll);
  update();
})();
