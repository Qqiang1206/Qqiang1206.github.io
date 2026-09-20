/* =====================================================
   QQIANG.COM · 交互脚本
   光头物理引擎 / 彩蛋 / 自定义光标 / 滚动显现
   ===================================================== */
(function () {
  'use strict';

  const $  = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  const finePointer  = matchMedia('(pointer: fine)').matches;

  // 动画开关状态（右下角按钮可切换，记忆在 localStorage）
  // 注：不再跟随系统「减少动态效果」设置，动画默认照常播放
  let motionOn = true;
  try { motionOn = localStorage.getItem('lyq-motion') !== 'off'; } catch (_) { /* noop */ }

  /* ---------- 顶部时钟 ---------- */
  const clock = $('#clock');
  if (clock) {
    const tick = () => {
      const d = new Date();
      clock.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()]
        .map(n => String(n).padStart(2, '0')).join(':');
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- 状态彩蛋轻量轮换 ---------- */
  const statusTxt = $('.status .txt');
  if (statusTxt) {
    const statuses = [
      '正在用 AI Coding 搞事情',
      '正在试玩一个产品',
      '正在折腾玩码场',
      '正在拍体验视频',
      '正在摸鱼'
    ];
    let si = 0;
    setInterval(() => {
      si = (si + 1) % statuses.length;
      statusTxt.textContent = statuses[si];
    }, 8000);
  }

  /* ---------- 按时段问候 ---------- */
  const greeting = $('#greeting');
  if (greeting) {
    const h = new Date().getHours();
    const table = [
      [0, 5,  '凌晨 ' + h + ' 点还醒着？真正的赛博修行者。'],
      [5, 9,  '早起的鸟儿有 Bug 抓。'],
      [9, 12, '上午写码，效率惊人（大概）。'],
      [12, 14, '午休时间，代码也要午睡。'],
      [14, 18, '下午茶配代码，人间绝配。'],
      [18, 24, '夜幕降临，创造力上线。']
    ];
    const hit = table.find(([a, b]) => h >= a && h < b) || table[2];
    greeting.textContent = '💊 今日状态：' + hit[2];
  }

  /* ---------- Toast ---------- */
  const toastEl = $('#toast');
  let toastTimer = null;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2800);
  }

  /* ---------- 彩带（Canvas） ---------- */
  const canvas = $('#confetti');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let parts = [], rafId = null;
  const COLORS = ['#FFD400', '#111111', '#FF5C00', '#2D6BFF', '#FF90E8', '#FFFFFF'];

  function sizeCanvas() {
    if (!canvas) return;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  sizeCanvas();
  addEventListener('resize', sizeCanvas);

  function confetti(n) {
    if (!ctx || !motionOn) return;
    n = n || 160;
    for (let i = 0; i < n; i++) {
      parts.push({
        x: innerWidth / 2 + (Math.random() - .5) * 260,
        y: innerHeight * .32,
        vx: (Math.random() - .5) * 18,
        vy: -6 - Math.random() * 13,
        g: .32 + Math.random() * .22,
        s: 6 + Math.random() * 9,
        r: Math.random() * Math.PI,
        vr: (Math.random() - .5) * .35,
        c: COLORS[i % COLORS.length],
        life: 110 + Math.random() * 70
      });
    }
    if (!rafId) rafId = requestAnimationFrame(confettiLoop);
  }
  function confettiLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts = parts.filter(p => p.life > 0);
    for (const p of parts) {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = Math.min(1, p.life / 40);
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .62);
      ctx.restore();
    }
    if (parts.length) rafId = requestAnimationFrame(confettiLoop);
    else { rafId = null; ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }

  /* ---------- 戳头彩蛋 ---------- */
  const zone = $('#headZone');
  const phy = $('#headPhy');
  const img = $('#headImg');
  const badge = $('#aiBadge');
  const counterEl = $('#headCounter');

  let clicks = 0;
  const MILESTONES = {
    1: '嘿！别戳头，会变聪明的。',
    3: '光头开始反光了……',
    5: 'AI 能量充能中 50%……',
    7: '警告：再戳要掉出点子了！'
  };

  /* ---------- 首屏光头：每戳一下换一张脸 ---------- */
  const HERO_FACES = [
    { src: 'assets/head-hard-circle.png', name: '硬核模式' },
    { src: 'assets/face-01.png', name: '标准' },
    { src: 'assets/face-02.png', name: '专注' },
    { src: 'assets/face-03.png', name: '兴奋' },
    { src: 'assets/face-04.png', name: '得意' },
    { src: 'assets/face-05.png', name: '上头了！' }
  ];
  let heroFaceIdx = 0;
  // 预加载，避免切换时闪白
  HERO_FACES.forEach(f => { const im = new Image(); im.src = f.src; });

  function nextHeroFace() {
    if (!img) return;
    heroFaceIdx = (heroFaceIdx + 1) % HERO_FACES.length;
    img.src = HERO_FACES[heroFaceIdx].src;
    img.alt = '我的光头头像：' + HERO_FACES[heroFaceIdx].name;
  }

  /* AI 字符迸发 */
  function burst() {
    if (!zone || !motionOn) return;
    const r = zone.getBoundingClientRect();
    const x = r.left + r.width * .6;
    const y = r.top + r.height * .28;
    const texts = ['AI', 'AI', '!', '★', '100'];
    for (let i = 0; i < 9; i++) {
      const s = document.createElement('span');
      s.textContent = texts[i % texts.length];
      s.style.cssText =
        'position:fixed;z-index:998;pointer-events:none;' +
        "font-family:'Archivo Black',sans-serif;font-weight:900;" +
        'left:' + x + 'px;top:' + y + 'px;' +
        'font-size:' + (13 + Math.random() * 20) + 'px;' +
        'color:' + ['#111111', '#FFD400', '#FF5C00', '#2D6BFF'][i % 4] + ';' +
        'text-shadow:2px 2px 0 rgba(17,17,17,.18);';
      document.body.appendChild(s);
      const dx = (Math.random() - .5) * 190;
      const dy = -60 - Math.random() * 130;
      const rr = (Math.random() - .5) * 100;
      s.animate(
        [
          { transform: 'translate(-50%,-50%)', opacity: 1 },
          { transform: 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px)) rotate(' + rr + 'deg)', opacity: 0 }
        ],
        { duration: 650 + Math.random() * 450, easing: 'cubic-bezier(.2,.7,.3,1)' }
      ).onfinish = () => s.remove();
    }
  }

  function poke() {
    clicks++;
    if (counterEl) counterEl.textContent = clicks;
    nextHeroFace(); // 戳一下，换一张脸
    if (img) { img.classList.remove('squash'); void img.offsetWidth; img.classList.add('squash'); }
    if (badge) { badge.classList.remove('pop'); void badge.offsetWidth; badge.classList.add('pop'); }
    burst();
    ovy -= 10; // 蹦一下
    if (clicks % 10 === 0) {
      confetti();
      toast('🎉 彩蛋触发！秃头能量 +100，今天写码必定顺利！');
    } else if (MILESTONES[clicks]) {
      toast(MILESTONES[clicks]);
    }
  }

  /* ---------- 光头物理：拖拽 / 甩动 / 鼠标跟随倾斜 ---------- */
  let rot = 0, rv = 0;            // 旋转角度与速度
  let ox = 0, oy = 0, ovx = 0, ovy = 0; // 位移与速度
  let dragging = false, lastX = 0, lastY = 0, moved = 0, tiltTarget = 0;

  if (zone && phy) {
    document.addEventListener('mousemove', e => {
      if (dragging || !motionOn) return;
      const r = zone.getBoundingClientRect();
      const cxx = r.left + r.width / 2;
      tiltTarget = ((e.clientX - cxx) / innerWidth) * 14;
    });

    zone.addEventListener('pointerdown', e => {
      if (!motionOn) return;
      dragging = true; moved = 0;
      lastX = e.clientX; lastY = e.clientY;
      if (zone.setPointerCapture) {
        try { zone.setPointerCapture(e.pointerId); } catch (_) { /* noop */ }
      }
      e.preventDefault();
    });

    addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      rv = dx * .55;    // 旋转速度
      ovx += dx * .22;  // 位移惯性
      ovy += dy * .22;
    });

    addEventListener('pointerup', () => {
      if (!dragging) return;
      dragging = false;
      if (moved < 8) poke(); // 基本没动 → 判定为“戳”
    });
  }

  /* ---------- 主循环：光标跟随 + 光头弹簧 ---------- */
  const cursorEl = $('#cursor');
  let mx = innerWidth / 2, my = innerHeight / 2;
  let cx = mx, cy = my, hoverScale = 1;

  if (finePointer && cursorEl) {
    document.documentElement.classList.add('has-cursor');
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    document.addEventListener('mouseover', e => {
      hoverScale = e.target.closest('a,button,.card,.head-zone,.chip') ? 2.3 : 1;
    });
  }

  function frame() {
    // 自定义光标
    if (cursorEl && document.documentElement.classList.contains('has-cursor')) {
      cx += (mx - cx) * .28;
      cy += (my - cy) * .28;
      const s = 1 + (hoverScale - 1) * .25; // 平滑缩放
      cursorEl.style.transform = 'translate(' + cx + 'px,' + cy + 'px) scale(' + s + ')';
    }
    // 光头弹簧物理
    if (phy && motionOn) {
      if (dragging) {
        rot += rv * .9;
        ox += ovx; oy += ovy;
        ovx *= .8; ovy *= .8;
      } else {
        rv += (tiltTarget - rot) * .07; rv *= .9; rot += rv;
        ovx += -ox * .09; ovx *= .87; ox += ovx;
        ovy += -oy * .09; ovy *= .87; oy += ovy;
      }
      phy.style.transform = 'translate(' + ox + 'px,' + oy + 'px) rotate(' + rot + 'deg)';
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- 滚动显现 ---------- */
  const io = new IntersectionObserver(entries => {
    for (const en of entries) {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    }
  }, { threshold: .12 });
  $$('.reveal').forEach(el => {
    el.style.transitionDelay = el.dataset.d || '0s';
    io.observe(el);
  });

  /* ---------- 产品卡片 3D 倾斜 ---------- */
  if (finePointer) {
    $$('.card').forEach(card => {
      card.addEventListener('mousemove', e => {
        if (!motionOn) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg');
        card.style.setProperty('--ry', (x * 8).toFixed(2) + 'deg');
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------- 占位链接：弹个提示，不留死链 ---------- */
  $$('a[data-placeholder]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      toast(a.dataset.placeholder || '📌 占位示例：第一批真实实测正在路上，敬请期待');
    });
  });

  /* ---------- 动画开关（右下角按钮） ---------- */
  const motionBtn = $('#motionToggle');

  function applyMotion(on) {
    motionOn = on;
    document.documentElement.classList.toggle('no-motion', !on);
    if (finePointer && cursorEl) {
      document.documentElement.classList.toggle('has-cursor', on);
    }
    if (!on && phy) {
      // 关掉时把光头摆正
      rot = rv = ox = oy = ovx = ovy = 0;
      phy.style.transform = 'translate(0px, 0px) rotate(0deg)';
    }
    try { localStorage.setItem('lyq-motion', on ? 'on' : 'off'); } catch (_) { /* noop */ }
    if (motionBtn) {
      motionBtn.textContent = on ? '🎬 动画：开' : '🎬 动画：关';
      motionBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  if (motionBtn) {
    motionBtn.addEventListener('click', () => {
      applyMotion(!motionOn);
      toast(motionOn ? '⚡ 动画已开启，光头开始蹦迪！' : '🧊 动画已关闭，进入省电冥想模式');
    });
  }

  applyMotion(motionOn); // 初始化（脚本在 body 末尾同步执行，不会闪屏）

  // 系统开了「减少动态效果」的访客：提示右下角有开关
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setTimeout(() => toast('👋 系统检测到你开了「减少动态效果」。本站动画照常播放，点右下角按钮可随时关掉'), 900);
  }

  /* ---------- 秘技：↑↑↓↓←→←→BA ---------- */
  const SEQ = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  let seqIdx = 0;
  addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    seqIdx = (k === SEQ[seqIdx]) ? seqIdx + 1 : (k === SEQ[0] ? 1 : 0);
    if (seqIdx === SEQ.length) {
      seqIdx = 0;
      confetti(260);
      toast('🎮 秘技发动：发际线守护结阵，展开！');
    }
  });

  /* ---------- 给按 F12 的朋友 ---------- */
  console.log('%c👨‍🦲 NO HAIR, FULL STACK',
    'font-size:22px;font-weight:900;background:#FFD400;color:#111;padding:6px 14px;border:3px solid #111;');
  console.log('%c想看源码？右键查看是个好习惯。想交流？去页脚找我。',
    'font-size:13px;color:#666;');
})();
