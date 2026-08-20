# Smart Portfolio Generator & ATS-Scored Resume Generator

A full-stack MERN application with a Python/Flask ML microservice. Users manage
their career data (education, experience, skills, projects, volunteering) in
one dashboard and get two auto-synchronized outputs: a live portfolio website
and an ATS-optimized PDF resume, plus a real-time semantic ATS match score
against any job description.

```
smart-portfolio-ats/
├── backend/          Node.js + Express REST API, MongoDB via Mongoose, JWT auth,
│                      portfolio/resume generation, Puppeteer PDF export
├── frontend/         React + Vite + Tailwind dashboard, portfolio preview, ATS UI
├── ml-service/       Python + Flask microservice — Sentence Transformers +
│                      cosine similarity ATS scoring
└── docker-compose.yml  Spins up all four services (Mongo, backend, ML, frontend)
```

## Architecture

```
 React (Vite)  ── REST/JSON ──▶  Express API  ── HTTP ──▶  Flask ML service
  (frontend)                     (backend)                 (sentence-transformers)
                                     │
                                     ▼
                                  MongoDB
```

Every create/update/delete on a user's career data (`education`, `experience`,
`skills`, `projects`, `volunteer`, or their profile) goes through
`backend/services/syncService.js`, which invalidates the cached portfolio HTML
and resume PDF and regenerates both in the background. Neither output ever
needs to be manually rebuilt.

## Quick start (Docker — recommended)

Requires Docker and Docker Compose.

```bash
docker compose up --build
```

- Frontend: http://localhost:8080
- Backend API: http://localhost:5000/api
- ML service: http://localhost:8001/api/health
- MongoDB: mongodb://localhost:27017

The first build of `ml-service` downloads the `all-MiniLM-L6-v2` model
(~90 MB), so the initial `docker compose up --build` will take a few minutes.

## Manual setup (without Docker)

You'll need Node.js 18+, Python 3.10+, and a MongoDB instance (local or
[MongoDB Atlas](https://www.mongodb.com/atlas)).

### 1. ML microservice

```bash
cd ml-service
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```

Runs on `http://localhost:8001`. The first request will download the
Sentence Transformer model if it wasn't pre-fetched by the Dockerfile step.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # then edit MONGO_URI, JWT secrets, ML_SERVICE_URL
npm run dev
```

Runs on `http://localhost:5000`. Puppeteer needs a Chromium binary — a plain
`npm install` downloads one automatically unless you set
`PUPPETEER_SKIP_DOWNLOAD=true`, in which case set `PUPPETEER_EXECUTABLE_PATH`
to a Chrome/Chromium binary already on your machine.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_BASE_URL, defaults to http://localhost:5000/api
npm run dev
```

Runs on `http://localhost:5173`.

## Key features implemented

- **Auth**: registration/login with bcrypt password hashing, short-lived JWT
  access tokens (kept in memory on the frontend) + long-lived refresh tokens,
  automatic silent refresh on 401.
- **Dashboard CRUD**: ownership-scoped create/read/update/delete for
  education, experience, skills, projects, and volunteering, all built on a
  shared backend `crudFactory` and a shared frontend `EntitySection` /
  `EntityForm` pair.
- **Portfolio generation**: three genuinely distinct EJS/CSS templates
  (`minimalist`, `modern`, `creative`) rendered server-side, cached as static
  HTML, served publicly at `/p/:slug` — no auth required to view.
- **Resume generation**: single-column, ATS-friendly HTML template rendered
  to a text-selectable PDF via headless Chromium (Puppeteer).
- **Automatic synchronization**: any dashboard edit invalidates + regenerates
  both outputs in the background (`syncService.js`).
- **ATS scoring**: Flask endpoint embeds resume text and job description with
  `all-MiniLM-L6-v2`, computes cosine similarity, rescales it into an
  intuitive 0–100 score, and returns matched/missing keywords plus specific
  optimization suggestions.

## What you still need to do before deploying

- Point `MONGO_URI` at a real database (MongoDB Atlas recommended) and set
  strong, unique values for `JWT_SECRET` / `JWT_REFRESH_SECRET`.
- Decide where generated portfolio HTML / resume PDFs are cached in
  production — the default is local disk (`backend/generated/`), which works
  for a single instance but should move to object storage (S3, GCS, etc.) if
  you scale the backend horizontally.
- Add automated tests (Jest/Supertest for the backend, pytest for the ML
  service, Vitest/React Testing Library for the frontend) — none are
  included in this scaffold.
- Review the rate limiting and CORS origin settings in `backend/server.js`
  for your actual production domain(s).
