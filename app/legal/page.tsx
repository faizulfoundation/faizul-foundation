'use client';

import Link from 'next/link';
import { ChevronRight, FileText, ShieldCheck } from 'lucide-react';
import { useFoundation } from '@/components/FoundationProvider';

const DIRECT_SLUGS: Record<string, string> = {
  privacy_policy: '/privacy-policy',
  terms_and_conditions: '/terms-and-conditions',
  disclaimer: '/disclaimer',
  data_protection: '/data-protection',
  cookie_policy: '/cookie-policy',
  contact_information: '/legal/contact_information',
};

export default function LegalHubPage() {
  const { legalPolicies } = useFoundation();

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0E7A21]">
            Governance &amp; Compliance
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#131D15]">
            Legal &amp; Policy Documents
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#4B594E] leading-relaxed">
            Transparent policies detailing how Faizul Foundation protects applicant privacy,
            handles help requests, and maintains truthful public disclosures.
          </p>
        </header>

        <div className="divide-y divide-[#EAF0EB] rounded-2xl border border-[#D9E3DB] bg-white overflow-hidden">
          {legalPolicies.map((policy) => {
            const href = DIRECT_SLUGS[policy.policyKey] || `/legal/${policy.policyKey}`;
            const updatedStr = new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }).format(new Date(policy.updatedAtMillis));

            return (
              <Link
                key={policy.policyKey}
                href={href}
                className="flex items-center justify-between gap-4 p-5 sm:p-6 hover:bg-[#F7FAF7] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E6F4E9] text-[#0E7A21]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-semibold text-[#131D15]">
                      {policy.title}
                    </h2>
                    <p className="mt-0.5 text-xs text-[#4B594E]">Updated {updatedStr}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-[#4B594E] shrink-0" />
              </Link>
            );
          })}
        </div>

        <div className="rounded-xl border border-[#D9E3DB] bg-[#F7FAF7] p-5 flex items-start gap-3 text-sm text-[#4B594E]">
          <ShieldCheck className="h-5 w-5 text-[#0E7A21] shrink-0 mt-0.5" />
          <p>
            All policy documents can be reviewed and updated by authorized Faizul Foundation
            administrators via the{' '}
            <Link href="/admin" className="font-semibold text-[#0E7A21] hover:underline">
              Administrator Portal
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
