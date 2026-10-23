import { FC } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiShare2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { catalogProducts } from "../data/catalog";

const ProductDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = catalogProducts.find((item) => item.id === id);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: product?.name,
        text: `Découvrez ${product?.name} sur OUSZAK COLLECTION`,
        url,
      });
      return;
    }
    await navigator.clipboard.writeText(url);
    window.alert("Lien copié !");
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Produit non trouvé
        </h1>
        <Link
          to="/shop"
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <FiArrowLeft />
          Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Partager le produit"
          >
            <FiShare2 className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#f2eee7]"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain p-5 mix-blend-multiply sm:p-8"
            />
            {product.isModel && (
              <span className="absolute top-4 left-4 bg-black text-white text-xs font-bold px-3 py-1.5 uppercase tracking-wider">
                Sur mesure
              </span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">
              {product.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-xl md:text-2xl text-gray-900 mb-6">
              Prix sur demande
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Contactez-nous pour obtenir les informations sur ce produit.
            </p>
            <a
              href={`https://wa.me/22787801438?text=${encodeURIComponent(`Bonjour, je souhaite obtenir des informations sur ${product.name}.`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center py-4 px-6 bg-[#211c18] text-white rounded-lg font-semibold hover:bg-[#8b7045] transition-colors"
            >
              Demander sur WhatsApp
            </a>
            <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
              <div>
                <h2 className="font-medium text-gray-900">Disponibilité</h2>
                <p className="text-sm text-gray-500">
                  Informations disponibles auprès de notre équipe.
                </p>
              </div>
              <div>
                <h2 className="font-medium text-gray-900">Livraison</h2>
                <p className="text-sm text-gray-500">
                  Livraison disponible à Niamey et environs.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
