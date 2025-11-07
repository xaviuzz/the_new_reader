import React from 'react'

export interface ModalHeaderProps {
  title: string
}

export function ModalHeader({ title }: ModalHeaderProps): React.JSX.Element {
  return <h3 className="font-bold text-lg">{title}</h3>
}
