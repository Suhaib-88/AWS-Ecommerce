import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // Define types for your Redux state

const Progress: React.FC = () => {
  const radius = 60;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  const progress = useSelector((state: RootState) => state.confirmationModal.progress);
  const isError = useSelector((state: RootState) => state.confirmationModal.isError);

  const complete = progress === 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <svg height={radius * 2} width={radius * 2}>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
          {isError ? 'Error!' : complete ? 'Complete!' : 'Processing...'}
        </text>
        <circle
          className="bar unachieved-progress"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className={`bar achieved-progress ${isError ? 'achieved-progress--error' : ''}`}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
    </div>
  );
};

export default Progress;
