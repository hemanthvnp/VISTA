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

/** The 10 technology IDs and metadata used throughout V */
export const TECHNOLOGIES = [
  {
    id: 'python', name: 'Python', emoji: '🐍', layer: 1,
    description: 'Foundation programming language',
    resources: [
      { type: 'docs', title: 'Official Python Docs', url: 'https://docs.python.org/3/' },
      { type: 'course', title: 'Python for Everybody (Coursera)', url: 'https://www.coursera.org/specializations/python' },
      { type: 'course', title: 'CS50P – Harvard (edX)', url: 'https://cs50.harvard.edu/python/' },
      { type: 'book', title: 'Automate the Boring Stuff', url: 'https://automatetheboringstuff.com/' },
      { type: 'video', title: 'Corey Schafer Python Series', url: 'https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU' },
    ],
  },
  {
    id: 'cpp', name: 'C++', emoji: '⚙️', layer: 1,
    description: 'Performance-critical game engine programming',
    resources: [
      { type: 'docs', title: 'cppreference.com', url: 'https://en.cppreference.com/' },
      { type: 'docs', title: 'LearnCpp.com', url: 'https://www.learncpp.com/' },
      { type: 'video', title: 'The Cherno C++ Series', url: 'https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb' },
      { type: 'video', title: 'CppCon Talks', url: 'https://www.youtube.com/@CppCon' },
      { type: 'book', title: 'A Tour of C++ (Stroustrup)', url: 'https://www.stroustrup.com/Tour.html' },
    ],
  },
  {
    id: 'ue5', name: 'Unreal Engine 5', emoji: '🎮', layer: 1,
    description: 'AAA game engine',
    resources: [
      { type: 'docs', title: 'Epic Official Documentation', url: 'https://dev.epicgames.com/documentation/en-us/unreal-engine/' },
      { type: 'course', title: 'Epic Online Learning (Free)', url: 'https://dev.epicgames.com/community/learning' },
      { type: 'video', title: 'Unreal Sensei – UE5 Beginner', url: 'https://www.youtube.com/@UnrealSensei' },
      { type: 'video', title: 'Tom Looman UE5 Tutorials', url: 'https://www.youtube.com/@TomLooman' },
      { type: 'course', title: 'Udemy – Unreal Engine 5 Courses', url: 'https://www.udemy.com/courses/search/?q=unreal+engine+5' },
    ],
  },
  {
    id: 'blender', name: 'Blender', emoji: '🎨', layer: 1,
    description: '3D modeling and animation',
    resources: [
      { type: 'docs', title: 'Blender Official Manual', url: 'https://docs.blender.org/manual/en/latest/' },
      { type: 'video', title: 'Blender Guru – Donut Series', url: 'https://www.youtube.com/playlist?list=PLjEaoINr3zgEPv5y--4MKpciLaoQYZB1Z' },
      { type: 'video', title: 'Grant Abbitt – Beginner Series', url: 'https://www.youtube.com/@grabbitt' },
      { type: 'course', title: 'CG Cookie (Structured Courses)', url: 'https://cgcookie.com/courses' },
      { type: 'video', title: 'Stylized Station (Game Art)', url: 'https://www.youtube.com/@StylizedStation' },
    ],
  },
  {
    id: 'git', name: 'Git', emoji: '📂', layer: 1,
    description: 'Version control',
    resources: [
      { type: 'book', title: 'Pro Git Book (Free)', url: 'https://git-scm.com/book/en/v2' },
      { type: 'docs', title: 'Official Git Reference', url: 'https://git-scm.com/docs' },
      { type: 'course', title: 'Learn Git Branching (Interactive)', url: 'https://learngitbranching.js.org/' },
      { type: 'video', title: 'Fireship – Git in 100 Seconds', url: 'https://www.youtube.com/watch?v=hwP7WQkmECE' },
      { type: 'video', title: 'Atlassian Git Tutorials', url: 'https://www.atlassian.com/git/tutorials' },
    ],
  },
  {
    id: 'pytorch', name: 'PyTorch', emoji: '🔥', layer: 2,
    description: 'Deep learning framework',
    resources: [
      { type: 'docs', title: 'PyTorch Official Docs', url: 'https://pytorch.org/docs/stable/index.html' },
      { type: 'course', title: 'fast.ai – Practical Deep Learning', url: 'https://course.fast.ai/' },
      { type: 'video', title: 'Andrej Karpathy – Neural Networks', url: 'https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ' },
      { type: 'book', title: 'Deep Learning with PyTorch (Manning)', url: 'https://www.manning.com/books/deep-learning-with-pytorch' },
      { type: 'course', title: 'PyTorch Zero to Mastery (Udemy)', url: 'https://www.udemy.com/course/pytorch-for-deep-learning/' },
    ],
  },
  {
    id: 'rl-ppo', name: 'RL / PPO', emoji: '🤖', layer: 2,
    description: 'Reinforcement learning algorithms',
    resources: [
      { type: 'docs', title: 'OpenAI Spinning Up in RL', url: 'https://spinningup.openai.com/' },
      { type: 'book', title: 'Sutton & Barto – RL Book (Free PDF)', url: 'http://incompleteideas.net/book/the-book-2nd.html' },
      { type: 'course', title: 'Hugging Face RL Course', url: 'https://huggingface.co/learn/deep-rl-course/' },
      { type: 'docs', title: 'CleanRL – Clean PPO Implementations', url: 'https://github.com/vwxyzjn/cleanrl' },
      { type: 'video', title: 'Yannic Kilcher – PPO Explained', url: 'https://www.youtube.com/watch?v=MEt6rrxH8W4' },
    ],
  },
  {
    id: 'zeromq', name: 'ZeroMQ', emoji: '📡', layer: 2,
    description: 'Distributed messaging',
    resources: [
      { type: 'book', title: 'ZeroMQ Guide (Free Online)', url: 'https://zguide.zeromq.org/' },
      { type: 'docs', title: 'ZeroMQ Official Docs', url: 'https://zeromq.org/documentation/' },
      { type: 'video', title: 'ZeroMQ in 90 Seconds', url: 'https://www.youtube.com/watch?v=UrwtQfSbrOs' },
      { type: 'docs', title: 'pyzmq Docs (Python bindings)', url: 'https://pyzmq.readthedocs.io/' },
    ],
  },
  {
    id: 'fastapi', name: 'FastAPI', emoji: '🚀', layer: 3,
    description: 'Modern Python API framework',
    resources: [
      { type: 'docs', title: 'FastAPI Official Docs', url: 'https://fastapi.tiangolo.com/' },
      { type: 'video', title: 'FastAPI Full Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=0sOvCWFmrtA' },
      { type: 'course', title: 'TestDriven.io – FastAPI TDD', url: 'https://testdriven.io/courses/tdd-fastapi/' },
      { type: 'video', title: 'Amigoscode FastAPI Tutorial', url: 'https://www.youtube.com/watch?v=iWS9ogMPOI0' },
      { type: 'docs', title: 'Pydantic v2 Docs', url: 'https://docs.pydantic.dev/' },
    ],
  },
  {
    id: 'federated-learning', name: 'Federated Learning', emoji: '🌐', layer: 3,
    description: 'Privacy-preserving distributed ML',
    resources: [
      { type: 'docs', title: 'Flower Framework Docs', url: 'https://flower.ai/docs/' },
      { type: 'docs', title: 'PySyft (OpenMined)', url: 'https://github.com/OpenMined/PySyft' },
      { type: 'book', title: 'Federated Learning (Google AI Blog)', url: 'https://ai.googleblog.com/2017/04/federated-learning-collaborative.html' },
      { type: 'course', title: 'FedML – Federated Learning Library', url: 'https://fedml.ai/' },
      { type: 'video', title: 'Federated Learning Explained – Computerphile', url: 'https://www.youtube.com/watch?v=X8YYWunttOY' },
    ],
  },
];

/** Mini projects - one per technology */
export const MINI_PROJECTS = [
  { techId: 'python', name: 'CLI Task Manager', description: 'Build a command-line task manager with file persistence', subtasks: ['Parse CLI arguments', 'Implement add/remove/list commands', 'Save tasks to JSON file', 'Add due date filtering'] },
  { techId: 'cpp', name: 'Memory Pool Allocator', description: 'Implement a simple memory pool for fixed-size allocations', subtasks: ['Design pool data structure', 'Implement allocate/deallocate', 'Add pool statistics tracking', 'Write unit tests', 'Benchmark vs new/delete'] },
  { techId: 'ue5', name: 'Third Person Character', description: 'Create a third-person character with basic movement', subtasks: ['Set up ACharacter class', 'Configure Enhanced Input', 'Add camera arm and movement', 'Implement jump and sprint', 'Add basic animations'] },
  { techId: 'blender', name: 'Low-Poly Character', description: 'Model and rig a simple low-poly game character', subtasks: ['Block out body shape', 'Add details and UV unwrap', 'Create armature and rig', 'Weight paint all parts', 'Export as FBX'] },
  { techId: 'git', name: 'Collaborative Workflow', description: 'Practice a full git workflow with branches and merges', subtasks: ['Create feature branches', 'Simulate and resolve merge conflicts', 'Practice interactive rebase'] },
  { techId: 'pytorch', name: 'MNIST Classifier', description: 'Build a CNN that classifies handwritten digits', subtasks: ['Load and explore MNIST dataset', 'Build CNN architecture', 'Train with Adam optimizer', 'Evaluate accuracy on test set', 'Save trained model'] },
  { techId: 'rl-ppo', name: 'CartPole Agent', description: 'Train a PPO agent to balance a CartPole', subtasks: ['Set up Gym environment', 'Implement actor-critic network', 'Code PPO training loop', 'Train to 500 reward', 'Plot learning curves'] },
  { techId: 'zeromq', name: 'Chat System', description: 'Build a multi-client chat using PUB-SUB pattern', subtasks: ['Set up PUB-SUB sockets', 'Implement message broadcasting', 'Add JSON message format', 'Handle disconnections'] },
  { techId: 'fastapi', name: 'REST API', description: 'Build a CRUD API for a notes application', subtasks: ['Define Pydantic models', 'Implement CRUD endpoints', 'Add input validation', 'Add authentication middleware', 'Write API documentation'] },
  { techId: 'federated-learning', name: 'FedAvg Simulation', description: 'Simulate federated averaging across virtual clients', subtasks: ['Create synthetic non-IID datasets', 'Implement local training', 'Code FedAvg aggregation', 'Track convergence metrics', 'Compare IID vs non-IID'] },
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
