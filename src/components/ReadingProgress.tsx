"use client";

import { useEffect, useRef } from "react";

// A thin bar at the top of the window that fills as the element with `targetId` is read.
export default function ReadingProgress({ targetId }: { targetId: string }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const target = document.getElementById(targetId);
      const bar = barRef.current;
      if (!target || !bar) return;
      const rect = target.getBoundingClientRect();
      // 0 when the top of the text reaches the top of the window, 1 when its end reaches the bottom
      const distance = rect.height - window.innerHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, -rect.top / distance)) : rect.top <= 0 ? 1 : 0;
      bar.style.transform = `scaleX(${progress})`;
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [targetId]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[55] h-1.5 pointer-events-none" aria-hidden="true">
      <div ref={barRef} className="h-full origin-left bg-[#F2AA48] border-b-2 border-black" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
