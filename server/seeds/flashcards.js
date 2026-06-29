/** @fileoverview Flashcard seed script — 200+ cards across 10 technologies */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

const FLASHCARDS = [
  // ── Python (20) ──
  { id: 'py-1', techId: 'python', front: 'What is a list comprehension?', back: 'A concise way to create lists: [expr for item in iterable if condition]', difficulty: 'easy' },
  { id: 'py-2', techId: 'python', front: 'Difference between list and tuple?', back: 'Lists are mutable (can be changed), tuples are immutable (cannot be changed after creation)', difficulty: 'easy' },
  { id: 'py-3', techId: 'python', front: 'What does *args do in a function?', back: 'Allows passing a variable number of positional arguments as a tuple', difficulty: 'easy' },
  { id: 'py-4', techId: 'python', front: 'What does **kwargs do?', back: 'Allows passing a variable number of keyword arguments as a dictionary', difficulty: 'easy' },
  { id: 'py-5', techId: 'python', front: 'What is a decorator?', back: 'A function that wraps another function to extend its behavior using @decorator syntax', difficulty: 'medium' },
  { id: 'py-6', techId: 'python', front: 'Explain Python generators', back: 'Functions that use yield to produce a sequence of values lazily, one at a time, saving memory', difficulty: 'medium' },
  { id: 'py-7', techId: 'python', front: 'What is the GIL?', back: 'Global Interpreter Lock — prevents multiple native threads from executing Python bytecode simultaneously', difficulty: 'hard' },
  { id: 'py-8', techId: 'python', front: 'Difference between deepcopy and copy?', back: 'copy() creates shallow copy (references nested objects), deepcopy() recursively copies all nested objects', difficulty: 'medium' },
  { id: 'py-9', techId: 'python', front: 'What are context managers?', back: 'Objects that define __enter__ and __exit__ methods, used with "with" statement for resource management', difficulty: 'medium' },
  { id: 'py-10', techId: 'python', front: 'What is a lambda function?', back: 'An anonymous function defined with lambda keyword: lambda x: x * 2', difficulty: 'easy' },
  { id: 'py-11', techId: 'python', front: 'Explain Python\'s MRO', back: 'Method Resolution Order — the order Python looks up methods in class hierarchy, uses C3 linearization', difficulty: 'hard' },
  { id: 'py-12', techId: 'python', front: 'What is a virtual environment?', back: 'An isolated Python environment with its own packages, created with venv or virtualenv', difficulty: 'easy' },
  { id: 'py-13', techId: 'python', front: 'What does enumerate() do?', back: 'Returns an iterator of (index, value) tuples from an iterable', difficulty: 'easy' },
  { id: 'py-14', techId: 'python', front: 'Explain async/await in Python', back: 'async defines a coroutine, await pauses execution until the awaited coroutine completes. Uses asyncio event loop.', difficulty: 'hard' },
  { id: 'py-15', techId: 'python', front: 'What is __init__.py?', back: 'Makes a directory a Python package. Can be empty or contain initialization code.', difficulty: 'easy' },
  { id: 'py-16', techId: 'python', front: 'Difference between == and is?', back: '== compares values (equality), is compares identity (same object in memory)', difficulty: 'medium' },
  { id: 'py-17', techId: 'python', front: 'What are dataclasses?', back: 'A decorator that auto-generates __init__, __repr__, __eq__ for classes that mainly store data', difficulty: 'medium' },
  { id: 'py-18', techId: 'python', front: 'Explain Python type hints', back: 'Optional annotations like def greet(name: str) -> str: that help with code readability and tooling', difficulty: 'medium' },
  { id: 'py-19', techId: 'python', front: 'What is a set in Python?', back: 'An unordered collection of unique elements. Supports union, intersection, difference operations.', difficulty: 'easy' },
  { id: 'py-20', techId: 'python', front: 'What is monkey patching?', back: 'Dynamically modifying a class or module at runtime, often for testing or hot-fixing', difficulty: 'hard' },

  // ── C++ (20) ──
  { id: 'cpp-1', techId: 'cpp', front: 'Difference between pointer and reference?', back: 'Pointer can be null, reassigned, and uses * to dereference. Reference is an alias, cannot be null or rebound.', difficulty: 'easy' },
  { id: 'cpp-2', techId: 'cpp', front: 'What is RAII?', back: 'Resource Acquisition Is Initialization — resources are tied to object lifetime, released in destructor', difficulty: 'medium' },
  { id: 'cpp-3', techId: 'cpp', front: 'What are smart pointers?', back: 'unique_ptr (exclusive ownership), shared_ptr (shared ownership with ref counting), weak_ptr (non-owning observer)', difficulty: 'medium' },
  { id: 'cpp-4', techId: 'cpp', front: 'What is a virtual function?', back: 'A member function declared with virtual keyword that enables runtime polymorphism through vtable dispatch', difficulty: 'medium' },
  { id: 'cpp-5', techId: 'cpp', front: 'What are move semantics?', back: 'Transfer resources from one object to another using std::move, avoiding expensive deep copies', difficulty: 'hard' },
  { id: 'cpp-6', techId: 'cpp', front: 'What is the Rule of Three/Five?', back: 'If a class defines destructor, copy constructor, or copy assignment, it should define all three (five with move ops)', difficulty: 'hard' },
  { id: 'cpp-7', techId: 'cpp', front: 'Explain templates in C++', back: 'Generic programming feature that allows functions/classes to work with any type, resolved at compile time', difficulty: 'medium' },
  { id: 'cpp-8', techId: 'cpp', front: 'What is the STL?', back: 'Standard Template Library — containers (vector, map, set), algorithms (sort, find), and iterators', difficulty: 'easy' },
  { id: 'cpp-9', techId: 'cpp', front: 'Difference between stack and heap?', back: 'Stack: automatic, fast, limited size. Heap: manual (new/delete), larger, slower, risk of leaks', difficulty: 'easy' },
  { id: 'cpp-10', techId: 'cpp', front: 'What is a vtable?', back: 'Virtual table — a lookup table of function pointers used for runtime polymorphic dispatch', difficulty: 'hard' },
  { id: 'cpp-11', techId: 'cpp', front: 'What is constexpr?', back: 'Specifies that a function or variable can be evaluated at compile time', difficulty: 'medium' },
  { id: 'cpp-12', techId: 'cpp', front: 'Explain std::optional', back: 'A wrapper that may or may not contain a value, avoiding null pointers. Use has_value() and value()', difficulty: 'medium' },
  { id: 'cpp-13', techId: 'cpp', front: 'What is the auto keyword?', back: 'Compiler deduces the type automatically from the initializer expression', difficulty: 'easy' },
  { id: 'cpp-14', techId: 'cpp', front: 'What are lambda expressions?', back: 'Anonymous functions: [capture](params) -> ret { body }; e.g., [](int x) { return x*2; }', difficulty: 'medium' },
  { id: 'cpp-15', techId: 'cpp', front: 'Difference between struct and class?', back: 'Only difference: struct members are public by default, class members are private by default', difficulty: 'easy' },
  { id: 'cpp-16', techId: 'cpp', front: 'What is SFINAE?', back: 'Substitution Failure Is Not An Error — enables template specialization by silently discarding invalid substitutions', difficulty: 'hard' },
  { id: 'cpp-17', techId: 'cpp', front: 'What is std::variant?', back: 'A type-safe union that holds one of several alternative types at a time', difficulty: 'hard' },
  { id: 'cpp-18', techId: 'cpp', front: 'Explain header guards', back: '#ifndef/#define/#endif or #pragma once — prevent multiple inclusion of the same header file', difficulty: 'easy' },
  { id: 'cpp-19', techId: 'cpp', front: 'What is std::async?', back: 'Runs a function asynchronously, returning a std::future with the result', difficulty: 'medium' },
  { id: 'cpp-20', techId: 'cpp', front: 'What does volatile mean?', back: 'Tells the compiler not to optimize reads/writes to a variable as it may change outside the program flow', difficulty: 'hard' },

  // ── Unreal Engine 5 (20) ──
  { id: 'ue5-1', techId: 'ue5', front: 'What is an Actor in UE5?', back: 'Base class for objects placed in the world. Has transform, can contain components, supports lifecycle events.', difficulty: 'easy' },
  { id: 'ue5-2', techId: 'ue5', front: 'Difference between AActor and UObject?', back: 'AActor exists in the world with transform and tick. UObject is the base for all UE objects with reflection and GC.', difficulty: 'medium' },
  { id: 'ue5-3', techId: 'ue5', front: 'What is a Pawn vs Character?', back: 'Pawn can be possessed by a controller. Character extends Pawn with movement component and capsule collision.', difficulty: 'easy' },
  { id: 'ue5-4', techId: 'ue5', front: 'What are UPROPERTYs?', back: 'Macros that expose C++ properties to Unreal reflection system for Blueprints, editing, serialization, replication', difficulty: 'medium' },
  { id: 'ue5-5', techId: 'ue5', front: 'Explain the Enhanced Input System', back: 'Input Actions map to triggers (pressed, released, held). Input Mapping Context binds actions to physical inputs.', difficulty: 'medium' },
  { id: 'ue5-6', techId: 'ue5', front: 'What is Nanite?', back: 'UE5 virtualized geometry system that renders billions of polygons efficiently using mesh LOD streaming', difficulty: 'easy' },
  { id: 'ue5-7', techId: 'ue5', front: 'What is Lumen?', back: 'UE5 dynamic global illumination and reflections system — no baked lightmaps needed', difficulty: 'easy' },
  { id: 'ue5-8', techId: 'ue5', front: 'What are delegates in UE5?', back: 'Type-safe callback mechanism: DECLARE_DELEGATE binds functions to be called when an event fires', difficulty: 'medium' },
  { id: 'ue5-9', techId: 'ue5', front: 'Explain Gameplay Ability System', back: 'Framework for abilities, effects, and attributes. Uses Gameplay Tags, Ability Tasks, and Effect Specs.', difficulty: 'hard' },
  { id: 'ue5-10', techId: 'ue5', front: 'What is World Partition?', back: 'Automatic level streaming system that divides world into grid cells loaded on demand', difficulty: 'medium' },
  { id: 'ue5-11', techId: 'ue5', front: 'When to use Blueprint vs C++?', back: 'C++ for performance, core systems, networking. Blueprint for prototyping, designers, visual logic, animation graphs.', difficulty: 'easy' },
  { id: 'ue5-12', techId: 'ue5', front: 'What is a Game Mode?', back: 'Defines rules: default pawn, player controller, HUD class. Only exists on server in multiplayer.', difficulty: 'medium' },
  { id: 'ue5-13', techId: 'ue5', front: 'How does replication work?', back: 'Properties marked Replicated sync server→client. RPCs: Server (client→server), Client (server→client), NetMulticast', difficulty: 'hard' },
  { id: 'ue5-14', techId: 'ue5', front: 'What is a Subsystem?', back: 'Lifecycle-managed singleton: Engine, Editor, GameInstance, World, LocalPlayer subsystems auto-created/destroyed', difficulty: 'hard' },
  { id: 'ue5-15', techId: 'ue5', front: 'What are Gameplay Tags?', back: 'Hierarchical labels (e.g. Ability.Fire.Fireball) used for loose coupling between systems', difficulty: 'medium' },
  { id: 'ue5-16', techId: 'ue5', front: 'What is a UMG Widget?', back: 'Unreal Motion Graphics widget for UI. Created in Blueprint or C++, supports animations and bindings.', difficulty: 'easy' },
  { id: 'ue5-17', techId: 'ue5', front: 'Explain Actor Component vs Scene Component', back: 'ActorComponent has no transform. SceneComponent has transform and can be attached in hierarchy.', difficulty: 'medium' },
  { id: 'ue5-18', techId: 'ue5', front: 'What is MetaSounds?', back: 'Node-based audio system replacing legacy sound in UE5, offering procedural audio generation', difficulty: 'medium' },
  { id: 'ue5-19', techId: 'ue5', front: 'What is a Data Asset?', back: 'A UDataAsset subclass for storing shared read-only data (stats, configs) without needing a level', difficulty: 'easy' },
  { id: 'ue5-20', techId: 'ue5', front: 'Explain mass entity in UE5', back: 'Lightweight entity system for large numbers of similar actors, uses struct-of-arrays for cache efficiency', difficulty: 'hard' },

  // ── Blender (15) ──
  { id: 'bl-1', techId: 'blender', front: 'What is UV unwrapping?', back: 'Process of flattening a 3D mesh surface onto a 2D plane for texture mapping', difficulty: 'easy' },
  { id: 'bl-2', techId: 'blender', front: 'Difference between Cycles and Eevee?', back: 'Cycles: path-traced, physically accurate, slower. Eevee: rasterized, real-time, approximated lighting.', difficulty: 'easy' },
  { id: 'bl-3', techId: 'blender', front: 'What is weight painting?', back: 'Painting vertex weights to control how bones deform the mesh during animation', difficulty: 'medium' },
  { id: 'bl-4', techId: 'blender', front: 'What is a modifier?', back: 'Non-destructive operation (Subdivision, Mirror, Boolean, Array) applied to mesh before final shape', difficulty: 'easy' },
  { id: 'bl-5', techId: 'blender', front: 'What is an armature?', back: 'A skeleton of bones used for character rigging and animation', difficulty: 'easy' },
  { id: 'bl-6', techId: 'blender', front: 'Explain the difference between Edit Mode and Object Mode', back: 'Object Mode: transform whole objects. Edit Mode: modify individual vertices, edges, faces of a mesh.', difficulty: 'easy' },
  { id: 'bl-7', techId: 'blender', front: 'What are shape keys?', back: 'Stored mesh deformations for morphing between shapes, commonly used for facial expressions', difficulty: 'medium' },
  { id: 'bl-8', techId: 'blender', front: 'What is retopology?', back: 'Recreating a clean, low-poly mesh over a high-poly sculpt for animation and game use', difficulty: 'medium' },
  { id: 'bl-9', techId: 'blender', front: 'What format to export for UE5?', back: 'FBX is the standard format for exporting meshes and animations from Blender to Unreal Engine', difficulty: 'easy' },
  { id: 'bl-10', techId: 'blender', front: 'What is baking in Blender?', back: 'Pre-computing lighting, normals, or AO into texture maps for real-time rendering', difficulty: 'medium' },
  { id: 'bl-11', techId: 'blender', front: 'What are geometry nodes?', back: 'Node-based procedural modeling system for creating parametric geometry effects', difficulty: 'hard' },
  { id: 'bl-12', techId: 'blender', front: 'What is the subdivision surface modifier?', back: 'Smooths mesh by subdividing faces, adding more geometry for smoother surfaces', difficulty: 'easy' },
  { id: 'bl-13', techId: 'blender', front: 'Explain inverse kinematics (IK)', back: 'Bone constraint that calculates parent bone rotations from a target position, e.g. foot on ground', difficulty: 'hard' },
  { id: 'bl-14', techId: 'blender', front: 'What is a normal map?', back: 'A texture storing surface direction info to fake high-poly detail on low-poly mesh without extra geometry', difficulty: 'medium' },
  { id: 'bl-15', techId: 'blender', front: 'What are drivers in Blender?', back: 'Expressions that control properties based on other properties, similar to constraints but scriptable', difficulty: 'hard' },

  // ── Git (15) ──
  { id: 'git-1', techId: 'git', front: 'Difference between merge and rebase?', back: 'Merge keeps branch history with a merge commit. Rebase replays commits on top of another branch linearly.', difficulty: 'easy' },
  { id: 'git-2', techId: 'git', front: 'What is git stash?', back: 'Temporarily saves uncommitted changes so you can switch branches, then restore them with stash pop', difficulty: 'easy' },
  { id: 'git-3', techId: 'git', front: 'How to resolve merge conflicts?', back: 'Open conflicted files, choose between <<<< HEAD and >>>> branch markers, remove markers, then git add and commit', difficulty: 'medium' },
  { id: 'git-4', techId: 'git', front: 'What is cherry-pick?', back: 'Apply a specific commit from another branch to your current branch: git cherry-pick <commit-hash>', difficulty: 'medium' },
  { id: 'git-5', techId: 'git', front: 'What is git bisect?', back: 'Binary search through commits to find which one introduced a bug. Uses good/bad markings.', difficulty: 'hard' },
  { id: 'git-6', techId: 'git', front: 'Difference between fetch and pull?', back: 'Fetch downloads remote changes without merging. Pull = fetch + merge into current branch.', difficulty: 'easy' },
  { id: 'git-7', techId: 'git', front: 'What is a detached HEAD?', back: 'HEAD points directly to a commit instead of a branch. Commits made here may be lost without a branch.', difficulty: 'medium' },
  { id: 'git-8', techId: 'git', front: 'How to undo the last commit?', back: 'git reset --soft HEAD~1 (keep changes staged), git reset --hard HEAD~1 (discard changes)', difficulty: 'medium' },
  { id: 'git-9', techId: 'git', front: 'What is a git hook?', back: 'Scripts triggered by git events (pre-commit, post-merge, etc.) for automation and validation', difficulty: 'medium' },
  { id: 'git-10', techId: 'git', front: 'What does git revert do?', back: 'Creates a new commit that undoes the changes of a previous commit, preserving history', difficulty: 'easy' },
  { id: 'git-11', techId: 'git', front: 'What is interactive rebase?', back: 'git rebase -i lets you squash, reword, reorder, drop, or edit commits in your branch', difficulty: 'hard' },
  { id: 'git-12', techId: 'git', front: 'What is .gitignore?', back: 'A file listing patterns of files/directories that git should not track', difficulty: 'easy' },
  { id: 'git-13', techId: 'git', front: 'Explain git submodules', back: 'Embed a git repository as a subdirectory of another repository, tracking a specific commit', difficulty: 'hard' },
  { id: 'git-14', techId: 'git', front: 'What is git reflog?', back: 'Records all HEAD movements — useful for recovering lost commits after reset or rebase', difficulty: 'hard' },
  { id: 'git-15', techId: 'git', front: 'What is a bare repository?', back: 'A repo without a working directory, used as a central remote (like what GitHub hosts)', difficulty: 'medium' },

  // ── PyTorch (20) ──
  { id: 'pt-1', techId: 'pytorch', front: 'What is a tensor in PyTorch?', back: 'A multi-dimensional array similar to NumPy ndarray but with GPU support and autograd tracking', difficulty: 'easy' },
  { id: 'pt-2', techId: 'pytorch', front: 'What is autograd?', back: 'Automatic differentiation engine that records operations on tensors and computes gradients via backward()', difficulty: 'medium' },
  { id: 'pt-3', techId: 'pytorch', front: 'How to define a neural network?', back: 'Subclass nn.Module, define layers in __init__, implement forward() method', difficulty: 'easy' },
  { id: 'pt-4', techId: 'pytorch', front: 'What is a DataLoader?', back: 'Wraps a Dataset to provide batching, shuffling, parallel loading, and iteration', difficulty: 'easy' },
  { id: 'pt-5', techId: 'pytorch', front: 'Explain loss.backward()', back: 'Computes gradients of the loss with respect to all parameters with requires_grad=True', difficulty: 'medium' },
  { id: 'pt-6', techId: 'pytorch', front: 'What does optimizer.step() do?', back: 'Updates model parameters using computed gradients according to the optimization algorithm (SGD, Adam, etc.)', difficulty: 'easy' },
  { id: 'pt-7', techId: 'pytorch', front: 'What is a CNN?', back: 'Convolutional Neural Network — uses convolutional layers to extract spatial features from images', difficulty: 'medium' },
  { id: 'pt-8', techId: 'pytorch', front: 'Difference between train and eval mode?', back: 'model.train() enables dropout/batch norm training. model.eval() disables them for inference.', difficulty: 'medium' },
  { id: 'pt-9', techId: 'pytorch', front: 'What is transfer learning?', back: 'Using a pre-trained model (like ResNet) and fine-tuning it on your specific dataset', difficulty: 'medium' },
  { id: 'pt-10', techId: 'pytorch', front: 'How to save/load a model?', back: 'torch.save(model.state_dict(), path) to save, model.load_state_dict(torch.load(path)) to load', difficulty: 'easy' },
  { id: 'pt-11', techId: 'pytorch', front: 'What is batch normalization?', back: 'Normalizes layer inputs per batch to stabilize training and allow higher learning rates', difficulty: 'medium' },
  { id: 'pt-12', techId: 'pytorch', front: 'What is dropout?', back: 'Randomly zeroes elements during training with probability p to prevent overfitting', difficulty: 'easy' },
  { id: 'pt-13', techId: 'pytorch', front: 'Explain torch.no_grad()', back: 'Context manager that disables gradient computation, reducing memory usage during inference', difficulty: 'medium' },
  { id: 'pt-14', techId: 'pytorch', front: 'What is an embedding layer?', back: 'Maps discrete tokens (words, IDs) to dense vectors. nn.Embedding(vocab_size, embed_dim)', difficulty: 'medium' },
  { id: 'pt-15', techId: 'pytorch', front: 'What is gradient clipping?', back: 'Limits gradient magnitude to prevent exploding gradients: torch.nn.utils.clip_grad_norm_', difficulty: 'hard' },
  { id: 'pt-16', techId: 'pytorch', front: 'What is a learning rate scheduler?', back: 'Adjusts learning rate during training (StepLR, CosineAnnealingLR, ReduceLROnPlateau)', difficulty: 'medium' },
  { id: 'pt-17', techId: 'pytorch', front: 'Explain CUDA tensors', back: 'Tensors moved to GPU with .cuda() or .to("cuda") for parallel computation speedup', difficulty: 'easy' },
  { id: 'pt-18', techId: 'pytorch', front: 'What is a custom Dataset?', back: 'Subclass torch.utils.data.Dataset, implement __len__ and __getitem__ methods', difficulty: 'medium' },
  { id: 'pt-19', techId: 'pytorch', front: 'What is mixed precision training?', back: 'Using float16 for forward/backward pass with float32 master weights for speed + stability', difficulty: 'hard' },
  { id: 'pt-20', techId: 'pytorch', front: 'What is torch.jit?', back: 'TorchScript compiler that converts PyTorch models to a serializable, optimizable format', difficulty: 'hard' },

  // ── RL / PPO (20) ──
  { id: 'rl-1', techId: 'rl-ppo', front: 'What is reinforcement learning?', back: 'An agent learns by interacting with an environment, receiving rewards, and maximizing cumulative reward', difficulty: 'easy' },
  { id: 'rl-2', techId: 'rl-ppo', front: 'What is the PPO algorithm?', back: 'Proximal Policy Optimization — a policy gradient method using clipped objective to prevent large policy updates', difficulty: 'medium' },
  { id: 'rl-3', techId: 'rl-ppo', front: 'What is the policy in RL?', back: 'A mapping from states to actions (or action probabilities). Can be deterministic or stochastic.', difficulty: 'easy' },
  { id: 'rl-4', techId: 'rl-ppo', front: 'What is the value function?', back: 'Estimates expected cumulative reward from a state. V(s) for state-value, Q(s,a) for action-value.', difficulty: 'easy' },
  { id: 'rl-5', techId: 'rl-ppo', front: 'Explain actor-critic architecture', back: 'Actor selects actions (policy), Critic evaluates them (value function). Reduces variance of policy gradient.', difficulty: 'medium' },
  { id: 'rl-6', techId: 'rl-ppo', front: 'What is the advantage function?', back: 'A(s,a) = Q(s,a) - V(s). Measures how much better an action is versus the average from that state.', difficulty: 'medium' },
  { id: 'rl-7', techId: 'rl-ppo', front: 'What is GAE?', back: 'Generalized Advantage Estimation — uses exponentially-weighted mix of n-step advantages to balance bias/variance', difficulty: 'hard' },
  { id: 'rl-8', techId: 'rl-ppo', front: 'On-policy vs off-policy?', back: 'On-policy (PPO): learns from current policy data. Off-policy (DQN): learns from any data including old policies.', difficulty: 'medium' },
  { id: 'rl-9', techId: 'rl-ppo', front: 'What is the clipping in PPO?', back: 'Clips the probability ratio r(t) to [1-eps, 1+eps] to prevent destructively large policy updates', difficulty: 'hard' },
  { id: 'rl-10', techId: 'rl-ppo', front: 'What is a reward signal?', back: 'Scalar feedback from environment after each action, guiding the agent toward desired behavior', difficulty: 'easy' },
  { id: 'rl-11', techId: 'rl-ppo', front: 'What is discount factor gamma?', back: 'Trade-off between immediate and future rewards. Gamma=0 is myopic, gamma=0.99 values long-term.', difficulty: 'easy' },
  { id: 'rl-12', techId: 'rl-ppo', front: 'Exploration vs exploitation', back: 'Exploration tries new actions to discover rewards. Exploitation uses known best actions. Must balance both.', difficulty: 'easy' },
  { id: 'rl-13', techId: 'rl-ppo', front: 'What is an episode in RL?', back: 'A complete sequence of states/actions from start to terminal state (or max steps)', difficulty: 'easy' },
  { id: 'rl-14', techId: 'rl-ppo', front: 'What is entropy regularization?', back: 'Adding entropy bonus to loss encourages exploration by penalizing overly deterministic policies', difficulty: 'hard' },
  { id: 'rl-15', techId: 'rl-ppo', front: 'What are Gym environments?', back: 'OpenAI Gym (now Gymnasium) provides standard RL environments with step(), reset(), render() API', difficulty: 'easy' },
  { id: 'rl-16', techId: 'rl-ppo', front: 'What is reward shaping?', back: 'Adding intermediate rewards to guide learning when the natural reward is sparse', difficulty: 'medium' },
  { id: 'rl-17', techId: 'rl-ppo', front: 'What is a trajectory in RL?', back: 'A sequence of (state, action, reward, next_state) tuples collected during an episode', difficulty: 'easy' },
  { id: 'rl-18', techId: 'rl-ppo', front: 'What is reward normalization?', back: 'Scaling rewards to have zero mean and unit variance for more stable training', difficulty: 'medium' },
  { id: 'rl-19', techId: 'rl-ppo', front: 'What is curriculum learning in RL?', back: 'Gradually increasing task difficulty as the agent improves, speeding up learning', difficulty: 'hard' },
  { id: 'rl-20', techId: 'rl-ppo', front: 'What is observation normalization?', back: 'Running mean/std normalization of observations for stable neural network inputs', difficulty: 'medium' },

  // ── ZeroMQ (15) ──
  { id: 'zmq-1', techId: 'zeromq', front: 'What is ZeroMQ?', back: 'A high-performance async messaging library providing socket-like API for distributed/concurrent apps', difficulty: 'easy' },
  { id: 'zmq-2', techId: 'zeromq', front: 'Explain REQ-REP pattern', back: 'Request-Reply: client sends request, server sends reply. Synchronous, one message at a time.', difficulty: 'easy' },
  { id: 'zmq-3', techId: 'zeromq', front: 'Explain PUB-SUB pattern', back: 'Publisher broadcasts messages, subscribers filter by topic prefix. One-to-many distribution.', difficulty: 'easy' },
  { id: 'zmq-4', techId: 'zeromq', front: 'Explain PUSH-PULL pattern', back: 'Pipeline: pusher distributes tasks, pullers receive them. Round-robin work distribution.', difficulty: 'medium' },
  { id: 'zmq-5', techId: 'zeromq', front: 'What is bind vs connect?', back: 'bind() creates endpoint accepting connections (server). connect() connects to endpoint (client).', difficulty: 'easy' },
  { id: 'zmq-6', techId: 'zeromq', front: 'What transports does ZeroMQ support?', back: 'tcp:// (network), ipc:// (inter-process), inproc:// (inter-thread), pgm:// (multicast)', difficulty: 'medium' },
  { id: 'zmq-7', techId: 'zeromq', front: 'What is the DEALER-ROUTER pattern?', back: 'Async req-rep: DEALER sends without waiting, ROUTER routes replies to specific peers by identity', difficulty: 'hard' },
  { id: 'zmq-8', techId: 'zeromq', front: 'What is a ZeroMQ context?', back: 'Container for all sockets in a process. Usually one per process, manages I/O threads.', difficulty: 'easy' },
  { id: 'zmq-9', techId: 'zeromq', front: 'How does message framing work?', back: 'ZeroMQ sends atomic messages (not streams). Multi-part messages use SNDMORE flag.', difficulty: 'medium' },
  { id: 'zmq-10', techId: 'zeromq', front: 'What is the high water mark?', back: 'Buffer limit for send/receive. When reached, ZeroMQ blocks or drops depending on pattern.', difficulty: 'medium' },
  { id: 'zmq-11', techId: 'zeromq', front: 'What is the Proxy device?', back: 'Built-in component that forwards messages between a frontend and backend socket (like a broker)', difficulty: 'hard' },
  { id: 'zmq-12', techId: 'zeromq', front: 'How to handle slow subscribers?', back: 'Use HWM to limit queue, or use XPUB/XSUB with a proxy, or drop old messages', difficulty: 'hard' },
  { id: 'zmq-13', techId: 'zeromq', front: 'What is socket identity?', back: 'Optional label set on a socket for ROUTER to identify and route messages to specific peers', difficulty: 'medium' },
  { id: 'zmq-14', techId: 'zeromq', front: 'ZeroMQ vs traditional sockets?', back: 'ZeroMQ handles connections, reconnection, buffering, framing automatically. Message-based not byte-stream.', difficulty: 'easy' },
  { id: 'zmq-15', techId: 'zeromq', front: 'What is zmq_poll?', back: 'Event loop mechanism to monitor multiple sockets for readability/writability', difficulty: 'medium' },

  // ── FastAPI (18) ──
  { id: 'fa-1', techId: 'fastapi', front: 'What is FastAPI?', back: 'Modern Python web framework for building APIs with automatic docs, type validation, and async support', difficulty: 'easy' },
  { id: 'fa-2', techId: 'fastapi', front: 'What are Pydantic models?', back: 'Data classes with type validation. Used as request/response schemas. BaseModel subclasses with typed fields.', difficulty: 'easy' },
  { id: 'fa-3', techId: 'fastapi', front: 'How to define a GET endpoint?', back: '@app.get("/path") with async def or def function. Parameters from path, query, or body.', difficulty: 'easy' },
  { id: 'fa-4', techId: 'fastapi', front: 'Path params vs query params?', back: 'Path: /items/{id} (required). Query: /items?skip=0&limit=10 (optional with defaults).', difficulty: 'easy' },
  { id: 'fa-5', techId: 'fastapi', front: 'What is dependency injection in FastAPI?', back: 'Depends() declares reusable dependencies (auth, DB sessions) injected into route functions', difficulty: 'medium' },
  { id: 'fa-6', techId: 'fastapi', front: 'How to handle request body?', back: 'Define a Pydantic model, use it as function parameter type. FastAPI auto-parses and validates JSON.', difficulty: 'easy' },
  { id: 'fa-7', techId: 'fastapi', front: 'What is an APIRouter?', back: 'Groups related endpoints with a shared prefix and tags. Like Blueprint in Flask.', difficulty: 'medium' },
  { id: 'fa-8', techId: 'fastapi', front: 'How does FastAPI generate docs?', back: 'Automatically creates OpenAPI schema from type hints. Swagger UI at /docs, ReDoc at /redoc.', difficulty: 'easy' },
  { id: 'fa-9', techId: 'fastapi', front: 'What is response_model?', back: 'Decorator parameter that filters/validates response data, generates response schema docs', difficulty: 'medium' },
  { id: 'fa-10', techId: 'fastapi', front: 'How to raise HTTP errors?', back: 'raise HTTPException(status_code=404, detail="Item not found")', difficulty: 'easy' },
  { id: 'fa-11', techId: 'fastapi', front: 'How to add middleware?', back: 'app.add_middleware(CORSMiddleware, ...) or @app.middleware("http") decorator', difficulty: 'medium' },
  { id: 'fa-12', techId: 'fastapi', front: 'What is BackgroundTasks?', back: 'Run functions after returning response: background_tasks.add_task(func, args)', difficulty: 'medium' },
  { id: 'fa-13', techId: 'fastapi', front: 'How to handle file uploads?', back: 'Use UploadFile type: async def upload(file: UploadFile). Access with file.read(), file.filename', difficulty: 'medium' },
  { id: 'fa-14', techId: 'fastapi', front: 'What is OAuth2PasswordBearer?', back: 'Security scheme that extracts Bearer token from Authorization header for authentication', difficulty: 'hard' },
  { id: 'fa-15', techId: 'fastapi', front: 'How to use async in FastAPI?', back: 'Define endpoints with async def for I/O-bound operations. Use await for async calls.', difficulty: 'medium' },
  { id: 'fa-16', techId: 'fastapi', front: 'What is Field() in Pydantic?', back: 'Adds validation constraints and metadata: Field(min_length=1, max_length=100, description="...")', difficulty: 'medium' },
  { id: 'fa-17', techId: 'fastapi', front: 'How to test FastAPI apps?', back: 'Use TestClient from starlette.testclient: client = TestClient(app); response = client.get("/")', difficulty: 'easy' },
  { id: 'fa-18', techId: 'fastapi', front: 'What are lifespan events?', back: 'Startup/shutdown hooks: @app.on_event("startup") for DB connections, cleanup on shutdown', difficulty: 'hard' },

  // ── Federated Learning (20) ──
  { id: 'fl-1', techId: 'federated-learning', front: 'What is federated learning?', back: 'Training ML models across decentralized devices holding local data, without sharing raw data', difficulty: 'easy' },
  { id: 'fl-2', techId: 'federated-learning', front: 'Explain FedAvg algorithm', back: 'Each client trains locally, sends model updates to server. Server averages weighted updates. Repeat.', difficulty: 'medium' },
  { id: 'fl-3', techId: 'federated-learning', front: 'What is non-IID data?', back: 'Non-identically distributed — clients have different data distributions, making FL harder', difficulty: 'easy' },
  { id: 'fl-4', techId: 'federated-learning', front: 'What is differential privacy?', back: 'Adding calibrated noise to data or gradients to prevent identifying individual data points', difficulty: 'medium' },
  { id: 'fl-5', techId: 'federated-learning', front: 'Cross-device vs cross-silo FL?', back: 'Cross-device: millions of phones, unreliable. Cross-silo: few organizations, reliable, larger datasets.', difficulty: 'medium' },
  { id: 'fl-6', techId: 'federated-learning', front: 'What is client drift?', back: 'Local models diverge from global when trained too long on non-IID data. FedProx addresses this.', difficulty: 'hard' },
  { id: 'fl-7', techId: 'federated-learning', front: 'What is FedProx?', back: 'Adds proximal term to local loss to keep local updates close to global model, addressing heterogeneity', difficulty: 'hard' },
  { id: 'fl-8', techId: 'federated-learning', front: 'What is secure aggregation?', back: 'Cryptographic protocol ensuring server only sees aggregate of client updates, not individual updates', difficulty: 'hard' },
  { id: 'fl-9', techId: 'federated-learning', front: 'What is a communication round?', back: 'One cycle of: server sends model → clients train locally → clients send updates → server aggregates', difficulty: 'easy' },
  { id: 'fl-10', techId: 'federated-learning', front: 'How does client selection work?', back: 'Server randomly samples a subset of available clients each round (typically 10-100 of thousands)', difficulty: 'medium' },
  { id: 'fl-11', techId: 'federated-learning', front: 'What is model compression in FL?', back: 'Reducing communication cost by quantizing, sparsifying, or distilling model updates', difficulty: 'hard' },
  { id: 'fl-12', techId: 'federated-learning', front: 'What are stragglers in FL?', back: 'Slow clients that delay aggregation. Solutions: async aggregation, timeouts, client weighting.', difficulty: 'medium' },
  { id: 'fl-13', techId: 'federated-learning', front: 'What is gradient compression?', back: 'Sending only top-k gradients or quantized gradients to reduce communication bandwidth', difficulty: 'hard' },
  { id: 'fl-14', techId: 'federated-learning', front: 'What is personalized FL?', back: 'Each client gets a customized model, balancing global knowledge with local specialization', difficulty: 'medium' },
  { id: 'fl-15', techId: 'federated-learning', front: 'What is SCAFFOLD?', back: 'Uses control variates to correct client drift, converges faster than FedAvg on non-IID data', difficulty: 'hard' },
  { id: 'fl-16', techId: 'federated-learning', front: 'What are Byzantine attacks in FL?', back: 'Malicious clients sending corrupted updates to poison the global model', difficulty: 'medium' },
  { id: 'fl-17', techId: 'federated-learning', front: 'What is the IID assumption?', back: 'Data is identically and independently distributed — each client has a representative sample', difficulty: 'easy' },
  { id: 'fl-18', techId: 'federated-learning', front: 'How to evaluate FL models?', back: 'Test on held-out centralized test set or per-client test sets. Track convergence across rounds.', difficulty: 'easy' },
  { id: 'fl-19', techId: 'federated-learning', front: 'What is federated distillation?', back: 'Clients share model predictions/logits instead of gradients, reducing communication and privacy risk', difficulty: 'hard' },
  { id: 'fl-20', techId: 'federated-learning', front: 'What is Flower (FL framework)?', back: 'Open-source Python framework for federated learning research. Provides client/server abstractions.', difficulty: 'easy' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const collection = mongoose.connection.db.collection('flashcards');
    await collection.deleteMany({});
    console.log('Cleared existing flashcards');

    await collection.insertMany(FLASHCARDS);
    console.log(`Seeded ${FLASHCARDS.length} flashcards across ${[...new Set(FLASHCARDS.map(f => f.techId))].length} technologies`);

    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
