import React from "react";
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import LoadingFallback from "../../../components/LoadingFallback/LoadingFallback";





const ShopDropdown: React.FC = () => {

    
    const categories= useSelector((state: RootState) => state.categories.categories);
    const formattedCategories= useSelector((state:RootState) => state.formattedCategories.formattedCategories);

    return (
        <div className="dropdown">
          <button
            className="anchor btn d-flex align-items-center font-weight-bold"
            id="categories-dropdown-anchor"
            aria-label="Categories"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span className="d-none d-lg-inline">Shop <i className="fa fa-chevron-down ml-1"></i></span>
            <i className="fa fa-bars d-inline d-lg-none"></i>
          </button>
          <div className="dropdown-menu" aria-labelledby="categories-dropdown-anchor">
            {!categories ? (
              <div className="text-center">
                <LoadingFallback />
              </div>
            ) : (
              <>
                <Link className="dropdown-item" to="/category/featured">Featured</Link>
                {categories.map((category: { id: string; name: string }, i: number) => (
                  <Link key={category.id} className="dropdown-item" to={`/category/${category.name}`}>
                    {formattedCategories[i]}
                  </Link>
                ))}
                <hr />
                <Link className="dropdown-item" to="/roomgenerator">Room Makeover</Link>
                <hr />
                <Link className="dropdown-item" to="/live">Live Streams</Link>
                <hr />
                <Link className="dropdown-item" to={{ pathname: '/collections' }}>In-Store View</Link>
              </>
            )}
          </div>
        </div>
      );
}

export default ShopDropdown;

