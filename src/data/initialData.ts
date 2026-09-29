import { PoliceUnitRecord, GroupSummary } from '../types';
import { CENTRAL_UNITS } from './group1_central';
import { YALA_PATTANI_UNITS } from './group2_yala_pattani';
import { NARATHIWAT_UNITS } from './group3_narathiwat';
import { SONGKHLA_UNITS } from './group4_songkhla';

export const INITIAL_POLICE_UNITS: PoliceUnitRecord[] = [
  ...CENTRAL_UNITS,
  ...YALA_PATTANI_UNITS,
  ...NARATHIWAT_UNITS,
  ...SONGKHLA_UNITS,
];

// Helper to recalculate subtotals for a single record
export function calculateRecordTotals(record: Partial<PoliceUnitRecord>): Partial<PoliceUnitRecord> {
  const c_pos = Number(record.commander_pos || 0);
  const c_occ = Number(record.commander_occ || 0);
  const dc_pos = Number(record.deputyCommander_pos || 0);
  const dc_occ = Number(record.deputyCommander_occ || 0);
  const s_pos = Number(record.superintendent_pos || 0);
  const s_occ = Number(record.superintendent_occ || 0);
  const ds_pos = Number(record.deputySuperintendent_pos || 0);
  const ds_occ = Number(record.deputySuperintendent_occ || 0);
  const ins_pos = Number(record.inspector_pos || 0);
  const ins_occ = Number(record.inspector_occ || 0);
  const di_pos = Number(record.deputyInspector_pos || 0);
  const di_occ = Number(record.deputyInspector_occ || 0);

  const totalComm_pos = c_pos + dc_pos + s_pos + ds_pos + ins_pos + di_pos;
  const totalComm_occ = c_occ + dc_occ + s_occ + ds_occ + ins_occ + di_occ;

  const ssm_pos = Number(record.seniorSergeantMajor_pos || 0);
  const ssm_occ = Number(record.seniorSergeantMajor_occ || 0);
  const sl_pos = Number(record.squadLeader_pos || 0);
  const sl_occ = Number(record.squadLeader_occ || 0);

  const totalNonComm_pos = ssm_pos + sl_pos;
  const totalNonComm_occ = ssm_occ + sl_occ;

  const dsl_pos = Number(record.deputySquadLeader_pos || 0);
  const dsl_occ = Number(record.deputySquadLeader_occ || 0);

  const totalAll_pos = totalComm_pos + totalNonComm_pos + dsl_pos;
  const totalAll_occ = totalComm_occ + totalNonComm_occ + dsl_occ;

  return {
    ...record,
    totalCommissioned_pos: totalComm_pos,
    totalCommissioned_occ: totalComm_occ,
    totalNonCommissioned_pos: totalNonComm_pos,
    totalNonCommissioned_occ: totalNonComm_occ,
    totalAll_pos: totalAll_pos,
    totalAll_occ: totalAll_occ,
  };
}

// Compute group summary from actual records
export function computeGroupSummary(group: string, records: PoliceUnitRecord[]): GroupSummary {
  const filtered = records.filter(r => r.group === group);
  const summary: GroupSummary = {
    group,
    count: filtered.length,
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
  };

  filtered.forEach(r => {
    summary.commander_pos += Number(r.commander_pos || 0);
    summary.commander_occ += Number(r.commander_occ || 0);
    summary.deputyCommander_pos += Number(r.deputyCommander_pos || 0);
    summary.deputyCommander_occ += Number(r.deputyCommander_occ || 0);
    summary.superintendent_pos += Number(r.superintendent_pos || 0);
    summary.superintendent_occ += Number(r.superintendent_occ || 0);
    summary.deputySuperintendent_pos += Number(r.deputySuperintendent_pos || 0);
    summary.deputySuperintendent_occ += Number(r.deputySuperintendent_occ || 0);
    summary.inspector_pos += Number(r.inspector_pos || 0);
    summary.inspector_occ += Number(r.inspector_occ || 0);
    summary.deputyInspector_pos += Number(r.deputyInspector_pos || 0);
    summary.deputyInspector_occ += Number(r.deputyInspector_occ || 0);
    summary.totalCommissioned_pos += Number(r.totalCommissioned_pos || 0);
    summary.totalCommissioned_occ += Number(r.totalCommissioned_occ || 0);
    summary.seniorSergeantMajor_pos += Number(r.seniorSergeantMajor_pos || 0);
    summary.seniorSergeantMajor_occ += Number(r.seniorSergeantMajor_occ || 0);
    summary.squadLeader_pos += Number(r.squadLeader_pos || 0);
    summary.squadLeader_occ += Number(r.squadLeader_occ || 0);
    summary.totalNonCommissioned_pos += Number(r.totalNonCommissioned_pos || 0);
    summary.totalNonCommissioned_occ += Number(r.totalNonCommissioned_occ || 0);
    summary.deputySquadLeader_pos += Number(r.deputySquadLeader_pos || 0);
    summary.deputySquadLeader_occ += Number(r.deputySquadLeader_occ || 0);
    summary.totalAll_pos += Number(r.totalAll_pos || 0);
    summary.totalAll_occ += Number(r.totalAll_occ || 0);
  });

  return summary;
}
