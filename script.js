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

// Content stays visible if JavaScript or IntersectionObserver is unavailable.
if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
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
  const copyText = document.querySelector("#enquiry-copy");
  const copyStatus = document.querySelector("#copy-status");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const body = [
      "Guten Tag L&R Transporte Selmani",
      "",
      `Ich möchte eine Anfrage für ${data.get("service")} stellen.`,
      "",
      `Name: ${String(data.get("name")).trim()}`,
      `Telefon: ${String(data.get("phone")).trim() || "Nicht angegeben"}`,
      `E-Mail: ${String(data.get("email")).trim()}`,
      "",
      String(data.get("message")).trim(),
      "",
      "Freundliche Grüsse",
      String(data.get("name")).trim(),
    ].join("\n");
    copyText.value = body;
    copyStatus.textContent = "";
    document.querySelector("#form-status").hidden = false;
    const subject = `Anfrage – ${data.get("service")}`;
    document.querySelector("#email-draft-link").href =
      `mailto:info@lrtransporte.ch?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
  document
    .querySelector("#copy-enquiry")
    .addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(copyText.value);
        copyStatus.textContent = "Anfragetext kopiert.";
      } catch {
        copyText.focus();
        copyText.select();
        copyStatus.textContent = "Bitte kopieren Sie den markierten Text.";
      }
    });
}
