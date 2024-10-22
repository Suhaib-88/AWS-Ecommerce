import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { removeFromCart, increaseQuantity, decreaseQuantity } from '../../cartActions';
import LoadingFallback from '../../components/LoadingFallback/LoadingFallback';
import ProductPrice from '../../components/ProductPrice/ProductPrice';
import { AnalyticsHandler } from '../../analytics/AnalyticsHandler';

interface CartItemProps {
  productId: string;
  quantity: number;
  cartPrice?: number;
}

const CartItem: React.FC<CartItemProps> = ({ productId, quantity, cartPrice }) => {
  const dispatch = useDispatch();
  const product = useSelector((state: RootState) => state.product.products[productId]);
  const cart = useSelector((state: RootState) => state.cart.cart);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Assuming a function to fetch product by ID exists
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  const handleRemoveProduct = () => {
    dispatch(removeFromCart(productId));
    AnalyticsHandler.recordShoppingCart(user, cart);
  };

  const handleIncreaseQuantity = () => {
    dispatch(increaseQuantity(productId));
    AnalyticsHandler.recordShoppingCart(user, cart);
  };

  const handleDecreaseQuantity = () => {
    dispatch(decreaseQuantity(productId));
    AnalyticsHandler.recordShoppingCart(user, cart);
  };

  if (!product) {
    return <LoadingFallback />;
  }

  return (
    <li>
      <div className="row">
        <div className="col-sm-4 mb-2 mb-sm-0">
          <img src={product.imageUrl} alt="" className="img-fluid" />
        </div>
        <div className="col d-flex flex-column justify-content-between">
          <div className="product-name font-weight-bold">{product.name}</div>
          <div className="d-flex d-sm-block justify-content-between align-items-center">
            <ProductPrice price={product.price} className="product-price" discount={cartPrice < product.price} />
            <div className="d-flex align-items-center">
              <button onClick={handleDecreaseQuantity} aria-label="decrease quantity" className="btn text-black-50">
                <i className="fas fa-minus"></i>
              </button>
              <div className="quantity text-center font-weight-bold" aria-label={`quantity is ${quantity}`}>
                {quantity}
              </div>
              <button onClick={handleIncreaseQuantity} aria-label="increase quantity" className="btn text-black-50">
                <i className="fas fa-plus"></i>
              </button>
              <button className="delete-btn btn" onClick={handleRemoveProduct}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
