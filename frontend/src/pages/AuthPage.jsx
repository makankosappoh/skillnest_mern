import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import StickerCard from '../components/common/StickerCard.jsx';
import Alert from '../components/common/Alert.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, user } = useAuth();

  const [tab, setTab] = useState(location.pathname === '/register' ? 'register' : 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTab(location.pathname === '/register' ? 'register' : 'login');
  }, [location.pathname]);

  // Already logged in? bounce straight to the right dashboard
  useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
  }, [user, navigate]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (tab === 'register' && form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      const result =
        tab === 'login'
          ? await login(form.email, form.password)
          : await register(form.name, form.email, form.password);
      navigate(result.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between px-6 md:px-12 py-6">
        <Link to="/" className="flex items-center font-sora font-bold text-xl">
          <span className="badge-logo mr-0.5">Skill</span>Nest
        </Link>
        <Link to="/" className="text-sm font-semibold text-navySoft flex items-center gap-1.5">
          ← Back to home
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-6 pb-16">
        {/* VISUAL SIDE */}
        <div className="hidden md:block">
          <div className="bg-gold rounded-[44%_56%_60%_40%/46%_40%_60%_54%] px-10 py-14">
            <h1 className="text-3xl font-sora font-bold leading-tight mb-3">
              Learn something<br />new every day.
            </h1>
            <p className="text-sm text-[#4B4330] max-w-xs leading-relaxed">
              Join thousands of learners upgrading their skills with expert-led short courses
              and workshops — at your own pace.
            </p>
          </div>
          <div className="flex gap-4 mt-8">
            {[['20K+', 'Active learners'], ['320+', 'Expert courses'], ['4.8★', 'Avg. rating']].map(([n, l]) => (
              <div key={l} className="bg-creamLight border-2 border-navy rounded-xl px-4 py-2.5">
                <b className="block font-sora text-lg">{n}</b>
                <span className="text-xs text-gray-500">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FORM SIDE */}
        <StickerCard className="p-8 md:p-10">
          <div className="flex bg-goldSoft border-2 border-navy rounded-full p-1 mb-7">
            <button
              onClick={() => navigate('/login')}
              className={`flex-1 py-2.5 rounded-full font-sora font-bold text-sm transition-colors ${
                tab === 'login' ? 'bg-navy text-gold' : 'text-navySoft'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/register')}
              className={`flex-1 py-2.5 rounded-full font-sora font-bold text-sm transition-colors ${
                tab === 'register' ? 'bg-navy text-gold' : 'text-navySoft'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && <div className="mb-4"><Alert type="error">{error}</Alert></div>}

          <form onSubmit={handleSubmit}>
            {tab === 'register' && (
              <div className="mb-4">
                <label className="field-label">Full name</label>
                <input className="input-field" type="text" required value={form.name} onChange={update('name')} placeholder="Jane Doe" />
              </div>
            )}

            <div className="mb-4">
              <label className="field-label">Email address</label>
              <input className="input-field" type="email" required value={form.email} onChange={update('email')} placeholder="you@example.com" />
            </div>

            <div className="mb-4">
              <label className="field-label">Password</label>
              <input className="input-field" type="password" required minLength={6} value={form.password} onChange={update('password')} placeholder="••••••••" />
            </div>

            {tab === 'register' && (
              <div className="mb-4">
                <label className="field-label">Confirm password</label>
                <input className="input-field" type="password" required value={form.confirm} onChange={update('confirm')} placeholder="Re-enter password" />
              </div>
            )}

            {tab === 'login' && (
              <div className="flex justify-between items-center text-xs mb-6">
                <label className="flex items-center gap-1.5 text-navySoft"><input type="checkbox" /> Remember me</label>
                <a href="#" className="font-semibold">Forgot password?</a>
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Please wait...' : tab === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-navySoft mt-6">
            {tab === 'login' ? (
              <>New to SkillNest?{' '}
                <button className="font-bold text-navy" onClick={() => navigate('/register')}>Create an account</button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button className="font-bold text-navy" onClick={() => navigate('/login')}>Log in</button>
              </>
            )}
          </p>
        </StickerCard>
      </div>
    </div>
  );
}
