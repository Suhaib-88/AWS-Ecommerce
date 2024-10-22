import { get } from 'aws-amplify/api';

const resource= "/products"
const apiName= "demoServices"

interface Product {
    id: string;
    name: string;
    category?: string;
    description?: string;
    price?: number;
}

interface GetProductOptions {
    personalized?:boolean;
}

const ProductsRepository = {
    async get(): Promise<Product[]>{
        const restOperation = await get({apiName:apiName, path:`${resource}/all`});
        const {body} = await restOperation.response;
        return body.json()
    },

    async getFeatured(): Promise<Product[]>{
        const restOperation = await get({apiName:apiName, path:`${resource}/featured`});
        const {body} = await restOperation.response;
        return body.json()
    },
    
    async getProduct(productId:string | string[], personalized:boolean= false): Promise<Product>{
        if (!productId || productId.length === 0) throw new Error("Product ID is required")

        if (Array.isArray(productId)){
            productId = productId.join();
        }
        const params: GetProductOptions = {};
        if (personalized) params.personalized = true;

        const restOperation = await get({apiName:apiName, path:`${resource}/${productId}`, queryStringParameters: params});
        const {body} = await restOperation.response;
        return body.json()
    },

    async getProductsByCategory(categoryName:string): Promise<Product[]>{
        if (!categoryName || categoryName.length === 0) throw new Error("Category name is required")

        const restOperation = await get({apiName:apiName, path:`${resource}/category/${categoryName}`});
        const {body} = await restOperation.response;
        return body.json()
    },

    async getCategories(): Promise<string[]>{
        const restOperation = await get({apiName:apiName, path:`/categories/all`});
        const {body} = await restOperation.response;
        return body.json()
    }
}

export default ProductsRepository;
