import React from "react";
import { useSelector } from "react-redux";
import RootState from "../../store";
import ConfirmationModalLayout from "../ConfirmationModalLayout/ConfirmationModalLayout";
import LoadingFallback from "../../../components/LoadingFallback/LoadingFallback";

const AbandonedCartModal: React.FC = () => {
    const isError = useSelector((state: RootState) => state.confirmationModal.isError);
    const complete = useSelector((state: RootState) => state.confirmationModal.progress === 100);
  
    return (
      <ConfirmationModalLayout>
        {isError ? (
          <>
            <h1 className="heading mb-3">Something went wrong while sending an abandoned shopping cart email.</h1>
            <p className="mb-3">Please try again.</p>
          </>
        ) : (
          <>
            <h1 className="heading mb-3">An abandoned shopping cart email {complete ? 'was sent' : 'is in progress'}.</h1>
            <p className="mb-3">
              {complete ? (
                <>
                  Check the email account provided during account creation. An email from the Retail Demo Store will be in
                  your inbox. The goal of this email is to encourage shoppers to complete the order and will include the
                  products left in the shopping cart.
                </>
              ) : (
                <LoadingFallback />
              )}
            </p>
          </>
        )}
      </ConfirmationModalLayout>
    );
  };
export default AbandonedCartModal;
