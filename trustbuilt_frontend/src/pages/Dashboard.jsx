import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getDashboard, getServices, getUserMessages } from '../api/auth';

const fadeUp  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const STATUS_STYLES = {
  new:         { bg: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',     label: '🔵 New' },
  in_progress: { bg: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30', label: '🟡 In Progress' },
  resolved:    { bg: 'bg-green-500/20 text-green-300 border border-green-500/30',   label: '🟢 Resolved' },
};

const TYPE_STYLES = {
  consultation: 'bg-gold-500/20 text-gold-300 border border-gold-500/30',
  franchise:    'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  general:      'bg-gray-500/20 text-gray-300 border border-gray-500/30',
};

export default function Dashboard() {
  const { user, logoutUser } = useAuth();
  const [dashData,  setDashData]  = useState(null);
  const [services,  setServices]  = useState([]);
  const [messages,  setMessages]  = useState([]);
  const [msgLoading, setMsgLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(r => setDashData(r.data))
      .catch(() => {});
    getServices()
      .then(r => setServices(Array.isArray(r.data) ? r.data : []))
      .catch(() => {});
    getUserMessages()
      .then(r => setMessages(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setMsgLoading(false));
  }, []);

  const quickActions = [
    { label: 'View Services', to: '/services', icon: '🚀', desc: 'Explore all our offerings' },
    { label: 'Contact Us',    to: '/contact',  icon: '💬', desc: 'Talk to a strategist'     },
    { label: 'Go to Home',    to: '/',         icon: '🏠', desc: 'Back to homepage'          },
  ];

  return (
    <div className="min-h-screen bg-dark-900 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-12">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-gold-400 text-sm font-medium uppercase tracking-widest mb-1">Dashboard</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold">
              Welcome back, <span className="gold-text">{user?.first_name || user?.username}!</span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Member since {dashData?.stats?.member_since || '...'}
              {dashData?.stats?.is_staff && (
                <span className="ml-2 text-gold-500 font-medium">· Admin</span>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            {dashData?.stats?.is_staff && (
              <Link to="/admin-panel" className="btn-gold text-sm px-4 py-2">Admin Panel</Link>
            )}
            <button onClick={logoutUser}
              className="btn-outline text-sm px-4 py-2 text-red-400 border-red-500/40 hover:bg-red-500/10 hover:text-red-300">
              Logout
            </button>
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="show" variants={stagger}>

          {/* Profile card */}
          <motion.div variants={fadeUp} className="card-dark mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gold-400">Account Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Full Name',     value: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.username },
                { label: 'Email',         value: user?.email },
                { label: 'Username',      value: `@${user?.username}` },
                { label: 'Account Type',  value: dashData?.stats?.is_staff ? 'Administrator' : 'Client' },
              ].map(f => (
                <div key={f.label} className="bg-dark-800 rounded-xl p-4">
                  <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">{f.label}</div>
                  <div className="text-white font-medium text-sm truncate">{f.value || '—'}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── My Messages / Query Status ── */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gold-400">My Queries & Status</h2>
              <span className="text-gray-500 text-xs">{messages.length} submission{messages.length !== 1 ? 's' : ''}</span>
            </div>

            {msgLoading ? (
              <div className="card-dark flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="card-dark text-center py-12">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-gray-400 text-sm mb-4">You haven't submitted any queries yet.</p>
                <Link to="/contact" className="btn-gold text-sm px-6 py-2.5 inline-block">
                  Send a Message
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(m => (
                  <motion.div key={m.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="card-dark">
                    <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                      <div className="flex gap-2 flex-wrap">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${TYPE_STYLES[m.inquiry_type] || TYPE_STYLES.general}`}>
                          {m.inquiry_type === 'consultation' ? '🎯 Consultation'
                            : m.inquiry_type === 'franchise' ? '🏢 Franchise'
                            : '💬 General'}
                        </span>
                        {m.service_interest && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-dark-600 text-gray-400 border border-dark-500">
                            {m.service_interest}
                          </span>
                        )}
                      </div>

                      {/* Status badge */}
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_STYLES[m.status]?.bg || STATUS_STYLES.new.bg}`}>
                        {STATUS_STYLES[m.status]?.label || m.status}
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-3">{m.message}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-xs">{m.created_at}</span>

                      {/* Status description */}
                      {m.status === 'new' && (
                        <span className="text-blue-400 text-xs">⏳ Your query is under review</span>
                      )}
                      {m.status === 'in_progress' && (
                        <span className="text-yellow-400 text-xs">🔄 Our team is working on it</span>
                      )}
                      {m.status === 'resolved' && (
                        <span className="text-green-400 text-xs">✅ Query resolved — check your email</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeUp} className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gold-400">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map(a => (
                <Link key={a.label} to={a.to}
                  className="card-dark flex items-center gap-4 hover:scale-[1.02] transition-transform">
                  <div className="text-3xl">{a.icon}</div>
                  <div>
                    <div className="font-semibold text-white">{a.label}</div>
                    <div className="text-gray-400 text-sm">{a.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Services overview */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gold-400">Available Services</h2>
              <Link to="/services" className="text-gold-400 hover:text-gold-300 text-sm transition-colors">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.slice(0, 6).map(s => (
                <div key={s.id} className="card-dark flex items-start gap-3">
                  <div className="w-8 h-8 bg-gold-500/10 rounded-lg flex items-center justify-center text-gold-400 flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">{s.title}</div>
                    <div className="text-gray-500 text-xs mt-1 leading-relaxed line-clamp-2">{s.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}