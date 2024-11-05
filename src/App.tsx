import React, { useContext, useEffect } from 'react'
import AppRouter from './router';
import './App.css'

import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';

// Imports the default styles for the Amplify UI components. This line ensures that the authenticator looks nice out of the box.
import '@aws-amplify/ui-react/styles.css';




const App: React.FC = () => {
  // const {getCategories, getCart} = useContext(AppContext)

  // useEffect(() => {
  //   getCategories()
  //   getCart()
  // }, [getCategories, getCart])

  return (
    <div id= "app">
      
    <Authenticator>
    {({ signOut }) => (
      <main>
        <header className='App-header'>
          <AppRouter />
         
          <button 
            onClick={signOut} 
            style={{ 
              margin: '20px', 
              fontSize: '0.8rem', 
              padding: '5px 10px', 
              marginTop: '20px'
            }}
          >
            Sign Out
          </button>
        </header>
      </main>
    )}
    </Authenticator>

    </div>
  )
}

export default withAuthenticator(App)
