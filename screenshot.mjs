import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = process.env.URL || 'http://127.0.0.1:8002/';
const OUT = 'screenshots';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
});
const page = await ctx.newPage();

await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(800);

// Full page
await page.screenshot({ path: `${OUT}/01-full-desktop.png`, fullPage: true });

// Individual sections via element handles
const shots = [
  ['02-hero',    'section.relative:has(h1)'],
  ['03-stats',   'section:has(> div.mx-auto.grid)'],
  ['04-services','section#services'],
  ['05-why',     'section:has(p:has-text("Why a human"))'],
  ['06-process', 'section#process'],
  ['07-testi',   'section:has(p:has-text("Went from stuttering"))'],
  ['08-order',   'section#order'],
  ['09-faq',     'section#faq'],
];
for (const [name, sel] of shots) {
  const el = await page.$(sel);
  if (el) await el.screenshot({ path: `${OUT}/${name}.png` });
}

// Mobile
const mctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
  isMobile: true,
});
const mpage = await mctx.newPage();
await mpage.goto(URL, { waitUntil: 'networkidle' });
await mpage.waitForTimeout(800);
await mpage.screenshot({ path: `${OUT}/10-full-mobile.png`, fullPage: true });

await browser.close();
console.log('done');
