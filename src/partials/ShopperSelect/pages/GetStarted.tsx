import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip } from 'bootstrap';
import { setUser } from '@/store/actions';
import { AnalyticsHandler } from '@/analytics/AnalyticsHandler';
import { Hub } from 'aws-amplify';
import UsersRepository from '../../../../repositories/usersRepository';

interface GettingStartedProps {
  onChooseShopper: () => void;
  onAutoSelectShopper: (data: { assignedShopper: any }) => void;
  onUseDefaultProfile: () => void;
}

const GettingStarted: React.FC<GettingStartedProps> = ({ onChooseShopper, onAutoSelectShopper, onUseDefaultProfile }) => {
  const isMobile = useSelector((state: any) => state.modal.isMobile);
  const dispatch = useDispatch();
  
  const autoSelectShopperRef = useRef<HTMLButtonElement>(null);
  const chooseAShopperRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const tooltip1 = new Tooltip(autoSelectShopperRef.current!, { title: "Randomly select a shopper from the dataset" });
    const tooltip2 = new Tooltip(chooseAShopperRef.current!, { title: "Select a shopper based on demographics" });

    return () => {
      tooltip1.dispose();
      tooltip2.dispose();
    };
  }, []);

  const autoSelectShopper = async () => {
    const data = await UsersRepository.getRandomUser();
    onAutoSelectShopper({ assignedShopper: data[0] });
  };

  const useDefaultProfile = async () => {
    const cognitoUser = await Hub.Auth.currentAuthenticatedUser();
    const user = await UsersRepository.getUserByUsername(cognitoUser.username);
    dispatch(setUser(user));
    AnalyticsHandler.identify(user);
    Hub.dispatch('user', { event: 'profileChanged', message: '' });
    onUseDefaultProfile();
  };

  return (
    <div className={`get-started-container ${isMobile ? 'mobile' : ''}`}>
      <h1 className="heading mb-4 text-center">Select A Shopper</h1>
      <div className="explanation mb-5">
        <p>The dataset used to power the Retail Demo Store has thousands of shoppers, each with different age, gender, shopping interests, and browsing history.</p>
        <p>Select a fictitious shopper by using one of the options below.</p>
      </div>
      <div className="button-container mb-5 d-flex justify-content-center">
        <button type="button" className="auto-select btn btn-lg btn-outline-primary" onClick={autoSelectShopper} ref={autoSelectShopperRef}>
          Auto select shopper
        </button>
        <button type="button" className="choose-shopper btn btn-lg btn-primary" onClick={onChooseShopper} ref={chooseAShopperRef}>
          Choose a shopper
        </button>
      </div>
      <hr className="mb-5" />
      <div>
        <p>Alternatively, you can use your <a href="#" onClick={useDefaultProfile} className="default-profile">default profile</a> to go through the cold user path.</p>
      </div>
    </div>
  );
};

export default GettingStarted;
