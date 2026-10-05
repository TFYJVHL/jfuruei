/* =========================================================
   趣味增强模块
   1 控制台彩蛋  2 开机自检  3 代码雨(输入 jifurui)  4 提交热力图
   5 站点看板    6 能力雷达图  7 点击粒子   8 键盘音效
   9 主题切换    10 打字机标题  11 人生进度   12 时间胶囊
   ========================================================= */
(function(){
  const LS = {
    get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } },
    set(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
  };
  const SS = {
    get(k){ try{ return sessionStorage.getItem(k); }catch(e){ return null; } },
    set(k, v){ try{ sessionStorage.setItem(k, v); }catch(e){} }
  };
  const $ = s => document.querySelector(s);
  const rnd = (a, b) => a + Math.random() * (b - a);

  /* ---------- Toast（复用页面已有 #toast） ---------- */
  const toastEl = document.getElementById('toast');
  let toastTimer;
  function toast(msg, ms){
    if(!toastEl) return;
    toastEl.textContent = msg;
    toastEl.style.opacity = '1';
    toastEl.style.transform = 'translate(-50%, 0)';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translate(-50%, 30px)';
    }, ms || 2600);
  }

  /* ============ 1. 控制台彩蛋 ============ */
  (function(){
    const ART = [
      '     \u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2557 ',
      '     \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557',
      '     \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D',
      '\u2588\u2588   \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u255D  \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557',
      '\u255A\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551     \u2588\u2588\u2551  \u2588\u2588\u2551',
      ' \u255A\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u255D     \u255A\u2550\u255D  \u255A\u2550\u255D'
    ].join('\n');
    try{
      console.log('%c' + ART + '\n', 'color:#ff1b3d; font-weight:900; line-height:1.1;');
      console.log('%c 纪福瑞 ｜ 19 岁 ｜ 计算机网络信息安全师 ｜ 为代码而生', 'color:#00b4ff; font-size:13px; font-weight:700;');
      console.log('%c 邮箱 13080095649@163.com   ｜   手机 13080095649', 'color:#ffd9a0;');
      console.log('%c 既然翻到了控制台 —— 说明你也是写代码的人。要不要聊聊？', 'color:#7dffb2;');
    }catch(e){}
  })();

  /* ============ 2. 开机自检 ============ */
  let bootDelay = 300;
  (function(){
    const boot = document.getElementById('boot');
    if(!boot) return;
    if(SS.get('booted')){ boot.remove(); return; }
    const log = document.getElementById('bootLog');
    const bar = document.getElementById('bootBar');
    const LINES = [
      'JIFURUI BIOS v1.9  ............  OK',
      'CPU   : PASSION x19 @ 4.20GHz ..  OK',
      'RAM   : 300+ PROJECTS / NO FEAR .  OK',
      'LOAD  FRONTEND ................ 100%',
      'LOAD  C / C++ / PYTHON ........ 100%',
      'LOAD  SECURITY & OPS .......... 100%',
      'LOAD  DREAMS ..................  \u221E',
      'READY.   WELCOME TO MY WORLD.'
    ];
    bootDelay = LINES.length * 200 + 700;
    let i = 0, done = false;
    const timer = setInterval(() => {
      log.textContent += (i ? '\n' : '') + '> ' + LINES[i];
      bar.style.width = Math.round((++i / LINES.length) * 100) + '%';
      if(i >= LINES.length){ clearInterval(timer); setTimeout(finish, 420); }
    }, 200);
    function finish(){
      if(done) return;
      done = true;
      SS.set('booted', '1');
      boot.classList.add('done');
      setTimeout(() => boot.remove(), 600);
    }
    boot.addEventListener('click', finish);
    addEventListener('keydown', finish, {once:true});
  })();

  /* ============ 3. 输入 jifurui → 代码雨 ============ */
  (function(){
    let buf = '';
    addEventListener('keydown', e => {
      if(!e.key || e.key.length !== 1) return;
      buf = (buf + e.key.toLowerCase()).slice(-7);
      if(buf === 'jifurui'){ buf = ''; rain(); }
    });
    function rain(){
      const cv = document.createElement('canvas');
      cv.style.cssText = 'position:fixed;inset:0;z-index:200;pointer-events:none;opacity:.9';
      cv.width = innerWidth; cv.height = innerHeight;
      document.body.appendChild(cv);
      const ctx = cv.getContext('2d');
      const FONT = 15;
      const cols = Math.ceil(cv.width / FONT);
      const y = new Array(cols).fill(0).map(() => Math.random() * cv.height);
      const CH = '01</>{}[]#$%&*+=-;:ABCDEFabcdef\u7EAA\u798F\u745E\u4EE3\u7801';
      let t0 = Date.now();
      (function frame(){
        ctx.fillStyle = 'rgba(4,5,10,.14)';
        ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.font = FONT + 'px ' + 'monospace';
        for(let i = 0; i < cols; i++){
          const ch = CH[Math.floor(Math.random() * CH.length)];
          ctx.fillStyle = Math.random() < .06 ? '#ffffff' : '#3dff9e';
          ctx.fillText(ch, i * FONT, y[i]);
          y[i] = (y[i] > cv.height + Math.random() * 400) ? 0 : y[i] + FONT;
        }
        if(Date.now() - t0 < 3000) requestAnimationFrame(frame);
        else {
          cv.style.transition = 'opacity .6s';
          cv.style.opacity = '0';
          setTimeout(() => cv.remove(), 650);
        }
      })();
      toast('代码雨来了：我为代码而生，流淌着代码的血');
    }
  })();

  /* ============ 4. 提交热力图 ============ */
  (function(){
    const box = document.getElementById('heatmap');
    if(!box) return;
    const DAYS = 371;
    let seed = 20230901;
    const rand = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const start = new Date(today); start.setDate(today.getDate() - DAYS + 1);
    let total = 0;
    const cells = [];
    for(let i = 0; i < DAYS; i++){
      const d = new Date(start); d.setDate(start.getDate() + i);
      const w = d.getDay();
      const r = rand();
      let n = r < .16 ? 0 : r < .40 ? 1 : r < .66 ? 3 : r < .86 ? 5 : 8;
      if((w === 0 || w === 6) && n > 0) n += 2;      // 周末更卷
      total += n;
      cells.push({d: d, n: n});
    }
    const pad = cells[0].d.getDay();
    for(let i = 0; i < pad; i++){
      const s = document.createElement('i');
      s.style.visibility = 'hidden';
      box.appendChild(s);
    }
    cells.forEach(function(c){
      const s = document.createElement('i');
      const lv = c.n === 0 ? 0 : c.n <= 2 ? 1 : c.n <= 4 ? 2 : c.n <= 6 ? 3 : 4;
      if(lv) s.className = 'l' + lv;
      const info = c.d.getFullYear() + '-' + (c.d.getMonth() + 1) + '-' + c.d.getDate()
        + ' · ' + (c.n ? '敲了 ' + c.n + ' 次' : '休息一天');
      s.title = info;                 // 无 JS 悬浮层时的兜底提示
      s.dataset.tip = info;           // 自定义气泡用
      box.appendChild(s);
    });

    /* 悬停气泡：原生 title 没法加粗，自己画一个，顺便补一句“这是我来时的路程” */
    const tip = document.createElement('div');
    tip.className = 'heat-tip';
    document.body.appendChild(tip);
    function moveTip(x, y){
      const w = tip.offsetWidth, h = tip.offsetHeight;
      let left = Math.min(Math.max(x - w / 2, 10), Math.max(10, innerWidth - w - 10));
      let top = y - h - 14;
      if(top < 10) top = y + 20;
      tip.style.left = left + 'px';
      tip.style.top = top + 'px';
    }
    box.addEventListener('mouseover', function(e){
      const c = e.target && e.target.closest ? e.target.closest('i') : null;
      if(!c || !c.dataset.tip || c.style.visibility === 'hidden') return;
      tip.innerHTML = '<span class="tip-day">' + c.dataset.tip + '</span>'
        + '<b class="tip-road">这是我来时的路程</b>';
      tip.classList.add('on');
      moveTip(e.clientX, e.clientY);
    });
    box.addEventListener('mousemove', function(e){
      if(tip.classList.contains('on')) moveTip(e.clientX, e.clientY);
    });
    box.addEventListener('mouseleave', function(){ tip.classList.remove('on'); });
    window.addEventListener('scroll', function(){ tip.classList.remove('on'); }, {passive:true});
    const cnt = document.getElementById('heatCount');
    if(cnt) cnt.textContent = total + ' 次提交 · 近一年';
  })();

  /* ============ 5. 站点看板 ============ */
  (function(){
    /* 站点实际上线时刻（本地时间，精确到秒）—— 改成你站点真正上线的那一刻，
       运行时间就从这一刻开始实时累加，逐秒跳动 */
    const SITE_START = new Date(2026, 8, 15, 20, 37, 23);
    const pad = n => String(n).padStart(2, '0');
    const up = document.getElementById('siteUptime');
    if(up){
      const fmt0 = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
                        + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
      function tick(){
        let s = Math.max(0, Math.floor((Date.now() - SITE_START.getTime()) / 1000));
        const d = Math.floor(s / 86400); s -= d * 86400;
        const h = Math.floor(s / 3600);  s -= h * 3600;
        const m = Math.floor(s / 60);    s -= m * 60;
        up.textContent = d + ' 天 ' + pad(h) + ':' + pad(m) + ':' + pad(s);
        up.title = '自 ' + fmt0(SITE_START) + ' 上线以来累计运行';
      }
      tick();
      setInterval(tick, 1000);
    }
    const views = document.getElementById('siteViews');
    if(views){
      /* 访客编号：从 0 开始，每打开一次页面 +1
         旧版是随机生成 1000~8999 的固定编号，这里换用新键，旧数据自动作废 */
      LS.set('site-visitor', '0');
      let no = parseInt(LS.get('site-visitor-no') || '0', 10);
      if(!Number.isFinite(no) || no < 0) no = 0;
      no++;
      LS.set('site-visitor-no', String(no));
      views.textContent = '第 ' + no + ' 位访客';
    }
  })();

  /* ============ 6. 能力雷达图（原进度条保留） ============ */
  (function(){
    const cv = document.getElementById('radar');
    if(!cv || !cv.getContext) return;
    const ctx = cv.getContext('2d');
    const items = [].slice.call(document.querySelectorAll('#skills .skill')).map(function(s){
      const nm = s.querySelector('.nm'), pc = s.querySelector('.pc');
      return {
        name: nm ? nm.textContent.trim() : '',
        val: pc ? (parseInt(pc.textContent, 10) || 0) : 0
      };
    });
    if(items.length < 3) return;
    const W = cv.width, H = cv.height, cx = W / 2, cy = H / 2 + 6, R = 132;
    const N = items.length;
    const pt = function(i, r){
      const a = -Math.PI / 2 + i * 2 * Math.PI / N;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    };
    function draw(p){
      ctx.clearRect(0, 0, W, H);
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      const lineC = light ? 'rgba(20,23,32,.18)' : 'rgba(255,255,255,.16)';
      const textC = light ? '#3a4152' : 'rgba(255,255,255,.82)';
      for(let r = 1; r <= 4; r++){
        ctx.beginPath();
        for(let i = 0; i < N; i++){
          const q = pt(i, R * r / 4);
          i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]);
        }
        ctx.closePath();
        ctx.strokeStyle = lineC; ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.strokeStyle = lineC;
      for(let i = 0; i < N; i++){
        const q = pt(i, R);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(q[0], q[1]); ctx.stroke();
      }
      ctx.beginPath();
      for(let i = 0; i < N; i++){
        const q = pt(i, R * items[i].val / 100 * p);
        i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]);
      }
      ctx.closePath();
      const g = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      g.addColorStop(0, 'rgba(255,27,61,.55)');
      g.addColorStop(1, 'rgba(0,180,255,.55)');
      ctx.fillStyle = g; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
      for(let i = 0; i < N; i++){
        const q = pt(i, R * items[i].val / 100 * p);
        ctx.beginPath(); ctx.arc(q[0], q[1], 3.5, 0, 7); ctx.fillStyle = '#fff'; ctx.fill();
      }
      ctx.font = '600 13px "PingFang SC","Microsoft YaHei",sans-serif';
      ctx.fillStyle = textC;
      for(let i = 0; i < N; i++){
        const q = pt(i, R + 30);
        const label = items[i].name.length > 5 ? items[i].name.slice(0, 5) : items[i].name;
        const a = -Math.PI / 2 + i * 2 * Math.PI / N;
        ctx.textAlign = Math.abs(Math.cos(a)) < .2 ? 'center' : (Math.cos(a) > 0 ? 'left' : 'right');
        ctx.textBaseline = 'middle';
        ctx.fillText(label, q[0], q[1]);
        ctx.fillStyle = light ? '#8a93a6' : 'rgba(255,255,255,.5)';
        ctx.font = '11px monospace';
        ctx.fillText(items[i].val + '%', q[0], q[1] + 15);
        ctx.font = '600 13px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.fillStyle = textC;
      }
    }
    draw(0);
    let played = false;
    function play(){
      if(played) return;
      played = true;
      const t0 = Date.now();
      (function step(){
        const p = Math.min((Date.now() - t0) / 900, 1);
        draw(1 - Math.pow(1 - p, 3));
        if(p < 1) requestAnimationFrame(step);
      })();
    }
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(en){
        en.forEach(function(e){ if(e.isIntersecting){ play(); } });
      }, {threshold:.3}).observe(cv);
    } else play();
    /* 主题切换后重画一次，保证文字颜色跟得上 */
    addEventListener('jfr:theme', function(){ draw(1); });
  })();

  /* ============ 7. 点击 </> 粒子 ============ */
  (function(){
    const SYM = ['</>', '{}', ';', '()', '#', '=>', '&&', '[]', '++'];
    addEventListener('pointerdown', function(e){
      for(let i = 0; i < 7; i++) spawn(e.clientX, e.clientY);
    });
    function spawn(x, y){
      const el = document.createElement('span');
      el.className = 'pcl';
      el.textContent = SYM[Math.floor(Math.random() * SYM.length)];
      el.style.left = (x + rnd(-14, 14)) + 'px';
      el.style.top = (y + rnd(-10, 10)) + 'px';
      el.style.setProperty('--dx', rnd(-46, 46).toFixed(0) + 'px');
      el.style.setProperty('--rot', rnd(-90, 90).toFixed(0) + 'deg');
      if(Math.random() < .35) el.style.color = '#ff8098';
      document.body.appendChild(el);
      setTimeout(function(){ el.remove(); }, 950);
    }
  })();

  /* ============ 8. 键盘音效（WebAudio 合成，无需音频文件） ============ */
  (function(){
    const box = document.getElementById('kbdSnd');
    let ctx = null;
    function click(){
      try{
        const AC = window.AudioContext || window.webkitAudioContext;
        if(!AC) return;
        ctx = ctx || new AC();
        if(ctx.state === 'suspended') ctx.resume();
        const t = ctx.currentTime;
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'square';
        o.frequency.setValueAtTime(rnd(1100, 1700), t);
        o.frequency.exponentialRampToValueAtTime(320, t + .045);
        g.gain.setValueAtTime(.045, t);
        g.gain.exponentialRampToValueAtTime(.0005, t + .055);
        o.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t + .07);
      }catch(e){}
    }
    if(box){
      box.checked = LS.get('kbd-snd') === '1';
      box.addEventListener('change', function(){
        LS.set('kbd-snd', box.checked ? '1' : '0');
        toast(box.checked ? '键盘音效已开启：敲起来' : '键盘音效已关闭');
        if(box.checked) click();
      });
    }
    addEventListener('keydown', function(){
      if(box && box.checked) click();
    });
  })();

  /* ============ 9. 深色 / 浅色主题 ============ */
  (function(){
    const btn = document.getElementById('themeBtn');
    function apply(t){
      document.documentElement.setAttribute('data-theme', t);
      if(btn) btn.textContent = t === 'light' ? '☀' : '☾';
    }
    apply(LS.get('theme') === 'light' ? 'light' : 'dark');
    if(btn){
      btn.addEventListener('click', function(){
        const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        LS.set('theme', next);
        apply(next);
        dispatchEvent(new Event('jfr:theme'));
        toast(next === 'light' ? '已切到浅色：白天也看得清' : '已切回深色：夜里更护眼');
      });
    }
  })();

  /* ============ 10. 打字机标题 ============ */
  (function(){
    const h1 = document.querySelector('.hero h1');
    if(!h1) return;
    const lines = [].slice.call(h1.querySelectorAll('.line'));
    if(!lines.length) return;
    let li = 0;
    function runLine(){
      if(li >= lines.length) return;
      const line = lines[li];
      const txt = line.querySelector('.txt');
      const shs = [].slice.call(line.querySelectorAll('.shadow'));
      if(!txt){ li++; return runLine(); }
      const full = txt.textContent;
      txt.textContent = ''; shs.forEach(function(s){ s.textContent = ''; });
      txt.classList.add('typing');
      let i = 0;
      const iv = setInterval(function(){
        i++;
        const s = full.slice(0, i);
        txt.textContent = s;
        shs.forEach(function(x){ x.textContent = s; });
        if(i >= full.length){
          clearInterval(iv);
          txt.classList.remove('typing');
          li++;
          setTimeout(runLine, 380);
        }
      }, 135);
    }
    setTimeout(runLine, bootDelay);
  })();

  /* ============ 11. 人生进度 + 滚到底的寄语 ============ */
  (function(){
    const bar = document.getElementById('lifeBar');
    const txt = document.getElementById('lifeTxt');
    if(bar || txt){
      const AGE = 19, ALL = 100;
      if(bar) bar.style.width = AGE + '%';
      if(txt) txt.textContent = AGE + ' / ' + ALL + ' 年 · ' + AGE + '%';
    }
    let fired = false, ticking = false;
    addEventListener('scroll', function(){
      if(fired || ticking) return;
      ticking = true;
      requestAnimationFrame(function(){
        ticking = false;
        const max = document.documentElement.scrollHeight - innerHeight;
        if(max > 0 && scrollY / max > .98){
          fired = true;
          toast('路还长，但我在跑。');
        }
      });
    }, {passive:true});
  })();

  /* ============ 12. 时间胶囊 ============ */
  (function(){
    const input = document.getElementById('capInput');
    const save = document.getElementById('capSave');
    const tip = document.getElementById('capTip');
    if(!input || !save || !tip) return;
    const KEY = 'jfr-capsule';
    const UNLOCK_DAYS = 365;               // 想快点看效果，把这里改成 1（一天后解封）
    const DAY = 86400000;

    function render(){
      const raw = LS.get(KEY);
      if(!raw){ tip.textContent = '还没写下任何东西。写一句封存起来，' + UNLOCK_DAYS + ' 天后的你会收到。'; return; }
      let c;
      try{ c = JSON.parse(raw); }catch(e){ tip.textContent = '还没写下任何东西。'; return; }
      const left = c.at + UNLOCK_DAYS * DAY - Date.now();
      if(left <= 0){
        tip.innerHTML = '已解封：「' + esc(c.text) + '」 <a href="#" id="capOpen" style="color:#ff8098">再看一次</a>';
        const a = document.getElementById('capOpen');
        if(a) a.addEventListener('click', function(e){ e.preventDefault(); openBox(c.text); });
        openBox(c.text);
      }else{
        tip.innerHTML = '已封存：「' + esc(c.text) + '」· 距解封还有 '
          + Math.ceil(left / DAY) + ' 天 <a href="#" id="capPeek" style="color:#8fe0ff">提前解封</a>';
        const a = document.getElementById('capPeek');
        if(a) a.addEventListener('click', function(e){ e.preventDefault(); openBox(c.text); });
      }
    }
    function esc(s){ return String(s).replace(/[&<>"]/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[m]; }); }
    function openBox(text){
      const mask = document.createElement('div');
      mask.className = 'cap-modal';
      mask.innerHTML = '<div class="cap-box"><h3>时间胶囊已解封</h3><p>' + esc(text)
        + '</p><button class="mini-btn" id="capClose">收好，继续跑</button></div>';
      document.body.appendChild(mask);
      const close = function(){ mask.remove(); };
      document.getElementById('capClose').addEventListener('click', close);
      mask.addEventListener('click', function(e){ if(e.target === mask) close(); });
    }
    save.addEventListener('click', function(){
      const v = input.value.trim();
      if(!v){ toast('先写一句话再封存吧'); return; }
      LS.set(KEY, JSON.stringify({text: v, at: Date.now()}));
      input.value = '';
      render();
      toast('已封存：' + UNLOCK_DAYS + ' 天后自动解封');
    });
    input.addEventListener('keydown', function(e){ if(e.key === 'Enter') save.click(); });
    render();
  })();

  /* ============ 13. 音乐律动：面板频谱条 + ♪ 按钮随节拍呼吸 ============ */
  (function(){
    const cv = document.getElementById('viz');
    if(!cv || !cv.getContext) return;
    const g = cv.getContext('2d');
    const W = cv.width, H = cv.height, BARS = 26;
    const vals = new Array(BARS).fill(0), peaks = new Array(BARS).fill(0);
    const AC = window.AudioContext || window.webkitAudioContext;
    let fileAn = null, synthAn = null, vizCtx = null, attached = false, data = null;

    /* 本地音乐：接管 <audio> 输出做频谱分析（必须等用户手势，否则浏览器会掐掉声音） */
    function attachFile(){
      if(attached || !AC) return;
      attached = true;
      const el = document.getElementById('bgm');
      if(!el) return;
      try{ vizCtx = new AC(); }catch(e){ return; }
      const go = function(){
        if(!vizCtx || vizCtx.state !== 'running'){ vizCtx = null; return; }
        try{
          const src = vizCtx.createMediaElementSource(el);
          fileAn = vizCtx.createAnalyser();
          fileAn.fftSize = 128; fileAn.smoothingTimeConstant = .7;
          src.connect(fileAn); fileAn.connect(vizCtx.destination);
          data = new Uint8Array(fileAn.frequencyBinCount);
        }catch(e){ fileAn = null; vizCtx = null; }
      };
      const p = vizCtx.state === 'running' ? null : vizCtx.resume();
      if(p && p.then) p.then(go)['catch'](function(){ vizCtx = null; });
      else go();
    }
    ['pointerdown','keydown','touchstart'].forEach(function(ev){
      addEventListener(ev, attachFile, {once:true, passive:true});
    });

    /* 内置氛围音：从 synth 的 master 分接一个 analyser，完全不影响原有输出 */
    function tapSynth(){
      const S = window.JFR_SYNTH;
      if(!S || !S.nodes) return null;
      const n = S.nodes();
      if(!n) return null;
      try{
        if(!synthAn){
          synthAn = n.ctx.createAnalyser();
          synthAn.fftSize = 128; synthAn.smoothingTimeConstant = .7;
          n.master.connect(synthAn);
        }
        return S.running() ? synthAn : null;
      }catch(e){ return null; }
    }

    /* 取一帧频谱；两种音源都没有声音时返回 false（走待机呼吸波） */
    function pump(){
      const el = document.getElementById('bgm');
      if(fileAn && el && !el.paused && !el.muted){
        fileAn.getByteFrequencyData(data);
        for(let i = 0; i < data.length; i++) if(data[i]) return true;
      }
      const sa = tapSynth();
      if(sa){
        if(!data || data.length !== sa.frequencyBinCount) data = new Uint8Array(sa.frequencyBinCount);
        sa.getByteFrequencyData(data);
        for(let i = 0; i < data.length; i++) if(data[i]) return true;
      }
      return false;
    }

    function bar(x, y, w, h, r){
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

    const grad = g.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, '#ff1b3d');
    grad.addColorStop(.55, '#ff5f7a');
    grad.addColorStop(1, '#00b4ff');

    /* 供首屏那根律动柱复用：两个 canvas 共用一个 analyser */
    window.JFR_SPECTRUM = function(){ return pump() ? data : null; };

    let t = 0, lastBeat = -1, skip = 0;
    const musicBox = document.getElementById('music');
    (function loop(){
      t += .05;
      const live = pump();
      const open = !musicBox || musicBox.classList.contains('open');
      if(open || ++skip % 4 === 0){                 // 面板收起时降频，省电
        g.clearRect(0, 0, W, H);
        const bw = W / BARS, mid = H * .56, span = H - 24;
        let sum = 0;
        for(let i = 0; i < BARS; i++){
          let target;
          if(live){
            const idx = Math.min(data.length - 1, 1 + Math.floor(Math.pow(i / BARS, 1.5) * 44));
            target = (data[idx] || 0) / 200;
          }else{
            target = .07 + .06 * Math.sin(t * 1.5 + i * .42) + .045 * Math.sin(t * .8 - i * .27);
          }
          if(target > 1) target = 1;
          if(target < 0) target = 0;
          vals[i] += (target - vals[i]) * (target > vals[i] ? .5 : .11);   // 上冲快、回落慢
          peaks[i] = Math.max(peaks[i] - .011, vals[i]);
          sum += vals[i];
          const h = Math.max(2, vals[i] * span);
          const x = i * bw + bw * .2, w = bw * .6;
          g.fillStyle = grad;
          bar(x, mid - h / 2, w, h, Math.min(3.5, w / 2));
          g.fillStyle = 'rgba(255,255,255,.8)';                            // 峰值帽
          g.fillRect(x, mid - peaks[i] * span / 2 - 4, w, 1.6);
        }
        const beat = Math.min(1, sum / BARS * 1.9);
        if(Math.abs(beat - lastBeat) > .015){
          lastBeat = beat;
          document.documentElement.style.setProperty('--beat', beat.toFixed(3));
        }
      }
      requestAnimationFrame(loop);
    })();
  })();

  /* ============ 14. 首屏律动柱：大标题与简历卡之间的亚克力音乐律动 ============ */
  (function(){
    const cv = document.getElementById('vizHero');
    if(!cv || !cv.getContext) return;
    const g = cv.getContext('2d');
    const BARS = 16;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0, H = 0, grad = null;
    const vals = new Array(BARS).fill(0), peaks = new Array(BARS).fill(0);

    function fit(){
      const w = cv.clientWidth || 120, h = cv.clientHeight || 300;
      cv.width = Math.max(1, Math.round(w * dpr));
      cv.height = Math.max(1, Math.round(h * dpr));
      W = cv.width; H = cv.height;
      grad = g.createLinearGradient(0, H, 0, 0);
      grad.addColorStop(0, '#ff1b3d');
      grad.addColorStop(.5, '#ff5f7a');
      grad.addColorStop(1, '#00b4ff');
    }
    fit();
    addEventListener('resize', fit, {passive:true});
    /* 柱子高度现在跟随简历卡（flex 拉伸），高度一变就重新取画布尺寸 */
    if(window.ResizeObserver){
      const ro = new ResizeObserver(() => fit());
      ro.observe(cv.parentElement || cv);
    }

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

    const spec = function(){
      return window.JFR_SPECTRUM ? window.JFR_SPECTRUM() : null;
    };

    let t = 0, skip = 0;
    (function loop(){
      t += .05;
      const d = spec();
      if(++skip % 2 === 0){                       // 首屏常驻，隔帧绘制省电
        g.clearRect(0, 0, W, H);
        const bw = W / BARS, base = H - 2 * dpr, span = H - 14 * dpr;
        for(let i = 0; i < BARS; i++){
          let target;
          if(d){
            const idx = Math.min(d.length - 1, 1 + Math.floor(Math.pow(i / BARS, 1.4) * 40));
            target = (d[idx] || 0) / 190;
          }else{
            target = .08 + .07 * Math.sin(t * 1.6 + i * .45) + .05 * Math.sin(t * .9 - i * .3);
          }
          target = Math.max(0, Math.min(1, target));
          vals[i] += (target - vals[i]) * (target > vals[i] ? .5 : .1);   // 上冲快、回落慢
          peaks[i] = Math.max(peaks[i] - .012, vals[i]);
          const h = Math.max(2 * dpr, vals[i] * span);
          const x = i * bw + bw * .18, w = bw * .64;
          g.fillStyle = grad;
          bar(x, base - h, w, h, Math.min(4 * dpr, w / 2));
          g.fillStyle = 'rgba(255,255,255,.85)';                          // 峰值帽
          g.fillRect(x, base - peaks[i] * span - 3 * dpr, w, 1.6 * dpr);
        }
      }
      requestAnimationFrame(loop);
    })();
  })();
})();
