import { FC, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";

const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Boutique", path: "/shop" },
    { name: "À Propos", path: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-serif font-bold text-xl">
              O
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-serif font-bold tracking-widest leading-none text-black">
                OUSZAK
              </span>
              <span className="text-[10px] font-medium tracking-[0.3em] text-gray-500 group-hover:text-black transition-colors leading-none mt-1">
                COLLECTION
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors group ${
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

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Rechercher"
            >
              <FiSearch className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-gray-900"
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="py-4 border-t border-gray-200">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Rechercher des produits..."
                className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                autoFocus
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                aria-label="Rechercher"
              >
                <FiSearch className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </nav>

      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="container mx-auto px-6 py-4">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-3 px-4 rounded-lg text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
