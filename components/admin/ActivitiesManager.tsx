'use client';

import { useState } from 'react';
import {
  Calendar,
  Edit3,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { deleteActivity, saveActivity } from '@/lib/foundation-service';
import { compressFileForFirestore } from '@/lib/image-compress';
import { FoundationActivity, PROJECT_STAGES, ProjectStage } from '@/lib/types';

interface ActivitiesManagerProps {
  activities: FoundationActivity[];
}

export function ActivitiesManager({ activities }: ActivitiesManagerProps) {
  const [editingActivity, setEditingActivity] = useState<FoundationActivity | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [location, setLocation] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [projectStage, setProjectStage] = useState<ProjectStage>(ProjectStage.COMPLETED);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<FoundationActivity | null>(null);

  const openCreate = () => {
    setEditingActivity(null);
    setTitle('');
    setDescription('');
    setActivityDate('');
    setLocation('');
    setIsPublished(true);
    setProjectStage(ProjectStage.COMPLETED);
    setPhotoUrls([]);
    setError(null);
    setShowEditor(true);
  };

  const openEdit = (act: FoundationActivity) => {
    setEditingActivity(act);
    setTitle(act.title);
    setDescription(act.description);
    setActivityDate(act.activityDate);
    setLocation(act.location);
    setIsPublished(act.isPublished);
    setProjectStage(act.projectStage);
    setPhotoUrls(act.photoUrls);
    setError(null);
    setShowEditor(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;

    const remainingSlots = 5 - photoUrls.length;
    if (remainingSlots <= 0) {
      setError('Maximum 5 photos per activity.');
      return;
    }

    setError(null);
    setIsUploading(true);
    try {
      const processed: string[] = [];
      for (const file of files.slice(0, remainingSlots)) {
        if (!file.type.startsWith('image/')) {
          throw new Error('Only image files are supported for activity photos.');
        }
        const res = await compressFileForFirestore(file);
        processed.push(res.dataUrl);
      }
      setPhotoUrls((prev) => [...prev, ...processed].slice(0, 5));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to process image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 2 || description.trim().length < 5) {
      setError('Please enter a valid title and description.');
      return;
    }
    if (activityDate.trim().length < 2 || location.trim().length < 2) {
      setError('Please enter both activity date and location.');
      return;
    }

    setIsSaving(true);
    try {
      await saveActivity({
        id: editingActivity?.id,
        title,
        description,
        activityDate,
        location,
        photoUrls,
        isPublished,
        projectStage,
      });
      setShowEditor(false);
    } catch {
      setError('Failed to save activity. Verify your admin sign-in.');
    } finally {
      setIsSaving(false);
    }
  };

  const togglePublish = async (act: FoundationActivity) => {
    await saveActivity({
      id: act.id,
      title: act.title,
      description: act.description,
      activityDate: act.activityDate,
      location: act.location,
      photoUrls: act.photoUrls,
      isPublished: !act.isPublished,
      projectStage: act.projectStage,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#131D15]">
            Activities &amp; Projects ({activities.length})
          </h2>
          <p className="text-xs text-[#4B594E]">
            Add, edit, publish/unpublish, and label projects accurately (up to 5 photos each).
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0E7A21] px-4 py-2 text-sm font-semibold text-white hover:bg-[#073B10]"
        >
          <Plus className="h-4 w-4" />
          Add Activity
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-2xl border border-[#D9E3DB] bg-white p-10 text-center text-sm text-[#4B594E]">
          No activities recorded yet. Click &ldquo;Add Activity&rdquo; to publish verified work.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {activities.map((act) => (
            <div
              key={act.id}
              className="rounded-2xl border border-[#D9E3DB] bg-white p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold uppercase tracking-wider text-[#0E7A21]">
                    {act.projectStage} · {act.isPublished ? 'Published' : 'Draft (Hidden)'}
                  </span>
                  <span className="font-mono text-[#4B594E]">{act.photoUrls.length}/5 photos</span>
                </div>
                <h3 className="mt-2 font-serif text-lg font-bold text-[#131D15]">{act.title}</h3>
                <div className="mt-1 flex flex-wrap gap-3 text-xs text-[#4B594E]">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-[#0E7A21]" />
                    {act.activityDate}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-[#0E7A21]" />
                    {act.location}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#4B594E] line-clamp-3">{act.description}</p>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#EAF0EB] pt-3">
                <button
                  type="button"
                  onClick={() => togglePublish(act)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9E3DB] px-3 py-1.5 text-xs font-medium text-[#131D15] hover:border-[#0E7A21]"
                >
                  {act.isPublished ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5 text-[#0E7A21]" />
                      Publish
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(act)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9E3DB] px-3 py-1.5 text-xs font-medium text-[#131D15] hover:border-[#0E7A21]"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(act)}
                  aria-label={`Delete ${act.title}`}
                  className="rounded-lg border border-[#D9E3DB] p-1.5 text-[#C91E1E] hover:bg-[#FDEAEA]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEditor && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 overflow-y-auto"
        >
          <div className="w-full max-w-xl rounded-2xl border border-[#D9E3DB] bg-white overflow-hidden shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-[#EAF0EB] px-6 py-4">
              <h3 className="font-serif text-xl font-bold text-[#131D15]">
                {editingActivity ? 'Edit Activity' : 'Add Foundation Activity'}
              </h3>
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="rounded-lg p-1.5 text-[#4B594E] hover:bg-[#F1F5F2]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="max-h-[75vh] overflow-y-auto p-6 space-y-4">
              {error && (
                <div className="rounded-lg border border-[#C91E1E]/30 bg-[#FDEAEA] p-3 text-xs text-[#5A0B0B]">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#131D15]">Title</label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#D9E3DB] px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#131D15]">Activity Date</label>
                  <input
                    type="text"
                    required
                    maxLength={80}
                    placeholder="e.g., 20 Nov 2026"
                    value={activityDate}
                    onChange={(e) => setActivityDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#D9E3DB] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#131D15]">Location</label>
                  <input
                    type="text"
                    required
                    maxLength={200}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#D9E3DB] px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#131D15]">Project Stage</label>
                  <select
                    value={projectStage}
                    onChange={(e) => setProjectStage(e.target.value as ProjectStage)}
                    className="mt-1 w-full rounded-lg border border-[#D9E3DB] px-3 py-2 text-sm bg-white"
                  >
                    {PROJECT_STAGES.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-2.5 pt-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-4 w-4 accent-[#0E7A21]"
                  />
                  <span className="text-sm font-medium text-[#131D15]">
                    Published publicly
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#131D15]">Description</label>
                <textarea
                  rows={4}
                  required
                  maxLength={4000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#D9E3DB] px-3 py-2 text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#131D15]">
                    Photos ({photoUrls.length}/5)
                  </span>
                  {photoUrls.length < 5 && (
                    <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#0E7A21] hover:underline">
                      {isUploading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ImagePlus className="h-3.5 w-3.5" />
                      )}
                      Upload Image(s)
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={isUploading}
                        onChange={handlePhotoUpload}
                        className="sr-only"
                      />
                    </label>
                  )}
                </div>

                {photoUrls.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {photoUrls.map((url, idx) => (
                      <div
                        key={`${url.slice(0, 24)}-${idx}`}
                        className="relative aspect-video rounded-lg border border-[#D9E3DB] overflow-hidden bg-[#F7FAF7]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Photo ${idx + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setPhotoUrls((prev) => prev.filter((_, i) => i !== idx))
                          }
                          aria-label="Remove photo"
                          className="absolute right-1 top-1 rounded-full bg-black/65 p-1 text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t border-[#EAF0EB] pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="rounded-lg border border-[#D9E3DB] px-4 py-2 text-sm font-medium text-[#4B594E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0E7A21] px-5 py-2 text-sm font-semibold text-white hover:bg-[#073B10] disabled:opacity-60"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#D9E3DB] bg-white p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#131D15]">
              Delete &ldquo;{confirmDelete.title}&rdquo;?
            </h3>
            <p className="text-sm text-[#4B594E]">
              This permanently removes this activity from Firestore.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="rounded-lg border border-[#D9E3DB] px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteActivity(confirmDelete.id);
                  setConfirmDelete(null);
                }}
                className="rounded-lg bg-[#C91E1E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5A0B0B]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
