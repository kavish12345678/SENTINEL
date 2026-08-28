import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, AlertOctagon, X } from 'lucide-react';

const icons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertOctagon,
  info: Info,
};

const toastStyles = {
  success: 'border-[#5F8669]/40 bg-[#151617]/95 text-[#F2F0EA] shadow-[0_8px_24px_rgba(0,0,0,0.5)]',
  warning: 'border-[#C19A5A]/40 bg-[#151617]/95 text-[#F2F0EA] shadow-[0_8px_24px_rgba(0,0,0,0.5)]',
  error: 'border-[#A64444]/40 bg-[#151617]/95 text-[#F2F0EA] shadow-[0_8px_24px_rgba(0,0,0,0.5)]',
  info: 'border-[#292B2D] bg-[#151617]/95 text-[#F2F0EA] shadow-[0_8px_24px_rgba(0,0,0,0.5)]',
};

const iconColors = {
  success: 'text-[#5F8669]',
  warning: 'text-[#C19A5A]',
  error: 'text-[#A64444]',
  info: 'text-[#9A9A96]',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 space-y-2 w-88 max-w-[calc(100vw-2rem)]">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-3.5 rounded-lg border backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-top-2 ${toastStyles[toast.type]}`}
          >
            <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconColors[toast.type]}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#F2F0EA] leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#686A6B] hover:text-[#F2F0EA] transition-colors p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
