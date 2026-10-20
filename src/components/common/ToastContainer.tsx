import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAdmin();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-wrapper">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let colorClass = 'toast-success';
        if (toast.type === 'error') {
          Icon = AlertCircle;
          colorClass = 'toast-error';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          colorClass = 'toast-warning';
        } else if (toast.type === 'info') {
          Icon = Info;
          colorClass = 'toast-info';
        }

        return (
          <div key={toast.id} className={`toast-card ${colorClass}`}>
            <div className="toast-icon">
              <Icon size={18} />
            </div>
            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              <div className="toast-msg">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="toast-close"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
