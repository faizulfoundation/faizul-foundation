'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, HandHeart, HeartHandshake, MapPin } from 'lucide-react';
import { ActivityDetailModal, ModalProjectItem } from '@/components/ActivityDetailModal';
import { useFoundation } from '@/components/FoundationProvider';
import { WORK_AREAS } from '@/lib/foundation-defaults';
import { ProjectStage } from '@/lib/types';

export default function OurWorkPage() {
  const { activities, isLoadingPublicData } = useFoundation();
  const [stageFilter, setStageFilter] = useState<'All' | ProjectStage>('All');
  const [selectedItem, setSelectedItem] = useState<ModalProjectItem | null>(null);

  const filtered =
    stageFilter === 'All'
      ? activities
      : activities.filter((a) => a.projectStage === stageFilter);

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0E7A21]">
            Verified Community Service
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#131D15]">
            Our Work &amp; Documented Activities
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#4B594E]">
            Genuine humanitarian, educational, madrasa, and masjid activities documented and
            published directly by Faizul Foundation. Unverified claims are never published.
          </p>
        </header>

        <section className="flex flex-wrap items-center gap-2 border-b border-[#D9E3DB] pb-4">
          {(['All', ProjectStage.COMPLETED, ProjectStage.WORK_IN_PROGRESS, ProjectStage.PROPOSED] as const).map(
            (stage) => {
              const active = stageFilter === stage;
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setStageFilter(stage)}
                  className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#0E7A21] text-white'
                      : 'border border-[#D9E3DB] bg-white text-[#4B594E] hover:border-[#0E7A21] hover:text-[#131D15]'
                  }`}
                >
                  {stage}
                </button>
              );
            }
          )}
        </section>

        {isLoadingPublicData ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 rounded-2xl border border-[#D9E3DB] bg-[#F7FAF7] animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-[#D9E3DB] bg-[#F7FAF7] p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <HeartHandshake className="mx-auto h-10 w-10 text-[#0E7A21]" />
            <h2 className="mt-4 font-serif text-2xl font-bold text-[#131D15]">
              No Published Activities Yet
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#4B594E] leading-relaxed">
              Faizul Foundation publishes only verified, real-world work. As activities are
              documented and approved by the foundation administrator, they will appear here.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-lg border border-[#0E7A21] bg-white px-5 py-2.5 text-sm font-semibold text-[#0E7A21] hover:bg-[#E6F4E9] transition-colors"
              >
                View Planned Projects
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/request-help"
                className="inline-flex items-center gap-2 rounded-lg bg-[#0E7A21] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#073B10] transition-colors"
              >
                <HandHeart className="h-4 w-4" />
                Request Help
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((activity) => {
              const leadPhoto = activity.photoUrls[0];
              const isDataUrl = leadPhoto?.startsWith('data:');
              return (
                <article
                  key={activity.id}
                  className="rounded-2xl border border-[#D9E3DB] bg-white overflow-hidden flex flex-col"
                >
                  {leadPhoto && (
                    <div className="relative aspect-[16/9] w-full bg-[#F7FAF7] border-b border-[#EAF0EB]">
                      {isDataUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={leadPhoto}
                          alt={activity.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Image
                          src={leadPhoto}
                          alt={activity.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          referrerPolicy="no-referrer"
                          className="object-cover"
                        />
                      )}
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          activity.projectStage === ProjectStage.PROPOSED
                            ? 'text-[#C91E1E]'
                            : 'text-[#0E7A21]'
                        }`}
                      >
                        {activity.projectStage} · {activity.photoUrls.length} photo
                        {activity.photoUrls.length === 1 ? '' : 's'}
                      </p>
                      <h2 className="mt-2 font-serif text-xl font-bold text-[#131D15]">
                        {activity.title}
                      </h2>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#4B594E]">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-[#0E7A21]" />
                          {activity.activityDate}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-[#0E7A21]" />
                          {activity.location}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-[#4B594E] line-clamp-4 leading-relaxed">
                        {activity.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedItem({
                          title: activity.title,
                          description: activity.description,
                          dateLabel: activity.activityDate,
                          location: activity.location,
                          stage: activity.projectStage,
                          photos: activity.photoUrls,
                        })
                      }
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0E7A21] hover:underline self-start"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <section className="border-t border-[#D9E3DB] pt-12">
          <h2 className="font-serif text-2xl font-bold text-[#131D15]">
            Our Seven Areas of Humanitarian Work
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WORK_AREAS.map((area) => (
              <div key={area.code} className="rounded-xl border border-[#D9E3DB] bg-[#F7FAF7] p-5">
                <p className="font-mono text-xs font-semibold text-[#0E7A21]">{area.code}</p>
                <h3 className="mt-1 font-serif text-base font-bold text-[#131D15]">
                  {area.title}
                </h3>
                <p className="mt-1.5 text-sm text-[#4B594E] leading-relaxed">{area.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <ActivityDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
