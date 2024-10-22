import React from 'react';

interface ServiceBadgeProps {
  text: string;
  src: string;
}

const ServiceBadge: React.FC<ServiceBadgeProps> = ({ text, src }) => (
  <span className="d-flex align-items-center">
    <img src={src} alt={text} className="badge-img" />
    {text}
  </span>
);

export default ServiceBadge;

// Add the styles in a CSS file or use styled-components
// .badge-img {
//   margin-right: 10px;
//   height: 40px;
// }
