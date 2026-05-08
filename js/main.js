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

  // Mark current page in nav
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('is-active');
    if (path === '' && href === 'index.html') a.classList.add('is-active');
  });

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

  // Design page filter
  const filterBar = document.querySelector('.filterbar');
  if (filterBar) {
    const works = document.querySelectorAll('.work-grid .work');
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      const cat = btn.dataset.filter;
      filterBar.querySelectorAll('.filter-btn').forEach((b) => b.classList.toggle('is-active', b === btn));
      works.forEach((w) => {
        const matches = cat === 'all' || w.dataset.cat === cat;
        w.style.display = matches ? '' : 'none';
      });
    });
  }

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
