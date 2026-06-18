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

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && mobileMenu?.classList.contains("is-open")) {
      closeMobileMenu();
    }
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


  /* ── Reveal on scroll logic removed in favor of CSS animation-timeline ── */

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
    // Removed manual class toggle in favor of CSS :user-invalid and custom validity
    input.setCustomValidity(message || "");
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
    input.addEventListener("blur", () => {
      // Set a generic format error to trigger :user-invalid correctly if it's invalid
      validateField(input);
    });
    input.addEventListener("input", () => {
      if (!input.checkValidity()) validateField(input);
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


  /* ── Features showcase ── */
  const featuresData = {
    admin: {
      mesas: {
        title: "El salón en la palma de tu mano",
        text: "Visualizá el estado de cada mesa en tiempo real: libres, ocupadas y reservadas. Asignás mozos y abrís cuentas con un solo toque desde cualquier dispositivo.",
        bullets: ["Estado en tiempo real de cada mesa", "Asignación de mozos por zona", "Apertura y cierre de cuentas simplificado", "División de cuentas entre comensales"],
        img: "assets/mapaDeMesas.png",
      },
      comandas: {
        title: "Cocina conectada, sin papel ni gritos",
        text: "Las comandas llegan al instante a cocina con cada pedido, observación del cliente y tiempo estimado. Se acabaron los papelitos perdidos y los platos equivocados.",
        bullets: ["Pedidos en tiempo real directo a cocina", "Observaciones del cliente incluidas", "Alertas de platos listos para servir", "Historial completo por turno"],
        img: "assets/comandas.png",
      },
      stock: {
        title: "Nunca más te quedés sin stock en pleno servicio",
        text: "Cada pedido descuenta automáticamente del inventario. El sistema te avisa cuando un ingrediente está por agotarse — antes de que sea un problema para tus clientes.",
        bullets: ["Descuento automático por pedido", "Alertas de stock bajo configurables", "Gestión de proveedores integrada", "Reportes de consumo por período"],
        img: "assets/stockInteligente.png",
      },
      proveedores: {
        title: "Pedidos a proveedores en un toque",
        text: "Cargá tus proveedores por categoría y el sistema te sugiere qué pedirle a cada uno según tu stock actual. Lo enviás por WhatsApp y, cuando llega la mercadería, la registrás directamente en el inventario.",
        bullets: ["Carga de proveedores por categoría", "Sugerencias de pedido según stock", "Envío de pedidos por WhatsApp", "Recepción y carga automática al inventario"],
        img: "assets/proveedores.png",
      },
      ia: {
        title: "La IA que conoce tu cocina",
        text: "Aprovechá al máximo lo que tenés en stock. La IA analiza tus ingredientes y sugiere platos creativos que podés ofrecer hoy, reduciendo desperdicios y sorprendiendo a tus clientes.",
        bullets: ["Sugerencias de platos con stock alto", "Recetas adaptadas a tu inventario actual", "Opciones fuera de carta en segundos", "Evitá vencimientos y desperdicios"],
        img: "assets/sugerenciaIA.png",
      },
    },
    cliente: {
      menu: {
        title: "El cliente elige, pide y paga desde su celular",
        text: "Escaneá el QR de la mesa y el comensal tiene la carta en su celular. Sin esperar al mozo, sin errores en el pedido y con la posibilidad de pagar sin pasar por caja.",
        bullets: ["Menú digital siempre actualizado", "Pedidos desde el celular sin app", "Pago móvil al cerrar la cuenta", "Llamado al mozo con un toque"],
        img: "assets/menudigital.png",
      },
      llamados: {
        title: "Atención cuando el cliente la necesita",
        text: "Con un toque, el comensal avisa que necesita algo. El mozo recibe la notificación en su dispositivo y responde sin que nadie tenga que levantar la voz.",
        bullets: ["Botón de llamado desde el menú digital", "Notificación instantánea al mozo", "Registro de tiempos de atención", "Menos estrés, mejor experiencia"],
        img: "assets/llamadosMozo.png",
      },
    },
  };

  const panelEl          = document.querySelector(".features__panel");
  const panelTitle       = document.querySelector(".features__panel-title");
  const panelText        = document.querySelector(".features__panel-text");
  const panelList        = document.querySelector(".features__panel-list");
  const panelImg         = document.querySelector(".features__panel-img");
  const panelPlaceholder = document.querySelector(".features__panel-placeholder");

  function updatePanel(category, feature) {
    const data = featuresData[category]?.[feature];
    if (!data || !panelTitle || !panelText) return;

    panelTitle.textContent = data.title;
    panelText.textContent  = data.text;

    if (panelList) {
      panelList.innerHTML = (data.bullets || [])
        .map((b) => `<li>${b}</li>`)
        .join("");
    }

    if (panelImg && panelPlaceholder) {
      if (data.img) {
        panelImg.src    = data.img;
        panelImg.alt    = data.title;
        panelImg.hidden = false;
        panelPlaceholder.hidden = true;
        panelEl?.classList.add("has-image");
      } else {
        panelImg.hidden         = true;
        panelPlaceholder.hidden = false;
        panelEl?.classList.remove("has-image");
      }
    }
  }

  let activeCategory = "admin";

  // Init panel with first feature
  updatePanel("admin", "mesas");

  document.querySelectorAll(".features__tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".features__tab").forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      activeCategory = tab.dataset.category;

      document.querySelectorAll(".features__pills").forEach((p) => {
        p.hidden = p.dataset.category !== activeCategory;
      });

      // Activate first pill of new category
      const firstPill = document.querySelector(`.features__pills[data-category="${activeCategory}"] .features__pill`);
      document.querySelectorAll(".features__pill").forEach((p) => p.classList.remove("is-active"));
      firstPill?.classList.add("is-active");
      updatePanel(activeCategory, firstPill?.dataset.feature);
    });
  });

  document.querySelectorAll(".features__pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      const parentPills = pill.closest(".features__pills");
      parentPills.querySelectorAll(".features__pill").forEach((p) => p.classList.remove("is-active"));
      pill.classList.add("is-active");
      updatePanel(activeCategory, pill.dataset.feature);
    });
  });

})();
