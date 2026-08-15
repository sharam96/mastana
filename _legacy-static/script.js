"use strict";

/* =========================================================
   HELPERS
========================================================= */

function select(selector, parent = document) {
  return parent.querySelector(selector);
}

function selectAll(selector, parent = document) {
  return Array.from(
    parent.querySelectorAll(selector)
  );
}

function setBodyScrollLock(shouldLock) {
  document.body.classList.toggle(
    "is-locked",
    shouldLock
  );
}

function focusElement(element) {
  if (
    element &&
    typeof element.focus === "function"
  ) {
    element.focus();
  }
}

/* =========================================================
   IMAGE FALLBACK
========================================================= */

window.handleMachineImageError =
  function handleMachineImageError(image) {
    image.onerror = null;

    image.src =
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=88";
  };

/* =========================================================
   HEADER SCROLL EFFECT
========================================================= */

const siteHeader =
  select("#siteHeader");

function updateHeaderAppearance() {
  if (!siteHeader) {
    return;
  }

  siteHeader.classList.toggle(
    "is-scrolled",
    window.scrollY > 18
  );
}

window.addEventListener(
  "scroll",
  updateHeaderAppearance,
  {
    passive: true
  }
);

updateHeaderAppearance();

/* =========================================================
   MOBILE MENU
========================================================= */

const hamburgerButton =
  select("#hamburgerButton");

const mobileNavigation =
  select("#mobileNavigation");

const mobileBackdrop =
  select("#mobileBackdrop");

const drawerCloseButton =
  select("#drawerCloseButton");

const mobileDrawer =
  select(".mobile-navigation__drawer");

const mobileNavigationLinks =
  selectAll(".mobile-navigation__links a");

let lastFocusedElementBeforeMenu = null;

function openMobileMenu() {
  if (
    !hamburgerButton ||
    !mobileNavigation
  ) {
    return;
  }

  lastFocusedElementBeforeMenu =
    document.activeElement;

  hamburgerButton.classList.add(
    "is-active"
  );

  hamburgerButton.setAttribute(
    "aria-expanded",
    "true"
  );

  hamburgerButton.setAttribute(
    "aria-label",
    "Close navigation menu"
  );

  mobileNavigation.classList.add(
    "is-open"
  );

  mobileNavigation.setAttribute(
    "aria-hidden",
    "false"
  );

  setBodyScrollLock(true);

  window.setTimeout(() => {
    focusElement(drawerCloseButton);
  }, 100);
}

function closeMobileMenu() {
  if (
    !hamburgerButton ||
    !mobileNavigation
  ) {
    return;
  }

  hamburgerButton.classList.remove(
    "is-active"
  );

  hamburgerButton.setAttribute(
    "aria-expanded",
    "false"
  );

  hamburgerButton.setAttribute(
    "aria-label",
    "Open navigation menu"
  );

  mobileNavigation.classList.remove(
    "is-open"
  );

  mobileNavigation.setAttribute(
    "aria-hidden",
    "true"
  );

  setBodyScrollLock(false);

  if (
    lastFocusedElementBeforeMenu &&
    typeof lastFocusedElementBeforeMenu.focus ===
      "function"
  ) {
    lastFocusedElementBeforeMenu.focus();
  }
}

function toggleMobileMenu() {
  const isOpen =
    mobileNavigation?.classList.contains(
      "is-open"
    );

  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

if (hamburgerButton) {
  hamburgerButton.addEventListener(
    "click",
    toggleMobileMenu
  );
}

if (drawerCloseButton) {
  drawerCloseButton.addEventListener(
    "click",
    closeMobileMenu
  );
}

if (mobileBackdrop) {
  mobileBackdrop.addEventListener(
    "click",
    closeMobileMenu
  );
}

mobileNavigationLinks.forEach((link) => {
  link.addEventListener(
    "click",
    closeMobileMenu
  );
});

if (mobileDrawer) {
  mobileDrawer.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();
    }
  );
}

document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape" &&
      mobileNavigation?.classList.contains(
        "is-open"
      )
    ) {
      closeMobileMenu();
    }
  }
);

window.addEventListener(
  "resize",
  () => {
    if (window.innerWidth > 1100) {
      closeMobileMenu();
    }
  }
);

/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

const revealElements =
  selectAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "is-visible"
          );

          observer.unobserve(
            entry.target
          );
        });
      },
      {
        threshold: 0.12,
        rootMargin:
          "0px 0px -30px 0px"
      }
    );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add(
      "is-visible"
    );
  });
}

/* =========================================================
   PRODUCT FILTERS
========================================================= */

const productFilterButtons =
  selectAll(".product-filter");

const productCards =
  selectAll(".product-card");

function filterProducts(category) {
  productCards.forEach((card) => {
    const productCategory =
      card.dataset.category;

    const shouldHide =
      category !== "all" &&
      productCategory !== category;

    card.classList.toggle(
      "is-hidden",
      shouldHide
    );
  });

  productFilterButtons.forEach(
    (button) => {
      button.classList.toggle(
        "is-active",
        button.dataset.filter ===
          category
      );
    }
  );
}

productFilterButtons.forEach((button) => {
  button.addEventListener(
    "click",
    () => {
      filterProducts(
        button.dataset.filter || "all"
      );
    }
  );
});

/* =========================================================
   CATEGORY FILTER BUTTONS
========================================================= */

const categoryFilterButtons =
  selectAll("[data-category-filter]");

categoryFilterButtons.forEach((button) => {
  button.addEventListener(
    "click",
    () => {
      const category =
        button.dataset.categoryFilter;

      filterProducts(category);

      select("#products")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  );
});

/* =========================================================
   PRODUCT ENQUIRY PREFILL
========================================================= */

const machineCategorySelect =
  select("#machineCategory");

const customerMessage =
  select("#customerMessage");

function prepareProductEnquiry(productName) {
  if (!productName) {
    return;
  }

  if (customerMessage) {
    customerMessage.value =
      `I want complete details, specifications and quotation for ${productName}.`;
  }

  if (machineCategorySelect) {
    const lowerName =
      productName.toLowerCase();

    if (
      lowerName.includes("laser") ||
      lowerName.includes("fine star") ||
      lowerName.includes("fs-")
    ) {
      machineCategorySelect.value =
        "Laser & Fusing Machine";
    } else if (
      lowerName.includes("shoe") ||
      lowerName.includes("jacquard")
    ) {
      machineCategorySelect.value =
        "Weaving Machine";
    } else {
      machineCategorySelect.value =
        "Flat Knitting Machine";
    }
  }

  select("#contact")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  window.setTimeout(() => {
    focusElement(customerMessage);
  }, 700);
}

selectAll("[data-product]").forEach(
  (button) => {
    button.addEventListener(
      "click",
      () => {
        prepareProductEnquiry(
          button.dataset.product
        );
      }
    );
  }
);

/* =========================================================
   PRODUCT MODAL
========================================================= */

const productModal =
  select("#productModal");

const productModalBackdrop =
  select("#productModalBackdrop");

const productModalClose =
  select("#productModalClose");

const productModalImage =
  select("#productModalImage");

const productModalCategory =
  select("#productModalCategory");

const productModalTitle =
  select("#productModalTitle");

const productModalDescription =
  select("#productModalDescription");

const productModalEnquire =
  select("#productModalEnquire");

const modalOpenButtons =
  selectAll("[data-modal-product]");

let currentModalProduct = "";

let lastFocusedElementBeforeModal =
  null;

function openProductModal(button) {
  if (!productModal) {
    return;
  }

  currentModalProduct =
    button.dataset.modalProduct || "";

  const category =
    button.dataset.modalCategory || "";

  const description =
    button.dataset.modalDescription || "";

  const image =
    button.dataset.modalImage || "";

  lastFocusedElementBeforeModal =
    document.activeElement;

  if (productModalImage) {
    productModalImage.src = image;

    productModalImage.alt =
      `${currentModalProduct} product image`;
  }

  if (productModalCategory) {
    productModalCategory.textContent =
      category;
  }

  if (productModalTitle) {
    productModalTitle.textContent =
      currentModalProduct;
  }

  if (productModalDescription) {
    productModalDescription.textContent =
      description;
  }

  productModal.classList.add(
    "is-open"
  );

  productModal.setAttribute(
    "aria-hidden",
    "false"
  );

  setBodyScrollLock(true);

  window.setTimeout(() => {
    focusElement(productModalClose);
  }, 100);
}

function closeProductModal() {
  if (!productModal) {
    return;
  }

  productModal.classList.remove(
    "is-open"
  );

  productModal.setAttribute(
    "aria-hidden",
    "true"
  );

  setBodyScrollLock(false);

  if (
    lastFocusedElementBeforeModal &&
    typeof lastFocusedElementBeforeModal.focus ===
      "function"
  ) {
    lastFocusedElementBeforeModal.focus();
  }
}

modalOpenButtons.forEach((button) => {
  button.addEventListener(
    "click",
    () => {
      openProductModal(button);
    }
  );
});

productModalBackdrop?.addEventListener(
  "click",
  closeProductModal
);

productModalClose?.addEventListener(
  "click",
  closeProductModal
);

productModalEnquire?.addEventListener(
  "click",
  () => {
    closeProductModal();

    window.setTimeout(() => {
      prepareProductEnquiry(
        currentModalProduct
      );
    }, 150);
  }
);

document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape" &&
      productModal?.classList.contains(
        "is-open"
      )
    ) {
      closeProductModal();
    }
  }
);

/* =========================================================
   TESTIMONIAL SLIDER
========================================================= */

const testimonialCards =
  selectAll(".testimonial-card");

const testimonialPrevious =
  select("#testimonialPrevious");

const testimonialNext =
  select("#testimonialNext");

let activeTestimonialIndex = 0;

function showTestimonial(index) {
  if (testimonialCards.length === 0) {
    return;
  }

  activeTestimonialIndex =
    (
      index +
      testimonialCards.length
    ) %
    testimonialCards.length;

  testimonialCards.forEach(
    (card, cardIndex) => {
      card.classList.toggle(
        "is-active",
        cardIndex ===
          activeTestimonialIndex
      );
    }
  );
}

testimonialPrevious?.addEventListener(
  "click",
  () => {
    showTestimonial(
      activeTestimonialIndex - 1
    );
  }
);

testimonialNext?.addEventListener(
  "click",
  () => {
    showTestimonial(
      activeTestimonialIndex + 1
    );
  }
);

window.setInterval(() => {
  showTestimonial(
    activeTestimonialIndex + 1
  );
}, 7000);

/* =========================================================
   FAQ ACCORDION
========================================================= */

const faqItems =
  selectAll(".faq-item");

faqItems.forEach((faqItem) => {
  const question =
    select(
      ".faq-item__question",
      faqItem
    );

  const answer =
    select(
      ".faq-item__answer",
      faqItem
    );

  if (!question || !answer) {
    return;
  }

  question.addEventListener(
    "click",
    () => {
      const isOpen =
        faqItem.classList.contains(
          "is-open"
        );

      faqItems.forEach((item) => {
        item.classList.remove(
          "is-open"
        );

        const itemQuestion =
          select(
            ".faq-item__question",
            item
          );

        const itemAnswer =
          select(
            ".faq-item__answer",
            item
          );

        itemQuestion?.setAttribute(
          "aria-expanded",
          "false"
        );

        if (itemAnswer) {
          itemAnswer.style.maxHeight =
            "0px";
        }
      });

      if (!isOpen) {
        faqItem.classList.add(
          "is-open"
        );

        question.setAttribute(
          "aria-expanded",
          "true"
        );

        answer.style.maxHeight =
          `${answer.scrollHeight}px`;
      }
    }
  );
});

/* =========================================================
   FORM VALIDATION
========================================================= */

const quotationForm =
  select("#quotationForm");

const customerName =
  select("#customerName");

const customerPhone =
  select("#customerPhone");

const customerEmail =
  select("#customerEmail");

const quotationStatus =
  select("#quotationStatus");

function setFieldInvalid(
  input,
  invalid
) {
  const wrapper =
    input?.closest(".form-field");

  wrapper?.classList.toggle(
    "is-invalid",
    invalid
  );
}

function validateQuotationForm() {
  const nameValue =
    customerName?.value.trim() || "";

  const phoneValue =
    customerPhone?.value.trim() || "";

  const emailValue =
    customerEmail?.value.trim() || "";

  const categoryValue =
    machineCategorySelect?.value || "";

  const phonePattern =
    /^[0-9+\-\s]{8,15}$/;

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const nameInvalid =
    nameValue.length < 2;

  const phoneInvalid =
    !phonePattern.test(phoneValue);

  const emailInvalid =
    !emailPattern.test(emailValue);

  const categoryInvalid =
    categoryValue.length === 0;

  setFieldInvalid(
    customerName,
    nameInvalid
  );

  setFieldInvalid(
    customerPhone,
    phoneInvalid
  );

  setFieldInvalid(
    customerEmail,
    emailInvalid
  );

  setFieldInvalid(
    machineCategorySelect,
    categoryInvalid
  );

  if (
    nameInvalid ||
    phoneInvalid ||
    emailInvalid ||
    categoryInvalid
  ) {
    if (quotationStatus) {
      quotationStatus.textContent =
        "Please complete all required fields correctly.";

      quotationStatus.style.color =
        "#b42318";
    }

    return false;
  }

  return true;
}

[
  customerName,
  customerPhone,
  customerEmail,
  machineCategorySelect
].forEach((input) => {
  input?.addEventListener(
    "input",
    () => {
      setFieldInvalid(
        input,
        false
      );

      if (quotationStatus) {
        quotationStatus.textContent =
          "";
      }
    }
  );

  input?.addEventListener(
    "change",
    () => {
      setFieldInvalid(
        input,
        false
      );
    }
  );
});

/* =========================================================
   WHATSAPP FORM SUBMISSION
========================================================= */

quotationForm?.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    if (!validateQuotationForm()) {
      return;
    }

    const name =
      customerName.value.trim();

    const phone =
      customerPhone.value.trim();

    const email =
      customerEmail.value.trim();

    const category =
      machineCategorySelect.value;

    const requirement =
      customerMessage.value.trim();

    const whatsappMessage =
`Hello Mastana Mechanical Works,

Name: ${name}
Phone: ${phone}
Email: ${email}
Machine Category: ${category}
Requirement: ${requirement || "Please share complete machine details and quotation."}`;

    const whatsappNumber =
      "919814011130";

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    if (quotationStatus) {
      quotationStatus.textContent =
        "Opening WhatsApp with your prepared enquiry...";

      quotationStatus.style.color =
        "#18794e";
    }

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }
);
