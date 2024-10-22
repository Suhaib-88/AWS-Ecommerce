import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip } from 'bootstrap';
import { Hub } from 'aws-amplify';
import { setUser } from '@/store/actions';
import { AnalyticsHandler } from '@/analytics/AnalyticsHandler';
import UsersRepository from '../../../../repositories/usersRepository';

interface ConfirmShopperProps {
  selection?: { ageRange: string; primaryInterest: string };
  assignedShopper: any;
  onTryAgain: () => void;
  onConfirm: () => void;
}

const ConfirmShopper: React.FC<ConfirmShopperProps> = ({ selection, assignedShopper, onTryAgain, onConfirm }) => {
  const isMobile = useSelector((state: any) => state.modal.isMobile);
  const dispatch = useDispatch();
  
  const learnMoreRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const tooltip = new Tooltip(learnMoreRef.current!, { title: "Secondary interests are randomly selected for you." });
    return () => tooltip.dispose();
  }, []);

  const confirmShopper = async () => {
    await UsersRepository.claimUser(assignedShopper.id);
    dispatch(setUser(assignedShopper));
    AnalyticsHandler.identify(assignedShopper);
    Hub.dispatch('user', { event: 'profileChanged', message: '' });
    onConfirm();
  };

  const profile = {
    age: assignedShopper.age,
    gender: assignedShopper.gender === 'M' ? 'Male' : 'Female',
    name: `${assignedShopper.first_name} ${assignedShopper.last_name}`,
    primaryInterest: assignedShopper.primaryInterest,
    secondaryInterests: assignedShopper.secondaryInterests
  };

  return (
    <div className={isMobile ? 'mobile' : ''}>
      <h1 className="confirm-shopper mb-4 text-center">Confirm shopper</h1>
      <div className="flex-container mb-5 d-flex">
        {selection && (
          <div className="your-selections px-4 py-3">
            <h2 className="your-selections-heading mb-4 text-center">Your selections</h2>
            <dl className="selections">
              <dt className="key">Age range:</dt>
              <dd>{selection.ageRange === '70-and-above' ? '70 and above' : selection.ageRange}</dd>
              <dt className="key">Primary interest:</dt>
              <dd>{selection.primaryInterest}</dd>
            </dl>
          </div>
        )}
        <div className="assigned-shopper px-4 py-3">
          <h2 className="assigned-shopper-heading mb-4 text-center">Assigned shopper</h2>
          <div className="mb-3">{profile.name}. {profile.gender}. {profile.age} years</div>
          <dl>
            <div className="mb-2 d-flex flex-wrap">
              <dt className="mr-1">Primary interest:</dt>
              <dd className="mb-0">{profile.primaryInterest}</dd>
            </div>
            <div>
              <div className="d-flex flex-wrap">
                <dt className="mr-1">Secondary interest{profile.secondaryInterests.length > 1 ? 's' : ''}:</dt>
                <dd className="mb-0">{profile.secondaryInterests.join(', ')}</dd>
              </div>
              <div className="text-left">
                <a href="#" ref={learnMoreRef} className="learn-more">Learn more</a>
              </div>
            </div>
          </dl>
        </div>
      </div>
      <div className="button-container d-flex">
        <button className="try-again btn btn-outline-primary" onClick={onTryAgain}>Try again</button>
        <button className="confirm btn btn-primary" onClick={confirmShopper}>Confirm shopper</button>
      </div>
    </div>
  );
};

export default ConfirmShopper;
