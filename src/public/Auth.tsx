import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import SecondaryLayout from '../components/SecondaryLayout/SecondaryLayout';
import '@aws-amplify/ui-react/styles.css';

const Auth: React.FC = () => {
  return (
    <SecondaryLayout>
      <Authenticator signUpAttributes={['username', 'password', 'email']}>
        {({ signUpHeader }: { signUpHeader: any }) => (
          <div style={{ padding: 'var(--amplify-space-large)', textAlign: 'left' }}>
            We require you to enter an email address to send a code to verify your account.<br />
            Passwords must contain at least 8 characters, including an uppercase letter, a lowercase letter, a special character, and a number.
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