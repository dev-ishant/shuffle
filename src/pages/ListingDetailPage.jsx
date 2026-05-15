import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { MapPin, Tag, Calendar, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { MakeOfferButton } from "@/components/ui/buttons/MakeOfferButton"
import { PayNowButton } from "@/components/ui/buttons/PayNowButton"
import { EditListingButton } from "@/components/ui/buttons/EditListingButton"
import { DeleteListingButton } from "@/components/ui/buttons/DeleteListingButton"
import LoadingSpinner from "@/components/LoadingSpinner"
import { getListing } from "@/api/listings"

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

function ListingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    async function fetchListing() {
      setLoading(true)
      setError(null)
      try {
        const data = await getListing(id)
        setListing(data.listing || data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchListing()
  }, [id])

  if (loading) return <LoadingSpinner text="Loading listing..." className="min-h-screen" />

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-red-500 font-semibold">{error}</p>
        <Link to="/listings" className="text-[#3bb397] hover:underline text-sm font-medium">
          &larr; Back to listings
        </Link>
      </div>
    )
  }

  if (!listing) return null

  const images = listing.image_urls?.length ? listing.image_urls : ["/placeholder.jpg"]
  const isOwner = listing.is_owner

  return (
    <div className="min-h-screen bg-[#e8eaf0]">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white rounded-3xl overflow-hidden shadow-[4px_4px_12px_#c5c7cf,-2px_-2px_8px_#ffffff]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image Gallery */}
            <div className="relative bg-gray-100">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={images[currentImage]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <ListingTypeBadge type={listing.listing_type} />
                </div>
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((p) => (p === 0 ? images.length - 1 : p - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setCurrentImage((p) => (p === images.length - 1 ? 0 : p + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-all"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-700" />
                  </button>

                  {/* Thumbnails */}
                  <div className="flex gap-2 p-3 overflow-x-auto bg-gray-50">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImage(idx)}
                        className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                          idx === currentImage ? "border-[#3bb397] opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Details */}
            <div className="p-6 sm:p-8 flex flex-col gap-5">
              <div>
                <h1 className="text-2xl font-black text-gray-800 leading-tight">{listing.title}</h1>
                <p className="text-3xl font-extrabold text-purple-600 mt-2">
                  ₹{listing.price}
                </p>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span>{listing.category}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{listing.pickup_location}</span>
                </div>
                {listing.created_at && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {listing.description && (
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-2">Description</h3>
                  <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>
              )}

              {/* Seller info */}
              {listing.seller && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500">
                    {listing.seller.name?.[0] || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{listing.seller.name}</p>
                    <p className="text-xs text-gray-400">{listing.seller.email}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2 mt-auto">
                {isOwner ? (
                  <>
                    <EditListingButton />
                    <DeleteListingButton />
                  </>
                ) : (
                  <>
                    <MakeOfferButton />
                    <PayNowButton />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListingDetailPage
