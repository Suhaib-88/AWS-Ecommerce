import React from 'react';
import { discountProductPrice } from '../../util/discoutProductPrice';
import { formatPrice } from '../../util/formatPrice';

interface ProductPriceProps {
  price: number;
  discount?: boolean;
}

const ProductPrice: React.FC<ProductPriceProps> = ({ price, discount = false }) => {
  const formattedPrice = formatPrice(price);
  const discountedPrice = discount ? formatPrice(discountProductPrice(price)) : null;

  return (
    <div>
      <span className="grey">Price:</span> 
      <b className={discount ? 'discounted' : ''}>{formattedPrice}</b> 
      {discount && <b>{discountedPrice}</b>}
    </div>
  );
};

export default ProductPrice;

// Styles can be added using CSS modules or styled-components
// Example using CSS modules:
// .grey {
//   color: var(--grey-600);
// }
// .discounted {
//   text-decoration: line-through;
//   color: red;
// }