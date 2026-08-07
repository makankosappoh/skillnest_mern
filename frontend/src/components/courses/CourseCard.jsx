import { Link } from 'react-router-dom';
import StickerCard from '../common/StickerCard.jsx';

// Maps a course's thumbnailColor field to a Tailwind gradient — keeps the
// backend free of styling concerns while giving each card visual variety.
const GRADIENTS = {
  c1: 'from-gold to-[#F7D68A]',
  c2: 'from-teal to-[#F4E27A]',
  c3: 'from-navy to-navySoft',
  c4: 'from-[#E9C9DE] to-[#F7D68A]',
  c5: 'from-[#C9E9D0] to-teal',
  c6: 'from-[#F3C4B0] to-gold',
};

export default function CourseCard({ course }) {
  const gradient = GRADIENTS[course.thumbnailColor] || GRADIENTS.c1;

  return (
    <StickerCard className="overflow-hidden flex flex-col">
      <div className={`h-36 bg-gradient-to-br ${gradient}`} />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span>{course.instructor?.name || 'SkillNest'}</span>
          <span className="text-gold tracking-wide">{'★'.repeat(Math.round(course.rating || 5))}</span>
        </div>
        <h3 className="text-sm font-sora font-semibold leading-snug mb-2 min-h-[40px] line-clamp-2">
          {course.title}
        </h3>
        <p className="text-xs text-navySoft/80 mb-4 line-clamp-2">{course.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <Link to={`/courses/${course._id}`} className="btn-outline !py-1.5 !px-4 !text-xs">
            View Course
          </Link>
          <span className="text-[11px] font-bold text-navySoft">
            {(course.studentsCount || 0).toLocaleString()} enrolled
          </span>
        </div>
      </div>
    </StickerCard>
  );
}
