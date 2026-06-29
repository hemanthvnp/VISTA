/** @fileoverview Learn curriculum part 4 — FastAPI and Federated Learning */

/** FastAPI curriculum — 6 topics */
export const FASTAPI_TOPICS = [
    {
        id: 'setup', title: 'Setup & First Route', icon: '🚀', color: 'cyan', xp: 75,
        description: 'Install FastAPI, create your first endpoint, and run with Uvicorn.',
        sections: [
            {
                type: 'theory', title: 'Getting Started with FastAPI', content: `## Installation
\`\`\`bash
pip install fastapi uvicorn[standard]
\`\`\`

## Hello FastAPI
\`\`\`python
# main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello, V!"}

@app.get("/items/{item_id}")
def get_item(item_id: int):
    return {"item_id": item_id}
\`\`\`

## Run the Server
\`\`\`bash
uvicorn main:app --reload  # auto-restart on save
\`\`\`

## Auto Docs
FastAPI generates docs automatically:
- **Swagger UI** → \`http://localhost:8000/docs\`
- **ReDoc** → \`http://localhost:8000/redoc\`

## Why FastAPI?
- **Fast** — one of the fastest Python frameworks (Starlette + Pydantic)
- **Type hints** → automatic validation and docs
- **Async** — native \`async/await\` support` },
            {
                type: 'code', title: 'FastAPI Routes', code: `# Simulate FastAPI route handling in Python

from datetime import datetime

# Mock app router
routes = {}

def get(path):
    """Decorator factory mimicking @app.get(path)"""
    def decorator(func):
        routes[("GET", path)] = func
        return func
    return decorator

def post(path):
    def decorator(func):
        routes[("POST", path)] = func
        return func
    return decorator

# Define routes
@get("/")
def root():
    return {"message": "Hello, V!", "timestamp": str(datetime.now().date())}

@get("/health")
def health():
    return {"status": "healthy", "uptime": "99.9%"}

@get("/users/{user_id}")
def get_user(user_id: int):
    return {"user_id": user_id, "name": f"User{user_id}"}

# Simulate requests
requests = [
    ("GET", "/"), ("GET", "/health"), ("GET", "/users/{user_id}")
]

print("Simulated FastAPI responses:")
for method, path in requests:
    handler = routes.get((method, path))
    if handler:
        resp = handler() if "user_id" not in path else handler(user_id=42)
        print(f"  {method} {path}: {resp}")` },
            {
                type: 'challenge', title: 'Route Design', instructions: `Design a REST API for a books resource. Print the correct HTTP method + path for each:\n- Get all books: **GET /books**\n- Get one book: **GET /books/{id}**\n- Create book: **POST /books**\n- Delete book: **DELETE /books/{id}**`, starterCode: `routes = [
    ("GET", "/books", "list all books"),
    ("GET", "/books/{id}", "get one book"),
    ("POST", "/books", "create book"),
    ("DELETE", "/books/{id}", "delete book"),
]

for method, path, desc in routes:
    print(f"{method} {path}: {desc}")`,
                check: (out) => out.includes('GET /books') && out.includes('POST /books') && out.includes('DELETE'), hint: 'Print all 4 routes'
            },
        ],
    },
    {
        id: 'params', title: 'Path & Query Params', icon: '🔍', color: 'purple', xp: 75,
        description: 'Path parameters, query strings, optional params, and type validation.',
        sections: [
            {
                type: 'theory', title: 'Parameters in FastAPI', content: `## Path Parameters
\`\`\`python
@app.get("/users/{user_id}")
def get_user(user_id: int):   # auto-validated as int
    return {"id": user_id}
\`\`\`

## Query Parameters
\`\`\`python
# GET /items?skip=0&limit=10&q=laptop
@app.get("/items")
def list_items(skip: int = 0, limit: int = 10, q: str | None = None):
    return {"skip": skip, "limit": limit, "q": q}
\`\`\`

## Optional Parameters
\`\`\`python
from typing import Optional
def search(q: Optional[str] = None): ...
# or Python 3.10+:
def search(q: str | None = None): ...
\`\`\`

## Enum Parameters
\`\`\`python
from enum import Enum
class Format(str, Enum):
    json = "json"
    csv = "csv"

@app.get("/export")
def export(format: Format = Format.json):
    return {"format": format}
\`\`\`` },
            {
                type: 'code', title: 'Params Simulation', code: `from urllib.parse import urlparse, parse_qs

def parse_request(url):
    """Parse URL into path params and query params"""
    parsed = urlparse(url)
    query = parse_qs(parsed.query)
    path = parsed.path

    # Extract path params (e.g. /users/42 → {user_id: 42})
    parts = path.strip("/").split("/")
    path_params = {}
    if len(parts) >= 2 and parts[-1].isdigit():
        path_params[parts[-2][:-1] + "_id"] = int(parts[-1])

    # Parse query params
    query_params = {k: v[0] for k, v in query.items()}
    return path, path_params, query_params

urls = [
    "http://api.example.com/users/42",
    "http://api.example.com/items?skip=20&limit=5&q=laptop",
    "http://api.example.com/products/7?format=json&include_meta=true",
]

for url in urls:
    path, pp, qp = parse_request(url)
    print(f"URL: {url}")
    print(f"  Path params: {pp}")
    print(f"  Query params: {qp}")
    print()` },
            {
                type: 'challenge', title: 'URL Parser', instructions: `Parse the URL: \`/search?q=python&page=2&limit=10\`\n\nExtract and print each query parameter:\n- **q = python**\n- **page = 2**\n- **limit = 10**`, starterCode: `from urllib.parse import parse_qs

query_string = "q=python&page=2&limit=10"
params = parse_qs(query_string)

for key, values in params.items():
    print(f"{key} = {values[0]}")`,
                check: (out) => out.includes('q = python') && out.includes('page = 2') && out.includes('limit = 10'), hint: 'Print each key = value pair'
            },
        ],
    },
    {
        id: 'pydantic', title: 'Pydantic Models', icon: '📋', color: 'gold', xp: 100,
        description: 'Define request/response schemas with Pydantic — validation, serialization, nested models.',
        sections: [
            {
                type: 'theory', title: 'Pydantic Validation', content: `## Defining Models
\`\`\`python
from pydantic import BaseModel, validator
from typing import Optional

class User(BaseModel):
    id: int
    name: str
    email: str
    age: Optional[int] = None

class CreateUserRequest(BaseModel):
    name: str
    email: str
    password: str
\`\`\`

## Request Body
\`\`\`python
@app.post("/users")
def create_user(user: CreateUserRequest):
    # user.name, user.email auto-validated
    return {"id": 1, **user.dict()}
\`\`\`

## Validators
\`\`\`python
class Item(BaseModel):
    price: float
    
    @validator("price")
    def price_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Price must be > 0")
        return v
\`\`\`

## Nested Models
\`\`\`python
class Order(BaseModel):
    user: User
    items: list[Item]
    total: float
\`\`\`` },
            {
                type: 'code', title: 'Pydantic in Action', code: `# Simulate Pydantic validation

class ValidationError(Exception):
    pass

class BaseModel:
    def __init__(self, **data):
        for key, val in data.items():
            setattr(self, key, val)
        self.validate()

    def validate(self): pass

    def dict(self):
        return {k: v for k, v in self.__dict__.items() if not k.startswith("_")}

class User(BaseModel):
    def validate(self):
        if not isinstance(self.name, str) or len(self.name) < 2:
            raise ValidationError("Name must be at least 2 chars")
        if "@" not in self.email:
            raise ValidationError("Invalid email")

# Test valid user
try:
    u = User(id=1, name="Shane", email="shane@example.com", age=22)
    print(f"Valid user: {u.dict()}")
except ValidationError as e:
    print(f"Error: {e}")

# Test invalid user
for bad in [
    {"id": 2, "name": "X", "email": "valid@x.com"},   # name too short
    {"id": 3, "name": "Shane", "email": "not-an-email"}, # bad email
]:
    try:
        User(**bad)
    except ValidationError as e:
        print(f"  Rejected: {e}")` },
            {
                type: 'challenge', title: 'Schema Design', instructions: `Design a Pydantic-style model for a blog Post. Print the field definitions:\n- **id: int**\n- **title: str**\n- **content: str**\n- **published: bool = False**\n- **tags: list[str] = []**`, starterCode: `fields = [
    ("id", "int", None),
    ("title", "str", None),
    ("content", "str", None),
    ("published", "bool", "False"),
    ("tags", "list[str]", "[]"),
]

for name, type_, default in fields:
    if default:
        print(f"{name}: {type_} = {default}")
    else:
        print(f"{name}: {type_}")`,
                check: (out) => out.includes('id: int') && out.includes('published: bool = False'), hint: 'Print all 5 fields with types'
            },
        ],
    },
    {
        id: 'crud', title: 'CRUD Operations', icon: '💾', color: 'orange', xp: 75,
        description: 'Build a complete Create-Read-Update-Delete API with in-memory or database storage.',
        sections: [
            {
                type: 'theory', title: 'CRUD API Design', content: `## REST + CRUD Mapping
| HTTP | Path | Action |
|------|------|--------|
| POST | /items | Create |
| GET | /items | Read all |
| GET | /items/{id} | Read one |
| PUT | /items/{id} | Update (full) |
| PATCH | /items/{id} | Update (partial) |
| DELETE | /items/{id} | Delete |

## FastAPI CRUD Example
\`\`\`python
from fastapi import FastAPI, HTTPException
db = {}  # in-memory store

@app.post("/items", status_code=201)
def create(item: Item):
    db[item.id] = item
    return item

@app.get("/items/{id}")
def read(id: int):
    if id not in db:
        raise HTTPException(status_code=404)
    return db[id]

@app.put("/items/{id}")
def update(id: int, item: Item):
    if id not in db:
        raise HTTPException(status_code=404)
    db[id] = item
    return item

@app.delete("/items/{id}")
def delete(id: int):
    db.pop(id, None)
    return {"deleted": id}
\`\`\`` },
            {
                type: 'code', title: 'In-Memory CRUD', code: `# Full CRUD implementation

class HTTPException(Exception):
    def __init__(self, status_code, detail):
        self.status_code = status_code
        self.detail = detail

class ItemDB:
    def __init__(self):
        self._store = {}
        self._next_id = 1

    def create(self, data):
        item = {"id": self._next_id, **data}
        self._store[self._next_id] = item
        self._next_id += 1
        return item

    def read_all(self, skip=0, limit=10):
        items = list(self._store.values())
        return items[skip:skip+limit]

    def read(self, id):
        if id not in self._store:
            raise HTTPException(404, f"Item {id} not found")
        return self._store[id]

    def update(self, id, data):
        if id not in self._store:
            raise HTTPException(404, f"Item {id} not found")
        self._store[id].update(data)
        return self._store[id]

    def delete(self, id):
        return self._store.pop(id, None)

db = ItemDB()
print("CREATE:", db.create({"name": "Sword", "price": 99.99}))
print("CREATE:", db.create({"name": "Shield", "price": 49.99}))
print("READ ALL:", db.read_all())
print("UPDATE:", db.update(1, {"price": 89.99}))
print("DELETE:", db.delete(2))
print("READ ALL:", db.read_all())` },
            {
                type: 'challenge', title: 'Status Codes', instructions: `Print the correct HTTP status code for each scenario:\n- **Create success: 201**\n- **Not found: 404**\n- **Validation error: 422**\n- **Server error: 500**`, starterCode: `scenarios = [
    ("Create success", 201),
    ("Not found", 404),
    ("Validation error", 422),
    ("Server error", 500),
]

for scenario, code in scenarios:
    print(f"{scenario}: {code}")`,
                check: (out) => out.includes('201') && out.includes('404') && out.includes('422'), hint: 'Print all 4 status codes'
            },
        ],
    },
    {
        id: 'auth', title: 'Auth & JWT', icon: '🔐', color: 'cyan', xp: 100,
        description: 'Implement OAuth2 password flow, JWT tokens, and protected endpoints.',
        sections: [
            {
                type: 'theory', title: 'JWT Authentication', content: `## OAuth2 Password Flow (FastAPI)
\`\`\`python
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.post("/token")
def login(form: OAuth2PasswordRequestForm = Depends()):
    user = authenticate(form.username, form.password)
    token = create_jwt({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}
\`\`\`

## Creating & Verifying JWTs
\`\`\`python
from jose import jwt, JWTError
SECRET = "secret"
ALGO   = "HS256"

def create_jwt(data: dict):
    return jwt.encode(data, SECRET, algorithm=ALGO)

def verify_jwt(token: str):
    return jwt.decode(token, SECRET, algorithms=[ALGO])
\`\`\`

## Protected Routes
\`\`\`python
from fastapi import Depends

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_jwt(token)
    return payload["sub"]

@app.get("/me")
def me(user: str = Depends(get_current_user)):
    return {"username": user}
\`\`\`` },
            {
                type: 'code', title: 'JWT Simulation', code: `import base64, json, hmac, hashlib

def b64url(data):
    if isinstance(data, dict): data = json.dumps(data, separators=(",",":"))
    if isinstance(data, str): data = data.encode()
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()

def create_token(payload, secret="mysecret"):
    header = b64url({"alg": "HS256", "typ": "JWT"})
    claims = b64url(payload)
    signing_input = f"{header}.{claims}"
    sig = hmac.new(
        secret.encode(), signing_input.encode(), hashlib.sha256
    ).digest()
    return f"{signing_input}.{b64url(sig)}"

def verify_token(token, secret="mysecret"):
    parts = token.split(".")
    signing_input = f"{parts[0]}.{parts[1]}"
    expected = hmac.new(secret.encode(), signing_input.encode(), hashlib.sha256).digest()
    actual = base64.urlsafe_b64decode(parts[2] + "==")
    if hmac.compare_digest(expected, actual):
        payload_json = base64.urlsafe_b64decode(parts[1] + "==")
        return json.loads(payload_json)
    raise ValueError("Invalid token")

payload = {"sub": "shane", "role": "admin", "exp": 9999999999}
token = create_token(payload)
print(f"Token: {token[:50]}...")

verified = verify_token(token)
print(f"Verified: {verified}")` },
            {
                type: 'challenge', title: 'Token Parts', instructions: `A JWT has 3 base64url-encoded parts separated by dots.\n\nPrint what each part contains:\n- **Header: algorithm and token type**\n- **Payload: user claims and expiry**\n- **Signature: HMAC verification**`, starterCode: `parts = [
    ("Header", "algorithm and token type"),
    ("Payload", "user claims and expiry"),
    ("Signature", "HMAC verification"),
]

for name, content in parts:
    print(f"{name}: {content}")`,
                check: (out) => out.includes('Header') && out.includes('Signature'), hint: 'Print all 3 JWT parts'
            },
        ],
    },
    {
        id: 'background', title: 'Background Tasks', icon: '⚡', color: 'purple', xp: 75,
        description: 'Run async tasks, background jobs, and middleware in FastAPI.',
        sections: [
            {
                type: 'theory', title: 'Async FastAPI', content: `## Async Routes
\`\`\`python
import httpx

@app.get("/external")
async def fetch_data():
    async with httpx.AsyncClient() as client:
        r = await client.get("https://api.example.com/data")
        return r.json()
\`\`\`

## Background Tasks
\`\`\`python
from fastapi import BackgroundTasks

def send_email(email: str, message: str):
    # runs after response is sent
    print(f"Sending email to {email}: {message}")

@app.post("/register")
def register(email: str, bg: BackgroundTasks):
    user = create_user(email)
    bg.add_task(send_email, email, "Welcome!")
    return {"message": "Registered"}  # response goes first
\`\`\`

## Middleware
\`\`\`python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
\`\`\`` },
            {
                type: 'code', title: 'Task Queue', code: `import threading, queue, time

class BackgroundTaskQueue:
    """Simplified FastAPI BackgroundTasks"""
    def __init__(self):
        self._q = queue.Queue()
        self._worker = threading.Thread(target=self._run, daemon=True)
        self._worker.start()

    def add_task(self, func, *args, **kwargs):
        self._q.put((func, args, kwargs))

    def _run(self):
        while True:
            func, args, kwargs = self._q.get()
            try:
                func(*args, **kwargs)
            except Exception as e:
                print(f"Task error: {e}")

def send_welcome_email(email):
    time.sleep(0.1)
    print(f"  📧 Sent welcome email to {email}")

def update_analytics(user_id):
    print(f"  📊 Updated analytics for user {user_id}")

bg = BackgroundTaskQueue()

users = [("alice@test.com", 1), ("bob@test.com", 2), ("carol@test.com", 3)]

for email, uid in users:
    bg.add_task(send_welcome_email, email)
    bg.add_task(update_analytics, uid)
    print(f"[200] Registered: {email}")  # response goes first

time.sleep(0.5)
print("Done!")` },
            {
                type: 'challenge', title: 'Middleware Order', instructions: `Middleware runs in LIFO order (last added = first to run).\n\nGiven this order added: [auth, cors, logging]\nPrint the execution order: **logging → cors → auth**`, starterCode: `added_order = ["auth", "cors", "logging"]

# Middleware executes in reverse (LIFO)
execution_order = list(reversed(added_order))
print(" → ".join(execution_order))`,
                check: (out) => out.includes('logging') && out.indexOf('logging') < out.indexOf('auth'), hint: 'Reverse the list — LIFO order'
            },
        ],
    },
];

/** Federated Learning curriculum — 6 topics */
export const FL_TOPICS = [
    {
        id: 'what-is-fl', title: 'What is Federated Learning?', icon: '🌐', color: 'purple', xp: 125,
        description: 'The core concept of training ML models across distributed data without sharing raw data.',
        sections: [
            {
                type: 'theory', title: 'Federated Learning Overview', content: `## The Problem
Traditional ML: **all data → central server → train**
Problem: data is private, legally sensitive, or too large to move.

## Federated Learning Solution
\`\`\`
For each round:
  1. Server sends model to N clients
  2. Each client trains on local data
  3. Clients send back local model updates (gradients/weights)
  4. Server aggregates updates (FedAvg)
  5. Global model improves — no raw data leaves devices
\`\`\`

## Key Applications
- Mobile keyboards (next-word prediction)
- Medical imaging across hospitals
- Financial fraud detection across banks

## Types of FL
| Type | Data split |
|------|-----------|
| **Horizontal FL** | Same features, different samples |
| **Vertical FL** | Different features, same entity |
| **Federated Transfer** | Different features AND samples |` },
            {
                type: 'code', title: 'FL Concept Simulation', code: `# Federated Learning round simulation (conceptual)

import random

class GlobalModel:
    def __init__(self):
        self.weights = [0.5, 0.3, 0.2]  # simplified
        self.round = 0

    def broadcast(self):
        return self.weights.copy()

    def aggregate(self, client_updates):
        # FedAvg: weighted average of client updates
        n = len(client_updates)
        new_weights = [
            sum(u[i] for u in client_updates) / n
            for i in range(len(self.weights))
        ]
        self.weights = new_weights
        self.round += 1

class Client:
    def __init__(self, name, data_size):
        self.name = name
        self.data_size = data_size

    def local_train(self, weights, rounds=3):
        """Simulate local gradient update"""
        updated = [
            w + random.gauss(0, 0.05) * self.data_size/1000
            for w in weights
        ]
        return updated

server = GlobalModel()
clients = [Client(f"C{i}", size) for i, size in enumerate([500, 300, 200])]

print("=== Federated Learning Simulation ===")
for fl_round in range(3):
    global_weights = server.broadcast()
    updates = [c.local_train(global_weights) for c in clients]
    server.aggregate(updates)
    print(f"Round {fl_round+1}: weights = {[round(w,4) for w in server.weights]}")

print("\\nTraining complete — no raw data was shared!")` },
            {
                type: 'challenge', title: 'FL vs Central', instructions: `Print 3 key differences between Federated and Centralized learning:\n1. **Data location: local vs central**\n2. **Privacy: preserved vs exposed**\n3. **Communication: gradients vs raw data**`, starterCode: `differences = [
    ("Data location", "local", "central"),
    ("Privacy", "preserved", "exposed"),
    ("Communication", "gradients", "raw data"),
]

for aspect, fl, central in differences:
    print(f"{aspect}: FL={fl} vs Central={central}")`,
                check: (out) => out.includes('Privacy') && out.includes('gradients'), hint: 'Print all 3 differences'
            },
        ],
    },
    {
        id: 'privacy', title: 'Privacy Techniques', icon: '🔒', color: 'gold', xp: 125,
        description: 'Differential privacy, secure aggregation, and homomorphic encryption in FL.',
        sections: [
            {
                type: 'theory', title: 'Privacy in Federated Learning', content: `## Why Privacy Techniques?
Even without sharing raw data, gradient updates can leak information about training data (gradient inversion attacks).

## Differential Privacy (DP)
Add carefully calibrated **noise** to gradients — stronger privacy, some accuracy cost.
\`\`\`python
# Gaussian noise
noise = torch.randn_like(gradient) * sigma
dp_gradient = gradient + noise
\`\`\`

## Privacy Budget (ε)
- Small ε → more private, more noise, less accurate
- Large ε → less private, less noise, more accurate
- Track budget across rounds

## Secure Aggregation
Clients encrypt their updates. Server can aggregate without reading individual updates (using cryptographic protocols).

## Homomorphic Encryption
Compute on encrypted data — server aggregates encrypted gradients without decryption. Very slow, not yet practical at scale.

## Gradient Clipping (required for DP)
\`\`\`python
# Clip gradient norm before adding noise
clip_factor = max(1, grad.norm() / max_grad_norm)
clipped = grad / clip_factor
\`\`\`` },
            {
                type: 'code', title: 'Differential Privacy', code: `import random, math

def gaussian_noise(sensitivity, epsilon, delta=1e-5):
    """Gaussian noise std for (ε,δ)-DP"""
    sigma = sensitivity * math.sqrt(2 * math.log(1.25/delta)) / epsilon
    return sigma

def clip_gradient(grad, max_norm):
    """Clip gradient vector to max_norm"""
    norm = math.sqrt(sum(g**2 for g in grad))
    if norm > max_norm:
        return [g * max_norm / norm for g in grad]
    return grad

def add_noise(grad, sigma):
    """Add Gaussian noise for DP"""
    return [g + random.gauss(0, sigma) for g in grad]

# Simulate DP-SGD
gradient = [0.8, -0.5, 0.3, 0.9, -0.2]
max_norm = 1.0

clipped = clip_gradient(gradient, max_norm)
print(f"Original: {[round(g,3) for g in gradient]}")
print(f"Clipped:  {[round(g,3) for g in clipped]}")

for epsilon in [10.0, 1.0, 0.1]:
    sigma = gaussian_noise(max_norm, epsilon)
    noisy = add_noise(clipped, sigma)
    print(f"ε={epsilon:4.1f} → noise σ={sigma:.3f}: {[round(g,3) for g in noisy]}")` },
            {
                type: 'challenge', title: 'Privacy vs Accuracy', instructions: `As ε (epsilon) decreases, noise increases and accuracy drops.\n\nPrint the tradeoff:\n- **ε=10: low noise, low privacy**\n- **ε=1: medium noise, medium privacy**\n- **ε=0.1: high noise, high privacy**`, starterCode: `tradeoffs = [
    (10, "low noise", "low privacy"),
    (1, "medium noise", "medium privacy"),
    (0.1, "high noise", "high privacy"),
]

for eps, noise, priv in tradeoffs:
    print(f"ε={eps}: {noise}, {priv}")`,
                check: (out) => out.includes('low noise') && out.includes('high privacy'), hint: 'Lower ε = more private but more noisy'
            },
        ],
    },
    {
        id: 'fedavg', title: 'FedAvg Algorithm', icon: '📊', color: 'cyan', xp: 150,
        description: 'The canonical federated averaging algorithm — implementation and convergence.',
        sections: [
            {
                type: 'theory', title: 'Federated Averaging', content: `## FedAvg (McMahan et al. 2017)
The foundational FL algorithm.

\`\`\`
Server:
  Initialize global model w_0
  For each round t:
    S_t = sample K clients
    For each client k in S_t (parallel):
      w_k = ClientUpdate(k, w_t)
    w_{t+1} = Σ (n_k/n) * w_k  ← weighted average

Client k:
  Set local model = w_t
  For each local step:
    minibatch = sample from local data
    update via SGD
  Return updated weights
\`\`\`

## Key Hyperparameters
- **C** — fraction of clients per round (e.g. 0.1)
- **E** — local epochs per round
- **B** — local batch size
- **η** — learning rate

## IID vs non-IID
- **IID** — each client has representative sample → fast convergence
- **non-IID** — clients have biased data → slower, may diverge` },
            {
                type: 'code', title: 'FedAvg Implementation', code: `import random

def fedavg_round(global_model, clients, sample_frac=0.5, local_epochs=1, lr=0.01):
    """One round of FedAvg"""
    # Sample subset of clients
    n_sample = max(1, int(len(clients) * sample_frac))
    selected = random.sample(clients, n_sample)

    total_samples = sum(c["n_samples"] for c in selected)
    updates = []

    for client in selected:
        # Simulate local training (gradient step)
        local_model = global_model.copy()
        for _ in range(local_epochs):
            grad = {k: random.gauss(0, 0.1) for k in local_model}
            local_model = {k: v - lr * grad[k] for k, v in local_model.items()}
        updates.append((client["n_samples"], local_model))

    # Weighted average
    new_global = {}
    for key in global_model:
        new_global[key] = sum(
            (n / total_samples) * model[key]
            for n, model in updates
        )
    return new_global

# Run FedAvg
global_w = {"w1": 1.0, "w2": 0.5, "b": 0.0}
clients = [
    {"id": i, "n_samples": random.randint(100, 500)}
    for i in range(10)
]

print("FedAvg Training:")
for round_num in range(5):
    global_w = fedavg_round(global_w, clients)
    loss = sum(abs(v) for v in global_w.values()) / len(global_w)
    print(f"  Round {round_num+1}: proxy loss={loss:.4f}")` },
            {
                type: 'challenge', title: 'Weighted Average', instructions: `FedAvg computes a weighted average of client weights by number of samples.\n\nClients: A(100 samples, w=0.8), B(200 samples, w=0.5), C(300 samples, w=0.3)\nTotal = 600\n\nFedAvg = (100×0.8 + 200×0.5 + 300×0.3) / 600 = **0.4667**\n\nPrint: **"FedAvg weight: 0.47"**`, starterCode: `clients = [(100, 0.8), (200, 0.5), (300, 0.3)]
total = sum(n for n, _ in clients)

fedavg_w = sum(n * w for n, w in clients) / total
print(f"FedAvg weight: {fedavg_w:.2f}")`,
                check: (out) => out.includes('0.47'), hint: '(80+100+90)/600 ≈ 0.47'
            },
        ],
    },
    {
        id: 'client-server', title: 'Client-Server Setup', icon: '🖥️', color: 'orange', xp: 125,
        description: 'Build a federated training system with a central aggregation server and distributed clients.',
        sections: [
            {
                type: 'theory', title: 'FL System Architecture', content: `## Architecture Layers
\`\`\`
Central Server
├── Model Registry (stores global model versions)
├── Aggregation Engine (FedAvg or variant)
├── Client Manager (track participation)
└── Training Coordinator (round scheduling)

Clients (edge devices / silos)
├── Local Trainer (runs SGD on local data)
├── Model Cache (stores received global model)
├── Privacy Engine (DP noise, gradient clipping)
└── Communication Layer (secure transport)
\`\`\`

## Communication Protocol
1. Client **registers** with server, gets client_id
2. Server starts round → selects clients → sends global_model
3. Client trains locally → sends model_delta (weights - initial)
4. Server aggregates deltas → updates global model

## Model Delta vs Full Weights
Sending **deltas** (differences) is more bandwidth-efficient than full weights.
\`\`\`python
delta = {k: local[k] - global_w[k] for k in global_w}
# Server: global_w[k] += weighted_average(deltas)[k]
\`\`\`` },
            {
                type: 'code', title: 'Server-Client Protocol', code: `import random, time

class FLServer:
    def __init__(self, model_dims):
        self.model = {f"w{i}": random.gauss(0, 0.1) for i in range(model_dims)}
        self.round = 0
        self.clients = {}

    def register_client(self, client_id, n_samples):
        self.clients[client_id] = {"n_samples": n_samples, "rounds": 0}
        return self.model.copy()

    def start_round(self, frac=0.5):
        self.round += 1
        selected = random.sample(list(self.clients.keys()),
                                  max(1, int(len(self.clients)*frac)))
        return selected, self.model.copy()

    def aggregate(self, updates):
        total = sum(self.clients[cid]["n_samples"] for cid, _ in updates)
        for key in self.model:
            self.model[key] = sum(
                (self.clients[cid]["n_samples"] / total) * w[key]
                for cid, w in updates
            )

class FLClient:
    def __init__(self, client_id, n_samples):
        self.id = client_id
        self.n_samples = n_samples

    def train(self, global_model, lr=0.01):
        local = global_model.copy()
        for _ in range(5):  # E local epochs
            for k in local:
                local[k] -= lr * random.gauss(0, 0.1)
        return local

# Run simulation
server = FLServer(model_dims=3)
clients = [FLClient(f"C{i}", random.randint(100,500)) for i in range(5)]

for c in clients:
    server.register_client(c.id, c.n_samples)

for r in range(3):
    selected_ids, global_w = server.start_round(frac=0.6)
    selected = [c for c in clients if c.id in selected_ids]
    updates = [(c.id, c.train(global_w)) for c in selected]
    server.aggregate(updates)
    print(f"Round {r+1}: selected={selected_ids}, model_norm={sum(v**2 for v in server.model.values())**.5:.4f}")` },
            {
                type: 'challenge', title: 'Delta Computation', instructions: `Compute the model delta (change) between local and global weights:\n- Global: w1=0.5, w2=0.3\n- Local:  w1=0.6, w2=0.25\n\nDelta: w1=0.1, w2=-0.05\n\nPrint: **"w1 delta: 0.10"** and **"w2 delta: -0.05"**`, starterCode: `global_w = {"w1": 0.5, "w2": 0.3}
local_w  = {"w1": 0.6, "w2": 0.25}

for key in global_w:
    delta = local_w[key] - global_w[key]
    print(f"{key} delta: {delta:.2f}")`,
                check: (out) => out.includes('w1 delta: 0.10') && out.includes('w2 delta: -0.05'), hint: 'delta = local - global for each weight'
            },
        ],
    },
    {
        id: 'non-iid', title: 'Non-IID Data', icon: '📉', color: 'purple', xp: 125,
        description: 'The core challenge of FL — heterogeneous data distributions across clients.',
        sections: [
            {
                type: 'theory', title: 'Data Heterogeneity', content: `## Why Non-IID Matters
In real FL, each client's data is **biased** — a hospital only sees certain conditions, a phone user only types certain words.

## Types of Non-IID
1. **Label skew** — each client has only some classes
2. **Feature skew** — same labels, different input distributions
3. **Quantity skew** — clients have very different dataset sizes

## Effect on Training
Non-IID data causes **client drift** — local models diverge from the global optimum, slowing convergence.

## Solutions
| Method | Idea |
|--------|------|
| **FedProx** | Add proximal term to keep local model close to global |
| **SCAFFOLD** | Variance reduction with control variates |
| **FedNova** | Normalize updates by local steps |
| **Moon** | Contrastive learning for representation alignment |

## Measuring Heterogeneity
**Dirichlet distribution** (α parameter) is commonly used to simulate non-IID:
- Small α → highly non-IID
- Large α → approximately IID` },
            {
                type: 'code', title: 'Non-IID Simulation', code: `import random
from collections import Counter

def dirichlet_partition(n_clients, n_classes, n_total, alpha=0.5):
    """Partition data with Dirichlet distribution"""
    # For each class, distribute samples across clients
    client_data = {i: [] for i in range(n_clients)}

    for cls in range(n_classes):
        # Dirichlet proportions (simulate with exponentials)
        props = [random.expovariate(alpha) for _ in range(n_clients)]
        total = sum(props)
        props = [p/total for p in props]

        n_cls = n_total // n_classes
        for client_id, prop in enumerate(props):
            n_assigned = int(prop * n_cls)
            client_data[client_id].extend([cls] * n_assigned)

    return client_data

# Simulate 5 clients, 10 classes, 1000 samples
clients_data = dirichlet_partition(5, 10, 1000, alpha=0.1)

print("Client data distributions (alpha=0.1, highly non-IID):")
for client_id, labels in clients_data.items():
    counts = Counter(labels)
    dominant = counts.most_common(3)
    print(f"  Client {client_id} ({len(labels)} samples): top classes {dominant}")` },
            {
                type: 'challenge', title: 'IID Check', instructions: `In perfectly IID data, each client has equal proportion of each class.\n\nFor 4 clients, 2 classes, 100 total samples:\n- Each client: 25 samples\n- Each class per client: 12 or 13 samples\n\nPrint: **"IID: 25 samples/client, ~12-13 per class"**`, starterCode: `n_clients = 4
n_classes = 2
n_total = 100

per_client = n_total // n_clients
per_class = per_client // n_classes

print(f"IID: {per_client} samples/client, ~{per_class}-{per_class+1} per class")`,
                check: (out) => out.includes('25') && out.includes('12'), hint: '100/4=25 per client, 25/2≈12-13 per class'
            },
        ],
    },
    {
        id: 'flower', title: 'Flower Framework', icon: '🌸', color: 'gold', xp: 125,
        description: 'Use the Flower (flwr) framework to build production-ready FL pipelines.',
        sections: [
            {
                type: 'theory', title: 'Flower (flwr) Framework', content: `## What is Flower?
Flower is a production-ready FL framework that abstracting the communication layer.

## Install
\`\`\`bash
pip install flwr
\`\`\`

## Client Implementation
\`\`\`python
import flwr as fl

class MyClient(fl.client.NumPyClient):
    def get_parameters(self, config):
        return model.get_weights()

    def fit(self, parameters, config):
        model.set_weights(parameters)
        model.fit(X_train, y_train, epochs=1)
        return model.get_weights(), len(X_train), {}

    def evaluate(self, parameters, config):
        model.set_weights(parameters)
        loss, acc = model.evaluate(X_test, y_test)
        return loss, len(X_test), {"accuracy": acc}

fl.client.start_numpy_client(server_address="localhost:8080", client=MyClient())
\`\`\`

## Server
\`\`\`python
fl.server.start_server(
    server_address="0.0.0.0:8080",
    config=fl.server.ServerConfig(num_rounds=5),
    strategy=fl.server.strategy.FedAvg(),
)
\`\`\`` },
            {
                type: 'code', title: 'Flower Client Mockup', code: `# Simulate Flower client interface without actual flwr dependency

class NumPyClient:
    """Mimics fl.client.NumPyClient"""
    def get_parameters(self, config): raise NotImplementedError
    def fit(self, parameters, config): raise NotImplementedError
    def evaluate(self, parameters, config): raise NotImplementedError

class SimpleModel:
    def __init__(self):
        self.weights = [0.5, 0.3, 0.2]
        self.trained = 0

    def get_weights(self): return self.weights.copy()
    def set_weights(self, w): self.weights = w
    def fit(self, epochs=1):
        self.weights = [w * 0.99 + 0.001 * (0.5-w) for w in self.weights]
        self.trained += epochs
    def evaluate(self):
        loss = sum(abs(w - 0.4) for w in self.weights) / len(self.weights)
        acc = max(0, 1 - loss)
        return loss, acc

class MyClient(NumPyClient):
    def __init__(self, data_size):
        self.model = SimpleModel()
        self.data_size = data_size

    def get_parameters(self, config):
        return self.model.get_weights()

    def fit(self, parameters, config):
        self.model.set_weights(parameters)
        self.model.fit(epochs=config.get("local_epochs", 1))
        return self.model.get_weights(), self.data_size, {}

    def evaluate(self, parameters, config):
        self.model.set_weights(parameters)
        loss, acc = self.model.evaluate()
        return loss, self.data_size, {"accuracy": acc}

# Simulate a FL round
client = MyClient(data_size=500)
global_params = [0.5, 0.3, 0.2]

print("Flower Client Simulation:")
updated_params, n, _ = client.fit(global_params, {"local_epochs": 3})
print(f"  After fit: {[round(p,4) for p in updated_params]}")

loss, n, metrics = client.evaluate(updated_params, {})
print(f"  Eval: loss={loss:.4f}, acc={metrics['accuracy']:.4f}")` },
            {
                type: 'challenge', title: 'Flower Methods', instructions: `Print the 3 methods every Flower NumPyClient must implement and what they return:\n- **get_parameters: model weights (list)**\n- **fit: updated weights, num_samples, metrics**\n- **evaluate: loss, num_samples, metrics**`, starterCode: `methods = [
    ("get_parameters", "model weights (list)"),
    ("fit", "updated weights, num_samples, metrics"),
    ("evaluate", "loss, num_samples, metrics"),
]

for method, returns in methods:
    print(f"{method}: {returns}")`,
                check: (out) => out.includes('get_parameters') && out.includes('evaluate') && out.includes('metrics'), hint: 'Print all 3 method names and return values'
            },
        ],
    },
];

export const FASTAPI_LEARN = { meta: { name: 'FastAPI', emoji: '🚀', color: 'cyan', layer: 'Expert', description: 'Build fast, production-ready Python APIs with type safety.' }, topics: FASTAPI_TOPICS };
export const FL_LEARN = { meta: { name: 'Federated Learning', emoji: '🌐', color: 'purple', layer: 'Expert', description: 'Privacy-preserving distributed ML — FedAvg, DP, and Flower.' }, topics: FL_TOPICS };
