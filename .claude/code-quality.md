# Code Quality & Style Guidelines

## Strict Minimalism
- **Write only what's needed now** - Never write code for future use or "just in case"
- **No premature types/interfaces** - Only create types when actually using them
- Example: Don't create `Article` and `FeedInfo` types until you need them

## Import Statements
- **Always use ES6 imports** - Never use CommonJS `require()`
- **Create `.d.ts` files** - When libraries lack TypeScript types, create declaration files in `src/main/types/`
- Example: `import opml from 'opml'` not `const opml = require('opml')`

## No Comments
- **Code must be self-documenting** - Remove all comments including JSDoc
- **Clear naming over comments** - Function names and types should explain intent
- Example: ❌ `/** Get OPML file path */` → ✅ `getOpmlFilePath(baseDir: string)`

## Prefer Libraries Over Custom Code
- **Question complexity** - When custom code exceeds ~50 lines, search for existing libraries
- **Research first** - Use WebSearch to find well-maintained npm packages
- Example: Replaced 97 lines of regex-based OPML parsing with `opml` library

## Type Safety with External Libraries
- **Use library type definitions directly** - Don't cast to `any`; leverage built-in TypeScript support
- **Create type alias files** - Wrap library types in dedicated files (`src/main/types/rss.ts`) for centralized management
- **Extend library types when needed** - Use intersection types (`&`) to add missing properties without casting
- **Choose generic parameters carefully** - Use `{ [key: string]: unknown }` when library defaults use `any`, not `Record<string, never>` (which conflicts) or `{}` (too permissive)
- Example: `export type RssFeed = Parser.Output<{ [key: string]: unknown }>`
- Example: `export type RssItem = Parser.Item & { description?: string }` (extends Parser.Item with optional field)
- **Re-export types from index** - Make type aliases available via `src/main/types/index.ts` for convenience

## Type Duplication is Acceptable
- **Don't merge types just to eliminate duplication** - If types represent different semantic contexts or lifecycle stages, keep them separate
- **Example**: `Feed` (stored in OPML) and `FeedInfo` (fetched from RSS source) are intentionally similar but serve different purposes
- **Clarity over DRYness** - Small duplication improves readability by signaling different contexts

## Error Handling
- **Let errors propagate** - Don't hide errors with empty try-catch blocks returning defaults
- **Handle at higher levels** - Error handling belongs in IPC handlers/API layer, not service functions
- **Throw named errors, not booleans** - Functions work or throw descriptive error classes
- **Custom error classes** - Store in `src/main/types/errors.ts` extending Error
- **Error class design** - Include relevant context (URL, operation name) in error message, accept optional original error for message chaining
- Example: `addFeed(): void` throws `FeedAlreadyExistsError` instead of returning `boolean`
- Example: `FetchFailedError` takes `(url: string, originalError?: Error)` to capture and wrap underlying errors
