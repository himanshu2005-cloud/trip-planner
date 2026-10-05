# Intelligent Travel Itinerary Planner

## Project

Final-Year B.Tech CSE Major Project.

## Problem Statement

Trip planning across multiple attractions in a city is manual and time-consuming. Travellers must research places, check opening hours, estimate costs, and figure out a sensible day-wise route themselves.

## Proposed Solution

A web application where a user enters:
- Destination
- Number of days
- Budget
- Interests such as history, food, nature, etc.

The system generates a day-wise itinerary that groups nearby attractions together, orders each day's visits to minimize travel, and respects time and budget limits.

## Core Algorithm

The itinerary is generated through a three-stage optimization pipeline:

1. **Clustering**
   - Group attractions into day-wise geographic clusters using k-means.
   - Each day should cover a coherent area of the city.

2. **Route Ordering**
   - Within each day, order stops using a TSP heuristic.
   - Initial route: nearest-neighbour.
   - Improve route using 2-opt.

3. **Constraint Fitting**
   - Use a greedy knapsack-style pass to fit attractions into available daily time and overall budget.
   - Respect attraction opening hours.

## Key Features

- Day-wise itinerary generation from destination, days, budget, and interests.
- Regenerate a single day without disturbing the rest of the trip.
- Budget-aware re-planning when the user changes the budget.
- Weather-aware adjustment: swap outdoor stops for indoor alternatives when rain is forecast.
- Save and edit trips with JWT-authenticated accounts.
- Map view with cost and travel-time estimates per stop.
- Instagram deep-link/search link for attractions rather than programmatic location-based Instagram content retrieval.

## Tech Stack

- Frontend: React
- Backend: Node.js + Express.js
- Database: MongoDB
- External APIs: Google Places API, OpenWeather API
- Authentication: JWT

## Suggested Architecture

Frontend:
- React
- React Router
- Tailwind CSS
- Lucide React

Backend:
- Node.js
- Express
- JWT
- MongoDB/Mongoose

Services:
- Places service
- Weather service
- Itinerary optimization engine
- Route service

## Core Data Model

Trip:
- userId
- destination
- budget
- numberOfDays
- interests
- itinerary
- createdAt
- updatedAt

Itinerary Day:
- dayNumber
- date
- totalCost
- totalTravelTime
- stops

Stop:
- attractionId
- name
- coordinates
- category
- rating
- startTime
- duration
- cost
- openingHours
- travelToNext
- weatherStatus

## Development Phases

### Phase 1 — Project Setup
- Initialize React frontend.
- Initialize Express backend.
- Configure MongoDB.
- Configure environment variables.
- Configure Git.
- Create base folder structure.

### Phase 2 — Authentication
- Register.
- Login.
- JWT authentication.
- Protected trip routes.

### Phase 3 — Attraction Data
- Google Places integration.
- Normalize attraction data.
- Store/use coordinates, ratings, categories, costs and opening hours where available.

### Phase 4 — Optimization Engine
Implement and test:
- K-means geographic clustering.
- Day assignment.
- Nearest-neighbour route generation.
- 2-opt improvement.
- Time constraints.
- Opening-hour constraints.
- Budget constraints.

### Phase 5 — Itinerary API
Create endpoints for:
- Generate itinerary.
- Get trip.
- Save trip.
- Edit trip.
- Regenerate one day.
- Re-plan after budget changes.
- Delete trip.

### Phase 6 — Frontend
Build:
- Landing page.
- Trip planner form.
- Planning/loading experience.
- Itinerary dashboard.
- Day tabs.
- Timeline.
- Budget summary.
- Weather alert.
- Attraction cards.
- Map.
- Saved trips.

### Phase 7 — Weather
- OpenWeather integration.
- Detect problematic weather.
- Identify suitable indoor alternatives.
- Adjust affected day without unnecessarily changing other days.

### Phase 8 — Map
- Display attraction markers.
- Display numbered route.
- Show travel distance/time.
- Keep map and itinerary numbering synchronized.

### Phase 9 — Polish
- Responsive design.
- Accessibility.
- Loading states.
- Error states.
- Empty states.
- Form validation.
- Performance improvements.

### Phase 10 — Testing
Test:
- Authentication.
- API validation.
- Algorithm correctness.
- Route ordering.
- Budget constraints.
- Opening hours.
- Weather replacement.
- Regenerate-day isolation.
- Trip persistence.
- Mobile UI.

## Important Development Rules

- Do not expose API keys to the frontend.
- Do not hardcode secrets.
- Do not create fake functionality.
- Do not add unnecessary dependencies.
- Keep algorithmic logic separate from UI code.
- Write tests for each major optimization stage.
- Preserve existing working functionality when adding features.
- Make changes incrementally and review Git diffs.
- Prefer deterministic algorithm behavior during testing.

## Success Criteria

The final application should demonstrate genuine algorithmic contribution rather than functioning as a simple API wrapper.

The demo should clearly show:
1. Attraction discovery.
2. Geographic clustering.
3. Route optimization.
4. Time/opening-hour constraints.
5. Budget constraints.
6. Weather-aware adjustment.
7. Saved/editable trips.
