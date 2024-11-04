import React from "react";
import { useSelector } from "react-redux";
import ShopperSelect from "../../ShopperSelect/ShopperSelect";

import { APP_MODAL_ID } from "../config";
import RootState from "../../../store/store";
import $ from "jquery";
import Modal from '../Modal/Modal';
const ShopperSelectModal: React.FC = () => {
    const isMobile = useSelector((state: RootState) => state.modal.isMobile);
  
    const onProfileSwitch = () => {
    };
  
    return (
      <Modal>
        <>{({ bodyClass }: { bodyClass: string }) => (
          <ShopperSelect
            className={`shopper-select-page ${bodyClass} ${isMobile ? 'shopper-select-page--mobile' : ''}`}
            profileSwitched={onProfileSwitch}
          />
        )}</>
      </Modal>
    );
  };

export default ShopperSelectModal;
