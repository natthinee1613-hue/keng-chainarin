import React, { useState } from 'react';
import { TableProperties } from 'lucide-react';
import { PoliceUnitRecord, ZoneId } from '../types';
import { computeGroupSummary } from '../data/initialData';
import { ProvinceSummaryCard } from './ProvinceSummaryCard';
import { TerroristIncidentsModal } from './TerroristIncidentsModal';
import { ChartThemeId } from '../types/theme';

interface OrgTreeProps {
  records: PoliceUnitRecord[];
  onNavigateToZone?: (zoneId: ZoneId, unitName?: string) => void;
  onSelectUnitRoster?: (unit: PoliceUnitRecord) => void;
  chartTheme?: ChartThemeId;
  onSelectChartTheme?: (theme: ChartThemeId) => void;
}

// ชุดรูปแบบธีมแผนภูมิภาพโครงสร้าง 6 สไตล์
interface ChartStyleConfig {
  containerBg: string;
  containerBorder: string;
  gridDot: string;
  textColor: string;
  p9Card: {
    bg: string;
    border: string;
    shadow: string;
    textColor: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    pulseDot: string;
  };
  connectorGradient: string;
  branchBar: string;
  yalaSubcards: {
    jct: string;
    jctText: string;
    prov: string;
    provText: string;
    sfr: string;
    sfrText: string;
  };
  adminBox: {
    bg: string;
    border: string;
    titleColor: string;
    badge: string;
    itemText: string;
    hoverText: string;
  };
  spBoxYala: {
    bg: string;
    border: string;
    titleColor: string;
    badge: string;
    itemText: string;
    hoverText: string;
  };
  spBoxPtn: {
    bg: string;
    border: string;
    titleColor: string;
    badge: string;
    itemText: string;
    hoverText: string;
  };
  spBoxNrt: {
    bg: string;
    border: string;
    titleColor: string;
    badge: string;
    itemText: string;
    hoverText: string;
  };
  districtsBox: {
    bg: string;
    border: string;
    titleColor: string;
    itemText: string;
    hoverText: string;
  };
  provHeaderPtn: string;
  provHeaderNrt: string;
  provHeaderSkh: string;
  table: {
    bg: string;
    border: string;
    headerBg: string;
    headerText: string;
    posHeader: string;
    occHeader: string;
    pctHeader: string;
    shortageHeader: string;
    divider: string;
    rowHover: string;
    primaryText: string;
    posText: string;
    occText: string;
    pctText: string;
    shortageText: string;
    linkText: string;
    totalBg: string;
    totalBorder: string;
    totalText: string;
  };
}

const CHART_STYLES: Record<ChartThemeId, ChartStyleConfig> = {
  // 1. แนวทางราชการทหารบก (Royal Thai Army)
  army: {
    containerBg: 'bg-gradient-to-b from-[#132316] via-[#0f1c12] to-[#0a140d]',
    containerBorder: 'border-[#ca8a04]/50',
    gridDot: '#84cc16',
    textColor: 'text-[#fef9c3]',
    p9Card: {
      bg: 'linear-gradient(135deg, #1c3821 0%, #264a2c 50%, #152b19 100%)',
      border: 'border-[#ca8a04]/80',
      shadow: '0 8px 24px -4px rgba(28, 56, 33, 0.7), 0 0 0 1px rgba(202, 138, 4, 0.3)',
      textColor: 'text-[#fef9c3]',
      badgeBg: 'bg-[#0c170e]',
      badgeText: 'text-[#fef08a]',
      badgeBorder: 'border-[#ca8a04]/50',
      pulseDot: 'bg-[#84cc16]',
    },
    connectorGradient: 'from-[#ca8a04] to-[#4d7c0f]',
    branchBar: 'from-[#ca8a04] via-[#65a30d] via-[#15803d] via-[#65a30d] to-[#ca8a04]',
    yalaSubcards: {
      jct: 'bg-[#241e12] border-[#ca8a04]/50 text-[#fef08a] hover:border-[#facc15]',
      jctText: 'text-[#fde047]',
      prov: 'bg-[#1a160d] border-[#a16207]/40 text-[#fef9c3] hover:border-[#facc15]',
      provText: 'text-[#ca8a04]',
      sfr: 'bg-[#221c10] border-[#ca8a04]/40 text-[#fef08a] hover:border-[#facc15]',
      sfrText: 'text-[#fde047]',
    },
    adminBox: {
      bg: 'bg-gradient-to-br from-[#1b2b1e] to-[#101b12]',
      border: 'border-[#65a30d]/40',
      titleColor: 'text-[#bef264]',
      badge: 'text-[#bef264] bg-[#65a30d]/20 border-[#65a30d]/30',
      itemText: 'text-[#fef9c3]',
      hoverText: 'hover:text-[#bef264]',
    },
    spBoxYala: {
      bg: 'bg-gradient-to-br from-[#292212] to-[#17130a]',
      border: 'border-[#ca8a04]/40',
      titleColor: 'text-[#fef08a]',
      badge: 'text-[#fef08a] bg-[#ca8a04]/20 border-[#ca8a04]/30',
      itemText: 'text-[#fef9c3]',
      hoverText: 'hover:text-[#fef08a]',
    },
    spBoxPtn: {
      bg: 'bg-gradient-to-br from-[#0c2420] to-[#071714]',
      border: 'border-[#14b8a6]/40',
      titleColor: 'text-[#5eead4]',
      badge: 'text-[#5eead4] bg-[#14b8a6]/20 border-[#14b8a6]/30',
      itemText: 'text-[#ccfbf1]',
      hoverText: 'hover:text-[#5eead4]',
    },
    spBoxNrt: {
      bg: 'bg-gradient-to-br from-[#152e18] to-[#0c1c0f]',
      border: 'border-[#84cc16]/40',
      titleColor: 'text-[#bef264]',
      badge: 'text-[#bef264] bg-[#84cc16]/20 border-[#84cc16]/30',
      itemText: 'text-[#ecfccb]',
      hoverText: 'hover:text-[#bef264]',
    },
    districtsBox: {
      bg: 'bg-gradient-to-br from-[#330e16] to-[#1a060a]',
      border: 'border-[#f43f5e]/40',
      titleColor: 'text-[#fda4af]',
      itemText: 'text-[#ffe4e6]',
      hoverText: 'hover:text-[#fda4af]',
    },
    provHeaderPtn: 'bg-[#0d221f] border-[#14b8a6]/50 text-[#5eead4] hover:border-[#2dd4bf]',
    provHeaderNrt: 'bg-[#122815] border-[#84cc16]/50 text-[#bef264] hover:border-[#a3e635]',
    provHeaderSkh: 'bg-[#270b10] border-[#f43f5e]/50 text-[#fda4af] hover:border-[#fb7185]',
    table: {
      bg: 'bg-[#0c160e]',
      border: 'border-[#ca8a04]/40',
      headerBg: 'bg-[#18291b]',
      headerText: 'text-[#fef9c3]',
      posHeader: 'bg-[#14322d] text-[#5eead4] border-[#14b8a6]',
      occHeader: 'bg-[#153118] text-[#bef264] border-[#84cc16]',
      pctHeader: 'bg-[#332812] text-[#fef08a] border-[#ca8a04]',
      shortageHeader: 'bg-[#3a1017] text-[#fda4af] border-[#f43f5e]',
      divider: 'divide-[#1e3422]',
      rowHover: 'hover:bg-[#1a2e1d]',
      primaryText: 'text-[#fef9c3]',
      posText: 'text-[#5eead4]',
      occText: 'text-[#bef264]',
      pctText: 'text-[#fef08a]',
      shortageText: 'text-[#fda4af]',
      linkText: 'text-[#fef08a] hover:text-white',
      totalBg: 'bg-[#192f1d]',
      totalBorder: 'border-[#ca8a04]',
      totalText: 'text-[#facc15]',
    },
  },

  // 2. สีพาสเทล สบายตา (Soft Modern Pastel)
  pastel: {
    containerBg: 'bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc]',
    containerBorder: 'border-slate-200/90',
    gridDot: '#64748b',
    textColor: 'text-slate-800',
    p9Card: {
      bg: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 50%, #dbeafe 100%)',
      border: 'border-indigo-200',
      shadow: '0 4px 16px -2px rgba(99, 102, 241, 0.15)',
      textColor: 'text-indigo-950',
      badgeBg: 'bg-white/90',
      badgeText: 'text-indigo-900',
      badgeBorder: 'border-indigo-200/80',
      pulseDot: 'bg-indigo-500',
    },
    connectorGradient: 'from-amber-400 to-indigo-300',
    branchBar: 'from-[#fde68a] via-[#bae6fd] via-[#a7f3d0] to-[#fecdd3]',
    yalaSubcards: {
      jct: 'bg-[#fef9c3] border-amber-300 text-amber-950 hover:bg-amber-100',
      jctText: 'text-amber-800',
      prov: 'bg-white border-slate-200 text-slate-800 hover:bg-amber-50',
      provText: 'text-slate-600',
      sfr: 'bg-[#fef3c7] border-amber-300 text-amber-950 hover:bg-amber-100',
      sfrText: 'text-amber-800',
    },
    adminBox: {
      bg: 'bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe]',
      border: 'border-purple-200',
      titleColor: 'text-purple-950',
      badge: 'text-purple-900 bg-purple-100 border-purple-200',
      itemText: 'text-slate-700',
      hoverText: 'hover:text-purple-800',
    },
    spBoxYala: {
      bg: 'bg-gradient-to-br from-[#fffbeb] to-[#fef3c7]',
      border: 'border-amber-200',
      titleColor: 'text-amber-950',
      badge: 'text-amber-900 bg-amber-100 border-amber-200',
      itemText: 'text-slate-700',
      hoverText: 'hover:text-amber-800',
    },
    spBoxPtn: {
      bg: 'bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe]',
      border: 'border-sky-200',
      titleColor: 'text-sky-950',
      badge: 'text-sky-900 bg-sky-100 border-sky-200',
      itemText: 'text-slate-700',
      hoverText: 'hover:text-sky-800',
    },
    spBoxNrt: {
      bg: 'bg-gradient-to-br from-[#f0fdf4] to-[#d1fae5]',
      border: 'border-emerald-200',
      titleColor: 'text-emerald-950',
      badge: 'text-emerald-900 bg-emerald-100 border-emerald-200',
      itemText: 'text-slate-700',
      hoverText: 'hover:text-emerald-800',
    },
    districtsBox: {
      bg: 'bg-gradient-to-br from-[#fff1f2] to-white',
      border: 'border-rose-200',
      titleColor: 'text-rose-950',
      itemText: 'text-slate-700',
      hoverText: 'hover:text-rose-700',
    },
    provHeaderPtn: 'bg-[#e0f2fe] border-sky-300 text-sky-950 hover:bg-sky-100',
    provHeaderNrt: 'bg-[#d1fae5] border-emerald-300 text-emerald-950 hover:bg-emerald-100',
    provHeaderSkh: 'bg-[#ffe4e6] border-rose-300 text-rose-950 hover:bg-rose-100',
    table: {
      bg: 'bg-white',
      border: 'border-slate-200',
      headerBg: 'bg-slate-100',
      headerText: 'text-slate-800',
      posHeader: 'bg-[#e0f2fe] text-sky-950 border-sky-300',
      occHeader: 'bg-[#d1fae5] text-emerald-950 border-emerald-300',
      pctHeader: 'bg-[#fef3c7] text-amber-950 border-amber-300',
      shortageHeader: 'bg-[#ffe4e6] text-rose-950 border-rose-300',
      divider: 'divide-slate-100',
      rowHover: 'hover:bg-slate-50',
      primaryText: 'text-slate-900',
      posText: 'text-slate-700',
      occText: 'text-emerald-700',
      pctText: 'text-amber-700',
      shortageText: 'text-rose-600',
      linkText: 'text-sky-700 hover:text-sky-900',
      totalBg: 'bg-slate-100',
      totalBorder: 'border-slate-200',
      totalText: 'text-slate-900',
    },
  },

  // 3. สีกรมท่าตำรวจหลวง (Royal Police Navy & Gold)
  'royal-navy': {
    containerBg: 'bg-gradient-to-b from-[#0b1322] via-[#09101c] to-[#050b14]',
    containerBorder: 'border-amber-500/40',
    gridDot: '#f59e0b',
    textColor: 'text-slate-100',
    p9Card: {
      bg: 'linear-gradient(135deg, #0b1f3a 0%, #153860 45%, #0b1f3a 100%)',
      border: 'border-amber-400/90',
      shadow: '0 8px 25px -4px rgba(11, 31, 58, 0.7), 0 0 0 1px rgba(245, 158, 11, 0.4)',
      textColor: 'text-white',
      badgeBg: 'bg-slate-950/90',
      badgeText: 'text-amber-200',
      badgeBorder: 'border-amber-400/40',
      pulseDot: 'bg-amber-400',
    },
    connectorGradient: 'from-amber-400 to-blue-500',
    branchBar: 'from-[#f59e0b] via-[#3b82f6] via-[#f59e0b] via-[#3b82f6] to-[#f59e0b]',
    yalaSubcards: {
      jct: 'bg-slate-900/90 border-amber-500/50 text-amber-200 hover:border-amber-400',
      jctText: 'text-amber-300',
      prov: 'bg-slate-900/90 border-slate-700 text-slate-200 hover:border-amber-400',
      provText: 'text-slate-400',
      sfr: 'bg-slate-900/90 border-amber-400/40 text-amber-100 hover:border-amber-300',
      sfrText: 'text-amber-300',
    },
    adminBox: {
      bg: 'bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617]',
      border: 'border-amber-500/40',
      titleColor: 'text-amber-200',
      badge: 'text-amber-300 bg-amber-500/20 border-amber-400/30',
      itemText: 'text-slate-200',
      hoverText: 'hover:text-amber-300',
    },
    spBoxYala: {
      bg: 'bg-gradient-to-br from-[#78350f]/80 via-slate-900 to-slate-950',
      border: 'border-amber-500/50',
      titleColor: 'text-amber-200',
      badge: 'text-amber-300 bg-amber-500/20 border-amber-400/30',
      itemText: 'text-slate-200',
      hoverText: 'hover:text-amber-300',
    },
    spBoxPtn: {
      bg: 'bg-gradient-to-br from-[#1e3a8a]/70 via-slate-900 to-slate-950',
      border: 'border-blue-400/50',
      titleColor: 'text-blue-200',
      badge: 'text-blue-300 bg-blue-500/20 border-blue-400/30',
      itemText: 'text-slate-200',
      hoverText: 'hover:text-blue-300',
    },
    spBoxNrt: {
      bg: 'bg-gradient-to-br from-[#065f46]/70 via-slate-900 to-slate-950',
      border: 'border-emerald-400/50',
      titleColor: 'text-emerald-200',
      badge: 'text-emerald-300 bg-emerald-500/20 border-emerald-400/30',
      itemText: 'text-slate-200',
      hoverText: 'hover:text-emerald-300',
    },
    districtsBox: {
      bg: 'bg-gradient-to-br from-[#881337]/70 via-slate-900 to-slate-950',
      border: 'border-rose-500/50',
      titleColor: 'text-rose-200',
      itemText: 'text-slate-200',
      hoverText: 'hover:text-rose-300',
    },
    provHeaderPtn: 'bg-slate-900/90 border-blue-500/50 text-blue-200 hover:border-blue-400',
    provHeaderNrt: 'bg-slate-900/90 border-emerald-500/50 text-emerald-200 hover:border-emerald-400',
    provHeaderSkh: 'bg-slate-900/90 border-rose-500/50 text-rose-200 hover:border-rose-400',
    table: {
      bg: 'bg-[#080e18]',
      border: 'border-amber-500/30',
      headerBg: 'bg-slate-900',
      headerText: 'text-amber-300',
      posHeader: 'bg-blue-950/90 text-blue-200 border-blue-500',
      occHeader: 'bg-emerald-950/90 text-emerald-200 border-emerald-500',
      pctHeader: 'bg-amber-950/90 text-amber-200 border-amber-500',
      shortageHeader: 'bg-rose-950/90 text-rose-200 border-rose-500',
      divider: 'divide-slate-800',
      rowHover: 'hover:bg-slate-900/80',
      primaryText: 'text-white',
      posText: 'text-blue-200',
      occText: 'text-emerald-300',
      pctText: 'text-amber-300',
      shortageText: 'text-rose-400',
      linkText: 'text-amber-300 hover:text-white',
      totalBg: 'bg-slate-900',
      totalBorder: 'border-amber-500/40',
      totalText: 'text-amber-300',
    },
  },

  // 4. สีแดงเลือดหมูความมั่นคง (Crimson Tactical)
  crimson: {
    containerBg: 'bg-gradient-to-b from-[#250505] via-[#1a0404] to-[#0d0101]',
    containerBorder: 'border-red-500/40',
    gridDot: '#ef4444',
    textColor: 'text-rose-100',
    p9Card: {
      bg: 'linear-gradient(135deg, #450a0a 0%, #5c1111 50%, #290505 100%)',
      border: 'border-red-500/80',
      shadow: '0 8px 24px -4px rgba(239, 68, 68, 0.4), 0 0 0 1px rgba(244, 63, 94, 0.3)',
      textColor: 'text-white',
      badgeBg: 'bg-black/80',
      badgeText: 'text-rose-200',
      badgeBorder: 'border-red-500/40',
      pulseDot: 'bg-red-500',
    },
    connectorGradient: 'from-amber-400 to-red-600',
    branchBar: 'from-[#ef4444] via-[#f97316] via-[#dc2626] via-[#f97316] to-[#ef4444]',
    yalaSubcards: {
      jct: 'bg-[#2b0808] border-red-500/50 text-amber-200 hover:border-amber-400',
      jctText: 'text-amber-300',
      prov: 'bg-[#200505] border-red-900/60 text-slate-200 hover:border-red-400',
      provText: 'text-rose-300',
      sfr: 'bg-[#2b0808] border-red-500/40 text-rose-100 hover:border-red-300',
      sfrText: 'text-rose-200',
    },
    adminBox: {
      bg: 'bg-gradient-to-br from-[#2a0505] to-[#140202]',
      border: 'border-red-500/40',
      titleColor: 'text-rose-200',
      badge: 'text-rose-200 bg-red-950 border-red-500/30',
      itemText: 'text-rose-100',
      hoverText: 'hover:text-amber-300',
    },
    spBoxYala: {
      bg: 'bg-gradient-to-br from-[#3b0808] to-[#170303]',
      border: 'border-red-500/40',
      titleColor: 'text-rose-200',
      badge: 'text-rose-200 bg-red-950 border-red-500/30',
      itemText: 'text-rose-100',
      hoverText: 'hover:text-amber-300',
    },
    spBoxPtn: {
      bg: 'bg-gradient-to-br from-[#330517] to-[#17020a]',
      border: 'border-cyan-500/40',
      titleColor: 'text-cyan-200',
      badge: 'text-cyan-200 bg-cyan-950 border-cyan-500/30',
      itemText: 'text-cyan-100',
      hoverText: 'hover:text-cyan-300',
    },
    spBoxNrt: {
      bg: 'bg-gradient-to-br from-[#2e0505] to-[#120202]',
      border: 'border-emerald-500/40',
      titleColor: 'text-emerald-200',
      badge: 'text-emerald-200 bg-emerald-950 border-emerald-500/30',
      itemText: 'text-emerald-100',
      hoverText: 'hover:text-emerald-300',
    },
    districtsBox: {
      bg: 'bg-gradient-to-br from-[#3d0510] to-[#1a0206]',
      border: 'border-rose-500/40',
      titleColor: 'text-rose-200',
      itemText: 'text-rose-100',
      hoverText: 'hover:text-white',
    },
    provHeaderPtn: 'bg-[#240310] border-cyan-500/50 text-cyan-200 hover:border-cyan-400',
    provHeaderNrt: 'bg-[#1c0404] border-emerald-500/50 text-emerald-200 hover:border-emerald-400',
    provHeaderSkh: 'bg-[#2a0707] border-rose-500/50 text-rose-200 hover:border-rose-400',
    table: {
      bg: 'bg-[#120202]',
      border: 'border-red-500/30',
      headerBg: 'bg-[#290505]',
      headerText: 'text-rose-200',
      posHeader: 'bg-[#240310] text-cyan-200 border-cyan-500',
      occHeader: 'bg-[#1c0404] text-emerald-200 border-emerald-500',
      pctHeader: 'bg-[#3b0808] text-amber-200 border-amber-500',
      shortageHeader: 'bg-[#450a0a] text-rose-200 border-rose-500',
      divider: 'divide-red-950',
      rowHover: 'hover:bg-red-950/40',
      primaryText: 'text-white',
      posText: 'text-cyan-200',
      occText: 'text-emerald-300',
      pctText: 'text-amber-300',
      shortageText: 'text-rose-400',
      linkText: 'text-rose-300 hover:text-white',
      totalBg: 'bg-[#290505]',
      totalBorder: 'border-red-500/50',
      totalText: 'text-rose-200',
    },
  },

  // 5. สีเขียวพงไพร ตชด./นปพ. (Tactical Jungle Emerald)
  emerald: {
    containerBg: 'bg-gradient-to-b from-[#06241a] via-[#041912] to-[#020f0b]',
    containerBorder: 'border-emerald-500/40',
    gridDot: '#10b981',
    textColor: 'text-emerald-100',
    p9Card: {
      bg: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #022c22 100%)',
      border: 'border-emerald-400/90',
      shadow: '0 8px 24px -4px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(52, 211, 153, 0.3)',
      textColor: 'text-white',
      badgeBg: 'bg-black/80',
      badgeText: 'text-emerald-200',
      badgeBorder: 'border-emerald-400/40',
      pulseDot: 'bg-emerald-400',
    },
    connectorGradient: 'from-amber-400 to-emerald-500',
    branchBar: 'from-[#10b981] via-[#059669] via-[#34d399] via-[#059669] to-[#10b981]',
    yalaSubcards: {
      jct: 'bg-[#082112] border-emerald-500/50 text-amber-200 hover:border-amber-400',
      jctText: 'text-amber-300',
      prov: 'bg-[#05170d] border-emerald-900/60 text-slate-200 hover:border-emerald-400',
      provText: 'text-emerald-300',
      sfr: 'bg-[#082112] border-emerald-500/40 text-emerald-100 hover:border-emerald-300',
      sfrText: 'text-emerald-200',
    },
    adminBox: {
      bg: 'bg-gradient-to-br from-[#064e3b]/80 to-[#022c22]',
      border: 'border-emerald-500/40',
      titleColor: 'text-emerald-200',
      badge: 'text-emerald-200 bg-emerald-950 border-emerald-500/30',
      itemText: 'text-emerald-100',
      hoverText: 'hover:text-emerald-300',
    },
    spBoxYala: {
      bg: 'bg-gradient-to-br from-[#0a2916] to-[#04140b]',
      border: 'border-emerald-500/40',
      titleColor: 'text-emerald-200',
      badge: 'text-emerald-200 bg-emerald-950 border-emerald-500/30',
      itemText: 'text-emerald-100',
      hoverText: 'hover:text-emerald-300',
    },
    spBoxPtn: {
      bg: 'bg-gradient-to-br from-[#03261c] to-[#01140e]',
      border: 'border-teal-500/40',
      titleColor: 'text-teal-200',
      badge: 'text-teal-200 bg-teal-950 border-teal-500/30',
      itemText: 'text-teal-100',
      hoverText: 'hover:text-teal-300',
    },
    spBoxNrt: {
      bg: 'bg-gradient-to-br from-[#072a15] to-[#03140a]',
      border: 'border-emerald-500/40',
      titleColor: 'text-emerald-200',
      badge: 'text-emerald-200 bg-emerald-950 border-emerald-500/30',
      itemText: 'text-emerald-100',
      hoverText: 'hover:text-emerald-300',
    },
    districtsBox: {
      bg: 'bg-gradient-to-br from-[#1f0910] to-[#0d0307]',
      border: 'border-rose-500/40',
      titleColor: 'text-rose-200',
      itemText: 'text-rose-100',
      hoverText: 'hover:text-white',
    },
    provHeaderPtn: 'bg-[#03261c] border-teal-500/50 text-teal-200 hover:border-teal-400',
    provHeaderNrt: 'bg-[#072a15] border-emerald-500/50 text-emerald-200 hover:border-emerald-400',
    provHeaderSkh: 'bg-[#1f0910] border-rose-500/50 text-rose-200 hover:border-rose-400',
    table: {
      bg: 'bg-[#021711]',
      border: 'border-emerald-500/30',
      headerBg: 'bg-[#064e3b]',
      headerText: 'text-emerald-100',
      posHeader: 'bg-[#03261c] text-teal-200 border-teal-500',
      occHeader: 'bg-[#072a15] text-emerald-200 border-emerald-500',
      pctHeader: 'bg-[#0a2916] text-amber-200 border-amber-500',
      shortageHeader: 'bg-[#1f0910] text-rose-200 border-rose-500',
      divider: 'divide-emerald-950',
      rowHover: 'hover:bg-emerald-950/40',
      primaryText: 'text-white',
      posText: 'text-teal-200',
      occText: 'text-emerald-300',
      pctText: 'text-amber-300',
      shortageText: 'text-rose-400',
      linkText: 'text-emerald-300 hover:text-white',
      totalBg: 'bg-[#064e3b]',
      totalBorder: 'border-emerald-500/50',
      totalText: 'text-emerald-200',
    },
  },

  // 6. ไนท์ออปส์ ไซเบอร์ (Cyber Obsidian Blue)
  cyber: {
    containerBg: 'bg-gradient-to-b from-[#030712] via-[#081220] to-[#020617]',
    containerBorder: 'border-sky-500/40',
    gridDot: '#38bdf8',
    textColor: 'text-sky-100',
    p9Card: {
      bg: 'linear-gradient(135deg, #0c203b 0%, #0f294d 50%, #071526 100%)',
      border: 'border-sky-400/90',
      shadow: '0 8px 24px -4px rgba(56, 189, 248, 0.4), 0 0 0 1px rgba(56, 189, 248, 0.3)',
      textColor: 'text-white',
      badgeBg: 'bg-black/80',
      badgeText: 'text-sky-200',
      badgeBorder: 'border-sky-400/40',
      pulseDot: 'bg-sky-400',
    },
    connectorGradient: 'from-amber-400 to-sky-400',
    branchBar: 'from-[#38bdf8] via-[#818cf8] via-[#0284c7] via-[#818cf8] to-[#38bdf8]',
    yalaSubcards: {
      jct: 'bg-[#090d16] border-sky-500/50 text-amber-200 hover:border-amber-400',
      jctText: 'text-amber-300',
      prov: 'bg-[#040913] border-slate-700 text-slate-200 hover:border-sky-400',
      provText: 'text-sky-300',
      sfr: 'bg-[#090d16] border-sky-500/40 text-sky-100 hover:border-sky-300',
      sfrText: 'text-sky-200',
    },
    adminBox: {
      bg: 'bg-gradient-to-br from-[#0c203b]/80 to-[#040d1a]',
      border: 'border-sky-500/40',
      titleColor: 'text-sky-200',
      badge: 'text-sky-200 bg-sky-950 border-sky-500/30',
      itemText: 'text-sky-100',
      hoverText: 'hover:text-sky-300',
    },
    spBoxYala: {
      bg: 'bg-gradient-to-br from-[#121c2e] to-[#060a12]',
      border: 'border-amber-500/40',
      titleColor: 'text-amber-200',
      badge: 'text-amber-200 bg-amber-950 border-amber-500/30',
      itemText: 'text-sky-100',
      hoverText: 'hover:text-amber-300',
    },
    spBoxPtn: {
      bg: 'bg-gradient-to-br from-[#0c2442] to-[#041324]',
      border: 'border-sky-500/40',
      titleColor: 'text-sky-200',
      badge: 'text-sky-200 bg-sky-950 border-sky-500/30',
      itemText: 'text-sky-100',
      hoverText: 'hover:text-sky-300',
    },
    spBoxNrt: {
      bg: 'bg-gradient-to-br from-[#0a2e24] to-[#031712]',
      border: 'border-emerald-500/40',
      titleColor: 'text-emerald-200',
      badge: 'text-emerald-200 bg-emerald-950 border-emerald-500/30',
      itemText: 'text-emerald-100',
      hoverText: 'hover:text-emerald-300',
    },
    districtsBox: {
      bg: 'bg-gradient-to-br from-[#2b0815] to-[#14030a]',
      border: 'border-rose-500/40',
      titleColor: 'text-rose-200',
      itemText: 'text-rose-100',
      hoverText: 'hover:text-white',
    },
    provHeaderPtn: 'bg-[#041324] border-sky-500/50 text-sky-200 hover:border-sky-400',
    provHeaderNrt: 'bg-[#031712] border-emerald-500/50 text-emerald-200 hover:border-emerald-400',
    provHeaderSkh: 'bg-[#17030a] border-rose-500/50 text-rose-200 hover:border-rose-400',
    table: {
      bg: 'bg-[#030a14]',
      border: 'border-sky-500/30',
      headerBg: 'bg-[#0c203b]',
      headerText: 'text-sky-100',
      posHeader: 'bg-[#041324] text-sky-200 border-sky-500',
      occHeader: 'bg-[#031712] text-emerald-200 border-emerald-500',
      pctHeader: 'bg-[#121c2e] text-amber-200 border-amber-500',
      shortageHeader: 'bg-[#17030a] text-rose-200 border-rose-500',
      divider: 'divide-slate-900',
      rowHover: 'hover:bg-sky-950/40',
      primaryText: 'text-white',
      posText: 'text-sky-200',
      occText: 'text-emerald-300',
      pctText: 'text-amber-300',
      shortageText: 'text-rose-400',
      linkText: 'text-sky-300 hover:text-white',
      totalBg: 'bg-[#0c203b]',
      totalBorder: 'border-sky-500/50',
      totalText: 'text-sky-200',
    },
  },
};

export const OrganizationTree: React.FC<OrgTreeProps> = ({
  records,
  onNavigateToZone,
  onSelectUnitRoster,
  chartTheme = 'army',
  onSelectChartTheme,
}) => {
  const [internalChartTheme, setInternalChartTheme] = useState<ChartThemeId>(() => {
    try {
      const saved = localStorage.getItem('police_chart_theme_p9');
      if (saved && ['army', 'pastel', 'royal-navy', 'crimson', 'emerald', 'cyber'].includes(saved)) {
        return saved as ChartThemeId;
      }
    } catch (e) {}
    return chartTheme || 'army';
  });

  const activeTheme = chartTheme || internalChartTheme;
  const currentStyle = CHART_STYLES[activeTheme] || CHART_STYLES.army;

  const handleThemeChange = (newTheme: ChartThemeId) => {
    setInternalChartTheme(newTheme);
    try {
      localStorage.setItem('police_chart_theme_p9', newTheme);
    } catch (e) {}
    if (onSelectChartTheme) {
      onSelectChartTheme(newTheme);
    }
  };

  const [activeTerroristIncidentsProvince, setActiveTerroristIncidentsProvince] = useState<string | null>(null);

  // Group calculations
  const yalaSum = computeGroupSummary('ภ.จว.ยะลา', records);
  const ptnSum = computeGroupSummary('ภ.จว.ปัตตานี', records);
  const nrtSum = computeGroupSummary('ภ.จว.นราธิวาส', records);
  const jctSum = computeGroupSummary('บก.สืบสวนสอบสวน จชต.', records);
  const sfrSum = computeGroupSummary('ศฝร.ภ.9', records);

  // 4 Risk districts Songkhla: นาทวี, เทพา, สะบ้าย้อย, จะนะ
  const songkhlaRiskRecords = records.filter(r => r.group === 'ภ.จว.สงขลา' && r.isRiskAreaSongkhla);
  const songkhlaRiskPos = songkhlaRiskRecords.reduce((acc, r) => acc + r.totalAll_pos, 0);
  const songkhlaRiskOcc = songkhlaRiskRecords.reduce((acc, r) => acc + r.totalAll_occ, 0);

  // Grand total for the chart
  const grandPos = records.reduce((acc, r) => acc + r.totalAll_pos, 0);
  const grandOcc = records.reduce((acc, r) => acc + r.totalAll_occ, 0);

  // Split into Admin & Support vs Police Stations (สภ.)
  const getYalaBreakdown = () => {
    const admin = records.filter(r => r.group === 'ภ.จว.ยะลา' && (r.name.includes('ภ.จว.') || r.name.includes('ฝ่ายอำนวยการ') || r.name.includes('ปฏิบัติการพิเศษ') || r.name.includes('สืบสวน') || r.name.includes('กลุ่มงานสอบสวน')));
    const sp = records.filter(r => r.group === 'ภ.จว.ยะลา' && r.name.startsWith('สภ.'));
    const adminPos = admin.reduce((s, r) => s + r.totalAll_pos, 0);
    const adminOcc = admin.reduce((s, r) => s + r.totalAll_occ, 0);
    const spPos = sp.reduce((s, r) => s + r.totalAll_pos, 0);
    const spOcc = sp.reduce((s, r) => s + r.totalAll_occ, 0);
    return { admin, sp, adminPos, adminOcc, spPos, spOcc };
  };

  const getPattaniBreakdown = () => {
    const admin = records.filter(r => r.group === 'ภ.จว.ปัตตานี' && (r.name.includes('ภ.จว.') || r.name.includes('ฝ่ายอำนวยการ') || r.name.includes('ปฏิบัติการพิเศษ') || r.name.includes('สืบสวน') || r.name.includes('กลุ่มงานสอบสวน')));
    const sp = records.filter(r => r.group === 'ภ.จว.ปัตตานี' && r.name.startsWith('สภ.'));
    const adminPos = admin.reduce((s, r) => s + r.totalAll_pos, 0);
    const adminOcc = admin.reduce((s, r) => s + r.totalAll_occ, 0);
    const spPos = sp.reduce((s, r) => s + r.totalAll_pos, 0);
    const spOcc = sp.reduce((s, r) => s + r.totalAll_occ, 0);
    return { admin, sp, adminPos, adminOcc, spPos, spOcc };
  };

  const getNarathiwatBreakdown = () => {
    const admin = records.filter(r => r.group === 'ภ.จว.นราธิวาส' && (r.name.includes('ภ.จว.') || r.name.includes('ฝ่ายอำนวยการ') || r.name.includes('ปฏิบัติการพิเศษ') || r.name.includes('สืบสวน') || r.name.includes('กลุ่มงานสอบสวน')));
    const sp = records.filter(r => r.group === 'ภ.จว.นราธิวาส' && r.name.startsWith('สภ.'));
    const adminPos = admin.reduce((s, r) => s + r.totalAll_pos, 0);
    const adminOcc = admin.reduce((s, r) => s + r.totalAll_occ, 0);
    const spPos = sp.reduce((s, r) => s + r.totalAll_pos, 0);
    const spOcc = sp.reduce((s, r) => s + r.totalAll_occ, 0);
    return { admin, sp, adminPos, adminOcc, spPos, spOcc };
  };

  const yalaBreakdown = getYalaBreakdown();
  const pattaniBreakdown = getPattaniBreakdown();
  const narathiwatBreakdown = getNarathiwatBreakdown();

  // Helper for Songkhla districts (4 อำเภอ 8 สภ.)
  const getSongkhlaDistrictStats = (subUnits: string[]) => {
    const list = records.filter(r => r.group === 'ภ.จว.สงขลา' && subUnits.some(s => r.name.includes(s)));
    const pos = list.reduce((acc, r) => acc + r.totalAll_pos, 0);
    const occ = list.reduce((acc, r) => acc + r.totalAll_occ, 0);
    return { list, pos, occ };
  };

  const nathaweeStats = getSongkhlaDistrictStats(['สภ.นาทวี', 'สภ.สะท้อน']);
  const thepaStats = getSongkhlaDistrictStats(['สภ.เทพา', 'สภ.ห้วยปลิง']);
  const sabaStats = getSongkhlaDistrictStats(['สภ.สะบ้าย้อย', 'สภ.บ้านโหนด']);
  const chanaStats = getSongkhlaDistrictStats(['สภ.จะนะ', 'สภ.ควนมีด']);

  const handleUnitClick = (unit: PoliceUnitRecord) => {
    if (onSelectUnitRoster) {
      onSelectUnitRoster(unit);
    }
  };

  return (
    <div className="space-y-6">
      {/* Organizational Hierarchy Chart */}
      <div className={`${currentStyle.containerBg} border-2 ${currentStyle.containerBorder} rounded-3xl p-6 sm:p-8 shadow-2xl ${currentStyle.textColor} overflow-x-auto relative transition-colors duration-500`}>
        {/* Subtle mesh/tactical background grid */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none rounded-3xl"
          style={{
            backgroundImage: `radial-gradient(${currentStyle.gridDot} 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="min-w-[1040px] flex flex-col items-center relative z-10">
          {/* Level 0: สำนักงานตำรวจแห่งชาติ (ตร.) */}
          <div className="flex flex-col items-center mb-4">
            <div
              className="px-9 py-3.5 rounded-2xl shadow-xl border-2 border-[#d4af37] flex items-center justify-center relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
              style={{
                background: 'linear-gradient(135deg, #58141c 0%, #3f0e14 45%, #24070a 100%)',
                boxShadow: '0 8px 24px -4px rgba(88, 20, 28, 0.6), 0 0 0 1px rgba(212, 175, 55, 0.4)',
              }}
            >
              <div className="gold-light-ray"></div>
              <div className="flex flex-col items-center text-center">
                <span className="font-bold text-lg sm:text-xl tracking-wider font-['Prompt'] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                  สำนักงานตำรวจแห่งชาติ (ตร.)
                </span>
              </div>
            </div>
            {/* Tactical Connector to Level 1 */}
            <div className={`w-1.5 h-6 bg-gradient-to-b ${currentStyle.connectorGradient} rounded-full shadow-xs`}></div>
          </div>

          {/* Level 1: ภ.9 Main Node */}
          <div className="flex flex-col items-center mb-6">
            <div
              className={`px-10 py-4 rounded-2xl shadow-xl border-2 ${currentStyle.p9Card.border} flex flex-col items-center hover:scale-[1.02] transition-transform`}
              style={{
                background: currentStyle.p9Card.bg,
                boxShadow: currentStyle.p9Card.shadow,
              }}
            >
              <div className={`font-bold text-lg sm:text-xl font-['Prompt'] ${currentStyle.p9Card.textColor} tracking-wide flex items-center gap-2.5`}>
                <span className={`w-2.5 h-2.5 rounded-full ${currentStyle.p9Card.pulseDot} animate-pulse inline-block`} />
                <span>ตำรวจภูธรภาค 9</span>
              </div>
              <div className={`text-xs font-mono font-bold ${currentStyle.p9Card.badgeText} ${currentStyle.p9Card.badgeBg} px-4 py-1 rounded-full mt-2 border ${currentStyle.p9Card.badgeBorder} shadow-xs`}>
                [รวม: {grandPos.toLocaleString()} / {grandOcc.toLocaleString()} นาย]
              </div>
            </div>
            <div className={`w-1.5 h-6 bg-gradient-to-b ${currentStyle.connectorGradient} rounded-full shadow-xs`}></div>
          </div>

          {/* Branch Connector Bar */}
          <div className="w-full flex justify-between px-16 relative">
            <div className={`absolute top-0 left-16 right-16 h-1.5 bg-gradient-to-r ${currentStyle.branchBar} rounded-full shadow-xs`}></div>
          </div>

          {/* Level 2: 4 Main Branches / 4 Functions */}
          <div className="grid grid-cols-4 gap-4 w-full mt-6">
            {/* Branch 1: 1. จังหวัดยะลา */}
            <div className="flex flex-col items-center space-y-3">
              <ProvinceSummaryCard
                provinceKey="yala"
                zoneId="yala"
                title="ยะลา"
                badgeTitle="ยะลา"
                subtitle="ตรวจสอบสถานภาพ ยะลา"
                posCount={yalaSum.totalAll_pos + jctSum.totalAll_pos + sfrSum.totalAll_pos}
                occCount={yalaSum.totalAll_occ + jctSum.totalAll_occ + sfrSum.totalAll_occ}
                chartTheme={activeTheme}
                onNavigate={onNavigateToZone}
              />

              {/* Sub-cards */}
              <div className="grid grid-cols-3 gap-1.5 w-full text-[11px]">
                <div
                  onClick={() => onNavigateToZone && onNavigateToZone('yala')}
                  className={`${currentStyle.yalaSubcards.jct} p-2 rounded-xl text-center shadow-md cursor-pointer hover:scale-105 transition`}
                  title="คลิกเพื่อดูตาราง บก.สส.จชต."
                >
                  <div className="font-bold leading-tight">บก.สส.จชต.</div>
                  <div className={`text-[10px] ${currentStyle.yalaSubcards.jctText} font-mono mt-0.5`}>[{jctSum.totalAll_pos}/{jctSum.totalAll_occ}]</div>
                </div>
                <div
                  onClick={() => onNavigateToZone && onNavigateToZone('yala')}
                  className={`${currentStyle.yalaSubcards.prov} p-2 rounded-xl text-center shadow-md cursor-pointer hover:scale-105 transition`}
                  title="คลิกเพื่อดูตาราง ภ.จว.ยะลา"
                >
                  <div className="font-bold leading-tight">ภ.จว.ยะลา</div>
                  <div className={`text-[10px] ${currentStyle.yalaSubcards.provText} font-mono mt-0.5`}>[{yalaSum.totalAll_pos}/{yalaSum.totalAll_occ}]</div>
                </div>
                <div
                  onClick={() => onNavigateToZone && onNavigateToZone('yala')}
                  className={`${currentStyle.yalaSubcards.sfr} p-2 rounded-xl text-center shadow-md cursor-pointer hover:scale-105 transition`}
                  title="คลิกเพื่อดูตาราง ศฝร.ภ.9"
                >
                  <div className="font-bold leading-tight">ศฝร.ภ.9</div>
                  <div className={`text-[10px] ${currentStyle.yalaSubcards.sfrText} font-mono mt-0.5`}>[{sfrSum.totalAll_pos}/{sfrSum.totalAll_occ}]</div>
                </div>
              </div>

              {/* Breakdown: หน่วยอำนวยการ vs สภ. */}
              <div className="grid grid-cols-2 gap-2.5 w-full items-stretch">
                <div className={`${currentStyle.adminBox.bg} p-3.5 rounded-2xl shadow-xl text-xs border ${currentStyle.adminBox.border} flex flex-col min-h-[640px]`}>
                  <div className={`font-bold border-b border-white/10 pb-2 mb-2 text-center ${currentStyle.adminBox.titleColor}`}>
                    <div>หน่วยอำนวยการ</div>
                    <div className="text-[11px] font-normal opacity-90">และสนับสนุน ({yalaBreakdown.admin.length} หน่วย)</div>
                  </div>
                  <ul className={`space-y-1.5 text-[11px] ${currentStyle.adminBox.itemText} flex-1 overflow-y-auto min-h-[520px] max-h-[740px] chart-scrollbar pr-1`}>
                    {yalaBreakdown.admin.map((u) => (
                      <li
                        key={u.id}
                        onClick={() => handleUnitClick(u)}
                        className={`truncate cursor-pointer ${currentStyle.adminBox.hoverText} hover:translate-x-0.5 transition-all p-1.5 rounded-lg hover:bg-white/10 flex items-center`}
                        title="คลิกดูตัวคนในหน่วยนี้"
                      >
                        <span>• {u.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`${currentStyle.spBoxYala.bg} p-3.5 rounded-2xl shadow-xl text-xs border ${currentStyle.spBoxYala.border} flex flex-col min-h-[640px]`}>
                  <div className={`font-bold border-b border-white/10 pb-2 mb-2 text-center ${currentStyle.spBoxYala.titleColor}`}>
                    <div>สภ. ในสังกัด</div>
                    <div className="text-[11px] font-normal opacity-90">({yalaBreakdown.sp.length} สถานี)</div>
                  </div>
                  <ul className={`space-y-1.5 text-[11px] ${currentStyle.spBoxYala.itemText} flex-1 overflow-y-auto min-h-[520px] max-h-[740px] chart-scrollbar pr-1`}>
                    {yalaBreakdown.sp.map((u) => (
                      <li
                        key={u.id}
                        onClick={() => handleUnitClick(u)}
                        className={`truncate cursor-pointer ${currentStyle.spBoxYala.hoverText} hover:translate-x-0.5 transition-all p-1.5 rounded-lg hover:bg-white/10 flex items-center`}
                        title="คลิกดูตัวคนใน สภ. นี้"
                      >
                        <span>• {u.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Branch 2: 2. จังหวัดปัตตานี */}
            <div className="flex flex-col items-center space-y-3">
              <ProvinceSummaryCard
                provinceKey="pattani"
                zoneId="pattani"
                title="ปัตตานี"
                badgeTitle="ปัตตานี"
                subtitle="ตรวจสอบสถานภาพ ปัตตานี"
                posCount={ptnSum.totalAll_pos}
                occCount={ptnSum.totalAll_occ}
                chartTheme={activeTheme}
                onNavigate={onNavigateToZone}
              />

              <div
                onClick={() => onNavigateToZone && onNavigateToZone('pattani')}
                className={`w-full ${currentStyle.provHeaderPtn} p-2.5 rounded-xl text-center shadow-md cursor-pointer transition`}
              >
                <div className="font-bold text-xs">ภ.จว.ปัตตานี (21 หน่วย)</div>
                <div className="text-[11px] font-mono mt-0.5 opacity-90">[{ptnSum.totalAll_pos}/{ptnSum.totalAll_occ}]</div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 w-full items-stretch">
                <div className={`${currentStyle.adminBox.bg} p-3.5 rounded-2xl shadow-xl text-xs border ${currentStyle.adminBox.border} flex flex-col min-h-[640px]`}>
                  <div className={`font-bold border-b border-white/10 pb-2 mb-2 text-center ${currentStyle.adminBox.titleColor}`}>
                    <div>หน่วยอำนวยการ</div>
                    <div className="text-[11px] font-normal opacity-90">และสนับสนุน ({pattaniBreakdown.admin.length} หน่วย)</div>
                  </div>
                  <ul className={`space-y-1.5 text-[11px] ${currentStyle.adminBox.itemText} flex-1 overflow-y-auto min-h-[520px] max-h-[740px] chart-scrollbar pr-1`}>
                    {pattaniBreakdown.admin.map((u) => (
                      <li
                        key={u.id}
                        onClick={() => handleUnitClick(u)}
                        className={`truncate cursor-pointer ${currentStyle.adminBox.hoverText} hover:translate-x-0.5 transition-all p-1.5 rounded-lg hover:bg-white/10 flex items-center`}
                        title="คลิกดูตัวคนในหน่วยนี้"
                      >
                        <span>• {u.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`${currentStyle.spBoxPtn.bg} p-3.5 rounded-2xl shadow-xl text-xs border ${currentStyle.spBoxPtn.border} flex flex-col min-h-[640px]`}>
                  <div className={`font-bold border-b border-white/10 pb-2 mb-2 text-center ${currentStyle.spBoxPtn.titleColor}`}>
                    <div>สภ. ในสังกัด</div>
                    <div className="text-[11px] font-normal opacity-90">({pattaniBreakdown.sp.length} สถานี)</div>
                  </div>
                  <ul className={`space-y-1.5 text-[11px] ${currentStyle.spBoxPtn.itemText} flex-1 overflow-y-auto min-h-[520px] max-h-[740px] chart-scrollbar pr-1`}>
                    {pattaniBreakdown.sp.map((u) => (
                      <li
                        key={u.id}
                        onClick={() => handleUnitClick(u)}
                        className={`truncate cursor-pointer ${currentStyle.spBoxPtn.hoverText} hover:translate-x-0.5 transition-all p-1.5 rounded-lg hover:bg-white/10 flex items-center`}
                        title="คลิกดูตัวคนใน สภ. นี้"
                      >
                        <span>• {u.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Branch 3: 3. จังหวัดนราธิวาส */}
            <div className="flex flex-col items-center space-y-3">
              <ProvinceSummaryCard
                provinceKey="narathiwat"
                zoneId="narathiwat"
                title="นราธิวาส"
                badgeTitle="นราธิวาส"
                subtitle="ตรวจสอบสถานภาพ นราธิวาส"
                posCount={nrtSum.totalAll_pos}
                occCount={nrtSum.totalAll_occ}
                chartTheme={activeTheme}
                onNavigate={onNavigateToZone}
              />

              <div
                onClick={() => onNavigateToZone && onNavigateToZone('narathiwat')}
                className={`w-full ${currentStyle.provHeaderNrt} p-2.5 rounded-xl text-center shadow-md cursor-pointer transition`}
              >
                <div className="font-bold text-xs">ภ.จว.นราธิวาส (24 หน่วย)</div>
                <div className="text-[11px] font-mono mt-0.5 opacity-90">[{nrtSum.totalAll_pos}/{nrtSum.totalAll_occ}]</div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 w-full items-stretch">
                <div className={`${currentStyle.adminBox.bg} p-3.5 rounded-2xl shadow-xl text-xs border ${currentStyle.adminBox.border} flex flex-col min-h-[640px]`}>
                  <div className={`font-bold border-b border-white/10 pb-2 mb-2 text-center ${currentStyle.adminBox.titleColor}`}>
                    <div>หน่วยอำนวยการ</div>
                    <div className="text-[11px] font-normal opacity-90">และสนับสนุน ({narathiwatBreakdown.admin.length} หน่วย)</div>
                  </div>
                  <ul className={`space-y-1.5 text-[11px] ${currentStyle.adminBox.itemText} flex-1 overflow-y-auto min-h-[520px] max-h-[740px] chart-scrollbar pr-1`}>
                    {narathiwatBreakdown.admin.map((u) => (
                      <li
                        key={u.id}
                        onClick={() => handleUnitClick(u)}
                        className={`truncate cursor-pointer ${currentStyle.adminBox.hoverText} hover:translate-x-0.5 transition-all p-1.5 rounded-lg hover:bg-white/10 flex items-center`}
                        title="คลิกดูตัวคนในหน่วยนี้"
                      >
                        <span>• {u.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`${currentStyle.spBoxNrt.bg} p-3.5 rounded-2xl shadow-xl text-xs border ${currentStyle.spBoxNrt.border} flex flex-col min-h-[640px]`}>
                  <div className={`font-bold border-b border-white/10 pb-2 mb-2 text-center ${currentStyle.spBoxNrt.titleColor}`}>
                    <div>สภ. ในสังกัด</div>
                    <div className="text-[11px] font-normal opacity-90">({narathiwatBreakdown.sp.length} สถานี)</div>
                  </div>
                  <ul className={`space-y-1.5 text-[11px] ${currentStyle.spBoxNrt.itemText} flex-1 overflow-y-auto min-h-[520px] max-h-[740px] chart-scrollbar pr-1`}>
                    {narathiwatBreakdown.sp.map((u) => (
                      <li
                        key={u.id}
                        onClick={() => handleUnitClick(u)}
                        className={`truncate cursor-pointer ${currentStyle.spBoxNrt.hoverText} hover:translate-x-0.5 transition-all p-1.5 rounded-lg hover:bg-white/10 flex items-center`}
                        title="คลิกดูตัวคนใน สภ. นี้"
                      >
                        <span>• {u.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Branch 4: 4. พื้นที่เสี่ยงภัย จว.สงขลา */}
            <div className="flex flex-col items-center space-y-3">
              <ProvinceSummaryCard
                provinceKey="songkhla"
                zoneId="songkhla_risk"
                title="สงขลา"
                badgeTitle="สงขลา"
                subtitle="ตรวจสอบสถานภาพสงขลา"
                posCount={songkhlaRiskPos}
                occCount={songkhlaRiskOcc}
                chartTheme={activeTheme}
                onNavigate={onNavigateToZone}
              />

              <div
                onClick={() => onNavigateToZone && onNavigateToZone('songkhla_risk')}
                className={`w-full ${currentStyle.provHeaderSkh} p-2.5 rounded-xl text-center shadow-md cursor-pointer transition`}
              >
                <div className="font-bold text-xs">ภ.จว.สงขลา (เฉพาะ 4 อำเภอ 8 สภ.)</div>
                <div className="text-[11px] font-mono font-bold mt-0.5 opacity-90">
                  [{songkhlaRiskPos}/{songkhlaRiskOcc}]
                </div>
              </div>

              {/* 4 Districts sub-grid matching the elongated 640px height */}
              <div className="grid grid-cols-2 gap-2.5 w-full items-stretch min-h-[640px]">
                {/* District 1: นาทวี */}
                <div className={`${currentStyle.districtsBox.bg} p-3 rounded-2xl shadow-xl text-xs border ${currentStyle.districtsBox.border} flex flex-col justify-between min-h-[305px]`}>
                  <div>
                    <div className={`font-bold text-center border-b border-white/10 pb-1.5 mb-2 ${currentStyle.districtsBox.titleColor}`}>
                      <div>อ.นาทวี (2 สภ.)</div>
                    </div>
                    <ul className={`text-[11px] space-y-2 ${currentStyle.districtsBox.itemText}`}>
                      {nathaweeStats.list.map((u) => (
                        <li
                          key={u.id}
                          onClick={() => handleUnitClick(u)}
                          className={`cursor-pointer ${currentStyle.districtsBox.hoverText} hover:translate-x-0.5 transition-all p-1.5 rounded-lg hover:bg-white/10 flex items-center`}
                          title="คลิกดูตัวคนใน สภ. นี้"
                        >
                          <span>• {u.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 border-t border-white/10 text-[10px] text-center text-rose-300/80">
                    พื้นที่ความมั่นคงสีแดง
                  </div>
                </div>

                {/* District 2: เทพา */}
                <div className={`${currentStyle.districtsBox.bg} p-3 rounded-2xl shadow-xl text-xs border ${currentStyle.districtsBox.border} flex flex-col justify-between min-h-[305px]`}>
                  <div>
                    <div className={`font-bold text-center border-b border-white/10 pb-1.5 mb-2 ${currentStyle.districtsBox.titleColor}`}>
                      <div>อ.เทพา (2 สภ.)</div>
                    </div>
                    <ul className={`text-[11px] space-y-2 ${currentStyle.districtsBox.itemText}`}>
                      {thepaStats.list.map((u) => (
                        <li
                          key={u.id}
                          onClick={() => handleUnitClick(u)}
                          className={`cursor-pointer ${currentStyle.districtsBox.hoverText} hover:translate-x-0.5 transition-all p-1.5 rounded-lg hover:bg-white/10 flex items-center`}
                          title="คลิกดูตัวคนใน สภ. นี้"
                        >
                          <span>• {u.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 border-t border-white/10 text-[10px] text-center text-rose-300/80">
                    พื้นที่ความมั่นคงสีแดง
                  </div>
                </div>

                {/* District 3: สะบ้าย้อย */}
                <div className={`${currentStyle.districtsBox.bg} p-3 rounded-2xl shadow-xl text-xs border ${currentStyle.districtsBox.border} flex flex-col justify-between min-h-[305px]`}>
                  <div>
                    <div className={`font-bold text-center border-b border-white/10 pb-1.5 mb-2 ${currentStyle.districtsBox.titleColor}`}>
                      <div>อ.สะบ้าย้อย (2 สภ.)</div>
                    </div>
                    <ul className={`text-[11px] space-y-2 ${currentStyle.districtsBox.itemText}`}>
                      {sabaStats.list.map((u) => (
                        <li
                          key={u.id}
                          onClick={() => handleUnitClick(u)}
                          className={`cursor-pointer ${currentStyle.districtsBox.hoverText} hover:translate-x-0.5 transition-all p-1.5 rounded-lg hover:bg-white/10 flex items-center`}
                          title="คลิกดูตัวคนใน สภ. นี้"
                        >
                          <span>• {u.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 border-t border-white/10 text-[10px] text-center text-rose-300/80">
                    พื้นที่ความมั่นคงสีแดง
                  </div>
                </div>

                {/* District 4: จะนะ */}
                <div className={`${currentStyle.districtsBox.bg} p-3 rounded-2xl shadow-xl text-xs border ${currentStyle.districtsBox.border} flex flex-col justify-between min-h-[305px]`}>
                  <div>
                    <div className={`font-bold text-center border-b border-white/10 pb-1.5 mb-2 ${currentStyle.districtsBox.titleColor}`}>
                      <div>อ.จะนะ (2 สภ.)</div>
                    </div>
                    <ul className={`text-[11px] space-y-2 ${currentStyle.districtsBox.itemText}`}>
                      {chanaStats.list.map((u) => (
                        <li
                          key={u.id}
                          onClick={() => handleUnitClick(u)}
                          className={`cursor-pointer ${currentStyle.districtsBox.hoverText} hover:translate-x-0.5 transition-all p-1.5 rounded-lg hover:bg-white/10 flex items-center`}
                          title="คลิกดูตัวคนใน สภ. นี้"
                        >
                          <span>• {u.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 border-t border-white/10 text-[10px] text-center text-rose-300/80">
                    พื้นที่ความมั่นคงสีแดง
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Table directly matching the Infographic's bottom right table */}
      <div className={`${currentStyle.table.bg} p-6 rounded-2xl border-2 ${currentStyle.table.border} shadow-xl transition-colors duration-500`}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black/20 border border-white/20 flex items-center justify-center font-bold shadow-xs">
              📊
            </div>
            <div>
              <h3 className={`font-bold text-base ${currentStyle.table.primaryText} font-['Prompt']`}>
                ตารางสรุปยอดรวมกำลังพลแยกตามหน่วยงานหลัก (คลิกแถวเพื่อดูตารางสถานภาพตัวคน)
              </h3>
              <p className="text-xs opacity-70">เปรียบเทียบอัตราตำแหน่งและจำนวนคนครองจริง พร้อมอัตราความพร้อมในการปฏิบัติหน้าที่</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className={currentStyle.table.headerText}>
                <th className={`px-4 py-3 text-left font-bold rounded-tl-xl ${currentStyle.table.headerBg} border-b-2 ${currentStyle.table.border}`}>หน่วยงานหลัก / พื้นที่</th>
                <th className={`px-4 py-3 text-center font-bold ${currentStyle.table.posHeader} border-b-2`}>อัตราตำแหน่ง</th>
                <th className={`px-4 py-3 text-center font-bold ${currentStyle.table.occHeader} border-b-2`}>คนครอง (ตัวคนจริง)</th>
                <th className={`px-4 py-3 text-center font-bold ${currentStyle.table.pctHeader} border-b-2`}>อัตราการครองคน (%)</th>
                <th className={`px-4 py-3 text-center font-bold ${currentStyle.table.shortageHeader} border-b-2`}>ขาดแคลน (นาย)</th>
                <th className={`px-4 py-3 text-center font-bold ${currentStyle.table.headerBg} rounded-tr-xl border-b-2 ${currentStyle.table.border}`}>การจัดการ</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${currentStyle.table.divider}`}>
              <tr
                onClick={() => onNavigateToZone && onNavigateToZone('yala')}
                className={`${currentStyle.table.rowHover} cursor-pointer transition`}
              >
                <td className={`px-4 py-2.5 font-medium ${currentStyle.table.primaryText} flex items-center gap-2`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ca8a04] shadow-xs"></span>
                  <span>ภ.จว.ยะลา (รวม จว.ยะลา)</span>
                </td>
                <td className={`px-4 py-2.5 text-center font-mono ${currentStyle.table.posText}`}>{yalaSum.totalAll_pos.toLocaleString()}</td>
                <td className={`px-4 py-2.5 text-center font-mono font-bold ${currentStyle.table.occText}`}>{yalaSum.totalAll_occ.toLocaleString()}</td>
                <td className={`px-4 py-2.5 text-center font-mono ${currentStyle.table.pctText} font-bold`}>
                  {yalaSum.totalAll_pos > 0 ? ((yalaSum.totalAll_occ / yalaSum.totalAll_pos) * 100).toFixed(1) : 0}%
                </td>
                <td className={`px-4 py-2.5 text-center font-mono ${currentStyle.table.shortageText} font-semibold`}>
                  -{(yalaSum.totalAll_pos - yalaSum.totalAll_occ).toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className={`text-xs ${currentStyle.table.linkText} font-medium hover:underline`}>เปิดตารางตัวคน →</span>
                </td>
              </tr>
              <tr
                onClick={() => onNavigateToZone && onNavigateToZone('yala')}
                className={`${currentStyle.table.rowHover} cursor-pointer transition`}
              >
                <td className={`px-4 py-2.5 font-medium ${currentStyle.table.primaryText} flex items-center gap-2`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ca8a04] shadow-xs"></span>
                  <span>บก.สส.จชต.</span>
                </td>
                <td className={`px-4 py-2.5 text-center font-mono ${currentStyle.table.posText}`}>{jctSum.totalAll_pos.toLocaleString()}</td>
                <td className={`px-4 py-2.5 text-center font-mono font-bold ${currentStyle.table.occText}`}>{jctSum.totalAll_occ.toLocaleString()}</td>
                <td className={`px-4 py-2.5 text-center font-mono ${currentStyle.table.pctText} font-bold`}>
                  {jctSum.totalAll_pos > 0 ? ((jctSum.totalAll_occ / jctSum.totalAll_pos) * 100).toFixed(1) : 0}%
                </td>
                <td className={`px-4 py-2.5 text-center font-mono ${currentStyle.table.shortageText} font-semibold`}>
                  -{(jctSum.totalAll_pos - jctSum.totalAll_occ).toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className={`text-xs ${currentStyle.table.linkText} font-medium hover:underline`}>เปิดตารางตัวคน →</span>
                </td>
              </tr>
              <tr
                onClick={() => onNavigateToZone && onNavigateToZone('yala')}
                className={`${currentStyle.table.rowHover} cursor-pointer transition`}
              >
                <td className={`px-4 py-2.5 font-medium ${currentStyle.table.primaryText} flex items-center gap-2`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ca8a04] shadow-xs"></span>
                  <span>ศฝร.ภ.9</span>
                </td>
                <td className={`px-4 py-2.5 text-center font-mono ${currentStyle.table.posText}`}>{sfrSum.totalAll_pos.toLocaleString()}</td>
                <td className={`px-4 py-2.5 text-center font-mono font-bold ${currentStyle.table.occText}`}>{sfrSum.totalAll_occ.toLocaleString()}</td>
                <td className={`px-4 py-2.5 text-center font-mono ${currentStyle.table.pctText} font-bold`}>
                  {sfrSum.totalAll_pos > 0 ? ((sfrSum.totalAll_occ / sfrSum.totalAll_pos) * 100).toFixed(1) : 0}%
                </td>
                <td className={`px-4 py-2.5 text-center font-mono ${currentStyle.table.shortageText} font-semibold`}>
                  -{(sfrSum.totalAll_pos - sfrSum.totalAll_occ).toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className={`text-xs ${currentStyle.table.linkText} font-medium hover:underline`}>เปิดตารางตัวคน →</span>
                </td>
              </tr>
              <tr
                onClick={() => onNavigateToZone && onNavigateToZone('pattani')}
                className={`${currentStyle.table.rowHover} cursor-pointer transition`}
              >
                <td className={`px-4 py-2.5 font-medium ${currentStyle.table.primaryText} flex items-center gap-2`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#14b8a6] shadow-xs"></span>
                  <span>ภ.จว.ปัตตานี (จว.ปัตตานี)</span>
                </td>
                <td className={`px-4 py-2.5 text-center font-mono ${currentStyle.table.posText}`}>{ptnSum.totalAll_pos.toLocaleString()}</td>
                <td className={`px-4 py-2.5 text-center font-mono font-bold ${currentStyle.table.occText}`}>{ptnSum.totalAll_occ.toLocaleString()}</td>
                <td className={`px-4 py-2.5 text-center font-mono ${currentStyle.table.pctText} font-bold`}>
                  {ptnSum.totalAll_pos > 0 ? ((ptnSum.totalAll_occ / ptnSum.totalAll_pos) * 100).toFixed(1) : 0}%
                </td>
                <td className={`px-4 py-2.5 text-center font-mono ${currentStyle.table.shortageText} font-semibold`}>
                  -{(ptnSum.totalAll_pos - ptnSum.totalAll_occ).toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className={`text-xs ${currentStyle.table.linkText} font-medium hover:underline`}>เปิดตารางตัวคน →</span>
                </td>
              </tr>
              <tr
                onClick={() => onNavigateToZone && onNavigateToZone('narathiwat')}
                className={`${currentStyle.table.rowHover} cursor-pointer transition`}
              >
                <td className={`px-4 py-2.5 font-medium ${currentStyle.table.primaryText} flex items-center gap-2`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#84cc16] shadow-xs"></span>
                  <span>ภ.จว.นราธิวาส (จว.นราธิวาส)</span>
                </td>
                <td className={`px-4 py-2.5 text-center font-mono ${currentStyle.table.posText}`}>{nrtSum.totalAll_pos.toLocaleString()}</td>
                <td className={`px-4 py-2.5 text-center font-mono font-bold ${currentStyle.table.occText}`}>{nrtSum.totalAll_occ.toLocaleString()}</td>
                <td className={`px-4 py-2.5 text-center font-mono ${currentStyle.table.pctText} font-bold`}>
                  {nrtSum.totalAll_pos > 0 ? ((nrtSum.totalAll_occ / nrtSum.totalAll_pos) * 100).toFixed(1) : 0}%
                </td>
                <td className={`px-4 py-2.5 text-center font-mono ${currentStyle.table.shortageText} font-semibold`}>
                  -{(nrtSum.totalAll_pos - nrtSum.totalAll_occ).toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className={`text-xs ${currentStyle.table.linkText} font-medium hover:underline`}>เปิดตารางตัวคน →</span>
                </td>
              </tr>
              <tr
                onClick={() => onNavigateToZone && onNavigateToZone('songkhla_risk')}
                className={`${currentStyle.table.rowHover} cursor-pointer transition`}
              >
                <td className={`px-4 py-2.5 font-medium ${currentStyle.table.primaryText} flex items-center gap-2`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e] shadow-xs"></span>
                  <span>ภ.จว.สงขลา (เฉพาะ 4 อำเภอ 8 สภ. เสี่ยงภัย)</span>
                </td>
                <td className={`px-4 py-2.5 text-center font-mono ${currentStyle.table.posText}`}>{songkhlaRiskPos.toLocaleString()}</td>
                <td className={`px-4 py-2.5 text-center font-mono font-bold ${currentStyle.table.occText}`}>{songkhlaRiskOcc.toLocaleString()}</td>
                <td className={`px-4 py-2.5 text-center font-mono ${currentStyle.table.pctText} font-bold`}>
                  {songkhlaRiskPos > 0 ? ((songkhlaRiskOcc / songkhlaRiskPos) * 100).toFixed(1) : 0}%
                </td>
                <td className={`px-4 py-2.5 text-center font-mono ${currentStyle.table.shortageText} font-semibold`}>
                  -{(songkhlaRiskPos - songkhlaRiskOcc).toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className={`text-xs ${currentStyle.table.linkText} font-medium hover:underline`}>เปิดตารางตัวคน →</span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className={`${currentStyle.table.totalText} font-extrabold text-sm`}>
                <td className={`px-4 py-3.5 rounded-bl-xl ${currentStyle.table.totalBg} border-t-2 ${currentStyle.table.totalBorder}`}>ยอดรวมทั้งสิ้น (4 สายงานยุทธการ)</td>
                <td className={`px-4 py-3.5 text-center font-mono ${currentStyle.table.posHeader} border-t-2 ${currentStyle.table.totalBorder}`}>
                  {grandPos.toLocaleString()}
                </td>
                <td className={`px-4 py-3.5 text-center font-mono ${currentStyle.table.occHeader} border-t-2 ${currentStyle.table.totalBorder}`}>
                  {grandOcc.toLocaleString()}
                </td>
                <td className={`px-4 py-3.5 text-center font-mono ${currentStyle.table.pctHeader} border-t-2 ${currentStyle.table.totalBorder}`}>
                  {grandPos > 0 ? ((grandOcc / grandPos) * 100).toFixed(1) : 0}%
                </td>
                <td className={`px-4 py-3.5 text-center font-mono ${currentStyle.table.shortageHeader} border-t-2 ${currentStyle.table.totalBorder}`}>
                  -{(grandPos - grandOcc).toLocaleString()}
                </td>
                <td className={`px-4 py-3.5 text-center text-xs ${currentStyle.table.totalBg} border-t-2 ${currentStyle.table.totalBorder} rounded-br-xl font-medium opacity-80`}>
                  4 ฟังก์ชันพื้นที่
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Terrorist & Security Incidents Modal with authentic tactical photos & records */}
      <TerroristIncidentsModal
        isOpen={!!activeTerroristIncidentsProvince}
        provinceKey={activeTerroristIncidentsProvince || 'all'}
        onClose={() => setActiveTerroristIncidentsProvince(null)}
        records={records}
        onViewUnitRoster={(unitName) => {
          const found = records.find(
            (r) => r.name === unitName || r.name.includes(unitName) || unitName.includes(r.name)
          );
          if (found && onSelectUnitRoster) {
            onSelectUnitRoster(found);
          }
        }}
      />
    </div>
  );
};
