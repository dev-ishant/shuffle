import { Plus } from "lucide-react"

export function CreateListingButton({ children = "Create Listing", ...props }) {
  return (
    <button
      className="group relative flex items-center gap-3
        bg-gradient-to-r from-purple-600 to-violet-600
        hover:from-purple-700 hover:to-violet-700
        text-white font-semibold text-sm
        pl-1.5 pr-6 py-1.5 rounded-full
        shadow-md shadow-purple-500/40
        hover:shadow-lg hover:shadow-purple-600/50
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
        <Plus className="w-4 h-4" />
      </span>
      <span className="transition-all duration-500 ease-in-out group-hover:-translate-x-2">
        {children}
      </span>
    </button>
  )
}
