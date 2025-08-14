import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types';

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
}

// Cart action types
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

// Initial cart state
const initialState: CartState = {
  items: [],
  isOpen: false,
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

    default:
      return state;
  }
}

// Cart context interface
interface CartContextType {
  state: CartState;
  addToCart: (product: Product, quantity: number, selectedVariant?: number, selectedColor?: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  getCartItemCount: () => number;
  getCartTotal: () => number;
  getCartItem: (id: string) => CartItem | undefined;
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
      return { items, isOpen: false };
    }
  } catch (error) {
    console.error('Error parsing cart from localStorage:', error);
  }
  return initialState;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, initializeCartState);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('fakira-cart', JSON.stringify(state.items));
  }, [state.items]);

  // Generate unique cart item ID
  const generateCartItemId = (product: Product, selectedVariant?: number): string => {
    if (selectedVariant !== undefined && selectedVariant >= 0) {
      return `${product._id}-variant-${selectedVariant}`;
    }
    return product._id;
  };

  // Add item to cart
  const addToCart = (product: Product, quantity: number, selectedVariant?: number, selectedColor?: string) => {
    const id = generateCartItemId(product, selectedVariant);
    const cartItem: CartItem = {
      id,
      product,
      quantity,
      selectedVariant,
      selectedColor,
    };
    dispatch({ type: 'ADD_ITEM', payload: cartItem });
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
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
