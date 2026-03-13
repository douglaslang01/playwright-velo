import { test, expect } from '../support/fixtures';

test.describe('Configuração do Veiculo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/configure');
  });

  test('deve refletir a cor selecionada na imagem do veículo mantendo o preço base', async ({ page }) => {
    const basePrice = 'R$ 40.000,00';
    const totalPrice = page.getByTestId('total-price');
    const car = page.locator('img[alt^="Velô Sprint"]');

    await expect(totalPrice).toBeVisible();
    await expect(totalPrice).toHaveText(basePrice);

    await page.getByTestId('color-option-midnight-black').click();
    await expect(totalPrice).toHaveText(basePrice);

    await expect(car).toHaveAttribute('src', '/src/assets/midnight-black-aero-wheels.png');
  });

  test('deve recalcular o preço total e atualizar a imagem ao trocar o modelo das rodas', async ({ page }) => {
    const basePrice = 'R$ 40.000,00';
    const totalPrice = page.getByTestId('total-price');
    const car = page.locator('img[alt^="Velô Sprint"]');

    await expect(totalPrice).toBeVisible();
    await expect(totalPrice).toHaveText(basePrice);

    await page.getByTestId('wheel-option-sport').click();
    await expect(totalPrice).toHaveText('R$ 42.000,00');

    await expect(car).toHaveAttribute('src', '/src/assets/glacier-blue-sport-wheels.png');

    await page.getByTestId('wheel-option-aero').click();
    await expect(totalPrice).toHaveText(basePrice);
  });
});
