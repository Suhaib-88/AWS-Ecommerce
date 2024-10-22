// DemoGuideBadge.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { demoGuideBadgeClicked } from '../../redux/actions/appModalActions';
import { Articles } from '../../partials/AppModal/DemoGuide/config';

const Services = {
  Pinpoint: 'Pinpoint',
  Personalize: 'Personalize',
  Bedrock: 'Bedrock',
};

interface DemoGuideBadgeProps {
  article: string;
  hideTextOnSmallScreens?: boolean;
}

const DemoGuideBadge: React.FC<DemoGuideBadgeProps> = ({ article, hideTextOnSmallScreens = false }) => {
  const dispatch = useDispatch();

  const service = getService(article);
  const serviceLogo = getServiceLogo(service);
  const copy = getCopy(article);
  const poweredByService = getPoweredByService(service);

  function getService(article: string) {
    switch (article) {
      case Articles.SMS_MESSAGING:
      case Articles.PERSONALIZED_EMAILS:
        return Services.Pinpoint;
      case Articles.USER_PERSONALIZATION:
      case Articles.PERSONALIZED_RANKING:
      case Articles.SIMS_RECOMMENDATIONS:
      case Articles.SIMILAR_ITEMS_RECOMMENDATIONS:
      case Articles.SIMILAR_ITEMS_WITH_THEME:
      case Articles.ECOMM_CUSTOMERS_WHO_VIEWED_X:
      case Articles.ECOMM_FBT:
      case Articles.ECOMM_POPULAR_BY_PURCHASES:
      case Articles.ECOMM_POPULAR_BY_VIEWS:
      case Articles.ECOMM_RFY:
        return Services.Personalize;
      case Articles.PERSONALIZED_PRODUCT:
        return Services.Bedrock;
      default:
        throw new Error('Invalid article passed to DemoGuideBadge');
    }
  }

  function getServiceLogo(service: string) {
    switch (service) {
      case Services.Pinpoint:
        return '/pinpoint.svg';
      case Services.Personalize:
        return '/personalize.svg';
      case Services.Bedrock:
        return '/bedrock.svg';
      default:
        throw new Error('Invalid service passed to DemoGuideBadge');
    }
  }

  function getCopy(article: string) {
    switch (article) {
      case Articles.SMS_MESSAGING:
        return 'Learn more about personalized product recommendations via SMS';
      case Articles.USER_PERSONALIZATION:
        return 'Learn more about user personalization';
      case Articles.PERSONALIZED_RANKING:
        return 'Learn more about personalized rankings';
      case Articles.SIMS_RECOMMENDATIONS:
        return 'Learn more about similar item (SIMS) recommendations';
      case Articles.SIMILAR_ITEMS_RECOMMENDATIONS:
        return 'Learn more about similar items recommendations with personalized ranking';
      case Articles.SIMILAR_ITEMS_WITH_THEME:
        return 'Learn more about similar items with generative AI theme';
      case Articles.ECOMM_CUSTOMERS_WHO_VIEWED_X:
        return 'Learn more about customers who viewed X viewed';
      case Articles.ECOMM_FBT:
        return 'Learn more about frequently bought together';
      case Articles.ECOMM_POPULAR_BY_PURCHASES:
        return 'Learn more about most purchased';
      case Articles.ECOMM_POPULAR_BY_VIEWS:
        return 'Learn more about most viewed';
      case Articles.ECOMM_RFY:
        return 'Learn more about recommended for you';
      case Articles.PERSONALIZED_EMAILS:
        return 'Learn more about the abandoned shopping cart email notifications';
      case Articles.PERSONALIZED_PRODUCT:
        return 'Learn more about personalized product descriptions';
      default:
        throw new Error('Invalid article passed to DemoGuideBadge');
    }
  }

  function getPoweredByService(service: string) {
    switch (service) {
      case Services.Pinpoint:
        return 'Amazon Pinpoint';
      case Services.Personalize:
        return 'Amazon Personalize';
      case Services.Bedrock:
        return 'Amazon Bedrock';
      default:
        throw new Error('Invalid service passed to DemoGuideBadge');
    }
  }

  const onClick = () => {
    dispatch(demoGuideBadgeClicked(article));
  };

  return (
    <button type="button" onClick={onClick} aria-label={copy} className="demo-guide-badge align-items-center text-left">
      <div className="logo mr-1">
        <img src={serviceLogo} alt="" className="img-fluid" />
      </div>
      <div className={`text ${hideTextOnSmallScreens ? 'hide-text-on-small-screens' : ''}`}>
        <div>{copy}</div>
        <div className="powered-by">
          powered by <span className="service">{poweredByService}</span>
        </div>
      </div>
    </button>
  );
};

export default DemoGuideBadge;
