'use client';

import Image from 'next/image';
import { Calendar, MapPin, X } from 'lucide-react';
import { ProjectStage } from '@/lib/types';

export interface ModalProjectItem {
  title: string;
  description: string;
  dateLabel: string;
  location: string;
  stage: ProjectStage;
  photos: string[];
  focusPoints?: string[];
}

interface ActivityDetailModalProps {
  item: ModalProjectItem | null;
  onClose: () => void;
}

export function ActivityDetailModal({ item, onClose }: ActivityDetailModalProps) {
  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="activity-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-[#D9E3DB] bg-white overflow-hidden shadow-xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#EAF0EB] px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0E7A21]">
              Status: {item.stage}
            </p>
            <h3 id="activity-modal-title" className="mt-1 font-serif text-xl sm:text-2xl font-bold text-[#131D15]">
              {item.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="rounded-lg p-1.5 text-[#4B594E] hover:bg-[#F1F5F2] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-6 py-5 space-y-5">
          {item.photos.length > 0 && (
            <div className="space-y-3">
              {item.photos.map((photo, idx) => {
                const isDataUrl = photo.startsWith('data:');
                return (
                  <div
                    key={`${photo.slice(0, 32)}-${idx}`}
                    className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#EAF0EB] bg-[#F7FAF7]"
                  >
                    {isDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo}
                        alt={`${item.title} photo ${idx + 1}`}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Image
                        src={photo}
                        alt={`${item.title} photo ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 640px"
                        referrerPolicy="no-referrer"
                        className="object-contain"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[#4B594E] border-y border-[#EAF0EB] py-3">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[#0E7A21]" />
              {item.dateLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#0E7A21]" />
              {item.location}
            </span>
          </div>

          <p className="text-sm sm:text-base leading-relaxed text-[#131D15] whitespace-pre-line">
            {item.description}
          </p>

          {item.focusPoints && item.focusPoints.length > 0 && (
            <div className="rounded-xl border border-[#EAF0EB] bg-[#F7FAF7] p-4">
              <h4 className="font-serif text-sm font-semibold text-[#131D15]">Key Focus Areas</h4>
              <ul className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#4B594E]">
                {item.focusPoints.map((point) => (
                  <li key={point} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0E7A21] shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-[#EAF0EB] bg-[#F7FAF7] px-6 py-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#0E7A21] px-5 py-2 text-sm font-semibold text-white hover:bg-[#073B10] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
