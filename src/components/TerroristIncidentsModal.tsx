import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Flame,
  AlertTriangle,
  MapPin,
  Calendar,
  Clock,
  Crosshair,
  ExternalLink,
  ChevronRight,
  Filter,
  Users,
  Search,
} from 'lucide-react';
import {
  TerroristIncident,
  IncidentCategory,
  getIncidentsByProvince,
  TERRORIST_INCIDENTS,
} from '../data/terroristIncidentsData';
import { IncidentVisualScene } from './IncidentVisualScene';
import { ProvinceMiniMap } from './ProvinceMiniMap';
import { PoliceUnitRecord } from '../types';

interface TerroristIncidentsModalProps {
  isOpen: boolean;
  provinceKey: string;
  onClose: () => void;
  onViewUnitRoster?: (unitName: string) => void;
  records?: PoliceUnitRecord[];
}

export const TerroristIncidentsModal: React.FC<TerroristIncidentsModalProps> = ({
  isOpen,
  provinceKey,
  onClose,
  onViewUnitRoster,
  records = [],
}) => {
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategory | 'all'>('all');
  const [activeIncidentId, setActiveIncidentId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  const provinceIncidents = getIncidentsByProvince(provinceKey);
  const filteredIncidents = provinceIncidents.filter((inc) => {
    const matchesCat = selectedCategory === 'all' || inc.category === selectedCategory;
    const matchesSearch =
      !searchFilter ||
      inc.incidentName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      inc.district.toLowerCase().includes(searchFilter.toLowerCase()) ||
      inc.stationName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      inc.locationDescription.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeIncident =
    filteredIncidents.find((i) => i.id === activeIncidentId) || filteredIncidents[0] || provinceIncidents[0];

  const provinceTitles: Record<string, { title: string; sub: string; badge: string }> = {
    yala: {
      title: 'แฟ้มเหตุการณ์ก่อการร้าย & ความไม่สงบ จว.ยะลา',
      sub: 'บันทึกคดีความมั่นคง • เส้นทางเสี่ยง ทล.410 • บันนังสตา-ธารโต-เบตง',
      badge: 'ภ.จว.ยะลา • พื้นที่สีแดง',
    },
    pattani: {
      title: 'แฟ้มเหตุการณ์ก่อการร้าย & ความไม่สงบ จว.ปัตตานี',
      sub: 'บันทึกคดีความมั่นคง • ชายฝั่งอ่าวไทย • หนองจิก-ยะหริ่ง-สายบุรี',
      badge: 'ภ.จว.ปัตตานี • พื้นที่สีแดง',
    },
    narathiwat: {
      title: 'แฟ้มเหตุการณ์ก่อการร้าย & ความไม่สงบ จว.นราธิวาส',
      sub: 'บันทึกคดีความมั่นคง • เทือกเขาบูโด • เมืองนราธิวาส-เจาะไอร้อง-โก-ลก',
      badge: 'ภ.จว.นราธิวาส • พื้นที่สีแดงวิกฤต',
    },
    songkhla_risk: {
      title: 'แฟ้มเหตุการณ์ก่อการร้าย 4 อำเภอเสี่ยงภัย จว.สงขลา',
      sub: 'บันทึกคดีความมั่นคง • จะนะ • เทพา • นาทวี • สะบ้าย้อย',
      badge: '4 อ.ความมั่นคง จว.สงขลา',
    },
    songkhla: {
      title: 'แฟ้มเหตุการณ์ก่อการร้าย & ความมั่นคง จว.สงขลา (ทั้งหมด)',
      sub: 'บันทึกคดีความมั่นคง 16 อำเภอ และ 4 อำเภอรอยต่อ 3 จว.ใต้',
      badge: 'ภ.จว.สงขลา',
    },
    central: {
      title: 'แฟ้มเหตุการณ์ก่อการร้าย & ปฏิบัติการพิเศษ ภ.9 ส่วนกลาง',
      sub: 'ศูนย์ปฏิบัติการร่วม CCOC และ บก.สส.ภ.9 ทั่วทั้งภาคใต้',
      badge: 'บช.ภ.9 ส่วนกลาง',
    },
    all: {
      title: 'แฟ้มเหตุการณ์ก่อการร้าย & คดีความมั่นคง รวมทุกพื้นที่ ภ.9',
      sub: 'ภาพรวม 3 จังหวัดชายแดนภาคใต้ และ 4 อำเภอเสี่ยงภัยสงขลา',
      badge: 'ตำรวจภูธรภาค 9',
    },
  };

  const currentMeta = provinceTitles[provinceKey] || provinceTitles['all'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-red-600/80 rounded-2xl shadow-2xl max-w-5xl w-full flex flex-col max-h-[94vh] overflow-hidden text-white font-['Sarabun']">
        {/* Modal Top Command Header */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 border-b border-red-600/40 p-4 sm:p-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {/* Realistic Mini Map with Pulse Radar */}
            <div className="relative p-1 bg-black/60 rounded-xl border border-red-500/40 shadow-inner flex-shrink-0">
              <ProvinceMiniMap provinceKey={provinceKey} size="sm" active={true} />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-red-600/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{currentMeta.badge}</span>
                </span>
                <span className="text-[11px] font-mono text-red-300">
                  พบข้อมูลบันทึก {provinceIncidents.length} เหตุการณ์สำคัญ
                </span>
              </div>

              <h2 className="text-lg sm:text-2xl font-bold font-['Prompt'] text-white mt-1 leading-tight">
                {currentMeta.title}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">{currentMeta.sub}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-xl transition active:scale-95 flex-shrink-0"
            title="ปิดหน้าต่าง (Close)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-red-400" />
              <span>ประเภทเหตุการณ์:</span>
            </span>

            {[
              { id: 'all', label: 'ทั้งหมด' },
              { id: 'bomb_ied', label: '💥 ระเบิด IED' },
              { id: 'car_bomb', label: '🚗 คาร์บอมบ์' },
              { id: 'raid_post', label: '💣 โจมตีฐาน/ป้อม' },
              { id: 'ambush', label: '🎯 ซุ่มโจมตี' },
              { id: 'arson_harass', label: '🔥 วางเพลิง/ก่อกวน' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-red-600 text-white font-bold shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Search in incidents */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อเหตุการณ์, อ. , สภ...."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-slate-800 text-xs text-white rounded-lg border border-slate-700 focus:outline-none focus:border-red-500 placeholder-slate-500"
            />
          </div>
        </div>

        {/* Main Body: Two Columns (Left: Interactive Incident Pin Map & List | Right: Active Incident Detailed Evidence) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Left Column (5 Cols): Incident Selection List with Map Pin Locator */}
          <div className="lg:col-span-5 p-4 space-y-3 bg-slate-900/60 overflow-y-auto max-h-[70vh]">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">
                รายการเหตุการณ์ความไม่สงบ ({filteredIncidents.length})
              </span>
              <span className="text-[11px] text-red-400 font-mono">คลิกเพื่อดูภาพและสำนวนคดี</span>
            </div>

            {filteredIncidents.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                ไม่พบเหตุการณ์ที่ตรงกับเงื่อนไขการค้นหา
              </div>
            ) : (
              filteredIncidents.map((incident) => {
                const isSelected = activeIncident?.id === incident.id;
                return (
                  <div
                    key={incident.id}
                    onClick={() => setActiveIncidentId(incident.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? 'bg-slate-800/90 border-red-500 shadow-md ring-1 ring-red-500/50'
                        : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            incident.threatLevel === 'extreme' ? 'bg-red-500 animate-ping' : 'bg-amber-400'
                          }`}
                        />
                        <span className="text-[11px] font-bold text-red-400 font-mono">
                          {incident.categoryLabel}
                        </span>
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{incident.dateText}</span>
                      </span>
                    </div>

                    <h4 className="font-bold text-sm font-['Prompt'] text-white mt-1 line-clamp-2 leading-snug">
                      {incident.incidentName}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-300 mt-2 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-slate-400 truncate">
                        <MapPin className="w-3 h-3 text-red-400 flex-shrink-0" />
                        <span className="truncate">{incident.district} • {incident.stationName}</span>
                      </div>

                      <span className="text-sky-400 text-[10px] font-mono flex items-center gap-0.5 flex-shrink-0">
                        <span>ดูภาพ</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column (7 Cols): Active Incident Tactical Dossier + Authentic Visual Scene */}
          <div className="lg:col-span-7 p-4 sm:p-6 space-y-4 bg-slate-900 overflow-y-auto max-h-[70vh]">
            {activeIncident ? (
              <div className="space-y-4">
                {/* 1. Realistic Scene Artwork with Forensic HUD */}
                <IncidentVisualScene incident={activeIncident} />

                {/* 2. Incident Title and Coordinates */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
                      {activeIncident.categoryLabel}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{activeIncident.dateText} • เวลา {activeIncident.timeText}</span>
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-['Prompt'] text-white leading-tight">
                    {activeIncident.incidentName}
                  </h3>

                  <div className="text-xs text-slate-300 flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                    <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>{activeIncident.locationDescription}</span>
                  </div>
                </div>

                {/* 3. Tactical Dossier Sections */}
                <div className="space-y-3 text-xs leading-relaxed">
                  {/* Modus Operandi (พฤติการณ์คนร้าย) */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                    <div className="font-bold text-red-400 font-['Prompt'] flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-red-500" />
                      <span>พฤติการณ์คนร้ายและการปฏิบัติการ</span>
                    </div>
                    <p className="text-slate-300 pl-5">{activeIncident.modusOperandi}</p>
                  </div>

                  {/* Weapon and Explosive Specs */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                    <div className="font-bold text-amber-400 font-['Prompt'] flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span>ชนิดวัตถุระเบิด & อาวุธสงครามที่ตรวจพบ</span>
                    </div>
                    <p className="text-slate-300 pl-5">{activeIncident.weaponType}</p>
                  </div>

                  {/* Casualties and Damage */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-3 space-y-1">
                      <div className="font-bold text-rose-300 font-['Prompt']">
                        ความสูญเสียต่อกำลังพล / ประชาชน
                      </div>
                      <p className="text-slate-300">{activeIncident.casualtySummary}</p>
                    </div>

                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-1">
                      <div className="font-bold text-slate-300 font-['Prompt']">
                        ความเสียหายต่อทรัพย์สินราชการ
                      </div>
                      <p className="text-slate-300">{activeIncident.damageSummary}</p>
                    </div>
                  </div>

                  {/* Police Counter-Measure and Investigation */}
                  <div className="bg-sky-950/30 border border-sky-800/40 rounded-xl p-3.5 space-y-1.5">
                    <div className="font-bold text-sky-300 font-['Prompt'] flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-sky-400" />
                      <span>มาตรการตอบโต้และการสืบสวนคดีความมั่นคง ภ.9</span>
                    </div>
                    <p className="text-slate-300 pl-5">{activeIncident.policeResponse}</p>
                  </div>
                </div>

                {/* 4. Action Button: View Manpower Roster for the Station */}
                {onViewUnitRoster && (
                  <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800">
                    <div className="text-xs text-slate-400">
                      หน่วยรับผิดชอบพื้นที่: <strong className="text-white">{activeIncident.stationName}</strong>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onViewUnitRoster(activeIncident.stationName);
                      }}
                      className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-95"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>ดูอัตรากำลังพล {activeIncident.stationName}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                เลือกเหตุการณ์จากรายการด้านซ้ายเพื่อดูภาพและข้อมูลคดี
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 p-3 sm:px-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>ฐานข้อมูลคดีความมั่นคง กองบัญชาการตำรวจภูธรภาค 9</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
