'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HandHeart, Menu, ShieldCheck, X } from 'lucide-react';
import { FOUNDATION_NAME, OFFICIAL_IMAGES } from '@/lib/foundation-defaults';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/our-work', label: 'Our Work' },
  { href: '/projects', label: 'Projects' },
  { href: '/support-us', label: 'Support Us' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#D9E3DB] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0 group"
          onClick={() => setMobileOpen(false)}
        >
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-[#EAF0EB] bg-white p-0.5">
            <Image
              src={OFFICIAL_IMAGES.logo}
              alt="Faizul Foundation official logo"
              width={44}
              height={44}
              priority
              referrerPolicy="no-referrer"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#131D15] group-hover:text-[#0E7A21] transition-colors whitespace-nowrap">
            {FOUNDATION_NAME}
          </span>
        </Link>

        <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap shrink-0 text-sm font-medium transition-colors py-1 border-b-2 ${
                  active
                    ? 'border-[#0E7A21] text-[#0E7A21]'
                    : 'border-transparent text-[#4B594E] hover:text-[#131D15]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/request-help"
            onClick={() => setMobileOpen(false)}
            className="hidden sm:inline-flex items-center gap-2 whitespace-nowrap shrink-0 rounded-lg bg-[#0E7A21] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#073B10] transition-colors shadow-xs"
          >
            <HandHeart className="h-4 w-4" />
            Request Help
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex lg:hidden items-center justify-center rounded-lg border border-[#D9E3DB] p-2 text-[#131D15] hover:bg-[#F7FAF7] transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[#EAF0EB] bg-white px-4 pb-5 pt-3">
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#E6F4E9] text-[#073B10]'
                      : 'text-[#131D15] hover:bg-[#F7FAF7]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/legal"
              onClick={() => setMobileOpen(false)}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive('/legal')
                  ? 'bg-[#E6F4E9] text-[#073B10]'
                  : 'text-[#4B594E] hover:bg-[#F7FAF7]'
              }`}
            >
              Legal &amp; Policies
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[#4B594E] hover:bg-[#F7FAF7]"
            >
              <ShieldCheck className="h-4 w-4 text-[#0E7A21]" />
              Administrator Portal
            </Link>
          </nav>

          <div className="mt-4 pt-3 border-t border-[#EAF0EB]">
            <Link
              href="/request-help"
              onClick={() => setMobileOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0E7A21] px-4 py-3 text-sm font-semibold text-white hover:bg-[#073B10] transition-colors"
            >
              <HandHeart className="h-4 w-4" />
              Request Help
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
