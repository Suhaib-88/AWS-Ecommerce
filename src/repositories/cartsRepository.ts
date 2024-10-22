import { get,put, post } from 'aws-amplify/api';

const resource= "/carts"
const apiName= "demoServices"

interface Cart {
    id?: string;
    username?: string;
    [key:string]: any;
}
interface AmazonPayPayload {
    [key:string]: any;
}

const CartsRepository = {
    async get(): Promise<Cart[]>{
        const restOperation = await get({apiName:apiName, path:resource});
        const {body} = await restOperation.response;
        return body.json()
    },
    async getCartById(cartID:string): Promise<Cart>{
        if (!cartID || cartID.length === 0) throw new Error("Cart ID is required")
        const restOperation = await get({apiName:apiName, path:`${resource}/id/${cartID}`});
        const {body} = await restOperation.response;
        return body.json()
    },
    async getCartByUsername(username:string): Promise<Cart>{
        if (!username || username.length === 0) throw new Error("Username is required")
        const restOperation = await get({apiName:apiName, path:`${resource}/username/${username}`});
        const {body} = await restOperation.response;
        return body.json()
    },
    async createCart(username:string): Promise<Cart>{
        if (!username || username.length === 0) throw new Error("Username is required")


        const payload={
            username:username,
        };
        const restOperation = await post({apiName:apiName, path:resource, options:{ body:payload}});
        const {body} = await restOperation.response;
        return body.json()
    },
    async updateCart(cart:Cart): Promise<Cart>{
        if (!cart) throw new Error("Cart ID is required")
        const restOperation = await put({apiName:apiName, path:`${resource}/${cart.id}`, options:{ body:cart}});
        const {body} = await restOperation.response;
        return body.json()
    },
    async signAmazonPayPayload(payload:AmazonPayPayload): Promise<any>{
        const restOperation = await post({apiName:apiName, path:`/sign`, options:{ body:payload}});
        const {body} = await restOperation.response;
        return body.json()
    },

};

export default CartsRepository;
