import { useEffect, useState } from 'react'

function App(): React.JSX.Element {
  const [theme, setTheme] = useState<'flexokilight' | 'flexokidark'>('flexokilight')

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'flexokilight' ? 'flexokidark' : 'flexokilight')
  }

  return (
    <div className='min-h-screen bg-base-100 text-base-content transition-colors duration-200'>
      {/* Theme Switcher */}
      <div className='fixed top-4 right-4'>
        <button
          onClick={toggleTheme}
          className='btn btn-sm btn-ghost gap-2'
          title={`Switch to ${theme === 'flexokilight' ? 'dark' : 'light'} mode`}
        >
          {theme === 'flexokilight' ? '🌙' : '☀️'}
        </button>
      </div>

      <div className='p-8'>
        <div className='max-w-2xl mx-auto'>
          <h1 className='text-4xl font-bold mb-2'>
            Welcome to The New Reader
          </h1>
          <p className='text-base-content/70 mb-8'>
            Powered by Flexoki theme
          </p>

          <div className='card bg-base-200 shadow-xl mb-6'>
            <div className='card-body'>
              <h2 className='card-title'>Flexoki Theme Applied</h2>
              <p>
                This app now uses a custom Flexoki theme with beautiful light and dark modes. Click the theme toggle in the top right to switch between them.
              </p>
            </div>
          </div>

          <div className='flex gap-4 flex-wrap'>
            <button className='btn btn-primary'>Primary</button>
            <button className='btn btn-secondary'>Secondary</button>
            <button className='btn btn-accent'>Accent</button>
            <button className='btn btn-outline'>Outline</button>
          </div>

          <div className='divider my-8'></div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='card bg-base-200'>
              <div className='card-body'>
                <h3 className='card-title text-success'>Success State</h3>
                <p className='text-base-content/70'>Sample DaisyUI card component</p>
              </div>
            </div>
            <div className='card bg-base-200'>
              <div className='card-body'>
                <h3 className='card-title text-warning'>Warning State</h3>
                <p className='text-base-content/70'>Another DaisyUI card component</p>
              </div>
            </div>
            <div className='card bg-base-200'>
              <div className='card-body'>
                <h3 className='card-title text-info'>Info State</h3>
                <p className='text-base-content/70'>Information card with blue accent</p>
              </div>
            </div>
            <div className='card bg-base-200'>
              <div className='card-body'>
                <h3 className='card-title text-error'>Error State</h3>
                <p className='text-base-content/70'>Error card with red accent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
