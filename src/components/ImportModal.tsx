import React, { useState } from 'react';
import { X, UploadCloud, FileSpreadsheet, Check, AlertCircle, Download, FileText } from 'lucide-react';
import { PoliceUnitRecord } from '../types';
import { parseImportFile, downloadTemplate } from '../utils/exportImport';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (records: PoliceUnitRecord[], mode: 'replace' | 'append') => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<PoliceUnitRecord[] | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');

  if (!isOpen) return null;

  const handleFileChange = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setLoading(true);

    try {
      const records = await parseImportFile(selectedFile);
      if (records.length === 0) {
        throw new Error('ไม่พบแถวข้อมูลที่สามารถนำเข้าได้');
      }
      setParsedData(records);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'เกิดข้อผิดพลาดในการอ่านไฟล์ กรุณาตรวจสอบรูปแบบไฟล์');
      setParsedData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (!parsedData || parsedData.length === 0) return;
    onImport(parsedData, importMode);
    onClose();
  };

  const resetState = () => {
    setFile(null);
    setParsedData(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <UploadCloud className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-lg font-['Prompt'] text-white">
              นำเข้า / อัปโหลดข้อมูลสถานภาพกำลังพล
            </h3>
          </div>
          <button
            onClick={() => { resetState(); onClose(); }}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
          {/* Template helper */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-8 h-8 text-sky-600 flex-shrink-0" />
              <div>
                <div className="font-semibold text-sky-950">ยังไม่มีแบบฟอร์ม?</div>
                <div className="text-xs text-sky-800">
                  ดาวน์โหลดไฟล์ตัวอย่าง Excel เพื่อกรอกข้อมูลสถานภาพตามคอลัมน์มาตรฐาน
                </div>
              </div>
            </div>
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-1.5 bg-white border border-sky-300 hover:bg-sky-100 text-sky-700 font-semibold px-3 py-1.5 rounded-lg text-xs transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลด Template (.xlsx)</span>
            </button>
          </div>

          {/* Drag & Drop Area */}
          {!parsedData && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-amber-50/30 transition cursor-pointer flex flex-col items-center justify-center space-y-3"
              onClick={() => {
                const input = document.getElementById('file-upload-input');
                input?.click();
              }}
            >
              <input
                id="file-upload-input"
                type="file"
                accept=".xlsx,.xls,.csv,.json"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-amber-500">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <div className="font-semibold text-slate-800 text-sm">
                  คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  รองรับไฟล์ Excel (.xlsx, .xls), CSV (.csv), และ JSON (.json)
                </div>
              </div>
            </div>
          )}

          {/* Error notice */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <div className="text-xs">{error}</div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="py-8 text-center text-slate-600">
              <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <div className="text-xs">กำลังประมวลผลไฟล์...</div>
            </div>
          )}

          {/* Preview Parsed Data */}
          {parsedData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="font-bold text-emerald-950">
                      อ่านข้อมูลสำเร็จ {parsedData.length} หน่วยงาน
                    </div>
                    <div className="text-xs text-emerald-800">
                      ไฟล์: {file?.name} (ตำแหน่งรวม {parsedData.reduce((s, r) => s + r.totalAll_pos, 0).toLocaleString()} / ครองคน {parsedData.reduce((s, r) => s + r.totalAll_occ, 0).toLocaleString()})
                    </div>
                  </div>
                </div>
                <button
                  onClick={resetState}
                  className="text-xs text-slate-500 hover:text-rose-600 underline"
                >
                  เลือกไฟล์ใหม่
                </button>
              </div>

              {/* Mode Selection */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="font-semibold text-slate-800 mb-2">ตัวเลือกการนำเข้าข้อมูล:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`p-3 rounded-lg border cursor-pointer flex items-start gap-2.5 transition ${
                    importMode === 'replace' ? 'bg-amber-50 border-amber-400 text-amber-950' : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="mt-0.5 text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <div className="font-bold">แทนที่ข้อมูลเดิมทั้งหมด (Replace)</div>
                      <div className="text-[11px] text-slate-500">
                        ล้างข้อมูลเดิมในระบบ แล้วใช้ข้อมูลจากไฟล์นี้ทั้งหมด
                      </div>
                    </div>
                  </label>

                  <label className={`p-3 rounded-lg border cursor-pointer flex items-start gap-2.5 transition ${
                    importMode === 'append' ? 'bg-sky-50 border-sky-400 text-sky-950' : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="mt-0.5 text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <div className="font-bold">เพิ่มต่อท้ายข้อมูลเดิม (Append)</div>
                      <div className="text-[11px] text-slate-500">
                        คงข้อมูลเดิมไว้ และเพิ่มข้อมูลจากไฟล์เข้าไปต่อท้าย
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Preview Table */}
              <div>
                <div className="font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>ตัวอย่างข้อมูลที่นำเข้า (5 แถวแรก):</span>
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-48 text-[11px]">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-700 sticky top-0">
                      <tr>
                        <th className="p-1.5 border-b border-r">ลำดับ</th>
                        <th className="p-1.5 border-b border-r">หน่วยงาน</th>
                        <th className="p-1.5 border-b border-r">กลุ่ม/จังหวัด</th>
                        <th className="p-1.5 border-b border-r text-center">รวมสัญญาบัตร</th>
                        <th className="p-1.5 border-b border-r text-center">รวมประทวน</th>
                        <th className="p-1.5 border-b text-center font-bold">รวมทั้งหมด</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedData.slice(0, 5).map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-1.5 border-r font-mono text-center">{r.order || i + 1}</td>
                          <td className="p-1.5 border-r font-medium">{r.name}</td>
                          <td className="p-1.5 border-r text-slate-600">{r.group}</td>
                          <td className="p-1.5 border-r text-center font-mono">{r.totalCommissioned_pos}/{r.totalCommissioned_occ}</td>
                          <td className="p-1.5 border-r text-center font-mono">{r.totalNonCommissioned_pos}/{r.totalNonCommissioned_occ}</td>
                          <td className="p-1.5 text-center font-mono font-bold text-amber-700">
                            {r.totalAll_pos}/{r.totalAll_occ}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => { resetState(); onClose(); }}
            className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-200 font-medium transition"
          >
            ยกเลิก
          </button>
          <button
            disabled={!parsedData || parsedData.length === 0}
            onClick={handleConfirmImport}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-slate-950 font-bold px-6 py-2 rounded-xl shadow-md transition active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>ยืนยันการนำเข้าข้อมูล</span>
          </button>
        </div>
      </div>
    </div>
  );
};
