import { test } from '@playwright/test';
import { generateOrderCode } from '../support/helpers';
import { Header } from '../support/components/Header';
import { HomePage } from '../support/pages/HomePage';
import { OrderLookupPage, OrderDetails } from '../support/pages/OrderLookupPage';

test.describe('Consulta de Pedido', () => {

    let orderLookupPage: OrderLookupPage;

    test.beforeEach(async ({ page }) => {
        await new HomePage(page).goto();
        await new Header(page).orderLookupLink();

        orderLookupPage = new OrderLookupPage(page);
        await orderLookupPage.validatePageLoaded();
    });

    test('deve consultar um pedido aprovado', async () => {

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

        await orderLookupPage.searchOrder(order.number);

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

        await orderLookupPage.searchOrder(order.number);

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

        await orderLookupPage.searchOrder(order.number);

        await orderLookupPage.validateOrderDetails(order);
        await orderLookupPage.validateStatusBadge(order.status);
    });

    test('deve exibir mensagem quando o pedido não é encontrado', async () => {
        const order = generateOrderCode();

        await orderLookupPage.searchOrder(order);

        await orderLookupPage.validateOrderNotFound();
    });

    test('deve exibir mensagem quando o número do pedido está fora do padrão', async () => {
        const order = '123-XYZ';

        await orderLookupPage.searchOrder(order);

        await orderLookupPage.validateOrderNotFound();
    });
});