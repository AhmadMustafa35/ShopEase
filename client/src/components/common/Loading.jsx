import React from 'react';
import { HiShoppingBag } from 'react-icons/hi2';

const Loading = ({ fullScreen = false, text = 'Loading...', size = 'medium' }) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4'
    : 'w-full py-16 flex flex-col items-center justify-center p-4';

  const iconSizes = {
    small: 'w-6 h-6 text-xl',
    medium: 'w-10 h-10 text-3xl',
    large: 'w-14 h-14 text-5xl',
  };

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="absolute animate-ping rounded-full h-16 w-16 bg-indigo-100 opacity-75"></div>
        
        {/* Animated spinner ring */}
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>

        {/* Center brand icon */}
        <div className="absolute flex items-center justify-center text-indigo-600 animate-pulse">
          <HiShoppingBag className="w-7 h-7" />
        </div>
      </div>

      {text && (
        <p className="mt-4 text-sm font-medium text-gray-600 tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loading;
