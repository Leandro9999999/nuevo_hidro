// contexts\AuthContext.tsx
"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "../service/authService";
import { Login, UserCreate, SessionUser, sessionUserSchema } from "../types";

interface AuthContextType {
  user: SessionUser | null;
  loading: boolean;
  login: (credentials: Login) => Promise<void>;
  register: (data: UserCreate) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  expiresIn: "expiresIn",
  user: "user",
  userId: "userId",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const restoreSession = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.user);
        if (storedUser) {
          const parsedUser = sessionUserSchema.parse(JSON.parse(storedUser));
          setUser(parsedUser);
        }
      } catch (err) {
        console.error("Error restaurando sesión:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const saveSession = (
    accessToken: string,
    userData: SessionUser,
    refreshToken?: string,
    expiresIn?: number
  ) => {
    localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
    localStorage.setItem(STORAGE_KEYS.userId, userData.id.toString());
    if (refreshToken)
      localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
    if (expiresIn)
      localStorage.setItem(STORAGE_KEYS.expiresIn, expiresIn.toString());
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (credentials: Login) => {
    const data = await loginUser(credentials);
    const authUser: SessionUser = {
      id: data.user.id,
      email: data.user.email,
      role: data.user.role,
    };
    //console.log("usario logueado: ", data);
    
    saveSession(data.accessToken, authUser, data.refreshToken, data.expiresIn);
  };

  const register = async (formData: UserCreate) => {
    const data = await registerUser(formData);
    const authUser: SessionUser = {
      id: data.user.id,
      email: data.user.email,
      role: data.user.role,
    };
    saveSession(data.accessToken, authUser, data.refreshToken, data.expiresIn);
  };

  const logout = () => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    setUser(null);
    router.push("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
