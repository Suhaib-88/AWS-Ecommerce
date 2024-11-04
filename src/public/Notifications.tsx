import React, { useEffect, useState } from 'react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import swal from 'sweetalert';
import { RepositoryFactory } from '../repositories/RepositoryFactory';
import { signUrl } from "../util/signer";
import AmplifyStore from '../store/store';

const RecommendationsRepository = RepositoryFactory.get('recommendations');
const ProductsRepository = RepositoryFactory.get('products');

const Notifications: React.FC = () => {
  const [connection, setConnection] = useState<WebSocket | null>(null);
  const [cognitoUser, setCognitoUser] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await getCurrentUser();
        setCognitoUser(user.username);
        await openWebsocketConnection();
      } catch (error) {
        console.error("Error fetching Cognito user:", error);
        setCognitoUser(null);
      }
    };
    init();

    // Cleanup WebSocket connection on component unmount
    return () => {
      if (connection) {
        console.log("Closing WebSocket connection");
        connection.close();
      }
    };
  }, []);

  const openWebsocketConnection = async () => {
    if (!notificationsEnabled) {
      return;
    }

    const { credentials } = await fetchAuthSession();
    const wssUrl = `${import.meta.env.VITE_LOCATION_NOTIFICATION_URL}?userId=${cognitoUser}`;
    const options = {
      credentials,
      signingRegion: import.meta.env.VITE_AWS_REGION,
      signingService: 'execute-api'
    };
    const signedUrl = await signUrl(wssUrl, options);

    const newConnection = new WebSocket(signedUrl);
    setConnection(newConnection);

    newConnection.onopen = () => {
      console.log("WebSocket connection open for notifications.");
    };

    newConnection.onmessage = async (e) => {
      console.log("Received notification message:", e.data);
      const messageData = JSON.parse(e.data);

      if (isInstoreView()) {
        if (messageData.EventType === "COLLECTION") {
          handleCollectionEvent(messageData);
        }
      } else if (!isLocationView) {
        if (messageData.EventType === "PURCHASE") {
          await handlePurchaseEvent();
        } else if (messageData.EventType === "COLLECTION") {
          await handleCollectionNotification(messageData);
        }
      }
    };

    newConnection.onclose = () => {
      console.log("WebSocket connection closed. Attempting to reconnect...");
      setTimeout(openWebsocketConnection, 5000); // Attempt reconnect after 5 seconds
    };
  };

  const handleCollectionEvent = (messageData: any) => {
    const customerName = `${messageData.Orders[0].billing_address.first_name} ${messageData.Orders[0].billing_address.last_name}`;
    let orderDetail;
    const orders = messageData.Orders;
    if (orders.length > 1) {
      const orderIds = orders.map((order: { id: any; }) => `#${order.id}`);
      orderDetail = `orders ${orderIds.join(', ')}`;
    } else {
      orderDetail = `order #${orders[0].id}`;
    }
    const pickupTime = new Date();
    pickupTime.setMinutes(pickupTime.getMinutes() + 20);
    const formattedPickupTime = pickupTime.toLocaleString('en-US');
    swal({
      title: 'New Collection',
      text: `${customerName} will be at level 3 at ${formattedPickupTime} to collect ${orderDetail}`
    });
  };

  const handlePurchaseEvent = async () => {
    const offerRecommendation = await RecommendationsRepository.getCouponOffer(user.id);
    const offer = offerRecommendation.offer;

    const offerDiv = document.createElement("div");
    offerDiv.innerHTML = `
      <div class='row'>
        <div class='col'>
          <b>${offer.codes[0]}:</b> ${offer.description}
        </div>
      </div>`;
    swal({
      title: 'Store nearby',
      text: `We noticed that you are close to your Local AWS Retail Demo Store. Pop into our store near you, check our newest collection, and use the code: ${offer.codes[0]} for any purchase and get ${offer.description}.`,
      content: offerDiv
    });
  };

  const handleCollectionNotification = async (messageData: any) => {
    const orders = messageData.Orders;
    const orderListDiv = document.createElement("div");

    const ordersHtml = await Promise.all(orders.slice(0, 3).map(async (order: any) => {
      const productHtml = await Promise.all(order.items.slice(0, 3).map(async (product: any) => {
        const data = await ProductsRepository.getProduct(product.product_id);
        const productImageUrl = getProductImageURL(data);
        return `<div class="col-4"><img src="${productImageUrl}" style="width: 100%"><small>${data.name}</small></div>`;
      }));

      return `<div>Order #${order.id}</div><div class="row">${productHtml.join('')}</div>`;
    }));

    orderListDiv.innerHTML = ordersHtml.join('');
    swal({
      title: 'Collection available',
      text: `Welcome! We are waiting for you at Level 3, Door 2 of your Local Retail Demo Store, and Steve from our team will be greeting you with your following order(s):`,
      content: orderListDiv
    });
  };

  const getProductImageURL = (product: any) => {
    if (product.image.includes('://')) {
      return product.image;
    } else {
      const root_url = import.meta.env.VITE_IMAGE_ROOT_URL;
      return `${root_url}${product.category}/${product.image}`;
    }
  };

  const isInstoreView = () => {
    return window.location.pathname.toLowerCase() === '/collections';
  };

  const isLocationView = () => {
    return window.location.pathname.toLowerCase() === '/location';
  };

  const user = AmplifyStore.getState().user;

  const notificationsEnabled = () => {
    const enabled = import.meta.env.VITE_LOCATION_NOTIFICATION_URL && import.meta.env.VITE_LOCATION_NOTIFICATION_URL !== 'NotDeployed';
    if (enabled) {
      console.log('WebSocket notifications are enabled');
    }
    return enabled;
  };

  return (
    <div>
      {/* Any additional UI can go here */}
    </div>
  );
};

export default Notifications;
