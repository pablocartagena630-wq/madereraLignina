const { test, expect, knownBug, mismoProducto, CATEGORIAS, PAGINAS, PRECIO_OK } = require('./helpers');

/** Abre el detalle de un producto de seccion2 por su id de contenedor (ej. "d12"). */
const abrirDetalle = async (page, id) => {
  await page.locator(`#${id} button[data-bs-toggle="modal"]`).click();
  const modal = page.locator(`#${id}Modal`);
  await expect(modal).toBeVisible();
  return modal;
};

test.describe('US-04 · Ver los productos de cada categoría (MLIG-4)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGINAS.categorias);
  });

  // CP-04.1 · CA1 (MLIG-40)
  test('CP-04.1 · 7 categorías, 28 productos y ninguna imagen rota', async ({ page }) => {
    for (const c of CATEGORIAS) await expect(page.locator(`#${c.ancla}`)).toBeAttached();
    await expect(page.locator('#mains2 button[data-bs-target$="Modal"]')).toHaveCount(28);

    await page.waitForLoadState('load');
    const rotas = await page.locator('#mains2 img').evaluateAll((imgs) =>
      imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute('src')));
    expect(rotas, `imágenes rotas: ${rotas.join(', ')}`).toEqual([]);
  });

  // CP-04.2 · CA2 (MLIG-41)
  test('CP-04.2 · el detalle del Escritorio muestra nombre, imagen, descripción y precio', async ({ page }) => {
    const modal = await abrirDetalle(page, 'd11');
    await expect(modal.locator('.modal-title')).toHaveText('Escritorio');
    await expect(modal.locator('img')).toBeVisible();
    await expect(modal.locator('.modal-body p').first()).not.toBeEmpty();
    await expect(modal.getByText(/Precio:/)).toContainText(/\$\s?4\.?200/);
  });

  // CP-04.3 · CA3 (MLIG-42)
  test('CP-04.3 · el título de cada detalle corresponde al producto de su botón e imagen', async ({ page }) => {
    knownBug('MLIG-105');
    const filas = await page.locator('#mains2 button[data-bs-target$="Modal"]').evaluateAll((botones) =>
      botones.map((b) => {
        const modal = document.querySelector(b.dataset.bsTarget);
        return {
          modal: b.dataset.bsTarget,
          boton: b.textContent.trim(),
          titulo: modal.querySelector('.modal-title').textContent.trim(),
          alt: b.closest('[id^="d"]').querySelector('img').getAttribute('alt') || '',
        };
      }));
    const mal = filas.filter((f) => !mismoProducto(f.boton, f.titulo));
    expect(mal.map((f) => `${f.modal}: botón "${f.boton}" ≠ título "${f.titulo}"`)).toEqual([]);
  });

  // CP-04.4 · CA4 (MLIG-43)
  test('CP-04.4 · todos los precios usan el formato "$ 15.000"', async ({ page }) => {
    knownBug('MLIG-106');
    const precios = await page.locator('#mains2 .modal-body strong').allTextContents();
    expect(precios.length).toBeGreaterThan(0);
    const mal = precios.map((p) => p.trim()).filter((p) => !PRECIO_OK.test(p));
    expect(mal, 'precios con formato distinto').toEqual([]);
  });

  test('CP-04.4 · el precio de Venta de la semana usa el mismo formato', async ({ page }) => {
    knownBug('MLIG-106');
    await page.goto(PAGINAS.venta);
    const precios = await page.locator('td.columna3').allTextContents();
    const mal = precios.map((p) => p.trim()).filter((p) => !PRECIO_OK.test(p));
    expect(mal, 'precios con formato distinto').toEqual([]);
  });
});

test.describe('US-05 · Comprar un producto desde su detalle (MLIG-5)', () => {
  const confirmacion = (page) => page.getByText(/agregad[oa]|a[ñn]adid[oa]|al carrito/i);

  // CP-05.1 · CA1 (MLIG-44)
  test('CP-05.1 · "Comprar" en Categorías agrega la Mesada y muestra confirmación', async ({ page }) => {
    knownBug('MLIG-107');
    await page.goto(PAGINAS.categorias);
    const modal = await abrirDetalle(page, 'd12');
    await modal.getByRole('button', { name: 'Comprar' }).click();
    await expect(confirmacion(page)).toBeVisible();
  });

  // CP-05.2 · CA2 (MLIG-45)
  test('CP-05.2 · "Comprar" en Ventas antiguas agrega la Silla de caña y muestra confirmación', async ({ page }) => {
    knownBug('MLIG-108');
    await page.goto(PAGINAS.venta);
    await page.locator('#ventaA #linkcomprar a').click();
    await expect(confirmacion(page)).toBeVisible();
  });

  // CP-05.3 · CA3 (MLIG-46)
  test('CP-05.3 · cerrar el detalle (Cerrar y X) no agrega nada al carrito', async ({ page }) => {
    await page.goto(PAGINAS.categorias);
    for (const via of ['Cerrar', 'X']) {
      const modal = await abrirDetalle(page, 'd21'); // Lavabo
      if (via === 'Cerrar') await modal.getByRole('button', { name: 'Cerrar' }).click();
      else await modal.locator('.btn-close').click();
      await expect(modal).toBeHidden();
    }
    await page.getByRole('link', { name: /carro/i }).click();
    await expect(page).toHaveURL(/carro_de_compras\.html$/);
    await expect(page.getByText('Lavabo')).toHaveCount(0);
  });
});

test.describe('US-06 · Ver la venta de la semana (MLIG-6)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGINAS.venta);
  });

  // CP-06.1 · CA1 (MLIG-47)
  test('CP-06.1 · el producto destacado muestra nombre, imagen, tabla y precio', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Banco de madera' }).first()).toBeVisible();
    await expect(page.locator('#imgs3 img')).toBeVisible();
    const tabla = page.locator('table').first();
    await expect(tabla.getByRole('columnheader')).toHaveText(['Producto', 'Especificaciones', 'Costo', 'Beneficios', 'Recomendaciones']);
    await expect(tabla.locator('td.columna3')).toContainText(/\$\s?1\.?550/);
  });

  // CP-06.2 · CA2 (MLIG-48)
  const antiguas = [
    ['ventaA', 'Silla de caña', /2\.?350/],
    ['ventaB', 'Tabla para picar', /1\.?100/],
    ['ventaC', 'Silla de troncos', /1\.?900/],
    ['ventaD', 'Mesada de Fresno', /3\.?500/], // el plan de pruebas lista 3; el sitio tiene 4
  ];
  for (const [id, nombre, precio] of antiguas) {
    test(`CP-06.2 · "${nombre}" muestra nombre, imagen y precio`, async ({ page }) => {
      const bloque = page.locator(`#${id}`);
      await expect(bloque.getByRole('heading', { name: nombre })).toBeVisible();
      await expect(bloque.locator('img').first()).toBeVisible();
      await expect(bloque.locator('td.columna3')).toContainText(precio);
    });

    test(`CP-06.2 · "Comprar" de "${nombre}" no apunta a "#"`, async ({ page }) => {
      knownBug('MLIG-108');
      const href = await page.locator(`#${id} #linkcomprar a`).getAttribute('href');
      expect(href, 'el enlace Comprar debe ejecutar una compra').not.toBe('#');
    });
  }
});
