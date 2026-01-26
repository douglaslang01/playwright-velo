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

    // Não é necessário usar expect para validar o texto,
    // pois o próprio getByText já garante a correspondência exata (exact: true)
    // junto com a validação da visibilidade do elemento.
    await expect(page.getByText('VLO-85DC4D', { exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('APROVADO', { exact: true })).toBeVisible();
});