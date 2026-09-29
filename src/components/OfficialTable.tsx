import React, { useState, useMemo } from 'react';
import { Search, Edit2, Trash2, Copy, Filter, AlertCircle, Users, UserCheck, Download, Printer, ShieldAlert } from 'lucide-react';
import { PoliceUnitRecord, UNIT_GROUPS, ZoneId, OFFICIAL_ZONES } from '../types';
import { computeGroupSummary } from '../data/initialData';
import { filterRecordsByZone, getZoneSummary } from '../utils/zoneHelper';
import { exportToExcel } from '../utils/exportImport';
import { isRedThreatZone, getThreatInfo } from '../data/threatZonesData';
import { ThreatDetailModal } from './ThreatDetailModal';
import { SecurityThreatZoneInfo } from '../types';
import { AppThemeConfig } from '../types/theme';
import { ProvinceMiniMap } from './ProvinceMiniMap';
import { ProvinceSelectorBar } from './ProvinceSelectorBar';
import { TerroristIncidentsModal } from './TerroristIncidentsModal';

interface OfficialTableProps {
  records: PoliceUnitRecord[];
  selectedZone: ZoneId;
  onSelectZone: (zone: ZoneId) => void;
  externalSearchQuery?: string;
  onEdit: (record: PoliceUnitRecord) => void;
  onDelete: (id: string, name: string) => void;
  onDuplicate: (record: PoliceUnitRecord) => void;
  onViewRoster: (record: PoliceUnitRecord) => void;
  theme?: AppThemeConfig;
}

export const OfficialTable: React.FC<OfficialTableProps> = ({
  records,
  selectedZone,
  onSelectZone,
  externalSearchQuery = '',
  onEdit,
  onDelete,
  onDuplicate,
  onViewRoster,
  theme,
}) => {
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const [selectedSubGroup, setSelectedSubGroup] = useState<string>('all');
  const [showDifference, setShowDifference] = useState(true);
  const [onlyRedThreatZone, setOnlyRedThreatZone] = useState(false);
  const [activeThreatDetail, setActiveThreatDetail] = useState<{
    info: SecurityThreatZoneInfo;
    record?: PoliceUnitRecord;
  } | null>(null);
  const [activeTerroristIncidentsProvince, setActiveTerroristIncidentsProvince] = useState<string | null>(null);

  // Sync external search query if changed
  React.useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  // 1. Filter by Primary Zone
  const zoneRecords = useMemo(() => {
    return filterRecordsByZone(records, selectedZone);
  }, [records, selectedZone]);

  // 2. Filter by search query, sub-group, and red threat zones
  const filteredRecords = useMemo(() => {
    return zoneRecords.filter((r) => {
      if (onlyRedThreatZone && !isRedThreatZone(r.name) && !r.isRiskAreaSongkhla) {
        return false;
      }
      if (searchQuery.trim() !== '' && !r.name.toLowerCase().includes(searchQuery.toLowerCase().trim())) {
        return false;
      }
      if (selectedSubGroup !== 'all' && r.group !== selectedSubGroup) {
        return false;
      }
      return true;
    });
  }, [zoneRecords, searchQuery, selectedSubGroup, onlyRedThreatZone]);

  // Group records by their group
  const groupedRecords = useMemo(() => {
    const groups: { [key: string]: PoliceUnitRecord[] } = {};
    filteredRecords.forEach((r) => {
      if (!groups[r.group]) {
        groups[r.group] = [];
      }
      groups[r.group].push(r);
    });
    return groups;
  }, [filteredRecords]);

  // Zone summary
  const zoneSummary = useMemo(() => {
    return getZoneSummary(records, selectedZone);
  }, [records, selectedZone]);

  // Grand total calculation for current view
  const grandTotal = useMemo(() => {
    return filteredRecords.reduce(
      (acc, r) => {
        acc.commander_pos += Number(r.commander_pos || 0);
        acc.commander_occ += Number(r.commander_occ || 0);
        acc.deputyCommander_pos += Number(r.deputyCommander_pos || 0);
        acc.deputyCommander_occ += Number(r.deputyCommander_occ || 0);
        acc.superintendent_pos += Number(r.superintendent_pos || 0);
        acc.superintendent_occ += Number(r.superintendent_occ || 0);
        acc.deputySuperintendent_pos += Number(r.deputySuperintendent_pos || 0);
        acc.deputySuperintendent_occ += Number(r.deputySuperintendent_occ || 0);
        acc.inspector_pos += Number(r.inspector_pos || 0);
        acc.inspector_occ += Number(r.inspector_occ || 0);
        acc.deputyInspector_pos += Number(r.deputyInspector_pos || 0);
        acc.deputyInspector_occ += Number(r.deputyInspector_occ || 0);
        acc.totalCommissioned_pos += Number(r.totalCommissioned_pos || 0);
        acc.totalCommissioned_occ += Number(r.totalCommissioned_occ || 0);
        acc.seniorSergeantMajor_pos += Number(r.seniorSergeantMajor_pos || 0);
        acc.seniorSergeantMajor_occ += Number(r.seniorSergeantMajor_occ || 0);
        acc.squadLeader_pos += Number(r.squadLeader_pos || 0);
        acc.squadLeader_occ += Number(r.squadLeader_occ || 0);
        acc.totalNonCommissioned_pos += Number(r.totalNonCommissioned_pos || 0);
        acc.totalNonCommissioned_occ += Number(r.totalNonCommissioned_occ || 0);
        acc.deputySquadLeader_pos += Number(r.deputySquadLeader_pos || 0);
        acc.deputySquadLeader_occ += Number(r.deputySquadLeader_occ || 0);
        acc.totalAll_pos += Number(r.totalAll_pos || 0);
        acc.totalAll_occ += Number(r.totalAll_occ || 0);
        return acc;
      },
      {
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
      }
    );
  }, [filteredRecords]);

  const activeZoneDef = OFFICIAL_ZONES.find((z) => z.id === selectedZone) || OFFICIAL_ZONES[0];

  const renderNumberCell = (pos: number, occ: number, isSubtotal = false) => {
    const diff = pos - occ;
    const isShortage = diff > 0 && pos > 0;
    return (
      <>
        <td className={`px-2 py-1.5 text-center text-xs font-mono ${isSubtotal ? 'font-bold bg-white text-slate-900 border-slate-300' : 'text-slate-800'}`}>
          {pos || 0}
        </td>
        <td className={`px-2 py-1.5 text-center text-xs font-mono ${
          isSubtotal
            ? 'font-bold bg-white text-slate-950 border-slate-300'
            : isShortage
            ? 'text-rose-700 font-medium'
            : 'text-slate-800'
        }`}>
          {occ || 0}
        </td>
      </>
    );
  };

  return (
    <div className="space-y-4">
      {/* Province Selection Strip with Mini Maps (ช่องแต่ละจังหวัด ติดแผนที่เล็ก) */}
      <ProvinceSelectorBar
        records={records}
        selectedZone={selectedZone}
        onSelectZone={onSelectZone}
        onOpenIncidentsModal={(prov) => setActiveTerroristIncidentsProvince(prov)}
      />

      {/* If a specific zone is active (not 'all'), show a clean compact breadcrumb badge with a reset button */}
      {selectedZone !== 'all' && (
        <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <ProvinceMiniMap
              provinceKey={selectedZone}
              size="xs"
              active={true}
              onClickMap={(prov) => setActiveTerroristIncidentsProvince(prov)}
            />
            <span className="font-semibold text-slate-500">กรองเฉพาะพื้นที่:</span>
            <span className="font-bold text-slate-900 bg-white border border-slate-300 px-2.5 py-0.5 rounded-full font-['Prompt']">
              {activeZoneDef.name}
            </span>
            <span className="text-slate-400">({filteredRecords.length} หน่วยงาน)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-slate-600">
              ตำแหน่ง <strong className="text-slate-900">{zoneSummary.totalPos.toLocaleString()}</strong> / คนครองจริง <strong className="text-emerald-700">{zoneSummary.totalOcc.toLocaleString()}</strong> นาย ({zoneSummary.fillRate.toFixed(1)}%)
            </span>
            <button
              onClick={() => onSelectZone('all')}
              className="text-xs text-sky-700 hover:text-sky-900 font-semibold underline ml-1"
            >
              แสดงทุกพื้นที่ (แสดงทั้งหมด)
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อหน่วยงาน (เช่น สภ.เมืองยะลา, กก.สืบสวน, ฝอ.)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
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

          {/* Area / Group Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedZone}
              onChange={(e) => onSelectZone(e.target.value as ZoneId)}
              className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
            >
              <option value="all">ทุกพื้นที่ / ทุกสังกัด (ทั้งหมด 126 หน่วยงาน)</option>
              <option value="yala">1. จังหวัดยะลา (ภ.จว.ยะลา, บก.สส.จชต., ศฝร.ภ.9)</option>
              <option value="pattani">2. จังหวัดปัตตานี (ภ.จว.ปัตตานี)</option>
              <option value="narathiwat">3. จังหวัดนราธิวาส (ภ.จว.นราธิวาส)</option>
              <option value="songkhla_risk">4. พื้นที่เสี่ยงภัย จว.สงขลา (4 อำเภอ 8 สภ.)</option>
              <option value="songkhla_all">ภ.จว.สงขลา (ทั้งหมด 36 หน่วยงาน)</option>
              <option value="central">ภ.9 ส่วนกลาง & บก.สส.ภ.9 (8 หน่วยงาน)</option>
            </select>
          </div>

          {/* Sub-Group Filter if multiple groups exist in this zone */}
          {selectedZone !== 'all' && Object.keys(groupedRecords).length > 1 && (
            <div className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={selectedSubGroup}
                onChange={(e) => setSelectedSubGroup(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
              >
                <option value="all">ทุกสังกัดย่อยในพื้นที่ ({zoneRecords.length} หน่วย)</option>
                {Array.from(new Set(zoneRecords.map((r) => r.group))).map((g) => {
                  const count = zoneRecords.filter((r) => r.group === g).length;
                  return (
                    <option key={g} value={g}>
                      {g} ({count} หน่วย)
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm select-none bg-red-50 hover:bg-red-100 text-red-900 border border-red-300 px-3 py-1.5 rounded-lg transition font-medium">
            <input
              type="checkbox"
              checked={onlyRedThreatZone}
              onChange={(e) => setOnlyRedThreatZone(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-pulse"></span>
              <span>เฉพาะจุดเสี่ยงภัยสีแดง (เกิดเหตุบ่อย)</span>
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm select-none bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition">
            <input
              type="checkbox"
              checked={showDifference}
              onChange={(e) => setShowDifference(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span className="font-medium text-slate-700">แสดงผลต่างและ % ครองคน</span>
          </label>
        </div>
      </div>

      {/* Official Table Layout */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-md overflow-hidden">
        <div className="overflow-x-auto max-h-[75vh]">
          <table className="w-full border-collapse text-left text-xs border border-slate-300">
            {/* Table Document Header */}
            <thead className="bg-slate-100 text-slate-900 sticky top-0 z-20 shadow-sm select-none">
              {/* Row 1: Main Rank Titles */}
              <tr className="border-b border-slate-300">
                <th rowSpan={2} className="px-2 py-2 text-center font-bold border-r border-slate-300 w-12 bg-slate-200 sticky left-0 z-30">
                  ลำดับ
                </th>
                <th rowSpan={2} className="px-4 py-2 font-bold border-r border-slate-300 min-w-[220px] bg-slate-200 sticky left-12 z-30 shadow-r">
                  หน่วยงาน
                </th>
                <th colSpan={2} className="px-2 py-1.5 text-center font-bold border-r border-slate-300 bg-sky-50 text-sky-950">
                  ผบก.
                </th>
                <th colSpan={2} className="px-2 py-1.5 text-center font-bold border-r border-slate-300 bg-sky-50 text-sky-950">
                  รอง ผบก.
                </th>
                <th colSpan={2} className="px-2 py-1.5 text-center font-bold border-r border-slate-300 bg-sky-50 text-sky-950">
                  ผกก.
                </th>
                <th colSpan={2} className="px-2 py-1.5 text-center font-bold border-r border-slate-300 bg-sky-50 text-sky-950">
                  รอง ผกก.
                </th>
                <th colSpan={2} className="px-2 py-1.5 text-center font-bold border-r border-slate-300 bg-sky-50 text-sky-950">
                  สว.
                </th>
                <th colSpan={2} className="px-2 py-1.5 text-center font-bold border-r border-slate-300 bg-sky-50 text-sky-950">
                  รอง สว.
                </th>
                <th colSpan={2} className="px-2 py-1.5 text-center font-bold border-r border-slate-400 bg-white text-slate-900">
                  รวมชั้นสัญญาบัตร
                </th>
                <th colSpan={2} className="px-2 py-1.5 text-center font-bold border-r border-slate-300 bg-emerald-50 text-emerald-950">
                  รอง สว.(ด.ต.53 ปี)
                </th>
                <th colSpan={2} className="px-2 py-1.5 text-center font-bold border-r border-slate-300 bg-emerald-50 text-emerald-950">
                  ผบ.หมู่
                </th>
                <th colSpan={2} className="px-2 py-1.5 text-center font-bold border-r border-slate-400 bg-emerald-100 text-emerald-950">
                  ชั้นประทวน
                </th>
                <th colSpan={2} className="px-2 py-1.5 text-center font-bold border-r border-slate-300 bg-slate-100 text-slate-800">
                  รอง ผบ.หมู่
                </th>
                <th colSpan={2} className="px-2 py-1.5 text-center font-bold border-r border-slate-400 bg-slate-900 text-amber-300">
                  รวมทั้งหมด
                </th>
                {showDifference && (
                  <>
                    <th rowSpan={2} className="px-2 py-1.5 text-center font-bold border-r border-slate-300 bg-rose-50 text-rose-900 min-w-[70px]">
                      ขาด/เกิน
                    </th>
                    <th rowSpan={2} className="px-2 py-1.5 text-center font-bold border-r border-slate-300 bg-indigo-50 text-indigo-900 min-w-[65px]">
                      % ครอง
                    </th>
                  </>
                )}
                <th rowSpan={2} className="px-3 py-1.5 text-center font-bold bg-slate-100 text-slate-700 min-w-[130px]">
                  จัดการ / ตัวคน
                </th>
              </tr>

              {/* Row 2: Sub-headers (ตำแหน่ง, คนครอง) */}
              <tr className="border-b-2 border-slate-400 text-[11px] font-semibold text-slate-700">
                <th className="px-1.5 py-1 text-center border-r border-slate-300 bg-sky-50/70">ตำแหน่ง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-300 bg-sky-50/70">คนครอง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-300 bg-sky-50/70">ตำแหน่ง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-300 bg-sky-50/70">คนครอง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-300 bg-sky-50/70">ตำแหน่ง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-300 bg-sky-50/70">คนครอง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-300 bg-sky-50/70">ตำแหน่ง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-300 bg-sky-50/70">คนครอง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-300 bg-sky-50/70">ตำแหน่ง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-300 bg-sky-50/70">คนครอง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-300 bg-sky-50/70">ตำแหน่ง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-300 bg-sky-50/70">คนครอง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-400 bg-white font-bold text-slate-900">ตำแหน่ง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-400 bg-white font-bold text-slate-900">คนครอง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-300 bg-emerald-50/70">ตำแหน่ง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-300 bg-emerald-50/70">คนครอง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-300 bg-emerald-50/70">ตำแหน่ง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-300 bg-emerald-50/70">คนครอง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-400 bg-emerald-100/90 font-bold text-emerald-950">ตำแหน่ง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-400 bg-emerald-100/90 font-bold text-emerald-950">คนครอง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-300">ตำแหน่ง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-300">คนครอง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-400 bg-slate-900 text-amber-300 font-bold">ตำแหน่ง</th>
                <th className="px-1.5 py-1 text-center border-r border-slate-400 bg-slate-900 text-amber-300 font-bold">คนครอง</th>
              </tr>
            </thead>

            {/* Table Body by Group */}
            <tbody className="divide-y divide-slate-200">
              {Object.keys(groupedRecords).length === 0 ? (
                <tr>
                  <td colSpan={30} className="px-6 py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <div className="font-semibold text-base text-slate-700">ไม่พบข้อมูลในพื้นที่นี้ที่ตรงกับเงื่อนไขการค้นหา</div>
                    <div className="text-xs text-slate-400 mt-1">ลองเปลี่ยนคำค้นหา หรือเลือกดูพื้นที่อื่น</div>
                  </td>
                </tr>
              ) : (
                Object.entries(groupedRecords).map(([groupName, groupUnits]) => {
                  const summary = computeGroupSummary(groupName, records);

                  return (
                    <React.Fragment key={groupName}>
                      {/* Group Header Banner */}
                      <tr className="bg-slate-800 text-white font-semibold">
                        <td colSpan={30} className="px-4 py-2 border-y border-slate-700 text-xs sm:text-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <ProvinceMiniMap
                                provinceKey={groupName}
                                size="xs"
                                onClickMap={(prov) => setActiveTerroristIncidentsProvince(prov)}
                              />
                              <span className="font-['Prompt'] text-amber-300 font-bold">{groupName}</span>
                              <span className="text-xs text-slate-300 font-normal">
                                ({groupUnits.length} หน่วยงาน)
                              </span>
                            </div>
                            <div className="text-xs text-slate-300 font-normal hidden sm:block">
                              ตำแหน่งรวม {summary.totalAll_pos.toLocaleString()} นาย / คนครองจริง {summary.totalAll_occ.toLocaleString()} นาย
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* Units in this group */}
                      {groupUnits.map((r, idx) => {
                        const diff = r.totalAll_pos - r.totalAll_occ;
                        const pct = r.totalAll_pos > 0 ? (r.totalAll_occ / r.totalAll_pos) * 100 : 0;
                        const threatInfo = getThreatInfo(r.name);
                        const isRed = isRedThreatZone(r.name) || !!r.isRiskAreaSongkhla;

                        return (
                          <tr
                            key={r.id}
                            className={`hover:bg-amber-50/40 transition-colors border-b border-slate-200 ${
                              isRed ? 'bg-red-50/20' : idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'
                            }`}
                          >
                            <td className="px-2 py-1.5 text-center font-mono text-slate-600 border-r border-slate-200 sticky left-0 bg-inherit z-10">
                              {r.order || idx + 1}
                            </td>
                            <td className="px-3 py-1.5 border-r border-slate-200 sticky left-12 bg-inherit z-10 shadow-r">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-medium text-slate-900">{r.name}</span>
                                {isRed && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const info: SecurityThreatZoneInfo = threatInfo || {
                                        province: r.isRiskAreaSongkhla ? 'จ.สงขลา' : r.group,
                                        district: r.name.replace('สภ.', 'อ.'),
                                        stationName: r.name,
                                        threatLevel: 'red',
                                        riskSpots: 'จุดตรวจด่านความมั่นคง, เส้นทางคมนาคมสายหลัก, รอยต่อชุมชน',
                                        frequentIncidents: 'ลอบวางระเบิดแสวงเครื่อง, ซุ่มยิงชุดลาดตระเวน, ก่อกวนความไม่สงบ',
                                        manpowerStatus: `อัตรา ${r.totalAll_pos} / ครอง ${r.totalAll_occ} นาย`,
                                      };
                                      setActiveThreatDetail({ info, record: r });
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-xs whitespace-nowrap inline-flex items-center gap-1 transition active:scale-95 cursor-pointer"
                                    title="คลิกเพื่อดูจุดเฝ้าระวัง & จุดเกิดเหตุบ่อย"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-pulse"></span>
                                    <span>🔴 เสี่ยงภัยสีแดง</span>
                                  </button>
                                )}
                                {r.isRiskAreaSongkhla && !isRed && (
                                  <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.2 rounded font-semibold whitespace-nowrap">
                                    4 อ.เสี่ยงภัย
                                  </span>
                                )}
                              </div>
                            </td>

                            {renderNumberCell(r.commander_pos, r.commander_occ)}
                            {renderNumberCell(r.deputyCommander_pos, r.deputyCommander_occ)}
                            {renderNumberCell(r.superintendent_pos, r.superintendent_occ)}
                            {renderNumberCell(r.deputySuperintendent_pos, r.deputySuperintendent_occ)}
                            {renderNumberCell(r.inspector_pos, r.inspector_occ)}
                            {renderNumberCell(r.deputyInspector_pos, r.deputyInspector_occ)}

                            {/* รวมชั้นสัญญาบัตร */}
                            <td className="px-2 py-1.5 text-center text-xs font-mono font-semibold bg-white text-slate-900 border-r border-slate-200">
                              {r.totalCommissioned_pos}
                            </td>
                            <td className="px-2 py-1.5 text-center text-xs font-mono font-semibold bg-white text-slate-900 border-r border-slate-300">
                              {r.totalCommissioned_occ}
                            </td>

                            {renderNumberCell(r.seniorSergeantMajor_pos, r.seniorSergeantMajor_occ)}
                            {renderNumberCell(r.squadLeader_pos, r.squadLeader_occ)}

                            {/* รวมชั้นประทวน */}
                            <td className="px-2 py-1.5 text-center text-xs font-mono font-semibold bg-emerald-50/70 text-emerald-950 border-r border-slate-200">
                              {r.totalNonCommissioned_pos}
                            </td>
                            <td className="px-2 py-1.5 text-center text-xs font-mono font-semibold bg-emerald-50/70 text-emerald-950 border-r border-slate-300">
                              {r.totalNonCommissioned_occ}
                            </td>

                            {renderNumberCell(r.deputySquadLeader_pos, r.deputySquadLeader_occ)}

                            {/* รวมทั้งหมด */}
                            <td className="px-2 py-1.5 text-center text-xs font-mono font-bold bg-slate-100 text-slate-900 border-r border-slate-200">
                              {r.totalAll_pos}
                            </td>
                            <td className="px-2 py-1.5 text-center text-xs font-mono font-bold bg-slate-100 text-slate-900 border-r border-slate-300">
                              {r.totalAll_occ}
                            </td>

                            {/* Difference and % */}
                            {showDifference && (
                              <>
                                <td className={`px-2 py-1.5 text-center text-xs font-mono font-medium border-r border-slate-200 ${
                                  diff > 0 ? 'text-rose-600' : diff < 0 ? 'text-blue-600' : 'text-slate-400'
                                }`}>
                                  {diff > 0 ? `-${diff}` : diff < 0 ? `+${Math.abs(diff)}` : '0'}
                                </td>
                                <td className="px-2 py-1.5 text-center text-xs font-mono font-medium border-r border-slate-200">
                                  <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                                    pct >= 90
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : pct >= 70
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}>
                                    {r.totalAll_pos > 0 ? `${pct.toFixed(0)}%` : '-'}
                                  </span>
                                </td>
                              </>
                            )}

                            {/* Action Buttons with prominent "ตัวคน" */}
                            <td className="px-2 py-1.5 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => onViewRoster(r)}
                                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition flex items-center gap-1"
                                  title="ดูรายละเอียดสถานภาพตัวคน ทุกระดับชั้นยศ"
                                >
                                  <Users className="w-3 h-3 text-sky-600" />
                                  <span>ตัวคน</span>
                                </button>
                                <button
                                  onClick={() => onEdit(r)}
                                  className="p-1 rounded text-slate-500 hover:text-amber-600 hover:bg-amber-100/50 transition"
                                  title="แก้ไขข้อมูลหน่วยงาน"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onDuplicate(r)}
                                  className="p-1 rounded text-slate-500 hover:text-sky-600 hover:bg-sky-100/50 transition"
                                  title="คัดลอกแถวข้อมูล"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onDelete(r.id, r.name)}
                                  className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-rose-100/50 transition"
                                  title="ลบข้อมูลหน่วยงาน"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {/* Official Subtotal Row for this Group */}
                      <tr className="bg-white font-bold border-y-2 border-slate-300 text-slate-900">
                        <td className="px-2 py-2 text-center border-r border-slate-300 sticky left-0 bg-white z-10">-</td>
                        <td className="px-3 py-2 border-r border-slate-300 sticky left-12 bg-white z-10 font-['Prompt'] text-slate-950 shadow-r">
                          <div className="flex items-center gap-1.5">
                            <ProvinceMiniMap
                              provinceKey={groupName}
                              size="xs"
                              onClickMap={(prov) => setActiveTerroristIncidentsProvince(prov)}
                            />
                            <span>รวม ({groupName})</span>
                          </div>
                        </td>
                        {renderNumberCell(summary.commander_pos, summary.commander_occ, true)}
                        {renderNumberCell(summary.deputyCommander_pos, summary.deputyCommander_occ, true)}
                        {renderNumberCell(summary.superintendent_pos, summary.superintendent_occ, true)}
                        {renderNumberCell(summary.deputySuperintendent_pos, summary.deputySuperintendent_occ, true)}
                        {renderNumberCell(summary.inspector_pos, summary.inspector_occ, true)}
                        {renderNumberCell(summary.deputyInspector_pos, summary.deputyInspector_occ, true)}
                        {renderNumberCell(summary.totalCommissioned_pos, summary.totalCommissioned_occ, true)}
                        {renderNumberCell(summary.seniorSergeantMajor_pos, summary.seniorSergeantMajor_occ, true)}
                        {renderNumberCell(summary.squadLeader_pos, summary.squadLeader_occ, true)}
                        {renderNumberCell(summary.totalNonCommissioned_pos, summary.totalNonCommissioned_occ, true)}
                        {renderNumberCell(summary.deputySquadLeader_pos, summary.deputySquadLeader_occ, true)}
                        {renderNumberCell(summary.totalAll_pos, summary.totalAll_occ, true)}

                        {showDifference && (
                          <>
                            <td className="px-2 py-2 text-center text-xs font-mono font-bold text-rose-700 border-r border-slate-300 bg-white">
                              -{summary.totalAll_pos - summary.totalAll_occ}
                            </td>
                            <td className="px-2 py-2 text-center text-xs font-mono font-bold border-r border-slate-300 bg-white">
                              {summary.totalAll_pos > 0
                                ? `${((summary.totalAll_occ / summary.totalAll_pos) * 100).toFixed(1)}%`
                                : '-'}
                            </td>
                          </>
                        )}
                        <td className="px-2 py-2 text-center text-[10px] text-slate-500 bg-white">ผลรวมสังกัด</td>
                      </tr>
                    </React.Fragment>
                  );
                })
              )}
            </tbody>

            {/* Official Grand Total Footer */}
            <tfoot className="sticky bottom-0 z-20 shadow-lg">
              <tr className="bg-slate-900 text-white font-extrabold border-t-2 border-amber-400 text-xs sm:text-sm">
                <td className="px-2 py-3 text-center border-r border-slate-700 sticky left-0 bg-slate-900 z-10">-</td>
                <td className="px-3 py-3 border-r border-slate-700 sticky left-12 bg-slate-900 z-10 text-amber-400 font-['Prompt'] text-sm tracking-wide shadow-r">
                  รวมทั้งสิ้น ({activeZoneDef.shortName})
                </td>

                <td className="px-2 py-3 text-center font-mono border-r border-slate-800">{grandTotal.commander_pos}</td>
                <td className="px-2 py-3 text-center font-mono border-r border-slate-800 text-amber-300">{grandTotal.commander_occ}</td>

                <td className="px-2 py-3 text-center font-mono border-r border-slate-800">{grandTotal.deputyCommander_pos}</td>
                <td className="px-2 py-3 text-center font-mono border-r border-slate-800 text-amber-300">{grandTotal.deputyCommander_occ}</td>

                <td className="px-2 py-3 text-center font-mono border-r border-slate-800">{grandTotal.superintendent_pos}</td>
                <td className="px-2 py-3 text-center font-mono border-r border-slate-800 text-amber-300">{grandTotal.superintendent_occ}</td>

                <td className="px-2 py-3 text-center font-mono border-r border-slate-800">{grandTotal.deputySuperintendent_pos}</td>
                <td className="px-2 py-3 text-center font-mono border-r border-slate-800 text-amber-300">{grandTotal.deputySuperintendent_occ}</td>

                <td className="px-2 py-3 text-center font-mono border-r border-slate-800">{grandTotal.inspector_pos}</td>
                <td className="px-2 py-3 text-center font-mono border-r border-slate-800 text-amber-300">{grandTotal.inspector_occ}</td>

                <td className="px-2 py-3 text-center font-mono border-r border-slate-800">{grandTotal.deputyInspector_pos}</td>
                <td className="px-2 py-3 text-center font-mono border-r border-slate-800 text-amber-300">{grandTotal.deputyInspector_occ}</td>

                {/* รวมชั้นสัญญาบัตร */}
                <td className="px-2 py-3 text-center font-mono border-r border-slate-800 bg-slate-800 text-amber-200">
                  {grandTotal.totalCommissioned_pos}
                </td>
                <td className="px-2 py-3 text-center font-mono border-r border-slate-800 bg-slate-800 text-amber-400">
                  {grandTotal.totalCommissioned_occ}
                </td>

                <td className="px-2 py-3 text-center font-mono border-r border-slate-800">{grandTotal.seniorSergeantMajor_pos}</td>
                <td className="px-2 py-3 text-center font-mono border-r border-slate-800 text-amber-300">{grandTotal.seniorSergeantMajor_occ}</td>

                <td className="px-2 py-3 text-center font-mono border-r border-slate-800">{grandTotal.squadLeader_pos}</td>
                <td className="px-2 py-3 text-center font-mono border-r border-slate-800 text-amber-300">{grandTotal.squadLeader_occ}</td>

                {/* รวมชั้นประทวน */}
                <td className="px-2 py-3 text-center font-mono border-r border-slate-800 bg-slate-800 text-emerald-300">
                  {grandTotal.totalNonCommissioned_pos}
                </td>
                <td className="px-2 py-3 text-center font-mono border-r border-slate-800 bg-slate-800 text-emerald-400">
                  {grandTotal.totalNonCommissioned_occ}
                </td>

                <td className="px-2 py-3 text-center font-mono border-r border-slate-800">{grandTotal.deputySquadLeader_pos}</td>
                <td className="px-2 py-3 text-center font-mono border-r border-slate-800 text-amber-300">{grandTotal.deputySquadLeader_occ}</td>

                {/* รวมทั้งหมด */}
                <td
                  className="px-2 py-3 text-center font-mono border-r border-slate-700 font-black text-sm"
                  style={{
                    backgroundColor: theme?.accentColor || '#f59e0b',
                    color: '#0f172a',
                  }}
                >
                  {grandTotal.totalAll_pos.toLocaleString()}
                </td>
                <td
                  className="px-2 py-3 text-center font-mono border-r border-slate-700 font-black text-sm"
                  style={{
                    backgroundColor: theme?.accentColor || '#fbbf24',
                    color: '#0f172a',
                    filter: 'brightness(0.92)',
                  }}
                >
                  {grandTotal.totalAll_occ.toLocaleString()}
                </td>

                {showDifference && (
                  <>
                    <td className="px-2 py-3 text-center font-mono text-rose-300 border-r border-slate-800">
                      -{(grandTotal.totalAll_pos - grandTotal.totalAll_occ).toLocaleString()}
                    </td>
                    <td className="px-2 py-3 text-center font-mono text-emerald-300 border-r border-slate-800">
                      {grandTotal.totalAll_pos > 0
                        ? `${((grandTotal.totalAll_occ / grandTotal.totalAll_pos) * 100).toFixed(1)}%`
                        : '-'}
                    </td>
                  </>
                )}
                <td className="px-2 py-3 text-center text-xs text-amber-300 font-normal">รวมสิ้นสุด</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Legend */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-white border border-slate-300 inline-block rounded"></span>
              <span>รวมชั้นสัญญาบัตร (ผบก. ถึง รอง สว.)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-emerald-100 border border-emerald-300 inline-block rounded"></span>
              <span>ชั้นประทวน (รอง สว.(ด.ต.53 ปี) + ผบ.หมู่)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-slate-900 border border-amber-400 inline-block rounded"></span>
              <span>รวมทั้งหมด (สัญญาบัตร + ประทวน + รอง ผบ.หมู่)</span>
            </span>
            <span className="flex items-center gap-1.5 text-sky-700 font-medium">
              💡 คลิกปุ่ม "ตัวคน" ที่แต่ละแถวเพื่อดูรายละเอียดอัตรากำลังพลและรายชื่อข้าราชการตำรวจในหน่วยงานนั้น
            </span>
          </div>
          <div className="text-slate-400">
            แสดง {filteredRecords.length} หน่วยงานใน {activeZoneDef.shortName}
          </div>
        </div>
      </div>

      {/* Threat Detail Modal for red risk spots */}
      <ThreatDetailModal
        isOpen={!!activeThreatDetail}
        threatInfo={activeThreatDetail?.info || null}
        unitRecord={activeThreatDetail?.record || null}
        onClose={() => setActiveThreatDetail(null)}
        onViewRoster={onViewRoster}
      />

      {/* Terrorist & Security Incidents Modal with authentic tactical photos & records */}
      <TerroristIncidentsModal
        isOpen={!!activeTerroristIncidentsProvince}
        provinceKey={activeTerroristIncidentsProvince || 'all'}
        onClose={() => setActiveTerroristIncidentsProvince(null)}
        records={records}
        onViewUnitRoster={(unitName) => {
          const found = records.find(
            (r) => r.name === unitName || r.name.includes(unitName) || unitName.includes(r.name)
          );
          if (found) {
            onViewRoster(found);
          }
        }}
      />
    </div>
  );
};
