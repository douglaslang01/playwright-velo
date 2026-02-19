import { Page, expect } from "@playwright/test"

export type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE';

export interface OrderDetails {
    number: string;
    status: OrderStatus;
    color: string;
    weels: string;
    customer: {
        name: string;
        email: string;
    };
    payment: string;
}

export class OrderLookupPage {

    constructor(private page: Page) { }

    async searchOrder(code: string) {
        await this.page.getByRole('textbox', { name: 'Número do Pedido' }).fill(code);
        await this.page.getByRole('button', { name: 'Buscar Pedido' }).click();
    }

    async validateStatusBadge(status: OrderStatus) {
        const statusBadgeConfigs = {
            'APROVADO': { bgClass: 'bg-green-100', textClass: 'text-green-700', iconClass: 'lucide-circle-check-big' },
            'REPROVADO': { bgClass: 'bg-red-100', textClass: 'text-red-700', iconClass: 'lucide-circle-x' },
            'EM_ANALISE': { bgClass: 'bg-amber-100', textClass: 'text-amber-700', iconClass: 'lucide-clock' }
        } as const;

        const config = statusBadgeConfigs[status];
        const statusBadge = this.page.getByRole('status').filter({ hasText: status });

        await expect(statusBadge).toHaveClass(new RegExp(config.bgClass));
        await expect(statusBadge).toHaveClass(new RegExp(config.textClass));

        const statusIcon = statusBadge.locator('svg');
        await expect(statusIcon).toHaveClass(new RegExp(config.iconClass));
    }

    async validateOrderDetails(order: OrderDetails) {
        const orderResult = this.page.getByTestId(`order-result-${order.number}`);
        await expect(orderResult).toMatchAriaSnapshot(`
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
    }

    async validateOrderNotFound() {
        await expect(this.page.locator('#root')).toMatchAriaSnapshot(`
            - img
            - heading "Pedido não encontrado" [level=3]
            - paragraph: Verifique o número do pedido e tente novamente
        `);
    }
}