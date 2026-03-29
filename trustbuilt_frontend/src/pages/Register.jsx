import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { register } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.first_name.trim()) errs.first_name = 'First name required';
    if (!form.username.trim())   errs.username   = 'Username required';
    if (!form.email)             errs.email      = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.password)          errs.password   = 'Password required';
    else if (form.password.length < 8) errs.password = 'Min 8 characters';
    if (form.password !== form.password2) errs.password2 = 'Passwords do not match';
    return errs;
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError('');
    try {
      const { data } = await register(form);
      loginUser(data.tokens, data.user);
      navigate('/dashboard');
    } catch (err) {
      console.log('Full error:', err.response?.data);
      const errs = err.response?.data?.errors;
      if (errs) {
        setApiError(Object.values(errs).flat().join(' '));
      } else {
        setApiError(JSON.stringify(err.response?.data) || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 pt-20 pb-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }} className="w-full max-w-lg relative">

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-dark-900 font-bold font-display text-xl">TB</span>
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-400 text-sm">Join Trust Built and grow your brand</p>
        </div>

        <div className="card-dark border-dark-500">
          {apiError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3
                         rounded-xl text-sm mb-6">
              {apiError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Row 1: First + Last name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={handleChange('first_name')}
                  placeholder="John"
                  className={`input-field ${errors.first_name ? 'border-red-500' : ''}`}
                />
                {errors.first_name && <p className="text-red-400 text-xs mt-1">{errors.first_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={handleChange('last_name')}
                  placeholder="Doe"
                  className="input-field"
                />
              </div>
            </div>

            {/* Row 2: Username + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={handleChange('username')}
                  placeholder="johndoe"
                  className={`input-field ${errors.username ? 'border-red-500' : ''}`}
                />
                {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="john@example.com"
                  className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                placeholder="Min 8 characters"
                className={`input-field ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <input
                type="password"
                value={form.password2}
                onChange={handleChange('password2')}
                placeholder="••••••••"
                className={`input-field ${errors.password2 ? 'border-red-500' : ''}`}
              />
              {errors.password2 && <p className="text-red-400 text-xs mt-1">{errors.password2}</p>}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 py-3.5 mt-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}