# File Operations & Miscellaneous Patterns

## Precise Content Matching for Edit Operations

When using `replace_lines_code` tool, ensure exact content matching to avoid validation failures:

- **Read with exact line ranges** - When validation fails, use targeted `read_file_code` calls with specific line ranges
- **Account for whitespace** - Line content includes all leading/trailing whitespace exactly as it appears
- **Smaller ranges** - Use smaller line ranges to avoid confusion with formatting differences

Example: If `replace_lines_code` fails, read the specific lines first with exact line numbers, then use that output as `originalCode` parameter.

## The New Reader - RSS Feed Application

### Architecture & Dependencies

- **Storage**: OPML file format in Electron's user data directory (`app.getPath('userData')`)
- **Core Libraries**: rss-parser (v3.13.0), opml (v0.5.7), Node.js built-in `fs` module
- **Key Decisions**: Use Node.js built-in `fs` (not `fs-extra`), parse feeds in main process, single OPML file, support RSS & Atom
- **TypeScript Types**: rss-parser has built-in TS support; create custom `src/main/types/opml.d.ts` for opml library
