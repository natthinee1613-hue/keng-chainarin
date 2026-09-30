export type AppThemeId =
  | 'royal-navy'
  | 'crimson-risk'
  | 'tactical-emerald'
  | 'cyber-night'
  | 'amber-gold'
  | 'royal-purple'
  | 'stealth-gray'
  | 'custom';

export type BackgroundMode = 'light' | 'dark' | 'navy';

export type ChartThemeId = 'army' | 'pastel' | 'royal-navy' | 'crimson' | 'emerald' | 'cyber';

export interface ChartThemeOption {
  id: ChartThemeId;
  name: string;
  icon: string;
  subtitle: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  swatchGradient: string;
}

export const CHART_THEME_OPTIONS: ChartThemeOption[] = [
  {
    id: 'army',
    name: 'ราชการทหารบก',
    icon: '🎖️',
    subtitle: 'เขียวขี้ม้าทหารบก กากีแกมเขียว ทองเหลืองกงจักร แดงเบเร่ต์',
    badgeBg: 'bg-[#18291b]',
    badgeText: 'text-[#fef08a]',
    borderColor: 'border-[#ca8a04]',
    swatchGradient: 'from-[#132316] via-[#1c3821] to-[#ca8a04]',
  },
  {
    id: 'pastel',
    name: 'สีพาสเทล สบายตา',
    icon: '🌸',
    subtitle: 'โทนสีพาสเทลนุ่มนวล สบายตา เรียบหรู อ่อนโยน ทันสมัย',
    badgeBg: 'bg-white',
    badgeText: 'text-slate-800',
    borderColor: 'border-slate-300',
    swatchGradient: 'from-[#fef3c7] via-[#bae6fd] to-[#fecdd3]',
  },
  {
    id: 'royal-navy',
    name: 'กรมท่าตำรวจหลวง',
    icon: '🏛️',
    subtitle: 'สีกรมท่าทางการประจำตำรวจไทย ตัดเส้นขอบทองอร่าม',
    badgeBg: 'bg-slate-900',
    badgeText: 'text-amber-300',
    borderColor: 'border-amber-400',
    swatchGradient: 'from-[#0b1728] via-[#1e3a5f] to-[#f59e0b]',
  },
  {
    id: 'crimson',
    name: 'แดงเลือดหมูความมั่นคง',
    icon: '🔴',
    subtitle: 'แดงเลือดหมูดุดัน สัญลักษณ์ความพร้อมรบพื้นที่เสี่ยงภัย',
    badgeBg: 'bg-red-950',
    badgeText: 'text-rose-200',
    borderColor: 'border-red-500',
    swatchGradient: 'from-[#3a0606] via-[#7f1d1d] to-[#ef4444]',
  },
  {
    id: 'emerald',
    name: 'เขียวพงไพร ตชด./นปพ.',
    icon: '🌲',
    subtitle: 'เขียวมรกตเข้ม ตชด. นปพ. และชุดปฏิบัติการจรยุทธ์',
    badgeBg: 'bg-emerald-950',
    badgeText: 'text-emerald-200',
    borderColor: 'border-emerald-500',
    swatchGradient: 'from-[#032e22] via-[#065f46] to-[#10b981]',
  },
  {
    id: 'cyber',
    name: 'ไนท์ออปส์ ไซเบอร์',
    icon: '💻',
    subtitle: 'ดำออบซิเดียนตัดฟ้าไฮเทค ศูนย์สั่งการ CCOC',
    badgeBg: 'bg-slate-950',
    badgeText: 'text-sky-300',
    borderColor: 'border-sky-400',
    swatchGradient: 'from-[#030712] via-[#0f2442] to-[#38bdf8]',
  },
];

export interface AppThemeConfig {
  id: AppThemeId;
  name: string;
  subtitle: string;
  primaryColor: string; // Header/Dark elements
  accentColor: string; // Highlights, buttons, active states
  secondaryColor: string;
  bgMode: BackgroundMode;
  headerGradient: string;
  activeTabClass: string;
  accentButtonClass: string;
  tableHeaderAccent: string;
  badgeClass: string;
  swatchGradient: string;
  chartThemeId?: ChartThemeId;
  isCustom?: boolean;
}

export const PRESET_THEMES: Record<Exclude<AppThemeId, 'custom'>, AppThemeConfig> = {
  'royal-navy': {
    id: 'royal-navy',
    name: 'สีกรมท่าตำรวจหลวง (Royal Police Navy & Gold)',
    subtitle: 'สีกรมท่าทางการประจำตำรวจไทย ตัดเส้นขอบสีทองอร่าม',
    primaryColor: '#0f172a',
    accentColor: '#f59e0b',
    secondaryColor: '#1e293b',
    bgMode: 'light',
    headerGradient: 'from-slate-950 via-[#0d1b2a] to-[#1b263b]',
    activeTabClass: 'bg-white text-slate-950 shadow-md font-bold',
    accentButtonClass: 'bg-white hover:bg-slate-100 text-slate-950 border border-slate-200',
    tableHeaderAccent: 'bg-white text-slate-950 border-slate-300',
    badgeClass: 'bg-white text-slate-800 border-slate-300',
    swatchGradient: 'from-slate-900 via-blue-950 to-amber-500',
    chartThemeId: 'royal-navy',
  },
  'crimson-risk': {
    id: 'crimson-risk',
    name: 'สีแดงเลือดหมูความมั่นคง (Crimson Tactical)',
    subtitle: 'สีแดงเลือดหมูดุดัน สัญลักษณ์ความพร้อมเผชิญเหตุพื้นที่เสี่ยงภัย',
    primaryColor: '#450a0a',
    accentColor: '#ef4444',
    secondaryColor: '#7f1d1d',
    bgMode: 'light',
    headerGradient: 'from-black via-[#3a0606] to-[#500724]',
    activeTabClass: 'bg-red-600 text-white shadow-md font-bold',
    accentButtonClass: 'bg-red-600 hover:bg-red-500 text-white',
    tableHeaderAccent: 'bg-red-100 text-red-950 border-red-300',
    badgeClass: 'bg-red-100 text-red-900 border-red-300',
    swatchGradient: 'from-slate-950 via-red-950 to-red-600',
    chartThemeId: 'crimson',
  },
  'tactical-emerald': {
    id: 'tactical-emerald',
    name: 'สีเขียวพงไพรยุทธวิธี (Tactical Forest Emerald)',
    subtitle: 'สีเขียวมรกตเข้ม ตชด. นปพ. และชุดปฏิบัติการจรยุทธ์พื้นที่ป่าเขา',
    primaryColor: '#022c22',
    accentColor: '#10b981',
    secondaryColor: '#064e3b',
    bgMode: 'light',
    headerGradient: 'from-slate-950 via-[#032e22] to-[#064e3b]',
    activeTabClass: 'bg-emerald-500 text-slate-950 shadow-md font-bold',
    accentButtonClass: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    tableHeaderAccent: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    swatchGradient: 'from-slate-950 via-emerald-950 to-emerald-500',
    chartThemeId: 'emerald',
  },
  'cyber-night': {
    id: 'cyber-night',
    name: 'ไนท์ออปส์ ไซเบอร์ (Cyber Obsidian Blue)',
    subtitle: 'สีดำออบซิเดียนตัดฟ้าไฮเทค ศูนย์บัญชาการและควบคุม CCOC',
    primaryColor: '#030712',
    accentColor: '#38bdf8',
    secondaryColor: '#0f172a',
    bgMode: 'light',
    headerGradient: 'from-[#030712] via-[#09152b] to-[#0f172a]',
    activeTabClass: 'bg-sky-500 text-slate-950 shadow-md font-bold',
    accentButtonClass: 'bg-sky-500 hover:bg-sky-400 text-slate-950',
    tableHeaderAccent: 'bg-sky-100 text-sky-950 border-sky-300',
    badgeClass: 'bg-sky-100 text-sky-900 border-sky-300',
    swatchGradient: 'from-slate-950 via-slate-900 to-sky-400',
    chartThemeId: 'cyber',
  },
  'amber-gold': {
    id: 'amber-gold',
    name: 'สีทองสุวรรณภูมิ (Sunrise Royal Gold)',
    subtitle: 'สีทองอร่ามสง่างาม ดุจเกียรติยศและศักดิ์ศรี',
    primaryColor: '#261b05',
    accentColor: '#fbbf24',
    secondaryColor: '#451a03',
    bgMode: 'light',
    headerGradient: 'from-stone-950 via-[#291b0c] to-[#451a03]',
    activeTabClass: 'bg-amber-400 text-stone-950 shadow-md font-bold',
    accentButtonClass: 'bg-amber-400 hover:bg-amber-300 text-stone-950',
    tableHeaderAccent: 'bg-amber-100 text-amber-950 border-amber-300',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    swatchGradient: 'from-stone-950 via-stone-900 to-amber-400',
    chartThemeId: 'army',
  },
  'royal-purple': {
    id: 'royal-purple',
    name: 'สีม่วงเฉลิมเกียรติ (Royal Imperial Purple)',
    subtitle: 'สีม่วงเข้มสง่างาม พลังอำนาจและความเป็นเอกภาพ',
    primaryColor: '#1e1035',
    accentColor: '#c084fc',
    secondaryColor: '#3b0764',
    bgMode: 'light',
    headerGradient: 'from-slate-950 via-[#1f0d38] to-[#3b0764]',
    activeTabClass: 'bg-purple-500 text-white shadow-md font-bold',
    accentButtonClass: 'bg-purple-600 hover:bg-purple-500 text-white',
    tableHeaderAccent: 'bg-purple-100 text-purple-950 border-purple-300',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
    swatchGradient: 'from-slate-950 via-purple-950 to-purple-400',
    chartThemeId: 'royal-navy',
  },
  'stealth-gray': {
    id: 'stealth-gray',
    name: 'สเตลท์ ยุทธวิธีเทากราไฟต์ (Stealth Tactical Gray)',
    subtitle: 'สีเทากราไฟต์สุขุม ลึกลับ มั่นคง คล่องตัวในทุกสถานการณ์',
    primaryColor: '#18181b',
    accentColor: '#94a3b8',
    secondaryColor: '#27272a',
    bgMode: 'light',
    headerGradient: 'from-zinc-950 via-zinc-900 to-neutral-900',
    activeTabClass: 'bg-slate-200 text-slate-900 shadow-md font-bold',
    accentButtonClass: 'bg-slate-700 hover:bg-slate-600 text-white',
    tableHeaderAccent: 'bg-slate-200 text-slate-900 border-slate-300',
    badgeClass: 'bg-slate-200 text-slate-800 border-slate-300',
    swatchGradient: 'from-black via-zinc-800 to-slate-400',
    chartThemeId: 'army',
  },
};

export const COLOR_SWATCH_PRESETS = [
  { name: 'ทองอร่าม (Royal Amber Gold)', color: '#f59e0b' },
  { name: 'แดงยุทธวิธี (Tactical Red)', color: '#ef4444' },
  { name: 'เขียวมรกต (Emerald Green)', color: '#10b981' },
  { name: 'ฟ้าไซเบอร์ (Cyber Sky Blue)', color: '#38bdf8' },
  { name: 'น้ำเงินเข้ม (Navy Blue)', color: '#3b82f6' },
  { name: 'ม่วงลาเวนเดอร์ (Imperial Purple)', color: '#a855f7' },
  { name: 'ชมพูกุหลาบ (Rose Pink)', color: '#f43f5e' },
  { name: 'ส้มเพลิง (Flame Orange)', color: '#f97316' },
  { name: 'เขียวมะนาว (Lime Security)', color: '#84cc16' },
  { name: 'น้ำเงินคราม (Indigo Deep)', color: '#6366f1' },
  { name: 'เงินแพลทินัม (Platinum Silver)', color: '#94a3b8' },
  { name: 'เหลืองพระราชทาน (Royal Yellow)', color: '#eab308' },
];

export const DEFAULT_APP_THEME: AppThemeConfig = PRESET_THEMES['royal-navy'];
