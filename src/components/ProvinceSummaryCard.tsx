import React from 'react';
import { Province3DMiniMap } from './Province3DMiniMap';
import { TableProperties } from 'lucide-react';
import { ZoneId } from '../types';

interface ProvinceSummaryCardProps {
  provinceKey: 'yala' | 'pattani' | 'narathiwat' | 'songkhla';
  zoneId: ZoneId;
  title: string;
  badgeTitle?: string;
  subtitle: string;
  posCount?: number;
  occCount?: number;
  onNavigate?: (zone: ZoneId) => void;
}

const PROVINCE_THEMES = {
  yala: {
    // Official Police Khaki Gold (สีกากีทองตำรวจ)
    outerBg: 'bg-gradient-to-br from-[#6b4c2b] via-[#543b21] to-[#3d2a17]',
    outerBorder: 'border-[#b88c54]/70',
    innerBorder: 'border-[#8c6738]/40',
    badgeBg: 'bg-[#b88c54]/20',
    badgeBorder: 'border-[#b88c54]/50',
    badgeText: 'text-[#faebd7]',
    buttonBorder: 'border-[#b88c54]/50 hover:border-[#d4a86e]',
    glowColor: 'rgba(184, 140, 84, 0.25)',
    accentBg: 'bg-[#b88c54]',
  },
  pattani: {
    // Official Police Deep Navy (สีกรมท่าตำรวจภูธร)
    outerBg: 'bg-gradient-to-br from-[#1b3456] via-[#142640] to-[#0e1b2e]',
    outerBorder: 'border-[#4a7bb5]/70',
    innerBorder: 'border-[#2d507d]/40',
    badgeBg: 'bg-[#3b6ea8]/20',
    badgeBorder: 'border-[#4a7bb5]/50',
    badgeText: 'text-[#e0edfb]',
    buttonBorder: 'border-[#4a7bb5]/50 hover:border-[#6fa4e3]',
    glowColor: 'rgba(74, 123, 181, 0.25)',
    accentBg: 'bg-[#3b6ea8]',
  },
  narathiwat: {
    // Official Police Field Olive (สีเขียวมะกอกพิทักษ์สันติราษฎร์)
    outerBg: 'bg-gradient-to-br from-[#24422e] via-[#1a3122] to-[#122318]',
    outerBorder: 'border-[#558e69]/70',
    innerBorder: 'border-[#365e44]/40',
    badgeBg: 'bg-[#407352]/20',
    badgeBorder: 'border-[#558e69]/50',
    badgeText: 'text-[#e1f3e7]',
    buttonBorder: 'border-[#558e69]/50 hover:border-[#74b58c]',
    glowColor: 'rgba(85, 142, 105, 0.25)',
    accentBg: 'bg-[#407352]',
  },
  songkhla: {
    // Official Royal Thai Police Maroon (สีเลือดหมูประจำสำนักงานตำรวจแห่งชาติ)
    outerBg: 'bg-gradient-to-br from-[#5c131a] via-[#480d13] to-[#33080d]',
    outerBorder: 'border-[#ad3843]/70',
    innerBorder: 'border-[#752129]/40',
    badgeBg: 'bg-[#8f2731]/20',
    badgeBorder: 'border-[#ad3843]/50',
    badgeText: 'text-[#fce8ea]',
    buttonBorder: 'border-[#ad3843]/50 hover:border-[#cf4c58]',
    glowColor: 'rgba(173, 56, 67, 0.25)',
    accentBg: 'bg-[#8f2731]',
  },
};

export const ProvinceSummaryCard: React.FC<ProvinceSummaryCardProps> = ({
  provinceKey,
  zoneId,
  title,
  badgeTitle,
  subtitle,
  posCount,
  occCount,
  onNavigate,
}) => {
  const theme = PROVINCE_THEMES[provinceKey];

  return (
    <div
      className={`w-full ${theme.outerBg} p-2 rounded-2xl border ${theme.outerBorder} shadow-lg transition-all duration-300 hover:shadow-xl`}
      style={{
        boxShadow: `0 8px 24px -4px ${theme.glowColor}`,
      }}
    >
      {/* Inner Card (Royal Thai Police Official Command Center Plaque) */}
      <div className={`relative bg-[#0d1624] rounded-xl border ${theme.innerBorder} p-3.5 flex flex-col justify-between overflow-hidden shadow-inner`}>
        {/* Subtle royal police gradient sheen */}
        <div className={`absolute top-0 right-0 w-28 h-28 rounded-full filter blur-2xl opacity-15 pointer-events-none ${theme.accentBg}`} />

        {/* Upper row: Left Typography & Right 3D MiniMap */}
        <div className="flex items-start justify-between gap-1 relative z-10">
          {/* Left info */}
          <div className="flex-1 pr-1 flex flex-col justify-center pt-1">
            <h3 className="text-2xl sm:text-3xl font-bold font-['Prompt'] text-[#faebd7] tracking-normal leading-tight drop-shadow-md">
              {title}
            </h3>
            <div className="text-[11px] text-stone-300 font-medium mt-1 tracking-tight flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${theme.accentBg}`} />
              <span>{subtitle}</span>
            </div>
          </div>

          {/* Right 3D MiniMap with realistic elevation & threat pins */}
          <div className="flex-shrink-0 -mr-1 -mt-1">
            <Province3DMiniMap provinceKey={provinceKey} />
          </div>
        </div>

        {/* Bottom Button (ตารางสถานภาพประชากร ...) */}
        <div className="mt-3 relative z-10">
          <button
            onClick={() => onNavigate && onNavigate(zoneId)}
            className={`w-full bg-[#131d2b] hover:bg-[#1a293d] text-stone-200 hover:text-white border ${theme.buttonBorder} font-['Prompt'] text-xs font-semibold py-1.5 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]`}
          >
            <TableProperties className="w-3.5 h-3.5 text-[#b88c54] flex-shrink-0" />
            <span className="truncate">ตารางสถานภาพประชากร {title}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
