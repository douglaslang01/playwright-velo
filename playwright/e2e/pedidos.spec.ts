import { test, expect } from '@playwright/test';
import { generateOrderCode } from '../support/helpers';
import { OrderLookupPage, OrderDetails } from '../support/pages/OrderLookupPage';


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

    test('deve consultar um pedido aprovado', async () => {

        // Test data
        const order: OrderDetails = {
            number: 'VLO-85DC4D',
            status: 'APROVADO',
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
        await orderLookupPage.validateOrderDetails(order);
        await orderLookupPage.validateStatusBadge(order.status);
    });

    test('deve consultar um pedido reprovado', async () => {

        const order: OrderDetails = {
            number: 'VLO-8IER0M',
            status: 'REPROVADO',
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
        await orderLookupPage.validateOrderDetails(order);
        await orderLookupPage.validateStatusBadge(order.status);
    });

    test('deve consultar um pedido em análise', async () => {

        const order: OrderDetails = {
            number: 'VLO-MSH7ZK',
            status: 'EM_ANALISE',
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
        await orderLookupPage.validateOrderDetails(order);
        await orderLookupPage.validateStatusBadge(order.status);
    });

    test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {
        // Arrange
        const order = generateOrderCode();

        // Act
        await orderLookupPage.searchOrder(order);

        // Assert
        await orderLookupPage.validateOrderNotFound();
    });

    test('deve exibir mensagem quando o número do pedido está fora do padrão', async () => {
        // Arrange
        const order = '123-XYZ';

        // Act
        await orderLookupPage.searchOrder(order);

        // Assert
        await orderLookupPage.validateOrderNotFound();
    });
});