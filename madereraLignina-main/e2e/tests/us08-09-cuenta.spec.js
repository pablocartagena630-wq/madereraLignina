const { test, expect, knownBug, PAGINAS } = require('./helpers');

test.describe('US-08 · Registrarme como cliente (MLIG-8)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGINAS.registro);
  });

  const llenar = async (page, { terminos = true } = {}) => {
    await page.getByLabel('Nombre', { exact: true }).fill('Juan');
    await page.getByLabel('Apellido').fill('Pérez');
    await page.getByLabel('Nombre de usuario').fill('juanp');
    await page.getByLabel('Ciudad').fill('Medellín');
    await page.getByLabel('Zona').selectOption('Centro');
    await page.getByLabel('Postal').fill('050001');
    if (terminos) await page.getByLabel('Acepto términos y condiciones').check();
  };
  const registrar = (page) => page.getByRole('button', { name: 'Registrarme!' }).click();

  // CP-08.1 · CA1 (MLIG-24 / sub-tarea de CA1)
  test('CP-08.1 · datos válidos + términos crean la cuenta y confirman', async ({ page }) => {
    knownBug('MLIG-110');
    await llenar(page);
    await registrar(page);
    await expect(page.getByText(/registro (exitoso|completado)|cuenta (creada|registrada)|bienvenid/i)).toBeVisible();
  });

  // CP-08.2 · CA2
  test('CP-08.2 · formulario vacío muestra error en cada campo obligatorio y no se envía', async ({ page }) => {
    knownBug('MLIG-111');
    await registrar(page);
    await expect(page).toHaveURL(/registro\.html$/);
    // cada campo obligatorio debe mostrar su mensaje de error visible
    await expect(page.locator('.invalid-feedback:visible')).toHaveCount(7); // 6 campos + términos
  });

  test('CP-08.2 · el campo Apellido arranca vacío (no con "required")', async ({ page }) => {
    knownBug('MLIG-112');
    await expect(page.getByLabel('Apellido')).toHaveValue('');
  });

  // CP-08.3 · CA3
  test('CP-08.3 · sin aceptar términos muestra "Debes aceptar antes de registrarte."', async ({ page }) => {
    knownBug('MLIG-111');
    await llenar(page, { terminos: false });
    await registrar(page);
    await expect(page).toHaveURL(/registro\.html$/);
    await expect(page.getByText('Debes aceptar antes de registrarte.')).toBeVisible();
  });

  // CP-08.4 · CA4
  test('CP-08.4 · el registro pide correo electrónico y contraseña', async ({ page }) => {
    knownBug('MLIG-113');
    await expect(page.locator('input[type="email"]')).toHaveCount(1);
    await expect(page.locator('input[type="password"]')).toHaveCount(1);
  });
});

test.describe('US-09 · Ingresar con mi cuenta (MLIG-9)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGINAS.ingreso);
  });

  const ingresar = async (page, correo, clave) => {
    await page.getByLabel('Email').fill(correo);
    await page.getByLabel('Contraseña').fill(clave);
    await page.getByRole('button', { name: 'Ingresar' }).click();
  };

  // CP-09.1 · CA1
  test('CP-09.1 · credenciales válidas ingresan y el encabezado lo indica', async ({ page }) => {
    knownBug('MLIG-114');
    await ingresar(page, 'juan@correo.com', 'Clave123');
    await expect(page.getByText(/cerrar sesi[oó]n|hola,? juan/i)).toBeVisible();
  });

  // CP-09.2 · CA2
  test('CP-09.2 · contraseña incorrecta muestra mensaje de credenciales incorrectas', async ({ page }) => {
    knownBug('MLIG-114');
    await ingresar(page, 'juan@correo.com', 'ClaveMala');
    await expect(page.getByText(/credenciales incorrectas/i)).toBeVisible();
  });

  // CP-09.3 · CA3
  test('CP-09.3 · correo con formato inválido ("juan@") se rechaza', async ({ page }) => {
    await ingresar(page, 'juan@', 'Clave123');
    await expect(page).toHaveURL(/ingreso\.html$/);
    const valido = await page.getByLabel('Email').evaluate((i) => i.validity.valid);
    expect(valido).toBe(false);
  });

  test('CP-09.3 · correo vacío se rechaza con un mensaje claro', async ({ page }) => {
    knownBug('MLIG-115');
    await ingresar(page, '', 'Clave123');
    const valido = await page.getByLabel('Email').evaluate((i) => i.validity.valid);
    expect(valido, 'el campo de correo vacío debe ser inválido').toBe(false);
  });

  // CP-09.4 · CA4
  test('CP-09.4 · los caracteres de la contraseña se muestran ocultos', async ({ page }) => {
    await expect(page.getByLabel('Contraseña')).toHaveAttribute('type', 'password');
  });
});
