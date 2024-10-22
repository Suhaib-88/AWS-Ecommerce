import React from "react";

interface LoadingFallbackProps {
    small?: boolean;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({small=false}) => {
    return <div className={`loading-fallback ${small ? 'fa-2x' : 'fa-3x'}`}></div>
}

export default LoadingFallback;

