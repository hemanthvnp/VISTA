/** @fileoverview Learn curriculum — JavaScript, TypeScript, React, Node.js, SQL, Java, DSA */

// ─── JavaScript ───────────────────────────────────────────────────────────────
export const JS_LEARN = {
  meta: { name: 'JavaScript', emoji: '🌐', color: 'cyan', layer: 'Foundation', description: 'The language of the web — variables, functions, async, and the DOM.' },
  topics: [
    {
      id: 'variables-types', title: 'Variables & Types', icon: '📦', color: 'cyan', xp: 75,
      description: 'Understanding let/const/var, JavaScript primitives, and type coercion.',
      sections: [
        {
          type: 'theory', title: 'Variables & Primitives', content: `JavaScript has three ways to declare variables:

\`\`\`js
var x = 1;    // function-scoped, hoisted (avoid)
let y = 2;    // block-scoped, reassignable
const z = 3;  // block-scoped, not reassignable
\`\`\`

## The 7 Primitive Types
| Type       | Example              |
|------------|----------------------|
| string     | \`"hello"\`          |
| number     | \`42\`, \`3.14\`     |
| boolean    | \`true\`, \`false\`  |
| null       | \`null\`             |
| undefined  | \`undefined\`        |
| bigint     | \`9007199254740993n\` |
| symbol     | \`Symbol("id")\`     |

## Type Coercion
JavaScript converts types automatically — this causes surprises:
\`\`\`js
"5" + 3      // "53"  (string concatenation)
"5" - 3      // 2     (numeric subtraction)
Boolean("")  // false (falsy)
Boolean("0") // true  (non-empty string)
\`\`\`

Use \`===\` (strict equality) not \`==\` to avoid coercion bugs.`,
        },
        {
          type: 'code', title: 'Working With Types', code: `// typeof tells you the type at runtime
console.log(typeof "hello");   // "string"
console.log(typeof 42);        // "number"
console.log(typeof true);      // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof null);      // "object" ← famous JS quirk

// Template literals (backticks) for string interpolation
const name = "VISTA";
const year = 2025;
console.log(\`Welcome to \${name} — class of \${year}!\`);

// Destructuring
const [a, b, ...rest] = [1, 2, 3, 4, 5];
console.log(a, b, rest); // 1 2 [3, 4, 5]

const { x, y, z = 0 } = { x: 10, y: 20 };
console.log(x, y, z); // 10 20 0`,
        },
        {
          type: 'challenge', title: 'Challenge: Type Checker', instructions: `Write a function \`describe(val)\` that returns a string like:\n- \`"42 is a number"\`\n- \`"hello is a string"\`\n- \`"true is a boolean"\`\n\nCall it with three different values and log the results.`,
          starterCode: `function describe(val) {
  return \`\${val} is a \${typeof val}\`;
}

console.log(describe(42));
console.log(describe("hello"));
console.log(describe(true));`,
          check: (out) => out.includes('number') && out.includes('string') && out.includes('boolean'),
          hint: 'Use typeof to get the type name',
        },
      ],
    },
    {
      id: 'functions-closures', title: 'Functions & Closures', icon: '🔧', color: 'purple', xp: 100,
      description: 'Function declarations, arrow functions, scope, and closures.',
      sections: [
        {
          type: 'theory', title: 'Functions in JavaScript', content: `## Declaration vs Expression
\`\`\`js
// Declaration — hoisted, callable before defined
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Expression — not hoisted
const greet = function(name) {
  return \`Hello, \${name}!\`;
};

// Arrow function — concise, no own "this"
const greet = (name) => \`Hello, \${name}!\`;
\`\`\`

## Default & Rest Parameters
\`\`\`js
function add(a, b = 0) { return a + b; }  // default
function sum(...nums) { return nums.reduce((s, n) => s + n, 0); } // rest
\`\`\`

## Closures
A closure is a function that **remembers variables from its outer scope** even after that scope has returned:

\`\`\`js
function makeCounter() {
  let count = 0;
  return () => ++count;  // inner fn "closes over" count
}

const counter = makeCounter();
counter(); // 1
counter(); // 2
counter(); // 3
\`\`\`

Closures are the basis for many patterns: private variables, factory functions, partial application.`,
        },
        {
          type: 'code', title: 'Closure: Memoize', code: `// Memoization caches results of expensive calls
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log("cache hit:", key);
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

function slowSquare(n) {
  return n * n;
}

const fastSquare = memoize(slowSquare);
console.log(fastSquare(5));  // computed: 25
console.log(fastSquare(5));  // cache hit: 25
console.log(fastSquare(9));  // computed: 81`,
        },
        {
          type: 'challenge', title: 'Challenge: Once Function', instructions: `Write \`once(fn)\` — a function that wraps \`fn\` so it can only be called once.\nSubsequent calls return the result of the first call.\n\nTest:\n\`\`\`\nconst init = once(() => "initialized!");\nconsole.log(init()); // "initialized!"\nconsole.log(init()); // "initialized!" (same, not re-run)\n\`\`\``,
          starterCode: `function once(fn) {
  let called = false;
  let result;
  return function(...args) {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

const init = once(() => "initialized!");
console.log(init());
console.log(init());`,
          check: (out) => (out.match(/initialized/g) || []).length >= 2,
          hint: 'Use a boolean flag and store the result',
        },
      ],
    },
    {
      id: 'arrays-async', title: 'Arrays & Async', icon: '⚡', color: 'gold', xp: 125,
      description: 'Array methods (map/filter/reduce) and async JavaScript with Promises.',
      sections: [
        {
          type: 'theory', title: 'Array Methods & Async', content: `## The Big Three Array Methods
\`\`\`js
const nums = [1, 2, 3, 4, 5];

nums.map(n => n * 2)           // [2, 4, 6, 8, 10]  — transform each
nums.filter(n => n % 2 === 0)  // [2, 4]             — keep matching
nums.reduce((sum, n) => sum + n, 0)  // 15           — fold to one value
\`\`\`

## Promises
A Promise represents a value that will be available in the future:
\`\`\`js
fetch("https://api.example.com/data")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
\`\`\`

## async / await
\`await\` pauses execution until a Promise resolves — cleaner than \`.then()\`:
\`\`\`js
async function loadUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new Error("Not found");
    return await res.json();
  } catch (err) {
    console.error("Failed:", err.message);
  }
}
\`\`\``,
        },
        {
          type: 'code', title: 'Array Pipeline', code: `const students = [
  { name: "Alice", grade: 88 },
  { name: "Bob",   grade: 72 },
  { name: "Carol", grade: 95 },
  { name: "Dave",  grade: 60 },
];

// Pipeline: filter passing, sort desc, extract names
const topStudents = students
  .filter(s => s.grade >= 70)
  .sort((a, b) => b.grade - a.grade)
  .map(s => \`\${s.name}: \${s.grade}\`);

console.log(topStudents);
// ["Carol: 95", "Alice: 88", "Bob: 72"]

// reduce: compute average
const avg = students.reduce((sum, s) => sum + s.grade, 0) / students.length;
console.log("Average:", avg.toFixed(1));`,
        },
        {
          type: 'challenge', title: 'Challenge: Async Sequence', instructions: `Write a function \`delay(ms)\` that returns a Promise resolving after \`ms\` milliseconds.\nThen write \`runSequence()\` that runs three delays of 100ms each in sequence, logging "step 1", "step 2", "step 3".\n\nUse async/await.`,
          starterCode: `function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runSequence() {
  await delay(100);
  console.log("step 1");
  await delay(100);
  console.log("step 2");
  await delay(100);
  console.log("step 3");
}

runSequence();`,
          check: (out) => out.includes('step 1') && out.includes('step 2') && out.includes('step 3'),
          hint: 'Use setTimeout inside the Promise constructor',
        },
      ],
    },
  ],
};

// ─── TypeScript ───────────────────────────────────────────────────────────────
export const TS_LEARN = {
  meta: { name: 'TypeScript', emoji: '📘', color: 'purple', layer: 'Advanced', description: 'Typed JavaScript — interfaces, generics, and scalable app design.' },
  topics: [
    {
      id: 'types-interfaces', title: 'Types & Interfaces', icon: '📘', color: 'blue', xp: 75,
      description: 'TypeScript type annotations, interfaces, and type aliases.',
      sections: [
        {
          type: 'theory', title: 'Static Typing in TypeScript', content: `TypeScript adds **static types** to JavaScript. Types are checked at compile time — errors are caught before you run the code.

## Basic Annotations
\`\`\`ts
let name: string = "Alice";
let age: number = 22;
let active: boolean = true;
let scores: number[] = [95, 87, 92];
let pair: [string, number] = ["Alice", 22];  // tuple
\`\`\`

## Functions
\`\`\`ts
function add(a: number, b: number): number {
  return a + b;
}

const greet = (name: string): string => \`Hello, \${name}!\`;
\`\`\`

## Interfaces
An interface defines the **shape** of an object:
\`\`\`ts
interface User {
  id: number;
  name: string;
  email: string;
  role?: "admin" | "student";  // optional
}

function printUser(user: User): void {
  console.log(\`\${user.name} <\${user.email}>\`);
}
\`\`\`

## Type Alias
\`\`\`ts
type Point = { x: number; y: number };
type Status = "idle" | "loading" | "success" | "error";
\`\`\`

**Interface vs Type**: prefer \`interface\` for objects (can be extended), \`type\` for unions/primitives.`,
        },
        {
          type: 'code', title: 'Typed Student System', code: `interface Student {
  id: number;
  name: string;
  grades: number[];
}

function average(grades: number[]): number {
  return grades.reduce((s, g) => s + g, 0) / grades.length;
}

function report(student: Student): string {
  const avg = average(student.grades);
  const letter = avg >= 90 ? "A" : avg >= 80 ? "B" : avg >= 70 ? "C" : "F";
  return \`\${student.name}: \${avg.toFixed(1)} (\${letter})\`;
}

const alice: Student = { id: 1, name: "Alice", grades: [92, 88, 95, 91] };
const bob: Student   = { id: 2, name: "Bob",   grades: [70, 65, 78, 72] };

console.log(report(alice));
console.log(report(bob));`,
        },
        {
          type: 'challenge', title: 'Challenge: Type a Product', instructions: `Define a \`Product\` interface with: \`id\` (number), \`name\` (string), \`price\` (number), \`inStock\` (boolean).\nWrite a function \`formatProduct(p: Product): string\` that returns \`"[✓] Widget — $9.99"\` (or \`[✗]\` if out of stock).\nCreate two products and log both.`,
          starterCode: `interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

function formatProduct(p: Product): string {
  const status = p.inStock ? "[✓]" : "[✗]";
  return \`\${status} \${p.name} — $\${p.price.toFixed(2)}\`;
}

const p1: Product = { id: 1, name: "Widget", price: 9.99, inStock: true };
const p2: Product = { id: 2, name: "Gadget", price: 24.99, inStock: false };

console.log(formatProduct(p1));
console.log(formatProduct(p2));`,
          check: (out) => out.includes('Widget') && out.includes('Gadget'),
          hint: 'Use a ternary for the status indicator',
        },
      ],
    },
    {
      id: 'generics', title: 'Generics & Utility Types', icon: '🧬', color: 'purple', xp: 100,
      description: 'Write reusable generic functions and use TypeScript\'s built-in utility types.',
      sections: [
        {
          type: 'theory', title: 'Generics', content: `Generics let you write code that works with **any type** while staying type-safe.

## Generic Functions
\`\`\`ts
function identity<T>(value: T): T {
  return value;
}

identity<string>("hello");  // T = string
identity<number>(42);       // T = number
identity(true);             // T inferred as boolean
\`\`\`

## Generic Interfaces
\`\`\`ts
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

const res: ApiResponse<User[]> = {
  data: [...users],
  status: 200,
  message: "OK",
};
\`\`\`

## Built-in Utility Types
| Utility         | What it does                          |
|-----------------|---------------------------------------|
| \`Partial<T>\`  | All properties optional               |
| \`Required<T>\` | All properties required               |
| \`Pick<T, K>\`  | Keep only keys K from T               |
| \`Omit<T, K>\`  | Remove keys K from T                  |
| \`Record<K,V>\` | Object with keys K and values V       |
| \`Readonly<T>\` | All properties immutable              |

\`\`\`ts
type UserPreview = Pick<User, "id" | "name">;
type UpdateUser  = Partial<Omit<User, "id">>;
\`\`\``,
        },
        {
          type: 'code', title: 'Generic Stack', code: `class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const numStack = new Stack<number>();
numStack.push(1);
numStack.push(2);
numStack.push(3);
console.log(numStack.peek()); // 3
console.log(numStack.pop());  // 3
console.log(numStack.size);   // 2

const strStack = new Stack<string>();
strStack.push("hello");
strStack.push("world");
console.log(strStack.pop());  // "world"`,
        },
        {
          type: 'challenge', title: 'Challenge: Typed Cache', instructions: `Create a generic \`Cache<T>\` class with:\n- \`set(key: string, value: T): void\`\n- \`get(key: string): T | undefined\`\n- \`has(key: string): boolean\`\n\nInstantiate with \`number\` values, set three entries, and log \`get\` results.`,
          starterCode: `class Cache<T> {
  private store = new Map<string, T>();

  set(key: string, value: T): void {
    this.store.set(key, value);
  }

  get(key: string): T | undefined {
    return this.store.get(key);
  }

  has(key: string): boolean {
    return this.store.has(key);
  }
}

const scores = new Cache<number>();
scores.set("alice", 95);
scores.set("bob", 82);
scores.set("carol", 91);

console.log(scores.get("alice")); // 95
console.log(scores.get("bob"));   // 82
console.log(scores.has("dave"));  // false`,
          check: (out) => out.includes('95') && out.includes('82') && out.includes('false'),
          hint: 'Use Map<string, T> as the backing store',
        },
      ],
    },
    {
      id: 'classes-ts', title: 'Classes & OOP in TS', icon: '🏛️', color: 'cyan', xp: 100,
      description: 'TypeScript classes, access modifiers, abstract classes, and interfaces.',
      sections: [
        {
          type: 'theory', title: 'Classes in TypeScript', content: `## Access Modifiers
\`\`\`ts
class BankAccount {
  public owner: string;       // accessible anywhere (default)
  private balance: number;    // class only
  protected id: string;       // class + subclasses
  readonly createdAt: Date;   // can't be reassigned

  constructor(owner: string, initialBalance: number) {
    this.owner = owner;
    this.balance = initialBalance;
    this.id = crypto.randomUUID();
    this.createdAt = new Date();
  }

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Amount must be positive");
    this.balance += amount;
  }

  get currentBalance(): number { return this.balance; }
}
\`\`\`

## Abstract Classes & Interfaces
\`\`\`ts
abstract class Shape {
  abstract area(): number;          // must be implemented
  toString() { return \`Area: \${this.area()}\`; }
}

interface Printable {
  print(): void;
}

class Circle extends Shape implements Printable {
  constructor(private radius: number) { super(); }
  area() { return Math.PI * this.radius ** 2; }
  print() { console.log(this.toString()); }
}
\`\`\``,
        },
        {
          type: 'code', title: 'Class Hierarchy Example', code: `abstract class Animal {
  constructor(protected name: string, private sound: string) {}

  speak(): string {
    return \`\${this.name} says \${this.sound}!\`;
  }

  abstract move(): string;
}

class Dog extends Animal {
  constructor(name: string, private breed: string) {
    super(name, "woof");
  }

  move(): string { return \`\${this.name} runs on 4 legs\`; }
  fetch(): string { return \`\${this.name} (\${this.breed}) fetches the ball!\`; }
}

class Bird extends Animal {
  constructor(name: string) { super(name, "tweet"); }
  move(): string { return \`\${this.name} flies through the air\`; }
}

const dog = new Dog("Rex", "Labrador");
const bird = new Bird("Tweety");

console.log(dog.speak());
console.log(dog.move());
console.log(dog.fetch());
console.log(bird.speak());
console.log(bird.move());`,
        },
        {
          type: 'challenge', title: 'Challenge: Vehicle Hierarchy', instructions: `Create an abstract class \`Vehicle\` with \`make\`, \`model\`, \`year\` (constructor) and abstract \`describe(): string\`.\nExtend with \`Car\` (add \`doors: number\`) and \`Motorcycle\` (add \`type: "sport"|"cruiser"\`).\nInstantiate one of each and log their \`describe()\` output.`,
          starterCode: `abstract class Vehicle {
  constructor(
    protected make: string,
    protected model: string,
    protected year: number
  ) {}

  abstract describe(): string;
}

class Car extends Vehicle {
  constructor(make: string, model: string, year: number, public doors: number) {
    super(make, model, year);
  }
  describe(): string {
    return \`\${this.year} \${this.make} \${this.model} (\${this.doors}-door)\`;
  }
}

class Motorcycle extends Vehicle {
  constructor(make: string, model: string, year: number, public type: "sport" | "cruiser") {
    super(make, model, year);
  }
  describe(): string {
    return \`\${this.year} \${this.make} \${this.model} [\${this.type}]\`;
  }
}

const car = new Car("Toyota", "Camry", 2023, 4);
const moto = new Motorcycle("Honda", "CBR600RR", 2022, "sport");

console.log(car.describe());
console.log(moto.describe());`,
          check: (out) => out.includes('Camry') && out.includes('CBR600RR'),
          hint: 'super() must be called in subclass constructors before this',
        },
      ],
    },
  ],
};

// ─── React ────────────────────────────────────────────────────────────────────
export const REACT_LEARN = {
  meta: { name: 'React', emoji: '⚛️', color: 'cyan', layer: 'Advanced', description: 'Component-based UIs — hooks, state, context, and custom patterns.' },
  topics: [
    {
      id: 'components-props', title: 'Components & Props', icon: '⚛️', color: 'cyan', xp: 75,
      description: 'React function components, JSX, and passing data through props.',
      sections: [
        {
          type: 'theory', title: 'Components & JSX', content: `React UIs are built from **components** — reusable functions that return JSX (HTML-like syntax compiled to JavaScript).

## Function Component
\`\`\`jsx
function Greeting({ name, role = "Student" }) {
  return (
    <div className="card">
      <h2>Hello, {name}!</h2>
      <p>Role: {role}</p>
    </div>
  );
}
\`\`\`

## JSX Rules
- One root element (or \`<></>\` fragment)
- \`className\` not \`class\`, \`htmlFor\` not \`for\`
- JS expressions inside \`{}\` — not statements
- Self-close single tags: \`<img />\`, \`<br />\`

## Props
Props are **read-only** inputs passed from parent to child:
\`\`\`jsx
<Greeting name="Alice" role="Admin" />
\`\`\`

## Lists
\`\`\`jsx
const items = ["Python", "JavaScript", "SQL"];

function TechList() {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>  // key required for lists!
      ))}
    </ul>
  );
}
\`\`\``,
        },
        {
          type: 'code', title: 'Badge Component', code: `// A reusable badge component demonstrating props and conditional rendering
function Badge({ label, count, variant = "default" }) {
  const colors = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    danger:  "bg-red-100 text-red-700",
  };

  return (
    <span className={\`px-2 py-1 rounded \${colors[variant]}\`}>
      {label} {count !== undefined && <strong>{count}</strong>}
    </span>
  );
}

function Dashboard({ user }) {
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <div style={{ display: "flex", gap: 8 }}>
        <Badge label="XP" count={user.xp} variant="success" />
        <Badge label="Level" count={user.level} />
        {user.streak > 0 && (
          <Badge label="🔥 Streak" count={user.streak} variant="danger" />
        )}
      </div>
    </div>
  );
}`,
        },
        {
          type: 'challenge', title: 'Challenge: Card Component', instructions: `Create a \`Card\` component that accepts \`title\`, \`description\`, and optional \`tag\` props.\nIf \`tag\` is provided, render it in a small badge above the title.\nRender three different cards in an \`App\` component.`,
          starterCode: `function Card({ title, description, tag }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 16, margin: 8, borderRadius: 8 }}>
      {tag && <span style={{ fontSize: 11, background: "#e0e7ff", padding: "2px 6px", borderRadius: 4 }}>{tag}</span>}
      <h3 style={{ margin: "8px 0 4px" }}>{title}</h3>
      <p style={{ margin: 0, color: "#555" }}>{description}</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <Card title="Python" description="Foundation language" tag="Layer 1" />
      <Card title="React" description="UI framework" tag="Layer 2" />
      <Card title="DSA" description="Algorithms & data structures" />
    </div>
  );
}`,
          check: (out) => out.includes('Python') || out.includes('React'),
          hint: 'Use && for conditional rendering of the tag',
        },
      ],
    },
    {
      id: 'hooks', title: 'useState & useEffect', icon: '🪝', color: 'purple', xp: 100,
      description: 'React\'s core hooks for state and side effects.',
      sections: [
        {
          type: 'theory', title: 'The Two Essential Hooks', content: `## useState
Adds local state to a component. Each call returns \`[value, setter]\`:

\`\`\`jsx
const [count, setCount] = useState(0);
const [user, setUser] = useState(null);
const [form, setForm] = useState({ name: "", email: "" });
\`\`\`

State updates are **immutable** — always create a new value:
\`\`\`jsx
// ❌ Wrong — mutates state directly
state.items.push(newItem);

// ✅ Right — creates new array
setItems(prev => [...prev, newItem]);
\`\`\`

## useEffect
Runs side effects after render. The dependency array controls when it re-runs:

\`\`\`jsx
useEffect(() => {
  // runs after every render
});

useEffect(() => {
  // runs once (on mount)
}, []);

useEffect(() => {
  // runs when userId changes
  fetchUser(userId).then(setUser);
}, [userId]);

useEffect(() => {
  const timer = setInterval(...);
  return () => clearInterval(timer);  // cleanup on unmount
}, []);
\`\`\``,
        },
        {
          type: 'code', title: 'Live Search Filter', code: `import { useState, useEffect } from "react";

const TECH = ["Python", "JavaScript", "TypeScript", "React", "Node.js", "SQL", "Java", "C++", "Git", "DSA"];

function SearchFilter() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(TECH);

  useEffect(() => {
    const filtered = TECH.filter(t =>
      t.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query]);  // re-runs every time query changes

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search technologies..."
        style={{ padding: 8, width: "100%", marginBottom: 12 }}
      />
      <p>{results.length} results</p>
      <ul>
        {results.map(t => <li key={t}>{t}</li>)}
      </ul>
    </div>
  );
}`,
        },
        {
          type: 'challenge', title: 'Challenge: Todo List', instructions: `Build a minimal todo list with:\n- Text input + "Add" button to create todos\n- List of todos, each with a "Done" button to remove it\n- Show the count of remaining todos\n\nUse \`useState\` for the list and input.`,
          starterCode: `import { useState } from "react";

function TodoApp() {
  const [todos, setTodos] = useState(["Buy groceries", "Study React"]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos(prev => [...prev, input.trim()]);
    setInput("");
  };

  const removeTodo = (i) => {
    setTodos(prev => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      <h2>Todos ({todos.length})</h2>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="New todo..." />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((t, i) => (
          <li key={i}>
            {t} <button onClick={() => removeTodo(i)}>Done</button>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
          check: (out) => out.includes('Todo'),
          hint: 'Use filter to remove an item at a specific index',
        },
      ],
    },
    {
      id: 'context-patterns', title: 'Context & Patterns', icon: '🌐', color: 'gold', xp: 125,
      description: 'React Context API, custom hooks, and common component patterns.',
      sections: [
        {
          type: 'theory', title: 'Context & Custom Hooks', content: `## Context API
Context avoids "prop drilling" — passing props through many layers just to reach a deeply nested component.

\`\`\`jsx
// 1. Create
const ThemeContext = createContext("light");

// 2. Provide
function App() {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Layout />
    </ThemeContext.Provider>
  );
}

// 3. Consume (anywhere in the tree)
function Button() {
  const { theme } = useContext(ThemeContext);
  return <button className={theme}>Click me</button>;
}
\`\`\`

## Custom Hooks
Extract stateful logic into reusable hooks (must start with \`use\`):

\`\`\`jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(
    () => JSON.parse(localStorage.getItem(key)) ?? initialValue
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage
const [theme, setTheme] = useLocalStorage("theme", "dark");
\`\`\``,
        },
        {
          type: 'code', title: 'useDebounce Hook', code: `import { useState, useEffect } from "react";

// Custom hook: delays updating value until user stops typing
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);  // cancel on next keystroke
  }, [value, delay]);

  return debounced;
}

// Usage — simulates a search with API delay
function SearchBox() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedQuery) {
      console.log("Searching for:", debouncedQuery);
      // fetch("/api/search?q=" + debouncedQuery)
    }
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Type to search..."
    />
  );
}`,
        },
        {
          type: 'challenge', title: 'Challenge: useCounter Hook', instructions: `Write a custom \`useCounter(initial, step)\` hook that returns \`{ count, increment, decrement, reset }\`.\n- \`increment\` adds \`step\` (default 1)\n- \`decrement\` subtracts \`step\`\n- \`reset\` goes back to \`initial\`\n\nUse it in a component that shows the count and all three buttons.`,
          starterCode: `import { useState } from "react";

function useCounter(initial = 0, step = 1) {
  const [count, setCount] = useState(initial);
  return {
    count,
    increment: () => setCount(c => c + step),
    decrement: () => setCount(c => c - step),
    reset: () => setCount(initial),
  };
}

function Counter() {
  const { count, increment, decrement, reset } = useCounter(0, 5);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={decrement}>−5</button>
      <button onClick={reset}>Reset</button>
      <button onClick={increment}>+5</button>
    </div>
  );
}`,
          check: (out) => out.includes('Count') || out.includes('count'),
          hint: 'Return an object with the four values/functions from useState',
        },
      ],
    },
  ],
};

// ─── Node.js ──────────────────────────────────────────────────────────────────
export const NODEJS_LEARN = {
  meta: { name: 'Node.js', emoji: '🟢', color: 'gold', layer: 'Advanced', description: 'Server-side JavaScript — modules, Express, async patterns, and REST APIs.' },
  topics: [
    {
      id: 'modules-fs', title: 'Modules & File System', icon: '📁', color: 'cyan', xp: 75,
      description: 'Node.js module system, built-in fs module, and working with paths.',
      sections: [
        {
          type: 'theory', title: 'Modules in Node.js', content: `Node.js has two module systems:

## CommonJS (default .js files)
\`\`\`js
// math.js
function add(a, b) { return a + b; }
module.exports = { add };

// app.js
const { add } = require("./math");
\`\`\`

## ES Modules (.mjs or \`"type": "module"\` in package.json)
\`\`\`js
// math.mjs
export function add(a, b) { return a + b; }

// app.mjs
import { add } from "./math.mjs";
\`\`\`

## The fs Module
\`\`\`js
const fs = require("fs");
const path = require("path");

// Sync (blocks the thread — use only in scripts, not servers)
const data = fs.readFileSync("data.txt", "utf8");

// Async callback
fs.readFile("data.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Async/await (preferred)
const { readFile, writeFile } = require("fs/promises");

async function processFile() {
  const content = await readFile("data.txt", "utf8");
  await writeFile("out.txt", content.toUpperCase());
}
\`\`\``,
        },
        {
          type: 'code', title: 'File Utility Script', code: `const fs = require("fs/promises");
const path = require("path");

async function countWords(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    const words = content.trim().split(/\s+/).filter(Boolean);
    const lines = content.split("\\n");
    return {
      file: path.basename(filePath),
      words: words.length,
      lines: lines.length,
      chars: content.length,
    };
  } catch (err) {
    return { file: filePath, error: err.message };
  }
}

async function main() {
  // Simulate stats for a hypothetical file
  const stats = {
    file: "notes.md",
    words: 342,
    lines: 28,
    chars: 1850,
  };
  console.log(\`File: \${stats.file}\`);
  console.log(\`Words: \${stats.words}\`);
  console.log(\`Lines: \${stats.lines}\`);
  console.log(\`Chars: \${stats.chars}\`);
}

main();`,
        },
        {
          type: 'challenge', title: 'Challenge: Directory Walker', instructions: `Write a function \`listFiles(dir)\` that logs the name and extension of every file in a directory.\nUse \`fs.readdirSync\` and \`path.extname\`.\n\nFor this challenge, simulate it by logging a hardcoded list of filenames with their extensions extracted.`,
          starterCode: `const path = require("path");

function getExtension(filename) {
  return path.extname(filename) || "(no extension)";
}

const files = ["index.js", "README.md", "style.css", "Dockerfile", "data.json"];

files.forEach(file => {
  console.log(\`\${file} → \${getExtension(file)}\`);
});`,
          check: (out) => out.includes('.js') && out.includes('.md'),
          hint: 'path.extname returns the extension including the dot',
        },
      ],
    },
    {
      id: 'express', title: 'HTTP & Express', icon: '🚀', color: 'purple', xp: 100,
      description: 'Build REST APIs with Express: routing, middleware, and responses.',
      sections: [
        {
          type: 'theory', title: 'Express Fundamentals', content: `Express is the most popular Node.js web framework.

\`\`\`bash
npm install express
\`\`\`

## Basic Server
\`\`\`js
const express = require("express");
const app = express();

app.use(express.json());  // parse JSON bodies

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello from VISTA!" });
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  res.json({ userId: id });
});

app.post("/users", (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({ name, email });
});

app.listen(3000, () => console.log("Server on port 3000"));
\`\`\`

## Middleware
Middleware functions run between request and response:
\`\`\`js
// Logger middleware
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.path}\`);
  next();  // pass to next middleware/route
});

// Error handling middleware (4 params)
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
\`\`\``,
        },
        {
          type: 'code', title: 'CRUD Route Example', code: `const express = require("express");
const router = express.Router();

// In-memory store (use a DB in production)
let students = [
  { id: 1, name: "Alice", grade: 88 },
  { id: 2, name: "Bob",   grade: 74 },
];
let nextId = 3;

// GET all
router.get("/", (req, res) => {
  res.json(students);
});

// GET one
router.get("/:id", (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) return res.status(404).json({ error: "Not found" });
  res.json(student);
});

// POST create
router.post("/", (req, res) => {
  const { name, grade } = req.body;
  const student = { id: nextId++, name, grade };
  students.push(student);
  res.status(201).json(student);
});

// DELETE
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  students = students.filter(s => s.id !== id);
  res.status(204).send();
});

module.exports = router;`,
        },
        {
          type: 'challenge', title: 'Challenge: Middleware Logger', instructions: `Write Express middleware \`requestLogger\` that logs:\n\`[2025-01-01T10:00:00] GET /api/users 200ms\`\n\nIt should:\n1. Record \`Date.now()\` before handling\n2. Call \`next()\`\n3. After response, calculate elapsed time and log method + path + duration`,
          starterCode: `const express = require("express");
const app = express();

function requestLogger(req, res, next) {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(\`[\${timestamp}] \${req.method} \${req.path} \${duration}ms\`);
  });

  next();
}

app.use(requestLogger);
app.use(express.json());

app.get("/api/users", (req, res) => {
  res.json([{ id: 1, name: "Alice" }]);
});

// Simulated request log
const timestamp = new Date().toISOString();
console.log(\`[\${timestamp}] GET /api/users 3ms\`);`,
          check: (out) => out.includes('GET') && out.includes('/api'),
          hint: 'Listen to res.on("finish") to know when the response was sent',
        },
      ],
    },
    {
      id: 'async-node', title: 'Async Patterns', icon: '⚡', color: 'gold', xp: 100,
      description: 'Node.js event loop, callbacks, Promises, and async/await best practices.',
      sections: [
        {
          type: 'theory', title: 'The Event Loop', content: `Node.js is **single-threaded** but handles concurrency through the **event loop** — async operations run in the background and callbacks are queued when they complete.

## The Journey from Callbacks → Promises → Async/Await

### Callbacks (legacy, avoid "callback hell")
\`\`\`js
fs.readFile("a.txt", (err, a) => {
  fs.readFile("b.txt", (err, b) => {  // nested hell
    fs.writeFile("c.txt", a + b, (err) => { ... });
  });
});
\`\`\`

### Promises (chainable)
\`\`\`js
readFile("a.txt")
  .then(a => readFile("b.txt").then(b => [a, b]))
  .then(([a, b]) => writeFile("c.txt", a + b))
  .catch(console.error);
\`\`\`

### Async/Await (modern, preferred)
\`\`\`js
async function merge() {
  const [a, b] = await Promise.all([
    readFile("a.txt"),
    readFile("b.txt"),
  ]);
  await writeFile("c.txt", a + b);
}
\`\`\`

\`Promise.all\` runs tasks **in parallel** — much faster than sequential awaits for independent operations.`,
        },
        {
          type: 'code', title: 'Promise Combinators', code: `// Simulated async API calls
function fetchUser(id)  { return new Promise(r => setTimeout(() => r({ id, name: "Alice" }), 50)); }
function fetchPosts(id) { return new Promise(r => setTimeout(() => r([{ id: 1, title: "Post A" }, { id: 2, title: "Post B" }]), 80)); }
function fetchStats()   { return new Promise(r => setTimeout(() => r({ visits: 1200, likes: 340 }), 30)); }

async function loadDashboard(userId) {
  const start = Date.now();

  // All 3 run in parallel — total time = max of 3 times, not sum
  const [user, posts, stats] = await Promise.all([
    fetchUser(userId),
    fetchPosts(userId),
    fetchStats(),
  ]);

  console.log(\`Loaded in \${Date.now() - start}ms\`);
  console.log("User:", user.name);
  console.log("Posts:", posts.map(p => p.title).join(", "));
  console.log("Stats:", stats);
}

loadDashboard(1);`,
        },
        {
          type: 'challenge', title: 'Challenge: Retry Wrapper', instructions: `Write \`withRetry(fn, maxAttempts)\` that:\n1. Calls async \`fn()\`\n2. If it throws, waits 100ms and tries again\n3. Gives up after \`maxAttempts\` total attempts and re-throws\n\nTest with a function that fails twice then succeeds.`,
          starterCode: `function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function withRetry(fn, maxAttempts = 3) {
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      console.log(\`Attempt \${attempt} failed: \${err.message}\`);
      if (attempt < maxAttempts) await delay(100);
    }
  }
  throw lastErr;
}

// Test: fails twice, succeeds third time
let tries = 0;
async function flaky() {
  tries++;
  if (tries < 3) throw new Error("Temporary error");
  return "Success after " + tries + " tries";
}

withRetry(flaky, 3).then(console.log).catch(console.error);`,
          check: (out) => out.includes('Success') && out.includes('failed'),
          hint: 'Use a for loop with try/catch and re-throw after exhausting attempts',
        },
      ],
    },
  ],
};

// ─── SQL ──────────────────────────────────────────────────────────────────────
export const SQL_LEARN = {
  meta: { name: 'SQL', emoji: '🗄️', color: 'orange', layer: 'Foundation', description: 'Relational databases — queries, joins, aggregation, and schema design.' },
  topics: [
    {
      id: 'select-filtering', title: 'SELECT & Filtering', icon: '🔍', color: 'cyan', xp: 75,
      description: 'Query databases with SELECT, WHERE, ORDER BY, LIMIT, and LIKE.',
      sections: [
        {
          type: 'theory', title: 'Querying with SELECT', content: `SQL (Structured Query Language) is the standard language for relational databases.

## Basic SELECT
\`\`\`sql
SELECT * FROM students;                        -- all columns
SELECT name, grade FROM students;              -- specific columns
SELECT DISTINCT grade FROM students;           -- unique values
\`\`\`

## Filtering with WHERE
\`\`\`sql
SELECT * FROM students WHERE grade >= 80;
SELECT * FROM students WHERE name = 'Alice';
SELECT * FROM students WHERE grade >= 70 AND grade < 90;
SELECT * FROM students WHERE name IN ('Alice', 'Bob', 'Carol');
SELECT * FROM students WHERE name LIKE 'A%';   -- starts with A
SELECT * FROM students WHERE grade IS NOT NULL;
\`\`\`

## Sorting & Limiting
\`\`\`sql
SELECT * FROM students ORDER BY grade DESC;         -- highest first
SELECT * FROM students ORDER BY name ASC;
SELECT * FROM students ORDER BY grade DESC LIMIT 3; -- top 3
SELECT * FROM students ORDER BY grade DESC LIMIT 3 OFFSET 3; -- page 2
\`\`\`

## Column Aliases
\`\`\`sql
SELECT name AS student_name, grade AS score FROM students;
\`\`\``,
        },
        {
          type: 'code', title: 'SELECT Queries in Practice', code: `-- Given this table:
-- students(id, name, grade, course, enrolled_at)

-- 1. Find all students with grade A (90+)
SELECT name, grade
FROM students
WHERE grade >= 90
ORDER BY grade DESC;

-- 2. Count students per grade range
SELECT
  CASE
    WHEN grade >= 90 THEN 'A'
    WHEN grade >= 80 THEN 'B'
    WHEN grade >= 70 THEN 'C'
    ELSE 'F'
  END AS letter_grade,
  COUNT(*) AS count
FROM students
GROUP BY letter_grade
ORDER BY letter_grade;

-- 3. Students enrolled in 2024, sorted by name
SELECT name, course, enrolled_at
FROM students
WHERE enrolled_at >= '2024-01-01'
  AND enrolled_at < '2025-01-01'
ORDER BY name;

-- 4. Search by partial name
SELECT * FROM students
WHERE name LIKE '%Ali%';`,
        },
        {
          type: 'challenge', title: 'Challenge: Query the Catalog', instructions: `Given a \`courses\` table with columns: \`id\`, \`title\`, \`instructor\`, \`students_enrolled\`, \`rating\`.\n\nWrite SQL to:\n1. Find courses with rating ≥ 4.5 ordered by rating descending\n2. Find courses taught by instructors whose names start with "Dr."\n3. Get the top 5 most enrolled courses`,
          starterCode: `-- 1. Highly rated courses
SELECT title, instructor, rating
FROM courses
WHERE rating >= 4.5
ORDER BY rating DESC;

-- 2. Courses by Dr. instructors
SELECT title, instructor
FROM courses
WHERE instructor LIKE 'Dr.%';

-- 3. Top 5 by enrollment
SELECT title, students_enrolled
FROM courses
ORDER BY students_enrolled DESC
LIMIT 5;`,
          check: (out) => out.includes('SELECT') || out.includes('FROM'),
          hint: 'LIKE patterns: % means any chars, _ means exactly one char',
        },
      ],
    },
    {
      id: 'joins-aggregation', title: 'Joins & Aggregation', icon: '🔗', color: 'purple', xp: 100,
      description: 'Combine tables with JOINs and summarize data with GROUP BY and aggregate functions.',
      sections: [
        {
          type: 'theory', title: 'JOINs and Aggregates', content: `## Types of JOIN
\`\`\`sql
-- INNER JOIN: only matching rows from both tables
SELECT s.name, e.course
FROM students s
INNER JOIN enrollments e ON s.id = e.student_id;

-- LEFT JOIN: all rows from left, matching from right (NULL if no match)
SELECT s.name, e.course
FROM students s
LEFT JOIN enrollments e ON s.id = e.student_id;
-- Students with no enrollments will appear with NULL for course
\`\`\`

## Aggregate Functions
\`\`\`sql
SELECT COUNT(*) FROM students;             -- row count
SELECT AVG(grade) FROM students;           -- average
SELECT MAX(grade), MIN(grade) FROM students;
SELECT SUM(credits) FROM enrollments;
\`\`\`

## GROUP BY + HAVING
\`\`\`sql
-- Average grade per course
SELECT course, AVG(grade) AS avg_grade, COUNT(*) AS enrolled
FROM enrollments
GROUP BY course
HAVING AVG(grade) >= 80    -- filter on aggregate (not WHERE)
ORDER BY avg_grade DESC;
\`\`\``,
        },
        {
          type: 'code', title: 'Multi-table Queries', code: `-- Schema:
-- students(id, name, major)
-- courses(id, title, credits, department)
-- enrollments(student_id, course_id, grade, semester)

-- 1. Student report card (all courses + grades)
SELECT
  s.name,
  c.title AS course,
  e.grade,
  e.semester
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN courses c     ON c.id = e.course_id
WHERE s.name = 'Alice'
ORDER BY e.semester, c.title;

-- 2. GPA per student (weighted by credits)
SELECT
  s.name,
  ROUND(SUM(e.grade * c.credits) / SUM(c.credits), 2) AS gpa
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN courses c     ON c.id = e.course_id
GROUP BY s.id, s.name
ORDER BY gpa DESC;

-- 3. Departments with most enrolled students
SELECT c.department, COUNT(DISTINCT e.student_id) AS students
FROM courses c
JOIN enrollments e ON c.id = e.course_id
GROUP BY c.department
ORDER BY students DESC;`,
        },
        {
          type: 'challenge', title: 'Challenge: Revenue by Category', instructions: `Given \`products(id, name, category, price)\` and \`order_items(id, order_id, product_id, quantity)\`.\n\nWrite a query that shows:\n- \`category\`\n- \`total_revenue\` (sum of price × quantity)\n- \`items_sold\` (total quantity)\n\nOrder by total_revenue descending. Only include categories with revenue > 1000.`,
          starterCode: `SELECT
  p.category,
  SUM(p.price * oi.quantity) AS total_revenue,
  SUM(oi.quantity)           AS items_sold
FROM products p
JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.category
HAVING SUM(p.price * oi.quantity) > 1000
ORDER BY total_revenue DESC;`,
          check: (out) => out.includes('SELECT') || out.includes('GROUP BY'),
          hint: 'Use HAVING (not WHERE) to filter on aggregate results',
        },
      ],
    },
    {
      id: 'schema-design', title: 'Schema Design', icon: '🏗️', color: 'gold', xp: 125,
      description: 'Create tables, define constraints, and understand indexes and normalization.',
      sections: [
        {
          type: 'theory', title: 'Designing a Database Schema', content: `## CREATE TABLE
\`\`\`sql
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,        -- auto-increment integer
  email      VARCHAR(255) UNIQUE NOT NULL,
  username   VARCHAR(50)  UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  role       VARCHAR(20) DEFAULT 'student'
             CHECK (role IN ('student', 'admin'))
);
\`\`\`

## Foreign Keys (Referential Integrity)
\`\`\`sql
CREATE TABLE posts (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      VARCHAR(255) NOT NULL,
  body       TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`
\`ON DELETE CASCADE\` — when user is deleted, their posts are deleted too.

## Indexes
\`\`\`sql
-- Speed up queries that filter on email
CREATE INDEX idx_users_email ON users(email);

-- Composite index for common multi-column query
CREATE INDEX idx_posts_user_date ON posts(user_id, created_at DESC);
\`\`\`

## Normalization
- **1NF**: No repeating groups; each column holds atomic values
- **2NF**: 1NF + no partial dependencies on composite keys
- **3NF**: 2NF + no transitive dependencies (each non-key depends only on the key)`,
        },
        {
          type: 'code', title: 'Complete Schema Example', code: `-- E-commerce database schema

CREATE TABLE customers (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(255) UNIQUE NOT NULL,
  name       VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  sku         VARCHAR(50) UNIQUE NOT NULL,
  name        VARCHAR(255) NOT NULL,
  price       DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  stock       INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category    VARCHAR(100),
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id          SERIAL PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES customers(id),
  status      VARCHAR(20) DEFAULT 'pending'
              CHECK (status IN ('pending','paid','shipped','delivered','cancelled')),
  total       DECIMAL(10, 2),
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id),
  quantity   INT NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,  -- snapshot at time of purchase
  UNIQUE(order_id, product_id)
);

-- Indexes for common queries
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_items_order     ON order_items(order_id);
CREATE INDEX idx_products_cat    ON products(category);`,
        },
        {
          type: 'challenge', title: 'Challenge: Blog Schema', instructions: `Design a SQL schema for a blog with:\n- \`users\` (id, email, display_name, bio, joined_at)\n- \`posts\` (id, author_id→users, title, content, published_at, is_published)\n- \`tags\` (id, name — unique)\n- \`post_tags\` join table (post_id, tag_id — composite PK)\n\nAdd appropriate indexes and constraints.`,
          starterCode: `CREATE TABLE users (
  id           SERIAL PRIMARY KEY,
  email        VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  bio          TEXT,
  joined_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
  id           SERIAL PRIMARY KEY,
  author_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        VARCHAR(255) NOT NULL,
  content      TEXT NOT NULL,
  published_at TIMESTAMP,
  is_published BOOLEAN DEFAULT FALSE
);

CREATE TABLE tags (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE post_tags (
  post_id INT REFERENCES posts(id) ON DELETE CASCADE,
  tag_id  INT REFERENCES tags(id)  ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX idx_posts_author    ON posts(author_id);
CREATE INDEX idx_posts_published ON posts(published_at) WHERE is_published = TRUE;`,
          check: (out) => out.includes('CREATE TABLE') || out.includes('REFERENCES'),
          hint: 'Use a composite PRIMARY KEY for the junction table',
        },
      ],
    },
  ],
};

// ─── Java ─────────────────────────────────────────────────────────────────────
export const JAVA_LEARN = {
  meta: { name: 'Java', emoji: '☕', color: 'orange', layer: 'Expert', description: 'Object-oriented programming, inheritance, interfaces, and collections.' },
  topics: [
    {
      id: 'oop-basics', title: 'OOP Fundamentals', icon: '☕', color: 'cyan', xp: 75,
      description: 'Classes, objects, constructors, encapsulation, and the this keyword.',
      sections: [
        {
          type: 'theory', title: 'Classes & Encapsulation', content: `Java is a **class-based, object-oriented language**. Everything lives inside a class.

## Class Structure
\`\`\`java
public class Student {
  // Fields (private = encapsulated)
  private String name;
  private int grade;
  private static int count = 0;  // shared across all instances

  // Constructor
  public Student(String name, int grade) {
    this.name = name;   // "this" refers to current instance
    this.grade = grade;
    count++;
  }

  // Getters
  public String getName()  { return name; }
  public int    getGrade() { return grade; }

  // Setter with validation
  public void setGrade(int grade) {
    if (grade < 0 || grade > 100) throw new IllegalArgumentException("Grade must be 0-100");
    this.grade = grade;
  }

  // Instance method
  public String getLetterGrade() {
    if (grade >= 90) return "A";
    if (grade >= 80) return "B";
    if (grade >= 70) return "C";
    return "F";
  }

  // toString for readable output
  @Override
  public String toString() {
    return name + " (" + getLetterGrade() + ": " + grade + ")";
  }

  public static int getCount() { return count; }
}
\`\`\``,
        },
        {
          type: 'code', title: 'BankAccount Class', code: `public class BankAccount {
    private String owner;
    private double balance;
    private int transactionCount;

    public BankAccount(String owner, double initialBalance) {
        this.owner = owner;
        this.balance = initialBalance;
        this.transactionCount = 0;
    }

    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
        balance += amount;
        transactionCount++;
    }

    public void withdraw(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
        if (amount > balance) throw new IllegalStateException("Insufficient funds");
        balance -= amount;
        transactionCount++;
    }

    public double getBalance() { return balance; }

    @Override
    public String toString() {
        return String.format("%s: $%.2f (%d txns)", owner, balance, transactionCount);
    }

    public static void main(String[] args) {
        BankAccount acc = new BankAccount("Alice", 1000.00);
        acc.deposit(250.00);
        acc.withdraw(75.50);
        System.out.println(acc);  // Alice: $1174.50 (2 txns)
    }
}`,
        },
        {
          type: 'challenge', title: 'Challenge: Rectangle Class', instructions: `Create a \`Rectangle\` class with:\n- Private fields \`width\` and \`height\` (double)\n- Constructor taking both values\n- Methods: \`area()\`, \`perimeter()\`, \`isSquare()\`\n- \`toString()\` → \`"Rectangle(5.0 x 3.0) area=15.0"\`\n\nTest with two rectangles — one square, one not.`,
          starterCode: `public class Rectangle {
    private double width;
    private double height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    public double area()      { return width * height; }
    public double perimeter() { return 2 * (width + height); }
    public boolean isSquare() { return width == height; }

    @Override
    public String toString() {
        return String.format("Rectangle(%.1f x %.1f) area=%.1f", width, height, area());
    }

    public static void main(String[] args) {
        Rectangle r1 = new Rectangle(5.0, 3.0);
        Rectangle r2 = new Rectangle(4.0, 4.0);
        System.out.println(r1 + " square=" + r1.isSquare());
        System.out.println(r2 + " square=" + r2.isSquare());
    }
}`,
          check: (out) => out.includes('15') && out.includes('16'),
          hint: 'isSquare() checks if width equals height',
        },
      ],
    },
    {
      id: 'inheritance-interfaces', title: 'Inheritance & Interfaces', icon: '🏛️', color: 'purple', xp: 100,
      description: 'Extend classes with inheritance, override methods, and implement interfaces.',
      sections: [
        {
          type: 'theory', title: 'Inheritance & Polymorphism', content: `## Inheritance (extends)
\`\`\`java
public class Animal {
  protected String name;

  public Animal(String name) { this.name = name; }

  public String speak() { return name + " makes a sound"; }

  @Override
  public String toString() { return "Animal: " + name; }
}

public class Dog extends Animal {
  private String breed;

  public Dog(String name, String breed) {
    super(name);           // call parent constructor
    this.breed = breed;
  }

  @Override
  public String speak() { return name + " says: Woof!"; }  // override

  public String fetch() { return name + " (" + breed + ") fetches!"; }
}
\`\`\`

## Interfaces
Interfaces define a **contract** — what a class can do, not how:
\`\`\`java
public interface Drawable {
  void draw();                          // abstract method
  default String getColor() { return "black"; }  // default impl
}

public interface Resizable {
  void resize(double factor);
}

// A class can implement multiple interfaces
public class Circle extends Shape implements Drawable, Resizable {
  @Override public void draw()               { System.out.println("Drawing circle"); }
  @Override public void resize(double f)     { radius *= f; }
}
\`\`\``,
        },
        {
          type: 'code', title: 'Shape Hierarchy', code: `abstract class Shape {
    protected String color;

    public Shape(String color) { this.color = color; }

    public abstract double area();
    public abstract double perimeter();

    @Override
    public String toString() {
        return String.format("%s[color=%s, area=%.2f]", getClass().getSimpleName(), color, area());
    }
}

class Circle extends Shape {
    private double radius;
    public Circle(String color, double radius) { super(color); this.radius = radius; }
    @Override public double area()      { return Math.PI * radius * radius; }
    @Override public double perimeter() { return 2 * Math.PI * radius; }
}

class Rectangle extends Shape {
    private double w, h;
    public Rectangle(String color, double w, double h) { super(color); this.w = w; this.h = h; }
    @Override public double area()      { return w * h; }
    @Override public double perimeter() { return 2 * (w + h); }
}

public class Main {
    public static void main(String[] args) {
        Shape[] shapes = {
            new Circle("red", 5),
            new Rectangle("blue", 4, 6),
            new Circle("green", 3),
        };

        double totalArea = 0;
        for (Shape s : shapes) {
            System.out.println(s);  // polymorphism — correct toString for each type
            totalArea += s.area();
        }
        System.out.printf("Total area: %.2f%n", totalArea);
    }
}`,
        },
        {
          type: 'challenge', title: 'Challenge: Sortable Interface', instructions: `Define an interface \`Sortable\` with a method \`int compareTo(Sortable other)\`.\nCreate a \`Temperature\` class (double celsius) that implements \`Sortable\`.\nCreate an array of 4 temperatures and sort them using a simple selection sort that uses \`compareTo\`.\nPrint the sorted temperatures.`,
          starterCode: `interface Sortable {
    int compareTo(Sortable other);
}

class Temperature implements Sortable {
    private double celsius;
    public Temperature(double celsius) { this.celsius = celsius; }
    public double getCelsius() { return celsius; }

    @Override
    public int compareTo(Sortable other) {
        Temperature t = (Temperature) other;
        return Double.compare(this.celsius, t.celsius);
    }

    @Override
    public String toString() { return celsius + "°C"; }
}

public class Main {
    public static void main(String[] args) {
        Temperature[] temps = {
            new Temperature(23.5),
            new Temperature(-5.0),
            new Temperature(37.2),
            new Temperature(15.0),
        };

        // Selection sort using compareTo
        for (int i = 0; i < temps.length - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < temps.length; j++) {
                if (temps[j].compareTo(temps[minIdx]) < 0) minIdx = j;
            }
            Temperature tmp = temps[minIdx]; temps[minIdx] = temps[i]; temps[i] = tmp;
        }

        for (Temperature t : temps) System.out.println(t);
    }
}`,
          check: (out) => out.includes('-5') && out.includes('37'),
          hint: 'compareTo returns negative if this < other, 0 if equal, positive if this > other',
        },
      ],
    },
    {
      id: 'collections', title: 'Collections & Generics', icon: '📦', color: 'gold', xp: 100,
      description: 'ArrayList, HashMap, HashSet, and iterating collections with Java generics.',
      sections: [
        {
          type: 'theory', title: 'Java Collections Framework', content: `## Key Interfaces & Classes
| Interface | Implementation | Use When |
|-----------|---------------|----------|
| \`List<E>\`  | \`ArrayList\`, \`LinkedList\`  | Ordered, allows duplicates |
| \`Set<E>\`   | \`HashSet\`, \`TreeSet\`       | No duplicates |
| \`Map<K,V>\` | \`HashMap\`, \`TreeMap\`       | Key-value pairs |
| \`Queue<E>\` | \`LinkedList\`, \`ArrayDeque\` | FIFO processing |

\`\`\`java
import java.util.*;

// List
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.get(0);           // "Alice"
names.remove("Bob");
Collections.sort(names);

// HashMap
Map<String, Integer> scores = new HashMap<>();
scores.put("Alice", 95);
scores.getOrDefault("Bob", 0);  // 0 if not found
scores.containsKey("Alice");     // true

// Iterate with entrySet
for (Map.Entry<String, Integer> e : scores.entrySet()) {
  System.out.println(e.getKey() + ": " + e.getValue());
}

// HashSet
Set<String> unique = new HashSet<>(names);
unique.add("Alice");  // no duplicate added
\`\`\``,
        },
        {
          type: 'code', title: 'Word Frequency Counter', code: `import java.util.*;

public class WordCounter {
    public static Map<String, Integer> countWords(String text) {
        Map<String, Integer> freq = new HashMap<>();
        String[] words = text.toLowerCase().split("[^a-zA-Z]+");

        for (String word : words) {
            if (!word.isEmpty()) {
                freq.merge(word, 1, Integer::sum);  // elegant one-liner
            }
        }
        return freq;
    }

    public static void main(String[] args) {
        String text = "to be or not to be that is the question to be";
        Map<String, Integer> freq = countWords(text);

        // Sort by frequency (descending), then alphabetically
        freq.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed()
                .thenComparing(Map.Entry.comparingByKey()))
            .limit(5)
            .forEach(e -> System.out.println(e.getKey() + ": " + e.getValue()));
    }
}
// Output:
// be: 3
// to: 3
// is: 1
// not: 1
// or: 1`,
        },
        {
          type: 'challenge', title: 'Challenge: Student Registry', instructions: `Build a \`StudentRegistry\` class backed by a \`HashMap<Integer, String>\` (id → name).\n\nMethods:\n- \`register(int id, String name)\` — add (throw if id exists)\n- \`lookup(int id): String\` — return name (throw if not found)\n- \`remove(int id)\`\n- \`getAllSorted(): List<String>\` — all names alphabetically\n\nTest with 4 students.`,
          starterCode: `import java.util.*;

class StudentRegistry {
    private Map<Integer, String> registry = new HashMap<>();

    public void register(int id, String name) {
        if (registry.containsKey(id)) throw new IllegalArgumentException("ID exists: " + id);
        registry.put(id, name);
    }

    public String lookup(int id) {
        String name = registry.get(id);
        if (name == null) throw new NoSuchElementException("Not found: " + id);
        return name;
    }

    public void remove(int id) { registry.remove(id); }

    public List<String> getAllSorted() {
        List<String> names = new ArrayList<>(registry.values());
        Collections.sort(names);
        return names;
    }
}

public class Main {
    public static void main(String[] args) {
        StudentRegistry reg = new StudentRegistry();
        reg.register(1001, "Carol");
        reg.register(1002, "Alice");
        reg.register(1003, "Dave");
        reg.register(1004, "Bob");

        System.out.println(reg.lookup(1002));     // Alice
        System.out.println(reg.getAllSorted());    // [Alice, Bob, Carol, Dave]
        reg.remove(1003);
        System.out.println(reg.getAllSorted());    // [Alice, Bob, Carol]
    }
}`,
          check: (out) => out.includes('Alice') && out.includes('Bob'),
          hint: 'Use registry.containsKey() to check before put()',
        },
      ],
    },
  ],
};

// ─── Data Structures & Algorithms ────────────────────────────────────────────
export const DSA_LEARN = {
  meta: { name: 'Data Structures', emoji: '🧩', color: 'purple', layer: 'Expert', description: 'Big-O, arrays, linked lists, trees, sorting, and searching algorithms.' },
  topics: [
    {
      id: 'big-o-arrays', title: 'Big-O & Arrays', icon: '📊', color: 'cyan', xp: 75,
      description: 'Time and space complexity, array patterns (two pointers, sliding window).',
      sections: [
        {
          type: 'theory', title: 'Big-O Complexity', content: `Big-O notation describes how an algorithm's **time or space grows** as input size \`n\` grows.

## Common Complexities (best → worst)
| Notation   | Name        | Example                         |
|------------|-------------|----------------------------------|
| O(1)       | Constant    | Array index, hash lookup         |
| O(log n)   | Logarithmic | Binary search                    |
| O(n)       | Linear      | Single loop through array        |
| O(n log n) | Linearithmic| Merge sort, heapsort             |
| O(n²)      | Quadratic   | Nested loops (bubble sort)       |
| O(2ⁿ)      | Exponential | Recursive Fibonacci (naive)      |

## Two-Pointer Technique
Solves many array problems in O(n) instead of O(n²):
\`\`\`python
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        total = nums[left] + nums[right]
        if total == target: return [left, right]
        elif total < target: left += 1
        else: right -= 1
    return []
\`\`\`

## Sliding Window
Process a "window" of elements without restarting from scratch:
\`\`\`python
def max_sum_subarray(nums, k):
    window = sum(nums[:k])
    max_sum = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]   # slide right
        max_sum = max(max_sum, window)
    return max_sum
\`\`\``,
        },
        {
          type: 'code', title: 'Array Patterns', code: `# Pattern 1: Two-pointer — check if array has pair summing to target
def has_pair(nums, target):
    seen = set()
    for n in nums:
        if target - n in seen:
            return True
        seen.add(n)
    return False

print(has_pair([2, 7, 11, 15], 9))   # True  (2+7)
print(has_pair([3, 5, 8, 12], 10))   # False

# Pattern 2: Sliding window — longest substring without repeating chars
def longest_unique(s):
    seen = {}
    left = max_len = 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1
        seen[ch] = right
        max_len = max(max_len, right - left + 1)
    return max_len

print(longest_unique("abcabcbb"))  # 3 ("abc")
print(longest_unique("pwwkew"))    # 3 ("wke")

# Pattern 3: Prefix sum — range query in O(1) after O(n) build
def build_prefix(nums):
    prefix = [0] * (len(nums) + 1)
    for i, n in enumerate(nums):
        prefix[i+1] = prefix[i] + n
    return prefix

def range_sum(prefix, l, r):
    return prefix[r+1] - prefix[l]

p = build_prefix([2, 4, 1, 7, 3])
print(range_sum(p, 1, 3))  # 12 (4+1+7)`,
        },
        {
          type: 'challenge', title: 'Challenge: Move Zeros', instructions: `Given an array, move all zeros to the end while maintaining the relative order of non-zero elements.\nDo it **in-place** in O(n) time using the two-pointer technique.\n\nExample: \`[0, 1, 0, 3, 12]\` → \`[1, 3, 12, 0, 0]\``,
          starterCode: `def move_zeros(nums):
    write = 0  # position to write next non-zero
    for read in range(len(nums)):
        if nums[read] != 0:
            nums[write] = nums[read]
            write += 1
    # fill remaining with zeros
    while write < len(nums):
        nums[write] = 0
        write += 1
    return nums

print(move_zeros([0, 1, 0, 3, 12]))  # [1, 3, 12, 0, 0]
print(move_zeros([0, 0, 1]))          # [1, 0, 0]
print(move_zeros([1, 2, 3]))          # [1, 2, 3]`,
          check: (out) => out.includes('[1, 3, 12, 0, 0]') || out.includes('1, 3, 12'),
          hint: 'Use a write pointer: whenever you find a non-zero, put it at write position then advance write',
        },
      ],
    },
    {
      id: 'linked-lists', title: 'Linked Lists', icon: '🔗', color: 'purple', xp: 100,
      description: 'Singly and doubly linked lists — nodes, traversal, insertion, deletion.',
      sections: [
        {
          type: 'theory', title: 'Linked List Fundamentals', content: `A linked list is a sequence of **nodes**, each containing data and a pointer to the next node.

## vs Array
| Operation  | Array    | Linked List |
|------------|----------|-------------|
| Access by index | O(1) | O(n)    |
| Insert/delete at head | O(n) | O(1) |
| Insert/delete at tail | O(1) | O(n) (or O(1) with tail ptr) |
| Memory     | Contiguous | Scattered  |

## Structure
\`\`\`python
class Node:
    def __init__(self, val):
        self.val = val
        self.next = None  # (and self.prev for doubly-linked)

class LinkedList:
    def __init__(self):
        self.head = None
\`\`\`

## Common Techniques
\`\`\`python
# Fast/slow pointer — detect cycle, find middle
slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
# slow is at the middle
\`\`\`

## Key Operations
- **Reverse**: keep track of prev, curr, next — one pass O(n)
- **Find kth from end**: two-pointer, k apart, advance together
- **Merge sorted**: compare heads, advance the smaller`,
        },
        {
          type: 'code', title: 'Linked List Implementation', code: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
        self.size = 0

    def append(self, val):
        node = Node(val)
        if not self.head:
            self.head = node
        else:
            cur = self.head
            while cur.next:
                cur = cur.next
            cur.next = node
        self.size += 1

    def prepend(self, val):
        node = Node(val)
        node.next = self.head
        self.head = node
        self.size += 1

    def delete(self, val):
        if not self.head: return
        if self.head.val == val:
            self.head = self.head.next
            self.size -= 1
            return
        cur = self.head
        while cur.next and cur.next.val != val:
            cur = cur.next
        if cur.next:
            cur.next = cur.next.next
            self.size -= 1

    def reverse(self):
        prev, cur = None, self.head
        while cur:
            nxt = cur.next
            cur.next = prev
            prev = cur
            cur = nxt
        self.head = prev

    def to_list(self):
        result, cur = [], self.head
        while cur:
            result.append(cur.val)
            cur = cur.next
        return result

ll = LinkedList()
for v in [1, 2, 3, 4, 5]: ll.append(v)
print(ll.to_list())   # [1, 2, 3, 4, 5]
ll.reverse()
print(ll.to_list())   # [5, 4, 3, 2, 1]
ll.delete(3)
print(ll.to_list())   # [5, 4, 2, 1]`,
        },
        {
          type: 'challenge', title: 'Challenge: Detect Cycle', instructions: `Implement \`has_cycle(head)\` using Floyd's fast/slow pointer algorithm.\n\nIf the linked list has a cycle, return \`True\`. Otherwise return \`False\`.\n\nTest with:\n1. A list with no cycle: 1→2→3→None\n2. A list with a cycle: 1→2→3→4→(back to 2)`,
          starterCode: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False

# Test 1: no cycle
a = Node(1); b = Node(2); c = Node(3)
a.next = b; b.next = c
print(has_cycle(a))  # False

# Test 2: cycle 1→2→3→4→2
p = Node(1); q = Node(2); r = Node(3); s = Node(4)
p.next = q; q.next = r; r.next = s; s.next = q  # cycle!
print(has_cycle(p))  # True`,
          check: (out) => out.includes('False') && out.includes('True'),
          hint: "If slow and fast meet, there's a cycle. If fast reaches None, there isn't.",
        },
      ],
    },
    {
      id: 'trees-sorting', title: 'Trees & Sorting', icon: '🌳', color: 'gold', xp: 125,
      description: 'Binary trees, BST, DFS/BFS traversal, and merge sort / binary search.',
      sections: [
        {
          type: 'theory', title: 'Trees & Classic Algorithms', content: `## Binary Tree
Each node has at most 2 children (left and right).

## Binary Search Tree (BST)
Left subtree values < node value < right subtree values. Enables O(log n) search.

## Tree Traversals (DFS)
\`\`\`python
def inorder(node):   # left, root, right — gives sorted order in BST
    if not node: return []
    return inorder(node.left) + [node.val] + inorder(node.right)

def preorder(node):  # root, left, right — useful for copying
    if not node: return []
    return [node.val] + preorder(node.left) + preorder(node.right)

def postorder(node): # left, right, root — useful for deletion
    if not node: return []
    return postorder(node.left) + postorder(node.right) + [node.val]
\`\`\`

## BFS (Level Order)
\`\`\`python
from collections import deque
def bfs(root):
    if not root: return []
    q, result = deque([root]), []
    while q:
        node = q.popleft()
        result.append(node.val)
        if node.left:  q.append(node.left)
        if node.right: q.append(node.right)
    return result
\`\`\`

## Merge Sort — O(n log n)
Divide array in half recursively, then merge sorted halves:
\`\`\`python
def merge_sort(arr):
    if len(arr) <= 1: return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)
\`\`\``,
        },
        {
          type: 'code', title: 'BST Implementation', code: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        def _ins(node, val):
            if not node: return TreeNode(val)
            if val < node.val: node.left  = _ins(node.left,  val)
            elif val > node.val: node.right = _ins(node.right, val)
            return node
        self.root = _ins(self.root, val)

    def search(self, val):
        cur = self.root
        while cur:
            if val == cur.val: return True
            cur = cur.left if val < cur.val else cur.right
        return False

    def inorder(self):
        result = []
        def _inorder(node):
            if node:
                _inorder(node.left)
                result.append(node.val)
                _inorder(node.right)
        _inorder(self.root)
        return result

    def height(self):
        def _h(node):
            if not node: return 0
            return 1 + max(_h(node.left), _h(node.right))
        return _h(self.root)

bst = BST()
for v in [5, 3, 7, 1, 4, 6, 8]:
    bst.insert(v)

print(bst.inorder())    # [1, 3, 4, 5, 6, 7, 8]
print(bst.search(4))    # True
print(bst.search(9))    # False
print(bst.height())     # 3`,
        },
        {
          type: 'challenge', title: 'Challenge: Binary Search', instructions: `Implement \`binary_search(nums, target)\` that returns the **index** of the target in a sorted array, or \`-1\` if not found.\n\nTime complexity must be O(log n).\n\nThen implement \`binary_search_first(nums, target)\` that returns the index of the **first occurrence** of target (the array may have duplicates).`,
          starterCode: `def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target: return mid
        elif nums[mid] < target: left = mid + 1
        else: right = mid - 1
    return -1

def binary_search_first(nums, target):
    left, right, result = 0, len(nums) - 1, -1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            result = mid
            right = mid - 1  # keep looking left
        elif nums[mid] < target: left = mid + 1
        else: right = mid - 1
    return result

arr = [1, 3, 5, 7, 9, 11, 13]
print(binary_search(arr, 7))       # 3
print(binary_search(arr, 6))       # -1

dup = [1, 2, 2, 2, 3, 4]
print(binary_search_first(dup, 2)) # 1`,
          check: (out) => out.includes('3') && out.includes('-1') && out.includes('1'),
          hint: 'For first occurrence, when you find target, save mid and continue searching left',
        },
      ],
    },
  ],
};
