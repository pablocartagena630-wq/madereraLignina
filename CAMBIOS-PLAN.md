# Plan de pruebas corregido · tabla de cambios

La versión corregida del plan y de los casos de prueba está en Jira, proyecto **MLIG**:

- **MLIG-16** · plan de pruebas general (alcance, entorno, estrategia, criterios, riesgos, equipo, cronograma y resultado).
- **MLIG-17 a MLIG-31** y **MLIG-83 a MLIG-87** · una tarea de plan por historia (US-01 a US-20).
- **61 casos de prueba** (CP-01.1 a CP-20.3), cada uno como subtarea de la tarea de su historia.
- **26 bugs** (MLIG-103 a MLIG-128).

Hay una copia completa del plan corregido, con sus 61 casos, en `PLAN-DE-PRUEBAS.md`. Cada caso corregido tiene al final una línea "Cambio 2026-11-13" que explica qué se cambió.

## 1. Correcciones por la retroalimentación de mitad de semestre

En la entrega de mitad de semestre el profesor nos dijo que la estructura del Jira estaba mal. Borramos el proyecto y lo rehicimos desde cero el 28/10/2026.

| Dónde | Qué se corrigió | Por qué |
|---|---|---|
| Los 61 casos | Antes los casos estaban sueltos. Ahora cada caso es una **subtarea** de la tarea de plan de su historia. Ejemplo: CP-01.1 (MLIG-32) está dentro de MLIG-17, que está enlazada a la historia US-01 (MLIG-1). | Retroalimentación: los casos no colgaban de su historia. |
| Las 20 historias y los 61 casos | Los criterios de aceptación se reescribieron en formato **Dado / Cuando / Entonces** (CA1, CA2…). Cada caso copia arriba el criterio que prueba y su número (por ejemplo, "CP-01.1 · CA1"). | Retroalimentación: los criterios estaban mal escritos. |
| Los 26 bugs | Cada bug quedó **enlazado a su tarea y a su historia**. Cada caso que falla dice qué bug lo causa ("bug: MLIG-103"). | Retroalimentación: los bugs no estaban enlazados. |
| Plan general (MLIG-16) | El alcance pasó de 15 a **20 historias** (US-16 a US-20) y el trabajo se repartió de nuevo: Simon US-01 a 07, Sebastian US-08 a 14, Juan Pablo US-15 a 20. | Al rehacer el Jira cubrimos partes del sitio que antes quedaban sin probar. |

## 2. Correcciones en los casos de prueba

Antes de automatizar revisamos los 61 casos. Un caso sin datos concretos o sin un resultado que se pueda comprobar no se puede automatizar. Corregimos estos:

| Caso | Qué se corrigió | Por qué |
|---|---|---|
| CP-03.2 (MLIG-38) | Resultado esperado: antes decía "aparece un aviso". Ahora dice que el aviso pide escribir un término, por ejemplo "Escribe un término para buscar". | "Un aviso" no decía qué se debía ver. |
| CP-04.1 (MLIG-40) | Resultado esperado: se agregó el número exacto, **28 productos** en las 7 categorías. | Sin el número no se podía comprobar que estuvieran todos. |
| CP-06.2 (MLIG-48) | Datos de entrada: antes nombraba 3 productos de Ventas antiguas. Ahora son **4** (se agregó la **Mesada de Fresno, $ 3.500**) y se completó el precio de la Silla de troncos ($ 1.900). El resultado sigue en Falla: los 4 "Comprar" llevan a "#". | El sitio tiene 4 productos. También se corrigió en la tarea MLIG-22 y en el bug MLIG-108. |
| CP-07.3 (MLIG-51) | Datos de entrada: antes decía "3 productos distintos". Ahora dice **Escritorio ($ 4.200), Lavabo ($ 6.000) y Silla de exterior ($ 1.500)**, 1 de cada uno. | Faltaban datos concretos. |
| CP-09.3 (MLIG-58) | Resultado esperado: antes decía "se rechaza con un mensaje claro". Ahora dice que no se ingresa y el campo Email queda marcado como inválido, con el aviso del navegador. | "Mensaje claro" no se puede comprobar. |
| CP-10.1 (MLIG-60) | Resultado obtenido: antes decía "Firefox no se probó". Ahora dice que el video funciona en Chromium **y en Firefox**, con captura. | El caso pedía probar en los dos navegadores. |
| CP-11.2 (MLIG-64) | Resultado esperado: se dijo qué cuenta como aviso (texto en pantalla, ventana de aviso o campo marcado como obligatorio). | "Un aviso" no decía qué se debía ver. |
| CP-12.2 (MLIG-67) | Resultado esperado: antes decía "mensaje claro". Ahora dice un mensaje como "Correo inválido" o "Ingresa un correo válido". | "Mensaje claro" no se puede comprobar. |
| CP-12.3 (MLIG-68) | Resultado esperado: se dijo qué aviso debe aparecer, como "Ingresa tu correo" o "Correo obligatorio". | "Un aviso" no decía qué se debía ver. |
| CP-13.3 (MLIG-71) | Resultado obtenido: antes decía "verificado en el código, confirmar visualmente". Ahora dice que el mapa carga, marca la tienda y el "+" lo amplía, con captura. | No se había visto el mapa funcionando. |
| CP-14.2 (MLIG-73) | Resultado esperado: antes decía "enlaces visibles y funcionales". Ahora nombra los **5 enlaces** y dice que se ven completos dentro de los 375 px. | "Funcionales" no se puede comprobar. |
| CP-14.3 (MLIG-74) | Datos de entrada: se agregaron las páginas Registro e Ingreso. Resultado esperado: antes decía "sin cortes". Ahora dice que ningún campo ni botón se sale por los lados. | "Sin cortes" no decía cómo comprobarlo. |
| CP-16.2 (MLIG-89) | Datos de entrada: se agregó que se prueban los **6 carruseles**. | No decía cuántos carruseles se revisan. |
| CP-17.1 (MLIG-91) | Resultado esperado: antes decía "se abre ampliada". Ahora dice que la imagen de la ventana es **más grande que la miniatura**. | "Ampliada" no decía cómo comprobarlo. |
| CP-20.3 (MLIG-102) | Pasos y resultado esperado: se agregó revisar que existan los **íconos del manifest**. | El resultado obtenido ya hablaba de ese error (MLIG-127), pero el caso no lo pedía. |

Las tareas de plan de cada historia (MLIG-19, 20, 22, 23, 25 a 30, 83, 84 y 87) se corrigieron igual que sus casos.

## 3. Otros cambios del plan

- **28/10/2026:** se registró el resultado de los 61 casos (25 Pasa, 36 Falla), con fecha de ejecución. Se adjuntó una captura a cada bug y el plan general recibió la sección "Resultado de la ejecución".
- **04/11/2026:** los 61 casos recibieron la etiqueta "automatizado" (Playwright, 133 pruebas).
- **13/11/2026:** el plan general (MLIG-16) recibió las secciones "Automatización" y "Cambios del plan".

La relación entre cada caso y su prueba automática está en `MATRIZ-TRAZABILIDAD.md`.
