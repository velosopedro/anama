import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { apiRequest } from "../services/api";

import type { AuthUser, LoginResponse, RegisterInput } from "../types/auth";

interface AuthContextData {
  user: AuthUser | null;
  loading: boolean;
  signedIn: boolean;

  login: (email: string, senha: string) => Promise<void>;

  register: (input: RegisterInput) => Promise<void>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem("anama:token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiRequest<{
          user: AuthUser;
        }>("/auth/me");

        setUser(response.user);
      } catch {
        localStorage.removeItem("anama:token");

        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    void restoreSession();
  }, []);

  async function login(email: string, senha: string) {
    const response = await apiRequest<LoginResponse>("/auth/login", {
      method: "POST",

      body: {
        email,
        senha,
      },
    });

    localStorage.setItem("anama:token", response.token);

    setUser(response.user);
  }

  async function register(input: RegisterInput) {
    const response = await apiRequest<LoginResponse>("/auth/register", {
      method: "POST",
      body: input,
    });

    localStorage.setItem("anama:token", response.token);

    setUser(response.user);
  }

  function logout() {
    localStorage.removeItem("anama:token");

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signedIn: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de AuthProvider.");
  }

  return context;
}
