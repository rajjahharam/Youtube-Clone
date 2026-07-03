import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal = ({
  open,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-[420px] rounded-2xl bg-[#212121] border border-neutral-700 shadow-2xl p-6 animate-in fade-in zoom-in duration-200">

        <div className="flex items-center gap-3">
          <AlertTriangle
            size={22}
            className="text-red-500"
          />

          <h2 className="text-lg font-semibold text-white">
            Delete comment?
          </h2>
        </div>

        <p className="text-neutral-400 text-sm mt-4 leading-6">
          Deleted comments can't be recovered.
        </p>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onCancel}
            className="cursor-pointer rounded-full px-5 py-2 hover:bg-neutral-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="cursor-pointer rounded-full bg-red-600 px-5 py-2 hover:bg-red-700 transition"
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  );
};

export default DeleteConfirmModal;