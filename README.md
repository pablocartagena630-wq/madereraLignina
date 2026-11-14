# madereraLignina

JIRA: https://amigo-team-dauluhlg.atlassian.net/jira/software/projects/MLIG/list?jql=project+%3D+MLIG+ORDER+BY+cf%5B10019%5D+ASC&atlOrigin=eyJpIjoiMDk2ZWUxNTQ3Y2JmNDRmYjkzNzVkN2Y0ZTY3NzgyZmMiLCJwIjoiaiJ9

E-commerce dedicado a la venta de productos de madera de elaboración propia.

Sitio web estático (HTML, Bootstrap 5.1.1 y SCSS) con una suite de pruebas automatizadas de extremo a extremo (Playwright) que cubre las historias de usuario US-01 a US-20 (los 61 casos de prueba) del proyecto Jira **MLIG**.

## Qué puedes hacer en el sitio

- Navegar entre las secciones y ir a una categoría desde el inicio.
- Buscar productos por nombre y ver los productos de cada categoría.
- Comprar un producto desde su detalle y ver el carrito de compras.
- Ver la venta de la semana.
- Registrarte como cliente e ingresar con tu cuenta.
- Consultar consejos con audio y video, y dejar un comentario.
- Suscribirte al newsletter.
- Consultar los datos de contacto y la ubicación en el mapa.
- Usar el sitio desde el celular y con lector de pantalla.

## Tecnologías

| Parte | Tecnología |
|---|---|
| Maquetación | HTML5 |
| Estilos | Bootstrap 5.1.1 y SCSS |
| Pruebas | Playwright 1.63 (Chromium y Firefox) |
| Servidor local | Node.js (`e2e/server.js`) |
| Gestión de pruebas | Jira, proyecto MLIG |

## Contenido del repositorio

| Carpeta / archivo | Qué contiene |
|---|---|
| `madereraLignina-main/index.html` | Página de inicio |
| `madereraLignina-main/pages-01/` | Resto de páginas: secciones 1 a 5, ingreso, registro y carrito de compras |
| `madereraLignina-main/scss/` y `CSS/` | Estilos (fuente SCSS y CSS compilado) |
| `madereraLignina-main/img/`, `audio/`, `video/` | Imágenes, audio y video del sitio |
| `madereraLignina-main/e2e/` | Pruebas automatizadas con Playwright ([ver su README](madereraLignina-main/e2e/README.md)) |
| `PLAN-DE-PRUEBAS.md`, `CAMBIOS-PLAN.md`, `MATRIZ-TRAZABILIDAD.md`, `reporte-ejecucion/` | Entregables (ver abajo) |

## Requisitos

- **Node.js 20 o más nuevo** (incluye `npm`). Descárgalo de https://nodejs.org. Para revisar la versión: `node -v`
- **Git**, para clonar el repositorio. Descárgalo de https://git-scm.com
- Conexión a internet la primera vez, para descargar las dependencias y los navegadores de prueba.

## Instalación (solo la primera vez)

Abre una terminal y escribe:

```bash
git clone https://github.com/pablocartagena630-wq/madereraLignina.git
cd madereraLignina/madereraLignina-main/e2e
npm install
npx playwright install chromium firefox
```

Todos los comandos de abajo se escriben dentro de esa misma carpeta: `madereraLignina-main/e2e`.

## Cómo ver el sitio

```bash
node server.js
```

Abre http://localhost:4173 en el navegador. Para apagar el servidor, presiona `Ctrl + C` en la terminal.

También puedes abrir `madereraLignina-main/index.html` directamente en el navegador, sin servidor.

## Cómo correr las pruebas

No hace falta prender el servidor: las pruebas lo prenden solas.

| Comando | Qué hace |
|---|---|
| `npm test` | Corre todas las pruebas en Chrome y Firefox (266 pruebas: 133 por navegador) |
| `npm run test:chrome` | Corre las pruebas solo en Chrome (133 pruebas) |
| `npm run test:ui` | Abre la ventana de Playwright para ver y correr las pruebas una por una |
| `npm run report` | Abre el reporte HTML de la última ejecución |

Resultado esperado: todas las pruebas terminan en verde (`266 passed`).

Los casos que corresponden a bugs conocidos (MLIG-103 a MLIG-128) están marcados con `knownBug`: fallan a propósito mientras el bug exista, y por eso cuentan como correctos. En la terminal se ven con una ✘, pero al final salen como pasadas. Más detalles en [madereraLignina-main/e2e/README.md](madereraLignina-main/e2e/README.md).

## Entregables

| Entregable | Dónde está |
|---|---|
| Plan de pruebas corregido | [PLAN-DE-PRUEBAS.md](PLAN-DE-PRUEBAS.md) (copia del plan en Jira, proyecto MLIG) |
| Tabla de cambios del plan | [CAMBIOS-PLAN.md](CAMBIOS-PLAN.md) |
| Matriz de trazabilidad | [MATRIZ-TRAZABILIDAD.md](MATRIZ-TRAZABILIDAD.md) |
| Reporte de ejecución y video | carpeta [reporte-ejecucion/](reporte-ejecucion/) |
| Reporte de defectos | Jira, proyecto MLIG: bugs MLIG-103 a MLIG-128, cada uno con pasos, resultado esperado y obtenido, captura y enlace a su historia |
