import { useState } from 'react';
import StickerCard from '../common/StickerCard.jsx';
import Alert from '../common/Alert.jsx';

const CATEGORIES = ['Programming', 'Design', 'Business', 'Data & AI', 'Health', 'Other'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const THUMBS = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];

const emptyForm = {
  title: '', description: '', category: 'Programming', level: 'Beginner',
  price: 0, duration: '4 weeks', instructorName: '', instructorTitle: '',
  thumbnailColor: 'c1', status: 'published',
};

export default function CourseFormModal({ initialData, onClose, onSubmit }) {
  const [form, setForm] = useState(
    initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          category: initialData.category,
          level: initialData.level,
          price: initialData.price,
          duration: initialData.duration || '4 weeks',
          instructorName: initialData.instructor?.name || '',
          instructorTitle: initialData.instructor?.title || '',
          thumbnailColor: initialData.thumbnailColor || 'c1',
          status: initialData.status,
        }
      : emptyForm
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSubmit({
        title: form.title,
        description: form.description,
        category: form.category,
        level: form.level,
        price: Number(form.price),
        duration: form.duration,
        instructor: { name: form.instructorName, title: form.instructorTitle },
        thumbnailColor: form.thumbnailColor,
        status: form.status,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save course.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <StickerCard className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-7">
          <h2 className="text-xl font-bold mb-5">{initialData ? 'Edit Course' : 'Add New Course'}</h2>

          {error && <div className="mb-4"><Alert type="error">{error}</Alert></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="field-label">Title</label>
              <input className="input-field" required value={form.title} onChange={update('title')} />
            </div>

            <div>
              <label className="field-label">Description</label>
              <textarea className="input-field" rows={3} required value={form.description} onChange={update('description')} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="field-label">Category</label>
                <select className="input-field" value={form.category} onChange={update('category')}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Level</label>
                <select className="input-field" value={form.level} onChange={update('level')}>
                  {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="field-label">Price ($)</label>
                <input className="input-field" type="number" min="0" required value={form.price} onChange={update('price')} />
              </div>
              <div>
                <label className="field-label">Duration</label>
                <input className="input-field" value={form.duration} onChange={update('duration')} placeholder="4 weeks" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="field-label">Instructor name</label>
                <input className="input-field" required value={form.instructorName} onChange={update('instructorName')} />
              </div>
              <div>
                <label className="field-label">Instructor title</label>
                <input className="input-field" value={form.instructorTitle} onChange={update('instructorTitle')} placeholder="e.g. Stanford University" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="field-label">Thumbnail color</label>
                <select className="input-field" value={form.thumbnailColor} onChange={update('thumbnailColor')}>
                  {THUMBS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Status</label>
                <select className="input-field" value={form.status} onChange={update('status')}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving...' : initialData ? 'Save Changes' : 'Add Course'}
              </button>
            </div>
          </form>
      </StickerCard>
    </div>
  );
}
