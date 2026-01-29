import type { Product } from './index';

export interface CartItemOption {
  color?: string;
  size?: string;
  [key: string]: string | undefined;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: CartItemOption;
  priceAtAdd: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  selectedOption?: CartItemOption;
}

export interface UpdateCartItemRequest {
  quantity: number;
  selectedOption?: CartItemOption;
}
