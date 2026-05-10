"use client";

import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  title: string;
  isPermanentDelete: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export default function DeleteConfirmDialog({
  open,
  title,
  isPermanentDelete,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              {isPermanentDelete ? "Delete Permanently?" : "Move to Trash?"}
            </h2>
            <p className="mt-1 text-sm text-gray-500 wrap-anywhere">
              &ldquo;{title}&rdquo; will be {isPermanentDelete ? "permanently deleted" : "moved to the Trashed tab"}.
            </p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isPermanentDelete ? "Delete Permanently" : "Move to Trash"}
          </button>
        </div>
      </div>
    </div>
  );
}
