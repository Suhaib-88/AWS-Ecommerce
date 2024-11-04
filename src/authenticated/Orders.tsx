import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import RootState from "../store/store";
import Order from "../";
import OrdersRepository from "../repositories/ordersRepository";
import Layout from "../components/Layout/Layout";

const Orders: React.FC = () => {
    const user= useSelector((state: RootState) => state.user);
    const [orders, setOrders] = useState<Order[]| null>(null);

    useEffect(() => {
        getOrders();
    }, [user]);

    const getOrders = async () => {
        setOrders(null);
        const fetchOrders= await OrdersRepository.getOrdersByUsername(user.username);
        setOrders(fetchOrders);
    };

    return (
        <Layout>
            <div className="content">
                <div className="container-fluid">
                    {!orders && <i className="fa fa-spinner fa-spin" />}

                </div>
                <div className="container">
                    <h1>Orders</h1>
                    {orders && orders.length>0?(
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th># Items</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.username}</td>
                                        <td>{order.items.map((item: any) => (
                                            <div key={item.product_id}>Product:{item.product_id}: {item.quantity}@ ${item.price}</div>
                                        ))}</td>
                                        <td>{order.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ):(
                        <div className="alert alert-warning">You currently have no orders!</div>
                    )}   

                </div>
            </div>
        </Layout>
    );
};

export default Orders;