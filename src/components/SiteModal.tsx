import { ReactNode, useEffect } from 'react';

export default function SiteModal({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      id="genericModal"
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg overflow-hidden max-w-3xl w-full mx-4">
        <div className="flex justify-end p-2">
          <button id="modalClose" className="text-gray-700 hover:text-crimson font-bold" onClick={onClose}>
            Close ✕
          </button>
        </div>
        <div id="modalContent" className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
