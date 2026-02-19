import { Page } from "@playwright/test";

export class Header {

    constructor(private page: Page) { }

    async orderLookupLink() {
        await this.page.getByRole('link', { name: 'Consultar Pedido' }).click();
    }
}
