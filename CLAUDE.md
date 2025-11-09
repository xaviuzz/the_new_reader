We are going to build an electron application called The New Reader

## Development Guidelines
You must use VScode tools whenever possible as described in `.claude/vscode.md`

### Communication Style
- **No permission-seeking** - Don't ask for validation before executing work. Execute directly and report results.
- Example: ❌ "Should I update this file?" → ✅ Just update it and report what was done.

## Code Quality & Style
See `.claude/code-quality.md` for:
- Strict minimalism principles
- Import statements (ES6 only)
- No comments policy (self-documenting code)
- Library preference over custom code
- Type safety with external libraries
- Error handling patterns

## Git Commits
- **Single-line conventional commits only** - No multi-line messages or footers
- **Format**: `emoji type: description` (e.g., `♻️ refactor: extract theme switcher into reusable component`)
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

## Planning Complex Features
1. **Ask clarifying questions systematically** before creating a plan
   - Ask about storage, data persistence, library preferences
   - Ask about backend vs frontend processing
   - Ask about UI/UX patterns and layouts
   - Ask about data display and validation requirements
   - Ask about execution scope
   - Get ALL clarifications before proceeding

2. **Create incremental, iterative plans**
   - Independently testable steps with clear testing criteria
   - Building on previous steps
   - Persisted in `.claude/` folder as markdown files
   - Minimal scope - only add code when a phase requires it

3. **Structure for step-by-step implementation**
   - Break complex features into manageable phases
   - Each phase contains numbered steps with deliverables
   - Include testing checklist at the end

## React Component Patterns
See `.claude/react-components.md` for:
- Component organization (folder structures, index.ts patterns)
- State encapsulation principles
- Component composition strategy
- Form components with onSuccess callbacks

## Modal Patterns
See `.claude/modal-patterns.md` for:
- Shared modal components structure
- DaisyUI modal composition pattern
- Explicit callback naming conventions
- Loading state management in modals
- Folder structure consistency
- Component cleanup (removing duplicates)

## Service Architecture Patterns
See `.claude/service-patterns.md` for:
- Class-based services for stateful operations
- Private helper methods patterns
- Domain model patterns with static factories
- Hybrid domain model approach
- Function control flow (result variable pattern)

## React Component Testing
See `.claude/testing-patterns.md` for:
- SUT (Subject Under Test) pattern
- Role-based queries over CSS selectors
- Semantic HTML for testability
- Semantic identifiers over position
- Query method patterns in SUT
- Test script configuration (vitest --run)

## TypeScript & CSS Configuration
See `.claude/typescript-css-config.md` for:
- TypeScript configuration for nested components
- Tailwind CSS 3.x setup for Electron + Vite
- DaisyUI custom theme implementation
- Common issues and solutions

## File Operations & App Architecture
See `.claude/file-operations.md` for:
- Precise content matching for edit operations
- The New Reader RSS feed application architecture
- Storage and core libraries information
