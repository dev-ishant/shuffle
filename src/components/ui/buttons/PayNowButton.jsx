import { ShoppingCart } from "lucide-react"

export function PayNowButton({ children = "Pay Now / Place Order", ...props }) {
  return (
    <button
      className="group relative flex items-center gap-3
        bg-gradient-to-r from-emerald-500 to-green-600
        hover:from-emerald-600 hover:to-green-700
        text-white font-bold text-base
        pl-2 pr-7 py-2 rounded-full
        shadow-md shadow-emerald-500/40
        hover:shadow-lg hover:shadow-green-600/50
        hover:scale-[1.04] active:scale-[0.97]
        transition-all duration-300 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        overflow-hidden"
      {...props}
    >
      <div className="w-9 h-9 shrink-0 opacity-0 pointer-events-none" />
      <span className="absolute left-2 flex items-center justify-center w-9 h-9 rounded-full bg-white/25
        transition-all duration-500 ease-in-out
        group-hover:left-[calc(100%-2.75rem)]">
        <ShoppingCart className="w-5 h-5" />
      </span>
      <span className="transition-all duration-500 ease-in-out group-hover:-translate-x-2">
        {children}
      </span>
    </button>
  )
}
