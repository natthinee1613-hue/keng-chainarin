import React, { useState, useEffect } from 'react';
import { X, Check, Calculator, Building, ShieldAlert } from 'lucide-react';
import { PoliceUnitRecord, UNIT_GROUPS, UnitGroup } from '../types';
import { calculateRecordTotals } from '../data/initialData';

interface UnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: PoliceUnitRecord) => void;
  initialData?: PoliceUnitRecord | null;
}

export const UnitModal: React.FC<UnitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<PoliceUnitRecord>>({
    group: 'ภ.จว.ยะลา',
    name: '',
    order: 1,
    isRiskAreaSongkhla: false,
    commander_pos: 0, commander_occ: 0,
    deputyCommander_pos: 0, deputyCommander_occ: 0,
    superintendent_pos: 0, superintendent_occ: 0,
    deputySuperintendent_pos: 0, deputySuperintendent_occ: 0,
    inspector_pos: 0, inspector_occ: 0,
    deputyInspector_pos: 0, deputyInspector_occ: 0,
    totalCommissioned_pos: 0, totalCommissioned_occ: 0,
    seniorSergeantMajor_pos: 0, seniorSergeantMajor_occ: 0,
    squadLeader_pos: 0, squadLeader_occ: 0,
    totalNonCommissioned_pos: 0, totalNonCommissioned_occ: 0,
    deputySquadLeader_pos: 0, deputySquadLeader_occ: 0,
    totalAll_pos: 0, totalAll_occ: 0,
  });

  const isEdit = !!initialData?.id;

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        group: 'ภ.จว.ยะลา',
        name: '',
        order: 1,
        isRiskAreaSongkhla: false,
        commander_pos: 0, commander_occ: 0,
        deputyCommander_pos: 0, deputyCommander_occ: 0,
        superintendent_pos: 0, superintendent_occ: 0,
        deputySuperintendent_pos: 0, deputySuperintendent_occ: 0,
        inspector_pos: 0, inspector_occ: 0,
        deputyInspector_pos: 0, deputyInspector_occ: 0,
        totalCommissioned_pos: 0, totalCommissioned_occ: 0,
        seniorSergeantMajor_pos: 0, seniorSergeantMajor_occ: 0,
        squadLeader_pos: 0, squadLeader_occ: 0,
        totalNonCommissioned_pos: 0, totalNonCommissioned_occ: 0,
        deputySquadLeader_pos: 0, deputySquadLeader_occ: 0,
        totalAll_pos: 0, totalAll_occ: 0,
      });
    }
  }, [initialData, isOpen]);

  // Recalculate totals whenever rank numbers change
  const handleNumberChange = (field: keyof PoliceUnitRecord, value: string) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    const updated = { ...formData, [field]: num };
    const withTotals = calculateRecordTotals(updated);
    setFormData(withTotals);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('กรุณากรอกชื่อหน่วยงาน');
      return;
    }

    const calculated = calculateRecordTotals(formData);
    const finalRecord: PoliceUnitRecord = {
      id: initialData?.id || `unit-${Date.now()}`,
      order: formData.order || 1,
      group: formData.group || 'ภ.จว.ยะลา',
      name: formData.name.trim(),
      isRiskAreaSongkhla: formData.group === 'ภ.จว.สงขลา' ? !!formData.isRiskAreaSongkhla : false,
      commander_pos: calculated.commander_pos || 0,
      commander_occ: calculated.commander_occ || 0,
      deputyCommander_pos: calculated.deputyCommander_pos || 0,
      deputyCommander_occ: calculated.deputyCommander_occ || 0,
      superintendent_pos: calculated.superintendent_pos || 0,
      superintendent_occ: calculated.superintendent_occ || 0,
      deputySuperintendent_pos: calculated.deputySuperintendent_pos || 0,
      deputySuperintendent_occ: calculated.deputySuperintendent_occ || 0,
      inspector_pos: calculated.inspector_pos || 0,
      inspector_occ: calculated.inspector_occ || 0,
      deputyInspector_pos: calculated.deputyInspector_pos || 0,
      deputyInspector_occ: calculated.deputyInspector_occ || 0,
      totalCommissioned_pos: calculated.totalCommissioned_pos || 0,
      totalCommissioned_occ: calculated.totalCommissioned_occ || 0,
      seniorSergeantMajor_pos: calculated.seniorSergeantMajor_pos || 0,
      seniorSergeantMajor_occ: calculated.seniorSergeantMajor_occ || 0,
      squadLeader_pos: calculated.squadLeader_pos || 0,
      squadLeader_occ: calculated.squadLeader_occ || 0,
      totalNonCommissioned_pos: calculated.totalNonCommissioned_pos || 0,
      totalNonCommissioned_occ: calculated.totalNonCommissioned_occ || 0,
      deputySquadLeader_pos: calculated.deputySquadLeader_pos || 0,
      deputySquadLeader_occ: calculated.deputySquadLeader_occ || 0,
      totalAll_pos: calculated.totalAll_pos || 0,
      totalAll_occ: calculated.totalAll_occ || 0,
    };

    onSave(finalRecord);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Building className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg font-['Prompt'] text-white">
              {isEdit ? 'แก้ไขข้อมูลหน่วยงาน / สถานภาพกำลังพล' : 'เพิ่มหน่วยงานและอัตรากำลังพลใหม่'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                สังกัดกลุ่ม / จังหวัด <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                {UNIT_GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                ชื่อหน่วยงาน <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="เช่น สภ.เมืองยะลา หรือ กก.สืบสวน ภ.จว.ยะลา"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ลำดับที่แสดง
              </label>
              <input
                type="number"
                min="1"
                value={formData.order || 1}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            {formData.group === 'ภ.จว.สงขลา' && (
              <div className="sm:col-span-2 flex items-center">
                <label className="flex items-center gap-2 cursor-pointer bg-red-50 border border-red-200 px-3 py-2 rounded-lg text-red-900 w-full">
                  <input
                    type="checkbox"
                    checked={!!formData.isRiskAreaSongkhla}
                    onChange={(e) => setFormData({ ...formData, isRiskAreaSongkhla: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                  />
                  <div className="text-xs">
                    <span className="font-bold">พื้นที่เสี่ยงภัยเฉพาะ 4 อำเภอ จว.สงขลา</span>
                    <span className="text-red-700 ml-1">(นาทวี, เทพา, สะบ้าย้อย, จะนะ)</span>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Rank Section 1: ชั้นสัญญาบัตร */}
          <div className="border border-sky-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-sky-50 px-4 py-2 border-b border-sky-200 font-bold text-sky-950 flex items-center justify-between">
              <span>1. ชั้นสัญญาบัตร (Commissioned Officers)</span>
              <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                รวมสัญญาบัตร: {formData.totalCommissioned_pos} ตำแหน่ง / {formData.totalCommissioned_occ} คนครอง
              </span>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-6 gap-3 bg-white">
              {/* ผบก. */}
              <div className="space-y-1">
                <span className="font-semibold text-slate-700 text-xs">ผบก.</span>
                <input
                  type="number"
                  min="0"
                  placeholder="ตำแหน่ง"
                  value={formData.commander_pos || ''}
                  onChange={(e) => handleNumberChange('commander_pos', e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-center text-xs font-mono"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="คนครอง"
                  value={formData.commander_occ || ''}
                  onChange={(e) => handleNumberChange('commander_occ', e.target.value)}
                  className="w-full px-2 py-1.5 border border-sky-300 rounded text-center text-xs font-mono text-sky-800"
                />
              </div>

              {/* รอง ผบก. */}
              <div className="space-y-1">
                <span className="font-semibold text-slate-700 text-xs">รอง ผบก.</span>
                <input
                  type="number"
                  min="0"
                  placeholder="ตำแหน่ง"
                  value={formData.deputyCommander_pos || ''}
                  onChange={(e) => handleNumberChange('deputyCommander_pos', e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-center text-xs font-mono"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="คนครอง"
                  value={formData.deputyCommander_occ || ''}
                  onChange={(e) => handleNumberChange('deputyCommander_occ', e.target.value)}
                  className="w-full px-2 py-1.5 border border-sky-300 rounded text-center text-xs font-mono text-sky-800"
                />
              </div>

              {/* ผกก. */}
              <div className="space-y-1">
                <span className="font-semibold text-slate-700 text-xs">ผกก.</span>
                <input
                  type="number"
                  min="0"
                  placeholder="ตำแหน่ง"
                  value={formData.superintendent_pos || ''}
                  onChange={(e) => handleNumberChange('superintendent_pos', e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-center text-xs font-mono"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="คนครอง"
                  value={formData.superintendent_occ || ''}
                  onChange={(e) => handleNumberChange('superintendent_occ', e.target.value)}
                  className="w-full px-2 py-1.5 border border-sky-300 rounded text-center text-xs font-mono text-sky-800"
                />
              </div>

              {/* รอง ผกก. */}
              <div className="space-y-1">
                <span className="font-semibold text-slate-700 text-xs">รอง ผกก.</span>
                <input
                  type="number"
                  min="0"
                  placeholder="ตำแหน่ง"
                  value={formData.deputySuperintendent_pos || ''}
                  onChange={(e) => handleNumberChange('deputySuperintendent_pos', e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-center text-xs font-mono"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="คนครอง"
                  value={formData.deputySuperintendent_occ || ''}
                  onChange={(e) => handleNumberChange('deputySuperintendent_occ', e.target.value)}
                  className="w-full px-2 py-1.5 border border-sky-300 rounded text-center text-xs font-mono text-sky-800"
                />
              </div>

              {/* สว. */}
              <div className="space-y-1">
                <span className="font-semibold text-slate-700 text-xs">สว.</span>
                <input
                  type="number"
                  min="0"
                  placeholder="ตำแหน่ง"
                  value={formData.inspector_pos || ''}
                  onChange={(e) => handleNumberChange('inspector_pos', e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-center text-xs font-mono"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="คนครอง"
                  value={formData.inspector_occ || ''}
                  onChange={(e) => handleNumberChange('inspector_occ', e.target.value)}
                  className="w-full px-2 py-1.5 border border-sky-300 rounded text-center text-xs font-mono text-sky-800"
                />
              </div>

              {/* รอง สว. */}
              <div className="space-y-1">
                <span className="font-semibold text-slate-700 text-xs">รอง สว.</span>
                <input
                  type="number"
                  min="0"
                  placeholder="ตำแหน่ง"
                  value={formData.deputyInspector_pos || ''}
                  onChange={(e) => handleNumberChange('deputyInspector_pos', e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-center text-xs font-mono"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="คนครอง"
                  value={formData.deputyInspector_occ || ''}
                  onChange={(e) => handleNumberChange('deputyInspector_occ', e.target.value)}
                  className="w-full px-2 py-1.5 border border-sky-300 rounded text-center text-xs font-mono text-sky-800"
                />
              </div>
            </div>
            <div className="px-4 py-1.5 bg-slate-50 text-[11px] text-slate-500 border-t border-slate-200">
              * แถวบน: อัตราตำแหน่ง | แถวล่าง: คนครองจริง
            </div>
          </div>

          {/* Rank Section 2: ชั้นประทวน */}
          <div className="border border-emerald-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-200 font-bold text-emerald-950 flex items-center justify-between">
              <span>2. ชั้นประทวน (Non-Commissioned Officers)</span>
              <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                รวมชั้นประทวน: {formData.totalNonCommissioned_pos} ตำแหน่ง / {formData.totalNonCommissioned_occ} คนครอง
              </span>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white">
              {/* รอง สว.(ด.ต.53 ปี) */}
              <div className="space-y-1">
                <span className="font-semibold text-slate-700 text-xs">รอง สว.(ด.ต.53 ปี)</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="ตำแหน่ง"
                    value={formData.seniorSergeantMajor_pos || ''}
                    onChange={(e) => handleNumberChange('seniorSergeantMajor_pos', e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-center text-xs font-mono"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="คนครอง"
                    value={formData.seniorSergeantMajor_occ || ''}
                    onChange={(e) => handleNumberChange('seniorSergeantMajor_occ', e.target.value)}
                    className="w-full px-2 py-1.5 border border-emerald-300 rounded text-center text-xs font-mono text-emerald-800"
                  />
                </div>
              </div>

              {/* ผบ.หมู่ */}
              <div className="space-y-1">
                <span className="font-semibold text-slate-700 text-xs">ผบ.หมู่</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="ตำแหน่ง"
                    value={formData.squadLeader_pos || ''}
                    onChange={(e) => handleNumberChange('squadLeader_pos', e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-center text-xs font-mono"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="คนครอง"
                    value={formData.squadLeader_occ || ''}
                    onChange={(e) => handleNumberChange('squadLeader_occ', e.target.value)}
                    className="w-full px-2 py-1.5 border border-emerald-300 rounded text-center text-xs font-mono text-emerald-800"
                  />
                </div>
              </div>

              {/* รอง ผบ.หมู่ */}
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <span className="font-semibold text-slate-700 text-xs">รอง ผบ.หมู่ (ฝึกอบรม/อื่นๆ)</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="ตำแหน่ง"
                    value={formData.deputySquadLeader_pos || ''}
                    onChange={(e) => handleNumberChange('deputySquadLeader_pos', e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-center text-xs font-mono"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="คนครอง"
                    value={formData.deputySquadLeader_occ || ''}
                    onChange={(e) => handleNumberChange('deputySquadLeader_occ', e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-center text-xs font-mono text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Auto Computed Grand Total Preview */}
          <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 border border-slate-700">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              <div>
                <div className="font-bold text-sm font-['Prompt'] text-amber-300">
                  สรุปยอดรวมของหน่วยงานนี้ (คำนวณอัตโนมัติ)
                </div>
                <div className="text-xs text-slate-400">
                  รวมสัญญาบัตร + ชั้นประทวน + รอง ผบ.หมู่
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-[10px] text-slate-400">ตำแหน่งรวม</div>
                <div className="text-lg font-mono font-bold text-white">
                  {formData.totalAll_pos || 0}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400">คนครองจริง</div>
                <div className="text-lg font-mono font-bold text-amber-300">
                  {formData.totalAll_occ || 0}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400">อัตราครองคน</div>
                <div className="text-lg font-mono font-bold text-emerald-400">
                  {formData.totalAll_pos && formData.totalAll_pos > 0
                    ? `${(((formData.totalAll_occ || 0) / formData.totalAll_pos) * 100).toFixed(1)}%`
                    : '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-medium transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2 rounded-xl shadow-md transition active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มหน่วยงาน'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
