import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const NavLink = ({ to, children, onClick }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} onClick={onClick}
      className={`relative font-medium transition-colors duration-200 hover:text-gold-400 group
        ${active ? 'text-gold-400' : 'text-gray-300'}`}>
      {children}
      <span className={`absolute -bottom-1 left-0 h-px bg-gold-500 transition-all duration-300
        ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
    </Link>
  );
};

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    setMenuOpen(false);
  };

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about-us', label: 'About Us' },
    { to: '/services', label: 'Services' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/franchise', label: 'Franchise' },
  ];

  return (
    <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-dark-900/90 backdrop-blur-md border-b border-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gold-500 rounded-lg flex items-center justify-center">
              <span className="text-dark-900 font-bold text-sm font-display">TB</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-gold-400 font-display font-semibold text-sm leading-tight">Trust Built</div>
              <div className="text-gray-500 text-xs">PR & Digital Solutions</div>
            </div>
          </Link>

          {/* Desktop Nav — center links (no Contact here) */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)}
            {user && <NavLink to="/dashboard">Dashboard</NavLink>}
            {user?.is_staff && <NavLink to="/admin-panel">Admin</NavLink>}
          </div>

          {/* Right side — Contact + Auth */}
          <div className="hidden md:flex items-center gap-3">
            <NavLink to="/contact">Get free Consulation</NavLink>
            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <span className="text-gold-400 text-sm font-medium">
                  Hey, {user.first_name || user.username}!
                </span>
                <button onClick={handleLogout}
                  className="btn-outline text-sm px-4 py-2">Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-gold-400 transition-colors text-sm font-medium ml-2">Login</Link>
                <Link to="/register" className="btn-gold text-sm px-5 py-2">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-300 hover:text-gold-400 transition-colors p-2">
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-dark-800 border-t border-dark-600">
            <div className="px-4 py-4 space-y-3">
              {links.map(l => (
                <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                  className="block text-gray-300 hover:text-gold-400 py-2 transition-colors">{l.label}</Link>
              ))}
              <Link to="/contact" onClick={() => setMenuOpen(false)}
                className="block text-gray-300 hover:text-gold-400 py-2 transition-colors">Get free Consulation</Link>
              {user && <Link to="/dashboard" onClick={() => setMenuOpen(false)}
                className="block text-gray-300 hover:text-gold-400 py-2 transition-colors">Dashboard</Link>}
              <div className="pt-3 border-t border-dark-600 flex flex-col gap-2">
                {user ? (
                  <button onClick={handleLogout} className="btn-outline w-full">Logout</button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline text-center">Login</Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-gold text-center">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}