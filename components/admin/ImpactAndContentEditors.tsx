'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import {
  saveContactConfig,
  saveImpactMetrics,
  saveLegalPolicy,
  saveSiteContent,
} from '@/lib/foundation-service';
import { ContactConfig, ImpactMetrics, LegalPolicy, SiteContent } from '@/lib/types';

export function ImpactEditor({ current }: { current: ImpactMetrics }) {
  const [peopleHelped, setPeopleHelped] = useState(
    current.peopleHelped !== null ? String(current.peopleHelped) : ''
  );
  const [studentsSupported, setStudentsSupported] = useState(
    current.studentsSupported !== null ? String(current.studentsSupported) : ''
  );
  const [familiesSupported, setFamiliesSupported] = useState(
    current.familiesSupported !== null ? String(current.familiesSupported) : ''
  );
  const [madrasasSupported, setMadrasasSupported] = useState(
    current.madrasasSupported !== null ? String(current.madrasasSupported) : ''
  );
  const [masjidsSupported, setMasjidsSupported] = useState(
    current.masjidsSupported !== null ? String(current.masjidsSupported) : ''
  );
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const parseNum = (val: string): number | null => {
    const trimmed = val.trim();
    if (!trimmed) return null;
    const n = Number.parseInt(trimmed, 10);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg(null);
    try {
      await saveImpactMetrics({
        peopleHelped: parseNum(peopleHelped),
        studentsSupported: parseNum(studentsSupported),
        familiesSupported: parseNum(familiesSupported),
        madrasasSupported: parseNum(madrasasSupported),
        masjidsSupported: parseNum(masjidsSupported),
        updatedAtMillis: Date.now(),
      });
      setSavedMsg('Verified impact statistics updated.');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { label: 'People Helped', value: peopleHelped, setter: setPeopleHelped },
    { label: 'Students Supported', value: studentsSupported, setter: setStudentsSupported },
    { label: 'Families Supported', value: familiesSupported, setter: setFamiliesSupported },
    { label: 'Madrasas Supported', value: madrasasSupported, setter: setMadrasasSupported },
    { label: 'Masjids Supported', value: masjidsSupported, setter: setMasjidsSupported },
  ];

  return (
    <form onSubmit={handleSave} className="rounded-2xl border border-[#D9E3DB] bg-white p-6 space-y-5">
      <div>
        <h2 className="font-serif text-xl font-bold text-[#131D15]">Verified Impact Statistics</h2>
        <p className="mt-1 text-xs text-[#4B594E]">
          Leave any field blank to display &ldquo;Data Coming Soon&rdquo; publicly. Only enter
          verified counts.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((f) => (
          <div key={f.label}>
            <label className="block text-sm font-semibold text-[#131D15]">{f.label}</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={f.value}
                onChange={(e) => f.setter(e.target.value)}
                placeholder="Data Coming Soon"
                className="w-full rounded-lg border border-[#D9E3DB] px-3 py-2 text-sm font-mono"
              />
              {f.value !== '' && (
                <button
                  type="button"
                  onClick={() => f.setter('')}
                  className="text-xs text-[#C91E1E] hover:underline shrink-0"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-[#EAF0EB] pt-4">
        {savedMsg ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0E7A21]">
            <CheckCircle2 className="h-4 w-4" />
            {savedMsg}
          </span>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0E7A21] px-5 py-2 text-sm font-semibold text-white hover:bg-[#073B10]"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Impact Statistics
        </button>
      </div>
    </form>
  );
}

export function SiteContentEditor({ current }: { current: SiteContent }) {
  const [form, setForm] = useState<SiteContent>(current);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg(null);
    try {
      await saveSiteContent(form);
      setSavedMsg('Website & Support Us content saved.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="rounded-2xl border border-[#D9E3DB] bg-white p-6 space-y-4">
      <div>
        <h2 className="font-serif text-xl font-bold text-[#131D15]">
          Website &amp; Support Us Content
        </h2>
        <p className="mt-1 text-xs text-[#4B594E]">
          Changes sync immediately to Home, About Us, and Support Us pages.
        </p>
      </div>

      {[
        { key: 'missionStatement', label: 'Mission Statement', rows: 2 },
        { key: 'homeIntroduction', label: 'Home Introduction', rows: 3 },
        { key: 'aboutWhoWeAre', label: 'About Us — Who We Are', rows: 3 },
        { key: 'aboutWhyCreated', label: 'About Us — Why We Were Created', rows: 3 },
        { key: 'aboutVision', label: 'About Us — Our Vision', rows: 3 },
        { key: 'aboutCommitment', label: 'About Us — Commitment & Registration Notice', rows: 4 },
        { key: 'supportUsMessage', label: 'Support Us Notice (Donation Status)', rows: 3 },
      ].map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-semibold text-[#131D15]">{field.label}</label>
          <textarea
            rows={field.rows}
            required
            value={String(form[field.key as keyof SiteContent] ?? '')}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
            }
            className="mt-1 w-full rounded-lg border border-[#D9E3DB] px-3 py-2 text-sm leading-relaxed"
          />
        </div>
      ))}

      <div className="flex items-center justify-between gap-4 border-t border-[#EAF0EB] pt-4">
        {savedMsg ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0E7A21]">
            <CheckCircle2 className="h-4 w-4" />
            {savedMsg}
          </span>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0E7A21] px-5 py-2 text-sm font-semibold text-white hover:bg-[#073B10]"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Content
        </button>
      </div>
    </form>
  );
}

export function ContactAndPoliciesEditor({
  contact,
  policies,
}: {
  contact: ContactConfig;
  policies: LegalPolicy[];
}) {
  const [contactForm, setContactForm] = useState<ContactConfig>(contact);
  const [savingContact, setSavingContact] = useState(false);
  const [contactSaved, setContactSaved] = useState<string | null>(null);

  const [selectedKey, setSelectedKey] = useState(policies[0]?.policyKey || 'privacy_policy');
  const activePolicy = policies.find((p) => p.policyKey === selectedKey) ?? policies[0];
  const [policyTitle, setPolicyTitle] = useState(activePolicy?.title ?? '');
  const [policyContent, setPolicyContent] = useState(activePolicy?.content ?? '');
  const [savingPolicy, setSavingPolicy] = useState(false);
  const [policySaved, setPolicySaved] = useState<string | null>(null);

  const handleSelectPolicy = (key: string) => {
    setSelectedKey(key);
    const found = policies.find((p) => p.policyKey === key);
    if (found) {
      setPolicyTitle(found.title);
      setPolicyContent(found.content);
    }
    setPolicySaved(null);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingContact(true);
    setContactSaved(null);
    try {
      await saveContactConfig(contactForm);
      setContactSaved('Contact details saved.');
    } finally {
      setSavingContact(false);
    }
  };

  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePolicy) return;
    setSavingPolicy(true);
    setPolicySaved(null);
    try {
      await saveLegalPolicy({
        policyKey: activePolicy.policyKey,
        title: policyTitle,
        content: policyContent,
        sortOrder: activePolicy.sortOrder,
        updatedAtMillis: Date.now(),
      });
      setPolicySaved(`${policyTitle} saved.`);
    } finally {
      setSavingPolicy(false);
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSaveContact}
        className="rounded-2xl border border-[#D9E3DB] bg-white p-6 space-y-4"
      >
        <h2 className="font-serif text-xl font-bold text-[#131D15]">Official Contact Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#131D15]">Contact Person</label>
            <input
              type="text"
              required
              value={contactForm.contactPerson}
              onChange={(e) =>
                setContactForm((p) => ({ ...p, contactPerson: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-[#D9E3DB] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#131D15]">Mobile Number</label>
            <input
              type="text"
              required
              value={contactForm.mobileNumber}
              onChange={(e) =>
                setContactForm((p) => ({ ...p, mobileNumber: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-[#D9E3DB] px-3 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#131D15]">WhatsApp Number</label>
            <input
              type="text"
              value={contactForm.whatsappNumber}
              onChange={(e) =>
                setContactForm((p) => ({ ...p, whatsappNumber: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-[#D9E3DB] px-3 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#131D15]">Email Address</label>
            <input
              type="text"
              required
              value={contactForm.emailAddress}
              onChange={(e) =>
                setContactForm((p) => ({ ...p, emailAddress: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-[#D9E3DB] px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#131D15]">Office Address</label>
          <textarea
            rows={2}
            required
            value={contactForm.address}
            onChange={(e) => setContactForm((p) => ({ ...p, address: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-[#D9E3DB] px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-[#EAF0EB] pt-4">
          {contactSaved ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0E7A21]">
              <CheckCircle2 className="h-4 w-4" />
              {contactSaved}
            </span>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={savingContact}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0E7A21] px-5 py-2 text-sm font-semibold text-white hover:bg-[#073B10]"
          >
            {savingContact && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Contact
          </button>
        </div>
      </form>

      <form
        onSubmit={handleSavePolicy}
        className="rounded-2xl border border-[#D9E3DB] bg-white p-6 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-xl font-bold text-[#131D15]">Legal &amp; Policy Pages</h2>
          <select
            aria-label="Select legal policy"
            value={selectedKey}
            onChange={(e) => handleSelectPolicy(e.target.value)}
            className="rounded-lg border border-[#D9E3DB] bg-white px-3 py-2 text-sm"
          >
            {policies.map((p) => (
              <option key={p.policyKey} value={p.policyKey}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#131D15]">Policy Title</label>
          <input
            type="text"
            required
            value={policyTitle}
            onChange={(e) => setPolicyTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#D9E3DB] px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#131D15]">Policy Text</label>
          <textarea
            rows={10}
            required
            value={policyContent}
            onChange={(e) => setPolicyContent(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#D9E3DB] px-3 py-2 text-sm leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-[#EAF0EB] pt-4">
          {policySaved ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0E7A21]">
              <CheckCircle2 className="h-4 w-4" />
              {policySaved}
            </span>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={savingPolicy}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0E7A21] px-5 py-2 text-sm font-semibold text-white hover:bg-[#073B10]"
          >
            {savingPolicy && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Policy
          </button>
        </div>
      </form>
    </div>
  );
}
