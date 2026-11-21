'use client';

import Link from 'next/link';
import { ArrowRight, HeartHandshake, Info, ShieldCheck } from 'lucide-react';
import { useFoundation } from '@/components/FoundationProvider';

export default function SupportUsPage() {
  const { siteContent } = useFoundation();

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0E7A21]">
            Transparency &amp; Support Policy
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#131D15]">
            Support Faizul Foundation
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#4B594E] leading-relaxed">
            Official status update regarding financial contributions, accountability, and community
            support.
          </p>
        </header>

        <section className="rounded-2xl border border-[#C91E1E]/30 bg-[#FDEAEA]/60 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#C91E1E] border border-[#C91E1E]/20">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#5A0B0B]">
                Donations Currently Unavailable
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#5A0B0B]">
                {siteContent.supportUsMessage}
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#D9E3DB] bg-white p-6 sm:p-7">
            <div className="flex items-center gap-2.5 text-[#0E7A21]">
              <ShieldCheck className="h-5 w-5" />
              <h2 className="font-serif text-lg font-bold text-[#131D15]">
                Why Donations Are Not Open Yet
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#4B594E]">
              Faizul Foundation is committed to complete accountability before accepting public
              financial contributions. Online payment gateways, QR codes, bank account listings, and
              donation forms are intentionally disabled on this website at this stage.
            </p>
          </div>

          <div className="rounded-2xl border border-[#D9E3DB] bg-[#F7FAF7] p-6 sm:p-7">
            <div className="flex items-center gap-2.5 text-[#0E7A21]">
              <Info className="h-5 w-5" />
              <h2 className="font-serif text-lg font-bold text-[#131D15]">
                Legal &amp; Tax Clarification
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#4B594E]">
              Faizul Foundation does not claim statutory charity registration, government
              recognition, or tax exemption on donations unless verified details are explicitly
              published here by the foundation administrator.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D9E3DB] bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#131D15]">
              Want to Connect or Volunteer Locally?
            </h2>
            <p className="mt-1 text-sm text-[#4B594E]">
              Reach our official helpline or email via the Contact Us page for general inquiries.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0E7A21] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#073B10] transition-colors shrink-0"
          >
            Contact Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
