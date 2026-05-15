import { Link } from "react-router-dom"

const footerLinks = {
  Explore: [
    { name: "Browse Listings", to: "/listings" },
    { name: "Categories", to: "/listings" },
    { name: "Best Deals", to: "/listings" },
    { name: "How It Works", to: "/" },
  ],
  Support: [
    { name: "FAQ", to: "/faq" },
    { name: "Contact Us", to: "/contact" },
    { name: "Privacy Policy", to: "/privacy" },
    { name: "Terms of Service", to: "/terms" },
  ],
  Community: [
    { name: "Start Selling", to: "/create" },
    { name: "Join as Seller", to: "/register" },
    { name: "Blog", to: "/blog" },
  ],
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#3bb397] via-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-400/40">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 3 21 3 21 8" />
                  <path d="M4 20L21 3" />
                  <polyline points="21 16 21 21 16 21" />
                  <path d="M15 15l6 6M4 4l5 5" />
                </svg>
              </div>
              <span className="text-lg font-black tracking-tight text-gray-900">
                Shuffle<span className="text-[#3bb397]">It</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-[200px]">
              Your local marketplace for homemade goods and artisan crafts.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{heading}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-600 hover:text-[#3bb397] transition-colors font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} ShuffleIt. All rights reserved.
          </p>
          <p className="text-xs text-gray-300">Made with love for local communities</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
