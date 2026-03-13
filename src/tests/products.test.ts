import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchAllProducts,
  fetchProductById,
  fetchCategories,
} from '../api/products';

describe('products API', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchAllProducts', () => {
    it('returns products when response is ok', async () => {
      const mockProducts = [
        {
          id: 1,
          title: 'Product 1',
          price: 10,
          category: 'cat',
          description: 'desc',
          rating: { rate: 4, count: 10 },
        },
      ];
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      } as Response);

      const result = await fetchAllProducts();

      expect(result).toEqual(mockProducts);
      expect(fetch).toHaveBeenCalledWith('https://api.example.com/products');
    });

    it('throws when response is not ok', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
      } as Response);

      await expect(fetchAllProducts()).rejects.toThrow(
        'Failed to fetch products',
      );
    });
  });

  describe('fetchProductById', () => {
    it('returns product when response is ok', async () => {
      const mockProduct = {
        id: 2,
        title: 'Product 2',
        price: 20,
        category: 'cat',
        description: 'desc',
        rating: { rate: 5, count: 1 },
      };
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      } as Response);

      const result = await fetchProductById(2);

      expect(result).toEqual(mockProduct);
      expect(fetch).toHaveBeenCalledWith('https://api.example.com/products/2');
    });

    it('throws when response is not ok', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
      } as Response);

      await expect(fetchProductById(99)).rejects.toThrow(
        'Failed to fetch product',
      );
    });
  });

  describe('fetchCategories', () => {
    it('returns categories when response is ok', async () => {
      const mockCategories = ['electronics', 'jewelery'];
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCategories),
      } as Response);

      const result = await fetchCategories();

      expect(result).toEqual(mockCategories);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/products/categories',
      );
    });

    it('throws when response is not ok', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
      } as Response);

      await expect(fetchCategories()).rejects.toThrow(
        'Failed to fetch categories',
      );
    });
  });
});
