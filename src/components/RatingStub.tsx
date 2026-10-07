import { Star } from "lucide-react";

// A rating shown as a cinema ticket stub: the score, a perforation, then "/10".
export default function RatingStub({ rating, size = "sm", className = "" }: {
  rating: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const big = size === "md";
  return (
    <span className={`ticket inline-flex items-stretch bg-[#F2AA48] text-black ${big ? "text-base" : "text-sm"} ${className}`}>
      <span className={`flex items-center gap-1 font-display font-black leading-none ${big ? "text-3xl pl-4 pr-2.5 py-1.5" : "text-2xl pl-3 pr-2 py-1"}`}>
        <Star className={big ? "w-4 h-4 fill-black" : "w-3 h-3 fill-black"} />
        {rating}
      </span>
      <span className={`flex items-center border-l-2 border-dashed border-black/70 font-sans font-bold leading-none ${big ? "text-xs pl-2 pr-4" : "text-[10px] pl-1.5 pr-3"}`}>
        /10
      </span>
    </span>
  );
}
