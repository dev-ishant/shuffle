import { useState, useEffect } from "react"
import {
  X, ShoppingCart, MapPin, CreditCard, Banknote,
  Smartphone, CheckCircle2, Loader2, Package
} from "lucide-react"
import { sendOrderRequest } from "@/api/notifications"

export default function OrderModal({ listing, onClose }) {
  const [step, setStep]         = useState(1)   // 1 = details, 2 = success
  const [quantity, setQuantity] = useState(1)
  const [address, setAddress]   = useState("")
  const [payment, setPayment]   = useState("upi")
  const [loading, setLoading]   = useState(false)
  const [errors, setErrors]     = useState({})

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  const total = (listing.price * quantity).toFixed(2)

  const PAYMENT_OPTIONS = [
    { id: "upi",  label: "UPI",          icon: Smartphone },
    { id: "card", label: "Card",         icon: CreditCard },
    { id: "cod",  label: "Cash on Delivery", icon: Banknote },
  ]

  function validate() {
    const errs = {}
    if (!address.trim()) errs.address = "Delivery address is required"
    if (address.trim().length < 10) errs.address = "Please enter a complete address"
    return errs
  }

  async function handlePlaceOrder() {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await sendOrderRequest({
        listing_id: listing.id,
        quantity,
        address:  address.trim(),
        payment,
      })
      setStep(2)
    } catch (err) {
      setErrors({ address: err?.response?.data?.detail || "Failed to place order. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />

      {/* Modal — bottom sheet on mobile, centered card on sm+ */}
      <div className="relative w-full sm:max-w-md bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-[fadeSlideUp_0.25s_ease-out] flex flex-col max-h-[92dvh]">

        {/* ── HEADER ── */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-lg leading-none">Place Order</p>
              <p className="text-emerald-100 text-xs mt-0.5">Review &amp; confirm your order</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {step === 1 ? (
          <div className="p-5 sm:p-6 flex flex-col gap-4 overflow-y-auto flex-1">

            {/* Listing Summary */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              {listing.image_urls?.[0] ? (
                <img src={listing.image_urls[0]} alt={listing.title}
                  className="w-14 h-14 rounded-xl object-cover shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-800 text-sm truncate">{listing.title}</p>
                {listing.pickup_location && (
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {listing.pickup_location}
                  </p>
                )}
                <p className="text-emerald-600 font-extrabold text-base mt-1">₹{listing.price}</p>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-emerald-400 hover:text-emerald-600 transition-colors font-bold text-lg"
                >−</button>
                <span className="w-10 text-center font-black text-gray-800 text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-emerald-400 hover:text-emerald-600 transition-colors font-bold text-lg"
                >+</button>
                <span className="ml-auto text-xs text-gray-400 font-medium">
                  Total: <span className="text-gray-800 font-black text-sm">₹{total}</span>
                </span>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <MapPin className="w-3.5 h-3.5 inline mr-1" />Delivery Address
              </label>
              <textarea
                value={address}
                onChange={(e) => { setAddress(e.target.value); setErrors({}) }}
                placeholder="House no., Street, City, State — PIN code"
                rows={3}
                className={`w-full px-4 py-3 rounded-2xl border-2 text-sm text-gray-700 outline-none resize-none transition-colors placeholder:text-gray-300
                  ${errors.address ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-emerald-400 bg-gray-50 focus:bg-white"}`}
              />
              {errors.address && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.address}</p>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {PAYMENT_OPTIONS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setPayment(id)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 text-xs font-bold transition-all
                      ${payment === id
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300 bg-gray-50"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order…</>
              ) : (
                <><ShoppingCart className="w-4 h-4" /> Confirm Order · ₹{total}</>
              )}
            </button>
          </div>
        ) : (
          /* ── SUCCESS ── */
          <div className="p-6 sm:p-8 flex flex-col items-center text-center gap-4 overflow-y-auto flex-1">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-black text-gray-800">Order Placed!</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Your order for <span className="font-bold text-gray-700">{listing.title}</span> has been placed successfully.
              The seller will contact you shortly.
            </p>
            <div className="w-full p-4 bg-gray-50 rounded-2xl text-left text-sm mt-2 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-black text-gray-800">₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment</span>
                <span className="font-bold text-gray-700 capitalize">{payment.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Deliver to</span>
                <span className="font-bold text-gray-700 text-right max-w-[55%] leading-snug">{address}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="mt-2 w-full py-3 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
