# RSS Feed Reader - Stage One: Incremental Implementation Plan

## Overview
Build a basic RSS feed reader that allows users to:
- Add RSS feed URLs via a modal
- Store feeds in an OPML file
- Display feeds in a sidebar
- View articles from selected feeds (newest to oldest)

## Architecture Decisions
- **Storage**: OPML file in user's app data directory
- **RSS Parsing**: Backend (main process) using `rss-parser` library
- **Feed Formats**: Support both RSS and Atom
- **Layout**: Navbar + Sidebar (feed list) + Main content area (articles)

---

## Phase 1: Project Setup & Dependencies

### Step 1.1: Install RSS parsing libraries
- Install `rss-parser` and `fast-xml-parser`
- **Test**: Verify packages are installed in package.json

---

## Phase 2: Backend Foundation (Main Process)

### Step 2.1: Create OPML file service
- Create `src/main/services/opml.ts` with functions to:
  - Get OPML file path in user data directory
  - Read existing OPML file (or create empty one if doesn't exist)
  - Write OPML file with feeds data
- **Test**: Manually call functions to verify OPML read/write works

### Step 2.2: Create RSS feed service
- Create `src/main/services/rss.ts` with function to:
  - Validate and fetch RSS feed from URL
  - Extract feed metadata (title, description)
- **Test**: Manually test with a known RSS feed URL (e.g., BBC, NY Times)

### Step 2.3: Add feed management to OPML service
- Add functions to:
  - Add feed to OPML file (with title and URL)
  - Get list of feeds from OPML
  - Ensure no duplicate URLs
- **Test**: Add a feed and verify OPML file contains it with correct structure

### Step 2.4: Add article fetching to RSS service
- Add function to fetch and parse articles from feed URL
- Return article data: title, link, pubDate, description, thumbnail/image
- **Test**: Fetch articles from a known feed and verify all fields are parsed

### Step 2.5: Set up IPC handlers
- Register IPC handlers in main process for:
  - `feeds:add` - validate and add feed
  - `feeds:list` - get all feeds
  - `feeds:getArticles` - fetch articles from feed URL
- **Test**: Use Electron DevTools console to call IPC methods directly

---

## Phase 3: UI Layout Structure

### Step 3.1: Create basic layout with navbar
- Create `Navbar` component with DaisyUI styling
- Add "Feed" dropdown menu with "Add feed" button (non-functional placeholder)
- Update `App.tsx` with navbar + placeholder content area
- **Test**: Visual - navbar displays correctly with theme switcher still working

### Step 3.2: Add sidebar to layout
- Create `Sidebar` component (empty/placeholder for now)
- Update `App.tsx` layout: navbar (top) + sidebar (left) + main content area (right)
- Use flexbox/grid for responsive layout
- **Test**: Visual - three-section layout displays correctly

---

## Phase 4: Add Feed Functionality

### Step 4.1: Create Add Feed Modal component
- Create `AddFeedModal` component with DaisyUI modal styling
- Include:
  - URL input field with validation
  - Cancel/Add buttons
  - Loading state display (spinner)
  - Error message display area
- **Test**: Modal opens/closes, form validation works (required field, valid URL format)

### Step 4.2: Connect modal to backend
- Add IPC invoke call to validate feed URL (`feeds:add` with dry-run flag or separate validation)
- Show feed title on successful validation
- Display error message on invalid URL or network failure
- **Test**: Enter valid/invalid URLs and verify appropriate feedback

### Step 4.3: Complete add feed flow
- Call `feeds:add` IPC on user confirmation
- Close modal on success
- Refresh feed list after adding
- **Test**: Add a feed and verify it's saved to OPML file in user data directory

---

## Phase 5: Display Feeds in Sidebar

### Step 5.1: Fetch and display feed list
- Create state for feeds list in App component
- Call `feeds:list` IPC on component mount
- Display feeds in Sidebar component as a list
- Show feed titles (not URLs)
- **Test**: Added feeds appear in sidebar with correct titles

### Step 5.2: Add feed selection
- Add click handlers to feed items in sidebar
- Track selected feed in state
- Visual indicator for selected feed (highlight, active state)
- **Test**: Clicking different feeds updates selection indicator

---

## Phase 6: Display Articles

### Step 6.1: Create Article List component
- Create `ArticleList` component to display articles
- Props: articles array, loading state
- Display: title, date, description preview, thumbnail (if available)
- Use DaisyUI card components for styling
- **Test**: Pass mock data and verify display looks good

### Step 6.2: Fetch and display articles
- When feed selected, call `feeds:getArticles` IPC with feed URL
- Pass fetched articles to ArticleList component
- Show loading spinner while fetching
- **Test**: Select a feed and verify articles load and display

### Step 6.3: Add article interactions
- Make article titles/cards clickable
- Open article link in external browser (using Electron shell.openExternal)
- Visual feedback on hover
- **Test**: Click article and verify it opens in default browser

---

## Phase 7: Polish & Error Handling

### Step 7.1: Add error states
- Handle network errors gracefully
- Handle invalid/malformed feeds
- Display user-friendly error messages in UI
- **Test**: Simulate errors (offline, bad URL) and verify error messages display

### Step 7.2: Add empty states
- Empty sidebar message: "No feeds yet. Click 'Add feed' to get started."
- No articles message: "Select a feed to view articles"
- No articles in feed: "This feed has no articles"
- **Test**: Visual - empty states look good and provide clear guidance

### Step 7.3: Sort articles by date
- Ensure articles are sorted newest to oldest by pubDate
- Handle missing dates gracefully
- **Test**: Verify article order is correct (most recent first)

---

## Testing Checklist

After completing all phases:
- [ ] Can add valid RSS/Atom feed via modal
- [ ] Invalid URLs show appropriate error messages
- [ ] Feeds persist in OPML file across app restarts
- [ ] Feeds display in sidebar with correct titles
- [ ] Selecting a feed loads and displays articles
- [ ] Articles are sorted newest to oldest
- [ ] Clicking articles opens in external browser
- [ ] All error states display user-friendly messages
- [ ] All empty states provide clear guidance
- [ ] Theme switcher still works throughout app
- [ ] Layout is responsive and visually consistent

---

## Notes

Each step is designed to be:
- **Incremental**: Builds on previous steps
- **Testable**: Has clear testing criteria
- **Independent**: Can be verified before moving to next step

This approach allows for iterative development with regular validation points.
