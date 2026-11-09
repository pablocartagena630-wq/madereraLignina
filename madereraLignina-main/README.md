# Pruebas automatizadas · madereraLignina (Jira MLIG)

Suite de **Playwright** que automatiza el plan de pruebas de US-01 a US-20: los 61 casos
(un `test` por caso `CP-xx.y`, con el mismo ID que en Jira).

## Puesta en marcha

Desde esta carpeta `e2e/`:

```bash
npm install
npx playwright install chromium firefox   # una sola vez (descarga los navegadores)
npm test                                    # Chrome + Firefox
npm run test:chrome                         # solo Chromium
npm run report                              # abre el reporte HTML
```

Windows (PowerShell): `npm run test:bugs` usa una variable de entorno estilo Linux; ahí escribe
`$env:SHOW_BUGS=1; npx playwright test`.

El servidor local (`server.js`) se levanta solo en `http://localhost:4173` y sirve la carpeta
superior. Es **sensible a mayúsculas** a propósito, como GitHub Pages, para que el 404 de
`Ingreso.html` (MLIG-103) se detecte también en Windows.

Para probar el sitio ya publicado: `BASE_URL=https://usuario.github.io/madereraLignina npm test`
(en PowerShell: `$env:BASE_URL="https://..."; npm test`).

## Cómo se tratan los bugs conocidos

Los casos que fallaron en la ejecución manual (MLIG-103 … MLIG-128) llevan `knownBug('MLIG-xxx')`:

| Situación | Resultado en la suite |
|---|---|
| El bug sigue existiendo | el test "falla como se espera" → **verde** |
| Corrigieron el código | el test pasa → Playwright lo marca **rojo** ("expected to fail but passed") |

Cuando eso pase, borra la línea `knownBug(...)` de ese test y queda como prueba de regresión normal.

`npm run test:bugs` desactiva esas marcas y muestra el error real de cada bug (útil para
documentarlos o adjuntar evidencia en Jira). Las capturas y trazas quedan en `test-results/`.

## Estructura

| Archivo | Historias |
|---|---|
| `tests/us01-02-navegacion.spec.js` | US-01, US-02 |
| `tests/us03-busqueda.spec.js` | US-03 |
| `tests/us04-06-catalogo.spec.js` | US-04, US-05, US-06 |
| `tests/us07-carrito.spec.js` | US-07 |
| `tests/us08-09-cuenta.spec.js` | US-08, US-09 |
| `tests/us10-13-contenido.spec.js` | US-10, US-11, US-12, US-13 |
| `tests/us14-15-calidad.spec.js` | US-14 (375 px), US-15 (accesibilidad) |
| `tests/us16-18-interfaz.spec.js` | US-16 (carruseles), US-17 (imágenes ampliadas), US-18 (volver arriba) |
| `tests/us19-20-sesion-pestana.spec.js` | US-19 (Recordarme), US-20 (pestaña del navegador) |
| `tests/helpers.js` | fixture de red aislada, `knownBug`, utilidades |

## Notas

- Las pruebas bloquean las peticiones a CDNs externos (fuentes, jQuery, FontAwesome) y desactivan
  animaciones CSS para que sean rápidas y repetibles.
- CP-10.1 (video H.264/AAC): el Chromium de Playwright puede no traer el códec; en ese caso el test se
  **omite** con un aviso. Para ejecutarlo con Chrome real, usa `channel: 'chrome'` en el proyecto.
- CP-13.3 (mapa) solo valida el `iframe` de Google Maps por código; la confirmación visual se hizo a mano (carga, marca la tienda y permite ampliar) y la captura está en Jira (MLIG-71).
- El plan lista 3 "Ventas antiguas", pero el sitio tiene 4 (Mesada de Fresno); se prueban las 4.
