import { FormEvent, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useAdminAuth } from "../../components/admin/adminAuthContext";

const AdminLogin = () => {
  const { state, error: configurationError, signIn } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (state === "admin") return <Navigate to="/admin" replace />;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const result = await signIn(email.trim(), password);
      if (result) setError(result);
    } catch {
      setError("La connexion au service d’authentification a échoué. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-[#f7f5f0] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-[#211c18] p-12 text-[#f8f4ed] lg:flex lg:flex-col lg:justify-between xl:p-20">
        <div className="absolute -right-36 top-1/4 h-[34rem] w-[34rem] rounded-full border border-[#d7bd91]/20" />
        <div className="absolute -right-12 top-1/3 h-[26rem] w-[26rem] rounded-full border border-[#d7bd91]/15" />
        <Link to="/" className="relative flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center border border-[#d7bd91]/60 font-serif text-xl">O</span>
          <span className="text-xs font-semibold tracking-[0.25em]">OUSZAK COLLECTION</span>
        </Link>
        <div className="relative max-w-xl">
          <p className="mb-5 text-[10px] uppercase tracking-[0.35em] text-[#d7bd91]">Espace de gestion</p>
          <h1 className="font-serif text-5xl font-light leading-tight xl:text-6xl">
            La maîtrise du détail, <span className="italic text-[#d7bd91]">au quotidien.</span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/60">
            Retrouvez en un regard l’activité et les mouvements de votre boutique.
          </p>
        </div>
        <p className="relative text-[10px] tracking-[0.18em] text-white/45">OUSZAK COLLECTION · NIAMEY</p>
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-xs text-stone-500 transition hover:text-stone-900">
            <ArrowLeft size={15} /> Retour à la boutique
          </Link>
          <div className="mb-8 mt-14 lg:hidden">
            <p className="font-serif text-lg tracking-[0.15em]">OUSZAK</p>
            <p className="text-[9px] tracking-[0.32em] text-stone-500">COLLECTION</p>
          </div>
          <div className="mb-8 mt-9">
            <span className="mb-5 grid h-11 w-11 place-items-center rounded-full bg-[#ece5d8] text-[#705b3b]">
              <LockKeyhole size={19} />
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9a7d50]">Administration</p>
            <h2 className="mt-2 font-serif text-4xl font-light text-[#211c18]">Se connecter</h2>
            <p className="mt-3 text-sm leading-6 text-stone-500">Accédez à votre espace de gestion sécurisé.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-medium text-stone-700">Adresse e-mail</span>
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border border-stone-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#9a7d50] focus:ring-2 focus:ring-[#9a7d50]/15"
                placeholder="nom@exemple.com"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-medium text-stone-700">Mot de passe</span>
              <span className="relative block">
                <input
                  type={passwordVisible ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full border border-stone-300 bg-white px-4 py-3.5 pr-12 text-sm outline-none transition focus:border-[#9a7d50] focus:ring-2 focus:ring-[#9a7d50]/15"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible((visible) => !visible)}
                  className="absolute inset-y-0 right-0 grid w-12 place-items-center text-stone-400 hover:text-stone-700"
                  aria-label={passwordVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {passwordVisible ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>

            {(error || configurationError || state === "forbidden") && (
              <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-800">
                {error ?? configurationError ?? "Ce compte n’est pas autorisé à accéder à l’espace administrateur."}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || state === "loading" || state === "error"}
              className="flex w-full items-center justify-center gap-2 bg-[#211c18] px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#796342] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Connexion…" : "Accéder à mon espace"}
            </button>
          </form>
          <p className="mt-8 border-t border-stone-200 pt-5 text-center text-[11px] leading-5 text-stone-400">
            Accès réservé aux administrateurs autorisés.
          </p>
        </div>
      </section>
    </main>
  );
};

export default AdminLogin;
