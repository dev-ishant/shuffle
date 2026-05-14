import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/buttons/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Handle scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Browse", path: "/listings" },
    { name: "Categories", path: "/categories" },
    { name: "How it Works", path: "/how-it-works" },
  ]

  return (
    <>
      <nav className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/80 backdrop-blur-md border-b border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-3"
          : "bg-transparent py-5"
      )}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group relative z-50">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-lg leading-none">S</span>
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-fuchsia-600 tracking-tight">
              Shuffle
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className="text-sm font-semibold text-gray-600 hover:text-purple-600 hover:translate-y-[-1px] transition-all duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200/60">
              <Link to="/login">
                <Button variant="ghost" className="font-semibold text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20 rounded-xl px-5">
                  Register
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden relative z-50 p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={cn(
          "absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl overflow-hidden transition-all duration-300 ease-in-out md:hidden origin-top",
          isMobileMenuOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
        )}>
          <div className="flex flex-col px-6 py-6 gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="text-base font-medium text-gray-700 hover:text-purple-600 p-2 rounded-lg hover:bg-purple-50 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-2" />
            <div className="flex flex-col gap-3">
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full justify-center border-gray-200 text-gray-700 hover:bg-gray-50 h-11 rounded-xl">
                  Login
                </Button>
              </Link>
              <Link to="/register" className="w-full">
                <Button className="w-full justify-center bg-purple-600 hover:bg-purple-700 text-white h-11 rounded-xl shadow-md shadow-purple-500/20">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer to push content down below the fixed navbar */}
      <div className="h-[72px]" />
    </>
  )
}

export default Navbar