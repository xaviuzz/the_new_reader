import { useState, useEffect } from 'react'

type Theme = 'flexokilight' | 'flexokidark'

export interface ThemeSwitcherProps {
  onThemeChange?: (theme: Theme) => void
}

export function ThemeSwitcher({ onThemeChange }: ThemeSwitcherProps): React.JSX.Element {
  const [theme, setTheme] = useState<Theme>('flexokilight')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    onThemeChange?.(theme)
  }, [theme, onThemeChange])

  const toggleTheme = (): void => {
    setTheme((currentTheme) => (currentTheme === 'flexokilight' ? 'flexokidark' : 'flexokilight'))
  }

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-sm btn-ghost gap-2"
      title={`Switch to ${theme === 'flexokilight' ? 'dark' : 'light'} mode`}
      aria-label={`Current theme: ${theme}`}
    >
      {theme === 'flexokilight' ? '🌙' : '☀️'}
    </button>
  )
}
