madereraLignina

E-commerce dedicado a la venta de productos de madera de elaboración propia. E-commerce dedicated to the sale of handmade wood products.

Sitio web estático (HTML, Bootstrap 5.1.1 y SCSS) con una suite de pruebas automatizadas de extremo a extremo (Playwright) que cubre las historias de usuario US-01 a US-15 del proyecto Jira MLIG.

Contenido del repositorio

Todo el proyecto está dentro de la carpeta madereraLignina-main/:

Carpeta / archivo	Qué contiene
index.html	Página de inicio
pages-01/	Resto de páginas: secciones 1 a 5, ingreso, registro y carrito de compras
scss/	Código fuente de los estilos (contenido.scss y parciales)
CSS/contenidocss.css	Estilos compilados a partir de scss/
bootstrap-5.1.1-dist/	Bootstrap compilado
img/, audio/, video/	Imágenes, audio y video del sitio
e2e/	Pruebas automatizadas con Playwright (ver su propio README)
Cómo ver el sitio

Necesitas Node.js. No hace falta compilar nada:

bash
cd madereraLignina-main/e2e
npm install
node server.js

Abre http://localhost:4173. También puedes abrir madereraLignina-main/index.html directamente en el navegador.

Cómo correr las pruebas
bash
cd madereraLignina-main/e2e
npm install
npx playwright install chromium firefox   # solo la primera vez
npm test                                   # Chrome + Firefox
npm run report                             # abre el reporte HTML

Los casos que corresponden a bugs conocidos (MLIG-103 a MLIG-124) están marcados con knownBug y fallan a propósito mientras el bug exista. Más detalles en madereraLignina-main/e2e/README.md.
