import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from './Toast';
import type { ToastProps } from './Toast';

export interface ToastData extends Omit<ToastProps, 'id' | 'onClose'> {
  id: string;
}

interface ToastContainerProps {
  toasts: ToastData[];
  onRemoveToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[60] space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={onRemoveToast}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
