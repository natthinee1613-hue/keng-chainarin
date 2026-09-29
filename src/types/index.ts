export interface PoliceUnitRecord {
  id: string;
  order: number | string;
  group: string; // e.g. 'ภ.9', 'บก.สืบสวนสอบสวน ภ.9', 'บก.สืบสวนสอบสวน จชต.', 'ศฝร.ภ.9', 'ภ.จว.ยะลา', 'ภ.จว.ปัตตานี', 'ภ.จว.นราธิวาส', 'ภ.จว.สงขลา'
  name: string;
  isRiskAreaSongkhla?: boolean; // For 4 districts in Songkhla: นาทวี, เทพา, สะบ้าย้อย, จะนะ

  // 1. ผบก.
  commander_pos: number;
  commander_occ: number;

  // 2. รอง ผบก.
  deputyCommander_pos: number;
  deputyCommander_occ: number;

  // 3. ผกก.
  superintendent_pos: number;
  superintendent_occ: number;

  // 4. รอง ผกก.
  deputySuperintendent_pos: number;
  deputySuperintendent_occ: number;

  // 5. สว.
  inspector_pos: number;
  inspector_occ: number;

  // 6. รอง สว.
  deputyInspector_pos: number;
  deputyInspector_occ: number;

  // 7. รวมชั้นสัญญาบัตร (Auto or custom)
  totalCommissioned_pos: number;
  totalCommissioned_occ: number;

  // 8. รอง สว.(ด.ต.53 ปี)
  seniorSergeantMajor_pos: number;
  seniorSergeantMajor_occ: number;

  // 9. ผบ.หมู่
  squadLeader_pos: number;
  squadLeader_occ: number;

  // 10. ชั้นประทวน (Auto or custom)
  totalNonCommissioned_pos: number;
  totalNonCommissioned_occ: number;

  // 11. รอง ผบ.หมู่
  deputySquadLeader_pos: number;
  deputySquadLeader_occ: number;

  // 12. รวมทั้งหมด (Grand Total)
  totalAll_pos: number;
  totalAll_occ: number;

  notes?: string;
  rosterList?: OfficerRosterItem[];
  riskLevel?: 'red' | 'orange' | 'yellow'; // 'red' = พื้นที่เสี่ยงภัยสูงมาก / เกิดเหตุบ่อย
  threatDescription?: string; // รายละเอียดจุดเฝ้าระวังและลักษณะการก่อเหตุ
  incidentTypes?: string[]; // รูปแบบเหตุการณ์ที่มักเกิดขึ้น
}

export interface SecurityThreatZoneInfo {
  province: string;
  district: string;
  stationName: string;
  threatLevel: 'red' | 'orange' | 'yellow';
  riskSpots: string; // จุดที่ควรเฝ้าระวัง
  frequentIncidents: string; // พฤติกรรมการก่อเหตุ
  manpowerStatus: string;
}

export interface OfficerRosterItem {
  id: string;
  rankTitle: string;
  fullName: string;
  positionTitle: string;
  status: 'ครองตำแหน่ง' | 'รักษาราชการแทน' | 'ช่วยราชการ' | 'ว่าง';
}

export type ZoneId =
  | 'all'
  | 'yala'
  | 'pattani'
  | 'narathiwat'
  | 'songkhla_risk'
  | 'songkhla_all'
  | 'central';

export interface ZoneDefinition {
  id: ZoneId;
  name: string;
  shortName: string;
  description: string;
  colorClass: string;
  badgeClass: string;
}

export const OFFICIAL_ZONES: ZoneDefinition[] = [
  {
    id: 'all',
    name: 'ภาพรวมทุกพื้นที่ (ทุกหน่วยงาน ภ.9)',
    shortName: 'ทุกพื้นที่',
    description: 'ข้อมูลครบทุกสังกัด ภ.9, จชต., ยะลา, ปัตตานี, นราธิวาส และ สงขลา',
    colorClass: 'border-slate-700 bg-slate-900 text-white',
    badgeClass: 'bg-slate-800 text-slate-200',
  },
  {
    id: 'yala',
    name: '1. จังหวัดยะลา',
    shortName: '1. จว.ยะลา',
    description: 'ครอบคลุม ภ.จว.ยะลา (23 หน่วย), บก.สส.จชต. (9 หน่วย), ศฝร.ภ.9 (5 หน่วย)',
    colorClass: 'border-sky-600 bg-sky-700 text-white',
    badgeClass: 'bg-sky-100 text-sky-900',
  },
  {
    id: 'pattani',
    name: '2. จังหวัดปัตตานี',
    shortName: '2. จว.ปัตตานี',
    description: 'ครอบคลุม ภ.จว.ปัตตานี (หน่วยอำนวยการ/สนับสนุน และ สภ. 21 หน่วยงาน)',
    colorClass: 'border-blue-600 bg-blue-700 text-white',
    badgeClass: 'bg-blue-100 text-blue-900',
  },
  {
    id: 'narathiwat',
    name: '3. จังหวัดนราธิวาส',
    shortName: '3. จว.นราธิวาส',
    description: 'ครอบคลุม ภ.จว.นราธิวาส (หน่วยอำนวยการ/สนับสนุน และ สภ. 24 หน่วยงาน)',
    colorClass: 'border-amber-600 bg-amber-700 text-white',
    badgeClass: 'bg-amber-100 text-amber-900',
  },
  {
    id: 'songkhla_risk',
    name: '4. พื้นที่เสี่ยงภัย จว.สงขลา',
    shortName: '4. เสี่ยงภัยสงขลา (4 อ.)',
    description: 'เฉพาะ 4 อำเภอ 8 สภ. (นาทวี, สะท้อน, เทพา, ห้วยปลิง, สะบ้าย้อย, บ้านโหนด, จะนะ, ควนมีด)',
    colorClass: 'border-teal-600 bg-teal-800 text-white',
    badgeClass: 'bg-teal-100 text-teal-900',
  },
  {
    id: 'songkhla_all',
    name: 'ภ.จว.สงขลา (ทั้งหมด 36 หน่วย)',
    shortName: 'ภ.จว.สงขลา (ทั้งหมด)',
    description: 'รวมทุกหน่วยงานในจังหวัดสงขลา ทั้ง 16 อำเภอ',
    colorClass: 'border-cyan-700 bg-cyan-900 text-white',
    badgeClass: 'bg-cyan-100 text-cyan-900',
  },
  {
    id: 'central',
    name: 'ภ.9 ส่วนกลาง & บก.สส.ภ.9',
    shortName: 'ภ.9 ส่วนกลาง',
    description: 'กก.ปฏิบัติการพิเศษ ภ.9 และ บก.สืบสวนสอบสวน ภ.9 (8 หน่วยงาน)',
    colorClass: 'border-purple-600 bg-purple-800 text-white',
    badgeClass: 'bg-purple-100 text-purple-900',
  },
];

export type UnitGroup =
  | 'ภ.9'
  | 'บก.สืบสวนสอบสวน ภ.9'
  | 'บก.สืบสวนสอบสวน จชต.'
  | 'ศฝร.ภ.9'
  | 'ภ.จว.ยะลา'
  | 'ภ.จว.ปัตตานี'
  | 'ภ.จว.นราธิวาส'
  | 'ภ.จว.สงขลา';

export const UNIT_GROUPS: UnitGroup[] = [
  'ภ.9',
  'บก.สืบสวนสอบสวน ภ.9',
  'บก.สืบสวนสอบสวน จชต.',
  'ศฝร.ภ.9',
  'ภ.จว.ยะลา',
  'ภ.จว.ปัตตานี',
  'ภ.จว.นราธิวาส',
  'ภ.จว.สงขลา',
];

export interface GroupSummary {
  group: string;
  count: number;
  commander_pos: number;
  commander_occ: number;
  deputyCommander_pos: number;
  deputyCommander_occ: number;
  superintendent_pos: number;
  superintendent_occ: number;
  deputySuperintendent_pos: number;
  deputySuperintendent_occ: number;
  inspector_pos: number;
  inspector_occ: number;
  deputyInspector_pos: number;
  deputyInspector_occ: number;
  totalCommissioned_pos: number;
  totalCommissioned_occ: number;
  seniorSergeantMajor_pos: number;
  seniorSergeantMajor_occ: number;
  squadLeader_pos: number;
  squadLeader_occ: number;
  totalNonCommissioned_pos: number;
  totalNonCommissioned_occ: number;
  deputySquadLeader_pos: number;
  deputySquadLeader_occ: number;
  totalAll_pos: number;
  totalAll_occ: number;
}
