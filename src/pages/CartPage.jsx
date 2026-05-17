import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ShoppingBag, Trash2, Plus, Minus, ArrowRight,
  Tag, MapPin, Sparkles, ShoppingCart, ChevronRight,
  Shield, Truck, RefreshCw, PackageOpen
} from "lucide-react"

// ── Demo cart items ────────────────────────────────────────────────────────────
const INITIAL_ITEMS = [
  {
    id: 1,
    title: "Homemade Chocolate Chip Cookies",
    category: "Food & Bakery",
    pickup_location: "Hoshiarpur, Punjab",
    listing_type: "sell",
    price: 150,
    qty: 1,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400",
  },
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

const TYPE_STYLES = {
  sell:     { label: "For Sale",    bg: "bg-emerald-500" },
  exchange: { label: "Exchange",    bg: "bg-violet-500"  },
  both:     { label: "Sell & Swap", bg: "bg-amber-500"   },
}

const PERKS = [
  { icon: Shield,  text: "Safe & Secure Checkout"   },
  { icon: Truck,   text: "Pickup Arranged by Seller" },
  { icon: RefreshCw, text: "Easy Exchange Policy"   },
]

function CartPage() {
  const [items, setItems] = useState(INITIAL_ITEMS)

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
  const tax        = Math.round(subtotal * 0.05)   // 5% GST
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
