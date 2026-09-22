import { test } from '../support/fixtures';

test.describe('Configuração do Veiculo', () => {
  const initialPrice = 'R$ 40.000,00';

  test.beforeEach(async ({ app }) => {
    await app.configurator.open();
  });

  test('deve manter o preço base ao alterar a cor do veículo', async ({ app }) => {
    await app.configurator.expectPrice(initialPrice);

    await app.configurator.selectColor('Midnight Black');
    await app.configurator.expectPrice(initialPrice);
    await app.configurator.expectCarImageSrc(/midnight-black-aero-wheels/)
  });

  test('deve atualizar preço ao alterar rodas para Sport e retornar ao padrão com Aero', async ({ app }) => {
    await app.configurator.expectPrice(initialPrice);

    await app.configurator.selecttWheels(/Sport Wheels/);
    await app.configurator.expectPrice('R$ 42.000,00');
    await app.configurator.expectCarImageSrc(/glacier-blue-sport-wheels/);

    await app.configurator.selecttWheels(/Aero Wheels/);
    await app.configurator.expectPrice(initialPrice);
    await app.configurator.expectCarImageSrc(/glacier-blue-aero-wheels/);
  });

  test('deve atualizar preço ao adicionar e remover opcionais e levar configuração correta ao checkout', async ({ app }) => {
    await app.configurator.expectPrice(initialPrice);

    await app.configurator.switchToggleOptional(/Precision Park/);
    await app.configurator.expectPrice('R$ 45.500,00');

    await app.configurator.switchToggleOptional(/Flux Capacitor/);
    await app.configurator.expectPrice('R$ 50.500,00');

    await app.configurator.switchToggleOptional(/Precision Park/);
    await app.configurator.expectPrice('R$ 45.000,00');

    await app.configurator.switchToggleOptional(/Flux Capacitor/);
    await app.configurator.expectPrice(initialPrice);

    await app.configurator.finishConfigurator();

    await app.checkout.expectLoaded();
    await app.checkout.expectSummaryTotal(initialPrice);
  });
});
