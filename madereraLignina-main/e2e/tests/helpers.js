const fs = require('fs');
const path = require('path');
const base = require('@playwright/test');
const JQUERY = path.join(__dirname, '..', 'node_modules', 'jquery', 'dist', 'jquery.min.js');
const FLECHA_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="#8a5a2b"/></svg>';
const { expect } = base;

/**
 * `test` con la red aislada: el sitio pide fuentes, jQuery y FontAwesome a CDNs externos.
 * Se bloquean para que las pruebas sean rápidas y no dependan de internet.
 */
const test = base.extend({
  page: async ({ page, baseURL }, use) => {
    const origin = new URL(baseURL).origin;
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (url.startsWith(origin) || url.startsWith('data:') || url.startsWith('blob:')) return route.continue();
      // jQuery (lo usa el botón "volver arriba") se sirve desde node_modules en vez del CDN de Google.
      if (url.includes('/jquery/3.6.0/jquery.min.js') && fs.existsSync(JQUERY)) return route.fulfill({ path: JQUERY, contentType: 'text/javascript' });
      // Imagen de la flecha del botón (alojada en googleusercontent): se reemplaza por un cuadro de 48 px.
      if (url.includes('googleusercontent.com')) return route.fulfill({ contentType: 'image/svg+xml', body: FLECHA_SVG });
      return route.abort();
    });
    // El sitio tiene animaciones CSS que tardan ~5 s en "estabilizarse" y Playwright espera
    // a que el elemento deje de moverse antes de hacer clic. Se desactivan para ir rápido.
    await page.addInitScript(() => {
      document.addEventListener('DOMContentLoaded', () => {
        const s = document.createElement('style');
        s.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}';
        document.head.appendChild(s);
      });
    });
    await use(page);
  },
});

/**
 * Marca un caso como FALLO CONOCIDO ligado a un bug de Jira.
 * - Mientras el bug exista: el test "falla como se espera" y la suite queda en verde.
 * - Cuando corrijan el código: el test pasa y Playwright lo reporta como fallo
 *   ("expected to fail but passed") para avisar que hay que quitar esta marca.
 */
function knownBug(...bugs) {
  // SHOW_BUGS=1 desactiva la marca para ver el error real de cada bug (útil al reportarlos).
  if (process.env.SHOW_BUGS) return;
  test.fail(true, `Bug conocido: ${bugs.join(', ')}`);
}

/**
 * Centra el elemento antes de hacer clic. La barra superior es fija y tapa los enlaces
 * cuando Playwright los deja pegados al borde; sin esto cada clic tarda ~5 s en reintentar.
 */
async function clickCentered(locator) {
  await locator.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await locator.click();
}

/** ¿Dos nombres de producto se refieren a lo mismo? (ignora tildes, espacios y género/plural) */
const mismoProducto = (a, b) => {
  const A = norm(a).replace(/\s/g, ''), B = norm(b).replace(/\s/g, '');
  return !!A && !!B && (A.includes(B.slice(0, 5)) || B.includes(A.slice(0, 5)));
};

/** Pasa a texto sin tildes y en minúsculas, para comparar nombres. */
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/** Hace clic y devuelve el código HTTP de la navegación resultante. */
async function clickAndGetStatus(page, locator) {
  const [response] = await Promise.all([
    page.waitForEvent('response', (r) => r.request().isNavigationRequest() && r.frame() === page.mainFrame()),
    clickCentered(locator),
  ]);
  await page.waitForLoadState('domcontentloaded');
  return response.status();
}

/** Las 7 categorías con su ancla y prefijo de id de producto en seccion2. */
const CATEGORIAS = [
  { nombre: 'Dormitorio', ancla: 'dormitorio', prefijo: 'd1' },
  { nombre: 'Baño', ancla: 'bano', prefijo: 'd2' },
  { nombre: 'Living', ancla: 'living', prefijo: 'd3' },
  { nombre: 'Exterior', ancla: 'exterior', prefijo: 'd4' },
  { nombre: 'Deco', ancla: 'deco', prefijo: 'd5' },
  { nombre: 'Fraccionado', ancla: 'fraccionado', prefijo: 'd6' },
  { nombre: 'Rústica', ancla: 'rustica', prefijo: 'd7' },
];

const MENU = [
  { nombre: 'Nosotros', url: /pages-01\/seccion1\.html$/ },
  { nombre: 'Categorías', url: /pages-01\/seccion2\.html$/ },
  { nombre: 'Venta de la semana', url: /pages-01\/seccion3\.html$/ },
  { nombre: 'Consejos', url: /pages-01\/seccion4\.html$/ },
  { nombre: 'Comentarios', url: /pages-01\/seccion5\.html$/ },
];

const PAGINAS = {
  inicio: '/index.html',
  nosotros: '/pages-01/seccion1.html',
  categorias: '/pages-01/seccion2.html',
  venta: '/pages-01/seccion3.html',
  consejos: '/pages-01/seccion4.html',
  comentarios: '/pages-01/seccion5.html',
  registro: '/pages-01/registro.html',
  ingreso: '/pages-01/ingreso.html',
  carro: '/pages-01/carro_de_compras.html',
};

/** Formato de precio esperado: "$ 15.000" */
const PRECIO_OK = /^\$ \d{1,3}(\.\d{3})*$/;

module.exports = { test, expect, knownBug, norm, mismoProducto, clickCentered, clickAndGetStatus, CATEGORIAS, MENU, PAGINAS, PRECIO_OK };
