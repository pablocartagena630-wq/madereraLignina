madereraLignina

E-commerce dedicado a la venta de productos de madera de elaboración propia. E-commerce dedicated to the sale of handmade wood products.

Sitio web estático (HTML, Bootstrap 5.1.1 y SCSS) con una suite de pruebas automatizadas de extremo a extremo (Playwright) que cubre las historias de usuario US-01 a US-20 (los 61 casos de prueba) del proyecto Jira MLIG.

Qué puedes hacer en el sitio
Navegar entre las secciones y ir a una categoría desde el inicio.
Buscar productos por nombre y ver los productos de cada categoría.
Comprar un producto desde su detalle y ver el carrito de compras.
Ver la venta de la semana.
Registrarte como cliente e ingresar con tu cuenta.
Consultar consejos con audio y video, y dejar un comentario.
Suscribirte al newsletter.
Consultar los datos de contacto y la ubicación en el mapa.
Usar el sitio desde el celular y con lector de pantalla.
Tecnologías
	
Maquetación	HTML5
Estilos	Bootstrap 5.1.1 y SCSS
Pruebas	Playwright (Chromium y Firefox)
Servidor local	Node.js (e2e/server.js)
Gestión de pruebas	Jira, proyecto MLIG
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
git clone https://github.com/pablocartagena630-wq/madereraLignina.git
cd madereraLignina/madereraLignina-main/e2e
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

Los casos que corresponden a bugs conocidos (MLIG-103 a MLIG-128) están marcados con knownBug y fallan a propósito mientras el bug exista. Más detalles en madereraLignina-main/e2e/README.md.
