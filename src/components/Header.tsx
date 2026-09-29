import React from 'react';
import { Shield, Users, UserCheck, AlertTriangle } from 'lucide-react';
import { PoliceUnitRecord } from '../types';
import { AppThemeConfig } from '../types/theme';

interface HeaderProps {
  records: PoliceUnitRecord[];
  activeTab: 'table' | 'org' | 'analytics' | 'threats';
  setActiveTab: (tab: 'table' | 'org' | 'analytics' | 'threats') => void;
  onOpenAddModal?: () => void;
  onOpenImportModal?: () => void;
  onExportExcel?: () => void;
  onExportCSV?: () => void;
  onResetData?: () => void;
  theme: AppThemeConfig;
}

export const Header: React.FC<HeaderProps> = ({
  records,
  activeTab,
  setActiveTab,
  theme,
}) => {
  const totalPos = records.reduce((sum, r) => sum + Number(r.totalAll_pos || 0), 0);
  const totalOcc = records.reduce((sum, r) => sum + Number(r.totalAll_occ || 0), 0);
  const shortage = Math.max(0, totalPos - totalOcc);
  const fillRate = totalPos > 0 ? ((totalOcc / totalPos) * 100).toFixed(1) : '0';

  return (
    <header className={`bg-gradient-to-r ${theme.headerGradient} border-b border-slate-800 text-white shadow-xl sticky top-0 z-30 transition-colors duration-500`}>
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 flex items-center justify-center shadow-lg border border-slate-600/60 flex-shrink-0">
            <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-sky-400 drop-shadow" />
          </div>
          <div className="flex flex-col justify-center">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-black font-['Prompt'] tracking-wide leading-none select-none"
              style={{
                color: '#cbd5e1',
                textShadow:
                  '0 1px 0 #94a3b8, 0 2px 0 #64748b, 0 3px 0 #475569, 0 4px 0 #334155, 0 5px 0 #1e293b, 0 6px 0 #0f172a, 0 8px 10px rgba(0,0,0,0.7), 0 0 16px rgba(56,189,248,0.25)',
              }}
            >
              ตำรวจภูธรภาค 9
            </h1>
            <p className="text-[12px] sm:text-xs md:text-[13.5px] font-['Kanit',sans-serif] font-medium leading-relaxed tracking-wide text-amber-300 mt-1 max-w-2xl select-none">
              “มุ่งมั่นพัฒนาองค์กรให้เป็นที่เชื่อมั่นศรัทธาของประชาชน ในการอำนวยความยุติธรรม รักษาความสงบเรียบร้อย และความปลอดภัยในชีวิตและทรัพย์สิน”
            </p>
          </div>
        </div>

        {/* Global Key Stats */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-400" />
            <div>
              <div className="text-[10px] text-slate-400">อัตราตำแหน่ง</div>
              <div className="font-bold text-sky-300">{totalPos.toLocaleString()}</div>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400">คนครองจริง</div>
              <div className="font-bold text-emerald-300">{totalOcc.toLocaleString()}</div>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <div>
              <div className="text-[10px] text-slate-400">ขาดแคลน</div>
              <div className="font-bold text-rose-300">{shortage.toLocaleString()}</div>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <div>
              <div className="text-[10px] text-slate-400">ครองคน</div>
              <div className="font-bold text-amber-300">{fillRate}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation and Toolbar */}
      <div className="bg-slate-950/85 border-t border-slate-800/60 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          {/* Main Navigation Tabs Centered */}
          <nav
            aria-label="แถบเมนูหลัก"
            className="flex items-center justify-center flex-wrap gap-1 sm:gap-2 bg-slate-900/95 p-1.5 rounded-xl border border-slate-800 shadow-lg"
          >
            <button
              onClick={() => setActiveTab('org')}
              style={
                activeTab === 'org'
                  ? {
                      backgroundColor: theme.accentColor === '#f59e0b' ? '#ffffff' : theme.accentColor,
                      color: '#0f172a',
                    }
                  : undefined
              }
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'org'
                  ? 'shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              🌳 แผนผังโครงสร้างกำลังพล
            </button>
            <button
              onClick={() => setActiveTab('table')}
              style={
                activeTab === 'table'
                  ? {
                      backgroundColor: theme.accentColor === '#f59e0b' ? '#ffffff' : theme.accentColor,
                      color: '#0f172a',
                    }
                  : undefined
              }
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'table'
                  ? 'shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              📋 ตารางข้อมูลสถานภาพ (Official)
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              style={
                activeTab === 'analytics'
                  ? {
                      backgroundColor: theme.accentColor === '#f59e0b' ? '#ffffff' : theme.accentColor,
                      color: '#0f172a',
                    }
                  : undefined
              }
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              📊 สถิติและการวิเคราะห์
            </button>
            <button
              onClick={() => setActiveTab('threats')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'threats'
                  ? 'bg-red-600 text-white shadow-md font-bold'
                  : 'text-rose-300 hover:text-white hover:bg-red-950/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
              <span>🚨 จุดเสี่ยงภัยสีแดง & จุดเฝ้าระวัง</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
