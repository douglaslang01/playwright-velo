import { test, expect } from '../support/fixtures';
import testData from '../support/fixtures/checkout.json' with {type: 'json'};
import { deleteOrderByEmailAndDocument } from '../support/database/orderRepository';
import { formatDocument } from '../support/helpers';

test.describe('Checkout', () => {

    test.describe('Validações de campos obrigatórios', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let alerts: any;

        test.beforeEach(async ({ page, app }) => {
            await page.goto('/order');
            await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible();

            alerts = app.checkout.elements.alerts;
        });

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

    test.describe('Fluxos de Pagamento', () => {
        test('deve aprovar pedido com pagamento à vista passando pelo fluxo E2E (landing, configurador e checkout)', async ({ page, app }) => {

            const customer = testData.e2e;
            customer.document = formatDocument(customer.document);
            await deleteOrderByEmailAndDocument(customer.email, customer.document);

            // Arrange
            await page.goto('/');

            await page.getByRole('link', { name: /Configure Agora/i }).click();

            await expect(page.getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
            await app.configurator.expectPrice(customer.totalPrice);
            await app.configurator.finishConfigurator();

            await app.checkout.expectLoaded();

            await app.checkout.fillCustomerlData(customer);
            await app.checkout.selectStore(customer.store);

            // Act
            await app.checkout.selectPaymentMethod(customer.paymentMethod);
            await app.checkout.expectSummaryTotal(customer.totalPrice);
            await app.checkout.acceptTerms();
            await app.checkout.submit();

            // Assert
            await expect(page).toHaveURL(/\/success/);
            await expect(page.getByRole('heading', { name: 'Pedido Aprovado!' })).toBeVisible();
            await expect(page.getByText(`${customer.name} ${customer.lastname}`)).toBeVisible();
        });

        test('deve aprovar automaticamente o crédito quando o score do CPF for maior que 700 no financiamento', async ({ page, app }) => {

            const customer = testData.creditApproval;
            customer.document = formatDocument(customer.document);
            await deleteOrderByEmailAndDocument(customer.email, customer.document);

            await page.route('**/functions/v1/credit-analysis', route => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        status: 'Done',
                        score: 701,
                    }),
                });
            });


            // Arrange
            await page.goto('/');

            await page.getByRole('link', { name: /Configure Agora/i }).click();

            await expect(page.getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
            await app.configurator.expectPrice(customer.totalPrice);
            await app.configurator.finishConfigurator();
            await app.checkout.expectLoaded();

            await app.checkout.fillCustomerlData(customer);
            await app.checkout.selectStore(customer.store);

            // Act
            await app.checkout.selectPaymentMethod(customer.paymentMethod);
            //await app.checkout.expectSummaryTotal(customer.totalPrice);
            await app.checkout.acceptTerms();
            await app.checkout.submit();

            // Assert
            await expect(page).toHaveURL(/\/success/);
            await expect(page.getByRole('heading', { name: 'Pedido Aprovado!' })).toBeVisible();
            await expect(page.getByText(`${customer.name} ${customer.lastname}`)).toBeVisible();
        });

        test('deve deixar o pedido em análise quando o score do CPF for entre 501 e 700 no financiamento', async ({ page, app }) => {

            const customer = testData.creditInAnalysis;
            customer.document = formatDocument(customer.document);
            await deleteOrderByEmailAndDocument(customer.email, customer.document);

            await page.route('**/functions/v1/credit-analysis', route => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        status: 'Done',
                        score: 600,
                    }),
                });
            });


            // Arrange
            await page.goto('/');

            await page.getByRole('link', { name: /Configure Agora/i }).click();

            await expect(page.getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
            await app.configurator.expectPrice(customer.totalPrice);
            await app.configurator.finishConfigurator();
            await app.checkout.expectLoaded();

            await app.checkout.fillCustomerlData(customer);
            await app.checkout.selectStore(customer.store);

            // Act
            await app.checkout.selectPaymentMethod(customer.paymentMethod);
            await app.checkout.acceptTerms();
            await app.checkout.submit();

            // Assert
            await expect(page).toHaveURL(/\/success/);
            await expect(page.getByRole('heading', { name: 'Pedido em Análise!' })).toBeVisible();
            await expect(page.getByText(`${customer.name} ${customer.lastname}`)).toBeVisible();
        });

        test('deve reprovar o crédito com score <= 500 no financiamento sem entrada', async ({ page, app }) => {

            const customer = testData.creditRejected;
            customer.document = formatDocument(customer.document);
            await deleteOrderByEmailAndDocument(customer.email, customer.document);

            await page.route('**/functions/v1/credit-analysis', route => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        status: 'Done',
                        score: 500,
                    }),
                });
            });

            // Arrange
            await page.goto('/');

            await page.getByRole('link', { name: /Configure Agora/i }).click();

            await expect(page.getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
            await app.configurator.expectPrice(customer.totalPrice);
            await app.configurator.finishConfigurator();
            await app.checkout.expectLoaded();

            await app.checkout.fillCustomerlData(customer);
            await app.checkout.selectStore(customer.store);

            // Act
            await app.checkout.selectPaymentMethod(customer.paymentMethod);
            await app.checkout.acceptTerms();
            await app.checkout.submit();

            // Assert
            await expect(page).toHaveURL(/\/success/);
            await expect(page.getByRole('heading', { name: 'Crédito Reprovado' })).toBeVisible();
            await expect(page.getByText(`${customer.name} ${customer.lastname}`)).toBeVisible();
        });

        test('deve reprovar o crédito com score <= 500 no financiamento com entrada menor que 50%', async ({ page, app }) => {

            const customer = testData.creditRejectedWithDownPayment;
            customer.document = formatDocument(customer.document);
            await deleteOrderByEmailAndDocument(customer.email, customer.document);

            await page.route('**/functions/v1/credit-analysis', route => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        status: 'Done',
                        score: 400,
                    }),
                });
            });

            // Arrange
            await page.goto('/');
            await page.getByRole('link', { name: /Configure Agora/i }).click();

            await expect(page.getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
            await app.configurator.expectPrice(customer.totalPrice);
            await app.configurator.finishConfigurator();
            await app.checkout.expectLoaded();

            await app.checkout.fillCustomerlData(customer);
            await app.checkout.selectStore(customer.store);

            // Act
            await app.checkout.selectPaymentMethod(customer.paymentMethod);
            await app.checkout.fillDownPayment(customer.downPayment); // 👈 key difference
            await app.checkout.acceptTerms();
            await app.checkout.submit();

            // Assert
            await expect(page).toHaveURL(/\/success/);
            await expect(page.getByRole('heading', { name: 'Crédito Reprovado' })).toBeVisible();
            await expect(page.getByText(`${customer.name} ${customer.lastname}`)).toBeVisible();
        });

        test('deve aprovar o crédito com score <= 500 no financiamento com entrada igual a 50%', async ({ page, app }) => {

            const customer = testData.creditApprovedWithDownPaymentEqualTo50;
            customer.document = formatDocument(customer.document);
            await deleteOrderByEmailAndDocument(customer.email, customer.document);

            await page.route('**/functions/v1/credit-analysis', route => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        status: 'Done',
                        score: 450,
                    }),
                });
            });

            // Arrange
            await page.goto('/');
            await page.getByRole('link', { name: /Configure Agora/i }).click();

            await expect(page.getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
            await app.configurator.expectPrice(customer.totalPrice);
            await app.configurator.finishConfigurator();
            await app.checkout.expectLoaded();

            await app.checkout.fillCustomerlData(customer);
            await app.checkout.selectStore(customer.store);

            // Act
            await app.checkout.selectPaymentMethod(customer.paymentMethod);
            await app.checkout.fillDownPayment(customer.downPayment); // 👈 key difference
            await app.checkout.acceptTerms();
            await app.checkout.submit();

            // Assert
            await expect(page).toHaveURL(/\/success/);
            await expect(page.getByRole('heading', { name: 'Pedido Aprovado!' })).toBeVisible();
            await expect(page.getByText(`${customer.name} ${customer.lastname}`)).toBeVisible();
        });

        test('deve aprovar o crédito com score <= 500 no financiamento com entrada maior que 50%', async ({ page, app }) => {

            const customer = testData.creditApprovedWithDownPaymentGreaterThan50;
            customer.document = formatDocument(customer.document);
            await deleteOrderByEmailAndDocument(customer.email, customer.document);

            await page.route('**/functions/v1/credit-analysis', route => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        status: 'Done',
                        score: 300,
                    }),
                });
            });

            // Arrange
            await page.goto('/');
            await page.getByRole('link', { name: /Configure Agora/i }).click();

            await expect(page.getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
            await app.configurator.expectPrice(customer.totalPrice);
            await app.configurator.finishConfigurator();
            await app.checkout.expectLoaded();

            await app.checkout.fillCustomerlData(customer);
            await app.checkout.selectStore(customer.store);

            // Act
            await app.checkout.selectPaymentMethod(customer.paymentMethod);
            await app.checkout.fillDownPayment(customer.downPayment); // 👈 key difference
            await app.checkout.acceptTerms();
            await app.checkout.submit();

            // Assert
            await expect(page).toHaveURL(/\/success/);
            await expect(page.getByRole('heading', { name: 'Pedido Aprovado!' })).toBeVisible();
            await expect(page.getByText(`${customer.name} ${customer.lastname}`)).toBeVisible();
        });
    });
});
