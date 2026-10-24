import { FC, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import Accueil from "./Accueil";
import About from "./pages/About";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";

const AdminRoutes = lazy(() => import("./pages/admin/AdminRoutes"));

const App: FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/admin/*"
          element={<Suspense fallback={<div className="grid min-h-screen place-items-center text-sm text-stone-500">Chargement…</div>}><AdminRoutes /></Suspense>}
        />
        <Route path="*" element={<PublicLayout />} />
      </Routes>
    </Router>
  );
};

const PublicLayout: FC = () => (
  <div className="flex min-h-screen flex-col bg-gray-50">
    <Header />
    <main className="flex-1">
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/product/:type/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default App;
