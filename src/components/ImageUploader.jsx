import { useState, useRef, useCallback } from "react"
import { Upload, X, ImageIcon } from "lucide-react"

function ImageUploader({ value = [], onChange, maxFiles = 5 }) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  const handleFiles = useCallback((files) => {
    const incoming = Array.from(files).slice(0, maxFiles - value.length)
    const newImages = incoming.map((f) => Object.assign(f, { preview: URL.createObjectURL(f) }))
    onChange([...value, ...newImages])
  }, [value, onChange, maxFiles])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const removeImage = (index) => {
    const img = value[index]
    if (img.preview) URL.revokeObjectURL(img.preview)
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
          dragOver
            ? "border-[#3bb397] bg-emerald-50"
            : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
          <Upload className={`w-5 h-5 ${dragOver ? "text-[#3bb397]" : "text-gray-400"}`} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700">
            {dragOver ? "Drop images here" : "Drag & drop images here"}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">or click to browse (max {maxFiles})</p>
        </div>
      </div>

      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {value.map((file, idx) => (
            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={file.preview || file}
                alt={`Upload ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageUploader
