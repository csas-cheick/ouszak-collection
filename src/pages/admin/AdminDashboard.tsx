import { FC, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Boxes,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  ReceiptText,
  Wallet,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../../components/admin/adminAuthContext";
import { supabase } from "../../lib/supabase";

type AdminSection = "overview" | "sales" | "expenses" | "cash";
type EntryKind = "sale" | "expense" | "open-cash" | "close-cash";

interface Sale {
  id: string;
  amount: number;
  payment_method: string;
  note: string | null;
  sold_at: string;
}

interface Expense {
  id: string;
  amount: number;
  description: string;
  spent_at: string;
}

interface CashSession {
  id: string;
  opening_balance: number;
  closing_balance: number | null;
  opened_at: string;
  closed_at: string | null;
}

const money = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

const dateLabel = (date: string) =>
  new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date));

const todayLabel = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(new Date());

const AdminDashboard: FC = () => {
  const { email, signOut } = useAdminAuth();
  const [section, setSection] = useState<AdminSection>("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialog] = useState<EntryKind | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [cashSessions, setCashSessions] = useState<CashSession[]>([]);
  const [todaySales, setTodaySales] = useState(0);
  const [todayExpenses, setTodayExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const activeCash = useMemo(
    () => cashSessions.find((session) => !session.closed_at) ?? null,
    [cashSessions],
  );

  const refresh = useCallback(async () => {
    if (!supabase) {
      setError("La connexion Supabase n’est pas configurée.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const [salesResult, expensesResult, cashResult, todaySalesResult, todayExpensesResult] =
        await Promise.all([
          supabase.from("sales").select("id,amount,payment_method,note,sold_at").order("sold_at", { ascending: false }).limit(50),
          supabase.from("expenses").select("id,amount,description,spent_at").order("spent_at", { ascending: false }).limit(50),
          supabase.from("cash_sessions").select("id,opening_balance,closing_balance,opened_at,closed_at").order("opened_at", { ascending: false }).limit(20),
          supabase.from("sales").select("amount").gte("sold_at", startOfDay.toISOString()),
          supabase.from("expenses").select("amount").gte("spent_at", startOfDay.toISOString()),
        ]);

      const failed = [salesResult, expensesResult, cashResult, todaySalesResult, todayExpensesResult].find(
        (result) => result.error,
      );
      if (failed?.error) {
        setError(`Impossible de charger les données de gestion : ${failed.error.message}`);
        return;
      }
      setSales((salesResult.data ?? []) as Sale[]);
      setExpenses((expensesResult.data ?? []) as Expense[]);
      setCashSessions((cashResult.data ?? []) as CashSession[]);
      setTodaySales((todaySalesResult.data ?? []).reduce((sum, row) => sum + Number(row.amount), 0));
      setTodayExpenses((todayExpensesResult.data ?? []).reduce((sum, row) => sum + Number(row.amount), 0));
    } catch (loadError) {
      setError(loadError instanceof Error
        ? `Impossible de charger les données de gestion : ${loadError.message}`
        : "Impossible de charger les données de gestion.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const submitEntry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get("amount"));
    const note = String(form.get("note") ?? "").trim();
    let userData;
    try {
      const result = await supabase.auth.getUser();
      userData = result.data;
    } catch {
      setError("Impossible de vérifier votre session. Réessayez.");
      return;
    }
    if (!userData.user) {
      setError("Votre session a expiré. Reconnectez-vous pour continuer.");
      return;
    }

    setSaving(true);
    setError(null);
    setNotice(null);
    let saveError: string | null = null;

    try {
      if (dialog === "sale") {
        const { error: insertError } = await supabase.from("sales").insert({
          amount,
          payment_method: String(form.get("payment_method")),
          note: note || null,
          created_by: userData.user.id,
        });
        saveError = insertError?.message ?? null;
      } else if (dialog === "expense") {
        const { error: insertError } = await supabase.from("expenses").insert({
          amount,
          description: note,
          created_by: userData.user.id,
        });
        saveError = insertError?.message ?? null;
      } else if (dialog === "open-cash") {
        const { error: insertError } = await supabase.from("cash_sessions").insert({
          opening_balance: amount,
          created_by: userData.user.id,
        });
        saveError = insertError?.code === "23505"
          ? "Une caisse est déjà ouverte. Fermez-la avant d’en ouvrir une nouvelle."
          : insertError?.message ?? null;
      } else if (dialog === "close-cash" && activeCash) {
        const { data, error: updateError } = await supabase
          .from("cash_sessions")
          .update({ closing_balance: amount, closed_at: new Date().toISOString() })
          .eq("id", activeCash.id)
          .is("closed_at", null)
          .select("id")
          .maybeSingle();
        saveError = updateError?.message ?? null;
        if (!updateError && !data) {
          saveError = "Cette session a déjà été clôturée. Actualisez la page pour voir son statut.";
        }
      }
    } catch (saveException) {
      saveError = saveException instanceof Error ? saveException.message : "Une erreur réseau est survenue.";
    }

    setSaving(false);
    if (saveError) {
      setError(`Enregistrement impossible : ${saveError}`);
      return;
    }
    setDialog(null);
    setNotice("L’opération a bien été enregistrée.");
    await refresh();
  };

  const navigate = (target: AdminSection) => {
    setSection(target);
    setMenuOpen(false);
  };

  const openDialog = (kind: EntryKind) => {
    setError(null);
    setNotice(null);
    setDialog(kind);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (signOutError) {
      setError(signOutError instanceof Error ? signOutError.message : "La déconnexion a échoué.");
    }
  };

  const navItems: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview", label: "Vue d’ensemble", icon: LayoutDashboard },
    { id: "sales", label: "Ventes", icon: ReceiptText },
    { id: "expenses", label: "Dépenses", icon: ArrowDownLeft },
    { id: "cash", label: "Gestion de caisse", icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[#29241f]">
      {menuOpen && (
        <button
          aria-label="Fermer le menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/35 md:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[min(82vw,290px)] flex-col overflow-y-auto border-r border-[#e9e5dd] bg-white transition-transform duration-200 md:w-56 md:translate-x-0 lg:w-64 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link to="/" className="flex h-[76px] items-center gap-3 border-b border-[#eeeae3] px-6">
          <span className="grid h-9 w-9 place-items-center bg-[#211c18] font-serif text-lg text-white">O</span>
          <span>
            <span className="block text-[11px] font-semibold tracking-[0.22em]">OUSZAK</span>
            <span className="block text-[8px] tracking-[0.28em] text-stone-500">ADMINISTRATION</span>
          </span>
        </Link>
        <div className="px-4 pb-3 pt-8">
          <p className="px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-400">Boutique</p>
          <nav className="mt-3 space-y-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => navigate(id)}
                className={`flex w-full items-center gap-3 px-3 py-3 text-left text-xs transition ${
                  section === id
                    ? "bg-[#f0ece4] font-semibold text-[#4d3d25]"
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                }`}
              >
                <Icon size={17} strokeWidth={1.7} />
                {label}
                {section === id && <ChevronRight className="ml-auto" size={14} />}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto border-t border-[#eeeae3] p-4">
          <p className="truncate px-2 text-[10px] text-stone-400" title={email ?? undefined}>{email}</p>
          <button
            onClick={() => void handleSignOut()}
            className="mt-3 flex w-full items-center gap-3 px-2 py-2 text-xs text-stone-500 transition hover:text-red-700"
          >
            <LogOut size={16} /> Se déconnecter
          </button>
        </div>
      </aside>

      <div className="min-h-screen min-w-0 md:pl-56 lg:pl-64">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#e9e5dd] bg-white/95 px-4 backdrop-blur sm:px-7 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              className="grid h-9 w-9 place-items-center border border-stone-200 text-stone-600 md:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu size={18} />
            </button>
            <div>
              <p className="font-serif text-lg sm:text-xl">
                {navItems.find((item) => item.id === section)?.label}
              </p>
              <p className="hidden text-[10px] capitalize text-stone-400 sm:block">{todayLabel}</p>
            </div>
          </div>
          <span className="hidden items-center gap-2 text-[10px] text-stone-500 sm:flex">
            <span className={`h-2 w-2 rounded-full ${activeCash ? "bg-emerald-500" : "bg-stone-300"}`} />
            {activeCash ? "Caisse ouverte" : "Caisse fermée"}
          </span>
        </header>

        <main className="mx-auto max-w-[1440px] min-w-0 px-4 py-6 sm:px-7 sm:py-8 lg:px-10">
          {error && (
            <div role="alert" className="mb-5 flex items-start justify-between gap-3 border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-800">
              {error}
              <button aria-label="Fermer le message" onClick={() => setError(null)}><X size={16} /></button>
            </div>
          )}
          {notice && (
            <div role="status" className="mb-5 flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
              <Check size={15} /> {notice}
            </div>
          )}

          {section === "overview" && (
            <>
              <div className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a7d50]">Votre boutique en un regard</p>
                  <h1 className="mt-2 font-serif text-3xl font-light sm:text-4xl">Bonjour, bienvenue.</h1>
                  <p className="mt-2 text-xs text-stone-500">Voici le résumé de l’activité de votre boutique aujourd’hui.</p>
                </div>
                <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 xl:flex xl:flex-wrap">
                  <ActionButton icon={Plus} label="Enregistrer une vente" onClick={() => openDialog("sale")} primary />
                  <ActionButton icon={ArrowDownLeft} label="Ajouter une dépense" onClick={() => openDialog("expense")} />
                  <ActionButton
                    icon={activeCash ? X : Wallet}
                    label={activeCash ? "Fermer la caisse" : "Ouvrir la caisse"}
                    onClick={() => openDialog(activeCash ? "close-cash" : "open-cash")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-4">
                <MetricCard label="Ventes du jour" value={money.format(todaySales)} icon={ArrowUpRight} detail={`${sales.length} ventes récentes`} />
                <MetricCard label="Dépenses du jour" value={money.format(todayExpenses)} icon={ArrowDownLeft} detail={`${expenses.length} dépenses récentes`} />
                <MetricCard label="Solde net du jour" value={money.format(todaySales - todayExpenses)} icon={CircleDollarSign} detail="Ventes moins dépenses" />
                <MetricCard label="État de la caisse" value={activeCash ? "Ouverte" : "Fermée"} icon={Wallet} detail={activeCash ? `Depuis ${dateLabel(activeCash.opened_at)}` : "Aucune session en cours"} />
              </div>

              <div className="mt-7 grid min-w-0 gap-5 xl:grid-cols-[1.5fr_1fr]">
                <section className="border border-[#e9e5dd] bg-white">
                  <div className="flex items-center justify-between border-b border-[#eeeae3] px-5 py-4">
                    <div>
                      <h2 className="font-serif text-lg">Activité récente</h2>
                      <p className="mt-1 text-[10px] text-stone-400">Dernières ventes enregistrées</p>
                    </div>
                    <button onClick={() => navigate("sales")} className="text-[10px] font-semibold text-[#8b7045] hover:underline">Voir les ventes</button>
                  </div>
                  <ActivityTable
                    loading={loading}
                    rows={sales.slice(0, 5).map((sale) => ({
                      id: sale.id,
                      name: sale.note || "Vente boutique",
                      date: sale.sold_at,
                      amount: sale.amount,
                      kind: "sale",
                    }))}
                  />
                </section>
                <section className="border border-[#e9e5dd] bg-white p-5">
                  <div className="flex items-center gap-3">
                    <span className={`grid h-10 w-10 place-items-center ${activeCash ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
                      <Wallet size={18} />
                    </span>
                    <div>
                      <h2 className="font-serif text-lg">Caisse du jour</h2>
                      <p className="text-[10px] text-stone-400">{activeCash ? "Session en cours" : "Aucune session active"}</p>
                    </div>
                  </div>
                  <div className="my-5 border-t border-stone-100" />
                  {activeCash ? (
                    <div className="space-y-3 text-xs">
                      <InfoLine label="Ouverture" value={money.format(activeCash.opening_balance)} />
                      <InfoLine label="Depuis" value={dateLabel(activeCash.opened_at)} />
                    </div>
                  ) : (
                    <p className="text-xs leading-5 text-stone-500">Ouvrez la caisse pour démarrer une nouvelle session de vente.</p>
                  )}
                  <button
                    onClick={() => navigate("cash")}
                    className="mt-5 flex w-full items-center justify-between border border-stone-200 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] transition hover:border-stone-400"
                  >
                    Accéder à la caisse <ChevronRight size={15} />
                  </button>
                </section>
              </div>
            </>
          )}

          {section === "sales" && (
            <RecordSection
              title="Ventes"
              description="Consultez les ventes enregistrées et ajoutez une nouvelle opération."
              actionLabel="Enregistrer une vente"
              onAction={() => openDialog("sale")}
              loading={loading}
              rows={sales.map((sale) => ({
                id: sale.id, name: sale.note || "Vente boutique", date: sale.sold_at,
                amount: sale.amount, kind: "sale", detail: sale.payment_method,
              }))}
            />
          )}

          {section === "expenses" && (
            <RecordSection
              title="Dépenses"
              description="Suivez les sorties de caisse et les dépenses de la boutique."
              actionLabel="Ajouter une dépense"
              onAction={() => openDialog("expense")}
              loading={loading}
              rows={expenses.map((expense) => ({
                id: expense.id, name: expense.description, date: expense.spent_at,
                amount: expense.amount, kind: "expense",
              }))}
            />
          )}

          {section === "cash" && (
            <section className="mx-auto max-w-3xl">
              <div className="mb-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a7d50]">Suivi des sessions</p>
                <h1 className="mt-2 font-serif text-3xl font-light">Gestion de caisse</h1>
                <p className="mt-2 text-xs text-stone-500">Ouvrez une session au début de la journée et clôturez-la en fin d’activité.</p>
              </div>
              <div className="border border-[#e9e5dd] bg-white p-5 sm:p-7">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <span className={`grid h-12 w-12 place-items-center ${activeCash ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
                      <Banknote size={22} />
                    </span>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-stone-400">Statut actuel</p>
                      <h2 className="mt-1 font-serif text-2xl">{activeCash ? "Caisse ouverte" : "Caisse fermée"}</h2>
                    </div>
                  </div>
                  <ActionButton
                    icon={activeCash ? X : Wallet}
                    label={activeCash ? "Clôturer la caisse" : "Ouvrir la caisse"}
                    onClick={() => openDialog(activeCash ? "close-cash" : "open-cash")}
                    primary
                  />
                </div>
                {activeCash && (
                  <div className="mt-6 grid gap-4 border-t border-stone-100 pt-5 sm:grid-cols-2">
                    <InfoLine label="Fond de caisse à l’ouverture" value={money.format(activeCash.opening_balance)} />
                    <InfoLine label="Ouverte le" value={dateLabel(activeCash.opened_at)} />
                  </div>
                )}
              </div>
              <div className="mt-6 border border-[#e9e5dd] bg-white">
                <div className="border-b border-[#eeeae3] px-5 py-4">
                  <h2 className="font-serif text-lg">Sessions récentes</h2>
                </div>
                <ActivityTable
                  loading={loading}
                  rows={cashSessions.map((session) => ({
                    id: session.id, name: session.closed_at ? "Session clôturée" : "Session en cours",
                    date: session.opened_at, amount: session.closing_balance ?? session.opening_balance,
                    kind: "cash", detail: session.closed_at ? `Clôturée ${dateLabel(session.closed_at)}` : "Fond initial",
                  }))}
                />
              </div>
            </section>
          )}

          <div className="mt-10 flex items-center justify-between border-t border-stone-200 pt-5 text-[10px] text-stone-400">
            <span>OUSZAK COLLECTION · Administration</span>
            <span className="hidden items-center gap-1 sm:flex"><CalendarDays size={13} /> {todayLabel}</span>
          </div>
        </main>
      </div>

      {dialog && (
        <EntryDialog
          kind={dialog}
          saving={saving}
          activeCash={activeCash}
          onClose={() => setDialog(null)}
          onSubmit={submitEntry}
        />
      )}
    </div>
  );
};

const ActionButton: FC<{
  icon: typeof Plus;
  label: string;
  onClick: () => void;
  primary?: boolean;
}> = ({ icon: Icon, label, onClick, primary }) => (
  <button
    onClick={onClick}
    className={`inline-flex min-h-10 w-full items-center justify-center gap-2 whitespace-nowrap px-3 text-[10px] font-semibold transition sm:w-auto sm:px-4 ${
      primary
        ? "bg-[#211c18] text-white hover:bg-[#796342]"
        : "border border-[#ddd7cb] bg-white text-[#51483a] hover:border-[#9a7d50]"
    }`}
  >
    <Icon size={15} /> {label}
  </button>
);

const MetricCard: FC<{
  label: string;
  value: string;
  icon: typeof Plus;
  detail: string;
}> = ({ label, value, icon: Icon, detail }) => (
  <div className="border border-[#e9e5dd] bg-white p-3 sm:p-4">
    <div className="flex items-start justify-between">
      <p className="text-[9px] font-medium text-stone-500 sm:text-[10px]">{label}</p>
      <span className="grid h-7 w-7 place-items-center bg-[#f5f1e9] text-[#8b7045]"><Icon size={14} /></span>
    </div>
    <p className="mt-2 break-words font-serif text-lg sm:mt-3 sm:text-xl">{value}</p>
    <p className="mt-1 break-words text-[9px] text-stone-400">{detail}</p>
  </div>
);

const InfoLine: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex min-w-0 items-start justify-between gap-4 text-xs">
    <span className="min-w-0 text-stone-500">{label}</span>
    <span className="min-w-0 break-words text-right font-medium text-stone-800">{value}</span>
  </div>
);

interface ActivityRow {
  id: string;
  name: string;
  date: string;
  amount: number;
  kind: "sale" | "expense" | "cash";
  detail?: string;
}

const ActivityTable: FC<{ rows: ActivityRow[]; loading: boolean }> = ({ rows, loading }) => (
  <div className="divide-y divide-stone-100">
    {loading ? (
      <p className="px-5 py-8 text-center text-xs text-stone-400">Chargement des données…</p>
    ) : rows.length === 0 ? (
      <p className="px-5 py-8 text-center text-xs text-stone-400">Aucune opération à afficher.</p>
    ) : rows.map((row) => (
      <div key={row.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <span className={`grid h-8 w-8 shrink-0 place-items-center ${
            row.kind === "sale" ? "bg-emerald-50 text-emerald-700" : row.kind === "expense" ? "bg-amber-50 text-amber-700" : "bg-stone-100 text-stone-600"
          }`}>
            {row.kind === "sale" ? <ArrowUpRight size={15} /> : row.kind === "expense" ? <ArrowDownLeft size={15} /> : <Wallet size={15} />}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-xs font-medium text-stone-800">{row.name}</span>
            <span className="mt-1 block truncate text-[10px] text-stone-400">{row.detail ?? dateLabel(row.date)}</span>
          </span>
        </div>
        <span className={`shrink-0 text-xs font-semibold ${row.kind === "expense" ? "text-amber-700" : "text-stone-800"}`}>
          {row.kind === "expense" ? "− " : ""}{money.format(row.amount)}
        </span>
      </div>
    ))}
  </div>
);

const RecordSection: FC<{
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  loading: boolean;
  rows: ActivityRow[];
}> = ({ title, description, actionLabel, onAction, loading, rows }) => (
  <section>
    <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a7d50]">Suivi de la boutique</p>
        <h1 className="mt-2 font-serif text-3xl font-light">{title}</h1>
        <p className="mt-2 text-xs text-stone-500">{description}</p>
      </div>
      <ActionButton icon={Plus} label={actionLabel} onClick={onAction} primary />
    </div>
    <div className="border border-[#e9e5dd] bg-white">
      <div className="flex items-center gap-2 border-b border-[#eeeae3] px-5 py-4">
        <Boxes size={16} className="text-[#9a7d50]" />
        <h2 className="font-serif text-lg">Opérations récentes</h2>
      </div>
      <ActivityTable rows={rows} loading={loading} />
    </div>
  </section>
);

const EntryDialog: FC<{
  kind: EntryKind;
  saving: boolean;
  activeCash: CashSession | null;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}> = ({ kind, saving, activeCash, onClose, onSubmit }) => {
  const isSale = kind === "sale";
  const isExpense = kind === "expense";
  const isClose = kind === "close-cash";
  const title = isSale ? "Enregistrer une vente" : isExpense ? "Ajouter une dépense" : isClose ? "Clôturer la caisse" : "Ouvrir la caisse";
  const description = isSale
    ? "Saisissez le montant et le mode de paiement."
    : isExpense
      ? "Indiquez le montant et le motif de la dépense."
      : isClose
        ? "Saisissez le montant compté en caisse à la clôture."
        : "Saisissez le fond de caisse disponible à l’ouverture.";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section role="dialog" aria-modal="true" aria-labelledby="entry-dialog-title" className="max-h-[calc(100dvh-1rem)] w-full max-w-md overflow-y-auto rounded-t-xl bg-white p-5 shadow-2xl sm:max-h-[calc(100dvh-2.5rem)] sm:rounded-none sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="entry-dialog-title" className="font-serif text-2xl">{title}</h2>
            <p className="mt-2 text-xs leading-5 text-stone-500">{description}</p>
          </div>
          <button aria-label="Fermer" onClick={onClose} className="text-stone-400 hover:text-stone-800"><X size={19} /></button>
        </div>
        {isClose && activeCash && (
          <p className="mt-4 bg-stone-50 px-4 py-3 text-xs text-stone-600">
            Fond initial : <strong>{money.format(activeCash.opening_balance)}</strong>
          </p>
        )}
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-stone-700">
              {isExpense ? "Montant dépensé (FCFA)" : isClose ? "Montant compté (FCFA)" : isSale ? "Montant de la vente (FCFA)" : "Fond de caisse (FCFA)"}
            </span>
            <input
              name="amount"
              type="number"
              min="1"
              step="1"
              required
              autoFocus
              className="w-full border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[#9a7d50] focus:ring-2 focus:ring-[#9a7d50]/15"
              placeholder="0"
            />
          </label>
          {isSale && (
            <label className="block">
              <span className="mb-2 block text-xs font-medium text-stone-700">Mode de paiement</span>
              <select name="payment_method" className="w-full border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#9a7d50]" defaultValue="cash">
                <option value="cash">Espèces</option>
                <option value="mobile_money">Mobile money</option>
                <option value="card">Carte</option>
                <option value="other">Autre</option>
              </select>
            </label>
          )}
          {(isSale || isExpense) && (
            <label className="block">
              <span className="mb-2 block text-xs font-medium text-stone-700">{isSale ? "Note (facultatif)" : "Motif de la dépense"}</span>
              <input
                name="note"
                required={isExpense}
                maxLength={240}
                className="w-full border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[#9a7d50]"
                placeholder={isSale ? "Ex. commande en boutique" : "Ex. fournitures, transport…"}
              />
            </label>
          )}
          <div className="flex justify-end gap-2 border-t border-stone-100 pt-4">
            <button type="button" onClick={onClose} className="border border-stone-200 px-4 py-3 text-xs text-stone-600 hover:bg-stone-50">Annuler</button>
            <button disabled={saving} type="submit" className="inline-flex items-center gap-2 bg-[#211c18] px-5 py-3 text-xs font-semibold text-white hover:bg-[#796342] disabled:opacity-60">
              {saving ? "Enregistrement…" : <><Check size={15} /> Confirmer</>}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AdminDashboard;
