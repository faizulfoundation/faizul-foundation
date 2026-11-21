'use client';

import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '@/hooks/use-pwa-install';

interface PWAInstallButtonProps {
  variant?: 'footer' | 'hero';
}

export function PWAInstallButton({ variant = 'footer' }: PWAInstallButtonProps) {
  const { canInstall, showIosGuide, closeIosGuide, promptInstall } = usePWAInstall();

  if (!canInstall) return null;

  return (
    <>
      <button
        type="button"
        onClick={promptInstall}
        className={
          variant === 'hero'
            ? 'inline-flex items-center gap-2 rounded-lg border border-[#D9E3DB] bg-white px-4 py-2.5 text-sm font-medium text-[#131D15] hover:border-[#0E7A21] hover:text-[#0E7A21] transition-colors'
            : 'inline-flex items-center gap-2 rounded-lg border border-[#D9E3DB] bg-[#F7FAF7] px-3.5 py-2 text-xs font-medium text-[#131D15] hover:border-[#0E7A21] hover:text-[#0E7A21] transition-colors'
        }
      >
        <Download className="h-4 w-4 text-[#0E7A21]" />
        Install App on Device
      </button>

      {showIosGuide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-install-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="w-full max-w-sm rounded-2xl border border-[#D9E3DB] bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 id="ios-install-title" className="font-serif text-lg font-semibold text-[#131D15]">
                Install Faizul Foundation
              </h3>
              <button
                type="button"
                onClick={closeIosGuide}
                aria-label="Close install instructions"
                className="rounded-lg p-1 text-[#4B594E] hover:bg-[#F1F5F2]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#4B594E]">
              To add Faizul Foundation to your Home Screen on iPhone or iPad:
            </p>
            <ol className="mt-3 space-y-2 text-sm text-[#131D15]">
              <li className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-[#0E7A21]">01</span>
                <span>
                  Tap the <Share className="inline h-4 w-4 mx-0.5 text-[#0E7A21]" /> Share button in Safari.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-[#0E7A21]">02</span>
                <span>Scroll down and select &ldquo;Add to Home Screen&rdquo;.</span>
              </li>
            </ol>
            <button
              type="button"
              onClick={closeIosGuide}
              className="mt-5 w-full rounded-lg bg-[#0E7A21] py-2.5 text-sm font-medium text-white hover:bg-[#073B10] transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}
