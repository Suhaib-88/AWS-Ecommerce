// SupportLink.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import SupportIcon from './SupportIcon';

const SupportLink: React.FC = () => {
  return (
    <Link to="/help" aria-label="support" className="support">
      <SupportIcon className="icon" />
    </Link>
  );
};

export default SupportLink;
