import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  AlertTriangle,
  Award,
  ShieldAlert,
  BarChart3,
  Shield,
  Layers,
  Crosshair,
  Activity,
  MapPin,
  ExternalLink,
  ChevronRight,
  Target,
  Compass,
  Heart,
  Flag,
} from 'lucide-react';
import { PoliceUnitRecord, UNIT_GROUPS, ZoneId } from '../types';
import { computeGroupSummary } from '../data/initialData';
import { ProvinceMiniMap } from './ProvinceMiniMap';

interface AnalyticsViewProps {
  records: PoliceUnitRecord[];
  onNavigateToZone?: (zoneId: ZoneId, unitName?: string) => void;
  onSelectUnitRoster?: (unit: PoliceUnitRecord) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  records,
  onNavigateToZone,
  onSelectUnitRoster,
}) => {
  const [selectedPositionCategory, setSelectedPositionCategory] = useState<'all' | 'commissioned' | 'nonCommissioned'>('all');

  // Overall totals
  const totalPos = records.reduce((s, r) => s + r.totalAll_pos, 0);
  const totalOcc = records.reduce((s, r) => s + r.totalAll_occ, 0);
  const totalShortage = Math.max(0, totalPos - totalOcc);
  const overallPct = totalPos > 0 ? (totalOcc / totalPos) * 100 : 0;

  // Officers (ชั้นสัญญาบัตร)
  const totalCommPos = records.reduce((s, r) => s + r.totalCommissioned_pos, 0);
  const totalCommOcc = records.reduce((s, r) => s + r.totalCommissioned_occ, 0);
  const commPct = totalCommPos > 0 ? (totalCommOcc / totalCommPos) * 100 : 0;

  // NCOs (ชั้นประทวน)
  const totalNonCommPos = records.reduce((s, r) => s + r.totalNonCommissioned_pos, 0);
  const totalNonCommOcc = records.reduce((s, r) => s + r.totalNonCommissioned_occ, 0);
  const nonCommPct = totalNonCommPos > 0 ? (totalNonCommOcc / totalNonCommPos) * 100 : 0;

  // Group summary list
  const groupStats = UNIT_GROUPS.map((g) => {
    const summary = computeGroupSummary(g, records);
    const shortage = summary.totalAll_pos - summary.totalAll_occ;
    const pct = summary.totalAll_pos > 0 ? (summary.totalAll_occ / summary.totalAll_pos) * 100 : 0;

    let provinceKey: 'yala' | 'pattani' | 'narathiwat' | 'songkhla_risk' | 'all' = 'all';
    let zoneId: ZoneId = 'all';
    if (g === 'ภ.จว.ยะลา') {
      provinceKey = 'yala';
      zoneId = 'yala';
    } else if (g === 'ภ.จว.ปัตตานี') {
      provinceKey = 'pattani';
      zoneId = 'pattani';
    } else if (g === 'ภ.จว.นราธิวาส') {
      provinceKey = 'narathiwat';
      zoneId = 'narathiwat';
    } else if (g === 'บก.สืบสวนสอบสวน จชต.' || g === 'ศฝร.ภ.9') {
      provinceKey = 'yala';
      zoneId = 'yala';
    }

    return {
      group: g,
      summary,
      shortage,
      pct,
      provinceKey,
      zoneId,
    };
  });

  // 4 Risk Areas Stats (Songkhla 4 districts)
  const riskRecords = records.filter((r) => r.isRiskAreaSongkhla);
  const riskPos = riskRecords.reduce((s, r) => s + r.totalAll_pos, 0);
  const riskOcc = riskRecords.reduce((s, r) => s + r.totalAll_occ, 0);
  const riskShortage = riskPos - riskOcc;
  const riskPct = riskPos > 0 ? (riskOcc / riskPos) * 100 : 0;

  // Top 10 shortage stations
  const topShortageStations = [...records]
    .filter((r) => r.totalAll_pos > 0)
    .map((r) => ({
      ...r,
      shortage: r.totalAll_pos - r.totalAll_occ,
      pct: (r.totalAll_occ / r.totalAll_pos) * 100,
    }))
    .sort((a, b) => b.shortage - a.shortage)
    .slice(0, 10);

  // 12 Core Positions Tactical Breakdown Data
  const positionDefinitions = [
    { key: 'commander', name: 'ผบก.', rankGroup: 'commissioned', tier: 'ระดับบริหารสูงสุด (ผู้บังคับการ)', posKey: 'commander_pos', occKey: 'commander_occ' },
    { key: 'deputyCommander', name: 'รอง ผบก.', rankGroup: 'commissioned', tier: 'ระดับบริหาร (รองผู้บังคับการ)', posKey: 'deputyCommander_pos', occKey: 'deputyCommander_occ' },
    { key: 'superintendent', name: 'ผกก.', rankGroup: 'commissioned', tier: 'ระดับบัญชาการสถานี (หัวหน้าสถานี)', posKey: 'superintendent_pos', occKey: 'superintendent_occ' },
    { key: 'deputySuperintendent_suppression', name: 'รอง ผกก.(ป.)', rankGroup: 'commissioned', tier: 'ป้องกันปราบปราม & มวลชนสัมพันธ์', posKey: 'deputySuperintendent_suppression_pos', occKey: 'deputySuperintendent_suppression_occ' },
    { key: 'deputySuperintendent_investigation', name: 'รอง ผกก.(สส.)', rankGroup: 'commissioned', tier: 'สืบสวนคดีความมั่นคง & การข่าว', posKey: 'deputySuperintendent_investigation_pos', occKey: 'deputySuperintendent_investigation_occ' },
    { key: 'deputySuperintendent_inquiry', name: 'รอง ผกก.(สอบสวน)', rankGroup: 'commissioned', tier: 'อำนวยการงานสอบสวนคดีอาญา', posKey: 'deputySuperintendent_inquiry_pos', occKey: 'deputySuperintendent_inquiry_occ' },
    { key: 'inspector_suppression', name: 'สว.(ป.)', rankGroup: 'commissioned', tier: 'สารวัตรป้องกันปราบปรามภาคสนาม', posKey: 'inspector_suppression_pos', occKey: 'inspector_suppression_occ' },
    { key: 'inspector_investigation', name: 'สว.(สส.)', rankGroup: 'commissioned', tier: 'สารวัตรสืบสวนปฏิบัติการพิเศษ', posKey: 'inspector_investigation_pos', occKey: 'inspector_investigation_occ' },
    { key: 'inspector_inquiry', name: 'สว.(สอบสวน)', rankGroup: 'commissioned', tier: 'สารวัตรสอบสวนประจำสถานี', posKey: 'inspector_inquiry_pos', occKey: 'inspector_inquiry_occ' },
    { key: 'subInspector_suppression', name: 'รอง สว.(ป./สส.)', rankGroup: 'commissioned', tier: 'รองสารวัตรยุทธวิธี & สืบสวนภาคสนาม', posKey: 'subInspector_suppression_pos', occKey: 'subInspector_suppression_occ' },
    { key: 'subInspector_inquiry', name: 'รอง สว.(สอบสวน)', rankGroup: 'commissioned', tier: 'รองสารวัตรพนักงานสอบสวนเวร', posKey: 'subInspector_inquiry_pos', occKey: 'subInspector_inquiry_occ' },
    { key: 'squadLeader', name: 'ผบ.หมู่ / ประทวน', rankGroup: 'nonCommissioned', tier: 'ผู้บังคับหมู่ / สายตรวจ / ปฏิบัติการพิเศษ', posKey: 'squadLeader_pos', occKey: 'squadLeader_occ' },
  ];

  const positionStats = positionDefinitions.map((def) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pos = records.reduce((sum, r) => sum + ((r as any)[def.posKey] || 0), 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const occ = records.reduce((sum, r) => sum + ((r as any)[def.occKey] || 0), 0);
    const shortage = pos - occ;
    const pct = pos > 0 ? (occ / pos) * 100 : 0;
    return {
      ...def,
      pos,
      occ,
      shortage,
      pct,
    };
  });

  const filteredPositions = positionStats.filter((p) => {
    if (selectedPositionCategory === 'commissioned') return p.rankGroup === 'commissioned';
    if (selectedPositionCategory === 'nonCommissioned') return p.rankGroup === 'nonCommissioned';
    return true;
  });

  // 4 Strategic Security Zones
  const strategicZones = [
    {
      id: 'yala',
      name: 'จังหวัดยะลา',
      description: 'พื้นที่เทือกเขาสันกาลาคีรี • อ.เบตง • ทางหลวง 410 • ชุมชนพหุวัฒนธรรม',
      zoneId: 'yala' as ZoneId,
      pos: groupStats.find((g) => g.group === 'ภ.จว.ยะลา')?.summary.totalAll_pos || 0,
      occ: groupStats.find((g) => g.group === 'ภ.จว.ยะลา')?.summary.totalAll_occ || 0,
      spCount: records.filter((r) => r.group === 'ภ.จว.ยะลา' && r.name.startsWith('สภ.')).length,
      redCount: 9,
      tacticalFocus: 'พิทักษ์สันติราษฎร์บนพื้นที่เขาสูง คุ้มครองเส้นทางเศรษฐกิจและชุมชนพี่น้องประชาชน',
    },
    {
      id: 'pattani',
      name: 'จังหวัดปัตตานี',
      description: 'แนวชายฝั่งทะเลอ่าวไทย • เมืองศูนย์กลางการศึกษาและวัฒนธรรมปัตตานี • แนวรอยต่อ',
      zoneId: 'pattani' as ZoneId,
      pos: groupStats.find((g) => g.group === 'ภ.จว.ปัตตานี')?.summary.totalAll_pos || 0,
      occ: groupStats.find((g) => g.group === 'ภ.จว.ปัตตานี')?.summary.totalAll_occ || 0,
      spCount: records.filter((r) => r.group === 'ภ.จว.ปัตตานี' && r.name.startsWith('สภ.')).length,
      redCount: 8,
      tacticalFocus: 'ดูแลความสงบเรียบร้อยเขตเมือง คุ้มครองท่าเทียบเรือประมง และสร้างความปรองดอง',
    },
    {
      id: 'narathiwat',
      name: 'จังหวัดนราธิวาส',
      description: 'ผืนป่าฮาลา-บาลาอันอุดมสมบูรณ์ • ชายแดนใต้ไทย-มาเลเซีย • แม่น้ำโก-ลก',
      zoneId: 'narathiwat' as ZoneId,
      pos: groupStats.find((g) => g.group === 'ภ.จว.นราธิวาส')?.summary.totalAll_pos || 0,
      occ: groupStats.find((g) => g.group === 'ภ.จว.นราธิวาส')?.summary.totalAll_occ || 0,
      spCount: records.filter((r) => r.group === 'ภ.จว.นราธิวาส' && r.name.startsWith('สภ.')).length,
      redCount: 11,
      tacticalFocus: 'ปกป้องอธิปไตยแนวพรมแดน เฝ้าระวังเส้นทางคมนาคมรางรถไฟ และเกื้อหนุนชีวิตประชาชน',
    },
    {
      id: 'songkhla_risk',
      name: '4 อำเภอเสี่ยงภัย จว.สงขลา',
      description: 'จะนะ • เทพา • นาทวี • สะบ้าย้อย (ด่านหน้าเชื่อมโยงแผ่นดินใต้กับส่วนกลาง)',
      zoneId: 'songkhla_risk' as ZoneId,
      pos: riskPos,
      occ: riskOcc,
      spCount: riskRecords.length,
      redCount: 8,
      tacticalFocus: 'จุดตรวจความมั่นคงหลัก สกัดกั้นภัยคุกคาม และประสานพลังมวลชนรักษาความสงบ',
    },
  ];

  return (
    <div className="space-y-6 text-slate-800">
      {/* Tactical Command Banner */}
      <div className="bg-gradient-to-r from-[#0f1722] via-[#162233] to-[#1e2e42] p-6 rounded-2xl shadow-xl text-white relative overflow-hidden border-b-2 border-[#b5934a]">
        {/* Subtle Watermark Emblem Background */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-white">
          <Shield className="w-64 h-64" />
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mt-1">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-amber-200 border border-amber-300/30 backdrop-blur-sm">
                <Shield className="w-3 h-3 text-amber-300" />
                <span>ศูนย์ปฏิบัติการตำรวจจังหวัดชายแดนภาคใต้</span>
              </span>
              <span className="text-[11px] font-mono text-slate-200 bg-slate-900/80 border border-slate-700 px-2 py-0.5 rounded">
                ตำรวจภูธรภาค 9 จชต.
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Prompt'] text-white flex items-center gap-2.5">
              <Shield className="w-6 h-6 text-[#b5934a]" />
              <span>แผนภูมิและสถิติวิเคราะห์สถานภาพกำลังพล ภ.9</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              ติดตามสัดส่วนการครองคน ความพร้อมในการปฏิบัติหน้าที่รักษาความสงบเรียบร้อย และการจัดสรรอัตรากำลังในพื้นที่ 3 จังหวัดชายแดนภาคใต้ และ 4 อำเภอเสี่ยงภัย จว.สงขลา
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-right shadow-md">
              <div className="text-[11px] text-slate-300 font-medium">อัตราครองคนเฉลี่ยภาพรวม</div>
              <div className="text-2xl font-bold font-mono text-white flex items-baseline justify-end gap-1">
                <span>{overallPct.toFixed(1)}%</span>
                <span className="text-[10px] text-[#b5934a] font-normal">ความพร้อมปฏิบัติการ</span>
              </div>
              <div className="text-[10px] text-slate-300">
                ครองจริง {totalOcc.toLocaleString()} / {totalPos.toLocaleString()} นาย
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Command Tiles (Matching Infographic Palette) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Positions (Mustard Gold #b5934a) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex items-center gap-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-xl bg-[#b5934a]/10 border border-[#b5934a]/30 text-[#8c7033] flex items-center justify-center font-bold shadow-inner">
            <Users className="w-6 h-6 text-[#8c7033]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
              <span>อัตราตำแหน่งอนุมัติ</span>
              <span className="text-[10px] font-mono text-[#8c7033] font-bold">POS.</span>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight mt-0.5">
              {totalPos.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 truncate">
              ครอบคลุม 12 ตำแหน่งหลักตามกรอบ
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#b5934a]"></div>
        </div>

        {/* Total Occupied (Forest Sage #6b8979) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex items-center gap-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-xl bg-[#6b8979]/10 border border-[#6b8979]/30 text-[#2e4d39] flex items-center justify-center font-bold shadow-inner">
            <UserCheck className="w-6 h-6 text-[#2e4d39]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
              <span>จำนวนคนครองจริง (พร้อมปฏิบัติ)</span>
              <span className="text-[10px] font-mono text-[#2e4d39] font-bold">ACT.</span>
            </div>
            <div className="text-2xl font-bold font-mono text-[#2e4d39] tracking-tight mt-0.5">
              {totalOcc.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#2e4d39] font-medium mt-0.5 flex items-center gap-1">
              <span>ครองคน {overallPct.toFixed(1)}%</span>
              <span className="text-slate-400">• ปฏิบัติหน้าที่จริง</span>
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#6b8979]"></div>
        </div>

        {/* Shortage (Terracotta / Coral #bc7563) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex items-center gap-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-xl bg-[#bc7563]/10 border border-[#bc7563]/30 text-[#b04332] flex items-center justify-center font-bold shadow-inner">
            <AlertTriangle className="w-6 h-6 text-[#b04332]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
              <span>ตำแหน่งขาดแคลน / อัตราว่าง</span>
              <span className="text-[10px] font-mono text-[#b04332] font-bold">DEF.</span>
            </div>
            <div className="text-2xl font-bold font-mono text-[#b04332] tracking-tight mt-0.5">
              -{totalShortage.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#b04332] font-medium mt-0.5">
              ว่าง {totalPos > 0 ? ((totalShortage / totalPos) * 100).toFixed(1) : 0}% จากกรอบจัดสรร
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#bc7563]"></div>
        </div>

        {/* 4 Risk Districts Songkhla (Deep Pine Green #10442a) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex items-center gap-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-xl bg-[#10442a]/10 border border-[#10442a]/30 text-[#10442a] flex items-center justify-center font-bold shadow-inner">
            <ShieldAlert className="w-6 h-6 text-[#10442a]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
              <span>4 อำเภอเสี่ยงภัย จว.สงขลา</span>
              <span className="text-[10px] font-mono text-[#10442a] font-bold">ZONE 4</span>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight mt-0.5">
              {riskOcc.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ {riskPos.toLocaleString()}</span>
            </div>
            <div className="text-[11px] text-slate-600 font-medium mt-0.5">
              ครองคน {riskPct.toFixed(1)}% (ขาด -{riskShortage} นาย)
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#10442a]"></div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CHART 1: แผนภูมิแท่งเปรียบเทียบสัดส่วนการครองคนแยกตามสังกัด/พื้นที่ */}
      {/* ======================================================== */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900 font-bold shadow-xs">
              <BarChart3 className="w-4 h-4 text-blue-800" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Prompt'] flex items-center gap-2">
                <span>แผนภูมิสัดส่วนอัตราการครองคนและความพร้อมในการปฏิบัติการ แยกตามสังกัด/พื้นที่</span>
              </h3>
              <p className="text-xs text-slate-500">
                แสดงขีดความสามารถการจัดกำลังพลจริงเทียบกับกรอบอัตราอนุมัติ เพื่อสนับสนุนการปฏิบัติภารกิจความมั่นคง
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2.5 text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#6b8979] border border-[#4e6854] inline-block shadow-xs"></span>
                <span>ระดับพร้อมสมบูรณ์ (≥90%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#b5934a] border border-[#8c7033] inline-block shadow-xs"></span>
                <span>ระดับเฝ้าระวังอัตราว่าง (75–89%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#bc7563] border border-[#9c4927] inline-block shadow-xs"></span>
                <span>ระดับต้องการกำลังพลเสริม (&lt;75%)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bar Chart Rows */}
        <div className="space-y-3.5">
          {/* Axis Scale Markers */}
          <div className="relative h-4 px-2 hidden sm:block text-[10px] font-mono text-slate-400">
            <div className="absolute left-[30%]">0%</div>
            <div className="absolute left-[47.5%]">25%</div>
            <div className="absolute left-[65%]">50%</div>
            <div className="absolute left-[82.5%]">75%</div>
            <div className="absolute right-0 font-bold text-[#2e4d39]">100% (กรอบอัตราเต็ม)</div>
          </div>

          {groupStats.map((item) => {
            const readinessTier =
              item.pct >= 90
                ? {
                    label: 'ความพร้อมระดับสูง',
                    badgeClass: 'bg-[#6b8979]/15 border-[#6b8979]/40 text-[#2e4d39]',
                    barClass: 'bg-gradient-to-r from-[#4e6854] via-[#5d7d65] to-[#6b8979]',
                  }
                : item.pct >= 75
                ? {
                    label: 'เฝ้าระวังอัตราว่าง',
                    badgeClass: 'bg-[#b5934a]/15 border-[#b5934a]/40 text-[#7a5e23]',
                    barClass: 'bg-gradient-to-r from-[#8c7033] via-[#a1823f] to-[#b5934a]',
                  }
                : {
                    label: 'ต้องการกำลังพลเสริม',
                    badgeClass: 'bg-[#bc7563]/15 border-[#bc7563]/40 text-[#823927]',
                    barClass: 'bg-gradient-to-r from-[#9c4927] via-[#b3603d] to-[#bc7563]',
                  };

            return (
              <div
                key={item.group}
                className="bg-slate-50/80 hover:bg-slate-100/90 p-3.5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition space-y-2 group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <ProvinceMiniMap
                      provinceKey={item.provinceKey}
                      size="xs"
                      active={true}
                    />
                    <span className="font-bold text-slate-900 font-['Prompt'] text-sm">
                      {item.group}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${readinessTier.badgeClass}`}>
                      {readinessTier.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-slate-600">
                      ครองคน: <strong className="text-slate-900 font-bold">{item.summary.totalAll_occ.toLocaleString()}</strong> / {item.summary.totalAll_pos.toLocaleString()} นาย
                    </span>
                    <span className="text-[#b04332] font-medium">
                      (ขาด -{item.shortage.toLocaleString()})
                    </span>
                    <span className="text-base font-bold text-slate-900 ml-1">
                      {item.pct.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Meter Track */}
                <div className="relative w-full bg-slate-200/80 rounded-full h-3.5 p-0.5 border border-slate-300/70 overflow-hidden flex items-center">
                  <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-30">
                    <div className="w-px h-full bg-slate-400"></div>
                    <div className="w-px h-full bg-slate-400"></div>
                    <div className="w-px h-full bg-slate-400"></div>
                    <div className="w-px h-full bg-slate-400"></div>
                    <div className="w-px h-full bg-slate-400"></div>
                  </div>

                  <div
                    className={`h-full rounded-full ${readinessTier.barClass} transition-all duration-700 relative shadow-xs`}
                    style={{ width: `${Math.min(100, item.pct)}%` }}
                  >
                    <div className="absolute right-1 top-0 bottom-0 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/90"></span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* 4 Risk Districts in Songkhla Row */}
          <div className="bg-slate-50/80 hover:bg-slate-100/90 p-3.5 rounded-xl border border-slate-200/80 transition space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <ProvinceMiniMap
                  provinceKey="songkhla_risk"
                  size="xs"
                  active={true}
                />
                <span className="font-bold text-slate-900 font-['Prompt'] text-sm">
                  ภ.จว.สงขลา (เฉพาะ 4 อำเภอ 8 สภ. เสี่ยงภัยความมั่นคง)
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded border bg-[#b5934a]/15 border-[#b5934a]/40 text-[#7a5e23]">
                  เฝ้าระวังอัตราว่าง
                </span>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-slate-600">
                  ครองคน: <strong className="text-slate-900 font-bold">{riskOcc.toLocaleString()}</strong> / {riskPos.toLocaleString()} นาย
                </span>
                <span className="text-[#b04332] font-medium">
                  (ขาด -{riskShortage.toLocaleString()})
                </span>
                <span className="text-base font-bold text-slate-900 ml-1">
                  {riskPct.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="relative w-full bg-slate-200/80 rounded-full h-3.5 p-0.5 border border-slate-300/70 overflow-hidden flex items-center">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#8c7033] via-[#a1823f] to-[#b5934a] transition-all duration-700 shadow-xs"
                style={{ width: `${Math.min(100, riskPct)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CHART 2: แผนภูมิแท่งวิเคราะห์ 12 ตำแหน่งหลักตามสายงานยุทธการ */}
      {/* ======================================================== */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#334e68]/10 border border-[#334e68]/30 flex items-center justify-center text-[#334e68] font-bold shadow-xs">
              <Target className="w-4 h-4 text-[#334e68]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Prompt']">
                แผนภูมิแท่งวิเคราะห์ 12 ตำแหน่งหลักตามสายงานบังคับบัญชาและยุทธการ
              </h3>
              <p className="text-xs text-slate-500">
                เปรียบเทียบกรอบอัตรา (POS) กับคนครองจริง (ACT) และสัดส่วนการบรรจุกำลังพลในแต่ละลำดับชั้น
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedPositionCategory('all')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                selectedPositionCategory === 'all'
                  ? 'bg-[#1e2329] text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ทั้งหมด (12 ตำแหน่ง)
            </button>
            <button
              onClick={() => setSelectedPositionCategory('commissioned')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                selectedPositionCategory === 'commissioned'
                  ? 'bg-[#1e2329] text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ชั้นสัญญาบัตร (11)
            </button>
            <button
              onClick={() => setSelectedPositionCategory('nonCommissioned')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                selectedPositionCategory === 'nonCommissioned'
                  ? 'bg-[#1e2329] text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ชั้นประทวน (1)
            </button>
          </div>
        </div>

        {/* Position Rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredPositions.map((pos) => {
            return (
              <div
                key={pos.key}
                className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-sm text-slate-900 font-['Prompt'] flex items-center gap-1.5">
                      <span>{pos.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 font-normal">
                        ({pos.tier})
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono text-slate-900">
                      {pos.occ.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ {pos.pos.toLocaleString()}</span>
                    </div>
                    <div className={`text-[10px] font-mono font-semibold ${pos.shortage > 0 ? 'text-[#b04332]' : 'text-slate-500'}`}>
                      {pos.shortage > 0 ? `ขาด -${pos.shortage}` : 'ครบอัตรา'}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden flex border border-slate-300/60">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pos.pct >= 90
                          ? 'bg-[#6b8979]'
                          : pos.pct >= 75
                          ? 'bg-[#b5934a]'
                          : 'bg-[#bc7563]'
                      }`}
                      style={{ width: `${Math.min(100, pos.pct)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>บรรจุแล้ว {pos.pct.toFixed(1)}%</span>
                    <span>{pos.rankGroup === 'commissioned' ? 'ชั้นสัญญาบัตร' : 'ชั้นประทวน'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* CHART 3 & 4: โครงสร้างสัญญาบัตร vs ประทวน & 4 จังหวัดยุทธศาสตร์ */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tier Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Award className="w-5 h-5 text-blue-900" />
            <h3 className="font-bold text-base text-slate-900 font-['Prompt']">
              แผนภูมิสัดส่วนชั้นสัญญาบัตร vs ชั้นประทวน (โครงสร้างการนำหน่วย)
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Officers */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
              <div className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                <span>ชั้นสัญญาบัตร (Officers)</span>
                <span className="text-[10px] font-mono text-[#334e68] font-bold">ผบก. - รอง สว.</span>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">
                {totalCommOcc.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-500">/ {totalCommPos.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-300/60">
                <div
                  className="h-full bg-[#334e68] rounded-full"
                  style={{ width: `${Math.min(100, commPct)}%` }}
                ></div>
              </div>
              <div className="text-xs text-slate-600 font-mono flex justify-between">
                <span>อัตราครองคน {commPct.toFixed(1)}%</span>
                <span className="text-[#b04332] font-medium">ขาด -{totalCommPos - totalCommOcc}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                สัดส่วน {totalOcc > 0 ? ((totalCommOcc / totalOcc) * 100).toFixed(1) : 0}% ของกำลังพลครองจริง
              </div>
            </div>

            {/* NCOs */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
              <div className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                <span>ชั้นประทวน (NCOs)</span>
                <span className="text-[10px] font-mono text-[#4e6854] font-bold">ผบ.หมู่ & อื่นๆ</span>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">
                {totalNonCommOcc.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-500">/ {totalNonCommPos.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-300/60">
                <div
                  className="h-full bg-[#6b8979] rounded-full"
                  style={{ width: `${Math.min(100, nonCommPct)}%` }}
                ></div>
              </div>
              <div className="text-xs text-slate-600 font-mono flex justify-between">
                <span>อัตราครองคน {nonCommPct.toFixed(1)}%</span>
                <span className="text-[#b04332] font-medium">ขาด -{totalNonCommPos - totalNonCommOcc}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                สัดส่วน {totalOcc > 0 ? ((totalNonCommOcc / totalOcc) * 100).toFixed(1) : 0}% ของกำลังพลครองจริง
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed font-sans">
            💡 <strong>ภารกิจการปฏิบัติงาน:</strong> ชั้นสัญญาบัตรทำหน้าที่ผู้นำยุทธวิธี วางแผนงานการข่าว และอำนวยการงานสอบสวนคดีความมั่นคง | ชั้นประทวนทำหน้าที่ชุดสายตรวจ ลาดตระเวนภาคสนาม และประสานความสัมพันธ์กับประชาชนในพื้นที่
          </div>
        </div>

        {/* 4 Strategic Security Zones Matrix */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Compass className="w-5 h-5 text-[#334e68]" />
            <h3 className="font-bold text-base text-slate-900 font-['Prompt']">
              มิติความพร้อมรบและภารกิจ 4 จังหวัดพื้นที่ความมั่นคง ภ.9
            </h3>
          </div>

          <div className="space-y-3">
            {strategicZones.map((zone) => {
              const zoneShortage = zone.pos - zone.occ;
              const zonePct = zone.pos > 0 ? (zone.occ / zone.pos) * 100 : 0;
              return (
                <div
                  key={zone.id}
                  className="bg-slate-50/80 hover:bg-slate-100/90 p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1.5 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-slate-900 font-['Prompt'] flex items-center gap-2">
                      <ProvinceMiniMap provinceKey={zone.id as any} size="xs" active={true} />
                      <span>{zone.name}</span>
                    </div>
                    <div className="font-mono text-xs text-right">
                      <span className="font-bold text-slate-900">{zone.occ.toLocaleString()}</span>
                      <span className="text-slate-500"> / {zone.pos.toLocaleString()} นาย</span>
                      <span className="ml-2 font-bold text-[#2e4d39]">({zonePct.toFixed(1)}%)</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 leading-tight">
                    {zone.description}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/80">
                    <span className="truncate pr-2">ภารกิจ: {zone.tacticalFocus}</span>
                    <span className="text-[#b04332] font-medium whitespace-nowrap">
                      {zone.redCount} สภ. จุดเฝ้าระวัง
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CHART 5: 10 อันดับหน่วยงานที่มีตำแหน่งขาดแคลนมากที่สุด */}
      {/* ======================================================== */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[#b04332]" />
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Prompt']">
                10 อันดับสถานี/หน่วยงานที่มีอัตราขาดแคลนกำลังพลสูงสุด
              </h3>
              <p className="text-xs text-slate-500">
                สถานีตำรวจที่ต้องการการสนับสนุนอัตรากำลังพลเพื่อรักษาความพร้อมและความสงบสุขของประชาชน
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1e2329] text-white border-b-2 border-[#b5934a]">
                <th className="py-2.5 px-3 font-bold rounded-tl-lg">อันดับ / หน่วยงาน</th>
                <th className="py-2.5 px-3 text-center font-bold">สังกัด</th>
                <th className="py-2.5 px-3 text-center font-bold">ตำแหน่ง (POS)</th>
                <th className="py-2.5 px-3 text-center font-bold">คนครอง (ACT)</th>
                <th className="py-2.5 px-3 text-center font-bold text-[#bc7563]">ขาดแคลน</th>
                <th className="py-2.5 px-3 text-center font-bold">ความพร้อม (%)</th>
                <th className="py-2.5 px-3 text-center font-bold rounded-tr-lg">การตรวจสอบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topShortageStations.map((r, i) => (
                <tr
                  key={r.id}
                  className="hover:bg-slate-50/80 transition group cursor-pointer"
                  onClick={() => {
                    if (onSelectUnitRoster) onSelectUnitRoster(r);
                  }}
                >
                  <td className="py-2 px-3 font-medium text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-mono text-[10px] flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    <span className="group-hover:text-slate-900 font-medium transition">{r.name}</span>
                    {r.isRiskAreaSongkhla && (
                      <span className="text-[9px] bg-[#10442a]/10 border border-[#10442a]/30 text-[#10442a] px-1.5 py-0.5 rounded font-medium">
                        4 อ.เสี่ยงภัย
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-center text-slate-600">{r.group}</td>
                  <td className="py-2 px-3 text-center font-mono text-slate-700">{r.totalAll_pos}</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-[#2e4d39]">{r.totalAll_occ}</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-[#b04332]">
                    -{r.shortage} นาย
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className="font-mono text-xs text-slate-800 font-bold">
                      {r.pct.toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectUnitRoster) onSelectUnitRoster(r);
                      }}
                      className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-2.5 py-1 rounded transition flex items-center justify-center gap-1 mx-auto font-medium"
                    >
                      <span>ดูตัวคน</span>
                      <ExternalLink className="w-3 h-3 text-slate-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
