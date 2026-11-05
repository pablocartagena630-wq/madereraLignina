const { test, expect, knownBug, clickAndGetStatus, clickCentered, MENU, CATEGORIAS, PAGINAS } = require('./helpers');

test.describe('US-01 · Navegar entre las secciones del sitio (MLIG-1)', () => {
  // CP-01.1 · CA1 (MLIG-32)
  for (const origen of ['inicio', 'categorias']) {
    test(`CP-01.1 · el menú abre cada sección sin 404 (desde ${origen})`, async ({ page }) => {
      for (const item of MENU) {
        await page.goto(PAGINAS[origen]);
        const link = page.locator('nav').getByRole('link', { name: item.nombre, exact: true });
        const status = await clickAndGetStatus(page, link);
        expect(status, `${item.nombre} desde ${origen}`).toBe(200);
        await expect(page).toHaveURL(item.url, { timeout: 10_000 });
      }
    });
  }

  // CP-01.2 · CA2 (MLIG-33)
  for (const origen of ['consejos', 'registro', 'ingreso', 'carro']) {
    test(`CP-01.2 · "Volver al inicio" regresa al inicio (desde ${origen})`, async ({ page }) => {
      await page.goto(PAGINAS[origen]);
      await page.getByRole('link', { name: 'Volver al inicio' }).first().click();
      await expect(page).toHaveURL(/\/(index\.html)?$/, { timeout: 10_000 });
      await expect(page.locator('h1.ache1')).toHaveText('LIGNINA');
    });
  }

  // CP-01.3 · CA3 (MLIG-34)
  for (const origen of ['inicio', 'categorias', 'venta']) {
    test(`CP-01.3 · Registrarse, Ingresar y carrito abren sin 404 (desde ${origen})`, async ({ page }) => {
      if (origen === 'categorias') knownBug('MLIG-103'); // seccion2.html enlaza a "Ingreso.html" (mayúscula)
      const destinos = [
        { link: (p) => p.locator('#registro'), url: /registro\.html$/ },
        { link: (p) => p.locator('#ingreso'), url: /ingreso\.html$/i },
        { link: (p) => p.getByRole('link', { name: /carro/i }), url: /carro_de_compras\.html$/ },
      ];
      for (const d of destinos) {
        await page.goto(PAGINAS[origen]);
        const status = await clickAndGetStatus(page, d.link(page));
        expect(status, `${d.url} desde ${origen}`).toBe(200);
        await expect(page).toHaveURL(d.url, { timeout: 10_000 });
      }
    });
  }
});

test.describe('US-02 · Ir a una categoría desde la página de inicio (MLIG-2)', () => {
  // CP-02.1 · CA1 (MLIG-35)
  for (const cat of CATEGORIAS) {
    test(`CP-02.1 · la tarjeta "${cat.nombre}" abre Categorías ubicada en ${cat.nombre}`, async ({ page }) => {
      await page.goto(PAGINAS.inicio);
      await clickCentered(page.locator('#seccioncatego').getByRole('link', { name: cat.nombre }));
      await expect(page).toHaveURL(new RegExp(`seccion2\\.html#${cat.ancla}$`), { timeout: 10_000 });
      await expect(page.locator(`#${cat.ancla}`)).toBeInViewport();
    });
  }

  // CP-02.2 · CA2 (MLIG-36)
  const bloques = [
    ['seccionnosotros', /seccion1\.html$/],
    ['seccioncatego', /seccion2\.html$/],
    ['seccionventa', /seccion3\.html$/],
    ['seccionconsejos', /seccion4\.html$/],
    ['seccioncomenta', /seccion5\.html$/],
  ];
  for (const [id, url] of bloques) {
    test(`CP-02.2 · "Ver más" del bloque #${id} abre su sección completa`, async ({ page }) => {
      // Firefox puede mover la página mientras cargan las imágenes y el clic cae en otro lado:
      // se espera la carga completa y, si no navega, se reintenta todo el gesto.
      await expect(async () => {
        await page.goto(PAGINAS.inicio, { waitUntil: 'load' });
        await clickCentered(page.locator(`#${id}`).getByRole('link', { name: 'Ver más' }));
        await expect(page).toHaveURL(url, { timeout: 4_000 });
      }).toPass({ timeout: 25_000 });
    });
  }
});
