// CURSOR
var cursor = document.getElementById('cursor');
var follower = document.getElementById('cursorFollower');
if (cursor && follower) {
  var fx = 0, fy = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', function(e) {
    cx = e.clientX; cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
  });
  (function animateFollower() {
    fx += (cx - fx) * 0.1;
    fy += (cy - fy) * 0.1;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animateFollower);
  })();
}

// NAV SCROLL
window.addEventListener('scroll', function() {
  var nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ACTIVE LINK — supports clean URLs (/usluge) and .html URLs alike
(function() {
  function normalizePath(value) {
    try {
      var pathname = new URL(value, window.location.origin).pathname;
      pathname = pathname.replace(/\/index\.html$/i, '/').replace(/\.html$/i, '');
      pathname = pathname.replace(/\/+$/, '');
      return pathname || '/';
    } catch (e) {
      return value || '/';
    }
  }

  var current = normalizePath(window.location.pathname);
  document.querySelectorAll('.nav-links a, .mobile-menu-links a').forEach(function(a) {
    var href = a.getAttribute('href');
    if (href && normalizePath(href) === current) a.classList.add('active');
  });
})();

// SCROLL REVEAL
var reveals = document.querySelectorAll('.reveal');
var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('revealed'); });
}, { threshold: 0.1 });
reveals.forEach(function(el) { revealObserver.observe(el); });

// HAMBURGER
(function() {
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function() {
    var isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMenu();
  });

  mobileMenu.querySelectorAll('a[href]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var target = link.getAttribute('href');
      closeMenu();
      setTimeout(function() { window.location.href = target; }, 200);
    });
  });
})();


// PRIVACY / COOKIE NOTICE
(function() {
  var STORAGE_KEY = 'emili_privacy_notice_v1';
  var POLICY_VERSION = '2026-10-04';

  function getStoredNotice() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return parsed && parsed.version === POLICY_VERSION ? parsed : null;
    } catch (e) { return null; }
  }

  function saveNotice() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: POLICY_VERSION,
        acknowledged: true,
        timestamp: new Date().toISOString(),
        optionalCookies: false
      }));
    } catch (e) {}
  }

  function buildUi() {
    if (document.getElementById('cookieNotice')) return;

    var notice = document.createElement('aside');
    notice.id = 'cookieNotice';
    notice.className = 'cookie-notice';
    notice.setAttribute('role', 'dialog');
    notice.setAttribute('aria-live', 'polite');
    notice.setAttribute('aria-label', 'Obavijest o kolačićima');
    notice.innerHTML =
      '<div class="cookie-notice-inner">' +
        '<div>' +
          '<div class="cookie-notice-kicker">Privatnost</div>' +
          '<h2>Kolačići i pohrana u pregledniku</h2>' +
          '<p>Ova stranica trenutačno ne koristi analitičke ni marketinške kolačiće. Koristimo samo nužnu lokalnu pohranu kako bismo zapamtili ovu obavijest. Detalji su u <a href="/politika-kolacica">Politici kolačića</a>.</p>' +
        '</div>' +
        '<div class="cookie-notice-actions">' +
          '<button class="cookie-btn" type="button" data-cookie-open>Detalji</button>' +
          '<button class="cookie-btn cookie-btn--primary" type="button" data-cookie-ack>Razumijem</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(notice);

    var backdrop = document.createElement('div');
    backdrop.id = 'cookieModalBackdrop';
    backdrop.className = 'cookie-modal-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.innerHTML =
      '<div class="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookieModalTitle">' +
        '<div class="cookie-modal-head">' +
          '<div><span>Postavke privatnosti</span><h2 id="cookieModalTitle">Kolačići na ovoj stranici</h2></div>' +
          '<button class="cookie-close" type="button" aria-label="Zatvori postavke kolačića" data-cookie-close>×</button>' +
        '</div>' +
        '<div class="cookie-modal-body">' +
          '<p>Emili Royal Transfers trenutačno ne koristi alate za analitiku ili oglašavanje koji bi zahtijevali opcionalne kolačiće. Ako se takvi alati uvedu, prije njihove aktivacije zatražit ćemo odgovarajući odabir.</p>' +
          '<div class="cookie-category"><div><strong>Nužna pohrana</strong><p>Potrebna je za osnovno funkcioniranje i pamćenje da je ova obavijest pročitana. Ne koristi se za praćenje.</p></div><span class="cookie-state">Uvijek aktivno</span></div>' +
          '<div class="cookie-category"><div><strong>Analitički kolačići</strong><p>Alati za mjerenje posjeta i ponašanja korisnika.</p></div><span class="cookie-state is-off">Ne koriste se</span></div>' +
          '<div class="cookie-category"><div><strong>Marketinški kolačići</strong><p>Alati za personalizirano oglašavanje i praćenje konverzija.</p></div><span class="cookie-state is-off">Ne koriste se</span></div>' +
          '<div class="cookie-modal-actions"><a href="/politika-kolacica">Pročitaj Politiku kolačića</a><button class="cookie-btn cookie-btn--primary" type="button" data-cookie-close>Gotovo</button></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(backdrop);
  }

  function openModal() {
    var backdrop = document.getElementById('cookieModalBackdrop');
    if (!backdrop) return;
    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var close = backdrop.querySelector('[data-cookie-close]');
    if (close) close.focus();
  }

  function closeModal() {
    var backdrop = document.getElementById('cookieModalBackdrop');
    if (!backdrop) return;
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function acknowledge() {
    saveNotice();
    var notice = document.getElementById('cookieNotice');
    if (notice) notice.classList.remove('is-visible');
  }

  buildUi();

  if (!getStoredNotice()) {
    window.setTimeout(function() {
      var notice = document.getElementById('cookieNotice');
      if (notice) notice.classList.add('is-visible');
    }, 450);
  }

  document.addEventListener('click', function(e) {
    var ack = e.target.closest('[data-cookie-ack]');
    if (ack) { acknowledge(); return; }

    var open = e.target.closest('[data-cookie-open], [data-cookie-settings]');
    if (open) { e.preventDefault(); openModal(); return; }

    var close = e.target.closest('[data-cookie-close]');
    if (close) { closeModal(); return; }

    var backdrop = document.getElementById('cookieModalBackdrop');
    if (backdrop && e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });
})();
