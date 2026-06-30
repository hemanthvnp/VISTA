## 1. Foundation — User Model

- [x] 1.1 Create `server/models/UserModel.js` Mongoose schema with `typingProfile`, `learningProfile`, `flashcardProfile`, `coachingState`, and `autopilotEnabled` fields
- [x] 1.2 Write `server/services/UserModelService.js` with `getOrCreate(userId)`, `updateTypingProfile(userId, sessionData)`, `updateLearningProfile(userId, topicId, score)`, `updateFlashcardProfile(userId, reviewData)` methods
- [x] 1.3 Add `trackActivity(type, payload, userId)` utility in `server/utils/activityTracker.js` that calls the appropriate `UserModelService` method
- [x] 1.4 Wire `trackActivity` into the existing typing session save route (`POST /api/typing/sessions`) as post-save middleware
- [x] 1.5 Wire `trackActivity` into the existing lesson completion route
- [x] 1.6 Wire `trackActivity` into the existing flashcard review route
- [x] 1.7 Add `GET /api/autopilot/user-model` route with JWT auth returning the current user's `UserModel`

## 2. Adaptive Engine

- [x] 2.1 Create `server/services/AdaptiveEngineService.js` with a rule array and `getNextActionQueue(userModel)` function returning up to 5 prioritized action items
- [x] 2.2 Implement the 5 priority rules: due flashcards → weak key drill → lesson continuation → new topic suggestion → free typing
- [x] 2.3 Add dismissal tracking to `UserModel.coachingState` (store dismissed action types with expiry timestamp)
- [x] 2.4 Add `GET /api/autopilot/next-action` route that calls `AdaptiveEngineService.getNextActionQueue` with the authenticated user's model
- [x] 2.5 Add `POST /api/autopilot/next-action/:id/dismiss` route that records the dismissal and returns updated queue

## 3. AI Content Generation

- [x] 3.1 Create `server/services/ContentGenerationService.js` with `generateTypingExercise(weakKeys)`, `generateFlashcards(topicId, topicContent)`, and `generateLessonSummary(topicId, topicContent)` methods using the existing LLM abstraction
- [x] 3.2 Implement cache key logic: typing exercise cache keyed by sorted `weakKeys` array hash; lesson summary cache keyed by `topicId`; store in `UserModel` for per-user caches, in a shared `ContentCache` collection for lesson summaries
- [x] 3.3 Add static fallback values for each generation type (used when LLM fails)
- [x] 3.4 Add `GET /api/autopilot/content/typing-exercise` route with cache-or-generate logic
- [x] 3.5 Add `POST /api/autopilot/content/flashcards` route accepting `{ topicId }` with duplicate-prevention logic
- [x] 3.6 Add `GET /api/autopilot/content/lesson-summary/:topicId` route using shared cache

## 4. Proactive Coaching

- [x] 4.1 Create `server/services/CoachingService.js` with `evaluateUser(userModel)` returning an array of coaching message objects and `evaluateAll()` for the daily batch run
- [x] 4.2 Implement coaching detectors: re-engagement (no login 48h), stagnation (WPM flat 7 days), skill-gap (new weak key > 20% error)
- [x] 4.3 Implement fatigue protection: suppress message type for 24h on dismiss, 7 days after 3 dismissals within 7 days
- [x] 4.4 Add `node-cron` to `server/package.json` and set up daily coaching job in `server/index.js` running `CoachingService.evaluateAll()` at 08:00 server time
- [x] 4.5 Call `CoachingService.evaluateUser(userModel)` at the end of the typing session save route (session-end trigger)
- [x] 4.6 Add `GET /api/autopilot/coaching/messages` route returning `activeMessages` for authenticated user
- [x] 4.7 Add `POST /api/autopilot/coaching/messages/:id/ack` route marking a message as `read: true`
- [x] 4.8 Add `POST /api/autopilot/coaching/messages/:id/dismiss` route removing message and recording suppression

## 5. Frontend — State & Hooks

- [x] 5.1 Create `client/src/store/useAutoPilotStore.js` Zustand store with `enabled`, `nextActions`, `coachingMessages`, `toggle()`, `setNextActions()`, `setCoachingMessages()`, and `dismissAction()` methods; persist `enabled` to localStorage
- [x] 5.2 Create `client/src/hooks/useAutoPilot.js` hook that fetches `next-action` and `coaching/messages` on mount when `enabled`, syncs `enabled` flag to DB via `PATCH /api/autopilot/toggle`, and exposes loading/error state
- [x] 5.3 Add `PATCH /api/autopilot/toggle` server route that sets `UserModel.autopilotEnabled` and returns the updated value

## 6. Frontend — AutoPilot UX

- [x] 6.1 Create `client/src/components/autopilot/AutoPilotToggle.jsx` — a labeled toggle switch component that calls `useAutoPilotStore().toggle()`
- [x] 6.2 Add `AutoPilotToggle` to the Dashboard `TopBar` and to the Settings page
- [x] 6.3 Create `client/src/components/autopilot/ActionCard.jsx` — displays action type icon, reason text, priority, CTA button, and dismiss button
- [x] 6.4 Create `client/src/components/autopilot/AutoPilotDashboard.jsx` — renders the next-action queue as `ActionCard` list; shows "all caught up" state when queue is empty
- [x] 6.5 Update `client/src/pages/Dashboard.jsx` to conditionally render `AutoPilotDashboard` in place of the recent-sessions widget when AutoPilot is enabled
- [x] 6.6 Create `client/src/components/autopilot/AutoPilotBadge.jsx` — small "AutoPilot" chip used to mark AI-generated content
- [x] 6.7 Wire coaching messages to existing `useNotifications` hook in `useAutoPilot.js` — push first unread message as a notification on app load

## 7. Frontend — Per-Page AutoPilot Integration

- [x] 7.1 In `client/src/pages/Typing.jsx`, check `useAutoPilotStore().enabled`; if true and an AutoPilot action of type `typing-drill` is in the queue, pre-fetch and pre-fill the generated exercise from `/api/autopilot/content/typing-exercise` and show `AutoPilotBadge`
- [x] 7.2 In `client/src/pages/Flashcards.jsx`, when navigated from an AutoPilot action, fetch AI-generated flashcard deck from `/api/autopilot/content/flashcards` and load it as the active deck alongside `AutoPilotBadge`
- [x] 7.3 In `client/src/pages/LearnHub.jsx` (or `LearnLesson.jsx`), when AutoPilot is enabled, show the recommended next lesson at the top of the topic list with an `AutoPilotBadge`
- [x] 7.4 Ensure all AutoPilot content suggestions have a visible override path (e.g., "Choose my own" link) that suppresses the badge for the current session

## 8. Polish & Edge Cases

- [x] 8.1 Add loading skeleton to `AutoPilotDashboard` while next-action queue is fetching
- [x] 8.2 Handle empty/new user state in `AdaptiveEngineService` with onboarding sequence fallback
- [x] 8.3 Verify LLM fallback values are returned (not errors) when `ContentGenerationService` fails
- [x] 8.4 Test coaching fatigue: confirm 3 dismissals within 7 days triggers 7-day suppression
- [x] 8.5 Confirm toggling AutoPilot off hides all AutoPilot UI elements and stops API calls
- [x] 8.6 Seed script: add `createUserModelForExistingUsers()` to `server/seeds/` to backfill models on deploy
