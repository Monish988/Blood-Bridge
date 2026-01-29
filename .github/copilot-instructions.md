# Copilot Instructions - Blood Bank Management System

## Project Overview
Blood Bank (BB) is a full-stack blood donation management platform connecting blood donors, hospitals, and inventory systems. The frontend is a React+Vite app with Tailwind CSS, backed by a Flask REST API.

## Architecture

### Frontend Stack (React 19 + Vite)
- **Entry point**: [src/main.jsx](../src/main.jsx) wraps app with `AuthProvider` and `BrowserRouter`
- **Routing**: [src/routes/AppRoutes.jsx](../src/routes/AppRoutes.jsx) - nested routes with `/dashboard` as protected parent, children include donors, inventory, hospitals, blood requests
- **State Management**: 
  - Auth state via React Context ([src/context/AuthContext.jsx](../src/context/AuthContext.jsx)) - stores user, login/logout logic, localStorage persistence
  - Component-level state with `useState` and `useMemo` for filtered lists
- **Protected Routes**: [src/Components/ProtectedRoute.jsx](../src/Components/ProtectedRoute.jsx) redirects unauthenticated users to `/login`

### Backend (Flask)
- **Server**: [flask_server/server.py](../flask_server/server.py) - port 5000
- **Auth**: JWT tokens stored in localStorage, sent via `Authorization: Bearer {token}` header
- **In-memory data**: users, donors, hospitals, blood inventory, requests (no database currently)
- **CORS enabled** for localhost:3000 (frontend)

### API Layer
- **Axios client**: [src/services/api.js](../src/services/api.js) with request interceptor that auto-attaches token to all requests
- **Base URL**: `http://localhost:5000`

## Key Components & Data Flow

### Authentication
1. User logs in at `/login` → `api.post("/api/auth/login", {email, password})`
2. Response includes token, role (hospital/donor), name → stored in localStorage
3. `AuthContext` restores user on page refresh
4. All subsequent API calls auto-include token header

### User Types & Features
- **Donor**: Can register blood donation profile, view requests, manage availability
- **Hospital**: Can browse donors/inventory, create blood requests, manage stock

### Major Components
- **[src/Components/DashBoard/](../src/Components/DashBoard/)** - main dashboard with left sidebar navigation and right content area
- **[src/Components/Donor/](../src/Components/Donor/)** - donor list, filtering (search/blood group/status), availability toggle
- **[src/Components/Hospitals/](../src/Components/Hospitals/)** - hospital directory
- **[src/Components/Inventory/](../src/Components/Inventory/)** - blood stock management
- **[src/Components/BloodRequests/](../src/Components/BloodRequests/)** - request creation and tracking
- **Modal component**: [src/Components/Modal.jsx](../src/Components/Modal.jsx) - reusable, click outside to close

## Code Patterns & Conventions

### React Patterns
- **Functional components** with hooks throughout
- **Custom useAuth hook** for accessing AuthContext: `const { user, login, logout } = useAuth()`
- **useMemo for filtered lists** - donors filtered by search/group/status without refetch on prop change
- **Controlled inputs** - form state via useState, onChange handlers

### API Patterns
- Success: fetch data → `setData(res.data)`
- Error handling: `catch(err)` with `err.response?.data?.error || fallback message`
- Loading state: typical `useState(true)` → `setLoading(false)` in finally block
- Endpoint naming: `/api/{resource}`, `/api/{resource}/{id}/{action}` (e.g., `/api/donors/{id}/toggle`)

### Styling
- **Tailwind CSS** (v4.1) for all styling - utility-first classes
- **lucide-react** for icons - import from `lucide-react` (e.g., `CircleCheckBig`, `Users`)
- Common patterns: `flex`, `h-screen`, `bg-red-600`, `border`, `rounded`, `space-y-4`

### Storage Conventions
- **localStorage keys**: `user`, `token`, `donorRegistered`
- **sessionStorage keys**: `pendingDonorRegistration`
- Auth context uses JSON.parse/stringify for user object

## Development Workflow

### Setup
```bash
npm install              # Install frontend dependencies
cd flask_server
pip install -r requirements.txt  # Install Flask dependencies (if exists)
```

### Running
- **Frontend**: `npm run dev` (Vite, port 5173 by default)
- **Backend**: `python flask_server/server.py` (Flask, port 5000)
- Ensure **both** are running for full app functionality

### Build & Lint
- `npm run build` - Vite build to dist/
- `npm run lint` - ESLint check (see eslint.config.js)
- `npm run preview` - Preview production build locally

## Important Implementation Details

### Donor Registration Flow
- New donor users redirected to `/dashboard/register-donor` after signup if `donorRegistered` flag not set
- Component: [src/Components/Donor/DonorRegister.jsx](../src/Components/Donor/DonorRegister.jsx)
- After registration, `localStorage.setItem("donorRegistered", "true")`

### Token Format
- JWT token created with `identity=str(user["id"])` and `additional_claims={"role": user["role"]}`
- Decoded by backend to identify user and check permissions

### Common API Endpoints (from Flask)
- `POST /api/auth/login` → `{email, password}` → `{token, role, name}`
- `POST /api/auth/signup` → `{name, email, password, role}` → user created
- `GET /api/donors` → list all donors
- `PATCH /api/donors/{id}/toggle` → toggle availability
- Additional endpoints defined in server.py for hospitals, inventory, requests

## When Adding Features

1. **New page/feature**: Create component in [src/Components/](../src/Components/) or [src/pages/](../src/pages/)
2. **New data list**: Use `useState`, `useEffect` for fetch, `useMemo` for filters
3. **New API calls**: Use the `api` client from [src/services/api.js](../src/services/api.js)
4. **Route management**: Update [src/routes/AppRoutes.jsx](../src/routes/AppRoutes.jsx)
5. **Auth-dependent UI**: Wrap with `ProtectedRoute` or check `useAuth().user` inline
6. **Styling**: Add Tailwind classes to JSX, avoid separate CSS files

## Testing Notes
- Default test credentials exist in Flask (Apollo Hospital / Rahul donor, password: 123456)
- No automated tests currently - manual testing via browser
