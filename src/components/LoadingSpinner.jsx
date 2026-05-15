import { Loader2 } from "lucide-react"

function LoadingSpinner({ size = 24, text = "Loading...", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-20 text-gray-400 ${className}`}>
      <Loader2 className="w-8 h-8 animate-spin text-[#3bb397]" style={{ width: size, height: size }} />
      {text && <p className="text-sm font-medium">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
