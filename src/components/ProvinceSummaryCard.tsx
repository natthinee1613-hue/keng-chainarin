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
    outerBg: 'bg-[#5e3b28]',
    outerBorder: 'border-[#7d4f36]',
    innerBorder: 'border-[#523321]',
    badgeBg: 'bg-[#8c5638]',
    badgeBorder: 'border-[#a86845]',
    badgeText: 'text-[#faebe0]',
    buttonBorder: 'border-[#7d4f36]/70 hover:border-[#a86845]',
    glowColor: 'rgba(140, 86, 56, 0.25)',
  },
  pattani: {
    outerBg: 'bg-[#614d2a]',
    outerBorder: 'border-[#826738]',
    innerBorder: 'border-[#544222]',
    badgeBg: 'bg-[#8a6d3f]',
    badgeBorder: 'border-[#a8874f]',
    badgeText: 'text-[#fbf2e2]',
    buttonBorder: 'border-[#826738]/70 hover:border-[#a8874f]',
    glowColor: 'rgba(138, 109, 63, 0.25)',
  },
  narathiwat: {
    outerBg: 'bg-[#47403a]',
    outerBorder: 'border-[#635a51]',
    innerBorder: 'border-[#3b342e]',
    badgeBg: 'bg-[#5a5047]',
    badgeBorder: 'border-[#756a5f]',
    badgeText: 'text-[#ede6df]',
    buttonBorder: 'border-[#635a51]/70 hover:border-[#756a5f]',
    glowColor: 'rgba(90, 80, 71, 0.25)',
  },
  songkhla: {
    outerBg: 'bg-[#693325]',
    outerBorder: 'border-[#914634]',
    innerBorder: 'border-[#5c2a1e]',
    badgeBg: 'bg-[#a65341]',
    badgeBorder: 'border-[#c46652]',
    badgeText: 'text-[#fdedeb]',
    buttonBorder: 'border-[#914634]/70 hover:border-[#c46652]',
    glowColor: 'rgba(166, 83, 65, 0.25)',
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
      {/* Inner Card (Dark charcoal background matching the reference image) */}
      <div className={`relative bg-[#212327] rounded-xl border ${theme.innerBorder} p-3.5 flex flex-col justify-between overflow-hidden`}>
        {/* Upper row: Left Typography & Right 3D MiniMap */}
        <div className="flex items-start justify-between gap-1 relative z-10">
          {/* Left info */}
          <div className="flex-1 pr-1 flex flex-col justify-center pt-1">
            <h3 className="text-2xl sm:text-3xl font-bold font-['Prompt'] text-[#f5ebd9] tracking-normal leading-tight drop-shadow-sm">
              {title}
            </h3>
            <div className="text-[11px] text-stone-400 font-medium mt-1 tracking-tight">
              {subtitle}
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
            className={`w-full bg-[#18191c]/80 hover:bg-black/80 text-stone-300 hover:text-white border ${theme.buttonBorder} font-['Prompt'] text-xs font-medium py-1.5 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98]`}
          >
            <TableProperties className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
            <span className="truncate">ตารางสถานภาพประชากร {title}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
