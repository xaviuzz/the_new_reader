import { createContext } from 'react'
import type { ToastType } from './Toast'

export interface ToastContextType {
  showToast: (message: string, type: ToastType) => void
}

export const ToastContext = createContext<ToastContextType | null>(null)
