import { describe, it, expect } from 'vitest';
import {
  calculateTotalPrice,
  calculateInstallment,
  formatPrice,
  CarConfiguration,
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
