import React,{useState, useEffect} from "react";
import Layout from "../components/Layout/Layout";



import { RepositoryFactory } from "../repositories/RepositoryFactory";

const ProductsRepository = RepositoryFactory.get('products');
const UsersRepository = RepositoryFactory.get('users');
const OrdersRepository = RepositoryFactory.get('orders');
const CartsRepository = RepositoryFactory.get('carts');

const Admin: React.FC = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [carts, setCarts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, productsData, categoriesData, ordersData, cartsData] = await Promise.all([
          UsersRepository.get(0, 300),
          ProductsRepository.get(),
          ProductsRepository.getCategories(),
          OrdersRepository.get(),
          CartsRepository.get()
        ]);

        setUsers(usersData);
        setProducts(productsData);
        setCategories(categoriesData.data); // Assuming categoriesData contains the expected structure
        setOrders(ordersData);
        setCarts(cartsData.data); // Assuming cartsData contains the expected structure
      } catch (error) {
        setErrors((prevErrors) => [...prevErrors, 'Failed to load data.']);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="content">
        <div className="container text-left">
          <h1>Admin</h1>

          <div className="row">
            <h5>Users</h5>
            {errors.length > 0 && <div className="alert alert-danger">{errors.join(', ')}</div>}
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row">
            <h5>Products</h5>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.description}</td>
                    <td>{product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row">
            <h5>Categories</h5>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row">
            <h2>Orders</h2>
            <p>{JSON.stringify(orders)}</p>
          </div>

          <div className="row">
            <h2>Carts</h2>
            <p>{JSON.stringify(carts)}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
