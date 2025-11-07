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

**Type Safety with External Libraries**
- **Use library type definitions directly** - Don't cast to `any`; leverage built-in TypeScript support
- **Create type alias files** - Wrap library types in dedicated files (`src/main/types/rss.ts`) for centralized management
- **Extend library types when needed** - Use intersection types (`&`) to add missing properties without casting
- **Choose generic parameters carefully** - Use `{ [key: string]: unknown }` when library defaults use `any`, not `Record<string, never>` (which conflicts) or `{}` (too permissive)
- Example: `export type RssFeed = Parser.Output<{ [key: string]: unknown }>`
- Example: `export type RssItem = Parser.Item & { description?: string }` (extends Parser.Item with optional field)
- **Re-export types from index** - Make type aliases available via `src/main/types/index.ts` for convenience

**Type Duplication is Acceptable**
- **Don't merge types just to eliminate duplication** - If types represent different semantic contexts or lifecycle stages, keep them separate
- **Example**: `Feed` (stored in OPML) and `FeedInfo` (fetched from RSS source) are intentionally similar but serve different purposes
- **Clarity over DRYness** - Small duplication improves readability by signaling different contexts

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

### Component Organization Patterns

**Folder Structure for Related Components:**
When a component has multiple sub-components, organize them in a folder structure:

```
components/
├── navbar/
│   ├── Navbar.tsx (container)
│   ├── index.ts (export { Navbar })
│   └── components/
│       ├── Brand.tsx (presentational)
│       ├── Actions.tsx (composite)
│       ├── AddFeedButton.tsx (button)
│       └── ThemeSwitcher.tsx (stateful)
├── sidebar/
│   ├── Sidebar.tsx
│   ├── index.ts
│   └── components/
│       ├── FeedListItem.tsx
│       └── EmptyFeedState.tsx
└── article/
    ├── ArticleList.tsx
    ├── index.ts
    └── components/
        ├── ArticleCard.tsx
        └── ArticleCardFooter.tsx
```

**Benefits:**
- Logical grouping of related components
- Clear hierarchy: container → feature components → sub-components
- Easier to locate component files
- Mirrors backend service organization patterns
- Simplifies imports: `import { Navbar } from './components/navbar'`

**When to Extract Components:**
Extract a component when it:
1. Has repeated patterns in a map/loop (e.g., FeedListItem in feed list)
2. Has conditional rendering with distinct UI (e.g., EmptyFeedState)
3. Is logically independent but used by a parent (e.g., ArticleCardFooter)
4. Could be reused elsewhere (e.g., AddFeedButton, Brand)

**Use index.ts for Cleaner Imports:**
Export main components via `index.ts` to simplify imports:
```typescript
// Instead of: import { Navbar } from './components/navbar/Navbar'
// Use: import { Navbar } from './components/navbar'
```

**Utility Functions Organization:**
Extract shared utilities to `src/renderer/src/utils/`:
- `date.ts` - Date formatting functions
- `string.ts` - String manipulation utilities
- etc.

Example:
```typescript
// src/renderer/src/utils/date.ts
export function formatDate(date: Date | null): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
```

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

### Component Composition Strategy

When a component has multiple distinct responsibilities or complex logic, break it into 4-5 focused sub-components using a `components/` subfolder (following the navbar/sidebar pattern). This improves maintainability, testability, and reusability.

**When to componentize:**
- Component has 100+ lines with multiple logical sections
- Complex logic (form handling, state management) mixed with presentation
- UI sections that could be reused in other components
- Business logic that should be isolated from presentational markup

**Pattern - Moderate granularity with form component:**
```
add-feed-modal/
├── AddFeedModal.tsx (container - coordinates child components)
├── components/
│   ├── ModalHeader.tsx (presentational - title only)
│   ├── FeedUrlForm.tsx (stateful - encapsulates form logic with onSuccess callback)
│   ├── ModalActions.tsx (composite - button group)
│   └── ModalBackdrop.tsx (presentational - dismissible backdrop)
└── __tests__/
    └── AddFeedModal.test.tsx
```

**Form Component with Success Callback Pattern:**
When a form component successfully submits, it should call an optional `onSuccess` callback to signal completion:

```typescript
interface FeedUrlFormProps {
  onSubmit: (url: string) => Promise<void>
  onSuccess?: () => void  // Called after successful submission
}

export function FeedUrlForm({ onSubmit, onSuccess }: FeedUrlFormProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    const url = inputRef.current?.value.trim()

    if (!url) return

    try {
      await onSubmit(url)
      if (inputRef.current) inputRef.current.value = ''
      onSuccess?.()  // Signal completion to parent
    } catch (error) {
      console.error('Failed to add feed:', error)
    }
  }
  // ...
}
```

**Container coordinates components:**
```typescript
export function AddFeedModal({ isOpen, onClose, onAddFeed }: AddFeedModalProps): React.JSX.Element {
  if (!isOpen) return <></>

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <ModalHeader title="Add Feed" />
        <FeedUrlForm onSubmit={onAddFeed} onSuccess={onClose} />
        <ModalActions onCancel={onClose} />
      </div>
      <ModalBackdrop onClick={onClose} />
    </div>
  )
}
```

**Benefits:**
- Single Responsibility: Each component has one clear job
- Reusability: ModalHeader, ModalActions, ModalBackdrop can be reused for other modals
- Testability: Easier to test components in isolation with mocked children
- Maintainability: Changes to form logic isolated to FeedUrlForm component
- Clear data flow: `onSuccess` callback makes component contracts explicit

## Modal Pattern

When implementing modals (dialogs for user confirmations, forms, etc.), follow these proven patterns:

### Shared Modal Components

Extract common structural components into a `shared/` folder to avoid duplication across multiple modals:

**Pattern:**
```
components/
├── shared/
│   ├── ModalHeader.tsx        // Consistent title rendering
│   ├── ModalBackdrop.tsx       // Click-to-close backdrop
│   └── index.ts                // Re-export for cleaner imports
├── add-feed-modal/
│   ├── AddFeedModal.tsx        // Container component
│   ├── index.ts
│   └── components/
│       ├── FeedUrlForm.tsx
│       └── ModalActions.tsx    // Modal-specific: Add Feed / Cancel
├── delete-feed-modal/
│   ├── DeleteFeedModal.tsx     // Container component
│   ├── index.ts
│   └── components/
│       ├── DeleteConfirmation.tsx
│       └── DeleteModalActions.tsx
```

**Shared Components:**
```typescript
// ModalHeader - consistent title styling
export interface ModalHeaderProps {
  title: string
}

export function ModalHeader({ title }: ModalHeaderProps): React.JSX.Element {
  return <h3 className="font-bold text-lg">{title}</h3>
}
```

```typescript
// ModalBackdrop - reusable click-to-close overlay
export interface ModalBackdropProps {
  onClick: () => void
}

export function ModalBackdrop({ onClick }: ModalBackdropProps): React.JSX.Element {
  return <div className="modal-backdrop" onClick={onClick} />
}
```

**Benefits:**
- Eliminates component duplication across modals
- Consistent visual structure and styling
- Single source of truth for modal styling changes
- Makes modal composition predictable and testable

### DaisyUI Modal Composition Pattern

All modals follow the same structural pattern using DaisyUI classes:

```typescript
export function DeleteFeedModal({ isOpen, feed, onClose, onDelete }: DeleteFeedModalProps): React.JSX.Element {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOpen || !feed) {
    return <></>
  }

  const handleDelete = async (): Promise<void> => {
    setIsDeleting(true)
    try {
      await onDelete(feed)
      onClose()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <ModalHeader title="Delete Feed" />
        <DeleteConfirmation feed={feed} />
        <DeleteModalActions onCancel={onClose} onDelete={handleDelete} isDeleting={isDeleting} />
      </div>
      <ModalBackdrop onClick={onClose} />
    </div>
  )
}
```

**Structure:**
- `modal modal-open` - Container that shows the modal (DaisyUI)
- `modal-box` - Centered content area with consistent styling
- `ModalHeader` - Title and branding
- Modal-specific content components (forms, confirmations, lists, etc.)
- `ModalActions` - Buttons (Cancel, Submit, Delete, etc.)
- `ModalBackdrop` - Click-outside-to-close overlay

**Benefits:**
- Consistent modal appearance and behavior
- Familiar structure makes modals easy to test
- DaisyUI handles responsive sizing and centering

### Explicit Callback Naming for Modal Triggers

Use `onDeleteRequest` or `onConfirmRequest` (not `onDelete` or `onConfirm`) to clearly signal that the callback opens a modal, not immediately executes an action:

**Pattern:**
```typescript
// Parent component (e.g., Sidebar)
export interface SidebarProps {
  // ... other props
  onDeleteRequest?: (feed: Feed) => void  // Signal: opens modal
}

function Sidebar({ feeds, onDeleteRequest }: SidebarProps): React.JSX.Element {
  return (
    <ul>
      {feeds.map((feed) => (
        <FeedListItem
          key={feed.feedUrl}
          feed={feed}
          onDeleteRequest={onDeleteRequest}  // Pass through
        />
      ))}
    </ul>
  )
}

// Child component (FeedListItem)
export interface FeedListItemProps {
  feed: Feed
  onDeleteRequest?: (feed: Feed) => void  // Just triggers modal
}

function FeedListItem({ feed, onDeleteRequest }: FeedListItemProps): React.JSX.Element {
  return (
    <li>
      <button onClick={() => onDeleteRequest?.(feed)}>Delete</button>
    </li>
  )
}

// App component - modal handler
function App(): React.JSX.Element {
  const [feedToDelete, setFeedToDelete] = useState<Feed | null>(null)

  return (
    <>
      <Sidebar onDeleteRequest={setFeedToDelete} />
      <DeleteFeedModal
        isOpen={feedToDelete !== null}
        feed={feedToDelete}
        onClose={() => setFeedToDelete(null)}
        onDelete={handleDeleteFeed}  // Callback naming: onDelete = executes action
      />
    </>
  )
}
```

**Naming Distinction:**
- `onDeleteRequest` - Opens modal, sets state (no immediate action)
- `onDelete` - Executes the actual delete operation (in modal's onDelete handler)

**Benefits:**
- Clarifies component contracts: "this button opens a modal" vs "this executes the action"
- Prevents confusion in button click handlers
- Easier to refactor: adding confirmation logic just changes callback target

### Loading State Management in Modals

Modals manage their own loading state during async operations (`isDeleting`, `isSubmitting`), while parents only manage modal visibility:

**Pattern:**
```typescript
export interface DeleteFeedModalProps {
  isOpen: boolean
  feed: Feed | null
  onClose: () => void
  onDelete: (feed: Feed) => Promise<void>
}

export function DeleteFeedModal({ isOpen, feed, onClose, onDelete }: DeleteFeedModalProps): React.JSX.Element {
  // Modal manages its own operation state
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOpen || !feed) {
    return <></>
  }

  const handleDelete = async (): Promise<void> => {
    setIsDeleting(true)
    try {
      await onDelete(feed)      // Perform async operation
      onClose()                 // Parent just closes modal
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <ModalHeader title="Delete Feed" />
        <DeleteConfirmation feed={feed} />
        {/* Pass isDeleting to action buttons for loading state UI */}
        <DeleteModalActions
          onCancel={onClose}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      </div>
      <ModalBackdrop onClick={onClose} />
    </div>
  )
}
```

```typescript
export interface DeleteModalActionsProps {
  onCancel: () => void
  onDelete: () => Promise<void>
  isDeleting: boolean
}

export function DeleteModalActions({ onCancel, onDelete, isDeleting }: DeleteModalActionsProps): React.JSX.Element {
  return (
    <div className="modal-action">
      <button
        onClick={onCancel}
        className="btn btn-ghost"
        disabled={isDeleting}
      >
        Cancel
      </button>
      <button
        onClick={onDelete}
        className="btn btn-error"
        disabled={isDeleting}
      >
        {isDeleting ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Deleting...
          </>
        ) : (
          'Delete Feed'
        )}
      </button>
    </div>
  )
}
```

**State Distribution:**
- Parent: `feedToDelete` (which modal is open)
- Modal: `isDeleting` (operation in progress)
- Actions: Use `isDeleting` to disable buttons and show spinner

**Benefits:**
- Clear separation of concerns: visibility vs operation state
- Modal operations don't leak into parent state management
- Easier to test: modal can be tested independently with mocked async operations
- Prevents accidental modal closure during async operation

### Folder Structure Consistency

Modal components follow the same folder organization pattern for predictability:

```
modal-name/
├── ModalName.tsx              // Container: state + event handling
├── index.ts                   // Re-export for cleaner imports
└── components/
    ├── SpecificComponent1.tsx // Modal-specific presentational/form components
    ├── SpecificComponent2.tsx
    └── ...
```

**Container Component (ModalName.tsx):**
- Manages modal visibility and operation state
- Handles async operations in try/finally blocks
- Renders shared components + modal-specific components
- Responsible for error handling and callbacks

**Modal-Specific Components (components/ folder):**
- UI concerns specific to this modal (forms, confirmations, lists)
- Receive data and callbacks from container
- Don't import or depend on other modal folders
- Can reference shared/ components if needed

**Example - DeleteFeedModal structure:**
```
delete-feed-modal/
├── DeleteFeedModal.tsx            // Container: manages isDeleting, calls onDelete
├── index.ts                       // export { DeleteFeedModal }
└── components/
    ├── DeleteConfirmation.tsx     // Shows feed title and warning message
    └── DeleteModalActions.tsx     // Buttons: Cancel / Delete Feed
```

**Example - AddFeedModal structure:**
```
add-feed-modal/
├── AddFeedModal.tsx               // Container: manages modal visibility
├── index.ts                       // export { AddFeedModal }
└── components/
    ├── FeedUrlForm.tsx            // Form input + submit logic
    └── ModalActions.tsx           // Buttons: Cancel / Add Feed
```

**Benefits:**
- Consistent navigation: developers know where to find components
- Clear component responsibilities
- Mirrors the service architecture pattern (container + helpers)
- Easier refactoring: moving components within same folder doesn't break imports

### Component Cleanup: Remove Unused Duplicates

During refactoring, delete unused duplicate files that remain from previous implementations:

**Scenario - Component Extraction:**
When extracting `ModalHeader` and `ModalBackdrop` to `shared/`, the `AddFeedModal` component folder originally had local copies:

```
add-feed-modal/
├── AddFeedModal.tsx
├── ModalHeader.tsx          # ❌ Duplicate - now in shared/
├── ModalBackdrop.tsx        # ❌ Duplicate - now in shared/
├── ModalActions.tsx         # ✅ Keep - unique to AddFeedModal
└── components/
    └── FeedUrlForm.tsx
```

**Action - Delete duplicates:**
```bash
rm src/renderer/src/components/add-feed-modal/ModalHeader.tsx
rm src/renderer/src/components/add-feed-modal/ModalBackdrop.tsx
```

Then verify AddFeedModal imports from shared:
```typescript
import { ModalHeader, ModalBackdrop } from '../shared'
```

**Why Delete Duplicates:**
- Prevents confusion: developers might edit the wrong version
- Maintains single source of truth: changes to modal structure apply everywhere
- Reduces maintenance burden: fewer files to update
- Avoids divergence: duplicate implementations can drift out of sync

**How to Spot Candidates:**
- Search for identical component implementations across folders
- Check if multiple modals import the same component differently (e.g., one from shared, one local)
- Use diff tools: `diff add-feed-modal/ModalHeader.tsx shared/ModalHeader.tsx`

**Benefits:**
- Cleaner codebase structure
- Forces intentional component sharing through shared/ folder
- Makes refactoring safer: can't accidentally miss a duplicate

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

**Extract helpers when a public method contains multiple distinct processes:**
When a method performs several sequential operations (fetch → transform → sort), extract each process into a named private helper. This makes the main method read like a high-level description of the workflow, while keeping implementation details encapsulated.

**Example - Multi-step process extraction:**
```typescript
export class RssService {
  async fetchArticles(feedUrl: string, parser?: Parser): Promise<Article[]> {
    const rssParser = parser || new Parser()
    let articles: Article[] = []

    try {
      const feed = await rssParser.parseURL(feedUrl) as any
      articles = this.mapFeedItemsToArticles(feed.items || [])
      this.sortArticlesByDate(articles)
    } catch (error) {
      throw new FetchFailedError(feedUrl, error as Error)
    }

    return articles
  }

  // Process 1: Transform raw feed items into typed Article objects
  private mapFeedItemsToArticles(items: unknown[]): Article[] {
    return items.map((item: any) => ({
      title: item.title || 'Untitled',
      link: item.link || '',
      pubDate: item.pubDate ? new Date(item.pubDate) : null,
      description: item.content || item.description || '',
      thumbnail: this.extractThumbnail(item)
    }))
  }

  // Process 2: Sort articles by publication date (newest first)
  private sortArticlesByDate(articles: Article[]): void {
    articles.sort((a, b) => {
      if (!a.pubDate || !b.pubDate) return 0
      return b.pubDate.getTime() - a.pubDate.getTime()
    })
  }

  private extractThumbnail(item: Parser.Item): string | null {
    // ... thumbnail extraction logic
  }
}
```

The try block now reads: "fetch feed → map items to articles → sort by date", making the workflow obvious without diving into implementation details.

**Another example - OPML Service:**
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

### Domain Model Patterns

Move from anemic data structures to rich domain classes that encapsulate behavior and transformation logic.

**Static factory methods for external data transformation:**
When transforming data from external sources (RSS feeds, OPML files, API responses), use static factory methods on domain classes. This encapsulates normalization logic (defaults, parsing, validation) where it belongs—with the domain object.

```typescript
export class Feed {
  constructor(
    readonly title: string,
    readonly feedUrl: string,
    readonly description: string = ''
  ) {}

  // Factory for RSS source - handles RSS-specific defaults
  static fromRssFeed(url: string, rssFeed: RssFeed): Feed {
    return new Feed(
      rssFeed.title || 'Untitled Feed',
      url,
      rssFeed.description || ''
    )
  }

  // Factory for OPML source - handles OPML-specific defaults
  static fromOpmlOutline(outline: OpmlOutline): Feed | null {
    if (!outline.xmlUrl) {
      return null
    }
    return new Feed(
      outline.title || outline.text || outline.xmlUrl,
      outline.xmlUrl,
      ''
    )
  }
}
```

**Service simplification with domain factories:**
Services become thin orchestrators that delegate transformation to domain factory methods:

```typescript
// Before: 10+ lines of conditional logic for defaults
async validateAndFetchFeed(url: string, parser?: Parser): Promise<Feed> {
  const rssParser = parser || new Parser()
  let title = 'Untitled Feed'
  let description = ''
  try {
    const feed = await rssParser.parseURL(url)
    if (feed.title) title = feed.title
    if (feed.description) description = feed.description
  } catch (error) {
    throw new FetchFailedError(url, error as Error)
  }
  return new Feed(title, url, description)
}

// After: Clear intent, normalization in domain
async validateAndFetchFeed(url: string, parser?: Parser): Promise<Feed> {
  try {
    const rssFeed = await rssParser.parseURL(url)
    return Feed.fromRssFeed(url, rssFeed)
  } catch (error) {
    throw new FetchFailedError(url, error as Error)
  }
}
```

**Benefits:**
- Normalization logic co-located with domain objects
- Factory method names document transformation source
- Services remain focused on orchestration
- Consistent pattern across multiple external sources

**Hybrid domain model for gradual migration:**
When migrating from anemic services to rich domain models, start with a **hybrid approach** rather than full domain-driven design:

1. Convert type interfaces to classes with behavior
2. Add factory methods and domain logic (equality, comparison, transformation)
3. Keep existing service structure—services use domain classes but remain orchestrators
4. Later migrate to full DDD (repositories, ports/adapters) when complexity warrants

This provides immediate benefits without architectural risk:
- Encapsulates behavior where it belongs
- Simplifies services incrementally
- Reduces type duplication
- Gives clear signals for when to advance to DDD

**Don't add collection wrapper classes prematurely:**
Avoid creating collection wrapper classes (e.g., `Articles` wrapping `Article[]`) until there's proven need. JavaScript arrays have sufficient built-in methods (`.map()`, `.filter()`, `.find()`) for simple cases.

Create collection classes only when you have:
- Multiple consumers with repeated collection logic
- Complex operations (pagination, deduplication, grouping, merging)
- Business rules on collections (read/unread tracking, favorites, pinning)
- Performance optimizations needed (caching, lazy loading, virtualization)

**Example of premature abstraction (avoid):**
```typescript
// ❌ Unnecessary - only 1 consumer, simple operations
class Articles {
  static fromRssItems(items: RssItem[]): Articles { ... }
  getAll(): readonly Article[] { ... }
  length: number { ... }
}
// Adds indirection: articles.getAll()[0] instead of articles[0]
```

**Merge similar types during domain refactoring:**
When converting to domain classes, merge semantically similar types by making distinguishing fields optional. Use factory methods to represent different creation contexts instead of separate classes.

**Example:**
Merged `Feed` (stored in OPML) + `FeedInfo` (fetched from RSS) → single `Feed` class:
```typescript
export class Feed {
  constructor(
    readonly title: string,
    readonly feedUrl: string,
    readonly description: string = '' // Optional - differs between sources
  ) {}

  // Context-specific factories
  static fromRssFeed(url: string, rssFeed: RssFeed): Feed { ... }
  static fromOpmlOutline(outline: OpmlOutline): Feed | null { ... }
}
```

Benefits: Eliminates type duplication, single source of truth, factories document context.

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

## React Component Testing Patterns

### SUT (Subject Under Test) Pattern

Encapsulate all component setup, rendering, and DOM queries into an inner SUT class within each test suite. This keeps tests focused purely on behavior assertions.

**Structure:**
```typescript
describe('Navbar', () => {
  // Tests use SUT for setup and queries
  it('should render navbar', () => {
    const sut = new NavbarSUT()
    expect(sut.getNavbar()).toBeInTheDocument()
  })

  // SUT class encapsulates implementation details
  class NavbarSUT {
    onAddFeed: MockedFunction<() => void>

    constructor() {
      this.onAddFeed = vi.fn()
      render(<Navbar onAddFeed={this.onAddFeed} />)
    }

    getNavbar(): HTMLElement | null {
      return screen.getByRole('navigation')
    }

    getAddFeedButton(): HTMLElement | null {
      return screen.getByRole('button', { name: /add feed/i })
    }

    async clickAddFeedButton(): Promise<void> {
      const button = this.getAddFeedButton()
      if (button) await userEvent.click(button)
    }
  }
})
```

**Benefits:**
- Tests read linearly: setup → act → assert
- All DOM queries hidden from test assertions
- Mocks centralized in constructor
- Easy to refactor component internals without changing test assertions

**SUT Constructor Options for Test Scenarios:**
Use constructor options to configure different test scenarios without creating separate SUT classes:

```typescript
class AddFeedModalSUT {
  onAddFeed: MockedFunction<(url: string) => Promise<void>>
  onClose: MockedFunction<() => void>

  constructor(options: { isOpen?: boolean; shouldError?: boolean } = {}) {
    const { isOpen = true, shouldError = false } = options

    this.onAddFeed = vi.fn(async (_url: string) => {
      if (shouldError) {
        throw new Error('Failed to add feed')
      }
    })
    this.onClose = vi.fn()
    render(
      <AddFeedModal isOpen={isOpen} onClose={this.onClose} onAddFeed={this.onAddFeed} />
    )
  }
  // ... query and action methods
}
```

**Usage:**
```typescript
it('should render when open', () => {
  const sut = new AddFeedModalSUT({ isOpen: true })
  expect(sut.getHeading()).toBeInTheDocument()
})

it('should handle errors', async () => {
  const sut = new AddFeedModalSUT({ shouldError: true })
  // ... test error handling
})
```

**Benefits:**
- Reusable SUT for multiple test scenarios
- Constructor options make test intent clear
- No duplication of mock setup across multiple SUT classes
- Easy to add new scenarios by extending options object

### Role-Based Queries Over CSS Selectors

Always use ARIA roles (`getByRole`, `getAllByRole`) instead of CSS selectors (`querySelector`, `querySelectorAll`). Tests become resilient to styling changes and match how accessible users interact with components.

**Pattern:**
```typescript
// ❌ Brittle - coupled to CSS
expect(container.querySelector('.navbar')).toBeInTheDocument()
expect(container.querySelector('.flex.items-center.gap-4')).toBeInTheDocument()

// ✅ Resilient - role-based
expect(screen.getByRole('navigation')).toBeInTheDocument()
expect(screen.getByRole('group')).toBeInTheDocument()
```

**Common ARIA Roles:**
- `navigation` - `<nav>` elements
- `complementary` - `<aside>` elements
- `main` - `<main>` elements
- `button` - `<button>` elements
- `link` - `<a href="#">` elements
- `heading` - `<h1>`, `<h2>`, etc.
- `article` - `<article>` elements

**Benefits:**
- Tests survive CSS refactoring (class renames, layout changes)
- Matches accessibility practices
- Clearer test intent
- Encourages semantic HTML in components

### Semantic HTML for Testability

Use proper semantic HTML elements and ensure interactive elements have required attributes. Non-semantic elements won't have implicit roles, breaking role-based queries.

**Pattern:**
```typescript
// ❌ Missing href - <a> element has no link role without href
<a onClick={() => onSelect(feed)}>
  {feed.title}
</a>

// ✅ Proper link with href and preventDefault
<a
  href="#"
  onClick={(e) => {
    e.preventDefault()
    onSelect(feed)
  }}
>
  {feed.title}
</a>

// ✅ Proper landmarks in layout
<nav className="p-4">
  <ul className="menu">
    {feeds.map(feed => <li key={feed.id}><a href="#">{feed.title}</a></li>)}
  </ul>
</nav>
```

**Benefits:**
- Components automatically testable with roles
- Improved accessibility (keyboard navigation, screen readers)
- Clear semantic structure
- No workarounds needed in tests

### Semantic Identifiers Over Position

Query elements by meaningful identifiers (button names, feed titles, link text) instead of array indices. Prevents brittle position-dependent tests.

**Pattern:**
```typescript
// ❌ Brittle - breaks if button order changes
const buttons = screen.getAllByRole('button')
await userEvent.click(buttons[0])

// ✅ Semantic - resilient
const addButton = screen.getByRole('button', { name: /add feed/i })
await userEvent.click(addButton)

// ❌ Brittle - position-based navigation link
const links = screen.getAllByRole('link')
await userEvent.click(links[0])

// ✅ Semantic - by feed name
const hackerNewsLink = screen.getByRole('link', { name: 'Hacker News' })
await userEvent.click(hackerNewsLink)
```

**Benefits:**
- Tests document intent clearly
- Survive DOM reordering
- Self-documenting test code
- Less maintenance when UI changes

### Query Method Patterns in SUT

Use consistent SUT method patterns that return elements and support common test workflows.

**Pattern:**
```typescript
class ArticleListSUT {
  // Singular queries return element or null
  getMainContent(): HTMLElement | null {
    return screen.getByRole('main')
  }

  // Plural queries return array
  getArticles(): HTMLElement[] {
    return Array.from(screen.getAllByRole('article'))
  }

  // Named queries with specific identifiers
  getFeedLink(feedName: string): HTMLElement | null {
    return screen.getByRole('link', { name: feedName })
  }

  // Action methods encapsulate user events
  async clickFeedLink(feedName: string): Promise<void> {
    const link = this.getFeedLink(feedName)
    if (link) await userEvent.click(link)
  }
}
```

**Benefits:**
- Consistent, predictable API
- Type safety (null checks built-in)
- Self-documenting method names
- Easy to compose complex interactions

### Test Script Configuration for Non-Watch Mode

Configure npm test script to run in non-watch mode to prevent hanging test processes in automated environments:

**Configuration:**
```json
// package.json
{
  "scripts": {
    "test": "vitest --run"
  }
}
```

**Why:**
- Prevents tests from staying in watch mode waiting for file changes
- Essential for CI/CD pipelines and automated test execution
- Ensures test processes complete and exit cleanly
- Without `--run`, tests may hang indefinitely if run in non-interactive environments

**Usage:**
```bash
npm test  # Runs tests once and exits
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

## TypeScript Configuration Patterns

### TypeScript Configuration for Nested Components

When creating nested folder structures for components, ensure `tsconfig.json` includes explicit patterns for all file types:

```json
{
  "include": [
    "src/renderer/src/env.d.ts",
    "src/renderer/src/**/*.ts",      // Explicitly include .ts files
    "src/renderer/src/**/*.tsx",     // Explicitly include .tsx files
    "src/preload/*.d.ts"
  ]
}
```

**Why**: Generic patterns like `**/*` may not match all TypeScript variations. Explicit patterns ensure the compiler recognizes all component files.

**Common Issue**: When adding new nested component folders, the TypeScript compiler may report "File not listed within the file list" errors. Update `include` patterns to explicitly list `.ts` and `.tsx` patterns separately.

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
