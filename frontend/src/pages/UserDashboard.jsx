import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import StickerCard from '../components/common/StickerCard.jsx';
import Loader from '../components/common/Loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getMyEnrollments } from '../services/enrollmentService.js';

export default function UserDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyEnrollments()
      .then((res) => setEnrollments(res.data.data))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">
        <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-gray-500 mb-8">Here's everything you're currently learning.</p>

        {loading ? (
          <Loader label="Loading your courses..." />
        ) : enrollments.length === 0 ? (
          <StickerCard className="p-10 text-center">
            <p className="text-sm text-navySoft mb-4">You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="btn-primary inline-block">Browse Courses</Link>
          </StickerCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((e) => (
              <StickerCard key={e._id} className="p-5">
                <span className="status-pill bg-goldSoft border-2 border-navy mb-3">{e.status}</span>
                <h3 className="font-sora font-semibold text-sm mb-3 leading-snug">{e.course?.title}</h3>
                <div className="w-full h-2 bg-line rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gold" style={{ width: `${e.progress || 0}%` }} />
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                  <span>{e.progress || 0}% complete</span>
                  <span>${e.course?.price}</span>
                </div>
                <Link to={`/courses/${e.course?._id}`} className="btn-outline w-full !text-xs !py-2 text-center block">
                  Continue Learning
                </Link>
              </StickerCard>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
