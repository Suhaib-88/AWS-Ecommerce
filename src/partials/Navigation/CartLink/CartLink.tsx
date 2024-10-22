import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CartState } from '../../../store/modules/cart/cart';
// import { State } from '../../../store/modules/user/user';
import { LastVisitedPageState } from '../../../store/modules/lastVisitedPage/lastVisitedPage';
// import { RootState } from '@/store'; // Adjust according to your Redux store structure
import CartIcon from './CartIcon';

// Define RootState by combining the state interfaces from your modules
interface RootState {
  cart: CartState; // Assuming CartState is defined in your cart module
  // user: State; // Assuming State is defined in your store
  lastVisitedPage: LastVisitedPageState; // Assuming LastVisitedPageState is defined in your lastVisitedPage module
  // Add other states as needed
}

const CartLink: React.FC = () => {
  const cartQuantity = useSelector((state: RootState) => state.cart.cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0);
  const quantityRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    updateQuantityDimensions();
  }, [cartQuantity]);

  const updateQuantityDimensions = () => {
    const quantityElem = quantityRef.current;
    if (quantityElem) {
      const { offsetWidth, offsetHeight } = quantityElem;

      if (offsetWidth > offsetHeight) {
        quantityElem.style.height = `${offsetWidth}px`;
      } else {
        quantityElem.style.width = `${offsetHeight}px`;
      }
    }
  };

  return (
    <Link to="/cart" aria-label="cart" className="cart d-flex flex-column align-items-center">
      <div className="quantity" ref={quantityRef}>
        {cartQuantity}
      </div>
      <CartIcon />
    </Link>
  );
};

export default CartLink;
