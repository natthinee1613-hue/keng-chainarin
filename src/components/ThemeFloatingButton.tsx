import React, { useState } from 'react';
import { Palette, ChevronRight, Sliders, Check } from 'lucide-react';
import { AppThemeConfig, AppThemeId, PRESET_THEMES } from '../types/theme';

interface ThemeFloatingButtonProps {
  currentTheme: AppThemeConfig;
  onOpenModal: () => void;
  onQuickSelectTheme: (theme: AppThemeConfig) => void;
  onScrollToBottomCustomizer?: () => void;
}

export const ThemeFloatingButton: React.FC<ThemeFloatingButtonProps> = ({
  currentTheme,
  onOpenModal,
  onQuickSelectTheme,
  onScrollToBottomCustomizer,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside aria-label="Theme Customizer" className="fixed bottom-6 left-6 z-40 flex items-center select-none print:hidden">
      {/* Expanded quick theme swatch pills */}
      {isOpen && (
        <div className="bg-slate-900/95 backdrop-blur-md p-2 rounded-2xl border border-slate-700 shadow-2xl flex items-center gap-1.5 mr-2 animate-in slide-in-from-left-4 duration-200">
          <div className="text-[10px] text-slate-400 font-bold px-1.5 hidden sm:block">
            เปลี่ยนสี:
          </div>

          {(Object.keys(PRESET_THEMES) as Array<Exclude<AppThemeId, 'custom'>>).map((themeKey) => {
            const theme = PRESET_THEMES[themeKey];
            const isCur = currentTheme.id === themeKey && !currentTheme.isCustom;

            return (
              <button
                key={themeKey}
                type="button"
                onClick={() => {
                  onQuickSelectTheme(theme);
                }}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all p-0.5 ${
                  isCur ? 'ring-2 ring-white scale-110' : 'hover:scale-110 opacity-80 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: theme.accentColor,
                }}
                title={`${theme.name}`}
              >
                {isCur && <span className="text-[10px] text-slate-950 font-black">✓</span>}
              </button>
            );
          })}

          <div className="h-5 w-px bg-slate-700 mx-1" />

          {/* Full Customizer Button */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onOpenModal();
            }}
            className="px-2.5 py-1 text-[11px] font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg flex items-center gap-1 transition shadow-xs"
            title="เปิดหน้าต่างปรับแต่งธีมทั้งหมด"
          >
            <Sliders className="w-3 h-3" />
            <span className="hidden sm:inline">ปรับแต่งสีเอง</span>
          </button>

          {onScrollToBottomCustomizer && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onScrollToBottomCustomizer();
              }}
              className="px-2.5 py-1 text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg flex items-center gap-1 transition shadow-xs border border-slate-700 whitespace-nowrap"
              title="เลื่อนลงไปยังช่องรวมปรับแต่งด้านล่าง"
            >
              <span>ช่องรวมด้านล่าง ↓</span>
            </button>
          )}
        </div>
      )}

      {/* Main floating trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-2xl border-2 backdrop-blur-md transition-all duration-200 group active:scale-95"
        style={{
          borderColor: currentTheme.accentColor,
        }}
        title="คลิกเพื่อเปลี่ยนธีมและสีสันของระบบ"
      >
        <span
          className="w-3 h-3 rounded-full flex-shrink-0 animate-pulse shadow-sm"
          style={{ backgroundColor: currentTheme.accentColor }}
        />
        <Palette
          className="w-4 h-4 transition-transform group-hover:rotate-45"
          style={{ color: currentTheme.accentColor }}
        />
        <span className="text-xs font-bold font-['Prompt'] text-white">
          ธีมสี
        </span>
      </button>
    </aside>
  );
};
