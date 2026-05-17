import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/Footer"
import ShowcasePage from "@/pages/showcasePage"
import HomePage from "@/pages/HomePage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import ListingsPage from "@/pages/ListingsPage"
import ListingDetailPage from "@/pages/ListingDetailPage"
import CreateListingPage from "@/pages/CreateListingPage"
import ProfilePage from "@/pages/ProfilePage"
import CartPage from "@/pages/CartPage"

function AppContent() {
  const location = useLocation()
  
  // Hide navbar/footer on these paths
  const hideNavbarRoutes = ['/login', '/register']
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname)

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/showcase" element={<ShowcasePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listings/:id" element={<ListingDetailPage />} />
        <Route path="/create" element={<CreateListingPage />} />
        <Route path="/create-listing" element={<CreateListingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/cart" element={<CartPage />} />
        {/* Catch-all 404 Route */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50">
            <h1 className="text-6xl font-black text-purple-600 mb-4">404</h1>
            <p className="text-xl text-gray-600 font-semibold mb-2">Page Not Found</p>
            <p className="text-gray-400 mb-8 max-w-md">The page you are looking for doesn't exist yet or has been moved.</p>
            <a href="/" className="px-6 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/30">Go Back Home</a>
          </div>
        } />
      </Routes>
      {shouldShowNavbar && <Footer />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App