/* ============================================================
   放松一下 · 音乐列表
   —— 日常挂音乐的方式（和「我的项目」页一样）
   1. 把音乐文件直接拖进站点的 music 文件夹（支持再建子文件夹分类）
   2. 双击根目录的「更新音乐索引.bat」——它会扫描 music 文件夹
      并自动生成 music-index.js
   3. 刷新本页，新音乐就自动出现在列表里，点开即播、可下载

   下面 TRACKS 只在需要"手写固定曲目"时才用，一般留空即可。
   name：显示的名字      src：文件路径      desc：一句话简介（可省略）
   ============================================================ */
const TRACKS = [
  // { name: '夜色', src: 'music/夜色.mp3', desc: '适合深夜写代码' },
];

(function(){
  const $ = id => document.getElementById(id);
  const audio = $('rl-audio');
  const listEl = $('rl-list');
  const emptyEl = $('rl-empty');
  const numEl = $('rl-num');
  const updEl = $('rl-upd');
  const searchEl = $('rl-search');
  const inputEl = $('rl-input');
  const titleEl = $('rl-title');
  const subEl = $('rl-sub');
  const coverEl = $('rl-cover');
  const playBtn = $('rl-play');
  const seekEl = $('rl-seek');
  const curEl = $('rl-cur');
  const durEl = $('rl-dur');
  const volEl = $('rl-vol');
  const dlEl = $('rl-dl');
  const toastEl = $('toast');

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg){
    toastEl.textContent = msg;
    toastEl.style.opacity = '1';
    toastEl.style.transform = 'translate(-50%, 0)';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translate(-50%, 30px)';
    }, 2400);
  }

  /* ---------- 曲目数据：music 文件夹扫描结果 + 手写曲目 + 本地添加 ---------- */
  /* { name, src, desc, size, obj:boolean(本地临时文件) } */
  function buildTracks(){
    const scanned = (Array.isArray(window.MUSIC_FILES) ? window.MUSIC_FILES : []).map(f => ({
      name: f.n,
      src: f.p,
      desc: (f.d && f.d !== '来自 music 文件夹') ? f.d : '',
      size: f.s || 0,
      obj: false
    }));
    const manual = TRACKS
      .filter(t => !scanned.some(s => s.src === t.src))
      .map(t => ({ name: t.name, src: t.src, desc: t.desc || '', size: 0, obj: false }));
    return scanned.concat(manual);
  }

  let tracks = buildTracks();
  let view = [];        // 当前筛选后显示的曲目（保存的是 tracks 里的下标）
  let index = -1;       // 当前播放曲目在 tracks 中的下标

  const LS = {
    get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } },
    set(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
  };

  function fmt(t){
    if(!isFinite(t) || t < 0) return '0:00';
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }
  function ext(name){
    const m = /\.([a-z0-9]+)$/i.exec(name || '');
    return m ? m[1].toLowerCase() : 'mp3';
  }

  /* ---------- 渲染列表 ---------- */
  function render(){
    const kw = (searchEl.value || '').trim().toLowerCase();
    view = tracks
      .map((t, i) => i)
      .filter(i => !kw
        || tracks[i].name.toLowerCase().includes(kw)
        || (tracks[i].desc || '').toLowerCase().includes(kw));

    listEl.innerHTML = '';
    view.forEach(i => {
      const t = tracks[i];
      const card = document.createElement('div');
      card.className = 'rl-card' + (i === index ? ' on' : '');
      card.dataset.i = String(i);

      card.innerHTML =
        '<div class="rl-play">' + (i === index && !audio.paused ? '❚❚' : '▶') + '</div>' +
        '<div class="rl-main">' +
          '<div class="rl-name">' + t.name + '</div>' +
          '<div class="rl-desc">' + (t.desc || (t.obj ? '本地添加 · 可下载' : '点开即播')) + '</div>' +
        '</div>' +
        '<div class="rl-wave' + (i === index && !audio.paused ? ' run' : '') + '"><i></i><i></i><i></i><i></i></div>' +
        '<div class="rl-size">' + (t.size ? (t.size / 1048576).toFixed(1) + ' MB' : ext(t.src).toUpperCase()) + '</div>' +
        '<button class="rl-get" title="下载这首">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4 19h16"/></svg>' +
          '下载' +
        '</button>';

      card.addEventListener('click', e => {
        if(e.target.closest('.rl-get')){ download(i); return; }
        if(i === index){ toggle(); } else { play(i); }
      });
      listEl.appendChild(card);
    });

    numEl.textContent = String(tracks.length);
    emptyEl.hidden = tracks.length > 0;
    if(window.MUSIC_UPDATED) updEl.textContent = '· 索引更新于 ' + window.MUSIC_UPDATED;
  }

  /* ---------- 播放控制 ---------- */
  function play(i){
    if(i < 0 || i >= tracks.length) return;
    index = i;
    const t = tracks[i];
    audio.src = t.src;
    audio.currentTime = 0;
    titleEl.textContent = t.name;
    subEl.textContent = t.desc || (t.obj ? '本地添加的音乐' : '来自站点 music 目录');
    coverEl.textContent = '♪';
    dlEl.href = t.src;
    dlEl.setAttribute('download', t.name + '.' + ext(t.src));
    render();
    audio.play().catch(() => toast('浏览器拦截了自动播放，再点一次即可'));
    syncUI();
  }
  function toggle(){
    if(index < 0){ if(tracks.length) play(0); return; }
    if(audio.paused) audio.play().catch(()=>{});
    else audio.pause();
  }
  function step(d){
    if(!tracks.length) return;
    const from = index < 0 ? 0 : index;
    play((from + d + tracks.length) % tracks.length);
  }

  function syncUI(){
    const playing = !audio.paused && !audio.ended;
    playBtn.textContent = playing ? '❚❚' : '▶';
    playBtn.title = playing ? '暂停' : '播放';
    coverEl.classList.toggle('spin', playing);
    document.querySelectorAll('.rl-card').forEach(c => {
      const on = Number(c.dataset.i) === index;
      c.classList.toggle('on', on);
      c.querySelector('.rl-play').textContent = (on && playing) ? '❚❚' : '▶';
      c.querySelector('.rl-wave').classList.toggle('run', on && playing);
    });
  }

  /* ---------- 下载 ---------- */
  function download(i){
    const t = tracks[i];
    if(!t) return;
    const a = document.createElement('a');
    a.href = t.src;
    a.download = t.name + '.' + ext(t.src);
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast('开始下载：' + t.name);
  }

  /* ---------- file:// 提示 ---------- */
  if(location.protocol === 'file:'){
    const tip = $('rl-tip');
    if(tip) tip.hidden = false;
  }

  /* ---------- 添加本地音乐 ---------- */
  inputEl.addEventListener('change', () => {
    const okExt = /\.(mp3|m4a|aac|wav|ogg|oga|flac|webm)$/i;
    const files = Array.from(inputEl.files || [])
      .filter(f => /^audio\//.test(f.type) || okExt.test(f.name));
    inputEl.value = '';
    if(!files.length){ toast('没有选中可用的音频文件'); return; }
    files.forEach(f => {
      tracks.push({
        name: f.name.replace(/\.[^.]+$/, ''),
        src: URL.createObjectURL(f),
        desc: '本地添加 · ' + (f.size / 1048576).toFixed(1) + ' MB',
        obj: true
      });
    });
    render();
    toast('已添加 ' + files.length + ' 首，点卡片即可播放');
  });

  /* ---------- 事件 ---------- */
  playBtn.addEventListener('click', toggle);
  $('rl-prev').addEventListener('click', () => step(-1));
  $('rl-next').addEventListener('click', () => step(1));
  dlEl.addEventListener('click', e => {
    if(index < 0){ e.preventDefault(); toast('先点一首再下载'); return; }
    if(isLocalFile(tracks[index].src)){
      e.preventDefault();
      download(index);
      return;
    }
    toast('开始下载：' + tracks[index].name);
  });
  searchEl.addEventListener('input', render);

  let seeking = false;
  seekEl.addEventListener('pointerdown', () => { seeking = true; });
  seekEl.addEventListener('input', () => {
    seeking = true;
    if(isFinite(audio.duration)) curEl.textContent = fmt(audio.duration * Number(seekEl.value) / 1000);
  });
  seekEl.addEventListener('change', () => {
    seeking = false;
    if(isFinite(audio.duration) && audio.duration) audio.currentTime = audio.duration * (Number(seekEl.value) / 1000);
  });

  const savedVol = parseInt(LS.get('relax-vol') || '', 10);
  const vol = Number.isFinite(savedVol) ? Math.min(Math.max(savedVol, 0), 100) : 70;
  audio.volume = vol / 100;
  volEl.value = String(vol);
  volEl.addEventListener('input', () => {
    audio.volume = Number(volEl.value) / 100;
    LS.set('relax-vol', volEl.value);
  });

  audio.addEventListener('play', syncUI);
  audio.addEventListener('pause', syncUI);
  audio.addEventListener('loadedmetadata', () => { durEl.textContent = fmt(audio.duration); });
  audio.addEventListener('timeupdate', () => {
    if(seeking || !isFinite(audio.duration) || !audio.duration) return;
    seekEl.value = String(Math.round(audio.currentTime / audio.duration * 1000));
    curEl.textContent = fmt(audio.currentTime);
  });
  audio.addEventListener('ended', () => step(1));
  audio.addEventListener('error', () => {
    if(!audio.src) return;
    toast('这个文件打不开，检查路径或文件名是否正确');
  });

  /* 离开本页时断开正在下载的音频：本地服务器同一时刻只处理一个连接，
     歌曲动辄几十 MB，不中断的话跳转其它页会一直排在下载后面卡在加载中。
     前进/后退回到本页（bfcache）时把当前曲目接回去。 */
  addEventListener('pagehide', () => {
    try{ audio.pause(); audio.removeAttribute('src'); audio.load(); }catch(e){}
  });
  addEventListener('pageshow', e => {
    if(!e.persisted) return;
    const t = tracks[index];
    if(t){ try{ audio.src = t.src; }catch(err){} }
  });

  /* ---------- 索引自动刷新 ----------
     跑完「更新音乐索引.bat」后，本页会在几秒内自动把新音乐加进来，
     不用手动刷新（本地添加的临时曲目不会被覆盖掉） */
  let lastUpdated = window.MUSIC_UPDATED || '';
  function reloadIndex(){
    const s = document.createElement('script');
    s.src = 'music-index.js?t=' + Date.now();
    s.onload = () => {
      s.remove();
      const upd = window.MUSIC_UPDATED || '';
      if(!upd || upd === lastUpdated) return;
      lastUpdated = upd;
      const keep = index >= 0 ? tracks[index].src : '';
      const added = buildTracks();
      const mine = tracks.filter(t => t.obj);          // 本地临时添加的曲目保留
      tracks = added.concat(mine);
      index = keep ? tracks.findIndex(t => t.src === keep) : -1;
      render();
      toast('音乐列表已更新：共 ' + tracks.length + ' 首');
      syncUI();
    };
    s.onerror = () => s.remove();
    document.head.appendChild(s);
  }
  setInterval(reloadIndex, 4000);

  /* ---------- 滚动揭示 ---------- */
  const io = new IntersectionObserver(en => {
    en.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.16, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (Math.min(i, 6) * 70) + 'ms';
    io.observe(el);
  });

  render();
  syncUI();
})();

/* ============================================================
   律动 + 进度条合一
   底部播放条的进度条本体就是实时频谱波形：
   · 已播放段 = 红→蓝渐变，未播放段 = 暗色，中间白线是播放头
   · 透明 range 叠在波形之上，点击 / 拖动 / 键盘操作与原来完全一致
   · 没有拿到频谱（未播放 / 浏览器不支持）时走待机呼吸波
   ============================================================ */
(function(){
  const $ = id => document.getElementById(id);
  const audio = $('rl-audio');
  const box = $('rl-viz');
  const cv = $('rl-viz-cv');
  const seekEl = $('rl-seek');
  if(!audio || !box || !cv || !cv.getContext || !seekEl) return;
  const g = cv.getContext('2d');

  let W = 0, H = 0, dpr = 1, grad = null;
  function fit(){
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = Math.max(1, Math.round(cv.clientWidth * dpr));
    H = Math.max(1, Math.round(cv.clientHeight * dpr));
    cv.width = W; cv.height = H;
    grad = g.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, '#ff1b3d');
    grad.addColorStop(.55, '#ff5f7a');
    grad.addColorStop(1, '#00b4ff');
  }
  fit();
  addEventListener('resize', fit, {passive:true});
  if(window.ResizeObserver) new ResizeObserver(fit).observe(box);

  /* 把本页音频接进 WebAudio 做频谱分析（点播放时是用户手势，允许建 AudioContext） */
  let ac = null, an = null, data = null, live = false;
  function tap(){
    if(ac){ if(ac.state === 'suspended') ac.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return;
    try{
      ac = new AC();
      const src = ac.createMediaElementSource(audio);
      an = ac.createAnalyser();
      an.fftSize = 256; an.smoothingTimeConstant = .76;
      src.connect(an); an.connect(ac.destination);
      data = new Uint8Array(an.frequencyBinCount);
      if(ac.state === 'suspended') ac.resume();
    }catch(e){ ac = null; an = null; }
  }
  audio.addEventListener('play', tap);

  /* 拖动时进度以滑块为准，松手后回到音频真实时间 */
  let dragging = false;
  seekEl.addEventListener('pointerdown', () => { dragging = true; });
  seekEl.addEventListener('input', () => { dragging = true; });
  seekEl.addEventListener('change', () => { dragging = false; });
  addEventListener('pointerup', () => { setTimeout(() => { dragging = false; }, 0); }, {passive:true});

  function bar(x, y, w, h, r){
    if(h <= 0) return;
    g.beginPath();
    if(g.roundRect) g.roundRect(x, y, w, h, r);
    else{
      g.moveTo(x + r, y);
      g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
      g.arcTo(x, y + h, x, y, r);         g.arcTo(x, y, x + w, y, r);
      g.closePath();
    }
    g.fill();
  }

  const BARS = 64;
  const vals = new Float32Array(BARS);
  let t = 0, skip = 0;

  function draw(){
    const dur = isFinite(audio.duration) ? audio.duration : 0;
    const p = dragging ? Math.min(1, Number(seekEl.value) / 1000)
                       : (dur ? Math.min(1, audio.currentTime / dur) : 0);
    const px = p * W;

    if(an && !audio.paused){
      an.getByteFrequencyData(data);
      let sum = 0;
      for(let i = 0; i < data.length; i++) sum += data[i];
      live = sum > 0;
    }else live = false;

    g.clearRect(0, 0, W, H);
    const bw = W / BARS, mid = H / 2, span = H * .82;
    /* 浅色主题下白色看不见，换成深色 */
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    const dim = light ? 'rgba(12,18,40,.22)' : 'rgba(255,255,255,.15)';

    for(let i = 0; i < BARS; i++){
      let target;
      if(live){
        const idx = Math.min(data.length - 1, Math.floor(Math.pow(i / BARS, 1.6) * (data.length - 1)));
        target = (data[idx] || 0) / 235;
      }else{
        target = .06 + .05 * Math.sin(t * 1.5 + i * .42) + .035 * Math.sin(t * .9 - i * .27);
      }
      if(target > 1) target = 1;
      vals[i] += (target - vals[i]) * (target > vals[i] ? .45 : .12);   // 上冲快、回落慢
      const h = Math.max(2 * dpr, vals[i] * span);
      const x = i * bw + bw * .16, w = Math.max(1, bw * .68);
      g.fillStyle = (x + w * .5 <= px) ? grad : dim;
      bar(x, mid - h / 2, w, h, Math.min(w, h) / 2);
    }

    /* 播放头：一条亮线 + 中间的小圆点 */
    if(px > 0.5){
      g.fillStyle = light ? 'rgba(12,18,40,.85)' : 'rgba(255,255,255,.9)';
      g.fillRect(px - dpr, 0, 2 * dpr, H);
      g.beginPath();
      g.arc(px, mid, 3.6 * dpr, 0, Math.PI * 2);
      g.fill();
    }
  }

  (function loop(){
    requestAnimationFrame(loop);
    if(document.hidden) return;
    if(audio.paused && ++skip % 2) return;      // 暂停时半速，省电
    t += .05;
    draw();
  })();
})();
