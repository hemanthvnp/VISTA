/** @fileoverview Prompt template for sending ML analysis to Gemini for typing coaching */

export const buildTypingPrompt = (report, userState) => {
  return `You are a typing coach analyzing an ML-generated report for a student using V.

## ML Analysis Report
${JSON.stringify(report, null, 2)}

## Student Profile
- Current WPM: ${userState.wpm || 0}
- Level: ${userState.level || 1}
- Rank: ${userState.rank || 'Dormant NPC'}
- Goal: 70+ WPM with 90%+ accuracy

## Instructions
Based on this analysis, provide:
1. A 2-sentence summary of their typing profile
2. Exactly 3 sorted improvement actions (most impactful first)
3. Exactly 3 bonus drill suggestions targeting their weakest areas
4. A 1-sentence motivational message

Return ONLY valid JSON matching this format:
{
  "summary": "...",
  "improvements": [
    {"priority": 1, "action": "...", "reason": "..."},
    {"priority": 2, "action": "...", "reason": "..."},
    {"priority": 3, "action": "...", "reason": "..."}
  ],
  "bonus_drills": [
    {"id": "drill-1", "title": "...", "description": "...", "duration_secs": 120, "target": "..."},
    {"id": "drill-2", "title": "...", "description": "...", "duration_secs": 120, "target": "..."},
    {"id": "drill-3", "title": "...", "description": "...", "duration_secs": 120, "target": "..."}
  ],
  "motivation": "..."
}`;
};

/** The 10 technology IDs and metadata used throughout VISTA */
export const TECHNOLOGIES = [
  // ── Layer 1: Foundations ───────────────────────────────────────────────────
  {
    id: 'python', name: 'Python', emoji: '🐍', layer: 1,
    description: 'Foundation programming language for CS and data',
    resources: [
      { type: 'docs',   title: 'Official Python Docs',            url: 'https://docs.python.org/3/' },
      { type: 'course', title: 'CS50P – Harvard (edX)',           url: 'https://cs50.harvard.edu/python/' },
      { type: 'course', title: 'Python for Everybody (Coursera)', url: 'https://www.coursera.org/specializations/python' },
      { type: 'book',   title: 'Automate the Boring Stuff',       url: 'https://automatetheboringstuff.com/' },
      { type: 'video',  title: 'Corey Schafer – Python Series',   url: 'https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU' },
    ],
  },
  {
    id: 'javascript', name: 'JavaScript', emoji: '🌐', layer: 1,
    description: 'The language of the web — client and server',
    resources: [
      { type: 'docs',   title: 'MDN JavaScript Reference',       url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
      { type: 'course', title: 'The Odin Project – JavaScript',  url: 'https://www.theodinproject.com/paths/full-stack-javascript' },
      { type: 'book',   title: 'Eloquent JavaScript (Free)',     url: 'https://eloquentjavascript.net/' },
      { type: 'course', title: 'javascript.info – Modern JS',    url: 'https://javascript.info/' },
      { type: 'video',  title: 'Fireship – JS in 100 Seconds',   url: 'https://www.youtube.com/watch?v=DHjqpvDnNGE' },
    ],
  },
  {
    id: 'git', name: 'Git', emoji: '📂', layer: 1,
    description: 'Version control — essential for every developer',
    resources: [
      { type: 'book',   title: 'Pro Git Book (Free)',              url: 'https://git-scm.com/book/en/v2' },
      { type: 'docs',   title: 'Official Git Reference',           url: 'https://git-scm.com/docs' },
      { type: 'course', title: 'Learn Git Branching (Interactive)', url: 'https://learngitbranching.js.org/' },
      { type: 'video',  title: 'Fireship – Git in 100 Seconds',   url: 'https://www.youtube.com/watch?v=hwP7WQkmECE' },
      { type: 'docs',   title: 'Atlassian Git Tutorials',          url: 'https://www.atlassian.com/git/tutorials' },
    ],
  },
  {
    id: 'sql', name: 'SQL', emoji: '🗄️', layer: 1,
    description: 'Query and design relational databases',
    resources: [
      { type: 'course', title: 'SQLZoo – Interactive SQL',         url: 'https://sqlzoo.net/' },
      { type: 'course', title: 'Mode SQL Tutorial',               url: 'https://mode.com/sql-tutorial/' },
      { type: 'docs',   title: 'PostgreSQL Docs',                 url: 'https://www.postgresql.org/docs/' },
      { type: 'video',  title: 'freeCodeCamp – SQL Full Course',  url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
      { type: 'course', title: 'CS50 SQL – Harvard',              url: 'https://cs50.harvard.edu/sql/' },
    ],
  },
  {
    id: 'cpp', name: 'C++', emoji: '⚙️', layer: 1,
    description: 'Systems programming, performance, and low-level control',
    resources: [
      { type: 'docs',  title: 'cppreference.com',             url: 'https://en.cppreference.com/' },
      { type: 'docs',  title: 'LearnCpp.com',                 url: 'https://www.learncpp.com/' },
      { type: 'video', title: 'The Cherno – C++ Series',      url: 'https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb' },
      { type: 'video', title: 'CppCon Talks',                 url: 'https://www.youtube.com/@CppCon' },
      { type: 'book',  title: 'A Tour of C++ (Stroustrup)',   url: 'https://www.stroustrup.com/Tour.html' },
    ],
  },

  // ── Layer 2: Web Stack ─────────────────────────────────────────────────────
  {
    id: 'typescript', name: 'TypeScript', emoji: '📘', layer: 2,
    description: 'Typed JavaScript for scalable applications',
    resources: [
      { type: 'docs',   title: 'TypeScript Handbook',                url: 'https://www.typescriptlang.org/docs/handbook/intro.html' },
      { type: 'course', title: 'Total TypeScript (Matt Pocock)',     url: 'https://www.totaltypescript.com/' },
      { type: 'video',  title: 'Fireship – TypeScript in 100 Sec',  url: 'https://www.youtube.com/watch?v=zQnBQ4tB3ZA' },
      { type: 'course', title: 'Execute Program – TypeScript',       url: 'https://www.executeprogram.com/courses/typescript' },
      { type: 'docs',   title: 'TypeScript Playground',             url: 'https://www.typescriptlang.org/play' },
    ],
  },
  {
    id: 'react', name: 'React', emoji: '⚛️', layer: 2,
    description: 'Component-based UI library by Meta',
    resources: [
      { type: 'docs',   title: 'React Official Docs (beta)',     url: 'https://react.dev/' },
      { type: 'course', title: 'Scrimba – Learn React',         url: 'https://scrimba.com/learn/learnreact' },
      { type: 'video',  title: 'Fireship – React in 100 Sec',  url: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM' },
      { type: 'course', title: 'The Odin Project – React',      url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/react' },
      { type: 'video',  title: 'Traversy Media – React Crash',  url: 'https://www.youtube.com/watch?v=sBws8MSXN7A' },
    ],
  },
  {
    id: 'nodejs', name: 'Node.js', emoji: '🟢', layer: 2,
    description: 'Server-side JavaScript and REST APIs',
    resources: [
      { type: 'docs',   title: 'Node.js Official Docs',              url: 'https://nodejs.org/en/docs/' },
      { type: 'docs',   title: 'Express.js Docs',                   url: 'https://expressjs.com/' },
      { type: 'course', title: 'The Odin Project – Node.js',        url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs' },
      { type: 'video',  title: 'Traversy Media – Node Crash Course', url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4' },
      { type: 'book',   title: 'Node.js Design Patterns (Packt)',   url: 'https://www.packtpub.com/product/node-js-design-patterns-third-edition/9781839214110' },
    ],
  },

  // ── Layer 3: Advanced CS ───────────────────────────────────────────────────
  {
    id: 'java', name: 'Java', emoji: '☕', layer: 3,
    description: 'OOP, enterprise development, and Android',
    resources: [
      { type: 'docs',   title: 'Oracle Java Documentation',         url: 'https://docs.oracle.com/en/java/' },
      { type: 'course', title: 'CS50AP – Harvard Java Track',       url: 'https://cs50.harvard.edu/ap/' },
      { type: 'course', title: 'Codecademy – Learn Java',           url: 'https://www.codecademy.com/learn/learn-java' },
      { type: 'video',  title: 'Amigoscode – Java for Beginners',  url: 'https://www.youtube.com/watch?v=eIrMbAQSU34' },
      { type: 'book',   title: 'Effective Java (Bloch)',            url: 'https://www.oreilly.com/library/view/effective-java/9780134686097/' },
    ],
  },
  {
    id: 'dsa', name: 'Data Structures', emoji: '🧩', layer: 3,
    description: 'Algorithms, complexity, and technical interviews',
    resources: [
      { type: 'course', title: 'NeetCode – DSA Roadmap',             url: 'https://neetcode.io/roadmap' },
      { type: 'course', title: 'CS50 – Introduction to CS (Harvard)',  url: 'https://cs50.harvard.edu/x/' },
      { type: 'book',   title: 'Grokking Algorithms (Free Preview)',  url: 'https://www.manning.com/books/grokking-algorithms' },
      { type: 'course', title: 'LeetCode – Study Plans',             url: 'https://leetcode.com/study-plan/' },
      { type: 'video',  title: 'Abdul Bari – Algorithms Playlist',   url: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O' },
    ],
  },
];

/** Typing lesson curriculum - 8 levels */
export const TYPING_LEVELS = [
  {
    id: 'L1', name: 'Home Row Basics', keys: 'asdf jkl;', wpmTarget: 15,
    lessons: [
      { id: 'L1-1', title: 'Left Home Row', text: 'asdf asdf fdsa fdsa asdf fdsa sadf fads' },
      { id: 'L1-2', title: 'Right Home Row', text: 'jkl; jkl; ;lkj ;lkj jkl; ;lkj jk;l l;kj' },
      { id: 'L1-3', title: 'Both Hands', text: 'asdf jkl; asdf jkl; fjdk slaj dkfj als;' },
      { id: 'L1-4', title: 'Home Row Words', text: 'add fall lads sad flask ask dad shall salad' },
    ],
  },
  {
    id: 'L2', name: 'Home Row Mastery', keys: 'asdfghjkl;', wpmTarget: 20,
    lessons: [
      { id: 'L2-1', title: 'Adding G and H', text: 'fgh jgh gash hash gash flash hag glad half' },
      { id: 'L2-2', title: 'Full Home Row', text: 'flash glass flags shall dash half glad salad' },
      { id: 'L2-3', title: 'Home Row Speed', text: 'all fall flags glass flash shall salad lads dash' },
      { id: 'L2-4', title: 'Spacebar Rhythm', text: 'a sad lad had a flask; a glad gal shall dash' },
    ],
  },
  {
    id: 'L3', name: 'Upper Row', keys: 'qwertyuiop', wpmTarget: 25,
    lessons: [
      { id: 'L3-1', title: 'Left Upper', text: 'qwer qwer treerew wert quest wet grew drew' },
      { id: 'L3-2', title: 'Right Upper', text: 'yuio yuio your type upon pure pour tour outer' },
      { id: 'L3-3', title: 'Full Upper Row', text: 'power quiet write route worry triple poetry tower' },
      { id: 'L3-4', title: 'Mixed Rows', text: 'the quick red fox leapt proudly with utter delight' },
      { id: 'L3-5', title: 'Upper Row Speed', text: 'property quite worthy poetry tip your quote pipe opaque pout' },
    ],
  },
  {
    id: 'L4', name: 'Lower Row', keys: 'zxcvbnm,./', wpmTarget: 30,
    lessons: [
      { id: 'L4-1', title: 'Left Lower', text: 'zxcv zxcv van cave zinc box exact vex' },
      { id: 'L4-2', title: 'Right Lower', text: 'bnm, bnm, ban man bone mine come name' },
      { id: 'L4-3', title: 'Full Lower Row', text: 'combine maximum zinc boxing movement civic' },
      { id: 'L4-4', title: 'All Three Rows', text: 'the brown fox jumped quickly over the lazy dog near a box' },
      { id: 'L4-5', title: 'Paragraph Practice', text: 'my black van moved next to the curb. zinc boxes came via the dock.' },
    ],
  },
  {
    id: 'L5', name: 'Full Alphabet', keys: 'abcdefghijklmnopqrstuvwxyz', wpmTarget: 35,
    lessons: [
      { id: 'L5-1', title: 'Common Words', text: 'the and for that with this from have they been' },
      { id: 'L5-2', title: 'Longer Words', text: 'programming developer javascript function variable' },
      { id: 'L5-3', title: 'Mixed Sentences', text: 'writing clean code requires both skill and practice every day' },
      { id: 'L5-4', title: 'Speed Building', text: 'she went through the amazing jungle discovering exotic plants and birds' },
      { id: 'L5-5', title: 'Pangrams', text: 'the quick brown fox jumps over a lazy dog by the river bank' },
    ],
  },
  {
    id: 'L6', name: 'Numbers Row', keys: '1234567890', wpmTarget: 38,
    lessons: [
      { id: 'L6-1', title: 'Left Numbers', text: '12345 12345 11 22 33 44 55 123 234 345' },
      { id: 'L6-2', title: 'Right Numbers', text: '67890 67890 66 77 88 99 00 678 789 890' },
      { id: 'L6-3', title: 'All Numbers', text: '1234567890 0987654321 13579 24680 192837465' },
      { id: 'L6-4', title: 'Numbers in Text', text: 'port 8080 has 2048 bytes with 37 connections on server 4' },
    ],
  },
  {
    id: 'L7', name: 'Symbols & Punctuation', keys: '!@#$%^&*()_+-=[]{}', wpmTarget: 40,
    lessons: [
      { id: 'L7-1', title: 'Basic Symbols', text: "hello! what's happening? it costs $50 & ships #1 priority." },
      { id: 'L7-2', title: 'Brackets & Parens', text: 'array[0] = (x + y); result = {key: "value"};' },
      { id: 'L7-3', title: 'Code Symbols', text: 'if (x === 0) { return y * -1; } // check zero' },
      { id: 'L7-4', title: 'Mixed Symbols', text: 'email@host.com; 50% off! price: $29.99 (sale) [limited]' },
      { id: 'L7-5', title: 'Symbol Speed', text: 'fn(a, b) => a + b; obj = {x: 1, y: 2}; arr = [3, 4];' },
    ],
  },
  {
    id: 'L8', name: 'Code Mode', keys: 'all', wpmTarget: 50,
    lessons: [
      { id: 'L8-1', title: 'Python Snippets', text: 'def hello(name):\n    return f"Hello, {name}!"\n\nfor i in range(10):\n    print(i)' },
      { id: 'L8-2', title: 'JavaScript Snippets', text: 'const sum = (a, b) => a + b;\nconst arr = [1, 2, 3].map(x => x * 2);\nconsole.log(arr);' },
      { id: 'L8-3', title: 'C++ Snippets', text: '#include <iostream>\nint main() {\n    std::cout << "Hello" << std::endl;\n    return 0;\n}' },
      { id: 'L8-4', title: 'Mixed Code', text: 'class Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None' },
      { id: 'L8-5', title: 'Real Functions', text: 'function fibonacci(n) {\n    if (n <= 1) return n;\n    return fibonacci(n-1) + fibonacci(n-2);\n}' },
    ],
  },
];
