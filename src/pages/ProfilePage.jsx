import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  User, Package, Plus, LogOut, Edit3, MapPin, Star,
  ShoppingBag, RefreshCw, Heart, Settings, ChevronRight,
  Camera, Sparkles, TrendingUp
} from "lucide-react"
import ListingCard from "@/components/ListingCard"
import ListingCardSkeleton from "@/components/ListingCardSkeleton"
import { getUserListings, getProfile } from "@/api/listings"

// ── Demo fallback ─────────────────────────────────────────────────────────────
const DEMO_PROFILE = {
  name: "Priya Sharma",
  email: "priya.sharma@email.com",
  location: "Chandigarh, Punjab",
  joined: "January 2024",
  bio: "Homemade baker & craft enthusiast. I love creating handmade goodies for my community! 🍪",
  avatar: null,
  rating: 4.8,
  reviews: 24,
}

const DEMO_LISTINGS = [
  { id: 1, title: "Homemade Chocolate Chip Cookies", price: 150, category: "Food & Bakery", pickup_location: "Hoshiarpur, Punjab", listing_type: "sell", image_urls: ["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600"] },
  { id: 2, title: "Hand Knitted Wool Sweater", price: 850, category: "Clothing", pickup_location: "Chandigarh, Punjab", listing_type: "exchange", image_urls: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600"] },
  { id: 3, title: "Lavender Scented Soy Candle", price: 200, category: "Candles & Soaps", pickup_location: "Amritsar, Punjab", listing_type: "sell", image_urls: ["https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600"] },
]

const STATS = [
  { icon: ShoppingBag, label: "Listings",  value: "12",  color: "text-[#3bb397]",  bg: "bg-emerald-50" },
  { icon: RefreshCw,   label: "Exchanges", value: "5",   color: "text-violet-500", bg: "bg-violet-50"  },
  { icon: Heart,       label: "Wishlist",  value: "18",  color: "text-rose-500",   bg: "bg-rose-50"    },
  { icon: Star,        label: "Rating",    value: "4.8", color: "text-amber-500",  bg: "bg-amber-50"   },
]

// ── Tab definition ─────────────────────────────────────────────────────────────
const TABS = ["My Listings", "Wishlist", "Reviews"]

function ProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile]   = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [isDemo, setIsDemo]     = useState(false)
  const [activeTab, setActiveTab] = useState("My Listings")

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [profileData, listingsData] = await Promise.all([
          getProfile(),
          getUserListings(),
        ])
        setProfile(profileData.user || profileData)
        setListings(listingsData.listings || listingsData)
        setIsDemo(false)
      } catch {
        setProfile(DEMO_PROFILE)
        setListings(DEMO_LISTINGS)
        setIsDemo(true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  function handleLogout() {
    localStorage.removeItem("token")
    navigate("/")
  }

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f4f7]">
        {/* Cover skeleton */}
        <div className="h-48 bg-gray-200 animate-pulse" />
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 -mt-16 pb-10">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 animate-pulse">
            <div className="flex items-end gap-4 mb-6">
              <div className="w-24 h-24 rounded-3xl bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2 mb-2">
                <div className="h-6 w-48 bg-gray-200 rounded-full" />
                <div className="h-4 w-64 bg-gray-200 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl" />)}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => <ListingCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    )
  }

  const initial = profile?.name?.[0]?.toUpperCase() || "U"

  return (
    <div className="min-h-screen bg-[#f2f4f7]">

      {/* ── COVER BANNER ──────────────────────────────────────────────────── */}
      <div className="relative h-52 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#134e4a] overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-[-40px] right-[-60px] w-80 h-80 rounded-full bg-[#3bb397]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20px] left-[30%] w-56 h-56 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
        {/* Sparkle dots */}
        <Sparkles className="absolute top-6 right-8 w-5 h-5 text-[#3bb397]/40" />
        <Sparkles className="absolute bottom-8 left-10 w-4 h-4 text-white/20" />

        {/* Settings shortcut */}
        <button className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all text-white">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 -mt-16 pb-16 relative z-10">

        {/* ── PROFILE CARD ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-6">

          {/* Avatar + Name Row */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#3bb397] to-[#1f826a] flex items-center justify-center shadow-xl shadow-emerald-500/30 border-4 border-white">
                <span className="text-4xl font-black text-white">{initial}</span>
              </div>
              <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-gray-900 hover:bg-[#3bb397] rounded-full flex items-center justify-center text-white shadow-md transition-all">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Name + meta */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="text-2xl font-black text-gray-900">{profile?.name || "User"}</h1>
                  <p className="text-sm text-gray-400 mt-0.5">{profile?.email || ""}</p>
                  {profile?.location && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                      <MapPin className="w-3 h-3" />
                      {profile.location}
                    </div>
                  )}
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-[#3bb397] hover:text-[#3bb397] transition-all">
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Profile
                  </button>
                  <Link
                    to="/create-listing"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3bb397] hover:bg-[#2a9d82] text-white text-sm font-bold transition-all shadow-md shadow-emerald-500/25"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Listing
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>

              {/* Bio */}
              {profile?.bio && (
                <p className="text-sm text-gray-500 mt-3 max-w-lg leading-relaxed">{profile.bio}</p>
              )}
            </div>
          </div>

          {/* ── STATS ROW ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className={`${bg} rounded-2xl p-4 flex flex-col gap-1 group hover:scale-[1.02] transition-transform cursor-default`}>
                <Icon className={`w-5 h-5 ${color} mb-1`} />
                <span className="text-2xl font-black text-gray-800">{value}</span>
                <span className="text-xs font-semibold text-gray-500">{label}</span>
              </div>
            ))}
          </div>

          {/* Rating bar */}
          {profile?.rating && (
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(profile.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-700">{profile.rating}</span>
              <span className="text-sm text-gray-400">({profile.reviews || 0} reviews)</span>
            </div>
          )}
        </div>

        {/* ── DEMO NOTICE ───────────────────────────────────────────────── */}
        {isDemo && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-2xl px-4 py-3 mb-5">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span><strong>Demo Mode</strong> — Backend unavailable. Showing a preview profile.</span>
            <Link to="/login" className="ml-auto shrink-0 text-amber-700 underline font-semibold text-xs whitespace-nowrap">Sign In →</Link>
          </div>
        )}

        {/* ── TABS ──────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 mb-6 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── MY LISTINGS TAB ───────────────────────────────────────────── */}
        {activeTab === "My Listings" && (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-black text-gray-800">My Listings</h2>
                <p className="text-sm text-gray-400">{listings.length} listing{listings.length !== 1 ? "s" : ""} posted</p>
              </div>
              <Link
                to="/listings"
                className="flex items-center gap-1 text-sm font-semibold text-[#3bb397] hover:text-[#2a9d82] transition-colors"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100">
                <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mb-5">
                  <Package className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-black text-gray-700 mb-2">No listings yet</h3>
                <p className="text-gray-400 text-sm max-w-xs mb-6 leading-relaxed">
                  Start sharing your homemade goods with the community.
                </p>
                <Link
                  to="/create-listing"
                  className="px-6 py-3 bg-[#3bb397] text-white font-bold rounded-full hover:bg-[#2a9d82] transition-all shadow-md shadow-emerald-500/30"
                >
                  + Create Your First Listing
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {listings.map((listing) => (
                  <div key={listing.id} className="relative group">
                    <ListingCard listing={listing} />
                    <Link
                      to={`/edit/${listing.id}`}
                      className="absolute top-3 right-12 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-gray-600" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── WISHLIST TAB ──────────────────────────────────────────────── */}
        {activeTab === "Wishlist" && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100">
            <div className="w-20 h-20 rounded-3xl bg-rose-50 flex items-center justify-center mb-5">
              <Heart className="w-10 h-10 text-rose-300" />
            </div>
            <h3 className="text-lg font-black text-gray-700 mb-2">Your Wishlist</h3>
            <p className="text-gray-400 text-sm max-w-xs mb-6 leading-relaxed">
              Items you've saved will appear here. Start browsing to find something you love!
            </p>
            <Link to="/listings" className="px-6 py-3 bg-[#3bb397] text-white font-bold rounded-full hover:bg-[#2a9d82] transition-all shadow-md">
              Browse Listings
            </Link>
          </div>
        )}

        {/* ── REVIEWS TAB ───────────────────────────────────────────────── */}
        {activeTab === "Reviews" && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 flex items-center justify-center mb-5">
              <TrendingUp className="w-10 h-10 text-amber-300" />
            </div>
            <h3 className="text-lg font-black text-gray-700 mb-2">Reviews & Ratings</h3>
            <p className="text-gray-400 text-sm max-w-xs mb-6 leading-relaxed">
              Reviews from your buyers and exchange partners will appear here.
            </p>
            <div className="flex items-center gap-2 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
              <span className="text-gray-500 text-sm ml-1 font-semibold">4.8 avg rating</span>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ProfilePage
