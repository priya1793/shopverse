import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@shopverse.com",
    password: "password123",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("shopverse_token");
    const storedUser = localStorage.getItem("shopverse_user");
    if (stored && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        /* ignore */
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, _password: string): Promise<boolean> => {
      setLoading(true);
      // Simulate API delay
      await new Promise((r) => setTimeout(r, 800));
      const found = MOCK_USERS.find((u) => u.email === email);
      const fakeToken = `jwt_${btoa(email)}_${Date.now()}`;
      const newUser: User = {
        id: found?.id || crypto.randomUUID(),
        name: found?.name || email.split("@")[0],
        email,
        token: fakeToken,
      };
      setUser(newUser);
      localStorage.setItem("shopverse_token", fakeToken);
      localStorage.setItem("shopverse_user", JSON.stringify(newUser));
      setLoading(false);
      return true;
    },
    [],
  );

  const signup = useCallback(
    async (
      name: string,
      email: string,
      _password: string,
    ): Promise<boolean> => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 800));
      const fakeToken = `jwt_${btoa(email)}_${Date.now()}`;
      const newUser: User = {
        id: crypto.randomUUID(),
        name,
        email,
        token: fakeToken,
      };
      setUser(newUser);
      localStorage.setItem("shopverse_token", fakeToken);
      localStorage.setItem("shopverse_user", JSON.stringify(newUser));
      setLoading(false);
      return true;
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("shopverse_token");
    localStorage.removeItem("shopverse_user");
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
