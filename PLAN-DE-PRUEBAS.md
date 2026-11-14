# Plan de pruebas · madereraLignina (versión corregida)

Copia del plan que está en Jira (proyecto MLIG), versión corregida al 13/11/2026. Los cambios están en `CAMBIOS-PLAN.md`.

## Plan general (MLIG-16)

**Alcance:** se prueban las 20 historias de usuario del sitio madereraLignina (US-01 a US-20): navegación, catálogo, carrito, cuenta (registro, ingreso y sesión), contenido (Nosotros, consejos, comentarios, newsletter, contacto, imágenes) y calidad de uso (móvil, lector de pantalla, pestañas y consola). Queda fuera: pasarela de pago, envío real de correos, rendimiento y seguridad del servidor.

**Entorno:** Google Chrome (última versión estable) y Mozilla Firefox · Windows 11 · computador de escritorio y modo responsive de 375 px (Ctrl + Shift + M) · sitio del repositorio github.com/Boni92/madereraLignina (abierto localmente).

**Estrategia y técnicas:** pruebas funcionales manuales por criterio de aceptación (Dado / Cuando / Entonces); partición de equivalencia (datos válidos e inválidos en formularios); valores límite (campos vacíos, solo espacios, formatos incompletos, desplazamiento de 100 px); transición de estados (carrito vacío → con productos, carruseles, ventanas emergentes, sesión); pruebas de navegación (enlaces rotos, 404); interfaz responsive; accesibilidad básica (texto alternativo, etiquetas, nombres accesibles); revisión de consola y red.

**Criterios de entrada:** historias y criterios de aceptación aprobados; casos de prueba redactados en Jira; sitio disponible en el entorno definido.

**Criterios de salida:** el 100 % de los casos ejecutados con resultado Pasa o Falla registrado; cada caso que falla tiene su bug en Jira enlazado a su tarea y a su historia; todas las tareas del plan en Listo.

**Riesgos y supuestos:**

- El sitio es estático (HTML + Bootstrap) y no tiene backend: registro, ingreso, sesión, carrito, búsqueda, comentarios y newsletter pueden no tener lógica implementada.
- Los casos de sesión (US-09 y US-19) dependen de que el registro (US-08) funcione; si no, quedan bloqueados.
- Diferencias entre servidor local y publicado (rutas con mayúsculas, archivos multimedia pesados).
- Se supone que los criterios de aceptación reflejan el comportamiento esperado de una tienda en línea.

**Equipo:** Simon Restrepo Aristizabal (US-01 a US-07) · Sebastian Palacio (US-08 a US-14) · Juan Pablo Cartagena (US-15 a US-20). Todo el equipo revisa los bugs antes de cerrarlos.

**Cronograma:** 1. Planeación (redactar casos) · 2. Ejecución (correr casos y registrar Pasa / Falla) · 3. Reporte (un bug por cada caso que falla) · 4. Depuración (ubicar el defecto en el código) · 5. Cierre (revisar trazabilidad y tareas en Listo).

**Resultado de la ejecución (28/10/2026):** 61 casos ejecutados · 25 Pasa / 36 Falla · 26 bugs (MLIG-103 a MLIG-128). Entorno real: Chromium · sitio servido localmente. CP-10.1 se repitió en Firefox y el mapa de CP-13.3 se confirmó con internet el mismo día.

**Automatización (04/11/2026):** los 61 casos están automatizados con Playwright (133 pruebas, Chrome y Firefox) en `madereraLignina-main/e2e/`.

## US-01 · Navegar entre las secciones del sitio

Historia MLIG-1 · tarea de plan MLIG-17

### CP-01.1 · CA1 (MLIG-32)

**Dado** que estoy en cualquier página del sitio  
**Cuando** presiono un enlace del menú (Nosotros, Categorías, Venta de la semana, Consejos, Comentarios)  
**Entonces** se abre la sección correspondiente sin error 404

- Precondiciones: sitio abierto en Chrome.
- Pasos: 1. Abrir Categorías. 2. Presionar cada enlace del menú. 3. Repetir desde inicio.
- Datos de entrada: páginas de origen: inicio y Categorías.
- Resultado esperado: cada enlace abre su sección, sin error 404.
- Resultado obtenido: **Pasa** — los 10 clics abren su sección (código 200).
- Fecha de ejecución: 2026-10-28

### CP-01.2 · CA2 (MLIG-33)

**Dado** que estoy en una sección interna  
**Cuando** presiono "Volver al inicio"  
**Entonces** regreso a la página de inicio

- Precondiciones: estar en una sección interna.
- Pasos: 1. Abrir Consejos. 2. Presionar "Volver al inicio". 3. Repetir desde Registro, Ingreso y Carro de compras.
- Datos de entrada: Consejos, Registro, Ingreso, Carro de compras.
- Resultado esperado: siempre regresa a la página de inicio.
- Resultado obtenido: **Pasa** — desde las 4 páginas regresa a index.html.
- Fecha de ejecución: 2026-10-28

### CP-01.3 · CA3 (MLIG-34)

**Dado** que estoy en cualquier página  
**Cuando** presiono "Registrarse", "Ingresar" o el ícono del carrito en el encabezado  
**Entonces** se abre la página correspondiente sin error 404

- Precondiciones: sitio abierto en Chrome.
- Pasos: 1. Desde Categorías presionar "Ingresar". 2. Volver y presionar "Registrarse". 3. Volver y presionar el carrito. 4. Repetir desde inicio y Venta de la semana.
- Datos de entrada: Categorías, inicio, Venta de la semana.
- Resultado esperado: se abren Ingreso, Registro y Carro de compras sin error 404 desde todas las páginas.
- Resultado obtenido: **Falla** — desde Categorías, "Ingresar" va a Ingreso.html y responde 404 (bug: MLIG-103).
- Fecha de ejecución: 2026-10-28

## US-02 · Ir a una categoría desde la página de inicio

Historia MLIG-2 · tarea de plan MLIG-18

### CP-02.1 · CA1 (MLIG-35)

**Dado** que estoy en la página de inicio  
**Cuando** presiono la tarjeta de una categoría (Dormitorio, Living, Baño, Exterior, Deco, Fraccionado, Rústica)  
**Entonces** se abre la página de Categorías ubicada en esa categoría

- Precondiciones: página de inicio abierta.
- Pasos: 1. Presionar la tarjeta "Baño". 2. Verificar que Categorías se ubica en Baño. 3. Repetir con las otras 6 categorías.
- Datos de entrada: las 7 categorías.
- Resultado esperado: cada tarjeta abre Categorías ubicada en la categoría elegida.
- Resultado obtenido: **Pasa** — las 7 tarjetas abren Categorías en su categoría.
- Fecha de ejecución: 2026-10-28

### CP-02.2 · CA2 (MLIG-36)

**Dado** que estoy en la página de inicio  
**Cuando** presiono "Ver más" en un bloque (Nosotros, Categorías, Venta de la semana, Consejos, Comentarios)  
**Entonces** se abre la sección completa de ese bloque

- Precondiciones: página de inicio abierta.
- Pasos: 1. Presionar "Ver más" de Nosotros. 2. Volver y repetir con los otros 4 bloques.
- Datos de entrada: los 5 bloques con "Ver más".
- Resultado esperado: cada "Ver más" abre la sección completa de su bloque.
- Resultado obtenido: **Pasa** — los 5 "Ver más" abren su sección.
- Fecha de ejecución: 2026-10-28

## US-03 · Buscar productos por nombre

Historia MLIG-3 · tarea de plan MLIG-19

### CP-03.1 · CA1 (MLIG-37)

**Dado** que estoy en la página de inicio  
**Cuando** escribo el nombre de un producto existente y presiono el botón de búsqueda  
**Entonces** veo una lista de productos cuyo nombre contiene ese texto

- Precondiciones: página de inicio abierta.
- Pasos: 1. Escribir "Mesada" en "Buscar". 2. Presionar la lupa.
- Datos de entrada: "Mesada".
- Resultado esperado: lista con las mesadas del catálogo.
- Resultado obtenido: **Falla** — la lupa no hace nada; no hay resultados (bug: MLIG-104).
- Fecha de ejecución: 2026-10-28

### CP-03.2 · CA2 (MLIG-38)

**Dado** el campo de búsqueda vacío  
**Cuando** presiono el botón de búsqueda  
**Entonces** el sistema no ejecuta la búsqueda y me indica que escriba un término

- Precondiciones: página de inicio abierta, campo "Buscar" vacío.
- Pasos: 1. Presionar la lupa sin escribir. 2. Repetir con solo tres espacios.
- Datos de entrada: "" y "   ".
- Resultado esperado: no se ejecuta la búsqueda y aparece un aviso que pide escribir un término (por ejemplo "Escribe un término para buscar"), en pantalla o en una ventana.
- Resultado obtenido: **Falla** — no aparece ningún aviso (bug: MLIG-104).
- Fecha de ejecución: 2026-10-28
- Cambio 2026-11-13: se dijo qué aviso debe aparecer.

### CP-03.3 · CA3 (MLIG-39)

**Dado** que escribo un término que no corresponde a ningún producto  
**Cuando** busco  
**Entonces** veo el mensaje "No se encontraron productos"

- Precondiciones: página de inicio abierta.
- Pasos: 1. Escribir "Televisor". 2. Presionar la lupa.
- Datos de entrada: "Televisor".
- Resultado esperado: mensaje "No se encontraron productos".
- Resultado obtenido: **Falla** — no aparece el mensaje (bug: MLIG-104).
- Fecha de ejecución: 2026-10-28

## US-04 · Ver los productos de cada categoría

Historia MLIG-4 · tarea de plan MLIG-20

### CP-04.1 · CA1 (MLIG-40)

**Dado** que abro la página de Categorías  
**Cuando** termina de cargar  
**Entonces** cada categoría muestra sus productos con imagen visible

- Precondiciones: página Categorías abierta.
- Pasos: 1. Recorrer las 7 categorías. 2. Revisar cada imagen.
- Datos de entrada: Dormitorio, Baño, Living, Exterior, Deco, Fraccionado, Rústica.
- Resultado esperado: las 7 categorías con sus 28 productos en total y ninguna imagen rota.
- Resultado obtenido: **Pasa** — 7 categorías, 28 productos, ninguna imagen rota.
- Fecha de ejecución: 2026-10-28
- Cambio 2026-11-13: se agregó el número exacto de productos (28).

### CP-04.2 · CA2 (MLIG-41)

**Dado** un producto de una categoría  
**Cuando** presiono su botón para ver el detalle  
**Entonces** se abre una ventana con el nombre, la imagen, la descripción y el precio de ese producto

- Precondiciones: página Categorías abierta.
- Pasos: 1. En Dormitorio abrir el detalle de "Escritorio". 2. Revisar la ventana.
- Datos de entrada: Escritorio (Dormitorio).
- Resultado esperado: nombre "Escritorio", imagen, descripción y precio $ 4.200.
- Resultado obtenido: **Pasa** — muestra nombre, imagen, descripción y precio ("$ 4200"; el formato se reporta en CP-04.4).
- Fecha de ejecución: 2026-10-28

### CP-04.3 · CA3 (MLIG-42)

**Dado** la ventana de detalle de un producto  
**Cuando** la reviso  
**Entonces** el título corresponde al producto de la imagen

- Precondiciones: página Categorías abierta.
- Pasos: 1. En Deco abrir el detalle del producto con imagen de estantería. 2. Comparar título e imagen. 3. Repetir con todos los productos.
- Datos de entrada: estantería de Deco.
- Resultado esperado: el título dice "Estante" (no "Escritorio").
- Resultado obtenido: **Falla** — el estante de Deco se titula "Escritorio" (bug: MLIG-105).
- Fecha de ejecución: 2026-10-28

### CP-04.4 · CA4 (MLIG-43)

**Dado** cualquier precio del catálogo  
**Cuando** lo leo  
**Entonces** usa el mismo formato en todo el sitio, con signo $ y punto como separador de miles

- Precondiciones: Categorías y Venta de la semana abiertas.
- Pasos: 1. Leer el precio del Armario de Dormitorio. 2. Leer el precio del Banco de madera. 3. Comparar.
- Datos de entrada: Armario y Banco de madera.
- Resultado esperado: $ 15.000 y $ 1.550, con el mismo formato.
- Resultado obtenido: **Falla** — "$ 15000" y "$1550": sin separador de miles y con formatos distintos (bug: MLIG-106).
- Fecha de ejecución: 2026-10-28

## US-05 · Comprar un producto desde su detalle

Historia MLIG-5 · tarea de plan MLIG-21

### CP-05.1 · CA1 (MLIG-44)

**Dado** la ventana de detalle de un producto de Categorías  
**Cuando** presiono "Comprar"  
**Entonces** el producto se agrega al carrito y veo una confirmación

- Precondiciones: carrito vacío; Categorías abierta.
- Pasos: 1. Abrir el detalle de "Mesada" (Dormitorio). 2. Presionar "Comprar". 3. Abrir el carrito.
- Datos de entrada: Mesada, $ 3.500.
- Resultado esperado: confirmación visible y la Mesada en el carrito.
- Resultado obtenido: **Falla** — "Comprar" no reacciona y la Mesada no llega al carrito (bug: MLIG-107).
- Fecha de ejecución: 2026-10-28

### CP-05.2 · CA2 (MLIG-45)

**Dado** un producto de "Venta de la semana" o de "Ventas antiguas"  
**Cuando** presiono "Comprar"  
**Entonces** el producto se agrega al carrito y veo una confirmación

- Precondiciones: carrito vacío; Venta de la semana abierta.
- Pasos: 1. En Ventas antiguas presionar "Comprar" de "Silla de caña". 2. Abrir el carrito.
- Datos de entrada: Silla de caña, $ 2.350.
- Resultado esperado: confirmación visible y la Silla de caña en el carrito.
- Resultado obtenido: **Falla** — el enlace apunta a "#" y solo salta al inicio de la página (bug: MLIG-108).
- Fecha de ejecución: 2026-10-28

### CP-05.3 · CA3 (MLIG-46)

**Dado** la ventana de detalle abierta  
**Cuando** presiono "Cerrar" o la "X"  
**Entonces** la ventana se cierra y no se agrega nada al carrito

- Precondiciones: carrito vacío; Categorías abierta.
- Pasos: 1. Abrir el detalle de "Lavabo" (Baño). 2. Presionar "Cerrar". 3. Abrirlo de nuevo y presionar la "X". 4. Abrir el carrito.
- Datos de entrada: Lavabo, $ 6.000.
- Resultado esperado: la ventana se cierra y el carrito sigue vacío.
- Resultado obtenido: **Pasa** — la ventana se cierra con "Cerrar" y con la "X" y no se agrega nada.
- Fecha de ejecución: 2026-10-28

## US-06 · Ver la venta de la semana

Historia MLIG-6 · tarea de plan MLIG-22

### CP-06.1 · CA1 (MLIG-47)

**Dado** que abro "Venta de la semana"  
**Cuando** la página termina de cargar  
**Entonces** veo el producto destacado con nombre, imagen, tabla de características y precio

- Precondiciones: Venta de la semana abierta.
- Pasos: 1. Revisar el bloque del producto destacado.
- Datos de entrada: Banco de madera.
- Resultado esperado: nombre, imagen, tabla de características y precio $ 1.550.
- Resultado obtenido: **Pasa** — se ve el Banco de madera con imagen, tabla de características y precio ("$1550"; el formato se reporta en MLIG-106).
- Fecha de ejecución: 2026-10-28

### CP-06.2 · CA2 (MLIG-48)

**Dado** la sección "Ventas antiguas"  
**Cuando** la reviso  
**Entonces** cada producto muestra nombre, imagen, precio y un enlace "Comprar" que funciona

- Precondiciones: Venta de la semana abierta.
- Pasos: 1. Revisar Silla de caña, Tabla para picar, Silla de troncos y Mesada de Fresno. 2. Presionar "Comprar" en cada una.
- Datos de entrada: Silla de caña ($ 2.350), Tabla para picar ($ 1.100), Silla de troncos ($ 1.900), Mesada de Fresno ($ 3.500).
- Resultado esperado: datos completos y "Comprar" ejecuta una compra (no lleva a "#").
- Resultado obtenido: **Falla** — los datos se ven, pero los 4 "Comprar" apuntan a "#" (bug: MLIG-108).
- Fecha de ejecución: 2026-10-28
- Cambio 2026-11-13: se agregó la Mesada de Fresno; la sección tiene 4 productos, no 3.

## US-07 · Ver mi carrito de compras

Historia MLIG-7 · tarea de plan MLIG-23

### CP-07.1 · CA1 (MLIG-49)

**Dado** que agregué productos  
**Cuando** abro el carrito  
**Entonces** veo cada producto con su nombre, cantidad, precio unitario y subtotal

- Precondiciones: carrito vacío.
- Pasos: 1. Comprar "Escritorio" (Dormitorio). 2. Abrir el carrito.
- Datos de entrada: Escritorio, $ 4.200, cantidad 1.
- Resultado esperado: fila "Escritorio", cantidad 1, precio $ 4.200, subtotal $ 4.200.
- Resultado obtenido: **Falla** — el carrito solo muestra el título "Carro de compras", sin filas (bug: MLIG-109).
- Fecha de ejecución: 2026-10-28

### CP-07.2 · CA2 (MLIG-50)

**Dado** que no he agregado productos  
**Cuando** abro el carrito  
**Entonces** veo el mensaje "Tu carrito está vacío" y el total es $ 0

- Precondiciones: ventana de incógnito (sin datos del sitio).
- Pasos: 1. Presionar el ícono del carrito.
- Datos de entrada: ninguno.
- Resultado esperado: "Tu carrito está vacío" y total $ 0.
- Resultado obtenido: **Falla** — no aparece el mensaje ni el total (bug: MLIG-109).
- Fecha de ejecución: 2026-10-28

### CP-07.3 · CA3 (MLIG-51)

**Dado** un carrito con varios productos  
**Cuando** reviso el total  
**Entonces** es la suma exacta de los subtotales

- Precondiciones: carrito vacío.
- Pasos: 1. Comprar Escritorio ($ 4.200). 2. Comprar Lavabo ($ 6.000). 3. Comprar Silla de Exterior ($ 1.500). 4. Abrir el carrito.
- Datos de entrada: Escritorio ($ 4.200), Lavabo ($ 6.000) y Silla de exterior ($ 1.500), 1 unidad de cada uno.
- Resultado esperado: total $ 11.700.
- Resultado obtenido: **Falla** — no se muestra ningún total (bug: MLIG-109).
- Fecha de ejecución: 2026-10-28
- Cambio 2026-11-13: se nombraron los 3 productos y sus precios.

## US-08 · Registrarme como cliente

Historia MLIG-8 · tarea de plan MLIG-24

### CP-08.1 · CA1 (MLIG-52)

**Dado** el formulario de registro con todos los campos válidos y los términos aceptados  
**Cuando** presiono "Registrarme!"  
**Entonces** la cuenta se crea y veo un mensaje de confirmación

- Precondiciones: página Registro abierta.
- Pasos: 1. Llenar todos los campos. 2. Marcar los términos. 3. Presionar "Registrarme!".
- Datos de entrada: Juan / Pérez / juanp / Medellín / Centro / 050001.
- Resultado esperado: mensaje de confirmación de registro.
- Resultado obtenido: **Falla** — la página se recarga con el formulario vacío, sin confirmación (bug: MLIG-110).
- Fecha de ejecución: 2026-10-28

### CP-08.2 · CA2 (MLIG-53)

**Dado** el formulario de registro vacío  
**Cuando** presiono "Registrarme!"  
**Entonces** veo un mensaje de error en cada campo obligatorio y no se envía el formulario

- Precondiciones: Registro abierta, formulario vacío.
- Pasos: 1. Presionar "Registrarme!" sin llenar nada.
- Datos de entrada: todos los campos vacíos.
- Resultado esperado: error en Nombre, Apellido, Usuario, Ciudad, Zona y Postal; se permanece en Registro.
- Resultado obtenido: **Falla** — se envía sin ningún error (bug: MLIG-111); además Apellido viene lleno con "required" (bug: MLIG-112).
- Fecha de ejecución: 2026-10-28

### CP-08.3 · CA3 (MLIG-54)

**Dado** el formulario completo sin aceptar los términos  
**Cuando** presiono "Registrarme!"  
**Entonces** veo "Debes aceptar antes de registrarte." y no se crea la cuenta

- Precondiciones: Registro abierta.
- Pasos: 1. Llenar los campos con los datos de CP-08.1. 2. No marcar términos. 3. Presionar "Registrarme!".
- Datos de entrada: datos válidos, términos sin marcar.
- Resultado esperado: aviso "Debes aceptar antes de registrarte." y no se registra.
- Resultado obtenido: **Falla** — se envía igual, sin el aviso (bug: MLIG-111).
- Fecha de ejecución: 2026-10-28

### CP-08.4 · CA4 (MLIG-55)

**Dado** el formulario de registro  
**Cuando** lo reviso  
**Entonces** pide correo electrónico y contraseña, que son los datos que luego exige "Ingresar"

- Precondiciones: Registro abierta.
- Pasos: 1. Revisar los campos. 2. Compararlos con los de Ingreso.
- Datos de entrada: ninguno.
- Resultado esperado: hay campo de correo electrónico y de contraseña.
- Resultado obtenido: **Falla** — no tiene campo de correo ni de contraseña (bug: MLIG-113).
- Fecha de ejecución: 2026-10-28

## US-09 · Ingresar con mi cuenta

Historia MLIG-9 · tarea de plan MLIG-25

### CP-09.1 · CA1 (MLIG-56)

**Dado** un correo y una contraseña registrados  
**Cuando** presiono "Ingresar"  
**Entonces** entro a mi cuenta y el encabezado lo indica

- Precondiciones: cuenta registrada (si no es posible, el caso queda bloqueado por US-08); Ingreso abierta.
- Pasos: 1. Escribir correo y contraseña. 2. Presionar "Ingresar".
- Datos de entrada: juan@correo.com / Clave123.
- Resultado esperado: se ingresa y el encabezado lo indica (nombre o "Cerrar sesión").
- Resultado obtenido: **Falla** — la página solo se recarga y el encabezado no cambia (bug: MLIG-114).
- Fecha de ejecución: 2026-10-28

### CP-09.2 · CA2 (MLIG-57)

**Dado** un correo registrado con contraseña incorrecta  
**Cuando** presiono "Ingresar"  
**Entonces** veo un mensaje de credenciales incorrectas y no ingreso

- Precondiciones: Ingreso abierta.
- Pasos: 1. Escribir correo registrado y contraseña errada. 2. Presionar "Ingresar".
- Datos de entrada: juan@correo.com / ClaveMala.
- Resultado esperado: mensaje de credenciales incorrectas; no se ingresa.
- Resultado obtenido: **Falla** — no aparece ningún mensaje (bug: MLIG-114).
- Fecha de ejecución: 2026-10-28

### CP-09.3 · CA3 (MLIG-58)

**Dado** el campo de correo vacío o con formato inválido  
**Cuando** presiono "Ingresar"  
**Entonces** el sistema lo rechaza con un mensaje claro

- Precondiciones: Ingreso abierta.
- Pasos: 1. Dejar el correo vacío y presionar "Ingresar". 2. Escribir "juan@" y presionar "Ingresar".
- Datos de entrada: "" y "juan@".
- Resultado esperado: ambos se rechazan: no se ingresa y el campo Email queda marcado como inválido con el aviso del navegador (por ejemplo "Completa este campo").
- Resultado obtenido: **Falla** — "juan@" sí se rechaza, pero el correo vacío se envía sin aviso (bug: MLIG-115).
- Fecha de ejecución: 2026-10-28
- Cambio 2026-11-13: se cambió "mensaje claro" por lo que se debe ver.

### CP-09.4 · CA4 (MLIG-59)

**Dado** el campo de contraseña  
**Cuando** escribo en él  
**Entonces** los caracteres se muestran ocultos

- Precondiciones: Ingreso abierta.
- Pasos: 1. Escribir "Clave123" en Contraseña.
- Datos de entrada: "Clave123".
- Resultado esperado: el texto se muestra con puntos o asteriscos.
- Resultado obtenido: **Pasa** — el campo es de tipo contraseña y oculta los caracteres.
- Fecha de ejecución: 2026-10-28

## US-10 · Consultar consejos y contenido multimedia

Historia MLIG-10 · tarea de plan MLIG-26

### CP-10.1 · CA1 (MLIG-60)

**Dado** el video de la página de inicio  
**Cuando** presiono reproducir  
**Entonces** el video se reproduce con sus controles (pausa, volumen, pantalla completa)

- Precondiciones: página de inicio abierta.
- Pasos: 1. Reproducir. 2. Pausar. 3. Cambiar volumen. 4. Pantalla completa. 5. Repetir en Firefox.
- Datos de entrada: video "Tipos y formatos de madera para muebles".
- Resultado esperado: el video carga y todos los controles funcionan en ambos navegadores.
- Resultado obtenido: **Pasa** — el video (MP4 H.264/AAC, 2 min 21 s) carga y se reproduce con sus controles nativos en Chromium y en Firefox. Evidencia: captura de Firefox adjunta.
- Fecha de ejecución: 2026-10-28

### CP-10.2 · CA2 (MLIG-61)

**Dado** el audio de consejos de la página de inicio  
**Cuando** presiono reproducir  
**Entonces** el audio se escucha completo

- Precondiciones: página de inicio abierta.
- Pasos: 1. Reproducir el audio. 2. Adelantar hasta el final.
- Datos de entrada: audio "Consejos útiles tratamiento de la madera de exteriores".
- Resultado esperado: se escucha hasta el final sin cortes.
- Resultado obtenido: **Pasa** — el audio (2 min 28 s) se reproduce completo hasta el final sin errores.
- Fecha de ejecución: 2026-10-28

### CP-10.3 · CA3 (MLIG-62)

**Dado** que abro la página "Consejos"  
**Cuando** termina de cargar  
**Entonces** veo los 4 consejos, cada uno con su imagen y su texto

- Precondiciones: ninguna.
- Pasos: 1. Abrir Consejos. 2. Contar los consejos y revisar imagen y texto.
- Datos de entrada: ninguno.
- Resultado esperado: 4 consejos con imagen visible y texto.
- Resultado obtenido: **Pasa** — 4 consejos con imagen y texto.
- Fecha de ejecución: 2026-10-28

## US-11 · Dejar un comentario

Historia MLIG-11 · tarea de plan MLIG-27

### CP-11.1 · CA1 (MLIG-63)

**Dado** que escribo un comentario en la página "Comentarios"  
**Cuando** presiono el botón de enviar  
**Entonces** veo una confirmación y el comentario aparece publicado

- Precondiciones: Comentarios abierta.
- Pasos: 1. Escribir el comentario. 2. Presionar enviar.
- Datos de entrada: "Excelente calidad en la mesa que compré."
- Resultado esperado: confirmación y el comentario aparece en la lista.
- Resultado obtenido: **Falla** — el botón no hace nada; el comentario no se publica (bug: MLIG-116).
- Fecha de ejecución: 2026-10-28

### CP-11.2 · CA2 (MLIG-64)

**Dado** el campo de comentario vacío o solo con espacios  
**Cuando** presiono el botón de enviar  
**Entonces** no se publica nada y veo un aviso

- Precondiciones: Comentarios abierta.
- Pasos: 1. Enviar con el campo vacío. 2. Enviar con solo cinco espacios.
- Datos de entrada: "" y "     ".
- Resultado esperado: no se publica nada y en ambos casos aparece un aviso: texto en pantalla, ventana de aviso o el campo marcado como obligatorio.
- Resultado obtenido: **Falla** — no aparece ningún aviso (bug: MLIG-116).
- Fecha de ejecución: 2026-10-28
- Cambio 2026-11-13: se dijo qué cuenta como aviso.

### CP-11.3 · CA3 (MLIG-65)

**Dado** el formulario de comentarios  
**Cuando** lo reviso  
**Entonces** el botón está en español ("Enviar"), igual que el resto del sitio

- Precondiciones: Comentarios abierta.
- Pasos: 1. Leer el texto del botón.
- Datos de entrada: ninguno.
- Resultado esperado: el botón dice "Enviar" (no "Submit").
- Resultado obtenido: **Falla** — el botón dice "Submit" (bug: MLIG-117).
- Fecha de ejecución: 2026-10-28

## US-12 · Suscribirme al newsletter

Historia MLIG-12 · tarea de plan MLIG-28

### CP-12.1 · CA1 (MLIG-66)

**Dado** un correo válido  
**Cuando** presiono el botón de suscripción  
**Entonces** veo un mensaje de suscripción exitosa

- Precondiciones: inicio abierta, pie de página visible.
- Pasos: 1. Escribir el correo en Newsletter. 2. Presionar el botón.
- Datos de entrada: juan@correo.com
- Resultado esperado: mensaje de suscripción exitosa.
- Resultado obtenido: **Falla** — el botón no hace nada; no hay mensaje de suscripción (bug: MLIG-118).
- Fecha de ejecución: 2026-10-28

### CP-12.2 · CA2 (MLIG-67)

**Dado** un correo con formato inválido  
**Cuando** presiono el botón de suscripción  
**Entonces** el sistema lo rechaza con un mensaje claro

- Precondiciones: inicio abierta.
- Pasos: 1. Escribir "juan@" y presionar el botón. 2. Escribir "juancorreo.com" y presionar el botón.
- Datos de entrada: "juan@" y "juancorreo.com".
- Resultado esperado: ambos se rechazan con un mensaje como "Correo inválido" o "Ingresa un correo válido", y no se suscribe.
- Resultado obtenido: **Falla** — ninguno se rechaza; no aparece mensaje (bug: MLIG-118).
- Fecha de ejecución: 2026-10-28
- Cambio 2026-11-13: se cambió "mensaje claro" por el mensaje esperado.

### CP-12.3 · CA3 (MLIG-68)

**Dado** el campo de correo vacío  
**Cuando** presiono el botón de suscripción  
**Entonces** no se suscribe y veo un aviso

- Precondiciones: inicio abierta.
- Pasos: 1. Dejar el campo vacío. 2. Presionar el botón.
- Datos de entrada: "".
- Resultado esperado: no se suscribe y aparece un aviso como "Ingresa tu correo" o "Correo obligatorio".
- Resultado obtenido: **Falla** — no aparece ningún aviso (bug: MLIG-118).
- Fecha de ejecución: 2026-10-28
- Cambio 2026-11-13: se dijo qué aviso debe aparecer.

## US-13 · Consultar contacto y atención al cliente

Historia MLIG-13 · tarea de plan MLIG-29

### CP-13.1 · CA1 (MLIG-69)

**Dado** el pie de página  
**Cuando** presiono "Envíos", "Plazos", "Legales" o "Pago"  
**Entonces** se abre la información correspondiente

- Precondiciones: inicio abierta, pie de página visible.
- Pasos: 1. Presionar "Envíos". 2. Repetir con "Plazos", "Legales" y "Pago".
- Datos de entrada: los 4 enlaces.
- Resultado esperado: cada enlace abre su información (no "#").
- Resultado obtenido: **Falla** — los 4 enlaces apuntan a "#" (bug: MLIG-119).
- Fecha de ejecución: 2026-10-28

### CP-13.2 · CA2 (MLIG-70)

**Dado** el pie de página  
**Cuando** presiono el ícono de Facebook, WhatsApp o Instagram  
**Entonces** se abre la cuenta de la tienda en esa red en una pestaña nueva

- Precondiciones: inicio abierta.
- Pasos: 1. Presionar Facebook. 2. Repetir con WhatsApp e Instagram.
- Datos de entrada: los 3 íconos.
- Resultado esperado: pestaña nueva con la cuenta de Lignina (no la página principal de la red).
- Resultado obtenido: **Falla** — abren la página principal de cada red, no la cuenta de la tienda (bug: MLIG-120).
- Fecha de ejecución: 2026-10-28

### CP-13.3 · CA3 (MLIG-71)

**Dado** el mapa de "Ubicación en mapa"  
**Cuando** lo miro  
**Entonces** muestra la ubicación de la tienda y permite ampliarlo

- Precondiciones: inicio abierta.
- Pasos: 1. Revisar el mapa. 2. Usar el zoom.
- Datos de entrada: ninguno.
- Resultado esperado: el mapa carga, marca la tienda y permite ampliar.
- Resultado obtenido: **Pasa** — el mapa de Google Maps carga en Chrome con internet, marca la tienda en RN40 1042, San Martín de los Andes, y el botón "+" lo amplía. Evidencia: captura adjunta (CP-13.3-mapa-con-zoom.png).
- Fecha de ejecución: 2026-10-28

## US-14 · Usar el sitio desde el celular

Historia MLIG-14 · tarea de plan MLIG-30

### CP-14.1 · CA1 (MLIG-72)

**Dado** un teléfono con pantalla de 375 px de ancho  
**Cuando** abro cualquier página  
**Entonces** todo el contenido cabe sin desplazamiento horizontal

- Precondiciones: Chrome en modo responsive a 375 px.
- Pasos: 1. Abrir inicio, Categorías, Venta de la semana, Consejos y Comentarios. 2. Intentar desplazarse de lado.
- Datos de entrada: ancho 375 px.
- Resultado esperado: ninguna página tiene desplazamiento horizontal.
- Resultado obtenido: **Falla** — Consejos mide 408 px de ancho; las demás caben bien (bug: MLIG-121).
- Fecha de ejecución: 2026-10-28

### CP-14.2 · CA2 (MLIG-73)

**Dado** un teléfono con pantalla de 375 px  
**Cuando** uso el menú de navegación  
**Entonces** todos los enlaces son visibles y se pueden presionar

- Precondiciones: Chrome en modo responsive a 375 px.
- Pasos: 1. En inicio revisar el menú. 2. Presionar cada enlace.
- Datos de entrada: ancho 375 px.
- Resultado esperado: los 5 enlaces del menú (Nosotros, Categorías, Venta de la semana, Consejos, Comentarios) se ven completos dentro de los 375 px y se pueden presionar.
- Resultado obtenido: **Pasa** — todos los enlaces se ven completos y funcionan.
- Fecha de ejecución: 2026-10-28
- Cambio 2026-11-13: se nombraron los 5 enlaces y se cambió "funcionales" por algo que se puede comprobar.

### CP-14.3 · CA3 (MLIG-74)

**Dado** un teléfono con pantalla de 375 px  
**Cuando** abro los formularios de registro e ingreso  
**Entonces** los campos y botones se ven completos y se pueden usar

- Precondiciones: Chrome en modo responsive a 375 px.
- Pasos: 1. Abrir Registro y revisar campos y botón. 2. Abrir Ingreso y revisar campos y botón.
- Datos de entrada: ancho 375 px; páginas Registro e Ingreso.
- Resultado esperado: todos los campos y botones se ven completos dentro de los 375 px (ninguno se sale por los lados).
- Resultado obtenido: **Pasa** — campos y botones se ven completos y se pueden usar.
- Fecha de ejecución: 2026-10-28
- Cambio 2026-11-13: se dijo cómo comprobar "sin cortes".

## US-15 · Usar el sitio con lector de pantalla

Historia MLIG-15 · tarea de plan MLIG-31

### CP-15.1 · CA1 (MLIG-75)

**Dado** cualquier imagen de producto  
**Cuando** un lector de pantalla la recorre  
**Entonces** anuncia un texto alternativo que describe ese producto

- Precondiciones: Categorías abierta, DevTools en Accessibility.
- Pasos: 1. Inspeccionar la imagen de la Mesada de Dormitorio. 2. Inspeccionar la de la Mesada de Baño. 3. Revisar el resto.
- Datos de entrada: imágenes de producto.
- Resultado esperado: cada texto alternativo describe su producto (la Mesada no dice "escritorio").
- Resultado obtenido: **Falla** — 4 imágenes (Mesada, Estante y Armario de Dormitorio; Mesada de Baño) tienen alt "escritorio" (bug: MLIG-122).
- Fecha de ejecución: 2026-10-28

### CP-15.2 · CA2 (MLIG-76)

**Dado** los campos de búsqueda, newsletter y comentarios  
**Cuando** un lector de pantalla los recorre  
**Entonces** cada uno se anuncia con una etiqueta que dice para qué sirve

- Precondiciones: inicio y Comentarios abiertas.
- Pasos: 1. Inspeccionar "Buscar". 2. Inspeccionar Newsletter. 3. Inspeccionar el campo de comentarios.
- Datos de entrada: ninguno.
- Resultado esperado: cada campo tiene nombre accesible (etiqueta), no solo placeholder.
- Resultado obtenido: **Falla** — Buscar y Newsletter solo tienen placeholder; comentarios sí tiene etiqueta (bug: MLIG-123).
- Fecha de ejecución: 2026-10-28

### CP-15.3 · CA3 (MLIG-77)

**Dado** el botón de búsqueda (lupa) y el ícono del carrito  
**Cuando** un lector de pantalla los recorre  
**Entonces** se anuncian como "Buscar" y "Carrito de compras"

- Precondiciones: inicio abierta.
- Pasos: 1. Inspeccionar la lupa. 2. Inspeccionar el carrito.
- Datos de entrada: ninguno.
- Resultado esperado: se anuncian como "Buscar" y "Carrito de compras".
- Resultado obtenido: **Falla** — la lupa no tiene nombre y el carrito se anuncia como "carrodecompras" (bug: MLIG-124).
- Fecha de ejecución: 2026-10-28

## US-16 · Ver la sección Nosotros

Historia MLIG-78 · tarea de plan MLIG-83

### CP-16.1 · CA1 (MLIG-88)

**Dado** que abro la página Nosotros  
**Cuando** termina de cargar  
**Entonces** veo los 6 carruseles con su primera imagen visible

- Precondiciones: ninguna.
- Pasos: 1. Abrir Nosotros. 2. Contar los carruseles y revisar su primera imagen.
- Datos de entrada: ninguno.
- Resultado esperado: 6 carruseles con su primera imagen visible.
- Resultado obtenido: **Pasa** — 6 carruseles con su imagen visible.
- Fecha de ejecución: 2026-10-28

### CP-16.2 · CA2 (MLIG-89)

**Dado** un carrusel de Nosotros  
**Cuando** presiono la flecha siguiente o anterior  
**Entonces** cambia a la imagen siguiente o anterior

- Precondiciones: Nosotros abierta.
- Pasos: 1. Presionar "siguiente" 3 veces. 2. Presionar "anterior" 1 vez. 3. Repetir en los demás carruseles.
- Datos de entrada: los 6 carruseles de Nosotros, 3 imágenes cada uno.
- Resultado esperado: avanza 2 → 3 → 1 y retrocede a 3, sin imágenes en blanco.
- Resultado obtenido: **Pasa** — en los 6 carruseles "siguiente" avanza una imagen y vuelve a la primera, y "anterior" retrocede una.
- Fecha de ejecución: 2026-10-28
- Cambio 2026-11-13: se dijo cuántos carruseles se prueban.

### CP-16.3 · CA3 (MLIG-90)

**Dado** un carrusel de Nosotros  
**Cuando** presiono uno de sus indicadores  
**Entonces** muestra la imagen correspondiente y el indicador queda marcado

- Precondiciones: Nosotros abierta.
- Pasos: 1. Presionar el indicador 3. 2. Presionar el indicador 1.
- Datos de entrada: Slide 3 y Slide 1.
- Resultado esperado: muestra la imagen 3 y luego la 1; el indicador activo cambia.
- Resultado obtenido: **Pasa** — muestra la imagen indicada y marca su indicador.
- Fecha de ejecución: 2026-10-28

## US-17 · Ampliar las imágenes de la página de inicio

Historia MLIG-79 · tarea de plan MLIG-84

### CP-17.1 · CA1 (MLIG-91)

**Dado** la imagen de la estancia en la página de inicio  
**Cuando** la presiono  
**Entonces** se abre en una ventana más grande

- Precondiciones: inicio abierta.
- Pasos: 1. Presionar la imagen de la estancia.
- Datos de entrada: imagen "estancia".
- Resultado esperado: se abre una ventana con la imagen más grande que la miniatura.
- Resultado obtenido: **Pasa** — se abre ampliada (de 720 px a 798 px de ancho).
- Fecha de ejecución: 2026-10-28
- Cambio 2026-11-13: se dijo cómo comprobar que está "ampliada".

### CP-17.2 · CA2 (MLIG-92)

**Dado** la imagen ampliada  
**Cuando** presiono fuera de ella o la tecla Esc  
**Entonces** la ventana se cierra y vuelvo a la página en el mismo punto

- Precondiciones: imagen ampliada.
- Pasos: 1. Presionar fuera de la imagen. 2. Volver a abrirla y presionar Esc.
- Datos de entrada: clic fuera y tecla Esc.
- Resultado esperado: se cierra en ambos casos y la página queda en el mismo punto.
- Resultado obtenido: **Pasa** — se cierra con clic fuera y con Esc, sin mover la página.
- Fecha de ejecución: 2026-10-28

### CP-17.3 · CA3 (MLIG-93)

**Dado** la imagen ampliada  
**Cuando** la reviso  
**Entonces** tiene un botón visible para cerrarla

- Precondiciones: imagen ampliada.
- Pasos: 1. Buscar un botón para cerrar.
- Datos de entrada: ninguno.
- Resultado esperado: hay un botón visible ("X" o "Cerrar").
- Resultado obtenido: **Falla** — la ventana no tiene botón para cerrar (bug: MLIG-125).
- Fecha de ejecución: 2026-10-28

## US-18 · Volver al inicio de la página con el botón flotante

Historia MLIG-80 · tarea de plan MLIG-85

### CP-18.1 · CA1 (MLIG-94)

**Dado** que estoy al principio de una página  
**Cuando** la miro  
**Entonces** el botón para volver arriba no se muestra

- Precondiciones: Categorías abierta, sin desplazarse.
- Pasos: 1. Revisar la esquina inferior derecha.
- Datos de entrada: desplazamiento 0 px.
- Resultado esperado: el botón no se muestra.
- Resultado obtenido: **Pasa** — el botón está oculto (opacidad 0).
- Fecha de ejecución: 2026-10-28

### CP-18.2 · CA2 (MLIG-95)

**Dado** que bajo más de 100 px en la página  
**Cuando** miro la esquina inferior derecha  
**Entonces** aparece el botón para volver arriba

- Precondiciones: Categorías abierta.
- Pasos: 1. Bajar unos 50 px y revisar. 2. Bajar hasta la mitad y revisar.
- Datos de entrada: \~50 px y mitad de la página.
- Resultado esperado: a 50 px no aparece; a mitad de página sí.
- Resultado obtenido: **Pasa** — a 50 px sigue oculto y a mitad de página aparece.
- Fecha de ejecución: 2026-10-28

### CP-18.3 · CA3 (MLIG-96)

**Dado** el botón visible  
**Cuando** lo presiono  
**Entonces** la página sube hasta el principio y el botón desaparece

- Precondiciones: Categorías desplazada hasta abajo.
- Pasos: 1. Presionar el botón.
- Datos de entrada: ninguno.
- Resultado esperado: sube hasta el principio y el botón desaparece.
- Resultado obtenido: **Pasa** — sube hasta el principio y el botón se oculta.
- Fecha de ejecución: 2026-10-28

## US-19 · Recordar mi sesión al ingresar

Historia MLIG-81 · tarea de plan MLIG-86

### CP-19.1 · CA1 (MLIG-97)

**Dado** que ingreso con "Recordarme" marcado  
**Cuando** cierro el navegador y vuelvo a abrir la tienda  
**Entonces** sigo con la sesión iniciada

- Precondiciones: cuenta registrada (bloqueado si US-08 / US-09 fallan); Ingreso abierta.
- Pasos: 1. Ingresar con la casilla marcada. 2. Cerrar el navegador. 3. Abrir la tienda.
- Datos de entrada: juan@correo.com / Clave123.
- Resultado esperado: la sesión sigue iniciada.
- Resultado obtenido: **Falla** — el ingreso nunca inicia sesión, así que no hay sesión que recordar (bug: MLIG-114).
- Fecha de ejecución: 2026-10-28

### CP-19.2 · CA2 (MLIG-98)

**Dado** que ingreso sin marcar "Recordarme"  
**Cuando** cierro el navegador y vuelvo a abrir la tienda  
**Entonces** la sesión ya no está iniciada

- Precondiciones: igual que CP-19.1.
- Pasos: 1. Ingresar sin marcar la casilla. 2. Cerrar el navegador. 3. Abrir la tienda.
- Datos de entrada: juan@correo.com / Clave123.
- Resultado esperado: la sesión ya no está iniciada.
- Resultado obtenido: **Falla** — bloqueado por el mismo defecto: no se puede comprobar el cierre de una sesión que nunca se inicia (bug: MLIG-114).
- Fecha de ejecución: 2026-10-28

### CP-19.3 · CA3 (MLIG-99)

**Dado** la casilla "Recordarme"  
**Cuando** presiono sobre su texto  
**Entonces** la casilla se marca o desmarca

- Precondiciones: Ingreso abierta.
- Pasos: 1. Presionar el texto "Recordarme". 2. Presionarlo otra vez.
- Datos de entrada: ninguno.
- Resultado esperado: se marca y luego se desmarca.
- Resultado obtenido: **Pasa** — la casilla se marca y se desmarca al presionar el texto.
- Fecha de ejecución: 2026-10-28

## US-20 · Identificar la tienda en el navegador

Historia MLIG-82 · tarea de plan MLIG-87

### CP-20.1 · CA1 (MLIG-100)

**Dado** cualquier página del sitio  
**Cuando** miro su pestaña  
**Entonces** el título dice el nombre de la sección y "LIGNINA" con el mismo formato en todas

- Precondiciones: ninguna.
- Pasos: 1. Abrir las 9 páginas. 2. Leer el título de cada pestaña.
- Datos de entrada: 9 páginas.
- Resultado esperado: todas con formato "Sección | LIGNINA".
- Resultado obtenido: **Falla** — el inicio se titula "LIGNINA | Maderera-Borsari" (bug: MLIG-126).
- Fecha de ejecución: 2026-10-28

### CP-20.2 · CA2 (MLIG-101)

**Dado** cualquier página del sitio  
**Cuando** miro su pestaña  
**Entonces** se ve el ícono (favicon) de la tienda

- Precondiciones: ninguna.
- Pasos: 1. Abrir las 9 páginas. 2. Revisar el ícono de cada pestaña.
- Datos de entrada: 9 páginas.
- Resultado esperado: todas muestran el favicon de Lignina.
- Resultado obtenido: **Pasa** — las 9 páginas cargan el favicon.
- Fecha de ejecución: 2026-10-28

### CP-20.3 · CA3 (MLIG-102)

**Dado** cualquier página del sitio  
**Cuando** termina de cargar  
**Entonces** la consola del navegador no muestra errores

- Precondiciones: DevTools abierto en Consola.
- Pasos: 1. Abrir las 9 páginas. 2. Revisar Consola y Red. 3. Revisar que existan los íconos que pide el manifest.
- Datos de entrada: 9 páginas.
- Resultado esperado: ningún error (404, scripts o recursos que no cargan) y todos los íconos del manifest existen.
- Resultado obtenido: **Falla** — las 9 páginas dan 404 por los íconos del manifest (bug: MLIG-127) y Categorías da 404 por cartel.png (bug: MLIG-128).
- Fecha de ejecución: 2026-10-28
- Cambio 2026-11-13: se agregó la revisión de los íconos del manifest.

