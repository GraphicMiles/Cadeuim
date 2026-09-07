/* =========================================================
   lamosa Studio — clone interactions & animations
   Scroll reveal · count-up · marquees · slideshows · accordion
   ========================================================= */

(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. scroll-reveal ---------- */
  var REVEAL_SELECTORS = [
    ".stats-head", ".services-head", ".projects-head", ".process-head",
    ".pricing-head", ".testimonials-head", ".faq-head", ".contact-head",
    ".blogs-head", ".featured-card", ".stat-card", ".service", ".project-card",
    ".process-card", ".price-card", ".testimonial-card", ".blog-featured",
    ".blog-row", ".process-cta", ".cta-dark", ".reviews-row", ".footer-top"
  ];

  var revealEls = [];
  REVEAL_SELECTORS.forEach(function (sel) {
    var nodes = document.querySelectorAll(sel);
    nodes.forEach(function (node) {
      if (node.closest(".hero")) return; // keep hero above the fold instant
      revealEls.push(node);
    });
  });

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  revealEls.forEach(function (el, i) {
    el.classList.add("reveal");
    var siblings = el.parentElement ? el.parentElement.children.length : 0;
    if (siblings > 1) {
      var idx = Array.prototype.indexOf.call(el.parentElement.children, el);
      el.style.transitionDelay = Math.min(idx, 6) * 80 + "ms";
    }
    revealObserver.observe(el);
  });

  /* ---------- 2. count-up numbers ---------- */
  function animateCount(el) {
    var target = parseFloat(el.dataset.count || "0");
    var decimals = el.dataset.count.indexOf(".") >= 0 ? 1 : 0;
    var duration = 1200;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var value = target * eased;
      el.textContent = decimals
        ? value.toFixed(decimals)
        : Math.round(value).toString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = decimals ? target.toFixed(decimals) : target.toString();
    }
    requestAnimationFrame(step);
  }

  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll(".count").forEach(function (el) {
    countObserver.observe(el);
  });

  /* ---------- 3. featured project slideshow ---------- */
  var FEATURED = [
    {
      title: "How a 6-person plumbing team booked $47K extra",
      caption: "+312% response rate, -89% missed calls",
      link: "#projects"
    },
    {
      title: "HVAC seasonal surge: 400 leads captured",
      caption: "100% answered in under 60 seconds",
      link: "#projects"
    },
    {
      title: "Electrician went from 12 missed calls/day to 0",
      caption: "+86% booking conversion in 60 days",
      link: "#projects"
    }
  ];

  var slides = document.querySelectorAll(".featured-main .slide");
  var thumbs = document.querySelectorAll(".featured-thumbs .thumb");
  var titleEl = document.getElementById("featured-title");
  var captionEl = document.getElementById("featured-caption");
  var linkEl = document.getElementById("featured-link");
  var iconLinkEl = document.getElementById("featured-icon-link");
  var slideIndex = 0;
  var slideTimer = null;

  function goToSlide(i) {
    if (slides.length === 0) return;
    slideIndex = (i + slides.length) % slides.length;
    slides.forEach(function (s, idx) {
      s.classList.toggle("is-active", idx === slideIndex);
    });
    thumbs.forEach(function (t, idx) {
      t.classList.toggle("is-active", idx === slideIndex);
    });
    var item = FEATURED[slideIndex] || FEATURED[0];
    if (titleEl) titleEl.textContent = item.title;
    if (captionEl) captionEl.textContent = item.caption;
    if (linkEl) linkEl.setAttribute("href", item.link);
    if (iconLinkEl) iconLinkEl.setAttribute("href", item.link);
  }

  thumbs.forEach(function (thumb) {
    thumb.addEventListener("click", function () {
      goToSlide(parseInt(thumb.dataset.slide, 10));
      restartSlideTimer();
    });
  });

  function restartSlideTimer() {
    if (slideTimer) clearInterval(slideTimer);
    if (prefersReduced) return;
    slideTimer = setInterval(function () {
      goToSlide(slideIndex + 1);
    }, 8800);
  }
  restartSlideTimer();

  /* ---------- 4. services crossfade ---------- */
  var svcSlides = document.querySelectorAll(".services-visual .svc-slide");
  var services = document.querySelectorAll(".services-list .service");
  var svcIndex = 0;

  function goToService(i) {
    if (svcSlides.length === 0) return;
    svcIndex = (i + svcSlides.length) % svcSlides.length;
    svcSlides.forEach(function (s, idx) {
      s.classList.toggle("is-active", idx === svcIndex);
    });
    services.forEach(function (svc) {
      var open = parseInt(svc.dataset.slide, 10) === svcIndex;
      svc.classList.toggle("is-open", open);
    });
  }

  /* manual switching only (click + hover) — the original does not auto-rotate */
  services.forEach(function (svc) {
    var idx = parseInt(svc.dataset.slide, 10);
    svc.addEventListener("click", function () {
      goToService(idx);
    });
    svc.addEventListener("mouseenter", function () {
      goToService(idx);
    });
  });

  /* ---------- 5. FAQ accordion ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var q = item.querySelector(".faq-q");
    q.addEventListener("click", function () {
      var wasOpen = item.classList.contains("faq-open");
      faqItems.forEach(function (other) {
        other.classList.remove("faq-open");
        var a = other.querySelector(".faq-a");
        if (a) a.style.maxHeight = null;
      });
      if (!wasOpen) {
        item.classList.add("faq-open");
        var answer = item.querySelector(".faq-a");
        if (answer) answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* expand any item pre-marked open in the HTML */
  faqItems.forEach(function (item) {
    if (item.classList.contains("faq-open")) {
      var answer = item.querySelector(".faq-a");
      if (answer) answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });

  /* ---------- 6. navbar: blur on scroll + hide on scroll down (Framer-style) ---------- */
  var navbar = document.querySelector(".navbar");
  var navInner = document.querySelector(".navbar-inner");
  var lastY = window.scrollY || 0;
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || 0;
    var scrolled = y > 24;
    if (navbar) navbar.classList.toggle("is-scrolled", scrolled);
    if (navInner) navInner.classList.toggle("is-scrolled", scrolled);
    if (navbar) {
      var scrollingDown = y > lastY && y > 80;
      var menuOpen = document.querySelector(".nav-pill.is-open");
      navbar.classList.toggle("is-hidden", scrollingDown && !menuOpen);
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  /* ---------- 7. mobile menu toggle ---------- */
  var menuToggle = document.querySelector(".menu-toggle");
  var navLinks = document.querySelector(".nav-pill");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("is-open");
    });
  }

  /* ---------- 8. hero marquee speed calibration (~55px/s downward drift) ---------- */
  function calibrateHero() {
    var tracks = document.querySelectorAll(".hero-cards-track");
    tracks.forEach(function (track, ti) {
      if (!track.querySelector(".cards-set")) return;
      var loop = track.scrollHeight / 2; // one full set = loop distance
      var speed = ti === 0 ? 55 : 62; // px per second
      track.style.animationDuration = (loop / speed).toFixed(2) + "s";
    });
  }
  if (!prefersReduced) {
    calibrateHero();
    window.addEventListener("resize", calibrateHero);
  }

  /* ---------- 9. velocity-reactive logo marquees (slow crawl + scroll boost) ---------- */
  (function initMarquees() {
    if (prefersReduced) return;
    var tracks = document.querySelectorAll(".marquee-track");
    if (!tracks.length) return;
    var states = [];
    tracks.forEach(function (track) {
      states.push({ track: track, offset: 0, period: 1 });
    });
    function measure() {
      states.forEach(function (st) {
        var g = st.track.querySelector(".marquee-group");
        st.period = g ? g.offsetWidth : 1;
      });
    }
    measure();
    window.addEventListener("resize", measure);
    var lastY = window.scrollY || 0;
    var vel = 0;
    var lastT = performance.now();
    function frame(now) {
      var dt = Math.min((now - lastT) / 1000, 0.1);
      lastT = now;
      var y = window.scrollY || 0;
      var instV = dt > 0 ? (y - lastY) / dt : 0;
      lastY = y;
      vel += (instV - vel) * Math.min(dt * 4, 1);
      var speed = 2.5 + Math.min(Math.abs(vel) * 0.02, 60);
      states.forEach(function (st) {
        st.offset = (st.offset - speed * dt) % st.period;
        st.track.style.transform = "translate3d(" + st.offset.toFixed(1) + "px,0,0)";
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  /* ---------- 10. cursor-following "View Project" pill on featured image ---------- */
  (function initCursor() {
    var visual = document.querySelector(".featured-visual");
    var pill = document.getElementById("featured-cursor");
    if (!visual || !pill || prefersReduced) return;
    var tx = 0, ty = 0, x = 0, y = 0, visible = false, raf = null;
    function loop() {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      pill.style.transform =
        "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0) translate(16px,-50%)";
      if (visible) raf = requestAnimationFrame(loop);
      else raf = null;
    }
    visual.addEventListener("mouseenter", function (e) {
      var r = visual.getBoundingClientRect();
      tx = x = e.clientX - r.left;
      ty = y = e.clientY - r.top;
      visible = true;
      pill.classList.add("is-visible");
      if (!raf) raf = requestAnimationFrame(loop);
    });
    visual.addEventListener("mousemove", function (e) {
      var r = visual.getBoundingClientRect();
      tx = Math.max(8, Math.min(e.clientX - r.left, r.width - 190));
      ty = Math.max(32, Math.min(e.clientY - r.top, r.height - 32));
    });
    visual.addEventListener("mouseleave", function () {
      visible = false;
      pill.classList.remove("is-visible");
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    });
  })();
})();
