import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { CreateListingButton } from "@/components/ui/buttons/CreateListingButton"
import { SearchButton } from "@/components/ui/buttons/SearchButton"
import ListingCard from "@/components/ListingCard"

// ─── DATA ───────────────────────────────────────────────

const categories = [
  {
    id: 1,
    name: "Food & Bakery",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Clothing",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Art & Craft",
    image: "https://images.unsplash.com/photo-1612428820979-5cadd16e98c8?w=200&h=200&fit=crop",
  },
  {
    id: 4,
    name: "Candles",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=200&h=200&fit=crop",
  },
  {
    id: 5,
    name: "Home Decor",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&h=200&fit=crop",
  },
  {
    id: 6,
    name: "Stationery",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&h=200&fit=crop",
  },
]

const sampleListings = [
  {
    id: 1,
    title: "Homemade Chocolate Chip Cookies",
    price: 150,
    category: "Food & Bakery",
    pickup_location: "Hoshiarpur, Punjab",
    listing_type: "sell",
    image_urls: ["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400"],
  },
  {
    id: 2,
    title: "Hand Knitted Wool Sweater",
    price: 850,
    category: "Clothing & Accessories",
    pickup_location: "Chandigarh, Punjab",
    listing_type: "exchange",
    image_urls: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400"],
  },
  {
    id: 3,
    title: "Handpainted Terracotta Pot",
    price: 300,
    category: "Home Decor",
    pickup_location: "Ludhiana, Punjab",
    listing_type: "both",
    image_urls: ["https://images.unsplash.com/photo-1612428820979-5cadd16e98c8?w=400"],
  },
  {
    id: 4,
    title: "Lavender Scented Soy Candle",
    price: 200,
    category: "Candles & Soaps",
    pickup_location: "Amritsar, Punjab",
    listing_type: "sell",
    image_urls: ["https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400"],
  },
  {
    id: 5,
    title: "Artisan Sourdough Bread Loaf",
    price: 120,
    category: "Food & Bakery",
    pickup_location: "Jalandhar, Punjab",
    listing_type: "sell",
    image_urls: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400"],
  },
]

const steps = [
  {
    step: "01",
    title: "Post Your Listing",
    desc: "Take a photo, set your price or exchange preference and post in minutes.",
    emoji: "📸",
  },
  {
    step: "02",
    title: "Browse & Discover",
    desc: "Explore homemade goods from talented people in your area.",
    emoji: "🔍",
  },
  {
    step: "03",
    title: "Connect & Exchange",
    desc: "Chat with sellers, make an offer and arrange a pickup.",
    emoji: "🤝",
  },
]

// ─── SECTIONS ───────────────────────────────────────────

const heroSlides = [
  {
    subtitle: "Premium Crafts",
    title: <>Handpainted<br/>Ceramics</>,
    desc: "Discover unique pieces from local artisans. Authentic, beautiful, and made with love.",
    link: "/listings?category=Art%20&%20Craft",
    bg: "from-[#1E293B] to-[#475569]",
    image: "https://images.unsplash.com/photo-1612428820979-5cadd16e98c8?w=800",
    imgClass: "object-cover w-full h-full object-left-top drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] translate-y-10 translate-x-10 scale-125"
  },
  {
    subtitle: "Freshly Baked",
    title: <>Homemade<br/>Delights</>,
    desc: "Taste the love in every bite. Find freshly baked cookies, cakes, and bread near you.",
    link: "/listings?category=Food%20&%20Bakery",
    bg: "from-orange-500 to-amber-600",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
    imgClass: "object-cover w-full h-full object-center drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] translate-y-5 translate-x-5 scale-110 rounded-full"
  },
  {
    subtitle: "Warm & Cozy",
    title: <>Hand Knitted<br/>Apparel</>,
    desc: "Stay warm with beautiful hand-knitted sweaters, scarves, and winter wear.",
    link: "/listings?category=Clothing",
    bg: "from-rose-500 to-pink-600",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800",
    imgClass: "object-cover w-full h-full object-center drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] translate-y-8 translate-x-5 scale-110 rounded-[3rem]"
  },
  {
    subtitle: "Aromatic Spaces",
    title: <>Artisan<br/>Soy Candles</>,
    desc: "Elevate your home's ambiance with handcrafted, eco-friendly scented candles.",
    link: "/listings?category=Candles",
    bg: "from-violet-500 to-purple-600",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800",
    imgClass: "object-cover w-full h-full object-center drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] translate-y-5 translate-x-8 scale-110 rounded-[3rem]"
  }
]

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = heroSlides[currentSlide]

  return (
    <section className="bg-white pt-6 pb-8 px-4 md:px-8 max-w-[1400px] mx-auto w-full overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 w-full">
        
        {/* Main Banner (Left 2/3) - Carousel */}
        <div className={`lg:col-span-2 relative bg-gradient-to-r ${slide.bg} rounded-[2rem] overflow-hidden min-h-[360px] md:min-h-[460px] flex items-center p-8 md:p-16 group transition-colors duration-700`}>
          <div className="relative z-10 max-w-md" key={`text-${currentSlide}`}>
            <span className="text-white/80 font-medium text-sm md:text-base tracking-wide mb-2 block animate-fade-in-up">
              {slide.subtitle}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              {slide.title}
            </h1>
            <p className="text-white/80 mb-8 text-sm md:text-base font-medium max-w-[280px] animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              {slide.desc}
            </p>
            <Link to={slide.link} className="inline-block bg-white text-gray-900 font-bold px-8 py-3.5 rounded-full hover:scale-105 transition-transform shadow-[0_8px_20px_rgba(0,0,0,0.15)] animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              Shop Now
            </Link>
          </div>
          {/* Image positioning */}
          <div className="absolute right-[-10%] bottom-0 h-[80%] md:h-[110%] w-[60%] md:w-[50%] pointer-events-none transition-transform duration-700 group-hover:scale-105" key={`img-${currentSlide}`}>
            <img src={slide.image} alt="Featured Slide" className={`${slide.imgClass} animate-fade-in-up`} />
          </div>
        </div>

        {/* Secondary Banner (Right 1/3) */}
        <div className="relative bg-gradient-to-br from-teal-400 to-emerald-500 rounded-[2rem] overflow-hidden min-h-[280px] lg:min-h-[460px] flex flex-col justify-center p-8 md:p-10 group">
          <div className="relative z-10">
            <span className="text-white font-black text-5xl md:text-6xl block mb-1 drop-shadow-md leading-none">SALE</span>
            <span className="text-white font-black text-3xl md:text-4xl block mb-4 drop-shadow-md leading-none">UP TO 50% OFF</span>
            <p className="text-white/95 font-semibold text-sm mb-6 max-w-[150px]">
              On all homemade bakery items this weekend!
            </p>
          </div>
          <div className="absolute right-[-10%] bottom-[-10%] w-[60%] h-[60%] pointer-events-none drop-shadow-2xl transition-transform duration-700 group-hover:scale-110">
            <img src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500" alt="Cookies" className="w-full h-full object-cover rounded-full border-4 border-white shadow-2xl rotate-[-15deg]" />
          </div>
        </div>
        
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-2 mt-8">
        {heroSlides.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              currentSlide === idx 
                ? "w-8 h-2.5 bg-gray-800" 
                : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

function CategoriesSection() {
  return (
    <section className="py-12 px-4 md:px-8 bg-white max-w-[1400px] mx-auto w-full">

      {/* Section Header */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Explore Popular Categories</h2>
        <Link to="/listings" className="text-purple-600 text-sm font-semibold hover:text-purple-700 flex items-center gap-1 transition-colors">
          View All <span className="text-lg">›</span>
        </Link>
      </div>

      {/* Circular Grid */}
      <div className="flex items-center justify-between md:justify-start gap-4 md:gap-8 overflow-x-auto pb-6 scrollbar-hide snap-x">
        {categories.map((cat) => (
          <Link to={`/listings?category=${cat.name}`} key={cat.id} className="snap-start flex flex-col items-center gap-4 min-w-[100px] md:min-w-[140px] group cursor-pointer">
            <div className="w-20 h-20 md:w-[130px] md:h-[130px] rounded-full bg-gray-50 flex items-center justify-center p-1 md:p-1.5 border border-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
              <img src={cat.image} alt={cat.name} className="w-full h-full rounded-full object-cover shadow-inner" />
            </div>
            <span className="text-sm md:text-base font-bold text-gray-800 group-hover:text-purple-600 transition-colors text-center">
              {cat.name}
            </span>
          </Link>
        ))}
        {/* Next Arrow (decorative for desktop) */}
        <button className="hidden lg:flex min-w-[48px] w-12 h-12 rounded-full bg-white border border-gray-200 items-center justify-center shadow-sm hover:bg-gray-50 text-gray-400 hover:text-gray-800 shrink-0 ml-4 transition-all">
          <span className="text-2xl mt-[-2px]">›</span>
        </button>
      </div>

    </section>
  )
}

function FeaturedListingsSection() {
  return (
    <section className="py-12 px-4 md:px-8 bg-[#f4f6f8]">

      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 max-w-[1400px] mx-auto">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Featured Listings</h2>
          <p className="text-gray-400 text-sm mt-1">Handpicked homemade goods for you</p>
        </div>
        <Link to="/listings" className="text-[#3bb397] text-sm font-semibold hover:text-[#2a9d82] flex items-center gap-1 transition-colors">
          View All <span className="text-lg">›</span>
        </Link>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[1400px] mx-auto">
        {sampleListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

    </section>
  )
}

function HowItWorksSection() {
  return (
    <section className="py-16 px-8 bg-white">

      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-black text-gray-800">How It Works</h2>
        <p className="text-gray-400 text-sm mt-1">Get started in 3 simple steps</p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((s, index) => (
          <div key={s.step} className="flex flex-col items-center text-center gap-4">

            {/* Emoji Circle */}
            <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100
              flex items-center justify-center text-3xl">
              {s.emoji}
            </div>

            {/* Step Number */}
            <span className="text-xs font-black text-purple-400 tracking-widest">
              STEP {s.step}
            </span>

            {/* Title */}
            <h3 className="font-black text-gray-800 text-lg">{s.title}</h3>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>

            {/* Connector arrow (not on last item) */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute translate-x-32 text-purple-200 text-2xl">
                →
              </div>
            )}

          </div>
        ))}
      </div>

    </section>
  )
}

// ─── MAIN PAGE ───────────────────────────────────────────

function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <CategoriesSection />
      <FeaturedListingsSection />
      <HowItWorksSection />
    </div>
  )
}

export default HomePage