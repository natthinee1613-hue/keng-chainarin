import React from 'react';
import { Flame, ShieldAlert, Crosshair } from 'lucide-react';

export type ProvinceMapKey =
  | 'yala'
  | 'pattani'
  | 'narathiwat'
  | 'songkhla'
  | 'songkhla_risk'
  | 'central'
  | 'all';

interface ProvinceMiniMapProps {
  provinceKey: ProvinceMapKey | string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  active?: boolean;
  showLabel?: boolean;
  highlightColor?: string;
  onClickMap?: (provinceKey: ProvinceMapKey) => void;
  showIncidentBadge?: boolean;
}

// Helper to normalize any province string or group string to a standard key
export function getProvinceKeyFromText(text: string): ProvinceMapKey {
  if (!text) return 'all';
  const t = text.toLowerCase();
  if (t.includes('ยะลา') || t === 'yala') return 'yala';
  if (t.includes('ปัตตานี') || t === 'pattani') return 'pattani';
  if (t.includes('นราธิวาส') || t === 'narathiwat') return 'narathiwat';
  if (t.includes('เสี่ยงภัย') || t.includes('4 อำเภอ') || t === 'songkhla_risk') return 'songkhla_risk';
  if (t.includes('สงขลา') || t === 'songkhla' || t === 'songkhla_all') return 'songkhla';
  if (t.includes('ส่วนกลาง') || t.includes('บก.สส.') || t === 'central') return 'central';
  return 'all';
}

export const ProvinceMiniMap: React.FC<ProvinceMiniMapProps> = ({
  provinceKey,
  size = 'sm',
  className = '',
  active = false,
  showLabel = false,
  highlightColor,
  onClickMap,
  showIncidentBadge = true,
}) => {
  const normalizedKey = getProvinceKeyFromText(provinceKey);

  // Dimension presets (realistic GIS viewports)
  const dim = {
    xs: { w: 32, h: 32, stroke: 1.2, dot: 2 },
    sm: { w: 52, h: 52, stroke: 1.4, dot: 2.8 },
    md: { w: 76, h: 76, stroke: 1.6, dot: 3.5 },
    lg: { w: 98, h: 98, stroke: 1.8, dot: 4 },
  }[size];

  // Palette with realistic tactical satellite and elevation colors
  const palette = {
    yala: {
      terrainBase: '#0c2340',
      terrainHigh: '#1d4ed8',
      water: '#0284c7',
      stroke: '#38bdf8',
      name: 'จ.ยะลา',
      detail: 'เขื่อนบางลาง • บันนังสตา • เบตง',
      incidentCount: 3,
    },
    pattani: {
      terrainBase: '#0f172a',
      terrainHigh: '#2563eb',
      water: '#38bdf8',
      stroke: '#60a5fa',
      name: 'จ.ปัตตานี',
      detail: 'แหลมตาชี • ยะหริ่ง • หนองจิก',
      incidentCount: 3,
    },
    narathiwat: {
      terrainBase: '#261b0c',
      terrainHigh: '#b45309',
      water: '#0284c7',
      stroke: '#fbbf24',
      name: 'จ.นราธิวาส',
      detail: 'เทือกเขาบูโด • เจาะไอร้อง • โก-ลก',
      incidentCount: 3,
    },
    songkhla: {
      terrainBase: '#042f2e',
      terrainHigh: '#0f766e',
      water: '#38bdf8',
      stroke: '#2dd4bf',
      name: 'จ.สงขลา',
      detail: 'ทะเลสาบสงขลา • หาดใหญ่',
      incidentCount: 4,
    },
    songkhla_risk: {
      terrainBase: '#3f0c0c',
      terrainHigh: '#991b1b',
      water: '#38bdf8',
      stroke: '#f87171',
      name: '4 อ.เสี่ยงภัย สงขลา',
      detail: 'จะนะ • เทพา • นาทวี • สะบ้าย้อย',
      incidentCount: 4,
    },
    central: {
      terrainBase: '#18181b',
      terrainHigh: '#3f3f46',
      water: '#38bdf8',
      stroke: '#94a3b8',
      name: 'ส่วนกลาง ภ.9',
      detail: 'บช.ภ.9 • ศูนย์เรดาร์ CCOC',
      incidentCount: 14,
    },
    all: {
      terrainBase: '#090d16',
      terrainHigh: '#1e293b',
      water: '#0284c7',
      stroke: '#38bdf8',
      name: 'ภ.9 ทุกพื้นที่',
      detail: '4 จังหวัดชายแดนใต้',
      incidentCount: 14,
    },
  }[normalizedKey];

  const currentStroke = highlightColor || palette.stroke;

  // Ultra-Realistic SVG Cartography for Southern Thailand Provinces
  const renderSvgMap = () => {
    switch (normalizedKey) {
      case 'yala':
        // Yala: Real administrative silhouette, Bang Lang reservoir (เขื่อนบางลาง), Sankalakhiri mountain ridge, Betong southern protrusion
        return (
          <svg viewBox="0 0 100 100" width={dim.w} height={dim.h} className="overflow-visible">
            <defs>
              <linearGradient id="yalaTerrainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0c2340" />
                <stop offset="45%" stopColor="#1e3a8a" />
                <stop offset="85%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="yalaMountainGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#064e3b" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#15803d" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#022c22" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Tactical Coordinate Grid Overlay */}
            <circle cx="50" cy="50" r="48" fill="#020617" stroke="#1e293b" strokeWidth="1" />
            <line x1="50" y1="2" x2="50" y2="98" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
            <line x1="2" y1="50" x2="98" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />

            {/* Yala Province High-Precision Realistic Boundary */}
            <path
              d="M 48 8 
                 C 56 10, 66 16, 68 25 
                 C 70 34, 62 42, 66 50 
                 C 70 56, 73 66, 68 74 
                 C 64 80, 58 87, 52 95 
                 C 47 96, 42 93, 38 88 
                 C 32 80, 36 72, 34 64 
                 C 32 54, 26 48, 30 38 
                 C 33 28, 40 18, 44 12 
                 Z"
              fill="url(#yalaTerrainGrad)"
              stroke={currentStroke}
              strokeWidth={dim.stroke}
              strokeLinejoin="round"
            />

            {/* Mountain Elevation Layer: Sankalakhiri & Hala-Bala Mountain Spine */}
            <path
              d="M 45 20 C 50 32, 54 48, 48 65 C 44 76, 48 84, 46 90 C 42 85, 38 72, 40 60 C 42 46, 38 32, 45 20 Z"
              fill="url(#yalaMountainGrad)"
              opacity="0.7"
            />

            {/* Bang Lang Reservoir Water Body (เขื่อนบางลาง) */}
            <path
              d="M 46 52 C 50 50, 56 53, 54 58 C 50 62, 48 57, 46 52 Z"
              fill="#38bdf8"
              opacity="0.9"
            />

            {/* Highway 410 Corridor (ยะลา-บันนังสตา-ธารโต-เบตง) */}
            <path
              d="M 50 18 Q 48 38 52 50 T 48 86"
              fill="none"
              stroke="#facc15"
              strokeWidth="0.9"
              strokeDasharray="2 1.5"
              opacity="0.8"
            />

            {/* Pulsing Hotspot: Bannang Sata IED incident */}
            <circle cx="50" cy="44" r={dim.dot} fill="#ef4444" />
            <circle cx="50" cy="44" r={dim.dot * 2} fill="#ef4444" opacity="0.3" className="animate-ping" />

            {/* Capital Dot: Muang Yala */}
            <circle cx="50" cy="20" r={dim.dot * 0.9} fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" />
            {/* Betong southern border post */}
            <circle cx="48" cy="88" r={dim.dot * 0.9} fill="#38bdf8" stroke="#0f172a" strokeWidth="0.8" />
          </svg>
        );

      case 'pattani':
        // Pattani: Coastal curve, Laem Tachi sandspit, Ao Pattani, Pattani River delta
        return (
          <svg viewBox="0 0 100 100" width={dim.w} height={dim.h} className="overflow-visible">
            <defs>
              <linearGradient id="pattaniSeaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0369a1" />
                <stop offset="100%" stopColor="#0c4a6e" />
              </linearGradient>
              <linearGradient id="pattaniLandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
            </defs>

            <circle cx="50" cy="50" r="48" fill="#020617" stroke="#1e293b" strokeWidth="1" />

            {/* Gulf of Thailand Ocean Blue Backdrop (North) */}
            <path
              d="M 10 18 Q 40 12 70 18 Q 85 24 92 35 L 92 50 L 10 50 Z"
              fill="url(#pattaniSeaGrad)"
              opacity="0.45"
            />
            {/* Oceanic Depth Contours */}
            <path d="M 14 26 Q 50 18 86 28" fill="none" stroke="#38bdf8" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.4" />

            {/* Laem Tachi Spit (แหลมตาชี & อ่าวปัตตานี) */}
            <path
              d="M 42 28 C 52 18, 68 16, 78 22 C 72 26, 60 28, 48 30 Z"
              fill="#93c5fd"
              stroke="#60a5fa"
              strokeWidth="0.8"
            />

            {/* Pattani Main Provincial Land Silhouette */}
            <path
              d="M 16 42 
                 C 26 34, 42 32, 54 34 
                 C 66 35, 78 39, 88 46 
                 C 90 56, 82 66, 74 72 
                 C 62 78, 46 76, 36 74 
                 C 26 72, 18 64, 14 54 
                 Z"
              fill="url(#pattaniLandGrad)"
              stroke={currentStroke}
              strokeWidth={dim.stroke}
              strokeLinejoin="round"
            />

            {/* Pattani River Blue Line (แม่น้ำปัตตานี) */}
            <path
              d="M 44 74 Q 48 55 46 36"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.2"
              opacity="0.85"
            />

            {/* Pulsing Hotspot: Yaring checkpoint / attack site */}
            <circle cx="64" cy="46" r={dim.dot} fill="#ef4444" />
            <circle cx="64" cy="46" r={dim.dot * 2} fill="#ef4444" opacity="0.3" className="animate-ping" />

            {/* City Dot: Muang Pattani */}
            <circle cx="44" cy="38" r={dim.dot * 0.9} fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" />
            {/* Saiburi Coastal Point */}
            <circle cx="78" cy="54" r={dim.dot * 0.8} fill="#facc15" stroke="#0f172a" strokeWidth="0.8" />
          </svg>
        );

      case 'narathiwat':
        // Narathiwat: Budo mountain range in west, coastline on east, Sungai Kolok river border
        return (
          <svg viewBox="0 0 100 100" width={dim.w} height={dim.h} className="overflow-visible">
            <defs>
              <linearGradient id="naraTerrain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#451a03" />
                <stop offset="50%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>

            <circle cx="50" cy="50" r="48" fill="#020617" stroke="#1e293b" strokeWidth="1" />

            {/* Ocean Coastline on East (ทะเลอ่าวไทย) */}
            <path
              d="M 60 16 Q 74 36 86 64 L 95 64 L 95 16 Z"
              fill="#0369a1"
              opacity="0.4"
            />

            {/* Narathiwat Provincial Body Silhouette */}
            <path
              d="M 38 18 
                 C 48 16, 62 22, 68 32 
                 C 76 44, 82 58, 84 72 
                 C 74 80, 60 84, 48 86 
                 C 38 86, 28 78, 24 66 
                 C 20 54, 22 42, 26 32 
                 Z"
              fill="url(#naraTerrain)"
              stroke={currentStroke}
              strokeWidth={dim.stroke}
              strokeLinejoin="round"
            />

            {/* Budo - Su-ngai Padi Mountain Range (เทือกเขาบูโด-สุไหงปาดี) */}
            <path
              d="M 30 30 C 35 45, 34 60, 42 75 C 38 72, 30 60, 28 45 Z"
              fill="#14532d"
              opacity="0.75"
            />

            {/* Sungai Kolok Border River Line */}
            <path
              d="M 84 72 Q 78 80 62 84"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.2"
              opacity="0.8"
            />

            {/* Pulsing Hotspot: Muang Narathiwat police flats car bomb site */}
            <circle cx="64" cy="30" r={dim.dot} fill="#ef4444" />
            <circle cx="64" cy="30" r={dim.dot * 2} fill="#ef4444" opacity="0.3" className="animate-ping" />

            {/* Cho-airong Railway Hotspot */}
            <circle cx="52" cy="54" r={dim.dot * 0.9} fill="#f97316" />

            {/* Sungai Kolok Border Point */}
            <circle cx="76" cy="70" r={dim.dot * 0.9} fill="#facc15" stroke="#0f172a" strokeWidth="0.8" />
          </svg>
        );

      case 'songkhla_risk':
      case 'songkhla':
        // Songkhla: Songkhla Lake (ทะเลสาบสงขลา) in north, Hat Yai, Na Thap canal, 4 Southern Risk Districts (จะนะ เทพา นาทวี สะบ้าย้อย)
        return (
          <svg viewBox="0 0 100 100" width={dim.w} height={dim.h} className="overflow-visible">
            <defs>
              <linearGradient id="skhRiskTerrain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#450a0a" />
                <stop offset="60%" stopColor="#7f1d1d" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
              <linearGradient id="skhNormTerrain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#042f2e" />
                <stop offset="60%" stopColor="#0f766e" />
                <stop offset="100%" stopColor="#0d9488" />
              </linearGradient>
            </defs>

            <circle cx="50" cy="50" r="48" fill="#020617" stroke="#1e293b" strokeWidth="1" />

            {/* Songkhla Lake Basin (ทะเลสาบสงขลา & เกาะยอ) */}
            <path
              d="M 34 10 C 44 14, 52 24, 46 34 C 40 30, 34 22, 34 10 Z"
              fill="#0284c7"
              opacity="0.85"
              stroke="#38bdf8"
              strokeWidth="0.8"
            />

            {/* Songkhla Province Full Silhouette */}
            <path
              d="M 26 26 
                 C 38 22, 54 24, 64 32 
                 C 74 42, 78 56, 80 72 
                 C 70 78, 56 82, 44 84 
                 C 30 84, 22 74, 18 60 
                 C 16 46, 20 34, 26 26 
                 Z"
              fill={normalizedKey === 'songkhla_risk' ? 'url(#skhRiskTerrain)' : 'url(#skhNormTerrain)'}
              stroke={currentStroke}
              strokeWidth={dim.stroke}
              strokeLinejoin="round"
            />

            {/* Highlighted 4 Security Risk Districts (Chana, Thepha, Na Thawi, Saba Yoi) */}
            <path
              d="M 46 54 C 58 52, 68 56, 78 68 C 70 76, 56 82, 46 83 C 42 74, 44 62, 46 54 Z"
              fill="#dc2626"
              fillOpacity={normalizedKey === 'songkhla_risk' ? '0.95' : '0.45'}
              stroke="#fca5a5"
              strokeWidth={1}
            />

            {/* Highway 43 / 42 Arteries */}
            <path
              d="M 44 38 Q 54 52 74 62"
              fill="none"
              stroke="#facc15"
              strokeWidth="1"
              strokeDasharray="2 1.5"
              opacity="0.9"
            />

            {/* Pulsing Hotspot: Chana Na Thap Bridge blast site */}
            <circle cx="54" cy="58" r={dim.dot} fill="#facc15" />
            <circle cx="54" cy="58" r={dim.dot * 2} fill="#ef4444" opacity="0.4" className="animate-ping" />

            {/* Na Thawi & Saba Yoi Hotspot */}
            <circle cx="62" cy="70" r={dim.dot * 0.9} fill="#ef4444" />

            {/* Hat Yai Urban Center */}
            <circle cx="44" cy="40" r={dim.dot * 0.9} fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" />
          </svg>
        );

      case 'central':
      case 'all':
      default:
        // Regional Combined 4 Deep South Provinces with Rotating Tactical Radar Sweep
        return (
          <svg viewBox="0 0 100 100" width={dim.w} height={dim.h} className="overflow-visible">
            <defs>
              <radialGradient id="radarSweepGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </radialGradient>
            </defs>

            <circle cx="50" cy="50" r="48" fill="#020617" stroke="#1e293b" strokeWidth="1" />
            <circle cx="50" cy="50" r="36" fill="none" stroke="#334155" strokeWidth="0.8" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="22" fill="none" stroke="#475569" strokeWidth="0.8" />
            <line x1="8" y1="50" x2="92" y2="50" stroke="#334155" strokeWidth="0.6" opacity="0.6" />
            <line x1="50" y1="8" x2="50" y2="92" stroke="#334155" strokeWidth="0.6" opacity="0.6" />

            {/* Deep South Combined 4 Provinces Silhouette */}
            {/* Songkhla Sector */}
            <path
              d="M 22 28 C 34 22, 44 26, 48 34 C 44 46, 36 54, 28 54 C 20 46, 18 36, 22 28 Z"
              fill="#0f766e"
              fillOpacity="0.85"
              stroke="#2dd4bf"
              strokeWidth="0.8"
            />
            {/* Pattani Sector */}
            <path
              d="M 48 34 C 58 28, 68 30, 78 38 C 72 45, 62 48, 54 46 C 48 44, 46 38, 48 34 Z"
              fill="#1d4ed8"
              fillOpacity="0.85"
              stroke="#60a5fa"
              strokeWidth="0.8"
            />
            {/* Yala Sector */}
            <path
              d="M 38 52 C 48 48, 56 50, 56 62 C 54 74, 48 86, 42 92 C 36 84, 34 72, 34 62 C 34 56, 36 54, 38 52 Z"
              fill="#0369a1"
              fillOpacity="0.85"
              stroke="#38bdf8"
              strokeWidth="0.8"
            />
            {/* Narathiwat Sector */}
            <path
              d="M 58 46 C 66 44, 76 50, 82 62 C 76 74, 68 82, 58 84 C 54 74, 56 62, 58 46 Z"
              fill="#b45309"
              fillOpacity="0.85"
              stroke="#fbbf24"
              strokeWidth="0.8"
            />

            {/* Pulsing Incident Red Pins */}
            <circle cx="48" cy="62" r={dim.dot * 0.8} fill="#ef4444" className="animate-ping" />
            <circle cx="64" cy="40" r={dim.dot * 0.8} fill="#ef4444" />
            <circle cx="70" cy="62" r={dim.dot * 0.8} fill="#ef4444" />
            <circle cx="44" cy="44" r={dim.dot * 0.8} fill="#facc15" />
          </svg>
        );
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (onClickMap) {
      e.stopPropagation();
      onClickMap(normalizedKey);
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className={`inline-flex items-center gap-1.5 select-none ${
        onClickMap ? 'cursor-pointer group' : ''
      } ${className}`}
      title={`${palette.name} - คลิกเพื่อดูภาพ & ข้อมูลเหตุการณ์ก่อการร้าย`}
    >
      <div
        className={`relative flex items-center justify-center rounded-xl p-1 transition-all duration-200 ${
          active
            ? 'ring-2 ring-red-500 shadow-lg shadow-red-500/25 bg-slate-950'
            : 'bg-slate-950 hover:bg-slate-900 border border-slate-700/80 hover:border-red-500/60 shadow-md group-hover:scale-105'
        }`}
      >
        {/* Render Realistic Topographic Map */}
        {renderSvgMap()}

        {/* Threat Incident Flame / Siren Badge Overlay */}
        {showIncidentBadge && (
          <div
            className="absolute -top-1.5 -right-1.5 bg-red-600 hover:bg-red-500 text-white p-0.5 rounded-full shadow-md border border-white/50 flex items-center justify-center transition-transform group-hover:scale-110"
            title="มีบันทึกเหตุการณ์ก่อการร้าย (คลิกดูภาพ)"
          >
            <Flame className="w-2.5 h-2.5 text-amber-200 fill-amber-300 animate-pulse" />
          </div>
        )}

        {/* Hover Crosshair Overlay */}
        <div className="absolute inset-0 rounded-xl bg-red-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <Crosshair className="w-4 h-4 text-red-400/80 animate-pulse" />
        </div>
      </div>

      {showLabel && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold font-['Prompt'] text-slate-800 leading-tight group-hover:text-red-600 transition-colors">
              {palette.name}
            </span>
            <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded-full font-mono">
              🚨 {palette.incidentCount} เหตุการณ์
            </span>
          </div>
          <span className="text-[10px] text-slate-500 leading-tight truncate max-w-[130px]">
            {palette.detail}
          </span>
        </div>
      )}
    </div>
  );
};
