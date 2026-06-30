## Why

V requires users to manually decide what to study, when to practice, and how to improve — creating friction that leads to inconsistent sessions and slow progress. AutoPilot Mode removes that decision burden by letting the platform drive: it watches what you do, learns what you need, generates personalized content, and coaches you proactively.

## What Changes

- New **AutoPilot toggle** in the Dashboard and Settings — when enabled, V takes the wheel
- A **User Model** service that continuously aggregates typing stats, lesson completions, flashcard reviews, quiz scores, and session patterns into a structured learning profile
- An **Adaptive Engine** that reads the User Model and decides what to do next (which drill, which lesson, which flashcard deck)
- **AI Content Generation** that creates dynamic typing exercises, flashcards, and lesson summaries on demand using the existing LLM abstraction, personalized to the user's weak areas
- A **Proactive Coaching** layer that detects stagnation, skill gaps, and missed sessions — surfacing nudges, auto-queued sessions, and in-app coaching messages without waiting for the user to ask

## Capabilities

### New Capabilities

- `user-model`: Persistent per-user learning profile built from all activity events — tracks WPM trends, key weaknesses, lesson progress, flashcard retention, and session cadence
- `adaptive-engine`: Recommendation layer that reads the User Model and produces a prioritized "next action" queue across typing, learning, and flashcard domains
- `ai-content-generation`: On-demand LLM-powered generation of typing exercises, flashcard decks, and lesson content tailored to the current User Model snapshot
- `proactive-coaching`: Pattern detection and notification layer that surfaces coaching messages, session nudges, and auto-queued practice without user initiation
- `autopilot-ux`: The toggle UI, AutoPilot dashboard view ("What V wants you to do"), and the visual state shift when AutoPilot is active

### Modified Capabilities

<!-- No existing specs to modify -->

## Impact

- **Backend**: New services — `UserModelService`, `AdaptiveEngineService`, `ContentGenerationService`, `CoachingService`; new MongoDB model `UserModel`; new API routes under `/api/autopilot`
- **Frontend**: AutoPilot toggle component, AutoPilot-mode dashboard layout, `useAutoPilot` hook, updates to Typing/Flashcards/LearnHub pages to accept adaptive content
- **AI/LLM**: Content generation routed through existing LLM abstraction (Gemini + OpenAI-compatible) — no new provider dependencies
- **Notifications**: Proactive coaching uses the existing `useNotifications` hook; backend events push coaching triggers
- **No breaking changes** to existing manual navigation — AutoPilot is opt-in
