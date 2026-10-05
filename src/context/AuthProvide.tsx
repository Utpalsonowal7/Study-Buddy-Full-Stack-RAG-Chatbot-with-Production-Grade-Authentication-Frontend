import type { User } from "../types/auth";
import { getCachedUser, getCurrentUser, logoutUser, registerUser, requestLoginOtp, verifyLoginOtp, verifyRegistrationOtp } from "../services/auth";
import { AuthContext } from "./AuthContext";
import { invalidateStudyCaches } from "../services/rag";
import type { ReactNode } from "react";
import { useState,useEffect } from "react";

interface AuthProviderProps {
     children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            const publicPage = ["/", "/login", "/register"].includes(window.location.pathname);
            if (publicPage) {
                setUser(await getCachedUser());
                setLoading(false);
                return;
            }
            try {
                setUser(await getCurrentUser());
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, []);

 

    const requestLoginCode = async (email: string) => {
        await requestLoginOtp(email);
    };

    const login = async (email: string, otp: string) => {
        const nextUser = await verifyLoginOtp(email, otp);
        invalidateStudyCaches(false);
        setUser(nextUser);
        return nextUser;
    };

    const verifyRegistrationCode = async (email: string, otp: string) => {
        await verifyRegistrationOtp(email, otp);
    };

    const register = async (name: string, email: string) => {
        const nextUser = await registerUser(name, email);
        invalidateStudyCaches(false);
        setUser(nextUser);
        return nextUser;
    };

    const logout = async () => {
        try { await logoutUser(); } catch { /* Clear the local UI session even when the API is unavailable. */ }
        invalidateStudyCaches(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                requestLoginCode,
                login,
                verifyRegistrationCode,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
