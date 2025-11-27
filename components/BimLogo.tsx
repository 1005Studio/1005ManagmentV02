import React from 'react';

export const BimLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <img 
      src="/images/bim.png" 
      alt="BİM" 
      className={`${className} object-contain`}
    />
  );
};