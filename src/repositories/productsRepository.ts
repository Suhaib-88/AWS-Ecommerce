// productsService.ts

import { get } from 'aws-amplify/api';



const resource = "/products";
const apiName = 'demoServices';

export const ProductsRepository = {
  
  
  async get(): Promise<any> {
    const restOperation = get({
      apiName: apiName,
      path: `${resource}/all`,
    });
    
    return restOperation;
  },

  async getFeatured(): Promise<any> {
    const restOperation = get({
      apiName: apiName,
      path: `${resource}/featured`,
    });
    const { body } = await restOperation.response;
    return body.json();
  },

  async getProduct(productID: string | string[], personalized: boolean = false): Promise<any> {
    if (!productID || productID.length === 0) {
      throw new Error("productID required");
    }

    if (Array.isArray(productID)) {58
      productID = productID.join(',');
    }

    const params: Record<string, any> = {};
    if (personalized) {
      params['personalized'] = true;
    }

    const restOperation = get({
      apiName: apiName,
      path: `${resource}/id/${productID}`,
      options: {
        queryParams: params,
      },
    });
    const { body } = await restOperation.response;
    return body.json();
  },

  async getProductsByCategory(categoryName: string): Promise<any> {
    if (!categoryName || categoryName.length === 0) {
      throw new Error("categoryName required");
    }

    const restOperation = get({
      apiName: apiName,
      path: `${resource}/category/${categoryName}`,
    });
    const { body } = await restOperation.response;
    return body.json();
  },

  async getCategories(): Promise<any> {
    const restOperation = get({
      apiName: apiName,
      path: "/categories/all",
    });
    const { body } = await restOperation.response;
    return body.json();
  },
};
