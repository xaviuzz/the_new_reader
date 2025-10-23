We are going to build an electron application call The new reader

## Development Guidelines

### Tool Usage

- **Use VS Code MCP tools confidently** - Don't ask for permission to use `mcp__vscode-mcp-server__*` tools. They are available and designed for this environment. Use them directly when appropriate for file operations, code analysis, and terminal commands.
- Refer to [.claude/vscode.md](.claude/vscode.md) for detailed VS Code tool usage patterns and when to prioritize IDE tools over manual commands.

### Communication Style

- **No permission-seeking** - Don't ask for validation before executing work. Execute directly and report results.
- Example: ❌ "Should I update this file?" → ✅ Just update it and report what was done.
- This keeps interactions efficient and focused on delivering results.

## CSS Framework Integration: DaisyUI + Tailwind CSS

### Setup for Electron + Vite Projects

When integrating DaisyUI and Tailwind CSS into this project:

1. **Use Tailwind CSS 3.x** (not 4.x) for better stability with Electron/Vite
   - Tailwind 4.x requires `@tailwindcss/postcss` and `@import "tailwindcss"` syntax which can be problematic
   - Tailwind 3.x uses standard `@tailwind` directives that work reliably with electron-vite

2. **PostCSS Configuration**

   ```js
   // postcss.config.js
   export default {
     plugins: {
       tailwindcss: {},
       autoprefixer: {}
     }
   }
   ```

3. **CSS Entry Point** - Use standard Tailwind directives in base CSS:

   ```css
   /* src/renderer/src/assets/base.css */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. **Tailwind Config with DaisyUI**

   ```js
   // tailwind.config.js
   export default {
     content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}'],
     plugins: [require('daisyui')]
   }
   ```

5. **Installation Command**
   ```bash
   npm install -D tailwindcss@^3 postcss autoprefixer daisyui
   ```

### Custom DaisyUI v5 Themes

When implementing custom color themes (e.g., Flexoki):

1. **Define themes in CSS, not in config** - DaisyUI v5 doesn't reliably compile custom themes from `tailwind.config.js`. Instead, define them in `src/renderer/src/assets/base.css` using the `[data-theme='themename']` selector:

   ```css
   [data-theme='flexokilight'] {
     --color-primary: #205ea6;
     --color-primary-content: #fffcf0;
     --color-base-100: #fffcf0;
     --color-base-200: #f2f0e5;
     --color-base-300: #e6e4d9;
     --color-base-content: #100f0f;
     --color-secondary: #5e409d;
     --color-secondary-content: #fffcf0;
     --color-accent: #24837b;
     --color-accent-content: #fffcf0;
     --color-neutral: #6f6e69;
     --color-neutral-content: #e6e4d9;
     --color-info: #205ea6;
     --color-info-content: #fffcf0;
     --color-success: #66800b;
     --color-success-content: #fffcf0;
     --color-warning: #ad8301;
     --color-warning-content: #100f0f;
     --color-error: #af3029;
     --color-error-content: #fffcf0;
   }
   ```

2. **Include all required color variables** - Themes must define:
   - Base colors: `--color-base-100`, `--color-base-200`, `--color-base-300`, `--color-base-content`
   - Semantic colors: `primary`, `secondary`, `accent`, `neutral` (each with `-content` variant)
   - Status colors: `info`, `success`, `warning`, `error` (each with `-content` variant)

3. **Keep config minimal** - Use `daisyui: { themes: ['light', 'dark'] }` in `tailwind.config.js` and handle custom themes entirely in CSS.

4. **Apply themes in React** - Use `document.documentElement.setAttribute('data-theme', themeName)` to switch themes at runtime.

### Common Issues & Solutions

- **Tailwind 4.x error**: "PostCSS plugin has moved to a separate package" → Use Tailwind 3.x instead
- **Styles not applying**: Ensure CSS is imported in `src/renderer/src/main.tsx` before React renders
- **DaisyUI components unstyled**: Verify `content` paths in `tailwind.config.js` include all template files
- **Custom themes not showing**: Define themes in CSS (`base.css`) with `[data-theme='...']` selectors, not in config. Ensure all required color variables are included.
