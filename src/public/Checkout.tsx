import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import Layout from '@/components/Layout/Layout';
import AbandonCartButton from '@/partials/AbandonCartButton/AbandonCartButton';
import AmazonPayButton from "@/public/components/AmazonPayButton";
import FenixCheckout from '@/components/Fenix/FenixCheckout';
import { getCartByID, createOrder } from '@/repositories/RepositoryFactory';
import { checkoutStarted, orderCompleted } from '@/analytics/AnalyticsHandler';
import { getNewCart } from '@/store/store';

const Checkout: React.FC = () => {
  const [cart, setCart] = useState(null);
  const [order, setOrder] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [collectionPhone, setCollectionPhone] = useState('');
  const [collection, setCollection] = useState(false);
  const [hasConsentedPhone, setHasConsentedPhone] = useState(false);
  const fenixenableCHECKOUT = process.env.REACT_APP_FENIX_ENABLED_CHECKOUT;
  
  const user = useSelector((state: any) => state.user);
  const cartID = useSelector((state: any) => state.cart.cart?.id);
  const cartQuantity = useSelector((state: any) => state.cartQuantity);
  const cartTotal = useSelector((state: any) => state.cartTotal);
  const formattedCartTotal = useSelector((state: any) => state.formattedCartTotal);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const fetchCart = async () => {
      if (cartID) {
        const fetchedCart = await getCartByID(cartID);
        setCart(fetchedCart);
        setOrder(fetchedCart);
        if (user) {
          setShowCheckout(true);
          checkoutStarted(user, fetchedCart, cartQuantity, cartTotal);
        }
      }
    };
    fetchCart();
  }, [cartID, user, cartQuantity, cartTotal]);

  const promoApplied = () => {
    swal({
      title: "Promo Applied",
      icon: "success",
      buttons: {
        cancel: "OK",
      }
    });
  };

  const signIn = () => {
    history.push('/auth');
  };

  const guestCheckout = () => {
    setShowCheckout(true);
  };

  const finalizeAmazonPayOrder = () => {
    submitOrder(() => {});
  };

  const handleSubmitOrderButton = () => {
    submitOrder(() => {
      swal({
        title: "Order Submitted",
        icon: "success",
        buttons: {
          cancel: "OK",
        }
      }).then(() => {
        history.push('/');
      });
    });
  };

  const submitOrder = (callback: () => void) => {
    if (collection) {
      order.shipping_address = {};
      order.delivery_type = 'COLLECTION';
      order.collection_phone = '+' + collectionPhone;
    } else {
      order.delivery_type = 'DELIVERY';
    }
    createOrder(cart).then(order => {
      orderCompleted(user, cart, order);
      dispatch(getNewCart());
      callback();
    });
  };

  const placeOrderEnabled = !collection || hasConsentedPhone;
  const amazonPayEnabled = process.env.REACT_APP_AMAZON_PAY_PUBLIC_KEY_ID && 
                           process.env.REACT_APP_AMAZON_PAY_STORE_ID && 
                           process.env.REACT_APP_AMAZON_PAY_MERCHANT_ID;

  return (
    <Layout isLoading={!cart} previousPageLinkProps={{ to: '/cart', text: 'Back to shopping cart' }}>
      <div className="content">
        {/* ... existing JSX structure ... */}
        <div className="container" style={{ display: cart ? 'block' : 'none' }}>
          {/* ... other components and logic ... */}
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;