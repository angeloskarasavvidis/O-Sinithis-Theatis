"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface LightboxImage {
  src: string;
  alt: string;
  caption: string;
}

/** Collects what the lightbox needs when an image inside an article is clicked; null for any other click. */
export function lightboxFromClick(target: EventTarget): { images: LightboxImage[]; index: number } | null {
  if (!(target instanceof HTMLImageElement)) return null;
  const gallery = target.closest("[data-gallery]");
  const elements = gallery ? Array.from(gallery.querySelectorAll("img")) : [target];
  return {
    index: Math.max(0, elements.indexOf(target)),
    images: elements.map((img) => ({
      src: img.currentSrc || img.src,
      alt: img.alt,
      caption: img.closest("figure")?.querySelector("figcaption")?.textContent?.trim() ?? "",
    })),
  };
}

// A full-window view of an article image, with arrows when it belongs to a gallery.
export default function ImageLightbox({ images, index, onIndex, onClose }: {
  images: LightboxImage[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const many = images.length > 1;
  const image = images[index];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (many && e.key === "ArrowRight") onIndex((index + 1) % images.length);
      if (many && e.key === "ArrowLeft") onIndex((index - 1 + images.length) % images.length);
    }

    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [index, images.length, many, onClose, onIndex]);

  if (!image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Προβολή εικόνας"
      onClick={onClose}
      className="fixed inset-0 z-[70] bg-black flex flex-col items-center justify-center p-4 md:p-10"
    >
      <button onClick={onClose} aria-label="Κλείσιμο" className="absolute top-4 right-4 p-2 text-white hover:text-[#F2AA48] transition-colors duration-300">
        <X className="w-7 h-7" />
      </button>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-[80vh] object-contain border-[3px] border-[#F2AA48]"
      />

      {(image.caption || many) && (
        <p onClick={(e) => e.stopPropagation()} className="mt-4 max-w-2xl text-center font-sans text-sm text-white">
          {many && <span className="font-semibold text-[#F2AA48] tabular-nums mr-3">{index + 1} / {images.length}</span>}
          {image.caption}
        </p>
      )}

      {many && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + images.length) % images.length); }}
            aria-label="Προηγούμενη εικόνα"
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-3 bg-[#F2AA48] text-black border-[3px] border-black"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % images.length); }}
            aria-label="Επόμενη εικόνα"
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-3 bg-[#F2AA48] text-black border-[3px] border-black"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
}
