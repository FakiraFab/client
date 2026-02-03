import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types';
import { cartApi } from '../api/cart';

// Cart mode based on authentication
export type CartMode = 'GUEST' | 'AUTHENTICATED';

// Cart item interface
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariant?: number; // -1 for default product, 0+ for variants
  selectedColor?: string;
}

// Cart state interface
interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  isSyncing: boolean; // Indicates backend sync in progress
}

// Cart action types
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SYNCING'; payload: boolean }
  | { type: 'ROLLBACK'; payload: CartItem[] };

// Initial cart state
const initialState: CartState = {
  items: [],
  isOpen: false,
  isLoading: false,
  isSyncing: false,
};

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );

      if (existingItemIndex > -1) {
        // Update existing item quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity,
        };
        return { ...state, items: updatedItems };
      } else {
        // Add new item
        return { ...state, items: [...state.items, action.payload] };
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'CLOSE_CART':
      return { ...state, isOpen: false };

    case 'LOAD_CART':
      return { ...state, items: action.payload, isLoading: false };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_SYNCING':
      return { ...state, isSyncing: action.payload };

    case 'ROLLBACK':
      return { ...state, items: action.payload, isSyncing: false };

    default:
      return state;
  }
}

// Cart context interface
interface CartContextType {
  state: CartState;
  mode: CartMode;
  addToCart: (product: Product, quantity: number, selectedVariant?: number, selectedColor?: string) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  closeCart: () => void;
  getCartItemCount: () => number;
  getCartTotal: () => number;
  getCartItem: (id: string) => CartItem | undefined;
  syncCart: () => Promise<void>;
  mergeGuestCart: () => Promise<void>;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider component
interface CartProviderProps {
  children: ReactNode;
  isAuthenticated: boolean;
  isLoading: boolean; // Auth loading state
}

// Utility: Merge two cart arrays
const mergeCartItems = (guestItems: CartItem[], backendItems: CartItem[]): CartItem[] => {
  const merged = new Map<string, CartItem>();

  // Add backend items first (they take priority for product data)
  backendItems.forEach(item => {
    merged.set(item.id, { ...item });
  });

  // Merge guest items
  guestItems.forEach(guestItem => {
    const existing = merged.get(guestItem.id);
    if (existing) {
      // Same item exists - sum quantities, keep backend product data
      merged.set(guestItem.id, {
        ...existing,
        quantity: existing.quantity + guestItem.quantity,
      });
    } else {
      // New item from guest cart
      merged.set(guestItem.id, { ...guestItem });
    }
  });

  return Array.from(merged.values());
};

// Initialize cart state from localStorage synchronously (guest mode only)
const initializeCartState = (): CartState => {
  try {
    const savedCart = localStorage.getItem('fakira-cart');
    if (savedCart) {
      const items: CartItem[] = JSON.parse(savedCart);
      return { ...initialState, items };
    }
  } catch (error) {
    console.error('Error parsing cart from localStorage:', error);
  }
  return initialState;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children, isAuthenticated, isLoading }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, initializeCartState);
  const [hasInitialized, setHasInitialized] = React.useState(false);
  const prevModeRef = React.useRef<CartMode | null>(null);
  const prevLoadingRef = React.useRef<boolean>(true);

  // Determine cart mode
  const mode: CartMode = isAuthenticated ? 'AUTHENTICATED' : 'GUEST';

  // Generate unique cart item ID
  const generateCartItemId = (product: Product, selectedVariant?: number): string => {
    if (selectedVariant !== undefined && selectedVariant >= 0) {
      return `${product._id}-variant-${selectedVariant}`;
    }
    return product._id;
  };

  // Map frontend cart item to backend format
  const mapToBackendFormat = (item: CartItem) => ({
    productId: item.product._id,
    quantity: item.quantity,
    selectedOption: item.selectedColor ? { color: item.selectedColor } : undefined,
  });

  // Map backend cart item to frontend format
  const mapFromBackendFormat = (backendItem: any): CartItem | null => {
    console.log('[CartContext] Mapping backend item:', backendItem);
    
    // Backend might return either 'product' directly or 'productId' that needs to be checked
    const product = backendItem.product || backendItem.productId;
    
    if (!product) {
      console.warn('[CartContext] Backend item missing product:', backendItem);
      return null;
    }

    // Handle case where product is just an ID string (not populated)
    if (typeof product === 'string') {
      console.warn('[CartContext] Product not populated, got ID:', product);
      return null;
    }

    const selectedColor = backendItem.selectedOption?.color;
    const selectedVariant = selectedColor 
      ? product.variants?.findIndex((v: any) => v.color === selectedColor)
      : undefined;

    const mappedItem = {
      id: generateCartItemId(product, selectedVariant),
      product: product,
      quantity: backendItem.quantity,
      selectedVariant,
      selectedColor,
    };

    console.log('[CartContext] Mapped to frontend format:', mappedItem);
    return mappedItem;
  };

  // Save to localStorage (GUEST mode only)
  useEffect(() => {
    if (mode === 'GUEST') {
      localStorage.setItem('fakira-cart', JSON.stringify(state.items));
    }
  }, [state.items, mode]);

  // Initial cart hydration on mount or auth change
  useEffect(() => {
    const initializeCart = async () => {
      // Don't initialize while auth is still loading
      if (isLoading) {
        console.log('[CartContext] Waiting for auth to load...');
        prevLoadingRef.current = isLoading;
        return;
      }

      // Check if mode changed (e.g., GUEST -> AUTHENTICATED after login)
      const modeChanged = prevModeRef.current !== null && prevModeRef.current !== mode;
      const authJustLoaded = prevLoadingRef.current === true && isLoading === false;

      if (modeChanged) {
        console.log('[CartContext] Mode changed from', prevModeRef.current, 'to', mode);
        setHasInitialized(false);
      }

      // Update refs
      prevModeRef.current = mode;
      prevLoadingRef.current = isLoading;

      // Skip if already initialized and mode hasn't changed
      if (hasInitialized && !modeChanged) {
        return;
      }

      if (mode === 'AUTHENTICATED') {
        console.log('[CartContext] Authenticated mode - loading from backend');
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
          const response = await cartApi.getCart();
          console.log('[CartContext] Backend response:', response);
          
          if (response.success && response.data && response.data.items) {
            console.log('[CartContext] Cart items count from backend:', response.data.items.length);
            if (response.data.items.length > 0) {
              console.log('[CartContext] First item structure:', response.data.items[0]);
            }
            
            const backendItems = response.data.items
              .map((item: any, index: number) => {
                console.log(`[CartContext] Processing item ${index + 1}/${response.data.items.length}:`, item);
                const mapped = mapFromBackendFormat(item);
                if (!mapped) {
                  console.error(`[CartContext] Item ${index + 1} was filtered out (null):`, item);
                }
                return mapped;
              })
              .filter((item): item is CartItem => item !== null);
            
            console.log('[CartContext] Successfully mapped items:', backendItems.length);
            dispatch({ type: 'LOAD_CART', payload: backendItems });
          } else {
            console.log('[CartContext] No cart data, loading empty cart');
            dispatch({ type: 'LOAD_CART', payload: [] });
          }
        } catch (error) {
          console.error('[CartContext] Failed to load cart from backend:', error);
          dispatch({ type: 'SET_LOADING', payload: false });
        }
        setHasInitialized(true);
      } else if (mode === 'GUEST' && (authJustLoaded || !hasInitialized)) {
        // Already loaded from localStorage via initializeCartState
        console.log('[CartContext] Guest mode - cart loaded from localStorage');
        setHasInitialized(true);
      }
    };

    initializeCart();
  }, [mode, isLoading]);

  // Merge guest cart on login
  const mergeGuestCart = useCallback(async () => {
    if (mode !== 'AUTHENTICATED') return;

    try {
      const guestCartJson = localStorage.getItem('fakira-cart');
      if (!guestCartJson) {
        // No guest cart to merge
        return;
      }

      const guestItems: CartItem[] = JSON.parse(guestCartJson);
      if (guestItems.length === 0) {
        localStorage.removeItem('fakira-cart');
        return;
      }

      dispatch({ type: 'SET_SYNCING', payload: true });

      // Fetch current backend cart
      const backendResponse = await cartApi.getCart();
      const backendItems = backendResponse.success && backendResponse.data
        ? backendResponse.data.items.map(mapFromBackendFormat).filter((item): item is CartItem => item !== null)
        : [];

      // Merge carts
      const mergedItems = mergeCartItems(guestItems, backendItems);

      // Send merged cart to backend (batch operation)
      // Since backend doesn't have batch API, we'll send items one by one
      for (const item of mergedItems) {
        try {
          await cartApi.addToCart(mapToBackendFormat(item));
        } catch (error) {
          console.error('Failed to sync cart item:', error);
        }
      }

      // Fetch updated cart from backend
      const finalResponse = await cartApi.getCart();
      if (finalResponse.success && finalResponse.data) {
        const finalItems = finalResponse.data.items
          .map(mapFromBackendFormat)
          .filter((item): item is CartItem => item !== null);
        
        dispatch({ type: 'LOAD_CART', payload: finalItems });
      }

      // Clear guest cart from localStorage
      localStorage.removeItem('fakira-cart');
      dispatch({ type: 'SET_SYNCING', payload: false });
    } catch (error) {
      console.error('Failed to merge guest cart:', error);
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  }, [mode]);

  // Sync entire cart to backend (used for authenticated mode)
  const syncCart = useCallback(async () => {
    if (mode !== 'AUTHENTICATED') return;

    try {
      const response = await cartApi.getCart();
      if (response.success && response.data) {
        const items = response.data.items
          .map(mapFromBackendFormat)
          .filter((item): item is CartItem => item !== null);
        
        dispatch({ type: 'LOAD_CART', payload: items });
      }
    } catch (error) {
      console.error('Failed to sync cart:', error);
    }
  }, [mode]);

  // Add item to cart
  const addToCart = useCallback(async (
    product: Product, 
    quantity: number, 
    selectedVariant?: number, 
    selectedColor?: string
  ) => {
    const id = generateCartItemId(product, selectedVariant);
    const cartItem: CartItem = {
      id,
      product,
      quantity,
      selectedVariant,
      selectedColor,
    };

    console.log('[CartContext] Adding to cart:', { id, productName: product.name, quantity, mode });

    // Optimistic update - immediate UI response
    dispatch({ type: 'ADD_ITEM', payload: cartItem });

    // Backend sync for authenticated users
    if (mode === 'AUTHENTICATED') {
      const previousState = [...state.items];
      dispatch({ type: 'SET_SYNCING', payload: true });

      try {
        const backendPayload = mapToBackendFormat(cartItem);
        console.log('[CartContext] Sending to backend:', backendPayload);
        
        const response = await cartApi.addToCart(backendPayload);
        console.log('[CartContext] Backend add response:', response);
        
        dispatch({ type: 'SET_SYNCING', payload: false });
      } catch (error) {
        console.error('[CartContext] Failed to add item to backend cart:', error);
        // Rollback on failure
        dispatch({ type: 'ROLLBACK', payload: previousState });
        throw error;
      }
    }
  }, [mode, state.items]);

  // Remove item from cart
  const removeFromCart = useCallback(async (id: string) => {
    const itemToRemove = state.items.find(item => item.id === id);
    if (!itemToRemove) return;

    // Optimistic update
    dispatch({ type: 'REMOVE_ITEM', payload: id });

    // Backend sync for authenticated users
    if (mode === 'AUTHENTICATED') {
      const previousState = [...state.items];
      dispatch({ type: 'SET_SYNCING', payload: true });

      try {
        const selectedOption = itemToRemove.selectedColor 
          ? { color: itemToRemove.selectedColor } 
          : undefined;
        
        await cartApi.removeFromCart(itemToRemove.product._id, selectedOption);
        dispatch({ type: 'SET_SYNCING', payload: false });
      } catch (error) {
        console.error('Failed to remove item from backend cart:', error);
        // Rollback on failure
        dispatch({ type: 'ROLLBACK', payload: previousState });
        throw error;
      }
    }
  }, [mode, state.items]);

  // Update item quantity
  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    const itemToUpdate = state.items.find(item => item.id === id);
    if (!itemToUpdate) return;

    // Optimistic update
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });

    // Backend sync for authenticated users
    if (mode === 'AUTHENTICATED') {
      const previousState = [...state.items];
      dispatch({ type: 'SET_SYNCING', payload: true });

      try {
        const selectedOption = itemToUpdate.selectedColor 
          ? { color: itemToUpdate.selectedColor } 
          : undefined;

        await cartApi.updateCartItem(itemToUpdate.product._id, {
          quantity,
          selectedOption,
        });
        dispatch({ type: 'SET_SYNCING', payload: false });
      } catch (error) {
        console.error('Failed to update item quantity in backend cart:', error);
        // Rollback on failure
        dispatch({ type: 'ROLLBACK', payload: previousState });
        throw error;
      }
    }
  }, [mode, state.items]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    // Optimistic update
    const previousState = [...state.items];
    dispatch({ type: 'CLEAR_CART' });

    // Backend sync for authenticated users
    if (mode === 'AUTHENTICATED') {
      dispatch({ type: 'SET_SYNCING', payload: true });

      try {
        await cartApi.clearCart();
        dispatch({ type: 'SET_SYNCING', payload: false });
      } catch (error) {
        console.error('Failed to clear backend cart:', error);
        // Rollback on failure
        dispatch({ type: 'ROLLBACK', payload: previousState });
        throw error;
      }
    }
  }, [mode, state.items]);

  // Toggle cart visibility
  const toggleCart = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART' });
  }, []);

  // Close cart
  const closeCart = useCallback(() => {
    dispatch({ type: 'CLOSE_CART' });
  }, []);

  // Get total number of items in cart
  const getCartItemCount = useCallback((): number => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  }, [state.items]);

  // Get cart total price
  const getCartTotal = useCallback((): number => {
    return state.items.reduce((total, item) => {
      let price = item.product.price;
      if (item.selectedVariant !== undefined && item.selectedVariant >= 0 && item.product.variants) {
        const variant = item.product.variants[item.selectedVariant];
        if (variant && variant.price) {
          price = variant.price;
        }
      }
      return total + (price * item.quantity);
    }, 0);
  }, [state.items]);

  // Get specific cart item
  const getCartItem = useCallback((id: string): CartItem | undefined => {
    return state.items.find(item => item.id === id);
  }, [state.items]);

  const value: CartContextType = {
    state,
    mode,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    closeCart,
    getCartItemCount,
    getCartTotal,
    getCartItem,
    syncCart,
    mergeGuestCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
