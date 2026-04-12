import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { submitConsultation } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const initialForm = { name: '', email: '', phone: '', message: '' };

export default function ConsultationForm({ onClose }) {
  const { user } = useAuth();
  const [form,     setForm]     = useState(initialForm);
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [apiError, setApiError] = useState('');

  // ── Validation ──────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.name.trim())
      errs.name = 'Full name is required.';
    if (!form.email.trim())
      errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = 'Enter a valid email address.';
    if (!form.phone.trim())
      errs.phone = 'Phone number is required.';
    else if (!/^[0-9+\-\s]{7,15}$/.test(form.phone.trim()))
      errs.phone = 'Enter a valid phone number.';
    if (!form.message.trim())
      errs.message = 'Please describe what you need.';
    else if (form.message.trim().length < 10)
      errs.message = 'Message must be at least 10 characters.';
    return errs;
  };

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    setApiError('');
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');

    try {
      const { data } = await submitConsultation(form);
      setSuccess(true);
      setForm(initialForm);

      // Open WhatsApp in a new tab after a short delay so user sees success msg
      if (data.whatsapp_url) {
        setTimeout(() => window.open(data.whatsapp_url, '_blank'), 1500);
      }
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        setErrors(
          Object.fromEntries(
            Object.entries(serverErrors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
          )
        );
      } else {
        setApiError('Something went wrong. Please try again or WhatsApp us directly.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Field helper ─────────────────────────────────────────────────────────
  const Field = ({ id, label, type = 'text', placeholder, textarea }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1.5">
        {label} <span className="text-gold-400">*</span>
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={4}
          value={form[id]}
          onChange={set(id)}
          placeholder={placeholder}
          className={`w-full bg-dark-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500
            text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition resize-none
            ${errors[id] ? 'border-red-500' : 'border-white/10 focus:border-gold-500/50'}`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={form[id]}
          onChange={set(id)}
          placeholder={placeholder}
          className={`w-full bg-dark-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500
            text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition
            ${errors[id] ? 'border-red-500' : 'border-white/10 focus:border-gold-500/50'}`}
        />
      )}
      {errors[id] && (
        <p className="mt-1 text-xs text-red-400">{errors[id]}</p>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
      >
        {/* Modal */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-dark-900 border border-white/10 rounded-2xl
                     shadow-2xl overflow-hidden"
        >
          {/* Gold top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-display text-xl font-bold text-white">
                  Get Free Consultation
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Fill in your details — we'll reach out within 24 hours.
                </p>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="text-gray-500 hover:text-white transition p-1 -mt-1 -mr-1"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* ── Not Logged In ── */}
            {!user ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🔐</div>
                <h3 className="text-white font-semibold text-lg mb-2">Login Required</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Please login or register to request a free consultation.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link to="/login" onClick={onClose}
                    className="btn-gold px-6 py-2.5 text-sm inline-block">
                    Login
                  </Link>
                  <Link to="/register" onClick={onClose}
                    className="btn-outline px-6 py-2.5 text-sm inline-block">
                    Register
                  </Link>
                </div>
              </div>
            ) : /* ── Success State ── */
            success ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center
                                mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Request Submitted!</h3>
                <p className="text-gray-400 text-sm mb-1">
                  We've received your consultation request.
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  Opening WhatsApp so you can connect with us instantly…
                </p>
                <button
                  onClick={onClose}
                  className="btn-gold px-8 py-2.5 text-sm"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              /* ── Form ── */
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <Field id="name"    label="Full Name"    placeholder="e.g. Rahul Sharma" />
                <Field id="email"   label="Email"        type="email" placeholder="you@example.com" />
                <Field id="phone"   label="Phone Number" type="tel"   placeholder="+91 98765 43210" />
                <Field id="message" label="What do you need help with?" placeholder="Tell us briefly about your goals or project…" textarea />

                {apiError && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20
                                 rounded-lg px-4 py-3">
                    {apiError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gold py-3.5 text-sm font-semibold flex items-center
                             justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Submitting…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      Request Consultation
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-500">
                  We will also open WhatsApp so you can message us directly.
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}