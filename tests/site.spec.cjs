const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

// Exercise the public workflow without sending messages or requiring external services.
test("all local assets load and verified business details remain available", async ({
  page,
}) => {
  const failures = [];
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      failures.push(`${response.status()} ${response.url()}`);
  });
  await page.goto("/");
  await expect(page).toHaveTitle(/L&R Transporte Selmani/);
  await expect(page.locator("html")).toHaveAttribute("lang", "de-CH");
  await expect(page.locator("h1")).toContainText("Transporte.");
  await expect(page.locator(".service-card")).toHaveCount(4);
  await expect(page.locator(".contact-phone")).toHaveAttribute(
    "href",
    "tel:+41625357485",
  );
  await expect(page.locator(".contact-email")).toHaveAttribute(
    "href",
    "mailto:info@lrtransporte.ch",
  );
  await expect(page.locator("address")).toContainText("Wiesenstrasse 17");
  await expect(page.locator("address")).toContainText("5303 Würenlingen");
  await page.getByRole("link", { name: "Bildnachweise", exact: true }).click();
  await expect(page.locator("h1")).toContainText("Bildnachweise");
  expect(failures).toEqual([]);
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`navigation and layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const menu = page.locator(".menu-toggle");
    if (width <= 900) {
      await menu.click();
      await expect(menu).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Escape");
      await expect(menu).toHaveAttribute("aria-expanded", "false");
      await expect(menu).toBeFocused();
      await menu.click();
    }
    await page
      .getByRole("navigation", { name: "Hauptnavigation" })
      .getByRole("link", { name: "Leistungen", exact: true })
      .click();
    await expect(page).toHaveURL(/#leistungen$/);
    if (width <= 900)
      await expect(menu).toHaveAttribute("aria-expanded", "false");
    await page.locator('[data-service="Entsorgung"]').click();
    await expect(page.locator("#service")).toHaveValue("Entsorgung");
    await expect(page).toHaveURL(/#kontakt$/);
  });
}

test("required fields block submission; valid enquiry prepares encoded email and copy fallback", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".form-submit").click();
  await expect(page.locator("#form-status")).toBeHidden();
  await expect(page.locator("#name")).toBeFocused();
  await page.locator("#name").fill("Test & Prüfung");
  await page.locator("#email").fill("test@example.com");
  await page
    .locator("#message")
    .fill("Ein Sofa von Würenlingen nach Baden.\nTermin & Zugang besprechen?");
  await page.locator("#service").selectOption("Möbeltransport");
  await page.locator(".form-submit").click();
  const url = new URL(
    await page.locator("#email-draft-link").getAttribute("href"),
  );
  expect(url.pathname).toBe("info@lrtransporte.ch");
  expect(url.searchParams.get("subject")).toBe("Anfrage – Möbeltransport");
  expect(url.searchParams.get("body")).toContain("Test & Prüfung");
  expect(url.searchParams.get("body")).toContain("Termin & Zugang besprechen?");
  await expect(page.locator("#form-status")).toBeVisible();
  await expect(page.locator("#enquiry-copy")).toHaveValue(
    url.searchParams.get("body"),
  );
  // Exercise the fallback when clipboard access is unavailable.
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
    }),
  );
  await page.locator("#copy-enquiry").click();
  await expect(page.locator("#copy-status")).toHaveText(
    "Bitte kopieren Sie den markierten Text.",
  );
  await expect(page.locator("#enquiry-copy")).toBeFocused();
});

test("FAQ works with the keyboard and reduced motion is respected", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const question = page.locator("summary").first();
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});

for (const width of [390, 1440]) {
  test(`WCAG accessibility scan at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    if (width === 390) await page.locator(".menu-toggle").click();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test("essential content, navigation and FAQ remain usable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: "reduce",
    viewport: { width: 390, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:8011");
  await expect(
    page.getByRole("navigation", { name: "Hauptnavigation" }),
  ).toBeVisible();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Leistungen", exact: true })
    .click();
  await expect(page).toHaveURL(/#leistungen$/);
  await expect(page.locator(".service-card").first()).toBeVisible();
  await page.locator("summary").first().click();
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  await context.close();
});

for (const width of [390, 1440]) {
  test(`local photography loads with responsive crops at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const external = [];
    page.on("request", (request) => {
      if (!request.url().startsWith("http://127.0.0.1:8011"))
        external.push(request.url());
    });
    await page.goto("/");
    const photos = page.locator(".editorial-photo");
    await expect(photos).toHaveCount(3);
    for (const photo of await photos.all()) {
      await photo.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          photo.evaluate((img) => img.complete && img.naturalWidth > 0),
        )
        .toBe(true);
      expect(
        await photo.evaluate((img) => getComputedStyle(img).objectFit),
      ).toBe("cover");
      expect(await photo.getAttribute("alt")).toBeTruthy();
      expect(
        await photo.evaluate((img) => new URL(img.currentSrc).pathname),
      ).toMatch(/^\/assets\/images\/.+\.webp$/);
    }
    await expect(page.locator(".stock-label")).toHaveCount(3);
    expect(external).toEqual([]);
  });
}

test("Premium V2 enquiry link and motion preferences work with keyboard navigation", async ({
  page,
}) => {
  await page.goto("/");
  const enquiry = page.getByRole("link", {
    name: "Ihr Transport. Unser Einsatz. Transport anfragen",
  });
  await enquiry.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#kontakt$/);
  const service = page.locator('[data-service="Privatumzug"]');
  await service.focus();
  await expect(service.locator("xpath=..")).toHaveClass(/is-visible/);
  await expect(service).toBeFocused();
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page
      .locator(".will-reveal")
      .evaluateAll((elements) =>
        elements.every(
          (element) =>
            getComputedStyle(element).opacity === "1" &&
            getComputedStyle(element).transform === "none",
        ),
      ),
  ).toBe(true);
  expect(
    await page
      .locator(".editorial-photo")
      .first()
      .evaluate((element) => getComputedStyle(element).transitionDuration),
  ).toBe("0s");
});

test("business-card contacts and every local link resolve", async ({
  page,
  request,
}) => {
  for (const route of ["/", "/bildnachweise.html"]) {
    await page.goto(route);
    const links = await page
      .locator("a[href]")
      .evaluateAll((elements) => elements.map((a) => a.getAttribute("href")));
    for (const href of new Set(links)) {
      if (href.startsWith("#")) {
        expect(await page.locator(href).count()).toBe(1);
      } else if (href.startsWith("tel:")) {
        expect([
          "tel:+41625357485",
          "tel:+41799076396",
          "tel:+41765026171",
        ]).toContain(href);
      } else if (href.startsWith("mailto:")) {
        expect(href).toBe("mailto:info@lrtransporte.ch");
      } else if (!href.startsWith("https:")) {
        expect((await request.get(href)).ok()).toBe(true);
      }
    }
  }
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: /Besarta Selmani/ }),
  ).toHaveAttribute("href", "tel:+41799076396");
  await expect(page.getByRole("link", { name: /Nezir Kuqi/ })).toHaveAttribute(
    "href",
    "tel:+41765026171",
  );
  const business = JSON.parse(
    await page.locator('script[type="application/ld+json"]').textContent(),
  );
  expect(business.telephone).toBe("+41625357485");
  expect(business.contactPoint.map((person) => person.telephone)).toEqual([
    "+41799076396",
    "+41765026171",
  ]);
});

test("transport leads the service hierarchy and enquiry default", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".primary-services h3")).toHaveText([
    "Kleintransporte",
    "Möbeltransporte",
  ]);
  await expect(page.locator(".secondary-services h3")).toHaveText([
    "Privatumzüge",
    "Entsorgung",
  ]);
  await expect(page.locator("#service")).toHaveValue("Transport");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /^Transporte, Kleintransporte und Möbeltransporte/,
  );
  for (const service of [
    "Kleintransport",
    "Möbeltransport",
    "Privatumzug",
    "Entsorgung",
  ]) {
    await page.locator(`[data-service="${service}"]`).click();
    await expect(page.locator("#service")).toHaveValue(service);
  }
});
