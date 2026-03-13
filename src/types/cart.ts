export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  category: string;
  description: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartState {
  items: CartItem[];
}
