import { formatPrice } from '../utils/formatPrice';

describe('formatPrice', () => {
  it('formats integers to two decimals', () => {
    expect(formatPrice(10)).toBe('10.00');
  });

  it('formats decimals to two decimals', () => {
    expect(formatPrice(4.6)).toBe('4.60');
  });

  it('rounds correctly', () => {
    expect(formatPrice(4.666)).toBe('4.67');
  });
});
