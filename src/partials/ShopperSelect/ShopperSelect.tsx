import React, { useState } from 'react';
import GetStarted from './pages/GetStarted';
import SelectShopper from './pages/SelectShopper';
import ConfirmShopper from './pages/ConfirmShopper';
import { ShopperSelectPages } from '../ShopperSelect/config';
import './ShopperSelect.css';

interface MetaData {
    selection?: any;
    assignedShopper?: any;
}

interface PageData {
    currentPage: ShopperSelectPages;
    meta: MetaData | null;
}

const ShopperSelect: React.FC = () => {
    const [pageData, setPageData] = useState<PageData>({
        currentPage: ShopperSelectPages.GetStarted,
        meta: null,
    });

    const getCurrentPageComponent = () => {
        switch (pageData.currentPage) {
            case ShopperSelectPages.GetStarted:
                return (
                    <GetStarted
                        onAutoSelectShopper={handleAutoSelectShopper}
                        onChooseAShopper={handleChooseAShopper}
                        onUseDefaultProfile={handleUseDefaultProfile}
                        onTryAgain={handleTryAgain}
                        onConfirm={handleConfirm}
                        selection={pageData.meta?.selection}
                        assignedShopper={pageData.meta?.assignedShopper}
                    />
                );
            case ShopperSelectPages.SelectShopper:
                return (
                    <SelectShopper
                        onShopperSelected={handleShopperSelected}
                        onUseDefaultProfile={handleUseDefaultProfile}
                        onTryAgain={handleTryAgain}
                        onConfirm={handleConfirm}
                        selection={pageData.meta?.selection}
                        assignedShopper={pageData.meta?.assignedShopper}
                    />
                );
            case ShopperSelectPages.ConfirmShopper:
                return (
                    <ConfirmShopper
                        onConfirm={handleConfirm}
                        onTryAgain={handleTryAgain}
                        selection={pageData.meta?.selection}
                        assignedShopper={pageData.meta?.assignedShopper}
                    />
                );
            default:
                throw new Error('Invalid current page on shopper select modal');
        }
    };

    const handleAutoSelectShopper = (meta: MetaData) => {
        setPageData({ currentPage: ShopperSelectPages.ConfirmShopper, meta });
    };

    const handleChooseAShopper = () => {
        setPageData({ currentPage: ShopperSelectPages.SelectShopper, meta: null });
    };

    const handleUseDefaultProfile = () => {
        // Trigger the profileSwitched event - you can replace this with a suitable callback
        console.log("Profile Switched");
    };

    const handleShopperSelected = (meta: MetaData) => {
        setPageData({ currentPage: ShopperSelectPages.ConfirmShopper, meta });
    };

    const handleTryAgain = () => {
        setPageData({ currentPage: ShopperSelectPages.GetStarted, meta: null });
    };

    const handleConfirm = () => {
        // Trigger the profileSwitched event - you can replace this with a suitable callback
        console.log("Profile Switched");
    };

    return <div>{getCurrentPageComponent()}</div>;
};

export default ShopperSelect;
