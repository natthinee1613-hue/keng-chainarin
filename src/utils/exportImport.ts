import * as XLSX from 'xlsx';
import { PoliceUnitRecord } from '../types';
import { calculateRecordTotals } from '../data/initialData';

export interface ExportOptions {
  includeSubtotals?: boolean;
  format?: 'xlsx' | 'csv' | 'json';
}

export function exportToExcel(records: PoliceUnitRecord[], filename = 'สถานภาพข้าราชการตำรวจ_ภ9.xlsx') {
  const wb = XLSX.utils.book_new();

  // Create rows matching official structure
  const header1 = [
    'ลำดับ',
    'หน่วยงาน',
    'สังกัดกลุ่ม',
    'ผบก. (ตำแหน่ง)',
    'ผบก. (คนครอง)',
    'รอง ผบก. (ตำแหน่ง)',
    'รอง ผบก. (คนครอง)',
    'ผกก. (ตำแหน่ง)',
    'ผกก. (คนครอง)',
    'รอง ผกก. (ตำแหน่ง)',
    'รอง ผกก. (คนครอง)',
    'สว. (ตำแหน่ง)',
    'สว. (คนครอง)',
    'รอง สว. (ตำแหน่ง)',
    'รอง สว. (คนครอง)',
    'รวมชั้นสัญญาบัตร (ตำแหน่ง)',
    'รวมชั้นสัญญาบัตร (คนครอง)',
    'รอง สว.(ด.ต.53 ปี) (ตำแหน่ง)',
    'รอง สว.(ด.ต.53 ปี) (คนครอง)',
    'ผบ.หมู่ (ตำแหน่ง)',
    'ผบ.หมู่ (คนครอง)',
    'ชั้นประทวน (ตำแหน่ง)',
    'ชั้นประทวน (คนครอง)',
    'รอง ผบ.หมู่ (ตำแหน่ง)',
    'รอง ผบ.หมู่ (คนครอง)',
    'รวมทั้งหมด (ตำแหน่ง)',
    'รวมทั้งหมด (คนครอง)',
    'ขาด/เกิน (ตำแหน่ง-คนครอง)',
    'อัตราครองคน (%)',
  ];

  const dataRows: (string | number)[][] = [header1];

  let currentGroup = '';
  records.forEach((r, idx) => {
    if (r.group !== currentGroup) {
      currentGroup = r.group;
    }
    const diff = Number(r.totalAll_pos) - Number(r.totalAll_occ);
    const pct = r.totalAll_pos > 0 ? ((r.totalAll_occ / r.totalAll_pos) * 100).toFixed(1) + '%' : '-';

    dataRows.push([
      r.order || idx + 1,
      r.name,
      r.group,
      r.commander_pos,
      r.commander_occ,
      r.deputyCommander_pos,
      r.deputyCommander_occ,
      r.superintendent_pos,
      r.superintendent_occ,
      r.deputySuperintendent_pos,
      r.deputySuperintendent_occ,
      r.inspector_pos,
      r.inspector_occ,
      r.deputyInspector_pos,
      r.deputyInspector_occ,
      r.totalCommissioned_pos,
      r.totalCommissioned_occ,
      r.seniorSergeantMajor_pos,
      r.seniorSergeantMajor_occ,
      r.squadLeader_pos,
      r.squadLeader_occ,
      r.totalNonCommissioned_pos,
      r.totalNonCommissioned_occ,
      r.deputySquadLeader_pos,
      r.deputySquadLeader_occ,
      r.totalAll_pos,
      r.totalAll_occ,
      diff,
      pct,
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(dataRows);
  XLSX.utils.book_append_sheet(wb, ws, 'สถานภาพกำลังพล');
  XLSX.writeFile(wb, filename);
}

export function exportToCSV(records: PoliceUnitRecord[], filename = 'สถานภาพข้าราชการตำรวจ_ภ9.csv') {
  const headers = [
    'ลำดับ',
    'หน่วยงาน',
    'สังกัดกลุ่ม',
    'ผบก_ตำแหน่ง', 'ผบก_คนครอง',
    'รอง_ผบก_ตำแหน่ง', 'รอง_ผบก_คนครอง',
    'ผกก_ตำแหน่ง', 'ผกก_คนครอง',
    'รอง_ผกก_ตำแหน่ง', 'รอง_ผกก_คนครอง',
    'สว_ตำแหน่ง', 'สว_คนครอง',
    'รอง_สว_ตำแหน่ง', 'รอง_สว_คนครอง',
    'รวมชั้นสัญญาบัตร_ตำแหน่ง', 'รวมชั้นสัญญาบัตร_คนครอง',
    'รอง_สวดต53_ตำแหน่ง', 'รอง_สวดต53_คนครอง',
    'ผบหมู่_ตำแหน่ง', 'ผบหมู่_คนครอง',
    'ชั้นประทวน_ตำแหน่ง', 'ชั้นประทวน_คนครอง',
    'รอง_ผบหมู่_ตำแหน่ง', 'รอง_ผบหมู่_คนครอง',
    'รวมทั้งหมด_ตำแหน่ง', 'รวมทั้งหมด_คนครอง',
  ];

  const rows = records.map((r, idx) => [
    r.order || idx + 1,
    `"${r.name.replace(/"/g, '""')}"`,
    `"${r.group.replace(/"/g, '""')}"`,
    r.commander_pos, r.commander_occ,
    r.deputyCommander_pos, r.deputyCommander_occ,
    r.superintendent_pos, r.superintendent_occ,
    r.deputySuperintendent_pos, r.deputySuperintendent_occ,
    r.inspector_pos, r.inspector_occ,
    r.deputyInspector_pos, r.deputyInspector_occ,
    r.totalCommissioned_pos, r.totalCommissioned_occ,
    r.seniorSergeantMajor_pos, r.seniorSergeantMajor_occ,
    r.squadLeader_pos, r.squadLeader_occ,
    r.totalNonCommissioned_pos, r.totalNonCommissioned_occ,
    r.deputySquadLeader_pos, r.deputySquadLeader_occ,
    r.totalAll_pos, r.totalAll_occ,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToJSON(records: PoliceUnitRecord[], filename = 'สถานภาพข้าราชการตำรวจ_ภ9.json') {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
  const a = document.createElement('a');
  a.href = dataStr;
  a.download = filename;
  a.click();
}

export function downloadTemplate() {
  const templateRecords: Partial<PoliceUnitRecord>[] = [
    {
      order: 1,
      group: 'ภ.จว.ยะลา',
      name: 'สภ.ตัวอย่าง',
      commander_pos: 0, commander_occ: 0,
      deputyCommander_pos: 0, deputyCommander_occ: 0,
      superintendent_pos: 1, superintendent_occ: 1,
      deputySuperintendent_pos: 3, deputySuperintendent_occ: 3,
      inspector_pos: 4, inspector_occ: 4,
      deputyInspector_pos: 20, deputyInspector_occ: 10,
      seniorSergeantMajor_pos: 4, seniorSergeantMajor_occ: 4,
      squadLeader_pos: 150, squadLeader_occ: 120,
      deputySquadLeader_pos: 0, deputySquadLeader_occ: 0,
    }
  ];
  exportToExcel(templateRecords as PoliceUnitRecord[], 'แบบฟอร์มนำเข้าข้อมูล_กำลังพลตำรวจ.xlsx');
}

// Parse imported file
export async function parseImportFile(file: File): Promise<PoliceUnitRecord[]> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'json') {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) {
      throw new Error('รูปแบบไฟล์ JSON ต้องเป็น Array ของรายการข้อมูล');
    }
    return parsed.map((item, idx) => {
      const calculated = calculateRecordTotals(item);
      return {
        id: item.id || `imported-${Date.now()}-${idx}`,
        order: item.order || idx + 1,
        group: item.group || 'ทั่วไป',
        name: item.name || 'ไม่ระบุชื่อหน่วย',
        isRiskAreaSongkhla: item.isRiskAreaSongkhla || false,
        ...calculated,
      } as PoliceUnitRecord;
    });
  }

  // Parse Excel or CSV
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = wb.SheetNames[0];
  const ws = wb.Sheets[firstSheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });

  if (rows.length < 2) {
    throw new Error('ไฟล์ไม่มีข้อมูลเพียงพอ');
  }

  // Identify header row
  let headerIndex = 0;
  for (let i = 0; i < Math.min(5, rows.length); i++) {
    const r = rows[i];
    if (r && r.some((c: any) => typeof c === 'string' && (c.includes('หน่วยงาน') || c.includes('ผบก') || c.includes('name')))) {
      headerIndex = i;
      break;
    }
  }

  const rawHeaders: string[] = (rows[headerIndex] || []).map((h: any) => String(h || '').trim());
  const dataRows = rows.slice(headerIndex + 1);

  const parsedRecords: PoliceUnitRecord[] = [];

  dataRows.forEach((r, idx) => {
    if (!r || r.length === 0 || !r.some((c: any) => c !== undefined && c !== null && String(c).trim() !== '')) {
      return;
    }

    const getVal = (colMatchers: string[], defaultNum = 0): number => {
      for (let i = 0; i < rawHeaders.length; i++) {
        const h = rawHeaders[i];
        if (colMatchers.some(m => h.includes(m))) {
          const val = Number(r[i]);
          return isNaN(val) ? defaultNum : val;
        }
      }
      return defaultNum;
    };

    const getStringVal = (colMatchers: string[], defaultStr = ''): string => {
      for (let i = 0; i < rawHeaders.length; i++) {
        const h = rawHeaders[i];
        if (colMatchers.some(m => h.includes(m))) {
          return r[i] !== undefined && r[i] !== null ? String(r[i]).trim() : defaultStr;
        }
      }
      return defaultStr;
    };

    // If unit name or group contains "รวม", skip as it's a subtotal
    const name = getStringVal(['หน่วยงาน', 'name', 'unit'], r[1] ? String(r[1]).trim() : `หน่วยที่ ${idx + 1}`);
    if (name.startsWith('รวม (') || name === 'รวมทั้งหมด') {
      return;
    }

    const group = getStringVal(['สังกัดกลุ่ม', 'กลุ่ม', 'group', 'province', 'จังหวัด'], 'ทั่วไป');
    const order = r[0] ? (isNaN(Number(r[0])) ? idx + 1 : Number(r[0])) : idx + 1;

    // Check positional fallbacks if headers are generic
    const recordCandidate: Partial<PoliceUnitRecord> = {
      id: `imported-${Date.now()}-${idx}`,
      order,
      name,
      group,
      commander_pos: getVal(['ผบก. (ตำแหน่ง)', 'ผบก_ตำแหน่ง', 'commander_pos'], Number(r[3]) || 0),
      commander_occ: getVal(['ผบก. (คนครอง)', 'ผบก_คนครอง', 'commander_occ'], Number(r[4]) || 0),
      deputyCommander_pos: getVal(['รอง ผบก. (ตำแหน่ง)', 'รอง_ผบก_ตำแหน่ง', 'deputyCommander_pos'], Number(r[5]) || 0),
      deputyCommander_occ: getVal(['รอง ผบก. (คนครอง)', 'รอง_ผบก_คนครอง', 'deputyCommander_occ'], Number(r[6]) || 0),
      superintendent_pos: getVal(['ผกก. (ตำแหน่ง)', 'ผกก_ตำแหน่ง', 'superintendent_pos'], Number(r[7]) || 0),
      superintendent_occ: getVal(['ผกก. (คนครอง)', 'ผกก_คนครอง', 'superintendent_occ'], Number(r[8]) || 0),
      deputySuperintendent_pos: getVal(['รอง ผกก. (ตำแหน่ง)', 'รอง_ผกก_ตำแหน่ง', 'deputySuperintendent_pos'], Number(r[9]) || 0),
      deputySuperintendent_occ: getVal(['รอง ผกก. (คนครอง)', 'รอง_ผกก_คนครอง', 'deputySuperintendent_occ'], Number(r[10]) || 0),
      inspector_pos: getVal(['สว. (ตำแหน่ง)', 'สว_ตำแหน่ง', 'inspector_pos'], Number(r[11]) || 0),
      inspector_occ: getVal(['สว. (คนครอง)', 'สว_คนครอง', 'inspector_occ'], Number(r[12]) || 0),
      deputyInspector_pos: getVal(['รอง สว. (ตำแหน่ง)', 'รอง_สว_ตำแหน่ง', 'deputyInspector_pos'], Number(r[13]) || 0),
      deputyInspector_occ: getVal(['รอง สว. (คนครอง)', 'รอง_สว_คนครอง', 'deputyInspector_occ'], Number(r[14]) || 0),
      seniorSergeantMajor_pos: getVal(['53 ปี) (ตำแหน่ง)', 'ดต53', 'seniorSergeantMajor_pos'], Number(r[17]) || 0),
      seniorSergeantMajor_occ: getVal(['53 ปี) (คนครอง)', 'ดต53', 'seniorSergeantMajor_occ'], Number(r[18]) || 0),
      squadLeader_pos: getVal(['ผบ.หมู่ (ตำแหน่ง)', 'ผบหมู่', 'squadLeader_pos'], Number(r[19]) || 0),
      squadLeader_occ: getVal(['ผบ.หมู่ (คนครอง)', 'ผบหมู่', 'squadLeader_occ'], Number(r[20]) || 0),
      deputySquadLeader_pos: getVal(['รอง ผบ.หมู่ (ตำแหน่ง)', 'รอง_ผบหมู่', 'deputySquadLeader_pos'], Number(r[23]) || 0),
      deputySquadLeader_occ: getVal(['รอง ผบ.หมู่ (คนครอง)', 'รอง_ผบหมู่', 'deputySquadLeader_occ'], Number(r[24]) || 0),
    };

    const withTotals = calculateRecordTotals(recordCandidate);
    parsedRecords.push(withTotals as PoliceUnitRecord);
  });

  return parsedRecords;
}
