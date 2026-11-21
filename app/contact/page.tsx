'use client';

import Link from 'next/link';
import {
  HandHeart,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useFoundation } from '@/components/FoundationProvider';
import { buildMailtoHref, buildTelHref, buildWhatsAppHref, digitsOnly } from '@/lib/contact-links';

export default function ContactPage() {
  const { contactConfig } = useFoundation();

  const telHref = buildTelHref(contactConfig.mobileNumber);
  const waHref = buildWhatsAppHref(contactConfig.whatsappNumber);
  const mailHref = buildMailtoHref(contactConfig.emailAddress);
  const waDigits = digitsOnly(contactConfig.whatsappNumber);

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0E7A21]">
            Official Communication Channels
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#131D15]">
            Contact Faizul Foundation
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#4B594E] leading-relaxed">
            Verified helpline, WhatsApp, email, and office contact details maintained directly by
            the foundation administrator.
          </p>
        </header>

        <section className="rounded-2xl border border-[#D9E3DB] bg-white divide-y divide-[#EAF0EB]">
          <div className="p-5 sm:p-6 flex items-start gap-4">
            <UserCheck className="h-5 w-5 text-[#0E7A21] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#4B594E]">
                Contact Person / Desk
              </p>
              <p className="mt-1 text-base font-medium text-[#131D15]">
                {contactConfig.contactPerson}
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6 flex items-start gap-4">
            <Phone className="h-5 w-5 text-[#0E7A21] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#4B594E]">
                Helpline Mobile Number
              </p>
              <p className="mt-1 font-mono text-base font-semibold text-[#131D15]">
                {contactConfig.mobileNumber}
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6 flex items-start gap-4">
            <MessageCircle className="h-5 w-5 text-[#0E7A21] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#4B594E]">
                WhatsApp Number
              </p>
              <p className="mt-1 font-mono text-base font-semibold text-[#131D15]">
                {waDigits.length >= 10 ? contactConfig.whatsappNumber : 'To be configured by Administrator'}
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6 flex items-start gap-4">
            <Mail className="h-5 w-5 text-[#0E7A21] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#4B594E]">
                Official Email Address
              </p>
              <p className="mt-1 text-base font-medium text-[#131D15] break-all">
                {contactConfig.emailAddress}
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6 flex items-start gap-4">
            <MapPin className="h-5 w-5 text-[#0E7A21] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#4B594E]">
                Office Address
              </p>
              <p className="mt-1 text-base text-[#131D15] whitespace-pre-line">
                {contactConfig.address}
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-wrap gap-3">
          {telHref && (
            <a
              href={telHref}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0E7A21] px-5 py-3 text-sm font-semibold text-white hover:bg-[#073B10] transition-colors"
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
              className="inline-flex items-center gap-2 rounded-lg border border-[#0E7A21] bg-white px-5 py-3 text-sm font-semibold text-[#0E7A21] hover:bg-[#E6F4E9] transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Message on WhatsApp
            </a>
          )}
          {mailHref && (
            <a
              href={mailHref}
              className="inline-flex items-center gap-2 rounded-lg border border-[#D9E3DB] bg-white px-5 py-3 text-sm font-semibold text-[#131D15] hover:border-[#0E7A21] transition-colors"
            >
              <Mail className="h-4 w-4" />
              Send Email
            </a>
          )}
        </section>

        <section className="rounded-2xl border border-[#D9E3DB] bg-[#F7FAF7] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-[#0E7A21] shrink-0 mt-0.5" />
            <div>
              <h2 className="font-serif text-lg font-bold text-[#131D15]">
                Applying for Assistance?
              </h2>
              <p className="mt-1 text-sm text-[#4B594E]">
                Please submit help requests through our confidential Request Help form so you
                receive a private Reference Code (`FF-...`) for tracking.
              </p>
            </div>
          </div>
          <Link
            href="/request-help"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0E7A21] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#073B10] transition-colors shrink-0"
          >
            <HandHeart className="h-4 w-4" />
            Request Help
          </Link>
        </section>
      </div>
    </div>
  );
}
