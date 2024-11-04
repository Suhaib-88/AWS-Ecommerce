import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { v4 as uuidv4 } from 'uuid';

// Import slices (modules)
import userReducer, { UserState } from './modules/userSlice'
import cartReducer from './modules/cartSlice';
import categoriesReducer from './modules/categoriesSlice';
import confirmationModalReducer from './modules/confirmationModalSlice';
import modalReducer from './modules/modalSlice';
import lastVisitedPageReducer from './modules/lastVisitedPageSlice';
import welcomePageVisitedReducer from './modules/welcomePageVisitedSlice';

// === Redux Persist Configuration ===

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'user',
    'cart',
    'categories',
    'lastVisitedPage',
    'confirmationModal',
    'welcomePageVisited',
  ],
};

// === Combine Reducers ===

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  categories: categoriesReducer,
  confirmationModal: confirmationModalReducer,
  modal: modalReducer,
  lastVisitedPage: lastVisitedPageReducer,
  welcomePageVisited: welcomePageVisitedReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// === Configure Store ===

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for Redux-Persist
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
