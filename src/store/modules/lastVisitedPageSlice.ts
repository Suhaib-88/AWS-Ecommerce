import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LastVisitedPageState {
  page: any | null;
}

const initialState: LastVisitedPageState = {
  page: null,
};

const lastVisitedPageSlice = createSlice({
  name: 'lastVisitedPage',
  initialState,
  reducers: {
    setLastVisitedPage(state, action: PayloadAction<any | null>) {
      state.page = action.payload;
    },
  },
});

export const { setLastVisitedPage } = lastVisitedPageSlice.actions;
export default lastVisitedPageSlice.reducer;
