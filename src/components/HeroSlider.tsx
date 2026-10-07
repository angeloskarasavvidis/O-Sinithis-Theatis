"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Post } from "@/types";

const SLIDE_DURATION = 10000;

export default function HeroSlider({ posts }: { posts: Post[] }) {
  const [current, setCurrent] = useState(0);

  // restarts whenever the slide changes, so manual navigation gets a full interval
  useEffect(() => {
    if (posts.length < 2) return;
    const timer = setTimeout(() => {
      setCurrent((c) => (c + 1) % posts.length);
    }, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [current, posts.length]);

  if (posts.length === 0) return null;

  const post = posts[current] ?? posts[0];

  return (
    <div className="relative h-[480px] md:h-[580px] overflow-hidden bg-black border-b-[3px] border-black">
      {/* Images are stacked and crossfaded */}
      {posts.map((p, i) => (
        <Image
          key={p.id}
          src={p.image}
          alt={i === current ? p.title : ""}
          fill
          className={`object-cover transition-opacity duration-1000 ease-in-out ${i === current ? "opacity-100" : "opacity-0"}`}
          priority={i === 0}
          sizes="100vw"
        />
      ))}
      {/* Dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/70 via-transparent to-transparent" />

      {/* Content */}
      <div key={post.id} className="animate-hero-in absolute bottom-0 left-0 right-0 px-6 pt-6 pb-16 md:px-12 md:pt-12 md:pb-14 text-white">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] bg-black text-white px-3 py-1.5">
            {post.postType}
          </span>
          {post.rating && (
            <span className="flex items-center gap-1 font-sans text-sm font-semibold text-[#F2AA48]">
              <Star className="w-3.5 h-3.5 fill-[#F2AA48]" />
              {post.rating}/10
            </span>
          )}
          {post.genre?.[0] && (
            <span className="font-sans text-xs uppercase tracking-widest text-zinc-300">
              {post.genre[0]}
            </span>
          )}
        </div>

        <h2 className="font-display uppercase font-black text-5xl sm:text-6xl md:text-8xl leading-[0.95] mb-4 max-w-4xl text-balance drop-shadow-lg">
          {post.title}
        </h2>
        <p className="font-sans text-white/80 text-base md:text-lg max-w-xl mb-8 leading-relaxed text-pretty">
          {post.subtitle}
        </p>
        <Link
          href={`/posts/${post.slug}`}
          className="inline-block font-sans text-sm font-semibold uppercase tracking-widest bg-black text-[#F2AA48] border-[3px] border-black hover:bg-[#F2AA48] hover:text-black px-6 py-3 transition-colors duration-300"
        >
          Διαβάστε Περισσότερα →
        </Link>
      </div>

      {posts.length > 1 && (
        <>
          {/* Arrows */}
          <button
            onClick={() => setCurrent((c) => (c - 1 + posts.length) % posts.length)}
            aria-label="Προηγούμενο"
            className="hidden sm:block absolute left-4 top-1/2 -translate-y-1/2 bg-zinc-950/60 hover:bg-[#F2AA48] hover:text-black text-white p-3 transition-colors duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % posts.length)}
            aria-label="Επόμενο"
            className="hidden sm:block absolute right-4 top-1/2 -translate-y-1/2 bg-zinc-950/60 hover:bg-[#F2AA48] hover:text-black text-white p-3 transition-colors duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicators: the active one fills up as the slide's time runs out */}
          <div className="absolute bottom-5 left-6 md:left-auto md:right-12 flex items-center gap-4">
            <span className="font-sans text-xs font-semibold tracking-widest text-white/80 tabular-nums">
              {String(current + 1).padStart(2, "0")} / {String(posts.length).padStart(2, "0")}
            </span>
            <div className="flex">
              {posts.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setCurrent(i)}
                  aria-label={`Διαφάνεια ${i + 1}`}
                  aria-current={i === current}
                  className="group py-3 px-1"
                >
                  <span className="block relative h-1 w-10 bg-white/30 group-hover:bg-white/60 transition-colors duration-300 overflow-hidden">
                    {i === current && (
                      <span
                        className="animate-hero-progress absolute inset-0 origin-left bg-[#F2AA48]"
                        style={{ animationDuration: `${SLIDE_DURATION}ms` }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
