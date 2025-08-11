
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Page imports
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import ProductPage from "@/pages/ProductPage";
import CategoryPage from "@/pages/CategoryPage";
import CategoriesPage from "@/pages/CategoriesPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import CheckoutPage from "@/pages/CheckoutPage";
import CheckoutSuccessPage from "@/pages/CheckoutSuccessPage";
import CheckoutCancelPage from "@/pages/CheckoutCancelPage";
import AccountPage from "@/pages/AccountPage";
import ConsumerDashboard from "@/pages/ConsumerDashboard";
import ContactPage from "@/pages/ContactPage";
import FAQPage from "@/pages/FAQPage";
import NotFound from "@/pages/NotFound";

// Admin pages
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";

// Vendor pages
import VendorLoginPage from "@/pages/VendorLoginPage";
import VendorRegisterPage from "@/pages/VendorRegisterPage";
import VendorOnboardingPage from "@/pages/VendorOnboardingPage";
import VendorDashboardPage from "@/pages/VendorDashboardPage";

// Subcategory pages
import MenClothingPage from "@/pages/subcategories/MenClothingPage";
import WomenClothingPage from "@/pages/subcategories/WomenClothingPage";
import KidsClothingPage from "@/pages/subcategories/KidsClothingPage";
import FurniturePage from "@/pages/subcategories/FurniturePage";
import AppliancesPage from "@/pages/subcategories/AppliancesPage";
import KitchenPage from "@/pages/subcategories/KitchenPage";

// Special pages
import BestSellersPage from "@/pages/BestSellersPage";
import NewArrivalsPage from "@/pages/NewArrivalsPage";
import DealsPage from "@/pages/DealsPage";
import PopularPage from "@/pages/PopularPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";

// Policy pages
import ShippingPage from "@/pages/ShippingPage";
import ReturnsPage from "@/pages/ReturnsPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="product/:slug" element={<ProductPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="category/:slug" element={<CategoryPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="checkout/success" element={<CheckoutSuccessPage />} />
                <Route path="checkout/cancel" element={<CheckoutCancelPage />} />
                <Route path="account" element={<AccountPage />} />
                <Route path="consumer/dashboard" element={
                  <ProtectedRoute requireAuth>
                    <ConsumerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="contact" element={<ContactPage />} />
                <Route path="faq" element={<FAQPage />} />
                
                {/* Special category pages */}
                <Route path="best-sellers" element={<BestSellersPage />} />
                <Route path="new-arrivals" element={<NewArrivalsPage />} />
                <Route path="deals" element={<DealsPage />} />
                <Route path="popular" element={<PopularPage />} />
                
                {/* Subcategory pages */}
                <Route path="men-clothing" element={<MenClothingPage />} />
                <Route path="women-clothing" element={<WomenClothingPage />} />
                <Route path="kids-clothing" element={<KidsClothingPage />} />
                <Route path="furniture" element={<FurniturePage />} />
                <Route path="appliances" element={<AppliancesPage />} />
                <Route path="kitchen" element={<KitchenPage />} />
                
                {/* Nested category routes */}
                <Route path="category/home-kitchen/appliances" element={<AppliancesPage />} />
                <Route path="category/home-kitchen/kitchen" element={<KitchenPage />} />
                <Route path="category/home-kitchen/furniture" element={<FurniturePage />} />
                <Route path="category/clothing/women" element={<WomenClothingPage />} />
                <Route path="category/clothing/men" element={<MenClothingPage />} />
                <Route path="category/clothing/kids" element={<KidsClothingPage />} />
                
                {/* Policy pages */}
                <Route path="shipping" element={<ShippingPage />} />
                <Route path="returns" element={<ReturnsPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="privacy" element={<PrivacyPage />} />
              </Route>
              
              {/* Auth pages without layout */}
              <Route path="login" element={<ProtectedRoute><LoginPage /></ProtectedRoute>} />
              <Route path="register" element={<ProtectedRoute><RegisterPage /></ProtectedRoute>} />
              <Route path="forgot-password" element={<ProtectedRoute><ForgotPasswordPage /></ProtectedRoute>} />
              
              {/* Admin pages */}
              <Route path="admin/login" element={<ProtectedRoute><AdminLoginPage /></ProtectedRoute>} />
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              
              {/* Vendor pages */}
              <Route path="vendor/login" element={<ProtectedRoute><VendorLoginPage /></ProtectedRoute>} />
              <Route path="vendor/register" element={<ProtectedRoute><VendorRegisterPage /></ProtectedRoute>} />
              <Route path="vendor/onboarding" element={<ProtectedRoute requireAuth requireVendor><VendorOnboardingPage /></ProtectedRoute>} />
              <Route path="vendor/dashboard" element={<ProtectedRoute requireAuth requireVendor><VendorDashboardPage /></ProtectedRoute>} />
              
              {/* 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
