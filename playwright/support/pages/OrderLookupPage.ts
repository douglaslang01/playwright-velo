import { Page, Locator, expect } from "@playwright/test"

type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE';

export class OrderLookupPage {
    private readonly inputOrderNumber: Locator;
    private readonly btnSearch: Locator;

    private readonly statusBadgeConfigs = {
        'APROVADO': { bgClass: 'bg-green-100', textClass: 'text-green-700', iconClass: 'lucide-circle-check-big' },
        'REPROVADO': { bgClass: 'bg-red-100', textClass: 'text-red-700', iconClass: 'lucide-circle-x' },
        'EM_ANALISE': { bgClass: 'bg-amber-100', textClass: 'text-amber-700', iconClass: 'lucide-clock' }
    };

    constructor(private page: Page) { }

    async searchOrder(code: string) {
        await this.page.getByRole('textbox', { name: 'Número do Pedido' }).fill(code);
        await this.page.getByRole('button', { name: 'Buscar Pedido' }).click();
    }

    async validateStatusBadge(status: OrderStatus) {
        const config = this.statusBadgeConfigs[status];
        const statusBadge = this.page.getByRole('status').filter({ hasText: status });

        await expect(statusBadge).toHaveClass(new RegExp(config.bgClass));
        await expect(statusBadge).toHaveClass(new RegExp(config.textClass));

        const statusIcon = statusBadge.locator('svg');
        await expect(statusIcon).toHaveClass(new RegExp(config.iconClass));
    }
}