import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types';
import { useAuth } from './AuthContext';
import { cartApi, type BackendCartItem } from '../api/cart';
import { mergeCartItems, findBackendItemId } from '../utils/cartUtils';
import { useToast } from './ToastContext';

// Cart item interface
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariant?: number; // -1 for default product, 0+ for variants
  selectedColor?: string;
}

// Cart mode type
export type CartMode = 'GUEST' | 'AUTHENTICATED';

// Cart state interface
interface CartState {
  items: CartItem[];
  isOpen: boolean;
  backendCartItems: BackendCartItem[]; // Cache of backend cart items for ID mapping
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
  | { type: 'SET_BACKEND_ITEMS'; payload: BackendCartItem[] };

// Initial cart state
const initialState: CartState = {
  items: [],
  isOpen: false,
  backendCartItems: [],
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
      return { ...state, items: action.payload };

    case 'SET_BACKEND_ITEMS':
      return { ...state, backendCartItems: action.payload };

    default:
      return state;
  }
}

// Cart context interface
interface CartContextType {
  state: CartState;
  addToCart: (product: Product, quantity: number, selectedVariant?: number, selectedColor?: string) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  closeCart: () => void;
  getCartItemCount: () => number;
  getCartTotal: () => number;
  getCartItem: (id: string) => CartItem | undefined;
  cartMode: CartMode;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider component
interface CartProviderProps {
  children: ReactNode;
}

// Initialize cart state from localStorage synchronously to avoid race conditions on refresh
const initializeCartState = (): CartState => {
  try {
    const savedCart = localStorage.getItem('fakira-cart');
    if (savedCart) {
      const items: CartItem[] = JSON.parse(savedCart);
      return { items, isOpen: false, backendCartItems: [] };
    }
  } catch (error) {
    console.error('Error parsing cart from localStorage:', error);
  }
  return initialState;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, initializeCartState);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  
  // Track if cart has been hydrated to prevent multiple hydrations
  const isHydratedRef = useRef(false);
  // Track previous auth state to detect login/logout
  const prevAuthRef = useRef(isAuthenticated);
  // Track if we're currently syncing to prevent duplicate requests
  const isSyncingRef = useRef(false);

  // Determine cart mode based on auth state
  const cartMode: CartMode = isAuthenticated ? 'AUTHENTICATED' : 'GUEST';

  // Helper: Fetch product details for a cart item (needed when rehydrating from backend)
  const fetchProductForCartItem = async (backendItem: BackendCartItem): Promise<CartItem | null> => {
    try {
      // TODO: Replace with actual product API call
      // For now, we'll need to fetch the product from the products API
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products/${backendItem.productId}`);
      if (!response.ok) return null;
      
      const data = await response.json();
      const product: Product = data.data;
      
      return {
        id: generateCartItemId(product, backendItem.selectedVariant),
        product,
        quantity: backendItem.quantity,
        selectedVariant: backendItem.selectedVariant,
        selectedColor: backendItem.selectedColor,
      };
    } catch (error) {
      console.error('Error fetching product for cart item:', error);
      return null;
    }
  };

  // Helper: Rehydrate cart items from backend (fetch full product data)
  const rehydrateCartFromBackend = async (backendItems: BackendCartItem[]): Promise<CartItem[]> => {
    const cartItems: CartItem[] = [];
    
    for (const backendItem of backendItems) {
      const cartItem = await fetchProductForCartItem(backendItem);
      if (cartItem) {
        cartItems.push(cartItem);
      }
    }
    
    return cartItems;
  };

  // Effect 1: Initial cart hydration on mount/auth change
  useEffect(() => {
    const hydrateCart = async () => {
      // Wait for auth to finish loading
      if (authLoading) return;
      
      // Prevent duplicate hydrations
      if (isHydratedRef.current && prevAuthRef.current === isAuthenticated) return;
      
      try {
        if (isAuthenticated) {
          // Authenticated: Fetch cart from backend
          const backendCart = await cartApi.getCart();
          dispatch({ type: 'SET_BACKEND_ITEMS', payload: backendCart.items });
          
          // Rehydrate cart items with full product data
          const cartItems = await rehydrateCartFromBackend(backendCart.items);
          dispatch({ type: 'LOAD_CART', payload: cartItems });
          
          isHydratedRef.current = true;
        } else {
          // Guest: Cart is already initialized from localStorage
          isHydratedRef.current = true;
        }
      } catch (error) {
        console.error('Error hydrating cart:', error);
        showToast({ type: 'error', title: 'Failed to load cart', message: 'Please try again later' });
      }
    };

    hydrateCart();
  }, [isAuthenticated, authLoading]);

  // Effect 2: Handle login transition (cart merge)
  useEffect(() => {
    const handleLoginTransition = async () => {
      // Wait for auth to finish loading
      if (authLoading) return;
      
      // Detect transition from guest to authenticated
      const wasGuest = !prevAuthRef.current;
      const isNowAuthenticated = isAuthenticated;
      
      if (wasGuest && isNowAuthenticated && !isSyncingRef.current) {
        try {
          isSyncingRef.current = true;
          
          // Get guest cart from localStorage
          const guestCartStr = localStorage.getItem('fakira-cart');
          const guestItems: CartItem[] = guestCartStr ? JSON.parse(guestCartStr) : [];
          
          if (guestItems.length > 0) {
            // Fetch backend cart
            const backendCart = await cartApi.getCart();
            
            // Merge carts
            const mergedItems = mergeCartItems(guestItems, backendCart.items);
            
            // Sync merged cart to backend
            await cartApi.syncCart(mergedItems);
            
            // Clear localStorage
            localStorage.removeItem('fakira-cart');
            
            // Rehydrate UI with merged cart
            const cartItems = await rehydrateCartFromBackend(mergedItems);
            dispatch({ type: 'LOAD_CART', payload: cartItems });
            dispatch({ type: 'SET_BACKEND_ITEMS', payload: mergedItems });
            
            showToast({ type: 'success', title: 'Cart merged successfully', message: 'Your cart has been updated' });
          }
        } catch (error) {
          console.error('Error merging carts:', error);
          showToast({ type: 'error', title: 'Failed to merge cart', message: 'Please try again later' });
        } finally {
          isSyncingRef.current = false;
        }
      }
      
      // Update previous auth state
      prevAuthRef.current = isAuthenticated;
    };

    handleLoginTransition();
  }, [isAuthenticated, authLoading]);

  // Effect 3: Save guest cart to localStorage (only for guest mode)
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      localStorage.setItem('fakira-cart', JSON.stringify(state.items));
    }
  }, [state.items, isAuthenticated, authLoading]);

  // Generate unique cart item ID
  const generateCartItemId = (product: Product, selectedVariant?: number): string => {
    if (selectedVariant !== undefined && selectedVariant >= 0) {
      return `${product._id}-variant-${selectedVariant}`;
    }
    return product._id;
  };

  // Add item to cart
  const addToCart = async (product: Product, quantity: number, selectedVariant?: number, selectedColor?: string) => {
    const id = generateCartItemId(product, selectedVariant);
    const cartItem: CartItem = {
      id,
      product,
      quantity,
      selectedVariant,
      selectedColor,
    };
    
    // Optimistic update - update UI immediately
    dispatch({ type: 'ADD_ITEM', payload: cartItem });

    // If authenticated, sync to backend
    if (isAuthenticated && !authLoading) {
      try {
        const backendItem: BackendCartItem = {
          productId: product._id,
          quantity,
          selectedVariant,
          selectedColor,
        };
        
        const updatedCart = await cartApi.addToCart(backendItem);
        dispatch({ type: 'SET_BACKEND_ITEMS', payload: updatedCart.items });
      } catch (error) {
        console.error('Failed to sync cart to backend:', error);
        
        // Rollback optimistic update
        dispatch({ type: 'REMOVE_ITEM', payload: id });
        
        showToast({ type: 'error', title: 'Failed to add item to cart', message: 'Please try again.' });
      }
    }
  };

  // Remove item from cart
  const removeFromCart = async (id: string) => {
    // Store current state for rollback
    const previousItems = [...state.items];
    
    // Optimistic update
    dispatch({ type: 'REMOVE_ITEM', payload: id });

    // If authenticated, sync to backend
    if (isAuthenticated && !authLoading) {
      try {
        const backendItemId = findBackendItemId(id, state.backendCartItems);
        
        if (backendItemId) {
          const updatedCart = await cartApi.removeCartItem(backendItemId);
          dispatch({ type: 'SET_BACKEND_ITEMS', payload: updatedCart.items });
        }
      } catch (error) {
        console.error('Failed to remove item from backend cart:', error);
        
        // Rollback optimistic update
        dispatch({ type: 'LOAD_CART', payload: previousItems });
        
        showToast({ type: 'error', title: 'Failed to remove item', message: 'Please try again.' });
      }
    }
  };

  // Update item quantity
  const updateQuantity = async (id: string, quantity: number) => {
    // Store current state for rollback
    const previousItems = [...state.items];
    
    // Optimistic update
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });

    // If authenticated, sync to backend
    if (isAuthenticated && !authLoading) {
      try {
        const backendItemId = findBackendItemId(id, state.backendCartItems);
        
        if (backendItemId) {
          const updatedCart = await cartApi.updateCartItem(backendItemId, quantity);
          dispatch({ type: 'SET_BACKEND_ITEMS', payload: updatedCart.items });
        }
      } catch (error) {
        console.error('Failed to update quantity in backend cart:', error);
        
        // Rollback optimistic update
        dispatch({ type: 'LOAD_CART', payload: previousItems });
        
        showToast({ type: 'error', title: 'Failed to update quantity', message: 'Please try again.' });
      }
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    // Store current state for rollback
    const previousItems = [...state.items];
    
    // Optimistic update
    dispatch({ type: 'CLEAR_CART' });

    // If authenticated, sync to backend
    if (isAuthenticated && !authLoading) {
      try {
        await cartApi.clearCart();
        dispatch({ type: 'SET_BACKEND_ITEMS', payload: [] });
      } catch (error) {
        console.error('Failed to clear backend cart:', error);
        
        // Rollback optimistic update
        dispatch({ type: 'LOAD_CART', payload: previousItems });
        
        showToast({ type: 'error', title: 'Failed to clear cart', message: 'Please try again.' });
      }
    }
  };

  // Toggle cart visibility
  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  // Close cart
  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  // Get total number of items in cart
  const getCartItemCount = (): number => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Get cart total price
  const getCartTotal = (): number => {
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
  };

  // Get specific cart item
  const getCartItem = (id: string): CartItem | undefined => {
    return state.items.find(item => item.id === id);
  };

  const value: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    closeCart,
    getCartItemCount,
    getCartTotal,
    getCartItem,
    cartMode,
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
