'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Compass,
  Eye,
  HandHeart,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react';
import { useFoundation } from '@/components/FoundationProvider';
import { CORE_VALUES, FOUNDATION_TAGLINE, OFFICIAL_IMAGES } from '@/lib/foundation-defaults';

export default function AboutPage() {
  const { siteContent } = useFoundation();

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        <header className="flex flex-col sm:flex-row sm:items-center gap-6 border-b border-[#D9E3DB] pb-8">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#D9E3DB] bg-white p-1.5 shadow-xs">
            <Image
              src={OFFICIAL_IMAGES.logo}
              alt="Faizul Foundation official logo"
              width={80}
              height={80}
              referrerPolicy="no-referrer"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0E7A21]">
              About Faizul Foundation
            </p>
            <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-[#131D15]">
              <span className="inline-block rounded-md bg-[#FEF08A] px-2.5 py-0.5">
                Who We Are
              </span>{' '}
              &amp; Why We Serve
            </h1>
            <p className="mt-2 text-sm text-[#4B594E]">{FOUNDATION_TAGLINE}</p>
          </div>
        </header>

        <section
          aria-label="About Us Founder and CEO"
          className="bg-white py-4 sm:py-6 text-center"
        >
          <p className="text-sm sm:text-base font-semibold text-[#163A63]">About Us</p>
          <h2 className="mt-2 mx-auto max-w-2xl text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-snug text-[#0F172A]">
            Faizul Sir is Founder and CEO of{' '}
            <span className="text-[#C91E1E]">Faizul Foundation</span>.
          </h2>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-[#D9E3DB] bg-white p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6F4E9] text-[#0E7A21]">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#131D15]">Who We Are</h2>
            </div>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#4B594E]">
              {siteContent.aboutWhoWeAre}
            </p>
          </article>

          <article className="rounded-2xl border border-[#D9E3DB] bg-white p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDEAEA] text-[#C91E1E]">
                <Lightbulb className="h-5 w-5" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#131D15]">Why We Were Created</h2>
            </div>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#4B594E]">
              {siteContent.aboutWhyCreated}
            </p>
          </article>

          <article className="rounded-2xl border border-[#D9E3DB] bg-[#F7FAF7] p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#D9E3DB] text-[#0E7A21]">
                <Compass className="h-5 w-5" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#131D15]">Our Mission</h2>
            </div>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#131D15]">
              {siteContent.missionStatement}
            </p>
          </article>

          <article className="rounded-2xl border border-[#D9E3DB] bg-[#F7FAF7] p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#D9E3DB] text-[#0E7A21]">
                <Eye className="h-5 w-5" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#131D15]">Our Vision</h2>
            </div>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#131D15]">
              {siteContent.aboutVision}
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-[#0E7A21]/30 bg-[#E6F4E9]/60 p-7 sm:p-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-[#0E7A21] shrink-0" />
            <h2 className="font-serif text-2xl font-bold text-[#073B10]">
              <span className="inline-block rounded-md bg-[#FEF08A] px-2.5 py-0.5 text-[#131D15]">
                Our Promise
              </span>{' '}
              &amp; Transparency Notice
            </h2>
          </div>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#073B10]">
            {siteContent.aboutCommitment}
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-[#131D15]">
            <span className="inline-block rounded-md bg-[#FEF08A] px-2.5 py-0.5">
              Our Core Values
            </span>
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_VALUES.map((val, idx) => (
              <div key={val.title} className="rounded-2xl border border-[#D9E3DB] bg-white p-5">
                <p className="font-mono text-xs font-semibold text-[#0E7A21]">
                  0{idx + 1}
                </p>
                <h3 className="mt-2 font-serif text-lg font-semibold text-[#131D15]">
                  {val.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B594E]">{val.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-2xl border border-[#D9E3DB] bg-[#F7FAF7] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#131D15]">
              Need Confidential Support?
            </h2>
            <p className="mt-1 text-sm text-[#4B594E]">
              Reach our team privately without creating an account.
            </p>
          </div>
          <Link
            href="/request-help"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0E7A21] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#073B10] transition-colors shrink-0"
          >
            <HandHeart className="h-4 w-4" />
            Request Help
          </Link>
        </div>
      </div>
    </div>
  );
}
