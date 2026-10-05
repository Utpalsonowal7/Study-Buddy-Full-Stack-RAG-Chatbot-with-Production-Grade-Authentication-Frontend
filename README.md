# Study Buddy

Study Buddy is a React and TypeScript frontend for a personal study workspace. It uses the FastAPI backend for email OTP authentication, document indexing, study chats, citations, and conversation history.

## Features

- Public landing page with light and dark themes.
- Email registration: verify an email OTP, then provide a name to create the account.
- Email OTP sign-in, plus Google and GitHub OAuth entry points.
- Protected dashboard, streamed study chat, document library, and account settings.
- PDF, TXT, and Markdown uploads with indexing progress and document management.
- Conversation history, document filters, and citations returned by the RAG service.
- Credentialed session cookies, automatic access-token refresh, in-memory response caching, and API error messages.

## Tech stack

- React 19 and TypeScript
- Vite
- React Router
- Tailwind CSS 4
- Axios
- Oxlint

## Requirements and setup

- Node.js and npm
- The Study Buddy FastAPI backend running and reachable from the browser

1. Install dependencies from the repository root:

   ```bash
   npm install
   ```

2. Create a `.env` file beside `package.json` with the versioned API base URL:

   ```dotenv
   VITE_BACKEND_URL=http://127.0.0.1:8000/api/v1
   ```

   Change the origin if your backend runs elsewhere. Restart Vite after changing this value.

3. Configure backend CORS to allow the frontend origin and credentials. Authentication and RAG requests use HTTP-only session cookies.

4. Start the frontend:

   ```bash
   npm run dev
   ```

   Open the local URL printed by Vite, usually `http://localhost:5173`.

## Useful commands

```bash
npm run dev      # Start the development server
npm run build    # Type-check and create a production build
npm run preview  # Preview the production build
npm run lint     # Run Oxlint
```

## Authentication flow

### Register with email

1. Enter an email address; the frontend calls `POST /auth/send-otp`.
2. Enter the emailed code; the frontend calls `POST /auth/verify-otp`.
3. Enter a name; the frontend calls `POST /auth/register` with `{ "email": "...", "full_name": "..." }`.
4. The frontend loads the authenticated account from `GET /auth/me` and opens the dashboard.

### Sign in with email

1. Enter the account email; the frontend calls `POST /auth/login` to send an OTP.
2. Enter the code; the frontend calls `POST /auth/login/verify-otp`.
3. The frontend loads `GET /auth/me` and opens the dashboard.

Google and GitHub buttons navigate to `/auth/google` and `/auth/github`. Axios sends credentials and refreshes expired sessions through `POST /auth/refresh`. Signing out calls `POST /auth/logout`.

## Study data flow

Documents are uploaded to `POST /rag/documents` as multipart field `file`, listed from `GET /rag/documents`, and deleted with `DELETE /rag/documents/{document_id}`. The browser validates supported PDF, TXT, and Markdown files up to 10 MiB before upload. The backend indexes each upload.

Chat questions stream from `POST /rag/chat/stream` using server-sent events. The page renders answer deltas and citations as they arrive, then keeps the returned conversation ID for follow-up questions. Conversation lists and message history use the `/rag/conversations` routes. API failures show backend error details where available and offer retry actions.

Document and conversation lists are cached in memory for 20 seconds, messages for 30 seconds, and signed download URLs for at most 55 seconds. Successful mutations invalidate related caches. The complete route contract is in [`src/data/API_ROUTES.md`](src/data/API_ROUTES.md).

## Frontend routes

| Route | Page | Access |
| --- | --- | --- |
| `/` | Landing page | Public |
| `/register` | Email registration | Public |
| `/login` | Email OTP sign-in | Public |
| `/dashboard` | Study overview | Authenticated |
| `/chat` and `/chat/:chatId` | Study conversations | Authenticated |
| `/documents` | Document library | Authenticated |
| `/settings` | Account and appearance | Authenticated |

## Project structure

```text
src/
  api/          Axios client and session refresh handling
  components/   Shared application layout
  context/      Authentication context and provider
  data/         API route notes and non-server state helpers
  hooks/        Authentication and theme hooks
  pages/        Landing, auth, dashboard, chat, documents, settings
  routes/       Protected route handling
  services/     Authentication and RAG API operations
  types/        Shared TypeScript types
```
