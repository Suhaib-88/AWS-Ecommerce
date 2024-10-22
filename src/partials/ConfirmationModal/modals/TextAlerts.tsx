import React from "react";
import { useSelector } from "react-redux";
import RootState from "../../store";
import ConfirmationModalLayout from "../ConfirmationModalLayout/ConfirmationModalLayout";



const TextAlertsModal: React.FC = () => {
    const isError= useSelector((state: RootState) => state.confirmationModal.isError);
    return (
        <ConfirmationModalLayout>
            <h1 className="heading mb-3">Text Alerts notification</h1>
            {isError ? (
                <p className="mb-3">
                    Something went wrong while processing your request. Please try again.
            </p>): (<>
            <p className="mb-3">
                We've sent you a text with a link to confirm your phone number.
            </p>
            <p className="mb-3">
                Didn't get a text? <a href="#">Resend text</a>
            </p>
            </>)}

        </ConfirmationModalLayout>
    );
};

export default TextAlertsModal;
