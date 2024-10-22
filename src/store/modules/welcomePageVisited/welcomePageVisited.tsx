import React, { createContext, useReducer, useContext, ReactNode } from 'react';

// Define the shape of the state
interface State {
  visited: boolean;
}

// Define the shape of the action
type Action = { type: 'SET_VISITED_WELCOME_PAGE'; payload: boolean };

// Initial state
const initialState: State = { visited: false };

// Reducer function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_VISITED_WELCOME_PAGE':
      return { ...state, visited: action.payload };
    default:
      return state;
  }
}

// Create context
const WelcomePageVisitedContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Context provider component
export const WelcomePageVisitedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <WelcomePageVisitedContext.Provider value={{ state, dispatch }}>
      {children}
    </WelcomePageVisitedContext.Provider>
  );
};

// Custom hook to use the WelcomePageVisited context
export const useWelcomePageVisited = () => useContext(WelcomePageVisitedContext);