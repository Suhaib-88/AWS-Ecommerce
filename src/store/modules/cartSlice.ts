import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  cart: any;
}

const initialState: CartState = {
  items: [],
  cart: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const index = state.items.findIndex((item) => item.product_id === action.payload.product_id);
      if (index >= 0) {
        state.items[index].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.product_id !== action.payload);
    },
    setCart(state, action: PayloadAction<any>) {
      state.cart = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
