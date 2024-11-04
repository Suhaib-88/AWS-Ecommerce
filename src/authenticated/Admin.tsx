import React,{useState, useEffect} from "react";
import Layout from "../components/Layout/Layout";



import { RepositoryFactory } from "../repositories/RepositoryFactory";


interface User {
  id: number;
  username: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
}

interface Category {
  id: number;
  name: string;
}

const ProductsRepository = RepositoryFactory.get('products');
const UsersRepository = RepositoryFactory.get('users');
const OrdersRepository = RepositoryFactory.get('orders');
const CartsRepository = RepositoryFactory.get('carts');

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [carts, setCarts] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);


  async function fetchProducts(){
    try{
  const fetchedProducts = await ProductsRepository.get();
  console.log(fetchedProducts)
    }
    catch(error){
      console.error('API fetch Error', error)
    }
  }





  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedUsers = await UsersRepository.get(0, 300);
        setUsers(fetchedUsers);

        const fetchedProducts = await ProductsRepository.get();
        console.log(fetchedProducts)
        setProducts(fetchedProducts);

        const fetchedCategories = await ProductsRepository.getCategories();
        setCategories(fetchedCategories.data);

        const fetchedOrders = await OrdersRepository.get();
        setOrders(fetchedOrders);

        const fetchedCarts = await CartsRepository.get();
        setCarts(fetchedCarts.data);
      } catch (error) {
        setErrors(prevErrors => [...prevErrors, error.message]);
      }
    }

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="content">
        <div className="container text-left">
          <h1>Admin</h1>

          <div className="row">
            <h5>Users</h5>
            <table className="table">
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

          <div className="row">
            <button onClick={fetchProducts}>click</button>

          </div>
        </div>
      </div>
    </Layout>
  );
};


export default Admin;
