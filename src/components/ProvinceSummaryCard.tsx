import React from 'react';
import { Province3DMiniMap } from './Province3DMiniMap';
import { TableProperties } from 'lucide-react';
import { ZoneId } from '../types';
import { ChartThemeId } from '../types/theme';

interface ProvinceSummaryCardProps {
  provinceKey: 'yala' | 'pattani' | 'narathiwat' | 'songkhla';
  zoneId: ZoneId;
  title: string;
  badgeTitle?: string;
  subtitle: string;
  posCount?: number;
  occCount?: number;
  chartTheme?: ChartThemeId;
  onNavigate?: (zone: ZoneId) => void;
}

interface ProvinceCardStyle {
  outerBg: string;
  outerBorder: string;
  innerBg: string;
  innerBorder: string;
  titleColor: string;
  subtitleColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  buttonBg: string;
  buttonText: string;
  buttonBorder: string;
  glowColor: string;
  accentBg: string;
}

// 1. ชุดสีราชการทหารบก (Royal Thai Army Tactical Military Colors)
const ARMY_THEMES: Record<string, ProvinceCardStyle> = {
  yala: {
    outerBg: 'bg-gradient-to-br from-[#3d321d] via-[#2d2515] to-[#1c160a]',
    outerBorder: 'border-[#ca8a04]/60',
    innerBg: 'bg-[#141007]/95 backdrop-blur-md',
    innerBorder: 'border-[#ca8a04]/40',
    titleColor: 'text-[#fef08a]',
    subtitleColor: 'text-[#fef9c3]/80',
    badgeBg: 'bg-[#2a2110]',
    badgeBorder: 'border-[#ca8a04]/50',
    badgeText: 'text-[#fef08a]',
    buttonBg: 'bg-[#221a0d] hover:bg-[#332713]',
    buttonText: 'text-[#fef08a] hover:text-white',
    buttonBorder: 'border-[#ca8a04]/50 hover:border-[#facc15]',
    glowColor: 'rgba(202, 138, 4, 0.35)',
    accentBg: 'bg-[#ca8a04]',
  },
  pattani: {
    outerBg: 'bg-gradient-to-br from-[#163832] via-[#0f2824] to-[#081714]',
    outerBorder: 'border-[#14b8a6]/60',
    innerBg: 'bg-[#071512]/95 backdrop-blur-md',
    innerBorder: 'border-[#14b8a6]/40',
    titleColor: 'text-[#5eead4]',
    subtitleColor: 'text-[#ccfbf1]/80',
    badgeBg: 'bg-[#0d2621]',
    badgeBorder: 'border-[#14b8a6]/50',
    badgeText: 'text-[#5eead4]',
    buttonBg: 'bg-[#0b1f1b] hover:bg-[#13332d]',
    buttonText: 'text-[#5eead4] hover:text-white',
    buttonBorder: 'border-[#14b8a6]/50 hover:border-[#2dd4bf]',
    glowColor: 'rgba(20, 184, 166, 0.35)',
    accentBg: 'bg-[#14b8a6]',
  },
  narathiwat: {
    outerBg: 'bg-gradient-to-br from-[#1c3a1f] via-[#132916] to-[#0b180d]',
    outerBorder: 'border-[#84cc16]/60',
    innerBg: 'bg-[#09150b]/95 backdrop-blur-md',
    innerBorder: 'border-[#84cc16]/40',
    titleColor: 'text-[#bef264]',
    subtitleColor: 'text-[#ecfccb]/80',
    badgeBg: 'bg-[#142817]',
    badgeBorder: 'border-[#84cc16]/50',
    badgeText: 'text-[#bef264]',
    buttonBg: 'bg-[#0f2112] hover:bg-[#18361d]',
    buttonText: 'text-[#bef264] hover:text-white',
    buttonBorder: 'border-[#84cc16]/50 hover:border-[#a3e635]',
    glowColor: 'rgba(132, 204, 22, 0.35)',
    accentBg: 'bg-[#84cc16]',
  },
  songkhla: {
    outerBg: 'bg-gradient-to-br from-[#4a151e] via-[#330c14] to-[#1c050a]',
    outerBorder: 'border-[#f43f5e]/60',
    innerBg: 'bg-[#150508]/95 backdrop-blur-md',
    innerBorder: 'border-[#f43f5e]/40',
    titleColor: 'text-[#fda4af]',
    subtitleColor: 'text-[#ffe4e6]/80',
    badgeBg: 'bg-[#2b0c11]',
    badgeBorder: 'border-[#f43f5e]/50',
    badgeText: 'text-[#fda4af]',
    buttonBg: 'bg-[#22080d] hover:bg-[#360e15]',
    buttonText: 'text-[#fda4af] hover:text-white',
    buttonBorder: 'border-[#f43f5e]/50 hover:border-[#fb7185]',
    glowColor: 'rgba(244, 63, 94, 0.35)',
    accentBg: 'bg-[#f43f5e]',
  },
};

// 2. ชุดสีพาสเทล สบายตา (Soft Modern Pastel Palette)
const PASTEL_THEMES: Record<string, ProvinceCardStyle> = {
  yala: {
    outerBg: 'bg-gradient-to-br from-[#fef3c7] via-[#fde68a] to-[#fcd34d]',
    outerBorder: 'border-amber-300',
    innerBg: 'bg-white/95 backdrop-blur-md',
    innerBorder: 'border-amber-200/80',
    titleColor: 'text-amber-950',
    subtitleColor: 'text-amber-800/80',
    badgeBg: 'bg-amber-100',
    badgeBorder: 'border-amber-300',
    badgeText: 'text-amber-900',
    buttonBg: 'bg-amber-50 hover:bg-amber-100',
    buttonText: 'text-amber-900 hover:text-amber-950',
    buttonBorder: 'border-amber-300 hover:border-amber-400',
    glowColor: 'rgba(252, 211, 77, 0.4)',
    accentBg: 'bg-amber-400',
  },
  pattani: {
    outerBg: 'bg-gradient-to-br from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc]',
    outerBorder: 'border-sky-300',
    innerBg: 'bg-white/95 backdrop-blur-md',
    innerBorder: 'border-sky-200/80',
    titleColor: 'text-sky-950',
    subtitleColor: 'text-sky-800/80',
    badgeBg: 'bg-sky-100',
    badgeBorder: 'border-sky-300',
    badgeText: 'text-sky-900',
    buttonBg: 'bg-sky-50 hover:bg-sky-100',
    buttonText: 'text-sky-900 hover:text-sky-950',
    buttonBorder: 'border-sky-300 hover:border-sky-400',
    glowColor: 'rgba(125, 211, 252, 0.4)',
    accentBg: 'bg-sky-400',
  },
  narathiwat: {
    outerBg: 'bg-gradient-to-br from-[#d1fae5] via-[#a7f3d0] to-[#6ee7b7]',
    outerBorder: 'border-emerald-300',
    innerBg: 'bg-white/95 backdrop-blur-md',
    innerBorder: 'border-emerald-200/80',
    titleColor: 'text-emerald-950',
    subtitleColor: 'text-emerald-800/80',
    badgeBg: 'bg-emerald-100',
    badgeBorder: 'border-emerald-300',
    badgeText: 'text-emerald-900',
    buttonBg: 'bg-emerald-50 hover:bg-emerald-100',
    buttonText: 'text-emerald-900 hover:text-emerald-950',
    buttonBorder: 'border-emerald-300 hover:border-emerald-400',
    glowColor: 'rgba(110, 231, 183, 0.4)',
    accentBg: 'bg-emerald-400',
  },
  songkhla: {
    outerBg: 'bg-gradient-to-br from-[#ffe4e6] via-[#fecdd3] to-[#fda4af]',
    outerBorder: 'border-rose-300',
    innerBg: 'bg-white/95 backdrop-blur-md',
    innerBorder: 'border-rose-200/80',
    titleColor: 'text-rose-950',
    subtitleColor: 'text-rose-800/80',
    badgeBg: 'bg-rose-100',
    badgeBorder: 'border-rose-300',
    badgeText: 'text-rose-900',
    buttonBg: 'bg-rose-50 hover:bg-rose-100',
    buttonText: 'text-rose-900 hover:text-rose-950',
    buttonBorder: 'border-rose-300 hover:border-rose-400',
    glowColor: 'rgba(253, 164, 175, 0.4)',
    accentBg: 'bg-rose-400',
  },
};

// 3. ชุดสีกรมท่าตำรวจหลวง (Royal Police Navy & Gold)
const NAVY_THEMES: Record<string, ProvinceCardStyle> = {
  yala: {
    outerBg: 'bg-gradient-to-br from-[#9a3412] via-[#7c2d12] to-[#431407]',
    outerBorder: 'border-amber-400/80',
    innerBg: 'bg-slate-950/95 backdrop-blur-md',
    innerBorder: 'border-amber-500/40',
    titleColor: 'text-white',
    subtitleColor: 'text-amber-200/90',
    badgeBg: 'bg-amber-950/80',
    badgeBorder: 'border-amber-400/60',
    badgeText: 'text-amber-200',
    buttonBg: 'bg-slate-900 hover:bg-slate-800',
    buttonText: 'text-amber-300 hover:text-white',
    buttonBorder: 'border-amber-400/50 hover:border-amber-300',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    accentBg: 'bg-amber-400',
  },
  pattani: {
    outerBg: 'bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#0f172a]',
    outerBorder: 'border-blue-400/80',
    innerBg: 'bg-slate-950/95 backdrop-blur-md',
    innerBorder: 'border-blue-500/40',
    titleColor: 'text-white',
    subtitleColor: 'text-blue-200/90',
    badgeBg: 'bg-blue-950/80',
    badgeBorder: 'border-blue-400/60',
    badgeText: 'text-blue-200',
    buttonBg: 'bg-slate-900 hover:bg-slate-800',
    buttonText: 'text-blue-300 hover:text-white',
    buttonBorder: 'border-blue-400/50 hover:border-blue-300',
    glowColor: 'rgba(59, 130, 246, 0.35)',
    accentBg: 'bg-blue-400',
  },
  narathiwat: {
    outerBg: 'bg-gradient-to-br from-[#047857] via-[#065f46] to-[#022c22]',
    outerBorder: 'border-emerald-400/80',
    innerBg: 'bg-slate-950/95 backdrop-blur-md',
    innerBorder: 'border-emerald-500/40',
    titleColor: 'text-white',
    subtitleColor: 'text-emerald-200/90',
    badgeBg: 'bg-emerald-950/80',
    badgeBorder: 'border-emerald-400/60',
    badgeText: 'text-emerald-200',
    buttonBg: 'bg-slate-900 hover:bg-slate-800',
    buttonText: 'text-emerald-300 hover:text-white',
    buttonBorder: 'border-emerald-400/50 hover:border-emerald-300',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    accentBg: 'bg-emerald-400',
  },
  songkhla: {
    outerBg: 'bg-gradient-to-br from-[#991b1b] via-[#881337] to-[#4c0519]',
    outerBorder: 'border-rose-400/80',
    innerBg: 'bg-slate-950/95 backdrop-blur-md',
    innerBorder: 'border-rose-500/40',
    titleColor: 'text-white',
    subtitleColor: 'text-rose-200/90',
    badgeBg: 'bg-rose-950/80',
    badgeBorder: 'border-rose-400/60',
    badgeText: 'text-rose-200',
    buttonBg: 'bg-slate-900 hover:bg-slate-800',
    buttonText: 'text-rose-300 hover:text-white',
    buttonBorder: 'border-rose-400/50 hover:border-rose-300',
    glowColor: 'rgba(225, 29, 72, 0.35)',
    accentBg: 'bg-rose-500',
  },
};

// 4. ชุดสีแดงเลือดหมูความมั่นคง (Crimson Tactical)
const CRIMSON_THEMES: Record<string, ProvinceCardStyle> = {
  yala: {
    outerBg: 'bg-gradient-to-br from-[#7f1d1d] via-[#5c1313] to-[#2b0808]',
    outerBorder: 'border-amber-400/70',
    innerBg: 'bg-[#180505]/95 backdrop-blur-md',
    innerBorder: 'border-amber-500/40',
    titleColor: 'text-[#fef08a]',
    subtitleColor: 'text-amber-200/80',
    badgeBg: 'bg-[#330c0c]',
    badgeBorder: 'border-amber-400/50',
    badgeText: 'text-amber-200',
    buttonBg: 'bg-[#290a0a] hover:bg-[#400e0e]',
    buttonText: 'text-[#fef08a] hover:text-white',
    buttonBorder: 'border-amber-400/40 hover:border-amber-300',
    glowColor: 'rgba(239, 68, 68, 0.35)',
    accentBg: 'bg-amber-400',
  },
  pattani: {
    outerBg: 'bg-gradient-to-br from-[#500724] via-[#3d051c] to-[#1c020d]',
    outerBorder: 'border-cyan-400/70',
    innerBg: 'bg-[#14020a]/95 backdrop-blur-md',
    innerBorder: 'border-cyan-500/40',
    titleColor: 'text-[#a5f3fc]',
    subtitleColor: 'text-cyan-200/80',
    badgeBg: 'bg-[#2e0415]',
    badgeBorder: 'border-cyan-400/50',
    badgeText: 'text-cyan-200',
    buttonBg: 'bg-[#240310] hover:bg-[#3d051c]',
    buttonText: 'text-[#a5f3fc] hover:text-white',
    buttonBorder: 'border-cyan-400/40 hover:border-cyan-300',
    glowColor: 'rgba(6, 182, 212, 0.35)',
    accentBg: 'bg-cyan-400',
  },
  narathiwat: {
    outerBg: 'bg-gradient-to-br from-[#450a0a] via-[#330808] to-[#170303]',
    outerBorder: 'border-emerald-400/70',
    innerBg: 'bg-[#120303]/95 backdrop-blur-md',
    innerBorder: 'border-emerald-500/40',
    titleColor: 'text-[#a7f3d0]',
    subtitleColor: 'text-emerald-200/80',
    badgeBg: 'bg-[#240606]',
    badgeBorder: 'border-emerald-400/50',
    badgeText: 'text-emerald-200',
    buttonBg: 'bg-[#1c0404] hover:bg-[#300707]',
    buttonText: 'text-[#a7f3d0] hover:text-white',
    buttonBorder: 'border-emerald-400/40 hover:border-emerald-300',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    accentBg: 'bg-emerald-400',
  },
  songkhla: {
    outerBg: 'bg-gradient-to-br from-[#991b1b] via-[#7f1d1d] to-[#450a0a]',
    outerBorder: 'border-rose-400/80',
    innerBg: 'bg-[#1c0505]/95 backdrop-blur-md',
    innerBorder: 'border-rose-500/50',
    titleColor: 'text-[#fecdd3]',
    subtitleColor: 'text-rose-200/80',
    badgeBg: 'bg-[#3b0a0a]',
    badgeBorder: 'border-rose-400/50',
    badgeText: 'text-rose-200',
    buttonBg: 'bg-[#2a0707] hover:bg-[#470d0d]',
    buttonText: 'text-[#fecdd3] hover:text-white',
    buttonBorder: 'border-rose-400/40 hover:border-rose-300',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    accentBg: 'bg-rose-500',
  },
};

// 5. ชุดสีเขียวพงไพร ตชด./นปพ. (Tactical Forest Emerald)
const EMERALD_THEMES: Record<string, ProvinceCardStyle> = {
  yala: {
    outerBg: 'bg-gradient-to-br from-[#14532d] via-[#0f3d21] to-[#071f11]',
    outerBorder: 'border-amber-400/70',
    innerBg: 'bg-[#05170d]/95 backdrop-blur-md',
    innerBorder: 'border-amber-400/40',
    titleColor: 'text-[#fef08a]',
    subtitleColor: 'text-amber-200/80',
    badgeBg: 'bg-[#0a2916]',
    badgeBorder: 'border-amber-400/50',
    badgeText: 'text-amber-200',
    buttonBg: 'bg-[#082112] hover:bg-[#10381f]',
    buttonText: 'text-[#fef08a] hover:text-white',
    buttonBorder: 'border-amber-400/40 hover:border-amber-300',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    accentBg: 'bg-amber-400',
  },
  pattani: {
    outerBg: 'bg-gradient-to-br from-[#065f46] via-[#044734] to-[#02241a]',
    outerBorder: 'border-teal-400/70',
    innerBg: 'bg-[#011711]/95 backdrop-blur-md',
    innerBorder: 'border-teal-400/40',
    titleColor: 'text-[#99f6e4]',
    subtitleColor: 'text-teal-200/80',
    badgeBg: 'bg-[#043326]',
    badgeBorder: 'border-teal-400/50',
    badgeText: 'text-teal-200',
    buttonBg: 'bg-[#03261c] hover:bg-[#074735]',
    buttonText: 'text-[#99f6e4] hover:text-white',
    buttonBorder: 'border-teal-400/40 hover:border-teal-300',
    glowColor: 'rgba(20, 184, 166, 0.35)',
    accentBg: 'bg-teal-400',
  },
  narathiwat: {
    outerBg: 'bg-gradient-to-br from-[#166534] via-[#14532d] to-[#052e16]',
    outerBorder: 'border-emerald-400/80',
    innerBg: 'bg-[#031d0e]/95 backdrop-blur-md',
    innerBorder: 'border-emerald-400/50',
    titleColor: 'text-[#bbf7d0]',
    subtitleColor: 'text-emerald-200/80',
    badgeBg: 'bg-[#0a381c]',
    badgeBorder: 'border-emerald-400/50',
    badgeText: 'text-emerald-200',
    buttonBg: 'bg-[#072a15] hover:bg-[#0e4d27]',
    buttonText: 'text-[#bbf7d0] hover:text-white',
    buttonBorder: 'border-emerald-400/40 hover:border-emerald-300',
    glowColor: 'rgba(34, 197, 94, 0.4)',
    accentBg: 'bg-emerald-400',
  },
  songkhla: {
    outerBg: 'bg-gradient-to-br from-[#1e3a1f] via-[#2d1b1f] to-[#1c080e]',
    outerBorder: 'border-rose-400/70',
    innerBg: 'bg-[#14060b]/95 backdrop-blur-md',
    innerBorder: 'border-rose-400/40',
    titleColor: 'text-[#fecdd3]',
    subtitleColor: 'text-rose-200/80',
    badgeBg: 'bg-[#290d16]',
    badgeBorder: 'border-rose-400/50',
    badgeText: 'text-rose-200',
    buttonBg: 'bg-[#1f0910] hover:bg-[#3b1220]',
    buttonText: 'text-[#fecdd3] hover:text-white',
    buttonBorder: 'border-rose-400/40 hover:border-rose-300',
    glowColor: 'rgba(244, 63, 94, 0.35)',
    accentBg: 'bg-rose-400',
  },
};

// 6. ชุดสีไนท์ออปส์ ไซเบอร์ (Cyber Obsidian Blue)
const CYBER_THEMES: Record<string, ProvinceCardStyle> = {
  yala: {
    outerBg: 'bg-gradient-to-br from-[#0c1929] via-[#07111c] to-[#02050a]',
    outerBorder: 'border-amber-400/70',
    innerBg: 'bg-[#020617]/95 backdrop-blur-md',
    innerBorder: 'border-amber-400/40',
    titleColor: 'text-[#fef08a]',
    subtitleColor: 'text-amber-200/80',
    badgeBg: 'bg-[#1e1e08]',
    badgeBorder: 'border-amber-400/50',
    badgeText: 'text-amber-200',
    buttonBg: 'bg-[#090d16] hover:bg-[#141b2a]',
    buttonText: 'text-[#fef08a] hover:text-white',
    buttonBorder: 'border-amber-400/40 hover:border-amber-300',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    accentBg: 'bg-amber-400',
  },
  pattani: {
    outerBg: 'bg-gradient-to-br from-[#082f49] via-[#0c1f33] to-[#020911]',
    outerBorder: 'border-sky-400/80',
    innerBg: 'bg-[#020a14]/95 backdrop-blur-md',
    innerBorder: 'border-sky-400/50',
    titleColor: 'text-[#7dd3fc]',
    subtitleColor: 'text-sky-200/80',
    badgeBg: 'bg-[#08223a]',
    badgeBorder: 'border-sky-400/50',
    badgeText: 'text-sky-200',
    buttonBg: 'bg-[#041324] hover:bg-[#0c2442]',
    buttonText: 'text-[#7dd3fc] hover:text-white',
    buttonBorder: 'border-sky-400/40 hover:border-sky-300',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    accentBg: 'bg-sky-400',
  },
  narathiwat: {
    outerBg: 'bg-gradient-to-br from-[#064e3b] via-[#082920] to-[#02120e]',
    outerBorder: 'border-emerald-400/70',
    innerBg: 'bg-[#010e0b]/95 backdrop-blur-md',
    innerBorder: 'border-emerald-400/40',
    titleColor: 'text-[#6ee7b7]',
    subtitleColor: 'text-emerald-200/80',
    badgeBg: 'bg-[#06291f]',
    badgeBorder: 'border-emerald-400/50',
    badgeText: 'text-emerald-200',
    buttonBg: 'bg-[#031712] hover:bg-[#0a2e24]',
    buttonText: 'text-[#6ee7b7] hover:text-white',
    buttonBorder: 'border-emerald-400/40 hover:border-emerald-300',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    accentBg: 'bg-emerald-400',
  },
  songkhla: {
    outerBg: 'bg-gradient-to-br from-[#4c0519] via-[#240810] to-[#0e0206]',
    outerBorder: 'border-rose-400/70',
    innerBg: 'bg-[#0d0206]/95 backdrop-blur-md',
    innerBorder: 'border-rose-400/40',
    titleColor: 'text-[#fda4af]',
    subtitleColor: 'text-rose-200/80',
    badgeBg: 'bg-[#29040e]',
    badgeBorder: 'border-rose-400/50',
    badgeText: 'text-rose-200',
    buttonBg: 'bg-[#17030a] hover:bg-[#2b0815]',
    buttonText: 'text-[#fda4af] hover:text-white',
    buttonBorder: 'border-rose-400/40 hover:border-rose-300',
    glowColor: 'rgba(244, 63, 94, 0.35)',
    accentBg: 'bg-rose-400',
  },
};

const THEME_MAP: Record<ChartThemeId, Record<string, ProvinceCardStyle>> = {
  army: ARMY_THEMES,
  pastel: PASTEL_THEMES,
  'royal-navy': NAVY_THEMES,
  crimson: CRIMSON_THEMES,
  emerald: EMERALD_THEMES,
  cyber: CYBER_THEMES,
};

export const ProvinceSummaryCard: React.FC<ProvinceSummaryCardProps> = ({
  provinceKey,
  zoneId,
  title,
  badgeTitle,
  subtitle,
  posCount,
  occCount,
  chartTheme = 'army',
  onNavigate,
}) => {
  const activeThemes = THEME_MAP[chartTheme] || ARMY_THEMES;
  const theme = activeThemes[provinceKey] || activeThemes.yala;

  return (
    <div
      className={`w-full ${theme.outerBg} p-2 rounded-2xl border ${theme.outerBorder} shadow-lg transition-all duration-300 hover:shadow-xl`}
      style={{
        boxShadow: `0 8px 24px -4px ${theme.glowColor}`,
      }}
    >
      {/* Inner Card Container */}
      <div className={`relative ${theme.innerBg} rounded-xl border ${theme.innerBorder} p-3.5 flex flex-col justify-between overflow-hidden shadow-inner`}>
        {/* Subtle accent corner glow */}
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full filter blur-xl opacity-20 pointer-events-none ${theme.accentBg}`} />

        {/* Upper row: Left Typography & Right 3D MiniMap */}
        <div className="flex items-start justify-between gap-1 relative z-10">
          {/* Left info */}
          <div className="flex-1 pr-1 flex flex-col justify-center pt-1">
            <h3 className={`text-2xl sm:text-3xl font-bold font-['Prompt'] ${theme.titleColor} tracking-normal leading-tight drop-shadow-md`}>
              {title}
            </h3>
            <div className={`text-[11px] ${theme.subtitleColor} font-medium mt-1 tracking-tight flex items-center gap-1.5`}>
              <span className={`w-1.5 h-1.5 rounded-full ${theme.accentBg} animate-pulse`} />
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
            className={`w-full ${theme.buttonBg} ${theme.buttonText} border ${theme.buttonBorder} font-['Prompt'] text-xs font-semibold py-1.5 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]`}
          >
            <TableProperties className="w-3.5 h-3.5 opacity-80 flex-shrink-0" />
            <span className="truncate font-medium">ตารางสถานภาพประชากร {title}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
