import React, { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastProps {
  id: string
  message: string
  type: ToastType
  onClose: (id: string) => void
  autoCloseDuration?: number
}

export function Toast({
  id,
  message,
  type,
  onClose,
  autoCloseDuration = 4000
}: ToastProps): React.JSX.Element {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, autoCloseDuration)

    return () => clearTimeout(timer)
  }, [id, onClose, autoCloseDuration])

  const alertClass = {
    success: 'alert-success',
    error: 'alert-error',
    info: 'alert-info'
  }[type]

  return (
    <div className={`alert ${alertClass} shadow-lg`}>
      <span>{message}</span>
    </div>
  )
}
