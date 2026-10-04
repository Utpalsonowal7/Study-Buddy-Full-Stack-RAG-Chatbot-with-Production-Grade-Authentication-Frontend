export interface User {
     id: string;
     name: string;
     email: string;
     avatar: string | null;
     isVerified: boolean;
}

export interface LoginResponse {
     user: User;
}

export interface AuthContextType {
     user: User | null;
     loading: boolean;
     isAuthenticated: boolean;
     requestLoginCode: (email: string) => Promise<void>;
     login: (email: string, otp: string) => Promise<User>;
     register: (name: string, email: string, otp: string) => Promise<User>;
     logout: () => Promise<void>;
}
