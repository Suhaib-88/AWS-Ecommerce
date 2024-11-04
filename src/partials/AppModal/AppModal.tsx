import React from 'react';
import { useSelector } from 'react-redux';
// import DemoGuide from './DemoGuide/DemoGuide';
// import DemoWalkthrough from './DemoWalkthrough/DemoWalkthrough';
// import ShopperSelectModal from '../AppModal/ShopperSelectModal/ShopperSelectModal';
import { Modals } from './config';
import { RootState } from '../../store/store'; // Adjust this path as necessary
// import './AppModal.css';

const AppModal: React.FC = () => {
    const openModal = useSelector((state: RootState) => state.modal.openModal);

    const getComponent = () => {
        if (!openModal) return console.log('No modal open');
        

        switch (openModal.name) {
            // case Modals.DemoGuide:
            //     return <DemoGuide />;
            // case Modals.DemoWalkthrough:
            //     return <DemoWalkthrough />;
            case Modals.ShopperSelect:
                console.log('ShopperSelectModal');
                // return <ShopperSelectModal />;
            default:
                throw new Error('Invalid modal name');
        }
    };

    const Component = getComponent();

    return <>{Component}</>;
};

export default AppModal;
