// ordersService.ts
import { get, post, put } from 'aws-amplify/api';

const resource = "/orders";
const apiName = 'demoServices';

export const OrdersRepository = {
  async get(): Promise<any> {
    const restOperation = get({
      apiName,
      path: `${resource}/all`,
    });
    const { body } = await restOperation.response;
    return body.json();
  },

  async getOrderByID(orderID: string): Promise<any> {
    if (!orderID) throw new Error("orderID required");

    const restOperation = get({
      apiName,
      path: `${resource}/id/${orderID}`,
    });
    const { body } = await restOperation.response;
    return body.json();
  },

  async getOrdersByUsername(username: string): Promise<any> {
    if (!username) throw new Error("username required");

    const restOperation = get({
      apiName,
      path: `${resource}/username/${username}`,
    });
    const { body } = await restOperation.response;
    return body.json();
  },

  async updateOrder(order: any): Promise<any> {
    if (!order) throw new Error("order required");

    const restOperation = put({
      apiName,
      path: `${resource}/id/${order.id}`,
      options: {
        body: order,
      },
    });
    const { body } = await restOperation.response;
    return body.json();
  },

  async createOrder(order: any): Promise<any> {
    if (!order) throw new Error("order required");

    order.channel = 'WEB';
    order.channel_detail = {
      channel_id: 1,
      channel_geo: 'US',
    };

    delete order.ttl;

    const restOperation = post({
      apiName,
      path: resource,
      options: {
        body: order,
      },
    });
    const { body } = await restOperation.response;
    return body.json();
  },
};

export default OrdersRepository;