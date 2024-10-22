import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '@/components/Layout/Layout';
import ProductPrice from '@/components/ProductPrice/ProductPrice';
import FiveStars from '@/components/FiveStars/FiveStars';
import RecommendedProductsSection from '@/components/RecommendedProductsSection/RecommendedProductsSection';
import DemoGuideBadge from '@/components/DemoGuideBadge/DemoGuideBadge';
import LoadingFallback from '@/components/LoadingFallback/LoadingFallback';
import Fenixmaster from '@/components/Fenix/Fenixmaster';
import { discountProductPrice } from '@/util/discountProductPrice';
import { fetchProductByID, addToCart, getRelatedProducts } from '@/actions/productActions';
import { RootState } from '@/store';

interface ProductDetailProps {
  discount?: boolean;
  currentvariant?: object | number | string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ discount = false }) => {
  const dispatch = useDispatch();
  const product = useSelector((state: RootState) => state.product);
  const user = useSelector((state: RootState) => state.user);
  const cart = useSelector((state: RootState) => state.cart.cart);

  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState(null);
  const [loadingPersonalizedProductDescription, setLoadingPersonalizedProductDescription] = useState(false);
  const [isDescriptionPersonalized, setIsDescriptionPersonalized] = useState(false);

  useEffect(() => {
    dispatch(fetchProductByID(product.id));
    setIsDescriptionPersonalized(false);
  }, [dispatch, product.id]);

  const handleAddToCart = async () => {
    await dispatch(addToCart({
      product: {
        ...product,
        price: discount ? discountProductPrice(product.price) : product.price,
      },
      quantity,
    }));

    renderAddedToCartConfirmation();
    setQuantity(1);
  };

  const renderAddedToCartConfirmation = () => {
    swal({
      title: 'Added to Cart',
      icon: 'success',
      buttons: {
        cancel: 'Continue Shopping',
        cart: 'View Cart',
      },
    }).then((value) => {
      if (value === 'cart') {
        // Navigate to cart
      }
    });
  };

  return (
    <Layout isLoading={!product}>
      <div className="container">
        <main className="product-container mb-5 text-left">
          <div className="title-and-rating mb-md-3">
            <h1 className="product-name">{product.name}</h1>
            <FiveStars />
          </div>

          <div className="add-to-cart-and-description">
            <ProductPrice price={product.price} discount={discount} className="mb-1" />

            <div className="mb-2">
              {product.current_stock > 0 ? (
                <>Items currently in stock: {product.current_stock}</>
              ) : (
                <>Sorry, this item is currently out of stock.</>
              )}
            </div>

            <div className="mb-5 mb-md-4 d-flex">
              <button
                className="quantity-dropdown mr-3 btn btn-outline-secondary dropdown-toggle"
                type="button"
                id="quantity-dropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Qty: {quantity}
              </button>
              <div className="dropdown-menu" aria-labelledby="quantity-dropdown">
                {[...Array(Math.max(0, Math.min(9, product.current_stock - (cart?.quantity || 0)))].map((_, i) => (
                  <button key={i} className="dropdown-item" onClick={() => setQuantity(i)}>
                    {i}
                  </button>
                ))}
              </div>
              <button className="add-to-cart-btn btn" onClick={handleAddToCart} disabled={product.current_stock <= 0}>
                Add to Cart
              </button>
            </div>

            <p dangerouslySetInnerHTML={{ __html: product.description }}></p>
          </div>

          <div className="product-img">
            <img src={product.imageUrl} className="img-fluid" alt={product.name} />
          </div>
        </main>

        <RecommendedProductsSection experiment={null} recommendedProducts={relatedProducts} feature={null}>
          <div>Compare similar items</div>
        </RecommendedProductsSection>
      </div>
    </Layout>
  );
};

export default ProductDetail;
