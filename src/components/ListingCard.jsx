import { MapPin, Tag, Heart, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const TYPE_CONFIG = {
  sell:     { label: "For Sale",       bg: "bg-emerald-500",  dot: "bg-emerald-400" },
  exchange: { label: "Exchange",       bg: "bg-violet-500",   dot: "bg-violet-400" },
  both:     { label: "Sell & Swap",    bg: "bg-amber-500",    dot: "bg-amber-400" },
}

function ListingCard({ listing }) {
  const type = TYPE_CONFIG[listing.listing_type] || TYPE_CONFIG.sell
  const image = listing.image_urls?.[0] || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-gray-100 flex flex-col">

      {/* ── IMAGE ── */}
      <div className="relative w-full h-52 overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`flex items-center gap-1.5 ${type.bg} text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg`}>
            <span className={`w-1.5 h-1.5 rounded-full ${type.dot} bg-white/70`} />
            {type.label}
          </span>
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:text-red-500 text-gray-400">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* ── CONTENT ── */}
      <div className="p-4 flex flex-col gap-2 flex-1">

        {/* Category pill */}
        <div className="flex items-center gap-1 text-[#3bb397]">
          <Tag className="w-3 h-3" />
          <span className="text-[11px] font-bold uppercase tracking-wide">{listing.category}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-800 text-base leading-snug line-clamp-2 group-hover:text-[#3bb397] transition-colors">
          {listing.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-black text-gray-900">₹{listing.price}</span>
          {listing.listing_type === "both" && (
            <span className="text-xs text-gray-400 font-medium">or exchange</span>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-400">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs font-medium truncate">{listing.pickup_location}</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer Action */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-50 mt-1">
          <Link
            to={`/listings/${listing.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-900 hover:bg-[#3bb397] text-white text-sm font-bold rounded-xl transition-all duration-300 group/btn"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
          <button className="p-2.5 rounded-xl border border-gray-200 hover:border-[#3bb397] hover:text-[#3bb397] text-gray-400 transition-all">
            <Heart className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  )
}

export default ListingCard