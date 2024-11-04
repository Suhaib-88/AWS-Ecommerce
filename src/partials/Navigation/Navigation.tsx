import React from "react";
import HomeLink from "./HomeLink/HomeLink";
import ShopDropdown from './ShopDropdown/ShopDropdown';
import Search from './Search/Search';
import UserDropdown from './UserDropdown/UserDropdown';
import NavSeparator from './NavSeparator/NavSeparator';
import SupportLink from './SupportLink/SupportLink';
import CartLink from './CartLink/CartLink';

import "./Navigation.css";


const Navigation: React.FC = () => {
    return (
        <nav className="navigation fixed-top pt-2 pb-3 p-lg-1">
          <div className="nav-contents container d-lg-flex align-items-center">
            {/* <h1>Navigation</h1> */}
            <HomeLink className="logo" />
            {/* <ShopDropdown className="shop mx-lg-2" /> */}
            {/* <Search className="search mx-lg-4" /> */}
            <UserDropdown className="user-dropdown" />
            <NavSeparator className="d-none d-lg-block mx-2" />
            <SupportLink className="support" />
            <NavSeparator className="sep-2 mx-2" />
            <CartLink className="cart" />
          </div>
        </nav>
      );
}

export default Navigation;
