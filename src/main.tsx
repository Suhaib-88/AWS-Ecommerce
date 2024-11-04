import React,{useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import {Amplify} from 'aws-amplify';
import store from '../src/store/store';
import amplitude from 'amplitude-js';
import mParticle from '@mparticle/web-sdk';
import ReactGA from 'react-ga4';
import amplifyConfig from './aws-exports';
import './styles/tokens.css';
import AppRouter from './router';



// import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';

// // Imports the default styles for the Amplify UI components. This line ensures that the authenticator looks nice out of the box.
// import '@aws-amplify/ui-react/styles.css';

// import { Auth } from '@aws-amplify/auth';
// import { API } from '@aws-amplify/api';
// Function to check if user is authenticated
// const checkUserAuthenticated = async () => {
//   try {
//     const user = await Auth.currentAuthenticatedUser();
//     console.log('User is authenticated:', user);
//     return true;
//   } catch (error) {
//     console.error('User is not authenticated:', error);
//     return false;
//   }
// };


// import { API } from 'aws-amplify';

// const fetchCognitoUser = async () => {
//   const isAuthenticated = await checkUserAuthenticated();
//   if (!isAuthenticated) {
//     console.error('User is not authenticated. Cannot fetch user.');
//     return; // Or prompt user to sign in
//   }

//   try {
//     // Replace 'yourApiName' and 'yourApiPath' with your actual API configuration
//     const response = await API.get('yourApiName', '/yourApiPath');
//     console.log('Cognito user fetched:', response);
//   } catch (error) {
//     console.error('Error fetching Cognito user:', error);
//   }
// };

// try {
//   const user = await getCurrentUser();
//   console.log(user.username);
  
// } catch (error) {
//   console.error("Error fetching Cognito user:", error);
//   console.log('null');
// }

// const Notifications: React.FC = () => {
//   const [connection, setConnection] = useState<WebSocket | null>(null);
//   const [cognitoUser, setCognitoUser] = useState<string | null>(null);

//   useEffect(() => {
//     const init = async () => {
      
//     };
//     init();

//     // Cleanup WebSocket connection on component unmount
//     return () => {
//       if (connection) {
//         console.log("Closing WebSocket connection");
//         connection.close();
//       }
//     };
//   }, []);
// }

// Base configuration for Amplify
// const amplifyConfig = {
//   Auth: {
//     Cognito: {
//       identityPoolId: 'us-east-1:1672d0b6-e3a3-4623-9d2e-ff5302cd183d' || '',
//       region: 'us-east-1' || '',
//       identityPoolRegion: 'us-east-1' || '',
//       userPoolId: 'us-east-1_A9vxozngm' || '',
//       userPoolClientId: '37h9gd9g4kq0i38v1c662hs3d3' || '',
//       allowGuestAccess: true,
//     },
//   },
  // Analytics: {
  //   autoSessionRecord: true,
  // },
  // Interactions: {
  //   LexV1: {
  //     RetailDemoStore: {
  //       name: process.env.REACT_APP_BOT_NAME,
  //       alias: process.env.REACT_APP_BOT_ALIAS,
  //       region: process.env.REACT_APP_BOT_REGION,
  //     },
  //   },
  // },
  // Storage: {
  //   S3: {
  //     bucket: process.env.REACT_APP_ROOM_IMAGES_BUCKET,
  //     region: process.env.REACT_APP_AWS_REGION,
  //   },
  // },
  // API: {
  //   REST: {
  //     demoServices: {
  //       endpoint: process.env.REACT_APP_API_GATEWAY,
  //       region: process.env.REACT_APP_AWS_REGION,
  //     },
  //   },
  // },
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

// const customConfig = {
  
// };
Amplify.configure(amplifyConfig);

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
  <Provider store={store}>
    <App />
  </Provider>
);

