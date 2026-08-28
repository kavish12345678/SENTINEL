import { useApp } from '../../context/AppContext';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const colors = {
  success: 'bg-green-500/10 border-green-500/40 text-green-400',
  warning: 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400',
  error: 'bg-red-500/10 border-red-500/40 text-red-400',
  info: 'bg-blue-500/10 border-blue-500/40 text-blue-400',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur shadow-xl animate-in slide-in-from-right duration-300 ${colors[toast.type]}`}
          >
            <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
