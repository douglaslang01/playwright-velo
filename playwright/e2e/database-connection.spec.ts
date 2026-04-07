import { test, expect } from '@playwright/test';
import { db } from '../support/database/database';
import { sql } from 'kysely';

test.describe('Conexao com banco', () => {
    test.afterAll(async () => {
        await db.destroy();
    });

    test('deve conectar no Postgres e executar select 1', async () => {
        expect(process.env.DATABASE_URL, 'DATABASE_URL nao definida no .env').toBeTruthy();

        const result = await db.executeQuery(
            sql<{ ok: number }>`select 1 as ok`.compile(db)
        );

        expect(result.rows[0]?.ok).toBe(1);
    });
});
