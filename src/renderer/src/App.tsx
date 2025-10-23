function App(): React.JSX.Element {
  return (
    <div className='min-h-screen bg-base-100 p-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-4xl font-bold text-base-content mb-8'>
          Welcome to The New Reader
        </h1>

        <div className='card bg-base-200 shadow-xl mb-6'>
          <div className='card-body'>
            <h2 className='card-title'>Getting Started</h2>
            <p className='text-base-content'>
              DaisyUI is now integrated with Tailwind CSS! You can start using DaisyUI components right away.
            </p>
          </div>
        </div>

        <div className='flex gap-4'>
          <button className='btn btn-primary'>Primary Button</button>
          <button className='btn btn-secondary'>Secondary Button</button>
          <button className='btn btn-outline'>Outline Button</button>
        </div>

        <div className='divider my-8'></div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='card bg-base-200'>
            <div className='card-body'>
              <h3 className='card-title'>Card 1</h3>
              <p>Sample DaisyUI card component</p>
            </div>
          </div>
          <div className='card bg-base-200'>
            <div className='card-body'>
              <h3 className='card-title'>Card 2</h3>
              <p>Another DaisyUI card component</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
