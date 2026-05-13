import { Link } from "react-router-dom"
import { Button } from "@/components/ui/buttons/button"

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm">
      
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-purple-600">
        Shuffle
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-6">
        <Link to="/listings" className="text-gray-600 hover:text-purple-600 transition">
          Browse
        </Link>
        <Link to="/login">
          <Button variant="outline">Login</Button>
        </Link>
        <Link to="/register">
          <Button>Register</Button>
        </Link>
      </div>

    </nav>
  )
}

export default Navbar