import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define the shape of your state
interface User {
  id?: string;
  username?: string;
  identity_id?: string;
  storage?: any;
}

interface State {
  user: User | null;
  provisionalUserID: string;
  sessionEventsRecorded: number;
}

// Define initial state
const initialState: State = {
  user: null,
  provisionalUserID: uuidv4(),
  sessionEventsRecorded: 0,
};

// Define action types
type Action =
  | { type: 'SET_LOGGED_OUT' }
  | { type: 'SET_USER'; payload: User }
  | { type: 'INCREMENT_SESSION_EVENTS_RECORDED' }
  | { type: 'SET_IDENTITY_ID'; payload: string };

// Create a reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LOGGED_OUT':
      return {
        ...state,
        user: null,
        provisionalUserID: uuidv4(),
        sessionEventsRecorded: 0,
      };
    case 'SET_USER':
      const user = action.payload;
      if (user && Object.prototype.hasOwnProperty.call(user, 'storage')) {
        user.storage = null;
      }
      return { ...state, user };
    case 'INCREMENT_SESSION_EVENTS_RECORDED':
      return { ...state, sessionEventsRecorded: state.sessionEventsRecorded + 1 };
    case 'SET_IDENTITY_ID':
      return { ...state, user: { ...state.user, identity_id: action.payload } };
    default:
      return state;
  }
}

// Create context
const StoreContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(undefined);

// Create provider
export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

// Custom hook to use the store
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

// Selectors
export const useUsername = () => {
  const { state } = useStore();
  return state.user?.username ?? 'guest';
};

export const usePersonalizeUserID = () => {
  const { state } = useStore();
  return state.user ? state.user.id : state.provisionalUserID;
};

export const usePersonalizeRecommendationsForVisitor = () => {
  const { state } = useStore();
  return state.user || (state.provisionalUserID && state.sessionEventsRecorded > 2);
};
