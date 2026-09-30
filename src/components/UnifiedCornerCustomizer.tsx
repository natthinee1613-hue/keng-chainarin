import React, { useState, useRef } from 'react';
import {
  Palette,
  Edit3,
  Camera,
  Trash2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Upload,
  Check,
  X,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { CoverConfig, COVER_THEMES, CoverThemeId } from '../types/cover';
import { AppThemeConfig, AppThemeId, PRESET_THEMES, COLOR_SWATCH_PRESETS, BackgroundMode, CHART_THEME_OPTIONS, ChartThemeId } from '../types/theme';

interface UnifiedCornerCustomizerProps {
  coverConfig: CoverConfig;
  appTheme: AppThemeConfig;
  onUpdateCoverConfig: (newConfig: CoverConfig) => void;
  onUpdateAppTheme: (newTheme: AppThemeConfig) => void;
  onOpenCoverModal: () => void;
  onOpenThemeModal: () => void;
}

export const UnifiedCornerCustomizer: React.FC<UnifiedCornerCustomizerProps> = ({
  coverConfig,
  appTheme,
  onUpdateCoverConfig,
  onUpdateAppTheme,
  onOpenCoverModal,
  onOpenThemeModal,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'theme' | 'cover' | 'image'>('theme');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Quick image file upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพ (PNG, JPG, JPEG, WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onUpdateCoverConfig({
        ...coverConfig,
        imageUrl: result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onUpdateCoverConfig({
      ...coverConfig,
      imageUrl: null,
    });
  };

  // Change preset theme
  const handleSelectPresetTheme = (themeId: Exclude<AppThemeId, 'custom'>) => {
    const selected = PRESET_THEMES[themeId];
    onUpdateAppTheme({
      ...selected,
      bgMode: appTheme.bgMode,
    });

    if (themeId in COVER_THEMES) {
      onUpdateCoverConfig({
        ...coverConfig,
        themeId: themeId as CoverThemeId,
      });
    }
  };

  // Change custom accent color
  const handleSelectColorSwatch = (colorHex: string) => {
    onUpdateAppTheme({
      ...appTheme,
      id: 'custom',
      name: `ธีมกำหนดเอง (${colorHex})`,
      accentColor: colorHex,
      isCustom: true,
      swatchGradient: `from-slate-950 via-slate-900 to-[${colorHex}]`,
    });
  };

  // Change background mode
  const handleChangeBgMode = (mode: BackgroundMode) => {
    onUpdateAppTheme({
      ...appTheme,
      bgMode: mode,
    });
  };

  return (
    <aside
      aria-label="Unified Corner Customizer"
      className="fixed bottom-5 right-5 z-50 print:hidden select-none"
    >
      {/* Hidden file input for cover photo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileChange}
        className="hidden"
      />

      {/* MINIMIZED FLOATING BADGE (กล่องเล็กย่อที่มุมขวา) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white shadow-2xl border-2 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
          style={{
            borderColor: appTheme.accentColor,
            boxShadow: `0 8px 24px -4px ${appTheme.accentColor}50`,
          }}
          title="คลิกเพื่อเปิด แผงควบคุมรวม: ธีมสี • แก้ไขหน้าปก • ใส่รูปปก"
        >
          <span
            className="w-3 h-3 rounded-full flex-shrink-0 animate-ping absolute -top-0.5 -right-0.5"
            style={{ backgroundColor: appTheme.accentColor }}
          />
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{
              backgroundColor: `${appTheme.accentColor}25`,
              color: appTheme.accentColor,
            }}
          >
            <Palette className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
          </div>

          <div className="text-left">
            <div className="text-xs font-bold font-['Prompt'] text-white flex items-center gap-1.5">
              <span>แผงควบคุมรวม</span>
              <span
                className="text-[10px] px-1.5 py-0.2 rounded-full font-normal border"
                style={{
                  backgroundColor: `${appTheme.accentColor}20`,
                  borderColor: `${appTheme.accentColor}40`,
                  color: appTheme.accentColor,
                }}
              >
                {appTheme.name.split(' ')[0]}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              ธีมสี • หน้าปก • รูปปก
            </div>
          </div>

          <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors ml-1" />
        </button>
      )}

      {/* EXPANDED CORNER BOX (กล่องเล็กมุมขวา) */}
      {isOpen && (
        <div
          className="w-[350px] sm:w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl border shadow-2xl bg-slate-900/95 backdrop-blur-xl text-white overflow-hidden flex flex-col transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
          style={{
            borderColor: `${appTheme.accentColor}80`,
            boxShadow: `0 16px 40px -10px ${appTheme.accentColor}35, 0 0 0 1px ${appTheme.accentColor}25`,
            maxHeight: 'calc(100vh - 5rem)',
          }}
        >
          {/* HEADER OF THE CORNER BOX */}
          <div className="px-3.5 py-3 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 truncate">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center border flex-shrink-0"
                style={{
                  backgroundColor: `${appTheme.accentColor}25`,
                  borderColor: `${appTheme.accentColor}50`,
                  color: appTheme.accentColor,
                }}
              >
                <Palette className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-xs sm:text-sm text-white font-['Prompt'] truncate">
                    แผงควบคุมรวม
                  </span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full font-medium border"
                    style={{
                      backgroundColor: `${appTheme.accentColor}20`,
                      borderColor: `${appTheme.accentColor}50`,
                      color: appTheme.accentColor,
                    }}
                  >
                    {appTheme.name.split(' ')[0]}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  ธีมสี • แก้ไขหน้าปก • ใส่รูปปก
                </div>
              </div>
            </div>

            {/* Quick Actions & Minimize */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Quick Cover visibility toggle */}
              <button
                type="button"
                onClick={() =>
                  onUpdateCoverConfig({
                    ...coverConfig,
                    showCover: !coverConfig.showCover,
                  })
                }
                className={`p-1.5 rounded-lg border text-xs transition ${
                  coverConfig.showCover
                    ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-750'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
                title={coverConfig.showCover ? 'คลิกเพื่อซ่อนหน้าปก' : 'คลิกเพื่อแสดงหน้าปก'}
              >
                {coverConfig.showCover ? (
                  <Eye className="w-3.5 h-3.5" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Minimize Box Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
                title="ย่อกล่องแผงควบคุม"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3 TABS SELECTOR */}
          <div className="grid grid-cols-3 p-1.5 bg-slate-950/80 border-b border-slate-800/80 gap-1 text-[11px] font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('theme')}
              className={`py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'theme'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/50 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>1. ธีมสี</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cover')}
              className={`py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'cover'
                  ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/50 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>2. หน้าปก</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('image')}
              className={`py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'image'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/50 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>3. ใส่รูปปก</span>
            </button>
          </div>

          {/* TAB CONTENTS (SCROLLABLE) */}
          <div className="p-3.5 overflow-y-auto space-y-3.5 text-xs max-h-[60vh]">
            {/* ============================================================== */}
            {/* TAB 1: 🎨 ธีมและสีสัน (Theme Colors) */}
            {/* ============================================================== */}
            {activeTab === 'theme' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-300 font-bold">
                    เลือกธีมสีประจำระบบ (7 รูปแบบ):
                  </span>
                  <button
                    type="button"
                    onClick={onOpenThemeModal}
                    className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>ดูทั้งหมด</span>
                    <Sliders className="w-3 h-3" />
                  </button>
                </div>

                {/* Preset Themes List */}
                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.keys(PRESET_THEMES) as Array<Exclude<AppThemeId, 'custom'>>).map((themeKey) => {
                    const t = PRESET_THEMES[themeKey];
                    const isSelected = appTheme.id === themeKey && !appTheme.isCustom;

                    return (
                      <button
                        key={themeKey}
                        type="button"
                        onClick={() => handleSelectPresetTheme(themeKey)}
                        className={`px-2 py-1.5 rounded-lg border text-left transition flex items-center justify-between gap-1.5 ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-300 font-bold border-amber-500/60 ring-1 ring-amber-500/30'
                            : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800'
                        }`}
                        title={t.subtitle}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-white/20"
                            style={{ backgroundColor: t.accentColor }}
                          />
                          <span className="truncate text-[11px]">{t.name.split(' ')[0]}</span>
                        </div>
                        {isSelected && <span className="text-[10px] text-amber-400 font-bold">✓</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Quick Swatches & Custom Picker */}
                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <span>เฉดสีด่วน / ปรับสีเอง:</span>
                    <input
                      type="color"
                      value={appTheme.accentColor}
                      onChange={(e) => handleSelectColorSwatch(e.target.value)}
                      className="w-5 h-4 rounded cursor-pointer border border-slate-700 bg-transparent p-0"
                      title="เลือกสีเองอิสระ"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {COLOR_SWATCH_PRESETS.map((swatch) => (
                      <button
                        key={swatch.color}
                        type="button"
                        onClick={() => handleSelectColorSwatch(swatch.color)}
                        className="w-5 h-5 rounded-full border border-black/30 hover:scale-125 transition-transform"
                        style={{ backgroundColor: swatch.color }}
                        title={swatch.name}
                      />
                    ))}
                  </div>
                </div>

                {/* 🎨 ธีมสีแผนภูมิภาพโครงสร้าง (Organization Chart Theme) */}
                <div className="pt-2.5 border-t border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-amber-300 flex items-center gap-1">
                      <span>🎨</span>
                      <span>ธีมสีแผนภูมิภาพโครงสร้าง:</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {CHART_THEME_OPTIONS.find((o) => o.id === (appTheme.chartThemeId || 'army'))?.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {CHART_THEME_OPTIONS.map((opt) => {
                      const isSelected = (appTheme.chartThemeId || 'army') === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            onUpdateAppTheme({
                              ...appTheme,
                              chartThemeId: opt.id,
                            });
                          }}
                          className={`px-2 py-1.5 rounded-lg border text-left transition flex items-center justify-between gap-1.5 ${
                            isSelected
                              ? 'bg-amber-500/20 text-amber-300 font-bold border-amber-500/60 ring-1 ring-amber-500/30'
                              : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800'
                          }`}
                          title={opt.subtitle}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-xs">{opt.icon}</span>
                            <span className="truncate text-[11px]">{opt.name}</span>
                          </div>
                          {isSelected && <span className="text-[10px] text-amber-400 font-bold">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Background Mode Selector */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">โหมดพื้นหลัง:</span>
                  <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleChangeBgMode('light')}
                      className={`px-2 py-0.5 rounded text-[10px] transition ${
                        appTheme.bgMode === 'light'
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      สว่าง
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChangeBgMode('dark')}
                      className={`px-2 py-0.5 rounded text-[10px] transition ${
                        appTheme.bgMode === 'dark'
                          ? 'bg-slate-700 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      มืด
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChangeBgMode('navy')}
                      className={`px-2 py-0.5 rounded text-[10px] transition ${
                        appTheme.bgMode === 'navy'
                          ? 'bg-[#1e293b] text-amber-300 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      กรมท่า
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 2: ✏️ แก้ไขหน้าปก (Edit Cover) */}
            {/* ============================================================== */}
            {activeTab === 'cover' && (
              <div className="space-y-3">
                {/* Mode & Display toggles */}
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateCoverConfig({
                        ...coverConfig,
                        showCover: !coverConfig.showCover,
                      })
                    }
                    className={`px-2 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition ${
                      coverConfig.showCover
                        ? 'bg-slate-800 text-slate-200 border-slate-700'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {coverConfig.showCover ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>แสดงหน้าปก</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                        <span>ซ่อนหน้าปก</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onUpdateCoverConfig({
                        ...coverConfig,
                        coverMode: coverConfig.coverMode === 'full' ? 'banner' : 'full',
                      })
                    }
                    className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center gap-1.5"
                  >
                    {coverConfig.coverMode === 'full' ? (
                      <>
                        <Minimize2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>แบบเต็มจอ</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>แบบแบนเนอร์</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Title Edit */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    หัวข้อหลักหน้าปก:
                  </label>
                  <input
                    type="text"
                    value={coverConfig.title}
                    onChange={(e) =>
                      onUpdateCoverConfig({
                        ...coverConfig,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                    placeholder="พิมพ์ชื่อระบบ..."
                  />
                </div>

                {/* Quick Subtitle Edit */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    คำบรรยายพื้นที่:
                  </label>
                  <input
                    type="text"
                    value={coverConfig.subtitle}
                    onChange={(e) =>
                      onUpdateCoverConfig({
                        ...coverConfig,
                        subtitle: e.target.value,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                    placeholder="พิมพ์คำบรรยาย..."
                  />
                </div>

                {/* Full Cover Edit Modal Button */}
                <button
                  type="button"
                  onClick={onOpenCoverModal}
                  className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>เปิดหน้าต่างแก้ไขหน้าปกฉบับเต็ม</span>
                </button>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 3: 📷 ใส่รูปหน้าปก & เอฟเฟกต์ (Cover Image & Effects) */}
            {/* ============================================================== */}
            {activeTab === 'image' && (
              <div className="space-y-3">
                {coverConfig.imageUrl ? (
                  <div className="relative rounded-lg overflow-hidden border border-slate-700 h-24 bg-slate-950 group">
                    <img
                      src={coverConfig.imageUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                      style={{
                        opacity: coverConfig.imageOpacity,
                        filter: `blur(${coverConfig.imageBlur}px)`,
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-90 group-hover:opacity-100 transition">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-600 text-[10px] flex items-center gap-1 shadow-sm font-semibold"
                      >
                        <Upload className="w-3 h-3 text-sky-400" />
                        <span>เปลี่ยนรูป</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-2 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-200 rounded-lg border border-rose-700 text-[10px] flex items-center gap-1 shadow-sm font-semibold"
                      >
                        <Trash2 className="w-3 h-3 text-rose-400" />
                        <span>ลบรูป</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-20 rounded-lg border-2 border-dashed border-slate-700 hover:border-amber-400 bg-slate-950/80 hover:bg-amber-950/20 transition flex flex-col items-center justify-center gap-1 cursor-pointer text-slate-300 hover:text-white group"
                  >
                    <div className="p-1.5 rounded-full bg-slate-800 group-hover:bg-amber-500/20 text-slate-400 group-hover:text-amber-400 transition">
                      <Camera className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-[11px] group-hover:text-amber-300">
                      คลิกเพื่อใส่รูปภาพหน้าปก
                    </span>
                    <span className="text-[9px] text-slate-500">
                      รองรับ PNG, JPG, JPEG (แนะนำ 16:9)
                    </span>
                  </button>
                )}

                {/* Opacity & Blur Sliders */}
                {coverConfig.imageUrl && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>ความโปร่งใสรูป:</span>
                      <span className="font-mono text-amber-300 font-bold">
                        {Math.round(coverConfig.imageOpacity * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.85"
                      step="0.05"
                      value={coverConfig.imageOpacity}
                      onChange={(e) =>
                        onUpdateCoverConfig({
                          ...coverConfig,
                          imageOpacity: parseFloat(e.target.value),
                        })
                      }
                      className="w-full accent-amber-400 cursor-pointer h-1.5"
                    />

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>ความเบลอ:</span>
                      <span className="font-mono text-amber-300 font-bold">
                        {coverConfig.imageBlur}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={coverConfig.imageBlur}
                      onChange={(e) =>
                        onUpdateCoverConfig({
                          ...coverConfig,
                          imageBlur: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full accent-amber-400 cursor-pointer h-1.5"
                    />
                  </div>
                )}

                {/* Animation toggles */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1 text-[10px]">
                  <label className="flex items-center gap-1 cursor-pointer text-slate-300 select-none">
                    <input
                      type="checkbox"
                      checked={coverConfig.enableRadar}
                      onChange={(e) =>
                        onUpdateCoverConfig({
                          ...coverConfig,
                          enableRadar: e.target.checked,
                        })
                      }
                      className="w-3 h-3 rounded text-amber-500"
                    />
                    <span>เรดาร์</span>
                  </label>

                  <label className="flex items-center gap-1 cursor-pointer text-slate-300 select-none">
                    <input
                      type="checkbox"
                      checked={coverConfig.enableParticles}
                      onChange={(e) =>
                        onUpdateCoverConfig({
                          ...coverConfig,
                          enableParticles: e.target.checked,
                        })
                      }
                      className="w-3 h-3 rounded text-amber-500"
                    />
                    <span>อนุภาค</span>
                  </label>

                  <label className="flex items-center gap-1 cursor-pointer text-slate-300 select-none">
                    <input
                      type="checkbox"
                      checked={coverConfig.enableGlow}
                      onChange={(e) =>
                        onUpdateCoverConfig({
                          ...coverConfig,
                          enableGlow: e.target.checked,
                        })
                      }
                      className="w-3 h-3 rounded text-amber-500"
                    />
                    <span>แสงตราโล่</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER BAR INSIDE THE CORNER BOX */}
          <div className="px-3.5 py-2 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>ปรับแต่งอัตโนมัติ Real-time</span>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white hover:underline flex items-center gap-1"
            >
              <span>ซ่อนกล่อง</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
