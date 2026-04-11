import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const servicesData = [
  {
    id: 1,
    tab: 'Public Relations',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
      </svg>
    ),
    headline: 'Build authority, earn trust',
    tagline: 'Strategic media relations that get your brand seen by the right people.',
    description: 'We craft compelling narratives and place your brand in front of journalists, influencers, and media outlets that matter. From press releases to crisis management, we protect and elevate your brand reputation at every touchpoint.',
    process: ['Brand story development', 'Media list curation', 'Press release writing', 'Journalist outreach', 'Coverage tracking & reporting'],
    results: ['3+ media features on average', '40% increase in brand searches', 'Crisis response in under 2 hours'],
  },
  {
    id: 2,
    tab: 'Social Media',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
      </svg>
    ),
    headline: 'Grow your community, drive engagement',
    tagline: 'Content that converts followers into loyal brand advocates.',
    description: 'We manage your social presence end-to-end — from content strategy and graphic design to posting, community management, and analytics. Every post is crafted with intent to grow your audience and drive measurable results.',
    process: ['Platform audit & strategy', 'Content calendar creation', 'Graphic & video content', 'Daily posting & engagement', 'Monthly analytics report'],
    results: ['300% avg. engagement increase', '10K+ followers gained in 90 days', 'Daily community management'],
  },
  {
    id: 3,
    tab: 'Meta Ads',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    ),
    headline: 'Reach the right audience, every time',
    tagline: 'Performance advertising on Facebook & Instagram that scales.',
    description: 'We run laser-targeted Meta ad campaigns that put your product or service in front of people ready to buy. From creative to conversion tracking, we manage every element of your paid social funnel to maximize return on ad spend.',
    process: ['Audience research & segmentation', 'Creative design (static + video)', 'A/B testing setup', 'Campaign launch & optimization', 'Weekly ROI reporting'],
    results: ['6× avg. return on ad spend', 'Cost-per-lead reduced by 45%', 'Full-funnel campaign management'],
  },
  {
    id: 4,
    tab: 'Google Ads',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    headline: 'Capture demand, drive conversions',
    tagline: 'Search, display, and shopping campaigns that put you first.',
    description: 'Search, display, and shopping campaigns on Google that put your brand in front of customers actively looking for what you offer. We maximize every rupee of your ad spend with precise keyword targeting, compelling ad copy, and continuous optimization.',
    process: ['Keyword research', 'Campaign architecture', 'Ad copy writing', 'Bid strategy & optimization', 'Conversion tracking setup'],
    results: ['Top 3 search position avg.', '4× return on ad spend', 'Quality Score 8+ maintained'],
  },
  {
    id: 5,
    tab: 'Branding',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    headline: 'Visual identity that commands attention',
    tagline: 'Logos, brand kits, and design systems built to scale.',
    description: "Your brand is more than a logo — it's the feeling people get when they interact with you. We craft comprehensive visual identities that communicate your values, differentiate you from competitors, and leave a lasting impression across every touchpoint.",
    process: ['Brand discovery workshop', 'Logo design (3 concepts)', 'Color palette & typography', 'Brand guidelines document', 'Social media kit delivery'],
    results: ['Full brand kit in 10 days', '3 design concepts presented', 'Unlimited revisions included'],
  },
  {
    id: 6,
    tab: 'Video',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    headline: 'Stories that stop the scroll',
    tagline: 'Cinematic brand films, reels, and content that captivates.',
    description: "Video is the highest-converting content format today. We produce cinematic brand films, product showcases, testimonial videos, and short-form reels that tell your story in a way that text and images never could — and convert viewers into customers.",
    process: ['Concept & script development', 'Pre-production planning', 'Professional shoot', 'Editing & color grading', 'Delivery in all formats'],
    results: ['2× higher conversion vs static', 'Reels averaging 50K+ views', '48-hr turnaround for reels'],
  },
  {
    id: 7,
    tab: 'Reputation',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    headline: "Protect what you've built",
    tagline: 'Proactive reputation monitoring and crisis management.',
    description: "In the digital age, your reputation can be made or broken in hours. We monitor your brand 24/7 across platforms, respond to reviews, suppress negative content, and build a positive online footprint that earns trust before customers even speak to you.",
    process: ['Brand audit & sentiment analysis', 'Review monitoring setup', 'Response strategy creation', 'Negative content suppression', 'Positive PR amplification'],
    results: ['4.8★ avg. review rating achieved', '24/7 brand monitoring', 'Negative results suppressed in 30 days'],
  },

  // ── NEW: Website Creation ─────────────────────────────────────────────────
  {
    id: 8,
    tab: 'Website Creation',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
    headline: 'Your brand deserves a powerful online presence',
    tagline: 'Fast, beautiful, and conversion-optimised websites built for growth.',
    description: 'We design and develop professional websites that not only look stunning but are built to convert visitors into customers. From landing pages to full business websites and e-commerce stores, every pixel is crafted with purpose — fast loading, mobile-first, and SEO-ready from day one.',
    process: [
      'Discovery & requirement gathering',
      'UI/UX wireframe & design',
      'Responsive development',
      'SEO & performance optimisation',
      'Launch, training & ongoing support',
    ],
    results: [
      'Delivered in 7–14 days',
      '90+ Google PageSpeed score',
      'Mobile-first & SEO optimised',
    ],
  },
];

export default function Services() {
  const [active, setActive] = useState(4); // default: Google Ads

  const service = servicesData.find(s => s.id === active);

  return (
    <div className="min-h-screen bg-dark-900 pt-20">

      {/* Hero */}
      <section className="py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/4 rounded-full blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="shimmer-line w-16 mx-auto mb-6" />
          <h1 className="font-display text-5xl sm:text-6xl font-bold mb-5">Our Services</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Comprehensive PR and digital solutions crafted for businesses that want to grow
          </p>
        </motion.div>
      </section>

      {/* Tab Bar */}
      <section className="px-4 pb-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {servicesData.map(s => (
              <button key={s.id} onClick={() => setActive(s.id)}
                className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300
                  ${active === s.id
                    ? 'bg-gold-500 text-dark-900 border-gold-500 shadow-[0_0_20px_rgba(212,160,23,0.35)]'
                    : 'border-dark-500 text-gray-300 hover:border-gold-600 hover:text-gold-400'
                  }`}>
                {s.tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Service Detail Panel */}
      <section className="section-pad pt-10">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}
              className="bg-dark-700 border border-dark-500 rounded-3xl overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-0">

                {/* Left: Info */}
                <div className="p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-dark-500">
                  <div className="w-16 h-16 bg-dark-600 rounded-2xl flex items-center justify-center text-gold-400 mb-8">
                    {service.icon}
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">{service.tab}</h2>
                  <p className="text-gold-400 font-medium mb-5">{service.headline}</p>
                  <p className="text-gray-400 leading-relaxed mb-8">{service.description}</p>

                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Key Results</p>
                  <div className="space-y-3 mb-10">
                    {service.results.map((r, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                        <span className="text-gray-300 text-sm">{r}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/contact" className="btn-gold inline-flex items-center gap-2 px-8 py-3.5">
                    Get Started
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>

                {/* Right: Process */}
                <div className="p-8 md:p-12">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-8">Our Process</p>
                  <div className="relative">
                    <div className="absolute left-[18px] top-6 bottom-6 w-px bg-dark-500" />
                    <div className="space-y-6">
                      {service.process.map((step, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08, duration: 0.4 }}
                          className="flex items-center gap-5">
                          <div className="relative z-10 w-9 h-9 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(212,160,23,0.4)]">
                            <span className="text-dark-900 font-bold text-sm font-display">{i + 1}</span>
                          </div>
                          <span className="text-gray-200 font-medium">{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-10 bg-dark-800 rounded-2xl p-6 border border-dark-500">
                    <p className="text-gold-400 font-display text-xl font-semibold leading-snug">
                      "{service.tagline}"
                    </p>
                    <p className="text-gray-500 text-sm mt-2">— Trust Built, {service.tab} Team</p>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Other Services Grid */}
      <section className="section-pad pt-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-6 text-center">Other Services</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {servicesData.filter(s => s.id !== active).map(s => (
              <button key={s.id} onClick={() => setActive(s.id)}
                className="card-dark flex flex-col items-center gap-3 py-5 px-3 hover:scale-[1.04] transition-transform text-center group">
                <div className="text-gold-400 group-hover:scale-110 transition-transform duration-200">{s.icon}</div>
                <span className="text-gray-300 text-xs font-medium group-hover:text-gold-400 transition-colors leading-tight">{s.tab}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-dark-800">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold mb-4">Ready to Transform Your Brand?</h2>
          <p className="text-gray-400 mb-8">Let's craft a strategy that drives real results for your business.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-gold px-10 py-4">Get Free Consultation</Link>
            <Link to="/register" className="btn-outline px-10 py-4">Create Account</Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}