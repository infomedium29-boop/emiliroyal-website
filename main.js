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

// ACTIVE LINK
(function() {
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu-links a').forEach(function(a) {
    if (a.getAttribute('href') === path) a.classList.add('active');
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
