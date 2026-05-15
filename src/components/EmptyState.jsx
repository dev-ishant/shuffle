import { PackageOpen } from "lucide-react"
import { Link } from "react-router-dom"

function EmptyState({
  icon: Icon = PackageOpen,
  title = "No listings found",
  description = "Try adjusting your search or filters.",
  actionLabel,
  actionTo,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
        <Icon className="w-9 h-9 text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-700 mb-1.5">{title}</h3>
      <p className="text-sm text-gray-400 max-w-xs mb-6">{description}</p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center gap-2 bg-[#3bb397] hover:bg-[#2a9d82] text-white font-semibold text-sm px-6 py-3 rounded-full transition-all shadow-md"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}

export default EmptyState
