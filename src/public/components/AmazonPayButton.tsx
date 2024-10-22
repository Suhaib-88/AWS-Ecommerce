import React, { useEffect, useState } from 'react';
import { RepositoryFactory } from '../../repositories/RepositoryFactory';

const CartsRepository = RepositoryFactory.get('carts');

const AmazonPayButton: React.FC = () => {
  const [payload, setPayload] = useState({
    webCheckoutDetails: {
      checkoutReviewReturnUrl: 'https://developer.amazon.com/docs/amazon-pay-checkout/introduction.html'
    },
    storeId: import.meta.env.VITE_AMAZON_PAY_STORE_ID,
    chargePermissionType: "OneTime"
  });

  const [payloadSignature, setPayloadSignature] = useState<string | null>(null);

  useEffect(() => {
    loadAmazonPayButton();
  }, [payload]);

  const loadAmazonPayButton = async () => {
    if (!document.getElementById("amazon-pay-checkout-javascript")) {
      const payscript = document.createElement('script');
      payscript.setAttribute('src', 'https://static-na.payments-amazon.com/checkout.js');
      payscript.setAttribute('id', 'amazon-pay-checkout-javascript');
      document.head.appendChild(payscript);
    }

    await signPayload();

    // eslint-disable-next-line no-undef
    amazon.Pay.renderButton('#AmazonPayButton', {
      merchantId: import.meta.env.VITE_AMAZON_PAY_MERCHANT_ID,
      ledgerCurrency: 'USD',
      sandbox: true,
      checkoutLanguage: 'en_US',
      productType: 'PayOnly',
      placement: 'Checkout',
      buttonColor: 'Gold',
      createCheckoutSessionConfig: {
        payloadJSON: JSON.stringify(payload),
        signature: payloadSignature,
        publicKeyId: import.meta.env.VITE_AMAZON_PAY_PUBLIC_KEY_ID
      }
    });
  };

  const signPayload = async () => {
    const data = await CartsRepository.signAmazonPayPayload
  };

  return (
    <div id="AmazonPayButton"></div>
  );
};

export default AmazonPayButton;
