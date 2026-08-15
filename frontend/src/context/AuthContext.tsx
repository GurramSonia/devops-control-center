import { createContext, useContext, useState,useEffect } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
  
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("token")
  );

  const [role, setRole] = useState<string | null>(
  () => localStorage.getItem("role")
);

function getRoleFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}



  function login(token: string) {
    localStorage.setItem("token", token);
     const userRole = getRoleFromToken(token);

  if (userRole) {
    localStorage.setItem("role", userRole);
  }

  setRole(userRole);
    setIsAuthenticated(true);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole(null);
    setIsAuthenticated(false);
  }
   
  
  useEffect(() => {
    function handleAuthExpired() {
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      setRole(null);
      setIsAuthenticated(false);
    }

    window.addEventListener("auth-expired", handleAuthExpired);

    return () => {
      window.removeEventListener("auth-expired", handleAuthExpired);
    };
  }, []);
  
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        login,
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
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}