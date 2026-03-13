import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  useCategories,
  capitalizeCategory,
  AllProductsCategory,
  __clearCategoriesCacheForTesting,
} from '../hooks/useCategories';
import * as productsApi from '../api/products';

vi.mock('../api/products');

describe('capitalizeCategory', () => {
  it('capitalizes first letter', () => {
    expect(capitalizeCategory('electronics')).toBe('Electronics');
  });

  it('keeps rest of string unchanged', () => {
    expect(capitalizeCategory('abc')).toBe('Abc');
  });

  it('handles single character', () => {
    expect(capitalizeCategory('a')).toBe('A');
  });
});

describe('useCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    __clearCategoriesCacheForTesting();
  });

  it('starts with loading true when cache is empty', () => {
    vi.mocked(productsApi.fetchCategories).mockImplementation(
      () => new Promise(() => {}),
    );

    const { result } = renderHook(() => useCategories());

    expect(result.current.loading).toBe(true);
    expect(result.current.categories).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('returns categories with All products first when fetch succeeds', async () => {
    vi.mocked(productsApi.fetchCategories).mockResolvedValue([
      'electronics',
      'jewelery',
    ]);

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toEqual([
      AllProductsCategory,
      'Electronics',
      'Jewelery',
    ]);
    expect(result.current.error).toBe(null);
  });

  it('sets error when fetch fails', async () => {
    vi.mocked(productsApi.fetchCategories).mockRejectedValue(
      new Error('Network error'),
    );

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toBe(null);
    expect(result.current.error).toBe('Network error');
  });

  it('sets generic error message when fetch rejects with non-Error', async () => {
    vi.mocked(productsApi.fetchCategories).mockRejectedValue('string error');

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('API error');
  });

  it('uses cache on second mount (no second fetch)', async () => {
    vi.mocked(productsApi.fetchCategories).mockResolvedValue(['electronics']);

    const { result: result1, unmount: unmount1 } = renderHook(() =>
      useCategories(),
    );
    await waitFor(() => {
      expect(result1.current.loading).toBe(false);
    });
    expect(result1.current.categories).toEqual([
      AllProductsCategory,
      'Electronics',
    ]);
    unmount1();

    const { result: result2 } = renderHook(() => useCategories());

    expect(result2.current.loading).toBe(false);
    expect(result2.current.categories).toBeDefined();
    expect(result2.current.categories!.length).toBeGreaterThan(0);
    expect(productsApi.fetchCategories).toHaveBeenCalledTimes(1);
  });
});
