const ONBOARDING_QUEUE = [
  { id: 'onboarding-learn', type: 'lesson', priority: 5, reason: 'Start here: pick a topic in the Learn Hub and complete your first lesson.', payload: { route: '/learn' } },
  { id: 'onboarding-flashcards', type: 'flashcard-review', priority: 4, reason: 'Create your first flashcard deck to start building retention.', payload: { route: '/flashcards' } },
  { id: 'onboarding-project', type: 'code-project', priority: 3, reason: 'Try a guided mini project to apply what you learn.', payload: { route: '/projects' } },
];

const RULES = [
  // Rule 1: Flashcards due (highest priority)
  {
    id: 'flashcards-due',
    type: 'flashcard-review',
    priority: 5,
    condition: (m) => (m.flashcardProfile?.cardsDue || 0) > 0,
    build: (m) => ({
      reason: `You have ${m.flashcardProfile.cardsDue} flashcard${m.flashcardProfile.cardsDue > 1 ? 's' : ''} due for review.`,
      payload: { route: '/flashcards', cardsDue: m.flashcardProfile.cardsDue },
    }),
  },
  // Rule 2: Continue current lesson
  {
    id: 'lesson-continuation',
    type: 'lesson',
    priority: 4,
    condition: (m) => !!m.learningProfile?.currentTopic,
    build: (m) => ({
      reason: `Continue where you left off: ${m.learningProfile.currentTopic}.`,
      payload: { route: `/learn/${m.learningProfile.currentTopic}`, topicId: m.learningProfile.currentTopic },
    }),
  },
  // Rule 3: New topic suggestion
  {
    id: 'new-topic',
    type: 'lesson',
    priority: 3,
    condition: (m) => (m.learningProfile?.recommendedNext || []).length > 0,
    build: (m) => ({
      reason: `Ready for something new? Try: ${m.learningProfile.recommendedNext[0]}.`,
      payload: { route: '/learn', topicId: m.learningProfile.recommendedNext[0] },
    }),
  },
  // Rule 4: Apply learning via a code project (always available as fallback)
  {
    id: 'code-project',
    type: 'code-project',
    priority: 1,
    condition: () => true,
    build: () => ({
      reason: 'Apply what you\'ve learned — tackle a guided mini project or experiment in the Code Playground.',
      payload: { route: '/projects' },
    }),
  },
];

function isDismissed(model, actionType) {
  const dismissals = model.actionDismissals || [];
  const entry = dismissals.find(d => d.actionType === actionType);
  if (!entry) return false;
  return entry.suppressedUntil && new Date(entry.suppressedUntil) > new Date();
}

function getNextActionQueue(userModel) {
  const isNewUser =
    !(userModel.learningProfile?.completedTopics?.length) &&
    !userModel.learningProfile?.lastActivity &&
    !userModel.flashcardProfile?.lastReview;

  if (isNewUser) return ONBOARDING_QUEUE;

  const queue = [];
  for (const rule of RULES) {
    if (queue.length >= 5) break;
    if (isDismissed(userModel, rule.type)) continue;
    if (!rule.condition(userModel)) continue;
    const built = rule.build(userModel);
    queue.push({ id: rule.id, type: rule.type, priority: rule.priority, ...built });
  }
  return queue;
}

module.exports = { getNextActionQueue };
