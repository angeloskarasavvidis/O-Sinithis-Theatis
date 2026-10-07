import Link from "next/link";
import { Star } from "lucide-react";
import { Post } from "@/types";

const MIN_ITEMS = 10;
const SECONDS_PER_CHARACTER = 0.3;

// A cinema-marquee strip: the latest titles scrolling slowly on a black band.
// The track is rendered twice and shifted by half its width, so the loop is seamless.
export default function TitleMarquee({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  // repeat short lists so one copy is always wider than the screen
  const items: Post[] = [];
  while (items.length < MIN_ITEMS) items.push(...posts);

  const characters = items.reduce((total, p) => total + p.title.length + 4, 0);
  const duration = Math.max(30, characters * SECONDS_PER_CHARACTER);

  return (
    <div className="relative flex bg-black border-b-[3px] border-black">
      <span className="relative z-10 shrink-0 flex items-center bg-[#F2AA48] text-black font-display uppercase font-black text-2xl md:text-3xl leading-none px-4 md:px-6 border-r-[3px] border-black">
        Νέα άρθρα
      </span>
      <div className="flex-1 min-w-0 overflow-hidden motion-reduce:overflow-x-auto">
        <div
          className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:[animation:none]"
          style={{ animationDuration: `${duration}s` }}
        >
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center py-3">
              {items.map((p, i) => (
                <li key={`${p.id}-${i}`} className="flex items-center">
                  <Link
                    href={`/posts/${p.slug}`}
                    tabIndex={copy === 1 ? -1 : undefined}
                    className="font-display uppercase font-black text-2xl md:text-3xl leading-none whitespace-nowrap text-[#F2AA48] hover:text-white transition-colors duration-200"
                  >
                    {p.title}
                  </Link>
                  <Star className="w-3.5 h-3.5 mx-5 md:mx-7 shrink-0 fill-white text-white" aria-hidden="true" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
