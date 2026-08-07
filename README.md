# SkillNest — MERN Web App

A course marketplace: students browse/enroll in courses, admins manage the
catalogue. Built as two independent apps in one repo — a React frontend and
a small Express/MongoDB API — plus a separate WordPress marketing site
(not in this repo) that links into this app's `/login` page.

## Architecture

```
skillnest-mern/
├── backend/                    Express API (JWT auth, course CRUD, enrollment)
│   └── src/
│       ├── config/db.js        MongoDB connection
│       ├── models/             User, Course, Enrollment (Mongoose schemas)
│       ├── controllers/        Route handler logic
│       ├── routes/             Express routers (auth / courses / enrollments)
│       ├── middleware/         JWT auth guard + error handler
│       └── seed/seedData.js    Sample admin + 6 courses for local testing
│
├── frontend/                   React app (Vite + Tailwind)
│   └── src/
│       ├── api/axios.js        Axios instance, attaches JWT to every request
│       ├── context/AuthContext.jsx   Login/register/logout, persisted session
│       ├── services/           One thin wrapper file per API resource
│       ├── components/
│       │   ├── layout/         Navbar, Footer, ProtectedRoute, AdminRoute
│       │   ├── courses/        CourseCard, CourseFormModal (admin add/edit)
│       │   └── common/         StickerCard, Loader, Alert — shared UI primitives
│       └── pages/               One file per route (see table below)
│
├── .vscode/                    Recommended extensions + workspace settings
└── .gitignore
```

**Why it's split this way:** the backend is intentionally thin — models
define the data shape, controllers hold the logic, routes just wire
controllers to URLs with the right middleware. There's no service/repository
layer, no DTOs, no TypeScript — just enough structure to be readable. The
frontend is where the actual product experience (and most of the assignment's
visual/UX evaluation) lives, so that's where the component structure goes
deeper: shared primitives (`StickerCard`, `Loader`, `Alert`) get reused across
every page so the whole app is visually consistent from one place.

## Pages ↔ Routes

| Route | Page component | Access |
|---|---|---|
| `/` | `LandingPage` | Public |
| `/login`, `/register` | `AuthPage` (tabbed) | Public |
| `/courses` | `CourseListing` | Public |
| `/courses/:id` | `CourseDetail` | Public (enroll requires login) |
| `/dashboard` | `UserDashboard` | Logged-in students |
| `/admin` | `AdminDashboard` | Admin only |

## Running locally

**1. Backend**
```bash
cd backend
cp .env.example .env      # fill in MONGO_URI (MongoDB Atlas free tier) + JWT_SECRET
npm install
npm run seed               # optional: adds an admin (admin@skillnest.com / admin123) + 6 sample courses
npm run dev                 # http://localhost:5000
```

**2. Frontend** (in a second terminal)
```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173 — /api calls are proxied to :5000 automatically
```

Open `http://localhost:5173`, register an account (or log in with the seeded
admin) and click around.

## Pushing to GitHub

```bash
cd skillnest-mern
git init
git add .
git commit -m "SkillNest: MERN app (React + Vite + Tailwind, Express + MongoDB)"
git branch -M main
git remote add origin https://github.com/<your-username>/skillnest-mern.git
git push -u origin main
```

The root `.gitignore` already excludes `node_modules/` and `.env` files (only
the `.env.example` templates are committed), so secrets never end up on GitHub.

## Deployment (free tier)

| Piece | Where | Notes |
|---|---|---|
| MongoDB | [MongoDB Atlas](https://www.mongodb.com/atlas) free M0 cluster | Copy the connection string into `backend/.env` → `MONGO_URI` |
| Backend | [Render](https://render.com) free Web Service | Root dir `backend`, build `npm install`, start `npm start`. Add the same env vars from `.env.example` in Render's dashboard. |
| Frontend | [Vercel](https://vercel.com) or [Netlify](https://netlify.com) | Root dir `frontend`, build `npm run build`, output `dist`. Set `VITE_API_URL` to your Render backend URL + `/api`. |

Once deployed, that frontend URL is what you put into the WordPress theme's
`SKILLNEST_APP_URL` constant, so the marketing site's "Get Started" button
sends visitors straight into this app.

## VS Code setup

Open the `skillnest-mern` folder (not just `frontend/` or `backend/`) as your
workspace root — `.vscode/extensions.json` will prompt you to install ESLint,
Prettier, Tailwind CSS IntelliSense, MongoDB for VS Code, and Thunder Client
(handy for testing the API routes without leaving the editor).
