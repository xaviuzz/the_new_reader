# React Component Patterns

## Component Organization

- Organize related components in folder structures with sub-components in `components/` subfolder
- Use `index.ts` for cleaner imports
- Extract shared utilities to `src/renderer/src/utils/`
- When component exceeds 100+ lines with multiple logical sections, break into 4-5 focused sub-components

## Component State Encapsulation

- Components manage their own state and side effects internally
- Export optional callback props to allow parent customization without tight coupling
- Parent components remain minimal and focused, components are reusable

## Component Composition Strategy

**Pattern - Moderate granularity with form component:**

- Container component coordinates child components
- Presentational components (title, backdrop)
- Stateful components encapsulate form logic with `onSuccess` callback
- Composite components (button groups)

**Form Component Pattern:**
When form component successfully submits, call optional `onSuccess` callback to signal completion to parent.

**Benefits:**

- Single Responsibility: Each component has one clear job
- Reusability: Components can be reused for other features
- Testability: Easier to test components in isolation
- Maintainability: Changes isolated to specific components
- Clear data flow: `onSuccess` callback makes component contracts explicit
