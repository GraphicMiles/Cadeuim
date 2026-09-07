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
      el.style.transitionDelay = Math.min(idx, 5) * 70 + "ms";
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
      title: "Redesigning Atlas",
      caption: "+45% engagement, -20% churn",
      link: "#projects"
    },
    {
      title: "Launch MVP for Finlytics",
      caption: "Live in 27 days, 1,200+ early users",
      link: "#projects"
    },
    {
      title: "Orbital Website Redesign",
      caption: "+21% signup conversion rate",
      link: "#projects"
    }
  ];

  var slides = document.querySelectorAll(".featured-main .slide");
  var thumbs = document.querySelectorAll(".featured-thumbs .thumb");
  var segs = document.querySelectorAll(".featured-progress .featured-seg");
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
    segs.forEach(function (g, idx) {
      g.classList.toggle("is-active", idx === slideIndex);
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

  var prevBtn = document.querySelector(".featured-arrow-prev");
  var nextBtn = document.querySelector(".featured-arrow-next");
  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      goToSlide(slideIndex - 1);
      restartSlideTimer();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      goToSlide(slideIndex + 1);
      restartSlideTimer();
    });
  }

  function restartSlideTimer() {
    if (slideTimer) clearInterval(slideTimer);
    if (prefersReduced) return;
    slideTimer = setInterval(function () {
      goToSlide(slideIndex + 1);
    }, 4000);
  }
  restartSlideTimer();

  /* ---------- 4. services crossfade ---------- */
  var svcSlides = document.querySelectorAll(".services-visual .svc-slide");
  var services = document.querySelectorAll(".services-list .service");
  var svcIndex = 0;
  var svcTimer = null;

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

  services.forEach(function (svc) {
    svc.addEventListener("click", function () {
      goToService(parseInt(svc.dataset.slide, 10));
      restartSvcTimer();
    });
  });

  function restartSvcTimer() {
    if (svcTimer) clearInterval(svcTimer);
    if (prefersReduced) return;
    svcTimer = setInterval(function () {
      goToService(svcIndex + 1);
    }, 4500);
  }
  restartSvcTimer();

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

  /* ---------- 6. navbar scrolled state ---------- */
  var navbar = document.querySelector(".navbar");
  var navInner = document.querySelector(".navbar-inner");
  function onScroll() {
    var scrolled = window.scrollY > 24;
    navbar.classList.toggle("is-scrolled", scrolled);
    if (navInner) navInner.classList.toggle("is-scrolled", scrolled);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 7. mobile menu toggle ---------- */
  var menuToggle = document.querySelector(".menu-toggle");
  var navLinks = document.querySelector(".nav-pill");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("is-open");
    });
  }
})();
