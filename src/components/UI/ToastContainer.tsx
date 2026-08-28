import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg bg-white transition-all transform translate-y-0 text-sm ${
              isSuccess
                ? 'border-[#26734D]/30 text-[#171717]'
                : isError
                ? 'border-[#C62828]/30 text-[#171717]'
                : isWarning
                ? 'border-[#A87516]/30 text-[#171717]'
                : 'border-[#E5E3DE] text-[#171717]'
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#26734D]" />}
              {isError && <XCircle className="w-4 h-4 text-[#C62828]" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-[#A87516]" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-[#4C5D8A]" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#171717] leading-snug">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#6B6B6B] hover:text-[#171717] transition-colors p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
