import { expect, Page } from '@playwright/test';

export function createCheckoutActions(page: Page) {
  return {
    async expectLoaded() {
      await expect(page).toHaveURL(/\/order$/);
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible();
    },

    async expectSummary(totalPrice: string) {
      await expect(page.getByRole('heading', { name: 'Resumo' })).toBeVisible();
      await expect(page.getByTestId('summary-total-price')).toHaveText(totalPrice);
      await expect(page.getByTestId('payment-avista')).toContainText(totalPrice);
    },
  };
}
