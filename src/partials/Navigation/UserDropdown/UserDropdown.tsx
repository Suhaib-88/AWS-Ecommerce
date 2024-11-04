import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, redirect } from 'react-router-dom';
import { RootState } from '../../../store/store'; // Adjust the import based on your store's file location
import { signOut as amplifySignOut } from 'aws-amplify/auth';
import swal from 'sweetalert';
import "./UserDropdown.css"

const UserDropdown: React.FC = () => {
  const user = useSelector((state: RootState) => state.user?.user);
  const dispatch = useDispatch();
  // const history = useHistory();

  // Compute username
  const username = user
    ? user.first_name || user.username
    : null;

  // Compute gender
  const gender = user?.gender === 'M' ? 'Male' : user?.gender === 'F' ? 'Female' : null;

  // Format preferences
  const formattedPreferences = user?.persona
    ? user.persona
        .split('_')
        .map(pref => pref.replace(/\b\w/g, char => char.toUpperCase()))
        .join(', ')
    : null;

  // Handlers
  const switchShopper = () => {
    // Trigger modal or dispatch action to open shopper select modal
    dispatch({ type: 'OPEN_MODAL', payload: { modal: 'ShopperSelect' } });
  };

  const signOut = async () => {
    try {
      await amplifySignOut({ global: true });
      swal('You have been logged out!');
      redirect('/'); // Redirect to homepage after sign out
    } catch (error) {
      swal(String(error));
    }
  };

  return (
    <div>
      {!user ? (
        <Link to="/auth" className="user-dropdown-button login-button btn">
          Sign In
        </Link>
      ) : (
        <>
          <button
            id="navbarDropdown"
            className={`user-dropdown-button btn text-left ${user.persona ? '' : 'username'}`}
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {user.persona ? (
              <>
                <div className="shopper">Shopper:</div>
                <div>
                  <div>
                    {username} - {user.age} years - {gender}
                  </div>
                  <div>{formattedPreferences}</div>
                </div>
              </>
            ) : (
              username
            )}
          </button>
          <div className="dropdown-menu px-3" aria-labelledby="navbarDropdown">
            <button onClick={switchShopper} className="dropdown-item">
              <div className="dropdown-item-title">Switch shoppers</div>
              <div>Select another shopper with different shopping preferences</div>
            </button>
            <div className="dropdown-divider" />
            <Link to="/orders" className="dropdown-item">
              <div className="dropdown-item-title">Orders</div>
              <div>View orders placed by the current shopper profile</div>
            </Link>
            <div className="dropdown-divider" />
            <button onClick={signOut} className="dropdown-item dropdown-item-title">
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDropdown;
