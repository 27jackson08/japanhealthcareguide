  // Sub nav scroll tracking
  const aboutSections = ['links', 'purpose', 'origins', 'methodology', 'contact', 'partners'];
  const subLinks = document.querySelectorAll('.sub-nav a');

  window.addEventListener('scroll', () => {
    const offset = 120;
    let current = aboutSections[0];
    aboutSections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - offset) current = id;
    });
    subLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });

  subLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
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
  // Contact form AJAX submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending...';
      btn.disabled = true;
      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          contactForm.reset();
          document.getElementById('contactSuccess').style.display = 'block';
          btn.style.display = 'none';
        } else {
          btn.textContent = 'Send message';
          btn.disabled = false;
          alert('Something went wrong — please try again.');
        }
      } catch {
        btn.textContent = 'Send message';
        btn.disabled = false;
      }
    });
  }

  // ── PARTNERS CAROUSEL ──
  (function(){
    const track = document.getElementById('partnersTrack');
    const nav   = document.getElementById('partnersNav');
    const dotsEl= document.getElementById('partnersDots');
    if(!track) return;

    const cards = track.querySelectorAll('.partner-card');
    let current = 0;

    // Only show nav if more than 1 card
    if(cards.length <= 1) return;
    nav.style.display = 'flex';

    // Build dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'partners-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to partner ' + (i+1));
      dot.onclick = () => goTo(i);
      dotsEl.appendChild(dot);
    });

    function goTo(n) {
      current = Math.max(0, Math.min(n, cards.length - 1));
      const cardW = cards[0].offsetWidth + 24; // width + gap
      track.style.transform = 'translateX(-' + (current * cardW) + 'px)';
      dotsEl.querySelectorAll('.partners-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
      document.getElementById('partnersPrev').disabled = current === 0;
      document.getElementById('partnersNext').disabled = current === cards.length - 1;
    }

    window.partnersSlide = function(dir){ goTo(current + dir); };
    goTo(0);
  })();
