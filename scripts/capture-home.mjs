import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const phase = process.argv[2] === 'before' ? 'before' : 'after';
const directory = `artifacts/visual/${phase}`;
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const measurements = [];
try {
  for (const width of [1440, 1024, 768, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${directory}/home-${width}.png`, fullPage: true });
    measurements.push(await page.evaluate(() => ({
      width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
      sections: Object.fromEntries(['.header', '.hero', '.benefits', '.courses-section', '.free-section', 'footer'].map(selector => {
        const { x, y, width, height } = document.querySelector(selector).getBoundingClientRect();
        return [selector, { x, y, width, height }];
      })),
    })));
    await page.close();
  }
  await writeFile(`${directory}/measurements.json`, JSON.stringify(measurements, null, 2));
  console.log(JSON.stringify(measurements));
} finally { await browser.close(); }
