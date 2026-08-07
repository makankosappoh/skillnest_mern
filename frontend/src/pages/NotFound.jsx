import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl font-sora font-extrabold mb-3">404</h1>
      <p className="text-navySoft mb-6">This page doesn't exist — even our best instructors couldn't find it.</p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}
