import { useState } from "react";
import { useStore, Product } from "./store/useStore";
import { PageType } from "./types";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const setSelectedProduct = useStore((state) => state.setSelectedProduct);
  const selectedProduct = useStore((state) => state.selectedProduct);

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage onNavigate={handleNavigate} onViewProduct={handleViewProduct} />
        )}
        {currentPage === 'catalog' && (
          <CatalogPage onNavigate={handleNavigate} onViewProduct={handleViewProduct} />
        )}
        {currentPage === 'product' && selectedProduct && (
          <ProductDetailPage onNavigate={handleNavigate} product={selectedProduct} onViewProduct={handleViewProduct} />
        )}
        {currentPage === 'checkout' && (
          <CheckoutPage onNavigate={handleNavigate} />
        )}
        {currentPage === 'login' && (
          <AuthPage onNavigate={handleNavigate} mode="login" />
        )}
        {currentPage === 'profile' && (
          <ProfilePage onNavigate={handleNavigate} onViewProduct={handleViewProduct} />
        )}
        {currentPage === 'admin' && (
          <AdminPage onNavigate={handleNavigate} />
        )}
      </main>
    </div>
  );
}
