import { test, expect } from '@playwright/test';

// AAA - Arrange, Act, Assert

test('deve consultar um pedido aprovado', async ({ page }) => {
    // Arrange
    await page.goto('http://localhost:5173/');
    // Checkpoint 1: Verificar se a página de consulta de pedidos está carregada
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    // Checkpoint 2: Verificar se a página de consulta de pedidos está carregada
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

    // Act
    await page.getByTestId('search-order-id').fill('VLO-85DC4D');
    // await page.getByTestId('search-order-button').click();
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    // Assert
    // const orderCode = page.locator('//p[text()="Pedido"]/..//p[text()="VLO-85DC4D"]');
    // await expect(orderCode).toBeVisible({ timeout: 10_000 });

    const containerPedido = page.getByRole('paragraph')
        .filter({ hasText: /^Pedido$/ })
        .locator('..'); // Sobe para o elemento pai (div que agrupa ambos)
    await expect(containerPedido).toContainText('VLO-85DC4D', { timeout: 10_000 });

    await expect(page.getByText('APROVADO')).toBeVisible();
});