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
    }, 6000);
    return () => clearInterval(timer);
  }, [posts.length]);

  if (posts.length === 0) return null;

  const post = posts[current];

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-xl">
      <Image
        src={post.image}
        alt={post.title}
        fill
        className="object-cover transition-opacity duration-500"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-[#009DF8] text-white text-xs font-bold px-3 py-1 rounded-full">
            {post.postType}
          </span>
          {post.rating && (
            <span className="flex items-center gap-1 bg-black/50 text-yellow-400 text-xs px-2 py-1 rounded-full">
              <Star className="w-3 h-3 fill-yellow-400" />
              {post.rating}
            </span>
          )}
        </div>
        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-2 drop-shadow-lg">
          {post.title}
        </h2>
        <p className="text-white/90 text-sm md:text-base max-w-2xl mb-4 drop-shadow">
          {post.subtitle}
        </p>
        <Link
          href={`/posts/${post.slug}`}
          className="inline-block bg-[#009DF8] hover:bg-[#007fd0] text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-colors"
        >
          Διαβάστε Περισσότερα →
        </Link>
      </div>

      <button
        onClick={() => setCurrent((c) => (c - 1 + posts.length) % posts.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % posts.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {posts.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
