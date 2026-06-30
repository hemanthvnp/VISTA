const router = require('express').Router();
const auth = require('../middleware/auth');
const ProjectSubmission = require('../models/ProjectSubmission');
const User = require('../models/User');
const GithubValidationService = require('../services/GithubValidationService');
const ProjectReviewService = require('../services/ProjectReviewService');

const XP_THRESHOLDS = [0, 500, 1500, 3500, 7000, 12000, 20000, 35000];
const RANKS = [
  'Dormant NPC', 'Script Initialised', 'Pattern Recognition',
  'Behavioural Clone', 'Adaptive Fighter', 'Threat Level: Elevated',
  'Federated Intelligence', 'THE FINAL BOSS',
];

function getLevelFromXP(xp) {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

// Score tier -> XP. Tier rank increases with score; only a higher tier than
// previously achieved awards the difference (see project-submissions spec).
function getXpTier(score) {
  if (score >= 85) return { tier: 4, xp: 750 };
  if (score >= 70) return { tier: 3, xp: 500 };
  if (score >= 50) return { tier: 2, xp: 250 };
  return { tier: 1, xp: 100 };
}

router.post('/submit', auth, async (req, res) => {
  try {
    const { submissionId, title, repoUrl, githubUsername, demoUrl, notes } = req.body;

    if (!title || !repoUrl || !githubUsername) {
      const field = !title ? 'title' : !repoUrl ? 'repoUrl' : 'githubUsername';
      return res.status(422).json({ type: 'validation', field, message: 'This field is required.' });
    }

    let existing = null;
    if (submissionId) {
      existing = await ProjectSubmission.findOne({ _id: submissionId, userId: req.user.userId });
      if (!existing) return res.status(404).json({ message: 'Project not found.' });
    }

    const validation = await GithubValidationService.validate(repoUrl, githubUsername);
    if (!validation.ok) {
      const status = validation.type === 'github_api' ? 503 : 422;
      return res.status(status).json(validation);
    }

    const reviewResult = await ProjectReviewService.review(validation.owner, validation.repo, validation.defaultBranch);

    let bestScoreTier = existing?.bestScoreTier || 0;
    let xpAwarded = existing?.xpAwarded || 0;
    let xpAwardedThisSubmission = 0;

    if (!reviewResult.reviewFailed) {
      const { tier, xp } = getXpTier(reviewResult.score);
      if (tier > bestScoreTier) {
        xpAwardedThisSubmission = xp - xpAwarded;
        bestScoreTier = tier;
        xpAwarded = xp;
      }
    }

    const fields = {
      title,
      repoUrl,
      githubUsername,
      demoUrl: demoUrl || '',
      notes: notes || '',
      score: reviewResult.score,
      description: reviewResult.description,
      strengths: reviewResult.strengths,
      keyMistakes: reviewResult.keyMistakes,
      professionalismFeedback: reviewResult.professionalismFeedback,
      reviewFailed: reviewResult.reviewFailed,
      bestScoreTier,
      xpAwarded,
      validatedAt: new Date(),
      updatedAt: new Date(),
    };
    if (!reviewResult.reviewFailed) fields.reviewedAt = new Date();

    let submission;
    if (existing) {
      existing.set({ ...fields, attemptCount: existing.attemptCount + 1 });
      submission = await existing.save();
    } else {
      submission = await ProjectSubmission.create({ userId: req.user.userId, ...fields, attemptCount: 1 });
    }

    let xpResult = null;
    if (xpAwardedThisSubmission > 0) {
      const user = await User.findById(req.user.userId);
      user.xp += xpAwardedThisSubmission;
      user.level = getLevelFromXP(user.xp);
      user.rank = RANKS[user.level - 1] || RANKS[0];
      await user.save();
      xpResult = { xp: user.xp, level: user.level, rank: user.rank };
    }

    res.json({ submission, xpAwarded: xpAwardedThisSubmission, xpResult });
  } catch (error) {
    console.error('Project submission error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/submissions', auth, async (req, res) => {
  try {
    const submissions = await ProjectSubmission.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await ProjectSubmission.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!deleted) return res.status(404).json({ message: 'Project not found.' });
    res.json({ message: 'Project removed.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
