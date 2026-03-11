import { test, expect } from '../support/fixtures';

test.describe('CT02 - Configuração do Veiculo (Cores e Rodas)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/configure');
  });

  test('deve atualizar preço ao alterar rodas para Sport', async ({ page }) => {
    // Arrange - elementos da pagina
    const basePrice = 'R$ 40.000,00';

    const totalPrice = page.getByTestId('total-price');
    await expect(totalPrice).toBeVisible();
    await expect(totalPrice).toHaveText(basePrice);

    const midnightBlackColorOption = page.getByTestId('color-option-midnight-black');
    await midnightBlackColorOption.click();

    await expect(totalPrice).toHaveText(basePrice);

    const sportWheelsOption = page.getByTestId('wheel-option-sport');
    await sportWheelsOption.click();

    await expect(totalPrice).toHaveText('R$ 42.000,00');

    const aeroWheelsOption = page.getByTestId('wheel-option-aero');
    await aeroWheelsOption.click();

    await expect(totalPrice).toHaveText(basePrice);
  });
});
