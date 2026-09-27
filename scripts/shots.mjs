#!/usr/bin/env node
/**
 * ابزار بازبینی بصری — اسکرین‌شات موبایل/تبلت/دسکتاپ از مسیرهای اصلی.
 *
 *   npm run dev            # سرویس روی http://127.0.0.1:3000
 *   npm run shots          # خروجی در .shots/
 *
 * این اسکریپت Playwright را جزو وابستگی‌های پروژه نمی‌خواهد:
 *   npm i -D playwright-core && npx playwright install chromium
 *   npm run shots
 * متغیرهای محیطی: SHOTS_BASE، SHOTS_OUT، SHOTS_ROUTES، SHOTS_VIEWPORTS،
 * SHOTS_SCREENS، SHOTS_EXECUTABLE (مسیر باینری مرورگر)، SHOTS_NO_SANDBOX=1
 * همچنین گزارش می‌دهد کدام صفحه پهنای افقی بیشتر از viewport دارد (سرریز).
 */

import { mkdirSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const BASE = process.env.SHOTS_BASE || "http://127.0.0.1:3000";
const OUT = resolve(process.env.SHOTS_OUT || ".shots");
const ROUTES = (
  process.env.SHOTS_ROUTES ||
  "/,/explore,/services,/specialists/sp1,/booking/sp1,/bookings,/favorites,/account,/notifications,/support,/join"
).split(",");
const VIEWPORTS = (
  process.env.SHOTS_VIEWPORTS ||
  "360x780,390x844,430x932,768x1024,1280x800,1440x900"
)
  .split(",")
  .map((spec) => {
    const [w, h] = spec.split("x").map(Number);
    return { width: w, height: h };
  });
const SCREENS = Number(process.env.SHOTS_SCREENS || 2);
/** اجرای Chromium آماده (مثلاً در CI یا کانتینر بدون نصب مرورگر) */
const EXECUTABLE = process.env.SHOTS_EXECUTABLE || undefined;
const NO_SANDBOX = process.env.SHOTS_NO_SANDBOX === "1";

async function loadChromium() {
  const require = createRequire(import.meta.url);
  for (const name of ["playwright", "playwright-core"]) {
    try {
      const mod = require(name);
      return mod.chromium;
    } catch {
      /* بعداً */
    }
  }
  throw new Error(
    "Playwright پیدا نشد. با «npm i -D playwright-core && npx playwright install chromium» نصبش کنید.",
  );
}

const chromium = await loadChromium();
mkdirSync(OUT, { recursive: true });

if (!existsSync(OUT)) throw new Error(`مسیر خروجی ساخته نشد: ${OUT}`);
console.log(`→ ${BASE}`);

const browser = await chromium.launch({
  ...(EXECUTABLE ? { executablePath: EXECUTABLE } : {}),
  ...(NO_SANDBOX ? { args: ["--no-sandbox"] } : {}),
});
let problems = 0;

for (const vp of VIEWPORTS) {
  const tag = `${vp.width}x${vp.height}`;
  const context = await browser.newContext({
    viewport: vp,
    hasTouch: vp.width < 500,
    isMobile: vp.width < 500,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });

  for (const route of ROUTES) {
    const name =
      route.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "home";
    try {
      await page.goto(BASE + route, { waitUntil: "load", timeout: 30_000 });
      await page.waitForTimeout(700);
      const metrics = await page.evaluate(() => {
        const d = document.documentElement;
        const clipped = (el) => {
          for (let p = el.parentElement; p; p = p.parentElement) {
            const ox = getComputedStyle(p).overflowX;
            if (
              ox === "auto" ||
              ox === "scroll" ||
              ox === "hidden" ||
              ox === "clip"
            )
              return true;
          }
          return false;
        };
        /* عنصرهای بیرون از viewport که هیچ جدوله‌ی برنده‌ای ندارند = سرریز واقعی */
        const overflowing = [];
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.width < 2) continue;
          if (r.right <= d.clientWidth + 1 && r.left >= -1) continue;
          if (clipped(el)) continue;
          overflowing.push(
            `${el.tagName.toLowerCase()}.${(typeof el.className === "string" ? el.className : "").slice(0, 40)} (${Math.round(r.left)}→${Math.round(r.right)})`,
          );
          if (overflowing.length >= 4) break;
        }
        window.scrollTo(9999, 0);
        const canScrollX = window.scrollX;
        window.scrollTo(0, 0);
        return {
          scrollWidth: d.scrollWidth,
          clientWidth: d.clientWidth,
          canScrollX,
          height: d.scrollHeight,
          overflowing: overflowing.slice(0, 4),
        };
      });
      const total = Math.max(
        1,
        Math.min(SCREENS, Math.ceil(metrics.height / vp.height)),
      );
      for (let i = 0; i < total; i++) {
        await page.evaluate((y) => window.scrollTo(0, y), i * vp.height);
        await page.waitForTimeout(260);
        const file = `${tag}-${name}${total > 1 ? `-${i + 1}` : ""}.png`;
        await page.screenshot({ path: `${OUT}/${file}` });
      }
      const ok =
        metrics.scrollWidth <= metrics.clientWidth + 1 &&
        metrics.canScrollX === 0;
      if (!ok) problems++;
      console.log(
        `${ok ? "✓" : "✗"} ${tag} ${route}  عرض=${metrics.scrollWidth}/${metrics.clientWidth}  ارتفاع=${metrics.height}`,
      );
      for (const o of metrics.overflowing) console.log(`   سرریز: ${o}`);
    } catch (error) {
      problems++;
      console.log(
        `✗ ${tag} ${route}  ${String(error).split("\n")[0].slice(0, 140)}`,
      );
    }
  }

  const unique = [...new Set(errors)];
  if (unique.length) {
    problems += unique.length;
    console.log(`✗ ${tag} خطای کنسول:`);
    for (const e of unique.slice(0, 10)) console.log(`   ${e.slice(0, 200)}`);
  }
  await context.close();
}

await browser.close();
console.log(
  `\n${OUT} — ${problems === 0 ? "بدون مشکل" : `${problems} مورد نیازمند بازنگری`}`,
);
process.exit(problems === 0 ? 0 : 1);
