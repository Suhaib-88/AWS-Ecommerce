import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface UserState {
  user: any | null; // Adjust 'any' as needed
  provisionalUserID: string;
  sessionEventsRecorded: number;
}

const initialState: UserState = {
  user: null,
  provisionalUserID: uuidv4(),
  sessionEventsRecorded: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoggedOut(state) {
      state.user = null;
      state.provisionalUserID = uuidv4();
      state.sessionEventsRecorded = 0;
    },
    setUser(state, action: PayloadAction<any>) {
      state.user = { ...action.payload, storage: null };
    },
    incrementSessionEventsRecorded(state) {
      state.sessionEventsRecorded += 1;
    },
    setIdentityId(state, action: PayloadAction<string>) {
      if (state.user) {
        state.user.identity_id = action.payload;
      }
    },
  },
});

export const { setLoggedOut, setUser, incrementSessionEventsRecorded, setIdentityId } = userSlice.actions;
export default userSlice.reducer;
