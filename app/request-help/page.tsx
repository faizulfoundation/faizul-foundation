'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  FileText,
  HandHeart,
  Info,
  Loader2,
  Paperclip,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import {
  HELP_CATEGORIES,
  HelpCategory,
  RequestStatusResult,
} from '@/lib/types';
import {
  getSubmissionCooldownRemainingSec,
  lookupHelpRequestStatus,
  submitHelpRequest,
} from '@/lib/foundation-service';
import { compressFileForFirestore, ProcessedAttachment } from '@/lib/image-compress';

function createChallenge() {
  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 8) + 1;
  return { a, b };
}

function RequestHelpContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get('category');
  const validInitialCategory = HELP_CATEGORIES.find((c) => c === initialCategoryParam);

  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<HelpCategory>(
    validInitialCategory ?? HelpCategory.EDUCATION_SUPPORT
  );
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState<ProcessedAttachment | null>(null);
  const [consentAccepted, setConsentAccepted] = useState(false);

  // Anti-spam math challenge
  const [challenge, setChallenge] = useState({ a: 4, b: 3 });
  const [challengeAnswer, setChallengeAnswer] = useState('');

  // Form states
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{ referenceCode: string; trackingPin: string } | null>(
    null
  );
  const [copiedField, setCopiedField] = useState<'ref' | 'pin' | null>(null);

  // Tracking tab state
  const [trackCode, setTrackCode] = useState('');
  const [trackPin, setTrackPin] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [trackResult, setTrackResult] = useState<RequestStatusResult | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setChallenge(createChallenge());
    });
  }, []);

  useEffect(() => {
    if (validInitialCategory) {
      queueMicrotask(() => {
        setCategory(validInitialCategory);
      });
    }
  }, [validInitialCategory]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setFormError(null);
    setIsProcessingFile(true);
    try {
      const processed = await compressFileForFirestore(file);
      setAttachment(processed);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to attach file.');
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleCopy = async (text: string, field: 'ref' | 'pin') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Clipboard unsupported
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cooldown = getSubmissionCooldownRemainingSec();
    if (cooldown > 0) {
      setFormError(`Please wait ${cooldown} seconds before submitting another request.`);
      return;
    }

    const cleanName = fullName.trim();
    const cleanPhone = mobileNumber.trim();
    const phoneDigits = cleanPhone.replace(/\D+/g, '');
    const cleanLocation = location.trim();
    const cleanDesc = description.trim();

    if (cleanName.length < 2) {
      setFormError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (phoneDigits.length < 10 || cleanPhone.length > 20) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (cleanLocation.length < 3) {
      setFormError('Please enter your Village / City / District.');
      return;
    }
    if (cleanDesc.length < 20) {
      setFormError('Please describe your situation in at least 20 characters so our team can understand your need.');
      return;
    }
    if (!consentAccepted) {
      setFormError('Please review and accept the Privacy Policy before submitting.');
      return;
    }
    if (Number(challengeAnswer.trim()) !== challenge.a + challenge.b) {
      setFormError('Anti-spam check incorrect. Please solve the simple addition question.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitHelpRequest({
        fullName: cleanName,
        mobileNumber: cleanPhone,
        location: cleanLocation,
        category,
        description: cleanDesc,
        attachmentName: attachment?.name ?? null,
        attachmentMimeType: attachment?.mimeType ?? null,
        attachmentDataUrl: attachment?.dataUrl ?? null,
        consentAccepted,
      });

      setReceipt(result);
      setFullName('');
      setMobileNumber('');
      setLocation('');
      setDescription('');
      setAttachment(null);
      setConsentAccepted(false);
      setChallengeAnswer('');
      setChallenge(createChallenge());
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      try {
        const parsed = JSON.parse(raw) as { error?: string };
        setFormError(parsed.error || 'Could not submit your request. Please check your connection and try again.');
      } catch {
        setFormError(raw);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError(null);
    setTrackResult(null);

    const code = trackCode.trim().toUpperCase();
    const pin = trackPin.trim().toUpperCase();

    if (!/^FF-[A-Z0-9]{6,16}$/.test(code)) {
      setTrackError('Please enter a valid Reference Code beginning with FF- (e.g. FF-A1B2C3D4).');
      return;
    }
    if (pin.length < 6) {
      setTrackError('Please enter the Private Verification PIN issued when you submitted your request.');
      return;
    }

    setIsTracking(true);
    try {
      const result = await lookupHelpRequestStatus(code, pin);
      if (!result) {
        setTrackError(
          'No matching request was found for that Reference Code and Verification PIN combination.'
        );
      } else {
        setTrackResult(result);
      }
    } catch {
      setTrackError('Unable to check status right now. Please try again shortly.');
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0E7A21]">
            Confidential Intake Desk
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#131D15]">
            Request Help Privately
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#4B594E] leading-relaxed">
            No account or login is required. Your name, mobile number, location, description, and
            attachments remain strictly private and are never displayed publicly.
          </p>
        </header>

        <div className="flex border-b border-[#D9E3DB] gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('submit')}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'submit'
                ? 'border-[#0E7A21] text-[#0E7A21]'
                : 'border-transparent text-[#4B594E] hover:text-[#131D15]'
            }`}
          >
            Submit Help Request
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('track')}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors inline-flex items-center gap-2 ${
              activeTab === 'track'
                ? 'border-[#0E7A21] text-[#0E7A21]'
                : 'border-transparent text-[#4B594E] hover:text-[#131D15]'
            }`}
          >
            <Search className="h-4 w-4" />
            Check Request Status
          </button>
        </div>

        {activeTab === 'submit' ? (
          receipt ? (
            <section
              aria-live="polite"
              className="rounded-2xl border border-[#0E7A21]/30 bg-[#F7FAF7] p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E6F4E9] text-[#0E7A21]">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#131D15]">
                    Help Request Received
                  </h2>
                  <p className="mt-1 text-sm text-[#4B594E]">
                    Please save both codes below. They are required together to check your request
                    status privately.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[#D9E3DB] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#4B594E]">
                    Reference Code
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="font-mono text-xl font-bold text-[#0E7A21] tracking-wide">
                      {receipt.referenceCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(receipt.referenceCode, 'ref')}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#D9E3DB] px-2.5 py-1.5 text-xs font-medium text-[#131D15] hover:border-[#0E7A21]"
                    >
                      {copiedField === 'ref' ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-[#0E7A21]" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-[#D9E3DB] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#4B594E]">
                    Private Verification PIN
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="font-mono text-xl font-bold text-[#131D15] tracking-widest">
                      {receipt.trackingPin}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(receipt.trackingPin, 'pin')}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#D9E3DB] px-2.5 py-1.5 text-xs font-medium text-[#131D15] hover:border-[#0E7A21]"
                    >
                      {copiedField === 'pin' ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-[#0E7A21]" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#D9E3DB] bg-white p-4 text-sm text-[#4B594E] space-y-1.5">
                <p>
                  <strong className="text-[#131D15]">What happens next:</strong> Your submission is
                  marked <strong>Pending Review</strong> and will be carefully reviewed by the
                  Faizul Foundation team.
                </p>
                <p>
                  Please note that submitting a help request initiates review and verification, and
                  does not guarantee financial or material assistance.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTrackCode(receipt.referenceCode);
                    setTrackPin(receipt.trackingPin);
                    setReceipt(null);
                    setActiveTab('track');
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0E7A21] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#073B10] transition-colors"
                >
                  <Search className="h-4 w-4" />
                  Track This Request
                </button>
                <button
                  type="button"
                  onClick={() => setReceipt(null)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#D9E3DB] bg-white px-5 py-2.5 text-sm font-semibold text-[#131D15] hover:border-[#0E7A21] transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            </section>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-xl border border-[#D9E3DB] bg-[#E6F4E9]/50 p-4 flex items-start gap-3 text-xs sm:text-sm text-[#073B10]">
                <ShieldCheck className="h-5 w-5 text-[#0E7A21] shrink-0 mt-0.5" />
                <span>
                  Your information is encrypted in transit and stored privately so only verified
                  Faizul Foundation administrators can review your request.
                </span>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="rounded-xl border border-[#C91E1E]/40 bg-[#FDEAEA] p-4 flex items-start gap-3 text-sm text-[#5A0B0B]"
                >
                  <AlertCircle className="h-5 w-5 text-[#C91E1E] shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="rounded-2xl border border-[#D9E3DB] bg-white p-6 sm:p-8 space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-semibold text-[#131D15]"
                    >
                      Full Name <span className="text-[#C91E1E]">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      maxLength={120}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="mt-1.5 w-full rounded-lg border border-[#D9E3DB] bg-white px-3.5 py-2.5 text-sm text-[#131D15] focus:border-[#0E7A21] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="mobileNumber"
                      className="block text-sm font-semibold text-[#131D15]"
                    >
                      Mobile Number <span className="text-[#C91E1E]">*</span>
                    </label>
                    <input
                      id="mobileNumber"
                      type="tel"
                      required
                      maxLength={20}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="mt-1.5 w-full rounded-lg border border-[#D9E3DB] bg-white px-3.5 py-2.5 text-sm font-mono text-[#131D15] focus:border-[#0E7A21] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-semibold text-[#131D15]"
                    >
                      Village / City / District <span className="text-[#C91E1E]">*</span>
                    </label>
                    <input
                      id="location"
                      type="text"
                      required
                      maxLength={200}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Village, City, District"
                      className="mt-1.5 w-full rounded-lg border border-[#D9E3DB] bg-white px-3.5 py-2.5 text-sm text-[#131D15] focus:border-[#0E7A21] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-semibold text-[#131D15]"
                    >
                      Help Category <span className="text-[#C91E1E]">*</span>
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as HelpCategory)}
                      className="mt-1.5 w-full rounded-lg border border-[#D9E3DB] bg-white px-3.5 py-2.5 text-sm text-[#131D15] focus:border-[#0E7A21] focus:outline-none"
                    >
                      {HELP_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="description"
                      className="block text-sm font-semibold text-[#131D15]"
                    >
                      Description of the Situation <span className="text-[#C91E1E]">*</span>
                    </label>
                    <span className="font-mono text-xs text-[#4B594E]">
                      {description.trim().length} / 3000 (min 20)
                    </span>
                  </div>
                  <textarea
                    id="description"
                    required
                    rows={5}
                    maxLength={3000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please describe the situation honestly, including specific educational, household, madrasa, or masjid needs."
                    className="mt-1.5 w-full rounded-lg border border-[#D9E3DB] bg-white px-3.5 py-2.5 text-sm text-[#131D15] focus:border-[#0E7A21] focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <span className="block text-sm font-semibold text-[#131D15]">
                    Optional Supporting Photo or Document
                  </span>
                  <p className="mt-1 text-xs text-[#4B594E]">
                    Images are automatically compressed in your browser before secure upload. PDFs
                    up to 140 KB are also accepted.
                  </p>

                  {attachment ? (
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#D9E3DB] bg-[#F7FAF7] p-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        {attachment.mimeType.startsWith('image/') ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={attachment.dataUrl}
                            alt="Selected attachment preview"
                            className="h-12 w-12 rounded-lg object-cover border border-[#D9E3DB] shrink-0"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white border border-[#D9E3DB] text-[#0E7A21] shrink-0">
                            <FileText className="h-5 w-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[#131D15]">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-[#0E7A21]">Ready for private upload</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachment(null)}
                        aria-label="Remove attachment"
                        className="rounded-lg p-2 text-[#C91E1E] hover:bg-[#FDEAEA] transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="mt-2.5 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#0E7A21]/50 bg-[#F7FAF7] px-4 py-2.5 text-sm font-medium text-[#0E7A21] hover:bg-[#E6F4E9] transition-colors">
                      {isProcessingFile ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Optimizing file...
                        </>
                      ) : (
                        <>
                          <Paperclip className="h-4 w-4" />
                          Attach Photo or Document (Optional)
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        disabled={isProcessingFile}
                        className="sr-only"
                      />
                    </label>
                  )}
                </div>

                <div className="rounded-xl border border-[#D9E3DB] bg-[#F7FAF7] p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="antiSpam"
                      className="text-sm font-semibold text-[#131D15]"
                    >
                      Anti-Spam Verification: What is{' '}
                      <span className="font-mono text-[#0E7A21]">
                        {challenge.a} + {challenge.b}
                      </span>
                      ? <span className="text-[#C91E1E]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setChallenge(createChallenge());
                        setChallengeAnswer('');
                      }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#4B594E] hover:text-[#0E7A21]"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      New question
                    </button>
                  </div>
                  <input
                    id="antiSpam"
                    type="number"
                    required
                    inputMode="numeric"
                    value={challengeAnswer}
                    onChange={(e) => setChallengeAnswer(e.target.value)}
                    placeholder="Enter sum"
                    className="w-36 rounded-lg border border-[#D9E3DB] bg-white px-3.5 py-2 text-sm font-mono text-[#131D15] focus:border-[#0E7A21] focus:outline-none"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAccepted}
                    onChange={(e) => setConsentAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-[#D9E3DB] accent-[#0E7A21]"
                  />
                  <span className="text-xs sm:text-sm text-[#4B594E] leading-relaxed">
                    I confirm that the details shared are truthful to the best of my knowledge, I
                    consent to the{' '}
                    <Link
                      href="/privacy-policy"
                      className="font-semibold text-[#0E7A21] hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    , and I understand that submitting a request initiates a confidential review
                    without guaranteeing financial or material assistance.
                  </span>
                </label>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || isProcessingFile}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#0E7A21] px-7 py-3 text-sm sm:text-base font-semibold text-white hover:bg-[#073B10] disabled:opacity-60 transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting Privately...
                      </>
                    ) : (
                      <>
                        <HandHeart className="h-4 w-4" />
                        Submit Confidential Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )
        ) : (
          <section className="space-y-6">
            <div className="rounded-xl border border-[#D9E3DB] bg-[#F7FAF7] p-4 flex items-start gap-3 text-xs sm:text-sm text-[#4B594E]">
              <Info className="h-5 w-5 text-[#0E7A21] shrink-0 mt-0.5" />
              <span>
                To protect applicant privacy, status lookup requires both your{' '}
                <strong>Reference Code (FF-...)</strong> and your{' '}
                <strong>Private Verification PIN</strong>. No personal names, phone numbers, or
                descriptions are ever displayed.
              </span>
            </div>

            <form
              onSubmit={handleTrackSubmit}
              className="rounded-2xl border border-[#D9E3DB] bg-white p-6 sm:p-8 space-y-5"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="trackCode"
                    className="block text-sm font-semibold text-[#131D15]"
                  >
                    Reference Code <span className="text-[#C91E1E]">*</span>
                  </label>
                  <input
                    id="trackCode"
                    type="text"
                    required
                    value={trackCode}
                    onChange={(e) => setTrackCode(e.target.value.toUpperCase())}
                    placeholder="FF-A1B2C3D4"
                    className="mt-1.5 w-full rounded-lg border border-[#D9E3DB] bg-white px-3.5 py-2.5 text-sm font-mono uppercase text-[#131D15] focus:border-[#0E7A21] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="trackPin"
                    className="block text-sm font-semibold text-[#131D15]"
                  >
                    Private Verification PIN <span className="text-[#C91E1E]">*</span>
                  </label>
                  <input
                    id="trackPin"
                    type="text"
                    required
                    value={trackPin}
                    onChange={(e) => setTrackPin(e.target.value.toUpperCase())}
                    placeholder="8-character PIN"
                    className="mt-1.5 w-full rounded-lg border border-[#D9E3DB] bg-white px-3.5 py-2.5 text-sm font-mono uppercase text-[#131D15] focus:border-[#0E7A21] focus:outline-none"
                  />
                </div>
              </div>

              {trackError && (
                <div
                  role="alert"
                  className="rounded-xl border border-[#C91E1E]/40 bg-[#FDEAEA] p-4 flex items-start gap-3 text-sm text-[#5A0B0B]"
                >
                  <AlertCircle className="h-5 w-5 text-[#C91E1E] shrink-0 mt-0.5" />
                  <span>{trackError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isTracking}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0E7A21] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#073B10] disabled:opacity-60 transition-colors"
              >
                {isTracking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Check Status
                  </>
                )}
              </button>
            </form>

            {trackResult && (
              <div className="rounded-2xl border border-[#0E7A21]/30 bg-[#F7FAF7] p-6 sm:p-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9E3DB] pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#4B594E]">
                      Request Reference
                    </p>
                    <p className="mt-1 font-mono text-xl font-bold text-[#131D15]">
                      {trackResult.referenceCode}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#4B594E]">
                      Current Review Status
                    </p>
                    <p className="mt-1 text-lg font-bold text-[#0E7A21]">{trackResult.status}</p>
                  </div>
                </div>

                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-sm">
                  <div>
                    <dt className="text-xs text-[#4B594E]">Help Category</dt>
                    <dd className="mt-1 font-medium text-[#131D15]">{trackResult.category}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#4B594E]">Submitted On</dt>
                    <dd className="mt-1 font-medium text-[#131D15]">
                      {new Date(trackResult.createdAtMillis).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#4B594E]">Last Updated</dt>
                    <dd className="mt-1 font-medium text-[#131D15]">
                      {new Date(trackResult.updatedAtMillis).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default function RequestHelpPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-4 py-16">
          <div className="h-96 rounded-2xl border border-[#D9E3DB] bg-[#F7FAF7] animate-pulse" />
        </div>
      }
    >
      <RequestHelpContent />
    </Suspense>
  );
}
