import React from "react";
import {Link} from 'react-router-dom';


const HomeLink: React.FC = () => {
    return <Link to="/" aria-label="Home">
        <img src="./vite.svg" alt="Home" />
        </Link>
}

export default HomeLink;

