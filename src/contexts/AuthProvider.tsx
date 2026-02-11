import { useEffect, useState, type ReactNode } from "react";
import { authApi } from "@/api";
import type { User } from "@/api/types";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await authApi.me();
          setUser(userData as unknown as User);
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    localStorage.setItem("token", response.token);

    if (response.user) {
      const nextUser = response.user as unknown as User;
      setUser(nextUser);
      return nextUser;
    }

    const userData = await authApi.me();
    const nextUser = userData as unknown as User;
    setUser(nextUser);
    return nextUser;
  };

  const register = async (email: string, password: string) => {
    const response = await authApi.register({ email, password });
    localStorage.setItem("token", response.token);

    if (response.user) {
      const nextUser = response.user as unknown as User;
      setUser(nextUser);
      return nextUser;
    }

    const userData = await authApi.me();
    const nextUser = userData as unknown as User;
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
