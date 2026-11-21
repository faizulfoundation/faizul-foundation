'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { HERO_BANNER_SLIDES } from '@/lib/foundation-defaults';

export function HeroBannerSlider() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = HERO_BANNER_SLIDES.length;
  const activeSlide = HERO_BANNER_SLIDES[index];

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [isPaused, total]);

  const goPrev = () => setIndex((prev) => (prev - 1 + total) % total);
  const goNext = () => setIndex((prev) => (prev + 1) % total);

  return (
    <div className="rounded-2xl border border-[#D9E3DB] bg-white overflow-hidden shadow-sm">
      <div className="relative aspect-[16/9] w-full bg-[#F7FAF7] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0.25 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.25 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <Image
              src={activeSlide.imageSrc}
              alt={activeSlide.imageAlt}
              fill
              priority={index === 0}
              sizes="(max-width: 1024px) 100vw, 680px"
              referrerPolicy="no-referrer"
              className="object-contain"
            />
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous foundation banner"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-[#D9E3DB] bg-white/90 p-2 text-[#131D15] hover:bg-white hover:text-[#0E7A21] transition-colors shadow-xs"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next foundation banner"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[#D9E3DB] bg-white/90 p-2 text-[#131D15] hover:bg-white hover:text-[#0E7A21] transition-colors shadow-xs"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="border-t border-[#EAF0EB] bg-white px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0E7A21]">
              {activeSlide.eyebrow}
            </p>
            <h2 className="mt-0.5 font-serif text-lg font-semibold text-[#131D15]">
              {activeSlide.title}
            </h2>
            <p className="mt-1 text-sm text-[#4B594E] leading-relaxed">{activeSlide.caption}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#EAF0EB] pt-3">
          <div className="flex items-center gap-2" role="tablist" aria-label="Select banner slide">
            {HERO_BANNER_SLIDES.map((slide, slideIdx) => {
              const active = slideIdx === index;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`View slide ${slideIdx + 1}: ${slide.title}`}
                  onClick={() => setIndex(slideIdx)}
                  className={`h-2.5 rounded-full transition-all ${
                    active ? 'w-7 bg-[#0E7A21]' : 'w-2.5 bg-[#D9E3DB] hover:bg-[#0E7A21]/50'
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4B594E] hover:text-[#0E7A21] transition-colors"
          >
            {isPaused ? (
              <>
                <Play className="h-3.5 w-3.5" />
                Resume Slides
              </>
            ) : (
              <>
                <Pause className="h-3.5 w-3.5" />
                Pause Slides
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
