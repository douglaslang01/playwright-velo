import { test, expect } from '../support/fixtures';
import { generateOrderCode } from '../support/helpers';
import { OrderDetails } from '../support/actions/orderLookupActions';
import { insertOrder, deleteOrderByNumber } from '../support/database/orderRepository';
import testData from '../support/fixtures/orders.json' with {type: 'json'};

type OrderFixture = {
    order: OrderDetails;
    optionals?: string[];
};
type OrderFixtures = {
    approved: OrderFixture;
    rejected: OrderFixture;
    inAnalysis: OrderFixture;
};
const orderFixtures = testData as OrderFixtures;

test.describe('Consulta de Pedido', () => {
    test.beforeEach(async ({ app }) => {
        await app.orderLookup.open();
    });

    test('deve consultar um pedido aprovado', async ({ app }) => {
        const { order, optionals } = orderFixtures.approved;

        await deleteOrderByNumber(order.number);

        await insertOrder(order, optionals);

        await app.orderLookup.searchOrder(order.number);

        await app.orderLookup.validateOrderDetails(order);
        await app.orderLookup.validateStatusBadge(order.status);
    });

    test('deve consultar um pedido reprovado', async ({ app }) => {
        const { order, optionals } = orderFixtures.rejected;

        await deleteOrderByNumber(order.number);

        await insertOrder(order, optionals);

        await app.orderLookup.searchOrder(order.number);

        await app.orderLookup.validateOrderDetails(order);
        await app.orderLookup.validateStatusBadge(order.status);
    });

    test('deve consultar um pedido em análise', async ({ app }) => {
        const { order, optionals } = orderFixtures.inAnalysis;

        await deleteOrderByNumber(order.number);

        await insertOrder(order, optionals);

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