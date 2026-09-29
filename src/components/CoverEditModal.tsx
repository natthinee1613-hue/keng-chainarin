import React, { useState } from 'react';
import {
  X,
  Check,
  Palette,
  Image as ImageIcon,
  Type,
  Sparkles,
  Upload,
  Trash2,
  RotateCcw,
  Sliders,
  Eye,
  SlidersHorizontal,
  ShieldCheck,
  Monitor,
  Lock,
} from 'lucide-react';
import { CoverConfig, COVER_THEMES, CoverThemeId, DEFAULT_COVER_CONFIG } from '../types/cover';
import { PoliceEmblem } from './PoliceEmblem';
import { compressImageFile } from '../utils/persistentCover';

interface CoverEditModalProps {
  isOpen: boolean;
  config: CoverConfig;
  onClose: () => void;
  onSave: (newConfig: CoverConfig) => void;
}

export const CoverEditModal: React.FC<CoverEditModalProps> = ({
  isOpen,
  config,
  onClose,
  onSave,
}) => {
  const [formState, setFormState] = useState<CoverConfig>({ ...config });
  const [activeTab, setActiveTab] = useState<'text' | 'theme' | 'image' | 'effects'>('text');
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentTheme = COVER_THEMES[formState.themeId] || COVER_THEMES['royal-navy'];

  // Handle custom image upload with automatic compression
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('กรุณาเลือกไฟล์รูปภาพ (PNG, JPG, JPEG, WEBP)');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('ขนาดไฟล์ภาพไม่เกิน 15 MB');
      return;
    }

    setUploadError(null);
    compressImageFile(file)
      .then((compressedDataUrl) => {
        setFormState((prev) => ({
          ...prev,
          imageUrl: compressedDataUrl,
        }));
      })
      .catch((err) => {
        setUploadError('เกิดข้อผิดพลาดในการประมวลผลรูปภาพ: ' + (err?.message || ''));
      });
  };

  const handleRemoveImage = () => {
    // Reset to guaranteed official SVG banner so cover image is never empty
    setFormState((prev) => ({
      ...prev,
      imageUrl: DEFAULT_COVER_CONFIG.imageUrl || '/images/police_region_9_banner.svg',
    }));
  };

  const handleResetToDefault = () => {
    if (window.confirm('คุณต้องการรีเซ็ตการตั้งค่าหน้าปกกลับเป็นค่ามาตรฐานเริ่มต้นใช่หรือไม่?')) {
      setFormState({ ...DEFAULT_COVER_CONFIG });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-['Prompt'] text-white">
                ปรับแต่งหน้าปกและธีมสี (Cover Customizer)
              </h2>
              <p className="text-xs text-slate-400">
                แก้ไขข้อความหน้าปก เปลี่ยนธีมสี ใส่รูปภาพพื้นหลัง และปรับเอฟเฟกต์ภาพเคลื่อนไหว
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 gap-2 overflow-x-auto text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('text')}
            className={`py-3 px-3.5 font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'text'
                ? 'border-amber-500 text-amber-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>1. ข้อความหน้าปก</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`py-3 px-3.5 font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'theme'
                ? 'border-amber-500 text-amber-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>2. ธีมและสีสัน</span>
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`py-3 px-3.5 font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'image'
                ? 'border-amber-500 text-amber-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>3. รูปภาพหน้าปก</span>
            {formState.imageUrl && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('effects')}
            className={`py-3 px-3.5 font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'effects'
                ? 'border-amber-500 text-amber-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>4. แอนิเมชัน & เอฟเฟกต์</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs sm:text-sm">
          {/* TAB 1: TEXT CUSTOMIZATION */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  หัวข้อหลักหน้าปก (Main Title)
                </label>
                <input
                  type="text"
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  placeholder="เช่น ระบบรายงานและจัดการสถานภาพกำลังพลข้าราชการตำรวจ ภ.9"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  คำบรรยายพื้นที่ / ภารกิจ (Subtitle)
                </label>
                <input
                  type="text"
                  value={formState.subtitle}
                  onChange={(e) => setFormState({ ...formState, subtitle: e.target.value })}
                  placeholder="เช่น พื้นที่ 3 จังหวัดชายแดนภาคใต้ (ยะลา, ปัตตานี, นราธิวาส) และ 4 อำเภอเสี่ยงภัย จว.สงขลา"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    หน่วยงาน / สังกัด (Unit)
                  </label>
                  <input
                    type="text"
                    value={formState.unitName}
                    onChange={(e) => setFormState({ ...formState, unitName: e.target.value })}
                    placeholder="กองบัญชาการตำรวจภูธรภาค 9 • สำนักงานตำรวจแห่งชาติ"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ชื่อผู้บังคับบัญชา / ตำแหน่ง (Commander Title)
                  </label>
                  <input
                    type="text"
                    value={formState.commanderName}
                    onChange={(e) => setFormState({ ...formState, commanderName: e.target.value })}
                    placeholder="พลตำรวจโท ผู้บัญชาการตำรวจภูธรภาค 9"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ปีงบประมาณ (Fiscal Year)
                  </label>
                  <input
                    type="text"
                    value={formState.fiscalYear}
                    onChange={(e) => setFormState({ ...formState, fiscalYear: e.target.value })}
                    placeholder="ประจำปีงบประมาณ พ.ศ. 2568 - 2569"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ข้อมูลวันที่ / อัตราครองคน (Status Date)
                  </label>
                  <input
                    type="text"
                    value={formState.dateText}
                    onChange={(e) => setFormState({ ...formState, dateText: e.target.value })}
                    placeholder="ข้อมูลสถานภาพและอัตราครองคนปัจจุบัน (126 หน่วยงาน)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  คำขวัญ / คติพจน์ประจำหน่วย (Motto / Announcement)
                </label>
                <textarea
                  rows={2}
                  value={formState.mottoText}
                  onChange={(e) => setFormState({ ...formState, mottoText: e.target.value })}
                  placeholder="“ผู้พิทักษ์สันติราษฎร์ พิทักษ์รับใช้ประชาชน เสียสละเพื่อความมั่นคงของแผ่นดินใต้”"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Mode switch */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block font-semibold text-slate-800 mb-2">
                  รูปแบบการแสดงผลหน้าปก (Display Mode)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormState({ ...formState, coverMode: 'banner' })}
                    className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
                      formState.coverMode === 'banner'
                        ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                        : 'border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-6 bg-slate-800 rounded border border-slate-700 flex items-center justify-center text-[10px] text-amber-400 font-bold">
                      Banner
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">โหมดแบนเนอร์ส่วนหัว</div>
                      <div className="text-[11px] text-slate-500">กระชับ เห็นตารางข้อมูลด้านล่างทันที</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormState({ ...formState, coverMode: 'full' })}
                    className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
                      formState.coverMode === 'full'
                        ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                        : 'border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 bg-slate-900 rounded border border-slate-700 flex flex-col items-center justify-center text-[9px] text-amber-400 font-bold">
                      Cover
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">โหมดหน้าปกรายงานเต็มจอ</div>
                      <div className="text-[11px] text-slate-500">สมบูรณ์แบบ สง่างามดุจปกรายงานผู้บริหาร</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THEMES & COLOR CUSTOMIZATION */}
          {activeTab === 'theme' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                เลือกธีมสีประจำหน้าปกและระบบ ทุกธีมได้รับการออกแบบตามคู่มืออัตลักษณ์ความมั่นคงและตำรวจไทย:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {(Object.keys(COVER_THEMES) as CoverThemeId[]).map((themeKey) => {
                  const t = COVER_THEMES[themeKey];
                  const isSelected = formState.themeId === themeKey;

                  return (
                    <div
                      key={themeKey}
                      onClick={() => setFormState({ ...formState, themeId: themeKey })}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-6 h-6 rounded-full shadow-inner border border-white/40 ${t.swatchClass}`}
                          />
                          <span className="font-bold text-slate-900 font-['Prompt'] text-sm">
                            {t.name}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                            ✓
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-500">{t.subtitle}</p>

                      {/* Mini preview bar */}
                      <div
                        className={`h-7 rounded-lg bg-gradient-to-r ${t.bgGradient} p-1 flex items-center justify-between px-2 text-[10px] text-white/90 font-mono`}
                      >
                        <span style={{ color: t.accentColor }}>● ตำรวจภูธรภาค 9</span>
                        <span className="text-[9px] opacity-75">126 หน่วย</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: COVER IMAGE UPLOAD & ADJUSTMENT */}
          {activeTab === 'image' && (
            <div className="space-y-5">
              {/* Permanent Storage Notice */}
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>ระบบบันทึกถาวร (Permanent Sync):</strong> รูปภาพหน้าปกถูกบีบอัดความละเอียดสูงและบันทึกอัตโนมัติ ติดแน่นไปตลอดแม้จะเผยแพร่แอปหรือเปิดดูบนเครื่องอื่น
                </span>
              </div>

              {/* Official Built-in Presets */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <label className="font-bold text-slate-900 text-sm flex items-center justify-between">
                  <span>เลือกภาพหน้าปกทางการของระบบ (Official Presets)</span>
                  <span className="text-xs font-normal text-slate-500">คลิกเลือกได้ทันที</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setFormState((prev) => ({
                        ...prev,
                        imageUrl: '/images/police_region_9_banner.svg',
                        imageOpacity: 0.55,
                        imageBlur: 0,
                      }))
                    }
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                      formState.imageUrl === '/images/police_region_9_banner.svg'
                        ? 'border-amber-500 bg-amber-50/50 shadow-sm ring-2 ring-amber-400/40'
                        : 'border-slate-300 bg-white hover:border-slate-400'
                    }`}
                  >
                    <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0 border border-slate-700">
                      <img
                        src="/images/police_region_9_banner.svg"
                        alt="Official Banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        🏛️ ตราสัญลักษณ์ & แบนเนอร์ทางการ ภ.9
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        ภาพเวกเตอร์ HD กองบัญชาการตำรวจภูธรภาค 9
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 text-sm">
                    หรืออัปโหลดรูปภาพของท่านเอง (Custom Upload)
                  </label>
                  {formState.imageUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1 font-semibold"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>คืนค่าภาพทางการเริ่มต้น</span>
                    </button>
                  )}
                </div>

                {uploadError && (
                  <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-lg">
                    {uploadError}
                  </div>
                )}

                {/* Upload drag/drop box */}
                <label className="border-2 border-dashed border-slate-300 hover:border-amber-500 bg-white hover:bg-amber-50/30 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition text-center group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-amber-100 flex items-center justify-center text-slate-500 group-hover:text-amber-700 mb-2 transition">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-800 text-sm group-hover:text-amber-900">
                    คลิกเพื่ออัปโหลดรูปภาพใหม่ หรือลากไฟล์มาวางที่นี่
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    ระบบจะบีบอัดและปรับสัดส่วนภาพอัตโนมัติ บันทึกถาวรไม่ให้หายแม้เผยแพร่
                  </span>
                </label>

                {/* Preview if uploaded */}
                {formState.imageUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-300 max-h-48 bg-slate-900">
                    <img
                      src={formState.imageUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                      style={{
                        opacity: formState.imageOpacity,
                        filter: `blur(${formState.imageBlur}px)`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-3 text-white text-xs font-medium">
                      ตัวอย่างรูปภาพเมื่อแสดงบนหน้าปก (ปรับค่าความโปร่งใสและเบลอด้านล่าง)
                    </div>
                  </div>
                )}
              </div>

              {/* Sliders for Opacity and Blur */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>ความเข้ม / ความโปร่งใสรูปภาพ (Opacity)</span>
                    <span className="font-mono font-bold text-amber-700">
                      {Math.round(formState.imageOpacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.85"
                    step="0.05"
                    value={formState.imageOpacity}
                    onChange={(e) =>
                      setFormState({ ...formState, imageOpacity: parseFloat(e.target.value) })
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>บางเบา (เน้นอ่านตัวหนังสือ)</span>
                    <span>ชัดเจน</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>ความเบลอของพื้นหลัง (Blur Effect)</span>
                    <span className="font-mono font-bold text-amber-700">
                      {formState.imageBlur} px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={formState.imageBlur}
                    onChange={(e) =>
                      setFormState({ ...formState, imageBlur: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>คมชัด (0px)</span>
                    <span>นุ่มนวล (10px)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANIMATIONS & SPECIAL EFFECTS */}
          {activeTab === 'effects' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                ตั้งค่าเอฟเฟกต์ภาพเคลื่อนไหวและกราฟิกเรดาร์ยุทธวิธีบนหน้าปก:
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer select-none">
                  <div>
                    <div className="font-bold text-slate-900">อนุภาคแสงล่องลอย (Floating Particles)</div>
                    <div className="text-xs text-slate-500">
                      จุดละอองแสงและเส้นเชื่อมโยงโครงข่ายความมั่นคงเคลื่อนไหวอย่างนุ่มนวล
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formState.enableParticles}
                    onChange={(e) =>
                      setFormState({ ...formState, enableParticles: e.target.checked })
                    }
                    className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer select-none">
                  <div>
                    <div className="font-bold text-slate-900">เรดาร์ตรวจจับ 360° (Tactical Radar Sweep)</div>
                    <div className="text-xs text-slate-500">
                      วงล้อเรดาร์ความมั่นคงกวาดรอบทิศทาง พร้อมวงคลื่นชีพจรขยายตัว
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formState.enableRadar}
                    onChange={(e) =>
                      setFormState({ ...formState, enableRadar: e.target.checked })
                    }
                    className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer select-none">
                  <div>
                    <div className="font-bold text-slate-900">แสงเรืองออร่าตราโล่ตำรวจ (Pulsing Crest Glow)</div>
                    <div className="text-xs text-slate-500">
                      แสงเปล่งประกายและวงแหวนหมุนรอบตราโล่เขนพระแสงดาบ ภ.๙
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formState.enableGlow}
                    onChange={(e) =>
                      setFormState({ ...formState, enableGlow: e.target.checked })
                    }
                    className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400"
                  />
                </label>
              </div>

              {/* Animation Speed */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block font-semibold text-slate-800 text-xs">
                  ความเร็วการเคลื่อนไหวของแอนิเมชัน (Animation Speed)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['slow', 'normal', 'fast'] as const).map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => setFormState({ ...formState, animationSpeed: spd })}
                      className={`py-2 px-3 rounded-lg border text-center font-medium transition ${
                        formState.animationSpeed === spd
                          ? 'border-amber-500 bg-amber-100 text-amber-900 font-bold'
                          : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {spd === 'slow' ? 'ช้า นุ่มนวล' : spd === 'normal' ? 'ปานกลาง' : 'รวดเร็ว คล่องตัว'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LIVE MINI PREVIEW AT BOTTOM OF MODAL */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>ภาพจำลองหน้าปกแบบสด (Live Preview):</span>
            </div>

            <div
              className={`relative overflow-hidden rounded-xl p-4 text-white shadow-inner bg-gradient-to-r ${currentTheme.bgGradient} border ${currentTheme.borderGlow}`}
            >
              {formState.imageUrl && (
                <div
                  className="absolute inset-0 bg-cover bg-center pointer-events-none"
                  style={{
                    backgroundImage: `url(${formState.imageUrl})`,
                    opacity: formState.imageOpacity,
                    filter: `blur(${formState.imageBlur}px)`,
                  }}
                />
              )}
              <div className="relative z-10 flex items-center gap-3">
                <PoliceEmblem size="sm" accentColor={currentTheme.accentColor} animated={formState.enableGlow} />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] text-amber-300/90 font-mono tracking-wider truncate">
                    {formState.unitName}
                  </div>
                  <h4 className="font-bold text-sm text-white font-['Prompt'] truncate">
                    {formState.title}
                  </h4>
                  <div className="text-[11px] text-slate-300 truncate">
                    {formState.subtitle}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-200 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>รีเซ็ตเป็นค่าเริ่มต้น</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>บันทึกการปรับแต่ง</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
