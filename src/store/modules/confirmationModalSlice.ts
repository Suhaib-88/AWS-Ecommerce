import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConfirmationModalState {
  confirmed: boolean;
  name:string;
}

const initialState: ConfirmationModalState = {
  confirmed: false,
  name:  '',

};

const confirmationModalSlice = createSlice({
  name: 'confirmationModal',
  initialState,
  reducers: {
    setConfirmation(state, action: PayloadAction<any>) {
      state.confirmed = action.payload;
      state.name= action.payload
    },
  },
});

export const { setConfirmation } = confirmationModalSlice.actions;
export default confirmationModalSlice.reducer;
