# Kart-quiz Architecture

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Server component (data loading)
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ClientApp.tsx     # Main client component
│   ├── Controls.tsx      # Quiz settings controls
│   ├── Header.tsx        # App header
│   ├── MapView.tsx       # Main map component
│   ├── MobileDrawer.tsx  # Reusable mobile drawer
│   ├── ResultsList.tsx   # Results history list
│   ├── Scorebar.tsx      # Score display
│   ├── icons.tsx         # SVG icon components
│   └── map/              # Map-specific components
│       ├── MapComponents.tsx  # Map interaction handlers
│       └── MapMarkers.tsx     # Map marker components
├── hooks/                # Custom React hooks
│   └── useQuiz.ts        # Quiz game logic hook
├── lib/                  # Utility functions
│   ├── constants.ts      # Configuration constants
│   ├── distance.ts       # Distance calculations
│   └── quiz-utils.ts     # Quiz helper functions
├── data/                 # Static data
│   └── places.json       # Place data
└── types.ts             # TypeScript type definitions
```

## Design Principles

### 1. **Separation of Concerns**

- **Components**: Pure UI, minimal logic
- **Hooks**: Business logic and state management
- **Utils**: Reusable helper functions
- **Constants**: Configuration in one place

### 2. **Type Safety**

- Comprehensive TypeScript interfaces
- Proper typing for all functions
- No `any` types (except necessary for dynamic imports)

### 3. **Modularity**

- Small, focused components
- Single Responsibility Principle
- Easy to test and maintain

### 4. **Performance**

- `useCallback` for stable function references
- `useMemo` for expensive computations
- Dynamic imports for map components (reduce bundle size)

### 5. **Mobile-First**

- Responsive design
- Touch-optimized interactions
- Progressive enhancement

## Key Components

### ClientApp

Main orchestrator component that:
- Manages UI state (mobile menus)
- Connects quiz logic to UI components
- Handles layout structure

### useQuiz Hook

Encapsulates all game logic:
- State management (score, history, target)
- Game actions (guess, identify, reset)
- Category filtering
- Uses utility functions for calculations

### MapView

Renders the interactive map:
- Lazy-loaded Leaflet components
- Separated into sub-components for clarity
- Handles both game modes

### Map Subcomponents

- **MapClickHandler**: Handles click/tap events
- **TargetViewManager**: Ensures target visibility
- **IdentifyMarker**: Blue markers for identification
- **AnswerMarker**: Green marker + tolerance circle

## Data Flow

```
Server Component (page.tsx)
  ↓ loads places.json
ClientApp
  ↓ passes to useQuiz
useQuiz Hook
  ↓ provides state & actions
UI Components
  ↓ user interactions
useQuiz Hook
  ↓ updates state
UI Components re-render
```

## Constants

All magic numbers and configuration are centralized:

- **MAP_CONFIG**: Map settings (zoom, center, padding)
- **QUIZ_DEFAULTS**: Default values (tolerance, round size)
- **INPUT_CONSTRAINTS**: Min/max values for inputs
- **MARKER_STYLES**: Marker colors and styles
- **TILE_LAYER**: OpenStreetMap tile configuration

## Utility Functions

### distance.ts
- `distanceKm()`: Haversine distance calculation
- `isWithinTolerance()`: Check if guess is correct

### quiz-utils.ts
- `extractCategories()`: Get unique eras
- `filterPlacesByCategory()`: Filter by era
- `selectRandomPlace()`: Random selection
- `createAttempt()`: Create attempt record
- `formatGuessResult()`: Format feedback messages
- `clamp()`: Bound numbers to range

## Best Practices Applied

### ✅ Code Organization
- Logical file structure
- Related code grouped together
- Clear naming conventions

### ✅ Reusability
- Extracted icon components
- Reusable MobileDrawer
- Utility functions for common operations

### ✅ Maintainability
- Constants instead of magic numbers
- Well-documented functions
- Clear type definitions

### ✅ Performance
- Memoized expensive calculations
- Stable callbacks with useCallback
- Dynamic imports for large dependencies

### ✅ Accessibility
- Proper labels for inputs
- ARIA labels for buttons
- Semantic HTML

### ✅ DRY Principle
- No duplicate code
- Shared utilities
- Consistent patterns

## Future Improvements

1. **Testing**: Add unit tests for utility functions
2. **Error Handling**: Better error boundaries
3. **Persistence**: Save game state to localStorage
4. **Analytics**: Track user performance
5. **Internationalization**: Support multiple languages
6. **Server Actions**: Move data loading to server actions
7. **Database**: Store places in a database instead of JSON

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## Technologies

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Maps**: Leaflet + React-Leaflet
- **Build**: Turbopack

