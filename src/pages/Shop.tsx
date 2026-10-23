import { FC, useMemo, useState } from "react";
import { FiArrowRight, FiGrid, FiList } from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { catalogProducts } from "../data/catalog";

const Shop: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const shouldReduceMotion = useReducedMotion();

  const categories = [
    "Tous",
    ...new Set(catalogProducts.map((product) => product.category)),
  ];
  const products = useMemo(
    () =>
      catalogProducts.filter(
        (product) =>
          selectedCategory === "Tous" || product.category === selectedCategory,
      ),
    [selectedCategory],
  );

  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#211c18]">
      <section className="relative isolate overflow-hidden border-b border-[#e6ddcf] bg-[#f1ede5]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_90%_20%,rgba(164,132,87,0.13),transparent_38%)]" />
        <div className="container mx-auto flex max-w-7xl items-end justify-between gap-6 px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.55 }}
          >
            <p className="mb-3 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#9a7d50] sm:text-[10px]">
              <span className="h-px w-6 bg-[#b3986a]" />
              OUSZAK COLLECTION
            </p>
            <h1 className="font-serif text-3xl font-light leading-tight tracking-[-0.035em] sm:text-4xl md:text-5xl">
              La boutique <span className="italic text-[#8b7045]">OUSZAK</span>
            </h1>
            <p className="mt-2 max-w-xl text-xs leading-6 text-[#756c60] sm:text-sm">
              Découvrez notre sélection de pièces et de créations.
            </p>
          </motion.div>
          <p className="hidden shrink-0 pb-1 text-[9px] uppercase tracking-[0.2em] text-[#9a7d50] sm:block">
            La collection · Niamey
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 md:px-10 md:py-20">
        <div className="mb-9 flex flex-col gap-6 border-b border-[#e7dfd3] pb-6 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#9a7d50]">
              Explorer par univers
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={selectedCategory === category}
                  className={`border px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.15em] transition-all duration-300 sm:px-5 ${
                    selectedCategory === category
                      ? "border-[#211c18] bg-[#211c18] text-[#faf8f4]"
                      : "border-[#ded5c7] bg-transparent text-[#746a5d] hover:border-[#9a7d50] hover:text-[#705a39]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 md:justify-end">
            <p className="text-[9px] uppercase tracking-[0.18em] text-[#8a8073]">
              {products.length} pièces
            </p>
            <div className="flex items-center gap-1 border-l border-[#e2d9cc] pl-3">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${viewMode === "grid" ? "text-[#211c18]" : "text-[#aaa093] hover:text-[#6f5d43]"}`}
                aria-label="Affichage en grille"
                aria-pressed={viewMode === "grid"}
              >
                <FiGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${viewMode === "list" ? "text-[#211c18]" : "text-[#aaa093] hover:text-[#6f5d43]"}`}
                aria-label="Affichage en liste"
                aria-pressed={viewMode === "list"}
              >
                <FiList className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <motion.div
          layout
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-6 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4"
              : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {products.map((product, index) => {
            const productUrl = product.isModel
              ? `/product/couture/${product.id}`
              : `/product/${product.id}`;

            return (
              <motion.article
                layout
                key={product.id}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.45,
                  delay: shouldReduceMotion ? 0 : Math.min(index * 0.045, 0.27),
                }}
                className={
                  viewMode === "grid"
                    ? "group"
                    : "flex gap-4 border border-[#e9e1d6] bg-[#f5f1e9] p-3 sm:gap-6 sm:p-5"
                }
              >
                <Link
                  to={productUrl}
                  className={
                    viewMode === "grid"
                      ? "relative mb-3 flex aspect-[4/5] items-center justify-center overflow-hidden border border-[#eee7dd] bg-[#f2eee7] p-3 sm:mb-4 sm:p-5"
                      : "relative flex aspect-[4/5] w-32 shrink-0 items-center justify-center overflow-hidden bg-[#ebe4d8] p-3 sm:w-40 sm:p-5"
                  }
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  {product.isModel && (
                    <span className="absolute left-2 top-2 border border-[#b9a47f]/70 bg-[#faf8f4]/90 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#715b39] sm:left-3 sm:top-3">
                      Sur mesure
                    </span>
                  )}
                  {viewMode === "grid" && (
                    <span className="absolute bottom-2 right-2 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-[#211c18] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:bottom-3 sm:right-3 sm:h-9 sm:w-9">
                      <FiArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Link>
                <div
                  className={
                    viewMode === "grid"
                      ? "space-y-1"
                      : "flex min-w-0 flex-1 flex-col justify-center"
                  }
                >
                  <p className="text-[8px] font-medium uppercase tracking-[0.2em] text-[#9a7d50] sm:text-[9px]">
                    {product.category}
                  </p>
                  <h2 className="font-serif text-base text-[#302820] sm:text-lg">
                    <Link to={productUrl} className="transition-colors hover:text-[#8b7045]">
                      {product.name}
                    </Link>
                  </h2>
                  <p className="text-[10px] text-[#82796d] sm:text-xs">
                    Informations et prix sur demande
                  </p>
                  {viewMode === "list" && (
                    <Link
                      to={productUrl}
                      className="group/link mt-4 inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#514533] hover:text-[#8b7045]"
                    >
                      Découvrir
                      <FiArrowRight className="transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
};

export default Shop;
