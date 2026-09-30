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

      {/* Organizational Hierarchy Chart (Royal Thai Police Official Command Briefing Board) */}
      <div className="bg-gradient-to-b from-[#0b1626] via-[#102037] to-[#091322] border-2 border-[#b88c54]/70 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 overflow-x-auto relative">
        {/* Dignified Royal Thai Police Watermark & Inner Border */}
        <div className="absolute inset-0 rounded-3xl border border-[#b88c54]/20 pointer-events-none" />

        <div className="min-w-[1040px] flex flex-col items-center relative z-10">
          {/* Level 0: สำนักงานตำรวจแห่งชาติ (ตร.) */}
          <div className="flex flex-col items-center mb-4">
            <div
              className="px-8 py-3.5 rounded-2xl shadow-xl border-2 border-[#d4af37] flex items-center justify-center gap-2.5 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300"
              style={{
                background: 'linear-gradient(135deg, #4f1419 0%, #631922 45%, #380d12 100%)',
                boxShadow: '0 8px 24px -4px rgba(79, 20, 25, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.4)',
              }}
            >
              <div className="gold-light-ray"></div>
              <Shield className="w-5 h-5 text-amber-300 drop-shadow flex-shrink-0" />
              <span className="font-bold text-lg sm:text-xl tracking-wider font-['Prompt'] text-[#fff7ed] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                สำนักงานตำรวจแห่งชาติ (ตร.)
              </span>
            </div>
            <div className="w-1 h-6 bg-gradient-to-b from-[#d4af37] to-[#b88c54] rounded-full"></div>
          </div>

          {/* Level 1: ภ.9 Main Node */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-gradient-to-r from-[#102238] via-[#183152] to-[#0d1c2e] text-white px-9 py-4 rounded-2xl shadow-xl border-2 border-[#b88c54] flex flex-col items-center hover:scale-[1.01] transition-transform">
              <div className="font-bold text-lg sm:text-xl font-['Prompt'] text-[#faebd7] tracking-wide flex items-center gap-2.5">
                <span className="text-amber-400 text-sm">★</span>
                <span>ตำรวจภูธรภาค 9</span>
                <span className="text-amber-400 text-sm">★</span>
              </div>
              <div className="text-xs font-mono font-bold text-[#faebd7] bg-[#091422] px-4 py-1 rounded-full mt-2 border border-[#b88c54]/50 shadow-xs">
                [รวมอัตรากำลังพล: {grandPos.toLocaleString()} / ครองจริง: {grandOcc.toLocaleString()} นาย]
              </div>
            </div>
            <div className="w-1 h-6 bg-gradient-to-b from-[#b88c54] to-[#a0743b] rounded-full"></div>
          </div>

          {/* Branch Connector Bar (Royal Police Gold Rail) */}
          <div className="w-full flex justify-between px-16 relative">
            <div className="absolute top-0 left-16 right-16 h-1 bg-gradient-to-r from-[#b88c54] via-[#d4af37] to-[#b88c54] rounded-full shadow-sm"></div>
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
                  className="bg-[#132238] border border-[#b88c54]/60 text-[#faebd7] p-2 rounded-xl text-center shadow-md cursor-pointer hover:border-[#d4af37] hover:scale-105 transition"
                  title="คลิกเพื่อดูตาราง บก.สส.จชต."
                >
                  <div className="font-bold leading-tight">บก.สส.จชต.</div>
                  <div className="text-[10px] text-[#faebd7] font-mono mt-0.5">[{jctSum.totalAll_pos}/{jctSum.totalAll_occ}]</div>
                </div>
                <div
                  onClick={() => onNavigateToZone && onNavigateToZone('yala')}
                  className="bg-[#241a10] border border-[#8c6738]/60 text-[#faebd7] p-2 rounded-xl text-center shadow-md cursor-pointer hover:border-[#b88c54] hover:scale-105 transition"
                  title="คลิกเพื่อดูตาราง ภ.จว.ยะลา"
                >
                  <div className="font-bold leading-tight">ภ.จว.ยะลา</div>
                  <div className="text-[10px] text-stone-300 font-mono mt-0.5">[{yalaSum.totalAll_pos}/{yalaSum.totalAll_occ}]</div>
                </div>
                <div
                  onClick={() => onNavigateToZone && onNavigateToZone('yala')}
                  className="bg-[#14261b] border border-[#558e69]/60 text-[#e1f3e7] p-2 rounded-xl text-center shadow-md cursor-pointer hover:border-[#74b58c] hover:scale-105 transition"
                  title="คลิกเพื่อดูตาราง ศฝร.ภ.9"
                >
                  <div className="font-bold leading-tight">ศฝร.ภ.9</div>
                  <div className="text-[10px] text-emerald-200 font-mono mt-0.5">[{sfrSum.totalAll_pos}/{sfrSum.totalAll_occ}]</div>
                </div>
              </div>

              {/* Breakdown: หน่วยอำนวยการ vs สภ. */}
              <div className="grid grid-cols-2 gap-2 w-full">
                <div className="bg-gradient-to-br from-[#3b2314] via-[#2c1a0e] to-[#1f120a] text-white p-3 rounded-2xl shadow-lg text-xs border border-[#8c5732]/70 backdrop-blur-sm">
                  <div className="font-bold border-b border-[#b88c54]/30 pb-1 mb-1.5 text-center text-[#faebd7]">
                    หน่วยอำนวยการ<br />และสนับสนุน
                    <div className="text-[10px] text-[#faebd7] font-mono bg-[#b88c54]/20 px-2 py-0.5 rounded-full inline-block mt-1 border border-[#b88c54]/40">[{yalaBreakdown.adminPos}/{yalaBreakdown.adminOcc}]</div>
                  </div>
                  <ul className="space-y-1 text-[11px] text-stone-300">
                    {yalaBreakdown.admin.slice(0, 5).map((u) => (
                      <li
                        key={u.id}
                        onClick={() => handleUnitClick(u)}
                        className="truncate cursor-pointer hover:text-[#faebd7] hover:translate-x-0.5 transition-all"
                        title="คลิกดูตัวคนในหน่วยนี้"
                      >
                        • {u.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#1e2e21] via-[#162319] to-[#0f1711] text-white p-3 rounded-2xl shadow-lg text-xs border border-[#487353]/70 backdrop-blur-sm">
                  <div className="font-bold border-b border-[#558e69]/30 pb-1 mb-1.5 text-center text-[#e1f3e7]">
                    สภ. ({yalaBreakdown.sp.length} แห่ง)
                    <div className="text-[10px] text-[#e1f3e7] font-mono bg-[#407352]/20 px-2 py-0.5 rounded-full inline-block mt-1 border border-[#558e69]/40">[{yalaBreakdown.spPos}/{yalaBreakdown.spOcc}]</div>
                  </div>
                  <ul className="space-y-1 text-[11px] text-stone-300 max-h-48 overflow-y-auto">
                    {yalaBreakdown.sp.map((u) => (
                      <li
                        key={u.id}
                        onClick={() => handleUnitClick(u)}
                        className="truncate cursor-pointer hover:text-[#e1f3e7] hover:translate-x-0.5 transition-all"
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
                className="w-full bg-[#102238] border border-[#4a7bb5]/60 text-slate-100 p-2.5 rounded-xl text-center shadow-md cursor-pointer hover:border-[#6fa4e3] transition"
              >
                <div className="font-bold text-xs text-[#faebd7]">ภ.จว.ปัตตานี (21 หน่วย)</div>
                <div className="text-[11px] text-[#e0edfb] font-mono mt-0.5">[{ptnSum.totalAll_pos}/{ptnSum.totalAll_occ}]</div>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full">
                <div className="bg-gradient-to-br from-[#3b2314] via-[#2c1a0e] to-[#1f120a] text-white p-3 rounded-2xl shadow-lg text-xs border border-[#8c5732]/70 backdrop-blur-sm">
                  <div className="font-bold border-b border-[#b88c54]/30 pb-1 mb-1.5 text-center text-[#faebd7]">
                    หน่วยอำนวยการ<br />และสนับสนุน
                    <div className="text-[10px] text-[#faebd7] font-mono bg-[#b88c54]/20 px-2 py-0.5 rounded-full inline-block mt-1 border border-[#b88c54]/40">[{pattaniBreakdown.adminPos}/{pattaniBreakdown.adminOcc}]</div>
                  </div>
                  <ul className="space-y-1 text-[11px] text-stone-300">
                    {pattaniBreakdown.admin.map((u) => (
                      <li
                        key={u.id}
                        onClick={() => handleUnitClick(u)}
                        className="truncate cursor-pointer hover:text-[#faebd7] hover:translate-x-0.5 transition-all"
                        title="คลิกดูตัวคนในหน่วยนี้"
                      >
                        • {u.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#12243d] via-[#0d1a2c] to-[#09121f] text-white p-3 rounded-2xl shadow-lg text-xs border border-[#3b6291]/70 backdrop-blur-sm">
                  <div className="font-bold border-b border-[#4a7bb5]/30 pb-1 mb-1.5 text-center text-[#e0edfb]">
                    สภ. ({pattaniBreakdown.sp.length} แห่ง)
                    <div className="text-[10px] text-[#e0edfb] font-mono bg-[#3b6ea8]/20 px-2 py-0.5 rounded-full inline-block mt-1 border border-[#4a7bb5]/40">[{pattaniBreakdown.spPos}/{pattaniBreakdown.spOcc}]</div>
                  </div>
                  <ul className="space-y-1 text-[11px] text-stone-300 max-h-48 overflow-y-auto">
                    {pattaniBreakdown.sp.map((u) => (
                      <li
                        key={u.id}
                        onClick={() => handleUnitClick(u)}
                        className="truncate cursor-pointer hover:text-[#e0edfb] hover:translate-x-0.5 transition-all"
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
                className="w-full bg-[#14281c] border border-[#558e69]/60 text-slate-100 p-2.5 rounded-xl text-center shadow-md cursor-pointer hover:border-[#74b58c] transition"
              >
                <div className="font-bold text-xs text-[#faebd7]">ภ.จว.นราธิวาส (24 หน่วย)</div>
                <div className="text-[11px] text-[#e1f3e7] font-mono mt-0.5">[{nrtSum.totalAll_pos}/{nrtSum.totalAll_occ}]</div>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full">
                <div className="bg-gradient-to-br from-[#3b2314] via-[#2c1a0e] to-[#1f120a] text-white p-3 rounded-2xl shadow-lg text-xs border border-[#8c5732]/70 backdrop-blur-sm">
                  <div className="font-bold border-b border-[#b88c54]/30 pb-1 mb-1.5 text-center text-[#faebd7]">
                    หน่วยอำนวยการ<br />และสนับสนุน
                    <div className="text-[10px] text-[#faebd7] font-mono bg-[#b88c54]/20 px-2 py-0.5 rounded-full inline-block mt-1 border border-[#b88c54]/40">[{narathiwatBreakdown.adminPos}/{narathiwatBreakdown.adminOcc}]</div>
                  </div>
                  <ul className="space-y-1 text-[11px] text-stone-300">
                    {narathiwatBreakdown.admin.map((u) => (
                      <li
                        key={u.id}
                        onClick={() => handleUnitClick(u)}
                        className="truncate cursor-pointer hover:text-[#faebd7] hover:translate-x-0.5 transition-all"
                        title="คลิกดูตัวคนในหน่วยนี้"
                      >
                        • {u.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#1a3323] via-[#13261a] to-[#0c1811] text-white p-3 rounded-2xl shadow-lg text-xs border border-[#4a7d5b]/70 backdrop-blur-sm">
                  <div className="font-bold border-b border-[#558e69]/30 pb-1 mb-1.5 text-center text-[#e1f3e7]">
                    สภ. ({narathiwatBreakdown.sp.length} แห่ง)
                    <div className="text-[10px] text-[#e1f3e7] font-mono bg-[#407352]/20 px-2 py-0.5 rounded-full inline-block mt-1 border border-[#558e69]/40">[{narathiwatBreakdown.spPos}/{narathiwatBreakdown.spOcc}]</div>
                  </div>
                  <ul className="space-y-1 text-[11px] text-stone-300 max-h-48 overflow-y-auto">
                    {narathiwatBreakdown.sp.map((u) => (
                      <li
                        key={u.id}
                        onClick={() => handleUnitClick(u)}
                        className="truncate cursor-pointer hover:text-[#e1f3e7] hover:translate-x-0.5 transition-all"
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
                className="w-full bg-[#3b0d12] border border-[#ad3843]/60 text-slate-100 p-2.5 rounded-xl text-center shadow-md cursor-pointer hover:border-[#cf4c58] transition"
              >
                <div className="font-bold text-xs text-[#faebd7]">ภ.จว.สงขลา (เฉพาะ 4 อำเภอ 8 สภ.)</div>
                <div className="text-[11px] font-mono font-bold text-[#fce8ea] mt-0.5">
                  [{songkhlaRiskPos}/{songkhlaRiskOcc}]
                </div>
              </div>

              {/* 4 Districts sub-grid */}
              <div className="grid grid-cols-2 gap-2 w-full">
                <div className="bg-gradient-to-br from-[#2f0c10] via-[#24090c] to-[#170507] text-white p-2.5 rounded-xl shadow-md text-xs border border-[#752129]/70">
                  <div className="font-bold text-center border-b border-[#ad3843]/30 pb-1 mb-1 text-[#fce8ea]">
                    อ.นาทวี
                  </div>
                  <ul className="text-[11px] space-y-1 text-stone-300">
                    <li
                      onClick={() => {
                        const u = records.find(r => r.name.includes('สภ.นาทวี'));
                        if (u) handleUnitClick(u);
                      }}
                      className="cursor-pointer hover:text-[#faebd7] transition-colors"
                    >
                      • สภ.นาทวี
                    </li>
                    <li
                      onClick={() => {
                        const u = records.find(r => r.name.includes('สภ.สะท้อน'));
                        if (u) handleUnitClick(u);
                      }}
                      className="cursor-pointer hover:text-[#faebd7] transition-colors"
                    >
                      • สภ.สะท้อน
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#2f0c10] via-[#24090c] to-[#170507] text-white p-2.5 rounded-xl shadow-md text-xs border border-[#752129]/70">
                  <div className="font-bold text-center border-b border-[#ad3843]/30 pb-1 mb-1 text-[#fce8ea]">
                    อ.เทพา
                  </div>
                  <ul className="text-[11px] space-y-1 text-stone-300">
                    <li
                      onClick={() => {
                        const u = records.find(r => r.name.includes('สภ.เทพา'));
                        if (u) handleUnitClick(u);
                      }}
                      className="cursor-pointer hover:text-[#faebd7] transition-colors"
                    >
                      • สภ.เทพา
                    </li>
                    <li
                      onClick={() => {
                        const u = records.find(r => r.name.includes('สภ.ห้วยปลิง'));
                        if (u) handleUnitClick(u);
                      }}
                      className="cursor-pointer hover:text-[#faebd7] transition-colors"
                    >
                      • สภ.ห้วยปลิง
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#2f0c10] via-[#24090c] to-[#170507] text-white p-2.5 rounded-xl shadow-md text-xs border border-[#752129]/70">
                  <div className="font-bold text-center border-b border-[#ad3843]/30 pb-1 mb-1 text-[#fce8ea]">
                    อ.สะบ้าย้อย
                  </div>
                  <ul className="text-[11px] space-y-1 text-stone-300">
                    <li
                      onClick={() => {
                        const u = records.find(r => r.name.includes('สภ.สะบ้าย้อย'));
                        if (u) handleUnitClick(u);
                      }}
                      className="cursor-pointer hover:text-[#faebd7] transition-colors"
                    >
                      • สภ.สะบ้าย้อย
                    </li>
                    <li
                      onClick={() => {
                        const u = records.find(r => r.name.includes('สภ.บ้านโหนด'));
                        if (u) handleUnitClick(u);
                      }}
                      className="cursor-pointer hover:text-[#faebd7] transition-colors"
                    >
                      • สภ.บ้านโหนด
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#2f0c10] via-[#24090c] to-[#170507] text-white p-2.5 rounded-xl shadow-md text-xs border border-[#752129]/70">
                  <div className="font-bold text-center border-b border-[#ad3843]/30 pb-1 mb-1 text-[#fce8ea]">
                    อ.จะนะ
                  </div>
                  <ul className="text-[11px] space-y-1 text-stone-300">
                    <li
                      onClick={() => {
                        const u = records.find(r => r.name.includes('สภ.จะนะ'));
                        if (u) handleUnitClick(u);
                      }}
                      className="cursor-pointer hover:text-[#faebd7] transition-colors"
                    >
                      • สภ.จะนะ
                    </li>
                    <li
                      onClick={() => {
                        const u = records.find(r => r.name.includes('สภ.ควนมีด'));
                        if (u) handleUnitClick(u);
                      }}
                      className="cursor-pointer hover:text-[#faebd7] transition-colors"
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
                <th className="px-4 py-3 text-left font-bold rounded-tl-xl bg-[#0f1d30] text-[#faebd7] border-b-2 border-[#b88c54]">หน่วยงานหลัก / พื้นที่</th>
                <th className="px-4 py-3 text-center font-bold bg-[#1a3352] text-[#e0edfb] border-b-2 border-[#4a7bb5]">อัตราตำแหน่ง</th>
                <th className="px-4 py-3 text-center font-bold bg-[#1c3826] text-[#e1f3e7] border-b-2 border-[#558e69]">คนครอง (ตัวคนจริง)</th>
                <th className="px-4 py-3 text-center font-bold bg-[#5c4021] text-[#faebd7] border-b-2 border-[#b88c54]">อัตราการครองคน (%)</th>
                <th className="px-4 py-3 text-center font-bold bg-[#541218] text-[#fce8ea] border-b-2 border-[#ad3843]">ขาดแคลน (นาย)</th>
                <th className="px-4 py-3 text-center font-bold bg-[#182333] text-[#faebd7] rounded-tr-xl border-b-2 border-slate-600">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-['Prompt']">
              <tr
                onClick={() => onNavigateToZone && onNavigateToZone('yala')}
                className="hover:bg-amber-50/50 cursor-pointer transition"
              >
                <td className="px-4 py-2.5 font-medium text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#b88c54] shadow-xs"></span>
                  <span className="font-semibold">ภ.จว.ยะลา (รวม จว.ยะลา)</span>
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-slate-700 font-semibold">{yalaSum.totalAll_pos.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono font-bold text-[#1c3826]">{yalaSum.totalAll_occ.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono text-[#785427] font-bold">
                  {yalaSum.totalAll_pos > 0 ? ((yalaSum.totalAll_occ / yalaSum.totalAll_pos) * 100).toFixed(1) : 0}%
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-[#8f2731] font-bold">
                  -{(yalaSum.totalAll_pos - yalaSum.totalAll_occ).toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className="text-xs text-[#1a3352] font-semibold hover:text-[#0f1d30] hover:underline">เปิดตารางตัวคน →</span>
                </td>
              </tr>
              <tr
                onClick={() => onNavigateToZone && onNavigateToZone('yala')}
                className="hover:bg-blue-50/50 cursor-pointer transition"
              >
                <td className="px-4 py-2.5 font-medium text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3b6ea8] shadow-xs"></span>
                  <span className="font-semibold">บก.สส.จชต.</span>
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-slate-700 font-semibold">{jctSum.totalAll_pos.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono font-bold text-[#1c3826]">{jctSum.totalAll_occ.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono text-[#785427] font-bold">
                  {jctSum.totalAll_pos > 0 ? ((jctSum.totalAll_occ / jctSum.totalAll_pos) * 100).toFixed(1) : 0}%
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-[#8f2731] font-bold">
                  -{(jctSum.totalAll_pos - jctSum.totalAll_occ).toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className="text-xs text-[#1a3352] font-semibold hover:text-[#0f1d30] hover:underline">เปิดตารางตัวคน →</span>
                </td>
              </tr>
              <tr
                onClick={() => onNavigateToZone && onNavigateToZone('yala')}
                className="hover:bg-emerald-50/50 cursor-pointer transition"
              >
                <td className="px-4 py-2.5 font-medium text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#407352] shadow-xs"></span>
                  <span className="font-semibold">ศฝร.ภ.9</span>
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-slate-700 font-semibold">{sfrSum.totalAll_pos.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono font-bold text-[#1c3826]">{sfrSum.totalAll_occ.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono text-[#785427] font-bold">
                  {sfrSum.totalAll_pos > 0 ? ((sfrSum.totalAll_occ / sfrSum.totalAll_pos) * 100).toFixed(1) : 0}%
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-[#8f2731] font-bold">
                  -{(sfrSum.totalAll_pos - sfrSum.totalAll_occ).toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className="text-xs text-[#1a3352] font-semibold hover:text-[#0f1d30] hover:underline">เปิดตารางตัวคน →</span>
                </td>
              </tr>
              <tr
                onClick={() => onNavigateToZone && onNavigateToZone('pattani')}
                className="hover:bg-blue-50/50 cursor-pointer transition"
              >
                <td className="px-4 py-2.5 font-medium text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2a5d99] shadow-xs"></span>
                  <span className="font-semibold">ภ.จว.ปัตตานี (จว.ปัตตานี)</span>
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-slate-700 font-semibold">{ptnSum.totalAll_pos.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono font-bold text-[#1c3826]">{ptnSum.totalAll_occ.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono text-[#785427] font-bold">
                  {ptnSum.totalAll_pos > 0 ? ((ptnSum.totalAll_occ / ptnSum.totalAll_pos) * 100).toFixed(1) : 0}%
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-[#8f2731] font-bold">
                  -{(ptnSum.totalAll_pos - ptnSum.totalAll_occ).toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className="text-xs text-[#1a3352] font-semibold hover:text-[#0f1d30] hover:underline">เปิดตารางตัวคน →</span>
                </td>
              </tr>
              <tr
                onClick={() => onNavigateToZone && onNavigateToZone('narathiwat')}
                className="hover:bg-emerald-50/50 cursor-pointer transition"
              >
                <td className="px-4 py-2.5 font-medium text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2f633f] shadow-xs"></span>
                  <span className="font-semibold">ภ.จว.นราธิวาส (จว.นราธิวาส)</span>
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-slate-700 font-semibold">{nrtSum.totalAll_pos.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono font-bold text-[#1c3826]">{nrtSum.totalAll_occ.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono text-[#785427] font-bold">
                  {nrtSum.totalAll_pos > 0 ? ((nrtSum.totalAll_occ / nrtSum.totalAll_pos) * 100).toFixed(1) : 0}%
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-[#8f2731] font-bold">
                  -{(nrtSum.totalAll_pos - nrtSum.totalAll_occ).toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className="text-xs text-[#1a3352] font-semibold hover:text-[#0f1d30] hover:underline">เปิดตารางตัวคน →</span>
                </td>
              </tr>
              <tr
                onClick={() => onNavigateToZone && onNavigateToZone('songkhla_risk')}
                className="hover:bg-rose-50/50 cursor-pointer transition"
              >
                <td className="px-4 py-2.5 font-medium text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8f2731] shadow-xs"></span>
                  <span className="font-semibold">ภ.จว.สงขลา (เฉพาะ 4 อำเภอ 8 สภ. เสี่ยงภัย)</span>
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-slate-700 font-semibold">{songkhlaRiskPos.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono font-bold text-[#1c3826]">{songkhlaRiskOcc.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center font-mono text-[#785427] font-bold">
                  {songkhlaRiskPos > 0 ? ((songkhlaRiskOcc / songkhlaRiskPos) * 100).toFixed(1) : 0}%
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-[#8f2731] font-bold">
                  -{(songkhlaRiskPos - songkhlaRiskOcc).toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className="text-xs text-[#1a3352] font-semibold hover:text-[#0f1d30] hover:underline">เปิดตารางตัวคน →</span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="text-white font-extrabold text-sm">
                <td className="px-4 py-3.5 rounded-bl-xl bg-[#0a1422] text-[#d4af37]">ยอดรวมทั้งสิ้น (4 สายงานยุทธการ)</td>
                <td className="px-4 py-3.5 text-center font-mono bg-[#13263d] text-[#e0edfb]">
                  {grandPos.toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-center font-mono bg-[#14281c] text-[#e1f3e7]">
                  {grandOcc.toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-center font-mono bg-[#453018] text-[#faebd7]">
                  {grandPos > 0 ? ((grandOcc / grandPos) * 100).toFixed(1) : 0}%
                </td>
                <td className="px-4 py-3.5 text-center font-mono bg-[#420d12] text-[#fce8ea]">
                  -{(grandPos - grandOcc).toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-center text-xs bg-[#0a1422] rounded-br-xl font-medium text-[#faebd7]">
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
