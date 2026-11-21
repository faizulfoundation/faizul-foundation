'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Calendar,
  Compass,
  Eye,
  HandHeart,
  Info,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ActivityDetailModal, ModalProjectItem } from '@/components/ActivityDetailModal';
import { useFoundation } from '@/components/FoundationProvider';
import { HeroBannerSlider } from '@/components/HeroBannerSlider';
import { PWAInstallButton } from '@/components/PWAInstallButton';
import { buildMailtoHref, buildTelHref, buildWhatsAppHref } from '@/lib/contact-links';
import {
  DATA_COMING_SOON_LABEL,
  FOUNDATION_NAME,
  FOUNDATION_TAGLINE,
  INITIAL_SHOWCASE_PROJECTS,
  OFFICIAL_IMAGES,
} from '@/lib/foundation-defaults';
import { ProjectStage } from '@/lib/types';

export default function HomePage() {
  const { activities, impactMetrics, contactConfig, siteContent } = useFoundation();
  const [selectedModalItem, setSelectedModalItem] = useState<ModalProjectItem | null>(null);

  const telHref = buildTelHref(contactConfig.mobileNumber);
  const waHref = buildWhatsAppHref(contactConfig.whatsappNumber);
  const mailHref = buildMailtoHref(contactConfig.emailAddress);

  const impactRows = [
    { label: 'People Helped', value: impactMetrics.peopleHelped },
    { label: 'Students Supported', value: impactMetrics.studentsSupported },
    { label: 'Families Supported', value: impactMetrics.familiesSupported },
    { label: 'Madrasas Supported', value: impactMetrics.madrasasSupported },
    { label: 'Masjids Supported', value: impactMetrics.masjidsSupported },
  ];

  const featuredActivities = activities.slice(0, 3);

  return (
    <div className="bg-white">
      {/* 1. Hero & Banner Showcase */}
      <section className="border-b border-[#D9E3DB] bg-gradient-to-b from-[#F7FAF7] to-white py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-5 space-y-6"
            >
              <div className="flex items-center gap-3.5">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#D9E3DB] bg-white p-1 shadow-xs">
                  <Image
                    src={OFFICIAL_IMAGES.logo}
                    alt="Faizul Foundation official emblem"
                    width={56}
                    height={56}
                    priority
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#0E7A21]">
                    {FOUNDATION_NAME}
                  </p>
                  <p className="text-xs text-[#4B594E] mt-0.5">{FOUNDATION_TAGLINE}</p>
                </div>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.2] text-[#131D15]">
                Helping People and{' '}
                <span className="inline-block rounded-md bg-[#FEF08A] px-2 py-0.5">
                  Serving Humanity
                </span>{' '}
                with Care
              </h1>

              <p className="text-base sm:text-lg font-medium leading-relaxed text-[#073B10]">
                {siteContent.missionStatement}
              </p>

              <p className="text-sm sm:text-base leading-relaxed text-[#4B594E]">
                {siteContent.homeIntroduction}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/request-help"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0E7A21] px-6 py-3 text-sm sm:text-base font-semibold text-white hover:bg-[#073B10] transition-colors shadow-xs"
                >
                  <HandHeart className="h-4 w-4" />
                  Request Help
                </Link>
                <Link
                  href="/our-work"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#0E7A21] bg-white px-6 py-3 text-sm sm:text-base font-semibold text-[#0E7A21] hover:bg-[#E6F4E9] transition-colors"
                >
                  Explore Our Work
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <PWAInstallButton variant="hero" />
              </div>

              <div className="flex items-start gap-2.5 border-t border-[#D9E3DB] pt-4 text-xs text-[#4B594E]">
                <ShieldCheck className="h-4 w-4 text-[#0E7A21] shrink-0 mt-0.5" />
                <span>
                  Help requests require no account, are protected with private security rules, and
                  are never displayed publicly.
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="lg:col-span-7"
            >
              <HeroBannerSlider />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. About Us — Founder & CEO */}
      <section aria-label="About Us Founder and CEO" className="border-b border-[#D9E3DB] bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base font-semibold text-[#163A63]">About Us</p>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-snug text-[#0F172A]">
            Faizul Sir is Founder and CEO of{' '}
            <span className="text-[#C91E1E]">Faizul Foundation</span>.
          </h2>
        </div>
      </section>

      {/* 3. Our Mission & Our Vision */}
      <section className="border-b border-[#D9E3DB] bg-[#F7FAF7] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#D9E3DB] bg-white p-7 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6F4E9] text-[#0E7A21]">
                  <Compass className="h-5 w-5" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#131D15]">
                  <span className="inline-block rounded-md bg-[#FEF08A] px-2.5 py-0.5">
                    Our Mission
                  </span>
                </h2>
              </div>
              <p className="mt-4 text-base leading-relaxed text-[#131D15]">
                {siteContent.missionStatement}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#4B594E]">
                {siteContent.aboutWhyCreated}
              </p>
            </div>

            <div className="rounded-2xl border border-[#D9E3DB] bg-white p-7 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDEAEA] text-[#C91E1E]">
                  <Eye className="h-5 w-5" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#131D15]">
                  <span className="inline-block rounded-md bg-[#FEF08A] px-2.5 py-0.5">
                    Our Vision
                  </span>
                </h2>
              </div>
              <p className="mt-4 text-base leading-relaxed text-[#131D15]">
                {siteContent.aboutVision}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#4B594E]">
                {siteContent.aboutCommitment}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Projects & Published Activities */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0E7A21]">
                Projects &amp; Updates
              </p>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#131D15]">
                <span className="inline-block rounded-md bg-[#FEF08A] px-2.5 py-0.5">
                  Planned Projects
                </span>{' '}
                &amp; Updates
              </h2>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-[#4B594E]">
                Every initiative is labeled truthfully. Construction concepts and active plans are
                marked Proposed or Work in Progress and are never presented as completed works.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Link
                href="/projects"
                className="text-sm font-semibold text-[#0E7A21] hover:underline whitespace-nowrap"
              >
                All Projects &rarr;
              </Link>
              <Link
                href="/our-work"
                className="text-sm font-semibold text-[#4B594E] hover:text-[#0E7A21] whitespace-nowrap"
              >
                Published Activities &rarr;
              </Link>
            </div>
          </div>

          {featuredActivities.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {featuredActivities.map((activity) => {
                const leadPhoto = activity.photoUrls[0];
                const isDataUrl = leadPhoto?.startsWith('data:');
                return (
                  <article
                    key={activity.id}
                    className="rounded-2xl border border-[#D9E3DB] bg-white overflow-hidden flex flex-col"
                  >
                    <div className="relative aspect-[16/9] w-full bg-[#F7FAF7] border-b border-[#EAF0EB]">
                      {leadPhoto ? (
                        isDataUrl ? (
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
                        )
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#0E7A21]">
                          <Building2 className="h-10 w-10 opacity-40" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#0E7A21]">
                          {activity.projectStage} · {activity.activityDate}
                        </p>
                        <h3 className="mt-2 font-serif text-lg font-bold text-[#131D15]">
                          {activity.title}
                        </h3>
                        <p className="mt-1 text-xs text-[#4B594E] inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-[#0E7A21]" />
                          {activity.location}
                        </p>
                        <p className="mt-3 text-sm text-[#4B594E] line-clamp-3 leading-relaxed">
                          {activity.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedModalItem({
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

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
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
                    sizes="(max-width: 768px) 100vw, 400px"
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
                    <h3 className="mt-2 font-serif text-lg font-bold text-[#131D15]">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#4B594E] inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#0E7A21]" />
                      {project.location}
                    </p>
                    <p className="mt-3 text-sm text-[#4B594E] leading-relaxed">{project.summary}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedModalItem({
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
          </div>
        </div>
      </section>

      {/* 5. Verified Impact Statistics */}
      <section className="border-y border-[#D9E3DB] bg-[#F7FAF7] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0E7A21]">
                Honest Reporting
              </p>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#131D15]">
                <span className="inline-block rounded-md bg-[#FEF08A] px-2.5 py-0.5">
                  Verified Numbers
                </span>{' '}
                &amp; Updates
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-[#4B594E]">
                Faizul Foundation never publishes estimated or unverified figures. Metrics appear
                only after verification by the foundation administrator.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {impactRows.map((row) => (
              <div
                key={row.label}
                className="rounded-2xl border border-[#D9E3DB] bg-white p-5 flex flex-col justify-between"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-[#4B594E]">
                  {row.label}
                </p>
                <p
                  className={`mt-4 font-mono tabular-nums ${
                    row.value !== null
                      ? 'text-3xl font-bold text-[#0E7A21]'
                      : 'text-sm font-semibold text-[#4B594E]'
                  }`}
                >
                  {row.value !== null ? row.value.toLocaleString('en-IN') : DATA_COMING_SOON_LABEL}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Support Notice & Contact Section */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#D9E3DB] bg-[#FDEAEA]/45 p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 text-[#C91E1E]">
                  <Info className="h-5 w-5 shrink-0" />
                  <p className="text-xs font-semibold uppercase tracking-wider">
                    Support &amp; Donation Status
                  </p>
                </div>
                <h2 className="mt-3 font-serif text-2xl font-bold text-[#131D15]">
                  Donations Are{' '}
                  <span className="inline-block rounded-md bg-[#FEF08A] px-2 py-0.5">
                    Not Open Yet
                  </span>
                </h2>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#131D15]">
                  {siteContent.supportUsMessage}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#4B594E]">
                  We do not accept online payments, QR transfers, or unverified contributions at
                  this stage. Full governance transparency is our priority before opening donations.
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="/support-us"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#C91E1E] hover:underline"
                >
                  Read Full Support Policy
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-[#D9E3DB] bg-[#F7FAF7] p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#0E7A21]">
                  Reach Our Helpline
                </p>
                <h2 className="mt-2 font-serif text-2xl font-bold text-[#131D15]">
                  Contact Faizul Foundation
                </h2>
                <p className="mt-2 text-sm text-[#4B594E]">
                  For help requests, always use our confidential form. For general inquiries, reach
                  us using the verified channels below.
                </p>

                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-[#0E7A21] shrink-0" />
                    <dt className="sr-only">Phone</dt>
                    <dd className="font-mono font-medium text-[#131D15]">
                      {contactConfig.mobileNumber}
                    </dd>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-[#0E7A21] shrink-0" />
                    <dt className="sr-only">Email</dt>
                    <dd className="text-[#131D15] break-all">{contactConfig.emailAddress}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {telHref && (
                  <a
                    href={telHref}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0E7A21] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#073B10] transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    Call Helpline
                  </a>
                )}
                {waHref && (
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#0E7A21] bg-white px-4 py-2.5 text-sm font-semibold text-[#0E7A21] hover:bg-[#E6F4E9] transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                )}
                {mailHref && (
                  <a
                    href={mailHref}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#D9E3DB] bg-white px-4 py-2.5 text-sm font-semibold text-[#131D15] hover:border-[#0E7A21] transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    Email Us
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ActivityDetailModal item={selectedModalItem} onClose={() => setSelectedModalItem(null)} />
    </div>
  );
}
