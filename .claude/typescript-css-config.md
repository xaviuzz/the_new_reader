# TypeScript & CSS Configuration

## TypeScript Configuration for Nested Components

Ensure `tsconfig.json` includes explicit patterns for all file types:

```json
{
  "include": [
    "src/renderer/src/env.d.ts",
    "src/renderer/src/**/*.ts",
    "src/renderer/src/**/*.tsx",
    "src/preload/*.d.ts"
  ]
}
```

Generic patterns like `**/*` may not match all TypeScript variations. When adding nested component folders, update patterns to explicitly list `.ts` and `.tsx` patterns.

## CSS Framework Integration: DaisyUI + Tailwind CSS

### Setup for Electron + Vite Projects

1. **Use Tailwind CSS 3.x** (not 4.x) - 3.x uses standard `@tailwind` directives that work reliably with electron-vite
2. **PostCSS Configuration**
   ```js
   export default {
     plugins: {
       tailwindcss: {},
       autoprefixer: {}
     }
   }
   ```
3. **CSS Entry Point** - Use standard Tailwind directives in base CSS
4. **Tailwind Config with DaisyUI**
   ```js
   export default {
     content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}'],
     plugins: [require('daisyui')]
   }
   ```
5. **Installation:** `npm install -D tailwindcss@^3 postcss autoprefixer daisyui`

### Custom DaisyUI v5 Themes

1. **Define themes in CSS, not in config** - Use `[data-theme='themename']` selector in `src/renderer/src/assets/base.css`
2. **Include all required color variables** - Base, semantic, and status colors
3. **Keep config minimal** - Use `daisyui: { themes: ['light', 'dark'] }` in tailwind.config.js
4. **Apply themes in React** - Use `document.documentElement.setAttribute('data-theme', themeName)`

### Common Issues & Solutions

- **Tailwind 4.x error** → Use Tailwind 3.x instead
- **Styles not applying** → Ensure CSS imported in `src/renderer/src/main.tsx` before React renders
- **DaisyUI components unstyled** → Verify `content` paths in tailwind.config.js
- **Custom themes not showing** → Define in CSS with `[data-theme='...']` selectors, ensure all required color variables
