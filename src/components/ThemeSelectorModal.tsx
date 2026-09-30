import React, { useState } from 'react';
import {
  X,
  Check,
  Palette,
  Sparkles,
  Sun,
  Moon,
  Shield,
  RotateCcw,
  Sliders,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import {
  AppThemeConfig,
  AppThemeId,
  PRESET_THEMES,
  COLOR_SWATCH_PRESETS,
  DEFAULT_APP_THEME,
  BackgroundMode,
  CHART_THEME_OPTIONS,
  ChartThemeId,
} from '../types/theme';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  currentTheme: AppThemeConfig;
  onClose: () => void;
  onSelectTheme: (theme: AppThemeConfig) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  currentTheme,
  onClose,
  onSelectTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'chart'>('presets');
  const [tempTheme, setTempTheme] = useState<AppThemeConfig>({ ...currentTheme });

  if (!isOpen) return null;

  // Select a preset theme
  const handleSelectPreset = (themeId: Exclude<AppThemeId, 'custom'>) => {
    const selected = PRESET_THEMES[themeId];
    const updated = {
      ...selected,
      bgMode: tempTheme.bgMode, // keep user's light/dark preference
      chartThemeId: selected.chartThemeId || tempTheme.chartThemeId,
    };
    setTempTheme(updated);
    onSelectTheme(updated);
  };

  // Select chart theme
  const handleSelectChartTheme = (chartThemeId: ChartThemeId) => {
    const updated = {
      ...tempTheme,
      chartThemeId,
    };
    setTempTheme(updated);
    onSelectTheme(updated);
  };

  // Change background mode
  const handleChangeBgMode = (mode: BackgroundMode) => {
    const updated = {
      ...tempTheme,
      bgMode: mode,
    };
    setTempTheme(updated);
    onSelectTheme(updated);
  };

  // Change custom accent color
  const handleSelectAccentColor = (hex: string) => {
    const updated: AppThemeConfig = {
      ...tempTheme,
      id: 'custom',
      name: `ธีมกำหนดเอง (${hex})`,
      subtitle: 'ชุดสีที่กำหนดเองโดยผู้ใช้งาน',
      accentColor: hex,
      isCustom: true,
      activeTabClass: 'text-slate-950 font-bold shadow-md',
      accentButtonClass: 'text-slate-950 font-bold',
      tableHeaderAccent: 'border-amber-300',
      badgeClass: 'border-amber-300',
      swatchGradient: `from-slate-950 via-slate-900 to-[${hex}]`,
    };
    setTempTheme(updated);
    onSelectTheme(updated);
  };

  // Reset to default
  const handleReset = () => {
    setTempTheme(DEFAULT_APP_THEME);
    onSelectTheme(DEFAULT_APP_THEME);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl border flex items-center justify-center shadow-inner"
              style={{
                backgroundColor: `${tempTheme.accentColor}25`,
                borderColor: `${tempTheme.accentColor}60`,
                color: tempTheme.accentColor,
              }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-['Prompt'] text-white flex items-center gap-2">
                <span>ระบบเปลี่ยนธีมและสีสัน</span>
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold"
                  style={{
                    backgroundColor: `${tempTheme.accentColor}30`,
                    color: tempTheme.accentColor,
                  }}
                >
                  {tempTheme.name.split(' ')[0]}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                เปลี่ยนสีของระบบ แถบเครื่องมือ ปุ่ม แดชบอร์ด และตารางข้อมูลสถานภาพกำลังพลได้ทันที
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 gap-2 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('presets')}
            className={`py-3 px-4 font-medium border-b-2 flex items-center gap-2 transition ${
              activeTab === 'presets'
                ? 'border-amber-500 text-amber-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>1. ธีมสำเร็จรูปราชการ (7 ธีม)</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`py-3 px-4 font-medium border-b-2 flex items-center gap-2 transition ${
              activeTab === 'custom'
                ? 'border-amber-500 text-amber-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>2. เลือกสีและโหมดเอง (Custom Colors)</span>
          </button>

          <button
            onClick={() => setActiveTab('chart')}
            className={`py-3 px-4 font-medium border-b-2 flex items-center gap-2 transition ${
              activeTab === 'chart'
                ? 'border-amber-500 text-amber-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🎨</span>
            <span>3. ธีมสีแผนภูมิภาพโครงสร้าง (6 ธีม)</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs sm:text-sm">
          {/* TAB 1: PRESET THEMES */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>เลือกธีมที่ต้องการ ระบบจะปรับสีสันทุกหน้าต่างและตารางโดยอัตโนมัติ:</span>
                <span className="font-semibold text-slate-700">คลิกเพื่อใช้งานทันที</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {(Object.keys(PRESET_THEMES) as Array<Exclude<AppThemeId, 'custom'>>).map((themeKey) => {
                  const theme = PRESET_THEMES[themeKey];
                  const isSelected = tempTheme.id === themeKey && !tempTheme.isCustom;

                  return (
                    <div
                      key={themeKey}
                      onClick={() => handleSelectPreset(themeKey)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 relative group ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/25 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-6 h-6 rounded-full shadow-inner border border-white/50 bg-gradient-to-r ${theme.swatchGradient}`}
                          />
                          <div>
                            <h4 className="font-bold text-slate-900 font-['Prompt'] text-sm group-hover:text-amber-700 transition">
                              {theme.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{theme.subtitle}</p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
                            ✓
                          </div>
                        )}
                      </div>

                      {/* Mini Preview Mockup */}
                      <div
                        className={`h-8 rounded-lg bg-gradient-to-r ${theme.headerGradient} p-1.5 flex items-center justify-between px-3 text-[10px] text-white shadow-inner font-mono`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full inline-block"
                            style={{ backgroundColor: theme.accentColor }}
                          />
                          <span className="font-semibold text-white/90">ตำรวจภูธรภาค 9</span>
                        </div>
                        <span
                          className="px-2 py-0.5 rounded text-[9px] font-bold"
                          style={{
                            backgroundColor: theme.accentColor,
                            color: '#0f172a',
                          }}
                        >
                          ตารางสถานภาพ
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Chart Theme Swatch Strip inside Tab 1 */}
              <div className="pt-4 border-t border-slate-200 mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <span>🎨</span>
                    <span>ธีมสีแผนภูมิภาพโครงสร้าง (Organization Chart Theme):</span>
                  </span>
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    {CHART_THEME_OPTIONS.find((o) => o.id === (tempTheme.chartThemeId || 'army'))?.name}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CHART_THEME_OPTIONS.map((opt) => {
                    const isSelected = (tempTheme.chartThemeId || 'army') === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectChartTheme(opt.id)}
                        className={`p-2.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-base">{opt.icon}</span>
                          <span className="text-xs font-semibold text-slate-800 truncate">{opt.name}</span>
                        </div>
                        {isSelected && <span className="text-xs font-bold text-amber-600">✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CHART THEMES */}
          {activeTab === 'chart' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>เลือกธีมสีเฉพาะสำหรับแผนภูมิภาพโครงสร้างองค์กร (Organization Hierarchy Chart):</span>
                <span className="font-semibold text-slate-700">คลิกเพื่อเปลี่ยนทันที</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {CHART_THEME_OPTIONS.map((opt) => {
                  const isSelected = (tempTheme.chartThemeId || 'army') === opt.id;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectChartTheme(opt.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 relative group ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/25 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl p-1 rounded-lg bg-slate-100">{opt.icon}</span>
                          <div>
                            <h4 className="font-bold text-slate-900 font-['Prompt'] text-sm group-hover:text-amber-700 transition">
                              {opt.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{opt.subtitle}</p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
                            ✓
                          </div>
                        )}
                      </div>

                      {/* Swatch gradient preview */}
                      <div
                        className={`h-7 rounded-lg bg-gradient-to-r ${opt.swatchGradient} p-1.5 flex items-center justify-between px-3 text-[10px] text-white shadow-inner font-mono`}
                      >
                        <span className="font-semibold text-white/90">ผังโครงสร้าง ภ.9</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/20 text-white backdrop-blur-xs">
                          4 สายงานพื้นที่
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM COLOR PICKER */}
          {activeTab === 'custom' && (
            <div className="space-y-5">
              {/* Background Mode: Light / Dark / Navy */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <label className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>โหมดโทนสีพื้นหลัง (Background Appearance)</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleChangeBgMode('light')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                      tempTheme.bgMode === 'light'
                        ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-500/20'
                        : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-600" />
                    <span className="text-xs">โหมดสว่าง (Light)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChangeBgMode('dark')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                      tempTheme.bgMode === 'dark'
                        ? 'border-amber-500 bg-slate-900 text-white font-bold ring-2 ring-amber-500/20'
                        : 'border-slate-300 bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-sky-400" />
                    <span className="text-xs">โหมดมืด (Dark)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChangeBgMode('navy')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                      tempTheme.bgMode === 'navy'
                        ? 'border-amber-500 bg-[#0f172a] text-amber-300 font-bold ring-2 ring-amber-500/20'
                        : 'border-slate-300 bg-[#0d1b2a] text-slate-200 hover:bg-[#1b263b]'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span className="text-xs">สีกรมท่า (Navy)</span>
                  </button>
                </div>
              </div>

              {/* 12 Quick Pick Color Swatches */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <label className="font-bold text-slate-800 text-xs sm:text-sm flex items-center justify-between">
                  <span>เลือกสีไฮไลต์และปุ่ม (Preset Accent Swatches)</span>
                  <span className="font-mono text-xs text-amber-700 font-bold">
                    {tempTheme.accentColor}
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {COLOR_SWATCH_PRESETS.map((swatch) => {
                    const isSelected = tempTheme.accentColor.toLowerCase() === swatch.color.toLowerCase();
                    return (
                      <button
                        key={swatch.color}
                        type="button"
                        onClick={() => handleSelectAccentColor(swatch.color)}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
                          isSelected
                            ? 'border-slate-900 bg-white shadow-md ring-2 ring-slate-900/30'
                            : 'border-slate-200 bg-white hover:border-slate-400'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full flex-shrink-0 shadow-sm border border-black/10 flex items-center justify-center text-white text-[10px] font-bold"
                          style={{ backgroundColor: swatch.color }}
                        >
                          {isSelected && '✓'}
                        </span>
                        <span className="text-[11px] font-medium text-slate-700 truncate">
                          {swatch.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Freeform Color Picker */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-800 text-xs sm:text-sm">
                    เลือกสีอิสระผ่านจานสี (Custom Color Palette)
                  </div>
                  <div className="text-xs text-slate-500">
                    คลิกที่ช่องสีเพื่อเลือกเฉดสีใดก็ได้ตามความพึงพอใจ
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={tempTheme.accentColor}
                    onChange={(e) => handleSelectAccentColor(e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                  />
                  <span className="font-mono font-bold text-sm bg-white px-3 py-2 rounded-lg border border-slate-300">
                    {tempTheme.accentColor.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CHART THEMES (ฟังชั่นเปลี่ยนสีแผนภูมิภาพ รวมกับธีมสี) */}
          {activeTab === 'chart' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>เลือกชุดสีสำหรับแผนภูมิภาพโครงสร้างองค์กร (Organization Hierarchy Chart) ทั้ง 6 รูปแบบ:</span>
                <span className="font-semibold text-amber-700">มีผลกับผังโครงสร้างและตารางสรุปกำลังพล</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {CHART_THEME_OPTIONS.map((opt) => {
                  const isSelected = (tempTheme.chartThemeId || 'army') === opt.id;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectChartTheme(opt.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 relative group ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/25 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{opt.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900 font-['Prompt'] text-sm group-hover:text-amber-700 transition">
                                {opt.name}
                              </h4>
                              {opt.id === 'army' && (
                                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-green-100 text-green-800 border border-green-300">
                                  แนวทาง ทบ.
                                </span>
                              )}
                              {opt.id === 'pastel' && (
                                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-rose-100 text-rose-800 border border-rose-300">
                                  สบายตา
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">{opt.subtitle}</p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
                            ✓
                          </div>
                        )}
                      </div>

                      {/* Mini Mockup of Chart Node */}
                      <div
                        className={`h-11 rounded-xl p-2 flex items-center justify-between px-3 text-[10px] shadow-sm font-mono ${opt.badgeBg} border ${opt.borderColor}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                          <div className="flex flex-col">
                            <span className={`font-bold text-[11px] ${opt.badgeText}`}>
                              ตำรวจภูธรภาค 9
                            </span>
                            <span className="text-[9px] opacity-75">
                              (3 จว.ชายแดนใต้ & 4 อ.สงขลา)
                            </span>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            opt.id === 'pastel'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-black/30 text-amber-300 border border-amber-400/40'
                          }`}
                        >
                          {isSelected ? 'กำลังใช้งาน' : 'เลือกใช้'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center gap-2">
                <span className="text-base">💡</span>
                <span>
                  ท่านสามารถสลับธีมสีของแผนภูมิภาพได้ 3 ช่องทาง: <strong>1) แถบด่วนด้านบนของผังโครงสร้าง</strong>, <strong>2) หน้าต่างตั้งค่าธีมนี้</strong>, และ <strong>3) ปุ่มวงกลมมุมขวาล่าง</strong>
                </span>
              </div>
            </div>
          )}

          {/* LIVE PREVIEW COMPONENT */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>ตัวอย่างสีสันที่จะปรากฏในระบบ (Live Preview):</span>
            </div>

            <div
              className={`p-4 rounded-xl border border-slate-300 shadow-sm transition-all space-y-3 ${
                tempTheme.bgMode === 'dark'
                  ? 'bg-slate-900 text-white'
                  : tempTheme.bgMode === 'navy'
                  ? 'bg-[#0d1b2a] text-slate-100'
                  : 'bg-slate-100 text-slate-900'
              }`}
            >
              {/* Header mockup */}
              <div
                className={`p-3 rounded-lg bg-gradient-to-r ${tempTheme.headerGradient} text-white flex items-center justify-between`}
              >
                <div className="flex items-center gap-2">
                  <Shield
                    className="w-4 h-4"
                    style={{ color: tempTheme.accentColor }}
                  />
                  <span className="font-bold text-xs sm:text-sm">
                    ตำรวจภูธรภาค 9 • 3 จว.ชายแดนใต้ & 4 อำเภอสงขลา
                  </span>
                </div>
                <div
                  className="px-2.5 py-1 rounded-md text-[10px] font-bold shadow-xs"
                  style={{
                    backgroundColor: tempTheme.accentColor,
                    color: '#0f172a',
                  }}
                >
                  แท็บที่เลือก
                </div>
              </div>

              {/* Sample elements */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg font-bold text-xs shadow-xs transition"
                  style={{
                    backgroundColor: tempTheme.accentColor,
                    color: '#0f172a',
                  }}
                >
                  + ปุ่มเพิ่มหน่วยงาน
                </button>

                <div
                  className="px-2.5 py-1 rounded-full text-xs font-bold border"
                  style={{
                    backgroundColor: `${tempTheme.accentColor}20`,
                    borderColor: `${tempTheme.accentColor}60`,
                    color: tempTheme.accentColor,
                  }}
                >
                  ยอดรวม 126 หน่วยงาน
                </div>

                <div className="font-mono text-xs px-2 py-1 rounded bg-black/20 text-emerald-400 font-bold">
                  ครองคนจริง 92.4%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-200 transition font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>รีเซ็ตเป็นสีกรมท่าตำรวจหลวง (เริ่มต้น)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>เสร็จสิ้นและปิดหน้าต่าง</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
