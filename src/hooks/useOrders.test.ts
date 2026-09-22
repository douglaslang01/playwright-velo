import { describe, it, expect, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {},
}));

import { dbOrderToOrder, DbOrder } from './useOrders';

const baseDbOrder: DbOrder = {
  id: 'uuid-1',
  order_number: 'VLO-ABC123',
  color: 'glacier-blue',
  wheel_type: 'aero',
  optionals: null,
  customer_name: 'João Silva',
  customer_email: 'joao@teste.com',
  customer_phone: '11999999999',
  customer_cpf: '12345678900',
  payment_method: 'avista',
  total_price: 40000,
  status: 'APROVADO',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

describe('dbOrderToOrder', () => {
  it('divide nome composto em name e surname corretamente', () => {
    const order = dbOrderToOrder(baseDbOrder);
    expect(order.customer.name).toBe('João');
    expect(order.customer.surname).toBe('Silva');
  });

  it('junta sobrenomes de múltiplas palavras em surname', () => {
    const order = dbOrderToOrder({ ...baseDbOrder, customer_name: 'Maria Souza Lima' });
    expect(order.customer.name).toBe('Maria');
    expect(order.customer.surname).toBe('Souza Lima');
  });

  it('retorna surname vazio quando não há sobrenome', () => {
    const order = dbOrderToOrder({ ...baseDbOrder, customer_name: 'João' });
    expect(order.customer.name).toBe('João');
    expect(order.customer.surname).toBe('');
  });

  it('remapeia os campos do banco para o domínio da aplicação', () => {
    const order = dbOrderToOrder(baseDbOrder);

    expect(order.id).toBe('VLO-ABC123');
    expect(order.totalPrice).toBe(40000);
    expect(typeof order.totalPrice).toBe('number');
    expect(order.configuration.optionals).toEqual([]);
    expect(order.customer.store).toBe('');
    expect(order.customer.email).toBe('joao@teste.com');
    expect(order.status).toBe('APROVADO');
  });
});
