const { test, expect, knownBug, clickCentered, PAGINAS } = require('./helpers');

/** Posición (0, 1, 2…) de la imagen activa de un carrusel. */
const activo = (carrusel) =>
  carrusel.evaluate((el) => [...el.querySelectorAll('.carousel-item')].findIndex((i) => i.classList.contains('active')));

test.describe('US-16 · Ver la sección Nosotros (MLIG-78)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGINAS.nosotros, { waitUntil: 'load' });
    // se detiene el avance automático para que no cambie de imagen en medio de la prueba
    await page.evaluate(() => document.querySelectorAll('.carousel').forEach((c) => bootstrap.Carousel.getOrCreateInstance(c).pause()));
  });

  // CP-16.1 · CA1
  test('CP-16.1 · hay 6 carruseles, cada uno con su primera imagen visible', async ({ page }) => {
    const carruseles = page.locator('.carousel');
    await expect(carruseles).toHaveCount(6);
    await page.waitForLoadState('load');
    for (let i = 0; i < 6; i++) {
      const img = carruseles.nth(i).locator('.carousel-item.active img');
      await expect(img, `carrusel ${i + 1}`).toBeVisible();
      expect(await img.evaluate((e) => e.naturalWidth), `imagen rota en carrusel ${i + 1}`).toBeGreaterThan(0);
    }
  });

  // CP-16.2 · CA2
  for (let n = 0; n < 6; n++) {
    test(`CP-16.2 · carrusel ${n + 1}: siguiente avanza 2 → 3 → 1 y anterior retrocede`, async ({ page }) => {
      const c = page.locator('.carousel').nth(n);
      const siguiente = c.locator('.carousel-control-next');
      const anterior = c.locator('.carousel-control-prev');
      // Cada gesto se reintenta si el clic cae mientras la página se reacomoda (pasa en Firefox).
      // El resultado se mide relativo al estado previo, así un reintento no desfasa la secuencia.
      const mover = async (boton, paso) => {
        await expect(async () => {
          const antes = await activo(c);
          await clickCentered(boton);
          await expect.poll(() => activo(c), { timeout: 1_500 }).toBe((antes + paso + 3) % 3);
        }).toPass({ timeout: 15_000 });
        await expect(c.locator('.carousel-item.active img')).toBeVisible();
      };
      expect(await activo(c)).toBe(0);
      await mover(siguiente, 1);
      expect(await activo(c)).toBe(1);
      await mover(siguiente, 1);
      expect(await activo(c)).toBe(2);
      await mover(siguiente, 1);
      expect(await activo(c)).toBe(0);
      await mover(anterior, -1);
      expect(await activo(c)).toBe(2);
    });
  }

  // CP-16.3 · CA3
  test('CP-16.3 · los indicadores muestran la imagen elegida y marcan el indicador activo', async ({ page }) => {
    const c = page.locator('.carousel').first();
    const indicadores = c.locator('.carousel-indicators button');
    // Firefox a veces ignora el primer clic mientras la página termina de cargar: se repite el clic
    // (un usuario haría lo mismo) hasta que el carrusel muestre la imagen elegida.
    const elegir = (i) =>
      expect(async () => {
        await clickCentered(indicadores.nth(i));
        await expect.poll(() => activo(c), { timeout: 1500 }).toBe(i);
      }).toPass({ timeout: 15_000 });

    await elegir(2); // Slide 3
    await expect(indicadores.nth(2)).toHaveClass(/active/);
    await elegir(0); // Slide 1
    await expect(indicadores.nth(0)).toHaveClass(/active/);
    await expect(indicadores.nth(2)).not.toHaveClass(/active/);
  });
});

test.describe('US-17 · Ampliar las imágenes de la página de inicio (MLIG-79)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGINAS.inicio, { waitUntil: 'load' });
  });
  // "La página queda en el mismo punto": no debe saltar (p. ej. al inicio por el enlace "#!").
  // Se tolera un pequeño reajuste (<= 50 px): al cerrar, el navegador devuelve el foco al enlace.
  const posicion = (page) => page.evaluate(() => window.scrollY);
  const mismoPunto = async (page, antes) => {
    const despues = await posicion(page);
    expect(antes, 'la prueba debe partir con la página desplazada').toBeGreaterThan(0);
    expect(Math.abs(despues - antes), `scrollY pasó de ${antes} a ${despues}`).toBeLessThanOrEqual(50);
  };
  const abrir = async (page) => {
    await clickCentered(page.locator('#estancia'));
    const modal = page.locator('#estanciamodal');
    await expect(modal).toBeVisible();
    // Esc y el clic de fondo solo funcionan cuando la ventana terminó de abrirse y tiene el foco.
    await expect(modal).toHaveClass(/show/);
    await expect(modal).toBeFocused();
    return modal;
  };

  // CP-17.1 · CA1
  test('CP-17.1 · al presionar la imagen de la estancia se abre ampliada', async ({ page }) => {
    const miniatura = (await page.locator('#estancia').boundingBox()).width;
    const modal = await abrir(page);
    const ampliada = (await modal.locator('img').boundingBox()).width;
    expect(ampliada, 'la imagen ampliada debe ser más grande que la miniatura').toBeGreaterThan(miniatura);
  });

  // CP-17.2 · CA2
  test('CP-17.2 · se cierra al presionar fuera de la imagen y la página no se mueve', async ({ page }) => {
    const modal = await abrir(page);
    const antes = await posicion(page);
    await modal.click({ position: { x: 5, y: 5 } });
    await expect(modal).toBeHidden();
    await mismoPunto(page, antes);
  });

  test('CP-17.2 · se cierra con la tecla Esc y la página no se mueve', async ({ page }) => {
    const modal = await abrir(page);
    const antes = await posicion(page);
    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
    await mismoPunto(page, antes);
  });

  // CP-17.3 · CA3
  test('CP-17.3 · la ventana ampliada tiene un botón visible para cerrar', async ({ page }) => {
    knownBug('MLIG-125');
    const modal = await abrir(page);
    await expect(modal.locator('.btn-close, button:has-text("Cerrar"), button:has-text("X")').first()).toBeVisible();
  });
});

test.describe('US-18 · Volver al inicio de la página con el botón flotante (MLIG-80)', () => {
  const boton = (page) => page.locator('#topcontrol');
  const irA = (page, y) => page.evaluate((v) => window.scrollTo(0, v), y);

  test.beforeEach(async ({ page }) => {
    await page.goto(PAGINAS.categorias);
    await page.waitForLoadState('load');
    await expect(boton(page)).toBeAttached();
  });

  // CP-18.1 · CA1
  test('CP-18.1 · sin desplazarse el botón no se muestra', async ({ page }) => {
    await expect(boton(page)).toHaveCSS('opacity', '0');
  });

  // CP-18.2 · CA2
  test('CP-18.2 · a 50 px no aparece y a mitad de página sí', async ({ page }) => {
    await irA(page, 50);
    await page.waitForTimeout(800); // deja pasar el fundido (500 ms)
    await expect(boton(page)).toHaveCSS('opacity', '0');
    const mitad = await page.evaluate(() => Math.floor(document.documentElement.scrollHeight / 2));
    await irA(page, mitad);
    await expect(boton(page)).toHaveCSS('opacity', '1', { timeout: 5_000 });
  });

  // CP-18.3 · CA3
  test('CP-18.3 · al presionarlo la página sube hasta el principio y el botón se oculta', async ({ page }) => {
    await irA(page, await page.evaluate(() => document.documentElement.scrollHeight));
    await expect(boton(page)).toHaveCSS('opacity', '1', { timeout: 5_000 });
    await boton(page).click();
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 8_000 }).toBe(0);
    await expect(boton(page)).toHaveCSS('opacity', '0', { timeout: 5_000 });
  });
});
