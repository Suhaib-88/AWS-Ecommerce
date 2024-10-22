interface CartItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

type Cart = {
  id?: string;
  username?: string;
  items: CartItem[]; // Use the CartItem type for items
};

export const parseCart = (cart: Cart): Cart =>
  cart.items !== null
    ? cart
    : {
        ...cart,
        items: [],
      };