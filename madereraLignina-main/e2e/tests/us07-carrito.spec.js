const { test, expect, knownBug, PAGINAS } = require('./helpers');

const comprar = async (page, id) => {
  await page.goto(PAGINAS.categorias);
  await page.locator(`#${id} button[data-bs-toggle="modal"]`).click();
  await page.locator(`#${id}Modal`).getByRole('button', { name: 'Comprar' }).click();
};
const abrirCarro = async (page) => {
  await page.goto(PAGINAS.carro);
};

test.describe('US-07 · Ver mi carrito de compras (MLIG-7)', () => {
  // CP-07.1 · CA1 (MLIG-49)
  test('CP-07.1 · el carrito muestra nombre, cantidad, precio unitario y subtotal', async ({ page }) => {
    knownBug('MLIG-109');
    await comprar(page, 'd11'); // Escritorio $ 4.200
    await abrirCarro(page);
    const fila = page.getByRole('row').filter({ hasText: 'Escritorio' });
    await expect(fila).toBeVisible();
    await expect(fila).toContainText('1');
    await expect(fila).toContainText('$ 4.200');
  });

  // CP-07.2 · CA2 (MLIG-50)
  test('CP-07.2 · carrito vacío muestra "Tu carrito está vacío" y total $ 0', async ({ page }) => {
    knownBug('MLIG-109');
    await abrirCarro(page);
    await expect(page.getByText('Tu carrito está vacío')).toBeVisible();
    await expect(page.getByText(/Total.*\$\s?0\b/i)).toBeVisible();
  });

  // CP-07.3 · CA3 (MLIG-51)
  test('CP-07.3 · el total es la suma exacta de los subtotales ($ 11.700)', async ({ page }) => {
    knownBug('MLIG-109');
    await comprar(page, 'd11'); // Escritorio  $ 4.200
    await comprar(page, 'd21'); // Lavabo      $ 6.000
    await comprar(page, 'd41'); // Silla ext.  $ 1.500
    await abrirCarro(page);
    await expect(page.getByText(/Total.*\$\s?11\.700/i)).toBeVisible();
  });
});
