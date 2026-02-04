import { test, expect } from '@playwright/test';
import { generateOrderCode } from '../support/helpers';

// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/');
        await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');

        await page.getByRole('link', { name: 'Consultar Pedido' }).click();
        await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
    });

    test('deve consultar um pedido aprovado', async ({ page }) => {

        const order = 'VLO-85DC4D'; // Test data

        // Act
        await page.getByTestId('search-order-id').fill(order);
        await page.getByRole('button', { name: 'Buscar Pedido' }).click();

        // Assert
        // const containerPedido = page.getByRole('paragraph')
        //     .filter({ hasText: /^Pedido$/ })
        //     .locator('..'); // Sobe para o elemento pai (div que agrupa ambos)
        // await expect(containerPedido).toContainText(order, { timeout: 10_000 });
        // await expect(page.getByText('APROVADO')).toBeVisible();

        await expect(page.getByTestId(`order-result-${order}`)).toMatchAriaSnapshot(`
            - img
            - paragraph: Pedido
            - paragraph: ${order}
            - img
            - text: APROVADO
            - img "Velô Sprint"
            - paragraph: Modelo
            - paragraph: Velô Sprint
            - paragraph: Cor
            - paragraph: Lunar White
            - paragraph: Interior
            - paragraph: cream
            - paragraph: Rodas
            - paragraph: sport Wheels
            - heading "Dados do Cliente" [level=4]
            - paragraph: Nome
            - paragraph: Douglas Lang
            - paragraph: Email
            - paragraph: douglas.lang@velo.dev
            - paragraph: Loja de Retirada
            - paragraph
            - paragraph: Data do Pedido
            - paragraph: /\\d+\\/\\d+\\/\\d+/
            - heading "Pagamento" [level=4]
            - paragraph: À Vista
            - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
            `);
    });

    test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {
        const order = generateOrderCode();

        await page.getByTestId('search-order-id').fill(order);
        await page.getByRole('button', { name: 'Buscar Pedido' }).click();

        await expect(page.locator('#root')).toMatchAriaSnapshot(`
            - img
            - heading "Pedido não encontrado" [level=3]
            - paragraph: Verifique o número do pedido e tente novamente
        `);
    });
});