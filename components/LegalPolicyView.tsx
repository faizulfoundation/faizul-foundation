'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';
import { OFFICIAL_IMAGES } from '@/lib/foundation-defaults';
import { useFoundation } from './FoundationProvider';

interface LegalPolicyViewProps {
  policyKey: string;
}

export function LegalPolicyView({ policyKey }: LegalPolicyViewProps) {
  const { legalPolicies } = useFoundation();
  const policy = legalPolicies.find((p) => p.policyKey === policyKey);

  if (!policy) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-[#D9E3DB] bg-white p-8 text-center">
          <FileText className="mx-auto h-10 w-10 text-[#0E7A21]" />
          <h1 className="mt-4 font-serif text-2xl font-bold text-[#131D15]">
            Policy Document Not Found
          </h1>
          <p className="mt-2 text-sm text-[#4B594E]">
            The requested legal document could not be located. Please view our complete legal hub.
          </p>
          <Link
            href="/legal"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0E7A21] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#073B10] transition-colors"
          >
            View All Policies
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(policy.updatedAtMillis));

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/legal"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0E7A21] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          All Legal &amp; Policy Pages
        </Link>

        <header className="mt-6 flex items-center gap-4 border-b border-[#D9E3DB] pb-6">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#EAF0EB] bg-white p-1">
            <Image
              src={OFFICIAL_IMAGES.logo}
              alt="Faizul Foundation logo"
              width={56}
              height={56}
              referrerPolicy="no-referrer"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0E7A21]">
              Faizul Foundation Governance
            </p>
            <h1 className="mt-1 font-serif text-3xl font-bold text-[#131D15]">{policy.title}</h1>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-[#4B594E]">
              <Calendar className="h-3.5 w-3.5 text-[#0E7A21]" />
              Last updated: {formattedDate}
            </p>
          </div>
        </header>

        <article className="mt-8 rounded-2xl border border-[#D9E3DB] bg-[#F7FAF7] p-6 sm:p-8">
          <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-[#131D15]">
            {policy.content}
          </div>
        </article>
      </div>
    </div>
  );
}
