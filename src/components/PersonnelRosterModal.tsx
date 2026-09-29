import React, { useState } from 'react';
import { X, Users, UserCheck, AlertCircle, Plus, Trash2, Printer, Shield, Eye, Flame, AlertTriangle } from 'lucide-react';
import { PoliceUnitRecord, OfficerRosterItem } from '../types';
import { getThreatInfo, isRedThreatZone } from '../data/threatZonesData';

interface PersonnelRosterModalProps {
  unit: PoliceUnitRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveRoster?: (unitId: string, roster: OfficerRosterItem[]) => void;
}

export const PersonnelRosterModal: React.FC<PersonnelRosterModalProps> = ({
  unit,
  isOpen,
  onClose,
  onSaveRoster,
}) => {
  const [newRank, setNewRank] = useState('ผกก.');
  const [newName, setNewName] = useState('');
  const [newPosition, setNewPosition] = useState('');
  const [newStatus, setNewStatus] = useState<'ครองตำแหน่ง' | 'รักษาราชการแทน' | 'ช่วยราชการ' | 'ว่าง'>('ครองตำแหน่ง');

  if (!isOpen || !unit) return null;

  const currentRoster = unit.rosterList || [];
  const threatInfo = getThreatInfo(unit.name);
  const isRed = isRedThreatZone(unit.name) || !!unit.isRiskAreaSongkhla;

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: OfficerRosterItem = {
      id: `roster-${Date.now()}`,
      rankTitle: newRank,
      fullName: newName.trim(),
      positionTitle: newPosition.trim() || `${newRank}${unit.name}`,
      status: newStatus,
    };

    const updated = [...currentRoster, newItem];
    if (onSaveRoster) {
      onSaveRoster(unit.id, updated);
    }
    setNewName('');
    setNewPosition('');
  };

  const handleDeletePerson = (id: string) => {
    const updated = currentRoster.filter((p) => p.id !== id);
    if (onSaveRoster) {
      onSaveRoster(unit.id, updated);
    }
  };

  // Rank breakdown table data
  const rankRows = [
    { title: 'ผบก.', pos: unit.commander_pos, occ: unit.commander_occ, group: 'สัญญาบัตร' },
    { title: 'รอง ผบก.', pos: unit.deputyCommander_pos, occ: unit.deputyCommander_occ, group: 'สัญญาบัตร' },
    { title: 'ผกก.', pos: unit.superintendent_pos, occ: unit.superintendent_occ, group: 'สัญญาบัตร' },
    { title: 'รอง ผกก.', pos: unit.deputySuperintendent_pos, occ: unit.deputySuperintendent_occ, group: 'สัญญาบัตร' },
    { title: 'สว.', pos: unit.inspector_pos, occ: unit.inspector_occ, group: 'สัญญาบัตร' },
    { title: 'รอง สว.', pos: unit.deputyInspector_pos, occ: unit.deputyInspector_occ, group: 'สัญญาบัตร' },
    { title: 'รวมชั้นสัญญาบัตร', pos: unit.totalCommissioned_pos, occ: unit.totalCommissioned_occ, isSubtotal: true, color: 'bg-amber-50 text-amber-950 font-bold' },
    { title: 'รอง สว.(ด.ต.53 ปี)', pos: unit.seniorSergeantMajor_pos, occ: unit.seniorSergeantMajor_occ, group: 'ประทวน' },
    { title: 'ผบ.หมู่', pos: unit.squadLeader_pos, occ: unit.squadLeader_occ, group: 'ประทวน' },
    { title: 'ชั้นประทวน', pos: unit.totalNonCommissioned_pos, occ: unit.totalNonCommissioned_occ, isSubtotal: true, color: 'bg-emerald-50 text-emerald-950 font-bold' },
    { title: 'รอง ผบ.หมู่', pos: unit.deputySquadLeader_pos, occ: unit.deputySquadLeader_occ, group: 'ฝึกอบรม' },
    { title: 'รวมทั้งหมด', pos: unit.totalAll_pos, occ: unit.totalAll_occ, isTotal: true, color: 'bg-slate-900 text-amber-300 font-bold' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-300 font-medium">รายละเอียดสถานภาพตัวคน ทุกระดับชั้นยศ</div>
              <h3 className="font-bold text-lg font-['Prompt'] text-white">
                {unit.name} ({unit.group})
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* Security Threat Alert (if Red Risk Area) */}
          {isRed && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                <span className="font-bold text-red-900 text-sm font-['Prompt']">
                  🔴 หน่วยงานในพื้นที่เสี่ยงภัยสีแดง (จุดเฝ้าระวังพิเศษ & ก่อเหตุบ่อย)
                </span>
              </div>
              {threatInfo && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="bg-white/90 p-2.5 rounded-lg border border-red-200">
                    <div className="font-bold text-amber-900 flex items-center gap-1 mb-0.5">
                      <Eye className="w-3.5 h-3.5 text-amber-700" />
                      <span>ตรงที่ควรเฝ้าระวัง:</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed">{threatInfo.riskSpots}</p>
                  </div>
                  <div className="bg-white/90 p-2.5 rounded-lg border border-red-200">
                    <div className="font-bold text-rose-900 flex items-center gap-1 mb-0.5">
                      <Flame className="w-3.5 h-3.5 text-rose-700" />
                      <span>ตรงที่ชอบก่อเหตุ:</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed">{threatInfo.frequentIncidents}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-sky-50 border border-sky-100 p-3.5 rounded-xl">
              <div className="text-[11px] text-sky-800">อัตราตำแหน่งทั้งหมด</div>
              <div className="text-2xl font-bold font-mono text-sky-950">{unit.totalAll_pos}</div>
              <div className="text-[10px] text-sky-600">ตำแหน่งที่ได้รับจัดสรร</div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl">
              <div className="text-[11px] text-emerald-800">จำนวนตัวคนครองจริง</div>
              <div className="text-2xl font-bold font-mono text-emerald-950">{unit.totalAll_occ}</div>
              <div className="text-[10px] text-emerald-600">
                อัตราครองคน {unit.totalAll_pos > 0 ? ((unit.totalAll_occ / unit.totalAll_pos) * 100).toFixed(1) : 0}%
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-xl">
              <div className="text-[11px] text-rose-800">ตำแหน่งว่าง / ขาดแคลน</div>
              <div className="text-2xl font-bold font-mono text-rose-950">
                {Math.max(0, unit.totalAll_pos - unit.totalAll_occ)}
              </div>
              <div className="text-[10px] text-rose-600">นายที่ยังไม่มีผู้ปฏิบัติการ</div>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-xl">
              <div className="text-[11px] text-amber-800">สัดส่วนสัญญาบัตร : ประทวน</div>
              <div className="text-xl font-bold font-mono text-amber-950">
                {unit.totalCommissioned_occ} : {unit.totalNonCommissioned_occ}
              </div>
              <div className="text-[10px] text-amber-700">นายสัญญาบัตร / นายประทวน</div>
            </div>
          </div>

          {/* Detailed Rank Grid */}
          <div>
            <h4 className="font-bold text-slate-800 mb-2 font-['Prompt'] flex items-center justify-between">
              <span>ตารางสถานภาพตัวคนแยกทุกชั้นยศ (ตำแหน่ง vs คนครองจริง)</span>
              <span className="text-xs font-normal text-slate-500">ข้อมูลตามเอกสารทางการ</span>
            </h4>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="py-2 px-3 font-bold">ระดับชั้นยศ / ตำแหน่ง</th>
                    <th className="py-2 px-3 text-center font-bold">อัตราตำแหน่ง</th>
                    <th className="py-2 px-3 text-center font-bold">คนครอง (ตัวคนจริง)</th>
                    <th className="py-2 px-3 text-center font-bold">ขาดแคลน / ว่าง</th>
                    <th className="py-2 px-3 text-center font-bold">อัตราครองคน (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rankRows.map((r, i) => {
                    const diff = r.pos - r.occ;
                    const pct = r.pos > 0 ? (r.occ / r.pos) * 100 : 0;

                    return (
                      <tr
                        key={i}
                        className={`${r.color || 'hover:bg-slate-50'} ${
                          r.isSubtotal ? 'border-y border-amber-300' : ''
                        } ${r.isTotal ? 'border-t-2 border-amber-400' : ''}`}
                      >
                        <td className="py-2 px-3 font-medium">
                          {r.isSubtotal ? '📊 ' : r.isTotal ? '⭐ ' : '• '}
                          {r.title}
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-semibold">{r.pos}</td>
                        <td className="py-2 px-3 text-center font-mono font-bold">{r.occ}</td>
                        <td className="py-2 px-3 text-center font-mono">
                          {diff > 0 ? (
                            <span className="text-rose-600 font-medium">-{diff}</span>
                          ) : diff < 0 ? (
                            <span className="text-blue-600">+{Math.abs(diff)}</span>
                          ) : (
                            <span className="text-slate-400">ครบ</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center font-mono">
                          {r.pos > 0 ? (
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              pct >= 90
                                ? 'bg-emerald-100 text-emerald-800'
                                : pct >= 70
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {pct.toFixed(0)}%
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Officer Names / Personnel Roster (รายชื่อตัวคนครองตำแหน่ง) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-800 font-['Prompt']">
                  รายชื่อตัวคนครองตำแหน่ง (Personnel Roster)
                </h4>
                <p className="text-xs text-slate-500">
                  บันทึกรายชื่อข้าราชการตำรวจผู้ครองตำแหน่งจริงในหน่วยงานนี้
                </p>
              </div>
              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full font-mono">
                บันทึกแล้ว {currentRoster.length} นาย
              </span>
            </div>

            {/* Add person form */}
            <form onSubmit={handleAddPerson} className="grid grid-cols-1 sm:grid-cols-5 gap-2 bg-white p-3 rounded-lg border border-slate-200">
              <div>
                <select
                  value={newRank}
                  onChange={(e) => setNewRank(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                >
                  <option value="ผบก.">ผบก.</option>
                  <option value="รอง ผบก.">รอง ผบก.</option>
                  <option value="ผกก.">ผกก.</option>
                  <option value="รอง ผกก.">รอง ผกก.</option>
                  <option value="สว.">สว.</option>
                  <option value="รอง สว.">รอง สว.</option>
                  <option value="รอง สว.(ด.ต.53 ปี)">รอง สว.(ด.ต.53 ปี)</option>
                  <option value="ผบ.หมู่">ผบ.หมู่</option>
                  <option value="รอง ผบ.หมู่">รอง ผบ.หมู่</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="ยศ ชื่อ-นามสกุล (เช่น พ.ต.อ.สมชาย ใจดี)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                />
              </div>

              <div>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                >
                  <option value="ครองตำแหน่ง">ครองตำแหน่ง</option>
                  <option value="รักษาราชการแทน">รักษาราชการแทน</option>
                  <option value="ช่วยราชการ">ช่วยราชการ</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1.5 px-3 rounded flex items-center justify-center gap-1 text-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่มตัวคน</span>
                </button>
              </div>
            </form>

            {/* List of registered persons */}
            {currentRoster.length > 0 ? (
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg bg-white overflow-hidden">
                {currentRoster.map((person) => (
                  <div key={person.id} className="p-2.5 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 min-w-[70px]">{person.rankTitle}</span>
                      <span className="text-slate-900">{person.fullName}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {person.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeletePerson(person.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-slate-400 text-xs bg-white rounded-lg border border-slate-200 border-dashed">
                ยังไม่มีการบันทึกรายชื่อตัวคนในระบบ (สามารถกรอกชื่อและยศเพื่อบันทึกได้)
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-xs font-medium"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์รายงานตัวคน</span>
          </button>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2 rounded-xl text-xs transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
