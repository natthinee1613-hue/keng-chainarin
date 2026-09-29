import React from 'react';
import {
  Maximize2,
  Minimize2,
  Shield,
  ArrowDown,
} from 'lucide-react';
import { CoverConfig, COVER_THEMES, DEFAULT_COVER_CONFIG } from '../types/cover';
import { PoliceUnitRecord } from '../types';
import { CoverCanvasAnimation } from './CoverCanvasAnimation';
import { PoliceEmblem } from './PoliceEmblem';

interface CoverSectionProps {
  config: CoverConfig;
  records: PoliceUnitRecord[];
  onUpdateConfig: (newConfig: CoverConfig) => void;
  onEnterTable?: () => void;
}

export const CoverSection: React.FC<CoverSectionProps> = ({
  config,
  records,
  onUpdateConfig,
  onEnterTable,
}) => {
  const currentTheme = COVER_THEMES[config.themeId] || COVER_THEMES['royal-navy'];

  // Guarantee permanent background image fallback to official banner
  const activeImageUrl =
    config.imageUrl || DEFAULT_COVER_CONFIG.imageUrl || '/images/police_region_9_banner.svg';

  const isFullMode = config.coverMode === 'full';

  return (
    <section className="relative overflow-hidden shadow-2xl transition-all duration-300 border-b border-slate-800">
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${currentTheme.bgGradient} transition-colors duration-700`}
      />

      {/* Permanent Background Cover Image (Never disappears) */}
      {activeImageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{
            backgroundImage: `url(${activeImageUrl})`,
            opacity: config.imageOpacity || 0.55,
            filter: `blur(${config.imageBlur || 0}px)`,
          }}
        />
      )}

      {/* Subtle Mesh Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${currentTheme.accentColor} 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Animated Canvas (Particles & Radar) */}
      {(config.enableParticles || config.enableRadar) && (
        <CoverCanvasAnimation
          theme={currentTheme}
          enableParticles={config.enableParticles}
          enableRadar={config.enableRadar}
          animationSpeed={config.animationSpeed}
        />
      )}

      {/* Vignette & Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40 pointer-events-none" />

      {/* Top Floating Utility Toolbar */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-1 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-white/90">
            <span
              className="w-2 h-2 rounded-full inline-block animate-pulse"
              style={{ backgroundColor: currentTheme.accentColor }}
            />
            <span className="font-mono text-[11px] font-semibold tracking-wider">
              ภ.9 REALTIME COMMAND SYSTEM
            </span>
          </div>

          <span className="text-[11px] text-white/60 hidden md:inline-block">
            {config.dateText}
          </span>
        </div>

        {/* Right Toolbar Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle Full / Banner Mode */}
          <button
            type="button"
            onClick={() =>
              onUpdateConfig({
                ...config,
                coverMode: isFullMode ? 'banner' : 'full',
              })
            }
            className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white/80 hover:text-white p-1.5 rounded-lg border border-white/15 transition flex items-center gap-1"
            title={isFullMode ? 'ย่อเป็นโหมดแบนเนอร์' : 'ขยายเป็นโหมดหน้าปกรายงานเต็มจอ'}
          >
            {isFullMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="text-[11px] hidden sm:inline">{isFullMode ? 'ย่อแบนเนอร์' : 'ขยายเต็มจอ'}</span>
          </button>
        </div>
      </div>

      {/* Main Cover Content */}
      <div
        className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center transition-all duration-300 ${
          isFullMode ? 'py-12 sm:py-20 min-h-[70vh]' : 'py-6 sm:py-9'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 lg:gap-10">
          {/* Left: Emblem + Title + Subtitle */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left max-w-3xl flex-1">
            {/* Animated Royal Thai Police Emblem */}
            <div className="flex-shrink-0">
              <PoliceEmblem
                size={isFullMode ? 'xl' : 'lg'}
                accentColor={currentTheme.accentColor}
                animated={config.enableGlow}
              />
            </div>

            {/* Typography */}
            <div className="space-y-2">
              {/* Unit Tag */}
              <div className="inline-flex items-center gap-2 bg-[#4a1419]/80 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/35 text-amber-100 text-xs font-mono font-medium shadow-sm">
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block animate-ping"
                  style={{ backgroundColor: currentTheme.accentColor }}
                />
                <span className="tracking-wide font-medium">{config.unitName}</span>
              </div>

              {/* Main Title */}
              <h1
                className={`font-black font-['Prompt'] text-white tracking-tight leading-tight drop-shadow-md ${
                  isFullMode ? 'text-2xl sm:text-4xl lg:text-5xl' : 'text-xl sm:text-2xl lg:text-3xl'
                }`}
              >
                {config.title}
              </h1>

              {/* Subtitle */}
              <p
                className={`text-slate-200 font-normal leading-relaxed max-w-2xl drop-shadow-xs ${
                  isFullMode ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                }`}
              >
                {config.subtitle}
              </p>

              {/* Motto / Commander Badge in full mode */}
              {isFullMode && (
                <div className="pt-3 space-y-2 border-t border-white/15 mt-3">
                  <p className="text-amber-300/95 italic font-medium text-xs sm:text-sm font-['Prompt']">
                    {config.mottoText}
                  </p>
                  <div className="text-xs text-slate-300 font-mono flex flex-wrap items-center gap-3">
                    <span>{config.commanderName}</span>
                    <span>•</span>
                    <span className="text-amber-400 font-bold">{config.fiscalYear}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Action (in Full Mode) */}
          {isFullMode && onEnterTable && (
            <div className="flex items-center justify-center lg:justify-end">
              <button
                type="button"
                onClick={onEnterTable}
                className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-6 py-3.5 rounded-xl shadow-xl transition-all duration-200 flex items-center gap-2.5 text-sm active:scale-95 group font-['Prompt'] border border-slate-200"
              >
                <span>เข้าสู่ตารางข้อมูลสถานภาพกำลังพล</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
