import { createSlice } from '@reduxjs/toolkit';

interface WelcomePageVisitedState {
  visited: boolean;
}

const initialState: WelcomePageVisitedState = {
  visited: false,
};

const welcomePageVisitedSlice = createSlice({
  name: 'welcomePageVisited',
  initialState,
  reducers: {
    setVisitedWelcomePage(state) {
      state.visited = true;
    },
  },
});

export const { setVisitedWelcomePage } = welcomePageVisitedSlice.actions;
export default welcomePageVisitedSlice.reducer;
