import React from 'react';
import { useToast } from '../../hooks/useToast';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className="toast" onAnimationEnd={() => removeToast(toast.id)}>
          <span style={{ fontSize: '16px' }}>{toast.icon}</span> {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;