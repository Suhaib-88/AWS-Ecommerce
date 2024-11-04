import { RepositoryFactory } from '@/repositories/RepositoryFactory';
import { parseCart } from './util';
import { formatPrice } from '@/util/formatPrice';
import { AnalyticsHandler } from '@/analytics/AnalyticsHandler';

const CartsRepository = RepositoryFactory.get('carts');

function maybeUpdateUsername(state, commit, dispatch, rootState) {
  if (state.cart.username !== rootState.username) {
    commit({ type: 'setUsername', username: rootState.username });
  }
}

export const cart = {
  state: () => ({ cart: null }),
  getters: {
    cartTotal: (state) => state.cart?.items.reduce((subtotal, item) => subtotal + item.quantity * item.price, 0) ?? 0,
    cartQuantity: (state) => state.cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0,
    formattedCartTotal: (state, getters) => {
      if (!state.cart) return null;
      return formatPrice(getters.cartTotal);
    },
  },
  mutations: {
    setCart: (state, { cart: newCart }) => (state.cart = newCart),
    addQuantityToItem: (state, { index, quantity }) => (state.cart.items[index].quantity += quantity),
    addItemToCart: (state, { item }) => state.cart.items.push(item),
    removeItemFromCart: (state, { index }) => state.cart.items.splice(index, 1),
    setUsername: (state, { username }) => { state.cart.username = username; }
  },
  actions: {
    createCart: async ({ commit, getters }) => {
      const data = await CartsRepository.createCart(getters.username);
      let newCart = parseCart(data);
      newCart.username = getters.username;
      commit({ type: 'setCart', cart: newCart });
    },
    getCart: async ({ state, commit, dispatch, getters }) => {
      if (!state.cart || !state.cart.id) {
        const data = await CartsRepository.getCartByUsername(getters.username);
        if (data.length > 0) {
          commit({ type: 'setCart', cart: parseCart(data[0]) });
        } else {
          return dispatch('createCart');
        }
      } else {
        const data = await CartsRepository.getCartByID(state.cart.id);
        commit({ type: 'setCart', cart: parseCart(data) });
        maybeUpdateUsername(state, commit, dispatch, getters);
      }
    },
    updateCart: async ({ state, commit, dispatch, getters }) => {
      maybeUpdateUsername(state, commit, dispatch, getters);
      const data = await CartsRepository.updateCart(state.cart);
      commit({ type: 'setCart', cart: parseCart(data) });
    },
    addToCart: async ({ state, commit, dispatch, rootState }, { product, quantity, feature, exp }) => {
      maybeUpdateUsername(state, commit, dispatch, rootState);
      const index = state.cart.items.findIndex((item) => item.product_id === product.id);
      if (index !== -1) {
        commit({ type: 'addQuantityToItem', index, quantity });
      } else {
        commit({ type: 'addItemToCart', item: { product_id: product.id, product_name: product.name, price: product.price, quantity } });
      }
      await dispatch('updateCart');
      AnalyticsHandler.productAddedToCart(rootState.user, state.cart, product, quantity, feature, exp);
    },
    removeFromCart: async ({ state, commit, dispatch, rootState }, product_id) => {
      maybeUpdateUsername(state, commit, dispatch, rootState);
      const index = state.cart.items.findIndex((item) => item.product_id === product_id);
      const removedItem = state.cart.items[index];
      commit({ type: 'removeItemFromCart', index });
      await dispatch('updateCart');
      AnalyticsHandler.productRemovedFromCart(rootState.user, state.cart, removedItem, removedItem.quantity);
    },
  },
};
