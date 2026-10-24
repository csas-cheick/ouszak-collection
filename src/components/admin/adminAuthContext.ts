import { createContext, useContext } from "react";

export type AuthState = "loading" | "signed-out" | "admin" | "forbidden" | "error";

export interface AdminAuthValue {
  state: AuthState;
  email: string | null;
  error: string | null;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

export const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth doit être utilisé dans AdminAuthProvider.");
  return context;
};
