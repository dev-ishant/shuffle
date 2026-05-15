import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { SlidersHorizontal, X, LayoutGrid, List, ArrowUpDown, Sparkles, PackageOpen, Plus } from "lucide-react"
import ListingCard from "@/components/ListingCard"
import ListingCardSkeleton from "@/components/ListingCardSkeleton"
import { getListings } from "@/api/listings"

// ── Sample data always shown as demo ─────────────────────────────────────────
const DEMO_LISTINGS = [
  { id: 1, title: "Homemade Chocolate Chip Cookies", price: 150, category: "Food & Bakery", pickup_location: "Hoshiarpur, Punjab", listing_type: "sell", image_urls: ["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600"] },
  { id: 2, title: "Hand Knitted Wool Sweater", price: 850, category: "Clothing", pickup_location: "Chandigarh, Punjab", listing_type: "exchange", image_urls: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600"] },
  { id: 3, title: "Handpainted Terracotta Pot", price: 300, category: "Home Decor", pickup_location: "Ludhiana, Punjab", listing_type: "both", image_urls: ["https://images.unsplash.com/photo-1612428820979-5cadd16e98c8?w=600"] },
  { id: 4, title: "Lavender Scented Soy Candle", price: 200, category: "Candles & Soaps", pickup_location: "Amritsar, Punjab", listing_type: "sell", image_urls: ["https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600"] },
  { id: 5, title: "Handmade Macrame Wall Hanging", price: 450, category: "Home Decor", pickup_location: "Patiala, Punjab", listing_type: "sell", image_urls: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600"] },
  { id: 6, title: "Artisan Sourdough Bread Loaf", price: 120, category: "Food & Bakery", pickup_location: "Jalandhar, Punjab", listing_type: "sell", image_urls: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600"] },
  { id: 7, title: "Organic Beeswax Pillar Candle", price: 180, category: "Candles & Soaps", pickup_location: "Mohali, Punjab", listing_type: "both", image_urls: ["https://images.unsplash.com/photo-1602178506168-1e07e93c66e8?w=600"] },
  { id: 8, title: "Vintage Embroidered Tote Bag", price: 550, category: "Clothing", pickup_location: "Shimla, HP", listing_type: "sell", image_urls: ["https://images.unsplash.com/photo-1544816155-12df9643f363?w=600"] },
  { id: 9, title: "Handcrafted Resin Art Coasters", price: 380, category: "Art & Craft", pickup_location: "Dehradun, UK", listing_type: "sell", image_urls: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"] },
]

const CATEGORIES = [
  { label: "All",           value: "All Categories",  emoji: "🛍️" },
  { label: "Food & Bakery", value: "Food & Bakery",   emoji: "🍪" },
  { label: "Clothing",      value: "Clothing",         emoji: "🧶" },
  { label: "Art & Craft",   value: "Art & Craft",      emoji: "🎨" },
  { label: "Candles",       value: "Candles & Soaps",  emoji: "🕯️" },
  { label: "Home Decor",    value: "Home Decor",       emoji: "🏠" },
  { label: "Stationery",    value: "Stationery",       emoji: "📚" },
  { label: "Gift Boxes",    value: "Gift Boxes",       emoji: "🎁" },
]

const LISTING_TYPES = [
  { value: "", label: "All" },
  { value: "sell", label: "For Sale" },
  { value: "exchange", label: "Exchange" },
  { value: "both", label: "Both" },
]

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest First" },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
]

function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("newest")

  const search      = searchParams.get("q") || ""
  const category    = searchParams.get("category") || "All Categories"
  const listingType = searchParams.get("listing_type") || ""

  useEffect(() => {
    async function fetchListings() {
      setLoading(true)
      try {
        const params = {}
        if (search) params.search = search
        if (category && category !== "All Categories") params.category = category
        if (listingType) params.listing_type = listingType
        const data = await getListings(params)
        setListings(data.listings || data)
        setIsDemo(false)
      } catch {
        setListings(DEMO_LISTINGS)
        setIsDemo(true)
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [search, category, listingType])

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value && value !== "All Categories") next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  function clearFilters() { setSearchParams({}, { replace: true }) }

  const hasActiveFilters = search || (category && category !== "All Categories") || listingType

  // Client-side filter + sort (only applied to demo data or live data without server-filter)
  const processed = [...listings]
    .filter((l) => {
      if (isDemo) {
        const catOk  = !category || category === "All Categories" || l.category === category
        const typeOk = !listingType || l.listing_type === listingType
        const qOk    = !search || l.title.toLowerCase().includes(search.toLowerCase())
        return catOk && typeOk && qOk
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === "price_asc")  return a.price - b.price
      if (sortBy === "price_desc") return b.price - a.price
      return 0
    })

  return (
    <div className="min-h-screen bg-[#f2f4f7]">

      {/* ── HERO BANNER ─────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden">
        {/* background blobs */}
        <div className="absolute top-[-40px] right-[-60px] w-80 h-80 rounded-full bg-[#3bb397]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-30px] left-[20%] w-60 h-60 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#3bb397]" />
              <span className="text-[#3bb397] text-xs font-bold tracking-[0.2em] uppercase">Marketplace</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Browse<br className="hidden sm:block" /> Listings
            </h1>
            <p className="text-gray-400 mt-2 text-sm font-medium max-w-xs">
              {processed.length > 0
                ? `Showing ${processed.length} handmade goods from local creators`
                : "Discover handmade goods from local creators"}
            </p>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-1 sm:gap-0 sm:flex-col sm:items-end">
            <div className="hidden sm:flex items-center gap-6 mb-4">
              {[
                { val: "500+", label: "Listings" },
                { val: "200+", label: "Sellers" },
                { val: "9",    label: "Cities" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-black text-white">{s.val}</div>
                  <div className="text-xs text-gray-500 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
            <Link
              to="/create-listing"
              className="flex items-center gap-2 px-5 py-3 bg-[#3bb397] hover:bg-[#2a9d82] text-white font-bold rounded-full transition-all shadow-xl shadow-emerald-900/40 hover:scale-105 text-sm"
            >
              <Plus className="w-4 h-4" />
              Post a Listing
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6">

        {/* ── CATEGORY PILLS ───────────────────────────────────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto mb-5 scrollbar-hide -mx-1 px-1">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat.value
            return (
              <button
                key={cat.value}
                onClick={() => updateParam("category", cat.value)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-[#3bb397] text-white border-[#3bb397] shadow-md shadow-emerald-500/25 scale-105"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#3bb397] hover:text-[#3bb397] shadow-sm"
                }`}
              >
                <span className="text-base">{cat.emoji}</span>
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* ── TOOLBAR ──────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">

          {/* Active chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {search && (
              <span className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-emerald-50 border border-emerald-200 text-[#3bb397] rounded-full text-xs font-bold">
                🔍 "{search}"
                <button onClick={() => updateParam("q", "")} className="p-0.5 hover:bg-emerald-200 rounded-full transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {listingType && (
              <span className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-purple-50 border border-purple-200 text-purple-600 rounded-full text-xs font-bold">
                {LISTING_TYPES.find(t => t.value === listingType)?.label}
                <button onClick={() => updateParam("listing_type", "")} className="p-0.5 hover:bg-purple-200 rounded-full transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-red-500 underline transition-colors font-medium">
                Clear all
              </button>
            )}
            {!hasActiveFilters && (
              <span className="text-sm text-gray-400 font-medium">All listings</span>
            )}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-wrap">

            {/* Listing type toggle pills */}
            <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm gap-0.5">
              {LISTING_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => updateParam("listing_type", t.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    listingType === t.value
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <label className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm hover:border-gray-300 transition-colors cursor-pointer">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>

            {/* View toggle */}
            <div className="flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
              <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-full transition-all ${viewMode === "grid" ? "bg-gray-900 text-white shadow-sm" : "text-gray-400 hover:text-gray-700"}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-full transition-all ${viewMode === "list" ? "bg-gray-900 text-white shadow-sm" : "text-gray-400 hover:text-gray-700"}`}>
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* More Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 h-9 px-4 rounded-full text-xs font-bold transition-all shadow-sm ${
                showFilters
                  ? "bg-[#3bb397] text-white border-[#3bb397] border shadow-emerald-500/25"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#3bb397] hover:text-[#3bb397]"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>
          </div>
        </div>

        {/* ── FILTER PANEL ─────────────────────────────────────────────── */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? "max-h-48 opacity-100 mb-6" : "max-h-0 opacity-0 mb-0"}`}>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
              <div className="flex-1">
                <label className="text-xs font-black text-gray-500 mb-2 block uppercase tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={(e) => updateParam("category", e.target.value)}
                  className="w-full h-10 px-4 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-[#3bb397] cursor-pointer transition-shadow"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs font-black text-gray-500 mb-2 block uppercase tracking-wider">Listing Type</label>
                <select
                  value={listingType}
                  onChange={(e) => updateParam("listing_type", e.target.value)}
                  className="w-full h-10 px-4 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-[#3bb397] cursor-pointer transition-shadow"
                >
                  {LISTING_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="h-10 px-5 text-sm font-bold text-red-500 hover:text-red-700 rounded-xl border border-red-100 hover:border-red-300 hover:bg-red-50 transition-all whitespace-nowrap"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── DEMO BANNER ──────────────────────────────────────────────── */}
        {isDemo && !loading && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-2xl px-4 py-3 mb-5">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
            <span><strong>Demo Mode</strong> — Backend unavailable. Showing sample listings.</span>
          </div>
        )}

        {/* ── SKELETON ─────────────────────────────────────────────────── */}
        {loading && (
          <div className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {[...Array(6)].map((_, i) => <ListingCardSkeleton key={i} />)}
          </div>
        )}

        {/* ── EMPTY STATE ──────────────────────────────────────────────── */}
        {!loading && processed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center mb-6 shadow-inner">
              <PackageOpen className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-black text-gray-700 mb-2">No listings found</h3>
            <p className="text-gray-400 text-sm max-w-xs mb-6 leading-relaxed">
              {hasActiveFilters
                ? "No results for your current filters. Try a different category or clear your search."
                : "No listings yet. Be the first to post something!"}
            </p>
            {hasActiveFilters ? (
              <button onClick={clearFilters} className="px-6 py-3 bg-[#3bb397] text-white font-bold rounded-full hover:bg-[#2a9d82] transition-all shadow-md shadow-emerald-500/30">
                Clear Filters
              </button>
            ) : (
              <Link to="/create-listing" className="px-6 py-3 bg-[#3bb397] text-white font-bold rounded-full hover:bg-[#2a9d82] transition-all shadow-md shadow-emerald-500/30">
                + Create First Listing
              </Link>
            )}
          </div>
        )}

        {/* ── RESULTS GRID ─────────────────────────────────────────────── */}
        {!loading && processed.length > 0 && (
          <>
            <p className="text-sm text-gray-400 font-medium mb-4">
              <span className="text-gray-800 font-black">{processed.length}</span> listing{processed.length !== 1 ? "s" : ""} found
            </p>
            <div className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-2xl"}`}>
              {processed.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default ListingsPage
