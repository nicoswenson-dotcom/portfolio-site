// Miss Texas 1988 — site interactions
(function () {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // close menu when clicking a link
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => links.classList.remove('is-open'));
    });
  }

  // Mark current page in nav (handles both file paths and #anchor links)
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('is-active');
    if (path === '' && href === 'index.html') a.classList.add('is-active');
  });

  // Scrollspy — highlight nav section while scrolling on the one-pager
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (navAnchors.length) {
    const sectionMap = new Map();
    navAnchors.forEach((a) => {
      const id = a.getAttribute('href').slice(1);
      const sec = id && document.getElementById(id);
      if (sec) sectionMap.set(sec, a);
    });
    if (sectionMap.size) {
      const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const link = sectionMap.get(entry.target);
          if (!link) return;
          if (entry.isIntersecting) {
            navAnchors.forEach((a) => a.classList.remove('is-active'));
            link.classList.add('is-active');
          }
        });
      }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
      sectionMap.forEach((_, sec) => spyObserver.observe(sec));
    }
  }

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // Tilt-on-hover for cards (subtle)
  const tiltEls = document.querySelectorAll('[data-tilt]');
  tiltEls.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(700px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  // Design grid filter — works with .design-filters .chip and .project-card[data-cat]
  document.querySelectorAll('.design-filters, .filterbar').forEach((bar) => {
    const cards = bar.parentElement.querySelectorAll('[data-cat]');
    bar.addEventListener('click', (e) => {
      const btn = e.target.closest('.chip, .filter-btn');
      if (!btn) return;
      const cat = btn.dataset.filter;
      bar.querySelectorAll('.chip, .filter-btn').forEach((b) => b.classList.toggle('is-active', b === btn));
      cards.forEach((card) => {
        const matches = cat === 'all' || card.dataset.cat === cat;
        card.style.display = matches ? '' : 'none';
      });
    });
  });

  // ---------- Split-flap flipboard ----------
  // Each board reads `data-flipboard` (JSON array of phrases) and animates
  // each character cell independently, cascading left-to-right.
  const FLIP_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·×#&$/!?';
  function initFlipboard(root) {
    let messages;
    try {
      messages = JSON.parse(root.dataset.flipboard || '[]');
    } catch (e) { return; }
    if (!messages.length) return;
    const stage = root.querySelector('[data-flipboard-chars]');
    if (!stage) return;

    // Pad to widest phrase
    const upper = messages.map((m) => String(m).toUpperCase());
    const width = Math.max(...upper.map((m) => m.length));

    // Build cells
    const cells = [];
    for (let i = 0; i < width; i++) {
      const cell = document.createElement('span');
      cell.className = 'flipboard__char';
      const inner = document.createElement('span');
      inner.className = 'flipboard__char-inner';
      inner.textContent = ' ';
      cell.appendChild(inner);
      stage.appendChild(cell);
      cells.push({ cell, inner });
    }

    function flipOnce(cellObj, char) {
      return new Promise((resolve) => {
        cellObj.cell.classList.add('is-flipping');
        setTimeout(() => {
          cellObj.inner.textContent = char === ' ' ? ' ' : char;
        }, 60);
        setTimeout(() => {
          cellObj.cell.classList.remove('is-flipping');
          resolve();
        }, 130);
      });
    }

    async function spinCellTo(cellObj, target) {
      // 2–4 random letters, then the target — gives that mechanical cycle feel
      const spins = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < spins; i++) {
        const c = FLIP_CHARS[Math.floor(Math.random() * FLIP_CHARS.length)];
        await flipOnce(cellObj, c);
      }
      await flipOnce(cellObj, target);
    }

    async function setMessage(text) {
      const upper = text.toUpperCase();
      const totalPad = Math.max(0, width - upper.length);
      const leftPad = Math.floor(totalPad / 2);
      const rightPad = totalPad - leftPad;
      const padded = ' '.repeat(leftPad) + upper + ' '.repeat(rightPad);
      const promises = [];
      for (let i = 0; i < width; i++) {
        const target = padded[i];
        const current = cells[i].inner.textContent;
        // skip if already correct (and not whitespace placeholder)
        if (current === target || (target === ' ' && current === ' ')) continue;
        // stagger each cell ~35ms apart, so the flips cascade
        await new Promise((r) => setTimeout(r, 35));
        promises.push(spinCellTo(cells[i], target));
      }
      await Promise.all(promises);
    }

    let idx = 0;
    setMessage(messages[0]);
    setInterval(() => {
      idx = (idx + 1) % messages.length;
      setMessage(messages[idx]);
    }, 4200);
  }
  document.querySelectorAll('[data-flipboard]').forEach(initFlipboard);

  // Contact form: handle preview state if Formspree URL not set
  const form = document.querySelector('.form[data-form="contact"]');
  if (form) {
    form.addEventListener('submit', (e) => {
      const action = form.getAttribute('action') || '';
      if (action.includes('YOUR_FORMSPREE_ID')) {
        e.preventDefault();
        const status = document.querySelector('.form__status');
        if (status) {
          status.textContent = 'Form is in preview mode — replace YOUR_FORMSPREE_ID in contact.html with your Formspree endpoint to enable submissions.';
          status.style.color = 'var(--red-candy)';
        }
      }
    });
  }
})();
