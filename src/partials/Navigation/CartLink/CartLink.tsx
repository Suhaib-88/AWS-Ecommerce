import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../../store/store';
// import { State } from '../../../store/modules/user/user';
// import { LastVisitedPageState } from '../../../store/modules/lastVisitedPage/lastVisitedPage';
// import { RootState } from '@/store'; // Adjust according to your Redux store structure
import CartIcon from './CartIcon';



const CartLink: React.FC = () => {
  const cartQuantity = useSelector((state: RootState) => state.cart.cart?.reduce((acc, item) => acc + item.quantity, 0) || 0);
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
