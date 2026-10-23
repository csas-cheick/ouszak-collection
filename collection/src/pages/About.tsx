import { FC } from "react";
import { FiArrowRight, FiAward, FiScissors, FiTruck } from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import boutiqueImage from "../assets/boutique.jpeg";

const values = [
  {
    icon: FiScissors,
    number: "01",
    title: "Le geste",
    description:
      "L’attention portée aux formes, aux matières et aux finitions donne à chaque pièce son caractère.",
  },
  {
    icon: FiAward,
    number: "02",
    title: "L’exigence",
    description:
      "Une sélection soignée et une recherche d’équilibre entre élégance, confort et personnalité.",
  },
  {
    icon: FiTruck,
    number: "03",
    title: "La proximité",
    description:
      "Une maison ancrée à Niamey, à l’écoute de vos envies et de votre manière de vivre le style.",
  },
];

const About: FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const reveal: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.7, ease: "easeOut" },
    },
  };

  return (
    <div className="overflow-hidden bg-[#faf8f4] text-[#211c18]">
      <section className="relative isolate overflow-hidden border-b border-[#e6ddcf] bg-[#f1ede5]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_92%_18%,rgba(164,132,87,0.13),transparent_38%)]" />
        <div className="container mx-auto max-w-7xl px-6 py-9 sm:px-8 sm:py-11 md:px-10 md:py-14">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: shouldReduceMotion ? 0 : 0.12 },
              },
            }}
            className="max-w-3xl"
          >
            <motion.p
              variants={reveal}
              className="mb-3 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#9a7d50] sm:text-[10px]"
            >
              <span className="h-px w-7 bg-[#b3986a]" />
              Notre maison · Niamey
            </motion.p>
            <motion.h1
              variants={reveal}
              className="font-serif text-4xl font-light leading-tight tracking-[-0.035em] sm:text-5xl md:text-6xl"
            >
              Notre histoire,{" "}
              <span className="italic text-[#8b7045]">notre regard.</span>
            </motion.h1>
            <motion.p
              variants={reveal}
              className="mt-3 max-w-xl text-xs leading-6 text-[#756c60] sm:text-sm"
            >
              Une maison de mode née à Niamey, inspirée par notre héritage et
              tournée vers une élégance contemporaine.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section
        id="notre-histoire"
        className="container mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-32"
      >
        <div className="grid items-center gap-14 md:grid-cols-2 md:gap-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={reveal}
            className="relative"
          >
            <div className="absolute -left-3 -top-3 h-full w-full border border-[#cbb99b] sm:-left-5 sm:-top-5" />
            <div className="relative aspect-[4/5] overflow-hidden bg-[#e9e1d5]">
              <motion.img
                src={boutiqueImage}
                alt="La boutique OUSZAK COLLECTION à Niamey"
                className="h-full w-full object-cover"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.035 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <div className="absolute -bottom-4 right-0 bg-[#faf8f4] px-5 py-3 text-[9px] uppercase tracking-[0.2em] text-[#76664f] shadow-md sm:right-5 sm:px-7 sm:py-4">
              OUSZAK COLLECTION · NIAMEY
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: shouldReduceMotion ? 0 : 0.12 },
              },
            }}
          >
            <motion.p
              variants={reveal}
              className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9a7d50]"
            >
              Une maison, un regard
            </motion.p>
            <motion.h2
              variants={reveal}
              className="font-serif text-4xl font-light leading-tight tracking-[-0.035em] sm:text-5xl md:text-6xl"
            >
              Le style est
              <br />
              une <span className="italic text-[#8b7045]">expression.</span>
            </motion.h2>
            <motion.div
              variants={reveal}
              className="mt-7 space-y-5 text-sm leading-7 text-[#6e665d] sm:text-base sm:leading-8"
            >
              <p>
                Fondée à Niamey, OUSZAK COLLECTION est née de l’envie de faire
                dialoguer les inspirations locales et une élégance
                contemporaine.
              </p>
              <p>
                Notre univers réunit des pièces sélectionnées avec soin et des
                créations sur mesure. Chaque détail compte : une coupe, une
                matière, une allure qui vous ressemble.
              </p>
              <p>
                Plus qu’une collection, nous imaginons une expérience de style
                accueillante, personnelle et ancrée dans notre ville.
              </p>
            </motion.div>
            <motion.div variants={reveal} className="mt-8">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 border-b border-[#b9ad9b] pb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#453b2e] transition-colors hover:border-[#8b7045] hover:text-[#8b7045]"
              >
                Découvrir la boutique
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-[#e8e0d4] bg-[#f1ede5] py-20 md:py-28">
        <div className="container mx-auto max-w-7xl px-6 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={reveal}
            className="mb-12 max-w-xl md:mb-16"
          >
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9a7d50]">
              Ce qui nous inspire
            </p>
            <h2 className="font-serif text-4xl font-light tracking-[-0.035em] sm:text-5xl">
              Une élégance <span className="italic text-[#8b7045]">de sens.</span>
            </h2>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
            {values.map(({ icon: Icon, number, title, description }, index) => (
              <motion.article
                key={number}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.55,
                  delay: shouldReduceMotion ? 0 : index * 0.1,
                }}
                className="border-t border-[#cfc2ae] pt-5"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-[9px] font-semibold tracking-[0.22em] text-[#a38b64]">
                    {number}
                  </span>
                  <Icon className="h-5 w-5 text-[#9a7d50]" />
                </div>
                <h3 className="font-serif text-2xl text-[#302820]">{title}</h3>
                <p className="mt-3 max-w-xs text-xs leading-6 text-[#7a7165] sm:text-sm">
                  {description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#211c18] py-20 text-center text-[#faf8f4] md:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_120%,rgba(164,132,87,0.3),transparent_55%)]" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={reveal}
          className="container mx-auto max-w-3xl px-6"
        >
          <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#d7bd91]">
            Votre prochaine pièce vous attend
          </p>
          <h2 className="font-serif text-4xl font-light leading-tight sm:text-5xl md:text-6xl">
            Entrez dans notre
            <br />
            <span className="italic text-[#d7bd91]">univers.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/65">
            Parcourez la collection et trouvez la pièce qui raconte votre style.
          </p>
          <Link
            to="/shop"
            className="group mt-8 inline-flex items-center gap-4 bg-[#f2eadc] px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#211c18] transition-colors hover:bg-[#d7bd91]"
          >
            Explorer la collection
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
