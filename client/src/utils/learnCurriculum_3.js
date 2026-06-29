/** @fileoverview Learn curriculum part 3 — RL/PPO, ZeroMQ, FastAPI, Federated Learning */

/** RL / PPO curriculum — 6 topics */
export const RL_TOPICS = [
    {
        id: 'mdp', title: 'MDP & Bellman', icon: '🗺️', color: 'cyan', xp: 125,
        description: 'Markov Decision Processes, state/action spaces, rewards, and the Bellman equation.',
        sections: [
            {
                type: 'theory', title: 'Markov Decision Processes', content: `## What is an MDP?
A **Markov Decision Process** defines the framework for sequential decision making:
- **S** — state space (all possible observations)
- **A** — action space (all possible actions)
- **R** — reward function R(s, a, s')
- **P** — transition probability P(s'|s,a)
- **γ** — discount factor (0–1, importance of future rewards)

## Value Functions
- **V(s)** — expected cumulative reward from state s
- **Q(s,a)** — expected reward taking action a in state s

## Bellman Equation
\`\`\`
V(s) = max_a [ R(s,a) + γ · Σ P(s'|s,a) · V(s') ]
Q(s,a) = R(s,a) + γ · Σ P(s'|s,a) · max_a' Q(s',a')
\`\`\`

## The Markov Property
**Future depends only on the current state**, not history. "The present is all you need."` },
            {
                type: 'code', title: 'MDP Simulation', code: `import random

# Simple GridWorld MDP
class GridWorld:
    def __init__(self, size=4):
        self.size = size
        self.goal = (size-1, size-1)
        self.reset()

    def reset(self):
        self.pos = (0, 0)
        return self.pos

    def step(self, action):
        # actions: 0=up, 1=down, 2=left, 3=right
        dx = {0:-1, 1:1, 2:0, 3:0}
        dy = {0:0, 1:0, 2:-1, 3:1}
        r, c = self.pos
        nr = max(0, min(self.size-1, r + dx[action]))
        nc = max(0, min(self.size-1, c + dy[action]))
        self.pos = (nr, nc)
        done = self.pos == self.goal
        reward = 10.0 if done else -0.1
        return self.pos, reward, done

# Random policy episode
env = GridWorld(4)
state = env.reset()
total_reward = 0

for step in range(50):
    action = random.randint(0, 3)
    state, reward, done = env.step(action)
    total_reward += reward * (0.99 ** step)
    if done:
        print(f"Reached goal in {step+1} steps! Discounted reward: {total_reward:.2f}")
        break
else:
    print(f"Did not reach goal. Discounted reward: {total_reward:.2f}")` },
            {
                type: 'challenge', title: 'Discounted Return', instructions: `A sequence of rewards: **[1, 1, 1, 10]** with γ=0.9\n\nDiscounted return = 1 + 0.9×1 + 0.81×1 + 0.729×10 = **9.589**\n\nPrint: **"Return: 9.59"**`, starterCode: `rewards = [1, 1, 1, 10]
gamma = 0.9

G = sum(r * gamma**t for t, r in enumerate(rewards))
print(f"Return: {G:.2f}")`,
                check: (out) => out.includes('9.5') || out.includes('9.6'), hint: 'G = Σ γ^t × r_t ≈ 9.59'
            },
        ],
    },
    {
        id: 'q-learning', title: 'Q-Learning', icon: '📊', color: 'purple', xp: 125,
        description: 'Tabular Q-learning, epsilon-greedy exploration, and convergence.',
        sections: [
            {
                type: 'theory', title: 'Q-Learning Algorithm', content: `## Core Update Rule
\`\`\`
Q(s,a) ← Q(s,a) + α[r + γ·max_a' Q(s',a') - Q(s,a)]
\`\`\`
- **α** = learning rate (0–1)
- **r** = reward received
- **γ** = discount factor

## Epsilon-Greedy Exploration
\`\`\`python
if random.random() < epsilon:
    action = env.action_space.sample()  # explore
else:
    action = argmax(Q[state])           # exploit
\`\`\`

## Epsilon Decay
Start with high ε (explore) → decay over time (exploit):
\`\`\`python
epsilon = max(epsilon_min, epsilon * decay_rate)
\`\`\`

## Q-Table
For small discrete spaces, store Q(s,a) in a table (dict or numpy array). For large/continuous spaces → Deep Q-Network (DQN).` },
            {
                type: 'code', title: 'Q-Learning on GridWorld', code: `import random
import numpy as np

# Q-learning on a simple 4x4 grid
SIZE = 4
GOAL = (3, 3)
ACTIONS = [(−1,0),(1,0),(0,−1),(0,1)]  # up,down,left,right

def step(pos, action):
    r = max(0, min(SIZE-1, pos[0] + ACTIONS[action][0]))
    c = max(0, min(SIZE-1, pos[1] + ACTIONS[action][1]))
    new_pos = (r, c)
    done = new_pos == GOAL
    return new_pos, (10.0 if done else -0.1), done

# Q-table
Q = np.zeros((SIZE, SIZE, 4))
alpha, gamma, eps = 0.1, 0.99, 1.0

for episode in range(500):
    pos = (0, 0)
    eps = max(0.1, eps * 0.995)
    for _ in range(100):
        a = random.randint(0,3) if random.random() < eps else np.argmax(Q[pos])
        new_pos, r, done = step(pos, a)
        Q[pos][a] += alpha * (r + gamma * np.max(Q[new_pos]) - Q[pos][a])
        pos = new_pos
        if done: break

# Test greedy policy
pos, steps, total = (0,0), 0, 0
for _ in range(20):
    a = np.argmax(Q[pos])
    pos, r, done = step(pos, a)
    total += r; steps += 1
    if done: break

print(f"Solved in {steps} steps, reward: {total:.1f}")` },
            {
                type: 'challenge', title: 'Q-Update', instructions: `Apply one Q-learning update:\n- Q(s,a) = 0.5, r = 1.0, max Q(s') = 2.0\n- α = 0.1, γ = 0.9\n\nnew Q = 0.5 + 0.1×(1.0 + 0.9×2.0 - 0.5) = **0.5 + 0.1×2.3 = 0.73**\n\nPrint: **"New Q: 0.73"**`, starterCode: `Q = 0.5
r = 1.0
max_Q_next = 2.0
alpha = 0.1
gamma = 0.9

new_Q = Q + alpha * (r + gamma * max_Q_next - Q)
print(f"New Q: {new_Q:.2f}")`,
                check: (out) => out.includes('0.73'), hint: 'Q + α(r + γ·maxQ\' - Q) = 0.73'
            },
        ],
    },
    {
        id: 'policy-gradients', title: 'Policy Gradients', icon: '📈', color: 'gold', xp: 125,
        description: 'REINFORCE algorithm, log-probability, and policy optimization.',
        sections: [
            {
                type: 'theory', title: 'Policy Gradient Methods', content: `## Policy vs Value
- **Value-based** (Q-learning): learn value, derive policy
- **Policy-based** (PG): directly optimize policy π(a|s;θ)

## REINFORCE Algorithm
\`\`\`python
# For each episode:
for state, action, reward in episode:
    log_prob = policy.log_prob(action)
    loss = -log_prob * G_t  # G_t = discounted return
    
optimizer.zero_grad()
loss.backward()
optimizer.step()
\`\`\`

## Policy Gradient Theorem
\`\`\`
∇J(θ) = E[∇log π(a|s;θ) · Q(s,a)]
\`\`\`

## Variance Reduction
Raw returns have high variance. Use a **baseline** (typically V(s)):
\`\`\`
advantage = Q(s,a) - V(s)
loss = -log_prob * advantage
\`\`\`
This is the **Actor-Critic** approach.` },
            {
                type: 'code', title: 'REINFORCE Concept', code: `import torch
import torch.nn as nn
import torch.optim as optim

class PolicyNet(nn.Module):
    def __init__(self, state_dim, action_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(state_dim, 64), nn.ReLU(),
            nn.Linear(64, action_dim), nn.Softmax(dim=-1)
        )

    def forward(self, x):
        return self.net(x)

# REINFORCE update simulation
def reinforce_update(policy, optimizer, log_probs, returns):
    """One REINFORCE gradient step"""
    loss = 0
    for log_p, G in zip(log_probs, returns):
        loss -= log_p * G   # maximize expected return

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    return loss.item()

policy = PolicyNet(4, 2)  # CartPole dims: 4 state, 2 actions
optimizer = optim.Adam(policy.parameters(), lr=1e-3)

# Fake episode data
fake_state = torch.randn(4)
probs = policy(fake_state)
dist = torch.distributions.Categorical(probs)
action = dist.sample()
log_prob = dist.log_prob(action)

print(f"Action probs: {probs.detach().numpy().round(3)}")
print(f"Sampled action: {action.item()}")
print(f"Log prob: {log_prob.item():.4f}")` },
            {
                type: 'challenge', title: 'Advantage', instructions: `Calculate the advantage:\n- Q(s,a) = 5.2 (actual return)\n- V(s) = 4.8 (baseline estimate)\n\nAdvantage = Q - V = **0.4**\n\nPrint: **"Advantage: 0.40"**`, starterCode: `Q = 5.2
V = 4.8

advantage = Q - V
print(f"Advantage: {advantage:.2f}")`,
                check: (out) => out.includes('0.4'), hint: 'Advantage = Q - V = 0.4'
            },
        ],
    },
    {
        id: 'actor-critic', title: 'Actor-Critic', icon: '🎭', color: 'orange', xp: 125,
        description: 'Separate actor (policy) and critic (value) networks, advantages, and A2C.',
        sections: [
            {
                type: 'theory', title: 'Actor-Critic Architecture', content: `## Two Networks
- **Actor** π(a|s;θ) — decides what action to take
- **Critic** V(s;φ) — evaluates how good the current state is

## A2C (Advantage Actor-Critic)
\`\`\`python
# Critic loss: MSE between predicted V and actual return
critic_loss = F.mse_loss(value, returns)

# Actor loss: policy gradient with advantage
advantage = returns - value.detach()
actor_loss = -(log_probs * advantage).mean()

total_loss = actor_loss + 0.5 * critic_loss
\`\`\`

## Entropy Regularization
Add entropy bonus to encourage exploration:
\`\`\`python
entropy = dist.entropy().mean()
total_loss = actor_loss + 0.5 * critic_loss - 0.01 * entropy
\`\`\`

## A2C vs A3C
- **A2C** — synchronous, simpler, one update per batch
- **A3C** — asynchronous, multiple workers, more complex` },
            {
                type: 'code', title: 'Actor-Critic Network', code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class ActorCritic(nn.Module):
    """Shared backbone, separate heads"""
    def __init__(self, state_dim, action_dim):
        super().__init__()
        self.shared = nn.Sequential(
            nn.Linear(state_dim, 128), nn.Tanh(),
            nn.Linear(128, 64), nn.Tanh(),
        )
        self.actor  = nn.Linear(64, action_dim)  # policy head
        self.critic = nn.Linear(64, 1)           # value head

    def forward(self, x):
        features = self.shared(x)
        logits    = self.actor(features)
        value     = self.critic(features)
        return logits, value

    def get_action(self, state):
        logits, value = self(state)
        dist   = torch.distributions.Categorical(logits=logits)
        action = dist.sample()
        return action, dist.log_prob(action), value

# Test
model = ActorCritic(4, 2)
state = torch.randn(1, 4)
action, log_prob, value = model.get_action(state)

print(f"Action: {action.item()}")
print(f"Log prob: {log_prob.item():.4f}")
print(f"Value estimate: {value.item():.4f}")
print(f"\\nParams: {sum(p.numel() for p in model.parameters()):,}")` },
            {
                type: 'challenge', title: 'A2C Loss', instructions: `Compute total A2C loss:\n- actor_loss = 0.6\n- critic_loss = 0.4\n- entropy = 0.5\n- coefficients: critic×0.5, entropy×0.01\n\ntotal = 0.6 + 0.5×0.4 - 0.01×0.5 = **0.795**\n\nPrint: **"Total loss: 0.795"**`, starterCode: `actor_loss = 0.6
critic_loss = 0.4
entropy = 0.5

total = actor_loss + 0.5 * critic_loss - 0.01 * entropy
print(f"Total loss: {total:.3f}")`,
                check: (out) => out.includes('0.795'), hint: '0.6 + 0.2 - 0.005 = 0.795'
            },
        ],
    },
    {
        id: 'ppo', title: 'PPO Algorithm', icon: '🤖', color: 'cyan', xp: 150,
        description: 'Proximal Policy Optimization — the industry standard for training RL agents.',
        sections: [
            {
                type: 'theory', title: 'Proximal Policy Optimization', content: `## Why PPO?
Standard policy gradient can take too-large steps → unstable training. PPO **clips** the policy update to stay close to the old policy.

## PPO Clipped Objective
\`\`\`
ratio = π_new(a|s) / π_old(a|s)
L_clip = min(ratio·A, clip(ratio, 1-ε, 1+ε)·A)
\`\`\`
- ε is usually **0.2** (clip range)
- Prevents updates that change the policy too much

## Full PPO Loss
\`\`\`python
L = L_clip - c1·L_value + c2·S[π]
\`\`\`
- **L_value** — value function error
- **S[π]** — entropy bonus

## PPO Training Steps
1. Collect rollout with current policy
2. Compute advantages (GAE)
3. For K epochs, sample minibatches
4. Compute clipped loss and update
5. Repeat` },
            {
                type: 'code', title: 'PPO Clipping', code: `import torch

def ppo_clip_loss(log_probs_new, log_probs_old, advantages, clip_eps=0.2):
    """PPO clipped surrogate objective"""
    ratio = torch.exp(log_probs_new - log_probs_old)

    # Clipped objective
    clipped = torch.clamp(ratio, 1 - clip_eps, 1 + clip_eps)
    L_clip = torch.min(ratio * advantages, clipped * advantages)

    return -L_clip.mean()  # negative because we maximize

# Simulate a small batch
torch.manual_seed(42)
log_probs_old = torch.tensor([-0.5, -0.3, -0.8, -0.2])
log_probs_new = torch.tensor([-0.4, -0.6, -0.7, -0.1])
advantages    = torch.tensor([1.2, -0.5, 0.8, 0.3])

ratios = torch.exp(log_probs_new - log_probs_old)
print("Ratios:", ratios.round(decimals=3))
print("Advantages:", advantages)

loss = ppo_clip_loss(log_probs_new, log_probs_old, advantages)
print(f"\\nPPO Clipped Loss: {loss.item():.4f}")` },
            {
                type: 'challenge', title: 'Clip Ratio', instructions: `With clip_eps=0.2, what is clip(1.5, 0.8, 1.2)?\n\nThe range is [1-0.2, 1+0.2] = **[0.8, 1.2]**\nSo 1.5 gets clipped to **1.2**\n\nPrint: **"Clipped: 1.2"**`, starterCode: `import torch

ratio = torch.tensor(1.5)
clip_eps = 0.2

clipped = torch.clamp(ratio, 1 - clip_eps, 1 + clip_eps)
print(f"Clipped: {clipped.item():.1f}")`,
                check: (out) => out.includes('1.2'), hint: 'clamp(1.5, 0.8, 1.2) = 1.2'
            },
        ],
    },
    {
        id: 'gymnasium', title: 'Gymnasium Envs', icon: '🏟️', color: 'purple', xp: 100,
        description: 'Use Gymnasium (formerly Gym) environments to train and test RL agents.',
        sections: [
            {
                type: 'theory', title: 'Gymnasium Framework', content: `## The Gym Interface
\`\`\`python
import gymnasium as gym

env = gym.make("CartPole-v1")
obs, info = env.reset()

for _ in range(1000):
    action = env.action_space.sample()  # random policy
    obs, reward, terminated, truncated, info = env.step(action)
    if terminated or truncated:
        obs, info = env.reset()

env.close()
\`\`\`

## Common Environments
| Env | Obs | Actions | Goal |
|-----|-----|---------|------|
| \`CartPole-v1\` | 4 floats | 2 discrete | Balance pole for 500 steps |
| \`LunarLander-v2\` | 8 floats | 4 discrete | Land between flags |
| \`MountainCar-v0\` | 2 floats | 3 discrete | Reach mountaintop |
| \`Pendulum-v1\` | 3 floats | continuous | Swing up and balance |

## Observation & Action Spaces
\`\`\`python
env.observation_space   # e.g. Box(4,) for CartPole
env.action_space        # e.g. Discrete(2)
env.observation_space.shape  # (4,)
\`\`\`` },
            {
                type: 'code', title: 'Random Policy Benchmark', code: `import random

# Simulate CartPole without actual gym for this demo

class CartPoleSim:
    def __init__(self):
        self.steps = 0

    def reset(self):
        self.steps = 0
        return [0.0, 0.0, 0.01, 0.0]  # initial obs

    def step(self, action):
        self.steps += 1
        reward = 1.0
        # Simulate eventual failure
        terminated = random.random() < 0.02  # ~2% chance each step
        return [0.0]*4, reward, terminated, self.steps >= 500, {}

env = CartPoleSim()
episode_lengths = []

for ep in range(20):
    obs, _ = env.reset()
    ep_len = 0
    for _ in range(500):
        action = random.randint(0, 1)  # random policy
        obs, reward, done, trunc, _ = env.step(action)
        ep_len += 1
        if done or trunc:
            break
    episode_lengths.append(ep_len)

print(f"Random Policy Results (20 episodes):")
print(f"  Mean length: {sum(episode_lengths)/len(episode_lengths):.1f}")
print(f"  Max:  {max(episode_lengths)}")
print(f"  Min:  {min(episode_lengths)}")` },
            {
                type: 'challenge', title: 'Env Spaces', instructions: `Print CartPole-v1's observation and action space dimensions:\n- Observation: **4 continuous variables** (cart pos, vel, pole angle, angular vel)\n- Actions: **2 discrete** (push left, push right)\n\nPrint: **"Obs: 4, Actions: 2"**`, starterCode: `obs_dim = 4      # CartPole observation space
action_dim = 2   # CartPole action space (discrete)

print(f"Obs: {obs_dim}, Actions: {action_dim}")`,
                check: (out) => out.includes('Obs: 4') && out.includes('Actions: 2'), hint: 'CartPole: 4 obs, 2 actions'
            },
        ],
    },
];

/** ZeroMQ curriculum — 6 topics */
export const ZEROMQ_TOPICS = [
    {
        id: 'sockets', title: 'Sockets & Patterns', icon: '🔌', color: 'cyan', xp: 75,
        description: 'ZeroMQ socket types and messaging patterns overview.',
        sections: [
            {
                type: 'theory', title: 'ZeroMQ Basics', content: `## What is ZeroMQ?
ZeroMQ (0MQ) is a **brokerless** messaging library — sockets, but smarter.

## Socket Types
| Pattern | Sockets | Use Case |
|---------|---------|---------|
| **REQ-REP** | Request/Reply | RPC, synchronous calls |
| **PUB-SUB** | Publisher/Subscriber | broadcast, real-time feeds |
| **PUSH-PULL** | Push/Pull | task distribution, pipeline |
| **PAIR** | two endpoints | thread communication |
| **DEALER-ROUTER** | async req/rep | load balancing |

## Key Concepts
- **No broker** — sockets connect directly
- **Async** — sockets queue messages
- **Transport** — \`tcp://\`, \`ipc://\`, \`inproc://\`
- **Bind vs Connect** — servers bind, clients connect (usually)` },
            {
                type: 'code', title: 'Pattern Overview', code: `# ZeroMQ pattern summary

patterns = {
    "REQ-REP": {
        "sync": True, "one_to_one": True,
        "use": "Client-server RPC, database queries",
        "example": "Client asks 'compute X', server replies with result"
    },
    "PUB-SUB": {
        "sync": False, "one_to_one": False,
        "use": "Real-time data feeds, event broadcasting",
        "example": "Server publishes prices, N clients receive updates"
    },
    "PUSH-PULL": {
        "sync": False, "one_to_one": False,
        "use": "Work queues, parallel processing pipelines",
        "example": "Ventilator pushes tasks, workers pull and process"
    },
}

for name, info in patterns.items():
    sync = "Sync" if info["sync"] else "Async"
    scale = "1:1" if info["one_to_one"] else "1:N or N:N"
    print(f"\\n{name} ({sync}, {scale})")
    print(f"  Use: {info['use']}")
    print(f"  Ex:  {info['example']}")` },
            {
                type: 'challenge', title: 'Pattern Matching', instructions: `Match the ZeroMQ pattern to the use case. Print:\n- **REQ-REP: RPC calls**\n- **PUB-SUB: live price feed**\n- **PUSH-PULL: task queue**`, starterCode: `matches = [
    ("REQ-REP", "RPC calls"),
    ("PUB-SUB", "live price feed"),
    ("PUSH-PULL", "task queue"),
]

for pattern, use in matches:
    print(f"{pattern}: {use}")`,
                check: (out) => out.includes('REQ-REP') && out.includes('PUB-SUB') && out.includes('PUSH-PULL'), hint: 'Print all 3 pattern matches'
            },
        ],
    },
    {
        id: 'req-rep', title: 'REQ-REP Pattern', icon: '↔️', color: 'purple', xp: 75,
        description: 'Build synchronous request-reply messaging between client and server.',
        sections: [
            {
                type: 'theory', title: 'REQ-REP Pattern', content: `## How It Works
REQ sends → REP receives → REP sends reply → REQ receives reply. **Strict alternation.**

## Python Code
\`\`\`python
# Server (REP)
import zmq
ctx = zmq.Context()
socket = ctx.socket(zmq.REP)
socket.bind("tcp://*:5555")

while True:
    msg = socket.recv_string()     # blocks until message
    print(f"Got: {msg}")
    socket.send_string(f"Echo: {msg}")

# Client (REQ)
socket = ctx.socket(zmq.REQ)
socket.connect("tcp://localhost:5555")
socket.send_string("Hello")
reply = socket.recv_string()       # blocks until reply
print(reply)
\`\`\`

## Rules
- REQ must send before it can receive
- REP must receive before it can send
- Breaking this order causes \`ZMQError: Operation cannot be accomplished in current state\`` },
            {
                type: 'code', title: 'REQ-REP Simulation', code: `import queue, threading, time

# Simulate REQ-REP with two threads

req_queue = queue.Queue()
rep_queue = queue.Queue()

def server():
    """REP socket simulation"""
    for _ in range(3):
        msg = req_queue.get()
        print(f"Server received: '{msg}'")
        time.sleep(0.05)
        response = f"PONG: {msg.upper()}"
        rep_queue.put(response)
        print(f"Server sent: '{response}'")

def client():
    """REQ socket simulation"""
    messages = ["ping-1", "ping-2", "ping-3"]
    for msg in messages:
        req_queue.put(msg)
        response = rep_queue.get()
        print(f"  Client got: '{response}'")

t_server = threading.Thread(target=server)
t_client = threading.Thread(target=client)
t_server.start(); t_client.start()
t_server.join(); t_client.join()
print("\\nAll exchanges complete!")` },
            {
                type: 'challenge', title: 'Echo Counter', instructions: `Simulate 3 REQ-REP exchanges. Each reply should include the message number.\n\nPrint:\n- **"Reply 1: GOT HELLO"**\n- **"Reply 2: GOT WORLD"**\n- **"Reply 3: GOT CODEC"**`, starterCode: `messages = ["hello", "world", "codec"]

for i, msg in enumerate(messages, 1):
    reply = f"GOT {msg.upper()}"
    print(f"Reply {i}: {reply}")`,
                check: (out) => out.includes('Reply 1: GOT HELLO') && out.includes('Reply 3: GOT CODEC'), hint: 'Format: Reply N: GOT MESSAGE'
            },
        ],
    },
    {
        id: 'pub-sub', title: 'PUB-SUB Pattern', icon: '📡', color: 'gold', xp: 75,
        description: 'broadcast messages to multiple subscribers with topic filtering.',
        sections: [
            {
                type: 'theory', title: 'PUB-SUB Pattern', content: `## How It Works
Publisher sends messages with a **topic prefix**. Subscribers filter by topic.

## Python Code
\`\`\`python
# Publisher
pub = ctx.socket(zmq.PUB)
pub.bind("tcp://*:5556")

pub.send_string("PRICE BTC:42000")
pub.send_string("NEWS Bitcoin hits new high")

# Subscriber (only gets PRICE messages)
sub = ctx.socket(zmq.SUB)
sub.connect("tcp://localhost:5556")
sub.setsockopt_string(zmq.SUBSCRIBE, "PRICE")

msg = sub.recv_string()  # → "PRICE BTC:42000"
\`\`\`

## Slow Joiner Problem
New subscribers miss messages sent before they subscribed. Solutions:
- Use XPUB/XSUB with stored state
- Publisher re-sends recent messages on new subscription
- Add a separate "snapshot" REQ-REP channel` },
            {
                type: 'code', title: 'PUB-SUB Simulation', code: `import queue, threading, time, random

pub_queues = {"PRICE": queue.Queue(), "NEWS": queue.Queue(), "ALL": queue.Queue()}

def publisher():
    messages = [
        ("PRICE", "BTC:42000"),
        ("NEWS", "Bitcoin surges 5%"),
        ("PRICE", "ETH:2800"),
        ("PRICE", "BTC:42500"),
        ("NEWS", "Crypto market rallies"),
    ]
    for topic, data in messages:
        full = f"{topic} {data}"
        for t in ["ALL", topic]:
            if t in pub_queues:
                pub_queues[t].put(full)
        time.sleep(0.1)

def subscriber(name, topic):
    received = []
    q = pub_queues.get(topic, pub_queues["ALL"])
    while True:
        try:
            msg = q.get(timeout=1)
            received.append(msg)
        except:
            break
    print(f"\\n{name} ({topic} filter):")
    for m in received:
        print(f"  {m}")

t0 = threading.Thread(target=publisher)
t1 = threading.Thread(target=subscriber, args=("PriceWatcher", "PRICE"))
t2 = threading.Thread(target=subscriber, args=("NewsReader", "NEWS"))
for t in [t0, t1, t2]: t.start()
for t in [t0, t1, t2]: t.join()` },
            {
                type: 'challenge', title: 'Topic Filter', instructions: `Given a list of messages, filter only those starting with "PRICE".\nPrint the count.\n\nMessages: ["PRICE BTC:42k", "NEWS Bitcoin up", "PRICE ETH:2.8k", "LOG error"]\n\nPrint: **"PRICE messages: 2"**`, starterCode: `messages = ["PRICE BTC:42k", "NEWS Bitcoin up", "PRICE ETH:2.8k", "LOG error"]

price_msgs = [m for m in messages if m.startswith("PRICE")]
print(f"PRICE messages: {len(price_msgs)}")`,
                check: (out) => out.includes('PRICE messages: 2'), hint: 'Filter by startswith("PRICE")'
            },
        ],
    },
    {
        id: 'push-pull', title: 'PUSH-PULL Pattern', icon: '⚡', color: 'orange', xp: 75,
        description: 'Distribute tasks across worker processes with the pipeline pattern.',
        sections: [
            {
                type: 'theory', title: 'PUSH-PULL Pipeline', content: `## The Ventilator-Worker-Sink Pattern
\`\`\`
[Ventilator] PUSH → N×[Workers] PULL
[Workers] PUSH → [Sink] PULL
\`\`\`

## Python Code
\`\`\`python
# Ventilator (task source)
push = ctx.socket(zmq.PUSH)
push.bind("tcp://*:5557")
for task in tasks:
    push.send_json(task)

# Worker
pull = ctx.socket(zmq.PULL)
pull.connect("tcp://localhost:5557")
send = ctx.socket(zmq.PUSH)
send.connect("tcp://localhost:5558")
while True:
    task = pull.recv_json()
    result = process(task)
    send.send_json(result)

# Sink (result collector)
sink = ctx.socket(zmq.PULL)
sink.bind("tcp://*:5558")
\`\`\`

## Load Balancing
ZeroMQ automatically round-robins PUSH across multiple PULL sockets — free load balancing!` },
            {
                type: 'code', title: 'Pipeline Simulation', code: `import queue, threading, time, math

task_q = queue.Queue()
result_q = queue.Queue()

def ventilator(n_tasks):
    for i in range(n_tasks):
        task = {"id": i, "data": (i + 1) ** 2}
        task_q.put(task)
    print(f"Ventilator: sent {n_tasks} tasks")

def worker(worker_id):
    while True:
        try:
            task = task_q.get(timeout=0.5)
            result = {
                "id": task["id"],
                "worker": worker_id,
                "result": math.sqrt(task["data"])
            }
            time.sleep(0.01)
            result_q.put(result)
        except:
            break

def sink(n_expected):
    results = []
    while len(results) < n_expected:
        try:
            r = result_q.get(timeout=2)
            results.append(r)
        except:
            break
    print(f"Sink: collected {len(results)} results")
    for r in sorted(results, key=lambda x: x['id'])[:4]:
        print(f"  Task {r['id']}: worker={r['worker']}, sqrt={r['result']:.2f}")

N = 10
threads = [
    threading.Thread(target=ventilator, args=(N,)),
    threading.Thread(target=worker, args=(1,)),
    threading.Thread(target=worker, args=(2,)),
    threading.Thread(target=sink, args=(N,)),
]
for t in threads: t.start()
for t in threads: t.join()` },
            {
                type: 'challenge', title: 'Task Distribution', instructions: `10 tasks distributed to 3 workers with round-robin.\n\nWhich worker gets task index 7?\nWorker = task_index % num_workers = 7 % 3 = **1**\n\nPrint: **"Task 7 → Worker 1"**`, starterCode: `task_id = 7
num_workers = 3

worker = task_id % num_workers
print(f"Task {task_id} → Worker {worker}")`,
                check: (out) => out.includes('Task 7 → Worker 1'), hint: '7 % 3 = 1'
            },
        ],
    },
    {
        id: 'multithreading', title: 'Multi-threading', icon: '🔀', color: 'cyan', xp: 100,
        description: 'ZeroMQ with Python threads using inproc:// transport for thread-safe IPC.',
        sections: [
            {
                type: 'theory', title: 'Thread-safe ZeroMQ', content: `## Rules
- **Never share sockets between threads** — sockets are not thread-safe
- Use **one socket per thread**, pass messages via ZeroMQ
- Use \`inproc://\` transport for thread-to-thread communication

## Thread-safe Pair Pattern
\`\`\`python
def worker_thread(ctx):
    socket = ctx.socket(zmq.PAIR)
    socket.connect("inproc://worker")
    while True:
        msg = socket.recv_string()
        socket.send_string(f"Done: {msg}")

ctx = zmq.Context()
main_sock = ctx.socket(zmq.PAIR)
main_sock.bind("inproc://worker")

t = threading.Thread(target=worker_thread, args=(ctx,))
t.daemon = True
t.start()

main_sock.send_string("task-1")
result = main_sock.recv_string()
\`\`\`` },
            {
                type: 'code', title: 'Threaded Pipeline', code: `import queue, threading, time

shared_q = queue.Queue()
results = []
results_lock = threading.Lock()

def producer(n):
    for i in range(n):
        shared_q.put({"id": i, "value": (i+1)*10})
        time.sleep(0.02)
    # Signal workers to stop
    for _ in range(2):
        shared_q.put(None)

def worker(name):
    while True:
        item = shared_q.get()
        if item is None:
            break
        result = {"id": item["id"], "worker": name, "out": item["value"] * 2}
        with results_lock:
            results.append(result)

threads = [
    threading.Thread(target=producer, args=(6,)),
    threading.Thread(target=worker, args=("W1",)),
    threading.Thread(target=worker, args=("W2",)),
]

for t in threads: t.start()
for t in threads: t.join()

print(f"Processed {len(results)} items:")
for r in sorted(results, key=lambda x: x["id"]):
    print(f"  [{r['worker']}] item {r['id']}: {r['out']}")` },
            {
                type: 'challenge', title: 'Thread Safety', instructions: `In a race condition between 2 threads each incrementing a counter 1000 times, the result may be less than 2000 due to the GIL or race conditions.\n\nUse a Lock to print: **"Safe count: 2000"**`, starterCode: `import threading

counter = 0
lock = threading.Lock()

def increment(n):
    global counter
    for _ in range(n):
        with lock:
            counter += 1

threads = [threading.Thread(target=increment, args=(1000,)) for _ in range(2)]
for t in threads: t.start()
for t in threads: t.join()

print(f"Safe count: {counter}")`,
                check: (out) => out.includes('Safe count: 2000'), hint: 'Use threading.Lock() to prevent race conditions'
            },
        ],
    },
    {
        id: 'distributed', title: 'Distributed Systems', icon: '🌐', color: 'purple', xp: 100,
        description: 'Build multi-process distributed systems with ZeroMQ — heartbeats, failure detection.',
        sections: [
            {
                type: 'theory', title: 'Distributed System Design', content: `## Key Challenges
1. **Network failures** — connections drop
2. **Partial failures** — some nodes crash
3. **Message ordering** — messages may arrive out of order
4. **Timeouts** — how long to wait for replies?

## Heartbeat Pattern
\`\`\`python
# Send heartbeat every 1s
HEARTBEAT_INTERVAL = 1000  # ms
HEARTBEAT_LIVENESS = 3     # miss 3 = dead

# Worker sends ping
socket.send(b"HEARTBEAT")

# Broker tracks last heartbeat
if time.time() > last_heartbeat + INTERVAL * LIVENESS:
    print(f"Worker {id} considered dead")
\`\`\`

## Patterns for Reliability
| Pattern | Solution |
|---------|---------|
| Lazy Pirate | client retries |
| Simple Pirate | stateless queue |
| Paranoid Pirate | stateful worker |
| Majordomo | full service broker |

## ZeroMQ Reliability Tips
- Always set \`LINGER=0\` when closing sockets
- Use \`RCVTIMEO/SNDTIMEO\` to set timeouts
- Send explicit heartbeats at application level` },
            {
                type: 'code', title: 'Heartbeat Monitor', code: `import time, random

class WorkerMonitor:
    def __init__(self, liveness=3, interval=1.0):
        self.workers = {}
        self.liveness = liveness
        self.interval = interval

    def register(self, worker_id):
        self.workers[worker_id] = {
            "last_seen": time.time(),
            "liveness": self.liveness,
            "alive": True
        }

    def heartbeat(self, worker_id):
        if worker_id in self.workers:
            self.workers[worker_id]["last_seen"] = time.time()
            self.workers[worker_id]["liveness"] = self.liveness

    def check_workers(self):
        now = time.time()
        for wid, w in self.workers.items():
            if w["alive"]:
                elapsed = now - w["last_seen"]
                if elapsed > self.interval:
                    w["liveness"] -= 1
                    if w["liveness"] <= 0:
                        w["alive"] = False
                        print(f"  ⚠️  Worker {wid} declared DEAD")

monitor = WorkerMonitor()
for i in range(3): monitor.register(f"W{i}")

print("Simulating heartbeats...")
for tick in range(6):
    time.sleep(0.3)
    for wid in ["W0", "W2"]:  # W1 stops early
        if tick < 3 or wid != "W1":
            monitor.heartbeat(wid)
    monitor.check_workers()

alive = [w for w, d in monitor.workers.items() if d["alive"]]
print(f"Alive workers: {alive}")` },
            {
                type: 'challenge', title: 'Liveness Expiry', instructions: `A worker with liveness=3 misses heartbeats. Each miss decrements liveness by 1.\n\nPrint the liveness after each miss until dead:\n**3 → 2 → 1 → 0 (DEAD)**`, starterCode: `liveness = 3

while liveness > 0:
    liveness -= 1
    status = "DEAD" if liveness == 0 else str(liveness)
    print(status)`,
                check: (out) => out.includes('DEAD') && out.includes('2') && out.includes('1'), hint: 'Decrement until 0, then print DEAD'
            },
        ],
    },
];

export const RL_LEARN = { meta: { name: 'RL / PPO', emoji: '🤖', color: 'cyan', layer: 'Advanced', description: 'Reinforcement learning — MDPs, Q-learning, Actor-Critic, PPO.' }, topics: RL_TOPICS };
export const ZEROMQ_LEARN = { meta: { name: 'ZeroMQ', emoji: '📡', color: 'gold', layer: 'Advanced', description: 'Distributed messaging patterns for scalable systems.' }, topics: ZEROMQ_TOPICS };
