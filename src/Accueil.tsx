import { FC } from "react";
import {
  FiArrowDown,
  FiArrowRight,
  FiAward,
  FiFacebook,
  FiInstagram,
  FiScissors,
  FiTruck,
} from "react-icons/fi";
import { FaTiktok, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion";
import type { PointerEvent } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import boutiqueImage from "./assets/boutique.jpeg";
import heroImage from "./assets/hero1.png";
import { catalogProducts } from "./data/catalog";

const socialLinks = [
  { icon: FiInstagram, href: "https://instagram.com/ouszak_collection", label: "Instagram" },
  { icon: FaTiktok, href: "https://tiktok.com/@ouszakcollection", label: "TikTok" },
  { icon: FaWhatsapp, href: "https://wa.me/22787801438", label: "WhatsApp" },
  { icon: FiFacebook, href: "https://facebook.com/ouszak_collection", label: "Facebook" },
];

const services = [
  {
    icon: FiScissors,
    title: "Le savoir-faire",
    description: "Des créations inspirées par l'élégance et le geste artisanal.",
  },
  {
    icon: FiAward,
    title: "Le souci du détail",
    description: "Des matières et des finitions choisies avec exigence.",
  },
  {
    icon: FiTruck,
    title: "La livraison",
    description: "Vos pièces livrées à Niamey et dans ses environs.",
  },
];

const Accueil: FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 120, damping: 18, mass: 0.7 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 18, mass: 0.7 });
  const featuredProducts = catalogProducts.filter((product) => !product.isModel);
  const coutureProduct = catalogProducts.find((product) => product.isModel);

  const handleHeroPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    rotateY.set(x * 9);
    rotateX.set(y * -7);
  };

  const resetHeroTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const reveal: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.75, ease: "easeOut" },
    },
  };

  return (
    <div className="overflow-hidden bg-[#faf8f4] text-[#211c18]">
      <section className="relative isolate min-h-[620px] overflow-hidden border-b border-[#e9e2d7] sm:min-h-[690px] md:min-h-[calc(100svh-5rem)]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_74%_46%,rgba(202,177,132,0.2),transparent_38%),linear-gradient(110deg,#faf8f4_0%,#f7f3ec_54%,#eee7da_100%)]" />
        <div className="container mx-auto grid min-h-[620px] max-w-7xl items-center gap-3 px-5 pb-16 pt-8 sm:min-h-[690px] sm:gap-4 sm:px-6 sm:pb-20 sm:pt-12 md:min-h-[calc(100svh-5rem)] md:grid-cols-[0.95fr_1.05fr] md:px-10 md:py-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: shouldReduceMotion ? 0 : 0.12,
                },
              },
            }}
            className="relative z-10 order-2 max-w-xl md:order-1"
          >
            <motion.p
              variants={reveal}
              className="mb-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#8b7045] md:text-xs"
            >
              <span className="h-px w-9 bg-[#b3986a]" />
              OUSZAK COLLECTION · NIAMEY
            </motion.p>
            <motion.h1
              variants={reveal}
              className="font-serif text-4xl font-light leading-[1.08] tracking-[-0.045em] sm:text-6xl md:text-7xl lg:text-[5.5rem]"
            >
              L’élégance
              <br />
              <span className="italic text-[#8b7045]">à votre image.</span>
            </motion.h1>
            <motion.p
              variants={reveal}
              className="mt-7 max-w-md text-sm leading-7 text-[#6e665d] md:text-base md:leading-8"
            >
              Une rencontre entre héritage et modernité. Découvrez des pièces
              choisies avec soin et des créations pensées pour vous.
            </motion.p>
            <motion.div
              variants={reveal}
              className="mt-7 flex flex-wrap items-center gap-4 sm:mt-9 sm:gap-5"
            >
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 bg-[#211c18] px-5 py-3.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:bg-[#8b7045] sm:gap-4 sm:px-7 sm:py-4 sm:text-[10px] sm:tracking-[0.2em] md:px-8"
              >
                Découvrir la collection
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                className="border-b border-[#b9ad9b] pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5e554b] transition-colors hover:border-[#8b7045] hover:text-[#8b7045]"
              >
                Notre histoire
              </Link>
            </motion.div>
            <motion.div
              variants={reveal}
              className="mt-12 hidden items-center gap-5 md:flex"
            >
              <div className="h-px w-12 bg-[#b3986a]" />
              <div className="flex gap-4">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="text-[#877d71] transition-colors hover:text-[#8b7045]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1.1, ease: "easeOut" }}
            className="relative order-1 mx-auto flex h-[320px] w-full max-w-lg items-center justify-center sm:h-[360px] md:order-2 md:h-[min(76vh,760px)] md:max-w-none"
            style={{ perspective: 1100 }}
            onPointerMove={handleHeroPointerMove}
            onPointerLeave={resetHeroTilt}
          >
            <div className="absolute left-1/2 top-1/2 aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#bda77f]/40" />
            <div className="absolute left-1/2 top-1/2 aspect-square w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e8decd]/70 blur-2xl" />
            <motion.div
              aria-hidden="true"
              className="absolute left-[16%] top-[12%] z-[1] h-[72%] w-[68%] rounded-[48%] border border-white/80 bg-gradient-to-br from-white/70 via-[#eee5d6]/45 to-[#c6b18c]/20 shadow-[24px_32px_60px_rgba(49,37,23,0.12)]"
              style={{ rotateX, rotateY, translateZ: -24, transformStyle: "preserve-3d" }}
            />
            <motion.img
              src={heroImage}
              alt="Création OUSZAK COLLECTION"
              className="relative z-10 h-full w-full object-contain drop-shadow-[0_36px_38px_rgba(49,37,23,0.24)]"
              style={{
                rotateX: shouldReduceMotion ? 0 : rotateX,
                rotateY: shouldReduceMotion ? 0 : rotateY,
                translateZ: 38,
                transformStyle: "preserve-3d",
              }}
              animate={
                shouldReduceMotion
                  ? undefined
                  : { y: [0, -9, 0], rotate: [0, 0.35, 0] }
              }
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.65, duration: 0.6 }}
              className="absolute bottom-3 right-1 z-20 border border-white/70 bg-[#faf8f4]/90 px-3 py-3 shadow-[0_15px_45px_rgba(49,37,23,0.08)] backdrop-blur-sm sm:bottom-9 sm:right-0 sm:px-5 sm:py-4"
              style={{ translateZ: 90, transformStyle: "preserve-3d" }}
            >
              <p className="font-serif text-lg italic text-[#514433]">
                L’art du détail
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#92816a]">
                Créations choisies avec soin
              </p>
            </motion.div>
          </motion.div>
        </div>

        <a
          href="#univers"
          aria-label="Découvrir la suite"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[9px] uppercase tracking-[0.25em] text-[#978a78] transition-colors hover:text-[#8b7045] md:flex"
        >
          Défiler
          <FiArrowDown className="animate-bounce" />
        </a>
      </section>

      <div className="overflow-hidden border-b border-[#e8e0d4] bg-[#211c18] py-4 text-[#eee4d4]">
        <motion.div
          animate={shouldReduceMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 34, ease: "linear" }}
          className="flex w-max whitespace-nowrap"
        >
          {[0, 1, 2, 3].map((item) => (
            <span
              key={item}
              className="px-5 font-serif text-sm italic tracking-[0.14em] md:px-9 md:text-base"
            >
              Élégance · Savoir-faire · Héritage · Modernité ·
            </span>
          ))}
        </motion.div>
      </div>

      <section
        id="univers"
        className="container mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20 md:px-10 md:py-32"
      >
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={reveal}
            className="relative order-2 md:order-1"
          >
            <div className="absolute -left-4 -top-4 h-full w-full border border-[#cbb99b] md:-left-6 md:-top-6" />
            <div className="relative aspect-[4/5] overflow-hidden bg-[#ede6da]">
              <motion.img
                src={boutiqueImage}
                alt="La boutique OUSZAK COLLECTION à Niamey"
                className="h-full w-full object-cover"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.035 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <div className="absolute -bottom-5 right-0 bg-[#faf8f4] px-5 py-3 text-[9px] uppercase tracking-[0.22em] text-[#76664f] shadow-sm sm:right-5 md:-bottom-6 md:px-7 md:py-4">
              Notre boutique · Niamey
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: shouldReduceMotion ? 0 : 0.12,
                },
              },
            }}
            className="order-1 md:order-2"
          >
            <motion.p
              variants={reveal}
              className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9a7d50]"
            >
              L’esprit OUSZAK
            </motion.p>
            <motion.h2
              variants={reveal}
              className="font-serif text-4xl font-light leading-tight tracking-[-0.035em] sm:text-5xl md:text-6xl"
            >
              L’élégance se
              <br />
              <span className="italic text-[#8b7045]">transmet.</span>
            </motion.h2>
            <motion.p
              variants={reveal}
              className="mt-6 max-w-lg text-sm leading-7 text-[#6e665d] md:text-base md:leading-8"
            >
              Chaque pièce est une histoire de style, de culture et de passion.
              À Niamey, OUSZAK COLLECTION imagine une mode qui célèbre votre
              singularité et accompagne chaque moment avec justesse.
            </motion.p>
            <motion.div variants={reveal} className="mt-8">
              <Link
                to="/about"
                className="group inline-flex items-center gap-3 border-b border-[#b9ad9b] pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#453b2e] transition-colors hover:border-[#8b7045] hover:text-[#8b7045]"
              >
                Découvrir notre histoire
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#f1ede5] py-14 sm:py-20 md:py-28">
        <div className="container mx-auto max-w-7xl px-5 sm:px-6 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={reveal}
            className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end md:mb-14"
          >
            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9a7d50]">
                Une sélection pour vous
              </p>
              <h2 className="font-serif text-4xl font-light tracking-[-0.035em] sm:text-5xl">
                Nos pièces <span className="italic text-[#8b7045]">choisies</span>
              </h2>
            </div>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#554a3b] transition-colors hover:text-[#8b7045]"
            >
              Explorer la boutique
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={18}
            slidesPerView={1.35}
            loop={featuredProducts.length > 3}
            speed={850}
            autoplay={
              shouldReduceMotion
                ? false
                : { delay: 3600, disableOnInteraction: false, pauseOnMouseEnter: true }
            }
            breakpoints={{
              520: { slidesPerView: 2.2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 24 },
              1100: { slidesPerView: 4, spaceBetween: 28 },
            }}
            className="!overflow-visible !pb-8"
          >
            {featuredProducts.map((product, index) => (
              <SwiperSlide key={product.id}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  variants={{
                    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: shouldReduceMotion ? 0 : 0.55,
                        delay: shouldReduceMotion ? 0 : index * 0.06,
                      },
                    },
                  }}
                  className="group"
                >
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-[#faf8f4] p-5 sm:p-7">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                      <span className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-[#faf8f4] text-[#332b21] opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <FiArrowRight />
                      </span>
                    </div>
                    <div className="pt-4">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#9a7d50]">
                        {product.category}
                      </p>
                      <h3 className="mt-1 font-serif text-lg text-[#302820]">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#82796d]">
                        Informations et prix sur demande
                      </p>
                    </div>
                  </Link>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#211c18] py-12 text-[#f8f4ed] sm:py-20 md:py-28">
        <div className="pointer-events-none absolute -right-44 top-0 h-[34rem] w-[34rem] rounded-full border border-[#d6c4a0]/10" />
        <div className="pointer-events-none absolute -right-24 top-20 h-[24rem] w-[24rem] rounded-full border border-[#d6c4a0]/10" />
        <div className="container relative mx-auto max-w-7xl px-4 sm:px-8 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={reveal}
            className="mb-6 flex items-end justify-between gap-3 sm:mb-10 sm:gap-5"
          >
            <div>
              <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.32em] text-[#d7bd91] sm:text-[10px]">
                OUSZAK COLLECTION
              </p>
              <h2 className="font-serif text-2xl font-light tracking-[-0.035em] sm:text-4xl md:text-5xl">
                Le style prend <span className="italic text-[#d7bd91]">forme.</span>
              </h2>
            </div>
            <Link
              to="/shop"
              className="group mb-1 hidden items-center gap-3 border-b border-white/30 pb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/75 transition-colors hover:border-[#d7bd91] hover:text-[#d7bd91] sm:inline-flex"
            >
              Tout voir
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-[1.18fr_0.82fr] md:gap-5">
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: "easeOut" }}
              className="col-span-2 min-w-0 md:col-span-1"
            >
              <Link
                to="/shop"
                className="group relative block min-h-[360px] overflow-hidden border border-[#d8c7a8]/70 bg-[radial-gradient(ellipse_at_70%_32%,#fffdf9_0%,#f3ede2_64%,#e9dfcf_100%)] shadow-[0_24px_70px_rgba(8,6,4,0.2)] sm:min-h-[510px] md:h-full md:min-h-[690px]"
              >
                <div className="absolute inset-3 z-20 border border-[#ae9165]/35 sm:inset-6" />
                <span className="absolute left-6 top-6 z-30 text-[8px] font-semibold tracking-[0.2em] text-[#756142] sm:left-10 sm:top-10 sm:text-[9px] sm:tracking-[0.25em]">
                  01 / CRÉATION
                </span>
                <div className="absolute right-[-8%] top-[8%] z-0 aspect-square w-[68%] rounded-full border border-[#ad916b]/20" />
                {coutureProduct && (
                  <motion.img
                    src={coutureProduct.image}
                    alt="Création de couture sur mesure OUSZAK"
                    loading="lazy"
                    className="absolute inset-x-0 top-0 z-10 h-[86%] w-full object-contain p-2 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.025] sm:p-5 md:h-[87%] md:p-7"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 z-20 h-56 bg-gradient-to-t from-[#eee6d9] via-[#eee6d9]/90 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-2 p-5 sm:gap-4 sm:p-10">
                  <div>
                    <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#9a7d50]">
                      L’élégance du geste
                    </p>
                    <h3 className="font-serif text-2xl font-light tracking-[-0.025em] text-[#302820] sm:text-4xl md:text-5xl">
                      Le sur-mesure
                    </h3>
                    <p className="mt-2 text-xs text-[#71675b] sm:text-sm">
                      Une création qui n’appartient qu’à vous.
                    </p>
                  </div>
                  <span className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#9e835a]/50 text-[#594831] transition-all duration-300 group-hover:border-[#211c18] group-hover:bg-[#211c18] group-hover:text-white sm:h-11 sm:w-11">
                    <FiArrowRight />
                  </span>
                </div>
              </Link>
            </motion.div>

            <div className="col-span-2 grid min-w-0 grid-cols-2 gap-3 md:col-span-1 md:grid-cols-1 md:grid-rows-2 md:gap-5">
              {[
                {
                  index: "02",
                  label: "PARFUMS",
                  title: "Le sillage",
                  image: featuredProducts.find((product) => product.category === "Parfums")?.image,
                  background: "bg-[radial-gradient(ellipse_at_67%_38%,#fffefa,#f5f0e8_72%)]",
                  destination: featuredProducts.find((product) => product.category === "Parfums")?.id,
                },
                {
                  index: "03",
                  label: "CHAUSSURES",
                  title: "L’allure",
                  image: featuredProducts.find((product) => product.category === "Chaussures")?.image,
                  background: "bg-[radial-gradient(ellipse_at_67%_38%,#fffefa,#f2ede5_72%)]",
                  destination: featuredProducts.find((product) => product.category === "Chaussures")?.id,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.index}
                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 22 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.65,
                    delay: shouldReduceMotion ? 0 : index * 0.12,
                    ease: "easeOut",
                  }}
                  className="min-w-0"
                >
                  <Link
                    to={item.destination ? `/product/${item.destination}` : "/shop"}
                    className={`group relative block min-h-[220px] overflow-hidden border border-white/70 shadow-[0_16px_45px_rgba(8,6,4,0.12)] ${item.background} sm:min-h-[340px] md:h-full md:min-h-[330px]`}
                  >
                    <span className="absolute left-5 top-5 z-20 text-[9px] font-semibold tracking-[0.23em] text-[#6c5a43]/75 sm:left-7 sm:top-7">
                      {item.index} / {item.label}
                    </span>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-contain p-2 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.035] sm:p-7 md:p-5"
                      />
                    )}
                    <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between bg-gradient-to-t from-[#211c18]/75 to-transparent px-5 pb-5 pt-20 text-white sm:px-7 sm:pb-7">
                      <div>
                        <p className="mb-1 text-[9px] uppercase tracking-[0.22em] text-[#e8d5b3]">
                          Découvrir l’univers
                        </p>
                        <h3 className="font-serif text-2xl font-light sm:text-4xl">
                          {item.title}
                        </h3>
                      </div>
                      <span className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/60 transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#211c18]">
                        <FiArrowRight />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <Link
            to="/shop"
            className="group mt-6 inline-flex w-full items-center justify-center gap-3 border border-white/25 py-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/85 transition-colors hover:border-[#d7bd91] hover:text-[#d7bd91] sm:hidden"
          >
            Explorer toute la collection
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="border-y border-[#e8e0d4] bg-[#f5f1e9] py-16 md:py-20">
        <div className="container mx-auto grid max-w-7xl gap-10 px-6 sm:grid-cols-3 sm:gap-6 md:px-10">
          {services.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: shouldReduceMotion ? 0 : 0.55,
                    delay: shouldReduceMotion ? 0 : index * 0.1,
                  },
                },
              }}
              className="text-center"
            >
              <Icon className="mx-auto mb-4 h-5 w-5 text-[#9a7d50]" />
              <h3 className="font-serif text-xl text-[#302820]">{title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-[#7a7165]">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Accueil;
