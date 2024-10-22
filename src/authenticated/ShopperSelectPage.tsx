import React from "react";
// import SecondaryLayout from "../components/SecondaryLayout/SecondaryLayout";
import ShopperSelect from "../partials/AppModal/ShopperSelectModal/ShopperSelectModal";
import { useNavigate } from "react-router-dom";

const ShopperSelectPage: React.FC = () => {
    const navigate = useNavigate();
    const onProfileSwitch = () => {
        navigate(`/`);
    };

    return (
        <div className="container">
            <ShopperSelect profileSwitched={onProfileSwitch} />
        </div>
        
    );
};

export default ShopperSelectPage;