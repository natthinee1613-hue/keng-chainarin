import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, MapPin, Eye, Flame, Users, ChevronRight, Search, Filter } from 'lucide-react';
import { THREAT_ZONES_DATA } from '../data/threatZonesData';
import { PoliceUnitRecord, SecurityThreatZoneInfo } from '../types';

interface ThreatZonesViewProps {
  records: PoliceUnitRecord[];
  onSelectUnitRoster: (unit: PoliceUnitRecord) => void;
  onNavigateToTable: (unitName: string) => void;
}

export const ThreatZonesView: React.FC<ThreatZonesViewProps> = ({
  records,
  onSelectUnitRoster,
  onNavigateToTable,
}) => {
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredZones = THREAT_ZONES_DATA.filter((zone) => {
    if (selectedProvince !== 'all' && zone.province !== selectedProvince) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      return (
        zone.stationName.toLowerCase().includes(q) ||
        zone.district.toLowerCase().includes(q) ||
        zone.province.toLowerCase().includes(q) ||
        zone.riskSpots.toLowerCase().includes(q) ||
        zone.frequentIncidents.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate live stats for the red threat stations from records
  const redStationRecords = records.filter((r) =>
    THREAT_ZONES_DATA.some((z) => r.name.includes(z.stationName) || z.stationName.includes(r.name))
  );

  const totalRedPos = redStationRecords.reduce((s, r) => s + r.totalAll_pos, 0);
  const totalRedOcc = redStationRecords.reduce((s, r) => s + r.totalAll_occ, 0);
  const totalRedShortage = Math.max(0, totalRedPos - totalRedOcc);
  const redFillRate = totalRedPos > 0 ? (totalRedOcc / totalRedPos) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-rose-950 p-6 rounded-2xl border border-red-800/80 shadow-xl text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping inline-block"></span>
              <span className="bg-red-500/20 text-red-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-red-500/30 uppercase tracking-wider">
                พื้นที่เสี่ยงภัยสีแดง (จุดเฝ้าระวังพิเศษ & ก่อเหตุบ่อย)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Prompt'] text-white">
              แผนผังและข้อมูลจุดพื้นที่เสี่ยงภัยสีแดง ใน 4 จังหวัด (ภ.9)
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              ระบุจุดที่ควรเฝ้าระวัง พฤติกรรมการก่อเหตุของกลุ่มผู้ไม่หวังดี และสถานภาพตัวคนข้าราชการตำรวจประจำแต่ละสถานี
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-red-500/30 text-right">
              <div className="text-[10px] text-red-200">จุดเสี่ยงภัยสีแดงทั้งหมด</div>
              <div className="text-xl font-bold font-mono text-red-300">
                {THREAT_ZONES_DATA.length} <span className="text-xs font-normal text-slate-300">สถานีตำรวจ</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-red-500/30 text-right">
              <div className="text-[10px] text-red-200">กำลังพลในพื้นที่สีแดง</div>
              <div className="text-xl font-bold font-mono text-white">
                {totalRedOcc.toLocaleString()} <span className="text-xs font-normal text-slate-300">/ {totalRedPos.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-red-500/30 text-right">
              <div className="text-[10px] text-rose-300">ขาดแคลนกำลังพล</div>
              <div className="text-xl font-bold font-mono text-rose-400">
                -{totalRedShortage.toLocaleString()} <span className="text-xs font-normal text-slate-300">นาย</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Provinces Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* สงขลา */}
        <div
          onClick={() => setSelectedProvince(selectedProvince === 'จ.สงขลา' ? 'all' : 'จ.สงขลา')}
          className={`p-4 rounded-xl border cursor-pointer transition shadow-sm ${
            selectedProvince === 'จ.สงขลา'
              ? 'bg-red-900/40 border-red-500 ring-2 ring-red-500/30 text-white'
              : 'bg-white hover:bg-red-50/50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
              จ.สงขลา (4 อำเภอ)
            </span>
            <span className="text-xs font-bold font-mono text-red-600">8 สภ. สีแดง</span>
          </div>
          <div className="font-bold text-sm font-['Prompt']">จะนะ • เทพา • สะบ้าย้อย • นาทวี</div>
          <div className="text-[11px] text-slate-500 mt-1">
            ด่านเกาะหม้อแกง, ด่านบ้านประกอบ, ทางหลวง 43, แนวป่าเขาสันกาลาคีรี
          </div>
        </div>

        {/* ยะลา */}
        <div
          onClick={() => setSelectedProvince(selectedProvince === 'จ.ยะลา' ? 'all' : 'จ.ยะลา')}
          className={`p-4 rounded-xl border cursor-pointer transition shadow-sm ${
            selectedProvince === 'จ.ยะลา'
              ? 'bg-red-900/40 border-red-500 ring-2 ring-red-500/30 text-white'
              : 'bg-white hover:bg-red-50/50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
              จ.ยะลา (6 อำเภอ)
            </span>
            <span className="text-xs font-bold font-mono text-red-600">9 สภ. สีแดง</span>
          </div>
          <div className="font-bold text-sm font-['Prompt']">บันนังสตา • ยะหา • รามัน • กรงปินัง ฯลฯ</div>
          <div className="text-[11px] text-slate-500 mt-1">
            ถนนสาย 410, หุบเขาบ้านปะแต, เขื่อนบางลาง, ทางรถไฟรามัน, ตลาดเก่ายะลา
          </div>
        </div>

        {/* ปัตตานี */}
        <div
          onClick={() => setSelectedProvince(selectedProvince === 'จ.ปัตตานี' ? 'all' : 'จ.ปัตตานี')}
          className={`p-4 rounded-xl border cursor-pointer transition shadow-sm ${
            selectedProvince === 'จ.ปัตตานี'
              ? 'bg-red-900/40 border-red-500 ring-2 ring-red-500/30 text-white'
              : 'bg-white hover:bg-red-50/50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
              จ.ปัตตานี (7 อำเภอ)
            </span>
            <span className="text-xs font-bold font-mono text-red-600">8 สภ. สีแดง</span>
          </div>
          <div className="font-bold text-sm font-['Prompt']">หนองจิก • สายบุรี • ยะรัง • โคกโพธิ์ ฯลฯ</div>
          <div className="text-[11px] text-slate-500 mt-1">
            สี่แยกดอนยาง, ถนนสาย 42, สามแยกบ้านโสร่ง, สถานีรถไฟนาประดู่, ทุ่งยางแดง
          </div>
        </div>

        {/* นราธิวาส */}
        <div
          onClick={() => setSelectedProvince(selectedProvince === 'จ.นราธิวาส' ? 'all' : 'จ.นราธิวาส')}
          className={`p-4 rounded-xl border cursor-pointer transition shadow-sm ${
            selectedProvince === 'จ.นราธิวาส'
              ? 'bg-red-900/40 border-red-500 ring-2 ring-red-500/30 text-white'
              : 'bg-white hover:bg-red-50/50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
              จ.นราธิวาส (8 อำเภอ)
            </span>
            <span className="text-xs font-bold font-mono text-red-600">9 สภ. สีแดง</span>
          </div>
          <div className="font-bold text-sm font-['Prompt']">ระแงะ • รือเสาะ • บาเจาะ • เจาะไอร้อง ฯลฯ</div>
          <div className="text-[11px] text-slate-500 mt-1">
            เทือกเขาบูโด, ทางรถไฟตันหยงมัส, ป่าพรุโต๊ะแดง, ด่านชายแดนสุไหงโก-ลก
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาจุดเสี่ยง (เช่น สาย 410, รถไฟ, ดอนยาง, บันนังสตา, ระเบิด, คาร์บอมบ์)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium"
            >
              <option value="all">ทุกจังหวัด (แสดงทั้ง 34 จุดเสี่ยงภัยสีแดง)</option>
              <option value="จ.สงขลา">จ.สงขลา (4 อำเภอเสี่ยงภัย 8 สภ.)</option>
              <option value="จ.ยะลา">จ.ยะลา (6 อำเภอ 9 สภ.)</option>
              <option value="จ.ปัตตานี">จ.ปัตตานี (7 อำเภอ 8 สภ.)</option>
              <option value="จ.นราธิวาส">จ.นราธิวาส (8 อำเภอ 9 สภ.)</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          แสดง <strong className="text-red-700">{filteredZones.length}</strong> จาก {THREAT_ZONES_DATA.length} จุดเสี่ยงภัยสีแดง
        </div>
      </div>

      {/* Grid of Red Threat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredZones.map((zone, idx) => {
          // Find matching actual unit from records
          const matchingUnit = records.find(
            (r) => r.name.includes(zone.stationName) || zone.stationName.includes(r.name)
          );

          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border-2 border-red-200 hover:border-red-500 transition-all p-5 shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Card Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-600 inline-block shadow-sm ring-4 ring-red-100"></span>
                    <h3 className="font-bold text-base sm:text-lg font-['Prompt'] text-slate-900 group-hover:text-red-700 transition">
                      {zone.stationName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full border border-red-200">
                      {zone.district} • {zone.province}
                    </span>
                  </div>
                </div>

                {/* Surveillance Spots (ตรงที่ควรเฝ้าระวัง) */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Eye className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                    <span>ตรงที่ควรเฝ้าระวังเป็นพิเศษ:</span>
                  </div>
                  <p className="text-amber-950 font-medium leading-relaxed pl-5">
                    {zone.riskSpots}
                  </p>
                </div>

                {/* Modus Operandi (ตรงที่ชอบก่อเหตุ) */}
                <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-900">
                    <Flame className="w-3.5 h-3.5 text-rose-700 flex-shrink-0" />
                    <span>ลักษณะ/พฤติการณ์ที่ชอบก่อเหตุบ่อย:</span>
                  </div>
                  <p className="text-rose-950 leading-relaxed pl-5">
                    {zone.frequentIncidents}
                  </p>
                </div>

                {/* Live Manning Numbers */}
                {matchingUnit ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600">สถานภาพกำลังพล:</span>
                    </div>
                    <div className="font-mono text-slate-800">
                      อัตราตำแหน่ง <strong>{matchingUnit.totalAll_pos}</strong> / ครองคนจริง{' '}
                      <strong className="text-emerald-700">{matchingUnit.totalAll_occ}</strong> นาย{' '}
                      <span className="text-rose-600 font-bold">
                        (ขาด -{matchingUnit.totalAll_pos - matchingUnit.totalAll_occ} นาย)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 font-mono">{zone.manpowerStatus}</div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigateToTable(zone.stationName)}
                  className="text-xs text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1 hover:underline"
                >
                  <span>ดูในตารางสถานภาพใหญ่</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {matchingUnit && (
                  <button
                    onClick={() => onSelectUnitRoster(matchingUnit)}
                    className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-800 text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5 text-red-600" />
                    <span>ดูตัวคนทุกชั้นยศ</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
