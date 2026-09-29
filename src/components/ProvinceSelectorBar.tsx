import React from 'react';
import { PoliceUnitRecord, ZoneId } from '../types';
import { ProvinceMiniMap, ProvinceMapKey } from './ProvinceMiniMap';
import { MapPin, Flame, ShieldAlert } from 'lucide-react';

interface ProvinceSelectorBarProps {
  records: PoliceUnitRecord[];
  selectedZone: ZoneId;
  onSelectZone: (zoneId: ZoneId) => void;
  onOpenIncidentsModal?: (provinceKey: string) => void;
  className?: string;
}

export const ProvinceSelectorBar: React.FC<ProvinceSelectorBarProps> = ({
  records,
  selectedZone,
  onSelectZone,
  onOpenIncidentsModal,
  className = '',
}) => {
  // Compute summary metrics per province/zone
  const getZoneStats = (zoneId: ZoneId) => {
    let filtered = records;
    if (zoneId === 'yala') {
      filtered = records.filter(
        (r) => r.group.includes('ยะลา') || r.group.includes('จชต.') || r.group.includes('ศฝร.ภ.9')
      );
    } else if (zoneId === 'pattani') {
      filtered = records.filter((r) => r.group.includes('ปัตตานี'));
    } else if (zoneId === 'narathiwat') {
      filtered = records.filter((r) => r.group.includes('นราธิวาส'));
    } else if (zoneId === 'songkhla_risk') {
      filtered = records.filter(
        (r) =>
          r.isRiskAreaSongkhla ||
          ['สภ.นาทวี', 'สภ.สะท้อน', 'สภ.เทพา', 'สภ.ห้วยปลิง', 'สภ.สะบ้าย้อย', 'สภ.บ้านโหนด', 'สภ.จะนะ', 'สภ.ควนมีด'].includes(r.name)
      );
    } else if (zoneId === 'songkhla_all') {
      filtered = records.filter((r) => r.group.includes('สงขลา'));
    } else if (zoneId === 'central') {
      filtered = records.filter((r) => r.group === 'ภ.9' || r.group.includes('บก.สส.ภ.9'));
    }

    const pos = filtered.reduce((s, r) => s + (r.totalAll_pos || 0), 0);
    const occ = filtered.reduce((s, r) => s + (r.totalAll_occ || 0), 0);
    const fillRate = pos > 0 ? ((occ / pos) * 100).toFixed(1) : '0';

    return {
      count: filtered.length,
      pos,
      occ,
      fillRate,
    };
  };

  const provinceCards: {
    id: ZoneId;
    title: string;
    subTitle: string;
    mapKey: ProvinceMapKey;
    badgeColor: string;
    highlightBorder: string;
    incidentCount: number;
  }[] = [
    {
      id: 'all',
      title: 'ทุกพื้นที่ (ภ.9)',
      subTitle: 'ภาพรวม 4 จว.ชายแดนใต้',
      mapKey: 'all',
      badgeColor: 'bg-slate-800 text-white',
      highlightBorder: 'border-slate-800',
      incidentCount: 14,
    },
    {
      id: 'yala',
      title: '1. จว.ยะลา',
      subTitle: 'ภ.จว.ยะลา / จชต. / ศฝร.',
      mapKey: 'yala',
      badgeColor: 'bg-sky-600 text-white',
      highlightBorder: 'border-sky-500',
      incidentCount: 3,
    },
    {
      id: 'pattani',
      title: '2. จว.ปัตตานี',
      subTitle: 'ภ.จว.ปัตตานี & สภ.ในสังกัด',
      mapKey: 'pattani',
      badgeColor: 'bg-blue-600 text-white',
      highlightBorder: 'border-blue-500',
      incidentCount: 3,
    },
    {
      id: 'narathiwat',
      title: '3. จว.นราธิวาส',
      subTitle: 'ภ.จว.นราธิวาส & สภ.ในสังกัด',
      mapKey: 'narathiwat',
      badgeColor: 'bg-amber-600 text-white',
      highlightBorder: 'border-amber-500',
      incidentCount: 3,
    },
    {
      id: 'songkhla_risk',
      title: '4. เสี่ยงภัยสงขลา',
      subTitle: '4 อำเภอ 8 สภ.ชายแดน',
      mapKey: 'songkhla_risk',
      badgeColor: 'bg-rose-600 text-white',
      highlightBorder: 'border-rose-500',
      incidentCount: 4,
    },
    {
      id: 'songkhla_all',
      title: 'ภ.จว.สงขลา (ทั้งหมด)',
      subTitle: 'รวมทั้ง 16 อำเภอ 36 สภ.',
      mapKey: 'songkhla',
      badgeColor: 'bg-teal-700 text-white',
      highlightBorder: 'border-teal-500',
      incidentCount: 4,
    },
    {
      id: 'central',
      title: 'ส่วนกลาง ภ.9',
      subTitle: 'บช.ภ.9 & บก.สส.ภ.9',
      mapKey: 'central',
      badgeColor: 'bg-slate-700 text-white',
      highlightBorder: 'border-slate-500',
      incidentCount: 14,
    },
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label / Header with Incident Dossier Quick Access */}
      <div className="flex flex-wrap items-center justify-between px-1 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <span className="text-xs font-bold font-['Prompt'] text-slate-800">
            ช่องเลือกดูตามแต่ละจังหวัด (แผนที่สมจริงระดับยุทธวิธี)
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline-block">
            • คลิกเลือกดูข้อมูลสถานภาพกำลังพลประจำจังหวัด
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenIncidentsModal && (
            <button
              type="button"
              onClick={() => onOpenIncidentsModal(selectedZone === 'all' ? 'all' : selectedZone)}
              className="text-xs bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-1 rounded-lg shadow-xs transition flex items-center gap-1.5 active:scale-95 animate-pulse"
              title="เปิดดูภาพและรายงานเหตุการณ์ก่อการร้าย"
            >
              <Flame className="w-3.5 h-3.5 text-amber-200 fill-amber-300" />
              <span>🚨 คลิกดูภาพเหตุการณ์ก่อการร้าย</span>
            </button>
          )}

          {selectedZone !== 'all' && (
            <button
              onClick={() => onSelectZone('all')}
              className="text-[11px] font-semibold text-sky-700 hover:text-sky-900 underline flex items-center gap-1 active:scale-95"
            >
              <span>↺ ดูครบทุกพื้นที่</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Grid of Province Boxes with Realistic Mini-Maps */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
        {provinceCards.map((card) => {
          const isSelected = selectedZone === card.id;
          const stats = getZoneStats(card.id);

          return (
            <div
              key={card.id}
              onClick={() => onSelectZone(card.id)}
              className={`relative flex flex-col p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? `bg-white shadow-md ring-2 ring-sky-500/70 ${card.highlightBorder} border-transparent`
                  : 'bg-white hover:bg-slate-50/90 border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Top row: Mini Map + Title */}
              <div className="flex items-start gap-2 mb-1.5">
                {/* Ultra-realistic Interactive Mini Map */}
                <div
                  className="flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenIncidentsModal) {
                      onOpenIncidentsModal(card.mapKey);
                    } else {
                      onSelectZone(card.id);
                    }
                  }}
                  title="คลิกที่แผนที่นี้เพื่อเปิดดูรูปเหตุการณ์ก่อการร้ายทันที"
                >
                  <ProvinceMiniMap
                    provinceKey={card.mapKey}
                    size="xs"
                    active={isSelected}
                    onClickMap={() => {
                      if (onOpenIncidentsModal) {
                        onOpenIncidentsModal(card.mapKey);
                      }
                    }}
                  />
                </div>

                {/* Province Title */}
                <div className="min-w-0 flex-1">
                  <div className={`text-xs font-bold font-['Prompt'] truncate ${isSelected ? 'text-sky-950 font-black' : 'text-slate-800'}`}>
                    {card.title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate leading-none mt-0.5">
                    {card.subTitle}
                  </div>
                </div>
              </div>

              {/* Bottom stats row inside each province card */}
              <div className="mt-auto pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500">
                  <strong className="text-slate-700 font-bold">{stats.count}</strong> หน่วย
                </span>
                <span className="text-emerald-700 font-semibold">
                  {stats.occ}/{stats.pos} ({stats.fillRate}%)
                </span>
              </div>

              {/* Selected indicator pill */}
              {isSelected && (
                <div className="absolute -top-1 -right-1 flex h-2.5 w-2.5 pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-600"></span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
