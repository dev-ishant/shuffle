import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  ShoppingBag, Trash2, Plus, Minus, ArrowRight,
  Tag, MapPin, Sparkles, ShoppingCart, ChevronRight,
  Shield, Truck, RefreshCw, PackageOpen,
  ArrowLeftRight, Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp
} from "lucide-react"
import { getSentRequests } from "@/api/notifications"

// ── Helpers ─────────────────────────────────────────────────────────────────
const CART_KEY = "shuffleit_cart"

function loadCart() {
  try {
    const stored = localStorage.getItem(CART_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* ignore */ }
  // Default demo items only if cart has never been set before
  const defaults = [
    {
      id: 2,
      title: "Lavender Scented Soy Candle",
      category: "Candles & Soaps",
      pickup_location: "Amritsar, Punjab",
      listing_type: "sell",
      price: 200,
      qty: 2,
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400",
    },
    {
      id: 3,
      title: "Handpainted Terracotta Pot",
      category: "Home Decor",
      pickup_location: "Ludhiana, Punjab",
      listing_type: "both",
      price: 300,
      qty: 1,
      image: "https://images.unsplash.com/photo-1612428820979-5cadd16e98c8?w=400",
    },
  ]
  // Save defaults so first removal persists
  localStorage.setItem(CART_KEY, JSON.stringify(defaults))
  return defaults
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

const TYPE_STYLES = {
  sell:     { label: "For Sale",    bg: "bg-emerald-500" },
  exchange: { label: "Exchange",    bg: "bg-violet-500"  },
  both:     { label: "Sell & Swap", bg: "bg-amber-500"   },
}

const PERKS = [
  { icon: Shield,    text: "Safe & Secure Checkout"    },
  { icon: Truck,     text: "Pickup Arranged by Seller" },
  { icon: RefreshCw, text: "Easy Exchange Policy"      },
]

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  })
}

function StatusChip({ status }) {
  if (status === "accepted") return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200">
      🟢 Accepted
    </span>
  )
  if (status === "rejected") return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-600 border border-red-200">
      🔴 Rejected
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 border border-amber-200">
      🟡 Pending
    </span>
  )
}

function SentRequestCard({ req }) {
  const [showModal, setShowModal] = useState(false)
  const isExchange = req.type === "exchange_offer"
  const p = req.payload || {}
  const status = req.status

  const borderColor = status === "accepted"
    ? "border-l-emerald-500"
    : status === "rejected"
      ? "border-l-red-400"
      : "border-l-amber-400"

  return (
    <>
      <div className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${borderColor} shadow-sm overflow-hidden group`}>
        {/* Header row — always visible */}
        <button
          className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50/60 transition-colors"
          onClick={() => setShowModal(true)}
        >
          {/* Icon */}
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
            ${isExchange
              ? "bg-gradient-to-br from-pink-500 to-fuchsia-600"
              : "bg-gradient-to-br from-emerald-500 to-green-600"
            }`}>
            {isExchange
              ? <ArrowLeftRight className="w-4 h-4 text-white" />
              : <ShoppingCart className="w-4 h-4 text-white" />
            }
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-sm font-black text-gray-800 truncate">
                {isExchange ? "Exchange Offer" : "Order Request"}
              </p>
              <StatusChip status={status} />
            </div>
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              To <span className="font-semibold text-gray-700">{req.owner?.username}</span>
              {" · "}
              <span className="text-[#3bb397] font-semibold">{req.listing?.title}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] text-gray-400 hidden sm:block">{formatDate(req.created_at)}</span>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </div>

      {/* Modal Popup Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Container */}
          <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden transform scale-100 transition-all duration-300 flex flex-col">
            
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white px-6 py-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black tracking-wide">
                  {isExchange ? "Exchange Offer Details" : "Order Request Details"}
                </h3>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                  Sent to <span className="font-semibold text-gray-200">{req.owner?.username}</span>
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              
              {/* Listing Card info */}
              <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                {req.listing?.image_urls?.[0] ? (
                  <img 
                    src={req.listing.image_urls[0]} 
                    alt={req.listing.title} 
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200" 
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-[#3bb397]/10 flex items-center justify-center text-[#3bb397] font-bold">
                    Item
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#3bb397]">Target Listing</p>
                  <h4 className="text-sm font-black text-gray-800 truncate">{req.listing?.title}</h4>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    Price: ₹{req.listing?.price?.toLocaleString() || 0}
                    {req.listing?.pickup_location && ` · Pickup: ${req.listing.pickup_location}`}
                  </p>
                </div>
              </div>

              {/* Request Details (The Sent Request) */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Your Sent Request</h4>
                {isExchange ? (
                  <div className="bg-fuchsia-50/50 border border-fuchsia-100 rounded-2xl p-4 space-y-2">
                    <p className="text-[10px] font-bold text-fuchsia-500 uppercase tracking-wider">Exchange Swap Proposal</p>
                    <p className="text-sm font-black text-gray-800">{p.offer_title}</p>
                    {p.offer_desc && <p className="text-xs text-gray-600 leading-relaxed">{p.offer_desc}</p>}
                    {p.message && (
                      <div className="border-t border-fuchsia-100/70 pt-2.5 mt-2.5">
                        <p className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-wider">Your Message</p>
                        <p className="text-xs text-gray-700 italic mt-0.5 font-medium">"{p.message}"</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-3">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Purchase Proposal</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[10px] text-gray-400 font-semibold uppercase">Quantity</span>
                        <span className="text-xs font-black text-gray-800">{p.quantity}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 font-semibold uppercase">Total Amount</span>
                        <span className="text-xs font-black text-gray-800">₹{p.total?.toLocaleString() || 0}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 font-semibold uppercase">Payment Method</span>
                        <span className="text-xs font-black text-gray-800 uppercase">{p.payment || "COD"}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 font-semibold uppercase">Type</span>
                        <span className="text-xs font-black text-gray-800">Direct Order</span>
                      </div>
                    </div>
                    {p.address && (
                      <div className="border-t border-emerald-100/70 pt-2.5 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="block text-[10px] text-gray-400 font-semibold uppercase">Delivery Address</span>
                          <span className="text-xs text-gray-700 font-medium mt-0.5">{p.address}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Seller's Response Block (just after request) */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Seller's Response</h4>
                <div className={`rounded-2xl p-4 border text-xs leading-relaxed
                  ${ status === "accepted"
                      ? "bg-emerald-50 border-emerald-200"
                      : status === "rejected"
                        ? "bg-red-50 border-red-200"
                        : "bg-gray-50 border-gray-200"
                  }`}>
                  <p className={`font-black text-sm mb-1.5 flex items-center gap-1.5
                    ${ status === "accepted" ? "text-emerald-700"
                      : status === "rejected" ? "text-red-600"
                      : "text-gray-500" }`}>
                    {status === "accepted"
                      ? "✅ Accepted — they'll contact you"
                      : status === "rejected"
                        ? "❌ Rejected — try a different offer"
                        : "⏳ Waiting..."
                    }
                  </p>
                  <p className="text-gray-500 font-medium">
                    {status === "accepted"
                      ? "The seller has accepted your proposal! They will get in touch with you shortly to finalize details."
                      : status === "rejected"
                        ? "The seller declined this request. You can try editing your offer or browsing other listings."
                        : "The seller hasn't responded to your request yet. We will notify you here once they accept or reject."
                    }
                  </p>
                </div>
              </div>
              
              <div className="text-[10px] text-gray-400 text-center font-medium">
                Sent on {formatDate(req.created_at)}
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100">
              <button 
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-all"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}

function CartPage() {
  const [items, setItems] = useState(loadCart)

  // Persist to localStorage whenever items change
  useEffect(() => {
    saveCart(items)
    window.dispatchEvent(new Event("cart-updated"))
  }, [items])

  // Fetch sent requests
  const [sentRequests, setSentRequests] = useState([])
  const [reqLoading, setReqLoading]     = useState(false)
  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) return
    setReqLoading(true)
    getSentRequests()
      .then(setSentRequests)
      .catch(() => {})
      .finally(() => setReqLoading(false))
  }, [])

  function updateQty(id, delta) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    )
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const subtotal   = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const tax        = Math.round(subtotal * 0.05)
  const total      = subtotal + tax
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)


  // ── Empty cart ───────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f4f6f8]">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden h-56">
          <div className="absolute top-[-60px] right-[-60px] w-80 h-80 rounded-full bg-[#3bb397]/15 blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-[-30px] left-[15%] w-60 h-60 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
          <Sparkles className="absolute top-6 right-12 w-5 h-5 text-[#3bb397]/50" />
          <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 h-full flex items-end pb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#3bb397]" />
                <span className="text-[#3bb397] text-xs font-bold tracking-[0.2em] uppercase">Cart</span>
              </div>
              <h1 className="text-4xl font-black text-white">
                My <span className="text-[#3bb397]">Cart</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Empty state */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-20">
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-24 h-24 rounded-3xl bg-gray-50 flex items-center justify-center mb-6">
              <PackageOpen className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-gray-400 text-sm max-w-xs mb-8 leading-relaxed">
              Looks like you haven't added anything yet. Browse listings to find something you love.
            </p>
            <Link
              to="/listings"
              className="flex items-center gap-2 px-8 py-3.5 bg-[#3bb397] hover:bg-[#2a9d82] text-white font-bold rounded-full transition-all shadow-lg shadow-emerald-500/30 hover:scale-105"
            >
              Browse Listings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8]">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden">
        <div className="absolute top-[-60px] right-[-60px] w-96 h-96 rounded-full bg-[#3bb397]/15 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-40px] left-[10%] w-72 h-72 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
        <Sparkles className="absolute top-6 right-12 w-5 h-5 text-[#3bb397]/50" />
        <Sparkles className="absolute bottom-8 left-10 w-4 h-4 text-white/20" />

        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 pt-12 pb-14">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#3bb397]" />
            <span className="text-[#3bb397] text-xs font-bold tracking-[0.2em] uppercase">Checkout</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                My <span className="text-[#3bb397]">Cart</span>
              </h1>
              <p className="text-gray-400 mt-2 text-sm font-medium">
                {totalItems} item{totalItems !== 1 ? "s" : ""} · ₹{total.toLocaleString()} total
              </p>
            </div>
            <Link
              to="/listings"
              className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-[#3bb397] transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* ── CONTENT ──────────────────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* ── LEFT: CART ITEMS ──────────────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Section header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-800">
                Items <span className="text-gray-400 font-semibold text-sm ml-1">({totalItems})</span>
              </h2>
              <button
                onClick={() => setItems([])}
                className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>

            {items.map((item) => {
              const typeStyle = TYPE_STYLES[item.listing_type] || TYPE_STYLES.sell
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row group hover:shadow-md transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="relative w-full sm:w-36 h-44 sm:h-auto shrink-0 overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 text-base leading-snug line-clamp-2 group-hover:text-[#3bb397] transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className={`text-white text-[10px] font-bold px-2.5 py-1 rounded-full ${typeStyle.bg} shadow-sm`}>
                            {typeStyle.label}
                          </span>
                          <div className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                            <Tag className="w-3 h-3" />{item.category}
                          </div>
                          <div className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                            <MapPin className="w-3 h-3" />{item.pickup_location}
                          </div>
                        </div>
                      </div>
                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                      {/* Price */}
                      <div>
                        <span className="text-2xl font-black text-gray-900">
                          ₹{(item.price * item.qty).toLocaleString()}
                        </span>
                        {item.qty > 1 && (
                          <span className="text-xs text-gray-400 ml-2 font-medium">
                            ₹{item.price} × {item.qty}
                          </span>
                        )}
                      </div>

                      {/* Qty controls */}
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-1 py-1">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          disabled={item.qty <= 1}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-800 hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-black text-gray-800 w-5 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-800 hover:shadow-sm transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Perks bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mt-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0 sm:divide-x divide-gray-100">
                {PERKS.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 sm:flex-1 sm:justify-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#3bb397]" />
                    </div>
                    <span className="text-xs font-semibold text-gray-500">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── MY SENT REQUESTS ─────────────────────────────────────────── */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
                  My Requests
                  {sentRequests.length > 0 && (
                    <span className="text-gray-400 font-semibold text-sm">({sentRequests.length})</span>
                  )}
                </h2>
                {sentRequests.some(r => r.status === "pending") && (
                  <span className="text-[10px] px-2 py-1 bg-amber-100 text-amber-700 font-bold rounded-full border border-amber-200">
                    {sentRequests.filter(r => r.status === "pending").length} pending
                  </span>
                )}
              </div>

              {reqLoading ? (
                <div className="space-y-3">
                  {[1,2].map(i => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3 animate-pulse">
                      <div className="w-9 h-9 rounded-xl bg-gray-200 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 bg-gray-200 rounded-full w-1/2" />
                        <div className="h-3 bg-gray-100 rounded-full w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : sentRequests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
                  <p className="text-gray-400 text-sm">No requests sent yet.</p>
                  <p className="text-xs text-gray-300 mt-1">Browse listings and click "Make Offer" or "Pay Now" to send a request.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sentRequests.map(req => (
                    <SentRequestCard key={req.id} req={req} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: ORDER SUMMARY ──────────────────────────────────────── */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-4">

            {/* Summary card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-black text-gray-800 mb-5 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#3bb397]" />
                Order Summary
              </h3>

              <div className="flex flex-col gap-3 text-sm mb-5">
                <div className="flex items-center justify-between text-gray-600">
                  <span className="font-medium">Subtotal ({totalItems} items)</span>
                  <span className="font-bold text-gray-800">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span className="font-medium">GST (5%)</span>
                  <span className="font-bold text-gray-800">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span className="font-medium">Delivery</span>
                  <span className="font-bold text-emerald-600">Free Pickup</span>
                </div>
                <div className="h-px bg-gray-100 my-1" />
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-gray-900">Total</span>
                  <span className="text-2xl font-black text-gray-900">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#3bb397] to-[#2a9d82] hover:from-[#2a9d82] hover:to-[#1f826a] text-white font-black text-base rounded-2xl shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <ShoppingCart className="w-5 h-5" />
                Proceed to Checkout
              </button>

              <Link
                to="/listings"
                className="w-full flex items-center justify-center gap-1.5 py-3 mt-3 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
              >
                Continue Shopping <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Promo code */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h4 className="text-sm font-black text-gray-700 mb-3">Have a promo code?</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code..."
                  className="flex-1 h-10 px-4 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-[#3bb397] focus:ring-2 focus:ring-[#3bb397]/20 transition-all placeholder:text-gray-300 font-medium"
                />
                <button className="h-10 px-4 bg-gray-900 hover:bg-[#3bb397] text-white text-sm font-bold rounded-xl transition-all">
                  Apply
                </button>
              </div>
            </div>

            {/* Seller note */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <p className="text-xs text-amber-700 font-medium leading-relaxed">
                <strong>Note:</strong> Each item in your cart is from a different local seller.
                Pickup is arranged individually after checkout.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CartPage
