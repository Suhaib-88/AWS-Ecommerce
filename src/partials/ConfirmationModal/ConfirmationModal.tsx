import React from 'react';
import { ConfirmationModals } from './config';
import RootState from "../../store";
import AbandonedCartModal from './modals/AbandonedCart';
import TextAlertsModal from './modals/TextAlerts';
import { useSelector } from 'react-redux';


const ConfirmationModal: React.FC = () => {
    const name = useSelector((state: RootState) => state.confirmationModal.name);
  
    const renderComponent = () => {
      switch (name) {
        case ConfirmationModals.AbandonedCart:
          return <AbandonedCartModal />;
        case ConfirmationModals.TextAlerts:
          return <TextAlertsModal />;
        default:
          return null;
      }
    };
  
    return <>{renderComponent()}</>;
  };

  export default ConfirmationModal;

