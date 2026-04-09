import { test, expect } from '../support/fixtures';
import testData from '../support/fixtures/checkout.json' with {type: 'json'};

test.describe('Checkout', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let alerts: any;

    test.beforeEach(async ({ page, app }) => {
        await page.goto('/order');
        await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible();

        alerts = app.checkout.elements.alerts;
    });

    test.describe('Validações de campos obrigatórios', () => {
        test('deve validar obrigatoriedade de todos os campos em branco', async ({ app }) => {
            // Act
            await app.checkout.submit();

            // Assert
            await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres');
            await expect(alerts.lastname).toHaveText('Sobrenome deve ter pelo menos 2 caracteres');
            await expect(alerts.email).toHaveText('Email inválido');
            await expect(alerts.phone).toHaveText('Telefone inválido');
            await expect(alerts.document).toHaveText('CPF inválido');
            await expect(alerts.store).toHaveText('Selecione uma loja');
            await expect(alerts.terms).toHaveText('Aceite os termos');
        });

        test('deve validar o limite mínimo de caractteres para Nome e Sobrenome', async ({ app }) => {
            // Arrange
            await app.checkout.fillCustomerlData(testData.invalid);
            await app.checkout.selectStore('Velô Paulista');
            await app.checkout.acceptTerms();

            // Act
            await app.checkout.submit();

            // Assert
            await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres');
            await expect(alerts.lastname).toHaveText('Sobrenome deve ter pelo menos 2 caracteres');
        });

        test('deve exibir erro para e-mail incorreto', async ({ app }) => {
            // Arrange
            await app.checkout.fillCustomerlData(testData.invalid);
            await app.checkout.selectStore('Velô Paulista');
            await app.checkout.acceptTerms();

            // Act
            await app.checkout.submit();

            // Assert
            await expect(alerts.email).toHaveText('Email inválido');
        });

        test('deve exibir erro para CPF incorreto', async ({ app }) => {
            const customer = { ...testData.invalid };
            customer.document = '';

            // Arrange
            await app.checkout.fillCustomerlData(customer);
            await app.checkout.selectStore('Velô Paulista');
            await app.checkout.acceptTerms();

            // Act
            await app.checkout.submit();

            // Assert
            await expect(alerts.document).toHaveText('CPF inválido');
        });

        test('deve exigir o aceite dos termos ao finalizar com dados válidos', async ({ app }) => {
            // Arrange
            await app.checkout.fillCustomerlData(testData.valid);
            await app.checkout.selectStore('Velô Paulista');

            await expect(app.checkout.elements.terms).not.toBeChecked();
            await app.checkout.submit();

            // Assert
            await expect(alerts.terms).toHaveText('Aceite os termos');
        });
    });
});
