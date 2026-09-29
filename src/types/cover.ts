export type CoverThemeId =
  | 'royal-navy'
  | 'crimson-risk'
  | 'tactical-emerald'
  | 'cyber-night'
  | 'amber-gold';

export interface CoverTheme {
  id: CoverThemeId;
  name: string;
  subtitle: string;
  primaryColor: string;
  accentColor: string;
  bgGradient: string;
  borderGlow: string;
  badgeBg: string;
  radarColor: string;
  swatchClass: string;
}

export const COVER_THEMES: Record<CoverThemeId, CoverTheme> = {
  'royal-navy': {
    id: 'royal-navy',
    name: 'สีกรมท่าตำรวจหลวง (Royal Navy & Gold)',
    subtitle: 'สง่างาม เป็นทางการ สีกรมท่าประจำตำรวจไทย',
    primaryColor: '#0f172a',
    accentColor: '#f59e0b',
    bgGradient: 'from-slate-950 via-[#0d1b2a] to-[#1b263b]',
    borderGlow: 'border-amber-500/40 shadow-amber-500/10',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    radarColor: 'rgba(245, 158, 11, 0.45)',
    swatchClass: 'bg-gradient-to-r from-slate-900 to-amber-600',
  },
  'crimson-risk': {
    id: 'crimson-risk',
    name: 'สีแดงเลือดหมูความมั่นคง (Crimson Tactical)',
    subtitle: 'เฉียบคม ดุดัน สัญลักษณ์พื้นที่เสี่ยงภัยพิเศษ',
    primaryColor: '#450a0a',
    accentColor: '#ef4444',
    bgGradient: 'from-black via-[#3a0606] to-[#500724]',
    borderGlow: 'border-red-500/50 shadow-red-500/20',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30',
    radarColor: 'rgba(239, 68, 68, 0.5)',
    swatchClass: 'bg-gradient-to-r from-red-950 to-rose-600',
  },
  'tactical-emerald': {
    id: 'tactical-emerald',
    name: 'สีเขียวพงไพรยุทธวิธี (Tactical Emerald)',
    subtitle: 'หน่วยปฏิบัติการพิเศษ ตชด. และนาวิกโยธิน',
    primaryColor: '#022c22',
    accentColor: '#10b981',
    bgGradient: 'from-slate-950 via-[#032e22] to-[#064e3b]',
    borderGlow: 'border-emerald-500/40 shadow-emerald-500/10',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    radarColor: 'rgba(16, 185, 129, 0.45)',
    swatchClass: 'bg-gradient-to-r from-emerald-950 to-teal-500',
  },
  'cyber-night': {
    id: 'cyber-night',
    name: 'ไนท์ออปส์ ไซเบอร์ (Cyber Obsidian)',
    subtitle: 'เทคโนโลยีล้ำสมัย ศูนย์บัญชาการ CCOC ไฮเทค',
    primaryColor: '#030712',
    accentColor: '#38bdf8',
    bgGradient: 'from-[#030712] via-[#09152b] to-[#0f172a]',
    borderGlow: 'border-cyan-500/40 shadow-cyan-500/20',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    radarColor: 'rgba(56, 189, 248, 0.5)',
    swatchClass: 'bg-gradient-to-r from-slate-950 to-cyan-500',
  },
  'amber-gold': {
    id: 'amber-gold',
    name: 'สีทองสุวรรณภูมิ (Sunrise Gold & Bronze)',
    subtitle: 'แสงทองอร่าม เกียรติยศผู้พิทักษ์สันติราษฎร์',
    primaryColor: '#261b05',
    accentColor: '#fbbf24',
    bgGradient: 'from-stone-950 via-[#291b0c] to-[#451a03]',
    borderGlow: 'border-amber-400/50 shadow-amber-400/20',
    badgeBg: 'bg-amber-400/20 text-amber-200 border-amber-400/30',
    radarColor: 'rgba(251, 191, 36, 0.5)',
    swatchClass: 'bg-gradient-to-r from-stone-900 to-yellow-500',
  },
};

export interface CoverConfig {
  showCover: boolean;
  coverMode: 'banner' | 'full';
  title: string;
  subtitle: string;
  unitName: string;
  commanderName: string;
  fiscalYear: string;
  dateText: string;
  mottoText: string;
  themeId: CoverThemeId;
  imageUrl: string | null;
  imageOpacity: number; // 0.1 - 0.9
  imageBlur: number; // 0 - 10px
  enableParticles: boolean;
  enableRadar: boolean;
  enableGlow: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
}

export const DEFAULT_COVER_CONFIG: CoverConfig = {
  showCover: true,
  coverMode: 'banner',
  title: 'ระบบรายงานและจัดการสถานภาพกำลังพลข้าราชการตำรวจ ภ.9',
  subtitle: 'พื้นที่ 3 จังหวัดชายแดนภาคใต้ (ยะลา, ปัตตานี, นราธิวาส) และ 4 อำเภอเสี่ยงภัย จว.สงขลา',
  unitName: 'กองบัญชาการตำรวจภูธรภาค 9 • สำนักงานตำรวจแห่งชาติ',
  commanderName: 'พลตำรวจโท ผู้บัญชาการตำรวจภูธรภาค 9',
  fiscalYear: 'ประจำปีงบประมาณ พ.ศ. 2568 - 2569',
  dateText: 'ข้อมูลสถานภาพและอัตราครองคนปัจจุบัน (126 หน่วยงาน)',
  mottoText: '“ผู้พิทักษ์สันติราษฎร์ พิทักษ์รับใช้ประชาชน เสียสละเพื่อความมั่นคงของแผ่นดินใต้”',
  themeId: 'royal-navy',
  imageUrl: '/images/police_region_9_banner.svg',
  imageOpacity: 0.55,
  imageBlur: 0,
  enableParticles: true,
  enableRadar: true,
  enableGlow: true,
  animationSpeed: 'normal',
};
