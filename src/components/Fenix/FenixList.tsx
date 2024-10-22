// ecommerce-ui/src/components/Fenix/FenixList.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export interface FenixListProps {
  currentvariant: object | number | string;
  fenix_tenantid: string;
  fenix_ipinofokey: string;
  fenix_endpoint_url: string;
}

const FenixList: React.FC<FenixListProps> = ({
  currentvariant,
}) => {
  const [fenixData, setFenixData] = useState<any[]>([]);
  const [fenixResponse, setFenixResponse] = useState<string>('');
  const [showAllOptions, setShowAllOptions] = useState<boolean>(false);
  const [fenixDataReceived, setFenixDataReceived] = useState<boolean>(false);
  const [changeZipDiv, setChangeZipDiv] = useState<boolean>(false);
  const [invalidZip, setInvalidZip] = useState<boolean>(false);
  const [invalidZipMSG, setInvalidZipMSG] = useState<string>('');
  const [requestData, setRequestData] = useState({
    sessionTrackId: Cookies.get('fenixSSID') || sesstiontrack(),
    fenixSSID: Cookies.get('fenixSSID') || sesstiontrack(),
    buyerZipCode: Cookies.get('fenixlocation') || '',
    monetaryValue: '',
    pageType: 'PDP',
    responseFormat: 'json',
    skus: [
      {
        sku: currentvariant,
        product_id: currentvariant,
        quantity: 1,
        skuInventories: [
          {
            locationId: 'manual',
            quantity: '1',
          },
        ],
      },
    ],
  });

  function sesstiontrack() {
    const currentdate = new Date().getTime();
    const randomnumber = Math.floor(Math.random() * 99999);
    const fenixsessionid = btoa(`${currentdate}-${window.location.hostname}-${randomnumber}`);
    let sessionid = fenixsessionid;
    if (!Cookies.get('fenixSSID')) {
      Cookies.set('fenixSSID', fenixsessionid, { expires: 14 });
    }
    return sessionid;
  }

  useEffect(() => {
    if (!requestData.buyerZipCode) {
      getlocation();
    } else {
      getEstimates();
    }
  }, []);

  const getlocation = () => {
    axios.get(import.meta.env.VITE_FENIX_ZIP_DETECT_URL)
      .then((data: { data: any; }) => {
        if (data.data.postal) {
          Cookies.set('fenixlocation', data.data.postal, { expires: 14 });
          setRequestData((prev) => ({ ...prev, buyerZipCode: data.data.postal }));
          getEstimates();
        }
      });
  };

  const checkZip = (value: string) => {
    return value && value.length > 4;
  };

  const showhideviewall = () => {
    setShowAllOptions(!showAllOptions);
  };

  const changezip = () => {
    setChangeZipDiv(true);
  };

  const updatezip = () => {
    if (requestData.buyerZipCode && checkZip(requestData.buyerZipCode)) {
      Cookies.set('fenixlocation', requestData.buyerZipCode, { expires: 14 });
      getEstimates();
    } else {
      setFenixDataReceived(true);
      setInvalidZip(true);
      setInvalidZipMSG('Invalid zipcode');
    }
  };

  const getEstimates = () => {
    const headers = {
      tenantId: import.meta.env.VITE_FENIX_TENANT_ID,
      'x-api-key': import.meta.env.VITE_FENIX_X_API_KEY,
      'Content-Type': 'application/json',
    };

    axios.post(import.meta.env.VITE_FENIX_EDD_ENDPOINT, requestData, { headers })
      .then((response: { data: any; }) => {
        setFenixDataReceived(true);
        setFenixData(response.data);
        setInvalidZip(false);
        setChangeZipDiv(false);
        if (response.data[0]?.response) {
          setFenixResponse(response.data[0].response);
        }
      })
      .catch((error: { response: any; }) => {
        errorhandlers(error.response);
      });
  };

  const errorhandlers = (error: any) => {
    setFenixDataReceived(true);
    if (error.data.error_code === '400') {
      setInvalidZip(true);
      setInvalidZipMSG('Please enter a valid US zipcode');
    } else if (error.data.error_code === '600') {
      setFenixDataReceived(false);
    }
  };

  return (
    <div className="fenix-product-delivery-estimates">
      {fenixDataReceived && (
        <span className="fenix-truck">
          <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* SVG path here */}
          </svg>
          <span dangerouslySetInnerHTML={{ __html: fenixResponse }} />
        </span>
      )}
      <div id="fenix-change-zip">
        <div className="shipping-options-container">
          Ship to: <span id="zipcode-holder"><strong>{requestData.buyerZipCode}</strong></span>
          <a id="fenix-toggle-zip" className="update-zip" href="#" onClick={changezip}> (Change) </a>
          {fenixData.length > 2 && (
            <a href="#" id="view-all-shipping" onClick={showhideviewall} className="view-all-shipping">View All Shipping Options</a>
          )}
          {showAllOptions && (
            <div className="fenix-provided-options popup">
              <div className="popuptext" id="fenix-provided-options-id">
                <h2 className="shipping-options-title">
                  Shipping Options
                  <div className="text-right fenix_close_viewall" onClick={showhideviewall}><a href="#" className="crossmark"></a></div>
                </h2>
                <table>
                  <thead>
                    <tr>
                      <th>Options</th>
                      <th>Est. Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fenixData.map((fenix, index) => (
                      <tr key={index}>
                        <td dangerouslySetInnerHTML={{ __html: fenix.shippingMethodDesc }} />
                        <td dangerouslySetInnerHTML={{ __html: fenix.formattedDeliveryDate }} />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        {changeZipDiv && (
          <div id="fenix-zip" className="fenix-zip-div">
            <input type="text" id="zip-inpt" value={requestData.buyerZipCode} onChange={(e) => setRequestData({ ...requestData, buyerZipCode: e.target.value })} />
            <button type="button" id="check-zip" onClick={updatezip}>Check Delivery</button>
          </div>
        )}
        {invalidZip && <div className="zip-input-error">{invalidZipMSG}</div>}
      </div>
    </div>
  );
};

export default FenixList;
