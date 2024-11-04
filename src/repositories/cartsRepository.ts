// cartsService.ts
import { get, post, put } from 'aws-amplify/api';

const resource = "/carts";
const apiName = 'demoServices';

export const CartsRepository = {
  async get(): Promise<any> {
    const restOperation = get({
      apiName,
      path: resource,
    });
    const { body } = await restOperation.response;
    return body.json();
  },

  async getCartByID(cartID: string): Promise<any> {
    if (!cartID) throw new Error("cartID required");

    const restOperation = get({
      apiName,
      path: `${resource}/${cartID}`,
    });
    const { body } = await restOperation.response;
    return body.json();
  },

  async getCartByUsername(username: string): Promise<any> {
    if (!username) throw new Error("username required");

    const restOperation = get({
      apiName,
      path: resource,
      options: {
        queryParams: { username },
      },
    });
    const { body } = await restOperation.response;
    return body.json();
  },

  async createCart(username: string): Promise<any> {
    if (!username) throw new Error("username required");

    const payload = {
      username,
    };

    const restOperation = post({
      apiName,
      path: resource,
      options: {
        body: payload,
      },
    });
    const { body } = await restOperation.response;
    return body.json();
  },

  async updateCart(cart: any): Promise<any> {
    if (!cart) throw new Error("cart required");

    const restOperation = put({
      apiName,
      path: `${resource}/${cart.id}`,
      options: {
        body: cart,
      },
    });
    const { body } = await restOperation.response;
    return body.json();
  },

  async signAmazonPayPayload(payload: any): Promise<any> {
    const restOperation = post({
      apiName,
      path: '/sign',
      options: {
        body: payload,
      },
    });
    const { body } = await restOperation.response;
    return body.json();
  },
};

export default CartsRepository;
