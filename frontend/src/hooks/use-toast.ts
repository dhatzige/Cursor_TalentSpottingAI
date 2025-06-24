import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
  onClose: (id: string) => void;
}

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({
      title,
      description,
      variant = 'default',
      duration = 5000,
    }: Omit<Toast, 'id'>) => {
      const id = (++toastId).toString();
      const newToast: Toast = {
        id,
        title,
        description,
        variant,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }

      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toast,
    toasts,
    dismiss,
    dismissAll,
  };
}

// Export the toast function for direct import
export const toast = ({
  title,
  description,
  variant = 'default',
  duration = 5000,
}: Omit<Toast, 'id'>) => {
  // For direct usage, we'll use browser's built-in notification or console
  if (typeof window !== 'undefined') {
    // Simple browser notification fallback
    if (variant === 'destructive') {
      console.error(`${title}: ${description}`);
    } else if (variant === 'success') {
      console.log(`✅ ${title}: ${description}`);
    } else {
      console.info(`${title}: ${description}`);
    }
  }
}; 