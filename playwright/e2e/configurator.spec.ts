import { test, expect } from '../support/fixtures';

test.describe('Configuração do Veiculo', () => {
  const initialPrice = 'R$ 40.000,00';

  test.beforeEach(async ({ app }) => {
    await app.configurator.open();
  });

  test('deve manter o preço base ao alterar a cor do veículo', async ({ app }) => {
    await app.configurator.expectPrice(initialPrice);

    await app.configurator.selectColor('Midnight Black');
    await app.configurator.expectPrice(initialPrice);
    await app.configurator.expectCarImageSrc('/src/assets/midnight-black-aero-wheels.png')
  });

  test('deve atualizar preço ao alterar rodas para Sport e retornar ao padrão com Aero', async ({ app }) => {
    await app.configurator.expectPrice(initialPrice);

    await app.configurator.selecttWheels(/Sport Wheels/);
    await app.configurator.expectPrice('R$ 42.000,00');
    await app.configurator.expectCarImageSrc('/src/assets/glacier-blue-sport-wheels.png')

    await app.configurator.selecttWheels(/Aero Wheels/);
    await app.configurator.expectPrice(initialPrice);
    await app.configurator.expectCarImageSrc('/src/assets/glacier-blue-aero-wheels.png')
  });
});
