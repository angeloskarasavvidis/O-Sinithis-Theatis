"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Post } from "@/types";

export default function HeroSlider({ posts }: { posts: Post[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % posts.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [posts.length]);

  if (posts.length === 0) return null;

  const post = posts[current];

  return (
    <div className="relative h-[480px] md:h-[580px] overflow-hidden">
      <Image
        src={post.image}
        alt={post.title}
        fill
        className="object-cover transition-opacity duration-700"
        priority
        sizes="100vw"
      />
      {/* Dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-inter text-xs font-semibold uppercase tracking-[0.2em] bg-[#009DF8] text-white px-3 py-1.5">
            {post.postType}
          </span>
          {post.rating && (
            <span className="flex items-center gap-1 font-inter text-sm font-semibold text-yellow-400">
              <Star className="w-3.5 h-3.5 fill-yellow-400" />
              {post.rating}/10
            </span>
          )}
          {post.genre?.[0] && (
            <span className="font-inter text-xs uppercase tracking-widest text-zinc-400">
              {post.genre[0]}
            </span>
          )}
        </div>

        <h2 className="font-serif font-black italic text-5xl md:text-7xl leading-none mb-4 max-w-3xl drop-shadow-lg">
          {post.title}
        </h2>
        <p className="font-inter text-white/75 text-base md:text-lg max-w-xl mb-8 leading-relaxed">
          {post.subtitle}
        </p>
        <Link
          href={`/posts/${post.slug}`}
          className="inline-block font-inter text-sm font-semibold uppercase tracking-widest bg-[#009DF8] hover:bg-white hover:text-zinc-900 text-white px-6 py-3 transition-colors"
        >
          Διαβάστε Περισσότερα →
        </Link>
      </div>

      {/* Arrows */}
      <button
        onClick={() => setCurrent((c) => (c - 1 + posts.length) % posts.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-zinc-900/60 hover:bg-zinc-900 text-white p-3 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % posts.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-zinc-900/60 hover:bg-zinc-900 text-white p-3 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 right-8 flex gap-1.5">
        {posts.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-0.5 transition-all ${i === current ? "w-8 bg-[#009DF8]" : "w-4 bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
