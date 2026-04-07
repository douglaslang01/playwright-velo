import { test, expect } from '../support/fixtures';
import { generateOrderCode } from '../support/helpers';
import { OrderDetails } from '../support/actions/orderLookupActions';
import { insertOrder, deleteOrderByNumber } from '../support/database/orderRepository';
import crypto from 'crypto';


test.describe('Consulta de Pedido', () => {
    test.beforeEach(async ({ app }) => {
        await app.orderLookup.open();
    });

    test('deve consultar um pedido aprovado', async ({ app }) => {
        const order: OrderDetails = {
            number: 'VLO-SE4R01',
            status: 'APROVADO',
            color: 'Lunar White',
            weels: 'sport Wheels',
            customer: {
                name: 'Douglas Lang',
                email: 'douglas.lang@velo.dev',
                document: '982.359.660-34',
                phone: '(51) 99349-4410'
            },
            payment: 'À Vista',
            total_price: '52500'
        };

        await deleteOrderByNumber(order.number);

        await insertOrder(order, ['flux-capacitor', 'precision-park']);

        await app.orderLookup.searchOrder(order.number);

        await app.orderLookup.validateOrderDetails(order);
        await app.orderLookup.validateStatusBadge(order.status);
    });

    test('deve consultar um pedido reprovado', async ({ app }) => {
        const order: OrderDetails = {
            number: 'VLO-SE4R02',
            status: 'REPROVADO',
            color: 'Midnight Black',
            weels: 'sport Wheels',
            customer: {
                name: 'Steve Jobs',
                email: 'steve.jobs@apple.com',
                document: '288.456.800-02',
                phone: '(51) 99999-9999'
            },
            payment: 'À Vista',
            total_price: '52500',
        };

        await deleteOrderByNumber(order.number);

        await insertOrder(order, ['flux-capacitor', 'precision-park']);

        await app.orderLookup.searchOrder(order.number);

        await app.orderLookup.validateOrderDetails(order);
        await app.orderLookup.validateStatusBadge(order.status);
    });

    test('deve consultar um pedido em análise', async ({ app }) => {
        const order: OrderDetails = {
            number: 'VLO-SE4R03',
            status: 'EM_ANALISE',
            color: 'Glacier Blue',
            weels: 'aero Wheels',
            customer: {
                name: 'Joao da Silva',
                email: 'joao.silva@velo.dev',
                document: '795.919.250-26',
                phone: '(51) 99999-9999'
            },
            payment: 'À Vista',
            total_price: '40000'
        };

        await deleteOrderByNumber(order.number);

        await insertOrder(order);

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