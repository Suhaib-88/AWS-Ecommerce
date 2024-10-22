import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RepositoryFactory } from '../repositories/RepositoryFactory';
import AnalyticsHandler from '../analytics/AnalyticsHandler';
import { capitalize } from '../util/capitalize';
import { getProductImageUrl } from '../util/getProductImageUrl';

const ProductsRepository = RepositoryFactory.get('products');

interface Product {
  category: string;
  current_stock: number;
  description?: string;
  // Add other product properties as needed
}

export const useProduct = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    const fetchProduct = async () => {
      const fetchedProduct = await ProductsRepository.getProduct(productId);
      setProduct(fetchedProduct);
    };

    fetchProduct();
  }, [productId]);

  const getPersonalizedProduct = async (productId: string) => {
    const personalizedProduct = await ProductsRepository.getProduct(productId, true);
    if (product) {
      setProduct({ ...product, description: personalizedProduct.description });
    }
  };

  const recordProductViewed = (feature: string, exp: string, discount: number) => {
    if (product) {
      AnalyticsHandler.productViewed(user, product, feature, exp, discount);
    }
  };

  const productImageUrl = product ? getProductImageUrl(product) : null;
  const readableProductCategory = product ? capitalize(product.category) : null;
  const outOfStock = product ? product.current_stock === 0 : false;

  return {
    product,
    productImageUrl,
    readableProductCategory,
    outOfStock,
    getPersonalizedProduct,
    recordProductViewed,
  };
};