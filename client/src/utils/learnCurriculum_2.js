/** @fileoverview Learn curriculum part 2 — UE5, Blender, PyTorch */

/** UE5 curriculum — 6 topics (conceptual, no code runner needed — theory heavy) */
export const UE5_TOPICS = [
    {
        id: 'editor', title: 'Editor Basics', icon: '🖥️', color: 'cyan', xp: 100,
        description: 'Navigate the UE5 interface, viewports, and content browser.',
        sections: [
            {
                type: 'theory', title: 'Unreal Engine 5 Interface', content: `## Main Panel Areas
- **Viewport** — 3D scene view. WASD + right-click to fly.
- **Content Browser** — all your assets (meshes, materials, BPs)
- **Outliner** — hierarchy of all Actors in the scene
- **Details Panel** — selected Actor's properties
- **World Settings** — level-wide properties

## Viewport Navigation
| Action | Input |
|--------|-------|
| Fly | Right-click + WASD |
| Orbit | Alt + Left-click |
| Pan | Alt + Middle-click |
| Focus | F key on selected |
| Frame all | Home |

## Key Concepts
- **Actor** — anything placed in the world (mesh, light, camera)
- **Level** — a scene/map file (\`.umap\`)
- **World** — the container for all Levels
- **Transform** — position (W), rotation (E), scale (R)` },
            {
                type: 'code', title: 'UE5 Terminology Quiz', code: `# UE5 key concepts quiz
terms = {
    "Actor": "Any placeable object in the UE5 world",
    "Blueprint": "UE5's visual scripting system",
    "Component": "Modular piece added to an Actor (mesh, collision, audio)",
    "Pawn": "An Actor that can be possessed and controlled",
    "Character": "A Pawn with movement and animation built in",
    "GameMode": "Defines the rules of the game (spawn, win conditions)",
    "Lumen": "UE5's dynamic global illumination system",
    "Nanite": "UE5's virtualized geometry for unlimited polygon detail",
}

print("UE5 Key Terms:")
for term, desc in terms.items():
    print(f"  {term}: {desc}")` },
            {
                type: 'challenge', challengeType: 'mcq', title: 'Actor vs Component',
                question: 'Which of the following statements is true regarding UE5 Actors and Components?',
                options: [
                    'An Actor can only have one Component.',
                    'A Component CONTAINS Actors.',
                    'An Actor CONTAINS Components.',
                    'Actors and Components are the exact same thing.'
                ],
                correctAnswerIndex: 2,
                hint: 'Think about which one is placed in the level, and which one is attached to it.'
            },
        ],
    },
    {
        id: 'blueprints', title: 'Blueprints Intro', icon: '📐', color: 'purple', xp: 100,
        description: 'Use Blueprint visual scripting to add gameplay logic without C++.',
        sections: [
            {
                type: 'theory', title: 'Blueprint Visual Scripting', content: `## What is a Blueprint?
Blueprints (BPs) are **visual scripts** — node graphs that define behavior without writing C++.

## Blueprint Types
| Type | Purpose |
|------|---------|
| Actor Blueprint | A placed world object with logic |
| Character Blueprint | Player/NPC with movement |
| Widget Blueprint | UI (buttons, health bars) |
| GameMode Blueprint | Level rules |

## Key Nodes
- **Event BeginPlay** — runs once when the game starts
- **Event Tick** — runs every frame (use sparingly!)
- **Print String** — debug output
- **Branch** — if/else
- **For Loop** — iteration
- **Cast To** — safely access a specific class's properties

## Blueprint vs C++
Use **Blueprints** for: iteration, designers, rapid prototyping
Use **C++** for: performance-critical code, complex systems, reusable plugins` },
            {
                type: 'code', title: 'Blueprint Logic in Python', code: `# Model Blueprint logic with Python

class BlueprintActor:
    def __init__(self, name):
        self.name = name
        self.health = 100
        self.speed = 600

    def begin_play(self):
        """Event BeginPlay equivalent"""
        print(f"[BeginPlay] {self.name} spawned!")

    def tick(self, delta_time):
        """Event Tick equivalent — careful with performance!"""
        pass  # only use if necessary

    def take_damage(self, amount):
        """Custom event"""
        self.health -= amount
        if self.health <= 0:
            self.destroyed()

    def destroyed(self):
        print(f"{self.name} destroyed!")

class BP_Enemy(BlueprintActor):
    def begin_play(self):
        super().begin_play()
        print(f"  Enemy ready, HP: {self.health}")

enemy = BP_Enemy("Goblin")
enemy.begin_play()
enemy.take_damage(60)
enemy.take_damage(60)` },
            {
                type: 'challenge', challengeType: 'mcq', title: 'Blueprint Events',
                question: 'In what order do the core lifecycle Blueprint events fire?',
                options: [
                    'Tick → BeginPlay → EndPlay',
                    'BeginPlay → Tick → EndPlay',
                    'EndPlay → BeginPlay → Tick',
                    'BeginPlay → EndPlay → Tick'
                ],
                correctAnswerIndex: 1,
                hint: 'It starts, then it runs every frame, then it is destroyed.'
            },
        ],
    },
    {
        id: 'cpp-ue5', title: 'C++ in UE5', icon: '⚙️', color: 'gold', xp: 125,
        description: 'Write C++ Actor classes, expose properties to Blueprints, and understand UE macros.',
        sections: [
            {
                type: 'theory', title: 'C++ with Unreal', content: `## A Basic C++ Actor
\`\`\`cpp
// MyActor.h
#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MyActor.generated.h"

UCLASS()
class MYGAME_API AMyActor : public AActor {
    GENERATED_BODY()
public:
    AMyActor();

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Stats")
    float Health = 100.f;

    UFUNCTION(BlueprintCallable, Category="Stats")
    void TakeDamage(float Amount);
};
\`\`\`

## UE Macros
| Macro | Purpose |
|-------|---------|
| \`UCLASS()\` | marks a class for reflection |
| \`UPROPERTY()\` | exposes variable to editor/BP |
| \`UFUNCTION()\` | exposes function to BP |
| \`GENERATED_BODY()\` | required boilerplate |

## Naming Conventions
- \`A\` prefix — Actors (\`AMyCharacter\`)
- \`U\` prefix — UObjects (\`UHealthComponent\`)
- \`F\` prefix — structs (\`FPlayerData\`)
- \`E\` prefix — enums (\`EGameState\`)` },
            {
                type: 'code', title: 'UE5 Naming Practice', code: `# UE5 class naming conventions

classes = [
    ("Actor", "Player Character", "APlayerCharacter"),
    ("Actor", "Enemy Goblin", "AEnemyGoblin"),
    ("UObject", "Health Component", "UHealthComponent"),
    ("UObject", "Inventory Manager", "UInventoryManager"),
    ("Struct", "Player Stats", "FPlayerStats"),
    ("Enum", "Game State", "EGameState"),
]

prefixes = {"Actor": "A", "UObject": "U", "Struct": "F", "Enum": "E"}

print("UE5 Naming Convention:")
for type_, name, correct in classes:
    words = name.split()
    auto = prefixes[type_] + "".join(w.capitalize() for w in words)
    match = "✓" if auto == correct else "✗"
    print(f"  {match} {type_}: {name} → {auto}")` },
            {
                type: 'challenge', challengeType: 'mcq', title: 'UPROPERTY Flags',
                question: 'Which UPROPERTY flags should you use to make a variable visible and editable in both the C++ Editor panel and Blueprint graphs?',
                options: [
                    'VisibleAnywhere, BlueprintReadOnly',
                    'EditAnywhere, BlueprintReadWrite',
                    'EditDefaultsOnly, BlueprintCallable',
                    'VisibleDefaultsOnly, BlueprintPure'
                ],
                correctAnswerIndex: 1,
                hint: 'You want to Edit it anywhere, and Read/Write it in Blueprints.'
            },
        ],
    },
    {
        id: 'input', title: 'Input System', icon: '🎮', color: 'cyan', xp: 100,
        description: 'Set up Enhanced Input Actions, mappings, and handle player input in C++/BP.',
        sections: [
            {
                type: 'theory', title: 'Enhanced Input System', content: `UE5 uses the **Enhanced Input** plugin — more powerful than the legacy system.

## Key Concepts
- **Input Action** — a single logical action (e.g. "Jump", "Move")
- **Input Mapping Context (IMC)** — groups of bindings for a context (on-foot, in-vehicle)
- **Input Modifiers** — transform raw input (dead zone, negate, swizzle)
- **Input Triggers** — when to fire (pressed, held, released)

## Setup Steps
1. Enable Enhanced Input plugin in project settings
2. Create **Input Action** assets (IA_Jump, IA_Move)
3. Create **Input Mapping Context** (IMC_Default)
4. Add IA → key bindings in IMC
5. Apply IMC in character's BeginPlay
6. Bind actions in character's SetupPlayerInputComponent

## Blueprint Binding
Use **Enhanced Input Action** nodes — \`IA_Jump → Triggered → Jump()\`` },
            {
                type: 'code', title: 'Input Action Names', code: `# Good naming for Enhanced Input Assets

input_actions = {
    "IA_Move": "2D axis for WASD movement",
    "IA_Look": "2D axis for mouse/stick look",
    "IA_Jump": "bool — triggered on Space/A-button",
    "IA_Sprint": "bool — held on Shift/L-stick",
    "IA_Crouch": "bool — toggle on C/RS-click",
    "IA_PrimaryFire": "bool — triggered on LMB/R-trigger",
    "IA_SecondaryFire": "bool — triggered on RMB/L-trigger",
    "IA_Interact": "bool — triggered on E/X-button",
}

print("Enhanced Input Actions:")
for ia, desc in input_actions.items():
    print(f"  {ia}: {desc}")` },
            {
                type: 'challenge', challengeType: 'mcq', title: 'Input Architecture',
                question: 'In the UE5 Enhanced Input system, what is the role of the Input Mapping Context (IMC)?',
                options: [
                    'It defines what "Jump" means logically.',
                    'It executes the C++ function when a button is pressed.',
                    'It maps raw physical keys (like Spacebar) to logical Input Actions (like Jump).',
                    'It is the legacy replacement for the old Axis Mappings.'
                ],
                correctAnswerIndex: 2,
                hint: 'It bridges the gap between hardware keys and the abstract actions you defined.'
            },
        ],
    },
    {
        id: 'character', title: 'Character Movement', icon: '🏃', color: 'purple', xp: 100,
        description: 'ACharacter, CharacterMovementComponent, and physics-based locomotion.',
        sections: [
            {
                type: 'theory', title: 'ACharacter & Movement', content: `## ACharacter Class
\`ACharacter\` extends \`APawn\` and includes:
- \`UCapsuleComponent\` — collision
- \`USkeletalMeshComponent\` — visible body
- \`UCharacterMovementComponent\` — physics movement
- \`USpringArmComponent\` + \`UCameraComponent\` — (added manually)

## Key Movement Properties
\`\`\`cpp
// In constructor:
GetCharacterMovement()->MaxWalkSpeed = 600.f;
GetCharacterMovement()->JumpZVelocity = 700.f;
GetCharacterMovement()->AirControl = 0.35f;
GetCharacterMovement()->GravityScale = 1.75f;
\`\`\`

## Movement Functions
\`\`\`cpp
// In character C++:
AddMovementInput(Direction, Scale);
AddControllerYawInput(Delta);
AddControllerPitchInput(Delta);
Jump();   // inherited
StopJumping();
\`\`\`` },
            {
                type: 'code', title: 'Movement Properties', code: `# Simulate character movement settings

class CharacterMovement:
    def __init__(self):
        self.max_walk_speed = 600.0
        self.max_run_speed = 1200.0
        self.jump_z_velocity = 700.0
        self.air_control = 0.35
        self.gravity_scale = 1.75
        self.is_sprinting = False

    def sprint(self, enable):
        self.is_sprinting = enable
        print(f"Sprint: {'ON' if enable else 'OFF'}")

    def jump(self):
        print(f"Jumped! Z velocity: {self.jump_z_velocity}")

    def get_current_speed(self):
        return self.max_run_speed if self.is_sprinting else self.max_walk_speed

    def print_stats(self):
        print(f"Speed: {self.get_current_speed()} cm/s")
        print(f"Jump: {self.jump_z_velocity} cm/s")
        print(f"Gravity: {self.gravity_scale}x")

mc = CharacterMovement()
mc.print_stats()
mc.sprint(True)
print(f"Speed: {mc.get_current_speed()} cm/s")
mc.jump()` },
            {
                type: 'challenge', title: 'Speed Calculator', instructions: `A character walks at 600 cm/s and sprints at 1200 cm/s.\n\nCalculate and print travel time for 36000 cm (360m):\n- Walking: **"Walk: 60s"**\n- Sprinting: **"Sprint: 30s"**`, starterCode: `distance = 36000  # cm

walk_speed = 600
sprint_speed = 1200

walk_time = distance / walk_speed
sprint_time = distance / sprint_speed

print(f"Walk: {walk_time:.0f}s")
print(f"Sprint: {sprint_time:.0f}s")`,
                check: (out) => out.includes('60') && out.includes('30'), hint: 'Walk=60s, Sprint=30s'
            },
        ],
    },
    {
        id: 'hud', title: 'Game Modes & HUD', icon: '🖼️', color: 'orange', xp: 100,
        description: 'AGameMode, AHUD, UUserWidget and building game UI with UMG.',
        sections: [
            {
                type: 'theory', title: 'Game Framework & UI', content: `## AGameMode
Controls the rules of your game — what pawn to spawn, how to start, win/lose conditions.
\`\`\`cpp
class AMyGameMode : public AGameMode {
public:
    AMyGameMode();
    virtual void BeginPlay() override;
    void CheckWinCondition();
};
\`\`\`

## UUserWidget (UMG)
UE5's UI system. Create Widget BPs with drag-and-drop UI editor.
\`\`\`cpp
// Show a widget
auto Widget = CreateWidget<UMyHUD>(GetWorld(), HUDClass);
Widget->AddToViewport();

// Bind data with UPROPERTY
UPROPERTY(BlueprintReadWrite, meta=(BindWidget))
UTextBlock* HealthText;
\`\`\`

## Common HUD Elements
- \`UTextBlock\` — text labels
- \`UProgressBar\` — health/mana bars
- \`UImage\` — icons/backgrounds
- \`UButton\` — clickable buttons
- \`UCanvasPanel\` — free-form layout` },
            {
                type: 'code', title: 'HUD Data Model', code: `# Model HUD data flow

class PlayerHUD:
    def __init__(self, player):
        self.player = player
        self.visible = True

    def get_health_pct(self):
        return self.player.hp / self.player.max_hp

    def render(self):
        hp_pct = self.get_health_pct()
        bar = "█" * int(hp_pct * 20) + "░" * int((1-hp_pct) * 20)
        print(f"HP  [{bar}] {self.player.hp}/{self.player.max_hp}")
        print(f"XP  {self.player.xp:,}")
        print(f"Lvl {self.player.level}")

class Player:
    hp = 75; max_hp = 100; xp = 14250; level = 8

hud = PlayerHUD(Player())
hud.render()` },
            {
                type: 'challenge', title: 'Game State Machine', instructions: `Print a simple game state machine with 4 states:\n- **MainMenu → Loading**\n- **Loading → Playing**\n- **Playing → Paused**\n- **Playing → GameOver**`, starterCode: `transitions = [
    ("MainMenu", "Loading"),
    ("Loading", "Playing"),
    ("Playing", "Paused"),
    ("Playing", "GameOver"),
]

for src, dst in transitions:
    print(f"{src} → {dst}")`,
                check: (out) => out.includes('MainMenu') && out.includes('GameOver'), hint: 'Print all 4 transitions'
            },
        ],
    },
];

/** Blender curriculum — 6 topics */
export const BLENDER_TOPICS = [
    {
        id: 'interface', title: 'Interface & Navigation', icon: '🖱️', color: 'orange', xp: 75,
        description: 'Master the Blender interface, viewports, and essential keyboard shortcuts.',
        sections: [
            {
                type: 'theory', title: 'Blender Basics', content: `## Main Areas
- **3D Viewport** — where you model and animate
- **Timeline** — keyframe/animation control
- **Properties** — object, material, render settings
- **Outliner** — scene hierarchy

## Essential Shortcuts
| Action | Shortcut |
|--------|---------|
| Orbit | Middle-click drag |
| Pan | Shift + Middle-click |
| Zoom | Scroll wheel |
| Numpad views | 1=front, 3=side, 7=top |
| Full object view | Numpad 0 |

## Edit Mode vs Object Mode
- **Object Mode** (Tab) — select/transform whole objects
- **Edit Mode** (Tab) — select vertices/edges/faces

## Selection
- **G** — grab (move)
- **R** — rotate
- **S** — scale
- **X/Y/Z** — constrain to axis after G/R/S` },
            {
                type: 'code', title: 'Blender Shortcuts Reference', code: `# Common Blender shortcuts organized by category

shortcuts = {
    "Navigation": {
        "Orbit": "Middle Mouse Button",
        "Pan": "Shift + MMB",
        "Zoom": "Scroll Wheel",
        "Front view": "Numpad 1",
        "Side view": "Numpad 3",
        "Top view": "Numpad 7",
    },
    "Transform": {
        "Grab/Move": "G",
        "Rotate": "R",
        "Scale": "S",
        "Lock to X-axis": "G then X",
        "Lock to Y-axis": "G then Y",
        "Lock to Z-axis": "G then Z",
    },
    "Mesh Edit": {
        "Toggle Edit Mode": "Tab",
        "Vertex select": "1",
        "Edge select": "2",
        "Face select": "3",
        "Extrude": "E",
        "Loop cut": "Ctrl+R",
    },
}

for category, cmds in shortcuts.items():
    print(f"\\n{category}:")
    for action, key in cmds.items():
        print(f"  {action}: {key}")` },
            {
                type: 'challenge', title: 'Mode Selection', instructions: `Print the correct Blender mode for each task:\n- Positioning objects in scene: **Object Mode**\n- Adding edge loops: **Edit Mode**\n- Painting weights: **Weight Paint Mode**\n- Sculpting organic shapes: **Sculpt Mode**`, starterCode: `tasks = [
    ("Positioning objects in scene", "Object Mode"),
    ("Adding edge loops", "Edit Mode"),
    ("Painting weights", "Weight Paint Mode"),
    ("Sculpting organic shapes", "Sculpt Mode"),
]

for task, mode in tasks:
    print(f"{task}: {mode}")`,
                check: (out) => out.includes('Object Mode') && out.includes('Edit Mode') && out.includes('Sculpt Mode'), hint: 'Print all 4 tasks with their modes'
            },
        ],
    },
    {
        id: 'modeling', title: 'Basic Modeling', icon: '📦', color: 'cyan', xp: 75,
        description: 'Box modeling, extrusion, loop cuts, and building shapes from primitives.',
        sections: [
            {
                type: 'theory', title: 'Polygon Modeling', content: `## Start with Primitives
Add mesh: **Shift+A → Mesh → Cube/Sphere/Cylinder**

## Core Operations (Edit Mode)
| Tool | Shortcut | Purpose |
|------|----------|---------|
| Extrude | E | Extend faces/edges |
| Inset | I | Create inset face |
| Bevel | Ctrl+B | Round edges |
| Loop Cut | Ctrl+R | Add edge loops |
| Knife | K | Cut custom edges |
| Merge | M | Combine vertices |

## Box Modeling Workflow
1. Start with a Cube
2. Enable Subdivision Surface modifier
3. Extrude major forms
4. Add edge loops for detail
5. Refine silhouette
6. Add support edges for sharp creases

## N-gons vs Quads
- Always prefer **quad faces** (4 vertices)
- Avoid n-gons (5+ vertices) in deforming meshes
- Triangles are OK for static game meshes` },
            {
                type: 'code', title: 'Mesh Operations', code: `# Model mesh operations conceptually

class Mesh:
    def __init__(self, name):
        self.name = name
        self.verts = []
        self.faces = []
        self.modifiers = []

    def add_primitive(self, type_, verts, faces):
        self.verts.extend(verts)
        self.faces.extend(faces)
        print(f"Added {type_}: {verts} verts, {faces} faces")

    def extrude_face(self, face_idx, direction, amount):
        print(f"Extruded face {face_idx} by {amount} units in {direction}")
        self.faces.append(f"extruded_{face_idx}")

    def add_modifier(self, mod):
        self.modifiers.append(mod)
        print(f"Added modifier: {mod}")

    def stats(self):
        print(f"\\n{self.name}: {len(self.verts)} verts, {len(self.faces)} faces")
        if self.modifiers:
            print(f"  Modifiers: {', '.join(self.modifiers)}")

mesh = Mesh("Character Base")
mesh.add_primitive("Cube", 8, 6)
mesh.add_modifier("Mirror")
mesh.add_modifier("Subdivision Surface")
mesh.extrude_face(0, "Z", 1.5)
mesh.extrude_face(1, "X", 0.5)
mesh.stats()` },
            {
                type: 'challenge', title: 'Face Count', instructions: `A cube has 6 faces and 8 vertices. After one extrusion:\n- 5 NEW faces are added (4 sides + 1 top)\n- 4 NEW vertices are added\n\nPrint: **"After extrude: 11 faces, 12 verts"**`, starterCode: `faces = 6
verts = 8

# One extrusion adds 5 faces and 4 verts
faces += 5
verts += 4

print(f"After extrude: {faces} faces, {verts} verts")`,
                check: (out) => out.includes('11 faces') && out.includes('12 verts'), hint: 'Add 5 faces and 4 verts to defaults'
            },
        ],
    },
    {
        id: 'modifiers', title: 'Modifiers', icon: '⚙️', color: 'purple', xp: 75,
        description: 'Non-destructive modeling with modifiers: Subdivision, Mirror, Array, Boolean.',
        sections: [
            {
                type: 'theory', title: 'Blender Modifiers', content: `Modifiers are **non-destructive** operations applied on top of your mesh.

## Most Important Modifiers
| Modifier | Purpose |
| ---------|---------|
| **Subdivision Surface** | Smooth/divide mesh for high detail |
| **Mirror** | Mirror across X/Y/Z — model only half! |
| **Array** | Repeat an object N times |
| **Boolean** | Add/subtract/intersect another mesh |
| **Solidify** | Add thickness to flat surfaces |
| **Bevel** | Round all edges automatically |
| **Armature** | Deform mesh with a skeleton |

## Apply Order Matters
Modifiers are applied top-to-bottom. Mirror before SubDiv gives different results than SubDiv before Mirror.

## Realtime vs Render
Each modifier has an eye icon (viewport) and camera icon (render). Usually keep both on during modeling.` },
            {
                type: 'code', title: 'Modifier Stack Simulation', code: `# Simulate a modifier stack

modifiers = [
    {"name": "Mirror", "axis": "X", "active": True},
    {"name": "Bevel", "amount": 0.02, "segments": 2, "active": True},
    {"name": "Subdivision Surface", "levels": 2, "active": True},
    {"name": "Armature", "object": "Rig", "active": False},
]

base_verts = 24
base_faces = 20

def apply_modifier(verts, faces, mod):
    name = mod["name"]
    if name == "Mirror":
        verts = verts * 2 - 4  # approx
        faces = faces * 2
        print(f"  Mirror X: {verts}v {faces}f")
    elif name == "Subdivision Surface":
        lvl = mod.get("levels", 1)
        verts = verts * (4 ** lvl)
        faces = faces * (4 ** lvl)
        print(f"  SubDiv L{lvl}: {verts}v {faces}f")
    return verts, faces

print("Modifier stack:")
v, f = base_verts, base_faces
for mod in modifiers:
    if mod["active"]:
        v, f = apply_modifier(v, f, mod)
print(f"\\nFinal: {v} verts, {f} faces")` },
            {
                type: 'challenge', title: 'Modifier Order', instructions: `Print the recommended modifier order for a character mesh (top to bottom):\n1. Mirror\n2. Bevel\n3. Subdivision Surface\n4. Armature`, starterCode: `order = ["Mirror", "Bevel", "Subdivision Surface", "Armature"]

for i, mod in enumerate(order, 1):
    print(f"{i}. {mod}")`,
                check: (out) => out.includes('Mirror') && out.includes('Armature'), hint: 'Print all 4 in order'
            },
        ],
    },
    {
        id: 'uv', title: 'UV Unwrapping', icon: '📄', color: 'gold', xp: 75,
        description: 'Unwrap 3D meshes to 2D for texturing in game engines.',
        sections: [
            {
                type: 'theory', title: 'UV Mapping', content: `## What are UVs?
UVs map a 3D mesh surface to a 2D texture. U = horizontal, V = vertical (both 0 to 1).

## Unwrapping Workflow
1. Mark seams: **Edit Mode → Edge select → Mark Seam**
2. Unwrap: **U → Unwrap**
3. Check layout in UV Editor
4. Pack islands: **UV → Pack Islands**

## Seam Placement Tips
- Put seams where they'll be hidden (armpits, back of head)
- Minimize stretching — check with texture grid
- Keep important areas large (face, hands)

## Unwrap Methods
| Method | When to use |
|--------|-------------|
| Unwrap | General meshes with seams |
| Smart UV Project | Fast bulk unwrap |
| Project from View | Flat surfaces |
| Cube Projection | Box-like objects |

## Texel Density
Keep consistent texel density — pixels per centimeter should be uniform across the mesh.` },
            {
                type: 'code', title: 'UV Coverage Calculator', code: `# Calculate UV island coverage and texel density

def uv_coverage(island_area, total_uv_space=1.0):
    """Returns % of UV space used"""
    return (island_area / total_uv_space) * 100

def texel_density(texture_res, uv_scale, world_size_m):
    """Pixels per centimeter in world space"""
    pixels = texture_res * uv_scale
    cm = world_size_m * 100
    return pixels / cm

# Example: 2048 texture, head takes 20% of UV space
# Head is 25cm in world

islands = [
    ("Head",  0.20, 25),
    ("Torso", 0.35, 60),
    ("Arms",  0.25, 80),
    ("Legs",  0.20, 90),
]

tex_res = 2048
total = sum(a for _, a, _ in islands)

print(f"UV Coverage: {total*100:.0f}% (target: 70-90%)")
print("\\nTexel Density:")
for name, uv, size in islands:
    td = texel_density(tex_res, uv, size / 100)
    print(f"  {name}: {td:.1f} px/cm")` },
            {
                type: 'challenge', title: 'Seam Placement', instructions: `Print the best seam locations for a humanoid character:\n- **Head: back of skull**\n- **Torso: sides under arms**\n- **Arms: inner bicep**\n- **Legs: inner thigh**`, starterCode: `seams = [
    ("Head", "back of skull"),
    ("Torso", "sides under arms"),
    ("Arms", "inner bicep"),
    ("Legs", "inner thigh"),
]

for part, location in seams:
    print(f"{part}: {location}")`,
                check: (out) => out.includes('Head') && out.includes('inner'), hint: 'Print all 4 seam locations'
            },
        ],
    },
    {
        id: 'materials', title: 'Materials & Shading', icon: '🎨', color: 'cyan', xp: 75,
        description: 'PBR materials, Shader Editor nodes, and exporting for game engines.',
        sections: [
            {
                type: 'theory', title: 'PBR Materials in Blender', content: `## PBR (Physically Based Rendering)
PBR uses real-world material properties for consistent rendering.

## Main Inputs on Principled BSDF
| Input | Purpose |
|-------|---------|
| Base Color | Albedo texture |
| Metallic | 0=dielectric, 1=metal |
| Roughness | 0=mirror, 1=fully rough |
| Normal | surface detail from normal map |
| Alpha | transparency |

## Texture Types
- **Diffuse/Albedo** — color information, no lighting
- **Normal Map** — fake surface detail
- **Roughness Map** — sheen control
- **Metallic Map** — metal/non-metal mask
- **AO Map** — ambient occlusion (shadow in crevices)

## Export for UE5
UE5 prefers **ORM** texture packing:
- R = Occlusion
- G = Roughness
- B = Metallic` },
            {
                type: 'code', title: 'Material Property Calculator', code: `# PBR material properties for different surface types

materials = {
    "Polished Metal": {"metallic": 1.0, "roughness": 0.1, "ior": 1.0},
    "Brushed Metal":  {"metallic": 1.0, "roughness": 0.6, "ior": 1.0},
    "Plastic":        {"metallic": 0.0, "roughness": 0.4, "ior": 1.45},
    "Glass":          {"metallic": 0.0, "roughness": 0.0, "ior": 1.52},
    "Skin":           {"metallic": 0.0, "roughness": 0.7, "ior": 1.36},
    "Wood":           {"metallic": 0.0, "roughness": 0.8, "ior": 1.5},
}

print(f"{'Material':<20} {'Metallic':>10} {'Roughness':>10} {'IOR':>6}")
print("-" * 50)
for name, props in materials.items():
    print(f"{name:<20} {props['metallic']:>10.1f} {props['roughness']:>10.1f} {props['ior']:>6.2f}")` },
            {
                type: 'challenge', title: 'Metallic vs Dielectric', instructions: `Print the metallic value for each material:\n- Gold: **1.0**\n- Wood: **0.0**\n- Chrome: **1.0**\n- Rubber: **0.0**`, starterCode: `materials = [
    ("Gold", 1.0),
    ("Wood", 0.0),
    ("Chrome", 1.0),
    ("Rubber", 0.0),
]

for mat, metallic in materials:
    print(f"{mat}: {metallic}")`,
                check: (out) => out.includes('Gold: 1.0') && out.includes('Wood: 0.0'), hint: 'Metals are 1.0, non-metals are 0.0'
            },
        ],
    },
    {
        id: 'rigging', title: 'Rigging Basics', icon: '🦴', color: 'purple', xp: 75,
        description: 'Create armatures, parent meshes, weight paint, and export for game engines.',
        sections: [
            {
                type: 'theory', title: 'Rigging in Blender', content: `## What is Rigging?
Rigging adds a **skeleton (armature)** to deform your mesh — needed for animations.

## Workflow
1. **Add Armature**: Shift+A → Armature → Single Bone
2. **Edit Mode**: Add/extrude bones for the skeleton
3. **Parent mesh to armature**: Select mesh → Shift+select rig → Ctrl+P → With Automatic Weights
4. **Weight Paint Mode**: Refine which bones influence which vertices
5. **Pose Mode**: Test deformation

## Bone Hierarchy
\`\`\`
Root
├── Spine
│   ├── Chest
│   │   ├── Neck → Head
│   │   ├── ArmL → ForearmL → HandL
│   │   └── ArmR → ForearmR → HandR
│   └── HipL → ThighL → ShinL → FootL
\`\`\`

## Weight Painting
Vertex colors show influence: **Red=100%**, **Blue=0%**
Smooth gradients at joints = natural deformation.` },
            {
                type: 'code', title: 'Bone Hierarchy Printer', code: `# Print a humanoid rig hierarchy

rig = {
    "Root": {
        "Pelvis": {
            "Spine01": {
                "Spine02": {
                    "Chest": {
                        "Neck": {"Head": {}},
                        "Shoulder.L": {"UpperArm.L": {"LowerArm.L": {"Hand.L": {}}}},
                        "Shoulder.R": {"UpperArm.R": {"LowerArm.R": {"Hand.R": {}}}},
                    }
                }
            },
            "Thigh.L": {"Shin.L": {"Foot.L": {"Toe.L": {}}}},
            "Thigh.R": {"Shin.R": {"Foot.R": {"Toe.R": {}}}},
        }
    }
}

def print_rig(node, indent=0):
    for bone, children in node.items():
        print("  " * indent + f"{'└─ ' if indent else ''}{bone}")
        print_rig(children, indent + 1)

print_rig(rig)` },
            {
                type: 'challenge', title: 'Weight Sum', instructions: `A vertex is influenced by 3 bones. Weights must sum to 1.0:\n- Thigh: 0.7\n- Shin: 0.2\n- Pelvis: 0.1\n\nPrint: **"Total weight: 1.0 ✓"**`, starterCode: `weights = {"Thigh": 0.7, "Shin": 0.2, "Pelvis": 0.1}

total = sum(weights.values())
status = "✓" if abs(total - 1.0) < 0.001 else "✗ (should be 1.0)"
print(f"Total weight: {total} {status}")`,
                check: (out) => out.includes('1.0') && out.includes('✓'), hint: 'Weights should sum to exactly 1.0'
            },
        ],
    },
];

/** PyTorch curriculum — 6 topics */
export const PYTORCH_TOPICS = [
    {
        id: 'tensors', title: 'Tensors', icon: '🔢', color: 'orange', xp: 100,
        description: 'PyTorch tensors — creation, operations, broadcasting, and GPU support.',
        sections: [
            {
                type: 'theory', title: 'PyTorch Tensors', content: `A **tensor** is an N-dimensional array — the core data structure in PyTorch.

## Creating Tensors
\`\`\`python
import torch
x = torch.tensor([1, 2, 3])          # from list
z = torch.zeros(3, 4)                 # 3×4 of zeros
o = torch.ones(2, 3)                  # 2×3 of ones
r = torch.randn(5, 5)                 # 5×5 random normal
a = torch.arange(0, 10, 2)           # [0, 2, 4, 6, 8]
\`\`\`

## Key Attributes
\`\`\`python
x.shape     # dimensions (torch.Size)
x.dtype     # data type (float32, int64…)
x.device    # cpu or cuda
\`\`\`

## Operations
\`\`\`python
a + b       # elementwise add
a @ b       # matrix multiply
a.T         # transpose
a.reshape(2, -1)  # reshape
a.sum()     # sum all elements
a.mean(dim=0)     # mean along dimension
\`\`\`

## GPU
\`\`\`python
device = "cuda" if torch.cuda.is_available() else "cpu"
x = x.to(device)
\`\`\`` },
            {
                type: 'code', title: 'Tensor Operations', code: `import torch

# Create tensors
a = torch.tensor([[1., 2.], [3., 4.]])
b = torch.tensor([[5., 6.], [7., 8.]])

print("Matrix A:")
print(a)
print(f"Shape: {a.shape}, dtype: {a.dtype}")

# Operations
print("\\nA + B:")
print(a + b)

print("\\nA @ B (matmul):")
print(a @ b)

print("\\nA transposed:")
print(a.T)

# Stats
print(f"\\nMean: {a.mean():.2f}")
print(f"Sum:  {a.sum():.2f}")
print(f"Max:  {a.max():.2f}")

# Reshape
flat = a.reshape(-1)
print(f"\\nFlattened: {flat}")` },
            {
                type: 'challenge', title: 'Dot Product', instructions: `Using PyTorch, compute the dot product of:\n- **a = [1, 2, 3]**\n- **b = [4, 5, 6]**\n\nPrint: **"Dot product: 32"**\n\n(1×4 + 2×5 + 3×6 = 4+10+18 = 32)`, starterCode: `import torch

a = torch.tensor([1., 2., 3.])
b = torch.tensor([4., 5., 6.])

dot = torch.dot(a, b)
print(f"Dot product: {dot:.0f}")`,
                check: (out) => out.includes('32'), hint: '1×4 + 2×5 + 3×6 = 32'
            },
        ],
    },
    {
        id: 'autograd', title: 'Autograd', icon: '📐', color: 'cyan', xp: 100,
        description: 'Automatic differentiation — computing gradients for backpropagation.',
        sections: [
            {
                type: 'theory', title: 'Automatic Differentiation', content: `## requires_grad
Set \`requires_grad=True\` to track operations for backprop.

\`\`\`python
x = torch.tensor(3.0, requires_grad=True)
y = x ** 2 + 2*x + 1   # y = (x+1)²
y.backward()             # compute dy/dx
print(x.grad)            # 2x+2 at x=3 → 8.0
\`\`\`

## The Computational Graph
Every operation on tracked tensors builds a graph. \`.backward()\` traverses it in reverse to compute gradients.

## no_grad Context
During inference, disable gradient tracking to save memory:
\`\`\`python
with torch.no_grad():
    output = model(input)
\`\`\`

## Zero Gradients
Gradients **accumulate** by default. Zero them before each backward pass:
\`\`\`python
optimizer.zero_grad()
loss.backward()
optimizer.step()
\`\`\`` },
            {
                type: 'code', title: 'Gradient Computation', code: `import torch

# Simple gradient computation
x = torch.tensor([2.0, 3.0], requires_grad=True)

# f(x) = sum(x^2 + 2x)
y = (x ** 2 + 2 * x).sum()
print(f"y = {y.item()}")

y.backward()
print(f"dy/dx = {x.grad}")  # 2x+2 at each element

# Manual check: dy/dx at x=2 → 2(2)+2=6, at x=3 → 2(3)+2=8
print(f"Expected: [6, 8]")

# Reset and compute for different func
x.grad.zero_()
z = (x ** 3).sum()
z.backward()
print(f"\\nd(x^3)/dx = {x.grad}")  # 3x^2` },
            {
                type: 'challenge', title: 'Gradient Check', instructions: `Compute the gradient of **f(x) = x³ - 2x** at **x = 3.0**\n\nThe derivative is **3x² - 2**, so at x=3: **3(9) - 2 = 25**\n\nPrint: **"Gradient: 25.0"**`, starterCode: `import torch

x = torch.tensor(3.0, requires_grad=True)
f = x**3 - 2*x
f.backward()

print(f"Gradient: {x.grad}")`,
                check: (out) => out.includes('25'), hint: 'd/dx(x³-2x) at x=3 = 3(9)-2 = 25'
            },
        ],
    },
    {
        id: 'neural-nets', title: 'Neural Networks', icon: '🧠', color: 'purple', xp: 125,
        description: 'Build MLPs with nn.Module, activation functions, and loss functions.',
        sections: [
            {
                type: 'theory', title: 'Building Neural Networks', content: `## nn.Module
All PyTorch models inherit from \`nn.Module\`.

\`\`\`python
import torch.nn as nn

class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Linear(784, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Linear(128, 10),
        )

    def forward(self, x):
        return self.layers(x)

model = MLP()
print(model)  # prints architecture
\`\`\`

## Common Layers
| Layer | Purpose |
|-------|---------|
| \`nn.Linear(in, out)\` | fully connected |
| \`nn.Conv2d\` | 2D convolution |
| \`nn.ReLU()\` | activation |
| \`nn.BatchNorm2d\` | normalize activations |
| \`nn.Dropout(p)\` | regularization |
| \`nn.Embedding\` | token embeddings |` },
            {
                type: 'code', title: 'MLP Architecture', code: `import torch
import torch.nn as nn

class MLP(nn.Module):
    def __init__(self, input_size, hidden, output_size):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(input_size, hidden),
            nn.ReLU(),
            nn.BatchNorm1d(hidden),
            nn.Linear(hidden, hidden // 2),
            nn.ReLU(),
            nn.Linear(hidden // 2, output_size)
        )

    def forward(self, x):
        return self.network(x)

model = MLP(784, 256, 10)
print(model)
print(f"\\nParameters: {sum(p.numel() for p in model.parameters()):,}")

# Forward pass
x = torch.randn(32, 784)  # batch of 32
out = model(x)
print(f"Input:  {x.shape}")
print(f"Output: {out.shape}")` },
            {
                type: 'challenge', title: 'Parameter Count', instructions: `A linear layer \`nn.Linear(in, out)\` has **in×out + out** parameters (weights + bias).\n\nFor a layer with **in=128, out=64**, print: **"Params: 8256"**\n\n(128×64 + 64 = 8192 + 64 = 8256)`, starterCode: `import torch.nn as nn

layer = nn.Linear(128, 64)
params = sum(p.numel() for p in layer.parameters())
print(f"Params: {params}")`,
                check: (out) => out.includes('8256'), hint: '128×64 + 64 = 8256'
            },
        ],
    },
    {
        id: 'training', title: 'Training Loops', icon: '🔄', color: 'gold', xp: 100,
        description: 'Loss functions, optimizers, the training loop, and evaluation.',
        sections: [
            {
                type: 'theory', title: 'The Training Loop', content: `## Core Training Pattern
\`\`\`python
for epoch in range(num_epochs):
    model.train()
    for batch_x, batch_y in train_loader:
        # 1. Forward pass
        output = model(batch_x)
        loss = criterion(output, batch_y)

        # 2. Backward pass
        optimizer.zero_grad()  # clear old grads
        loss.backward()        # compute grads
        optimizer.step()       # update weights
\`\`\`

## Common Loss Functions
| Loss | Use case |
|------|---------|
| \`nn.MSELoss()\` | regression |
| \`nn.CrossEntropyLoss()\` | classification |
| \`nn.BCELoss()\` | binary classification |

## Common Optimizers
\`\`\`python
optim.SGD(params, lr=0.01, momentum=0.9)
optim.Adam(params, lr=1e-3)           # most commonly used
optim.AdamW(params, lr=1e-3, wd=0.01) # Adam + weight decay
\`\`\`` },
            {
                type: 'code', title: 'Training Loop', code: `import torch
import torch.nn as nn

# Simulate training on XOR problem
torch.manual_seed(42)

X = torch.tensor([[0.,0.],[0.,1.],[1.,0.],[1.,1.]])
y = torch.tensor([[0.],[1.],[1.],[0.]])

model = nn.Sequential(
    nn.Linear(2, 8), nn.Tanh(),
    nn.Linear(8, 1), nn.Sigmoid()
)

optimizer = torch.optim.Adam(model.parameters(), lr=0.1)
criterion = nn.BCELoss()

for epoch in range(301):
    model.train()
    pred = model(X)
    loss = criterion(pred, y)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    if epoch % 100 == 0:
        print(f"Epoch {epoch:3d} | Loss: {loss.item():.4f}")

with torch.no_grad():
    print("\\nPredictions:")
    for xi, yi, pi in zip(X, y, model(X)):
        print(f"  {xi.tolist()} → pred={pi.item():.2f}, true={yi.item():.0f}")` },
            {
                type: 'challenge', title: 'Loss Calculation', instructions: `For predictions \`[0.9, 0.1, 0.8]\` and targets \`[1.0, 0.0, 1.0]\`, compute **MSE loss**:\n\nMSE = mean((pred - target)²)\n= ((0.9-1)² + (0.1-0)² + (0.8-1)²) / 3\n= (0.01 + 0.01 + 0.04) / 3 = 0.02\n\nPrint: **"MSE: 0.02"**`, starterCode: `import torch
import torch.nn as nn

pred = torch.tensor([0.9, 0.1, 0.8])
target = torch.tensor([1.0, 0.0, 1.0])

loss = nn.MSELoss()(pred, target)
print(f"MSE: {loss.item():.2f}")`,
                check: (out) => out.includes('0.02'), hint: 'MSE = mean of squared differences = 0.02'
            },
        ],
    },
    {
        id: 'cnn', title: 'CNNs', icon: '👁️', color: 'cyan', xp: 125,
        description: 'Convolutional layers, pooling, feature maps, and image classification.',
        sections: [
            {
                type: 'theory', title: 'Convolutional Neural Networks', content: `## Why CNNs?
Fully connected layers treat each pixel independently. CNNs use **local patterns** (edges, textures) that can appear anywhere.

## Key Operations
| Op | Purpose |
|----|---------|
| Conv2d | detect local patterns |
| MaxPool2d | downsample, keep max |
| BatchNorm2d | normalize for stable training |
| Dropout | regularization |
| Flatten | → fully connected |

## A Simple CNN
\`\`\`python
nn.Sequential(
    nn.Conv2d(1, 32, 3, padding=1),   # 1→32 channels
    nn.ReLU(),
    nn.MaxPool2d(2),                   # halve spatial size
    nn.Conv2d(32, 64, 3, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(2),
    nn.Flatten(),
    nn.Linear(64*7*7, 10)              # 28→14→7
)
\`\`\`

## Output Size Formula
\`\`\`
out = floor((in + 2*pad - kernel) / stride) + 1
\`\`\`` },
            {
                type: 'code', title: 'CNN Architecture', code: `import torch
import torch.nn as nn

class SimpleCNN(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 32, 3, padding=1),
            nn.BatchNorm2d(32), nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1),
            nn.BatchNorm2d(64), nn.ReLU(),
            nn.MaxPool2d(2),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64*7*7, 128),
            nn.ReLU(), nn.Dropout(0.5),
            nn.Linear(128, num_classes)
        )

    def forward(self, x):
        return self.classifier(self.features(x))

model = SimpleCNN()
print(f"Parameters: {sum(p.numel() for p in model.parameters()):,}")

# Test forward pass (MNIST-shape input: 1×28×28)
x = torch.randn(4, 1, 28, 28)
out = model(x)
print(f"Input:  {x.shape}")
print(f"Output: {out.shape}")  # (4, 10)` },
            {
                type: 'challenge', title: 'Output Size', instructions: `For input size **28**, with:\n- kernel=3, padding=1, stride=1: **out = 28**\n- then MaxPool2d(2): **out = 14**\n- another conv (same): **out = 14**\n- another MaxPool2d(2): **out = 7**\n\nPrint: **"Final spatial: 7"**`, starterCode: `def conv_out(size, kernel=3, padding=1, stride=1):
    return (size + 2*padding - kernel) // stride + 1

def pool_out(size, pool=2):
    return size // pool

size = 28
size = conv_out(size)
size = pool_out(size)
size = conv_out(size)
size = pool_out(size)

print(f"Final spatial: {size}")`,
                check: (out) => out.includes('7'), hint: '28→28→14→14→7'
            },
        ],
    },
    {
        id: 'save-load', title: 'Saving & Loading', icon: '💾', color: 'purple', xp: 75,
        description: 'Save/load model weights, full checkpoints, and best-model patterns.',
        sections: [
            {
                type: 'theory', title: 'Model Persistence', content: `## Save & Load State Dict (Recommended)
\`\`\`python
# Save
torch.save(model.state_dict(), "model.pth")

# Load
model = MyModel()
model.load_state_dict(torch.load("model.pth"))
model.eval()
\`\`\`

## Save Full Checkpoint
\`\`\`python
checkpoint = {
    "epoch": epoch,
    "model": model.state_dict(),
    "optimizer": optimizer.state_dict(),
    "loss": best_loss,
}
torch.save(checkpoint, "checkpoint.pth")

# Resume
ckpt = torch.load("checkpoint.pth")
model.load_state_dict(ckpt["model"])
optimizer.load_state_dict(ckpt["optimizer"])
start_epoch = ckpt["epoch"] + 1
\`\`\`

## Best Model Pattern
\`\`\`python
best_loss = float("inf")
for epoch in range(epochs):
    val_loss = evaluate()
    if val_loss < best_loss:
        best_loss = val_loss
        torch.save(model.state_dict(), "best.pth")
\`\`\`` },
            {
                type: 'code', title: 'Checkpoint Simulation', code: `import json

# Simulate checkpoint saving (without actual PyTorch for this demo)

class MockModel:
    def __init__(self):
        self.weights = {"layer1": [0.1, 0.2], "layer2": [0.5, 0.8]}
    def state_dict(self):
        return self.weights.copy()
    def load_state_dict(self, d):
        self.weights = d

class TrainingLogger:
    def __init__(self):
        self.history = []
        self.best_loss = float("inf")
        self.best_epoch = 0
        self.checkpoint = None

    def log(self, epoch, loss, model):
        self.history.append({"epoch": epoch, "loss": loss})
        if loss < self.best_loss:
            self.best_loss = loss
            self.best_epoch = epoch
            self.checkpoint = {"epoch": epoch, "loss": loss, "weights": model.state_dict()}
            print(f"  ✓ New best! epoch={epoch}, loss={loss:.4f}")

model = MockModel()
logger = TrainingLogger()

losses = [0.85, 0.72, 0.61, 0.59, 0.63, 0.57, 0.60]
for epoch, loss in enumerate(losses, 1):
    logger.log(epoch, loss, model)

print(f"\\nBest: epoch={logger.best_epoch}, loss={logger.best_loss:.4f}")` },
            {
                type: 'challenge', title: 'Checkpoint Keys', instructions: `A proper checkpoint dict should include these 4 keys.\nPrint them:\n- **epoch**\n- **model_state_dict**\n- **optimizer_state_dict**\n- **loss**`, starterCode: `keys = ["epoch", "model_state_dict", "optimizer_state_dict", "loss"]

for key in keys:
    print(key)`,
                check: (out) => out.includes('epoch') && out.includes('optimizer_state_dict'), hint: 'Print all 4 checkpoint keys'
            },
        ],
    },
];

export const UE5_LEARN = { meta: { name: 'Unreal Engine 5', emoji: '🎮', color: 'purple', layer: 'Foundation', description: 'AAA game development — editor, blueprints, C++, and UI.' }, topics: UE5_TOPICS };
export const BLENDER_LEARN = { meta: { name: 'Blender', emoji: '🎨', color: 'orange', layer: 'Foundation', description: '3D modeling, shading, rigging, and game asset creation.' }, topics: BLENDER_TOPICS };
export const PYTORCH_LEARN = { meta: { name: 'PyTorch', emoji: '🔥', color: 'gold', layer: 'Advanced', description: 'Deep learning — tensors, autograd, neural nets, and training.' }, topics: PYTORCH_TOPICS };
