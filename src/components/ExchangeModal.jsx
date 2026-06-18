import { useState, useEffect } from "react"
import {
  X, ArrowLeftRight, Package, Send,
  CheckCircle2, Loader2, Sparkles
} from "lucide-react"
import { sendExchangeOffer } from "@/api/notifications"

export default function ExchangeModal({ listing, onClose }) {
  const [step, setStep]             = useState(1)
  const [offerTitle, setOfferTitle] = useState("")
  const [offerDesc, setOfferDesc]   = useState("")
  const [message, setMessage]       = useState("")
  const [loading, setLoading]       = useState(false)
  const [errors, setErrors]         = useState({})

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

  function validate() {
    const errs = {}
    if (!offerTitle.trim()) errs.offerTitle = "Tell the seller what you're offering"
    if (offerTitle.trim().length < 3) errs.offerTitle = "Be a bit more descriptive (min 3 chars)"
    return errs
  }

  async function handleSendOffer() {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await sendExchangeOffer({
        listing_id:  listing.id,
        offer_title: offerTitle.trim(),
        offer_desc:  offerDesc.trim() || null,
        message:     message.trim() || null,
      })
      setStep(2)
    } catch (err) {
      setErrors({ offerTitle: err?.response?.data?.detail || "Failed to send offer. Please try again." })
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
        <div className="bg-gradient-to-r from-pink-500 to-fuchsia-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-lg leading-none">Make an Exchange Offer</p>
              <p className="text-pink-100 text-xs mt-0.5">Propose what you'll trade in return</p>
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

            {/* They want */}
            <div className="flex items-center gap-3 p-4 bg-fuchsia-50 rounded-2xl border border-fuchsia-100">
              {listing.image_urls?.[0] ? (
                <img src={listing.image_urls[0]} alt={listing.title}
                  className="w-12 h-12 rounded-xl object-cover shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-fuchsia-100 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-fuchsia-400" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-fuchsia-500 uppercase tracking-wider mb-0.5">They have</p>
                <p className="font-black text-gray-800 text-sm truncate">{listing.title}</p>
                <p className="text-fuchsia-600 font-bold text-sm">₹{listing.price}</p>
              </div>
            </div>

            {/* Exchange arrow visual */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-200 to-pink-300" />
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center shadow-md shadow-pink-400/40">
                <ArrowLeftRight className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-fuchsia-200 to-fuchsia-300" />
            </div>

            {/* What you offer */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 inline mr-1 text-fuchsia-500" />
                What are you offering in exchange?
              </label>
              <input
                type="text"
                value={offerTitle}
                onChange={(e) => { setOfferTitle(e.target.value); setErrors({}) }}
                placeholder="e.g. Handmade candles, Crochet bag…"
                maxLength={80}
                className={`w-full px-4 py-3 rounded-2xl border-2 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-300
                  ${errors.offerTitle
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 focus:border-fuchsia-400 bg-gray-50 focus:bg-white"
                  }`}
              />
              {errors.offerTitle && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.offerTitle}</p>
              )}
            </div>

            {/* Description of offer */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Describe your item <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                value={offerDesc}
                onChange={(e) => setOfferDesc(e.target.value)}
                placeholder="Condition, size, colour, quantity…"
                rows={2}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-fuchsia-400 bg-gray-50 focus:bg-white text-sm text-gray-700 outline-none resize-none transition-colors placeholder:text-gray-300"
              />
            </div>

            {/* Message to seller */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                <Send className="w-3.5 h-3.5 inline mr-1 text-fuchsia-500" />
                Message to seller <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I'd love to exchange…"
                rows={2}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-fuchsia-400 bg-gray-50 focus:bg-white text-sm text-gray-700 outline-none resize-none transition-colors placeholder:text-gray-300"
              />
            </div>

            {/* Send Offer Button */}
            <button
              onClick={handleSendOffer}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white font-bold text-sm shadow-lg shadow-pink-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending Offer…</>
              ) : (
                <><Send className="w-4 h-4" /> Send Exchange Offer</>
              )}
            </button>
          </div>
        ) : (
          /* ── SUCCESS ── */
          <div className="p-6 sm:p-8 flex flex-col items-center text-center gap-4 overflow-y-auto flex-1">
            <div className="w-20 h-20 rounded-full bg-fuchsia-100 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-10 h-10 text-fuchsia-500" />
            </div>
            <h3 className="text-xl font-black text-gray-800">Offer Sent!</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Your exchange offer for <span className="font-bold text-gray-700">{listing.title}</span> has been sent.
              The seller will review and get back to you.
            </p>
            <div className="w-full p-4 bg-gray-50 rounded-2xl text-left text-sm mt-2 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Your offer</span>
                <span className="font-black text-gray-800 text-right max-w-[60%]">{offerTitle}</span>
              </div>
              {offerDesc && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Details</span>
                  <span className="font-bold text-gray-700 text-right max-w-[60%] leading-snug">{offerDesc}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">For</span>
                <span className="font-bold text-gray-700 text-right max-w-[60%]">{listing.title}</span>
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
