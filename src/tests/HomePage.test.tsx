import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi } from "vitest";

// 🔹 Mock router hooks (useParams, useLocation) as vi.fn()
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: vi.fn(),
    useLocation: vi.fn(),
  };
});

// After the mock so we get the mocked versions
import * as Router from "react-router-dom";

// Mock ProductCard
vi.mock("../components/product/ProductCard", () => ({
  ProductCard: ({ product }: any) => (
    <div data-testid="product-card">{product.title}</div>
  ),
}));

// Mock SkeletonCard
vi.mock("../components/product/SkeletonCard", () => ({
  SkeletonCard: () => <div data-testid="skeleton-card" />,
}));

// Mock ProductsContext via __mocks__/ProductsContext.ts
vi.mock("../contexts/ProductsContext");
import { useProductsContext } from "../contexts/ProductsContext";

import HomePage from "../pages/HomePage";

function renderWithRouter(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:name" element={<HomePage />} />
        <Route path="/search" element={<HomePage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function mockRouter(params: any = {}, search = "") {
    (Router.useParams as vi.Mock).mockReturnValue(params);
    (Router.useLocation as vi.Mock).mockReturnValue({ search });
  }

  function mockProducts(value: any) {
    (useProductsContext as vi.Mock).mockReturnValue(value);
  }

  it("should display skeleton cards while loading", () => {
    mockProducts({ products: null, loading: true, error: null });
    mockRouter();

    renderWithRouter();
    expect(screen.getAllByTestId("skeleton-card")).toHaveLength(8);
  });

  it("should display error message when fetch fails", () => {
    mockProducts({ products: null, loading: false, error: "Boom" });
    mockRouter();

    renderWithRouter();
    expect(screen.getByText("Error: Boom")).toBeInTheDocument();
  });

  it('should display "No products found" when products array is empty', () => {
    mockProducts({ products: [], loading: false, error: null });
    mockRouter();

    renderWithRouter();
    expect(screen.getByText("No products found.")).toBeInTheDocument();
  });

  it('should display "No products found" when products is null', () => {
    mockProducts({ products: null, loading: false, error: null });
    mockRouter();

    renderWithRouter();
    expect(screen.getByText("No products found.")).toBeInTheDocument();
  });

  it("should display all products when no filters applied", () => {
    mockProducts({
      products: [
        { id: 1, title: "Phone", category: "electronics" },
        { id: 2, title: "Ring", category: "jewelery" },
      ],
      loading: false,
      error: null,
    });
    mockRouter();

    renderWithRouter();
    expect(screen.getAllByTestId("product-card")).toHaveLength(2);
  });

  it("should display correct heading text", () => {
  mockProducts({
    products: [
      { id: 1, title: "Phone", category: "electronics" },
    ],
    loading: false,
    error: null,
  });
  mockRouter({ name: "electronics" });

  renderWithRouter("/category/electronics");

  expect(screen.getByText("Electronics")).toBeInTheDocument();
});


  it("should filter products by category from URL param", () => {
    mockProducts({
      products: [
        { id: 1, title: "Phone", category: "electronics" },
        { id: 2, title: "Ring", category: "jewelery" },
      ],
      loading: false,
      error: null,
    });
    mockRouter({ name: "electronics" });

    renderWithRouter("/category/electronics");
    expect(screen.getAllByTestId("product-card")).toHaveLength(1);
  });

  it("should filter products by category from query param", () => {
    mockProducts({
      products: [
        { id: 1, title: "Phone", category: "electronics" },
        { id: 2, title: "Ring", category: "jewelery" },
      ],
      loading: false,
      error: null,
    });
    mockRouter({}, "?cat=electronics");

    renderWithRouter("/search?cat=electronics");
    expect(screen.getAllByTestId("product-card")).toHaveLength(1);
  });

  it("should handle case-insensitive category filtering", () => {
    mockProducts({
      products: [{ id: 1, title: "Phone", category: "Electronics" }],
      loading: false,
      error: null,
    });
    mockRouter({ name: "electronics" });

    renderWithRouter("/category/electronics");
    expect(screen.getAllByTestId("product-card")).toHaveLength(1);
  });

  it("should filter products by search query", () => {
    mockProducts({
      products: [
        { id: 1, title: "Red Shirt", category: "clothing" },
        { id: 2, title: "Blue Shirt", category: "clothing" },
      ],
      loading: false,
      error: null,
    });
    mockRouter({}, "?q=red");

    renderWithRouter("/search?q=red");
    expect(screen.getAllByTestId("product-card")).toHaveLength(1);
  });

  it("should handle case-insensitive search", () => {
    mockProducts({
      products: [{ id: 1, title: "Red Shirt", category: "clothing" }],
      loading: false,
      error: null,
    });
    mockRouter({}, "?q=RED");

    renderWithRouter("/search?q=RED");
    expect(screen.getAllByTestId("product-card")).toHaveLength(1);
  });

  it("should return no results for non-matching search", () => {
    mockProducts({
      products: [{ id: 1, title: "Red Shirt", category: "clothing" }],
      loading: false,
      error: null,
    });
    mockRouter({}, "?q=xyz");

    renderWithRouter("/search?q=xyz");
    expect(screen.getByText("No products found.")).toBeInTheDocument();
  });

  it("should apply both category and search filters", () => {
    mockProducts({
      products: [
        { id: 1, title: "Red Phone", category: "electronics" },
        { id: 2, title: "Blue Phone", category: "electronics" },
      ],
      loading: false,
      error: null,
    });
    mockRouter({ name: "electronics" }, "?q=red");

    renderWithRouter("/category/electronics?q=red");
    expect(screen.getAllByTestId("product-card")).toHaveLength(1);
  });

  it("should apply both cat query param and search filters", () => {
    mockProducts({
      products: [
        { id: 1, title: "Red Phone", category: "electronics" },
        { id: 2, title: "Blue Phone", category: "electronics" },
      ],
      loading: false,
      error: null,
    });
    mockRouter({}, "?cat=electronics&q=blue");

    renderWithRouter("/search?cat=electronics&q=blue");
    expect(screen.getAllByTestId("product-card")).toHaveLength(1);
  });

  it("should render products in a grid layout", () => {
    mockProducts({
      products: [{ id: 1, title: "Phone", category: "electronics" }],
      loading: false,
      error: null,
    });
    mockRouter();

    renderWithRouter();
    const grid = screen.getByTestId("products-grid");
    expect(grid).toBeInTheDocument();
  });
});
