import React from "react";
import {Link} from 'react-router-dom';
import { getProductImageUrl } from "../../../../util/getProductImageUrl";

interface SearchItemProps {
    product:{id: string, name: string};
    feature: string;
    experiment?: {correlationId?:string;}
}


const SearchItem: React.FC<SearchItemProps> = ({product, feature, experiment}) => {
    const experimentCorrelationId= experiment?.correlationId;
    const productImageUrl= getProductImageUrl(product);

    return (
        <li className="search-item dropdown-item p-2">
            (product &&(
                <Link className="product-link d-flex align-items-center text-left" to={{pathname: `/product/${product.id}`, search: `?feature=${feature}&exp=${experimentCorrelationId}`}} >
                <img src={productImageUrl} alt={product.name} className="product-image mr-2" />
                <span className="text-truncate">{product.name}</span>
            </Link>
            ))
            
        </li>
    )
}

export default SearchItem;
