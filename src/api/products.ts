import type { Product } from '../types/product';

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchAllProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${API_URL}/products/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}
