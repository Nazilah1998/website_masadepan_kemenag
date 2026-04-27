import React from "react";

export function EditorConfirmDialog({ dialog, onClose }) {
  if (!dialog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {dialog.title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {dialog.description}
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              const fn = dialog.onConfirm;
              onClose();
              if (typeof fn === "function") fn();
            }}
            className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold text-white ${
              dialog.confirmTone === "rose"
                ? "bg-rose-600 hover:bg-rose-700"
                : dialog.confirmTone === "blue"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {dialog.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function EditorToast({ toast }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`rounded-2xl px-4 py-3 text-sm shadow-lg ${
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
        }`}
      >
        {toast.text}
      </div>
    </div>
  );
}
