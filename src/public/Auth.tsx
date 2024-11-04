import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import SecondaryLayout from '../components/SecondaryLayout/SecondaryLayout';
import '@aws-amplify/ui-react/styles.css';
import { redirect } from 'react-router-dom';

const Auth: React.FC = () => {
  
  return (
    <SecondaryLayout>
      <Authenticator signUpAttributes={['email']}>
        {(
          <div style={{ padding: 'var(--amplify-space-large)', textAlign: 'left' }}>
            Hello world
          </div>
        )}
        
      </Authenticator>
    </SecondaryLayout>
  );
};

export default Auth;

<style jsx>{`
  .amplify-input {
    text-align: left;
  }
  .amplify-field {
    text-align: left;
  }
`}</style>