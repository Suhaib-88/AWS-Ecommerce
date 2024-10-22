// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { lazy } from 'react';
import { Route, BrowserRouter as Router, Routes, Navigate, useLocation } from 'react-router-dom';
import Admin from '../authenticated/Admin';
// import { Hub, Auth } from 'aws-amplify';
// import AmplifyStore from '@/store';
// import { RepositoryFactory } from '../repositories/RepositoryFactory';
// import { AnalyticsHandler } from '../analytics/AnalyticsHandler';

// const UsersRepository = RepositoryFactory.get('users');

// const Welcome = lazy(() => import('..//public/Welcome'));
// const Main = lazy(() => import('../public/Main'));
// const ProductDetail = lazy(() => import('../public/ProductDetail'));
// const CategoryDetail = lazy(() => import('../public/CategoryDetail'));
// // const Live = lazy(() => import('..//public/Live'));
// const Help = lazy(() => import('..//public/Help'));
// const Cart = lazy(() => import('..//public/Cart'));
// const AuthScreen = lazy(() => import('..//public/Auth'));
// const Checkout = lazy(() => import('..//public/Checkout'));
// // const Location = lazy(() => import('..//public/Location'));
// const Collections = lazy(() => import('../public/Collection'));
// const Orders = lazy(() => import('..//authenticated/Orders'));
// const Admin = require('../authenticated/Admin');
// const ShopperSelectPage = require('../authenticated/ShopperSelectPage');// const ShopperSelectPage = lazy(() => import('..//authenticated/ShopperSelectPage'));
// const RoomGenerator = lazy(() => import('..//public/RoomGenerator'));

// Function to handle authentication events
// const authListener = async (data: any) => {
//   switch (data.payload.event) {
//     case 'signedOut':
//       AmplifyStore.dispatch('logout');
//       // AnalyticsHandler.clearUser();
//       if (window.location.pathname !== '/') window.location.replace('/');
//       break;
//     case 'signedIn': {
//       let storeUser = null;
//       const userAttributes = await Auth.userAttributes(data.payload.data);
//       const { username } = data.payload.data;
//       const hasAssignedShopperProfile = !!userAttributes?.['custom:profile_user_id'];

//       if (hasAssignedShopperProfile) {
//         storeUser = await UsersRepository.getUserByID(userAttributes['custom:profile_user_id']);
//       } else {
//         storeUser = await UsersRepository.getUserByUsername(username);
//       }

//       const { identityId } = await Auth.currentUserCredentials();
//       if (!storeUser.id) {
//         console.log('Store user does not exist for cognito user... creating on the fly');
//         let provisionalUserId = AmplifyStore.getters.personalizeUserID;
//         storeUser = await UsersRepository.createUser(provisionalUserId, username, userAttributes.email, identityId);
//       }

//       console.log('Syncing store user state to cognito user custom attributes');
//       await Auth.updateUserAttributes(data.payload.data, {
//         'custom:profile_user_id': storeUser.id.toString(),
//         'custom:profile_email': storeUser.email,
//         'custom:profile_first_name': storeUser.first_name,
//         'custom:profile_last_name': storeUser.last_name,
//         'custom:profile_gender': storeUser.gender,
//         'custom:profile_age': storeUser.age.toString(),
//         'custom:profile_persona': storeUser.persona,
//       });

//       if (storeUser.identity_id !== identityId) {
//         console.log('Syncing credentials identity_id with store user profile');
//         storeUser.identity_id = identityId;
//       }

//       let newSignUp = false;
//       const now = new Date();
//       storeUser.last_sign_in_date = now.toISOString();

//       if (!storeUser.sign_up_date) {
//         storeUser.sign_up_date = now.toISOString();
//         newSignUp = true;
//       }

//       // await AnalyticsHandler.identify(storeUser);
//       // AnalyticsHandler.userSignedIn(storeUser);

//       // if (newSignUp) {
//       //   AnalyticsHandler.userSignedUp(storeUser);
//       // }

//       await UsersRepository.updateUser(storeUser);
//       AmplifyStore.commit('setUser', storeUser);

//       if (newSignUp && !hasAssignedShopperProfile) {
//         AmplifyStore.dispatch('firstTimeSignInDetected');
//         window.location.replace('/shopper-select');
//       } else {
//         window.location.replace('/');
//       }
//       break;
//     }
//   }
// };

// // Event listener for user profile changes
// const userListener = async (data: any) => {
//   if (data.payload.event === 'profileChanged') {
//     const storeUser = AmplifyStore.state.user;
//     if (storeUser) {
//       await Auth.updateUserAttributes(data.payload.data, {
//         'custom:profile_user_id': storeUser.id.toString(),
//         'custom:profile_email': storeUser.email,
//         'custom:profile_first_name': storeUser.first_name,
//         'custom:profile_last_name': storeUser.last_name,
//         'custom:profile_gender': storeUser.gender,
//         'custom:profile_age': storeUser.age.toString(),
//         'custom:profile_persona': storeUser.persona,
//       });
//     }

//     const { identityId } = await Auth.currentUserCredentials();
//     if (storeUser.identity_id !== identityId) {
//       console.log('Syncing credentials identity_id with store user profile');
//       AmplifyStore.commit('setIdentityId', identityId);
//       UsersRepository.updateUser(storeUser);
//     }
//   }
// };

// Hub.listen('auth', authListener);
// Hub.listen('user', userListener);

// const PrivateRoute = ({ children }: { children: JSX.Element }) => {
//   const location = useLocation();
//   const user = AmplifyStore.state.user;

//   if (!user) {
//     return <Navigate to={`/auth?redirect=${location.pathname}`} />;
//   }

//   return children;
// };

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Main />} /> */}
        {/* <Route path="/welcome" element={<Welcome />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:id" element={<CategoryDetail />} />
        <Route path="/roomgenerator" element={<PrivateRoute><RoomGenerator /></PrivateRoute>} />
        {/* <Route path="/live" element={<Live />} /> */}
        {/* <Route path="/help" element={<Help />} />
        <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} /> */} 
        <Route path="/admin" element={<Admin />} />
        {/* <Route path="/auth" element={<AuthScreen />} />
        <Route path="/shopper-select" element={<PrivateRoute><ShopperSelectPage /></PrivateRoute>} />
        {/* <Route path="/location" element={<PrivateRoute><Location /></PrivateRoute>} /> */}
        {/* <Route path="/collections" element={<PrivateRoute><Collections /></PrivateRoute>} /> */} 
      </Routes>
    </Router>
  );
};

export default AppRouter;
