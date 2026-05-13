import { ArrowLeftRight } from "lucide-react"

export function MakeOfferButton({ children = "Make Offer / Exchange", ...props }) {
  return (
    <button
      className="group relative flex items-center gap-3
        bg-gradient-to-r from-pink-500 to-fuchsia-600
        hover:from-pink-600 hover:to-fuchsia-700
        text-white font-semibold text-sm
        pl-1.5 pr-6 py-1.5 rounded-full
        shadow-md shadow-pink-500/40
        hover:shadow-lg hover:shadow-fuchsia-600/50
        hover:scale-[1.04] active:scale-[0.97]
        transition-all duration-300 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        overflow-hidden"
      {...props}
    >
      <div className="w-8 h-8 shrink-0 opacity-0 pointer-events-none" />
      <span className="absolute left-1.5 flex items-center justify-center w-8 h-8 rounded-full bg-white/25
        transition-all duration-500 ease-in-out
        group-hover:left-[calc(100%-2.375rem)]">
        <ArrowLeftRight className="w-4 h-4" />
      </span>
      <span className="transition-all duration-500 ease-in-out group-hover:-translate-x-2">
        {children}
      </span>
    </button>
  )
}
