`# DESIGN.md — Intelligent Travel Itinerary Planner

## 1. Product Identity

Build a premium travel-planning web application that generates optimized day-wise itineraries based on:

- Destination
- Number of days
- Budget
- User interests
- Attraction distance
- Opening hours
- Weather
- Travel time

The product should feel like a combination of:
- Premium travel app
- Modern intelligent planning tool
- Interactive map application
- Calm productivity dashboard

The UI must communicate intelligence and trust without looking like a generic AI chatbot.

## 2. Visual Direction

Primary style:

**Purple Glassmorphism + Soft Neumorphism + Minimal Editorial Travel UI**

Avoid excessive glass effects.

Use glass selectively for:
- Navigation
- Floating cards
- Filters
- Modals
- Map overlays
- Summary cards

The main page should remain readable and clean.

Keywords:
- Premium
- Calm
- Intelligent
- Modern
- Travel-focused
- Soft
- Spacious
- Minimal
- Interactive
- Polished

## 3. Color System

Primary:

```css
--purple-950: #170B2E;
--purple-900: #241044;
--purple-800: #32165F;
--purple-700: #4C1D95;
--purple-600: #6D28D9;
--purple-500: #8B5CF6;
--purple-400: #A78BFA;
--purple-300: #C4B5FD;
```

Accent:

```css
--accent-pink: #E879F9;
--accent-blue: #818CF8;
--accent-cyan: #67E8F9;
```

Background:

```css
--background: #0B0714;
--background-secondary: #120B20;
--surface: rgba(255,255,255,0.06);
--surface-hover: rgba(255,255,255,0.09);
--text-primary: #F8F7FC;
--text-secondary: #B8B1C8;
--text-muted: #827990;
```

Status colors:

```css
--success: #34D399;
--warning: #FBBF24;
--danger: #FB7185;
```

## 4. Background

Do not use a completely flat black background.

Use subtle atmospheric gradients:

```css
background:
radial-gradient(
  circle at 15% 10%,
  rgba(139,92,246,0.18),
  transparent 30%
),
radial-gradient(
  circle at 85% 20%,
  rgba(232,121,249,0.10),
  transparent 28%
),
#0B0714;
```

Keep gradients subtle. Never make the site look like a neon gaming website.

## 5. Typography

Primary font: **Inter**

Fallback:

```css
font-family:
Inter,
ui-sans-serif,
system-ui,
-apple-system,
BlinkMacSystemFont,
"Segoe UI",
sans-serif;
```

Headings:
- Weight 600–700
- Tight letter spacing
- Large but not oversized

Body:
- Weight 400–500
- Comfortable line height

Do not use excessive bold text.

## 6. Glassmorphism

Use:

```css
background: rgba(255,255,255,0.055);
border: 1px solid rgba(255,255,255,0.09);
backdrop-filter: blur(18px);
-webkit-backdrop-filter: blur(18px);
box-shadow: 0 20px 60px rgba(0,0,0,0.25);
border-radius: 20px;
```

Smaller components can use 14px radius.

Do not put every element inside a glass card.

## 7. Navigation

Desktop:
- Logo on left
- Main navigation in center
- Profile controls on right
- Primary CTA: Plan a Trip

Navigation:
- Plan Trip
- My Trips
- Explore

Navbar should be translucent and slightly floating.

Example:

```text
┌──────────────────────────────────────────────────────────────┐
│ ✦ TripPilot      Plan Trip   My Trips   Explore     ◉ User  │
└──────────────────────────────────────────────────────────────┘
```

Logo should be simple and geometric.

## 8. Landing Page

Hero headline:

**Plan less. Explore more.**

Supporting text:

**Build smarter day-by-day itineraries optimized around your time, budget, interests, and travel distance.**

Primary CTA:
**Create My Itinerary**

Secondary CTA:
**Explore How It Works**

Show a large itinerary preview/card rather than a generic stock travel image.

## 9. Trip Planning Form

Create a premium glass card.

Fields:

### Destination
Placeholder:
`Where are you going?`

### Trip duration
Example:
`5 days`

### Budget
Example:
`₹40,000`

### Interests

Selectable chips:
- History
- Food
- Nature
- Architecture
- Shopping
- Nightlife
- Culture
- Adventure

Selected chips use purple gradients.

Primary CTA:
**Generate My Itinerary →**

Button:

```css
linear-gradient(135deg, #7C3AED, #A855F7);
```

## 10. Loading Experience

Do not show only "Loading...".

Use:

```text
Creating your itinerary

✓ Finding attractions
✓ Grouping nearby places
● Optimizing daily routes
○ Checking opening hours
○ Checking weather
```

Animate the steps.

The loading experience should communicate actual planning stages.

## 11. Itinerary Dashboard

Top summary:

```text
Paris, France
5 Days · ₹40,000 Budget

42 attractions analyzed
18 selected
32.4 km estimated travel
₹36,850 estimated cost
```

Use compact glass cards.

## 12. Day Navigation

Horizontal day tabs:

```text
Day 1     Day 2     Day 3     Day 4     Day 5
```

Selected day:
- Purple gradient
- Subtle glow

Example:

```text
DAY 2
Historic Paris
8:30 AM → 7:00 PM
```

## 13. Day Itinerary

Use timeline cards.

Example:

```text
09:00
│
├── Louvre Museum
│   ★ 4.8
│   2h 30m
│   ₹1,800
│
│   1.2 km → 18 min
│
├── Café Lunch
│   1h
│   ₹900
│
│   0.8 km → 10 min
│
└── Notre-Dame
    1h 30m
    Free
```

Each stop can show:
- Attraction name
- Time
- Duration
- Estimated cost
- Distance to next stop
- Travel time
- Category
- Opening-hours status

## 14. Map

Map should occupy a major portion of the itinerary page.

Desktop:

```text
┌───────────────────────┬─────────────────────────────┐
│                       │                             │
│    DAY ITINERARY      │            MAP              │
│                       │                             │
│  09:00 Louvre         │        ●────●               │
│  12:00 Lunch          │         ╲   │               │
│  14:00 Notre Dame     │          ●──●               │
│                       │                             │
│  Regenerate Day       │                             │
└───────────────────────┴─────────────────────────────┘
```

Use numbered markers:
`1 → 2 → 3 → 4`

Use the same numbering in the itinerary.

## 15. Regenerate Day

Every day has a **Regenerate Day** action.

Options:

```text
Regenerate Day 3

Why?

○ Too expensive
○ Too much travel
○ More food
○ More nature
○ More indoor activities
○ Weather changed

Budget remaining:
₹8,200
```

Regenerating one day must not modify other days.

## 16. Budget UI

Example:

```text
Trip Budget

₹36,850 / ₹40,000

██████████████████░░

₹3,150 remaining
```

Breakdown:
- Attractions
- Food
- Transport
- Other

Use a clean progress/donut visualization where useful.

## 17. Weather UI

Example:

```text
☔ Rain expected at 3 PM

Outdoor activities have been adjusted.

Original:
Eiffel Tower → Luxembourg Gardens

Updated:
Eiffel Tower → Louvre Museum
```

Present this as an intelligent recommendation.

## 18. Attraction Cards

Include:
- Image
- Name
- Category
- Rating
- Estimated visit duration
- Cost
- Opening status
- Distance
- Add/remove action

Example:

```text
┌───────────────────────────────┐
│        Attraction Image       │
├───────────────────────────────┤
│ Louvre Museum                 │
│ History · Art                 │
│ ★ 4.8                         │
│                               │
│ 2h 30m     ₹1,800             │
│                               │
│ Open until 6:00 PM            │
└───────────────────────────────┘
```

## 19. Saved Trips

"My Trips" cards:

```text
Paris
5 days · ₹40,000
18 places
Updated 2 days ago

[Open Trip]
```

Allow:
- Open
- Edit
- Duplicate
- Delete

## 20. Authentication

Keep authentication simple.

Pages:
- Sign in
- Create account

Do not overdesign authentication.

## 21. Instagram Deep Link

Each attraction may have:

**Find on Instagram**

This should open Instagram's search page externally.

Do not scrape or programmatically retrieve location-based Instagram content.

## 22. Responsive Design

Desktop:
- Navigation
- Hero
- Planning form
- Dashboard
- Two-column itinerary + map

Tablet:
- Navigation
- Planning form
- Stacked dashboard
- Map + itinerary

Mobile:
- Compact navigation
- Planning form
- Day selector
- Itinerary
- Map
- Budget

Map may become a collapsible section on mobile.

## 23. Animations

Use subtle:
- opacity
- transform
- scale
- blur
- gradient movement

Preferred duration:
`150–300ms`

Examples:
- Card hover: translateY(-2px)
- Button hover: scale(1.02)
- Page transition: fade + translateY(8px)

Avoid excessive bouncing, spinning cards, huge parallax effects, and distracting animations.

## 24. Icons

Use **Lucide React**.

Do not use random emoji as UI icons.

Useful icons:
- MapPin
- CalendarDays
- Wallet
- CloudRain
- Clock
- Route
- Sparkles
- RefreshCw
- Heart
- Settings

## 25. Component Architecture

Recommended structure:

```text
src/
├── components/
│   ├── layout/
│   │   ├── Navbar
│   │   └── Footer
│   │
│   ├── planner/
│   │   ├── TripForm
│   │   ├── InterestSelector
│   │   └── PlanningLoader
│   │
│   ├── itinerary/
│   │   ├── DayTabs
│   │   ├── DayTimeline
│   │   ├── StopCard
│   │   ├── BudgetSummary
│   │   └── WeatherAlert
│   │
│   ├── map/
│   │   └── ItineraryMap
│   │
│   └── ui/
│       ├── Button
│       ├── Card
│       ├── Modal
│       ├── Badge
│       └── Input
│
├── pages/
├── services/
├── hooks/
├── utils/
└── types/
```

## 26. Design Rules

### DO
- Use generous spacing.
- Use consistent 20px card radius.
- Use subtle purple glow.
- Use clear hierarchy.
- Keep information readable.
- Use real loading states.
- Use consistent icons.
- Make everything responsive.
- Keep interactions obvious.

### DON'T
- Don't use purple everywhere.
- Don't make every component glass.
- Don't use huge gradients.
- Don't use excessive shadows.
- Don't use random fonts.
- Don't use emoji as UI icons.
- Don't create fake functionality.
- Don't hardcode API keys.
- Don't sacrifice usability for aesthetics.

## 27. Overall Visual Target

The final product should feel like:

**A premium intelligent travel planner**

not:

**A college project with a purple theme.**

The algorithm should be visible through the product experience.

The user should understand that the application:
1. Finds attractions.
2. Groups nearby places.
3. Optimizes the route.
4. Checks time constraints.
5. Checks budget.
6. Adjusts for weather.
7. Produces an optimized itinerary.

The interface should make this intelligence obvious without exposing unnecessary technical complexity.
