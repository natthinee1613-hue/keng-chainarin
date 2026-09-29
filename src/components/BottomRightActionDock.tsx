import React from 'react';
import { FileSpreadsheet, RefreshCw, Plus, Upload } from 'lucide-react';

interface BottomRightActionDockProps {
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  onExportExcel: () => void;
  onExportCSV: () => void;
  onResetData: () => void;
}

export const BottomRightActionDock: React.FC<BottomRightActionDockProps> = ({
  onOpenAddModal,
  onOpenImportModal,
  onExportExcel,
  onExportCSV,
  onResetData,
}) => {
  return (
    <aside
      aria-label="เครื่องมือลัดล่างขวา"
      className="fixed bottom-5 right-5 z-40 print:hidden select-none"
    >
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 shadow-2xl rounded-2xl p-1.5 flex flex-wrap sm:flex-nowrap items-center gap-1.5 transition-all duration-300 hover:border-slate-500">
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-2.5 py-1.5 rounded-xl shadow-xs transition active:scale-95 text-xs font-['Prompt']"
          title="เพิ่มหน่วยงาน/ข้อมูลใหม่"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>เพิ่มหน่วยงาน/ข้อมูล</span>
        </button>

        <button
          onClick={onOpenImportModal}
          className="flex items-center gap-1 bg-sky-600 hover:bg-sky-500 text-white font-medium px-2.5 py-1.5 rounded-xl shadow-xs transition active:scale-95 text-xs font-['Prompt']"
          title="อัปโหลดไฟล์ Excel / CSV นำเข้าข้อมูล"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>อัปโหลดข้อมูล</span>
        </button>

        <button
          onClick={onExportExcel}
          className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700/90 text-emerald-400 font-medium px-2.5 py-1.5 rounded-xl shadow-xs transition active:scale-95 text-xs font-['Prompt']"
          title="ดาวน์โหลดข้อมูลเป็นไฟล์ Excel (.xlsx)"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          <span>ดาวน์โหลด Excel</span>
        </button>

        <button
          onClick={onExportCSV}
          className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700/90 text-slate-300 font-medium px-2 py-1.5 rounded-xl shadow-xs transition active:scale-95 text-xs font-['Prompt']"
          title="ดาวน์โหลดรูปแบบ CSV"
        >
          <span>CSV</span>
        </button>

        <button
          onClick={onResetData}
          className="flex items-center gap-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 px-2 py-1.5 rounded-xl transition text-xs font-['Prompt']"
          title="รีเซ็ตข้อมูลเป็นชุดเริ่มต้นตามเอกสาร"
        >
          <RefreshCw className="w-3 h-3" />
          <span>รีเซ็ต</span>
        </button>
      </div>
    </aside>
  );
};
