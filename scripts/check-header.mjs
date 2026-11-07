import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const phase = process.argv[2] === 'before' ? 'before' : 'after';
await mkdir(`artifacts/header/${phase}`, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage();
  for (const width of [901, 980, 1024, 1440, 1888]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('http://localhost:3103/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const result = await page.locator('.header-cta .button').evaluate(button => {
      const style = getComputedStyle(button);
      const label = button.querySelector('.header-course-label, .button-label') ?? Array.from(button.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
      const range = document.createRange();
      range.selectNodeContents(label);
      const lines = new Set(Array.from(range.getClientRects()).filter(rect => rect.width > 0).map(rect => Math.round(rect.top)));
      return { text: button.textContent.trim(), width: button.getBoundingClientRect().width, height: button.getBoundingClientRect().height, lines: lines.size, whiteSpace: style.whiteSpace, overflow: button.scrollWidth > button.clientWidth, font: style.fontFamily };
    });
    console.log(JSON.stringify({ viewport: width, ...result }));
    await page.locator('.header').screenshot({ path: `artifacts/header/${phase}/${width}.png` });
    if (phase === 'after' && (result.lines !== 1 || result.overflow || result.height > 48)) throw new Error(`Header CTA invalid at ${width}px`);
  }
} finally { await browser.close(); }
