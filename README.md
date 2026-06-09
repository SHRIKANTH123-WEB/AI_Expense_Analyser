# SpendWise AI: Personal Expense Analyzer

**Frontend Development URL:** [http://localhost:5173](http://localhost:5173)

SpendWise is a responsive, modern full-stack application built to log personal expenses and generate strategic, category-wise financial audits using the Gemini API.

---

## Technical Stack
- **Frontend**: React (Vite), Tailwind CSS, Recharts, Lucide Icons, Axios.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Google Gen AI SDK.
- **AI Engine**: Gemini API (`gemini-1.5-flash` model via `@google/generative-ai` package).

---

## Repository Architecture

```
F:\AI expense analyser\
├── backend/
│   ├── config/db.js          # Mongoose connection config
│   ├── middleware/auth.js    # JWT payload checks
│   ├── models/               # User, Expense, and AIReport collections
│   ├── routes/               # API endpoints (Auth, CRUD expenses, Gemini routes)
│   ├── server.js             # Express startup
│   └── .env                  # Keys and ports configuration
├── frontend/
│   ├── src/
│   │   ├── components/       # StatsCards, ChartsSection, AISpan, forms, etc.
│   │   ├── context/          # JWT auth operations, Expense CRUD & AI fetchers
│   │   ├── pages/            # Login, Register, and Dashboard grids
│   │   ├── index.css         # Styling directives and glassmorphism overrides
│   │   └── App.jsx           # Global routes switcher
│   ├── tailwind.config.js    # Tailwind customizations
│   └── vite.config.js        # Vite port configurations & backend proxy rules
└── README.md                 # Setup guidelines
```

---

## API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /register` — Create a new user profile.
- `POST /login` — Authenticate and return JWT token.
- `GET /me` — Decode active session metadata.

### 💸 Expense Manager (`/api/expenses`)
- `GET /` — Fetch transaction logs. Supports queries: `search`, `category`, `startDate`, `endDate`.
- `POST /` — Add a new transaction.
- `PUT /:id` — Update fields of a transaction.
- `DELETE /:id` — Delete a transaction log.

### 🤖 Gemini Audits (`/api/ai`)
- `POST /analyze` — Aggregate logs, format prompts, invoke Gemini API, cache results and return analysis.
- `GET /reports` — Fetch analysis history.

---

## Environment Configuration

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/expense-analyzer
JWT_SECRET=YOUR_JWT_SECRET_STRING
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
FRONTEND_URL=http://localhost:5173
```
*Note: If `GEMINI_API_KEY` is not provided or remains as default, the server runs in a mock calculation mode to provide dynamic evaluations without throwing connection errors.*

---

## Running the Application

### 1. Database Requirement
Ensure MongoDB is running locally at `mongodb://127.0.0.1:27017/` or update `MONGO_URI` to use MongoDB Atlas in `backend/.env`.

### 2. Startup Server (Backend)
Navigate to the `backend/` directory:
```bash
cd backend
npm install
npm run dev
```
The server starts on `http://localhost:5000`.

### 3. Startup Dashboard (Frontend)
Open a new terminal and navigate to the `frontend/` directory:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your web browser.
