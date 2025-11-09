# The New Reader

A modern, lightweight RSS/Atom feed reader for the desktop built with Electron and React.

## Features

- **Feed Management** - Add, delete, and organize your RSS and Atom feeds
- **Article Reading** - Clean, distraction-free article viewing with HTML content rendering
- **OPML Support** - Import and export feeds via OPML format for easy backup and migration
- **Caching System** - Smart caching with 60-minute TTL to reduce network requests
- **Theme Support** - Switch between light and dark themes
- **Safe Rendering** - DOMPurify sanitization for all article content
- **Notifications** - Toast notifications for user feedback

## Using The New Reader

### Adding Feeds

1. Click the **+ Add Feed** button in the navbar
2. Enter the RSS or Atom feed URL
3. The app will fetch the feed and extract metadata
4. Click **Add** to subscribe

### Reading Articles

1. Select a feed from the sidebar to view its articles
2. Articles are sorted by publish date (newest first)
3. Click an article to open it in your default browser
4. Article thumbnails are extracted from feed content automatically

### Refreshing Feeds

Click the **Refresh All** button in the navbar to manually refresh all feeds and bypass the cache. The app automatically caches articles for 60 minutes to reduce network requests.

### Importing and Exporting Feeds

The app stores your feeds in OPML format (Open Podcast Markup Language) in the user data directory. You can:
- Export feeds by backing up the `feeds.opml` file
- Import feeds by placing an `feeds.opml` file in the user data directory and restarting the app

### Switching Themes

Click the theme toggle button in the navbar to switch between light and dark themes. Your preference is saved automatically.

### Deleting Feeds

Select a feed in the sidebar, click the delete icon, and confirm in the modal that appears.

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

### Installation

```bash
git clone <repository-url>
cd theNewReader
npm install
```

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Type check and build for production
npm run build

# Build for specific platforms
npm run build:win      # Windows installer
npm run build:mac      # macOS app
npm run build:linux    # Linux AppImage/snap/deb

# Testing and code quality
npm run test           # Run tests with Vitest
npm run test:ui        # Run tests with UI
npm run lint           # Lint code with ESLint
npm run format         # Format code with Prettier
npm run typecheck      # Type check both main and renderer processes
```

### Project Structure

```
src/
├── main/               # Electron main process
│   ├── domain/         # Domain models (Feed, Article)
│   ├── services/       # Business logic (RSS fetching, OPML, caching)
│   ├── ipc/            # IPC handlers for renderer communication
│   └── types/          # TypeScript types
├── preload/            # Preload script (context bridge)
└── renderer/           # React application
    └── src/
        ├── components/ # React components
        ├── utils/      # Utility functions
        └── assets/     # CSS and static assets
```

### Development Workflow

1. Run `npm run dev` to start the development server with hot reload
2. Make changes to components, services, or styles
3. Changes will automatically reload in the app
4. Use `npm run lint` and `npm run format` to maintain code quality
5. Run `npm run test` to verify tests pass
6. Use `npm run typecheck` to ensure type safety

### Code Quality Guidelines

The project follows strict minimalism principles:
- ES6 imports only
- Self-documenting code (minimal comments)
- Library preference over custom implementations
- Type safety with external libraries
- Comprehensive test coverage

See `CLAUDE.md` and `.claude/` folder for detailed development guidelines.

## Tech Stack

- **Electron** - Desktop application framework
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **DaisyUI** - Component library
- **rss-parser** - RSS/Atom feed parsing
- **opml** - OPML file format handling
- **DOMPurify** - HTML sanitization
- **Vitest** - Testing

## IDE Recommendation

- **VSCode** with ESLint and Prettier extensions for the best development experience

## License

TBD
