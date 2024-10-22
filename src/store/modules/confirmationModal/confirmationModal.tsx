import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { RepositoryFactory } from '../../../repositories/RepositoryFactory';
import { AnalyticsHandler } from '../../../analytics/AnalyticsHandler';
import { ConfirmationModals } from '../../../partials/ConfirmationModal/config';

const UsersRepository = RepositoryFactory.get('users');

interface ConfirmationModalState {
  name: string | null;
  progress: number;
  isError: boolean;
}

type Action =
  | { type: 'SET_CONFIRMATION_MODAL'; payload: { name: string | null; progress?: number; isError?: boolean } }
  | { type: 'SET_PROGRESS'; payload: number }
  | { type: 'SET_ERROR' };

const initialState: ConfirmationModalState = { name: null, progress: 0, isError: false };

const confirmationModalReducer = (state: ConfirmationModalState, action: Action): ConfirmationModalState => {
  switch (action.type) {
    case 'SET_CONFIRMATION_MODAL':
      return { ...state, ...action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'SET_ERROR':
      return { ...state, progress: 100, isError: true };
    default:
      return state;
  }
};

const ConfirmationModalContext = createContext<{
  state: ConfirmationModalState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const ConfirmationModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(confirmationModalReducer, initialState);

  return (
    <ConfirmationModalContext.Provider value={{ state, dispatch }}>
      {children}
    </ConfirmationModalContext.Provider>
  );
};

export const useConfirmationModal = () => useContext(ConfirmationModalContext);

// Actions
export const triggerAbandonedCartEmail = async (dispatch: React.Dispatch<Action>, rootState: any) => {
  dispatch({ type: 'SET_CONFIRMATION_MODAL', payload: { name: ConfirmationModals.AbandonedCart } });

  const { cart } = rootState.cart;
  const { user } = rootState;

  if (cart && cart.items.length > 0) {
    try {
      dispatch({ type: 'SET_PROGRESS', payload: 20 });

      await AnalyticsHandler.recordAbanonedCartEvent(user, cart);

      dispatch({ type: 'SET_PROGRESS', payload: 100 });
    } catch {
      dispatch({ type: 'SET_ERROR' });
    }
  } else {
    console.error('No items to export');
  }
};

export const triggerTextAlerts = async (dispatch: React.Dispatch<Action>, rootState: any, phoneNumber: string) => {
  dispatch({ type: 'SET_CONFIRMATION_MODAL', payload: { name: ConfirmationModals.TextAlerts } });

  try {
    const data = await UsersRepository.verifyAndUpdateUserPhoneNumber(rootState.user.id, `${phoneNumber}`);

    // Assuming setUser is a function to update user state
    dispatch(setUser(data));

    dispatch({ type: 'SET_PROGRESS', payload: 100 });
  } catch {
    dispatch({ type: 'SET_ERROR' });
  }
};

export const openConfirmationModal = (dispatch: React.Dispatch<Action>, name: string) => {
  dispatch({ type: 'SET_CONFIRMATION_MODAL', payload: { name } });
};

export const closeConfirmationModal = (dispatch: React.Dispatch<Action>) => {
  dispatch({ type: 'SET_CONFIRMATION_MODAL', payload: { name: null } });
};