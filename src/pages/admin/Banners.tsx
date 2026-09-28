import { useState, useRef } from 'react';
import { Plus, Trash2, X, Check, Upload } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useToast } from '../../lib/toast';
import type { Banner } from '../../lib/types';
import SmartImage from '../../components/SmartImage';

export default function Banners() {
  const { banners, addBanner, deleteBanner, uploadImage } = useStore();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bannerType, setBannerType] = useState<'normal' | 'notice' | 'tutorial' | 'submit_tutorial'>('normal');
  const [title, setTitle] = useState('');
  const [noticeText, setNoticeText] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const openAdd = () => {
    setPreviewUrl('');
    setSelectedFile(null);
    setBannerType('normal');
    setTitle('');
    setNoticeText('');
    setShowForm(true);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast('Please select an image file', 'error');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const save = async () => {
    if (saving) return;
    if (!selectedFile) {
      toast('Please select an image', 'error');
      return;
    }
    if (bannerType === 'notice' && !title.trim()) {
      toast('Please add a notice title', 'error');
      return;
    }
    setSaving(true);
    try {
      const path = await uploadImage(selectedFile, 'banners');
      const isSubmitTutorial = bannerType === 'submit_tutorial';
      const tutorialOrders = banners
        .filter((banner) => banner.bannerType === 'tutorial' && (banner.title === '__submit_tutorial__') === isSubmitTutorial)
        .map((banner) => banner.sortOrder);
      const nextTutorialOrder = tutorialOrders.length ? Math.max(...tutorialOrders) + 1 : 0;
      await addBanner(path, {
        bannerType: isSubmitTutorial ? 'tutorial' : bannerType,
        title: isSubmitTutorial ? '__submit_tutorial__' : title.trim(),
        noticeText: noticeText.trim(),
        sortOrder: nextTutorialOrder,
      });
      toast(bannerType === 'notice' ? 'Notice banner added' : isSubmitTutorial ? 'Submit tutorial step added' : bannerType === 'tutorial' ? 'Tutorial step added' : 'Banner added', 'success');
      setShowForm(false);
    } catch {
      toast('Upload failed. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (b: Banner) => {
    if (deletingId) return;
    if (!confirm('Delete this banner?')) return;
    setDeletingId(b.id);
    try {
      await deleteBanner(b.id);
      toast('Banner deleted', 'info');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not delete this banner', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-slate-800">Banners</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          <Plus size={16} /> Add Banner
        </button>
      </div>

      {banners.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-slate-400 shadow-sm">
          No banners. Add one to show on the home carousel.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((b) => (
            <div key={b.id} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
              <SmartImage
                path={b.url}
                alt="Banner"
                className="w-full h-32 rounded-lg overflow-hidden mb-2"
                imgClassName="w-full h-32 object-cover"
              />
              <div className="flex items-center justify-between gap-2 mt-2">
                <span className="text-xs font-medium text-slate-600">
                  {b.bannerType === 'normal' ? 'Home banner' : b.bannerType === 'notice' ? 'Daily notice' : b.title === '__submit_tutorial__' ? `Submit tutorial step ${b.sortOrder + 1}` : `Tutorial step ${b.sortOrder + 1}`}
                </span>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => remove(b)}
                  disabled={deletingId === b.id}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 disabled:opacity-50"
                >
                  {deletingId === b.id
                    ? <span className="w-3 h-3 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
                    : <Trash2 size={12} />}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Add Banner</h3>
              <button onClick={() => setShowForm(false)}>
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-300 rounded-lg py-8 flex flex-col items-center gap-2 text-slate-500 hover:border-blue-400"
            >
              <Upload size={24} />
              <span className="text-sm">Click to select image</span>
            </button>
            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg mt-3 border border-slate-200" />
            )}

            <div className="mt-4">
              <p className="text-sm font-medium text-slate-700 mb-2">Banner type</p>
                <div className="grid grid-cols-2 gap-2">
                 {(['normal', 'notice', 'tutorial', 'submit_tutorial'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setBannerType(t)}
                    className={`py-2.5 rounded-lg text-sm border ${
                      bannerType === t
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                     {t === 'normal' ? 'Home' : t === 'notice' ? 'Daily notice' : t === 'submit_tutorial' ? 'Submit tutorial' : 'Download tutorial'}
                  </button>
                ))}
              </div>
            </div>

            {bannerType === 'notice' && (
              <div className="mt-3 space-y-2">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Notice title"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
                <textarea
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  placeholder="Notice text"
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
                <p className="text-xs text-slate-400">
                  Shown to every user as a pop-up on the home screen. Any image size works.
                </p>
              </div>
            )}
             {bannerType === 'tutorial' && (
               <p className="mt-3 text-xs text-slate-400">
                 This screenshot will be added as the next step in the common wallet-install tutorial.
               </p>
             )}
             {bannerType === 'submit_tutorial' && (
               <p className="mt-3 text-xs text-slate-400">
                 This screenshot appears after Setup Submit and before phone-number entry.
               </p>
             )}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm flex items-center justify-center gap-1 disabled:opacity-50"
              >
                {saving
                  ? <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  : <Check size={16} />}
                {saving ? 'Uploading...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
