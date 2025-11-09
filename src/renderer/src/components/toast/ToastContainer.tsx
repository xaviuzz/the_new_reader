import { useState, useCallback } from 'react'
import { Toast, type ToastType } from './Toast'
import { ToastContext } from './ToastContext'

export interface ToastMessage {
  id: string
  message: string
  type: ToastType
}

export interface ToastContainerProps {
  children: React.ReactNode
}

export function ToastContainer({ children }: ToastContainerProps): React.JSX.Element {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast toast-bottom toast-end gap-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
