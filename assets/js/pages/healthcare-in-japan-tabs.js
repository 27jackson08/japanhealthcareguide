  // Tab switching
  function showTab(id) {
    document.querySelectorAll('.trans-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.trans-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + id).classList.add('active');
    event.target.classList.add('active');
  }

  // Sub nav smooth scroll + active state
  function toggleForm(id) {
    const el = document.getElementById(id);
    el.classList.toggle('open');
  }

  document.querySelectorAll('.sub-nav a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').replace('#', '');
      const target = document.getElementById(targetId);
      if (!target) return;
      const offset = document.querySelector('nav').offsetHeight + document.querySelector('.sub-nav').offsetHeight + 24;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  const sections = ['how-it-works', 'insurance', 'translations', 'specialty-guide', 'vs-western', 'forms'];
  window.addEventListener('scroll', () => {
    const offset = document.querySelector('nav').offsetHeight + document.querySelector('.sub-nav').offsetHeight + 40;
    let current = sections[0];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - offset) current = id;
    });
    document.querySelectorAll('.sub-nav a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });

  function toggleSidebar() {
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('mobileOverlay');
    const btn = document.getElementById('hamburgerBtn');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
    btn.classList.toggle('open');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
  }

  function closeSidebar() {
    document.getElementById('mobileSidebar').classList.remove('open');
    document.getElementById('mobileOverlay').classList.remove('open');
    document.getElementById('hamburgerBtn').classList.remove('open');
    document.body.style.overflow = '';
  }
