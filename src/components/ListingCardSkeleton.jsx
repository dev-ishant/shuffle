import { Skeleton } from "@/components/ui/skeleton"

function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden
      shadow-[4px_4px_12px_#c5c7cf,-2px_-2px_8px_#ffffff]
      flex flex-row">

      {/* Image placeholder */}
      <Skeleton className="w-48 sm:w-64 shrink-0 rounded-none" />

      {/* Content placeholder */}
      <div className="p-5 flex flex-col gap-3 flex-1 min-w-0">

        {/* Title */}
        <Skeleton className="h-4 w-3/4 rounded-full" />
        <Skeleton className="h-4 w-1/2 rounded-full" />

        {/* Price */}
        <Skeleton className="h-7 w-1/3 rounded-full" />

        {/* Category */}
        <Skeleton className="h-3 w-1/4 rounded-full" />

        {/* Location */}
        <Skeleton className="h-3 w-2/5 rounded-full" />

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-10 flex-1 rounded-full" />
          <Skeleton className="h-10 flex-1 rounded-full" />
        </div>

      </div>
    </div>
  )
}

export default ListingCardSkeleton