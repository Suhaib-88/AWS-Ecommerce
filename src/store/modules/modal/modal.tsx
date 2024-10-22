import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { sections } from '../../../partials/AppModal/DemoGuide/config';
import { isMobileModalMediaQueryList, APP_MODAL_ID, Modals } from '../../../partials/AppModal/config';

// Define types for state and actions
interface ModalState {
  isMobile: boolean;
  openModal: { name: Modals; selectedArticle?: string; pageIndex?: number } | null;
}

type ModalAction =
  | { type: 'SET_IS_MOBILE'; payload: boolean }
  | { type: 'SET_OPEN_MODAL'; payload: ModalState['openModal'] }
  | { type: 'SET_SELECTED_ARTICLE'; payload: string | null };

// Initial state
const initialState: ModalState = {
  isMobile: isMobileModalMediaQueryList.matches,
  openModal: null,
};

// Reducer function
function modalReducer(state: ModalState, action: ModalAction): ModalState {
  switch (action.type) {
    case 'SET_IS_MOBILE':
      return { ...state, isMobile: action.payload };
    case 'SET_OPEN_MODAL':
      return { ...state, openModal: action.payload };
    case 'SET_SELECTED_ARTICLE':
      if (state.openModal?.name === Modals.DemoGuide) {
        return {
          ...state,
          openModal: { ...state.openModal, selectedArticle: action.payload },
        };
      }
      return state;
    default:
      throw new Error('Invalid action type');
  }
}

// Create context
const ModalContext = createContext<{
  state: ModalState;
  dispatch: React.Dispatch<ModalAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

// Provider component
export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  return (
    <ModalContext.Provider value={{ state, dispatch }}>
      {children}
    </ModalContext.Provider>
  );
};

// Custom hook to use the modal context
export const useModal = () => useContext(ModalContext);

// Function to manage responsive modal state
export const manageResponsiveModalState = (dispatch: React.Dispatch<ModalAction>) => {
  isMobileModalMediaQueryList.addEventListener('change', () => {
    // select first demo guide article if we are in desktop mode, demo guide is open, and no article is selected
    if (
      !isMobileModalMediaQueryList.matches &&
      state.openModal?.name === Modals.DemoGuide &&
      !state.openModal.selectedArticle
    ) {
      dispatch({ type: 'SET_SELECTED_ARTICLE', payload: sections[0].articles[0] });
    }

    dispatch({ type: 'SET_IS_MOBILE', payload: !state.isMobile });
  });
};