import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white text-base font-medium transition-all duration-300 max-w-sm w-[90vw] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${type === 'success' ? 'bg-teal-600' : 'bg-red-500'}`}
    >
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
}

interface ToastState {
  message: string;
  type: 'success' | 'error';
  id: number;
}

let toastId = 0;
const listeners: Array<(toast: ToastState | null) => void> = [];

export function showToast(message: string, type: 'success' | 'error' = 'success') {
  const toast: ToastState = { message, type, id: ++toastId };
  listeners.forEach(fn => fn(toast));
}

export function ToastContainer() {
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    listeners.push(setToast);
    return () => {
      const idx = listeners.indexOf(setToast);
      if (idx >= 0) listeners.splice(idx, 1);
    };
  }, []);

  if (!toast) return null;
  return (
    <Toast
      key={toast.id}
      message={toast.message}
      type={toast.type}
      onClose={() => setToast(null)}
    />
  );
}
