/** @fileoverview Learn curriculum — Python topics (reused from pythonCurriculum) */
import { PYTHON_TOPICS } from './pythonCurriculum';

/** C++ curriculum — 6 topics */
export const CPP_TOPICS = [
    {
        id: 'variables', title: 'Variables & Types', icon: '📦', color: 'cyan', xp: 75,
        description: 'Primitive types, type modifiers, and the type system in C++.',
        sections: [
            {
                type: 'theory', title: 'C++ Type System', content: `C++ is **statically typed** — every variable must have a declared type at compile time.

## Primitive Types
\`\`\`cpp
int    x = 42;          // 4 bytes, -2B to 2B
float  f = 3.14f;       // 4 bytes, ~7 digits precision
double d = 3.14159265;  // 8 bytes, ~15 digits precision
bool   b = true;        // 1 byte
char   c = 'A';         // 1 byte (65)
\`\`\`

## Type Modifiers
\`\`\`cpp
unsigned int u = 4294967295;  // no negatives, 0 to 4B
long long    l = 9223372036854775807LL;
const int    MAX = 100;       // immutable
\`\`\`

## auto Keyword (C++11)
\`\`\`cpp
auto name = "Shane";   // const char*
auto score = 95;       // int
auto pi = 3.14159;     // double
\`\`\`` },
            {
                type: 'code', title: 'Types in Practice', code: `#include <iostream>
#include <string>

int main() {
    // Basic types
    int age = 22;
    double height = 1.82;
    bool isCoder = true;
    std::string name = "Shane";

    std::cout << "Name: " << name << std::endl;
    std::cout << "Age: " << age << std::endl;
    std::cout << "Height: " << height << "m" << std::endl;
    std::cout << "Coder: " << std::boolalpha << isCoder << std::endl;

    // Sizeof
    std::cout << "\\nsizeof(int) = " << sizeof(int) << " bytes" << std::endl;
    std::cout << "sizeof(double) = " << sizeof(double) << " bytes" << std::endl;

    return 0;
}` },
            {
                type: 'challenge', title: 'Challenge: Temperature Converter', instructions: `Write a C++ program that converts 100°C to Fahrenheit using: **F = C × 9/5 + 32**\n\nPrint: **"100°C = 212°F"**`, starterCode: `#include <iostream>

int main() {
    double celsius = 100.0;
    double fahrenheit = celsius * 9.0 / 5.0 + 32.0;
    std::cout << celsius << "C = " << fahrenheit << "F" << std::endl;
    return 0;
}`,
                check: (out) => out.includes('212'), hint: 'Output should contain 212'
            },
        ],
    },
    {
        id: 'pointers', title: 'Pointers & References', icon: '🔗', color: 'purple', xp: 100,
        description: 'Understand memory addresses, raw pointers, and safer references.',
        sections: [
            {
                type: 'theory', title: 'Pointers & References', content: `## Pointers
A pointer stores the **memory address** of another variable.

\`\`\`cpp
int x = 42;
int* ptr = &x;    // ptr holds address of x
int val = *ptr;   // dereference: val = 42
*ptr = 100;       // changes x to 100
\`\`\`

## References
A reference is an **alias** for an existing variable — safer than pointers.

\`\`\`cpp
int x = 42;
int& ref = x;  // ref IS x
ref = 100;     // x is now 100
\`\`\`

## nullptr
Always initialize pointers. Use \`nullptr\` for null pointers.
\`\`\`cpp
int* p = nullptr;  // safe null
if (p != nullptr) { /* safe to use */ }
\`\`\`` },
            {
                type: 'code', title: 'Pointers in Practice', code: `#include <iostream>

void doubleValue(int* ptr) {
    *ptr *= 2;
}

void tripleRef(int& ref) {
    ref *= 3;
}

int main() {
    int x = 10;

    std::cout << "Value: " << x << std::endl;
    std::cout << "Address: " << &x << std::endl;

    int* p = &x;
    std::cout << "Via pointer: " << *p << std::endl;

    doubleValue(&x);
    std::cout << "After doubleValue: " << x << std::endl;

    tripleRef(x);
    std::cout << "After tripleRef: " << x << std::endl;

    return 0;
}` },
            {
                type: 'challenge', title: 'Challenge: Swap Function', instructions: `Write a function \`swap(int* a, int* b)\` that swaps two integers using pointers.\n\nPrint before and after:\n- Before: **"a=5 b=10"**\n- After: **"a=10 b=5"**`, starterCode: `#include <iostream>

void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int a = 5, b = 10;
    std::cout << "a=" << a << " b=" << b << std::endl;
    swap(&a, &b);
    std::cout << "a=" << a << " b=" << b << std::endl;
    return 0;
}`,
                check: (out) => out.includes('a=10') && out.includes('b=5'), hint: 'After swap: a=10 b=5'
            },
        ],
    },
    {
        id: 'arrays', title: 'Arrays & Vectors', icon: '📋', color: 'gold', xp: 75,
        description: 'Fixed arrays, dynamic std::vector, and iterating collections.',
        sections: [
            {
                type: 'theory', title: 'Arrays and Vectors', content: `## Raw Arrays
\`\`\`cpp
int arr[5] = {10, 20, 30, 40, 50};
arr[0];      // 10
arr[4];      // 50
\`\`\`

## std::vector (prefer this)
\`\`\`cpp
#include <vector>
std::vector<int> v = {1, 2, 3};
v.push_back(4);       // add to end
v.pop_back();         // remove last
v.size();             // count
v[0];                 // access
v.front(); v.back();  // first / last
\`\`\`

## Range-based for (C++11)
\`\`\`cpp
for (int n : v) { std::cout << n; }
for (auto& n : v) { n *= 2; }  // modify
\`\`\`` },
            {
                type: 'code', title: 'Vectors in Practice', code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>

int main() {
    std::vector<int> scores = {85, 92, 67, 78, 95, 88};

    std::cout << "Count: " << scores.size() << std::endl;
    std::cout << "Sum: " << std::accumulate(scores.begin(), scores.end(), 0) << std::endl;
    std::cout << "Max: " << *std::max_element(scores.begin(), scores.end()) << std::endl;

    std::sort(scores.begin(), scores.end(), std::greater<int>());
    std::cout << "Sorted desc: ";
    for (int s : scores) std::cout << s << " ";
    std::cout << std::endl;

    return 0;
}` },
            {
                type: 'challenge', title: 'Challenge: Filter Evens', instructions: `Given \`{1,2,3,4,5,6,7,8,9,10}\`, print only even numbers separated by spaces.\n\nExpected: **"2 4 6 8 10"**`, starterCode: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> nums = {1,2,3,4,5,6,7,8,9,10};
    for (int n : nums) {
        if (n % 2 == 0) std::cout << n << " ";
    }
    std::cout << std::endl;
    return 0;
}`,
                check: (out) => out.includes('2') && out.includes('4') && out.includes('10'), hint: 'Print only numbers divisible by 2'
            },
        ],
    },
    {
        id: 'functions', title: 'Functions & Overloading', icon: '⚡', color: 'cyan', xp: 100,
        description: 'Function overloading, default args, templates, and inline functions.',
        sections: [
            {
                type: 'theory', title: 'Functions in C++', content: `## Function Basics
\`\`\`cpp
int add(int a, int b) { return a + b; }
\`\`\`

## Default Arguments
\`\`\`cpp
double power(double base, int exp = 2) {
    double result = 1;
    for (int i = 0; i < exp; i++) result *= base;
    return result;
}
power(3);     // 9
power(2, 8);  // 256
\`\`\`

## Overloading
\`\`\`cpp
int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }
// Same name, different parameter types
\`\`\`

## Templates
\`\`\`cpp
template<typename T>
T max_of(T a, T b) { return a > b ? a : b; }

max_of(3, 7);      // int: 7
max_of(3.14, 2.0); // double: 3.14
\`\`\`` },
            {
                type: 'code', title: 'Function Templates', code: `#include <iostream>

template<typename T>
T clamp(T value, T low, T high) {
    if (value < low) return low;
    if (value > high) return high;
    return value;
}

double lerp(double a, double b, double t) {
    return a + t * (b - a);
}

int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}

int main() {
    std::cout << clamp(15, 0, 10) << std::endl;  // 10
    std::cout << clamp(-5, 0, 10) << std::endl;  // 0
    std::cout << lerp(0.0, 100.0, 0.75) << std::endl; // 75
    std::cout << factorial(6) << std::endl;        // 720
    return 0;
}` },
            {
                type: 'challenge', title: 'Challenge: Template Min3', instructions: `Write a template function \`min3(a, b, c)\` that returns the smallest of 3 values.\n\nPrint:\n- \`min3(7, 2, 9)\` → **2**\n- \`min3(3.5, 1.2, 4.8)\` → **1.2**`, starterCode: `#include <iostream>

template<typename T>
T min3(T a, T b, T c) {
    T m = a;
    if (b < m) m = b;
    if (c < m) m = c;
    return m;
}

int main() {
    std::cout << min3(7, 2, 9) << std::endl;
    std::cout << min3(3.5, 1.2, 4.8) << std::endl;
    return 0;
}`,
                check: (out) => out.includes('2') && out.includes('1.2'), hint: 'Output: 2 then 1.2'
            },
        ],
    },
    {
        id: 'classes', title: 'Classes & OOP', icon: '🏗️', color: 'purple', xp: 100,
        description: 'Classes, constructors, encapsulation, and inheritance in C++.',
        sections: [
            {
                type: 'theory', title: 'C++ Classes', content: `## Class Definition
\`\`\`cpp
class Player {
private:
    std::string name;
    int hp;

public:
    Player(std::string n, int h) : name(n), hp(h) {}

    void takeDamage(int dmg) {
        hp = std::max(0, hp - dmg);
    }

    int getHP() const { return hp; }
    std::string getName() const { return name; }
};
\`\`\`

## Inheritance
\`\`\`cpp
class Mage : public Player {
    int mana;
public:
    Mage(std::string n) : Player(n, 80), mana(100) {}
    void castSpell() { mana -= 20; }
};
\`\`\`

## Access Specifiers
- \`private\` — only inside class
- \`public\` — accessible from outside
- \`protected\` — accessible in subclasses` },
            {
                type: 'code', title: 'Class in Practice', code: `#include <iostream>
#include <string>
#include <algorithm>

class Character {
    std::string name;
    int hp, maxHp;

public:
    Character(std::string n, int h) : name(n), hp(h), maxHp(h) {}

    void takeDamage(int dmg) { hp = std::max(0, hp - dmg); }
    void heal(int amount)    { hp = std::min(maxHp, hp + amount); }
    bool isAlive() const     { return hp > 0; }

    void print() const {
        std::cout << name << " HP: " << hp << "/" << maxHp << std::endl;
    }
};

int main() {
    Character hero("Shane", 100);
    Character boss("Dragon", 200);

    hero.print();
    boss.print();

    hero.takeDamage(35);
    boss.takeDamage(50);

    std::cout << "\\nAfter battle:" << std::endl;
    hero.print();
    boss.print();

    return 0;
}` },
            {
                type: 'challenge', title: 'Challenge: Rectangle Class', instructions: `Create a \`Rectangle\` class with \`width\` and \`height\`. Add methods:\n- \`area()\` → returns width × height\n- \`perimeter()\` → returns 2×(w+h)\n- \`isSquare()\` → true if w == h\n\nPrint for a 4×6 rectangle: area, perimeter, isSquare.`, starterCode: `#include <iostream>

class Rectangle {
    double width, height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    double area()      { return width * height; }
    double perimeter() { return 2 * (width + height); }
    bool isSquare()    { return width == height; }
};

int main() {
    Rectangle r(4, 6);
    std::cout << "Area: " << r.area() << std::endl;
    std::cout << "Perimeter: " << r.perimeter() << std::endl;
    std::cout << "Square: " << std::boolalpha << r.isSquare() << std::endl;
    return 0;
}`,
                check: (out) => out.includes('24') && out.includes('20'), hint: 'Area=24, Perimeter=20'
            },
        ],
    },
    {
        id: 'memory', title: 'Memory Management', icon: '🧠', color: 'orange', xp: 125,
        description: 'Stack vs heap, new/delete, RAII, and smart pointers.',
        sections: [
            {
                type: 'theory', title: 'C++ Memory Model', content: `## Stack vs Heap
- **Stack** — automatic, fast, limited size, cleaned up automatically
- **Heap** — manual, large, must free manually

\`\`\`cpp
int stack_var = 42;         // stack
int* heap_var = new int(42); // heap
delete heap_var;            // must free!
\`\`\`

## Memory Leaks
Forgetting \`delete\` causes leaks. Always pair \`new\` with \`delete\`.

## Smart Pointers (C++11, prefer these)
\`\`\`cpp
#include <memory>
auto p = std::make_unique<int>(42);  // unique ownership
auto s = std::make_shared<int>(42);  // shared ownership

// No delete needed — automatic cleanup
\`\`\`

## RAII
Resource Acquisition Is Initialization — tie resource lifetime to object lifetime. Constructors acquire, destructors release.` },
            {
                type: 'code', title: 'Smart Pointers', code: `#include <iostream>
#include <memory>
#include <string>

class Resource {
    std::string name;
public:
    Resource(std::string n) : name(n) {
        std::cout << "Acquired: " << name << std::endl;
    }
    ~Resource() {
        std::cout << "Released: " << name << std::endl;
    }
    void use() { std::cout << "Using: " << name << std::endl; }
};

int main() {
    std::cout << "--- unique_ptr ---" << std::endl;
    {
        auto r = std::make_unique<Resource>("FileHandle");
        r->use();
    }  // automatically released here

    std::cout << "--- shared_ptr ---" << std::endl;
    auto s1 = std::make_shared<Resource>("NetworkConn");
    {
        auto s2 = s1;  // both own it
        s2->use();
        std::cout << "Refs: " << s1.use_count() << std::endl;
    }  // s2 gone, s1 still holds it
    std::cout << "Refs: " << s1.use_count() << std::endl;

    return 0;
}` },
            {
                type: 'challenge', title: 'Challenge: Smart Array', instructions: `Use \`std::unique_ptr\` to create a heap-allocated array of 5 ints \`{10,20,30,40,50}\`.\n\nPrint each element and their sum. No raw \`new[]\`/\`delete[]\`.`, starterCode: `#include <iostream>
#include <memory>
#include <numeric>

int main() {
    auto arr = std::make_unique<int[]>(5);
    int vals[] = {10, 20, 30, 40, 50};
    for (int i = 0; i < 5; i++) arr[i] = vals[i];

    for (int i = 0; i < 5; i++) std::cout << arr[i] << " ";
    std::cout << std::endl;

    int sum = 0;
    for (int i = 0; i < 5; i++) sum += arr[i];
    std::cout << "Sum: " << sum << std::endl;

    return 0;
}`,
                check: (out) => out.includes('150'), hint: 'Sum should be 150'
            },
        ],
    },
];

/** Git curriculum — 6 topics */
export const GIT_TOPICS = [
    {
        id: 'init', title: 'Init & Staging', icon: '🚀', color: 'orange', xp: 50,
        description: 'Create repos, track files, and understand the working tree.',
        sections: [
            {
                type: 'theory', title: 'Starting with Git', content: `## Initialize a Repository
\`\`\`bash
git init                    # new repo
git clone <url>             # clone existing
\`\`\`

## Three Areas
1. **Working tree** — your local files
2. **Staging area (index)** — files queued for commit
3. **Repository** — committed history

## Staging Files
\`\`\`bash
git status                  # see current state
git add file.txt            # stage one file
git add .                   # stage all changes
git add -p                  # interactive staging
git restore --staged file   # unstage
\`\`\`` },
            {
                type: 'code', title: 'First Git Workflow', code: `# This is a conceptual walkthrough (run in terminal)

# 1. Create a repo
# git init my-project
# cd my-project

# 2. Create a file
# echo "Hello" > README.md

# 3. Check status
# git status
# Output: Untracked files: README.md

# 4. Stage it
# git add README.md
# git status
# Output: Changes to be committed: README.md

# 5. Commit
# git commit -m "Initial commit"
# Output: [main (root-commit) abc1234] Initial commit

echo "Git init workflow complete!"` },
            {
                type: 'challenge', title: 'Knowledge Check', instructions: `Answer: What command moves a file from the **working tree** to the **staging area**?\n\nPrint: **"git add"**`, starterCode: `# Which command stages a file?
print("git add")`,
                check: (out) => out.includes('git add'), hint: 'The command is: git add'
            },
        ],
    },
    {
        id: 'commits', title: 'Commits & History', icon: '📜', color: 'cyan', xp: 50,
        description: 'Write good commits, view history, and navigate the commit graph.',
        sections: [
            {
                type: 'theory', title: 'Commits & History', content: `## Committing
\`\`\`bash
git commit -m "feat: add user login"
git commit -am "fix: correct typo"    # stage+commit tracked files
\`\`\`

## Conventional Commits (recommended)
| Prefix | Meaning |
|--------|---------|
| \`feat:\` | new feature |
| \`fix:\` | bug fix |
| \`docs:\` | documentation |
| \`refactor:\` | code cleanup |
| \`test:\` | adding tests |

## Viewing History
\`\`\`bash
git log                   # full log
git log --oneline         # compact
git log --graph --oneline # branch graph
git show abc1234          # show one commit
git diff HEAD~1           # diff with last commit
\`\`\`

## Undoing
\`\`\`bash
git restore file.txt      # discard working changes
git revert HEAD           # reverse last commit safely
git reset --soft HEAD~1   # undo commit, keep staged
\`\`\`` },
            {
                type: 'code', title: 'Good Commit Messages', code: `# Good commit message examples (print format)

commits = [
    "feat: add JWT authentication middleware",
    "fix: resolve null pointer in user lookup",
    "refactor: extract database connection to module",
    "docs: update API endpoint documentation",
    "test: add unit tests for payment processor",
    "chore: upgrade React from 17 to 18",
]

print("Example commit messages:")
for i, msg in enumerate(commits, 1):
    prefix = msg.split(":")[0]
    print(f"  {i}. [{prefix.upper()}] {msg[len(prefix)+2:]}")` },
            {
                type: 'challenge', title: 'Conventional Commits', instructions: `Write a Python function \`classify(msg)\` that returns the commit type from a conventional commit message.\n\n- \`"feat: login"\` → **"feat"**\n- \`"fix: crash"\` → **"fix"**\n\nTest with both examples.`, starterCode: `def classify(msg):
    return msg.split(":")[0]

print(classify("feat: add login"))
print(classify("fix: resolve crash"))`,
                check: (out) => out.includes('feat') && out.includes('fix'), hint: 'Split on ":" and take first part'
            },
        ],
    },
    {
        id: 'branching', title: 'Branching', icon: '🌿', color: 'purple', xp: 75,
        description: 'Create, switch, and manage branches for parallel development.',
        sections: [
            {
                type: 'theory', title: 'Git Branches', content: `A branch is a lightweight **pointer to a commit**. Branches let you work on features in isolation.

## Branch Commands
\`\`\`bash
git branch                    # list branches
git branch feature/login      # create
git switch feature/login      # switch (Git 2.23+)
git switch -c feature/login   # create + switch
git branch -d feature/login   # delete (merged)
git branch -D feature/login   # force delete
\`\`\`

## Good Branch Names
\`\`\`
feature/user-auth
bugfix/null-pointer-crash
hotfix/security-patch
release/v2.0.0
\`\`\`

## HEAD
\`HEAD\` points to your current position. \`HEAD~1\` = one commit back. \`HEAD~3\` = three back.` },
            {
                type: 'code', title: 'Branch Simulation', code: `# Simulate branch operations conceptually

branches = {"main": ["init", "feat: home page"]}
current = "main"

def create_branch(name):
    branches[name] = branches[current].copy()
    print(f"Created branch: {name}")

def commit(msg):
    branches[current].append(msg)
    print(f"[{current}] Committed: {msg}")

def switch(name):
    global current
    current = name
    print(f"Switched to: {name}")

def log():
    print(f"\\n{current} history:")
    for c in branches[current]:
        print(f"  * {c}")

create_branch("feature/login")
switch("feature/login")
commit("feat: add login form")
commit("feat: JWT auth middleware")

switch("main")
commit("docs: update readme")

log()
switch("feature/login")
log()` },
            {
                type: 'challenge', title: 'Branch Naming', instructions: `Given these tasks, print the correct branch name for each:\n1. New feature: user profile → **"feature/user-profile"**\n2. Bug fix: login crash → **"bugfix/login-crash"**\n3. Security patch → **"hotfix/security-patch"**`, starterCode: `tasks = [
    ("feature", "user profile"),
    ("bugfix", "login crash"),
    ("hotfix", "security patch"),
]

for type_, desc in tasks:
    name = type_ + "/" + desc.replace(" ", "-")
    print(name)`,
                check: (out) => out.includes('feature/user-profile') && out.includes('bugfix/login-crash'), hint: 'Replace spaces with hyphens in branch names'
            },
        ],
    },
    {
        id: 'merging', title: 'Merging & Conflicts', icon: '🔀', color: 'gold', xp: 75,
        description: 'Merge branches and resolve conflicts like a pro.',
        sections: [
            {
                type: 'theory', title: 'Merging in Git', content: `## Fast-forward Merge
When main hasn't diverged — Git just moves the pointer.
\`\`\`bash
git switch main
git merge feature/login    # fast-forward if possible
\`\`\`

## 3-Way Merge
When both branches have new commits, Git creates a **merge commit**.

## Merge Conflicts
Conflicts happen when both branches change the same lines.
\`\`\`
<<<<<<< HEAD
console.log("main version");
=======
console.log("feature version");
>>>>>>> feature/login
\`\`\`
**Resolve by:** editing the file, removing conflict markers, then \`git add + git commit\`.

## Rebase (alternative)
\`\`\`bash
git rebase main    # replay your commits on top of main
\`\`\`
Creates a cleaner linear history.` },
            {
                type: 'code', title: 'Conflict Resolution', code: `# Conflict resolution decision tree

def resolve_strategy(both_changed, same_lines):
    if not both_changed:
        return "fast-forward merge"
    if same_lines:
        return "manual conflict resolution required"
    return "automatic 3-way merge"

scenarios = [
    (False, False),  # only one branch changed
    (True, False),   # both changed, different lines
    (True, True),    # both changed, same lines = conflict
]

for both, same in scenarios:
    strategy = resolve_strategy(both, same)
    print(f"Both: {both}, Same lines: {same} → {strategy}")` },
            {
                type: 'challenge', title: 'Conflict Markers', instructions: `Given a conflict string, write code to extract and print the **"ours"** (HEAD) version.\n\nFor input containing both HEAD and feature versions, print only the HEAD version: **"return user.id"**`, starterCode: `conflict = """<<<<<<< HEAD
return user.id
=======
return user.userId
>>>>>>> feature/auth"""

lines = conflict.split("\\n")
in_ours = False
for line in lines:
    if line.startswith("<<<<<<<"):
        in_ours = True
        continue
    if line.startswith("======="):
        in_ours = False
        continue
    if line.startswith(">>>>>>>"):
        break
    if in_ours:
        print(line)`,
                check: (out) => out.includes('return user.id'), hint: 'Extract content between <<<<<<< and ======='
            },
        ],
    },
    {
        id: 'remote', title: 'Remote & GitHub', icon: '☁️', color: 'cyan', xp: 50,
        description: 'Push, pull, fetch, and collaborate using GitHub remotes.',
        sections: [
            {
                type: 'theory', title: 'Working with Remotes', content: `## Remote Commands
\`\`\`bash
git remote add origin https://github.com/user/repo.git
git remote -v          # list remotes

git push origin main   # upload commits
git pull origin main   # fetch + merge
git fetch origin       # download without merging
\`\`\`

## Tracking Branches
\`\`\`bash
git push -u origin main   # set upstream
git push                  # from then on, just push
\`\`\`

## Pull Requests  
1. Fork or clone the repo
2. Create a feature branch
3. Push the branch: \`git push origin feature/my-fix\`
4. Open a PR on GitHub
5. Get review → merge

## .gitignore
\`\`\`
node_modules/
.env
*.log
dist/
\`\`\`` },
            {
                type: 'code', title: 'Remote Workflow', code: `# Simulate a typical remote workflow

steps = [
    ("clone", "git clone https://github.com/user/repo"),
    ("branch", "git switch -c feature/my-feature"),
    ("edit", "# ... make your changes ..."),
    ("stage", "git add ."),
    ("commit", 'git commit -m "feat: add my feature"'),
    ("push", "git push -u origin feature/my-feature"),
    ("pr", "# Open Pull Request on GitHub"),
    ("merge", "# PR reviewed and merged"),
    ("sync", "git switch main && git pull"),
]

print("GitHub Feature Branch Workflow:")
for i, (action, cmd) in enumerate(steps, 1):
    print(f"  {i}. [{action.upper()}] {cmd}")` },
            {
                type: 'challenge', title: 'gitignore Builder', instructions: `Write Python code that generates a .gitignore file content for a Node.js project.\n\nPrint these 4 lines:\n**node_modules/**\n**.env**\n**dist/**\n**\\*.log**`, starterCode: `patterns = [
    "node_modules/",
    ".env",
    "dist/",
    "*.log"
]

for p in patterns:
    print(p)`,
                check: (out) => out.includes('node_modules') && out.includes('.env') && out.includes('*.log'), hint: 'Print all 4 patterns'
            },
        ],
    },
    {
        id: 'rebase', title: 'Rebase & Advanced', icon: '🔧', color: 'purple', xp: 100,
        description: 'Interactive rebase, cherry-pick, stash, and advanced history editing.',
        sections: [
            {
                type: 'theory', title: 'Advanced Git', content: `## Interactive Rebase
\`\`\`bash
git rebase -i HEAD~3   # edit last 3 commits
\`\`\`
Commands: \`pick\`, \`reword\`, \`squash\`, \`drop\`, \`fixup\`

## Stash
\`\`\`bash
git stash             # save dirty state
git stash pop         # restore + remove
git stash list        # see all stashes
git stash apply 0     # apply without removing
\`\`\`

## Cherry-pick
\`\`\`bash
git cherry-pick abc1234   # apply one commit from another branch
\`\`\`

## Bisect
\`\`\`bash
git bisect start
git bisect bad          # current is broken
git bisect good v1.0    # this was working
# Git binary searches for the breaking commit
\`\`\`` },
            {
                type: 'code', title: 'Stash Workflow', code: `# Simulate stash usage

stash = []
working_tree = {"feature.py": "half done work"}

def stash_save(desc):
    stash.append((desc, working_tree.copy()))
    working_tree.clear()
    print(f"Stashed: {desc}")

def stash_pop():
    desc, saved = stash.pop()
    working_tree.update(saved)
    print(f"Restored: {desc}")

def do_hotfix():
    print("Applied hotfix on clean working tree")

print("Working on feature...")
stash_save("WIP: half-done feature")
print(f"Working tree: {working_tree}")

do_hotfix()

stash_pop()
print(f"Working tree: {working_tree}")` },
            {
                type: 'challenge', title: 'Rebase vs Merge', instructions: `Print a comparison table of Rebase vs Merge:\n\n**rebase: linear history**\n**merge: preserves branch history**\n**rebase: rewrites commits**\n**merge: creates merge commit**`, starterCode: `comparisons = [
    ("rebase", "linear history"),
    ("merge", "preserves branch history"),
    ("rebase", "rewrites commits"),
    ("merge", "creates merge commit"),
]

for cmd, desc in comparisons:
    print(f"{cmd}: {desc}")`,
                check: (out) => out.includes('rebase: linear history') && out.includes('merge: creates merge commit'), hint: 'Print 4 comparison lines'
            },
        ],
    },
];

export const PYTHON_LEARN = { meta: { name: 'Python', emoji: '🐍', color: 'cyan', layer: 'Foundation', description: 'Master Python from variables to async programming.' }, topics: PYTHON_TOPICS };
export const CPP_LEARN = { meta: { name: 'C++', emoji: '⚙️', color: 'orange', layer: 'Foundation', description: 'Systems programming, OOP, and memory management.' }, topics: CPP_TOPICS };
export const GIT_LEARN = { meta: { name: 'Git', emoji: '📂', color: 'gold', layer: 'Foundation', description: 'Version control, collaboration, and history mastery.' }, topics: GIT_TOPICS };
