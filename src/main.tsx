import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import Amplify from 'aws-amplify';
// import { configureStore } from '@/store/store';
import amplitude from 'amplitude-js';
import mParticle from '@mparticle/web-sdk';
import ReactGA from 'react-ga4';

import './styles/tokens.css';
import AppRouter from './router';

// Base configuration for Amplify
// const amplifyConfig = {
//   Auth: {
//     Cognito: {
//       identityPoolId: process.env.REACT_APP_AWS_IDENTITY_POOL_ID,
//       region: process.env.REACT_APP_AWS_REGION,
//       identityPoolRegion: process.env.REACT_APP_AWS_REGION,
//       userPoolId: process.env.REACT_APP_AWS_USER_POOL_ID,
//       userPoolClientId: process.env.REACT_APP_AWS_USER_POOL_CLIENT_ID,
//       allowGuestAccess: true,
//     },
//   },
//   Analytics: {
//     autoSessionRecord: true,
//   },
//   Interactions: {
//     LexV1: {
//       RetailDemoStore: {
//         name: process.env.REACT_APP_BOT_NAME,
//         alias: process.env.REACT_APP_BOT_ALIAS,
//         region: process.env.REACT_APP_BOT_REGION,
//       },
//     },
//   },
//   Storage: {
//     S3: {
//       bucket: process.env.REACT_APP_ROOM_IMAGES_BUCKET,
//       region: process.env.REACT_APP_AWS_REGION,
//     },
//   },
//   API: {
//     REST: {
//       demoServices: {
//         endpoint: process.env.REACT_APP_API_GATEWAY,
//         region: process.env.REACT_APP_AWS_REGION,
//       },
//     },
//   },
// };

// if (typeof process.env.REACT_APP_PINPOINT_APP_ID !== 'undefined') {
//   amplifyConfig.Analytics.Pinpoint = {
//     appId: process.env.REACT_APP_PINPOINT_APP_ID,
//     region: process.env.REACT_APP_PINPOINT_REGION,
//     mandatorySignIn: false,
//   };

//   const storeState = configureStore().getState();
//   if (storeState.user?.id) {
//     amplifyConfig.Analytics.Pinpoint.endpoint = {
//       userId: storeState.user.id,
//     };
//   }
// }

// // Add Personalize event tracking if configured
// if (
//   process.env.REACT_APP_PERSONALIZE_TRACKING_ID &&
//   process.env.REACT_APP_PERSONALIZE_TRACKING_ID !== 'NONE'
// ) {
//   amplifyConfig.Analytics.Personalize = {
//     trackingId: process.env.REACT_APP_PERSONALIZE_TRACKING_ID,
//     region: process.env.REACT_APP_AWS_REGION,
//     flushSize: 5,
//     flushInterval: 2000,
//   };
// }

// // Initialize Amplitude if a valid API key is specified
// if (
//   process.env.REACT_APP_AMPLITUDE_API_KEY &&
//   process.env.REACT_APP_AMPLITUDE_API_KEY !== 'NONE'
// ) {
//   amplitude.getInstance().init(process.env.REACT_APP_AMPLITUDE_API_KEY);
// }

// // Initialize mParticle if a valid API key is specified
// if (
//   process.env.REACT_APP_MPARTICLE_API_KEY &&
//   process.env.REACT_APP_MPARTICLE_API_KEY !== 'NONE'
// ) {
//   const mParticleConfig = {
//     isDevelopmentMode: true,
//     logLevel: 'verbose',
//   };
//   mParticle.init(process.env.REACT_APP_MPARTICLE_API_KEY, mParticleConfig);
// }

// // Set the Amplify configuration
// Amplify.configure(amplifyConfig);

// // Initialize Google Analytics if ID is specified
// if (
//   process.env.REACT_APP_GOOGLE_ANALYTICS_ID &&
//   process.env.REACT_APP_GOOGLE_ANALYTICS_ID !== 'NONE'
// ) {
//   ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID, {
//     gaOptions: {
//       send_page_view: false,
//     },
//   });
// }

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  // <Provider store={configureStore()}>
  <React.StrictMode>
    <App />
      
    {/* // </Provider> */}
  ,
  </React.StrictMode>
);

