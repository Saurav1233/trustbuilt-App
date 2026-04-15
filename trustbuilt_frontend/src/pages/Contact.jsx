import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { submitContact } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const services = [
  'Public Relations',
  'Social Media Management',
  'Meta Ads',
  'Google Ads',
  'Branding & Design',
  'Video Production',
  'Reputation Management',
  'Website Creation',
  'Skill Based Courses',
  'Franchise Inquiry',
  'Other',
];

export default function Contact() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', phone: '', email: '', service_interest: '', message: '', inquiry_type: 'consultation',
  });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState('');
  const [apiError, setApiError] = useState('');

  // Not logged in
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-dark-900 pt-20 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="card-dark max-w-md w-full text-center py-16">
          <div className="text-6xl mb-6">🔐</div>
          <h2 className="font-display text-2xl font-bold text-white mb-3">Login Required</h2>
          <p className="text-gray-400 mb-6 text-sm">
            Please login or create an account to send us a message.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/login" state={{ from: { pathname: '/contact' } }}
              className="btn-gold px-6 py-2.5 inline-block">
              Login
            </Link>
            <Link to="/register" className="btn-outline px-6 py-2.5 inline-block">
              Register
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Admin redirect
  if (user?.is_staff) {
    return (
      <div className="min-h-screen bg-dark-900 pt-20 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="card-dark max-w-md w-full text-center py-16">
          <div className="text-6xl mb-6">🛡️</div>
          <h2 className="font-display text-2xl font-bold text-white mb-3">You're an Admin</h2>
          <p className="text-gray-400 mb-6 text-sm">
            Admins don't submit consultation requests.<br />
            Manage all inquiries from the Admin Panel.
          </p>
          <Link to="/admin-panel" className="btn-gold px-8 py-3 inline-block">
            Go to Admin Panel
          </Link>
        </motion.div>
      </div>
    );
  }

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.email) errs.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.message.trim()) errs.message = 'Required';
    else if (form.message.trim().length < 20) errs.message = 'Too short (min 20 chars)';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true); setApiError('');
    try {
      const { data } = await submitContact(form);
      setSuccess(data.message);
      setForm({ name: '', phone: '', email: '', service_interest: '', message: '', inquiry_type: 'consultation' });
    } catch (err) {
      setApiError(
        err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(' ')
          : 'Something went wrong. Please try again.'
      );
    } finally { setLoading(false); }
  };

  const set = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  const contactCards = [
    {
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>,
      label: 'Call Us', value: '+91 70675 70038',
    },
    {
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>,
      label: 'Email Us', value: 'trustbuilt2026@gmail.com',
    },
    {
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
      label: 'Find Us', value: 'Rewa, MP & Bangalore, Karnataka',
    },
  ];

  const socials = [
    { label: 'Instagram', href: 'https://www.instagram.com/trustbuilt.prime?igsh=MWhsdXN1NGxxOXQ1bA==', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
  ];

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold-500/4 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} className="text-center mb-10">
            <div className="shimmer-line w-16 mx-auto mb-6" />
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">Get in Touch</h1>
            <p className="text-gray-400">Let's talk about your brand. We're here to help you grow.</p>
          </motion.div>

          {/* Inquiry type selector */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }} className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { key: 'consultation', label: '🎯 Free Consultation' },
              { key: 'general',      label: '💬 General Message' },
              { key: 'franchise',    label: '🏢 Franchise Inquiry' },
            ].map(t => (
              <button key={t.key} onClick={() => setForm(p => ({ ...p, inquiry_type: t.key }))}
                className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300
                  ${form.inquiry_type === t.key
                    ? 'bg-gold-500 text-dark-900 border-gold-500 shadow-[0_0_20px_rgba(212,160,23,0.35)]'
                    : 'border-dark-500 text-gray-300 hover:border-gold-600 hover:text-gold-400'}`}>
                {t.label}
              </button>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-[2fr_3fr] gap-6">
            {/* Left info cards */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }} className="space-y-4">
              {contactCards.map(c => (
                <div key={c.label}
                  className="bg-dark-700 border border-dark-500 rounded-2xl p-5 hover:border-gold-600/40 transition-colors">
                  <div className="w-9 h-9 bg-dark-600 rounded-xl flex items-center justify-center text-gold-400 mb-3">
                    {c.icon}
                  </div>
                  <p className="text-white font-semibold text-sm mb-1">{c.label}</p>
                  <p className="text-gray-400 text-sm">{c.value}</p>
                </div>
              ))}
              <div className="bg-dark-700 border border-dark-500 rounded-2xl p-5 hover:border-gold-600/40 transition-colors">
                <p className="text-white font-semibold text-sm mb-3">Follow Us</p>
                <div className="flex gap-2">
                  {socials.map(s => (
                    <a key={s.label} href={s.href} aria-label={s.label}
                      className="w-9 h-9 bg-dark-600 border border-dark-500 rounded-xl flex items-center justify-center
                                 text-gray-400 hover:text-gold-400 hover:border-gold-600/50 transition-all">
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}>
              <div className="bg-dark-700 border border-dark-500 rounded-2xl p-6 md:p-8">
                <h2 className="font-display text-2xl font-bold text-white mb-6">Send Us a Message</h2>
                {apiError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-5">
                    {apiError}
                  </div>
                )}
                {success ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10">
                    <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-display text-xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-400 text-sm">{success}</p>
                    <button onClick={() => setSuccess('')} className="mt-5 btn-gold px-6 py-2 text-sm">
                      Send Another
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">
                          Full Name <span className="text-gold-500">*</span>
                        </label>
                        <input value={form.name} onChange={set('name')} placeholder="Your name"
                          className={`input-field text-sm ${errors.name ? 'border-red-500' : ''}`} />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone</label>
                        <input value={form.phone} onChange={set('phone')} placeholder="+91 XXXXX XXXXX"
                          className="input-field text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Email Address <span className="text-gold-500">*</span>
                      </label>
                      <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com"
                        className={`input-field text-sm ${errors.email ? 'border-red-500' : ''}`} />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Service Interested In</label>
                      <select value={form.service_interest} onChange={set('service_interest')}
                        className="input-field text-sm bg-dark-700 appearance-none">
                        <option value="">Select a service</option>
                        {services.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Message <span className="text-gold-500">*</span>
                      </label>
                      <textarea value={form.message} onChange={set('message')} rows={5}
                        placeholder="Tell us about your business and what you need..."
                        className={`input-field text-sm resize-none ${errors.message ? 'border-red-500' : ''}`} />
                      {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full bg-gold-500 hover:bg-gold-400 text-dark-900 font-semibold py-3.5 rounded-xl
                                 transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,160,23,0.4)]
                                 flex items-center justify-center gap-2 active:scale-[0.99]">
                      {loading
                        ? <><div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />Sending...</>
                        : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}