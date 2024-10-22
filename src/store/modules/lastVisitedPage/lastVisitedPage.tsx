import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define the shape of the state
export interface LastVisitedPageState {
  route: string | null;
}

// Define the action types
type Action = { type: 'SET_LAST_VISITED_PAGE'; payload: string };

// Create the initial state
const initialState: LastVisitedPageState = { route: null };

// Create a reducer function
function lastVisitedPageReducer(state: LastVisitedPageState, action: Action): LastVisitedPageState {
  switch (action.type) {
    case 'SET_LAST_VISITED_PAGE':
      return { ...state, route: action.payload };
    default:
      return state;
  }
}

// Create a context
const LastVisitedPageContext = createContext<{
  state: LastVisitedPageState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

// Create a provider component
export const LastVisitedPageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(lastVisitedPageReducer, initialState);

  return (
    <LastVisitedPageContext.Provider value={{ state, dispatch }}>
      {children}
    </LastVisitedPageContext.Provider>
  );
};

// Create a custom hook to use the context
export const useLastVisitedPage = () => {
  const context = useContext(LastVisitedPageContext);
  if (!context) {
    throw new Error('useLastVisitedPage must be used within a LastVisitedPageProvider');
  }
  return context;
};