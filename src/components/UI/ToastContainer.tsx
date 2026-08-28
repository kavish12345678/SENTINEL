import { AlertTriangle, XCircle, Info, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-14 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none font-mono text-xs">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xs border shadow-2xl bg-[#1c1c16] text-[#e5e2d9] transition-all ${
              isSuccess
                ? 'border-[#e8c178]/50 text-[#e8c178]'
                : isError
                ? 'border-[#ffb4ab] text-[#ffb4ab]'
                : isWarning
                ? 'border-[#e8c178] text-[#e8c178]'
                : 'border-[#464742] text-[#e5e2d9]'
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#e8c178]" />}
              {isError && <XCircle className="w-4 h-4 text-[#ffb4ab]" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-[#e8c178]" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-[#c7c7bf]" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium leading-snug">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#91918a] hover:text-[#e5e2d9] transition-colors p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
