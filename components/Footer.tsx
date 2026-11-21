'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { buildMailtoHref, buildTelHref, buildWhatsAppHref } from '@/lib/contact-links';
import { FOUNDATION_NAME, FOUNDATION_TAGLINE, OFFICIAL_IMAGES } from '@/lib/foundation-defaults';
import { useFoundation } from './FoundationProvider';
import { PWAInstallButton } from './PWAInstallButton';

export function Footer() {
  const { contactConfig } = useFoundation();
  const telHref = buildTelHref(contactConfig.mobileNumber);
  const waHref = buildWhatsAppHref(contactConfig.whatsappNumber);
  const mailHref = buildMailtoHref(contactConfig.emailAddress);

  return (
    <footer className="border-t border-[#D9E3DB] bg-[#F7FAF7] text-[#131D15]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#D9E3DB] bg-white p-0.5">
                <Image
                  src={OFFICIAL_IMAGES.logo}
                  alt="Faizul Foundation logo"
                  width={48}
                  height={48}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <p className="font-serif text-lg font-bold text-[#131D15]">{FOUNDATION_NAME}</p>
                <p className="text-xs text-[#0E7A21] font-medium">Humanitarian Welfare</p>
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-[#4B594E]">{FOUNDATION_TAGLINE}</p>
            <p className="text-xs leading-relaxed text-[#4B594E]">
              Donations are not being accepted at this time. No statutory registration or tax
              exemption is claimed unless verified details are officially published here.
            </p>
            <PWAInstallButton variant="footer" />
          </div>

          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#131D15]">
              Foundation
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#4B594E]">
              <li>
                <Link href="/" className="hover:text-[#0E7A21] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#0E7A21] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/our-work" className="hover:text-[#0E7A21] transition-colors">
                  Our Work
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[#0E7A21] transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/request-help" className="font-medium text-[#0E7A21] hover:underline">
                  Request Help
                </Link>
              </li>
              <li>
                <Link href="/support-us" className="hover:text-[#0E7A21] transition-colors">
                  Support Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#0E7A21] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#131D15]">
              Legal &amp; Governance
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#4B594E]">
              <li>
                <Link href="/privacy-policy" className="hover:text-[#0E7A21] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-[#0E7A21] transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-[#0E7A21] transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/data-protection" className="hover:text-[#0E7A21] transition-colors">
                  Data Protection Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-[#0E7A21] transition-colors">
                  Cookie &amp; Storage Policy
                </Link>
              </li>
              <li>
                <Link href="/legal" className="hover:text-[#0E7A21] transition-colors">
                  All Legal Documents
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4B594E] hover:text-[#0E7A21] transition-colors"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-[#0E7A21]" />
                  Administrator Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#131D15]">
              Official Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-[#4B594E]">
              <li className="font-medium text-[#131D15]">{contactConfig.contactPerson}</li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-[#0E7A21] mt-0.5 shrink-0" />
                {telHref ? (
                  <a href={telHref} className="hover:text-[#0E7A21] font-mono text-xs sm:text-sm">
                    {contactConfig.mobileNumber}
                  </a>
                ) : (
                  <span>{contactConfig.mobileNumber}</span>
                )}
              </li>
              {waHref && (
                <li className="flex items-start gap-2.5">
                  <MessageCircle className="h-4 w-4 text-[#0E7A21] mt-0.5 shrink-0" />
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#0E7A21]"
                  >
                    WhatsApp Helpline
                  </a>
                </li>
              )}
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-[#0E7A21] mt-0.5 shrink-0" />
                {mailHref ? (
                  <a href={mailHref} className="hover:text-[#0E7A21] break-all">
                    {contactConfig.emailAddress}
                  </a>
                ) : (
                  <span>{contactConfig.emailAddress}</span>
                )}
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#0E7A21] mt-0.5 shrink-0" />
                <span>{contactConfig.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#D9E3DB] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4B594E]">
          <p>&copy; {new Date().getFullYear()} {FOUNDATION_NAME}. All rights reserved.</p>
          <p>
            Confidential help requests are private and never displayed publicly.
          </p>
        </div>
      </div>
    </footer>
  );
}
