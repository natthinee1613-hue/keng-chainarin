import { PoliceUnitRecord, ZoneId } from '../types';

export function filterRecordsByZone(records: PoliceUnitRecord[], zoneId: ZoneId): PoliceUnitRecord[] {
  switch (zoneId) {
    case 'yala':
      return records.filter(
        (r) => r.group === 'ภ.จว.ยะลา' || r.group === 'บก.สืบสวนสอบสวน จชต.' || r.group === 'ศฝร.ภ.9'
      );
    case 'pattani':
      return records.filter((r) => r.group === 'ภ.จว.ปัตตานี');
    case 'narathiwat':
      return records.filter((r) => r.group === 'ภ.จว.นราธิวาส');
    case 'songkhla_risk':
      return records.filter((r) => r.group === 'ภ.จว.สงขลา' && !!r.isRiskAreaSongkhla);
    case 'songkhla_all':
      return records.filter((r) => r.group === 'ภ.จว.สงขลา');
    case 'central':
      return records.filter((r) => r.group === 'ภ.9' || r.group === 'บก.สืบสวนสอบสวน ภ.9');
    case 'all':
    default:
      return records;
  }
}

export function getZoneSummary(records: PoliceUnitRecord[], zoneId: ZoneId) {
  const zoneRecords = filterRecordsByZone(records, zoneId);
  const totalPos = zoneRecords.reduce((s, r) => s + r.totalAll_pos, 0);
  const totalOcc = zoneRecords.reduce((s, r) => s + r.totalAll_occ, 0);
  const shortage = Math.max(0, totalPos - totalOcc);
  const fillRate = totalPos > 0 ? (totalOcc / totalPos) * 100 : 0;

  const commissionedPos = zoneRecords.reduce((s, r) => s + r.totalCommissioned_pos, 0);
  const commissionedOcc = zoneRecords.reduce((s, r) => s + r.totalCommissioned_occ, 0);

  const nonCommissionedPos = zoneRecords.reduce((s, r) => s + r.totalNonCommissioned_pos, 0);
  const nonCommissionedOcc = zoneRecords.reduce((s, r) => s + r.totalNonCommissioned_occ, 0);

  return {
    count: zoneRecords.length,
    totalPos,
    totalOcc,
    shortage,
    fillRate,
    commissionedPos,
    commissionedOcc,
    nonCommissionedPos,
    nonCommissionedOcc,
  };
}
