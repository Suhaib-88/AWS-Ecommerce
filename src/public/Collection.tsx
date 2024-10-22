import React, { useEffect, useState } from 'react';
import { OrdersRepository } from '../repositories/ordersRepository';
import LocationDemoNavigation from '@/public/LocationDemoNavigation';
import Layout from '../components/Layout/Layout';

interface Order {
  id: number;
  billing_address: {
    first_name: string;
    last_name: string;
  };
  delivery_type: string;
  delivery_status: string;
}

const Collections: React.FC = () => {
  const [ordersLoaded, setOrdersLoaded] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const allOrders = await OrdersRepository.get();
      console.log("All your orders:");
      console.log(allOrders);
      const filteredOrders = allOrders.filter(
        (order: Order) => order.delivery_type === "COLLECTION" && order.delivery_status !== "COMPLETE"
      );
      setOrders(filteredOrders);
      setOrdersLoaded(true);
    };

    fetchOrders();
  }, []);

  const completeCollection = async (order: Order) => {
    order.delivery_status = 'COMPLETE';
    await OrdersRepository.updateOrder(order);
    const allOrders = await OrdersRepository.get();
    const filteredOrders = allOrders.filter(
      (order: Order) => order.delivery_type === "COLLECTION" && order.delivery_status !== "COMPLETE"
    );
    setOrders(filteredOrders);
  };

  return (
    <Layout>
      <div>
        <LocationDemoNavigation />
        <div className="container">
          <div className="row">
            <div className="col">
              <h4>Collections</h4>
              <p>A simple store-side view of upcoming collections.</p>
            </div>
          </div>
          {ordersLoaded && (!orders || orders.length === 0) && (
            <div className="alert alert-secondary" role="alert">
              No orders awaiting collection.
            </div>
          )}
          {orders && orders.map(order => (
            <div key={order.id}>
              <div className="row">
                <div className="col text-left">
                  <h4 className="m-0">
                    {order.billing_address.first_name} {order.billing_address.last_name} - #{order.id}
                  </h4>
                </div>
                <div className="col text-right">
                  <button type="button" className="btn btn-primary" onClick={() => completeCollection(order)}>
                    Collection complete
                  </button>
                </div>
              </div>
              <hr className="mt-2 mb-4" />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Collections;
