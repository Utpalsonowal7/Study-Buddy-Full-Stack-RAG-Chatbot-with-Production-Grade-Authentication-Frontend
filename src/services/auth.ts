import axios from "axios";
import api from "../api/api";
import type { User } from "../types/auth";
import { readStorage, STORAGE_KEYS, writeStorage } from "../data/storage";

function normalizeUser(value: unknown): User {
     const payload = value as Record<string, unknown>;
     const nested = (payload.user ?? payload.data ?? payload) as Record<string, unknown>;
     return {
          id: String(nested.id ?? nested.user_id ?? nested.email ?? ""),
          name: String(nested.name ?? nested.full_name ?? "Student"),
          email: String(nested.email ?? ""),
          avatar: typeof nested.avatar === "string" ? nested.avatar : null,
          isVerified: Boolean(nested.is_verified ?? nested.isVarified ?? true),
     };
}

export function getAuthErrorMessage(error: unknown, fallback: string): string {
     if (axios.isAxiosError(error)) {
          const detail = error.response?.data?.detail ?? error.response?.data?.message;
          if (typeof detail === "string") return detail;
          if (Array.isArray(detail)) return detail.map((item) => item.msg).filter(Boolean).join(" ");
          if (!error.response) return "The API could not be reached. Check that the backend is running and VITE_BACKEND_URL is correct.";
     }
     return error instanceof Error ? error.message : fallback;
}

export async function getCachedUser(): Promise<User | null> {
     const cached = readStorage<unknown>(STORAGE_KEYS.user, null);
     return cached ? normalizeUser(cached) : null;
}

export async function getCurrentUser(): Promise<User> {
     const response = await api.get("/auth/me");
     const user = normalizeUser(response.data);
     writeStorage(STORAGE_KEYS.user, user);
     return user;
}

export async function requestRegistrationOtp(email: string): Promise<void> {
     await api.post("/auth/send-otp", { email: email.trim().toLowerCase() });
}

export async function verifyRegistrationOtp(email: string, otp: string): Promise<void> {
     const normalizedEmail = email.trim().toLowerCase();
     await api.post("/auth/verify-otp", { email: normalizedEmail, otp });
}

export async function registerUser(name: string, email: string): Promise<User> {
     const normalizedEmail = email.trim().toLowerCase();
     await api.post("/auth/register", { full_name: name.trim(), email: normalizedEmail });
     return getCurrentUser();
}

export async function requestLoginOtp(email: string): Promise<void> {
     await api.post("/auth/login", { email: email.trim().toLowerCase() });
}

export async function verifyLoginOtp(email: string, otp: string): Promise<User> {
     await api.post("/auth/login/verify-otp", { email: email.trim().toLowerCase(), otp });
     return getCurrentUser();
}

export async function logoutUser(): Promise<void> {
     try {
          await api.post("/auth/logout");
     } finally {
          localStorage.removeItem(STORAGE_KEYS.user);
     }
}
