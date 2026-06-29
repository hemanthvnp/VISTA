const router = require('express').Router();
const Progress = require('../models/Progress');
const User = require('../models/User');
const auth = require('../middleware/auth');

const XP_THRESHOLDS = [0, 500, 1500, 3500, 7000, 12000, 20000, 35000];
const RANKS = [
  'Dormant NPC', 'Script Initialised', 'Pattern Recognition',
  'Behavioural Clone', 'Adaptive Fighter', 'Threat Level: Elevated',
  'Federated Intelligence', 'THE FINAL BOSS'
];

function getLevelFromXP(xp) {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

router.get('/', auth, async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user.userId });
    if (!progress) {
      progress = await Progress.create({ userId: req.user.userId });
    }
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user.userId });
    if (!progress) {
      progress = new Progress({ userId: req.user.userId });
    }

    if (req.body.lessonProgress) {
      for (const [k, v] of Object.entries(req.body.lessonProgress)) progress.lessonProgress.set(k, v);
    }
    if (req.body.levelProgress) {
      for (const [k, v] of Object.entries(req.body.levelProgress)) progress.levelProgress.set(k, v);
    }
    if (req.body.personalBests) {
      for (const [k, v] of Object.entries(req.body.personalBests)) progress.personalBests.set(k, v);
    }

    if (req.body.techProgress) {
      for (const [k, v] of Object.entries(req.body.techProgress)) {
        const existing = progress.techProgress.get(k);
        if (existing) existing.set(v);
        else progress.techProgress.set(k, v);
      }
    }

    if (req.body.projectProgress) {
      for (const [k, v] of Object.entries(req.body.projectProgress)) {
        const existing = progress.projectProgress.get(k);
        if (existing) {
          if (v.status) existing.status = v.status;
          if (v.checklistItems) {
            for (const [ck, cv] of Object.entries(v.checklistItems)) {
              existing.checklistItems.set(ck, cv);
            }
          }
        } else {
          progress.projectProgress.set(k, v);
        }
      }
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/xp', auth, async (req, res) => {
  try {
    const { action, amount } = req.body;
    const user = await User.findById(req.user.userId);
    user.xp += amount;
    user.level = getLevelFromXP(user.xp);
    user.rank = RANKS[user.level - 1] || RANKS[0];
    await user.save();
    res.json({ xp: user.xp, level: user.level, rank: user.rank, action });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
