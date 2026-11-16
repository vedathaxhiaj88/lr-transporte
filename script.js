"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#hauptnavigation");

if (menuToggle && navigation) {
  menuToggle.hidden = false;
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    menuToggle.querySelector(".menu-label").textContent = "Menü";
  };
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    navigation.classList.toggle("is-open", !expanded);
    menuToggle.querySelector(".menu-label").textContent = expanded
      ? "Menü"
      : "Schliessen";
  });
  navigation
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuToggle.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menuToggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".header-inner")) closeMenu();
  });
  window.matchMedia("(min-width: 901px)").addEventListener("change", closeMenu);
}

// Reveal once; keep keyboard targets and live reduced-motion changes visible.
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window && !motionPreference.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  const reveal = (element) => {
    element.classList.add("is-visible");
    observer.unobserve(element);
  };
  document.addEventListener("focusin", (event) => {
    const element = event.target.closest(".reveal");
    if (element) reveal(element);
  });
  motionPreference.addEventListener("change", (event) => {
    if (event.matches) {
      document.querySelectorAll(".will-reveal").forEach(reveal);
      observer.disconnect();
    }
  });
  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("will-reveal");
    observer.observe(element);
  });
}

const serviceSelect = document.querySelector("#service");
document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    serviceSelect.value = link.dataset.service;
  });
});

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const form = document.querySelector("#enquiry-form");
if (form) {
  const status = document.querySelector("#form-status");
  const submitButton = form.querySelector('button[type="submit"]');
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    submitButton.disabled = true;
    status.hidden = false;
    status.textContent = "Ihre Anfrage wird gesendet …";
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Delivery failed");
      status.textContent = "Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet.";
      form.reset();
    } catch {
      status.textContent = "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es später erneut oder schreiben Sie an info@lrtransporte.ch.";
    } finally {
      submitButton.disabled = false;
    }
  });
}
