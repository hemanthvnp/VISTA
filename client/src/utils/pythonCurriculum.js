/** @fileoverview Python learning curriculum - 12 topics with theory, code examples, and challenges */

export const PYTHON_TOPICS = [
    {
        id: 'variables',
        title: 'Variables & Types',
        icon: '📦',
        color: 'cyan',
        description: 'Learn how Python stores data — integers, floats, strings, and booleans.',
        xp: 50,
        sections: [
            {
                type: 'theory',
                title: 'What are Variables?',
                content: `A **variable** is a named container that stores a value. Python is **dynamically typed** — you don't need to declare the type.

## Basic Types
- \`int\` — whole numbers: \`42\`, \`-7\`
- \`float\` — decimals: \`3.14\`, \`-0.5\`
- \`str\` — text: \`"hello"\`, \`'world'\`
- \`bool\` — \`True\` or \`False\`

## Checking Types
Use \`type()\` to inspect any value:
\`\`\`python
x = 42
print(type(x))  # <class 'int'>
\`\`\`

## Multiple Assignment
\`\`\`python
a, b, c = 1, 2, 3
name = age = "same"
\`\`\``,
            },
            {
                type: 'code',
                title: 'Variables in Action',
                code: `# Variables & type inspection
name = "Shane"
age = 22
height = 1.82
is_coder = True

print(f"Name: {name}")
print(f"Age: {age} (type: {type(age).__name__})")
print(f"Height: {height}m")
print(f"Is coder: {is_coder}")

# Multiple assignment
x, y, z = 10, 20, 30
print(f"Sum: {x + y + z}")`,
            },
            {
                type: 'challenge',
                title: 'Challenge: Build a Profile',
                instructions: `Create 3 variables:
- \`username\` = your name (string)
- \`level\` = 1 (integer)  
- \`power\` = 9000.1 (float)

Then print: **"Player: Shane | Level: 1 | Power: 9000.1"**
(replace Shane with your username)`,
                starterCode: `# Define your variables here
username = 
level = 
power = 

# Print the profile line
print(f"")`,
                check: (output) => /Player:.*\|.*Level:.*\|.*Power:/.test(output),
                hint: 'Use an f-string: f"Player: {username} | Level: {level} | Power: {power}"',
            },
        ],
    },

    {
        id: 'strings',
        title: 'Strings & Formatting',
        icon: '📝',
        color: 'purple',
        description: 'Master Python strings — slicing, methods, and f-string formatting.',
        xp: 50,
        sections: [
            {
                type: 'theory',
                title: 'Working with Strings',
                content: `Strings in Python are **sequences of characters**. They support powerful operations.

## Creating Strings
\`\`\`python
single = 'Hello'
double = "World"
multi  = """Line 1
Line 2"""
\`\`\`

## Key String Methods
| Method | Result |
|--------|--------|
| \`.upper()\` | "HELLO" |
| \`.lower()\` | "hello" |
| \`.strip()\` | removes whitespace |
| \`.split(",")\` | splits into list |
| \`.replace(a, b)\` | replaces substring |
| \`.startswith()\` | returns bool |

## Slicing
\`\`\`python
s = "Python"
s[0]    # 'P'
s[-1]   # 'n'
s[1:4]  # 'yth'
s[::-1] # 'nohtyP' (reversed)
\`\`\`

## f-Strings (Python 3.6+)
\`\`\`python
name = "Shane"
score = 9000
print(f"{name} scored {score:,} points!")
\`\`\``,
            },
            {
                type: 'code',
                title: 'String Operations',
                code: `text = "  Hello, Python World!  "

# Cleaning
clean = text.strip()
print(f"Cleaned: '{clean}'")

# Case
print(clean.upper())
print(clean.lower())

# Slicing
print(f"First 5: {clean[:5]}")
print(f"Reversed: {clean[::-1]}")

# Split and join
words = clean.split()
print(f"Words: {words}")
print(f"Joined: {'-'.join(words)}")

# f-string formatting
pi = 3.14159265
print(f"Pi = {pi:.2f}")
print(f"Count: {1000000:,}")`,
            },
            {
                type: 'challenge',
                title: 'Challenge: Caesar Cipher',
                instructions: `Write a function \`encode(text, shift)\` that shifts each letter by \`shift\` positions.

Example: \`encode("abc", 1)\` → \`"bcd"\`

Print the result of \`encode("hello", 3)\` — it should output: **khoor**`,
                starterCode: `def encode(text, shift):
    result = ""
    for char in text:
        if char.isalpha():
            base = ord('a') if char.islower() else ord('A')
            result += chr((ord(char) - base + shift) % 26 + base)
        else:
            result += char
    return result

# Test it
print(encode("hello", 3))`,
                check: (output) => output.trim().includes('khoor'),
                hint: 'The output should contain "khoor". Make sure you call print(encode("hello", 3))',
            },
        ],
    },

    {
        id: 'lists',
        title: 'Lists & Tuples',
        icon: '📋',
        color: 'gold',
        description: 'Store ordered collections of items and manipulate them with Python\'s powerful list API.',
        xp: 75,
        sections: [
            {
                type: 'theory',
                title: 'Lists and Tuples',
                content: `**Lists** are ordered, mutable sequences. **Tuples** are ordered but immutable.

## Creating
\`\`\`python
fruits = ["apple", "banana", "cherry"]
coords = (10, 20)       # tuple — can't change
empty  = []
\`\`\`

## List Operations
\`\`\`python
fruits.append("date")       # add to end
fruits.insert(1, "avocado") # insert at index
fruits.remove("banana")     # remove by value
popped = fruits.pop()       # remove last
fruits.sort()               # sort in-place
fruits.reverse()            # reverse in-place
\`\`\`

## Slicing (same as strings)
\`\`\`python
nums = [0, 1, 2, 3, 4, 5]
nums[1:4]   # [1, 2, 3]
nums[::2]   # [0, 2, 4]  — every 2nd
nums[::-1]  # reversed
\`\`\`

## Useful Built-ins
\`\`\`python
len(nums)       # 6
sum(nums)       # 15
min(nums)       # 0
max(nums)       # 5
sorted(nums)    # new sorted list
enumerate(nums) # (index, value) pairs
\`\`\``,
            },
            {
                type: 'code',
                title: 'List Manipulation',
                code: `# Build a leaderboard
scores = [85, 62, 91, 77, 95, 88]

print(f"Players: {len(scores)}")
print(f"Top score: {max(scores)}")
print(f"Average: {sum(scores)/len(scores):.1f}")

# Sort descending
ranked = sorted(scores, reverse=True)
print(f"Ranking: {ranked}")

# Enumerate for positions
print("\nLeaderboard:")
for rank, score in enumerate(ranked, 1):
    medal = ["🥇","🥈","🥉"][rank-1] if rank <= 3 else "  "
    print(f"  {medal} #{rank}: {score} pts")

# Slice - top 3
top3 = ranked[:3]
print(f"\nTop 3: {top3}")`,
            },
            {
                type: 'challenge',
                title: 'Challenge: Remove Duplicates',
                instructions: `Given the list \`nums = [1, 2, 2, 3, 4, 4, 4, 5]\`:
1. Remove duplicates while preserving order
2. Print: **"Unique: [1, 2, 3, 4, 5]"**

Hint: use \`seen = set()\` to track what you've printed.`,
                starterCode: `nums = [1, 2, 2, 3, 4, 4, 4, 5]

seen = set()
unique = []
for n in nums:
    if n not in seen:
        unique.append(n)
        seen.add(n)

print(f"Unique: {unique}")`,
                check: (output) => output.includes('[1, 2, 3, 4, 5]'),
                hint: 'Your output should be: Unique: [1, 2, 3, 4, 5]',
            },
        ],
    },

    {
        id: 'dicts',
        title: 'Dictionaries & Sets',
        icon: '🗂️',
        color: 'orange',
        description: 'Use key-value pairs to map data and sets for fast membership testing.',
        xp: 75,
        sections: [
            {
                type: 'theory',
                title: 'Dicts and Sets',
                content: `**Dictionaries** store key→value pairs. Keys must be unique and immutable. **Sets** store unique values with no order.

## Dictionary Basics
\`\`\`python
user = {
    "name": "Shane",
    "xp": 1500,
    "active": True,
}
user["rank"] = "Pro"        # add/update
del user["active"]          # delete
val = user.get("level", 0)  # safe get with default
\`\`\`

## Iterating
\`\`\`python
for key in user:            # keys
for val in user.values():   # values
for k, v in user.items():   # both
\`\`\`

## Dict Comprehension
\`\`\`python
squares = {x: x**2 for x in range(5)}
# {0:0, 1:1, 2:4, 3:9, 4:16}
\`\`\`

## Sets
\`\`\`python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
a | b   # union    → {1,2,3,4,5,6}
a & b   # intersect → {3,4}
a - b   # difference → {1,2}
\`\`\``,
            },
            {
                type: 'code',
                title: 'Dict Operations',
                code: `# Word frequency counter
text = "the quick brown fox jumps over the lazy fox"
words = text.split()

freq = {}
for word in words:
    freq[word] = freq.get(word, 0) + 1

print("Word frequencies:")
for word, count in sorted(freq.items(), key=lambda x: -x[1]):
    print(f"  '{word}': {count}")

# Dict comprehension
squares = {n: n**2 for n in range(1, 6)}
print(f"\nSquares: {squares}")

# Sets - unique words
unique_words = set(words)
print(f"Unique words: {len(unique_words)}")`,
            },
            {
                type: 'challenge',
                title: 'Challenge: Inventory System',
                instructions: `Create an inventory dict with: \`{"sword": 1, "shield": 2, "potion": 5}\`

Then:
1. Add \`"arrow": 50\`
2. Use up 2 potions: \`inventory["potion"] -= 2\`
3. Print each item as: **"sword: 1"** (one per line)`,
                starterCode: `inventory = {"sword": 1, "shield": 2, "potion": 5}

# Add arrows
inventory["arrow"] = 50

# Use potions
inventory["potion"] -= 2

# Print inventory
for item, qty in inventory.items():
    print(f"{item}: {qty}")`,
                check: (output) => output.includes('sword: 1') && output.includes('potion: 3') && output.includes('arrow: 50'),
                hint: 'Make sure you print all 4 items with the updated quantities.',
            },
        ],
    },

    {
        id: 'control-flow',
        title: 'Control Flow',
        icon: '🔀',
        color: 'magenta',
        description: 'Master if/elif/else, for/while loops, break, continue, and the walrus operator.',
        xp: 75,
        sections: [
            {
                type: 'theory',
                title: 'Conditionals & Loops',
                content: `## If / Elif / Else
\`\`\`python
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
\`\`\`

## Ternary (one-line if)
\`\`\`python
status = "pass" if score >= 60 else "fail"
\`\`\`

## For Loops
\`\`\`python
for i in range(5):          # 0,1,2,3,4
for i in range(2, 10, 2):   # 2,4,6,8
for item in my_list: ...
for i, item in enumerate(my_list): ...
\`\`\`

## While Loops
\`\`\`python
count = 0
while count < 5:
    count += 1
\`\`\`

## Break, Continue, Else
\`\`\`python
for n in range(10):
    if n == 3: continue   # skip
    if n == 7: break      # stop
else:
    print("loop finished") # runs if no break
\`\`\``,
            },
            {
                type: 'code',
                title: 'FizzBuzz + Pattern',
                code: `# Classic FizzBuzz
for n in range(1, 21):
    if n % 15 == 0:
        print("FizzBuzz")
    elif n % 3 == 0:
        print("Fizz")
    elif n % 5 == 0:
        print("Buzz")
    else:
        print(n)

print()

# Triangle pattern
for row in range(1, 6):
    print("★ " * row)`,
            },
            {
                type: 'challenge',
                title: 'Challenge: Prime Finder',
                instructions: `Print all prime numbers from 2 to 30, each on its own line.

A prime has no divisors other than 1 and itself. Use a \`for\` loop with a helper check.

Expected first few lines: **2, 3, 5, 7, 11...**`,
                starterCode: `def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

for n in range(2, 31):
    if is_prime(n):
        print(n)`,
                check: (output) => ['2', '3', '5', '7', '11', '13', '17', '19', '23', '29'].every(p => output.includes(p)),
                hint: 'Make sure all primes from 2 to 29 appear in the output.',
            },
        ],
    },

    {
        id: 'functions',
        title: 'Functions',
        icon: '⚡',
        color: 'cyan',
        description: 'Write reusable blocks of logic with args, defaults, *args, **kwargs, and lambdas.',
        xp: 100,
        sections: [
            {
                type: 'theory',
                title: 'Defining Functions',
                content: `## Basic Function
\`\`\`python
def greet(name):
    return f"Hello, {name}!"
\`\`\`

## Default Arguments
\`\`\`python
def power(base, exp=2):
    return base ** exp

power(3)     # 9
power(3, 3)  # 27
\`\`\`

## *args and **kwargs
\`\`\`python
def total(*args):
    return sum(args)

total(1, 2, 3, 4)  # 10

def profile(**kwargs):
    for k, v in kwargs.items():
        print(f"{k}: {v}")

profile(name="Shane", xp=1500)
\`\`\`

## Lambda Functions
\`\`\`python
double = lambda x: x * 2
square = lambda x: x ** 2

nums = [3, 1, 4, 1, 5]
nums.sort(key=lambda x: -x)  # sort descending
\`\`\`

## Type Hints (Python 3.5+)
\`\`\`python
def add(a: int, b: int) -> int:
    return a + b
\`\`\``,
            },
            {
                type: 'code',
                title: 'Functions Deep Dive',
                code: `# Default args
def create_player(name, hp=100, level=1):
    return {"name": name, "hp": hp, "level": level}

p1 = create_player("Shane")
p2 = create_player("Alice", hp=150, level=5)
print(p1)
print(p2)

# *args
def battle(*players):
    print(f"\nBattle with {len(players)} players:")
    for p in players:
        print(f"  {p['name']} (HP: {p['hp']}, Lvl: {p['level']})")

battle(p1, p2)

# Lambda + sorted
players = [p1, p2, create_player("Bob", level=3)]
ranked = sorted(players, key=lambda p: p["level"], reverse=True)
print("\nRanking by level:")
for i, p in enumerate(ranked, 1):
    print(f"  #{i} {p['name']}")`,
            },
            {
                type: 'challenge',
                title: 'Challenge: Calculator',
                instructions: `Write a function \`calc(a, b, op)\` that:
- \`op="add"\` → returns a + b
- \`op="mul"\` → returns a * b
- \`op="pow"\` → returns a ** b

Print the results of:
- \`calc(10, 5, "add")\` → **15**
- \`calc(10, 5, "mul")\` → **50**
- \`calc(2, 8, "pow")\` → **256**`,
                starterCode: `def calc(a, b, op):
    if op == "add":
        return a + b
    elif op == "mul":
        return a * b
    elif op == "pow":
        return a ** b

print(calc(10, 5, "add"))
print(calc(10, 5, "mul"))
print(calc(2, 8, "pow"))`,
                check: (out) => out.includes('15') && out.includes('50') && out.includes('256'),
                hint: 'Output should contain 15, 50, and 256 on separate lines.',
            },
        ],
    },

    {
        id: 'classes',
        title: 'Classes & OOP',
        icon: '🏗️',
        color: 'purple',
        description: 'Object-oriented programming — classes, instances, inheritance, and dunder methods.',
        xp: 100,
        sections: [
            {
                type: 'theory',
                title: 'Object-Oriented Python',
                content: `## Defining a Class
\`\`\`python
class Dog:
    species = "Canis lupus"   # class attribute
    
    def __init__(self, name, age):
        self.name = name      # instance attribute
        self.age = age
    
    def bark(self):
        return f"{self.name} says Woof!"
    
    def __repr__(self):
        return f"Dog('{self.name}', {self.age})"

rex = Dog("Rex", 3)
print(rex.bark())
\`\`\`

## Inheritance
\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return "..."

class Cat(Animal):
    def speak(self):          # override
        return "Meow!"
    
class Dog(Animal):
    def speak(self):
        return "Woof!"
\`\`\`

## Dunder (Magic) Methods
| Method | Purpose |
|--------|---------|
| \`__init__\` | constructor |
| \`__repr__\` | debug string |
| \`__str__\` | print string |
| \`__len__\` | \`len(obj)\` |
| \`__add__\` | \`obj + other\` |`,
            },
            {
                type: 'code',
                title: 'RPG Character System',
                code: `class Character:
    def __init__(self, name, hp, attack):
        self.name = name
        self.hp = hp
        self.max_hp = hp
        self.attack = attack
        self.alive = True

    def take_damage(self, dmg):
        self.hp = max(0, self.hp - dmg)
        if self.hp == 0:
            self.alive = False

    def heal(self, amount):
        self.hp = min(self.max_hp, self.hp + amount)

    def __repr__(self):
        bar = "█" * (self.hp // 10) + "░" * ((self.max_hp - self.hp) // 10)
        return f"{self.name:10} HP [{bar}] {self.hp}/{self.max_hp}"

class Mage(Character):
    def __init__(self, name):
        super().__init__(name, hp=80, attack=40)
        self.mana = 100

class Warrior(Character):
    def __init__(self, name):
        super().__init__(name, hp=150, attack=25)

hero = Warrior("Shane")
boss = Mage("Dragon")

print("=== BATTLE ===")
print(hero)
print(boss)

hero.take_damage(boss.attack)
boss.take_damage(hero.attack)

print("\nAfter round 1:")
print(hero)
print(boss)`,
            },
            {
                type: 'challenge',
                title: 'Challenge: Stack Class',
                instructions: `Implement a \`Stack\` class with:
- \`push(item)\` — add to top
- \`pop()\` — remove and return top (return None if empty)
- \`peek()\` — see top without removing
- \`size()\` — number of items

Then run:
\`\`\`
s = Stack()
s.push(1); s.push(2); s.push(3)
print(s.pop())   # 3
print(s.peek())  # 2
print(s.size())  # 2
\`\`\``,
                starterCode: `class Stack:
    def __init__(self):
        self._data = []
    
    def push(self, item):
        self._data.append(item)
    
    def pop(self):
        if self._data:
            return self._data.pop()
        return None
    
    def peek(self):
        return self._data[-1] if self._data else None
    
    def size(self):
        return len(self._data)

s = Stack()
s.push(1)
s.push(2)
s.push(3)
print(s.pop())
print(s.peek())
print(s.size())`,
                check: (out) => out.trim().split('\n').slice(0, 3).join('|').includes('3') && out.includes('2'),
                hint: 'Output should be 3, then 2, then 2 on separate lines.',
            },
        ],
    },

    {
        id: 'error-handling',
        title: 'Error Handling',
        icon: '🛡️',
        color: 'orange',
        description: 'Handle exceptions gracefully with try/except/finally and create custom exceptions.',
        xp: 75,
        sections: [
            {
                type: 'theory',
                title: 'Exceptions in Python',
                content: `## Try / Except
\`\`\`python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Can't divide by zero!")
\`\`\`

## Multiple Except Blocks
\`\`\`python
try:
    val = int(input())
    result = 100 / val
except ValueError:
    print("Not a number!")
except ZeroDivisionError:
    print("Can't be zero!")
except Exception as e:
    print(f"Unexpected: {e}")
else:
    print(f"Result: {result}")    # runs if no error
finally:
    print("Always runs")          # cleanup
\`\`\`

## Common Built-in Exceptions
| Exception | When |
|-----------|------|
| \`ValueError\` | wrong value type |
| \`TypeError\` | wrong data type |
| \`KeyError\` | dict key missing |
| \`IndexError\` | list index out of range |
| \`FileNotFoundError\` | file doesn't exist |

## Custom Exceptions
\`\`\`python
class InsufficientFundsError(Exception):
    def __init__(self, amount, balance):
        super().__init__(f"Need {amount}, have {balance}")
\`\`\``,
            },
            {
                type: 'code',
                title: 'Safe Operations',
                code: `class GameError(Exception):
    pass

class InsufficientHPError(GameError):
    def __init__(self, required, current):
        super().__init__(f"Need {required} HP, only have {current}")

def use_skill(player_hp, skill_cost):
    if player_hp < skill_cost:
        raise InsufficientHPError(skill_cost, player_hp)
    return player_hp - skill_cost

# Safe division
def safe_divide(a, b):
    try:
        return round(a / b, 4)
    except ZeroDivisionError:
        return None
    except TypeError as e:
        raise ValueError(f"Invalid types: {e}")

# Test custom exception
for hp, cost in [(100, 30), (20, 50)]:
    try:
        remaining = use_skill(hp, cost)
        print(f"Skill used! HP left: {remaining}")
    except InsufficientHPError as e:
        print(f"Can't use skill: {e}")

# Safe math
print(safe_divide(10, 3))
print(safe_divide(10, 0))`,
            },
            {
                type: 'challenge',
                title: 'Challenge: Validated Input',
                instructions: `Write a function \`parse_age(s)\` that:
- Converts \`s\` to int
- Raises \`ValueError\` if not numeric
- Raises \`ValueError\` with message "Age must be 0-150" if out of range
- Returns the age if valid

Test calls:
\`\`\`
print(parse_age("22"))     # 22
print(parse_age("200"))    # Age must be 0-150
print(parse_age("abc"))    # invalid literal...
\`\`\``,
                starterCode: `def parse_age(s):
    try:
        age = int(s)
    except ValueError as e:
        print(e)
        return None
    if age < 0 or age > 150:
        print("Age must be 0-150")
        return None
    return age

print(parse_age("22"))
print(parse_age("200"))
print(parse_age("abc"))`,
                check: (out) => out.includes('22') && out.includes('0-150'),
                hint: 'Output should include "22", "Age must be 0-150", and an error message for "abc".',
            },
        ],
    },

    {
        id: 'file-io',
        title: 'File I/O & JSON',
        icon: '💾',
        color: 'gold',
        description: 'Read and write files, work with JSON data, and use context managers.',
        xp: 75,
        sections: [
            {
                type: 'theory',
                title: 'Files and JSON',
                content: `## Reading Files
\`\`\`python
with open("data.txt", "r") as f:
    content = f.read()         # whole file
    lines = f.readlines()      # list of lines

# Iterate line by line (memory efficient)
with open("data.txt") as f:
    for line in f:
        print(line.strip())
\`\`\`

## Writing Files
\`\`\`python
with open("output.txt", "w") as f:   # overwrite
    f.write("Hello\\n")
    f.writelines(["a\\n", "b\\n"])

with open("log.txt", "a") as f:      # append
    f.write("new line\\n")
\`\`\`

## JSON
\`\`\`python
import json

# Python dict → JSON string
data = {"name": "Shane", "xp": 1500}
json_str = json.dumps(data, indent=2)

# JSON string → Python dict
parsed = json.loads(json_str)

# File I/O
with open("user.json", "w") as f:
    json.dump(data, f, indent=2)

with open("user.json") as f:
    data = json.load(f)
\`\`\``,
            },
            {
                type: 'code',
                title: 'JSON Data Processing',
                code: `import json

# Simulate a game save system
save_data = {
    "player": "Shane",
    "level": 5,
    "xp": 2750,
    "inventory": ["sword", "shield", "potion"],
    "achievements": ["first_login", "level_5"]
}

# Serialize to JSON
json_str = json.dumps(save_data, indent=2)
print("Save file contents:")
print(json_str)

# Parse back
loaded = json.loads(json_str)
print(f"\nPlayer: {loaded['player']}")
print(f"Level: {loaded['level']}")
print(f"Items: {', '.join(loaded['inventory'])}")
print(f"Achievements: {len(loaded['achievements'])}")

# Modify and re-serialize
loaded["xp"] += 500
loaded["inventory"].append("magic_wand")
print(f"\nAfter battle - XP: {loaded['xp']}")`,
            },
            {
                type: 'challenge',
                title: 'Challenge: Config Parser',
                instructions: `Given this JSON string, parse it and print each setting as **"key = value"**:

\`\`\`json
{"host": "localhost", "port": 8080, "debug": true, "version": "1.0.0"}
\`\`\`

Expected output (4 lines):
\`\`\`
host = localhost
port = 8080
debug = True
version = 1.0.0
\`\`\``,
                starterCode: `import json

config_str = '{"host": "localhost", "port": 8080, "debug": true, "version": "1.0.0"}'

config = json.loads(config_str)

for key, value in config.items():
    print(f"{key} = {value}")`,
                check: (out) => out.includes('host = localhost') && out.includes('port = 8080') && out.includes('debug = True'),
                hint: 'Loop over config.items() and print each as "key = value".',
            },
        ],
    },

    {
        id: 'comprehensions',
        title: 'Comprehensions',
        icon: '🔬',
        color: 'cyan',
        description: 'Write elegant one-liners with list, dict, set, and generator comprehensions.',
        xp: 100,
        sections: [
            {
                type: 'theory',
                title: 'Python Comprehensions',
                content: `Comprehensions are Pythonic shortcuts for building collections.

## List Comprehension
\`\`\`python
# [expression for item in iterable if condition]
squares = [x**2 for x in range(10)]
evens   = [x for x in range(20) if x % 2 == 0]
\`\`\`

## Dict Comprehension
\`\`\`python
# {key: value for item in iterable}
word_len = {w: len(w) for w in ["python", "is", "great"]}
# {"python": 6, "is": 2, "great": 5}
\`\`\`

## Set Comprehension
\`\`\`python
unique_lengths = {len(w) for w in ["cat", "dog", "hi"]}
# {2, 3}
\`\`\`

## Generator Expression
\`\`\`python
# Like list comprehension but lazy (memory efficient)
gen = (x**2 for x in range(1000000))
print(next(gen))   # 0  — computed on demand
total = sum(x**2 for x in range(10))
\`\`\`

## Nested Comprehension
\`\`\`python
matrix = [[1,2,3],[4,5,6],[7,8,9]]
flat = [n for row in matrix for n in row]
# [1, 2, 3, 4, 5, 6, 7, 8, 9]
\`\`\``,
            },
            {
                type: 'code',
                title: 'Comprehensions in Practice',
                code: `# Data processing pipeline
students = [
    {"name": "Alice", "score": 92},
    {"name": "Bob",   "score": 67},
    {"name": "Carol", "score": 85},
    {"name": "Dave",  "score": 71},
    {"name": "Eve",   "score": 95},
]

# List comp – names of passing students (>=70)
passing = [s["name"] for s in students if s["score"] >= 70]
print(f"Passing: {passing}")

# Dict comp – name: grade
def grade(score):
    return "A" if score >= 90 else "B" if score >= 80 else "C" if score >= 70 else "F"

grades = {s["name"]: grade(s["score"]) for s in students}
print(f"Grades: {grades}")

# Set comp – unique grade letters
grade_set = {grade(s["score"]) for s in students}
print(f"Grades given: {sorted(grade_set)}")

# Generator – average without building list
avg = sum(s["score"] for s in students) / len(students)
print(f"Average: {avg:.1f}")`,
            },
            {
                type: 'challenge',
                title: 'Challenge: Transpose Matrix',
                instructions: `Given a 3×3 matrix, use a **nested list comprehension** to transpose it (swap rows and columns).

\`\`\`python
matrix = [[1,2,3],[4,5,6],[7,8,9]]
\`\`\`

Print the transposed matrix row by row:
\`\`\`
[1, 4, 7]
[2, 5, 8]
[3, 6, 9]
\`\`\``,
                starterCode: `matrix = [[1,2,3],[4,5,6],[7,8,9]]

transposed = [[matrix[row][col] for row in range(3)] for col in range(3)]

for row in transposed:
    print(row)`,
                check: (out) => out.includes('[1, 4, 7]') && out.includes('[2, 5, 8]') && out.includes('[3, 6, 9]'),
                hint: 'Output should be 3 rows: [1,4,7], [2,5,8], [3,6,9]',
            },
        ],
    },

    {
        id: 'decorators',
        title: 'Decorators & Closures',
        icon: '🎨',
        color: 'purple',
        description: 'Wrap functions with decorators and capture state with closures.',
        xp: 125,
        sections: [
            {
                type: 'theory',
                title: 'Closures and Decorators',
                content: `## Closures
A closure is a function that **remembers variables from its enclosing scope**.

\`\`\`python
def counter(start=0):
    count = [start]          # mutable container
    def increment():
        count[0] += 1
        return count[0]
    return increment

c = counter()
print(c())  # 1
print(c())  # 2
\`\`\`

## Basic Decorator
\`\`\`python
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("Before")
        result = func(*args, **kwargs)
        print("After")
        return result
    return wrapper

@my_decorator
def say_hello(name):
    print(f"Hello, {name}!")
\`\`\`

## Practical Decorators
\`\`\`python
import time
import functools

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__}: {time.time()-start:.4f}s")
        return result
    return wrapper

@timer
def slow_sum(n):
    return sum(range(n))
\`\`\``,
            },
            {
                type: 'code',
                title: 'Decorator Showcase',
                code: `import functools

def memoize(func):
    """Cache function results for same inputs"""
    cache = {}
    @functools.wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper

def retry(times=3):
    """Retry decorator factory"""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times+1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    print(f"Attempt {attempt} failed: {e}")
            return None
        return wrapper
    return decorator

@memoize
def fibonacci(n):
    if n <= 1: return n
    return fibonacci(n-1) + fibonacci(n-2)

print("Fibonacci with memoize:")
for i in range(10):
    print(f"  fib({i}) = {fibonacci(i)}")`,
            },
            {
                type: 'challenge',
                title: 'Challenge: Logger Decorator',
                instructions: `Write a \`@log_calls\` decorator that prints the function name and arguments before calling it.

When you run:
\`\`\`python
@log_calls
def add(a, b):
    return a + b

result = add(3, 4)
print(result)
\`\`\`

Output should include: **"Calling add(3, 4)"** and **"7"**`,
                starterCode: `import functools

def log_calls(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        args_str = ", ".join(str(a) for a in args)
        print(f"Calling {func.__name__}({args_str})")
        return func(*args, **kwargs)
    return wrapper

@log_calls
def add(a, b):
    return a + b

result = add(3, 4)
print(result)`,
                check: (out) => out.includes('add(3, 4)') && out.includes('7'),
                hint: 'Output should contain "Calling add(3, 4)" and "7".',
            },
        ],
    },

    {
        id: 'generators',
        title: 'Generators & Async',
        icon: '⚙️',
        color: 'gold',
        description: 'Create lazy iterators with generators and write concurrent code with asyncio.',
        xp: 125,
        sections: [
            {
                type: 'theory',
                title: 'Generators and AsyncIO',
                content: `## Generators
Generators produce values **on demand** — saving memory for large sequences.

\`\`\`python
def countdown(n):
    while n > 0:
        yield n     # pause & return value
        n -= 1

for num in countdown(5):
    print(num)      # 5, 4, 3, 2, 1
\`\`\`

## Generator Chaining
\`\`\`python
def squares(nums):
    for n in nums:
        yield n ** 2

def evens(nums):
    for n in nums:
        if n % 2 == 0:
            yield n

pipeline = evens(squares(range(10)))
print(list(pipeline))  # [0, 4, 16, 36, 64]
\`\`\`

## AsyncIO Basics
\`\`\`python
import asyncio

async def fetch(url):
    await asyncio.sleep(1)  # simulate I/O
    return f"data from {url}"

async def main():
    # Run concurrently
    results = await asyncio.gather(
        fetch("api/1"),
        fetch("api/2"),
        fetch("api/3"),
    )
    for r in results:
        print(r)

asyncio.run(main())
\`\`\``,
            },
            {
                type: 'code',
                title: 'Generators in Action',
                code: `# Infinite sequence generators
def naturals():
    n = 0
    while True:
        yield n
        n += 1

def take(n, gen):
    for _ in range(n):
        yield next(gen)

def fibonacci_gen():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# Take first 10 fibonacci numbers
fibs = list(take(10, fibonacci_gen()))
print(f"Fibonacci: {fibs}")

# Generator pipeline: squares of even naturals
def evens(gen):
    for n in gen:
        if n % 2 == 0:
            yield n

def squares(gen):
    for n in gen:
        yield n * n

pipeline = squares(evens(take(20, naturals())))
result = list(pipeline)
print(f"Squares of even naturals: {result}")

# Memory efficient sum
big_sum = sum(x**2 for x in range(1, 1001))
print(f"Sum of squares 1-1000: {big_sum}")`,
            },
            {
                type: 'challenge',
                title: 'Challenge: Running Average',
                instructions: `Write a generator \`running_avg(nums)\` that yields the **running average** after each number.

For input \`[4, 8, 6, 2]\`, it should yield: \`4.0, 6.0, 6.0, 5.0\`

Print each value on its own line.`,
                starterCode: `def running_avg(nums):
    total = 0
    count = 0
    for n in nums:
        total += n
        count += 1
        yield total / count

for avg in running_avg([4, 8, 6, 2]):
    print(avg)`,
                check: (out) => out.includes('4.0') && out.includes('6.0') && out.includes('5.0'),
                hint: 'Output should show: 4.0, 6.0, 6.0, 5.0 on separate lines.',
            },
        ],
    },
];

export const TOPIC_COLOR_CLASSES = {
    cyan: { card: 'border-2 border-brutal-black hover:shadow-brutal-sm', badge: 'text-brutal-mint', ring: '#88D8B0', btn: 'btn-brutal' },
    purple: { card: 'border-2 border-brutal-black hover:shadow-brutal-sm', badge: 'text-brutal-purple', ring: '#8338EC', btn: 'btn-brutal-purple' },
    gold: { card: 'border-2 border-brutal-black hover:shadow-brutal-sm', badge: 'text-brutal-yellow', ring: '#FFBE0B', btn: 'btn-brutal-yellow' },
    orange: { card: 'border-2 border-brutal-black hover:shadow-brutal-sm', badge: 'text-brutal-orange', ring: '#FB5607', btn: 'btn-brutal' },
    magenta: { card: 'border-2 border-brutal-black hover:shadow-brutal-sm', badge: 'text-brutal-pink', ring: '#FF006E', btn: 'btn-brutal-danger' },
};
