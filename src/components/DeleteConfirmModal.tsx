import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  unitName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  unitName,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div>
            <h3 className="font-bold text-lg text-slate-900 font-['Prompt']">
              ยืนยันการลบข้อมูลหน่วยงาน?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              คุณต้องการลบข้อมูลของ <span className="font-bold text-rose-700">"{unitName}"</span> ออกจากระบบใช่หรือไม่?
              การกระทำนี้จะปรับลดยอดรวมกำลังพลของสังกัดโดยอัตโนมัติ
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-medium text-xs sm:text-sm transition"
            >
              ยกเลิก
            </button>
            <button
              onClick={onConfirm}
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              <span>ยืนยันการลบ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
