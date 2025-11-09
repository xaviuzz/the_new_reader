# React Component Testing Patterns

## SUT (Subject Under Test) Pattern
Encapsulate all component setup, rendering, and DOM queries into an inner SUT class within each test suite.

**Benefits:**
- Tests read linearly: setup → act → assert
- All DOM queries hidden from test assertions
- Mocks centralized in constructor
- Easy to refactor component internals without changing test assertions

**SUT Constructor Options for Test Scenarios:**
Use constructor options to configure different test scenarios without creating separate SUT classes.

## Role-Based Queries Over CSS Selectors
Always use ARIA roles (`getByRole`, `getAllByRole`) instead of CSS selectors.

**Common ARIA Roles:** navigation, complementary, main, button, link, heading, article

**Benefits:**
- Tests survive CSS refactoring
- Matches accessibility practices
- Clearer test intent
- Encourages semantic HTML

## Semantic HTML for Testability
Use proper semantic HTML elements and ensure interactive elements have required attributes.

**Benefits:**
- Components automatically testable with roles
- Improved accessibility
- Clear semantic structure
- No workarounds needed in tests

## Semantic Identifiers Over Position
Query elements by meaningful identifiers instead of array indices.

**Benefits:**
- Tests document intent clearly
- Survive DOM reordering
- Self-documenting test code
- Less maintenance when UI changes

## Query Method Patterns in SUT
Use consistent patterns: singular queries return element or null, plural queries return arrays.

**Benefits:**
- Consistent, predictable API
- Type safety (null checks built-in)
- Self-documenting method names
- Easy to compose complex interactions

## Test Script Configuration
Configure npm test script with `vitest --run` to prevent hanging test processes in automated environments.
