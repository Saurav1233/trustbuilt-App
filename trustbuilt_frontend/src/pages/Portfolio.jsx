import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const portfolioItems = [
  {
    id: 1,
    category: 'PR Campaigns',
    badge: 'PR',
    title: 'Media Coverage Campaign',
    subtitle: '15 publications featured',
    gradient: 'linear-gradient(135deg, #2a1a0f, #5a3510)',
    achievement: { value: '15', label: 'Publications Featured' },
  },
  {
    id: 2,
    category: 'Social Media',
    badge: 'Social',
    title: 'Instagram Growth Strategy',
    subtitle: '300% engagement boost',
    gradient: 'linear-gradient(135deg, #1a0a2e, #4a1a8a)',
    achievement: { value: '300%', label: 'Engagement Increase' },
  },
  {
    id: 3,
    category: 'Paid Ads',
    badge: 'Ads',
    title: 'Google Ads Campaign',
    subtitle: '4× return on ad spend',
    gradient: 'linear-gradient(135deg, #0a1628, #1a3a6a)',
    achievement: { value: '4×', label: 'Return on Ad Spend' },
  },
  {
    id: 4,
    category: 'Branding',
    badge: 'Brand',
    title: 'Complete Brand Overhaul',
    subtitle: 'Full identity redesign',
    gradient: 'linear-gradient(135deg, #1a0a1a, #6a1a4a)',
    achievement: { value: '10', label: 'Days to Full Brand Kit' },
  },
  {
    id: 5,
    category: 'Social Media',
    badge: 'Social',
    title: 'Facebook Community Build',
    subtitle: '10K+ followers in 90 days',
    gradient: 'linear-gradient(135deg, #0a1a10, #1a5a28)',
    achievement: { value: '10K+', label: 'Followers in 90 Days' },
  },
  {
    id: 6,
    category: 'Paid Ads',
    badge: 'Ads',
    title: 'Meta Ads for E-Commerce',
    subtitle: '6× ROAS achieved',
    gradient: 'linear-gradient(135deg, #1a1400, #5a4800)',
    achievement: { value: '6×', label: 'ROAS Achieved' },
  },
  {
    id: 7,
    category: 'PR Campaigns',
    badge: 'PR',
    title: 'Startup Launch PR',
    subtitle: 'Featured in 8 outlets',
    gradient: 'linear-gradient(135deg, #0f1a2a, #1a3a5a)',
    achievement: { value: '8', label: 'Media Outlets Covered' },
  },
  {
    id: 8,
    category: 'Branding',
    badge: 'Brand',
    title: 'Restaurant Brand Identity',
    subtitle: 'Logo + full brand kit',
    gradient: 'linear-gradient(135deg, #1a0f0a, #4a2010)',
    achievement: { value: '3', label: 'Design Concepts Delivered' },
  },
];

const filters = ['All Work', 'PR Campaigns', 'Social Media', 'Branding', 'Paid Ads'];

const badgeColors = {
  PR:     'bg-green-900/60 text-green-300 border border-green-700/40',
  Social: 'bg-blue-900/60 text-blue-300 border border-blue-700/40',
  Ads:    'bg-orange-900/60 text-orange-300 border border-orange-700/40',
  Brand:  'bg-purple-900/60 text-purple-300 border border-purple-700/40',
};

const stagger = { show: { transition: { staggerChildren: 0.08 } } };
const fadeUp  = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

export default function Portfolio() {
  const [active, setActive] = useState('All Work');

  const filtered = active === 'All Work'
    ? portfolioItems
    : portfolioItems.filter(p => p.category === active);

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
          <h1 className="font-display text-5xl sm:text-6xl font-bold mb-4">Our Portfolio</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Real results for real brands — explore our work and client success stories
          </p>
        </motion.div>
      </section>

      {/* Filter Tabs */}
      <section className="px-4 pb-10">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-3">
          {filters.map(f => (
            <button key={f} onClick={() => setActive(f)}
              className={`px-6 py-2.5 rounded-full border text-sm font-medium transition-all duration-300
                ${active === f
                  ? 'bg-gold-500 text-dark-900 border-gold-500 shadow-[0_0_20px_rgba(212,160,23,0.35)]'
                  : 'border-dark-500 text-gray-300 hover:border-gold-600 hover:text-gold-400'
                }`}>
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial="hidden" animate="show" variants={stagger}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filtered.map(item => (
                <motion.div key={item.id} variants={fadeUp}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer"
                  style={{ aspectRatio: '4/3' }}>

                  {/* Background gradient */}
                  <div className="w-full h-full" style={{ background: item.gradient, minHeight: '220px' }} />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-dark-900/0 group-hover:bg-dark-900/40
                                  transition-all duration-400" />

                  {/* Content — slides up on hover */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5
                                  translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className={`inline-flex self-start px-2 py-0.5 rounded-full text-xs mb-2
                                     font-medium ${badgeColors[item.badge]}`}>
                      {item.badge}
                    </div>
                    <h4 className="text-white text-sm font-semibold mb-1">{item.title}</h4>
                    <p className="text-xs" style={{ color: 'var(--gold, #d4a017)' }}>{item.subtitle}</p>
                  </div>

                  {/* Achievement pill — visible on hover */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100
                                  transition-opacity duration-300
                                  bg-dark-900/80 backdrop-blur-sm border border-gold-600/40
                                  rounded-xl px-3 py-2 text-center min-w-[72px]">
                    <div className="text-gold-400 font-display font-bold text-lg leading-none">
                      {item.achievement.value}
                    </div>
                    <div className="text-gray-400 text-[10px] mt-0.5 leading-tight">
                      {item.achievement.label}
                    </div>
                  </div>

                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Case Study Spotlight */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-10">
            <div className="shimmer-line w-16 mx-auto mb-6" />
            <h2 className="font-display text-4xl font-bold">Case Study Spotlight</h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-dark-700 border border-dark-500 rounded-3xl p-8 md:p-12">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-900/40 border border-green-700/40
                            text-green-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Featured Case Study
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              {/* Left */}
              <div>
                <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                  How We Grew a Local Brand by 400%
                </h3>
                <p className="text-gray-400 leading-relaxed mb-8">
                  A Rewa-based retail brand came to us with zero social media presence and a
                  declining offline reputation. Over 6 months, we rebuilt their brand identity,
                  launched targeted campaigns, and drove massive growth.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: '400%', label: 'Follower Growth' },
                    { value: '6×',   label: 'ROAS on Ads' },
                    { value: '3',    label: 'Media Features' },
                  ].map(s => (
                    <div key={s.label} className="bg-dark-800 border border-dark-500 rounded-xl p-4 text-center">
                      <div className="font-display text-2xl font-bold gold-text">{s.value}</div>
                      <div className="text-gray-400 text-xs mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Before / After */}
              <div className="grid sm:grid-cols-2 gap-4 content-start">
                {/* Before */}
                <div className="bg-red-950/30 border border-red-800/30 rounded-2xl p-5">
                  <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-4">Before</p>
                  <div className="space-y-2.5">
                    {['500 followers','No online reviews','Zero ad presence','Outdated branding'].map(t => (
                      <div key={t} className="flex items-center gap-2">
                        <span className="text-red-400 text-sm font-bold">✕</span>
                        <span className="text-gray-300 text-sm">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* After */}
                <div className="bg-green-950/30 border border-green-800/30 rounded-2xl p-5">
                  <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-4">After</p>
                  <div className="space-y-2.5">
                    {['2,500+ followers','4.8★ rating','6× ROAS on Meta','New brand identity'].map(t => (
                      <div key={t} className="flex items-center gap-2">
                        <span className="text-green-400 text-sm font-bold">✓</span>
                        <span className="text-gray-300 text-sm">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-dark-800">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold mb-4">Want Results Like These?</h2>
          <p className="text-gray-400 mb-8">Let's build your success story together.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-gold px-10 py-4">Get Free Consultation</Link>
            <Link to="/services" className="btn-outline px-10 py-4">View Services</Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}