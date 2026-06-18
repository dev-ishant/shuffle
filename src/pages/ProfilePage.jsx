import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  User, Package, Plus, LogOut, Edit3, MapPin, Star,
  ShoppingBag, RefreshCw, Heart, ChevronRight,
  Camera, Sparkles, TrendingUp, Calendar, BadgeCheck,
  ArrowRight, PackageOpen, Trash2
} from "lucide-react"
import ListingCard from "@/components/ListingCard"
import ListingCardSkeleton from "@/components/ListingCardSkeleton"
import { getUserListings, getProfile, deleteListing } from "@/api/listings"
import { updateMe } from "@/api/auth"

const TABS = ["My Listings", "Wishlist", "Reviews"]

function ProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile]     = useState(null)
  const [listings, setListings]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [activeTab, setActiveTab] = useState("My Listings")
  const [editing, setEditing]     = useState(false)
  const [newName, setNewName]     = useState("")
  const [saving, setSaving]       = useState(false)
  const [saveError, setSaveError] = useState("")

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [profileData, listingsData] = await Promise.all([
          getProfile(),
          getUserListings(),
        ])
        const p = profileData.user || profileData
        setProfile(p)
        setNewName(p.username || p.name || "")
        setListings(listingsData.listings || listingsData)
      } catch {
        const token = localStorage.getItem("access_token")
        if (!token) navigate("/login")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  function handleLogout() {
    localStorage.removeItem("access_token")
    navigate("/")
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this listing?")) return
    try {
      await deleteListing(id)
      setListings((prev) => prev.filter((listing) => listing.id !== id))
    } catch (error) {
      alert("Failed to delete listing. Please try again.")
    }
  }

  async function handleSaveName() {
    if (!newName.trim() || newName.trim() === (profile?.username || profile?.name)) {
      setEditing(false)
      return
    }
    setSaving(true)
    setSaveError("")
    try {
      const updated = await updateMe(newName.trim())
      setProfile((prev) => ({ ...prev, ...updated }))
      setEditing(false)
    } catch (err) {
      setSaveError(err?.response?.data?.detail || "Failed to update username")
    } finally {
      setSaving(false)
    }
  }

  const initial = (profile?.username || profile?.name)?.[0]?.toUpperCase() || "U"

  const STATS = [
    { icon: ShoppingBag, label: "Listings",  value: listings.length,        color: "text-[#3bb397]",  bg: "bg-emerald-50", border: "border-emerald-100" },
    { icon: RefreshCw,   label: "Exchanges", value: profile?.exchanges ?? 0, color: "text-violet-500", bg: "bg-violet-50",  border: "border-violet-100" },
    { icon: Heart,       label: "Wishlist",  value: profile?.wishlist  ?? 0, color: "text-rose-500",   bg: "bg-rose-50",    border: "border-rose-100" },
    { icon: Star,        label: "Rating",    value: profile?.rating    ?? "—", color: "text-amber-500",  bg: "bg-amber-50",   border: "border-amber-100" },
  ]

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f6f8]">
        {/* Cover skeleton */}
        <div className="h-64 bg-gradient-to-br from-[#0f172a] to-[#1e293b] animate-pulse" />
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 -mt-20 pb-10 relative z-10">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 animate-pulse">
            <div className="flex items-end gap-5 mb-6">
              <div className="w-28 h-28 rounded-3xl bg-gray-200 shrink-0 border-4 border-white shadow-xl" />
              <div className="flex-1 space-y-3 mb-2">
                <div className="h-7 w-48 bg-gray-200 rounded-full" />
                <div className="h-4 w-64 bg-gray-200 rounded-full" />
                <div className="h-4 w-32 bg-gray-200 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => <ListingCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8]">

      {/* ── HERO COVER ──────────────────────────────────────────────────────── */}
      <div className="relative h-64 md:h-72 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#134e4a] overflow-hidden">
        {/* Animated blobs */}
        <div className="absolute top-[-60px] right-[-60px] w-96 h-96 rounded-full bg-[#3bb397]/15 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-40px] left-[10%] w-72 h-72 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-[20%] left-[50%] w-48 h-48 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

        {/* Sparkles decoration */}
        <Sparkles className="absolute top-6 right-12 w-5 h-5 text-[#3bb397]/50" />
        <Sparkles className="absolute bottom-10 left-10 w-4 h-4 text-white/20" />
        <Sparkles className="absolute top-12 left-1/3 w-3 h-3 text-violet-400/30" />

        {/* Badge */}
        <div className="absolute top-6 left-4 sm:left-6 lg:left-10 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#3bb397]" />
          <span className="text-[#3bb397] text-xs font-bold tracking-[0.2em] uppercase">My Account</span>
        </div>

        {/* User info chip + Logout */}
        <div className="absolute top-5 right-4 sm:right-6 flex items-center gap-2">
          {/* Logged-in user chip */}
          <div className="hidden sm:flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full pl-1.5 pr-4 py-1.5">
            {/* Mini avatar */}
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3bb397] to-[#1f826a] flex items-center justify-center shrink-0 shadow-md">
              <span className="text-xs font-black text-white">{initial}</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-white text-xs font-bold truncate max-w-[120px]">
                {profile?.username || profile?.name || "User"}
              </span>
              <span className="text-white/50 text-[10px] truncate max-w-[120px]">
                {profile?.email || ""}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 h-9 px-4 rounded-full bg-white/10 hover:bg-red-500/80 backdrop-blur-sm text-white text-xs font-bold border border-white/10 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>


        {/* Page title */}
        <div className="absolute bottom-8 left-4 sm:left-6 lg:left-10">
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
            Your <span className="text-[#3bb397]">Profile</span>
          </h1>
        </div>
      </div>

      {/* ── MAIN ────────────────────────────────────────────────────────────── */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-16 relative z-10">

        {/* ── PROFILE CARD ──────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-6">

          {/* Avatar + Name Row */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 mb-8">

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#3bb397] to-[#1f826a] flex items-center justify-center shadow-2xl shadow-emerald-500/30 border-4 border-white">
                <span className="text-5xl font-black text-white">{initial}</span>
              </div>
              {/* Verified badge */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#3bb397] rounded-full flex items-center justify-center shadow-md border-2 border-white">
                <BadgeCheck className="w-4 h-4 text-white" />
              </div>
              <button className="absolute top-1 right-1 w-7 h-7 bg-gray-900/70 hover:bg-gray-900 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-md transition-all">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Name + Meta */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  {/* Name row — static or editing */}
                  {editing ? (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          autoFocus
                          value={newName}
                          onChange={(e) => { setNewName(e.target.value); setSaveError("") }}
                          onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") setEditing(false) }}
                          className="text-2xl font-black text-gray-900 border-b-2 border-[#3bb397] outline-none bg-transparent w-48 sm:w-64 placeholder-gray-300"
                          placeholder="Enter username"
                          maxLength={30}
                        />
                        <button
                          onClick={handleSaveName}
                          disabled={saving}
                          className="px-3 py-1 rounded-lg bg-[#3bb397] text-white text-xs font-bold hover:bg-[#2a9d82] transition-all disabled:opacity-50"
                        >
                          {saving ? "Saving…" : "Save"}
                        </button>
                        <button
                          onClick={() => { setEditing(false); setSaveError(""); setNewName(profile?.username || profile?.name || "") }}
                          className="px-3 py-1 rounded-lg border border-gray-200 text-gray-500 text-xs font-bold hover:border-gray-400 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                      {saveError && <p className="text-xs text-red-500 font-medium">{saveError}</p>}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-2xl font-black text-gray-900">{profile?.username || profile?.name || "User"}</h2>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#3bb397] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <BadgeCheck className="w-3 h-3" /> Verified Seller
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-gray-400 mt-0.5">{profile?.email || ""}</p>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    {profile?.location && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        {profile.location}
                      </div>
                    )}
                    {profile?.joined && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        Joined {profile.joined}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {!editing && (
                    <button
                      onClick={() => { setEditing(true); setNewName(profile?.username || profile?.name || "") }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-[#3bb397] hover:text-[#3bb397] transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  )}
                  <Link
                    to="/create-listing"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3bb397] hover:bg-[#2a9d82] text-white text-sm font-bold transition-all shadow-md shadow-emerald-500/25"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Listing
                  </Link>
                </div>
              </div>

              {/* Bio */}
              {profile?.bio && (
                <p className="text-sm text-gray-500 mt-3 leading-relaxed max-w-lg">{profile.bio}</p>
              )}
            </div>
          </div>

          {/* ── RATING BAR ─────────────────────────────────────────────────── */}
          {profile?.rating && (
            <div className="flex items-center gap-3 mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(profile.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                ))}
              </div>
              <span className="text-sm font-black text-gray-800">{profile.rating}</span>
              <span className="text-sm text-gray-400">({profile.reviews || 0} reviews)</span>
              <span className="ml-auto text-xs font-bold text-amber-600">⭐ Top Seller</span>
            </div>
          )}

          {/* ── STATS GRID ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map(({ icon: Icon, label, value, color, bg, border }) => (
              <div
                key={label}
                className={`${bg} border ${border} rounded-2xl p-4 flex flex-col gap-1.5 group hover:scale-[1.03] transition-transform cursor-default`}
              >
                <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <span className="text-2xl font-black text-gray-800">{value}</span>
                <span className="text-xs font-semibold text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── TABS ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 mb-6 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── MY LISTINGS TAB ──────────────────────────────────────────────── */}
        {activeTab === "My Listings" && (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-black text-gray-800">My Listings</h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  {listings.length} listing{listings.length !== 1 ? "s" : ""} posted
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/listings"
                  className="flex items-center gap-1 text-sm font-semibold text-[#3bb397] hover:text-[#2a9d82] transition-colors"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mb-5">
                  <PackageOpen className="w-10 h-10 text-gray-300" />
                </div>
                <h4 className="text-lg font-black text-gray-700 mb-2">No listings yet</h4>
                <p className="text-gray-400 text-sm max-w-xs mb-6 leading-relaxed">
                  Start sharing your homemade goods with the community.
                </p>
                <Link
                  to="/create-listing"
                  className="flex items-center gap-2 px-6 py-3 bg-[#3bb397] text-white font-bold rounded-full hover:bg-[#2a9d82] transition-all shadow-md shadow-emerald-500/30"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Listing
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {listings.map((listing) => (
                  <div key={listing.id} className="relative group">
                    <ListingCard listing={listing} />
                    {/* Actions overlay buttons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <Link
                        to={`/edit/${listing.id}`}
                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-md"
                        title="Edit Listing"
                      >
                        <Edit3 className="w-4 h-4 text-gray-600 hover:text-[#3bb397] transition-colors" />
                      </Link>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-md"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── WISHLIST TAB ─────────────────────────────────────────────────── */}
        {activeTab === "Wishlist" && (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 rounded-3xl bg-rose-50 flex items-center justify-center mb-5">
              <Heart className="w-10 h-10 text-rose-300" />
            </div>
            <h4 className="text-lg font-black text-gray-700 mb-2">Your Wishlist</h4>
            <p className="text-gray-400 text-sm max-w-xs mb-6 leading-relaxed">
              Items you've saved will appear here. Start browsing to find something you love!
            </p>
            <Link
              to="/listings"
              className="flex items-center gap-2 px-6 py-3 bg-[#3bb397] text-white font-bold rounded-full hover:bg-[#2a9d82] transition-all shadow-md"
            >
              Browse Listings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* ── REVIEWS TAB ──────────────────────────────────────────────────── */}
        {activeTab === "Reviews" && (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 flex items-center justify-center mb-5">
              <TrendingUp className="w-10 h-10 text-amber-300" />
            </div>
            <h4 className="text-lg font-black text-gray-700 mb-2">Reviews & Ratings</h4>
            <p className="text-gray-400 text-sm max-w-xs mb-6 leading-relaxed">
              Reviews from your buyers and exchange partners will appear here.
            </p>
            <div className="flex items-center gap-2 justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-gray-500 text-sm font-semibold">
              {profile?.rating || 4.8} avg rating · {profile?.reviews || 0} reviews
            </span>
          </div>
        )}

      </div>
    </div>
  )
}

export default ProfilePage
