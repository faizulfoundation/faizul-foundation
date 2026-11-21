'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Calendar, Info, MapPin } from 'lucide-react';
import { ActivityDetailModal, ModalProjectItem } from '@/components/ActivityDetailModal';
import { useFoundation } from '@/components/FoundationProvider';
import { INITIAL_SHOWCASE_PROJECTS } from '@/lib/foundation-defaults';
import { ProjectStage } from '@/lib/types';

export default function ProjectsPage() {
  const { activities } = useFoundation();
  const [selectedItem, setSelectedItem] = useState<ModalProjectItem | null>(null);

  const cloudProjects = activities.filter(
    (a) =>
      a.projectStage === ProjectStage.PROPOSED ||
      a.projectStage === ProjectStage.WORK_IN_PROGRESS ||
      a.projectStage === ProjectStage.COMPLETED
  );

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0E7A21]">
            Foundation Projects
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#131D15]">
            Community &amp; Institutional Projects
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#4B594E]">
            In accordance with Faizul Foundation&rsquo;s transparency commitment, proposed concepts
            and active developments are explicitly labeled as Proposed or Work in Progress and are
            never presented as completed buildings.
          </p>
        </header>

        <div className="rounded-xl border border-[#D9E3DB] bg-[#F7FAF7] p-4 flex items-start gap-3 text-sm text-[#4B594E]">
          <Info className="h-5 w-5 text-[#0E7A21] shrink-0 mt-0.5" />
          <p>
            Visual banners below represent official foundation project concepts and active welfare
            initiatives. Administrators update verified progress records directly from the portal.
          </p>
        </div>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {INITIAL_SHOWCASE_PROJECTS.map((project) => (
            <article
              key={project.id}
              className="rounded-2xl border border-[#D9E3DB] bg-white overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[16/9] w-full bg-[#F7FAF7] border-b border-[#EAF0EB]">
                <Image
                  src={project.imageSrc}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  referrerPolicy="no-referrer"
                  className="object-contain"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      project.stage === ProjectStage.PROPOSED
                        ? 'text-[#C91E1E]'
                        : 'text-[#0E7A21]'
                    }`}
                  >
                    {project.stage} · {project.dateLabel}
                  </p>
                  <h2 className="mt-2 font-serif text-xl font-bold text-[#131D15]">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-xs text-[#4B594E] inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#0E7A21]" />
                    {project.location}
                  </p>
                  <p className="mt-3 text-sm text-[#4B594E] leading-relaxed">{project.summary}</p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedItem({
                      title: project.title,
                      description: project.details,
                      dateLabel: project.dateLabel,
                      location: project.location,
                      stage: project.stage,
                      photos: [project.imageSrc],
                      focusPoints: project.focusPoints,
                    })
                  }
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0E7A21] hover:underline self-start"
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}

          {cloudProjects.map((activity) => {
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
                        sizes="(max-width: 768px) 100vw, 420px"
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
                      {activity.projectStage}
                    </p>
                    <h2 className="mt-2 font-serif text-xl font-bold text-[#131D15]">
                      {activity.title}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#4B594E]">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-[#0E7A21]" />
                        {activity.activityDate}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#0E7A21]" />
                        {activity.location}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-[#4B594E] line-clamp-3 leading-relaxed">
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
        </section>
      </div>

      <ActivityDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
