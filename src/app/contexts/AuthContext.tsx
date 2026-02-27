import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserRole = "Sales Employee" | "Reservations Officer" | "Operations Officer" | "Accounting Officer" | "Super Admin";

type Language = "en" | "ar" | "tr";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  initials: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  language: Language;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  setLanguage: (lang: Language) => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Permission mapping by role
const rolePermissions: Record<UserRole, string[]> = {
  "Super Admin": [
    "view_proposals",
    "create_proposal",
    "edit_proposal",
    "delete_proposal",
    "confirm_proposal",
    "view_vouchers",
    "edit_vouchers",
    "view_financials",
    "edit_financials",
    "view_master_data",
    "edit_master_data",
    "view_reports",
    "manage_users",
  ],
  "Sales Employee": [
    "view_proposals",
    "create_proposal",
    "edit_proposal",
    "view_vouchers",
    "view_reports",
  ],
  "Reservations Officer": [
    "view_proposals",
    "edit_proposal",
    "confirm_proposal",
    "view_vouchers",
    "edit_vouchers",
    "view_master_data",
    "edit_master_data",
  ],
  "Operations Officer": [
    "view_proposals",
    "view_vouchers",
    "edit_vouchers",
    "view_master_data",
  ],
  "Accounting Officer": [
    "view_proposals",
    "view_vouchers",
    "view_financials",
    "edit_financials",
    "view_reports",
  ],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Restore user from localStorage
    const stored = localStorage.getItem("toms_user");
    if (stored) {
      return JSON.parse(stored);
    }
    // Default Super Admin for development
    return {
      id: "1",
      name: "Super Admin",
      email: "admin@toms.com",
      role: "Super Admin",
      initials: "SA",
    };
  });
  
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("toms_language");
    return (stored as Language) || "en";
  });

  // Persist user and language
  useEffect(() => {
    if (user) {
      localStorage.setItem("toms_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("toms_user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("toms_language", language);
  }, [language]);

  const login = (email: string, password: string, role: UserRole) => {
    // Mock login - in production, this would call an API
    const newUser: User = {
      id: Date.now().toString(),
      name: email.split("@")[0],
      email,
      role,
      initials: email.substring(0, 2).toUpperCase(),
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("toms_user");
    // Navigation will be handled by MainLayout's useEffect
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        language,
        login,
        logout,
        setLanguage,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
