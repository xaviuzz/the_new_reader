import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark']
  }
}
