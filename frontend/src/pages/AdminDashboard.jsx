import { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import StickerCard from '../components/common/StickerCard.jsx';
import Loader from '../components/common/Loader.jsx';
import Alert from '../components/common/Alert.jsx';
import CourseFormModal from '../components/courses/CourseFormModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../services/courseService.js';
import { getDashboardStats } from '../services/enrollmentService.js';

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      getDashboardStats(),
      getCourses({ limit: 50 }),
    ])
      .then(([statsRes, coursesRes]) => {
        setStats(statsRes.data.data);
        setCourses(coursesRes.data.data);
      })
      .catch(() => setError('Could not load dashboard data.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const handleCreate = async (payload) => {
    await createCourse(payload);
    setModalOpen(false);
    setEditing(null);
    loadData();
  };

  const handleUpdate = async (payload) => {
    await updateCourse(editing._id, payload);
    setModalOpen(false);
    setEditing(null);
    loadData();
  };

  const handleDelete = async (course) => {
    if (!confirm(`Delete "${course.title}"? This cannot be undone.`)) return;
    try {
      await deleteCourse(course._id);
      loadData();
    } catch {
      setError('Could not delete this course.');
    }
  };

  const maxCount = Math.max(1, ...(stats?.monthly?.map((m) => m.count) || [1]));

  if (loading) return (<div><Navbar /><Loader label="Loading dashboard..." /><Footer /></div>);

  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">
        <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-gray-500 mb-8">Here's what's happening with SkillNest today.</p>

        {error && <div className="mb-6"><Alert type="error">{error}</Alert></div>}

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Total Courses', value: stats?.totalCourses ?? 0, icon: '📘' },
            { label: 'Total Students', value: stats?.totalStudents ?? 0, icon: '👥' },
            { label: 'Enrollments', value: stats?.totalEnrollments ?? 0, icon: '✅' },
            { label: 'Revenue', value: `$${(stats?.revenue ?? 0).toLocaleString()}`, icon: '💰' },
          ].map((s) => (
            <StickerCard key={s.label} className="p-5">
              <div className="w-9 h-9 rounded-lg bg-goldSoft border-2 border-navy flex items-center justify-center mb-3">{s.icon}</div>
              <b className="text-2xl font-sora block">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</b>
              <span className="text-xs text-gray-500">{s.label}</span>
            </StickerCard>
          ))}
        </div>

        {/* CHART */}
        <StickerCard className="p-6 mb-8">
          <h3 className="font-sora font-semibold text-sm mb-5">Enrollments (recent months)</h3>
          {stats?.monthly?.length > 0 ? (
            <div className="flex items-end gap-4 h-36">
              {stats.monthly.map((m) => (
                <div key={`${m._id.year}-${m._id.month}`} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div
                    className="w-full bg-gradient-to-b from-gold to-goldSoft border-2 border-navy rounded-t-lg"
                    style={{ height: `${(m.count / maxCount) * 100}%` }}
                  />
                  <span className="text-[11px] text-gray-500 mt-2">{MONTH_NAMES[m._id.month]}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No enrollment data yet.</p>
          )}
        </StickerCard>

        {/* COURSES TABLE */}
        <StickerCard className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-sora font-semibold text-sm">Manage Courses</h3>
            <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-pill">
              + Add New Course
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-gray-500 border-b-2 border-navy">
                  <th className="py-2.5">Title</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5">Price</th>
                  <th className="py-2.5">Enrolled</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c._id} className="border-b border-line">
                    <td className="py-3.5 font-semibold max-w-xs">{c.title}</td>
                    <td className="py-3.5 text-navySoft">{c.category}</td>
                    <td className="py-3.5 text-navySoft">${c.price}</td>
                    <td className="py-3.5 text-navySoft">{c.studentsCount.toLocaleString()}</td>
                    <td className="py-3.5">
                      <span className={`status-pill ${c.status === 'published' ? 'bg-[#DCF3E3] text-[#2E9E5B]' : 'bg-[#F3E7C9] text-[#B8860B]'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditing(c); setModalOpen(true); }}
                          className="w-8 h-8 border-2 border-navy rounded-lg flex items-center justify-center"
                          title="Edit"
                        >✎</button>
                        <button
                          onClick={() => handleDelete(c)}
                          className="w-8 h-8 border-2 border-navy rounded-lg flex items-center justify-center"
                          title="Delete"
                        >🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {courses.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">No courses yet — add your first one above.</p>
            )}
          </div>
        </StickerCard>
      </div>

      {modalOpen && (
        <CourseFormModal
          initialData={editing}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSubmit={editing ? handleUpdate : handleCreate}
        />
      )}

      <Footer />
    </div>
  );
}
