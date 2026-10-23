import chaussure1 from "../assets/produits/chaussure1.png";
import chaussure2 from "../assets/produits/chaussure2.png";
import chaussure3 from "../assets/produits/chaussure3.png";
import chaussure4 from "../assets/produits/chaussure4.png";
import couture1 from "../assets/produits/couture1.png";
import couture2 from "../assets/produits/couture2.png";
import parfum1 from "../assets/produits/parfum1.png";
import parfum2 from "../assets/produits/parfum2.png";
import parfum3 from "../assets/produits/parfum3.png";
import parfum4 from "../assets/produits/parfum4.png";

export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  isModel?: boolean;
}

export const catalogProducts: Product[] = [
  { id: "chaussure-1", name: "Chaussure 1", image: chaussure1, category: "Chaussures" },
  { id: "chaussure-2", name: "Chaussure 2", image: chaussure2, category: "Chaussures" },
  { id: "chaussure-3", name: "Chaussure 3", image: chaussure3, category: "Chaussures" },
  { id: "chaussure-4", name: "Chaussure 4", image: chaussure4, category: "Chaussures" },
  { id: "parfum-1", name: "Parfum 1", image: parfum1, category: "Parfums" },
  { id: "parfum-2", name: "Parfum 2", image: parfum2, category: "Parfums" },
  { id: "parfum-3", name: "Parfum 3", image: parfum3, category: "Parfums" },
  { id: "parfum-4", name: "Parfum 4", image: parfum4, category: "Parfums" },
  { id: "couture-1", name: "Modèle couture 1", image: couture1, category: "Couture", isModel: true },
  { id: "couture-2", name: "Modèle couture 2", image: couture2, category: "Couture", isModel: true },
];
