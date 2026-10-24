import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Navigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { AdminAuthContext, AuthState, useAdminAuth } from "./adminAuthContext";

export const AdminAuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resolveSession = useCallback(async (session: Session | null): Promise<boolean> => {
    setError(null);
    setEmail(session?.user.email ?? null);

    if (!session) {
      setState("signed-out");
      return false;
    }
    if (!supabase) {
      setState("error");
      setError("La connexion Supabase n’est pas configurée.");
      return false;
    }

    try {
      const { data, error: roleError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (roleError) {
        setState("error");
        setError("Impossible de vérifier les droits administrateur.");
        return false;
      }
      setState(data ? "admin" : "forbidden");
      return Boolean(data);
    } catch {
      setState("error");
      setError("Impossible de vérifier les droits administrateur.");
      return false;
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setState("error");
      setError("La connexion Supabase n’est pas configurée.");
      return;
    }

    let active = true;
    const applySession = (session: Session | null) => {
      if (active) void resolveSession(session);
    };

    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError) {
        setState("error");
        setError("Impossible de restaurer la session administrateur.");
        return;
      }
      applySession(data.session);
    }).catch(() => {
      if (!active) return;
      setState("error");
      setError("Impossible de restaurer la session administrateur.");
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => applySession(session), 0);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [resolveSession]);

  const signIn = useCallback(async (userEmail: string, password: string) => {
    if (!supabase) return "La connexion Supabase n’est pas configurée.";
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password,
    });
    if (signInError) return "Adresse e-mail ou mot de passe incorrect.";
    const authorized = await resolveSession(data.session);
    if (!authorized) {
      await supabase.auth.signOut();
      return "Ce compte n’est pas autorisé à accéder à l’espace administrateur.";
    }
    return null;
  }, [resolveSession]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw new Error("La déconnexion a échoué.");
  }, []);

  const value = useMemo(
    () => ({ state, email, error, signIn, signOut }),
    [state, email, error, signIn, signOut],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const RequireAdmin: FC<{ children: ReactNode }> = ({ children }) => {
  const { state, error } = useAdminAuth();

  if (state === "loading") {
    return <div className="grid min-h-screen place-items-center text-sm text-stone-500">Vérification de la session…</div>;
  }
  if (state === "signed-out") return <Navigate to="/admin/login" replace />;
  if (state === "forbidden" || state === "error") {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f7f5f0] px-6 text-center">
        <div className="max-w-md">
          <h1 className="font-serif text-3xl text-stone-900">Accès administrateur requis</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            {error ?? "Ce compte n’a pas les droits nécessaires pour accéder à cet espace."}
          </p>
          <a className="mt-6 inline-flex bg-stone-900 px-5 py-3 text-sm text-white" href="/admin/login">
            Retour à la connexion
          </a>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};
