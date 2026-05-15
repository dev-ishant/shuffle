import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  ArrowLeft, Send, ImagePlus, DollarSign, Tag, MapPin,
  FileText, Type, Layers, CheckCircle2, AlertCircle, Sparkles
} from "lucide-react"
import ImageUploader from "@/components/ImageUploader"
import { createListing } from "@/api/listings"

const CATEGORIES = [
  { value: "Food & Bakery",   emoji: "🍪" },
  { value: "Clothing",        emoji: "🧶" },
  { value: "Art & Craft",     emoji: "🎨" },
  { value: "Candles & Soaps", emoji: "🕯️" },
  { value: "Home Decor",      emoji: "🏠" },
  { value: "Stationery",      emoji: "📚" },
  { value: "Gift Boxes",      emoji: "🎁" },
]

const LISTING_TYPES = [
  { value: "sell",     label: "For Sale",       desc: "Sell for a fixed price",        icon: "💰" },
  { value: "exchange", label: "Exchange",        desc: "Trade for something else",       icon: "🔄" },
  { value: "both",     label: "Sell & Exchange", desc: "Open to both options",           icon: "✨" },
]

const initialForm = {
  title: "",
  description: "",
  price: "",
  category: CATEGORIES[0].value,
  listing_type: "sell",
  pickup_location: "",
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, required, icon: Icon, children, hint }) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="flex items-center gap-2.5 text-sm font-bold text-gray-800">
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-[#3bb397]/20 flex items-center justify-center text-[#1f826a] shadow-sm">
            <Icon className="w-4 h-4" />
          </div>
        )}
        {label}
        {required && <span className="text-red-500 -ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-[13px] text-gray-500 pl-1 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />{hint}</p>}
    </div>
  )
}

// ── Input style helper ────────────────────────────────────────────────────────
const inputCls = "w-full h-14 px-5 rounded-2xl bg-white/60 border border-white/80 text-[15px] text-gray-800 outline-none focus:bg-white focus:border-[#5ac7ae] focus:ring-4 focus:ring-[#5ac7ae]/20 placeholder:text-gray-400 transition-all duration-300 shadow-sm font-medium"

function CreateListingPage() {
  const navigate = useNavigate()
  const [form, setForm]           = useState(initialForm)
  const [images, setImages]       = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState(null)
  const [success, setSuccess]     = useState(false)

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // Simple progress — count filled required fields
  const filled = [form.title, form.price, form.pickup_location].filter(Boolean).length
  const progress = Math.round((filled / 3) * 100)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.title.trim())           { setError("Please add a title for your listing."); return }
    if (!form.price || Number(form.price) <= 0) { setError("Please enter a valid price."); return }
    if (!form.pickup_location.trim()) { setError("Please specify a pickup location."); return }

    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append("title", form.title)
      fd.append("description", form.description)
      fd.append("price", form.price)
      fd.append("category", form.category)
      fd.append("listing_type", form.listing_type)
      fd.append("pickup_location", form.pickup_location)
      images.forEach((img) => fd.append("images", img))

      await createListing(fd)
      setSuccess(true)
      setTimeout(() => navigate("/listings"), 1800)
    } catch (err) {
      setError(err.message || "Failed to post listing. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-[#e8eaf0]">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#5ac7ae] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#2a9d82] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 pointer-events-none" />
        
        <div className="bg-white/60 backdrop-blur-2xl border border-white/60 rounded-3xl p-10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] text-center max-w-sm w-full relative z-10">
          <div className="w-20 h-20 rounded-full bg-white/80 border border-white flex items-center justify-center mx-auto mb-5 shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-[#3bb397]" />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Listing Posted!</h2>
          <p className="text-gray-500 text-sm mb-6 font-medium">Your listing is now live. Redirecting to the marketplace…</p>
          <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#3bb397] to-[#5ac7ae] rounded-full" style={{ width: "100%", animation: "width 1.8s linear forwards" }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center sm:p-4 md:p-6 xl:p-10 pt-[88px] sm:pt-[104px] relative overflow-hidden bg-[#e8eaf0]">
      
      {/* Background Shapes for Glassmorphism effect */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#5ac7ae] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#2a9d82] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 pointer-events-none" />
      <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 pointer-events-none" />

      {/* Main Glassmorphic Card Container */}
      <div className="relative w-full max-w-7xl h-full bg-white/40 backdrop-blur-2xl sm:border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] sm:rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row">

        {/* ── LEFT GLASS SIDEBAR ───────────────────────────────────────────────── */}
        <div className="hidden lg:flex flex-col w-[380px] shrink-0 h-full bg-gradient-to-br from-[#3bb397]/90 to-[#2a9d82]/90 border-r border-white/20 relative overflow-hidden text-white shadow-[10px_0_30px_rgba(42,157,130,0.1)]">
          {/* Decorative shapes */}
          <div className="absolute top-[-50px] left-[-50px] w-56 h-56 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-[-50px] right-[-50px] w-56 h-56 bg-white/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col h-full px-10 py-12">
            {/* Back */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-bold text-white/80 hover:text-white transition-colors mb-12 group w-fit bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/10"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>

            {/* Badge */}
            <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full border border-white/30 backdrop-blur-sm shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white text-xs font-bold tracking-widest uppercase">New Listing</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-black text-white leading-tight mb-4 drop-shadow-md">
              Create a<br />Listing
            </h1>
            <p className="text-white/90 text-sm leading-relaxed mb-12 font-medium drop-shadow-sm">
              Share your homemade goods with the community and start earning.
            </p>

            {/* Tips */}
            <div className="flex flex-col gap-6">
              {[
                { icon: "📸", tip: "Add clear, well-lit photos to get 3× more views" },
                { icon: "✍️", tip: "Write a detailed description to build buyer trust" },
                { icon: "📍", tip: "Accurate location helps nearby buyers find you" },
                { icon: "💰", tip: "Price fairly — research similar items first" },
              ].map((t) => (
                <div key={t.tip} className="flex items-start gap-4 bg-white/10 p-3 rounded-2xl border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all shadow-sm">
                  <span className="text-xl shrink-0 mt-0.5">{t.icon}</span>
                  <p className="text-white/90 text-[13px] leading-relaxed font-medium">{t.tip}</p>
                </div>
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Footer branding */}
            <div className="border-t border-white/20 pt-6 mt-8">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4 shadow-md backdrop-blur-sm border border-white/30">
                <span className="text-white text-xl font-black">S</span>
              </div>
              <p className="text-white/90 text-xs font-bold">ShuffleIt Marketplace</p>
              <p className="text-white/70 text-[11px] mt-1 font-medium">Connecting local creators since 2024</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT FORM AREA ─────────────────────────────────────────────────── */}
        <div className="flex-1 h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
          {/* Mobile back button */}
          <div className="lg:hidden px-6 pt-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-bold text-gray-600 bg-white/60 hover:bg-white px-4 py-2 rounded-full backdrop-blur-md border border-white/60 shadow-sm transition-all group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
          </div>

          <div className="max-w-[720px] mx-auto px-6 sm:px-10 py-8 lg:py-12">

            {/* ── PROGRESS BAR ──────────────────────────────────────────────── */}
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 mb-8 shadow-sm border border-white/80 flex items-center gap-5">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                  <span>Completion</span>
                  <span className={progress === 100 ? "text-[#2a9d82]" : "text-gray-500"}>{progress}%</span>
                </div>
                <div className="h-2.5 bg-white/60 rounded-full overflow-hidden border border-white/40 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-[#3bb397] to-[#5ac7ae] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(90,199,174,0.5)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              {progress === 100 && (
                <CheckCircle2 className="w-8 h-8 text-[#2a9d82] shrink-0 drop-shadow-sm" />
              )}
            </div>

            {/* ── ERROR BANNER ──────────────────────────────────────────────── */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50/80 backdrop-blur-md border border-red-200 text-red-600 text-sm font-medium rounded-2xl px-5 py-4 mb-8 shadow-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* ── SECTION: BASIC INFO ─────────────────────────────────────── */}
              <div className="bg-white/50 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/60">
                <h2 className="text-xl font-black text-[#1f826a] mb-8 flex items-center gap-3 drop-shadow-sm">
                  <FileText className="w-6 h-6" />
                  Basic Information
                </h2>
                <div className="flex flex-col gap-8">

                  <Field label="Title" required icon={Type} hint="Be specific — good titles get more views">
                    <div className="relative">
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        placeholder="e.g. Homemade Chocolate Chip Cookies"
                        className={inputCls}
                        maxLength={100}
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 bg-white/60 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/50">
                        {form.title.length}/100
                      </span>
                    </div>
                  </Field>

                  <Field label="Description" icon={FileText} hint="Tell buyers about ingredients, materials, size, etc.">
                    <textarea
                      value={form.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      placeholder="Describe your item — what makes it special, how it's made, any care instructions…"
                      rows={5}
                      className="w-full px-5 py-4 rounded-2xl bg-white/60 border border-white/80 text-[15px] text-gray-800 outline-none focus:bg-white focus:border-[#5ac7ae] focus:ring-4 focus:ring-[#5ac7ae]/20 placeholder:text-gray-400 resize-none transition-all duration-300 shadow-sm font-medium"
                    />
                  </Field>
                </div>
              </div>

              {/* ── SECTION: PRICING & CATEGORY ─────────────────────────────── */}
              <div className="bg-white/50 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/60">
                <h2 className="text-xl font-black text-[#1f826a] mb-8 flex items-center gap-3 drop-shadow-sm">
                  <Tag className="w-6 h-6" />
                  Pricing & Category
                </h2>

                {/* Price */}
                <Field label="Price (₹)" required icon={DollarSign} hint="Set 0 if listing for exchange only">
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-black text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={form.price}
                      onChange={(e) => updateField("price", e.target.value)}
                      placeholder="150"
                      className={`${inputCls} pl-9 font-black`}
                    />
                  </div>
                </Field>

                {/* Category pills */}
                <div className="mt-8">
                  <label className="flex items-center gap-2.5 text-sm font-bold text-gray-800 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-[#3bb397]/20 flex items-center justify-center text-[#1f826a] shadow-sm">
                      <Layers className="w-4 h-4" />
                    </div>
                    Category
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => updateField("category", cat.value)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[15px] font-bold border transition-all duration-300 ${
                          form.category === cat.value
                            ? "bg-[#3bb397] text-white border-[#3bb397] shadow-[0_4px_15px_rgba(59,179,151,0.4)] scale-[1.02]"
                            : "bg-white/60 text-gray-600 border-white/80 hover:bg-white hover:shadow-md hover:scale-[1.02]"
                        }`}
                      >
                        <span className="text-xl">{cat.emoji}</span>
                        {cat.value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── SECTION: LISTING TYPE ────────────────────────────────────── */}
              <div className="bg-white/50 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/60">
                <h2 className="text-xl font-black text-[#1f826a] mb-8 flex items-center gap-3 drop-shadow-sm">
                  <Layers className="w-6 h-6" />
                  Listing Type
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {LISTING_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => updateField("listing_type", t.value)}
                      className={`flex flex-col items-start gap-2 p-5 rounded-2xl border text-left transition-all duration-300 ${
                        form.listing_type === t.value
                          ? "border-[#3bb397] bg-white shadow-[0_8px_25px_rgba(59,179,151,0.2)] scale-[1.02]"
                          : "border-white/80 bg-white/60 hover:bg-white hover:shadow-md hover:scale-[1.02]"
                      }`}
                    >
                      <span className="text-2xl mb-1">{t.icon}</span>
                      <span className={`text-[15px] font-black ${form.listing_type === t.value ? "text-[#1f826a]" : "text-gray-800"}`}>
                        {t.label}
                      </span>
                      <span className="text-xs font-medium text-gray-500 leading-tight">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── SECTION: LOCATION & IMAGES ──────────────────────────────── */}
              <div className="bg-white/50 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/60">
                <h2 className="text-xl font-black text-[#1f826a] mb-8 flex items-center gap-3 drop-shadow-sm">
                  <MapPin className="w-6 h-6" />
                  Location & Photos
                </h2>

                <Field label="Pickup Location" required icon={MapPin} hint="City or area where buyers can collect the item">
                  <input
                    type="text"
                    value={form.pickup_location}
                    onChange={(e) => updateField("pickup_location", e.target.value)}
                    placeholder="e.g. Chandigarh, Punjab"
                    className={inputCls}
                  />
                </Field>

                {/* Image Uploader */}
                <div className="mt-8">
                  <label className="flex items-center gap-2.5 text-sm font-bold text-gray-800 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-[#3bb397]/20 flex items-center justify-center text-[#1f826a] shadow-sm">
                      <ImagePlus className="w-4 h-4" />
                    </div>
                    Photos
                    <span className="text-gray-500 text-xs font-bold bg-white/80 border border-white px-2 py-0.5 rounded-md shadow-sm">(up to 5)</span>
                  </label>
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 p-2 shadow-sm">
                    <ImageUploader value={images} onChange={setImages} maxFiles={5} />
                  </div>
                </div>
              </div>

              {/* ── SUBMIT ──────────────────────────────────────────────────── */}
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 w-full h-14 mt-4 bg-gradient-to-r from-[#3bb397] to-[#2a9d82] hover:from-[#2a9d82] hover:to-[#1f826a] text-white font-black text-lg rounded-2xl shadow-lg shadow-[#3bb397]/30 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 tracking-wide"
              >
                {submitting ? (
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Posting your listing…
                  </span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    POST LISTING
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 font-medium">
                By posting, you agree to our{" "}
                <Link to="/terms" className="text-[#1f826a] hover:underline font-bold">Terms of Service</Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-[#1f826a] hover:underline font-bold">Privacy Policy</Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateListingPage
