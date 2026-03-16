export const AllProductsCategory = "All products";

export function capitalizeCategory(cat: string | undefined) {
  if (cat) {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  }
  return AllProductsCategory;
}