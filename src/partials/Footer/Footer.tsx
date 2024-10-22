import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer>
            <div className="justify-content-center d-flex align-items-center">
                <div className="rds">Retail Demo Store</div>
                <div className="separator mx-2" aria-hidden="true"></div>
            </div>
        </footer>
    );
};

export default Footer;
