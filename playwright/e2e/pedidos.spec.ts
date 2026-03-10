import { test, expect } from '../support/fixtures';
import { generateOrderCode } from '../support/helpers';
import { OrderDetails } from '../support/actions/orderLookupActions';

test.describe('Consulta de Pedido', () => {

    test.beforeEach(async ({ app }) => {
        await app.orderLookup.open();
    });

    test('deve consultar um pedido aprovado', async ({ app }) => {

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

        await app.orderLookup.searchOrder(order.number);

        await app.orderLookup.validateOrderDetails(order);
        await app.orderLookup.validateStatusBadge(order.status);
    });

    test('deve consultar um pedido reprovado', async ({ app }) => {

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

        await app.orderLookup.searchOrder(order.number);

        await app.orderLookup.validateOrderDetails(order);
        await app.orderLookup.validateStatusBadge(order.status);
    });

    test('deve consultar um pedido em análise', async ({ app }) => {

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

        await app.orderLookup.searchOrder(order.number);

        await app.orderLookup.validateOrderDetails(order);
        await app.orderLookup.validateStatusBadge(order.status);
    });

    test('deve exibir mensagem quando o pedido não é encontrado', async ({ app }) => {
        const order = generateOrderCode();

        await app.orderLookup.searchOrder(order);

        await app.orderLookup.validateOrderNotFound();
    });

    test('deve exibir mensagem quando o número do pedido está fora do padrão', async ({ app }) => {
        const order = '123-XYZ';

        await app.orderLookup.searchOrder(order);

        await app.orderLookup.validateOrderNotFound();
    });

    test('deve manter o botão de buscar pedido desabilitado quando o campo de busca está vazio ou contém apenas espaços', async ({ app }) => {
        await expect(app.orderLookup.elements.searchButton).toBeDisabled();
        await app.orderLookup.elements.orderInput.fill('   ');

        await expect(app.orderLookup.elements.searchButton).toBeDisabled();
    });
});