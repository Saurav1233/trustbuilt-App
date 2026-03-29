import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeUp  = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const benefits = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
    title: 'Proven Business Model',
    desc: "Step into a tested, profitable framework. We've done the hard work — now you replicate the success.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: 'Full Training & Onboarding',
    desc: 'Comprehensive training on all services, tools, and client management from day one.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'Dedicated Support Team',
    desc: "24/7 support from our Bangalore team. You're never alone in building your business.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Brand Recognition',
    desc: 'Operate under the Trust Built brand name with immediate credibility and trust.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
      </svg>
    ),
    title: 'Exclusive Territory',
    desc: 'Get exclusive rights to operate in your city or region without internal competition.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    title: 'High Revenue Potential',
    desc: 'PR & digital marketing is a high-margin industry. Build a ₹10L+ monthly revenue business.',
  },
];

const steps = [
  { num: '01', title: 'Apply Online', desc: 'Fill out the franchise application form with your details and target city.' },
  { num: '02', title: 'Discovery Call', desc: 'Our team will schedule a call to discuss the opportunity and answer your questions.' },
  { num: '03', title: 'Agreement & Onboarding', desc: 'Sign the franchise agreement and begin your comprehensive training program.' },
  { num: '04', title: 'Launch Your Business', desc: 'Go live in your city with full brand support, tools, and a dedicated team behind you.' },
];

const budgets = [
  '₹2L – ₹5L', '₹5L – ₹10L', '₹10L – ₹20L', '₹20L+',
];

export default function Franchise() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', city: '', budget: '', intro: '',
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())  errs.name  = 'Required';
    if (!form.phone.trim()) errs.phone = 'Required';
    if (!form.email)        errs.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.city.trim())  errs.city  = 'Required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    // Simulate API call — wire up to your Django backend when ready
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-20">

      {/* Hero */}
      <section className="py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[600px] h-[600px] bg-gold-500/4 rounded-full blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}>
          <div className="shimmer-line w-16 mx-auto mb-6" />
          <h1 className="font-display text-5xl sm:text-6xl font-bold mb-5">
            Join the Trust Built Network
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Own a profitable PR & digital marketing business with our full support,
            systems, and brand power behind you.
          </p>
        </motion.div>
      </section>

      {/* Benefits Grid */}
      <section className="section-pad pt-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map(b => (
              <motion.div key={b.title} variants={fadeUp}
                className="bg-dark-700 border border-dark-500 rounded-2xl p-6
                           hover:border-gold-600/40 hover:shadow-[0_0_25px_rgba(212,160,23,0.08)]
                           transition-all duration-300">
                <div className="w-11 h-11 bg-dark-600 rounded-xl flex items-center justify-center
                                text-gold-400 mb-5">
                  {b.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{b.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-pad bg-dark-800">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-14">
            <div className="shimmer-line w-16 mx-auto mb-6" />
            <h2 className="font-display text-4xl font-bold">How It Works</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div key={s.num} variants={fadeUp} className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px
                                  bg-gradient-to-r from-gold-600/40 to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center
                                  font-display font-bold text-dark-900 text-sm mb-4
                                  shadow-[0_0_20px_rgba(212,160,23,0.35)]">
                    {s.num}
                  </div>
                  <h4 className="font-semibold text-white mb-2">{s.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Application Form */}
      <section className="section-pad">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-10">
            <div className="shimmer-line w-16 mx-auto mb-6" />
            <h2 className="font-display text-4xl font-bold gold-text mb-3">
              Apply for a Franchise
            </h2>
            <p className="text-gray-400">
              Fill in your details and our team will get back to you within 24 hours.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="bg-dark-700/60 border border-dark-500 rounded-3xl p-8 md:p-10">

              {success ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center
                                  justify-center mx-auto mb-5">
                    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mb-2">
                    Application Submitted!
                  </h3>
                  <p className="text-gray-400 text-sm max-w-sm mx-auto">
                    Thank you for your interest. Our franchise team will reach out within 24 hours.
                  </p>
                  <button onClick={() => { setSuccess(false); setForm({ name:'', phone:'', email:'', city:'', budget:'', intro:'' }); }}
                    className="mt-6 btn-gold px-8 py-2.5 text-sm">
                    Submit Another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Row 1: Name + Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1.5">
                        Full Name <span className="text-gold-500">*</span>
                      </label>
                      <input value={form.name} onChange={set('name')}
                        placeholder="Your full name"
                        className={`input-field text-sm ${errors.name ? 'border-red-500' : ''}`} />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1.5">
                        Phone Number <span className="text-gold-500">*</span>
                      </label>
                      <input value={form.phone} onChange={set('phone')}
                        placeholder="+91 XXXXX XXXXX"
                        className={`input-field text-sm ${errors.phone ? 'border-red-500' : ''}`} />
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5">
                      Email Address <span className="text-gold-500">*</span>
                    </label>
                    <input type="email" value={form.email} onChange={set('email')}
                      placeholder="you@example.com"
                      className={`input-field text-sm ${errors.email ? 'border-red-500' : ''}`} />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Target City */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5">
                      Target City/Region <span className="text-gold-500">*</span>
                    </label>
                    <input value={form.city} onChange={set('city')}
                      placeholder="Which city do you want to operate in?"
                      className={`input-field text-sm ${errors.city ? 'border-red-500' : ''}`} />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                  </div>

                  {/* Investment Budget */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5">
                      Investment Budget
                    </label>
                    <select value={form.budget} onChange={set('budget')}
                      className="input-field text-sm bg-dark-700 appearance-none">
                      <option value="">Select budget range</option>
                      {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  {/* Brief Intro */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5">
                      Brief Introduction
                    </label>
                    <textarea value={form.intro} onChange={set('intro')} rows={5}
                      placeholder="Tell us about yourself and your business goals..."
                      className="input-field text-sm resize-none" />
                  </div>

                  {/* Submit */}
                  <button type="submit" disabled={loading}
                    className="w-full bg-gold-500 hover:bg-gold-400 text-dark-900 font-semibold
                               py-4 rounded-xl transition-all duration-300
                               hover:shadow-[0_0_25px_rgba(212,160,23,0.4)]
                               flex items-center justify-center gap-2 active:scale-[0.99]
                               text-base">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-dark-900 border-t-transparent
                                        rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : 'Submit Application'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-dark-800">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold mb-4">Have Questions?</h2>
          <p className="text-gray-400 mb-8">
            Reach out to our franchise team directly and we'll walk you through everything.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-gold px-10 py-4">Contact Us</Link>
            <Link to="/about-us" className="btn-outline px-10 py-4">Meet the Team</Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}