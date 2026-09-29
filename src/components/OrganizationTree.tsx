import React, { useState } from 'react';
import { Shield, Building2, MapPin, ChevronRight, Users, UserCheck, TableProperties } from 'lucide-react';
import { PoliceUnitRecord, ZoneId } from '../types';
import { computeGroupSummary } from '../data/initialData';
import { ProvinceMiniMap } from './ProvinceMiniMap';
import { ProvinceSummaryCard } from './ProvinceSummaryCard';
import { TerroristIncidentsModal } from './TerroristIncidentsModal';

interface OrgTreeProps {
  records: PoliceUnitRecord[];
  onNavigateToZone?: (zoneId: ZoneId, unitName?: string) => void;
  onSelectUnitRoster?: (unit: PoliceUnitRecord) => void;
}

export const OrganizationTree: React.FC<OrgTreeProps> = ({
  records,
  onNavigateToZone,
  onSelectUnitRoster,
}) => {
  const [activeTerroristIncidentsProvince, setActiveTerroristIncidentsProvince] = useState<string | null>(null);
  // Group calculations
  const yalaSum = computeGroupSummary('ภ.จว.ยะลา', records);
  const ptnSum = computeGroupSummary('ภ.จว.ปัตตานี', records);
  const nrtSum = computeGroupSummary('ภ.จว.นราธิวาส', records);
  const jctSum = computeGroupSummary('บก.สืบสวนสอบสวน จชต.', records);
  const sfrSum = computeGroupSummary('ศฝร.ภ.9', records);

  // 4 Risk districts Songkhla: นาทวี, เทพา, สะบ้าย้อย, จะนะ
  const songkhlaRiskRecords = records.filter(r => r.group === 'ภ.จว.สงขลา' && r.isRiskAreaSongkhla);
  const songkhlaRiskPos = songkhlaRiskRecords.reduce((acc, r) => acc + r.totalAll_pos, 0);
  const songkhlaRiskOcc = songkhlaRiskRecords.reduce((acc, r) => acc + r.totalAll_occ, 0);

  // Grand total for the chart
  const grandPos = records.reduce((acc, r) => acc + r.totalAll_pos, 0);
  const grandOcc = records.reduce((acc, r) => acc + r.totalAll_occ, 0);

  // Split into Admin & Support vs Police Stations (สภ.)
  const getYalaBreakdown = () => {
    const admin = records.filter(r => r.group === 'ภ.จว.ยะลา' && (r.name.includes('ภ.จว.') || r.name.includes('ฝ่ายอำนวยการ') || r.name.includes('ปฏิบัติการพิเศษ') || r.name.includes('สืบสวน') || r.name.includes('กลุ่มงานสอบสวน')));
    const sp = records.filter(r => r.group === 'ภ.จว.ยะลา' && r.name.startsWith('สภ.'));
    const adminPos = admin.reduce((s, r) => s + r.totalAll_pos, 0);
    const adminOcc = admin.reduce((s, r) => s + r.totalAll_occ, 0);
    const spPos = sp.reduce((s, r) => s + r.totalAll_pos, 0);
    const spOcc = sp.reduce((s, r) => s + r.totalAll_occ, 0);
    return { admin, sp, adminPos, adminOcc, spPos, spOcc };
  };

  const getPattaniBreakdown = () => {
    const admin = records.filter(r => r.group === 'ภ.จว.ปัตตานี' && (r.name.includes('ภ.จว.') || r.name.includes('ฝ่ายอำนวยการ') || r.name.includes('ปฏิบัติการพิเศษ') || r.name.includes('สืบสวน') || r.name.includes('กลุ่มงานสอบสวน')));
    const sp = records.filter(r => r.group === 'ภ.จว.ปัตตานี' && r.name.startsWith('สภ.'));
    const adminPos = admin.reduce((s, r) => s + r.totalAll_pos, 0);
    const adminOcc = admin.reduce((s, r) => s + r.totalAll_occ, 0);
    const spPos = sp.reduce((s, r) => s + r.totalAll_pos, 0);
    const spOcc = sp.reduce((s, r) => s + r.totalAll_occ, 0);
    return { admin, sp, adminPos, adminOcc, spPos, spOcc };
  };

  const getNarathiwatBreakdown = () => {
    const admin = records.filter(r => r.group === 'ภ.จว.นราธิวาส' && (r.name.includes('ภ.จว.') || r.name.includes('ฝ่ายอำนวยการ') || r.name.includes('ปฏิบัติการพิเศษ') || r.name.includes('สืบสวน') || r.name.includes('กลุ่มงานสอบสวน')));
    const sp = records.filter(r => r.group === 'ภ.จว.นราธิวาส' && r.name.startsWith('สภ.'));
    const adminPos = admin.reduce((s, r) => s + r.totalAll_pos, 0);
    const adminOcc = admin.reduce((s, r) => s + r.totalAll_occ, 0);
    const spPos = sp.reduce((s, r) => s + r.totalAll_pos, 0);
    const spOcc = sp.reduce((s, r) => s + r.totalAll_occ, 0);
    return { admin, sp, adminPos, adminOcc, spPos, spOcc };
  };

  const yalaBreakdown = getYalaBreakdown();
  const pattaniBreakdown = getPattaniBreakdown();
  const narathiwatBreakdown = getNarathiwatBreakdown();

  const handleUnitClick = (unit: PoliceUnitRecord) => {
    if (onSelectUnitRoster) {
      onSelectUnitRoster(unit);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Info */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0a1220] to-[#121c2e] p-6 rounded-2xl border border-slate-700/80 shadow-2xl text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sky-400 text-xs font-semibold tracking-wider uppercase mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span>แผนผังโครงสร้างกำลังพลและ 4 สายงานพื้นที่ความมั่นคง</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Prompt'] text-white">
              โครงสร้างกำลังพลตำรวจภูธรภาค 9 ในพื้นที่ 3 จว.ชายแดนใต้ และ 4 อำเภอ จว.สงขลา
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              สามารถคลิกที่ปุ่ม <span className="text-sky-300 font-semibold">"ตารางตัวคน"</span> เพื่อเข้าถึงข้อมูลสถานภาพกำลังพลของพื้นที่นั้นได้ทันที
            </p>
          </div>
        </div>
      </div>

      {/* Organizational Hierarchy Chart (Matching Reference Image) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md text-slate-800 overflow-x-auto">
        <div className="min-w-[1040px] flex flex-col items-center">
          {/* Level 0: สำนักงานตำรวจแห่งชาติ (ตร.) */}
          <div className="flex flex-col items-center mb-4">
            <div
              className="px-8 py-3.5 rounded-2xl shadow-xl border-2 border-amber-400/90 flex items-center justify-center gap-2.5 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
              style={{
                background: 'linear-gradient(135deg, #4f1419 0%, #631922 45%, #380d12 100%)',
                boxShadow: '0 8px 24px -4px rgba(79, 20, 25, 0.4), 0 0 0 1px rgba(245, 158, 11, 0.3)',
              }}
            >
              <div className="gold-light-ray"></div>
              <Shield className="w-5 h-5 text-amber-300 drop-shadow flex-shrink-0" />
              <span className="font-bold text-lg sm:text-xl tracking-wider font-['Prompt'] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                สำนักงานตำรวจแห่งชาติ (ตร.)
              </span>
            </div>
            <div className="w-0.5 h-6 bg-slate-400"></div>
          </div>

          {/* Level 1: ภ.9 Main Node */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-[#334e68] text-white px-8 py-3.5 rounded-xl shadow-md flex flex-col items-center">
              <div className="font-bold text-lg font-['Prompt'] text-white">
                ตำรวจภูธรภาค 9
              </div>
              <div className="text-xs font-mono font-bold text-slate-100 bg-[#243b53]/90 px-3 py-1 rounded-full mt-1 border border-white/20">
                [รวม: {grandPos.toLocaleString()} / {grandOcc.toLocaleString()}]
              </div>
            </div>
            <div className="w-0.5 h-6 bg-slate-400"></div>
          </div>

          {/* Branch Connector Bar */}
          <div className="w-full flex justify-between px-16 relative">
            <div className="absolute top-0 left-16 right-16 h-0.5 bg-slate-400"></div>
          </div>

          {/* Level 2: 4 Main Branches / 4 Functions */}
          <div className="grid grid-cols-4 gap-4 w-full mt-6">
            {/* Branch 1: 1. จังหวัดยะลา */}
            <div className="flex flex-col items-center space-y-3">
              <ProvinceSummaryCard
                provinceKey="yala"
                zoneId="yala"
                title="ยะลา"
                badgeTitle="ยะลา"
                subtitle="ตรวจสอบสถานภาพ ยะลา"
                posCount={yalaSum.totalAll_pos + jctSum.totalAll_pos + sfrSum.totalAll_pos}
                occCount={yalaSum.totalAll_occ + jctSum.totalAll_occ + sfrSum.totalAll_occ}
                onNavigate={onNavigateToZone}
              />

              {/* Sub-cards */}
              <div className="grid grid-cols-3 gap-1.5 w-full text-[11px]">
                <div
                  onClick={() => onNavigateToZone && onNavigateToZone('yala')}
                  className="bg-[#545946] border border-[#444837] text-white p-1.5 rounded-lg text-center shadow-xs cursor-pointer hover:opacity-90 transition"
                  title="คลิกเพื่อดูตาราง บก.สส.จชต."
                >
                  <div className="font-bold leading-tight">บก.สส.จชต.</div>
                  <div className="text-[10px] text-amber-100 font-mono">[{jctSum.totalAll_pos}/{jctSum.totalAll_occ}]</div>
                </div>
                <div
                  onClick={() => onNavigateToZone && onNavigateToZone('yala')}
                  className="bg-white border border-slate-300 text-slate-800 p-1.5 rounded-lg text-center shadow-xs cursor-pointer hover:bg-slate-50 transition"
                  title="คลิกเพื่อดูตาราง ภ.จว.ยะลา"
                >
                  <div className="font-bold leading-tight">ภ.จว.ยะลา</div>
                  <div className="text-[10px] text-slate-500 font-mono">[{yalaSum.totalAll_pos}/{yalaSum.totalAll_occ}]</div>
                </div>
                <div
                  onClick={() => onNavigateToZone && onNavigateToZone('yala')}
                  className="bg-[#3e5647] border border-[#2f4236] text-white p-1.5 rounded-lg text-center shadow-xs cursor-pointer hover:opacity-90 transition"
                  title="คลิกเพื่อดูตาราง ศฝร.ภ.9"
                >
                  <div className="font-bold leading-tight">ศฝร.ภ.9</div>
                  <div className="text-[10px] text-emerald-100 font-mono">[{sfrSum.totalAll_pos}/{sfrSum.totalAll_occ}]</div>
                </div>
              </div>

              {/* Breakdown: หน่วยอำนวยการ vs สภ. */}
              <div className="grid grid-cols-2 gap-2 w-full">
                <div className="bg-[#b35e38] text-white p-2.5 rounded-xl shadow-xs text-xs border border-[#9c4f2d]">
                  <div className="font-bold border-b border-white/30 pb-1 mb-1.5 text-center text-white">
                    หน่วยอำนวยการ<br />และสนับสนุน
                    <div className="text-[10px] text-orange-100 font-mono">[{yalaBreakdown.adminPos}/{yalaBreakdown.adminOcc}]</div>
                  </div>
                  <ul className="space-y-1 text-[11px] text-white">
                    {yalaBreakdown.admin.slice(0, 5).map((u) => (
                      <li
                        key={u.id}
                        onClick={() => handleUnitClick(u)}
                        className="truncate cursor-pointer hover:underline"
                        title="คลิกดูตัวคนในหน่วยนี้"
                      >
                        • {u.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#4e6854] text-white p-2.5 rounded-xl shadow-xs text-xs border border-[#3e5343]">
                  <div className="font-bold border-b border-white/30 pb-1 mb-1.5 text-center text-white">
                    สภ. ({yalaBreakdown.sp.length} แห่ง)
                    <div className="text-[10px] text-emerald-100 font-mono">[{yalaBreakdown.spPos}/{yalaBreakdown.spOcc}]</div>
                  </div>
                  <ul className="space-y-1 text-[11px] text-white max-h-48 overflow-y-auto">
                    {yalaBreakdown.sp.map((u) => (
                      <li
                        key={u.id}
                        onClick={() => handleUnitClick(u)}
                        className="truncate cursor-pointer hover:underline"
                        title="คลิกดูตัวคนใน สภ. นี้"
                      >
                        • {u.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Branch 2: 2. จังหวัดปัตตานี */}
            <div className="flex flex-col items-center space-y-3">
              <ProvinceSummaryCard
                provinceKey="pattani"
                zoneId="pattani"
                title="ปัตตานี"
                badgeTitle="ปัตตานี"
                subtitle="ตรวจสอบสถานภาพ ปัตตานี"
                posCount={ptnSum.totalAll_pos}
                occCount={ptnSum.totalAll_occ}
                onNavigate={onNavigateToZone}
              />

              <div
                onClick={() => onNavigateToZone && onNavigateToZone('pattani')}
                className="w-full bg-white border border-slate-300 text-slate-800 p-2 rounded-lg text-center shadow-xs cursor-pointer hover:bg-slate-50 transition"
              >
                <div className="font-bold text-xs text-slate-800">ภ.จว.ปัตตานี (21 หน่วย)</div>
                <div className="text-[11px] text-slate-500 font-mono">[{ptnSum.totalAll_pos}/{ptnSum.totalAll_occ}]</div>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full">
                <div className="bg-[#b35e38] text-white p-2.5 rounded-xl shadow-xs text-xs border border-[#9c4f2d]">
                  <div className="font-bold border-b border-white/30 pb-1 mb-1.5 text-center text-white">
                    หน่วยอำนวยการ<br />และสนับสนุน
                    <div className="text-[10px] text-orange-100 font-mono">[{pattaniBreakdown.adminPos}/{pattaniBreakdown.adminOcc}]</div>
                  </div>
                  <ul className="space-y-1 text-[11px] text-white">
                    {pattaniBreakdown.admin.map((u) => (
                      <li
                        key={u.id}
                        onClick={() => handleUnitClick(u)}
                        className="truncate cursor-pointer hover:underline"
                        title="คลิกดูตัวคนในหน่วยนี้"
                      >
                        • {u.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#8f5132] text-white p-2.5 rounded-xl shadow-xs text-xs border border-[#794328]">
                  <div className="font-bold border-b border-white/30 pb-1 mb-1.5 text-center text-white">
                    สภ. ({pattaniBreakdown.sp.length} แห่ง)
                    <div className="text-[10px] text-amber-100 font-mono">[{pattaniBreakdown.spPos}/{pattaniBreakdown.spOcc}]</div>
                  </div>
                  <ul className="space-y-1 text-[11px] text-white max-h-48 overflow-y-auto">
                    {pattaniBreakdown.sp.map((u) => (
                      <li
                        key={u.id}
                        onClick={() => handleUnitClick(u)}
                        className="truncate cursor-pointer hover:underline"
                        title="คลิกดูตัวคนใน สภ. นี้"
                      >
                        • {u.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Branch 3: 3. จังหวัดนราธิวาส */}
            <div className="flex flex-col items-center space-y-3">
              <ProvinceSummaryCard
                provinceKey="narathiwat"
                zoneId="narathiwat"
                title="นราธิวาส"
                badgeTitle="นราธิวาส"
                subtitle="ตรวจสอบสถานภาพ นราธิวาส"
                posCount={nrtSum.totalAll_pos}
                occCount={nrtSum.totalAll_occ}
                onNavigate={onNavigateToZone}
              />

              <div
                onClick={() => onNavigateToZone && onNavigateToZone('narathiwat')}
                className="w-full bg-white border border-slate-300 text-slate-800 p-2 rounded-lg text-center shadow-xs cursor-pointer hover:bg-slate-50 transition"
              >
                <div className="font-bold text-xs text-slate-800">ภ.จว.นราธิวาส (24 หน่วย)</div>
                <div className="text-[11px] text-slate-500 font-mono">[{nrtSum.totalAll_pos}/{nrtSum.totalAll_occ}]</div>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full">
                <div className="bg-[#4e6854] text-white p-2.5 rounded-xl shadow-xs text-xs border border-[#3e5343]">
                  <div className="font-bold border-b border-white/30 pb-1 mb-1.5 text-center text-white">
                    หน่วยอำนวยการ<br />และสนับสนุน
                    <div className="text-[10px] text-emerald-100 font-mono">[{narathiwatBreakdown.adminPos}/{narathiwatBreakdown.adminOcc}]</div>
                  </div>
                  <ul className="space-y-1 text-[11px] text-white">
                    {narathiwatBreakdown.admin.map((u) => (
                      <li
                        key={u.id}
                        onClick={() => handleUnitClick(u)}
                        className="truncate cursor-pointer hover:underline"
                        title="คลิกดูตัวคนในหน่วยนี้"
                      >
                        • {u.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#354f3d] text-white p-2.5 rounded-xl shadow-xs text-xs border border-[#273a2d]">
                  <div className="font-bold border-b border-white/30 pb-1 mb-1.5 text-center text-white">
                    สภ. ({narathiwatBreakdown.sp.length} แห่ง)
                    <div className="text-[10px] text-emerald-100 font-mono">[{narathiwatBreakdown.spPos}/{narathiwatBreakdown.spOcc}]</div>
                  </div>
                  <ul className="space-y-1 text-[11px] text-white max-h-48 overflow-y-auto">
                    {narathiwatBreakdown.sp.map((u) => (
                      <li
                        key={u.id}
                        onClick={() => handleUnitClick(u)}
                        className="truncate cursor-pointer hover:underline"
                        title="คลิกดูตัวคนใน สภ. นี้"
                      >
                        • {u.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Branch 4: 4. พื้นที่เสี่ยงภัย จว.สงขลา */}
            <div className="flex flex-col items-center space-y-3">
              <ProvinceSummaryCard
                provinceKey="songkhla"
                zoneId="songkhla_risk"
                title="สงขลา"
                badgeTitle="สงขลา"
                subtitle="ตรวจสอบสถานภาพสงขลา"
                posCount={songkhlaRiskPos}
                occCount={songkhlaRiskOcc}
                onNavigate={onNavigateToZone}
              />

              <div
                onClick={() => onNavigateToZone && onNavigateToZone('songkhla_risk')}
                className="w-full bg-white border border-slate-300 text-slate-800 p-2 rounded-lg text-center shadow-xs cursor-pointer hover:bg-slate-50 transition"
              >
                <div className="font-bold text-xs text-slate-800">ภ.จว.สงขลา (เฉพาะ 4 อำเภอ 8 สภ.)</div>
                <div className="text-[11px] font-mono font-bold text-slate-600">
                  [{songkhlaRiskPos}/{songkhlaRiskOcc}]
                </div>
              </div>

              {/* 4 Districts sub-grid */}
              <div className="grid grid-cols-2 gap-2 w-full">
                <div className="bg-[#546a7b] text-white p-2.5 rounded-xl shadow-xs text-xs border border-[#445664]">
                  <div className="font-bold text-center border-b border-white/30 pb-1 mb-1 text-white">
                    อ.นาทวี
                  </div>
                  <ul className="text-[11px] space-y-1 text-white">
                    <li
                      onClick={() => {
                        const u = records.find(r => r.name.includes('สภ.นาทวี'));
                        if (u) handleUnitClick(u);
                      }}
                      className="cursor-pointer hover:underline"
                    >
                      • สภ.นาทวี
                    </li>
                    <li
                      onClick={() => {
                        const u = records.find(r => r.name.includes('สภ.สะท้อน'));
                        if (u) handleUnitClick(u);
                      }}
                      className="cursor-pointer hover:underline"
                    >
                      • สภ.สะท้อน
                    </li>
                  </ul>
                </div>

                <div className="bg-[#6c867b] text-white p-2.5 rounded-xl shadow-xs text-xs border border-[#587066]">
                  <div className="font-bold text-center border-b border-white/30 pb-1 mb-1 text-white">
                    อ.เทพา
                  </div>
                  <ul className="text-[11px] space-y-1 text-white">
                    <li
                      onClick={() => {
                        const u = records.find(r => r.name.includes('สภ.เทพา'));
                        if (u) handleUnitClick(u);
                      }}
                      className="cursor-pointer hover:underline"
                    >
                      • สภ.เทพา
                    </li>
                    <li
                      onClick={() => {
                        const u = records.find(r => r.name.includes('สภ.ห้วยปลิง'));
                        if (u) handleUnitClick(u);
                      }}
                      className="cursor-pointer hover:underline"
                    >
                      • สภ.ห้วยปลิง
                    </li>
                  </ul>
                </div>

                <div className="bg-[#4f6b64] text-white p-2.5 rounded-xl shadow-xs text-xs border border-[#3e5650]">
                  <div className="font-bold text-center border-b border-white/30 pb-1 mb-1 text-white">
                    อ.สะบ้าย้อย
                  </div>
                  <ul className="text-[11px] space-y-1 text-white">
                    <li
                      onClick={() => {
                        const u = records.find(r => r.name.includes('สภ.สะบ้าย้อย'));
                        if (u) handleUnitClick(u);
                      }}
                      className="cursor-pointer hover:underline"
                    >
                      • สภ.สะบ้าย้อย
                    </li>
                    <li
                      onClick={() => {
                        const u = records.find(r => r.name.includes('สภ.บ้านโหนด'));
                        if (u) handleUnitClick(u);
                      }}
                      className="cursor-pointer hover:underline"
                    >
                      • สภ.บ้านโหนด
                    </li>
                  </ul>
                </div>

                <div className="bg-[#3d443e] text-white p-2.5 rounded-xl shadow-xs text-xs border border-[#2f3530]">
                  <div className="font-bold text-center border-b border-white/30 pb-1 mb-1 text-white">
                    อ.จะนะ
                  </div>
                  <ul className="text-[11px] space-y-1 text-white">
                    <li
                      onClick={() => {
                        const u = records.find(r => r.name.includes('สภ.จะนะ'));
                        if (u) handleUnitClick(u);
                      }}
                      className="cursor-pointer hover:underline"
                    >
                      • สภ.จะนะ
                    </li>
                    <li
                      onClick={() => {
                        const u = records.find(r => r.name.includes('สภ.ควนมีด'));
                        if (u) handleUnitClick(u);
                      }}
                      className="cursor-pointer hover:underline"
                    >
                      • สภ.ควนมีด
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Table directly matching the Infographic's bottom right table (Dignified Patriotic Theme) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-slate-800">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900 font-bold shadow-xs">
              📊
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Prompt']">
                ตารางสรุปยอดรวมกำลังพลแยกตามหน่วยงานหลัก (คลิกแถวเพื่อดูตารางสถานภาพตัวคน)
              </h3>
              <p className="text-xs text-slate-500">เปรียบเทียบอัตราตำแหน่งและจำนวนคนครองจริง พร้อมอัตราความพร้อมในการปฏิบัติหน้าที่</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="text-white">
                <th className="px-4 py-2.5 text-left font-bold rounded-tl-lg bg-[#1e2329]">หน่วยงานหลัก / พื้นที่</th>
                <th className="px-4 py-2.5 text-center font-bold bg-[#b5934a]">อัตราตำแหน่ง</th>
                <th className="px-4 py-2.5 text-center font-bold bg-[#6b8979]">คนครอง (ตัวคนจริง)</th>
                <th className="px-4 py-2.5 text-center font-bold bg-[#b3603d]">อัตราการครองคน (%)</th>
                <th className="px-4 py-2.5 text-center font-bold bg-[#bc7563]">ขาดแคลน (นาย)</th>
                <th className="px-4 py-2.5 text-center font-bold bg-[#454747] rounded-tr-lg">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr
                onClick={() => onNavigateToZone && onNavigateToZone('yala')}
                className="hover:bg-slate-50/80 cursor-pointer transition"
              >
                <td className="px-4 py-2.5 font-medium text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8c8269]"></span>
                  <span>ภ.จว.ยะลา (รวม จว.ยะลา)</span>
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-slate-700">{yalaSum.totalAll_pos.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono font-bold text-[#2e4d39]">{yalaSum.totalAll_occ.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono text-[#9c4927] font-bold">
                  {yalaSum.totalAll_pos > 0 ? ((yalaSum.totalAll_occ / yalaSum.totalAll_pos) * 100).toFixed(1) : 0}%
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-[#b04332] font-semibold">
                  -{(yalaSum.totalAll_pos - yalaSum.totalAll_occ).toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className="text-xs text-slate-600 font-medium hover:text-slate-900 hover:underline">เปิดตารางตัวคน →</span>
                </td>
              </tr>
              <tr
                onClick={() => onNavigateToZone && onNavigateToZone('yala')}
                className="hover:bg-slate-50/80 cursor-pointer transition"
              >
                <td className="px-4 py-2.5 font-medium text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#545946]"></span>
                  <span>บก.สส.จชต.</span>
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-slate-700">{jctSum.totalAll_pos.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono font-bold text-[#2e4d39]">{jctSum.totalAll_occ.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono text-[#9c4927] font-bold">
                  {jctSum.totalAll_pos > 0 ? ((jctSum.totalAll_occ / jctSum.totalAll_pos) * 100).toFixed(1) : 0}%
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-[#b04332] font-semibold">
                  -{(jctSum.totalAll_pos - jctSum.totalAll_occ).toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className="text-xs text-slate-600 font-medium hover:text-slate-900 hover:underline">เปิดตารางตัวคน →</span>
                </td>
              </tr>
              <tr
                onClick={() => onNavigateToZone && onNavigateToZone('yala')}
                className="hover:bg-slate-50/80 cursor-pointer transition"
              >
                <td className="px-4 py-2.5 font-medium text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3e5647]"></span>
                  <span>ศฝร.ภ.9</span>
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-slate-700">{sfrSum.totalAll_pos.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono font-bold text-[#2e4d39]">{sfrSum.totalAll_occ.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono text-[#9c4927] font-bold">
                  {sfrSum.totalAll_pos > 0 ? ((sfrSum.totalAll_occ / sfrSum.totalAll_pos) * 100).toFixed(1) : 0}%
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-[#b04332] font-semibold">
                  -{(sfrSum.totalAll_pos - sfrSum.totalAll_occ).toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className="text-xs text-slate-600 font-medium hover:text-slate-900 hover:underline">เปิดตารางตัวคน →</span>
                </td>
              </tr>
              <tr
                onClick={() => onNavigateToZone && onNavigateToZone('pattani')}
                className="hover:bg-slate-50/80 cursor-pointer transition"
              >
                <td className="px-4 py-2.5 font-medium text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8f5132]"></span>
                  <span>ภ.จว.ปัตตานี (จว.ปัตตานี)</span>
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-slate-700">{ptnSum.totalAll_pos.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono font-bold text-[#2e4d39]">{ptnSum.totalAll_occ.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono text-[#9c4927] font-bold">
                  {ptnSum.totalAll_pos > 0 ? ((ptnSum.totalAll_occ / ptnSum.totalAll_pos) * 100).toFixed(1) : 0}%
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-[#b04332] font-semibold">
                  -{(ptnSum.totalAll_pos - ptnSum.totalAll_occ).toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className="text-xs text-slate-600 font-medium hover:text-slate-900 hover:underline">เปิดตารางตัวคน →</span>
                </td>
              </tr>
              <tr
                onClick={() => onNavigateToZone && onNavigateToZone('narathiwat')}
                className="hover:bg-slate-50/80 cursor-pointer transition"
              >
                <td className="px-4 py-2.5 font-medium text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#354f3d]"></span>
                  <span>ภ.จว.นราธิวาส (จว.นราธิวาส)</span>
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-slate-700">{nrtSum.totalAll_pos.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono font-bold text-[#2e4d39]">{nrtSum.totalAll_occ.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono text-[#9c4927] font-bold">
                  {nrtSum.totalAll_pos > 0 ? ((nrtSum.totalAll_occ / nrtSum.totalAll_pos) * 100).toFixed(1) : 0}%
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-[#b04332] font-semibold">
                  -{(nrtSum.totalAll_pos - nrtSum.totalAll_occ).toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className="text-xs text-slate-600 font-medium hover:text-slate-900 hover:underline">เปิดตารางตัวคน →</span>
                </td>
              </tr>
              <tr
                onClick={() => onNavigateToZone && onNavigateToZone('songkhla_risk')}
                className="hover:bg-slate-50/80 cursor-pointer transition"
              >
                <td className="px-4 py-2.5 font-medium text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10442a]"></span>
                  <span>ภ.จว.สงขลา (เฉพาะ 4 อำเภอ 8 สภ. เสี่ยงภัย)</span>
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-slate-700">{songkhlaRiskPos.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono font-bold text-[#2e4d39]">{songkhlaRiskOcc.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono text-[#9c4927] font-bold">
                  {songkhlaRiskPos > 0 ? ((songkhlaRiskOcc / songkhlaRiskPos) * 100).toFixed(1) : 0}%
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-[#b04332] font-semibold">
                  -{(songkhlaRiskPos - songkhlaRiskOcc).toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className="text-xs text-slate-600 font-medium hover:text-slate-900 hover:underline">เปิดตารางตัวคน →</span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="text-white font-extrabold text-sm">
                <td className="px-4 py-3 rounded-bl-lg bg-[#1e2329]">ยอดรวมทั้งสิ้น (4 สายงานยุทธการ)</td>
                <td className="px-4 py-3 text-center font-mono bg-[#b5934a] text-white">
                  {grandPos.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center font-mono bg-[#6b8979] text-white">
                  {grandOcc.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center font-mono bg-[#b3603d] text-white">
                  {grandPos > 0 ? ((grandOcc / grandPos) * 100).toFixed(1) : 0}%
                </td>
                <td className="px-4 py-3 text-center font-mono bg-[#bc7563] text-white">
                  -{(grandPos - grandOcc).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center text-xs bg-[#454747] rounded-br-lg font-normal text-white">
                  4 ฟังก์ชันพื้นที่
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

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
          if (found && onSelectUnitRoster) {
            onSelectUnitRoster(found);
          }
        }}
      />
    </div>
  );
};
