import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

// Import slices (equivalent to Vuex modules)
import welcomePageVisitedSlice from './modules/welcomePageVisitedSlice';
import categoriesSlice from './modules/categoriesSlice';
import cartSlice from './modules/cartSlice';
import modalSlice from './modules/modalSlice';
// import demoWalkthroughShownSlice from './modules/demoWalkthroughShownSlice';
import lastVisitedPageSlice from './modules/lastVisitedPageSlice';
import confirmationModalSlice from './modules/confirmationModalSlice';

// Define types for the state
interface User {
  id?: string;
  username?: string;
  email?:string;
  identity_id?: string;
  storage?: any;
  
}

interface UserState {
  user: User | null;
  provisionalUserID: string;
  sessionEventsRecorded: number;
}

// User slice (similar to Vuex state, mutations, and actions)
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    provisionalUserID: uuidv4(),
    sessionEventsRecorded: 0,
  } as UserState,
  reducers: {
    setLoggedOut: (state) => {
      state.user = null;
      state.provisionalUserID = uuidv4();
      state.sessionEventsRecorded = 0;
    },
    setUser: (state, action: PayloadAction<User>) => {
      const user = action.payload;
      if (user && user.hasOwnProperty('storage')) {
        user.storage = null;
      }
      state.user = user;
    },
    incrementSessionEventsRecorded: (state) => {
      state.sessionEventsRecorded += 1;
    },
    setIdentityId: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.identity_id = action.payload;
      }
    },
  },
});

// Selectors (equivalent to Vuex getters)
export const selectUsername = (state: RootState) => state.user.user?.username ?? 'guest';
export const selectPersonalizeUserID = (state: RootState) =>
  state.user.user ? state.user.user.id : state.user.provisionalUserID;
export const selectPersonalizeRecommendationsForVisitor = (state: RootState) =>
  state.user.user || (state.user.provisionalUserID && state.user.sessionEventsRecorded > 2);

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'user',
    'provisionalUserID',
    'sessionEventsRecorded',
    'welcomePageVisited',
    'cart',
    'demoWalkthroughShown',
    'lastVisitedPage',
  ],
};

// Combine all modules into the root reducer
const rootReducer = combineReducers({
  user: userSlice.reducer,
  welcomePageVisited: welcomePageVisitedSlice,
  categories: categoriesSlice,
  cart: cartSlice,
  modal: modalSlice,
  // demoWalkthroughShown: demoWalkthroughShownSlice,
  lastVisitedPage: lastVisitedPageSlice,
  confirmationModal: confirmationModalSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Persistor
export const persistor = persistStore(store);

// Define RootState type
export type RootState = ReturnType<typeof rootReducer>;

// Export actions
export const { setLoggedOut, setUser, incrementSessionEventsRecorded, setIdentityId } = userSlice.actions;

export default store;