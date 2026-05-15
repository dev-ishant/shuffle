import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Menu, X, Search, ShoppingBag, ChevronDown, Bell, Heart, User, Flame } from "lucide-react"

const navCategories = [
  "All Categories",
  "Food & Bakery",
  "Clothing",
  "Art & Craft",
  "Candles & Soaps",
  "Home Decor",
  "Stationery",
]

const quickLinks = [
  { name: "Best Deals", highlight: "orange" },
  { name: "Food & Bakery" },
  { name: "Clothing" },
  { name: "Art & Craft" },
  { name: "Candles & Soaps" },
  { name: "Home Decor" },
  { name: "Stationery" },
  { name: "Gift Boxes" },
]

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [cartCount] = useState(0)
  const categoryRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 4)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setIsCategoryOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/listings?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.08)]" : "shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
        }`}
      >
        {/* ── MAIN NAVBAR ── */}
        <div className="px-4 sm:px-6 lg:px-10 py-3 flex items-center gap-3 lg:gap-5 max-w-[1400px] mx-auto">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            {/* Shuffle Icon — two crossing arrows */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3bb397] via-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-400/40 group-hover:scale-105 group-hover:shadow-emerald-400/60 transition-all duration-300">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                {/* Top arrow: left to right (with bend down) */}
                <polyline points="16 3 21 3 21 8" />
                <path d="M4 20L21 3" />
                {/* Bottom arrow: right to left (with bend up) */}
                <polyline points="21 16 21 21 16 21" />
                <path d="M15 15l6 6M4 4l5 5" />
              </svg>
            </div>
            <span className="hidden sm:block text-xl font-black tracking-tight text-gray-900">
              Shuffle<span className="text-[#3bb397]">It</span>
            </span>
          </Link>

          {/* ── SEARCH BAR (Desktop) ── */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 items-center h-11 rounded-full border-2 border-[#3bb397] overflow-visible shadow-sm hover:shadow-[0_0_0_4px_rgba(59,179,151,0.12)] transition-shadow bg-white relative"
          >
            {/* Category Dropdown */}
            <div ref={categoryRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center gap-1.5 px-4 h-11 text-sm font-semibold text-gray-700 bg-gray-50 border-r border-gray-200 hover:bg-gray-100 transition-colors whitespace-nowrap rounded-l-full"
              >
                <span className="max-w-[110px] truncate">{selectedCategory}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isCategoryOpen ? "rotate-180" : ""}`} />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-[calc(100%+10px)] left-0 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-[60] overflow-hidden">
                  {navCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => { setSelectedCategory(cat); setIsCategoryOpen(false) }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        selectedCategory === cat
                          ? "bg-emerald-50 text-[#3bb397] font-semibold"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for any product or brand"
              className="flex-1 px-4 h-11 text-sm text-gray-700 bg-white outline-none placeholder:text-gray-400 min-w-0"
            />

            {/* Search Button */}
            <button
              type="submit"
              className="shrink-0 w-12 h-11 bg-[#3bb397] hover:bg-[#2a9d82] flex items-center justify-center transition-colors rounded-r-full"
            >
              <Search className="w-4 h-4 text-white" />
            </button>
          </form>

          {/* ── RIGHT ACTIONS ── */}
          <div className="flex items-center gap-1 sm:gap-2 ml-auto md:ml-0 shrink-0">

            {/* Mobile Search Icon */}
            <button
              className="md:hidden p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button className="hidden lg:flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-gray-500 hover:text-[#3bb397] hover:bg-emerald-50 transition-all group">
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-semibold">Wishlist</span>
            </button>

            {/* Notifications */}
            <button className="hidden lg:flex relative flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-gray-500 hover:text-[#3bb397] hover:bg-emerald-50 transition-all">
              <div className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
              </div>
              <span className="text-[10px] font-semibold">Alerts</span>
            </button>

            {/* Sign In */}
            <Link
              to="/login"
              className="hidden sm:flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-gray-500 hover:text-[#3bb397] hover:bg-emerald-50 transition-all group"
            >
              <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-semibold">Sign In</span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="flex items-center gap-2 bg-gray-900 hover:bg-[#1f826a] text-white px-4 py-2.5 rounded-xl transition-all group shrink-0 relative shadow-md hover:shadow-emerald-900/20"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-[10px] text-gray-400">My</span>
                <span className="text-sm font-bold">Cart</span>
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#3bb397] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Register */}
            <Link
              to="/register"
              className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#3bb397] text-sm font-bold text-[#3bb397] hover:bg-[#3bb397] hover:text-white transition-all shrink-0"
            >
              Register
            </Link>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors ml-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-100 bg-white ${
            isMobileMenuOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 px-4 pt-4 pb-3">
            <div className="flex flex-1 items-center h-11 rounded-full border-2 border-[#3bb397] overflow-hidden bg-white">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 h-11 text-sm outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="w-12 h-11 bg-[#3bb397] hover:bg-[#2a9d82] flex items-center justify-center transition-colors"
              >
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
          </form>

          {/* Mobile Categories Scroll */}
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
            {quickLinks.map((item) => (
              <Link
                key={item.name}
                to={`/listings?category=${encodeURIComponent(item.name)}`}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  item.highlight === "orange"
                    ? "text-orange-600 bg-orange-50"
                    : "text-gray-600 bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col px-4 pb-5 gap-1 border-t border-gray-100 pt-3">
            {[
              { name: "Browse Listings", path: "/listings" },
              { name: "How it Works", path: "/how-it-works" },
              { name: "Wishlist", path: "/wishlist" },
              { name: "Start Selling", path: "/sell" },
            ].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-gray-700 hover:text-[#3bb397] px-3 py-3 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-2" />
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/login"
                className="flex items-center justify-center py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-700 hover:border-[#3bb397] hover:text-[#3bb397] transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center py-2.5 rounded-xl bg-[#3bb397] text-sm font-bold text-white hover:bg-[#2a9d82] transition-all shadow-md shadow-emerald-500/30"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[76px] md:h-[88px]" />
    </>
  )
}

export default Navbar