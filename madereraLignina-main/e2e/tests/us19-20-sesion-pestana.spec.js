const { test, expect, knownBug, PAGINAS } = require('./helpers');

test.describe('US-19 · Recordar mi sesión al ingresar (MLIG-81)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGINAS.ingreso);
  });

  const ingresar = async (page, { recordar }) => {
    await page.getByLabel('Email').fill('juan@correo.com');
    await page.getByLabel('Contraseña').fill('Clave123');
    if (recordar) await page.getByText('Recordarme').click();
    await page.getByRole('button', { name: 'Ingresar' }).click();
  };
  const sesionIniciada = (page) => page.getByText(/cerrar sesi[oó]n|hola,? juan/i);

  // CP-19.1 · CA1 (bloqueado por MLIG-114: el ingreso nunca inicia sesión)
  test('CP-19.1 · con "Recordarme" marcado la sesión sigue iniciada al volver a la tienda', async ({ page }) => {
    knownBug('MLIG-114');
    await ingresar(page, { recordar: true });
    await page.goto(PAGINAS.inicio);
    await expect(sesionIniciada(page)).toBeVisible();
  });

  // CP-19.2 · CA2 (bloqueado por MLIG-114)
  test('CP-19.2 · sin "Recordarme" la sesión ya no está iniciada al abrir un navegador nuevo', async ({ page, browser }) => {
    knownBug('MLIG-114');
    await ingresar(page, { recordar: false });
    await page.goto(PAGINAS.inicio);
    await expect(sesionIniciada(page), 'primero debe haberse iniciado sesión').toBeVisible();
    // "cerrar el navegador" = abrir un contexto nuevo sin cookies de sesión
    const nuevo = await browser.newContext();
    const otra = await nuevo.newPage();
    await otra.goto(new URL(PAGINAS.inicio, page.url()).href);
    await expect(sesionIniciada(otra)).toHaveCount(0);
    await nuevo.close();
  });

  // CP-19.3 · CA3
  test('CP-19.3 · al presionar el texto "Recordarme" la casilla se marca y se desmarca', async ({ page }) => {
    const casilla = page.locator('input[type="checkbox"]');
    await expect(casilla).not.toBeChecked();
    await page.getByText('Recordarme').click();
    await expect(casilla).toBeChecked();
    await page.getByText('Recordarme').click();
    await expect(casilla).not.toBeChecked();
  });
});

test.describe('US-20 · Identificar la tienda en el navegador (MLIG-82)', () => {
  const TODAS = ['inicio', 'nosotros', 'categorias', 'venta', 'consejos', 'comentarios', 'registro', 'ingreso', 'carro'];

  // CP-20.1 · CA1
  for (const pagina of TODAS) {
    test(`CP-20.1 · el título de ${pagina} tiene el formato "Sección | LIGNINA"`, async ({ page }) => {
      if (pagina === 'inicio') knownBug('MLIG-126'); // dice "LIGNINA | Maderera-Borsari"
      await page.goto(PAGINAS[pagina]);
      expect(await page.title()).toMatch(/^[^|]+ \| LIGNINA$/);
    });
  }

  // CP-20.2 · CA2
  for (const pagina of TODAS) {
    test(`CP-20.2 · ${pagina} declara un favicon y el archivo existe`, async ({ page }) => {
      await page.goto(PAGINAS[pagina]);
      const hrefs = await page.locator('link[rel="icon"]').evaluateAll((l) => l.map((e) => e.href));
      expect(hrefs.length).toBeGreaterThan(0);
      for (const href of hrefs) {
        const r = await page.request.get(href);
        expect(r.status(), href).toBe(200);
      }
    });
  }

  // CP-20.3 · CA3
  for (const pagina of TODAS) {
    test(`CP-20.3 · ${pagina} carga sin recursos con error ni errores de JavaScript`, async ({ page }) => {
      if (pagina === 'categorias') knownBug('MLIG-128'); // cartel.png → 404
      const origen = new URL(page.url() === 'about:blank' ? 'http://localhost:4173' : page.url()).origin;
      const errores = [];
      page.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(origen)) errores.push(`${r.status()} ${r.url()}`); });
      page.on('pageerror', (e) => errores.push(`JS: ${e.message}`));
      await page.goto(PAGINAS[pagina], { waitUntil: 'load' });
      expect(errores).toEqual([]);
    });
  }

  test('CP-20.3 · los íconos declarados en el manifest existen', async ({ page }) => {
    knownBug('MLIG-127'); // el manifest apunta a /android-chrome-*.png en la raíz
    await page.goto(PAGINAS.inicio);
    const manifestUrl = await page.locator('link[rel="manifest"]').evaluate((l) => l.href);
    const manifest = await (await page.request.get(manifestUrl)).json();
    expect(manifest.icons.length).toBeGreaterThan(0);
    for (const icono of manifest.icons) {
      const url = new URL(icono.src, manifestUrl).href;
      expect((await page.request.get(url)).status(), url).toBe(200);
    }
  });
});
