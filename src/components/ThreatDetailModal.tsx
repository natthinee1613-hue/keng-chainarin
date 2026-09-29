import React from 'react';
import { X, ShieldAlert, Eye, Flame, Users, AlertTriangle, MapPin, ChevronRight, UserCheck } from 'lucide-react';
import { SecurityThreatZoneInfo } from '../types';
import { PoliceUnitRecord } from '../types';

interface ThreatDetailModalProps {
  isOpen: boolean;
  threatInfo: SecurityThreatZoneInfo | null;
  unitRecord?: PoliceUnitRecord | null;
  onClose: () => void;
  onViewRoster?: (unit: PoliceUnitRecord) => void;
}

export const ThreatDetailModal: React.FC<ThreatDetailModalProps> = ({
  isOpen,
  threatInfo,
  unitRecord,
  onClose,
  onViewRoster,
}) => {
  if (!isOpen || !threatInfo) return null;

  const shortage = unitRecord ? Math.max(0, unitRecord.totalAll_pos - unitRecord.totalAll_occ) : 0;
  const fillRate = unitRecord && unitRecord.totalAll_pos > 0
    ? (unitRecord.totalAll_occ / unitRecord.totalAll_pos) * 100
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-red-500 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 via-red-800 to-rose-900 text-white p-5 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
              <span className="bg-white/20 text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-white/30">
                จุดพื้นที่เสี่ยงภัยสีแดง (เฝ้าระวังพิเศษ)
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-['Prompt'] flex items-center gap-2 text-white pt-1">
              <ShieldAlert className="w-6 h-6 text-red-200 flex-shrink-0" />
              <span>{threatInfo.stationName}</span>
            </h3>
            <div className="text-xs text-red-100 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>{threatInfo.district} • {threatInfo.province} • กองบัญชาการตำรวจภูธรภาค 9</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-800 text-sm">
          {/* Section 1: จุดที่ควรเฝ้าระวัง */}
          <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-950 text-sm font-['Prompt']">
              <Eye className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>ตรงที่ควรเฝ้าระวังเป็นพิเศษ (Surveillance Risk Spots)</span>
            </div>
            <p className="text-amber-900 leading-relaxed pl-6 text-xs sm:text-sm font-medium">
              {threatInfo.riskSpots}
            </p>
          </div>

          {/* Section 2: ตรงที่ชอบก่อเหตุ */}
          <div className="bg-rose-50/90 border border-rose-300 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-950 text-sm font-['Prompt']">
              <Flame className="w-4 h-4 text-rose-700 flex-shrink-0" />
              <span>ลักษณะ / รูปแบบที่คนร้ายชอบก่อเหตุ (Threat Incidents & Modus Operandi)</span>
            </div>
            <p className="text-rose-900 leading-relaxed pl-6 text-xs sm:text-sm">
              {threatInfo.frequentIncidents}
            </p>
          </div>

          {/* Section 3: สถานภาพกำลังพลของสถานีนี้ */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-['Prompt']">
                <Users className="w-4 h-4 text-slate-700" />
                <span>สถานภาพอัตรากำลังพลจริงในสังกัด</span>
              </div>
              {unitRecord && onViewRoster && (
                <button
                  onClick={() => {
                    onClose();
                    onViewRoster(unitRecord);
                  }}
                  className="text-xs bg-sky-600 hover:bg-sky-500 text-white font-semibold px-3 py-1.5 rounded-lg shadow-xs transition flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>ดูตัวคนทุกระดับชั้นยศ</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {unitRecord ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">อัตราตำแหน่ง</div>
                  <div className="text-base font-bold font-mono text-slate-900">
                    {unitRecord.totalAll_pos} <span className="text-[10px] font-normal text-slate-400">นาย</span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">คนครองจริง</div>
                  <div className="text-base font-bold font-mono text-emerald-700">
                    {unitRecord.totalAll_occ} <span className="text-[10px] font-normal text-slate-400">นาย</span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">ขาดแคลน</div>
                  <div className="text-base font-bold font-mono text-rose-600">
                    -{shortage} <span className="text-[10px] font-normal text-slate-400">นาย</span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">อัตราครองคน</div>
                  <div className="text-base font-bold font-mono text-amber-700">
                    {fillRate.toFixed(0)}%
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-600 font-mono">
                {threatInfo.manpowerStatus}
              </div>
            )}
          </div>

          {/* Section 4: ข้อแนะนำแนวทางปฏิบัติการทางยุทธวิธี */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-blue-900">
              <AlertTriangle className="w-3.5 h-3.5 text-blue-700" />
              <span>มาตรการ รปภ. และข้อพึงระวังประจำพื้นที่เสี่ยงภัยสีแดง:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1 leading-relaxed">
              <li>ห้ามใช้เส้นทางและเวลาเดิมซ้ำซากในการออกปฏิบัติหน้าที่หรือลาดตระเวน</li>
              <li>ตรวจค้นยานพาหนะต้องสงสัยและตรวจสอบทะเบียนผ่านระบบ CCOC อย่างเคร่งครัด</li>
              <li>เตรียมพร้อมชุด EOD และชุดสุนัขตรวจระเบิด K-9 ในการเคลียร์เส้นทางล่วงหน้า</li>
              <li>ประสานการปฏิบัติร่วมกับกองกำลังทหารพรานและชุดคุ้มครองตำบล (ชคต.) ตลอด 24 ชั่วโมง</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            ฐานข้อมูลความมั่นคง ภ.9 • จุดเฝ้าระวังพื้นที่สีแดง
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
