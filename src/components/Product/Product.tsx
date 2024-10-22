// ecommerce-ui/src/components/Product/Product.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import FiveStars from '../../components/FiveStars/FiveStars';
import FenixList from '../../components/Fenix/FenixList';
import { getProductImageUrl } from '../../util/getProductImageUrl';
import { formatPrice } from '../../util/formatPrice';

interface ProductProps {
  product: {
    id: string;
    name: string;
    price: number;
  };
  experiment?: {
    correlationId: string;
    type: string;
    variationIndex: number;
  };
  promotionName?: string;
  feature: string;
}

const getFullExperimentType = (type: string) => {
  switch (type) {
    case 'ab':
      return 'Experiment: A/B';
    case 'interleaving':
      return 'Experiment: Interleaved';
    case 'mab':
      return 'Experiment: Multi-Armed Bandit';
    case 'optimizely':
      return 'Experiment: Optimizely';
    case 'evidently':
      return 'Experiment: Evidently';
    default:
      return 'Experiment: Unknown';
  }
};

const Product: React.FC<ProductProps> = ({ product, experiment, promotionName, feature }) => {
  const fenixenablePDP = import.meta.env.VITE_FENIX_ENABLED_PDP;
  const fenixcurrentvariant = product.id;
  const productImageURL = getProductImageUrl(product);
  const formattedPrice = formatPrice(product.price);
  const experimentCorrelationId = experiment?.correlationId;
  const experimentDescription = experiment
    ? `${getFullExperimentType(experiment.type)}; Variation: ${experiment.variationIndex}`
    : null;

  return (
    <div className="featured-product d-flex flex-column justify-content-between text-left">
      <Link
        className="link"
        to={{
          pathname: `/product/${product.id}`,
          search: `?feature=${feature}&exp=${experimentCorrelationId}`,
        }}
      >
        <div>
          <div className="position-relative">
            {promotionName && <div className="small promoted-product-banner">Promoted</div>}
            <img src={productImageURL} className="card-img-top" alt={product.name} />
          </div>

          <div className="p-3">
            <div className="product-name">{product.name}</div>
            <FiveStars />
            <div>{formattedPrice}</div>
            {experiment && (
              <div className="experiment mt-1 align-items-center text-muted small">
                <i className="scale-icon fa fa-balance-scale mr-1"></i> {experimentDescription}
              </div>
            )}
          </div>
          {/* {fenixenablePDP === 'TRUE' && (
            <div className="fenix-estimates">
              <FenixList currentvariant={fenixcurrentvariant}/>
            </div>
          )} */}
        </div>
      </Link>
    </div>
  );
};

export default Product;