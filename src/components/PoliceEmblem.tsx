import React from 'react';

interface PoliceEmblemProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  accentColor?: string;
}

export const PoliceEmblem: React.FC<PoliceEmblemProps> = ({
  size = 'md',
  animated = true,
  accentColor = '#f59e0b',
}) => {
  const dimensions = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
    xl: 'w-32 h-32 sm:w-40 sm:h-40',
  }[size];

  return (
    <div className={`relative ${dimensions} flex items-center justify-center flex-shrink-0 select-none`}>
      {/* Outer Tactical Rotating Ring */}
      {animated && (
        <div
          className="absolute inset-0 rounded-full border border-dashed animate-spin"
          style={{
            borderColor: accentColor,
            opacity: 0.45,
            animationDuration: '24s',
          }}
        />
      )}

      {/* Pulsing Aura */}
      <div
        className={`absolute inset-1 rounded-full blur-md ${animated ? 'animate-pulse' : ''}`}
        style={{
          backgroundColor: accentColor,
          opacity: 0.25,
        }}
      />

      {/* SVG Police Crest */}
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full relative z-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
      >
        <defs>
          {/* Gold metallic gradients */}
          <linearGradient id="goldPlate" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="35%" stopColor="#eab308" />
            <stop offset="70%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>

          <linearGradient id="shieldFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="swordBlade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ca8a04" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* 16-point Sunburst Star Backdrop */}
        <g filter="url(#goldGlow)">
          {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((deg) => (
            <polygon
              key={deg}
              points="60,10 63,35 60,30 57,35"
              fill="url(#goldPlate)"
              transform={`rotate(${deg} 60 60)`}
            />
          ))}
        </g>

        {/* Outer Circular Ring with studs */}
        <circle cx="60" cy="60" r="48" fill="none" stroke="url(#goldPlate)" strokeWidth="3" />
        <circle cx="60" cy="60" r="44" fill="none" stroke="#713f12" strokeWidth="1" strokeDasharray="3,3" />

        {/* Traditional Thai Police Shield Body */}
        <path
          d="M 60 26 C 78 26 88 34 88 56 C 88 80 60 98 60 98 C 60 98 32 80 32 56 C 32 34 42 26 60 26 Z"
          fill="url(#shieldFill)"
          stroke="url(#goldPlate)"
          strokeWidth="3.5"
        />

        {/* Inner Shield Rim */}
        <path
          d="M 60 30 C 74 30 83 37 83 56 C 83 76 60 92 60 92 C 60 92 37 76 37 56 C 37 37 46 30 60 30 Z"
          fill="none"
          stroke="url(#goldPlate)"
          strokeWidth="1.2"
          opacity="0.8"
        />

        {/* Crossing Tactical Swords (พระแสงดาบเขน) */}
        <g stroke="url(#swordBlade)" strokeWidth="2.2" strokeLinecap="round">
          <line x1="38" y1="38" x2="82" y2="82" />
          <line x1="82" y1="38" x2="38" y2="82" />
        </g>

        {/* Central Crown / Victory Star */}
        <circle cx="60" cy="58" r="14" fill="#854d0e" stroke="url(#goldPlate)" strokeWidth="2" />

        {/* 5-pointed Star inside */}
        <polygon
          points="60,47 63,55 72,55 65,60 67,69 60,64 53,69 55,60 48,55 57,55"
          fill="url(#goldPlate)"
        />

        {/* Thai numeral 9 (๙) emblem at the base of shield */}
        <text
          x="60"
          y="87"
          fontSize="13"
          fontWeight="bold"
          fontFamily="Sarabun, sans-serif"
          textAnchor="middle"
          fill="url(#goldPlate)"
        >
          ภ.๙
        </text>

        {/* Specular Light Sheen Reflection */}
        <path
          d="M 40 32 C 55 30 70 34 80 44 C 70 48 55 42 40 40 Z"
          fill="#ffffff"
          opacity="0.25"
        />
      </svg>
    </div>
  );
};
