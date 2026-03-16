import { expect, Locator, Page } from '@playwright/test';

export function createConfiguratorActions(page: Page) {
  return {
    async open() {
      await page.goto('/configure');
    },

    async selectColor(name: string) {
      await page.getByRole('button', { name }).click();
    },

    async selecttWheels(name: string | RegExp) {
      await page.getByRole('button', { name }).click();
    },

    async switchToggleOptional(name: string | RegExp) {
      await page.getByRole('checkbox', { name }).click();
    },

    async expectPrice(price: string) {
      const priceElement: Locator = page.getByTestId('total-price');
      await expect(priceElement).toBeVisible();
      await expect(priceElement).toHaveText(price);
    },

    async expectCarImageSrc(src: string) {
      const carImage: Locator = page.locator('img[alt^="Velô Sprint"]');
      await expect(carImage).toHaveAttribute('src', src)
    },


    async proceedToOrder() {
      //await page.getByTestId('checkout-button').click();
      await page.getByRole('button', { name: 'Monte o Seu' }).click();
    },

    async expectOrderSummary(totalPrice: string) {
      await expect(page).toHaveURL(/\/order$/);
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Resumo' })).toBeVisible();
      await expect(page.getByTestId('summary-total-price')).toHaveText(totalPrice);
      await expect(page.getByTestId('payment-avista')).toContainText(totalPrice);
    },
  };
}
