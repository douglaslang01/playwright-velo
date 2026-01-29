import { test, expect } from '@playwright/test';
import { generateOrderCode } from '../support/helpers';

// AAA - Arrange, Act, Assert

test('deve consultar um pedido aprovado', async ({ page }) => {
    // Test data
    const order = 'VLO-85DC4D'

    // Arrange
    await page.goto('http://localhost:5173/');
    // Checkpoint 1: Verificar se a página de consulta de pedidos está carregada
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    // Checkpoint 2: Verificar se a página de consulta de pedidos está carregada
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

    // Act
    await page.getByTestId('search-order-id').fill(order);
    // await page.getByTestId('search-order-button').click();
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    // Assert
    //const orderCode = page.locator(`//p[text()="Pedido"]/..//p[text()="${order}"]`);
    // await expect(orderCode).toBeVisible({ timeout: 10_000 });

    const containerPedido = page.getByRole('paragraph')
        .filter({ hasText: /^Pedido$/ })
        .locator('..'); // Sobe para o elemento pai (div que agrupa ambos)
    await expect(containerPedido).toContainText(order, { timeout: 10_000 });

    await expect(page.getByText('APROVADO')).toBeVisible();
});

test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {
    const order = generateOrderCode();

    await page.goto('http://localhost:5173/');
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');

    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

    await page.getByTestId('search-order-id').fill(order);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    // const title = page.getByRole('heading', { name: 'Pedido não encontrado' });
    // await expect(title).toBeVisible();

    // const message = page.locator('//p[text() = "Verifique o número do pedido e tente novamente"]');
    // const message = page.locator('p', { hasText: 'Verifique o número do pedido e tente novamente' });
    // await expect(message).toBeVisible();

    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
    `);
});