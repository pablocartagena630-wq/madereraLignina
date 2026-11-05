const { test, expect, knownBug, clickCentered, PAGINAS } = require('./helpers');

test.describe('US-10 · Consultar consejos y contenido multimedia (MLIG-10)', () => {
  // CP-10.1 · CA1
  test('CP-10.1 · el video tiene controles y se puede reproducir/pausar', async ({ page, browserName }) => {
    await page.goto(PAGINAS.inicio);
    const video = page.locator('video');
    await expect(video).toHaveAttribute('controls', '');
    const soporta = await video.evaluate((v) => v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') !== '');
    test.skip(!soporta, `${browserName} de Playwright no incluye el códec H.264/AAC; ejecutar con Chrome real (channel: "chrome")`);

    await video.scrollIntoViewIfNeeded();
    await video.evaluate((v) => { v.muted = true; return v.play(); });
    await expect.poll(() => video.evaluate((v) => v.currentTime), { timeout: 8000 }).toBeGreaterThan(0.5);
    await video.evaluate((v) => v.pause());
    expect(await video.evaluate((v) => v.paused)).toBe(true);
    expect(await video.evaluate((v) => v.duration)).toBeGreaterThan(100);
  });

  // CP-10.2 · CA2
  test('CP-10.2 · el audio se reproduce completo hasta el final', async ({ page }) => {
    await page.goto(PAGINAS.inicio);
    const audio = page.locator('audio');
    await expect(audio).toHaveAttribute('controls', '');
    await expect.poll(() => audio.evaluate((a) => a.readyState), { timeout: 10000 }).toBeGreaterThanOrEqual(1);
    const duracion = await audio.evaluate((a) => a.duration);
    expect(duracion).toBeGreaterThan(100);
    // se salta a los últimos 2 s para no esperar los 2 min 28 s completos
    await audio.evaluate((a) => { a.muted = true; a.currentTime = a.duration - 2; return a.play(); });
    await expect.poll(() => audio.evaluate((a) => a.ended), { timeout: 10000 }).toBe(true);
    expect(await audio.evaluate((a) => !!a.error)).toBe(false);
  });

  // CP-10.3 · CA3
  test('CP-10.3 · la página Consejos muestra 4 consejos con imagen y texto', async ({ page }) => {
    await page.goto(PAGINAS.consejos);
    const imgs = page.locator('main img[src*="seccion_4"]');
    await expect(imgs).toHaveCount(4);
    await page.waitForLoadState('load');
    const rotas = await imgs.evaluateAll((l) => l.filter((i) => i.naturalWidth === 0).length);
    expect(rotas).toBe(0);
    const textos = await page.locator('main p').allTextContents();
    expect(textos.filter((t) => t.trim().length > 50).length).toBeGreaterThanOrEqual(4);
  });
});

test.describe('US-11 · Dejar un comentario (MLIG-11)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGINAS.comentarios);
  });
  const enviar = (page) => page.locator('main').getByRole('button').last().click();

  // CP-11.1 · CA1
  test('CP-11.1 · un comentario válido se publica y muestra confirmación', async ({ page }) => {
    knownBug('MLIG-116');
    const texto = 'Excelente calidad en la mesa que compré.';
    await page.getByLabel('Escribe tu comentario aquí. Gracias!').fill(texto);
    await enviar(page);
    await expect(page.getByText(/gracias por tu comentario|comentario (publicado|enviado)/i)).toBeVisible();
    await expect(page.getByText(texto)).toBeVisible();
  });

  // CP-11.2 · CA2
  for (const [nombre, valor] of [['vacío', ''], ['solo espacios', '     ']]) {
    test(`CP-11.2 · comentario ${nombre} no se publica y muestra aviso`, async ({ page }) => {
      knownBug('MLIG-116');
      let dialogo = '';
      page.on('dialog', async (d) => { dialogo = d.message(); await d.dismiss(); });
      await page.getByLabel('Escribe tu comentario aquí. Gracias!').fill(valor);
      const antes = await page.locator('main').innerText();
      await enviar(page);
      await page.waitForTimeout(500);
      const despues = await page.locator('main').innerText();
      const campoInvalido = await page.locator('textarea').evaluate((t) => !t.validity.valid);
      // Debe aparecer un aviso nuevo en pantalla, un diálogo o validación nativa del campo.
      expect(despues !== antes || dialogo !== '' || campoInvalido, 'no apareció ningún aviso').toBe(true);
    });
  }

  // CP-11.3 · CA3
  test('CP-11.3 · el botón del formulario dice "Enviar"', async ({ page }) => {
    knownBug('MLIG-117');
    await expect(page.locator('main').getByRole('button', { name: 'Enviar', exact: true })).toBeVisible();
  });
});

test.describe('US-12 · Suscribirme al newsletter (MLIG-12)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGINAS.inicio);
  });
  const suscribir = async (page, correo) => {
    await page.locator('#divnewsletter input[type="email"]').fill(correo);
    await clickCentered(page.locator('#divnewsletter button'));
  };

  // CP-12.1 · CA1
  test('CP-12.1 · un correo válido muestra suscripción exitosa', async ({ page }) => {
    knownBug('MLIG-118');
    await suscribir(page, 'juan@correo.com');
    await expect(page.getByText(/suscripci[oó]n exitosa|te suscribiste|gracias por suscribirte/i)).toBeVisible();
  });

  // CP-12.2 · CA2
  for (const correo of ['juan@', 'juancorreo.com']) {
    test(`CP-12.2 · el correo inválido "${correo}" se rechaza con mensaje claro`, async ({ page }) => {
      knownBug('MLIG-118');
      await suscribir(page, correo);
      await expect(page.getByText(/correo (inv[aá]lido|no v[aá]lido)|email (inv[aá]lido|no v[aá]lido)|ingresa un (correo|email) v[aá]lido/i)).toBeVisible();
    });
  }

  // CP-12.3 · CA3
  test('CP-12.3 · correo vacío no suscribe y muestra aviso', async ({ page }) => {
    knownBug('MLIG-118');
    await suscribir(page, '');
    await expect(page.getByText(/ingresa (un|tu) (correo|email)|(correo|email) (requerido|obligatorio)/i)).toBeVisible();
  });
});

test.describe('US-13 · Consultar contacto y atención al cliente (MLIG-13)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGINAS.inicio);
  });

  // CP-13.1 · CA1
  for (const nombre of ['Envíos', 'Plazos', 'Legales', 'Pago']) {
    test(`CP-13.1 · "${nombre}" abre su información (no apunta a "#")`, async ({ page }) => {
      knownBug('MLIG-119');
      const href = await page.locator('#divatencion').getByRole('link', { name: nombre }).getAttribute('href');
      expect(href).not.toBe('#');
    });
  }

  // CP-13.2 · CA2
  for (const red of ['facebook', 'whatsapp', 'instagram']) {
    test(`CP-13.2 · el ícono de ${red} abre la cuenta de la tienda en pestaña nueva`, async ({ page }) => {
      knownBug('MLIG-120');
      const link = page.locator(`#divredes a[href*="${red}"]`);
      await expect(link).toHaveAttribute('target', '_blank');
      const { pathname } = new URL(await link.getAttribute('href'));
      expect(pathname.replace(/\//g, ''), 'debe apuntar a la cuenta, no a la página principal de la red').not.toBe('');
    });
  }

  // CP-13.3 · CA3 (solo verificable por código sin internet; confirmar visualmente en un navegador con red)
  test('CP-13.3 · el mapa es un embebido de Google Maps con la ubicación de la tienda', async ({ page }) => {
    const mapa = page.locator('#divmapa iframe');
    await expect(mapa).toHaveAttribute('src', /google\.com\/maps\/embed/);
    await expect(mapa).toHaveAttribute('src', /RN40%201042/);
    await expect(mapa).toHaveAttribute('allowfullscreen', '');
  });
});
