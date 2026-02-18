import { test, expect } from '@playwright/test';
import { generateOrderCode } from '../support/helpers';
import { OrderLookupPage } from '../support/pages/OrderLookupPage';


// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {

    let orderLookupPage: OrderLookupPage;

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/');
        await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');

        await page.getByRole('link', { name: 'Consultar Pedido' }).click();
        await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

        orderLookupPage = new OrderLookupPage(page);
    });

    test('deve consultar um pedido aprovado', async ({ page }) => {

        // Test data
        const order = {
            number: 'VLO-85DC4D',
            status: 'APROVADO' as const,
            color: 'Lunar White',
            weels: 'sport Wheels',
            customer: {
                name: 'Douglas Lang',
                email: 'douglas.lang@velo.dev'
            },
            payment: 'À Vista'
        };

        // Act
        await orderLookupPage.searchOrder(order.number);

        // Assert

        // const containerPedido = page.getByRole('paragraph')
        //     .filter({ hasText: /^Pedido$/ })
        //     .locator('..'); // Sobe para o elemento pai (div que agrupa ambos)
        // await expect(containerPedido).toContainText(order, { timeout: 10_000 });
        // await expect(page.getByText('APROVADO')).toBeVisible();

        await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
            - img
            - paragraph: Pedido
            - paragraph: ${order.number}
            - status:
                - img
                - text: ${order.status}
            - img "Velô Sprint"
            - paragraph: Modelo
            - paragraph: Velô Sprint
            - paragraph: Cor
            - paragraph: ${order.color}
            - paragraph: Interior
            - paragraph: cream
            - paragraph: Rodas
            - paragraph: ${order.weels}
            - heading "Dados do Cliente" [level=4]
            - paragraph: Nome
            - paragraph: ${order.customer.name}
            - paragraph: Email
            - paragraph: ${order.customer.email}
            - paragraph: Loja de Retirada
            - paragraph
            - paragraph: Data do Pedido
            - paragraph: /\\d+\\/\\d+\\/\\d+/
            - heading "Pagamento" [level=4]
            - paragraph: ${order.payment}
            - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
            `);

        await orderLookupPage.validateStatusBadge(order.status);
    });

    test('deve consultar um pedido reprovado', async ({ page }) => {

        const order = {
            number: 'VLO-8IER0M',
            status: 'REPROVADO' as const,
            color: 'Midnight Black',
            weels: 'sport Wheels',
            customer: {
                name: 'Steve Jobs',
                email: 'steve.jobs@apple.com'
            },
            payment: 'À Vista'
        };

        // Act
        await orderLookupPage.searchOrder(order.number);

        // Assert
        await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
            - img
            - paragraph: Pedido
            - paragraph: ${order.number}
            - status:
                - img
                - text: ${order.status}
            - img "Velô Sprint"
            - paragraph: Modelo
            - paragraph: Velô Sprint
            - paragraph: Cor
            - paragraph: ${order.color}
            - paragraph: Interior
            - paragraph: cream
            - paragraph: Rodas
            - paragraph: ${order.weels}
            - heading "Dados do Cliente" [level=4]
            - paragraph: Nome
            - paragraph: ${order.customer.name}
            - paragraph: Email
            - paragraph: ${order.customer.email}
            - paragraph: Loja de Retirada
            - paragraph
            - paragraph: Data do Pedido
            - paragraph: /\\d+\\/\\d+\\/\\d+/
            - heading "Pagamento" [level=4]
            - paragraph: ${order.payment}
            - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
            `);

        await orderLookupPage.validateStatusBadge(order.status);
    });

    test('deve consultar um pedido em análise', async ({ page }) => {

        const order = {
            number: 'VLO-MSH7ZK',
            status: 'EM_ANALISE' as const,
            color: 'Glacier Blue',
            weels: 'aero Wheels',
            customer: {
                name: 'Joao da Silva',
                email: 'joao.silva@velo.dev'
            },
            payment: 'À Vista'
        };

        // Act
        await orderLookupPage.searchOrder(order.number);

        // Assert
        await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
            - img
            - paragraph: Pedido
            - paragraph: ${order.number}
            - status:
                - img
                - text: ${order.status}
            - img "Velô Sprint"
            - paragraph: Modelo
            - paragraph: Velô Sprint
            - paragraph: Cor
            - paragraph: ${order.color}
            - paragraph: Interior
            - paragraph: cream
            - paragraph: Rodas
            - paragraph: ${order.weels}
            - heading "Dados do Cliente" [level=4]
            - paragraph: Nome
            - paragraph: ${order.customer.name}
            - paragraph: Email
            - paragraph: ${order.customer.email}
            - paragraph: Loja de Retirada
            - paragraph
            - paragraph: Data do Pedido
            - paragraph: /\\d+\\/\\d+\\/\\d+/
            - heading "Pagamento" [level=4]
            - paragraph: ${order.payment}
            - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
            `);

        await orderLookupPage.validateStatusBadge(order.status);
    });

    test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {
        // Arrange
        const order = generateOrderCode();

        // Act
        await orderLookupPage.searchOrder(order);

        // Assert
        await expect(page.locator('#root')).toMatchAriaSnapshot(`
            - img
            - heading "Pedido não encontrado" [level=3]
            - paragraph: Verifique o número do pedido e tente novamente
        `);
    });
});