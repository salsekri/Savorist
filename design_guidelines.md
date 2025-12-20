# Savorist Design Guidelines

## Authentication Architecture
**No Authentication Required for MVP**
- App focuses on restaurant discovery and browsing (single-user utility)
- Favorites stored locally using AsyncStorage
- Include a **Profile/Settings screen** in bottom navigation with:
  - User-customizable avatar (1 preset avatar matching burgundy theme)
  - Display name field for personalized greetings
  - App preferences: Notifications toggle, Theme preference (default burgundy)

## Navigation Architecture

### Root Navigation: Bottom Tab Bar (4 Tabs)
- **Home** (house icon) - Main restaurant browsing
- **Search** (search icon) - Restaurant search and filters
- **Favorites** (heart icon) - Saved restaurants
- **Profile** (user icon) - Settings and preferences

### Navigation Flow
1. **Splash → Home** (auto-transition after 1.5 seconds)
2. **Home → Restaurant Details** (tap restaurant card)
3. **Search → Filter Modal** (tap filter icon)
4. **Favorites → Restaurant Details** (tap saved restaurant)
5. **Restaurant Details → Modal** (Book a Table action)

## Screen Specifications

### 1. Splash Screen
- **Purpose**: Brand introduction on app launch
- **Layout**:
  - Full-screen linear gradient background (burgundy to deep wine)
  - Centered white "Savorist" logo/text
  - No navigation header or tab bar
- **Duration**: 1.5 seconds
- **Safe Area**: None (full bleed)

### 2. Home Screen
- **Purpose**: Browse restaurants with trending categories
- **Layout**:
  - **Header**: Transparent, no navigation elements
    - Large title: "Reserve the Best Nearby dining" (white text, positioned over burgundy gradient background)
  - **Main Content** (ScrollView):
    - Search bar (white background, rounded corners, search icon left, filter icon right)
    - Promotional banner card (50% OFF example, full-width, rounded)
    - Horizontal tab selector: ALL | NEARBY | TRENDING (burgundy active state)
    - Vertical list of restaurant cards (scrollable)
  - **Safe Area Insets**: 
    - Top: headerHeight + Spacing.xl
    - Bottom: tabBarHeight + Spacing.xl
- **Components**: Search bar, promotional banner, tab selector, restaurant cards (list)

### 3. Search Screen
- **Purpose**: Find specific restaurants with filters
- **Layout**:
  - **Header**: Default navigation header with search bar integrated
    - Search input (placeholder: "Search restaurants...")
    - Filter icon button (right side)
  - **Main Content** (FlatList):
    - Search results as restaurant cards
    - Empty state: "No restaurants found" with search icon
  - **Safe Area Insets**:
    - Top: Spacing.xl
    - Bottom: tabBarHeight + Spacing.xl
- **Components**: Search input, filter button, restaurant cards (list)

### 4. Filter Modal (Native Modal)
- **Purpose**: Refine search by cuisine, rating, and price
- **Layout**:
  - **Header**: Custom modal header
    - Title: "Filters" (centered)
    - Close button (X icon, top right)
  - **Form** (ScrollView):
    - Cuisine Type section (chip selector: All, Italian, Indian, Arabian)
    - Minimum Rating slider (1-5 stars)
    - Price Range slider ($ - $$$$)
    - Star Rating quick filter (1-5 star buttons)
  - **Footer**: Fixed at bottom
    - "Apply Filters" button (burgundy, full-width)
    - "Clear All" text button
  - **Safe Area Insets**:
    - Top: insets.top + Spacing.xl
    - Bottom: insets.bottom + Spacing.xl
- **Components**: Chip selector, sliders, buttons

### 5. Favorites Screen
- **Purpose**: View saved restaurants
- **Layout**:
  - **Header**: Default navigation header
    - Title: "Favorites" (centered)
  - **Main Content** (Grid Layout - 2 columns):
    - Restaurant cards with heart icon (filled, toggleable)
    - Empty state: "No favorites yet" with heart icon
  - **Safe Area Insets**:
    - Top: Spacing.xl
    - Bottom: tabBarHeight + Spacing.xl
- **Components**: Grid of favorite cards

### 6. Restaurant Details Screen
- **Purpose**: View comprehensive restaurant information
- **Layout**:
  - **Header**: Transparent with back button (white, top left)
  - **Main Content** (ScrollView):
    - Hero image (full-width, 250px height)
    - Restaurant name (large, bold)
    - Rating stars + review count + price range ($$)
    - Details section (white card with padding)
    - Call and Direction buttons (row, outlined style)
    - Guest Reviews section (list of review cards)
  - **Floating Button**: "Book a Table" (burgundy, fixed at bottom, full-width with horizontal padding)
    - Shadow: shadowOffset {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2
  - **Safe Area Insets**:
    - Top: headerHeight + Spacing.xl
    - Bottom: insets.bottom + Spacing.xl + 60px (button height + spacing)
- **Components**: Hero image, info card, action buttons, review cards, floating CTA

## Design System

### Color Palette
**Primary Colors**
- Burgundy Primary: #8B1538 (main brand color, buttons, active states)
- Wine Accent: #6B0F2A (darker variant for gradients, shadows)
- Cream White: #FFFAF5 (backgrounds, cards)

**Neutral Colors**
- Text Primary: #1A1A1A (headings, main text)
- Text Secondary: #666666 (descriptions, metadata)
- Border Light: #E5E5E5 (card borders, dividers)
- Background: #F9F9F9 (screen background)

**Semantic Colors**
- Star Gold: #FFB800 (ratings)
- Success Green: #28A745 (available status)
- White: #FFFFFF (cards, overlays)

### Typography
**Font Family**: System default (San Francisco for iOS, Roboto for Android)

**Type Scale**
- Display Large: 32px, Bold, line-height 40px (splash screen)
- Heading 1: 24px, Bold, line-height 32px (page titles)
- Heading 2: 20px, SemiBold, line-height 28px (restaurant names)
- Body Regular: 16px, Regular, line-height 24px (descriptions)
- Body Small: 14px, Regular, line-height 20px (metadata, labels)
- Caption: 12px, Regular, line-height 16px (helper text)

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- xxl: 32px

### Component Specifications

#### Restaurant Card (List View)
- White background with subtle border (1px, Border Light)
- 16px padding
- Restaurant image: 100px × 100px, rounded corners (8px), left-aligned
- Content area: right of image
  - Name: Heading 2, Text Primary
  - Cuisine type: Body Small, Text Secondary
  - Rating: Star icons (gold) + review count
  - Price range: Body Small, Burgundy Primary
- Action buttons: "View" (outlined) and "Book" (filled burgundy)
- Touchable with subtle press opacity (0.7)

#### Restaurant Card (Grid View - Favorites)
- Square card with 1:1 aspect ratio
- Restaurant image: Full-width, top portion (60% height)
- Heart icon: Absolute positioned, top right, 8px margin, filled burgundy
- Content area: bottom 40%
  - Name: Body Regular, Text Primary (truncated to 2 lines)
  - Rating stars + price
- Touchable with scale animation (0.98 on press)

#### Search Bar
- Height: 48px
- Background: White
- Border radius: 24px (fully rounded)
- Padding: 12px horizontal
- Search icon: 20px, Text Secondary, left side
- Filter icon: 20px, Burgundy Primary, right side (touchable)
- Placeholder: "Search for restaurants..." (Text Secondary)

#### Tab Selector (ALL | NEARBY | TRENDING)
- Horizontal scrollable row
- Each tab: 16px padding vertical, 24px padding horizontal
- Active state: Burgundy underline (3px height), Burgundy Primary text
- Inactive state: Text Secondary, no underline
- Smooth transition on tab change

#### Filter Chips (Cuisine Type)
- Height: 36px
- Border radius: 18px
- Padding: 12px horizontal
- Active: Burgundy background, White text
- Inactive: Border Light border, Text Secondary
- Touchable with press feedback

#### Slider (Rating/Price Range)
- Track height: 4px
- Track color: Border Light (inactive), Burgundy Primary (active)
- Thumb: 24px circle, White with Burgundy border (2px), drop shadow
- Labels: Body Small, Text Secondary, positioned above/below track

#### Floating "Book a Table" Button
- Height: 52px
- Full-width with 16px horizontal margin
- Background: Burgundy Primary
- Text: White, 16px, SemiBold
- Border radius: 26px
- Drop shadow: shadowOffset {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2
- Press feedback: scale 0.98 + opacity 0.9

### Visual Feedback
- All touchable elements: opacity 0.7 on press
- Floating buttons: scale 0.98 + opacity 0.9 on press
- Tab transitions: smooth 200ms fade
- Modal presentation: slide up from bottom (300ms)
- Heart toggle: scale animation (1.0 → 1.2 → 1.0, 300ms)

### Required Assets
**Critical Assets**
1. **Savorist Logo** (white version for splash, burgundy version for light backgrounds)
2. **Restaurant Images** (10-15 sample images for prototype: Italian, Indian, Arabian, American cuisines)
3. **Promotional Banner** (50% OFF example with food imagery)
4. **Empty State Icons**:
   - Search icon (large, for no results)
   - Heart icon (large, for empty favorites)

**Icons** (Use Feather icons from @expo/vector-icons)
- Navigation: home, search, heart, user
- Actions: filter, phone, navigation (directions), x (close)
- Star (rating): Use filled/outlined variants

### Accessibility
- Minimum touch target: 44×44px for all interactive elements
- Color contrast ratio: 4.5:1 for text, 3:1 for UI components
- Screen reader labels for all icons and images
- Keyboard navigation support for form inputs
- Dynamic type support (respect system font scaling)