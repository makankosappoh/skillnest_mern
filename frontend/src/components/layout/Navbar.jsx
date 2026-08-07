import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold ${isActive ? 'text-navy border-b-2 border-gold' : 'text-navySoft'}`;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-creamLight border-b-2 border-navy sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center font-sora font-bold text-xl">
          <span className="badge-logo mr-0.5">Skill</span>Nest
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/courses" className={linkClass}>Courses</NavLink>
          {user && <NavLink to="/dashboard" className={linkClass}>My Learning</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
        </nav>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="btn-outline">Log In</Link>
              <Link to="/register" className="btn-pill">Sign Up</Link>
            </>
          ) : (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm font-semibold">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-teal border-2 border-navy" />
                {user.name?.split(' ')[0]}
              </div>
              <button onClick={handleLogout} className="btn-outline">Log Out</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
