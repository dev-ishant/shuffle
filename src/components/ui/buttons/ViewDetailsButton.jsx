import { Eye } from "lucide-react"

export function ViewDetailsButton({ children = "View Details", ...props }) {
  return (
    <button
      className="group relative flex items-center gap-3
        bg-[#e8eaf0] text-purple-700 font-semibold text-sm
        pl-1.5 pr-6 py-1.5 rounded-full
        shadow-[5px_5px_12px_#c5c7cf,-5px_-5px_12px_#ffffff]
        hover:shadow-[inset_4px_4px_10px_#c5c7cf,inset_-4px_-4px_10px_#ffffff]
        hover:text-purple-900
        active:shadow-[inset_4px_4px_10px_#c5c7cf,inset_-4px_-4px_10px_#ffffff]
        transition-all duration-300 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        overflow-hidden"
      {...props}
    >
      <div className="w-8 h-8 shrink-0 opacity-0 pointer-events-none" />
      <span className="absolute left-1.5 flex items-center justify-center w-8 h-8 rounded-full bg-[#e8eaf0]
        shadow-[3px_3px_6px_#c5c7cf,-3px_-3px_6px_#ffffff]
        transition-all duration-500 ease-in-out
        group-hover:left-[calc(100%-2.375rem)]">
        <Eye className="w-4 h-4 text-purple-600" />
      </span>
      <span className="transition-all duration-500 ease-in-out group-hover:-translate-x-2">
        {children}
      </span>
    </button>
  )
}
