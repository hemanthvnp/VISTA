const router = require('express').Router();
const Achievement = require('../models/Achievement');
const TypingSession = require('../models/TypingSession');
const Progress = require('../models/Progress');
const User = require('../models/User');
const FlashcardProgress = require('../models/FlashcardProgress');
const ScheduleWeek = require('../models/ScheduleWeek');
const Note = require('../models/Note');
const MlAnalysis = require('../models/MlAnalysis');
const ChatHistory = require('../models/ChatHistory');
const CodeSnippet = require('../models/CodeSnippet');
const auth = require('../middleware/auth');

const ALL_BADGES = [
  // Typing (15)
  { id: 'first-keystrokes', name: 'First Keystrokes', category: 'typing', description: 'Complete your first gate session' },
  { id: 'home-row-hero', name: 'Home Row Hero', category: 'typing', description: 'Pass Level 1 with 90%+ accuracy' },
  { id: 'full-alphabet', name: 'Full Alphabet', category: 'typing', description: 'Pass Level 5' },
  { id: 'symbol-master', name: 'Symbol Master', category: 'typing', description: 'Pass Level 7' },
  { id: 'code-typist', name: 'Code Typist', category: 'typing', description: 'Pass Level 8 at 50+ WPM' },
  { id: 'speed-30', name: 'Speed 30', category: 'typing', description: 'Reach 30 WPM' },
  { id: 'speed-50', name: 'Speed 50', category: 'typing', description: 'Reach 50 WPM' },
  { id: 'speed-70', name: 'Speed 70', category: 'typing', description: 'Reach 70 WPM' },
  { id: 'speed-100', name: 'Speed 100', category: 'typing', description: 'Reach 100 WPM' },
  { id: 'consistent', name: 'Consistent', category: 'typing', description: '7 sessions in a row with 90%+ accuracy' },
  { id: 'data-scientist', name: 'Data Scientist', category: 'typing', description: 'Run ML model 10 times' },
  { id: 'gate-keeper', name: 'Gate Keeper', category: 'typing', description: 'Complete 30 gates without skipping' },
  { id: 'marathon-typist', name: 'Marathon Typist', category: 'typing', description: '50 total typing sessions' },
  { id: 'night-owl', name: 'Night Owl', category: 'typing', description: 'Complete a gate after 11 PM' },
  { id: 'early-bird', name: 'Early Bird', category: 'typing', description: 'Complete a gate before 7 AM' },
  // Learning (15)
  { id: 'first-lesson', name: 'First Lesson', category: 'learning', description: 'Complete Week 1' },
  { id: 'tech-explorer', name: 'Tech Explorer', category: 'learning', description: 'Start 3 different technologies' },
  { id: 'deep-diver', name: 'Deep Diver', category: 'learning', description: 'Complete any single technology 100%' },
  { id: 'flashcard-rookie', name: 'Flashcard Rookie', category: 'learning', description: 'Review 50 flashcards' },
  { id: 'flashcard-master', name: 'Flashcard Master', category: 'learning', description: 'Review 500 flashcards' },
  { id: 'code-runner', name: 'Code Runner', category: 'learning', description: 'Run code 25 times in Code Playground' },
  { id: 'note-taker', name: 'Note Taker', category: 'learning', description: 'Write 1,000+ words across all notes' },
  { id: 'project-starter', name: 'Project Starter', category: 'learning', description: 'Start your first mini project' },
  { id: 'project-finisher', name: 'Project Finisher', category: 'learning', description: 'Complete your first mini project' },
  { id: 'halfway-there', name: 'Halfway There', category: 'learning', description: 'Complete 5 mini projects' },
  { id: 'builder', name: 'Builder', category: 'learning', description: 'Complete all 10 mini projects' },
  { id: 'curious-mind', name: 'Curious Mind', category: 'learning', description: 'Ask AI Tutor 50 questions' },
  { id: 'scholar', name: 'Scholar', category: 'learning', description: 'Study for 100+ total hours' },
  { id: 'roadmap-50', name: 'Roadmap 50%', category: 'learning', description: 'Complete 5 of 10 technologies' },
  { id: 'the-long-game', name: 'The Long Game', category: 'learning', description: 'Complete all 10 technologies' },
  // V Cross-System (10)
  { id: 'dual-threat', name: 'Dual Threat', category: 'codec', description: '7 gates no skip + 7 weeks completed', emoji: '🔥', xpBonus: 250 },
  { id: 'codec-initiate', name: 'V Initiate', category: 'codec', description: '30+ WPM + first project complete', emoji: '⚡', xpBonus: 250 },
  { id: 'precision-coder', name: 'Precision Coder', category: 'codec', description: '95%+ accuracy + 90% flashcard', emoji: '🎯', xpBonus: 250 },
  { id: 'mind-and-fingers', name: 'Mind & Fingers', category: 'codec', description: 'Level 5 + Python complete', emoji: '🧠', xpBonus: 250 },
  { id: 'developer-dna', name: 'Developer DNA', category: 'codec', description: '50+ WPM + 3 projects', emoji: '💻', xpBonus: 250 },
  { id: 'npc-awakened', name: 'NPC Awakened', category: 'codec', description: 'All 8 levels + 5 techs', emoji: '🤖', xpBonus: 250 },
  { id: 'machine-learning-badge', name: 'Machine Learning', category: 'codec', description: 'ML 20x + PyTorch complete', emoji: '⚙️', xpBonus: 250 },
  { id: 'grinder', name: 'Grinder', category: 'codec', description: '100 sessions + 200 hours', emoji: '🏋️', xpBonus: 250 },
  { id: 'all-rounder', name: 'All-Rounder', category: 'codec', description: '70+ WPM + all 10 techs started', emoji: '🌟', xpBonus: 250 },
  { id: 'the-codec', name: 'THE V', category: 'codec', description: '80+ WPM + all levels + all techs + all projects', emoji: '👾', xpBonus: 250 },
];

router.get('/', auth, async (req, res) => {
  try {
    const unlocked = await Achievement.find({ userId: req.user.userId });
    const unlockedIds = unlocked.map(a => a.badgeId);
    const badges = ALL_BADGES.map(b => ({
      ...b,
      unlocked: unlockedIds.includes(b.id),
      unlockedAt: unlocked.find(a => a.badgeId === b.id)?.unlockedAt || null,
    }));
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/check', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const existing = await Achievement.find({ userId });
    const existingIds = new Set(existing.map(a => a.badgeId));

    const [user, sessions, progress, flashcardProg, scheduleWeeks, notes, mlAnalyses, chatHistory, snippets] = await Promise.all([
      User.findById(userId),
      TypingSession.find({ userId }),
      Progress.findOne({ userId }),
      FlashcardProgress.find({ userId }),
      ScheduleWeek.find({ userId }),
      Note.find({ userId }),
      MlAnalysis.find({ userId }),
      ChatHistory.findOne({ userId }),
      CodeSnippet.find({ userId }),
    ]);

    const gateSessions = sessions.filter(s => s.isGate && !s.wasSkipped);
    const allSessions = sessions.filter(s => !s.wasSkipped);
    const bestWpm = allSessions.length > 0 ? Math.max(...allSessions.map(s => s.wpm || 0)) : 0;
    const totalReviewed = flashcardProg.reduce((sum, fp) => sum + fp.timesReviewed, 0);
    const completedWeeks = scheduleWeeks.filter(w => w.completed).length;
    const totalWords = notes.reduce((sum, n) => sum + (n.wordCount || 0), 0);
    const totalHours = (user.totalStudySeconds || 0) / 3600;
    const tutorQuestions = chatHistory ? chatHistory.messages.filter(m => m.role === 'user').length : 0;

    const techProgress = progress?.techProgress || new Map();
    const techsStarted = [...techProgress.values()].filter(t => t.status !== 'not-started').length;
    const techsComplete = [...techProgress.values()].filter(t => t.status === 'complete').length;
    const anyTechComplete = techsComplete > 0;

    const projectProgress = progress?.projectProgress || new Map();
    const projectsStarted = [...projectProgress.values()].filter(p => p.status !== 'not-started').length;
    const projectsComplete = [...projectProgress.values()].filter(p => p.status === 'complete').length;

    const levelProgress = progress?.levelProgress || new Map();
    const levelsComplete = [...levelProgress.entries()].filter(([_, v]) => v).length;

    const checks = {
      'first-keystrokes': gateSessions.length > 0,
      'home-row-hero': levelProgress.get('L1') && allSessions.some(s => s.lessonId?.startsWith('L1') && s.accuracy >= 90),
      'full-alphabet': !!levelProgress.get('L5'),
      'symbol-master': !!levelProgress.get('L7'),
      'code-typist': levelProgress.get('L8') && bestWpm >= 50,
      'speed-30': bestWpm >= 30,
      'speed-50': bestWpm >= 50,
      'speed-70': bestWpm >= 70,
      'speed-100': bestWpm >= 100,
      'consistent': (() => {
        const recent = allSessions.slice(0, 7);
        return recent.length >= 7 && recent.every(s => s.accuracy >= 90);
      })(),
      'data-scientist': mlAnalyses.length >= 10,
      'gate-keeper': gateSessions.length >= 30,
      'marathon-typist': allSessions.length >= 50,
      'night-owl': gateSessions.some(s => {
        const hour = new Date(s.createdAt).getHours();
        return hour >= 23;
      }),
      'early-bird': gateSessions.some(s => {
        const hour = new Date(s.createdAt).getHours();
        return hour < 7;
      }),
      'first-lesson': completedWeeks > 0,
      'tech-explorer': techsStarted >= 3,
      'deep-diver': anyTechComplete,
      'flashcard-rookie': totalReviewed >= 50,
      'flashcard-master': totalReviewed >= 500,
      'code-runner': snippets.length >= 25,
      'note-taker': totalWords >= 1000,
      'project-starter': projectsStarted > 0,
      'project-finisher': projectsComplete > 0,
      'halfway-there': projectsComplete >= 5,
      'builder': projectsComplete >= 10,
      'curious-mind': tutorQuestions >= 50,
      'scholar': totalHours >= 100,
      'roadmap-50': techsComplete >= 5,
      'the-long-game': techsComplete >= 10,
      'dual-threat': gateSessions.length >= 7 && completedWeeks >= 7,
      'codec-initiate': bestWpm >= 30 && projectsComplete >= 1,
      'precision-coder': allSessions.some(s => s.accuracy >= 95) && flashcardProg.some(fp => fp.timesReviewed > 0 && (fp.timesCorrect / fp.timesReviewed) >= 0.9),
      'mind-and-fingers': !!levelProgress.get('L5') && techProgress.get('python')?.status === 'complete',
      'developer-dna': bestWpm >= 50 && projectsComplete >= 3,
      'npc-awakened': levelsComplete >= 8 && techsComplete >= 5,
      'machine-learning-badge': mlAnalyses.length >= 20 && techProgress.get('pytorch')?.status === 'complete',
      'grinder': allSessions.length >= 100 && totalHours >= 200,
      'all-rounder': bestWpm >= 70 && techsStarted >= 10,
      'the-codec': bestWpm >= 80 && levelsComplete >= 8 && techsComplete >= 10 && projectsComplete >= 10,
    };

    const newBadges = [];
    for (const [badgeId, condition] of Object.entries(checks)) {
      if (condition && !existingIds.has(badgeId)) {
        await Achievement.create({ userId, badgeId });
        newBadges.push(badgeId);
        const badge = ALL_BADGES.find(b => b.id === badgeId);
        if (badge?.xpBonus) {
          user.xp += badge.xpBonus;
        }
      }
    }

    if (newBadges.length > 0) {
      await user.save();
    }

    const allBadges = ALL_BADGES.map(b => ({
      ...b,
      unlocked: existingIds.has(b.id) || newBadges.includes(b.id),
    }));

    res.json({ newBadges, allBadges });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
