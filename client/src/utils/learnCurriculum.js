/** @fileoverview Combined learn curriculum — all 10 technologies */
export { TOPIC_COLOR_CLASSES } from './pythonCurriculum';
export { PYTHON_LEARN, CPP_LEARN, GIT_LEARN } from './learnCurriculum_1';
export { UE5_LEARN, BLENDER_LEARN, PYTORCH_LEARN } from './learnCurriculum_2';
export { RL_LEARN, ZEROMQ_LEARN } from './learnCurriculum_3';
export { FASTAPI_LEARN, FL_LEARN } from './learnCurriculum_4';

import { PYTHON_LEARN, CPP_LEARN, GIT_LEARN } from './learnCurriculum_1';
import { UE5_LEARN, BLENDER_LEARN, PYTORCH_LEARN } from './learnCurriculum_2';
import { RL_LEARN, ZEROMQ_LEARN } from './learnCurriculum_3';
import { FASTAPI_LEARN, FL_LEARN } from './learnCurriculum_4';

/** Ordered list of all tech curricula */
export const ALL_TECHS = [
    { id: 'python', ...PYTHON_LEARN },
    { id: 'cpp', ...CPP_LEARN },
    { id: 'ue5', ...UE5_LEARN },
    { id: 'blender', ...BLENDER_LEARN },
    { id: 'git', ...GIT_LEARN },
    { id: 'pytorch', ...PYTORCH_LEARN },
    { id: 'rl-ppo', ...RL_LEARN },
    { id: 'zeromq', ...ZEROMQ_LEARN },
    { id: 'fastapi', ...FASTAPI_LEARN },
    { id: 'federated-learning', ...FL_LEARN },
];

/** Quick lookup by tech ID */
export const TECH_BY_ID = Object.fromEntries(ALL_TECHS.map(t => [t.id, t]));

/** Layer tag colors */
export const LAYER_COLORS = {
    Foundation: 'text-brutal-mint border-2 border-brutal-black',
    Advanced: 'text-brutal-purple border-2 border-brutal-black',
    Expert: 'text-brutal-yellow border-2 border-brutal-black',
};
