import React from 'react';

interface WarzoneBloodOverlayProps {
  intensity?: 'subtle' | 'moderate' | 'heavy';
}

export const WarzoneBloodOverlay: React.FC<WarzoneBloodOverlayProps> = ({
  intensity = 'heavy',
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Top Left Major Blood Splatter */}
      <svg
        className="absolute -top-6 -left-6 w-72 h-72 opacity-85 transform -rotate-12 filter drop-shadow-[0_4px_12px_rgba(153,27,27,0.7)]"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="bloodGrad1" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="35%" stopColor="#b91c1c" />
            <stop offset="70%" stopColor="#7f1d1d" />
            <stop offset="100%" stopColor="#450a0a" stopOpacity="0.95" />
          </radialGradient>
          <filter id="bloodGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Central Impact Pool */}
        <path
          d="M60 40 C75 25, 110 30, 120 50 C130 70, 145 60, 150 80 C155 100, 135 125, 115 130 C95 135, 70 145, 50 125 C30 105, 45 80, 40 60 C35 40, 45 55, 60 40 Z"
          fill="url(#bloodGrad1)"
          filter="url(#bloodGlow)"
        />

        {/* Dynamic Spatter Tendrils & Droplets */}
        <path
          d="M115 45 Q145 25 170 18 Q140 38 125 55 Z"
          fill="#991b1b"
        />
        <path
          d="M135 75 Q175 72 195 85 Q165 92 135 90 Z"
          fill="#7f1d1d"
        />
        <path
          d="M120 120 Q150 155 175 180 Q140 150 110 135 Z"
          fill="#991b1b"
        />
        <path
          d="M85 130 Q70 170 65 195 Q60 160 75 130 Z"
          fill="#7f1d1d"
        />
        <path
          d="M45 110 Q15 140 5 160 Q25 130 40 100 Z"
          fill="#991b1b"
        />
        <path
          d="M40 70 Q10 50 2 30 Q20 55 45 65 Z"
          fill="#7f1d1d"
        />

        {/* Scattered High-velocity Droplets */}
        <circle cx="185" cy="40" r="4.5" fill="#991b1b" />
        <circle cx="192" cy="55" r="2.5" fill="#ef4444" />
        <circle cx="160" cy="15" r="3" fill="#7f1d1d" />
        <circle cx="180" cy="115" r="4" fill="#991b1b" />
        <circle cx="195" cy="130" r="2" fill="#dc2626" />
        <circle cx="150" cy="185" r="5" fill="#7f1d1d" />
        <circle cx="130" cy="195" r="3.5" fill="#991b1b" />
        <circle cx="85" cy="190" r="4" fill="#7f1d1d" />
        <circle cx="45" cy="175" r="3" fill="#991b1b" />
        <circle cx="15" cy="110" r="4" fill="#7f1d1d" />
        <circle cx="8" cy="85" r="2.5" fill="#ef4444" />
        <circle cx="20" cy="20" r="3.5" fill="#991b1b" />
        <circle cx="35" cy="12" r="2" fill="#7f1d1d" />
      </svg>

      {/* Top Right Heavy Blood Splatter & Runoff */}
      <svg
        className="absolute -top-4 -right-4 w-80 h-80 opacity-80 transform rotate-45 filter drop-shadow-[0_4px_16px_rgba(153,27,27,0.75)]"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M90 35 C115 15, 140 25, 155 50 C170 75, 165 110, 145 130 C125 150, 90 145, 70 135 C50 125, 45 95, 55 70 C65 45, 65 55, 90 35 Z"
          fill="url(#bloodGrad1)"
        />
        {/* Violent Splashes */}
        <path d="M140 40 Q180 15 198 5 Q165 30 145 55 Z" fill="#991b1b" />
        <path d="M160 85 Q195 95 200 115 Q170 105 150 95 Z" fill="#7f1d1d" />
        <path d="M135 130 Q160 170 175 195 Q145 160 125 135 Z" fill="#991b1b" />
        <path d="M75 135 Q50 175 40 198 Q50 160 70 135 Z" fill="#7f1d1d" />
        <circle cx="190" cy="25" r="3.5" fill="#991b1b" />
        <circle cx="178" cy="140" r="4.5" fill="#7f1d1d" />
        <circle cx="192" cy="155" r="2.5" fill="#ef4444" />
        <circle cx="65" cy="185" r="4" fill="#991b1b" />
        <circle cx="25" cy="160" r="3.5" fill="#7f1d1d" />
      </svg>

      {/* Center Drips & Splatters around the Command Node */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 opacity-40 pointer-events-none flex justify-around">
        <svg className="w-40 h-40 transform rotate-180" viewBox="0 0 100 100" fill="#991b1b">
          <path d="M50 0 C45 30, 20 40, 20 65 C20 85, 35 100, 50 100 C65 100, 80 85, 80 65 C80 40, 55 30, 50 0 Z" opacity="0.6" />
          <circle cx="30" cy="40" r="3" fill="#ef4444" />
          <circle cx="75" cy="50" r="4" fill="#7f1d1d" />
        </svg>
        <svg className="w-32 h-32 transform rotate-90" viewBox="0 0 100 100" fill="#7f1d1d">
          <path d="M40 20 Q70 40 90 20 Q70 60 40 50 Z" opacity="0.7" />
          <circle cx="85" cy="25" r="3" fill="#dc2626" />
        </svg>
      </div>

      {/* Bottom Edge Long Blood Runoff & Drops */}
      <svg
        className="absolute -bottom-6 left-12 w-96 h-48 opacity-75 filter drop-shadow-[0_2px_10px_rgba(153,27,27,0.6)]"
        viewBox="0 0 300 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 150 Q40 90 60 110 Q90 60 120 100 Q160 40 180 90 Q220 50 250 85 Q280 40 300 120 L300 150 L10 150 Z"
          fill="#7f1d1d"
          opacity="0.85"
        />
        {/* Dripping drops */}
        <circle cx="45" cy="75" r="4.5" fill="#ef4444" />
        <circle cx="105" cy="45" r="5" fill="#991b1b" />
        <circle cx="165" cy="25" r="4" fill="#dc2626" />
        <circle cx="230" cy="35" r="6" fill="#7f1d1d" />
        <circle cx="275" cy="20" r="3.5" fill="#ef4444" />
      </svg>

      {/* Bottom Right Extreme Blood Gush */}
      <svg
        className="absolute -bottom-8 -right-8 w-80 h-80 opacity-80 transform -rotate-45 filter drop-shadow-[0_4px_16px_rgba(153,27,27,0.7)]"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M80 60 C100 40, 130 50, 140 70 C150 90, 160 120, 130 140 C100 160, 70 150, 50 130 C30 110, 60 80, 80 60 Z"
          fill="url(#bloodGrad1)"
        />
        <path d="M130 70 Q165 40 185 20 Q155 50 140 80 Z" fill="#991b1b" />
        <path d="M145 110 Q180 120 195 140 Q160 130 135 120 Z" fill="#7f1d1d" />
        <circle cx="175" cy="30" r="4" fill="#ef4444" />
        <circle cx="190" cy="60" r="3" fill="#991b1b" />
        <circle cx="185" cy="135" r="5" fill="#7f1d1d" />
      </svg>

      {/* Smoky Battlefield Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-950/40 via-transparent to-red-950/30 pointer-events-none mix-blend-multiply" />
      <div className="absolute inset-0 bg-radial-vignette opacity-50 pointer-events-none" />
    </div>
  );
};
