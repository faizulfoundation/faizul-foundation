'use client';

import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Loader2,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { deleteHelpRequest, updateHelpRequestReview } from '@/lib/foundation-service';
import {
  HELP_CATEGORIES,
  HelpCategory,
  HelpRequestRecord,
  REQUEST_STATUSES,
  RequestStatus,
} from '@/lib/types';

interface HelpRequestsManagerProps {
  requests: HelpRequestRecord[];
}

export function HelpRequestsManager({ requests }: HelpRequestsManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | RequestStatus>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | HelpCategory>('All');

  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<RequestStatus>(RequestStatus.PENDING_REVIEW);
  const [editNotes, setEditNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDeleteRef, setConfirmDeleteRef] = useState<HelpRequestRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const selectedRequest = useMemo(
    () => requests.find((r) => r.referenceCode === selectedRef) ?? null,
    [requests, selectedRef]
  );

  const filteredRequests = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return requests.filter((req) => {
      if (statusFilter !== 'All' && req.status !== statusFilter) return false;
      if (categoryFilter !== 'All' && req.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        req.referenceCode.toLowerCase().includes(q) ||
        req.fullName.toLowerCase().includes(q) ||
        req.mobileNumber.toLowerCase().includes(q) ||
        req.location.toLowerCase().includes(q)
      );
    });
  }, [requests, searchTerm, statusFilter, categoryFilter]);

  const openInspector = (req: HelpRequestRecord) => {
    setSelectedRef(req.referenceCode);
    setEditStatus(req.status);
    setEditNotes(req.adminNotes);
    setFeedback(null);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    setIsSaving(true);
    setFeedback(null);
    try {
      await updateHelpRequestReview({
        referenceCode: selectedRequest.referenceCode,
        statusLookupId: selectedRequest.statusLookupId,
        status: editStatus,
        adminNotes: editNotes,
      });
      setFeedback(`Updated ${selectedRequest.referenceCode} to "${editStatus}".`);
    } catch {
      setFeedback('Could not update request review. Please verify admin permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteRef) return;
    setIsDeleting(true);
    try {
      await deleteHelpRequest(confirmDeleteRef.referenceCode, confirmDeleteRef.statusLookupId);
      if (selectedRef === confirmDeleteRef.referenceCode) {
        setSelectedRef(null);
      }
      setConfirmDeleteRef(null);
    } catch {
      setFeedback('Failed to delete request.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#D9E3DB] bg-white p-4 flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-[#4B594E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by FF- reference code, name, phone, or location..."
            className="w-full rounded-lg border border-[#D9E3DB] bg-white pl-9 pr-3 py-2 text-sm text-[#131D15] focus:border-[#0E7A21] focus:outline-none"
          />
        </div>

        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'All' | RequestStatus)}
          className="rounded-lg border border-[#D9E3DB] bg-white px-3 py-2 text-sm text-[#131D15] focus:border-[#0E7A21] focus:outline-none"
        >
          <option value="All">All Statuses</option>
          {REQUEST_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as 'All' | HelpCategory)}
          className="rounded-lg border border-[#D9E3DB] bg-white px-3 py-2 text-sm text-[#131D15] focus:border-[#0E7A21] focus:outline-none"
        >
          <option value="All">All Categories</option>
          {HELP_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="rounded-2xl border border-[#D9E3DB] bg-white p-10 text-center text-sm text-[#4B594E]">
          No help requests match the current filters.
        </div>
      ) : (
        <div className="rounded-2xl border border-[#D9E3DB] bg-white overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#D9E3DB] bg-[#F7FAF7] text-xs uppercase tracking-wider text-[#4B594E]">
              <tr>
                <th className="px-4 py-3 font-semibold">Reference</th>
                <th className="px-4 py-3 font-semibold">Applicant</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Submitted</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAF0EB]">
              {filteredRequests.map((req) => (
                <tr key={req.referenceCode} className="hover:bg-[#F7FAF7]/70">
                  <td className="px-4 py-3 font-mono font-semibold text-[#0E7A21] whitespace-nowrap">
                    {req.referenceCode}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#131D15]">{req.fullName}</p>
                    <p className="text-xs text-[#4B594E]">
                      {req.mobileNumber} · {req.location}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[#4B594E] whitespace-nowrap">{req.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`font-medium ${
                        req.status === RequestStatus.ASSISTED || req.status === RequestStatus.VERIFIED
                          ? 'text-[#0E7A21]'
                          : req.status === RequestStatus.CLOSED
                            ? 'text-[#4B594E]'
                            : 'text-[#C91E1E]'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#4B594E] whitespace-nowrap">
                    {new Date(req.createdAtMillis).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openInspector(req)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#D9E3DB] bg-white px-2.5 py-1.5 text-xs font-medium text-[#131D15] hover:border-[#0E7A21] hover:text-[#0E7A21]"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Review
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteRef(req)}
                        aria-label={`Delete ${req.referenceCode}`}
                        className="rounded-lg border border-[#D9E3DB] p-1.5 text-[#C91E1E] hover:bg-[#FDEAEA]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRequest && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 overflow-y-auto"
          onClick={() => setSelectedRef(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-[#D9E3DB] bg-white overflow-hidden shadow-xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EAF0EB] px-6 py-4">
              <div>
                <p className="font-mono text-xs font-semibold text-[#0E7A21]">
                  {selectedRequest.referenceCode}
                </p>
                <h3 className="font-serif text-xl font-bold text-[#131D15]">
                  {selectedRequest.fullName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRef(null)}
                aria-label="Close review modal"
                className="rounded-lg p-1.5 text-[#4B594E] hover:bg-[#F1F5F2]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto p-6 space-y-5">
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-xl border border-[#EAF0EB] bg-[#F7FAF7] p-4 text-sm">
                <div>
                  <dt className="text-xs text-[#4B594E]">Mobile Number</dt>
                  <dd className="font-mono font-semibold text-[#131D15]">
                    {selectedRequest.mobileNumber}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#4B594E]">Village / City / District</dt>
                  <dd className="font-medium text-[#131D15]">{selectedRequest.location}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#4B594E]">Category</dt>
                  <dd className="font-medium text-[#131D15]">{selectedRequest.category}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#4B594E]">Submitted</dt>
                  <dd className="font-mono text-xs text-[#131D15]">
                    {new Date(selectedRequest.createdAtMillis).toLocaleString('en-IN')}
                  </dd>
                </div>
              </dl>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#4B594E]">
                  Situation Description
                </h4>
                <p className="mt-2 rounded-xl border border-[#EAF0EB] bg-white p-4 text-sm text-[#131D15] whitespace-pre-line leading-relaxed">
                  {selectedRequest.description}
                </p>
              </div>

              {selectedRequest.attachmentDataUrl && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#4B594E]">
                    Private Applicant Attachment ({selectedRequest.attachmentName || 'Attachment'})
                  </h4>
                  <div className="mt-2 rounded-xl border border-[#D9E3DB] bg-[#F7FAF7] p-4">
                    {selectedRequest.attachmentMimeType?.startsWith('image/') ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={selectedRequest.attachmentDataUrl}
                        alt={selectedRequest.attachmentName || 'Applicant attachment'}
                        className="max-h-72 rounded-lg object-contain mx-auto"
                      />
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 text-sm text-[#131D15]">
                          <FileText className="h-4 w-4 text-[#0E7A21]" />
                          {selectedRequest.attachmentName || 'Document.pdf'}
                        </span>
                      </div>
                    )}
                    <div className="mt-3 flex justify-end">
                      <a
                        href={selectedRequest.attachmentDataUrl}
                        download={selectedRequest.attachmentName || `${selectedRequest.referenceCode}_attachment`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9E3DB] bg-white px-3 py-1.5 text-xs font-medium text-[#131D15] hover:border-[#0E7A21]"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download File
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveReview} className="space-y-4 border-t border-[#EAF0EB] pt-5">
                <div>
                  <label
                    htmlFor="adminStatusSelect"
                    className="block text-sm font-semibold text-[#131D15]"
                  >
                    Update Request Status
                  </label>
                  <select
                    id="adminStatusSelect"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as RequestStatus)}
                    className="mt-1.5 w-full rounded-lg border border-[#D9E3DB] bg-white px-3.5 py-2 text-sm text-[#131D15] focus:border-[#0E7A21] focus:outline-none"
                  >
                    {REQUEST_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="adminNotesInput"
                    className="block text-sm font-semibold text-[#131D15]"
                  >
                    Private Administrator Notes (Never Visible to Applicant)
                  </label>
                  <textarea
                    id="adminNotesInput"
                    rows={3}
                    maxLength={2000}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Record verification phone call notes, field visit remarks, etc."
                    className="mt-1.5 w-full rounded-lg border border-[#D9E3DB] bg-white px-3.5 py-2 text-sm text-[#131D15] focus:border-[#0E7A21] focus:outline-none"
                  />
                </div>

                {feedback && (
                  <p className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0E7A21]">
                    <CheckCircle2 className="h-4 w-4" />
                    {feedback}
                  </p>
                )}

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRef(null)}
                    className="rounded-lg border border-[#D9E3DB] px-4 py-2 text-sm font-medium text-[#4B594E]"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0E7A21] px-5 py-2 text-sm font-semibold text-white hover:bg-[#073B10] disabled:opacity-60"
                  >
                    {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteRef && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#D9E3DB] bg-white p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#131D15]">
              Delete Request {confirmDeleteRef.referenceCode}?
            </h3>
            <p className="text-sm text-[#4B594E]">
              This permanently removes the applicant&rsquo;s details, attachment, and tracking
              record from Firestore. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteRef(null)}
                className="rounded-lg border border-[#D9E3DB] px-4 py-2 text-sm font-medium text-[#131D15]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-lg bg-[#C91E1E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5A0B0B] disabled:opacity-60"
              >
                {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
