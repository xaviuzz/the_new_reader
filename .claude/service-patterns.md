# Service Architecture Patterns

## Class-Based Services for Stateful Operations

When a service requires the same configuration parameter across multiple method calls, use class-based pattern:

**Benefits:**

- Eliminates parameter duplication at call sites
- Encapsulates configuration state within service instance
- Cleaner, more intuitive API
- Easier to test with different configurations
- Foundation for adding shared state

## Private Helper Methods in Services

Keep internal helper methods private; only expose the public API.

**Benefits:**

- Hides implementation details
- Reduces cognitive load on API users
- Allows internal refactoring without breaking external code
- Clear separation between public contract and private implementation

**Extract helpers when public method contains multiple distinct processes:**
Fetch → transform → sort: extract each into named private helper. Main method reads like high-level description.

## Domain Model Patterns

Move from anemic data structures to rich domain classes that encapsulate behavior and transformation logic.

**Static factory methods for external data transformation:**
Use factory methods on domain classes to encapsulate normalization logic (defaults, parsing, validation).

**Service simplification with domain factories:**
Services become thin orchestrators that delegate transformation to domain factory methods.

**Hybrid domain model for gradual migration:**

1. Convert type interfaces to classes with behavior
2. Add factory methods and domain logic
3. Keep existing service structure—services use domain classes but remain orchestrators
4. Later migrate to full DDD when complexity warrants

**Don't add collection wrapper classes prematurely:**
JavaScript arrays have sufficient built-in methods for simple cases. Create collection classes only when you have:

- Multiple consumers with repeated collection logic
- Complex operations (pagination, deduplication, grouping)
- Business rules on collections
- Performance optimizations needed

**Merge similar types during domain refactoring:**
Merge semantically similar types by making distinguishing fields optional. Use factory methods to represent different creation contexts.

## Function Control Flow Pattern: Result Variable

Structure async functions to always have return statement at the end, not inside try blocks.

**Pattern:**

1. Initialize result variable with default/safe values
2. Try to fetch/process data
3. If successful, update result with actual values using explicit `if` statements
4. Catch errors and throw named error classes
5. Return result at the end

**Benefits:**

- Return statement always at function's end (clearer control flow)
- Result always defined with sensible defaults
- Easier to reason about success vs. failure
- Uses explicit conditionals instead of `||` operators (more readable)
