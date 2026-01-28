/*
  Site interactions
  - Mobile nav toggle
  - Accordion
  - Scroll to top
  - Current year
  - Lightweight form validation
  - Scroll reveal (load on user scroll)
*/

(function () {
  "use strict";

  const ready = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  ready(() => {
    // Current year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // Mobile navigation
    const navToggle = document.getElementById("navToggle");
    const navPanel = document.getElementById("navPanel");

    if (navToggle && navPanel) {
      const closeNav = () => {
        navPanel.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      };

      navToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = navPanel.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      document.addEventListener("click", (e) => {
        if (!navPanel.contains(e.target) && !navToggle.contains(e.target)) closeNav();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeNav();
      });

      navPanel.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeNav);
      });
    }

    // Accordion
    document.querySelectorAll("[data-accordion]").forEach((accordion) => {
      const buttons = Array.from(accordion.querySelectorAll(".acc-item"));
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const isExpanded = btn.getAttribute("aria-expanded") === "true";

          // Close all
          buttons.forEach((b) => {
            b.setAttribute("aria-expanded", "false");
            const panel = b.nextElementSibling;
            if (panel && panel.classList.contains("acc-a")) panel.hidden = true;
          });

          // Open current if it was closed
          btn.setAttribute("aria-expanded", isExpanded ? "false" : "true");
          const panel = btn.nextElementSibling;
          if (panel && panel.classList.contains("acc-a")) panel.hidden = isExpanded;
        });
      });
    });

    // Scroll to top
    const toTop = document.getElementById("toTop");
    if (toTop) {
      const setState = () => {
        if (window.scrollY > 450) toTop.classList.add("show");
        else toTop.classList.remove("show");
      };

      window.addEventListener("scroll", setState, { passive: true });
      setState();

      toTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // Lightweight form validation
    const form = document.getElementById("contactForm");
    if (form) {
      const markInvalid = (el, isInvalid) => {
        if (isInvalid) el.classList.add("invalid");
        else el.classList.remove("invalid");
      };

      form.addEventListener("submit", (e) => {
        const requiredFields = Array.from(form.querySelectorAll("[required]"));
        let ok = true;

        requiredFields.forEach((field) => {
          const value = (field.value || "").trim();
          const invalid = value.length === 0;
          markInvalid(field, invalid);
          if (invalid) ok = false;
        });

        if (!ok) e.preventDefault();
      });

      form.querySelectorAll("input, textarea").forEach((field) => {
        field.addEventListener("input", () => markInvalid(field, false));
        field.addEventListener("blur", () => {
          if (field.hasAttribute("required")) markInvalid(field, (field.value || "").trim().length === 0);
        });
      });
    }

    // Scroll reveal (load on user scroll)
    const revealEls = Array.from(document.querySelectorAll(".reveal"));
    if (!revealEls.length) return;

    const show = (el) => el.classList.add("in-view");

    if (!("IntersectionObserver" in window)) {
      revealEls.forEach(show);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    revealEls.forEach((el) => io.observe(el));
  });
})();