import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getDashboard, getServices } from "../api/auth";

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

export default function Dashboard() {
  const { user, logoutUser } = useAuth();
  const [dashData, setDashData] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    getDashboard()
      .then((r) => setDashData(r.data))
      .catch(() => {});
    getServices()
      .then((r) => setServices(r.data))
      .catch(() => {});
  }, []);

  const quickActions = [
    {
      label: "View Services",
      to: "/services",
      icon: "🚀",
      desc: "Explore all our offerings",
    },
    {
      label: "Contact Us",
      to: "/contact",
      icon: "💬",
      desc: "Talk to a strategist",
    },
    { label: "Go to Home", to: "/", icon: "🏠", desc: "Back to homepage" },
  ];

  return (
    <div className="min-h-screen bg-dark-900 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12"
        >
          <div>
            <p className="text-gold-400 text-sm font-medium uppercase tracking-widest mb-1">
              Dashboard
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold">
              Welcome back,{" "}
              <span className="gold-text">
                {user?.first_name || user?.username}!
              </span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Member since {dashData?.stats?.member_since || "..."}
              {dashData?.stats?.is_staff && (
                <span className="ml-2 text-gold-500 font-medium">· Admin</span>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            {dashData?.stats?.is_staff && (
              <Link to="/admin-panel" className="btn-gold text-sm px-4 py-2">
                Admin Panel
              </Link>
            )}
            <button
              onClick={logoutUser}
              className="btn-outline text-sm px-4 py-2 text-red-400 border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
            >
              Logout
            </button>
          </div>
        </motion.div>

        {/* Profile card */}
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp} className="card-dark mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gold-400">
              Account Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Full Name",
                  value:
                    `${user?.first_name || ""} ${
                      user?.last_name || ""
                    }`.trim() || user?.username,
                },
                { label: "Email", value: user?.email },
                { label: "Username", value: `@${user?.username}` },
                {
                  label: "Account Type",
                  value: dashData?.stats?.is_staff ? "Administrator" : "Client",
                },
              ].map((f) => (
                <div key={f.label} className="bg-dark-800 rounded-xl p-4">
                  <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                    {f.label}
                  </div>
                  <div className="text-white font-medium text-sm truncate">
                    {f.value || "—"}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeUp} className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gold-400">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((a) => (
                <Link
                  key={a.label}
                  to={a.to}
                  className="card-dark flex items-center gap-4 hover:scale-[1.02] transition-transform"
                >
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
              <h2 className="text-lg font-semibold text-gold-400">
                Available Services
              </h2>
              <Link
                to="/services"
                className="text-gold-400 hover:text-gold-300 text-sm transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.slice(0, 6).map((s) => (
                <div key={s.id} className="card-dark flex items-start gap-3">
                  <div className="w-8 h-8 bg-gold-500/10 rounded-lg flex items-center justify-center text-gold-400 flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">
                      {s.title}
                    </div>
                    <div className="text-gray-500 text-xs mt-1 leading-relaxed line-clamp-2">
                      {s.description}
                    </div>
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
