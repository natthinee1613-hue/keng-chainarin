import React, { useState } from 'react';
import { X, Users, UserCheck, AlertCircle, Plus, Trash2, Printer, Shield, Eye, Flame, Palette } from 'lucide-react';
import { PoliceUnitRecord, OfficerRosterItem } from '../types';
import { getThreatInfo, isRedThreatZone } from '../data/threatZonesData';
import { AppThemeConfig } from '../types/theme';

export type RosterBgMode = 'royal-navy' | 'classic-light' | 'tactical-dark';

interface PersonnelRosterModalProps {
  unit: PoliceUnitRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveRoster?: (unitId: string, roster: OfficerRosterItem[]) => void;
  theme?: AppThemeConfig;
}

export const PersonnelRosterModal: React.FC<PersonnelRosterModalProps> = ({
  unit,
  isOpen,
  onClose,
  onSaveRoster,
  theme,
}) => {
  // Modal background theme state (persisted or initial from appTheme)
  const [bgMode, setBgMode] = useState<RosterBgMode>(() => {
    try {
      const saved = localStorage.getItem('police_roster_modal_bg_v2');
      if (saved && ['royal-navy', 'classic-light', 'tactical-dark'].includes(saved)) {
        return saved as RosterBgMode;
      }
    } catch (e) {}
    if (theme?.bgMode === 'navy' || theme?.id === 'royal-navy') return 'royal-navy';
    if (theme?.bgMode === 'dark' || theme?.id === 'cyber-night') return 'tactical-dark';
    return 'royal-navy';
  });

  const handleSelectBgMode = (mode: RosterBgMode) => {
    setBgMode(mode);
    try {
      localStorage.setItem('police_roster_modal_bg_v2', mode);
    } catch (e) {}
  };

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

  // Rank breakdown table data with specialized background styling for EVERY RANK LEVEL
  const rankRows = [
    {
      title: 'ผบก.',
      subtitle: 'ผู้บังคับการ (พล.ต.ต.)',
      pos: unit.commander_pos,
      occ: unit.commander_occ,
      group: 'สัญญาบัตร',
      tier: 'commander',
      lightBg: 'bg-gradient-to-r from-amber-100/90 via-amber-50/70 to-amber-50/30 border-l-4 border-amber-500 text-amber-950',
      navyBg: 'bg-gradient-to-r from-[#2a1d08]/80 via-[#1f1505]/60 to-transparent border-l-4 border-amber-400 text-amber-200',
      darkBg: 'bg-gradient-to-r from-[#261904]/90 via-[#1a1102]/60 to-transparent border-l-4 border-amber-400 text-amber-300',
      tagBg: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30',
    },
    {
      title: 'รอง ผบก.',
      subtitle: 'รองผู้บังคับการ (พ.ต.อ.(พิเศษ))',
      pos: unit.deputyCommander_pos,
      occ: unit.deputyCommander_occ,
      group: 'สัญญาบัตร',
      tier: 'deputy-commander',
      lightBg: 'bg-gradient-to-r from-amber-50/80 via-amber-50/40 to-transparent border-l-4 border-amber-400 text-amber-900',
      navyBg: 'bg-gradient-to-r from-[#221706]/70 via-[#170f03]/40 to-transparent border-l-4 border-amber-500/70 text-amber-300',
      darkBg: 'bg-gradient-to-r from-[#1f1403]/80 via-[#140c01]/40 to-transparent border-l-4 border-amber-500/70 text-amber-300',
      tagBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    },
    {
      title: 'ผกก.',
      subtitle: 'ผู้กำกับการ (พ.ต.อ.)',
      pos: unit.superintendent_pos,
      occ: unit.superintendent_occ,
      group: 'สัญญาบัตร',
      tier: 'superintendent',
      lightBg: 'bg-gradient-to-r from-sky-100/80 via-sky-50/50 to-transparent border-l-4 border-sky-500 text-sky-950',
      navyBg: 'bg-gradient-to-r from-[#0d2238]/80 via-[#081726]/60 to-transparent border-l-4 border-sky-400 text-sky-200',
      darkBg: 'bg-gradient-to-r from-[#0a1e33]/90 via-[#061421]/60 to-transparent border-l-4 border-sky-400 text-sky-300',
      tagBg: 'bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-500/30',
    },
    {
      title: 'รอง ผกก.',
      subtitle: 'รองผู้กำกับการ (พ.ต.ท.)',
      pos: unit.deputySuperintendent_pos,
      occ: unit.deputySuperintendent_occ,
      group: 'สัญญาบัตร',
      tier: 'deputy-superintendent',
      lightBg: 'bg-gradient-to-r from-sky-50/70 via-sky-50/30 to-transparent border-l-4 border-sky-400 text-sky-900',
      navyBg: 'bg-gradient-to-r from-[#091a2e]/70 via-[#05101c]/40 to-transparent border-l-4 border-sky-500/70 text-sky-300',
      darkBg: 'bg-gradient-to-r from-[#071524]/80 via-[#040c17]/40 to-transparent border-l-4 border-sky-500/70 text-sky-300',
      tagBg: 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-500/20',
    },
    {
      title: 'สว.',
      subtitle: 'สารวัตร (พ.ต.ท. / พ.ต.ต.)',
      pos: unit.inspector_pos,
      occ: unit.inspector_occ,
      group: 'สัญญาบัตร',
      tier: 'inspector',
      lightBg: 'bg-gradient-to-r from-indigo-100/70 via-indigo-50/40 to-transparent border-l-4 border-indigo-500 text-indigo-950',
      navyBg: 'bg-gradient-to-r from-[#171b38]/80 via-[#0d1024]/60 to-transparent border-l-4 border-indigo-400 text-indigo-200',
      darkBg: 'bg-gradient-to-r from-[#12152e]/90 via-[#0a0d1f]/60 to-transparent border-l-4 border-indigo-400 text-indigo-300',
      tagBg: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30',
    },
    {
      title: 'รอง สว.',
      subtitle: 'รองสารวัตร (ร.ต.อ. / ร.ต.ท. / ร.ต.ต.)',
      pos: unit.deputyInspector_pos,
      occ: unit.deputyInspector_occ,
      group: 'สัญญาบัตร',
      tier: 'deputy-inspector',
      lightBg: 'bg-gradient-to-r from-blue-50/70 via-blue-50/30 to-transparent border-l-4 border-blue-400 text-blue-950',
      navyBg: 'bg-gradient-to-r from-[#0e1d33]/70 via-[#081221]/40 to-transparent border-l-4 border-blue-400/70 text-blue-200',
      darkBg: 'bg-gradient-to-r from-[#0a1526]/80 via-[#050c17]/40 to-transparent border-l-4 border-blue-400/70 text-blue-300',
      tagBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/20',
    },
    {
      title: 'รวมชั้นสัญญาบัตร',
      subtitle: 'ยอดรวมข้าราชการตำรวจชั้นสัญญาบัตรทั้งหมด',
      pos: unit.totalCommissioned_pos,
      occ: unit.totalCommissioned_occ,
      isSubtotal: true,
      group: 'สัญญาบัตร',
      tier: 'subtotal-commissioned',
      lightBg: 'bg-gradient-to-r from-amber-200/90 via-amber-100 to-amber-200/80 text-amber-950 font-bold border-y-2 border-amber-400 shadow-xs',
      navyBg: 'bg-gradient-to-r from-[#332208]/90 via-[#261905] to-[#332208]/90 text-amber-200 font-bold border-y-2 border-amber-400/80 shadow-xs',
      darkBg: 'bg-gradient-to-r from-[#2b1c06]/95 via-[#1e1303] to-[#2b1c06]/95 text-amber-300 font-bold border-y-2 border-amber-400/80 shadow-xs',
      tagBg: 'bg-amber-600 text-white font-bold',
    },
    {
      title: 'รอง สว.(ด.ต.53 ปี)',
      subtitle: 'ดาบตำรวจอาวุโสครองตำแหน่งเทียบเท่ารองสารวัตร',
      pos: unit.seniorSergeantMajor_pos,
      occ: unit.seniorSergeantMajor_occ,
      group: 'ประทวน',
      tier: 'senior-sergeant',
      lightBg: 'bg-gradient-to-r from-teal-100/70 via-teal-50/40 to-transparent border-l-4 border-teal-500 text-teal-950',
      navyBg: 'bg-gradient-to-r from-[#0c2925]/80 via-[#061a17]/60 to-transparent border-l-4 border-teal-400 text-teal-200',
      darkBg: 'bg-gradient-to-r from-[#08211e]/90 via-[#041412]/60 to-transparent border-l-4 border-teal-400 text-teal-300',
      tagBg: 'bg-teal-500/20 text-teal-600 dark:text-teal-300 border border-teal-500/30',
    },
    {
      title: 'ผบ.หมู่',
      subtitle: 'ผู้บังคับหมู่ (ส.ต.ต. - ด.ต.) สายตรวจ / สืบสวน / นปพ.',
      pos: unit.squadLeader_pos,
      occ: unit.squadLeader_occ,
      group: 'ประทวน',
      tier: 'squad-leader',
      lightBg: 'bg-gradient-to-r from-emerald-100/70 via-emerald-50/40 to-transparent border-l-4 border-emerald-500 text-emerald-950',
      navyBg: 'bg-gradient-to-r from-[#0b291a]/80 via-[#061a10]/60 to-transparent border-l-4 border-emerald-400 text-emerald-200',
      darkBg: 'bg-gradient-to-r from-[#072115]/90 via-[#04140c]/60 to-transparent border-l-4 border-emerald-400 text-emerald-300',
      tagBg: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30',
    },
    {
      title: 'ชั้นประทวน',
      subtitle: 'ยอดรวมข้าราชการตำรวจชั้นประทวนทั้งหมด',
      pos: unit.totalNonCommissioned_pos,
      occ: unit.totalNonCommissioned_occ,
      isSubtotal: true,
      group: 'ประทวน',
      tier: 'subtotal-noncommissioned',
      lightBg: 'bg-gradient-to-r from-emerald-200/90 via-emerald-100 to-emerald-200/80 text-emerald-950 font-bold border-y-2 border-emerald-400 shadow-xs',
      navyBg: 'bg-gradient-to-r from-[#0e3321]/90 via-[#092417] to-[#0e3321]/90 text-emerald-200 font-bold border-y-2 border-emerald-400/80 shadow-xs',
      darkBg: 'bg-gradient-to-r from-[#092618]/95 via-[#061a10] to-[#092618]/95 text-emerald-300 font-bold border-y-2 border-emerald-400/80 shadow-xs',
      tagBg: 'bg-emerald-600 text-white font-bold',
    },
    {
      title: 'รอง ผบ.หมู่',
      subtitle: 'นักเรียนนายสิบ / อัตรากำลังพลบรรจุเตรียมพร้อม',
      pos: unit.deputySquadLeader_pos,
      occ: unit.deputySquadLeader_occ,
      group: 'ฝึกอบรม',
      tier: 'deputy-squad-leader',
      lightBg: 'bg-gradient-to-r from-purple-100/70 via-purple-50/40 to-transparent border-l-4 border-purple-400 text-purple-950',
      navyBg: 'bg-gradient-to-r from-[#231536]/80 via-[#140b21]/60 to-transparent border-l-4 border-purple-400 text-purple-200',
      darkBg: 'bg-gradient-to-r from-[#1c102c]/90 via-[#0f0719]/60 to-transparent border-l-4 border-purple-400 text-purple-300',
      tagBg: 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30',
    },
    {
      title: 'รวมทั้งหมด',
      subtitle: 'อัตรากำลังพลรวมทุกระดับชั้นยศของหน่วยงาน',
      pos: unit.totalAll_pos,
      occ: unit.totalAll_occ,
      isTotal: true,
      group: 'สรุปรวม',
      tier: 'grand-total',
      lightBg: 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-amber-300 font-bold border-t-2 border-amber-400 shadow-md',
      navyBg: 'bg-gradient-to-r from-[#060e1c] via-[#0c1c36] to-[#060e1c] text-amber-300 font-bold border-t-2 border-amber-400 shadow-lg',
      darkBg: 'bg-gradient-to-r from-[#02050b] via-[#09101c] to-[#02050b] text-amber-300 font-bold border-t-2 border-amber-400 shadow-lg',
      tagBg: 'bg-amber-400 text-slate-950 font-black',
    },
  ];

  // Colors based on current bgMode
  const modalContainerBg =
    bgMode === 'royal-navy'
      ? 'bg-gradient-to-b from-[#0b172a] via-[#070e1b] to-[#040810] text-slate-100 border-amber-500/50 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]'
      : bgMode === 'tactical-dark'
      ? 'bg-gradient-to-b from-[#0a0f1d] via-[#05070e] to-[#020307] text-slate-100 border-slate-700 shadow-2xl'
      : 'bg-gradient-to-b from-[#ffffff] via-[#f8fafc] to-[#f1f5f9] text-slate-800 border-slate-300 shadow-2xl';

  const modalHeaderBg =
    bgMode === 'royal-navy'
      ? 'bg-gradient-to-r from-[#0b1f3d] via-[#102a52] to-[#0b1f3d] border-b border-amber-500/50 text-white'
      : bgMode === 'tactical-dark'
      ? 'bg-gradient-to-r from-slate-950 via-[#0f172a] to-slate-950 border-b border-slate-800 text-white'
      : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-amber-400/40 text-white';

  const tableWrapperBorder =
    bgMode === 'royal-navy'
      ? 'border-amber-500/40 bg-[#07111e]/90 shadow-lg'
      : bgMode === 'tactical-dark'
      ? 'border-slate-800 bg-[#050912]/90 shadow-lg'
      : 'border-slate-300 bg-white shadow-sm';

  const tableHeaderBg =
    bgMode === 'royal-navy'
      ? 'bg-gradient-to-r from-[#102444] via-[#15305b] to-[#102444] text-amber-200 border-b border-amber-500/40'
      : bgMode === 'tactical-dark'
      ? 'bg-gradient-to-r from-slate-900 via-[#1e293b] to-slate-900 text-sky-200 border-b border-slate-700'
      : 'bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 text-slate-800 border-b border-slate-300';

  const subBoxBg =
    bgMode === 'royal-navy'
      ? 'bg-[#081526]/80 border-amber-500/30'
      : bgMode === 'tactical-dark'
      ? 'bg-[#0b1220]/80 border-slate-800'
      : 'bg-slate-50 border-slate-200';

  const footerBg =
    bgMode === 'royal-navy'
      ? 'bg-[#050c17] border-t border-amber-500/30'
      : bgMode === 'tactical-dark'
      ? 'bg-[#03060c] border-t border-slate-800'
      : 'bg-slate-100 border-t border-slate-200';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div
        className={`${modalContainerBg} rounded-2xl border w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors`}
      >
        {/* Header */}
        <div className={`${modalHeaderBg} px-5 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/30 via-amber-400/20 to-transparent border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-md">
              <Shield className="w-6 h-6 drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-300 font-bold font-['Prompt'] tracking-wide">
                  รายละเอียดสถานภาพตัวคน ทุกระดับชั้นยศ
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-200 font-mono">
                  ภ.9 OFFICIAL
                </span>
              </div>
              <h3 className="font-bold text-lg sm:text-xl font-['Prompt'] text-white drop-shadow-sm flex items-center gap-2">
                <span>{unit.name}</span>
                <span className="text-xs font-normal text-slate-300">({unit.group})</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Background Theme Selector for this feature */}
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm p-1 rounded-xl border border-white/15 text-xs">
              <span className="text-[11px] text-white/60 px-1 hidden sm:inline flex items-center gap-1">
                <Palette className="w-3 h-3 text-amber-300" />
                <span>สีพื้นหลัง:</span>
              </span>
              <button
                type="button"
                onClick={() => handleSelectBgMode('royal-navy')}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                  bgMode === 'royal-navy'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title="สีกรมท่าตำรวจหลวง (Royal Police Navy)"
              >
                <span>🏛️ กรมท่า</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectBgMode('classic-light')}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                  bgMode === 'classic-light'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title="สีสว่างทางการ ขาวนวล สบายตา (Executive Classic Light)"
              >
                <span>☀️ สว่าง</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectBgMode('tactical-dark')}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                  bgMode === 'tactical-dark'
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title="สีดาร์กโหมดความมั่นคง ดำออบซิเดียน (Tactical Cyber Dark)"
              >
                <span>🌙 ดาร์ก</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
              title="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* Security Threat Alert (if Red Risk Area) */}
          {isRed && (
            <div className="bg-red-950/40 border-2 border-red-500/70 rounded-xl p-4 space-y-2 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="font-bold text-red-200 text-sm font-['Prompt']">
                  🔴 หน่วยงานในพื้นที่เสี่ยงภัยสีแดง (จุดเฝ้าระวังพิเศษ & ก่อเหตุบ่อย)
                </span>
              </div>
              {threatInfo && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="bg-black/30 p-2.5 rounded-lg border border-red-500/30">
                    <div className="font-bold text-amber-300 flex items-center gap-1 mb-0.5">
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>จุดที่ควรเฝ้าระวัง:</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{threatInfo.riskSpots}</p>
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-lg border border-red-500/30">
                    <div className="font-bold text-rose-300 flex items-center gap-1 mb-0.5">
                      <Flame className="w-3.5 h-3.5 text-rose-400" />
                      <span>จุดที่ชอบก่อเหตุ:</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{threatInfo.frequentIncidents}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Summary Metric Cards with New Rich Color Backgrounds */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              className={`p-3.5 rounded-xl border transition-all ${
                bgMode === 'classic-light'
                  ? 'bg-gradient-to-br from-sky-50 via-white to-sky-100/60 border-sky-300 shadow-xs'
                  : 'bg-gradient-to-br from-sky-950/60 via-[#0a1829] to-sky-950/30 border-sky-500/40 shadow-md'
              }`}
            >
              <div className={`text-[11px] font-medium ${bgMode === 'classic-light' ? 'text-sky-900' : 'text-sky-300'}`}>
                อัตราตำแหน่งทั้งหมด
              </div>
              <div
                className={`text-2xl font-black font-mono tracking-tight my-0.5 ${
                  bgMode === 'classic-light' ? 'text-sky-950' : 'text-sky-100'
                }`}
              >
                {unit.totalAll_pos} <span className="text-xs font-normal opacity-70">นาย</span>
              </div>
              <div className={`text-[10px] ${bgMode === 'classic-light' ? 'text-sky-700' : 'text-sky-400'}`}>
                ตำแหน่งตามกรอบอัตรา
              </div>
            </div>

            <div
              className={`p-3.5 rounded-xl border transition-all ${
                bgMode === 'classic-light'
                  ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-100/60 border-emerald-300 shadow-xs'
                  : 'bg-gradient-to-br from-emerald-950/60 via-[#092218] to-emerald-950/30 border-emerald-500/40 shadow-md'
              }`}
            >
              <div className={`text-[11px] font-medium ${bgMode === 'classic-light' ? 'text-emerald-900' : 'text-emerald-300'}`}>
                จำนวนตัวคนครองจริง
              </div>
              <div
                className={`text-2xl font-black font-mono tracking-tight my-0.5 ${
                  bgMode === 'classic-light' ? 'text-emerald-950' : 'text-emerald-100'
                }`}
              >
                {unit.totalAll_occ} <span className="text-xs font-normal opacity-70">นาย</span>
              </div>
              <div className={`text-[10px] ${bgMode === 'classic-light' ? 'text-emerald-700' : 'text-emerald-400'}`}>
                ครองคน {unit.totalAll_pos > 0 ? ((unit.totalAll_occ / unit.totalAll_pos) * 100).toFixed(1) : 0}%
              </div>
            </div>

            <div
              className={`p-3.5 rounded-xl border transition-all ${
                bgMode === 'classic-light'
                  ? 'bg-gradient-to-br from-rose-50 via-white to-rose-100/60 border-rose-300 shadow-xs'
                  : 'bg-gradient-to-br from-rose-950/60 via-[#260a12] to-rose-950/30 border-rose-500/40 shadow-md'
              }`}
            >
              <div className={`text-[11px] font-medium ${bgMode === 'classic-light' ? 'text-rose-900' : 'text-rose-300'}`}>
                ตำแหน่งว่าง / ขาดแคลน
              </div>
              <div
                className={`text-2xl font-black font-mono tracking-tight my-0.5 ${
                  bgMode === 'classic-light' ? 'text-rose-950' : 'text-rose-100'
                }`}
              >
                {Math.max(0, unit.totalAll_pos - unit.totalAll_occ)} <span className="text-xs font-normal opacity-70">นาย</span>
              </div>
              <div className={`text-[10px] ${bgMode === 'classic-light' ? 'text-rose-700' : 'text-rose-400'}`}>
                {unit.totalAll_pos - unit.totalAll_occ > 0 ? 'ยังไม่มีผู้ปฏิบัติการ' : 'อัตรากำลังพลครบ'}
              </div>
            </div>

            <div
              className={`p-3.5 rounded-xl border transition-all ${
                bgMode === 'classic-light'
                  ? 'bg-gradient-to-br from-amber-50 via-white to-amber-100/60 border-amber-300 shadow-xs'
                  : 'bg-gradient-to-br from-amber-950/60 via-[#261908] to-amber-950/30 border-amber-500/40 shadow-md'
              }`}
            >
              <div className={`text-[11px] font-medium ${bgMode === 'classic-light' ? 'text-amber-900' : 'text-amber-300'}`}>
                สัญญาบัตร : ประทวน
              </div>
              <div
                className={`text-xl font-black font-mono tracking-tight my-0.5 ${
                  bgMode === 'classic-light' ? 'text-amber-950' : 'text-amber-200'
                }`}
              >
                {unit.totalCommissioned_occ} : {unit.totalNonCommissioned_occ}
              </div>
              <div className={`text-[10px] ${bgMode === 'classic-light' ? 'text-amber-700' : 'text-amber-400'}`}>
                นายตำรวจ : ชั้นประทวน
              </div>
            </div>
          </div>

          {/* Detailed Rank Grid - The Core "ทุกระดับชั้นยศ" with Distinct Background Colors */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <h4 className="font-bold text-sm sm:text-base font-['Prompt'] flex items-center gap-2">
                <span>ตารางสถานภาพตัวคนแยกทุกระดับชั้นยศ (ตำแหน่ง vs คนครองจริง)</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-normal">
                  แถบสีแยกชัดเจนทุกชั้นยศ
                </span>
              </h4>
              <span className="text-xs font-normal text-slate-400">
                ข้อมูลสถานภาพกำลังพล ภ.9
              </span>
            </div>

            <div className={`overflow-x-auto rounded-xl border ${tableWrapperBorder}`}>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className={tableHeaderBg}>
                    <th className="py-2.5 px-3 font-bold">ระดับชั้นยศ / ตำแหน่ง</th>
                    <th className="py-2.5 px-3 text-center font-bold">อัตราตำแหน่ง</th>
                    <th className="py-2.5 px-3 text-center font-bold">คนครอง (ตัวคนจริง)</th>
                    <th className="py-2.5 px-3 text-center font-bold">ขาดแคลน / ว่าง</th>
                    <th className="py-2.5 px-3 text-center font-bold">อัตราครองคน (%)</th>
                  </tr>
                </thead>
                <tbody className={bgMode === 'classic-light' ? 'divide-y divide-slate-200/80' : 'divide-y divide-white/10'}>
                  {rankRows.map((r, i) => {
                    const diff = r.pos - r.occ;
                    const pct = r.pos > 0 ? (r.occ / r.pos) * 100 : 0;
                    const rowBgClass =
                      bgMode === 'classic-light'
                        ? r.lightBg
                        : bgMode === 'tactical-dark'
                        ? r.darkBg
                        : r.navyBg;

                    return (
                      <tr
                        key={i}
                        className={`${rowBgClass} transition-colors duration-150 ${
                          r.isSubtotal ? 'font-bold' : ''
                        } ${r.isTotal ? 'font-black' : ''}`}
                      >
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {r.isTotal ? '⭐' : r.isSubtotal ? '📊' : '•'}
                            </span>
                            <div>
                              <div className="font-bold font-['Prompt'] flex items-center gap-1.5">
                                <span>{r.title}</span>
                                {r.group && !r.isSubtotal && !r.isTotal && (
                                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${r.tagBg}`}>
                                    {r.group}
                                  </span>
                                )}
                              </div>
                              {r.subtitle && (
                                <div
                                  className={`text-[11px] ${
                                    bgMode === 'classic-light' ? 'text-slate-600' : 'text-slate-400'
                                  }`}
                                >
                                  {r.subtitle}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-sm">
                          {r.pos}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-extrabold text-sm">
                          {r.occ}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono">
                          {r.pos === 0 && r.occ === 0 ? (
                            <span className="text-slate-400 font-medium bg-slate-500/10 px-2 py-0.5 rounded border border-slate-500/20">
                              ว่าง
                            </span>
                          ) : diff > 0 ? (
                            <span className="text-rose-500 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                              -{diff}
                            </span>
                          ) : diff < 0 ? (
                            <span className="text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                              +{Math.abs(diff)}
                            </span>
                          ) : (
                            <span className="text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              ครบ
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono">
                          {r.pos > 0 ? (
                            <span
                              className={`px-2.5 py-0.5 rounded text-[11px] font-bold shadow-xs ${
                                pct >= 90
                                  ? 'bg-emerald-600 text-white'
                                  : pct >= 70
                                  ? 'bg-amber-500 text-slate-950'
                                  : 'bg-rose-600 text-white'
                              }`}
                            >
                              {pct.toFixed(0)}%
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
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
          <div className={`${subBoxBg} p-4 sm:p-5 rounded-xl border space-y-4`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm sm:text-base font-['Prompt'] flex items-center gap-2">
                  <span>รายชื่อตัวคนครองตำแหน่ง (Personnel Roster)</span>
                  <span className="text-xs font-normal text-amber-400 font-mono">
                    บันทึกแล้ว {currentRoster.length} นาย
                  </span>
                </h4>
                <p className={`text-xs ${bgMode === 'classic-light' ? 'text-slate-600' : 'text-slate-400'}`}>
                  ระบบบันทึกรายชื่อและสถานะการปฏิบัติหน้าที่จริงของผู้ครองตำแหน่งในหน่วยงาน
                </p>
              </div>
            </div>

            {/* Add person form */}
            <form
              onSubmit={handleAddPerson}
              className={`grid grid-cols-1 sm:grid-cols-5 gap-2.5 p-3 rounded-xl border ${
                bgMode === 'classic-light'
                  ? 'bg-white border-slate-300 shadow-xs'
                  : 'bg-black/40 border-white/15 shadow-inner'
              }`}
            >
              <div>
                <label className="block text-[11px] font-medium mb-1 opacity-80">ระดับชั้นยศ</label>
                <select
                  value={newRank}
                  onChange={(e) => setNewRank(e.target.value)}
                  className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
                    bgMode === 'classic-light'
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-900 border-slate-700 text-white'
                  }`}
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
                <label className="block text-[11px] font-medium mb-1 opacity-80">ยศ ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  placeholder="เช่น พ.ต.อ.สมชาย ใจดี"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={`w-full px-2.5 py-1.5 rounded-lg border text-xs ${
                    bgMode === 'classic-light'
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium mb-1 opacity-80">สถานะ</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
                    bgMode === 'classic-light'
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                >
                  <option value="ครองตำแหน่ง">ครองตำแหน่ง</option>
                  <option value="รักษาราชการแทน">รักษาราชการแทน</option>
                  <option value="ช่วยราชการ">ช่วยราชการ</option>
                  <option value="ว่าง">ว่าง</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs transition shadow-sm active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>เพิ่มตัวคน</span>
                </button>
              </div>
            </form>

            {/* List of registered persons */}
            {currentRoster.length > 0 ? (
              <div
                className={`divide-y rounded-xl border overflow-hidden ${
                  bgMode === 'classic-light'
                    ? 'bg-white border-slate-300 divide-slate-200'
                    : 'bg-black/30 border-white/10 divide-white/10'
                }`}
              >
                {currentRoster.map((person) => (
                  <div
                    key={person.id}
                    className={`p-2.5 sm:px-3 flex items-center justify-between transition-colors ${
                      bgMode === 'classic-light' ? 'hover:bg-slate-50' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-amber-400 font-mono min-w-[70px] bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 text-center">
                        {person.rankTitle}
                      </span>
                      <span className="font-medium text-xs sm:text-sm">{person.fullName}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          person.status === 'ครองตำแหน่ง'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : person.status === 'รักษาราชการแทน'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {person.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeletePerson(person.id)}
                      className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition"
                      title="ลบรายชื่อ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`text-center py-5 text-xs rounded-xl border border-dashed ${
                  bgMode === 'classic-light'
                    ? 'bg-white border-slate-300 text-slate-500'
                    : 'bg-black/20 border-white/15 text-slate-400'
                }`}
              >
                ยังไม่มีการบันทึกรายชื่อตัวคนในหน่วยงานนี้ (สามารถเลือกชั้นยศและกรอกชื่อเพื่อเพิ่มข้อมูลได้)
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`${footerBg} px-6 py-3.5 flex items-center justify-between gap-3 sticky bottom-0 z-20`}>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>พิมพ์รายงานตัวคน</span>
          </button>

          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2 rounded-xl text-xs transition shadow-md active:scale-95 font-['Prompt']"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
