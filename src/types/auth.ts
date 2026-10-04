export interface login {
     email: string;
     password: string;
}

export interface User {
     id: string;
     name: string;
     email: string;
     avatar: string | null;
     isVarified: boolean;
}

export interface LoginResponse {
     user: User;
}

export interface AuthContextType {
     user: User | null;
     loading: boolean;
     isAuthenticated: boolean;
     logout: () => Promise<void>;
}
