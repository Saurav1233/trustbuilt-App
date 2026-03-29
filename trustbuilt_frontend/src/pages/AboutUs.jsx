import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeUp  = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

const bangaloreTeam = [
  {
    initials: 'AK', color: 'bg-yellow-600',
    name: 'Arjun Kumar', role: 'Co-Founder & CEO',
    bio: '10+ years in PR & brand strategy. Former consultant to Fortune 500 companies.',
  },
  {
    initials: 'SM', color: 'bg-teal-600',
    name: 'Sneha Mehta', role: 'Head of Digital',
    bio: 'Certified Google & Meta ads specialist with ₹10Cr+ managed ad spend.',
  },
  {
    initials: 'RN', color: 'bg-purple-500',
    name: 'Ravi Nair', role: 'Creative Director',
    bio: 'Award-winning designer with expertise in brand identity and visual storytelling.',
  },
];

const rewaTeam = [
  {
    initials: 'VP', color: 'bg-yellow-500',
    name: 'Vikram Patel', role: 'Regional Head — Rewa',
    bio: 'Local business expert with strong community connections across MP.',
  },
  {
    initials: 'DT', color: 'bg-green-600',
    name: 'Divya Tiwari', role: 'Social Media Lead — Rewa',
    bio: 'Content strategist specializing in regional markets and vernacular content.',
  },
];

const TeamCard = ({ member }) => (
  <motion.div variants={fadeUp}
    className="bg-dark-700 border border-dark-500 rounded-2xl p-6 text-center
               hover:border-gold-600/40 hover:shadow-[0_0_25px_rgba(212,160,23,0.08)]
               transition-all duration-300">
    <div className={`w-16 h-16 ${member.color} rounded-full flex items-center justify-center
                     mx-auto mb-4 text-white font-bold font-display text-lg`}>
      {member.initials}
    </div>
    <h3 className="text-white font-semibold text-base mb-1">{member.name}</h3>
    <p className="text-gold-400 text-sm mb-3">{member.role}</p>
    <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
  </motion.div>
);

export default function AboutUs() {
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
            About Trust Built
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We are a team of passionate storytellers, strategists, and digital experts
            on a mission to help brands earn genuine trust.
          </p>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="section-pad pt-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <h2 className="font-display text-3xl font-bold mb-6">
              Our <span className="gold-text">Story</span>
            </h2>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                Trust Built was founded with a simple belief: every business, no matter the
                size, deserves professional PR and digital marketing support. We started in
                Bangalore and are now expanding to Rewa — bringing big-city expertise to
                local businesses that are hungry for growth.
              </p>
              <p>
                Our founders have worked with startups, established brands, and government
                bodies — giving us a rare breadth of experience across industries and
                markets. Today, we operate as a full-service agency with deep specialization
                in PR, paid media, branding, and content.
              </p>
            </div>
          </motion.div>

          {/* Stats grid */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={stagger} className="grid grid-cols-2 gap-4">
            {[
              { value: '2021', label: 'Founded' },
              { value: '2',    label: 'Office Locations' },
              { value: '20+',  label: 'Team Members' },
              { value: '7+',   label: 'Services' },
            ].map(s => (
              <motion.div key={s.label} variants={fadeUp}
                className="bg-green-950/30 border border-green-900/40 rounded-2xl p-6 text-center">
                <div className="font-display text-4xl font-bold gold-text mb-1">{s.value}</div>
                <div className="text-gray-400 text-sm">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-pad bg-dark-800">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={stagger} className="grid md:grid-cols-2 gap-6">

            {/* Mission */}
            <motion.div variants={fadeUp}
              className="bg-dark-700 border border-dark-500 rounded-2xl p-8
                         hover:border-gold-600/30 transition-all duration-300">
              <div className="w-12 h-12 bg-dark-600 rounded-xl flex items-center justify-center
                              text-gold-400 mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-400 leading-relaxed">
                To empower businesses with the PR and digital marketing tools they need to
                build authentic relationships, grow their audience, and achieve sustainable
                success — with integrity and innovation at every step.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div variants={fadeUp}
              className="bg-dark-700 border border-dark-500 rounded-2xl p-8
                         hover:border-gold-600/30 transition-all duration-300">
              <div className="w-12 h-12 bg-green-900/40 rounded-xl flex items-center justify-center
                              text-green-400 mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-400 leading-relaxed">
                To become India's most trusted PR and digital marketing network — a brand
                synonymous with excellence, transparency, and transformative results for
                businesses of all sizes.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="section-pad">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
            <div className="shimmer-line w-16 mx-auto mb-6" />
            <h2 className="font-display text-4xl sm:text-5xl font-bold">Meet the Team</h2>
          </motion.div>

          {/* Bangalore team */}
          <div className="mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 border border-dark-500 text-gray-300
                         text-sm px-4 py-1.5 rounded-full mb-8">
              <svg className="w-3.5 h-3.5 text-gold-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              Bangalore — Main Team
            </motion.div>

            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {bangaloreTeam.map(m => <TeamCard key={m.name} member={m} />)}
            </motion.div>
          </div>

          {/* Rewa team */}
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 border border-dark-500 text-gray-300
                         text-sm px-4 py-1.5 rounded-full mb-8">
              <svg className="w-3.5 h-3.5 text-gold-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              Rewa — New Launch Team
            </motion.div>

            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={stagger} className="grid sm:grid-cols-2 gap-5">
              {rewaTeam.map(m => <TeamCard key={m.name} member={m} />)}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-dark-800">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold mb-4">Want to Work With Us?</h2>
          <p className="text-gray-400 mb-8">
            Let's build something great together. Reach out for a free consultation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-gold px-10 py-4">Get Free Consultation</Link>
            <Link to="/services" className="btn-outline px-10 py-4">View Services</Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}