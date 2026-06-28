# Emergency Medical Record System (EMRS)

EMRS is a Node.js, Express, PostgreSQL, and React healthcare record system for admins, doctors, and patients. This modernization pass hardens authentication, adds role-scoped dashboards, improves responsive UI foundations, and documents the production path for appointments, emergency cases, notifications, files, and audit logging.

## Stack

- Backend: Node.js, Express, Passport session auth, pg-promise
- Frontend: React 16, React Router, Axios
- Database: PostgreSQL
- Security: Helmet, restricted CORS, httpOnly cookie sessions, bcrypt password hashing, server-side RBAC middleware

## Setup

1. Install backend dependencies:
   ```bash
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Create a PostgreSQL database and run:
   ```bash
   psql -d your_database -f setup_database.sql
   ```

4. Configure `.env` in the project root:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_DATABASE=emrs
   DB_USER=postgres
   DB_PASS=your_password
   KEY=replace-with-a-long-random-session-secret
   CLIENT_ORIGIN=http://localhost:3000
   CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   NODE_ENV=development
   ```

5. Start the backend:
   ```bash
   npm start
   ```

6. Start the frontend:
   ```bash
   cd frontend
   npm start
   ```

## Current Roles

- Admin: manages doctor accounts and diseases, views the admin dashboard.
- Doctor: views profile, records, patient list, record creation, visualizations, and doctor dashboard.
- Patient: manages profile, views records, downloads PDFs, and views patient dashboard.

## Modernization Completed

- Added explicit backend RBAC middleware for `/admin`, `/doctor`, and `/patient` APIs.
- Restricted CORS to configured frontend origins instead of allowing every origin.
- Hardened session cookies with `httpOnly`, `sameSite`, and production-only `secure`.
- Added request body size limits.
- Improved local auth validation, email normalization, stronger bcrypt hashing, login throttling, and safer error responses.
- Added dashboard APIs for admins, doctors, and patients using existing records data.
- Added responsive role dashboards with loading skeletons and recent activity.
- Added dark-mode design tokens through `prefers-color-scheme`.
- Updated schema foundations for credentials, appointments, emergency cases, departments, notifications, medical files, and audit logs.

## Production Backlog

The database now has tables for the larger healthcare modules, but several workflows still need full UI and API implementation before real-world deployment:

- Forgot password, reset password, email verification, and email delivery.
- Appointment calendar, reminders, queue management, and video consultation status.
- Emergency intake, triage workflow, timeline, and doctor assignment screens.
- Secure file upload storage with virus scanning and signed downloads.
- Audit logging on every sensitive create, update, delete, and read operation.
- API pagination and filters on every list endpoint.
- Unit, integration, and API tests for auth, records, dashboards, and RBAC.

## Security Notes

- Use a long random `KEY` in every environment.
- Set `NODE_ENV=production` behind HTTPS so secure cookies are enabled.
- Keep `CLIENT_ORIGIN` exact for redirects, for example `https://emrs.example.com`.
- Set `CORS_ORIGINS` to every allowed browser origin, separated by commas.
- Do not expose doctor or admin creation publicly in production; provision privileged users through admin-only flows.
