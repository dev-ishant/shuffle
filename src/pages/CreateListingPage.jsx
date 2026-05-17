import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft, CheckCircle2, Upload, X, Plus
} from "lucide-react"
import { createListing } from "@/api/listings"

// ── Constants ──────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "Food & Bakery",      emoji: "🍪" },
  { value: "Clothing",           emoji: "🧶" },
  { value: "Art & Craft",        emoji: "🎨" },
  { value: "Candles & Soaps",    emoji: "🕯️" },
  { value: "Home Decor",         emoji: "🏠" },
  { value: "Stationery",         emoji: "📚" },
  { value: "Gift Boxes",         emoji: "🎁" },
]

const LISTING_TYPES = [
  { value: "sell",     label: "For Sale",       emoji: "💰", desc: "Sell for a fixed price" },
  { value: "exchange", label: "Exchange",        emoji: "🔄", desc: "Trade for something else" },
  { value: "both",     label: "Sell & Swap",    emoji: "✨", desc: "Open to both options" },
]

const STEPS = ["Basic Info", "Details", "Photos"]

// ── Step Indicator ─────────────────────────────────────────────────────────────
function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center">
      {STEPS.map((step, index) => {
        const num = index + 1
        const completed = currentStep > num
        const active    = currentStep === num
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 ${
                completed ? "bg-[#3bb397] text-white shadow-lg shadow-emerald-500/30"
                : active  ? "bg-[#3bb397] text-white ring-4 ring-[#3bb397]/20 shadow-lg shadow-emerald-500/30"
                : "bg-gray-100 text-gray-400"
              }`}>
                {completed ? <CheckCircle2 className="w-5 h-5" /> : num}
              </div>
              <span className={`text-xs font-bold whitespace-nowrap transition-colors ${
                active ? "text-[#3bb397]" : completed ? "text-gray-600" : "text-gray-300"
              }`}>
                {step}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`w-20 sm:w-28 h-0.5 mb-5 mx-1 transition-all duration-500 ${
                currentStep > num ? "bg-[#3bb397]" : "bg-gray-200"
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Shared input style ─────────────────────────────────────────────────────────
const inputCls = `w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50
  text-sm text-gray-800 outline-none placeholder:text-gray-400
  focus:ring-2 focus:ring-[#3bb397]/40 focus:border-[#3bb397] focus:bg-white
  transition-all duration-200 font-medium`

// ── STEP 1 — Basic Info ────────────────────────────────────────────────────────
function Step1({ data, setData }) {
  return (
    <div className="flex flex-col gap-7">
      <div>
        <h2 className="text-2xl font-black text-gray-800">Basic Information</h2>
        <p className="text-sm text-gray-400 mt-1">Tell us about what you're listing</p>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-700">
          Listing Title <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            maxLength={100}
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            placeholder="e.g. Homemade Chocolate Chip Cookies"
            className={inputCls}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-300 font-semibold">
            {data.title.length}/100
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-700">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          rows={4}
          maxLength={500}
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          placeholder="Describe your item — what makes it special, how it's made, care instructions…"
          className={`${inputCls} resize-none`}
        />
        <p className="text-xs text-gray-400 text-right font-medium">{data.description.length}/500</p>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-700">
          Category <span className="text-red-400">*</span>
        </label>
        <div className="flex flex-wrap gap-2.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setData({ ...data, category: cat.value })}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold border-2 transition-all duration-200 ${
                data.category === cat.value
                  ? "border-[#3bb397] bg-emerald-50 text-[#1f826a] shadow-md shadow-emerald-100"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-white"
              }`}
            >
              <span className="text-lg">{cat.emoji}</span>
              {cat.value}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── STEP 2 — Details ───────────────────────────────────────────────────────────
function Step2({ data, setData }) {
  const isFood = data.category === "Food & Bakery"

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h2 className="text-2xl font-black text-gray-800">Listing Details</h2>
        <p className="text-sm text-gray-400 mt-1">Set your price and preferences</p>
      </div>

      {/* Listing Type */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-700">
          Listing Type <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {LISTING_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setData({ ...data, listing_type: type.value })}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${
                data.listing_type === type.value
                  ? "border-[#3bb397] bg-emerald-50 shadow-md shadow-emerald-100"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white"
              }`}
            >
              <span className="text-2xl">{type.emoji}</span>
              <span className={`text-sm font-black ${data.listing_type === type.value ? "text-[#1f826a]" : "text-gray-700"}`}>
                {type.label}
              </span>
              <span className="text-[10px] text-gray-400 text-center leading-tight">{type.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-700">
          Price (₹) <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
          <input
            type="number"
            min="0"
            value={data.price}
            onChange={(e) => setData({ ...data, price: e.target.value })}
            placeholder="150"
            className={`${inputCls} pl-8 font-black`}
          />
        </div>
        {data.listing_type === "exchange" && (
          <p className="text-xs text-[#3bb397] font-medium flex items-center gap-1">
            <span>💡</span> For exchange-only listings, price is optional
          </p>
        )}
      </div>

      {/* Pickup Location */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-700">
          Pickup Location <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={data.pickup_location}
          onChange={(e) => setData({ ...data, pickup_location: e.target.value })}
          placeholder="e.g. Chandigarh, Punjab"
          className={inputCls}
        />
      </div>

      {/* Food-specific fields */}
      {isFood && (
        <div className="flex flex-col gap-4 p-5 bg-orange-50 border border-orange-200 rounded-2xl">
          <p className="text-xs font-black text-orange-600 uppercase tracking-wider">🍪 Food & Bakery Details</p>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Food Type</label>
            <div className="flex gap-3">
              {[
                { value: "veg",     label: "Vegetarian",     dot: "🟢", active: "border-green-500 bg-green-50 text-green-700" },
                { value: "non-veg", label: "Non-Vegetarian", dot: "🔴", active: "border-red-400 bg-red-50 text-red-700" },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setData({ ...data, food_type: type.value })}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                    data.food_type === type.value ? type.active : "border-gray-200 bg-white text-gray-500"
                  }`}
                >
                  <span>{type.dot}</span> {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Expiry Date</label>
            <input
              type="date"
              value={data.expiry_date}
              onChange={(e) => setData({ ...data, expiry_date: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ── STEP 3 — Photos ────────────────────────────────────────────────────────────
function Step3({ data, setData }) {
  function handleFiles(e) {
    const files = Array.from(e.target.files).slice(0, 5 - data.images.length)
    const previews = files.map((file) => ({ file, url: URL.createObjectURL(file) }))
    setData({ ...data, images: [...data.images, ...previews] })
  }

  function removeImage(index) {
    setData({ ...data, images: data.images.filter((_, i) => i !== index) })
  }

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h2 className="text-2xl font-black text-gray-800">Upload Photos</h2>
        <p className="text-sm text-gray-400 mt-1">Add up to 5 clear photos of your item</p>
      </div>

      {/* Drop zone */}
      {data.images.length < 5 && (
        <label className="flex flex-col items-center justify-center gap-3 py-12 px-6
          border-2 border-dashed border-[#3bb397]/40 rounded-3xl
          bg-emerald-50/50 hover:bg-emerald-50 hover:border-[#3bb397]/70
          cursor-pointer transition-all duration-200 group">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Upload className="w-6 h-6 text-[#3bb397]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-[#3bb397]">Click to upload images</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB each · {5 - data.images.length} remaining</p>
          </div>
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
        </label>
      )}

      {/* Tips */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: "☀️", tip: "Use good lighting" },
          { icon: "📐", tip: "Show multiple angles" },
          { icon: "🚫", tip: "Avoid blurry shots" },
          { icon: "🖼️", tip: "Clean background" },
        ].map((t) => (
          <div key={t.tip} className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-lg">{t.icon}</span>
            <span className="text-xs font-semibold text-gray-500">{t.tip}</span>
          </div>
        ))}
      </div>

      {/* Previews */}
      {data.images.length > 0 && (
        <div>
          <p className="text-sm font-bold text-gray-700 mb-3">
            {data.images.length} photo{data.images.length !== 1 ? "s" : ""} added
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {data.images.map((img, index) => (
              <div key={index} className="relative rounded-2xl overflow-hidden aspect-square border-2 border-gray-200 group">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 text-[10px] bg-[#3bb397] text-white px-2 py-0.5 rounded-full font-bold">
                    Cover
                  </span>
                )}
              </div>
            ))}
            {/* Add more slot */}
            {data.images.length < 5 && (
              <label className="relative rounded-2xl aspect-square border-2 border-dashed border-gray-300 bg-gray-50 hover:border-[#3bb397] hover:bg-emerald-50 flex items-center justify-center cursor-pointer transition-all">
                <Plus className="w-6 h-6 text-gray-400" />
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Success Screen ─────────────────────────────────────────────────────────────
function SuccessScreen() {
  return (
    <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center max-w-sm w-full">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6 border border-emerald-100">
          <CheckCircle2 className="w-10 h-10 text-[#3bb397]" />
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">Listing Posted! 🎉</h2>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Your listing is now live on ShuffleIt. Redirecting to marketplace…
        </p>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#3bb397] to-[#5ac7ae] rounded-full animate-pulse" style={{ width: "100%" }} />
        </div>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
function CreateListingPage() {
  const navigate   = useNavigate()
  const [step, setStep]         = useState(1)
  const [success, setSuccess]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]       = useState(null)
  const [formData, setFormData] = useState({
    title: "", description: "", category: "",
    listing_type: "sell", price: "", pickup_location: "",
    food_type: "veg", expiry_date: "", images: [],
  })

  function validateStep() {
    if (step === 1) {
      if (!formData.title.trim())    { setError("Please enter a title."); return false }
      if (!formData.description.trim()) { setError("Please enter a description."); return false }
      if (!formData.category)        { setError("Please select a category."); return false }
    }
    if (step === 2) {
      if (!formData.price && formData.listing_type !== "exchange") { setError("Please enter a price."); return false }
      if (!formData.pickup_location.trim()) { setError("Please enter a pickup location."); return false }
    }
    setError(null)
    return true
  }

  function handleNext() {
    if (validateStep()) setStep((s) => s + 1)
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append("title", formData.title)
      fd.append("description", formData.description)
      fd.append("price", formData.price || 0)
      fd.append("category", formData.category)
      fd.append("listing_type", formData.listing_type)
      fd.append("pickup_location", formData.pickup_location)
      formData.images.forEach((img) => fd.append("images", img.file))
      await createListing(fd)
      setSuccess(true)
      setTimeout(() => navigate("/listings"), 2000)
    } catch (err) {
      setError(err.message || "Failed to post listing. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) return <SuccessScreen />

  return (
    <div className="min-h-screen bg-[#f4f6f8]">

      {/* ── FORM AREA ──────────────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-16">

        {/* Back + title */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors mb-5 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <h1 className="text-3xl font-black text-gray-800">Create a Listing</h1>
          <p className="text-sm text-gray-400 mt-1">Share your homemade goods with the community.</p>
        </div>

        {/* Step indicator */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5 mb-5">
          <StepIndicator currentStep={step} />
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-2xl px-5 py-4 mb-5">
            <span className="text-base">⚠️</span> {error}
          </div>
        )}

        {/* Form card */}
        <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-sm border border-gray-100">
          {step === 1 && <Step1 data={formData} setData={setFormData} />}
          {step === 2 && <Step2 data={formData} setData={setFormData} />}
          {step === 3 && <Step3 data={formData} setData={setFormData} />}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-[#3bb397] to-[#2a9d82] hover:from-[#2a9d82] hover:to-[#1f826a] text-white font-black rounded-full shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.03] active:scale-[0.97] text-sm"
              >
                Next Step <span className="text-base">→</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-[#3bb397] to-[#2a9d82] hover:from-[#2a9d82] hover:to-[#1f826a] text-white font-black rounded-full shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.03] active:scale-[0.97] text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Posting…
                  </>
                ) : (
                  <> Post Listing 🎉 </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Tips sidebar inline */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            { icon: "📸", tip: "Well-lit photos get 3× more views" },
            { icon: "✍️", tip: "Detailed descriptions build trust" },
            { icon: "📍", tip: "Accurate location helps nearby buyers" },
            { icon: "💰", tip: "Price fairly — research similar items" },
          ].map((t) => (
            <div key={t.tip} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-xl shrink-0">{t.icon}</span>
              <p className="text-xs font-semibold text-gray-500 leading-relaxed">{t.tip}</p>
            </div>
          ))}
        </div>

        {/* Legal */}
        <p className="text-center text-xs text-gray-400 mt-6 font-medium">
          By posting, you agree to our{" "}
          <Link to="/terms" className="text-[#3bb397] hover:underline font-bold">Terms of Service</Link>
          {" "}and{" "}
          <Link to="/privacy" className="text-[#3bb397] hover:underline font-bold">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}

export default CreateListingPage