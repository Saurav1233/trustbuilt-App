import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { register } from '../api/auth';
import { useAuth } from '../context/AuthContext';

// ── Password rules ────────────────────────────────────────────────────────────
const PASSWORD_RULES = [
  { id: 'length',    label: 'At least 8 characters',        test: (p) => p.length >= 8 },
  { id: 'uppercase', label: 'At least 1 uppercase letter',  test: (p) => /[A-Z]/.test(p) },
  { id: 'lowercase', label: 'At least 1 lowercase letter',  test: (p) => /[a-z]/.test(p) },
  { id: 'number',    label: 'At least 1 number',            test: (p) => /[0-9]/.test(p) },
  { id: 'special',   label: 'At least 1 special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function getStrength(password) {
  const passed = PASSWORD_RULES.filter(r => r.test(password)).length;
  if (passed === 0) return { score: 0, label: '',          color: '' };
  if (passed <= 2)  return { score: 1, label: 'Weak',      color: 'bg-red-500' };
  if (passed === 3) return { score: 2, label: 'Fair',      color: 'bg-yellow-500' };
  if (passed === 4) return { score: 3, label: 'Good',      color: 'bg-blue-500' };
  return             { score: 4, label: 'Strong',    color: 'bg-green-500' };
}

export default function Register() {
  const [form, setForm] = useState({
    first_name: '', last_name: '', username: '', email: '', password: '', password2: '',
  });
  const [errors,       setErrors]       = useState({});
  const [loading,      setLoading]      = useState(false);
  const [apiError,     setApiError]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [pwFocused,    setPwFocused]    = useState(false);

  const { loginUser } = useAuth();
  const navigate      = useNavigate();

  // Live password analysis
  const strength   = useMemo(() => getStrength(form.password), [form.password]);
  const rulesPassed = useMemo(() =>
    PASSWORD_RULES.map(r => ({ ...r, passed: r.test(form.password) })),
    [form.password]
  );

  const validate = () => {
    const errs = {};
    if (!form.first_name.trim()) errs.first_name = 'First name is required.';
    if (!form.username.trim())   errs.username   = 'Username is required.';
    if (!form.email)             errs.email      = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                 errs.email      = 'Enter a valid email address.';
    if (!form.password)          errs.password   = 'Password is required.';
    else {
      const failedRules = PASSWORD_RULES.filter(r => !r.test(form.password));
      if (failedRules.length > 0)
        errs.password = `Password must meet all requirements below.`;
    }
    if (!form.password2)
                                 errs.password2  = 'Please confirm your password.';
    else if (form.password !== form.password2)
                                 errs.password2  = 'Passwords do not match.';
    return errs;
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    setApiError('');
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
      const serverErrs = err.response?.data?.errors;
      if (serverErrs) {
        setApiError(Object.values(serverErrs).flat().join(' '));
      } else {
        setApiError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Eye toggle button
  const EyeIcon = ({ show }) => show ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 pt-20 pb-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }} className="w-full max-w-lg relative">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-dark-900 font-bold font-display text-xl">TB</span>
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-400 text-sm">Join Trust Built and grow your brand</p>
        </div>

        <div className="card-dark border-dark-500">
          {/* API Error */}
          <AnimatePresence>
            {apiError && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3
                           rounded-xl text-sm mb-6">
                {apiError}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">

            {/* Row 1: First + Last name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name <span className="text-gold-400">*</span>
                </label>
                <input type="text" value={form.first_name}
                  onChange={handleChange('first_name')} placeholder="John"
                  className={`input-field ${errors.first_name ? 'border-red-500' : ''}`} />
                {errors.first_name && <p className="text-red-400 text-xs mt-1">{errors.first_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                <input type="text" value={form.last_name}
                  onChange={handleChange('last_name')} placeholder="Doe"
                  className="input-field" />
              </div>
            </div>

            {/* Row 2: Username + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username <span className="text-gold-400">*</span>
                </label>
                <input type="text" value={form.username}
                  onChange={handleChange('username')} placeholder="johndoe"
                  className={`input-field ${errors.username ? 'border-red-500' : ''}`} />
                {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email <span className="text-gold-400">*</span>
                </label>
                <input type="email" value={form.email}
                  onChange={handleChange('email')} placeholder="john@example.com"
                  className={`input-field ${errors.email ? 'border-red-500' : ''}`} />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password <span className="text-gold-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange('password')}
                  onFocus={() => setPwFocused(true)}
                  onBlur={() => setPwFocused(false)}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  className={`input-field pr-10 ${errors.password ? 'border-red-500' : ''}`}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  <EyeIcon show={showPassword} />
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}

              {/* Strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300
                          ${strength.score >= i ? strength.color : 'bg-dark-600'}`} />
                    ))}
                  </div>
                  {strength.label && (
                    <p className={`text-xs font-medium ${
                      strength.score === 1 ? 'text-red-400' :
                      strength.score === 2 ? 'text-yellow-400' :
                      strength.score === 3 ? 'text-blue-400' : 'text-green-400'
                    }`}>
                      Password strength: {strength.label}
                    </p>
                  )}
                </div>
              )}

              {/* Password rules checklist */}
              <AnimatePresence>
                {(pwFocused || form.password.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 bg-dark-800 border border-dark-600 rounded-xl p-3 space-y-1.5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                      Password must:
                    </p>
                    {rulesPassed.map(rule => (
                      <div key={rule.id} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center
                          flex-shrink-0 transition-all duration-200
                          ${rule.passed
                            ? 'bg-green-500/20 border border-green-500/50'
                            : 'bg-dark-600 border border-dark-500'}`}>
                          {rule.passed ? (
                            <svg className="w-2.5 h-2.5 text-green-400" fill="none"
                              viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-dark-400" />
                          )}
                        </div>
                        <span className={`text-xs transition-colors duration-200
                          ${rule.passed ? 'text-green-400' : 'text-gray-500'}`}>
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password <span className="text-gold-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.password2}
                  onChange={handleChange('password2')}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className={`input-field pr-10 ${errors.password2 ? 'border-red-500' : ''}`}
                />
                <button type="button" onClick={() => setShowConfirm(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  <EyeIcon show={showConfirm} />
                </button>
              </div>
              {errors.password2 && (
                <p className="text-red-400 text-xs mt-1">{errors.password2}</p>
              )}
              {/* Match indicator */}
              {form.password2.length > 0 && (
                <p className={`text-xs mt-1 ${
                  form.password === form.password2 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {form.password === form.password2 ? '✔ Passwords match' : '✖ Passwords do not match'}
                </p>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 py-3.5 mt-2
                         disabled:opacity-60 disabled:cursor-not-allowed">
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