import React from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ open, onClose, title, children, wide = false }) => {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-md">
      <div role="dialog" aria-modal="true" aria-labelledby="shared-modal-title" className={`my-auto max-h-[min(92vh,900px)] w-full overflow-y-auto rounded-[26px] border border-white/50 bg-white/90 shadow-[0_35px_100px_rgba(0,0,0,0.3)] backdrop-blur-2xl ${wide ? 'max-w-2xl' : 'max-w-lg'}`}>
        <div className="sticky top-0 flex items-center justify-between border-b border-white/60 bg-white/75 px-6 py-4 backdrop-blur-xl">
          <h3 id="shared-modal-title" className="font-display font-semibold text-lg">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition hover:bg-gray-100 hover:text-ink">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
