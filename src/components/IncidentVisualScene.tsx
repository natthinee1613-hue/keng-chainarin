import React from 'react';
import { TerroristIncident } from '../data/terroristIncidentsData';
import { Flame, ShieldAlert, AlertTriangle, Crosshair, Radio, Camera } from 'lucide-react';

interface IncidentVisualSceneProps {
  incident: TerroristIncident;
  className?: string;
}

export const IncidentVisualScene: React.FC<IncidentVisualSceneProps> = ({ incident, className = '' }) => {
  const { visualScene } = incident;

  // Render SVG tactical art scene matching the specific incident type
  const renderSceneArtwork = () => {
    switch (visualScene.sceneType) {
      case 'road_crater':
        // Road blast crater with police line, smoke, EOD markers
        return (
          <svg viewBox="0 0 400 220" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="skyRoad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="60%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <radialGradient id="blastFire" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#ef4444" stopOpacity="0.7" />
                <stop offset="80%" stopColor="#7f1d1d" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
              <pattern id="roadStripes" width="40" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="8" width="20" height="4" fill="#fbbf24" opacity="0.6" />
              </pattern>
            </defs>

            {/* Background Sky / Forest Silhouette */}
            <rect width="400" height="110" fill="url(#skyRoad)" />
            {/* Jungle Tree Line */}
            <path
              d="M0 110 L15 85 L35 110 L50 80 L75 110 L100 75 L130 110 L160 82 L190 110 L230 78 L260 110 L300 80 L340 110 L370 85 L400 110 Z"
              fill="#064e3b"
              opacity="0.8"
            />
            <path
              d="M0 110 L25 95 L50 110 L80 90 L120 110 L170 92 L220 110 L270 88 L320 110 L380 94 L400 110 Z"
              fill="#022c22"
              opacity="0.9"
            />

            {/* Road Surface Perspective */}
            <polygon points="120,110 280,110 400,220 0,220" fill="#1e293b" />
            <line x1="200" y1="110" x2="200" y2="220" stroke="#facc15" strokeWidth="3" strokeDasharray="16 12" />

            {/* Asphalt blast crater hole */}
            <ellipse cx="200" cy="165" rx="65" ry="24" fill="#090d16" stroke="#450a0a" strokeWidth="3" />
            <ellipse cx="200" cy="166" rx="52" ry="18" fill="#000000" />
            {/* Blast scorched fire & smoke aura */}
            <ellipse cx="200" cy="160" rx="90" ry="35" fill="url(#blastFire)" />

            {/* Shattered debris and asphalt chunks */}
            <polygon points="150,158 158,152 154,162" fill="#475569" />
            <polygon points="245,155 255,160 248,165" fill="#334155" />
            <polygon points="175,182 185,186 178,190" fill="#475569" />
            <polygon points="225,180 235,178 230,185" fill="#334155" />

            {/* Smoke plume rising */}
            <path
              d="M 190 155 Q 170 120 185 85 Q 195 50 175 25"
              stroke="#64748b"
              strokeWidth="16"
              fill="none"
              opacity="0.35"
              strokeLinecap="round"
            />
            <path
              d="M 210 155 Q 230 115 215 75 Q 200 45 220 15"
              stroke="#475569"
              strokeWidth="20"
              fill="none"
              opacity="0.3"
              strokeLinecap="round"
            />

            {/* Police Line Caution Tape Barricade */}
            <line x1="20" y1="195" x2="380" y2="195" stroke="#facc15" strokeWidth="5" opacity="0.9" />
            <line x1="20" y1="195" x2="380" y2="195" stroke="#000000" strokeWidth="5" strokeDasharray="14 14" opacity="0.9" />
            <text x="200" y="210" fill="#facc15" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="2">
              POLICE LINE DO NOT CROSS • แนวกั้นพื้นที่ EOD ภ.9
            </text>

            {/* EOD Evidence Marker cones */}
            <polygon points="120,185 125,172 130,185" fill="#f97316" stroke="#ffffff" strokeWidth="0.8" />
            <text x="125" y="184" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">1</text>
            <polygon points="270,180 275,167 280,180" fill="#f97316" stroke="#ffffff" strokeWidth="0.8" />
            <text x="275" y="179" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">2</text>
          </svg>
        );

      case 'building_smoke':
        // Car bomb wreckage in front of building / flats with smoke
        return (
          <svg viewBox="0 0 400 220" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#090d16" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
            </defs>
            <rect width="400" height="220" fill="url(#skyNight)" />

            {/* Police Building Silhouette in Background */}
            <rect x="50" y="30" width="300" height="130" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            {/* Windows row 1 */}
            {[70, 110, 150, 190, 230, 270, 310].map((x, i) => (
              <rect key={i} x={x} y="45" width="20" height="22" fill={i % 2 === 0 ? '#38bdf8' : '#0f172a'} opacity="0.7" />
            ))}
            {/* Windows row 2 (shattered/damaged) */}
            {[70, 110, 150, 190, 230, 270, 310].map((x, i) => (
              <rect key={i} x={x} y="85" width="20" height="22" fill={i === 3 || i === 4 ? '#f97316' : '#1e293b'} opacity="0.8" />
            ))}

            {/* Ground Asphalt */}
            <rect x="0" y="150" width="400" height="70" fill="#0f172a" />

            {/* Burning Car Chassis Silhouette (Wreckage) */}
            <ellipse cx="200" cy="180" rx="70" ry="12" fill="#000000" opacity="0.8" />
            {/* Car body burnt frame */}
            <path
              d="M 140 180 L 150 162 L 180 152 L 230 152 L 255 165 L 265 180 Z"
              fill="#27272a"
              stroke="#52525b"
              strokeWidth="2"
            />
            {/* Car wheels charred */}
            <circle cx="165" cy="180" r="10" fill="#09090b" stroke="#3f3f46" strokeWidth="2" />
            <circle cx="240" cy="180" r="10" fill="#09090b" stroke="#3f3f46" strokeWidth="2" />

            {/* Intense Fire from Wreckage */}
            <path
              d="M 175 160 Q 185 125 195 145 Q 205 115 215 150 Q 225 130 230 160 Z"
              fill="#f97316"
              opacity="0.9"
            />
            <path
              d="M 185 160 Q 195 135 200 148 Q 210 128 220 160 Z"
              fill="#facc15"
              opacity="0.9"
            />

            {/* Fire Truck Water Stream & Emergency Lights Glow */}
            <circle cx="60" cy="170" r="45" fill="#38bdf8" opacity="0.25" />
            <circle cx="340" cy="170" r="45" fill="#ef4444" opacity="0.25" />
            {/* Flashing strobe beacons */}
            <circle cx="60" cy="165" r="5" fill="#38bdf8" />
            <circle cx="340" cy="165" r="5" fill="#ef4444" />
          </svg>
        );

      case 'checkpoint_fire':
        // Fortified checkpoint bunker with sandbags, spotlights, thermal sensor
        return (
          <svg viewBox="0 0 400 220" className="w-full h-full object-cover">
            <rect width="400" height="220" fill="#020617" />

            {/* Night vision green or high-contrast tactical backdrop */}
            <radialGradient id="searchLight" cx="15%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <rect width="400" height="220" fill="url(#searchLight)" />

            {/* Barbed wire coil across top */}
            <path
              d="M 0 50 Q 50 35 100 50 Q 150 65 200 50 Q 250 35 300 50 Q 350 65 400 50"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
            />
            <path
              d="M 0 50 Q 50 65 100 50 Q 150 35 200 50 Q 250 65 300 50 Q 350 35 400 50"
              fill="none"
              stroke="#64748b"
              strokeWidth="1.5"
            />

            {/* Sandbag Bunker Post in Center */}
            <rect x="130" y="110" width="140" height="70" fill="#78350f" opacity="0.9" rx="4" />
            {/* Sandbag Texture */}
            {[120, 140, 160].map((y, row) => (
              <g key={row}>
                {[135, 165, 195, 225, 250].map((x, col) => (
                  <rect
                    key={col}
                    x={x + (row % 2 === 0 ? 0 : 12)}
                    y={y}
                    width="26"
                    height="16"
                    fill="#92400e"
                    stroke="#451a03"
                    strokeWidth="1.5"
                    rx="3"
                  />
                ))}
              </g>
            ))}

            {/* Bunker Observation Slit with Armed Officer Silhouette */}
            <rect x="160" y="90" width="80" height="20" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <circle cx="195" cy="100" r="7" fill="#1e293b" />
            <line x1="202" y1="102" x2="225" y2="102" stroke="#000000" strokeWidth="3" />

            {/* Pipe bomb blast impact mark near bunker edge */}
            <circle cx="110" cy="165" r="28" fill="#ef4444" opacity="0.3" />
            <circle cx="110" cy="165" r="14" fill="#f97316" opacity="0.7" />
            <polygon points="105,160 115,150 112,165" fill="#facc15" />
            <polygon points="112,170 120,175 110,178" fill="#facc15" />

            {/* Checkpoint Stop Sign and Barrier Arm */}
            <line x1="280" y1="130" x2="370" y2="130" stroke="#ef4444" strokeWidth="6" strokeDasharray="15 15" />
            <rect x="275" y="120" width="12" height="60" fill="#475569" />
          </svg>
        );

      case 'bridge_ambush':
        // Bridge over river with blast on bridge abutment
        return (
          <svg viewBox="0 0 400 220" className="w-full h-full object-cover">
            <rect width="400" height="130" fill="#0f172a" />
            {/* Water River bottom */}
            <rect x="0" y="130" width="400" height="90" fill="#0369a1" opacity="0.8" />
            <path
              d="M0 160 Q 100 150 200 160 Q 300 170 400 160 L 400 220 L 0 220 Z"
              fill="#075985"
            />
            {/* Bridge Concrete Piers */}
            <rect x="90" y="90" width="30" height="90" fill="#475569" stroke="#334155" />
            <rect x="280" y="90" width="30" height="90" fill="#475569" stroke="#334155" />
            {/* Bridge Deck */}
            <polygon points="0,85 400,85 400,105 0,105" fill="#334155" stroke="#1e293b" />
            {/* Railing */}
            <line x1="0" y1="75" x2="400" y2="75" stroke="#94a3b8" strokeWidth="3" />

            {/* Broken Railing and Blast Damage at Bridge Center */}
            <ellipse cx="200" cy="95" rx="40" ry="15" fill="#ef4444" opacity="0.5" />
            <polygon points="190,95 200,60 215,95" fill="#f97316" />
            <polygon points="198,90 205,72 210,90" fill="#fef08a" />
            <line x1="170" y1="75" x2="190" y2="92" stroke="#dc2626" strokeWidth="3" />
            <line x1="230" y1="75" x2="210" y2="92" stroke="#dc2626" strokeWidth="3" />

            {/* Water reflection */}
            <ellipse cx="200" cy="170" rx="35" ry="8" fill="#f97316" opacity="0.3" />
          </svg>
        );

      case 'forest_clash':
      default:
        // Mountain forest patrol clash with gunshots/tactical HUD
        return (
          <svg viewBox="0 0 400 220" className="w-full h-full object-cover">
            <rect width="400" height="220" fill="#022c22" />
            {/* Forest Layers in Green/Dark tones */}
            <path
              d="M0 160 C 50 110, 100 130, 160 100 C 220 70, 300 110, 400 80 L 400 220 L 0 220 Z"
              fill="#064e3b"
            />
            <path
              d="M0 180 C 70 140, 140 160, 220 130 C 300 100, 350 150, 400 120 L 400 220 L 0 220 Z"
              fill="#022c22"
            />

            {/* Jungle Tree Trunks and Canopy */}
            {[40, 90, 160, 240, 310, 360].map((x, i) => (
              <g key={i}>
                <rect x={x} y="40" width="10" height="150" fill="#14532d" opacity="0.7" />
                <circle cx={x + 5} cy="45" r="30" fill="#15803d" opacity="0.4" />
              </g>
            ))}

            {/* Muzzle flash / Crossfire Tracers */}
            <line x1="280" y1="120" x2="160" y2="155" stroke="#facc15" strokeWidth="2.5" strokeDasharray="30 10" />
            <circle cx="280" cy="120" r="6" fill="#f97316" />
            <circle cx="280" cy="120" r="3" fill="#ffffff" />

            <line x1="150" y1="160" x2="270" y2="125" stroke="#ef4444" strokeWidth="2" strokeDasharray="25 15" />
            <circle cx="150" cy="160" r="5" fill="#ef4444" />

            {/* Patrol Officer Silhouettes Taking Cover */}
            <path d="M 120 190 Q 130 160 140 190 Z" fill="#0f172a" />
            <path d="M 145 185 Q 155 155 165 185 Z" fill="#0f172a" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border border-slate-700 bg-slate-950 text-white shadow-xl ${className}`}>
      {/* 1. Underlying Tactical Art Scene */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden">
        {renderSceneArtwork()}

        {/* Tactical Scanlines & Vignette */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.6) 2px, rgba(0, 0, 0, 0.6) 4px)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60 pointer-events-none" />

        {/* Tactical HUD Header */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono pointer-events-none z-10">
          <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-md border border-red-500/50 text-red-300">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-bold tracking-wider">{visualScene.summaryBadge}</span>
          </div>

          <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20 text-white/90">
            <Camera className="w-3.5 h-3.5 text-sky-400" />
            <span>{visualScene.timeHUD}</span>
          </div>
        </div>

        {/* Tactical Crosshair Center Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-16 h-16 border border-red-500/40 rounded-full flex items-center justify-center animate-pulse">
            <Crosshair className="w-6 h-6 text-red-400/70" />
            <div className="absolute -top-1 w-2 h-0.5 bg-red-400" />
            <div className="absolute -bottom-1 w-2 h-0.5 bg-red-400" />
            <div className="absolute -left-1 w-0.5 h-2 bg-red-400" />
            <div className="absolute -right-1 w-0.5 h-2 bg-red-400" />
          </div>
        </div>

        {/* Tactical Coordinates & Station Badge at bottom of visual */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-end justify-between text-xs pointer-events-none z-10">
          <div className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700/80 text-[11px] font-mono text-slate-300">
            <span className="text-amber-400 font-bold">GRID: </span>
            <span>{incident.locationCoords.latLngText}</span>
          </div>

          <div className="bg-red-950/90 text-red-200 border border-red-500/60 font-bold px-2 py-0.5 rounded text-[11px] font-['Prompt']">
            {incident.stationName}
          </div>
        </div>
      </div>

      {/* 2. Visual Scene Caption & Forensic Summary */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 text-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-slate-200 line-clamp-1">{visualScene.title}</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
          ภ.9 TACTICAL FORENSICS
        </span>
      </div>
    </div>
  );
};
