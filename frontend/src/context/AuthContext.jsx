import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skillnest_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // On first load, if we have a token, re-validate it against /auth/me
  useEffect(() => {
    const token = localStorage.getItem('skillnest_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => {
        setUser(res.data.data);
        localStorage.setItem('skillnest_user', JSON.stringify(res.data.data));
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem('skillnest_token');
        localStorage.removeItem('skillnest_user');
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = (data) => {
    const { token, ...userData } = data;
    localStorage.setItem('skillnest_token', token);
    localStorage.setItem('skillnest_user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    persistSession(res.data.data);
    return res.data.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    persistSession(res.data.data);
    return res.data.data;
  };

  const logout = () => {
    localStorage.removeItem('skillnest_token');
    localStorage.removeItem('skillnest_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
