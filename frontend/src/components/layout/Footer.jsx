import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-goldSoft mt-20 pt-14 pb-8 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        <div>
          <div className="flex items-center font-sora font-bold text-xl mb-3">
            <span className="badge-logo mr-0.5">Skill</span>Nest
          </div>
          <p className="text-sm text-[#5c5330] leading-relaxed">
            Short courses and workshops that build real, job-ready skills — fast.
          </p>
        </div>
        <div>
          <h4 className="font-sora font-bold text-sm mb-3">Quick Links</h4>
          <Link to="/" className="block text-sm text-[#5c5330] mb-2">Home</Link>
          <Link to="/courses" className="block text-sm text-[#5c5330] mb-2">Courses</Link>
        </div>
        <div>
          <h4 className="font-sora font-bold text-sm mb-3">Account</h4>
          <Link to="/login" className="block text-sm text-[#5c5330] mb-2">Log In</Link>
          <Link to="/register" className="block text-sm text-[#5c5330] mb-2">Sign Up</Link>
        </div>
        <div>
          <h4 className="font-sora font-bold text-sm mb-3">Get in touch</h4>
          <p className="text-sm text-[#5c5330]">contactus@skillnest.com</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto pt-5 border-t border-navy/15 text-center text-xs text-[#5c5330]">
        © {new Date().getFullYear()} SkillNest. All rights reserved.
      </div>
    </footer>
  );
}
