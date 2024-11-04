import { ProductsRepository } from "./productsRepository";
import SearchRepository from "./searchRepository";
// import RecommendationsRepository from "./recommendationsRepository";
import CartsRepository from "./cartsRepository";
import UserRepository from "./usersRepository";
import OrdersRepository from "./ordersRepository";


type RepositoryNames = 
    | 'products' 
    | 'users' 
    | 'carts' 
    | 'orders' 
    | 'recommendations' 
    | 'search' 
    | 'videos' 
    | 'location' 
    | 'rooms';

type RepositoryType= {
    [key: string]: any;
}

const repositories: RepositoryType= {
    products: ProductsRepository,
    search: SearchRepository,
    // recommendations: RecommendationsRepository,
    cart: CartsRepository,
    user: UserRepository,
    orders: OrdersRepository
}


export const RepositoryFactory= {
    get: (name: RepositoryNames) => repositories[name]
}


