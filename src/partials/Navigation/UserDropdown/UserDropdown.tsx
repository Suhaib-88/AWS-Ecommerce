// UserDropdown.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'aws-amplify/auth';
import swal from 'sweetalert';
import { openModal } from '../../../store/modules/modal/modal'; // Adjust the import according to your project structure
import { Modals } from '../../AppModal/config';
import { Link } from 'react-router-dom';

const UserDropdown: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user); // Adjust the state type according to your store

  const username = user?.first_name || user?.username;
  const gender = user?.gender === 'M' ? 'Male' : user?.gender === 'F' ? 'Female' : null;
 
  const formattedPreferences = user?.persona
    ? user.persona
        .split('_')
        .map((pref: string) =>
          pref
            .split(' ')
            .map((word: string) => [word[0].toUpperCase(), ...word.slice(1)].join(''))
            .join(' ')
        )
        .join(', ')
    : null;

  const switchShopper = () => {
    dispatch(openModal(Modals.ShopperSelect));
  };

  const handleSignOut = async () => {
    try {
      await signOut({ global: true });
      swal('You have been logged out!');
    } catch (error:any) {
      swal(error.message || 'An error occurred during sign out.');
    }
  };

  return (
    <div>
      {!user ? (
        <Link to="/auth" className="user-dropdown-button login-button btn">Sign In</Link>
      ) : (
        <>
          <button
            id="navbarDropdown"
            className={`user-dropdown-button btn text-left text-lg-right ${!user.persona ? 'username' : ''}`}
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {user.persona ? (
              <>
                <div className="shopper">Shopper:</div>
                <div>
                  <div>{username} - {user.age} years - {gender}</div>
                  <div>{formattedPreferences}</div>
                </div>
              </>
            ) : (
              <>{username}</>
            )}
          </button>

          <div className="dropdown-menu px-3" aria-labelledby="navbarDropdown">
            <a href="#" onClick={switchShopper} className="dropdown-item">
              <div className="dropdown-item-title">Switch shoppers</div>
              <div>Select another shopper with different shopping preferences</div>
            </a>

            <div className="dropdown-divider"></div>

            <Link to="/orders" className="dropdown-item">
              <div className="dropdown-item-title">Orders</div>
              <div>View orders placed by the current shopper profile</div>
            </Link>

            <div className="dropdown-divider"></div>

            <button className="dropdown-item dropdown-item-title" onClick={handleSignOut}>Sign Out</button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDropdown;
