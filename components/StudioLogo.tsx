import React from 'react';

export const StudioLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <img 
      src="/images/logo.png" 
      alt="1005 Studio" 
      className={`${className} object-contain`}
    />
  );
};