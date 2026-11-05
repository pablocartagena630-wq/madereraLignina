const { test, expect, knownBug, mismoProducto, PAGINAS } = require('./helpers');

test.describe('US-14 · Usar el sitio desde el celular (MLIG-14)', () => {
  test.use({ viewport: { width: 375, height: 667 }, isMobile: false });

  // CP-14.1 · CA1 (MLIG-14)
  for (const pagina of ['inicio', 'categorias', 'venta', 'consejos', 'comentarios']) {
    test(`CP-14.1 · ${pagina} no tiene desplazamiento horizontal a 375 px`, async ({ page }) => {
      if (pagina === 'consejos') knownBug('MLIG-121'); // mide 408 px
      await page.goto(PAGINAS[pagina]);
      await page.waitForLoadState('load');
      const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(ancho, `scrollWidth de ${pagina}`).toBeLessThanOrEqual(375);
    });
  }

  // CP-14.2 · CA2
  test('CP-14.2 · los enlaces del menú son visibles y se pueden presionar', async ({ page }) => {
    await page.goto(PAGINAS.inicio);
    for (const nombre of ['Nosotros', 'Categorías', 'Venta de la semana', 'Consejos', 'Comentarios']) {
      const link = page.locator('nav').getByRole('link', { name: nombre, exact: true });
      await expect(link).toBeVisible();
      await link.click({ trial: true });
      const caja = await link.boundingBox();
      expect(caja.x, `${nombre} se sale por la izquierda`).toBeGreaterThanOrEqual(0);
      expect(caja.x + caja.width, `${nombre} se sale por la derecha`).toBeLessThanOrEqual(375);
    }
  });

  // CP-14.3 · CA3
  for (const pagina of ['registro', 'ingreso']) {
    test(`CP-14.3 · el formulario de ${pagina} se ve completo y usable`, async ({ page }) => {
      await page.goto(PAGINAS[pagina]);
      const controles = page.locator('main form input:visible, main form select:visible, form input:visible, form select:visible, form button:visible');
      const n = await controles.count();
      expect(n).toBeGreaterThan(3);
      for (let i = 0; i < n; i++) {
        const caja = await controles.nth(i).boundingBox();
        expect(caja.x).toBeGreaterThanOrEqual(0);
        expect(caja.x + caja.width).toBeLessThanOrEqual(375);
      }
    });
  }
});

test.describe('US-15 · Usar el sitio con lector de pantalla (MLIG-15)', () => {
  // Nombre accesible EXPLÍCITO: aria-label, aria-labelledby, <label> asociada o title.
  // (un placeholder solo no cuenta como etiqueta)
  const tieneEtiqueta = (loc) => loc.evaluate((el) =>
    !!(el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title') || (el.labels && el.labels.length)));

  // CP-15.1 · CA1
  test('CP-15.1 · cada imagen de producto tiene un alt que describe su producto', async ({ page }) => {
    knownBug('MLIG-122');
    await page.goto(PAGINAS.categorias);
    const productos = await page.locator('#mains2 [id^="d"]:has(button[data-bs-toggle="modal"])').evaluateAll((divs) =>
      divs.map((d) => ({
        id: d.id,
        nombre: d.querySelector('button[data-bs-toggle="modal"]').textContent.trim(),
        alt: (d.querySelector('img').getAttribute('alt') || '').trim(),
      })));
    expect(productos.length).toBe(28);
    const mal = productos.filter((p) => !mismoProducto(p.alt, p.nombre));
    expect(mal.map((p) => `${p.id}: producto "${p.nombre}" tiene alt "${p.alt}"`)).toEqual([]);
  });

  // CP-15.2 · CA2
  test('CP-15.2 · los campos de búsqueda y newsletter tienen etiqueta accesible', async ({ page }) => {
    knownBug('MLIG-123');
    await page.goto(PAGINAS.inicio);
    expect(await tieneEtiqueta(page.getByPlaceholder('Buscar')), 'campo Buscar').toBe(true);
    expect(await tieneEtiqueta(page.locator('#divnewsletter input')), 'campo Newsletter').toBe(true);
  });

  test('CP-15.2 · el campo de comentarios tiene etiqueta accesible', async ({ page }) => {
    await page.goto(PAGINAS.comentarios);
    expect(await tieneEtiqueta(page.locator('textarea'))).toBe(true);
  });

  // CP-15.3 · CA3
  test('CP-15.3 · la lupa se anuncia como "Buscar"', async ({ page }) => {
    knownBug('MLIG-124');
    await page.goto(PAGINAS.inicio);
    await expect(page.getByRole('button', { name: 'Buscar', exact: true })).toBeVisible();
  });

  test('CP-15.3 · el ícono del carrito se anuncia como "Carrito de compras"', async ({ page }) => {
    knownBug('MLIG-124');
    await page.goto(PAGINAS.inicio);
    await expect(page.getByRole('link', { name: 'Carrito de compras', exact: true })).toBeVisible();
  });
});
