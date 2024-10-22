import React from 'react';
import './FiveStars.css'; // Assuming you move the styles to a separate CSS file

const FiveStars: React.FC = () => {
  return (
    <div>
      {[...Array(5)].map((_, i) => (
        <i key={i} className="fas fa-star"></i>
      ))}
    </div>
  );
};

export default FiveStars;
