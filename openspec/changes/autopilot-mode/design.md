## Context

V currently operates in a fully manual mode — users decide what to type, what to learn, and when to review. All intelligence (ML typing analysis, Gemini tutoring) is reactive: it responds when asked. The platform has strong primitives — keystroke ML, LLM abstraction, notifications, XP/streak tracking — but no layer that connects them into a coherent "what should I do now?" signal.

AutoPilot Mode introduces an **Intelligence Layer**: a User Model that aggregates all activity, an Adaptive Engine that turns that model into decisions, an AI Content Generator that produces personalized material, and a Proactive Coach that initiates contact rather than waiting.

## Goals / Non-Goals

**Goals:**
- Persistent User Model that stays current with every user action
- Adaptive Engine that produces a prioritized "next action" queue across typing, learning, and flashcard domains
- Server-side AI content generation (typing exercises, flashcards, lesson summaries) personalized to the User Model
- Proactive coaching: pattern detection triggers nudges without user initiation
- AutoPilot UX: a toggle, a dedicated dashboard view, and per-page AutoPilot suggestions
- Zero disruption to manual mode — AutoPilot is strictly additive and opt-in

**Non-Goals:**
- Replacing the ML typing pipeline (that remains; AutoPilot reads its outputs)
- Real-time multiplayer or social features
- Mobile push notifications (in-app only for now)
- Fully autonomous session execution (AutoPilot suggests, user still acts)

## Decisions

### 1. User Model as a persistent MongoDB document (not computed on-demand)

**Decision**: Each user has a `UserModel` document updated incrementally via event hooks on existing API routes. Reads are O(1) — the model is always current.

**Alternatives considered**:
- *Compute from raw event logs each time*: Too slow; event logs grow unbounded
- *Redis cache*: Adds infra dependency; MongoDB with indexed userId is fast enough

### 2. Adaptive Engine: rule-based core + LLM scoring for nuance

**Decision**: A deterministic rule engine handles the base queue (e.g., "weak key detected → queue key drill", "3 cards due → queue flashcard review"). LLM scoring layers on top for natural-language rationale and edge-case prioritization.

**Alternatives considered**:
- *Pure LLM*: Too slow and expensive to call on every dashboard load
- *Pure rules*: Works well for simple cases but can't handle nuanced cross-domain decisions ("should I do typing or the next lesson given my current state?")

### 3. Content generation is server-side and cached per User Model snapshot

**Decision**: Generation happens on the server via `ContentGenerationService`, which calls the existing LLM abstraction. Results are cached in the `UserModel` document (keyed by a snapshot hash) and regenerated only when the model changes significantly.

**Alternatives considered**:
- *Client-side generation*: Exposes LLM API keys; harder to cache; inconsistent across devices

### 4. Proactive coaching via scheduled checks + session-end triggers

**Decision**: A lightweight server-side scheduler (node-cron or similar) runs coaching checks (e.g., daily at a fixed time). Session-end events also trigger immediate coaching evaluation. Coaching messages are stored in `UserModel.coachingState` and fetched on next app load.

**Alternatives considered**:
- *WebSocket push*: Overkill for coaching cadence; polling on app load is sufficient
- *Client-side timers*: Can't detect "user hasn't logged in for 2 days" patterns

### 5. AutoPilot state in Zustand with DB persistence

**Decision**: `useAutoPilotStore` (Zustand) holds the enabled flag and next-action queue locally for instant UI response. The flag is also persisted in `UserModel.autopilotEnabled` so it survives browser resets.

### 6. Activity events via thin middleware on existing API routes

**Decision**: A reusable `trackActivity(type, payload)` utility is called at the end of existing route handlers (typing session save, lesson complete, flashcard review). It updates `UserModel` incrementally — no separate event bus needed at this scale.

```
                    ┌─────────────────────────────────────┐
                    │         Intelligence Layer          │
  Client            │  Server                            │
  ──────────────    │  ──────────────────────────────    │
                    │                                    │
  AutoPilot UI ◄───┼──── /api/autopilot/next-action     │
  (toggle,          │         │                          │
   next-action      │         ▼                          │
   dashboard)       │    AdaptiveEngine                  │
                    │         │ reads                    │
  Activity ────────┼──► UserModelService                 │
  events            │         │ updates                  │
  (session,         │         ▼                          │
   lesson,          │    UserModel (MongoDB)             │
   flashcard)       │         │                          │
                    │    ┌────┴──────────────┐           │
                    │    ▼                   ▼           │
                    │  ContentGenService  CoachingService │
                    │    │ (LLM calls)       │ (cron +   │
                    │    ▼                   │  triggers) │
                    │  Generated content     ▼           │
                    │  cached in UserModel  Nudges →     │
                    │                       Notifications│
                    └─────────────────────────────────────┘
```

## Risks / Trade-offs

- **LLM generation latency** → Generate async in background after session events; serve cached content immediately; show "generating..." state when cache is cold
- **User Model staleness on concurrent sessions** → Use MongoDB `$set` with `updatedAt` guard; last-write-wins is acceptable for a single-user learning profile
- **Coaching fatigue** → Hard cap: max 1 nudge per day; respect explicit dismissals (stored in `coachingState.dismissed`); back off after 3 consecutive dismissals
- **AutoPilot feels intrusive** → All suggestions have a visible "Do it my way" override; AutoPilot never blocks navigation
- **Rule engine complexity** → Keep rules as a plain JS array of `{ condition, action, priority }` objects — no DSL, no external rule engine; easy to extend

## Migration Plan

1. Deploy `UserModel` schema migration — backfill empty models for existing users on first AutoPilot load
2. Ship feature behind `autopilotEnabled: false` default — invisible to users until they toggle on
3. No changes to existing API contracts; activity tracking is additive middleware
4. Rollback: disable AutoPilot routes, feature stays dormant; no data loss

## Open Questions

- Should the adaptive engine's next-action queue be visible to users (transparent AI) or just felt through UI changes (invisible AI)? Current leaning: show the queue in AutoPilot dashboard view for trust-building.
- Cron job hosting: if the app runs on a single Node process, `node-cron` is fine. If it scales horizontally, coaching checks need a distributed lock.
