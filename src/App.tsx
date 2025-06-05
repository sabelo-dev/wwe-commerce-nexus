
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Layout from "@/components/layout/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import CategoriesPage from "./pages/CategoriesPage";
import BestSellersPage from "./pages/BestSellersPage";
import NewArrivalsPage from "./pages/NewArrivalsPage";
import DealsPage from "./pages/DealsPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import AccountPage from "./pages/AccountPage";
import MenClothingPage from "./pages/subcategories/MenClothingPage";
import WomenClothingPage from "./pages/subcategories/WomenClothingPage";
import KidsClothingPage from "./pages/subcategories/KidsClothingPage";
import AppliancesPage from "./pages/subcategories/AppliancesPage";
import KitchenPage from "./pages/subcategories/KitchenPage";
import FurniturePage from "./pages/subcategories/FurniturePage";
import VendorRegisterPage from "./pages/VendorRegisterPage";
import VendorOnboardingPage from "./pages/VendorOnboardingPage";
import VendorDashboardPage from "./pages/VendorDashboardPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard"; 
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="product/:slug" element={<ProductPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="category/:slug" element={<CategoryPage />} />
                <Route path="best-sellers" element={<BestSellersPage />} />
                <Route path="new-arrivals" element={<NewArrivalsPage />} />
                <Route path="deals" element={<DealsPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="account" element={<AccountPage />} />
                
                {/* Clothing Subcategories */}
                <Route path="category/clothing/men" element={<MenClothingPage />} />
                <Route path="category/clothing/women" element={<WomenClothingPage />} />
                <Route path="category/clothing/kids" element={<KidsClothingPage />} />
                
                {/* Home & Kitchen Subcategories */}
                <Route path="category/home-kitchen/appliances" element={<AppliancesPage />} />
                <Route path="category/home-kitchen/kitchen" element={<KitchenPage />} />
                <Route path="category/home-kitchen/furniture" element={<FurniturePage />} />
                
                {/* Vendor Routes */}
                <Route path="vendor/register" element={<VendorRegisterPage />} />
                <Route path="vendor/onboarding/:vendorId" element={<VendorOnboardingPage />} />
                <Route path="vendor/dashboard" element={<VendorDashboardPage />} />
                
                {/* Admin Routes */}
                <Route path="admin/dashboard" element={<AdminDashboard />} />
                
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
