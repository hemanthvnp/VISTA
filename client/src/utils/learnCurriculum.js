/** @fileoverview Combined learn curriculum — all 10 technologies */
export { TOPIC_COLOR_CLASSES } from './pythonCurriculum';
export { PYTHON_LEARN, CPP_LEARN, GIT_LEARN } from './learnCurriculum_1';
export { JS_LEARN, TS_LEARN, REACT_LEARN, NODEJS_LEARN, SQL_LEARN, JAVA_LEARN, DSA_LEARN } from './learnCurriculum_5';

import { PYTHON_LEARN, CPP_LEARN, GIT_LEARN } from './learnCurriculum_1';
import { JS_LEARN, TS_LEARN, REACT_LEARN, NODEJS_LEARN, SQL_LEARN, JAVA_LEARN, DSA_LEARN } from './learnCurriculum_5';

/** Ordered list of all tech curricula */
export const ALL_TECHS = [
    { id: 'python',     ...PYTHON_LEARN  },
    { id: 'javascript', ...JS_LEARN      },
    { id: 'git',        ...GIT_LEARN     },
    { id: 'sql',        ...SQL_LEARN     },
    { id: 'cpp',        ...CPP_LEARN     },
    { id: 'typescript', ...TS_LEARN      },
    { id: 'react',      ...REACT_LEARN   },
    { id: 'nodejs',     ...NODEJS_LEARN  },
    { id: 'java',       ...JAVA_LEARN    },
    { id: 'dsa',        ...DSA_LEARN     },
];

/** Quick lookup by tech ID */
export const TECH_BY_ID = Object.fromEntries(ALL_TECHS.map(t => [t.id, t]));

/** Layer tag colors */
export const LAYER_COLORS = {
    Foundation: 'text-brutal-mint border-2 border-brutal-black',
    Advanced: 'text-brutal-purple border-2 border-brutal-black',
    Expert: 'text-brutal-yellow border-2 border-brutal-black',
};
