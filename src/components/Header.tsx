import { FC, FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { LogIn, ShoppingBag } from "lucide-react";

const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSearch(new URLSearchParams(location.search).get("q") ?? "");
  }, [location.search]);

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Boutique", path: "/shop" },
    { name: "À Propos", path: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-black font-serif text-xl font-bold text-white">
              O
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold leading-none tracking-widest text-black">
                OUSZAK
              </span>
              <span className="mt-1 text-[10px] font-medium leading-none tracking-[0.3em] text-gray-500 transition-colors group-hover:text-black">
                COLLECTION
              </span>
            </div>
          </Link>

          <div className="hidden items-center space-x-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`group relative text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-black transition-all duration-300 ${
                    isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setIsSearchOpen((open) => !open)}
              className="p-2 text-gray-700 transition-colors hover:text-gray-900"
              aria-label={isSearchOpen ? "Fermer la recherche" : "Rechercher"}
              aria-expanded={isSearchOpen}
            >
              <FiSearch className="h-5 w-5" />
            </button>
            <span
              className="flex h-10 w-9 cursor-not-allowed items-center justify-center text-gray-700"
              aria-label="Panier, bientôt disponible"
              title="Panier — bientôt disponible"
            >
              <ShoppingBag size={19} strokeWidth={1.7} />
            </span>
            <Link
              to="/admin/login"
              className="hidden items-center gap-2 bg-[#211c18] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#8b7045] sm:flex"
            >
              <LogIn size={14} />
              Se connecter
            </Link>
            <button
              onClick={() => setIsMenuOpen((open) => !open)}
              className="p-2 text-gray-700 hover:text-gray-900 lg:hidden"
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <form onSubmit={submitSearch} role="search" className="border-t border-gray-200 py-4">
            <div className="relative mx-auto max-w-2xl">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher des produits..."
                aria-label="Rechercher des produits"
                className="w-full rounded-full border border-gray-300 px-6 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black px-6 py-2 text-white transition-colors hover:bg-gray-800"
                aria-label="Lancer la recherche"
              >
                <FiSearch className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}
      </nav>

      {isMenuOpen && (
        <div className="border-t border-gray-200 bg-white lg:hidden">
          <div className="container mx-auto px-6 py-4">
            <nav className="space-y-1" aria-label="Menu mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/admin/login"
                onClick={() => setIsMenuOpen(false)}
                className="mt-3 flex items-center gap-2 bg-[#211c18] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#8b7045]"
              >
                <LogIn size={16} />
                <span>Se connecter</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
