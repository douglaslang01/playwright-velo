import { expect, Locator, Page } from '@playwright/test';

export function createConfiguratorActions(page: Page) {
  return {
    async open() {
      await page.goto('/configure');
    },

    async expectLoaded() {
      await expect(page.getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
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

    async finishConfigurator() {
      //await page.getByTestId('checkout-button').click();
      await page.getByRole('button', { name: 'Monte o Seu' }).click();
    }
  };
}
