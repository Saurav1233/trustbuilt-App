import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login, getProfile } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password too short';
    return errs;
  };

  const handleChange = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError('');
    try {
      // Step 1: Get tokens
      const { data } = await login({ email: form.email, password: form.password });
  
      // Step 2: Save tokens
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
  
      // Step 3: Fetch full profile (includes is_staff)
      const profileRes = await getProfile();
  
      // Step 4: Set user in context
      loginUser({ access: data.access, refresh: data.refresh }, profileRes.data);
  
      // Step 5: Redirect based on role
      if (profileRes.data.is_staff) {
        navigate('/admin-panel');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      const status = err.response?.status;
      const detail = err.response?.data?.detail || '';
    
      if (status === 401 || detail.toLowerCase().includes('no active account')) {
        setApiError('❌ Incorrect email or password. Please try again.');
      } else if (status === 400) {
        setApiError('❌ Invalid credentials. Please check your email and password.');
      } else if (status === 500) {
        setApiError('⚠️ Server error. Please try again in a moment.');
      } else if (!err.response) {
        setApiError('⚠️ Network error. Please check your connection.');
      } else {
        setApiError('❌ Incorrect email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 pt-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }} className="w-full max-w-md relative">

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-dark-900 font-bold font-display text-xl">TB</span>
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Sign in to your Trust Built account</p>
        </div>

        <div className="card-dark border-dark-500">
          {apiError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-6">
              {apiError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@example.com"
                autoComplete="off"
                className={`input-field ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                placeholder="••••••••"
                autoComplete="new-password"
                className={`input-field ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 py-3.5">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}