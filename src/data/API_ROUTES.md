# Backend routes needed to replace the local demo

The UI currently calls `services/auth.ts` and `services/mockBackend.ts`. The route names below match those service boundaries and can be implemented by the backend; all protected routes should use the authenticated session cookie. JSON responses use the shapes in `mockData.ts` and `types/auth.ts`.

## Authentication

| Method | Route | Request | Response / behavior |
| --- | --- | --- | --- |
| `POST` | `/auth/send-otp` | `{ email }` | Send a one-time registration code. |
| `POST` | `/auth/verify-otp` | `{ email, otp }` | Verify the registration code. |
| `POST` | `/auth/register` | `{ full_name, email }` | Create account and set session cookies after OTP verification. |
| `POST` | `/auth/login` | `{ email }` | Send a one-time login code for an existing account. |
| `POST` | `/auth/login/verify-otp` | `{ email, otp }` | Verify code, set session cookies, and sign in. |
| `GET` | `/auth/me` | — | `{ user }` for the current session. |
| `POST` | `/auth/refresh` | — | Refresh session cookie. |
| `POST` | `/auth/logout` | — | Clear session cookie. |
| `GET` | `/auth/google` | — | OAuth redirect; callback at `/auth/google/callback`. |
| `GET` | `/auth/github` | — | OAuth redirect; callback at `/auth/github/callback`. |

## Documents

| Method | Route | Request | Response / behavior |
| --- | --- | --- | --- |
| `GET` | `/documents` | optional `?status=ready` | `{ documents: StudyDocument[] }`. |
| `POST` | `/documents` | multipart form field `file` | `201 { document }`; begin extraction/indexing. |
| `GET` | `/documents/:documentId` | — | `{ document }`, including processing status and page count. |
| `DELETE` | `/documents/:documentId` | — | `204`; remove document and its index. |

## Chats and grounded answers

| Method | Route | Request | Response / behavior |
| --- | --- | --- | --- |
| `GET` | `/chats` | — | `{ chats: StudyChat[] }`, newest first. |
| `POST` | `/chats` | `{ title? }` | `201 { chat }`. |
| `GET` | `/chats/:chatId` | — | `{ chat }` with ordered messages. |
| `DELETE` | `/chats/:chatId` | — | `204`. |
| `POST` | `/chats/:chatId/messages` | `{ content, documentIds? }` | `201 { userMessage, assistantMessage }`; assistant response includes citations with document ID, page, and topic. |

## Profile and preferences

| Method | Route | Request | Response / behavior |
| --- | --- | --- | --- |
| `GET` | `/users/me` | — | `{ user }`. |
| `PATCH` | `/users/me` | `{ name?, avatar? }` | `{ user }`. |

The demo currently uses local browser storage for authentication and study data. When the backend routes are ready, replace the simulated functions in the two service modules with these calls and set `VITE_BACKEND_URL` to the backend origin. The local demo intentionally persists only user/session and sample metadata; uploaded PDF bytes and extracted text are not retained, and its answers are placeholders rather than model-generated or source-grounded answers.
