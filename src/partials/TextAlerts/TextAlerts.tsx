import React, { useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import {triggerTextAlert} from "../../redux/actions/textAlertActions";
import DemoGuideBadge from "../../components/DemoGuideBadge/DemoGuideBadge";
import { Articles } from "../AppModal/DemoGuide/config";


const TextAlerts:React.FC=()=>{
    const dispatch=useDispatch();
    const user= useSelector((state:any)=>state.user);

    const [phoneNumber,setPhoneNumber]=useState("");
    const [hasConsented,setHasConsented]=useState(false);
    const isPinpointEnabled=import.meta.env.VITE_PINPOINT_APP_ID;

    const onSubmit=(event:React.FormEvent<HTMLFormElement>)=>{

        event.preventDefault();

        if (phoneNumber && hasConsented){
        dispatch(triggerTextAlert(phoneNumber));
        setPhoneNumber("");
        setHasConsented(false);
        }
    }
    return (
        <>
          {isPinpointEnabled && user && (
            <section className="section container p-4">
              <h1 className="heading mb-1">Join <span className="text-alerts">text alerts</span> and get 20% off</h1>
              <p className="mb-3">
                Enter your mobile number to receive texts about the Retail Demo Store, including Amazon Pinpoint.
              </p>
              <form onSubmit={onSubmit} className="mb-2 form">
                <div className="mb-2 d-flex justify-content-center align-items-stretch">
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input py-1 px-2"
                    placeholder="+# (###) ### - ####" // Placeholder for guidance on input format
                  />
                  <button type="submit" className="submit btn" disabled={!hasConsented}>
                    Submit
                  </button>
                </div>
    
                <div className="consent d-flex align-items-start text-left">
                  <input
                    type="checkbox"
                    className="consent-checkbox mr-2"
                    id="text-alerts-consent"
                    checked={hasConsented}
                    onChange={() => setHasConsented(!hasConsented)}
                  />
                  <label htmlFor="text-alerts-consent">
                    I consent to receive automated text messages (including marketing messages) from or on behalf of Amazon Web
                    Services about the Retail Demo Store, including Amazon Pinpoint, at my mobile number above. Consent is not a
                    condition of any purchase. Message and data rates may apply. Amazon Web Services will only use data entered
                    for demonstrating features within the Retail Demo Store.
                  </label>
                </div>
    
                <DemoGuideBadge article={Articles.SMS_MESSAGING} className="demo-guide-badge px-0 d-flex" />
              </form>
            </section>
          )}
        </>
      );
}

export default TextAlerts;

