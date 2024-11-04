import React from 'react';
// import PoweredByAWS from '@/components/PoweredByAWS/PoweredByAWS';
// import TermsAndConditions from '@/partials/TermsAndConditions/TermsAndConditions';
// import './SecondaryLayout.css'; // Assuming you move styles to a CSS file

const SecondaryLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <div className="banner mb-5 py-2">
        <div className="container d-flex align-items-center">
          <img src="/RDS_logo_white.svg" alt="logo" className="logo" />
          {/* <PoweredByAWS className="powered-by-logo" /> */}
        </div>
      </div>

      {children}

      <footer className="mt-5 container">
        {/* <TermsAndConditions /> */}
      </footer>
    </div>
  );
};

export default SecondaryLayout;