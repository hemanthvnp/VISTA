const router = require('express').Router();
const Achievement = require('../models/Achievement');
const TypingSession = require('../models/TypingSession');
const Progress = require('../models/Progress');
const User = require('../models/User');
const FlashcardProgress = require('../models/FlashcardProgress');
const Note = require('../models/Note');
const ChatHistory = require('../models/ChatHistory');
const CodeSnippet = require('../models/CodeSnippet');
const ProjectSubmission = require('../models/ProjectSubmission');
const auth = require('../middleware/auth');

// Single source of truth — frontend reads these directly from the API
const ALL_BADGES = [
  // ── Learner ──────────────────────────────────────────────────────────────
  { id: 'first-lesson',     category: 'learner',  emoji: '📖', name: 'First Step',         description: 'Complete your first lesson section' },
  { id: 'lesson-veteran',   category: 'learner',  emoji: '🎓', name: 'Lesson Veteran',      description: 'Complete 25 lesson sections' },
  { id: 'tech-explorer',    category: 'learner',  emoji: '🗺️', name: 'Tech Explorer',       description: 'Study 3+ different technologies' },
  { id: 'deep-diver',       category: 'learner',  emoji: '🏊', name: 'Deep Diver',          description: 'Complete any technology 100%' },
  { id: 'roadmap-half',     category: 'learner',  emoji: '🗝️', name: 'Halfway There',       description: 'Complete 5 technologies' },
  { id: 'flashcard-rookie', category: 'learner',  emoji: '🃏', name: 'Flashcard Rookie',    description: 'Review 50 flashcards' },
  { id: 'flashcard-master', category: 'learner',  emoji: '🧠', name: 'Flashcard Master',    description: 'Review 500 flashcards' },
  { id: 'note-taker',       category: 'learner',  emoji: '📝', name: 'Note Taker',          description: 'Write 500+ words across your notes' },
  { id: 'note-author',      category: 'learner',  emoji: '✍️', name: 'Note Author',         description: 'Score 70+ on a note quality check' },
  { id: 'deep-notes',       category: 'learner',  emoji: '📓', name: 'Deep Notes',           description: 'Write 2000+ words across your notes' },
  { id: 'scholar',          category: 'learner',  emoji: '📚', name: 'Scholar',             description: 'Accumulate 100+ total study hours' },
  { id: 'century-club',     category: 'learner',  emoji: '🏆', name: 'Century Club',        description: 'Complete all 10 technologies' },

  // ── Builder ──────────────────────────────────────────────────────────────
  { id: 'first-submission', category: 'builder',  emoji: '🔨', name: 'First Submission',    description: 'Submit your first GitHub project' },
  { id: 'project-bronze',   category: 'builder',  emoji: '🥉', name: 'Bronze Coder',        description: 'Score 50+ on an AI project review' },
  { id: 'project-silver',   category: 'builder',  emoji: '🥈', name: 'Silver Coder',        description: 'Score 70+ on an AI project review' },
  { id: 'project-gold',     category: 'builder',  emoji: '🥇', name: 'Gold Coder',          description: 'Score 85+ on an AI project review' },
  { id: 'multi-builder',    category: 'builder',  emoji: '🏗️', name: 'Multi Builder',       description: 'Submit 3+ projects' },
  { id: 'code-curious',     category: 'builder',  emoji: '💻', name: 'Code Curious',        description: 'Save 5 code snippets in the playground' },
  { id: 'polyglot',         category: 'builder',  emoji: '🌍', name: 'Polyglot',            description: 'Save snippets in 5+ different languages' },
  { id: 'snippet-saver',    category: 'builder',  emoji: '💾', name: 'Snippet Saver',       description: 'Save 10+ code snippets' },

  // ── Grind ────────────────────────────────────────────────────────────────
  { id: 'gate-first',       category: 'grind',    emoji: '🚪', name: 'Gatebreaker',         description: 'Complete your first daily gate' },
  { id: 'gate-keeper',      category: 'grind',    emoji: '🛡️', name: 'Gate Keeper',         description: 'Complete 30 gates without skipping' },
  { id: 'streak-3',         category: 'grind',    emoji: '🔥', name: 'On Fire',             description: 'Maintain a 3-day streak' },
  { id: 'streak-7',         category: 'grind',    emoji: '🔥', name: 'Week Warrior',        description: 'Maintain a 7-day streak' },
  { id: 'streak-30',        category: 'grind',    emoji: '💎', name: 'Diamond Streak',      description: 'Maintain a 30-day streak' },
  { id: 'early-bird',       category: 'grind',    emoji: '🌅', name: 'Early Bird',          description: 'Complete a gate before 7 AM' },
  { id: 'night-owl',        category: 'grind',    emoji: '🦉', name: 'Night Owl',           description: 'Complete a gate after 11 PM' },
  { id: 'time-lord',        category: 'grind',    emoji: '⏱️', name: 'Time Lord',           description: 'Accumulate 200+ total study hours' },

  // ── Explorer ─────────────────────────────────────────────────────────────
  { id: 'first-question',   category: 'explorer', emoji: '🤖', name: 'AI Curious',          description: 'Ask the AI Tutor your first question' },
  { id: 'curious-mind',     category: 'explorer', emoji: '💬', name: 'Curious Mind',        description: 'Ask the AI Tutor 50 questions' },
  { id: 'knowledge-seeker', category: 'explorer', emoji: '🔍', name: 'Knowledge Seeker',    description: 'Ask the AI Tutor 200 questions' },

  // ── VISTA Elite ──────────────────────────────────────────────────────────
  { id: 'vista-initiate',      category: 'vista', emoji: '👁️', name: 'VISTA Initiate',      description: 'Complete a lesson + submit a project',                     xpBonus: 250  },
  { id: 'precision-learner',   category: 'vista', emoji: '🎯', name: 'Precision Learner',   description: '95%+ gate accuracy + 80%+ flashcard retention',            xpBonus: 250  },
  { id: 'content-creator',     category: 'vista', emoji: '✨', name: 'Content Creator',     description: 'Write 3000+ words and score 80+ on a quality check',      xpBonus: 250  },
  { id: 'full-stack-learner',  category: 'vista', emoji: '🔗', name: 'Full-Stack Learner',  description: 'Complete any technology + score 70+ on a project review',  xpBonus: 250  },
  { id: 'the-grinder',         category: 'vista', emoji: '💪', name: 'The Grinder',         description: '200+ study hours + 3+ projects submitted',                 xpBonus: 500  },
  { id: 'all-rounder',         category: 'vista', emoji: '🌟', name: 'All-Rounder',         description: '3+ technologies + 1000 note words + 3+ projects',          xpBonus: 500  },
  { id: 'the-vista',           category: 'vista', emoji: '👁️', name: 'THE VISTA',           description: '5 techs complete + gold project + 500 flashcards + 2000 note words', xpBonus: 1000 },
];

// GET /api/achievements — list all badges with unlock status
router.get('/', auth, async (req, res) => {
  try {
    const unlocked = await Achievement.find({ userId: req.user.userId });
    const unlockedMap = new Map(unlocked.map(a => [a.badgeId, a.unlockedAt]));
    const badges = ALL_BADGES.map(b => ({
      ...b,
      unlocked: unlockedMap.has(b.id),
      unlockedAt: unlockedMap.get(b.id) || null,
    }));
    res.json(badges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/achievements/check — evaluate all conditions, award new badges
router.post('/check', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const existing = await Achievement.find({ userId });
    const existingIds = new Set(existing.map(a => a.badgeId));

    const [user, sessions, progress, flashcardProg, notes, chatHistory, snippets, projects] = await Promise.all([
      User.findById(userId),
      TypingSession.find({ userId }),
      Progress.findOne({ userId }),
      FlashcardProgress.find({ userId }),
      Note.find({ userId }),
      ChatHistory.findOne({ userId }),
      CodeSnippet.find({ userId }),
      ProjectSubmission.find({ userId }),
    ]);

    // --- Derive metrics ---
    const gateSessions       = sessions.filter(s => s.isGate && !s.wasSkipped);
    const totalFlashcards    = flashcardProg.reduce((s, fp) => s + (fp.timesReviewed || 0), 0);
    const totalNoteWords     = notes.reduce((s, n) => s + (n.wordCount || 0), 0);
    const totalHours         = (user?.totalStudySeconds || 0) / 3600;
    const tutorQuestions     = chatHistory ? chatHistory.messages.filter(m => m.role === 'user').length : 0;
    const lessonSections     = [...(progress?.lessonProgress?.values?.() || [])].filter(Boolean).length;
    const techProgress       = progress?.techProgress || new Map();
    const techsStarted       = [...techProgress.values()].filter(t => t.status !== 'not-started').length;
    const techsComplete      = [...techProgress.values()].filter(t => t.status === 'complete').length;
    const snippetLanguages   = new Set(snippets.map(s => s.language).filter(Boolean));
    const bestGateAccuracy   = gateSessions.length ? Math.max(...gateSessions.map(s => s.accuracy || 0)) : 0;
    const totalReviewed      = flashcardProg.reduce((s, fp) => s + (fp.timesReviewed || 0), 0);
    const totalCorrect       = flashcardProg.reduce((s, fp) => s + (fp.timesCorrect || 0), 0);
    const flashcardRetention = totalReviewed > 0 ? totalCorrect / totalReviewed : 0;
    const streak             = user?.streak?.count || 0;
    const bestStreak         = Math.max(streak, user?.streak?.bestEver || 0);

    const checks = {
      // Learner
      'first-lesson':      lessonSections >= 1,
      'lesson-veteran':    lessonSections >= 25,
      'tech-explorer':     techsStarted >= 3,
      'deep-diver':        techsComplete >= 1,
      'roadmap-half':      techsComplete >= 5,
      'flashcard-rookie':  totalFlashcards >= 50,
      'flashcard-master':  totalFlashcards >= 500,
      'note-taker':        totalNoteWords >= 500,
      'note-author':       notes.some(n => (n.qualityScore || 0) >= 70),
      'deep-notes':        totalNoteWords >= 2000,
      'scholar':           totalHours >= 100,
      'century-club':      techsComplete >= 10,

      // Builder
      'first-submission':  projects.length >= 1,
      'project-bronze':    projects.some(p => !p.reviewFailed && (p.score || 0) >= 50),
      'project-silver':    projects.some(p => !p.reviewFailed && (p.score || 0) >= 70),
      'project-gold':      projects.some(p => !p.reviewFailed && (p.score || 0) >= 85),
      'multi-builder':     projects.length >= 3,
      'code-curious':      snippets.length >= 5,
      'polyglot':          snippetLanguages.size >= 5,
      'snippet-saver':     snippets.length >= 10,

      // Grind
      'gate-first':        gateSessions.length >= 1,
      'gate-keeper':       gateSessions.length >= 30,
      'streak-3':          bestStreak >= 3,
      'streak-7':          bestStreak >= 7,
      'streak-30':         bestStreak >= 30,
      'early-bird':        gateSessions.some(s => new Date(s.createdAt).getHours() < 7),
      'night-owl':         gateSessions.some(s => new Date(s.createdAt).getHours() >= 23),
      'time-lord':         totalHours >= 200,

      // Explorer
      'first-question':    tutorQuestions >= 1,
      'curious-mind':      tutorQuestions >= 50,
      'knowledge-seeker':  tutorQuestions >= 200,

      // VISTA Elite
      'vista-initiate':     lessonSections >= 1 && projects.length >= 1,
      'precision-learner':  bestGateAccuracy >= 95 && flashcardRetention >= 0.8 && totalReviewed >= 10,
      'content-creator':    totalNoteWords >= 3000 && notes.some(n => (n.qualityScore || 0) >= 80),
      'full-stack-learner': techsComplete >= 1 && projects.some(p => !p.reviewFailed && (p.score || 0) >= 70),
      'the-grinder':        totalHours >= 200 && projects.length >= 3,
      'all-rounder':        techsStarted >= 3 && totalNoteWords >= 1000 && projects.length >= 3,
      'the-vista':          techsComplete >= 5 && projects.some(p => !p.reviewFailed && (p.score || 0) >= 85) && totalFlashcards >= 500 && totalNoteWords >= 2000,
    };

    const newBadgeIds = [];
    let xpGained = 0;
    for (const [badgeId, condition] of Object.entries(checks)) {
      if (condition && !existingIds.has(badgeId)) {
        await Achievement.create({ userId, badgeId });
        newBadgeIds.push(badgeId);
        const badge = ALL_BADGES.find(b => b.id === badgeId);
        if (badge?.xpBonus) xpGained += badge.xpBonus;
      }
    }

    if (xpGained > 0 && user) {
      user.xp = (user.xp || 0) + xpGained;
      await user.save();
    }

    const allUnlocked = await Achievement.find({ userId });
    const unlockedMap = new Map(allUnlocked.map(a => [a.badgeId, a.unlockedAt]));
    const allBadges = ALL_BADGES.map(b => ({
      ...b,
      unlocked: unlockedMap.has(b.id),
      unlockedAt: unlockedMap.get(b.id) || null,
    }));

    res.json({ newBadges: newBadgeIds, allBadges });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
