We are going to build an electron application call The new reader

## Development Guidelines
You must use VScode tools whenever posible as described in .claude/vscode.md

### Communication Style

- **No permission-seeking** - Don't ask for validation before executing work. Execute directly and report results.
- Example: ❌ "Should I update this file?" → ✅ Just update it and report what was done.
- This keeps interactions efficient and focused on delivering results.

### Code Quality & Style Guidelines

**Strict Minimalism**
- **Write only what's needed now** - Never write code for future use or "just in case"
- **No premature types/interfaces** - Only create types when actually using them
- Example: Don't create `Article` and `FeedInfo` types until you need them

**Import Statements**
- **Always use ES6 imports** - Never use CommonJS `require()`
- **Create `.d.ts` files** - When libraries lack TypeScript types, create declaration files in `src/main/types/`
- Example: `import opml from 'opml'` not `const opml = require('opml')`

**No Comments**
- **Code must be self-documenting** - Remove all comments including JSDoc
- **Clear naming over comments** - Function names and types should explain intent
- Example: ❌ `/** Get OPML file path */` → ✅ `getOpmlFilePath(baseDir: string)`

**Prefer Libraries Over Custom Code**
- **Question complexity** - When custom code exceeds ~50 lines, search for existing libraries
- **Research first** - Use WebSearch to find well-maintained npm packages
- Example: Replaced 97 lines of regex-based OPML parsing with `opml` library

**Error Handling**
- **Let errors propagate** - Don't hide errors with empty try-catch blocks returning defaults
- **Handle at higher levels** - Error handling belongs in IPC handlers/API layer, not service functions
- **Throw named errors, not booleans** - Functions work or throw descriptive error classes
- **Custom error classes** - Store in `src/main/types/errors.ts` extending Error
- **Error class design** - Include relevant context (URL, operation name) in error message, accept optional original error for message chaining
- Example: `addFeed(): void` throws `FeedAlreadyExistsError` instead of returning `boolean`
- Example: `FetchFailedError` takes `(url: string, originalError?: Error)` to capture and wrap underlying errors

### Git Commits

- **Single-line conventional commits** - All commits must be one line only
- **Format**: `emoji type: description` (e.g., `♻️ refactor: extract theme switcher into reusable component`)
- **No footers** - Do NOT add "Generated with Claude Code", co-authoring credits, or multi-line messages
- **Types with emojis**:
  - ✨ feat: New features
  - 🐛 fix: Bug fixes
  - 📝 docs: Documentation changes
  - ♻️ refactor: Code restructuring
  - 🎨 style: Code formatting
  - ⚡️ perf: Performance improvements
  - ✅ test: Tests
  - 🧑‍💻 chore: Tooling/maintenance
  - 🔒 security: Security improvements

### Planning Complex Features

When planning new features or large changes:

1. **Ask clarifying questions systematically** before creating a plan
   - Ask about storage mechanisms, data persistence, library preferences
   - Ask about backend vs frontend processing
   - Ask about UI/UX patterns and layouts
   - Ask about what data to display and validation requirements
   - Ask about execution scope ("no more code than needed")
   - Get ALL clarifications before proceeding to plan (prevents rework)

2. **Create incremental, iterative plans** that are:
   - **Independently testable** - Each step has clear testing criteria
   - **Building on previous steps** - Later steps depend on earlier work
   - **Persisted in `.claude/` folder** - Save plans as markdown files (e.g., `stage-one.md`, `feature-x.md`)
   - **Detailed with test criteria** - Each step specifies what to test and how to validate
   - **Minimal scope** - Only add code when a phase requires it, never preemptively

3. **Structure plans for step-by-step implementation**
   - Break complex features into manageable phases
   - Each phase contains numbered steps with specific deliverables
   - Include testing checklist at the end
   - Example: Phase 1 (Setup) → Phase 2 (Backend) → Phase 3 (Frontend) → Phase 4+ (Features)

## React Component Patterns

### Component State Encapsulation

When extracting UI features into React components, encapsulate state management within the component itself:

- **Internal state management** - Components should manage their own state and side effects (e.g., `ThemeSwitcher` manages theme state internally and applies `data-theme` to the document)
- **Optional callbacks** - Export interfaces with optional callback props to allow parent customization without tight coupling
- **Benefits** - Parent components remain minimal and focused, components are reusable, state is co-located with the logic that uses it

Example: `ThemeSwitcher` component manages theme state internally with optional `onThemeChange` callback:

```tsx
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
    <button onClick={toggleTheme} className="btn btn-sm btn-ghost gap-2">
      {theme === 'flexokilight' ? '🌙' : '☀️'}
    </button>
  )
}
```

## Service Architecture Patterns

### Class-Based Services for Stateful Operations

When a service requires the same configuration parameter (like a file path) across multiple method calls, use a class-based pattern instead of standalone functions to eliminate parameter duplication:

**Convert from function-based to class-based when:**
- Multiple functions share the same required parameter
- The parameter represents service state that's accessed repeatedly
- You want to simplify the API at call sites

**Example - OPML Service Refactor:**

Instead of:
```typescript
addFeed(testFilePath, feed)
readOpmlFile(testFilePath)
writeOpmlFile(testFilePath, feeds)
```

Use:
```typescript
const opmlService = new OpmlService(testFilePath)
opmlService.addFeed(feed)
opmlService.readOpmlFile()
opmlService.writeOpmlFile(feeds)
```

**Benefits:**
- Eliminates parameter duplication at call sites
- Encapsulates configuration state (file path) within the service instance
- Cleaner, more intuitive API
- Easier to test with different configurations (create new instance per test)
- Foundation for adding shared state in the future

### Private Helper Methods in Services

Keep internal helper methods private; only expose the public API that consumers should use.

**Benefits:**
- Hides implementation details (e.g., OPML parsing internals)
- Reduces cognitive load on API users
- Allows internal refactoring without breaking external code
- Clear separation between public contract and private implementation

**Example:**
```typescript
export class OpmlService {
  private parseOpmlSync(xmlContent: string): OpmlStructure { ... }
  private stringifyOpmlSync(opmlObject: OpmlStructure): string { ... }

  // Public API only
  readOpmlFile(): Feed[] { ... }
  writeOpmlFile(feeds: Feed[]): void { ... }
  addFeed(feed: Feed): void { ... }
  getFeeds(): Feed[] { ... }
}
```

### Function Control Flow Pattern: Result Variable

Structure async functions to always have the return statement at the end, not inside try blocks. Initialize result with safe defaults, then update conditionally on success:

**Pattern:**
1. Initialize result variable with default/safe values
2. Try to fetch/process data
3. If successful, update result with actual values using explicit `if` statements
4. Catch errors and throw named error classes
5. Return result at the end

**Benefits:**
- Return statement is always at the function's end, making control flow clearer
- Result is always defined, initialized with sensible defaults
- Easier to reason about what happens on success vs. failure
- Uses explicit conditionals instead of `||` operators (more readable)

**Example:**
```typescript
async validateAndFetchFeed(url: string, parser?: Parser): Promise<FeedInfo> {
  const rssParser = parser || new Parser()

  // Initialize result with defaults
  const result: FeedInfo = {
    title: 'Untitled Feed',
    description: '',
    feedUrl: url
  }

  try {
    const feed = await rssParser.parseURL(url) as any
    // Update result only if values exist
    if (feed.title) {
      result.title = feed.title
    }
    if (feed.description) {
      result.description = feed.description
    }
  } catch (error) {
    throw new FetchFailedError(url, error as Error)
  }

  // Single return point at the end
  return result
}
```

**Avoid:**
```typescript
// ❌ Return inside try block, unclear structure
try {
  const feed = await rssParser.parseURL(url)
  return {
    title: feed.title || 'Untitled Feed',
    description: feed.description || '',
    feedUrl: url
  }
} catch (error) {
  throw new FetchFailedError(url, error as Error)
}
```

## The New Reader - RSS Feed Application

### Architecture & Dependencies

**Storage**: OPML file format stored in Electron's user data directory (`app.getPath('userData')`)

**Core Libraries**:
- `rss-parser` (v3.13.0) - Parses RSS and Atom feeds with built-in TypeScript support
- `opml` (v0.5.7) - Parses and generates OPML files for feed storage
- Node.js built-in `fs` module for file operations (no external file utils needed)

**Key Design Decisions**:
- Use Node.js built-in `fs` module instead of `fs-extra`
- Parse feeds in the main process (backend)
- Store all feeds in a single OPML file in userData directory
- Support both RSS and Atom feed formats

**TypeScript Type Definitions**:
- `@types/rss-parser` doesn't exist on npm, but rss-parser has built-in TS support
- `@types/opml` doesn't exist on npm; create custom type declaration file in `src/main/types/opml.d.ts`

## File Operations Best Practices

### Precise Content Matching for Edit Operations

When using `replace_lines_code` tool, ensure exact content matching to avoid validation failures:

- **Read with exact line ranges** - When content validation fails, use targeted `read_file_code` calls with specific line ranges to get precise content
- **Account for whitespace** - Line content includes all leading/trailing whitespace exactly as it appears in the file
- **Smaller ranges** - Use smaller line ranges to avoid confusion with formatting differences and ensure accurate matching

Example: If `replace_lines_code` fails, read the specific lines first:
```
read_file_code with startLine: 8, endLine: 16
→ Use the exact output as originalCode parameter
```

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
