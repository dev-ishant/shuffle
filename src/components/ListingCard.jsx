import { MapPin, Tag } from "lucide-react"
import { ViewDetailsButton } from "@/components/ui/buttons/ViewDetailsButton"
import { MakeOfferButton } from "@/components/ui/buttons/MakeOfferButton"

// Badge component for listing type (Sell / Exchange / Both)
function ListingTypeBadge({ type }) {
  const styles = {
    sell: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    exchange: "bg-violet-100 text-violet-700 border border-violet-200",
    both: "bg-amber-100 text-amber-700 border border-amber-200",
  }

  const labels = {
    sell: "Sell",
    exchange: "Exchange",
    both: "Sell & Exchange",
  }

  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${styles[type]}`}>
      {labels[type]}
    </span>
  )
}

// Main ListingCard component
function ListingCard({ listing }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden
      shadow-[4px_4px_12px_#c5c7cf,-2px_-2px_8px_#ffffff]
      hover:-translate-y-1 hover:shadow-xl
      transition-all duration-300
      flex flex-col md:flex-row">

      {/* Image */}
      <div className="relative w-full h-52 md:w-56 md:h-auto shrink-0 bg-gray-100 overflow-hidden">
        <img
          src={listing.image_urls?.[0] || "/placeholder.jpg"}
          alt={listing.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />

        {/* Badge on top of image */}
        <div className="absolute top-3 left-3">
          <ListingTypeBadge type={listing.listing_type} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">

        {/* Title */}
        <h3 className="font-bold text-gray-800 text-base leading-tight line-clamp-2">
          {listing.title}
        </h3>

        {/* Price */}
        <p className="text-2xl font-extrabold text-purple-600">
          ₹{listing.price}
        </p>

        {/* Category */}
        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
          <Tag className="w-3.5 h-3.5" />
          <span>{listing.category}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
          <MapPin className="w-3.5 h-3.5" />
          <span>{listing.pickup_location}</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <ViewDetailsButton />
          <MakeOfferButton />
        </div>

      </div>
    </div>
  )
}

export default ListingCard