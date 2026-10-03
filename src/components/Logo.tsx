import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showSubtitle = false
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* Precision Custom SVG Brand Icon */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 rounded-xl shadow-sm rotate-0 group-hover:rotate-3 transition-transform duration-300" />
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="relative w-5 h-5 text-white"
        >
          {/* Gentle caring bowl / hands cradle */}
          <path 
            d="M6 17.5C6 23.299 10.4772 27 16 27C21.5228 27 26 23.299 26 17.5C26 16.5 25.5 16 24 16C21 16 20 18 16 18C12 18 11 16 8 16C6.5 16 6 16.5 6 17.5Z" 
            fill="currentColor" 
            fillOpacity="0.9" 
          />
          {/* Sprout stem & dual leaves */}
          <path 
            d="M16 18V7" 
            stroke="currentColor" 
            strokeWidth="2.4" 
            strokeLinecap="round" 
          />
          <path 
            d="M16 11C16 8 19.5 5 23 5C23 8.5 20 12 16 12" 
            stroke="currentColor" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M16 14C16 11.5 13 9 9.5 9C9.5 12 12.5 15 16 15" 
            stroke="currentColor" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-none">
        <div className={`font-extrabold tracking-tight font-sans ${textSizes[size]}`}>
          <span className="text-slate-900">Food</span>
          <span className="text-emerald-700">Rescue</span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mt-0.5">
            Zero Waste Network
          </span>
        )}
      </div>
    </div>
  );
};
