import { Product } from './index';

export interface WishlistItem {
  _id: string;
  product: Product;
  addedAt: string;
}

export interface Wishlist {
  items: WishlistItem[];
}
