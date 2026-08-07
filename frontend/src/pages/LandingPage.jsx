import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import StickerCard from '../components/common/StickerCard.jsx';
import CourseCard from '../components/courses/CourseCard.jsx';
import { getCourses } from '../services/courseService.js';

export default function LandingPage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getCourses({ limit: 3, sort: 'popular' })
      .then((res) => setFeatured(res.data.data))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div>
      <Navbar />

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 pt-14 pb-6 grid grid-cols-1 md:grid-cols-[1fr_1.1fr_0.8fr] gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-[42px] font-sora font-bold leading-[1.15] mb-4">
            Boost your skill<br />with experts +
          </h1>
          <p className="text-navySoft/90 text-[15px] max-w-sm mb-6">
            Discover short courses and hands-on workshops taught by real practitioners —
            learn at your pace, anytime.
          </p>
          <Link to="/courses" className="btn-primary inline-block mb-8">Explore Courses</Link>
          <div className="flex items-center gap-5 font-extrabold text-navySoft/80">
            <span className="text-[#8C1515]">Stanford</span>
            <span>·</span>
            <span>ILLINOIS</span>
            <span>·</span>
            <span>Duke</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-[340px] h-[340px] bg-gold rounded-[44%_56%_60%_40%/46%_40%_60%_54%] flex items-center justify-center font-sora font-bold text-navy/50 text-center px-6">
            <img 
              src="https://cdn.vectorstock.com/i/500p/83/86/modern-edtech-future-of-learning-vector-61108386.jpg" 
              alt="Student illustration" 
              className="w-full h-full object-cover" 
              />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div><b className="block text-2xl font-sora">10K</b><span className="text-xs text-navySoft">Successful campaigns</span></div>
          <div><b className="block text-2xl font-sora">90%</b><span className="text-xs text-navySoft">Success rate</span></div>
          <div><b className="block text-2xl font-sora">20K+</b><span className="text-xs text-navySoft">Happy learners</span></div>
          <div><b className="block text-2xl font-sora">100+</b><span className="text-xs text-navySoft">5-star reviews</span></div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 my-10">
        <StickerCard className="grid grid-cols-1 md:grid-cols-3 py-6">
          {[
            { title: 'Best Universities', desc: 'Courses from 160+ globally recognised institutions.' },
            { title: 'Great Materials', desc: 'Curated lessons, projects, and downloadable resources.' },
            { title: 'Professional Courses', desc: 'Industry-relevant certificates that employers value.' },
          ].map((f, i) => (
            <div key={f.title} className={`flex gap-3 px-6 ${i < 2 ? 'md:border-r border-line' : ''}`}>
              <div className="w-9 h-9 border-2 border-navy rounded-lg flex items-center justify-center shrink-0">🎓</div>
              <div>
                <h3 className="text-sm font-sora font-semibold mb-1">{f.title}</h3>
                <p className="text-xs text-navySoft/80">{f.desc}</p>
              </div>
            </div>
          ))}
        </StickerCard>
      </div>

      {/* FEATURED COURSES */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-10">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <h2 className="text-3xl font-bold">Featured Courses</h2>
          <p className="text-sm text-gray-500 max-w-xs">Hand-picked short courses and workshops loved by our learners.</p>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {featured.map((c) => <CourseCard key={c._id} course={c} />)}
          </div>
        ) : (
          <p className="text-sm text-navySoft">
            No courses yet — once the backend is seeded (<code>npm run seed</code>), they'll show up here.
          </p>
        )}

        <div className="text-center mt-10">
          <Link to="/courses" className="btn-outline">Explore all courses</Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-10">
        <h2 className="text-3xl font-bold mb-8">What our learners say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'Adam Smith', role: 'Python Developer', quote: 'Clear explanations and great pacing. The projects actually made things click for me.' },
            { name: 'Maria Wilson', role: 'UX Designer', quote: 'Loved building a real project by the end. Would recommend to any beginner.' },
          ].map((t) => (
            <StickerCard key={t.name} className="p-7 text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-teal border-2 border-navy mx-auto mb-3" />
              <b className="block text-sm">{t.name}</b>
              <span className="text-xs text-gray-500 block mb-3">{t.role}</span>
              <p className="text-sm text-navySoft mb-3">{t.quote}</p>
              <div className="text-gold tracking-wide">★★★★★</div>
            </StickerCard>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
