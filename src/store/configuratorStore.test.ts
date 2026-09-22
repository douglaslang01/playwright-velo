import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateTotalPrice,
  calculateInstallment,
  formatPrice,
  useConfiguratorStore,
  CarConfiguration,
  Order,
} from './configuratorStore';

const baseConfig: CarConfiguration = {
  exteriorColor: 'glacier-blue',
  interiorColor: 'carbon-black',
  wheelType: 'aero',
  optionals: [],
};

describe('calculateTotalPrice', () => {
  it('retorna o preço base quando não há opcionais e rodas aero', () => {
    expect(calculateTotalPrice(baseConfig)).toBe(40000);
  });

  it('adiciona o valor das rodas sport ao preço base', () => {
    const config: CarConfiguration = { ...baseConfig, wheelType: 'sport' };
    expect(calculateTotalPrice(config)).toBe(42000);
  });

  it('adiciona o valor de cada opcional selecionado', () => {
    const config: CarConfiguration = {
      ...baseConfig,
      optionals: ['precision-park', 'flux-capacitor'],
    };
    expect(calculateTotalPrice(config)).toBe(40000 + 5500 + 5000);
  });

  it('soma rodas sport e opcionais simultaneamente', () => {
    const config: CarConfiguration = {
      ...baseConfig,
      wheelType: 'sport',
      optionals: ['precision-park'],
    };
    expect(calculateTotalPrice(config)).toBe(40000 + 2000 + 5500);
  });
});

describe('calculateInstallment', () => {
  it('calcula o valor da parcela para 12x com juros de 2% a.m.', () => {
    const total = 40000;
    const installment = calculateInstallment(total);
    expect(installment).toBeCloseTo(3782.38, 1);
  });

  it('retorna 0 quando o total é 0', () => {
    expect(calculateInstallment(0)).toBe(0);
  });
});

describe('formatPrice', () => {
  it('formata o valor no padrão de moeda brasileira (BRL)', () => {
    expect(formatPrice(40000)).toBe('R$ 40.000,00');
  });

  it('formata valores com centavos corretamente', () => {
    expect(formatPrice(1234.56)).toBe('R$ 1.234,56');
  });
});

const makeOrder = (email: string): Order => ({
  id: `VLO-${email}`,
  configuration: baseConfig,
  totalPrice: 40000,
  customer: {
    name: 'Nome',
    surname: 'Sobrenome',
    email,
    phone: '11999999999',
    cpf: '12345678900',
    store: 'Loja Centro',
  },
  paymentMethod: 'avista',
  status: 'APROVADO',
  createdAt: new Date().toISOString(),
});

describe('login / getUserOrders / logout', () => {
  beforeEach(() => {
    useConfiguratorStore.setState({ orders: [], currentUserEmail: null });
  });

  it('login retorna true e autentica o e-mail quando já existe pedido com esse e-mail', () => {
    useConfiguratorStore.setState({ orders: [makeOrder('cliente@teste.com')] });

    const result = useConfiguratorStore.getState().login('cliente@teste.com');

    expect(result).toBe(true);
    expect(useConfiguratorStore.getState().currentUserEmail).toBe('cliente@teste.com');
  });

  it('login retorna false e não autentica quando não há pedido com esse e-mail', () => {
    useConfiguratorStore.setState({ orders: [makeOrder('outro@teste.com')] });

    const result = useConfiguratorStore.getState().login('cliente@teste.com');

    expect(result).toBe(false);
    expect(useConfiguratorStore.getState().currentUserEmail).toBeNull();
  });

  it('getUserOrders retorna array vazio quando não há usuário logado', () => {
    useConfiguratorStore.setState({ orders: [makeOrder('cliente@teste.com')] });

    expect(useConfiguratorStore.getState().getUserOrders()).toEqual([]);
  });

  it('getUserOrders retorna apenas os pedidos do e-mail autenticado', () => {
    const order1 = makeOrder('cliente@teste.com');
    const order2 = makeOrder('outro@teste.com');
    useConfiguratorStore.setState({ orders: [order1, order2] });
    useConfiguratorStore.getState().login('cliente@teste.com');

    const userOrders = useConfiguratorStore.getState().getUserOrders();

    expect(userOrders).toEqual([order1]);
  });

  it('logout limpa o usuário autenticado e getUserOrders volta a retornar vazio', () => {
    useConfiguratorStore.setState({ orders: [makeOrder('cliente@teste.com')] });
    useConfiguratorStore.getState().login('cliente@teste.com');

    useConfiguratorStore.getState().logout();

    expect(useConfiguratorStore.getState().currentUserEmail).toBeNull();
    expect(useConfiguratorStore.getState().getUserOrders()).toEqual([]);
  });
});

