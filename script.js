/*
  Site interactions:
  - Mobile nav toggle
  - Exclusive Accordion (details/summary)
  - Scroll to top (if needed)
  - Current year
  - Lightweight form validation
  - Scroll reveal
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
    // 1. Current year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // 2. Mobile navigation
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

    // 3. Exclusive Accordion (Makes <details> behave like an accordion)
    const allDetails = document.querySelectorAll("details");
    allDetails.forEach((targetDetail) => {
      targetDetail.addEventListener("click", () => {
        // If we are opening this one, close all others
        if (!targetDetail.open) {
          allDetails.forEach((detail) => {
            if (detail !== targetDetail) {
              detail.removeAttribute("open");
            }
          });
        }
      });
    });

    // 4. Lightweight form validation
    const form = document.getElementById("contactForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        const requiredFields = Array.from(form.querySelectorAll("[required]"));
        let isValid = true;

        requiredFields.forEach((field) => {
          const value = (field.value || "").trim();
          if (value.length === 0) {
            field.style.borderColor = "#d64545"; // Error color
            isValid = false;
          } else {
            field.style.borderColor = ""; // Reset
          }
        });

        if (!isValid) e.preventDefault();
      });

      // Clear error on input
      form.querySelectorAll("input, textarea").forEach((field) => {
        field.addEventListener("input", () => {
          field.style.borderColor = "";
        });
      });
    }

    // 5. Scroll reveal (Intersection Observer)
    const revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
      );

      revealEls.forEach((el) => io.observe(el));
    } else {
      // Fallback for very old browsers
      revealEls.forEach((el) => el.classList.add("in-view"));
    }
  });
})();
