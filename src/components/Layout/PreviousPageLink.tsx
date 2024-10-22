import React from "react";
import { Link } from "react-router-dom";
// import './PreviousPage.css';

export interface PreviousPageLinkProps{
    to:string;
    text:string;
}

const PreviousPage:React.FC<PreviousPageLinkProps>=({to,text})=>{
    return (
        <div className="text-left">
        <Link to={to} className="link">
            <i className="fa fa-chevron-left"></i>{text}
        </Link>
        </div>
    );
}

export default PreviousPage;

