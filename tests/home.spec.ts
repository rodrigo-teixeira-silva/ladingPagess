import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

test('Espaçamento de 16px entre cards permanece uniforme na passagem do loop', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [1024, 1440, 1888, 768, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/', { waitUntil: 'networkidle' });
    const expectedVisible = width > 900 ? 3 : width > 600 ? 2 : 1;
    for (let step = 0; step < 7; step++) {
      const layout = await page.locator('.carousel').evaluate(element => {
        const viewport = element.querySelector('.carousel-viewport')!.getBoundingClientRect();
        const cards = Array.from(element.querySelectorAll('.course-card')).map(card => card.getBoundingClientRect())
          .filter(card => card.left >= viewport.left - 1 && card.right <= viewport.right + 1)
          .sort((a, b) => a.left - b.left);
        return { count: cards.length, gaps: cards.slice(1).map((card, i) => card.left - cards[i].right) };
      });
      expect(layout.count, `largura ${width}, passo ${step}`).toBe(expectedVisible);
      for (const gap of layout.gaps) expect(Math.abs(gap - 16)).toBeLessThan(1);
      await page.getByRole('button', { name: 'Próximos cursos' }).click();
      await expect(page.locator('.carousel-dots [aria-current="true"]')).toHaveAttribute('aria-label', `Ir para o grupo ${(step + 1) % 3 + 1}`);
    }
  }
});

test('Home nos quatro tamanhos: composição, proporções, links e ausência de overflow', async ({ page }) => {
  const measurements = [];
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await mkdir('artifacts/visual/after', { recursive: true });
  for (const width of [1440, 1024, 768, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('.course-card')).toHaveCount(6);
    await expect(page.locator('h1')).toHaveText('Português paraConcursos, ENEMe Vestibulares');
    await expect(page.locator('#conteudos-gratuitos').getByRole('heading', { name: 'Conteúdos Gratuitos' })).toBeVisible();
    await expect(page.getByRole('button', { name: /pausar|retomar/i })).toHaveCount(0);
    const layout = await page.evaluate(() => {
      const box = (selector: string) => {
        const { x, y, width, height } = document.querySelector(selector)!.getBoundingClientRect();
        return { x, y, width, height };
      };
      const hero = document.querySelector<HTMLImageElement>('.hero-visual img')!;
      return {
        width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        copy: box('.hero-copy'), image: box('.hero-visual'), container: box('.hero > .container'),
        slide: box('.carousel-slide'), viewport: box('.carousel-viewport'),
        imageFit: getComputedStyle(hero).objectFit, imagePosition: getComputedStyle(hero).objectPosition,
        gradient: getComputedStyle(document.querySelector('.hero-shade')!).backgroundImage,
        sections: Object.fromEntries(['.header', '.hero', '.benefits', '.courses-section', '.free-section', 'footer'].map(s => [s, box(s)])),
      };
    });
    expect(layout.scrollWidth).toBe(width);
    expect(layout.image.width).toBe(width);
    expect(layout.image.y).toBe(layout.sections['.hero'].y);
    expect(layout.image.height).toBe(layout.sections['.hero'].height);
    expect(layout.imageFit).toBe(width > 600 ? 'cover' : 'contain');
    expect(layout.gradient).toContain('linear-gradient');
    await expect(page.locator('.free-banner')).toHaveCount(1);
    await expect(page.locator('.free-card')).toHaveCount(0);
    const visible = width > 900 ? 3 : width > 600 ? 2 : 1;
    expect(Math.round(layout.viewport.width / layout.slide.width)).toBe(visible);
    if (width === 1440) {
      expect(layout.container.width).toBe(1280);
      expect(layout.sections['.courses-section'].height).toBeLessThan(600);
      expect(layout.sections['.free-section'].height).toBeLessThan(350);
    }
    measurements.push(layout);
    await page.screenshot({ path: `artifacts/visual/after/home-${width}.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
  await writeFile('artifacts/visual/after/measurements.json', JSON.stringify(measurements, null, 2));
});

test('Três cursos no desktop: loop de apresentação, setas laterais e cards estáveis no hover', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Próximos cursos' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Cursos anteriores' })).toBeEnabled();
  await expect(page.getByRole('button', { name: /pausar|retomar/i })).toHaveCount(0);
  const viewport = await page.locator('.carousel-viewport').boundingBox();
  const previous = await page.getByRole('button', { name: 'Cursos anteriores' }).boundingBox();
  const next = await page.getByRole('button', { name: 'Próximos cursos' }).boundingBox();
  expect(previous!.x).toBeLessThan(viewport!.x);
  expect(next!.x).toBeGreaterThan(viewport!.x + viewport!.width - 5);
  const card = page.locator('.course-card').first();
  const appearance = () => card.evaluate(el => {
    const style = getComputedStyle(el);
    return { transform: style.transform, shadow: style.boxShadow, border: style.borderColor, image: getComputedStyle(el.querySelector('img')!).transform };
  });
  const before = await appearance();
  await card.hover();
  await page.waitForTimeout(250);
  expect(await appearance()).toEqual(before);
  expect(before.transform).toBe('none');
  expect(before.image).toBe('none');
});

test('Menu mobile, teclado, links, detalhes e inscrições indisponíveis', async ({ page, request }) => {
  for (const route of ['/', '/artigos', '/simulados', '/aulas-basicas', '/sobre', '/contato', '/conteudos-gratuitos', '/cursos/redacao-para-o-enem', '/cursos/gramatica-completa', '/cursos/literatura-brasileira']) {
    expect((await request.get(route)).status()).toBe(200);
  }
  expect((await request.get('/nao-existe')).status()).toBe(404);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused();
  const menu = page.getByRole('button', { name: 'Abrir menu' });
  await menu.click();
  await expect(page.getByRole('navigation', { name: 'Navegação móvel' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await menu.click();
  await page.getByRole('navigation', { name: 'Navegação móvel' }).getByRole('link', { name: 'Artigos' }).click();
  await expect(page).toHaveURL(/\/artigos$/);
  await page.goto('/');
  await page.getByRole('link', { name: 'Explorar Conteúdos' }).click();
  await expect(page).toHaveURL(/\/conteudos-gratuitos$/);
  for (const category of ['Artigos', 'Simulados', 'Aulas Básicas']) await expect(page.locator('.content-hub').getByRole('heading', { name: category })).toBeVisible();
  await page.goto('/');
  await page.getByRole('link', { name: 'Ver mais' }).first().click();
  await expect(page).toHaveURL(/\/cursos\/redacao-para-o-enem$/);
  await expect(page.getByRole('button', { name: 'Quero me inscrever' })).toBeDisabled();
  await expect(page.locator('#enrollment-status')).toBeVisible();
});

test('Mobile: autoplay sem clique ou pausa no hover, setas não interrompem e movimento reduzido é respeitado', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const selected = page.locator('.carousel-dots [aria-current="true"]');
  await expect(selected).toHaveAttribute('aria-label', 'Ir para o grupo 1');
  await page.locator('.course-card').first().hover();
  await expect(selected).toHaveAttribute('aria-label', 'Ir para o grupo 2', { timeout: 7000 });
  await page.getByRole('button', { name: 'Próximos cursos' }).click();
  await expect(selected).toHaveAttribute('aria-label', 'Ir para o grupo 3');
  await expect(selected).toHaveAttribute('aria-label', 'Ir para o grupo 1', { timeout: 7000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('button', { name: /pausar|retomar/i })).toHaveCount(0);
  const frozen = await selected.getAttribute('aria-label');
  await page.waitForTimeout(5500);
  await expect(selected).toHaveAttribute('aria-label', frozen!);
  await page.getByRole('button', { name: 'Próximos cursos' }).click();
  await expect(selected).not.toHaveAttribute('aria-label', frozen!);
});
