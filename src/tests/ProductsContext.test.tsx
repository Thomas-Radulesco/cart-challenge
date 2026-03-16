import { vi } from "vitest";
vi.unmock("../contexts/ProductsContext");

vi.mock("../api/products", () => ({
  fetchAllProducts: vi.fn(),
}));

import { act, render, screen, waitFor } from "@testing-library/react";
import {
  ProductsProvider,
  useProductsContext,
  __resetProductsCache,
} from "../contexts/ProductsContext";
import { fetchAllProducts } from "../api/products";

function TestConsumer() {
  const ctx = useProductsContext();
  return (
    <div>
      <div data-testid="loading">{ctx.loading ? "true" : "false"}</div>
      <div data-testid="error">{ctx.error ?? ""}</div>
      <div data-testid="products">
        {ctx.products ? JSON.stringify(ctx.products) : "null"}
      </div>
    </div>
  );
}

function renderWithProvider(child = <TestConsumer />) {
  return render(<ProductsProvider>{child}</ProductsProvider>);
}

describe("ProductsContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    __resetProductsCache();
  });

  it("starts with loading=true when cache is empty", async () => {
    (fetchAllProducts as vi.Mock).mockResolvedValue([]);

    renderWithProvider();

    // Assert initial state
    expect(screen.getByTestId("loading").textContent).toBe("true");

    // Let React flush async updates silently
    await waitFor(() => {});
  });


  it("loads products successfully", async () => {
    const data = [{ id: 1, title: "Phone" }];
    (fetchAllProducts as vi.Mock).mockResolvedValue(data);

    renderWithProvider();

    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("false")
    );

    expect(screen.getByTestId("products").textContent).toContain("Phone");
  });

  it("sets error when fetch fails", async () => {
    (fetchAllProducts as vi.Mock).mockRejectedValue(new Error("Boom"));

    renderWithProvider();

    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("false")
    );

    expect(screen.getByTestId("error").textContent).toBe("Boom");
  });

  it("sets generic error when fetch rejects with non-Error", async () => {
    (fetchAllProducts as vi.Mock).mockRejectedValue("fail");

    renderWithProvider();

    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("false")
    );

    expect(screen.getByTestId("error").textContent).toBe("API error");
  });

  it("caches products after first load", async () => {
    const data = [{ id: 1, title: "Cached" }];
    (fetchAllProducts as vi.Mock).mockResolvedValue(data);

    renderWithProvider();
    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("false")
    );

    expect(fetchAllProducts).toHaveBeenCalledTimes(1);

    renderWithProvider();
    expect(fetchAllProducts).toHaveBeenCalledTimes(1);
  });

  it("refresh() forces a refetch", async () => {
    const d1 = [{ id: 1, title: "Old" }];
    const d2 = [{ id: 2, title: "New" }];

    (fetchAllProducts as vi.Mock)
      .mockResolvedValueOnce(d1)
      .mockResolvedValueOnce(d2);

    let ctx: any;
    function Capture() {
      ctx = useProductsContext();
      return null;
    }

    renderWithProvider(<Capture />);

    await waitFor(() => expect(ctx.loading).toBe(false));
    expect(ctx.products).toEqual(d1);

    await act(async () => {
      await ctx.refresh();
    });

    await waitFor(() => expect(ctx.products).toEqual(d2));
  });

  it("refresh() sets error on failure", async () => {
    const d1 = [{ id: 1, title: "Old" }];
    (fetchAllProducts as vi.Mock)
      .mockResolvedValueOnce(d1)
      .mockRejectedValueOnce(new Error("Refresh failed"));

    let ctx: any;
    function Capture() {
      ctx = useProductsContext();
      return null;
    }

    renderWithProvider(<Capture />);

    await waitFor(() => expect(ctx.loading).toBe(false));

    await act(async () => {
      await ctx.refresh();
    });

    expect(ctx.error).toBe("Refresh failed");
  });

  it("refresh() sets generic error on non-Error rejection", async () => {
    const d1 = [{ id: 1, title: "Old" }];
    (fetchAllProducts as vi.Mock)
      .mockResolvedValueOnce(d1)
      .mockRejectedValueOnce("fail");

    let ctx: any;
    function Capture() {
      ctx = useProductsContext();
      return null;
    }

    renderWithProvider(<Capture />);

    await waitFor(() => expect(ctx.loading).toBe(false));

    await act(async () => {
      await ctx.refresh();
    });

    expect(ctx.error).toBe("API error");
  });
});
