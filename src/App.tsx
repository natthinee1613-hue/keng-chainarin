import React, { useState, useEffect, useRef } from 'react';
import { PoliceUnitRecord, ZoneId, OfficerRosterItem } from './types';
import { CoverConfig, DEFAULT_COVER_CONFIG, COVER_THEMES, CoverThemeId } from './types/cover';
import { AppThemeConfig, DEFAULT_APP_THEME } from './types/theme';
import { INITIAL_POLICE_UNITS, calculateRecordTotals } from './data/initialData';
import { Header } from './components/Header';
import { CoverSection } from './components/CoverSection';
import { OfficialTable } from './components/OfficialTable';
import { OrganizationTree } from './components/OrganizationTree';
import { AnalyticsView } from './components/AnalyticsView';
import { ThreatZonesView } from './components/ThreatZonesView';
import { UnitModal } from './components/UnitModal';
import { ImportModal } from './components/ImportModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { PersonnelRosterModal } from './components/PersonnelRosterModal';
import { CoverEditModal } from './components/CoverEditModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { ThemeFloatingButton } from './components/ThemeFloatingButton';
import { BottomRightActionDock } from './components/BottomRightActionDock';
import { exportToExcel, exportToCSV } from './utils/exportImport';
import { savePersistentCover, loadPersistentCover } from './utils/persistentCover';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'police_manpower_records_p9_v2';
const COVER_STORAGE_KEY = 'police_cover_config_p9_v1';
const THEME_STORAGE_KEY = 'police_app_theme_p9_v1';

export default function App() {
  // Load initial data from localStorage if available, otherwise from INITIAL_POLICE_UNITS
  const [records, setRecords] = useState<PoliceUnitRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load records from localStorage', e);
    }
    return INITIAL_POLICE_UNITS;
  });

  // Cover config state with dual persistence (LocalStorage + IndexedDB)
  const [coverConfig, setCoverConfig] = useState<CoverConfig>(() => {
    try {
      const saved = localStorage.getItem(COVER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_COVER_CONFIG,
          ...parsed,
          showCover: true, // Permanent visibility
          imageUrl: parsed.imageUrl || DEFAULT_COVER_CONFIG.imageUrl,
        };
      }
    } catch (e) {
      console.error('Failed to load cover config from localStorage', e);
    }
    return DEFAULT_COVER_CONFIG;
  });

  // Hydrate from persistent store on mount
  useEffect(() => {
    loadPersistentCover().then((cfg) => {
      setCoverConfig((prev) => {
        // If current state already has user's custom photo, keep it
        if (prev.imageUrl && prev.imageUrl !== DEFAULT_COVER_CONFIG.imageUrl) {
          return { ...prev, showCover: true };
        }
        return { ...cfg, showCover: true };
      });
    });
  }, []);

  // App Theme state with persistence
  const [appTheme, setAppTheme] = useState<AppThemeConfig>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_APP_THEME, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load theme from localStorage', e);
    }
    return DEFAULT_APP_THEME;
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Sync cover config to dual persistent store (LocalStorage & IndexedDB)
  useEffect(() => {
    savePersistentCover(coverConfig);
  }, [coverConfig]);

  // Sync app theme to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(appTheme));
    } catch (e) {
      console.error('Failed to persist app theme to localStorage', e);
    }
  }, [appTheme]);

  const [activeTab, setActiveTab] = useState<'table' | 'org' | 'analytics' | 'threats'>('org');
  const [selectedZone, setSelectedZone] = useState<ZoneId>('all');
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const mainContentRef = useRef<HTMLDivElement | null>(null);

  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<PoliceUnitRecord | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [deletingUnit, setDeletingUnit] = useState<{ id: string; name: string } | null>(null);
  const [rosterUnit, setRosterUnit] = useState<PoliceUnitRecord | null>(null);
  const [isCoverEditModalOpen, setIsCoverEditModalOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Change theme handler
  const handleSelectAppTheme = (newTheme: AppThemeConfig) => {
    setAppTheme(newTheme);
    // If the selected theme matches a known cover theme ID, link the cover too
    if (newTheme.id in COVER_THEMES) {
      setCoverConfig((prev) => ({
        ...prev,
        themeId: newTheme.id as CoverThemeId,
      }));
    }
    showToast(`เปลี่ยนธีมสีเป็น "${newTheme.name}" สำเร็จ`, 'info');
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to persist to localStorage', e);
    }
  }, [records]);

  // Create or Update
  const handleSaveUnit = (record: PoliceUnitRecord) => {
    const calculated = calculateRecordTotals(record) as PoliceUnitRecord;
    setRecords((prev) => {
      const index = prev.findIndex((r) => r.id === calculated.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = calculated;
        return updated;
      } else {
        return [...prev, calculated];
      }
    });
    showToast(editingUnit ? `แก้ไขข้อมูล "${calculated.name}" สำเร็จ` : `เพิ่มหน่วยงาน "${calculated.name}" สำเร็จ`);
    setEditingUnit(null);
  };

  // Delete
  const handleDeleteUnit = () => {
    if (!deletingUnit) return;
    setRecords((prev) => prev.filter((r) => r.id !== deletingUnit.id));
    showToast(`ลบข้อมูล "${deletingUnit.name}" เรียบร้อยแล้ว`, 'info');
    setDeletingUnit(null);
  };

  // Duplicate
  const handleDuplicateUnit = (record: PoliceUnitRecord) => {
    const duplicated: PoliceUnitRecord = {
      ...record,
      id: `copy-${Date.now()}`,
      order: typeof record.order === 'number' ? record.order + 1 : record.order,
      name: `${record.name} (สำเนา)`,
    };
    setRecords((prev) => {
      const idx = prev.findIndex((r) => r.id === record.id);
      if (idx >= 0) {
        const next = [...prev];
        next.splice(idx + 1, 0, duplicated);
        return next;
      }
      return [...prev, duplicated];
    });
    showToast(`คัดลอกข้อมูล "${record.name}" สำเร็จ`);
  };

  // Save Roster
  const handleSaveRoster = (unitId: string, roster: OfficerRosterItem[]) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === unitId ? { ...r, rosterList: roster } : r))
    );
    if (rosterUnit && rosterUnit.id === unitId) {
      setRosterUnit((prev) => (prev ? { ...prev, rosterList: roster } : null));
    }
    showToast('บันทึกรายชื่อตัวคนครองตำแหน่งเรียบร้อยแล้ว');
  };

  // Import
  const handleImport = (newRecords: PoliceUnitRecord[], mode: 'replace' | 'append') => {
    if (mode === 'replace') {
      setRecords(newRecords);
      showToast(`แทนที่ข้อมูลด้วยข้อมูลนำเข้าสำเร็จ จำนวน ${newRecords.length} หน่วยงาน`);
    } else {
      setRecords((prev) => [...prev, ...newRecords]);
      showToast(`เพิ่มข้อมูลต่อท้ายสำเร็จ จำนวน ${newRecords.length} หน่วยงาน`);
    }
  };

  // Reset to original image data
  const handleResetData = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับไปเป็นค่าเริ่มต้นตามเอกสารทางราชการ ภ.9 ใช่หรือไม่?')) {
      setRecords(INITIAL_POLICE_UNITS);
      showToast('รีเซ็ตข้อมูลกลับสู่ค่าเริ่มต้นตามเอกสารเรียบร้อยแล้ว', 'info');
    }
  };

  // Direct navigation from tree to a zone table
  const handleNavigateToZone = (zoneId: ZoneId) => {
    setSelectedZone(zoneId);
    setActiveTab('table');
  };

  const bgClass =
    appTheme.bgMode === 'dark'
      ? 'bg-slate-950 text-slate-100'
      : appTheme.bgMode === 'navy'
      ? 'bg-[#0a1128] text-slate-100'
      : 'bg-white text-slate-800';

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col font-['Sarabun'] antialiased transition-colors duration-300`}>
      {/* Toast alert */}
      {toast && (
        <div className="fixed bottom-20 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
          {toast.type === 'info' && <CheckCircle2 className="w-5 h-5 text-sky-400 flex-shrink-0" />}
          <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Animated Executive Cover / Banner */}
      <CoverSection
        config={coverConfig}
        records={records}
        onUpdateConfig={setCoverConfig}
        onEnterTable={() => {
          mainContentRef.current?.scrollIntoView({ behavior: 'smooth' });
          setActiveTab('table');
        }}
      />

      {/* Main Header with Sticky Navigation */}
      <div ref={mainContentRef}>
        <Header
          records={records}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAddModal={() => {
            setEditingUnit(null);
            setIsUnitModalOpen(true);
          }}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          onExportExcel={() => exportToExcel(records)}
          onExportCSV={() => exportToCSV(records)}
          onResetData={handleResetData}
          theme={appTheme}
        />
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* View Content */}
        {activeTab === 'table' && (
          <OfficialTable
            records={records}
            selectedZone={selectedZone}
            onSelectZone={setSelectedZone}
            externalSearchQuery={tableSearchQuery}
            onEdit={(record) => {
              setEditingUnit(record);
              setIsUnitModalOpen(true);
            }}
            onDelete={(id, name) => setDeletingUnit({ id, name })}
            onDuplicate={handleDuplicateUnit}
            onViewRoster={(record) => setRosterUnit(record)}
            theme={appTheme}
          />
        )}

        {activeTab === 'org' && (
          <OrganizationTree
            records={records}
            onNavigateToZone={handleNavigateToZone}
            onSelectUnitRoster={(unit) => setRosterUnit(unit)}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            records={records}
            onNavigateToZone={handleNavigateToZone}
            onSelectUnitRoster={(unit) => setRosterUnit(unit)}
          />
        )}

        {activeTab === 'threats' && (
          <ThreatZonesView
            records={records}
            onSelectUnitRoster={(unit) => setRosterUnit(unit)}
            onNavigateToTable={(unitName) => {
              setSelectedZone('all');
              setTableSearchQuery(unitName);
              setActiveTab('table');
            }}
          />
        )}
      </main>

      {/* Modals */}
      <UnitModal
        isOpen={isUnitModalOpen}
        onClose={() => {
          setIsUnitModalOpen(false);
          setEditingUnit(null);
        }}
        onSave={handleSaveUnit}
        initialData={editingUnit}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />

      <PersonnelRosterModal
        isOpen={!!rosterUnit}
        unit={rosterUnit}
        onClose={() => setRosterUnit(null)}
        onSaveRoster={handleSaveRoster}
      />

      <DeleteConfirmModal
        isOpen={!!deletingUnit}
        unitName={deletingUnit?.name || ''}
        onClose={() => setDeletingUnit(null)}
        onConfirm={handleDeleteUnit}
      />

      <CoverEditModal
        isOpen={isCoverEditModalOpen}
        config={coverConfig}
        onClose={() => setIsCoverEditModalOpen(false)}
        onSave={(newCfg) => setCoverConfig(newCfg)}
      />

      {/* Floating Quick Theme Button (Bottom-Left) */}
      <ThemeFloatingButton
        currentTheme={appTheme}
        onOpenModal={() => setIsThemeModalOpen(true)}
        onQuickSelectTheme={handleSelectAppTheme}
      />

      {/* Floating Quick Action Dock (Bottom-Right) */}
      <BottomRightActionDock
        onOpenAddModal={() => {
          setEditingUnit(null);
          setIsUnitModalOpen(true);
        }}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onExportExcel={() => exportToExcel(records)}
        onExportCSV={() => exportToCSV(records)}
        onResetData={handleResetData}
      />

      {/* Theme Selector Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        currentTheme={appTheme}
        onClose={() => setIsThemeModalOpen(false)}
        onSelectTheme={handleSelectAppTheme}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs text-center mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-medium text-slate-300">
            ระบบจัดการและรายงานสถานภาพข้าราชการตำรวจ 3 จังหวัดชายแดนภาคใต้ และพื้นที่เสี่ยงภัย 4 อำเภอในสังกัด ภ.จว.สงขลา
          </p>
          <p className="text-slate-500">
            กองบัญชาการตำรวจภูธรภาค 9 • ครบถ้วนทุกฟังชั้นพื้นที่ (ยะลา, ปัตตานี, นราธิวาส, 4 อำเภอเสี่ยงภัยสงขลา)
          </p>
        </div>
      </footer>
    </div>
  );
}
