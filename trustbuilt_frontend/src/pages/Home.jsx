import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getServices, getTestimonials } from '../api/auth';
import ConsultationForm from '../components/ConsultationForm';

const iconMap = {
  megaphone: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
    </svg>
  ),
  share: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
    </svg>
  ),
  target: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  ),
  palette: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  ),
  video: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  shield: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
};

const fadeUp  = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

export default function Home() {
  const FALLBACK_SERVICES = [
    { id: 1, title: 'Public Relations',       description: 'Strategic PR campaigns that build and protect your brand reputation.',             icon: 'megaphone' },
    { id: 2, title: 'Social Media Management',description: 'Engaging content and community management across all platforms.',                   icon: 'share'     },
    { id: 3, title: 'Meta & Google Ads',      description: 'Performance-driven ad campaigns with measurable ROI.',                              icon: 'target'    },
    { id: 4, title: 'Branding & Design',      description: 'Visual identities that leave a lasting impression.',                                icon: 'palette'   },
    { id: 5, title: 'Video Production',       description: 'Cinematic brand films, reels, and content that captivates.',                        icon: 'video'     },
    { id: 6, title: 'Reputation Management',  description: 'Protect and strengthen your online reputation proactively.',                        icon: 'shield'    },
    { id: 7, title: 'Google Ads',             description: 'Search and display campaigns that put your brand in front of the right customers.', icon: 'target'    },
  ];

  const FALLBACK_TESTIMONIALS = [
    { id: 1, name: 'Rahul Sharma',  role: 'Founder, StartUp Rewa',  review: 'Trust Built transformed our social media presence. Our engagement went up by 300% in just 2 months!',                          rating: 5 },
    { id: 2, name: 'Priya Kapoor', role: 'CEO, Fashion House',      review: 'Their PR strategy helped us get featured in 3 major publications. The brand credibility we gained is invaluable.',              rating: 5 },
    { id: 3, name: 'Anil Mishra',  role: 'Owner, Retail Chain',     review: 'Meta Ads managed by Trust Built gave us 6x return on ad spend. They target the right audience every time.',                     rating: 5 },
  ];

  const [services,     setServices]     = useState(FALLBACK_SERVICES);
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);
  const [showConsult,  setShowConsult]  = useState(false);  // ← NEW

  useEffect(() => {
    getServices()
      .then(r => { if (Array.isArray(r.data) && r.data.length > 0) setServices(r.data); })
      .catch(() => {});
    getTestimonials()
      .then(r => { if (Array.isArray(r.data) && r.data.length > 0) setTestimonials(r.data); })
      .catch(() => {});
  }, []);

  const stats = [
    { value: '150+', label: 'Clients Served'    },
    { value: '7+',   label: 'Services Offered'  },
    { value: '2',    label: 'Cities, One Vision' },
    { value: '5×',   label: 'Average ROI'        },
  ];

  const whyUs = [
    { icon: '⚡', title: 'Fast Execution',        desc: 'We move fast without compromising quality, delivering results within defined timelines.' },
    { icon: '📊', title: 'Data-Driven Strategy',  desc: 'Every decision is backed by analytics and real market insights for maximum ROI.'        },
    { icon: '🎯', title: 'Dedicated Support',      desc: 'A dedicated account manager and team who truly care about your brand success.'          },
    { icon: '🌐', title: 'Local + National Reach', desc: 'Deep local roots in Rewa + national expertise from our Bangalore team.'                 },
  ];

  return (
    <div className="min-h-screen bg-dark-900">

      {/* ── Consultation Modal ─────────────────────────────────────────────── */}
      {showConsult && <ConsultationForm onClose={() => setShowConsult(false)} />}

      {/* Hero */}
      <section className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* BG effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gold-600/8 rounded-full blur-2xl" />
          <div className="absolute top-0 left-0 w-full h-full"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212,160,23,0.04) 0%, transparent 60%)' }} />
        </div>

        <div className="max-w-7xl mx-auto w-full pt-24">
          <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-3xl">
            <motion.div variants={fadeUp}
              className="inline-flex items-center gap-2 border border-green-500/30 bg-green-500/10
                         text-green-400 text-sm px-4 py-1.5 rounded-full mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Rewa & Bangalore — Now Accepting Clients
            </motion.div>

            <motion.h1 variants={fadeUp}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Build a Brand
              <br />
              <span className="gold-text">People Trust</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-gray-400 text-lg sm:text-xl leading-relaxed mb-4 max-w-2xl">
              PR & Digital Marketing Agency based in Rewa & Bangalore — helping startups and businesses grow with strategy, creativity, and data.
            </motion.p>

            <motion.p variants={fadeUp}
              className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-10">
              Building Trust. Driving Growth.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              {/* ── CHANGED: was <Link to="/contact"> — now opens the modal ── */}
              <button
                onClick={() => setShowConsult(true)}
                className="btn-gold text-base px-8 py-3.5"
              >
                Get Free Consultation
              </button>
              <Link to="/services" className="btn-outline text-base px-8 py-3.5">
                Explore Services
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp}
              className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-dark-600">
              {stats.map(s => (
                <div key={s.label}>
                  <div className="text-gold-400 font-display text-3xl font-bold">{s.value}</div>
                  <div className="text-gray-500 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="section-pad bg-dark-800">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <div className="shimmer-line w-16 mx-auto mb-6" />
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-400 text-lg">End-to-end digital and PR solutions tailored for your growth</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <motion.div key={s.id} variants={fadeUp}
                className="card-dark group cursor-default hover:scale-[1.02] transition-transform duration-300">
                <div className="w-12 h-12 bg-dark-600 rounded-xl flex items-center justify-center
                                text-gold-400 group-hover:bg-gold-500/10 transition-colors duration-300 mb-5">
                  {iconMap[s.icon] || iconMap.megaphone}
                </div>
                <h3 className="font-display text-xl font-semibold mb-3 text-white group-hover:text-gold-400 transition-colors">
                  {s.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.description}</p>
              </motion.div>
            ))}

            {/* CTA Card — also opens modal */}
            <motion.div variants={fadeUp}
              className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-700/30
                         rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-xl font-semibold mb-2 text-white">Ready to grow your brand?</h3>
                <p className="text-gray-400 text-sm">Let's talk strategy, no strings attached.</p>
              </div>
              {/* ── CHANGED: was <Link to="/contact"> — now opens the modal ── */}
              <button
                onClick={() => setShowConsult(true)}
                className="mt-6 btn-gold inline-block text-center text-sm"
              >
                Talk to Us
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Trust Built */}
      <section className="section-pad">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="shimmer-line w-16 mb-6" />
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
              Why <span className="gold-text">Trust Built?</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              We're not just another agency. We're partners invested in your growth with transparent processes, data-backed decisions, and a passion for results.
            </p>
            <div className="space-y-6">
              {whyUs.map(w => (
                <div key={w.title} className="flex gap-4">
                  <div className="w-10 h-10 bg-dark-700 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
                    {w.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">{w.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="grid grid-cols-2 gap-4">
            {[
              { value: '150+', label: 'Happy Clients'             },
              { value: '5×',   label: 'Average ROI'               },
              { value: '3 Yrs',label: 'Industry Experience'       },
              { value: '98%',  label: 'Client Retention'          },
              { value: '2 Cities', label: 'Rewa & Bangalore Operations', full: true },
            ].map(m => (
              <div key={m.label}
                className={`card-dark text-center ${m.full ? 'col-span-2' : ''}`}>
                <div className="font-display text-4xl font-bold gold-text mb-1">{m.value}</div>
                <div className="text-gray-400 text-sm">{m.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-pad bg-dark-800">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <div className="shimmer-line w-16 mx-auto mb-6" />
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">Client Testimonials</h2>
            <p className="text-gray-400">What our clients say about working with Trust Built</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <motion.div key={t.id} variants={fadeUp} className="card-dark">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-gold-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed italic mb-6">"{t.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold-600 rounded-full flex items-center justify-center
                                  text-dark-900 font-bold text-sm">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Franchise CTA */}
      <section className="section-pad">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-green-900/50 to-dark-700 border border-green-800/40 rounded-3xl p-10 md:p-16
                       flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-4">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                Franchise Opportunity
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">Partner With Trust Built</h2>
              <p className="text-gray-400 max-w-xl">
                Bring our proven PR & digital marketing expertise to your city. Join our growing franchise network and build a profitable business.
              </p>
            </div>
            <Link to="/contact" className="btn-gold whitespace-nowrap px-10 py-4 text-base">
              Explore Franchise
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}