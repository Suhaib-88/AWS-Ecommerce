// ecommerce-ui/src/store/modules/cart/CartContext.tsx

import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { RepositoryFactory } from '../../../repositories/RepositoryFactory';
import { parseCart } from './util';
// import { formatPrice } from '@/util/formatPrice';
// import { AnalyticsHandler } from '../../../analytics/AnalyticsHandler';

const CartsRepository = RepositoryFactory.get('carts');

interface CartItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

interface Cart {
  id?: string;
  username?: string;
  items: CartItem[];
}

export interface CartState {
  cart: Cart | null;
}

type CartAction =
  | { type: 'SET_CART'; cart: Cart }
  | { type: 'ADD_QUANTITY_TO_ITEM'; index: number; quantity: number }
  | { type: 'ADD_ITEM_TO_CART'; item: CartItem }
  | { type: 'REMOVE_ITEM_FROM_CART'; index: number }
  | { type: 'SET_USERNAME'; username: string };

const initialState: CartState = { cart: null };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.cart };
    case 'ADD_QUANTITY_TO_ITEM':
      if (!state.cart) return state;
      const updatedItems = [...state.cart.items];
      updatedItems[action.index].quantity += action.quantity;
      return { ...state, cart: { ...state.cart, items: updatedItems } };
    case 'ADD_ITEM_TO_CART':
      if (!state.cart) return state;
      return { ...state, cart: { ...state.cart, items: [...state.cart.items, action.item] } };
    case 'REMOVE_ITEM_FROM_CART':
      if (!state.cart) return state;
      return { ...state, cart: { ...state.cart, items: state.cart.items.filter((_, i) => i !== action.index) } };
    case 'SET_USERNAME':
      if (!state.cart) return state;
      return { ...state, cart: { ...state.cart, username: action.username } };
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

// Example action function
export const createCart = async (dispatch: React.Dispatch<CartAction>, username: string) => {
  console.log('Creating cart with username ' + username);
  const data = await CartsRepository.createCart(username);
  const newCart = parseCart(data);
  newCart.username = username;
  dispatch({ type: 'SET_CART', cart: newCart });
};

// Add more action functions similar to createCart for other actions like getCart, updateCart, etc.