const stampColors: Record<string, string> = {
  Κριτική: "bg-black text-white",
  Αφιέρωμα: "bg-black text-[#F2AA48]",
  Νέα: "bg-white text-black",
  Συνέντευξη: "bg-[#F2AA48] text-black",
};

// The post type as a rubber stamp: slightly tilted, with a thin frame in the text colour.
export default function TypeStamp({ postType, className = "" }: { postType: string; className?: string }) {
  return (
    <span
      className={`inline-block -rotate-3 font-sans text-xs font-bold uppercase tracking-widest px-3 py-1.5 outline-2 outline-offset-2 outline-current ${
        stampColors[postType] ?? "bg-black text-white"
      } ${className}`}
    >
      {postType}
    </span>
  );
}
