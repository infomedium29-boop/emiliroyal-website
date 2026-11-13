
// LANGUAGE SWITCH FALLBACK – survives older cached Croatian HTML pages.
(function ensureLanguageSwitchOnEveryPage() {
  var nav=document.getElementById('navbar');
  if(!nav) return;
  var raw=window.location.pathname||'/';
  var normalized=raw.replace(/\/index\.html$/i,'/').replace(/\.html$/i,'').replace(/\/+$/,'')||'/';
  var isEnglish=normalized==='/en'||normalized.indexOf('/en/')===0;
  var route=isEnglish ? (normalized.slice(3)||'/') : normalized;
  var valid=['/','/usluge','/destinacije','/o-nama','/kontakt','/politika-privatnosti','/politika-kolacica','/pravne-napomene'];
  if(valid.indexOf(route)===-1) route='/';
  var hrHref=route;
  var enHref=route==='/' ? '/en/' : '/en'+route;
  var wrapper=nav.querySelector('.nav-actions');
  if(!wrapper){
    wrapper=document.createElement('div');
    wrapper.className='nav-actions';
    var hamburger=nav.querySelector('#hamburger');
    if(hamburger){nav.insertBefore(wrapper,hamburger);wrapper.appendChild(hamburger);}
    else nav.appendChild(wrapper);
  }
  var switcher=nav.querySelector('.language-switch');
  if(!switcher){
    switcher=document.createElement('div');
    switcher.className='language-switch';
    switcher.setAttribute('role','group');
    switcher.setAttribute('aria-label',isEnglish?'Choose language':'Odabir jezika');
    var choices=[{href:hrHref,lang:'hr',name:'HR',label:'Hrvatski',active:!isEnglish},{href:enHref,lang:'en',name:'EN',label:'English',active:isEnglish}];
    choices.forEach(function(choice){
      var link=document.createElement('a');
      link.className='lang-option'+(choice.active?' is-active':'');
      link.href=choice.href;
      link.hreflang=choice.lang;
      link.lang=choice.lang;
      link.textContent=choice.name;
      link.setAttribute('aria-label',choice.label);
      if(choice.active)link.setAttribute('aria-current','page');
      switcher.appendChild(link);
    });
    wrapper.insertBefore(switcher,wrapper.firstChild);
  } else if(switcher.parentElement!==wrapper) {
    wrapper.insertBefore(switcher,wrapper.firstChild);
  }
  nav.setAttribute('data-lang-nav-version','20261113-nav3');
  // Ensure header switch layout still works if a browser has the older CSS cached.
  if(!document.getElementById('m29-language-nav-runtime')){
    var css=document.createElement('style');
    css.id='m29-language-nav-runtime';
    css.textContent="\n/* M29 language-switch v3: independent page-level navigation fix */\n#navbar {gap:clamp(7px,1vw,15px);}\n#navbar .nav-links {min-width:0; flex:0 1 auto; margin-left:auto;}\n#navbar .nav-actions {display:flex!important; flex:0 0 auto; align-items:center; justify-content:flex-end; gap:9px; margin-left:clamp(4px,.65vw,12px); position:relative; z-index:10;}\n#navbar .nav-actions .language-switch {display:inline-flex!important; visibility:visible!important; opacity:1!important; position:relative!important; flex:0 0 auto!important; align-items:center!important; margin:0!important; white-space:nowrap!important; border-radius:12px; padding:3px; border:1px solid rgba(199,164,81,.35); background:rgba(255,255,255,.04);}\n#navbar .nav-actions .lang-option {display:inline-flex!important; align-items:center; justify-content:center; min-width:32px; height:34px; padding:0 8px; font:600 11px/1 'DM Sans',Arial,sans-serif; letter-spacing:.04em; text-decoration:none; border-radius:8px; color:rgba(255,255,255,.82); cursor:pointer;}\n#navbar .nav-actions .lang-option.is-active {background:linear-gradient(135deg,#dcc078,#b6903c); color:#1c180f!important;}\n#navbar .nav-actions .lang-option:not(.is-active):hover {background:rgba(255,255,255,.12); color:#fff;}\n#navbar .nav-actions .lang-option:focus-visible {outline:2px solid #dcc078; outline-offset:2px;}\n@media (min-width:901px) and (max-width:1150px) {\n  #navbar .nav-actions {gap:5px; margin-left:4px;}\n  #navbar .nav-actions .lang-option {min-width:26px; padding:0 6px; height:32px;}\n}\n@media (max-width:900px) {\n  #navbar .nav-links {display:none!important;}\n  #navbar .nav-actions {margin-left:auto; gap:7px;}\n  #navbar .nav-actions .hamburger {display:flex; flex-shrink:0;}\n}\n@media (max-width:420px) {\n  #navbar {gap:6px; padding-left:10px; padding-right:9px;}\n  #navbar .logo-wrap {min-width:0; padding:4px 5px;}\n  #navbar .logo-img {max-width:130px!important;}\n  #navbar .nav-actions {gap:5px;}\n  #navbar .nav-actions .language-switch {padding:2px;}\n  #navbar .nav-actions .lang-option {min-width:28px; height:32px; padding:0 6px; font-size:10px;}\n}\n@media (max-width:350px) {\n  #navbar .logo-img {max-width:112px!important;}\n  #navbar .nav-actions .lang-option {min-width:25px; padding:0 4px;}\n}\n";
    document.head.appendChild(css);
  }
})();

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
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function() {
    var isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
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

    if (document.documentElement.lang === 'en') {
      notice.setAttribute('aria-label', 'Cookie information');
      notice.innerHTML =
        '<div class="cookie-notice-inner">' +
          '<div><div class="cookie-notice-kicker">Privacy</div>' +
            '<h2>Cookies and browser storage</h2>' +
            '<p>This website currently does not use analytics or marketing cookies. We only use essential local storage to remember this notice. Learn more in our <a href="/en/politika-kolacica">Cookie Policy</a>.</p>' +
          '</div><div class="cookie-notice-actions">' +
            '<button class="cookie-btn" type="button" data-cookie-open>Details</button>' +
            '<button class="cookie-btn cookie-btn--primary" type="button" data-cookie-ack>Got It</button>' +
          '</div>' +
        '</div>';
      backdrop.innerHTML =
        '<div class="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookieModalTitle">' +
          '<div class="cookie-modal-head"><div><span>Privacy Settings</span><h2 id="cookieModalTitle">Cookies on This Website</h2></div>' +
            '<button class="cookie-close" type="button" aria-label="Close cookie settings" data-cookie-close>×</button></div>' +
          '<div class="cookie-modal-body">' +
            '<p>Emili Royal Transfers currently does not use analytics or advertising tools requiring optional cookies. If we introduce them, we will request your choice before activating them.</p>' +
            '<div class="cookie-category"><div><strong>Essential Storage</strong><p>Used for essential website functions and to remember that you have read this notice. It is not used for tracking.</p></div><span class="cookie-state">Always Active</span></div>' +
            '<div class="cookie-category"><div><strong>Analytics Cookies</strong><p>Tools that measure visits and visitor behaviour.</p></div><span class="cookie-state is-off">Not Used</span></div>' +
            '<div class="cookie-category"><div><strong>Marketing Cookies</strong><p>Tools for personalised advertising and conversion tracking.</p></div><span class="cookie-state is-off">Not Used</span></div>' +
            '<div class="cookie-modal-actions"><a href="/en/politika-kolacica">Read Cookie Policy</a><button class="cookie-btn cookie-btn--primary" type="button" data-cookie-close>Done</button></div>' +
          '</div>' +
        '</div>';
    }
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
