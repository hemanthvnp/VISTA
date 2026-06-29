/** @fileoverview XP calculation utilities - thresholds, ranks, level computation */

export const XP_THRESHOLDS = [0, 500, 1500, 3500, 7000, 12000, 20000, 35000];

export const RANKS = [
  'Dormant NPC',
  'Script Initialised',
  'Pattern Recognition',
  'Behavioural Clone',
  'Adaptive Fighter',
  'Threat Level: Elevated',
  'Federated Intelligence',
  'THE FINAL BOSS',
];

export const RANK_EMOJIS = ['🤖', '🔵', '🟢', '🟡', '🟠', '🔴', '⚡', '👾'];

/** Get level (1-8) from XP total */
export const getLevelFromXP = (xp) => {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) return i + 1;
  }
  return 1;
};

/** Get rank string from XP */
export const getRankFromXP = (xp) => RANKS[getLevelFromXP(xp) - 1];

/** Get XP progress toward next level */
export const getXPForNextLevel = (xp) => {
  const level = getLevelFromXP(xp);
  const currentThreshold = XP_THRESHOLDS[level - 1];
  const nextThreshold = level < 8 ? XP_THRESHOLDS[level] : XP_THRESHOLDS[7];
  const progress = level >= 8 ? 1 : (xp - currentThreshold) / (nextThreshold - currentThreshold);
  return {
    current: xp - currentThreshold,
    needed: nextThreshold - currentThreshold,
    progress: Math.min(1, Math.max(0, progress)),
    level,
    nextLevel: Math.min(8, level + 1),
  };
};

/** All XP-granting events and their values */
export const XP_EVENTS = {
  gate_complete: 50,
  gate_skip: 0,
  voluntary_session: 20,
  pass_lesson: 75,
  unlock_level: 200,
  ai_bonus_drill: 30,
  personal_best_wpm: 100,
  run_ml_analysis: 25,
  wpm_milestone: 500,
  streak_7_day: 300,
  streak_30_day: 1000,
  complete_schedule_week: 100,
  flashcard_got_it: 5,
  mini_project_subtask: 50,
  full_mini_project: 500,
  full_technology: 1000,
  notes_200_words: 15,
  run_code: 3,
  ask_tutor: 2,
  codec_cross_badge: 250,
  first_login_daily: 10,
};
