import { get,put, post } from 'aws-amplify/api';

const resource= "/orders"
const apiName= "demoServices"

interface Order {
    id?: string;
    [key:string]: any;
}


const OrdersRepository = {
    async get(): Promise<Order[]>{
        const restOperation = await get({apiName:apiName, path:`${resource}/all`});
        const {body} = await restOperation.response;
        return body.json()
    },
    
    async getOrderByID(orderID:string): Promise<Order>{
        const restOperation = await get({apiName:apiName, path:`${resource}/id/${orderID}`});
        const {body} = await restOperation.response;
        return body.json()
    },

    async getOrdersByUsername(username:string): Promise<Order[]>{
        const restOperation = await get({apiName:apiName, path:`${resource}/username/${username}`});
        const {body} = await restOperation.response;
        return body.json()
    },

    async updateOrder(order:Order): Promise<Order>{
        const restOperation = await put({apiName:apiName, path:`${resource}/id/${order.id}`, options:{ body:order}});
        const {body} = await restOperation.response;
        return body.json()
    },

    async createOrder(order:Order): Promise<Order>{
        if (!order.id) throw new Error("Order ID is required")
        
        order.channel= "web"
        order.channel_detail= {
            channel_id:1,
            channel_geo:"US"};

        delete order.ttl;
        const restOperation = await post({apiName:apiName, path:resource, options:{ body:order}});
        const {body} = await restOperation.response;
        return body.json()
    },


}


export default OrdersRepository;
