import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, HandHeart, Home } from 'lucide-react';
import { OFFICIAL_IMAGES } from '@/lib/foundation-defaults';

export default function NotFound() {
  return (
    <div className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-lg px-4 text-center">
        <div className="mx-auto h-20 w-20 overflow-hidden rounded-2xl border border-[#D9E3DB] bg-white p-1.5 shadow-xs">
          <Image
            src={OFFICIAL_IMAGES.logo}
            alt="Faizul Foundation logo"
            width={80}
            height={80}
            referrerPolicy="no-referrer"
            className="h-full w-full object-contain"
          />
        </div>

        <p className="mt-6 font-mono text-sm font-semibold uppercase tracking-widest text-[#C91E1E]">
          Error 404
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#131D15]">
          Page Not Found
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#4B594E] leading-relaxed">
          The page you are looking for may have moved or does not exist. You can return to the
          Faizul Foundation homepage or submit a confidential help request below.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0E7A21] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#073B10] transition-colors"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>
          <Link
            href="/request-help"
            className="inline-flex items-center gap-2 rounded-lg border border-[#0E7A21] bg-white px-5 py-2.5 text-sm font-semibold text-[#0E7A21] hover:bg-[#E6F4E9] transition-colors"
          >
            <HandHeart className="h-4 w-4" />
            Request Help
          </Link>
        </div>

        <div className="mt-6">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4B594E] hover:text-[#0E7A21]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Contact Helpline
          </Link>
        </div>
      </div>
    </div>
  );
}
