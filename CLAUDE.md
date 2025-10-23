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
       autoprefixer: {},
     },
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
     content: [
       './src/renderer/index.html',
       './src/renderer/src/**/*.{js,ts,jsx,tsx}',
     ],
     plugins: [require('daisyui')],
   }
   ```

5. **Installation Command**
   ```bash
   npm install -D tailwindcss@^3 postcss autoprefixer daisyui
   ```

### Common Issues & Solutions
- **Tailwind 4.x error**: "PostCSS plugin has moved to a separate package" → Use Tailwind 3.x instead
- **Styles not applying**: Ensure CSS is imported in `src/renderer/src/main.tsx` before React renders
- **DaisyUI components unstyled**: Verify `content` paths in `tailwind.config.js` include all template files
