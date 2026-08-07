import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import StickerCard from '../components/common/StickerCard.jsx';
import Loader from '../components/common/Loader.jsx';
import Alert from '../components/common/Alert.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getCourseById } from '../services/courseService.js';
import { enrollInCourse, getMyEnrollments } from '../services/enrollmentService.js';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModule, setOpenModule] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setLoading(true);
    getCourseById(id)
      .then((res) => setCourse(res.data.data))
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user) return;
    getMyEnrollments()
      .then((res) => {
        const enrolled = res.data.data.some((e) => e.course?._id === id);
        setIsEnrolled(enrolled);
      })
      .catch(() => {});
  }, [user, id]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setEnrolling(true);
    setMessage(null);
    try {
      await enrollInCourse(id);
      setIsEnrolled(true);
      setMessage({ type: 'success', text: 'You are enrolled! Find it under "My Learning".' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not enroll right now.' });
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return (<div><Navbar /><Loader label="Loading course..." /><Footer /></div>);
  if (!course) return (<div><Navbar /><div className="max-w-3xl mx-auto px-6 py-20"><Alert type="error">Course not found.</Alert></div><Footer /></div>);

  return (
    <div>
      <Navbar />

      <p className="max-w-6xl mx-auto px-6 md:px-12 pt-6 text-xs text-gray-500">
        Home / Courses / <b className="text-navy">{course.title}</b>
      </p>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-6 grid grid-cols-1 md:grid-cols-[1fr_340px] gap-9 items-start">
        <div>
          <span className="inline-block bg-goldSoft border-2 border-navy px-3.5 py-1 rounded-full text-xs font-bold mb-4">
            {course.category}
          </span>
          <h1 className="text-3xl font-bold leading-tight mb-3 max-w-xl">{course.title}</h1>
          <p className="text-gray-500 text-[15px] max-w-xl mb-5 leading-relaxed">{course.description}</p>

          <div className="flex flex-wrap gap-6 items-center text-[13px] text-navySoft mb-6">
            <span className="text-gold tracking-wide">{'★'.repeat(Math.round(course.rating || 5))}</span>
            <span>{course.rating?.toFixed(1) || '5.0'} ({course.numReviews || 0} reviews)</span>
            <span>{(course.studentsCount || 0).toLocaleString()} students</span>
            <span>{course.level}</span>
            <span>{course.duration}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold to-teal border-2 border-navy" />
            <div>
              <b className="block text-sm">{course.instructor?.name}</b>
              <span className="text-xs text-gray-500">{course.instructor?.title}</span>
            </div>
          </div>
        </div>

        <div className="h-64 border-2 border-navy rounded-2xl bg-gradient-to-br from-navy to-navySoft flex items-center justify-center text-gold font-sora font-bold">
          Course Preview
        </div>
      </section>

      {/* BODY */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pb-16 grid grid-cols-1 md:grid-cols-[1fr_340px] gap-9">
        <div>
          <div className="mb-9">
            <h2 className="text-xl font-bold mb-3">About this course</h2>
            <p className="text-sm text-navySoft leading-relaxed">{course.description}</p>
          </div>

          {course.curriculum?.length > 0 && (
            <div className="mb-9">
              <h2 className="text-xl font-bold mb-3">Curriculum</h2>
              {course.curriculum.map((mod, i) => (
                <div key={mod.title} className="border-2 border-navy rounded-xl mb-3 overflow-hidden bg-creamLight">
                  <button
                    onClick={() => setOpenModule(openModule === i ? -1 : i)}
                    className="w-full flex justify-between items-center px-4.5 py-3.5 font-bold text-sm text-left"
                  >
                    {mod.title} <span className="text-xs text-gray-500">{mod.lessons.length} lessons</span>
                  </button>
                  {openModule === i && (
                    <ul className="px-4.5 pb-3">
                      {mod.lessons.map((l) => (
                        <li key={l.title} className="flex justify-between text-[13px] py-2 border-t border-line text-navySoft">
                          <span>{l.locked ? '🔒 ' : '▶ '}{l.title}</span>
                          <span>{l.duration}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold mb-3">Student Reviews</h2>
            {course.reviews?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {course.reviews.map((r) => (
                  <StickerCard key={r._id} className="p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-teal border-2 border-navy" />
                      <div><b className="block text-sm">{r.name}</b></div>
                    </div>
                    <p className="text-[13px] text-navySoft mb-2">{r.comment}</p>
                    <div className="text-gold tracking-wide">{'★'.repeat(r.rating)}</div>
                  </StickerCard>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No reviews yet — be the first to enroll and leave one.</p>
            )}
          </div>
        </div>

        {/* ENROLL CARD */}
        <StickerCard className="p-6 h-fit sticky top-24">
          <div className="text-3xl font-sora font-extrabold mb-1">
            ${course.price}
          </div>
          <p className="text-xs text-gray-500 mb-5">One-time payment · Lifetime access</p>

          {message && <div className="mb-4"><Alert type={message.type}>{message.text}</Alert></div>}

          <button
            onClick={handleEnroll}
            disabled={enrolling || isEnrolled}
            className="btn-primary w-full mb-3"
          >
            {isEnrolled ? '✓ Enrolled' : enrolling ? 'Enrolling...' : 'Enroll Now'}
          </button>

          <ul className="text-[13px] text-navySoft space-y-3 mt-5">
            <li>▶ {course.duration} of course content</li>
            <li>📄 Downloadable resources</li>
            <li>⏳ Full lifetime access</li>
            <li>🎓 Certificate of completion</li>
          </ul>
        </StickerCard>
      </div>

      <Footer />
    </div>
  );
}
