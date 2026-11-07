import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

test('Cinco cursos temporários: dois intervalos automáticos, hover, setas e loop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('.course-card')).toHaveCount(5);
  const selected = page.locator('.carousel-dots [aria-current="true"]');
  await expect(page.getByRole('button', { name: 'Próximos cursos' })).toBeEnabled();
  await page.getByRole('button', { name: 'Ir para o grupo 1', exact: true }).click();
  await page.locator('.course-card').first().hover();
  await expect(selected).toHaveAttribute('aria-label', 'Ir para o grupo 2', { timeout: 7000 });
  await expect(selected).toHaveAttribute('aria-label', 'Ir para o grupo 3', { timeout: 7000 });
  await page.getByRole('button', { name: 'Próximos cursos' }).click();
  await expect(selected).toHaveAttribute('aria-label', 'Ir para o grupo 4');
  await expect(selected).toHaveAttribute('aria-label', 'Ir para o grupo 5', { timeout: 7000 });
  await page.getByRole('button', { name: 'Ir para o grupo 5' }).click();
  await expect(selected).toHaveAttribute('aria-label', 'Ir para o grupo 1', { timeout: 7000 });
  await mkdir('artifacts/visual/fixtures', { recursive: true });
  await page.screenshot({ path: 'artifacts/visual/fixtures/five-courses.png', fullPage: true });
});

test('Swipe de toque no mobile', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(baseURL!, { waitUntil: 'networkidle' });
  await page.locator('.carousel-viewport').scrollIntoViewIfNeeded();
  const box = await page.locator('.carousel-viewport').boundingBox();
  const session = await context.newCDPSession(page);
  const startX = box!.x + box!.width * .8;
  const y = box!.y + 70;
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: startX, y }] });
  for (let step = 1; step <= 8; step++) {
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: startX - step * 30, y }] });
    await page.waitForTimeout(20);
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(page.locator('.carousel-dots [aria-current="true"]')).not.toHaveAttribute('aria-label', 'Ir para o grupo 1');
  await context.close();
});
