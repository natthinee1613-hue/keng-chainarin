import React, { useState } from 'react';
import { 
  Shield, 
  MapPin, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  Eye, 
  Activity,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { PoliceUnitRecord, ZoneId } from '../types';

interface DigitalProvinceHUDProps {
  records: PoliceUnitRecord[];
  onSelectProvince?: (zoneId: ZoneId) => void;
}

interface ProvinceHUDConfig {
  id: ZoneId;
  nameTh: string;
  nameEn: string;
  checkText: string;
  ratioText: string;
  tableText: string;
  landscapeDescription: string;
  landscapeType: 'mountain' | 'river' | 'coast-wetland' | 'coast-lake';
  accentColor: string;
  glowColor: string;
  pinCoord: { x: number; y: number };
}

const PROVINCE_CONFIGS: ProvinceHUDConfig[] = [
  {
    id: 'yala',
    nameTh: 'ยะลา',
    nameEn: 'Yala',
    checkText: 'Population Data Check ยะลา (Thai language)',
    ratioText: '[5955 / 4832]',
    tableText: 'Population Status Table ยะลา',
    landscapeDescription: 'ภูเขาป่าไม้และทิวเขาสันกาลาคีรี (Forested Mountains)',
    landscapeType: 'mountain',
    accentColor: '#10b981', // Emerald green
    glowColor: 'rgba(16, 185, 129, 0.4)',
    pinCoord: { x: 50, y: 46 }
  },
  {
    id: 'pattani',
    nameTh: 'ปัตตานี',
    nameEn: 'Pattani',
    checkText: 'Population Data Check ปัตตานี (Thai language)',
    ratioText: '[111 / 4429]',
    tableText: 'Population Status Table ปัตตานี',
    landscapeDescription: 'แม่น้ำปัตตานีและพื้นที่ลุ่มน้ำอุดมสมบูรณ์ (Rivers & Wetlands)',
    landscapeType: 'river',
    accentColor: '#06b6d4', // Cyan
    glowColor: 'rgba(6, 182, 212, 0.4)',
    pinCoord: { x: 48, y: 42 }
  },
  {
    id: 'narathiwat',
    nameTh: 'นราธิวาส',
    nameEn: 'Narathiwat',
    checkText: 'Population Data Check นราธิวาส (Thai language)',
    ratioText: '[8017723 5 / 7104]',
    tableText: 'Population Status Table นราธิวาส',
    landscapeDescription: 'ชายฝั่งอ่าวไทยและพื้นที่ลุ่มน้ำป่าพรุ (Coastline & Peat Swamp Wetlands)',
    landscapeType: 'coast-wetland',
    accentColor: '#3b82f6', // Ocean Blue
    glowColor: 'rgba(59, 130, 246, 0.4)',
    pinCoord: { x: 52, y: 48 }
  },
  {
    id: 'songkhla_risk',
    nameTh: 'สงขลา',
    nameEn: 'Songkhla',
    checkText: 'Population Data Check สงขลา (Thai language)',
    ratioText: '[549114 / 39344]',
    tableText: 'Population Status Table สงขลา',
    landscapeDescription: 'ชายฝั่งทะเลและทะเลสาบสงขลา (Coastline & Lagoon Lake)',
    landscapeType: 'coast-lake',
    accentColor: '#f59e0b', // Amber / Gold
    glowColor: 'rgba(245, 158, 11, 0.4)',
    pinCoord: { x: 46, y: 44 }
  }
];

export const DigitalProvinceHUD: React.FC<DigitalProvinceHUDProps> = ({
  records,
  onSelectProvince
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);

  // Calculate live stats for verification and comparison
  const getLiveStats = (zone: ZoneId) => {
    let list: PoliceUnitRecord[] = [];
    if (zone === 'yala') {
      list = records.filter(r => r.group.includes('ยะลา'));
    } else if (zone === 'pattani') {
      list = records.filter(r => r.group.includes('ปัตตานี'));
    } else if (zone === 'narathiwat') {
      list = records.filter(r => r.group.includes('นราธิวาส'));
    } else if (zone === 'songkhla_risk' || zone === 'songkhla_all') {
      list = records.filter(r => r.group.includes('สงขลา'));
    }
    const pos = list.reduce((acc, r) => acc + (r.totalAll_pos || 0), 0);
    const occ = list.reduce((acc, r) => acc + (r.totalAll_occ || 0), 0);
    return { units: list.length, pos, occ };
  };

  return (
    <div className="relative w-full mb-6">
      {/* Container with Brushed Gold Metallic Wall and Illuminated Vertical Light Columns */}
      <div className="brushed-gold-wall rounded-3xl p-4 sm:p-7 shadow-2xl border border-amber-500/40 relative">
        {/* Sleek Illuminated Vertical Columns in the Background */}
        <div className="illuminated-column left-[4%] opacity-80" />
        <div className="illuminated-column left-[28%] opacity-60 hidden md:block" />
        <div className="illuminated-column left-[52%] opacity-60 hidden md:block" />
        <div className="illuminated-column left-[76%] opacity-60 hidden md:block" />
        <div className="illuminated-column right-[4%] opacity-80" />

        {/* Ambient Top Light Beam Effect */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-80 shadow-[0_0_15px_rgba(251,191,36,0.8)]" />

        {/* Header Ribbon / Status Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-widest text-amber-300 uppercase font-mono">
                  EXECUTIVE DIGITAL HUD SYSTEM
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ONLINE • 4 PROVINCES
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Prompt'] tracking-wide">
                แผงแสดงผลข้อมูลดิจิทัล 4 จังหวัดภาคใต้ (Digital Information Panels)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-amber-500/30 text-amber-200 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
              title={isExpanded ? 'ย่อแผงข้อมูล' : 'ขยายแผงข้อมูล'}
            >
              {isExpanded ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>ย่อแสดงผล</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>ขยายเต็มแผง</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Modern Digital Display Panels Arranged Horizontally */}
        {isExpanded && (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
            {PROVINCE_CONFIGS.map((prov) => {
              const live = getLiveStats(prov.id);
              const isHovered = activeHoverId === prov.id;

              return (
                <div
                  key={prov.id}
                  onMouseEnter={() => setActiveHoverId(prov.id)}
                  onMouseLeave={() => setActiveHoverId(null)}
                  onClick={() => onSelectProvince && onSelectProvince(prov.id)}
                  className={`digital-hud-glass rounded-2xl p-4 sm:p-5 flex flex-col justify-between cursor-pointer relative overflow-hidden group select-none ${
                    isHovered ? 'ring-2 ring-amber-400/80' : ''
                  }`}
                  style={{
                    boxShadow: isHovered
                      ? `0 14px 45px -8px ${prov.glowColor}, 0 0 20px rgba(245, 158, 11, 0.4)`
                      : undefined
                  }}
                >
                  {/* Subtle Tech Grid Background */}
                  <div 
                    className="absolute inset-0 opacity-[0.07] pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
                      backgroundSize: '16px 16px'
                    }}
                  />

                  {/* Corner Accent Tech Marks */}
                  <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-amber-400/60 pointer-events-none" />
                  <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-amber-400/60 pointer-events-none" />
                  <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-amber-400/60 pointer-events-none" />
                  <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-amber-400/60 pointer-events-none" />

                  {/* Top Section: Province Titles & 3D Miniature Model Map */}
                  <div className="flex items-start justify-between gap-2 relative">
                    {/* Left: Province Thai & English Names */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        <span className="text-[10px] font-mono tracking-wider text-amber-300 font-semibold uppercase">
                          SOUTHERN THAILAND
                        </span>
                      </div>

                      {/* Province Name in Modern White Thai Typography */}
                      <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide font-['Prompt'] drop-shadow-[0_2px_10px_rgba(255,255,255,0.25)]">
                        {prov.nameTh}
                      </h4>

                      {/* Province in English */}
                      <div className="text-xs sm:text-sm font-semibold tracking-wider text-amber-200/90 font-mono">
                        {prov.nameEn}
                      </div>
                    </div>

                    {/* Right: Miniature 3D Landscape Relief Model with Red Location Pin */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                      {/* 3D Isometric Base Container */}
                      <div className="w-full h-full rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 p-1.5 shadow-xl border border-slate-700/80 relative overflow-hidden group-hover:border-amber-400/60 transition-colors">
                        {/* Render 3D Natural Landscape based on Province */}
                        <LandscapeModelSVG type={prov.landscapeType} />

                        {/* Miniature 3D Red Location Pin with Pulse Radar */}
                        <div
                          className="absolute pointer-events-none z-20"
                          style={{
                            left: `${prov.pinCoord.x}%`,
                            top: `${prov.pinCoord.y}%`,
                            transform: 'translate(-50%, -100%)'
                          }}
                        >
                          {/* Radar wave */}
                          <div className="absolute -bottom-1 -left-2 w-5 h-2 rounded-[50%] bg-red-500/40 pin-radar-ring" />
                          {/* Pin drop shadow */}
                          <div className="absolute -bottom-0.5 left-0.5 w-2 h-1 bg-black/60 rounded-full blur-[0.5px]" />
                          {/* 3D Pin Icon */}
                          <div className="pin-marker-pulse flex flex-col items-center">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-b from-red-400 via-red-600 to-rose-800 border border-white/80 shadow-md flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                            </div>
                            <div className="w-0.5 h-1.5 bg-red-700 -mt-0.5" />
                          </div>
                        </div>

                        {/* Top-corner 3D badge */}
                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[8px] font-mono text-slate-300 border border-white/10">
                          3D RELIEF
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Section: Details, Population Check, and Numeric Figures */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                    {/* Landscape Description Badge */}
                    <div className="text-[11px] text-slate-300 font-medium flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-700/50">
                      <Layers className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <span className="truncate">{prov.landscapeDescription}</span>
                    </div>

                    {/* Population Data Check [Province Name] (Thai language) */}
                    <div className="space-y-0.5">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                        {prov.checkText}
                      </div>
                      <div className="text-[11px] text-amber-300 font-medium">
                        ตรวจสอบข้อมูลสถานภาพประชากร {prov.nameTh}
                      </div>
                    </div>

                    {/* Big Digital Ratio Number: e.g. [5955 / 4832] */}
                    <div className="bg-slate-950/90 rounded-xl p-2.5 border border-amber-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-amber-400" />
                        <div>
                          <div className="text-[9px] text-slate-400 font-mono">POPULATION RATIO</div>
                          <div className="text-lg sm:text-xl font-bold font-mono text-amber-200 tracking-wider">
                            {prov.ratioText}
                          </div>
                        </div>
                      </div>

                      {/* Official Live Police Units Stat Badge */}
                      <div className="text-right pl-2 border-l border-slate-800">
                        <div className="text-[9px] text-slate-400">จนท.ครองจริง</div>
                        <div className="text-xs font-mono font-bold text-emerald-400">
                          {live.occ.toLocaleString()} นาย
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section: Logo & Population Status Table [Province Name] */}
                  <div className="mt-4 pt-2.5 border-t border-amber-500/20 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {/* Small Golden Police Shield Emblem / Logo */}
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-0.5 flex items-center justify-center shadow-sm">
                        <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                          <Shield className="w-3.5 h-3.5 text-amber-300" />
                        </div>
                      </div>

                      {/* Population Status Table [Province Name] */}
                      <div className="text-slate-200 font-medium text-[11px] font-['Prompt']">
                        {prov.tableText}
                      </div>
                    </div>

                    <div className="text-amber-400 group-hover:translate-x-1 transition-transform">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Sub-text showing luxury uniform illumination note */}
        <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-amber-500/10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>ผนังโลหะขัดเงาสีทองระดับไฮเอนด์ (Brushed Gold Finish) พร้อมเสาแนวตั้งส่องสว่างนุ่มนวลสม่ำเสมอ</span>
          </div>
          <div className="text-amber-300/80 font-mono text-[10px]">
            * คลิกที่แต่ละแผงเพื่อกรองตารางข้อมูลกำลังพลของจังหวัดนั้นทันที
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 3D Isometric Landscape Miniature Models:
 * - Yala: Lush forested mountains (ภูเขาป่าไม้)
 * - Pattani: Meandering river deltas & wetlands (แม่น้ำและพื้นที่ลุ่มน้ำ)
 * - Narathiwat: Ocean coastlines & peat swamp wetlands (ชายฝั่งและพื้นที่ลุ่มน้ำป่าพรุ)
 * - Songkhla: Coastline & Songkhla Lake lagoon (ชายฝั่งและทะเลสาบ)
 */
const LandscapeModelSVG: React.FC<{
  type: 'mountain' | 'river' | 'coast-wetland' | 'coast-lake';
}> = ({ type }) => {
  if (type === 'mountain') {
    // Yala: ภูเขาป่าไม้
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full rounded-xl">
        <defs>
          <linearGradient id="yalaSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f291e" />
            <stop offset="100%" stopColor="#1e3a2b" />
          </linearGradient>
          <linearGradient id="yalaMtn1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
          <linearGradient id="yalaMtn2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="yalaValley" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>
        </defs>

        {/* Sky / Misty Canopy Background */}
        <rect width="100" height="100" fill="url(#yalaSky)" />

        {/* Mountain Range Back */}
        <polygon points="10,60 30,28 50,55 75,22 95,65" fill="#044e39" opacity="0.8" />
        <polygon points="30,28 35,40 25,48" fill="#10b981" opacity="0.5" />
        <polygon points="75,22 80,36 68,45" fill="#34d399" opacity="0.4" />

        {/* Mid Mountain Ridges */}
        <polygon points="0,75 25,40 55,78 70,45 100,75" fill="url(#yalaMtn1)" />
        <polygon points="25,40 32,55 20,62" fill="#6ee7b7" opacity="0.6" />

        {/* Foreground Forest Hills */}
        <path d="M-10,85 Q20,55 50,72 T110,80 L110,100 L-10,100 Z" fill="url(#yalaMtn2)" />

        {/* Forest canopy trees silhouettes */}
        <circle cx="18" cy="70" r="4" fill="#022c22" />
        <circle cx="25" cy="68" r="5" fill="#064e3b" />
        <circle cx="34" cy="72" r="4.5" fill="#047857" />
        <circle cx="65" cy="74" r="5" fill="#022c22" />
        <circle cx="75" cy="70" r="4" fill="#065f46" />
        <circle cx="85" cy="76" r="4.5" fill="#047857" />

        {/* Lowland Basin (Yala City Center) */}
        <ellipse cx="50" cy="88" rx="35" ry="10" fill="url(#yalaValley)" />
      </svg>
    );
  }

  if (type === 'river') {
    // Pattani: แม่น้ำและพื้นที่ลุ่มน้ำ
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full rounded-xl">
        <defs>
          <linearGradient id="pattaniPlain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14532d" />
            <stop offset="50%" stopColor="#166534" />
            <stop offset="100%" stopColor="#0f3e22" />
          </linearGradient>
          <linearGradient id="pattaniWater" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <linearGradient id="pattaniEstuary" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>
        </defs>

        {/* Fertile Floodplain Background */}
        <rect width="100" height="100" fill="url(#pattaniPlain)" />

        {/* Sea / Gulf of Thailand Top Strip */}
        <path d="M0,0 L100,0 L100,22 Q50,28 0,18 Z" fill="url(#pattaniEstuary)" />

        {/* Meandering Pattani Main River Basin */}
        <path
          d="M 48,20 Q 35,35 60,48 T 42,72 T 55,100"
          fill="none"
          stroke="url(#pattaniWater)"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* Tributary Sai Buri River */}
        <path
          d="M 60,48 Q 78,55 90,68 T 100,75"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Wetland floodplains and mangrove patches */}
        <ellipse cx="25" cy="45" rx="14" ry="7" fill="#047857" opacity="0.7" />
        <ellipse cx="78" cy="38" rx="12" ry="6" fill="#059669" opacity="0.6" />
        <ellipse cx="30" cy="80" rx="16" ry="8" fill="#15803d" opacity="0.8" />
        <ellipse cx="75" cy="85" rx="14" ry="7" fill="#166534" opacity="0.7" />

        {/* Water ripples */}
        <path d="M 44,28 Q 50,30 56,28" stroke="#bae6fd" strokeWidth="1.5" fill="none" opacity="0.8" />
        <path d="M 52,58 Q 58,60 64,58" stroke="#bae6fd" strokeWidth="1.5" fill="none" opacity="0.8" />
      </svg>
    );
  }

  if (type === 'coast-wetland') {
    // Narathiwat: ชายฝั่งและพื้นที่ลุ่มน้ำ (ป่าพรุโต๊ะแดง)
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full rounded-xl">
        <defs>
          <linearGradient id="naraCoast" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <linearGradient id="naraPeatSwamp" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e3a1e" />
            <stop offset="50%" stopColor="#2d4a22" />
            <stop offset="100%" stopColor="#142914" />
          </linearGradient>
          <linearGradient id="naraBeach" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
        </defs>

        {/* Ocean Coastline on the Right */}
        <rect width="100" height="100" fill="url(#naraCoast)" />

        {/* Coastal Surf Foam Waves */}
        <path d="M 58,0 Q 64,30 52,60 T 66,100 L 100,100 L 100,0 Z" fill="#0284c7" />
        <path d="M 55,0 Q 61,30 49,60 T 63,100" stroke="#ffffff" strokeWidth="2.5" fill="none" opacity="0.75" />

        {/* Golden Sandy Beach Strip */}
        <path d="M 52,0 Q 58,30 46,60 T 60,100 L 44,100 Q 30,60 42,30 T 36,0 Z" fill="url(#naraBeach)" />

        {/* Peat Swamp Wetlands (ป่าพรุสิรินธร) on the Left */}
        <path d="M 0,0 L 40,0 Q 32,30 44,60 T 38,100 L 0,100 Z" fill="url(#naraPeatSwamp)" />

        {/* Bang Nara River & Swamp Creeks */}
        <path d="M 48,15 Q 25,25 15,45 T 35,75 T 52,85" stroke="#38bdf8" strokeWidth="4" fill="none" strokeLinecap="round" />

        {/* Peat swamp vegetation clusters */}
        <circle cx="15" cy="20" r="5" fill="#14532d" />
        <circle cx="24" cy="35" r="6" fill="#166534" />
        <circle cx="12" cy="65" r="5.5" fill="#14532d" />
        <circle cx="26" cy="85" r="6" fill="#15803d" />
      </svg>
    );
  }

  // Songkhla: ชายฝั่งและทะเลสาบสงขลา
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full rounded-xl">
      <defs>
        <linearGradient id="songkhlaSea" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#0c4a6e" />
        </linearGradient>
        <linearGradient id="songkhlaLake" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="songkhlaLand" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
      </defs>

      {/* Gulf of Thailand Open Sea on Right */}
      <rect width="100" height="100" fill="url(#songkhlaSea)" />

      {/* Main Land Mass on Left */}
      <path d="M 0,0 L 50,0 Q 42,40 52,70 T 40,100 L 0,100 Z" fill="url(#songkhlaLand)" />

      {/* Songkhla Lake (ทะเลสาบสงขลา) Lagoon Basin */}
      <path
        d="M 12,10 Q 34,25 22,50 T 36,80 T 15,90 Z"
        fill="url(#songkhlaLake)"
      />

      {/* Satingpra Peninsula barrier between Lake and Gulf */}
      <path
        d="M 40,8 Q 48,32 38,58 T 46,88 L 52,88 Q 44,58 54,32 T 46,8 Z"
        fill="#ca8a04"
      />

      {/* Lake water highlights and Ko Yo island */}
      <ellipse cx="24" cy="46" rx="4" ry="2.5" fill="#15803d" />
      <path d="M 18,28 Q 24,30 30,28" stroke="#bae6fd" strokeWidth="1" fill="none" opacity="0.8" />
      <path d="M 22,68 Q 28,70 34,68" stroke="#bae6fd" strokeWidth="1" fill="none" opacity="0.8" />

      {/* Coastal waves in Gulf */}
      <path d="M 70,25 Q 75,27 80,25" stroke="#bae6fd" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M 65,60 Q 72,63 78,60" stroke="#bae6fd" strokeWidth="1.5" fill="none" opacity="0.6" />
    </svg>
  );
};
