import { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import StickerCard from '../components/common/StickerCard.jsx';
import CourseCard from '../components/courses/CourseCard.jsx';
import Loader from '../components/common/Loader.jsx';
import { getCourses } from '../services/courseService.js';

const CATEGORIES = ['Programming', 'Design', 'Business', 'Data & AI', 'Health'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function CourseListing() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);

  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    getCourses({ keyword, category, level, sort, page, limit: 9 })
      .then((res) => {
        setCourses(res.data.data);
        setPages(res.data.pagination.pages);
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [keyword, category, level, sort, page]);

  const clearFilters = () => {
    setCategory('');
    setLevel('');
    setKeyword('');
    setSort('');
    setPage(1);
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-10">
        <p className="text-xs text-gray-500 mb-2">Home / <b className="text-navy">Courses</b></p>
        <h1 className="text-3xl font-bold mb-2">Explore Courses</h1>
        <p className="text-sm text-gray-500">320+ short courses and workshops taught by industry experts and top universities.</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-8 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 items-start">
        {/* FILTERS */}
        <StickerCard className="p-5">
          <h3 className="font-sora font-semibold text-sm mb-4">Filters</h3>

          <div className="mb-6">
            <h4 className="text-[11px] uppercase tracking-wide text-gray-500 mb-2.5">Category</h4>
            {CATEGORIES.map((c) => (
              <label key={c} className="flex items-center gap-2 text-[13px] text-navySoft mb-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={category === c}
                  onChange={() => { setCategory(c); setPage(1); }}
                />
                {c}
              </label>
            ))}
          </div>

          <div className="mb-6">
            <h4 className="text-[11px] uppercase tracking-wide text-gray-500 mb-2.5">Level</h4>
            <label className="flex items-center gap-2 text-[13px] text-navySoft mb-2 cursor-pointer">
              <input type="radio" name="level" checked={level === ''} onChange={() => { setLevel(''); setPage(1); }} /> All levels
            </label>
            {LEVELS.map((l) => (
              <label key={l} className="flex items-center gap-2 text-[13px] text-navySoft mb-2 cursor-pointer">
                <input type="radio" name="level" checked={level === l} onChange={() => { setLevel(l); setPage(1); }} />
                {l}
              </label>
            ))}
          </div>

          <button onClick={clearFilters} className="btn-outline w-full !py-2.5 !text-xs">Clear all filters</button>
        </StickerCard>

        {/* MAIN */}
        <div>
          <div className="flex flex-wrap gap-4 justify-between mb-6">
            <div className="flex items-center gap-2 bg-creamLight border-2 border-navy rounded-full px-4 py-2 flex-1 min-w-[220px]">
              <span>🔍</span>
              <input
                className="bg-transparent outline-none text-sm w-full"
                placeholder="Search courses, instructors, topics..."
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
              />
            </div>
            <select
              className="border-2 border-navy rounded-full px-4 py-2 text-xs font-semibold bg-creamLight"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort by: Newest</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <Loader label="Loading courses..." />
          ) : courses.length === 0 ? (
            <p className="text-sm text-navySoft py-10 text-center">
              No courses match these filters yet — try clearing them, or seed the database with <code>npm run seed</code>.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((c) => <CourseCard key={c._id} course={c} />)}
              </div>

              {pages > 1 && (
                <div className="flex justify-center gap-2.5 mt-11">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 border-2 border-navy rounded-lg font-bold ${
                        p === page ? 'bg-navy text-gold' : 'bg-creamLight'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
