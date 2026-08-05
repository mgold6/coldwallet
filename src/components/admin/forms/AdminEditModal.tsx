"use client";

import { ReactNode, useEffect } from "react";

interface AdminEditModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit?: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AdminEditModal({
  open,
  title,
  onClose,
  onSubmit,
  children,
  footer,
}: AdminEditModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit?.();
          }}
        >
          <div className="space-y-6 p-6">
            {children}
          </div>

          {footer && (
            <div className="flex justify-end gap-3 border-t border-slate-800 px-6 py-4">
              {footer}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}