# Phase 2: Backend Foundation with Automated Testing

## Goal
Build backend services and IPC handlers for RSS feed management with comprehensive vitest test coverage. All services will have unit tests, and IPC handlers will have integration tests.

## Steps

### Step 2.1: Set up vitest for Electron main process
**What to build:**
- Install vitest and related dependencies: `vitest`, `@vitest/ui` (optional)
- Create `vitest.config.ts` for Node/Electron environment
- Add test scripts to `package.json`: `"test": "vitest"`, `"test:ui": "vitest --ui"`
- Create `src/main/services/__tests__` directory structure

**Testing:**
- [ ] Run `npm test` - vitest starts without errors
- [ ] Create simple smoke test file - verify it runs and passes

---

### Step 2.2: Create OPML service with tests
**What to build:**
- Create `src/main/services/opml.ts`:
  - `getOpmlFilePath(baseDir: string)` - returns path to feeds.opml in given directory
  - `readOpmlFile(filePath: string)` - reads OPML or returns empty structure
  - `writeOpmlFile(filePath: string, feeds: Feed[])` - writes OPML using `opml-generator`
  - `addFeed(filePath: string, feed: Feed)` - adds feed, prevents duplicates
  - `getFeeds(filePath: string)` - returns feed array
- Create `src/main/services/__tests__/opml.test.ts`:
  - Test all functions with temporary test directory
  - Mock file system if needed, or use actual temp files
  - Clean up test files after each test

**Testing:**
- [ ] All OPML service tests pass
- [ ] `getOpmlFilePath()` returns correct path with baseDir
- [ ] `readOpmlFile()` creates empty structure when file missing
- [ ] `writeOpmlFile()` creates valid OPML XML
- [ ] `addFeed()` adds feed and prevents duplicates
- [ ] `getFeeds()` returns correct feed array
- [ ] Multiple add/read operations work correctly
- [ ] Run `npm run typecheck` - no TypeScript errors

---

### Step 2.3: Create RSS service with tests
**What to build:**
- Create `src/main/services/rss.ts`:
  - `validateAndFetchFeed(url: string, parser?: Parser)` - validates URL and fetches feed metadata
  - `fetchArticles(feedUrl: string, parser?: Parser)` - fetches and parses articles
  - Return types: `FeedInfo { title, description, feedUrl }`, `Article { title, link, pubDate, description, thumbnail }`
- Create `src/main/services/__tests__/rss.test.ts`:
  - Mock `rss-parser` to return fake RSS data (no network calls)
  - Test valid RSS feeds, Atom feeds, invalid URLs, parse errors
  - Test article parsing with various field combinations

**Testing:**
- [ ] All RSS service tests pass
- [ ] `validateAndFetchFeed()` with mocked valid RSS returns feed info
- [ ] `validateAndFetchFeed()` with mocked Atom feed returns feed info
- [ ] `validateAndFetchFeed()` with invalid URL throws appropriate error
- [ ] `fetchArticles()` returns array of articles with correct fields
- [ ] Article thumbnail extraction works when available
- [ ] Article pubDate parsing handles missing dates gracefully
- [ ] Run `npm run typecheck` - no TypeScript errors

---

### Step 2.4: Create TypeScript types
**What to build:**
- Create `src/main/types/index.ts`:
  - `Feed` interface: `{ title: string, feedUrl: string }`
  - `Article` interface: `{ title: string, link: string, pubDate: Date | null, description: string, thumbnail: string | null }`
  - `FeedInfo` interface: `{ title: string, description: string, feedUrl: string }`
- Import and use these types in OPML and RSS services

**Testing:**
- [ ] All existing tests still pass with typed interfaces
- [ ] Run `npm run typecheck` - no TypeScript errors
- [ ] IDE autocomplete works for Feed/Article/FeedInfo types

---

### Step 2.5: Set up IPC handlers with tests
**What to build:**
- Create `src/main/ipc/feeds.ts`:
  - `setupFeedsIpc(app: App)` - registers all feed-related IPC handlers
  - Handlers: `feeds:add`, `feeds:list`, `feeds:getArticles`
  - Use services from previous steps
  - Handle errors and return appropriate messages
- Update `src/main/index.ts` to call `setupFeedsIpc(app)` in `app.whenReady()`
- Update `src/preload/index.ts` to expose IPC methods via contextBridge
- Create `src/main/ipc/__tests__/feeds.test.ts`:
  - Mock IPC events and test handlers with temporary OPML directory
  - Test success cases and error cases

**Testing:**
- [ ] All IPC handler tests pass
- [ ] `feeds:add` handler adds valid feed to OPML
- [ ] `feeds:add` handler returns error for invalid URL
- [ ] `feeds:add` handler prevents duplicate feeds
- [ ] `feeds:list` handler returns all feeds
- [ ] `feeds:getArticles` handler returns articles array
- [ ] Run `npm run typecheck` - no TypeScript errors
- [ ] Run `npm test` - all tests pass

---

### Step 2.6: Manual verification in DevTools
**What to do:**
- Start app with `npm run dev`
- Open DevTools console
- Manually test IPC methods to verify real-world functionality

**Testing:**
- [ ] Call `window.electron.ipcRenderer.invoke('feeds:list')` - returns empty array initially
- [ ] Call `window.electron.ipcRenderer.invoke('feeds:add', 'https://feeds.bbci.co.uk/news/rss.xml')` - succeeds (uses real network)
- [ ] Call `feeds:list` - returns BBC feed
- [ ] Call `window.electron.ipcRenderer.invoke('feeds:getArticles', 'https://feeds.bbci.co.uk/news/rss.xml')` - returns articles
- [ ] Verify OPML file exists in userData directory with correct content
- [ ] Restart app and call `feeds:list` - feeds persist

---

## Phase 2 Completion Criteria

- [ ] All vitest tests pass (`npm test`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] Test coverage includes: OPML service, RSS service, IPC handlers
- [ ] Manual DevTools verification confirms real-world functionality
- [ ] OPML file persists in userData directory
- [ ] Can add feeds, list feeds, and fetch articles via IPC
- [ ] Duplicate feeds are rejected
- [ ] Invalid URLs return clear error messages

---

## Next Phase Preview
Phase 3 will build UI layout (navbar, sidebar, main area) with DaisyUI styling - no backend integration yet.
