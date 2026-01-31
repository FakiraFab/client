import type { CartItem } from '../context/CartContext';
import type { BackendCartItem } from '../api/cart';

/**
 * Generates a unique cart item ID based on product and variant
 */
export const generateCartItemId = (
  productId: string,
  selectedVariant?: number,
  _selectedColor?: string
): string => {
  if (selectedVariant !== undefined && selectedVariant >= 0) {
    return `${productId}-variant-${selectedVariant}`;
  }
  return productId;
};

/**
 * Converts CartItem (with full product) to BackendCartItem (productId only)
 */
export const toBackendCartItem = (item: CartItem): BackendCartItem => {
  return {
    productId: item.product._id,
    quantity: item.quantity,
    selectedVariant: item.selectedVariant,
    selectedColor: item.selectedColor,
  };
};

/**
 * Merges guest cart (from localStorage) with backend cart
 * Rules:
 * - Same product + variant + color → sum quantity
 * - Backend price always wins (we don't store price in cart items)
 * - Deduplicate based on productId + variant + color combination
 */
export const mergeCartItems = (
  guestItems: CartItem[],
  backendItems: BackendCartItem[]
): BackendCartItem[] => {
  const mergedMap = new Map<string, BackendCartItem>();

  // First, add all backend items to the map
  for (const item of backendItems) {
    const key = generateCartItemId(item.productId, item.selectedVariant, item.selectedColor);
    mergedMap.set(key, { ...item });
  }

  // Then, merge guest items
  for (const guestItem of guestItems) {
    const key = generateCartItemId(
      guestItem.product._id,
      guestItem.selectedVariant,
      guestItem.selectedColor
    );

    const existingItem = mergedMap.get(key);
    if (existingItem) {
      // Same item exists - sum quantities
      existingItem.quantity += guestItem.quantity;
    } else {
      // New item - add to map
      mergedMap.set(key, toBackendCartItem(guestItem));
    }
  }

  return Array.from(mergedMap.values());
};

/**
 * Finds the backend cart item ID that matches a frontend cart item
 * Used for update/delete operations
 */
export const findBackendItemId = (
  frontendItemId: string,
  backendItems: BackendCartItem[]
): string | null => {
  for (const item of backendItems) {
    const backendKey = generateCartItemId(
      item.productId,
      item.selectedVariant,
      item.selectedColor
    );
    if (backendKey === frontendItemId) {
      return item._id || null;
    }
  }
  return null;
};

/**
 * Validates if a cart item has all required fields for backend sync
 */
export const isValidBackendCartItem = (item: BackendCartItem): boolean => {
  return !!(item.productId && item.quantity > 0);
};
