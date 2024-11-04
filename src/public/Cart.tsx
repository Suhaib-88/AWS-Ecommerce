import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CartItem from './components/CartItem';
// import Layout from '../components/Layout/Layout';
// import AbandonCartButton from '../partials/
// import FenixCart from '../components/Fenix/';
// import { AnalyticsHandler } from '../analytics/AnalyticsHandler';

const Cart: React.FC = () => {
  const cart = useSelector((state: any) => state.cart.cart);
  // const user = useSelector((state: any) => state.user);
  const lastVisitedPage = useSelector((state: any) => state.lastVisitedPage.route);
  const cartQuantity = useSelector((state: any) => state.cartQuantity);
  // const cartTotal = useSelector((state: any) => state.cartTotal);
  const formattedCartTotal = useSelector((state: any) => state.formattedCartTotal);
  // const fenixenableCART = import.meta.env.VITE_FENIX_ENABLED_CART;

  // useEffect(() => {
  //   AnalyticsHandler.cartViewed(user, cart, cartQuantity, cartTotal);
  //   AnalyticsHandler.recordShoppingCart(user, cart);
  // }, [user, cart, cartQuantity, cartTotal]);

  const isLoading = !cart;
  const previousPageLinkProps = lastVisitedPage ? { text: 'Continue Shopping', to: lastVisitedPage } : null;
  const cartQuantityReadout = cartQuantity !== null ? `(${cartQuantity}) ${cartQuantity === 1 ? 'item' : 'items'} in your cart shopping cart` : null;
  const summaryQuantityReadout = cartQuantity !== null ? `Summary (${cartQuantity}) ${cartQuantity === 1 ? 'item' : 'items'}` : null;

  return (
    // <Layout isLoading={isLoading} previousPageLinkProps={previousPageLinkProps}>
      <div className="container text-left">
        <div className="row">
          <div className="col">
            <div className="row">
              <div className="col mb-3 mb-sm-5">
                <div className="quantity-readout p-3 font-weight-bold">{cartQuantityReadout}</div>
              </div>
            </div>

            <ul className="cart-items">
              {/* {re */}
            </ul>
          </div>
          {cart.items.length > 0 && (
            <div className="summary-container col-lg-auto">
              {/* {fenixenableCART === 'TRUE' && <FenixCart lineItems={cart} />} */}
              <div className="summary p-4">
                <div className="summary-quantity">{summaryQuantityReadout}</div>
                <div className="summary-total mb-2 font-weight-bold">Your Total: {formattedCartTotal}</div>
                <Link to="/checkout" className="checkout-btn mb-3 btn btn-outline-dark btn-block btn-lg">
                  Checkout
                </Link>
                {/* <AbandonCartButton className="abandon-cart" /> */}
              </div>
            </div>
          )}
        </div>
      </div>
    // </Layout>
  );
};

export default Cart;