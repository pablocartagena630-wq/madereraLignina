const { test, expect, knownBug, PAGINAS } = require('./helpers');

test.describe('US-03 · Buscar productos por nombre (MLIG-3)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGINAS.inicio);
  });

  const buscar = async (page, texto) => {
    await page.getByPlaceholder('Buscar').fill(texto);
    await page.locator('#navbarra button[type="submit"]').click();
  };

  // CP-03.1 · CA1 (MLIG-37)
  test('CP-03.1 · buscar "Mesada" muestra productos que contienen ese texto', async ({ page }) => {
    knownBug('MLIG-104');
    await buscar(page, 'Mesada');
    await expect(page.getByText(/mesada/i).first()).toBeVisible();
  });

  // CP-03.2 · CA2 (MLIG-38)
  for (const [nombre, valor] of [['vacío', ''], ['solo espacios', '   ']]) {
    test(`CP-03.2 · búsqueda ${nombre} pide escribir un término`, async ({ page }) => {
      knownBug('MLIG-104');
      let dialogo = '';
      page.on('dialog', async (d) => { dialogo = d.message(); await d.dismiss(); });
      await buscar(page, valor);
      const aviso = page.getByText(/escrib(a|e|ir).*(t[eé]rmino|buscar)|ingres(a|e).*(t[eé]rmino|buscar)/i);
      const hayAviso = (await aviso.count()) > 0 || dialogo !== '';
      expect(hayAviso, 'debe aparecer un aviso (texto en pantalla o diálogo)').toBe(true);
    });
  }

  // CP-03.3 · CA3 (MLIG-39)
  test('CP-03.3 · buscar "Televisor" muestra "No se encontraron productos"', async ({ page }) => {
    knownBug('MLIG-104');
    await buscar(page, 'Televisor');
    await expect(page.getByText('No se encontraron productos')).toBeVisible();
  });
});
