# Study Buddy API integration

The frontend uses the FastAPI API mounted at `/api/v1`. Set `VITE_BACKEND_URL` to that API base (for example, `http://127.0.0.1:8000/api/v1`). The Axios client sends session cookies with `withCredentials`; the backend must allow the frontend origin with credentials.

## Documents

| Method | Route | Frontend behavior |
| --- | --- | --- |
| `POST` | `/rag/documents` | Uploads multipart field `file`; accepts PDF, TXT, or Markdown up to 10 MiB. |
| `GET` | `/rag/documents?offset=0&limit=50` | Lists the authenticated user's documents. Cached in memory for 20 seconds and invalidated after upload/delete. |
| `GET` | `/rag/documents/{document_id}` | Loads expanded document metadata on demand. |
| `GET` | `/rag/documents/{document_id}/download` | Gets a signed download URL; cached for up to 55 seconds (the backend URL expires after 60). |
| `DELETE` | `/rag/documents/{document_id}` | Deletes the document and invalidates list caches. |

The backend indexes uploads before returning the document. The returned document shape is `id`, `filename`, `content_type`, `size_bytes`, `chunk_count`, and `created_at`.

## Chat and conversations

| Method | Route | Frontend behavior |
| --- | --- | --- |
| `POST` | `/rag/chat/stream` | Sends `{ question, conversation_id?, document_ids? }`; streams SSE `meta`, `delta`, `done`, and `error` events. |
| `POST` | `/rag/chat` | JSON complete-answer endpoint, available for non-stream clients. |
| `GET` | `/rag/conversations?offset=0&limit=50` | Lists recent conversations; cached in memory for 20 seconds. |
| `GET` | `/rag/conversations/{conversation_id}/messages?after_id=0&limit=100` | Loads messages and citation snapshots; cached in memory for 30 seconds. |
| `DELETE` | `/rag/conversations/{conversation_id}` | Deletes a conversation and clears list/message caches. |

The first chat request omits `conversation_id`; the stream's `meta` and `done` events return the created conversation ID. Follow-up questions send that ID. If document filters are selected, the frontend sends their integer IDs. SSE requests include cookies and retry once after calling `/auth/refresh` when the access cookie is expired.

## Errors and cache policy

The UI displays FastAPI `detail` messages (including validation errors) and provides retry actions for list, upload, delete, and chat failures. A rejected chat stream does not add a fake answer to the conversation. HTTP 204 delete responses are treated as empty successes.

List and message caches are in-memory only, scoped to the current browser session, and cleared after successful mutations. There is no polling loop; pages revalidate when data changes. Signed download links use a shorter cache lifetime than their server expiry.

## Authentication routes

See the OTP and OAuth request sequence in the repository README. Authentication uses `/auth/send-otp`, `/auth/verify-otp`, `/auth/register`, `/auth/login`, `/auth/login/verify-otp`, `/auth/me`, `/auth/refresh`, `/auth/logout`, `/auth/google`, and `/auth/github` under the same `/api/v1` base.
