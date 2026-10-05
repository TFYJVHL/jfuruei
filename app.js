
(function(){
  /* ---------- 按钮交互 ---------- */
  const toast = document.getElementById('toast');
  let timer;
  function showToast(msg){
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, 0)';
    clearTimeout(timer);
    timer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, 30px)';
    }, 2400);
  }
  function copyText(text){
    if(navigator.clipboard && window.isSecureContext){
      navigator.clipboard.writeText(text).catch(()=> fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }
  function fallbackCopy(text){
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try{ document.execCommand('copy'); }catch(e){}
    ta.remove();
  }
  document.querySelectorAll('[data-toast]').forEach(el => {
    el.addEventListener('click', () => {
      if(el.dataset.copy) copyText(el.dataset.copy);
      showToast(el.dataset.toast);
    });
  });
  document.querySelectorAll('[data-scroll]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelector(el.dataset.scroll)?.scrollIntoView({behavior:'smooth'});
    });
  });

  /* ---------- 滚动揭示 ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, {threshold:.16, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach((el,i) => {
    el.style.transitionDelay = (Math.min(i,6)*70) + 'ms';
    io.observe(el);
  });

  /* ---------- 技能条动画 ---------- */
  const barIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if(en.isIntersecting){
        en.target.querySelectorAll('.bar i').forEach((b, idx) => {
          setTimeout(() => { b.style.width = b.dataset.w + '%'; }, idx*130);
        });
        barIO.unobserve(en.target);
      }
    });
  }, {threshold:.3});
  document.querySelectorAll('.skills-layout > div').forEach(el => barIO.observe(el));

  /* ---------- 数字滚动 ---------- */
  const numIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if(!en.isIntersecting) return;
      const el = en.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const dur = 1400, start = performance.now();
      (function step(t){
        const p = Math.min((t - start)/dur, 1);
        const v = Math.round(target * (1 - Math.pow(1-p, 3)));
        el.textContent = v + suffix;
        if(p < 1) requestAnimationFrame(step);
      })(start);
      numIO.unobserve(el);
    });
  }, {threshold:.5});
  document.querySelectorAll('[data-count]').forEach(el => numIO.observe(el));

  /* ---------- 标签随机色（保持红蓝统一） ---------- */
  document.querySelectorAll('.tag').forEach(t => {
    const red = Math.random() > .5;
    t.style.setProperty('--hue', red ? '1' : '0');
  });

  /* ---------- 背景音乐 ---------- */
  const bgm = document.getElementById('bgm');
  const music = document.getElementById('music');
  const mToggle = document.getElementById('music-toggle');
  const mClose = document.getElementById('music-close');
  const mPlay = document.getElementById('music-play');
  const mPrev = document.getElementById('music-prev');
  const mNext = document.getElementById('music-next');
  const mName = document.getElementById('music-name');
  const mSeek = document.getElementById('music-seek');
  const mVol = document.getElementById('music-vol');
  const mCur = document.getElementById('music-cur');
  const mDur = document.getElementById('music-dur');
  const mInput = document.getElementById('music-input');

  /* 本页没有背景音乐播放器（例如「我的项目」页）：整段音乐逻辑直接跳过，不做任何发声 */
  if(!bgm || !music || !mToggle) return;

  const DEFAULT_FILES = ['bgm.mp3','bgm.m4a','bgm.ogg','bgm.wav','bgm.flac','bgm.aac'];
  const SYNTH_NAME = '内置氛围音 · Ambient';
  const mTip = document.querySelector('.music-tip');
  let playlist = [];          // {name, url, obj:boolean}
  let index = 0;
  let mode = 'idle';          // idle 无音源 / file 播放文件 / synth 内置氛围音
  let seeking = false;
  let hinted = false;         // 面板上是否正显示"点击开启声音"提示
  let blockedToast = false;   // 自动播放被拦截的提示是否已经弹过一次
  /* file:// 打开或隐私模式下 localStorage 可能直接抛错，包一层避免整段脚本中断 */
  const LS = {
    get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } },
    set(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
  };
  /* 打开网页即自动播放：
     ALWAYS_AUTOPLAY = true  → 每次打开都播，不再记住上次的暂停状态（点 ▶/❚❚ 仍可随时停）
     想恢复“上次暂停了就不再自动播”的行为，把它改成 false */
  const ALWAYS_AUTOPLAY = true;
  const wantRaw = LS.get('bgm-want');
  let wantPlay = ALWAYS_AUTOPLAY ? true : (wantRaw === null ? true : wantRaw === '1');

  const savedVol = parseInt(LS.get('bgm-vol') || '', 10);
  const volume = Number.isFinite(savedVol) ? Math.min(Math.max(savedVol,0),100) : 55;
  bgm.volume = volume / 100;
  mVol.value = String(volume);

  function fmt(t){
    if(!isFinite(t)) return '0:00';
    const m = Math.floor(t/60), s = Math.floor(t%60);
    return m + ':' + (s<10 ? '0' : '') + s;
  }
  function setName(text){
    hinted = false;
    mName.textContent = text;
    mName.title = text;
    delete mName.dataset.hint;
  }
  function showHint(text){
    hinted = true;
    mName.textContent = text;
    mName.title = text;
    mName.dataset.hint = '1';
  }
  /* 从"点击开启声音"提示恢复到真实曲名 */
  function restoreName(){
    if(!hinted) return;
    if(mode === 'synth') setName(SYNTH_NAME);
    else if(playlist[index]) setName(playlist[index].name);
    else setName('背景音乐');
  }

  /* ---------- 内置氛围音：目录下没有音频文件时的兜底，纯代码合成，不需要任何文件 ---------- */
  const synth = (function(){
    let ctx = null, master = null, timer = 0, bar = 0, on = false, gain = .55;
    /* Am - F - C - G 循环，柔和 pad + 高八度琶音 */
    const CHORDS = [
      [220.00, 261.63, 329.63],
      [174.61, 220.00, 261.63],
      [261.63, 329.63, 392.00],
      [196.00, 246.94, 293.66]
    ];
    function ensure(){
      if(ctx) return ctx;
      const AC = window.AudioContext || window.webkitAudioContext;
      if(!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = gain;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 2400;
      master.connect(lp); lp.connect(ctx.destination);
      ctx.addEventListener('statechange', syncUI);
      return ctx;
    }
    function tone(type, freq, t, dur, amp){
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(.0001, t);
      g.gain.linearRampToValueAtTime(amp, t + (type === 'sine' ? .9 : .02));
      g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + dur + .05);
    }
    function playBar(){
      if(!on) return;
      const c = CHORDS[bar % CHORDS.length];
      const t = ctx.currentTime + .06;
      c.forEach(f => tone('sine', f, t, 2.7, .055));
      for(let i = 0; i < 4; i++) tone('triangle', c[i % 3] * 2, t + i * .62, .6, .03);
      bar++;
    }
    return {
      supported(){ return !!(window.AudioContext || window.webkitAudioContext); },
      start(){
        if(!ensure()) return false;
        if(ctx.state === 'suspended') ctx.resume().catch(()=>{});
        if(!on){ on = true; playBar(); timer = setInterval(playBar, 2400); }
        return true;
      },
      stop(){
        on = false;
        clearInterval(timer); timer = 0;
        if(ctx && ctx.state === 'running') ctx.suspend().catch(()=>{});
      },
      setVolume(v){ gain = v; if(master) master.gain.value = v; },
      running(){ return on && !!ctx && ctx.state === 'running'; },
      /* 给音乐律动用：把音频节点暴露出去接 analyser（只读取，不改变原有输出） */
      nodes(){ return ensure() ? {ctx: ctx, master: master} : null; }
    };
  })();
  window.JFR_SYNTH = synth;          /* 可视化模块从这里拿音频节点 */
  synth.setVolume(volume / 100);

  function isPlaying(){
    if(mode === 'file') return !bgm.paused && !bgm.ended;
    if(mode === 'synth'){
      if(synth.running()) return true;
      /* 合成音由别的标签页在放，本页只显示状态 */
      return !!(remote && remote.playing && Date.now() - remote.ts < SYNC_TTL);
    }
    return false;
  }
  function syncUI(){
    const playing = isPlaying();
    const muted = mode === 'file' && bgm.muted;
    music.classList.toggle('playing', playing);
    music.classList.toggle('muted', muted);
    mPlay.textContent = playing ? (muted ? '🔇' : '❚❚') : '▶';
    mPlay.title = playing
      ? (muted ? (isOwner ? '当前静音中，点击开启声音' : '声音在其它标签页，点击切到本页') : '暂停')
      : '播放';
    mSeek.disabled = mode !== 'file';
    if(mode !== 'file') mDur.textContent = '∞';
  }
  /* ---------- 跨页面同步：同一时刻只允许一个页面发声，其它页面静音跟随同一进度 ---------- */
  const PID = String(Date.now()) + '-' + Math.random().toString(36).slice(2, 7);
  const SYNC_KEY = 'bgm-sync';
  const SYNC_TTL = 2600;
  let isOwner = true;                 // 本页是否负责发声
  let remote = null;                  // 最近一次有效的其它页面状态

  function readSync(){
    try{ return JSON.parse(LS.get(SYNC_KEY) || 'null'); }catch(e){ return null; }
  }
  function publish(){
    const st = {
      owner: PID,
      playing: mode === 'file' ? (!bgm.paused && !bgm.ended) : synth.running(),
      time: mode === 'file' ? bgm.currentTime : 0,
      name: mode === 'file' && playlist[index] ? playlist[index].name : SYNTH_NAME,
      ts: Date.now()
    };
    LS.set(SYNC_KEY, JSON.stringify(st));
  }
  /* 让位：静音跟随其它标签页，进度保持一致 —— 这是"不出现双音"的关键 */
  function follow(st){
    isOwner = false;
    remote = st;
    if(mode === 'synth') synth.stop();
    if(mode === 'file'){
      if(st.playing && wantPlay){
        if(bgm.paused) bgm.play().catch(()=>{});
        bgm.muted = true;                       // 跟进度但不出声
        if(isFinite(st.time) && Math.abs(bgm.currentTime - st.time) > 1.5){
          try{ bgm.currentTime = st.time; }catch(e){}
        }
      }else if(!bgm.paused) bgm.pause();
    }
    syncUI();
  }
  /* 接管：由本页发声（其它页已关闭，或用户在本页点了播放） */
  function claim(st){
    isOwner = true;
    remote = null;
    if(mode === 'file'){
      bgm.muted = false;
      if(st && isFinite(st.time) && Math.abs(bgm.currentTime - st.time) > 1.5){
        try{ bgm.currentTime = st.time; }catch(e){}
      }
      if(wantPlay && bgm.paused) tryPlay();
    }else if(mode === 'synth' && wantPlay){
      synth.start();
      if(!synth.running()) showHint('点击页面任意处开启音乐');
    }
    publish();
    syncUI();
  }
  function onSync(st){
    if(!st || st.owner === PID) return;
    if(Date.now() - st.ts >= SYNC_TTL){         // 对方已关闭 → 本页接着放，不中断
      isOwner = true;
      if(wantPlay) claim(st); else { remote = null; publish(); syncUI(); }
      return;
    }
    follow(st);
  }
  function applySync(){ onSync(readSync()); }

  addEventListener('storage', e => {
    if(e.key !== SYNC_KEY) return;
    let st = null;
    try{ st = e.newValue ? JSON.parse(e.newValue) : null; }catch(err){ return; }
    onSync(st);
  });
  /* 心跳：发声页上报进度；跟随页发现失联就接管 */
  setInterval(() => {
    const st = readSync();
    if(isOwner) publish();
    else if(wantPlay && (!st || Date.now() - st.ts >= SYNC_TTL)) claim(st);
    else if(st) follow(st);
  }, 900);
  /* 关闭 / 离开本页：立刻释放发声权，让其它页面无缝接上 */
  addEventListener('pagehide', () => {
    const st = readSync();
    if(st && st.owner === PID){
      LS.set(SYNC_KEY, JSON.stringify({owner:'', playing:false, time:st.time, name:st.name, ts:0}));
    }
  });

  function releaseList(){
    playlist.forEach(item => { if(item.obj) URL.revokeObjectURL(item.url); });
  }
  /* IndexedDB：把选过的歌存下来，下次打开网址直接接着播 */
  const DB_NAME = 'bgm-db', STORE = 'tracks';
  function openDB(){
    return new Promise((res, rej) => {
      const r = indexedDB.open(DB_NAME, 1);
      r.onupgradeneeded = () => {
        const db = r.result;
        if(!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, {keyPath:'id'});
      };
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }
  async function saveTracks(files){
    try{
      const db = await openDB();
      const tx = db.transaction(STORE, 'readwrite');
      const st = tx.objectStore(STORE);
      st.clear();
      files.slice(0, 20).forEach((f, i) => st.put({id:i, name:f.name, type:f.type, data:f}));
    }catch(e){ /* 隐私模式下不可用时忽略 */ }
  }
  async function loadTracks(){
    try{
      const db = await openDB();
      return await new Promise((res, rej) => {
        const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
        req.onsuccess = () => res((req.result || []).sort((a, b) => a.id - b.id));
        req.onerror = () => rej(req.error);
      });
    }catch(e){ return []; }
  }

  function setList(items, autoplay){
    synth.stop();
    releaseList();
    playlist = items;
    index = 0;
    mode = 'file';
    if(!playlist.length){
      mode = 'idle';
      setName('暂无音乐');
      syncUI();
      return;
    }
    loadIndex(0, autoplay);
  }
  function loadIndex(i, autoplay){
    index = (i + playlist.length) % playlist.length;
    const item = playlist[index];
    mode = 'file';
    synth.stop();
    bgm.src = item.url;
    bgm.muted = false;
    setName(item.name);
    mCur.textContent = '0:00';
    mSeek.value = '0';
    syncUI();
    if(autoplay) tryPlay();
    applySync();                       // 已有其它页面在放就静音跟随
    if(isOwner) publish();             // 本页发声时立刻上报曲目与进度
    /* 上次被手动暂停过（状态记在 localStorage 里），提示一下怎么恢复 */
    if(!wantPlay) showHint('已暂停 · 点 ▶ 继续播放');
  }
  function tryPlay(){
    if(mode !== 'file' || !playlist.length) return;
    const p = bgm.play();
    if(p && p.catch){
      p.catch(() => {
        /* 被浏览器自动播放策略拦截：先静音起播，首次手势后恢复声音 */
        bgm.muted = true;
        const q = bgm.play();
        if(q && q.then) q.then(syncUI).catch(()=>{});
        showHint('点击页面任意处开启声音');
        if(!blockedToast){
          blockedToast = true;
          showToast('浏览器拦截了自动播放，点页面任意处即可开声');
        }
        syncUI();
      });
    }
  }
  /* 目录下没有音频文件时的兜底：用代码合成一段氛围音，保证打开就有声音 */
  function startSynth(){
    mode = 'synth';
    synth.stop();
    mCur.textContent = '0:00';
    mSeek.value = '0';
    if(!synth.supported()){
      setName('浏览器不支持音频播放');
      syncUI();
      return;
    }
    setName(SYNTH_NAME);
    /* 别的页面正在发声时本页不起合成音，否则两边同时响 */
    const st = readSync();
    const othersAlive = !!(st && st.owner !== PID && Date.now() - st.ts < SYNC_TTL);
    if(!othersAlive){
      synth.start();
      if(!synth.running()) showHint('点击页面任意处开启音乐');
    }
    applySync();
    if(isOwner) publish();
    syncUI();
  }
  /* 任意一次用户手势都用来"解禁"声音：解除静音 或 启动内置氛围音 */
  function gestureKick(){
    if(!wantPlay) return;
    if(mode === 'file'){
      /* 跟随其它页面时保持静音，只补上播放动作，不抢发声权 */
      if(isOwner && bgm.muted){ bgm.muted = false; restoreName(); }
      if(bgm.src && bgm.paused) tryPlay();
      syncUI();
    }else if(mode === 'synth' && isOwner && !synth.running()){
      synth.start();
      if(synth.running()) restoreName(); else showHint('点击页面任意处开启音乐');
      syncUI();
    }
  }
  ['pointerdown','keydown','touchstart','touchend','click'].forEach(ev =>
    addEventListener(ev, gestureKick, {passive:true}));

  /* 起播重试：页面刚加载 / 音频还没解码完时，浏览器常会拒绝第一次 play()。
     这里前几秒多试几次；若始终被拒，tryPlay 已静音起播，等首次手势自动解禁 */
  (function autoRetry(){
    let n = 0;
    const timer = setInterval(() => {
      if(++n > 10){ clearInterval(timer); return; }
      if(!wantPlay || !isOwner) return;
      if(mode === 'file'){ if(bgm.src && bgm.paused) tryPlay(); }
      else if(mode === 'synth' && !synth.running()) gestureKick();
    }, 700);
  })();

  /* 切回标签页时若被系统暂停，自动续播 */
  document.addEventListener('visibilitychange', () => {
    if(!document.hidden) gestureKick();
  });

  /* 首屏让路：等页面 load + 一小段空闲后再去探测/播放音频。
     bgm.mp3 有 5 MB 左右，若在首屏渲染的同时开始加载解码，会把主线程抢出一次明显卡顿 */
  function whenIdle(fn){
    let done = false;
    const run = () => { if(done) return; done = true; setTimeout(fn, 260); };
    if(document.readyState === 'complete') run();
    else addEventListener('load', run, {once:true});
    setTimeout(run, 1200);        // 兜底：万一某个资源卡住导致 load 迟迟不来，也要起播
  }

  /* 同目录默认音频自动探测（bgm.mp3 等）；没有则读回上次选过的歌；再没有就用内置氛围音 */
  function probe(i){
    if(i >= DEFAULT_FILES.length){
      if(mode !== 'idle') return;
      loadTracks().then(rows => {
        if(mode !== 'idle') return;                    // 期间已手动选曲 / 已探测到文件
        if(rows.length){
          setList(rows.map(r => ({
            name: r.name.replace(/\.[^.]+$/, ''),
            url: URL.createObjectURL(r.data),
            obj: true
          })), wantPlay);
          return;
        }
        startSynth();
        /* file:// 直接双击打开时浏览器禁用 IndexedDB，选过的曲目无法记住 */
        if(location.protocol === 'file:' && mTip){
          mTip.innerHTML = '当前是 <b>file://</b> 直接打开，浏览器禁止记住曲目；'
            + '把音频命名为 <b>bgm.mp3</b> 放在本页同目录即可自动播放，或每次点上方按钮选曲。';
        }
      });
      return;
    }
    const tester = new Audio();
    tester.preload = 'metadata';
    tester.addEventListener('loadedmetadata', () => {
      if(mode !== 'idle') return;                       // 用户已手动选曲则不覆盖
      setList([{name: DEFAULT_FILES[i].replace(/\.[^.]+$/, ''), url: DEFAULT_FILES[i], obj:false}], wantPlay);
    }, {once:true});
    tester.addEventListener('error', () => probe(i+1), {once:true});
    tester.src = DEFAULT_FILES[i];
  }
  whenIdle(() => probe(0));          // 首屏之后再开始，避免和首屏渲染抢主线程

  /* 本地选曲：支持多选，自动形成播放列表 */
  mInput.addEventListener('change', () => {
    const okExt = /\.(mp3|m4a|aac|wav|ogg|oga|flac|webm)$/i;
    const files = Array.from(mInput.files || []).filter(f => /^audio\//.test(f.type) || okExt.test(f.name));
    if(!files.length){
      showHint('未选择音频文件');
      mInput.value = '';
      return;
    }
    setList(files.map(f => ({
      name: f.name.replace(/\.[^.]+$/, ''),
      url: URL.createObjectURL(f),
      obj: true
    })), true);
    wantPlay = true;
    LS.set('bgm-want', '1');
    saveTracks(files);                  // 记住曲目，下次打开自动播放
    mInput.value = '';
    music.classList.add('open');
  });

  mToggle.addEventListener('click', () => music.classList.toggle('open'));
  mClose.addEventListener('click', () => music.classList.remove('open'));

  mPlay.addEventListener('click', () => {
    /* 声音正由其它标签页发出：这一下是"切到本页发声"，而不是暂停 */
    if(isPlaying() && !isOwner){
      claim(readSync());
      showToast('已切换到本页发声');
      return;
    }
    /* 正处于"静音自动播放"状态：这一下应该是"开声音"，而不是暂停 */
    if(mode === 'file' && bgm.muted && !bgm.paused){
      bgm.muted = false;
      restoreName();
      syncUI();
      showToast('声音已开启');
      return;
    }
    const playing = isPlaying();
    wantPlay = !playing;
    LS.set('bgm-want', wantPlay ? '1' : '0');
    if(wantPlay){
      if(mode === 'idle') startSynth();
      else if(!isOwner) claim(readSync());          // 重新播放时把发声权拿回本页
      else if(mode === 'file') tryPlay();
      else { synth.start(); if(!synth.running()) showHint('点击页面任意处开启音乐'); }
    }else{
      isOwner = true;                    // 暂停要能广播出去，先拿到话语权
      if(mode === 'file') bgm.pause(); else synth.stop();
    }
    if(isOwner) publish();             // 立即广播，其它页面不用等心跳
    syncUI();
  });

  function switchTrack(step){
    if(mode !== 'file' || !playlist.length){
      showToast('当前是内置氛围音，先"选择本地音乐"即可切歌');
      return;
    }
    loadIndex(index + step, true);
  }
  mPrev.addEventListener('click', () => switchTrack(-1));
  mNext.addEventListener('click', () => switchTrack(1));

  mVol.addEventListener('input', () => {
    const v = Number(mVol.value) / 100;
    bgm.volume = v;
    synth.setVolume(v);
    LS.set('bgm-vol', mVol.value);
  });

  mSeek.addEventListener('pointerdown', () => { seeking = true; });
  mSeek.addEventListener('input', () => {
    seeking = true;
    mCur.textContent = fmt(bgm.duration * Number(mSeek.value) / 1000);
  });
  mSeek.addEventListener('change', () => {
    seeking = false;
    if(isFinite(bgm.duration) && bgm.duration) bgm.currentTime = bgm.duration * (Number(mSeek.value)/1000);
    if(isOwner) publish();             // 拖动进度也同步给其它页面
  });

  bgm.addEventListener('play', syncUI);
  bgm.addEventListener('pause', syncUI);
  bgm.addEventListener('volumechange', syncUI);
  bgm.addEventListener('playing', () => { if(!bgm.muted) restoreName(); syncUI(); });
  bgm.addEventListener('loadedmetadata', () => { mDur.textContent = fmt(bgm.duration); });
  bgm.addEventListener('timeupdate', () => {
    if(seeking || !isFinite(bgm.duration) || !bgm.duration) return;
    mSeek.value = String(Math.round(bgm.currentTime / bgm.duration * 1000));
    mCur.textContent = fmt(bgm.currentTime);
  });
  /* loop 属性已去掉：单曲自动重播，多曲顺序播放 */
  bgm.addEventListener('ended', () => {
    if(playlist.length > 1) loadIndex(index+1, true);
    else if(wantPlay){ bgm.currentTime = 0; tryPlay(); }
  });

  /* 离开页面时立刻断开音频下载：bgm.mp3 有 5 MB 多，而本地服务器同一时刻
     只处理一个连接；不中断的话，跳转「我的项目 / 放松一下」的请求会排在
     下载后面排队，看起来就像一直卡在加载页。pagehide 触发时释放连接，
     通过前进/后退回到本页（bfcache）时再恢复播放。 */
  let savedSrc = '', savedTime = 0;
  function suspendAudio(){
    try{
      if(bgm.src){ savedSrc = bgm.src; savedTime = bgm.currentTime || 0; }
      bgm.pause();
      bgm.removeAttribute('src');
      bgm.load();                     // 立刻中止未完成的下载
    }catch(e){}
  }
  function resumeAudio(){
    if(!savedSrc) return;
    const src = savedSrc, at = savedTime;
    savedSrc = '';
    try{ bgm.src = src; bgm.currentTime = at; if(wantPlay) tryPlay(); }catch(e){}
  }
  addEventListener('pagehide', suspendAudio);
  addEventListener('pageshow', e => { if(e.persisted) resumeAudio(); });

  syncUI();
})();

/* ================= 趣味小功能 ================= */
(function(){
  /* ---------- 1. 此时此刻：实时日期 + 时间，逐秒跳动 ---------- */
  const nowEl = document.getElementById('nowTime');
  if(nowEl){
    const W = ['日', '一', '二', '三', '四', '五', '六'];
    const pad = n => String(n).padStart(2, '0');
    function tick(){
      const d = new Date();
      nowEl.textContent = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
        + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
      nowEl.title = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 星期'
        + W[d.getDay()] + ' ' + nowEl.textContent.slice(11);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- 2. 每日一言：每次刷新换一句 ---------- */
  const mottoEl = document.getElementById('motto');
  if(mottoEl){
    const LIST = [
      '// 写代码的人，先得敢做梦。',
      '// 键盘敲下去的每一声，都是心跳。',
      '// 别人看的是结果，我看的是那一行行熬过的夜。',
      '// 跑起来的那一刻，世界才承认你。',
      '// 不问天赋几何，只问今天交付了什么。',
      '// 把热爱写成代码，把代码活成热爱。',
      '// 慢一点没关系，别停下来就好。',
      '// 每一个 bug，都是通往熟练的门票。'
    ];
    mottoEl.textContent = LIST[Math.floor(Math.random() * LIST.length)];
  }

  /* ---------- 3. 隐藏彩蛋：↑↑↓↓←→←→BA ---------- */
  const KEY = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;
  const toastEl = document.getElementById('toast');
  let eggTimer;
  function pop(msg){
    if(!toastEl) return;
    toastEl.textContent = msg;
    toastEl.style.opacity = '1';
    toastEl.style.transform = 'translate(-50%, 0)';
    clearTimeout(eggTimer);
    eggTimer = setTimeout(() => {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translate(-50%, 30px)';
    }, 2600);
  }
  addEventListener('keydown', e => {
    const k = (e.key || '').length === 1 ? (e.key || '').toLowerCase() : e.key;
    pos = (k === KEY[pos]) ? pos + 1 : (k === KEY[0] ? 1 : 0);
    if(pos === KEY.length){
      pos = 0;
      document.body.classList.remove('rainbow');
      void document.body.offsetWidth;            // 重启动画
      document.body.classList.add('rainbow');
      setTimeout(() => document.body.classList.remove('rainbow'), 6000);
      pop('彩蛋触发：为代码而生，流淌着代码的血！');
    }
  });

  /* ---------- 4. 离开标签页时，标题悄悄喊你回来 ---------- */
  const rawTitle = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? '别走呀…代码还没跑完 ' + String.fromCodePoint(0x1F61E) : rawTitle;
  });
})();
