import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  getAdminStats, getAdminUsers, getAdminMessages, updateMessageStatus,
  adminGetServices, adminCreateService, adminUpdateService, adminDeleteService,
  adminGetTestimonials, adminCreateTestimonial, adminUpdateTestimonial, adminDeleteTestimonial,
} from '../api/auth';

const STATUS_COLORS = {
  new:         'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  in_progress: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  resolved:    'bg-green-500/20 text-green-300 border border-green-500/30',
};
const TYPE_COLORS = {
  consultation: 'bg-gold-500/20 text-gold-300 border border-gold-500/30',
  franchise:    'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  general:      'bg-gray-500/20 text-gray-300 border border-gray-500/30',
};
const ICON_OPTIONS = ['megaphone', 'share', 'target', 'palette', 'video', 'shield'];
const TABS = [
  { key: 'overview',     label: '📊 Overview' },
  { key: 'users',        label: '👥 Users' },
  { key: 'messages',     label: '✉️ Messages' },
  { key: 'services',     label: '🚀 Services' },
  { key: 'testimonials', label: '⭐ Testimonials' },
];

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-dark-700 border border-dark-500 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function ConfirmDelete({ item, onConfirm, onClose }) {
  return (
    <Modal title="Confirm Delete" onClose={onClose}>
      <p className="text-gray-400 mb-6">
        Are you sure you want to delete <span className="text-white font-semibold">"{item}"</span>? This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 btn-outline py-2.5">Cancel</button>
        <button onClick={onConfirm}
          className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 rounded-xl transition-colors">
          Delete
        </button>
      </div>
    </Modal>
  );
}

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tab,          setTab]          = useState('overview');
  const [loading,      setLoading]      = useState(true);
  const [stats,        setStats]        = useState(null);
  const [users,        setUsers]        = useState([]);
  const [messages,     setMessages]     = useState([]);
  const [msgFilter,    setMsgFilter]    = useState('all');
  const [services,     setServices]     = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedMsg,  setSelectedMsg]  = useState(null);
  const [modal,        setModal]        = useState(null);
  const [form,         setForm]         = useState({});
  const [saving,       setSaving]       = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (user && !user.is_staff) { navigate('/dashboard'); return; }
    if (user) loadAll();
  }, [user]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [sRes, uRes, mRes, svRes, tRes] = await Promise.all([
        getAdminStats(), getAdminUsers(), getAdminMessages(),
        adminGetServices(), adminGetTestimonials(),
      ]);
      setStats(sRes.data || null);
      setUsers(Array.isArray(uRes.data) ? uRes.data : []);
      setMessages(Array.isArray(mRes.data) ? mRes.data : []);
      setServices(Array.isArray(svRes.data) ? svRes.data : []);
      setTestimonials(Array.isArray(tRes.data) ? tRes.data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateMessageStatus(id, newStatus);
    setMessages(p => p.map(m => m.id === id ? { ...m, status: newStatus } : m));
    if (selectedMsg?.id === id) setSelectedMsg(p => ({ ...p, status: newStatus }));
  };

  const openServiceModal = (svc = null) => {
    setForm(svc ? { ...svc } : { title: '', description: '', icon: 'megaphone', order: 0, is_active: true });
    setModal({ type: svc ? 'editService' : 'addService', data: svc });
  };

  const saveService = async () => {
    setSaving(true);
    try {
      if (modal.data) {
        const res = await adminUpdateService(modal.data.id, form);
        setServices(p => p.map(s => s.id === modal.data.id ? res.data : s));
      } else {
        const res = await adminCreateService(form);
        setServices(p => [...p, res.data]);
      }
      setModal(null);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const deleteService = async () => {
    await adminDeleteService(deleteTarget.id);
    setServices(p => p.filter(s => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const openTestimonialModal = (t = null) => {
    setForm(t ? { ...t } : { name: '', role: '', review: '', rating: 5, is_active: true });
    setModal({ type: t ? 'editTestimonial' : 'addTestimonial', data: t });
  };

  const saveTestimonial = async () => {
    setSaving(true);
    try {
      if (modal.data) {
        const res = await adminUpdateTestimonial(modal.data.id, form);
        setTestimonials(p => p.map(t => t.id === modal.data.id ? res.data : t));
      } else {
        const res = await adminCreateTestimonial(form);
        setTestimonials(p => [...p, res.data]);
      }
      setModal(null);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const deleteTestimonial = async () => {
    await adminDeleteTestimonial(deleteTarget.id);
    setTestimonials(p => p.filter(t => t.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const safeMessages = Array.isArray(messages) ? messages : [];
  const filteredMessages = msgFilter === 'all'
    ? safeMessages
    : safeMessages.filter(m => m.inquiry_type === msgFilter);

  if (loading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gold-400 font-display">Loading Admin Panel...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-gold-400 text-xs font-semibold uppercase tracking-widest mb-1">Admin Panel</p>
            <h1 className="font-display text-3xl font-bold">
              Trust Built <span className="gold-text">Dashboard</span>
            </h1>
          </div>
          <button onClick={loadAll} className="btn-outline text-sm px-4 py-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-dark-600 pb-4">
          {TABS.map(t => (
            <button key={t.key}
              onClick={() => { setTab(t.key); setSelectedUser(null); setSelectedMsg(null); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${tab === t.key
                  ? 'bg-gold-500 text-dark-900'
                  : 'text-gray-400 hover:text-gold-400 hover:bg-dark-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ OVERVIEW ══════════════════════════════════════════════════════════ */}
        {tab === 'overview' && stats && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Registered Users',    value: stats.total_users,         icon: '👥', color: 'from-blue-900/40 to-blue-800/20',       border: 'border-blue-700/30' },
                { label: 'Free Consultations',  value: stats.consultations,        icon: '🎯', color: 'from-gold-600/10 to-dark-700',          border: 'border-gold-600/30' },
                { label: 'New Messages',        value: stats.new_messages,         icon: '🔔', color: 'from-green-900/40 to-green-800/20',     border: 'border-green-700/30' },
                { label: 'Franchise Inquiries', value: stats.franchise_inquiries,  icon: '🏢', color: 'from-purple-900/40 to-purple-800/20',   border: 'border-purple-700/30' },
                { label: 'Total Messages',      value: stats.total_messages,       icon: '✉️', color: 'from-teal-900/40 to-teal-800/20',      border: 'border-teal-700/30' },
                { label: 'General Messages',    value: stats.general_messages,     icon: '💬', color: 'from-pink-900/40 to-pink-800/20',      border: 'border-pink-700/30' },
                { label: 'Resolved',            value: stats.resolved,             icon: '✅', color: 'from-emerald-900/40 to-emerald-800/20', border: 'border-emerald-700/30' },
                { label: 'Active Services',     value: (Array.isArray(services) ? services : []).filter(s => s.is_active).length, icon: '🚀', color: 'from-orange-900/40 to-orange-800/20', border: 'border-orange-700/30' },
              ].map(s => (
                <div key={s.label} className={`bg-gradient-to-br ${s.color} border ${s.border} rounded-2xl p-5`}>
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="font-display text-3xl font-bold gold-text">{s.value}</div>
                  <div className="text-gray-400 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="card-dark">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Recent Inquiries</h3>
                <button onClick={() => setTab('messages')} className="text-gold-400 text-sm hover:text-gold-300">
                  View all →
                </button>
              </div>
              <div className="space-y-3">
                {messages.slice(0, 5).map(m => (
                  <div key={m.id} className="flex items-center gap-4 bg-dark-800 rounded-xl p-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white text-sm font-medium">{m.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[m.inquiry_type]}`}>
                          {m.inquiry_type === 'consultation' ? '🎯 Consultation' : m.inquiry_type === 'franchise' ? '🏢 Franchise' : '💬 General'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs truncate">{m.message}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[m.status]}`}>
                        {m.status.replace('_', ' ')}
                      </span>
                      <span className="text-gray-600 text-xs">{m.created_at}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ══ USERS ══════════════════════════════════════════════════════════════ */}
        {tab === 'users' && (
          <div className="grid lg:grid-cols-[1fr_1.6fr] gap-6">
            <div className="space-y-3">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">
                {users.length} Registered Users
              </p>
              {users.length === 0
                ? <div className="card-dark text-center py-12 text-gray-500">No users yet.</div>
                : users.map(u => (
                  <div key={u.id}
                    onClick={() => { setSelectedUser(u); setSelectedMsg(null); }}
                    className={`card-dark cursor-pointer hover:scale-[1.01] transition-all duration-200
                      ${selectedUser?.id === u.id ? 'border-gold-500 shadow-[0_0_20px_rgba(212,160,23,0.2)]' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center
                                      text-dark-900 font-bold font-display flex-shrink-0">
                        {(u.first_name?.[0] || u.username?.[0] || '?').toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-sm truncate">
                          {u.first_name} {u.last_name}
                        </div>
                        <div className="text-gray-400 text-xs truncate">{u.email}</div>
                        <div className="text-gray-600 text-xs">Joined {u.date_joined}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {u.message_count > 0
                          ? <span className="text-gold-400 text-xs">{u.message_count} msg{u.message_count > 1 ? 's' : ''}</span>
                          : <span className="text-gray-600 text-xs">No msgs</span>}
                        <div className={`text-xs mt-0.5 ${u.is_active ? 'text-green-400' : 'text-red-400'}`}>
                          {u.is_active ? '● Active' : '● Inactive'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>

            <AnimatePresence mode="wait">
              {selectedUser ? (
                <motion.div key={selectedUser.id}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <div className="card-dark mb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-gold-500 rounded-full flex items-center justify-center
                                      text-dark-900 font-bold font-display text-xl">
                        {(selectedUser.first_name?.[0] || selectedUser.username?.[0] || '?').toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">
                          {selectedUser.first_name} {selectedUser.last_name}
                        </h3>
                        <p className="text-gray-400 text-sm">@{selectedUser.username}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Email',    value: selectedUser.email },
                        { label: 'Joined',   value: selectedUser.date_joined },
                        { label: 'Messages', value: `${selectedUser.message_count} submitted` },
                        { label: 'Status',   value: selectedUser.is_active ? 'Active' : 'Inactive' },
                      ].map(f => (
                        <div key={f.label} className="bg-dark-800 rounded-xl p-3">
                          <div className="text-gray-500 text-xs mb-1">{f.label}</div>
                          <div className="text-white text-sm font-medium truncate">{f.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">Messages</p>
                  {selectedUser.messages.length === 0
                    ? <div className="card-dark text-center py-8 text-gray-500 text-sm">No messages from this user.</div>
                    : selectedUser.messages.map(m => (
                      <div key={m.id} className="card-dark mb-3">
                        <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                          <div className="flex gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[m.inquiry_type]}`}>
                              {m.inquiry_type === 'consultation' ? '🎯 Consultation' : m.inquiry_type === 'franchise' ? '🏢 Franchise' : '💬 General'}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[m.status]}`}>
                              {m.status.replace('_', ' ')}
                            </span>
                          </div>
                          <span className="text-gray-500 text-xs">{m.created_at}</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-3">{m.message}</p>
                        <div className="flex gap-2 flex-wrap">
                          {['new', 'in_progress', 'resolved'].map(s => (
                            <button key={s} onClick={() => handleStatusChange(m.id, s)}
                              className={`text-xs px-3 py-1 rounded-full border transition-all
                                ${m.status === s
                                  ? STATUS_COLORS[s]
                                  : 'border-dark-500 text-gray-500 hover:border-gold-600 hover:text-gold-400'}`}>
                              {s.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  }
                </motion.div>
              ) : (
                <div className="card-dark flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-5xl mb-4">👆</div>
                  <p className="text-gray-400">Click a user to see their details & messages</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ══ MESSAGES ══════════════════════════════════════════════════════════ */}
        {tab === 'messages' && (
          <div className="grid lg:grid-cols-[1fr_1.6fr] gap-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { key: 'all',          label: 'All' },
                  { key: 'consultation', label: '🎯 Consultations' },
                  { key: 'franchise',    label: '🏢 Franchise' },
                  { key: 'general',      label: '💬 General' },
                ].map(f => (
                  <button key={f.key} onClick={() => setMsgFilter(f.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                      ${msgFilter === f.key
                        ? 'bg-gold-500 text-dark-900 border-gold-500'
                        : 'border-dark-500 text-gray-400 hover:border-gold-600'}`}>
                    {f.label}
                  </button>
                ))}
              </div>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">
                {filteredMessages.length} messages
              </p>
              <div className="space-y-3">
                {filteredMessages.length === 0
                  ? <div className="card-dark text-center py-12 text-gray-500">No messages.</div>
                  : filteredMessages.map(m => (
                    <div key={m.id}
                      onClick={() => setSelectedMsg(selectedMsg?.id === m.id ? null : m)}
                      className={`card-dark cursor-pointer hover:scale-[1.01] transition-all duration-200
                        ${selectedMsg?.id === m.id ? 'border-gold-500 shadow-[0_0_15px_rgba(212,160,23,0.15)]' : ''}`}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-white font-semibold text-sm">{m.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[m.status]}`}>
                          {m.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full inline-block mb-2 ${TYPE_COLORS[m.inquiry_type]}`}>
                        {m.inquiry_type === 'consultation' ? '🎯 Consultation' : m.inquiry_type === 'franchise' ? '🏢 Franchise' : '💬 General'}
                      </span>
                      <p className="text-gray-400 text-xs line-clamp-2">{m.message}</p>
                      <p className="text-gray-600 text-xs mt-1">{m.created_at}</p>
                    </div>
                  ))
                }
              </div>
            </div>

            <AnimatePresence mode="wait">
              {selectedMsg ? (
                <motion.div key={selectedMsg.id}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}
                  className="card-dark h-fit">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-display text-xl font-bold">{selectedMsg.name}</h3>
                      <p className="text-gray-400 text-sm">{selectedMsg.email}</p>
                    </div>
                    <span className={`text-xs px-3 py-1.5 rounded-full ${STATUS_COLORS[selectedMsg.status]}`}>
                      {selectedMsg.status.replace('_', ' ')}
                    </span>
                  </div>

                  <span className={`text-xs px-3 py-1.5 rounded-full inline-block mb-4 ${TYPE_COLORS[selectedMsg.inquiry_type]}`}>
                    {selectedMsg.inquiry_type === 'consultation'
                      ? '🎯 Free Consultation Request'
                      : selectedMsg.inquiry_type === 'franchise'
                      ? '🏢 Franchise Inquiry'
                      : '💬 General Message'}
                  </span>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { label: 'Phone',    value: selectedMsg.phone || '—' },
                      { label: 'Service',  value: selectedMsg.service_interest || '—' },
                      { label: 'Received', value: selectedMsg.created_at },
                      { label: 'Email',    value: selectedMsg.email },
                    ].map(f => (
                      <div key={f.label} className="bg-dark-800 rounded-xl p-3">
                        <div className="text-gray-500 text-xs mb-1">{f.label}</div>
                        <div className="text-white text-sm font-medium break-all">{f.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-dark-800 rounded-xl p-4 mb-5">
                    <div className="text-gray-500 text-xs mb-2">Message</div>
                    <p className="text-gray-300 text-sm leading-relaxed">{selectedMsg.message}</p>
                  </div>

                  <div className="flex gap-2 mb-5">
                    <a href={`mailto:${selectedMsg.email}?subject=Re: Your Inquiry - Trust Built`}
                      className="flex-1 text-center text-xs py-2.5 bg-blue-900/30 border border-blue-700/40
                                 text-blue-300 rounded-xl hover:bg-blue-900/50 transition-colors">
                      📧 Reply via Email
                    </a>
                    <a href={`https://wa.me/${selectedMsg.phone?.replace(/\D/g, '')}?text=Hi ${selectedMsg.name}, thanks for reaching out to Trust Built!`}
                      target="_blank" rel="noreferrer"
                      className="flex-1 text-center text-xs py-2.5 bg-green-900/30 border border-green-700/40
                                 text-green-300 rounded-xl hover:bg-green-900/50 transition-colors">
                      💬 WhatsApp
                    </a>
                  </div>

                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Update Status</p>
                  <div className="flex gap-2">
                    {['new', 'in_progress', 'resolved'].map(s => (
                      <button key={s} onClick={() => handleStatusChange(selectedMsg.id, s)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all
                          ${selectedMsg.status === s
                            ? STATUS_COLORS[s]
                            : 'border-dark-500 text-gray-400 hover:border-gold-600 hover:text-gold-400'}`}>
                        {s === 'new' ? '🔵 New' : s === 'in_progress' ? '🟡 In Progress' : '🟢 Resolved'}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="card-dark flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-5xl mb-4">📨</div>
                  <p className="text-gray-400">Click a message to view full details</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ══ SERVICES ══════════════════════════════════════════════════════════ */}
        {tab === 'services' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-400">{services.length} services total</p>
              <button onClick={() => openServiceModal()}
                className="btn-gold text-sm px-5 py-2.5 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Service
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(s => (
                <div key={s.id} className="card-dark">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-dark-600 rounded-xl flex items-center justify-center
                                    text-gold-400 text-sm font-bold">
                      {s.icon?.[0]?.toUpperCase()}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border
                      ${s.is_active
                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                        : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
                      {s.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <h4 className="font-semibold text-white mb-1">{s.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">{s.description}</p>
                  <div className="flex gap-2">
                    <button onClick={() => openServiceModal(s)}
                      className="flex-1 text-xs py-2 bg-dark-600 hover:bg-dark-500 text-gold-400 rounded-lg transition-colors">
                      ✏️ Edit
                    </button>
                    <button onClick={() => setDeleteTarget({ id: s.id, name: s.title, type: 'service' })}
                      className="flex-1 text-xs py-2 bg-dark-600 hover:bg-red-900/30 text-red-400 rounded-lg transition-colors">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ TESTIMONIALS ══════════════════════════════════════════════════════ */}
        {tab === 'testimonials' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-400">{testimonials.length} testimonials total</p>
              <button onClick={() => openTestimonialModal()}
                className="btn-gold text-sm px-5 py-2.5 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Testimonial
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.map(t => (
                <div key={t.id} className="card-dark">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} className="text-gold-400">★</span>
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm italic mb-4 line-clamp-3">"{t.review}"</p>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 bg-gold-600 rounded-full flex items-center justify-center
                                    text-dark-900 font-bold text-sm">
                      {t.name?.[0]}
                    </div>
                    <div>
                      <div className="text-white text-sm font-semibold">{t.name}</div>
                      <div className="text-gray-500 text-xs">{t.role}</div>
                    </div>
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full border
                      ${t.is_active
                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                        : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
                      {t.is_active ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openTestimonialModal(t)}
                      className="flex-1 text-xs py-2 bg-dark-600 hover:bg-dark-500 text-gold-400 rounded-lg transition-colors">
                      ✏️ Edit
                    </button>
                    <button onClick={() => setDeleteTarget({ id: t.id, name: t.name, type: 'testimonial' })}
                      className="flex-1 text-xs py-2 bg-dark-600 hover:bg-red-900/30 text-red-400 rounded-lg transition-colors">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ══ MODALS ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {(modal?.type === 'addService' || modal?.type === 'editService') && (
          <Modal
            title={modal.type === 'addService' ? 'Add Service' : 'Edit Service'}
            onClose={() => setModal(null)}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Title</label>
                <input value={form.title || ''} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="input-field text-sm" placeholder="Service title" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Description</label>
                <textarea value={form.description || ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="input-field text-sm resize-none" rows={3} placeholder="Service description" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">Icon</label>
                  <select value={form.icon || 'megaphone'} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
                    className="input-field text-sm bg-dark-700">
                    {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">Order</label>
                  <input type="number" value={form.order || 0}
                    onChange={e => setForm(p => ({ ...p, order: +e.target.value }))}
                    className="input-field text-sm" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="svcActive" checked={form.is_active ?? true}
                  onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))}
                  className="w-4 h-4 accent-yellow-500" />
                <label htmlFor="svcActive" className="text-sm text-gray-300">Show on website</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 btn-outline py-2.5">Cancel</button>
                <button onClick={saveService} disabled={saving}
                  className="flex-1 btn-gold py-2.5 flex items-center justify-center gap-2">
                  {saving && <div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />}
                  {modal.type === 'addService' ? 'Add Service' : 'Save Changes'}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {(modal?.type === 'addTestimonial' || modal?.type === 'editTestimonial') && (
          <Modal
            title={modal.type === 'addTestimonial' ? 'Add Testimonial' : 'Edit Testimonial'}
            onClose={() => setModal(null)}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">Name</label>
                  <input value={form.name || ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="input-field text-sm" placeholder="Client name" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">Role</label>
                  <input value={form.role || ''} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                    className="input-field text-sm" placeholder="CEO, Startup" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Review</label>
                <textarea value={form.review || ''} onChange={e => setForm(p => ({ ...p, review: e.target.value }))}
                  className="input-field text-sm resize-none" rows={3} placeholder="Client review..." />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Rating</label>
                <select value={form.rating || 5} onChange={e => setForm(p => ({ ...p, rating: +e.target.value }))}
                  className="input-field text-sm bg-dark-700">
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} ★</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="tstActive" checked={form.is_active ?? true}
                  onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))}
                  className="w-4 h-4 accent-yellow-500" />
                <label htmlFor="tstActive" className="text-sm text-gray-300">Show on website</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 btn-outline py-2.5">Cancel</button>
                <button onClick={saveTestimonial} disabled={saving}
                  className="flex-1 btn-gold py-2.5 flex items-center justify-center gap-2">
                  {saving && <div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />}
                  {modal.type === 'addTestimonial' ? 'Add Testimonial' : 'Save Changes'}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {deleteTarget && (
          <ConfirmDelete
            item={deleteTarget.name}
            onClose={() => setDeleteTarget(null)}
            onConfirm={deleteTarget.type === 'service' ? deleteService : deleteTestimonial}
          />
        )}
      </AnimatePresence>
    </div>
  );
}