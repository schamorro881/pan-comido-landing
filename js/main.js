(() => {
  "use strict";

  const navbar = document.querySelector(".navbar");
  const toggle = document.querySelector(".navbar__toggle");
  const mobileMenu = document.querySelector(".navbar__mobile-menu");
  const mobileLinks = document.querySelectorAll(".navbar__mobile-link, .navbar__mobile-menu .btn");
  const demoForm = document.getElementById("demo-form");
  const formSuccess = document.getElementById("form-success");

  /* ── Navbar scroll state ── */
  function updateNavbar() {
    if (!navbar) return;
    navbar.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  /* ── Mobile menu ── */
  function closeMobileMenu() {
    if (!toggle || !mobileMenu) return;
    toggle.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function openMobileMenu() {
    if (!toggle || !mobileMenu) return;
    toggle.setAttribute("aria-expanded", "true");
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    mobileMenu.querySelector("a, button")?.focus();
  }

  toggle?.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileMenu();
  });

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      history.pushState(null, "", targetId);
    });
  });

  /* ── Reveal on scroll ── */
  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  /* ── Demo form validation & submit ── */
  const validators = {
    restaurant: (v) => v.trim().length >= 2 || "Ingresá el nombre de tu restaurante.",
    contact: (v) => v.trim().length >= 2 || "Ingresá tu nombre.",
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Ingresá un email válido.",
    phone: (v) =>
      !v.trim() || /^[\d\s+\-()]{6,20}$/.test(v.trim()) || "Ingresá un teléfono válido.",
  };

  function showFieldError(input, message) {
    const group = input.closest(".form-group");
    const errorEl = group?.querySelector(".form-error");
    input.classList.toggle("is-invalid", Boolean(message));
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (errorEl) errorEl.textContent = message || "";
  }

  function validateField(input) {
    const name = input.name;
    const validator = validators[name];
    if (!validator) return true;

    const result = validator(input.value);
    if (result === true) {
      showFieldError(input, "");
      return true;
    }

    showFieldError(input, result);
    return false;
  }

  demoForm?.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.classList.contains("is-invalid")) validateField(input);
    });
  });

  demoForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputs = [...demoForm.querySelectorAll("input[required], input[name='phone'], textarea")];
    const isValid = inputs.every((input) => {
      if (input.required || input.value.trim()) return validateField(input);
      showFieldError(input, "");
      return true;
    });

    if (!isValid) {
      const firstInvalid = demoForm.querySelector(".is-invalid");
      firstInvalid?.focus();
      return;
    }

    const submitBtn = demoForm.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando…";

    /* Simular envío — conectar backend después:
       await fetch("https://formspree.io/f/XXXX", { method: "POST", body: new FormData(demoForm) });
    */
    await new Promise((resolve) => setTimeout(resolve, 1200));

    demoForm.classList.add("is-hidden");
    formSuccess?.classList.add("is-visible");
    formSuccess?.setAttribute("tabindex", "-1");
    formSuccess?.focus();

    submitBtn.disabled = false;
    submitBtn.textContent = "Solicitar demo";
  });
})();
